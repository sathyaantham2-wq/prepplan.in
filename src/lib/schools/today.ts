import type { Db } from '../../db/connection'
import type { SchoolScope } from '../../db/school-scope'
import { SchoolError } from './common'

/**
 * What the Home screen's "Today" panel and its small figures need (UI redesign plan, section 5). Read-only counts from
 * existing tables, with the same reach as the screens they lead to: the office and the principal see the whole school,
 * a teacher only their own section-subject pairs. Students and parents have no Today panel.
 */
export type TodayKind = 'to_check' | 'no_sheets' | 'window_closing' | 'not_sent'

export interface TodayItem {
  kind: TodayKind
  count: number
  /** the paper it is about (none for messages) */
  paperId: string | null
  paperTitle: string | null
  /** for window_closing: when the window closes */
  closesAt: string | null
}

export interface RecentPaper {
  id: string
  kind: 'correction' | 'made'
  title: string
  grade: number
  createdAt: string
  /** where it stands, in one short state */
  state: 'to_check' | 'uploading' | 'results_out' | 'ready'
  toCheck: number
}

/** The first of April of the school year this date falls in (Indian school year). */
export function schoolYearStart(now: Date): Date {
  const y = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1
  return new Date(y, 3, 1)
}

const DAY = 86_400_000

