import { describe, expect, it } from 'vitest'
import { toLayout, DEFAULT_TEMPLATES } from './templates'
import {
  computeCoverage,
  rowFitsSlot,
  shortfallLines,
} from './template-coverage'
import type { BankRow, CoverageChapter } from './template-coverage'
import type { LayoutSection } from '../school-paper'

const row = (
  o: Partial<BankRow> & Pick<BankRow, 'chapterId' | 'marks'>,
): BankRow => ({
  type: 'short_answer',
  bloom: 'Apply',
  special: '',
  hasDiagram: false,
  n: 1,
  ...o,
})
const slot = (o: Partial<LayoutSection>): LayoutSection => ({
  name: 'S',
  slot: 's',
  marks_per_question: 2,
  count: 1,
  bloom_allowed: ['Apply'],
  ...o,
})

describe("which bank questions may fill a row (the generator's own rule)", () => {
  it('needs the right marks, an allowed type and an allowed thinking level', () => {
    const s = slot({
      types: ['short_answer', 'long_answer'],
      bloom_allowed: ['Remember', 'Apply'],
    })
    expect(rowFitsSlot(row({ chapterId: 'a', marks: 2 }), s)).toBe(true)
    expect(rowFitsSlot(row({ chapterId: 'a', marks: 3 }), s)).toBe(false)
    expect(rowFitsSlot(row({ chapterId: 'a', marks: 2, type: 'mcq' }), s)).toBe(
      false,
    )
    expect(
      rowFitsSlot(row({ chapterId: 'a', marks: 2, bloom: 'Create' }), s),
    ).toBe(false)
  })
  it('a case study fills only a case-study row, and a plain row never takes one', () => {
    const plain = slot({ marks_per_question: 4 })
    const caseRow = slot({
      marks_per_question: 4,
      tag: 'case_study',
      bloom_allowed: ['Apply'],
    })
    const q = row({ chapterId: 'a', marks: 4, special: 'case_study' })
    expect(rowFitsSlot(q, caseRow)).toBe(true)
    expect(rowFitsSlot(q, plain)).toBe(false)
    expect(rowFitsSlot(row({ chapterId: 'a', marks: 4 }), caseRow)).toBe(false)
    expect(
      rowFitsSlot(
        row({ chapterId: 'a', marks: 4, special: 'case_study,map' }),
        caseRow,
      ),
    ).toBe(false)
  })
  it('a ruler-and-compass question may fill a plain row (papers are printed) but a map may not', () => {
    expect(
      rowFitsSlot(
        row({ chapterId: 'a', marks: 2, special: 'construction' }),
        slot({}),
      ),
    ).toBe(true)
    expect(
      rowFitsSlot(row({ chapterId: 'a', marks: 2, special: 'map' }), slot({})),
    ).toBe(false)
    expect(
      rowFitsSlot(
        row({ chapterId: 'a', marks: 2, special: 'map' }),
        slot({ tag: 'map' }),
      ),
    ).toBe(false) // a map needs its original figure
    expect(
      rowFitsSlot(
        row({ chapterId: 'a', marks: 2, special: 'map', hasDiagram: true }),
        slot({ tag: 'map' }),
      ),
    ).toBe(true)
  })
})

const chapters: Array<CoverageChapter> = [
  { id: 'p1c3', label: 'Part I · Chapter 3 · A', weight: 3 },
  { id: 'p2c3', label: 'Part II · Chapter 3 · B', weight: 1 },
]
const layout = toLayout({
  name: 'T',
  totalMarks: 10,
  durationMin: 30,
  levelMix: {
    recall_understanding: 50,
    application: 50,
    analysis_evaluation: 0,
  },
  sections: [
    { name: 'A', kind: 'short_answer', count: 4, marks: 2, orCount: 0 }, // 8 marks
    { name: 'B', kind: 'short_answer', count: 1, marks: 2, orCount: 0 }, // 2 marks, distinct row via heading
  ],
})

