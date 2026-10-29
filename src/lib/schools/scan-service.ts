import { randomUUID } from 'node:crypto'
import type { Db } from '../../db/connection'
import {
  examPrintRepository,
  schoolBookletsRepository,
  schoolExamAbsencesRepository,
  schoolPrintJobPartsRepository,
  schoolPrintJobsRepository,
  schoolScanBatchesRepository,
  schoolScanChunksRepository,
  schoolScanPagesRepository,
} from '../../db/repositories'
import type { SchoolScope } from '../../db/school-scope'
import {
  decryptScan,
  encryptScan,
  signedScanPageUrl,
  verifyScanPageSignature,
} from '../scan-crypto'
import { chunkKey, getScanStore, scanKey } from '../scan-storage'
import {
  SchoolError,
  auditSchool,
  auditSchoolEvent,
  storageOrRefuse,
} from './common'
import { loadExam } from './exam-service'
import { readBookletPage } from './page-reader'

// S6: scan intake. Every photographed page of a section's answer booklets comes in one at a time
// (a phone photo, or one sheet of a scanned PDF), in any order and any way up. The page reader
// finds the QR, turns the page upright and straightens it; this file decides what the page IS:
//   matched    the QR names a student and a page of THIS exam, and that page was not yet received
//   duplicate  the same page again (kept, so the teacher can compare and pick the better one)
//   unreadable no QR could be read: waits for a teacher to say which page it is
//   manual     a teacher said which page it is
//   rejected   not ours, or from another exam or another school: no picture is kept
// Pictures are stored only as encrypted (AES-256-GCM) files in private storage, never in the database,
// and the files are deleted after the school's retention period (the row stays, marked purged).

export const MAX_SCAN_BYTES = 12 * 1024 * 1024

export interface ScanUploadResult {
  pageId: string | null
  batchId: string
  status: 'matched' | 'duplicate' | 'unreadable' | 'manual' | 'rejected'
  /** A plain sentence for the person uploading. */
  message: string
  student: string | null
  pageNo: number | null
}

async function openBatch(
  db: Db,
  scope: SchoolScope,
  examId: string,
  batchId?: string | null,
): Promise<string> {
  if (batchId) {
    const b = await schoolScanBatchesRepository.findById(db, scope, batchId)
    if (!b || b.exam_id !== examId)
      throw new SchoolError('not_found', 'Upload batch not found.')
    return b.id
  }
  const b = await schoolScanBatchesRepository.insert(db, scope, {
    exam_id: examId,
    uploaded_by_user_id: scope.userId,
  })
  return b.id
}

export async function startScanBatch(
  db: Db,
  scope: SchoolScope,
  examId: string,
): Promise<{ batchId: string }> {
  await loadExam(db, scope, examId, 'handle')
  const id = await openBatch(db, scope, examId, null)
  await auditSchool(
    db,
    scope,
    'school.scan_batch_started',
    'school_scan_batches',
    id,
    null,
    { exam_id: examId },
  )
  return { batchId: id }
}

/** A name for a booklet's student, looked up inside this school only. */
async function studentOfBooklet(db: Db, scope: SchoolScope, bookletId: string) {
  const b = await schoolBookletsRepository.findById(db, scope, bookletId)
  if (!b) return null
  const rows = await examPrintRepository.studentsByIds(db, scope, [
    b.school_student_id,
  ])
  return rows[0] ?? null
}

export async function ingestScanPage(
  db: Db,
  scope: SchoolScope,
  examId: string,
  input: ScanInput,
): Promise<ScanUploadResult> {
  storageOrRefuse(getScanStore)
  const written: Array<string> = []
  try {
    return await ingestInner(db, scope, examId, input, written)
  } catch (e) {
    const store = getScanStore()
    await Promise.all(
      written.map((k) => store.remove(k).catch(() => undefined)),
    )
    throw e
  }
}

interface ScanInput {
  bytes: Buffer
  name?: string | null
  batchId?: string | null
  /** Re-uploading a page the teacher is looking at: the new picture replaces the current one. */
  replace?: boolean
  /** Only used when the page has no readable QR: which page of which student this is. */
  target?: { schoolStudentId: string; pageNo: number } | null
}

