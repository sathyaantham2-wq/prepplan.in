// Pure, browser-safe helpers for the weekly progress card (no database imports here, because the
// card component imports this file).

export interface WeeklyCardData {
  week_start: string
  week_end: string
  student_first_name: string
  class_label: string
  papers_submitted: number
  marks_won_back: number
  strongest_chapters: Array<string>
  chapters_to_work_on: Array<string>
  streak_days: number
}

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000
const DAY_MS = 24 * 60 * 60 * 1000

/** Monday 00:00 India time of the week containing `now`, as an instant and a YYYY-MM-DD key. */
export function istWeekStart(now: Date): { start: Date; startKey: string; endKey: string } {
  const ist = new Date(now.getTime() + IST_OFFSET_MS)
  const dow = ist.getUTCDay() // 0 = Sunday
  const sinceMonday = (dow + 6) % 7
  const mondayIst = Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), ist.getUTCDate() - sinceMonday)
  return {
    start: new Date(mondayIst - IST_OFFSET_MS),
    startKey: new Date(mondayIst).toISOString().slice(0, 10),
    endKey: new Date(mondayIst + 6 * DAY_MS).toISOString().slice(0, 10),
  }
}

export function isIstSunday(now: Date): boolean {
  return new Date(now.getTime() + IST_OFFSET_MS).getUTCDay() === 0
}

/** Up to two strongest and up to two to work on, from chapters that have been assessed. A chapter
 * is never in both lists, and one already at or above 80% is not offered as "to work on". */
export function pickChapters(
  chapters: Array<{ name: string; mastery: number | null }>,
): { strongest: Array<string>; workOn: Array<string> } {
  const assessed = chapters.filter((c): c is { name: string; mastery: number } => c.mastery !== null)
  const strongestRows = [...assessed].sort((a, b) => b.mastery - a.mastery).slice(0, 2)
  const taken = new Set(strongestRows.map((c) => c.name))
  const workOn = [...assessed]
    .filter((c) => !taken.has(c.name) && c.mastery < 80)
    .sort((a, b) => a.mastery - b.mastery)
    .slice(0, 2)
    .map((c) => c.name)
  return { strongest: strongestRows.map((c) => c.name), workOn }
}

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`
const trim1 = (n: number) => String(Math.round(n * 10) / 10)

/** The one-line message sent with the card picture. */
export function weeklyCardShareText(d: WeeklyCardData): string {
  const parts = [
    `${d.student_first_name}'s PrepPlan week: ${plural(d.papers_submitted, 'paper', 'papers')}, ${trim1(d.marks_won_back)} ${d.marks_won_back === 1 ? 'mark' : 'marks'} won back.`,
  ]
  if (d.strongest_chapters.length > 0) parts.push(`Strong: ${d.strongest_chapters.join(', ')}.`)
  if (d.chapters_to_work_on.length > 0) parts.push(`Working on: ${d.chapters_to_work_on.join(', ')}.`)
  return parts.join(' ')
}
