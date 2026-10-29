import { sql } from 'kysely'
import type { Db } from '../connection'

// The student's Fix-it Deck (see migration 0075). Every query is scoped by student_id. "Today" is
// always India time, computed in SQL so the app server's clock zone never matters.
const TODAY = sql`(now() at time zone 'Asia/Kolkata')::date`

// A question a card may show: approved, answer-key-deterministic, no figure, not a paper-only kind.
// Mirrors isObjectiveType in src/lib/scoring.ts.
const ELIGIBLE_QUESTION = sql`
  q.status = 'approved'
  and q.type in ('mcq', 'assertion_reason', 'match', 'multi_statement', 'fill_blank')
  and q.diagram_kind is null
  and not (q.tags && array['case_study', 'map', 'construction', 'figure']::text[])
  and (
    (q.type = 'fill_blank' and btrim(q.answer) <> '')
    or (q.type <> 'fill_blank' and exists (
      select 1 from question_options o where o.question_id = q.id and o.is_correct
    ))
  )`

export interface FixitCardRow {
  id: string
  concept_id: string
  concept_name: string
  subject_name: string
  cause: 'knowledge' | 'habit' | null
  stage: number
  due_on: string
  status: 'active' | 'mastered'
  served_question_id: string | null
  served_on: string | null
}

const CARD_COLUMNS = sql`
  c.id, c.concept_id, k.name as concept_name, s.name as subject_name, c.cause, c.stage::int as stage,
  to_char(c.due_on, 'YYYY-MM-DD') as due_on, c.status, c.served_question_id,
  to_char(c.served_on, 'YYYY-MM-DD') as served_on`
const CARD_JOINS = sql`
  from fixit_cards c
  join concepts k on k.id = c.concept_id
  join chapters ch on ch.id = k.chapter_id
  join subjects s on s.id = ch.subject_id`

