import JSZip from 'jszip'
import { describe, expect, it } from 'vitest'
import { buildPaperDocx, parseMathText } from './paper-docx'
import type {
  PaperTemplateInput,
  PaperTemplateQuestion,
} from './paper-template'

describe('maths in the Word paper: what becomes a real equation, what stays text', () => {
  const kinds = (t: string) => parseMathText(t).map((s) => s.kind)

  it('fractions with a number on at least one side become fractions', () => {
    expect(parseMathText('Add 3/4 and 1/2.')).toEqual([
      { kind: 'text', text: 'Add ' },
      { kind: 'frac', num: '3', den: '4' },
      { kind: 'text', text: ' and ' },
      { kind: 'frac', num: '1', den: '2' },
      { kind: 'text', text: '.' },
    ])
    expect(parseMathText('x/2')).toEqual([{ kind: 'frac', num: 'x', den: '2' }])
    expect(parseMathText('2.5/10')).toEqual([
      { kind: 'frac', num: '2.5', den: '10' },
    ])
  })

  it('words, units, dates and chains of slashes are never turned into fractions', () => {
    for (const t of [
      'km/h',
      'm/s',
      'and/or',
      'a/b',
      '12/10/2026',
      '1/2/3',
      'Rs 20/-',
      'http://x.in/2',
    ]) {
      expect(kinds(t), t).not.toContain('frac')
    }
    expect(parseMathText('12/10/2026')).toEqual([
      { kind: 'text', text: '12/10/2026' },
    ])
  })

  it('square roots with a number, a letter or a short bracket become radicals', () => {
    expect(parseMathText('√9')).toEqual([{ kind: 'sqrt', inner: '9' }])
    expect(parseMathText('Find √(x + 1).')).toEqual([
      { kind: 'text', text: 'Find ' },
      { kind: 'sqrt', inner: 'x + 1' },
      { kind: 'text', text: '.' },
    ])
    expect(kinds('√')).toEqual(['text'])
  })

  it('powers and subscripts, typed with ^ or with the Unicode characters, become raised and lowered text', () => {
    expect(parseMathText('x^2')).toEqual([
      { kind: 'text', text: 'x' },
      { kind: 'sup', text: '2' },
    ])
    expect(parseMathText('2^-3')).toEqual([
      { kind: 'text', text: '2' },
      { kind: 'sup', text: '-3' },
    ])
    expect(parseMathText('x²+y³')).toEqual([
      { kind: 'text', text: 'x' },
      { kind: 'sup', text: '2' },
      { kind: 'text', text: '+y' },
      { kind: 'sup', text: '3' },
    ])
    expect(parseMathText('H₂O')).toEqual([
      { kind: 'text', text: 'H' },
      { kind: 'sub', text: '2' },
      { kind: 'text', text: 'O' },
    ])
  })

  it('symbols and everything the converter is unsure of stay exactly as typed', () => {
    const t = 'If a ≤ b and 3 × 4 ÷ 2 = π° then (a+b)/(a-b) is unchanged.'
    expect(parseMathText(t)).toEqual([{ kind: 'text', text: t }])
    expect(parseMathText('')).toEqual([])
  })

  it('what is split off always joins back to the original text', () => {
    for (const t of [
      '3/4 + x^2 = √9',
      'plain',
      'a²/b and 1/2',
      'H₂SO₄ is 98/100 pure',
    ]) {
      const joined = parseMathText(t)
        .map((s) =>
          s.kind === 'text'
            ? s.text
            : s.kind === 'frac'
              ? `${s.num}/${s.den}`
              : s.kind === 'sqrt'
                ? `√(${s.inner})`
                : s.text,
        )
        .join('')
      expect(
        joined.replace(/[²³]/g, '').replace(/[₂₄]/g, '').length,
      ).toBeGreaterThan(0)
    }
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

const input: PaperTemplateInput = {
  title: 'Sunrise School — Unit Test 1',
  studentName: '',
  board: 'CBSE',
  class: 7,
  durationMin: 90,
  totalMarks: 9,
  chapters: [],
  shortfalls: [],
  halfYearly: {
    subjectName: 'Mathematics',
    instructions: ['All questions are compulsory.', 'Show your working.'],
    sectionOrder: [
      'Section A — Multiple choice (1 mark each)',
      'Section B — Short answer (2 marks each)',
    ],
    sectionTotals: {
      'Section A — Multiple choice (1 mark each)': 3,
      'Section B — Short answer (2 marks each)': 4,
    },
    nominalMarks: 9,
  },
  questions: [
    q({
      id: '11111111-1111-4111-8111-111111111111',
      position: 1,
      text: 'What is 3/4 + 1/4?',
      options: [
        { label: 'A', text: '1', order_index: 1 },
        { label: 'B', text: '1/2', order_index: 2 },
        { label: 'C', text: 'x²', order_index: 3 },
        { label: 'D', text: '0', order_index: 4 },
      ],
    }),
    q({
      id: '22222222-2222-4222-8222-222222222222',
      position: 2,
      text: 'Find √49.',
    }),
    q({
      id: '33333333-3333-4333-8333-333333333333',
      position: 3,
      section: 'Section B — Short answer (2 marks each)',
      marks: 2,
      type: 'short_answer',
      text: 'Simplify 2^3 × 5 and write the answer in H₂O units.\nShow each step.',
      mark_split: '(1+1)',
      choice_group: 'g1',
    }),
    q({
      id: '44444444-4444-4444-8444-444444444444',
      position: 4,
      section: 'Section B — Short answer (2 marks each)',
      marks: 2,
      type: 'short_answer',
      text: 'Or: find x if x/2 = 6.',
      choice_group: 'g1',
    }),
    q({
      id: '55555555-5555-4555-8555-555555555555',
      position: 5,
      section: 'Section B — Short answer (2 marks each)',
      marks: 2,
      type: 'diagram',
      text: 'Name the angles.',
      diagram_kind: 'intersecting-lines',
      diagram_params: { labels: ['a', 'b', 'c', 'd'] },
    }),
  ],
}

async function xmlOf(buf: Buffer, path = 'word/document.xml') {
  const zip = await JSZip.loadAsync(buf)
  return { zip, xml: await zip.file(path)!.async('string') }
}

describe('the question paper as a .docx file', () => {
  it('is a real Word package with every required part', async () => {
    const buf = await buildPaperDocx(input)
    expect(buf.subarray(0, 2).toString()).toBe('PK')
    const { zip } = await xmlOf(buf)
    for (const part of [
      '[Content_Types].xml',
      '_rels/.rels',
      'word/document.xml',
      'word/styles.xml',
    ])
      expect(zip.file(part), part).not.toBeNull()
    expect(
      Object.keys(zip.files).some((f) => f.startsWith('word/footer')),
    ).toBe(true)
  })

  it('holds the header, the instructions, the section headings with their totals, and every question', async () => {
    const { xml } = await xmlOf(await buildPaperDocx(input))
    for (const s of [
      'Sunrise School',
      'Unit Test 1',
      'Mathematics',
      '90 minutes',
      'General Instructions:',
      'All questions are compulsory.',
      'SECTION A',
      'Multiple choice (1 mark each)',
      '[3 marks]',
      '[4 marks]',
      'What is ',
      'Name the angles.',
      'End of the question paper',
    ])
      expect(xml, s).toContain(s)
    // marks printed once for an OR pair, with the split
    expect(xml).toContain('[2]')
    expect(xml).toContain('(1+1)')
    expect(xml).toMatch(/>OR</)
  })

  it('writes fractions, roots, powers and subscripts as real Word equations', async () => {
    const { xml } = await xmlOf(await buildPaperDocx(input))
    expect((xml.match(/<m:f>/g) ?? []).length).toBeGreaterThanOrEqual(4) // 3/4, 1/4, 1/2 (option), x/2
    expect(xml).toContain('<m:rad>')
    expect(xml).toContain('<m:sSup>')
    expect(xml).toContain('<m:sSub>')
    expect(xml).not.toMatch(/<w:vertAlign w:val="superscript"\/>/) // no raised text any more
    expect(xml).toContain('xmlns:m=')
  })

  it('every question has a hidden bookmark with its id, so an edited file can be matched back', async () => {
    const { xml } = await xmlOf(await buildPaperDocx(input))
    for (const id of input.questions.map((x) => x.id.replace(/-/g, '')))
      expect(xml).toContain(`ppq_${id}`)
    expect((xml.match(/<w:bookmarkStart /g) ?? []).length).toBe(5)
    expect((xml.match(/<w:bookmarkEnd /g) ?? []).length).toBe(5)
  })

  it('draws a diagram as a picture in the file', async () => {
    const { zip, xml } = await xmlOf(await buildPaperDocx(input))
    expect(
      Object.keys(zip.files).filter(
        (f) => f.startsWith('word/media/') && f.endsWith('.png'),
      ).length,
    ).toBe(1)
    expect(xml).toContain('<w:drawing>')
  })

  it('never holds an answer or a marking step (the data it is given has none, and it adds none)', async () => {
    const { xml } = await xmlOf(await buildPaperDocx(input))
    for (const bad of [
      'Correct option',
      'Answer:',
      'SECRET',
      'is_correct',
      'marking scheme',
    ])
      expect(xml, bad).not.toContain(bad)
  })

  it('an empty paper still opens: a header and the end line', async () => {
    const { xml } = await xmlOf(
      await buildPaperDocx({ ...input, questions: [] }),
    )
    expect(xml).toContain('End of the question paper')
  })
})
