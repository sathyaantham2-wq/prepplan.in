import type { Kysely } from 'kysely'

// The area of an answer sheet that is painted white before a page picture goes to the AI (M4 additions plan, section 8).
// NULL means the default: the top 12 % of the first page. Local first; the owner runs it on production.
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('schools').addColumn('mask_template', 'jsonb').execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('schools').dropColumn('mask_template').execute()
}
