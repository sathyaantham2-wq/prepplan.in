import type { Kysely } from 'kysely'

// Where on the pupil's pages the AI found an answer: { page: 1-based, box: [left, top, right, bottom] as fractions 0..1, or
// null for the whole page }. NULL when the AI gave no usable place (never invented). Used by the teacher's side-by-side
// review screen (M4 additions plan, section 5). Local first; the owner runs it on production.
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('school_answer_marks').addColumn('location', 'jsonb').execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('school_answer_marks').dropColumn('location').execute()
}
