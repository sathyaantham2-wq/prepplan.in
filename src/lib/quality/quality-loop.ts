// The question-bank quality loop, part 3: the database side (docs/QUALITY_LOOP_PLAN.md).
//
// refreshQualityLoop -- recomputes question_stats from scratch and opens or updates review cases.
// listQualityCases   -- the owner's queue, de-identified: question-level evidence only, never a student's name or
//                       household. Report comments are shown because they are about the question.
// decideQualityCase  -- applies a person's decision. Nothing is deleted: a wrong key is fixed by retiring the
//                       question and creating a corrected copy, so every past paper and mark still points at
//                       exactly what the student saw. Every decision is written to audit_log.
//
// School students are left out everywhere: their answers serve their school only (CLAUDE.md, school module rules).

import type { Db } from '../../db/connection'
import type { DifficultyTier, QuestionType } from '../../db/enums'
import { computeQuestionStats } from './stats'
import { remarkAfterKeyFix } from './remark'
import type { AnswerObservation, QuestionStatRow } from './stats'
import { caseSeverity, detectSignals, hasNewEvidence } from './detectors'
import type { ReportCount, Signal } from './detectors'

const OBJECTIVE: ReadonlyArray<QuestionType> = ['mcq', 'assertion_reason', 'match', 'multi_statement', 'fill_blank']
const OPTION_TYPES: ReadonlyArray<QuestionType> = ['mcq', 'assertion_reason', 'match', 'multi_statement']

// The owner's queue shows this many at a time, most severe first, so a week's review stays small.
export const QUEUE_PAGE_SIZE = 15

export async function loadAnswerObservations(db: Db): Promise<Array<AnswerObservation>> {
  const rows = await db
    .selectFrom('evaluation_items as ei')
    .innerJoin('evaluations as e', 'e.id', 'ei.evaluation_id')
    .innerJoin('attempts as a', 'a.id', 'e.attempt_id')
    .innerJoin('students as s', 's.id', 'a.student_id')
    .innerJoin('paper_questions as pq', 'pq.id', 'ei.paper_question_id')
    .innerJoin('questions as q', 'q.id', 'pq.question_id')
    .innerJoin('concepts as c', 'c.id', 'q.concept_id')
    .innerJoin('chapters as ch', 'ch.id', 'c.chapter_id')
    .leftJoin('attempt_answers as aa', (join) =>
      join.onRef('aa.attempt_id', '=', 'a.id').onRef('aa.paper_question_id', '=', 'pq.id'),
    )
    .select([
      'q.id as question_id',
      'a.student_id',
      'a.submitted_at',
      'ei.marks_awarded',
      'ei.marks_max',
      'aa.selected_option',
      'aa.response_text',
      'aa.time_spent_sec',
      'q.difficulty',
      'ch.subject_id',
    ])
    .where('s.school_id', 'is', null)
    .where('a.submitted_at', 'is not', null)
    .where('q.status', '=', 'approved')
    .where('q.type', 'in', OBJECTIVE)
    .where('ei.excluded_by_student', '=', false)
    // the latest evaluation of each attempt only (evaluations are append-only)
    .where('e.id', '=', (eb) =>
      eb
        .selectFrom('evaluations as e2')
        .select('e2.id')
        .whereRef('e2.attempt_id', '=', 'a.id')
        .orderBy('e2.created_at', 'desc')
        .limit(1),
    )
    .execute()

  return rows.map((r) => {
    const option = r.selected_option?.trim() || null
    const text = r.response_text?.trim() || ''
    return {
      questionId: r.question_id,
      studentId: r.student_id,
      answeredAt: new Date(r.submitted_at as unknown as string),
      correct: Number(r.marks_awarded) >= Number(r.marks_max),
      blank: !option && !text,
      option,
      timeSec: r.time_spent_sec ?? null,
      cellKey: `${r.subject_id}|${r.difficulty}`,
    }
  })
}

