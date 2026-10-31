import type { Db } from '../../db/connection'
import type { SchoolScope } from '../../db/school-scope'
import { SchoolError } from './common'
import { markingQuestions } from './marking'
import { decryptScan, verifyScanPageSignature } from '../scan-crypto'
import { getScanStore } from '../scan-storage'
import { signedUrl } from './own-sheets'
import { myResult } from './results-release'
import {
  countedAnswers,
  examSummaries,
  gradeOf,
  habitSeries,
  HABIT_LABEL,
  HABIT_TIP,
  personalBest,
  roundsOf,
  subjectTiles,
  topicRows,
  weeklyFocus,
} from './progress-calc'
import type { AnswerRow, ExamInfo } from './progress-calc'

// Progress Report data (owner direction 2026-10-31, SCHOOLS_MODULE_PLAN.md section 15). EVERYTHING here is
// read from LOCKED marks only: a paper whose window is still open, or with a flag still with a teacher, is
// invisible to levels, trends and reports. Nothing here e-mails, notifies, scores or sends an analytics event.

export interface Who {
  studentId: string
  sectionId: string
}

export interface Locked {
  exams: Array<ExamInfo & { subjectId: string; releasedAt: Date; lockedAt: Date | null; windowClosesAt: Date }>
  answers: Array<AnswerRow>
}

/**
 * The locked results of several students at once (one set of queries for the whole class). A student with
 * no locked paper gets empty lists.
 */
export async function lockedFor(
  db: Db,
  schoolId: string,
  who: ReadonlyArray<Who>,
  /** Also the papers whose dispute window is still open (only the single-exam report asks for these). */
  includeOpen = false,
): Promise<Map<string, Locked>> {
  const out = new Map<string, Locked>(who.map((w) => [w.studentId, { exams: [], answers: [] }]))
  if (who.length === 0) return out
  const sectionIds = [...new Set(who.map((w) => w.sectionId))]
  const studentIds = who.map((w) => w.studentId)
  const releases = await db
    .selectFrom('school_paper_releases as r')
    .innerJoin('school_own_papers as p', 'p.id', 'r.paper_id')
    .innerJoin('school_subjects as ss', 'ss.id', 'p.school_subject_id')
    .innerJoin('subjects as sub', 'sub.id', 'ss.subject_id')
    .select(['r.paper_id', 'r.section_id', 'r.released_at', 'r.locked_at', 'r.window_closes_at', 'p.title', 'sub.name as subject', 'sub.id as subject_id'])
    .where('r.school_id', '=', schoolId)
    .where('r.section_id', 'in', sectionIds)
    .$if(!includeOpen, (q) => q.where('r.locked_at', 'is not', null))
    .where('p.archived_at', 'is', null)
    .execute()
  if (releases.length === 0) return out
  const paperIds = [...new Set(releases.map((r) => r.paper_id))]
  const marked = await db
    .selectFrom('school_sheet_marking')
    .select(['paper_id', 'school_student_id'])
    .where('school_id', '=', schoolId)
    .where('paper_id', 'in', paperIds)
    .where('school_student_id', 'in', studentIds)
    .where('status', '=', 'marked')
    .execute()
  const rows = await db
    .selectFrom('school_answer_marks as am')
    .innerJoin('school_own_questions as q', 'q.id', 'am.own_question_id')
    .leftJoin('school_exam_questions as eq', 'eq.id', 'q.source_exam_question_id')
    .leftJoin('questions as qq', 'qq.id', 'eq.question_id')
    .leftJoin('concepts as c', 'c.id', 'qq.concept_id')
    .leftJoin('chapters as ch', 'ch.id', 'q.chapter_id')
    .select([
      'am.paper_id',
      'am.school_student_id',
      'am.own_question_id',
      'am.found',
      'am.final_marks',
      'am.max_marks',
      'am.loss_kind',
      'am.habit',
      'am.loss_reason',
      'q.or_group',
      'q.position',
      'c.id as concept_id',
      'c.name as concept_name',
      'ch.id as chapter_id',
      'ch.name as chapter_name',
    ])
    .where('am.school_id', '=', schoolId)
    .where('am.paper_id', 'in', paperIds)
    .where('am.school_student_id', 'in', studentIds)
    .execute()
  for (const w of who) {
    const mine = out.get(w.studentId)!
    for (const r of releases.filter((x) => x.section_id === w.sectionId)) {
      if (!marked.some((m) => m.paper_id === r.paper_id && m.school_student_id === w.studentId)) continue
      mine.exams.push({
        paperId: r.paper_id,
        title: r.title,
        subject: r.subject,
        subjectId: r.subject_id,
        at: r.released_at.toISOString(),
        releasedAt: r.released_at,
        lockedAt: r.locked_at,
        windowClosesAt: r.window_closes_at,
      })
    }
    const have = new Set(mine.exams.map((e) => e.paperId))
    for (const a of rows.filter((x) => x.school_student_id === w.studentId && have.has(x.paper_id)))
      mine.answers.push({
        paperId: a.paper_id,
        questionId: a.own_question_id,
        questionNo: String(a.position),
        orGroup: a.or_group,
        found: a.found,
        finalMarks: Number(a.final_marks),
        maxMarks: Number(a.max_marks),
        lossKind: a.loss_kind,
        habit: a.habit,
        lossReason: a.loss_reason,
        topicKey: a.concept_id ? `c:${a.concept_id}` : a.chapter_id ? `h:${a.chapter_id}` : 'other',
        topicLabel: a.concept_name ?? a.chapter_name ?? 'Other',
      })
  }
  return out
}

