import type { Db } from './connection'
import { chaptersRepository, conceptsRepository } from './repositories'
import { createQuestion } from '../lib/questions'

/**
 * F132 test fixture: the test seed has no Civil Services subject, so each test that needs one
 * creates its own (board CIVILS, class 0, code POLITY -- the code the real route resolves) and
 * removes it afterwards. Test files run one at a time (vitest fileParallelism is off). If a run
 * is killed mid-way an existing subject stays renamed POLITY-HELD-*; rename it back to POLITY.
 */
export interface CivilFixture {
  subjectId: string
  chapterIds: Array<string>
  conceptIds: Array<string>
  questionIds: Array<string>
  cleanup: () => Promise<void>
}

export async function createCivilFixture(
  db: Db,
  input: {
    tag: string
    // questions per concept, one entry per concept, grouped as chapters of the given sizes
    chapters: Array<Array<number>>
    // Extra questions that must NEVER be drawn (not civil-tagged, 2 marks, retired, written).
    decoys?: boolean
  },
): Promise<CivilFixture> {
  // A local test database may already hold the real POLITY subject (the civil packs are loaded
  // there too). It is set aside under another code for the length of the test -- never deleted --
  // so the route under test sees only this fixture's questions, and put back by cleanup().
  const existing = await db
    .selectFrom('subjects')
    .select('id')
    .where('board', '=', 'CIVILS')
    .where('class', '=', 0)
    .where('code', '=', 'POLITY')
    .executeTakeFirst()
  const heldCode = `POLITY-HELD-${input.tag}`.slice(0, 60)
  if (existing) {
    await db.updateTable('subjects').set({ code: heldCode }).where('id', '=', existing.id).execute()
  }
  const subject = await db
    .insertInto('subjects')
    .values({ board: 'CIVILS', class: 0, code: 'POLITY', name: 'Polity', is_active: true })
    .returningAll()
    .executeTakeFirstOrThrow()
  const seedChapter = await db
    .selectFrom('chapters')
    .select('source_id')
    .where('subject_id', '=', (await db.selectFrom('subjects').select('id').where('code', '=', 'MATH-SEED').executeTakeFirstOrThrow()).id)
    .executeTakeFirstOrThrow()

  const chapterIds: Array<string> = []
  const conceptIds: Array<string> = []
  const questionIds: Array<string> = []
  const base = { board: 'CIVILS', class: 0, created_by: input.tag, bloom: 'Apply' as const, difficulty: 'Hard' as const }
  const mcq = (text: string, extra: Record<string, unknown> = {}) => ({
    ...base,
    marks: 1,
    type: 'mcq' as const,
    tags: ['civil'],
    text,
    answer: 'A',
    options: [
      { label: 'A', text: 'right', is_correct: true, order_index: 1 },
      { label: 'B', text: 'wrong', is_correct: false, order_index: 2 },
    ],
    ...extra,
  })

  let chapterNo = 8000 + Math.floor(Math.random() * 900)
  for (const [ci, concepts] of input.chapters.entries()) {
    chapterNo += 1
    const chapter = await chaptersRepository.insert(db, {
      subject_id: subject.id,
      source_id: seedChapter.source_id,
      part: 'I',
      chapter_no: chapterNo,
      name: `${input.tag} chapter ${ci}`,
      order_index: chapterNo,
    })
    chapterIds.push(chapter.id)
    for (const [ki, count] of concepts.entries()) {
      const concept = await conceptsRepository.insert(db, {
        chapter_id: chapter.id,
        board: 'CIVILS',
        class: 0,
        code: `LK-${chapterNo}.${ki + 1}`,
        name: `${input.tag} concept ${ci}.${ki}`,
        difficulty_base: 'Hard',
      })
      conceptIds.push(concept.id)
      for (let i = 0; i < count; i++) {
        const q = await createQuestion(db, {
          concept_id: concept.id,
          ...mcq(`${input.tag} q ${ci}.${ki}.${i}`),
        })
        questionIds.push(q.id)
      }
      if (input.decoys && ci === 0 && ki === 0) {
        const cid = concept.id
        await createQuestion(db, { concept_id: cid, ...mcq(`${input.tag} decoy untagged`, { tags: [] }) })
        await createQuestion(db, { concept_id: cid, ...mcq(`${input.tag} decoy two-mark`, { marks: 2 }) })
        await createQuestion(db, {
          concept_id: cid,
          ...mcq(`${input.tag} decoy written`, {
            type: 'short_answer',
            options: undefined,
            step_marks: [{ step_no: 1, description: 'Answers', marks: 1 }],
          }),
        })
        const retired = await createQuestion(db, { concept_id: cid, ...mcq(`${input.tag} decoy retired`) })
        await db.updateTable('questions').set({ status: 'retired' }).where('id', '=', retired.id).execute()
      }
    }
  }

  return {
    subjectId: subject.id,
    chapterIds,
    conceptIds,
    questionIds,
    cleanup: async () => {
      // question_usage / paper_questions rows reference questions; the caller deletes papers first.
      await db.deleteFrom('questions').where('created_by', '=', input.tag).execute()
      await db.deleteFrom('concepts').where('id', 'in', conceptIds).execute()
      await db.deleteFrom('chapters').where('id', 'in', chapterIds).execute()
      await db.deleteFrom('blueprints').where('subject_id', '=', subject.id).execute()
      await db.deleteFrom('subjects').where('id', '=', subject.id).execute()
      if (existing) {
        await db.updateTable('subjects').set({ code: 'POLITY' }).where('id', '=', existing.id).execute()
      }
    },
  }
}
