import type { BloomLevel, DifficultyTier, QuestionType } from '../../db/enums'
import { PDF_FONT_FACES, withTelugu } from './fonts'
import { escapeHtml } from './html-utils'
import { renderDiagramSvg } from './diagrams'
import { DEFAULT_THEME, THEME_PACKS, THEME_STYLES } from './themes'
import type { PaperTheme } from './themes'

export interface PaperTemplateQuestion {
  id: string
  section: string
  position: number
  marks: number
  bloom: BloomLevel
  difficulty: DifficultyTier
  type: QuestionType
  text: string
  diagram_kind: string | null
  diagram_params: unknown
  // Which concept the question tests; printed small under the question.
  concept_name?: string | null
  // F030: two questions sharing a non-null choice_group are an "attempt one of these" OR pair --
  // rendered together under one shared [marks] and one printed slot number, an "OR" divider
  // between them, never as two separately-numbered questions.
  choice_group: string | null
  // School Half-Yearly: the layout slot it filled, and the printed mark split such as "(1+2)".
  slot?: string | null
  mark_split?: string
  // Never includes is_correct or the correct-answer text -- this template renders the STUDENT
  // paper, and a student can never see or download an answer key (CLAUDE.md hard rule).
  options: Array<{ label: string; text: string; order_index: number }>
}

export interface PaperTemplateInput {
  title: string
  studentName: string
  board: string
  class: number
  durationMin: number
  totalMarks: number
  chapters: Array<{ part: string; chapter_no: number; name: string }>
  questions: Array<PaperTemplateQuestion>
  shortfalls: Array<{ section: string; reason: string; slot?: string }>
  theme?: PaperTheme
  // School Half-Yearly paper: header block, general instructions, section headings with totals.
  halfYearly?: {
    subjectName: string
    instructions: Array<string>
    // Headings in print order, and what each is worth.
    sectionOrder: Array<string>
    sectionTotals: Record<string, number>
    // The marks the layout is worth, which exceeds totalMarks when a shortfall leaves some out.
    nominalMarks: number
    // Set by the two-pass render once the real page count is known.
    pageCount?: number
    draftNote?: string | null
  }
}

const ANSWER_LINE_COUNT: Record<QuestionType, number> = {
  mcq: 0,
  assertion_reason: 0,
  match: 0,
  multi_statement: 0,
  fill_blank: 1,
  short_answer: 3,
  long_answer: 6,
  diagram: 4,
}

function renderOptions(
  options: Array<{ label: string; text: string; order_index: number }>,
): string {
  const sorted = [...options].sort((a, b) => a.order_index - b.order_index)
  return `<div class="options">${sorted
    .map(
      (o) =>
        `<div class="option">(${escapeHtml(o.label)}) ${escapeHtml(o.text)}</div>`,
    )
    .join('')}</div>`
}

function renderAnswerLines(marks: number, type: QuestionType): string {
  const baseLines = ANSWER_LINE_COUNT[type]
  if (baseLines === 0) return ''
  // Long-answer questions scale their ruled space with the marks on offer; everything else uses
  // a fixed, type-appropriate line count.
  const lineCount =
    type === 'long_answer'
      ? Math.min(Math.max(marks * 2, baseLines), 12)
      : baseLines
  return `<div class="answer-lines">${Array.from({ length: lineCount })
    .map(() => '<div class="answer-line"></div>')
    .join('')}</div>`
}

function renderQuestionBody(q: PaperTemplateQuestion): string {
  const optionsHtml =
    q.type === 'mcq' ||
    q.type === 'assertion_reason' ||
    q.type === 'match' ||
    q.type === 'multi_statement'
      ? renderOptions(q.options)
      : ''
  const answerLinesHtml = renderAnswerLines(q.marks, q.type)
  // F024: a known diagram_kind renders the real SVG figure, printed at the start of the question
  // (the thing the student reads/labels), followed by F035's existing blank draw-box underneath
  // so there is still room to mark it up or work through it by hand. An unrecognised diagram_kind
  // (or one whose diagram_params fail that kind's schema) falls back to exactly F035's original
  // behaviour -- a bare draw-here box -- rather than a broken or missing figure.
  const diagramSvg = renderDiagramSvg(q.diagram_kind, q.diagram_params)
  const diagramHtml = diagramSvg ? `<div class="diagram">${diagramSvg}</div>` : ''
  const drawBoxHtml = q.diagram_kind ? '<div class="draw-box"></div>' : ''

  return `
        <div class="q-text">${escapeHtml(q.text)}</div>
        ${optionsHtml}
        ${diagramHtml}
        ${drawBoxHtml}
        ${answerLinesHtml}
        ${q.concept_name ? `<div class="q-concept">Concept: ${escapeHtml(q.concept_name)}</div>` : ''}`
}

