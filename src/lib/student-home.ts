import { randomUUID } from 'node:crypto'
import type { Db } from '../db/connection'
import {
  getStudentHome,
  listLostMarkGroups,
  listRecentConfirmedPapers,
  countOptedInInSubject,
  countSubmittedToday,
  mondayStartIndia,
} from '../db/repositories/student-home'
import type { StudentHomeData, HomeLostConcept, HomeMissionStep } from './student-home-types'
import { buildAdaptiveOverview } from './adaptive/overview'
import type { AdaptiveOverview } from './adaptive/overview'
import { buildExamCountdownReport } from './exam-countdown'
import { captureError, describeError } from './error-log'
import { causeForItem, getFixitSummary } from './fixit'
import { getLeaderboard } from './leaderboard'
import { getMarksWonBack } from './marks-won-back'

// The student Home screen's whole payload (GET /api/students/me/home). The first block of fields
// comes from getStudentHome (repository); every card added in the 2026-10-24 revamp is built here,
// each behind `safely` so one broken side card shows as empty instead of blanking the Home.
// Everything is scoped to the one student id; other students' rows are only ever counted or, for
// an opted-in student, read through getLeaderboard (anonymous nicknames).

const round1 = (n: number) => Math.round(n * 10) / 10
const DAILY_FIXIT_TARGET = 3

async function safely<T>(piece: string, fallback: T, work: () => Promise<T>): Promise<T> {
  try {
    return await work()
  } catch (error) {
    const { message, stack } = describeError(error)
    await captureError({ requestId: randomUUID(), source: 'server', route: `student-home:${piece}`, method: 'GET', message, stack })
    return fallback
  }
}

type FixitSummary = StudentHomeData['fixit']

function buildMission(
  overview: AdaptiveOverview | null,
  fixit: FixitSummary,
  submittedToday: number,
): StudentHomeData['mission'] {
  const next = overview?.recommended_next ?? null
  // Cards that were due when today began = cards still due + cards she already answered today
  // (an answered card moves out of the due list). Done once she has answered up to 3 of them;
  // with nothing due there is nothing to fix, so the step counts as done.
  const dueAtStart = fixit.due + fixit.answered_today
  // Never had a card: nothing to fix yet is not the same as done, so the step waits for her first marked paper.
  const hasHadCards = fixit.total_cards_ever > 0
  const fixitDone = hasHadCards && fixit.answered_today >= Math.min(DAILY_FIXIT_TARGET, dueAtStart)
  const steps: Array<HomeMissionStep> = [
    {
      key: 'check',
      label: 'Quick check',
      hint: next ? next.concept_name : 'Pick a topic to start',
      done: submittedToday >= 1,
      href: next ? `/my-paper?subject=${next.subject_id}` : '/my-paper',
    },
    {
      key: 'fixit',
      label: 'Fix-it Deck',
      hint: !hasHadCards
        ? 'Appears after your first marked paper'
        : fixit.due > 0
          ? `${fixit.due} ${fixit.due === 1 ? 'card' : 'cards'} waiting`
          : 'Nothing to fix today',
      done: fixitDone,
      ...(hasHadCards ? {} : { waiting: true }),
      href: '/fix-it',
    },
    {
      key: 'paper',
      label: 'One short paper',
      hint: '10 questions on a chapter you choose',
      // The first paper of the day completes the quick check; this step needs a second one.
      done: submittedToday >= 2,
      href: '/my-paper',
    },
  ]
  return { steps, done_count: steps.filter((s) => s.done).length }
}

async function wonBackThisWeek(db: Db, studentId: string): Promise<StudentHomeData['won_back']> {
  const result = await getMarksWonBack(db, studentId, await mondayStartIndia(db))
  const items = [...result.items]
    .sort((a, b) => b.marks_back - a.marks_back)
    .slice(0, 3)
    .map((i) => ({ concept_name: i.concept_name, subject_name: i.subject_name, marks_back: round1(i.marks_back) }))
  return { total: round1(result.total), items }
}

const EMPTY_MARK_MAP: StudentHomeData['mark_map'] = {
  knowledge: { total: 0, concepts: [] },
  habit: { total: 0, concepts: [] },
}

