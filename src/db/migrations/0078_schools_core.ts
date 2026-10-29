import type { Kysely } from 'kysely'
import { sql } from 'kysely'

// PrepPlan for Schools, step S1 (docs/SCHOOLS_MODULE_PLAN.md, ADR-0003). No F-number covers this yet.
//
// A school is its own tenant root. Every school-side table carries school_id NOT NULL and exposes
// unique (school_id, id), and any foreign key between two school tables is COMPOSITE on
// (school_id, parent_id), so the database itself refuses a row whose parent belongs to another
// school. This is under, not instead of, the repository filter (createSchoolScopedRepository).
//
// Numbered 0078 because 0077 is taken by the unmerged WhatsApp-login branch (0077_wa_login).
//
// schools.household_id is a household created for the school: the existing billing/ownership
// unit, and what keeps audit_log.household_id NOT NULL for later school events.
// users.role is NOT widened: school roles live in school_members.role.
// Nothing here uses ON DELETE CASCADE: school data is never deleted (CLAUDE.md invariant 4).
//
// school_terms_acceptances replaces any per-student consent record (owner decision 2026-10-29).
// It is append-only, enforced by a trigger that rejects UPDATE and DELETE.
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('schools')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('household_id', 'uuid', (col) =>
      col.notNull().references('households.id').onDelete('restrict'),
    )
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('code', 'text', (col) => col.notNull().unique())
    .addColumn('board', 'text', (col) => col.notNull().defaultTo('CBSE'))
    .addColumn('city', 'text')
    .addColumn('status', 'text', (col) =>
      col
        .notNull()
        .defaultTo('active')
        .check(sql`status in ('active', 'suspended')`),
    )
    // The student dispute window after results are released.
    .addColumn('dispute_window_days', 'integer', (col) =>
      col
        .notNull()
        .defaultTo(7)
        .check(sql`dispute_window_days between 1 and 60`),
    )
    // Share of unflagged AI-marked answers queued for a teacher spot-check.
    .addColumn('sample_rate', sql`numeric(4, 3)`, (col) =>
      col
        .notNull()
        .defaultTo(0.05)
        .check(sql`sample_rate between 0 and 1`),
    )
    .addColumn('scan_retention_days', 'integer', (col) =>
      col
        .notNull()
        .defaultTo(60)
        .check(sql`scan_retention_days >= 30`),
    )
    .addColumn('plan', 'text', (col) => col.notNull().defaultTo('pilot'))
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .execute()

  await db.schema
    .createTable('school_terms_acceptances')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('school_id', 'uuid', (col) =>
      col.notNull().references('schools.id').onDelete('restrict'),
    )
    .addColumn('accepted_by_user_id', 'uuid', (col) =>
      col.notNull().references('users.id').onDelete('restrict'),
    )
    .addColumn('accepted_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('terms_version', 'text', (col) => col.notNull())
    .addColumn('accepted_ip', 'text')
    .addUniqueConstraint('school_terms_acceptances_school_id_id_key', [
      'school_id',
      'id',
    ])
    .addUniqueConstraint('school_terms_acceptances_version_key', [
      'school_id',
      'terms_version',
    ])
    .execute()

  await sql`
    create function school_block_mutation() returns trigger as $$
    begin
      raise exception '% on % is not allowed: school records are append-only', tg_op, tg_table_name;
    end;
    $$ language plpgsql
  `.execute(db)
  await sql`
    create trigger school_terms_acceptances_append_only
    before update or delete on school_terms_acceptances
    for each row execute function school_block_mutation()
  `.execute(db)

  await db.schema
    .createTable('school_members')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('school_id', 'uuid', (col) =>
      col.notNull().references('schools.id').onDelete('restrict'),
    )
    .addColumn('user_id', 'uuid', (col) =>
      col.notNull().references('users.id').onDelete('restrict'),
    )
    .addColumn('role', 'text', (col) =>
      col
        .notNull()
        .check(
          sql`role in ('school_admin', 'principal', 'teacher', 'student', 'parent')`,
        ),
    )
    .addColumn('status', 'text', (col) =>
      col
        .notNull()
        .defaultTo('active')
        .check(sql`status in ('active', 'inactive')`),
    )
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addUniqueConstraint('school_members_school_id_id_key', ['school_id', 'id'])
    .addUniqueConstraint('school_members_school_user_role_key', [
      'school_id',
      'user_id',
      'role',
    ])
    .execute()
  await db.schema
    .createIndex('school_members_user_idx')
    .on('school_members')
    .column('user_id')
    .execute()

  await db.schema
    .createTable('school_classes')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('school_id', 'uuid', (col) =>
      col.notNull().references('schools.id').onDelete('restrict'),
    )
    .addColumn('grade', 'integer', (col) =>
      col.notNull().check(sql`grade between 1 and 12`),
    )
    .addColumn('academic_year', 'text', (col) => col.notNull())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addUniqueConstraint('school_classes_school_id_id_key', ['school_id', 'id'])
    .addUniqueConstraint('school_classes_school_grade_year_key', [
      'school_id',
      'grade',
      'academic_year',
    ])
    .execute()

  await db.schema
    .createTable('school_sections')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('school_id', 'uuid', (col) =>
      col.notNull().references('schools.id').onDelete('restrict'),
    )
    .addColumn('class_id', 'uuid', (col) => col.notNull())
    .addColumn('name', 'text', (col) => col.notNull())
    // Does the sample check by default. Must be a teacher of this school: checked by the service.
    .addColumn('class_teacher_member_id', 'uuid')
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addUniqueConstraint('school_sections_school_id_id_key', [
      'school_id',
      'id',
    ])
    .addUniqueConstraint('school_sections_class_name_key', ['class_id', 'name'])
    .addForeignKeyConstraint(
      'school_sections_class_fk',
      ['school_id', 'class_id'],
      'school_classes',
      ['school_id', 'id'],
      (cb) => cb.onDelete('restrict'),
    )
    // MATCH SIMPLE: not checked while class_teacher_member_id is null, composite once it is set.
    .addForeignKeyConstraint(
      'school_sections_class_teacher_fk',
      ['school_id', 'class_teacher_member_id'],
      'school_members',
      ['school_id', 'id'],
      (cb) => cb.onDelete('restrict'),
    )
    .execute()

  await db.schema
    .createTable('school_subjects')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('school_id', 'uuid', (col) =>
      col.notNull().references('schools.id').onDelete('restrict'),
    )
    .addColumn('class_id', 'uuid', (col) => col.notNull())
    // The global (board, class, code) subject, so a school can only teach what has a bank.
    .addColumn('subject_id', 'uuid', (col) =>
      col.notNull().references('subjects.id').onDelete('restrict'),
    )
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addUniqueConstraint('school_subjects_school_id_id_key', [
      'school_id',
      'id',
    ])
    .addUniqueConstraint('school_subjects_class_subject_key', [
      'class_id',
      'subject_id',
    ])
    .addForeignKeyConstraint(
      'school_subjects_class_fk',
      ['school_id', 'class_id'],
      'school_classes',
      ['school_id', 'id'],
      (cb) => cb.onDelete('restrict'),
    )
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('school_subjects').execute()
  await db.schema.dropTable('school_sections').execute()
  await db.schema.dropTable('school_classes').execute()
  await db.schema.dropTable('school_members').execute()
  await sql`drop trigger school_terms_acceptances_append_only on school_terms_acceptances`.execute(
    db,
  )
  await sql`drop function school_block_mutation()`.execute(db)
  await db.schema.dropTable('school_terms_acceptances').execute()
  await db.schema.dropTable('schools').execute()
}
