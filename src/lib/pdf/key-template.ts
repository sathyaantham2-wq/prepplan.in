import type { QuestionType } from '../../db/enums'
import { PDF_FONT_FACES, withTelugu } from './fonts'
import { escapeHtml } from './html-utils'
import type { CoverageRow } from './coverage'
import { renderDiagramSvg } from './diagrams'
import { DEFAULT_THEME, THEME_STYLES } from './themes'
import type { PaperTheme } from './themes'

export interface KeyTemplateQuestion {
  position: number
  section: string
  marks: number
  type: QuestionType
  text: string
  answer: string
  diagram_kind: string | null
  diagram_params: unknown
  choice_group: string | null
  correctOptionLabel: string | null
  stepMarks: Array<{ step_no: number; description: string; marks: number }>
}

export interface KeyTemplateInput {
  title: string
  questions: Array<KeyTemplateQuestion>
  coverage: Array<CoverageRow>
  theme?: PaperTheme
  /**
   * School teacher's copy: a banner on every page, the exam's details, and every gap in the paper
   * (never hidden). Replaces the parent-facing warning and the concept table.
   */
  teacherCopy?: { details: Array<string>; gaps: Array<string> }
}

function renderExpectedAnswer(q: KeyTemplateQuestion): string {
  if (
    (q.type === 'mcq' || q.type === 'assertion_reason') &&
    q.correctOptionLabel
  ) {
    return `Correct option: <strong>${escapeHtml(q.correctOptionLabel)}</strong> — ${escapeHtml(q.answer)}`
  }
  return escapeHtml(q.answer)
}

function renderStepMarks(
  steps: Array<{ step_no: number; description: string; marks: number }>,
): string {
  if (steps.length === 0) return ''
  const sorted = [...steps].sort((a, b) => a.step_no - b.step_no)
  return `
    <table class="step-marks">
      <thead><tr><th>Step</th><th>What earns the mark</th><th>Marks</th></tr></thead>
      <tbody>
        ${sorted
          .map(
            (s) =>
              `<tr><td>${s.step_no}</td><td>${escapeHtml(s.description)}</td><td>${s.marks}</td></tr>`,
          )
          .join('')}
      </tbody>
    </table>`
}

function renderTeacherCopyHead(t: {
  details: Array<string>
  gaps: Array<string>
}): string {
  const gaps =
    t.gaps.length === 0
      ? '<div class="tc-ok"><strong>Gaps in this paper:</strong> none. Every row was filled from the question bank.</div>'
      : `<div class="tc-gaps"><h2>Gaps in this paper (${t.gaps.length})</h2><ul>${t.gaps.map((g) => `<li>${escapeHtml(g)}</li>`).join('')}</ul></div>`
  return `<div class="tc-details">${t.details.map((d) => escapeHtml(d)).join('<br>')}</div>${gaps}`
}

function renderKeyItemBody(q: KeyTemplateQuestion): string {
  return `
      <div>${renderExpectedAnswer(q)}</div>
      ${renderStepMarks(q.stepMarks)}
      ${q.diagram_kind ? `<div class="diagram-desc">Expected diagram: ${escapeHtml(q.diagram_kind)}</div>` : ''}
      ${(() => {
        const svg = renderDiagramSvg(q.diagram_kind, q.diagram_params)
        return svg ? `<div class="diagram">${svg}</div>` : ''
      })()}`
}

function renderKeyItem(q: KeyTemplateQuestion): string {
  return `
    <div class="item">
      <div class="item-head">${q.position}. [${q.section}] <span class="marks">(${q.marks} mark${q.marks === 1 ? '' : 's'})</span></div>
      ${renderKeyItemBody(q)}
    </div>`
}

// F030: the key shows both alternatives' expected answers under one shared mark value, exactly
// mirroring how the student paper prints the pair (paper-template.ts's renderChoicePair) -- a
// reviewer needs to recognise which printed block a key entry belongs to.
function renderKeyChoicePair(
  primary: KeyTemplateQuestion,
  alternate: KeyTemplateQuestion,
): string {
  return `
    <div class="item choice-pair">
      <div class="item-head">${primary.position}. [${primary.section}] <span class="marks">(${primary.marks} mark${primary.marks === 1 ? '' : 's'})</span></div>
      ${renderKeyItemBody(primary)}
      <div class="or-divider">OR</div>
      ${renderKeyItemBody(alternate)}
    </div>`
}

