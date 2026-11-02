import { describe, expect, it } from 'vitest'
import type { AnswerRow } from '../progress-calc'
import { examHighlights, firstName } from './content'

const row = (topic: string, earned: number, max: number, extra: Partial<AnswerRow> = {}): AnswerRow => ({
  paperId: 'p1',
  questionId: `${topic}-${earned}-${max}-${Math.random()}`,
  questionNo: '1',
  orGroup: null,
  found: true,
  finalMarks: earned,
  maxMarks: max,
  lossKind: earned < max ? 'knowledge_gap' : 'none',
  habit: null,
  lossReason: null,
  topicKey: topic,
  topicLabel: topic,
  ...extra,
})

describe('what a parent is told', () => {
  it('names one strength and the two topics that cost the most marks', () => {
    const h = examHighlights('p1', [row('Fractions', 5, 5), row('Decimals', 2, 5), row('Ratio', 2, 6), row('Angles', 4, 5)])
    expect(h.strength).toBe('Fractions')
    expect(h.practise).toEqual(['Ratio', 'Decimals'])
  })

  it('says no strength when nothing reached half marks, and never repeats the strength as a practice item', () => {
    expect(examHighlights('p1', [row('A', 1, 5), row('B', 2, 5)]).strength).toBeNull()
    const h = examHighlights('p1', [row('Only', 3, 5)])
    expect(h.strength).toBe('Only')
    expect(h.practise).toEqual([])
  })

  it('counts only one of two OR alternatives', () => {
    const h = examHighlights('p1', [
      row('A', 4, 5, { orGroup: 'g1', found: true }),
      row('B', 0, 5, { orGroup: 'g1', found: false }),
    ])
    expect(h.practise).toEqual([])
  })

  it('has nothing to say about other papers', () => {
    expect(examHighlights('other', [row('A', 1, 5)])).toEqual({ strength: null, practise: [] })
  })

  it('the parent shape carries no level, dip, fall or rank', () => {
    const h = examHighlights('p1', [row('A', 1, 5), row('B', 5, 5)])
    expect(Object.keys(h).sort()).toEqual(['practise', 'strength'])
  })

  it('first name only', () => {
    expect(firstName('  Nainika Reddy Gaddam ')).toBe('Nainika')
    expect(firstName('Asha')).toBe('Asha')
  })
})
