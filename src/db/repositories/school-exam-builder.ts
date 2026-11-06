import { sql } from 'kysely'
import type { ExpressionBuilder } from 'kysely'
import type { DB } from '../types'
import type { Db } from '../connection'
import type { SchoolScope } from '../school-scope'
import { createSchoolScopedRepository } from './factory'

/**
 * The questions a school may put on its paper: the shared bank (approved), the schools-only bank (school_bank: never
 * served to PrepPlan's own students) and its own questions that are not retired. Another school's questions never match.
 */
export function usableBySchool(schoolId: string) {
  return (eb: ExpressionBuilder<DB, 'questions'>) =>
    eb.or([
      eb('questions.status', 'in', ['approved', 'school_bank']),
      eb.and([
        eb('questions.status', '=', 'school'),
        eb(
          'questions.id',
          'in',
          eb.selectFrom('school_questions').select('school_questions.question_id').where('school_questions.school_id', '=', schoolId).where('school_questions.retired_at', 'is', null),
        ),
      ]),
    ])
}

/** The append-only record of each finished version of a paper (exact questions as printed). */
export const schoolExamVersionsRepository = createSchoolScopedRepository('school_exam_versions')

/** The school's own questions (section 16.13): which `questions` rows (status 'school') belong to this school. */
export const schoolQuestionsRepository = {
  ...createSchoolScopedRepository('school_questions'),
  /** This school's record for a question, if the question is its own and not retired. */
  async activeByQuestion(db: Db, scope: SchoolScope, questionId: string) {
    return db
      .selectFrom('school_questions')
      .selectAll()
      .where('school_id', '=', scope.schoolId)
      .where('question_id', '=', questionId)
      .where('retired_at', 'is', null)
      .executeTakeFirst()
  },
}

/**
 * The reads of the paper builder that need raw SQL (docs/SCHOOLS_MODULE_PLAN.md section 16): which questions this school
 * printed before (from the append-only version records), and a random order for picking from the bank.
 */
export const examBuilderRepository = {
  /** Every earlier printing of these questions by this school, newest first (other papers only). */
  async usedBefore(db: Db, scope: SchoolScope, examId: string, questionIds: ReadonlyArray<string>) {
    if (questionIds.length === 0) return []
    const r = await sql<{ qid: string; title: string; section: string; at: Date }>`
      select x->>'question_id' as qid, e.title as title, x->>'section' as section, v.finalized_at as at
      from school_exam_versions v
      join school_exams e on e.id = v.exam_id and e.school_id = v.school_id
      cross join lateral jsonb_array_elements(v.questions) x
      where v.school_id = ${scope.schoolId} and v.exam_id <> ${examId}
        and (x->>'question_id') in (${sql.join([...questionIds])})
      order by v.finalized_at desc`.execute(db)
    return r.rows
  },
  /** Question ids this school printed in other papers since `since`. */
  async usedSince(db: Db, scope: SchoolScope, examId: string, since: Date) {
    const r = await sql<{ qid: string }>`
      select distinct x->>'question_id' as qid
      from school_exam_versions v cross join lateral jsonb_array_elements(v.questions) x
      where v.school_id = ${scope.schoolId} and v.exam_id <> ${examId} and v.finalized_at >= ${since}`.execute(db)
    return r.rows.map((x) => x.qid)
  },
  /**
   * When this school last used each question: printed in a finished version of another paper, or sitting in another
   * paper (a draft counts as used). Questions it never used are absent from the result.
   */
  async lastUsedAt(db: Db, scope: SchoolScope, examId: string, questionIds: ReadonlyArray<string>) {
    if (questionIds.length === 0) return new Map<string, Date>()
    const r = await sql<{ qid: string; at: Date }>`
      select qid, max(at) as at from (
        select x->>'question_id' as qid, v.finalized_at as at
        from school_exam_versions v cross join lateral jsonb_array_elements(v.questions) x
        where v.school_id = ${scope.schoolId} and v.exam_id <> ${examId}
        union all
        select p.question_id::text as qid, coalesce(e.edited_at, e.created_at) as at
        from school_exam_questions p join school_exams e on e.id = p.exam_id and e.school_id = p.school_id
        where p.school_id = ${scope.schoolId} and p.exam_id <> ${examId}
      ) used
      where qid in (${sql.join([...questionIds])})
      group by qid`.execute(db)
    return new Map(r.rows.map((x) => [x.qid, new Date(x.at)]))
  },
  /** Questions for a slot, in random order: the bank's approved ones and this school's own. */
  async slotCandidates(
    db: Db,
    p: {
      schoolId: string
      conceptIds: ReadonlyArray<string>
      marks: number
      blooms: ReadonlyArray<string>
      types: ReadonlyArray<string>
      exclude: ReadonlyArray<string>
      limit: number
    },
  ) {
    let q = db
      .selectFrom('questions')
      .select(['id', 'concept_id', 'type', 'marks', 'difficulty', 'bloom', 'tags', 'diagram_kind'])
      .where(usableBySchool(p.schoolId))
      .where('concept_id', 'in', [...p.conceptIds])
      .where('marks', '=', p.marks)
      .where('bloom', 'in', [...p.blooms] as Array<never>)
    if (p.types.length) q = q.where('type', 'in', [...p.types] as Array<never>)
    if (p.exclude.length) q = q.where('id', 'not in', [...p.exclude])
    return q.orderBy(sql`random()`).limit(p.limit).execute()
  },
}
