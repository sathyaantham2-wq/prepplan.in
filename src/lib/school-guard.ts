import type { Db } from '../db/connection'

// Purpose-limit guards (CLAUDE.md "School module rules"): a school student's data is used only for
// that school's exams and reports. These two small checks are what every consumer-side writer or
// sender calls, so the rule lives in a few places instead of being re-remembered per feature. The
// school-student test sweep (school-purpose-limit.integration.test.ts) fails if one is missed.

/** True when this student belongs to a school (students.school_id is set). */
export async function isSchoolStudent(
  db: Db,
  studentId: string,
): Promise<boolean> {
  const row = await db
    .selectFrom('students')
    .select('school_id')
    .where('id', '=', studentId)
    .executeTakeFirst()
  return row?.school_id != null
}

/** True when this login was created by a school (staff or student). */
export async function isSchoolUser(db: Db, userId: string): Promise<boolean> {
  const row = await db
    .selectFrom('users')
    .select('signup_type')
    .where('id', '=', userId)
    .executeTakeFirst()
  return row?.signup_type === 'school'
}

/** The 403 every consumer route returns to a school login. */
export function schoolAccountRefusal(): Response {
  return Response.json(
    {
      error: 'school_account',
      message: 'This is a school account. Use your school workspace.',
    },
    { status: 403 },
  )
}