function renderQuestion(q: PaperTemplateQuestion): string {
  // q.position is the paper's own running slot number (assigned once, across every section, when
  // generatePaper inserted paper_questions) -- reusing it here keeps numbering continuous across
  // sections (1..N) rather than restarting at 1 in every section.
  return `
    <div class="question">
      <div class="q-number">${q.position}.</div>
      <div class="q-body">${renderQuestionBody(q)}
      </div>
      <div class="q-marks">[${q.marks}]${q.mark_split ? `<div class="mark-split">${escapeHtml(q.mark_split)}</div>` : ''}</div>
    </div>`
}

/**
 * F030: an OR pair prints as ONE numbered/marked block -- q.position and q.marks are the SAME on
 * both members (generatePaper assigns one shared choiceGroup's marks value to each), so the
 * primary's is used for both, and the "OR" divider is the only thing that tells them apart.
 */
function renderChoicePair(
  primary: PaperTemplateQuestion,
  alternate: PaperTemplateQuestion,
): string {
  return `
    <div class="question choice-pair">
      <div class="q-number">${primary.position}.</div>
      <div class="q-body">${renderQuestionBody(primary)}
        <div class="or-divider">OR</div>${renderQuestionBody(alternate)}
      </div>
      <div class="q-marks">[${primary.marks}]${primary.mark_split ? `<div class="mark-split">${escapeHtml(primary.mark_split)}</div>` : ''}</div>
    </div>`
}

/**
 * Consecutive questions sharing a non-null choice_group are the two members of one OR pair
 * (generatePaper always inserts them adjacently) -- rendered together via renderChoicePair;
 * everything else renders singly, unchanged from before F030.
 */
function renderQuestionsInSection(
  questions: Array<PaperTemplateQuestion>,
): string {
  const html: Array<string> = []
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i]
    const next = questions.at(i + 1)
    if (q.choice_group !== null && next?.choice_group === q.choice_group) {
      html.push(renderChoicePair(q, next))
      i += 1
      continue
    }
    html.push(renderQuestion(q))
  }
  return html.join('')
}

/**
 * Questions of one section, with a small sub-heading wherever the layout slot changes (for
 * example "2-mark very short answer"), and the shortfall notes for a slot printed under it so a
 * missing question is visible where it would have been.
 */
function renderHalfYearlySection(
  questions: Array<PaperTemplateQuestion>,
  notesBySlot: Map<string, Array<string>>,
  slotOrder: Array<string>,
): string {
  const bySlot = new Map<string, Array<PaperTemplateQuestion>>()
  for (const q of questions) {
    const key = q.slot ?? ''
    bySlot.set(key, [...(bySlot.get(key) ?? []), q])
  }
  const slots = [...new Set([...slotOrder, ...bySlot.keys(), ...notesBySlot.keys()])]
  return slots
    .map((slot) => {
      const qs = bySlot.get(slot) ?? []
      const notes = notesBySlot.get(slot) ?? []
      if (qs.length === 0 && notes.length === 0) return ''
      return `
        ${slot ? `<div class="slot-title">${escapeHtml(slot)}</div>` : ''}
        ${renderQuestionsInSection(qs)}
        ${notes.map((n) => `<div class="slot-note">Not printed: ${escapeHtml(n)}</div>`).join('')}`
    })
    .join('')
}

function groupBySection(
  questions: Array<PaperTemplateQuestion>,
): Array<{ section: string; questions: Array<PaperTemplateQuestion> }> {
  const groups: Array<{
    section: string
    questions: Array<PaperTemplateQuestion>
  }> = []
  for (const q of [...questions].sort((a, b) => a.position - b.position)) {
    const current = groups.at(-1)
    if (current && current.section === q.section) {
      current.questions.push(q)
    } else {
      groups.push({ section: q.section, questions: [q] })
    }
  }
  return groups
}

