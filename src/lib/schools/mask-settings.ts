import type { Db } from '../../db/connection'
import type { SchoolScope } from '../../db/school-scope'
import { SchoolError, auditSchool } from './common'
import { DEFAULT_MASK, maskFor, parseMaskTemplate } from './mask-template'
import type { MaskTemplate } from './mask-template'

function assertMaskRole(scope: SchoolScope): void {
  if (scope.role !== 'school_admin' && scope.role !== 'principal')
    throw new SchoolError('forbidden', 'Only the principal and the school office can see or change the name-area mask.')
}

/** The school's mask template; `custom` is false while it is still the default top strip of the first page. */
export async function maskSettings(db: Db, scope: SchoolScope): Promise<{ template: MaskTemplate; custom: boolean }> {
  assertMaskRole(scope)
  const s = await db.selectFrom('schools').select('mask_template').where('id', '=', scope.schoolId).executeTakeFirstOrThrow()
  return { template: maskFor(s.mask_template), custom: s.mask_template !== null }
}

/** Saves the template; `null` goes back to the default. Written to the audit log. */
export async function saveMaskSettings(db: Db, scope: SchoolScope, input: unknown): Promise<void> {
  assertMaskRole(scope)
  let next: MaskTemplate | null = null
  if (input !== null) {
    next = parseMaskTemplate(input)
    if (!next)
      throw new SchoolError('invalid', 'Each box must lie inside the page (values 0 to 1, at least 1% wide and high), with at most 6 boxes.')
  }
  const before = await maskSettings(db, scope)
  await db
    .updateTable('schools')
    .set({ mask_template: next === null ? null : JSON.stringify(next) })
    .where('id', '=', scope.schoolId)
    .execute()
  await auditSchool(db, scope, 'school.mask_template', 'schools', scope.schoolId, before.template, next ?? DEFAULT_MASK)
}
