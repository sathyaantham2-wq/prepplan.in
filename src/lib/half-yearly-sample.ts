import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { createDb } from '../db/connection'
import { householdsRepository, studentsRepository } from '../db/repositories'
import { generatePaper } from './papers'
import { preparePaperHtml } from './pdf/prepare-paper'
import { renderWithPageCount } from './pdf/page-count'

/**
 * Generates one School Half-Yearly sample paper on the LOCAL test database and renders it to PDF
 * through the same code the PDF route uses. Run through vitest (the PDF code imports a font with
 * a Vite-only `?inline` suffix, which plain Node cannot load):
 *
 *   HY_SAMPLE='{"subject":"SST","class":7,"chapters":["gees101"],"out":"sample-papers/x.pdf"}' \
 *     npx vitest run src/lib/half-yearly-sample.integration.test.ts
 *
 * `chapters` are NCERT source codes. Refuses a non-local database.
 */
export async function generateHalfYearlySample(opts: {
  subject: string
  class: number
  chapters: Array<string>
  out: string
  delivery?: 'screen' | 'print'
}) {
  const host = new URL(process.env.DATABASE_URL ?? 'x://').hostname
  if (!['localhost', '127.0.0.1', '::1'].includes(host)) throw new Error(`non-local database host "${host}"`)
  const code = opts.subject
  const klass = opts.class
  const out = opts.out
  const sourceCodes = opts.chapters

  const db = createDb()
  try {
    const subject = await db.selectFrom('subjects').selectAll().where('code', '=', code).where('class', '=', klass).executeTakeFirstOrThrow()
    const blueprint = (await db.selectFrom('blueprints').selectAll().where('subject_id', '=', subject.id).execute()).find((b) => b.name.startsWith('School Half-Yearly'))
    if (!blueprint) throw new Error('no School Half-Yearly blueprint for this subject; run seed-school-half-yearly.ts first')

    const chapterIds: Array<string> = []
    for (const sc of sourceCodes) {
      const hit = await db.selectFrom('questions').innerJoin('concepts', 'concepts.id', 'questions.concept_id').select('concepts.chapter_id').where('questions.source_ref', '=', sc).limit(1).executeTakeFirstOrThrow()
      chapterIds.push(hit.chapter_id)
    }

    const household = await householdsRepository.insert(db, { name: `Sample household ${code}${klass}`, plan: 'free' })
    const student = await studentsRepository.insert(db, {
      household_id: household.id, name: 'Sample Student', class: klass, board: 'CBSE', target_exams: JSON.stringify([]),
    })

    const result = await generatePaper(db, {
      student_id: student.id, blueprint_id: blueprint.id, chapter_ids: chapterIds, delivery: opts.delivery ?? 'screen',
    })
    const paper = result.paper
    const { buildHtml } = await preparePaperHtml(db, { paper, student, theme: 'Clean School' })
    const { pdf, pages } = await renderWithPageCount(buildHtml)
    mkdirSync(dirname(out), { recursive: true })
    writeFileSync(out, pdf)
    writeFileSync(`${out}.html`, buildHtml(pages))

    const questions = result.paperQuestions
    return {
      pdf: out, pages, paper_id: paper.id, total_marks_printed: paper.total_marks,
      questions_printed: new Set(questions.map((q) => q.position)).size,
      or_pairs: new Set(result.paperQuestions.filter((q) => q.choice_group).map((q) => q.choice_group)).size,
      weighting_half_yearly: (paper.weighting as { half_yearly?: unknown }).half_yearly,
      shortfalls: result.shortfalls,
    }
  } finally {
    await db.destroy()
  }
}
