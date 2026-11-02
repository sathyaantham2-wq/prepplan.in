import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createDb } from '../../../db/connection'
import type { Db } from '../../../db/connection'
import { schoolsRepository } from '../../../db/repositories'
import type { SchoolScope } from '../../../db/school-scope'
import { deleteSchoolTermsForTest, deleteTestCredentials } from '../../../db/test-helpers'
import { loadSchoolScope } from '../../school-session'
import { createSchoolStudent, createSchoolTeacher } from '../people'
import { addSchoolSubject, assignTeacher, createClass, createSection, setClassTeacher } from '../setup'
import { acceptSchoolTerms } from '../terms'
import { dispatchDue } from './dispatch'
import { messagingOverview, messagingSettings, retryMessage, saveMessagingSettings } from './log'
import { setParentPermission } from './permissions'
import { enqueueMessage } from './queue'
import { queueVars, templateDef } from './templates'

// Messaging stage 4: what each role sees in the message log, the office's "try again", the principal's settings
// (weekly limit per child, log retention), and that the limit holds a result for Monday and skips a reminder.
// Local test database only; Make is a local fake.
const at = (ist: string) => new Date(new Date(`${ist}:00Z`).getTime() - 5.5 * 3_600_000)
const TUE = at('2026-11-03T10:30')
const NEXT_MON_8 = at('2026-11-09T08:00')

