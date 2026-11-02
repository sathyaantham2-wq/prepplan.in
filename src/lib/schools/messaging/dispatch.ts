import type { Db } from '../../../db/connection'
import { env } from '../../env'
import { inQuietHours, nextMondayMorning, nextQuietEnd, weekStart } from './ist'
import { issueParentLink, LINK_DAYS, parentLinkUrl } from './link-token'
import { isPhoneOptedOut } from './permissions'
import { signOutbound } from './signing'
import { templateDef } from './templates'
import type { Lang, TemplateDef } from './templates'

// The dispatcher: the only code that moves a message out of "queued" (plan sections 4 and 7). PrepPlan decides
// WHAT and to WHOM when it queues a message; here it decides WHETHER now (consent, quiet hours, the school's switch)
// and hands ONE small signed request per message to Make, which only delivers. It never throws into the caller: a
// webhook that is down, slow or not configured leaves the message queued / "not sent", and the action that caused it
// (releasing results, say) has already succeeded.

export const MAX_ATTEMPTS = 4 // the first try and three retries
export const BACKOFF_MINUTES = [5, 30, 120]
const WEBHOOK_TIMEOUT_MS = 10_000
const LEASE_MS = 5 * 60_000
const PARENT_MAX_AGE_MS = 3 * 86_400_000
const STAFF_MAX_AGE_MS = 86_400_000

export interface DispatchDeps {
  fetchImpl?: typeof fetch
  url?: string | null
  secret?: string | null
  appUrl?: string
  now?: Date
  /** Stop starting new messages after this many milliseconds (an immediate send after a release must not hold the teacher up). */
  budgetMs?: number
  limit?: number
  schoolId?: string
}

export interface DispatchResult {
  sent: number
  failed: number
  retry: number
  held: number
  notSent: number
  skipped: number
}

async function logEvent(db: Db, schoolId: string, messageId: string, status: string, detail: string | null) {
  await db.insertInto('school_message_events').values({ school_id: schoolId, message_id: messageId, status, detail }).execute()
}

type Row = Awaited<ReturnType<typeof claim>>[number]

/** Takes due messages for this run. A message already "sending" whose lease ran out (a crashed run) is taken again. */
async function claim(db: Db, now: Date, limit: number, schoolId?: string) {
  return db.transaction().execute(async (trx) => {
    const ids = await trx
      .selectFrom('school_messages as m')
      .innerJoin('schools as s', 's.id', 'm.school_id')
      .select('m.id')
      .where('s.messaging_enabled', '=', true)
      .$if(schoolId !== undefined, (q) => q.where('m.school_id', '=', schoolId!))
      .where((eb) =>
        eb.or([
          eb.and([eb('m.status', 'in', ['queued', 'held', 'not_sent']), eb('m.not_before', '<=', now)]),
          eb.and([eb('m.status', '=', 'sending'), eb('m.next_attempt_at', '<=', now)]),
        ]),
      )
      .orderBy('m.created_at')
      .limit(limit)
      .forUpdate('m')
      .skipLocked()
      .execute()
    if (ids.length === 0) return []
    return trx
      .updateTable('school_messages')
      .set({ status: 'sending', next_attempt_at: new Date(now.getTime() + LEASE_MS) })
      .where('id', 'in', ids.map((i) => i.id))
      .returningAll()
      .execute()
  })
}

async function finish(db: Db, m: Row, status: string, reason: string | null, extra: Record<string, unknown> = {}) {
  await db
    .updateTable('school_messages')
    .set({ status, reason, next_attempt_at: null, ...extra })
    .where('school_id', '=', m.school_id)
    .where('id', '=', m.id)
    .execute()
  await logEvent(db, m.school_id, m.id, status, reason)
}

interface Target {
  phone: string | null
  email: string | null
  channels: Array<'whatsapp' | 'email'>
}

/** Who this message is for, and whether she may be messaged now. Returns a skip reason instead when she may not. */
async function targetOf(db: Db, m: Row): Promise<{ target: Target } | { skip: string }> {
  if (m.audience === 'parent') {
    const student = await db
      .selectFrom('school_students')
      .select('status')
      .where('school_id', '=', m.school_id)
      .where('id', '=', m.recipient_student_id!)
      .executeTakeFirst()
    if (!student || student.status !== 'active') return { skip: 'student_not_active' }
    const g = await db
      .selectFrom('school_student_guardians')
      .select('phone_e164')
      .where('school_id', '=', m.school_id)
      .where('id', '=', m.recipient_guardian_id!)
      .where('school_student_id', '=', m.recipient_student_id!)
      .executeTakeFirst()
    if (!g) return { skip: 'no_parent_phone' }
    const perm = await db
      .selectFrom('school_parent_messaging')
      .select(['whatsapp_ok', 'opted_out_at'])
      .where('school_id', '=', m.school_id)
      .where('school_student_id', '=', m.recipient_student_id!)
      .executeTakeFirst()
    if (perm?.opted_out_at || (await isPhoneOptedOut(db, g.phone_e164))) return { skip: 'parent_opted_out' }
    if (!perm?.whatsapp_ok) return { skip: 'no_permission' }
    return { target: { phone: g.phone_e164, email: null, channels: ['whatsapp'] } }
  }
  const mem = await db
    .selectFrom('school_members as sm')
    .innerJoin('users as u', 'u.id', 'sm.user_id')
    .select(['sm.status', 'sm.phone_e164', 'u.email'])
    .where('sm.school_id', '=', m.school_id)
    .where('sm.id', '=', m.recipient_member_id!)
    .executeTakeFirst()
  if (!mem || mem.status !== 'active') return { skip: 'recipient_not_active' }
  return {
    target: {
      phone: mem.phone_e164,
      email: mem.email,
      channels: mem.phone_e164 ? ['whatsapp', 'email'] : ['email'],
    },
  }
}

