import { describe, expect, it } from 'vitest'
import { examsInputSchema, validateExamList } from './student-exams'

const NOW = new Date('2026-10-24T10:00:00Z')

describe('validateExamList', () => {
  it('sorts by date and accepts the edges of the window', () => {
    const r = validateExamList(
      [
        { name: 'B', date: '2029-01-01' },
        { name: 'A', date: '2025-09-19' },
      ],
      NOW,
    )
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.exams.map((e) => e.name)).toEqual(['A', 'B'])
  })
  it('refuses dates beyond 400 days back or 800 days ahead', () => {
    expect(validateExamList([{ name: 'x', date: '2025-09-18' }], NOW).ok).toBe(false)
    expect(validateExamList([{ name: 'x', date: '2029-01-02' }], NOW).ok).toBe(false)
  })
  it('refuses a duplicate name and date, ignoring case', () => {
    const r = validateExamList(
      [
        { name: 'Unit test', date: '2026-11-01' },
        { name: 'unit TEST', date: '2026-11-01' },
      ],
      NOW,
    )
    expect(r.ok).toBe(false)
    expect(
      validateExamList(
        [
          { name: 'Unit test', date: '2026-11-01' },
          { name: 'Unit test', date: '2026-11-02' },
        ],
        NOW,
      ).ok,
    ).toBe(true)
  })
})

describe('examsInputSchema', () => {
  it('trims names, rejects blank, long, impossible dates and more than 5', () => {
    const ok = examsInputSchema.safeParse({ exams: [{ name: '  Annual ', date: '2026-11-01' }] })
    expect(ok.success && ok.data.exams[0].name).toBe('Annual')
    expect(examsInputSchema.safeParse({ exams: [{ name: '  ', date: '2026-11-01' }] }).success).toBe(false)
    expect(examsInputSchema.safeParse({ exams: [{ name: 'x'.repeat(61), date: '2026-11-01' }] }).success).toBe(false)
    expect(examsInputSchema.safeParse({ exams: [{ name: 'x', date: '2026-02-30' }] }).success).toBe(false)
    const six = Array.from({ length: 6 }, (_, i) => ({ name: `E${i}`, date: '2026-11-01' }))
    expect(examsInputSchema.safeParse({ exams: six }).success).toBe(false)
  })
})
