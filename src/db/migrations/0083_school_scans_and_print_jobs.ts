import type { Kysely } from 'kysely'
import { sql } from 'kysely'

// PrepPlan for Schools, step S6 (scan intake) and the batched printing of booklets.
//
// school_scan_pages: every photographed page that came in for an exam. Its picture (straightened
// when the four corner marks were found) is stored ONLY encrypted (src/lib/scan-crypto.ts, AES-256-GCM)
// and is blanked (image set to NULL, purged_at set) once the school's retention period has passed;
// the row stays. A page from another school or exam is never stored: only the reason is kept.
// status: matched (the QR said which student and page), duplicate (a second copy of a page that is
// already matched), unreadable (no QR could be read: waits for a teacher to say which page it is),
// manual (a teacher said which page it is), rejected (not from this exam; no picture kept).
//
// school_exam_absences: a student marked absent for an exam, so her missing pages are not chased.
// Clearing it keeps the row (cleared_at).
//
// school_print_jobs / _parts: printing a class of booklets is done in batches of a few students so
// no single request runs long. Each batch is kept (as a PDF) until the last one is done, then they
// are joined into one PDF held for 7 days; after that the file is blanked and the row stays.
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('school_scan_batches')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('school_id', 'uuid', (col) =>
      col.notNull().references('schools.id').onDelete('restrict'),
    )
    .addColumn('exam_id', 'uuid', (col) => col.notNull())
    .addColumn('uploaded_by_user_id', 'uuid', (col) =>
      col.notNull().references('users.id').onDelete('restrict'),
    )
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addUniqueConstraint('school_scan_batches_school_id_id_key', ['school_id', 'id'])
    .addForeignKeyConstraint(
      'school_scan_batches_exam_fk',
      ['school_id', 'exam_id'],
      'school_exams',
      ['school_id', 'id'],
      (cb) => cb.onDelete('restrict'),
    )
    .execute()

  await db.schema
    .createTable('school_scan_pages')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('school_id', 'uuid', (col) =>
      col.notNull().references('schools.id').onDelete('restrict'),
    )
    .addColumn('exam_id', 'uuid', (col) => col.notNull())
    .addColumn('batch_id', 'uuid', (col) => col.notNull())
    .addColumn('booklet_id', 'uuid')
    .addColumn('page_no', 'integer')
    .addColumn('status', 'text', (col) =>
      col
        .notNull()
        .check(
          sql`status in ('matched', 'duplicate', 'unreadable', 'manual', 'rejected')`,
        ),
    )
    // The plain sentence shown to the teacher for a rejected or unreadable page.
    .addColumn('reason', 'text')
    // { corners, turnedDegrees, straightened } from the page reader.
    .addColumn('quality', 'jsonb', (col) =>
      col.notNull().defaultTo(sql`'{}'::jsonb`),
    )
    .addColumn('original_name', 'text')
    .addColumn('size_bytes', 'integer')
    // iv + tag + ciphertext. NULL for a rejected page, or once purged.
    .addColumn('image', 'bytea')
    .addColumn('purged_at', 'timestamptz')
    .addColumn('uploaded_by_user_id', 'uuid', (col) =>
      col.notNull().references('users.id').onDelete('restrict'),
    )
    .addColumn('assigned_by_user_id', 'uuid', (col) =>
      col.references('users.id').onDelete('restrict'),
    )
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addUniqueConstraint('school_scan_pages_school_id_id_key', ['school_id', 'id'])
    .addForeignKeyConstraint(
      'school_scan_pages_batch_fk',
      ['school_id', 'batch_id'],
      'school_scan_batches',
      ['school_id', 'id'],
      (cb) => cb.onDelete('restrict'),
    )
    .addForeignKeyConstraint(
      'school_scan_pages_exam_fk',
      ['school_id', 'exam_id'],
      'school_exams',
      ['school_id', 'id'],
      (cb) => cb.onDelete('restrict'),
    )
    .addForeignKeyConstraint(
      'school_scan_pages_booklet_fk',
      ['school_id', 'booklet_id'],
      'school_booklets',
      ['school_id', 'id'],
      (cb) => cb.onDelete('restrict'),
    )
    .execute()
  await db.schema
    .createIndex('school_scan_pages_exam_idx')
    .on('school_scan_pages')
    .columns(['exam_id', 'booklet_id', 'page_no'])
    .execute()
  // At most one matched or manual picture per page of a booklet; extra copies are 'duplicate'.
  await sql`create unique index school_scan_pages_one_current on school_scan_pages (booklet_id, page_no) where status in ('matched', 'manual')`.execute(
    db,
  )

  await db.schema
    .createTable('school_exam_absences')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('school_id', 'uuid', (col) =>
      col.notNull().references('schools.id').onDelete('restrict'),
    )
    .addColumn('exam_id', 'uuid', (col) => col.notNull())
    .addColumn('school_student_id', 'uuid', (col) => col.notNull())
    .addColumn('marked_by_user_id', 'uuid', (col) =>
      col.notNull().references('users.id').onDelete('restrict'),
    )
    .addColumn('marked_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('cleared_at', 'timestamptz')
    .addColumn('cleared_reason', 'text')
    .addUniqueConstraint('school_exam_absences_school_id_id_key', ['school_id', 'id'])
    .addForeignKeyConstraint(
      'school_exam_absences_exam_fk',
      ['school_id', 'exam_id'],
      'school_exams',
      ['school_id', 'id'],
      (cb) => cb.onDelete('restrict'),
    )
    .addForeignKeyConstraint(
      'school_exam_absences_student_fk',
      ['school_id', 'school_student_id'],
      'school_students',
      ['school_id', 'id'],
      (cb) => cb.onDelete('restrict'),
    )
    .execute()
  await sql`create unique index school_exam_absences_open on school_exam_absences (exam_id, school_student_id) where cleared_at is null`.execute(
    db,
  )

  await db.schema
    .createTable('school_print_jobs')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('school_id', 'uuid', (col) =>
      col.notNull().references('schools.id').onDelete('restrict'),
    )
    .addColumn('exam_id', 'uuid', (col) => col.notNull())
    .addColumn('kind', 'text', (col) =>
      col.notNull().check(sql`kind in ('booklets')`),
    )
    .addColumn('status', 'text', (col) =>
      col
        .notNull()
        .defaultTo('running')
        .check(sql`status in ('running', 'done', 'failed')`),
    )
    .addColumn('total', 'integer', (col) => col.notNull())
    .addColumn('done_count', 'integer', (col) => col.notNull().defaultTo(0))
    .addColumn('batch_size', 'integer', (col) =>
      col.notNull().check(sql`batch_size between 1 and 20`),
    )
    // The students to print, in order (school_students ids).
    .addColumn('student_ids', 'jsonb', (col) => col.notNull())
    .addColumn('message', 'text')
    // The joined PDF while the job is fresh; NULL after expires_at (the row stays).
    .addColumn('result', 'bytea')
    .addColumn('page_count', 'integer')
    .addColumn('created_by_user_id', 'uuid', (col) =>
      col.notNull().references('users.id').onDelete('restrict'),
    )
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('finished_at', 'timestamptz')
    .addColumn('expires_at', 'timestamptz', (col) => col.notNull())
    .addUniqueConstraint('school_print_jobs_school_id_id_key', ['school_id', 'id'])
    .addForeignKeyConstraint(
      'school_print_jobs_exam_fk',
      ['school_id', 'exam_id'],
      'school_exams',
      ['school_id', 'id'],
      (cb) => cb.onDelete('restrict'),
    )
    .execute()

  await db.schema
    .createTable('school_print_job_parts')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('school_id', 'uuid', (col) =>
      col.notNull().references('schools.id').onDelete('restrict'),
    )
    .addColumn('job_id', 'uuid', (col) => col.notNull())
    .addColumn('seq', 'integer', (col) => col.notNull())
    .addColumn('students', 'integer', (col) => col.notNull())
    .addColumn('pages', 'integer', (col) => col.notNull())
    // One batch as a PDF; NULL once the job is joined.
    .addColumn('pdf', 'bytea')
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addUniqueConstraint('school_print_job_parts_school_id_id_key', ['school_id', 'id'])
    .addUniqueConstraint('school_print_job_parts_seq_key', ['job_id', 'seq'])
    .addForeignKeyConstraint(
      'school_print_job_parts_job_fk',
      ['school_id', 'job_id'],
      'school_print_jobs',
      ['school_id', 'id'],
      (cb) => cb.onDelete('restrict'),
    )
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('school_print_job_parts').execute()
  await db.schema.dropTable('school_print_jobs').execute()
  await db.schema.dropTable('school_exam_absences').execute()
  await db.schema.dropTable('school_scan_pages').execute()
  await db.schema.dropTable('school_scan_batches').execute()
}
