import { describe, expect, it } from 'vitest'
import { buildPaperDocx } from '../pdf/paper-docx'
import type {
  PaperTemplateInput,
  PaperTemplateQuestion,
} from '../pdf/paper-template'
import {
  chunkText,
  docxParagraphs,
  docxToText,
  ommlToText,
  parseExtraction,
  parsePrepPlanParagraphs,
} from './own-paper-extract'
import { plainMath } from './own-paper-service'

describe('Word equations back to plain text', () => {
  it('fractions and roots', () => {
    expect(
      ommlToText(
        '<m:f><m:num><m:r><m:t>3</m:t></m:r></m:num><m:den><m:r><m:t>4</m:t></m:r></m:den></m:f>',
      ),
    ).toBe('3/4')
    expect(
      ommlToText(
        '<m:rad><m:radPr/><m:deg/><m:e><m:r><m:t>49</m:t></m:r></m:e></m:rad>',
      ),
    ).toBe('√49')
    expect(
      ommlToText('<m:rad><m:e><m:r><m:t>x + 1</m:t></m:r></m:e></m:rad>'),
    ).toBe('√(x + 1)')
    expect(ommlToText('<m:r><m:t>a &amp; b</m:t></m:r>')).toBe('a & b')
  })
})

describe('splitting a paper for the reader', () => {
  const para = (n: number) => `${n}. ${'word '.repeat(120)}`
  it('cuts between questions, never loses a line, and keeps each piece under the limit', () => {
    const text = Array.from({ length: 30 }, (_, i) => para(i + 1)).join('\n')
    const chunks = chunkText(text, 3000)
    expect(chunks.length).toBeGreaterThan(1)
    expect(chunks.join('\n')).toBe(text)
    for (const c of chunks) {
      expect(c.length).toBeLessThanOrEqual(3000 * 1.6)
      expect(/^\s*\d{1,2}\./.test(c)).toBe(true) // each piece starts on a question
    }
  })
  it('a short paper is one piece; an empty one is none', () => {
    expect(chunkText('1. A\n2. B')).toEqual(['1. A\n2. B'])
    expect(chunkText('')).toEqual([])
  })
})

describe('what the reader (AI) answers must have the right shape', () => {
  const good = {
    number: 3,
    section: 'Section B',
    text: 'Simplify 3/4 + 1/4.',
    marks: '2',
    type: 'short_answer',
    options: [],
    or_with_previous: false,
  }
  it('accepts a list, or an object with a list; numbers may arrive as text', () => {
    const r = parseExtraction(JSON.stringify({ questions: [good] }))
    expect(r.questions).toHaveLength(1)
    expect(r.questions[0]).toMatchObject({
      number: '3',
      marks: 2,
      text: 'Simplify 3/4 + 1/4.',
    })
    expect(parseExtraction(JSON.stringify([good])).questions).toHaveLength(1)
  })
  it('an unknown type becomes short_answer; options and the OR flag default sensibly', () => {
    const r = parseExtraction(
      JSON.stringify([{ text: 'Name the capital.', marks: 1, type: 'essay' }]),
    )
    expect(r.questions[0]).toMatchObject({
      type: 'short_answer',
      options: [],
      or_with_previous: false,
      section: '',
    })
  })
  it('drops what is not a question and says how many, but refuses an answer that is not a list at all', () => {
    const r = parseExtraction(
      JSON.stringify([
        good,
        { text: '', marks: 1 },
        { text: 'No marks here' },
        { text: 'Marks too big', marks: 999 },
        'junk',
      ]),
    )
    expect(r.questions).toHaveLength(1)
    expect(r.dropped).toBe(4)
    expect(() => parseExtraction('{"answer": 1}')).toThrow()
    expect(() => parseExtraction('not json')).toThrow()
  })
})

describe('"x²" and "x^2" are the same thing when an edited paper is compared with the original', () => {
  it('raised and lowered characters, spacing', () => {
    expect(plainMath('x² + y³')).toBe(plainMath('x^2 + y^3'))
    expect(plainMath('H₂O')).toBe('H2O')
    expect(plainMath('2^(10)')).toBe('2^10')
    expect(plainMath('  a   b ')).toBe('a b')
    expect(plainMath('3/4')).not.toBe(plainMath('3/5'))
  })
})

const q = (
  o: Partial<PaperTemplateQuestion> &
    Pick<PaperTemplateQuestion, 'id' | 'position' | 'text'>,
): PaperTemplateQuestion => ({
  section: 'Section A — Multiple choice (1 mark each)',
  marks: 1,
  bloom: 'Understand',
  difficulty: 'Easy',
  type: 'mcq',
  diagram_kind: null,
  diagram_params: null,
  choice_group: null,
  options: [],
  ...o,
})
const A = 'Section A — Multiple choice (1 mark each)'
const B = 'Section B — Short answer (2 marks each)'
const hex = (n: number) =>
  `${String(n).repeat(8)}-${String(n).repeat(4)}-4${String(n).repeat(3)}-8${String(n).repeat(3)}-${String(n).repeat(12)}`
