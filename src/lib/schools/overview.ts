import { blockedFixtureSubject } from '../fixture-subjects'
import { SCHOOL_MODULES } from './modules'
import type { SchoolModule } from './modules'
import type { Db } from '../../db/connection'
import {
  schoolClassesRepository,
  schoolLoginRepository,
  schoolSectionsRepository,
  schoolStudentsRepository,
  schoolSubjectsRepository,
  schoolTeacherAssignmentsRepository,
  schoolTermsAcceptancesRepository,
} from '../../db/repositories'
import type { SchoolScope } from '../../db/school-scope'
import { SchoolError } from './common'
import { CURRENT_SCHOOL_TERMS_VERSION } from './terms'

// What the school screens show, in one call. Role decides how much: the admin and principal see
// the whole school, a teacher only the sections they teach or look after, a student only herself.

export interface OverviewSection {
  id: string
  name: string
  classTeacherMemberId: string | null
  studentCount: number
}
export interface OverviewClass {
  id: string
  grade: number
  academicYear: string
  sections: Array<OverviewSection>
  subjects: Array<{ id: string; name: string }>
  /** Subjects PrepPlan has questions for that this class has not added yet (admin only). */
  availableSubjects: Array<{ id: string; name: string }>
}
export interface SchoolOverview {
  school: {
    id: string
    name: string
    code: string
    board: string
    /** A demo school: every screen is labelled "DEMO - sample data". */
    isDemo: boolean
    showClassRank: boolean
    disputeWindowDays: number
    /** The parts the school uses: 'papers' (make exam papers) and/or 'correction' (AI correction). */
    modules: Array<SchoolModule>
    /** Spend cap for the AI steps, in rupees; null means none is set. */
    aiSpendCapInr: number | null
  }
  /** The admin has finished (or skipped) the first-sign-in wizard. */
  wizardDone: boolean
  role: SchoolScope['role']
  termsAccepted: boolean
  classes: Array<OverviewClass>
  teachers: Array<{
    memberId: string
    name: string
    email: string
    role: string
    hasPassword: boolean
  }>
  assignments: Array<{
    id: string
    sectionId: string
    schoolSubjectId: string
    memberId: string
    sampleChecker: 'class_teacher' | 'subject_teacher'
  }>
  counts: { students: number; teachers: number; classes: number }
  me: { name: string; memberId: string | null }
}

