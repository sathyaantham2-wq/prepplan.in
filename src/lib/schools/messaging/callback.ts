import type { Db } from '../../../db/connection'
import { env } from '../../env'
import { recordStopReply } from './permissions'
import { inboundSignature, signatureOk, statusSignature } from './signing'

// What Make tells PrepPlan (plan section 4): a delivery status for one message, or a parent's inbound reply. Both are
// signed with the shared secret and refused when the signature is wrong or the timestamp is more than five minutes
// off. Statuses only move forward ("read" is never overwritten by a late "delivered"); repeated callbacks are
// harmless. A reply that is exactly STOP (any case, with or without a full stop) opts that number out everywhere.

export type CallbackResult =
  | { ok: true; effect: 'status' | 'ignored' | 'stop'; covered?: number }
  | { ok: false; reason: 'unauthorised' | 'bad_request' }

const RANK: Record<string, number> = { queued: 0, held: 0, not_sent: 0, sending: 1, sent: 2, delivered: 3, read: 4 }
const STATUSES = new Set(['sent', 'delivered', 'read', 'failed'])

export const isStop = (text: unknown): boolean =>
  typeof text === 'string' && /^\s*stop\s*[.!]?\s*$/i.test(text)

export async function handleCallback(db: Db, body: unknown, now = new Date(), secret: string | null = env.MAKE_MESSAGING_SECRET ?? null): Promise<CallbackResult> {
  if (!secret) return { ok: false, reason: 'unauthorised' }
  if (!body || typeof body !== 'object') return { ok: false, reason: 'bad_request' }
  const b = body as Record<string, unknown>
  const nowS = Math.floor(now.getTime() / 1000)
  if (b.type === 'inbound') {
    if (typeof b.phone !== 'string' || typeof b.timestamp !== 'number')
      return { ok: false, reason: 'unauthorised' }
    if (!signatureOk(inboundSignature(secret, b.timestamp, b.phone), b.signature, b.timestamp, nowS))
      return { ok: false, reason: 'unauthorised' }
    if (!isStop(b.text)) return { ok: true, effect: 'ignored' }
    return { ok: true, effect: 'stop', covered: await recordStopReply(db, b.phone, now) }
  }
  if (typeof b.message_id !== 'string' || typeof b.status !== 'string' || typeof b.timestamp !== 'number')
    return { ok: false, reason: 'unauthorised' }
  if (!signatureOk(statusSignature(secret, b.timestamp, b.message_id, b.status), b.signature, b.timestamp, nowS))
    return { ok: false, reason: 'unauthorised' }
  if (!STATUSES.has(b.status)) return { ok: false, reason: 'bad_request' }
  const m = await db
    .selectFrom('school_messages')
    .select(['id', 'school_id', 'status'])
    .where('id', '=', b.message_id)
    .executeTakeFirst()
  if (!m) return { ok: false, reason: 'unauthorised' } // an unknown id looks exactly like a bad signature
  const reason = typeof b.reason === 'string' ? b.reason.slice(0, 200) : null
  const next = b.status
  const move =
    next === 'failed'
      ? m.status !== 'failed' && (RANK[m.status] ?? 0) < RANK.delivered
      : (RANK[next] ?? 0) > (RANK[m.status] ?? 0)
  if (!move) return { ok: true, effect: 'ignored' }
  await db
    .updateTable('school_messages')
    .set({ status: next, reason: next === 'failed' ? (reason ?? 'delivery_failed') : null })
    .where('school_id', '=', m.school_id)
    .where('id', '=', m.id)
    .execute()
  await db.insertInto('school_message_events').values({ school_id: m.school_id, message_id: m.id, status: next, detail: reason }).execute()
  return { ok: true, effect: 'status' }
}
