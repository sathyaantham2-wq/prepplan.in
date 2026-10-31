import { describe, expect, it } from 'vitest'
import {
  combinePasses,
  mcqKeyLabel,
  parsePass,
  totalsOf
  
  
} from './marking-logic'
import type {MarkQuestion, PassAnswer} from './marking-logic';

const written: MarkQuestion = {
  id: 'q1',
  no: '1',
  text: 'Explain why 0.5 is greater than 0.05.',
  marks: 3,
  type: 'short_answer',
  options: [],
  keyText: 'Tenths are larger than hundredths.',
  keySteps: [
    { description: 'compares tenths', marks: 1 },
    { description: 'compares hundredths', marks: 1 },
    { description: 'concludes', marks: 1 },
  ],
  orGroup: null,
}
const mcq: MarkQuestion = {
  ...written,
  id: 'q2',
  no: '2',
  marks: 1,
  type: 'mcq',
  options: ['A', 'B', 'C', 'D'].map((label) => ({ label, text: `opt ${label}` })),
  keyText: 'Correct option: (B) opt B',
  keySteps: [],
}
const pass = (over: Partial<PassAnswer> = {}): PassAnswer => ({
  question: '1',
  found: true,
  answer_text: 'because tenths are bigger',
  choice: null,
  marks: 2,
  steps: [],
  loss_kind: 'writing_habit',
  habit: 'stopped_early',
  loss_reason: 'stopped before the conclusion',
  confidence: 0.9,
  ...over,
})

describe('combinePasses (written)', () => {
  it('three equal marks stand, nothing flagged, the reason of the lost mark is kept', () => {
    const r = combinePasses(written, [pass(), pass(), pass()])
    expect(r.flagged).toBe(false)
    expect(r.finalMarks).toBe(2)
    expect(r.lossKind).toBe('writing_habit')
    expect(r.lossReason).toBe('stopped before the conclusion')
  })
  it('passes that differ are flagged and the middle mark is the provisional one', () => {
    const r = combinePasses(written, [pass({ marks: 1 }), pass({ marks: 3, loss_kind: 'none' }), pass({ marks: 2 })])
    expect(r.flagged).toBe(true)
    expect(r.finalMarks).toBe(2)
    expect(r.flagReason).toContain('1, 2, 3 out of 3')
  })
  it('an unsure reading is flagged even when the marks agree', () => {
    const r = combinePasses(written, [pass(), pass({ confidence: 0.3 }), pass()])
    expect(r.flagged).toBe(true)
    expect(r.flagReason).toContain('hard to read')
  })
  it('marks above the question or in odd steps are brought into range', () => {
    const r = combinePasses(written, [pass({ marks: 7 }), pass({ marks: 7 }), pass({ marks: 3.2 })])
    expect(r.finalMarks).toBe(3)
    expect(r.flagged).toBe(false)
    expect(r.lossKind).toBe('none')
  })
  it('a lost mark whose reason the passes dispute is "unclear", not guessed', () => {
    const r = combinePasses(written, [
      pass({ loss_kind: 'knowledge_gap' }),
      pass({ loss_kind: 'writing_habit' }),
      pass({ loss_kind: 'none' }),
    ])
    expect(r.lossKind).toBe('unclear')
  })
  it('not found in all three readings is zero marks, not a flag', () => {
    const r = combinePasses(written, [pass({ found: false }), pass({ found: false }), pass({ found: false })])
    expect(r.flagged).toBe(false)
    expect(r.finalMarks).toBe(0)
    expect(r.found).toBe(false)
  })
  it('found in some readings only is flagged', () => {
    const r = combinePasses(written, [pass(), pass({ found: false }), pass()])
    expect(r.flagged).toBe(true)
  })
  it('fewer than three usable readings is flagged', () => {
    expect(combinePasses(written, [pass(), undefined, pass()]).flagged).toBe(true)
  })
})

