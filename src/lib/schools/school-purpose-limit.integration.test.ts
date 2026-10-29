import { readFileSync } from 'node:fs'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { createDb } from '../../db/connection'
import type { Db } from '../../db/connection'
import {
  fixitRepository,
  schoolsRepository,
  studentPointsLedgerRepository,
} from '../../db/repositories'
import { getAdminOverview } from '../../db/repositories/admin-overview'
import { studentActivityRepository } from '../../db/repositories/activity'
import type { SchoolScope } from '../../db/school-scope'
import { deleteSchoolTermsForTest } from '../../db/test-helpers'
import { sendTransactionalEmail } from '../email'
import { recordFixitCardsForLostMarks } from '../fixit'
import { createInvite, respondToInvite } from '../guardian-links'
import { getLeaderboard } from '../leaderboard'
import { listOutboundStudents } from '../outbound-students'
import { recordPointsForConfirmedItems } from '../points'
import { logProductEvent } from '../product-events'
import { loadSchoolScope } from '../school-session'
import { createSchoolStudent, createSchoolTeacher } from './people'
import { createClass, createSection } from './setup'
import { acceptSchoolTerms } from './terms'

/**
 * S2b, plan test 16 (part 2): the purpose limit. CLAUDE.md "School module rules": a school
 * student's data is used only for that school's exams and reports -- no product analytics, no
 * marketing/nudge/summary mail, no points or leaderboard, no linking into a personal account, and
 * never as AI training data. Local test database only.
 */