function renderKeyItems(questions: Array<KeyTemplateQuestion>): string {
  const html: Array<string> = []
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i]
    const next = questions.at(i + 1)
    if (q.choice_group !== null && next?.choice_group === q.choice_group) {
      html.push(renderKeyChoicePair(q, next))
      i += 1
      continue
    }
    html.push(renderKeyItem(q))
  }
  return html.join('')
}

function renderCoverageTable(coverage: Array<CoverageRow>): string {
  return `
    <table class="coverage">
      <thead>
        <tr><th>Concept</th><th>Questions</th><th>Marks</th><th>% Weight</th><th>Bloom split</th></tr>
      </thead>
      <tbody>
        ${coverage
          .map((row) => {
            const bloomSplit = Object.entries(row.bloom_split)
              .map(([bloom, count]) => `${bloom}: ${count}`)
              .join(', ')
            return `<tr>
              <td>${escapeHtml(row.concept_name)}</td>
              <td>${row.question_count}</td>
              <td>${row.marks}</td>
              <td>${row.weight_pct}%</td>
              <td>${escapeHtml(bloomSplit)}</td>
            </tr>`
          })
          .join('')}
      </tbody>
    </table>`
}

/**
 * F036/F037: answers, step-wise marks, and expected diagram description in one PDF that is
 * generated by an entirely separate route from the student paper (never bundled into that file),
 * plus the concept coverage & Bloom table (F037) appended at the end.
 */
export function buildAnswerKeyHtml(input: KeyTemplateInput): string {
  const sorted = [...input.questions].sort((a, b) => a.position - b.position)

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>${PDF_FONT_FACES}
  * { box-sizing: border-box; }
  body { font-family: ${withTelugu("Georgia, 'Times New Roman', serif")}; font-size: 11pt; color: #111; margin: 0; }
  h1 { font-size: 15pt; margin: 0 0 4px; }
  .warning { font-size: 9pt; color: #a00; margin-bottom: 12px; }
  .tc-banner { position: fixed; top: 0; left: 0; right: 0; text-align: center; font-size: 8pt; font-weight: bold; letter-spacing: 1px; color: #fff; background: #a00; padding: 1.2mm 0; }
  body.tc { padding-top: 7mm; }
  .tc-details { font-size: 10pt; margin: 4px 0 10px; line-height: 1.5; }
  .tc-gaps { border: 2px solid #a00; background: #fff4f4; padding: 6px 10px; margin: 8px 0 14px; font-size: 10pt; }
  .tc-gaps h2 { font-size: 11.5pt; margin: 0 0 4px; color: #a00; }
  .tc-gaps ul { margin: 4px 0 0; padding-left: 18px; }
  .tc-ok { border: 1px solid #2a7; background: #f3fbf7; padding: 5px 10px; margin: 8px 0 14px; font-size: 10pt; }
  .item { page-break-inside: avoid; margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 8px; }
  .item .item-head { font-weight: bold; }
  .item .marks { color: #444; font-weight: normal; }
  .diagram-desc { font-style: italic; color: #444; margin-top: 4px; }
  .diagram { margin-top: 4px; }
  .diagram svg { display: block; max-width: 100%; height: auto; }
  .or-divider { text-align: center; font-weight: bold; font-size: 9pt; color: #555; margin: 8px 0; }
  table.step-marks, table.coverage {
    border-collapse: collapse;
    width: 100%;
    margin-top: 6px;
    font-size: 9.5pt;
  }
  table.step-marks th, table.step-marks td,
  table.coverage th, table.coverage td {
    border: 1px solid #999;
    padding: 3px 6px;
    text-align: left;
  }
  /* F107: headings stay with what follows; table rows never split across pages. */
  h2.coverage-title { margin-top: 24px; font-size: 13pt; break-after: avoid; page-break-after: avoid; }
  tr { break-inside: avoid; page-break-inside: avoid; }
  ${THEME_STYLES[input.theme ?? DEFAULT_THEME]}
</style>
</head>
${input.teacherCopy ? '<body class="tc">' : '<body>'}
  ${input.teacherCopy ? '<div class="tc-banner">TEACHER COPY — NOT FOR STUDENTS</div>' : ''}
  <h1>${escapeHtml(input.title)} — Answer Key &amp; Marking Scheme</h1>
  ${input.teacherCopy ? renderTeacherCopyHead(input.teacherCopy) : '<div class="warning">For teacher/parent use only. Never distribute this file to the student before the paper is attempted.</div>'}
  ${renderKeyItems(sorted)}
  ${
    input.teacherCopy
      ? ''
      : `<h2 class="coverage-title">Concept Coverage &amp; Bloom Table</h2>
  ${renderCoverageTable(input.coverage)}`
  }
</body>
</html>`
}
