import type { Kysely } from 'kysely'
import { sql } from 'kysely'

// Step 3, the rest: answer sheets written on a school's OWN paper (owner direction 2026-10-29).
//
// school_own_covers: the QR cover page PrepPlan prints for each student of a class, to staple on top of
// her answer sheets. `token` is derived from a secret (the same way the exam booklet codes are), so a
// cover can be printed again identically, and it names one student of one own paper of one school.
//
// school_own_sheets: every scanned page of those answer sheets. A 'cover' page carries the QR and starts a
// student's stack; the pages after it belong to her until the next cover. When there is no cover, the
// teacher names the student (the fallback: one upload per student, files named by roll number) or the page
// waits as 'unplaced'. Files are sealed in private storage (image_key = the straightened cover, original_key
// = the file exactly as uploaded); the row stays after the files are deleted at the school's retention.
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('school_own_covers')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('school_id', 'uuid', (col) => col.notNull().references('schools.id').onDelete('restrict'))
    .addColumn('paper_id', 'uuid', (col) => col.notNull())
    .addColumn('school_student_id', 'uuid', (col) => col.notNull())
    .addColumn('token', 'text', (col) => col.notNull())
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addUniqueConstraint('school_own_covers_school_id_id_key', ['school_id', 'id'])
    .addUniqueConstraint('school_own_covers_paper_student_key', ['paper_id', 'school_student_id'])
    .addUniqueConstraint('school_own_covers_token_key', ['token'])
    .addForeignKeyConstraint('school_own_covers_paper_fk', ['school_id', 'paper_id'], 'school_own_papers', ['school_id', 'id'], (cb) => cb.onDelete('restrict'))
    .addForeignKeyConstraint('school_own_covers_student_fk', ['school_id', 'school_student_id'], 'school_students', ['school_id', 'id'], (cb) => cb.onDelete('restrict'))
    .execute()

  await db.schema
    .createTable('school_own_sheets')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('school_id', 'uuid', (col) => col.notNull().references('schools.id').onDelete('restrict'))
    .addColumn('paper_id', 'uuid', (col) => col.notNull())
    .addColumn('school_student_id', 'uuid')
    .addColumn('kind', 'text', (col) => col.notNull().check(sql`kind in ('cover', 'page')`))
    .addColumn('status', 'text', (col) => col.notNull().check(sql`status in ('placed', 'unplaced', 'rejected')`))
    .addColumn('placed_by', 'text', (col) => col.check(sql`placed_by in ('cover', 'order', 'teacher')`))
    // the page's place in the student's stack (a cover is 0), counted in the order the pages were sent
    .addColumn('seq', 'integer')
    .addColumn('reason', 'text')
    .addColumn('original_name', 'text')
    .addColumn('size_bytes', 'integer')
    .addColumn('original_key', 'text')
    .addColumn('image_key', 'text')
    .addColumn('purged_at', 'timestamptz')
    .addColumn('uploaded_by_user_id', 'uuid', (col) => col.notNull().references('users.id').onDelete('restrict'))
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addUniqueConstraint('school_own_sheets_school_id_id_key', ['school_id', 'id'])
    .addForeignKeyConstraint('school_own_sheets_paper_fk', ['school_id', 'paper_id'], 'school_own_papers', ['school_id', 'id'], (cb) => cb.onDelete('restrict'))
    .addForeignKeyConstraint('school_own_sheets_student_fk', ['school_id', 'school_student_id'], 'school_students', ['school_id', 'id'], (cb) => cb.onDelete('restrict'))
    .execute()
  // pieces of a big file on its way up can belong to an own paper as well as to an exam
  await sql`alter table school_scan_chunks alter column exam_id drop not null`.execute(db)
  await db.schema.alterTable('school_scan_chunks').addColumn('own_paper_id', 'uuid').execute()
  await sql`alter table school_scan_chunks add constraint school_scan_chunks_own_paper_fk foreign key (school_id, own_paper_id) references school_own_papers (school_id, id) on delete restrict`.execute(db)
  await sql`alter table school_scan_chunks add constraint school_scan_chunks_one_owner check ((exam_id is null) <> (own_paper_id is null))`.execute(db)
  await db.schema.createIndex('school_own_sheets_paper_idx').on('school_own_sheets').columns(['paper_id', 'school_student_id', 'seq']).execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`alter table school_scan_chunks drop constraint school_scan_chunks_one_owner`.execute(db)
  await sql`alter table school_scan_chunks drop constraint school_scan_chunks_own_paper_fk`.execute(db)
  await db.schema.alterTable('school_scan_chunks').dropColumn('own_paper_id').execute()
  await sql`delete from school_scan_chunks where exam_id is null`.execute(db)
  await sql`alter table school_scan_chunks alter column exam_id set not null`.execute(db)
  await db.schema.dropTable('school_own_sheets').execute()
  await db.schema.dropTable('school_own_covers').execute()
}
