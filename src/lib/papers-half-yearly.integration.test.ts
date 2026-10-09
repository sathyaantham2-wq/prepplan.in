import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createDb } from '../db/connection'
import type { Db } from '../db/connection'
import {
  blueprintsRepository,
  chaptersRepository,
  conceptsRepository,
  householdsRepository,
  studentsRepository,
} from '../db/repositories'
import { createQuestion } from './questions'
import { generatePaper } from './papers'
import { isPossiblyStoppedEarly } from './school-paper'
import { findSchoolBlueprint } from './school-blueprint'

/**
 * School Half-Yearly generation rules, on a small fixture: a plain slot never receives a special
 * (case study / ruler-and-compass) question, a discipline slot is never filled from another
 * discipline, an unfillable slot is reported with the marks it leaves empty, an OR pairs two
 * different concepts, a written question carries its snapshotted word limit, and an OR pair
 * shares one printed number.
 */
describe('generatePaper School Half-Yearly layout', () => {
  let db: Db
  let householdId: string
  let studentId: string
  let chapterIds: Array<string> = []
  let blueprintId: string
  let historyChapterId: string

  const mcq = (conceptId: string, n: number, tags?: Array<string>) =>
    createQuestion(db, {
      concept_id: conceptId, board: 'CBSE', class: 7, bloom: 'Remember', difficulty: 'Easy', marks: 1,
      type: 'mcq', text: `HY fixture mcq ${n} ${Math.random()}`, answer: 'A', created_by: 'hy-fixture', tags,
      options: ['A', 'B', 'C', 'D'].map((label, i) => ({ label, text: `opt ${label}`, is_correct: i === 0, order_index: i + 1 })),
    })
  const written = (conceptId: string, marks: number, text: string, tags?: Array<string>, type: 'short_answer' | 'long_answer' = 'short_answer') =>
    createQuestion(db, {
      concept_id: conceptId, board: 'CBSE', class: 7, bloom: 'Understand', difficulty: 'Hard', marks,
      type, text, answer: 'model answer', created_by: 'hy-fixture', tags,
      step_marks: [{ step_no: 1, description: 'part a', marks: 1 }, { step_no: 2, description: 'part b', marks: marks - 1 }],
    })

  beforeAll(async () => {
    db = createDb()
    const household = await householdsRepository.insert(db, { name: 'HY fixture household', plan: 'free' })
    householdId = household.id
    const student = await studentsRepository.insert(db, {
      household_id: household.id, name: 'HY fixture kid', class: 7, board: 'CBSE', target_exams: JSON.stringify([]),
    })
    studentId = student.id
    const subject = await db.selectFrom('subjects').selectAll().where('code', '=', 'MATH-SEED').executeTakeFirstOrThrow()
    const source = await db.selectFrom('chapters').select('source_id').where('subject_id', '=', subject.id).executeTakeFirstOrThrow()

    const history = await chaptersRepository.insert(db, {
      subject_id: subject.id, source_id: source.source_id, part: 'HY-TEST', chapter_no: 1, name: 'HY history chapter', order_index: 1,
    })
    await db.updateTable('chapters').set({ discipline: 'History' }).where('id', '=', history.id).execute()
    historyChapterId = history.id
    chapterIds = [history.id]

    const conceptA = await conceptsRepository.insert(db, { chapter_id: history.id, board: 'CBSE', class: 7, code: `C7S-HY.1-${Date.now()}`, name: 'HY concept A', difficulty_base: 'Easy' })
    const conceptB = await conceptsRepository.insert(db, { chapter_id: history.id, board: 'CBSE', class: 7, code: `C7S-HY.2-${Date.now()}`, name: 'HY concept B', difficulty_base: 'Easy' })

    for (let i = 0; i < 4; i++) await mcq(i % 2 ? conceptA.id : conceptB.id, i)
    // 2-mark pool: two concepts, so an OR can pair different concepts. One is tagged 'construction'.
    await written(conceptA.id, 2, 'HY two-mark A1')
    await written(conceptB.id, 2, 'HY two-mark B1')
    await written(conceptA.id, 2, 'HY ruler and compass', ['construction'])
    // A case study exists, but is tagged, so only the case-study slot may take it.
    await written(conceptA.id, 4, 'HY case study', ['case_study'], 'long_answer')
    // A 3-mark question exists but tagged as case study too: must never reach a plain 3-mark slot.
    await written(conceptB.id, 3, 'HY three-mark tagged case', ['case_study'], 'long_answer')

    const sections = [
      { name: 'Section A — History', slot: 'MCQ', marks_per_question: 1, count: 4, bloom_allowed: ['Remember', 'Understand'], types: ['mcq'], discipline: 'History' },
      { name: 'Section A — History', slot: 'Short', marks_per_question: 2, count: 2, bloom_allowed: ['Remember', 'Understand'], types: ['short_answer', 'long_answer'], discipline: 'History', or_count: 1 },
      { name: 'Section A — History', slot: 'Case study', marks_per_question: 4, count: 1, bloom_allowed: ['Understand'], tag: 'case_study', discipline: 'History' },
      { name: 'Section A — History', slot: 'Plain three', marks_per_question: 3, count: 1, bloom_allowed: ['Understand'], types: ['long_answer'], discipline: 'History' },
      { name: 'Section B — Economics', slot: 'Short', marks_per_question: 2, count: 2, bloom_allowed: ['Remember', 'Understand'], types: ['short_answer'], discipline: 'Economics' },
    ]
    const config = {
      kind: 'school_half_yearly', instructions: ['x'], word_limits: { '2': 40, '3': 60, '4': 100, '5': 120 },
      level_mix: { recall_understanding: 100, application: 0, analysis_evaluation: 0 },
      section_totals: { 'Section A — History': 15, 'Section B — Economics': 4 },
      section_order: ['Section A — History', 'Section B — Economics'], stopped_early_ratio: 0.5,
    }
    const blueprint = await blueprintsRepository.insert(db, {
      subject_id: subject.id, board: 'CBSE', class: 7, name: 'HY fixture blueprint', duration_min: 60, total_marks: 19,
      sections: JSON.stringify(sections),
      bloom_targets: JSON.stringify({ Remember: 50, Understand: 50, Apply: 0, Analyse: 0, Evaluate: 0, Create: 0 }),
      config: JSON.stringify(config),
    })
    blueprintId = blueprint.id
  })

  afterAll(async () => {
    await db.deleteFrom('papers').where('student_id', '=', studentId).execute()
    await db.deleteFrom('households').where('id', '=', householdId).execute()
    await db.deleteFrom('blueprints').where('id', '=', blueprintId).execute()
    await db.deleteFrom('chapters').where('id', '=', historyChapterId).execute()
    await db.destroy()
  })

  async function rows(paperId: string) {
    return db
      .selectFrom('paper_questions as pq')
      .innerJoin('questions as q', 'q.id', 'pq.question_id')
      .select(['pq.section', 'pq.slot', 'pq.position', 'pq.marks', 'pq.choice_group', 'pq.expected_words', 'q.text', 'q.tags', 'q.concept_id', 'q.type'])
      .where('pq.paper_id', '=', paperId)
      .orderBy('pq.position')
      .execute()
  }

  it('never puts a special question in a plain slot, and fills the case-study slot from the tagged one', async () => {
    const r = await generatePaper(db, { student_id: studentId, blueprint_id: blueprintId, chapter_ids: chapterIds, recentUsageWindowDays: 0, delivery: 'screen' })
    const all = await rows(r.paper.id)
    for (const q of all.filter((x) => x.slot === 'Short')) {
      expect(q.tags).not.toContain('case_study')
      // a ruler-and-compass question is not eligible for a phone attempt
      expect(q.tags).not.toContain('construction')
    }
    expect(all.find((x) => x.slot === 'Case study')?.text).toBe('HY case study')
    // the only 3-mark long answer is tagged case_study, so the plain 3-mark slot is a shortfall
    expect(all.some((x) => x.slot === 'Plain three')).toBe(false)
    expect(r.shortfalls.find((s) => s.slot === 'Plain three')?.marks_missing).toBe(3)
  })

  it('reports a discipline with no chapter as a shortfall carrying its marks, and fills nothing from History', async () => {
    const r = await generatePaper(db, { student_id: studentId, blueprint_id: blueprintId, chapter_ids: chapterIds, recentUsageWindowDays: 0 })
    const all = await rows(r.paper.id)
    expect(all.some((x) => x.section === 'Section B — Economics')).toBe(false)
    const missing = r.shortfalls.find((s) => s.section === 'Section B — Economics')
    expect(missing?.marks_missing).toBe(4)
    expect(missing?.reason).toMatch(/none of the chosen chapters is Economics/)
  })

  it('pairs an OR from two different concepts with the same marks, sharing one printed number', async () => {
    const r = await generatePaper(db, { student_id: studentId, blueprint_id: blueprintId, chapter_ids: chapterIds, recentUsageWindowDays: 0, delivery: 'print' })
    const all = await rows(r.paper.id)
    const pair = all.filter((x) => x.choice_group)
    if (pair.length === 0) {
      // no second eligible question existed this draw: must have been reported, not hidden
      expect(r.shortfalls.some((s) => /internal choice/.test(s.reason))).toBe(true)
      return
    }
    expect(pair).toHaveLength(2)
    expect(pair[0].marks).toBe(pair[1].marks)
    expect(pair[0].concept_id).not.toBe(pair[1].concept_id)
    expect(pair[0].position).toBe(pair[1].position)
    // numbering has no gaps: distinct printed numbers run 1..N
    const numbers = [...new Set(all.map((x) => x.position))]
    expect(numbers).toEqual(numbers.map((_, i) => i + 1))
  })

  it('snapshots the word limit on written questions only', async () => {
    const r = await generatePaper(db, { student_id: studentId, blueprint_id: blueprintId, chapter_ids: chapterIds, recentUsageWindowDays: 0 })
    const all = await rows(r.paper.id)
    for (const q of all) {
      if (q.type === 'mcq') expect(q.expected_words).toBeNull()
      else expect(q.expected_words).toBe(q.marks === 2 ? 40 : q.marks === 3 ? 60 : q.marks === 4 ? 100 : 120)
    }
    const short = all.find((q) => q.slot === 'Short')
    expect(isPossiblyStoppedEarly('only a few words', short?.expected_words)).toBe(true)
  })

  it('section totals reconcile: printed + shortfall marks equal the layout', async () => {
    const r = await generatePaper(db, { student_id: studentId, blueprint_id: blueprintId, chapter_ids: chapterIds, recentUsageWindowDays: 0 })
    const half = (r.paper.weighting as { half_yearly: { section_totals: Record<string, number> } }).half_yearly
    expect(half.section_totals).toEqual({ 'Section A — History': 15, 'Section B — Economics': 4 })
    const printed = (await rows(r.paper.id)).filter((x, i, a) => !x.choice_group || a.findIndex((y) => y.choice_group === x.choice_group) === i).reduce((n, x) => n + x.marks, 0)
    const missing = r.shortfalls.reduce((n, s) => n + (s.marks_missing ?? 0), 0)
    expect(printed + missing).toBe(19)
  })

  it('findSchoolBlueprint returns the school blueprint for a subject, and null for one without', async () => {
    const found = await findSchoolBlueprint(db, (await db.selectFrom('blueprints').select('subject_id').where('id', '=', blueprintId).executeTakeFirstOrThrow()).subject_id)
    expect(found?.id).toBe(blueprintId)
    const other = await db.selectFrom('subjects').select('id').where('code', '=', 'ENG').where('class', '=', 7).executeTakeFirst()
    if (other) expect(await findSchoolBlueprint(db, other.id)).toBeNull()
  })
})