async function writeStats(db: Db, stats: ReadonlyArray<QuestionStatRow>): Promise<void> {
  await db.transaction().execute(async (trx) => {
    // a derived cache, rebuilt whole each time
    await trx.deleteFrom('question_stats').execute()
    for (let i = 0; i < stats.length; i += 500) {
      await trx
        .insertInto('question_stats')
        .values(
          stats.slice(i, i + 500).map((s) => ({
            question_id: s.questionId,
            first_exposures: s.firstExposures,
            first_correct: s.firstCorrect,
            blank: s.blank,
            option_counts: JSON.stringify(s.optionCounts),
            strong_option_counts: JSON.stringify(s.strongOptionCounts),
            median_time_sec: s.medianTimeSec,
            shrunk_correct_rate: s.shrunkCorrectRate.toFixed(4),
            cell_correct_rate: s.cellCorrectRate.toFixed(4),
          })),
        )
        .execute()
    }
  })
}

export interface RefreshSummary {
  answersUsed: number
  questionsWithStats: number
  casesOpened: number
  casesUpdated: number
}

export async function refreshQualityLoop(db: Db): Promise<RefreshSummary> {
  const observations = await loadAnswerObservations(db)
  const stats = computeQuestionStats(observations)
  await writeStats(db, stats)
  const statById = new Map(stats.map((s) => [s.questionId, s]))

  const reportRows = await db
    .selectFrom('question_reports')
    .select((eb) => ['question_id', 'reason', eb.fn.countAll<string>().as('count')])
    .where('status', '=', 'open')
    .groupBy(['question_id', 'reason'])
    .execute()
  const reportsById = new Map<string, Array<ReportCount>>()
  for (const r of reportRows) {
    const list = reportsById.get(r.question_id) ?? []
    list.push({ reason: r.reason, count: Number(r.count) })
    reportsById.set(r.question_id, list)
  }

  const candidateIds = [...new Set([...statById.keys(), ...reportsById.keys()])]
  if (candidateIds.length === 0) {
    return { answersUsed: observations.length, questionsWithStats: 0, casesOpened: 0, casesUpdated: 0 }
  }

  const questions = await db
    .selectFrom('questions')
    .select(['id', 'difficulty', 'type', 'status'])
    .where('id', 'in', candidateIds)
    .execute()
  const keys = await db
    .selectFrom('question_options')
    .select(['question_id', 'label'])
    .where('question_id', 'in', candidateIds)
    .where('is_correct', '=', true)
    .orderBy('order_index')
    .execute()
  const keyById = new Map<string, string>()
  for (const k of keys) if (!keyById.has(k.question_id)) keyById.set(k.question_id, k.label)

  const existing = await db
    .selectFrom('question_quality_cases')
    .select(['id', 'question_id', 'status', 'signals', 'created_at'])
    .where('question_id', 'in', candidateIds)
    .orderBy('created_at', 'desc')
    .execute()
  const openCase = new Map<string, (typeof existing)[number]>()
  const lastClosed = new Map<string, (typeof existing)[number]>()
  for (const c of existing) {
    if (c.status === 'open') openCase.set(c.question_id, c)
    else if (!lastClosed.has(c.question_id)) lastClosed.set(c.question_id, c)
  }

  let casesOpened = 0
  let casesUpdated = 0
  for (const q of questions) {
    if (q.status !== 'approved') continue
    const stat = statById.get(q.id) ?? null
    const signals = detectSignals({
      stat,
      difficulty: q.difficulty,
      correctLabel: OPTION_TYPES.includes(q.type) ? (keyById.get(q.id) ?? null) : null,
      openReports: reportsById.get(q.id) ?? [],
    })
    if (signals.length === 0) continue
    const statsJson = stat ? JSON.stringify(stat) : null

    const open = openCase.get(q.id)
    if (open) {
      if (JSON.stringify(open.signals) !== JSON.stringify(signals)) {
        await db
          .updateTable('question_quality_cases')
          .set({ signals: JSON.stringify(signals), severity: caseSeverity(signals), stats: statsJson, updated_at: new Date() })
          .where('id', '=', open.id)
          .execute()
        casesUpdated += 1
      }
      continue
    }
    const closed = lastClosed.get(q.id)
    if (closed && !hasNewEvidence(signals, closed.signals as unknown as Array<Signal>)) continue
    await db
      .insertInto('question_quality_cases')
      .values({ question_id: q.id, severity: caseSeverity(signals), signals: JSON.stringify(signals), stats: statsJson })
      .execute()
    casesOpened += 1
  }

  return { answersUsed: observations.length, questionsWithStats: stats.length, casesOpened, casesUpdated }
}

