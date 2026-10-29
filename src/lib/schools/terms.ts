import type { Db } from '../../db/connection'
import { schoolTermsAcceptancesRepository } from '../../db/repositories'
import type { SchoolScope } from '../../db/school-scope'
import { SchoolError, assertAdmin, auditSchool } from './common'

/**
 * The version of the PrepPlan school terms a school must have accepted (owner decision
 * 2026-10-29: this per-school record replaces any per-student consent). Bump it when the terms
 * change; every school then has to accept the new version before adding students, printing
 * booklets or running marking. The text of the terms is the owner's and lives outside the code.
 */
export const CURRENT_SCHOOL_TERMS_VERSION = '2026-10-v1'

export async function acceptSchoolTerms(
  db: Db,
  scope: SchoolScope,
  input: { termsVersion?: string; ip?: string | null } = {},
) {
  assertAdmin(scope)
  const version = input.termsVersion ?? CURRENT_SCHOOL_TERMS_VERSION
  if (version !== CURRENT_SCHOOL_TERMS_VERSION) {
    throw new SchoolError('invalid', 'These are not the current school terms.')
  }
  if (await schoolTermsAcceptancesRepository.hasAccepted(db, scope, version)) {
    throw new SchoolError(
      'conflict',
      'This version of the terms is already accepted.',
    )
  }
  const row = await schoolTermsAcceptancesRepository.insert(db, scope, {
    accepted_by_user_id: scope.userId,
    terms_version: version,
    accepted_ip: input.ip ?? null,
  })
  await auditSchool(
    db,
    scope,
    'school.terms_accepted',
    'school_terms_acceptances',
    row.id,
    null,
    {
      terms_version: version,
    },
  )
  return row
}

/** "No terms, no students": call at the top of anything that adds students, prints or marks. */
export async function requireSchoolTerms(
  db: Db,
  scope: SchoolScope,
): Promise<void> {
  const ok = await schoolTermsAcceptancesRepository.hasAccepted(
    db,
    scope,
    CURRENT_SCHOOL_TERMS_VERSION,
  )
  if (!ok) {
    throw new SchoolError(
      'terms_not_accepted',
      'The school admin must accept the current PrepPlan school terms first.',
    )
  }
}
