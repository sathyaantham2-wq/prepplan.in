import { countedAnswers, weeklyFocus } from '../progress-calc'
import type { AnswerRow, ExamInfo, FocusItem, TopicRow } from '../progress-calc'

// What a parent is told about a child, chosen here and nowhere else. The shape is deliberately small: a score,
// one thing that went well, up to two things to practise. Levels, dips, falls, ranks and comparisons are not in
// it, so worrying news cannot reach a parent by accident (owner rule 2026-11-01: that goes to the class teacher
// only). Pure: no database.

export interface ExamHighlights {
  /** The topic she did best in, or null when none was good enough to call a strength. */
  strength: string | null
  /** The topics that cost the most marks, worst first, at most two. */
  practise: Array<string>
}

/** A topic needs at least this share of its marks to be called "what went well". */
export const STRENGTH_MIN_PCT = 50

export function examHighlights(paperId: string, answers: ReadonlyArray<AnswerRow>): ExamHighlights {
  const mine = countedAnswers(answers.filter((a) => a.paperId === paperId))
  const byTopic = new Map<string, { label: string; earned: number; max: number }>()
  for (const a of mine) {
    const t = byTopic.get(a.topicKey) ?? { label: a.topicLabel, earned: 0, max: 0 }
    t.earned += a.finalMarks
    t.max += a.maxMarks
    byTopic.set(a.topicKey, t)
  }
  const topics = [...byTopic.values()].filter((t) => t.max > 0)
  const pct = (t: { earned: number; max: number }) => t.earned / t.max
  const best = [...topics].sort((a, b) => pct(b) - pct(a) || b.max - a.max || a.label.localeCompare(b.label)).at(0)
  const strength = best && pct(best) * 100 >= STRENGTH_MIN_PCT ? best.label : null
  const practise = topics
    .filter((t) => t.max - t.earned > 0 && t.label !== strength)
    .sort((a, b) => b.max - b.earned - (a.max - a.earned) || a.label.localeCompare(b.label))
    .slice(0, 2)
    .map((t) => t.label)
  return { strength, practise }
}

/** A focus item as the parent sees it: a topic name, or a habit code the screen turns into words. */
export interface ParentFocusItem {
  kind: 'topic' | 'habit'
  title: string
  habit: string | null
}

/** This week's focus for a parent: at most three, with "nearly there" folded into topics, no levels shown. */
export function parentFocus(
  exams: ReadonlyArray<ExamInfo>,
  answers: ReadonlyArray<AnswerRow>,
  topics: ReadonlyArray<TopicRow>,
): Array<ParentFocusItem> {
  return weeklyFocus(exams, answers, topics)
    .slice(0, 3)
    .map((f: FocusItem) => ({
      kind: f.kind === 'habit' ? ('habit' as const) : ('topic' as const),
      title: f.title,
      habit: f.kind === 'habit' ? (f.habit ?? null) : null,
    }))
}

/** The first word of a name: a parent message and a link page never carry a full name. */
export function firstName(full: string): string {
  return full.trim().split(/\s+/)[0] ?? ''
}

/** A fall is a drop of at least this many percentage points between two tests. */
export const MIN_DROP_PCT = 2

/**
 * "Fell two tests in a row": the subject's last three scores (oldest first) each lower than the one before by at
 * least MIN_DROP_PCT. This is worrying news: it goes to the class teacher only, never to a parent.
 */
export function fellTwice(pcts: ReadonlyArray<number>): boolean {
  if (pcts.length < 3) return false
  const [a, b, c] = pcts.slice(-3)
  return a - b >= MIN_DROP_PCT && b - c >= MIN_DROP_PCT
}

/** Marks as short text: 32, 32.5 (never 32.0). */
export const marksText = (n: number): string => String(Math.round(n * 10) / 10)

/** Words that stand in when a message has fewer than two things to practise or no strength (a variable is never empty). */
export const FILL = {
  strength: { en: 'Effort across the whole paper', te: 'పరీక్ష అంతా ప్రయత్నించడం' },
  practise_1: { en: 'Regular practice', te: 'క్రమం తప్పని సాధన' },
  practise_2: { en: 'Revising class notes', te: 'తరగతి నోట్స్ చదవడం' },
  focus: { en: 'Keep up regular practice', te: 'క్రమం తప్పకుండా సాధన కొనసాగించండి' },
} as const
