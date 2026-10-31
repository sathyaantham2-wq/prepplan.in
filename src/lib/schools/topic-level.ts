// The level of a topic: Beginner, Progressing or Proficient (the CBSE Holistic Progress Card words), from a
// student's locked marks over the year. Pure: no database, no clock. The rule is written in
// SCHOOLS_MODULE_PLAN.md section 15.2 and is the owner-approved one (2026-10-31).
//
// One exam gives one score for a topic (marks earned / marks available on that topic). The exams are
// walked in date order, keeping a current level:
//   - first evidence: low (< 50 %) is Beginner, middle (50 to 74 %) and high (>= 75 %) are Progressing;
//     one exam never makes anyone Proficient;
//   - up one step when the TWO LATEST scores are both at or above that step's bar (50 % to Progressing,
//     75 % to Proficient);
//   - down one step only when the TWO LATEST scores are both below the current level's bar (below 50 % from
//     Progressing, below 75 % from Proficient). One weak test changes nothing except a "dip" mark;
//   - otherwise the level stays.
// An exam is evidence for a topic only when the topic carried at least 2 marks in it.

export type Level = 'beginner' | 'progressing' | 'proficient'

export const LEVELS: ReadonlyArray<Level> = ['beginner', 'progressing', 'proficient']
export const MIN_TOPIC_MARKS = 2
export const BAR_PROGRESSING = 0.5
export const BAR_PROFICIENT = 0.75

export interface TopicExamScore {
  /** Sortable moment of the exam (the release date). */
  at: string
  earned: number
  available: number
}

export interface TopicLevel {
  /** null when no exam is evidence for this topic. */
  level: Level | null
  /** The latest exam scored below the level's bar although the level did not change. */
  dip: boolean
  /** How many exams are behind it. */
  evidence: number
  /** The score of each exam used, oldest first, as a fraction. */
  scores: Array<number>
}

const barOf = (l: Level) =>
  l === 'proficient' ? BAR_PROFICIENT : l === 'progressing' ? BAR_PROGRESSING : 0

export function topicLevel(exams: ReadonlyArray<TopicExamScore>): TopicLevel {
  const used = exams
    .filter((e) => e.available >= MIN_TOPIC_MARKS)
    .sort((a, b) => (a.at < b.at ? -1 : a.at > b.at ? 1 : 0))
    .map((e) => e.earned / e.available)
  if (used.length === 0) return { level: null, dip: false, evidence: 0, scores: [] }
  let level: Level =
    used[0] < BAR_PROGRESSING ? 'beginner' : 'progressing'
  for (let i = 1; i < used.length; i++) {
    const a = used[i - 1]
    const b = used[i]
    const idx = LEVELS.indexOf(level)
    if (idx < 2 && Math.min(a, b) >= barOf(LEVELS[idx + 1])) level = LEVELS[idx + 1]
    else if (idx > 0 && Math.max(a, b) < barOf(level)) level = LEVELS[idx - 1]
  }
  const last = used[used.length - 1]
  return {
    level,
    dip: last < barOf(level),
    evidence: used.length,
    scores: used,
  }
}

export const LEVEL_WORD: Record<Level, string> = {
  beginner: 'Beginner',
  progressing: 'Progressing',
  proficient: 'Proficient',
}
