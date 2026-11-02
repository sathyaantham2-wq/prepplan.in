import type { Db } from '../../../db/connection'
import type { SchoolScope } from '../../../db/school-scope'
import { SchoolError, assertAdmin, auditSchool } from '../common'
import { firstName } from './content'
import { weekStart } from './ist'

// What the message log shows each role (plan section 5). The office sees every message of the school; a teacher
// sees only the messages to herself and the parent messages of the sections she teaches or is class teacher of;
// the principal sees the school summary only, no student-level rows. Nothing here sends anything.

const SENT = ['sent', 'delivered', 'read']
const WAITING = ['queued', 'held', 'sending']

export interface LogRow {
  id: string
  template: string
  audience: string
  status: string
  reason: string | null
  language: string
  recipient: string
  section: string | null
  createdAt: string
  sentAt: string | null
  attempts: number
}

export interface MessagingOverview {
  role: string
  messagingOn: boolean
  summary: { sent: number; delivered: number; failed: number; notSent: number; waiting: number; skipped: number }
  byTemplate: Array<{ template: string; sent: number; failed: number }>
  optedOut: number
  rows: Array<LogRow> | null
}

const HANDLES = new Set(['school_admin', 'principal', 'teacher'])

export async function messagingOverview(db: Db, scope: SchoolScope, now = new Date()): Promise<MessagingOverview> {
  if (!HANDLES.has(scope.role)) throw new SchoolError('forbidden', 'This is for the school office and teachers.')
  const school = await db.selectFrom('schools').select('messaging_enabled').where('id', '=', scope.schoolId).executeTakeFirstOrThrow()
  const since = weekStart(now)
  const rows = await db
    .selectFrom('school_messages as m')
    .leftJoin('school_students as st', 'st.id', 'm.recipient_student_id')
    .leftJoin('school_members as sm', 'sm.id', 'm.recipient_member_id')
    .leftJoin('users as su', 'su.id', 'sm.user_id')
    .leftJoin('school_members as stm', 'stm.id', 'st.member_id')
    .leftJoin('users as stu', 'stu.id', 'stm.user_id')
    .leftJoin('school_sections as sec', 'sec.id', 'st.section_id')
    .leftJoin('school_classes as c', 'c.id', 'sec.class_id')
    .select([
      'm.id', 'm.template', 'm.audience', 'm.status', 'm.reason', 'm.language', 'm.created_at', 'm.sent_at', 'm.attempts',
      'm.recipient_member_id', 'st.section_id', 'su.name as staff_name', 'stu.name as student_name', 'sec.name as section_name', 'c.grade',
    ])
    .where('m.school_id', '=', scope.schoolId)
    .where('m.created_at', '>=', new Date(since.getTime() - 7 * 86_400_000))
    .orderBy('m.created_at', 'desc')
    .limit(1000)
    .execute()

  let visible = rows
  if (scope.role === 'teacher') {
    const me = await db.selectFrom('school_members').select('id').where('school_id', '=', scope.schoolId).where('user_id', '=', scope.userId).executeTakeFirst()
    const mine = new Set(scope.pairs === 'all' ? [] : scope.pairs.map((p) => p.sectionId))
    if (me) {
      const ct = await db.selectFrom('school_sections').select('id').where('school_id', '=', scope.schoolId).where('class_teacher_member_id', '=', me.id).execute()
      for (const s of ct) mine.add(s.id)
    }
    visible = rows.filter((r) => (r.audience === 'parent' ? r.section_id !== null && mine.has(r.section_id) : me !== undefined && r.recipient_member_id === me.id))
  }

  const thisWeek = visible.filter((r) => r.created_at >= since)
  const count = (set: ReadonlyArray<string>) => thisWeek.filter((r) => set.includes(r.status)).length
  const summary = {
    sent: count(SENT),
    delivered: count(['delivered', 'read']),
    failed: count(['failed']),
    notSent: count(['not_sent']),
    waiting: count(WAITING),
    skipped: count(['skipped']),
  }
  const templates = [...new Set(thisWeek.map((r) => r.template))].sort()
  const byTemplate = templates.map((t) => ({
    template: t,
    sent: thisWeek.filter((r) => r.template === t && SENT.includes(r.status)).length,
    failed: thisWeek.filter((r) => r.template === t && r.status === 'failed').length,
  }))
  const out = await db
    .selectFrom('school_parent_messaging')
    .select((eb) => eb.fn.countAll<string>().as('n'))
    .where('school_id', '=', scope.schoolId)
    .where('opted_out_at', 'is not', null)
    .executeTakeFirstOrThrow()

  const list: Array<LogRow> | null =
    scope.role === 'principal'
      ? null
      : visible.slice(0, 200).map((r) => ({
          id: r.id,
          template: r.template,
          audience: r.audience,
          status: r.status,
          reason: r.reason,
          language: r.language,
          recipient: r.audience === 'parent' ? `${firstName(r.student_name ?? '')}'s parent` : (r.staff_name ?? ''),
          section: r.grade !== null && r.section_name !== null ? `${r.grade}${r.section_name}` : null,
          createdAt: r.created_at.toISOString(),
          sentAt: r.sent_at ? r.sent_at.toISOString() : null,
          attempts: r.attempts,
        }))
  return { role: scope.role, messagingOn: school.messaging_enabled, summary, byTemplate, optedOut: Number(out.n), rows: list }
}

