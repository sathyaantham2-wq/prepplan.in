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
        sql<boolean>`(image_key is not null)`.as('has_image'),
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
  /** Pages whose files are past their school's own retention period (the files are still there). */
  async listDueForPurge(db: Db, now: Date) {
    return db
      .selectFrom('school_scan_pages as p')
      .innerJoin('schools as s', 's.id', 'p.school_id')
      .select(['p.id', 'p.school_id', 'p.image_key', 'p.original_key'])
      .where((eb) =>
        eb.or([
          eb('p.image_key', 'is not', null),
          eb('p.original_key', 'is not', null),
        ]),
      )
      .where(
        sql<boolean>`p.created_at < ${now}::timestamptz - (s.scan_retention_days || ' days')::interval`,
      )
      .execute()
  },
  /** Originals whose exam's marks locked more than `days` days ago (the files are still there). */
  async listOriginalsDueAfterLock(db: Db, now: Date, days: number) {
    return db
      .selectFrom('school_scan_pages as p')
      .innerJoin('school_exams as e', (j) =>
        j
          .onRef('e.id', '=', 'p.exam_id')
          .onRef('e.school_id', '=', 'p.school_id'),
      )
      .select([
        'p.id',
        'p.school_id',
        'p.exam_id',
        'p.original_key',
        'e.marks_locked_at',
      ])
      .where('p.original_key', 'is not', null)
      .where('e.marks_locked_at', 'is not', null)
      .where(
        sql<boolean>`e.marks_locked_at < ${now}::timestamptz - (${days} || ' days')::interval`,
      )
      .execute()
  },
  /** After an original is deleted: clear its key and say when. The straightened copy stays. */
  async markOriginalsPurged(db: Db, ids: ReadonlyArray<string>, now: Date) {
    if (ids.length === 0) return 0
    const r = await db
      .updateTable('school_scan_pages')
      .set({ original_key: null, original_purged_at: now })
      .where('id', 'in', [...ids])
      .executeTakeFirst()
    return Number(r.numUpdatedRows)
  },
  /** After the files are deleted: forget their keys and say when. The row stays. */
  async markPurged(db: Db, ids: ReadonlyArray<string>, now: Date) {
    if (ids.length === 0) return 0
    const r = await db
      .updateTable('school_scan_pages')
      .set({
        image_key: null,
        original_key: null,
        purged_at: now,
        original_purged_at: sql<Date>`coalesce(original_purged_at, ${now}::timestamptz)`,
      })
      .where('id', 'in', [...ids])
      .executeTakeFirst()
    return Number(r.numUpdatedRows)
  },
}
export const schoolScanChunksRepository = {
  ...createSchoolScopedRepository('school_scan_chunks'),
  /** The pieces of one upload, in order, with their bytes. Only the uploader's own, for this exam. */
  async piecesOf(db: Db, scope: SchoolScope, examId: string, uploadId: string) {
    return db
      .selectFrom('school_scan_chunks')
      .selectAll()
      .where('school_id', '=', scope.schoolId)
      .where('exam_id', '=', examId)
      .where('upload_id', '=', uploadId)
      .where('created_by_user_id', '=', scope.userId)
      .orderBy('seq')
      .execute()
  },
  /** Pieces never joined into a page within a day (their files are still there). */
  async listAbandoned(db: Db, now: Date) {
    return db
      .selectFrom('school_scan_chunks')
      .select(['id', 'school_id', 'storage_key'])
      .where('storage_key', 'is not', null)
      .where('consumed_at', 'is', null)
      .where(sql<boolean>`created_at < ${now}::timestamptz - interval '1 day'`)
      .execute()
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
  /** Finished jobs whose file is past its week (the file is still there). */
  async listExpired(db: Db, now: Date) {
    return db
      .selectFrom('school_print_jobs')
      .select(['id', 'school_id', 'result_key'])
      .where('result_key', 'is not', null)
      .where('expires_at', '<', now)
      .execute()
  },
  async markResultPurged(db: Db, id: string, now: Date) {
    await db
      .updateTable('school_print_jobs')
      .set({ result_key: null, result_purged_at: now })
      .where('id', '=', id)
      .execute()
  },
}
export const schoolPrintJobPartsRepository = {
  ...createSchoolScopedRepository('school_print_job_parts'),
  /** Pieces still in storage whose job has expired (a job that failed leaves them behind). */
  async listLeftOver(db: Db, now: Date) {
    return db
      .selectFrom('school_print_job_parts as p')
      .innerJoin('school_print_jobs as j', 'j.id', 'p.job_id')
      .select(['p.id', 'p.pdf_key'])
      .where('p.pdf_key', 'is not', null)
      .where('j.expires_at', '<', now)
      .execute()
  },
}

export const schoolDemoResultsRepository = {
  ...createSchoolScopedRepository('school_demo_results'),
  async openFor(db: Db, scope: SchoolScope, examId: string) {
    return db
      .selectFrom('school_demo_results')
      .selectAll()
      .where('school_id', '=', scope.schoolId)
      .where('exam_id', '=', examId)
      .where('archived_at', 'is', null)
      .executeTakeFirst()
  },
  async listOpen(db: Db, scope: SchoolScope) {
    return db
      .selectFrom('school_demo_results')
      .selectAll()
      .where('school_id', '=', scope.schoolId)
      .where('archived_at', 'is', null)
      .orderBy('created_at', 'desc')
      .execute()
  },
  /** A fresh set replaces the old: the old one is archived, never deleted. */
  async archiveOpen(db: Db, scope: SchoolScope, examId: string) {
    await db
      .updateTable('school_demo_results')
      .set({ archived_at: new Date() })
      .where('school_id', '=', scope.schoolId)
      .where('exam_id', '=', examId)
      .where('archived_at', 'is', null)
      .execute()
  },
}

export const schoolOwnPapersRepository =
  createSchoolScopedRepository('school_own_papers')
export const schoolOwnQuestionsRepository = {
  ...createSchoolScopedRepository('school_own_questions'),
  /** The questions of one paper that are still on it, in order. */
  async forPaper(db: Db, scope: SchoolScope, paperId: string) {
    return db
      .selectFrom('school_own_questions')
      .selectAll()
      .where('school_id', '=', scope.schoolId)
      .where('paper_id', '=', paperId)
      .where('removed_at', 'is', null)
      .orderBy('position')
      .orderBy('created_at')
      .execute()
  },
}
