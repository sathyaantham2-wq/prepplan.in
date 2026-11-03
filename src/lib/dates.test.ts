import { describe, expect, it } from 'vitest'
import { formatDate, formatDateTime } from './dates'

describe('Indian date format (dd/mm/yyyy)', () => {
  it('formats instants in India time', () => {
    expect(formatDate(new Date('2026-11-03T05:00:00Z'))).toBe('03/11/2026')
    // 20:00 UTC on 2 Nov is already 3 Nov in India
    expect(formatDate('2026-11-02T20:00:00Z')).toBe('03/11/2026')
  })
  it('shows a plain calendar date as it is', () => {
    expect(formatDate('2026-04-01')).toBe('01/04/2026')
  })
  it('has a fallback for nothing or nonsense', () => {
    expect(formatDate(null)).toBe('–')
    expect(formatDate('not a date')).toBe('–')
  })
  it('adds the time when asked', () => {
    expect(formatDateTime('2026-11-03T10:35:00Z')).toBe('03/11/2026, 4:05 pm')
  })
})
