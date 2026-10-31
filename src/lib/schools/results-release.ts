import type { Db } from '../../db/connection'
import {
  schoolAnswerDisputesRepository,
  schoolAnswerMarksRepository,
  schoolPaperReleasesRepository,
  schoolSheetMarkingRepository,
} from '../../db/repositories'
import { examPrintRepository } from '../../db/repositories/school-exams'
import type { SchoolScope } from '../../db/school-scope'
import { SchoolError, auditSchool, auditSchoolEvent } from './common'
import {
  loadMarkingPages,
  markingAiFor,
  markingQuestions,
  reportFrom,
  studentMarkingUnchecked,
} from './marking'
import type { MarkingAi } from './marking'
import { isChoiceQuestion, mcqKeyLabel, parsePass, totalsOf } from './marking-logic'
import { loadOwnPaper } from './own-paper-service'
import { sectionsFor, studentOfPaper } from './own-sheets'

// Releasing marked results to the students, her dispute window, and the lock (M4, owner direction
// 2026-10-31; CLAUDE.md "School module rules" > Marking).
//
//   - A section's results are released by its teacher (or the office) once nobody in the section is still
//     waiting for marking or a teacher's look. Release is per section; the window is the school's
//     dispute_window_days (default 7) from that moment.
//   - In the window a student may flag at most 5 answers of a paper, each with a reason. The AI re-reads
//     the answer once and may only keep or raise the mark. If she is still not satisfied she sends it to
//     the teacher, whose decision is final (raise or lower).
//   - The marks lock when the window has closed and no dispute is still with a teacher. Locked marks are
//     the ones mastery and reports use. Every change goes to audit_log; nothing is deleted.
//   - Nothing here e-mails or notifies a student, scores her, or sends anything to analytics.

export const MAX_FLAGS_PER_PAPER = 5
const REASON_MIN = 5
const REASON_MAX = 500
const HANDLES = new Set(['school_admin', 'teacher'])

const half = (n: number) => Math.round(n * 2) / 2

// ---------------------------------------------------------------- lock

/**
 * Locks every release whose window has closed and that has no dispute still with a teacher. A dispute the
 * student left after the AI's answer does not hold the lock back (she chose not to ask her teacher).
 * Called from the reads below and, later, by a scheduled job. Returns how many were locked.
 */
export async function lockDueReleases(
  db: Db,
  schoolId: string,
  now = new Date(),
): Promise<number> {
  const due = await db
    .selectFrom('school_paper_releases')
    .select(['id', 'paper_id', 'section_id'])
    .where('school_id', '=', schoolId)
    .where('locked_at', 'is', null)
    .where('window_closes_at', '<=', now)
    .execute()
  let locked = 0
  for (const r of due) {
    const open = await db
      .selectFrom('school_answer_disputes as d')
      .innerJoin('school_students as s', 's.id', 'd.school_student_id')
      .select('d.id')
      .where('d.school_id', '=', schoolId)
      .where('d.paper_id', '=', r.paper_id)
      .where('s.section_id', '=', r.section_id)
      .where('d.status', '=', 'with_teacher')
      .executeTakeFirst()
    if (open) continue
    await db
      .updateTable('school_paper_releases')
      .set({ locked_at: now })
      .where('id', '=', r.id)
      .where('school_id', '=', schoolId)
      .execute()
    await auditSchoolEvent(db, {
      schoolId,
      actorUserId: null,
      action: 'school.marks_locked',
      entity: 'school_paper_releases',
      entityId: r.id,
      before: null,
      after: { locked_at: now.toISOString() },
    })
    locked++
  }
  return locked
}

// ---------------------------------------------------------------- the teacher: release

export interface SectionRelease {
  sectionId: string
  name: string
  students: number
  marked: number
  /** Students whose marking is not finished: why the section cannot be released yet. */
  blockers: Array<string>
  canRelease: boolean
  released: null | {
    at: string
    windowDays: number
    windowClosesAt: string
    locked: boolean
  }
}

