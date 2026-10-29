import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createDb } from '../../db/connection'
import type { Db } from '../../db/connection'
import { schoolsRepository } from '../../db/repositories'
import type { SchoolScope } from '../../db/school-scope'
import {
  deleteSchoolTermsForTest,
  deleteTestCredentials,
  signInSchoolUserForTest,
} from '../../db/test-helpers'
import type { TestSession } from '../../db/test-helpers'
import { Route as MeRoute } from '../../routes/api/school-me'
import { Route as OverviewRoute } from '../../routes/api/schools/$schoolId/overview'
import { Route as SetupRoute } from '../../routes/api/schools/$schoolId/setup'
import { Route as SectionStudentsRoute } from '../../routes/api/schools/$schoolId/sections/$sectionId/students'
import { loadSchoolScope } from '../school-session'
import { createSchoolStudent, createSchoolTeacher } from './people'
import {
  addSchoolSubject,
  assignTeacher,
  createClass,
  createSection,
  setClassTeacher,
} from './setup'
import { acceptSchoolTerms } from './terms'

type Handler = (o: {
  request: Request
  params: Record<string, string>
}) => Promise<Response>
const handler = (route: { options: { server?: unknown } }, method: string) =>
  (route.options.server as { handlers: Record<string, Handler> }).handlers[
    method
  ]
