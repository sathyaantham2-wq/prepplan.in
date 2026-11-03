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
import { markStudentSheets, markingPageImage, markingPrompt, reviewData, setAnswerMark, studentMarking, pageForMarking } from './marking'
import { setOwnKey } from './own-paper-service'
import type { MarkingAi } from './marking'

// M4 stage 1: marking one student's sheets. Local test database only; the AI is a stand-in that records
// what it was sent and answers what the test tells it to.
describe('AI marking of a student (M4 stage 1)', () => {
  let db: Db
  const tag = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  let schoolId: string
  let admin: SchoolScope
  let outsider: SchoolScope
  let paperId: string
  let studentId: string
  const q: Record<string, string> = {}
  const userIds: Array<string> = []
  const households: Array<string> = []
  const STUDENT_NAME = `Zaheerabad Quokka ${tag.replace(/[^a-z0-9]/gi, '')}`
  let subjectId: string
  let sourceId: string

  const answer = (question: string, over: Record<string, unknown> = {}) => ({
    question,
    found: true,
    answer_text: 'written',
    choice: null,
    marks: 0,
    steps: [],
    loss_kind: 'none',
    loss_reason: null,
    confidence: 0.9,
    ...over,
  })
  /** A stand-in AI: pass n answers script[n]; every input is kept. */
  function scripted(script: Array<Array<ReturnType<typeof answer>>>) {
    const sent: Array<{ pages: Array<{ base64: string }>; qs: string }> = []
    const ai: MarkingAi = {
      available: () => true,
      markPass: (input) => {
        sent.push({ pages: input.pages, qs: JSON.stringify(input.questions) })
        return Promise.resolve(JSON.stringify({ answers: script[(sent.length - 1) % script.length] }))
      },
    }
    return { ai, sent }
  }

  async function putPage(seq: number, state: string) {
    const png = await sharp({
      create: { width: 600, height: 800, channels: 3, background: '#f4f1e8' },
    })
      .composite([
        {
          input: {
            create: { width: 500, height: 30, channels: 3, background: '#101010' },
          },
          top: 10,
          left: 50,
        },
      ])
      .png()
      .toBuffer()
    const key = `test/${schoolId}/${tag}/${seq}.png`
    await getScanStore().put(key, encryptScan(png))
    return db
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
        check_state: state,
        uploaded_by_user_id: admin.userId,
      })
      .returning('id')
      .executeTakeFirstOrThrow()
  }

  beforeAll(async () => {
    db = createDb()
    const p = await schoolsRepository.provision(db, {
      name: `Marking School ${tag}`,
      code: `mk-${tag}`,
      board: 'CBSE',
      adminName: 'Admin',
      adminEmail: `mk-${tag}@school.test`,
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
        .values({ board: 'CBSE', class: 7, code: `ZM-${tag}`, name: 'Mark Maths', language: 'en', is_active: true })
        .returning('id')
        .executeTakeFirstOrThrow()
    ).id
    sourceId = (
      await db
        .insertInto('sources')
        .values({ subject_id: subjectId, title: 'Mark Book', publisher: 'NCERT' })
        .returning('id')
        .executeTakeFirstOrThrow()
    ).id
    const cls = await createClass(db, admin, 7, '2026-27')
    const sec = await createSection(db, admin, cls.id, 'A')
    const ss = await addSchoolSubject(db, admin, cls.id, subjectId)
    const s = await createSchoolStudent(db, admin, {
      name: STUDENT_NAME,
      grade: 7,
      sectionId: sec.id,
      sectionName: 'A',
      rollNo: '7',
      admissionNo: null,
      guardianPhone: null,
      guardianName: null,
    })
    households.push(s.user.household_id)
    userIds.push(s.user.id)
    studentId = s.schoolStudent.id
    const t = await createSchoolTeacher(db, admin, { name: 'Outside Teacher', email: `ot-${tag}@school.test` })
    households.push(t.user.household_id)
    const so = await loadSchoolScope(db, t.user.id, schoolId, ['teacher'])
    if (!so.ok) throw new Error('scope')
    outsider = so.scope

    const paper = await db
      .insertInto('school_own_papers')
      .values({
        school_id: schoolId,
        class_id: cls.id,
        school_subject_id: ss.id,
        title: 'Marking test',
        source_kind: 'prepplan_exam',
        status: 'approved',
        phase: 'done',
        total_marks: '4',
        created_by_user_id: admin.userId,
      })
      .returning('id')
      .executeTakeFirstOrThrow()
    paperId = paper.id
    const mkq = async (position: number, o: { type: string; marks: number; key: string; options?: unknown; steps?: unknown }) =>
      (
        await db
          .insertInto('school_own_questions')
          .values({
            school_id: schoolId,
            paper_id: paperId,
            position,
            section: 'A',
            type: o.type,
            text: `Question ${position}`,
            original_text: `Question ${position}`,
            options: JSON.stringify(o.options ?? []),
            marks: String(o.marks),
            key_text: o.key,
            key_steps: JSON.stringify(o.steps ?? []),
            key_source: 'bank',
            key_status: 'approved',
          })
          .returning('id')
          .executeTakeFirstOrThrow()
      ).id
    q['1'] = await mkq(1, {
      type: 'mcq',
      marks: 1,
      key: 'Correct option: (B) twelve',
      options: ['A', 'B', 'C', 'D'].map((label) => ({ label, text: `opt ${label}` })),
    })
    q['2'] = await mkq(2, {
      type: 'short_answer',
      marks: 3,
      key: 'Because tenths are larger than hundredths.',
      steps: [
        { description: 'compares tenths', marks: 1 },
        { description: 'compares hundredths', marks: 1 },
        { description: 'concludes', marks: 1 },
      ],
    })
  })

  afterAll(async () => {
    const ids = [schoolId]
    await deleteTestCredentials(userIds)
    for (const t of ['school_answer_marks', 'school_sheet_marking', 'school_own_sheets', 'school_own_questions', 'school_own_papers'] as const)
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

  it('has nothing to mark until the student has pages', async () => {
    const { ai } = scripted([[]])
    await expect(markStudentSheets(db, admin, paperId, studentId, ai)).rejects.toThrow(/no pages to mark/)
  })

  it('a page still waiting for the teacher blocks the marking', async () => {
    const waiting = await putPage(1, 'needs_confirm')
    const { ai } = scripted([[]])
    await expect(markStudentSheets(db, admin, paperId, studentId, ai)).rejects.toThrow(/waiting for your yes/)
    await db.updateTable('school_own_sheets').set({ check_state: 'passed' }).where('id', '=', waiting.id).execute()
  })

  it('two agreeing passes: marked, multiple choice from the key, nothing flagged, totals worked out', async () => {
    const { ai, sent } = scripted([[answer('1', { choice: 'B', marks: 0 }), answer('2', { marks: 2, loss_kind: 'writing_habit', loss_reason: 'stopped early' })]])
    const r = await markStudentSheets(db, admin, paperId, studentId, ai)
    expect(r).toMatchObject({ status: 'marked', totalMarks: 3, maxMarks: 4, flagged: 0 })
    expect(sent).toHaveLength(2)
    const v = await studentMarking(db, admin, paperId, studentId)
    expect(v.status).toBe('marked')
    expect(v.answers[0]).toMatchObject({ finalMarks: 1, state: 'ai_final', lossKind: 'none' })
    expect(v.answers[1]).toMatchObject({ finalMarks: 2, lossKind: 'writing_habit', lossReason: 'stopped early' })
  })

  it('the AI is never sent the student name, roll number or ID; the name strip of the first page is white', async () => {
    const { ai, sent } = scripted([[answer('1', { choice: 'B' }), answer('2', { marks: 3 })]])
    await markStudentSheets(db, admin, paperId, studentId, ai)
    const everything = JSON.stringify(sent.map((s) => s.qs))
    expect(everything).not.toContain(STUDENT_NAME)
    expect(everything).not.toContain(studentId)
    expect(everything).not.toContain('Roll')
    const first = await sharp(Buffer.from(sent[0].pages[0].base64, 'base64')).raw().toBuffer({ resolveWithObject: true })
    // the dark bar drawn in the top strip of the test page is gone: every pixel in the strip is white
    const { data, info } = first
    const stripRows = Math.round(info.height * 0.1)
    let darkest = 255
    for (let i = 0; i < stripRows * info.width * info.channels; i++) darkest = Math.min(darkest, data[i])
    expect(darkest).toBeGreaterThan(240)
  })

  it('the stronger third reading is asked only about the answer the two readings did not settle, and settles it', async () => {
    const calls: Array<{ qs: Array<string>; tieBreak: boolean }> = []
    const script = [
      [answer('1', { choice: 'B' }), answer('2', { marks: 1 })],
      [answer('1', { choice: 'B' }), answer('2', { marks: 2 })],
      [answer('2', { marks: 2 })],
    ]
    const ai: MarkingAi = {
      available: () => true,
      markPass: (input) => {
        calls.push({ qs: input.questions.map((one) => one.no), tieBreak: input.tieBreak === true })
        return Promise.resolve(JSON.stringify({ answers: script[calls.length - 1] }))
      },
    }
    const r = await markStudentSheets(db, admin, paperId, studentId, ai)
    expect(calls).toEqual([
      { qs: ['1', '2'], tieBreak: false },
      { qs: ['1', '2'], tieBreak: false },
      { qs: ['2'], tieBreak: true },
    ])
    expect(r).toMatchObject({ status: 'marked', flagged: 0 })
    const v = await studentMarking(db, admin, paperId, studentId)
    expect(v.answers[1]).toMatchObject({ finalMarks: 2, state: 'ai_final' })
  })

  it('passes that disagree flag the answer; the teacher resolves it, the total follows, and it is logged', async () => {
    const { ai } = scripted([
      [answer('1', { choice: 'B' }), answer('2', { marks: 1 })],
      [answer('1', { choice: 'B' }), answer('2', { marks: 3 })],
      [answer('1', { choice: 'B' }), answer('2', { marks: 2 })],
    ])
    const r = await markStudentSheets(db, admin, paperId, studentId, ai)
    expect(r).toMatchObject({ status: 'needs_teacher', flagged: 1 })
    const v = await studentMarking(db, admin, paperId, studentId)
    const flagged = v.answers[1]
    expect(flagged).toMatchObject({ state: 'flagged', finalMarks: 2 })
    expect(flagged.flagReason).toContain('1, 2, 3 out of 3')
    await expect(setAnswerMark(db, admin, flagged.answerMarkId!, 2.7, 'x')).rejects.toThrow(/half a mark/)
    await expect(setAnswerMark(db, admin, flagged.answerMarkId!, 4, 'x')).rejects.toThrow(/from 0 to 3/)
    await expect(setAnswerMark(db, admin, flagged.answerMarkId!, 1, '  ')).rejects.toThrow(/why/)
    await expect(setAnswerMark(db, outsider, flagged.answerMarkId!, 1, 'no right')).rejects.toThrow()
    const done = await setAnswerMark(db, admin, flagged.answerMarkId!, 2.5, 'Shows both comparisons')
    expect(done).toEqual({ finalMarks: 2.5, studentStatus: 'marked' })
    const after = await studentMarking(db, admin, paperId, studentId)
    expect(after).toMatchObject({ status: 'marked', totalMarks: 3.5, maxMarks: 4 })
    expect(after.answers[1].state).toBe('teacher_set')
    const log = await db
      .selectFrom('audit_log')
      .select(['action', 'actor_user_id'])
      .where('school_id', '=', schoolId)
      .where('action', '=', 'school.mark_changed')
      .execute()
    expect(log).toHaveLength(1)
    expect(log[0].actor_user_id).toBe(admin.userId)
  })

  it('marking again after a re-upload replaces the AI marks and logs what they were', async () => {
    const { ai } = scripted([[answer('1', { choice: 'C' }), answer('2', { marks: 3 })]])
    const r = await markStudentSheets(db, admin, paperId, studentId, ai)
    expect(r).toMatchObject({ status: 'marked', totalMarks: 3, maxMarks: 4 })
    const v = await studentMarking(db, admin, paperId, studentId)
    expect(v.answers[0]).toMatchObject({ finalMarks: 0, lossKind: 'knowledge_gap' })
    const reruns = await db.selectFrom('audit_log').select('id').where('school_id', '=', schoolId).where('action', '=', 'school.marking_rerun').execute()
    expect(reruns.length).toBeGreaterThanOrEqual(1)
  })

  it('a teacher who does not teach this class cannot mark or read it', async () => {
    const { ai } = scripted([[]])
    await expect(markStudentSheets(db, outsider, paperId, studentId, ai)).rejects.toThrow()
    await expect(studentMarking(db, outsider, paperId, studentId)).rejects.toThrow()
  })

  it('a paper whose key is not approved is not marked', async () => {
    await db.updateTable('school_own_questions').set({ key_status: 'draft' }).where('id', '=', q['2']).execute()
    const { ai } = scripted([[]])
    await expect(markStudentSheets(db, admin, paperId, studentId, ai)).rejects.toThrow(/answer key is not approved/)
    await db.updateTable('school_own_questions').set({ key_status: 'approved' }).where('id', '=', q['2']).execute()
  })

  it('review screen: the place the AI found is stored, only staff of the class get the page, and each look is audited', async () => {
    const { ai } = scripted([[answer('1', { choice: 'B', page: 1, box: [0.1, 0.1, 0.9, 0.2] }), answer('2', { marks: 3, page: 99, box: [0.2, 0.2, 0.4, 0.3] })]])
    await markStudentSheets(db, admin, paperId, studentId, ai)
    const r = await reviewData(db, admin, paperId, studentId)
    expect(r.pageCount).toBeGreaterThan(0)
    expect(r.answers.find((a) => a.questionNo === '1')?.location).toEqual({ page: 1, box: [0.1, 0.1, 0.9, 0.2] })
    // a page that does not exist is dropped, never shown
    expect(r.answers.find((a) => a.questionNo === '2')?.location).toBeNull()
    expect(r.answers.find((a) => a.questionNo === '2')?.keySteps.length).toBeGreaterThan(0)
    // the page picture: the same one the AI saw, decrypted for staff only
    const img = await markingPageImage(db, admin, paperId, studentId, 1)
    expect(img.subarray(0, 4).toString('hex')).toBe('89504e47')
    await expect(markingPageImage(db, admin, paperId, studentId, 99)).rejects.toThrow(/could not find/)
    await expect(markingPageImage(db, admin, paperId, studentId, 0)).rejects.toThrow(/could not find/)
    await expect(markingPageImage(db, outsider, paperId, studentId, 1)).rejects.toThrow()
    await expect(reviewData(db, outsider, paperId, studentId)).rejects.toThrow()
    const asStudent = { ...admin, role: 'student' } as unknown as SchoolScope
    await expect(markingPageImage(db, asStudent, paperId, studentId, 1)).rejects.toThrow(/Only the school office and teachers/)
    await expect(reviewData(db, asStudent, paperId, studentId)).rejects.toThrow(/Only the school office and teachers/)
    const looks = await db.selectFrom('audit_log').select('id').where('school_id', '=', schoolId).where('action', '=', 'school.marking_page_viewed').execute()
    expect(looks.length).toBeGreaterThanOrEqual(1)
  })

  it('a teacher\'s marking note is saved, cleared, limited, shown to the AI and never mentions a student', async () => {
    const steps = [
      { description: 'compares tenths', marks: 1 },
      { description: 'compares hundredths', marks: 1 },
      { description: 'concludes', marks: 1 },
    ]
    const base = { answer: 'Because tenths are larger than hundredths.', steps }
    await setOwnKey(db, admin, paperId, q['2'], { ...base, approve: true, note: '  Accept any valid method; no marks off for a missing unit  ' })
    const saved = await db.selectFrom('school_own_questions').select('marking_note').where('id', '=', q['2']).executeTakeFirstOrThrow()
    expect(saved.marking_note).toBe('Accept any valid method; no marks off for a missing unit')
    // leaving the note out of a later save keeps it
    await setOwnKey(db, admin, paperId, q['2'], { ...base, approve: true })
    expect((await db.selectFrom('school_own_questions').select('marking_note').where('id', '=', q['2']).executeTakeFirstOrThrow()).marking_note).toContain('Accept any valid method')
    // the AI is sent it with the question
    const { ai, sent } = scripted([[answer('1', { choice: 'B' }), answer('2', { marks: 3 })]])
    await markStudentSheets(db, admin, paperId, studentId, ai)
    expect(sent[0].qs).toContain('Accept any valid method')
    expect(sent[0].qs).not.toContain(STUDENT_NAME)
    const qs = JSON.parse(sent[0].qs) as Array<{ id: string; no: string; text: string; marks: number; type: string; options: Array<{ label: string; text: string }>; keyText: string; keySteps: Array<{ description: string; marks: number }>; note?: string | null; orGroup: string | null }>
    const prompt = markingPrompt('Mathematics', 7, qs, 1)
    expect(prompt).toContain("Teacher's marking note (follow it): Accept any valid method")
    // a note is limited, and an empty text clears it
    await expect(setOwnKey(db, admin, paperId, q['2'], { ...base, note: 'x'.repeat(401) })).rejects.toThrow(/400/)
    await setOwnKey(db, admin, paperId, q['2'], { ...base, approve: true, note: '' })
    expect((await db.selectFrom('school_own_questions').select('marking_note').where('id', '=', q['2']).executeTakeFirstOrThrow()).marking_note).toBeNull()
  })

  it('a rubric key: criteria must add up, the AI is sent them, a draft rubric blocks marking, awards are clamped', async () => {
    const criteria = [
      { kind: 'concept', marks: 1, descriptor: 'names the idea', levels: [{ marks: 1, says: 'names it' }, { marks: 0, says: 'does not' }] },
      { kind: 'key_points', marks: 1, descriptor: 'gives two causes', levels: [] },
      { kind: 'conclusion', marks: 1, descriptor: 'ends with a conclusion', levels: [] },
    ]
    const base = { answer: 'Tenths are larger.' }
    // criteria that do not add up to the question's 3 marks are refused and nothing is saved
    await expect(setOwnKey(db, admin, paperId, q['2'], { ...base, criteria: criteria.slice(0, 2), approve: true })).rejects.toThrow(/add up to 2/)
    await expect(setOwnKey(db, admin, paperId, q['2'], { ...base, criteria: [{ ...criteria[0], kind: 'vibes' }, criteria[1], criteria[2]] })).rejects.toThrow(/kind/)
    // saved as a draft: marking is blocked until the teacher approves it
    await setOwnKey(db, admin, paperId, q['2'], { ...base, criteria })
    const { ai: blocked } = scripted([[]])
    await expect(markStudentSheets(db, admin, paperId, studentId, blocked)).rejects.toThrow(/answer key is not approved/)
    await setOwnKey(db, admin, paperId, q['2'], { ...base, criteria, approve: true })
    const row = await db.selectFrom('school_own_questions').select(['key_kind', 'key_steps']).where('id', '=', q['2']).executeTakeFirstOrThrow()
    expect(row.key_kind).toBe('rubric')
    expect(row.key_steps).toEqual([])
    // the AI is sent the criteria as the marking scheme, with the rule about language marks; a 5 for a 1-mark criterion is clamped
    const { ai, sent } = scripted([[answer('1', { choice: 'B' }), answer('2', { marks: 3, steps: [{ step: 1, awarded: 5 }, { step: 2, awarded: 1 }, { step: 3, awarded: 0.5 }] })]])
    await markStudentSheets(db, admin, paperId, studentId, ai)
    const qs = JSON.parse(sent[0].qs) as Array<{ no: string; keySteps: Array<{ description: string; marks: number }>; rubric?: boolean }>
    const two = qs.find((x) => x.no === '2')
    expect(two?.rubric).toBe(true)
    expect(two?.keySteps.map((k) => k.marks)).toEqual([1, 1, 1])
    expect(two?.keySteps[0].description).toContain('concept: names the idea')
    const prompt = markingPrompt('Social Science', 7, qs as never, 1)
    expect(prompt).toContain('criterion by criterion')
    const m = await db.selectFrom('school_answer_marks').select(['final_marks', 'steps']).where('own_question_id', '=', q['2']).executeTakeFirstOrThrow()
    expect(Number(m.final_marks)).toBeLessThanOrEqual(3)
    for (const st of m.steps as unknown as Array<{ awarded: number; max: number }>) expect(st.awarded).toBeLessThanOrEqual(st.max)
    // back to a working-steps key for the tests that follow
    await setOwnKey(db, admin, paperId, q['2'], { ...base, steps: [{ description: 'compares tenths', marks: 1 }, { description: 'compares hundredths', marks: 1 }, { description: 'concludes', marks: 1 }], approve: true })
    expect((await db.selectFrom('school_own_questions').select(['key_kind', 'key_criteria']).where('id', '=', q['2']).executeTakeFirstOrThrow())).toEqual({ key_kind: 'steps', key_criteria: [] })
  })

  it('an AI that is not set up gives a plain rejected result, not an error', async () => {
    const off: MarkingAi = { available: () => false, markPass: () => Promise.resolve('') }
    const r = await markStudentSheets(db, admin, paperId, studentId, off)
    expect(r.status).toBe('rejected')
    expect(r.message).toMatch(/not set up/)
  })

  it('pageForMarking only whitens the first page', async () => {
    const png = await sharp({ create: { width: 200, height: 200, channels: 3, background: '#000000' } }).png().toBuffer()
    const first = await sharp(Buffer.from((await pageForMarking(png, true)).base64, 'base64')).raw().toBuffer({ resolveWithObject: true })
    const later = await sharp(Buffer.from((await pageForMarking(png, false)).base64, 'base64')).raw().toBuffer({ resolveWithObject: true })
    expect(first.data[0]).toBeGreaterThan(240)
    expect(later.data[0]).toBeLessThan(15)
  })

  it('pageForMarking accepts a first page wider than 1400 px (a real phone photo)', async () => {
    const big = await sharp({ create: { width: 3000, height: 4000, channels: 3, background: '#000000' } }).jpeg().toBuffer()
    const out = await sharp(Buffer.from((await pageForMarking(big, true)).base64, 'base64')).raw().toBuffer({ resolveWithObject: true })
    expect(out.info.width).toBe(1400)
    expect(out.data[0]).toBeGreaterThan(240)
  })

  it('the marks are stored, one row per question', async () => {
    const rows = await db.selectFrom('school_answer_marks').select('id').where('school_id', '=', schoolId).execute()
    expect(rows).toHaveLength(2)
  })
})
