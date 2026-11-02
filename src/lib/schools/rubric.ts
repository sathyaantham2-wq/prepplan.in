/**
 * A rubric answer key for a descriptive question: criteria whose marks add up to the question's marks. The marking AI
 * awards each criterion; our code sums and clamps, exactly as for working steps (a rubric is read as steps whose
 * description carries the criterion and its levels).
 */
export const CRITERION_KINDS = ['concept', 'key_points', 'explanation', 'conclusion', 'diagram', 'language'] as const
export type CriterionKind = (typeof CRITERION_KINDS)[number]

export interface Criterion {
  kind: CriterionKind
  marks: number
  descriptor: string
  levels: Array<{ marks: number; says: string }>
}

const MAX_CRITERIA = 8
const half = (n: number) => Math.abs(n * 2 - Math.round(n * 2)) < 1e-9

/** Checks submitted criteria against the question's marks; returns the cleaned list or the reason it is refused. */
export function parseCriteria(
  raw: unknown,
  questionMarks: number,
): { ok: true; criteria: Array<Criterion> } | { ok: false; reason: string } {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > MAX_CRITERIA)
    return { ok: false, reason: `A rubric has 1 to ${MAX_CRITERIA} criteria.` }
  const out: Array<Criterion> = []
  for (const c of raw as Array<Record<string, unknown>>) {
    const kind = CRITERION_KINDS.find((k) => k === c.kind)
    const marks = c.marks
    const descriptor = typeof c.descriptor === 'string' ? c.descriptor.trim() : ''
    if (!kind) return { ok: false, reason: 'Each criterion needs a kind from the list.' }
    if (typeof marks !== 'number' || !Number.isFinite(marks) || marks <= 0 || !half(marks))
      return { ok: false, reason: 'Each criterion is worth a positive number of marks, in half-mark steps.' }
    if (descriptor === '' || descriptor.length > 400)
      return { ok: false, reason: 'Describe each criterion (up to 400 letters).' }
    const levels: Array<{ marks: number; says: string }> = []
    for (const l of Array.isArray(c.levels) ? (c.levels as Array<Record<string, unknown>>) : []) {
      const lm = l.marks
      const says = typeof l.says === 'string' ? l.says.trim() : ''
      if (typeof lm !== 'number' || !Number.isFinite(lm) || lm < 0 || lm > marks || !half(lm) || says === '' || says.length > 300)
        return { ok: false, reason: 'A level needs marks between 0 and its criterion’s marks, and a short description.' }
      levels.push({ marks: lm, says })
    }
    out.push({ kind, marks, descriptor, levels })
  }
  const sum = out.reduce((n, c) => n + c.marks, 0)
  if (Math.abs(sum - questionMarks) > 0.01)
    return { ok: false, reason: `The criteria add up to ${sum} marks but the question is worth ${questionMarks}.` }
  return { ok: true, criteria: out }
}

/** The rubric as the working-steps list the marker already understands (one step per criterion). */
export function criteriaAsSteps(criteria: ReadonlyArray<Criterion>): Array<{ description: string; marks: number }> {
  return criteria.map((c) => ({
    description:
      `${c.kind.replace('_', ' ')}: ${c.descriptor}` +
      (c.levels.length ? ` (${c.levels.map((l) => `${l.marks} if ${l.says}`).join('; ')})` : ''),
    marks: c.marks,
  }))
}

/** Said to the marking AI for a rubric question. */
export const RUBRIC_RULE =
  'Mark this question criterion by criterion; award each criterion only what the pupil’s words earn at the levels given. Do not give marks for spelling or grammar unless a "language" criterion is listed.'

const DESCRIPTIVE_SUBJECT = /social|history|geograph|civic|econom|english|telugu|hindi|sanskrit|urdu|kannada|tamil|literature|language/i

/** Does a drafted key for this question get a rubric (SST, English and the languages, written answers of 3 or more marks)? */
export function wantsRubric(subjectName: string, type: string, marks: number): boolean {
  return DESCRIPTIVE_SUBJECT.test(subjectName) && ['short_answer', 'long_answer', 'case_study'].includes(type) && marks >= 3
}

/**
 * What is kept of one drafted key: a rubric only when one was asked for, was drafted and adds up to the question's marks;
 * otherwise the drafted steps if they add up, otherwise none (a teacher then writes them).
 */
export function keptDraft(
  subjectName: string,
  q: { type: string; marks: number },
  drafted: { steps: Array<{ description: string; marks: number }>; criteria?: Array<unknown> },
): { kind: 'steps' | 'rubric'; steps: Array<{ description: string; marks: number }>; criteria: Array<Criterion> } {
  if (drafted.criteria && wantsRubric(subjectName, q.type, q.marks)) {
    const r = parseCriteria(drafted.criteria, q.marks)
    if (r.ok) return { kind: 'rubric', steps: [], criteria: r.criteria }
  }
  const sum = drafted.steps.reduce((n, s) => n + s.marks, 0)
  return { kind: 'steps', steps: Math.abs(sum - q.marks) < 0.01 ? drafted.steps : [], criteria: [] }
}
