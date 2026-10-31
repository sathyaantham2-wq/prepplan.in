import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import sharp from 'sharp'
import { createDb } from '../../db/connection'
import type { Db } from '../../db/connection'
import { schoolsRepository } from '../../db/repositories'
import type { SchoolScope } from '../../db/school-scope'
import { deleteSchoolTermsForTest, deleteTestCredentials } from '../../db/test-helpers'
import { encryptScan } from '../scan-crypto'
import { getScanStore } from '../scan-storage'
import { loadSchoolScope } from '../school-session'
import type { MarkingAi } from './marking'
import { cancelMarkingJob, latestJob, markingJobStep, startMarkingJob } from './marking-jobs'
import { createSchoolStudent, createSchoolTeacher } from './people'
import { addSchoolSubject, createClass, createSection } from './setup'
import { acceptSchoolTerms } from './terms'

// "Mark all ready students" as a job. Local test database only; the AI is a stand-in.
describe('marking a class as a job (M4)', () => {
  let db: Db
  const tag = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  let schoolId: string
  let admin: SchoolScope
  let outsider: SchoolScope
  let studentScope: SchoolScope
  let paperId: string
  const sid: Array<string> = []
  const userIds: Array<string> = []
  const households: Array<string> = []
  let subjectId: string
  let sourceId: string
  const calls: Array<string> = []

  const ai: MarkingAi = {
    available: () => true,
    markPass: ({ questions }) => {
      calls.push('pass')
      return Promise.resolve(
        JSON.stringify({
          answers: questions.map((q) => ({
            question: q.no,
            found: true,
            answer_text: 'ok',
            choice: q.type === 'mcq' ? 'B' : null,
            marks: q.marks,
            steps: [],
            loss_kind: 'none',
            loss_reason: null,
            confidence: 0.9,
          })),
        }),
      )
    },
  }

  async function page(studentId: string, state = 'passed') {
    const png = await sharp({ create: { width: 400, height: 500, channels: 3, background: '#f4f1e8' } }).png().toBuffer()
    const key = `jobs/${schoolId}/${tag}/${studentId}-${state}.png`
    await getScanStore().put(key, encryptScan(png))
    await db
      .insertInto('school_own_sheets')
      .values({ school_id: schoolId, paper_id: paperId, school_student_id: studentId, kind: 'page', status: 'placed', placed_by: 'teacher', seq: 1, image_key: key, original_key: key, check_state: state, uploaded_by_user_id: admin.userId })
      .execute()
  }

  beforeAll(async () => {
    db = createDb()
    const p = await schoolsRepository.provision(db, { name: `Jobs School ${tag}`, code: `jb-${tag}`, board: 'CBSE', adminName: 'Admin', adminEmail: `jb-${tag}@school.test` })
    schoolId = p.school.id
    userIds.push(p.adminUserId)
    const sa = await loadSchoolScope(db, p.adminUserId, schoolId, ['school_admin'])
    if (!sa.ok) throw new Error('scope')
    admin = sa.scope
    await acceptSchoolTerms(db, admin)
    subjectId = (await db.insertInto('subjects').values({ board: 'CBSE', class: 7, code: `ZJ-${tag}`, name: 'Jobs Maths', language: 'en', is_active: true }).returning('id').executeTakeFirstOrThrow()).id
    sourceId = (await db.insertInto('sources').values({ subject_id: subjectId, title: 'Jobs Book', publisher: 'NCERT' }).returning('id').executeTakeFirstOrThrow()).id
    const cls = await createClass(db, admin, 7, '2026-27')
    const sec = await createSection(db, admin, cls.id, 'A')
    const ss = await addSchoolSubject(db, admin, cls.id, subjectId)
    for (const [i, n] of ['Asha', 'Ravi', 'Meena', 'Kiran'].entries()) {
      const s = await createSchoolStudent(db, admin, { name: n, grade: 7, sectionId: sec.id, sectionName: 'A', rollNo: String(i + 1), admissionNo: null, guardianPhone: null, guardianName: null })
      households.push(s.user.household_id)
      userIds.push(s.user.id)
      sid.push(s.schoolStudent.id)
      if (i === 0) {
        const sc = await loadSchoolScope(db, s.user.id, schoolId, ['student'])
        if (!sc.ok) throw new Error('scope')
        studentScope = sc.scope
      }
    }
    const t = await createSchoolTeacher(db, admin, { name: 'Outside Teacher', email: `ot-${tag}@school.test` })
    households.push(t.user.household_id)
    const so = await loadSchoolScope(db, t.user.id, schoolId, ['teacher'])
    if (!so.ok) throw new Error('scope')
    outsider = so.scope
    paperId = (await db.insertInto('school_own_papers').values({ school_id: schoolId, class_id: cls.id, school_subject_id: ss.id, title: 'Jobs test', source_kind: 'prepplan_exam', status: 'approved', phase: 'done', total_marks: '4', created_by_user_id: admin.userId }).returning('id').executeTakeFirstOrThrow()).id
    for (const [i, type] of ['mcq', 'short_answer'].entries())
      await db.insertInto('school_own_questions').values({
        school_id: schoolId, paper_id: paperId, position: i + 1, section: 'A', type, text: `Question ${i + 1}`, original_text: `Question ${i + 1}`,
        options: JSON.stringify(type === 'mcq' ? ['A', 'B', 'C', 'D'].map((label) => ({ label, text: `opt ${label}` })) : []),
        marks: type === 'mcq' ? '1' : '3', key_text: type === 'mcq' ? 'Correct option: (B) opt B' : 'Model answer', key_steps: '[]', key_source: 'bank', key_status: 'approved',
      }).execute()
  })

  afterAll(async () => {
    const ids = [schoolId]
    await deleteTestCredentials(userIds)
    for (const t of ['school_marking_job_items', 'school_marking_jobs', 'school_answer_marks', 'school_sheet_marking', 'school_own_sheets', 'school_own_questions', 'school_own_papers'] as const)
      await db.deleteFrom(t).where('school_id', 'in', ids).execute()
    await db.deleteFrom('audit_log').where('school_id', 'in', ids).execute()
    await db.deleteFrom('school_student_guardians').where('school_id', 'in', ids).execute()
    await db.deleteFrom('school_students').where('school_id', 'in', ids).execute()
    await db.deleteFrom('students').where('school_id', 'in', ids).execute()
    for (const t of ['school_teacher_assignments', 'school_subjects', 'school_sections', 'school_classes'] as const)
      await db.deleteFrom(t).where('school_id', 'in', ids).execute()
    await deleteSchoolTermsForTest(db, ids)
    const members = await db.selectFrom('school_members').select('user_id').where('school_id', 'in', ids).execute()
    await db.deleteFrom('school_members').where('school_id', 'in', ids).execute()
    const sh = await db.selectFrom('schools').select('household_id').where('id', 'in', ids).execute()
    await db.deleteFrom('schools').where('id', 'in', ids).execute()
    const mu = members.map((m) => m.user_id)
    const hh = mu.length ? await db.selectFrom('users').select('household_id').where('id', 'in', mu).execute() : []
    if (mu.length) await db.deleteFrom('users').where('id', 'in', mu).execute()
    await db.deleteFrom('households').where('id', 'in', [...sh.map((h) => h.household_id), ...hh.map((h) => h.household_id), ...households]).execute()
    await db.deleteFrom('chapters').where('source_id', '=', sourceId).execute()
    await db.deleteFrom('sources').where('id', '=', sourceId).execute()
    await db.deleteFrom('subjects').where('id', '=', subjectId).execute()
    await db.destroy()
  })

  it('has nobody to mark until sheets are in; a student or a teacher of nothing cannot start one', async () => {
    await expect(startMarkingJob(db, admin, paperId)).rejects.toThrow(/Nobody is ready/)
    await expect(startMarkingJob(db, studentScope, paperId)).rejects.toThrow()
    await page(sid[0])
    await page(sid[1])
    await page(sid[2])
    await page(sid[3], 'needs_confirm') // Kiran has a page still waiting for the teacher's yes
    await expect(startMarkingJob(db, outsider, paperId)).rejects.toThrow()
    expect(await latestJob(db, admin, paperId)).toBeNull()
  })

  it('starts one job for everyone ready; asking again returns the same one', async () => {
    const a = await startMarkingJob(db, admin, paperId)
    expect(a).toMatchObject({ status: 'running', total: 4, finished: 0, remaining: 4 })
    const b = await startMarkingJob(db, admin, paperId)
    expect(b.jobId).toBe(a.jobId)
    await expect(markingJobStep(db, outsider, a.jobId, ai)).rejects.toThrow()
    await expect(markingJobStep(db, studentScope, a.jobId, ai)).rejects.toThrow()
  })

  it('two workers at once never mark the same student twice; the one with a page waiting fails with the reason', async () => {
    const job = (await latestJob(db, admin, paperId))!
    // four steps, three at once then the last
    const first = await Promise.all([markingJobStep(db, admin, job.jobId, ai), markingJobStep(db, admin, job.jobId, ai), markingJobStep(db, admin, job.jobId, ai)])
    expect(first.every((p) => p.status === 'running' || p.status === 'done')).toBe(true)
    const last = await markingJobStep(db, admin, job.jobId, ai)
    const end = await markingJobStep(db, admin, job.jobId, ai)
    expect(end).toMatchObject({ status: 'done', total: 4, finished: 4, remaining: 0, marked: 3, failed: 1 })
    expect(last.finished).toBeGreaterThanOrEqual(3)
    expect(end.failures[0].message).toMatch(/waiting for your yes/)
    // each marked student was read exactly three times and has exactly one row per question
    expect(calls).toHaveLength(3 * 3)
    const rows = await db.selectFrom('school_answer_marks').select('school_student_id').where('school_id', '=', schoolId).execute()
    expect(rows).toHaveLength(3 * 2)
    const attempts = await db.selectFrom('school_marking_job_items').select('attempts').where('job_id', '=', job.jobId).execute()
    expect(attempts.every((a) => a.attempts === 1)).toBe(true)
    // a finished job takes no more work
    expect((await markingJobStep(db, admin, job.jobId, ai)).status).toBe('done')
    expect(calls).toHaveLength(9)
  })

  it('a worker that died: its lease runs out and the item is taken again; after three tries it is failed with a plain reason', async () => {
    // Kiran's page is settled now, so Kiran is ready again; a new job for Kiran only
    await db.updateTable('school_own_sheets').set({ check_state: 'passed' }).where('school_student_id', '=', sid[3]).execute()
    const job = await startMarkingJob(db, admin, paperId, [sid[3]])
    const item = await db.selectFrom('school_marking_job_items').select('id').where('job_id', '=', job.jobId).executeTakeFirstOrThrow()
    const past = new Date(Date.now() - 60_000)
    await db.updateTable('school_marking_job_items').set({ status: 'running', attempts: 1, lease_until: past }).where('id', '=', item.id).execute()
    const p = await markingJobStep(db, admin, job.jobId, ai)
    expect(p).toMatchObject({ status: 'done', marked: 1, failed: 0 })
    const row = await db.selectFrom('school_marking_job_items').select(['attempts', 'status']).where('id', '=', item.id).executeTakeFirstOrThrow()
    expect(row).toMatchObject({ attempts: 2, status: 'done' })
    // a lease that ran out for the third time: failed, not tried again
    const second = await startMarkingJob(db, admin, paperId, [sid[3]])
    const it2 = await db.selectFrom('school_marking_job_items').select('id').where('job_id', '=', second.jobId).executeTakeFirstOrThrow()
    await db.updateTable('school_marking_job_items').set({ status: 'running', attempts: 3, lease_until: past }).where('id', '=', it2.id).execute()
    const q = await markingJobStep(db, admin, second.jobId, ai)
    expect(q).toMatchObject({ status: 'done', failed: 1 })
    expect(q.failures[0].message).toMatch(/several tries/)
  })

  it('stopping a job cancels what is waiting, nothing more is started, and it is all in the audit log', async () => {
    await db.deleteFrom('school_sheet_marking').where('school_id', '=', schoolId).where('school_student_id', 'in', [sid[0], sid[1]]).execute()
    const job = await startMarkingJob(db, admin, paperId, [sid[0], sid[1]])
    const stopped = await cancelMarkingJob(db, admin, job.jobId)
    expect(stopped.status).toBe('cancelled')
    const items = await db.selectFrom('school_marking_job_items').select('status').where('job_id', '=', job.jobId).execute()
    expect(items.every((i) => i.status === 'cancelled')).toBe(true)
    const before = calls.length
    expect((await markingJobStep(db, admin, job.jobId, ai)).status).toBe('cancelled')
    expect(calls).toHaveLength(before)
    const log = await db.selectFrom('audit_log').select('action').where('school_id', '=', schoolId).execute()
    expect(log.map((l) => l.action)).toEqual(expect.arrayContaining(['school.marking_job_started', 'school.marking_job_finished', 'school.marking_job_cancelled']))
  })
})