async function ingestInner(
  db: Db,
  scope: SchoolScope,
  examId: string,
  input: ScanInput,
  written: Array<string>,
): Promise<ScanUploadResult> {
  const { exam } = await loadExam(db, scope, examId, 'handle')
  if (input.bytes.length === 0 || input.bytes.length > MAX_SCAN_BYTES)
    throw new SchoolError(
      'invalid',
      'That file is empty or too big. Each photo must be under 12 MB.',
    )
  const batchId = await openBatch(db, scope, examId, input.batchId)

  const reading = await readBookletPage(input.bytes)
  const quality = {
    corners: reading.corners,
    turnedDegrees: reading.turnedDegrees,
    straightened: reading.straightened,
  }
  const base = {
    exam_id: examId,
    batch_id: batchId,
    original_name: input.name?.slice(0, 200) ?? null,
    size_bytes: input.bytes.length,
    uploaded_by_user_id: scope.userId,
    quality: JSON.stringify(quality),
  }
  const reject = async (reason: string): Promise<ScanUploadResult> => {
    const row = await schoolScanPagesRepository.insert(db, scope, {
      ...base,
      status: 'rejected',
      reason,
      quality: JSON.stringify({}),
    })
    return {
      pageId: row.id,
      batchId,
      status: 'rejected',
      message: reason,
      student: null,
      pageNo: null,
    }
  }

  if (reading.problem && !reading.image && !reading.token)
    return reject(reading.problem)
  // The files go to private storage, sealed, before the row is written; the row keeps only the
  // keys. Whatever was written is removed again if anything below fails.
  const store = getScanStore()
  const pageId = randomUUID()
  const originalKey = scanKey(scope.schoolId, examId, pageId, 'original')
  const imageKey = reading.image
    ? scanKey(scope.schoolId, examId, pageId, 'straightened')
    : null
  // the file exactly as it came in, sealed: never shrunk, never re-encoded
  await store.put(originalKey, encryptScan(input.bytes))
  written.push(originalKey)
  if (imageKey && reading.image) {
    await store.put(imageKey, encryptScan(reading.image))
    written.push(imageKey)
  }
  const keep = {
    ...base,
    id: pageId,
    original_key: originalKey,
    image_key: imageKey,
  }

  // A QR that is not ours (some other code on the sheet): treat like no QR, but say so.
  if (!reading.token) {
    if (input.target)
      return assignNew(
        db,
        scope,
        examId,
        keep,
        input.target,
        input.replace === true,
        batchId,
      )
    const reason = reading.foreignQr
      ? 'The code on this page is not from a PrepPlan booklet. Choose which student and page it is.'
      : 'We could not read the code on this page. Choose which student and page it is.'
    const row = await schoolScanPagesRepository.insert(db, scope, {
      ...keep,
      status: 'unreadable',
      reason,
    })
    return {
      pageId: row.id,
      batchId,
      status: 'unreadable',
      message: reason,
      student: null,
      pageNo: null,
    }
  }

  const found = await schoolScanPagesRepository.findPageByToken(
    db,
    reading.token,
  )
  if (!found) return reject('This page is not from a PrepPlan answer booklet.')
  // Another school's booklet: say so plainly, keep nothing, and reveal nothing about it.
  if (found.school_id !== scope.schoolId)
    return reject('This page belongs to a different school. It was not saved.')
  if (found.exam_id !== examId) {
    const other = await db
      .selectFrom('school_exams')
      .select('title')
      .where('school_id', '=', scope.schoolId)
      .where('id', '=', found.exam_id)
      .executeTakeFirst()
    return reject(
      `This page is from a different exam${other ? ` (“${other.title}”)` : ''}, not “${exam.title}”. It was not saved.`,
    )
  }
  return place(
    db,
    scope,
    examId,
    keep,
    found.booklet_id,
    found.page_no,
    input.replace === true,
    batchId,
    'matched',
  )
}

async function assignNew(
  db: Db,
  scope: SchoolScope,
  examId: string,
  base: Record<string, unknown>,
  target: { schoolStudentId: string; pageNo: number },
  replace: boolean,
  batchId: string,
): Promise<ScanUploadResult> {
  const booklet = await bookletFor(db, scope, examId, target.schoolStudentId)
  return place(
    db,
    scope,
    examId,
    base,
    booklet.id,
    checkPageNo(booklet.page_count, target.pageNo),
    replace,
    batchId,
    'manual',
  )
}

