import { blockedFixtureSubject } from '../fixture-subjects'
import type { Db } from '../../db/connection'
import type { SchoolSampleChecker } from '../../db/enums'
import {
  schoolClassesRepository,
  schoolMembersRepository,
  schoolSectionsRepository,
  schoolSubjectsRepository,
  schoolTeacherAssignmentsRepository,
} from '../../db/repositories'
import type { SchoolScope } from '../../db/school-scope'
import { SchoolError, assertAdmin, auditSchool } from './common'

// Admin-only setup: classes, sections, the subjects taught, who teaches what, who spot-checks.
// Every id a caller passes is looked up through the school-scoped repositories first, so a foreign
// school's id is "not found" here before the composite foreign keys would also refuse it.

export async function createClass(
  db: Db,
  scope: SchoolScope,
  grade: number,
  academicYear: string,
) {
  assertAdmin(scope)
  if (!Number.isInteger(grade) || grade < 1 || grade > 12) {
    throw new SchoolError(
      'invalid',
      'Class must be a whole number from 1 to 12.',
    )
  }
  if (!academicYear.trim())
    throw new SchoolError('invalid', 'Academic year is required.')
  const row = await schoolClassesRepository
    .insert(db, scope, { grade, academic_year: academicYear.trim() })
    .catch(() => {
      throw new SchoolError(
        'conflict',
        'That class already exists for this academic year.',
      )
    })
  await auditSchool(
    db,
    scope,
    'school.class_created',
    'school_classes',
    row.id,
    null,
    row,
  )
  return row
}

export async function createSection(
  db: Db,
  scope: SchoolScope,
  classId: string,
  name: string,
) {
  assertAdmin(scope)
  if (!(await schoolClassesRepository.findById(db, scope, classId))) {
    throw new SchoolError('not_found', 'Class not found.')
  }
  const row = await schoolSectionsRepository
    .insert(db, scope, { class_id: classId, name: name.trim() })
    .catch(() => {
      throw new SchoolError(
        'conflict',
        'That section already exists in this class.',
      )
    })
  await auditSchool(
    db,
    scope,
    'school.section_created',
    'school_sections',
    row.id,
    null,
    row,
  )
  return row
}

/** A school can only teach a subject that has a question bank: the global subject must exist and match the class. */
export async function addSchoolSubject(
  db: Db,
  scope: SchoolScope,
  classId: string,
  subjectId: string,
) {
  assertAdmin(scope)
  const cls = await schoolClassesRepository.findById(db, scope, classId)
  if (!cls) throw new SchoolError('not_found', 'Class not found.')
  const school = await db
    .selectFrom('schools')
    .select('board')
    .where('id', '=', scope.schoolId)
    .executeTakeFirstOrThrow()
  const subject = await db
    .selectFrom('subjects')
    .select(['id', 'code', 'board', 'class'])
    .where('id', '=', subjectId)
    .executeTakeFirst()
  if (
    !subject ||
    blockedFixtureSubject(subject.code) ||
    subject.board !== school.board ||
    subject.class !== cls.grade
  ) {
    throw new SchoolError(
      'invalid',
      `That subject is not part of ${school.board} Class ${cls.grade}.`,
    )
  }
  const row = await schoolSubjectsRepository
    .insert(db, scope, { class_id: classId, subject_id: subjectId })
    .catch(() => {
      throw new SchoolError(
        'conflict',
        'That subject is already added to this class.',
      )
    })
  await auditSchool(
    db,
    scope,
    'school.subject_added',
    'school_subjects',
    row.id,
    null,
    row,
  )
  return row
}

async function teacherMember(db: Db, scope: SchoolScope, memberId: string) {
  const m = await schoolMembersRepository.findById(db, scope, memberId)
  if (!m || m.role !== 'teacher' || m.status !== 'active') {
    throw new SchoolError('not_found', 'Teacher not found.')
  }
  return m
}

export async function setClassTeacher(
  db: Db,
  scope: SchoolScope,
  sectionId: string,
  memberId: string | null,
) {
  assertAdmin(scope)
  const section = await schoolSectionsRepository.findById(db, scope, sectionId)
  if (!section) throw new SchoolError('not_found', 'Section not found.')
  if (memberId) await teacherMember(db, scope, memberId)
  const row = await schoolSectionsRepository.update(db, scope, sectionId, {
    class_teacher_member_id: memberId,
  })
  await auditSchool(
    db,
    scope,
    'school.class_teacher_set',
    'school_sections',
    sectionId,
    { class_teacher_member_id: section.class_teacher_member_id },
    { class_teacher_member_id: memberId },
  )
  return row
}

/** One teacher per section-subject. Reassigning replaces the teacher and keeps the sample-checker setting. */
export async function assignTeacher(
  db: Db,
  scope: SchoolScope,
  input: { memberId: string; sectionId: string; schoolSubjectId: string },
) {
  assertAdmin(scope)
  await teacherMember(db, scope, input.memberId)
  const section = await schoolSectionsRepository.findById(
    db,
    scope,
    input.sectionId,
  )
  const subject = await schoolSubjectsRepository.findById(
    db,
    scope,
    input.schoolSubjectId,
  )
  if (!section || !subject)
    throw new SchoolError('not_found', 'Section or subject not found.')
  if (section.class_id !== subject.class_id) {
    throw new SchoolError(
      'invalid',
      "That subject is not taught in this section's class.",
    )
  }
  const existing = (
    await schoolTeacherAssignmentsRepository.list(db, scope)
  ).find(
    (a) => a.section_id === section.id && a.school_subject_id === subject.id,
  )
  if (existing) {
    const row = await schoolTeacherAssignmentsRepository.update(
      db,
      scope,
      existing.id,
      { member_id: input.memberId },
    )
    await auditSchool(
      db,
      scope,
      'school.teacher_reassigned',
      'school_teacher_assignments',
      existing.id,
      { member_id: existing.member_id },
      { member_id: input.memberId },
    )
    return row
  }
  const row = await schoolTeacherAssignmentsRepository.insert(db, scope, {
    member_id: input.memberId,
    class_id: section.class_id,
    section_id: section.id,
    school_subject_id: subject.id,
    sample_checker: 'class_teacher',
  })
  await auditSchool(
    db,
    scope,
    'school.teacher_assigned',
    'school_teacher_assignments',
    row.id,
    null,
    row,
  )
  return row
}

/** Who spot-checks the AI's marks for this section-subject. Only the school admin may change it. */
export async function setSampleChecker(
  db: Db,
  scope: SchoolScope,
  assignmentId: string,
  checker: SchoolSampleChecker,
) {
  assertAdmin(scope)
  const a = await schoolTeacherAssignmentsRepository.findById(
    db,
    scope,
    assignmentId,
  )
  if (!a) throw new SchoolError('not_found', 'Assignment not found.')
  const row = await schoolTeacherAssignmentsRepository.update(
    db,
    scope,
    assignmentId,
    { sample_checker: checker },
  )
  await auditSchool(
    db,
    scope,
    'school.sample_checker_set',
    'school_teacher_assignments',
    assignmentId,
    { sample_checker: a.sample_checker },
    { sample_checker: checker },
  )
  return row
}
