import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createDb } from '../db/connection'
import type { Db } from '../db/connection'
import { createCivilFixture } from '../db/civil-test-fixture'
import type { CivilFixture } from '../db/civil-test-fixture'
import { createParentSession, createStudentSession, promoteToAdmin } from '../db/test-helpers'
import type { TestSession } from '../db/test-helpers'
import { STUDENT_DAILY_GENERATION_COST_CAP_INR } from '../lib/ai-metering'
import { Route as StudentsRoute } from './api/students'
import { Route as GenerateCivilRoute } from './api/papers/generate-civil'

type RouteHandler = (opts: { request: Request }) => Promise<Response>

function handlerFor(route: { options: { server?: unknown } }, method: string): RouteHandler {
  return (route.options.server as { handlers: Record<string, RouteHandler> }).handlers[method]
}

function post(cookie: string | null, body: unknown): Request {
  return new Request('http://localhost/test', {
    method: 'POST',
    headers: { ...(cookie ? { cookie } : {}), 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
}

const generate = (cookie: string | null, body: unknown) =>
  handlerFor(GenerateCivilRoute, 'POST')({ request: post(cookie, body) })
const GOOD = { question_count: 10, subject_codes: ['POLITY'] }

/**
 * F132: POST /api/papers/generate-civil -- who may call it, the consent and spend gates, and that
 * nothing in the response gives an answer away.
 */
describe('POST /api/papers/generate-civil (F132)', () => {
  let db: Db
  let fixture: CivilFixture
  let parent: TestSession
  let admin: TestSession
  let civil: TestSession
  let civilId: string
  let noConsent: TestSession
  let noConsentId: string
  let capped: TestSession
  let cappedId: string
  let school: TestSession
  const tag = `civil-route-${Date.now()}`

  async function makeStudent(p: TestSession, body: { board: string; class: number }, label: string) {
    const response = await handlerFor(StudentsRoute, 'POST')({
      request: post(p.cookie, { name: label, consent_accepted: true, ...body }),
    })
    const id = (await response.json()).id as string
    return { id, session: await createStudentSession(label, p.householdId, id) }
  }

  beforeAll(async () => {
    db = createDb()
    fixture = await createCivilFixture(db, { tag, chapters: [[20, 20], [20]], decoys: true })
    parent = await createParentSession('civil-route')
    admin = await createParentSession('civil-route-admin')
    await promoteToAdmin(admin.userId)
    // Re-sign-in is not needed: requireRole reads the role from the database on each request.

    const a = await makeStudent(parent, { board: 'CIVILS', class: 0 }, 'civil-ok')
    civil = a.session
    civilId = a.id
    const b = await makeStudent(parent, { board: 'CIVILS', class: 0 }, 'civil-noconsent')
    noConsent = b.session
    noConsentId = b.id
    await db.updateTable('consents').set({ withdrawn_at: new Date() }).where('student_id', '=', noConsentId).execute()
    const c = await makeStudent(parent, { board: 'CIVILS', class: 0 }, 'civil-capped')
    capped = c.session
    cappedId = c.id
    await db
      .insertInto('ai_jobs')
      .values({
        household_id: parent.householdId,
        student_id: cappedId,
        feature: 'AI-01',
        model: 'claude-sonnet-5',
        status: 'success',
        latency_ms: 1,
        cost_inr: STUDENT_DAILY_GENERATION_COST_CAP_INR,
      })
      .execute()
    const d = await makeStudent(parent, { board: 'CBSE', class: 7 }, 'school-kid')
    school = d.session
  })

  afterAll(async () => {
    const students = await db.selectFrom('students').select('id').where('household_id', '=', parent.householdId).execute()
    const studentIds = students.map((s) => s.id)
    await db.deleteFrom('question_usage').where('student_id', 'in', studentIds).execute()
    const papers = await db.selectFrom('papers').select('id').where('student_id', 'in', studentIds).execute()
    if (papers.length > 0) {
      await db.deleteFrom('paper_questions').where('paper_id', 'in', papers.map((p) => p.id)).execute()
      await db.deleteFrom('papers').where('id', 'in', papers.map((p) => p.id)).execute()
    }
    await db.deleteFrom('generation_events').where('student_id', 'in', studentIds).execute()
    await db.deleteFrom('ai_jobs').where('student_id', 'in', studentIds).execute()
    await db.deleteFrom('households').where('id', 'in', [parent.householdId, admin.householdId]).execute()
    await fixture.cleanup()
    await db.destroy()
  })

  it('gives a Civil Services student a paper of the requested size, with no answers in the response', async () => {
    const response = await generate(civil.cookie, { question_count: 15, subject_codes: ['POLITY'] })
    expect(response.status).toBe(201)
    const text = await response.text()
    const body = JSON.parse(text)
    expect(body.paperQuestions).toHaveLength(15)
    expect(body.paper.student_id).toBe(civilId)
    expect(body.paper.subject_id).toBe(fixture.subjectId)
    expect(body.shortfalls).toEqual([])
    // Nothing that could carry the key, the options' correctness or an explanation.
    expect(text).not.toMatch(/is_correct|"answer"|explanation|"options"|"text"/)
    for (const q of body.paperQuestions) {
      expect(Object.keys(q).sort()).toEqual(
        ['choice_group', 'created_at', 'expected_words', 'id', 'marks', 'paper_id', 'position', 'question_id', 'section', 'slot'].sort(),
      )
    }
    // The generation is on the books for the student's own history.
    const events = await db.selectFrom('generation_events').select('student_id').where('student_id', '=', civilId).execute()
    expect(events).toHaveLength(1)
  })

  it('a paper too big for the bank is still returned, with the shortfall reported', async () => {
    // 60 civil questions in the fixture; 15 were used above, so 30 + 30 leaves the second short.
    const first = await generate(civil.cookie, { question_count: 30, subject_codes: ['POLITY'] })
    expect(first.status).toBe(201)
    const second = await generate(civil.cookie, { question_count: 30, subject_codes: ['POLITY'] })
    expect(second.status).toBe(201)
    const body = await second.json()
    expect(body.paperQuestions).toHaveLength(15)
    expect(body.shortfalls).toHaveLength(1)
  })

  it('a parent is refused', async () => {
    expect((await generate(parent.cookie, GOOD)).status).toBe(403)
  })

  it('an admin is refused', async () => {
    expect((await generate(admin.cookie, GOOD)).status).toBe(403)
  })

  it('an unauthenticated caller is refused (T01)', async () => {
    expect((await generate(null, GOOD)).status).toBe(401)
  })

  it('a school (non-CIVILS) student is refused', async () => {
    const response = await generate(school.cookie, GOOD)
    expect(response.status).toBe(403)
    expect((await response.json()).error).toMatch(/Civil Services/)
  })

  it('a student with no active consent is refused', async () => {
    const response = await generate(noConsent.cookie, GOOD)
    expect(response.status).toBe(403)
    expect((await response.json()).error).toMatch(/consent/i)
  })

  it('a student at her daily spend cap gets the friendly 429', async () => {
    const response = await generate(capped.cookie, GOOD)
    expect(response.status).toBe(429)
    expect((await response.json()).error).toBe('spend_cap_exceeded')
  })

  it('rejects a bad size, an unknown subject and a body-supplied student or subject id', async () => {
    expect((await generate(civil.cookie, { question_count: 20, subject_codes: ['POLITY'] })).status).toBe(400)
    expect((await generate(civil.cookie, { question_count: 10, subject_codes: ['GEOGRAPHY'] })).status).toBe(400)
    expect((await generate(civil.cookie, { question_count: 10, subject_codes: [] })).status).toBe(400)
    expect((await generate(civil.cookie, { question_count: 10 })).status).toBe(400)
    // An extra student_id is ignored (strip), never trusted: the paper is still hers.
    const response = await generate(civil.cookie, { ...GOOD, student_id: noConsentId, subject_id: noConsentId })
    expect(response.status).toBe(201)
    expect((await response.json()).paper.student_id).toBe(civilId)
  })
})
