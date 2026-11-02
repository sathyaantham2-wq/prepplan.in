import { describe, expect, it } from 'vitest'
import { currentStep } from './exam-journey'
import type { JourneyFacts } from './exam-journey'

// Which step an exam is on, from plain counts: the one the teacher should do now.
const base: JourneyFacts = {
  paperApproved: true, markable: true, students: 5, noSheets: 0, readyForAi: 0, aiBusy: 0,
  needYou: 0, marked: 0, queries: 0, sectionsToRelease: 0, sectionsTotal: 1,
}
const at = (o: Partial<JourneyFacts>) => currentStep({ ...base, ...o })

describe('the exam journey', () => {
  it('goes paper, answers, sheets, AI marks, your look, results, done', () => {
    expect(at({ paperApproved: false, markable: false })).toBe('paper')
    expect(at({ markable: false })).toBe('answers')
    expect(at({ noSheets: 5 })).toBe('sheets')
    expect(at({ noSheets: 1, readyForAi: 4 })).toBe('marking')
    expect(at({ aiBusy: 2, marked: 2 })).toBe('marking')
    expect(at({ marked: 4, needYou: 1, sectionsToRelease: 1 })).toBe('review')
    expect(at({ marked: 5, queries: 2 })).toBe('review')
    expect(at({ marked: 5, sectionsToRelease: 1 })).toBe('release')
    expect(at({ marked: 5, sectionsToRelease: 0 })).toBe('done')
  })
  it('marking comes before looking, and looking before release', () => {
    expect(at({ readyForAi: 1, needYou: 3, marked: 3, sectionsToRelease: 1 })).toBe('marking')
    expect(at({ needYou: 3, marked: 3, sectionsToRelease: 1 })).toBe('review')
  })
  it('students without sheets do not hold up the release of the rest', () => {
    expect(at({ noSheets: 1, marked: 4, sectionsToRelease: 1 })).toBe('release')
  })
  it('with nobody marked and no sheets it asks for sheets, never for a release', () => {
    expect(at({ students: 5, noSheets: 0, marked: 0, sectionsToRelease: 0 })).toBe('sheets')
  })
})
