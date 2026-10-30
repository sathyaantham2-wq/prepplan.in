import type { Db } from '../../db/connection'
import {
  existingUserEmails,
  schoolClassesRepository,
  schoolMembersRepository,
  schoolSectionsRepository,
  schoolSubjectsRepository,
  schoolStudentsRepository,
  schoolTermsAcceptancesRepository,
} from '../../db/repositories'
import type { SchoolScope } from '../../db/school-scope'
import { blockedFixtureSubject } from '../fixture-subjects'
import { SchoolError, assertAdmin, auditSchool } from './common'
import { createSchoolTeacher } from './people'
import { normalizePhone } from './roster-parse'
import {
  addSchoolSubject,
  assignTeacher,
  createClass,
  createSection,
} from './setup'
import { SCHOOL_MODULES } from './modules'
import type { SchoolModule } from './modules'
import { CURRENT_SCHOOL_TERMS_VERSION, acceptSchoolTerms } from './terms'

// The first-sign-in wizard for the school admin (M1). It stores only where the admin is
// (schools.wizard_step, wizard_done_at); every answer is saved by the same services the ordinary
// screens use, so nothing is done twice and every action is audited as before.

export const WIZARD_STEPS = [
  'you',
  'school',
  'classes',
  'teachers',
  'students',
  'parts',
  'done',
] as const
export type WizardStep = (typeof WIZARD_STEPS)[number]

export interface WizardState {
  step: WizardStep
  done: boolean
  me: { name: string; phone: string | null }
  school: { name: string; city: string | null; board: string }
  termsAccepted: boolean
  academicYear: string
  classes: Array<{
    id: string
    grade: number
    sections: Array<{ id: string; name: string }>
    subjects: Array<{ id: string; name: string }>
  }>
  teachers: Array<{ memberId: string; name: string; email: string }>
  studentCount: number
  modules: Array<SchoolModule>
}

/** The school year the wizard suggests: the year that starts in June. */
export function suggestedAcademicYear(now = new Date()): string {
  const start =
    now.getUTCMonth() >= 5 ? now.getUTCFullYear() : now.getUTCFullYear() - 1
  return `${start}-${String(start + 1).slice(2)}`
}

const isStep = (v: string): v is WizardStep =>
  (WIZARD_STEPS as ReadonlyArray<string>).includes(v)

export async function getWizard(
  db: Db,
  scope: SchoolScope,
): Promise<WizardState> {
  assertAdmin(scope)
  const school = await db
    .selectFrom('schools')
    .select([
      'name',
      'city',
      'board',
      'wizard_step',
      'wizard_done_at',
      'modules',
    ])
    .where('id', '=', scope.schoolId)
    .executeTakeFirstOrThrow()
  const user = await db
    .selectFrom('users')
    .select('name')
    .where('id', '=', scope.userId)
    .executeTakeFirstOrThrow()
  const member = (await schoolMembersRepository.list(db, scope)).find(
    (m) => m.user_id === scope.userId && m.role === 'school_admin',
  )
  const classes = await schoolClassesRepository.list(db, scope)
  const sections = await schoolSectionsRepository.list(db, scope)
  const subjects = await schoolSubjectsRepository.list(db, scope)
  const names = new Map(
    (await db.selectFrom('subjects').select(['id', 'name']).execute()).map(
      (s) => [s.id, s.name],
    ),
  )
  const teachers = await db
    .selectFrom('school_members as m')
    .innerJoin('users as u', 'u.id', 'm.user_id')
    .select(['m.id as memberId', 'u.name', 'u.email'])
    .where('m.school_id', '=', scope.schoolId)
    .where('m.role', '=', 'teacher')
    .execute()
  const roster = await schoolStudentsRepository.rosterIndex(db, scope)
  return {
    step: school.wizard_done_at
      ? 'done'
      : isStep(school.wizard_step ?? '')
        ? (school.wizard_step as WizardStep)
        : 'you',
    done: school.wizard_done_at !== null,
    me: { name: user.name, phone: member?.phone_e164 ?? null },
    school: { name: school.name, city: school.city, board: school.board },
    termsAccepted: await schoolTermsAcceptancesRepository.hasAccepted(
      db,
      scope,
      CURRENT_SCHOOL_TERMS_VERSION,
    ),
    academicYear: classes[0]?.academic_year ?? suggestedAcademicYear(),
    classes: classes
      .sort((a, b) => a.grade - b.grade)
      .map((c) => ({
        id: c.id,
        grade: c.grade,
        sections: sections
          .filter((s) => s.class_id === c.id)
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((s) => ({ id: s.id, name: s.name })),
        subjects: subjects
          .filter((s) => s.class_id === c.id)
          .map((s) => ({
            id: s.id,
            name: names.get(s.subject_id) ?? 'Subject',
          })),
      })),
    teachers,
    studentCount: roster.length,
    modules: SCHOOL_MODULES.filter((m) => school.modules.includes(m)),
  }
}

