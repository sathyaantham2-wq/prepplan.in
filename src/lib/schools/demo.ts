import type { Db } from '../../db/connection'
import {
  examPrintRepository,
  schoolDemoResultsRepository,
} from '../../db/repositories'
import type { SchoolScope } from '../../db/school-scope'
import { SchoolError, auditSchool } from './common'
import { DEMO_LABEL, generateDemoResults } from './demo-results'
import type { DemoResults } from './demo-results'
import { loadExam } from './exam-service'

// The demo school (M1): a safe, fully separate school to show the product. The full sample school is
// made only by the provisioning script (`--demo`); a school that starts itself on the web is also a demo
// (no sample students) until the owner approves it (signup.ts). Its data sits under its own school_id like any
// tenant; the sample results are generated, use no AI and no scanned image, and every screen that
// shows them carries the label "DEMO - sample data".

async function assertDemo(db: Db, scope: SchoolScope) {
  const s = await db
    .selectFrom('schools')
    .select('is_demo')
    .where('id', '=', scope.schoolId)
    .executeTakeFirstOrThrow()
  if (!s.is_demo)
    throw new SchoolError('forbidden', 'This is only for the demo school.')
}

/** "Use sample answer sheets": fills an exam of the demo school with generated sample results. */
export async function useSampleAnswerSheets(
  db: Db,
  scope: SchoolScope,
  examId: string,
): Promise<DemoResults> {
  await assertDemo(db, scope)
  const { exam, sectionIds } = await loadExam(db, scope, examId, 'handle')
  if (exam.archived_at) throw new SchoolError('not_found', 'Exam not found.')
  const questions = await db
    .selectFrom('school_exam_questions as q')
    .innerJoin('questions as qq', 'qq.id', 'q.question_id')
    .innerJoin('chapters as ch', 'ch.id', 'q.chapter_id')
    .select(['q.position', 'q.marks', 'qq.type', 'ch.name as topic'])
    .where('q.school_id', '=', scope.schoolId)
    .where('q.exam_id', '=', examId)
    .where('q.is_alternate', '=', false)
    .orderBy('q.position')
    .execute()
  const students = (
    await examPrintRepository.studentsOfSections(db, scope, sectionIds)
  ).map((s) => ({
    id: s.school_student_id,
    name: s.name,
    roll: s.roll_no,
  }))
  if (questions.length === 0 || students.length === 0)
    throw new SchoolError(
      'invalid',
      'This exam has no questions or no students yet.',
    )
  const results = generateDemoResults({
    examTitle: exam.title,
    questions,
    students,
    seedText: `${scope.schoolId}:${examId}`,
  })
  await schoolDemoResultsRepository.archiveOpen(db, scope, examId)
  await schoolDemoResultsRepository.insert(db, scope, {
    exam_id: examId,
    payload: JSON.stringify(results),
    created_by_user_id: scope.userId,
  })
  await auditSchool(
    db,
    scope,
    'school.demo_results_made',
    'school_exams',
    examId,
    null,
    { students: students.length },
  )
  return results
}

/** "Reset demo": archives the demo school's exams and sample results. Nothing is deleted. */
export async function resetDemo(
  db: Db,
  scope: SchoolScope,
): Promise<{ exams: number }> {
  assertAdminOrTeacher(scope)
  await assertDemo(db, scope)
  const now = new Date()
  const r = await db
    .updateTable('school_exams')
    .set({ archived_at: now })
    .where('school_id', '=', scope.schoolId)
    .where('archived_at', 'is', null)
    .executeTakeFirst()
  await db
    .updateTable('school_demo_results')
    .set({ archived_at: now })
    .where('school_id', '=', scope.schoolId)
    .where('archived_at', 'is', null)
    .execute()
  await auditSchool(
    db,
    scope,
    'school.demo_reset',
    'schools',
    scope.schoolId,
    null,
    { exams: Number(r.numUpdatedRows) },
  )
  return { exams: Number(r.numUpdatedRows) }
}

function assertAdminOrTeacher(scope: SchoolScope) {
  if (scope.role !== 'school_admin' && scope.role !== 'teacher')
    throw new SchoolError(
      'forbidden',
      'Only the school office or a teacher can do this.',
    )
}

export interface ResultsListRow {
  examId: string
  title: string
  demo: boolean
  students: number
  average: number
}

/** The exams that have results the caller may see (only demo sample results exist until real marking is built). */
export async function listResults(
  db: Db,
  scope: SchoolScope,
): Promise<Array<ResultsListRow>> {
  assertAdminOrTeacher(scope)
  const rows = await schoolDemoResultsRepository.listOpen(db, scope)
  const out: Array<ResultsListRow> = []
  for (const r of rows) {
    try {
      await loadExam(db, scope, r.exam_id, 'handle') // a teacher sees only the exams she teaches
    } catch {
      continue
    }
    const p = r.payload as unknown as DemoResults
    out.push({
      examId: r.exam_id,
      title: p.examTitle,
      demo: true,
      students: p.students.length,
      average: p.classSummary.average,
    })
  }
  return out
}

export async function getResults(
  db: Db,
  scope: SchoolScope,
  examId: string,
): Promise<DemoResults> {
  assertAdminOrTeacher(scope)
  await loadExam(db, scope, examId, 'handle')
  const row = await schoolDemoResultsRepository.openFor(db, scope, examId)
  if (!row)
    throw new SchoolError(
      'not_found',
      'There are no results for this exam yet.',
    )
  return row.payload as unknown as DemoResults
}

export { DEMO_LABEL }
export {
  DEMO_AI_SPEND_CAP_INR,
  DEMO_STUDENT_COUNT,
  DEMO_STUDENT_NAMES,
  provisionDemoSchool,
} from './demo-provision'
