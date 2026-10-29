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
    sql<{ points: string; coins: string; spent: string }>`select coalesce(sum(points), 0)::text as points, coalesce(sum(coins), 0)::text as coins, (select coalesce(sum(price_coins), 0) from student_unlocks where student_id = ${studentId})::text as spent from student_points_ledger where student_id = ${studentId}`.execute(db),
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
    // Spendable balance: earned minus spent on unlocks (src/lib/rewards.ts). Points are untouched.
    coins: Number(points.rows.at(0)?.coins ?? 0) - Number(points.rows.at(0)?.spent ?? 0),
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

// Queries behind the cards added to the Home in the 2026-10-24 revamp (assembled in
// src/lib/student-home.ts). All are scoped to one student, or are plain counts.

export async function countSubmittedToday(db: Db, studentId: string): Promise<number> {
  const r = await sql<{ n: string }>`
    select count(*)::text as n from attempts
    where student_id = ${studentId} and submitted_at is not null
      and (submitted_at at time zone 'Asia/Kolkata')::date = (now() at time zone 'Asia/Kolkata')::date`.execute(db)
  return Number(r.rows[0]?.n ?? 0)
}

/** This week's Monday 00:00 India time, as an instant. */
export async function mondayStartIndia(db: Db): Promise<Date> {
  const r = await sql<{ d: Date }>`select date_trunc('week', now() at time zone 'Asia/Kolkata') at time zone 'Asia/Kolkata' as d`.execute(db)
  return new Date(r.rows[0].d)
}

export interface LostMarkGroup {
  concept_id: string
  concept_name: string
  subject_name: string
  knowledge_known: boolean | null
  error_type: string | null
  lost: number
}

/**
 * Marks lost on confirmed marking in the last `days` days, grouped by concept and by the two
 * columns that decide the cause. Skips items she removed from her grade. One query.
 */
export async function listLostMarkGroups(db: Db, studentId: string, days: number): Promise<Array<LostMarkGroup>> {
  const r = await sql<Omit<LostMarkGroup, 'lost'> & { lost: string }>`
    select c.id as concept_id, c.name as concept_name, s.name as subject_name,
           ei.knowledge_known, ei.error_type, sum(ei.marks_max - ei.marks_awarded)::text as lost
    from evaluations e
    join attempts a on a.id = e.attempt_id
    join evaluation_items ei on ei.evaluation_id = e.id
    join paper_questions pq on pq.id = ei.paper_question_id
    join questions q on q.id = pq.question_id
    join concepts c on c.id = q.concept_id
    join chapters ch on ch.id = c.chapter_id
    join subjects s on s.id = ch.subject_id
    where a.student_id = ${studentId}
      and e.confirmed_at is not null and e.confirmed_at >= now() - make_interval(days => ${days})
      and ei.excluded_by_student = false
      and ei.marks_max > ei.marks_awarded
    group by c.id, c.name, s.name, ei.knowledge_known, ei.error_type`.execute(db)
  return r.rows.map((x) => ({ ...x, lost: Number(x.lost) }))
}

export async function listRecentConfirmedPapers(
  db: Db,
  studentId: string,
  limit: number,
): Promise<Array<{ attempt_id: string; title: string; scored: number; total: number; confirmed_at: Date }>> {
  const r = await sql<{ attempt_id: string; title: string; scored: string; total: string; confirmed_at: Date }>`
    select a.id as attempt_id, p.title, e.actual_score::text as scored, e.total_marks::text as total, e.confirmed_at
    from evaluations e join attempts a on a.id = e.attempt_id join papers p on p.id = a.paper_id
    where a.student_id = ${studentId} and e.confirmed_at is not null
    order by e.confirmed_at desc limit ${limit}`.execute(db)
  return r.rows.map((x) => ({
    attempt_id: x.attempt_id,
    title: x.title,
    scored: Number(x.scored),
    total: Number(x.total),
    confirmed_at: new Date(x.confirmed_at),
  }))
}

/** How many opted-in students have points in a subject: a count only, no one else's data. */
export async function countOptedInInSubject(db: Db, subjectId: string): Promise<number> {
  const r = await sql<{ n: string }>`
    select count(distinct l.student_id)::text as n
    from student_points_ledger l join students st on st.id = l.student_id
    where l.subject_id = ${subjectId} and st.leaderboard_opt_in = true`.execute(db)
  return Number(r.rows[0]?.n ?? 0)
}
