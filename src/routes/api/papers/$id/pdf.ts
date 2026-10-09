import { createFileRoute } from '@tanstack/react-router'
import { requireRole } from '../../../../lib/session'
import { resolveEnabledStudent } from '../../../../lib/access'
import { getSharedDb } from '../../../../db/connection'
import {
  papersRepository,
  studentsRepository,
  questionStepMarksRepository,
} from '../../../../db/repositories'
import { renderHtmlToPdf } from '../../../../lib/pdf/render'
import { renderWithPageCount } from '../../../../lib/pdf/page-count'
import { preparePaperHtml } from '../../../../lib/pdf/prepare-paper'
import { buildAnswerKeyHtml } from '../../../../lib/pdf/key-template'
import { computeCoverageTable } from '../../../../lib/pdf/coverage'
import { extractStyleAndBody } from '../../../../lib/pdf/html-utils'
import { DEFAULT_THEME, isKnownTheme } from '../../../../lib/pdf/themes'
import { logProductEvent } from '../../../../lib/product-events'
import { wrapRouteHandlers } from '../../../../lib/error-log'
import { pdfFileName } from '../../../../lib/pdf/file-name'

// tab05: GET /api/papers/:id/pdf, Parent, query (theme, include_key) -> application/pdf stream.
//
// F130 student access (2026-09-30, owner request): a student may download the question paper itself
// as a PDF -- only a paper generated for *her* (another student's paper in the same household is
// a 404, same as a paper that doesn't exist), and never with the key: include_key from a student
// session is refused with 403 rather than silently ignored. The paper template only ever receives
// question text and option labels/text (never `answer` or `is_correct`), so the plain paper
// carries nothing the "a student can never download an answer key" rule forbids.
export const Route = createFileRoute('/api/papers/$id/pdf')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const auth = await requireRole(
          request,
          'parent',
          'teacher',
          'admin',
          'student',
        )
        if (auth instanceof Response) return auth

        const url = new URL(request.url)
        const includeKey = url.searchParams.get('include_key') === 'true'
        if (auth.role === 'student' && includeKey) {
          return new Response(null, { status: 403 })
        }

        const db = getSharedDb()
        const paper = await papersRepository.findByIdForHousehold(
          db,
          auth.householdId,
          params.id,
        )
        if (!paper) return new Response(null, { status: 404 })
        if (auth.role === 'student') {
          const self = await resolveEnabledStudent(db, auth.id)
          if (self instanceof Response) return self
          if (paper.student_id !== self.id) {
            return new Response(null, { status: 404 })
          }
        }

        // F034/F120: the ?theme= query param can re-print the same paper in a different visual
        // style (a pure rendering choice, so it's safe to override after generation); an
        // unknown, retired (e.g. F034's old 'Plain' name), or absent value falls back to
        // whatever was selected at generation time (papers.theme), and finally to
        // DEFAULT_THEME -- never a 400 for a bad/missing theme, since a wrong theme is a
        // cosmetic miss, not a reason to refuse the PDF outright.
        const requestedTheme = url.searchParams.get('theme')
        const theme = isKnownTheme(requestedTheme)
          ? requestedTheme
          : isKnownTheme(paper.theme)
            ? paper.theme
            : DEFAULT_THEME

        const student = await studentsRepository.findById(db, auth.householdId, paper.student_id)
        if (!student) return new Response(null, { status: 404 })
        const { slots, optionsByQuestion, hyMeta, buildHtml } = await preparePaperHtml(db, {
          paper,
          student,
          theme,
        })

        // A half-yearly paper prints its own page count, so it is rendered until the number in
        // the header equals the pages produced; any other paper renders once, as before.
        const counted = hyMeta ? await renderWithPageCount(buildHtml) : null
        const paperHtml = buildHtml(counted?.pages)

        let finalHtml = paperHtml

        if (includeKey) {
          const stepMarksByQuestion = new Map(
            await Promise.all(
              slots.map(
                async (s) =>
                  [
                    s.question_id,
                    await questionStepMarksRepository.listByQuestion(
                      db,
                      s.question_id,
                    ),
                  ] as const,
              ),
            ),
          )
          const coverage = await computeCoverageTable(db, paper.id)

          const keyHtml = buildAnswerKeyHtml({
            title: paper.title,
            questions: slots.map((s) => {
              const options = optionsByQuestion.get(s.question_id) ?? []
              const correctOption = options.find((o) => o.is_correct)
              return {
                position: s.position,
                section: s.section,
                marks: s.marks,
                type: s.type,
                text: s.text,
                answer: s.answer,
                diagram_kind: s.diagram_kind,
                diagram_params: s.diagram_params,
                choice_group: s.choice_group,
                correctOptionLabel: correctOption?.label ?? null,
                stepMarks: (stepMarksByQuestion.get(s.question_id) ?? []).map(
                  (sm) => ({
                    step_no: sm.step_no,
                    description: sm.description,
                    marks: sm.marks,
                  }),
                ),
              }
            }),
            coverage,
            theme,
          })

          // Combined into one document (this route only ever returns one PDF stream, per
          // tab05's contract) but the key content is appended as a distinct trailing section
          // behind its own page break, never interleaved with the paper's own questions -- and
          // this whole branch is unreachable without a parent/admin session, so a student-facing
          // request (the only kind that matters for "never see an answer key") never sees it.
          const paperParts = extractStyleAndBody(paperHtml)
          const keyParts = extractStyleAndBody(keyHtml)
          finalHtml = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>${paperParts.style}\n${keyParts.style}</style>
</head>
<body>
${paperParts.body}
<div style="page-break-before: always;"></div>
${keyParts.body}
</body>
</html>`
        }

        const pdf = includeKey || !counted ? await renderHtmlToPdf(finalHtml) : counted.pdf

        await logProductEvent(db, {
          eventType: 'paper_downloaded',
          householdId: auth.householdId,
          studentId: paper.student_id,
        })

        // ?download=1 saves the file under a readable name (the student's "Download this paper
        // as PDF" button); without it the PDF still opens inline, as the parent's link expects.
        const download = url.searchParams.get('download') === '1'
        const fileName = pdfFileName(paper.title)
        return new Response(new Uint8Array(pdf), {
          headers: {
            'content-type': 'application/pdf',
            'content-disposition': download
              ? `attachment; filename="${fileName}.pdf"`
              : `inline; filename="${paper.id}.pdf"`,
          },
        })
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/papers/$id/pdf', ['GET'])
