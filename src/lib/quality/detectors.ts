// The question-bank quality loop, part 2: detectors (docs/QUALITY_LOOP_PLAN.md). Each detector looks at one
// question's statistics and open student reports and may raise a signal. A signal only opens a case for a person to
// decide; nothing here changes a question. Thresholds are deliberately cautious: with most questions answered once
// or twice, a noisy queue the owner stops reading is worse than a quiet one that misses a borderline case.

import type { DifficultyTier } from '../../db/enums'
import type { QuestionStatRow } from './stats'

export type SignalKind =
  | 'student_report'
  | 'strong_students_pick_same_wrong_option'
  | 'wrong_option_more_popular_than_key'
  | 'harder_than_tagged'
  | 'easier_than_tagged'
  | 'often_left_blank'

export type Severity = 1 | 2 | 3

export interface Signal {
  // kind, plus the report reason for student reports -- what "the same evidence" is compared on
  key: string
  kind: SignalKind
  severity: Severity
  // how much evidence: reports, answers, or students -- a closed case reopens only when this grows
  n: number
  detail: string
}

export interface ReportCount {
  reason: string
  count: number
}

export interface DetectorInput {
  stat: QuestionStatRow | null
  difficulty: DifficultyTier
  // the key's option label, for option-based types; null for fill-in-the-blank
  correctLabel: string | null
  openReports: ReadonlyArray<ReportCount>
}

export const STRONG_AGREEMENT_MIN_STUDENTS = 3
export const STRONG_AGREEMENT_SHARE = 0.6
export const POPULAR_WRONG_MIN_ANSWERS = 8
export const POPULAR_WRONG_SHARE = 0.4
export const DIFFICULTY_MIN_ANSWERS = 10
export const BLANK_MIN_ANSWERS = 8
export const BLANK_SHARE = 0.5

const REPORT_SEVERITY: Record<string, Severity> = {
  answer_error: 3,
  marked_wrong: 2,
  question_error: 2,
  unclear: 1,
  other: 1,
}

const REPORT_LABEL: Record<string, string> = {
  answer_error: 'the answer key is wrong',
  marked_wrong: 'a right answer was marked wrong',
  question_error: 'the question has a mistake',
  unclear: 'the question is unclear',
  other: 'something else',
}

function share(part: number, whole: number): string {
  return `${Math.round((part / whole) * 100)}%`
}

function topWrongOption(
  counts: Record<string, number>,
  correctLabel: string,
): { label: string; count: number } | null {
  let best: { label: string; count: number } | null = null
  for (const [label, count] of Object.entries(counts)) {
    if (label === correctLabel) continue
    if (!best || count > best.count) best = { label, count }
  }
  return best
}

export function detectSignals(input: DetectorInput): Array<Signal> {
  const signals: Array<Signal> = []

  for (const report of input.openReports) {
    if (report.count <= 0) continue
    signals.push({
      key: `student_report:${report.reason}`,
      kind: 'student_report',
      severity: REPORT_SEVERITY[report.reason] ?? 1,
      n: report.count,
      detail: `${report.count} student report${report.count === 1 ? '' : 's'}: ${REPORT_LABEL[report.reason] ?? report.reason}`,
    })
  }

  const stat = input.stat
  if (!stat) return signals

  if (input.correctLabel) {
    const strongTotal = Object.values(stat.strongOptionCounts).reduce((a, b) => a + b, 0)
    const strongWrong = topWrongOption(stat.strongOptionCounts, input.correctLabel)
    if (
      strongWrong &&
      strongWrong.count >= STRONG_AGREEMENT_MIN_STUDENTS &&
      strongWrong.count / strongTotal >= STRONG_AGREEMENT_SHARE
    ) {
      signals.push({
        key: 'strong_students_pick_same_wrong_option',
      kind: 'strong_students_pick_same_wrong_option',
        severity: 3,
        n: strongWrong.count,
        detail: `${strongWrong.count} of ${strongTotal} strong students chose ${strongWrong.label}, but the key says ${input.correctLabel}`,
      })
    }

    const total = Object.values(stat.optionCounts).reduce((a, b) => a + b, 0)
    const keyCount = stat.optionCounts[input.correctLabel] ?? 0
    const wrong = topWrongOption(stat.optionCounts, input.correctLabel)
    if (
      wrong &&
      total >= POPULAR_WRONG_MIN_ANSWERS &&
      wrong.count > keyCount &&
      wrong.count / total >= POPULAR_WRONG_SHARE
    ) {
      signals.push({
        key: 'wrong_option_more_popular_than_key',
      kind: 'wrong_option_more_popular_than_key',
        severity: 2,
        n: total,
        detail: `${share(wrong.count, total)} chose ${wrong.label}, only ${share(keyCount, total)} chose the key ${input.correctLabel}`,
      })
    }
  }

  if (stat.firstExposures >= DIFFICULTY_MIN_ANSWERS) {
    const rate = stat.shrunkCorrectRate
    if (input.difficulty === 'Easy' && rate < 0.35) {
      signals.push({
        key: 'harder_than_tagged',
      kind: 'harder_than_tagged',
        severity: 1,
        n: stat.firstExposures,
        detail: `Tagged Easy, but about ${Math.round(rate * 100)}% get it right`,
      })
    }
    if (input.difficulty === 'Hardest' && rate > 0.85) {
      signals.push({
        key: 'easier_than_tagged',
      kind: 'easier_than_tagged',
        severity: 1,
        n: stat.firstExposures,
        detail: `Tagged Hardest, but about ${Math.round(rate * 100)}% get it right`,
      })
    }
  }

  if (stat.firstExposures >= BLANK_MIN_ANSWERS && stat.blank / stat.firstExposures >= BLANK_SHARE) {
    signals.push({
      key: 'often_left_blank',
      kind: 'often_left_blank',
      severity: 1,
      n: stat.firstExposures,
      detail: `${share(stat.blank, stat.firstExposures)} of students left it blank`,
    })
  }

  return signals
}

export function caseSeverity(signals: ReadonlyArray<Signal>): Severity {
  return signals.reduce<Severity>((max, s) => (s.severity > max ? s.severity : max), 1)
}

/**
 * Whether a question whose last case was closed should get a new one: only when there is new evidence -- a signal
 * kind not seen before, or more of it than when the case was closed. A dismissed case does not come back on the
 * same evidence.
 */
export function hasNewEvidence(current: ReadonlyArray<Signal>, previous: ReadonlyArray<Signal>): boolean {
  const before = new Map(previous.map((s) => [s.key, s.n]))
  return current.some((s) => {
    const prior = before.get(s.key)
    return prior === undefined || s.n > prior
  })
}