const call = (
  route: { options: { server?: unknown } },
  method: string,
  cookie: string | null,
  params: Record<string, string>,
  body?: unknown,
) =>
  handler(
    route,
    method,
  )({
    request: new Request('http://localhost/x', {
      method,
      headers: {
        ...(cookie ? { cookie } : {}),
        'content-type': 'application/json',
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    }),
    params,
  })

/** S3 data endpoints: what each role may see and do. Local test database only. */
describe('school screens API (S3)', () => {
  let db: Db
  const tag = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  const schoolIds: Array<string> = []
  let schoolA: string
  let schoolB: string
  let admin: SchoolScope
  let sA: string
  let sB: string
  let subjectId: string
  let adminS: TestSession
  let classTeacherS: TestSession
  let subjectTeacherS: TestSession
  let outsiderS: TestSession
  let studentS: TestSession
  let otherAdminS: TestSession
  let tSubjectMember: string
  const userIds: Array<string> = []
  const households: Array<string> = []

  beforeAll(async () => {
    db = createDb()
    const mk = async (n: string) => {
      const p = await schoolsRepository.provision(db, {
        name: `Screens ${n} ${tag}`,
        code: `scr-${n}-${tag}`,
        board: 'CBSE',
        adminName: `Admin ${n}`,
        adminEmail: `scr-${n}-${tag}@school.test`,
      })
      schoolIds.push(p.school.id)
      userIds.push(p.adminUserId)
      return p
    }
    const a = await mk('a')
    const b = await mk('b')
    schoolA = a.school.id
    schoolB = b.school.id
    const s = await loadSchoolScope(db, a.adminUserId, schoolA, [
      'school_admin',
    ])
    if (!s.ok) throw new Error('scope')
    admin = s.scope
    await acceptSchoolTerms(db, admin)
    subjectId = (
      await db
        .insertInto('subjects')
        .values({
          board: 'CBSE',
          class: 7,
          code: `ZS-${tag}`,
          name: 'Screens Maths',
          language: 'en',
          is_active: true,
        })
        .returning('id')
        .executeTakeFirstOrThrow()
    ).id
    const cls = await createClass(db, admin, 7, '2026-27')
    sA = (await createSection(db, admin, cls.id, 'A')).id
    sB = (await createSection(db, admin, cls.id, 'B')).id
    const subj = await addSchoolSubject(db, admin, cls.id, subjectId)
    const ct = await createSchoolTeacher(db, admin, {
      name: 'Class Teacher',
      email: `ct-${tag}@school.test`,
    })
    const st = await createSchoolTeacher(db, admin, {
      name: 'Subject Teacher',
      email: `st-${tag}@school.test`,
    })
    tSubjectMember = st.member.id
    households.push(ct.user.household_id, st.user.household_id)
    await setClassTeacher(db, admin, sA, ct.member.id)
    await assignTeacher(db, admin, {
      memberId: st.member.id,
      sectionId: sB,
      schoolSubjectId: subj.id,
    })
    const stu = await createSchoolStudent(db, admin, {
      name: 'Asha A',
      grade: 7,
      sectionId: sA,
      sectionName: 'A',
      rollNo: '1',
      admissionNo: 'ADM-1',
      guardianPhone: '+919876543210',
      guardianName: null,
    })
    await createSchoolStudent(db, admin, {
      name: 'Kiran B',
      grade: 7,
      sectionId: sB,
      sectionName: 'B',
      rollNo: '1',
      admissionNo: null,
      guardianPhone: null,
      guardianName: null,
    })
    households.push(stu.user.household_id)
    adminS = await signInSchoolUserForTest(a.adminUserId)
    classTeacherS = await signInSchoolUserForTest(ct.user.id)
    subjectTeacherS = await signInSchoolUserForTest(st.user.id)
    studentS = await signInSchoolUserForTest(stu.user.id)
    otherAdminS = await signInSchoolUserForTest(b.adminUserId)
    outsiderS = otherAdminS
    userIds.push(ct.user.id, st.user.id, stu.user.id)
  })

  afterAll(async () => {
    const ids = schoolIds
    await deleteTestCredentials(userIds)
    await db.deleteFrom('audit_log').where('school_id', 'in', ids).execute()
    await db
      .deleteFrom('school_student_guardians')
      .where('school_id', 'in', ids)
      .execute()
    await db
      .deleteFrom('school_students')
      .where('school_id', 'in', ids)
      .execute()
    await db.deleteFrom('students').where('school_id', 'in', ids).execute()
    await db
      .deleteFrom('school_teacher_assignments')
      .where('school_id', 'in', ids)
      .execute()
    await db
      .deleteFrom('school_subjects')
      .where('school_id', 'in', ids)
      .execute()
    await db
      .deleteFrom('school_sections')
      .where('school_id', 'in', ids)
      .execute()
    await db
      .deleteFrom('school_classes')
      .where('school_id', 'in', ids)
      .execute()
    await deleteSchoolTermsForTest(db, ids)
    const members = await db
      .selectFrom('school_members')
      .select('user_id')
      .where('school_id', 'in', ids)
      .execute()
    await db
      .deleteFrom('school_members')
      .where('school_id', 'in', ids)
      .execute()
    const sh = await db
      .selectFrom('schools')
      .select('household_id')
      .where('id', 'in', ids)
      .execute()
    await db.deleteFrom('schools').where('id', 'in', ids).execute()
    const mu = members.map((m) => m.user_id)
    const hh = await db
      .selectFrom('users')
      .select('household_id')
      .where('id', 'in', mu)
      .execute()
    await db.deleteFrom('users').where('id', 'in', mu).execute()
    await db
      .deleteFrom('households')
      .where('id', 'in', [
        ...sh.map((h) => h.household_id),
        ...hh.map((h) => h.household_id),
        ...households,
      ])
      .execute()
    await db.deleteFrom('subjects').where('id', '=', subjectId).execute()
    await db.destroy()
  })

  it('/api/school-me needs a session and lists only this person’s schools', async () => {
    expect((await call(MeRoute, 'GET', null, {})).status).toBe(401)
    const me = (await (
      await call(MeRoute, 'GET', adminS.cookie, {})
    ).json()) as { name: string; schools: Array<{ id: string; role: string }> }
    expect(me.schools).toEqual([
      expect.objectContaining({ id: schoolA, role: 'school_admin' }),
    ])
  })

  it('the admin sees the whole school, with the subjects still to add and the people', async () => {
    const o = await (
      await call(OverviewRoute, 'GET', adminS.cookie, { schoolId: schoolA })
    ).json()
    expect(o.role).toBe('school_admin')
    expect(o.termsAccepted).toBe(true)
    expect(o.classes[0].sections.map((s: any) => s.name)).toEqual(['A', 'B'])
    expect(o.classes[0].subjects.map((s: any) => s.name)).toEqual([
      'Screens Maths',
    ])
    expect(o.counts).toMatchObject({ students: 2, teachers: 2, classes: 1 })
    expect(o.teachers.map((t: any) => t.name)).toEqual(
      expect.arrayContaining(['Class Teacher', 'Subject Teacher']),
    )
    expect(o.assignments).toHaveLength(1)
    expect(JSON.stringify(o)).not.toContain('9876543210') // no parent phone on any screen payload
  })

  it('a teacher sees only the sections they teach or look after', async () => {
    const ct = await (
      await call(OverviewRoute, 'GET', classTeacherS.cookie, {
        schoolId: schoolA,
      })
    ).json()
    expect(ct.classes[0].sections.map((s: any) => s.name)).toEqual(['A'])
    expect(ct.teachers).toEqual([])
    const st = await (
      await call(OverviewRoute, 'GET', subjectTeacherS.cookie, {
        schoolId: schoolA,
      })
    ).json()
    expect(st.classes[0].sections.map((s: any) => s.name)).toEqual(['B'])
    expect(st.assignments).toHaveLength(1)
  })

  it('a student gets only her own name; a stranger gets 404', async () => {
    const s = await (
      await call(OverviewRoute, 'GET', studentS.cookie, { schoolId: schoolA })
    ).json()
    expect(s.role).toBe('student')
    expect(s.classes).toEqual([])
    expect(s.me.name).toBe('Asha A')
    expect(
      (
        await call(OverviewRoute, 'GET', outsiderS.cookie, {
          schoolId: schoolA,
        })
      ).status,
    ).toBe(404)
    expect(
      (await call(OverviewRoute, 'GET', null, { schoolId: schoolA })).status,
    ).toBe(401)
  })

  it('section students: allowed for the section’s teachers, hidden from others', async () => {
    const asAdmin = await (
      await call(SectionStudentsRoute, 'GET', adminS.cookie, {
        schoolId: schoolA,
        sectionId: sA,
      })
    ).json()
    expect(asAdmin.students).toEqual([
      expect.objectContaining({
        name: 'Asha A',
        admissionNo: 'ADM-1',
        signedUp: true,
      }),
    ])
    expect(
      (
        await call(SectionStudentsRoute, 'GET', classTeacherS.cookie, {
          schoolId: schoolA,
          sectionId: sA,
        })
      ).status,
    ).toBe(200)
    expect(
      (
        await call(SectionStudentsRoute, 'GET', classTeacherS.cookie, {
          schoolId: schoolA,
          sectionId: sB,
        })
      ).status,
    ).toBe(404) // not hers
    expect(
      (
        await call(SectionStudentsRoute, 'GET', subjectTeacherS.cookie, {
          schoolId: schoolA,
          sectionId: sB,
        })
      ).status,
    ).toBe(200)
    expect(
      (
        await call(SectionStudentsRoute, 'GET', studentS.cookie, {
          schoolId: schoolA,
          sectionId: sA,
        })
      ).status,
    ).toBe(403)
    expect(
      (
        await call(SectionStudentsRoute, 'GET', otherAdminS.cookie, {
          schoolId: schoolB,
          sectionId: sA,
        })
      ).status,
    ).toBe(404) // another school's section id
  })

  it('setup actions are admin-only, validated, and reach the services', async () => {
    const post = (cookie: string, body: unknown) =>
      call(SetupRoute, 'POST', cookie, { schoolId: schoolA }, body)
    expect(
      (
        await post(classTeacherS.cookie, {
          action: 'create_class',
          grade: 8,
          academic_year: '2026-27',
        })
      ).status,
    ).toBe(403)
    expect((await post(adminS.cookie, { action: 'nonsense' })).status).toBe(400)
    expect(
      (await post(adminS.cookie, { action: 'create_class', grade: 8 })).status,
    ).toBe(400)
    expect(
      (
        await post(adminS.cookie, {
          action: 'create_class',
          grade: 8,
          academic_year: '2026-27',
        })
      ).status,
    ).toBe(200)
    expect(
      (
        await post(adminS.cookie, {
          action: 'create_class',
          grade: 8,
          academic_year: '2026-27',
        })
      ).status,
    ).toBe(409)
    const assignments = await db
      .selectFrom('school_teacher_assignments')
      .select('id')
      .where('school_id', '=', schoolA)
      .execute()
    expect(
      (
        await post(adminS.cookie, {
          action: 'set_sample_checker',
          assignment_id: assignments[0].id,
          checker: 'subject_teacher',
        })
      ).status,
    ).toBe(200)
    expect(
      (
        await post(adminS.cookie, {
          action: 'set_class_teacher',
          section_id: sB,
          member_id: tSubjectMember,
        })
      ).status,
    ).toBe(200)
    expect(
      (
        await call(
          SetupRoute,
          'POST',
          otherAdminS.cookie,
          { schoolId: schoolA },
          { action: 'create_class', grade: 9, academic_year: 'x' },
        )
      ).status,
    ).toBe(404)
  })
})
