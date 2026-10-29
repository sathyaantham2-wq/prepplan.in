import type { Db } from '../connection'
import type { SchoolCredentialKind, SchoolRole } from '../enums'
import type { SchoolScope } from '../school-scope'
import { createSchoolScopedRepository } from './factory'

export const MAX_FAILED_LOGINS = 5
export const LOCK_MINUTES = 15

export const schoolCredentialCodesRepository = {
  ...createSchoolScopedRepository('school_credential_codes'),
  /** Codes for this person that still work: not used, not revoked, not expired. */
  async openForMember(db: Db, schoolId: string, memberId: string, now: Date) {
    return db
      .selectFrom('school_credential_codes')
      .selectAll()
      .where('school_id', '=', schoolId)
      .where('member_id', '=', memberId)
      .where('used_at', 'is', null)
      .where('revoked_at', 'is', null)
      .where('expires_at', '>', now)
      .execute()
  },
  async revokeOpenForMember(
    db: Db,
    schoolId: string,
    memberId: string,
    now: Date,
  ) {
    await db
      .updateTable('school_credential_codes')
      .set({ revoked_at: now })
      .where('school_id', '=', schoolId)
      .where('member_id', '=', memberId)
      .where('used_at', 'is', null)
      .where('revoked_at', 'is', null)
      .execute()
  },
  /** Link tokens look the code up by its id first. */
  async findOpenById(db: Db, id: string, now: Date) {
    return db
      .selectFrom('school_credential_codes')
      .selectAll()
      .where('id', '=', id)
      .where('used_at', 'is', null)
      .where('revoked_at', 'is', null)
      .where('expires_at', '>', now)
      .executeTakeFirst()
  },
  /** Marks a code used exactly once: false when someone else used or revoked it first. */
  async markUsed(db: Db, id: string, now: Date): Promise<boolean> {
    const r = await db
      .updateTable('school_credential_codes')
      .set({ used_at: now })
      .where('id', '=', id)
      .where('used_at', 'is', null)
      .where('revoked_at', 'is', null)
      .where('expires_at', '>', now)
      .executeTakeFirst()
    return Number(r.numUpdatedRows) === 1
  },
  async insertCode(
    db: Db,
    row: {
      id: string
      schoolId: string
      memberId: string
      kind: SchoolCredentialKind
      codeHash: string
      expiresAt: Date
      createdBy: string | null
    },
  ) {
    await db
      .insertInto('school_credential_codes')
      .values({
        id: row.id,
        school_id: row.schoolId,
        member_id: row.memberId,
        kind: row.kind,
        code_hash: row.codeHash,
        expires_at: row.expiresAt,
        created_by_user_id: row.createdBy,
      })
      .execute()
  },
}

