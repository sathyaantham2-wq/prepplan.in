import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createDb } from '../db/connection'
import type { Db } from '../db/connection'
import { chaptersRepository, conceptsRepository } from '../db/repositories'
import { createQuestion } from '../lib/questions'
import { createParentSession, createStudentSession } from '../db/test-helpers'
import type { TestSession } from '../db/test-helpers'
import { Route as StudentsRoute } from './api/students'
import { Route as GenerateRoute } from './api/papers/generate'

type RouteHandler = (opts: { request: Request }) => Promise<Response>

function handlerFor(route: { options: { server?: unknown } }, method: string): RouteHandler {
  return (route.options.server as { handlers: Record<string, RouteHandler> }).handlers[method]
}

function post(cookie: string, body: unknown): Request {
  return new Request('http://localhost/test', {
    method: 'POST',
    headers: { cookie, 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
}

/**
 * Owner decision 2026-10-04, end to end: a brand-new student who picks Combined or Written really
 * gets short and long answers in the generated paper -- even though every written question in the
 * bank is Hard or Hardest and she has no history at all.
 */
describe('generating a Combined / Written paper for a brand-new student', () => {
  let db: Db
  let parent: TestSession
  let student: TestSession
  let subjectId: string
  let chapterId: string
  let conceptId: string
  const tag = `combined-gen-${Date.now()}`
  const paperIds: Array<string> = []

  beforeAll(async () => {
    db = createDb()
    parent = await createParentSession('combined-gen')
    const created = await handlerFor(StudentsRoute, 'POST')({
      request: post(parent.cookie, { name: 'Combined Kid', class: 7, board: 'CBSE', consent_accepted: true }),
    })
    const studentId = (await created.json()).id as string
    student = await createStudentSession('combined-gen-student', parent.householdId, studentId)

    const subject = await db.selectFrom('subjects').selectAll().where('code', '=', 'MATH-SEED').executeTakeFirstOrThrow()
    subjectId = subject.id
    const seedChapter = await db
      .selectFrom('chapters')
      .selectAll()
      .where('subject_id', '=', subject.id)
      .where('chapter_no', '=', 1)
      .executeTakeFirstOrThrow()
    const chapterNo = 9000 + Math.floor(Math.random() * 900)
    const chapter = await chaptersRepository.insert(db, {
      subject_id: subject.id,
      source_id: seedChapter.source_id,
      part: 'I',
      chapter_no: chapterNo,
      name: 'Combined generation fixture chapter',
      order_index: chapterNo,
    })
    chapterId = chapter.id
    const concept = await conceptsRepository.insert(db, {
      chapter_id: chapter.id,
      board: 'CBSE',
      class: 7,
      code: `COMB-${Date.now()}`,
      name: 'Combined generation fixture concept',
      difficulty_base: 'Easy',
    })
    conceptId = concept.id

    const base = { concept_id: concept.id, board: 'CBSE' as const, class: 7, created_by: tag }
    for (let i = 0; i < 12; i++) {
      await createQuestion(db, {
        ...base,
        bloom: 'Remember',
        difficulty: 'Easy',
        marks: 1,
        type: 'mcq',
        text: `${tag} mcq ${i}`,
        answer: 'A',
        options: [
          { label: 'A', text: 'right', is_correct: true, order_index: 1 },
          { label: 'B', text: 'wrong', is_correct: false, order_index: 2 },
        ],
      })
    }
    // Written questions are Hard / Hardest in the real bank, never Easy.
    for (let i = 0; i < 5; i++) {
      await createQuestion(db, {
        ...base,
        bloom: 'Apply',
        difficulty: 'Hard',
        marks: 2,
        type: 'short_answer',
        text: `${tag} short ${i}`,
        answer: 'The working.',
        step_marks: [
          { step_no: 1, description: 'Sets up', marks: 1 },
          { step_no: 2, description: 'Answers', marks: 1 },
        ],
      })
    }
    for (let i = 0; i < 3; i++) {
      await createQuestion(db, {
        ...base,
        bloom: 'Create',
        difficulty: 'Hardest',
        marks: 3,
        type: 'long_answer',
        text: `${tag} long ${i}`,
        answer: 'The full working.',
        step_marks: [
          { step_no: 1, description: 'Plans', marks: 1 },
          { step_no: 2, description: 'Works', marks: 1 },
          { step_no: 3, description: 'Concludes', marks: 1 },
        ],
      })
    }
  })

  afterAll(async () => {
    await db.deleteFrom('paper_questions').where('paper_id', 'in', paperIds.length ? paperIds : ['']).execute()
    await db.deleteFrom('papers').where('id', 'in', paperIds.length ? paperIds : ['']).execute()
    await db.deleteFrom('households').where('id', '=', parent.householdId).execute()
    await db.deleteFrom('questions').where('created_by', '=', tag).execute()
    await db.deleteFrom('concepts').where('id', '=', conceptId).execute()
    await db.deleteFrom('chapters').where('id', '=', chapterId).execute()
    await db.destroy()
  })

  async function generate(type: 'combined' | 'written' | 'mcq') {
    const response = await handlerFor(GenerateRoute, 'POST')({
      request: post(student.cookie, {
        adaptive: true,
        subject_id: subjectId,
        chapter_ids: [chapterId],
        adaptive_question_count: 10,
        adaptive_question_type: type,
        recent_usage_window_days: 0,
      }),
    })
    expect(response.status).toBe(201)
    const body = await response.json()
    paperIds.push(body.paper.id)
    const rows = await db
      .selectFrom('paper_questions as pq')
      .innerJoin('questions as q', 'q.id', 'pq.question_id')
      .select(['q.type', 'q.marks'])
      .where('pq.paper_id', '=', body.paper.id)
      .execute()
    const count = (kind: string) => rows.filter((r) => r.type === kind).length
    return { mcq: count('mcq'), short: count('short_answer'), long: count('long_answer'), total: rows.length }
  }

  it('combined: a first paper has 10 multiple choice, 2 short and 1 long answer', async () => {
    expect(await generate('combined')).toEqual({ mcq: 10, short: 2, long: 1, total: 13 })
  })

  it('written: only short and long answers (4 short, 2 long)', async () => {
    expect(await generate('written')).toEqual({ mcq: 0, short: 4, long: 2, total: 6 })
  })

  it('multiple choice: no written questions, as before', async () => {
    expect(await generate('mcq')).toEqual({ mcq: 10, short: 0, long: 0, total: 10 })
  })
})
