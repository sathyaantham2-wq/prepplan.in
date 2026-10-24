import { describe, expect, it } from 'vitest'
import { addDays, nextSchedule } from './fixit-schedule'

describe('fixit schedule', () => {
  const today = '2026-10-24'
  it('moves up a stage with growing gaps on a correct answer', () => {
    expect(nextSchedule(0, true, today)).toEqual({ stage: 1, due_on: '2026-10-26', status: 'active' })
    expect(nextSchedule(1, true, today)).toEqual({ stage: 2, due_on: '2026-10-31', status: 'active' })
    expect(nextSchedule(2, true, today)).toEqual({ stage: 3, due_on: '2026-11-14', status: 'active' })
  })
  it('masters the card on a correct answer at stage 3', () => {
    expect(nextSchedule(3, true, today).status).toBe('mastered')
  })
  it('sends a wrong answer back to stage 0, due tomorrow, from every stage', () => {
    for (const stage of [0, 1, 2, 3]) {
      expect(nextSchedule(stage, false, today)).toEqual({ stage: 0, due_on: '2026-10-25', status: 'active' })
    }
  })
  it('adds days across month and year ends', () => {
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01')
    expect(addDays('2026-10-24', 21)).toBe('2026-11-14')
  })
})