describe('computeCoverage', () => {
  it('splits a row across chapters by weight and reports nothing when the bank is deep enough', () => {
    const bank = [
      row({ chapterId: 'p1c3', marks: 2, n: 10 }),
      row({ chapterId: 'p2c3', marks: 2, n: 10 }),
    ]
    const r = computeCoverage({ layout, chapters, bank })
    expect(r.shortfalls).toEqual([])
    expect(r.fillableMarks).toBe(10)
    expect(r.slots[0].cells.map((c) => c.needed)).toEqual([3, 1])
    expect(r.chapters.map((c) => c.plannedMarks)).toEqual([
      r.chapters[0].plannedMarks,
      r.chapters[1].plannedMarks,
    ])
    expect(r.chapters[0].plannedMarks + r.chapters[1].plannedMarks).toBeCloseTo(
      10,
      5,
    )
  })

  it('a chapter that is short is reported, and another chapter covers it when it can', () => {
    const bank = [
      row({ chapterId: 'p1c3', marks: 2, n: 1 }),
      row({ chapterId: 'p2c3', marks: 2, n: 10 }),
    ]
    const r = computeCoverage({ layout, chapters, bank })
    const first = r.slots[0]
    expect(first.cells[0]).toMatchObject({ needed: 3, have: 1, short: 2 })
    expect(first.unfilled).toBe(0) // chapter B has plenty
    expect(first.cells[1].drawn).toBe(1 + 2)
    expect(r.fillableMarks).toBe(10)
    const chapterLines = r.shortfalls.filter((s) => s.kind === 'chapter')
    expect(chapterLines[0]).toMatchObject({
      chapterId: 'p1c3',
      short: 2,
      needed: 3,
      have: 1,
    })
    expect(r.shortfalls.some((s) => s.kind === 'paper')).toBe(false)
    expect(shortfallLines(r)[0]).toContain('Part I · Chapter 3')
  })

  it('when nobody can cover it the paper shortfall says how many questions and how many marks', () => {
    const bank = [row({ chapterId: 'p1c3', marks: 2, n: 1 })]
    const r = computeCoverage({ layout, chapters, bank })
    const a = r.slots[0]
    expect(a.printed).toBe(4)
    expect(a.fillable).toBe(1)
    expect(a.unfilled).toBe(3)
    expect(a.marksMissing).toBe(6)
    expect(r.fillableMarks).toBe(
      r.totalMarks - r.slots.reduce((n, s) => n + s.marksMissing, 0),
    )
    const paper = r.shortfalls.filter((s) => s.kind === 'paper')
    expect(paper[0]).toMatchObject({ short: 3, marksMissing: 6 })
    expect(shortfallLines(r)[0]).toMatch(
      /3 of 4 questions could not be filled .*6 marks short/,
    )
  })

  it('an OR prints an extra question but adds no marks', () => {
    const l = toLayout({
      name: 'T',
      totalMarks: 6,
      durationMin: 30,
      levelMix: {
        recall_understanding: 100,
        application: 0,
        analysis_evaluation: 0,
      },
      sections: [
        { name: 'A', kind: 'short_answer', count: 3, marks: 2, orCount: 2 },
      ],
    })
    const r = computeCoverage({
      layout: l,
      chapters: [chapters[0]],
      bank: [row({ chapterId: 'p1c3', marks: 2, n: 100, bloom: 'Remember' })],
    })
    expect(r.slots[0].printed).toBe(5)
    expect(r.slots[0].marks).toBe(6)
    expect(r.totalMarks).toBe(6)
  })

  it('splits expected thinking levels by the questions the bank really has', () => {
    const bank = [
      row({ chapterId: 'p1c3', marks: 2, n: 10, bloom: 'Remember' }),
      row({ chapterId: 'p1c3', marks: 2, n: 10, bloom: 'Apply' }),
      row({ chapterId: 'p2c3', marks: 2, n: 20, bloom: 'Apply' }),
    ]
    const r = computeCoverage({ layout, chapters, bank })
    // 10 recall of 40 matching questions -> a quarter of the marks
    expect(r.levels.expected.recall_understanding).toBe(25)
    expect(r.levels.expectedRecall).toBe(25)
    expect(r.levels.planned.recall_understanding).toBe(50)
  })

  it('a missing alternative of an OR costs the choice, not marks', () => {
    const l = toLayout({
      name: 'T',
      totalMarks: 20,
      durationMin: 30,
      levelMix: {
        recall_understanding: 100,
        application: 0,
        analysis_evaluation: 0,
      },
      sections: [
        { name: 'D', kind: 'long_answer', count: 4, marks: 5, orCount: 3 },
      ],
    })
    // 7 printed (4 answers + 3 alternatives); the bank has 6
    const r = computeCoverage({
      layout: l,
      chapters: [chapters[0]],
      bank: [
        row({
          chapterId: 'p1c3',
          marks: 5,
          type: 'long_answer',
          bloom: 'Apply',
          n: 6,
        }),
      ],
    })
    expect(r.slots[0]).toMatchObject({
      printed: 7,
      unfilled: 1,
      marksMissing: 0,
      choicesLost: 1,
    })
    expect(r.fillableMarks).toBe(20)
    expect(shortfallLines(r)[0]).toMatch(
      /1 of 7 questions could not be filled from the bank; 1 choice \(OR\) will have no alternative\./,
    )
    // with only 2 the 4 answers cannot all be set: 5 missing, 3 of them alternatives, so 2 answers (10 marks) are lost
    const r2 = computeCoverage({
      layout: l,
      chapters: [chapters[0]],
      bank: [
        row({
          chapterId: 'p1c3',
          marks: 5,
          type: 'long_answer',
          bloom: 'Apply',
          n: 2,
        }),
      ],
    })
    expect(r2.slots[0]).toMatchObject({
      unfilled: 5,
      marksMissing: 10,
      choicesLost: 3,
    })
    expect(r2.fillableMarks).toBe(10)
  })

  it('the 80-mark layout on a bank with no long answers and no case studies names both rows', () => {
    const bank = [
      row({
        chapterId: 'p1c3',
        marks: 1,
        type: 'mcq',
        bloom: 'Understand',
        n: 50,
      }),
      row({
        chapterId: 'p1c3',
        marks: 1,
        type: 'assertion_reason',
        bloom: 'Apply',
        n: 10,
      }),
      row({ chapterId: 'p1c3', marks: 2, bloom: 'Understand', n: 20 }),
      row({ chapterId: 'p1c3', marks: 3, bloom: 'Apply', n: 20 }),
    ]
    const r = computeCoverage({
      layout: toLayout(DEFAULT_TEMPLATES[0]),
      chapters: [chapters[0]],
      bank,
    })
    const paper = r.shortfalls
      .filter((s) => s.kind === 'paper')
      .map((s) => s.slot)
    expect(paper).toEqual(['5-mark long answer', '4-mark case study'])
    expect(r.fillableMarks).toBe(80 - 20 - 12)
  })
})