async function bookletFor(
  db: Db,
  scope: SchoolScope,
  examId: string,
  schoolStudentId: string,
) {
  const booklet = (await schoolBookletsRepository.list(db, scope)).find(
    (b) => b.exam_id === examId && b.school_student_id === schoolStudentId,
  )
  if (!booklet)
    throw new SchoolError(
      'not_found',
      'That student has no booklet for this exam.',
    )
  return booklet
}

function checkPageNo(pageCount: number, pageNo: number): number {
  if (!Number.isInteger(pageNo) || pageNo < 1 || pageNo > pageCount)
    throw new SchoolError('invalid', `Choose a page from 1 to ${pageCount}.`)
  return pageNo
}

async function place(
  db: Db,
  scope: SchoolScope,
  examId: string,
  base: Record<string, unknown>,
  bookletId: string,
  pageNo: number,
  replace: boolean,
  batchId: string,
  kind: 'matched' | 'manual',
): Promise<ScanUploadResult> {
  const who = await studentOfBooklet(db, scope, bookletId)
  const student = who?.name ?? null
  const label = `${student ?? 'the student'}, page ${pageNo}`
  const row = await db.transaction().execute(async (trx) => {
    const current = await trx
      .selectFrom('school_scan_pages')
      .select(['id'])
      .where('school_id', '=', scope.schoolId)
      .where('booklet_id', '=', bookletId)
      .where('page_no', '=', pageNo)
      .where('status', 'in', ['matched', 'manual'])
      .forUpdate()
      .executeTakeFirst()
    // a student marked absent whose page turns up is no longer absent
    const absent = (
      await schoolExamAbsencesRepository.openForExam(trx, scope, examId)
    ).find((a) => a.school_student_id === who?.school_student_id)
    if (absent)
      await schoolExamAbsencesRepository.update(trx, scope, absent.id, {
        cleared_at: new Date(),
        cleared_reason: 'A page of the booklet arrived.',
      })
    if (current && !replace) {
      const dup = await schoolScanPagesRepository.insert(trx, scope, {
        ...base,
        booklet_id: bookletId,
        page_no: pageNo,
        status: 'duplicate',
        reason: 'This page was already received. The first copy is kept.',
      } as never)
      return { id: dup.id, status: 'duplicate' as const, replaced: false }
    }
    if (current) {
      await schoolScanPagesRepository.update(trx, scope, current.id, {
        status: 'duplicate',
        reason: 'Replaced by a newer picture of this page.',
      })
    }
    const ins = await schoolScanPagesRepository.insert(trx, scope, {
      ...base,
      booklet_id: bookletId,
      page_no: pageNo,
      status: kind,
      assigned_by_user_id: kind === 'manual' ? scope.userId : null,
    } as never)
    return { id: ins.id, status: kind, replaced: current !== undefined }
  })
  const message =
    row.status === 'duplicate'
      ? `Already received: ${label}. This copy was kept aside.`
      : row.replaced
        ? `Replaced: ${label}.`
        : `Received: ${label}.`
  return {
    pageId: row.id,
    batchId,
    status: row.status,
    message,
    student,
    pageNo,
  }
}

// ---------------------------------------------------------------- the per-student view

export interface StudentScanRow {
  schoolStudentId: string
  name: string
  admissionNo: string | null
  rollNo: string | null
  section: string
  pageCount: number
  received: Array<number>
  missing: Array<number>
  duplicates: Array<{ pageNo: number; count: number }>
  absent: boolean
  state: 'complete' | 'missing' | 'absent' | 'none'
  /** The current picture of each received page, as short-lived signed links. */
  pages: Array<{ pageNo: number; pageId: string; url: string }>
}

export interface UnmatchedPage {
  id: string
  status: 'unreadable' | 'rejected'
  reason: string | null
  name: string | null
  url: string | null
  createdAt: string
}

export interface ScanSummary {
  pageCount: number
  students: Array<StudentScanRow>
  unmatched: Array<UnmatchedPage>
  totals: {
    students: number
    complete: number
    missing: number
    absent: number
    none: number
    unmatched: number
    rejected: number
  }
}

