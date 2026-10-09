import type { Kysely } from 'kysely'
import { sql } from 'kysely'

// "School Half-Yearly" paper type (blueprint-driven; no F-number covers it yet).
//
//  - blueprints.config: paper-type settings that are data, not code (kind, instructions, word
//    limits, thinking-level mix, whether the layout is still a draft awaiting the owner).
//  - chapters.discipline: which part of a combined subject a chapter belongs to (Social Science
//    is History / Geography / Civics / Economics). Null for subjects that have no such split.
//  - paper_questions.slot / expected_words: the layout slot a question filled and, for a written
//    question, how many words an answer is expected to run to (snapshotted so an old paper never
//    changes if a blueprint's word limits do).
//  - evaluation_items.possible_stopped_early: a flag for the diagnosis ("did she stop writing too
//    early?"), never a mark deduction.
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('blueprints')
    .addColumn('config', 'jsonb', (col) => col.notNull().defaultTo(sql`'{}'::jsonb`))
    .execute()
  await db.schema.alterTable('chapters').addColumn('discipline', 'text').execute()
  await db.schema
    .alterTable('paper_questions')
    .addColumn('slot', 'text')
    .addColumn('expected_words', 'integer')
    .execute()
  await db.schema
    .alterTable('evaluation_items')
    .addColumn('possible_stopped_early', 'boolean', (col) => col.notNull().defaultTo(false))
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('evaluation_items').dropColumn('possible_stopped_early').execute()
  await db.schema
    .alterTable('paper_questions')
    .dropColumn('slot')
    .dropColumn('expected_words')
    .execute()
  await db.schema.alterTable('chapters').dropColumn('discipline').execute()
  await db.schema.alterTable('blueprints').dropColumn('config').execute()
}
