import type { Kysely } from 'kysely'

// S6, storage change (owner decision): image bytes do not live in Postgres. The original upload, the
// straightened copy and the pieces of a file being uploaded are sealed (AES-256-GCM) files in a
// private storage bucket, under <school>/<exam>/<page>/...; the rows keep only the storage key.
// The bytea columns added in 0083/0084 never reached any shared database, so they are dropped.
//
// A key set to NULL together with purged_at means the file was deleted after the school's retention
// period; the row, its status, its reason and its quality note stay.
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('school_scan_pages')
    .addColumn('image_key', 'text')
    .addColumn('original_key', 'text')
    .execute()
  await db.schema
    .alterTable('school_scan_pages')
    .dropColumn('image')
    .dropColumn('original')
    .execute()
  await db.schema
    .alterTable('school_scan_chunks')
    .addColumn('storage_key', 'text')
    .execute()
  await db.schema.alterTable('school_scan_chunks').dropColumn('data').execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('school_scan_chunks')
    .addColumn('data', 'bytea')
    .execute()
  await db.schema
    .alterTable('school_scan_chunks')
    .dropColumn('storage_key')
    .execute()
  await db.schema
    .alterTable('school_scan_pages')
    .addColumn('image', 'bytea')
    .addColumn('original', 'bytea')
    .execute()
  await db.schema
    .alterTable('school_scan_pages')
    .dropColumn('image_key')
    .dropColumn('original_key')
    .execute()
}
