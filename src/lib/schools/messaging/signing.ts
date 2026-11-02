import { createHmac, timingSafeEqual } from 'node:crypto'

// The shared-secret signature between PrepPlan and Make (plan section 4). It signs a short canonical STRING, not the
// raw body, because Make parses the JSON and cannot see the raw body; Make can rebuild the same string from the
// parsed fields with its sha256(text; hex; key) function. The timestamp is part of it, and a message older than
// five minutes is refused (replay).

export const MAX_SKEW_SECONDS = 300

export function sign(secret: string, parts: ReadonlyArray<string | number>): string {
  return createHmac('sha256', secret).update(parts.join('.')).digest('hex')
}

/** The signature of an outbound message: timestamp.message_id.template.recipient */
export function signOutbound(secret: string, m: { timestamp: number; messageId: string; template: string; recipient: string }): string {
  return sign(secret, [m.timestamp, m.messageId, m.template, m.recipient])
}

/** The signature Make puts on a delivery status: timestamp.message_id.status */
export function statusSignature(secret: string, timestamp: number, messageId: string, status: string): string {
  return sign(secret, [timestamp, messageId, status])
}

/** The signature Make puts on a parent's inbound reply: timestamp.phone.inbound */
export function inboundSignature(secret: string, timestamp: number, phone: string): string {
  return sign(secret, [timestamp, phone, 'inbound'])
}

/** Constant-time comparison; also false for a wrong length or a stale/future timestamp. */
export function signatureOk(expected: string, given: unknown, timestamp: unknown, nowSeconds: number): boolean {
  if (typeof given !== 'string' || typeof timestamp !== 'number' || !Number.isFinite(timestamp)) return false
  if (Math.abs(nowSeconds - timestamp) > MAX_SKEW_SECONDS) return false
  const a = Buffer.from(expected)
  const b = Buffer.from(given)
  return a.length === b.length && timingSafeEqual(a, b)
}
