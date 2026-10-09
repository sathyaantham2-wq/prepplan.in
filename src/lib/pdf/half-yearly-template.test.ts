import { describe, expect, it } from 'vitest'
import { buildPaperHtml } from './paper-template'
import type { PaperTemplateInput, PaperTemplateQuestion } from './paper-template'

const q = (over: Partial<PaperTemplateQuestion>): PaperTemplateQuestion => ({
  id: 'q', section: 'Section A — History', position: 1, marks: 1, bloom: 'Remember', difficulty: 'Easy',
  type: 'mcq', text: 'Which river?', diagram_kind: null, diagram_params: null, choice_group: null, options: [],
  ...over,
})

const base: PaperTemplateInput = {
  title: 'School Half-Yearly (Social Science) — Class 7',
  studentName: 'Asha', board: 'CBSE', class: 7, durationMin: 180, totalMarks: 3, chapters: [],
  questions: [
    q({ position: 1, slot: '1-mark multiple choice' }),
    q({ position: 2, marks: 2, type: 'short_answer', slot: '2-mark very short answer', mark_split: '(1+1)' }),
  ],
  shortfalls: [
    { section: 'Section A — History', slot: '4-mark case study (1+1+2)', reason: 'no approved question in the bank for a case study question' },
    { section: 'overall', reason: 'Thinking-level mix off target' },
  ],
  halfYearly: {
    subjectName: 'Social Science',
    instructions: ['All questions are compulsory.', 'Write within the word limit: 2 marks: 40 words.'],
    sectionOrder: ['Section A — History', 'Section B — Geography'],
    sectionTotals: { 'Section A — History': 25, 'Section B — Geography': 25 },
    nominalMarks: 50,
    pageCount: 5,
  },
}

describe('buildPaperHtml School Half-Yearly layout', () => {
  const html = buildPaperHtml(base)

  it('prints the school-style header block', () => {
    for (const label of ['Name: Asha', 'Roll No.', 'Section:', 'Class: 7', 'Subject: Social Science', 'Date:', 'Time: 3 hours', 'Maximum marks: 50']) {
      expect(html).toContain(label)
    }
    expect(html).toContain('3 printed — see the notes')
    expect(html).toContain('Printed pages: 5')
  })

  it('prints general instructions including the word limits', () => {
    expect(html).toContain('General instructions')
    expect(html).toContain('2 marks: 40 words')
  })

  it('prints every section heading with its total, even a section with no questions', () => {
    expect(html).toContain('Section A — History')
    expect(html).toContain('25 marks')
    expect(html).toContain('Section B — Geography')
  })

  it('prints the mark split next to a written question, and none beside a multiple-choice one', () => {
    expect(html).toContain('<div class="mark-split">(1+1)</div>')
    expect(html.match(/class="mark-split"/g)).toHaveLength(1)
  })

  it('prints a missing slot as a note in its section, not only at the foot', () => {
    expect(html).toContain('Not printed: no approved question in the bank for a case study question')
    expect(html).toContain('4-mark case study (1+1+2)')
    // a note that belongs to no section heading still goes to the foot
    expect(html).toContain('Thinking-level mix off target')
  })

  it('leaves the plain template untouched when there is no half-yearly block', () => {
    const plain = buildPaperHtml({ ...base, halfYearly: undefined })
    expect(plain).not.toContain('General instructions')
    expect(plain).toContain('Max Marks: 3')
  })

  it('shows the draft banner when the layout is a draft', () => {
    const draft = buildPaperHtml({ ...base, halfYearly: { ...base.halfYearly!, draftNote: 'DRAFT layout: estimated' } })
    expect(draft).toContain('DRAFT layout: estimated')
  })
})
