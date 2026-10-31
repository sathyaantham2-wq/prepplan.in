import { LEVELS, topicLevel } from './topic-level'
import type { Level } from './topic-level'
import { HABIT_CODES } from './marking-logic'
import type { HabitCode } from './marking-logic'

// Progress Report arithmetic (owner direction 2026-10-31, SCHOOLS_MODULE_PLAN.md section 15). Pure: it is
// given plain rows (locked marks only, read by progress.ts) and returns what the screens show. No database,
// no clock, no AI.

export interface ExamInfo {
  paperId: string
  title: string
  subject: string
  /** When the results were released (sortable ISO string). */
  at: string
}

export interface AnswerRow {
  paperId: string
  questionId: string
  questionNo: string
  orGroup: string | null
  found: boolean
  finalMarks: number
  maxMarks: number
  lossKind: string
  habit: string | null
  lossReason: string | null
  topicKey: string
  topicLabel: string
}

// ---------------------------------------------------------------- grade

/** CBSE nine-point grade of a percentage. */
export function gradeOf(pct: number): string {
  if (pct >= 91) return 'A1'
  if (pct >= 81) return 'A2'
  if (pct >= 71) return 'B1'
  if (pct >= 61) return 'B2'
  if (pct >= 51) return 'C1'
  if (pct >= 41) return 'C2'
  if (pct >= 33) return 'D'
  return 'E'
}

// ---------------------------------------------------------------- which answers count

/**
 * A pupil answers only one of two alternatives (an OR pair), so only the better-marked (or the answered)
 * member of each group counts; the one she did not attempt is not "marks lost".
 */
export function countedAnswers(rows: ReadonlyArray<AnswerRow>): Array<AnswerRow> {
  const out: Array<AnswerRow> = []
  const groups = new Map<string, Array<AnswerRow>>()
  for (const r of rows) {
    if (!r.orGroup) out.push(r)
    else groups.set(`${r.paperId}|${r.orGroup}`, [...(groups.get(`${r.paperId}|${r.orGroup}`) ?? []), r])
  }
  for (const members of groups.values()) {
    const best = [...members].sort(
      (a, b) => Number(b.found) - Number(a.found) || b.finalMarks - a.finalMarks,
    )[0]
    out.push(best)
  }
  return out
}

const sum = (xs: ReadonlyArray<number>) => xs.reduce((a, b) => a + b, 0)

// ---------------------------------------------------------------- one exam

export interface ExamSummary extends ExamInfo {
  earned: number
  max: number
  pct: number
  grade: string
  /** Marks lost because she did not know it. */
  lostKnowledge: number
  /** Marks lost to how it was written. */
  lostHabit: number
  /** Marks lost where the AI could not tell why. */
  lostUnclear: number
}

export function examSummaries(
  exams: ReadonlyArray<ExamInfo>,
  answers: ReadonlyArray<AnswerRow>,
): Array<ExamSummary> {
  const counted = countedAnswers(answers)
  return [...exams]
    .sort((a, b) => (a.at < b.at ? -1 : a.at > b.at ? 1 : 0))
    .map((e) => {
      const mine = counted.filter((a) => a.paperId === e.paperId)
      const earned = sum(mine.map((a) => a.finalMarks))
      const max = sum(mine.map((a) => a.maxMarks))
      const lost = (kind: string) =>
        sum(mine.filter((a) => a.lossKind === kind).map((a) => a.maxMarks - a.finalMarks))
      const pct = max === 0 ? 0 : Math.round((earned / max) * 100)
      return {
        ...e,
        earned,
        max,
        pct,
        grade: gradeOf(pct),
        lostKnowledge: lost('knowledge_gap'),
        lostHabit: lost('writing_habit'),
        lostUnclear: lost('unclear'),
      }
    })
}

// ---------------------------------------------------------------- topics

export interface TopicRow {
  key: string
  label: string
  subject: string
  level: Level | null
  dip: boolean
  evidence: number
  scores: Array<number>
  /** The latest score, as a percentage. */
  latestPct: number | null
}

