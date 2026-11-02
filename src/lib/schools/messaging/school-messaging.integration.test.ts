import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createDb } from '../../../db/connection'
import type { Db } from '../../../db/connection'
import { schoolsRepository } from '../../../db/repositories'
import type { SchoolScope } from '../../../db/school-scope'
import { deleteSchoolTermsForTest, deleteTestCredentials } from '../../../db/test-helpers'
import { Route as ParentRoute } from '../../../routes/p.$token'
import { loadSchoolScope } from '../../school-session'
import { createSchoolStudent } from '../people'
import { seedProgressDemo } from '../progress-demo'
import { addSchoolSubject, createClass, createSection } from '../setup'
import { acceptSchoolTerms } from '../terms'
import { issueParentLink } from './link-token'
import { loadParentView } from './parent-view'
import { MessageRefused, enqueueMessage } from './queue'
import { UnapprovedTemplateError, queueVars, templateDef } from './templates'

// Messaging stage 1 (docs/schools/MESSAGING_PLAN.md): the approved-template guard in the database and in code,
// school isolation of the queue, and the personal link page. Local test database only; no network, no Make.
describe('school messaging, stage 1', () => {
  let db: Db
  const tag = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  let schoolId: string
  let otherSchoolId: string
  let admin: SchoolScope
  let subjectId: string
  let sourceId: string
  let sectionId: string
  let conceptId: string
  let paperId: string
  let asha: { id: string }
  let ravi: { id: string }
  let ashaGuardian: string
  let otherGuardian: string
  let otherStudent: string
  const userIds: Array<string> = []
  const households: Array<string> = []

  const vars = (template: string) =>
    Object.fromEntries(queueVars(templateDef(template)).map((v) => [v, `${v}-x`]))

  beforeAll(async () => {
    db = createDb()
    const mk = async (name: string) => {
      const p = await schoolsRepository.provision(db, {
        name: `${name} ${tag}`,
        code: `${name.slice(0, 2).toLowerCase()}-${tag}`,
        board: 'CBSE',
        adminName: 'Admin',
        adminEmail: `${name.slice(0, 2).toLowerCase()}-${tag}@school.test`,
      })
      userIds.push(p.adminUserId)
      return p
    }
    const p = await mk('Msg School')
    schoolId = p.school.id
    const sa = await loadSchoolScope(db, p.adminUserId, schoolId, ['school_admin'])
    if (!sa.ok) throw new Error('scope')
    admin = sa.scope
    await acceptSchoolTerms(db, admin)
    const p2 = await mk('Other School')
    otherSchoolId = p2.school.id
    const sa2 = await loadSchoolScope(db, p2.adminUserId, otherSchoolId, ['school_admin'])
    if (!sa2.ok) throw new Error('scope')
    await acceptSchoolTerms(db, sa2.scope)

    subjectId = (
      await db
        .insertInto('subjects')
        .values({ board: 'CBSE', class: 7, code: `ZM-${tag}`, name: 'Msg Maths', language: 'en', is_active: true })
        .returning('id')
        .executeTakeFirstOrThrow()
    ).id
    sourceId = (
      await db.insertInto('sources').values({ subject_id: subjectId, title: 'Msg Book', publisher: 'NCERT' }).returning('id').executeTakeFirstOrThrow()
    ).id
    let firstChapter = ''
    for (let i = 1; i <= 6; i++) {
      const ch = await db
        .insertInto('chapters')
        .values({ source_id: sourceId, subject_id: subjectId, part: 'I', chapter_no: i, name: `Chapter ${i} topic`, order_index: i })
        .returning('id')
        .executeTakeFirstOrThrow()
      if (i === 1) firstChapter = ch.id
    }
    conceptId = (
      await db
        .insertInto('concepts')
        .values({ chapter_id: firstChapter, board: 'CBSE', class: 7, code: `ZM-${tag}-1.1`, name: 'Chapter 1 idea', difficulty_base: 'Easy' })
        .returning('id')
        .executeTakeFirstOrThrow()
    ).id
    const cls = await createClass(db, admin, 7, '2026-27')
    sectionId = (await createSection(db, admin, cls.id, 'A')).id
    await addSchoolSubject(db, admin, cls.id, subjectId)
    const made: Record<string, { id: string }> = {}
    for (const [i, n] of ['Asha Kumari Rao', 'Ravi', 'Meena', 'Kiran', 'Sita', 'Omar'].entries()) {
      const s = await createSchoolStudent(db, admin, {
        name: n,
        grade: 7,
        sectionId,
        sectionName: 'A',
        rollNo: String(i + 1),
        admissionNo: null,
        guardianPhone: null,
        guardianName: null,
      })
      households.push(s.user.household_id)
      userIds.push(s.user.id)
      made[n] = { id: s.schoolStudent.id }
    }
    asha = made['Asha Kumari Rao']
    ravi = made['Ravi']
    await seedProgressDemo(db, schoolId, new Date())
    paperId = (
      await db.selectFrom('school_paper_releases').select('paper_id').where('school_id', '=', schoolId).orderBy('released_at', 'desc').executeTakeFirstOrThrow()
    ).paper_id
    ashaGuardian = (
      await db.insertInto('school_student_guardians').values({ school_id: schoolId, school_student_id: asha.id, phone_e164: '+910000000001', name: 'Asha Parent' }).returning('id').executeTakeFirstOrThrow()
    ).id
    // a student and guardian that belong to the OTHER school
    const classB = await createClass(db, (sa2.scope), 7, '2026-27')
    const secB = await createSection(db, sa2.scope, classB.id, 'A')
    const sB = await createSchoolStudent(db, sa2.scope, {
      name: 'Zed Other',
      grade: 7,
      sectionId: secB.id,
      sectionName: 'A',
      rollNo: '1',
      admissionNo: null,
      guardianPhone: null,
      guardianName: null,
    })
    households.push(sB.user.household_id)
    userIds.push(sB.user.id)
    otherStudent = sB.schoolStudent.id
    otherGuardian = (
      await db.insertInto('school_student_guardians').values({ school_id: otherSchoolId, school_student_id: otherStudent, phone_e164: '+910000000002', name: 'Zed Parent' }).returning('id').executeTakeFirstOrThrow()
    ).id
  })

  afterAll(async () => {
    const ids = [schoolId, otherSchoolId]
    await deleteTestCredentials(userIds)
    for (const t of ['school_message_events', 'school_messages', 'school_parent_messaging', 'school_message_counts', 'school_exam_reflections', 'school_answer_disputes', 'school_paper_releases', 'school_answer_marks', 'school_sheet_marking', 'school_own_sheets', 'school_own_questions', 'school_own_papers'] as const)
      await db.deleteFrom(t).where('school_id', 'in', ids).execute()
    await db.deleteFrom('audit_log').where('school_id', 'in', ids).execute()
    await db.deleteFrom('school_student_guardians').where('school_id', 'in', ids).execute()
    await db.deleteFrom('school_students').where('school_id', 'in', ids).execute()
    await db.deleteFrom('students').where('school_id', 'in', ids).execute()
    for (const t of ['school_teacher_assignments', 'school_subjects', 'school_sections', 'school_classes'] as const)
      await db.deleteFrom(t).where('school_id', 'in', ids).execute()
    await deleteSchoolTermsForTest(db, ids)
    const members = await db.selectFrom('school_members').select('user_id').where('school_id', 'in', ids).execute()
    await db.deleteFrom('school_members').where('school_id', 'in', ids).execute()
    const sh = await db.selectFrom('schools').select('household_id').where('id', 'in', ids).execute()
    await db.deleteFrom('schools').where('id', 'in', ids).execute()
    const mu = members.map((m) => m.user_id)
    const hh = mu.length ? await db.selectFrom('users').select('household_id').where('id', 'in', mu).execute() : []
    if (mu.length) await db.deleteFrom('users').where('id', 'in', mu).execute()
    await db.deleteFrom('households').where('id', 'in', [...sh.map((h) => h.household_id), ...hh.map((h) => h.household_id), ...households]).execute()
    await db.deleteFrom('chapters').where('source_id', '=', sourceId).execute()
    await db.deleteFrom('concepts').where('id', '=', conceptId).execute()
    await db.deleteFrom('sources').where('id', '=', sourceId).execute()
    await db.deleteFrom('subjects').where('id', '=', subjectId).execute()
    await db.destroy()
  })

  // ---------------------------------------------------------------- the approved-template guard
  it('the queue refuses a template that is not on the approved list, and the database does too', async () => {
    await expect(
      enqueueMessage(db, { schoolId, template: 'promo_offer', language: 'en', studentId: asha.id, guardianId: ashaGuardian, variables: {}, dedupeKey: 'x' }),
    ).rejects.toThrow(UnapprovedTemplateError)
    await expect(
      db
        .insertInto('school_messages')
        .values({ school_id: schoolId, template: 'promo_offer', audience: 'parent', recipient_student_id: asha.id, recipient_guardian_id: ashaGuardian, language: 'en', dedupe_key: 'raw-1' })
        .execute(),
    ).rejects.toThrow(/school_messages_template_check|check constraint/i)
  })

  it('refuses extra or missing variables, line breaks and the wrong kind of recipient', async () => {
    const base = { schoolId, language: 'en' as const, dedupeKey: `d-${tag}` }
    const ok = vars('result_ready')
    await expect(enqueueMessage(db, { ...base, template: 'result_ready', studentId: asha.id, guardianId: ashaGuardian, variables: { ...ok, report: 'the whole report' } })).rejects.toThrow(MessageRefused)
    const { score: _s, ...noScore } = ok
    await expect(enqueueMessage(db, { ...base, template: 'result_ready', studentId: asha.id, guardianId: ashaGuardian, variables: noScore })).rejects.toThrow(/missing/)
    await expect(enqueueMessage(db, { ...base, template: 'result_ready', studentId: asha.id, guardianId: ashaGuardian, variables: { ...ok, strength: 'a\nb' } })).rejects.toThrow(/line breaks/)
    await expect(enqueueMessage(db, { ...base, template: 'result_ready', memberId: 'm', variables: ok })).rejects.toThrow(MessageRefused)
    await expect(enqueueMessage(db, { ...base, template: 'flags_waiting', studentId: asha.id, guardianId: ashaGuardian, variables: vars('flags_waiting') })).rejects.toThrow(MessageRefused)
  })

  it('queues a valid message once; the same event again is ignored', async () => {
    const input = { schoolId, template: 'result_ready', language: 'te' as const, studentId: asha.id, guardianId: ashaGuardian, variables: vars('result_ready'), dedupeKey: `rr-${tag}` }
    const id = await enqueueMessage(db, input)
    expect(id).not.toBeNull()
    expect(await enqueueMessage(db, input)).toBeNull()
    const row = await db.selectFrom('school_messages').selectAll().where('id', '=', id!).executeTakeFirstOrThrow()
    expect(row).toMatchObject({ status: 'queued', audience: 'parent', language: 'te', school_id: schoolId })
    expect(Object.keys(row.variables as object).sort()).toEqual(queueVars(templateDef('result_ready')).sort())
    expect(Object.keys(row.variables as object)).not.toContain('link')
    const events = await db.selectFrom('school_message_events').select('status').where('message_id', '=', id!).execute()
    expect(events.map((e) => e.status)).toEqual(['queued'])
  })

  // ---------------------------------------------------------------- school isolation of the queue
  it("a message for one school can never name another school's student or guardian", async () => {
    const v = vars('result_ready')
    // school A's id with school B's guardian, school B's student, and a mix
    for (const [studentId, guardianId] of [[asha.id, otherGuardian], [otherStudent, ashaGuardian], [otherStudent, otherGuardian]] as const)
      await expect(
        enqueueMessage(db, { schoolId, template: 'result_ready', language: 'en', studentId, guardianId, variables: v, dedupeKey: `iso-${studentId}-${guardianId}` }),
      ).rejects.toThrow(/foreign key|violates/i)
  })

  // ---------------------------------------------------------------- the personal link page
  it('a valid exam link shows that child (first name only) and no other child', async () => {
    const { token } = issueParentLink({ schoolId, studentId: asha.id, kind: 'exam', paperId })
    const v = await loadParentView(db, token)
    expect(v.state).toBe('exam')
    if (v.state !== 'exam') return
    expect(v.child).toBe('Asha')
    expect(v.max).toBeGreaterThan(0)
    const text = JSON.stringify(v)
    for (const other of ['Ravi', 'Meena', 'Kiran', 'Kumari', 'Rao', 'Zed']) expect(text).not.toContain(other)
    expect(Object.keys(v)).not.toEqual(expect.arrayContaining(['level', 'rank', 'topics']))
  })

  it('a focus link shows at most three items', async () => {
    const { token } = issueParentLink({ schoolId, studentId: asha.id, kind: 'focus' })
    const v = await loadParentView(db, token)
    expect(v.state).toBe('focus')
    if (v.state === 'focus') expect(v.focus.length).toBeLessThanOrEqual(3)
  })

  it('expired, tampered, another school, another child of the wrong school and a left student all look the same', async () => {
    const now = new Date()
    const good = issueParentLink({ schoolId, studentId: asha.id, kind: 'focus' }, now).token
    expect((await loadParentView(db, good, now)).state).toBe('focus')
    const invalid = { state: 'invalid' }
    expect(await loadParentView(db, good, new Date(now.getTime() + 8 * 86_400_000))).toEqual(invalid)
    expect(await loadParentView(db, `${good.slice(0, -2)}AA`, now)).toEqual(invalid)
    // validly signed, but the student belongs to the other school
    const wrongSchool = issueParentLink({ schoolId, studentId: otherStudent, kind: 'focus' }, now).token
    expect(await loadParentView(db, wrongSchool, now)).toEqual(invalid)
    const wrongSchool2 = issueParentLink({ schoolId: otherSchoolId, studentId: asha.id, kind: 'focus' }, now).token
    expect(await loadParentView(db, wrongSchool2, now)).toEqual(invalid)
    // an exam link whose paper the child was never marked in
    const noPaper = issueParentLink({ schoolId, studentId: asha.id, kind: 'exam', paperId: '99999999-9999-4999-8999-999999999999' }, now).token
    expect(await loadParentView(db, noPaper, now)).toEqual(invalid)
    await db.updateTable('school_students').set({ status: 'left' }).where('id', '=', ravi.id).execute()
    const left = issueParentLink({ schoolId, studentId: ravi.id, kind: 'focus' }, now).token
    expect(await loadParentView(db, left, now)).toEqual(invalid)
  })

  it('the page title and link preview are fixed text with no child or school name', () => {
    const head = ParentRoute.options.head!({} as never) as { meta: Array<Record<string, string>> }
    const text = JSON.stringify(head.meta)
    expect(head.meta.find((m) => 'title' in m)?.title).toBe('PrepPlan report')
    expect(head.meta.find((m) => m.property === 'og:title')?.content).toBe('PrepPlan report')
    expect(text).not.toMatch(/Asha|Msg School|school/i)
    expect(text).toContain('noindex')
  })
})
