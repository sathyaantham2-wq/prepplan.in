import type { Kysely } from 'kysely'
import { sql } from 'kysely'

// PrepPlan for Schools, step S2 (docs/SCHOOLS_MODULE_PLAN.md, ADR-0003): roster, teacher
// assignments, bulk-import batches, the purpose-limit marker on students, and audit_log.school_id.
//
// students.school_id is the marker CLAUDE.md "School module rules" rely on: null for a PrepPlan
// student, set for a school student. unique (school_id, id) on students lets school_students point
// at (school_id, student_id), so the database guarantees the two agree.
//
// school_sections and school_subjects gain unique (school_id, class_id, id) so an assignment can
// reference both through class_id and a teacher can never be assigned a subject that is not taught
// in the section's class.
//
// There is NO consent table or column here (owner decision 2026-10-29): the per-school terms
// acceptance from 0078 is the record.
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('students')
    .addColumn('school_id', 'uuid', (col) =>
      col.references('schools.id').onDelete('restrict'),
    )
    .execute()
  await sql`alter table students add constraint students_school_id_id_key unique (school_id, id)`.execute(
    db,
  )
  await db.schema
    .createIndex('students_school_idx')
    .on('students')
    .column('school_id')
    .where(sql.ref('school_id'), 'is not', null)
    .execute()

  await sql`alter table school_sections add constraint school_sections_school_class_id_key unique (school_id, class_id, id)`.execute(
    db,
  )
  await sql`alter table school_subjects add constraint school_subjects_school_class_id_key unique (school_id, class_id, id)`.execute(
    db,
  )

  await db.schema
    .alterTable('audit_log')
    .addColumn('school_id', 'uuid', (col) =>
      col.references('schools.id').onDelete('restrict'),
    )
    .execute()
  await db.schema
    .createIndex('audit_log_school_idx')
    .on('audit_log')
    .columns(['school_id', 'created_at'])
    .where(sql.ref('school_id'), 'is not', null)
    .execute()

  await db.schema
    .createTable('school_students')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('school_id', 'uuid', (col) =>
      col.notNull().references('schools.id').onDelete('restrict'),
    )
    .addColumn('student_id', 'uuid', (col) => col.notNull().unique())
    .addColumn('member_id', 'uuid', (col) => col.notNull().unique())
    .addColumn('section_id', 'uuid', (col) => col.notNull())
    .addColumn('roll_no', 'text', (col) => col.notNull())
    .addColumn('status', 'text', (col) =>
      col
        .notNull()
        .defaultTo('active')
        .check(sql`status in ('active', 'inactive', 'left')`),
    )
    .addColumn('created_by_user_id', 'uuid', (col) =>
      col.notNull().references('users.id').onDelete('restrict'),
    )
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addUniqueConstraint('school_students_school_id_id_key', [
      'school_id',
      'id',
    ])
    .addUniqueConstraint('school_students_section_roll_key', [
      'section_id',
      'roll_no',
    ])
    .addForeignKeyConstraint(
      'school_students_student_fk',
      ['school_id', 'student_id'],
      'students',
      ['school_id', 'id'],
      (cb) => cb.onDelete('restrict'),
    )
    .addForeignKeyConstraint(
      'school_students_member_fk',
      ['school_id', 'member_id'],
      'school_members',
      ['school_id', 'id'],
      (cb) => cb.onDelete('restrict'),
    )
    .addForeignKeyConstraint(
      'school_students_section_fk',
      ['school_id', 'section_id'],
      'school_sections',
      ['school_id', 'id'],
      (cb) => cb.onDelete('restrict'),
    )
    .execute()

  await db.schema
    .createTable('school_student_guardians')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('school_id', 'uuid', (col) =>
      col.notNull().references('schools.id').onDelete('restrict'),
    )
    .addColumn('school_student_id', 'uuid', (col) => col.notNull())
    .addColumn('name', 'text')
    .addColumn('phone_e164', 'text', (col) =>
      col.notNull().check(sql`phone_e164 ~ '^\\+[1-9][0-9]{7,14}$'`),
    )
    // Set when the parent signs in (a later step). Null means a phone number on a roster, nothing more.
    .addColumn('user_id', 'uuid', (col) =>
      col.references('users.id').onDelete('restrict'),
    )
    .addColumn('verified_at', 'timestamptz')
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addUniqueConstraint('school_student_guardians_school_id_id_key', [
      'school_id',
      'id',
    ])
    .addUniqueConstraint('school_student_guardians_student_phone_key', [
      'school_student_id',
      'phone_e164',
    ])
    .addForeignKeyConstraint(
      'school_student_guardians_student_fk',
      ['school_id', 'school_student_id'],
      'school_students',
      ['school_id', 'id'],
      (cb) => cb.onDelete('restrict'),
    )
    .execute()

  // One teacher per section-subject. sample_checker says who spot-checks the AI's marks for the
  // pair: the section's class teacher (default) or this subject teacher. Only the school admin
  // may change it (service rule, audited).
  await db.schema
    .createTable('school_teacher_assignments')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('school_id', 'uuid', (col) =>
      col.notNull().references('schools.id').onDelete('restrict'),
    )
    .addColumn('member_id', 'uuid', (col) => col.notNull())
    .addColumn('class_id', 'uuid', (col) => col.notNull())
    .addColumn('section_id', 'uuid', (col) => col.notNull())
    .addColumn('school_subject_id', 'uuid', (col) => col.notNull())
    .addColumn('sample_checker', 'text', (col) =>
      col
        .notNull()
        .defaultTo('class_teacher')
        .check(sql`sample_checker in ('class_teacher', 'subject_teacher')`),
    )
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addUniqueConstraint('school_teacher_assignments_school_id_id_key', [
      'school_id',
      'id',
    ])
    .addUniqueConstraint('school_teacher_assignments_pair_key', [
      'section_id',
      'school_subject_id',
    ])
    .addForeignKeyConstraint(
      'school_teacher_assignments_member_fk',
      ['school_id', 'member_id'],
      'school_members',
      ['school_id', 'id'],
      (cb) => cb.onDelete('restrict'),
    )
    .addForeignKeyConstraint(
      'school_teacher_assignments_section_fk',
      ['school_id', 'class_id', 'section_id'],
      'school_sections',
      ['school_id', 'class_id', 'id'],
      (cb) => cb.onDelete('restrict'),
    )
    .addForeignKeyConstraint(
      'school_teacher_assignments_subject_fk',
      ['school_id', 'class_id', 'school_subject_id'],
      'school_subjects',
      ['school_id', 'class_id', 'id'],
      (cb) => cb.onDelete('restrict'),
    )
    .execute()
  await db.schema
    .createIndex('school_teacher_assignments_member_idx')
    .on('school_teacher_assignments')
    .column('member_id')
    .execute()

  // A roster upload: dry run first (payload holds the validated rows exactly as previewed), then
  // commit applies that payload. Kept after commit as the record of what was loaded.
  await db.schema
    .createTable('school_import_batches')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('school_id', 'uuid', (col) =>
      col.notNull().references('schools.id').onDelete('restrict'),
    )
    .addColumn('kind', 'text', (col) =>
      col.notNull().check(sql`kind in ('students', 'teachers')`),
    )
    .addColumn('academic_year', 'text')
    .addColumn('file_name', 'text', (col) => col.notNull())
    .addColumn('file_sha256', 'text', (col) => col.notNull())
    .addColumn('status', 'text', (col) =>
      col
        .notNull()
        .defaultTo('dry_run')
        .check(sql`status in ('dry_run', 'committed', 'failed')`),
    )
    .addColumn('counts', 'jsonb', (col) =>
      col.notNull().defaultTo(sql`'{}'::jsonb`),
    )
    .addColumn('row_errors', 'jsonb', (col) =>
      col.notNull().defaultTo(sql`'[]'::jsonb`),
    )
    .addColumn('payload', 'jsonb', (col) =>
      col.notNull().defaultTo(sql`'[]'::jsonb`),
    )
    .addColumn('created_by_user_id', 'uuid', (col) =>
      col.notNull().references('users.id').onDelete('restrict'),
    )
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('committed_at', 'timestamptz')
    .addUniqueConstraint('school_import_batches_school_id_id_key', [
      'school_id',
      'id',
    ])
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  // A school student must never be silently turned into a PrepPlan student by dropping the marker.
  const marked = await sql<{
    n: string
  }>`select count(*)::text as n from students where school_id is not null`.execute(
    db,
  )
  if (Number(marked.rows[0].n) > 0) {
    throw new Error(
      'Refusing to drop students.school_id: school students exist. Remove them deliberately first.',
    )
  }
  await db.schema.dropTable('school_import_batches').execute()
  await db.schema.dropTable('school_teacher_assignments').execute()
  await db.schema.dropTable('school_student_guardians').execute()
  await db.schema.dropTable('school_students').execute()
  await db.schema.dropIndex('audit_log_school_idx').execute()
  await db.schema.alterTable('audit_log').dropColumn('school_id').execute()
  await sql`alter table school_subjects drop constraint school_subjects_school_class_id_key`.execute(
    db,
  )
  await sql`alter table school_sections drop constraint school_sections_school_class_id_key`.execute(
    db,
  )
  await db.schema.dropIndex('students_school_idx').execute()
  await sql`alter table students drop constraint students_school_id_id_key`.execute(
    db,
  )
  await db.schema.alterTable('students').dropColumn('school_id').execute()
}