/** The address a staff message's link opens. Staff sign in as usual; nothing about a student is in the address. */
export function staffLink(def: TemplateDef, schoolId: string, paperId: string | null, base: string): string {
  const root = `${base.replace(/\/$/, '')}/school/${schoolId}`
  switch (def.key) {
    case 'uploads_pending':
    case 'dispute_closing':
      return paperId ? `${root}/own-papers/${paperId}` : `${root}/own-papers`
    case 'flags_waiting':
      return `${root}/own-papers`
    default:
      return `${root}/class-progress`
  }
}

/** The whole request body for one message: only the template's variables and the minimum to deliver them. */
export function buildPayload(
  def: TemplateDef,
  m: { id: string; language: string },
  variables: Record<string, string>,
  target: Target,
  timestamp: number,
) {
  return {
    message_id: m.id,
    template: def.metaName,
    language: m.language as Lang,
    channels: target.channels,
    recipient: { phone: target.phone, email: target.email },
    variables,
    timestamp,
  }
}

async function process(db: Db, m: Row, deps: Required<Pick<DispatchDeps, 'now' | 'appUrl'>> & DispatchDeps, res: DispatchResult) {
  const now = deps.now
  const def = templateDef(m.template)
  const age = now.getTime() - m.created_at.getTime()
  if (age > (m.audience === 'parent' ? PARENT_MAX_AGE_MS : STAFF_MAX_AGE_MS)) {
    res.skipped += 1
    return finish(db, m, 'skipped', 'expired')
  }
  const who = await targetOf(db, m)
  if ('skip' in who) {
    res.skipped += 1
    return finish(db, m, 'skipped', who.skip)
  }
  if (m.audience === 'parent') {
    // the principal's own weekly limit per child (none unless he sets one)
    const limit = (await db.selectFrom('schools').select('parent_weekly_limit').where('id', '=', m.school_id).executeTakeFirstOrThrow()).parent_weekly_limit
    if (limit !== null) {
      const row = await db
        .selectFrom('school_messages')
        .select((eb) => eb.fn.countAll<string>().as('n'))
        .where('school_id', '=', m.school_id)
        .where('recipient_student_id', '=', m.recipient_student_id!)
        .where('audience', '=', 'parent')
        .where('status', 'in', ['sent', 'delivered', 'read'])
        .where('sent_at', '>=', weekStart(now))
        .where('id', '!=', m.id)
        .executeTakeFirstOrThrow()
      if (Number(row.n) >= limit) {
        if (def.key === 'weekly_focus') {
          // a reminder yields to the limit; results are never lost, they wait for next Monday
          res.skipped += 1
          return finish(db, m, 'skipped', 'weekly_limit')
        }
        res.held += 1
        await db
          .updateTable('school_messages')
          .set({ status: 'held', reason: 'weekly_limit', not_before: nextMondayMorning(now), next_attempt_at: null })
          .where('school_id', '=', m.school_id)
          .where('id', '=', m.id)
          .execute()
        return logEvent(db, m.school_id, m.id, 'held', 'weekly_limit')
      }
    }
  }
  if (m.audience === 'parent' && inQuietHours(now)) {
    res.held += 1
    await db
      .updateTable('school_messages')
      .set({ status: 'held', reason: 'quiet_hours', not_before: nextQuietEnd(now), next_attempt_at: null })
      .where('school_id', '=', m.school_id)
      .where('id', '=', m.id)
      .execute()
    return logEvent(db, m.school_id, m.id, 'held', 'quiet_hours')
  }
  const variables = { ...((m.variables ?? {}) as Record<string, string>) }
  if (def.vars.includes('link')) {
    if (def.audience === 'parent') {
      const link = issueParentLink(
        { schoolId: m.school_id, studentId: m.recipient_student_id!, kind: def.key === 'result_ready' ? 'exam' : 'focus', paperId: m.ref_paper_id },
        now,
      )
      variables.link = parentLinkUrl(link.token, deps.appUrl)
      variables.link_days = String(LINK_DAYS)
    } else variables.link = staffLink(def, m.school_id, m.ref_paper_id, deps.appUrl)
  }
  const missing = def.vars.filter((v) => !variables[v])
  if (missing.length > 0) {
    res.failed += 1
    return finish(db, m, 'failed', `missing_variables:${missing.join(',')}`)
  }
  // nothing outside the template's own variables ever leaves
  for (const k of Object.keys(variables)) if (!def.vars.includes(k)) delete variables[k]
  const timestamp = Math.floor(now.getTime() / 1000)
  const body = buildPayload(def, m, variables, who.target, timestamp)
  const recipient = who.target.phone ?? who.target.email ?? ''
  const signature = signOutbound(deps.secret!, { timestamp, messageId: m.id, template: body.template, recipient })
  const attempts = m.attempts + 1
  let error: string | null = null
  try {
    const ctl = new AbortController()
    const timer = setTimeout(() => ctl.abort(), WEBHOOK_TIMEOUT_MS)
    try {
      const r = await (deps.fetchImpl ?? fetch)(deps.url!, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-prepplan-signature': signature, 'x-prepplan-timestamp': String(timestamp) },
        body: JSON.stringify(body),
        signal: ctl.signal,
      })
      if (!r.ok) error = `webhook_${r.status}`
    } finally {
      clearTimeout(timer)
    }
  } catch (e) {
    error = e instanceof Error && e.name === 'AbortError' ? 'webhook_timeout' : 'webhook_unreachable'
  }
  if (!error) {
    res.sent += 1
    return finish(db, m, 'sent', null, { attempts, sent_at: now })
  }
  if (attempts >= MAX_ATTEMPTS) {
    res.failed += 1
    return finish(db, m, 'failed', error, { attempts })
  }
  res.retry += 1
  const wait = BACKOFF_MINUTES[attempts - 1] * 60_000
  await db
    .updateTable('school_messages')
    .set({ status: 'queued', reason: error, attempts, not_before: new Date(now.getTime() + wait), next_attempt_at: null })
    .where('school_id', '=', m.school_id)
    .where('id', '=', m.id)
    .execute()
  return logEvent(db, m.school_id, m.id, 'queued', `retry_${attempts}:${error}`)
}

