import { describe, expect, it } from 'vitest'
import { isIstSunday, istWeekStart, pickChapters, weeklyCardShareText } from './weekly-card-text'

describe('istWeekStart', () => {
  it('starts on Monday 00:00 India time', () => {
    // Wednesday 2026-10-21 12:00 UTC = 17:30 IST.
    const w = istWeekStart(new Date('2026-10-21T12:00:00Z'))
    expect(w.startKey).toBe('2026-10-19')
    expect(w.endKey).toBe('2026-10-25')
    expect(w.start.toISOString()).toBe('2026-10-18T18:30:00.000Z')
  })
  it('uses India time at the boundary: Sunday 19:00 UTC is already Monday in India', () => {
    expect(istWeekStart(new Date('2026-10-25T19:00:00Z')).startKey).toBe('2026-10-26')
    expect(istWeekStart(new Date('2026-10-25T17:00:00Z')).startKey).toBe('2026-10-19')
  })
})

describe('isIstSunday', () => {
  it('follows India time', () => {
    expect(isIstSunday(new Date('2026-10-25T10:00:00Z'))).toBe(true)
    expect(isIstSunday(new Date('2026-10-25T19:00:00Z'))).toBe(false)
  })
})

describe('pickChapters', () => {
  it('returns empty lists with nothing assessed', () => {
    expect(pickChapters([{ name: 'A', mastery: null }])).toEqual({ strongest: [], workOn: [] })
  })
  it('picks two strongest, then the lowest below 80 that are not already strong', () => {
    const r = pickChapters([
      { name: 'A', mastery: 90 },
      { name: 'B', mastery: 85 },
      { name: 'C', mastery: 30 },
      { name: 'D', mastery: 50 },
      { name: 'E', mastery: 79 },
      { name: 'F', mastery: null },
    ])
    expect(r).toEqual({ strongest: ['A', 'B'], workOn: ['C', 'D'] })
  })
  it('never lists one chapter twice', () => {
    expect(pickChapters([{ name: 'A', mastery: 40 }])).toEqual({ strongest: ['A'], workOn: [] })
  })
})

describe('weeklyCardShareText', () => {
  const base = {
    week_start: '2026-10-19',
    week_end: '2026-10-25',
    student_first_name: 'Chitra',
    class_label: 'Class 7',
    papers_submitted: 3,
    marks_won_back: 8,
    strongest_chapters: ['Fractions'],
    chapters_to_work_on: ['Light'],
    streak_days: 2,
  }
  it('builds the one-line summary', () => {
    expect(weeklyCardShareText(base)).toBe(
      "Chitra's PrepPlan week: 3 papers, 8 marks won back. Strong: Fractions. Working on: Light.",
    )
  })
  it('handles zeros and singulars without shaming', () => {
    expect(
      weeklyCardShareText({ ...base, papers_submitted: 1, marks_won_back: 1, strongest_chapters: [], chapters_to_work_on: [] }),
    ).toBe("Chitra's PrepPlan week: 1 paper, 1 mark won back.")
  })
})
