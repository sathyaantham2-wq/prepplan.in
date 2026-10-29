import type { Kysely } from 'kysely'
import { sql } from 'kysely'

// PrepPlan for Schools, step S2c: how school people get a password (owner decisions 2026-10-29).
//
//  - Staff (admin, teachers): a one-time set-password link by e-mail, or a printed one-time code.
//  - Students: school code + admission number + password. The class teacher
//    prints one-time code slips for the section; the student sets her own password on first
//    sign-in. The class teacher can reset it; every reset is audited.
//  - Parents: no login in Phase 1.
//
// A code works once and expires after 7 days. Only a keyed hash of a code is stored, never the
// code itself. created_by_user_id is null when the platform provisioning script issued it.
// Failed sign-ins on a school account are counted on the membership so a code or password cannot
// be guessed: five failures lock it for 15 minutes.
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('school_credential_codes')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('school_id', 'uuid', (col) =>
      col.notNull().references('schools.id').onDelete('restrict'),
    )
    .addColumn('member_id', 'uuid', (col) => col.notNull())
    .addColumn('kind', 'text', (col) =>
      col
        .notNull()
        .check(sql`kind in ('staff_link', 'staff_code', 'student_code')`),
    )
    .addColumn('code_hash', 'text', (col) => col.notNull())
    .addColumn('expires_at', 'timestamptz', (col) => col.notNull())
    .addColumn('used_at', 'timestamptz')
    // Set when a newer code for the same person replaces this one, or a password reset ends it.
    .addColumn('revoked_at', 'timestamptz')
    .addColumn('created_by_user_id', 'uuid', (col) =>
      col.references('users.id').onDelete('restrict'),
    )
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addUniqueConstraint('school_credential_codes_school_id_id_key', [
      'school_id',
      'id',
    ])
    .addUniqueConstraint('school_credential_codes_hash_key', ['code_hash'])
    .addForeignKeyConstraint(
      'school_credential_codes_member_fk',
      ['school_id', 'member_id'],
      'school_members',
      ['school_id', 'id'],
      (cb) => cb.onDelete('restrict'),
    )
    .execute()
  await db.schema
    .createIndex('school_credential_codes_member_idx')
    .on('school_credential_codes')
    .column('member_id')
    .execute()

  // The student's permanent sign-in ID: the school's admission number. It never changes when she is
  // promoted (class, section and roll number do). Unique per school, ignoring case. A roster row
  // with no admission number gets a generated one (see src/lib/schools/people.ts).
  await db.schema.alterTable('school_students').addColumn('admission_no', 'text').execute()
  await sql`update school_students set admission_no = 'MIG-' || substr(id::text, 1, 8) where admission_no is null`.execute(db)
  await sql`alter table school_students alter column admission_no set not null`.execute(db)
  await sql`alter table school_students add constraint school_students_admission_no_format check (admission_no ~ '^[A-Za-z0-9][A-Za-z0-9/._-]{0,29}$')`.execute(db)
  await sql`create unique index school_students_admission_key on school_students (school_id, upper(admission_no))`.execute(db)

  await db.schema
    .alterTable('school_members')
    .addColumn('failed_logins', 'integer', (col) => col.notNull().defaultTo(0))
    .addColumn('locked_until', 'timestamptz')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`drop index school_students_admission_key`.execute(db)
  await sql`alter table school_students drop constraint school_students_admission_no_format`.execute(db)
  await db.schema.alterTable('school_students').dropColumn('admission_no').execute()
  await db.schema
    .alterTable('school_members')
    .dropColumn('locked_until')
    .dropColumn('failed_logins')
    .execute()
  await db.schema.dropTable('school_credential_codes').execute()
}
