import type { Kysely } from 'kysely'
import { sql } from 'kysely'

// PrepPlan for Schools, step 3 (owner direction 2026-10-29): "Use your own paper".
//
// school_own_papers: a question paper the school uploaded itself (Word, PDF or photos), or a PrepPlan
// Word paper that was edited and uploaded again. The file is kept sealed in private storage (never in
// Postgres). A paper moves: uploaded -> reading (the steps: read, map to chapters, key) -> needs_review
// (a teacher checks the list) -> approved (frozen). Nothing is marked from a paper until it is approved
// AND every question's answer key is approved (assertPaperReadyForMarking).
//
// school_own_questions: one row per question read from the paper. `text`, `marks`, `section` and the
// chapter are what the teacher approved; `original_text` keeps what the reader first wrote so a change is
// visible. A question the teacher removes is hidden (removed_at), never deleted. The key (`key_text`,
// `key_steps`) is either the school's own (key_source 'uploaded'), a PrepPlan AI draft ('ai_draft') or
// the teacher's own words ('teacher') or, for an unchanged question of a PrepPlan paper, the bank's own
// reviewed answer ('bank', approved by the system). key_status 'approved' is the teacher's explicit yes.
// phase: read (the questions) -> map (to chapters) -> key (read the school's own key) -> draft (AI drafts
// the missing keys) -> done.
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('school_own_papers')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('school_id', 'uuid', (col) => col.notNull().references('schools.id').onDelete('restrict'))
    .addColumn('class_id', 'uuid', (col) => col.notNull())
    .addColumn('school_subject_id', 'uuid', (col) => col.notNull())
    .addColumn('title', 'text', (col) => col.notNull())
    .addColumn('source_kind', 'text', (col) =>
      col.notNull().check(sql`source_kind in ('prepplan_docx', 'docx', 'pdf', 'images')`),
    )
    .addColumn('source_keys', 'jsonb', (col) => col.notNull().defaultTo(sql`'[]'::jsonb`))
    .addColumn('source_names', 'jsonb', (col) => col.notNull().defaultTo(sql`'[]'::jsonb`))
    .addColumn('key_keys', 'jsonb', (col) => col.notNull().defaultTo(sql`'[]'::jsonb`))
    .addColumn('key_kind', 'text', (col) => col.check(sql`key_kind in ('docx', 'pdf', 'images')`))
    .addColumn('status', 'text', (col) =>
      col
        .notNull()
        .defaultTo('uploaded')
        .check(sql`status in ('uploaded', 'reading', 'needs_review', 'approved', 'failed')`),
    )
    // where the reading is: the phase and how far (so a request can do one small piece of work)
    .addColumn('phase', 'text', (col) =>
      col.notNull().defaultTo('read').check(sql`phase in ('read', 'map', 'key', 'draft', 'done')`),
    )
    .addColumn('progress', 'integer', (col) => col.notNull().defaultTo(0))
    .addColumn('progress_total', 'integer', (col) => col.notNull().defaultTo(0))
    .addColumn('read_chunks', 'jsonb', (col) => col.notNull().defaultTo(sql`'[]'::jsonb`))
    .addColumn('message', 'text')
    .addColumn('total_marks', sql`numeric(7,2)`)
    .addColumn('exam_id', 'uuid') // set when it is an edited PrepPlan paper
    .addColumn('created_by_user_id', 'uuid', (col) => col.notNull().references('users.id').onDelete('restrict'))
    .addColumn('approved_by_user_id', 'uuid', (col) => col.references('users.id').onDelete('restrict'))
    .addColumn('approved_at', 'timestamptz')
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('archived_at', 'timestamptz')
    .addUniqueConstraint('school_own_papers_school_id_id_key', ['school_id', 'id'])
    .addForeignKeyConstraint('school_own_papers_class_fk', ['school_id', 'class_id'], 'school_classes', ['school_id', 'id'], (cb) =>
      cb.onDelete('restrict'),
    )
    .addForeignKeyConstraint(
      'school_own_papers_subject_fk',
      ['school_id', 'class_id', 'school_subject_id'],
      'school_subjects',
      ['school_id', 'class_id', 'id'],
      (cb) => cb.onDelete('restrict'),
    )
    .execute()

  await db.schema
    .createTable('school_own_questions')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('school_id', 'uuid', (col) => col.notNull().references('schools.id').onDelete('restrict'))
    .addColumn('paper_id', 'uuid', (col) => col.notNull())
    .addColumn('position', 'integer', (col) => col.notNull())
    .addColumn('section', 'text', (col) => col.notNull().defaultTo(''))
    .addColumn('type', 'text', (col) => col.notNull().defaultTo('short_answer'))
    .addColumn('text', 'text', (col) => col.notNull())
    .addColumn('original_text', 'text', (col) => col.notNull())
    .addColumn('options', 'jsonb', (col) => col.notNull().defaultTo(sql`'[]'::jsonb`))
    .addColumn('marks', sql`numeric(6,2)`, (col) => col.notNull())
    .addColumn('or_group', 'text')
    .addColumn('chapter_id', 'uuid')
    .addColumn('map_confidence', sql`numeric(4,3)`)
    .addColumn('source_exam_question_id', 'uuid') // an edited PrepPlan paper: which printed question this was
    .addColumn('changed_from_source', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('key_text', 'text')
    .addColumn('key_steps', 'jsonb', (col) => col.notNull().defaultTo(sql`'[]'::jsonb`))
    .addColumn('key_source', 'text', (col) => col.check(sql`key_source in ('uploaded', 'ai_draft', 'teacher', 'bank')`))
    .addColumn('key_status', 'text', (col) =>
      col.notNull().defaultTo('none').check(sql`key_status in ('none', 'draft', 'approved')`),
    )
    .addColumn('key_approved_by_user_id', 'uuid', (col) => col.references('users.id').onDelete('restrict'))
    .addColumn('key_approved_at', 'timestamptz')
    .addColumn('edited_by_user_id', 'uuid', (col) => col.references('users.id').onDelete('restrict'))
    .addColumn('removed_at', 'timestamptz')
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addUniqueConstraint('school_own_questions_school_id_id_key', ['school_id', 'id'])
    .addForeignKeyConstraint('school_own_questions_paper_fk', ['school_id', 'paper_id'], 'school_own_papers', ['school_id', 'id'], (cb) =>
      cb.onDelete('restrict'),
    )
    .execute()
  await db.schema.createIndex('school_own_questions_paper_idx').on('school_own_questions').columns(['paper_id', 'position']).execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('school_own_questions').execute()
  await db.schema.dropTable('school_own_papers').execute()
}
