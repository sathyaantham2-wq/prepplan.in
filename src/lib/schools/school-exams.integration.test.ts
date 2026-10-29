import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createDb } from '../../db/connection'
import type { Db } from '../../db/connection'
import { schoolsRepository } from '../../db/repositories'
import type { SchoolScope } from '../../db/school-scope'
import {
  deleteSchoolTermsForTest,
  deleteTestCredentials,
  signInSchoolUserForTest,
} from '../../db/test-helpers'
import type { TestSession } from '../../db/test-helpers'
import { PDFDocument } from 'pdf-lib'
import sharp from 'sharp'
import QRCode from 'qrcode'
import { Route as ScanBatchesRoute } from '../../routes/api/schools/$schoolId/exams/$examId/scan-batches'
import { Route as ScansRoute } from '../../routes/api/schools/$schoolId/exams/$examId/scans'
import { Route as ScanSummaryRoute } from '../../routes/api/schools/$schoolId/exams/$examId/scan-summary'
import { Route as ScanAssignRoute } from '../../routes/api/schools/$schoolId/exams/$examId/scan-pages/$pageId/assign'
import { Route as AbsencesRoute } from '../../routes/api/schools/$schoolId/exams/$examId/absences'
import { Route as ScanImageRoute } from '../../routes/api/schools/$schoolId/scan-images/$pageId'
import { decryptScan } from '../scan-crypto'
import { buildBookletsHtml } from './booklet-html'
import { photograph, renderPagePngs } from './scan-test-support'
import type { PhotoOptions } from './scan-test-support'
import {
  assignScanPage,
  ingestScanPage,
  purgeScanData,
  scanSummary,
  setStudentAbsent,
  startScanBatch,
} from './scan-service'
import { Route as BookletsRoute } from '../../routes/api/schools/$schoolId/exams/$examId/booklets'
import { Route as BookletJobRoute } from '../../routes/api/schools/$schoolId/exams/$examId/booklet-jobs/$jobId'
import { Route as BookletResultRoute } from '../../routes/api/schools/$schoolId/exams/$examId/booklet-jobs/$jobId/result'
import { Route as QuestionPaperRoute } from '../../routes/api/schools/$schoolId/exams/$examId/question-paper'
import { Route as TeacherCopyRoute } from '../../routes/api/schools/$schoolId/exams/$examId/teacher-copy'
import { Route as ExamRoute } from '../../routes/api/schools/$schoolId/exams/$examId'
import { Route as ExamsRoute } from '../../routes/api/schools/$schoolId/exams'
import { countPdfPages } from '../pdf/page-count'
import { loadSchoolScope } from '../school-session'
import { bookletPageToken } from './booklet-token'
import { SchoolError } from './common'
import {
  bookletStudents,
  createExam,
  ensureBookletRecords,
  getExam,
  listExams,
  questionPaperHtml,
  renderBooklets,
  renderTeacherCopy,
  teacherCopyHtml,
} from './exam-service'
import { createSchoolStudent, createSchoolTeacher } from './people'
import {
  addSchoolSubject,
  assignTeacher,
  createClass,
  createSection,
} from './setup'
import { adoptDefaultTemplate, saveTemplate } from './template-service'
import { acceptSchoolTerms } from './terms'
import type { TemplateDefinition } from './templates'

