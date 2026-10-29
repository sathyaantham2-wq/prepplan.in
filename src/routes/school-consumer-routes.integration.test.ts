import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createDb } from '../db/connection'
import type { Db } from '../db/connection'
import { schoolsRepository } from '../db/repositories'
import {
  createParentSession,
  deleteSchoolTermsForTest,
  deleteTestCredentials,
  signInSchoolUserForTest,
} from '../db/test-helpers'
import type { TestSession } from '../db/test-helpers'
import { loadSchoolScope } from '../lib/school-session'
import { createSchoolStudent, createSchoolTeacher } from '../lib/schools/people'
import { createClass, createSection } from '../lib/schools/setup'
import { acceptSchoolTerms } from '../lib/schools/terms'
import { resolveEnabledStudent } from '../lib/access'
import type { SchoolScope } from '../db/school-scope'

/**
 * S2b, plan test 16 (part 1): a signed-in school login is refused on EVERY consumer route.
 * The sweep loads every file under src/routes/api, calls every method it exports as a school
 * student and as school staff, and expects 403 { error: 'school_account' }. The only routes left
 * out are the ones that have no signed-in user by design; the list is pinned below so a new
 * route cannot slip into it unnoticed.
 */
type Handler = (opts: {
  request: Request
  params: Record<string, string>
}) => Promise<Response>
interface RouteModule {
  Route?: { options: { server?: { handlers?: Record<string, Handler> } } }
}

// No signed-in user by design: auth endpoints, secret-protected cron, anonymous error/guest/unsubscribe.
const PUBLIC_ROUTES = [
  './api/auth/$.ts',
  './api/cron/daily-nudge.ts',
  './api/cron/weekly-summary.ts',
  './api/errors.ts',
  './api/guest.ts',
  './api/notifications/unsubscribe.ts',
]

// Routes that hide a refusal as a plain 404 on purpose (the signed page-image URL: a bad
// signature, a missing page and a refused viewer must look identical). They still call
// requireRole, which refuses a school login; the static check below pins that.
const REFUSED_AS_404 = ['./api/scan-pages/$pageId.ts']

const modules = import.meta.glob<RouteModule>('./api/**/*.ts')

