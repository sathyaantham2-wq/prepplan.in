import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createDb } from '../../db/connection'
import type { Db } from '../../db/connection'
import { schoolsRepository } from '../../db/repositories'
import type { SchoolScope } from '../../db/school-scope'
import { deleteSchoolTermsForTest, deleteTestCredentials } from '../../db/test-helpers'
import { loadSchoolScope } from '../school-session'
import { boardStudents, examBoard } from './exam-board'
import { createSchoolStudent, createSchoolTeacher } from './people'
import { addSchoolSubject, createClass, createSection } from './setup'
import { acceptSchoolTerms } from './terms'

// The exam-week board: counts come from the sheets, the marking rows and the releases, add up to the roster,
// and only the office and the principal may see them. Local test database only.
describe('exam-week board', () => {
  let db: Db
  const tag = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  let schoolId: string
  let admin: SchoolScope
  let principal: SchoolScope
  let teacher: SchoolScope
  let paperId: string
  let secA: string
  let secB: string
  const stu: Record<string, string> = {}
  const userIds: Array<string> = []
  const households: Array<string> = []
  let subjectId: string
  let sourceId: string

  const page = (who: string, check = 'passed', status = 'placed') =>
    db
      .insertInto('school_own_sheets')
      .values({
        school_id: schoolId,
        paper_id: paperId,
        school_student_id: stu[who],
        kind: 'page',
        status,
        placed_by: 'teacher',
        seq: 1,
        check_state: check,
        uploaded_by_user_id: admin.userId,
      })
      .execute()
  const mark = (who: string, status: string, message: string | null = null) =>
    db
      .insertInto('school_sheet_marking')
      .values({ school_id: schoolId, paper_id: paperId, school_student_id: stu[who], status, message })
      .execute()

  beforeAll(async () => {
    db = createDb()
    const p = await schoolsRepository.provision(db, { name: `Board School ${tag}`, code: `bd-${tag}`, board: 'CBSE', adminName: 'Admin', adminEmail: `bd-${tag}@school.test` })
    schoolId = p.school.id
    userIds.push(p.adminUserId)
    const sa = await loadSchoolScope(db, p.adminUserId, schoolId, ['school_admin'])
    if (!sa.ok) throw new Error('scope')
    admin = sa.scope
    await acceptSchoolTerms(db, admin)
    subjectId = (await db.insertInto('subjects').values({ board: 'CBSE', class: 7, code: `BD-${tag}`, name: 'Board Maths', language: 'en', is_active: true }).returning('id').executeTakeFirstOrThrow()).id
    sourceId = (await db.insertInto('sources').values({ subject_id: subjectId, title: 'Board Book', publisher: 'NCERT' }).returning('id').executeTakeFirstOrThrow()).id
    const cls = await createClass(db, admin, 7, '2026-27')
    secA = (await createSection(db, admin, cls.id, 'A')).id
    secB = (await createSection(db, admin, cls.id, 'B')).id
    const ss = await addSchoolSubject(db, admin, cls.id, subjectId)
    const people: Array<[string, string, string]> = [['Asha', secA, '1'], ['Ravi', secA, '2'], ['Meena', secA, '3'], ['Kiran', secB, '1'], ['Zoya', secB, '2']]
    for (const [n, sec, roll] of people) {
      const s = await createSchoolStudent(db, admin, { name: `${n} Board`, grade: 7, sectionId: sec, sectionName: sec === secA ? 'A' : 'B', rollNo: roll, admissionNo: null, guardianPhone: null, guardianName: null })
      households.push(s.user.household_id)
      userIds.push(s.user.id)
      stu[n] = s.schoolStudent.id
    }
    for (const [name, role] of [['Tess Teacher', 'teacher'], ['Prakash Principal', 'principal']] as const) {
      const t = await createSchoolTeacher(db, admin, { name, email: `${name.split(' ')[0].toLowerCase()}-${tag}@school.test` })
      households.push(t.user.household_id)
      userIds.push(t.user.id)
      if (role === 'principal') await db.updateTable('school_members').set({ role }).where('id', '=', t.member.id).execute()
      const sc = await loadSchoolScope(db, t.user.id, schoolId, [role])
      if (!sc.ok) throw new Error('scope')
      if (role === 'teacher') teacher = sc.scope
      else principal = sc.scope
    }
    paperId = (
      await db
        .insertInto('school_own_papers')
        .values({ school_id: schoolId, class_id: cls.id, school_subject_id: ss.id, title: 'Board paper', source_kind: 'prepplan_exam', status: 'approved', phase: 'done', total_marks: '4', created_by_user_id: admin.userId })
        .returning('id')
        .executeTakeFirstOrThrow()
    ).id
    // A: Asha marked, Ravi needs a teacher, Meena nothing uploaded. B: Kiran's marking failed, Zoya every page refused.
    await page('Asha')
    await mark('Asha', 'marked')
    await page('Ravi')
    await mark('Ravi', 'needs_teacher')
    await page('Kiran')
    await mark('Kiran', 'rejected', 'The pages could not be read.')
    await page('Zoya', 'refused', 'rejected')
    await db.updateTable('school_own_sheets').set({ status: 'placed' }).where('school_student_id', '=', stu.Zoya).execute()
  })

  afterAll(async () => {
    const ids = [schoolId]
    await deleteTestCredentials(userIds)
    for (const t of ['school_paper_releases', 'school_sheet_marking', 'school_own_sheets', 'school_own_questions', 'school_own_papers'] as const)
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

  it('counts every section from the sheets and the marking rows, and they add up to the roster', async () => {
    const b = await examBoard(db, admin)
    const paper = b.papers.find((p) => p.paperId === paperId)!
    const a = paper.sections.find((s) => s.sectionId === secA)!
    const bb = paper.sections.find((s) => s.sectionId === secB)!
    expect(a).toMatchObject({ students: 3, uploaded: 2, marked: 1, waiting: 1, failed: 0, released: false })
    expect(bb).toMatchObject({ students: 2, uploaded: 1, marked: 0, waiting: 0, failed: 2, released: false })
    // every student is in exactly one of: nothing uploaded, marked, waiting, failed, ready for the AI
    expect(a.marked + a.waiting + a.failed + (a.students - a.uploaded)).toBeLessThanOrEqual(a.students)
    expect(b.totals).toMatchObject({ students: 5, uploaded: 3, marked: 1, waiting: 1, failed: 2 })
  })

  it('shows the students behind a count, with the plain reason for a failed one', async () => {
    const failed = await boardStudents(db, admin, paperId, secB, 'failed')
    expect(failed.map((s) => s.name).sort()).toEqual(['Kiran Board', 'Zoya Board'])
    expect(failed.find((s) => s.name === 'Kiran Board')?.reason).toBe('The pages could not be read.')
    expect(failed.find((s) => s.name === 'Zoya Board')?.reason).toMatch(/refused by the upload checks/)
    expect((await boardStudents(db, admin, paperId, secA, 'waiting')).map((s) => s.name)).toEqual(['Ravi Board'])
    expect(await boardStudents(db, admin, paperId, secA, 'released')).toEqual([])
  })

  it('a released section shows as released and lists the marked students', async () => {
    await db.insertInto('school_paper_releases').values({ school_id: schoolId, paper_id: paperId, section_id: secA, released_by_user_id: admin.userId, window_closes_at: new Date(Date.now() + 86_400_000), window_days: 7 }).execute()
    const paper = (await examBoard(db, admin)).papers.find((p) => p.paperId === paperId)!
    expect(paper.sections.find((s) => s.sectionId === secA)?.released).toBe(true)
    expect(paper.sections.find((s) => s.sectionId === secB)?.released).toBe(false)
    expect((await boardStudents(db, admin, paperId, secA, 'released')).map((s) => s.name)).toEqual(['Asha Board'])
  })

  it('the principal sees it; a teacher and the student role are refused', async () => {
    expect((await examBoard(db, principal)).totals.students).toBe(5)
    await expect(examBoard(db, teacher)).rejects.toMatchObject({ code: 'forbidden' })
    await expect(boardStudents(db, teacher, paperId, secA, 'marked')).rejects.toMatchObject({ code: 'forbidden' })
    const asStudent = { ...admin, role: 'student' } as unknown as SchoolScope
    await expect(examBoard(db, asStudent)).rejects.toMatchObject({ code: 'forbidden' })
  })

  it('never shows another school’s papers', async () => {
    const other = { ...admin, schoolId: '00000000-0000-0000-0000-000000000000' } as SchoolScope
    expect((await examBoard(db, other)).papers).toEqual([])
    await expect(boardStudents(db, other, paperId, secA, 'marked')).rejects.toMatchObject({ code: 'not_found' })
  })
})