export interface QualityCaseView {
  id: string
  status: string
  severity: number
  signals: Array<Signal>
  stats: QuestionStatRow | null
  decision: string | null
  decisionNote: string | null
  decidedAt: Date | null
  createdAt: Date
  question: {
    id: string
    text: string
    type: string
    answer: string
    difficulty: string
    bloom: string
    marks: number
    status: string
    subject: string
    classLevel: number
    chapter: string
    concept: string
    options: Array<{ label: string; text: string; isCorrect: boolean }>
  }
  // de-identified: what students wrote about the question, never who
  reports: Array<{ reason: string; comment: string; createdAt: Date }>
  // approved questions left in the same concept x Bloom x difficulty cell if this one is retired
  cellApprovedCount: number
  // how many marked answers used this question (what a key fix would affect)
  markedAnswers: number
  schoolExamUses: number
}

export async function listQualityCases(
  db: Db,
  status: 'open' | 'decided' | 'dismissed',
  limit: number = QUEUE_PAGE_SIZE,
): Promise<{ total: number; cases: Array<QualityCaseView> }> {
  const totalRow = await db
    .selectFrom('question_quality_cases')
    .select((eb) => eb.fn.countAll<string>().as('n'))
    .where('status', '=', status)
    .executeTakeFirstOrThrow()

  const rows = await db
    .selectFrom('question_quality_cases as qc')
    .innerJoin('questions as q', 'q.id', 'qc.question_id')
    .innerJoin('concepts as c', 'c.id', 'q.concept_id')
    .innerJoin('chapters as ch', 'ch.id', 'c.chapter_id')
    .innerJoin('subjects as s', 's.id', 'ch.subject_id')
    .select([
      'qc.id',
      'qc.status',
      'qc.severity',
      'qc.signals',
      'qc.stats',
      'qc.decision',
      'qc.decision_note',
      'qc.decided_at',
      'qc.created_at',
      'q.id as question_id',
      'q.text',
      'q.type',
      'q.answer',
      'q.difficulty',
      'q.bloom',
      'q.marks',
      'q.status as question_status',
      'q.concept_id',
      's.code as subject_code',
      'q.class',
      'ch.part',
      'ch.chapter_no',
      'ch.name as chapter_title',
      'c.code as concept_code',
      'c.name as concept_name',
    ])
    .where('qc.status', '=', status)
    .orderBy(status === 'open' ? 'qc.severity' : 'qc.decided_at', 'desc')
    .orderBy('qc.created_at', 'asc')
    .limit(limit)
    .execute()
  if (rows.length === 0) return { total: Number(totalRow.n), cases: [] }

  const questionIds = rows.map((r) => r.question_id)
  const [options, reports, marked, schoolUses] = await Promise.all([
    db
      .selectFrom('question_options')
      .select(['question_id', 'label', 'text', 'is_correct'])
      .where('question_id', 'in', questionIds)
      .orderBy('order_index')
      .execute(),
    db
      .selectFrom('question_reports')
      .select(['question_id', 'reason', 'comment', 'created_at'])
      .where('question_id', 'in', questionIds)
      .where('status', '=', 'open')
      .orderBy('created_at', 'desc')
      .execute(),
    db
      .selectFrom('evaluation_items as ei')
      .innerJoin('paper_questions as pq', 'pq.id', 'ei.paper_question_id')
      .select((eb) => ['pq.question_id', eb.fn.countAll<string>().as('n')])
      .where('pq.question_id', 'in', questionIds)
      .groupBy('pq.question_id')
      .execute(),
    db
      .selectFrom('school_exam_questions')
      .select((eb) => ['question_id', eb.fn.countAll<string>().as('n')])
      .where('question_id', 'in', questionIds)
      .groupBy('question_id')
      .execute(),
  ])

  const cells = await Promise.all(
    rows.map((r) =>
      db
        .selectFrom('questions')
        .select((eb) => eb.fn.countAll<string>().as('n'))
        .where('concept_id', '=', r.concept_id)
        .where('bloom', '=', r.bloom)
        .where('difficulty', '=', r.difficulty)
        .where('status', '=', 'approved')
        .executeTakeFirstOrThrow(),
    ),
  )

  const markedById = new Map(marked.map((m) => [m.question_id, Number(m.n)]))
  const schoolById = new Map(schoolUses.map((m) => [m.question_id, Number(m.n)]))
  return {
    total: Number(totalRow.n),
    cases: rows.map((r, i) => ({
      id: r.id,
      status: r.status,
      severity: r.severity,
      signals: r.signals as unknown as Array<Signal>,
      stats: (r.stats as unknown as QuestionStatRow | null) ?? null,
      decision: r.decision,
      decisionNote: r.decision_note,
      decidedAt: r.decided_at,
      createdAt: r.created_at,
      question: {
        id: r.question_id,
        text: r.text,
        type: r.type,
        answer: r.answer,
        difficulty: r.difficulty,
        bloom: r.bloom,
        marks: r.marks,
        status: r.question_status,
        subject: r.subject_code,
        classLevel: r.class,
        chapter: `Part ${r.part} ch ${r.chapter_no}: ${r.chapter_title}`,
        concept: `${r.concept_code} ${r.concept_name}`,
        options: options
          .filter((o) => o.question_id === r.question_id)
          .map((o) => ({ label: o.label, text: o.text, isCorrect: o.is_correct })),
      },
      reports: reports
        .filter((x) => x.question_id === r.question_id)
        .map((x) => ({ reason: x.reason, comment: x.comment, createdAt: x.created_at })),
      cellApprovedCount: Number(cells[i].n),
      markedAnswers: markedById.get(r.question_id) ?? 0,
      schoolExamUses: schoolById.get(r.question_id) ?? 0,
    })),
  }
}

