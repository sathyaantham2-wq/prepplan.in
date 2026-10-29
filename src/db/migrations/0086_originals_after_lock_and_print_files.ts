import type { Kysely } from 'kysely'

// Owner decisions 2026-10-29:
//  1. The ORIGINAL scan file is deleted 7 days after that exam's marks lock; the straightened copy
//     stays for the school's retention period. school_exams.marks_locked_at is set by the lock job
//     (a later step); school_scan_pages.original_purged_at says when the original was deleted (the
//     row stays, original_key cleared).
//  2. Finished booklet print PDFs leave Postgres too: sealed files in the same private bucket,
//     under <school>/<exam>/_print/<job>/, deleted when the job expires (7 days). The rows keep only
//     the key (and result_purged_at once the file is gone). The pieces of a job are deleted as soon
//     as they are joined.
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('school_exams')
    .addColumn('marks_locked_at', 'timestamptz')
    .execute()
  await db.schema
    .alterTable('school_scan_pages')
    .addColumn('original_purged_at', 'timestamptz')
    .execute()
  await db.schema
    .alterTable('school_print_jobs')
    .addColumn('result_key', 'text')
    .addColumn('result_purged_at', 'timestamptz')
    .execute()
  await db.schema.alterTable('school_print_jobs').dropColumn('result').execute()
  await db.schema
    .alterTable('school_print_job_parts')
    .addColumn('pdf_key', 'text')
    .execute()
  await db.schema
    .alterTable('school_print_job_parts')
    .dropColumn('pdf')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('school_print_job_parts')
    .addColumn('pdf', 'bytea')
    .execute()
  await db.schema
    .alterTable('school_print_job_parts')
    .dropColumn('pdf_key')
    .execute()
  await db.schema
    .alterTable('school_print_jobs')
    .addColumn('result', 'bytea')
    .execute()
  await db.schema
    .alterTable('school_print_jobs')
    .dropColumn('result_key')
    .dropColumn('result_purged_at')
    .execute()
  await db.schema
    .alterTable('school_scan_pages')
    .dropColumn('original_purged_at')
    .execute()
  await db.schema
    .alterTable('school_exams')
    .dropColumn('marks_locked_at')
    .execute()
}
