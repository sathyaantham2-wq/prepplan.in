import type { Kysely } from 'kysely'
import { sql } from 'kysely'

// A second kind of answer key for descriptive questions (SST, English, Telugu): a rubric of criteria whose marks add up
// to the question's marks (M4 additions plan, section 4). key_kind 'steps' is the existing working-steps key. Local first;
// the owner runs it on production.
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('school_own_questions')
    .addColumn('key_kind', 'text', (col) => col.notNull().defaultTo('steps').check(sql`key_kind in ('steps', 'rubric')`))
    .addColumn('key_criteria', 'jsonb', (col) => col.notNull().defaultTo(sql`'[]'::jsonb`))
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('school_own_questions').dropColumn('key_criteria').dropColumn('key_kind').execute()
}
