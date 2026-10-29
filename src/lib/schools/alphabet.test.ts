import { describe, expect, it } from 'vitest'
import { newSlipCode } from './credentials'
import { UNAMBIGUOUS_ALPHABET, UNAMBIGUOUS_CLASS } from './alphabet'

describe('look-alike characters never appear in codes or generated IDs', () => {
  it('the alphabet has no 0, O, 1, I, L (any case)', () => {
    for (const c of '0O1IL0o1il') expect(UNAMBIGUOUS_ALPHABET).not.toContain(c)
    expect(UNAMBIGUOUS_ALPHABET).toBe(UNAMBIGUOUS_ALPHABET.toUpperCase())
    expect(new Set(UNAMBIGUOUS_ALPHABET).size).toBe(UNAMBIGUOUS_ALPHABET.length)
  })
  it('the regex class matches exactly the alphabet', () => {
    const re = new RegExp(`^${UNAMBIGUOUS_CLASS}$`)
    for (const c of UNAMBIGUOUS_ALPHABET) expect(re.test(c), c).toBe(true)
    for (const c of '0O1ILol-') expect(re.test(c), c).toBe(false)
  })
  it('20000 generated codes never contain a look-alike', () => {
    for (let i = 0; i < 20000; i++)
      expect(newSlipCode()).toMatch(
        new RegExp(`^${UNAMBIGUOUS_CLASS}{5}-${UNAMBIGUOUS_CLASS}{5}$`),
      )
  })
})
