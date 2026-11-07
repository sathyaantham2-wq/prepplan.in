import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createDb } from '../../db/connection'
import type { Db } from '../../db/connection'
import { examBuilderRepository, questionsRepository, schoolsRepository } from '../../db/repositories'
import type { SchoolScope } from '../../db/school-scope'
import { deleteSchoolTermsForTest, deleteTestCredentials } from '../../db/test-helpers'
import { loadSchoolScope } from '../school-session'
import { builderAction, builderBank, builderView } from './exam-builder'
import { createExam, teacherCopyHtml } from './exam-service'
import { createSchoolTeacher } from './people'
import { listOwnQuestions, retireOwnQuestion, saveOwnQuestion, suggestTags } from './school-questions'
import type { OwnQuestionInput } from './school-questions'
import { addSchoolSubject, assignTeacher, createClass, createSection } from './setup'
import { saveTemplate } from './template-service'
import type { TemplateDefinition } from './templates'
import { acceptSchoolTerms } from './terms'

// The school's own questions (docs/SCHOOLS_MODULE_PLAN.md section 16.13, F154): writing one with the AI's suggestion,
// the checks, using it in Make paper with its badge, never reaching another school or the shared bank, changing a
// printed question (a new one; the printed paper keeps the old), retiring, and who may do what. Local test database only.
const TINY: TemplateDefinition = {
  name: 'Own questions test, 6 marks',
  totalMarks: 6,
  durationMin: 30,
  levelMix: { recall_understanding: 50, application: 30, analysis_evaluation: 20 },
  sections: [
    { name: 'Section A — Multiple choice', kind: 'mcq', count: 2, marks: 1, orCount: 0 },
    { name: 'Section B — Short answer (2 marks each)', kind: 'short_answer', count: 2, marks: 2, orCount: 0 },
  ],
}

