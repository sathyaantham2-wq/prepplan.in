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
import { createSchoolStudent, createSchoolTeacher } from './people'
import { addSchoolSubject, createClass, createSection } from './setup'
import { acceptSchoolTerms } from './terms'
import { markStudentSheets, setAnswerMark } from './marking'
import type { MarkingAi } from './marking'
import {
  askTeacher,
  decideDispute,
  disputeQueue,
  flagAnswer,
  lockDueReleases,
  myResult,
  myResults,
  releaseSection,
  releaseStatus,
} from './results-release'

// M4 release, the student's flags and the lock. Local test database only; the AI is a stand-in.
describe('releasing results, flags and the lock (M4)', () => {
  let db: Db
  const tag = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  let schoolId: string
  let admin: SchoolScope
  let outsiderTeacher: SchoolScope
  let studentA: SchoolScope
  let studentB: SchoolScope
  let paperId: string
  let sectionId: string
  const sid: Record<string, string> = {}
  const userIds: Array<string> = []
  const households: Array<string> = []
  let subjectId: string
  let sourceId: string
  const NOW = new Date()
  const days = (n: number) => new Date(NOW.getTime() + n * 86_400_000)

  const WRITTEN = 7
  const answer = (no: number, over: Record<string, unknown> = {}) => ({
    question: String(no),
    found: true,
    answer_text: 'written',
    choice: no === 1 ? 'B' : null,
    marks: 1,
    steps: [],
    loss_kind: no === 1 ? 'none' : 'writing_habit',
    loss_reason: no === 1 ? null : 'stopped early',
    confidence: 0.9,
    ...over,
  })
  /** every written question marked 1 of 2, three identical passes */
  const ai = (over: (no: number) => Record<string, unknown> = () => ({})): MarkingAi => ({
    available: () => true,
    markPass: ({ questions }) =>
      Promise.resolve(
        JSON.stringify({
          answers: questions.map((q) => answer(Number(q.no), over(Number(q.no)))),
        }),
      ),
  })

  async function putPage(studentId: string, seq: number) {
    const png = await sharp({ create: { width: 600, height: 800, channels: 3, background: '#f4f1e8' } }).png().toBuffer()
    const key = `test/${schoolId}/${tag}/${studentId}-${seq}.png`
    await getScanStore().put(key, encryptScan(png))
    await db
      .insertInto('school_own_sheets')
      .values({
        school_id: schoolId,
        paper_id: paperId,
        school_student_id: studentId,
        kind: 'page',
        status: 'placed',
        placed_by: 'teacher',
        seq,
        image_key: key,
        original_key: key,
        check_state: 'passed',
        uploaded_by_user_id: admin.userId,
      })
      .execute()
  }

  beforeAll(async () => {
    db = createDb()
    const p = await schoolsRepository.provision(db, {
      name: `Release School ${tag}`,
      code: `rl-${tag}`,
      board: 'CBSE',
      adminName: 'Admin',
      adminEmail: `rl-${tag}@school.test`,
    })
    schoolId = p.school.id
    userIds.push(p.adminUserId)
    const sa = await loadSchoolScope(db, p.adminUserId, schoolId, ['school_admin'])
    if (!sa.ok) throw new Error('scope')
    admin = sa.scope
    await acceptSchoolTerms(db, admin)
    subjectId = (
      await db
        .insertInto('subjects')
        .values({ board: 'CBSE', class: 7, code: `ZR-${tag}`, name: 'Release Maths', language: 'en', is_active: true })
        .returning('id')
        .executeTakeFirstOrThrow()
    ).id
    sourceId = (
      await db
        .insertInto('sources')
        .values({ subject_id: subjectId, title: 'Release Book', publisher: 'NCERT' })
        .returning('id')
        .executeTakeFirstOrThrow()
    ).id
    const cls = await createClass(db, admin, 7, '2026-27')
    sectionId = (await createSection(db, admin, cls.id, 'A')).id
    const ss = await addSchoolSubject(db, admin, cls.id, subjectId)
    const mk = async (name: string, roll: string) => {
      const s = await createSchoolStudent(db, admin, {
        name,
        grade: 7,
        sectionId,
        sectionName: 'A',
        rollNo: roll,
        admissionNo: null,
        guardianPhone: null,
        guardianName: null,
      })
      households.push(s.user.household_id)
      userIds.push(s.user.id)
      sid[name] = s.schoolStudent.id
      return s
    }
    const a = await mk('Asha', '1')
    const b = await mk('Ravi', '2')
    await mk('Kiran', '3')
    const sA = await loadSchoolScope(db, a.user.id, schoolId, ['student'])
    const sB = await loadSchoolScope(db, b.user.id, schoolId, ['student'])
    if (!sA.ok || !sB.ok) throw new Error('student scope')
    studentA = sA.scope
    studentB = sB.scope
    const t = await createSchoolTeacher(db, admin, { name: 'Outside Teacher', email: `ot-${tag}@school.test` })
    households.push(t.user.household_id)
    const so = await loadSchoolScope(db, t.user.id, schoolId, ['teacher'])
    if (!so.ok) throw new Error('scope')
    outsiderTeacher = so.scope

    const paper = await db
      .insertInto('school_own_papers')
      .values({
        school_id: schoolId,
        class_id: cls.id,
        school_subject_id: ss.id,
        title: 'Release test',
        source_kind: 'prepplan_exam',
        status: 'approved',
        phase: 'done',
        total_marks: String(1 + WRITTEN * 2),
        created_by_user_id: admin.userId,
      })
      .returning('id')
      .executeTakeFirstOrThrow()
    paperId = paper.id
    for (let i = 1; i <= 1 + WRITTEN; i++)
      await db
        .insertInto('school_own_questions')
        .values({
          school_id: schoolId,
          paper_id: paperId,
          position: i,
          section: 'A',
          type: i === 1 ? 'mcq' : 'short_answer',
          text: `Question ${i}`,
          original_text: `Question ${i}`,
          options: JSON.stringify(i === 1 ? ['A', 'B', 'C', 'D'].map((label) => ({ label, text: `opt ${label}` })) : []),
          marks: i === 1 ? '1' : '2',
          key_text: i === 1 ? 'Correct option: (B) opt B' : `Model answer ${i}`,
          key_steps: '[]',
          key_source: 'bank',
          key_status: 'approved',
        })
        .execute()
    for (const n of ['Asha', 'Ravi', 'Kiran']) await putPage(sid[n], 1)
  })

  afterAll(async () => {
    const ids = [schoolId]
    await deleteTestCredentials(userIds)
    for (const t of ['school_answer_disputes', 'school_paper_releases', 'school_answer_marks', 'school_sheet_marking', 'school_own_sheets', 'school_own_questions', 'school_own_papers'] as const)
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

  it('cannot be released while a student with sheets is not marked', async () => {
    await markStudentSheets(db, admin, paperId, sid.Asha, ai())
    await markStudentSheets(db, admin, paperId, sid.Ravi, ai())
    const [sec] = await releaseStatus(db, admin, paperId)
    expect(sec.canRelease).toBe(false)
    expect(sec.blockers.join(' ')).toMatch(/1 student has sheets that are not marked/)
    await expect(releaseSection(db, admin, paperId, sectionId)).rejects.toThrow(/Not ready to release/)
  })

  it('cannot be released while an answer is flagged for a teacher', async () => {
    // Kiran's three passes disagree on one answer
    let call = 0
    const unsure: MarkingAi = {
      available: () => true,
      markPass: ({ questions }) => {
        const pass = call++
        return Promise.resolve(JSON.stringify({ answers: questions.map((q) => answer(Number(q.no), Number(q.no) === 2 ? { marks: pass } : {})) }))
      },
    }
    const r = await markStudentSheets(db, admin, paperId, sid.Kiran, unsure)
    expect(r.status).toBe('needs_teacher')
    const [sec] = await releaseStatus(db, admin, paperId)
    expect(sec.blockers.join(' ')).toMatch(/waiting for a teacher/)
    // the teacher settles it
    const { studentMarking } = await import('./marking')
    const v = await studentMarking(db, admin, paperId, sid.Kiran)
    await setAnswerMark(db, admin, v.answers[1].answerMarkId!, 1, 'ok')
    const [after] = await releaseStatus(db, admin, paperId)
    expect(after.canRelease).toBe(true)
  })

  it('a teacher outside the class cannot release; the office can; once only; marks are then fixed', async () => {
    await expect(releaseSection(db, outsiderTeacher, paperId, sectionId, NOW)).rejects.toThrow()
    const r = await releaseSection(db, admin, paperId, sectionId, NOW)
    expect(new Date(r.windowClosesAt).getTime()).toBe(days(7).getTime())
    await expect(releaseSection(db, admin, paperId, sectionId, NOW)).rejects.toThrow(/already been released/)
    await expect(markStudentSheets(db, admin, paperId, sid.Asha, ai())).rejects.toThrow(/released/)
    const { studentMarking } = await import('./marking')
    const v = await studentMarking(db, admin, paperId, sid.Asha)
    await expect(setAnswerMark(db, admin, v.answers[1].answerMarkId!, 2, 'late')).rejects.toThrow(/released/)
  })

  it('a student sees her own results with the correct answers, and nobody else’s', async () => {
    const list = await myResults(db, studentA, NOW)
    expect(list).toHaveLength(1)
    expect(list[0]).toMatchObject({ title: 'Release test', totalMarks: 8, maxMarks: 15, locked: false })
    const r = await myResult(db, studentA, paperId, NOW)
    expect(r.flagsLeft).toBe(5)
    expect(r.answers[1]).toMatchObject({ marks: 1, correctAnswer: 'Model answer 2', canFlag: true })
    expect(r.answers[0].canFlag).toBe(false) // full marks
    expect(JSON.stringify(r)).not.toContain('Ravi')
    // not a teacher's door
    await expect(releaseStatus(db, studentA, paperId)).rejects.toThrow()
    await expect(markStudentSheets(db, studentA, paperId, sid.Asha, ai())).rejects.toThrow()
    // she cannot flag Ravi's answer
    const rb = await myResult(db, studentB, paperId, NOW)
    await expect(flagAnswer(db, studentA, rb.answers[1].answerMarkId!, 'I think this is wrong', ai(), NOW)).rejects.toThrow(/not found/)
  })

  it('flags: a reason is needed; the AI may raise but never lower; five at most; one per answer', async () => {
    const r = await myResult(db, studentA, paperId, NOW)
    const id = (n: number) => r.answers[n - 1].answerMarkId!
    await expect(flagAnswer(db, studentA, id(2), 'no', ai(), NOW)).rejects.toThrow(/characters/)
    // AI re-reads and gives 2 of 2: raised, settled
    const raised = await flagAnswer(db, studentA, id(2), 'I wrote both steps', ai(() => ({ marks: 2 })), NOW)
    expect(raised).toMatchObject({ status: 'resolved', marksAfter: 2 })
    // AI re-reads and would give 0: the mark is kept, never lowered
    const kept = await flagAnswer(db, studentA, id(3), 'I think this is right', ai(() => ({ marks: 0 })), NOW)
    expect(kept).toMatchObject({ status: 'ai_reviewed', marksAfter: 1 })
    expect(kept.aiReply).toMatch(/kept the mark/)
    await expect(flagAnswer(db, studentA, id(3), 'asking again please', ai(), NOW)).rejects.toThrow(/already flagged/)
    // AI off: straight to the teacher
    const off: MarkingAi = { available: () => false, markPass: () => Promise.resolve('') }
    await flagAnswer(db, studentA, id(4), 'please check my working', off, NOW)
    await flagAnswer(db, studentA, id(5), 'please check my working', off, NOW)
    await flagAnswer(db, studentA, id(6), 'please check my working', off, NOW)
    await expect(flagAnswer(db, studentA, id(7), 'one flag too many', off, NOW)).rejects.toThrow(/at most 5/)
    const after = await myResult(db, studentA, paperId, NOW)
    expect(after.flagsLeft).toBe(0)
    expect(after.totalMarks).toBe(9) // 8 + 1 raised by the AI
    expect(after.answers[1].dispute).toMatchObject({ status: 'resolved', marksAfter: 2 })
  })

  it('she asks her teacher; the teacher decides, may lower, and it is final and logged', async () => {
    const r = await myResult(db, studentA, paperId, NOW)
    const d3 = r.answers[2].dispute!
    expect(d3.canAskTeacher).toBe(true)
    await askTeacher(db, studentA, d3.id, NOW)
    const queue = await disputeQueue(db, admin, paperId)
    const waiting = queue.filter((q) => q.status === 'with_teacher')
    expect(waiting).toHaveLength(4)
    expect(waiting[0]).toMatchObject({ student: 'Asha', reason: expect.any(String) })
    await expect(decideDispute(db, studentA, d3.id, 2, 'x', NOW)).rejects.toThrow()
    await expect(decideDispute(db, outsiderTeacher, d3.id, 2, 'x', NOW)).rejects.toThrow()
    await expect(decideDispute(db, admin, d3.id, 1.3, 'x', NOW)).rejects.toThrow(/half a mark/)
    await expect(decideDispute(db, admin, d3.id, 2, '  ', NOW)).rejects.toThrow(/why/)
    await decideDispute(db, admin, d3.id, 0, 'On re-reading, the working does not show the step', NOW)
    await expect(decideDispute(db, admin, d3.id, 2, 'again', NOW)).rejects.toThrow(/not waiting/)
    const after = await myResult(db, studentA, paperId, NOW)
    expect(after.answers[2]).toMatchObject({ marks: 0 })
    expect(after.answers[2].dispute).toMatchObject({ status: 'resolved', marksBefore: 1, marksAfter: 0 })
    expect(after.totalMarks).toBe(8) // 9 - 1 lowered by the teacher
    const log = await db.selectFrom('audit_log').select('action').where('school_id', '=', schoolId).execute()
    const actions = log.map((l) => l.action)
    expect(actions).toEqual(expect.arrayContaining(['school.results_released', 'school.answer_flagged', 'school.dispute_to_teacher', 'school.dispute_decided']))
  })

  it('the window closes: no more flags; the lock waits for open teacher decisions, then locks', async () => {
    const later = days(8)
    const r = await myResult(db, studentA, paperId, later)
    expect(r.windowOpen).toBe(false)
    expect(r.answers.every((a) => !a.canFlag)).toBe(true)
    // three flags are still with the teacher: no lock yet
    expect(await lockDueReleases(db, schoolId, later)).toBe(0)
    expect((await myResults(db, studentA, later))[0].locked).toBe(false)
    const queue = await disputeQueue(db, admin, paperId)
    for (const q of queue.filter((x) => x.status === 'with_teacher'))
      await decideDispute(db, admin, q.id, q.marksNow ?? 0, 'Checked: the mark stands', later)
    // the last decision locked the release
    expect((await myResults(db, studentA, later))[0].locked).toBe(true)
    await expect(flagAnswer(db, studentB, (await myResult(db, studentB, paperId, later)).answers[1].answerMarkId!, 'too late now', ai(), later)).rejects.toThrow(/over/)
    const [sec] = await releaseStatus(db, admin, paperId, later)
    expect(sec.released?.locked).toBe(true)
    const locked = await db.selectFrom('audit_log').select('id').where('school_id', '=', schoolId).where('action', '=', 'school.marks_locked').execute()
    expect(locked).toHaveLength(1)
  })

  it('a student who was not released to or not marked is told nothing', async () => {
    const kiran = await db.selectFrom('school_students').select('member_id').where('id', '=', sid.Kiran).executeTakeFirstOrThrow()
    expect(kiran.member_id).toBeTruthy()
    await expect(myResult(db, studentA, '00000000-0000-4000-8000-000000000000', NOW)).rejects.toThrow()
  })
})