const input: PaperTemplateInput = {
  title: 'Sample School — Unit Test 1',
  studentName: '',
  board: 'CBSE',
  class: 7,
  durationMin: 90,
  totalMarks: 7,
  chapters: [],
  shortfalls: [],
  halfYearly: {
    subjectName: 'Mathematics',
    instructions: ['All questions are compulsory.'],
    sectionOrder: [A, B],
    sectionTotals: { [A]: 3, [B]: 4 },
    nominalMarks: 7,
  },
  questions: [
    q({
      id: hex(1),
      position: 1,
      text: 'What is 3/4 + 1/4?',
      options: [
        { label: 'A', text: '1', order_index: 1 },
        { label: 'B', text: '1/2', order_index: 2 },
      ],
    }),
    q({ id: hex(2), position: 2, text: 'Find √49 and 2^3.' }),
    q({
      id: hex(3),
      position: 3,
      text: 'The value of x² is',
      options: [
        { label: 'A', text: '4', order_index: 1 },
        { label: 'B', text: '9', order_index: 2 },
      ],
    }),
    q({
      id: hex(4),
      position: 4,
      section: B,
      marks: 2,
      type: 'short_answer',
      text: 'Solve x/2 = 6.',
      choice_group: 'g1',
    }),
    q({
      id: hex(5),
      position: 5,
      section: B,
      marks: 2,
      type: 'short_answer',
      text: 'Or: find the speed in km/h.',
      choice_group: 'g1',
    }),
    q({
      id: hex(6),
      position: 6,
      section: B,
      marks: 2,
      type: 'short_answer',
      text: 'Define a prime number.',
      mark_split: '(1+1)',
    }),
  ],
}

describe('reading back a Word paper that PrepPlan made (no AI)', () => {
  it('finds every question by its hidden marker, with number, section, marks, options and the OR pair', async () => {
    const paras = await docxParagraphs(await buildPaperDocx(input))
    const qs = parsePrepPlanParagraphs(paras)!
    expect(qs).toHaveLength(6)
    expect(qs.map((x) => x.ppqId)).toEqual(
      input.questions.map((x) => x.id.replace(/-/g, '')),
    )
    expect(qs[0]).toMatchObject({
      number: '1',
      section: A,
      marks: 1,
      text: 'What is 3/4 + 1/4?',
    })
    expect(qs[0].options).toEqual([
      { label: 'A', text: '1' },
      { label: 'B', text: '1/2' },
    ])
    expect(qs[1].text).toBe('Find √49 and 2^3.')
    expect(qs[2].text).toBe('The value of x^2 is') // raised text reads back as ^
    expect(qs[3]).toMatchObject({ section: B, marks: 2, orGroup: 'or1' })
    expect(qs[4]).toMatchObject({
      section: B,
      marks: 2,
      orGroup: 'or1',
      number: null,
    })
    expect(qs[5]).toMatchObject({ marks: 2, orGroup: null })
    // the unedited text compares equal to the original (so nothing is wrongly shown as changed)
    for (const [i, x] of qs.entries())
      expect(plainMath(x.text), String(i + 1)).toBe(
        plainMath(input.questions[i].text),
      )
  })
  it('a question that starts with its sub-part "(a)" (the part sits on the number line) reads back whole', async () => {
    const text =
      '(a) Round 8,47,300 to the nearest lakh. (b) Is 3/4 of it more than 6,00,000?'
    const paras = await docxParagraphs(
      await buildPaperDocx({
        ...input,
        questions: [
          q({
            id: hex(7),
            position: 1,
            section: B,
            marks: 2,
            type: 'short_answer',
            text,
            mark_split: '(1+1)',
          }),
        ],
      }),
    )
    const [x] = parsePrepPlanParagraphs(paras)!
    expect(x).toMatchObject({ number: '1', marks: 2 })
    expect(plainMath(x.text)).toBe(plainMath(text))
  })
  it('sees an edit', async () => {
    const edited = {
      ...input,
      questions: input.questions.map((x) =>
        x.position === 1 ? { ...x, text: 'What is 3/4 + 2/4?' } : x,
      ),
    }
    const qs = parsePrepPlanParagraphs(
      await docxParagraphs(await buildPaperDocx(edited)),
    )!
    expect(plainMath(qs[0].text)).not.toBe(plainMath(input.questions[0].text))
  })
  it('a Word file with no PrepPlan marker is not one of ours (it goes to the reader instead)', () => {
    expect(
      parsePrepPlanParagraphs([{ text: '1. What is 2 + 2?', bookmark: null }]),
    ).toBeNull()
  })
  it('the plain text of any Word file keeps fractions and powers readable', async () => {
    const text = await docxToText(await buildPaperDocx(input))
    expect(text).toContain('What is 3/4 + 1/4?')
    expect(text).toContain('x^2')
    expect(text).toContain('Sample School')
  })
})