/** Remembers where the admin is. Going back is allowed; the wizard never loses an answer. */
export async function saveWizardStep(
  db: Db,
  scope: SchoolScope,
  step: string,
): Promise<void> {
  assertAdmin(scope)
  if (!isStep(step))
    throw new SchoolError('invalid', 'That step does not exist.')
  await db
    .updateTable('schools')
    .set({ wizard_step: step })
    .where('id', '=', scope.schoolId)
    .execute()
}

/** Ends the wizard (finished or skipped). The home screen then shows the three big actions. */
export async function finishWizard(
  db: Db,
  scope: SchoolScope,
  how: 'finished' | 'skipped',
): Promise<void> {
  assertAdmin(scope)
  await db
    .updateTable('schools')
    .set({ wizard_step: 'done', wizard_done_at: new Date() })
    .where('id', '=', scope.schoolId)
    .execute()
  await auditSchool(
    db,
    scope,
    `school.wizard_${how}`,
    'schools',
    scope.schoolId,
    null,
    null,
  )
}

export async function reopenWizard(db: Db, scope: SchoolScope): Promise<void> {
  assertAdmin(scope)
  await db
    .updateTable('schools')
    .set({ wizard_step: 'you', wizard_done_at: null })
    .where('id', '=', scope.schoolId)
    .execute()
}

export async function saveAdminDetails(
  db: Db,
  scope: SchoolScope,
  input: { name: string; phone: string },
): Promise<void> {
  assertAdmin(scope)
  const name = input.name.trim()
  if (name.length < 2 || name.length > 80)
    throw new SchoolError('invalid', 'Please type your name.')
  let phone: string | null = null
  if (input.phone.trim()) {
    phone = normalizePhone(input.phone)
    if (!phone)
      throw new SchoolError(
        'invalid',
        'That mobile number does not look right. Use 10 digits, or leave it empty.',
      )
  }
  await db
    .updateTable('users')
    .set({ name })
    .where('id', '=', scope.userId)
    .execute()
  const member = (await schoolMembersRepository.list(db, scope)).find(
    (m) => m.user_id === scope.userId && m.role === 'school_admin',
  )
  if (member)
    await schoolMembersRepository.update(db, scope, member.id, {
      phone_e164: phone,
    })
  await auditSchool(
    db,
    scope,
    'school.wizard_admin_saved',
    'schools',
    scope.schoolId,
    null,
    { has_phone: phone !== null },
  )
}

export async function saveSchoolDetails(
  db: Db,
  scope: SchoolScope,
  input: { name: string; city: string; board: string; acceptTerms: boolean },
): Promise<void> {
  assertAdmin(scope)
  const name = input.name.trim()
  if (name.length < 2 || name.length > 120)
    throw new SchoolError('invalid', 'Please type the name of your school.')
  const city = input.city.trim().slice(0, 80)
  if (input.board !== 'CBSE')
    throw new SchoolError(
      'invalid',
      'PrepPlan is ready for CBSE schools for now.',
    )
  await db
    .updateTable('schools')
    .set({ name, city: city || null, board: input.board })
    .where('id', '=', scope.schoolId)
    .execute()
  const accepted = await schoolTermsAcceptancesRepository.hasAccepted(
    db,
    scope,
    CURRENT_SCHOOL_TERMS_VERSION,
  )
  if (input.acceptTerms && !accepted) await acceptSchoolTerms(db, scope)
  await auditSchool(
    db,
    scope,
    'school.wizard_school_saved',
    'schools',
    scope.schoolId,
    null,
    { board: input.board },
  )
}

