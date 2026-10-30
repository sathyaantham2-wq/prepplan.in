import {
  AlignmentType,
  BorderStyle,
  Bookmark,
  Document,
  Footer,
  ImageRun,
  LevelFormat,
  Math as WordMath,
  MathFraction,
  MathRadical,
  MathRun,
  MathSubScript,
  MathSuperScript,
  Packer,
  PageNumber,
  Paragraph,
  Tab,
  Table,
  TableBorders,
  TableCell,
  TableLayoutType,
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

// The question paper as an editable Word file. It is built from the very same data as the PDF
// (PaperTemplateInput), so the two always agree, and like the PDF it never holds an answer.
//
// Layout (owner direction 2026-10-30): A4, 2 cm margins, one font (Times New Roman 12), "Page X of
// Y" centred in the footer. Everything is positioned with real Word styles, tab stops, indents and a
// borderless table, never with spaces or empty lines, so it stays aligned when a teacher edits it:
//  - header: school, exam, class and subject centred and bold; "Time" at the left and "Maximum Marks"
//    at the right of one line (a right tab at the margin), a thin rule under it;
//  - general instructions: a real numbered list;
//  - section headings centred and bold ("SECTION A"), with a smaller line under them;
//  - a question: its number at the margin, its text on a hanging indent (wrapped lines stay under
//    the text), its marks right-aligned on its last line with a right tab; statement lines and
//    sub-parts (i), (ii) get their own paragraphs, sub-parts one level further in; options (a)-(d)
//    in a 2 x 2 borderless table when short, one per line when long, aligned with the text; "OR"
//    centred on its own line; a small fixed gap after each question.
// Maths: fractions, roots, powers and subscripts are real Word equations; symbols (≤ ≥ ≠ × ÷ π °)
// stay as text, which Times New Roman has; anything the converter is not sure of stays as typed.
// Every question carries a hidden bookmark named ppq_<question id> and every paragraph a PrepPlan
// style, so a paper edited in Word can be read back exactly (own-paper-extract.ts).

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

const FONT = 'Times New Roman'
const SIZE = 24 // half-points: 12 pt
const SMALL = 22
const PAGE_W = 11906 // A4, twips
const PAGE_H = 16838
const MARGIN = 1134 // 2 cm
/** The writing width, and so the right tab stop that puts marks at the right margin. */
export const TEXT_W = PAGE_W - 2 * MARGIN
/** Where a question's text starts (its number sits at the margin). */
const Q_INDENT = 567
/** A sub-part's label sits one level further in; its text after that. */
const PART_LABEL = Q_INDENT + 425
const PART_TEXT = PART_LABEL + 482
/** An option's label sits under the question text; its text after the label. */
const OPT_LABEL_W = 482
/** Question text stops this far short of the margin, so the marks ("[3] (1+1+1)") always fit beside the
 * last line; the right tab for the marks stays at the margin, past this indent. */
const MARKS_W = 1300

/** Paragraph styles. The reader of an edited file (own-paper-extract.ts) knows them by these ids. */
export const DOCX_STYLES = {
  header: 'PPHeader',
  meta: 'PPMeta',
  instructionsHead: 'PPInstructionsHead',
  instruction: 'PPInstruction',
  section: 'PPSection',
  sectionNote: 'PPSectionNote',
  question: 'PPQuestion',
  questionMore: 'PPQuestionMore',
  part: 'PPPart',
  option: 'PPOption',
  or: 'PPOr',
  end: 'PPEnd',
} as const

/** Tab stops by style (set on each paragraph: the docx library keeps them out of styles). */
const TABS: Partial<
  Record<
    string,
    Array<{
      type: (typeof TabStopType)[keyof typeof TabStopType]
      position: number
    }>
  >
> = {
  [DOCX_STYLES.meta]: [{ type: TabStopType.RIGHT, position: TEXT_W }],
  [DOCX_STYLES.question]: [
    { type: TabStopType.LEFT, position: Q_INDENT },
    { type: TabStopType.RIGHT, position: TEXT_W },
  ],
  [DOCX_STYLES.questionMore]: [{ type: TabStopType.RIGHT, position: TEXT_W }],
  [DOCX_STYLES.part]: [
    { type: TabStopType.LEFT, position: PART_TEXT },
    { type: TabStopType.RIGHT, position: TEXT_W },
  ],
  [DOCX_STYLES.option]: [
    { type: TabStopType.LEFT, position: Q_INDENT + OPT_LABEL_W },
  ],
}

/** A question's text (or option, or part) as Word runs: plain text and real equations. */
export function runsFor(
  text: string,
  extra: { bold?: boolean; size?: number } = {},
): Array<TextRun | WordMath> {
  const base = { font: FONT, size: extra.size ?? SIZE, bold: extra.bold }
  const segs = parseMathText(text)
  const runs: Array<TextRun | WordMath> = []
  segs.forEach((seg, i) => {
    if (seg.kind === 'text') {
      // a power or subscript right after this text takes its base (x in x^2, H in H₂) from it
      const next = segs.at(i + 1)
      let t = seg.text
      let base2: string | null = null
      if (next && (next.kind === 'sup' || next.kind === 'sub')) {
        const m = /([A-Za-z0-9.]+|\))$/.exec(t)
        if (m) {
          base2 = m[1]
          t = t.slice(0, m.index)
        }
      }
      if (t) runs.push(new TextRun({ ...base, text: t }))
      if (base2 !== null) pendingBase = base2
      return
    }
    if (seg.kind === 'frac')
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
    else {
      const b = pendingBase ?? ''
      pendingBase = null
      runs.push(
        new WordMath({
          children: [
            seg.kind === 'sup'
              ? new MathSuperScript({
                  children: [new MathRun(b)],
                  superScript: [new MathRun(seg.text)],
                })
              : new MathSubScript({
                  children: [new MathRun(b)],
                  subScript: [new MathRun(seg.text)],
                }),
          ],
        }),
      )
    }
  })
  pendingBase = null
  return runs
}
let pendingBase: string | null = null

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

