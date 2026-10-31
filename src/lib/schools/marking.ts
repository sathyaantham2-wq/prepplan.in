import sharp from 'sharp'
import type { Db } from '../../db/connection'
import {
  schoolAnswerMarksRepository,
  schoolOwnQuestionsRepository,
  schoolSheetMarkingRepository,
} from '../../db/repositories'
import type { SchoolScope } from '../../db/school-scope'
import {
  callWithProviderChain,
  ModelCallError,
  VISION_PROVIDERS,
} from '../ai-models'
import { enforceAiCallBudget, logAiJob } from '../ai-metering'
import { completeText, isAiConfigured, stripCodeFence } from '../ai-provider'
import { isProductionRuntime } from '../fixture-subjects'
import { decryptScan } from '../scan-crypto'
import { getScanStore } from '../scan-storage'
import { SchoolError, auditSchool } from './common'
import {
  PASSES,
  combinePasses,
  isChoiceQuestion,
  mcqKeyLabel,
  parsePass,
  totalsOf
  
  
  
} from './marking-logic'
import type {CombinedAnswer, MarkQuestion, PassAnswer} from './marking-logic';
import { assertPaperReadyForMarking, loadOwnPaper } from './own-paper-service'
import { ownSheetsSummary, studentOfPaper } from './own-sheets'
import { assertSchoolAiBudget } from './school-ai-budget'

const RELEASED_SAY =
  'These results have been released to the students. A mark can now only change when a student flags it and a teacher decides.'

// AI marking of one student's answer sheets (M4 stage 1; owner direction 2026-10-30).
//
//   - Only an approved paper with an approved key is marked (assertPaperReadyForMarking).
//   - The student's pages are checked first (upload-checks): a student with a page still waiting for the
//     teacher's yes has nothing marked. Refused pages are ignored.
//   - The AI is sent the page pictures (the top strip of the first page, where the name is written,
//     whited out) and the questions with the approved key. Never a name, a roll number or an ID.
//   - Three passes over the same pages; marks are decided by marking-logic.ts.
//   - A teacher can change any mark; every change goes to audit_log.

export interface MarkingPage {
  mediaType: string
  base64: string
}

export interface MarkingAi {
  available: () => boolean
  /** One pass over all of a student's pages -> JSON text (see PassSchema in marking-logic.ts). */
  markPass: (input: {
    pages: Array<MarkingPage>
    subject: string
    grade: number
    questions: Array<MarkQuestion>
    /** A pupil's own reason for a flagged mark (the re-read only). */
    note?: string
  }) => Promise<string>
}

const ONLY_JSON = 'Reply with JSON only, no other words.'

export function markingPrompt(
  subject: string,
  grade: number,
  questions: ReadonlyArray<MarkQuestion>,
  pages: number,
  note?: string,
): string {
  const list = questions
    .map((q) => {
      const head = `Question ${q.no} (${q.marks} mark${q.marks === 1 ? '' : 's'}): ${q.text}`
      if (isChoiceQuestion(q))
        return `${head}\n  Options: ${q.options.map((o) => `(${o.label}) ${o.text}`).join('  ')}\n  Just report which option letter the pupil chose.`
      const steps = q.keySteps.length
        ? `\n  Marking scheme: ${q.keySteps.map((s, i) => `step ${i + 1}: ${s.description} [${s.marks}]`).join('; ')}`
        : ''
      return `${head}\n  Approved answer: ${q.keyText}${steps}`
    })
    .join('\n\n')
  return `You are marking a CBSE Class ${grade} ${subject} answer sheet. The ${pages} picture${pages === 1 ? '' : 's'} are the pupil's handwritten pages, in order. The pupil may answer in any order and the answers have no boxes: find each answer by its question number.

For every question below, say whether you found an answer, copy a short version of what the pupil wrote, and mark it against the approved answer and marking scheme. Be fair: award a mark for every step the pupil shows correctly, even if worded differently; accept a different valid method. Only OR questions are alternatives of each other: mark whichever the pupil attempted. For each question where marks are lost, say whether the pupil did not know it ("knowledge_gap") or knew it but wrote it badly, too briefly, skipped working or stopped early ("writing_habit"). Say how sure you are (confidence 0 to 1); if the handwriting is hard to read, lower it. If a question's answer is not on any page, give found false and marks 0.

${list}
${note ? `\nThe pupil asked for this answer to be read again and said: "${note}". Re-read the pages carefully; do not give a mark the writing does not earn.\n` : ''}
${ONLY_JSON}
Shape: {"answers":[{"question":"1","found":true,"answer_text":"...","choice":null,"marks":2,"steps":[{"step":1,"awarded":1}],"loss_kind":"none"|"knowledge_gap"|"writing_habit","loss_reason":"...","confidence":0.9}]}`
}