/**
 * F033/F035: the student-facing paper. A4 via the Playwright page.pdf() margin options (see
 * render.ts), printBackground on, `page-break-inside: avoid` on every question block so a
 * question is never split across a page, and a narrow ruled rough-work column that repeats on
 * every printed page via `position: fixed` (Chromium's standard trick for a per-page print
 * decoration, since @page margin boxes aren't supported).
 */
export function buildPaperHtml(input: PaperTemplateInput): string {
  const hy = input.halfYearly
  const sections = hy
    ? hy.sectionOrder.map((section) => ({
        section,
        questions: input.questions
          .filter((q) => q.section === section)
          .sort((a, b) => a.position - b.position),
      }))
    : groupBySection(input.questions)
  const printedMarks = input.questions
    .filter((q, i, all) => q.choice_group === null || all.findIndex((x) => x.choice_group === q.choice_group) === i)
    .reduce((n, q) => n + q.marks, 0)
  const hours = input.durationMin / 60
  const timeLabel = hy ? `${Number.isInteger(hours) ? hours : hours.toFixed(1)} hours` : `${input.durationMin} min`
  const sectionNotes = (section: string) => {
    const bySlot = new Map<string, Array<string>>()
    for (const f of input.shortfalls) {
      if (f.section !== section) continue
      bySlot.set(f.slot ?? '', [...(bySlot.get(f.slot ?? '') ?? []), f.reason])
    }
    return bySlot
  }
  const hyHeader = hy
    ? `
      <table class="hy-fields">
        <tr><td>Name: ${escapeHtml(input.studentName)}</td><td>Roll No.: ________</td><td>Section: ________</td></tr>
        <tr><td>Class: ${input.class} (${escapeHtml(input.board)})</td><td>Subject: ${escapeHtml(hy.subjectName)}</td><td>Date: ____________</td></tr>
        <tr><td>Maximum marks: ${hy.nominalMarks}${printedMarks !== hy.nominalMarks ? ` (${printedMarks} printed — see the notes)` : ''}</td><td>Time: ${timeLabel}</td><td>${hy.pageCount ? `Printed pages: ${hy.pageCount}` : ''}</td></tr>
      </table>
      ${hy.draftNote ? `<div class="draft-banner">${escapeHtml(hy.draftNote)}</div>` : ''}
      <div class="instructions"><strong>General instructions</strong><ol>${hy.instructions.map((i) => `<li>${escapeHtml(i)}</li>`).join('')}</ol></div>`
    : ''
  const themePack = THEME_PACKS[input.theme ?? DEFAULT_THEME]
  const chaptersLabel = input.chapters
    .map(
      (c) =>
        `Part ${escapeHtml(c.part)} Ch.${c.chapter_no} — ${escapeHtml(c.name)}`,
    )
    .join('; ')

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>${PDF_FONT_FACES}
  * { box-sizing: border-box; }
  body { font-family: ${withTelugu("Georgia, 'Times New Roman', serif")}; font-size: 11.5pt; color: #111; margin: 0; }
  .rough-column {
    position: fixed;
    top: 0; right: 0; bottom: 0;
    width: 16mm;
    border-left: 1px dashed #999;
    background-image: repeating-linear-gradient(to bottom, transparent 0 5mm, #ddd 5mm 5.3mm);
  }
  .rough-column .label {
    writing-mode: vertical-rl;
    text-align: center;
    font-size: 7pt;
    color: #888;
    padding-top: 4mm;
  }
  .content { margin-right: 18mm; }
  header.paper-header { border-bottom: 2px solid #111; padding-bottom: 6px; margin-bottom: 10px; position: relative; }
  header.paper-header h1 { font-size: 15pt; margin: 0 0 4px; }
  .theme-ornament { position: absolute; top: 0; right: 0; }
  .meta-row { display: flex; justify-content: space-between; font-size: 9.5pt; }
  .chapters { font-size: 8.5pt; color: #444; margin-top: 4px; }
  /* F107: never leave a section title alone at the bottom of a page; it moves with its first question. */
  .section-title { font-weight: bold; text-decoration: underline; margin: 14px 0 8px; break-after: avoid; page-break-after: avoid; }
  .q-concept { font-size: 0.8em; color: #666; margin-top: 4px; }
  .question { display: flex; page-break-inside: avoid; margin-bottom: 12px; }
  .or-divider { text-align: center; font-weight: bold; font-size: 9pt; color: #555; margin: 8px 0; }
  .q-number { flex: 0 0 28px; font-weight: bold; }
  .q-body { flex: 1 1 auto; padding-right: 10px; }
  .q-marks { flex: 0 0 32px; text-align: right; font-weight: bold; }
  .options { margin-top: 4px; }
  .option { margin: 2px 0 2px 12px; }
  .answer-lines { margin-top: 6px; }
  .answer-line { border-bottom: 1px solid #999; height: 15px; }
  .diagram { margin-top: 6px; }
  .diagram svg { display: block; max-width: 100%; height: auto; }
  .draw-box {
    border: 1px solid #333;
    height: 55px;
    margin-top: 6px;
    position: relative;
  }
  .draw-box::after {
    content: 'Draw here';
    position: absolute;
    bottom: 2px;
    right: 4px;
    font-size: 7pt;
    color: #999;
  }
  .hy-fields { width: 100%; border-collapse: collapse; font-size: 10pt; margin-top: 4px; }
  .hy-fields td { padding: 3px 4px; border: 1px solid #999; }
  .draft-banner { margin-top: 6px; padding: 4px 6px; border: 1px dashed #a60; color: #a60; font-size: 8.5pt; }
  .instructions { font-size: 9pt; margin-top: 6px; }
  .instructions ol { margin: 2px 0 0 18px; padding: 0; }
  .hy-section-title { display: flex; justify-content: space-between; text-decoration: none; border-bottom: 1px solid #111; font-size: 12pt; }
  .slot-title { font-size: 9.5pt; font-style: italic; margin: 8px 0 6px; color: #333; break-after: avoid; page-break-after: avoid; }
  .slot-note { font-size: 8.5pt; color: #a00; margin: 2px 0 8px 22px; }
  .mark-split { font-weight: normal; font-size: 8.5pt; color: #555; }
  .hy-question-text, .section .q-text { white-space: pre-line; }
  .shortfall-note {
    font-size: 8pt;
    color: #a00;
    margin-top: 16px;
    border-top: 1px dashed #a00;
    padding-top: 6px;
  }
  ${THEME_STYLES[input.theme ?? DEFAULT_THEME]}
</style>
</head>
<body>
  <div class="rough-column"><div class="label">Rough work</div></div>
  <div class="content">
    <header class="paper-header">
      ${themePack.cornerOrnament ? `<div class="theme-ornament">${themePack.cornerOrnament}</div>` : ''}
      <h1>${escapeHtml(input.title)}</h1>
      ${
        hy
          ? hyHeader
          : `<div class="meta-row">
        <span>Name: ${escapeHtml(input.studentName)}</span>
        <span>Class ${input.class} (${escapeHtml(input.board)})</span>
        <span>Time: ${input.durationMin} min</span>
        <span>Max Marks: ${input.totalMarks}</span>
      </div>`
      }
      ${chaptersLabel ? `<div class="chapters">Chapters covered: ${chaptersLabel}</div>` : ''}
    </header>
    ${sections
      .map(
        (group) => `
      <div class="section">
        ${
          hy
            ? `<div class="section-title hy-section-title"><span>${escapeHtml(group.section)}</span><span>${hy.sectionTotals[group.section] ?? ''} marks</span></div>
        ${renderHalfYearlySection(group.questions, sectionNotes(group.section), [])}`
            : `<div class="section-title">${escapeHtml(group.section)}</div>
        ${renderQuestionsInSection(group.questions)}`
        }
      </div>`,
      )
      .join('')}
    ${(() => {
      const rest = hy
        ? input.shortfalls.filter((f) => !hy.sectionOrder.includes(f.section))
        : input.shortfalls
      return rest.length > 0
        ? `<div class="shortfall-note">Note: ${rest
            .map((s) => escapeHtml(`${s.section}: ${s.reason}`))
            .join(' | ')}</div>`
        : ''
    })()}
  </div>
</body>
</html>`
}
