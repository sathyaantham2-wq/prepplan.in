import { describe, expect, it } from 'vitest'
import { DEFAULT_DIFFICULTY_MIX, normalizeMix, pickNext } from './fill-rank'
import type { RankCandidate } from './fill-rank'

const c = (id: string, difficulty: RankCandidate['difficulty'], lastUsedMs: number | null, bloom: RankCandidate['bloom'] = 'Understand'): RankCandidate => ({ id, difficulty, bloom, lastUsedMs })
const empty = { marksByDifficulty: {}, marksByLevel: {}, totalMarks: 0 }
const levels = { recall_understanding: 50, application: 30, analysis_evaluation: 20 }
const first = () => 0

describe('pickNext', () => {
  it('takes the difficulty furthest below its target share', () => {
    const state = { marksByDifficulty: { Easy: 6, Hard: 4, Hardest: 0 }, marksByLevel: {}, totalMarks: 10 }
    const pick = pickNext([c('e', 'Easy', null), c('h', 'Hard', null), c('x', 'Hardest', null)], state, DEFAULT_DIFFICULTY_MIX, levels, first)
    expect(pick?.id).toBe('x') // Hardest 0% of a 20% target is the biggest gap
  })

  it('makes every difficulty appear: a tier missing from the paper comes next even if only used questions remain', () => {
    const state = { marksByDifficulty: { Easy: 5, Hard: 5 }, marksByLevel: {}, totalMarks: 10 }
    const pick = pickNext([c('e', 'Easy', null), c('x', 'Hardest', 1000)], state, DEFAULT_DIFFICULTY_MIX, levels, first)
    expect(pick?.id).toBe('x')
  })

  it('prefers a question never printed, then the least recently used', () => {
    expect(pickNext([c('old', 'Easy', 5), c('new', 'Easy', null)], empty, DEFAULT_DIFFICULTY_MIX, levels, first)?.id).toBe('new')
    expect(pickNext([c('b', 'Easy', 900), c('a', 'Easy', 100), c('c', 'Easy', 500)], empty, DEFAULT_DIFFICULTY_MIX, levels, first)?.id).toBe('a')
  })

  it('breaks a tie toward the thinking level furthest below the template mix', () => {
    const state = { marksByDifficulty: {}, marksByLevel: { recall_understanding: 10 }, totalMarks: 10 }
    const pick = pickNext([c('r', 'Easy', null, 'Remember'), c('a', 'Easy', null, 'Apply')], state, DEFAULT_DIFFICULTY_MIX, levels, first)
    expect(pick?.id).toBe('a')
  })

  it('skips a tier the teacher set to 0 while another is available, and falls back when nothing else exists', () => {
    const mix = { Easy: 100, Hard: 0, Hardest: 0 }
    expect(pickNext([c('h', 'Hard', null), c('e', 'Easy', null)], empty, mix, levels, first)?.id).toBe('e')
    expect(pickNext([c('h', 'Hard', null)], empty, mix, levels, first)?.id).toBe('h')
  })

  it('returns nothing for no candidates', () => {
    expect(pickNext([], empty, DEFAULT_DIFFICULTY_MIX, levels)).toBeUndefined()
  })
})

describe('normalizeMix', () => {
  it('uses the default unless the teacher gave a usable mix', () => {
    expect(normalizeMix(undefined)).toEqual(DEFAULT_DIFFICULTY_MIX)
    expect(normalizeMix({ Easy: 0, Hard: 0, Hardest: 0 })).toEqual(DEFAULT_DIFFICULTY_MIX)
    expect(normalizeMix({ Easy: 60, Hard: 30, Hardest: 10 })).toEqual({ Easy: 60, Hard: 30, Hardest: 10 })
  })
})