export function createMarkingAi(
  db: Db,
  school: { schoolId: string; householdId: string },
): MarkingAi {
  return {
    available: () => isAiConfigured(),
    markPass: async ({ pages, subject, grade, questions, note }) => {
      await assertSchoolAiBudget(db, school.schoolId)
      await enforceAiCallBudget(db, {
        feature: 'SCH-07',
        model: 'SCH-07',
        householdId: school.householdId,
      })
      const startedAt = Date.now()
      try {
        const outcome = await callWithProviderChain(
          'SCH-07',
          (provider, model) =>
            completeText(
              {
                model,
                prompt: markingPrompt(subject, grade, questions, pages.length, note),
                maxTokens: 6000,
                images: pages,
              },
              provider,
            ),
          undefined,
          { only: VISION_PROVIDERS },
        )
        await logAiJob(db, {
          feature: 'SCH-07',
          model: outcome.label,
          householdId: school.householdId,
          tokensIn: outcome.result.tokensIn,
          tokensOut: outcome.result.tokensOut,
          latencyMs: Date.now() - startedAt,
          status: 'success',
        })
        return stripCodeFence(outcome.result.text ?? '')
      } catch (err) {
        await logAiJob(db, {
          feature: 'SCH-07',
          model: err instanceof ModelCallError ? err.label : 'SCH-07',
          householdId: school.householdId,
          latencyMs: Date.now() - startedAt,
          status: 'error',
          error: err instanceof Error ? err.message : String(err),
        })
        throw err
      }
    },
  }
}

/**
 * A stand-in for the automated tests only (OWN_PAPER_AI=fake, ignored in a production runtime). Every
 * question is found; a multiple-choice answer reads as the key's option, a written answer gets full marks.
 */
// counted across requests, so the browser tests see student 1, 2, 3 in turn
let fakeCalls = 0

export function createFakeMarkingAi(): MarkingAi {
  // FAKE_MARKING=mixed (browser tests): student 1 is marked cleanly with one writing-habit loss, student 2's
  // three passes disagree on the written answer, student 3 chooses a wrong option. Three calls per student.
  const mixed = process.env.FAKE_MARKING === 'mixed'
  return {
    available: () => true,
    markPass: ({ questions }) => {
      const call = fakeCalls++
      const student = Math.floor(call / PASSES) % 3
      const pass = call % PASSES
      return Promise.resolve(
        JSON.stringify({
          answers: questions.map((q) => {
            const choice = isChoiceQuestion(q) ? mcqKeyLabel(q) : null
            const wrong = mixed && student === 2 && choice !== null
            const full = q.marks
            const marks = !mixed
              ? full
              : student === 0
                ? Math.max(0, full - 1)
                : student === 1
                  ? Math.max(0, full - pass)
                  : full
            return {
              question: q.no,
              found: true,
              answer_text: choice
                ? `Option ${choice}`
                : 'Tenths are bigger than hundredths',
              choice: wrong ? (choice === 'A' ? 'C' : 'A') : choice,
              marks,
              steps: [],
              loss_kind: mixed && marks < full ? 'writing_habit' : 'none',
              loss_reason:
                mixed && marks < full ? 'Stopped before writing the conclusion' : null,
              confidence: 0.9,
            }
          }),
        }),
      )
    },
  }
}

export async function markingAiFor(
  db: Db,
  scope: SchoolScope,
): Promise<MarkingAi> {
  if (process.env.OWN_PAPER_AI === 'fake' && !isProductionRuntime())
    return createFakeMarkingAi()
  const s = await db
    .selectFrom('schools')
    .select('household_id')
    .where('id', '=', scope.schoolId)
    .executeTakeFirstOrThrow()
  return createMarkingAi(db, {
    schoolId: scope.schoolId,
    householdId: s.household_id,
  })
}

