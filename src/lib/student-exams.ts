import { z } from 'zod'
import type { Db } from '../db/connection'
import { auditLogRepository } from '../db/repositories'

// A student's own exam dates (students.target_exams, a JSON column of {name, date}[]). Same shape
// the parent flow writes, so /api/exam-countdown and the Home chip read it unchanged.
export interface StudentExam {
  name: string
  date: string
}

export const MAX_EXAMS = 5
export const MAX_DAYS_PAST = 400
export const MAX_DAYS_AHEAD = 800

const DAY_MS = 24 * 60 * 60 * 1000

export const examInputSchema = z.object({
  name: z.string().trim().min(1, 'Give the exam a name').max(60, 'Keep the exam name under 60 letters'),
  date: z.string().date('Pick a real date'),
})

export const examsInputSchema = z.object({
  exams: z.array(examInputSchema).max(MAX_EXAMS, `You can keep up to ${MAX_EXAMS} exams`),
})

export type ExamsValidation =
  | { ok: true; exams: Array<StudentExam> }
  | { ok: false; error: string }

function utcDay(d: Date): number {
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
}

/** Range, duplicate and ordering checks on already shape-checked exams. `now` is injectable. */
export function validateExamList(exams: Array<StudentExam>, now: Date = new Date()): ExamsValidation {
  if (exams.length > MAX_EXAMS) return { ok: false, error: `You can keep up to ${MAX_EXAMS} exams` }
  const today = utcDay(now)
  const seen = new Set<string>()
  for (const exam of exams) {
    const days = Math.round((Date.parse(`${exam.date}T00:00:00.000Z`) - today) / DAY_MS)
    if (days < -MAX_DAYS_PAST) return { ok: false, error: 'That date is too far in the past' }
    if (days > MAX_DAYS_AHEAD) return { ok: false, error: 'That date is too far ahead' }
    const key = `${exam.name.toLowerCase()}|${exam.date}`
    if (seen.has(key)) return { ok: false, error: 'You already added that exam on that date' }
    seen.add(key)
  }
  return { ok: true, exams: [...exams].sort((a, b) => a.date.localeCompare(b.date)) }
}

export async function getStudentExams(db: Db, studentId: string): Promise<Array<StudentExam>> {
  const row = await db
    .selectFrom('students')
    .select('target_exams')
    .where('id', '=', studentId)
    .executeTakeFirstOrThrow()
  return row.target_exams as unknown as Array<StudentExam>
}

/** Replaces her exam list. Touches only target_exams on her own row; the change is audit-logged. */
export async function saveStudentExams(
  db: Db,
  student: { id: string; household_id: string },
  actorUserId: string,
  exams: Array<StudentExam>,
): Promise<Array<StudentExam>> {
  const before = await getStudentExams(db, student.id)
  await db
    .updateTable('students')
    .set({ target_exams: JSON.stringify(exams) as never })
    .where('id', '=', student.id)
    .execute()
  await auditLogRepository.insert(db, {
    household_id: student.household_id,
    actor_user_id: actorUserId,
    action: 'student.exams_updated',
    entity: 'students',
    entity_id: student.id,
    before: JSON.stringify(before),
    after: JSON.stringify(exams),
  })
  return exams
}
