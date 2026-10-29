import { describe, expect, it } from 'vitest'
import { assertLocalDatabase } from '../../../scripts/provision-school'

describe('provision-school refuses non-local databases', () => {
  it.each(['localhost', '127.0.0.1', '[::1]'])('allows %s', (h) => {
    expect(() =>
      assertLocalDatabase(`postgres://u:p@${h}:5432/db`),
    ).not.toThrow()
  })
  it.each([
    'postgres://u:p@db.abcdefgh.supabase.co:5432/postgres',
    'postgres://u:p@aws-0-ap-south-1.pooler.supabase.com:6543/postgres',
    'postgres://u:p@localhost.evil.example:5432/db',
    'not a url',
    '',
  ])('refuses %s', (url) => {
    expect(() => assertLocalDatabase(url)).toThrow(/local databases only/)
  })
  it('refuses when DATABASE_URL is unset', () => {
    expect(() => assertLocalDatabase(undefined)).toThrow(/local databases only/)
  })
})
