import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createDb } from '../db/connection'
import type { Db } from '../db/connection'
import { conceptsRepository, fixitRepository, studentsRepository } from '../db/repositories'
import { createParentSession, createStudentSession } from '../db/test-helpers'
import type { TestSession } from '../db/test-helpers'
import { createQuestion } from './questions'
import { confirmEvaluation } from './evaluation'
import { answerFixitCard, ensureFixitBackfill, getFixitSummary, getFixitToday, recordFixitCardsForLostMarks } from './fixit'
import { addDays } from './fixit-schedule'
import { Route as TodayRoute } from '../routes/api/fixit/today'
import { Route as AnswerRoute } from '../routes/api/fixit/cards/$id/answer'

type RouteHandler = (opts: { request: Request; params?: Record<string, string> }) => Promise<Response>
function handlerFor(route: { options: { server?: unknown } }, method: string): RouteHandler {
  return (route.options.server as { handlers: Record<string, RouteHandler> }).handlers[method]
}
const call = (cookie: string, method: string, body?: unknown) =>
  new Request('http://localhost/test', {
    method,
    headers: { cookie, 'content-type': 'application/json' },
    body: method === 'GET' ? undefined : JSON.stringify(body ?? {}),
  })

const tag = `fixit-${Date.now()}`
const FILL_SECRET = 'SECRETFILLANSWER'

