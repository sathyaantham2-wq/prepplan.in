import type { Kysely } from 'kysely'
import { sql } from 'kysely'

// PrepPlan for Schools, step S5: one question paper per class and exam, the teacher's copy, and the
// Smart Answer Booklet for each student.
//
// school_exams.layout is a frozen copy of the layout the paper was made from, so editing the
// template later never changes a paper that is already made (the template version is pinned too).
// school_exam_questions is the master paper: the same questions for every student of the exam.
// Questions are not copied into per-student papers here; the per-student attempt rows are made when
// the answered booklets come back (step S7).
//
// The booklet layout (where every answer box and bubble sits on every page, in millimetres) is
// stored once per exam in school_booklet_layouts, because the scan reader needs it. Every booklet
// of an exam has the same layout; only the printed name, ID and the QR codes differ. Each page of
// each booklet has its own QR token (school_booklet_pages.token) saying which exam, student and
// page it is. The token is derived from a secret (HMAC), so it can be re-printed identically and
// cannot be guessed; the PDFs themselves are never stored.
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('school_exams')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('school_id', 'uuid', (col) =>
      col.notNull().references('schools.id').onDelete('restrict'),
    )
    .addColumn('class_id', 'uuid', (col) => col.notNull())
    .addColumn('subject_id', 'uuid', (col) =>
      col.notNull().references('subjects.id').onDelete('restrict'),
    )
    .addColumn('template_id', 'uuid', (col) => col.notNull())
    .addColumn('template_name', 'text', (col) => col.notNull())
    .addColumn('layout', 'jsonb', (col) => col.notNull())
    .addColumn('chapter_ids', sql`uuid[]`, (col) => col.notNull())
    .addColumn('title', 'text', (col) => col.notNull())
    .addColumn('exam_date', 'date')
    .addColumn('status', 'text', (col) =>
      col
        .notNull()
        .defaultTo('draft')
        .check(sql`status in ('draft', 'booklets_ready')`),
    )
    // The same shape the paper generator keeps: what could not be filled, never hidden.
    .addColumn('shortfalls', 'jsonb', (col) =>
      col.notNull().defaultTo(sql`'[]'::jsonb`),
    )
    // The lines printed on the teacher's copy (coverage preview wording).
    .addColumn('teacher_copy_lines', 'jsonb', (col) =>
      col.notNull().defaultTo(sql`'[]'::jsonb`),
    )
    .addColumn('nominal_marks', 'integer', (col) => col.notNull())
    .addColumn('printed_marks', 'integer', (col) => col.notNull())
    .addColumn('created_by_user_id', 'uuid', (col) =>
      col.notNull().references('users.id').onDelete('restrict'),
    )
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addUniqueConstraint('school_exams_school_id_id_key', ['school_id', 'id'])
    .addForeignKeyConstraint(
      'school_exams_class_fk',
      ['school_id', 'class_id'],
      'school_classes',
      ['school_id', 'id'],
      (cb) => cb.onDelete('restrict'),
    )
    .addForeignKeyConstraint(
      'school_exams_template_fk',
      ['school_id', 'template_id'],
      'school_paper_templates',
      ['school_id', 'id'],
      (cb) => cb.onDelete('restrict'),
    )
    .execute()

  await db.schema
    .createTable('school_exam_sections')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('school_id', 'uuid', (col) =>
      col.notNull().references('schools.id').onDelete('restrict'),
    )
    .addColumn('exam_id', 'uuid', (col) => col.notNull())
    .addColumn('section_id', 'uuid', (col) => col.notNull())
    .addUniqueConstraint('school_exam_sections_school_id_id_key', ['school_id', 'id'])
    .addUniqueConstraint('school_exam_sections_exam_section_key', ['exam_id', 'section_id'])
    .addForeignKeyConstraint(
      'school_exam_sections_exam_fk',
      ['school_id', 'exam_id'],
      'school_exams',
      ['school_id', 'id'],
      (cb) => cb.onDelete('restrict'),
    )
    .addForeignKeyConstraint(
      'school_exam_sections_section_fk',
      ['school_id', 'section_id'],
      'school_sections',
      ['school_id', 'id'],
      (cb) => cb.onDelete('restrict'),
    )
    .execute()

  await db.schema
    .createTable('school_exam_questions')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('school_id', 'uuid', (col) =>
      col.notNull().references('schools.id').onDelete('restrict'),
    )
    .addColumn('exam_id', 'uuid', (col) => col.notNull())
    .addColumn('question_id', 'uuid', (col) =>
      col.notNull().references('questions.id').onDelete('restrict'),
    )
    .addColumn('chapter_id', 'uuid', (col) =>
      col.notNull().references('chapters.id').onDelete('restrict'),
    )
    // The printed number. The two halves of an OR share it.
    .addColumn('position', 'integer', (col) => col.notNull())
    .addColumn('is_alternate', 'boolean', (col) =>
      col.notNull().defaultTo(false),
    )
    .addColumn('marks', 'integer', (col) => col.notNull())
    .addColumn('section', 'text', (col) => col.notNull())
    .addColumn('slot', 'text', (col) => col.notNull())
    .addColumn('choice_group', 'text')
    .addColumn('expected_words', 'integer')
    .addUniqueConstraint('school_exam_questions_school_id_id_key', ['school_id', 'id'])
    .addUniqueConstraint('school_exam_questions_position_key', ['exam_id', 'position', 'is_alternate'])
    .addForeignKeyConstraint(
      'school_exam_questions_exam_fk',
      ['school_id', 'exam_id'],
      'school_exams',
      ['school_id', 'id'],
      (cb) => cb.onDelete('restrict'),
    )
    .execute()

  await db.schema
    .createTable('school_booklet_layouts')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('school_id', 'uuid', (col) =>
      col.notNull().references('schools.id').onDelete('restrict'),
    )
    .addColumn('exam_id', 'uuid', (col) => col.notNull())
    .addColumn('version', 'integer', (col) => col.notNull().defaultTo(1))
    .addColumn('page_count', 'integer', (col) => col.notNull())
    // Every page: its kind, the answer boxes and bubbles with their position in mm, the QR and corner marks.
    .addColumn('manifest', 'jsonb', (col) => col.notNull())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addUniqueConstraint('school_booklet_layouts_school_id_id_key', ['school_id', 'id'])
    .addUniqueConstraint('school_booklet_layouts_exam_key', ['exam_id'])
    .addForeignKeyConstraint(
      'school_booklet_layouts_exam_fk',
      ['school_id', 'exam_id'],
      'school_exams',
      ['school_id', 'id'],
      (cb) => cb.onDelete('restrict'),
    )
    .execute()

  await db.schema
    .createTable('school_booklets')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('school_id', 'uuid', (col) =>
      col.notNull().references('schools.id').onDelete('restrict'),
    )
    .addColumn('exam_id', 'uuid', (col) => col.notNull())
    .addColumn('school_student_id', 'uuid', (col) => col.notNull())
    .addColumn('page_count', 'integer', (col) => col.notNull())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addUniqueConstraint('school_booklets_school_id_id_key', ['school_id', 'id'])
    .addUniqueConstraint('school_booklets_exam_student_key', ['exam_id', 'school_student_id'])
    .addForeignKeyConstraint(
      'school_booklets_exam_fk',
      ['school_id', 'exam_id'],
      'school_exams',
      ['school_id', 'id'],
      (cb) => cb.onDelete('restrict'),
    )
    .addForeignKeyConstraint(
      'school_booklets_student_fk',
      ['school_id', 'school_student_id'],
      'school_students',
      ['school_id', 'id'],
      (cb) => cb.onDelete('restrict'),
    )
    .execute()

  await db.schema
    .createTable('school_booklet_pages')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('school_id', 'uuid', (col) =>
      col.notNull().references('schools.id').onDelete('restrict'),
    )
    .addColumn('booklet_id', 'uuid', (col) => col.notNull())
    .addColumn('page_no', 'integer', (col) => col.notNull())
    .addColumn('token', 'text', (col) => col.notNull())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addUniqueConstraint('school_booklet_pages_school_id_id_key', ['school_id', 'id'])
    .addUniqueConstraint('school_booklet_pages_booklet_page_key', ['booklet_id', 'page_no'])
    .addUniqueConstraint('school_booklet_pages_token_key', ['token'])
    .addForeignKeyConstraint(
      'school_booklet_pages_booklet_fk',
      ['school_id', 'booklet_id'],
      'school_booklets',
      ['school_id', 'id'],
      (cb) => cb.onDelete('restrict'),
    )
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('school_booklet_pages').execute()
  await db.schema.dropTable('school_booklets').execute()
  await db.schema.dropTable('school_booklet_layouts').execute()
  await db.schema.dropTable('school_exam_questions').execute()
  await db.schema.dropTable('school_exam_sections').execute()
  await db.schema.dropTable('school_exams').execute()
}