export const fixitRepository = {
  async today(db: Db): Promise<string> {
    const r = await sql<{ d: string }>`select to_char(${TODAY}, 'YYYY-MM-DD') as d`.execute(db)
    return r.rows[0].d
  },

  /**
   * Creates the card, re-opens a mastered one (stage 0, due today), or leaves an active one alone.
   * One statement, so it is safe to call twice for the same lost mark.
   */
  async upsertForLostMark(
    db: Db,
    params: { studentId: string; conceptId: string; evaluationItemId: string | null; cause: 'knowledge' | 'habit' | null },
  ): Promise<void> {
    await sql`
      insert into fixit_cards (student_id, concept_id, source_evaluation_item_id, cause, stage, due_on, status)
      values (${params.studentId}, ${params.conceptId}, ${params.evaluationItemId}, ${params.cause}, 0, ${TODAY}, 'active')
      on conflict (student_id, concept_id) do update set
        stage = 0, due_on = ${TODAY}, status = 'active',
        source_evaluation_item_id = excluded.source_evaluation_item_id,
        cause = excluded.cause, served_question_id = null, served_on = null
      where fixit_cards.status = 'mastered'`.execute(db)
  },

  /** Savepoint around the card writes made inside confirmEvaluation's transaction. Needs a transaction. */
  async savepoint(db: Db, action: 'start' | 'release' | 'rollback'): Promise<void> {
    if (action === 'start') await sql`savepoint fixit_cards_sp`.execute(db)
    else if (action === 'release') await sql`release savepoint fixit_cards_sp`.execute(db)
    else await sql`rollback to savepoint fixit_cards_sp`.execute(db)
  },

  async findByConcept(db: Db, studentId: string, conceptId: string): Promise<FixitCardRow | null> {
    const r = await sql<FixitCardRow>`
      select ${CARD_COLUMNS} ${CARD_JOINS}
      where c.concept_id = ${conceptId} and c.student_id = ${studentId}`.execute(db)
    return r.rows[0] ?? null
  },

  async countAll(db: Db, studentId: string): Promise<number> {
    const r = await sql<{ n: string }>`select count(*)::text as n from fixit_cards where student_id = ${studentId}`.execute(db)
    return Number(r.rows[0].n)
  },

  async countMastered(db: Db, studentId: string): Promise<number> {
    const r = await sql<{ n: string }>`select count(*)::text as n from fixit_cards where student_id = ${studentId} and status = 'mastered'`.execute(db)
    return Number(r.rows[0].n)
  },

  async countAnsweredToday(db: Db, studentId: string): Promise<number> {
    const r = await sql<{ n: string }>`
      select count(*)::text as n from fixit_answers a join fixit_cards c on c.id = a.card_id
      where c.student_id = ${studentId} and (a.answered_at at time zone 'Asia/Kolkata')::date = ${TODAY}`.execute(db)
    return Number(r.rows[0].n)
  },

  /** Active cards due today or earlier that have at least one question she can be given. */
  async countDue(db: Db, studentId: string): Promise<number> {
    const r = await sql<{ n: string }>`
      select count(*)::text as n from fixit_cards c
      where c.student_id = ${studentId} and c.status = 'active' and c.due_on <= ${TODAY}
        and exists (select 1 from questions q where q.concept_id = c.concept_id and ${ELIGIBLE_QUESTION})`.execute(db)
    return Number(r.rows[0].n)
  },

  async listDue(db: Db, studentId: string, limit: number): Promise<Array<FixitCardRow>> {
    if (limit <= 0) return []
    const r = await sql<FixitCardRow>`
      select ${CARD_COLUMNS} ${CARD_JOINS}
      where c.student_id = ${studentId} and c.status = 'active' and c.due_on <= ${TODAY}
        and exists (select 1 from questions q where q.concept_id = c.concept_id and ${ELIGIBLE_QUESTION})
      order by c.due_on, c.created_at, c.id
      limit ${limit}`.execute(db)
    return r.rows
  },

  /** Own card only: the id alone is never enough. */
  async findOwn(db: Db, studentId: string, cardId: string): Promise<FixitCardRow | null> {
    const r = await sql<FixitCardRow>`
      select ${CARD_COLUMNS} ${CARD_JOINS}
      where c.id = ${cardId} and c.student_id = ${studentId}`.execute(db)
    return r.rows[0] ?? null
  },

  /**
   * The best question for a card: one she has not met (in a paper or in the deck) before one she
   * has, the longest-ago seen first. The tie-break is a hash of the card and day, so it is stable
   * within a day but not the same question every time.
   */
  async pickQuestion(db: Db, studentId: string, cardId: string, conceptId: string): Promise<string | null> {
    const r = await sql<{ id: string }>`
      select q.id from questions q
      left join lateral (
        select max(seen) as last_seen from (
          select aa.created_at as seen
            from attempt_answers aa
            join attempts at on at.id = aa.attempt_id
            join paper_questions pq on pq.id = aa.paper_question_id
            where at.student_id = ${studentId} and pq.question_id = q.id
          union all
          select fa.answered_at as seen
            from fixit_answers fa join fixit_cards fc on fc.id = fa.card_id
            where fc.student_id = ${studentId} and fa.question_id = q.id
        ) s
      ) ls on true
      where q.concept_id = ${conceptId} and ${ELIGIBLE_QUESTION}
      order by ls.last_seen asc nulls first, md5(${cardId}::text || q.id::text || ${TODAY}::text)
      limit 1`.execute(db)
    return r.rows[0]?.id ?? null
  },

  async setServed(db: Db, studentId: string, cardId: string, questionId: string): Promise<void> {
    await sql`
      update fixit_cards set served_question_id = ${questionId}, served_on = ${TODAY}
      where id = ${cardId} and student_id = ${studentId}`.execute(db)
  },

  async applyAnswer(
    db: Db,
    params: { studentId: string; cardId: string; questionId: string; correct: boolean; stage: number; dueOn: string; status: 'active' | 'mastered' },
  ): Promise<void> {
    await sql`
      update fixit_cards set stage = ${params.stage}, due_on = ${params.dueOn}::date, status = ${params.status},
        last_answered_at = now(), served_question_id = null, served_on = null
      where id = ${params.cardId} and student_id = ${params.studentId}`.execute(db)
    await sql`
      insert into fixit_answers (card_id, question_id, correct) values (${params.cardId}, ${params.questionId}, ${params.correct})`.execute(db)
  },

  /** Confirmed, non-removed items of the last 30 days that lost marks, newest first, one per concept. */
  async recentLostItems(db: Db, studentId: string, limit: number) {
    const r = await sql<{ evaluation_item_id: string; concept_id: string; knowledge_known: boolean | null; error_type: string | null }>`
      select evaluation_item_id, concept_id, knowledge_known, error_type from (
        select distinct on (q.concept_id) ei.id as evaluation_item_id, q.concept_id, ei.knowledge_known,
               ei.error_type, e.confirmed_at
        from evaluation_items ei
        join evaluations e on e.id = ei.evaluation_id
        join attempts at on at.id = e.attempt_id
        join paper_questions pq on pq.id = ei.paper_question_id
        join questions q on q.id = pq.question_id
        where at.student_id = ${studentId} and e.confirmed_at is not null
          and e.confirmed_at >= now() - interval '30 days'
          and not ei.excluded_by_student and ei.marks_awarded < ei.marks_max
        order by q.concept_id, e.confirmed_at desc
      ) latest
      order by confirmed_at desc, evaluation_item_id
      limit ${limit}`.execute(db)
    return r.rows
  },
}