// ---------------------------------------------------------------- who is asking

export interface Viewer extends Who {
  name: string
  grade: number
  sectionName: string
  schoolName: string
}

/** The student herself, or (a parent) one of her own children. Anyone else is refused. */
export async function viewerFor(
  db: Db,
  scope: SchoolScope,
  childId?: string | null,
): Promise<{ viewer: Viewer; children: Array<{ id: string; name: string }> }> {
  let candidates: Array<string> = []
  if (scope.role === 'student') {
    const me = await db
      .selectFrom('school_students as s')
      .innerJoin('school_members as m', 'm.id', 's.member_id')
      .select('s.id')
      .where('s.school_id', '=', scope.schoolId)
      .where('m.user_id', '=', scope.userId)
      .where('s.status', '=', 'active')
      .executeTakeFirst()
    if (me) candidates = [me.id]
  } else if (scope.role === 'parent') {
    candidates = (
      await db
        .selectFrom('school_student_guardians')
        .select('school_student_id')
        .where('school_id', '=', scope.schoolId)
        .where('user_id', '=', scope.userId)
        .execute()
    ).map((g) => g.school_student_id)
  } else throw new SchoolError('forbidden', 'This is for students and parents.')
  if (candidates.length === 0)
    throw new SchoolError('not_found', 'We could not find a student record.')
  const id = childId ?? candidates[0]
  if (!candidates.includes(id)) throw new SchoolError('not_found', 'We could not find a student record.')
  const people = await db
    .selectFrom('school_students as s')
    .innerJoin('school_members as m', 'm.id', 's.member_id')
    .innerJoin('users as u', 'u.id', 'm.user_id')
    .innerJoin('school_sections as sec', 'sec.id', 's.section_id')
    .innerJoin('school_classes as c', 'c.id', 'sec.class_id')
    .innerJoin('schools as sch', 'sch.id', 's.school_id')
    .select(['s.id', 's.section_id', 'u.name', 'c.grade', 'sec.name as section', 'sch.name as school'])
    .where('s.school_id', '=', scope.schoolId)
    .where('s.id', 'in', candidates)
    .execute()
  const me = people.find((p) => p.id === id)
  if (!me) throw new SchoolError('not_found', 'We could not find a student record.')
  return {
    viewer: {
      studentId: me.id,
      sectionId: me.section_id,
      name: me.name,
      grade: me.grade,
      sectionName: me.section,
      schoolName: me.school,
    },
    children: people.map((p) => ({ id: p.id, name: p.name })),
  }
}

// ---------------------------------------------------------------- screens 1, 2, 4, 5

