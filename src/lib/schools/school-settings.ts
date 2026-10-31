import type { Db } from '../../db/connection'
import type { SchoolScope } from '../../db/school-scope'
import { SchoolError, assertAdmin, auditSchool } from './common'

/**
 * What students and parents see of progress, and how long a student may flag a mark. The office only.
 * Class rank is OFF unless the school turns it on (owner direction 2026-10-31); personal best is always shown.
 */
export async function saveProgressSettings(
  db: Db,
  scope: SchoolScope,
  input: { showClassRank: boolean; disputeWindowDays: number },
) {
  assertAdmin(scope)
  const days = input.disputeWindowDays
  if (!Number.isInteger(days) || days < 1 || days > 60)
    throw new SchoolError('invalid', 'The time to flag marks must be from 1 to 60 days.')
  const before = await db
    .selectFrom('schools')
    .select(['show_class_rank', 'dispute_window_days'])
    .where('id', '=', scope.schoolId)
    .executeTakeFirstOrThrow()
  await db
    .updateTable('schools')
    .set({ show_class_rank: input.showClassRank, dispute_window_days: days })
    .where('id', '=', scope.schoolId)
    .execute()
  await auditSchool(db, scope, 'school.progress_settings_changed', 'schools', scope.schoolId, before, {
    show_class_rank: input.showClassRank,
    dispute_window_days: days,
  })
}