// ---------------------------------------------------------------- the pictures sent to the AI

/**
 * The top strip of a page is where a pupil writes her name; the AI marking an answer never needs it. It is
 * painted white on the FIRST page, the same strip the name check reads (12 % of the height). The picture
 * is turned upright and shrunk to at most 1400 px wide.
 */
export async function pageForMarking(
  bytes: Buffer,
  firstPage: boolean,
): Promise<MarkingPage> {
  const oriented = await sharp(bytes).rotate().toBuffer()
  const meta = await sharp(oriented).metadata()
  const w = meta.width
  const h = meta.height
  let img = sharp(oriented)
  if (firstPage) {
    const stripH = Math.max(1, Math.round(h * 0.12))
    img = sharp(oriented).composite([
      {
        input: {
          create: {
            width: w,
            height: stripH,
            channels: 3,
            background: '#ffffff',
          },
        },
        top: 0,
        left: 0,
      },
    ])
  }
  const out = await img
    .resize({ width: 1400, withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toBuffer()
  return { mediaType: 'image/jpeg', base64: out.toString('base64') }
}

async function studentPages(
  db: Db,
  scope: SchoolScope,
  paperId: string,
  studentId: string,
) {
  return db
    .selectFrom('school_own_sheets')
    .select([
      'id',
      'seq',
      'kind',
      'status',
      'check_state',
      'image_key',
      'original_key',
      'purged_at',
    ])
    .where('school_id', '=', scope.schoolId)
    .where('paper_id', '=', paperId)
    .where('school_student_id', '=', studentId)
    .where('status', '=', 'placed')
    .where('kind', '=', 'page')
    .orderBy('seq')
    .orderBy('created_at')
    .execute()
}

/** The pictures of a student's usable pages, ready to send; null when a file is missing. */
export async function loadMarkingPages(
  db: Db,
  scope: SchoolScope,
  paperId: string,
  studentId: string,
): Promise<Array<MarkingPage> | null> {
  const sheets = await studentPages(db, scope, paperId, studentId)
  const usable = sheets.filter(
    (s) =>
      s.check_state !== 'refused' &&
      s.purged_at === null &&
      (s.image_key !== null || s.original_key !== null),
  )
  if (usable.length === 0) return null
  const store = getScanStore()
  const pages: Array<MarkingPage> = []
  for (const [i, s] of usable.entries()) {
    const sealed = await store.get((s.image_key ?? s.original_key) as string)
    if (!sealed) return null
    pages.push(await pageForMarking(decryptScan(sealed), i === 0))
  }
  return pages
}

/** Refuses once the student's section has had these results released (marks are then fixed). */
export async function assertNotReleased(
  db: Db,
  scope: SchoolScope,
  paperId: string,
  studentId: string,
): Promise<void> {
  const released = await db
    .selectFrom('school_paper_releases as r')
    .innerJoin('school_students as s', 's.section_id', 'r.section_id')
    .select('r.id')
    .where('r.school_id', '=', scope.schoolId)
    .where('r.paper_id', '=', paperId)
    .where('s.id', '=', studentId)
    .executeTakeFirst()
  if (released) throw new SchoolError('conflict', RELEASED_SAY)
}

// ---------------------------------------------------------------- marking one student

const MARKED_BY = new Set(['school_admin', 'teacher'])

export interface MarkResult {
  status: 'marked' | 'needs_teacher' | 'rejected'
  message: string | null
  totalMarks: number | null
  maxMarks: number | null
  flagged: number
}

export async function markingQuestions(
  db: Db,
  scope: SchoolScope,
  paperId: string,
): Promise<Array<MarkQuestion>> {
  const rows = await schoolOwnQuestionsRepository.forPaper(db, scope, paperId)
  return rows
    .filter((q) => q.removed_at === null)
    .sort((a, b) => a.position - b.position)
    .map((q, i) => ({
      id: q.id,
      no: String(i + 1),
      text: q.text,
      marks: Number(q.marks),
      type: q.type,
      options: q.options as Array<{ label: string; text: string }>,
      keyText: q.key_text ?? '',
      keySteps: (
        q.key_steps as Array<{ description: string; marks: number }>
      ).map((s) => ({ description: s.description, marks: Number(s.marks) })),
      orGroup: q.or_group,
    }))
}

async function finishRow(
  db: Db,
  scope: SchoolScope,
  paperId: string,
  studentId: string,
  patch: {
    status: MarkResult['status']
    message: string | null
    total: number | null
    max: number | null
  },
) {
  const existing = await schoolSheetMarkingRepository.forStudent(
    db,
    scope,
    paperId,
    studentId,
  )
  const row = {
    status: patch.status,
    message: patch.message,
    total_marks: patch.total === null ? null : String(patch.total),
    max_marks: patch.max === null ? null : String(patch.max),
    finished_at: new Date(),
  }
  if (existing)
    await schoolSheetMarkingRepository.update(db, scope, existing.id, row)
}

/**
 * Marks one student's pages. Safe to run again after a re-upload: the earlier AI marks are replaced and the
 * replacement is logged. Never throws for a problem with the pages (that is a "rejected" result with a plain
 * reason); throws for a paper that is not ready, a student outside the teacher's classes, or no permission.
 */
export async function markStudentSheets(
  db: Db,
  scope: SchoolScope,
  paperId: string,
  studentId: string,
  aiOverride?: MarkingAi,
): Promise<MarkResult> {
  if (!MARKED_BY.has(scope.role))
    throw new SchoolError(
      'forbidden',
      'Only the school office and teachers can mark answer sheets.',
    )
  const paper = await loadOwnPaper(db, scope, paperId)
  await assertPaperReadyForMarking(db, scope, paperId)
  await studentOfPaper(db, scope, paperId, studentId)
  await assertNotReleased(db, scope, paperId, studentId)

  const sheets = await studentPages(db, scope, paperId, studentId)
  const usable = sheets.filter(
    (s) =>
      s.check_state !== 'refused' &&
      s.purged_at === null &&
      (s.image_key !== null || s.original_key !== null),
  )
  const waiting = usable.filter(
    (s) => s.check_state === 'needs_confirm' || s.check_state === 'pending',
  )
  if (usable.length === 0)
    throw new SchoolError(
      'conflict',
      'This student has no pages to mark yet. Upload her answer sheets first.',
    )
  if (waiting.length > 0)
    throw new SchoolError(
      'conflict',
      `${waiting.length} page${waiting.length === 1 ? ' is' : 's are'} still waiting for your yes (is it the right student?). Settle ${waiting.length === 1 ? 'it' : 'them'} first.`,
    )

  const ai = aiOverride ?? (await markingAiFor(db, scope))
  const questions = await markingQuestions(db, scope, paperId)

  const state = await schoolSheetMarkingRepository.forStudent(
    db,
    scope,
    paperId,
    studentId,
  )
  let markingId: string
  if (state) {
    markingId = state.id
    await schoolSheetMarkingRepository.update(db, scope, state.id, {
      status: 'checking',
      message: null,
      total_marks: null,
      max_marks: null,
      finished_at: null,
      started_at: new Date(),
    })
  } else
    markingId = (
      await schoolSheetMarkingRepository.insert(db, scope, {
        paper_id: paperId,
        school_student_id: studentId,
        status: 'checking',
      })
    ).id

  const reject = async (message: string): Promise<MarkResult> => {
    await finishRow(db, scope, paperId, studentId, {
      status: 'rejected',
      message,
      total: null,
      max: null,
    })
    return {
      status: 'rejected',
      message,
      totalMarks: null,
      maxMarks: null,
      flagged: 0,
    }
  }
  if (!ai.available())
    return reject(
      'The AI marking is not set up on this server, so nothing was marked.',
    )

  try {
    const store = getScanStore()
    const pages: Array<MarkingPage> = []
    for (const [i, s] of usable.entries()) {
      const sealed = await store.get((s.image_key ?? s.original_key) as string)
      if (!sealed) return reject('A page picture could not be found. Please upload it again.')
      pages.push(await pageForMarking(decryptScan(sealed), i === 0))
    }

    const passes: Array<ReturnType<typeof parsePass>> = []
    for (let i = 0; i < PASSES; i++)
      passes.push(
        parsePass(
          await ai.markPass({
            pages,
            subject: paper.subject.name,
            grade: paper.grade,
            questions,
          }),
        ),
      )

    const combined = new Map<string, CombinedAnswer>()
    for (const q of questions) {
      const per: Array<PassAnswer | undefined> = passes.map((p) =>
        p?.answers.find((a) => a.question.trim() === q.no),
      )
      combined.set(q.id, combinePasses(q, per))
    }

    const before = await schoolAnswerMarksRepository.forStudent(
      db,
      scope,
      paperId,
      studentId,
    )
    const final = new Map(
      [...combined.values()].map((c) => [c.questionId, c.finalMarks]),
    )
    const { total, max } = totalsOf(questions, final)
    const flagged = [...combined.values()].filter((c) => c.flagged).length

    await db.transaction().execute(async (trx) => {
      for (const c of combined.values()) {
        const row = {
          found: c.found,
          answer_text: c.answerText,
          runs: JSON.stringify(c.runs),
          ai_marks: String(c.aiMarks),
          final_marks: String(c.finalMarks),
          max_marks: String(c.maxMarks),
          state: c.flagged ? ('flagged' as const) : ('ai_final' as const),
          flag_reason: c.flagReason,
          loss_kind: c.lossKind,
          loss_reason: c.lossReason,
          changed_by_user_id: null,
          changed_at: null,
        }
        const old = before.find((b) => b.own_question_id === c.questionId)
        if (old)
          await schoolAnswerMarksRepository.update(trx, scope, old.id, row)
        else
          await schoolAnswerMarksRepository.insert(trx, scope, {
            paper_id: paperId,
            school_student_id: studentId,
            own_question_id: c.questionId,
            ...row,
          })
      }
      if (before.length > 0)
        await auditSchool(
          trx,
          scope,
          'school.marking_rerun',
          'school_sheet_marking',
          markingId,
          {
            marks: before.map((b) => ({
              q: b.own_question_id,
              final: Number(b.final_marks),
              state: b.state,
            })),
          },
          { total, max, flagged },
        )
    })

    const status = flagged > 0 ? 'needs_teacher' : 'marked'
    await finishRow(db, scope, paperId, studentId, {
      status,
      message:
        flagged > 0
          ? `${flagged} answer${flagged === 1 ? '' : 's'} need${flagged === 1 ? 's' : ''} a teacher's look.`
          : null,
      total,
      max,
    })
    return {
      status,
      message: null,
      totalMarks: total,
      maxMarks: max,
      flagged,
    }
  } catch (err) {
    if (err instanceof SchoolError || err instanceof Error)
      return reject(
        `This student's sheets could not be marked just now (${err.message}). Please try again.`,
      )
    throw err
  }
}

// ---------------------------------------------------------------- the teacher decides

/**
 * A teacher (or the office) sets the mark of one answer. Any answer can be changed, flagged or not; the
 * change is logged with the old and new mark and the reason. When nothing is flagged any more the student
 * is "marked" and her total is worked out again.
 */
export async function setAnswerMark(
  db: Db,
  scope: SchoolScope,
  answerMarkId: string,
  marks: number,
  reason: string,
): Promise<{ finalMarks: number; studentStatus: string }> {
  if (!MARKED_BY.has(scope.role))
    throw new SchoolError(
      'forbidden',
      'Only the school office and teachers can change a mark.',
    )
  const row = await schoolAnswerMarksRepository.findById(db, scope, answerMarkId)
  if (!row) throw new SchoolError('not_found', 'That answer was not found.')
  await studentOfPaper(db, scope, row.paper_id, row.school_student_id)
  await assertNotReleased(db, scope, row.paper_id, row.school_student_id)
  const max = Number(row.max_marks)
  if (!Number.isFinite(marks) || marks < 0 || marks > max)
    throw new SchoolError('invalid', `Give a mark from 0 to ${max}.`)
  if (Math.round(marks * 2) !== marks * 2)
    throw new SchoolError('invalid', 'Marks go in steps of half a mark.')
  const note = reason.trim()
  if (!note) throw new SchoolError('invalid', 'Say why the mark is changed.')

  return db.transaction().execute(async (trx) => {
    await schoolAnswerMarksRepository.update(trx, scope, row.id, {
      final_marks: String(marks),
      state: 'teacher_set',
      changed_by_user_id: scope.userId,
      changed_at: new Date(),
    })
    await auditSchool(
      trx,
      scope,
      'school.mark_changed',
      'school_answer_marks',
      row.id,
      { final_marks: Number(row.final_marks), state: row.state },
      { final_marks: marks, state: 'teacher_set', reason: note },
    )
    const all = await schoolAnswerMarksRepository.forStudent(
      trx,
      scope,
      row.paper_id,
      row.school_student_id,
    )
    const questions = await markingQuestions(trx, scope, row.paper_id)
    const final = new Map(
      all.map((a) => [
        a.own_question_id,
        a.id === row.id ? marks : Number(a.final_marks),
      ]),
    )
    const { total, max: maxAll } = totalsOf(questions, final)
    const stillFlagged = all.some((a) => a.id !== row.id && a.state === 'flagged')
    const status = stillFlagged ? 'needs_teacher' : 'marked'
    const state = await schoolSheetMarkingRepository.forStudent(
      trx,
      scope,
      row.paper_id,
      row.school_student_id,
    )
    if (state)
      await schoolSheetMarkingRepository.update(trx, scope, state.id, {
        status,
        total_marks: String(total),
        max_marks: String(maxAll),
        message: stillFlagged ? state.message : null,
      })
    return { finalMarks: marks, studentStatus: status }
  })
}

// ---------------------------------------------------------------- what the teacher sees

export async function studentMarking(
  db: Db,
  scope: SchoolScope,
  paperId: string,
  studentId: string,
) {
  await studentOfPaper(db, scope, paperId, studentId)
  return studentMarkingUnchecked(db, scope, paperId, studentId)
}

/** Same, for a caller that has already checked the person may see this student (the student herself). */
export async function studentMarkingUnchecked(
  db: Db,
  scope: SchoolScope,
  paperId: string,
  studentId: string,
) {
  const state = await schoolSheetMarkingRepository.forStudent(
    db,
    scope,
    paperId,
    studentId,
  )
  const questions = await markingQuestions(db, scope, paperId)
  const marks = await schoolAnswerMarksRepository.forStudent(
    db,
    scope,
    paperId,
    studentId,
  )
  return {
    status: state?.status ?? 'not_started',
    message: state?.message ?? null,
    totalMarks: state?.total_marks === null || !state ? null : Number(state.total_marks),
    maxMarks: state?.max_marks === null || !state ? null : Number(state.max_marks),
    answers: questions.map((q) => {
      const m = marks.find((x) => x.own_question_id === q.id)
      return {
        questionNo: q.no,
        questionId: q.id,
        text: q.text,
        maxMarks: q.marks,
        answerMarkId: m?.id ?? null,
        found: m?.found ?? null,
        answerText: m?.answer_text ?? null,
        finalMarks: m ? Number(m.final_marks) : null,
        state: m?.state ?? null,
        flagReason: m?.flag_reason ?? null,
        lossKind: m?.loss_kind ?? null,
        lossReason: m?.loss_reason ?? null,
        keyText: q.keyText,
      }
    }),
  }
}

// ---------------------------------------------------------------- the class and the report

export type MarkingStatus =
  | 'not_uploaded'
  | 'ready'
  | 'checking'
  | 'marked'
  | 'needs_teacher'
  | 'rejected'

export interface StudentRow {
  schoolStudentId: string
  name: string
  rollNo: string
  section: string
  pages: number
  /** Where the sheets stand before marking (the page checks). */
  sheetState: string
  status: MarkingStatus
  message: string | null
  totalMarks: number | null
  maxMarks: number | null
  flagged: number
}

/**
 * Every student of the paper's classes with where her marking stands, and, from the marked ones, the class
 * summary. Students with no pages are "not uploaded"; they do not hold the results back.
 */
export async function markingOverview(
  db: Db,
  scope: SchoolScope,
  paperId: string,
) {
  const sheets = await ownSheetsSummary(db, scope, paperId)
  const paper = await loadOwnPaper(db, scope, paperId)
  const states = await schoolSheetMarkingRepository.listForPaper(
    db,
    scope,
    paperId,
  )
  const marks = await db
    .selectFrom('school_answer_marks')
    .select(['school_student_id', 'own_question_id', 'final_marks', 'max_marks', 'state', 'loss_kind'])
    .where('school_id', '=', scope.schoolId)
    .where('paper_id', '=', paperId)
    .execute()
  const questions = await markingQuestions(db, scope, paperId)

  const students: Array<StudentRow> = sheets.students.map((s) => {
    const st = states.find((x) => x.school_student_id === s.schoolStudentId)
    const status: MarkingStatus = st
      ? (st.status as MarkingStatus)
      : s.pages === 0
        ? 'not_uploaded'
        : 'ready'
    return {
      schoolStudentId: s.schoolStudentId,
      name: s.name,
      rollNo: s.rollNo,
      section: s.section,
      pages: s.pages,
      sheetState: s.state,
      status,
      message: st?.message ?? null,
      totalMarks: st?.total_marks == null ? null : Number(st.total_marks),
      maxMarks: st?.max_marks == null ? null : Number(st.max_marks),
      flagged: marks.filter(
        (m) => m.school_student_id === s.schoolStudentId && m.state === 'flagged',
      ).length,
    }
  })

  const marked = students.filter((s) => s.status === 'marked')
  const open = students.filter(
    (s) => s.status === 'checking' || s.status === 'needs_teacher' || s.status === 'ready',
  )
  const markedIds = new Set(marked.map((s) => s.schoolStudentId))
  const perQuestion = questions.map((q) => {
    const mine = marks.filter(
      (m) => m.own_question_id === q.id && markedIds.has(m.school_student_id),
    )
    const got = mine.reduce((n, m) => n + Number(m.final_marks), 0)
    return {
      questionNo: q.no,
      text: q.text,
      maxMarks: q.marks,
      averagePct:
        mine.length === 0 ? null : Math.round((got / (mine.length * q.marks)) * 100),
    }
  })
  const lost = (kind: string) =>
    marks
      .filter((m) => markedIds.has(m.school_student_id) && m.loss_kind === kind)
      .reduce((n, m) => n + (Number(m.max_marks) - Number(m.final_marks)), 0)
  const percents = marked
    .filter((s) => s.maxMarks)
    .map((s) => ((s.totalMarks ?? 0) / (s.maxMarks ?? 1)) * 100)
  return {
    paper: { title: paper.title, totalMarks: Number(paper.total_marks ?? 0) },
    students,
    resultsReady: marked.length > 0 && open.length === 0,
    class: {
      marked: marked.length,
      waiting: open.length,
      notUploaded: students.filter((s) => s.status === 'not_uploaded').length,
      averagePct:
        percents.length === 0
          ? null
          : Math.round(percents.reduce((a, b) => a + b, 0) / percents.length),
      highest: percents.length ? Math.round(Math.max(...percents)) : null,
      lowest: percents.length ? Math.round(Math.min(...percents)) : null,
      perQuestion,
      marksLostToKnowledge: lost('knowledge_gap'),
      marksLostToWriting: lost('writing_habit'),
    },
  }
}

/** One student's report: score, what she did well, what to fix, and her writing habits. */
export async function studentReport(
  db: Db,
  scope: SchoolScope,
  paperId: string,
  studentId: string,
) {
  return reportFrom(await studentMarking(db, scope, paperId, studentId))
}

export function reportFrom(
  v: Awaited<ReturnType<typeof studentMarkingUnchecked>>,
) {
  const scored = v.answers.filter((a) => a.finalMarks !== null)
  const lostOf = (a: (typeof scored)[number]) => a.maxMarks - (a.finalMarks ?? 0)
  const habits = new Map<string, number>()
  for (const a of scored)
    if (a.lossKind === 'writing_habit' && a.lossReason)
      habits.set(a.lossReason, (habits.get(a.lossReason) ?? 0) + lostOf(a))
  return {
    ...v,
    report: {
      strengths: scored
        .filter((a) => lostOf(a) === 0)
        .map((a) => ({ questionNo: a.questionNo, text: a.text })),
      toFix: scored
        .filter((a) => lostOf(a) > 0 && a.lossKind !== 'writing_habit')
        .sort((a, b) => lostOf(b) - lostOf(a))
        .map((a) => ({
          questionNo: a.questionNo,
          text: a.text,
          lost: lostOf(a),
          why: a.lossReason,
        })),
      writingHabits: [...habits.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([habit, lost]) => ({ habit, lost })),
      marksLostToKnowledge: scored
        .filter((a) => a.lossKind === 'knowledge_gap')
        .reduce((n, a) => n + lostOf(a), 0),
      marksLostToWriting: scored
        .filter((a) => a.lossKind === 'writing_habit')
        .reduce((n, a) => n + lostOf(a), 0),
    },
  }
}
