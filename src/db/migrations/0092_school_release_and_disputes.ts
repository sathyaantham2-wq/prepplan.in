import type { Kysely } from 'kysely'
import { sql } from 'kysely'

// M4 release (owner direction 2026-10-31).
//
// school_paper_releases: a section's results of one own paper, handed to its students. One row per paper
// and section (release and lock are per section). window_days is the school's dispute window at the moment
// of release (schools.dispute_window_days, default 7); window_closes_at is released_at + window_days. The
// marks lock (locked_at) once the window has closed AND no dispute is still open; mastery and reports use
// locked marks only.
//
// school_answer_disputes: a student's flag on one answer. At most 5 per student per paper (checked in code),
// one per answer. The AI re-reads once and may only keep or raise the mark ('ai_reviewed'); a student still
// not satisfied sends it to her teacher ('with_teacher'), whose decision is final and may raise or lower it
// ('resolved'). marks_before / marks_after keep what the mark was and became; every change is also in audit_log.
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('school_paper_releases')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('school_id', 'uuid', (col) => col.notNull().references('schools.id').onDelete('restrict'))
    .addColumn('paper_id', 'uuid', (col) => col.notNull())
    .addColumn('section_id', 'uuid', (col) => col.notNull())
    .addColumn('released_by_user_id', 'uuid', (col) => col.notNull().references('users.id').onDelete('restrict'))
    .addColumn('released_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('window_days', 'integer', (col) => col.notNull())
    .addColumn('window_closes_at', 'timestamptz', (col) => col.notNull())
    .addColumn('locked_at', 'timestamptz')
    .addUniqueConstraint('school_paper_releases_school_id_id_key', ['school_id', 'id'])
    .addUniqueConstraint('school_paper_releases_paper_section_key', ['paper_id', 'section_id'])
    .addForeignKeyConstraint('school_paper_releases_paper_fk', ['school_id', 'paper_id'], 'school_own_papers', ['school_id', 'id'], (cb) => cb.onDelete('restrict'))
    .addForeignKeyConstraint('school_paper_releases_section_fk', ['school_id', 'section_id'], 'school_sections', ['school_id', 'id'], (cb) => cb.onDelete('restrict'))
    .execute()

  await db.schema
    .createTable('school_answer_disputes')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('school_id', 'uuid', (col) => col.notNull().references('schools.id').onDelete('restrict'))
    .addColumn('paper_id', 'uuid', (col) => col.notNull())
    .addColumn('school_student_id', 'uuid', (col) => col.notNull())
    .addColumn('answer_mark_id', 'uuid', (col) => col.notNull())
    .addColumn('reason', 'text', (col) => col.notNull())
    .addColumn('status', 'text', (col) =>
      col.notNull().check(sql`status in ('ai_reviewed', 'with_teacher', 'resolved')`),
    )
    .addColumn('ai_reply', 'text')
    .addColumn('marks_before', 'numeric', (col) => col.notNull())
    .addColumn('marks_after', 'numeric')
    .addColumn('decided_by_user_id', 'uuid', (col) => col.references('users.id').onDelete('restrict'))
    .addColumn('decision_note', 'text')
    .addColumn('decided_at', 'timestamptz')
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addUniqueConstraint('school_answer_disputes_school_id_id_key', ['school_id', 'id'])
    .addUniqueConstraint('school_answer_disputes_one_per_answer', ['answer_mark_id'])
    .addForeignKeyConstraint('school_answer_disputes_paper_fk', ['school_id', 'paper_id'], 'school_own_papers', ['school_id', 'id'], (cb) => cb.onDelete('restrict'))
    .addForeignKeyConstraint('school_answer_disputes_student_fk', ['school_id', 'school_student_id'], 'school_students', ['school_id', 'id'], (cb) => cb.onDelete('restrict'))
    .addForeignKeyConstraint('school_answer_disputes_mark_fk', ['school_id', 'answer_mark_id'], 'school_answer_marks', ['school_id', 'id'], (cb) => cb.onDelete('restrict'))
    .execute()
  await db.schema.createIndex('school_answer_disputes_student_idx').on('school_answer_disputes').columns(['paper_id', 'school_student_id']).execute()
}