describe('school purpose limit (S2b)', () => {
  let db: Db
  const tag = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  let schoolId: string
  let admin: SchoolScope
  let schoolStudentId: string
  let schoolStudentUserId: string
  let schoolStudentEmail: string
  let staffUserId: string
  let subjectId: string
  const households: Array<string> = []
  const created = { students: [] as Array<string>, users: [] as Array<string> }
  let controlStudentId: string
  let controlUserId: string

  beforeAll(async () => {
    db = createDb()
    const p = await schoolsRepository.provision(db, {
      name: `Purpose School ${tag}`,
      code: `purpose-${tag}`,
      board: 'CBSE',
      adminName: 'Purpose Admin',
      adminEmail: `purpose-admin-${tag}@school.test`,
    })
    schoolId = p.school.id
    const a = await loadSchoolScope(db, p.adminUserId, schoolId, [
      'school_admin',
    ])
    if (!a.ok) throw new Error('no admin scope')
    admin = a.scope
    await acceptSchoolTerms(db, admin)
    const cls = await createClass(db, admin, 7, '2026-27')
    const sec = await createSection(db, admin, cls.id, 'A')
    const s = await createSchoolStudent(db, admin, {
      name: 'Purpose Student',
      grade: 7,
      sectionId: sec.id,
      sectionName: 'A',
      rollNo: '1',
      guardianPhone: null,
      guardianName: null,
    })
    schoolStudentId = s.student.id
    schoolStudentUserId = s.user.id
    schoolStudentEmail = s.user.email
    households.push(s.user.household_id)
    const t = await createSchoolTeacher(db, admin, {
      name: 'Purpose Teacher',
      email: `purpose-t-${tag}@school.test`,
    })
    staffUserId = t.user.id
    households.push(t.user.household_id)

    // A PrepPlan (non-school) household, parent, and student as the control.
    const hh = await db
      .insertInto('households')
      .values({ name: `Control ${tag}`, plan: 'free' })
      .returning('id')
      .executeTakeFirstOrThrow()
    households.push(hh.id)
    const parent = await db
      .insertInto('users')
      .values({
        household_id: hh.id,
        email: `control-${tag}@example.com`,
        name: 'Control Parent',
        role: 'parent',
      })
      .returning('id')
      .executeTakeFirstOrThrow()
    controlUserId = parent.id
    created.users.push(parent.id)
    const cs = await db
      .insertInto('students')
      .values({
        household_id: hh.id,
        name: 'Control Student',
        class: 7,
        board: 'CBSE',
      })
      .returning('id')
      .executeTakeFirstOrThrow()
    controlStudentId = cs.id
    created.students.push(cs.id)
    subjectId = (
      await db
        .insertInto('subjects')
        .values({
          board: 'CBSE',
          class: 7,
          code: `ZP-${tag}`,
          name: 'Purpose subject',
          language: 'en',
          is_active: true,
        })
        .returning('id')
        .executeTakeFirstOrThrow()
    ).id
  })

  afterAll(async () => {
    await db
      .deleteFrom('student_points_ledger')
      .where('student_id', 'in', [schoolStudentId, controlStudentId])
      .execute()
    await db
      .deleteFrom('notifications')
      .where('user_id', 'in', [schoolStudentUserId, staffUserId, controlUserId])
      .execute()
    await db
      .deleteFrom('product_events')
      .where('student_id', 'in', [schoolStudentId, controlStudentId])
      .execute()
    await db
      .deleteFrom('guardian_invites')
      .where('guardian_user_id', 'in', [staffUserId, controlUserId])
      .execute()
    await db
      .deleteFrom('guardian_invites')
      .where('student_email', '=', schoolStudentEmail)
      .execute()
    await db.deleteFrom('audit_log').where('school_id', '=', schoolId).execute()
    await db
      .deleteFrom('school_students')
      .where('school_id', '=', schoolId)
      .execute()
    await db
      .deleteFrom('students')
      .where('id', 'in', [schoolStudentId, ...created.students])
      .execute()
    await db
      .deleteFrom('school_sections')
      .where('school_id', '=', schoolId)
      .execute()
    await db
      .deleteFrom('school_classes')
      .where('school_id', '=', schoolId)
      .execute()
    await deleteSchoolTermsForTest(db, [schoolId])
    const members = await db
      .selectFrom('school_members')
      .select('user_id')
      .where('school_id', '=', schoolId)
      .execute()
    await db
      .deleteFrom('school_members')
      .where('school_id', '=', schoolId)
      .execute()
    const school = await db
      .selectFrom('schools')
      .select('household_id')
      .where('id', '=', schoolId)
      .executeTakeFirstOrThrow()
    await db.deleteFrom('schools').where('id', '=', schoolId).execute()
    await db
      .deleteFrom('users')
      .where('id', 'in', [...members.map((m) => m.user_id), ...created.users])
      .execute()
    await db.deleteFrom('subjects').where('id', '=', subjectId).execute()
    await db
      .deleteFrom('households')
      .where('id', 'in', [school.household_id, ...households])
      .execute()
    await db.destroy()
  })

  it('no product analytics: a school student writes no product_events row (control does)', async () => {
    await logProductEvent(db, {
      eventType: 'paper_generated',
      householdId: 'x',
      studentId: schoolStudentId,
    })
    const households0 = await db
      .selectFrom('students')
      .select('household_id')
      .where('id', '=', schoolStudentId)
      .executeTakeFirstOrThrow()
    await logProductEvent(db, {
      eventType: 'paper_generated',
      householdId: households0.household_id,
      studentId: schoolStudentId,
    })
    expect(
      await db
        .selectFrom('product_events')
        .select('id')
        .where('student_id', '=', schoolStudentId)
        .execute(),
    ).toHaveLength(0)
    const ctl = await db
      .selectFrom('students')
      .select('household_id')
      .where('id', '=', controlStudentId)
      .executeTakeFirstOrThrow()
    await logProductEvent(db, {
      eventType: 'paper_generated',
      householdId: ctl.household_id,
      studentId: controlStudentId,
    })
    expect(
      await db
        .selectFrom('product_events')
        .select('id')
        .where('student_id', '=', controlStudentId)
        .execute(),
    ).toHaveLength(1)
  })

  it('no nudges or summaries: the cron student list leaves school students out (control stays in)', async () => {
    const ids = (await listOutboundStudents(db)).map((s) => s.id)
    expect(ids).not.toContain(schoolStudentId)
    expect(ids).toContain(controlStudentId)
    for (const f of ['daily-nudge', 'weekly-summary']) {
      expect(readFileSync(`src/routes/api/cron/${f}.ts`, 'utf8'), f).toContain(
        'listOutboundStudents(db)',
      )
    }
  })

  it('no marketing or product mail: every template to a school login is skipped (control is not)', async () => {
    const content = { subject: 'Hi', html: '<p>hi</p>', text: 'hi' }
    for (const userId of [schoolStudentUserId, staffUserId]) {
      for (const template of [
        'daily_nudge',
        'weekly_summary',
        'paper_ready',
        'evaluation_complete',
        'guardian_invite',
      ] as const) {
        await sendTransactionalEmail(db, { userId, template, content })
      }
      const rows = await db
        .selectFrom('notifications')
        .select(['status', 'payload'])
        .where('user_id', '=', userId)
        .execute()
      expect(rows).toHaveLength(5)
      for (const r of rows) {
        expect(r.status).toBe('skipped')
        expect(JSON.stringify(r.payload)).toContain('school account')
      }
    }
    await sendTransactionalEmail(db, {
      userId: controlUserId,
      template: 'daily_nudge',
      content,
    })
    const ctl = await db
      .selectFrom('notifications')
      .select('payload')
      .where('user_id', '=', controlUserId)
      .executeTakeFirstOrThrow()
    expect(JSON.stringify(ctl.payload)).not.toContain('school account')
  })

  it('no points, leaderboard or Fix-it Deck for a school student', async () => {
    const pointsInsert = vi
      .spyOn(studentPointsLedgerRepository, 'insert')
      .mockResolvedValue({} as never)
    const savepoint = vi
      .spyOn(fixitRepository, 'savepoint')
      .mockResolvedValue(undefined)
    try {
      const item = {
        evaluationItemId: crypto.randomUUID(),
        conceptId: crypto.randomUUID(),
        questionType: 'mcq' as const,
        difficulty: 'Easy' as const,
        marksAwarded: 1,
        marksMax: 1,
      }
      const lost = {
        evaluationItemId: crypto.randomUUID(),
        conceptId: crypto.randomUUID(),
        marksAwarded: 0,
        marksMax: 1,
        knowledgeKnown: false,
        errorType: null,
      }
      await recordPointsForConfirmedItems(db, schoolStudentId, subjectId, [
        item,
      ])
      await recordFixitCardsForLostMarks(db, schoolStudentId, [lost])
      expect(pointsInsert).not.toHaveBeenCalled()
      expect(savepoint).not.toHaveBeenCalled()
      // Control: the same calls for a PrepPlan student do reach the writers.
      await recordPointsForConfirmedItems(db, controlStudentId, subjectId, [
        item,
      ])
      await recordFixitCardsForLostMarks(db, controlStudentId, [lost]).catch(
        () => {},
      )
      expect(pointsInsert).toHaveBeenCalledTimes(1)
      expect(savepoint).toHaveBeenCalled()
    } finally {
      pointsInsert.mockRestore()
      savepoint.mockRestore()
    }
    // Leaderboard: opted-in or not, a school student is excluded by the query itself.
    expect(readFileSync('src/lib/leaderboard.ts', 'utf8')).toContain(
      "'students.school_id', 'is', null",
    )
    await db
      .updateTable('students')
      .set({ leaderboard_opt_in: true, leaderboard_nickname: 'ghost' })
      .where('id', '=', schoolStudentId)
      .execute()
    const view = await getLeaderboard(db, subjectId, controlStudentId)
    expect(view.entries.map((e) => e.nickname)).not.toContain('ghost')
  })

  it('no linking into a personal account: school logins cannot invite, and cannot be invited or accept', async () => {
    const ctl = await db
      .selectFrom('users')
      .select(['id', 'household_id'])
      .where('id', '=', controlUserId)
      .executeTakeFirstOrThrow()
    // A school login cannot send an invite.
    const staff = await db
      .selectFrom('users')
      .select('household_id')
      .where('id', '=', staffUserId)
      .executeTakeFirstOrThrow()
    expect(
      await createInvite(
        db,
        { userId: staffUserId, householdId: staff.household_id },
        'someone@example.com',
        true,
      ),
    ).toEqual({ ok: false, error: 'school_account' })
    // A personal parent inviting a school student's address: looks like success, creates nothing.
    const res = await createInvite(
      db,
      { userId: ctl.id, householdId: ctl.household_id },
      schoolStudentEmail,
      true,
    )
    expect(res.ok).toBe(true)
    expect(
      await db
        .selectFrom('guardian_invites')
        .select('id')
        .where('student_email', '=', schoolStudentEmail)
        .execute(),
    ).toHaveLength(0)
    // Even an invite forced into the table cannot be accepted by her.
    const forced = await db
      .insertInto('guardian_invites')
      .values({
        guardian_user_id: controlUserId,
        guardian_household_id: ctl.household_id,
        student_email: schoolStudentEmail,
        consent_given: true,
      })
      .returning('id')
      .executeTakeFirstOrThrow()
    expect(
      await respondToInvite(db, schoolStudentUserId, forced.id, true),
    ).toEqual({ ok: false, error: 'school_account' })
    const stu = await db
      .selectFrom('students')
      .select('household_id')
      .where('id', '=', schoolStudentId)
      .executeTakeFirstOrThrow()
    const user = await db
      .selectFrom('users')
      .select('household_id')
      .where('id', '=', schoolStudentUserId)
      .executeTakeFirstOrThrow()
    expect(stu.household_id).toBe(user.household_id) // still in her own household, not the guardian's
  })

  it('admin product statistics do not count school users', async () => {
    const overview = await getAdminOverview(db)
    const students = await db
      .selectFrom('users')
      .select((eb) => eb.fn.countAll<string>().as('n'))
      .where('role', '=', 'student')
      .where((eb) =>
        eb.or([
          eb('signup_type', 'is', null),
          eb('signup_type', '!=', 'school'),
        ]),
      )
      .executeTakeFirstOrThrow()
    expect(overview.people.students_total).toBe(Number(students.n))
    const report = await studentActivityRepository.getReport(db, 7)
    expect(report.students.map((s) => s.name)).not.toContain('Purpose Student')
  })

  it('never AI training data: the content-generation AI code never reads answers or school tables', () => {
    for (const f of [
      'ai-question-generation',
      'ai-explanation',
      'ai-remediation',
    ]) {
      const src = readFileSync(`src/lib/${f}.ts`, 'utf8')
      for (const forbidden of [
        'attempt_answers',
        'evaluation_items',
        'scan_pages',
        'scan_detections',
        'school_',
        'students',
      ]) {
        expect(src, `${f} must not reference ${forbidden}`).not.toContain(
          forbidden,
        )
      }
    }
  })
})