/** Sends what is due. Safe to run often and in parallel; never throws. */
export async function dispatchDue(db: Db, deps: DispatchDeps = {}): Promise<DispatchResult> {
  const res: DispatchResult = { sent: 0, failed: 0, retry: 0, held: 0, notSent: 0, skipped: 0 }
  try {
    const now = deps.now ?? new Date()
    const url = deps.url === undefined ? (env.MAKE_MESSAGING_WEBHOOK_URL ?? null) : deps.url
    const secret = deps.secret === undefined ? (env.MAKE_MESSAGING_SECRET ?? null) : deps.secret
    const limit = deps.limit ?? 50
    if (!url || !secret) {
      // messaging is not connected: queued messages are shown to the office as "not sent"; nothing else happens
      const waiting = await db
        .selectFrom('school_messages as m')
        .innerJoin('schools as s', 's.id', 'm.school_id')
        .select(['m.id', 'm.school_id'])
        .where('s.messaging_enabled', '=', true)
        .where('m.status', 'in', ['queued', 'held'])
        .where('m.not_before', '<=', now)
        .$if(deps.schoolId !== undefined, (q) => q.where('m.school_id', '=', deps.schoolId!))
        .limit(500)
        .execute()
      for (const w of waiting) {
        await db.updateTable('school_messages').set({ status: 'not_sent', reason: 'messaging_not_connected' }).where('school_id', '=', w.school_id).where('id', '=', w.id).execute()
        await logEvent(db, w.school_id, w.id, 'not_sent', 'messaging_not_connected')
      }
      res.notSent = waiting.length
      return res
    }
    const started = Date.now()
    const rows = await claim(db, now, limit, deps.schoolId)
    const full = { ...deps, now, appUrl: deps.appUrl ?? env.BETTER_AUTH_URL, url, secret }
    for (const m of rows) {
      if (deps.budgetMs !== undefined && Date.now() - started > deps.budgetMs) {
        // out of time: give the rest back untouched for the next run
        await db.updateTable('school_messages').set({ status: 'queued', next_attempt_at: null }).where('school_id', '=', m.school_id).where('id', '=', m.id).execute()
        continue
      }
      try {
        await process(db, m, full, res)
      } catch (e) {
        console.error('school message dispatch failed', m.id, e)
        await db.updateTable('school_messages').set({ status: 'queued', reason: 'dispatch_error', next_attempt_at: new Date(now.getTime() + 5 * 60_000) }).where('school_id', '=', m.school_id).where('id', '=', m.id).execute()
      }
    }
  } catch (e) {
    console.error('school message dispatch run failed', e)
  }
  return res
}

