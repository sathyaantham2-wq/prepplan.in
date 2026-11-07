import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createDb } from '../../db/connection'
import type { Db } from '../../db/connection'
import { examBuilderRepository, schoolsRepository } from '../../db/repositories'
import type { SchoolScope } from '../../db/school-scope'
import { deleteSchoolTermsForTest, deleteTestCredentials } from '../../db/test-helpers'
import { loadSchoolScope } from '../school-session'
import { builderAction, builderBank, builderView } from './exam-builder'
import { createExam, listExams, teacherCopyHtml } from './exam-service'
import { createSchoolTeacher } from './people'
import { addSchoolSubject, assignTeacher, createClass, createSection } from './setup'
import { saveTemplate } from './template-service'
import type { TemplateDefinition } from './templates'
import { acceptSchoolTerms } from './terms'

// Teacher control over question selection (docs/SCHOOLS_MODULE_PLAN.md section 16): the three ways, lock and refill,
// add and the full-section rule, swap, finishing with versions and "used before", reopening, set B, and who may do what.
// Local test database only.
const TINY: TemplateDefinition = {
  name: 'Builder test, 8 marks',
  totalMarks: 8,
  durationMin: 30,
  levelMix: { recall_understanding: 50, application: 30, analysis_evaluation: 20 },
  sections: [
    { name: 'Section A — Multiple choice', kind: 'mcq', count: 4, marks: 1, orCount: 0 },
    { name: 'Section B — Short answer (2 marks each)', kind: 'short_answer', count: 2, marks: 2, orCount: 1 },
  ],
}

