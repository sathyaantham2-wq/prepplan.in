import type { Db } from '../../db/connection'
import {
  chaptersRepository,
  paperQuestionsRepository,
  questionOptionsRepository,
  questionStepMarksRepository,
} from '../../db/repositories'
import { markSplit } from '../school-paper'
import { isObjectiveType } from '../scoring'
import { buildPaperHtml } from './paper-template'
import type { PaperTheme } from './themes'

/**
 * Loads everything the student paper PDF needs and returns a function that builds its HTML (the
 * page count is passed in because a School Half-Yearly paper prints it). Shared by
 * GET /api/papers/:id/pdf and the sample-paper script so both render exactly the same document.
 * Never reads an answer or is_correct into the paper HTML (CLAUDE.md: no key for a student).
 */
export async function preparePaperHtml(
  db: Db,
  input: {
    paper: {
      id: string
      title: string
      duration_min: number
      total_marks: number
      chapter_ids: Array<string>
      subject_id: string
      shortfalls: unknown
      weighting: unknown
    }
    student: { name: string; board: string; class: number }
    theme: PaperTheme
  },
) {
  const { paper, student, theme } = input
  const [slots, chapters] = await Promise.all([
    paperQuestionsRepository.listForPaperWithQuestions(db, paper.id),
    chaptersRepository.listByIds(db, paper.chapter_ids),
  ])
  const conceptRows = await db
    .selectFrom('concepts')
    .select(['id', 'name'])
    .where('id', 'in', [...new Set(slots.map((s) => s.concept_id))])
    .execute()
  const conceptName = new Map(conceptRows.map((c) => [c.id, c.name]))

  const optionsByQuestion = new Map(
    await Promise.all(
      slots.map(
        async (s) =>
          [
            s.question_id,
            await questionOptionsRepository.listByQuestion(
              db,
              s.question_id,
            ),
          ] as const,
      ),
    ),
  )

  const shortfalls = paper.shortfalls
    ? (paper.shortfalls as Array<{ section: string; reason: string; slot?: string }>)
    : []

  // School Half-Yearly: everything the layout needs was snapshotted on the paper at
  // generation (weighting.half_yearly), so an old paper prints as it was generated.
  const hyMeta = (paper.weighting as { half_yearly?: {
    draft_note: string | null
    section_totals: Record<string, number>
    section_order: Array<string>
    instructions: Array<string>
  } } | null)?.half_yearly
  const subject = hyMeta
    ? await db.selectFrom('subjects').select('name').where('id', '=', paper.subject_id).executeTakeFirst()
    : undefined
  const splitByQuestion = new Map<string, string>()
  if (hyMeta) {
    for (const s of slots) {
      if (isObjectiveType(s.type)) continue
      const steps = await questionStepMarksRepository.listByQuestion(db, s.question_id)
      splitByQuestion.set(s.question_id, markSplit(steps.map((st) => st.marks)))
    }
  }

  const buildHtml = (pageCount?: number) => buildPaperHtml({
    title: paper.title,
    studentName: student.name,
    board: student.board,
    class: student.class,
    durationMin: paper.duration_min,
    totalMarks: paper.total_marks,
    chapters: chapters.map((c) => ({
      part: c.part,
      chapter_no: c.chapter_no,
      name: c.name,
    })),
    questions: slots.map((s) => ({
      id: s.id,
      section: s.section,
      position: s.position,
      marks: s.marks,
      bloom: s.bloom,
      difficulty: s.difficulty,
      type: s.type,
      text: s.text,
      diagram_kind: s.diagram_kind,
      diagram_params: s.diagram_params,
      concept_name: conceptName.get(s.concept_id) ?? null,
      choice_group: s.choice_group,
      slot: s.slot,
      mark_split: splitByQuestion.get(s.question_id),
      options: (optionsByQuestion.get(s.question_id) ?? []).map((o) => ({
        label: o.label,
        text: o.text,
        order_index: o.order_index,
      })),
    })),
    shortfalls,
    theme,
    halfYearly: hyMeta
      ? {
          subjectName: subject?.name ?? '',
          instructions: hyMeta.instructions,
          sectionOrder: hyMeta.section_order,
          sectionTotals: hyMeta.section_totals,
          nominalMarks: Object.values(hyMeta.section_totals).reduce((n, m) => n + m, 0),
          pageCount,
          draftNote: hyMeta.draft_note,
        }
      : undefined,
  })

  return { slots, optionsByQuestion, hyMeta, buildHtml }
}
