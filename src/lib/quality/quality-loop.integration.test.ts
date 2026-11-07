import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createDb } from '../../db/connection'
import type { Db } from '../../db/connection'
import { conceptsRepository, householdsRepository, studentsRepository } from '../../db/repositories'
import { createQuestion } from '../questions'
import { remarkAfterKeyFix } from './remark'
import { decideQualityCase, listQualityCases, loadAnswerObservations, refreshQualityLoop } from './quality-loop'

/**
 * The quality loop against the local test database: a reported question opens a case, school students' answers
 * never reach the statistics, a key fix retires the question and adds a corrected copy, and a dismissed case does
 * not come back on the same evidence.
 */
describe('question quality loop', () => {
  let db: Db
  let householdId: string
  let adminUserId: string
  let studentId: string
  let schoolHouseholdId: string
  let schoolId: string
  let schoolStudentId: string
  let chapterId: string
  let conceptId: string
  let blueprintId: string
  let paperId: string
  let schoolPaperId: string
  const questionIds: Array<string> = []
  const attemptIds: Array<string> = []
  const evaluationIds: Array<string> = []
  let reportedQ: string
  let unclearQ: string
  let schoolOnlyQ: string
  let reportedPq: string
  let reportedItemId: string
  let reportedAttemptId: string
  let schoolReportedItem: string

  async function addMcq(key: string): Promise<string> {
    const q = await createQuestion(db, {
      concept_id: conceptId,
      board: 'CBSE',
      class: 7,
      bloom: 'Remember',
      difficulty: 'Easy',
      marks: 1,
      type: 'mcq',
      text: `Quality fixture ${key} ${Date.now()}`,
      answer: 'four',
      created_by: 'quality-fixture',
      options: [
        { label: 'A', text: 'four', is_correct: true, order_index: 0 },
        { label: 'B', text: 'five', is_correct: false, order_index: 1 },
        { label: 'C', text: 'six', is_correct: false, order_index: 2 },
        { label: 'D', text: 'seven', is_correct: false, order_index: 3 },
      ],
    })
    questionIds.push(q.id)
    return q.id
  }

  async function answer(onPaper: string, student: string, questionId: string, option: string, correct: boolean) {
    const pq = await db
      .insertInto('paper_questions')
      .values({ paper_id: onPaper, question_id: questionId, position: questionIds.length * 10 + attemptIds.length, marks: 1, section: 'A' })
      .returning('id')
      .executeTakeFirstOrThrow()
    const attempt = await db
      .insertInto('attempts')
      .values({ paper_id: onPaper, student_id: student, mode: 'online', status: 'evaluated', submitted_at: new Date() })
      .returning('id')
      .executeTakeFirstOrThrow()
    attemptIds.push(attempt.id)
    await db.insertInto('attempt_answers').values({ attempt_id: attempt.id, paper_question_id: pq.id, selected_option: option, source: 'typed' }).execute()
    const evaluation = await db
      .insertInto('evaluations')
      .values({ attempt_id: attempt.id, evaluated_by: 'ai', total_marks: 1, confirmed_at: new Date() })
      .returning('id')
      .executeTakeFirstOrThrow()
    evaluationIds.push(evaluation.id)
    const item = await db
      .insertInto('evaluation_items')
      .values({ evaluation_id: evaluation.id, paper_question_id: pq.id, marks_awarded: correct ? 1 : 0, marks_max: 1 })
      .returning('id')
      .executeTakeFirstOrThrow()
    return { pqId: pq.id, attemptId: attempt.id, itemId: item.id, evaluationId: evaluation.id }
  }

  beforeAll(async () => {
    db = createDb()
    const household = await householdsRepository.insert(db, { name: 'Quality Fixture Household', plan: 'free' })
    householdId = household.id
    const admin = await db
      .insertInto('users')
      .values({ household_id: household.id, email: `quality-admin-${Date.now()}@example.test`, role: 'admin', name: 'Quality Admin' })
      .returning('id')
      .executeTakeFirstOrThrow()
    adminUserId = admin.id
    const student = await studentsRepository.insert(db, {
      household_id: household.id,
      name: 'Quality Kid',
      class: 7,
      board: 'CBSE',
      target_exams: JSON.stringify([]),
    })
    studentId = student.id

    const schoolHousehold = await householdsRepository.insert(db, { name: 'Quality School Household', plan: 'free' })
    schoolHouseholdId = schoolHousehold.id
    const school = await db
      .insertInto('schools')
      .values({ household_id: schoolHousehold.id, name: 'Quality Fixture School', code: `quality-${Date.now()}`, status: 'active' })
      .returning('id')
      .executeTakeFirstOrThrow()
    schoolId = school.id
    const schoolStudent = await studentsRepository.insert(db, {
      household_id: schoolHousehold.id,
      name: 'School Kid',
      class: 7,
      board: 'CBSE',
      target_exams: JSON.stringify([]),
    })
    schoolStudentId = schoolStudent.id
    await db.updateTable('students').set({ school_id: school.id }).where('id', '=', schoolStudent.id).execute()

    const subject = await db.selectFrom('subjects').selectAll().where('code', '=', 'MATH-SEED').executeTakeFirstOrThrow()
    const anyChapter = await db.selectFrom('chapters').select('source_id').where('subject_id', '=', subject.id).executeTakeFirstOrThrow()
    const chapter = await db
      .insertInto('chapters')
      .values({
        subject_id: subject.id,
        source_id: anyChapter.source_id,
        part: 'I',
        chapter_no: 9000 + Math.floor(Math.random() * 90000),
        name: 'Quality fixture chapter',
        order_index: 9000,
      })
      .returning('id')
      .executeTakeFirstOrThrow()
    chapterId = chapter.id
    const concept = await conceptsRepository.insert(db, {
      chapter_id: chapter.id,
      board: 'CBSE',
      class: 7,
      code: `C7M-1.QL-${Date.now()}`,
      name: 'Quality concept',
      difficulty_base: 'Easy',
    })
    conceptId = concept.id
    const blueprint = await db
      .insertInto('blueprints')
      .values({
        subject_id: subject.id,
        board: 'CBSE',
        class: 7,
        name: 'Quality fixture blueprint',
        duration_min: 10,
        total_marks: 10,
        sections: JSON.stringify([]),
        bloom_targets: JSON.stringify({}),
      })
      .returning('id')
      .executeTakeFirstOrThrow()
    blueprintId = blueprint.id
    const paper = await db
      .insertInto('papers')
      .values({ blueprint_id: blueprint.id, student_id: student.id, subject_id: subject.id, duration_min: 10, title: 'Quality paper', total_marks: 10 })
      .returning('id')
      .executeTakeFirstOrThrow()
    paperId = paper.id
    const schoolPaper = await db
      .insertInto('papers')
      .values({ blueprint_id: blueprint.id, student_id: schoolStudent.id, subject_id: subject.id, duration_min: 10, title: 'Quality school paper', total_marks: 10 })
      .returning('id')
      .executeTakeFirstOrThrow()
    schoolPaperId = schoolPaper.id

    reportedQ = await addMcq('reported')
    unclearQ = await addMcq('unclear')
    schoolOnlyQ = await addMcq('school-only')

    const reported = await answer(paperId, studentId, reportedQ, 'B', false)
    reportedPq = reported.pqId
    reportedItemId = reported.itemId
    reportedAttemptId = reported.attemptId
    await db
      .insertInto('question_reports')
      .values({
        question_id: reportedQ,
        paper_question_id: reported.pqId,
        attempt_id: reported.attemptId,
        student_id: studentId,
        household_id: householdId,
        reason: 'answer_error',
        comment: 'Two plus two is four but the key looks wrong to me',
      })
      .execute()
    const unclear = await answer(paperId, studentId, unclearQ, 'A', true)
    await db
      .insertInto('question_reports')
      .values({
        question_id: unclearQ,
        paper_question_id: unclear.pqId,
        attempt_id: unclear.attemptId,
        student_id: studentId,
        household_id: householdId,
        reason: 'unclear',
        comment: 'The wording confused me a lot',
      })
      .execute()
    // a school student's answer: must never reach the shared statistics
    await answer(schoolPaperId, schoolStudentId, schoolOnlyQ, 'C', false)
    // a school student also picked B on the reported question: a key fix must leave her mark to her school
    schoolReportedItem = (await answer(schoolPaperId, schoolStudentId, reportedQ, 'B', false)).itemId
  })

  afterAll(async () => {
    const allQuestionIds = await db
      .selectFrom('questions')
      .select('id')
      .where('concept_id', '=', conceptId)
      .execute()
      .then((rows) => rows.map((r) => r.id))
    await db.deleteFrom('audit_log').where('household_id', '=', householdId).execute()
    if (allQuestionIds.length > 0) {
      await db.deleteFrom('mark_corrections').where('old_question_id', 'in', allQuestionIds).execute()
      await db.deleteFrom('question_quality_cases').where('question_id', 'in', allQuestionIds).execute()
      await db.deleteFrom('question_stats').where('question_id', 'in', allQuestionIds).execute()
      await db.deleteFrom('question_reports').where('question_id', 'in', allQuestionIds).execute()
    }
    if (evaluationIds.length > 0) {
      await db.deleteFrom('concept_mastery').where('evaluation_id', 'in', evaluationIds).execute()
      await db.deleteFrom('concept_status').where('student_id', '=', studentId).execute()
      await db.deleteFrom('student_concept_performance').where('student_id', '=', studentId).execute()
      await db.deleteFrom('evaluation_items').where('evaluation_id', 'in', evaluationIds).execute()
      await db.deleteFrom('evaluations').where('id', 'in', evaluationIds).execute()
    }
    if (attemptIds.length > 0) {
      await db.deleteFrom('attempt_answers').where('attempt_id', 'in', attemptIds).execute()
      await db.deleteFrom('attempts').where('id', 'in', attemptIds).execute()
    }
    await db.deleteFrom('paper_questions').where('paper_id', 'in', [paperId, schoolPaperId]).execute()
    await db.deleteFrom('papers').where('id', 'in', [paperId, schoolPaperId]).execute()
    await db.deleteFrom('blueprints').where('id', '=', blueprintId).execute()
    if (allQuestionIds.length > 0) await db.deleteFrom('questions').where('id', 'in', allQuestionIds).execute()
    await db.deleteFrom('concepts').where('id', '=', conceptId).execute()
    await db.deleteFrom('chapters').where('id', '=', chapterId).execute()
    await db.deleteFrom('users').where('id', '=', adminUserId).execute()
    await db.deleteFrom('students').where('id', '=', schoolStudentId).execute()
    await db.deleteFrom('schools').where('id', '=', schoolId).execute()
    await db.deleteFrom('households').where('id', 'in', [householdId, schoolHouseholdId]).execute()
    await db.destroy()
  })

  it("never reads a school student's answers", async () => {
    const observations = await loadAnswerObservations(db)
    expect(observations.some((o) => o.studentId === schoolStudentId)).toBe(false)
    expect(observations.some((o) => o.questionId === schoolOnlyQ)).toBe(false)
    expect(observations.some((o) => o.questionId === reportedQ && o.option === 'B' && !o.correct)).toBe(true)
  })

  it('opens a case for each reported question, the answer-key report first, without naming the student', async () => {
    await refreshQualityLoop(db)
    const { cases } = await listQualityCases(db, 'open', 100)
    const mine = cases.filter((c) => [reportedQ, unclearQ].includes(c.question.id))
    expect(mine.map((c) => c.question.id)).toEqual([reportedQ, unclearQ])
    expect(mine[0].severity).toBe(3)
    expect(mine[0].reports[0].comment).toContain('key looks wrong')
    expect(JSON.stringify(mine)).not.toContain(studentId)
    expect(JSON.stringify(mine)).not.toContain(householdId)
    expect(cases.some((c) => c.question.id === schoolOnlyQ)).toBe(false)
  })

  it('refreshing again does not open a second case for the same question', async () => {
    await refreshQualityLoop(db)
    const rows = await db.selectFrom('question_quality_cases').select('id').where('question_id', '=', reportedQ).execute()
    expect(rows).toHaveLength(1)
  })

  it('fixes a wrong key by retiring the question and adding a corrected copy, and records it', async () => {
    const qc = await db
      .selectFrom('question_quality_cases')
      .select('id')
      .where('question_id', '=', reportedQ)
      .where('status', '=', 'open')
      .executeTakeFirstOrThrow()
    // a second attempt chose A, the old (wrong) key, and was marked right
    const choseOld = await answer(paperId, studentId, reportedQ, 'A', true)
    const result = await decideQualityCase(db, {
      caseId: qc.id,
      decision: 'fix_key',
      correctLabel: 'B',
      note: 'checked by hand',
      actor: { id: adminUserId, householdId },
    })
    expect(result.ok).toBe(true)
    if (!result.ok) return
    const replacement = result.replacementQuestionId as string

    const old = await db.selectFrom('questions').select(['status']).where('id', '=', reportedQ).executeTakeFirstOrThrow()
    expect(old.status).toBe('retired')
    const fresh = await db.selectFrom('questions').select(['status', 'answer', 'text']).where('id', '=', replacement).executeTakeFirstOrThrow()
    expect(fresh).toMatchObject({ status: 'approved', answer: 'five' })
    const keys = await db.selectFrom('question_options').select(['label', 'is_correct']).where('question_id', '=', replacement).orderBy('order_index').execute()
    expect(keys.filter((k) => k.is_correct).map((k) => k.label)).toEqual(['B'])
    // the old paper still points at the question the student actually saw
    const slot = await db.selectFrom('paper_questions').select('question_id').where('id', '=', reportedPq).executeTakeFirstOrThrow()
    expect(slot.question_id).toBe(reportedQ)

    const report = await db.selectFrom('question_reports').select('status').where('question_id', '=', reportedQ).executeTakeFirstOrThrow()
    expect(report.status).toBe('resolved')
    const audit = await db
      .selectFrom('audit_log')
      .select(['action', 'after'])
      .where('entity_id', '=', reportedQ)
      .executeTakeFirstOrThrow()
    expect(audit.action).toBe('quality.fix_key')
    expect(audit.after).toMatchObject({
      new_key_label: 'B',
      old_key_label: 'A',
      marked_answers_affected: 3,
      remark: { examined: 2, changed: 2, raised: 1, lowered: 1, studentsAffected: 1, schoolMarksSkipped: 1 },
    })

    // phase 1b: the answer that picked the new key is raised, the one that picked the old key is lowered
    const mark = async (itemId: string) =>
      db.selectFrom('evaluation_items').select(['marks_awarded', 'error_type']).where('id', '=', itemId).executeTakeFirstOrThrow()
    expect(Number((await mark(reportedItemId)).marks_awarded)).toBe(1)
    expect(Number((await mark(choseOld.itemId)).marks_awarded)).toBe(0)
    expect((await mark(choseOld.itemId)).error_type).toBe('Conceptual Gap')
    // a school student's mark is left to her school
    expect(Number((await mark(schoolReportedItem)).marks_awarded)).toBe(0)

    // every change is kept side by side, and the evaluation totals follow the corrected marks
    const corrections = await db
      .selectFrom('mark_corrections')
      .select(['evaluation_item_id', 'old_marks', 'new_marks', 'new_question_id', 'old_question_id'])
      .where('quality_case_id', '=', qc.id)
      .execute()
    expect(corrections).toHaveLength(2)
    expect(corrections.find((c) => c.evaluation_item_id === reportedItemId)).toMatchObject({ old_marks: '0.00', new_marks: '1.00' })
    expect(corrections.find((c) => c.evaluation_item_id === choseOld.itemId)).toMatchObject({ old_marks: '1.00', new_marks: '0.00' })
    expect(corrections.every((c) => c.new_question_id === replacement && c.old_question_id === reportedQ)).toBe(true)
    const raisedEval = await db.selectFrom('evaluations').select(['actual_score', 'percentage', 'grade']).where('attempt_id', '=', reportedAttemptId).executeTakeFirstOrThrow()
    expect(Number(raisedEval.actual_score)).toBe(1)
    expect(Number(raisedEval.percentage)).toBe(100)
    const loweredEval = await db.selectFrom('evaluations').select(['actual_score', 'percentage']).where('id', '=', choseOld.evaluationId).executeTakeFirstOrThrow()
    expect(Number(loweredEval.actual_score)).toBe(0)

    // running the same re-mark again changes nothing
    const rerun = await remarkAfterKeyFix(db, { caseId: qc.id, oldQuestionId: reportedQ, newQuestionId: replacement })
    expect(rerun.changed).toBe(0)
    expect(await db.selectFrom('mark_corrections').select('id').where('quality_case_id', '=', qc.id).execute()).toHaveLength(2)

    const again = await decideQualityCase(db, { caseId: qc.id, decision: 'dismiss', note: '', actor: { id: adminUserId, householdId } })
    expect(again).toEqual({ ok: false, error: 'case_closed' })
  })

  it('refuses a key fix that names the current key', async () => {
    const qc = await db
      .selectFrom('question_quality_cases')
      .select('id')
      .where('question_id', '=', unclearQ)
      .where('status', '=', 'open')
      .executeTakeFirstOrThrow()
    const result = await decideQualityCase(db, {
      caseId: qc.id,
      decision: 'fix_key',
      correctLabel: 'A',
      note: '',
      actor: { id: adminUserId, householdId },
    })
    expect(result).toEqual({ ok: false, error: 'same_key' })
  })

  it('a dismissed case stays closed on the same evidence and reopens on new evidence', async () => {
    const qc = await db
      .selectFrom('question_quality_cases')
      .select('id')
      .where('question_id', '=', unclearQ)
      .where('status', '=', 'open')
      .executeTakeFirstOrThrow()
    const dismissed = await decideQualityCase(db, { caseId: qc.id, decision: 'dismiss', note: 'wording is fine', actor: { id: adminUserId, householdId } })
    expect(dismissed.ok).toBe(true)

    // dismissing closed the report too, so the same evidence is gone; reopen it to prove it is not enough on its own
    await db.updateTable('question_reports').set({ status: 'open', resolved_at: null }).where('question_id', '=', unclearQ).execute()
    await refreshQualityLoop(db)
    let open = await db.selectFrom('question_quality_cases').select('id').where('question_id', '=', unclearQ).where('status', '=', 'open').execute()
    expect(open).toHaveLength(0)

    // a second student report on the same question is new evidence
    const second = await answer(paperId, studentId, unclearQ, 'A', true)
    await db
      .insertInto('question_reports')
      .values({
        question_id: unclearQ,
        paper_question_id: second.pqId,
        attempt_id: second.attemptId,
        student_id: studentId,
        household_id: householdId,
        reason: 'unclear',
        comment: 'Still confusing on a second look',
      })
      .execute()
    await refreshQualityLoop(db)
    open = await db.selectFrom('question_quality_cases').select('id').where('question_id', '=', unclearQ).where('status', '=', 'open').execute()
    expect(open).toHaveLength(1)
  })
})
