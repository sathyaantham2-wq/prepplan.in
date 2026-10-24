import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createDb } from '../db/connection'
import type { Db } from '../db/connection'
import {
  attemptAnswersRepository,
  attemptsRepository,
  blueprintsRepository,
  conceptsRepository,
} from '../db/repositories'
import { createQuestion } from '../lib/questions'
import { generatePaper } from '../lib/papers'
import { confirmEvaluation, createEvaluation } from '../lib/evaluation'
import { createParentSession, createStudentSession } from '../db/test-helpers'
import type { TestSession } from '../db/test-helpers'
import type { StudentHomeData } from '../lib/student-home-types'
import { Route as StudentsRoute } from './api/students'
import { Route as HomeRoute } from './api/students/me/home'
import { Route as OptInRoute } from './api/students/me/leaderboard-opt-in'

type RouteHandler = (opts: { request: Request; params?: Record<string, string> }) => Promise<Response>
function handlerFor(route: { options: { server?: unknown } }, method: string): RouteHandler {
  return (route.options.server as { handlers: Record<string, RouteHandler> }).handlers[method]
}
function req(cookie: string, body?: unknown, method?: string): Request {
  return new Request('http://localhost/test', {
    method: method ?? (body ? 'POST' : 'GET'),
    headers: { cookie, ...(body ? { 'content-type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  })
}

/**
 * GET /api/students/me/home, the new Home shape: mission, won back, Fix-it, Mark Map, recent
 * papers, leaderboard and exam. One student with real marked papers, one brand-new student with
 * nothing, and an opted-in classmate whose numbers must never leak.
 */
describe('student home payload', () => {
  let db: Db
  let parent: TestSession
  let kid: { id: string; session: TestSession }
  let fresh: { id: string; session: TestSession }
  let mate: { id: string; session: TestSession }
  let chapterId: string
  let subjectIdForKid = ''
  let conceptId: string
  let questionId: string
  let blueprintId: string
  const paperIds: Array<string> = []
  const attemptIds: Array<string> = []
  const evaluationIds: Array<string> = []
  let lostItemId = ''
  let lostEvaluationId = ''
  let lostAttemptId = ''
  let wonAttemptId = ''

  const home = async (s: TestSession) => {
    const res = await handlerFor(HomeRoute, 'GET')({ request: req(s.cookie) })
    expect(res.status).toBe(200)
    return (await res.json()) as StudentHomeData
  }

  /** Generate, answer (A is right), submit, evaluate and confirm one one-question paper. */
  async function runPaper(studentId: string, selected: 'A' | 'B') {
    const generated = await generatePaper(db, { student_id: studentId, blueprint_id: blueprintId, chapter_ids: [chapterId], recentUsageWindowDays: 0 })
    expect(generated.paperQuestions).toHaveLength(1)
    paperIds.push(generated.paper.id)
    const attempt = await attemptsRepository.insert(db, { paper_id: generated.paper.id, student_id: studentId, mode: 'online', status: 'in_progress' })
    attemptIds.push(attempt.id)
    await attemptAnswersRepository.upsert(db, { attempt_id: attempt.id, paper_question_id: generated.paperQuestions[0].id, selected_option: selected, source: 'typed' })
    await attemptsRepository.update(db, studentId, attempt.id, { status: 'submitted', submitted_at: new Date(), duration_used_sec: 30 })
    const evaluation = await createEvaluation(db, attempt.id)
    evaluationIds.push(evaluation.evaluation.id)
    await confirmEvaluation(db, evaluation.evaluation.id)
    return { attemptId: attempt.id, evaluationId: evaluation.evaluation.id }
  }

  beforeAll(async () => {
    db = createDb()
    parent = await createParentSession('home-payload')
    const make = async (name: string, exams?: unknown) => {
      const response = await handlerFor(StudentsRoute, 'POST')({
        request: req(parent.cookie, { name, class: 7, board: 'CBSE', consent_accepted: true, ...(exams ? { target_exams: exams } : {}) }),
      })
      const id = (await response.json()).id as string
      return { id, session: await createStudentSession(`home-${name.split(' ')[0].toLowerCase()}`, parent.householdId, id) }
    }
    kid = await make('Homekid One')
    fresh = await make('Homekid Fresh')
    mate = await make('Homekid Mate')

    const subject = await db.selectFrom('subjects').selectAll().where('code', '=', 'MATH-SEED').executeTakeFirstOrThrow()
    subjectIdForKid = subject.id
    const anyChapter = await db.selectFrom('chapters').select('source_id').where('subject_id', '=', subject.id).executeTakeFirstOrThrow()
    const chapter = await db
      .insertInto('chapters')
      .values({ subject_id: subject.id, source_id: anyChapter.source_id, part: 'I', chapter_no: 9000 + Math.floor(Math.random() * 90000), name: 'Home payload fixture chapter', order_index: 9000 })
      .returningAll()
      .executeTakeFirstOrThrow()
    chapterId = chapter.id
    const concept = await conceptsRepository.insert(db, {
      chapter_id: chapter.id,
      board: 'CBSE',
      class: 7,
      code: `C7M-1.HP-${Date.now()}`,
      name: 'Home payload fixture concept',
      difficulty_base: 'Easy',
    })
    conceptId = concept.id
    const q = await createQuestion(db, {
      concept_id: concept.id,
      board: 'CBSE',
      class: 7,
      bloom: 'Remember',
      difficulty: 'Easy',
      marks: 2,
      type: 'mcq',
      text: 'Home payload fixture question',
      answer: '1',
      created_by: 'home-payload-fixture',
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
      name: 'Home payload fixture blueprint',
      duration_min: 10,
      total_marks: 2,
      sections: JSON.stringify([{ name: 'Section A', marks_per_question: 2, count: 1, bloom_allowed: ['Remember'] }]),
      bloom_targets: JSON.stringify({ Remember: 100, Understand: 0, Apply: 0, Analyse: 0, Evaluate: 0, Create: 0 }),
    })
    blueprintId = blueprint.id

    await db.insertInto('student_subjects').values([{ student_id: kid.id, subject_id: subject.id }, { student_id: mate.id, subject_id: subject.id }]).execute()

    // Paper 1: wrong, then moved back 10 days (before this week and before today).
    const lost = await runPaper(kid.id, 'B')
    lostAttemptId = lost.attemptId
    lostEvaluationId = lost.evaluationId
    await db.updateTable('evaluations').set({ confirmed_at: new Date(Date.now() - 10 * 86400000) }).where('id', '=', lost.evaluationId).execute()
    await db.updateTable('attempts').set({ submitted_at: new Date(Date.now() - 10 * 86400000) }).where('id', '=', lost.attemptId).execute()
    lostItemId = (await db.selectFrom('evaluation_items').select('id').where('evaluation_id', '=', lost.evaluationId).executeTakeFirstOrThrow()).id
    // Paper 2: right, today. Wins the concept back.
    const won = await runPaper(kid.id, 'A')
    wonAttemptId = won.attemptId

    // Classmate: one right paper so she has points, opted in.
    await runPaper(mate.id, 'A')
    const opt = await handlerFor(OptInRoute, 'PATCH')({ request: req(mate.session.cookie, { opt_in: true }, 'PATCH') })
    expect(opt.status).toBe(200)
  })

  afterAll(async () => {
    const students = [kid.id, fresh.id, mate.id]
    await db.deleteFrom('fixit_cards').where('student_id', 'in', students).execute()
    await db.deleteFrom('student_points_ledger').where('student_id', 'in', students).execute()
    await db.deleteFrom('evaluation_items').where('evaluation_id', 'in', evaluationIds).execute()
    await db.deleteFrom('evaluations').where('id', 'in', evaluationIds).execute()
    await db.deleteFrom('attempt_answers').where('attempt_id', 'in', attemptIds).execute()
    await db.deleteFrom('attempts').where('id', 'in', attemptIds).execute()
    await db.deleteFrom('paper_questions').where('paper_id', 'in', paperIds).execute()
    await db.deleteFrom('papers').where('id', 'in', paperIds).execute()
    await db.deleteFrom('households').where('id', '=', parent.householdId).execute()
    await db.deleteFrom('blueprints').where('id', '=', blueprintId).execute()
    await db.deleteFrom('questions').where('id', '=', questionId).execute()
    await db.deleteFrom('concepts').where('id', '=', conceptId).execute()
    await db.deleteFrom('chapters').where('id', '=', chapterId).execute()
    await db.destroy()
  })

  it('a brand-new student gets every card in a safe empty state', async () => {
    const h = await home(fresh.session)
    expect(h.week).toHaveLength(7)
    expect(h.points).toBe(0)
    expect(h.coins).toBe(0)
    expect(h.in_progress).toBeNull()
    expect(h.marks_story).toBeNull()
    expect(h.mission.steps.map((s) => s.key)).toEqual(['check', 'fixit', 'paper'])
    expect(h.mission.steps.find((s) => s.key === 'check')?.done).toBe(false)
    expect(h.mission.steps.find((s) => s.key === 'paper')?.done).toBe(false)
    // She has never had a Fix-it card, so the step waits for her first marked paper instead of counting as done.
    const fixitStep = h.mission.steps.find((s) => s.key === 'fixit')
    expect(fixitStep).toMatchObject({ done: false, waiting: true, hint: 'Appears after your first marked paper', href: '/fix-it' })
    expect(h.mission.done_count).toBe(0)
    expect(h.won_back).toEqual({ total: 0, items: [] })
    expect(h.fixit).toEqual({ due: 0, answered_today: 0, mastered_total: 0, total_cards_ever: 0 })
    expect(h.mark_map).toEqual({ knowledge: { total: 0, concepts: [] }, habit: { total: 0, concepts: [] } })
    expect(h.recent_papers).toEqual([])
    expect(h.leaderboard).toEqual({ opted_in: false, rank: null, class_size: null, top: [] })
    expect(h.exam).toBeNull()
  })

  it('a student with marked papers: won back, mark map, recent papers, mission, fix-it', async () => {
    const h = await home(kid.session)
    expect(h.points).toBeGreaterThan(0)

    expect(h.won_back.total).toBe(2)
    expect(h.won_back.items).toEqual([{ concept_name: 'Home payload fixture concept', subject_name: expect.any(String), marks_back: 2 }])

    // The wrong paper is inside 30 days: 2 marks lost to a knowledge gap, none to habit.
    expect(h.mark_map.knowledge.total).toBe(2)
    expect(h.mark_map.knowledge.concepts).toEqual([
      { concept_id: conceptId, concept_name: 'Home payload fixture concept', subject_name: expect.any(String), marks_lost: 2 },
    ])
    expect(h.mark_map.habit).toEqual({ total: 0, concepts: [] })

    expect(h.recent_papers.map((p) => p.attempt_id)).toEqual([wonAttemptId, lostAttemptId])
    expect(h.recent_papers[0]).toMatchObject({ scored: 2, total: 2 })
    expect(h.recent_papers[1]).toMatchObject({ scored: 0, total: 2 })
    expect(new Date(h.recent_papers[0].confirmed_at).getTime()).toBeGreaterThan(new Date(h.recent_papers[1].confirmed_at).getTime())

    // The lost mark opened one Fix-it card, so a card is waiting and the step is not done.
    expect(h.fixit.due).toBe(1)
    const byKey = Object.fromEntries(h.mission.steps.map((s) => [s.key, s]))
    expect(byKey.fixit).toMatchObject({ done: false, hint: '1 card waiting', href: '/fix-it' })
    // One paper submitted today: the quick check is done, the extra paper is not.
    expect(byKey.check.done).toBe(true)
    expect(byKey.check.label).toBe('Quick check')
    expect(byKey.check.href).toBe(`/my-paper?subject=${subjectIdForKid}`)
    expect(byKey.check.hint.length).toBeGreaterThan(0)
    expect(byKey.paper).toMatchObject({ done: false, label: 'One short paper', href: '/my-paper' })
    expect(h.mission.done_count).toBe(1)
    expect(h.exam).toBeNull()
  })

  it('a delivery-habit loss lands under habit, and answering the card completes the Fix-it step', async () => {
    await db.updateTable('evaluation_items').set({ knowledge_known: true }).where('id', '=', lostItemId).execute()
    let h = await home(kid.session)
    expect(h.mark_map.habit.total).toBe(2)
    expect(h.mark_map.habit.concepts).toHaveLength(1)
    expect(h.mark_map.knowledge).toEqual({ total: 0, concepts: [] })

    // Reading Discipline is a habit too, even if she did not know it.
    await db.updateTable('evaluation_items').set({ knowledge_known: false, error_type: 'Reading Discipline' }).where('id', '=', lostItemId).execute()
    h = await home(kid.session)
    expect(h.mark_map.habit.total).toBe(2)

    // Removed from her grade: no longer a lost mark anywhere on the Home.
    await db.updateTable('evaluation_items').set({ excluded_by_student: true }).where('id', '=', lostItemId).execute()
    h = await home(kid.session)
    expect(h.mark_map.habit.total).toBe(0)
    expect(h.won_back.total).toBe(0)
    await db.updateTable('evaluation_items').set({ excluded_by_student: false, error_type: null, knowledge_known: null }).where('id', '=', lostItemId).execute()

    const card = await db.selectFrom('fixit_cards').select('id').where('student_id', '=', kid.id).executeTakeFirstOrThrow()
    await db.insertInto('fixit_answers').values({ card_id: card.id, question_id: questionId, correct: true }).execute()
    await db.updateTable('fixit_cards').set({ status: 'mastered' }).where('id', '=', card.id).execute()
    h = await home(kid.session)
    expect(h.fixit).toEqual({ due: 0, answered_today: 1, mastered_total: 1, total_cards_ever: 1 })
    // Only mastered cards and nothing due: she has had cards before, so the step is done.
    expect(h.mission.steps.find((s) => s.key === 'fixit')?.done).toBe(true)
    // The mission counts a second paper submitted today as the "short paper" step.
    await db.updateTable('attempts').set({ submitted_at: new Date() }).where('id', '=', lostAttemptId).execute()
    h = await home(kid.session)
    expect(h.mission.steps.find((s) => s.key === 'paper')?.done).toBe(true)
    expect(h.mission.done_count).toBe(3)
    void lostEvaluationId
  })

  it('exam: the nearest upcoming exam, skipping past ones', async () => {
    const day = (offset: number) => new Date(Date.now() + offset * 86400000).toISOString().slice(0, 10)
    await db
      .updateTable('students')
      .set({ target_exams: JSON.stringify([{ name: 'Old test', date: day(-5) }, { name: 'Later exam', date: day(40) }, { name: 'Soon exam', date: day(10) }]) })
      .where('id', '=', kid.id)
      .execute()
    const h = await home(kid.session)
    expect(h.exam).toMatchObject({ exam_name: 'Soon exam', exam_date: day(10) })
    expect(h.exam?.days_remaining).toBeGreaterThanOrEqual(9)
    expect(h.exam?.days_remaining).toBeLessThanOrEqual(11)
    expect(typeof h.exam?.untested_chapters).toBe('number')
  })

  it('leaderboard: not opted in shows nothing of anyone else; opted in shows rank, size and nicknames', async () => {
    let h = await home(kid.session)
    expect(h.leaderboard).toEqual({ opted_in: false, rank: null, class_size: null, top: [] })
    expect(JSON.stringify(h)).not.toContain('Homekid')

    const mateHome = await home(mate.session)
    expect(mateHome.leaderboard.opted_in).toBe(true)
    expect(mateHome.leaderboard.top.some((t) => t.is_you)).toBe(true)
    expect(mateHome.leaderboard.rank).not.toBeNull()
    expect(mateHome.leaderboard.class_size).toBeGreaterThanOrEqual(1)
    expect(mateHome.leaderboard.top.length).toBeLessThanOrEqual(3)
    // Never a real name.
    expect(JSON.stringify(mateHome.leaderboard)).not.toContain('Homekid')
    // And never the other student's marks or papers.
    expect(mateHome.recent_papers.map((p) => p.attempt_id)).not.toContain(wonAttemptId)
    expect(mateHome.won_back.total).toBe(0)
    expect(mateHome.mark_map.knowledge.total).toBe(0)

    // Once she opts in too, she appears in the cohort.
    const opt = await handlerFor(OptInRoute, 'PATCH')({ request: req(kid.session.cookie, { opt_in: true }, 'PATCH') })
    expect(opt.status).toBe(200)
    h = await home(kid.session)
    expect(h.leaderboard.opted_in).toBe(true)
    expect(h.leaderboard.class_size).toBeGreaterThanOrEqual(2)
    expect(h.leaderboard.top.filter((t) => t.is_you)).toHaveLength(1)
  })
})
