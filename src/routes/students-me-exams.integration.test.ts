import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createDb } from '../db/connection'
import type { Db } from '../db/connection'
import { createParentSession, createStudentSession } from '../db/test-helpers'
import type { TestSession } from '../db/test-helpers'
import { Route as StudentsRoute } from './api/students'
import { Route as ExamsRoute } from './api/students/me/exams'
import { Route as ExamCountdownRoute } from './api/exam-countdown'

type RouteHandler = (opts: { request: Request }) => Promise<Response>

function handlerFor(route: { options: { server?: unknown } }, method: string): RouteHandler {
  return (route.options.server as { handlers: Record<string, RouteHandler> }).handlers[method]
}

function req(cookie: string, method: string, body?: unknown): Request {
  return new Request('http://localhost/test', {
    method,
    headers: { cookie, ...(body ? { 'content-type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  })
}

function daysFromNow(n: number): string {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

describe('student sets her own exam dates', () => {
  let db: Db
  let parent: TestSession
  let me: TestSession
  let other: TestSession
  let meId: string
  let otherId: string
  const otherExams = [{ name: 'Other Exam', date: daysFromNow(20) }]

  const put = (cookie: string, body: unknown) => handlerFor(ExamsRoute, 'PUT')({ request: req(cookie, 'PUT', body) })

  beforeAll(async () => {
    db = createDb()
    parent = await createParentSession('stuexams')
    const mk = async (name: string, exams?: unknown) => {
      const r = await handlerFor(StudentsRoute, 'POST')({
        request: req(parent.cookie, 'POST', {
          name, class: 7, board: 'CBSE', consent_accepted: true, ...(exams ? { target_exams: exams } : {}),
        }),
      })
      return (await r.json()).id as string
    }
    meId = await mk('Exams Me')
    otherId = await mk('Exams Other', otherExams)
    me = await createStudentSession('stuexams-me', parent.householdId, meId)
    other = await createStudentSession('stuexams-other', parent.householdId, otherId)
  })

  afterAll(async () => {
    await db.deleteFrom('households').where('id', '=', parent.householdId).execute()
    await db.destroy()
  })

  it('starts empty and saves, trims and sorts her list', async () => {
    const first = await handlerFor(ExamsRoute, 'GET')({ request: req(me.cookie, 'GET') })
    expect((await first.json()).exams).toEqual([])
    const r = await put(me.cookie, {
      exams: [
        { name: ' Annual exam ', date: daysFromNow(60) },
        { name: 'Half-yearly', date: daysFromNow(15) },
      ],
    })
    expect(r.status).toBe(200)
    expect((await r.json()).exams).toEqual([
      { name: 'Half-yearly', date: daysFromNow(15) },
      { name: 'Annual exam', date: daysFromNow(60) },
    ])
  })

  it('is what /api/exam-countdown then reports, and leaves the rest of her profile alone', async () => {
    const r = await handlerFor(ExamCountdownRoute, 'GET')({ request: req(me.cookie, 'GET') })
    const body = await r.json()
    expect(body.countdowns.map((c: { exam_name: string; days_remaining: number }) => [c.exam_name, c.days_remaining]))
      .toEqual([['Half-yearly', 15], ['Annual exam', 60]])
    const row = await db.selectFrom('students').select(['name', 'class', 'board']).where('id', '=', meId).executeTakeFirstOrThrow()
    expect(row).toEqual({ name: 'Exams Me', class: 7, board: 'CBSE' })
  })

  it('never touches another student, and writes an audit entry', async () => {
    const row = await db.selectFrom('students').select('target_exams').where('id', '=', otherId).executeTakeFirstOrThrow()
    expect(row.target_exams).toEqual(otherExams)
    const log = await db.selectFrom('audit_log').select('action').where('entity_id', '=', meId).where('action', '=', 'student.exams_updated').execute()
    expect(log.length).toBeGreaterThan(0)
    const seen = await handlerFor(ExamsRoute, 'GET')({ request: req(other.cookie, 'GET') })
    expect((await seen.json()).exams).toEqual(otherExams)
  })

  it('removing an exam works by sending the shorter list', async () => {
    const r = await put(me.cookie, { exams: [] })
    expect((await r.json()).exams).toEqual([])
  })

  it.each([
    ['a bad date', [{ name: 'X', date: '2026-02-30' }]],
    ['a blank name', [{ name: '   ', date: daysFromNow(5) }]],
    ['a date over 400 days back', [{ name: 'X', date: daysFromNow(-401) }]],
    ['a date over 800 days ahead', [{ name: 'X', date: daysFromNow(801) }]],
    ['more than 5 exams', Array.from({ length: 6 }, (_, i) => ({ name: `E${i}`, date: daysFromNow(5 + i) }))],
    ['a duplicate', [{ name: 'X', date: daysFromNow(5) }, { name: 'x', date: daysFromNow(5) }]],
  ])('refuses %s with 400 and saves nothing', async (_label, exams) => {
    await put(me.cookie, { exams: [{ name: 'Keep', date: daysFromNow(9) }] })
    const r = await put(me.cookie, { exams })
    expect(r.status).toBe(400)
    expect(typeof (await r.json()).error).toBe('string')
    const row = await db.selectFrom('students').select('target_exams').where('id', '=', meId).executeTakeFirstOrThrow()
    expect(row.target_exams).toEqual([{ name: 'Keep', date: daysFromNow(9) }])
  })

  it('refuses a parent session', async () => {
    expect((await put(parent.cookie, { exams: [] })).status).toBe(403)
    const g = await handlerFor(ExamsRoute, 'GET')({ request: req(parent.cookie, 'GET') })
    expect(g.status).toBe(403)
  })

  it('answers 423 while her access is paused', async () => {
    await db.updateTable('students').set({ access_enabled: false }).where('id', '=', meId).execute()
    expect((await put(me.cookie, { exams: [] })).status).toBe(423)
    await db.updateTable('students').set({ access_enabled: true }).where('id', '=', meId).execute()
  })
})
