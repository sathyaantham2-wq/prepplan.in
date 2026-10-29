/**
 * Renders sample pages of the school exam documents with the REAL builders (question paper, teacher
 * copy, answer booklet) from a small hand-written paper, for review. Needs no database.
 *
 *   S5_SAMPLES_DIR=<folder> npx vitest run src/lib/schools/sample-documents.integration.test.ts
 * (run through vitest because the PDF fonts are imported the way the app's bundler reads them)
 *
 * Writes the three PDFs, a PNG of page 1 of each (via macOS Quick Look when available) and a PNG of
 * the answer-booklet's answer page and cover page taken from the same HTML the PDF is made from.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { join } from 'node:path'
import { chromium } from 'playwright'
import { buildAnswerKeyHtml } from '../pdf/key-template'
import { buildPaperHtml } from '../pdf/paper-template'
import { countPdfPages } from '../pdf/page-count'
import { renderHtmlToPdf } from '../pdf/render'
import { buildBookletsHtml } from './booklet-html'
import { layoutBooklet } from './booklet-layout'
import { bookletPageToken } from './booklet-token'
import { bookletQuestions } from './exam-service'
import { toLayout } from './templates'
import type { TemplateDefinition } from './templates'

export async function renderSampleDocuments(out: string): Promise<void> {
  mkdirSync(out, { recursive: true })

  const def: TemplateDefinition = {
    name: 'Unit Test, 40 marks',
    totalMarks: 25,
    durationMin: 45,
    levelMix: {
      recall_understanding: 40,
      application: 40,
      analysis_evaluation: 20,
    },
    sections: [
      {
        name: 'Section A — Multiple choice (1 mark each)',
        kind: 'mcq',
        count: 6,
        marks: 1,
        orCount: 0,
      },
      {
        name: 'Section A — Multiple choice (1 mark each)',
        kind: 'assertion_reason',
        count: 2,
        marks: 1,
        orCount: 0,
      },
      {
        name: 'Section B — Short answer (2 marks each)',
        kind: 'short_answer',
        count: 3,
        marks: 2,
        orCount: 1,
      },
      {
        name: 'Section C — Short answer (3 marks each)',
        kind: 'short_answer',
        count: 2,
        marks: 3,
        orCount: 0,
      },
      {
        name: 'Section D — Long answer (5 marks each)',
        kind: 'long_answer',
        count: 1,
        marks: 5,
        orCount: 0,
      },
    ],
  }
  const layout = toLayout(def)
  type Opt = [string, string]
  const mcq = (
    n: number,
    text: string,
    opts: Array<Opt>,
    right: string,
    answer: string,
  ) => ({ n, text, opts, right, answer })
  const mcqs = [
    mcq(
      1,
      'Which of these fractions is the greatest?',
      [
        ['A', '3/4'],
        ['B', '5/8'],
        ['C', '7/12'],
        ['D', '2/3'],
      ],
      'A',
      '3/4 = 0.75, which is greater than 5/8, 7/12 and 2/3.',
    ),
    mcq(
      2,
      'The decimal form of 7/8 is',
      [
        ['A', '0.78'],
        ['B', '0.875'],
        ['C', '0.78125'],
        ['D', '1.14'],
      ],
      'B',
      '7 ÷ 8 = 0.875.',
    ),
    mcq(
      3,
      'What is 0.6 + 0.07?',
      [
        ['A', '0.13'],
        ['B', '0.67'],
        ['C', '0.76'],
        ['D', '6.07'],
      ],
      'B',
      '0.60 + 0.07 = 0.67.',
    ),
    mcq(
      4,
      'A rope 12.5 m long is cut into 5 equal pieces. Each piece is',
      [
        ['A', '2 m'],
        ['B', '2.5 m'],
        ['C', '7.5 m'],
        ['D', '62.5 m'],
      ],
      'B',
      '12.5 ÷ 5 = 2.5 m.',
    ),
    mcq(
      5,
      'Which is the smallest?',
      [
        ['A', '0.5'],
        ['B', '0.05'],
        ['C', '0.55'],
        ['D', '0.505'],
      ],
      'B',
      '0.05 is the smallest.',
    ),
    mcq(
      6,
      'The simplest form of 18/24 is',
      [
        ['A', '9/12'],
        ['B', '6/8'],
        ['C', '3/4'],
        ['D', '2/3'],
      ],
      'C',
      'Divide both by 6.',
    ),
    mcq(
      7,
      'Assertion (A): 0.30 and 0.3 are equal. Reason (R): Zeros at the end of a decimal do not change its value.',
      [
        ['A', 'Both A and R are true and R explains A'],
        ['B', 'Both are true but R does not explain A'],
        ['C', 'A is true but R is false'],
        ['D', 'A is false but R is true'],
      ],
      'A',
      'Trailing zeros after the decimal point do not change the value.',
    ),
    mcq(
      8,
      'Assertion (A): 2/3 is greater than 3/4. Reason (R): 2 × 4 is greater than 3 × 3.',
      [
        ['A', 'Both A and R are true and R explains A'],
        ['B', 'Both are true but R does not explain A'],
        ['C', 'A is false but R is true'],
        ['D', 'Both are false'],
      ],
      'C',
      '2×4=8, 3×3=9, so 2/3 < 3/4: A is false; R as stated is false too — see the marking note.',
    ),
  ]
  const written = [
    {
      n: 9,
      marks: 2,
      section: layout.sections[2].name,
      slot: '2-mark short answer',
      text: 'Write 0.375 as a fraction in its simplest form.',
      alt: 'Add 2.35 and 4.8.',
      ans: '0.375 = 375/1000 = 3/8',
      altAns: '2.35 + 4.80 = 7.15',
      steps: [
        [1, 'Writes 375/1000', 1],
        [2, 'Simplifies to 3/8', 1],
      ],
    },
    {
      n: 10,
      marks: 2,
      section: layout.sections[2].name,
      slot: '2-mark short answer',
      text: 'Arrange in ascending order: 0.7, 0.07, 0.77, 0.707.',
      alt: null,
      ans: '0.07, 0.7, 0.707, 0.77',
      steps: [
        [1, 'Compares tenths and hundredths correctly', 1],
        [2, 'Gives the full order', 1],
      ],
    },
    {
      n: 11,
      marks: 2,
      section: layout.sections[2].name,
      slot: '2-mark short answer',
      text: 'Ravi walks 1.25 km to school and 0.75 km to the market. How far does he walk in all?',
      alt: null,
      ans: '1.25 + 0.75 = 2 km',
      steps: [
        [1, 'Adds the distances', 1],
        [2, 'States 2 km', 1],
      ],
    },
    {
      n: 12,
      marks: 3,
      section: layout.sections[3].name,
      slot: '3-mark short answer',
      text: 'A ribbon is 3.6 m long. Meena uses 1.85 m for a gift and 0.9 m for a bow. How much ribbon is left?',
      alt: null,
      ans: '3.6 − 1.85 − 0.9 = 0.85 m',
      steps: [
        [1, 'Adds the two uses: 2.75 m', 1],
        [2, 'Subtracts from 3.6', 1],
        [3, 'Answer 0.85 m with the unit', 1],
      ],
    },
    {
      n: 13,
      marks: 3,
      section: layout.sections[3].name,
      slot: '3-mark short answer',
      text: 'Show that 5/8 is greater than 3/5 by writing both with a common denominator.',
      alt: null,
      ans: '5/8 = 25/40, 3/5 = 24/40, so 5/8 > 3/5',
      steps: [
        [1, 'Common denominator 40', 1],
        [2, 'Converts both fractions', 1],
        [3, 'Compares and concludes', 1],
      ],
    },
    {
      n: 14,
      marks: 5,
      section: layout.sections[4].name,
      slot: '5-mark long answer',
      text: 'A shopkeeper sells 2.5 kg of rice at ₹42.40 per kg and 1.75 kg of dal at ₹96 per kg. Find the total bill and the change from ₹300. Show every step.',
      alt: null,
      ans: 'Rice ₹106; dal ₹168; total ₹274; change ₹26',
      steps: [
        [1, 'Rice cost 2.5 × 42.40 = 106', 1],
        [2, 'Dal cost 1.75 × 96 = 168', 2],
        [3, 'Total 274', 1],
        [4, 'Change 26', 1],
      ],
    },
  ]

  const slotOf = (n: number) =>
    n <= 6 ? layout.sections[0].slot : layout.sections[1].slot
  const paperQuestions = [
    ...mcqs.map((m) => ({
      id: `m${m.n}`,
      section: layout.sections[m.n <= 6 ? 0 : 1].name,
      position: m.n,
      marks: 1,
      bloom: 'Understand' as const,
      difficulty: 'Easy' as const,
      type: (m.n <= 6 ? 'mcq' : 'assertion_reason') as 'mcq',
      text: m.text,
      diagram_kind: null,
      diagram_params: null,
      concept_name: null,
      choice_group: null,
      slot: slotOf(m.n),
      options: m.opts.map(([label, text], i) => ({
        label,
        text,
        order_index: i + 1,
      })),
    })),
    ...written.flatMap((w) => {
      const base = {
        section: w.section,
        position: w.n,
        marks: w.marks,
        bloom: 'Apply' as const,
        difficulty: 'Easy' as const,
        type: 'short_answer' as const,
        diagram_kind: null,
        diagram_params: null,
        concept_name: null,
        slot: w.slot,
        options: [] as Array<{
          label: string
          text: string
          order_index: number
        }>,
      }
      const first = {
        ...base,
        id: `w${w.n}`,
        text: w.text,
        choice_group: w.alt ? `or-${w.n}` : null,
        mark_split:
          w.steps.length > 1 ? `(${w.steps.map((s) => s[2]).join('+')})` : '',
      }
      return w.alt
        ? [
            first,
            {
              ...base,
              id: `w${w.n}b`,
              text: w.alt,
              choice_group: `or-${w.n}`,
              mark_split: '',
            },
          ]
        : [first]
    }),
  ]
  const sectionTotals: Record<string, number> = {}
  for (const pq of paperQuestions.filter(
    (q, i, a) =>
      q.choice_group === null ||
      a.findIndex((x) => x.choice_group === q.choice_group) === i,
  ))
    sectionTotals[pq.section] = (sectionTotals[pq.section] ?? 0) + pq.marks

  const paperHtml = buildPaperHtml({
    title: 'Sunrise Public School — Unit Test 1',
    studentName: '',
    board: 'CBSE',
    class: 7,
    durationMin: 45,
    totalMarks: 25,
    chapters: [
      { part: 'I', chapter_no: 3, name: 'A Peek Beyond the Point' },
      { part: 'II', chapter_no: 3, name: 'Fractions and Decimals' },
    ],
    questions: paperQuestions,
    shortfalls: [],
    halfYearly: {
      subjectName: 'Mathematics',
      instructions: layout.config.instructions,
      sectionOrder: layout.config.section_order,
      sectionTotals,
      nominalMarks: 25,
      pageCount: 2,
      draftNote: null,
    },
  })

  const keyHtml = buildAnswerKeyHtml({
    title: 'Sunrise Public School — Unit Test 1',
    coverage: [],
    questions: [
      ...mcqs.map((m) => ({
        position: m.n,
        section: layout.sections[m.n <= 6 ? 0 : 1].name,
        marks: 1,
        type: (m.n <= 6 ? 'mcq' : 'assertion_reason') as 'mcq',
        text: m.text,
        answer: m.answer,
        diagram_kind: null,
        diagram_params: null,
        choice_group: null,
        correctOptionLabel: m.right,
        stepMarks: [],
      })),
      ...written.flatMap((w) => {
        const common = {
          section: w.section,
          marks: w.marks,
          type: 'short_answer' as const,
          diagram_kind: null,
          diagram_params: null,
          correctOptionLabel: null,
        }
        const a = {
          ...common,
          position: w.n,
          text: w.text,
          answer: w.ans,
          choice_group: w.alt ? `or-${w.n}` : null,
          stepMarks: w.steps.map(([step_no, description, marks]) => ({
            step_no: step_no as number,
            description: description as string,
            marks: marks as number,
          })),
        }
        return w.alt
          ? [
              a,
              {
                ...common,
                position: w.n,
                text: w.alt,
                answer: w.altAns,
                choice_group: `or-${w.n}`,
                stepMarks: [
                  { step_no: 1, description: 'Correct working', marks: 1 },
                  { step_no: 2, description: 'Correct answer', marks: 1 },
                ],
              },
            ]
          : [a]
      }),
    ],
    teacherCopy: {
      details: [
        'Subject: Mathematics · Class 7 A, B · 45 minutes',
        'Layout: Unit Test, 40 marks. Marks: 25 printed',
        'Chapters: Part I · Chapter 3 · A Peek Beyond the Point; Part II · Chapter 3 · Fractions and Decimals',
        'Date: 2026-11-20',
      ],
      gaps: [
        'Section D — 5-mark long answer: 1 of 1 question could not be filled from the bank; 5 marks short.',
        'Part II · Chapter 3 · Fractions and Decimals: 3-mark short answer in Section C needed 1, the bank has 0.',
      ],
    },
  })

  const manifest = layoutBooklet(
    bookletQuestions([
      ...mcqs.map((m) => ({
        position: m.n,
        type: m.n <= 6 ? 'mcq' : 'assertion_reason',
        marks: 1,
        expectedWords: null,
        isAlternate: false,
      })),
      ...written.map((w) => ({
        position: w.n,
        type: 'short_answer',
        marks: w.marks,
        expectedWords: w.marks === 2 ? 40 : w.marks === 3 ? 60 : 120,
        isAlternate: false,
      })),
      {
        position: 9,
        type: 'short_answer',
        marks: 2,
        expectedWords: 40,
        isAlternate: true,
      },
    ]),
  )
  const students = [
    {
      name: 'Asha Rao',
      admissionNo: '2024/0101',
      rollNo: '1',
      sectionName: 'A',
      id: 's1',
    },
    {
      name: 'Ravi Kumar Reddy',
      admissionNo: 'PK7M2P9X',
      rollNo: '2',
      sectionName: 'A',
      id: 's2',
    },
  ]
  const bookletHtml = await buildBookletsHtml({
    schoolName: 'Sunrise Public School',
    examTitle: 'Unit Test 1',
    subjectName: 'Mathematics',
    className: 'Class 7',
    durationMin: 45,
    totalMarks: 25,
    manifest,
    students: students.map((s) => ({
      ...s,
      tokens: Array.from({ length: manifest.pageCount }, (_, i) =>
        bookletPageToken(
          {
            schoolId: 'sunrise',
            examId: 'ut1',
            schoolStudentId: s.id,
            page: i + 1,
          },
          'sample-secret',
        ),
      ),
    })),
  })

  const docs = [
    { name: 'question-paper', html: paperHtml, full: false },
    { name: 'teacher-copy', html: keyHtml, full: false },
    { name: 'answer-booklet', html: bookletHtml, full: true },
  ]
  for (const d of docs) {
    const pdf = await renderHtmlToPdf(d.html, { fullPage: d.full })
    writeFileSync(join(out, `${d.name}.pdf`), pdf)
    console.log(d.name, 'pages', countPdfPages(pdf))
    try {
      execFileSync(
        'qlmanage',
        ['-t', '-s', '1600', '-o', out, join(out, `${d.name}.pdf`)],
        { stdio: 'ignore' },
      )
    } catch {
      // Quick Look is macOS only
    }
  }
  console.log('booklet pages per student', manifest.pageCount)

  // The booklet's cover and first answer page, from the same HTML the PDF is printed from.
  const browser = await chromium.launch()
  const page = await browser.newPage({
    viewport: { width: 794, height: 1123 },
    deviceScaleFactor: 1.6,
  })
  await page.setContent(bookletHtml, { waitUntil: 'load' })
  await page.emulateMedia({ media: 'print' })
  for (const [i, name] of [
    [0, 'booklet-cover'],
    [1, 'booklet-answer-page'],
  ] as const) {
    await page
      .locator('.page')
      .nth(i)
      .screenshot({ path: join(out, `${name}.png`) })
  }
  await browser.close()
}