export async function releaseStatus(
  db: Db,
  scope: SchoolScope,
  paperId: string,
  now = new Date(),
): Promise<Array<SectionRelease>> {
  if (!HANDLES.has(scope.role))
    throw new SchoolError('forbidden', 'Only the school office and teachers can see this.')
  const paper = await loadOwnPaper(db, scope, paperId)
  await lockDueReleases(db, scope.schoolId, now)
  const sections = await sectionsFor(db, scope, paper)
  const states = await schoolSheetMarkingRepository.listForPaper(db, scope, paperId)
  const pages = await db
    .selectFrom('school_own_sheets')
    .select(['school_student_id'])
    .where('school_id', '=', scope.schoolId)
    .where('paper_id', '=', paperId)
    .where('status', '=', 'placed')
    .where('kind', '=', 'page')
    .execute()
  const releases = await db
    .selectFrom('school_paper_releases')
    .selectAll()
    .where('school_id', '=', scope.schoolId)
    .where('paper_id', '=', paperId)
    .execute()
  const out: Array<SectionRelease> = []
  for (const sec of sections) {
    const students = await examPrintRepository.studentsOfSections(db, scope, [sec.id])
    const status = (id: string) => states.find((x) => x.school_student_id === id)?.status
    const has = (id: string) => pages.some((p) => p.school_student_id === id)
    const count = (f: (id: string) => boolean) =>
      students.filter((s) => f(s.school_student_id)).length
    const waiting = count((id) => status(id) === 'needs_teacher')
    const busy = count((id) => status(id) === 'checking')
    const rejected = count((id) => status(id) === 'rejected')
    const unmarked = count((id) => has(id) && status(id) === undefined)
    const marked = count((id) => status(id) === 'marked')
    const blockers: Array<string> = []
    const plural = (n: number, one: string, many: string) =>
      `${n} ${n === 1 ? one : many}`
    if (waiting > 0)
      blockers.push(`${plural(waiting, 'student has', 'students have')} answers waiting for a teacher's look.`)
    if (busy > 0) blockers.push(`${plural(busy, 'student is', 'students are')} still being marked.`)
    if (unmarked > 0)
      blockers.push(`${plural(unmarked, 'student has', 'students have')} sheets that are not marked yet.`)
    if (rejected > 0)
      blockers.push(`${plural(rejected, 'student', 'students')} could not be marked. Upload the pages again and mark again.`)
    if (marked === 0 && blockers.length === 0)
      blockers.push('Nobody in this section has been marked yet.')
    const rel = releases.find((r) => r.section_id === sec.id)
    out.push({
      sectionId: sec.id,
      name: sec.name,
      students: students.length,
      marked,
      blockers,
      canRelease: !rel && blockers.length === 0,
      released: rel
        ? {
            at: rel.released_at.toISOString(),
            windowDays: rel.window_days,
            windowClosesAt: rel.window_closes_at.toISOString(),
            locked: rel.locked_at !== null,
          }
        : null,
    })
  }
  return out
}

export async function releaseSection(
  db: Db,
  scope: SchoolScope,
  paperId: string,
  sectionId: string,
  now = new Date(),
): Promise<{ windowClosesAt: string }> {
  if (!HANDLES.has(scope.role))
    throw new SchoolError('forbidden', 'Only the school office and teachers can release results.')
  const status = await releaseStatus(db, scope, paperId, now)
  const sec = status.find((s) => s.sectionId === sectionId)
  if (!sec) throw new SchoolError('not_found', 'That section is not yours for this paper.')
  if (sec.released) throw new SchoolError('conflict', 'These results have already been released.')
  if (sec.blockers.length > 0)
    throw new SchoolError('conflict', `Not ready to release: ${sec.blockers.join(' ')}`)
  const school = await db
    .selectFrom('schools')
    .select('dispute_window_days')
    .where('id', '=', scope.schoolId)
    .executeTakeFirstOrThrow()
  const days = school.dispute_window_days
  const closes = new Date(now.getTime() + days * 86_400_000)
  const row = await schoolPaperReleasesRepository.insert(db, scope, {
    paper_id: paperId,
    section_id: sectionId,
    released_by_user_id: scope.userId,
    released_at: now,
    window_days: days,
    window_closes_at: closes,
  })
  await auditSchool(db, scope, 'school.results_released', 'school_paper_releases', row.id, null, {
    paper_id: paperId,
    section_id: sectionId,
    marked: sec.marked,
    window_days: days,
  })
  return { windowClosesAt: closes.toISOString() }
}

