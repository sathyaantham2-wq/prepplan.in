import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { auth } from '../auth'
import { createDb } from '../../db/connection'
import type { Db } from '../../db/connection'
import {
  auditLogRepository,
  schoolStudentsRepository,
  schoolsRepository,
} from '../../db/repositories'
import type { SchoolScope } from '../../db/school-scope'
import { TEST_PASSWORD, deleteSchoolTermsForTest } from '../../db/test-helpers'
import { loadSchoolScope } from '../school-session'
import { SchoolError } from './common'
import ExcelJS from 'exceljs'
import { commitRosterImport, dryRunRosterImport } from './roster'
import { parseRosterFile } from './roster-parse'
import { buildRosterTemplate } from './roster-template'
import {
  addSchoolSubject,
  assignTeacher,
  createClass,
  createSection,
  setClassTeacher,
  setSampleChecker,
} from './setup'
import { acceptSchoolTerms } from './terms'

/**
 * S2: roster upload, teacher assignments, sample-check scope, terms enforcement, admin-only
 * creation. Plan tests 2, 4, 9, 15, 17, 18. Local test database only.
 */
const YEAR = '2026-27'
const csv = (lines: Array<string>) => Buffer.from(lines.join('\n') + '\n')
const STUDENT_HEAD = 'Name,Class,Section,Roll No,Parent Phone'

async function refuses(p: Promise<unknown>, code: SchoolError['code']) {
  const e = await p.then(
    () => null,
    (err) => err,
  )
  expect(e, `expected SchoolError ${code}`).toBeInstanceOf(SchoolError)
  expect((e as SchoolError).code).toBe(code)
}

