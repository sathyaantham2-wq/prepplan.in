import { sql } from 'kysely'
import type { Db } from '../connection'

/**
 * Small, student-scoped numbers for the student home screen (2026-10-17 revamp): which of the last
 * seven days she practised, her points, what she has left half-done, and where the marks of her
 * latest marked paper went. The marks split reuses what marking already records on an evaluation:
 * `knowledge_score` is what she would have scored had she delivered everything she knew, so the gap
 * to the total is knowledge she lacked, and `delivery_gap` is knowledge she had but did not deliver.
 */
export interface StudentHome {
  week: Array<{ day: string; active: boolean }>
  points: number
  coins: number
  papers_this_week: number
  in_progress: { attempt_id: string; title: string; answered: number; total: number } | null
  marks_story: {
    attempt_id: string
    title: string
    total: number
    scored: number
    lost_knowledge: number
    lost_habit: number
  } | null
}

const round1 = (n: number) => Math.round(n * 10) / 10

export async function getStudentHome(db: Db, studentId: string): Promise<StudentHome> {
  const [activity, points, week, progress, story] = await Promise.all([
    sql<{ day: string }>`select to_char(day, 'YYYY-MM-DD') as day from student_activity_daily where student_id = ${studentId} and day >= (now() at time zone 'utc')::date - 6`.execute(db),
    sql<{ points: string; coins: string }>`select coalesce(sum(points), 0)::text as points, coalesce(sum(coins), 0)::text as coins from student_points_ledger where student_id = ${studentId}`.execute(db),
    sql<{ n: string }>`select count(*)::text as n from attempts where student_id = ${studentId} and submitted_at >= now() - interval '7 days'`.execute(db),
    sql<{ attempt_id: string; title: string; answered: string; total: string }>`
      select a.id as attempt_id, p.title,
             (select count(*) from attempt_answers aa where aa.attempt_id = a.id and (aa.selected_option is not null or btrim(coalesce(aa.response_text, '')) <> ''))::text as answered,
             (select count(*) from paper_questions pq where pq.paper_id = p.id)::text as total
      from attempts a join papers p on p.id = a.paper_id
      where a.student_id = ${studentId} and a.status = 'in_progress'
      order by a.started_at desc limit 1`.execute(db),
    sql<{ attempt_id: string; title: string; total: string; scored: string; knowledge: string; gap: string }>`
      select a.id as attempt_id, p.title, e.total_marks::text as total, e.actual_score::text as scored,
             e.knowledge_score::text as knowledge, e.delivery_gap::text as gap
      from evaluations e join attempts a on a.id = e.attempt_id join papers p on p.id = a.paper_id
      where a.student_id = ${studentId} and e.confirmed_at is not null
      order by e.confirmed_at desc limit 1`.execute(db),
  ])

  const activeDays = new Set(activity.rows.map((r) => r.day))
  const days: Array<{ day: string; active: boolean }> = []
  const now = new Date()
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - i)).toISOString().slice(0, 10)
    days.push({ day: d, active: activeDays.has(d) })
  }

  const prog = progress.rows.at(0)
  const s = story.rows.at(0)
  const total = s ? Number(s.total) : 0
  return {
    week: days,
    points: Number(points.rows.at(0)?.points ?? 0),
    coins: Number(points.rows.at(0)?.coins ?? 0),
    papers_this_week: Number(week.rows.at(0)?.n ?? 0),
    in_progress: prog
      ? { attempt_id: prog.attempt_id, title: prog.title, answered: Number(prog.answered), total: Number(prog.total) }
      : null,
    marks_story:
      s && total > 0
        ? {
            attempt_id: s.attempt_id,
            title: s.title,
            total: round1(total),
            scored: round1(Number(s.scored)),
            lost_habit: round1(Math.max(0, Number(s.gap))),
            lost_knowledge: round1(Math.max(0, total - Number(s.knowledge))),
          }
        : null,
  }
}
