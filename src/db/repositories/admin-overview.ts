import { sql } from 'kysely'
import type { Db } from '../connection'

/**
 * Numbers behind /admin (the admin console overview, 2026-10-16). Read-only aggregates over tables the
 * product already keeps (users, students, papers, attempts, student_activity_daily, ai_jobs, error_log,
 * question_reports, questions/concepts). Every series is the last 30 days, oldest first, one entry per
 * calendar day (UTC), zero-filled so a chart never skips a day.
 */
export interface AdminOverview {
  generated_at: string
  days: Array<string>
  people: {
    students_total: number
    parents_total: number
    signups_7d: number
    signups_prev_7d: number
    signups_series: Array<number>
    active_today: number
    active_7d: number
    active_30d: number
    active_series: Array<number>
    never_started: number
  }
  usage: {
    papers_7d: number
    papers_prev_7d: number
    papers_series: Array<number>
    submitted_7d: number
    submitted_prev_7d: number
    submitted_series: Array<number>
    awaiting_confirmation: number
    average_score_30d: number | null
  }
  ai: {
    cost_today_inr: number
    cost_month_inr: number
    cost_series: Array<number>
    calls_7d: number
    failed_7d: number
    top_features: Array<{ feature: string; cost_inr: number; calls: number }>
  }
  health: {
    errors_24h: number
    errors_7d: number
    errors_series: Array<number>
    top_error_routes: Array<{ route: string; count: number }>
    open_reports: number
    recent_errors: Array<{ at: string; route: string | null; message: string }>
  }
  content: {
    approved_total: number
    by_board: Array<{ board: string; approved: number }>
    concepts_total: number
    concepts_short: number
    shortfalls: Array<{ subject: string; board: string; class: number; short: number; concepts: number }>
  }
  recent_signups: Array<{ at: string; name: string; email: string; role: string }>
}

const DAYS = 30

function dayList(): Array<string> {
  const out: Array<string> = []
  const now = new Date()
  for (let i = DAYS - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - i))
    out.push(d.toISOString().slice(0, 10))
  }
  return out
}

function fill(days: Array<string>, rows: Array<{ day: string | Date; n: string | number }>): Array<number> {
  const map = new Map(rows.map((r) => [typeof r.day === 'string' ? r.day.slice(0, 10) : r.day.toISOString().slice(0, 10), Number(r.n)]))
  return days.map((d) => map.get(d) ?? 0)
}

const num = (v: unknown): number => Number(v ?? 0)

