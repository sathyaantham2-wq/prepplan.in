import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createDb } from '../db/connection'
import type { Db } from '../db/connection'
import { conceptsRepository, householdsRepository, studentsRepository } from '../db/repositories'
import { createQuestion } from './questions'
import { getMarksWonBack } from './marks-won-back'

const SINCE = new Date('2026-03-10T00:00:00Z')
const UNTIL = new Date('2026-03-16T23:59:59Z')
const BEFORE = new Date('2026-03-01T10:00:00Z')
const INSIDE = new Date('2026-03-12T10:00:00Z')

/** Marks Won Back against local-test-db fixtures: one concept per scenario. */
describe('getMarksWonBack', () => {
  let db: Db
  let householdId: string
  let studentId: string
  let chapterId: string
  let blueprintId: string
  let paperId: string
  const conceptIds: Array<string> = []
  const questionIds: Array<string> = []
  const pqByKey = new Map<string, string>()
  const conceptByKey = new Map<string, string>()
  const attemptIds: Array<string> = []
  const evaluationIds: Array<string> = []
  let position = 0

  async function addConcept(key: string) {
    const concept = await conceptsRepository.insert(db, {
      chapter_id: chapterId,
      board: 'CBSE',
      class: 7,
      code: `C7M-1.MWB-${key}-${Date.now()}`,
      name: `MWB concept ${key}`,
      difficulty_base: 'Easy',
    })
    conceptIds.push(concept.id)
    conceptByKey.set(key, concept.id)
    const q = await createQuestion(db, {
      concept_id: concept.id,
      board: 'CBSE',
      class: 7,
      bloom: 'Remember',
      difficulty: 'Easy',
      marks: 3,
      type: 'short_answer',
      text: `MWB fixture question ${key} ${Date.now()}`,
      answer: 'x',
      created_by: 'mwb-fixture',
    })
    questionIds.push(q.id)
    const pq = await db
      .insertInto('paper_questions')
      .values({ paper_id: paperId, question_id: q.id, position: ++position, marks: 3, section: 'A' })
      .returning('id')
      .executeTakeFirstOrThrow()
    pqByKey.set(key, pq.id)
  }

  async function addItem(
    key: string,
    confirmedAt: Date | null,
    awarded: number,
    opts: { max?: number; knowledgeKnown?: boolean | null; excluded?: boolean } = {},
  ) {
    const max = opts.max ?? 3
    const attempt = await db
      .insertInto('attempts')
      .values({
        paper_id: paperId,
        student_id: studentId,
        mode: 'online',
        status: 'evaluated',
        submitted_at: confirmedAt ?? INSIDE,
      })
      .returning('id')
      .executeTakeFirstOrThrow()
    attemptIds.push(attempt.id)
    const evaluation = await db
      .insertInto('evaluations')
      .values({
        attempt_id: attempt.id,
        evaluated_by: 'ai',
        total_marks: max,
        confirmed_at: confirmedAt,
      })
      .returning('id')
      .executeTakeFirstOrThrow()
    evaluationIds.push(evaluation.id)
    await db
      .insertInto('evaluation_items')
      .values({
        evaluation_id: evaluation.id,
        paper_question_id: pqByKey.get(key) as string,
        marks_awarded: awarded,
        marks_max: max,
        knowledge_known: opts.knowledgeKnown ?? null,
        excluded_by_student: opts.excluded ?? false,
      })
      .execute()
  }

  beforeAll(async () => {
    db = createDb()
    const household = await householdsRepository.insert(db, { name: 'MWB Fixture Household', plan: 'free' })
    householdId = household.id
    const student = await studentsRepository.insert(db, {
      household_id: household.id,
      name: 'MWB Kid',
      class: 7,
      board: 'CBSE',
      target_exams: JSON.stringify([]),
    })
    studentId = student.id
    const subject = await db.selectFrom('subjects').selectAll().where('code', '=', 'MATH-SEED').executeTakeFirstOrThrow()
    const anyChapter = await db.selectFrom('chapters').select('source_id').where('subject_id', '=', subject.id).executeTakeFirstOrThrow()
    const chapter = await db
      .insertInto('chapters')
      .values({
        subject_id: subject.id,
        source_id: anyChapter.source_id,
        part: 'I',
        chapter_no: 9000 + Math.floor(Math.random() * 90000),
        name: 'MWB fixture chapter',
        order_index: 9000,
      })
      .returning('id')
      .executeTakeFirstOrThrow()
    chapterId = chapter.id
    const blueprint = await db
      .insertInto('blueprints')
      .values({
        subject_id: subject.id,
        board: 'CBSE',
        class: 7,
        name: 'MWB fixture blueprint',
        duration_min: 10,
        total_marks: 30,
        sections: JSON.stringify([]),
        bloom_targets: JSON.stringify({}),
      })
      .returning('id')
      .executeTakeFirstOrThrow()
    blueprintId = blueprint.id
    const paper = await db
      .insertInto('papers')
      .values({ blueprint_id: blueprint.id, student_id: student.id, subject_id: subject.id, duration_min: 10, title: 'MWB fixture paper', total_marks: 30 })
      .returning('id')
      .executeTakeFirstOrThrow()
    paperId = paper.id

    for (const key of ['once', 'partial', 'inside', 'unconf', 'edgeIn', 'edgeOut', 'habit', 'never', 'retired', 'excluded', 'capped', 'laterLoss']) {
      await addConcept(key)
    }

    // once: lost 2 before, two full-mark successes inside the window -> credited once.
    await addItem('once', BEFORE, 1)
    await addItem('once', INSIDE, 3)
    await addItem('once', new Date('2026-03-13T10:00:00Z'), 3)
    // partial: lost before, only a better-but-not-full mark inside -> nothing.
    await addItem('partial', BEFORE, 0)
    await addItem('partial', INSIDE, 2)
    // inside: the loss itself is inside the window, so it is not "before" -> nothing.
    await addItem('inside', INSIDE, 1)
    await addItem('inside', new Date('2026-03-13T10:00:00Z'), 3)
    // unconf: the loss is unconfirmed (ignored) and the win is unconfirmed (ignored).
    await addItem('unconf', null, 0)
    await addItem('unconf', null, 3)
    // edges: a win exactly at untilDate counts; a win just after untilDate does not.
    await addItem('edgeIn', BEFORE, 2)
    await addItem('edgeIn', UNTIL, 3)
    await addItem('edgeOut', BEFORE, 2)
    await addItem('edgeOut', new Date(UNTIL.getTime() + 1000), 3)
    // habit: knew it but did not deliver.
    await addItem('habit', BEFORE, 1, { knowledgeKnown: true })
    await addItem('habit', INSIDE, 3)
    // never lost anything: full marks before and inside -> nothing.
    await addItem('never', BEFORE, 3)
    await addItem('never', INSIDE, 3)
    // retired question: history stays, the win still counts.
    await addItem('retired', BEFORE, 0)
    await addItem('retired', INSIDE, 3)
    await db.updateTable('questions').set({ status: 'retired' }).where('concept_id', '=', conceptByKey.get('retired') as string).execute()
    // excluded by the student: that win is out of her grade, so it earns nothing.
    await addItem('excluded', BEFORE, 1)
    await addItem('excluded', INSIDE, 3, { excluded: true })
    // capped: lost 2 of 3 before, later item out of 1 mark -> min(lost, later max) = 1.
    await addItem('capped', BEFORE, 1)
    await addItem('capped', INSIDE, 1, { max: 1 })
    // laterLoss: most recent earlier loss is the one used (lost 1, not 3).
    await addItem('laterLoss', new Date('2026-02-01T00:00:00Z'), 0)
    await addItem('laterLoss', BEFORE, 2)
    await addItem('laterLoss', INSIDE, 3)
  })

  afterAll(async () => {
    if (evaluationIds.length > 0) {
      await db.deleteFrom('evaluation_items').where('evaluation_id', 'in', evaluationIds).execute()
      await db.deleteFrom('evaluations').where('id', 'in', evaluationIds).execute()
      await db.deleteFrom('attempts').where('id', 'in', attemptIds).execute()
    }
    await db.deleteFrom('paper_questions').where('paper_id', '=', paperId).execute()
    await db.deleteFrom('papers').where('id', '=', paperId).execute()
    await db.deleteFrom('households').where('id', '=', householdId).execute()
    await db.deleteFrom('blueprints').where('id', '=', blueprintId).execute()
    if (questionIds.length > 0) await db.deleteFrom('questions').where('id', 'in', questionIds).execute()
    if (conceptIds.length > 0) await db.deleteFrom('concepts').where('id', 'in', conceptIds).execute()
    await db.deleteFrom('chapters').where('id', '=', chapterId).execute()
    await db.destroy()
  })

  const byKey = (result: Awaited<ReturnType<typeof getMarksWonBack>>, key: string) =>
    result.items.find((i) => i.concept_id === conceptByKey.get(key))

  it('credits each concept once and copies the cause from the earlier loss', async () => {
    const r = await getMarksWonBack(db, studentId, SINCE, UNTIL)
    expect(byKey(r, 'once')).toMatchObject({ marks_back: 2, cause: 'knowledge', subject_name: expect.any(String) })
    expect(byKey(r, 'habit')).toMatchObject({ marks_back: 2, cause: 'habit' })
    expect(r.items.filter((i) => i.concept_id === conceptByKey.get('once'))).toHaveLength(1)
  })

  it('earns nothing for partial improvement, an in-window loss, unconfirmed items, or a concept never lost', async () => {
    const r = await getMarksWonBack(db, studentId, SINCE, UNTIL)
    for (const key of ['partial', 'inside', 'unconf', 'never', 'excluded']) expect(byKey(r, key)).toBeUndefined()
  })

  it('treats the window edges as inclusive of untilDate and the earlier loss must be before sinceDate', async () => {
    const r = await getMarksWonBack(db, studentId, SINCE, UNTIL)
    expect(byKey(r, 'edgeIn')?.marks_back).toBe(1)
    expect(byKey(r, 'edgeOut')).toBeUndefined()
    const open = await getMarksWonBack(db, studentId, SINCE)
    expect(byKey(open, 'edgeOut')?.marks_back).toBe(1)
  })

  it('still counts retired questions, caps at the later item max, and uses the most recent earlier loss', async () => {
    const r = await getMarksWonBack(db, studentId, SINCE, UNTIL)
    expect(byKey(r, 'retired')?.marks_back).toBe(3)
    expect(byKey(r, 'capped')?.marks_back).toBe(1)
    expect(byKey(r, 'laterLoss')?.marks_back).toBe(1)
  })

  it('total is the sum of the items and never negative; another student gets zero', async () => {
    const r = await getMarksWonBack(db, studentId, SINCE, UNTIL)
    expect(r.total).toBe(r.items.reduce((s, i) => s + i.marks_back, 0))
    // once 2, habit 2, edgeIn 1, retired 3, capped 1, laterLoss 1
    expect(r.total).toBe(10)
    const other = await getMarksWonBack(db, '00000000-0000-0000-0000-000000000000', SINCE, UNTIL)
    expect(other).toEqual({ total: 0, items: [] })
  })
})
