import type { Kysely } from 'kysely'
import { sql } from 'kysely'

// The school's own questions (docs/SCHOOLS_MODULE_PLAN.md section 16.13). A school question is a `questions` row with
// status 'school' and origin 'school', so the paper, the teacher copy, the Word file and the AI marking read it exactly
// like a bank question, by id. Every pool of the shared bank takes status 'approved' only, so a school question never
// reaches a PrepPlan student, another school or the bank. Which school owns it lives in `school_questions` (scoped by
// school_id). Nothing is deleted: a question is retired, and a change to a question that was printed makes a new one.
export async function up(db: Kysely<any>): Promise<void> {
  await sql`alter table questions drop constraint questions_status_check`.execute(db)
  await sql`alter table questions add constraint questions_status_check check (status in ('draft', 'approved', 'retired', 'school'))`.execute(db)
  await sql`alter table questions drop constraint questions_origin_check`.execute(db)
  await sql`alter table questions add constraint questions_origin_check check (origin in ('manual', 'ai_generated', 'school'))`.execute(db)

  await db.schema
    .createTable('school_questions')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('school_id', 'uuid', (col) => col.notNull().references('schools.id').onDelete('restrict'))
    .addColumn('question_id', 'uuid', (col) => col.notNull().unique().references('questions.id').onDelete('restrict'))
    // the school's class-subject it was written for (school_subjects), and the bank chapter the teacher confirmed
    .addColumn('school_subject_id', 'uuid', (col) => col.notNull())
    .addColumn('chapter_id', 'uuid', (col) => col.notNull().references('chapters.id').onDelete('restrict'))
    .addColumn('created_by_user_id', 'uuid', (col) => col.notNull().references('users.id').onDelete('restrict'))
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    // what the AI suggested for chapter, topic and level, kept next to what the teacher confirmed
    .addColumn('ai_suggestion', 'jsonb')
    .addColumn('retired_at', 'timestamptz')
    .addColumn('retired_by_user_id', 'uuid', (col) => col.references('users.id').onDelete('restrict'))
    // a printed question that was changed: the new question that took its place
    .addColumn('replaced_by_id', 'uuid')
    .addUniqueConstraint('school_questions_school_id_id_key', ['school_id', 'id'])
    .addForeignKeyConstraint('school_questions_subject_fk', ['school_id', 'school_subject_id'], 'school_subjects', ['school_id', 'id'], (cb) => cb.onDelete('restrict'))
    .addForeignKeyConstraint('school_questions_replaced_by_fk', ['school_id', 'replaced_by_id'], 'school_questions', ['school_id', 'id'], (cb) => cb.onDelete('restrict'))
    .execute()
  await sql`create index school_questions_school on school_questions (school_id, chapter_id) where retired_at is null`.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('school_questions').execute()
  await sql`alter table questions drop constraint questions_origin_check`.execute(db)
  await sql`alter table questions add constraint questions_origin_check check (origin in ('manual', 'ai_generated'))`.execute(db)
  await sql`alter table questions drop constraint questions_status_check`.execute(db)
  await sql`alter table questions add constraint questions_status_check check (status in ('draft', 'approved', 'retired'))`.execute(db)
}
