import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  Header,
  Packer,
  PageNumber,
  Paragraph,
  TextRun,
} from 'docx'
import type { KeyTemplateInput, KeyTemplateQuestion } from './key-template'
import { runsFor } from './paper-docx'

// The answer key as an editable Word file (owner direction 2026-10-30: "question paper + answer key, Word
// and PDF"). Built from the same data as the teacher copy PDF (KeyTemplateInput), so the two agree: every
// answer, the step marks, the exam's details and every gap. For staff only; it carries a "teacher copy"
// line on every page.

const FONT = 'Cambria'
const SIZE = 22

const text = (
  t: string,
  o: { bold?: boolean; size?: number; color?: string; italics?: boolean } = {},
) =>
  new TextRun({
    text: t,
    font: FONT,
    size: o.size ?? SIZE,
    bold: o.bold,
    color: o.color,
    italics: o.italics,
  })

function answerLine(q: KeyTemplateQuestion): Paragraph {
  const objective =
    (q.type === 'mcq' || q.type === 'assertion_reason') && q.correctOptionLabel
  return new Paragraph({
    spacing: { after: 60 },
    indent: { left: 360 },
    children: objective
      ? [
          text('Answer: ', { bold: true }),
          text(`(${q.correctOptionLabel}) `, { bold: true }),
          ...runsFor(q.answer, { size: SIZE }),
        ]
      : [
          text('Answer: ', { bold: true }),
          ...runsFor(q.answer, { size: SIZE }),
        ],
  })
}

export async function buildAnswerKeyDocx(
  input: KeyTemplateInput,
): Promise<Buffer> {
  const body: Array<Paragraph> = []
  body.push(
    new Paragraph({
      spacing: { after: 60 },
      children: [text(input.title, { bold: true, size: 30 })],
    }),
  )
  body.push(
    new Paragraph({
      spacing: { after: 120 },
      children: [
        text('Answer key and marking scheme', { bold: true, size: 24 }),
      ],
    }),
  )
  for (const d of input.teacherCopy?.details ?? [])
    body.push(
      new Paragraph({
        spacing: { after: 30 },
        children: [text(d, { size: 20 })],
      }),
    )
  const gaps = input.teacherCopy?.gaps ?? []
  if (gaps.length > 0) {
    body.push(
      new Paragraph({
        spacing: { before: 160, after: 60 },
        border: {
          left: {
            style: BorderStyle.SINGLE,
            size: 18,
            color: 'AA0000',
            space: 6,
          },
        },
        children: [text('Gaps in this paper', { bold: true, color: 'AA0000' })],
      }),
    )
    for (const g of gaps)
      body.push(
        new Paragraph({
          bullet: { level: 0 },
          border: {
            left: {
              style: BorderStyle.SINGLE,
              size: 18,
              color: 'AA0000',
              space: 6,
            },
          },
          children: [text(g, { size: 20 })],
        }),
      )
  }
  const sorted = [...input.questions].sort((a, b) => a.position - b.position)
  let section = ''
  let lastGroup: string | null = null
  for (const q of sorted) {
    if (q.section !== section) {
      section = q.section
      body.push(
        new Paragraph({
          spacing: { before: 280, after: 100 },
          keepNext: true,
          children: [
            new TextRun({
              text: section,
              bold: true,
              underline: {},
              font: FONT,
              size: SIZE,
            }),
          ],
        }),
      )
    }
    if (q.choice_group && q.choice_group === lastGroup)
      body.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 40, after: 40 },
          keepNext: true,
          children: [text('OR', { bold: true, size: 20 })],
        }),
      )
    lastGroup = q.choice_group
    body.push(
      new Paragraph({
        spacing: { before: 120, after: 40 },
        keepNext: true,
        children: [
          text(`Q${q.position}. `, { bold: true }),
          ...runsFor(q.text, { size: SIZE }),
          text(`  [${q.marks} ${q.marks === 1 ? 'mark' : 'marks'}]`, {
            size: 20,
            color: '555555',
          }),
        ],
      }),
    )
    body.push(answerLine(q))
    if (q.diagram_kind)
      body.push(
        new Paragraph({
          indent: { left: 360 },
          children: [
            text('This question has a diagram; see the question paper.', {
              italics: true,
              size: 20,
              color: '555555',
            }),
          ],
        }),
      )
    for (const s of q.stepMarks)
      body.push(
        new Paragraph({
          indent: { left: 720, hanging: 360 },
          spacing: { after: 20 },
          children: [
            text(`Step ${s.step_no}: `, { size: 20, bold: true }),
            ...runsFor(s.description, { size: 20 }),
            text(`  (${s.marks})`, { size: 20 }),
          ],
        }),
      )
  }
  body.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 300 },
      children: [
        text('— End of the answer key —', { italics: true, size: 20 }),
      ],
    }),
  )

  const doc = new Document({
    creator: 'PrepPlan',
    title: `${input.title} — answer key`,
    description: 'Answer key made by PrepPlan. For teachers only.',
    styles: { default: { document: { run: { font: FONT, size: SIZE } } } },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1000, bottom: 1000, left: 1134, right: 1134 },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  text('TEACHER COPY — ANSWER KEY — DO NOT GIVE TO STUDENTS', {
                    bold: true,
                    size: 16,
                    color: 'AA0000',
                  }),
                ],
              }),
            ],
          }),
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
