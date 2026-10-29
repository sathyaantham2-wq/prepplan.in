import type { Db } from '../db/connection'

/**
 * The students PrepPlan may send nudges, summaries and other outbound messages about. School
 * students are never in it (CLAUDE.md "School module rules": no marketing, nudges or summaries).
 * Both cron jobs read this one list, so there is one place to get the rule right.
 */
export async function listOutboundStudents(db: Db) {
  return db
    .selectFrom('students')
    .select(['id', 'name', 'household_id'])
    .where('school_id', 'is', null)
    .execute()
}
