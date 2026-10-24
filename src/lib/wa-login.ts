import {
  createHash,
  createHmac,
  randomBytes,
  randomInt,
  randomUUID,
  timingSafeEqual,
} from 'node:crypto'
import type { Db } from '../db/connection'
import { waLoginRepository } from '../db/repositories'
import { captureError } from './error-log'
import { env } from './env'
import { WA_CODE_ALPHABET, WA_CODE_LENGTH } from './wa-login-types'

// Server-side pieces of "Continue with WhatsApp" sign-in that need no better-auth context: the
// feature switch, code and token generation, the webhook signature check, the code parser, number
// masking, and handling of one Meta webhook delivery. Contract with the browser: wa-login-types.ts.

export const WA_CHALLENGE_TTL_MS = 10 * 60 * 1000
export const WA_TICKET_TTL_MS = 15 * 60 * 1000
export const WA_MAX_PENDING_PER_IP_PER_HOUR = 20
export const WA_MAX_VERIFIED_PER_PHONE_PER_HOUR = 10
const HOUR_MS = 60 * 60 * 1000

export interface WaConfig {
  businessNumber: string
  appSecret: string
  verifyToken: string
  accessToken: string | undefined
  phoneNumberId: string | undefined
}

/** The feature is on only when the first three variables are set; null means "not enabled". */
export function getWaConfig(): WaConfig | null {
  if (
    !env.WHATSAPP_BUSINESS_NUMBER ||
    !env.WHATSAPP_APP_SECRET ||
    !env.WHATSAPP_VERIFY_TOKEN
  ) {
    return null
  }
  return {
    businessNumber: env.WHATSAPP_BUSINESS_NUMBER,
    appSecret: env.WHATSAPP_APP_SECRET,
    verifyToken: env.WHATSAPP_VERIFY_TOKEN,
    accessToken: env.WHATSAPP_ACCESS_TOKEN,
    phoneNumberId: env.WHATSAPP_PHONE_NUMBER_ID,
  }
}

/** crypto.randomInt only, never Math.random. */
export function generateWaCode(): string {
  let code = ''
  for (let i = 0; i < WA_CODE_LENGTH; i++) {
    code += WA_CODE_ALPHABET[randomInt(WA_CODE_ALPHABET.length)]
  }
  return code
}

export function generateSecretToken(): string {
  return randomBytes(32).toString('base64url')
}

export function hashSecret(value: string): string {
  return createHash('sha256').update(value).digest('hex')
}

/** Constant-time compare of a presented secret against its stored sha256 hash. */
export function secretMatchesHash(presented: string, storedHash: string): boolean {
  const a = Buffer.from(hashSecret(presented), 'hex')
  const b = Buffer.from(storedHash, 'hex')
  return a.length === b.length && timingSafeEqual(a, b)
}

/** Client addresses are stored only as a keyed hash. */
export function hashIp(ip: string): string {
  return createHmac('sha256', env.BETTER_AUTH_SECRET)
    .update(`wa-ip:${ip}`)
    .digest('hex')
}

/** Meta signs the raw body: header X-Hub-Signature-256 = 'sha256=' + HMAC-SHA256(body, app secret). */
export function verifyMetaSignature(
  rawBody: string,
  header: string | null,
  appSecret: string,
): boolean {
  if (!header || !header.startsWith('sha256=')) return false
  const expected = createHmac('sha256', appSecret).update(rawBody).digest()
  const presentedHex = header.slice('sha256='.length)
  if (!/^[0-9a-fA-F]{64}$/.test(presentedHex)) return false
  return timingSafeEqual(expected, Buffer.from(presentedHex, 'hex'))
}

const CODE_PATTERN = /\bPREPPLAN[\s:-]*([A-Z2-9]{8})\b/i

/** The challenge code in a message ("PREPPLAN K7M2XQ9A"), uppercased, or null. */
export function extractWaCode(body: string): string | null {
  const match = CODE_PATTERN.exec(body)
  return match ? match[1].toUpperCase() : null
}

