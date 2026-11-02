import type { Kysely } from 'kysely'
import { sql } from 'kysely'

// School messaging (pilot set, owner approval 2026-11-01; plan docs/schools/MESSAGING_PLAN.md). PrepPlan decides
// what is sent and to whom; the table below is the audit log of every message. It holds the template variables
// only (no body, no phone number: the number is read from the guardian row at send time) and the variables are
// purged after the school's retention period, leaving counts.
//
// school_parent_messaging: one row per student: the parent's WhatsApp contact permission (default NO), who
//   confirmed it and when, the language, and an opt-out (a STOP reply or the admin).
// school_messages: one row per message. dedupe_key makes every event idempotent.
// school_message_events: the status history of a message.
// school_message_counts: what remains after the variables are purged.
const MESSAGE_TEMPLATES = [
  'result_ready',
  'weekly_focus',
  'flags_waiting',
  'uploads_pending',
  'dispute_closing',
  'teacher_attention',
  'monday_pulse',
] as const

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('schools')
    .addColumn('messaging_enabled', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('message_log_days', 'integer', (col) =>
      col.notNull().defaultTo(365).check(sql`message_log_days between 30 and 1830`),
    )
    .execute()
  await db.schema
    .alterTable('school_members')
    .addColumn('message_language', 'text', (col) =>
      col.notNull().defaultTo('en').check(sql`message_language in ('en', 'te')`),
    )
    .execute()

  await db.schema
    .createTable('school_parent_messaging')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('school_id', 'uuid', (col) => col.notNull().references('schools.id').onDelete('restrict'))
    .addColumn('school_student_id', 'uuid', (col) => col.notNull())
    .addColumn('whatsapp_ok', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('language', 'text', (col) => col.notNull().defaultTo('en').check(sql`language in ('en', 'te')`))
    .addColumn('confirmed_by_user_id', 'uuid', (col) => col.references('users.id').onDelete('restrict'))
    .addColumn('confirmed_at', 'timestamptz')
    .addColumn('opted_out_at', 'timestamptz')
    .addColumn('opted_out_how', 'text', (col) => col.check(sql`opted_out_how in ('stop_reply', 'admin')`))
    .addColumn('updated_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addUniqueConstraint('school_parent_messaging_school_id_id_key', ['school_id', 'id'])
    .addUniqueConstraint('school_parent_messaging_one_per_student', ['school_id', 'school_student_id'])
    .addForeignKeyConstraint(
      'school_parent_messaging_student_fk',
      ['school_id', 'school_student_id'],
      'school_students',
      ['school_id', 'id'],
      (cb) => cb.onDelete('restrict'),
    )
    .addCheckConstraint(
      'school_parent_messaging_confirmed',
      sql`(whatsapp_ok = false) or (confirmed_by_user_id is not null and confirmed_at is not null)`,
    )
    .execute()

  const names = sql.join(MESSAGE_TEMPLATES.map((t) => sql.lit(t)))
  await db.schema
    .createTable('school_messages')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('school_id', 'uuid', (col) => col.notNull().references('schools.id').onDelete('restrict'))
    .addColumn('template', 'text', (col) => col.notNull().check(sql`template in (${names})`))
    .addColumn('audience', 'text', (col) => col.notNull().check(sql`audience in ('parent', 'teacher', 'principal')`))
    .addColumn('recipient_student_id', 'uuid')
    .addColumn('recipient_guardian_id', 'uuid')
    .addColumn('recipient_member_id', 'uuid')
    .addColumn('language', 'text', (col) => col.notNull().check(sql`language in ('en', 'te')`))
    .addColumn('status', 'text', (col) =>
      col
        .notNull()
        .defaultTo('queued')
        .check(
          sql`status in ('queued', 'held', 'not_sent', 'sending', 'sent', 'delivered', 'read', 'failed', 'skipped')`,
        ),
    )
    .addColumn('reason', 'text')
    .addColumn('variables', 'jsonb')
    .addColumn('dedupe_key', 'text', (col) => col.notNull())
    .addColumn('not_before', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('attempts', 'integer', (col) => col.notNull().defaultTo(0))
    .addColumn('next_attempt_at', 'timestamptz')
    .addColumn('sent_at', 'timestamptz')
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('variables_purged_at', 'timestamptz')
    .addUniqueConstraint('school_messages_school_id_id_key', ['school_id', 'id'])
    .addUniqueConstraint('school_messages_dedupe', ['school_id', 'dedupe_key'])
    .addForeignKeyConstraint(
      'school_messages_student_fk',
      ['school_id', 'recipient_student_id'],
      'school_students',
      ['school_id', 'id'],
      (cb) => cb.onDelete('restrict'),
    )
    .addForeignKeyConstraint(
      'school_messages_guardian_fk',
      ['school_id', 'recipient_guardian_id'],
      'school_student_guardians',
      ['school_id', 'id'],
      (cb) => cb.onDelete('restrict'),
    )
    .addForeignKeyConstraint(
      'school_messages_member_fk',
      ['school_id', 'recipient_member_id'],
      'school_members',
      ['school_id', 'id'],
      (cb) => cb.onDelete('restrict'),
    )
    .addCheckConstraint(
      'school_messages_recipient_shape',
      sql`(audience = 'parent' and recipient_student_id is not null and recipient_guardian_id is not null and recipient_member_id is null)
        or (audience <> 'parent' and recipient_member_id is not null and recipient_guardian_id is null)`,
    )
    .execute()
  await sql`create index school_messages_due on school_messages (status, not_before) where status in ('queued', 'held')`.execute(db)
  await sql`create index school_messages_student_week on school_messages (school_id, recipient_student_id, created_at) where audience = 'parent'`.execute(db)

  await db.schema
    .createTable('school_message_events')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('school_id', 'uuid', (col) => col.notNull().references('schools.id').onDelete('restrict'))
    .addColumn('message_id', 'uuid', (col) => col.notNull())
    .addColumn('status', 'text', (col) => col.notNull())
    .addColumn('detail', 'text')
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addUniqueConstraint('school_message_events_school_id_id_key', ['school_id', 'id'])
    .addForeignKeyConstraint(
      'school_message_events_message_fk',
      ['school_id', 'message_id'],
      'school_messages',
      ['school_id', 'id'],
      (cb) => cb.onDelete('restrict'),
    )
    .execute()

  await db.schema
    .createTable('school_message_counts')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('school_id', 'uuid', (col) => col.notNull().references('schools.id').onDelete('restrict'))
    .addColumn('month', 'date', (col) => col.notNull())
    .addColumn('template', 'text', (col) => col.notNull())
    .addColumn('status', 'text', (col) => col.notNull())
    .addColumn('count', 'integer', (col) => col.notNull())
    .addUniqueConstraint('school_message_counts_school_id_id_key', ['school_id', 'id'])
    .addUniqueConstraint('school_message_counts_key', ['school_id', 'month', 'template', 'status'])
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('school_message_counts').execute()
  await db.schema.dropTable('school_message_events').execute()
  await db.schema.dropTable('school_messages').execute()
  await db.schema.dropTable('school_parent_messaging').execute()
  await db.schema.alterTable('school_members').dropColumn('message_language').execute()
  await db.schema.alterTable('schools').dropColumn('message_log_days').dropColumn('messaging_enabled').execute()
}