export async function schoolToday(db: Db, scope: SchoolScope, now = new Date()) {
  if (scope.role !== 'school_admin' && scope.role !== 'principal' && scope.role !== 'teacher')
    throw new SchoolError('forbidden', 'Only school staff have a Today list.')
  const pairs = scope.pairs
  /** may this person see a student's work in this paper? (section of the student, subject of the paper) */
  const mine = (sectionId: string, subjectId: string) =>
    pairs === 'all' || pairs.some((p) => p.sectionId === sectionId && p.subjectId === subjectId)

  const papers = await db
    .selectFrom('school_own_papers as p')
    .innerJoin('school_subjects as ss', 'ss.id', 'p.school_subject_id')
    .innerJoin('school_classes as c', 'c.id', 'p.class_id')
    .select(['p.id', 'p.title', 'p.class_id', 'p.created_at', 'ss.subject_id', 'c.grade'])
    .where('p.school_id', '=', scope.schoolId)
    .where('p.archived_at', 'is', null)
    .where('p.status', '=', 'approved')
    .orderBy('p.created_at', 'desc')
    .execute()
  const students = await db
    .selectFrom('school_students as s')
    .innerJoin('school_sections as sec', 'sec.id', 's.section_id')
    .select(['s.id', 's.section_id', 'sec.class_id'])
    .where('s.school_id', '=', scope.schoolId)
    .where('s.status', '=', 'active')
    .execute()
  const flagged = await db
    .selectFrom('school_answer_marks')
    .select(['paper_id', 'school_student_id'])
    .where('school_id', '=', scope.schoolId)
    .where('state', '=', 'flagged')
    .execute()
  const pages = await db
    .selectFrom('school_own_sheets')
    .select(['paper_id', 'school_student_id'])
    .where('school_id', '=', scope.schoolId)
    .where('status', '=', 'placed')
    .where('kind', '=', 'page')
    .execute()
  const releases = await db
    .selectFrom('school_paper_releases')
    .select(['paper_id', 'section_id', 'window_closes_at', 'locked_at'])
    .where('school_id', '=', scope.schoolId)
    .execute()

  const items: Array<TodayItem> = []
  const recent: Array<RecentPaper> = []
  for (const p of papers) {
    const visible = students.filter((s) => s.class_id === p.class_id && mine(s.section_id, p.subject_id))
    if (visible.length === 0) continue
    const ids = new Set(visible.map((s) => s.id))
    const toCheck = flagged.filter((f) => f.paper_id === p.id && ids.has(f.school_student_id)).length
    const withSheets = new Set(pages.filter((x) => x.paper_id === p.id && x.school_student_id !== null && ids.has(x.school_student_id)).map((x) => x.school_student_id))
    const mySections = new Set(visible.map((s) => s.section_id))
    const myReleases = releases.filter((r) => r.paper_id === p.id && mySections.has(r.section_id))
    if (toCheck > 0) items.push({ kind: 'to_check', count: toCheck, paperId: p.id, paperTitle: p.title, closesAt: null })
    // only once the exam has started coming in: some sheets uploaded, some students still missing (not yet released)
    const missing = visible.filter((s) => !withSheets.has(s.id) && !myReleases.some((r) => r.section_id === s.section_id)).length
    if (withSheets.size > 0 && missing > 0)
      items.push({ kind: 'no_sheets', count: missing, paperId: p.id, paperTitle: p.title, closesAt: null })
    const closing = myReleases
      .filter((r) => r.locked_at === null && new Date(r.window_closes_at).getTime() > now.getTime() && new Date(r.window_closes_at).getTime() - now.getTime() <= 3 * DAY)
      .sort((a, b) => new Date(a.window_closes_at).getTime() - new Date(b.window_closes_at).getTime())
    if (closing.length > 0)
      items.push({ kind: 'window_closing', count: closing.length, paperId: p.id, paperTitle: p.title, closesAt: new Date(closing[0].window_closes_at).toISOString() })
    recent.push({
      id: p.id,
      kind: 'correction',
      title: p.title,
      grade: p.grade,
      createdAt: new Date(p.created_at).toISOString(),
      state: toCheck > 0 ? 'to_check' : myReleases.length > 0 ? 'results_out' : withSheets.size > 0 ? 'uploading' : 'ready',
      toCheck,
    })
  }

  // parent messages that did not go (the office and the principal look after messages)
  if (scope.role !== 'teacher') {
    const ns = await db
      .selectFrom('school_messages')
      .select((eb) => eb.fn.countAll<number>().as('n'))
      .where('school_id', '=', scope.schoolId)
      .where('status', 'in', ['not_sent', 'failed'])
      .where('created_at', '>=', new Date(now.getTime() - 7 * DAY))
      .executeTakeFirstOrThrow()
    if (Number(ns.n) > 0) items.push({ kind: 'not_sent', count: Number(ns.n), paperId: null, paperTitle: null, closesAt: null })
  }

  // papers made in PrepPlan (exam papers), for the count and the recent list
  const made = await db
    .selectFrom('school_exams as e')
    .innerJoin('school_classes as c', 'c.id', 'e.class_id')
    .select(['e.id', 'e.title', 'e.created_at', 'c.grade', 'e.subject_id', 'e.class_id'])
    .where('e.school_id', '=', scope.schoolId)
    .where('e.archived_at', 'is', null)
    .where('e.stage', '=', 'final')
    .orderBy('e.created_at', 'desc')
    .execute()
  const madeVisible = made.filter(
    (e) => pairs === 'all' || students.some((s) => s.class_id === e.class_id && mine(s.section_id, e.subject_id)),
  )
  for (const e of madeVisible)
    recent.push({ id: e.id, kind: 'made', title: e.title, grade: e.grade, createdAt: new Date(e.created_at).toISOString(), state: 'ready', toCheck: 0 })

  const yearStart = schoolYearStart(now).getTime()
  const order: Record<TodayKind, number> = { to_check: 0, window_closing: 1, no_sheets: 2, not_sent: 3 }
  return {
    items: items.sort((a, b) => order[a.kind] - order[b.kind]).slice(0, 8),
    examsThisYear:
      recent.filter((r) => r.kind === 'correction' && new Date(r.createdAt).getTime() >= yearStart).length +
      madeVisible.filter((e) => new Date(e.created_at).getTime() >= yearStart).length,
    recent: recent.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5),
    toCheckTotal: items.filter((i) => i.kind === 'to_check').reduce((n, i) => n + i.count, 0),
  }
}
