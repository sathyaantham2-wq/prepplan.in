import type { Db } from '../connection'
import type { SchoolRole } from '../enums'
import type { SchoolScope } from '../school-scope'
import { createRepository, createSchoolScopedRepository } from './factory'

// The tenant root: never itself school-scoped (it *is* the school). Reached only through a
// membership lookup (findForMember) or by platform admin code.
export const schoolsRepository = {
  ...createRepository('schools'),
  /**
   * Platform-level provisioning (a script run by the owner, never a public route): the school's
   * household, the school, and its first admin as a user + household + membership, in one
   * transaction. The admin has no credentials until the school-credentials step issues them.
   */
  async provision(
    db: Db,
    input: {
      name: string
      code: string
      board: string
      city?: string
      adminName: string
      adminEmail: string
    },
  ) {
    return db.transaction().execute(async (trx) => {
      const schoolHousehold = await trx
        .insertInto('households')
        .values({ name: `${input.name} (school)`, plan: 'school' })
        .returning('id')
        .executeTakeFirstOrThrow()
      const school = await trx
        .insertInto('schools')
        .values({
          household_id: schoolHousehold.id,
          name: input.name,
          code: input.code,
          board: input.board,
          city: input.city ?? null,
          status: 'active',
        })
        .returningAll()
        .executeTakeFirstOrThrow()
      const adminHousehold = await trx
        .insertInto('households')
        .values({ name: `${input.adminName} (school staff)`, plan: 'free' })
        .returning('id')
        .executeTakeFirstOrThrow()
      const user = await trx
        .insertInto('users')
        .values({
          household_id: adminHousehold.id,
          name: input.adminName,
          email: input.adminEmail.trim().toLowerCase(),
          role: 'teacher',
          signup_type: 'school',
        })
        .returning('id')
        .executeTakeFirstOrThrow()
      const member = await trx
        .insertInto('school_members')
        .values({
          school_id: school.id,
          user_id: user.id,
          role: 'school_admin',
          status: 'active',
        })
        .returning('id')
        .executeTakeFirstOrThrow()
      return { school, adminUserId: user.id, adminMemberId: member.id }
    })
  },
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

export interface SchoolMembership {
  id: string
  role: SchoolRole
}

/** Active memberships of a user in a school (id needed to look up assignments). */
export async function activeSchoolMemberships(
  db: Db,
  userId: string,
  schoolId: string,
): Promise<Array<SchoolMembership>> {
  return db
    .selectFrom('school_members')
    .innerJoin('schools', 'schools.id', 'school_members.school_id')
    .select(['school_members.id', 'school_members.role'])
    .where('school_members.user_id', '=', userId)
    .where('school_members.school_id', '=', schoolId)
    .where('school_members.status', '=', 'active')
    .where('schools.status', '=', 'active')
    .execute()
}

export const schoolClassesRepository =
  createSchoolScopedRepository('school_classes')
export const schoolSectionsRepository =
  createSchoolScopedRepository('school_sections')
export const schoolSubjectsRepository =
  createSchoolScopedRepository('school_subjects')
export const schoolTeacherAssignmentsRepository = {
  ...createSchoolScopedRepository('school_teacher_assignments'),
  /**
   * What a teacher may mark (their own pairs) and what they spot-check: the pairs set to
   * `subject_teacher` that are theirs, plus, as a class teacher, every pair in their own section
   * set to `class_teacher`. Pairs use the GLOBAL subject id, which is what exams will carry.
   */
  async pairsFor(db: Db, schoolId: string, memberId: string) {
    const own = await db
      .selectFrom('school_teacher_assignments as a')
      .innerJoin('school_subjects as ss', 'ss.id', 'a.school_subject_id')
      .select(['a.section_id', 'ss.subject_id', 'a.sample_checker'])
      .where('a.school_id', '=', schoolId)
      .where('a.member_id', '=', memberId)
      .execute()
    const asClassTeacher = await db
      .selectFrom('school_teacher_assignments as a')
      .innerJoin('school_subjects as ss', 'ss.id', 'a.school_subject_id')
      .innerJoin('school_sections as sec', 'sec.id', 'a.section_id')
      .select(['a.section_id', 'ss.subject_id'])
      .where('a.school_id', '=', schoolId)
      .where('sec.class_teacher_member_id', '=', memberId)
      .where('a.sample_checker', '=', 'class_teacher')
      .execute()
    const pairs = own.map((r) => ({
      sectionId: r.section_id,
      subjectId: r.subject_id,
    }))
    const samplePairs = [
      ...own
        .filter((r) => r.sample_checker === 'subject_teacher')
        .map((r) => ({ sectionId: r.section_id, subjectId: r.subject_id })),
      ...asClassTeacher.map((r) => ({
        sectionId: r.section_id,
        subjectId: r.subject_id,
      })),
    ]
    return { pairs, samplePairs }
  },
}

export const schoolStudentsRepository = {
  ...createSchoolScopedRepository('school_students'),
  /**
   * The roster a scope may see. Admin and principal: everyone. A teacher: students of the
   * sections they are assigned to or spot-check. A student or parent: nobody here (a student
   * reads only her own row through findOwn).
   */
  async listForScope(db: Db, scope: SchoolScope) {
    let q = db
      .selectFrom('school_students')
      .selectAll()
      .where('school_id', '=', scope.schoolId)
    if (scope.pairs !== 'all') {
      if (scope.role !== 'teacher') return []
      const sections = [
        ...new Set(
          [...scope.pairs, ...scope.samplePairs].map((p) => p.sectionId),
        ),
      ]
      if (sections.length === 0) return []
      q = q.where('section_id', 'in', sections)
    }
    return q.orderBy('roll_no').execute()
  },
  /** Who holds which roll number in which section, for import checks. */
  async rosterIndex(db: Db, scope: SchoolScope) {
    return db
      .selectFrom('school_students')
      .innerJoin('students', 'students.id', 'school_students.student_id')
      .select([
        'school_students.section_id',
        'school_students.roll_no',
        'students.name',
      ])
      .where('school_students.school_id', '=', scope.schoolId)
      .execute()
  },
  /** A student's own roster row. Only meaningful for the student role. */
  async findOwn(db: Db, scope: SchoolScope) {
    if (scope.role !== 'student') return undefined
    return db
      .selectFrom('school_students')
      .innerJoin('students', 'students.id', 'school_students.student_id')
      .selectAll('school_students')
      .where('school_students.school_id', '=', scope.schoolId)
      .where('students.user_id', '=', scope.userId)
      .executeTakeFirst()
  },
}

export const schoolStudentGuardiansRepository = createSchoolScopedRepository(
  'school_student_guardians',
)
export const schoolImportBatchesRepository = createSchoolScopedRepository(
  'school_import_batches',
)

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
  school_teacher_assignments: schoolTeacherAssignmentsRepository,
  school_students: schoolStudentsRepository,
  school_student_guardians: schoolStudentGuardiansRepository,
  school_import_batches: schoolImportBatchesRepository,
} as const

/** Which of these e-mail addresses already belong to a PrepPlan account (any role). */
export async function existingUserEmails(
  db: Db,
  emails: ReadonlyArray<string>,
): Promise<Set<string>> {
  if (emails.length === 0) return new Set()
  const rows = await db
    .selectFrom('users')
    .select('email')
    .where('email', 'in', [...emails])
    .execute()
  return new Set(rows.map((r) => r.email.toLowerCase()))
}
