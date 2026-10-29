import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { buildPaperDocx } from './paper-docx'
import type { PaperTemplateInput } from './paper-template'

// Writes a sample Word paper for a person to open in Word, Google Docs or LibreOffice and look at.
// Not part of the normal run:
//   DOCX_SAMPLE_DIR=test-fixtures/school-docx npx vitest run src/lib/pdf/paper-docx-sample.test.ts
describe.skipIf(!process.env.DOCX_SAMPLE_DIR)('sample Word paper', () => {
  it('writes sample-question-paper.docx', async () => {
    const base = {
      bloom: 'Understand',
      difficulty: 'Easy',
      diagram_kind: null,
      diagram_params: null,
      choice_group: null,
    } as const
    const A = 'Section A — Multiple choice (1 mark each)'
    const B = 'Section B — Short answer (2 marks each)'
    const C = 'Section C — Long answer (4 marks each)'
    const input: PaperTemplateInput = {
      title: 'Sample School — Unit Test 1 (SAMPLE)',
      studentName: '',
      board: 'CBSE',
      class: 7,
      durationMin: 90,
      totalMarks: 14,
      chapters: [],
      shortfalls: [],
      halfYearly: {
        subjectName: 'Mathematics',
        instructions: [
          'All questions are compulsory.',
          'Show every step of your working.',
          'Marks are shown at the right of each question.',
        ],
        sectionOrder: [A, B, C],
        sectionTotals: { [A]: 4, [B]: 6, [C]: 4 },
        nominalMarks: 14,
      },
      questions: [
        {
          ...base,
          id: 'a1a1a1a1-0000-4000-8000-000000000001',
          section: A,
          position: 1,
          marks: 1,
          type: 'mcq',
          text: 'What is 3/4 + 1/4?',
          options: [
            { label: 'A', text: '1', order_index: 1 },
            { label: 'B', text: '1/2', order_index: 2 },
            { label: 'C', text: '3/8', order_index: 3 },
            { label: 'D', text: '4/8', order_index: 4 },
          ],
        },
        {
          ...base,
          id: 'a1a1a1a1-0000-4000-8000-000000000002',
          section: A,
          position: 2,
          marks: 1,
          type: 'mcq',
          text: 'The value of 2³ × 5 is',
          options: [
            { label: 'A', text: '30', order_index: 1 },
            { label: 'B', text: '40', order_index: 2 },
            { label: 'C', text: '80', order_index: 3 },
            { label: 'D', text: '100', order_index: 4 },
          ],
        },
        {
          ...base,
          id: 'a1a1a1a1-0000-4000-8000-000000000003',
          section: A,
          position: 3,
          marks: 1,
          type: 'mcq',
          text: 'The square root of 49 is √49 =',
          options: [
            { label: 'A', text: '5', order_index: 1 },
            { label: 'B', text: '6', order_index: 2 },
            { label: 'C', text: '7', order_index: 3 },
            { label: 'D', text: '8', order_index: 4 },
          ],
        },
        {
          ...base,
          id: 'a1a1a1a1-0000-4000-8000-000000000004',
          section: A,
          position: 4,
          marks: 1,
          type: 'mcq',
          text: 'If a ≤ b and b ≠ c, which is always true? (x² ≥ 0, π ≈ 22/7)',
          options: [
            { label: 'A', text: 'a < c', order_index: 1 },
            { label: 'B', text: 'a ≤ b', order_index: 2 },
            { label: 'C', text: 'b = c', order_index: 3 },
            { label: 'D', text: 'a ≥ b', order_index: 4 },
          ],
        },
        {
          ...base,
          id: 'b2b2b2b2-0000-4000-8000-000000000005',
          section: B,
          position: 5,
          marks: 2,
          type: 'short_answer',
          text: 'Solve for x: x/2 + 3 = 7. Write each step.',
          options: [],
        },
        {
          ...base,
          id: 'b2b2b2b2-0000-4000-8000-000000000006',
          section: B,
          position: 6,
          marks: 2,
          type: 'short_answer',
          text: 'A car travels 150 km in 3 hours. Find its speed in km/h.',
          options: [],
          choice_group: 'g1',
        },
        {
          ...base,
          id: 'b2b2b2b2-0000-4000-8000-000000000007',
          section: B,
          position: 7,
          marks: 2,
          type: 'short_answer',
          text: 'Or: Simplify (2^4 × 3²)/6 and give the answer in simplest form.',
          options: [],
          choice_group: 'g1',
        },
        {
          ...base,
          id: 'b2b2b2b2-0000-4000-8000-000000000008',
          section: B,
          position: 8,
          marks: 2,
          type: 'diagram',
          text: 'Name the angles marked a and b in the figure.',
          options: [],
          diagram_kind: 'intersecting-lines',
          diagram_params: { labels: ['a', 'b', 'c', 'd'] },
        },
        {
          ...base,
          id: 'c3c3c3c3-0000-4000-8000-000000000009',
          section: C,
          position: 9,
          marks: 4,
          type: 'long_answer',
          text: 'Read the passage and answer. Ravi has 2 1/2 metres of cloth. He uses 3/5 of it for a bag and √16 cm for a tag. How much cloth is left? Show all the steps of your working.',
          options: [],
          mark_split: '(1+1+2)',
        },
      ],
    }
    const dir = process.env.DOCX_SAMPLE_DIR as string
    mkdirSync(dir, { recursive: true })
    const buf = await buildPaperDocx(input)
    writeFileSync(join(dir, 'sample-question-paper.docx'), buf)
    expect(buf.length).toBeGreaterThan(5000)
  })
})
