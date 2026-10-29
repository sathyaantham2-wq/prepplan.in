import { sql } from 'kysely'
import type { Db } from '../connection'
import { createSchoolScopedRepository } from './factory'
import type { SchoolScope } from '../school-scope'

export const schoolExamsRepository =
  createSchoolScopedRepository('school_exams')
export const schoolExamSectionsRepository = createSchoolScopedRepository(
  'school_exam_sections',
)
export const schoolExamQuestionsRepository = {
  ...createSchoolScopedRepository('school_exam_questions'),
  /** The master paper in print order, with the question and the chapter it came from. */
  async listFull(db: Db, scope: SchoolScope, examId: string) {
    return db
      .selectFrom('school_exam_questions as eq')
      .innerJoin('questions as q', 'q.id', 'eq.question_id')
      .innerJoin('concepts as c', 'c.id', 'q.concept_id')
      .select([
        'eq.id',
        'eq.question_id',
        'eq.chapter_id',
        'eq.position',
        'eq.is_alternate',
        'eq.marks',
        'eq.section',
        'eq.slot',
        'eq.choice_group',
        'eq.expected_words',
        'q.type',
        'q.bloom',
        'q.difficulty',
        'q.text',
        'q.answer',
        'q.diagram_kind',
        'q.diagram_params',
        'q.concept_id',
        'c.name as concept_name',
      ])
      .where('eq.school_id', '=', scope.schoolId)
      .where('eq.exam_id', '=', examId)
      .orderBy('eq.position')
      .orderBy('eq.is_alternate')
      .execute()
  },
}
export const schoolBookletLayoutsRepository = createSchoolScopedRepository(
  'school_booklet_layouts',
)
export const schoolBookletsRepository =
  createSchoolScopedRepository('school_booklets')
export const schoolBookletPagesRepository = createSchoolScopedRepository(
  'school_booklet_pages',
)

/** Question-bank reads for printing (global data, so no scope; callers check access to the exam first). */
export const examPrintRepository = {
  async optionsFor(db: Db, questionIds: ReadonlyArray<string>) {
    if (questionIds.length === 0) return []
    return db
      .selectFrom('question_options')
      .select(['question_id', 'label', 'text', 'order_index', 'is_correct'])
      .where('question_id', 'in', [...questionIds])
      .orderBy('order_index')
      .execute()
  },
  async stepMarksFor(db: Db, questionIds: ReadonlyArray<string>) {
    if (questionIds.length === 0) return []
    return db
      .selectFrom('question_step_marks')
      .select(['question_id', 'step_no', 'description', 'marks'])
      .where('question_id', 'in', [...questionIds])
      .orderBy('step_no')
      .execute()
  },
  async conceptCounts(db: Db, chapterIds: ReadonlyArray<string>) {
    const rows = await db
      .selectFrom('concepts')
      .select(['id', 'chapter_id'])
      .where('chapter_id', 'in', [...chapterIds])
      .execute()
    return rows
  },
  async chaptersWithBook(db: Db, chapterIds: ReadonlyArray<string>) {
    return db
      .selectFrom('chapters as ch')
      .innerJoin('sources as so', 'so.id', 'ch.source_id')
      .select([
        'ch.id',
        'ch.part',
        'ch.chapter_no',
        'ch.name',
        'so.title as book',
        'ch.subject_id',
      ])
      .where('ch.id', 'in', [...chapterIds])
      .execute()
  },
  /** Students (active) of the given sections with what a booklet prints. */
  async studentsOfSections(
    db: Db,
    scope: SchoolScope,
    sectionIds: ReadonlyArray<string>,
  ) {
    if (sectionIds.length === 0) return []
    return db
      .selectFrom('school_students as ss')
      .innerJoin('students as st', 'st.id', 'ss.student_id')
      .innerJoin('school_sections as sec', 'sec.id', 'ss.section_id')
      .innerJoin('school_classes as cls', 'cls.id', 'sec.class_id')
      .select([
        'ss.id as school_student_id',
        'ss.admission_no',
        'ss.roll_no',
        'ss.section_id',
        'st.name',
        'sec.name as section_name',
        'cls.grade',
      ])
      .where('ss.school_id', '=', scope.schoolId)
      .where('ss.section_id', 'in', [...sectionIds])
      .where('ss.status', '=', 'active')
      .orderBy('sec.name')
      .orderBy(
        sql`nullif(regexp_replace(ss.roll_no, '[^0-9]', '', 'g'), '')::int`,
      )
      .orderBy('ss.roll_no')
      .execute()
  },
}
