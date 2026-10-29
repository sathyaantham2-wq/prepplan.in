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
  async studentsByIds(
    db: Db,
    scope: SchoolScope,
    schoolStudentIds: ReadonlyArray<string>,
  ) {
    if (schoolStudentIds.length === 0) return []
    return db
      .selectFrom('school_students as ss')
      .innerJoin('students as st', 'st.id', 'ss.student_id')
      .select(['ss.id as school_student_id', 'st.name'])
      .where('ss.school_id', '=', scope.schoolId)
      .where('ss.id', 'in', [...schoolStudentIds])
      .execute()
  },
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

export const schoolScanBatchesRepository = createSchoolScopedRepository(
  'school_scan_batches',
)
export const schoolScanPagesRepository = {
  ...createSchoolScopedRepository('school_scan_pages'),
  /** Every page that came in for an exam, newest last, without the picture itself. */
  async listForExam(db: Db, scope: SchoolScope, examId: string) {
    return db
      .selectFrom('school_scan_pages')
      .select([
        'id',
        'booklet_id',
        'page_no',
        'status',
        'reason',
        'quality',
        'original_name',
        'size_bytes',
        'purged_at',
        'created_at',
        sql<boolean>`(image is not null)`.as('has_image'),
      ])
      .where('school_id', '=', scope.schoolId)
      .where('exam_id', '=', examId)
      .orderBy('created_at')
      .execute()
  },
  async findWithImage(db: Db, scope: SchoolScope, id: string) {
    return db
      .selectFrom('school_scan_pages')
      .selectAll()
      .where('school_id', '=', scope.schoolId)
      .where('id', '=', id)
      .executeTakeFirst()
  },
  /**
   * Looks a QR token up across ALL schools: the one place a read is not limited to the caller's
   * school, because the caller does not yet know whose page a photo is. It returns only enough to
   * decide whether the page may be used here; the caller refuses anything from another school.
   */
  async findPageByToken(db: Db, token: string) {
    return db
      .selectFrom('school_booklet_pages as bp')
      .innerJoin('school_booklets as b', 'b.id', 'bp.booklet_id')
      .select([
        'bp.school_id',
        'bp.booklet_id',
        'bp.page_no',
        'b.exam_id',
        'b.school_student_id',
      ])
      .where('bp.token', '=', token)
      .executeTakeFirst()
  },
  /** Blank the pictures older than each school's own retention period. The rows stay. */
  async purgeExpired(db: Db, now: Date): Promise<number> {
    const r = await sql`
      update school_scan_pages p set image = null, purged_at = ${now}
      from schools s
      where p.school_id = s.id and p.image is not null
        and p.created_at < ${now}::timestamptz - (s.scan_retention_days || ' days')::interval`.execute(
      db,
    )
    return Number(r.numAffectedRows ?? 0)
  },
}
export const schoolExamAbsencesRepository = {
  ...createSchoolScopedRepository('school_exam_absences'),
  async openForExam(db: Db, scope: SchoolScope, examId: string) {
    return db
      .selectFrom('school_exam_absences')
      .selectAll()
      .where('school_id', '=', scope.schoolId)
      .where('exam_id', '=', examId)
      .where('cleared_at', 'is', null)
      .execute()
  },
}
export const schoolPrintJobsRepository = {
  ...createSchoolScopedRepository('school_print_jobs'),
  async purgeExpired(db: Db, now: Date): Promise<number> {
    const r =
      await sql`update school_print_jobs set result = null where result is not null and expires_at < ${now}`.execute(
        db,
      )
    return Number(r.numAffectedRows ?? 0)
  },
}
export const schoolPrintJobPartsRepository = createSchoolScopedRepository(
  'school_print_job_parts',
)
