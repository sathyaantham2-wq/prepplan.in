import {
  AlignmentType,
  Bookmark,
  Document,
  Footer,
  ImageRun,
  Math as WordMath,
  MathFraction,
  MathRadical,
  MathRun,
  Packer,
  PageNumber,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TabStopType,
  TextRun,
  WidthType,
} from 'docx'
import sharp from 'sharp'
import { renderDiagramSvg } from './diagrams'
import type {
  PaperTemplateInput,
  PaperTemplateQuestion,
} from './paper-template'

// The question paper as an editable Word file (M2). It is built from the very same data as the PDF
// (PaperTemplateInput), so the two always agree, and like the PDF it never holds an answer.
//
// Maths in Word, in order of care:
//  - a fraction such as 3/4 becomes a real Word equation (stacked, editable in Word's equation editor);
//  - a square root, √9 or √(x + 1), becomes a real Word radical;
//  - a power, x^2 or x², and a subscript, H₂O, become superscript / subscript text, which every Word
//    user can edit and which survives Google Docs and LibreOffice;
//  - symbols (≤ ≥ ≠ × ÷ π °) stay as text in Cambria, which has them all;
//  - anything the converter is not sure of stays exactly as typed: nothing is guessed.
// Every question carries a hidden bookmark named ppq_<question id>, so a paper edited in Word can be
// matched back to the bank's questions when it is uploaded again (the M3 reading flow).

export type MathSeg =
  | { kind: 'text'; text: string }
  | { kind: 'frac'; num: string; den: string }
  | { kind: 'sqrt'; inner: string }
  | { kind: 'sup'; text: string }
  | { kind: 'sub'; text: string }

const SUP: Record<string, string> = {
  '⁰': '0',
  '¹': '1',
  '²': '2',
  '³': '3',
  '⁴': '4',
  '⁵': '5',
  '⁶': '6',
  '⁷': '7',
  '⁸': '8',
  '⁹': '9',
  '⁺': '+',
  '⁻': '-',
  ⁿ: 'n',
}
const SUB: Record<string, string> = {
  '₀': '0',
  '₁': '1',
  '₂': '2',
  '₃': '3',
  '₄': '4',
  '₅': '5',
  '₆': '6',
  '₇': '7',
  '₈': '8',
  '₉': '9',
}

const NUM = String.raw`\d+(?:\.\d+)?`
// 3/4, 2.5/10, x/2, 3/y: at least one side is a number, neither touches a word or another slash.
const FRACTION = String.raw`(?<![\w./])(?<fn>${NUM}|[a-zA-Z])\/(?<fd>${NUM}|[a-zA-Z])(?![\w/])`
const SQRT = String.raw`√(?:\((?<sq>[^()]{1,40})\)|(?<sn>${NUM}|[a-zA-Z]))`
const CARET = String.raw`\^(?<cp>-?\d+|[a-zA-Z])`
const SUPS = `(?<us>[${Object.keys(SUP).join('')}]+)`
const SUBS = `(?<ub>[${Object.keys(SUB).join('')}]+)`
const MASTER = new RegExp(`${FRACTION}|${SQRT}|${CARET}|${SUPS}|${SUBS}`, 'g')

/** Splits a question's text into plain text and the few pieces that become real Word maths. */
export function parseMathText(input: string): Array<MathSeg> {
  const out: Array<MathSeg> = []
  let last = 0
  const push = (t: string) => {
    if (t) out.push({ kind: 'text', text: t })
  }
  for (const m of input.matchAll(MASTER)) {
    const g: Record<string, string | undefined> = m.groups ?? {}
    // a fraction needs a digit on one side ("km/h" and "and/or" are words, not fractions)
    if (g.fn !== undefined && !/\d/.test(g.fn + (g.fd ?? ''))) continue
    push(input.slice(last, m.index))
    if (g.fn !== undefined)
      out.push({ kind: 'frac', num: g.fn, den: g.fd ?? '' })
    else if (g.sq !== undefined || g.sn !== undefined)
      out.push({ kind: 'sqrt', inner: (g.sq ?? g.sn) as string })
    else if (g.cp !== undefined) out.push({ kind: 'sup', text: g.cp })
    else if (g.us !== undefined)
      out.push({ kind: 'sup', text: [...g.us].map((c) => SUP[c]).join('') })
    else if (g.ub !== undefined)
      out.push({ kind: 'sub', text: [...g.ub].map((c) => SUB[c]).join('') })
    last = m.index + m[0].length
  }
  push(input.slice(last))
  return out
}

