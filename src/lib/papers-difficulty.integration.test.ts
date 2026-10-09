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

/**
 * Difficulty is not student-selectable on a normal paper (owner decision 2026-10-05). The only
 * questions in this fixture are Hardest, so a paper that honoured an 'Easy' ceiling would come
 * back empty with a shortfall; a paper that ignores it fills every slot. An adaptive paper still
 * honours the ceiling (adaptive practice papers are out of scope for the change).
 */
describe('generatePaper ignores a difficulty ceiling on a normal paper', () => {
  let db: Db
  let householdId: string
  let studentId: string
  let chapterId: string
  let blueprintId: string

  beforeAll(async () => {
    db = createDb()
    const household = await householdsRepository.insert(db, {
      name: 'Difficulty fixture household',
      plan: 'free',
    })
    householdId = household.id
    const student = await studentsRepository.insert(db, {
      household_id: household.id,
      name: 'Difficulty fixture kid',
      class: 7,
      board: 'CBSE',
      target_exams: JSON.stringify([]),
    })
    studentId = student.id

    const subject = await db
      .selectFrom('subjects')
      .selectAll()
      .where('code', '=', 'MATH-SEED')
      .executeTakeFirstOrThrow()
    const existing = await db
      .selectFrom('chapters')
      .select(['source_id'])
      .where('subject_id', '=', subject.id)
      .executeTakeFirstOrThrow()
    const chapter = await chaptersRepository.insert(db, {
      subject_id: subject.id,
      source_id: existing.source_id,
      part: 'DIFF-TEST',
      chapter_no: 1,
      name: 'Difficulty fixture chapter',
      order_index: 1,
    })
    chapterId = chapter.id
    const concept = await conceptsRepository.insert(db, {
      chapter_id: chapter.id,
      board: 'CBSE',
      class: 7,
      code: `C7M-DIFF.1-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: 'Difficulty fixture concept',
      difficulty_base: 'Hardest',
    })
    for (let q = 0; q < 6; q++) {
      await createQuestion(db, {
        concept_id: concept.id,
        board: 'CBSE',
        class: 7,
        bloom: 'Apply',
        difficulty: 'Hardest',
        marks: 1,
        type: 'mcq',
        text: `Difficulty fixture question ${q}`,
        answer: '1',
        created_by: 'difficulty-fixture',
        options: [
          { label: 'A', text: '1', is_correct: true, order_index: 1 },
          { label: 'B', text: '2', is_correct: false, order_index: 2 },
        ],
      })
    }
    const blueprint = await blueprintsRepository.insert(db, {
      subject_id: subject.id,
      board: 'CBSE',
      class: 7,
      name: 'Difficulty fixture blueprint',
      duration_min: 10,
      total_marks: 3,
      sections: JSON.stringify([
        { name: 'Section A', marks_per_question: 1, count: 3, bloom_allowed: ['Apply'] },
      ]),
      bloom_targets: JSON.stringify({
        Remember: 0,
        Understand: 0,
        Apply: 100,
        Analyse: 0,
        Evaluate: 0,
        Create: 0,
      }),
    })
    blueprintId = blueprint.id
  })

  afterAll(async () => {
    await db.deleteFrom('papers').where('student_id', '=', studentId).execute()
    await db.deleteFrom('households').where('id', '=', householdId).execute()
    await db.deleteFrom('blueprints').where('id', '=', blueprintId).execute()
    await db.deleteFrom('chapters').where('id', '=', chapterId).execute()
    await db.destroy()
  })

  it('a normal paper fills from every tier even when the caller asks for Easy', async () => {
    const result = await generatePaper(db, {
      student_id: studentId,
      blueprint_id: blueprintId,
      chapter_ids: [chapterId],
      difficulty_ceiling: 'Easy',
    })
    expect(result.shortfalls).toEqual([])
    expect(result.paperQuestions).toHaveLength(3)
  })

  it('an adaptive paper still honours the ceiling', async () => {
    const result = await generatePaper(db, {
      student_id: studentId,
      blueprint_id: blueprintId,
      chapter_ids: [chapterId],
      difficulty_ceiling: 'Easy',
      adaptive: true,
    })
    expect(result.paperQuestions.length).toBeLessThan(3)
  })
})