const ROMAN = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii']
const LETTERS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

/**
 * A written question's stem and its sub-parts, when the text labels them in order: (a), (b), ... or
 * (i), (ii), .... Anything else stays one piece. Text in brackets that is not a run of labels from
 * (a) or (i) is never split.
 */
export function splitParts(text: string): {
  stem: string
  parts: Array<{ label: string; text: string }>
} {
  const marks = [...text.matchAll(/(^|\s)\(([a-h]|i{1,3}|iv|vi{0,3})\)\s+/g)]
  for (const series of [LETTERS, ROMAN]) {
    const hits = marks.filter((m) => series.includes(m[2]))
    const ordered: typeof hits = []
    for (const h of hits) if (h[2] === series[ordered.length]) ordered.push(h)
    if (ordered.length < 2) continue
    const starts = ordered.map((h) => h.index + h[1].length)
    const parts = ordered.map((h, k) => ({
      label: h[2],
      text: text
        .slice(
          starts[k] + h[0].length - h[1].length,
          starts.at(k + 1) ?? text.length,
        )
        .trim(),
    }))
    return { stem: text.slice(0, starts[0]).trim(), parts }
  }
  return { stem: text, parts: [] }
}

const shortOptions = (opts: ReadonlyArray<{ text: string }>) =>
  opts.length === 4 &&
  opts.every((o) => o.text.length <= 30 && !o.text.includes('\n'))

const noBorders = TableBorders.NONE

// a real tab (<w:tab/>), not a tab character inside the text, which some editors draw as a space
const tabRun = () =>
  new TextRun({ children: [new Tab()], font: FONT, size: SIZE })

