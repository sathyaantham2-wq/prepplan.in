import type { Kysely } from 'kysely'
import { sql } from 'kysely'

// PrepPlan for Schools, M1 (owner direction 2026-10-29): the first-sign-in wizard and the demo school.
//
// schools.wizard_step / wizard_done_at: where the admin is in the setup wizard (only the position;
//   every answer goes through the normal services). Null done_at with a null step means "not started".
// schools.is_demo: a demo school (created only by the provisioning script, never from the web). Demo
//   data lives under the demo school's own school_id like any tenant.
// schools.ai_spend_cap_inr: a spend cap in rupees for the AI steps (M3, M4 enforce it; M1 spends nothing).
// school_exams.archived_at: "Reset demo" archives a demo school's exams; nothing is deleted.
// school_demo_results: the generated sample results of one exam of a demo school (student reports, habit
//   heatmap, flags). Only a demo school can have rows (checked by the service); a reset sets
//   archived_at.
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('schools')
    .addColumn('is_demo', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('ai_spend_cap_inr', sql`numeric(10,2)`)
    .addColumn('wizard_step', 'text')
    .addColumn('wizard_done_at', 'timestamptz')
    .execute()
  await db.schema.alterTable('school_exams').addColumn('archived_at', 'timestamptz').execute()
  // the mobile number the admin gives in the wizard (E.164); staff only, never used for marketing
  await db.schema.alterTable('school_members').addColumn('phone_e164', 'text').execute()
  await db.schema
    .createTable('school_demo_results')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('school_id', 'uuid', (col) => col.notNull().references('schools.id').onDelete('restrict'))
    .addColumn('exam_id', 'uuid', (col) => col.notNull())
    .addColumn('payload', 'jsonb', (col) => col.notNull())
    .addColumn('created_by_user_id', 'uuid', (col) => col.notNull().references('users.id').onDelete('restrict'))
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('archived_at', 'timestamptz')
    .addUniqueConstraint('school_demo_results_school_id_id_key', ['school_id', 'id'])
    .addForeignKeyConstraint('school_demo_results_exam_fk', ['school_id', 'exam_id'], 'school_exams', ['school_id', 'id'], (cb) =>
      cb.onDelete('restrict'),
    )
    .execute()
  await sql`create unique index school_demo_results_one_open on school_demo_results (exam_id) where archived_at is null`.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('school_members').dropColumn('phone_e164').execute()
  await db.schema.dropTable('school_demo_results').execute()
  await db.schema.alterTable('school_exams').dropColumn('archived_at').execute()
  await db.schema
    .alterTable('schools')
    .dropColumn('is_demo')
    .dropColumn('ai_spend_cap_inr')
    .dropColumn('wizard_step')
    .dropColumn('wizard_done_at')
    .execute()
}
