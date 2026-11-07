// Quality loop phase 1b (docs/QUALITY_LOOP_PLAN.md): after a wrong answer key is fixed, re-score every confirmed
// objective mark that was scored against it.
//
// Rules:
//  - Only the LATEST evaluation of an attempt counts (evaluations are append-only; older ones are history).
//  - Only a PrepPlan student's mark is changed. A school student's marks belong to her school, which decides
//    what to do with them (CLAUDE.md, school module rules); they are counted and reported, never touched.
//  - The old mark is never overwritten without a trace: each change writes a `mark_corrections` row (old and new
//    side by side, unique per case x mark) and the caller writes the audit_log entry.
//  - A mark that does not change (a wrong answer that stays wrong) writes nothing.
//  - Totals, grade, the adaptive answer log and the concept status are rebuilt from the corrected marks; the older
//    concept ledger is append-only, so one corrective row is appended per affected concept and evaluation.
//  - Points and Fix-it cards already awarded are left as they are (small, and taking them back would punish a child
//    for our mistake).

import type { Db } from '../../db/connection'
import { recomputeConcept, loadMasteryConfig } from '../adaptive/service'
import { gradeFromPercentage } from '../evaluation'
import { recordMasteryAttempt } from '../mastery'
import { scoreObjectiveAnswer, isObjectiveType } from '../scoring'

export interface RemarkSummary {
  // confirmed marks of PrepPlan students that used the old question
  examined: number
  // marks whose value actually changed
  changed: number
  raised: number
  lowered: number
  studentsAffected: number
  // marks of school students, left for their school
  schoolMarksSkipped: number
}