const FONT = 'Cambria'
const SIZE = 23 // half-points: 11.5 pt, the PDF's size

export function runsFor(
  text: string,
  extra: { bold?: boolean; size?: number } = {},
): Array<TextRun | WordMath> {
  const base = { font: FONT, size: extra.size ?? SIZE, bold: extra.bold }
  const runs: Array<TextRun | WordMath> = []
  for (const seg of parseMathText(text)) {
    if (seg.kind === 'text') {
      const lines = seg.text.split('\n')
      lines.forEach((line, i) =>
        runs.push(
          new TextRun({ ...base, text: line, break: i > 0 ? 1 : undefined }),
        ),
      )
    } else if (seg.kind === 'frac')
      runs.push(
        new WordMath({
          children: [
            new MathFraction({
              numerator: [new MathRun(seg.num)],
              denominator: [new MathRun(seg.den)],
            }),
          ],
        }),
      )
    else if (seg.kind === 'sqrt')
      runs.push(
        new WordMath({
          children: [new MathRadical({ children: [new MathRun(seg.inner)] })],
        }),
      )
    else if (seg.kind === 'sup')
      runs.push(new TextRun({ ...base, text: seg.text, superScript: true }))
    else runs.push(new TextRun({ ...base, text: seg.text, subScript: true }))
  }
  return runs
}

async function diagramImage(
  q: PaperTemplateQuestion,
): Promise<ImageRun | null> {
  const svg = renderDiagramSvg(q.diagram_kind, q.diagram_params)
  if (!svg) return null
  const png = await sharp(Buffer.from(svg), { density: 200 })
    .flatten({ background: '#ffffff' })
    .png()
    .toBuffer({ resolveWithObject: true })
  const w = Math.min(340, png.info.width)
  return new ImageRun({
    type: 'png',
    data: png.data,
    transformation: {
      width: w,
      height: Math.round((png.info.height * w) / png.info.width),
    },
    altText: {
      name: 'Diagram',
      description: `Diagram for question ${q.position}`,
      title: 'Diagram',
    },
  })
}

const RIGHT_TAB = 9000 // twips from the left margin to the right-aligned marks (A4 less 2 x 20 mm)

function groupQuestions(
  qs: ReadonlyArray<PaperTemplateQuestion>,
): Array<Array<PaperTemplateQuestion>> {
  const groups: Array<Array<PaperTemplateQuestion>> = []
  const seen = new Map<string, Array<PaperTemplateQuestion>>()
  for (const q of [...qs].sort((a, b) => a.position - b.position)) {
    if (q.choice_group === null) groups.push([q])
    else {
      const g = seen.get(q.choice_group)
      if (g) g.push(q)
      else {
        const fresh = [q]
        seen.set(q.choice_group, fresh)
        groups.push(fresh)
      }
    }
  }
  return groups
}

const OBJECTIVE = new Set([
  'mcq',
  'assertion_reason',
  'match',
  'multi_statement',
])

async function questionParagraphs(
  group: Array<PaperTemplateQuestion>,
): Promise<Array<Paragraph>> {
  const out: Array<Paragraph> = []
  const first = group[0]
  const marksText = first.mark_split
    ? `[${first.marks}] ${first.mark_split}`
    : `[${first.marks}]`
  for (const [i, q] of group.entries()) {
    if (i > 0)
      out.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 80, after: 80 },
          children: [
            new TextRun({ text: 'OR', bold: true, font: FONT, size: 20 }),
          ],
        }),
      )
    const numberRun = new TextRun({
      text: i === 0 ? `${first.position}.` : '',
      bold: true,
      font: FONT,
      size: SIZE,
    })
    out.push(
      new Paragraph({
        spacing: { before: i === 0 ? 160 : 0, after: 60 },
        keepNext: true,
        tabStops: [
          { type: TabStopType.LEFT, position: 480 },
          { type: TabStopType.RIGHT, position: RIGHT_TAB },
        ],
        children: [
          new Bookmark({
            id: `ppq_${q.id.replace(/-/g, '')}`,
            children: [numberRun],
          }),
          new TextRun({ text: '\t', font: FONT, size: SIZE }),
          ...runsFor(q.text),
          ...(i === group.length - 1
            ? [
                new TextRun({ text: '\t', font: FONT, size: SIZE }),
                new TextRun({
                  text: marksText,
                  bold: true,
                  font: FONT,
                  size: SIZE,
                }),
              ]
            : []),
        ],
      }),
    )
    const img = await diagramImage(q)
    if (img)
      out.push(
        new Paragraph({
          indent: { left: 480 },
          spacing: { after: 60 },
          children: [img],
        }),
      )
    if (OBJECTIVE.has(q.type))
      for (const o of [...q.options].sort(
        (a, b) => a.order_index - b.order_index,
      ))
        out.push(
          new Paragraph({
            indent: { left: 780, hanging: 300 },
            spacing: { after: 20 },
            children: [
              new TextRun({ text: `(${o.label})\t`, font: FONT, size: SIZE }),
              ...runsFor(o.text),
            ],
            tabStops: [{ type: TabStopType.LEFT, position: 780 }],
          }),
        )
  }
  return out
}

