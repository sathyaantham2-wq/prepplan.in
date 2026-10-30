import type { Db } from '../../db/connection'
import type { SchoolScope } from '../../db/school-scope'
import { SchoolError, assertAdmin, auditSchool } from './common'

// Which parts of PrepPlan a school uses (owner direction 2026-10-30): making exam papers, AI correction of
// answer sheets, or both. Chosen at the end of the set-up and changed in Settings; the home screen and the
// tabs show only the chosen parts. Turning a part off hides it; nothing is deleted.

export const SCHOOL_MODULES = ['papers', 'correction'] as const
export type SchoolModule = (typeof SCHOOL_MODULES)[number]

export function parseModules(v: unknown): Array<SchoolModule> {
  const list = Array.isArray(v) ? v : []
  const picked = SCHOOL_MODULES.filter((m) => list.includes(m))
  if (picked.length === 0)
    throw new SchoolError(
      'invalid',
      'Choose at least one: making exam papers, or AI correction of answer sheets.',
    )
  return picked
}

export async function saveModules(
  db: Db,
  scope: SchoolScope,
  modules: unknown,
): Promise<Array<SchoolModule>> {
  assertAdmin(scope)
  const picked = parseModules(modules)
  const before = await db
    .selectFrom('schools')
    .select('modules')
    .where('id', '=', scope.schoolId)
    .executeTakeFirstOrThrow()
  await db
    .updateTable('schools')
    .set({ modules: picked })
    .where('id', '=', scope.schoolId)
    .execute()
  await auditSchool(
    db,
    scope,
    'school.modules_changed',
    'schools',
    scope.schoolId,
    { modules: before.modules },
    { modules: picked },
  )
  return picked
}
