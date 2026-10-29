import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createDb } from '../../db/connection'
import type { Db } from '../../db/connection'
import { Route as CreateRoute } from '../../routes/api/school-signup/create'
import { Route as SignupRoute } from '../../routes/api/school-signup'
import { Route as MeRoute } from '../../routes/api/school-me'
import { SchoolError } from './common'
import { getWizard } from './wizard'
import { loadSchoolScope } from '../school-session'
import {
  createSchoolForSignedInUser,
  signUpSchoolWithEmail,
  startState,
  startedTooMany,
} from './signup'
import type { SignUpInput } from './signup'

type Handler = (o: {
  request: Request
  params: Record<string, string>
}) => Promise<Response>
const call = (
  route: { options: { server?: unknown } },
  method: string,
  cookie: string | null,
  body?: unknown,
) =>
  (route.options.server as { handlers: Record<string, Handler> }).handlers[
    method
  ]({
    request: new Request('http://localhost/x', {
      method,
      headers: {
        ...(cookie ? { cookie } : {}),
        'content-type': 'application/json',
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    }),
    params: {},
  })
const cookieOf = (set: Array<string>) =>
  set.map((c) => c.split(';')[0]).join('; ')
const HIGH = { perHour: 1000, perDay: 1000 }

describe('a school starts itself (e-mail form and the Google follow-up)', () => {
  let db: Db
  const tag = `${Date.now()}`.slice(-8)
  const made: Array<string> = [] // school ids
  const users: Array<string> = []
  const input = (o: Partial<SignUpInput> = {}): SignUpInput => ({
    schoolName: `Signup School ${tag}`,
    city: 'Pune',
    yourName: 'Meera Iyer',
    email: `meera-${tag}@school.test`,
    password: 'a-good-password-1',
    website: '',
    ...o,
  })

  beforeAll(() => {
    db = createDb()
  })
  afterAll(async () => {
    const mem = await db
      .selectFrom('school_members')
      .select('user_id')
      .where(
        'school_id',
        'in',
        made.length ? made : ['00000000-0000-4000-8000-000000000000'],
      )
      .execute()
    const uids = [...new Set([...mem.map((m) => m.user_id), ...users])]
    const hh = uids.length
      ? await db
          .selectFrom('users')
          .select('household_id')
          .where('id', 'in', uids)
          .execute()
      : []
    const sh = made.length
      ? await db
          .selectFrom('schools')
          .select('household_id')
          .where('id', 'in', made)
          .execute()
      : []
    if (uids.length) {
      await db.deleteFrom('sessions').where('user_id', 'in', uids).execute()
      await db.deleteFrom('accounts').where('user_id', 'in', uids).execute()
    }
    if (made.length) {
      await db.deleteFrom('audit_log').where('school_id', 'in', made).execute()
      await db
        .deleteFrom('school_members')
        .where('school_id', 'in', made)
        .execute()
      await db.deleteFrom('schools').where('id', 'in', made).execute()
    }
    if (uids.length)
      await db.deleteFrom('users').where('id', 'in', uids).execute()
    const hids = [
      ...hh.map((h) => h.household_id),
      ...sh.map((h) => h.household_id),
    ]
    if (hids.length)
      await db.deleteFrom('households').where('id', 'in', hids).execute()
    await db.destroy()
  })

  it('the e-mail form makes the school, its first admin and a signed-in session, with an audit line', async () => {
    const r = await signUpSchoolWithEmail(db, input(), new Date(), HIGH)
    expect(r.ok).toBe(true)
    if (!r.ok) return
    made.push(r.schoolId)
    expect(r.setCookies.length).toBeGreaterThan(0)
    const school = await db
      .selectFrom('schools')
      .selectAll()
      .where('id', '=', r.schoolId)
      .executeTakeFirstOrThrow()
    expect(school).toMatchObject({
      name: `Signup School ${tag}`,
      city: 'Pune',
      board: 'CBSE',
      is_demo: false,
      status: 'active',
      wizard_done_at: null,
    })
    expect(school.code).toMatch(/^signup-school-\d+-[a-z2-9]{4}$/)
    const member = await db
      .selectFrom('school_members')
      .select(['role', 'status', 'user_id'])
      .where('school_id', '=', r.schoolId)
      .executeTakeFirstOrThrow()
    expect(member).toMatchObject({ role: 'school_admin', status: 'active' })
    const user = await db
      .selectFrom('users')
      .select(['name', 'email', 'role', 'signup_type'])
      .where('id', '=', member.user_id)
      .executeTakeFirstOrThrow()
    expect(user).toMatchObject({
      name: 'Meera Iyer',
      email: `meera-${tag}@school.test`,
      role: 'teacher',
      signup_type: 'school',
    })
    // a real, usable password: the cookies from the sign-in open the school API
    const me = await call(MeRoute, 'GET', cookieOf(r.setCookies))
    expect(me.status).toBe(200)
    expect(await me.json()).toMatchObject({
      name: 'Meera Iyer',
      start: 'has_school',
      schools: [{ id: r.schoolId, role: 'school_admin' }],
    })
    const log = await db
      .selectFrom('audit_log')
      .select(['action', 'after'])
      .where('school_id', '=', r.schoolId)
      .execute()
    expect(log.map((l) => l.action)).toContain('school.signed_up')
    // the new school starts at the first wizard question, with nothing in it
    const scope = await loadSchoolScope(db, member.user_id, r.schoolId, [
      'school_admin',
    ])
    if (!scope.ok) throw new Error('scope')
    expect(await getWizard(db, scope.scope)).toMatchObject({
      step: 'you',
      done: false,
      termsAccepted: false,
      classes: [],
      studentCount: 0,
    })
    // no student, no household of a student, nothing in the personal app
    expect(
      await db
        .selectFrom('students')
        .select('id')
        .where('user_id', '=', member.user_id)
        .execute(),
    ).toEqual([])
  })

  it('answers with plain sentences for a bad form, never a technical word', async () => {
    const bad = async (o: Partial<SignUpInput>) => {
      const r = await signUpSchoolWithEmail(
        db,
        input({ email: `x-${Math.random()}@school.test`, ...o }),
        new Date(),
        HIGH,
      )
      expect(r.ok).toBe(false)
      return r as { ok: false; status: number; message: string }
    }
    expect((await bad({ schoolName: 'ab' })).message).toMatch(
      /name of your school/,
    )
    expect((await bad({ yourName: 'x' })).message).toMatch(/your name/)
    expect((await bad({ email: 'not-an-email' })).message).toMatch(
      /e-mail address does not look right/,
    )
    expect((await bad({ password: 'short' })).message).toMatch(
      /at least 8 characters/,
    )
    expect((await bad({ password: 'x'.repeat(200) })).status).toBe(400)
    const robot = await bad({ website: 'http://spam.example' })
    expect(robot.status).toBe(400)
    expect(
      await db
        .selectFrom('schools')
        .select('id')
        .where('name', '=', `Signup School ${tag}`)
        .execute(),
    ).toHaveLength(1) // only the first test's school exists
  })

  it('an e-mail that already has an account is refused, and a PrepPlan student or parent can never become a school login', async () => {
    const again = await signUpSchoolWithEmail(db, input(), new Date(), HIGH)
    expect(again).toMatchObject({ ok: false, status: 409 })
    // a personal (student) account
    const hh = await db
      .insertInto('households')
      .values({ name: `Personal ${tag}`, plan: 'free' })
      .returning('id')
      .executeTakeFirstOrThrow()
    const u = await db
      .insertInto('users')
      .values({
        household_id: hh.id,
        name: 'Personal Student',
        email: `personal-${tag}@school.test`,
        role: 'student',
        signup_type: 'student',
      })
      .returning('id')
      .executeTakeFirstOrThrow()
    users.push(u.id)
    const r = await signUpSchoolWithEmail(
      db,
      input({
        email: `personal-${tag}@school.test`,
        schoolName: `Other School ${tag}`,
      }),
      new Date(),
      HIGH,
    )
    expect(r).toMatchObject({ ok: false, status: 409 })
    expect((r as { message: string }).message).toMatch(
      /student or parent account cannot also be a school account/,
    )
    expect(
      await db
        .selectFrom('schools')
        .select('id')
        .where('name', '=', `Other School ${tag}`)
        .execute(),
    ).toEqual([])
    // and as a signed-in personal login she cannot use the "name your school" door
    expect(await startState(db, u.id)).toEqual({ state: 'personal_account' })
    await expect(
      createSchoolForSignedInUser(
        db,
        u.id,
        { schoolName: 'Nope School', city: '' },
        new Date(),
        HIGH,
      ),
    ).rejects.toMatchObject({ code: 'forbidden' })
  })

  it('a school login with no school yet (first Google sign-in) names her school once, and cannot make a second', async () => {
    const hh = await db
      .insertInto('households')
      .values({ name: `Google ${tag}`, plan: 'free' })
      .returning('id')
      .executeTakeFirstOrThrow()
    const u = await db
      .insertInto('users')
      .values({
        household_id: hh.id,
        name: 'Google Admin',
        email: `google-${tag}@school.test`,
        role: 'teacher',
        signup_type: 'school',
      })
      .returning('id')
      .executeTakeFirstOrThrow()
    users.push(u.id)
    expect(await startState(db, u.id)).toEqual({ state: 'can_create' })
    await expect(
      createSchoolForSignedInUser(
        db,
        u.id,
        { schoolName: 'ab', city: '' },
        new Date(),
        HIGH,
      ),
    ).rejects.toBeInstanceOf(SchoolError)
    const r = await createSchoolForSignedInUser(
      db,
      u.id,
      { schoolName: `Google School ${tag}`, city: 'Delhi' },
      new Date(),
      HIGH,
    )
    made.push(r.schoolId)
    const m = await db
      .selectFrom('school_members')
      .select(['role', 'user_id'])
      .where('school_id', '=', r.schoolId)
      .executeTakeFirstOrThrow()
    expect(m).toMatchObject({ role: 'school_admin', user_id: u.id })
    expect(await startState(db, u.id)).toEqual({ state: 'has_school' })
    await expect(
      createSchoolForSignedInUser(
        db,
        u.id,
        { schoolName: `Second School ${tag}`, city: '' },
        new Date(),
        HIGH,
      ),
    ).rejects.toMatchObject({ code: 'conflict' })
    const log = await db
      .selectFrom('audit_log')
      .select('after')
      .where('school_id', '=', r.schoolId)
      .where('action', '=', 'school.signed_up')
      .executeTakeFirstOrThrow()
    expect(log.after).toMatchObject({ via: 'google' })
  })

  it('the routes: sign-up needs no sign-in; the Google follow-up needs one', async () => {
    const ok = await call(SignupRoute, 'POST', null, {
      school_name: `Route School ${tag}`,
      your_name: 'Route Admin',
      email: `route-${tag}@school.test`,
      password: 'a-good-password-1',
    })
    // the real limits apply to the route: other schools were made in the last hour on a busy test database
    expect([200, 429]).toContain(ok.status)
    if (ok.status === 200) {
      const b = (await ok.json()) as { schoolId: string }
      made.push(b.schoolId)
      expect(ok.headers.getSetCookie().length).toBeGreaterThan(0)
    } else
      expect(((await ok.json()) as { message: string }).message).toMatch(
        /Too many schools/,
      )
    const bad = await call(SignupRoute, 'POST', null, { school_name: 'ab' })
    expect(bad.status).toBe(400)
    expect(
      await call(CreateRoute, 'POST', null, { school_name: 'Nobody School' }),
    ).toHaveProperty('status', 401)
    expect((await call(MeRoute, 'GET', null)).status).toBe(401)
  })

  it('the brake: too many schools in an hour or a day are refused with a plain sentence, demo schools do not count', async () => {
    const now = new Date()
    expect(await startedTooMany(db, now, { perHour: 0, perDay: 1000 })).toBe(
      true,
    )
    expect(await startedTooMany(db, now, { perHour: 1000, perDay: 0 })).toBe(
      true,
    )
    expect(await startedTooMany(db, now, HIGH)).toBe(false)
    // a moment far in the future sees none of today's schools
    expect(
      await startedTooMany(db, new Date(now.getTime() + 3 * 86_400_000), {
        perHour: 1,
        perDay: 1,
      }),
    ).toBe(false)
    const r = await signUpSchoolWithEmail(
      db,
      input({ email: `brake-${tag}@school.test` }),
      now,
      { perHour: 0, perDay: 0 },
    )
    expect(r).toMatchObject({ ok: false, status: 429 })
    expect((r as { message: string }).message).toMatch(
      /Too many schools were started just now/,
    )
    expect(
      await db
        .selectFrom('users')
        .select('id')
        .where('email', '=', `brake-${tag}@school.test`)
        .execute(),
    ).toEqual([])
  })
})