export async function getAdminOverview(db: Db): Promise<AdminOverview> {
  const days = dayList()
  const since = `${days[0]}T00:00:00Z`

  const q = async <T,>(query: ReturnType<typeof sql<T>>): Promise<Array<T>> => (await query.execute(db)).rows

  const [
    roleTotals,
    signupRows,
    signupWindows,
    activeRows,
    activeWindows,
    neverStarted,
    paperRows,
    paperWindows,
    submitRows,
    submitWindows,
    awaiting,
    avgScore,
    aiToday,
    aiSeries,
    aiCalls,
    aiFeatures,
    errSeries,
    errWindows,
    errRoutes,
    openReports,
    recentErrors,
    boards,
    conceptCounts,
    shortfalls,
    recentSignups,
  ] = await Promise.all([
    q(sql<{ role: string; n: string }>`select role, count(*)::text n from users group by role`),
    q(sql<{ day: string; n: string }>`select to_char(created_at at time zone 'utc','YYYY-MM-DD') as day, count(*)::text n from users where role in ('student','parent') and created_at >= ${since}::timestamptz group by 1`),
    q(sql<{ cur: string; prev: string }>`select count(*) filter (where created_at >= now() - interval '7 days')::text cur, count(*) filter (where created_at >= now() - interval '14 days' and created_at < now() - interval '7 days')::text prev from users where role in ('student','parent')`),
    q(sql<{ day: string; n: string }>`select to_char(day,'YYYY-MM-DD') as day, count(distinct student_id)::text n from student_activity_daily where day >= ${since}::date group by 1`),
    q(sql<{ today: string; d7: string; d30: string }>`select count(distinct student_id) filter (where day = (now() at time zone 'utc')::date)::text today, count(distinct student_id) filter (where day >= (now() at time zone 'utc')::date - 6)::text d7, count(distinct student_id)::text d30 from student_activity_daily where day >= (now() at time zone 'utc')::date - 29`),
    q(sql<{ n: string }>`select count(*)::text n from students s where not exists (select 1 from attempts a where a.student_id = s.id)`),
    q(sql<{ day: string; n: string }>`select to_char(generated_at at time zone 'utc','YYYY-MM-DD') as day, count(*)::text n from papers where generated_at >= ${since}::timestamptz group by 1`),
    q(sql<{ cur: string; prev: string }>`select count(*) filter (where generated_at >= now() - interval '7 days')::text cur, count(*) filter (where generated_at >= now() - interval '14 days' and generated_at < now() - interval '7 days')::text prev from papers`),
    q(sql<{ day: string; n: string }>`select to_char(submitted_at at time zone 'utc','YYYY-MM-DD') as day, count(*)::text n from attempts where submitted_at >= ${since}::timestamptz group by 1`),
    q(sql<{ cur: string; prev: string }>`select count(*) filter (where submitted_at >= now() - interval '7 days')::text cur, count(*) filter (where submitted_at >= now() - interval '14 days' and submitted_at < now() - interval '7 days')::text prev from attempts where submitted_at is not null`),
    q(sql<{ n: string }>`select count(*)::text n from evaluations where confirmed_at is null`),
    q(sql<{ avg: string | null }>`select avg(percentage)::text as avg from evaluations where confirmed_at is not null and created_at >= now() - interval '30 days'`),
    q(sql<{ n: string | null }>`select coalesce(sum(cost_inr),0)::text n from ai_jobs where created_at >= date_trunc('day', now() at time zone 'utc')`),
    q(sql<{ day: string; n: string; m: string }>`select to_char(created_at at time zone 'utc','YYYY-MM-DD') as day, coalesce(sum(cost_inr),0)::text n, count(*)::text m from ai_jobs where created_at >= ${since}::timestamptz group by 1`),
    q(sql<{ calls: string; failed: string; month: string }>`select count(*)::text calls, count(*) filter (where status <> 'success')::text failed, coalesce((select sum(cost_inr) from ai_jobs where created_at >= date_trunc('month', now() at time zone 'utc')),0)::text as month from ai_jobs where created_at >= now() - interval '7 days'`),
    q(sql<{ feature: string; cost: string; calls: string }>`select feature, coalesce(sum(cost_inr),0)::text cost, count(*)::text calls from ai_jobs where created_at >= now() - interval '30 days' group by feature order by sum(cost_inr) desc nulls last limit 5`),
    q(sql<{ day: string; n: string }>`select to_char(created_at at time zone 'utc','YYYY-MM-DD') as day, count(*)::text n from error_log where created_at >= ${since}::timestamptz group by 1`),
    q(sql<{ h24: string; d7: string }>`select count(*) filter (where created_at >= now() - interval '24 hours')::text h24, count(*) filter (where created_at >= now() - interval '7 days')::text d7 from error_log`),
    q(sql<{ route: string | null; n: string }>`select route, count(*)::text n from error_log where created_at >= now() - interval '7 days' group by route order by count(*) desc limit 5`),
    q(sql<{ n: string }>`select count(*)::text n from question_reports where status = 'open'`),
    q(sql<{ at: string; route: string | null; message: string }>`select created_at::text as at, route, left(message, 160) message from error_log order by created_at desc limit 6`),
    q(sql<{ board: string; n: string }>`select board, count(*)::text n from questions where status = 'approved' group by board order by count(*) desc`),
    q(sql<{ total: string }>`select count(*)::text total from concepts`),
    q(sql<{ subject: string; board: string; class: number; short: string; concepts: string }>`
      with c as (
        select c.id, c.target_question_count target, s.name subject, s.board, s.class,
               (select count(*) from questions q where q.concept_id = c.id and q.status = 'approved') have
        from concepts c join chapters ch on ch.id = c.chapter_id join subjects s on s.id = ch.subject_id)
      select subject, board, class, sum(greatest(target - have, 0))::text short, count(*) filter (where have < target)::text concepts
      from c group by subject, board, class having count(*) filter (where have < target) > 0
      order by sum(greatest(target - have, 0)) desc`),
    q(sql<{ at: string; name: string; email: string; role: string }>`select created_at::text as at, name, email, role from users where role in ('student','parent') order by created_at desc limit 6`),
  ])

  const role = (r: string) => num(roleTotals.find((x) => x.role === r)?.n)
  const conceptsShort = shortfalls.reduce((s, r) => s + num(r.concepts), 0)

  return {
    generated_at: new Date().toISOString(),
    days,
    people: {
      students_total: role('student'),
      parents_total: role('parent'),
      signups_7d: num(signupWindows[0]?.cur),
      signups_prev_7d: num(signupWindows[0]?.prev),
      signups_series: fill(days, signupRows),
      active_today: num(activeWindows[0]?.today),
      active_7d: num(activeWindows[0]?.d7),
      active_30d: num(activeWindows[0]?.d30),
      active_series: fill(days, activeRows),
      never_started: num(neverStarted[0]?.n),
    },
    usage: {
      papers_7d: num(paperWindows[0]?.cur),
      papers_prev_7d: num(paperWindows[0]?.prev),
      papers_series: fill(days, paperRows),
      submitted_7d: num(submitWindows[0]?.cur),
      submitted_prev_7d: num(submitWindows[0]?.prev),
      submitted_series: fill(days, submitRows),
      awaiting_confirmation: num(awaiting[0]?.n),
      average_score_30d: avgScore[0]?.avg == null ? null : Math.round(Number(avgScore[0].avg)),
    },
    ai: {
      cost_today_inr: num(aiToday[0]?.n),
      cost_month_inr: num(aiCalls[0]?.month),
      cost_series: fill(days, aiSeries),
      calls_7d: num(aiCalls[0]?.calls),
      failed_7d: num(aiCalls[0]?.failed),
      top_features: aiFeatures.map((f) => ({ feature: f.feature, cost_inr: num(f.cost), calls: num(f.calls) })),
    },
    health: {
      errors_24h: num(errWindows[0]?.h24),
      errors_7d: num(errWindows[0]?.d7),
      errors_series: fill(days, errSeries),
      top_error_routes: errRoutes.map((r) => ({ route: r.route ?? '(unknown)', count: num(r.n) })),
      open_reports: num(openReports[0]?.n),
      recent_errors: recentErrors.map((e) => ({ at: e.at, route: e.route, message: e.message })),
    },
    content: {
      approved_total: boards.reduce((s, b) => s + num(b.n), 0),
      by_board: boards.map((b) => ({ board: b.board, approved: num(b.n) })),
      concepts_total: num(conceptCounts[0]?.total),
      concepts_short: conceptsShort,
      shortfalls: shortfalls.slice(0, 6).map((r) => ({ subject: r.subject, board: r.board, class: r.class, short: num(r.short), concepts: num(r.concepts) })),
    },
    recent_signups: recentSignups.map((u) => ({ at: u.at, name: u.name, email: u.email, role: u.role })),
  }
}
