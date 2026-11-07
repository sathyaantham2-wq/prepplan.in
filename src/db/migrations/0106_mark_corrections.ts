import type { Kysely } from 'kysely'
import { sql } from 'kysely'

// Quality loop phase 1b (docs/QUALITY_LOOP_PLAN.md): when the owner fixes a wrong answer key, every confirmed mark
// that was scored against the wrong key is re-scored. Evaluations and the concept ledger are append-only, so the
// change itself is recorded here, one row per corrected mark: the old and new mark side by side, never overwritten.
// `seen_at` is when the student opened the notice (she is told on her own result page that the key was fixed and what
// her mark became). A correction can raise a mark or lower it; both are recorded the same way.
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('mark_corrections')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('quality_case_id', 'uuid', (col) => col.notNull().references('question_quality_cases.id').onDelete('restrict'))
    .addColumn('evaluation_item_id', 'uuid', (col) => col.notNull().references('evaluation_items.id').onDelete('restrict'))
    .addColumn('evaluation_id', 'uuid', (col) => col.notNull().references('evaluations.id').onDelete('restrict'))
    .addColumn('student_id', 'uuid', (col) => col.notNull().references('students.id').onDelete('restrict'))
    // the question the student saw (now retired) and the corrected copy
    .addColumn('old_question_id', 'uuid', (col) => col.notNull().references('questions.id').onDelete('restrict'))
    .addColumn('new_question_id', 'uuid', (col) => col.notNull().references('questions.id').onDelete('restrict'))
    .addColumn('old_marks', 'numeric(6, 2)', (col) => col.notNull())
    .addColumn('new_marks', 'numeric(6, 2)', (col) => col.notNull())
    .addColumn('marks_max', 'numeric(6, 2)', (col) => col.notNull())
    .addColumn('old_error_type', 'text')
    .addColumn('new_error_type', 'text')
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('seen_at', 'timestamptz')
    .execute()
  // one correction per mark per case: re-running a fix can never score the same answer twice
  await sql`create unique index mark_corrections_once on mark_corrections (quality_case_id, evaluation_item_id)`.execute(db)
  await sql`create index mark_corrections_student on mark_corrections (student_id, created_at desc)`.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('mark_corrections').execute()
}