describe('school roster, assignments and terms (S2)', () => {
  let db: Db
  const tag = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  const schoolIds: Array<string> = []
  let schoolA: string
  let schoolB: string
  let adminA: SchoolScope
  let adminB: SchoolScope
  let adminAUser: string
  const subjectIds: Array<string> = []
  let classA: string
  let sectionA: string
  let sectionB: string
  let sub1: string
  let sub2: string
  const teachers: Record<string, string> = {} // name -> member id
  const publicEmails: Array<string> = []

  async function scopeOf(
    userId: string,
    schoolId: string,
    role: Parameters<typeof loadSchoolScope>[3],
  ) {
    const r = await loadSchoolScope(db, userId, schoolId, role)
    if (!r.ok) throw new Error(`no scope: ${r.reason}`)
    return r.scope
  }
  async function userIdOfMember(memberId: string) {
    return (
      await db
        .selectFrom('school_members')
        .select('user_id')
        .where('id', '=', memberId)
        .executeTakeFirstOrThrow()
    ).user_id
  }

  beforeAll(async () => {
    db = createDb()
    const mk = async (n: string) => {
      const p = await schoolsRepository.provision(db, {
        name: `Roster School ${n} ${tag}`,
        code: `rs-${n}-${tag}`,
        board: 'CBSE',
        adminName: `Admin ${n}`,
        adminEmail: `admin-${n}-${tag}@school.test`,
      })
      schoolIds.push(p.school.id)
      return p
    }
    const a = await mk('a')
    const b = await mk('b')
    schoolA = a.school.id
    schoolB = b.school.id
    adminAUser = a.adminUserId
    adminA = await scopeOf(a.adminUserId, schoolA, ['school_admin'])
    adminB = await scopeOf(b.adminUserId, schoolB, ['school_admin'])
    for (const code of ['S1', 'S2']) {
      const row = await db
        .insertInto('subjects')
        .values({
          board: 'CBSE',
          class: 7,
          code: `ZR${code}-${tag}`,
          name: `Roster ${code}`,
          language: 'en',
          is_active: true,
        })
        .returning('id')
        .executeTakeFirstOrThrow()
      subjectIds.push(row.id)
    }
  })

  afterAll(async () => {
    const ids = schoolIds
    const users = await db
      .selectFrom('school_members')
      .select('user_id')
      .where('school_id', 'in', ids)
      .execute()
    const userIds = users.map((u) => u.user_id)
    const households = await db
      .selectFrom('users')
      .select('household_id')
      .where('id', 'in', userIds.length ? userIds : [adminAUser])
      .execute()
    const schoolHouseholds = await db
      .selectFrom('schools')
      .select('household_id')
      .where('id', 'in', ids)
      .execute()
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
      .deleteFrom('school_import_batches')
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
    await db
      .deleteFrom('school_members')
      .where('school_id', 'in', ids)
      .execute()
    await db.deleteFrom('schools').where('id', 'in', ids).execute()
    if (userIds.length)
      await db.deleteFrom('users').where('id', 'in', userIds).execute()
    const pub = await db
      .selectFrom('users')
      .select(['id', 'household_id'])
      .where('email', 'in', publicEmails.length ? publicEmails : ['-'])
      .execute()
    if (pub.length) {
      const pubIds = pub.map((u) => u.id)
      await db
        .deleteFrom('consents')
        .where('given_by_user_id', 'in', pubIds)
        .execute()
      await db.deleteFrom('students').where('user_id', 'in', pubIds).execute()
      await db.deleteFrom('accounts').where('user_id', 'in', pubIds).execute()
      await db.deleteFrom('sessions').where('user_id', 'in', pubIds).execute()
      await db.deleteFrom('users').where('id', 'in', pubIds).execute()
      await db
        .deleteFrom('households')
        .where(
          'id',
          'in',
          pub.map((u) => u.household_id),
        )
        .execute()
    }
    await db
      .deleteFrom('households')
      .where('id', 'in', [
        ...households.map((h) => h.household_id),
        ...schoolHouseholds.map((h) => h.household_id),
      ])
      .execute()
    await db.destroy()
  })

  describe('18. no terms, no students', () => {
    it('a school that has not accepted the current terms cannot upload a roster', async () => {
      await refuses(
        dryRunRosterImport(db, adminB, {
          kind: 'teachers',
          fileName: 't.csv',
          bytes: csv(['Name,Email', 'T,t@x.in']),
        }),
        'terms_not_accepted',
      )
    })
    it('only the school admin can accept, once per version, and it is recorded and audited', async () => {
      const teacherScope = { ...adminB, role: 'teacher' } as SchoolScope
      await refuses(acceptSchoolTerms(db, teacherScope), 'forbidden')
      const row = await acceptSchoolTerms(db, adminB, { ip: '203.0.113.9' })
      expect(row.accepted_by_user_id).toBe(adminB.userId)
      expect(row.terms_version).toBeTruthy()
      await refuses(acceptSchoolTerms(db, adminB), 'conflict')
      await refuses(
        acceptSchoolTerms(db, adminB, { termsVersion: 'old' }),
        'invalid',
      )
      const audit = await db
        .selectFrom('audit_log')
        .selectAll()
        .where('school_id', '=', schoolB)
        .where('action', '=', 'school.terms_accepted')
        .execute()
      expect(audit).toHaveLength(1)
    })
  })

  describe('setup and import (school A)', () => {
    beforeAll(async () => {
      await acceptSchoolTerms(db, adminA)
      classA = (await createClass(db, adminA, 7, YEAR)).id
      sectionA = (await createSection(db, adminA, classA, 'A')).id
      sectionB = (await createSection(db, adminA, classA, 'B')).id
      sub1 = (await addSchoolSubject(db, adminA, classA, subjectIds[0])).id
      sub2 = (await addSchoolSubject(db, adminA, classA, subjectIds[1])).id
    })

    it('setup is admin-only and refuses a subject from another class or unknown ids', async () => {
      await refuses(
        createClass(db, { ...adminA, role: 'teacher' }, 8, YEAR),
        'forbidden',
      )
      await refuses(createClass(db, adminA, 7, YEAR), 'conflict')
      await refuses(createClass(db, adminA, 13, YEAR), 'invalid')
      const class8 = await createClass(db, adminA, 8, YEAR)
      await refuses(
        addSchoolSubject(db, adminA, class8.id, subjectIds[0]),
        'invalid',
      ) // class 7 subject in class 8
      await refuses(
        createSection(db, adminA, '00000000-0000-0000-0000-000000000000', 'A'),
        'not_found',
      )
    })

    it('teachers: dry run previews, an existing account is an error, commit creates staff with no consent row', async () => {
      const pre = await dryRunRosterImport(db, adminA, {
        kind: 'teachers',
        fileName: 't.csv',
        bytes: csv([
          'Name,Email',
          `Tina One,tina-${tag}@school.test`,
          `Tom Two,tom-${tag}@school.test`,
          `Tara Three,tara-${tag}@school.test`,
          `Dup,admin-a-${tag}@school.test`,
          'Bad,notanemail',
        ]),
      })
      expect(pre.counts).toEqual({ new: 3, unchanged: 0, errors: 2 })
      expect(pre.committable).toBe(false)
      await refuses(commitRosterImport(db, adminA, pre.batchId), 'invalid')
      const ok = await dryRunRosterImport(db, adminA, {
        kind: 'teachers',
        fileName: 't.csv',
        bytes: csv([
          'Name,Email',
          `Tina One,tina-${tag}@school.test`,
          `Tom Two,tom-${tag}@school.test`,
          `Tara Three,tara-${tag}@school.test`,
        ]),
      })
      expect(ok.committable).toBe(true)
      expect(await commitRosterImport(db, adminA, ok.batchId)).toEqual({
        added: 3,
      })
      await refuses(commitRosterImport(db, adminA, ok.batchId), 'conflict') // already applied
      const members = await db
        .selectFrom('school_members')
        .innerJoin('users', 'users.id', 'school_members.user_id')
        .select([
          'school_members.id as member_id',
          'users.name',
          'users.signup_type',
          'users.role',
        ])
        .where('school_members.school_id', '=', schoolA)
        .where('school_members.role', '=', 'teacher')
        .execute()
      expect(members).toHaveLength(3)
      for (const m of members) {
        expect(m.signup_type).toBe('school')
        teachers[m.name.split(' ')[0]] = m.member_id
      }
    })

    it('students: bad rows block commit; a good file loads; the same file again adds nobody', async () => {
      const bad = await dryRunRosterImport(db, adminA, {
        kind: 'students',
        academicYear: YEAR,
        fileName: 's.csv',
        bytes: csv([
          STUDENT_HEAD,
          'Asha,7,A,1,9876543210',
          'Ravi,7,A,1,',
          'Mala,9,A,3,',
          'Sam,7,Z,4,',
          'Lee,7,A,5,12345',
        ]),
      })
      expect(bad.counts).toEqual({ new: 1, unchanged: 0, errors: 4 })
      expect(
        bad.rows.filter((r) => r.status === 'error').map((r) => r.row),
      ).toEqual([2, 3, 4, 5])
      await refuses(commitRosterImport(db, adminA, bad.batchId), 'invalid')

      const file = csv([
        STUDENT_HEAD,
        'Asha,7,A,1,9876543210',
        'Ravi,7,A,2,',
        'Mala,7,A,3,+91 98765 11111',
        'Kiran,7,B,1,9000000001',
      ])
      const pre = await dryRunRosterImport(db, adminA, {
        kind: 'students',
        academicYear: YEAR,
        fileName: 's.csv',
        bytes: file,
      })
      expect(pre.counts).toEqual({ new: 4, unchanged: 0, errors: 0 })
      expect(await commitRosterImport(db, adminA, pre.batchId)).toEqual({
        added: 4,
      })

      const again = await dryRunRosterImport(db, adminA, {
        kind: 'students',
        academicYear: YEAR,
        fileName: 's.csv',
        bytes: file,
      })
      expect(again.counts).toEqual({ new: 0, unchanged: 4, errors: 0 })
      expect(again.committable).toBe(false)
      await refuses(commitRosterImport(db, adminA, again.batchId), 'invalid')
      const taken = await dryRunRosterImport(db, adminA, {
        kind: 'students',
        academicYear: YEAR,
        fileName: 's.csv',
        bytes: csv([STUDENT_HEAD, 'Someone Else,7,A,1,']),
      })
      expect(taken.rows[0].message).toMatch(
        /already belongs to another student/,
      )
      expect(
        await db
          .selectFrom('students')
          .select('id')
          .where('school_id', '=', schoolA)
          .execute(),
      ).toHaveLength(4)
    })

    it('school students are separate: marker set, no consent row, reserved address, guardian phone kept', async () => {
      const rows = await db
        .selectFrom('students')
        .innerJoin('users', 'users.id', 'students.user_id')
        .select([
          'students.id',
          'students.household_id',
          'students.school_id',
          'users.email',
          'users.role',
          'users.signup_type',
          'students.class',
          'students.board',
        ])
        .where('students.school_id', '=', schoolA)
        .execute()
      expect(rows).toHaveLength(4)
      for (const r of rows) {
        expect(r.school_id).toBe(schoolA)
        expect(r.role).toBe('student')
        expect(r.signup_type).toBe('school')
        expect(r.email).toMatch(/@school-student\.prepplan\.invalid$/)
        expect(r.class).toBe(7)
        const consents = await db
          .selectFrom('consents')
          .select('id')
          .where('household_id', '=', r.household_id)
          .execute()
        expect(consents).toHaveLength(0)
      }
      const phones = await db
        .selectFrom('school_student_guardians')
        .select('phone_e164')
        .where('school_id', '=', schoolA)
        .orderBy('phone_e164')
        .execute()
      expect(phones.map((p) => p.phone_e164)).toEqual([
        '+919000000001',
        '+919876511111',
        '+919876543210',
      ])
    })

    it('every import and setup change is in audit_log with school_id, and not in any household audit', async () => {
      const actions = (
        await db
          .selectFrom('audit_log')
          .select('action')
          .where('school_id', '=', schoolA)
          .execute()
      ).map((r) => r.action)
      expect(actions).toEqual(
        expect.arrayContaining([
          'school.class_created',
          'school.section_created',
          'school.subject_added',
          'school.students_imported',
          'school.teachers_imported',
          'school.terms_accepted',
        ]),
      )
      const adminHousehold = (
        await db
          .selectFrom('users')
          .select('household_id')
          .where('id', '=', adminAUser)
          .executeTakeFirstOrThrow()
      ).household_id
      expect(
        await auditLogRepository.listRecent(db, adminHousehold, 100),
      ).toHaveLength(0)
    })
  })

  describe('9. nothing crosses schools', () => {
    it("another school's class, section or batch cannot be used", async () => {
      // School B has only class 8 / section Z; its admin uploads a class 7-A row: not set up for B.
      const class8 = await createClass(db, adminB, 8, YEAR)
      await createSection(db, adminB, class8.id, 'Z')
      const r = await dryRunRosterImport(db, adminB, {
        kind: 'students',
        academicYear: YEAR,
        fileName: 's.csv',
        bytes: csv([STUDENT_HEAD, 'Asha,7,A,1,']),
      })
      expect(r.counts.errors).toBe(1)
      expect(r.rows[0].message).toMatch(/not set up/)
      // B cannot see A's batch, class, section or teacher.
      const aBatch = await db
        .selectFrom('school_import_batches')
        .select('id')
        .where('school_id', '=', schoolA)
        .executeTakeFirstOrThrow()
      await refuses(commitRosterImport(db, adminB, aBatch.id), 'not_found')
      await refuses(createSection(db, adminB, classA, 'Q'), 'not_found')
      await refuses(
        assignTeacher(db, adminB, {
          memberId: teachers.Tina,
          sectionId: sectionA,
          schoolSubjectId: sub1,
        }),
        'not_found',
      )
      // And the database refuses a hand-written cross-school link.
      const student = await db
        .selectFrom('students')
        .select('id')
        .where('school_id', '=', schoolA)
        .limit(1)
        .executeTakeFirstOrThrow()
      const member = await db
        .selectFrom('school_members')
        .select('id')
        .where('school_id', '=', schoolA)
        .where('role', '=', 'student')
        .limit(1)
        .executeTakeFirstOrThrow()
      await expect(
        db
          .insertInto('school_students')
          .values({
            school_id: schoolA,
            student_id: student.id,
            member_id: member.id,
            section_id: (
              await db
                .selectFrom('school_sections')
                .select('id')
                .where('school_id', '=', schoolB)
                .executeTakeFirstOrThrow()
            ).id,
            roll_no: '99',
            admission_no: 'X99',
            status: 'active',
            created_by_user_id: adminAUser,
          })
          .execute(),
      ).rejects.toThrow()
    })
  })

  describe('2, 15. teacher scope and the sample check', () => {
    let tina: SchoolScope // class teacher of 7-A
    let tom: SchoolScope // teaches S1 in 7-A
    let tara: SchoolScope // teaches S2 in 7-A, will do her own sample check
    let assign1: string
    let assign2: string
    const key = (p: { sectionId: string; subjectId: string }) =>
      `${p.sectionId}|${p.subjectId}`
    const reload = async () => {
      tina = await scopeOf(await userIdOfMember(teachers.Tina), schoolA, [
        'teacher',
      ])
      tom = await scopeOf(await userIdOfMember(teachers.Tom), schoolA, [
        'teacher',
      ])
      tara = await scopeOf(await userIdOfMember(teachers.Tara), schoolA, [
        'teacher',
      ])
    }

    beforeAll(async () => {
      assign1 = (
        await assignTeacher(db, adminA, {
          memberId: teachers.Tom,
          sectionId: sectionA,
          schoolSubjectId: sub1,
        })
      ).id
      assign2 = (
        await assignTeacher(db, adminA, {
          memberId: teachers.Tara,
          sectionId: sectionA,
          schoolSubjectId: sub2,
        })
      ).id
      await setClassTeacher(db, adminA, sectionA, teachers.Tina)
      await reload()
    })

    it('a teacher gets exactly their assigned pairs and sees only those sections', async () => {
      expect(tom.pairs).toEqual([
        { sectionId: sectionA, subjectId: subjectIds[0] },
      ])
      expect(tara.pairs).toEqual([
        { sectionId: sectionA, subjectId: subjectIds[1] },
      ])
      const roster = await schoolStudentsRepository.listForScope(db, tom)
      expect(roster).toHaveLength(3) // 7-A only; Kiran is in 7-B
      expect(roster.every((s) => s.section_id === sectionA)).toBe(true)
      expect(
        await schoolStudentsRepository.listForScope(db, adminA),
      ).toHaveLength(4)
    })

    it('the class teacher has no marking access to subjects she does not teach', async () => {
      expect(tina.pairs).toEqual([]) // class teacher has no marking access to subjects she does not teach
    })

    it('by default the class teacher spot-checks every pair of her section, and nobody else does', async () => {
      expect(tina.samplePairs.map(key).sort()).toEqual(
        [
          key({ sectionId: sectionA, subjectId: subjectIds[0] }),
          key({ sectionId: sectionA, subjectId: subjectIds[1] }),
        ].sort(),
      )
      expect(tom.samplePairs).toEqual([])
      expect(tara.samplePairs).toEqual([])
      // sample-check access opens her section roster, nothing else of the pairs
      expect(
        (await schoolStudentsRepository.listForScope(db, tina)).every(
          (s) => s.section_id === sectionA,
        ),
      ).toBe(true)
    })

    it('the admin can switch one section-subject to the subject teacher; the change takes effect on the next request', async () => {
      await setSampleChecker(db, adminA, assign2, 'subject_teacher')
      await reload()
      expect(tina.samplePairs.map(key)).toEqual([
        key({ sectionId: sectionA, subjectId: subjectIds[0] }),
      ])
      expect(tara.samplePairs.map(key)).toEqual([
        key({ sectionId: sectionA, subjectId: subjectIds[1] }),
      ])
      expect(tom.samplePairs).toEqual([])
      const audit = await db
        .selectFrom('audit_log')
        .selectAll()
        .where('school_id', '=', schoolA)
        .where('action', '=', 'school.sample_checker_set')
        .execute()
      expect(audit).toHaveLength(1)
    })

    it('only the admin can switch it, assign teachers or name a class teacher', async () => {
      await refuses(
        setSampleChecker(db, tom, assign1, 'subject_teacher'),
        'forbidden',
      )
      await refuses(
        setSampleChecker(db, tina, assign1, 'subject_teacher'),
        'forbidden',
      )
      await refuses(
        setClassTeacher(db, tom, sectionA, teachers.Tom),
        'forbidden',
      )
      await refuses(
        assignTeacher(db, tom, {
          memberId: teachers.Tom,
          sectionId: sectionB,
          schoolSubjectId: sub1,
        }),
        'forbidden',
      )
      await refuses(
        setSampleChecker(db, adminB, assign1, 'subject_teacher'),
        'not_found',
      ) // another school's admin
    })

    it('only a teacher of the school can be assigned or made class teacher', async () => {
      const studentMember = await db
        .selectFrom('school_members')
        .select('id')
        .where('school_id', '=', schoolA)
        .where('role', '=', 'student')
        .limit(1)
        .executeTakeFirstOrThrow()
      await refuses(
        assignTeacher(db, adminA, {
          memberId: studentMember.id,
          sectionId: sectionB,
          schoolSubjectId: sub1,
        }),
        'not_found',
      )
      await refuses(
        setClassTeacher(db, adminA, sectionA, studentMember.id),
        'not_found',
      )
    })
  })

  describe('4. a student sees only herself', () => {
    it('student scope lists no roster and finds only her own row', async () => {
      const rows = await db
        .selectFrom('school_students')
        .innerJoin('students', 'students.id', 'school_students.student_id')
        .select(['school_students.id', 'students.user_id', 'students.name'])
        .where('school_students.school_id', '=', schoolA)
        .orderBy('students.name')
        .execute()
      const [asha, kiran] = [
        rows.find((r) => r.name === 'Asha')!,
        rows.find((r) => r.name === 'Kiran')!,
      ]
      const ashaScope = await scopeOf(asha.user_id!, schoolA, ['student'])
      const kiranScope = await scopeOf(kiran.user_id!, schoolA, ['student'])
      expect(ashaScope.pairs).toEqual([])
      expect(
        await schoolStudentsRepository.listForScope(db, ashaScope),
      ).toEqual([])
      expect((await schoolStudentsRepository.findOwn(db, ashaScope))?.id).toBe(
        asha.id,
      )
      expect((await schoolStudentsRepository.findOwn(db, kiranScope))?.id).toBe(
        kiran.id,
      )
      expect(await schoolStudentsRepository.findOwn(db, adminA)).toBeUndefined()
    })
  })

  describe('admission numbers', () => {
    it('admission numbers: kept as the permanent ID, generated when missing, unique per school, never reassigned', async () => {
      const head = 'Name,Class,Section,Roll No,Admission No'
      const pre = await dryRunRosterImport(db, adminA, {
        kind: 'students',
        academicYear: YEAR,
        fileName: 'a.csv',
        bytes: csv([
          head,
          'Dev,7,A,31,2024/0031',
          'Dia,7,A,32,',
          'Dup,7,B,33,2024/0031',
          'Clash,7,B,34,' + 'x'.repeat(31),
        ]),
      })
      expect(pre.counts).toEqual({ new: 2, unchanged: 0, errors: 2 })
      expect(pre.rows.find((r) => r.row === 3)?.message).toMatch(
        /appears twice/,
      )
      const ok = await dryRunRosterImport(db, adminA, {
        kind: 'students',
        academicYear: YEAR,
        fileName: 'a.csv',
        bytes: csv([head, 'Dev,7,A,31,2024/0031', 'Dia,7,A,32,']),
      })
      await commitRosterImport(db, adminA, ok.batchId)
      const rows = await db
        .selectFrom('school_students')
        .select(['roll_no', 'admission_no'])
        .where('school_id', '=', schoolA)
        .where('roll_no', 'in', ['31', '32'])
        .orderBy('roll_no')
        .execute()
      expect(rows[0].admission_no).toBe('2024/0031')
      expect(rows[1].admission_no).toMatch(/^P[2-9A-HJKMNP-Z]{7}$/)
      // the same admission number for a different child is refused, and a repeat of the same child is "unchanged"
      const again = await dryRunRosterImport(db, adminA, {
        kind: 'students',
        academicYear: YEAR,
        fileName: 'a.csv',
        bytes: csv([head, 'Dev,7,A,31,2024/0031']),
      })
      expect(again.rows.map((r) => r.status)).toEqual(['unchanged'])
      const other = await dryRunRosterImport(db, adminA, {
        kind: 'students',
        academicYear: YEAR,
        fileName: 'a.csv',
        bytes: csv([head, 'Someone Else,7,B,40,2024/0031']),
      })
      expect(other.rows[0].status).toBe('error')
      expect(other.rows[0].message).toMatch(
        /already belongs to another student/,
      )
      // the same admission number in ANOTHER school is a different student: allowed
      expect(
        (
          await dryRunRosterImport(db, adminB, {
            kind: 'students',
            academicYear: YEAR,
            fileName: 'a.csv',
            bytes: csv([head, 'Dev,8,Z,1,2024/0031']),
          })
        ).counts.errors,
      ).toBe(0)
    })
  })

  describe('17. no public sign-up for school users', () => {
    const signUp = async (n: string, signupType: string) => {
      const email = `pub-${n}-${tag}@example.com`
      publicEmails.push(email)
      const res = await auth.api.signUpEmail({
        body: {
          email,
          password: TEST_PASSWORD,
          name: `Pub ${n}`,
          signup_type: signupType,
        },
      })
      return res.user.id
    }
    it('a sign-up that asks for a school role gets an ordinary account and no school membership', async () => {
      for (const t of ['school_admin', 'principal', 'school']) {
        const id = await signUp(t, t)
        const user = await db
          .selectFrom('users')
          .select(['role', 'signup_type'])
          .where('id', '=', id)
          .executeTakeFirstOrThrow()
        expect(user.role).toBe('parent')
        expect(user.signup_type).not.toBe('school')
        expect(
          await db
            .selectFrom('school_members')
            .select('id')
            .where('user_id', '=', id)
            .execute(),
        ).toHaveLength(0)
      }
    })
    it('a public student sign-up is a PrepPlan student, never a school student', async () => {
      const id = await signUp('stu', 'student')
      const s = await db
        .selectFrom('students')
        .select(['school_id'])
        .where('user_id', '=', id)
        .executeTakeFirstOrThrow()
      expect(s.school_id).toBeNull()
      expect(
        await db
          .selectFrom('school_members')
          .select('id')
          .where('user_id', '=', id)
          .execute(),
      ).toHaveLength(0)
    })
    it("a school student's address cannot be registered or taken over by a public sign-up", async () => {
      const row = await db
        .selectFrom('users')
        .select('email')
        .where('signup_type', '=', 'school')
        .where('role', '=', 'student')
        .where('email', 'like', '%school-student%')
        .limit(1)
        .executeTakeFirstOrThrow()
      await expect(
        auth.api.signUpEmail({
          body: {
            email: row.email,
            password: TEST_PASSWORD,
            name: 'Intruder',
          },
        }),
      ).rejects.toThrow()
    })
    it('school-created people have no credentials, so none can sign in yet', async () => {
      const n = await db
        .selectFrom('accounts')
        .innerJoin(
          'school_members',
          'school_members.user_id',
          'accounts.user_id',
        )
        .select('accounts.id')
        .where('school_members.school_id', 'in', schoolIds)
        .execute()
      expect(n).toHaveLength(0)
    })
  })

  /** Owner request 2026-10-30: Excel uploads with every class a teacher teaches, and a sample to fill. */
  describe('teachers file: Teaches and Class teacher of; the sample Excel', () => {
    it('a new teacher with several classes, a teacher already here given one more (it moves, and the preview says so), and plain errors', async () => {
      const uma = `uma-${tag}@school.test`
      const tom = `tom-${tag}@school.test`
      const bad = await dryRunRosterImport(db, adminA, {
        kind: 'teachers',
        fileName: 't.csv',
        bytes: csv([
          'Name,Email,Teaches,Class teacher of',
          `Uma Four,${uma},"7B Roster S1; 7-b roster s2",7B`,
          `Tom Two,${tom},7A Roster S2,`,
          `Vik,vik-${tag}@school.test,7Z Roster S1,`,
          `Wes,wes-${tag}@school.test,7A Physics,`,
          `Xan,xan-${tag}@school.test,Maths 7A,`,
        ]),
      })
      expect(bad.counts).toEqual({ new: 2, unchanged: 0, errors: 3 })
      const msg = (row: number) => bad.rows.find((r) => r.row === row)?.message
      expect(msg(3)).toMatch(/Section 7Z is not set up/)
      expect(msg(4)).toMatch(
        /"Physics" is not a subject of class 7 \(it has: Roster S1, Roster S2\)/,
      )
      expect(msg(5)).toMatch(
        /write the class, section and subject, like 7A Maths/,
      )
      expect(msg(1)).toBe(
        'Teaches 7B Roster S1, 7B Roster S2, class teacher of 7B.',
      )
      expect(msg(2)).toBe(
        'Already a teacher here; adds 7A Roster S2. 7A Roster S2 moves from Tara Three to Tom Two.',
      )

      const ok = await dryRunRosterImport(db, adminA, {
        kind: 'teachers',
        fileName: 't.xlsx.csv',
        bytes: csv([
          'Name,Email,Teaches,Class teacher of',
          `Uma Four,${uma},"7B Roster S1; 7-b roster s2",7B`,
          `Tom Two,${tom},7A Roster S2,`,
        ]),
      })
      expect(ok.committable).toBe(true)
      expect(await commitRosterImport(db, adminA, ok.batchId)).toEqual({
        added: 2,
      })
      const pairs = await db
        .selectFrom('school_teacher_assignments as a')
        .innerJoin('school_members as m', 'm.id', 'a.member_id')
        .innerJoin('users as u', 'u.id', 'm.user_id')
        .innerJoin('school_sections as s', 's.id', 'a.section_id')
        .innerJoin('school_subjects as ss', 'ss.id', 'a.school_subject_id')
        .select(['u.email', 's.name as section', 'ss.id as sub'])
        .where('a.school_id', '=', schoolA)
        .execute()
      const who = (section: string, sub: string) =>
        pairs.find((p) => p.section === section && p.sub === sub)?.email
      expect(who('B', sub1)).toBe(uma)
      expect(who('B', sub2)).toBe(uma)
      expect(who('A', sub2)).toBe(tom) // moved from Tara
      const secB = await db
        .selectFrom('school_sections')
        .select('class_teacher_member_id')
        .where('id', '=', sectionB)
        .executeTakeFirstOrThrow()
      const umaMember = await db
        .selectFrom('school_members as m')
        .innerJoin('users as u', 'u.id', 'm.user_id')
        .select('m.id')
        .where('u.email', '=', uma)
        .executeTakeFirstOrThrow()
      expect(secB.class_teacher_member_id).toBe(umaMember.id)
      // the same file again changes nothing
      const again = await dryRunRosterImport(db, adminA, {
        kind: 'teachers',
        fileName: 't.csv',
        bytes: csv([
          'Name,Email,Teaches,Class teacher of',
          `Uma Four,${uma},"7B Roster S1; 7B Roster S2",7B`,
          `Tom Two,${tom},7A Roster S2,`,
        ]),
      })
      expect(again.counts).toEqual({ new: 0, unchanged: 2, errors: 0 })
      expect(again.committable).toBe(false)
    })

    it("the sample Excel: an empty first sheet to fill, an example made from the school's own classes, office only", async () => {
      const { bytes, fileName } = await buildRosterTemplate(
        db,
        adminA,
        'teachers',
      )
      expect(fileName).toBe('prepplan-teachers-sample.xlsx')
      // the untouched sample uploads nobody: the example is on another sheet, so the check says it is empty
      await expect(parseRosterFile(fileName, bytes)).rejects.toThrow(
        /no data rows/,
      )
      const wb = new ExcelJS.Workbook()
      await wb.xlsx.load(bytes as unknown as ArrayBuffer)
      expect(wb.worksheets.map((w) => w.name)).toEqual([
        'Teachers',
        'Example',
        'How to fill',
      ])
      expect(String(wb.getWorksheet('Example')!.getCell('C2').value)).toMatch(
        /^7A Roster S1; 7B Roster S1$/,
      )
      const st = await buildRosterTemplate(db, adminA, 'students')
      const sw = new ExcelJS.Workbook()
      await sw.xlsx.load(st.bytes as unknown as ArrayBuffer)
      expect(
        (sw.worksheets[0].getRow(1).values as Array<unknown>).filter(Boolean),
      ).toEqual([
        'Name',
        'Class',
        'Section',
        'Roll No',
        'Admission No',
        'Parent Name',
        'Parent Phone',
      ])
      // the example rows, uploaded as they are, would pass the check
      const example = await dryRunRosterImport(db, adminA, {
        kind: 'teachers',
        fileName: 'example.csv',
        bytes: csv([
          'Name,Email,Teaches,Class teacher of',
          `Meena ${tag},meena-${tag}@school.test,${String(wb.getWorksheet('Example')!.getCell('C2').value)},7A`,
        ]),
      })
      expect(example.counts.errors).toBe(0)
      await refuses(
        buildRosterTemplate(db, { ...adminA, role: 'teacher' }, 'teachers'),
        'forbidden',
      )
    })
  })
})
