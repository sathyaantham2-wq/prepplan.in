import type { Db } from '../../db/connection'
import { aiJobsRepository } from '../../db/repositories'
import { SchoolError } from './common'

// A school's AI allowance (owner decision 2026-10-29): a rupee cap per school per calendar month,
// kept in schools.ai_spend_cap_inr (the demo school has Rs 50). A school with no figure of its own gets
// the default below. The spend is the sum of what its AI calls cost (ai_jobs, attributed to the
// school's own household). The check is made BEFORE each AI call; a call cannot be priced in advance,
// so the last call before the cap may run a little over it. Default Rs 10,000 a month: owner decision
// 2026-10-30 (it was Rs 100).

export const DEFAULT_SCHOOL_AI_CAP_INR = 10_000
/** The allowance of a demo school: the owner's demo school, and every school that started itself until the owner approves it. */
export const DEMO_AI_SPEND_CAP_INR = 50

export function monthStartUtc(now: Date): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
}

export async function schoolAiStatus(
  db: Db,
  schoolId: string,
  now = new Date(),
): Promise<{ spent: number; cap: number; householdId: string }> {
  const school = await db
    .selectFrom('schools')
    .select(['household_id', 'ai_spend_cap_inr'])
    .where('id', '=', schoolId)
    .executeTakeFirstOrThrow()
  const spent = await aiJobsRepository.sumCostForHouseholdSince(
    db,
    school.household_id,
    monthStartUtc(now),
  )
  return {
    spent,
    cap:
      school.ai_spend_cap_inr === null
        ? DEFAULT_SCHOOL_AI_CAP_INR
        : Number(school.ai_spend_cap_inr),
    householdId: school.household_id,
  }
}

/** Throws a plain sentence when the school has used its allowance for the month. */
export async function assertSchoolAiBudget(
  db: Db,
  schoolId: string,
  now = new Date(),
) {
  const s = await schoolAiStatus(db, schoolId, now)
  if (s.spent >= s.cap)
    throw new SchoolError(
      'conflict',
      `Your school has used its AI allowance for this month (Rs ${s.spent.toFixed(2)} of Rs ${s.cap.toFixed(0)}). It starts again next month, or write to support@prepplan.in to raise it.`,
    )
  return s
}
