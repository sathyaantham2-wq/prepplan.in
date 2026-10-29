import { describe, expect, it } from 'vitest'
import { countPdfPages } from '../pdf/page-count'
import { renderHtmlToPdf } from '../pdf/render'
import { newSlipCode } from './credentials'
import type { StudentSlip } from './credentials'
import { buildSlipsHtml } from './slips'

const slip = (i: number): StudentSlip => ({
  schoolStudentId: `s${i}`,
  name: `Student Number ${i}`,
  rollNo: String(i),
  loginId: i % 2 ? `2024/${String(100 + i).padStart(4, '0')}` : `PK7M2P${i}X`,
  code: newSlipCode(),
  expiresAt: new Date('2026-11-05T00:00:00Z'),
})
const html = (n: number) =>
  buildSlipsHtml({
    schoolName: 'Sunrise Public School',
    schoolCode: 'sunrise',
    sectionLabel: 'Class 7-A',
    signInUrl: 'https://www.prepplan.in/school/sign-in',
    slips: Array.from({ length: n }, (_, i) => slip(i + 1)),
  })

/** The printed slips: eight to an A4 page, no slip split across pages. Needs a local Chromium (as the paper PDF tests do). */
describe('credential slips as a printed PDF', () => {
  it('8 slips fit exactly one A4 page', async () => {
    expect(countPdfPages(await renderHtmlToPdf(html(8)))).toBe(1)
  }, 60_000)
  it('9 slips take a second page, and 16 still take two', async () => {
    expect(countPdfPages(await renderHtmlToPdf(html(9)))).toBe(2)
    expect(countPdfPages(await renderHtmlToPdf(html(16)))).toBe(2)
  }, 90_000)
})