// ---------------------------------------------------------------- the student

/** What a student's own screens and the AI re-read need of a paper (the paper loader is teachers-only). */
async function paperInfo(db: Db, scope: SchoolScope, paperId: string) {
  const p = await db
    .selectFrom('school_own_papers as p')
    .innerJoin('school_subjects as ss', 'ss.id', 'p.school_subject_id')
    .innerJoin('subjects as sub', 'sub.id', 'ss.subject_id')
    .innerJoin('school_classes as c', 'c.id', 'p.class_id')
    .select(['p.title', 'sub.name as subject', 'c.grade'])
    .where('p.school_id', '=', scope.schoolId)
    .where('p.id', '=', paperId)
    .where('p.archived_at', 'is', null)
    .executeTakeFirst()
  if (!p) throw new SchoolError('not_found', 'These results are not available.')
  return p
}

async function myStudent(db: Db, scope: SchoolScope) {
  if (scope.role !== 'student')
    throw new SchoolError('forbidden', 'This is for students.')
  const me = await db
    .selectFrom('school_students as s')
    .innerJoin('school_members as m', 'm.id', 's.member_id')
    .select(['s.id', 's.section_id'])
    .where('s.school_id', '=', scope.schoolId)
    .where('m.user_id', '=', scope.userId)
    .where('s.status', '=', 'active')
    .executeTakeFirst()
  if (!me) throw new SchoolError('not_found', 'We could not find your student record.')
  return { studentId: me.id, sectionId: me.section_id }
}

/** The papers whose results have been released to her section and in which she has been marked. */
export async function myResults(db: Db, scope: SchoolScope, now = new Date()) {
  const me = await myStudent(db, scope)
  await lockDueReleases(db, scope.schoolId, now)
  const rows = await db
    .selectFrom('school_paper_releases as r')
    .innerJoin('school_sheet_marking as m', (j) =>
      j.onRef('m.paper_id', '=', 'r.paper_id').on('m.school_student_id', '=', me.studentId),
    )
    .innerJoin('school_own_papers as p', 'p.id', 'r.paper_id')
    .select([
      'r.paper_id',
      'p.title',
      'r.released_at',
      'r.window_closes_at',
      'r.locked_at',
      'm.total_marks',
      'm.max_marks',
    ])
    .where('r.school_id', '=', scope.schoolId)
    .where('r.section_id', '=', me.sectionId)
    .where('m.status', '=', 'marked')
    .orderBy('r.released_at', 'desc')
    .execute()
  return rows.map((r) => ({
    paperId: r.paper_id,
    title: r.title,
    totalMarks: Number(r.total_marks),
    maxMarks: Number(r.max_marks),
    releasedAt: r.released_at.toISOString(),
    windowClosesAt: r.window_closes_at.toISOString(),
    locked: r.locked_at !== null,
  }))
}