describe('our questions', () => {
  let db: Db
  const tag = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  const schoolIds: Array<string> = []
  let admin: SchoolScope
  let teacher: SchoolScope
  let outsider: SchoolScope
  let principal: SchoolScope
  let otherSchool: SchoolScope
  let key: string
  let subjectId: string
  let sourceId: string
  let secA: string
  let ssId: string
  let conceptId: string
  const chapterIds: Array<string> = []
  const userIds: Array<string> = []
  const households: Array<string> = []
  const before = process.env.OWN_PAPER_AI

  const mcq = (over: Partial<OwnQuestionInput> = {}): OwnQuestionInput => ({
    schoolSubjectId: ssId,
    chapterId: chapterIds[0],
    conceptId,
    type: 'mcq',
    marks: 1,
    text: `Our own MCQ ${tag}: which is the largest, 2/3, 3/4 or 5/6?`,
    options: [
      { text: '2/3', correct: false },
      { text: '3/4', correct: false },
      { text: '5/6', correct: true },
      { text: 'All equal', correct: false },
    ],
    bloom: 'Understand',
    difficulty: 'Easy',
    ...over,
  })

  beforeAll(async () => {
    process.env.OWN_PAPER_AI = 'fake'
    db = createDb()
    const p = await schoolsRepository.provision(db, { name: `Own Q School ${tag}`, code: `oq-${tag}`, board: 'CBSE', adminName: 'Admin', adminEmail: `oq-${tag}@school.test` })
    schoolIds.push(p.school.id)
    userIds.push(p.adminUserId)
    const sa = await loadSchoolScope(db, p.adminUserId, p.school.id, ['school_admin'])
    if (!sa.ok) throw new Error('scope')
    admin = sa.scope
    await acceptSchoolTerms(db, admin)
    const p2 = await schoolsRepository.provision(db, { name: `Other School ${tag}`, code: `oq2-${tag}`, board: 'CBSE', adminName: 'Admin 2', adminEmail: `oq2-${tag}@school.test` })
    schoolIds.push(p2.school.id)
    userIds.push(p2.adminUserId)
    const sb = await loadSchoolScope(db, p2.adminUserId, p2.school.id, ['school_admin'])
    if (!sb.ok) throw new Error('scope')
    otherSchool = sb.scope

    subjectId = (await db.insertInto('subjects').values({ board: 'CBSE', class: 7, code: `OQ-${tag}`, name: 'Own Q Maths', language: 'en', is_active: true }).returning('id').executeTakeFirstOrThrow()).id
    sourceId = (await db.insertInto('sources').values({ subject_id: subjectId, title: 'Own Q Book', publisher: 'NCERT' }).returning('id').executeTakeFirstOrThrow()).id
    for (const no of [1, 2]) {
      const ch = await db.insertInto('chapters').values({ source_id: sourceId, subject_id: subjectId, part: 'I', chapter_no: no, name: `Chapter ${no} name`, order_index: no }).returning('id').executeTakeFirstOrThrow()
      chapterIds.push(ch.id)
      const concept = await db.insertInto('concepts').values({ chapter_id: ch.id, board: 'CBSE', class: 7, code: `OQ-${tag}-${no}`, name: `Topic ${no}`, difficulty_base: 'Easy' }).returning('id').executeTakeFirstOrThrow()
      if (no === 1) conceptId = concept.id
      for (let i = 0; i < 3; i++) {
        const q = await db
          .insertInto('questions')
          .values({ concept_id: concept.id, board: 'CBSE', class: 7, bloom: 'Remember', difficulty: 'Easy', marks: 1, type: 'mcq', text: `Bank MCQ ch${no} #${i} ${tag}`, text_hash: `${tag}-m${no}-${i}`, answer: 'A', status: 'approved', origin: 'manual', created_by: 'test', tags: [] })
          .returning('id')
          .executeTakeFirstOrThrow()
        for (const [k, label] of ['A', 'B', 'C', 'D'].entries())
          await db.insertInto('question_options').values({ question_id: q.id, label, text: `opt ${label}`, is_correct: k === 0, order_index: k + 1 }).execute()
        await db
          .insertInto('questions')
          .values({ concept_id: concept.id, board: 'CBSE', class: 7, bloom: 'Apply', difficulty: 'Easy', marks: 2, type: 'short_answer', text: `Bank short ch${no} #${i} ${tag}`, text_hash: `${tag}-s${no}-${i}`, answer: 'x', status: 'approved', origin: 'manual', created_by: 'test', tags: [] })
          .execute()
      }
    }
    const cls = await createClass(db, admin, 7, '2026-27')
    secA = (await createSection(db, admin, cls.id, 'A')).id
    ssId = ((await addSchoolSubject(db, admin, cls.id, subjectId)) as { id: string }).id
    const staff = async (name: string, role: 'teacher' | 'principal', assign: boolean) => {
      const t = await createSchoolTeacher(db, admin, { name, email: `${name.split(' ')[0].toLowerCase()}-${tag}@school.test` })
      households.push(t.user.household_id)
      userIds.push(t.user.id)
      if (role === 'principal') await db.updateTable('school_members').set({ role }).where('id', '=', t.member.id).execute()
      if (assign) await assignTeacher(db, admin, { memberId: t.member.id, sectionId: secA, schoolSubjectId: ssId })
      const sc = await loadSchoolScope(db, t.user.id, admin.schoolId, [role])
      if (!sc.ok) throw new Error('scope')
      return sc.scope
    }
    teacher = await staff('Tara Teacher', 'teacher', true)
    outsider = await staff('Omar Other', 'teacher', false)
    principal = await staff('Prem Principal', 'principal', false)
    key = (await saveTemplate(db, admin, { definition: TINY })).key
  })

  afterAll(async () => {
    process.env.OWN_PAPER_AI = before
    const ids = schoolIds
    await deleteTestCredentials(userIds)
    await db.updateTable('school_questions').set({ replaced_by_id: null }).where('school_id', 'in', ids).execute()
    const own = await db.selectFrom('school_questions').select('question_id').where('school_id', 'in', ids).execute()
    await db.deleteFrom('school_questions').where('school_id', 'in', ids).execute()
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
    await db.deleteFrom('ai_jobs').where('household_id', 'in', [...sh.map((h) => h.household_id)]).execute()
    if (mu.length) await db.deleteFrom('users').where('id', 'in', mu).execute()
    await db.deleteFrom('households').where('id', 'in', [...sh.map((h) => h.household_id), ...hh.map((h) => h.household_id), ...households]).execute()
    const qids = [
      ...own.map((r) => r.question_id),
      ...(await db.selectFrom('questions as q').innerJoin('concepts as c', 'c.id', 'q.concept_id').select('q.id').where('c.chapter_id', 'in', chapterIds).execute()).map((r) => r.id),
    ]
    if (qids.length) {
      await db.deleteFrom('question_options').where('question_id', 'in', qids).execute()
      await db.deleteFrom('question_step_marks').where('question_id', 'in', qids).execute()
      await db.deleteFrom('questions').where('id', 'in', qids).execute()
    }
    await db.deleteFrom('concepts').where('chapter_id', 'in', chapterIds).execute()
    await db.deleteFrom('chapters').where('source_id', '=', sourceId).execute()
    await db.deleteFrom('sources').where('id', '=', sourceId).execute()
    await db.deleteFrom('subjects').where('id', '=', subjectId).execute()
    await db.destroy()
  })

  const questionIdOf = async (id: string) =>
    (await db.selectFrom('school_questions').select('question_id').where('id', '=', id).executeTakeFirstOrThrow()).question_id

  it('the AI suggests a chapter, topic and level from the subject\'s own lists', async () => {
    const s = await suggestTags(db, teacher, { schoolSubjectId: ssId, text: 'Which is the largest fraction?', type: 'mcq', marks: 1 })
    expect(s.chapterId).toBe(chapterIds[0])
    expect(s.conceptId).toBe(conceptId)
    expect(s.bloom).toBe('Remember')
  })

  it('refuses an incomplete question in plain words', async () => {
    await expect(saveOwnQuestion(db, teacher, mcq({ options: mcq().options?.slice(0, 3) }))).rejects.toThrow('Write all four options.')
    await expect(saveOwnQuestion(db, teacher, mcq({ options: mcq().options?.map((o) => ({ ...o, correct: true })) }))).rejects.toThrow('exactly one')
    await expect(saveOwnQuestion(db, teacher, mcq({ conceptId: '' }))).rejects.toThrow('chapter and the topic')
    await expect(
      saveOwnQuestion(db, teacher, mcq({ type: 'short_answer', marks: 2, options: [], answer: 'x', steps: [{ description: 'Method', marks: 1 }] })),
    ).rejects.toThrow('add up to 1 marks; the question carries 2')
    // a topic from another chapter
    await expect(saveOwnQuestion(db, teacher, mcq({ chapterId: chapterIds[1] }))).rejects.toThrow('not in this chapter')
  })

  it('who may write: the office and the subject teacher; not a teacher of another subject or the principal', async () => {
    await expect(saveOwnQuestion(db, outsider, mcq())).rejects.toThrow('Subject not found')
    await expect(saveOwnQuestion(db, principal, mcq())).rejects.toThrow('Only the school office and teachers')
    const seen = await listOwnQuestions(db, principal, {})
    expect(seen.mayWrite).toBe(false)
  })

  let ownId = ''
  let ownQ = ''
  it('a saved question is a school-only question: never in the shared bank, its search or the student pools', async () => {
    const r = await saveOwnQuestion(db, teacher, mcq(), undefined)
    ownId = r.id
    ownQ = await questionIdOf(ownId)
    const row = await db.selectFrom('questions').select(['status', 'origin']).where('id', '=', ownQ).executeTakeFirstOrThrow()
    expect(row).toEqual({ status: 'school', origin: 'school' })
    const pool = await questionsRepository.findEligibleForSlot(
      db,
      { conceptIds: [conceptId], bloomAllowed: ['Remember', 'Understand', 'Apply'], difficultiesAllowed: ['Easy', 'Hard', 'Hardest'], marks: 1, excludeQuestionIds: [] },
      50,
    )
    expect(pool.map((q) => q.id)).not.toContain(ownQ)
    const search = await questionsRepository.search(db, { concept_id: conceptId }, 100, 0)
    expect(search.items.map((q) => q.id)).not.toContain(ownQ)
    const list = await listOwnQuestions(db, teacher, {})
    expect(list.questions.map((q) => q.id)).toEqual([ownId])
    expect(list.questions[0].options.filter((o) => o.correct).map((o) => o.text)).toEqual(['5/6'])
  })

  it('another school never sees or picks it', async () => {
    const theirs = await examBuilderRepository.slotCandidates(db, { schoolId: otherSchool.schoolId, conceptIds: [conceptId], marks: 1, blooms: ['Understand'], types: [], exclude: [], limit: 50 })
    expect(theirs.map((q) => q.id)).not.toContain(ownQ)
    const ours = await examBuilderRepository.slotCandidates(db, { schoolId: admin.schoolId, conceptIds: [conceptId], marks: 1, blooms: ['Understand'], types: [], exclude: [], limit: 50 })
    expect(ours.map((q) => q.id)).toContain(ownQ)
    expect((await listOwnQuestions(db, otherSchool, {})).questions).toEqual([])
  })

  let examId = ''
  it('Make paper: in the bank with its badge, "From: Our questions" finds it, and it goes on the paper and the teacher copy', async () => {
    examId = (await createExam(db, teacher, { title: 'Own Q paper', subjectId, templateKey: key, chapterIds, sectionIds: [secA], mode: 'hand_pick' })).id
    const onlyOurs = await builderBank(db, teacher, examId, { source: 'ours' })
    expect(onlyOurs.questions.map((q) => q.id)).toEqual([ownQ])
    expect(onlyOurs.questions[0].ours).toBe(true)
    const bankOnly = await builderBank(db, teacher, examId, { source: 'bank' })
    expect(bankOnly.questions.some((q) => q.ours)).toBe(false)
    await builderAction(db, teacher, examId, { action: 'add', questionId: ownQ })
    await builderAction(db, teacher, examId, { action: 'fill_rest' })
    const v = await builderView(db, teacher, examId)
    expect(v.picks.find((p) => p.questionId === ownQ)?.ours).toBe(true)
    await builderAction(db, teacher, examId, { action: 'finalize' })
    expect((await teacherCopyHtml(db, teacher, examId)).html).toContain('5/6')
  })

  it('changing a printed question makes a new one; the finished paper keeps what it printed', async () => {
    const r = await saveOwnQuestion(db, teacher, mcq({ text: `Our own MCQ ${tag}, reworded: which is largest?` }), ownId)
    expect(r.id).not.toBe(ownId)
    const old = await db.selectFrom('school_questions').select(['retired_at', 'replaced_by_id']).where('id', '=', ownId).executeTakeFirstOrThrow()
    expect(old.retired_at).not.toBeNull()
    expect(old.replaced_by_id).toBe(r.id)
    const printed = await db.selectFrom('school_exam_versions').select('questions').where('exam_id', '=', examId).executeTakeFirstOrThrow()
    expect((printed.questions as Array<{ question_id: string }>).map((x) => x.question_id)).toContain(ownQ)
    const still = await db.selectFrom('school_exam_questions').select('question_id').where('exam_id', '=', examId).execute()
    expect(still.map((x) => x.question_id)).toContain(ownQ)
    // the retired old one can no longer be added anywhere
    const e2 = (await createExam(db, teacher, { title: 'Second paper', subjectId, templateKey: key, chapterIds, sectionIds: [secA], mode: 'hand_pick' })).id
    await expect(builderAction(db, teacher, e2, { action: 'add', questionId: ownQ })).rejects.toThrow('not in the chosen chapters')
    ownId = r.id
    ownQ = await questionIdOf(ownId)
  })

  it('only its maker and the office may change or retire it; retiring takes it out of the bank, nothing is deleted', async () => {
    const t2 = await createSchoolTeacher(db, admin, { name: 'Second Teacher', email: `second-${tag}@school.test` })
    households.push(t2.user.household_id)
    userIds.push(t2.user.id)
    await assignTeacher(db, admin, { memberId: t2.member.id, sectionId: secA, schoolSubjectId: ssId })
    const sc = await loadSchoolScope(db, t2.user.id, admin.schoolId, ['teacher'])
    if (!sc.ok) throw new Error('scope')
    await expect(retireOwnQuestion(db, sc.scope, ownId)).rejects.toThrow('Only the teacher who wrote')
    await retireOwnQuestion(db, admin, ownId)
    const e3 = (await createExam(db, teacher, { title: 'Third paper', subjectId, templateKey: key, chapterIds, sectionIds: [secA], mode: 'hand_pick' })).id
    expect((await builderBank(db, teacher, e3, { source: 'ours' })).questions).toEqual([])
    expect(await db.selectFrom('questions').select('id').where('id', '=', ownQ).executeTakeFirst()).toBeDefined()
    expect((await listOwnQuestions(db, teacher, { retired: true })).questions.map((q) => q.id)).toEqual([ownId])
  })

  it('a written question needs its answer and marking steps that add up', async () => {
    const r = await saveOwnQuestion(
      db,
      teacher,
      mcq({
        type: 'short_answer',
        marks: 2,
        options: [],
        text: `Our short question ${tag}: add 3/4 and 1/8.`,
        answer: '7/8',
        steps: [
          { description: 'Same denominator', marks: 1 },
          { description: 'Correct sum 7/8', marks: 1 },
        ],
        bloom: 'Apply',
      }),
    )
    const qid = await questionIdOf(r.id)
    const steps = await db.selectFrom('question_step_marks').select(['step_no', 'marks']).where('question_id', '=', qid).orderBy('step_no').execute()
    expect(steps.map((s) => Number(s.marks))).toEqual([1, 1])
  })
})
