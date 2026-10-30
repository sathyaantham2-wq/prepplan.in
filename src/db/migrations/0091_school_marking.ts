import type { Kysely } from 'kysely'
import { sql } from 'kysely'

// M4 stage 1 (owner direction 2026-10-30): AI marking of a school's answer sheets, student by student.
//
// school_sheet_marking: one row per own paper and student: where her marking stands.
//   checking -> marked (nothing flagged) | needs_teacher (something flagged) | rejected (the sheets could not be marked).
//   A re-upload starts it again. total_marks / max_marks are filled when the marking finishes.
//
// school_answer_marks: one row per own paper, student and question. `runs` keeps what each of the three
// marking passes said (marks, steps, why), so the disagreement is visible later; `ai_marks` is what the
// passes agreed on (or the middle value when they differed); `final_marks` is what counts. `state` is
// 'ai_final' (the AI marks stand), 'flagged' (the passes disagreed, the AI was unsure or could not find
// the answer: a teacher must resolve it) or 'teacher_set' (a teacher decided; logged in audit_log).
// loss_kind says why marks were lost: knowledge_gap (did not know it) or writing_habit (knew it, wrote it
// badly or too short), 'none' when nothing was lost, 'unclear' when the passes disagreed on the reason.
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('school_sheet_marking')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('school_id', 'uuid', (col) => col.notNull().references('schools.id').onDelete('restrict'))
    .addColumn('paper_id', 'uuid', (col) => col.notNull())
    .addColumn('school_student_id', 'uuid', (col) => col.notNull())
    .addColumn('status', 'text', (col) =>
      col.notNull().check(sql`status in ('checking', 'marked', 'needs_teacher', 'rejected')`),
    )
    .addColumn('message', 'text')
    .addColumn('total_marks', 'numeric')
    .addColumn('max_marks', 'numeric')
    .addColumn('started_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('finished_at', 'timestamptz')
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addUniqueConstraint('school_sheet_marking_school_id_id_key', ['school_id', 'id'])
    .addUniqueConstraint('school_sheet_marking_paper_student_key', ['paper_id', 'school_student_id'])
    .addForeignKeyConstraint('school_sheet_marking_paper_fk', ['school_id', 'paper_id'], 'school_own_papers', ['school_id', 'id'], (cb) => cb.onDelete('restrict'))
    .addForeignKeyConstraint('school_sheet_marking_student_fk', ['school_id', 'school_student_id'], 'school_students', ['school_id', 'id'], (cb) => cb.onDelete('restrict'))
    .execute()

  await db.schema
    .createTable('school_answer_marks')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('school_id', 'uuid', (col) => col.notNull().references('schools.id').onDelete('restrict'))
    .addColumn('paper_id', 'uuid', (col) => col.notNull())
    .addColumn('school_student_id', 'uuid', (col) => col.notNull())
    .addColumn('own_question_id', 'uuid', (col) => col.notNull())
    .addColumn('found', 'boolean', (col) => col.notNull())
    .addColumn('answer_text', 'text')
    .addColumn('runs', 'jsonb', (col) => col.notNull().defaultTo(sql`'[]'::jsonb`))
    .addColumn('ai_marks', 'numeric', (col) => col.notNull())
    .addColumn('final_marks', 'numeric', (col) => col.notNull())
    .addColumn('max_marks', 'numeric', (col) => col.notNull())
    .addColumn('state', 'text', (col) =>
      col.notNull().check(sql`state in ('ai_final', 'flagged', 'teacher_set')`),
    )
    .addColumn('flag_reason', 'text')
    .addColumn('loss_kind', 'text', (col) =>
      col.notNull().defaultTo('none').check(sql`loss_kind in ('none', 'knowledge_gap', 'writing_habit', 'unclear')`),
    )
    .addColumn('loss_reason', 'text')
    .addColumn('changed_by_user_id', 'uuid', (col) => col.references('users.id').onDelete('restrict'))
    .addColumn('changed_at', 'timestamptz')
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addUniqueConstraint('school_answer_marks_school_id_id_key', ['school_id', 'id'])
    .addUniqueConstraint('school_answer_marks_one_key', ['paper_id', 'school_student_id', 'own_question_id'])
    .addForeignKeyConstraint('school_answer_marks_paper_fk', ['school_id', 'paper_id'], 'school_own_papers', ['school_id', 'id'], (cb) => cb.onDelete('restrict'))
    .addForeignKeyConstraint('school_answer_marks_student_fk', ['school_id', 'school_student_id'], 'school_students', ['school_id', 'id'], (cb) => cb.onDelete('restrict'))
    .addForeignKeyConstraint('school_answer_marks_question_fk', ['school_id', 'own_question_id'], 'school_own_questions', ['school_id', 'id'], (cb) => cb.onDelete('restrict'))
    .execute()
  await sql`alter table school_answer_marks add constraint school_answer_marks_range check (final_marks >= 0 and ai_marks >= 0 and final_marks <= max_marks and ai_marks <= max_marks)`.execute(db)
  await db.schema.createIndex('school_answer_marks_student_idx').on('school_answer_marks').columns(['paper_id', 'school_student_id']).execute()
}
