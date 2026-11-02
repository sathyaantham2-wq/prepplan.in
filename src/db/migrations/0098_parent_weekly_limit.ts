import type { Kysely } from 'kysely'
import { sql } from 'kysely'

// The principal's own limit on parent messages per child per week (owner decision 2026-11-01: no fixed cap; the
// principal chooses in his settings). NULL means no limit, which is the default.
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('schools')
    .addColumn('parent_weekly_limit', 'integer', (col) => col.check(sql`parent_weekly_limit between 1 and 14`))
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('schools').dropColumn('parent_weekly_limit').execute()
}
