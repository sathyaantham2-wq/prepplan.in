import type { Db } from '../../db/connection'
import {
  householdsRepository,
  schoolMembersRepository,
  schoolStudentGuardiansRepository,
  schoolStudentsRepository,
  studentsRepository,
  usersRepository,
} from '../../db/repositories'
import type { SchoolScope } from '../../db/school-scope'

// School people are created by the school service only: never by the public sign-up path, which
// cannot produce a school role (CLAUDE.md "School module rules"). Each gets a household of their
// own (so every existing NOT NULL household_id still holds) and `signup_type = 'school'`.
//
// No sign-in credentials are created here. A person added this way cannot sign in until the
// school-credentials step issues them a one-time link; the address on a student is a reserved,
// undeliverable one (the same trick guest accounts use), so nobody can register it publicly.
//
// There is no consent row: the school's terms acceptance is the record (owner decision 2026-10-29).

export const SCHOOL_STUDENT_EMAIL_DOMAIN = 'school-student.prepplan.invalid'

export async function createSchoolTeacher(
  db: Db,
  scope: SchoolScope,
  input: { name: string; email: string },
) {
  const household = await householdsRepository.insert(db, {
    name: `${input.name} (school staff)`,
    plan: 'free',
  })
  const user = await usersRepository.insert(db, {
    household_id: household.id,
    name: input.name,
    email: input.email.trim().toLowerCase(),
    role: 'teacher',
    signup_type: 'school',
  })
  const member = await schoolMembersRepository.insert(db, scope, {
    user_id: user.id,
    role: 'teacher',
    status: 'active',
  })
  return { user, member }
}

export async function createSchoolStudent(
  db: Db,
  scope: SchoolScope,
  input: {
    name: string
    grade: number
    sectionId: string
    sectionName: string
    rollNo: string
    guardianPhone: string | null
    guardianName: string | null
  },
) {
  const school = await db
    .selectFrom('schools')
    .select(['name', 'board'])
    .where('id', '=', scope.schoolId)
    .executeTakeFirstOrThrow()
  const household = await householdsRepository.insert(db, {
    name: `${input.name} (school student)`,
    plan: 'free',
  })
  const user = await usersRepository.insert(db, {
    household_id: household.id,
    name: input.name,
    email: `s-${crypto.randomUUID()}@${SCHOOL_STUDENT_EMAIL_DOMAIN}`,
    role: 'student',
    signup_type: 'school',
  })
  const student = await studentsRepository.insert(db, {
    household_id: household.id,
    user_id: user.id,
    name: input.name,
    class: input.grade,
    board: school.board,
    school: school.name,
    section: input.sectionName,
    roll_no: input.rollNo,
    school_id: scope.schoolId,
  })
  const member = await schoolMembersRepository.insert(db, scope, {
    user_id: user.id,
    role: 'student',
    status: 'active',
  })
  const schoolStudent = await schoolStudentsRepository.insert(db, scope, {
    student_id: student.id,
    member_id: member.id,
    section_id: input.sectionId,
    roll_no: input.rollNo,
    status: 'active',
    created_by_user_id: scope.userId,
  })
  if (input.guardianPhone) {
    await schoolStudentGuardiansRepository.insert(db, scope, {
      school_student_id: schoolStudent.id,
      name: input.guardianName,
      phone_e164: input.guardianPhone,
    })
  }
  return { user, student, member, schoolStudent }
}
