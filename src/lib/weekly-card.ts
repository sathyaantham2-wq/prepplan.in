import type { Db } from '../db/connection'
import { buildStudentDashboard } from './student-dashboard'
import { buildAdaptiveOverview } from './adaptive/overview'
import { getMarksWonBack } from './marks-won-back'
import { istWeekStart, pickChapters } from './weekly-card-text'
import type { WeeklyCardData } from './weekly-card-text'

export type { WeeklyCardData } from './weekly-card-text'

/**
 * The numbers on the weekly progress card a student can send her parent. The week runs Monday to
 * Sunday in India time; marks won back (marks-won-back.ts) and papers submitted count from Monday
 * 00:00 India time to `now`. Chapter strength reuses the adaptive overview and the streak reuses
 * the student dashboard, so no mastery maths is duplicated here.
 */
export async function getWeeklyCardData(db: Db, studentId: string, now: Date): Promise<WeeklyCardData> {
  const { start, startKey, endKey } = istWeekStart(now)
  const student = await db
    .selectFrom('students')
    .select(['name', 'class'])
    .where('id', '=', studentId)
    .executeTakeFirstOrThrow()

  const [won, papers, overview, dashboard] = await Promise.all([
    getMarksWonBack(db, studentId, start, now),
    db
      .selectFrom('attempts')
      .select((eb) => eb.fn.countAll<string>().as('n'))
      .where('student_id', '=', studentId)
      .where('submitted_at', '>=', start)
      .where('submitted_at', '<=', now)
      .executeTakeFirst(),
    buildAdaptiveOverview(db, studentId),
    buildStudentDashboard(db, studentId),
  ])

  const chapters = (overview?.subjects ?? []).flatMap((s) =>
    s.chapters.map((c) => ({ name: c.chapter_name, mastery: c.average_mastery })),
  )
  const { strongest, workOn } = pickChapters(chapters)

  return {
    week_start: startKey,
    week_end: endKey,
    student_first_name: student.name.trim().split(/\s+/)[0] || student.name,
    class_label: `Class ${student.class}`,
    papers_submitted: Number(papers?.n ?? 0),
    marks_won_back: won.total,
    strongest_chapters: strongest,
    chapters_to_work_on: workOn,
    streak_days: dashboard.streak_days,
  }
}
