import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createDb } from '../../db/connection'
import type { Db } from '../../db/connection'
import { schoolsRepository } from '../../db/repositories'
import type { SchoolScope } from '../../db/school-scope'
import { deleteSchoolTermsForTest, deleteTestCredentials } from '../../db/test-helpers'
import { loadSchoolScope } from '../school-session'
import { classProgress, exportProgress } from './class-progress'
import { createSchoolStudent, createSchoolTeacher } from './people'
import { examInsight, myProgress } from './progress'
import { seedProgressDemo } from './progress-demo'
import { practiseHtml, summaryHtml, summaryText } from './progress-share'
import { getReflection, saveReflection } from './reflection'
import { saveProgressSettings } from './school-settings'
import { addSchoolSubject, createClass, createSection } from './setup'
import { acceptSchoolTerms } from './terms'

// Progress Report and Class Progress (owner direction 2026-10-31). Local test database only; the history is
// the deterministic demo seed, so no AI and no image is involved.
describe('progress report and class progress', () => {
  let db: Db
  const tag = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  let schoolId: string
  let admin: SchoolScope
  let outsiderTeacher: SchoolScope
  let parent: SchoolScope
  let otherParent: SchoolScope
  const students: Record<string, { id: string; scope: SchoolScope }> = {}
  const userIds: Array<string> = []
  const households: Array<string> = []
  let subjectId: string
  let sourceId: string
  let sectionId: string
  let conceptId: string
  const NOW = new Date()

  beforeAll(async () => {
    db = createDb()
    const p = await schoolsRepository.provision(db, {
      name: `Progress School ${tag}`,
      code: `pg-${tag}`,
      board: 'CBSE',
      adminName: 'Admin',
      adminEmail: `pg-${tag}@school.test`,
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
        .values({ board: 'CBSE', class: 7, code: `ZP-${tag}`, name: 'Progress Maths', language: 'en', is_active: true })
        .returning('id')
        .executeTakeFirstOrThrow()
    ).id
    sourceId = (
      await db.insertInto('sources').values({ subject_id: subjectId, title: 'Progress Book', publisher: 'NCERT' }).returning('id').executeTakeFirstOrThrow()
    ).id
    let firstChapter = ''
    for (let i = 1; i <= 6; i++) {
      const ch = await db
        .insertInto('chapters')
        .values({ source_id: sourceId, subject_id: subjectId, part: 'I', chapter_no: i, name: `Chapter ${i} topic`, order_index: i })
        .returning('id')
        .executeTakeFirstOrThrow()
      if (i === 1) firstChapter = ch.id
    }
    conceptId = (
      await db
        .insertInto('concepts')
        .values({ chapter_id: firstChapter, board: 'CBSE', class: 7, code: `ZP-${tag}-1.1`, name: 'Chapter 1 idea', difficulty_base: 'Easy' })
        .returning('id')
        .executeTakeFirstOrThrow()
    ).id
    for (let i = 0; i < 3; i++)
      await db
        .insertInto('questions')
        .values({
          concept_id: conceptId,
          board: 'CBSE',
          class: 7,
          bloom: 'Apply',
          difficulty: 'Easy',
          marks: 2,
          type: 'short_answer',
          text: `Practice question ${tag} ${i}`,
          text_hash: `${tag}-pq-${i}`,
          answer: `Practice answer ${i}`,
          status: 'approved',
          origin: 'manual',
          created_by: 'test',
          tags: [],
        })
        .execute()
    const cls = await createClass(db, admin, 7, '2026-27')
    sectionId = (await createSection(db, admin, cls.id, 'A')).id
    await addSchoolSubject(db, admin, cls.id, subjectId)
    for (const [i, n] of ['Asha', 'Ravi', 'Meena', 'Kiran', 'Sita', 'Omar'].entries()) {
      const s = await createSchoolStudent(db, admin, {
        name: n,
        grade: 7,
        sectionId,
        sectionName: 'A',
        rollNo: String(i + 1),
        admissionNo: null,
        guardianPhone: null,
        guardianName: null,
      })
      households.push(s.user.household_id)
      userIds.push(s.user.id)
      const sc = await loadSchoolScope(db, s.user.id, schoolId, ['student'])
      if (!sc.ok) throw new Error('scope')
      students[n] = { id: s.schoolStudent.id, scope: sc.scope }
    }
    const mkParent = async (name: string, email: string, child: string | null) => {
      const t = await createSchoolTeacher(db, admin, { name, email })
      households.push(t.user.household_id)
      userIds.push(t.user.id)
      await db.updateTable('school_members').set({ role: 'parent' }).where('id', '=', t.member.id).execute()
      if (child)
        await db.insertInto('school_student_guardians').values({ school_id: schoolId, school_student_id: child, phone_e164: '+910000000000', name, user_id: t.user.id }).execute()
      const l = await loadSchoolScope(db, t.user.id, schoolId, ['parent'])
      if (!l.ok) throw new Error('scope')
      return l.scope
    }
    parent = await mkParent('Asha Parent', `pa-${tag}@school.test`, students.Asha.id)
    otherParent = await mkParent('Other Parent', `op-${tag}@school.test`, students.Ravi.id)
    const t = await createSchoolTeacher(db, admin, { name: 'Outside Teacher', email: `ot-${tag}@school.test` })
    households.push(t.user.household_id)
    userIds.push(t.user.id)
    const so = await loadSchoolScope(db, t.user.id, schoolId, ['teacher'])
    if (!so.ok) throw new Error('scope')
    outsiderTeacher = so.scope
  })

  afterAll(async () => {
    const ids = [schoolId]
    await deleteTestCredentials(userIds)
    for (const t of ['school_exam_reflections', 'school_answer_disputes', 'school_paper_releases', 'school_answer_marks', 'school_sheet_marking', 'school_own_sheets', 'school_own_questions', 'school_own_papers'] as const)
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
    await db.deleteFrom('questions').where('concept_id', '=', conceptId).execute()
    await db.deleteFrom('concepts').where('id', '=', conceptId).execute()
    await db.deleteFrom('chapters').where('source_id', '=', sourceId).execute()
    await db.deleteFrom('sources').where('id', '=', sourceId).execute()
    await db.deleteFrom('subjects').where('id', '=', subjectId).execute()
    await db.destroy()
  })

  it('before any locked exam there is nothing to show, and the seed is written once', async () => {
    const empty = await myProgress(db, students.Asha.scope)
    expect(empty).toMatchObject({ hasData: false, growth: [], focus: [], rank: null })
    const first = await seedProgressDemo(db, schoolId, NOW)
    expect(first).toMatchObject({ papers: 3, students: 6, skipped: false })
    expect(await seedProgressDemo(db, schoolId, NOW)).toMatchObject({ skipped: true })
  })

  it('a student sees her growth line, tiles, topics, habits and focus from locked marks', async () => {
    const p = await myProgress(db, students.Asha.scope)
    expect(p.hasData).toBe(true)
    expect(p.viewer).toMatchObject({ name: 'Asha', grade: 7, sectionName: 'A' })
    expect(p.growth).toHaveLength(3)
    expect(p.growth.map((g) => g.title)).toEqual([
      'Progress Maths Unit Test 1',
      'Progress Maths Unit Test 2',
      'Progress Maths Half-Yearly',
    ])
    expect(p.subjects).toHaveLength(1)
    expect(p.subjects[0].assessed).toBeGreaterThanOrEqual(4)
    expect(p.topics.every((t) => ['beginner', 'progressing', 'proficient', null].includes(t.level))).toBe(true)
    expect(p.focus.length).toBeGreaterThan(0)
    expect(p.focus.length).toBeLessThanOrEqual(3)
    expect(p.habits).toHaveLength(5)
    expect(p.best.bestPct).toBe(Math.max(...p.growth.map((g) => g.pct)))
    expect(JSON.stringify(p)).not.toContain('Ravi')
  })

  it('class rank is off until the school turns it on; personal best is always there', async () => {
    expect((await myProgress(db, students.Asha.scope)).rank).toBeNull()
    await saveProgressSettings(db, admin, { showClassRank: true, disputeWindowDays: 7 })
    const r = (await myProgress(db, students.Asha.scope)).rank
    expect(r).toMatchObject({ of: 6 })
    expect(r!.place).toBeGreaterThanOrEqual(1)
    await expect(saveProgressSettings(db, students.Asha.scope, { showClassRank: false, disputeWindowDays: 7 })).rejects.toThrow()
    await expect(saveProgressSettings(db, admin, { showClassRank: false, disputeWindowDays: 0 })).rejects.toThrow(/1 to 60/)
    await saveProgressSettings(db, admin, { showClassRank: false, disputeWindowDays: 7 })
    expect((await myProgress(db, students.Asha.scope)).rank).toBeNull()
  })

  it('only locked marks feed the levels and the growth line; an open window is shown only in the exam report', async () => {
    const last = await db
      .selectFrom('school_paper_releases')
      .select(['id', 'paper_id'])
      .where('school_id', '=', schoolId)
      .orderBy('released_at', 'desc')
      .executeTakeFirstOrThrow()
    await db.updateTable('school_paper_releases').set({ locked_at: null, window_closes_at: new Date(NOW.getTime() + 3 * 86_400_000) }).where('id', '=', last.id).execute()
    const p = await myProgress(db, students.Asha.scope)
    expect(p.growth).toHaveLength(2)
    const rep = await examInsight(db, students.Asha.scope, last.paper_id)
    expect(rep.exam.locked).toBe(false)
    expect(rep.score.max).toBe(30)
    await db.updateTable('school_paper_releases').set({ locked_at: NOW }).where('id', '=', last.id).execute()
    expect((await myProgress(db, students.Asha.scope)).growth).toHaveLength(3)
  })

  it('the exam report splits the marks lost, names three things to fix, and gives marks per step', async () => {
    const p = await myProgress(db, students.Asha.scope)
    const rep = await examInsight(db, students.Asha.scope, p.growth[2].paperId)
    expect(rep.score.earned).toBe(p.exams[0].earned)
    expect(rep.split.knowledge + rep.split.habit + rep.split.unclear).toBe(rep.score.max - rep.score.earned)
    expect(rep.fixes.length).toBeLessThanOrEqual(3)
    expect(rep.grid).toHaveLength(16)
    const written = rep.grid.find((g) => g.steps.length > 0)
    expect(written?.steps.reduce((n, s) => n + s.awarded, 0)).toBe(written?.marks)
    expect(rep.canFlag).toBe(true)
  })

  it('nobody reads another student’s report; a parent reads only her own child’s, read-only', async () => {
    const asha = await myProgress(db, students.Asha.scope)
    const ravi = await myProgress(db, students.Ravi.scope)
    await expect(examInsight(db, students.Asha.scope, '00000000-0000-4000-8000-000000000000')).rejects.toThrow()
    const viaParent = await myProgress(db, parent)
    expect(viaParent.viewer.name).toBe('Asha')
    expect(viaParent.growth.map((g) => g.pct)).toEqual(asha.growth.map((g) => g.pct))
    expect(viaParent.growth.map((g) => g.pct)).not.toEqual(ravi.growth.map((g) => g.pct))
    await expect(myProgress(db, parent, students.Ravi.id)).rejects.toThrow()
    expect((await myProgress(db, otherParent)).viewer.name).toBe('Ravi')
    expect((await examInsight(db, parent, asha.growth[0].paperId)).canFlag).toBe(false)
    await expect(myProgress(db, admin)).rejects.toThrow()
    await expect(myProgress(db, outsiderTeacher)).rejects.toThrow()
  })

  it('self-reflection: only the student writes it; her parent can read it; it goes into the export', async () => {
    const paperId = (await myProgress(db, students.Asha.scope)).growth[0].paperId
    await saveReflection(db, students.Asha.scope, paperId, { hardest: '9', nextTime: 'show_steps', note: 'Write every step', feeling: 2 })
    await saveReflection(db, students.Asha.scope, paperId, { hardest: '10', nextTime: 'write_more', note: null, feeling: 3 })
    expect(await getReflection(db, students.Asha.scope, paperId)).toMatchObject({ hardest: '10', nextTime: 'write_more', feeling: 3 })
    expect(await getReflection(db, parent, paperId)).toMatchObject({ hardest: '10' })
    await expect(saveReflection(db, parent, paperId, { hardest: null, nextTime: null, note: null, feeling: 1 })).rejects.toThrow()
    await expect(saveReflection(db, students.Asha.scope, paperId, { hardest: null, nextTime: 'bogus', note: null, feeling: 1 })).rejects.toThrow(/Choose/)
    const csv = (await exportProgress(db, admin, sectionId, 'csv')).body as string
    expect(csv.split('\r\n')[0]).toContain('"Level"')
    expect(csv).toContain('"Hardest question"')
    expect(csv).toContain('"write_more"')
  })

  it('the teacher sees the heatmaps, who needs attention and an export; a teacher of nothing sees nothing', async () => {
    const cp = await classProgress(db, admin, sectionId)
    expect(cp.students).toBe(6)
    expect(cp.hasData).toBe(true)
    if (!cp.heatmap) throw new Error('no heatmap')
    expect(cp.heatmap.rows).toHaveLength(6)
    expect(cp.heatmap.columns.length).toBeGreaterThanOrEqual(4)
    expect(cp.heatmap.rows[0].cells).toHaveLength(cp.heatmap.columns.length)
    expect(cp.habitHeat).toHaveLength(6)
    for (const a of cp.attention) expect(a.reasons.length).toBeGreaterThan(0)
    const none = await classProgress(db, outsiderTeacher)
    expect(none.section).toBeNull()
    await expect(classProgress(db, students.Asha.scope)).rejects.toThrow()
    const xlsx = await exportProgress(db, admin, sectionId, 'xlsx')
    expect(Buffer.from(xlsx.body as Buffer).subarray(0, 2).toString()).toBe('PK')
    await expect(exportProgress(db, outsiderTeacher, sectionId, 'csv')).rejects.toThrow()
  })

  it('the parent summary and WhatsApp text come in English and Telugu, from final marks only', async () => {
    const en = await summaryText(db, students.Asha.scope, 'en')
    const te = await summaryText(db, students.Asha.scope, 'te')
    expect(en).toContain('Progress summary: Asha')
    expect(en).toContain('Proficient')
    expect(te).toContain('పురోగతి సారాంశం')
    expect(te).toContain('Asha')
    const html = await summaryHtml(db, parent, 'te')
    expect(html).toContain('<h1>Asha</h1>')
    expect(html).toContain('మీ పరీక్షలు')
    expect(html).not.toContain('Ravi')
  })

  it('"Practise this" is a printable sheet for a topic she has met, with new questions and an answer page', async () => {
    const chapter = await db.selectFrom('chapters').select('id').where('source_id', '=', sourceId).where('chapter_no', '=', 1).executeTakeFirstOrThrow()
    const html = await practiseHtml(db, students.Asha.scope, `h:${chapter.id}`, 'en')
    expect(html).toContain('Practice question')
    expect(html).toContain('Answers')
    expect(html).toContain('Practice answer')
    await expect(practiseHtml(db, students.Asha.scope, 'h:00000000-0000-4000-8000-000000000000', 'en')).rejects.toThrow()
    await expect(practiseHtml(db, students.Asha.scope, 'nonsense', 'en')).rejects.toThrow()
  })
})
