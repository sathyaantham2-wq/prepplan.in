import { describe, expect, it } from 'vitest'
import { inQuietHours, istParts, nextQuietEnd } from './ist'
import { fellTwice } from './content'
import { inboundSignature, signOutbound, signatureOk, statusSignature } from './signing'

describe('India time and quiet hours', () => {
  const at = (ist: string) => new Date(new Date(`${ist}:00Z`).getTime() - 5.5 * 3_600_000)
  it('no parent message from 9 pm to 8 am', () => {
    expect(inQuietHours(at('2026-11-03T20:59'))).toBe(false)
    expect(inQuietHours(at('2026-11-03T21:00'))).toBe(true)
    expect(inQuietHours(at('2026-11-04T07:59'))).toBe(true)
    expect(inQuietHours(at('2026-11-04T08:00'))).toBe(false)
  })
  it('a held message waits for the next 8:00 am', () => {
    expect(nextQuietEnd(at('2026-11-03T22:10')).toISOString()).toBe(at('2026-11-04T08:00').toISOString())
    expect(nextQuietEnd(at('2026-11-04T03:00')).toISOString()).toBe(at('2026-11-04T08:00').toISOString())
  })
  it('reads the day of the week in India (Sunday = 0)', () => {
    expect(istParts(at('2026-11-01T18:30'))).toMatchObject({ date: '2026-11-01', hour: 18, dow: 0 })
    expect(istParts(at('2026-11-02T08:30'))).toMatchObject({ dow: 1 })
  })
})

describe('worrying news rule', () => {
  it('two falls in a row, each at least 2 points, and nothing else', () => {
    expect(fellTwice([80, 70, 60])).toBe(true)
    expect(fellTwice([90, 80, 85])).toBe(false)
    expect(fellTwice([70, 69, 68])).toBe(false)
    expect(fellTwice([60, 70])).toBe(false)
    expect(fellTwice([50, 90, 80, 70])).toBe(true)
  })
})

describe('signatures between PrepPlan and Make', () => {
  const secret = 'shared-secret-0123456789abcdef'
  it('are stable, differ by every part, and a stale timestamp is refused', () => {
    const m = { timestamp: 1_800_000_000, messageId: 'id-1', template: 'result_ready_v1', recipient: '+919876500011' }
    const s = signOutbound(secret, m)
    expect(s).toMatch(/^[0-9a-f]{64}$/)
    expect(signOutbound(secret, { ...m, recipient: '+919876500012' })).not.toBe(s)
    expect(signOutbound(secret, { ...m, template: 'weekly_focus_v1' })).not.toBe(s)
    expect(signOutbound('other-secret-0123456789abcdef', m)).not.toBe(s)
    expect(statusSignature(secret, 1, 'a', 'sent')).not.toBe(statusSignature(secret, 1, 'a', 'read'))
    expect(inboundSignature(secret, 1, '+911')).not.toBe(statusSignature(secret, 1, '+911', 'inbound'.slice(0, 0) + 'x'))
    expect(signatureOk(s, s, m.timestamp, m.timestamp + 299)).toBe(true)
    expect(signatureOk(s, s, m.timestamp, m.timestamp + 301)).toBe(false)
    expect(signatureOk(s, s, m.timestamp, m.timestamp - 301)).toBe(false)
    expect(signatureOk(s, 'x'.repeat(64), m.timestamp, m.timestamp)).toBe(false)
    expect(signatureOk(s, undefined, m.timestamp, m.timestamp)).toBe(false)
    expect(signatureOk(s, s, 'now', m.timestamp)).toBe(false)
  })
})