type Handler = (o: {
  request: Request
  params: Record<string, string>
}) => Promise<Response>
const call = (
  route: { options: { server?: unknown } },
  method: string,
  cookie: string | null,
  params: Record<string, string>,
  body?: unknown,
) =>
  (route.options.server as { handlers: Record<string, Handler> }).handlers[
    method
  ]({
    request: new Request('http://localhost/x', {
      method,
      headers: {
        ...(cookie ? { cookie } : {}),
        'content-type': 'application/json',
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    }),
    params,
  })
async function refuses(p: Promise<unknown>, code: SchoolError['code']) {
  const e = await p.then(
    () => null,
    (err) => err,
  )
  expect(e, `expected ${code}`).toBeInstanceOf(SchoolError)
  expect((e as SchoolError).code).toBe(code)
}

const TINY: TemplateDefinition = {
  name: 'Tiny test, 25 marks',
  totalMarks: 25,
  durationMin: 45,
  levelMix: {
    recall_understanding: 40,
    application: 40,
    analysis_evaluation: 20,
  },
  sections: [
    {
      name: 'Section A — Multiple choice',
      kind: 'mcq',
      count: 6,
      marks: 1,
      orCount: 0,
    },
    {
      name: 'Section A — Multiple choice',
      kind: 'assertion_reason',
      count: 2,
      marks: 1,
      orCount: 0,
    },
    {
      name: 'Section B — Short answer (2 marks each)',
      kind: 'short_answer',
      count: 3,
      marks: 2,
      orCount: 1,
    },
    {
      name: 'Section C — Short answer (3 marks each)',
      kind: 'short_answer',
      count: 2,
      marks: 3,
      orCount: 0,
    },
    {
      name: 'Section D — Long answer (5 marks each)',
      kind: 'long_answer',
      count: 1,
      marks: 5,
      orCount: 0,
    },
  ],
}

/** S5: the exam paper, the teacher's copy and the answer booklets, and who may open them. Local test DB only. */
describe('exam papers, teacher copy and answer booklets (S5)', () => {
  let db: Db
  const tag = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  const schoolIds: Array<string> = []
  let schoolA: string
  let admin: SchoolScope
  let teacher: SchoolScope
  let subjectId: string
  let sourceId: string
  let secA: string
  let secB: string
  let tinyKey: string
  let cbseKey: string
  const chapter: Record<string, string> = {}
  let adminS: TestSession
  let teacherS: TestSession
  let otherTeacherS: TestSession
  let principalS: TestSession
  let parentS: TestSession
  let studentS: TestSession
  let outsiderS: TestSession
  const userIds: Array<string> = []
  const households: Array<string> = []
  const students: Array<{ id: string; admission: string; name: string }> = []

  async function addQuestions(
    conceptId: string,
    n: number,
    o: {
      type: string
      marks: number
      bloom: string
      tags?: Array<string>
      options?: boolean
    },
  ) {
    for (let i = 0; i < n; i++) {
      const q = await db
        .insertInto('questions')
        .values({
          concept_id: conceptId,
          board: 'CBSE',
          class: 7,
          bloom: o.bloom as never,
          difficulty: 'Easy',
          marks: o.marks,
          type: o.type as never,
          text: `Q ${tag} ${o.type} ${Math.random()}`,
          text_hash: `${tag}-${Math.random()}`,
          answer: `SECRET-ANSWER-${tag}-${Math.random()}`,
          status: 'approved',
          origin: 'manual',
          created_by: 'test',
          tags: o.tags ?? [],
        })
        .returning('id')
        .executeTakeFirstOrThrow()
      if (o.options) {
        for (const [i2, label] of ['A', 'B', 'C', 'D'].entries()) {
          await db
            .insertInto('question_options')
            .values({
              question_id: q.id,
              label,
              text:
                i2 === 0 ? `SECRET-CORRECT-${tag}-${q.id}` : `Option ${label}`,
              is_correct: i2 === 0,
              order_index: i2 + 1,
            })
            .execute()
        }
      } else if (o.marks >= 3) {
        await db
          .insertInto('question_step_marks')
          .values([
            {
              question_id: q.id,
              step_no: 1,
              description: 'SECRET-STEP method',
              marks: 1,
            },
            {
              question_id: q.id,
              step_no: 2,
              description: 'SECRET-STEP answer',
              marks: o.marks - 1,
            },
          ])
          .execute()
      }
    }
  }

  beforeAll(async () => {
    db = createDb()
    const mk = async (n: string) => {
      const p = await schoolsRepository.provision(db, {
        name: `Exam School ${n} ${tag}`,
        code: `ex-${n}-${tag}`,
        board: 'CBSE',
        adminName: `Admin ${n}`,
        adminEmail: `ex-${n}-${tag}@school.test`,
      })
      schoolIds.push(p.school.id)
      userIds.push(p.adminUserId)
      return p
    }
    const a = await mk('a')
    const b = await mk('b')
    schoolA = a.school.id
    const sa = await loadSchoolScope(db, a.adminUserId, schoolA, [
      'school_admin',
    ])
    if (!sa.ok) throw new Error('scope')
    admin = sa.scope
    await acceptSchoolTerms(db, admin)

    subjectId = (
      await db
        .insertInto('subjects')
        .values({
          board: 'CBSE',
          class: 7,
          code: `ZE-${tag}`,
          name: 'Exam Maths',
          language: 'en',
          is_active: true,
        })
        .returning('id')
        .executeTakeFirstOrThrow()
    ).id
    sourceId = (
      await db
        .insertInto('sources')
        .values({
          subject_id: subjectId,
          title: 'Exam Book',
          publisher: 'NCERT',
        })
        .returning('id')
        .executeTakeFirstOrThrow()
    ).id
    const mkChapter = async (
      part: string,
      no: number,
      name: string,
      concepts: number,
    ) => {
      const ch = await db
        .insertInto('chapters')
        .values({
          source_id: sourceId,
          subject_id: subjectId,
          part,
          chapter_no: no,
          name,
          order_index: no,
        })
        .returning('id')
        .executeTakeFirstOrThrow()
      const ids: Array<string> = []
      for (let i = 1; i <= concepts; i++)
        ids.push(
          (
            await db
              .insertInto('concepts')
              .values({
                chapter_id: ch.id,
                board: 'CBSE',
                class: 7,
                code: `ZE-${tag}-${part}${no}.${i}`,
                name: `${name} ${i}`,
                difficulty_base: 'Easy',
              })
              .returning('id')
              .executeTakeFirstOrThrow()
          ).id,
        )
      return { id: ch.id, concepts: ids }
    }
    const p1 = await mkChapter('I', 3, 'Fractions', 3)
    const p2 = await mkChapter('II', 3, 'Decimals', 1)
    chapter.p1 = p1.id
    chapter.p2 = p2.id
    await addQuestions(p1.concepts[0], 20, {
      type: 'mcq',
      marks: 1,
      bloom: 'Understand',
      options: true,
    })
    await addQuestions(p1.concepts[1], 6, {
      type: 'assertion_reason',
      marks: 1,
      bloom: 'Apply',
      options: true,
    })
    await addQuestions(p1.concepts[0], 8, {
      type: 'short_answer',
      marks: 2,
      bloom: 'Understand',
    })
    await addQuestions(p1.concepts[1], 6, {
      type: 'short_answer',
      marks: 2,
      bloom: 'Remember',
    })
    await addQuestions(p1.concepts[2], 8, {
      type: 'short_answer',
      marks: 3,
      bloom: 'Apply',
    })
    await addQuestions(p1.concepts[2], 4, {
      type: 'long_answer',
      marks: 5,
      bloom: 'Analyse',
    })
    await addQuestions(p2.concepts[0], 6, {
      type: 'mcq',
      marks: 1,
      bloom: 'Remember',
      options: true,
    })
    await addQuestions(p2.concepts[0], 3, {
      type: 'short_answer',
      marks: 2,
      bloom: 'Understand',
    })

    const cls = await createClass(db, admin, 7, '2026-27')
    secA = (await createSection(db, admin, cls.id, 'A')).id
    secB = (await createSection(db, admin, cls.id, 'B')).id
    const subj = await addSchoolSubject(db, admin, cls.id, subjectId)
    const t = await createSchoolTeacher(db, admin, {
      name: 'Maths Teacher',
      email: `mt-${tag}@school.test`,
    })
    const t2 = await createSchoolTeacher(db, admin, {
      name: 'Other Teacher',
      email: `ot-${tag}@school.test`,
    })
    const pr = await createSchoolTeacher(db, admin, {
      name: 'The Principal',
      email: `pr-${tag}@school.test`,
    })
    await db
      .updateTable('school_members')
      .set({ role: 'principal' })
      .where('id', '=', pr.member.id)
      .execute()
    const pa = await createSchoolTeacher(db, admin, {
      name: 'A Parent',
      email: `pa-${tag}@school.test`,
    })
    await db
      .updateTable('school_members')
      .set({ role: 'parent' })
      .where('id', '=', pa.member.id)
      .execute()
    await assignTeacher(db, admin, {
      memberId: t.member.id,
      sectionId: secA,
      schoolSubjectId: subj.id,
    })
    await assignTeacher(db, admin, {
      memberId: t.member.id,
      sectionId: secB,
      schoolSubjectId: subj.id,
    })
    households.push(
      t.user.household_id,
      t2.user.household_id,
      pr.user.household_id,
      pa.user.household_id,
    )
    const mkStudent = async (
      name: string,
      sec: string,
      secName: string,
      roll: string,
      adm: string | null,
    ) => {
      const s = await createSchoolStudent(db, admin, {
        name,
        grade: 7,
        sectionId: sec,
        sectionName: secName,
        rollNo: roll,
        admissionNo: adm,
        guardianPhone: null,
        guardianName: null,
      })
      households.push(s.user.household_id)
      userIds.push(s.user.id)
      students.push({
        id: s.schoolStudent.id,
        admission: s.schoolStudent.admission_no,
        name,
      })
      return s
    }
    const s1 = await mkStudent('Asha A', secA, 'A', '1', '2024/0101')
    await mkStudent('Ravi A', secA, 'A', '2', null)
    await mkStudent('Kiran B', secB, 'B', '1', '2024/0103')
    const ts = await loadSchoolScope(db, t.user.id, schoolA, ['teacher'])
    if (!ts.ok) throw new Error('scope')
    teacher = ts.scope
    tinyKey = (await saveTemplate(db, admin, { definition: TINY })).key
    cbseKey = (await adoptDefaultTemplate(db, admin, 'cbse_80')).key
    adminS = await signInSchoolUserForTest(a.adminUserId)
    teacherS = await signInSchoolUserForTest(t.user.id)
    otherTeacherS = await signInSchoolUserForTest(t2.user.id)
    principalS = await signInSchoolUserForTest(pr.user.id)
    parentS = await signInSchoolUserForTest(pa.user.id)
    studentS = await signInSchoolUserForTest(s1.user.id)
    outsiderS = await signInSchoolUserForTest(b.adminUserId)
    userIds.push(t.user.id, t2.user.id, pr.user.id, pa.user.id)
  })

  afterAll(async () => {
    const ids = schoolIds
    await deleteTestCredentials(userIds)
    await db
      .deleteFrom('school_print_job_parts')
      .where('school_id', 'in', ids)
      .execute()
    await db
      .deleteFrom('school_print_jobs')
      .where('school_id', 'in', ids)
      .execute()
    await db
      .deleteFrom('school_scan_pages')
      .where('school_id', 'in', ids)
      .execute()
    await db
      .deleteFrom('school_scan_batches')
      .where('school_id', 'in', ids)
      .execute()
    await db
      .deleteFrom('school_exam_absences')
      .where('school_id', 'in', ids)
      .execute()
    await db.deleteFrom('audit_log').where('school_id', 'in', ids).execute()
    await db
      .deleteFrom('school_booklet_pages')
      .where('school_id', 'in', ids)
      .execute()
    await db
      .deleteFrom('school_booklets')
      .where('school_id', 'in', ids)
      .execute()
    await db
      .deleteFrom('school_booklet_layouts')
      .where('school_id', 'in', ids)
      .execute()
    await db
      .deleteFrom('school_exam_questions')
      .where('school_id', 'in', ids)
      .execute()
    await db
      .deleteFrom('school_exam_sections')
      .where('school_id', 'in', ids)
      .execute()
    await db.deleteFrom('school_exams').where('school_id', 'in', ids).execute()
    await db
      .deleteFrom('school_paper_templates')
      .where('school_id', 'in', ids)
      .execute()
    await db
      .deleteFrom('school_student_guardians')
      .where('school_id', 'in', ids)
      .execute()
    await db
      .deleteFrom('school_students')
      .where('school_id', 'in', ids)
      .execute()
    await db.deleteFrom('students').where('school_id', 'in', ids).execute()
    await db
      .deleteFrom('school_teacher_assignments')
      .where('school_id', 'in', ids)
      .execute()
    await db
      .deleteFrom('school_subjects')
      .where('school_id', 'in', ids)
      .execute()
    await db
      .deleteFrom('school_sections')
      .where('school_id', 'in', ids)
      .execute()
    await db
      .deleteFrom('school_classes')
      .where('school_id', 'in', ids)
      .execute()
    await deleteSchoolTermsForTest(db, ids)
    const members = await db
      .selectFrom('school_members')
      .select('user_id')
      .where('school_id', 'in', ids)
      .execute()
    await db
      .deleteFrom('school_members')
      .where('school_id', 'in', ids)
      .execute()
    const sh = await db
      .selectFrom('schools')
      .select('household_id')
      .where('id', 'in', ids)
      .execute()
    await db.deleteFrom('schools').where('id', 'in', ids).execute()
    const mu = members.map((m) => m.user_id)
    const hh = await db
      .selectFrom('users')
      .select('household_id')
      .where('id', 'in', mu)
      .execute()
    await db.deleteFrom('users').where('id', 'in', mu).execute()
    await db
      .deleteFrom('households')
      .where('id', 'in', [
        ...sh.map((h) => h.household_id),
        ...hh.map((h) => h.household_id),
        ...households,
      ])
      .execute()
    const qs = await db
      .selectFrom('questions')
      .select('id')
      .where('text', 'like', `Q ${tag}%`)
      .execute()
    const qids = qs.map((q) => q.id)
    if (qids.length) {
      await db
        .deleteFrom('question_options')
        .where('question_id', 'in', qids)
        .execute()
      await db
        .deleteFrom('question_step_marks')
        .where('question_id', 'in', qids)
        .execute()
      await db.deleteFrom('questions').where('id', 'in', qids).execute()
    }
    await db
      .deleteFrom('concepts')
      .where('code', 'like', `ZE-${tag}%`)
      .execute()
    await db.deleteFrom('chapters').where('source_id', '=', sourceId).execute()
    await db.deleteFrom('sources').where('id', '=', sourceId).execute()
    await db.deleteFrom('subjects').where('id', '=', subjectId).execute()
    await db.destroy()
  })

  let examId = ''
  const input = () => ({
    title: 'Unit Test 1',
    subjectId,
    templateKey: tinyKey,
    chapterIds: [chapter.p1, chapter.p2],
    sectionIds: [secA, secB],
    examDate: '2026-11-20',
  })

  describe('making the paper', () => {
    it('one paper for the whole class: the right counts, continuous numbers, one box per OR, no repeats', async () => {
      examId = (await createExam(db, teacher, input())).id
      const qs = await db
        .selectFrom('school_exam_questions')
        .selectAll()
        .where('exam_id', '=', examId)
        .orderBy('position')
        .orderBy('is_alternate')
        .execute()
      const primaries = qs.filter((q) => !q.is_alternate)
      expect(primaries).toHaveLength(6 + 2 + 3 + 2 + 1)
      expect(primaries.map((q) => q.position)).toEqual(
        Array.from({ length: 14 }, (_, i) => i + 1),
      )
      expect(primaries.reduce((n, q) => n + q.marks, 0)).toBe(25)
      const alternates = qs.filter((q) => q.is_alternate)
      expect(alternates).toHaveLength(1) // Section B: one OR
      const partner = primaries.find(
        (q) => q.position === alternates[0].position,
      )!
      expect(partner.choice_group).toBe(alternates[0].choice_group)
      expect(partner.marks).toBe(alternates[0].marks)
      expect(new Set(qs.map((q) => q.question_id)).size).toBe(qs.length)
      // both chapters are used (the paper is spread over the chapters chosen)
      expect(new Set(qs.map((q) => q.chapter_id))).toEqual(
        new Set([chapter.p1, chapter.p2]),
      )
      const exam = await db
        .selectFrom('school_exams')
        .selectAll()
        .where('id', '=', examId)
        .executeTakeFirstOrThrow()
      expect(exam).toMatchObject({
        nominal_marks: 25,
        printed_marks: 25,
        status: 'draft',
      })
      expect(exam.teacher_copy_lines as unknown as Array<string>).toEqual([])
      const sections = await db
        .selectFrom('school_exam_sections')
        .select('section_id')
        .where('exam_id', '=', examId)
        .execute()
      expect(sections.map((s) => s.section_id).sort()).toEqual(
        [secA, secB].sort(),
      )
    })

    it('the layout is frozen with the exam: editing the template later changes nothing', async () => {
      await saveTemplate(db, admin, {
        key: tinyKey,
        definition: { ...TINY, name: 'Tiny test (edited)', durationMin: 99 },
      })
      const exam = await db
        .selectFrom('school_exams')
        .select(['template_name', 'layout'])
        .where('id', '=', examId)
        .executeTakeFirstOrThrow()
      expect(exam.template_name).toBe('Tiny test, 25 marks')
      expect(
        (exam.layout as unknown as { duration_min: number }).duration_min,
      ).toBe(45)
    })

    it("a paper the bank cannot fill is still made, and every gap is recorded for the teacher's copy", async () => {
      const id = (
        await createExam(db, admin, {
          ...input(),
          title: 'Half-yearly',
          templateKey: cbseKey,
        })
      ).id
      const exam = await db
        .selectFrom('school_exams')
        .selectAll()
        .where('id', '=', id)
        .executeTakeFirstOrThrow()
      expect(exam.nominal_marks).toBe(80)
      expect(exam.printed_marks).toBeLessThan(80)
      const lines = exam.teacher_copy_lines as unknown as Array<string>
      expect(lines.some((l) => /4-mark case study/.test(l))).toBe(true)
      const gaps = exam.shortfalls as unknown as Array<{
        marks_missing: number
        slot: string
      }>
      expect(gaps.reduce((n, g) => n + g.marks_missing, 0)).toBe(
        80 - exam.printed_marks,
      )
      expect(gaps.some((g) => g.slot === '4-mark case study')).toBe(true)
    })

    it('a bank question without its four options stops the paper with a plain message and saves nothing', async () => {
      const broken = await db
        .insertInto('chapters')
        .values({
          source_id: sourceId,
          subject_id: subjectId,
          part: 'I',
          chapter_no: 9,
          name: 'Broken',
          order_index: 9,
        })
        .returning('id')
        .executeTakeFirstOrThrow()
      const concept = await db
        .insertInto('concepts')
        .values({
          chapter_id: broken.id,
          board: 'CBSE',
          class: 7,
          code: `ZE-${tag}-broken`,
          name: 'broken',
          difficulty_base: 'Easy',
        })
        .returning('id')
        .executeTakeFirstOrThrow()
      await addQuestions(concept.id, 12, {
        type: 'mcq',
        marks: 1,
        bloom: 'Understand',
      }) // no options
      const before = (
        await db
          .selectFrom('school_exams')
          .select('id')
          .where('school_id', '=', schoolA)
          .execute()
      ).length
      const e = await createExam(db, admin, {
        ...input(),
        title: 'Broken bank',
        chapterIds: [broken.id],
      }).catch((err) => err as SchoolError)
      expect(e).toBeInstanceOf(SchoolError)
      expect((e as SchoolError).code).toBe('invalid')
      expect((e as SchoolError).message).toMatch(
        /a question in the bank is incomplete .*options/,
      )
      expect(
        (
          await db
            .selectFrom('school_exams')
            .select('id')
            .where('school_id', '=', schoolA)
            .execute()
        ).length,
      ).toBe(before)
    })

    it('refuses: no terms, a teacher who does not teach it, a chapter of another subject, mixed classes, a missing layout', async () => {
      await refuses(
        createExam(db, { ...teacher, pairs: [] }, input()),
        'not_found',
      )
      await refuses(
        createExam(db, { ...teacher, role: 'principal' }, input()),
        'forbidden',
      )
      await refuses(
        createExam(db, admin, { ...input(), chapterIds: [] }),
        'invalid',
      )
      await refuses(
        createExam(db, admin, {
          ...input(),
          chapterIds: [crypto.randomUUID()],
        }),
        'not_found',
      )
      await refuses(
        createExam(db, admin, { ...input(), templateKey: crypto.randomUUID() }),
        'not_found',
      )
      await refuses(
        createExam(db, admin, { ...input(), title: ' ' }),
        'invalid',
      )
      await refuses(
        createExam(db, admin, { ...input(), sectionIds: [] }),
        'invalid',
      )
    })
  })

  describe('what is printed', () => {
    it('the question paper has no answer, no correct option and no marking scheme', async () => {
      const { build } = await questionPaperHtml(db, teacher, examId)
      const html = build(3)
      expect(html).toMatch(/Q [0-9a-z-]+ (mcq|short_answer)/)
      expect(html).not.toContain('SECRET-ANSWER')
      expect(html).not.toContain('is_correct')
      expect(html).not.toContain('Correct option')
      expect(html).not.toContain('SECRET-STEP')
      expect(html).toContain('Option B') // the options themselves are printed
    })

    it('the teacher copy carries the answers, the marking steps, the banner and every gap', async () => {
      const full = await teacherCopyHtml(db, admin, examId)
      expect(full.html).toContain('TEACHER COPY — NOT FOR STUDENTS')
      expect(full.html).toContain('SECRET-ANSWER')
      expect(full.html).toContain('SECRET-STEP method')
      expect(full.html).toContain('Correct option')
      expect(full.html).toContain('Gaps in this paper:</strong> none')
      const halfYearly = (
        await db
          .selectFrom('school_exams')
          .select('id')
          .where('school_id', '=', schoolA)
          .where('title', '=', 'Half-yearly')
          .executeTakeFirstOrThrow()
      ).id
      const gappy = await teacherCopyHtml(db, admin, halfYearly)
      expect(gappy.html).toMatch(/Gaps in this paper \(\d+\)/)
      expect(gappy.html).toMatch(/4-mark case study/)
      expect(gappy.html).toContain('planned')
    })

    it('the teacher copy is a PDF', async () => {
      const { pdf } = await renderTeacherCopy(db, teacher, examId)
      expect(pdf.subarray(0, 4).toString()).toBe('%PDF')
      expect(countPdfPages(pdf)).toBeGreaterThanOrEqual(1)
    }, 60_000)

    it('the answer booklets: one per student, every page numbered, and the page count checks out', async () => {
      const r = await renderBooklets(db, teacher, examId, { sectionId: secA })
      const layout = await db
        .selectFrom('school_booklet_layouts')
        .select('page_count')
        .where('exam_id', '=', examId)
        .executeTakeFirstOrThrow()
      expect(r.students).toBe(2)
      expect(r.pages).toBe(layout.page_count * 2)
      expect(countPdfPages(r.pdf)).toBe(layout.page_count * 2)
      const pages = await db
        .selectFrom('school_booklet_pages')
        .select(['token', 'page_no', 'booklet_id'])
        .execute()
      const mine = pages.filter((p) => p.token.length === 26)
      expect(mine.length).toBeGreaterThanOrEqual(layout.page_count * 2)
      expect(new Set(pages.map((p) => p.token)).size).toBe(pages.length)
      const booklets = await db
        .selectFrom('school_booklets')
        .select(['id', 'school_student_id'])
        .where('exam_id', '=', examId)
        .execute()
      expect(booklets).toHaveLength(2)
      const first = booklets[0]
      const rows = pages
        .filter((p) => p.booklet_id === first.id)
        .sort((a, b) => a.page_no - b.page_no)
      expect(rows.map((p) => p.page_no)).toEqual(
        Array.from({ length: layout.page_count }, (_, i) => i + 1),
      )
      rows.forEach((p) =>
        expect(p.token).toBe(
          bookletPageToken({
            schoolId: schoolA,
            examId,
            schoolStudentId: first.school_student_id,
            page: p.page_no,
          }),
        ),
      )
      expect(
        (
          await db
            .selectFrom('school_exams')
            .select('status')
            .where('id', '=', examId)
            .executeTakeFirstOrThrow()
        ).status,
      ).toBe('booklets_ready')
    }, 90_000)

    it('printing again, or for one student, reuses the same pages and codes', async () => {
      const before = (
        await db.selectFrom('school_booklet_pages').select('id').execute()
      ).length
      const again = await renderBooklets(db, teacher, examId, {
        sectionId: secA,
      })
      const one = await renderBooklets(db, teacher, examId, {
        schoolStudentId: students[0].id,
      })
      expect(again.students).toBe(2)
      expect(one.students).toBe(1)
      expect(
        (await db.selectFrom('school_booklet_pages').select('id').execute())
          .length,
      ).toBe(before)
      // a section that is not part of the exam, or a student who is not in the chosen section, is refused
      await refuses(
        renderBooklets(db, teacher, examId, { sectionId: crypto.randomUUID() }),
        'not_found',
      )
      await refuses(
        renderBooklets(db, teacher, examId, {
          sectionId: secA,
          schoolStudentId: students[2].id,
        }),
        'invalid',
      )
    }, 120_000)

    it('a student who has left the school gets no booklet', async () => {
      await db
        .updateTable('school_students')
        .set({ status: 'left' })
        .where('id', '=', students[1].id)
        .execute()
      const r = await renderBooklets(db, teacher, examId, { sectionId: secA })
      expect(r.students).toBe(1)
      await db
        .updateTable('school_students')
        .set({ status: 'active' })
        .where('id', '=', students[1].id)
        .execute()
    }, 60_000)
  })

  describe('who can open what (students never can)', () => {
    const p = () => ({ schoolId: schoolA, examId })
    const statusOf = async (
      route: { options: { server?: unknown } },
      method: string,
      s: TestSession | null,
    ) =>
      (
        await call(
          route,
          method,
          s?.cookie ?? null,
          p(),
          method === 'POST' ? {} : undefined,
        )
      ).status

    it('a student is refused everything, including the question paper', async () => {
      for (const route of [QuestionPaperRoute, TeacherCopyRoute, ExamRoute])
        expect(await statusOf(route, 'GET', studentS)).toBe(403)
      expect(await statusOf(BookletsRoute, 'POST', studentS)).toBe(403)
      expect(
        (await call(ExamsRoute, 'GET', studentS.cookie, { schoolId: schoolA }))
          .status,
      ).toBe(403)
      expect(
        (
          await call(
            ExamsRoute,
            'POST',
            studentS.cookie,
            { schoolId: schoolA },
            { title: 'x', subject_id: subjectId, template_key: tinyKey },
          )
        ).status,
      ).toBe(403)
    })
    it('a parent is refused everything', async () => {
      for (const route of [QuestionPaperRoute, TeacherCopyRoute, ExamRoute])
        expect(await statusOf(route, 'GET', parentS)).toBe(403)
      expect(await statusOf(BookletsRoute, 'POST', parentS)).toBe(403)
    })
    it('nobody signed in gets 401; another school gets 404; a teacher of another subject gets 404', async () => {
      for (const route of [QuestionPaperRoute, TeacherCopyRoute, ExamRoute]) {
        expect(await statusOf(route, 'GET', null)).toBe(401)
        expect(await statusOf(route, 'GET', outsiderS)).toBe(404)
        expect(await statusOf(route, 'GET', otherTeacherS)).toBe(404)
      }
      expect(await statusOf(BookletsRoute, 'POST', otherTeacherS)).toBe(404)
      expect(await statusOf(BookletsRoute, 'POST', outsiderS)).toBe(404)
    })
    it('the principal may open the question paper but not the teacher copy or the booklets', async () => {
      const paper = await call(
        QuestionPaperRoute,
        'GET',
        principalS.cookie,
        p(),
      )
      expect(paper.status).toBe(200)
      expect(paper.headers.get('content-type')).toBe('application/pdf')
      expect(await statusOf(TeacherCopyRoute, 'GET', principalS)).toBe(403)
      expect(await statusOf(BookletsRoute, 'POST', principalS)).toBe(403)
    }, 60_000)
    it('the teacher of the subject and the office can; the files are PDFs that are never cached', async () => {
      for (const s of [teacherS, adminS]) {
        const copy = await call(TeacherCopyRoute, 'GET', s.cookie, p())
        expect(copy.status).toBe(200)
        expect(copy.headers.get('cache-control')).toBe('private, no-store')
        expect(
          Buffer.from(await copy.arrayBuffer())
            .subarray(0, 4)
            .toString(),
        ).toBe('%PDF')
      }
      // booklets are printed in batches: start, step until done, then one joined PDF
      const started = await call(BookletsRoute, 'POST', teacherS.cookie, p(), {
        section_id: secA,
        batch_size: 1,
      })
      expect(started.status).toBe(200)
      let job = (await started.json()) as {
        jobId: string
        status: string
        total: number
        done: number
        ready: boolean
        batches: { total: number }
      }
      expect(job).toMatchObject({
        status: 'running',
        total: 2,
        done: 0,
        ready: false,
      })
      expect(job.batches.total).toBe(2)
      const jp = () => ({ ...p(), jobId: job.jobId })
      expect(
        (await call(BookletResultRoute, 'GET', teacherS.cookie, jp())).status,
      ).toBe(409) // not ready yet
      for (let i = 0; i < 5 && job.status === 'running'; i++) {
        const r = await call(BookletJobRoute, 'POST', teacherS.cookie, jp())
        expect(r.status).toBe(200)
        job = { ...job, ...((await r.json()) as typeof job) }
      }
      expect(job).toMatchObject({ status: 'done', done: 2, ready: true })
      const result = await call(BookletResultRoute, 'GET', adminS.cookie, jp())
      expect(result.status).toBe(200)
      expect(result.headers.get('cache-control')).toBe('private, no-store')
      const pdf = Buffer.from(await result.arrayBuffer())
      expect(pdf.subarray(0, 4).toString()).toBe('%PDF')
      expect((await PDFDocument.load(pdf)).getPageCount()).toBe(
        (
          await db
            .selectFrom('school_booklet_layouts')
            .select('page_count')
            .where('exam_id', '=', examId)
            .executeTakeFirstOrThrow()
        ).page_count * 2,
      )
      // the batch files are dropped once joined; only the joined PDF stays
      const left = await db
        .selectFrom('school_print_job_parts')
        .select('pdf')
        .where('job_id', '=', job.jobId)
        .execute()
      expect(left.every((r) => r.pdf === null)).toBe(true)
      // a job cannot be read by another school or by a teacher of another subject
      for (const s of [outsiderS, otherTeacherS]) {
        expect(
          (await call(BookletJobRoute, 'GET', s.cookie, jp())).status,
        ).toBe(404)
        expect(
          (await call(BookletResultRoute, 'GET', s.cookie, jp())).status,
        ).toBe(404)
      }
      expect(
        (await call(BookletJobRoute, 'GET', principalS.cookie, jp())).status,
      ).toBe(403)
      expect((await call(BookletJobRoute, 'GET', null, jp())).status).toBe(401)
    }, 90_000)
    it('the exam detail never carries a question, an answer or a marking step', async () => {
      const res = await call(ExamRoute, 'GET', teacherS.cookie, p())
      const text = await res.text()
      expect(res.status).toBe(200)
      expect(text).not.toContain('SECRET')
      expect(text).not.toMatch(/"text"|"answer"|is_correct/)
      expect(JSON.parse(text)).toMatchObject({
        title: 'Unit Test 1',
        printedMarks: 25,
        mayHandle: true,
      })
    })
    it('lists: the office sees every exam, the right teacher sees theirs, the other teacher none', async () => {
      expect((await listExams(db, admin)).map((e) => e.title).sort()).toEqual([
        'Half-yearly',
        'Unit Test 1',
      ])
      expect((await listExams(db, teacher)).length).toBe(2)
      const otherScope = await loadSchoolScope(
        db,
        (
          await db
            .selectFrom('users')
            .select('id')
            .where('email', '=', `ot-${tag}@school.test`)
            .executeTakeFirstOrThrow()
        ).id,
        schoolA,
        ['teacher'],
      )
      if (!otherScope.ok) throw new Error('scope')
      expect(await listExams(db, otherScope.scope)).toEqual([])
      await refuses(getExam(db, otherScope.scope, examId), 'not_found')
    })
  })

  /** S6: photographed answer booklets come back and are sorted by the code on each page. */
  describe('scan intake (S6)', () => {
    let halfYearlyId = ''
    let bExamId = ''
    let bAdmin: SchoolScope
    let bStudentName = ''
    // pristine page images, by "Student name|page"
    const pngs = new Map<string, Buffer>()
    let pc = 0 // pages in a booklet
    let all: Array<number> = []
    let ashaId = ''
    let raviId = ''

    async function renderFor(
      scope: SchoolScope,
      exId: string,
      sectionId: string,
      prefix = '',
    ) {
      const { students: rows, manifest } = await bookletStudents(
        db,
        scope,
        exId,
        { sectionId },
      )
      await ensureBookletRecords(db, scope, exId, rows, manifest)
      const exam = await db
        .selectFrom('school_exams')
        .select('title')
        .where('id', '=', exId)
        .executeTakeFirstOrThrow()
      const tokens = new Map<string, Array<string>>()
      for (const r of rows) {
        const b = await db
          .selectFrom('school_booklets')
          .select('id')
          .where('exam_id', '=', exId)
          .where('school_student_id', '=', r.school_student_id)
          .executeTakeFirstOrThrow()
        const pages = await db
          .selectFrom('school_booklet_pages')
          .select(['page_no', 'token'])
          .where('booklet_id', '=', b.id)
          .orderBy('page_no')
          .execute()
        tokens.set(
          r.school_student_id,
          pages.map((x) => x.token),
        )
      }
      const html = await buildBookletsHtml({
        schoolName: 'Test School',
        examTitle: exam.title,
        subjectName: 'Maths',
        className: 'Class 7',
        durationMin: 45,
        totalMarks: 25,
        manifest,
        students: rows.map((r) => ({
          name: r.name,
          admissionNo: r.admission_no,
          rollNo: r.roll_no,
          sectionName: r.section_name,
          tokens: tokens.get(r.school_student_id) ?? [],
        })),
      })
      const images = await renderPagePngs(html)
      rows.forEach((r, i) => {
        for (let p = 0; p < manifest.pageCount; p++)
          pngs.set(
            `${prefix}${r.name}|${p + 1}`,
            images[i * manifest.pageCount + p],
          )
      })
      return { rows, manifest }
    }
    const photo = async (name: string, page: number, o: PhotoOptions = {}) =>
      photograph(pngs.get(`${name}|${page}`)!, {
        seed: page + name.length,
        ...o,
      })
    const upload = async (
      name: string,
      page: number,
      o: PhotoOptions = {},
      extra: { replace?: boolean; batchId?: string } = {},
    ) =>
      ingestScanPage(db, teacher, examId, {
        bytes: await photo(name, page, o),
        name: `${name}-${page}.jpg`,
        ...extra,
      })
    const row = async (st: string) =>
      (await scanSummary(db, teacher, examId)).students.find(
        (r) => r.name === st,
      )!
    const base64 = async (name: string, page: number) =>
      (await photo(name, page)).toString('base64')

    beforeAll(async () => {
      halfYearlyId = (
        await db
          .selectFrom('school_exams')
          .select('id')
          .where('school_id', '=', schoolA)
          .where('title', '=', 'Half-yearly')
          .executeTakeFirstOrThrow()
      ).id
      const { rows, manifest } = await renderFor(teacher, examId, secA)
      pc = manifest.pageCount
      all = Array.from({ length: pc }, (_, i) => i + 1)
      ashaId = rows.find((r) => r.name === 'Asha A')!.school_student_id
      raviId = rows.find((r) => r.name === 'Ravi A')!.school_student_id
      await renderFor(admin, halfYearlyId, secA, 'HY:') // a booklet of another exam of the same school

      // another school with its own exam and student
      const bId = schoolIds[1]
      const bMember = await db
        .selectFrom('school_members')
        .select('user_id')
        .where('school_id', '=', bId)
        .where('role', '=', 'school_admin')
        .executeTakeFirstOrThrow()
      const bs = await loadSchoolScope(db, bMember.user_id, bId, [
        'school_admin',
      ])
      if (!bs.ok) throw new Error('scope')
      bAdmin = bs.scope
      await acceptSchoolTerms(db, bAdmin)
      const cls = await createClass(db, bAdmin, 7, '2026-27')
      const sec = await createSection(db, bAdmin, cls.id, 'A')
      await addSchoolSubject(db, bAdmin, cls.id, subjectId)
      const st = await createSchoolStudent(db, bAdmin, {
        name: 'Bela Other',
        grade: 7,
        sectionId: sec.id,
        sectionName: 'A',
        rollNo: '1',
        admissionNo: 'B-1',
        guardianPhone: null,
        guardianName: null,
      })
      households.push(st.user.household_id)
      userIds.push(st.user.id)
      bStudentName = 'Bela Other'
      const tpl = await saveTemplate(db, bAdmin, { definition: TINY })
      bExamId = (
        await createExam(db, bAdmin, {
          title: 'Other school exam',
          subjectId,
          templateKey: tpl.key,
          chapterIds: [chapter.p1, chapter.p2],
          sectionIds: [sec.id],
        })
      ).id
      await renderFor(bAdmin, bExamId, sec.id)
    }, 240_000)

    it('whole booklet in any order, upside down, tilted, in shadow: every page lands on the right student and page', async () => {
      const { batchId } = await startScanBatch(db, teacher, examId)
      // every page, in a scrambled order (odd pages from the end, then even ones)
      const order = [
        ...all.filter((n) => n % 2 === 1).reverse(),
        ...all.filter((n) => n % 2 === 0),
      ]
      const looks: Array<PhotoOptions> = [
        { rotate: 180 },
        { rotate: 8, perspective: 0.5 },
        { shadow: true, rotate: -4 },
        { rotate: 90, blur: 1, noise: 8 },
      ]
      for (const [i, page] of order.entries()) {
        const r = await upload('Asha A', page, looks[i % looks.length], {
          batchId,
        })
        expect(r).toMatchObject({
          status: 'matched',
          student: 'Asha A',
          pageNo: page,
        })
      }
      const asha = await row('Asha A')
      expect(asha).toMatchObject({
        state: 'complete',
        received: all,
        missing: [],
        duplicates: [],
      })
      expect(asha.pages).toHaveLength(pc)
      expect((await row('Ravi A')).state).toBe('none')
    }, 180_000)

    it('the same page twice is kept aside as a duplicate; a re-upload may replace the first', async () => {
      const dup = await upload('Asha A', 2)
      expect(dup.status).toBe('duplicate')
      expect(dup.message).toMatch(/Already received/)
      let asha = await row('Asha A')
      expect(asha.received).toEqual(all)
      expect(asha.duplicates).toEqual([{ pageNo: 2, count: 1 }])
      const rep = await upload('Asha A', 3, { rotate: 2 }, { replace: true })
      expect(rep.status).toBe('matched')
      expect(rep.message).toMatch(/Replaced/)
      asha = await row('Asha A')
      expect(asha.received).toEqual(all)
      expect(asha.duplicates).toEqual([
        { pageNo: 2, count: 1 },
        { pageNo: 3, count: 1 },
      ])
    }, 120_000)

    it('missing pages are listed per student', async () => {
      for (const page of all.filter((n) => n !== 3))
        await upload('Ravi A', page, { rotate: page * 3 })
      const ravi = await row('Ravi A')
      expect(ravi).toMatchObject({
        state: 'missing',
        received: all.filter((n) => n !== 3),
        missing: [3],
      })
      const sum = await scanSummary(db, teacher, examId)
      expect(sum.totals).toMatchObject({
        students: 3, // the exam covers both sections: Kiran has sent nothing yet
        complete: 1,
        missing: 1,
        absent: 0,
        none: 1,
      })
    }, 120_000)

    it('a page whose code cannot be read waits; the teacher says which page it is; a taken slot needs “replace”', async () => {
      const blank = await sharp({
        create: {
          width: 900,
          height: 1200,
          channels: 3,
          background: '#e5e0d4',
        },
      })
        .jpeg()
        .toBuffer()
      const r = await ingestScanPage(db, teacher, examId, {
        bytes: blank,
        name: 'smudged.jpg',
      })
      expect(r.status).toBe('unreadable')
      expect((await scanSummary(db, teacher, examId)).totals.unmatched).toBe(1)
      await refuses(
        assignScanPage(db, teacher, examId, r.pageId!, {
          schoolStudentId: ashaId,
          pageNo: 2,
        }),
        'conflict',
      )
      await refuses(
        assignScanPage(db, teacher, examId, r.pageId!, {
          schoolStudentId: raviId,
          pageNo: 9,
        }),
        'invalid',
      )
      const ok = await assignScanPage(db, teacher, examId, r.pageId!, {
        schoolStudentId: raviId,
        pageNo: 3,
      })
      expect(ok).toMatchObject({
        status: 'manual',
        student: 'Ravi A',
        pageNo: 3,
      })
      expect(await row('Ravi A')).toMatchObject({
        state: 'complete',
        missing: [],
      })
      expect((await scanSummary(db, teacher, examId)).totals.unmatched).toBe(0)
      await refuses(
        assignScanPage(db, teacher, examId, r.pageId!, {
          schoolStudentId: raviId,
          pageNo: 3,
        }),
        'conflict',
      ) // no longer unreadable
      const audit = await db
        .selectFrom('audit_log')
        .select('action')
        .where('school_id', '=', schoolA)
        .where('action', '=', 'school.scan_page_assigned')
        .execute()
      expect(audit.length).toBeGreaterThan(0)
    }, 60_000)

    it('a re-upload of one page, with no readable code and the student and page named, is saved on that page', async () => {
      const blank = await sharp({
        create: {
          width: 900,
          height: 1200,
          channels: 3,
          background: '#dcd6c8',
        },
      })
        .jpeg()
        .toBuffer()
      const r = await ingestScanPage(db, teacher, examId, {
        bytes: blank,
        replace: true,
        target: { schoolStudentId: raviId, pageNo: 3 },
      })
      expect(r).toMatchObject({
        status: 'manual',
        student: 'Ravi A',
        pageNo: 3,
      })
      expect((await row('Ravi A')).duplicates).toEqual([
        { pageNo: 3, count: 1 },
      ])
    }, 60_000)

    it('pages of another exam and another school are rejected with a plain reason and no picture or student is stored', async () => {
      const wrongExam = await ingestScanPage(db, teacher, halfYearlyId, {
        bytes: await photograph(pngs.get('Asha A|2')!, { rotate: 5 }),
      })
      expect(wrongExam.status).toBe('rejected')
      expect(wrongExam.message).toMatch(
        /different exam .*Unit Test 1.*not .*Half-yearly/,
      )
      const wrongSchool = await ingestScanPage(db, teacher, examId, {
        bytes: await photograph(pngs.get(`${bStudentName}|1`)!, { rotate: -6 }),
      })
      expect(wrongSchool.status).toBe('rejected')
      expect(wrongSchool.message).toMatch(/different school/)
      expect(wrongSchool.message).not.toContain(bStudentName)
      const kept = await db
        .selectFrom('school_scan_pages')
        .select(['image', 'booklet_id', 'page_no'])
        .where('id', 'in', [wrongExam.pageId!, wrongSchool.pageId!])
        .execute()
      expect(kept).toHaveLength(2)
      for (const k of kept)
        expect(k).toMatchObject({
          image: null,
          booklet_id: null,
          page_no: null,
        })
      // school B has no scan rows from this
      expect(
        await db
          .selectFrom('school_scan_pages')
          .select('id')
          .where('school_id', '=', schoolIds[1])
          .execute(),
      ).toEqual([])
      // and a code that looks right but was never printed
      const fake = await QRCode.toString(
        'PPB1-' + 'ABCDEFGHJKMNPQRSTUVWXYZ234'.slice(0, 26),
        { type: 'svg', margin: 2 },
      )
      const png = await sharp(Buffer.from(fake))
        .resize(700, 700)
        .flatten({ background: '#fff' })
        .png()
        .toBuffer()
      const fakeRes = await ingestScanPage(db, teacher, examId, { bytes: png })
      expect(fakeRes.status).toBe('rejected')
      expect(fakeRes.message).toMatch(/not from a PrepPlan answer booklet/)
      // a file that is not a picture at all
      const junk = await ingestScanPage(db, teacher, examId, {
        bytes: Buffer.from('hello'),
      })
      expect(junk.status).toBe('rejected')
      await expect(
        ingestScanPage(db, teacher, examId, { bytes: Buffer.alloc(0) }),
      ).rejects.toBeInstanceOf(SchoolError)
    }, 120_000)

    it('pictures are stored only encrypted, and come back only through a signed, unexpired link for staff of the subject', async () => {
      const sum = await scanSummary(db, teacher, examId)
      const pg = sum.students.find((r) => r.name === 'Asha A')!.pages[0]
      const stored = await db
        .selectFrom('school_scan_pages')
        .select('image')
        .where('id', '=', pg.pageId)
        .executeTakeFirstOrThrow()
      expect(stored.image).not.toBeNull()
      const raw = stored.image as Buffer
      expect(raw.includes(Buffer.from([0xff, 0xd8, 0xff]))).toBe(false) // no plain JPEG inside
      const plain = decryptScan(raw)
      expect(plain.subarray(0, 3).toString('hex')).toBe('ffd8ff')
      const q = new URL(pg.url, 'http://x').searchParams
      const get = (cookie: string | null, url = pg.url) => {
        const u = new URL(url, 'http://x')
        return (
          ScanImageRoute.options.server as { handlers: Record<string, Handler> }
        ).handlers.GET({
          request: new Request(u, { headers: cookie ? { cookie } : {} }),
          params: { schoolId: schoolA, pageId: pg.pageId },
        })
      }
      const ok = await get(teacherS.cookie)
      expect(ok.status).toBe(200)
      expect(ok.headers.get('content-type')).toBe('image/jpeg')
      expect(ok.headers.get('cache-control')).toBe('private, no-store')
      expect((await ok.arrayBuffer()).byteLength).toBeGreaterThan(1000)
      expect((await get(adminS.cookie)).status).toBe(200)
      expect((await get(null)).status).toBe(401)
      expect(
        (
          await get(
            teacherS.cookie,
            `${pg.url.split('?')[0]}?exp=${q.get('exp')}&sig=nope`,
          )
        ).status,
      ).toBe(404)
      expect(
        (
          await get(
            teacherS.cookie,
            `${pg.url.split('?')[0]}?exp=1&sig=${q.get('sig')}`,
          )
        ).status,
      ).toBe(404)
      for (const s of [outsiderS, otherTeacherS])
        expect((await get(s.cookie)).status).toBe(404)
      expect((await get(principalS.cookie)).status).toBe(403)
      for (const s of [studentS, parentS])
        expect([403, 404]).toContain((await get(s.cookie)).status)
    }, 60_000)

    it('a student marked absent is not chased; marking is refused once pages arrived; a page arriving clears it', async () => {
      const kiran = (
        await db
          .selectFrom('school_students as ss')
          .innerJoin('students as st', 'st.id', 'ss.student_id')
          .select('ss.id')
          .where('ss.school_id', '=', schoolA)
          .where('st.name', '=', 'Kiran B')
          .executeTakeFirstOrThrow()
      ).id
      await setStudentAbsent(db, teacher, examId, kiran, true)
      let sum = await scanSummary(db, teacher, examId)
      expect(sum.students.find((r) => r.name === 'Kiran B')).toMatchObject({
        state: 'absent',
        absent: true,
        missing: [],
      })
      expect(sum.totals.absent).toBe(1)
      await setStudentAbsent(db, teacher, examId, kiran, false)
      expect((await row('Kiran B')).state).toBe('none')
      await setStudentAbsent(db, teacher, examId, kiran, true)
      await refuses(
        setStudentAbsent(db, teacher, examId, ashaId, true),
        'conflict',
      )
      await refuses(
        setStudentAbsent(
          db,
          teacher,
          examId,
          '00000000-0000-4000-8000-000000000000',
          true,
        ),
        'not_found',
      )
      // nothing is deleted: the earlier absence rows stay, cleared
      const kept = await db
        .selectFrom('school_exam_absences')
        .select(['cleared_at'])
        .where('school_id', '=', schoolA)
        .where('school_student_id', '=', kiran)
        .execute()
      expect(kept.length).toBeGreaterThanOrEqual(2)
      expect(kept.filter((k) => k.cleared_at === null)).toHaveLength(1)
      sum = await scanSummary(db, teacher, examId)
      expect(sum.totals.absent).toBe(1)
    }, 60_000)

    it('who may use it: nobody signed in 401; another school or another subject 404; principal 403; student and parent refused', async () => {
      const p = () => ({ schoolId: schoolA, examId })
      const status = async (
        route: { options: { server?: unknown } },
        method: string,
        s: TestSession | null,
        params: Record<string, string> = p(),
        body?: unknown,
      ) => (await call(route, method, s?.cookie ?? null, params, body)).status
      const calls: Array<
        [
          { options: { server?: unknown } },
          string,
          Record<string, string>,
          unknown,
        ]
      > = [
        [ScanSummaryRoute, 'GET', p(), undefined],
        [ScanBatchesRoute, 'POST', p(), {}],
        [ScansRoute, 'POST', p(), { data: '' }],
        [
          AbsencesRoute,
          'POST',
          p(),
          { school_student_id: ashaId, absent: false },
        ],
        [
          ScanAssignRoute,
          'POST',
          { ...p(), pageId: ashaId },
          { school_student_id: ashaId, page_no: 1 },
        ],
      ]
      for (const [route, method, params, body] of calls) {
        expect(await status(route, method, null, params, body)).toBe(401)
        expect(await status(route, method, outsiderS, params, body)).toBe(404)
        expect(await status(route, method, otherTeacherS, params, body)).toBe(
          404,
        )
        expect(await status(route, method, principalS, params, body)).toBe(403)
        for (const s of [studentS, parentS])
          expect([401, 403]).toContain(
            await status(route, method, s, params, body),
          )
      }
      // and the teacher of the subject can: upload one page through the route
      const up = await call(ScansRoute, 'POST', teacherS.cookie, p(), {
        data: await base64('Ravi A', 1),
        name: 'r1.jpg',
      })
      expect(up.status).toBe(200)
      expect(await up.json()).toMatchObject({ status: 'duplicate' })
      const sumRes = await call(ScanSummaryRoute, 'GET', teacherS.cookie, p())
      expect(sumRes.headers.get('cache-control')).toBe('private, no-store')
      const body = await sumRes.text()
      expect(body).not.toMatch(/SECRET/)
      const tooBig = await call(ScansRoute, 'POST', teacherS.cookie, p(), {
        data: 'A'.repeat(17 * 1024 * 1024),
      })
      expect(tooBig.status).toBe(400)
    }, 120_000)

    it('pictures past the school’s retention are blanked, the rows stay, and the summary stops linking them', async () => {
      const before = await db
        .selectFrom('school_scan_pages')
        .select('id')
        .where('school_id', '=', schoolA)
        .where('image', 'is not', null)
        .execute()
      expect(before.length).toBeGreaterThan(pc)
      await db
        .updateTable('school_scan_pages')
        .set({ created_at: new Date(Date.now() - 400 * 24 * 3600 * 1000) })
        .where('school_id', '=', schoolA)
        .execute()
      const r = await purgeScanData(db)
      expect(r.scans).toBeGreaterThanOrEqual(before.length)
      const after = await db
        .selectFrom('school_scan_pages')
        .select(['image', 'purged_at'])
        .where('school_id', '=', schoolA)
        .execute()
      expect(after.length).toBeGreaterThanOrEqual(before.length) // nothing deleted
      expect(after.every((a) => a.image === null)).toBe(true)
      const sum = await scanSummary(db, teacher, examId)
      expect(sum.students.every((s) => s.pages.length === 0)).toBe(true)
      expect(sum.students.find((s) => s.name === 'Asha A')!.received).toEqual(
        all,
      ) // the record of receipt stays
    }, 60_000)
  })
})