const cell = (text: string) =>
  new TableCell({
    width: { size: 33, type: WidthType.PERCENTAGE },
    margins: { top: 40, bottom: 40, left: 80, right: 80 },
    children: [
      new Paragraph({
        children: [new TextRun({ text, font: FONT, size: 21 })],
      }),
    ],
  })

export async function buildPaperDocx(
  input: PaperTemplateInput,
): Promise<Buffer> {
  const hy = input.halfYearly
  const hours = input.durationMin / 60
  const time =
    input.durationMin >= 120
      ? `${Number.isInteger(hours) ? hours : hours.toFixed(1)} hours`
      : `${input.durationMin} minutes`
  const body: Array<Paragraph | Table> = []
  body.push(
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({ text: input.title, bold: true, font: FONT, size: 30 }),
      ],
    }),
  )
  body.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            cell(`Name: ${input.studentName}`),
            cell('Roll No.: ________'),
            cell('Section: ________'),
          ],
        }),
        new TableRow({
          children: [
            cell(`Class: ${input.class} (${input.board})`),
            cell(`Subject: ${hy?.subjectName ?? ''}`),
            cell('Date: ____________'),
          ],
        }),
        new TableRow({
          children: [
            cell(`Maximum marks: ${hy?.nominalMarks ?? input.totalMarks}`),
            cell(`Time: ${time}`),
            cell(''),
          ],
        }),
      ],
    }),
  )
  if (hy && hy.instructions.length > 0) {
    body.push(
      new Paragraph({
        spacing: { before: 200, after: 60 },
        children: [
          new TextRun({
            text: 'General instructions',
            bold: true,
            font: FONT,
            size: SIZE,
          }),
        ],
      }),
    )
    hy.instructions.forEach((t, i) =>
      body.push(
        new Paragraph({
          indent: { left: 360, hanging: 360 },
          spacing: { after: 30 },
          children: [
            new TextRun({ text: `${i + 1}.\t${t}`, font: FONT, size: 21 }),
          ],
          tabStops: [{ type: TabStopType.LEFT, position: 360 }],
        }),
      ),
    )
  }
  const order = hy
    ? hy.sectionOrder
    : [...new Set(input.questions.map((q) => q.section))]
  for (const section of order) {
    const qs = input.questions.filter((q) => q.section === section)
    if (qs.length === 0) continue
    const total = hy?.sectionTotals[section]
    body.push(
      new Paragraph({
        spacing: { before: 280, after: 100 },
        keepNext: true,
        children: [
          new TextRun({
            text: `${section}${total !== undefined ? `  [${total} marks]` : ''}`,
            bold: true,
            underline: {},
            font: FONT,
            size: SIZE,
          }),
        ],
      }),
    )
    for (const g of groupQuestions(qs))
      body.push(...(await questionParagraphs(g)))
  }
  body.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 300 },
      children: [
        new TextRun({
          text: '— End of the question paper —',
          italics: true,
          font: FONT,
          size: 20,
        }),
      ],
    }),
  )

  const doc = new Document({
    creator: 'PrepPlan',
    title: input.title,
    description:
      'Question paper made by PrepPlan. Edit freely; the hidden question markers let PrepPlan read it back.',
    styles: { default: { document: { run: { font: FONT, size: SIZE } } } },
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 },
            margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 },
          },
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    children: [
                      'Page ',
                      PageNumber.CURRENT,
                      ' of ',
                      PageNumber.TOTAL_PAGES,
                    ],
                    font: FONT,
                    size: 18,
                  }),
                ],
              }),
            ],
          }),
        },
        children: body,
      },
    ],
  })
  return Buffer.from(await Packer.toBuffer(doc))
}
