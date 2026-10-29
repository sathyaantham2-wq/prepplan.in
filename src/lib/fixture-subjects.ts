import type { Db } from '../db/connection'

// Seed, fixture and end-to-end subjects (MATH-SEED, SCI-SEED, E2E-AD-<n>, ...) exist only so tests
// and local development have something to work with. On 2026-09-22 a crashed test run left one
// active and a real student saw it; on 2026-10-29 two were found still active in production, listed
// to all 43 CBSE class-7 students. Three guards keep that from happening again:
//   1. the seed script refuses to run against a database that is not local (assertLocalDatabase),
//   2. in a production runtime the student-facing subject lists leave these codes out
//      (excludeFixtureSubjects, used by subjectsRepository.listByBoardClass),
//   3. the admin overview warns when any of them is active (listActiveFixtureSubjects).

/** SQL LIKE patterns for the codes that mark a subject as seed/fixture/test data. */
export const FIXTURE_SUBJECT_LIKE = ['%-SEED', 'E2E-%'] as const

export const isFixtureSubjectCode = (code: string): boolean =>
  /-SEED$/.test(code) || /^E2E-/.test(code)

/** True when this subject must not be offered in a production runtime (the school module uses this too). */
export const blockedFixtureSubject = (
  code: string,
  production: boolean = isProductionRuntime(),
): boolean => production && isFixtureSubjectCode(code)

/** True when this process is serving the real app (Vercel production, or NODE_ENV=production). */
export const isProductionRuntime = (
  env: Record<string, string | undefined> = process.env,
): boolean => env.VERCEL_ENV === 'production' || env.NODE_ENV === 'production'

export async function listActiveFixtureSubjects(
  db: Db,
): Promise<Array<string>> {
  const rows = await db
    .selectFrom('subjects')
    .select('code')
    .where('is_active', '=', true)
    .where((eb) =>
      eb.or(FIXTURE_SUBJECT_LIKE.map((p) => eb('code', 'like', p))),
    )
    .orderBy('code')
    .execute()
  return rows.map((r) => r.code)
}

const LOCAL_HOSTS = new Set([
  'localhost',
  '127.0.0.1',
  '::1',
  '0.0.0.0',
  'postgres',
  'db',
])

/** Throws unless the database URL points at this machine (or a CI service container). No override. */
export function assertLocalDatabase(
  url: string | undefined,
  what: string,
): void {
  let host = ''
  try {
    host = new URL(url ?? '').hostname.replace(/^\[|\]$/g, '')
  } catch {
    // falls through to the refusal below
  }
  if (!LOCAL_HOSTS.has(host))
    throw new Error(
      `${what} refuses to run: DATABASE_URL does not point at a local database. It creates seed/fixture subjects that must never exist in production.`,
    )
}