/** '919876543210' or '+91 98765 43210' -> '+919876543210'; null when it is not a plausible number. */
export function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, '')
  if (!/^[1-9][0-9]{7,14}$/.test(digits)) return null
  return `+${digits}`
}

/** '+919876543210' -> '+91 ••••• ••210'. Country code kept (91 known, else the first two digits). */
export function maskPhone(e164: string): string {
  const digits = e164.replace(/\D/g, '')
  const cc = digits.startsWith('91') ? '91' : digits.slice(0, 2)
  const tail = digits.slice(-3)
  return `+${cc} ••••• ••${tail}`
}

/** '919876543210' -> '+91 98765 43210' for display; other countries are shown plainly. */
export function formatBusinessNumber(digits: string): string {
  if (digits.startsWith('91') && digits.length === 12) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`
  }
  return `+${digits}`
}

const asRecord = (v: unknown): Record<string, unknown> | null =>
  typeof v === 'object' && v !== null && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : null
const asArray = (v: unknown): Array<unknown> => (Array.isArray(v) ? v : [])

/** Text messages only, from entry[].changes[].value.messages[]; everything else is ignored. */
export function extractTextMessages(
  payload: unknown,
): Array<{ wamid: string; from: string; body: string }> {
  const out: Array<{ wamid: string; from: string; body: string }> = []
  for (const entry of asArray(asRecord(payload)?.entry)) {
    for (const change of asArray(asRecord(entry)?.changes)) {
      const value = asRecord(asRecord(change)?.value)
      for (const raw of asArray(value?.messages)) {
        const m = asRecord(raw)
        const id = m?.id
        const from = m?.from
        const body = asRecord(m?.text)?.body
        if (
          m?.type === 'text' &&
          typeof id === 'string' &&
          id.length > 0 &&
          id.length <= 200 &&
          typeof from === 'string' &&
          typeof body === 'string'
        ) {
          out.push({ wamid: id, from, body })
        }
      }
    }
  }
  return out
}

/** Short free-form reply; any failure is logged and never changes the verification. */
async function sendConfirmationReply(config: WaConfig, toDigits: string) {
  if (!config.accessToken || !config.phoneNumberId) return
  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${encodeURIComponent(config.phoneNumberId)}/messages`,
      {
        method: 'POST',
        headers: {
          authorization: `Bearer ${config.accessToken}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: toDigits,
          type: 'text',
          text: {
            body: 'You are signed in to PrepPlan. You can go back to the app now.',
          },
        }),
      },
    )
    if (!res.ok) throw new Error(`Graph API answered ${res.status}`)
  } catch (err) {
    await captureError({
      requestId: randomUUID(),
      source: 'server',
      route: '/api/webhooks/whatsapp (reply)',
      method: 'POST',
      message: `WhatsApp confirmation reply failed: ${(err as Error).message}`,
    })
  }
}

/**
 * Handles one signature-checked Meta delivery. Returns how many challenges it verified (tests and
 * logs only). Never throws for a bad message: one bad entry must not stop the rest.
 */
export async function processWhatsAppWebhook(
  db: Db,
  config: WaConfig,
  payload: unknown,
): Promise<number> {
  let verified = 0
  for (const message of extractTextMessages(payload)) {
    // Replay protection first: a delivery Meta retries is seen once and ignored afterwards.
    if (!(await waLoginRepository.recordInbound(db, message.wamid))) continue
    const code = extractWaCode(message.body)
    if (!code) continue
    const phone = normalizePhone(message.from)
    if (!phone) continue
    const recent = await waLoginRepository.countVerifiedForPhoneSince(
      db,
      phone,
      new Date(Date.now() - HOUR_MS),
    )
    if (recent >= WA_MAX_VERIFIED_PER_PHONE_PER_HOUR) continue
    const challenge = await waLoginRepository.verifyPendingByCode(db, {
      code,
      phone,
      wamid: message.wamid,
    })
    if (!challenge) continue
    verified++
    await sendConfirmationReply(config, phone.slice(1))
  }
  return verified
}
