import type { Kysely } from 'kysely'
import { sql } from 'kysely'

// PrepPlan for Schools, step S4: paper layouts ("templates") saved per school.
//
// A template is the school's own marks pattern: total marks, duration, sections (heading, kind of
// question, how many, marks each, how many have an OR), and the wanted mix of thinking levels. It
// is stored as the teacher edits it (`sections` jsonb) and turned into the existing blueprint
// Layout shape by src/lib/schools/templates.ts when a paper is built, so the paper generator and
// its pre-show checks are reused unchanged.
//
// Editing never changes a row: it adds version + 1 under the same template_key and retires the
// old version, so an exam can pin the exact version it was built from (nothing is deleted).
// Only one version of a template is active at a time.
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('school_paper_templates')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('school_id', 'uuid', (col) =>
      col.notNull().references('schools.id').onDelete('restrict'),
    )
    .addColumn('template_key', 'uuid', (col) => col.notNull())
    .addColumn('version', 'integer', (col) =>
      col.notNull().check(sql`version >= 1`),
    )
    .addColumn('status', 'text', (col) =>
      col
        .notNull()
        .defaultTo('active')
        .check(sql`status in ('active', 'retired')`),
    )
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('total_marks', 'integer', (col) =>
      col.notNull().check(sql`total_marks between 1 and 200`),
    )
    .addColumn('duration_min', 'integer', (col) =>
      col.notNull().check(sql`duration_min between 15 and 300`),
    )
    // { recall_understanding, application, analysis_evaluation } in whole percent, adding to 100.
    .addColumn('level_mix', 'jsonb', (col) => col.notNull())
    .addColumn('sections', 'jsonb', (col) => col.notNull())
    // 'cbse_80' or 'unit_test_40' when it began as one of the ready-made layouts.
    .addColumn('based_on', 'text')
    .addColumn('created_by_user_id', 'uuid', (col) =>
      col.notNull().references('users.id').onDelete('restrict'),
    )
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addUniqueConstraint('school_paper_templates_school_id_id_key', [
      'school_id',
      'id',
    ])
    .addUniqueConstraint('school_paper_templates_key_version_key', [
      'school_id',
      'template_key',
      'version',
    ])
    .execute()
  await sql`create unique index school_paper_templates_one_active on school_paper_templates (school_id, template_key) where status = 'active'`.execute(
    db,
  )
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('school_paper_templates').execute()
}
