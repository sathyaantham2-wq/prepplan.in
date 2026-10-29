import { PDFDocument } from 'pdf-lib'
import type { Db } from '../../db/connection'
import {
  examPrintRepository,
  schoolPrintJobPartsRepository,
  schoolPrintJobsRepository,
} from '../../db/repositories'
import type { SchoolScope } from '../../db/school-scope'
import { decryptScan, encryptScan } from '../scan-crypto'
import { getScanStore, printKey } from '../scan-storage'
import { SchoolError, auditSchool } from './common'
import {
  bookletStudents,
  ensureBookletRecords,
  loadExam,
  renderBookletBatch,
} from './exam-service'
import type { BookletRequest } from './exam-service'

// Printing a class of answer booklets in batches. A browser (or a test) starts a job, then asks for
// one batch at a time until it is done, so no single request runs long and the teacher sees
// progress. Each batch is a PDF kept until the last one is made; then they are joined into one PDF
// that is held for 7 days (after that only the row remains).

export const DEFAULT_BATCH_SIZE = 8
const RESULT_DAYS = 7

export interface JobProgress {
  jobId: string
  status: 'running' | 'done' | 'failed'
  total: number
  done: number
  batches: { done: number; total: number }
  pages: number | null
  message: string | null
  /** True when the joined PDF can still be downloaded. */
  ready: boolean
}

type JobRow = NonNullable<
  Awaited<ReturnType<typeof schoolPrintJobsRepository.findById>>
>

async function progress(
  db: Db,
  scope: SchoolScope,
  job: JobRow,
): Promise<JobProgress> {
  const parts = (await schoolPrintJobPartsRepository.list(db, scope)).filter(
    (p) => p.job_id === job.id,
  )
  return {
    jobId: job.id,
    status: job.status,
    total: job.total,
    done: parts.reduce((n, p) => n + p.students, 0),
    batches: {
      done: parts.length,
      total: Math.ceil(job.total / job.batch_size),
    },
    pages: job.page_count,
    message: job.message,
    ready: job.status === 'done' && job.result_key !== null,
  }
}

export async function startBookletJob(
  db: Db,
  scope: SchoolScope,
  examId: string,
  req: BookletRequest & { batchSize?: number } = {},
): Promise<JobProgress> {
  const { students, manifest } = await bookletStudents(db, scope, examId, req)
  const batchSize = Math.max(
    1,
    Math.min(20, Math.floor(req.batchSize ?? DEFAULT_BATCH_SIZE)),
  )
  await ensureBookletRecords(db, scope, examId, students, manifest)
  const job = await schoolPrintJobsRepository.insert(db, scope, {
    exam_id: examId,
    kind: 'booklets',
    status: 'running',
    total: students.length,
    done_count: 0,
    batch_size: batchSize,
    student_ids: JSON.stringify(students.map((s) => s.school_student_id)),
    created_by_user_id: scope.userId,
    expires_at: new Date(Date.now() + RESULT_DAYS * 24 * 60 * 60 * 1000),
  })
  await auditSchool(
    db,
    scope,
    'school.booklet_job_started',
    'school_print_jobs',
    job.id,
    null,
    { students: students.length, batch_size: batchSize },
  )
  return progress(db, scope, job)
}

async function loadJob(
  db: Db,
  scope: SchoolScope,
  jobId: string,
): Promise<JobRow> {
  const job = await schoolPrintJobsRepository.findById(db, scope, jobId)
  if (!job) throw new SchoolError('not_found', 'Print job not found.')
  await loadExam(db, scope, job.exam_id, 'handle') // the same people who may print booklets
  return job
}

export async function getBookletJob(
  db: Db,
  scope: SchoolScope,
  jobId: string,
): Promise<JobProgress> {
  return progress(db, scope, await loadJob(db, scope, jobId))
}

