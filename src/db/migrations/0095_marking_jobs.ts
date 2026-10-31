import type { Kysely } from 'kysely'
import { sql } from 'kysely'

// "Mark all ready students" (owner direction 2026-11-01): a class is marked as a job of one item per student, not
// as one long web request. Each item is claimed with a lease (a few minutes); a worker that dies leaves its lease
// to expire and the item is claimed again, up to 3 attempts. The page drives the job (it asks for the next item
// until none is left), so it works on a serverless host and resumes when the page is opened again.
//
// school_marking_jobs: one per start; status running -> done (every item finished) or cancelled.
// school_marking_job_items: one per student of the job.
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('school_marking_jobs')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('school_id', 'uuid', (col) => col.notNull().references('schools.id').onDelete('restrict'))
    .addColumn('paper_id', 'uuid', (col) => col.notNull())
    .addColumn('created_by_user_id', 'uuid', (col) => col.notNull().references('users.id').onDelete('restrict'))
    .addColumn('status', 'text', (col) => col.notNull().check(sql`status in ('running', 'done', 'cancelled')`))
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('finished_at', 'timestamptz')
    .addUniqueConstraint('school_marking_jobs_school_id_id_key', ['school_id', 'id'])
    .addForeignKeyConstraint('school_marking_jobs_paper_fk', ['school_id', 'paper_id'], 'school_own_papers', ['school_id', 'id'], (cb) => cb.onDelete('restrict'))
    .execute()
  await sql`create unique index school_marking_jobs_one_running on school_marking_jobs (paper_id) where status = 'running'`.execute(db)

  await db.schema
    .createTable('school_marking_job_items')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('school_id', 'uuid', (col) => col.notNull().references('schools.id').onDelete('restrict'))
    .addColumn('job_id', 'uuid', (col) => col.notNull())
    .addColumn('school_student_id', 'uuid', (col) => col.notNull())
    .addColumn('status', 'text', (col) =>
      col.notNull().check(sql`status in ('queued', 'running', 'done', 'failed', 'cancelled')`),
    )
    .addColumn('attempts', 'integer', (col) => col.notNull().defaultTo(0))
    .addColumn('lease_until', 'timestamptz')
    .addColumn('result', 'text')
    .addColumn('message', 'text')
    .addColumn('updated_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addUniqueConstraint('school_marking_job_items_school_id_id_key', ['school_id', 'id'])
    .addUniqueConstraint('school_marking_job_items_one_per_student', ['job_id', 'school_student_id'])
    .addForeignKeyConstraint('school_marking_job_items_job_fk', ['school_id', 'job_id'], 'school_marking_jobs', ['school_id', 'id'], (cb) => cb.onDelete('restrict'))
    .addForeignKeyConstraint('school_marking_job_items_student_fk', ['school_id', 'school_student_id'], 'school_students', ['school_id', 'id'], (cb) => cb.onDelete('restrict'))
    .execute()
}