export type QualityDecision =
  | { decision: 'dismiss'; note: string }
  | { decision: 'retire'; note: string }
  | { decision: 'retag'; note: string; difficulty: DifficultyTier }
  | { decision: 'fix_key'; note: string; correctLabel?: string; answerText?: string }

export type DecideError =
  | 'case_not_found'
  | 'case_closed'
  | 'question_not_approved'
  | 'same_difficulty'
  | 'fix_needs_label_or_answer'
  | 'unknown_option'
  | 'same_key'

export async function decideQualityCase(
  db: Db,
  input: { caseId: string; actor: { id: string; householdId: string } } & QualityDecision,
): Promise<{ ok: true; replacementQuestionId?: string } | { ok: false; error: DecideError }> {
  return db.transaction().execute(async (trx) => {
    const qc = await trx
      .selectFrom('question_quality_cases')
      .selectAll()
      .where('id', '=', input.caseId)
      .forUpdate()
      .executeTakeFirst()
    if (!qc) return { ok: false, error: 'case_not_found' } as const
    if (qc.status !== 'open') return { ok: false, error: 'case_closed' } as const

    const question = await trx.selectFrom('questions').selectAll().where('id', '=', qc.question_id).executeTakeFirstOrThrow()
    if (input.decision !== 'dismiss' && question.status !== 'approved') {
      return { ok: false, error: 'question_not_approved' } as const
    }

    let detail: Record<string, unknown> = {}
    let replacementQuestionId: string | undefined
    const before = { status: question.status, difficulty: question.difficulty, answer: question.answer }

    if (input.decision === 'retire') {
      await trx.updateTable('questions').set({ status: 'retired' }).where('id', '=', question.id).execute()
    }

    if (input.decision === 'retag') {
      if (input.difficulty === question.difficulty) return { ok: false, error: 'same_difficulty' } as const
      await trx.updateTable('questions').set({ difficulty: input.difficulty }).where('id', '=', question.id).execute()
      detail = { from: question.difficulty, to: input.difficulty }
    }

    if (input.decision === 'fix_key') {
      const options = await trx
        .selectFrom('question_options')
        .selectAll()
        .where('question_id', '=', question.id)
        .orderBy('order_index')
        .execute()
      const isOptionType = OPTION_TYPES.includes(question.type) && options.length > 0
      let newAnswer = question.answer
      if (isOptionType) {
        if (!input.correctLabel) return { ok: false, error: 'fix_needs_label_or_answer' } as const
        const chosen = options.find((o) => o.label === input.correctLabel)
        if (!chosen) return { ok: false, error: 'unknown_option' } as const
        if (chosen.is_correct) return { ok: false, error: 'same_key' } as const
        // the answer column carries the key's text for option types
        newAnswer = chosen.text
      } else {
        const text = input.answerText?.trim()
        if (!text) return { ok: false, error: 'fix_needs_label_or_answer' } as const
        if (text === question.answer.trim()) return { ok: false, error: 'same_key' } as const
        newAnswer = text
      }

      // Nothing is edited in place: the old question is retired (every past paper and mark still points at what the
      // student saw) and a corrected copy takes its place in the pool.
      const { id: _id, created_at: _created, ...copy } = question
      const created = await trx
        .insertInto('questions')
        .values({ ...copy, answer: newAnswer, status: 'approved', origin: 'manual' })
        .returning('id')
        .executeTakeFirstOrThrow()
      replacementQuestionId = created.id
      if (options.length > 0) {
        await trx
          .insertInto('question_options')
          .values(
            options.map((o) => ({
              question_id: created.id,
              label: o.label,
              text: o.text,
              order_index: o.order_index,
              is_correct: isOptionType ? o.label === input.correctLabel : o.is_correct,
            })),
          )
          .execute()
      }
      const steps = await trx.selectFrom('question_step_marks').selectAll().where('question_id', '=', question.id).execute()
      if (steps.length > 0) {
        await trx
          .insertInto('question_step_marks')
          .values(steps.map((s) => ({ question_id: created.id, step_no: s.step_no, description: s.description, marks: s.marks })))
          .execute()
      }
      await trx.updateTable('questions').set({ status: 'retired' }).where('id', '=', question.id).execute()

      const marked = await trx
        .selectFrom('evaluation_items as ei')
        .innerJoin('paper_questions as pq', 'pq.id', 'ei.paper_question_id')
        .select((eb) => eb.fn.countAll<string>().as('n'))
        .where('pq.question_id', '=', question.id)
        .executeTakeFirstOrThrow()
      detail = {
        replacement_question_id: created.id,
        old_answer: question.answer,
        new_answer: newAnswer,
        old_key_label: options.find((o) => o.is_correct)?.label ?? null,
        new_key_label: isOptionType ? input.correctLabel : null,
        // every past mark that used the wrong key, and what re-scoring did to it (phase 1b)
        marked_answers_affected: Number(marked.n),
        remark: await remarkAfterKeyFix(trx, { caseId: qc.id, oldQuestionId: question.id, newQuestionId: created.id }),
      }
    }

    const closedStatus = input.decision === 'dismiss' ? 'dismissed' : 'decided'
    await trx
      .updateTable('question_quality_cases')
      .set({
        status: closedStatus,
        decision: input.decision,
        decision_note: input.note.trim() || null,
        decision_detail: JSON.stringify(detail),
        decided_by_user_id: input.actor.id,
        decided_at: new Date(),
        updated_at: new Date(),
      })
      .where('id', '=', qc.id)
      .execute()

    // the student reports behind this case are answered by the same decision
    await trx
      .updateTable('question_reports')
      .set({ status: input.decision === 'dismiss' ? 'dismissed' : 'resolved', resolved_at: new Date() })
      .where('question_id', '=', question.id)
      .where('status', '=', 'open')
      .execute()

    await trx
      .insertInto('audit_log')
      .values({
        household_id: input.actor.householdId,
        actor_user_id: input.actor.id,
        entity: 'question',
        entity_id: question.id,
        action: `quality.${input.decision}`,
        before: JSON.stringify(before),
        after: JSON.stringify({ case_id: qc.id, note: input.note.trim() || null, ...detail }),
      })
      .execute()

    return { ok: true, replacementQuestionId } as const
  })
}
