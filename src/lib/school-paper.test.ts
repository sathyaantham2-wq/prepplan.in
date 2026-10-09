import { describe, expect, it } from 'vitest'
import {
  checkPaperStructure,
  isPossiblyStoppedEarly,
  levelOfBloom,
  markSplit,
  parseHalfYearlyConfig,
  practiceLayout,
  PRACTICE_COUNTS,
  socialScienceLayout,
  stemLayout,
} from './school-paper'
import type { CheckSlot, Layout } from './school-paper'

const marksOf = (l: Layout) => l.sections.reduce((n, s) => n + s.marks_per_question * s.count, 0)
const countOf = (l: Layout) => l.sections.reduce((n, s) => n + s.count, 0)
const orOf = (l: Layout) => l.sections.reduce((n, s) => n + (s.or_count ?? 0), 0)

describe('School Half-Yearly layouts', () => {
  it('Social Science is 80 marks, 37 questions, History 25 / Geography 25 / Civics 20 / Economics 10', () => {
    const l = socialScienceLayout()
    expect(marksOf(l)).toBe(80)
    expect(l.total_marks).toBe(80)
    expect(countOf(l)).toBe(37)
    expect(Object.values(l.config.section_totals)).toEqual([25, 25, 20, 10])
    expect(l.config.level_mix).toEqual({ recall_understanding: 50, application: 30, analysis_evaluation: 20 })
    expect(orOf(l)).toBe(8)
  })

  it('Maths/Science is the five-section pattern, 80 marks, marked as a draft', () => {
    const l = stemLayout('Mathematics')
    expect(marksOf(l)).toBe(80)
    expect(Object.values(l.config.section_totals)).toEqual([20, 10, 18, 20, 12])
    expect(l.config.level_mix).toEqual({ recall_understanding: 25, application: 45, analysis_evaluation: 30 })
    expect(l.config.draft).toBe(true)
    expect(orOf(l)).toBe(8)
    // 20 x 1-mark includes exactly 2 assertion-reason
    const a = l.sections.filter((s) => s.name === l.config.section_order[0])
    expect(a.find((s) => s.types?.includes('assertion_reason'))?.count).toBe(2)
  })

  it('both layouts carry the word limits and every Bloom target sums to 100', () => {
    for (const l of [socialScienceLayout(), stemLayout('Science')]) {
      expect(l.config.word_limits).toEqual({ '2': 40, '3': 60, '4': 100, '5': 120 })
      expect(Object.values(l.bloom_targets).reduce((n, v) => n + v, 0)).toBe(100)
      expect(Object.values(l.config.level_mix).reduce((n, v) => n + v, 0)).toBe(100)
      expect(l.config.section_order.length).toBe(Object.keys(l.config.section_totals).length)
    }
  })

  it('survives the jsonb round trip', () => {
    const l = socialScienceLayout()
    expect(parseHalfYearlyConfig(JSON.parse(JSON.stringify(l.config)))?.kind).toBe('school_half_yearly')
    expect(parseHalfYearlyConfig({})).toBeNull()
    expect(parseHalfYearlyConfig(null)).toBeNull()
  })
})

describe('thinking levels, mark split, stopped-early flag', () => {
  it('maps Bloom to the three thinking levels', () => {
    expect(levelOfBloom('Remember')).toBe('recall_understanding')
    expect(levelOfBloom('Understand')).toBe('recall_understanding')
    expect(levelOfBloom('Apply')).toBe('application')
    expect(levelOfBloom('Analyse')).toBe('analysis_evaluation')
    expect(levelOfBloom('Create')).toBe('analysis_evaluation')
  })

  it('prints a split only when the scheme has more than one part', () => {
    expect(markSplit([1, 2])).toBe('(1+2)')
    expect(markSplit([1, 1, 2])).toBe('(1+1+2)')
    expect(markSplit([3])).toBe('')
  })

  it('flags an answer under half the expected length, and only then', () => {
    const sixtyWords = Array.from({ length: 60 }, () => 'word').join(' ')
    expect(isPossiblyStoppedEarly('too short', 60)).toBe(true)
    expect(isPossiblyStoppedEarly(sixtyWords.split(' ').slice(0, 29).join(' '), 60)).toBe(true)
    expect(isPossiblyStoppedEarly(sixtyWords.split(' ').slice(0, 30).join(' '), 60)).toBe(false)
    expect(isPossiblyStoppedEarly(sixtyWords, 60)).toBe(false)
    // blank is "not attempted", a different diagnosis; no expectation means no flag
    expect(isPossiblyStoppedEarly('', 60)).toBe(false)
    expect(isPossiblyStoppedEarly('  ', 60)).toBe(false)
    expect(isPossiblyStoppedEarly('short', null)).toBe(false)
  })
})