function schoolScanUrl(schoolId: string, pageId: string): string {
  return signedScanPageUrl(pageId).replace(
    '/api/scan-pages/',
    `/api/schools/${schoolId}/scan-images/`,
  )
}

export async function scanSummary(
  db: Db,
  scope: SchoolScope,
  examId: string,
): Promise<ScanSummary> {
  const { sectionIds } = await loadExam(db, scope, examId, 'handle')
  const students = await examPrintRepository.studentsOfSections(
    db,
    scope,
    sectionIds,
  )
  const booklets = (await schoolBookletsRepository.list(db, scope)).filter(
    (b) => b.exam_id === examId,
  )
  const byStudent = new Map(booklets.map((b) => [b.school_student_id, b]))
  const pages = await schoolScanPagesRepository.listForExam(db, scope, examId)
  const absences = new Set(
    (await schoolExamAbsencesRepository.openForExam(db, scope, examId)).map(
      (a) => a.school_student_id,
    ),
  )
  const pageCount = booklets[0]?.page_count ?? 0

  const rows: Array<StudentScanRow> = students.map((s) => {
    const b = byStudent.get(s.school_student_id)
    const mine = b ? pages.filter((p) => p.booklet_id === b.id) : []
    const current = mine.filter(
      (p) => p.status === 'matched' || p.status === 'manual',
    )
    const received = [...new Set(current.map((p) => p.page_no as number))].sort(
      (a, c) => a - c,
    )
    const count = b?.page_count ?? pageCount
    const missing = Array.from({ length: count }, (_, i) => i + 1).filter(
      (n) => !received.includes(n),
    )
    const dupMap = new Map<number, number>()
    for (const p of mine.filter((q) => q.status === 'duplicate'))
      dupMap.set(
        p.page_no as number,
        (dupMap.get(p.page_no as number) ?? 0) + 1,
      )
    const absent = absences.has(s.school_student_id)
    const state: StudentScanRow['state'] = absent
      ? 'absent'
      : received.length === 0
        ? 'none'
        : missing.length === 0
          ? 'complete'
          : 'missing'
    return {
      schoolStudentId: s.school_student_id,
      name: s.name,
      admissionNo: s.admission_no,
      rollNo: s.roll_no,
      section: s.section_name,
      pageCount: count,
      received,
      missing: absent ? [] : missing,
      duplicates: [...dupMap]
        .map(([pageNo, n]) => ({ pageNo, count: n }))
        .sort((a, c) => a.pageNo - c.pageNo),
      absent,
      state,
      pages: current
        .filter((p) => p.has_image)
        .map((p) => ({
          pageNo: p.page_no as number,
          pageId: p.id,
          url: schoolScanUrl(scope.schoolId, p.id),
        }))
        .sort((a, c) => a.pageNo - c.pageNo),
    }
  })

  const unmatched: Array<UnmatchedPage> = pages
    .filter((p) => p.status === 'unreadable' || p.status === 'rejected')
    .map((p) => ({
      id: p.id,
      status: p.status as 'unreadable' | 'rejected',
      reason: p.reason,
      name: p.original_name,
      url: p.has_image ? schoolScanUrl(scope.schoolId, p.id) : null,
      createdAt: p.created_at.toISOString(),
    }))
  const count = (s: StudentScanRow['state']) =>
    rows.filter((r) => r.state === s).length
  return {
    pageCount,
    students: rows,
    unmatched,
    totals: {
      students: rows.length,
      complete: count('complete'),
      missing: count('missing'),
      absent: count('absent'),
      none: count('none'),
      unmatched: unmatched.filter((u) => u.status === 'unreadable').length,
      rejected: unmatched.filter((u) => u.status === 'rejected').length,
    },
  }
}

// ---------------------------------------------------------------- teacher's decisions