describe('paper builder', () => {
  let db: Db
  const tag = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  let schoolId: string
  let admin: SchoolScope
  let teacher: SchoolScope
  let outsider: SchoolScope
  let principal: SchoolScope
  let key: string
  let subjectId: string
  let sourceId: string
  let secA: string
  const chapterIds: Array<string> = []
  const userIds: Array<string> = []
  const households: Array<string> = []

  const input = (mode: 'quick' | 'auto_edit' | 'hand_pick', title = `Paper ${mode}`) => ({
    title,
    subjectId,
    templateKey: key,
    chapterIds,
    sectionIds: [secA],
    mode,
  })

  beforeAll(async () => {
    db = createDb()
    const p = await schoolsRepository.provision(db, { name: `Builder School ${tag}`, code: `bd-${tag}`, board: 'CBSE', adminName: 'Admin', adminEmail: `bd-${tag}@school.test` })
    schoolId = p.school.id
    userIds.push(p.adminUserId)
    const sa = await loadSchoolScope(db, p.adminUserId, schoolId, ['school_admin'])
    if (!sa.ok) throw new Error('scope')
    admin = sa.scope
    await acceptSchoolTerms(db, admin)
    subjectId = (await db.insertInto('subjects').values({ board: 'CBSE', class: 7, code: `BU-${tag}`, name: 'Builder Maths', language: 'en', is_active: true }).returning('id').executeTakeFirstOrThrow()).id
    sourceId = (await db.insertInto('sources').values({ subject_id: subjectId, title: 'Builder Book', publisher: 'NCERT' }).returning('id').executeTakeFirstOrThrow()).id
    for (const no of [3, 4]) {
      const ch = await db.insertInto('chapters').values({ source_id: sourceId, subject_id: subjectId, part: 'I', chapter_no: no, name: `Chapter ${no} name`, order_index: no }).returning('id').executeTakeFirstOrThrow()
      chapterIds.push(ch.id)
      const concept = await db.insertInto('concepts').values({ chapter_id: ch.id, board: 'CBSE', class: 7, code: `BU-${tag}-${no}`, name: `Concept ${no}`, difficulty_base: 'Easy' }).returning('id').executeTakeFirstOrThrow()
      for (let i = 0; i < 6; i++) {
        const q = await db
          .insertInto('questions')
          .values({ concept_id: concept.id, board: 'CBSE', class: 7, bloom: i % 2 ? 'Apply' : 'Remember', difficulty: i % 3 ? 'Easy' : 'Hard', marks: 1, type: 'mcq', text: `MCQ ch${no} #${i} ${tag}`, text_hash: `${tag}-m${no}-${i}`, answer: `ANSWER-mcq-${no}-${i}`, status: 'approved', origin: 'manual', created_by: 'test', tags: [] })
          .returning('id')
          .executeTakeFirstOrThrow()
        for (const [k, label] of ['A', 'B', 'C', 'D'].entries())
          await db.insertInto('question_options').values({ question_id: q.id, label, text: `opt ${label}`, is_correct: k === 0, order_index: k + 1 }).execute()
      }
      for (let i = 0; i < 4; i++)
        await db
          .insertInto('questions')
          .values({ concept_id: concept.id, board: 'CBSE', class: 7, bloom: 'Apply', difficulty: 'Easy', marks: 2, type: 'short_answer', text: `Short ch${no} #${i} ${tag}`, text_hash: `${tag}-s${no}-${i}`, answer: `ANSWER-short-${no}-${i}`, status: 'approved', origin: 'manual', created_by: 'test', tags: [] })
          .execute()
    }
    const cls = await createClass(db, admin, 7, '2026-27')
    secA = (await createSection(db, admin, cls.id, 'A')).id
    const ss = (await addSchoolSubject(db, admin, cls.id, subjectId)) as { id: string }
    const staff = async (name: string, role: 'teacher' | 'principal', assign: boolean) => {
      const t = await createSchoolTeacher(db, admin, { name, email: `${name.split(' ')[0].toLowerCase()}-${tag}@school.test` })
      households.push(t.user.household_id)
      userIds.push(t.user.id)
      if (role === 'principal') await db.updateTable('school_members').set({ role }).where('id', '=', t.member.id).execute()
      if (assign) await assignTeacher(db, admin, { memberId: t.member.id, sectionId: secA, schoolSubjectId: ss.id })
      const sc = await loadSchoolScope(db, t.user.id, schoolId, [role])
      if (!sc.ok) throw new Error('scope')
      return sc.scope
    }
    teacher = await staff('Tara Teacher', 'teacher', true)
    outsider = await staff('Omar Other', 'teacher', false)
    principal = await staff('Prem Principal', 'principal', false)
    key = (await saveTemplate(db, admin, { definition: TINY })).key
  })

  afterAll(async () => {
    const ids = [schoolId]
    await deleteTestCredentials(userIds)
    await db.deleteFrom('school_exam_versions').where('school_id', 'in', ids).execute()
    await db.deleteFrom('school_exam_questions').where('school_id', 'in', ids).execute()
    await db.deleteFrom('school_booklet_layouts').where('school_id', 'in', ids).execute()
    await db.deleteFrom('school_exam_sections').where('school_id', 'in', ids).execute()
    await db.updateTable('school_exams').set({ set_of: null }).where('school_id', 'in', ids).execute()
    await db.deleteFrom('school_exams').where('school_id', 'in', ids).execute()
    await db.deleteFrom('school_paper_templates').where('school_id', 'in', ids).execute()
    await db.deleteFrom('audit_log').where('school_id', 'in', ids).execute()
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
    const qids = (await db.selectFrom('questions as q').innerJoin('concepts as c', 'c.id', 'q.concept_id').select('q.id').where('c.chapter_id', 'in', chapterIds).execute()).map((r) => r.id)
    if (qids.length) {
      await db.deleteFrom('question_options').where('question_id', 'in', qids).execute()
      await db.deleteFrom('questions').where('id', 'in', qids).execute()
    }
    await db.deleteFrom('concepts').where('chapter_id', 'in', chapterIds).execute()
    await db.deleteFrom('chapters').where('source_id', '=', sourceId).execute()
    await db.deleteFrom('sources').where('id', '=', sourceId).execute()
    await db.deleteFrom('subjects').where('id', '=', subjectId).execute()
    await db.destroy()
  })

  const versions = (examId: string) => db.selectFrom('school_exam_versions').select(['version', 'questions']).where('exam_id', '=', examId).orderBy('version').execute()

  it('Quick: finished at once, and version 1 records exactly which questions it uses', async () => {
    const e = await createExam(db, teacher, input('quick'))
    expect(e.stage).toBe('final')
    const v = await versions(e.id)
    expect(v).toHaveLength(1)
    expect((v[0].questions as Array<unknown>).length).toBe(7) // 4 MCQ, 2 short answers and one OR option
  })

  let autoId = ''
  it('Auto + edit: filled and open; a locked question survives "Refill unlocked"', async () => {
    autoId = (await createExam(db, teacher, input('auto_edit'))).id
    let v = await builderView(db, teacher, autoId)
    expect(v.exam.stage).toBe('building')
    expect(v.check.complete).toBe(true)
    const keep = v.picks.find((p) => p.section.startsWith('Section A'))!
    await builderAction(db, teacher, autoId, { action: 'lock', pickId: keep.id, locked: true })
    await builderAction(db, teacher, autoId, { action: 'refill_unlocked' })
    v = await builderView(db, teacher, autoId)
    expect(v.picks.find((p) => p.questionId === keep.questionId)?.locked).toBe(true)
    expect(v.check.complete).toBe(true)
  })

  it('Swap offers up to 3 of the same type and marks, and swaps one in', async () => {
    const v = await builderView(db, teacher, autoId)
    const p = v.picks.find((x) => x.section.startsWith('Section A') && !x.locked)!
    const r = await builderAction(db, teacher, autoId, { action: 'swap_options', pickId: p.id })
    const options = r.options as Array<{ id: string; type: string; marks: number }>
    expect(options.length).toBeGreaterThan(0)
    expect(options.length).toBeLessThanOrEqual(3)
    expect(options.every((o) => o.type === 'mcq' && o.marks === 1)).toBe(true)
    await builderAction(db, teacher, autoId, { action: 'swap_to', pickId: p.id, questionId: options[0].id })
    const after = await builderView(db, teacher, autoId)
    expect(after.picks.find((x) => x.id === p.id)?.questionId).toBe(options[0].id)
  })

  it('Hand-pick: starts empty; Add fills the right section, refuses a full one, makes the OR pair', async () => {
    const id = (await createExam(db, teacher, input('hand_pick'))).id
    let v = await builderView(db, teacher, id)
    expect(v.picks).toHaveLength(0)
    expect(v.check.warnings).toContain('Section A — Multiple choice needs 4 more 1-mark questions (Multiple choice (1 mark each)).'.replace('(Multiple choice (1 mark each))', `(${v.sections[0].slot})`))
    const bank = await builderBank(db, teacher, id, {})
    const mcqs = bank.questions.filter((q) => q.type === 'mcq')
    const shorts = bank.questions.filter((q) => q.type === 'short_answer')
    for (const q of mcqs.slice(0, 4)) await builderAction(db, teacher, id, { action: 'add', questionId: q.id })
    await expect(builderAction(db, teacher, id, { action: 'add', questionId: mcqs[4].id })).rejects.toThrow(/already full/)
    for (const q of shorts.slice(0, 3)) await builderAction(db, teacher, id, { action: 'add', questionId: q.id })
    v = await builderView(db, teacher, id)
    expect(v.check.complete).toBe(true)
    const pair = v.picks.filter((p) => p.choiceGroup)
    expect(pair).toHaveLength(2)
    expect(new Set(pair.map((p) => p.position)).size).toBe(1) // an OR pair shares its number
    expect(v.picks.filter((p) => !p.isAlternate).map((p) => p.position)).toEqual([1, 2, 3, 4, 5, 6])
    // moving a question changes its number, not its section
    const second = v.picks.find((p) => p.position === 2)!
    await builderAction(db, teacher, id, { action: 'move', pickId: second.id, direction: 'up' })
    expect((await builderView(db, teacher, id)).picks.find((p) => p.id === second.id)?.position).toBe(1)
  })

  it('Finishing is refused while the bank still has questions for an open place, then records version 1', async () => {
    const id = (await createExam(db, teacher, input('hand_pick', 'Finish test'))).id
    await expect(builderAction(db, teacher, id, { action: 'finalize' })).rejects.toThrow(/still has questions/)
    await builderAction(db, teacher, id, { action: 'fill_rest' })
    await builderAction(db, teacher, id, { action: 'finalize' })
    const v = await builderView(db, teacher, id)
    expect(v.exam).toMatchObject({ stage: 'final', version: 1 })
    await expect(builderAction(db, teacher, id, { action: 'fill_rest' })).rejects.toThrow(/finished/)
    // changing it again makes version 2; version 1 stays on record
    await builderAction(db, teacher, id, { action: 'reopen' })
    await builderAction(db, teacher, id, { action: 'finalize' })
    expect((await versions(id)).map((x) => x.version)).toEqual([1, 2])
    // the teacher copy is made from the final questions
    const html = (await teacherCopyHtml(db, teacher, id)).html
    // the teacher copy prints each question's answer: every answer of the final selection is there
    const finalIds = (await builderView(db, teacher, id)).picks.map((p) => p.questionId)
    const answers = await db.selectFrom('questions').select('answer').where('id', 'in', finalIds).execute()
    for (const r of answers) expect(html).toContain(r.answer)
  })

  it('"Used before" shows other papers of this school; it can be hidden', async () => {
    const id = (await createExam(db, teacher, input('hand_pick', 'Used test'))).id
    const all = await builderBank(db, teacher, id, {})
    const used = all.questions.filter((q) => q.usedBefore.length > 0)
    expect(used.length).toBeGreaterThan(0)
    expect(used[0].usedBefore[0]).toMatchObject({ exam: expect.any(String), section: expect.stringContaining('Section') })
    const hidden = await builderBank(db, teacher, id, { hideUsed: true })
    expect(hidden.questions.every((q) => q.usedBefore.length === 0)).toBe(true)
  })

  it('the automatic fill honours the difficulty mix the teacher chose', async () => {
    const mcqDifficulties = async (mix: { Easy?: number; Hard?: number; Hardest?: number }) => {
      const id = (await createExam(db, teacher, input('hand_pick', `Mix ${JSON.stringify(mix)}`))).id
      await builderAction(db, teacher, id, { action: 'fill_rest', difficultyMix: mix })
      const v = await builderView(db, teacher, id)
      return v.picks.filter((p) => p.marks === 1 && !p.isAlternate).map((p) => p.difficulty)
    }
    const hard = await mcqDifficulties({ Easy: 0, Hard: 100, Hardest: 0 })
    expect(hard.length).toBeGreaterThan(0)
    expect(hard.every((d) => d === 'Hard')).toBe(true)
    const easy = await mcqDifficulties({ Easy: 100, Hard: 0, Hardest: 0 })
    expect(easy.every((d) => d === 'Easy')).toBe(true)
  })

  it('knows which questions this school used in other papers, drafts included', async () => {
    const id = (await createExam(db, teacher, input('hand_pick', 'Last used test'))).id
    const inAuto = (await builderView(db, teacher, autoId)).picks.map((p) => p.questionId)
    const used = await examBuilderRepository.lastUsedAt(db, teacher, id, inAuto)
    expect(used.size).toBe(inAuto.length)
    // a question nobody used is absent
    const fresh = await db.selectFrom('questions').select('id').where('text', 'like', `%ch3 #0 ${tag}`).executeTakeFirstOrThrow()
    const none = await examBuilderRepository.lastUsedAt(db, teacher, id, [fresh.id])
    expect(none.size === 0 || none.has(fresh.id)).toBe(true)
  })

  it('the paper PDF and Word file of a draft show its real maximum marks, not 0', async () => {
    const { questionPaperHtml } = await import('./exam-service')
    const id = (await createExam(db, teacher, input('hand_pick', 'Draft marks'))).id
    await builderAction(db, teacher, id, { action: 'fill_rest' })
    const draft = (await questionPaperHtml(db, teacher, id)).input()
    expect(draft.totalMarks).toBe(8) // 4 one-mark MCQs and 2 two-mark questions (the OR counts once)
    expect(draft.halfYearly?.nominalMarks).toBe(8)
    // a finished paper still agrees with its recorded marks
    const quick = await createExam(db, teacher, input('quick', 'Quick marks'))
    const recorded = await db.selectFrom('school_exams').select('printed_marks').where('id', '=', quick.id).executeTakeFirstOrThrow()
    expect((await questionPaperHtml(db, teacher, quick.id)).input().totalMarks).toBe(Number(recorded.printed_marks))
  })

  it('answers and marking schemes are for the teacher and the office only', async () => {
    const withAns = await builderBank(db, teacher, autoId, { answers: true })
    expect(JSON.stringify(withAns)).toContain('ANSWER-')
    const plain = await builderBank(db, teacher, autoId, {})
    expect(JSON.stringify(plain)).not.toContain('ANSWER-')
    expect(JSON.stringify(plain)).not.toContain('"correct"')
  })

  it('who may do what: the principal looks at finished papers only; an outsider and a student are refused', async () => {
    // a paper still being made is the maker's and the office's
    expect((await listExams(db, principal)).some((e) => e.id === autoId)).toBe(false)
    expect((await listExams(db, admin)).some((e) => e.id === autoId)).toBe(true)
    await expect(builderView(db, principal, autoId)).rejects.toMatchObject({ code: 'not_found' })
    await expect(builderAction(db, principal, autoId, { action: 'fill_rest' })).rejects.toMatchObject({ code: 'forbidden' })
    await expect(builderView(db, outsider, autoId)).rejects.toMatchObject({ code: 'not_found' })
    const asStudent = { ...admin, role: 'student' } as unknown as SchoolScope
    await expect(builderView(db, asStudent, autoId)).rejects.toThrow()
    // the office may finish the teacher's paper; then the principal can look
    await builderAction(db, admin, autoId, { action: 'finalize' })
    expect((await builderView(db, principal, autoId)).exam.stage).toBe('final')
  })

  it('Set B: the same questions in a new order, or equal-difficulty alternatives', async () => {
    const a = (await createExam(db, teacher, input('quick', 'Set test'))).id
    const r = await builderAction(db, teacher, a, { action: 'make_set_b', kind: 'shuffle' })
    const b = (r.options as { examId: string }).examId
    const qa = (await builderView(db, teacher, a)).picks.map((p) => p.questionId).sort()
    const vb = await builderView(db, teacher, b)
    expect(vb.exam).toMatchObject({ setLabel: 'B', stage: 'final' })
    expect(vb.picks.map((p) => p.questionId).sort()).toEqual(qa)
    await expect(builderAction(db, teacher, a, { action: 'make_set_b', kind: 'shuffle' })).rejects.toThrow(/already exists/)
    const a2 = (await createExam(db, teacher, input('quick', 'Alt test'))).id
    const b2 = ((await builderAction(db, teacher, a2, { action: 'make_set_b', kind: 'alternatives' })).options as { examId: string }).examId
    const qa2 = new Set((await builderView(db, teacher, a2)).picks.map((p) => p.questionId))
    const qb2 = (await builderView(db, teacher, b2)).picks.map((p) => p.questionId)
    expect(qb2.filter((q) => !qa2.has(q)).length).toBeGreaterThan(0)
  })
})
