import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createDb } from '../db/connection'
import type { Db } from '../db/connection'
import { householdsRepository, studentsRepository } from '../db/repositories'
import { createStudentSession } from '../db/test-helpers'
import type { TestSession } from '../db/test-helpers'
import { Route } from './api/students/me/weekly-card'

type RouteHandler = (opts: { request: Request }) => Promise<Response>

function getHandler(): RouteHandler {
  const handlers = (Route.options.server as { handlers: Record<string, RouteHandler> }).handlers
  return handlers.GET
}

describe('GET /api/students/me/weekly-card', () => {
  let db: Db
  const householdIds: Array<string> = []
  let alice: TestSession
  let bob: TestSession

  async function makeStudent(name: string) {
    const household = await householdsRepository.insert(db, { name: `${name} weekly-card household`, plan: 'free' })
    householdIds.push(household.id)
    const student = await studentsRepository.insert(db, {
      household_id: household.id,
      name,
      class: 7,
      board: 'CBSE',
      target_exams: JSON.stringify([]),
    })
    return createStudentSession('weeklycard', household.id, student.id)
  }

  beforeAll(async () => {
    db = createDb()
    alice = await makeStudent('Alice Fixture')
    bob = await makeStudent('Bob Fixture')
  })

  afterAll(async () => {
    for (const id of householdIds) await db.deleteFrom('households').where('id', '=', id).execute()
    await db.destroy()
  })

  const call = (cookie?: string) =>
    getHandler()({ request: new Request('http://localhost/api/students/me/weekly-card', { headers: cookie ? { cookie } : {} }) })

  it('rejects a request with no session', async () => {
    const res = await call()
    expect(res.ok).toBe(false)
  })

  it('a student with no papers gets zeros and empty lists, no-store', async () => {
    const res = await call(alice.cookie)
    expect(res.status).toBe(200)
    expect(res.headers.get('cache-control')).toBe('no-store')
    const body = await res.json()
    expect(body).toMatchObject({
      student_first_name: 'Alice',
      class_label: 'Class 7',
      papers_submitted: 0,
      marks_won_back: 0,
      strongest_chapters: [],
      chapters_to_work_on: [],
      streak_days: 0,
    })
    expect(body.week_start).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(body.week_end).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('returns only the signed-in student own data', async () => {
    const b = await (await call(bob.cookie)).json()
    const a = await (await call(alice.cookie)).json()
    expect(b.student_first_name).toBe('Bob')
    expect(a.student_first_name).toBe('Alice')
  })
})
