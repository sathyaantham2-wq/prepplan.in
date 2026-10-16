import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createDb } from '../../db/connection'
import type { Db } from '../../db/connection'
import { blueprintsRepository, chaptersRepository, conceptsRepository } from '../../db/repositories'
import { createQuestion } from '../questions'
import { createParentSession } from '../../db/test-helpers'
import type { TestSession } from '../../db/test-helpers'
import { Route as StudentsRoute } from '../../routes/api/students'
import { loadReview } from '../answer-review'
import { AI_UNSURE_FEEDBACK, releaseUnmarkedToStudent } from './auto-confirm'

type RouteHandler = (opts: { request: Request }) => Promise<Response>

/**
 * 2026-10-16 report: a Class 6 Maths paper with written answers the AI could not mark with
 * confidence left the student on "Submitted ... waiting for a check" for ever, because new accounts
 * are students only and nobody could ever check it. A student whose household has no parent account
 * now goes to her own review instead; a student who has a parent keeps the old wait.
 */
describe('releaseUnmarkedToStudent', () => {
  let db: Db
  let parent: TestSession
  let studentId = ''
  let chapterId = ''
  let conceptId = ''
  let blueprintId = ''
  let paperId = ''
  let attemptId = ''
  let evaluationId = ''
  let writtenItemId = ''
  let mcqItemId = ''
  const tag = `release-unmarked-${Date.now()}`

  beforeAll(async () => {
    db = createDb()
    parent = await createParentSession('release-parent')
    const created = await (
      (StudentsRoute.options.server as { handlers: Record<string, RouteHandler> }).handlers.POST({
        request: new Request('http://localhost/test', {
          method: 'POST',
          headers: { cookie: parent.cookie, 'content-type': 'application/json' },
          body: JSON.stringify({ name: 'Release Kid', class: 7, board: 'CBSE', consent_accepted: true }),
        }),
      })
    ).then((r) => r.json())
    studentId = created.id

    const subject = await db.selectFrom('subjects').selectAll().where('code', '=', 'MATH-SEED').executeTakeFirstOrThrow()
    const seedChapter = await db
      .selectFrom('chapters')
      .selectAll()
      .where('subject_id', '=', subject.id)
      .where('chapter_no', '=', 1)
      .executeTakeFirstOrThrow()
    const chapterNo = 8000 + Math.floor(Math.random() * 900)
    const chapter = await chaptersRepository.insert(db, {
      subject_id: subject.id,
      source_id: seedChapter.source_id,
      part: 'I',
      chapter_no: chapterNo,
      name: 'Release fixture chapter',
      order_index: chapterNo,
    })
    chapterId = chapter.id
    const concept = await conceptsRepository.insert(db, {
      chapter_id: chapter.id,
      board: 'CBSE',
      class: 7,
      code: `REL-${Date.now()}`,
      name: 'Release fixture concept',
      difficulty_base: 'Easy',
    })
    conceptId = concept.id
    const mcq = await createQuestion(db, {
      concept_id: concept.id,
      board: 'CBSE',
      class: 7,
      bloom: 'Remember',
      difficulty: 'Easy',
      marks: 1,
      type: 'mcq',
      text: `${tag} mcq`,
      answer: 'A',
      created_by: tag,
      options: [
        { label: 'A', text: 'right', is_correct: true, order_index: 1 },
        { label: 'B', text: 'wrong', is_correct: false, order_index: 2 },
      ],
    })
    const written = await createQuestion(db, {
      concept_id: concept.id,
      board: 'CBSE',
      class: 7,
      bloom: 'Analyse',
      difficulty: 'Hard',
      marks: 2,
      type: 'short_answer',
      text: `${tag} written`,
      answer: 'EXPECTED',
      created_by: tag,
      step_marks: [
        { step_no: 1, description: 'Sets up', marks: 1 },
        { step_no: 2, description: 'Finishes', marks: 1 },
      ],
    })
    const blueprint = await blueprintsRepository.insert(db, {
      subject_id: subject.id,
      board: 'CBSE',
      class: 7,
      name: 'Release fixture blueprint',
      duration_min: 20,
      total_marks: 3,
      sections: JSON.stringify([{ name: 'Section A', marks_per_question: 1, count: 1, bloom_allowed: ['Remember'] }]),
      bloom_targets: JSON.stringify({ Remember: 0, Understand: 0, Apply: 0, Analyse: 0, Evaluate: 0, Create: 0 }),
    })
    blueprintId = blueprint.id
    const paper = await db
      .insertInto('papers')
      .values({
        student_id: studentId,
        blueprint_id: blueprint.id,
        subject_id: subject.id,
        chapter_ids: [chapter.id],
        title: 'Release fixture paper',
        total_marks: 3,
        duration_min: 20,
        weighting: JSON.stringify({}),
      })
      .returningAll()
      .executeTakeFirstOrThrow()
    paperId = paper.id
    const slotIds: Array<string> = []
    for (const [i, qid] of [mcq.id, written.id].entries()) {
      const slot = await db
        .insertInto('paper_questions')
        .values({ paper_id: paper.id, question_id: qid, section: 'Section A', position: i + 1, marks: i === 0 ? 1 : 2 })
        .returning('id')
        .executeTakeFirstOrThrow()
      slotIds.push(slot.id)
    }
    const attempt = await db
      .insertInto('attempts')
      .values({ student_id: studentId, paper_id: paper.id, mode: 'online', status: 'submitted', submitted_at: new Date() })
      .returning('id')
      .executeTakeFirstOrThrow()
    attemptId = attempt.id
    await db
      .insertInto('attempt_answers')
      .values([
        { attempt_id: attempt.id, paper_question_id: slotIds[0], selected_option: 'A', source: 'typed' },
        { attempt_id: attempt.id, paper_question_id: slotIds[1], response_text: 'ttt8t', source: 'typed' },
      ])
      .execute()
    const evaluation = await db
      .insertInto('evaluations')
      .values({ attempt_id: attempt.id, total_marks: 3, evaluated_by: 'ai' })
      .returning('id')
      .executeTakeFirstOrThrow()
    evaluationId = evaluation.id
    const items = await db
      .insertInto('evaluation_items')
      .values([
        { evaluation_id: evaluation.id, paper_question_id: slotIds[0], marks_awarded: 1, marks_max: 1, feedback: 'Correct.' },
        { evaluation_id: evaluation.id, paper_question_id: slotIds[1], marks_awarded: 0, marks_max: 2, ai_marks: null, feedback: 'Needs manual marking.' },
      ])
      .returning(['id', 'paper_question_id'])
      .execute()
    mcqItemId = items.find((i) => i.paper_question_id === slotIds[0])!.id
    writtenItemId = items.find((i) => i.paper_question_id === slotIds[1])!.id
  })

  afterAll(async () => {
    await db.deleteFrom('evaluation_items').where('evaluation_id', '=', evaluationId).execute()
    await db.deleteFrom('evaluations').where('attempt_id', '=', attemptId).execute()
    await db.deleteFrom('attempt_answers').where('attempt_id', '=', attemptId).execute()
    await db.deleteFrom('attempts').where('id', '=', attemptId).execute()
    await db.deleteFrom('paper_questions').where('paper_id', '=', paperId).execute()
    await db.deleteFrom('papers').where('id', '=', paperId).execute()
    await db.deleteFrom('concept_status').where('concept_id', '=', conceptId).execute()
    await db.deleteFrom('concept_mastery').where('concept_id', '=', conceptId).execute()
    await db.deleteFrom('households').where('id', '=', parent.householdId).execute()
    await db.deleteFrom('blueprints').where('id', '=', blueprintId).execute()
    await db.deleteFrom('questions').where('created_by', '=', tag).execute()
    await db.deleteFrom('concepts').where('id', '=', conceptId).execute()
    await db.deleteFrom('chapters').where('id', '=', chapterId).execute()
    await db.destroy()
  })

  it('leaves the paper waiting for a parent when the household has one', async () => {
    expect(await releaseUnmarkedToStudent(db, evaluationId, studentId)).toBe(false)
    const review = await loadReview(db, { id: attemptId, paper_id: paperId, student_id: studentId, status: 'submitted' })
    expect(review.state).toBe('waiting_for_parent')
  })

  it('hands the unmarked written answers to the student when no parent can ever check them', async () => {
    // Make the household student-only, as every new account now is.
    await db.updateTable('users').set({ role: 'student' }).where('id', '=', parent.userId).execute()

    const review = await loadReview(db, { id: attemptId, paper_id: paperId, student_id: studentId, status: 'submitted' })
    expect(review.state).toBe('review')
    expect(review.written).toHaveLength(1)
    expect(review.written[0].marks_awarded).toBe(0)
    expect(review.written[0].feedback).toBe(AI_UNSURE_FEEDBACK)

    const written = await db.selectFrom('evaluation_items').select(['ai_marks', 'marks_awarded']).where('id', '=', writtenItemId).executeTakeFirstOrThrow()
    expect(Number(written.ai_marks)).toBe(0)
    // The multiple-choice mark is untouched.
    const mcq = await db.selectFrom('evaluation_items').select(['marks_awarded']).where('id', '=', mcqItemId).executeTakeFirstOrThrow()
    expect(Number(mcq.marks_awarded)).toBe(1)
    // Nothing is confirmed: the student still has to accept.
    const evaluation = await db.selectFrom('evaluations').select('confirmed_at').where('id', '=', evaluationId).executeTakeFirstOrThrow()
    expect(evaluation.confirmed_at).toBeNull()
    // And it is idempotent.
    expect(await releaseUnmarkedToStudent(db, evaluationId, studentId)).toBe(false)
  })
})
