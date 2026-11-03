import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createDb } from '../../db/connection'
import type { Db } from '../../db/connection'
import { schoolsRepository } from '../../db/repositories'
import type { SchoolScope } from '../../db/school-scope'
import { deleteSchoolTermsForTest, deleteTestCredentials } from '../../db/test-helpers'
import { loadSchoolScope } from '../school-session'
import { createSchoolStudent, createSchoolTeacher } from './people'
import { addSchoolSubject, assignTeacher, createClass, createSection } from './setup'
import { acceptSchoolTerms } from './terms'
import { schoolToday, schoolYearStart } from './today'

// The Home screen's Today list: read-only counts with the same reach as the screens (a teacher: only their own
// section-subject; messages: office and principal only; never a student). Local test database only.
describe('school Today list', () => {
  let db: Db
  const tag = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  let schoolId: string
  let admin: SchoolScope
  let teacher: SchoolScope
  let principal: SchoolScope
  let paperId: string
  let questionId: string
  let secA: string
  let secB: string
  const stu: Record<string, string> = {}
  const userIds: Array<string> = []
  const households: Array<string> = []
  let subjectId: string
  let sourceId: string
  const NOW = new Date()

  const flag = (who: string) =>
    db
      .insertInto('school_answer_marks')
      .values({ school_id: schoolId, paper_id: paperId, school_student_id: stu[who], own_question_id: questionId, found: true, ai_marks: '1', final_marks: '1', max_marks: '3', state: 'flagged' })
      .execute()
  const sheet = (who: string) =>
    db
      .insertInto('school_own_sheets')
      .values({ school_id: schoolId, paper_id: paperId, school_student_id: stu[who], kind: 'page', status: 'placed', placed_by: 'teacher', seq: 1, check_state: 'passed', uploaded_by_user_id: admin.userId })
      .execute()

  beforeAll(async () => {
    db = createDb()
    const p = await schoolsRepository.provision(db, { name: `Today School ${tag}`, code: `td-${tag}`, board: 'CBSE', adminName: 'Admin', adminEmail: `td-${tag}@school.test` })
    schoolId = p.school.id
    userIds.push(p.adminUserId)
    const sa = await loadSchoolScope(db, p.adminUserId, schoolId, ['school_admin'])
    if (!sa.ok) throw new Error('scope')
    admin = sa.scope
    await acceptSchoolTerms(db, admin)
    subjectId = (await db.insertInto('subjects').values({ board: 'CBSE', class: 7, code: `TD-${tag}`, name: 'Today Maths', language: 'en', is_active: true }).returning('id').executeTakeFirstOrThrow()).id
    sourceId = (await db.insertInto('sources').values({ subject_id: subjectId, title: 'Today Book', publisher: 'NCERT' }).returning('id').executeTakeFirstOrThrow()).id
    const cls = await createClass(db, admin, 7, '2026-27')
    secA = (await createSection(db, admin, cls.id, 'A')).id
    secB = (await createSection(db, admin, cls.id, 'B')).id
    const ss = (await addSchoolSubject(db, admin, cls.id, subjectId)) as { id: string }
    for (const [n, sec] of [['Asha', secA], ['Ravi', secA], ['Kiran', secB], ['Zoya', secB]] as const) {
      const s = await createSchoolStudent(db, admin, { name: `${n} Today`, grade: 7, sectionId: sec, sectionName: sec === secA ? 'A' : 'B', rollNo: n, admissionNo: null, guardianPhone: n === 'Asha' ? '+919700000101' : null, guardianName: n === 'Asha' ? 'Asha Parent' : null })
      households.push(s.user.household_id)
      userIds.push(s.user.id)
      stu[n] = s.schoolStudent.id
    }
    for (const [name, role] of [['Tina Teacher', 'teacher'], ['Paul Principal', 'principal']] as const) {
      const t = await createSchoolTeacher(db, admin, { name, email: `${name.split(' ')[0].toLowerCase()}-${tag}@school.test` })
      households.push(t.user.household_id)
      userIds.push(t.user.id)
      if (role === 'principal') await db.updateTable('school_members').set({ role }).where('id', '=', t.member.id).execute()
      else await assignTeacher(db, admin, { memberId: t.member.id, sectionId: secA, schoolSubjectId: ss.id })
      const sc = await loadSchoolScope(db, t.user.id, schoolId, [role])
      if (!sc.ok) throw new Error('scope')
      if (role === 'teacher') teacher = sc.scope
      else principal = sc.scope
    }
    paperId = (
      await db
        .insertInto('school_own_papers')
        .values({ school_id: schoolId, class_id: cls.id, school_subject_id: ss.id, title: 'Today paper', source_kind: 'prepplan_exam', status: 'approved', phase: 'done', total_marks: '3', created_by_user_id: admin.userId })
        .returning('id')
        .executeTakeFirstOrThrow()
    ).id
    questionId = (
      await db
        .insertInto('school_own_questions')
        .values({ school_id: schoolId, paper_id: paperId, position: 1, section: 'A', type: 'short_answer', text: 'Q1', original_text: 'Q1', marks: '3', key_text: 'k', key_status: 'approved' })
        .returning('id')
        .executeTakeFirstOrThrow()
    ).id
    // A: Asha's answer flagged, sheets from Asha only (Ravi missing). B: Kiran flagged; Zoya missing; B released, window closes in 2 days.
    await sheet('Asha')
    await flag('Asha')
    await sheet('Kiran')
    await flag('Kiran')
    await db.insertInto('school_paper_releases').values({ school_id: schoolId, paper_id: paperId, section_id: secB, released_by_user_id: admin.userId, window_closes_at: new Date(NOW.getTime() + 2 * 86_400_000), window_days: 7 }).execute()
    const g = await db.selectFrom('school_student_guardians').select('id').where('school_student_id', '=', stu.Asha).executeTakeFirstOrThrow()
    await db.insertInto('school_messages').values({ school_id: schoolId, audience: 'parent', template: 'result_ready', language: 'en', dedupe_key: `td-${tag}`, status: 'not_sent', recipient_student_id: stu.Asha, recipient_guardian_id: g.id }).execute()
  })

  afterAll(async () => {
    const ids = [schoolId]
    await deleteTestCredentials(userIds)
    for (const t of ['school_messages', 'school_paper_releases', 'school_answer_marks', 'school_own_sheets', 'school_own_questions', 'school_own_papers'] as const)
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

  const kinds = (t: Awaited<ReturnType<typeof schoolToday>>) => Object.fromEntries(t.items.map((i) => [i.kind, i.count]))

  it('the office sees the whole school: answers to check, missing sheets, a closing window, messages not sent', async () => {
    const t = await schoolToday(db, admin, NOW)
    // Ravi has no sheets; Zoya's section is released, so she is not chased
    expect(kinds(t)).toEqual({ to_check: 2, window_closing: 1, no_sheets: 1, not_sent: 1 })
    expect(t.toCheckTotal).toBe(2)
    expect(t.recent[0]).toMatchObject({ id: paperId, state: 'to_check', toCheck: 2 })
    expect(t.examsThisYear).toBe(1)
  })

  it('a teacher sees only their own section and subject, and no message list', async () => {
    const t = await schoolToday(db, teacher, NOW)
    expect(kinds(t)).toEqual({ to_check: 1, no_sheets: 1 })
  })

  it('the principal sees the whole school; a student is refused', async () => {
    expect(kinds(await schoolToday(db, principal, NOW)).to_check).toBe(2)
    const asStudent = { ...admin, role: 'student' } as unknown as SchoolScope
    await expect(schoolToday(db, asStudent, NOW)).rejects.toMatchObject({ code: 'forbidden' })
  })

  it('the school year starts on 1 April', () => {
    expect(schoolYearStart(new Date(2026, 10, 3))).toEqual(new Date(2026, 3, 1))
    expect(schoolYearStart(new Date(2027, 1, 10))).toEqual(new Date(2026, 3, 1))
  })
})