export async function remarkAfterKeyFix(
  db: Db,
  input: { caseId: string; oldQuestionId: string; newQuestionId: string },
): Promise<RemarkSummary> {
  const summary: RemarkSummary = { examined: 0, changed: 0, raised: 0, lowered: 0, studentsAffected: 0, schoolMarksSkipped: 0 }

  const newQuestion = await db.selectFrom('questions').selectAll().where('id', '=', input.newQuestionId).executeTakeFirstOrThrow()
  if (!isObjectiveType(newQuestion.type)) return summary
  const newKey = await db
    .selectFrom('question_options')
    .select('label')
    .where('question_id', '=', input.newQuestionId)
    .where('is_correct', '=', true)
    .orderBy('order_index')
    .executeTakeFirst()

  const rows = await db
    .selectFrom('evaluation_items as ei')
    .innerJoin('evaluations as e', 'e.id', 'ei.evaluation_id')
    .innerJoin('attempts as a', 'a.id', 'e.attempt_id')
    .innerJoin('students as s', 's.id', 'a.student_id')
    .innerJoin('paper_questions as pq', 'pq.id', 'ei.paper_question_id')
    .leftJoin('attempt_answers as aa', (join) =>
      join.onRef('aa.attempt_id', '=', 'a.id').onRef('aa.paper_question_id', '=', 'pq.id'),
    )
    .select([
      'ei.id as item_id',
      'ei.marks_awarded',
      'ei.marks_max',
      'ei.error_type',
      'e.id as evaluation_id',
      'a.id as attempt_id',
      'a.student_id',
      's.school_id',
      'pq.id as paper_question_id',
      'pq.marks as slot_marks',
      'aa.selected_option',
      'aa.response_text',
    ])
    .where('pq.question_id', '=', input.oldQuestionId)
    .where('e.confirmed_at', 'is not', null)
    .where('ei.excluded_by_student', '=', false)
    .where('e.id', '=', (eb) =>
      eb
        .selectFrom('evaluations as e2')
        .select('e2.id')
        .whereRef('e2.attempt_id', '=', 'a.id')
        .orderBy('e2.created_at', 'desc')
        .limit(1),
    )
    .execute()

  const touchedEvaluations = new Set<string>()
  const touchedStudents = new Set<string>()
  const evaluationStudent = new Map<string, string>()

  for (const row of rows) {
    if (row.school_id) {
      summary.schoolMarksSkipped += 1
      continue
    }
    summary.examined += 1
    const rescored = scoreObjectiveAnswer({
      type: newQuestion.type,
      marksMax: Number(row.marks_max),
      correctOptionLabel: newKey?.label,
      correctAnswerText: newQuestion.answer,
      selectedOption: row.selected_option,
      responseText: row.response_text,
      isReversalWord: newQuestion.is_reversal_word,
    })
    const oldMarks = Number(row.marks_awarded)
    if (rescored.marksAwarded === oldMarks) continue

    const inserted = await db
      .insertInto('mark_corrections')
      .values({
        quality_case_id: input.caseId,
        evaluation_item_id: row.item_id,
        evaluation_id: row.evaluation_id,
        student_id: row.student_id,
        old_question_id: input.oldQuestionId,
        new_question_id: input.newQuestionId,
        old_marks: oldMarks,
        new_marks: rescored.marksAwarded,
        marks_max: Number(row.marks_max),
        old_error_type: row.error_type,
        new_error_type: rescored.errorType,
      })
      .onConflict((oc) => oc.columns(['quality_case_id', 'evaluation_item_id']).doNothing())
      .returning('id')
      .executeTakeFirst()
    if (!inserted) continue

    await db
      .updateTable('evaluation_items')
      .set({ marks_awarded: rescored.marksAwarded, error_type: rescored.errorType })
      .where('id', '=', row.item_id)
      .execute()

    summary.changed += 1
    if (rescored.marksAwarded > oldMarks) summary.raised += 1
    else summary.lowered += 1
    touchedEvaluations.add(row.evaluation_id)
    touchedStudents.add(row.student_id)
    evaluationStudent.set(row.evaluation_id, row.student_id)
  }
  summary.studentsAffected = touchedStudents.size

  const config = touchedEvaluations.size > 0 ? await loadMasteryConfig(db) : null
  const today = new Date().toISOString().slice(0, 10)

  for (const evaluationId of touchedEvaluations) {
    const studentId = evaluationStudent.get(evaluationId) as string
    const evaluation = await db.selectFrom('evaluations').selectAll().where('id', '=', evaluationId).executeTakeFirstOrThrow()
    const items = await db
      .selectFrom('evaluation_items as ei')
      .innerJoin('paper_questions as pq', 'pq.id', 'ei.paper_question_id')
      .innerJoin('questions as q', 'q.id', 'pq.question_id')
      .select([
        'ei.id',
        'ei.marks_awarded',
        'ei.marks_max',
        'ei.knowledge_known',
        'ei.excluded_by_student',
        'ei.error_type',
        'pq.id as paper_question_id',
        'q.concept_id',
      ])
      .where('ei.evaluation_id', '=', evaluationId)
      .execute()

    // the same arithmetic as confirmEvaluation: a question the student removed stays out of her grade
    const kept = items.filter((i) => !i.excluded_by_student)
    const actualScore = kept.reduce((sum, i) => sum + Number(i.marks_awarded), 0)
    const totalMarks = Number(evaluation.total_marks)
    const knowledgeCredit = kept.reduce((sum, i) => {
      const lost = Number(i.marks_max) - Number(i.marks_awarded)
      return i.knowledge_known === true && lost > 0 ? sum + lost : sum
    }, 0)
    const percentage = totalMarks > 0 ? Math.round((actualScore / totalMarks) * 1000) / 10 : 0
    await db
      .updateTable('evaluations')
      .set({
        actual_score: actualScore,
        knowledge_score: actualScore + knowledgeCredit,
        delivery_gap: knowledgeCredit,
        percentage,
        grade: gradeFromPercentage(percentage),
      })
      .where('id', '=', evaluationId)
      .execute()

    // the adaptive answer log is derived data: rewrite the changed rows' credit, then rebuild each concept
    const corrected = await db
      .selectFrom('mark_corrections')
      .select(['evaluation_item_id', 'new_marks', 'marks_max'])
      .where('quality_case_id', '=', input.caseId)
      .where('evaluation_id', '=', evaluationId)
      .execute()
    const correctedByItem = new Map(corrected.map((c) => [c.evaluation_item_id, c]))
    const conceptIds = new Set<string>()
    for (const item of kept) {
      const c = correctedByItem.get(item.id)
      if (!c) continue
      conceptIds.add(item.concept_id)
      const max = Number(c.marks_max)
      await db
        .updateTable('concept_answer_log')
        .set({
          marks_awarded: Number(c.new_marks),
          credit: Math.min(1, Math.max(0, max > 0 ? Number(c.new_marks) / max : 0)),
          // the student's result page reads the correct answer through this id, so it must be the corrected copy
          question_id: input.newQuestionId,
        })
        .where('evaluation_id', '=', evaluationId)
        .where('paper_question_id', '=', item.paper_question_id)
        .execute()
    }
    for (const conceptId of conceptIds) {
      if (config) await recomputeConcept(db, studentId, conceptId, null, config)
      // the older concept ledger only ever grows: append the corrected result of this paper for the concept
      const inConcept = kept.filter((i) => i.concept_id === conceptId)
      await recordMasteryAttempt(db, {
        student_id: studentId,
        concept_id: conceptId,
        evaluation_id: evaluationId,
        date: today,
        marks: inConcept.reduce((sum, i) => sum + Number(i.marks_awarded), 0),
        marks_max: inConcept.reduce((sum, i) => sum + Number(i.marks_max), 0),
      })
    }
  }

  return summary
}