export async function myResult(
  db: Db,
  scope: SchoolScope,
  paperId: string,
  now = new Date(),
) {
  const me = await myStudent(db, scope)
  await lockDueReleases(db, scope.schoolId, now)
  const rel = await db
    .selectFrom('school_paper_releases')
    .selectAll()
    .where('school_id', '=', scope.schoolId)
    .where('paper_id', '=', paperId)
    .where('section_id', '=', me.sectionId)
    .executeTakeFirst()
  const marking = rel
    ? await schoolSheetMarkingRepository.forStudent(db, scope, paperId, me.studentId)
    : undefined
  // not released, or she was not marked: the same answer, so nothing is revealed
  if (!rel || marking?.status !== 'marked')
    throw new SchoolError('not_found', 'These results are not available.')
  const v = await studentMarkingUnchecked(db, scope, paperId, me.studentId)
  const disputes = await db
    .selectFrom('school_answer_disputes')
    .selectAll()
    .where('school_id', '=', scope.schoolId)
    .where('paper_id', '=', paperId)
    .where('school_student_id', '=', me.studentId)
    .execute()
  const windowOpen = rel.locked_at === null && now < rel.window_closes_at
  const flagsLeft = MAX_FLAGS_PER_PAPER - disputes.length
  const paper = await paperInfo(db, scope, paperId)
  return {
    title: paper.title,
    totalMarks: v.totalMarks,
    maxMarks: v.maxMarks,
    releasedAt: rel.released_at.toISOString(),
    windowClosesAt: rel.window_closes_at.toISOString(),
    locked: rel.locked_at !== null,
    windowOpen,
    flagsLeft,
    flagsAllowed: MAX_FLAGS_PER_PAPER,
    report: reportFrom(v).report,
    // she may see the correct answer next to her own once her marks are final for her (CLAUDE.md, 2026-09-22)
    answers: v.answers.map((a) => {
      const d = disputes.find((x) => x.answer_mark_id === a.answerMarkId)
      return {
        questionNo: a.questionNo,
        text: a.text,
        maxMarks: a.maxMarks,
        marks: a.finalMarks,
        answerMarkId: a.answerMarkId,
        yourAnswer: a.answerText,
        correctAnswer: a.keyText,
        lossKind: a.lossKind,
        lossReason: a.lossReason,
        canFlag:
          windowOpen &&
          flagsLeft > 0 &&
          !d &&
          a.answerMarkId !== null &&
          (a.finalMarks ?? 0) < a.maxMarks,
        dispute: d
          ? {
              id: d.id,
              status: d.status,
              reason: d.reason,
              aiReply: d.ai_reply,
              marksBefore: Number(d.marks_before),
              marksAfter: d.marks_after === null ? null : Number(d.marks_after),
              decisionNote: d.decision_note,
              canAskTeacher: d.status === 'ai_reviewed' && windowOpen,
            }
          : null,
      }
    }),
  }
}

/** Recomputes a student's total after one answer changed (the status of her marking is left as it is). */
async function refreshTotal(db: Db, scope: SchoolScope, paperId: string, studentId: string) {
  const all = await schoolAnswerMarksRepository.forStudent(db, scope, paperId, studentId)
  const questions = await markingQuestions(db, scope, paperId)
  const { total, max } = totalsOf(
    questions,
    new Map(all.map((a) => [a.own_question_id, Number(a.final_marks)])),
  )
  const state = await schoolSheetMarkingRepository.forStudent(db, scope, paperId, studentId)
  if (state)
    await schoolSheetMarkingRepository.update(db, scope, state.id, {
      total_marks: String(total),
      max_marks: String(max),
    })
}

/**
 * The student flags one answer. The AI re-reads it once (may keep or raise the mark, never lower it); with
 * no AI available it goes straight to the teacher.
 */
