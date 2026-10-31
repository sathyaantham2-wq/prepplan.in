import type { Kysely } from 'kysely'
import { sql } from 'kysely'

// Progress Report and Class Progress (owner direction 2026-10-31, SCHOOLS_MODULE_PLAN.md section 15).
//
// school_answer_marks.habit: which writing habit cost the marks (skipped_steps, units_missing, stopped_early,
// misread_question, other); null where no habit was lost or the mark is older than this column.
// school_answer_marks.steps: marks per step as marked: [{no, description, awarded, max}]; empty for older marks.
// schools.show_class_rank: whether students see a class rank. Off unless the school turns it on.
// school_exam_reflections: a student's optional three-question reflection after a released paper, kept for the
// Holistic Progress Card export. Not used for marks, levels, ranking or analytics.
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('school_answer_marks')
    .addColumn('habit', 'text')
    .addColumn('steps', 'jsonb', (col) => col.notNull().defaultTo(sql`'[]'::jsonb`))
    .execute()
  await sql`alter table school_answer_marks add constraint school_answer_marks_habit_check check (habit is null or habit in ('skipped_steps', 'units_missing', 'stopped_early', 'misread_question', 'other'))`.execute(db)
  await db.schema
    .alterTable('schools')
    .addColumn('show_class_rank', 'boolean', (col) => col.notNull().defaultTo(false))
    .execute()
  await db.schema
    .createTable('school_exam_reflections')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('school_id', 'uuid', (col) => col.notNull().references('schools.id').onDelete('restrict'))
    .addColumn('paper_id', 'uuid', (col) => col.notNull())
    .addColumn('school_student_id', 'uuid', (col) => col.notNull())
    .addColumn('hardest_question_no', 'text')
    .addColumn('next_time', 'text', (col) =>
      col.check(sql`next_time in ('read_carefully', 'show_steps', 'write_more', 'revise_topic', 'manage_time', 'other')`),
    )
    .addColumn('next_time_note', 'text')
    .addColumn('feeling', 'smallint', (col) => col.check(sql`feeling between 1 and 3`))
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addUniqueConstraint('school_exam_reflections_school_id_id_key', ['school_id', 'id'])
    .addUniqueConstraint('school_exam_reflections_one_key', ['paper_id', 'school_student_id'])
    .addForeignKeyConstraint('school_exam_reflections_paper_fk', ['school_id', 'paper_id'], 'school_own_papers', ['school_id', 'id'], (cb) => cb.onDelete('restrict'))
    .addForeignKeyConstraint('school_exam_reflections_student_fk', ['school_id', 'school_student_id'], 'school_students', ['school_id', 'id'], (cb) => cb.onDelete('restrict'))
    .execute()
}