async function questionBlock(
  group: Array<PaperTemplateQuestion>,
): Promise<Array<Paragraph | Table>> {
  const out: Array<Paragraph | Table> = []
  const first = group[0]
  const marksRuns = [
    tabRun(),
    new TextRun({
      // with the split ("(1+2)") after it, as the PDF prints it
      text: first.mark_split
        ? `[${first.marks}] ${first.mark_split}`
        : `[${first.marks}]`,
      bold: true,
      font: FONT,
      size: SIZE,
    }),
  ]
  for (const [i, q] of group.entries()) {
    if (i > 0)
      out.push(
        new Paragraph({
          style: DOCX_STYLES.or,
          tabStops: TABS[DOCX_STYLES.or],
          children: [
            new TextRun({ text: 'OR', bold: true, font: FONT, size: SIZE }),
          ],
        }),
      )
    const lastOfGroup = i === group.length - 1
    const objective = OBJECTIVE.has(q.type)
    const { stem, parts } = objective
      ? { stem: q.text, parts: [] }
      : splitParts(q.text)
    const lines = stem
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
    const options = objective
      ? [...q.options].sort((a, b) => a.order_index - b.order_index)
      : []
    const img = await diagramImage(q)
    // the marks go on the question's last line of text: the stem's last line for a choice question
    // (its options follow), the last sub-part otherwise
    const marksOnStemLine = (k: number) =>
      lastOfGroup && parts.length === 0 && k === lines.length - 1
    const numberRun = new TextRun({
      text: i === 0 ? `${first.position}.` : '',
      bold: true,
      font: FONT,
      size: SIZE,
    })
    const bookmark = new Bookmark({
      id: `ppq_${q.id.replace(/-/g, '')}`,
      children: [numberRun],
    })
    // a question that begins with its first sub-part ("(a) Round ...") puts that part on the
    // number's line, its label and text lined up with the parts under it
    const partsOnly = lines.length === 0 && parts.length > 0 && !img
    out.push(
      partsOnly
        ? new Paragraph({
            style: DOCX_STYLES.question,
            indent: { left: PART_TEXT, hanging: PART_TEXT, right: MARKS_W },
            tabStops: [
              { type: TabStopType.LEFT, position: PART_LABEL },
              { type: TabStopType.LEFT, position: PART_TEXT },
              { type: TabStopType.RIGHT, position: TEXT_W },
            ],
            children: [
              bookmark,
              tabRun(),
              new TextRun({
                text: `(${parts[0].label})`,
                font: FONT,
                size: SIZE,
              }),
              tabRun(),
              ...runsFor(parts[0].text),
              ...(lastOfGroup && parts.length === 1 ? marksRuns : []),
            ],
          })
        : new Paragraph({
            style: DOCX_STYLES.question,
            tabStops: TABS[DOCX_STYLES.question],
            children: [
              bookmark,
              tabRun(),
              ...runsFor(lines[0] ?? ''),
              ...(marksOnStemLine(0) ? marksRuns : []),
            ],
          }),
    )
    for (const [k, line] of lines.slice(1).entries())
      out.push(
        new Paragraph({
          style: DOCX_STYLES.questionMore,
          tabStops: TABS[DOCX_STYLES.questionMore],
          children: [
            ...runsFor(line),
            ...(marksOnStemLine(k + 1) ? marksRuns : []),
          ],
        }),
      )
    if (img)
      out.push(
        new Paragraph({
          style: DOCX_STYLES.questionMore,
          tabStops: TABS[DOCX_STYLES.questionMore],
          children: [img],
        }),
      )
    for (const [k, p] of parts.entries())
      if (!(partsOnly && k === 0))
        out.push(
          new Paragraph({
            style: DOCX_STYLES.part,
            tabStops: TABS[DOCX_STYLES.part],
            children: [
              new TextRun({ text: `(${p.label})`, font: FONT, size: SIZE }),
              tabRun(),
              ...runsFor(p.text),
              ...(lastOfGroup && k === parts.length - 1 ? marksRuns : []),
            ],
          }),
        )
    const optionPara = (o: { label: string; text: string }) =>
      new Paragraph({
        style: DOCX_STYLES.option,
        tabStops: TABS[DOCX_STYLES.option],
        children: [
          new TextRun({
            text: `(${o.label.toLowerCase()})`,
            font: FONT,
            size: SIZE,
          }),
          tabRun(),
          ...runsFor(o.text),
        ],
      })
    if (options.length > 0 && shortOptions(options)) {
      const half = Math.round((TEXT_W - Q_INDENT) / 2)
      const cell = (o: { label: string; text: string }) =>
        new TableCell({
          width: { size: half, type: WidthType.DXA },
          borders: noBorders,
          margins: { top: 0, bottom: 0, left: 0, right: 0 },
          children: [optionPara(o)],
        })
      out.push(
        new Table({
          layout: TableLayoutType.FIXED,
          indent: { size: Q_INDENT, type: WidthType.DXA },
          width: { size: TEXT_W - Q_INDENT, type: WidthType.DXA },
          columnWidths: [half, half],
          borders: noBorders,
          rows: [
            new TableRow({ children: [cell(options[0]), cell(options[1])] }),
            new TableRow({ children: [cell(options[2]), cell(options[3])] }),
          ],
        }),
      )
    } else for (const o of options) out.push(optionPara(o))
  }
  // a small fixed gap after the question (never an empty paragraph)
  out.push(new Paragraph({ style: 'PPGap', children: [] }))
  return out
}

