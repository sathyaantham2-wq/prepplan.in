import type { Db } from '../db/connection'
import { parseHalfYearlyConfig } from './school-paper'

/**
 * The school-exam-standard blueprint for a subject, if one has been seeded (the newest). A subject
 * without one keeps the paper it always had, so the school format switches on subject by subject
 * as each one's bank gains the question types a school paper needs.
 */
export async function findSchoolBlueprint(db: Db, subjectId: string, questionCount?: number) {
  const rows = await db
    .selectFrom('blueprints')
    .selectAll()
    .where('subject_id', '=', subjectId)
    .orderBy('created_at', 'desc')
    .execute()
  const schoolRows = rows.filter((b) => parseHalfYearlyConfig(b.config) !== null)
  // A practice paper of a given length has its own blueprint; asking for a length with none
  // returns null (the caller then falls back), never a paper of another length.
  if (questionCount !== undefined) {
    return schoolRows.find((b) => parseHalfYearlyConfig(b.config)?.question_count === questionCount) ?? null
  }
  return schoolRows[0] ?? null
}
