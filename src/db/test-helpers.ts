import { auth } from '../lib/auth'
import { sql } from 'kysely'
import { createDb } from './connection'
import type { Db } from './connection'

/**
 * Shared fixture helpers for integration tests that need a real, working session — not a mock —
 * so route handlers exercise their actual auth.api.getSession() call. Everything here goes
 * through better-auth's in-process API (auth.api.*), the same functions the real /api/auth/$
 * catch-all route calls, rather than reaching into the database directly, so a real session
 * cookie comes out the other end.
 */

export const TEST_PASSWORD = 'correcthorsebatterystaple'

export interface TestSession {
  cookie: string
  userId: string
  householdId: string
  email: string
  password: string
}

/** Signs up and signs in (there is no email confirmation step). Every fresh sign-up is a parent
 * starting a new household, per the databaseHooks in src/lib/auth.ts. */
export async function createParentSession(
  namePrefix: string,
): Promise<TestSession> {
  const email = `${namePrefix}-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`

  const signUp = await auth.api.signUpEmail({
    body: { email, password: TEST_PASSWORD, name: `${namePrefix} test user` },
  })

  const signIn = await auth.api.signInEmail({
    body: { email, password: TEST_PASSWORD },
    asResponse: true,
  })
  const cookie = signIn.headers.get('set-cookie')
  if (!cookie) throw new Error('Sign-in did not return a session cookie')

  // household_id is typed loosely by better-auth's additionalFields (it doesn't know our
  // databaseHooks always sets it) — asserted here since it's genuinely never absent in practice.
  const householdId = signUp.user.household_id as string

  return {
    cookie: cookie.split(';')[0],
    userId: signUp.user.id,
    householdId,
    email,
    password: TEST_PASSWORD,
  }
}

/**
 * There's no self-service student login yet (F112 isn't built), so this mirrors exactly what
 * every manual verification this session did by hand: insert a student-role user + credential
 * account directly, link it to the student profile, then sign in for real through better-auth so
 * the resulting session is genuine.
 */
export async function createStudentSession(
  namePrefix: string,
  householdId: string,
  studentId: string,
): Promise<TestSession> {
  const { hashPassword } = await import('better-auth/crypto')
  const db = createDb()
  try {
    const email = `${namePrefix}-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`
    const hash = await hashPassword(TEST_PASSWORD)

    const user = await db
      .insertInto('users')
      .values({
        household_id: householdId,
        email,
        name: `${namePrefix} test student`,
        role: 'student',
        email_verified: true,
      })
      .returningAll()
      .executeTakeFirstOrThrow()

    await db
      .insertInto('accounts')
      .values({
        issuer: 'local:credential',
        account_id: user.id,
        provider_id: 'credential',
        user_id: user.id,
        password: hash,
      })
      .execute()

    await db
      .updateTable('students')
      .set({ user_id: user.id })
      .where('id', '=', studentId)
      .execute()

    const signIn = await auth.api.signInEmail({
      body: { email, password: TEST_PASSWORD },
      asResponse: true,
    })
    const cookie = signIn.headers.get('set-cookie')
    if (!cookie) throw new Error('Sign-in did not return a session cookie')

    return {
      cookie: cookie.split(';')[0],
      userId: user.id,
      householdId,
      email,
      password: TEST_PASSWORD,
    }
  } finally {
    await db.destroy()
  }
}

export async function promoteToAdmin(userId: string): Promise<void> {
  const db = createDb()
  try {
    await db
      .updateTable('users')
      .set({ role: 'admin' })
      .where('id', '=', userId)
      .execute()
  } finally {
    await db.destroy()
  }
}

/**
 * Test teardown only: school_terms_acceptances is append-only by trigger, so a fixture school's
 * rows can only be removed by stepping around it. Never call this outside a test.
 */
export async function deleteSchoolTermsForTest(
  db: Db,
  schoolIds: Array<string>,
) {
  await sql`alter table school_terms_acceptances disable trigger school_terms_acceptances_append_only`.execute(
    db,
  )
  await db
    .deleteFrom('school_terms_acceptances')
    .where('school_id', 'in', schoolIds)
    .execute()
  await sql`alter table school_terms_acceptances enable trigger school_terms_acceptances_append_only`.execute(
    db,
  )
}

/**
 * Test only. Gives an existing school-created user (no credentials in production) a password and
 * signs them in, so a test can act as a real signed-in school login.
 */
export async function signInSchoolUserForTest(
  userId: string,
): Promise<TestSession> {
  const { hashPassword } = await import('better-auth/crypto')
  const db = createDb()
  try {
    const user = await db
      .selectFrom('users')
      .select(['email', 'household_id'])
      .where('id', '=', userId)
      .executeTakeFirstOrThrow()
    await db
      .insertInto('accounts')
      .values({
        issuer: 'local:credential',
        account_id: userId,
        provider_id: 'credential',
        user_id: userId,
        password: await hashPassword(TEST_PASSWORD),
      })
      .execute()
    await db
      .updateTable('users')
      .set({ email_verified: true })
      .where('id', '=', userId)
      .execute()
    const signIn = await auth.api.signInEmail({
      body: { email: user.email, password: TEST_PASSWORD },
      asResponse: true,
    })
    const cookie = signIn.headers.get('set-cookie')
    if (!cookie) throw new Error('Sign-in did not return a session cookie')
    return {
      cookie: cookie.split(';')[0],
      userId,
      householdId: user.household_id,
      email: user.email,
      password: TEST_PASSWORD,
    }
  } finally {
    await db.destroy()
  }
}

/** Test teardown for a signed-in school login created by signInSchoolUserForTest. */
export async function deleteTestCredentials(
  userIds: Array<string>,
): Promise<void> {
  const db = createDb()
  try {
    await db.deleteFrom('sessions').where('user_id', 'in', userIds).execute()
    await db.deleteFrom('accounts').where('user_id', 'in', userIds).execute()
  } finally {
    await db.destroy()
  }
}