/**
 * "Which classes does your school have, and how many sections?" Creates what is missing and adds the
 * subjects PrepPlan has questions for (Maths, Science, Social Science) to every class. Safe to repeat.
 */
export async function saveClasses(
  db: Db,
  scope: SchoolScope,
  input: {
    academicYear: string
    classes: Array<{ grade: number; sections: number }>
  },
): Promise<void> {
  assertAdmin(scope)
  if (input.classes.length === 0)
    throw new SchoolError(
      'invalid',
      'Choose at least one class, or skip this step.',
    )
  const school = await db
    .selectFrom('schools')
    .select('board')
    .where('id', '=', scope.schoolId)
    .executeTakeFirstOrThrow()
  const year = input.academicYear.trim() || suggestedAcademicYear()
  for (const c of input.classes) {
    if (!Number.isInteger(c.grade) || c.grade < 1 || c.grade > 12)
      throw new SchoolError('invalid', 'Choose a class from 1 to 12.')
    if (!Number.isInteger(c.sections) || c.sections < 1 || c.sections > 12)
      throw new SchoolError('invalid', 'A class can have 1 to 12 sections.')
    const existing = (await schoolClassesRepository.list(db, scope)).find(
      (x) => x.grade === c.grade && x.academic_year === year,
    )
    const cls = existing ?? (await createClass(db, scope, c.grade, year))
    const have = new Set(
      (await schoolSectionsRepository.list(db, scope))
        .filter((s) => s.class_id === cls.id)
        .map((s) => s.name),
    )
    for (let i = 0; i < c.sections; i++) {
      const letter = String.fromCharCode(65 + i)
      if (!have.has(letter)) await createSection(db, scope, cls.id, letter)
    }
    const added = new Set(
      (await schoolSubjectsRepository.list(db, scope))
        .filter((s) => s.class_id === cls.id)
        .map((s) => s.subject_id),
    )
    const choices = await db
      .selectFrom('subjects')
      .select(['id', 'code', 'name'])
      .where('board', '=', school.board)
      .where('class', '=', c.grade)
      .where('is_active', '=', true)
      .where((eb) =>
        eb.exists(
          eb
            .selectFrom('chapters')
            .select('chapters.id')
            .whereRef('chapters.subject_id', '=', 'subjects.id'),
        ),
      )
      .execute()
    for (const s of choices)
      if (!added.has(s.id) && !blockedFixtureSubject(s.code))
        await addSchoolSubject(db, scope, cls.id, s.id)
  }
  await auditSchool(
    db,
    scope,
    'school.wizard_classes_saved',
    'schools',
    scope.schoolId,
    null,
    { classes: input.classes.length },
  )
}

/** One teacher at a time: who they are and which class and subject they teach. */
export async function addWizardTeacher(
  db: Db,
  scope: SchoolScope,
  input: {
    name: string
    email: string
    sectionId: string
    schoolSubjectId: string
  },
) {
  assertAdmin(scope)
  const name = input.name.trim()
  const email = input.email.trim().toLowerCase()
  if (name.length < 2)
    throw new SchoolError('invalid', 'Please type the teacher’s name.')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    throw new SchoolError('invalid', 'That e-mail address does not look right.')
  if ((await existingUserEmails(db, [email])).size > 0)
    throw new SchoolError(
      'conflict',
      'Someone already uses that e-mail address. Use a different one.',
    )
  const t = await createSchoolTeacher(db, scope, { name, email })
  await auditSchool(
    db,
    scope,
    'school.teacher_added',
    'school_members',
    t.member.id,
    null,
    { via: 'wizard' },
  )
  await assignTeacher(db, scope, {
    memberId: t.member.id,
    sectionId: input.sectionId,
    schoolSubjectId: input.schoolSubjectId,
  })
  return { memberId: t.member.id }
}
