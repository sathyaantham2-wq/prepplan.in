import { createHmac } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import {
  extractTextMessages,
  extractWaCode,
  formatBusinessNumber,
  generateWaCode,
  hashSecret,
  maskPhone,
  normalizePhone,
  secretMatchesHash,
  verifyMetaSignature,
} from './wa-login'
import { WA_CODE_ALPHABET, WA_CODE_LENGTH } from './wa-login-types'

const sign = (body: string, secret: string) =>
  `sha256=${createHmac('sha256', secret).update(body).digest('hex')}`

describe('verifyMetaSignature', () => {
  const body = '{"object":"whatsapp_business_account"}'
  it('accepts the right signature', () => {
    expect(verifyMetaSignature(body, sign(body, 's3cret'), 's3cret')).toBe(true)
  })
  it('rejects a wrong secret, a changed body, a missing or malformed header', () => {
    expect(verifyMetaSignature(body, sign(body, 'other'), 's3cret')).toBe(false)
    expect(verifyMetaSignature(body + ' ', sign(body, 's3cret'), 's3cret')).toBe(false)
    expect(verifyMetaSignature(body, null, 's3cret')).toBe(false)
    expect(verifyMetaSignature(body, 'sha256=', 's3cret')).toBe(false)
    expect(verifyMetaSignature(body, 'sha256=zz', 's3cret')).toBe(false)
    expect(verifyMetaSignature(body, sign(body, 's3cret').slice(7), 's3cret')).toBe(false)
  })
})

describe('extractWaCode', () => {
  it('finds the code however the keyword is written', () => {
    expect(extractWaCode('PREPPLAN K7M2XQ9A')).toBe('K7M2XQ9A')
    expect(extractWaCode('prepplan k7m2xq9a')).toBe('K7M2XQ9A')
    expect(extractWaCode('PREPPLAN: K7M2XQ9A')).toBe('K7M2XQ9A')
    expect(extractWaCode('hello PrepPlan-K7M2XQ9A thanks')).toBe('K7M2XQ9A')
  })
  it('ignores messages without the keyword or with a wrong-length code', () => {
    expect(extractWaCode('K7M2XQ9A')).toBeNull()
    expect(extractWaCode('hello')).toBeNull()
    expect(extractWaCode('PREPPLAN K7M2XQ9')).toBeNull()
    expect(extractWaCode('PREPPLAN K7M2XQ9AB')).toBeNull()
  })
})

describe('generateWaCode', () => {
  it('uses only the alphabet, at the right length, and varies', () => {
    const seen = new Set<string>()
    for (let i = 0; i < 300; i++) {
      const code = generateWaCode()
      expect(code).toHaveLength(WA_CODE_LENGTH)
      for (const ch of code) expect(WA_CODE_ALPHABET).toContain(ch)
      seen.add(code)
    }
    expect(seen.size).toBeGreaterThan(290)
  })
})

describe('phone helpers', () => {
  it('masks all but the country code and last three digits', () => {
    expect(maskPhone('+919876543210')).toBe('+91 ••••• ••210')
    expect(maskPhone('+14155550123')).toBe('+14 ••••• ••123')
  })
  it('normalizes Meta numbers and rejects junk', () => {
    expect(normalizePhone('919876543210')).toBe('+919876543210')
    expect(normalizePhone('+91 98765 43210')).toBe('+919876543210')
    expect(normalizePhone('12')).toBeNull()
    expect(normalizePhone('0123456789')).toBeNull()
    expect(normalizePhone('')).toBeNull()
  })
  it('formats the business number', () => {
    expect(formatBusinessNumber('919876543210')).toBe('+91 98765 43210')
    expect(formatBusinessNumber('14155550123')).toBe('+14155550123')
  })
})

describe('secrets', () => {
  it('matches a token only against its own hash', () => {
    const hash = hashSecret('token-a')
    expect(secretMatchesHash('token-a', hash)).toBe(true)
    expect(secretMatchesHash('token-b', hash)).toBe(false)
    expect(secretMatchesHash('token-a', 'abcd')).toBe(false)
  })
})

describe('extractTextMessages', () => {
  const wrap = (messages: unknown) => ({
    object: 'whatsapp_business_account',
    entry: [{ changes: [{ value: { messages } }] }],
  })
  it('returns text messages only', () => {
    const got = extractTextMessages(
      wrap([
        { id: 'w1', from: '919876543210', type: 'text', text: { body: 'hi' } },
        { id: 'w2', from: '919876543210', type: 'image' },
        { from: '1', type: 'text', text: { body: 'no id' } },
      ]),
    )
    expect(got).toEqual([{ wamid: 'w1', from: '919876543210', body: 'hi' }])
  })
  it('survives garbage', () => {
    for (const junk of [null, 5, 'x', {}, { entry: 3 }, { entry: [null, {}, { changes: [{}] }] }]) {
      expect(extractTextMessages(junk)).toEqual([])
    }
  })
})