describe('habit and marks per step', () => {
  it('the habit most readings named is kept; none named is "other"; no habit when nothing was lost to writing', () => {
    expect(combinePasses(written, [pass(), pass(), pass()]).habit).toBe('stopped_early')
    expect(
      combinePasses(written, [pass({ habit: 'units_missing' }), pass({ habit: 'units_missing' }), pass({ habit: 'skipped_steps' })]).habit,
    ).toBe('units_missing')
    expect(combinePasses(written, [pass({ habit: null }), pass({ habit: null }), pass({ habit: null })]).habit).toBe('other')
    expect(
      combinePasses(written, [pass({ loss_kind: 'knowledge_gap' }), pass({ loss_kind: 'knowledge_gap' }), pass({ loss_kind: 'knowledge_gap' })]).habit,
    ).toBeNull()
    expect(combinePasses(written, [pass({ marks: 3, loss_kind: 'none' }), pass({ marks: 3, loss_kind: 'none' }), pass({ marks: 3, loss_kind: 'none' })]).habit).toBeNull()
  })
  it('marks per step come from the reading with the middle mark, against the approved scheme', () => {
    const steps = [{ step: 1, awarded: 1 }, { step: 2, awarded: 1 }]
    const r = combinePasses(written, [pass({ steps }), pass({ steps }), pass({ steps })])
    expect(r.steps).toEqual([
      { no: 1, description: 'compares tenths', awarded: 1, max: 1 },
      { no: 2, description: 'compares hundredths', awarded: 1, max: 1 },
      { no: 3, description: 'concludes', awarded: 0, max: 1 },
    ])
    expect(combinePasses(written, [pass(), pass(), pass()]).steps).toEqual([])
  })
})

describe('combinePasses (multiple choice)', () => {
  it('is marked from the key in code, whatever marks the AI wrote', () => {
    const right = combinePasses(mcq, [pass({ choice: 'b', marks: 0 }), pass({ choice: 'B', marks: 0 }), pass({ choice: 'B', marks: 0 })])
    expect(right.finalMarks).toBe(1)
    expect(right.lossKind).toBe('none')
    const wrong = combinePasses(mcq, [pass({ choice: 'C', marks: 1 }), pass({ choice: 'C', marks: 1 }), pass({ choice: 'C', marks: 1 })])
    expect(wrong.finalMarks).toBe(0)
    expect(wrong.lossKind).toBe('knowledge_gap')
    expect(wrong.flagged).toBe(false)
  })
  it('readings that name different options are flagged', () => {
    const r = combinePasses(mcq, [pass({ choice: 'B' }), pass({ choice: 'D' }), pass({ choice: 'B' })])
    expect(r.flagged).toBe(true)
    expect(r.finalMarks).toBe(0)
  })
  it('a key that names no option is flagged, never guessed', () => {
    const r = combinePasses({ ...mcq, keyText: 'twelve' }, [pass({ choice: 'B' }), pass({ choice: 'B' }), pass({ choice: 'B' })])
    expect(r.flagged).toBe(true)
  })
})

describe('mcqKeyLabel', () => {
  it('reads the option from the key text', () => {
    expect(mcqKeyLabel({ keyText: 'Correct option: (C) 7' })).toBe('C')
    expect(mcqKeyLabel({ keyText: 'd' })).toBe('D')
    expect(mcqKeyLabel({ keyText: 'seven' })).toBeNull()
  })
})

describe('totalsOf', () => {
  it('an OR pair counts once, as the better answer', () => {
    const qs = [
      { id: 'a', marks: 5, orGroup: 'g1' },
      { id: 'b', marks: 5, orGroup: 'g1' },
      { id: 'c', marks: 1, orGroup: null },
    ]
    expect(totalsOf(qs, new Map([['a', 0], ['b', 4], ['c', 1]]))).toEqual({ total: 5, max: 6 })
  })
})

describe('parsePass', () => {
  it('accepts the agreed shape and refuses anything else', () => {
    expect(parsePass('{"answers":[{"question":"1","found":true,"marks":2}]}')?.answers[0].marks).toBe(2)
    expect(parsePass('not json')).toBeNull()
    expect(parsePass('{"answers":"x"}')).toBeNull()
  })
})
