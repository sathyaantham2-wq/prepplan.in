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
  const school = await db
    .selectFrom('schools')
    .select('household_id')
    .where('id', '=', scope.schoolId)
    .executeTakeFirstOrThrow()
  await auditLogRepository.insert(db, {
    household_id: school.household_id,
    school_id: scope.schoolId,
    actor_user_id: scope.userId,
    action,
    entity,
    entity_id: entityId,
    before: before === null ? null : JSON.stringify(before),
    after: after === null ? null : JSON.stringify(after),
  })
}