describe('pre-show structural checks', () => {
  const slot = (over: Partial<CheckSlot>): CheckSlot => ({
    section: 'A', position: 1, marks: 1, type: 'mcq', optionCount: 4,
    choiceGroup: null, isChoiceAlternate: false, ...over,
  })
  const totals = { A: 3 }

  it('passes a clean paper', () => {
    const slots = [slot({ position: 1 }), slot({ position: 2 }), slot({ position: 3 })]
    expect(checkPaperStructure(slots, [], totals, 3)).toEqual([])
  })

  it('counts an OR pair once, for numbering and for marks', () => {
    const slots = [
      slot({ position: 1 }),
      slot({ position: 2, choiceGroup: 'g' }),
      slot({ position: 2, choiceGroup: 'g', isChoiceAlternate: true }),
      slot({ position: 3 }),
    ]
    expect(checkPaperStructure(slots, [], totals, 3)).toEqual([])
  })

  it('catches a gap in the numbering', () => {
    const slots = [slot({ position: 1 }), slot({ position: 3 }), slot({ position: 4 })]
    expect(checkPaperStructure(slots, [], totals, 3).join()).toMatch(/not continuous/)
  })

  it('catches a multiple-choice question without four options', () => {
    const slots = [slot({ position: 1, optionCount: 3 }), slot({ position: 2 }), slot({ position: 3 })]
    expect(checkPaperStructure(slots, [], totals, 3).join()).toMatch(/3 options, not 4/)
  })

  it('catches a question that went missing without a shortfall note', () => {
    const slots = [slot({ position: 1 }), slot({ position: 2 })]
    expect(checkPaperStructure(slots, [], totals, 3).join()).toMatch(/not the section total of 3/)
  })

  it('a reported shortfall reconciles the section instead of failing it', () => {
    const slots = [slot({ position: 1 }), slot({ position: 2 })]
    expect(checkPaperStructure(slots, [{ section: 'A', marksMissing: 1 }], totals, 3)).toEqual([])
  })

  it('catches section totals that do not add up to the paper total', () => {
    const slots = [slot({ position: 1 }), slot({ position: 2 }), slot({ position: 3 })]
    expect(checkPaperStructure(slots, [], totals, 80).join()).toMatch(/add to 3, not the paper total of 80/)
  })
})

describe('DPS practice layouts (10, 15 and 30 questions)', () => {
  it('has exactly the number of questions the student picked', () => {
    for (const kind of ['stem', 'social'] as const) {
      for (const count of PRACTICE_COUNTS) {
        const l = practiceLayout(kind, count, 'X')
        expect(countOf(l)).toBe(count)
        expect(l.config.question_count).toBe(count)
        expect(l.total_marks).toBe(marksOf(l))
        expect(Object.values(l.config.section_totals).reduce((n, v) => n + v, 0)).toBe(l.total_marks)
      }
    }
  })

  it('a 30-question paper is the DPS revision pattern: 12 multiple choice, 8 two-mark, 7 longer, 3 case studies', () => {
    const l = practiceLayout('stem', 30, 'Mathematics')
    const by = (pred: (s: Layout['sections'][number]) => boolean) => l.sections.filter(pred).reduce((n, s) => n + s.count, 0)
    expect(by((s) => s.marks_per_question === 1)).toBe(12)
    expect(by((s) => s.marks_per_question === 2)).toBe(8)
    expect(by((s) => s.marks_per_question === 3 || s.marks_per_question === 5)).toBe(7)
    expect(by((s) => s.tag === 'case_study')).toBe(3)
    expect(l.total_marks).toBe(67)
  })

  it('every length carries a case study, a 5-mark answer and the mix for its kind', () => {
    for (const count of PRACTICE_COUNTS) {
      const l = practiceLayout('social', count, 'Social Science')
      expect(l.sections.some((s) => s.tag === 'case_study')).toBe(true)
      expect(l.sections.some((s) => s.marks_per_question === 5)).toBe(true)
      expect(l.config.level_mix).toEqual({ recall_understanding: 50, application: 30, analysis_evaluation: 20 })
      expect(Object.values(l.bloom_targets).reduce((n, v) => n + v, 0)).toBe(100)
    }
    expect(practiceLayout('stem', 10, 'M').config.level_mix.application).toBe(45)
  })
})
