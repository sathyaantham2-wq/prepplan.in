import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createDb } from '../../db/connection'
import type { Db } from '../../db/connection'
import { householdsRepository, studentsRepository } from '../../db/repositories'
import { buildPaperPlan } from './plan'

/**
 * Owner decision 2026-10-04: choosing Combined or Written always brings written questions, at any
 * level and on a first paper. A brand-new student (no history at all) is the hardest case, since
 * written sections used to need a raised level, so that is who is planned for here.
 */
describe('paper plan: written sections for a brand-new student', () => {
  let db: Db
  let householdId: string
  let studentId: string
  let subjectId: string

  beforeAll(async () => {
    db = createDb()
    const household = await householdsRepository.insert(db, {
      name: 'Plan Written Fixture Household',
      plan: 'free',
    })
    householdId = household.id
    const student = await studentsRepository.insert(db, {
      household_id: household.id,
      name: 'Plan Written Kid',
      class: 7,
      board: 'CBSE',
      target_exams: JSON.stringify([]),
    })
    studentId = student.id
    const subject = await db
      .selectFrom('subjects')
      .select('id')
      .where('code', '=', 'MATH-SEED')
      .executeTakeFirstOrThrow()
    subjectId = subject.id
  })

  afterAll(async () => {
    await db.deleteFrom('households').where('id', '=', householdId).execute()
    await db.destroy()
  })

  const plan = (questionType?: 'combined' | 'mcq' | 'written', questionCount = 10) =>
    buildPaperPlan(db, { studentId, subjectId, questionType, questionCount })

  const shape = (p: Awaited<ReturnType<typeof plan>>) =>
    p!.sections.map((s) => `${s.name}:${s.count}x${s.marks_per_question}`)

  it('the student really is a first-timer', async () => {
    expect((await plan())!.is_initial_assessment).toBe(true)
  })

  it('combined: multiple choice plus short and long answers, scaled to the paper size', async () => {
    expect(shape(await plan('combined', 10))).toEqual(['Section A:10x1', 'Section B:2x2', 'Section C:1x3'])
    expect(shape(await plan('combined', 20))).toEqual(['Section A:20x1', 'Section B:4x2', 'Section C:2x3'])
    expect(shape(await plan('combined', 30))).toEqual(['Section A:30x1', 'Section B:6x2', 'Section C:3x3'])
    expect((await plan('combined', 10))!.question_types).toEqual([
      'Multiple choice',
      'Short answer',
      'Long answer',
    ])
  })

  it('written: only short and long answers, lettered from A', async () => {
    expect(shape(await plan('written', 10))).toEqual(['Section A:4x2', 'Section B:2x3'])
    expect(shape(await plan('written', 20))).toEqual(['Section A:8x2', 'Section B:4x3'])
    const p = (await plan('written', 10))!
    expect(p.total_questions).toBe(6)
    expect(p.total_marks).toBe(4 * 2 + 2 * 3)
    expect(p.question_types).not.toContain('Multiple choice')
  })

  it('multiple choice stays multiple choice only', async () => {
    expect(shape(await plan('mcq', 10))).toEqual(['Section A:10x1'])
  })

  it('with no type chosen a first paper is still the quick multiple-choice assessment', async () => {
    expect(shape(await plan(undefined, 10))).toEqual(['Section A:10x1'])
  })
})
