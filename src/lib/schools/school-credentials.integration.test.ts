import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { createDb } from '../../db/connection'
import type { Db } from '../../db/connection'
import { schoolsRepository } from '../../db/repositories'
import type { SchoolScope } from '../../db/school-scope'
import { deleteSchoolTermsForTest } from '../../db/test-helpers'
import { getCurrentUser } from '../session'
import { loadSchoolScope } from '../school-session'
import {
  activateStaffWithCode,
  activateStaffWithToken,
  activateStudent,
  hashCode,
  issueFirstAdminCode,
  issueStaffCredentials,
  issueStudentSlips,
  newSlipCode,
  normaliseAdmissionNo,
  resetStudentPassword,
  signInStudent,
} from './credentials'
import { SchoolError } from './common'
import { createSchoolStudent, createSchoolTeacher } from './people'
import { createClass, createSection, setClassTeacher } from './setup'
import { buildSlipsHtml } from './slips'
import { acceptSchoolTerms } from './terms'

// Capture the e-mailed link instead of sending anything.
const sent: Array<{
  userId: string
  template: string
  html: string
  text: string
}> = []
vi.mock('../email', async (orig) => ({
  ...(await orig<Record<string, unknown>>()),
  sendTransactionalEmail: vi.fn(
    async (
      _db: unknown,
      input: {
        userId: string
        template: string
        content: { html: string; text: string }
      },
    ) => {
      sent.push({
        userId: input.userId,
        template: input.template,
        html: input.content.html,
        text: input.content.text,
      })
      return 'sent' as const
    },
  ),
}))

const ADM_A1 = '2024/001'
const ADM_A2 = 'ADM-002'
const DAY = 24 * 60 * 60 * 1000
const cookieOf = (setCookies: Array<string>) =>
  setCookies.map((c) => c.split(';')[0]).join('; ')
const reqWith = (cookie: string) =>
  new Request('http://localhost/x', { headers: { cookie } })

async function refuses(p: Promise<unknown>, code: SchoolError['code']) {
  const e = await p.then(
    () => null,
    (err) => err,
  )
  expect(e, `expected SchoolError ${code}`).toBeInstanceOf(SchoolError)
  expect((e as SchoolError).code).toBe(code)
}

