import type { Db } from '../../db/connection'
import {
  schoolMarkingJobItemsRepository,
  schoolMarkingJobsRepository,
} from '../../db/repositories'
import type { SchoolScope } from '../../db/school-scope'
import { SchoolError, auditSchool } from './common'
import { markStudentSheets, markingOverview } from './marking'
import type { MarkingAi } from './marking'
import { assertPaperReadyForMarking, loadOwnPaper } from './own-paper-service'

// "Mark all ready students" as a job (owner direction 2026-11-01). One item per student; the page asks for the
// next item until none is left, so the work goes on a serverless host, can be run by two tabs at once, and is
// picked up again when the page is reopened. An item is claimed with a lease; if a worker dies the lease runs out
// and the item is claimed again, at most MAX_ATTEMPTS times. A problem that is the teacher's to fix (a page waiting
// for a yes, a paper no longer approved) is not retried: that student is shown as failed with the plain reason.

export const LEASE_MS = 3 * 60 * 1000
export const MAX_ATTEMPTS = 3
const MARKED_BY = new Set(['school_admin', 'teacher'])

export interface JobProgress {
  jobId: string
  paperId: string
  status: 'running' | 'done' | 'cancelled'
  total: number
  /** Finished, whatever the result. */
  finished: number
  failed: number
  /** Waiting or being marked right now. */
  remaining: number
  marked: number
  needsTeacher: number
  rejected: number
  failures: Array<{ studentId: string; message: string }>
}

function assertMarker(scope: SchoolScope) {
  if (!MARKED_BY.has(scope.role))
    throw new SchoolError('forbidden', 'Only the school office and teachers can mark answer sheets.')
}

async function loadJob(db: Db, scope: SchoolScope, jobId: string) {
  const job = await schoolMarkingJobsRepository.findById(db, scope, jobId)
  if (!job) throw new SchoolError('not_found', 'That marking job was not found.')
  await loadOwnPaper(db, scope, job.paper_id) // the same access rule as the paper itself
  return job
}

export async function jobProgress(db: Db, scope: SchoolScope, jobId: string): Promise<JobProgress> {
  const job = await loadJob(db, scope, jobId)
  const items = await db
    .selectFrom('school_marking_job_items')
    .select(['school_student_id', 'status', 'result', 'message'])
    .where('school_id', '=', scope.schoolId)
    .where('job_id', '=', jobId)
    .execute()
  return {
    jobId,
    paperId: job.paper_id,
    status: job.status as JobProgress['status'],
    total: items.length,
    finished: items.filter((i) => i.status === 'done' || i.status === 'failed').length,
    failed: items.filter((i) => i.status === 'failed').length,
    remaining: items.filter((i) => i.status === 'queued' || i.status === 'running').length,
    marked: items.filter((i) => i.result === 'marked').length,
    needsTeacher: items.filter((i) => i.result === 'needs_teacher').length,
    rejected: items.filter((i) => i.result === 'rejected').length,
    failures: items
      .filter((i) => i.status === 'failed')
      .map((i) => ({ studentId: i.school_student_id, message: i.message ?? 'Could not be marked.' })),
  }
}

/** The newest job of a paper (so a reopened page can carry on), or null. */
export async function latestJob(db: Db, scope: SchoolScope, paperId: string): Promise<JobProgress | null> {
  assertMarker(scope)
  await loadOwnPaper(db, scope, paperId)
  const job = await db
    .selectFrom('school_marking_jobs')
    .select('id')
    .where('school_id', '=', scope.schoolId)
    .where('paper_id', '=', paperId)
    .orderBy('created_at', 'desc')
    .executeTakeFirst()
  return job ? jobProgress(db, scope, job.id) : null
}

/**
 * Starts a job for every student whose sheets are in and not yet marked (or whose marking was rejected), or for the
 * students named. A job already running for the paper is returned instead of a second one.
 */
export async function startMarkingJob(
  db: Db,
  scope: SchoolScope,
  paperId: string,
  studentIds?: ReadonlyArray<string>,
): Promise<JobProgress> {
  assertMarker(scope)
  await loadOwnPaper(db, scope, paperId)
  await assertPaperReadyForMarking(db, scope, paperId)
  const running = await db
    .selectFrom('school_marking_jobs')
    .select('id')
    .where('school_id', '=', scope.schoolId)
    .where('paper_id', '=', paperId)
    .where('status', '=', 'running')
    .executeTakeFirst()
  if (running) return jobProgress(db, scope, running.id)

  const overview = await markingOverview(db, scope, paperId)
  const wanted = overview.students.filter((s) =>
    studentIds ? studentIds.includes(s.schoolStudentId) : s.status === 'ready' || s.status === 'rejected',
  )
  if (wanted.length === 0)
    throw new SchoolError('conflict', 'Nobody is ready to be marked. Add answer sheets first.')
  const jobId = await db.transaction().execute(async (trx) => {
    const job = await schoolMarkingJobsRepository.insert(trx, scope, {
      paper_id: paperId,
      created_by_user_id: scope.userId,
      status: 'running',
    })
    for (const s of wanted)
      await schoolMarkingJobItemsRepository.insert(trx, scope, {
        job_id: job.id,
        school_student_id: s.schoolStudentId,
        status: 'queued',
      })
    await auditSchool(trx, scope, 'school.marking_job_started', 'school_marking_jobs', job.id, null, {
      paper_id: paperId,
      students: wanted.length,
    })
    return job.id
  })
  return jobProgress(db, scope, jobId)
}

