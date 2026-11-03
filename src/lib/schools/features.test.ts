import { afterEach, describe, expect, it } from 'vitest'
import { assertBookletsEnabled, bookletsEnabled } from './features'

// Answer booklets and QR page sorting: off unless SCHOOL_BOOKLETS=on, and never in a production runtime.
describe('the answer-booklet switch', () => {
  const saved = { b: process.env.SCHOOL_BOOKLETS, v: process.env.VERCEL_ENV, n: process.env.NODE_ENV }
  afterEach(() => {
    process.env.SCHOOL_BOOKLETS = saved.b
    process.env.VERCEL_ENV = saved.v
    process.env.NODE_ENV = saved.n
  })

  it('is off by default, and refuses with a plain message', () => {
    delete process.env.SCHOOL_BOOKLETS
    expect(bookletsEnabled()).toBe(false)
    expect(() => assertBookletsEnabled()).toThrow(/switched off/)
  })

  it('can be switched on outside production only', () => {
    process.env.SCHOOL_BOOKLETS = 'on'
    expect(bookletsEnabled()).toBe(true)
    process.env.VERCEL_ENV = 'production'
    expect(bookletsEnabled()).toBe(false)
  })
})
