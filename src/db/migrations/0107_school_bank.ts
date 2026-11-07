import type { Kysely } from 'kysely'
import { sql } from 'kysely'

// The schools-only bank (owner decision 2026-11-04, no F-number yet). A `questions` row with status 'school_bank' is a
// shared-bank question that every school's paper builder may use and PrepPlan's own students never get: every student
// pool takes status 'approved' only. It holds the Easy questions schools asked for (the retired Class 7 Easy grid,
// brought back for schools, and the new school top-up packs), so a school paper can carry every difficulty level
// without changing the no-easy rule of PrepPlan's own student bank.
export async function up(db: Kysely<any>): Promise<void> {
  await sql`alter table questions drop constraint questions_status_check`.execute(db)
  await sql`alter table questions add constraint questions_status_check check (status in ('draft', 'approved', 'retired', 'school', 'school_bank'))`.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`alter table questions drop constraint questions_status_check`.execute(db)
  await sql`alter table questions add constraint questions_status_check check (status in ('draft', 'approved', 'retired', 'school'))`.execute(db)
}
