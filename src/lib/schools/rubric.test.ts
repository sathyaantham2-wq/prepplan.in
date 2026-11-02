import { describe, expect, it } from 'vitest'
import { criteriaAsSteps, parseCriteria } from './rubric'

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
