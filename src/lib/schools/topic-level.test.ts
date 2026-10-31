import { describe, expect, it } from 'vitest'
import { topicLevel } from './topic-level'
import type { Level } from './topic-level'

// scores as percentages out of 4 available marks, one per exam, oldest first
const run = (...pct: Array<number>) =>
  topicLevel(
    pct.map((p, i) => ({ at: `2026-0${i + 1}-01`, earned: (p / 100) * 4, available: 4 })),
  )
const lv = (...pct: Array<number>): Level | null => run(...pct).level

describe('topic level (the owner-approved rule, plan section 15.2)', () => {
  it('no evidence means no level; one mark is not evidence', () => {
    expect(topicLevel([]).level).toBeNull()
    expect(topicLevel([{ at: '2026-01-01', earned: 1, available: 1 }]).level).toBeNull()
    expect(topicLevel([{ at: '2026-01-01', earned: 2, available: 2 }]).level).toBe('progressing')
  })
  it('one exam never makes anyone Proficient', () => {
    expect(lv(100)).toBe('progressing')
    expect(lv(75)).toBe('progressing')
    expect(lv(60)).toBe('progressing')
    expect(lv(25)).toBe('beginner')
    expect(lv(49)).toBe('beginner')
  })
  it('rises one step on two scores in a row at the bar', () => {
    expect(lv(25, 50)).toBe('beginner') // one good score is not enough
    expect(lv(25, 50, 75)).toBe('progressing')
    expect(lv(75, 75)).toBe('proficient')
    expect(lv(60, 100)).toBe('progressing') // 60 is below the 75 bar
    expect(lv(100, 100)).toBe('proficient')
  })
  it('one bad test does not erase mastery: a dip is only marked', () => {
    const r = run(100, 100, 25)
    expect(r.level).toBe('proficient')
    expect(r.dip).toBe(true)
    expect(lv(100, 100, 25, 100)).toBe('proficient')
  })
  it('two weak tests in a row bring a level down, one step at a time', () => {
    expect(lv(100, 100, 25, 25)).toBe('progressing')
    expect(lv(100, 100, 60, 60)).toBe('progressing')
    expect(lv(100, 100, 25, 25, 25, 25)).toBe('beginner')
    // a good score between them breaks the pair
    expect(lv(100, 100, 25, 80, 25)).toBe('proficient')
  })
  it('a Beginner is not pulled down further, and scores in the middle hold a Progressing', () => {
    expect(lv(25, 25, 25)).toBe('beginner')
    expect(lv(60, 60, 60)).toBe('progressing')
    expect(lv(60, 40, 60)).toBe('progressing')
    expect(lv(60, 40, 40)).toBe('beginner')
  })
  it('exams are taken in date order whatever order they arrive in', () => {
    const shuffled = topicLevel([
      { at: '2026-03-01', earned: 1, available: 4 },
      { at: '2026-01-01', earned: 4, available: 4 },
      { at: '2026-02-01', earned: 4, available: 4 },
    ])
    expect(shuffled.level).toBe('proficient')
    expect(shuffled.dip).toBe(true)
    expect(shuffled.evidence).toBe(3)
  })
  it('exams that do not count are ignored, not counted as zero', () => {
    const r = topicLevel([
      { at: '2026-01-01', earned: 4, available: 4 },
      { at: '2026-02-01', earned: 0, available: 1 },
      { at: '2026-03-01', earned: 4, available: 4 },
    ])
    expect(r.level).toBe('proficient')
    expect(r.evidence).toBe(2)
  })
})