/** Says which student and page an unreadable picture is. */
export async function assignScanPage(
  db: Db,
  scope: SchoolScope,
  examId: string,
  pageId: string,
  target: { schoolStudentId: string; pageNo: number },
  replace = false,
): Promise<ScanUploadResult> {
  await loadExam(db, scope, examId, 'handle')
  const page = await schoolScanPagesRepository.findWithImage(db, scope, pageId)
  if (!page || page.exam_id !== examId)
    throw new SchoolError('not_found', 'Page not found.')
  if (page.status !== 'unreadable')
    throw new SchoolError(
      'conflict',
      'Only a page we could not read can be assigned.',
    )
  const booklet = await bookletFor(db, scope, examId, target.schoolStudentId)
  const pageNo = checkPageNo(booklet.page_count, target.pageNo)
  const who = await studentOfBooklet(db, scope, booklet.id)
  const out = await db.transaction().execute(async (trx) => {
    const current = await trx
      .selectFrom('school_scan_pages')
      .select('id')
      .where('school_id', '=', scope.schoolId)
      .where('booklet_id', '=', booklet.id)
      .where('page_no', '=', pageNo)
      .where('status', 'in', ['matched', 'manual'])
      .forUpdate()
      .executeTakeFirst()
    if (current && !replace)
      throw new SchoolError(
        'conflict',
        `Page ${pageNo} of ${who?.name ?? 'this student'} is already received. Choose “replace” to use this picture instead.`,
      )
    if (current)
      await schoolScanPagesRepository.update(trx, scope, current.id, {
        status: 'duplicate',
        reason: 'Replaced by a newer picture of this page.',
      })
    await schoolScanPagesRepository.update(trx, scope, pageId, {
      status: 'manual',
      booklet_id: booklet.id,
      page_no: pageNo,
      reason: null,
      assigned_by_user_id: scope.userId,
    })
    const absent = (
      await schoolExamAbsencesRepository.openForExam(trx, scope, examId)
    ).find((a) => a.school_student_id === target.schoolStudentId)
    if (absent)
      await schoolExamAbsencesRepository.update(trx, scope, absent.id, {
        cleared_at: new Date(),
        cleared_reason: 'A page of the booklet arrived.',
      })
    return true
  })
  void out
  await auditSchool(
    db,
    scope,
    'school.scan_page_assigned',
    'school_scan_pages',
    pageId,
    { status: 'unreadable' },
    {
      school_student_id: target.schoolStudentId,
      page_no: pageNo,
      replaced: replace,
    },
  )
  return {
    pageId,
    batchId: page.batch_id,
    status: 'manual',
    message: `Saved as ${who?.name ?? 'the student'}, page ${pageNo}.`,
    student: who?.name ?? null,
    pageNo,
  }
}

export async function setStudentAbsent(
  db: Db,
  scope: SchoolScope,
  examId: string,
  schoolStudentId: string,
  absent: boolean,
): Promise<void> {
  const { sectionIds } = await loadExam(db, scope, examId, 'handle')
  const mine = (
    await examPrintRepository.studentsOfSections(db, scope, sectionIds)
  ).some((s) => s.school_student_id === schoolStudentId)
  if (!mine)
    throw new SchoolError('not_found', 'That student is not part of this exam.')
  const open = (
    await schoolExamAbsencesRepository.openForExam(db, scope, examId)
  ).find((a) => a.school_student_id === schoolStudentId)
  if (absent) {
    if (open) return
    const booklet = (await schoolBookletsRepository.list(db, scope)).find(
      (b) => b.exam_id === examId && b.school_student_id === schoolStudentId,
    )
    if (booklet) {
      const got = (
        await schoolScanPagesRepository.listForExam(db, scope, examId)
      ).some(
        (p) =>
          p.booklet_id === booklet.id &&
          (p.status === 'matched' || p.status === 'manual'),
      )
      if (got)
        throw new SchoolError(
          'conflict',
          'Pages of this student have already come in, so she cannot be marked absent.',
        )
    }
    const row = await schoolExamAbsencesRepository.insert(db, scope, {
      exam_id: examId,
      school_student_id: schoolStudentId,
      marked_by_user_id: scope.userId,
    })
    await auditSchool(
      db,
      scope,
      'school.exam_absent_marked',
      'school_exam_absences',
      row.id,
      null,
      { exam_id: examId, school_student_id: schoolStudentId },
    )
  } else if (open) {
    await schoolExamAbsencesRepository.update(db, scope, open.id, {
      cleared_at: new Date(),
      cleared_reason: 'Cleared by a teacher.',
    })
    await auditSchool(
      db,
      scope,
      'school.exam_absent_cleared',
      'school_exam_absences',
      open.id,
      null,
      { exam_id: examId, school_student_id: schoolStudentId },
    )
  }
}

