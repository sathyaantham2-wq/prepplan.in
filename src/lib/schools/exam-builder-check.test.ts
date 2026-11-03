import { describe, expect, it } from 'vitest'
import { checkPaper, fitsSlot, levelWord, renumber } from './exam-builder-check'
import type { BuilderPick } from './exam-builder-check'
import type { Layout } from '../school-paper'

const layout = {
  sections: [
    { name: 'Section A', slot: 'MCQ', marks_per_question: 1, count: 2, bloom_allowed: [], types: ['mcq' as const] },
    { name: 'Section C', slot: '3-mark short answer', marks_per_question: 3, count: 2, bloom_allowed: [], or_count: 1 },
  ],
  config: { level_mix: { recall_understanding: 50, application: 30, analysis_evaluation: 20 } },
} as unknown as Pick<Layout, 'sections' | 'config'>
const chapters = [
  { id: 'c3', label: 'Chapter 3' },
  { id: 'c4', label: 'Chapter 4' },
]
const pick = (over: Partial<BuilderPick>): BuilderPick => ({
  questionId: Math.random().toString(36),
  section: 'Section A',
  slot: 'MCQ',
  marks: 1,
  type: 'mcq',
  chapterId: 'c3',
  bloom: 'Remember',
  isAlternate: false,
  choiceGroup: null,
  ...over,
})
const c = (over: Partial<BuilderPick> = {}) => pick({ section: 'Section C', slot: '3-mark short answer', marks: 3, type: 'short_answer', ...over })

describe('the live checklist', () => {
  it('a full, balanced paper is complete with no warnings', () => {
    const r = checkPaper(layout, [pick({}), pick({ chapterId: 'c4' }), c({ bloom: 'Apply', choiceGroup: 'g1' }), c({ isAlternate: true, choiceGroup: 'g1', chapterId: 'c4' }), c({ chapterId: 'c4', bloom: 'Analyse' })], chapters)
    expect(r.complete).toBe(true)
    expect(r.marks).toEqual({ picked: 8, target: 8 })
    expect(r.questions).toEqual({ picked: 4, target: 4 })
    expect(r.warnings).toEqual(['Many think questions: only 25% of the marks are remember questions (the pattern aims for about 50%).'])
  })

  it('says in plain words what is missing', () => {
    const r = checkPaper(layout, [pick({})], chapters)
    expect(r.complete).toBe(false)
    expect(r.warnings).toContain('Section A needs 1 more 1-mark question (MCQ).')
    expect(r.warnings).toContain('Section C needs 2 more 3-mark questions (3-mark short answer).')
    expect(r.warnings).toContain('Section C: 1 OR question still needs its second option.')
    expect(r.warnings).toContain('Chapter 4 has no questions yet.')
  })

  it('counts an OR pair once for marks and flags a section with too many', () => {
    const r = checkPaper(layout, [pick({}), pick({}), pick({}), c({ choiceGroup: 'g' }), c({ isAlternate: true, choiceGroup: 'g' })], chapters)
    expect(r.marks.picked).toBe(6)
    expect(r.warnings).toContain('Section A has 1 question too many (MCQ).')
    expect(r.complete).toBe(false)
  })

  it('knows which questions fit a slot and what to call their level', () => {
    expect(fitsSlot({ marks: 1, type: 'mcq' }, layout.sections[0])).toBe(true)
    expect(fitsSlot({ marks: 1, type: 'short_answer' }, layout.sections[0])).toBe(false)
    expect(fitsSlot({ marks: 3, type: 'long_answer' }, layout.sections[1])).toBe(true)
    expect(levelWord('Understand')).toBe('Remember')
    expect(levelWord('Evaluate')).toBe('Think')
  })

  it('numbers the paper continuously; an OR pair shares its number', () => {
    const rows = [
      { id: 'c2', section: 'Section C', slot: '3-mark short answer', isAlternate: false, choiceGroup: null, order: 2 },
      { id: 'a1', section: 'Section A', slot: 'MCQ', isAlternate: false, choiceGroup: null, order: 1 },
      { id: 'c1', section: 'Section C', slot: '3-mark short answer', isAlternate: false, choiceGroup: 'g', order: 1 },
      { id: 'c1b', section: 'Section C', slot: '3-mark short answer', isAlternate: true, choiceGroup: 'g', order: 9 },
    ]
    expect(renumber(layout, rows).map((r) => `${r.id}:${r.position}`)).toEqual(['a1:1', 'c1:2', 'c1b:2', 'c2:3'])
  })
})
