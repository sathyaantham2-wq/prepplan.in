import type { Db } from '../connection'
import type { SchoolRole } from '../enums'
import { createRepository, createSchoolScopedRepository } from './factory'

// The tenant root: never itself school-scoped (it *is* the school). Reached only through a
// membership lookup (findForMember) or by platform admin code.
export const schoolsRepository = {
  ...createRepository('schools'),
  /** The school, but only if this user holds an active membership in it and it is active. */
  async findForMember(db: Db, userId: string, schoolId: string) {
    return db
      .selectFrom('schools')
      .innerJoin('school_members', 'school_members.school_id', 'schools.id')
      .selectAll('schools')
      .where('schools.id', '=', schoolId)
      .where('schools.status', '=', 'active')
      .where('school_members.user_id', '=', userId)
      .where('school_members.status', '=', 'active')
      .executeTakeFirst()
  },
}

export const schoolMembersRepository = {
  ...createSchoolScopedRepository('school_members'),
  /**
   * The bootstrap lookup that makes a SchoolScope possible, so it cannot take one: which active
   * roles does this user hold in this school? Empty when they are not a member, the membership is
   * inactive, or the school is suspended.
   */
  async activeRoles(
    db: Db,
    userId: string,
    schoolId: string,
  ): Promise<Array<SchoolRole>> {
    const rows = await db
      .selectFrom('school_members')
      .innerJoin('schools', 'schools.id', 'school_members.school_id')
      .select('school_members.role')
      .where('school_members.user_id', '=', userId)
      .where('school_members.school_id', '=', schoolId)
      .where('school_members.status', '=', 'active')
      .where('schools.status', '=', 'active')
      .execute()
    return rows.map((r) => r.role)
  },
}

export const schoolClassesRepository =
  createSchoolScopedRepository('school_classes')
export const schoolSectionsRepository =
  createSchoolScopedRepository('school_sections')
export const schoolSubjectsRepository =
  createSchoolScopedRepository('school_subjects')
export const schoolTermsAcceptancesRepository = {
  ...createSchoolScopedRepository('school_terms_acceptances'),
  async hasAccepted(db: Db, scope: { schoolId: string }, termsVersion: string) {
    const row = await db
      .selectFrom('school_terms_acceptances')
      .select('id')
      .where('school_id', '=', scope.schoolId)
      .where('terms_version', '=', termsVersion)
      .executeTakeFirst()
    return row !== undefined
  },
}

/**
 * Every school_* table (not `schools` itself) and the repository that owns it. The schema-lint
 * test fails when a school_ table exists that is missing here, so a new table cannot ship
 * without going through the school-scoped factory.
 */
export const SCHOOL_TABLE_REPOSITORIES = {
  school_members: schoolMembersRepository,
  school_classes: schoolClassesRepository,
  school_sections: schoolSectionsRepository,
  school_subjects: schoolSubjectsRepository,
  school_terms_acceptances: schoolTermsAcceptancesRepository,
} as const
