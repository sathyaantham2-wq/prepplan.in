import type { Db } from '../../db/connection'
import { auditLogRepository } from '../../db/repositories'
import type { SchoolScope } from '../../db/school-scope'

/** A refused school operation. `code` is stable for clients and tests; `message` is for people. */
export class SchoolError extends Error {
  constructor(
    readonly code:
      'forbidden' | 'terms_not_accepted' | 'not_found' | 'invalid' | 'conflict',
    message: string,
  ) {
    super(message)
  }
  toResponse(): Response {
    const status =
      this.code === 'forbidden'
        ? 403
        : this.code === 'not_found'
          ? 404
          : this.code === 'conflict'
            ? 409
            : this.code === 'terms_not_accepted'
              ? 412
              : 400
    return Response.json(
      { error: this.code, message: this.message },
      { status },
    )
  }
}

export function assertAdmin(scope: SchoolScope): void {
  if (scope.role !== 'school_admin') {
    throw new SchoolError('forbidden', 'Only the school admin can do this.')
  }
}

/**
 * Every school change is written to audit_log with school_id set. household_id is the school's own
 * household (schools.household_id), so no existing household-scoped read ever returns these rows.
 */
export async function auditSchool(
  db: Db,
  scope: SchoolScope,
  action: string,
  entity: string,
  entityId: string,
  before: unknown,
  after: unknown,
): Promise<void> {
  await auditSchoolEvent(db, {
    schoolId: scope.schoolId,
    actorUserId: scope.userId,
    action,
    entity,
    entityId,
    before,
    after,
  })
}

/** Same, for events with no signed-in school scope (activation by a one-time code, provisioning). */
export async function auditSchoolEvent(
  db: Db,
  input: {
    schoolId: string
    actorUserId: string | null
    action: string
    entity: string
    entityId: string
    before: unknown
    after: unknown
  },
): Promise<void> {
  const school = await db
    .selectFrom('schools')
    .select('household_id')
    .where('id', '=', input.schoolId)
    .executeTakeFirstOrThrow()
  await auditLogRepository.insert(db, {
    household_id: school.household_id,
    school_id: input.schoolId,
    actor_user_id: input.actorUserId,
    action: input.action,
    entity: input.entity,
    entity_id: input.entityId,
    before: input.before === null ? null : JSON.stringify(input.before),
    after: input.after === null ? null : JSON.stringify(input.after),
  })
}

/**
 * The private file storage, or a plain refusal when it is not set up on this deployment (no Supabase
 * settings in a production runtime). Called before anything is saved, so nothing is left half done.
 */
export function storageOrRefuse<T>(get: () => T): T {
  try {
    return get()
  } catch (e) {
    if (e instanceof Error && e.message === 'Scan storage is not set up')
      throw new SchoolError(
        'conflict',
        'File storage is not switched on yet for this site, so files cannot be uploaded. Please write to support@prepplan.in.',
      )
    throw e
  }
}