/** S2c: passwords for school people. Plan: staff link or slip, student code slips, class-teacher reset. */
describe('school credentials (S2c)', () => {
  let db: Db
  const tag = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  const schoolIds: Array<string> = []
  const code = `cred-${tag}`
  let schoolId: string
  let adminScope: SchoolScope
  let adminMember: string
  let adminEmail: string
  let t1Scope: SchoolScope // class teacher of 7-A
  let t2Scope: SchoolScope // class teacher of 7-B
  let t1Member: string
  let t1Email: string
  let sectionA: string
  let sectionB: string
  const students: Record<
    string,
    {
      schoolStudentId: string
      userId: string
      email: string
      admissionNo: string
    }
  > = {}
  let otherAdmin: SchoolScope
  const households: Array<string> = []

  async function scopeFor(
    userId: string,
    sid: string,
    role: Parameters<typeof loadSchoolScope>[3],
  ) {
    const r = await loadSchoolScope(db, userId, sid, role)
    if (!r.ok) throw new Error('no scope ' + r.reason)
    return r.scope
  }
  const mkStudent = async (
    name: string,
    section: string,
    sectionName: string,
    roll: string,
    admissionNo: string | null,
  ) => {
    const s = await createSchoolStudent(db, adminScope, {
      name,
      grade: 7,
      sectionId: section,
      sectionName,
      rollNo: roll,
      admissionNo,
      guardianPhone: null,
      guardianName: null,
    })
    students[`${sectionName}${roll}`] = {
      schoolStudentId: s.schoolStudent.id,
      userId: s.user.id,
      email: s.user.email,
      admissionNo: s.schoolStudent.admission_no,
    }
    households.push(s.user.household_id)
  }

  beforeAll(async () => {
    db = createDb()
    adminEmail = `cred-admin-${tag}@school.test`
    const p = await schoolsRepository.provision(db, {
      name: `Cred School ${tag}`,
      code,
      board: 'CBSE',
      adminName: 'Cred Admin',
      adminEmail,
    })
    schoolId = p.school.id
    schoolIds.push(schoolId)
    adminMember = p.adminMemberId
    adminScope = await scopeFor(p.adminUserId, schoolId, ['school_admin'])
    await acceptSchoolTerms(db, adminScope)
    const cls = await createClass(db, adminScope, 7, '2026-27')
    sectionA = (await createSection(db, adminScope, cls.id, 'A')).id
    sectionB = (await createSection(db, adminScope, cls.id, 'B')).id
    t1Email = `cred-t1-${tag}@school.test`
    const t1 = await createSchoolTeacher(db, adminScope, {
      name: 'Teacher One',
      email: t1Email,
    })
    const t2 = await createSchoolTeacher(db, adminScope, {
      name: 'Teacher Two',
      email: `cred-t2-${tag}@school.test`,
    })
    t1Member = t1.member.id
    await setClassTeacher(db, adminScope, sectionA, t1.member.id)
    await setClassTeacher(db, adminScope, sectionB, t2.member.id)
    t1Scope = await scopeFor(t1.user.id, schoolId, ['teacher'])
    t2Scope = await scopeFor(t2.user.id, schoolId, ['teacher'])
    households.push(t1.user.household_id, t2.user.household_id)
    await mkStudent('Asha A', sectionA, 'A', '1', ADM_A1)
    await mkStudent('Ravi A', sectionA, 'A', '2', ADM_A2)
    await mkStudent('Kiran B', sectionB, 'B', '1', null) // no admission number on the roster: one is generated
    // a second school, to prove nothing crosses
    const q = await schoolsRepository.provision(db, {
      name: `Other Cred ${tag}`,
      code: `other-${tag}`,
      board: 'CBSE',
      adminName: 'Other',
      adminEmail: `other-${tag}@school.test`,
    })
    schoolIds.push(q.school.id)
    otherAdmin = await scopeFor(q.adminUserId, q.school.id, ['school_admin'])
  })

  afterAll(async () => {
    const ids = schoolIds
    const members = await db
      .selectFrom('school_members')
      .select('user_id')
      .where('school_id', 'in', ids)
      .execute()
    const userIds = members.map((m) => m.user_id)
    await db.deleteFrom('sessions').where('user_id', 'in', userIds).execute()
    await db.deleteFrom('accounts').where('user_id', 'in', userIds).execute()
    await db
      .deleteFrom('notifications')
      .where('user_id', 'in', userIds)
      .execute()
    await db
      .deleteFrom('school_credential_codes')
      .where('school_id', 'in', ids)
      .execute()
    await db.deleteFrom('audit_log').where('school_id', 'in', ids).execute()
    await db
      .deleteFrom('school_students')
      .where('school_id', 'in', ids)
      .execute()
    await db.deleteFrom('students').where('school_id', 'in', ids).execute()
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
    const schoolHouseholds = await db
      .selectFrom('schools')
      .select('household_id')
      .where('id', 'in', ids)
      .execute()
    await db.deleteFrom('schools').where('id', 'in', ids).execute()
    const hh = await db
      .selectFrom('users')
      .select('household_id')
      .where('id', 'in', userIds)
      .execute()
    await db.deleteFrom('users').where('id', 'in', userIds).execute()
    await db
      .deleteFrom('households')
      .where('id', 'in', [
        ...hh.map((h) => h.household_id),
        ...schoolHouseholds.map((h) => h.household_id),
        ...households,
      ])
      .execute()
    await db.destroy()
  })

  describe('codes and login ids', () => {
    it('slip codes are 10 characters from an unambiguous alphabet and never repeat', () => {
      const seen = new Set<string>()
      for (let i = 0; i < 200; i++) {
        const c = newSlipCode()
        expect(c).toMatch(/^[2-9A-HJ-NP-Z]{5}-[2-9A-HJ-NP-Z]{5}$/)
        seen.add(c)
      }
      expect(seen.size).toBe(200)
    })
    it('the sign-in ID is the admission number: spaces and case ignored, odd characters refused', () => {
      expect(normaliseAdmissionNo(' 2024/001 ')).toBe('2024/001')
      expect(normaliseAdmissionNo('adm 002')).toBe('ADM002')
      expect(normaliseAdmissionNo('')).toBeNull()
      expect(normaliseAdmissionNo("x'; drop")).toBeNull()
    })
    it('a student with no admission number gets a generated, school-unique one', () => {
      expect(students.B1.admissionNo).toMatch(/^P[2-9A-HJ-NP-Z]{7}$/)
      expect(students.B1.admissionNo).not.toBe(students.A1.admissionNo)
    })
    it('only a keyed hash is stored, never the code', async () => {
      const slips = await issueStudentSlips(db, t1Scope, sectionA)
      const rows = await db
        .selectFrom('school_credential_codes')
        .select('code_hash')
        .where('school_id', '=', schoolId)
        .execute()
      for (const s of slips) {
        expect(rows.map((r) => r.code_hash)).not.toContain(s.code)
        expect(rows.map((r) => r.code_hash)).toContain(
          hashCode(s.code.replace('-', '')),
        )
      }
      expect(JSON.stringify(rows)).not.toContain(slips[0].code)
    })
  })

  describe('staff', () => {
    it('only the admin can issue staff credentials, and only for staff of this school', async () => {
      await refuses(
        issueStaffCredentials(db, t1Scope, {
          memberId: t1Member,
          delivery: 'slip',
        }),
        'forbidden',
      )
      await refuses(
        issueStaffCredentials(db, otherAdmin, {
          memberId: t1Member,
          delivery: 'slip',
        }),
        'not_found',
      )
      await refuses(
        issueStaffCredentials(db, adminScope, {
          memberId: students.A1.userId,
          delivery: 'slip',
        }),
        'not_found',
      )
      const studentMember = await db
        .selectFrom('school_members')
        .select('id')
        .where('school_id', '=', schoolId)
        .where('role', '=', 'student')
        .limit(1)
        .executeTakeFirstOrThrow()
      await refuses(
        issueStaffCredentials(db, adminScope, {
          memberId: studentMember.id,
          delivery: 'slip',
        }),
        'not_found',
      ) // students and parents are not staff
    })

    it('a printed code: works once, sets the password, signs in, and cannot be reused', async () => {
      const slip = await issueStaffCredentials(db, adminScope, {
        memberId: t1Member,
        delivery: 'slip',
      })
      if (slip.delivery !== 'slip') throw new Error('expected a slip')
      expect(slip.code).toMatch(/^[2-9A-HJ-NP-Z]{5}-[2-9A-HJ-NP-Z]{5}$/)
      expect(slip.email).toBe(t1Email)
      const r = await activateStaffWithCode(db, {
        email: t1Email,
        code: slip.code,
        newPassword: 'a-good-password',
      })
      expect(r.ok).toBe(true)
      if (!r.ok) return
      const me = await getCurrentUser(reqWith(cookieOf(r.setCookies)))
      expect(me?.isSchool).toBe(true)
      const scope = await requireScope(cookieOf(r.setCookies))
      expect(scope.role).toBe('teacher')
      expect(
        await activateStaffWithCode(db, {
          email: t1Email,
          code: slip.code,
          newPassword: 'another-password',
        }),
      ).toEqual({ ok: false, reason: 'bad_credentials' })
    })

    async function requireScope(cookie: string) {
      const { requireSchoolRole } = await import('../school-session')
      const res = await requireSchoolRole(reqWith(cookie), schoolId, 'teacher')
      if (res instanceof Response) throw new Error('refused ' + res.status)
      return res
    }

    it('the e-mailed link: sent to the staff member, works once, tampering and old tokens fail', async () => {
      sent.length = 0
      const r1 = await issueStaffCredentials(db, adminScope, {
        memberId: adminMember,
        delivery: 'email',
      })
      expect(r1).toMatchObject({ delivery: 'email', emailStatus: 'sent' })
      expect(sent).toHaveLength(1)
      expect(sent[0].template).toBe('school_credentials')
      const token1 = decodeURIComponent(
        /token=([^"&\s]+)/.exec(sent[0].text)![1],
      )
      // a newer link replaces the older one
      await issueStaffCredentials(db, adminScope, {
        memberId: adminMember,
        delivery: 'email',
      })
      const token2 = decodeURIComponent(
        /token=([^"&\s]+)/.exec(sent[1].text)![1],
      )
      expect(
        await activateStaffWithToken(db, {
          token: token1,
          newPassword: 'a-good-password',
        }),
      ).toEqual({ ok: false, reason: 'bad_credentials' })
      const [id, secret] = token2.split('.')
      expect(
        await activateStaffWithToken(db, {
          token: `${id}.${secret.slice(0, -1)}x`,
          newPassword: 'a-good-password',
        }),
      ).toEqual({ ok: false, reason: 'bad_credentials' })
      expect(
        await activateStaffWithToken(db, {
          token: 'garbage',
          newPassword: 'a-good-password',
        }),
      ).toEqual({ ok: false, reason: 'bad_credentials' })
      expect(
        await activateStaffWithToken(db, {
          token: token2,
          newPassword: 'short',
        }),
      ).toEqual({ ok: false, reason: 'weak_password' })
      const ok = await activateStaffWithToken(db, {
        token: token2,
        newPassword: 'a-good-password',
      })
      expect(ok.ok).toBe(true)
      expect(
        await activateStaffWithToken(db, {
          token: token2,
          newPassword: 'a-good-password',
        }),
      ).toEqual({ ok: false, reason: 'bad_credentials' })
    })

    it('the first admin code from provisioning works once and is logged without the code', async () => {
      const { code: c } = await issueFirstAdminCode(db, schoolId, adminMember)
      expect(
        (
          await activateStaffWithCode(db, {
            email: adminEmail,
            code: c,
            newPassword: 'a-good-password',
          })
        ).ok,
      ).toBe(true)
      const log = await db
        .selectFrom('audit_log')
        .select(['action', 'after', 'actor_user_id'])
        .where('school_id', '=', schoolId)
        .where('action', '=', 'school.credentials_issued')
        .execute()
      expect(log.length).toBeGreaterThan(0)
      expect(JSON.stringify(log)).not.toContain(c)
    })
  })

  describe('expiry and lock-out', () => {
    it('a code expires after 7 days', async () => {
      const issuedAt = new Date()
      const slip = await issueStaffCredentials(
        db,
        adminScope,
        { memberId: t1Member, delivery: 'slip' },
        issuedAt,
      )
      if (slip.delivery !== 'slip') throw new Error('slip')
      expect(slip.expiresAt.getTime()).toBe(issuedAt.getTime() + 7 * DAY)
      const day8 = new Date(issuedAt.getTime() + 7 * DAY + 1000)
      expect(
        await activateStaffWithCode(
          db,
          { email: t1Email, code: slip.code, newPassword: 'a-good-password' },
          day8,
        ),
      ).toEqual({ ok: false, reason: 'bad_credentials' })
      const day6 = new Date(issuedAt.getTime() + 6 * DAY)
      expect(
        (
          await activateStaffWithCode(
            db,
            { email: t1Email, code: slip.code, newPassword: 'a-good-password' },
            day6,
          )
        ).ok,
      ).toBe(true)
    })

    it('five wrong codes lock the account for 15 minutes, even against the right code', async () => {
      const slip = await issueStaffCredentials(db, adminScope, {
        memberId: t1Member,
        delivery: 'slip',
      })
      if (slip.delivery !== 'slip') throw new Error('slip')
      const t0 = new Date()
      for (let i = 0; i < 5; i++) {
        expect(
          await activateStaffWithCode(
            db,
            {
              email: t1Email,
              code: 'AAAAA-AAAAA',
              newPassword: 'a-good-password',
            },
            t0,
          ),
        ).toEqual({ ok: false, reason: 'bad_credentials' })
      }
      expect(
        await activateStaffWithCode(
          db,
          { email: t1Email, code: slip.code, newPassword: 'a-good-password' },
          new Date(t0.getTime() + 60_000),
        ),
      ).toEqual({ ok: false, reason: 'locked' })
      const later = new Date(t0.getTime() + 16 * 60_000)
      expect(
        (
          await activateStaffWithCode(
            db,
            { email: t1Email, code: slip.code, newPassword: 'a-good-password' },
            later,
          )
        ).ok,
      ).toBe(true)
    })
  })

  describe('students', () => {
    let slipsA: Awaited<ReturnType<typeof issueStudentSlips>>
    const slipFor = (name: string) => slipsA.find((s) => s.name === name)!

    it('only the section class teacher (or the admin) can print slips for a section', async () => {
      await refuses(issueStudentSlips(db, t2Scope, sectionA), 'forbidden') // class teacher of B, not A
      await refuses(issueStudentSlips(db, otherAdmin, sectionA), 'not_found') // admin of another school: not their section
      const studentScope = await scopeFor(students.A1.userId, schoolId, [
        'student',
      ])
      await refuses(issueStudentSlips(db, studentScope, sectionA), 'forbidden')
      slipsA = await issueStudentSlips(db, t1Scope, sectionA)
      expect(slipsA.map((s) => s.loginId).sort()).toEqual([ADM_A1, ADM_A2])
      expect(
        (await issueStudentSlips(db, adminScope, sectionB)).map(
          (s) => s.loginId,
        ),
      ).toEqual([students.B1.admissionNo])
      slipsA = await issueStudentSlips(db, t1Scope, sectionA) // reprint replaces the earlier codes
    })

    it('her first sign-in: school code + id + slip code + her own password; the code works once', async () => {
      const s = slipFor('Asha A')
      const bad = await activateStudent(db, {
        schoolCode: code,
        loginId: s.loginId,
        code: 'AAAAA-AAAAA',
        newPassword: 'my-own-password',
      })
      expect(bad).toEqual({ ok: false, reason: 'bad_credentials' })
      expect(
        await activateStudent(db, {
          schoolCode: code,
          loginId: s.loginId,
          code: s.code,
          newPassword: 'short',
        }),
      ).toEqual({ ok: false, reason: 'weak_password' })
      const r = await activateStudent(db, {
        schoolCode: code.toUpperCase(),
        loginId: s.loginId.toLowerCase(),
        code: s.code.toLowerCase(),
        newPassword: 'my-own-password',
      })
      expect(r.ok).toBe(true)
      if (!r.ok) return
      const cookie = cookieOf(r.setCookies)
      const { requireSchoolRole } = await import('../school-session')
      const scope = await requireSchoolRole(
        reqWith(cookie),
        schoolId,
        'student',
      )
      expect(scope instanceof Response).toBe(false)
      expect((scope as SchoolScope).userId).toBe(students.A1.userId)
      expect(
        await activateStudent(db, {
          schoolCode: code,
          loginId: s.loginId,
          code: s.code,
          newPassword: 'another-password',
        }),
      ).toEqual({ ok: false, reason: 'bad_credentials' })
      // a student who has set a password is skipped when slips are printed again
      expect(
        (await issueStudentSlips(db, t1Scope, sectionA)).map((x) => x.name),
      ).toEqual(['Ravi A'])
    })

    it('every later sign-in uses school code + id + password; a wrong school code looks like a wrong password', async () => {
      const ok = await signInStudent(db, {
        schoolCode: code,
        loginId: ADM_A1,
        password: 'my-own-password',
      })
      expect(ok.ok).toBe(true)
      const wrongPw = await signInStudent(db, {
        schoolCode: code,
        loginId: ADM_A1,
        password: 'nope-nope-nope',
      })
      const wrongSchool = await signInStudent(db, {
        schoolCode: 'no-such-school',
        loginId: ADM_A1,
        password: 'my-own-password',
      })
      const wrongId = await signInStudent(db, {
        schoolCode: code,
        loginId: 'NOPE-99',
        password: 'my-own-password',
      })
      expect(wrongPw).toEqual({ ok: false, reason: 'bad_credentials' })
      expect(wrongSchool).toEqual(wrongPw)
      expect(wrongId).toEqual(wrongPw)
    })

    it('promotion never changes the ID: after she moves to another class, section and roll number the same ID still signs her in', async () => {
      const ravi = (await issueStudentSlips(db, t1Scope, sectionA))[0]
      expect(ravi.loginId).toBe(ADM_A2)
      expect(
        (
          await activateStudent(db, {
            schoolCode: code,
            loginId: ADM_A2,
            code: ravi.code,
            newPassword: 'ravis-password',
          })
        ).ok,
      ).toBe(true)
      // promote: new section, new roll number (what next year's roster would do)
      await db
        .updateTable('school_students')
        .set({ section_id: sectionB, roll_no: '9' })
        .where('id', '=', students.A2.schoolStudentId)
        .execute()
      expect(
        (
          await signInStudent(db, {
            schoolCode: code,
            loginId: ADM_A2,
            password: 'ravis-password',
          })
        ).ok,
      ).toBe(true)
      // her old class-section-roll id is not an ID at all
      expect(
        await signInStudent(db, {
          schoolCode: code,
          loginId: '7A-2',
          password: 'ravis-password',
        }),
      ).toEqual({ ok: false, reason: 'bad_credentials' })
      await db
        .updateTable('school_students')
        .set({ section_id: sectionA, roll_no: '2' })
        .where('id', '=', students.A2.schoolStudentId)
        .execute()
    })

    it('five wrong passwords lock a student for 15 minutes', async () => {
      const t0 = new Date()
      for (let i = 0; i < 5; i++)
        await signInStudent(
          db,
          { schoolCode: code, loginId: ADM_A2, password: 'wrong-wrong' },
          t0,
        )
      expect(
        await signInStudent(
          db,
          { schoolCode: code, loginId: ADM_A2, password: 'ravis-password' },
          new Date(t0.getTime() + 60_000),
        ),
      ).toEqual({ ok: false, reason: 'locked' })
      expect(
        (
          await signInStudent(
            db,
            { schoolCode: code, loginId: ADM_A2, password: 'ravis-password' },
            new Date(t0.getTime() + 16 * 60_000),
          )
        ).ok,
      ).toBe(true)
    })

    it('the class teacher resets a password: the old one stops at once, sessions end, the new code works, it is logged without the code', async () => {
      const before = await signInStudent(db, {
        schoolCode: code,
        loginId: ADM_A1,
        password: 'my-own-password',
      })
      if (!before.ok) throw new Error('setup')
      const oldCookie = cookieOf(before.setCookies)
      expect((await getCurrentUser(reqWith(oldCookie)))?.id).toBe(
        students.A1.userId,
      )

      await refuses(
        resetStudentPassword(db, t2Scope, students.A1.schoolStudentId),
        'forbidden',
      ) // another section's class teacher
      await refuses(
        resetStudentPassword(db, otherAdmin, students.A1.schoolStudentId),
        'not_found',
      )
      const slip = await resetStudentPassword(
        db,
        t1Scope,
        students.A1.schoolStudentId,
      )

      expect(
        await signInStudent(db, {
          schoolCode: code,
          loginId: ADM_A1,
          password: 'my-own-password',
        }),
      ).toEqual({ ok: false, reason: 'bad_credentials' })
      expect(await getCurrentUser(reqWith(oldCookie))).toBeNull()
      const fresh = await activateStudent(db, {
        schoolCode: code,
        loginId: ADM_A1,
        code: slip.code,
        newPassword: 'brand-new-password',
      })
      expect(fresh.ok).toBe(true)
      expect(
        (
          await signInStudent(db, {
            schoolCode: code,
            loginId: ADM_A1,
            password: 'brand-new-password',
          })
        ).ok,
      ).toBe(true)

      const log = await db
        .selectFrom('audit_log')
        .selectAll()
        .where('school_id', '=', schoolId)
        .where('action', '=', 'school.student_password_reset')
        .execute()
      expect(log).toHaveLength(1)
      expect(log[0].actor_user_id).toBe(t1Scope.userId)
      expect(log[0].entity_id).toBe(students.A1.schoolStudentId)
      expect(JSON.stringify(log)).not.toContain(slip.code)
      expect(JSON.stringify(log)).not.toContain('brand-new-password')
    })

    it('the admin can reset too; a student cannot reset anyone', async () => {
      const slip = await resetStudentPassword(
        db,
        adminScope,
        students.B1.schoolStudentId,
      )
      expect(slip.loginId).toBe(students.B1.admissionNo)
      const studentScope = await scopeFor(students.A2.userId, schoolId, [
        'student',
      ])
      await refuses(
        resetStudentPassword(db, studentScope, students.A1.schoolStudentId),
        'forbidden',
      )
    })
  })

  describe('parents and the printed slip', () => {
    it('parents have no login in Phase 1: there is no credential path for a parent membership', async () => {
      const u = await db
        .selectFrom('users')
        .select('household_id')
        .where('id', '=', students.A1.userId)
        .executeTakeFirstOrThrow()
      void u
      const parentMember = await db
        .insertInto('school_members')
        .values({
          school_id: schoolId,
          user_id: adminScope.userId,
          role: 'parent',
          status: 'active',
        })
        .returning('id')
        .executeTakeFirstOrThrow()
      await refuses(
        issueStaffCredentials(db, adminScope, {
          memberId: parentMember.id,
          delivery: 'slip',
        }),
        'not_found',
      )
      await db
        .deleteFrom('school_members')
        .where('id', '=', parentMember.id)
        .execute()
    })
    it('the slip page prints the id and code, escapes names, and promises no password', () => {
      const html = buildSlipsHtml({
        schoolName: 'A <b>School</b>',
        schoolCode: 'abc',
        sectionLabel: 'Class 7-A',
        signInUrl: 'https://x/school/sign-in',
        slips: [
          {
            schoolStudentId: 's',
            name: 'Evil <script>',
            rollNo: '1',
            loginId: '7A-1',
            code: 'K7M2P-9QXAB',
            expiresAt: new Date('2026-11-05T00:00:00Z'),
          },
        ],
      })
      expect(html).toContain('7A-1')
      expect(html).toContain('K7M2P-9QXAB')
      expect(html).toContain('2026-11-05')
      expect(html).not.toContain('<script>')
      expect(html).toContain('Evil &lt;script&gt;')
    })
  })
})
