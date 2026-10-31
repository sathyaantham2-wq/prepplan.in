import { z } from 'zod'

// AI marking of a school's answer sheets (M4, stage 1). This file is the pure part: no database, no AI,
// no images. It decides, from what three marking passes said about one answer, what mark stands and
// whether a teacher must look. The rules (owner direction 2026-10-30, CLAUDE.md "School module rules"):
//   - every written answer is marked three times; if the passes disagree, it is flagged;
//   - an answer the AI is unsure about, or could not read, is flagged;
//   - multiple choice is marked from the key in code (the AI only reads which letter was chosen);
//   - every lost mark is classed as knowledge gap (did not know it) or writing habit (knew it, wrote it
//     badly or too short).
// Marks are in half-mark steps and never above the question's marks.

export const PASSES = 3
/** Below this a reading is "unsure" and the answer goes to a teacher. */
export const MIN_CONFIDENCE = 0.5

export type LossKind = 'none' | 'knowledge_gap' | 'writing_habit' | 'unclear'

/** The writing habits a lost mark can be put down to (Progress Report, owner direction 2026-10-31). */
export const HABIT_CODES = [
  'skipped_steps',
  'units_missing',
  'stopped_early',
  'misread_question',
  'other',
] as const
export type HabitCode = (typeof HABIT_CODES)[number]

export interface StepMark {
  no: number
  description: string
  awarded: number
  max: number
}

export const PassAnswerSchema = z.object({
  question: z.string().max(12),
  found: z.boolean(),
  answer_text: z.string().max(3000).nullable().default(null),
  choice: z.string().max(4).nullable().default(null),
  marks: z.number().min(0).max(100).default(0),
  steps: z
    .array(z.object({ step: z.number().int().min(1), awarded: z.number().min(0) }))
    .max(20)
    .default([]),
  loss_kind: z.enum(['none', 'knowledge_gap', 'writing_habit']).default('none'),
  habit: z.enum(HABIT_CODES).nullable().default(null),
  loss_reason: z.string().max(400).nullable().default(null),
  confidence: z.number().min(0).max(1).default(0.5),
})
export type PassAnswer = z.infer<typeof PassAnswerSchema>

export const PassSchema = z.object({ answers: z.array(PassAnswerSchema).max(120) })

export interface MarkQuestion {
  id: string
  /** The number printed on the paper ("1", "7"); the AI finds the answer by it. */
  no: string
  text: string
  marks: number
  type: string
  options: Array<{ label: string; text: string }>
  keyText: string
  keySteps: Array<{ description: string; marks: number }>
  orGroup: string | null
}

export interface CombinedAnswer {
  questionId: string
  found: boolean
  answerText: string | null
  runs: Array<{
    marks: number
    found: boolean
    choice: string | null
    confidence: number
    lossKind: LossKind
  }>
  aiMarks: number
  finalMarks: number
  maxMarks: number
  flagged: boolean
  flagReason: string | null
  lossKind: LossKind
  lossReason: string | null
  /** Which writing habit cost the marks (only when the reason is a writing habit). */
  habit: HabitCode | null
  /** Marks per step of the approved scheme, from the pass that gave the middle mark. */
  steps: Array<StepMark>
}

const half = (n: number) => Math.round(n * 2) / 2
const clamp = (n: number, max: number) => Math.min(max, Math.max(0, half(n)))

/** "Correct option: (B) 12" -> "B". Null when the key names no option. */
export function mcqKeyLabel(q: Pick<MarkQuestion, 'keyText'>): string | null {
  const m = /\(([A-Da-d])\)/.exec(q.keyText) ?? /^\s*([A-Da-d])\b/.exec(q.keyText)
  return m ? m[1].toUpperCase() : null
}

export function isChoiceQuestion(q: Pick<MarkQuestion, 'type' | 'options'>) {
  return q.type === 'mcq' && q.options.length >= 2
}

const median = (xs: Array<number>) => {
  const s = [...xs].sort((a, b) => a - b)
  return s[Math.floor(s.length / 2)]
}

function majority<T>(xs: Array<T>): T | null {
  const count = new Map<T, number>()
  for (const x of xs) count.set(x, (count.get(x) ?? 0) + 1)
  let best: T | null = null
  let n = 0
  for (const [k, v] of count)
    if (v > n) {
      best = k
      n = v
    }
  return n * 2 > xs.length ? best : null
}

/** The habit most readings named; 'other' when none was named or they all differ. */
function habitOf(seen: ReadonlyArray<PassAnswer>): HabitCode {
  const named = seen
    .filter((p) => p.loss_kind === 'writing_habit' && p.habit !== null)
    .map((p) => p.habit as HabitCode)
  return majority(named) ?? 'other'
}

/** Marks per step of the approved scheme, from the first reading whose total is the middle mark. */
function stepsOf(
  q: MarkQuestion,
  seen: ReadonlyArray<PassAnswer>,
  mid: number,
): Array<StepMark> {
  const run = seen.find((p) => clamp(p.marks, q.marks) === mid)
  if (!run || run.steps.length === 0 || q.keySteps.length === 0) return []
  return q.keySteps.map((k, i) => {
    const got = run.steps.find((x) => x.step === i + 1)
    return {
      no: i + 1,
      description: k.description,
      awarded: Math.min(k.marks, Math.max(0, half(got?.awarded ?? 0))),
      max: k.marks,
    }
  })
}

/**
 * What stands for one answer, from what each pass said about it (`passes[i]` is pass i's reading of this
 * question, or undefined when that pass did not mention it).
 */
