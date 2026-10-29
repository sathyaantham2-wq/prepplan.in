import type { Kysely } from 'kysely'
import { sql } from 'kysely'

// S6 follow-up: nothing the school uploads is shrunk or re-encoded.
//
// school_scan_pages.original: the file exactly as it was uploaded (a phone photo, or one page of a
// scanned PDF), sealed with AES-256-GCM like `image`. `image` stays the straightened A4 copy used to
// show the page and to mark it; `original` is the evidence. Both are blanked together when the
// school's retention period passes (the row stays).
//
// school_scan_chunks: a hosting platform limits one request to about 4.5 MB, and an original phone
// photo can be bigger, so the browser sends a file in pieces of at most 3.5 MB and the server joins
// them when the page is submitted. A piece is kept until it is joined (data set to NULL, consumed_at
// set; the row stays) or until a day has passed without being joined (data blanked).
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('school_scan_pages').addColumn('original', 'bytea').execute()
  await db.schema
    .createTable('school_scan_chunks')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('school_id', 'uuid', (col) => col.notNull().references('schools.id').onDelete('restrict'))
    .addColumn('exam_id', 'uuid', (col) => col.notNull())
    .addColumn('upload_id', 'uuid', (col) => col.notNull())
    .addColumn('seq', 'integer', (col) => col.notNull().check(sql`seq between 0 and 7`))
    .addColumn('data', 'bytea')
    .addColumn('size_bytes', 'integer', (col) => col.notNull())
    .addColumn('created_by_user_id', 'uuid', (col) => col.notNull().references('users.id').onDelete('restrict'))
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('consumed_at', 'timestamptz')
    .addUniqueConstraint('school_scan_chunks_school_id_id_key', ['school_id', 'id'])
    .addUniqueConstraint('school_scan_chunks_upload_seq_key', ['upload_id', 'seq'])
    .addForeignKeyConstraint(
      'school_scan_chunks_exam_fk',
      ['school_id', 'exam_id'],
      'school_exams',
      ['school_id', 'id'],
      (cb) => cb.onDelete('restrict'),
    )
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('school_scan_chunks').execute()
  await db.schema.alterTable('school_scan_pages').dropColumn('original').execute()
}