// ---------------------------------------------------------------- the picture itself

/**
 * One stored picture, for a signed-in member of this school who may handle the exam, with a link
 * that has not expired. Anything else is a plain "not found" so a page's existence is not leaked.
 */
export async function scanImage(
  db: Db,
  scope: SchoolScope,
  pageId: string,
  exp: string | null,
  sig: string | null,
): Promise<Buffer> {
  const notFound = new SchoolError(
    'not_found',
    'We could not find that picture.',
  )
  if (!verifyScanPageSignature(pageId, exp, sig)) throw notFound
  const page = await schoolScanPagesRepository.findWithImage(db, scope, pageId)
  if (!page?.image_key) throw notFound
  try {
    await loadExam(db, scope, page.exam_id, 'handle')
  } catch {
    throw notFound
  }
  const sealed = await getScanStore().get(page.image_key)
  if (!sealed) throw notFound
  return decryptScan(sealed)
}

/** The original upload is deleted this many days after its exam's marks lock. */
export const ORIGINAL_KEPT_DAYS_AFTER_LOCK = 7

/**
 * The daily clean-up of stored files. Rows are never deleted; a file that could not be deleted keeps
 * its key and is tried again the next day.
 *  - originals: 7 days after the exam's marks lock (the straightened copy stays), logged per exam;
 *  - everything of a page (both files): past the school's own retention period, the row marked purged;
 *  - pieces of uploads never joined: after a day;
 *  - finished booklet print files: after their week, and any batch left behind by a failed job.
 */
export async function purgeScanData(
  db: Db,
  now = new Date(),
): Promise<{
  scans: number
  originals: number
  printFiles: number
  chunks: number
}> {
  const store = getScanStore()

  const lockedDue = await schoolScanPagesRepository.listOriginalsDueAfterLock(
    db,
    now,
    ORIGINAL_KEPT_DAYS_AFTER_LOCK,
  )
  const originalsDone: Array<(typeof lockedDue)[number]> = []
  for (const p of lockedDue) {
    try {
      if (p.original_key) await store.remove(p.original_key)
      originalsDone.push(p)
    } catch {
      // keep the key; try again tomorrow
    }
  }
  const originals = await schoolScanPagesRepository.markOriginalsPurged(
    db,
    originalsDone.map((p) => p.id),
    now,
  )
  const byExam = new Map<
    string,
    { schoolId: string; lockedAt: Date; n: number }
  >()
  for (const p of originalsDone) {
    const e = byExam.get(p.exam_id) ?? {
      schoolId: p.school_id,
      lockedAt: p.marks_locked_at as Date,
      n: 0,
    }
    e.n++
    byExam.set(p.exam_id, e)
  }
  for (const [examId, e] of byExam)
    await auditSchoolEvent(db, {
      schoolId: e.schoolId,
      actorUserId: null,
      action: 'school.scan_originals_purged',
      entity: 'school_exams',
      entityId: examId,
      before: null,
      after: {
        pages: e.n,
        marks_locked_at: e.lockedAt,
        days_after_lock: ORIGINAL_KEPT_DAYS_AFTER_LOCK,
      },
    })

  const due = await schoolScanPagesRepository.listDueForPurge(db, now)
  const done: Array<string> = []
  for (const p of due) {
    try {
      for (const k of [p.image_key, p.original_key])
        if (k) await store.remove(k)
      done.push(p.id)
    } catch {
      // keep the keys; try again tomorrow
    }
  }
  const scans = await schoolScanPagesRepository.markPurged(db, done, now)

  let chunks = 0
  for (const c of await schoolScanChunksRepository.listAbandoned(db, now)) {
    try {
      if (c.storage_key) await store.remove(c.storage_key)
      await db
        .updateTable('school_scan_chunks')
        .set({ storage_key: null })
        .where('id', '=', c.id)
        .execute()
      chunks++
    } catch {
      // try again tomorrow
    }
  }

  let printFiles = 0
  for (const j of await schoolPrintJobsRepository.listExpired(db, now)) {
    try {
      if (j.result_key) await store.remove(j.result_key)
      await schoolPrintJobsRepository.markResultPurged(db, j.id, now)
      printFiles++
    } catch {
      // try again tomorrow
    }
  }
  for (const part of await schoolPrintJobPartsRepository.listLeftOver(
    db,
    now,
  )) {
    try {
      if (part.pdf_key) await store.remove(part.pdf_key)
      await db
        .updateTable('school_print_job_parts')
        .set({ pdf_key: null })
        .where('id', '=', part.id)
        .execute()
      printFiles++
    } catch {
      // try again tomorrow
    }
  }
  return { scans, originals, chunks, printFiles }
}

