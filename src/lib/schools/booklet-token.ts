import { createHmac, hkdfSync } from 'node:crypto'
import { env } from '../env'
import { UNAMBIGUOUS_ALPHABET } from './alphabet'

// The code in the QR on every booklet page. It stands for exactly one page of one student's booklet
// of one exam of one school (school_booklet_pages maps it back). It is derived from a secret with
// HMAC, so it can be printed again identically at any time and cannot be guessed or made up, and it
// carries no name or other personal detail. About 128 bits.

export const QR_PREFIX = 'PPB1-'
const TOKEN_LENGTH = 26

function key(secret: string): Buffer {
  return Buffer.from(
    hkdfSync('sha256', secret, 'prepplan-school', 'booklet-qr-v1', 32),
  )
}

export function bookletPageToken(
  input: {
    schoolId: string
    examId: string
    schoolStudentId: string
    page: number
  },
  secret: string = env.BETTER_AUTH_SECRET,
): string {
  const mac = createHmac('sha256', key(secret))
    .update(
      `${input.schoolId}|${input.examId}|${input.schoolStudentId}|${input.page}`,
    )
    .digest()
  let out = ''
  for (let i = 0; i < TOKEN_LENGTH; i++)
    out += UNAMBIGUOUS_ALPHABET[mac[i] % UNAMBIGUOUS_ALPHABET.length]
  return out
}

/** What is encoded in the QR image. */
export const qrContent = (token: string) => `${QR_PREFIX}${token}`

/** The token inside scanned QR text, or null when it is not one of ours. */
export function parseQrContent(text: string): string | null {
  const t = text.trim()
  if (!t.startsWith(QR_PREFIX)) return null
  const token = t.slice(QR_PREFIX.length)
  return token.length === TOKEN_LENGTH &&
    [...token].every((c) => UNAMBIGUOUS_ALPHABET.includes(c))
    ? token
    : null
}
