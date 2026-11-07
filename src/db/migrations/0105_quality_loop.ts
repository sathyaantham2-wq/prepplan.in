import type { Kysely } from 'kysely'
import { sql } from 'kysely'

// The question-bank quality loop (docs/QUALITY_LOOP_PLAN.md). Three pieces:
//
// question_stats -- a derived cache, recomputed from scratch from attempt_answers + evaluation_items, one row per
//   bank question a PrepPlan student has answered. First exposure only (a student who meets a question again may
//   remember it), objective answers only (written answers are AI-marked, and judging a question by AI marks would
//   teach the loop the AI's own mistakes), and never a school student's answer (school data serves that school only).
//   Safe to drop and rebuild at any time; nothing else references it.
//
// question_quality_cases -- the owner's review queue. A detector opens a case with its evidence; a person decides.
//   Nothing here changes a question on its own. Rows are kept after a decision so the history stays auditable, and
//   at most one case per question is open at a time.
//
// evaluation_items.ai_model / ai_prompt_version -- which vendor model and which version of the marking prompt
//   proposed an AI mark, so a change of provider or prompt can be measured instead of guessed.
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('question_stats')
    .addColumn('question_id', 'uuid', (col) => col.primaryKey().references('questions.id').onDelete('restrict'))
    .addColumn('first_exposures', 'integer', (col) => col.notNull())
    .addColumn('first_correct', 'integer', (col) => col.notNull())
    .addColumn('blank', 'integer', (col) => col.notNull())
    // { "A": 3, "B": 1, ... } -- the option label each first-exposure answer picked
    .addColumn('option_counts', 'jsonb', (col) => col.notNull().defaultTo(sql`'{}'::jsonb`))
    // the same, but only from students whose overall first-exposure accuracy is high (see quality-stats.ts)
    .addColumn('strong_option_counts', 'jsonb', (col) => col.notNull().defaultTo(sql`'{}'::jsonb`))
    .addColumn('median_time_sec', 'integer')
    // correct rate pulled toward the average of its (subject, difficulty) cell, so two answers can't swing it
    .addColumn('shrunk_correct_rate', 'numeric(5, 4)')
    .addColumn('cell_correct_rate', 'numeric(5, 4)')
    .addColumn('computed_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .execute()

  await db.schema
    .createTable('question_quality_cases')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('question_id', 'uuid', (col) => col.notNull().references('questions.id').onDelete('restrict'))
    .addColumn('status', 'text', (col) =>
      col.notNull().defaultTo('open').check(sql`status in ('open', 'decided', 'dismissed')`),
    )
    // 1 = look when there is time, 2 = probably wrong, 3 = likely a wrong key or a broken question
    .addColumn('severity', 'integer', (col) => col.notNull().check(sql`severity between 1 and 3`))
    // [{ kind, severity, n, detail }] -- what each detector saw, kept as it was when the case opened or last grew
    .addColumn('signals', 'jsonb', (col) => col.notNull())
    .addColumn('stats', 'jsonb')
    // the independent AI re-check (phase 2); null until it has run
    .addColumn('ai_review', 'jsonb')
    .addColumn('decision', 'text', (col) => col.check(sql`decision in ('retire', 'fix_key', 'retag', 'dismiss')`))
    .addColumn('decision_note', 'text')
    // for fix_key: the replacement question; for retag: { from, to }
    .addColumn('decision_detail', 'jsonb')
    .addColumn('decided_by_user_id', 'uuid', (col) => col.references('users.id').onDelete('restrict'))
    .addColumn('decided_at', 'timestamptz')
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .execute()
  await sql`create unique index question_quality_cases_one_open on question_quality_cases (question_id) where status = 'open'`.execute(db)
  await sql`create index question_quality_cases_queue on question_quality_cases (status, severity desc, created_at)`.execute(db)

  await db.schema.alterTable('evaluation_items').addColumn('ai_model', 'text').execute()
  await db.schema.alterTable('evaluation_items').addColumn('ai_prompt_version', 'text').execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('evaluation_items').dropColumn('ai_prompt_version').execute()
  await db.schema.alterTable('evaluation_items').dropColumn('ai_model').execute()
  await db.schema.dropTable('question_quality_cases').execute()
  await db.schema.dropTable('question_stats').execute()
}