export async function myProgress(
  db: Db,
  scope: SchoolScope,
  childId?: string | null,
) {
  const { viewer, children } = await viewerFor(db, scope, childId)
  const data = (await lockedFor(db, scope.schoolId, [viewer])).get(viewer.studentId)!
  const exams: Array<ExamInfo> = data.exams
  const summaries = examSummaries(exams, data.answers)
  const topics = topicRows(exams, data.answers)
  const school = await db
    .selectFrom('schools')
    .select('show_class_rank')
    .where('id', '=', scope.schoolId)
    .executeTakeFirstOrThrow()
  // class rank only when the school has turned it on: among the section's students marked in her latest exam
  let rank: { place: number; of: number } | null = null
  const lastExam = data.exams.at(-1)
  if (school.show_class_rank && lastExam) {
    const totals = await db
      .selectFrom('school_sheet_marking')
      .select(['school_student_id', 'total_marks'])
      .where('school_id', '=', scope.schoolId)
      .where('paper_id', '=', lastExam.paperId)
      .where('status', '=', 'marked')
      .execute()
    const mine = totals.find((x) => x.school_student_id === viewer.studentId)
    if (mine) {
      const inSection = await db
        .selectFrom('school_students')
        .select('id')
        .where('school_id', '=', scope.schoolId)
        .where('section_id', '=', viewer.sectionId)
        .execute()
      const ids = new Set(inSection.map((x) => x.id))
      const peers = totals.filter((x) => ids.has(x.school_student_id))
      rank = {
        place: 1 + peers.filter((x) => Number(x.total_marks) > Number(mine.total_marks)).length,
        of: peers.length,
      }
    }
  }
  return {
    viewer: {
      name: viewer.name,
      grade: viewer.grade,
      sectionName: viewer.sectionName,
      schoolName: viewer.schoolName,
    },
    children,
    rank,
    hasData: summaries.length > 0,
    growth: roundsOf(summaries).map((s) => ({
      paperId: s.paperId,
      title: s.title,
      subject: s.subject,
      at: s.at,
      pct: s.pct,
    })),
    exams: [...summaries].reverse(),
    best: personalBest(roundsOf(summaries)),
    focus: weeklyFocus(exams, data.answers, topics),
    subjects: subjectTiles(summaries, topics),
    topics,
    habits: habitSeries(exams, data.answers).map((h) => ({
      ...h,
      label: HABIT_LABEL[h.habit],
      tip: HABIT_TIP[h.habit],
    })),
    showRank: school.show_class_rank,
  }
}

// ---------------------------------------------------------------- screen 3, the exam report

/**
 * One locked exam, insight first. The detail of each answer (marks per step, the reason, her pages) comes
 * from the existing student result; this adds the split of the marks lost and the three things to fix.
 */