export function topicRows(
  exams: ReadonlyArray<ExamInfo>,
  answers: ReadonlyArray<AnswerRow>,
): Array<TopicRow> {
  const counted = countedAnswers(answers)
  const byTopic = new Map<string, { label: string; subject: string; rows: Array<AnswerRow> }>()
  for (const a of counted) {
    const subject = exams.find((e) => e.paperId === a.paperId)?.subject ?? ''
    const key = `${subject}|${a.topicKey}`
    const t = byTopic.get(key) ?? { label: a.topicLabel, subject, rows: [] }
    t.rows.push(a)
    byTopic.set(key, t)
  }
  return [...byTopic.entries()]
    .map(([key, t]) => {
      const perExam = exams
        .map((e) => {
          const rows = t.rows.filter((r) => r.paperId === e.paperId)
          return {
            at: e.at,
            earned: sum(rows.map((r) => r.finalMarks)),
            available: sum(rows.map((r) => r.maxMarks)),
          }
        })
        .filter((x) => x.available > 0)
      const l = topicLevel(perExam)
      return {
        key,
        label: t.label,
        subject: t.subject,
        level: l.level,
        dip: l.dip,
        evidence: l.evidence,
        scores: l.scores,
        latestPct: l.scores.length ? Math.round(l.scores[l.scores.length - 1] * 100) : null,
      }
    })
    .sort((a, b) => a.subject.localeCompare(b.subject) || a.label.localeCompare(b.label))
}

// ---------------------------------------------------------------- habits

export const HABIT_LABEL: Record<HabitCode, string> = {
  skipped_steps: 'Steps skipped',
  units_missing: 'Units or final line missing',
  stopped_early: 'Stopped writing too early',
  misread_question: 'Misread the question',
  other: 'Other writing slips',
}

export const HABIT_TIP: Record<HabitCode, string> = {
  skipped_steps: 'Show each step, even the easy ones.',
  units_missing: 'End with the answer and its unit.',
  stopped_early: 'Write the full answer, then read it once more.',
  misread_question: 'Underline what the question asks before you start.',
  other: 'Read your answer once more before you move on.',
}

export interface HabitSeries {
  habit: HabitCode
  total: number
  perExam: Array<{ paperId: string; title: string; lost: number }>
}

export function habitSeries(
  exams: ReadonlyArray<ExamInfo>,
  answers: ReadonlyArray<AnswerRow>,
): Array<HabitSeries> {
  const counted = countedAnswers(answers).filter((a) => a.lossKind === 'writing_habit')
  const ordered = [...exams].sort((a, b) => (a.at < b.at ? -1 : a.at > b.at ? 1 : 0))
  return HABIT_CODES.map((habit) => {
    const perExam = ordered.map((e) => ({
      paperId: e.paperId,
      title: e.title,
      lost: sum(
        counted
          .filter((a) => a.paperId === e.paperId && (a.habit ?? 'other') === habit)
          .map((a) => a.maxMarks - a.finalMarks),
      ),
    }))
    return { habit, total: sum(perExam.map((p) => p.lost)), perExam }
  })
}

// ---------------------------------------------------------------- subjects, best, focus

export interface SubjectTile {
  subject: string
  latestPct: number | null
  previousPct: number | null
  /** up, flat (within 2 points) or down against the exam before; null with one exam. */
  trend: 'up' | 'flat' | 'down' | null
  proficient: number
  assessed: number
}

export function subjectTiles(
  summaries: ReadonlyArray<ExamSummary>,
  topics: ReadonlyArray<TopicRow>,
): Array<SubjectTile> {
  const subjects = [...new Set(summaries.map((s) => s.subject))].sort()
  return subjects.map((subject) => {
    const mine = summaries.filter((s) => s.subject === subject)
    const latest = mine[mine.length - 1]
    const prev = mine.length > 1 ? mine[mine.length - 2] : null
    const tops = topics.filter((t) => t.subject === subject && t.level !== null)
    const diff = prev ? latest.pct - prev.pct : 0
    return {
      subject,
      latestPct: latest.pct,
      previousPct: prev?.pct ?? null,
      trend: prev ? (diff > 2 ? 'up' : diff < -2 ? 'down' : 'flat') : null,
      proficient: tops.filter((t) => t.level === 'proficient').length,
      assessed: tops.length,
    }
  })
}

/**
 * One point per exam round: exams released on the same day (the subjects of one test week) are one point on the
 * growth line, scored by all their marks together. Used for the growth line and the personal best.
 */
