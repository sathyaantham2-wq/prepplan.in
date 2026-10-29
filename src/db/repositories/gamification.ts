import { sql } from 'kysely'
import type { Selectable } from 'kysely'
import type { Db } from '../connection'
import type { DB } from '../types'
import { createScopedRepository } from './factory'

// F125 (first slice). Append-only ledger (CLAUDE.md invariant 4) -- insert only, no update method
// even though createScopedRepository would offer one. Leaderboard aggregation (a later pass)
// reads this scoped by student and rolls it up across students in the same cohort itself; this
// repository only ever writes and reads one student's own rows.
const student_points_ledger = createScopedRepository(
  'student_points_ledger',
  'student_id',
)
export const studentPointsLedgerRepository = {
  findById: student_points_ledger.findById,
  list: student_points_ledger.list,
  insert: student_points_ledger.insert,
  async totalForStudent(db: Db, studentId: string) {
    const rows = await db
      .selectFrom('student_points_ledger')
      .select(['points', 'coins'])
      .where('student_id', '=', studentId)
      .execute()
    return rows.reduce(
      (sum, r) => ({
        points: sum.points + r.points,
        coins: sum.coins + r.coins,
      }),
      { points: 0, coins: 0 },
    )
  },
}

export type StudentPointsLedgerRow = Selectable<DB['student_points_ledger']>

// Coin spending (2026-10-24). Append-only like the ledger -- insert and read, no update/delete.
// The purchase itself (balance check + lock) lives in src/lib/rewards.ts unlockItem().
const student_unlocks = createScopedRepository('student_unlocks', 'student_id')
export const studentUnlocksRepository = {
  list: student_unlocks.list,
  insert: student_unlocks.insert,
  async keys(db: Db, studentId: string) {
    const rows = await db
      .selectFrom('student_unlocks')
      .select('item_key')
      .where('student_id', '=', studentId)
      .where('kind', '=', 'paper_theme')
      .execute()
    return new Set(rows.map((r) => r.item_key))
  },
  /** Earned coins (ledger) minus coins spent on unlocks. */
  async spendableCoins(db: Db, studentId: string) {
    const { rows } = await sql<{ coins: string }>`
      select (
        (select coalesce(sum(coins), 0) from student_points_ledger where student_id = ${studentId})
        - (select coalesce(sum(price_coins), 0) from student_unlocks where student_id = ${studentId})
      )::text as coins`.execute(db)
    return Number(rows.at(0)?.coins ?? 0)
  },
  /** Row lock on the student: serialises concurrent purchases for the same student. */
  async lockStudent(db: Db, studentId: string) {
    await db
      .selectFrom('students')
      .select('id')
      .where('id', '=', studentId)
      .forUpdate()
      .executeTakeFirstOrThrow()
  },
}

export type StudentUnlockRow = Selectable<DB['student_unlocks']>