describe('school messaging, stage 4', () => {
  let db: Db
  const tag = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  let schoolId: string
  let admin: SchoolScope
  let principal: SchoolScope
  let classTeacher: SchoolScope
  let otherTeacher: SchoolScope
  let sectionA: string
  let sectionB: string
  let paperId: string
  let subjectId: string
  let sourceId: string
  const members: Record<string, string> = {}
  const stu: Record<string, { id: string; guardian: string }> = {}
  const userIds: Array<string> = []
  const households: Array<string> = []
  const calls: Array<{ body: { template: string; recipient: { phone: string | null } } }> = []
  const fakeFetch = (async (_u: string, init: { body: string }) => {
    calls.push({ body: JSON.parse(init.body) })
    return new Response('{}', { status: 200 })
  }) as unknown as typeof fetch
  const send = (now: Date) => dispatchDue(db, { now, url: 'https://hook.example.test', secret: 'secret-0123456789abcdef', appUrl: 'https://www.prepplan.in', fetchImpl: fakeFetch, schoolId })
  const put = (template: string, who: { s?: string; m?: string }, key: string, extra: Record<string, unknown> = {}) =>
    enqueueMessage(db, {
      schoolId,
      template,
      language: 'en',
      ...(who.s ? { studentId: stu[who.s].id, guardianId: stu[who.s].guardian } : { memberId: members[who.m!] }),
      variables: Object.fromEntries(queueVars(templateDef(template)).map((v) => [v, `${v}-v`])),
      dedupeKey: key,
      ...extra,
    })
  const fresh = (now: Date) => db.updateTable('school_messages').set({ created_at: new Date(now.getTime() - 3_600_000), not_before: new Date(now.getTime() - 3_600_000) }).where('school_id', '=', schoolId).where('status', 'in', ['queued', 'held']).execute()

  beforeAll(async () => {
    db = createDb()
    const p = await schoolsRepository.provision(db, { name: `Msg4 School ${tag}`, code: `m4-${tag}`, board: 'CBSE', adminName: 'Admin', adminEmail: `m4-${tag}@school.test` })
    schoolId = p.school.id
    userIds.push(p.adminUserId)
    const sa = await loadSchoolScope(db, p.adminUserId, schoolId, ['school_admin'])
    if (!sa.ok) throw new Error('scope')
    admin = sa.scope
    await acceptSchoolTerms(db, admin)
    await db.updateTable('schools').set({ messaging_enabled: true }).where('id', '=', schoolId).execute()
    subjectId = (await db.insertInto('subjects').values({ board: 'CBSE', class: 7, code: `M4-${tag}`, name: 'Msg4 Maths', language: 'en', is_active: true }).returning('id').executeTakeFirstOrThrow()).id
    sourceId = (await db.insertInto('sources').values({ subject_id: subjectId, title: 'Msg4 Book', publisher: 'NCERT' }).returning('id').executeTakeFirstOrThrow()).id
    const cls = await createClass(db, admin, 7, '2026-27')
    sectionA = (await createSection(db, admin, cls.id, 'A')).id
    sectionB = (await createSection(db, admin, cls.id, 'B')).id
    const ss = (await addSchoolSubject(db, admin, cls.id, subjectId) as { id: string }).id
    const staff = async (name: string, role?: 'principal') => {
      const t = await createSchoolTeacher(db, admin, { name, email: `${name.split(' ')[0].toLowerCase()}-${tag}@school.test` })
      households.push(t.user.household_id)
      userIds.push(t.user.id)
      if (role) await db.updateTable('school_members').set({ role }).where('id', '=', t.member.id).execute()
      members[name] = t.member.id
      const sc = await loadSchoolScope(db, t.user.id, schoolId, [role ?? 'teacher'])
      if (!sc.ok) throw new Error('scope')
      return sc.scope
    }
    classTeacher = await staff('Kavita Class')
    otherTeacher = await staff('Omkar Other')
    principal = await staff('Prakash Principal', 'principal')
    await setClassTeacher(db, admin, sectionA, members['Kavita Class'])
    await assignTeacher(db, admin, { memberId: members['Kavita Class'], sectionId: sectionA, schoolSubjectId: ss })
    // reload the teacher's scope so it carries the new assignment
    const re = await loadSchoolScope(db, classTeacher.userId, schoolId, ['teacher'])
    if (re.ok) classTeacher = re.scope
    const people: Array<[string, string, string]> = [['Asha', sectionA, '+919700000001'], ['Ravi', sectionA, '+919700000002'], ['Zoya', sectionB, '+919700000003']]
    for (const [i, [n, sec, phone]] of people.entries()) {
      const s = await createSchoolStudent(db, admin, { name: `${n} Surname`, grade: 7, sectionId: sec, sectionName: sec === sectionA ? 'A' : 'B', rollNo: String(i + 1), admissionNo: null, guardianPhone: phone, guardianName: `${n} Parent` })
      households.push(s.user.household_id)
      userIds.push(s.user.id)
      const g = await db.selectFrom('school_student_guardians').select('id').where('school_student_id', '=', s.schoolStudent.id).executeTakeFirstOrThrow()
      stu[n] = { id: s.schoolStudent.id, guardian: g.id }
      await setParentPermission(db, admin, s.schoolStudent.id, { whatsappOk: true }, 'admin')
    }
    paperId = (await db.insertInto('school_own_papers').values({ school_id: schoolId, class_id: cls.id, school_subject_id: ss, title: `Paper ${tag}`, source_kind: 'prepplan_exam', status: 'approved', phase: 'done', total_marks: '30', created_by_user_id: admin.userId, approved_at: new Date(), approved_by_user_id: admin.userId }).returning('id').executeTakeFirstOrThrow()).id
  })

  afterAll(async () => {
    const ids = [schoolId]
    await deleteTestCredentials(userIds)
    for (const t of ['school_message_counts', 'school_message_events', 'school_messages', 'school_parent_messaging', 'school_own_papers'] as const) await db.deleteFrom(t).where('school_id', 'in', ids).execute()
    await db.deleteFrom('audit_log').where('school_id', 'in', ids).execute()
    await db.deleteFrom('school_student_guardians').where('school_id', 'in', ids).execute()
    await db.deleteFrom('school_students').where('school_id', 'in', ids).execute()
    await db.deleteFrom('students').where('school_id', 'in', ids).execute()
    for (const t of ['school_teacher_assignments', 'school_subjects', 'school_sections', 'school_classes'] as const) await db.deleteFrom(t).where('school_id', 'in', ids).execute()
    await deleteSchoolTermsForTest(db, ids)
    const mem = await db.selectFrom('school_members').select('user_id').where('school_id', 'in', ids).execute()
    await db.deleteFrom('school_members').where('school_id', 'in', ids).execute()
    const sh = await db.selectFrom('schools').select('household_id').where('id', 'in', ids).execute()
    await db.deleteFrom('schools').where('id', 'in', ids).execute()
    const mu = mem.map((m) => m.user_id)
    const hh = mu.length ? await db.selectFrom('users').select('household_id').where('id', 'in', mu).execute() : []
    if (mu.length) await db.deleteFrom('users').where('id', 'in', mu).execute()
    await db.deleteFrom('households').where('id', 'in', [...sh.map((h) => h.household_id), ...hh.map((h) => h.household_id), ...households]).execute()
    await db.deleteFrom('chapters').where('source_id', '=', sourceId).execute()
    await db.deleteFrom('sources').where('id', '=', sourceId).execute()
    await db.deleteFrom('subjects').where('id', '=', subjectId).execute()
    await db.destroy()
  })

  // ---------------------------------------------------------------- who sees what
  it('the office sees every message; a teacher only her own sections; the principal only counts', async () => {
    await put('weekly_focus', { s: 'Asha' }, `a-${tag}`)
    await put('weekly_focus', { s: 'Zoya' }, `z-${tag}`) // section B: not Kavita's
    await put('flags_waiting', { m: 'Kavita Class' }, `f-${tag}`)
    await put('flags_waiting', { m: 'Omkar Other' }, `f2-${tag}`)
    await put('monday_pulse', { m: 'Prakash Principal' }, `p-${tag}`)
    const all = await messagingOverview(db, admin)
    expect(all.rows).toHaveLength(5)
    expect(all.rows!.map((r) => r.recipient).sort()).toEqual(["Asha's parent", "Zoya's parent", 'Kavita Class', 'Omkar Other', 'Prakash Principal'].sort())
    expect(JSON.stringify(all)).not.toContain('Surname') // first names only, even for the office
    expect(all.messagingOn).toBe(true)
    expect(all.summary.waiting).toBe(5)

    const kavita = await messagingOverview(db, classTeacher)
    expect(kavita.rows!.map((r) => r.recipient).sort()).toEqual(["Asha's parent", 'Kavita Class'])
    expect(kavita.summary.waiting).toBe(2)
    const omkar = await messagingOverview(db, otherTeacher)
    expect(omkar.rows!.map((r) => r.recipient)).toEqual(['Omkar Other']) // nobody else's staff message, no parent of a section he does not teach

    const pr = await messagingOverview(db, principal)
    expect(pr.rows).toBeNull()
    expect(pr.summary.waiting).toBe(5)
    expect(JSON.stringify(pr)).not.toMatch(/Asha|Zoya|Ravi|Kavita|Omkar/)
    expect(pr.byTemplate.find((t) => t.template === 'weekly_focus')).toBeTruthy()
  })

  it('students and parents cannot see the log', async () => {
    await expect(messagingOverview(db, { ...admin, role: 'student' })).rejects.toMatchObject({ code: 'forbidden' })
    await expect(messagingOverview(db, { ...admin, role: 'parent' })).rejects.toMatchObject({ code: 'forbidden' })
  })

  // ---------------------------------------------------------------- try again
  it('only the office can try a failed or "not sent" message again, and only those', async () => {
    const id = (await put('weekly_focus', { s: 'Ravi' }, `r-${tag}`))!
    await expect(retryMessage(db, admin, id)).rejects.toMatchObject({ code: 'conflict' }) // still waiting
    await db.updateTable('school_messages').set({ status: 'failed', reason: 'webhook_500', attempts: 4 }).where('id', '=', id).execute()
    await expect(retryMessage(db, principal, id)).rejects.toMatchObject({ code: 'forbidden' })
    await expect(retryMessage(db, classTeacher, id)).rejects.toMatchObject({ code: 'forbidden' })
    await retryMessage(db, admin, id, TUE)
    const row = await db.selectFrom('school_messages').select(['status', 'attempts', 'reason']).where('id', '=', id).executeTakeFirstOrThrow()
    expect(row).toEqual({ status: 'queued', attempts: 0, reason: null })
    const ev = await db.selectFrom('school_message_events').select('detail').where('message_id', '=', id).orderBy('created_at', 'desc').executeTakeFirstOrThrow()
    expect(ev.detail).toBe('retry_by_office')
    await expect(retryMessage(db, admin, '00000000-0000-4000-8000-000000000000')).rejects.toMatchObject({ code: 'not_found' })
  })

  // ---------------------------------------------------------------- settings
  it('the principal and the office choose the weekly limit and the log period; a teacher cannot', async () => {
    expect(await messagingSettings(db, principal)).toEqual({ messagingOn: true, weeklyLimit: null, logDays: 365 })
    await saveMessagingSettings(db, principal, { weeklyLimit: 2, logDays: 180 })
    expect(await messagingSettings(db, admin)).toMatchObject({ weeklyLimit: 2, logDays: 180 })
    await saveMessagingSettings(db, admin, { weeklyLimit: null, logDays: 365 })
    expect((await messagingSettings(db, admin)).weeklyLimit).toBeNull()
    await expect(saveMessagingSettings(db, classTeacher, { weeklyLimit: 2, logDays: 365 })).rejects.toMatchObject({ code: 'forbidden' })
    await expect(messagingSettings(db, classTeacher)).rejects.toMatchObject({ code: 'forbidden' })
    for (const bad of [{ weeklyLimit: 0, logDays: 365 }, { weeklyLimit: 15, logDays: 365 }, { weeklyLimit: 1.5, logDays: 365 }, { weeklyLimit: 2, logDays: 10 }, { weeklyLimit: 2, logDays: 5000 }, { weeklyLimit: 2, logDays: Number.NaN }])
      await expect(saveMessagingSettings(db, principal, bad), JSON.stringify(bad)).rejects.toMatchObject({ code: 'invalid' })
    const log = await db.selectFrom('audit_log').select('action').where('school_id', '=', schoolId).where('action', '=', 'school.messaging_settings').execute()
    expect(log.length).toBe(2)
  })

  // ---------------------------------------------------------------- the weekly limit
  it('with no limit nothing is held back, however many messages a child gets', async () => {
    await db.deleteFrom('school_message_events').where('school_id', '=', schoolId).execute()
    await db.deleteFrom('school_messages').where('school_id', '=', schoolId).execute()
    calls.length = 0
    for (let i = 0; i < 4; i++) await put('weekly_focus', { s: 'Asha' }, `nl-${i}-${tag}`)
    await fresh(TUE)
    expect((await send(TUE)).sent).toBe(4)
  })

  it('a limit of 1: a result waits for next Monday 8 am, a reminder is skipped, another child is unaffected', async () => {
    await db.deleteFrom('school_message_events').where('school_id', '=', schoolId).execute()
    await db.deleteFrom('school_messages').where('school_id', '=', schoolId).execute()
    calls.length = 0
    await saveMessagingSettings(db, principal, { weeklyLimit: 1, logDays: 365 })
    await put('weekly_focus', { s: 'Asha' }, `l1-${tag}`)
    await fresh(TUE)
    expect((await send(TUE)).sent).toBe(1) // her one message this week
    const result = (await put('result_ready', { s: 'Asha' }, `l2-${tag}`, { paperId }))!
    const reminder = (await put('weekly_focus', { s: 'Asha' }, `l3-${tag}`))!
    const other = (await put('weekly_focus', { s: 'Ravi' }, `l4-${tag}`))!
    await fresh(TUE)
    const r = await send(TUE)
    expect(r).toMatchObject({ sent: 1, held: 1, skipped: 1 })
    const get = (id: string) => db.selectFrom('school_messages').select(['status', 'reason', 'not_before']).where('id', '=', id).executeTakeFirstOrThrow()
    expect(await get(result)).toMatchObject({ status: 'held', reason: 'weekly_limit' })
    expect((await get(result)).not_before.getTime()).toBe(NEXT_MON_8.getTime())
    expect(await get(reminder)).toMatchObject({ status: 'skipped', reason: 'weekly_limit' })
    expect(await get(other)).toMatchObject({ status: 'sent' })
    // next week the held result goes out
    calls.length = 0
    await db.updateTable('school_messages').set({ created_at: new Date(NEXT_MON_8.getTime() - 86_400_000) }).where('id', '=', result).execute()
    expect((await send(at('2026-11-09T09:00'))).sent).toBe(1)
    expect(calls.map((c) => c.body.template)).toEqual(['result_ready_v1'])
  })
})
