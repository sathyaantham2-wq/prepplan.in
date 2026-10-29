import type { Db } from '../../db/connection'
import { schoolsRepository } from '../../db/repositories'
import { blockedFixtureSubject } from '../fixture-subjects'
import { loadSchoolScope } from '../school-session'
import { auditSchool } from './common'
import { issueFirstAdminCode, issueStaffCredentials } from './credentials'
import { createSchoolStudent, createSchoolTeacher } from './people'
import {
  addSchoolSubject,
  assignTeacher,
  createClass,
  createSection,
  setClassTeacher,
} from './setup'
import { adoptDefaultTemplate } from './template-service'
import { acceptSchoolTerms } from './terms'

// Creating the demo school (M1). Kept apart from demo.ts so the provisioning script can load it
// without the PDF code (which a plain script runner cannot import).

export const DEMO_AI_SPEND_CAP_INR = 50
export const DEMO_STUDENT_COUNT = 30

/** Thirty invented names. None is meant to be a real person; the whole school is labelled DEMO. */
export const DEMO_STUDENT_NAMES = [
  'Aarna Demo',
  'Bhavin Sample',
  'Charu Example',
  'Dev Placeholder',
  'Esha Imagined',
  'Farhan Sketch',
  'Gauri Mock',
  'Harsh Pretend',
  'Ira Fictional',
  'Jay Specimen',
  'Kavya Trial',
  'Laksh Invented',
  'Mira Dummy',
  'Nikhil Sample',
  'Oviya Demo',
  'Pranav Example',
  'Qadir Placeholder',
  'Riya Imagined',
  'Sahil Sketch',
  'Tara Mock',
  'Uday Pretend',
  'Vani Fictional',
  'Wasim Specimen',
  'Xena Trial',
  'Yash Invented',
  'Zoya Dummy',
  'Anvi Demo',
  'Bodhi Sample',
  'Chetna Example',
  'Dhruv Placeholder',
] as const

export async function provisionDemoSchool(
  db: Db,
  input: {
    name: string
    code: string
    adminName: string
    adminEmail: string
    teacherName: string
    teacherEmail: string
    /** Only these subject codes (the script's --subjects). Default: every Class 7 subject that has questions. */
    subjectCodes?: Array<string>
  },
) {
  const result = await schoolsRepository.provision(db, {
    name: input.name,
    code: input.code,
    board: 'CBSE',
    city: 'Demo city',
    adminName: input.adminName,
    adminEmail: input.adminEmail,
  })
  const schoolId = result.school.id
  await db
    .updateTable('schools')
    .set({
      is_demo: true,
      ai_spend_cap_inr: String(DEMO_AI_SPEND_CAP_INR),
      wizard_step: 'done',
      wizard_done_at: new Date(),
    })
    .where('id', '=', schoolId)
    .execute()
  const loaded = await loadSchoolScope(db, result.adminUserId, schoolId, [
    'school_admin',
  ])
  if (!loaded.ok) throw new Error('Could not open the demo school')
  const admin = loaded.scope
  await acceptSchoolTerms(db, admin)

  const cls = await createClass(db, admin, 7, '2026-27')
  const section = await createSection(db, admin, cls.id, 'A')
  const choices = await db
    .selectFrom('subjects')
    .select(['id', 'code'])
    .where('board', '=', 'CBSE')
    .where('class', '=', 7)
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
  const added = []
  for (const s of choices)
    if (
      !blockedFixtureSubject(s.code) &&
      (!input.subjectCodes || input.subjectCodes.includes(s.code))
    )
      added.push(await addSchoolSubject(db, admin, cls.id, s.id))

  // the two ready-made layouts, so "Make a paper" works at once
  await adoptDefaultTemplate(db, admin, 'unit_test_40')
  await adoptDefaultTemplate(db, admin, 'cbse_80')

  const teacher = await createSchoolTeacher(db, admin, {
    name: input.teacherName,
    email: input.teacherEmail,
  })
  await setClassTeacher(db, admin, section.id, teacher.member.id)
  for (const s of added)
    await assignTeacher(db, admin, {
      memberId: teacher.member.id,
      sectionId: section.id,
      schoolSubjectId: s.id,
    })

  for (const [i, name] of DEMO_STUDENT_NAMES.entries())
    await createSchoolStudent(db, admin, {
      name,
      grade: 7,
      sectionId: section.id,
      sectionName: 'A',
      rollNo: String(i + 1),
      admissionNo: `DEMO-${String(i + 1).padStart(4, '0')}`,
      guardianPhone: null,
      guardianName: null,
    })

  const adminCode = await issueFirstAdminCode(
    db,
    schoolId,
    result.adminMemberId,
  )
  const teacherCode = await issueStaffCredentials(db, admin, {
    memberId: teacher.member.id,
    delivery: 'slip',
  })
  await auditSchool(
    db,
    admin,
    'school.demo_created',
    'schools',
    schoolId,
    null,
    { students: DEMO_STUDENT_COUNT },
  )
  return {
    schoolId,
    adminCode: adminCode.code,
    teacherCode: teacherCode.delivery === 'slip' ? teacherCode.code : null,
    subjects: added.length,
  }
}
