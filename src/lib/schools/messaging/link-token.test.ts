import { describe, expect, it } from 'vitest'
import { LINK_DAYS, issueParentLink, parentLinkUrl, verifyParentLink } from './link-token'

const SECRET = 'test-secret-for-links-0123456789abcdef'
const S = '11111111-1111-4111-8111-111111111111'
const ST = '22222222-2222-4222-8222-222222222222'
const P = '33333333-3333-4333-8333-333333333333'
const T0 = new Date('2026-11-02T10:00:00Z')

describe('parent report links', () => {
  it('a fresh link verifies and names one child and one report', () => {
    const { token } = issueParentLink({ schoolId: S, studentId: ST, kind: 'exam', paperId: P }, T0, SECRET)
    expect(verifyParentLink(token, T0, SECRET)).toMatchObject({ s: S, st: ST, k: 'exam', r: P })
  })

  it('expires after 7 days, not before', () => {
    const { token, expiresAt } = issueParentLink({ schoolId: S, studentId: ST, kind: 'focus' }, T0, SECRET)
    expect(expiresAt.getTime() - T0.getTime()).toBe(LINK_DAYS * 86_400_000)
    const justBefore = new Date(expiresAt.getTime() - 1000)
    const atExpiry = new Date(expiresAt.getTime())
    expect(verifyParentLink(token, justBefore, SECRET)).not.toBeNull()
    expect(verifyParentLink(token, atExpiry, SECRET)).toBeNull()
    expect(verifyParentLink(token, new Date(T0.getTime() + 8 * 86_400_000), SECRET)).toBeNull()
  })

  it('a link issued later is a different link (a new one with every message)', () => {
    const a = issueParentLink({ schoolId: S, studentId: ST, kind: 'focus' }, T0, SECRET).token
    const b = issueParentLink({ schoolId: S, studentId: ST, kind: 'focus' }, new Date(T0.getTime() + 60_000), SECRET).token
    expect(a).not.toBe(b)
  })

  it('any altered character in the claims or the signature is refused', () => {
    const { token } = issueParentLink({ schoolId: S, studentId: ST, kind: 'exam', paperId: P }, T0, SECRET)
    for (let i = 0; i < token.length; i++) {
      if (token[i] === '.') continue
      const swapped = token[i] === 'A' ? 'B' : 'A'
      const forged = token.slice(0, i) + swapped + token.slice(i + 1)
      expect(verifyParentLink(forged, T0, SECRET), `char ${i}`).toBeNull()
    }
  })

  it("another child's id cannot be swapped in, even with a valid signature copied across", () => {
    const mine = issueParentLink({ schoolId: S, studentId: ST, kind: 'focus' }, T0, SECRET).token
    const other = '44444444-4444-4444-8444-444444444444'
    const claims = JSON.parse(Buffer.from(mine.split('.')[0], 'base64url').toString())
    const forgedBody = Buffer.from(JSON.stringify({ ...claims, st: other })).toString('base64url')
    expect(verifyParentLink(`${forgedBody}.${mine.split('.')[1]}`, T0, SECRET)).toBeNull()
  })

  it('a link signed with another secret, junk, and oversized input are refused', () => {
    const { token } = issueParentLink({ schoolId: S, studentId: ST, kind: 'focus' }, T0, SECRET)
    expect(verifyParentLink(token, T0, 'a-different-secret-0123456789abcdef!!')).toBeNull()
    for (const junk of ['', 'abc', 'a.b', 'a.b.c', '.', 'x'.repeat(2000), 'e30.e30'])
      expect(verifyParentLink(junk, T0, SECRET)).toBeNull()
  })

  it('an exam link needs its paper; the token holds no name', () => {
    expect(() => issueParentLink({ schoolId: S, studentId: ST, kind: 'exam' }, T0, SECRET)).toThrow()
    const { token } = issueParentLink({ schoolId: S, studentId: ST, kind: 'focus' }, T0, SECRET)
    expect(Buffer.from(token.split('.')[0], 'base64url').toString()).not.toMatch(/name|school name/i)
  })

  it('builds the address under /p/', () => {
    expect(parentLinkUrl('abc.def', 'https://www.prepplan.in/')).toBe('https://www.prepplan.in/p/abc.def')
  })
})
