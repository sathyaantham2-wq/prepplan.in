import type { Kysely } from 'kysely'
import { sql } from 'kysely'

// A teacher's marking note on one question of an own paper (owner direction 2026-11-01), e.g. "accept any valid
// method" or "do not take marks off for a missing unit". It is read by the AI when it marks that question and shown
// to the teacher with the answer. Plain text, up to 400 characters (checked in code), never about a student.
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('school_own_questions').addColumn('marking_note', 'text').execute()
  await sql`alter table school_own_questions add constraint school_own_questions_marking_note_len check (marking_note is null or char_length(marking_note) <= 400)`.execute(db)
}