describe('school logins on consumer routes (S2b)', () => {
  let db: Db
  const tag = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  let schoolId: string
  let householdIds: Array<string> = []
  let studentSession: TestSession
  let staffSession: TestSession
  let parentSession: TestSession
  let studentScope: SchoolScope
  let adminScope: SchoolScope
  const credentialUsers: Array<string> = []

  beforeAll(async () => {
    db = createDb()
    const p = await schoolsRepository.provision(db, {
      name: `Sweep School ${tag}`,
      code: `sweep-${tag}`,
      board: 'CBSE',
      adminName: 'Sweep Admin',
      adminEmail: `sweep-admin-${tag}@school.test`,
    })
    schoolId = p.school.id
    const a = await loadSchoolScope(db, p.adminUserId, schoolId, [
      'school_admin',
    ])
    if (!a.ok) throw new Error('no admin scope')
    adminScope = a.scope
    await acceptSchoolTerms(db, adminScope)
    const cls = await createClass(db, adminScope, 7, '2026-27')
    const sec = await createSection(db, adminScope, cls.id, 'A')
    const created = await createSchoolStudent(db, adminScope, {
      name: 'Sweep Student',
      grade: 7,
      sectionId: sec.id,
      sectionName: 'A',
      rollNo: '1',
      guardianPhone: null,
      guardianName: null,
    })
    const staff = await createSchoolTeacher(db, adminScope, {
      name: 'Sweep Teacher',
      email: `sweep-t-${tag}@school.test`,
    })
    studentSession = await signInSchoolUserForTest(created.user.id)
    staffSession = await signInSchoolUserForTest(staff.user.id)
    credentialUsers.push(created.user.id, staff.user.id)
    parentSession = await createParentSession(`sweep-parent-${tag}`)
    const s = await loadSchoolScope(db, created.user.id, schoolId, ['student'])
    if (!s.ok) throw new Error('no student scope')
    studentScope = s.scope
    householdIds = [created.user.household_id, staff.user.household_id]
  })

  afterAll(async () => {
    await deleteTestCredentials(credentialUsers)
    await db.deleteFrom('audit_log').where('school_id', '=', schoolId).execute()
    await db
      .deleteFrom('school_students')
      .where('school_id', '=', schoolId)
      .execute()
    await db.deleteFrom('students').where('school_id', '=', schoolId).execute()
    await db
      .deleteFrom('school_sections')
      .where('school_id', '=', schoolId)
      .execute()
    await db
      .deleteFrom('school_classes')
      .where('school_id', '=', schoolId)
      .execute()
    await deleteSchoolTermsForTest(db, [schoolId])
    const members = await db
      .selectFrom('school_members')
      .select('user_id')
      .where('school_id', '=', schoolId)
      .execute()
    await db
      .deleteFrom('school_members')
      .where('school_id', '=', schoolId)
      .execute()
    const school = await db
      .selectFrom('schools')
      .select('household_id')
      .where('id', '=', schoolId)
      .executeTakeFirstOrThrow()
    await db.deleteFrom('schools').where('id', '=', schoolId).execute()
    const users = await db
      .selectFrom('users')
      .select('household_id')
      .where(
        'id',
        'in',
        members.map((m) => m.user_id),
      )
      .execute()
    await db
      .deleteFrom('users')
      .where(
        'id',
        'in',
        members.map((m) => m.user_id),
      )
      .execute()
    await db
      .deleteFrom('households')
      .where('id', 'in', [
        school.household_id,
        ...users.map((u) => u.household_id),
        ...householdIds,
      ])
      .execute()
    await db.destroy()
  })

  async function sweep(session: TestSession) {
    const offenders: Array<string> = []
    let calls = 0
    for (const [path, load] of Object.entries(modules)) {
      if (PUBLIC_ROUTES.includes(path) || path.startsWith('./api/schools/'))
        continue
      const mod = await load()
      const handlers = mod.Route?.options.server?.handlers ?? {}
      const params = Object.fromEntries(
        [...path.matchAll(/\$([A-Za-z]+)/g)].map((m) => [
          m[1],
          '00000000-0000-0000-0000-000000000000',
        ]),
      )
      for (const [method, handler] of Object.entries(handlers)) {
        calls++
        const res = await handler({
          request: new Request('http://localhost/x', {
            method,
            headers: {
              cookie: session.cookie,
              'content-type': 'application/json',
            },
            body: method === 'GET' ? undefined : '{}',
          }),
          params,
        })
        const body = (await res.json().catch(() => null)) as {
          error?: string
        } | null
        const expected = REFUSED_AS_404.includes(path) ? 404 : 403
        if (
          res.status !== expected ||
          (expected === 403 && body?.error !== 'school_account')
        )
          offenders.push(`${method} ${path} -> ${res.status}`)
      }
    }
    return { offenders, calls }
  }

  it('finds the routes it is meant to sweep', () => {
    expect(Object.keys(modules).length).toBeGreaterThan(80)
  })

  it('the public-route list is exactly the routes with no sign-in guard of their own', async () => {
    const { readFileSync } = await import('node:fs')
    const unguarded = Object.keys(modules).filter((p) => {
      if (p.startsWith('./api/schools/')) return false
      const src = readFileSync(`src/routes/${p.slice(2)}`, 'utf8')
      return !/require(Role|User)\(/.test(src)
    })
    // These unguarded files delegate to a lib wrapper that calls requireRole, so the sweep covers them.
    const delegated = unguarded.filter((p) => !PUBLIC_ROUTES.includes(p))
    for (const p of delegated) {
      const src = readFileSync(`src/routes/${p.slice(2)}`, 'utf8')
      expect(
        /(assertAdaptiveAccess|resolveScanAccess|loadScan|scan-routes|adaptive\/access)/.test(
          src,
        ) || /from '.*(adaptive\/access|scan-routes)'/.test(src),
        `${p} must delegate to a guarded wrapper`,
      ).toBe(true)
    }
    for (const p of PUBLIC_ROUTES) expect(unguarded, p).toContain(p)
  })

  it('the routes that answer 404 on purpose still sit behind requireRole', async () => {
    const { readFileSync } = await import('node:fs')
    for (const p of REFUSED_AS_404) {
      expect(readFileSync(`src/routes/${p.slice(2)}`, 'utf8'), p).toMatch(
        /requireRole\(/,
      )
    }
  })

  it('a school student is refused on every consumer route', async () => {
    const { offenders, calls } = await sweep(studentSession)
    expect(calls).toBeGreaterThan(80)
    expect(offenders).toEqual([])
  })

  it('school staff are refused on every consumer route', async () => {
    const { offenders } = await sweep(staffSession)
    expect(offenders).toEqual([])
  })

  it('control: an ordinary PrepPlan parent is not refused as a school account', async () => {
    const mod = await modules['./api/students.ts']()
    const res = await mod.Route!.options.server!.handlers!.GET({
      request: new Request('http://localhost/x', {
        headers: { cookie: parentSession.cookie },
      }),
      params: {},
    })
    expect(res.status).toBe(200)
  })

  it('resolveEnabledStudent refuses a school student even if the route guard were bypassed', async () => {
    const res = await resolveEnabledStudent(db, studentScope.userId)
    expect(res).toBeInstanceOf(Response)
    expect((res as Response).status).toBe(403)
    expect(((await (res as Response).json()) as { error: string }).error).toBe(
      'school_account',
    )
  })
})
