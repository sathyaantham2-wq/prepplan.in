import { randomUUID } from 'node:crypto'
import type { Db } from '../../db/connection'
import { auditLogRepository, paperQuestionsRepository } from '../../db/repositories'
import { captureError, describeError } from '../error-log'
import { confirmEvaluation, createEvaluation } from '../evaluation'
import { isObjectiveType } from '../scoring'

export interface AutoConfirmOutcome {
  // Set when the marks were confirmed straight away (a paper of multiple-choice questions only).
  evaluationId: string | null
  // True when written answers were marked by the AI and now wait for the student to look them
  // over, question a mark, and accept (see answer-review.ts).
  reviewPending: boolean
}

const NOTHING: AutoConfirmOutcome = { evaluationId: null, reviewPending: false }

export const AI_UNSURE_FEEDBACK =
  'The AI could not mark this answer with confidence, so it shows 0 for now. If you think it deserves marks, press "I disagree with this mark" and the AI will read it again.'

/**
 * A written answer the AI could not mark with confidence used to hold the whole paper for a parent.
 * New accounts are students only (2026-10-02), so for a student whose household has no parent
 * account nobody could ever check it and she saw only "Submitted ... waiting for a check", with no
 * paper, no answers and no explanations (reported 2026-10-16). For such a student the unmarked
 * written answers are shown as 0 with a plain note and the paper goes to her own review: she can
 * question up to five marks and the AI re-reads each once (it may only keep or raise a mark), so
 * nothing is final until she accepts. A student who HAS a parent keeps the old wait-for-a-parent
 * path. Returns true when it changed anything.
 */
export async function releaseUnmarkedToStudent(
  db: Db,
  evaluationId: string,
  studentId: string,
): Promise<boolean> {
  const student = await db
    .selectFrom('students')
    .select('household_id')
    .where('id', '=', studentId)
    .executeTakeFirst()
  if (!student) return false
  const parent = await db
    .selectFrom('users')
    .select('id')
    .where('household_id', '=', student.household_id)
    .where('role', '=', 'parent')
    .executeTakeFirst()
  if (parent) return false

  const unmarked = await db
    .selectFrom('evaluation_items as ei')
    .innerJoin('paper_questions as pq', 'pq.id', 'ei.paper_question_id')
    .innerJoin('questions as q', 'q.id', 'pq.question_id')
    .select(['ei.id', 'q.type'])
    .where('ei.evaluation_id', '=', evaluationId)
    .where('ei.ai_marks', 'is', null)
    .execute()
  const ids = unmarked.filter((r) => !isObjectiveType(r.type)).map((r) => r.id)
  if (ids.length === 0) return false
  await db
    .updateTable('evaluation_items')
    .set({ marks_awarded: 0, ai_marks: 0, feedback: AI_UNSURE_FEEDBACK })
    .where('id', 'in', ids)
    .execute()
  return true
}

/**
 * Marks a submitted paper with no parent involved. Since 2026-10-02 (user decision: parents no
 * longer have to confirm marks, and new accounts are students only) this covers EVERY paper a
 * student submits, not just adaptive practice papers.
 *
 * Multiple-choice only: marks come from the answer key and are confirmed at once.
 * With written answers: the AI proposes marks (generously) and the paper is left for the student,
 * who may question up to five marks, remove a question she still disputes, and then accept.
 * If the AI cannot mark ANY written answer with confidence, nothing is proposed and the paper
 * waits for a parent the usual way, so the system never invents a mark it has no basis for.
 * Never throws.
 */
export async function autoConfirmAttempt(
  db: Db,
  attempt: { id: string; paper_id: string; student_id: string },
): Promise<AutoConfirmOutcome> {
  try {
    const slots = await paperQuestionsRepository.listForPaperWithQuestions(db, attempt.paper_id)
    if (slots.length === 0) return NOTHING

    const existing = await db
      .selectFrom('evaluations')
      .select('id')
      .where('attempt_id', '=', attempt.id)
      .executeTakeFirst()
    if (existing) return NOTHING

    const { evaluation, items } = await createEvaluation(db, attempt.id)

    const written = new Set(slots.filter((s) => !isObjectiveType(s.type)).map((s) => s.id))
    if (written.size > 0) {
      const needsHuman = items.some((i) => written.has(i.paper_question_id) && i.ai_marks === null)
      if (needsHuman && (await releaseUnmarkedToStudent(db, evaluation.id, attempt.student_id))) {
        return { evaluationId: null, reviewPending: true }
      }
      return needsHuman ? NOTHING : { evaluationId: null, reviewPending: true }
    }

    const confirmed = await confirmEvaluation(db, evaluation.id)
    const student = await db
      .selectFrom('students')
      .select('household_id')
      .where('id', '=', attempt.student_id)
      .executeTakeFirstOrThrow()
    await auditLogRepository.insert(db, {
      household_id: student.household_id,
      actor_user_id: null,
      action: 'evaluation.auto_confirmed',
      entity: 'evaluations',
      entity_id: evaluation.id,
      before: null,
      after: JSON.stringify(confirmed),
    })
    return { evaluationId: evaluation.id, reviewPending: false }
  } catch (error) {
    const { message, stack } = describeError(error)
    await captureError({
      requestId: randomUUID(),
      source: 'server',
      route: 'attempt-submit:auto-confirm',
      message,
      stack,
    })
    return NOTHING
  }
}
