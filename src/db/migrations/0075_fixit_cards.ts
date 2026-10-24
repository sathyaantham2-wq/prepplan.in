import type { Kysely } from 'kysely'
import { sql } from 'kysely'

// The student's Fix-it Deck: every mark she lost becomes one small card per concept that comes back
// on a spaced schedule (2, 7, 21 days) until she can answer it. Nothing is deleted -- a finished
// card becomes 'mastered', and a new lost mark re-opens it. served_question_id/served_on pin the
// one question a card shows today, so the answer endpoint can check she answered the question the
// deck actually gave her. fixit_answers is append-only history.
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('fixit_cards')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('student_id', 'uuid', (col) => col.notNull().references('students.id').onDelete('cascade'))
    .addColumn('concept_id', 'uuid', (col) => col.notNull().references('concepts.id'))
    .addColumn('source_evaluation_item_id', 'uuid', (col) =>
      col.references('evaluation_items.id').onDelete('set null'),
    )
    .addColumn('cause', 'text')
    .addColumn('stage', 'int2', (col) => col.notNull().defaultTo(0))
    .addColumn('due_on', 'date', (col) => col.notNull())
    .addColumn('status', 'text', (col) => col.notNull().defaultTo('active'))
    .addColumn('last_answered_at', 'timestamptz')
    .addColumn('served_question_id', 'uuid', (col) => col.references('questions.id'))
    .addColumn('served_on', 'date')
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addUniqueConstraint('fixit_cards_student_concept_key', ['student_id', 'concept_id'])
    .addCheckConstraint('fixit_cards_stage_check', sql`stage between 0 and 3`)
    .addCheckConstraint('fixit_cards_status_check', sql`status in ('active', 'mastered')`)
    .addCheckConstraint('fixit_cards_cause_check', sql`cause is null or cause in ('knowledge', 'habit')`)
    .execute()

  await db.schema
    .createIndex('fixit_cards_student_due_idx')
    .on('fixit_cards')
    .columns(['student_id', 'status', 'due_on'])
    .execute()

  await db.schema
    .createTable('fixit_answers')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('card_id', 'uuid', (col) => col.notNull().references('fixit_cards.id').onDelete('cascade'))
    .addColumn('question_id', 'uuid', (col) => col.notNull().references('questions.id'))
    .addColumn('answered_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('correct', 'boolean', (col) => col.notNull())
    .execute()

  await db.schema.createIndex('fixit_answers_card_idx').on('fixit_answers').columns(['card_id', 'answered_at']).execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('fixit_answers').execute()
  await db.schema.dropTable('fixit_cards').execute()
}