/** Lost marks of the last 30 days of confirmed marking, grouped by concept and cause in one query. */
async function markMap(db: Db, studentId: string): Promise<StudentHomeData['mark_map']> {
  const rows = await listLostMarkGroups(db, studentId, 30)

  const byCause = {
    knowledge: new Map<string, HomeLostConcept>(),
    habit: new Map<string, HomeLostConcept>(),
  }
  for (const row of rows) {
    const cause = causeForItem({ knowledgeKnown: row.knowledge_known, errorType: row.error_type })
    const map = byCause[cause]
    const existing = map.get(row.concept_id)
    const lost = row.lost
    if (existing) existing.marks_lost += lost
    else map.set(row.concept_id, { concept_id: row.concept_id, concept_name: row.concept_name, subject_name: row.subject_name, marks_lost: lost })
  }
  const shape = (map: Map<string, HomeLostConcept>) => {
    const all = [...map.values()]
    return {
      total: round1(all.reduce((sum, c) => sum + c.marks_lost, 0)),
      concepts: all
        .sort((a, b) => b.marks_lost - a.marks_lost || a.concept_name.localeCompare(b.concept_name))
        .slice(0, 5)
        .map((c) => ({ ...c, marks_lost: round1(c.marks_lost) })),
    }
  }
  return { knowledge: shape(byCause.knowledge), habit: shape(byCause.habit) }
}

async function recentPapers(db: Db, studentId: string): Promise<StudentHomeData['recent_papers']> {
  const rows = await listRecentConfirmedPapers(db, studentId, 3)
  return rows.map((x) => ({
    attempt_id: x.attempt_id,
    title: x.title,
    scored: round1(x.scored),
    total: round1(x.total),
    confirmed_at: x.confirmed_at.toISOString(),
  }))
}

const NOT_OPTED_IN: StudentHomeData['leaderboard'] = { opted_in: false, rank: null, class_size: null, top: [] }

/**
 * The standing in one subject's cohort: today's recommended subject, else her first selected one
 * (the leaderboard is per subject). Not opted in: nothing about anyone else is even read.
 */
async function leaderboardCard(db: Db, studentId: string, overview: AdaptiveOverview | null): Promise<StudentHomeData['leaderboard']> {
  const me = await db.selectFrom('students').select('leaderboard_opt_in').where('id', '=', studentId).executeTakeFirst()
  if (!me?.leaderboard_opt_in) return NOT_OPTED_IN
  const subjectId = overview?.recommended_next?.subject_id ?? overview?.subjects[0]?.subject_id ?? null
  if (!subjectId) return { opted_in: true, rank: null, class_size: null, top: [] }
  const [view, size] = await Promise.all([
    getLeaderboard(db, subjectId, studentId),
    countOptedInInSubject(db, subjectId),
  ])
  const myRank = view.me?.rank ?? null
  return {
    opted_in: true,
    rank: myRank,
    class_size: size,
    // The page shows these nicknames to her already (src/routes/leaderboard.tsx); never a real name.
    top: view.entries.slice(0, 3).map((e) => ({ display_name: e.nickname, points: e.points, is_you: myRank !== null && e.rank === myRank })),
  }
}

async function examCard(db: Db, studentId: string): Promise<StudentHomeData['exam']> {
  const report = await buildExamCountdownReport(db, studentId)
  const nearest = report.countdowns.find((c) => c.days_remaining >= 0)
  if (!nearest) return null
  return {
    exam_name: nearest.exam_name,
    exam_date: nearest.exam_date,
    days_remaining: nearest.days_remaining,
    untested_chapters: report.syllabus_coverage.untested_chapters.length,
  }
}

export async function buildStudentHome(db: Db, studentId: string): Promise<StudentHomeData> {
  const [base, overview, fixit, submittedToday, wonBack, map, recent, exam] = await Promise.all([
    getStudentHome(db, studentId),
    safely<AdaptiveOverview | null>('overview', null, () => buildAdaptiveOverview(db, studentId)),
    safely<FixitSummary>('fixit', { due: 0, answered_today: 0, mastered_total: 0, total_cards_ever: 0 }, () => getFixitSummary(db, studentId)),
    safely('submitted-today', 0, () => countSubmittedToday(db, studentId)),
    safely<StudentHomeData['won_back']>('won-back', { total: 0, items: [] }, () => wonBackThisWeek(db, studentId)),
    safely('mark-map', EMPTY_MARK_MAP, () => markMap(db, studentId)),
    safely<StudentHomeData['recent_papers']>('recent-papers', [], () => recentPapers(db, studentId)),
    safely<StudentHomeData['exam']>('exam', null, () => examCard(db, studentId)),
  ])
  const leaderboard = await safely('leaderboard', NOT_OPTED_IN, () => leaderboardCard(db, studentId, overview))
  return {
    ...base,
    mission: buildMission(overview, fixit, submittedToday),
    won_back: wonBack,
    fixit,
    mark_map: map,
    recent_papers: recent,
    leaderboard,
    exam,
  }
}
