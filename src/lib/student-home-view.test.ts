import { describe, expect, it } from 'vitest'
import {
  biggerSlice,
  donutArcs,
  donutCircumference,
  examChipText,
  firstNotDoneIndex,
  fixItButtonLabel,
  isFirstRun,
  leaderboardLine,
  mapLine,
  missionProgress,
  paperStoryLine,
} from './student-home-view'

const step = (key: 'check' | 'fixit' | 'paper', done: boolean) => ({ key, label: key, hint: '', done, href: '/x' })

describe('mission', () => {
  it('counts n of 3 and a percentage from the steps', () => {
    const m = { steps: [step('check', true), step('fixit', true), step('paper', false)], done_count: 2 }
    expect(missionProgress(m)).toEqual({ done: 2, total: 3, pct: 67, label: '2 of 3' })
  })
  it('survives a missing mission', () => {
    expect(missionProgress(undefined)).toEqual({ done: 0, total: 0, pct: 0, label: '0 of 0' })
    expect(firstNotDoneIndex([])).toBe(-1)
  })
  it('finds the first step not done', () => {
    expect(firstNotDoneIndex([step('check', true), step('fixit', false), step('paper', false)])).toBe(1)
    expect(firstNotDoneIndex([step('check', true)])).toBe(-1)
  })
  it('skips a waiting step when picking the highlight', () => {
    const waiting = { ...step('fixit', false), waiting: true }
    expect(firstNotDoneIndex([step('check', false), waiting, step('paper', false)])).toBe(0)
    expect(firstNotDoneIndex([step('check', true), waiting, step('paper', false)])).toBe(2)
    expect(firstNotDoneIndex([step('check', true), waiting, step('paper', true)])).toBe(-1)
  })
  it('detects a first run only with nothing done and no marked paper', () => {
    const fresh = { steps: [step('check', false), step('fixit', false), step('paper', false)], done_count: 0 }
    expect(isFirstRun(fresh, null)).toBe(true)
    expect(isFirstRun(fresh, { attempt_id: 'a', title: 't', total: 1, scored: 1, lost_knowledge: 0, lost_habit: 0 })).toBe(false)
    expect(isFirstRun({ ...fresh, steps: [step('check', true), step('fixit', false)] }, null)).toBe(false)
  })
})

describe('exam chip', () => {
  const e = (days: number, n: number) => ({ exam_name: 'x', exam_date: '2026-11-16', days_remaining: days, untested_chapters: n })
  it('words days and chapters', () => {
    expect(examChipText(e(23, 6))).toBe('Exam in 23 days · 6 chapters not tried yet')
    expect(examChipText(e(1, 1))).toBe('Exam tomorrow · 1 chapter not tried yet')
    expect(examChipText(e(0, 0))).toBe('Exam today · every chapter tried')
  })
  it('hides when absent or past', () => {
    expect(examChipText(null)).toBeNull()
    expect(examChipText(undefined)).toBeNull()
    expect(examChipText(e(-2, 3))).toBeNull()
  })
})

describe('donut', () => {
  it('splits the ring in proportion and chains the offset', () => {
    const r = 40
    const c = donutCircumference(r)
    const arcs = donutArcs(3, 1, r)
    expect(arcs.map((a) => a.cause)).toEqual(['knowledge', 'habit'])
    expect(arcs[0].length).toBeCloseTo(c * 0.75)
    expect(arcs[1].dashoffset).toBeCloseTo(-c * 0.75)
    expect(arcs[0].length + arcs[1].length).toBeCloseTo(c)
  })
  it('draws one arc when one total is zero and none when both are', () => {
    expect(donutArcs(0, 4, 40)).toHaveLength(1)
    expect(donutArcs(0, 0, 40)).toEqual([])
    expect(donutArcs(NaN, -3, 40)).toEqual([])
  })
  it('picks the bigger slice, ties to habit', () => {
    expect(biggerSlice(5, 2)).toBe('knowledge')
    expect(biggerSlice(2, 5)).toBe('habit')
    expect(biggerSlice(3, 3)).toBe('habit')
    expect(biggerSlice(0, 0)).toBeNull()
    expect(mapLine(0, 0)).toBe('')
    expect(mapLine(1, 4)).toContain('You knew more than this shows: 4 marks')
    expect(mapLine(1, 0)).toContain('1 mark came')
  })
})

describe('sentences', () => {
  it('keeps the paper story logic', () => {
    expect(paperStoryLine(0, 0)).toMatch(/^Full marks/)
    expect(paperStoryLine(1, 2)).toMatch(/^You knew more than this paper shows/)
    expect(paperStoryLine(3, 1)).toMatch(/not solid yet/)
  })
  it('labels the Fix-it button', () => {
    expect(fixItButtonLabel(0)).toBe('Nothing to fix today')
    expect(fixItButtonLabel(1)).toBe('Fix 1 card')
    expect(fixItButtonLabel(9)).toBe('Fix 3 cards')
  })
  it('words the class rank only when opted in', () => {
    expect(leaderboardLine({ opted_in: true, rank: 3, class_size: 28, top: [] })).toBe('You are #3 of 28 in your class')
    expect(leaderboardLine({ opted_in: false, rank: null, class_size: null, top: [] })).toBeNull()
    expect(leaderboardLine(undefined)).toBeNull()
  })
})