export async function loadSchoolOverview(
  db: Db,
  scope: SchoolScope,
): Promise<SchoolOverview> {
  const school = await db
    .selectFrom('schools')
    .select([
      'id',
      'name',
      'code',
      'board',
      'is_demo',
      'ai_spend_cap_inr',
      'wizard_done_at',
      'modules',
      'show_class_rank',
      'dispute_window_days',
    ])
    .where('id', '=', scope.schoolId)
    .executeTakeFirstOrThrow()
  const user = await db
    .selectFrom('users')
    .select('name')
    .where('id', '=', scope.userId)
    .executeTakeFirstOrThrow()
  const myMemberId = await schoolLoginRepository.teacherMemberId(db, scope)
  const termsAccepted = await schoolTermsAcceptancesRepository.hasAccepted(
    db,
    scope,
    CURRENT_SCHOOL_TERMS_VERSION,
  )

  const base = {
    school: {
      id: school.id,
      name: school.name,
      code: school.code,
      board: school.board,
      isDemo: school.is_demo,
      showClassRank: school.show_class_rank,
      disputeWindowDays: school.dispute_window_days,
      modules: SCHOOL_MODULES.filter((m) => school.modules.includes(m)),
      aiSpendCapInr:
        school.ai_spend_cap_inr === null
          ? null
          : Number(school.ai_spend_cap_inr),
    },
    wizardDone: school.wizard_done_at !== null,
    role: scope.role,
    termsAccepted,
    me: { name: user.name, memberId: myMemberId },
  }
  if (scope.role === 'student' || scope.role === 'parent') {
    return {
      ...base,
      classes: [],
      teachers: [],
      assignments: [],
      counts: { students: 0, teachers: 0, classes: 0 },
    }
  }

  const wholeSchool = scope.pairs === 'all'
  const allSections = await schoolSectionsRepository.list(db, scope)
  const allAssignments = await schoolTeacherAssignmentsRepository.list(
    db,
    scope,
  )
  const mine = new Set<string>()
  if (!wholeSchool) {
    for (const p of [
      ...(scope.pairs as ReadonlyArray<{ sectionId: string }>),
      ...scope.samplePairs,
    ])
      mine.add(p.sectionId)
    for (const sec of allSections)
      if (myMemberId && sec.class_teacher_member_id === myMemberId)
        mine.add(sec.id)
  }
  const sections = allSections.filter((s) => wholeSchool || mine.has(s.id))
  const roster = await schoolStudentsRepository.rosterIndex(db, scope)
  const studentsBySection = new Map<string, number>()
  for (const r of roster)
    studentsBySection.set(
      r.section_id,
      (studentsBySection.get(r.section_id) ?? 0) + 1,
    )

  const classes = (await schoolClassesRepository.list(db, scope))
    .filter((c) => sections.some((s) => s.class_id === c.id) || wholeSchool)
    .sort(
      (a, b) =>
        a.grade - b.grade || a.academic_year.localeCompare(b.academic_year),
    )
  const schoolSubjects = await schoolSubjectsRepository.list(db, scope)
  const subjectNames = new Map(
    (
      await db
        .selectFrom('subjects')
        .select(['id', 'name', 'code', 'board', 'class', 'is_active'])
        .execute()
    ).map((s) => [s.id, s]),
  )

  const outClasses: Array<OverviewClass> = classes.map((c) => {
    const added = schoolSubjects.filter((s) => s.class_id === c.id)
    const addedIds = new Set(added.map((s) => s.subject_id))
    return {
      id: c.id,
      grade: c.grade,
      academicYear: c.academic_year,
      sections: sections
        .filter((s) => s.class_id === c.id)
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((s) => ({
          id: s.id,
          name: s.name,
          classTeacherMemberId: s.class_teacher_member_id,
          studentCount: studentsBySection.get(s.id) ?? 0,
        })),
      subjects: added.map((s) => ({
        id: s.id,
        name: subjectNames.get(s.subject_id)?.name ?? 'Subject',
      })),
      availableSubjects: wholeSchool
        ? [...subjectNames.values()]
            .filter(
              (s) =>
                s.is_active &&
                !blockedFixtureSubject(s.code) &&
                s.board === school.board &&
                s.class === c.grade &&
                !addedIds.has(s.id),
            )
            .map((s) => ({ id: s.id, name: s.name }))
        : [],
    }
  })

  const staff =
    scope.role === 'teacher'
      ? []
      : await schoolLoginRepository.listStaff(db, scope)
  const assignments = allAssignments
    .filter((a) => wholeSchool || mine.has(a.section_id))
    .map((a) => ({
      id: a.id,
      sectionId: a.section_id,
      schoolSubjectId: a.school_subject_id,
      memberId: a.member_id,
      sampleChecker: a.sample_checker,
    }))
  return {
    ...base,
    classes: outClasses,
    teachers: staff,
    assignments,
    counts: {
      students: wholeSchool
        ? roster.length
        : sections.reduce((n, s) => n + (studentsBySection.get(s.id) ?? 0), 0),
      teachers: wholeSchool
        ? staff.filter((s) => s.role === 'teacher').length
        : 0,
      classes: outClasses.length,
    },
  }
}

/** Who may look at a section's students: admin, principal, a teacher of the section, its class teacher. */
export async function canSeeSection(
  db: Db,
  scope: SchoolScope,
  sectionId: string,
): Promise<boolean> {
  if (!(await schoolSectionsRepository.findById(db, scope, sectionId)))
    return false
  if (scope.pairs === 'all') return true
  if (scope.role !== 'teacher') return false
  if (
    [
      ...(scope.pairs as ReadonlyArray<{ sectionId: string }>),
      ...scope.samplePairs,
    ].some((p) => p.sectionId === sectionId)
  )
    return true
  return schoolLoginRepository.isClassTeacherOf(db, scope, sectionId)
}

export async function listSectionStudents(
  db: Db,
  scope: SchoolScope,
  sectionId: string,
) {
  if (!(await canSeeSection(db, scope, sectionId)))
    throw new SchoolError('not_found', 'Section not found.')
  const rows = await schoolLoginRepository.studentsForSlips(
    db,
    scope,
    sectionId,
    true,
  )
  return rows.map((r) => ({
    schoolStudentId: r.school_student_id,
    name: r.name,
    rollNo: r.roll_no,
    admissionNo: r.admission_no,
    signedUp: !!r.password,
  }))
}