/**
 * Marks ONE student of the job (the next one waiting, or one whose lease ran out) and says where the job stands.
 * Call it again until `remaining` is 0. Safe to call from two places at once.
 */
export async function markingJobStep(
  db: Db,
  scope: SchoolScope,
  jobId: string,
  ai?: MarkingAi,
  now = new Date(),
): Promise<JobProgress> {
  assertMarker(scope)
  const job = await loadJob(db, scope, jobId)
  if (job.status !== 'running') return jobProgress(db, scope, jobId)

  const claimed = await db.transaction().execute(async (trx) => {
    // an item whose lease ran out for the last time is failed rather than tried again
    await trx
      .updateTable('school_marking_job_items')
      .set({ status: 'failed', message: 'Marking did not finish after several tries. Please mark this student again.', updated_at: now })
      .where('school_id', '=', scope.schoolId)
      .where('job_id', '=', jobId)
      .where('status', '=', 'running')
      .where('lease_until', '<', now)
      .where('attempts', '>=', MAX_ATTEMPTS)
      .execute()
    const next = await trx
      .selectFrom('school_marking_job_items')
      .select(['id', 'school_student_id', 'attempts'])
      .where('school_id', '=', scope.schoolId)
      .where('job_id', '=', jobId)
      .where((eb) =>
        eb.or([eb('status', '=', 'queued'), eb.and([eb('status', '=', 'running'), eb('lease_until', '<', now)])]),
      )
      .orderBy('updated_at')
      .orderBy('id')
      .limit(1)
      .forUpdate()
      .skipLocked()
      .executeTakeFirst()
    if (!next) return null
    await trx
      .updateTable('school_marking_job_items')
      .set({ status: 'running', attempts: next.attempts + 1, lease_until: new Date(now.getTime() + LEASE_MS), updated_at: now })
      .where('id', '=', next.id)
      .where('school_id', '=', scope.schoolId)
      .execute()
    return { id: next.id, studentId: next.school_student_id, attempts: next.attempts + 1 }
  })

  if (claimed) {
    const finish = (status: 'done' | 'failed' | 'queued', result: string | null, message: string | null) =>
      db
        .updateTable('school_marking_job_items')
        .set({ status, result, message, lease_until: null, updated_at: new Date() })
        .where('id', '=', claimed.id)
        .where('school_id', '=', scope.schoolId)
        .execute()
    try {
      const r = await markStudentSheets(db, scope, job.paper_id, claimed.studentId, ai)
      await finish('done', r.status, r.message)
    } catch (e) {
      if (e instanceof SchoolError) await finish('failed', null, e.message)
      else if (claimed.attempts >= MAX_ATTEMPTS)
        await finish('failed', null, 'Marking did not finish after several tries. Please mark this student again.')
      else await finish('queued', null, null)
    }
  }

  // nothing waiting or running: the job is done
  const left = await db
    .selectFrom('school_marking_job_items')
    .select('id')
    .where('school_id', '=', scope.schoolId)
    .where('job_id', '=', jobId)
    .where('status', 'in', ['queued', 'running'])
    .executeTakeFirst()
  if (!left) {
    const done = await db
      .updateTable('school_marking_jobs')
      .set({ status: 'done', finished_at: new Date() })
      .where('id', '=', jobId)
      .where('school_id', '=', scope.schoolId)
      .where('status', '=', 'running')
      .returning('id')
      .executeTakeFirst()
    if (done) await auditSchool(db, scope, 'school.marking_job_finished', 'school_marking_jobs', jobId, null, { paper_id: job.paper_id })
  }
  return jobProgress(db, scope, jobId)
}

/** Stops the job: nothing waiting is started any more; a student being marked right now finishes. */
export async function cancelMarkingJob(db: Db, scope: SchoolScope, jobId: string): Promise<JobProgress> {
  assertMarker(scope)
  const job = await loadJob(db, scope, jobId)
  if (job.status === 'running') {
    await db
      .updateTable('school_marking_job_items')
      .set({ status: 'cancelled', updated_at: new Date() })
      .where('school_id', '=', scope.schoolId)
      .where('job_id', '=', jobId)
      .where('status', '=', 'queued')
      .execute()
    await db
      .updateTable('school_marking_jobs')
      .set({ status: 'cancelled', finished_at: new Date() })
      .where('id', '=', jobId)
      .where('school_id', '=', scope.schoolId)
      .execute()
    await auditSchool(db, scope, 'school.marking_job_cancelled', 'school_marking_jobs', jobId, null, { paper_id: job.paper_id })
  }
  return jobProgress(db, scope, jobId)
}
