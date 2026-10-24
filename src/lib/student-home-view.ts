// Pure view logic for the student Home page: arc geometry, "n of 3", which step comes first, and
// the short sentences. Kept free of React so it can be unit tested without a DOM. Every input is
// treated as possibly missing: the server fills StudentHomeData and an older response may lack a
// field, which must render nothing, never crash.
import type { StudentHomeData } from './student-home-types'

type Mission = StudentHomeData['mission']
type MissionStep = Mission['steps'][number]

export function missionSteps(mission: Mission | null | undefined): Array<MissionStep> {
  return Array.isArray(mission?.steps) ? mission.steps : []
}

/** Done steps counted from the steps themselves, so the ring can never disagree with the rows. */
export function missionProgress(mission: Mission | null | undefined): {
  done: number
  total: number
  pct: number
  label: string
} {
  const steps = missionSteps(mission)
  const total = steps.length
  const done = steps.filter((s) => s.done).length
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)
  return { done, total, pct, label: `${done} of ${total}` }
}

/** Index of the first step still to do (skipping one that is waiting on her first marked paper), or -1 when all are done (or there are none). */
export function firstNotDoneIndex(steps: ReadonlyArray<{ done: boolean; waiting?: boolean }>): number {
  return steps.findIndex((s) => !s.done && !s.waiting)
}

/** A brand-new student: first step is the Quick check, nothing done, no marked paper yet. */
export function isFirstRun(
  mission: Mission | null | undefined,
  marksStory: StudentHomeData['marks_story'] | undefined,
): boolean {
  const steps = missionSteps(mission)
  return steps.length > 0 && steps[0].key === 'check' && steps.every((s) => !s.done) && !marksStory
}

export const FIRST_RUN_COPY = 'A short Quick check so PrepPlan can find your level.'

export function missionHeadline(mission: Mission | null | undefined): string {
  const { done, total } = missionProgress(mission)
  if (total > 0 && done === total) return 'All done for today. Well played.'
  return 'Three small steps, about ten minutes.'
}

/** "Exam in 23 days · 6 chapters not tried yet"; null when there is no exam to show. */
export function examChipText(exam: StudentHomeData['exam'] | null | undefined): string | null {
  if (!exam || typeof exam.days_remaining !== 'number') return null
  const days = exam.days_remaining
  const when =
    days < 0 ? null : days === 0 ? 'Exam today' : days === 1 ? 'Exam tomorrow' : `Exam in ${days} days`
  if (when === null) return null
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- older server builds may omit it
  const n = Math.max(0, exam.untested_chapters ?? 0)
  if (n === 0) return `${when} · every chapter tried`
  return `${when} · ${n} chapter${n === 1 ? '' : 's'} not tried yet`
}

export type MapCause = 'knowledge' | 'habit'

export interface DonutArc {
  cause: MapCause
  /** strokeDasharray value: visible length then the rest of the circle. */
  dasharray: string
  /** strokeDashoffset value; arcs start at 12 o'clock when the svg is rotated -90 degrees. */
  dashoffset: number
  length: number
  share: number
}

export function donutCircumference(radius: number): number {
  return 2 * Math.PI * radius
}

/** Two arcs sharing the ring in proportion to their totals. Empty when both totals are 0. */
export function donutArcs(knowledge: number, habit: number, radius: number): Array<DonutArc> {
  const k = Math.max(0, Number.isFinite(knowledge) ? knowledge : 0)
  const h = Math.max(0, Number.isFinite(habit) ? habit : 0)
  const total = k + h
  if (total === 0) return []
  const c = donutCircumference(radius)
  const kLen = (k / total) * c
  const hLen = (h / total) * c
  const arcs: Array<DonutArc> = []
  if (k > 0) {
    arcs.push({ cause: 'knowledge', dasharray: `${kLen} ${c - kLen}`, dashoffset: 0, length: kLen, share: k / total })
  }
  if (h > 0) {
    arcs.push({ cause: 'habit', dasharray: `${hLen} ${c - hLen}`, dashoffset: -kLen, length: hLen, share: h / total })
  }
  return arcs
}

/** The bigger slice; a tie counts as habit, matching the old "you knew more than this shows" lead. */
export function biggerSlice(knowledge: number, habit: number): MapCause | null {
  if (!(knowledge > 0) && !(habit > 0)) return null
  return habit >= knowledge ? 'habit' : 'knowledge'
}

const marks = (n: number) => `${n} mark${n === 1 ? '' : 's'}`

/** One friendly line from the bigger slice of the Mark Map. */
export function mapLine(knowledge: number, habit: number): string {
  const big = biggerSlice(knowledge, habit)
  if (big === null) return ''
  if (big === 'habit') {
    return `You knew more than this shows: ${marks(habit)} went on how you wrote it, such as stopping early or skipping steps.`
  }
  return `${marks(knowledge)} came from ideas that are not solid yet. The Fix-it Deck goes there first.`
}

/** The sentence under the latest paper's header (the earlier MarksStory logic, unchanged). */
export function paperStoryLine(gap: number, habit: number): string {
  if (gap === 0 && habit === 0) return 'Full marks. You knew it and you delivered it.'
  return habit >= gap
    ? `You knew more than this paper shows: ${marks(habit)} went on how you wrote it, such as stopping early or skipping steps.`
    : `${marks(gap)} came from ideas that are not solid yet. Today’s practice goes there first.`
}

export function fixItButtonLabel(due: number): string {
  if (!(due > 0)) return 'Nothing to fix today'
  return `Fix ${Math.min(3, due)} card${Math.min(3, due) === 1 ? '' : 's'}`
}

export function leaderboardLine(lb: StudentHomeData['leaderboard'] | null | undefined): string | null {
  if (!lb?.opted_in || lb.rank == null) return null
  return lb.class_size ? `You are #${lb.rank} of ${lb.class_size} in your class` : `You are #${lb.rank} in your class`
}

export function paperScoreText(p: { title: string; scored: number; total: number }): string {
  return `${p.title} — ${p.scored}/${p.total}`
}
