import type { Db } from '../../db/connection'
import {
  schoolOwnPapersRepository,
  schoolOwnQuestionsRepository,
  schoolSubjectsRepository,
} from '../../db/repositories'
import type { SchoolScope } from '../../db/school-scope'
import { SchoolError, auditSchool } from './common'
import { listExams, loadExam } from './exam-service'
import { requireSchoolTerms } from './terms'

// AI correction without making a paper here first (owner direction 2026-10-30, SCHOOLS_MODULE_PLAN.md
// section 12.3). A paper to correct is always a school_own_papers record: one the school uploaded (read by
// the own-paper reader), or one made here, taken over by ownPaperFromExam below. Either way nothing is
// marked until a teacher has approved the paper and every answer (assertPaperReadyForMarking).

/**
 * A paper made here, taken into AI correction. The questions are copied exactly as printed (sections,
 * OR choices, options, chapters); each answer is the bank's reviewed answer and step marks, brought in
 * as a draft for a teacher to approve. Taking the same exam twice returns the same record.
 */
export async function ownPaperFromExam(
  db: Db,
  scope: SchoolScope,
  examId: string,
): Promise<{ paperId: string; existed: boolean }> {
  if (scope.role !== 'school_admin' && scope.role !== 'teacher')
    throw new SchoolError(
      'forbidden',
      'Only the school office and teachers can start AI correction.',
    )
  await requireSchoolTerms(db, scope)
  const { exam } = await loadExam(db, scope, examId, 'handle')
  const already = (await schoolOwnPapersRepository.list(db, scope)).find(
    (p) =>
      p.exam_id === examId &&
      p.source_kind === 'prepplan_exam' &&
      p.archived_at === null,
  )
  if (already) return { paperId: already.id, existed: true }
  const ss = (await schoolSubjectsRepository.list(db, scope)).find(
    (s) => s.class_id === exam.class_id && s.subject_id === exam.subject_id,
  )
  if (!ss)
    throw new SchoolError(
      'not_found',
      'That subject is no longer taught in this class.',
    )

  const rows = await db
    .selectFrom('school_exam_questions as eq')
    .innerJoin('questions as q', 'q.id', 'eq.question_id')
    .select([
      'eq.id as eqId',
      'eq.position',
      'eq.section',
      'eq.marks',
      'eq.choice_group',
      'eq.is_alternate',
      'eq.chapter_id',
      'q.id as questionId',
      'q.text',
      'q.answer',
      'q.type',
    ])
    .where('eq.school_id', '=', scope.schoolId)
    .where('eq.exam_id', '=', examId)
    .orderBy('eq.position')
    .orderBy('eq.is_alternate')
    .execute()
  if (rows.length === 0)
    throw new SchoolError('conflict', 'This exam has no questions.')
  const qids = [...new Set(rows.map((r) => r.questionId))]
  const options = await db
    .selectFrom('question_options')
    .select(['question_id', 'label', 'text', 'is_correct', 'order_index'])
    .where('question_id', 'in', qids)
    .execute()
  const steps = await db
    .selectFrom('question_step_marks')
    .select(['question_id', 'step_no', 'description', 'marks'])
    .where('question_id', 'in', qids)
    .execute()

  return db.transaction().execute(async (trx) => {
    const paper = await schoolOwnPapersRepository.insert(trx, scope, {
      class_id: exam.class_id,
      school_subject_id: ss.id,
      title: exam.title,
      source_kind: 'prepplan_exam',
      status: 'needs_review',
      phase: 'done',
      exam_id: examId,
      total_marks: String(exam.printed_marks),
      created_by_user_id: scope.userId,
    })
    for (const [i, r] of rows.entries()) {
      const opts = options
        .filter((o) => o.question_id === r.questionId)
        .sort((a, b) => a.order_index - b.order_index)
      const correct = opts.find((o) => o.is_correct)
      await schoolOwnQuestionsRepository.insert(trx, scope, {
        paper_id: paper.id,
        position: i + 1,
        section: r.section,
        type: r.type,
        text: r.text,
        original_text: r.text,
        options: JSON.stringify(
          opts.map((o) => ({ label: o.label, text: o.text })),
        ),
        marks: String(r.marks),
        or_group: r.choice_group,
        chapter_id: r.chapter_id,
        map_confidence: '1',
        source_exam_question_id: r.eqId,
        changed_from_source: false,
        key_text: correct
          ? `Correct option: (${correct.label}) ${correct.text}`
          : r.answer,
        key_steps: JSON.stringify(
          steps
            .filter((s) => s.question_id === r.questionId)
            .sort((a, b) => a.step_no - b.step_no)
            .map((s) => ({
              description: s.description,
              marks: Number(s.marks),
            })),
        ),
        key_source: 'bank',
        // the bank's answer is a starting point: a teacher approves it before anything is marked
        key_status: 'draft',
      })
    }
    await auditSchool(
      trx,
      scope,
      'school.correction_from_exam',
      'school_own_papers',
      paper.id,
      null,
      { exam_id: examId, questions: rows.length },
    )
    return { paperId: paper.id, existed: false }
  })
}

/** The exams made here that this person may take into AI correction, newest first. */
export async function examsForCorrection(db: Db, scope: SchoolScope) {
  const exams = await listExams(db, scope)
  const taken = new Map(
    (await schoolOwnPapersRepository.list(db, scope))
      .filter(
        (p) =>
          p.source_kind === 'prepplan_exam' &&
          p.exam_id !== null &&
          p.archived_at === null,
      )
      .map((p) => [p.exam_id as string, p.id]),
  )
  return exams.map((e) => ({
    id: e.id,
    title: e.title,
    className: e.className,
    printedMarks: e.printedMarks,
    paperId: taken.get(e.id) ?? null,
  }))
}