export const schoolLoginRepository = {
  async findActiveSchoolByCode(db: Db, code: string) {
    return db
      .selectFrom('schools')
      .selectAll()
      .where((eb) =>
        eb(eb.fn('lower', ['code']), '=', code.trim().toLowerCase()),
      )
      .where('status', '=', 'active')
      .executeTakeFirst()
  },
  /** The active student with this admission number in this school (case-insensitive), if any. */
  async findStudentByAdmission(db: Db, schoolId: string, admissionNo: string) {
    return db
      .selectFrom('school_students as ss')
      .innerJoin('school_members as m', 'm.id', 'ss.member_id')
      .innerJoin('users as u', 'u.id', 'm.user_id')
      .select([
        'ss.id as school_student_id',
        'ss.section_id',
        'm.id as member_id',
        'm.failed_logins',
        'm.locked_until',
        'u.id as user_id',
        'u.email',
        'u.is_active',
      ])
      .where('ss.school_id', '=', schoolId)
      .where('ss.status', '=', 'active')
      .where('m.status', '=', 'active')
      .where((eb) => eb(eb.fn('upper', ['ss.admission_no']), '=', admissionNo.toUpperCase()))
      .executeTakeFirst()
  },
  async admissionNoTaken(db: Db, schoolId: string, admissionNo: string): Promise<boolean> {
    const row = await db
      .selectFrom('school_students')
      .select('id')
      .where('school_id', '=', schoolId)
      .where((eb) => eb(eb.fn('upper', ['admission_no']), '=', admissionNo.toUpperCase()))
      .executeTakeFirst()
    return row !== undefined
  },
  /** A staff member of a school by their e-mail address. */
  async findStaffByEmail(db: Db, schoolId: string, email: string) {
    return db
      .selectFrom('school_members as m')
      .innerJoin('users as u', 'u.id', 'm.user_id')
      .select([
        'm.id as member_id',
        'm.role',
        'm.failed_logins',
        'm.locked_until',
        'u.id as user_id',
        'u.email',
        'u.name',
        'u.is_active',
      ])
      .where('m.school_id', '=', schoolId)
      .where('m.status', '=', 'active')
      .where('m.role', 'in', ['school_admin', 'principal', 'teacher'])
      .where('u.email', '=', email.trim().toLowerCase())
      .executeTakeFirst()
  },
  async findStaffMembersByEmail(db: Db, email: string) {
    return db
      .selectFrom('school_members as m')
      .innerJoin('users as u', 'u.id', 'm.user_id')
      .innerJoin('schools as s', 's.id', 'm.school_id')
      .select([
        'm.id as member_id',
        'm.school_id',
        'm.failed_logins',
        'm.locked_until',
        'u.id as user_id',
        'u.email',
        'u.name',
      ])
      .where('s.status', '=', 'active')
      .where('m.status', '=', 'active')
      .where('m.role', 'in', ['school_admin', 'principal', 'teacher'])
      .where('u.email', '=', email.trim().toLowerCase())
      .execute()
  },
  async memberWithUser(db: Db, memberId: string) {
    return db
      .selectFrom('school_members as m')
      .innerJoin('users as u', 'u.id', 'm.user_id')
      .select([
        'm.id as member_id',
        'm.school_id',
        'm.role',
        'm.status',
        'm.failed_logins',
        'm.locked_until',
        'u.id as user_id',
        'u.email',
        'u.name',
      ])
      .where('m.id', '=', memberId)
      .executeTakeFirst()
  },
  /** True when a failed attempt must be refused outright because the account is locked now. */
  isLocked(member: { locked_until: Date | null }, now: Date): boolean {
    return member.locked_until !== null && member.locked_until > now
  },
  /** Counts a failure; the fifth in a row locks the account for LOCK_MINUTES. */
  async registerFailure(db: Db, memberId: string, now: Date): Promise<void> {
    await db.transaction().execute(async (trx) => {
      const m = await trx
        .selectFrom('school_members')
        .select(['failed_logins', 'locked_until'])
        .where('id', '=', memberId)
        .forUpdate()
        .executeTakeFirst()
      if (!m) return
      const lockExpired = m.locked_until !== null && m.locked_until <= now
      const failures = (lockExpired ? 0 : m.failed_logins) + 1
      await trx
        .updateTable('school_members')
        .set({
          failed_logins: failures,
          locked_until:
            failures >= MAX_FAILED_LOGINS
              ? new Date(now.getTime() + LOCK_MINUTES * 60_000)
              : null,
        })
        .where('id', '=', memberId)
        .execute()
    })
  },
  async clearFailures(db: Db, memberId: string): Promise<void> {
    await db
      .updateTable('school_members')
      .set({ failed_logins: 0, locked_until: null })
      .where('id', '=', memberId)
      .execute()
  },
  /** Sets (or replaces) the user's password and marks the address verified. hash comes from better-auth. */
  async setPassword(
    db: Db,
    userId: string,
    passwordHash: string,
  ): Promise<void> {
    const existing = await db
      .selectFrom('accounts')
      .select('id')
      .where('user_id', '=', userId)
      .where('provider_id', '=', 'credential')
      .executeTakeFirst()
    if (existing) {
      await db
        .updateTable('accounts')
        .set({ password: passwordHash, updated_at: new Date() })
        .where('id', '=', existing.id)
        .execute()
    } else {
      await db
        .insertInto('accounts')
        .values({
          issuer: 'local:credential',
          account_id: userId,
          provider_id: 'credential',
          user_id: userId,
          password: passwordHash,
        })
        .execute()
    }
    await db
      .updateTable('users')
      .set({ email_verified: true })
      .where('id', '=', userId)
      .execute()
  },
  /** Reset: the old password stops working at once. The row stays (nothing is deleted). */
  async clearPassword(db: Db, userId: string): Promise<void> {
    await db
      .updateTable('accounts')
      .set({ password: null, updated_at: new Date() })
      .where('user_id', '=', userId)
      .where('provider_id', '=', 'credential')
      .execute()
  },
  /** Ends every signed-in session of the user (they expire now). */
  async expireSessions(db: Db, userId: string, now: Date): Promise<void> {
    await db
      .updateTable('sessions')
      .set({ expires_at: now })
      .where('user_id', '=', userId)
      .execute()
  },
  async hasPassword(db: Db, userId: string): Promise<boolean> {
    const row = await db
      .selectFrom('accounts')
      .select('password')
      .where('user_id', '=', userId)
      .where('provider_id', '=', 'credential')
      .executeTakeFirst()
    return !!row?.password
  },
  /** Students of a section who have no password yet (or all, when asked), with what a slip prints. */
  async studentsForSlips(
    db: Db,
    scope: SchoolScope,
    sectionId: string,
    includeActivated: boolean,
  ) {
    const rows = await db
      .selectFrom('school_students as ss')
      .innerJoin('students as st', 'st.id', 'ss.student_id')
      .innerJoin('school_members as m', 'm.id', 'ss.member_id')
      .innerJoin('school_sections as sec', 'sec.id', 'ss.section_id')
      .innerJoin('school_classes as cls', 'cls.id', 'sec.class_id')
      .leftJoin('accounts as a', (j) =>
        j
          .onRef('a.user_id', '=', 'm.user_id')
          .on('a.provider_id', '=', 'credential'),
      )
      .select([
        'ss.id as school_student_id',
        'ss.roll_no',
        'ss.admission_no',
        'st.name',
        'm.id as member_id',
        'm.user_id',
        'sec.name as section_name',
        'cls.grade',
        'a.password',
      ])
      .where('ss.school_id', '=', scope.schoolId)
      .where('ss.section_id', '=', sectionId)
      .where('ss.status', '=', 'active')
      .orderBy('ss.roll_no')
      .execute()
    return rows.filter((r) => includeActivated || !r.password)
  },
  async studentById(db: Db, scope: SchoolScope, schoolStudentId: string) {
    return db
      .selectFrom('school_students as ss')
      .innerJoin('students as st', 'st.id', 'ss.student_id')
      .innerJoin('school_members as m', 'm.id', 'ss.member_id')
      .innerJoin('school_sections as sec', 'sec.id', 'ss.section_id')
      .innerJoin('school_classes as cls', 'cls.id', 'sec.class_id')
      .select([
        'ss.id as school_student_id',
        'ss.section_id',
        'ss.roll_no',
        'ss.admission_no',
        'st.name',
        'm.id as member_id',
        'm.user_id',
        'sec.name as section_name',
        'cls.grade',
      ])
      .where('ss.school_id', '=', scope.schoolId)
      .where('ss.id', '=', schoolStudentId)
      .executeTakeFirst()
  },
  /** Is this person the class teacher of the section (an active teacher membership of this school)? */
  async isClassTeacherOf(
    db: Db,
    scope: SchoolScope,
    sectionId: string,
  ): Promise<boolean> {
    const row = await db
      .selectFrom('school_sections as sec')
      .innerJoin('school_members as m', 'm.id', 'sec.class_teacher_member_id')
      .select('sec.id')
      .where('sec.school_id', '=', scope.schoolId)
      .where('sec.id', '=', sectionId)
      .where('m.user_id', '=', scope.userId)
      .where('m.role', '=', 'teacher')
      .where('m.status', '=', 'active')
      .executeTakeFirst()
    return row !== undefined
  },
  async staffMemberInSchool(db: Db, scope: SchoolScope, memberId: string) {
    return db
      .selectFrom('school_members as m')
      .innerJoin('users as u', 'u.id', 'm.user_id')
      .select([
        'm.id as member_id',
        'm.role',
        'u.id as user_id',
        'u.name',
        'u.email',
      ])
      .where('m.school_id', '=', scope.schoolId)
      .where('m.id', '=', memberId)
      .where('m.status', '=', 'active')
      .where('m.role', 'in', [
        'school_admin',
        'principal',
        'teacher',
      ] satisfies Array<SchoolRole>)
      .executeTakeFirst()
  },
}