/** Makes the next batch. Safe to call again and again: a finished job just reports itself. */
export async function stepBookletJob(
  db: Db,
  scope: SchoolScope,
  jobId: string,
): Promise<JobProgress> {
  const job = await loadJob(db, scope, jobId)
  if (job.status !== 'running') return progress(db, scope, job)
  const parts = (await schoolPrintJobPartsRepository.list(db, scope)).filter(
    (p) => p.job_id === job.id,
  )
  const seq = parts.length + 1
  const ids = job.student_ids as unknown as Array<string>
  const slice = ids.slice((seq - 1) * job.batch_size, seq * job.batch_size)
  if (slice.length === 0) return progress(db, scope, job)

  try {
    const {
      exam,
      students: all,
      manifest,
    } = await bookletStudents(db, scope, job.exam_id, {})
    const wanted = new Map(all.map((s) => [s.school_student_id, s]))
    const batch = slice
      .map((id) => wanted.get(id))
      .filter((s): s is NonNullable<typeof s> => s !== undefined)
    if (batch.length !== slice.length) {
      // a student left the exam's sections since the job began: print who is still there
    }
    const { pdf, pages } = await renderBookletBatch(
      db,
      scope,
      exam,
      manifest,
      batch,
    )
    // the batch is a sealed file in private storage; the row keeps only its key
    const key = printKey(scope.schoolId, job.exam_id, job.id, `part-${seq}`)
    await getScanStore().put(key, encryptScan(pdf))
    await schoolPrintJobPartsRepository
      .insert(db, scope, {
        job_id: job.id,
        seq,
        students: slice.length,
        pages,
        pdf_key: key,
      })
      .catch(() => undefined) // another request made this batch first: keep that one
  } catch (e) {
    await schoolPrintJobsRepository.update(db, scope, job.id, {
      status: 'failed',
      message: 'A batch could not be printed. Please start the printing again.',
    })
    throw e
  }

  const after = (await schoolPrintJobPartsRepository.list(db, scope))
    .filter((p) => p.job_id === job.id)
    .sort((a, b) => a.seq - b.seq)
  const done = after.reduce((n, p) => n + p.students, 0)
  if (done >= job.total) {
    const store = getScanStore()
    const merged = await PDFDocument.create()
    let pageCount = 0
    for (const part of after) {
      const sealed = part.pdf_key ? await store.get(part.pdf_key) : null
      if (!sealed) throw new Error('A printed batch is missing')
      const src = await PDFDocument.load(decryptScan(sealed))
      const copied = await merged.copyPages(src, src.getPageIndices())
      for (const p of copied) merged.addPage(p)
      pageCount += copied.length
    }
    const bytes = Buffer.from(await merged.save())
    const resultKey = printKey(scope.schoolId, job.exam_id, job.id, 'result')
    await store.put(resultKey, encryptScan(bytes))
    await schoolPrintJobsRepository.update(db, scope, job.id, {
      status: 'done',
      done_count: done,
      result_key: resultKey,
      page_count: pageCount,
      finished_at: new Date(),
    })
    // only the joined file is kept: the batches are deleted at once
    for (const part of after) {
      if (part.pdf_key) await store.remove(part.pdf_key)
      await schoolPrintJobPartsRepository.update(db, scope, part.id, {
        pdf_key: null,
      })
    }
    await auditSchool(
      db,
      scope,
      'school.booklets_printed',
      'school_exams',
      job.exam_id,
      null,
      { students: done, pages: pageCount, batches: after.length },
    )
  } else {
    await schoolPrintJobsRepository.update(db, scope, job.id, {
      done_count: done,
    })
  }
  return progress(
    db,
    scope,
    (await schoolPrintJobsRepository.findById(db, scope, job.id)) as JobRow,
  )
}

export async function bookletJobResult(
  db: Db,
  scope: SchoolScope,
  jobId: string,
): Promise<{ pdf: Buffer; fileName: string }> {
  const job = await loadJob(db, scope, jobId)
  if (job.status !== 'done')
    throw new SchoolError('conflict', 'The booklets are not ready yet.')
  const sealed = job.result_key
    ? await getScanStore().get(job.result_key)
    : null
  if (!sealed)
    throw new SchoolError(
      'not_found',
      'This file is no longer kept. Start the printing again.',
    )
  const exam = await loadExam(db, scope, job.exam_id, 'handle')
  const name =
    exam.exam.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 60) || 'exam'
  return { pdf: decryptScan(sealed), fileName: `${name}-answer-booklets.pdf` }
}

// Re-exported for the cron that blanks old files.
export { examPrintRepository }
