import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { createDb } from '../../../db/connection'
import type { Db } from '../../../db/connection'
import { schoolsRepository } from '../../../db/repositories'
import type { SchoolScope } from '../../../db/school-scope'
import { deleteSchoolTermsForTest, deleteTestCredentials } from '../../../db/test-helpers'
import { loadSchoolScope } from '../../school-session'
import { createSchoolStudent, createSchoolTeacher } from '../people'
import { seedProgressDemo } from '../progress-demo'
import { messageParents } from '../results-release'
import { addSchoolSubject, assignTeacher, createClass, createSection, setClassTeacher } from '../setup'
import { acceptSchoolTerms } from '../terms'
import { handleCallback } from './callback'
import { BACKOFF_MINUTES, MAX_ATTEMPTS, dispatchDue } from './dispatch'
import { queueDisputeClosing, queueFlagsWaiting, queueMondayPulse, queueResultReady, queueUploadsPending, scheduleDue } from './events'
import { verifyParentLink } from './link-token'
import { recordStopReply, setParentPermission } from './permissions'
import { purgeMessageLogs } from './retention'
import { inboundSignature, signOutbound, statusSignature } from './signing'
import { APPROVED_TEMPLATES, templateDef } from './templates'

// Messaging stage 3 (docs/schools/MESSAGING_PLAN.md sections 1, 4, 5, 7, 8): each event reaches only the right
// people, the dispatcher respects consent and quiet hours, the payload holds only the allowed fields, a webhook that
// is down never breaks the main action, the callback is signed, and old logs lose their variables. Make is faked
// with a local function: no network. Local test database only.
const SECRET = 'test-shared-secret-0123456789abcdef'
const URL = 'https://hook.example.test/in'
const at = (ist: string) => new Date(new Date(`${ist}:00Z`).getTime() - 5.5 * 3_600_000)
const TUE_10AM = at('2026-11-03T10:30')
const TUE_4PM = at('2026-11-03T16:30')
const TUE_10PM = at('2026-11-03T22:00')
const WED_9AM = at('2026-11-04T09:00')
const SUN_630PM = at('2026-11-01T18:30')
const MON_830AM = at('2026-11-02T08:30')

