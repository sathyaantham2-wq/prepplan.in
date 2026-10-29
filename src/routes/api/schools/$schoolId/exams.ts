import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../db/connection'
import { wrapRouteHandlers } from '../../../../lib/error-log'
import { requireSchoolRole } from '../../../../lib/school-session'
import { SchoolError } from '../../../../lib/schools/common'
import { createExam, listExams } from '../../../../lib/schools/exam-service'
import { readJson, str } from '../../../../lib/schools/http'

// Exams of the school (one question paper per class and exam). Staff only: students and parents are
// not admitted. POST makes the paper: { title, subject_id, template_key, chapter_ids, section_ids, exam_date? }.
export const Route = createFileRoute('/api/schools/$schoolId/exams')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const scope = await requireSchoolRole(
          request,
          params.schoolId,
          'school_admin',
          'teacher',
          'principal',
        )
        if (scope instanceof Response) return scope
        return Response.json(
          { exams: await listExams(getSharedDb(), scope) },
          { headers: { 'cache-control': 'no-store' } },
        )
      },
      POST: async ({ request, params }) => {
        const scope = await requireSchoolRole(
          request,
          params.schoolId,
          'school_admin',
          'teacher',
        )
        if (scope instanceof Response) return scope
        const b = await readJson(request)
        const strings = (v: unknown) =>
          Array.isArray(v)
            ? v.filter((x): x is string => typeof x === 'string')
            : []
        const title = str(b?.title)
        const subjectId = str(b?.subject_id)
        const templateKey = str(b?.template_key)
        if (!title || !subjectId || !templateKey)
          return Response.json(
            {
              error: 'invalid',
              message: 'Give the exam a name, a subject and a layout.',
            },
            { status: 400 },
          )
        try {
          return Response.json(
            await createExam(getSharedDb(), scope, {
              title,
              subjectId,
              templateKey,
              chapterIds: strings(b?.chapter_ids),
              sectionIds: strings(b?.section_ids),
              examDate: str(b?.exam_date),
            }),
          )
        } catch (e) {
          if (e instanceof SchoolError) return e.toResponse()
          throw e
        }
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/schools/$schoolId/exams', ['GET', 'POST'])