export function combinePasses(
  q: MarkQuestion,
  passes: ReadonlyArray<PassAnswer | undefined>,
): CombinedAnswer {
  const max = q.marks
  const seen = passes.filter((p): p is PassAnswer => p !== undefined)
  const base = {
    questionId: q.id,
    maxMarks: max,
  }
  const flag = (reason: string, marks: number, rest: Partial<CombinedAnswer>): CombinedAnswer => ({
    ...base,
    found: rest.found ?? false,
    answerText: rest.answerText ?? null,
    runs: [],
    aiMarks: marks,
    finalMarks: marks,
    flagged: true,
    flagReason: reason,
    lossKind: 'unclear',
    lossReason: null,
    habit: null,
    steps: [],
    ...rest,
  })

  if (seen.length < PASSES)
    return flag(
      `Only ${seen.length} of ${PASSES} readings of this answer could be used, so a teacher should look.`,
      0,
      {},
    )

  const runs = seen.map((p) => ({
    marks: 0,
    found: p.found,
    choice: p.choice?.trim().toUpperCase() ?? null,
    confidence: p.confidence,
    lossKind: p.loss_kind,
  }))
  const answerText = seen.find((p) => p.found && p.answer_text)?.answer_text ?? null
  const foundVotes = seen.filter((p) => p.found).length

  // not on any page, in any of the three readings: not attempted (or not handed in)
  if (foundVotes === 0)
    return {
      ...base,
      found: false,
      answerText: null,
      runs,
      aiMarks: 0,
      finalMarks: 0,
      flagged: false,
      flagReason: null,
      lossKind: 'knowledge_gap',
      lossReason: 'No answer to this question was found on the pages handed in.',
      habit: null,
      steps: [],
    }
  if (foundVotes < PASSES)
    return flag(
      'The readings disagree on whether this question was answered at all.',
      0,
      { found: false, answerText, runs },
    )

  const unsure = seen.some((p) => p.confidence < MIN_CONFIDENCE)

  // ---- multiple choice: the key decides, in code
  if (isChoiceQuestion(q)) {
    const key = mcqKeyLabel(q)
    const choices = runs.map((r) => r.choice)
    const agreed = choices.every((c) => c !== null && c === choices[0])
    if (!key)
      return flag('The answer key does not name a correct option.', 0, {
        found: true,
        answerText,
        runs,
      })
    if (!agreed || unsure)
      return flag(
        agreed
          ? 'The chosen option was hard to read.'
          : `The readings disagree on which option was chosen (${choices.map((c) => c ?? '?').join(', ')}).`,
        0,
        { found: true, answerText, runs },
      )
    const right = choices[0] === key
    return {
      ...base,
      found: true,
      answerText: `Option ${choices[0]}`,
      runs: runs.map((r) => ({ ...r, marks: right ? max : 0 })),
      aiMarks: right ? max : 0,
      finalMarks: right ? max : 0,
      flagged: false,
      flagReason: null,
      lossKind: right ? 'none' : 'knowledge_gap',
      lossReason: right ? null : `Chose ${choices[0]}; the key is ${key}.`,
      habit: null,
      steps: [],
    }
  }

  // ---- written: three marks, compared
  const marks = seen.map((p) => clamp(p.marks, max))
  runs.forEach((r, i) => (r.marks = marks[i]))
  const mid = median(marks)
  const same = marks.every((m) => m === marks[0])
  const lost = max - mid
  const kinds = seen.map((p) => p.loss_kind)
  const kind: LossKind =
    lost <= 0 ? 'none' : (majority(kinds.filter((k) => k !== 'none')) ?? 'unclear')
  const reason =
    seen.find((p) => p.loss_kind === (kind === 'unclear' ? p.loss_kind : kind) && p.loss_reason)
      ?.loss_reason ?? null

  let flagReason: string | null = null
  if (!same)
    flagReason = `The three readings gave ${[...marks].sort((a, b) => a - b).join(', ')} out of ${max}.`
  else if (unsure)
    flagReason = 'The handwriting was hard to read, so the AI is not sure of this mark.'
  return {
    ...base,
    found: true,
    answerText,
    runs,
    aiMarks: mid,
    finalMarks: mid,
    flagged: flagReason !== null,
    flagReason,
    lossKind: kind,
    lossReason: lost > 0 ? reason : null,
    habit: kind === 'writing_habit' ? habitOf(seen) : null,
    steps: stepsOf(q, seen, mid),
  }
}

/**
 * Total and maximum for a student. Questions that are alternatives of each other (an OR group) count
 * once, as the best-marked one, because a pupil answers only one of them.
 */
export function totalsOf(
  questions: ReadonlyArray<Pick<MarkQuestion, 'id' | 'marks' | 'orGroup'>>,
  finalById: ReadonlyMap<string, number>,
): { total: number; max: number } {
  let total = 0
  let max = 0
  const groups = new Map<string, Array<(typeof questions)[number]>>()
  for (const q of questions) {
    if (q.orGroup) groups.set(q.orGroup, [...(groups.get(q.orGroup) ?? []), q])
    else {
      total += finalById.get(q.id) ?? 0
      max += q.marks
    }
  }
  for (const members of groups.values()) {
    total += Math.max(...members.map((m) => finalById.get(m.id) ?? 0))
    max += members[0].marks
  }
  return { total, max }
}

/** Parses one pass's reply. Returns null when it is not the agreed shape (the pass then counts as unusable). */
export function parsePass(text: string): z.infer<typeof PassSchema> | null {
  try {
    const parsed = PassSchema.safeParse(JSON.parse(text))
    return parsed.success ? parsed.data : null
  } catch {
    return null
  }
}