export function roundsOf(summaries: ReadonlyArray<ExamSummary>): Array<ExamSummary> {
  const days = new Map<string, Array<ExamSummary>>()
  for (const s of summaries) days.set(s.at.slice(0, 10), [...(days.get(s.at.slice(0, 10)) ?? []), s])
  return [...days.entries()]
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .map(([, group]) => {
      const earned = sum(group.map((g) => g.earned))
      const max = sum(group.map((g) => g.max))
      const pct = max === 0 ? 0 : Math.round((earned / max) * 100)
      return {
        paperId: group[0].paperId,
        title: group.map((g) => g.title).join(', '),
        subject: group.length > 1 ? 'All subjects' : group[0].subject,
        at: group[0].at,
        earned,
        max,
        pct,
        grade: gradeOf(pct),
        lostKnowledge: sum(group.map((g) => g.lostKnowledge)),
        lostHabit: sum(group.map((g) => g.lostHabit)),
        lostUnclear: sum(group.map((g) => g.lostUnclear)),
      }
    })
}

export function personalBest(summaries: ReadonlyArray<ExamSummary>) {
  if (summaries.length === 0)
    return { bestPct: null, bestTitle: null, latestIsBest: false }
  const best = [...summaries].sort((a, b) => b.pct - a.pct || (a.at < b.at ? 1 : -1))[0]
  const latest = summaries[summaries.length - 1]
  return {
    bestPct: best.pct,
    bestTitle: best.title,
    // a new best means better than every earlier exam (a first exam is not "a new best")
    latestIsBest:
      summaries.length > 1 && summaries.slice(0, -1).every((s) => latest.pct > s.pct),
  }
}

export interface FocusItem {
  kind: 'topic' | 'habit' | 'near'
  title: string
  /** Marks lost (topic, habit) or the latest score in percent (near): the screens turn these into sentences. */
  n: number
  /** Set for a topic: where "Practise this" starts. */
  topicKey?: string
  subject?: string
  habit?: HabitCode
}

/**
 * This week's focus: three items by rule.
 *  1. the topic that lost the most marks to "didn't know" in the latest exam of each subject (largest first);
 *  2. the habit that cost the most marks over the last two exams;
 *  3. the Progressing topic closest to Proficient (its latest score nearest 75 %, not already above).
 * Fewer than three when the data does not give three.
 */
export function weeklyFocus(
  exams: ReadonlyArray<ExamInfo>,
  answers: ReadonlyArray<AnswerRow>,
  topics: ReadonlyArray<TopicRow>,
): Array<FocusItem> {
  const out: Array<FocusItem> = []
  const counted = countedAnswers(answers)
  const ordered = [...exams].sort((a, b) => (a.at < b.at ? -1 : a.at > b.at ? 1 : 0))
  const latest = ordered.at(-1)
  if (latest) {
    const lostByTopic = new Map<string, { label: string; subject: string; lost: number }>()
    for (const a of counted.filter((x) => x.paperId === latest.paperId && x.lossKind === 'knowledge_gap')) {
      const t = lostByTopic.get(a.topicKey) ?? { label: a.topicLabel, subject: latest.subject, lost: 0 }
      t.lost += a.maxMarks - a.finalMarks
      lostByTopic.set(a.topicKey, t)
    }
    const top = [...lostByTopic.entries()].sort((a, b) => b[1].lost - a[1].lost).at(0)
    if (top)
      out.push({
        kind: 'topic',
        title: top[1].label,
        n: top[1].lost,
        topicKey: top[0],
        subject: top[1].subject,
      })
  }
  const recent = ordered.slice(-2).map((e) => e.paperId)
  const h = habitSeries(
    exams.filter((e) => recent.includes(e.paperId)),
    answers,
  )
    .filter((x) => x.total > 0)
    .sort((a, b) => b.total - a.total)
    .at(0)
  if (h)
    out.push({
      kind: 'habit',
      title: HABIT_LABEL[h.habit],
      n: h.total,
      habit: h.habit,
    })
  const near = topics
    .filter((t) => t.level === 'progressing' && t.latestPct !== null && t.latestPct < 75)
    .sort((a, b) => (b.latestPct ?? 0) - (a.latestPct ?? 0))
    .find((t) => !out.some((o) => o.topicKey === t.key.split('|')[1]))
  if (near)
    out.push({
      kind: 'near',
      title: near.label,
      n: near.latestPct ?? 0,
      topicKey: near.key.split('|')[1],
      subject: near.subject,
    })
  return out
}

export const LEVEL_ORDER = LEVELS