/** Fix-it Deck against the local test database: cards from confirmed lost marks, schedule, privacy. */
describe('Fix-it Deck', () => {
  let db: Db
  let parent: TestSession
  let householdId: string
  let subjectId: string
  let chapterId: string
  let blueprintId: string
  let paperId: string
  let position = 0
  const conceptIds: Array<string> = []
  const slotByConcept = new Map<string, string>()
  const studentIds: Array<string> = []
  const attemptIds: Array<string> = []
  const evaluationIds: Array<string> = []
  const sessions = new Map<string, TestSession>()

  async function newStudent(name: string) {
    const s = await studentsRepository.insert(db, {
      household_id: householdId,
      name,
      class: 7,
      board: 'CBSE',
      target_exams: JSON.stringify([]),
    })
    studentIds.push(s.id)
    sessions.set(s.id, await createStudentSession(tag, householdId, s.id))
    return s.id
  }

  async function newConcept(label: string, opts: { mcq?: boolean; fill?: boolean } = { mcq: true }) {
    const concept = await conceptsRepository.insert(db, {
      chapter_id: chapterId,
      board: 'CBSE',
      class: 7,
      code: `FIXIT-${label}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: `Fixit concept ${label}`,
      difficulty_base: 'Easy',
    })
    conceptIds.push(concept.id)
    // The slot question a paper item points at; written, so never served by the deck.
    const slot = await createQuestion(db, {
      concept_id: concept.id, board: 'CBSE', class: 7, bloom: 'Remember', difficulty: 'Easy', marks: 2,
      type: 'short_answer', text: `${tag} slot ${label}`, answer: 'x', created_by: tag,
    })
    const pq = await db
      .insertInto('paper_questions')
      .values({ paper_id: paperId, question_id: slot.id, position: ++position, marks: 2, section: 'A' })
      .returning('id')
      .executeTakeFirstOrThrow()
    slotByConcept.set(concept.id, pq.id)
    if (opts.mcq) {
      await createQuestion(db, {
        concept_id: concept.id, board: 'CBSE', class: 7, bloom: 'Remember', difficulty: 'Easy', marks: 1,
        type: 'mcq', text: `${tag} mcq ${label}`, answer: 'B', created_by: tag,
        options: [
          { label: 'A', text: 'first', is_correct: false, order_index: 1 },
          { label: 'B', text: 'second', is_correct: true, order_index: 2 },
        ],
      })
    }
    if (opts.fill) {
      await createQuestion(db, {
        concept_id: concept.id, board: 'CBSE', class: 7, bloom: 'Remember', difficulty: 'Easy', marks: 1,
        type: 'fill_blank', text: `${tag} fill ${label} ____`, answer: FILL_SECRET, created_by: tag,
      })
    }
    return concept.id
  }

  /** Builds a submitted evaluation with one item per entry and confirms it. */
  async function confirmWith(
    studentId: string,
    items: Array<{ concept: string; awarded: number; knowledgeKnown?: boolean | null; excluded?: boolean }>,
    opts: { confirm?: boolean } = {},
  ) {
    const attempt = await db
      .insertInto('attempts')
      .values({ paper_id: paperId, student_id: studentId, mode: 'online', status: 'submitted', submitted_at: new Date() })
      .returning('id')
      .executeTakeFirstOrThrow()
    attemptIds.push(attempt.id)
    const evaluation = await db
      .insertInto('evaluations')
      .values({ attempt_id: attempt.id, evaluated_by: 'ai', total_marks: items.length * 2 })
      .returning('id')
      .executeTakeFirstOrThrow()
    evaluationIds.push(evaluation.id)
    for (const item of items) {
      await db
        .insertInto('evaluation_items')
        .values({
          evaluation_id: evaluation.id,
          paper_question_id: slotByConcept.get(item.concept) as string,
          marks_awarded: item.awarded,
          marks_max: 2,
          knowledge_known: item.knowledgeKnown ?? null,
          excluded_by_student: item.excluded ?? false,
        })
        .execute()
    }
    if (opts.confirm !== false) await confirmEvaluation(db, evaluation.id)
    return evaluation.id
  }

  const cardFor = async (studentId: string, conceptId: string) => {
    const row = await fixitRepository.findByConcept(db, studentId, conceptId)
    return row && { id: row.id, stage: row.stage, status: row.status, due_on: row.due_on, cause: row.cause }
  }

  const today = () => fixitRepository.today(db)
  const setCards = (studentId: string, values: Record<string, unknown>, conceptId?: string) => {
    let q = db.updateTable('fixit_cards').set(values as never).where('student_id', '=', studentId)
    if (conceptId) q = q.where('concept_id', '=', conceptId)
    return q.execute()
  }
  const countCards = async (studentId: string) =>
    Number((await db.selectFrom('fixit_cards').select((eb) => eb.fn.countAll().as('n')).where('student_id', '=', studentId).executeTakeFirstOrThrow()).n)

  async function correctAnswerFor(questionId: string, type: string) {
    if (type === 'fill_blank') return FILL_SECRET
    const o = await db.selectFrom('question_options').select('label').where('question_id', '=', questionId).where('is_correct', '=', true).executeTakeFirstOrThrow()
    return o.label
  }

  async function wrongAnswerFor(questionId: string, type: string) {
    if (type === 'fill_blank') return 'nothing like it'
    const o = await db.selectFrom('question_options').select('label').where('question_id', '=', questionId).where('is_correct', '=', false).executeTakeFirstOrThrow()
    return o.label
  }

  beforeAll(async () => {
    db = createDb()
    parent = await createParentSession(tag)
    householdId = parent.householdId
    const subject = await db.selectFrom('subjects').selectAll().where('code', '=', 'MATH-SEED').executeTakeFirstOrThrow()
    subjectId = subject.id
    const anyChapter = await db.selectFrom('chapters').select('source_id').where('subject_id', '=', subject.id).executeTakeFirstOrThrow()
    const chapter = await db
      .insertInto('chapters')
      .values({ subject_id: subject.id, source_id: anyChapter.source_id, part: 'I', chapter_no: 9000 + Math.floor(Math.random() * 90000), name: 'Fixit fixture chapter', order_index: 9000 })
      .returning('id')
      .executeTakeFirstOrThrow()
    chapterId = chapter.id
    const blueprint = await db
      .insertInto('blueprints')
      .values({ subject_id: subjectId, board: 'CBSE', class: 7, name: 'Fixit fixture blueprint', duration_min: 10, total_marks: 100, sections: JSON.stringify([]), bloom_targets: JSON.stringify({}) })
      .returning('id')
      .executeTakeFirstOrThrow()
    blueprintId = blueprint.id
    const student0 = await newStudent('Fixit Placeholder')
    const paper = await db
      .insertInto('papers')
      .values({ blueprint_id: blueprintId, student_id: student0, subject_id: subjectId, duration_min: 10, title: 'Fixit fixture paper', total_marks: 100 })
      .returning('id')
      .executeTakeFirstOrThrow()
    paperId = paper.id
  })

  afterAll(async () => {
    await db.deleteFrom('fixit_cards').where('student_id', 'in', studentIds).execute()
    await db.deleteFrom('evaluation_items').where('evaluation_id', 'in', evaluationIds).execute()
    await db.deleteFrom('evaluations').where('id', 'in', evaluationIds).execute()
    await db.deleteFrom('attempts').where('id', 'in', attemptIds).execute()
    await db.deleteFrom('households').where('id', '=', householdId).execute()
    await db.deleteFrom('paper_questions').where('paper_id', '=', paperId).execute()
    await db.deleteFrom('papers').where('id', '=', paperId).execute()
    await db.deleteFrom('concept_status').where('concept_id', 'in', conceptIds).execute()
    await db.deleteFrom('concept_mastery').where('concept_id', 'in', conceptIds).execute()
    await db.deleteFrom('questions').where('concept_id', 'in', conceptIds).execute()
    await db.deleteFrom('concepts').where('id', 'in', conceptIds).execute()
    await db.deleteFrom('chapters').where('id', '=', chapterId).execute()
    await db.deleteFrom('blueprints').where('id', '=', blueprintId).execute()
    await db.destroy()
  })

  it('opens a card on a confirmed lost mark, and none on full marks', async () => {
    const s = await newStudent('Fixit Creator')
    const lost = await newConcept('lost')
    const full = await newConcept('full')
    const habit = await newConcept('habit')
    await confirmWith(s, [
      { concept: lost, awarded: 0 },
      { concept: full, awarded: 2 },
      { concept: habit, awarded: 1, knowledgeKnown: true },
    ])
    const card = await cardFor(s, lost)
    expect(card).toMatchObject({ stage: 0, status: 'active', due_on: await today(), cause: 'knowledge' })
    expect(await cardFor(s, full)).toBeNull()
    expect(await cardFor(s, habit)).toMatchObject({ cause: 'habit' })
  })

  it('does not open a card from an unconfirmed evaluation or a removed question', async () => {
    const s = await newStudent('Fixit Unconfirmed')
    const a = await newConcept('unconf')
    const b = await newConcept('removed')
    await confirmWith(s, [{ concept: a, awarded: 0 }], { confirm: false })
    await confirmWith(s, [{ concept: b, awarded: 0, excluded: true }])
    expect(await cardFor(s, a)).toBeNull()
    expect(await cardFor(s, b)).toBeNull()
  })

  it('re-opens a mastered card and leaves an active one alone', async () => {
    const s = await newStudent('Fixit Reopen')
    const c = await newConcept('reopen')
    await confirmWith(s, [{ concept: c, awarded: 0 }])
    await setCards(s, { status: 'mastered', stage: 3, due_on: addDays(await today(), 30) })
    await confirmWith(s, [{ concept: c, awarded: 1 }])
    expect(await cardFor(s, c)).toMatchObject({ status: 'active', stage: 0, due_on: await today() })

    await setCards(s, { stage: 2, due_on: addDays(await today(), 7) })
    await confirmWith(s, [{ concept: c, awarded: 0 }])
    expect(await cardFor(s, c)).toMatchObject({ status: 'active', stage: 2, due_on: addDays(await today(), 7) })
  })

  it('a failure while opening cards is logged and does not break the surrounding transaction', async () => {
    const s = await newStudent('Fixit Savepoint')
    const c = await newConcept('savepoint')
    await db.transaction().execute(async (trx) => {
      await recordFixitCardsForLostMarks(trx, s, [
        { evaluationItemId: '00000000-0000-0000-0000-000000000000', conceptId: '00000000-0000-0000-0000-000000000001', marksAwarded: 0, marksMax: 2, knowledgeKnown: null, errorType: null },
      ])
      // The transaction is still usable afterwards.
      await recordFixitCardsForLostMarks(trx, s, [
        { evaluationItemId: null as unknown as string, conceptId: c, marksAwarded: 0, marksMax: 2, knowledgeKnown: null, errorType: null },
      ])
    })
    expect(await cardFor(s, c)).not.toBeNull()
  })

  it('moves a card through the schedule on correct and wrong answers at every stage', async () => {
    const s = await newStudent('Fixit Schedule')
    const c = await newConcept('schedule', { mcq: true, fill: true })
    await confirmWith(s, [{ concept: c, awarded: 0 }])
    const day = await today()
    const gaps = [2, 7, 21]

    for (const stage of [0, 1, 2, 3]) {
      for (const correct of [true, false]) {
        await setCards(s, { stage, status: 'active', due_on: day, served_question_id: null, served_on: null })
        const cardIds = (await db.selectFrom('fixit_cards').select('id').where('student_id', '=', s).execute()).map((row) => row.id)
        await db.deleteFrom('fixit_answers').where('card_id', 'in', cardIds).execute()
        const deck = await getFixitToday(db, s)
        expect(deck.cards).toHaveLength(1)
        const q = deck.cards[0].question
        const answer = correct ? await correctAnswerFor(q.id, q.type) : await wrongAnswerFor(q.id, q.type)
        const result = await answerFixitCard(db, s, deck.cards[0].id, q.id, answer)
        if ('error' in result) throw new Error(result.error)
        expect(result.correct).toBe(correct)
        const after = await cardFor(s, c)
        if (!correct) expect(after).toMatchObject({ stage: 0, status: 'active', due_on: addDays(day, 1) })
        else if (stage === 3) expect(after).toMatchObject({ status: 'mastered' })
        else expect(after).toMatchObject({ stage: stage + 1, status: 'active', due_on: addDays(day, gaps[stage]) })
      }
    }
  })

  it('serves at most 3 cards a day and reports the rest as due_total', async () => {
    const s = await newStudent('Fixit Limit')
    const concepts = []
    for (let i = 0; i < 5; i++) concepts.push({ concept: await newConcept(`limit${i}`), awarded: 0 })
    await confirmWith(s, concepts)
    const deck = await getFixitToday(db, s)
    expect(deck.cards).toHaveLength(3)
    expect(deck.due_total).toBe(5)
    expect(deck.answered_today).toBe(0)

    // After she answers one, only two more are served that day.
    const q = deck.cards[0].question
    await answerFixitCard(db, s, deck.cards[0].id, q.id, await correctAnswerFor(q.id, q.type))
    const again = await getFixitToday(db, s)
    expect(again.answered_today).toBe(1)
    expect(again.cards).toHaveLength(2)
    expect(await getFixitSummary(db, s)).toEqual({ due: 2, answered_today: 1, mastered_total: 0, total_cards_ever: 5 })
  })

  it('sends no answer key to the browser', async () => {
    const s = await newStudent('Fixit Privacy')
    const c = await newConcept('privacy', { mcq: true, fill: true })
    await confirmWith(s, [{ concept: c, awarded: 0 }])
    const response = await handlerFor(TodayRoute, 'GET')({ request: call(sessions.get(s)!.cookie, 'GET') })
    expect(response.status).toBe(200)
    const text = await response.text()
    expect(text).not.toContain('is_correct')
    expect(text).not.toContain(FILL_SECRET)
    expect(text).not.toMatch(/"(answer|correct|key)"/)
    const body = JSON.parse(text)
    expect(body.cards).toHaveLength(1)
    for (const option of body.cards[0].question.options ?? []) expect(Object.keys(option).sort()).toEqual(['label', 'text'])
    // A parent session has no deck.
    const asParent = await handlerFor(TodayRoute, 'GET')({ request: call(parent.cookie, 'GET') })
    expect(asParent.status).toBe(403)
  })

  it('shows the right answer only after she answers, and rejects strangers, other questions and repeats', async () => {
    const owner = await newStudent('Fixit Owner')
    const stranger = await newStudent('Fixit Stranger')
    const c = await newConcept('guard', { mcq: true, fill: false })
    const other = await newConcept('guard-other')
    await confirmWith(owner, [{ concept: c, awarded: 0 }])
    const deck = await (await handlerFor(TodayRoute, 'GET')({ request: call(sessions.get(owner)!.cookie, 'GET') })).json()
    const card = deck.cards[0]
    const q = card.question

    const post = (cookie: string, id: string, body: unknown) =>
      handlerFor(AnswerRoute, 'POST')({ request: call(cookie, 'POST', body), params: { id } })

    expect((await post(sessions.get(stranger)!.cookie, card.id, { question_id: q.id, answer: 'B' })).status).toBe(404)
    expect((await post(parent.cookie, card.id, { question_id: q.id, answer: 'B' })).status).toBe(403)
    const otherQuestion = await db.selectFrom('questions').select('id').where('concept_id', '=', other).where('type', '=', 'mcq').executeTakeFirstOrThrow()
    expect((await post(sessions.get(owner)!.cookie, card.id, { question_id: otherQuestion.id, answer: 'B' })).status).toBe(400)
    expect((await post(sessions.get(owner)!.cookie, card.id, { question_id: q.id, answer: 'Z' })).status).toBe(400)
    expect(await cardFor(owner, c)).toMatchObject({ stage: 0 })

    const ok = await post(sessions.get(owner)!.cookie, card.id, { question_id: q.id, answer: 'B' })
    expect(ok.status).toBe(200)
    const result = await ok.json()
    expect(result.correct).toBe(true)
    expect(result.correct_answer_text).toBe('B. second')
    expect(result.next.stage).toBe(1)
    expect((await post(sessions.get(owner)!.cookie, card.id, { question_id: q.id, answer: 'B' })).status).toBe(400)
  })

  it('skips a card whose concept has no auto-markable question, without error', async () => {
    const s = await newStudent('Fixit NoQuestion')
    const c = await newConcept('noq', { mcq: false })
    await confirmWith(s, [{ concept: c, awarded: 0 }])
    expect(await cardFor(s, c)).not.toBeNull()
    const deck = await getFixitToday(db, s)
    expect(deck.cards).toHaveLength(0)
    expect(deck.due_total).toBe(0)
  })

  it('backfills from the last 30 days once, newest first, and never again', async () => {
    const s = await newStudent('Fixit Backfill')
    const concepts: Array<string> = []
    for (let i = 0; i < 12; i++) concepts.push(await newConcept(`bf${i}`))
    const oldConcept = await newConcept('bf-old')
    const evals: Array<string> = []
    for (const c of concepts) evals.push(await confirmWith(s, [{ concept: c, awarded: 0 }]))
    const oldEval = await confirmWith(s, [{ concept: oldConcept, awarded: 0 }])
    await db.updateTable('evaluations').set({ confirmed_at: new Date(Date.now() - 40 * 86400_000) }).where('id', '=', oldEval).execute()
    // Space the 12 recent ones out so "newest first" is well defined: the first is the oldest.
    for (let i = 0; i < evals.length; i++) {
      await db.updateTable('evaluations').set({ confirmed_at: new Date(Date.now() - (evals.length - i) * 3600_000) }).where('id', '=', evals[i]).execute()
    }
    // Confirming already opened cards; wipe them to look like a student from before the deck existed.
    await db.deleteFrom('fixit_cards').where('student_id', '=', s).execute()

    await ensureFixitBackfill(db, s)
    const rows = await db.selectFrom('fixit_cards').select('concept_id').where('student_id', '=', s).execute()
    expect(rows).toHaveLength(10)
    const ids = rows.map((r) => r.concept_id)
    expect(ids).not.toContain(oldConcept)
    expect(ids).toContain(concepts[11])
    expect(ids).not.toContain(concepts[0])
    expect(ids).not.toContain(concepts[1])

    await setCards(s, { status: 'mastered' })
    await ensureFixitBackfill(db, s)
    expect(await countCards(s)).toBe(10)
  })

  it('summarises due, answered today and mastered', async () => {
    const s = await newStudent('Fixit Summary')
    expect(await getFixitSummary(db, s)).toEqual({ due: 0, answered_today: 0, mastered_total: 0, total_cards_ever: 0 })
    const a = await newConcept('sum-a')
    const b = await newConcept('sum-b')
    await confirmWith(s, [{ concept: a, awarded: 0 }, { concept: b, awarded: 0 }])
    expect(await getFixitSummary(db, s)).toEqual({ due: 2, answered_today: 0, mastered_total: 0, total_cards_ever: 2 })
    await setCards(s, { status: 'mastered' }, b)
    await setCards(s, { stage: 3 }, a)
    const deck = await getFixitToday(db, s)
    const q = deck.cards[0].question
    await answerFixitCard(db, s, deck.cards[0].id, q.id, await correctAnswerFor(q.id, q.type))
    expect(await getFixitSummary(db, s)).toEqual({ due: 0, answered_today: 1, mastered_total: 2, total_cards_ever: 2 })
  })

  it('keeps one student from reading the deck of another', async () => {
    const a = await newStudent('Fixit Iso A')
    const b = await newStudent('Fixit Iso B')
    const c = await newConcept('iso')
    await confirmWith(a, [{ concept: c, awarded: 0 }])
    const deck = await (await handlerFor(TodayRoute, 'GET')({ request: call(sessions.get(b)!.cookie, 'GET') })).json()
    expect(deck.cards).toHaveLength(0)
  })
})
