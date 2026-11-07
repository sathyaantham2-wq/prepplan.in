// The question-bank quality loop, part 1: per-question statistics (docs/QUALITY_LOOP_PLAN.md). Pure functions only;
// quality-loop.ts loads the rows and writes the result. Three rules keep the numbers honest on a small amount of data:
//
// 1. First exposure only. A student who meets a question again may simply remember it (allowed by design), which
//    would make it look easier than it is.
// 2. Objective answers only. They are scored against the key with no AI involved. Written answers are AI-marked,
//    and judging a question by AI marks would feed the AI's own mistakes back into the bank.
// 3. Shrinkage. Most questions have been answered once or twice, so a question's raw correct rate is pulled toward
//    the average of its (subject, difficulty) cell. Two wrong answers can't make an Easy question look "hard".

export interface AnswerObservation {
  questionId: string
  studentId: string
  answeredAt: Date
  correct: boolean
  blank: boolean
  // the option label picked, for option-based types; null for fill-in-the-blank or a blank answer
  option: string | null
  timeSec: number | null
  // the cell the shrinkage pulls toward
  cellKey: string
}

export interface QuestionStatRow {
  questionId: string
  firstExposures: number
  firstCorrect: number
  blank: number
  optionCounts: Record<string, number>
  strongOptionCounts: Record<string, number>
  medianTimeSec: number | null
  shrunkCorrectRate: number
  cellCorrectRate: number
}

// How many answers' worth of weight the cell average gets. With 2 answers the cell dominates; with 40 the question's
// own record does.
export const SHRINKAGE_WEIGHT = 8
// A "strong" student: enough first-exposure answers to judge, and most of them right. Used only to spot a wrong key
// (strong students agreeing on the same "wrong" option), never to rank or label a student.
export const STRONG_MIN_ANSWERS = 10
export const STRONG_MIN_ACCURACY = 0.75

/** Keeps each student's first answer to each question; later answers to the same question are dropped. */
export function firstExposures(rows: ReadonlyArray<AnswerObservation>): Array<AnswerObservation> {
  const sorted = [...rows].sort((a, b) => a.answeredAt.getTime() - b.answeredAt.getTime())
  const seen = new Set<string>()
  const kept: Array<AnswerObservation> = []
  for (const row of sorted) {
    const key = `${row.studentId}|${row.questionId}`
    if (seen.has(key)) continue
    seen.add(key)
    kept.push(row)
  }
  return kept
}

/** Students whose first-exposure record is long enough and accurate enough to count as strong. */
export function strongStudents(rows: ReadonlyArray<AnswerObservation>): Set<string> {
  const tally = new Map<string, { n: number; correct: number }>()
  for (const row of rows) {
    const t = tally.get(row.studentId) ?? { n: 0, correct: 0 }
    t.n += 1
    if (row.correct) t.correct += 1
    tally.set(row.studentId, t)
  }
  const strong = new Set<string>()
  for (const [studentId, t] of tally) {
    if (t.n >= STRONG_MIN_ANSWERS && t.correct / t.n >= STRONG_MIN_ACCURACY) strong.add(studentId)
  }
  return strong
}

function median(values: Array<number>): number | null {
  if (values.length === 0) return null
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 1 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2)
}

export function computeQuestionStats(rows: ReadonlyArray<AnswerObservation>): Array<QuestionStatRow> {
  const first = firstExposures(rows)
  const strong = strongStudents(first)

  const cells = new Map<string, { n: number; correct: number }>()
  for (const row of first) {
    const c = cells.get(row.cellKey) ?? { n: 0, correct: 0 }
    c.n += 1
    if (row.correct) c.correct += 1
    cells.set(row.cellKey, c)
  }
  const overall = first.length === 0 ? 0.5 : first.filter((r) => r.correct).length / first.length

  const byQuestion = new Map<string, Array<AnswerObservation>>()
  for (const row of first) {
    const list = byQuestion.get(row.questionId) ?? []
    list.push(row)
    byQuestion.set(row.questionId, list)
  }

  const out: Array<QuestionStatRow> = []
  for (const [questionId, list] of byQuestion) {
    const cell = cells.get(list[0].cellKey)
    const cellRate = cell && cell.n > 0 ? cell.correct / cell.n : overall
    const correct = list.filter((r) => r.correct).length
    const optionCounts: Record<string, number> = {}
    const strongOptionCounts: Record<string, number> = {}
    for (const row of list) {
      if (!row.option) continue
      optionCounts[row.option] = (optionCounts[row.option] ?? 0) + 1
      if (strong.has(row.studentId)) {
        strongOptionCounts[row.option] = (strongOptionCounts[row.option] ?? 0) + 1
      }
    }
    out.push({
      questionId,
      firstExposures: list.length,
      firstCorrect: correct,
      blank: list.filter((r) => r.blank).length,
      optionCounts,
      strongOptionCounts,
      medianTimeSec: median(list.flatMap((r) => (r.timeSec != null && r.timeSec > 0 ? [r.timeSec] : []))),
      shrunkCorrectRate: (correct + SHRINKAGE_WEIGHT * cellRate) / (list.length + SHRINKAGE_WEIGHT),
      cellCorrectRate: cellRate,
    })
  }
  return out
}