describe('school messaging, stage 3', () => {
  let db: Db
  const tag = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  let schoolId: string
  let admin: SchoolScope
  let sectionId: string
  let subjectId: string
  let sourceId: string
  let conceptId: string
  let schoolSubjectId: string
  let latestPaper: string
  let classTeacher: string
  let subjectTeacher: string
  let principal: string
  const stu: Record<string, { id: string; guardian: string }> = {}
  const userIds: Array<string> = []
  const households: Array<string> = []
  const calls: Array<{ url: string; headers: Record<string, string>; body: any }> = []
  let mode: 'ok' | 'down' | 'http500' = 'ok'
  const fakeFetch = (async (url: string, init: { headers: Record<string, string>; body: string }) => {
    calls.push({ url, headers: init.headers, body: JSON.parse(init.body) })
    if (mode === 'down') throw new TypeError('network down')
    return new Response('{}', { status: mode === 'http500' ? 500 : 200 })
  }) as unknown as typeof fetch
  const deps = (now: Date, extra: Record<string, unknown> = {}) => ({ now, url: URL, secret: SECRET, appUrl: 'https://www.prepplan.in', fetchImpl: fakeFetch, schoolId, ...extra })
  const rows = (where: Record<string, string> = {}) => {
    let q = db.selectFrom('school_messages').selectAll().where('school_id', '=', schoolId)
    for (const [k, v] of Object.entries(where)) q = q.where(k as never, '=', v as never)
    return q.orderBy('created_at').execute()
  }
  async function freshen(now: Date) {
    await db.updateTable('school_messages').set({ created_at: new Date(now.getTime() - 3_600_000), not_before: new Date(now.getTime() - 3_600_000) }).where('school_id', '=', schoolId).where('status', 'in', ['queued', 'held', 'not_sent']).execute()
  }
  async function clearMessages() {
    await db.deleteFrom('school_message_events').where('school_id', '=', schoolId).execute()
    await db.deleteFrom('school_messages').where('school_id', '=', schoolId).execute()
    calls.length = 0
    mode = 'ok'
  }

  beforeAll(async () => {
    db = createDb()
    const p = await schoolsRepository.provision(db, { name: `Msg3 School ${tag}`, code: `m3-${tag}`, board: 'CBSE', adminName: 'Admin', adminEmail: `m3-${tag}@school.test` })
    schoolId = p.school.id
    userIds.push(p.adminUserId)
    const sa = await loadSchoolScope(db, p.adminUserId, schoolId, ['school_admin'])
    if (!sa.ok) throw new Error('scope')
    admin = sa.scope
    await acceptSchoolTerms(db, admin)
    await db.updateTable('schools').set({ messaging_enabled: true }).where('id', '=', schoolId).execute()
    subjectId = (await db.insertInto('subjects').values({ board: 'CBSE', class: 7, code: `M3-${tag}`, name: 'Msg Maths', language: 'en', is_active: true }).returning('id').executeTakeFirstOrThrow()).id
    sourceId = (await db.insertInto('sources').values({ subject_id: subjectId, title: 'Msg3 Book', publisher: 'NCERT' }).returning('id').executeTakeFirstOrThrow()).id
    let first = ''
    for (let i = 1; i <= 6; i++) {
      const ch = await db.insertInto('chapters').values({ source_id: sourceId, subject_id: subjectId, part: 'I', chapter_no: i, name: `Chapter ${i} topic`, order_index: i }).returning('id').executeTakeFirstOrThrow()
      if (i === 1) first = ch.id
    }
    conceptId = (await db.insertInto('concepts').values({ chapter_id: first, board: 'CBSE', class: 7, code: `M3-${tag}-1.1`, name: 'Chapter 1 idea', difficulty_base: 'Easy' }).returning('id').executeTakeFirstOrThrow()).id
    const cls = await createClass(db, admin, 7, '2026-27')
    sectionId = (await createSection(db, admin, cls.id, 'A')).id
    schoolSubjectId = (await addSchoolSubject(db, admin, cls.id, subjectId) as { id: string }).id
    const mkStaff = async (name: string, role?: 'principal') => {
      const t = await createSchoolTeacher(db, admin, { name, email: `${name.split(' ')[0].toLowerCase()}-${tag}@school.test` })
      households.push(t.user.household_id)
      userIds.push(t.user.id)
      if (role) await db.updateTable('school_members').set({ role }).where('id', '=', t.member.id).execute()
      return t.member.id
    }
    classTeacher = await mkStaff('Kavita Class')
    subjectTeacher = await mkStaff('Suresh Subject')
    principal = await mkStaff('Prakash Principal', 'principal')
    await setClassTeacher(db, admin, sectionId, classTeacher)
    await assignTeacher(db, admin, { memberId: subjectTeacher, sectionId, schoolSubjectId })
    const phones: Record<string, string | null> = { Asha: '+919800000001', Ravi: '+919800000002', Meena: '+919800000003', Kiran: '+919800000004', Sita: '+919800000005', Omar: null }
    for (const [i, n] of ['Asha', 'Ravi', 'Meena', 'Kiran', 'Sita', 'Omar'].entries()) {
      const s = await createSchoolStudent(db, admin, { name: `${n} Family`, grade: 7, sectionId, sectionName: 'A', rollNo: String(i + 1), admissionNo: null, guardianPhone: phones[n], guardianName: phones[n] ? `${n} Parent` : null })
      households.push(s.user.household_id)
      userIds.push(s.user.id)
      const g = await db.selectFrom('school_student_guardians').select('id').where('school_student_id', '=', s.schoolStudent.id).executeTakeFirst()
      stu[n] = { id: s.schoolStudent.id, guardian: g?.id ?? '' }
    }
    // Asha: yes, Telugu. Ravi: yes. Meena: yes then STOP. Kiran: never agreed. Sita: yes (she will have fallen twice). Omar: no phone.
    await setParentPermission(db, admin, stu.Asha.id, { whatsappOk: true, language: 'te' }, 'admin')
    await setParentPermission(db, admin, stu.Ravi.id, { whatsappOk: true }, 'admin')
    await setParentPermission(db, admin, stu.Meena.id, { whatsappOk: true }, 'admin')
    await recordStopReply(db, '+919800000003')
    await setParentPermission(db, admin, stu.Sita.id, { whatsappOk: true }, 'admin')
    await seedProgressDemo(db, schoolId, SUN_630PM)
    const rel = await db.selectFrom('school_paper_releases').select(['paper_id', 'released_at']).where('school_id', '=', schoolId).orderBy('released_at', 'desc').execute()
    latestPaper = rel[0].paper_id
    // Sita's three exams fall: 90 %, 60 %, 30 %
    const order = [...rel].reverse()
    for (const [i, f] of [0.9, 0.6, 0.3].entries()) {
      await db.updateTable('school_answer_marks').set((eb) => ({ final_marks: eb('max_marks', '*', String(f)) })).where('school_id', '=', schoolId).where('paper_id', '=', order[i].paper_id).where('school_student_id', '=', stu.Sita.id).execute()
    }
  })

  afterAll(async () => {
    const ids = [schoolId]
    await deleteTestCredentials(userIds)
    for (const t of ['school_message_counts', 'school_message_events', 'school_messages', 'school_parent_messaging', 'school_exam_reflections', 'school_answer_disputes', 'school_paper_releases', 'school_answer_marks', 'school_sheet_marking', 'school_own_sheets', 'school_own_questions', 'school_own_papers'] as const)
      await db.deleteFrom(t).where('school_id', 'in', ids).execute()
    await db.deleteFrom('audit_log').where('school_id', 'in', ids).execute()
    await db.deleteFrom('school_student_guardians').where('school_id', 'in', ids).execute()
    await db.deleteFrom('school_students').where('school_id', 'in', ids).execute()
    await db.deleteFrom('students').where('school_id', 'in', ids).execute()
    for (const t of ['school_teacher_assignments', 'school_subjects', 'school_sections', 'school_classes'] as const) await db.deleteFrom(t).where('school_id', 'in', ids).execute()
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

  // ---------------------------------------------------------------- the right people
  it('result_ready goes only to parents who agreed (and have not said STOP), in their language, once', async () => {
    const first = await queueResultReady(db, schoolId, latestPaper, sectionId)
    expect(first.parents).toBe(3) // Asha, Ravi, Sita. Not Meena (STOP), Kiran (never agreed), Omar (no phone)
    const m = await rows({ template: 'result_ready' })
    expect(m.map((r) => r.recipient_student_id).sort()).toEqual([stu.Asha.id, stu.Ravi.id, stu.Sita.id].sort())
    expect(m.find((r) => r.recipient_student_id === stu.Asha.id)!.language).toBe('te')
    expect(m.find((r) => r.recipient_student_id === stu.Ravi.id)!.language).toBe('en')
    for (const r of m) {
      expect(r.status).toBe('queued')
      expect(r.recipient_guardian_id).toBe(r.recipient_student_id === stu.Asha.id ? stu.Asha.guardian : r.recipient_student_id === stu.Ravi.id ? stu.Ravi.guardian : stu.Sita.guardian)
      const v = r.variables as Record<string, string>
      expect(v.window_days).toBe('7')
      expect(Object.keys(v)).not.toContain('link') // made at send time
      expect(v.child).toMatch(/^(Asha|Ravi|Sita)$/) // first name only
      expect(v.score).toMatch(/^\d+(\.\d)?\/\d+(\.\d)?$/)
    }
    expect((await queueResultReady(db, schoolId, latestPaper, sectionId)).parents).toBe(0) // idempotent
    expect(await rows({ template: 'result_ready' })).toHaveLength(3)
  })

  it('worrying news (fell two tests in a row) goes to the class teacher ONLY, never to a parent', async () => {
    const att = await rows({ template: 'teacher_attention' })
    const sita = att.find((r) => (r.variables as Record<string, string>).child === 'Sita')
    expect(sita).toBeTruthy()
    expect(sita!.recipient_member_id).toBe(classTeacher)
    expect(sita!.audience).toBe('teacher')
    expect(att.every((r) => r.recipient_member_id === classTeacher && r.recipient_student_id === null)).toBe(true)
    // her parent still gets the ordinary result message, with nothing about a fall
    const parent = (await rows({ template: 'result_ready' })).find((r) => r.recipient_student_id === stu.Sita.id)!
    const text = JSON.stringify(parent.variables)
    expect(text).not.toMatch(/fell|fall|drop|dip|lower|declin|worr|behind|rank|level|beginner/i)
    expect(Object.keys(parent.variables as object).sort()).toEqual(['child', 'exam', 'practise_1', 'practise_2', 'school', 'score', 'strength', 'subject', 'window_days'])
  })

  it('no message is ever for another school: every recipient belongs to this school', async () => {
    const m = await rows()
    for (const r of m) {
      expect(r.school_id).toBe(schoolId)
      if (r.recipient_student_id) {
        const s = await db.selectFrom('school_students').select('school_id').where('id', '=', r.recipient_student_id).executeTakeFirstOrThrow()
        expect(s.school_id).toBe(schoolId)
      }
      if (r.recipient_member_id) {
        const s = await db.selectFrom('school_members').select('school_id').where('id', '=', r.recipient_member_id).executeTakeFirstOrThrow()
        expect(s.school_id).toBe(schoolId)
      }
    }
  })

  // ---------------------------------------------------------------- the dispatcher
  it('not connected: messages wait as "not sent" and nothing leaves', async () => {
    await freshen(TUE_10AM)
    const r = await dispatchDue(db, { ...deps(TUE_10AM), url: null, secret: null })
    expect(r.notSent).toBeGreaterThan(0)
    expect(calls).toHaveLength(0)
    const m = await rows()
    expect(m.every((x) => x.status === 'not_sent' && x.reason === 'messaging_not_connected')).toBe(true)
    // once connected they go (they are not lost)
    const again = await dispatchDue(db, deps(TUE_10AM))
    expect(again.sent).toBeGreaterThan(0)
  })

  it('what leaves is minimal: the allowed fields only, a signed request, a personal 7-day link', async () => {
    await clearMessages()
    await queueResultReady(db, schoolId, latestPaper, sectionId)
    await freshen(TUE_10AM)
    const r = await dispatchDue(db, deps(TUE_10AM, { limit: 100 }))
    const parentCalls = calls.filter((c) => c.body.template === 'result_ready_v1')
    expect(parentCalls).toHaveLength(3)
    expect(r.sent).toBe(calls.length)
    for (const c of parentCalls) {
      const b = c.body
      expect(Object.keys(b).sort()).toEqual(['channels', 'language', 'message_id', 'recipient', 'template', 'timestamp', 'variables'])
      expect(Object.keys(b.recipient).sort()).toEqual(['email', 'phone'])
      expect(b.channels).toEqual(['whatsapp'])
      expect(Object.keys(b.variables).sort()).toEqual([...templateDef('result_ready').vars].sort())
      expect(b.recipient.email).toBeNull()
      expect(b.recipient.phone).toMatch(/^\+9198000000/)
      const body = JSON.stringify(b)
      for (const other of ['Family', 'Parent', 'Ravi Family', 'image', 'answer_text', 'steps'])
        expect(body, other).not.toContain(other)
      // signed
      expect(c.url).toBe(URL)
      expect(c.headers['x-prepplan-signature']).toBe(signOutbound(SECRET, { timestamp: b.timestamp, messageId: b.message_id, template: b.template, recipient: b.recipient.phone }))
      // a personal link for exactly this child and this report, valid for 7 days
      const link = b.variables.link as string
      expect(link.startsWith('https://www.prepplan.in/p/')).toBe(true)
      const claims = verifyParentLink(link.split('/p/')[1], TUE_10AM)!
      expect(claims).toMatchObject({ s: schoolId, k: 'exam', r: latestPaper })
      expect(claims.exp * 1000 - TUE_10AM.getTime()).toBe(7 * 86_400_000)
      expect(b.variables.link_days).toBe('7')
    }
    const sent = await rows({ status: 'sent' })
    expect(sent.length).toBeGreaterThan(0)
    // the stored log never keeps the link
    expect(sent.every((x) => !Object.keys(x.variables as object).includes('link'))).toBe(true)
  })

  it('every template, as it leaves, carries exactly its own variables (payload snapshot)', async () => {
    await clearMessages()
    await queueResultReady(db, schoolId, latestPaper, sectionId)
    await queueWeeklyFocusForTest()
    await queueFlagsForTest()
    await queueUploadsForTest()
    await queueDisputeForTest()
    await queueMondayPulse(db, schoolId, MON_830AM)
    await freshen(TUE_10AM)
    await dispatchDue(db, deps(TUE_10AM, { limit: 200 }))
    const seen = new Set<string>()
    for (const c of calls) {
      const def = APPROVED_TEMPLATES.find((t) => t.metaName === c.body.template)!
      expect(def, c.body.template).toBeTruthy()
      seen.add(def.key)
      expect(Object.keys(c.body.variables).sort(), def.key).toEqual([...def.vars].sort())
      expect(Object.keys(c.body).sort()).toEqual(['channels', 'language', 'message_id', 'recipient', 'template', 'timestamp', 'variables'])
      if (def.audience !== 'parent') {
        expect(c.body.channels).toContain('email')
        expect(c.body.variables.link).toMatch(/^https:\/\/www\.prepplan\.in\/school\//)
      }
    }
    for (const k of ['result_ready', 'weekly_focus', 'flags_waiting', 'uploads_pending', 'dispute_closing', 'teacher_attention', 'monday_pulse']) expect(seen.has(k), `${k} was sent`).toBe(true)
  })

  async function queueWeeklyFocusForTest() {
    const { queueWeeklyFocus } = await import('./events')
    // the latest exam was released recently enough to count as "new this week"
    await db.updateTable('school_paper_releases').set({ released_at: new Date(SUN_630PM.getTime() - 2 * 86_400_000), locked_at: new Date(SUN_630PM.getTime() - 86_400_000) }).where('school_id', '=', schoolId).where('paper_id', '=', latestPaper).execute()
    return queueWeeklyFocus(db, schoolId, SUN_630PM)
  }
  async function queueFlagsForTest() {
    const mark = await db.selectFrom('school_answer_marks').select('id').where('school_id', '=', schoolId).where('school_student_id', '=', stu.Ravi.id).limit(1).executeTakeFirstOrThrow()
    await db.updateTable('school_answer_marks').set({ state: 'flagged' }).where('id', '=', mark.id).execute()
    return queueFlagsWaiting(db, schoolId, TUE_4PM)
  }
  async function queueUploadsForTest() {
    const cls = await db.selectFrom('school_sections').select('class_id').where('id', '=', sectionId).executeTakeFirstOrThrow()
    await db.insertInto('school_own_papers').values({ school_id: schoolId, class_id: cls.class_id, school_subject_id: schoolSubjectId, title: `Open Exam ${tag}`, source_kind: 'prepplan_exam', status: 'approved', phase: 'done', total_marks: '30', created_by_user_id: admin.userId, approved_at: new Date(), approved_by_user_id: admin.userId }).execute()
    return queueUploadsPending(db, schoolId, TUE_10AM)
  }
  async function queueDisputeForTest() {
    const mark = await db.selectFrom('school_answer_marks').select(['id', 'final_marks']).where('school_id', '=', schoolId).where('paper_id', '=', latestPaper).where('school_student_id', '=', stu.Ravi.id).limit(1).executeTakeFirstOrThrow()
    await db.updateTable('school_paper_releases').set({ locked_at: null, window_closes_at: new Date(TUE_10AM.getTime() + 12 * 3_600_000) }).where('school_id', '=', schoolId).where('paper_id', '=', latestPaper).execute()
    await db.insertInto('school_answer_disputes').values({ school_id: schoolId, answer_mark_id: mark.id, paper_id: latestPaper, school_student_id: stu.Ravi.id, reason: 'I wrote the steps', status: 'with_teacher', marks_before: mark.final_marks }).execute()
    return queueDisputeClosing(db, schoolId, TUE_10AM)
  }

  it('teacher events reach only the teachers of that section and subject', async () => {
    const flags = await rows({ template: 'flags_waiting' })
    expect(flags.map((f) => f.recipient_member_id)).toEqual([subjectTeacher]) // the assigned teacher, not the class teacher, not the principal
    expect((flags[0].variables as Record<string, string>).count).toBe('1')
    const uploads = await rows({ template: 'uploads_pending' })
    expect(uploads.map((f) => f.recipient_member_id)).toEqual([subjectTeacher])
    expect((uploads[0].variables as Record<string, string>).names).toContain('Asha')
    expect(JSON.stringify(uploads[0].variables)).not.toContain('Family')
    const dc = await rows({ template: 'dispute_closing' })
    expect(dc.map((f) => f.recipient_member_id)).toEqual([subjectTeacher])
    expect((dc[0].variables as Record<string, string>).count).toBe('1')
    const pulse = await rows({ template: 'monday_pulse' })
    expect(pulse.map((f) => f.recipient_member_id)).toEqual([principal])
    expect(pulse[0].audience).toBe('principal')
    expect(Object.keys(pulse[0].variables as object).sort()).toEqual(['improved', 'name', 'school', 'stuck', 'weak_1', 'weak_2', 'weak_3'])
  })

  it('the clock creates each scheduled event only inside its own window, once', async () => {
    await clearMessages()
    await db.updateTable('school_answer_marks').set({ state: 'ai_final' }).where('school_id', '=', schoolId).where('state', '=', 'flagged').execute()
    const none = await scheduleDue(db, at('2026-11-03T03:00'), schoolId) // Tue 03:00: nothing is due
    expect(Object.values(none).reduce((a, b) => a + b, 0)).toBe(0)
    expect((await scheduleDue(db, MON_830AM, schoolId)).monday_pulse).toBe(1)
    expect((await scheduleDue(db, MON_830AM, schoolId)).monday_pulse).toBe(0) // again: same day, same message
    expect((await scheduleDue(db, at('2026-11-03T08:30'), schoolId)).monday_pulse).toBe(0) // a Tuesday
    expect((await scheduleDue(db, TUE_10AM, schoolId)).uploads_pending).toBe(1)
    expect((await scheduleDue(db, at('2026-11-03T15:00'), schoolId)).uploads_pending).toBe(0) // past its four hours
  })

  it('weekly_focus is skipped when nothing new has been locked this week', async () => {
    await clearMessages()
    // the latest exam was released two days ago and its window has closed (locked): it is "new this week"
    await db.updateTable('school_paper_releases').set({ released_at: new Date(SUN_630PM.getTime() - 2 * 86_400_000), locked_at: new Date(SUN_630PM.getTime() - 86_400_000), window_closes_at: new Date(SUN_630PM.getTime() - 86_400_000) }).where('school_id', '=', schoolId).where('paper_id', '=', latestPaper).execute()
    const fresh = await scheduleDue(db, SUN_630PM, schoolId)
    expect(fresh.weekly_focus).toBeGreaterThan(0)
    const targets = (await rows({ template: 'weekly_focus' })).map((r) => r.recipient_student_id)
    expect(targets).not.toContain(stu.Meena.id)
    expect(targets).not.toContain(stu.Kiran.id)
    expect(targets).not.toContain(stu.Omar.id)
    const parent = (await rows({ template: 'weekly_focus' }))[0]
    expect(Object.keys(parent.variables as object).sort()).toEqual(['child', 'focus_1', 'focus_2', 'focus_3'])
    const later = new Date(SUN_630PM.getTime() + 21 * 86_400_000) // three Sundays on: the exam is no longer new
    expect((await scheduleDue(db, later, schoolId)).weekly_focus).toBe(0)
  })

  it('quiet hours: a parent message waits until 8 am; staff messages are not held', async () => {
    await clearMessages()
    await queueResultReady(db, schoolId, latestPaper, sectionId)
    await queueMondayPulse(db, schoolId, MON_830AM)
    await freshen(TUE_10PM)
    const night = await dispatchDue(db, deps(TUE_10PM, { limit: 100 }))
    expect(night.held).toBe(3)
    expect(calls.length).toBeGreaterThan(0)
    expect(calls.every((c) => c.body.template !== 'result_ready_v1')).toBe(true)
    expect(calls.map((c) => c.body.template)).toContain('monday_pulse_v1')
    const held = await rows({ status: 'held' })
    expect(held).toHaveLength(3)
    expect(held.every((h) => h.not_before.getTime() === at('2026-11-04T08:00').getTime() && h.attempts === 0)).toBe(true)
    // still night: nothing more; in the morning they go
    calls.length = 0
    await db.updateTable('school_messages').set({ created_at: new Date(WED_9AM.getTime() - 3_600_000) }).where('school_id', '=', schoolId).execute()
    expect((await dispatchDue(db, deps(at('2026-11-04T07:30')))).sent).toBe(0)
    expect((await dispatchDue(db, deps(WED_9AM, { limit: 100 }))).sent).toBe(3)
    expect(calls.every((c) => c.body.template === 'result_ready_v1')).toBe(true)
  })

  it('consent is checked again at send time: a STOP after queueing cancels the message', async () => {
    await clearMessages()
    await queueResultReady(db, schoolId, latestPaper, sectionId)
    await recordStopReply(db, '+919800000002') // Ravi's parent
    await freshen(TUE_10AM)
    await dispatchDue(db, deps(TUE_10AM, { limit: 100 }))
    const ravi = (await rows({ template: 'result_ready' })).find((r) => r.recipient_student_id === stu.Ravi.id)!
    expect(ravi).toMatchObject({ status: 'skipped', reason: 'parent_opted_out' })
    expect(calls.filter((c) => c.body.recipient.phone === '+919800000002')).toHaveLength(0)
    const asha = (await rows({ template: 'result_ready' })).find((r) => r.recipient_student_id === stu.Asha.id)!
    expect(asha.status).toBe('sent')
  })

  it('a school whose messaging switch is off sends nothing', async () => {
    await clearMessages()
    await queueResultReady(db, schoolId, latestPaper, sectionId)
    await db.updateTable('schools').set({ messaging_enabled: false }).where('id', '=', schoolId).execute()
    await freshen(TUE_10AM)
    const r = await dispatchDue(db, deps(TUE_10AM))
    expect(r).toMatchObject({ sent: 0, notSent: 0 })
    expect(calls).toHaveLength(0)
    expect((await rows()).every((m) => m.status === 'queued')).toBe(true)
    expect((await queueResultReady(db, schoolId, latestPaper, sectionId)).parents).toBe(0)
    await db.updateTable('schools').set({ messaging_enabled: true }).where('id', '=', schoolId).execute()
  })

  it('an old message is dropped, not sent late', async () => {
    await clearMessages()
    await queueMondayPulse(db, schoolId, MON_830AM)
    await db.updateTable('school_messages').set({ created_at: new Date(TUE_10AM.getTime() - 2 * 86_400_000), not_before: new Date(TUE_10AM.getTime() - 2 * 86_400_000) }).where('school_id', '=', schoolId).execute()
    await dispatchDue(db, deps(TUE_10AM))
    expect((await rows())[0]).toMatchObject({ status: 'skipped', reason: 'expired' })
    expect(calls).toHaveLength(0)
  })

  // ---------------------------------------------------------------- webhook down
  it('webhook down: retries with backoff three times, then fails; the message is never lost on the way', async () => {
    await clearMessages()
    await queueMondayPulse(db, schoolId, MON_830AM)
    await freshen(TUE_10AM)
    mode = 'down'
    let now = TUE_10AM
    for (let attempt = 1; attempt < MAX_ATTEMPTS; attempt++) {
      const r = await dispatchDue(db, deps(now))
      expect(r.retry).toBe(1)
      const m = (await rows())[0]
      expect(m).toMatchObject({ status: 'queued', attempts: attempt, reason: 'webhook_unreachable' })
      expect(m.not_before.getTime()).toBe(now.getTime() + BACKOFF_MINUTES[attempt - 1] * 60_000)
      // not yet due: nothing happens
      const before = calls.length
      await dispatchDue(db, deps(new Date(now.getTime() + 60_000)))
      expect(calls.length).toBe(before)
      now = new Date(m.not_before.getTime() + 1000)
      await db.updateTable('school_messages').set({ created_at: new Date(now.getTime() - 3_600_000) }).where('school_id', '=', schoolId).execute()
    }
    const last = await dispatchDue(db, deps(now))
    expect(last.failed).toBe(1)
    expect((await rows())[0]).toMatchObject({ status: 'failed', attempts: MAX_ATTEMPTS, reason: 'webhook_unreachable' })
    const events = await db.selectFrom('school_message_events').select('status').where('school_id', '=', schoolId).orderBy('created_at').execute()
    expect(events.map((e) => e.status)).toEqual(['queued', 'queued', 'queued', 'queued', 'failed'])
    expect(calls).toHaveLength(MAX_ATTEMPTS)
  })

  it('a webhook that answers with an error is retried the same way', async () => {
    await clearMessages()
    await queueMondayPulse(db, schoolId, MON_830AM)
    await freshen(TUE_10AM)
    mode = 'http500'
    await dispatchDue(db, deps(TUE_10AM))
    expect((await rows())[0]).toMatchObject({ status: 'queued', reason: 'webhook_500', attempts: 1 })
  })

  it('the release still works when messaging breaks: the hook never throws', async () => {
    vi.resetModules()
    vi.doMock('./events', () => ({ queueResultReady: () => Promise.reject(new Error('boom')) }))
    const err = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const { messageParents: guarded } = await import('../results-release')
    await expect(guarded(db, schoolId, latestPaper, sectionId)).resolves.toBeUndefined()
    expect(err).toHaveBeenCalled()
    err.mockRestore()
    vi.doUnmock('./events')
    vi.resetModules()
    // and with messaging not connected at all, the real hook also returns normally
    await expect(messageParents(db, schoolId, latestPaper, sectionId)).resolves.toBeUndefined()
  })

  // ---------------------------------------------------------------- the callback
  describe('callback from Make', () => {
    const nowS = () => Math.floor(Date.now() / 1000)
    const status = (id: string, s: string, ts = nowS(), secret = SECRET, extra: Record<string, unknown> = {}) => ({ message_id: id, status: s, timestamp: ts, signature: statusSignature(secret, ts, id, s), ...extra })
    let id = ''
    beforeAll(async () => {
      await clearMessages()
      await queueMondayPulse(db, schoolId, MON_830AM)
      id = (await rows())[0].id
      await db.updateTable('school_messages').set({ status: 'sent' }).where('id', '=', id).execute()
    })

    it('rejects a wrong signature, a stale timestamp, an unknown id and a missing secret, all the same way', async () => {
      const bad = [
        status(id, 'delivered', nowS(), 'wrong-secret-0123456789abcdef'),
        status(id, 'delivered', nowS() - 3600),
        status('00000000-0000-4000-8000-000000000000', 'delivered'),
        { ...status(id, 'delivered'), status: 'read' }, // signed for another status
        { message_id: id, status: 'delivered' },
        null,
        'x',
      ]
      for (const b of bad) expect(await handleCallback(db, b, new Date(), SECRET), JSON.stringify(b)).toMatchObject({ ok: false })
      expect(await handleCallback(db, status(id, 'delivered'), new Date(), null)).toMatchObject({ ok: false, reason: 'unauthorised' })
      expect((await rows())[0].status).toBe('sent')
    })

    it('moves forward only; late or repeated callbacks change nothing', async () => {
      expect(await handleCallback(db, status(id, 'delivered'), new Date(), SECRET)).toEqual({ ok: true, effect: 'status' })
      expect(await handleCallback(db, status(id, 'read'), new Date(), SECRET)).toEqual({ ok: true, effect: 'status' })
      expect(await handleCallback(db, status(id, 'delivered'), new Date(), SECRET)).toEqual({ ok: true, effect: 'ignored' })
      expect(await handleCallback(db, status(id, 'read'), new Date(), SECRET)).toEqual({ ok: true, effect: 'ignored' })
      expect(await handleCallback(db, status(id, 'failed'), new Date(), SECRET)).toEqual({ ok: true, effect: 'ignored' }) // already read
      expect((await rows())[0].status).toBe('read')
      const ev = await db.selectFrom('school_message_events').select('status').where('message_id', '=', id).orderBy('created_at').execute()
      expect(ev.map((e) => e.status)).toEqual(['queued', 'delivered', 'read'])
    })

    it('records a failure with its reason; an unknown status is a bad request', async () => {
      await db.updateTable('school_messages').set({ status: 'sent' }).where('id', '=', id).execute()
      expect(await handleCallback(db, status(id, 'failed', nowS(), SECRET, { reason: 'number not on WhatsApp' }), new Date(), SECRET)).toEqual({ ok: true, effect: 'status' })
      expect((await rows())[0]).toMatchObject({ status: 'failed', reason: 'number not on WhatsApp' })
      expect(await handleCallback(db, status(id, 'exploded'), new Date(), SECRET)).toMatchObject({ ok: false, reason: 'bad_request' })
    })

    it('an inbound STOP opts the parent out; other words are ignored; a bad signature does nothing', async () => {
      const phone = '+919800000004' // Kiran's parent
      const inbound = (text: string, secret = SECRET) => {
        const ts = nowS()
        return { type: 'inbound', phone, text, timestamp: ts, signature: inboundSignature(secret, ts, phone) }
      }
      expect(await handleCallback(db, inbound('STOP', 'wrong-secret-0123456789abcdef'), new Date(), SECRET)).toMatchObject({ ok: false })
      expect(await handleCallback(db, inbound('thanks'), new Date(), SECRET)).toEqual({ ok: true, effect: 'ignored' })
      expect(await handleCallback(db, inbound('Please stop calling'), new Date(), SECRET)).toEqual({ ok: true, effect: 'ignored' })
      const r = await handleCallback(db, inbound(' Stop. '), new Date(), SECRET)
      expect(r).toMatchObject({ ok: true, effect: 'stop' })
      const pm = await db.selectFrom('school_parent_messaging').select(['opted_out_how', 'whatsapp_ok']).where('school_student_id', '=', stu.Kiran.id).executeTakeFirstOrThrow()
      expect(pm).toEqual({ opted_out_how: 'stop_reply', whatsapp_ok: false })
    })
  })

  // ---------------------------------------------------------------- retention
  it('after the retention period the variables are removed and only counts remain', async () => {
    await clearMessages()
    await queueMondayPulse(db, schoolId, MON_830AM)
    await queueResultReady(db, schoolId, latestPaper, sectionId)
    const total = (await rows()).length
    await db.updateTable('school_messages').set({ created_at: new Date(Date.now() - 400 * 86_400_000) }).where('school_id', '=', schoolId).execute()
    const purged = await purgeMessageLogs(db, new Date())
    expect(purged).toBeGreaterThanOrEqual(total)
    const after = await rows()
    expect(after).toHaveLength(total) // nothing is deleted
    expect(after.every((m) => m.variables === null && m.variables_purged_at !== null)).toBe(true)
    const counts = await db.selectFrom('school_message_counts').select(['template', 'status', 'count']).where('school_id', '=', schoolId).execute()
    expect(counts.reduce((a, c) => a + c.count, 0)).toBe(total)
    expect(await purgeMessageLogs(db, new Date())).toBe(0) // once only
  })
})
