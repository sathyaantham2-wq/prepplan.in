import type { Db } from '../../db/connection'
import { schoolExamReflectionsRepository } from '../../db/repositories'
import type { SchoolScope } from '../../db/school-scope'
import { SchoolError, auditSchool } from './common'
import { viewerFor } from './progress'

// A student's optional three-question reflection after a released exam (owner direction 2026-10-31), kept for
// the Holistic Progress Card export. It is not used for marks, levels, ranking or analytics. Only the student
// writes it; a parent can read it.

export const NEXT_TIME = ['read_carefully', 'show_steps', 'write_more', 'revise_topic', 'manage_time', 'other'] as const

export async function getReflection(db: Db, scope: SchoolScope, paperId: string, childId?: string | null) {
  const { viewer } = await viewerFor(db, scope, childId)
  const r = await db
    .selectFrom('school_exam_reflections')
    .selectAll()
    .where('school_id', '=', scope.schoolId)
    .where('paper_id', '=', paperId)
    .where('school_student_id', '=', viewer.studentId)
    .executeTakeFirst()
  return r
    ? { hardest: r.hardest_question_no, nextTime: r.next_time, note: r.next_time_note, feeling: r.feeling }
    : null
}

export async function saveReflection(
  db: Db,
  scope: SchoolScope,
  paperId: string,
  input: { hardest: string | null; nextTime: string | null; note: string | null; feeling: number | null },
) {
  if (scope.role !== 'student') throw new SchoolError('forbidden', 'Only the student writes this.')
  const { viewer } = await viewerFor(db, scope, null)
  const rel = await db
    .selectFrom('school_paper_releases')
    .select('id')
    .where('school_id', '=', scope.schoolId)
    .where('paper_id', '=', paperId)
    .where('section_id', '=', viewer.sectionId)
    .executeTakeFirst()
  if (!rel) throw new SchoolError('not_found', 'This exam is not available.')
  if (input.nextTime !== null && !(NEXT_TIME as ReadonlyArray<string>).includes(input.nextTime))
    throw new SchoolError('invalid', 'Choose one of the answers.')
  if (input.feeling !== null && ![1, 2, 3].includes(input.feeling))
    throw new SchoolError('invalid', 'Choose one of the answers.')
  const note = input.note?.trim().slice(0, 300) || null
  const hardest = input.hardest?.trim().slice(0, 6) || null
  const row = {
    hardest_question_no: hardest,
    next_time: input.nextTime,
    next_time_note: note,
    feeling: input.feeling,
    updated_at: new Date(),
  }
  const had = await db
    .selectFrom('school_exam_reflections')
    .select('id')
    .where('school_id', '=', scope.schoolId)
    .where('paper_id', '=', paperId)
    .where('school_student_id', '=', viewer.studentId)
    .executeTakeFirst()
  if (had) {
    await schoolExamReflectionsRepository.update(db, scope, had.id, row)
    await auditSchool(db, scope, 'school.reflection_changed', 'school_exam_reflections', had.id, null, { paper_id: paperId })
  } else {
    const made = await schoolExamReflectionsRepository.insert(db, scope, {
      paper_id: paperId,
      school_student_id: viewer.studentId,
      ...row,
    })
    await auditSchool(db, scope, 'school.reflection_saved', 'school_exam_reflections', made.id, null, { paper_id: paperId })
  }
}