export async function flagAnswer(
  db: Db,
  scope: SchoolScope,
  answerMarkId: string,
  reason: string,
  aiOverride?: MarkingAi,
  now = new Date(),
): Promise<{ status: string; aiReply: string | null; marksAfter: number }> {
  const me = await myStudent(db, scope)
  const mark = await schoolAnswerMarksRepository.findById(db, scope, answerMarkId)
  if (!mark || mark.school_student_id !== me.studentId)
    throw new SchoolError('not_found', 'That answer was not found.')
  await lockDueReleases(db, scope.schoolId, now)
  const rel = await db
    .selectFrom('school_paper_releases')
    .selectAll()
    .where('school_id', '=', scope.schoolId)
    .where('paper_id', '=', mark.paper_id)
    .where('section_id', '=', me.sectionId)
    .executeTakeFirst()
  if (!rel) throw new SchoolError('not_found', 'These results are not available.')
  if (rel.locked_at !== null || now >= rel.window_closes_at)
    throw new SchoolError('conflict', 'The time to flag answers for this paper is over.')
  const why = reason.trim()
  if (why.length < REASON_MIN || why.length > REASON_MAX)
    throw new SchoolError('invalid', `Say why in ${REASON_MIN} to ${REASON_MAX} characters.`)
  const before = Number(mark.final_marks)
  const max = Number(mark.max_marks)
  if (before >= max)
    throw new SchoolError('invalid', 'This answer already has full marks.')
  const used = await db
    .selectFrom('school_answer_disputes')
    .select('id')
    .where('school_id', '=', scope.schoolId)
    .where('paper_id', '=', mark.paper_id)
    .where('school_student_id', '=', me.studentId)
    .execute()
  if (used.length >= MAX_FLAGS_PER_PAPER)
    throw new SchoolError('conflict', `You can flag at most ${MAX_FLAGS_PER_PAPER} answers in one paper.`)
  const dup = await db
    .selectFrom('school_answer_disputes')
    .select('id')
    .where('answer_mark_id', '=', answerMarkId)
    .executeTakeFirst()
  if (dup) throw new SchoolError('conflict', 'You have already flagged this answer.')

  // the AI reads it again, once
  let aiReply: string | null = null
  let after = before
  let status: 'ai_reviewed' | 'with_teacher' | 'resolved' = 'with_teacher'
  const questions = await markingQuestions(db, scope, mark.paper_id)
  const q = questions.find((x) => x.id === mark.own_question_id)
  const ai = aiOverride ?? (await markingAiFor(db, scope))
  const pages = q && ai.available() ? await loadMarkingPages(db, scope, mark.paper_id, me.studentId) : null
  if (q && pages) {
    try {
      const paper = await paperInfo(db, scope, mark.paper_id)
      const read = parsePass(
        await ai.markPass({
          pages,
          subject: paper.subject,
          grade: paper.grade,
          questions: [{ ...q, no: '1' }],
          note: why,
        }),
      )?.answers.find((a) => a.question.trim() === '1')
      if (read) {
        const newMarks = isChoiceQuestion(q)
          ? read.choice?.trim().toUpperCase() === mcqKeyLabel(q)
            ? q.marks
            : 0
          : Math.min(q.marks, Math.max(0, half(read.marks)))
        if (newMarks > before) {
          after = newMarks
          status = 'resolved'
          aiReply = `The AI read your answer again and raised the mark from ${before} to ${newMarks}.`
        } else {
          status = 'ai_reviewed'
          aiReply = `The AI read your answer again and kept the mark at ${before}. You can ask your teacher to look at it.`
        }
      }
    } catch {
      // the AI is off or over its allowance: the teacher decides
    }
  }

  await db.transaction().execute(async (trx) => {
    const d = await schoolAnswerDisputesRepository.insert(trx, scope, {
      paper_id: mark.paper_id,
      school_student_id: me.studentId,
      answer_mark_id: answerMarkId,
      reason: why,
      status,
      ai_reply: aiReply,
      marks_before: String(before),
      marks_after: status === 'resolved' ? String(after) : null,
      decided_at: status === 'resolved' ? now : null,
    })
    if (after > before) {
      await schoolAnswerMarksRepository.update(trx, scope, answerMarkId, {
        final_marks: String(after),
        changed_at: now,
      })
      await refreshTotal(trx, scope, mark.paper_id, me.studentId)
    }
    await auditSchool(trx, scope, 'school.answer_flagged', 'school_answer_disputes', d.id, { marks: before }, {
      status,
      marks: after,
      reason: why,
    })
  })
  return { status, aiReply, marksAfter: after }
}

/** She is not satisfied with the AI's second look: the teacher decides. */
export async function askTeacher(
  db: Db,
  scope: SchoolScope,
  disputeId: string,
  now = new Date(),
): Promise<void> {
  const me = await myStudent(db, scope)
  const d = await schoolAnswerDisputesRepository.findById(db, scope, disputeId)
  if (!d || d.school_student_id !== me.studentId)
    throw new SchoolError('not_found', 'That flag was not found.')
  await lockDueReleases(db, scope.schoolId, now)
  const rel = await db
    .selectFrom('school_paper_releases')
    .selectAll()
    .where('school_id', '=', scope.schoolId)
    .where('paper_id', '=', d.paper_id)
    .where('section_id', '=', me.sectionId)
    .executeTakeFirst()
  if (!rel || rel.locked_at !== null || now >= rel.window_closes_at)
    throw new SchoolError('conflict', 'The time to ask your teacher for this paper is over.')
  if (d.status !== 'ai_reviewed')
    throw new SchoolError('conflict', 'This flag is already with your teacher or settled.')
  await schoolAnswerDisputesRepository.update(db, scope, d.id, { status: 'with_teacher' })
  await auditSchool(db, scope, 'school.dispute_to_teacher', 'school_answer_disputes', d.id, { status: d.status }, { status: 'with_teacher' })
}

