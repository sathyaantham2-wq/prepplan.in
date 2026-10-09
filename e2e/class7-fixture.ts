import type { Db } from '../src/db/connection'
import { chaptersRepository, conceptsRepository } from '../src/db/repositories'
import { createQuestion } from '../src/lib/questions'

/**
 * A self-contained Class 7 CBSE subject for specs that need the /my-paper page to offer a real
 * multi-chapter subject. Fixture subjects whose code ends in '-SEED' are deliberately hidden from
 * students (listProfileOptions), and CI has no real Class 7 content, so these specs build their
 * own and remove it afterwards. Two chapters in different parts ('I' and 'II'), one concept each,
 * one approved multiple-choice question per concept -- enough for the plan and the part picker.
 */
export interface Class7Fixture {
  subjectId: string
  tag: string
}

export async function createClass7Fixture(db: Db, label: string): Promise<Class7Fixture> {
  const stamp = `${Date.now()}-${Math.floor(Math.random() * 1000)}`
  const tag = `e2e-${label}-${stamp}`
  // Only the source row is borrowed from the seed data; chapters need one.
  const seed = await db
    .selectFrom('subjects')
    .selectAll()
    .where('code', '=', 'MATH-SEED')
    .executeTakeFirstOrThrow()
  const seedChapter = await db
    .selectFrom('chapters')
    .selectAll()
    .where('subject_id', '=', seed.id)
    .where('chapter_no', '=', 1)
    .executeTakeFirstOrThrow()

  const subject = await db
    .insertInto('subjects')
    .values({
      board: 'CBSE',
      class: 7,
      name: `E2E Class 7 ${label} ${stamp}`,
      code: `E2E-${label.toUpperCase()}-${stamp}`,
      language: 'English',
      is_active: true,
    })
    .returningAll()
    .executeTakeFirstOrThrow()

  const base = 8000 + Math.floor(Math.random() * 900)
  for (const [i, part] of (['I', 'II'] as const).entries()) {
    const chapterNo = base + i
    const chapter = await chaptersRepository.insert(db, {
      subject_id: subject.id,
      source_id: seedChapter.source_id,
      part,
      chapter_no: chapterNo,
      name: `E2E chapter part ${part}`,
      order_index: chapterNo,
    })
    const concept = await conceptsRepository.insert(db, {
      chapter_id: chapter.id,
      board: 'CBSE',
      class: 7,
      code: `E2E-${label.toUpperCase()}-${stamp}-${part}`,
      name: `E2E concept part ${part}`,
      difficulty_base: 'Easy',
    })
    await createQuestion(db, {
      concept_id: concept.id,
      board: 'CBSE',
      class: 7,
      bloom: 'Remember',
      difficulty: 'Easy',
      marks: 1,
      type: 'mcq',
      text: `${tag} question ${part}`,
      answer: 'A',
      created_by: tag,
      options: [
        { label: 'A', text: 'right', is_correct: true, order_index: 1 },
        { label: 'B', text: 'wrong', is_correct: false, order_index: 2 },
      ],
    })
  }
  return { subjectId: subject.id, tag }
}

/** Removes everything createClass7Fixture made. Delete the household (and so the student) first. */
export async function removeClass7Fixture(db: Db, fixture: Class7Fixture): Promise<void> {
  const chapters = await db
    .selectFrom('chapters')
    .select('id')
    .where('subject_id', '=', fixture.subjectId)
    .execute()
  const chapterIds = chapters.map((c) => c.id)
  const concepts = chapterIds.length
    ? await db.selectFrom('concepts').select('id').where('chapter_id', 'in', chapterIds).execute()
    : []
  const conceptIds = concepts.map((c) => c.id)
  if (conceptIds.length > 0) {
    await db.deleteFrom('concept_status').where('concept_id', 'in', conceptIds).execute()
    await db.deleteFrom('concept_mastery').where('concept_id', 'in', conceptIds).execute()
  }
  await db.deleteFrom('questions').where('created_by', '=', fixture.tag).execute()
  if (conceptIds.length > 0) {
    await db.deleteFrom('concepts').where('id', 'in', conceptIds).execute()
  }
  if (chapterIds.length > 0) {
    await db.deleteFrom('chapters').where('id', 'in', chapterIds).execute()
  }
  await db.deleteFrom('student_subjects').where('subject_id', '=', fixture.subjectId).execute()
  await db.deleteFrom('subjects').where('id', '=', fixture.subjectId).execute()
}