export async function examInsight(
  db: Db,
  scope: SchoolScope,
  paperId: string,
  childId?: string | null,
) {
  const { viewer } = await viewerFor(db, scope, childId)
  const data = (await lockedFor(db, scope.schoolId, [viewer], true)).get(viewer.studentId)!
  const exam = data.exams.find((e) => e.paperId === paperId)
  if (!exam) throw new SchoolError('not_found', 'This report is not available.')
  const [summary] = examSummaries([exam], data.answers.filter((a) => a.paperId === paperId))
  const mine = countedAnswers(data.answers.filter((a) => a.paperId === paperId))
  const questions = await markingQuestions(db, scope, paperId)
  const steps = await db
    .selectFrom('school_answer_marks')
    .select(['own_question_id', 'steps', 'answer_text'])
    .where('school_id', '=', scope.schoolId)
    .where('paper_id', '=', paperId)
    .where('school_student_id', '=', viewer.studentId)
    .execute()
  const pages = await db
    .selectFrom('school_own_sheets')
    .select(['id', 'seq', 'purged_at', 'image_key', 'original_key'])
    .where('school_id', '=', scope.schoolId)
    .where('paper_id', '=', paperId)
    .where('school_student_id', '=', viewer.studentId)
    .where('status', '=', 'placed')
    .where('kind', '=', 'page')
    .orderBy('seq')
    .execute()
  const lost = (a: AnswerRow) => a.maxMarks - a.finalMarks
  const byTopic = new Map<string, { label: string; lost: number; kind: Partial<Record<string, number>> }>()
  for (const a of mine.filter((x) => lost(x) > 0)) {
    const t = byTopic.get(a.topicKey) ?? { label: a.topicLabel, lost: 0, kind: {} }
    t.lost += lost(a)
    t.kind[a.lossKind] = (t.kind[a.lossKind] ?? 0) + lost(a)
    byTopic.set(a.topicKey, t)
  }
  const fixes = [...byTopic.entries()]
    .sort((a, b) => b[1].lost - a[1].lost)
    .slice(0, 3)
    .map(([key, t]) => ({
      topicKey: key,
      title: t.label,
      lost: t.lost,
      kind: (t.kind.knowledge_gap ?? 0) >= (t.kind.writing_habit ?? 0) ? 'knowledge_gap' : 'writing_habit',
    }))
  // while the dispute window is open a student can flag from here (the same flow as "My results")
  const open =
    scope.role === 'student' && exam.lockedAt === null
      ? await myResult(db, scope, paperId)
      : null
  return {
    viewer: { name: viewer.name, grade: viewer.grade, sectionName: viewer.sectionName, schoolName: viewer.schoolName },
    flagsLeft: open?.flagsLeft ?? 0,
    pages: pages
      .filter((p) => p.purged_at === null && (p.image_key !== null || p.original_key !== null))
      .map((p) => ({ id: p.id, seq: p.seq, url: signedUrl(scope.schoolId, p.id, 'my-sheet-images') })),
    exam: {
      paperId,
      title: exam.title,
      subject: exam.subject,
      at: exam.at,
      locked: exam.lockedAt !== null,
      windowClosesAt: exam.windowClosesAt.toISOString(),
    },
    canFlag: scope.role === 'student',
    score: { earned: summary.earned, max: summary.max, pct: summary.pct, grade: gradeOf(summary.pct) },
    split: {
      knowledge: summary.lostKnowledge,
      habit: summary.lostHabit,
      unclear: summary.lostUnclear,
    },
    fixes,
    grid: questions.map((q) => {
      const a = mine.find((x) => x.questionId === q.id)
      const extra = steps.find((x) => x.own_question_id === q.id)
      return {
        questionNo: q.no,
        text: q.text,
        maxMarks: q.marks,
        marks: a?.finalMarks ?? null,
        counted: a !== undefined,
        lossKind: a?.lossKind ?? null,
        reason: a?.lossReason ?? null,
        habit: a?.habit ?? null,
        yourAnswer: extra?.answer_text ?? null,
        steps: (extra?.steps ?? []) as Array<{ no: number; description: string; awarded: number; max: number }>,
        flag: open?.answers.find((x) => x.questionNo === q.no) ?? null,
      }
    }),
  }
}

/** One of her own scanned pages, through a signed short-lived link. Anyone else's page looks like a missing one. */
export async function mySheetImage(
  db: Db,
  scope: SchoolScope,
  sheetId: string,
  exp: string | null,
  sig: string | null,
  childId?: string | null,
): Promise<Buffer> {
  const notFound = new SchoolError('not_found', 'We could not find that picture.')
  if (!verifyScanPageSignature(sheetId, exp, sig)) throw notFound
  const { viewer } = await viewerFor(db, scope, childId)
  const sheet = await db
    .selectFrom('school_own_sheets')
    .select(['image_key', 'original_key', 'school_student_id', 'paper_id'])
    .where('school_id', '=', scope.schoolId)
    .where('id', '=', sheetId)
    .executeTakeFirst()
  const key = sheet?.image_key ?? sheet?.original_key
  if (!sheet || !key || sheet.school_student_id !== viewer.studentId) throw notFound
  // only once her section's results have been released
  const rel = await db
    .selectFrom('school_paper_releases')
    .select('id')
    .where('school_id', '=', scope.schoolId)
    .where('paper_id', '=', sheet.paper_id)
    .where('section_id', '=', viewer.sectionId)
    .executeTakeFirst()
  if (!rel) throw notFound
  const sealed = await getScanStore().get(key)
  if (!sealed) throw notFound
  return decryptScan(sealed)
}
