import { getSharedDb } from '../db/connection'
import type { Db } from '../db/connection'
import type { SchoolRole } from '../db/enums'
import {
  activeSchoolMemberships,
  schoolTeacherAssignmentsRepository,
} from '../db/repositories'
import { issueSchoolScope } from '../db/school-scope'
import type { SchoolScope } from '../db/school-scope'
import { getCurrentUser } from './session'

// Highest first: when a person holds several roles in one school and the route allows more than
// one of them, they act as the most senior.
const ROLE_PRIORITY: ReadonlyArray<SchoolRole> = [
  'school_admin',
  'principal',
  'teacher',
  'student',
  'parent',
]

/** Pure: the role a request acts as, or null when none of the user's roles is allowed here. */
export function pickRole(
  held: ReadonlyArray<SchoolRole>,
  allowed: ReadonlyArray<SchoolRole>,
): SchoolRole | null {
  return (
    ROLE_PRIORITY.find(
      (r) => held.includes(r) && (allowed.length === 0 || allowed.includes(r)),
    ) ?? null
  )
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export type SchoolScopeResult =
  | { ok: true; scope: SchoolScope }
  | { ok: false; reason: 'not_a_member' | 'wrong_role' }

/**
 * ADR-0003: the only place (with tests) that issues a SchoolScope. Membership is re-read on every
 * call, never cached in the session, so deactivating a member or suspending a school takes
 * effect on the next request.
 *
 * Section-subject pairs: the admin and principal get 'all'. A teacher gets exactly their rows in
 * school_teacher_assignments (plus the sample-check pairs they own). Everyone else has none,
 * which means no access, never all.
 */
export async function loadSchoolScope(
  db: Db,
  userId: string,
  schoolId: string,
  allowed: ReadonlyArray<SchoolRole> = [],
): Promise<SchoolScopeResult> {
  // A malformed id from the URL is simply "not a member", never a database error.
  if (!UUID.test(schoolId)) return { ok: false, reason: 'not_a_member' }
  const memberships = await activeSchoolMemberships(db, userId, schoolId)
  if (memberships.length === 0) return { ok: false, reason: 'not_a_member' }
  const role = pickRole(
    memberships.map((m) => m.role),
    allowed,
  )
  if (!role) return { ok: false, reason: 'wrong_role' }
  const wholeSchool = role === 'school_admin' || role === 'principal'
  let pairs: Parameters<typeof issueSchoolScope>[0]['pairs'] = wholeSchool
    ? 'all'
    : []
  let samplePairs: NonNullable<
    Parameters<typeof issueSchoolScope>[0]['samplePairs']
  > = []
  if (role === 'teacher') {
    const member = memberships.find((m) => m.role === 'teacher')!
    const found = await schoolTeacherAssignmentsRepository.pairsFor(
      db,
      schoolId,
      member.id,
    )
    pairs = found.pairs
    samplePairs = found.samplePairs
  }
  return {
    ok: true,
    scope: issueSchoolScope({ userId, schoolId, role, pairs, samplePairs }),
  }
}

/**
 * Route guard. The school id comes from the URL and is checked against membership every time. A
 * school the caller does not belong to is a 404, not a 403, so its existence is not revealed.
 */
export async function requireSchoolRole(
  request: Request,
  schoolId: string,
  ...roles: Array<SchoolRole>
): Promise<SchoolScope | Response> {
  const user = await getCurrentUser(request)
  if (!user) return new Response(null, { status: 401 })
  const result = await loadSchoolScope(getSharedDb(), user.id, schoolId, roles)
  if (result.ok) return result.scope
  return new Response(null, {
    status: result.reason === 'wrong_role' ? 403 : 404,
  })
}
