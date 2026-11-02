import { describe, expect, it } from 'vitest'
import { criteriaAsSteps, keptDraft, parseCriteria, wantsRubric } from './rubric'

const c = (over: Record<string, unknown> = {}) => ({ kind: 'concept', marks: 2, descriptor: 'names it', levels: [{ marks: 2, says: 'fully' }, { marks: 1, says: 'partly' }], ...over })

describe('rubric rules', () => {
  it('accepts criteria that add up to the question, in half marks', () => {
    const r = parseCriteria([c({ marks: 1.5, levels: [{ marks: 1.5, says: 'fully' }] }), c({ kind: 'conclusion', marks: 0.5, levels: [] })], 2)
    expect(r.ok).toBe(true)
  })
  it('refuses a wrong total, a bad kind, empty text, bad levels, NaN and too many criteria', () => {
    expect(parseCriteria([c()], 3)).toMatchObject({ ok: false })
    for (const bad of [c({ kind: 'x' }), c({ descriptor: ' ' }), c({ marks: Number.NaN }), c({ marks: 0 }), c({ marks: '2' }), c({ marks: 2.3 }), c({ levels: [{ marks: 3, says: 'over' }] }), c({ levels: [{ marks: 1, says: '' }] })])
      expect(parseCriteria([bad], 2)).toMatchObject({ ok: false })
    expect(parseCriteria(Array(9).fill(c({ marks: 1 })), 9)).toMatchObject({ ok: false })
    expect(parseCriteria([], 0)).toMatchObject({ ok: false })
    expect(parseCriteria('x', 2)).toMatchObject({ ok: false })
  })
  it('reads a rubric as one marking step per criterion, with its levels', () => {
    const r = parseCriteria([c()], 2)
    if (!r.ok) throw new Error('x')
    expect(criteriaAsSteps(r.criteria)).toEqual([{ description: 'concept: names it (2 if fully; 1 if partly)', marks: 2 }])
  })
  it('a Telugu rubric round-trips unchanged', () => {
    const r = parseCriteria([c({ descriptor: 'ప్రధాన భావాన్ని చెప్పడం', levels: [{ marks: 2, says: 'పూర్తిగా' }] })], 2)
    if (!r.ok) throw new Error('x')
    expect(JSON.parse(JSON.stringify(r.criteria))).toEqual(r.criteria)
    expect(criteriaAsSteps(r.criteria)[0].description).toContain('ప్రధాన భావాన్ని')
  })
})

describe('drafting a rubric', () => {
  const good = [c({ marks: 2, levels: [{ marks: 2, says: 'fully' }] }), c({ kind: 'conclusion', marks: 1, levels: [] })]
  it('only descriptive subjects get a rubric, for written answers of 3 or more marks', () => {
    expect(wantsRubric('Social Science', 'long_answer', 5)).toBe(true)
    expect(wantsRubric('Telugu', 'short_answer', 3)).toBe(true)
    expect(wantsRubric('Social Science', 'short_answer', 2)).toBe(false)
    expect(wantsRubric('Social Science', 'mcq', 3)).toBe(false)
    expect(wantsRubric('Mathematics', 'long_answer', 5)).toBe(false)
    expect(wantsRubric('Science', 'long_answer', 5)).toBe(false)
  })
  it('keeps a drafted rubric that adds up', () => {
    const k = keptDraft('Social Science', { type: 'long_answer', marks: 3 }, { steps: [], criteria: good })
    expect(k.kind).toBe('rubric')
    expect(k.criteria).toHaveLength(2)
    expect(k.steps).toEqual([])
  })
  it('a rubric that does not add up falls back to steps that do, or to none', () => {
    const steps = [{ description: 'a', marks: 1 }, { description: 'b', marks: 2 }]
    expect(keptDraft('Social Science', { type: 'long_answer', marks: 4 }, { steps, criteria: good })).toMatchObject({ kind: 'steps', steps: [], criteria: [] })
    expect(keptDraft('Social Science', { type: 'long_answer', marks: 4 }, { steps: [...steps, { description: 'c', marks: 1 }], criteria: good })).toMatchObject({ kind: 'steps' })
  })
  it('a rubric drafted for a Maths question is ignored', () => {
    expect(keptDraft('Mathematics', { type: 'long_answer', marks: 3 }, { steps: [], criteria: good })).toMatchObject({ kind: 'steps', criteria: [] })
  })
})