/** "Section A — Multiple choice (1 mark each)" -> "SECTION A" and "Multiple choice (1 mark each)". */
export function sectionHeading(name: string): {
  head: string
  note: string | null
} {
  const m = /^section\s+([A-Z0-9]+)\s*(?:[—–:-]\s*(.*))?$/i.exec(name.trim())
  if (!m) return { head: name.trim(), note: null }
  return {
    head: `SECTION ${m[1].toUpperCase()}`,
    note: m[2] ? m[2].trim() || null : null,
  }
}

const para = (opts: ConstructorParameters<typeof Paragraph>[0]) =>
  new Paragraph(opts)

export async function buildPaperDocx(
  input: PaperTemplateInput,
): Promise<Buffer> {
  const hy = input.halfYearly
  const hours = input.durationMin / 60
  const time =
    input.durationMin >= 120
      ? `${Number.isInteger(hours) ? hours : hours.toFixed(1)} hours`
      : `${input.durationMin} minutes`
  const [school, exam] = input.title.includes(' — ')
    ? (input.title.split(' — ', 2) as [string, string])
    : [input.title, '']
  const body: Array<Paragraph | Table> = []
  const header = (t: string) =>
    para({
      style: DOCX_STYLES.header,
      children: [new TextRun({ text: t, bold: true, font: FONT, size: SIZE })],
    })
  body.push(header(school))
  if (exam) body.push(header(exam))
  body.push(
    header(
      `Class ${input.class}${hy?.subjectName ? ` · ${hy.subjectName}` : ''}`,
    ),
  )
  body.push(
    para({
      style: DOCX_STYLES.meta,
      tabStops: TABS[DOCX_STYLES.meta],
      children: [
        new TextRun({
          text: `Time: ${time}`,
          bold: true,
          font: FONT,
          size: SIZE,
        }),
        tabRun(),
        new TextRun({
          text: `Maximum Marks: ${hy?.nominalMarks ?? input.totalMarks}`,
          bold: true,
          font: FONT,
          size: SIZE,
        }),
      ],
    }),
  )
  if (input.studentName)
    body.push(
      para({
        style: DOCX_STYLES.questionMore,
        children: [
          new TextRun({
            text: `Name: ${input.studentName}`,
            font: FONT,
            size: SIZE,
          }),
        ],
      }),
    )
  if (hy && hy.instructions.length > 0) {
    body.push(
      para({
        style: DOCX_STYLES.instructionsHead,
        children: [
          new TextRun({
            text: 'General Instructions:',
            bold: true,
            font: FONT,
            size: SIZE,
          }),
        ],
      }),
    )
    for (const t of hy.instructions)
      body.push(
        para({
          style: DOCX_STYLES.instruction,
          numbering: { reference: 'pp-instructions', level: 0 },
          children: runsFor(t),
        }),
      )
  }
  const order = hy
    ? hy.sectionOrder
    : [...new Set(input.questions.map((q) => q.section))]
  for (const section of order) {
    const qs = input.questions.filter((q) => q.section === section)
    if (qs.length === 0) continue
    const { head, note: rawNote } = sectionHeading(section)
    const total = hy?.sectionTotals[section]
    const note =
      [rawNote, total !== undefined ? `[${total} marks]` : null]
        .filter(Boolean)
        .join('  ') || null
    body.push(
      para({
        style: DOCX_STYLES.section,
        children: [
          new TextRun({ text: head, bold: true, font: FONT, size: SIZE }),
        ],
      }),
    )
    if (note)
      body.push(
        para({
          style: DOCX_STYLES.sectionNote,
          children: [new TextRun({ text: note, font: FONT, size: SMALL })],
        }),
      )
    for (const g of groupQuestions(qs)) body.push(...(await questionBlock(g)))
  }
  body.push(
    para({
      style: DOCX_STYLES.end,
      children: [
        new TextRun({
          text: '— End of the question paper —',
          italics: true,
          font: FONT,
          size: SMALL,
        }),
      ],
    }),
  )

  const run = { font: FONT, size: SIZE }
  const doc = new Document({
    creator: 'PrepPlan',
    title: input.title,
    description:
      'Question paper made by PrepPlan. Edit freely; the hidden question markers let PrepPlan read it back.',
    styles: {
      default: {
        document: {
          run: { font: FONT, size: SIZE },
          paragraph: { spacing: { before: 0, after: 0, line: 276 } },
        },
      },
      paragraphStyles: [
        {
          id: DOCX_STYLES.header,
          name: 'PrepPlan Header',
          basedOn: 'Normal',
          run: { ...run, bold: true },
          paragraph: {
            alignment: AlignmentType.CENTER,
            spacing: { after: 20 },
          },
        },
        {
          id: DOCX_STYLES.meta,
          name: 'PrepPlan Time and Marks',
          basedOn: 'Normal',
          run: { ...run, bold: true },
          paragraph: {
            spacing: { before: 120, after: 160 },
            border: {
              bottom: {
                style: BorderStyle.SINGLE,
                size: 6,
                color: '000000',
                space: 4,
              },
            },
          },
        },
        {
          id: DOCX_STYLES.instructionsHead,
          name: 'PrepPlan Instructions Heading',
          basedOn: 'Normal',
          run: { ...run, bold: true },
          paragraph: { spacing: { before: 120, after: 40 }, keepNext: true },
        },
        {
          id: DOCX_STYLES.instruction,
          name: 'PrepPlan Instruction',
          basedOn: 'Normal',
          run,
          paragraph: { spacing: { after: 20 } },
        },
        {
          id: DOCX_STYLES.section,
          name: 'PrepPlan Section',
          basedOn: 'Normal',
          run: { ...run, bold: true },
          paragraph: {
            alignment: AlignmentType.CENTER,
            spacing: { before: 280, after: 0 },
            keepNext: true,
          },
        },
        {
          id: DOCX_STYLES.sectionNote,
          name: 'PrepPlan Section Note',
          basedOn: 'Normal',
          run: { font: FONT, size: SMALL },
          paragraph: {
            alignment: AlignmentType.CENTER,
            spacing: { after: 140 },
            keepNext: true,
          },
        },
        {
          id: DOCX_STYLES.question,
          name: 'PrepPlan Question',
          basedOn: 'Normal',
          run,
          paragraph: {
            indent: { left: Q_INDENT, hanging: Q_INDENT, right: MARKS_W },
            keepNext: true,
          },
        },
        {
          id: DOCX_STYLES.questionMore,
          name: 'PrepPlan Question Line',
          basedOn: 'Normal',
          run,
          paragraph: {
            indent: { left: Q_INDENT, right: MARKS_W },
            keepNext: true,
          },
        },
        {
          id: DOCX_STYLES.part,
          name: 'PrepPlan Sub-part',
          basedOn: 'Normal',
          run,
          paragraph: {
            indent: {
              left: PART_TEXT,
              hanging: PART_TEXT - PART_LABEL,
              right: MARKS_W,
            },
            keepNext: true,
          },
        },
        {
          id: DOCX_STYLES.option,
          name: 'PrepPlan Option',
          basedOn: 'Normal',
          run,
          paragraph: {
            indent: { left: Q_INDENT + OPT_LABEL_W, hanging: OPT_LABEL_W },
            keepNext: true,
          },
        },
        {
          id: DOCX_STYLES.or,
          name: 'PrepPlan OR',
          basedOn: 'Normal',
          run: { ...run, bold: true },
          paragraph: {
            alignment: AlignmentType.CENTER,
            spacing: { before: 60, after: 60 },
            keepNext: true,
          },
        },
        {
          id: 'PPGap',
          name: 'PrepPlan Gap',
          basedOn: 'Normal',
          run: { font: FONT, size: 8 },
          paragraph: {
            spacing: { before: 0, after: 0, line: 160, lineRule: 'exact' },
          },
        },
        {
          id: DOCX_STYLES.end,
          name: 'PrepPlan End',
          basedOn: 'Normal',
          run: { font: FONT, size: SMALL, italics: true },
          paragraph: {
            alignment: AlignmentType.CENTER,
            spacing: { before: 240 },
          },
        },
      ],
    },
    numbering: {
      config: [
        {
          reference: 'pp-instructions',
          levels: [
            {
              level: 0,
              format: LevelFormat.DECIMAL,
              text: '%1.',
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: { indent: { left: Q_INDENT, hanging: Q_INDENT } },
              },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: PAGE_W, height: PAGE_H },
            margin: {
              top: MARGIN,
              bottom: MARGIN,
              left: MARGIN,
              right: MARGIN,
            },
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
                    size: SMALL,
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
