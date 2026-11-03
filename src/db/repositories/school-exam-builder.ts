import { sql } from 'kysely'
import type { Db } from '../connection'
import type { SchoolScope } from '../school-scope'

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
  /** Approved bank questions for a slot, in random order (the global bank; no school data). */
  async slotCandidates(
    db: Db,
    p: {
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
      .where('status', '=', 'approved')
      .where('concept_id', 'in', [...p.conceptIds])
      .where('marks', '=', p.marks)
      .where('bloom', 'in', [...p.blooms] as Array<never>)
    if (p.types.length) q = q.where('type', 'in', [...p.types] as Array<never>)
    if (p.exclude.length) q = q.where('id', 'not in', [...p.exclude])
    return q.orderBy(sql`random()`).limit(p.limit).execute()
  },
}
