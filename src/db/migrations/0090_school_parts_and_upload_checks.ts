import type { Kysely } from 'kysely'
import { sql } from 'kysely'

// Owner direction 2026-10-30 (SCHOOLS_MODULE_PLAN.md section 12).
//
// schools.modules: which parts of PrepPlan the school uses, 'papers' (make exam papers) and/or
// 'correction' (AI correction of answer sheets). Chosen at the end of the set-up, changeable in Settings.
// The home screen and the tabs show only the chosen parts; turning one off hides it and deletes nothing.
//
// school_own_papers.source_kind 'prepplan_exam': a paper made here, taken into AI correction directly
// (no file); its questions keep the bank's reviewed answers and still need a teacher's approval.
//
// school_own_sheets: answer pages are now uploaded student by student (the teacher chooses the student;
// no QR is needed). Each page is checked before marking: sha256 (an exact copy of a file) and thumb (the
// page shrunk to 32 x 32 grey pixels, base64; the same photo re-saved or resized correlates above 0.97
// with it, two different pages stay well below) find the same image under two students; check_state is where the checks stand, check_summary the plain reason shown to the teacher.
//
// school_upload_checks: one row per check per page, append-only: what was checked, the result, what the
// AI answered when it was asked, and who decided when a teacher was asked to confirm.
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('schools')
    .addColumn('modules', sql`text[]`, (col) =>
      col.notNull().defaultTo(sql`'{papers,correction}'::text[]`),
    )
    .execute()
  await sql`alter table schools add constraint schools_modules_check check (modules <@ array['papers','correction']::text[] and cardinality(modules) > 0)`.execute(
    db,
  )

  await sql`alter table school_own_papers drop constraint school_own_papers_source_kind_check`.execute(
    db,
  )
  await sql`alter table school_own_papers add constraint school_own_papers_source_kind_check check (source_kind in ('prepplan_docx', 'docx', 'pdf', 'images', 'prepplan_exam'))`.execute(
    db,
  )

  await db.schema
    .alterTable('school_own_sheets')
    .addColumn('sha256', 'text')
    .addColumn('thumb', 'text')
    .addColumn('check_state', 'text', (col) =>
      col.check(
        sql`check_state in ('pending', 'passed', 'needs_confirm', 'refused')`,
      ),
    )
    .addColumn('check_summary', 'text')
    .execute()
  await db.schema
    .createIndex('school_own_sheets_sha_idx')
    .on('school_own_sheets')
    .columns(['paper_id', 'sha256'])
    .execute()

  await db.schema
    .createTable('school_upload_checks')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('school_id', 'uuid', (col) =>
      col.notNull().references('schools.id').onDelete('restrict'),
    )
    .addColumn('sheet_id', 'uuid', (col) => col.notNull())
    .addColumn('check', 'text', (col) =>
      col
        .notNull()
        .check(
          sql`"check" in ('duplicate', 'blank', 'readable', 'name', 'page_kind', 'subject', 'teacher')`,
        ),
    )
    .addColumn('result', 'text', (col) =>
      col.notNull().check(sql`result in ('pass', 'unsure', 'fail', 'skipped')`),
    )
    .addColumn('detail', 'jsonb', (col) =>
      col.notNull().defaultTo(sql`'{}'::jsonb`),
    )
    .addColumn('ai_job_id', 'uuid')
    .addColumn('decided_by_user_id', 'uuid', (col) =>
      col.references('users.id').onDelete('restrict'),
    )
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addUniqueConstraint('school_upload_checks_school_id_id_key', [
      'school_id',
      'id',
    ])
    .addForeignKeyConstraint(
      'school_upload_checks_sheet_fk',
      ['school_id', 'sheet_id'],
      'school_own_sheets',
      ['school_id', 'id'],
      (cb) => cb.onDelete('restrict'),
    )
    .execute()
  await db.schema
    .createIndex('school_upload_checks_sheet_idx')
    .on('school_upload_checks')
    .columns(['sheet_id', 'created_at'])
    .execute()
  // append-only, like the audit log: a decision is never edited or removed, only followed by another
  await sql`
    create or replace function school_upload_checks_append_only() returns trigger language plpgsql as $$
    begin
      raise exception 'school_upload_checks is append-only';
    end $$`.execute(db)
  await sql`create trigger school_upload_checks_append_only before update or delete on school_upload_checks for each row execute function school_upload_checks_append_only()`.execute(
    db,
  )
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`drop trigger if exists school_upload_checks_append_only on school_upload_checks`.execute(
    db,
  )
  await sql`drop function if exists school_upload_checks_append_only()`.execute(
    db,
  )
  await db.schema.dropTable('school_upload_checks').execute()
  await db.schema.dropIndex('school_own_sheets_sha_idx').execute()
  await db.schema
    .alterTable('school_own_sheets')
    .dropColumn('check_summary')
    .dropColumn('check_state')
    .dropColumn('thumb')
    .dropColumn('sha256')
    .execute()
  // never deletes a school's papers: going back is refused while a paper of the new kind exists
  await sql`do $$ begin if exists (select 1 from school_own_papers where source_kind = 'prepplan_exam') then raise exception 'papers taken from a PrepPlan exam exist; 0090 cannot be undone'; end if; end $$`.execute(
    db,
  )
  await sql`alter table school_own_papers drop constraint school_own_papers_source_kind_check`.execute(
    db,
  )
  await sql`alter table school_own_papers add constraint school_own_papers_source_kind_check check (source_kind in ('prepplan_docx', 'docx', 'pdf', 'images'))`.execute(
    db,
  )
  await sql`alter table schools drop constraint schools_modules_check`.execute(
    db,
  )
  await db.schema.alterTable('schools').dropColumn('modules').execute()
}