/** The office puts a failed or "not sent" message back in the queue (it is sent at the next run, if consent still stands). */
export async function retryMessage(db: Db, scope: SchoolScope, messageId: string, now = new Date()): Promise<void> {
  assertAdmin(scope)
  const m = await db.selectFrom('school_messages').select(['id', 'status']).where('school_id', '=', scope.schoolId).where('id', '=', messageId).executeTakeFirst()
  if (!m) throw new SchoolError('not_found', 'We could not find that message.')
  if (m.status !== 'failed' && m.status !== 'not_sent')
    throw new SchoolError('conflict', 'Only a message that failed or was not sent can be tried again.')
  await db
    .updateTable('school_messages')
    .set({ status: 'queued', reason: null, attempts: 0, not_before: now, next_attempt_at: null })
    .where('school_id', '=', scope.schoolId)
    .where('id', '=', m.id)
    .execute()
  await db.insertInto('school_message_events').values({ school_id: scope.schoolId, message_id: m.id, status: 'queued', detail: 'retry_by_office' }).execute()
  await auditSchool(db, scope, 'school.message_retried', 'school_messages', m.id, { status: m.status }, { status: 'queued' })
}

export interface MessagingSettings {
  messagingOn: boolean
  weeklyLimit: number | null
  logDays: number
}

export async function messagingSettings(db: Db, scope: SchoolScope): Promise<MessagingSettings> {
  if (scope.role !== 'school_admin' && scope.role !== 'principal')
    throw new SchoolError('forbidden', 'Only the principal and the school office can see these settings.')
  const s = await db.selectFrom('schools').select(['messaging_enabled', 'parent_weekly_limit', 'message_log_days']).where('id', '=', scope.schoolId).executeTakeFirstOrThrow()
  return { messagingOn: s.messaging_enabled, weeklyLimit: s.parent_weekly_limit, logDays: s.message_log_days }
}

/** The principal (or the office) sets the weekly limit per child (empty = none) and how long the message log is kept. */
export async function saveMessagingSettings(
  db: Db,
  scope: SchoolScope,
  input: { weeklyLimit: number | null; logDays: number },
): Promise<void> {
  if (scope.role !== 'school_admin' && scope.role !== 'principal')
    throw new SchoolError('forbidden', 'Only the principal and the school office can change these settings.')
  const { weeklyLimit, logDays } = input
  if (weeklyLimit !== null && (!Number.isInteger(weeklyLimit) || weeklyLimit < 1 || weeklyLimit > 14))
    throw new SchoolError('invalid', 'The weekly limit is a number from 1 to 14, or empty for no limit.')
  if (!Number.isInteger(logDays) || logDays < 30 || logDays > 1830)
    throw new SchoolError('invalid', 'Keep the message log for 30 to 1830 days.')
  const before = await messagingSettings(db, scope)
  await db.updateTable('schools').set({ parent_weekly_limit: weeklyLimit, message_log_days: logDays }).where('id', '=', scope.schoolId).execute()
  await auditSchool(db, scope, 'school.messaging_settings', 'schools', scope.schoolId, { weeklyLimit: before.weeklyLimit, logDays: before.logDays }, { weeklyLimit, logDays })
}
