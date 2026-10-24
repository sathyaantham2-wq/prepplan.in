import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createDb } from '../db/connection'
import type { Db } from '../db/connection'
import {
  conceptsRepository,
  blueprintsRepository,
  attemptsRepository,
  attemptAnswersRepository,
} from '../db/repositories'
import { createQuestion } from '../lib/questions'
import { generatePaper } from '../lib/papers'
import { createEvaluation } from '../lib/evaluation'
import { THEME_PRICES } from '../lib/rewards'
import { DEFAULT_THEME } from '../lib/pdf/themes'
import { createParentSession, createStudentSession } from '../db/test-helpers'
import type { TestSession } from '../db/test-helpers'
import { Route as StudentsRoute } from './api/students'
import { Route as GenerateRoute } from './api/papers/generate'
import { Route as HomeRoute } from './api/students/me/home'
import { Route as RewardsRoute } from './api/students/me/rewards'
import { Route as UnlockRoute } from './api/students/me/rewards/unlock'

type RouteHandler = (opts: { request: Request; params?: Record<string, string> }) => Promise<Response>
function handlerFor(route: { options: { server?: unknown } }, method: string): RouteHandler {
  return (route.options.server as { handlers: Record<string, RouteHandler> }).handlers[method]
}
function req(cookie: string, body?: unknown): Request {
  return new Request('http://localhost/test', {
    method: body ? 'POST' : 'GET',
    headers: { cookie, ...(body ? { 'content-type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  })
}

/**
 * Coins are spendable on paper themes. The earned side is the F125 ledger; tests that need a big
 * balance insert ledger rows pointing at throwaway evaluation_items (the table has no uniqueness
 * beyond its id), which is exactly what a confirmed correct answer would have written.
 */
describe('student rewards: spending coins on paper themes', () => {
  let db: Db
  let parent: TestSession
  let kid: { id: string; session: TestSession }
  let other: { id: string; session: TestSession }
  let subjectId: string
  let conceptId: string
  let chapterId: string
  let questionId: string
  let blueprintId: string
  let paperId: string
  let attemptId: string
  let evaluationId: string
  let paperQuestionId: string
  const generatedPaperIds: Array<string> = []

  async function grant(studentId: string, coins: number) {
    const item = await db
      .insertInto('evaluation_items')
      .values({ evaluation_id: evaluationId, paper_question_id: paperQuestionId, marks_awarded: 1, marks_max: 1 })
      .returning('id')
      .executeTakeFirstOrThrow()
    await db
      .insertInto('student_points_ledger')
      .values({
        student_id: studentId,
        evaluation_item_id: item.id,
        concept_id: conceptId,
        subject_id: subjectId,
        difficulty: 'Easy',
        points: coins,
        coins,
      })
      .execute()
  }
  const rewards = async (s: TestSession) => (await handlerFor(RewardsRoute, 'GET')({ request: req(s.cookie) })).json()
  const unlock = (s: TestSession, key: string) => handlerFor(UnlockRoute, 'POST')({ request: req(s.cookie, { key }) })
  const unlockRows = (studentId: string) =>
    db.selectFrom('student_unlocks').selectAll().where('student_id', '=', studentId).execute()
  const generate = async (s: TestSession, theme: string) => {
    const response = await handlerFor(GenerateRoute, 'POST')({
      request: req(s.cookie, {
        blueprint_id: blueprintId,
        chapter_ids: [chapterId],
        theme,
        recent_usage_window_days: 0,
      }),
    })
    expect(response.status).toBe(201)
    const body = await response.json()
    generatedPaperIds.push(body.paper.id)
    return body.paper.theme as string
  }

  beforeAll(async () => {
    db = createDb()
    parent = await createParentSession('rewards')
    const make = async (name: string) => {
      const response = await handlerFor(StudentsRoute, 'POST')({
        request: req(parent.cookie, { name, class: 7, board: 'CBSE', consent_accepted: true }),
      })
      const id = (await response.json()).id as string
      return { id, session: await createStudentSession(`rewards-${name.split(' ')[0].toLowerCase()}`, parent.householdId, id) }
    }
    kid = await make('Reward Kid')
    other = await make('Other Kid')

    const subject = await db.selectFrom('subjects').selectAll().where('code', '=', 'MATH-SEED').executeTakeFirstOrThrow()
    subjectId = subject.id
    const anyChapter = await db.selectFrom('chapters').select('source_id').where('subject_id', '=', subject.id).executeTakeFirstOrThrow()
    const chapter = await db
      .insertInto('chapters')
      .values({
        subject_id: subject.id,
        source_id: anyChapter.source_id,
        part: 'I',
        chapter_no: 9000 + Math.floor(Math.random() * 90000),
        name: 'Rewards fixture chapter',
        order_index: 9000,
      })
      .returningAll()
      .executeTakeFirstOrThrow()
    chapterId = chapter.id
    const concept = await conceptsRepository.insert(db, {
      chapter_id: chapter.id,
      board: 'CBSE',
      class: 7,
      code: `C7M-1.RWD-${Date.now()}`,
      name: 'Rewards fixture concept',
      difficulty_base: 'Easy',
    })
    conceptId = concept.id
    const q = await createQuestion(db, {
      concept_id: concept.id,
      board: 'CBSE',
      class: 7,
      bloom: 'Remember',
      difficulty: 'Easy',
      marks: 1,
      type: 'mcq',
      text: 'Rewards fixture question',
      answer: '1',
      created_by: 'rewards-fixture',
      options: [
        { label: 'A', text: '1', is_correct: true, order_index: 1 },
        { label: 'B', text: '2', is_correct: false, order_index: 2 },
      ],
    })
    questionId = q.id
    const blueprint = await blueprintsRepository.insert(db, {
      subject_id: subject.id,
      board: 'CBSE',
      class: 7,
      name: 'Rewards fixture blueprint',
      duration_min: 10,
      total_marks: 1,
      sections: JSON.stringify([{ name: 'Section A', marks_per_question: 1, count: 1, bloom_allowed: ['Remember'] }]),
      bloom_targets: JSON.stringify({ Remember: 100, Understand: 0, Apply: 0, Analyse: 0, Evaluate: 0, Create: 0 }),
    })
    blueprintId = blueprint.id

    // A real evaluation (never confirmed, so it writes no ledger rows) for grant() to hang items on.
    const generated = await generatePaper(db, { student_id: kid.id, blueprint_id: blueprintId, chapter_ids: [chapterId] })
    paperId = generated.paper.id
    paperQuestionId = generated.paperQuestions[0].id
    const attempt = await attemptsRepository.insert(db, {
      paper_id: paperId,
      student_id: kid.id,
      mode: 'online',
      status: 'submitted',
      submitted_at: new Date(),
    })
    attemptId = attempt.id
    await attemptAnswersRepository.upsert(db, {
      attempt_id: attemptId,
      paper_question_id: paperQuestionId,
      selected_option: 'B',
      source: 'typed',
    })
    const evaluation = (await createEvaluation(db, attemptId)).evaluation
    evaluationId = evaluation.id
  })

  afterAll(async () => {
    const ids = [kid.id, other.id]
    await db.deleteFrom('student_points_ledger').where('student_id', 'in', ids).execute()
    await db.deleteFrom('evaluation_items').where('evaluation_id', '=', evaluationId).execute()
    await db.deleteFrom('evaluations').where('id', '=', evaluationId).execute()
    await db.deleteFrom('attempt_answers').where('attempt_id', '=', attemptId).execute()
    await db.deleteFrom('attempts').where('id', '=', attemptId).execute()
    await db.deleteFrom('student_unlocks').where('student_id', 'in', ids).execute()
    const all = [paperId, ...generatedPaperIds]
    await db.deleteFrom('paper_questions').where('paper_id', 'in', all).execute()
    await db.deleteFrom('papers').where('id', 'in', all).execute()
    await db.deleteFrom('households').where('id', '=', parent.householdId).execute()
    await db.deleteFrom('blueprints').where('id', '=', blueprintId).execute()
    await db.deleteFrom('questions').where('id', '=', questionId).execute()
    await db.deleteFrom('concepts').where('id', '=', conceptId).execute()
    await db.deleteFrom('chapters').where('id', '=', chapterId).execute()
    await db.destroy()
  })

  it('starts at zero with only the default theme unlocked', async () => {
    const view = await rewards(kid.session)
    expect(view.coins).toBe(0)
    const byKey = Object.fromEntries(view.items.map((i: { key: string }) => [i.key, i]))
    expect(byKey[DEFAULT_THEME]).toMatchObject({ price: 0, unlocked: true, is_default: true })
    expect(byKey['Manga']).toMatchObject({ price: THEME_PRICES.Manga, unlocked: false, is_default: false })
  })

  it('a locked theme falls back to the default when generating', async () => {
    expect(await generate(kid.session, 'Manga')).toBe(DEFAULT_THEME)
  })

  it('insufficient coins: 409 with the missing amount, and no row', async () => {
    await grant(kid.id, 50)
    const response = await unlock(kid.session, 'Manga')
    expect(response.status).toBe(409)
    const body = await response.json()
    expect(body.error).toBe('not enough coins')
    expect(body.missing).toBe(THEME_PRICES.Manga - 50)
    expect(await unlockRows(kid.id)).toHaveLength(0)
  })

  it('rejects an unknown key and refuses to sell the default theme', async () => {
    expect((await unlock(kid.session, 'No Such Theme')).status).toBe(400)
    const free = await unlock(kid.session, DEFAULT_THEME)
    expect(free.status).toBe(400)
    expect(await unlockRows(kid.id)).toHaveLength(0)
  })

  it('unlock charges once; balance = earned - spent; points are untouched; a double unlock is free', async () => {
    await grant(kid.id, 400) // earned 450 in total
    const first = await unlock(kid.session, 'Manga')
    expect(first.status).toBe(200)
    expect((await first.json()).coins).toBe(450 - THEME_PRICES.Manga)

    const again = await unlock(kid.session, 'Manga')
    expect(again.status).toBe(200)
    expect((await again.json()).already_unlocked).toBe(true)
    expect(await unlockRows(kid.id)).toHaveLength(1)

    expect((await rewards(kid.session)).coins).toBe(450 - THEME_PRICES.Manga)
    const home = await (await handlerFor(HomeRoute, 'GET')({ request: req(kid.session.cookie) })).json()
    expect(home.coins).toBe(450 - THEME_PRICES.Manga)
    expect(home.points).toBe(450)
  })

  it('two simultaneous unlock requests charge once', async () => {
    const results = await Promise.all([unlock(kid.session, 'Doodle Journal'), unlock(kid.session, 'Doodle Journal')])
    expect(results.map((r) => r.status)).toEqual([200, 200])
    const doodle = (await unlockRows(kid.id)).filter((r) => r.item_key === 'Doodle Journal')
    expect(doodle).toHaveLength(1)
    expect((await rewards(kid.session)).coins).toBe(450 - THEME_PRICES.Manga - THEME_PRICES['Doodle Journal'])
  })

  it('an unlocked theme is used when generating', async () => {
    expect(await generate(kid.session, 'Manga')).toBe('Manga')
  })

  it("one student cannot see or spend another's coins or unlocks", async () => {
    const view = await rewards(other.session)
    expect(view.coins).toBe(0)
    expect(view.items.find((i: { key: string }) => i.key === 'Manga').unlocked).toBe(false)
    expect((await unlock(other.session, 'Manga')).status).toBe(409)
    expect(await unlockRows(other.id)).toHaveLength(0)
    expect(await generate(other.session, 'Manga')).toBe(DEFAULT_THEME)
    // A parent session has no access to the student-only endpoints.
    expect((await handlerFor(RewardsRoute, 'GET')({ request: req(parent.cookie) })).status).toBe(403)
  })
})
