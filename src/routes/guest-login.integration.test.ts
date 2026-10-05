import { afterAll, describe, expect, it } from 'vitest'
import { createDb } from '../db/connection'
import { auth } from '../lib/auth'
import { Route as GuestRoute } from './api/guest'

type RouteHandler = (opts: { request: Request }) => Promise<Response>

function postGuest(body: unknown): Promise<Response> {
  const handlers = (
    GuestRoute.options.server as { handlers: Record<string, RouteHandler> }
  ).handlers
  return handlers.POST({
    request: new Request('http://localhost/api/guest', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    }),
  })
}

/**
 * "Try as guest" (2026-10-04 request): one tap makes a real student account that is already signed
 * in. The consent declaration is required, and the session works.
 */
describe('guest login', () => {
  const households: Array<string> = []

  afterAll(async () => {
    const db = createDb()
    for (const id of households) {
      await db.deleteFrom('consents').where('household_id', '=', id).execute()
      await db.updateTable('students').set({ user_id: null }).where('household_id', '=', id).execute()
      await db.deleteFrom('users').where('household_id', '=', id).execute()
      await db.deleteFrom('households').where('id', '=', id).execute()
    }
    await db.destroy()
  })

  it('refuses without the parent-or-guardian declaration, and creates nothing', async () => {
    const db = createDb()
    const before = await db
      .selectFrom('users')
      .select((eb) => eb.fn.countAll<string>().as('c'))
      .where('email', 'like', '%@guest.prepplan.invalid')
      .executeTakeFirstOrThrow()
    for (const body of [{}, { guardian_ok: false }, { guardian_ok: 'yes' }]) {
      const response = await postGuest(body)
      expect(response.status).toBe(400)
    }
    const after = await db
      .selectFrom('users')
      .select((eb) => eb.fn.countAll<string>().as('c'))
      .where('email', 'like', '%@guest.prepplan.invalid')
      .executeTakeFirstOrThrow()
    await db.destroy()
    expect(after.c).toBe(before.c)
  })

  it('creates a signed-in student with a profile and a consent record', async () => {
    const response = await postGuest({ guardian_ok: true })
    expect(response.status).toBe(200)
    const cookies = response.headers.getSetCookie()
    expect(cookies.length).toBeGreaterThan(0)

    // The cookie is a real session: it identifies a student.
    const cookie = cookies.map((c) => c.split(';')[0]).join('; ')
    const session = await auth.api.getSession({ headers: new Headers({ cookie }) })
    expect(session).not.toBeNull()
    const user = session!.user as { id: string; email: string } & {
      role?: string
      household_id?: string
    }
    expect(user.role).toBe('student')
    expect(user.email.endsWith('@guest.prepplan.invalid')).toBe(true)
    households.push(user.household_id!)

    const db = createDb()
    const student = await db
      .selectFrom('students')
      .select(['id', 'user_id'])
      .where('household_id', '=', user.household_id!)
      .executeTakeFirstOrThrow()
    expect(student.user_id).toBe(user.id)
    const consent = await db
      .selectFrom('consents')
      .select('id')
      .where('student_id', '=', student.id)
      .execute()
    await db.destroy()
    expect(consent).toHaveLength(1)
  })

  it('gives two taps two different guests', async () => {
    const a = await postGuest({ guardian_ok: true })
    const b = await postGuest({ guardian_ok: true })
    expect(a.status).toBe(200)
    expect(b.status).toBe(200)
    const ids: Array<string> = []
    for (const response of [a, b]) {
      const cookie = response.headers
        .getSetCookie()
        .map((c) => c.split(';')[0])
        .join('; ')
      const session = await auth.api.getSession({ headers: new Headers({ cookie }) })
      const user = session!.user as { id: string; household_id?: string }
      ids.push(user.id)
      households.push(user.household_id!)
    }
    expect(ids[0]).not.toBe(ids[1])
  })
})
