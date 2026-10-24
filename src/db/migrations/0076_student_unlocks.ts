import type { Kysely } from 'kysely'
import { sql } from 'kysely'

// Coins get a use (owner-approved 2026-10-24): a student spends them to unlock paper themes. One
// row per (student, item); append-only -- a row is never updated or deleted (CLAUDE.md invariant
// 4), and the spendable balance is earned coins (student_points_ledger) minus SUM(price_coins)
// here. price_coins is the price actually paid, so a later price change never rewrites history.
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('student_unlocks')
    .addColumn('student_id', 'uuid', (col) =>
      col.notNull().references('students.id').onDelete('cascade'),
    )
    .addColumn('item_key', 'text', (col) => col.notNull())
    .addColumn('kind', 'text', (col) => col.notNull().defaultTo('paper_theme'))
    .addColumn('price_coins', 'integer', (col) => col.notNull())
    .addColumn('unlocked_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addPrimaryKeyConstraint('student_unlocks_pkey', ['student_id', 'item_key'])
    .addCheckConstraint('student_unlocks_price_check', sql`price_coins >= 0`)
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('student_unlocks').execute()
}
