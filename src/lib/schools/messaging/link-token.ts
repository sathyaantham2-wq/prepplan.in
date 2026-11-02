import { createHmac, hkdfSync, timingSafeEqual } from 'node:crypto'
import { env } from '../../env'

// The personal report link in a parent message (plan section 3). One link is for ONE child and ONE report, is
// signed with HMAC-SHA256 (a key derived from the app secret for this purpose only), and expires 7 days after it
// is issued. A new link is issued with every message. There is nothing to look up: a link that was altered in any
// character, or has expired, simply does not verify. No name or school is inside it.

export const LINK_DAYS = 7
const VERSION = 1

export type LinkKind = 'exam' | 'focus'

export interface LinkClaims {
  v: number
  /** school id */
  s: string
  /** the one student id */
  st: string
  k: LinkKind
  /** the paper id, for an exam report */
  r: string | null
  /** expiry, seconds since 1970 */
  exp: number
}

function key(secret: string): Buffer {
  return Buffer.from(hkdfSync('sha256', secret, 'prepplan-school', 'parent-link-v1', 32))
}
const b64 = (b: Buffer | string) => Buffer.from(b).toString('base64url')

export function issueParentLink(
  input: { schoolId: string; studentId: string; kind: LinkKind; paperId?: string | null },
  now = new Date(),
  secret: string = env.BETTER_AUTH_SECRET,
): { token: string; expiresAt: Date } {
  if (input.kind === 'exam' && !input.paperId) throw new Error('An exam link needs the paper.')
  const exp = Math.floor(now.getTime() / 1000) + LINK_DAYS * 86_400
  const claims: LinkClaims = {
    v: VERSION,
    s: input.schoolId,
    st: input.studentId,
    k: input.kind,
    r: input.kind === 'exam' ? (input.paperId ?? null) : null,
    exp,
  }
  const body = b64(JSON.stringify(claims))
  const mac = createHmac('sha256', key(secret)).update(body).digest()
  return { token: `${body}.${b64(mac)}`, expiresAt: new Date(exp * 1000) }
}

/**
 * The claims of a genuine, unexpired link; otherwise null. The caller cannot (and the page must not) tell
 * "expired" from "altered" from "not ours": all three look the same to the visitor.
 */
export function verifyParentLink(
  token: string,
  now = new Date(),
  secret: string = env.BETTER_AUTH_SECRET,
): LinkClaims | null {
  if (typeof token !== 'string' || token.length > 600) return null
  const parts = token.split('.')
  if (parts.length !== 2) return null
  const [body, sig] = parts
  let given: Buffer
  try {
    given = Buffer.from(sig, 'base64url')
  } catch {
    return null
  }
  const want = createHmac('sha256', key(secret)).update(body).digest()
  if (given.length !== want.length || !timingSafeEqual(given, want)) return null
  let c: Record<string, unknown>
  try {
    c = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as Record<string, unknown>
  } catch {
    return null
  }
  if (
    c.v !== VERSION ||
    typeof c.s !== 'string' ||
    typeof c.st !== 'string' ||
    (c.k !== 'exam' && c.k !== 'focus') ||
    (c.k === 'exam' && typeof c.r !== 'string') ||
    typeof c.exp !== 'number' ||
    c.exp * 1000 <= now.getTime()
  )
    return null
  return { v: c.v, s: c.s, st: c.st, k: c.k, r: c.k === 'exam' ? (c.r as string) : null, exp: c.exp }
}

/** The full address of a link. */
export function parentLinkUrl(token: string, base: string = env.BETTER_AUTH_URL): string {
  return `${base.replace(/\/$/, '')}/p/${token}`
}