// ---------------------------------------------------------------- big files, in pieces

/** The largest piece one request may carry (hosting limits a request to about 4.5 MB). */
export const MAX_CHUNK_BYTES = 3.5 * 1024 * 1024
const MAX_CHUNKS = 4 // 4 x 3.5 MB covers the 12 MB file limit

/**
 * Keeps one piece of a file being uploaded, sealed, in storage (not in the database). Safe to send
 * again: the same piece replaces itself.
 */
export async function saveScanChunk(
  db: Db,
  scope: SchoolScope,
  examId: string,
  uploadId: string,
  seq: number,
  bytes: Buffer,
): Promise<{ received: number }> {
  await loadExam(db, scope, examId, 'handle')
  storageOrRefuse(getScanStore)
  if (!/^[0-9a-f-]{36}$/i.test(uploadId))
    throw new SchoolError('invalid', 'That upload code is not valid.')
  if (!Number.isInteger(seq) || seq < 0 || seq >= MAX_CHUNKS)
    throw new SchoolError(
      'invalid',
      'That file is too big. Each photo must be under 12 MB.',
    )
  if (bytes.length === 0 || bytes.length > MAX_CHUNK_BYTES)
    throw new SchoolError(
      'invalid',
      'That piece of the file is empty or too big.',
    )
  const mine = await schoolScanChunksRepository.piecesOf(
    db,
    scope,
    examId,
    uploadId,
  )
  const existing = mine.find((m) => m.seq === seq)
  if (existing?.consumed_at)
    throw new SchoolError('conflict', 'That upload was already used.')
  const key = chunkKey(scope.schoolId, uploadId, seq)
  await getScanStore().put(key, encryptScan(bytes))
  if (existing)
    await schoolScanChunksRepository.update(db, scope, existing.id, {
      storage_key: key,
      size_bytes: bytes.length,
    })
  else
    await schoolScanChunksRepository.insert(db, scope, {
      exam_id: examId,
      upload_id: uploadId,
      seq,
      storage_key: key,
      size_bytes: bytes.length,
      created_by_user_id: scope.userId,
    })
  return { received: mine.length + (existing ? 0 : 1) }
}

/**
 * Joins the pieces of an upload into the original file, then deletes them from storage (the rows
 * stay, with the key cleared). Only the joined file is kept, by the page that is then made from it.
 */
export async function takeScanUpload(
  db: Db,
  scope: SchoolScope,
  examId: string,
  uploadId: string,
  chunks: number,
): Promise<Buffer> {
  if (!Number.isInteger(chunks) || chunks < 1 || chunks > MAX_CHUNKS)
    throw new SchoolError('invalid', 'That upload is not valid.')
  const pieces = await schoolScanChunksRepository.piecesOf(
    db,
    scope,
    examId,
    uploadId,
  )
  const ok =
    pieces.length === chunks &&
    pieces.every(
      (p, i) => p.seq === i && p.storage_key !== null && p.consumed_at === null,
    )
  if (!ok)
    throw new SchoolError(
      'invalid',
      'Some of that file did not arrive. Please send it again.',
    )
  const store = getScanStore()
  const parts: Array<Buffer> = []
  for (const p of pieces) {
    const sealed = p.storage_key ? await store.get(p.storage_key) : null
    if (!sealed)
      throw new SchoolError(
        'invalid',
        'Some of that file did not arrive. Please send it again.',
      )
    parts.push(decryptScan(sealed))
  }
  for (const p of pieces) {
    if (p.storage_key) await store.remove(p.storage_key)
    await schoolScanChunksRepository.update(db, scope, p.id, {
      storage_key: null,
      consumed_at: new Date(),
    })
  }
  return Buffer.concat(parts)
}
