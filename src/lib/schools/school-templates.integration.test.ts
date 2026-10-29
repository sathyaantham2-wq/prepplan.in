import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createDb } from '../../db/connection'
import type { Db } from '../../db/connection'
import { schoolsRepository } from '../../db/repositories'
import type { SchoolScope } from '../../db/school-scope'
import {
  deleteTestCredentials,
  signInSchoolUserForTest,
  deleteSchoolTermsForTest,
} from '../../db/test-helpers'
import type { TestSession } from '../../db/test-helpers'
import { Route as BankRoute } from '../../routes/api/schools/$schoolId/bank/chapters'
import { Route as PreviewRoute } from '../../routes/api/schools/$schoolId/templates/preview'
import { Route as TemplatesRoute } from '../../routes/api/schools/$schoolId/templates'
import { loadSchoolScope } from '../school-session'
import { createSchoolStudent, createSchoolTeacher } from './people'
import {
  addSchoolSubject,
  assignTeacher,
  createClass,
  createSection,
} from './setup'
import { acceptSchoolTerms } from './terms'
import {
  adoptDefaultTemplate,
  listTemplates,
  previewCoverage,
  retireTemplate,
  saveTemplate,
} from './template-service'
import { SchoolError } from './common'
import { DEFAULT_TEMPLATES } from './templates'
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
  search = '',
) =>
  (route.options.server as { handlers: Record<string, Handler> }).handlers[
    method
  ]({
    request: new Request(`http://localhost/x${search}`, {
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

/** S4: paper layouts per school and the coverage preview, against a small real bank. Local test DB only. */
describe('school paper layouts and coverage preview (S4)', () => {
  let db: Db
  const tag = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  const schoolIds: Array<string> = []
  let schoolA: string
  let schoolB: string
  let admin: SchoolScope
  let adminB: SchoolScope
  let subjectId: string
  let otherSubjectId: string
  let sourceId: string
  const chapter: Record<string, string> = {}
  let adminS: TestSession
  let teacherS: TestSession
  let outsideTeacherS: TestSession
  let principalS: TestSession
  let studentS: TestSession
  let adminBS: TestSession
  const userIds: Array<string> = []
  const households: Array<string> = []
  let teacherScope: SchoolScope

  async function addQuestions(
    conceptId: string,
    n: number,
    o: { type: string; marks: number; bloom: string; tags?: Array<string> },
  ) {
    for (let i = 0; i < n; i++) {
      await db
        .insertInto('questions')
        .values({
          concept_id: conceptId,
          board: 'CBSE',
          class: 7,
          bloom: o.bloom as never,
          difficulty: 'Easy',
          marks: o.marks,
          type: o.type as never,
          text: `Q ${tag} ${Math.random()}`,
          text_hash: `${tag}-${Math.random()}`,
          answer: 'a',
          status: 'approved',
          origin: 'manual',
          created_by: 'test',
          tags: o.tags ?? [],
        })
        .execute()
    }
  }

  beforeAll(async () => {
    db = createDb()
    const mk = async (n: string) => {
      const p = await schoolsRepository.provision(db, {
        name: `Tmpl ${n} ${tag}`,
        code: `tmpl-${n}-${tag}`,
        board: 'CBSE',
        adminName: `Admin ${n}`,
        adminEmail: `tmpl-${n}-${tag}@school.test`,
      })
      schoolIds.push(p.school.id)
      userIds.push(p.adminUserId)
      return p
    }
    const a = await mk('a')
    const b = await mk('b')
    schoolA = a.school.id
    schoolB = b.school.id
    const sa = await loadSchoolScope(db, a.adminUserId, schoolA, [
      'school_admin',
    ])
    const sb = await loadSchoolScope(db, b.adminUserId, schoolB, [
      'school_admin',
    ])
    if (!sa.ok || !sb.ok) throw new Error('scope')
    admin = sa.scope
    adminB = sb.scope
    await acceptSchoolTerms(db, admin)

    const subj = async (code: string, name: string) =>
      (
        await db
          .insertInto('subjects')
          .values({
            board: 'CBSE',
            class: 7,
            code: `${code}-${tag}`,
            name,
            language: 'en',
            is_active: true,
          })
          .returning('id')
          .executeTakeFirstOrThrow()
      ).id
    subjectId = await subj('ZM', 'Test Maths')
    otherSubjectId = await subj('ZS', 'Test Science')
    sourceId = (
      await db
        .insertInto('sources')
        .values({
          subject_id: subjectId,
          title: 'Test Ganita Prakash',
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
      order: number,
    ) => {
      const ch = await db
        .insertInto('chapters')
        .values({
          source_id: sourceId,
          subject_id: subjectId,
          part,
          chapter_no: no,
          name,
          order_index: order,
        })
        .returning('id')
        .executeTakeFirstOrThrow()
      const ids: Array<string> = []
      for (let i = 1; i <= concepts; i++) {
        ids.push(
          (
            await db
              .insertInto('concepts')
              .values({
                chapter_id: ch.id,
                board: 'CBSE',
                class: 7,
                code: `ZT-${tag}-${part}${no}.${i}`,
                name: `${name} ${i}`,
                difficulty_base: 'Easy',
              })
              .returning('id')
              .executeTakeFirstOrThrow()
          ).id,
        )
      }
      return { id: ch.id, concepts: ids }
    }
    const p1c3 = await mkChapter('I', 3, 'Fractions', 3, 1)
    const p2c3 = await mkChapter('II', 3, 'Decimals', 1, 2) // same number as Part I chapter 3
    const p1c4 = await mkChapter('I', 4, 'Shapes', 2, 3)
    chapter.p1c3 = p1c3.id
    chapter.p2c3 = p2c3.id
    chapter.p1c4 = p1c4.id
    // Part I ch 3 is deep except long answers; Part II ch 3 is thin; Part I ch 4 has case studies only.
    await addQuestions(p1c3.concepts[0], 40, {
      type: 'mcq',
      marks: 1,
      bloom: 'Understand',
    })
    await addQuestions(p1c3.concepts[0], 6, {
      type: 'assertion_reason',
      marks: 1,
      bloom: 'Apply',
    })
    await addQuestions(p1c3.concepts[1], 12, {
      type: 'short_answer',
      marks: 2,
      bloom: 'Understand',
    })
    await addQuestions(p1c3.concepts[1], 10, {
      type: 'short_answer',
      marks: 3,
      bloom: 'Apply',
    })
    await addQuestions(p2c3.concepts[0], 5, {
      type: 'mcq',
      marks: 1,
      bloom: 'Remember',
    })
    await addQuestions(p2c3.concepts[0], 1, {
      type: 'short_answer',
      marks: 2,
      bloom: 'Understand',
    })
    await addQuestions(p1c4.concepts[0], 3, {
      type: 'short_answer',
      marks: 4,
      bloom: 'Analyse',
      tags: ['case_study'],
    })

    const cls = await createClass(db, admin, 7, '2026-27')
    const secA = await createSection(db, admin, cls.id, 'A')
    const schoolSubject = await addSchoolSubject(db, admin, cls.id, subjectId)
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
    await assignTeacher(db, admin, {
      memberId: t.member.id,
      sectionId: secA.id,
      schoolSubjectId: schoolSubject.id,
    })
    const st = await createSchoolStudent(db, admin, {
      name: 'Stu',
      grade: 7,
      sectionId: secA.id,
      sectionName: 'A',
      rollNo: '1',
      admissionNo: null,
      guardianPhone: null,
      guardianName: null,
    })
    households.push(
      t.user.household_id,
      t2.user.household_id,
      pr.user.household_id,
      st.user.household_id,
    )
    const ts = await loadSchoolScope(db, t.user.id, schoolA, ['teacher'])
    if (!ts.ok) throw new Error('scope')
    teacherScope = ts.scope
    adminS = await signInSchoolUserForTest(a.adminUserId)
    teacherS = await signInSchoolUserForTest(t.user.id)
    outsideTeacherS = await signInSchoolUserForTest(t2.user.id)
    principalS = await signInSchoolUserForTest(pr.user.id)
    studentS = await signInSchoolUserForTest(st.user.id)
    adminBS = await signInSchoolUserForTest(b.adminUserId)
    userIds.push(t.user.id, t2.user.id, pr.user.id, st.user.id)
  })

  afterAll(async () => {
    const ids = schoolIds
    await deleteTestCredentials(userIds)
    await db.deleteFrom('audit_log').where('school_id', 'in', ids).execute()
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
    await db
      .deleteFrom('questions')
      .where('created_by', '=', 'test')
      .where('text', 'like', `Q ${tag}%`)
      .execute()
    await db
      .deleteFrom('concepts')
      .where('code', 'like', `ZT-${tag}%`)
      .execute()
    await db.deleteFrom('chapters').where('source_id', '=', sourceId).execute()
    await db.deleteFrom('sources').where('id', '=', sourceId).execute()
    await db
      .deleteFrom('subjects')
      .where('id', 'in', [subjectId, otherSubjectId])
      .execute()
    await db.destroy()
  })

  describe('saved layouts', () => {
    it('the two ready-made layouts are offered, and using one saves it for this school only', async () => {
      const first = await listTemplates(db, admin)
      expect(first.templates).toEqual([])
      expect(first.defaults.map((d) => d.key)).toEqual([
        'cbse_80',
        'unit_test_40',
      ])
      const cbse = await adoptDefaultTemplate(db, admin, 'cbse_80')
      expect(cbse).toMatchObject({
        name: 'CBSE-style paper, 80 marks',
        totalMarks: 80,
        durationMin: 180,
        version: 1,
        basedOn: 'cbse_80',
      })
      await adoptDefaultTemplate(db, admin, 'unit_test_40')
      expect(
        (await listTemplates(db, admin)).templates
          .map((t) => t.totalMarks)
          .sort(),
      ).toEqual([40, 80])
      expect((await listTemplates(db, adminB)).templates).toEqual([]) // another school sees nothing
      await refuses(adoptDefaultTemplate(db, admin, 'nope'), 'not_found')
    })

    it('a custom layout is checked in plain words, saved, and an edit adds a version without losing the old one', async () => {
      const bad: TemplateDefinition = {
        ...DEFAULT_TEMPLATES[1],
        name: 'Bad one',
        totalMarks: 41,
      }
      await refuses(saveTemplate(db, admin, { definition: bad }), 'invalid')
      const err = await saveTemplate(db, admin, { definition: bad }).catch(
        (e) => e as SchoolError,
      )
      expect((err as SchoolError).message).toMatch(
        /add up to 40 marks, but the total is 41/,
      )

      const v1 = await saveTemplate(db, teacherScope, {
        definition: { ...DEFAULT_TEMPLATES[1], name: 'Class test' },
      }) // a teacher may design too
      expect(v1.version).toBe(1)
      const v2 = await saveTemplate(db, teacherScope, {
        key: v1.key,
        definition: {
          ...DEFAULT_TEMPLATES[1],
          name: 'Class test (long)',
          durationMin: 100,
        },
      })
      expect(v2).toMatchObject({ key: v1.key, version: 2, durationMin: 100 })
      const rows = await db
        .selectFrom('school_paper_templates')
        .select(['version', 'status'])
        .where('template_key', '=', v1.key)
        .orderBy('version')
        .execute()
      expect(rows).toEqual([
        { version: 1, status: 'retired' },
        { version: 2, status: 'active' },
      ])
      expect(
        (await listTemplates(db, admin)).templates.filter(
          (t) => t.key === v1.key,
        ),
      ).toHaveLength(1)
      // the other school can neither edit nor retire it
      await refuses(
        saveTemplate(db, adminB, {
          key: v1.key,
          definition: DEFAULT_TEMPLATES[1],
        }),
        'not_found',
      )
      await refuses(retireTemplate(db, adminB, v1.key), 'not_found')
      await retireTemplate(db, admin, v1.key)
      expect(
        (await listTemplates(db, admin)).templates.some(
          (t) => t.key === v1.key,
        ),
      ).toBe(false)
      expect(
        await db
          .selectFrom('school_paper_templates')
          .select('id')
          .where('template_key', '=', v1.key)
          .execute(),
      ).toHaveLength(2) // nothing deleted
    })

    it('every change is logged for the school', async () => {
      const actions = (
        await db
          .selectFrom('audit_log')
          .select('action')
          .where('school_id', '=', schoolA)
          .execute()
      ).map((r) => r.action)
      expect(actions).toEqual(
        expect.arrayContaining([
          'school.template_created',
          'school.template_updated',
          'school.template_retired',
        ]),
      )
    })
  })

  describe('over the API', () => {
    it('admin and teacher design, the principal only looks, others are refused', async () => {
      const list = (await (
        await call(TemplatesRoute, 'GET', teacherS.cookie, {
          schoolId: schoolA,
        })
      ).json()) as {
        templates: Array<unknown>
        subjects: Array<{ id: string }>
      }
      expect(list.subjects.map((s) => s.id)).toEqual([subjectId])
      expect(
        (
          await call(TemplatesRoute, 'GET', principalS.cookie, {
            schoolId: schoolA,
          })
        ).status,
      ).toBe(200)
      expect(
        (
          await call(
            TemplatesRoute,
            'POST',
            principalS.cookie,
            { schoolId: schoolA },
            { action: 'adopt_default', default_key: 'cbse_80' },
          )
        ).status,
      ).toBe(403)
      expect(
        (
          await call(TemplatesRoute, 'GET', studentS.cookie, {
            schoolId: schoolA,
          })
        ).status,
      ).toBe(403)
      expect(
        (
          await call(TemplatesRoute, 'GET', adminBS.cookie, {
            schoolId: schoolA,
          })
        ).status,
      ).toBe(404)
      expect(
        (
          await call(
            TemplatesRoute,
            'POST',
            adminS.cookie,
            { schoolId: schoolA },
            { action: 'save', definition: { name: 'x' } },
          )
        ).status,
      ).toBe(400)
      const saved = await call(
        TemplatesRoute,
        'POST',
        adminS.cookie,
        { schoolId: schoolA },
        {
          action: 'save',
          definition: { ...DEFAULT_TEMPLATES[1], name: 'Via API' },
        },
      )
      expect(saved.status).toBe(200)
      expect(
        (
          await call(
            TemplatesRoute,
            'POST',
            adminS.cookie,
            { schoolId: schoolA },
            {
              action: 'save',
              definition: { ...DEFAULT_TEMPLATES[1], totalMarks: 3 },
            },
          )
        ).status,
      ).toBe(400)
    })

    it('a teacher sees only the subjects they teach', async () => {
      const outside = (await (
        await call(TemplatesRoute, 'GET', outsideTeacherS.cookie, {
          schoolId: schoolA,
        })
      ).json()) as { subjects: Array<unknown> }
      expect(outside.subjects).toEqual([])
      expect(
        (
          await call(
            BankRoute,
            'GET',
            outsideTeacherS.cookie,
            { schoolId: schoolA },
            undefined,
            `?subject_id=${subjectId}`,
          )
        ).status,
      ).toBe(404)
      expect(
        (
          await call(
            BankRoute,
            'GET',
            teacherS.cookie,
            { schoolId: schoolA },
            undefined,
            `?subject_id=${otherSubjectId}`,
          )
        ).status,
      ).toBe(404) // a subject the school does not teach
      expect(
        (
          await call(
            BankRoute,
            'GET',
            teacherS.cookie,
            { schoolId: schoolA },
            undefined,
            '?subject_id=nope',
          )
        ).status,
      ).toBe(400)
    })
  })

  describe('chapters are named by book, part and chapter, never by number alone', () => {
    it('two chapters numbered 3 in different parts stay separate and say which part', async () => {
      const res = (await (
        await call(
          BankRoute,
          'GET',
          teacherS.cookie,
          { schoolId: schoolA },
          undefined,
          `?subject_id=${subjectId}`,
        )
      ).json()) as {
        chapters: Array<{
          id: string
          book: string
          part: string
          chapterNo: number
          label: string
          concepts: number
          approvedQuestions: number
        }>
      }
      const threes = res.chapters.filter((c) => c.chapterNo === 3)
      expect(threes.map((c) => [c.part, c.label])).toEqual([
        ['I', 'Part I · Chapter 3 · Fractions'],
        ['II', 'Part II · Chapter 3 · Decimals'],
      ])
      expect(threes[0].book).toBe('Test Ganita Prakash')
      expect(threes[0]).toMatchObject({ concepts: 3, approvedQuestions: 68 })
      expect(res.chapters).toHaveLength(3)
    })
  })

  describe('coverage preview', () => {
    it('shows marks per chapter, the recall / thinking split and every shortfall by chapter and kind of question', async () => {
      const r = await previewCoverage(db, admin, {
        subjectId,
        chapterIds: [chapter.p1c3, chapter.p2c3, chapter.p1c4],
        templateKey: (await listTemplates(db, admin)).templates.find(
          (t) => t.basedOn === 'cbse_80',
        )!.key,
      })
      expect(r.totalMarks).toBe(80)
      expect(r.fillableMarks).toBeLessThan(80)
      // The bank has no 5-mark long answers at all, and only 3 case studies for 4 needed (3 + 1 OR).
      const paper = r.shortfalls.filter((s) => s.kind === 'paper')
      expect(paper.map((s) => s.slot)).toEqual(
        expect.arrayContaining(['5-mark long answer']),
      )
      const longs = paper.find((s) => s.slot === '5-mark long answer')!
      expect(longs).toMatchObject({ needed: 7, short: 7, marksMissing: 20 })
      // per chapter rows carry the part
      expect(r.chapters.map((c) => c.label)).toEqual([
        'Part I · Chapter 3 · Fractions',
        'Part II · Chapter 3 · Decimals',
        'Part I · Chapter 4 · Shapes',
      ])
      const plannedTotal = r.chapters.reduce((n, c) => n + c.plannedMarks, 0)
      expect(plannedTotal).toBeCloseTo(80, 0)
      // shortfalls are also written out for the teacher's copy
      expect(
        r.teacherCopyLines.some(
          (l) => l.includes('5-mark long answer') && l.includes('7 of 7'),
        ),
      ).toBe(true)
      expect(
        r.teacherCopyLines.some((l) => l.startsWith('Part II · Chapter 3')),
      ).toBe(true)
      expect(r.levels.planned.recall_understanding).toBe(25)
      expect(r.levels.expectedRecall).toBeGreaterThan(0)
    })

    it('a chapter with too few questions is short while another covers it', async () => {
      const r = await previewCoverage(db, admin, {
        subjectId,
        chapterIds: [chapter.p1c3, chapter.p2c3],
        definition: DEFAULT_TEMPLATES[1],
      })
      const twoMark = r.slots.find((s) => s.slot === '2-mark short answer')!
      const decimals = twoMark.cells.find((c) => c.chapterId === chapter.p2c3)!
      expect(decimals.have).toBe(1)
      expect(decimals.needed).toBeGreaterThanOrEqual(1)
      expect(twoMark.unfilled).toBe(0) // Part I chapter 3 has plenty
    })

    it('refuses nonsense: no chapters, repeated chapters, a chapter of another subject, a layout of another school', async () => {
      await refuses(
        previewCoverage(db, admin, {
          subjectId,
          chapterIds: [],
          definition: DEFAULT_TEMPLATES[1],
        }),
        'invalid',
      )
      await refuses(
        previewCoverage(db, admin, {
          subjectId,
          chapterIds: [chapter.p1c3, chapter.p1c3],
          definition: DEFAULT_TEMPLATES[1],
        }),
        'invalid',
      )
      await refuses(
        previewCoverage(db, admin, {
          subjectId,
          chapterIds: [crypto.randomUUID()],
          definition: DEFAULT_TEMPLATES[1],
        }),
        'not_found',
      )
      await refuses(
        previewCoverage(db, admin, {
          subjectId: otherSubjectId,
          chapterIds: [chapter.p1c3],
          definition: DEFAULT_TEMPLATES[1],
        }),
        'not_found',
      )
      const key = (await listTemplates(db, admin)).templates[0].key
      await refuses(
        previewCoverage(db, adminB, {
          subjectId,
          chapterIds: [chapter.p1c3],
          templateKey: key,
        }),
        'not_found',
      )
      await refuses(
        previewCoverage(db, admin, { subjectId, chapterIds: [chapter.p1c3] }),
        'invalid',
      )
    })

    it('over the API: a teacher of the subject can preview; the preview changes nothing', async () => {
      const before = await db
        .selectFrom('school_paper_templates')
        .select('id')
        .where('school_id', '=', schoolA)
        .execute()
      const res = await call(
        PreviewRoute,
        'POST',
        teacherS.cookie,
        { schoolId: schoolA },
        {
          subject_id: subjectId,
          chapter_ids: [chapter.p1c3],
          definition: DEFAULT_TEMPLATES[1],
        },
      )
      expect(res.status).toBe(200)
      expect(((await res.json()) as { totalMarks: number }).totalMarks).toBe(40)
      expect(
        (
          await call(
            PreviewRoute,
            'POST',
            outsideTeacherS.cookie,
            { schoolId: schoolA },
            {
              subject_id: subjectId,
              chapter_ids: [chapter.p1c3],
              definition: DEFAULT_TEMPLATES[1],
            },
          )
        ).status,
      ).toBe(404)
      expect(
        (
          await call(
            PreviewRoute,
            'POST',
            studentS.cookie,
            { schoolId: schoolA },
            {
              subject_id: subjectId,
              chapter_ids: [chapter.p1c3],
              definition: DEFAULT_TEMPLATES[1],
            },
          )
        ).status,
      ).toBe(403)
      expect(
        await db
          .selectFrom('school_paper_templates')
          .select('id')
          .where('school_id', '=', schoolA)
          .execute(),
      ).toHaveLength(before.length)
    })
  })
})
