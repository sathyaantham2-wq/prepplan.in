import { describe, expect, it } from 'vitest'
import { stemLayout } from '../school-paper'
import {
  DEFAULT_TEMPLATES,
  computeTotal,
  toLayout,
  validateTemplate,
} from './templates'
import type { TemplateDefinition } from './templates'

const good = (): TemplateDefinition => ({
  name: 'My test',
  totalMarks: 12,
  durationMin: 45,
  levelMix: {
    recall_understanding: 40,
    application: 40,
    analysis_evaluation: 20,
  },
  sections: [
    { name: 'Section A', kind: 'mcq', count: 6, marks: 1, orCount: 0 },
    { name: 'Section B', kind: 'short_answer', count: 3, marks: 2, orCount: 1 },
  ],
})

describe('the ready-made layouts', () => {
  it('are exactly 80 and 40 marks and pass every rule', () => {
    expect(
      DEFAULT_TEMPLATES.map((t) => [t.key, t.totalMarks, t.durationMin]),
    ).toEqual([
      ['cbse_80', 80, 180],
      ['unit_test_40', 40, 90],
    ])
    for (const t of DEFAULT_TEMPLATES) {
      expect(validateTemplate(t), t.key).toEqual([])
      expect(computeTotal(t.sections), t.key).toBe(t.totalMarks)
    }
  })
  it('the 80-mark layout is the same as the built-in CBSE pattern the generator already knows', () => {
    const mine = toLayout(DEFAULT_TEMPLATES[0]).sections
    const theirs = stemLayout('x').sections
    const shape = (s: (typeof mine)[number]) => ({
      n: s.name.split(' — ')[0],
      marks: s.marks_per_question,
      count: s.count,
      or: s.or_count ?? 0,
      types: s.types ?? null,
      tag: s.tag ?? null,
    })
    expect(mine.map(shape)).toEqual(theirs.map(shape))
  })
  it('section totals and order come out right', () => {
    const l = toLayout(DEFAULT_TEMPLATES[1])
    expect(l.total_marks).toBe(40)
    expect(
      Object.values(l.config.section_totals).reduce((a, b) => a + b, 0),
    ).toBe(40)
    expect(l.config.section_order).toHaveLength(4)
    expect(l.config.level_mix).toEqual({
      recall_understanding: 40,
      application: 40,
      analysis_evaluation: 20,
    })
    expect(Object.values(l.bloom_targets).reduce((a, b) => a + b, 0)).toBe(100)
  })
})

describe('validateTemplate', () => {
  it('accepts a sound layout', () => {
    expect(validateTemplate(good())).toEqual([])
  })
  it.each([
    ['no name', (t: TemplateDefinition) => ({ ...t, name: ' ' }), /name/],
    [
      'marks do not add up',
      (t: TemplateDefinition) => ({ ...t, totalMarks: 20 }),
      /add up to 12/,
    ],
    [
      'time too short',
      (t: TemplateDefinition) => ({ ...t, durationMin: 5 }),
      /Time/,
    ],
    [
      'no rows',
      (t: TemplateDefinition) => ({ ...t, sections: [] }),
      /at least one/,
    ],
    [
      'thinking mix not 100',
      (t: TemplateDefinition) => ({
        ...t,
        levelMix: {
          recall_understanding: 50,
          application: 40,
          analysis_evaluation: 20,
        },
      }),
      /110/,
    ],
    [
      'a choice on a multiple-choice row',
      (t: TemplateDefinition) => ({
        ...t,
        sections: [{ ...t.sections[0], orCount: 1 }, t.sections[1]],
      }),
      /only for written/,
    ],
    [
      'more choices than questions',
      (t: TemplateDefinition) => ({
        ...t,
        sections: [t.sections[0], { ...t.sections[1], orCount: 5 }],
      }),
      /cannot be more/,
    ],
    [
      'multiple choice worth 5 marks',
      (t: TemplateDefinition) => ({
        ...t,
        totalMarks: 36,
        sections: [{ ...t.sections[0], marks: 5 }, t.sections[1]],
      }),
      /1 or 2 marks/,
    ],
    [
      'the same row twice',
      (t: TemplateDefinition) => ({
        ...t,
        totalMarks: 18,
        sections: [t.sections[0], t.sections[0], t.sections[1]],
      }),
      /twice/,
    ],
    [
      'zero questions',
      (t: TemplateDefinition) => ({
        ...t,
        totalMarks: 6,
        sections: [{ ...t.sections[0], count: 0 }, t.sections[1]],
      }),
      /number of questions/,
    ],
  ])('refuses: %s', (_name, change, message) => {
    const problems = validateTemplate(change(good()))
    expect(problems.join(' | ')).toMatch(message)
  })
})