// ---------------------------------------------------------------- the teacher decides

export async function disputeQueue(db: Db, scope: SchoolScope, paperId: string) {
  if (!HANDLES.has(scope.role))
    throw new SchoolError('forbidden', 'Only the school office and teachers can see this.')
  const paper = await loadOwnPaper(db, scope, paperId)
  const sections = await sectionsFor(db, scope, paper)
  const students = await examPrintRepository.studentsOfSections(
    db,
    scope,
    sections.map((s) => s.id),
  )
  const ids = students.map((s) => s.school_student_id)
  if (ids.length === 0) return []
  const rows = await db
    .selectFrom('school_answer_disputes')
    .selectAll()
    .where('school_id', '=', scope.schoolId)
    .where('paper_id', '=', paperId)
    .where('school_student_id', 'in', ids)
    .orderBy('created_at')
    .execute()
  const questions = await markingQuestions(db, scope, paperId)
  const marks = await schoolAnswerMarksRepository.list(db, scope)
  return rows.map((d) => {
    const m = marks.find((x) => x.id === d.answer_mark_id)
    const q = questions.find((x) => x.id === m?.own_question_id)
    const st = students.find((s) => s.school_student_id === d.school_student_id)
    return {
      id: d.id,
      status: d.status,
      student: st?.name ?? '',
      rollNo: st?.roll_no ?? '',
      questionNo: q?.no ?? '',
      question: q?.text ?? '',
      maxMarks: q?.marks ?? 0,
      answerText: m?.answer_text ?? null,
      reason: d.reason,
      aiReply: d.ai_reply,
      marksBefore: Number(d.marks_before),
      marksNow: m ? Number(m.final_marks) : null,
      marksAfter: d.marks_after === null ? null : Number(d.marks_after),
      decisionNote: d.decision_note,
    }
  })
}

/** The teacher's decision on a flag: final, and it may raise or lower the mark. */
export async function decideDispute(
  db: Db,
  scope: SchoolScope,
  disputeId: string,
  marks: number,
  note: string,
  now = new Date(),
): Promise<{ marks: number }> {
  if (!HANDLES.has(scope.role))
    throw new SchoolError('forbidden', 'Only a teacher or the school office can decide a flag.')
  const d = await schoolAnswerDisputesRepository.findById(db, scope, disputeId)
  if (!d) throw new SchoolError('not_found', 'That flag was not found.')
  await studentOfPaper(db, scope, d.paper_id, d.school_student_id)
  if (d.status !== 'with_teacher')
    throw new SchoolError('conflict', 'This flag is not waiting for a teacher.')
  const mark = await schoolAnswerMarksRepository.findById(db, scope, d.answer_mark_id)
  if (!mark) throw new SchoolError('not_found', 'That answer was not found.')
  const max = Number(mark.max_marks)
  if (!Number.isFinite(marks) || marks < 0 || marks > max)
    throw new SchoolError('invalid', `Give a mark from 0 to ${max}.`)
  if (Math.round(marks * 2) !== marks * 2)
    throw new SchoolError('invalid', 'Marks go in steps of half a mark.')
  const why = note.trim()
  if (!why) throw new SchoolError('invalid', 'Say why you decided this.')
  await db.transaction().execute(async (trx) => {
    await schoolAnswerMarksRepository.update(trx, scope, mark.id, {
      final_marks: String(marks),
      state: 'teacher_set',
      changed_by_user_id: scope.userId,
      changed_at: now,
    })
    await schoolAnswerDisputesRepository.update(trx, scope, d.id, {
      status: 'resolved',
      marks_after: String(marks),
      decided_by_user_id: scope.userId,
      decision_note: why,
      decided_at: now,
    })
    await refreshTotal(trx, scope, d.paper_id, d.school_student_id)
    await auditSchool(
      trx,
      scope,
      'school.dispute_decided',
      'school_answer_disputes',
      d.id,
      { marks: Number(mark.final_marks) },
      { marks, note: why },
    )
  })
  await lockDueReleases(db, scope.schoolId, now)
  return { marks }
}
