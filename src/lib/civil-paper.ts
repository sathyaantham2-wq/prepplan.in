import type { Db } from '../db/connection'
import type { BloomLevel, QuestionType } from '../db/enums'
import {
  papersRepository,
  questionsRepository,
  paperQuestionsRepository,
  questionUsageRepository,
} from '../db/repositories'

// F132: the Civil Services (UPSC Prelims) "New paper" screen. A civil paper is a plain run of
// one-mark objective questions drawn at random from the civil-tagged bank, so none of the school
// blueprint machinery (Bloom targets, discipline slots, mastery weighting) applies; this is a
// separate, much smaller generator on purpose.
export const CIVIL_QUESTION_COUNTS = [10, 15, 30] as const
export type CivilQuestionCount = (typeof CIVIL_QUESTION_COUNTS)[number]
// Only Polity has a question bank so far; Geography, Economy and Current Affairs get their own
// subjects later and are shown on the screen as "Coming soon".
export const CIVIL_SUBJECT_CODES = ['POLITY'] as const
export type CivilSubjectCode = (typeof CIVIL_SUBJECT_CODES)[number]

const CIVIL_BOARD = 'CIVILS'
const CIVIL_CLASS = 0
const CIVIL_TAG = 'civil'
const CIVIL_OBJECTIVE_TYPES: Array<QuestionType> = ['mcq', 'multi_statement', 'assertion_reason', 'match']
// How "recently served" looks when avoiding repeats; the same 14 days generatePaper defaults to.
const RECENT_WINDOW_DAYS = 14
// First pass takes at most this many questions from one concept, so a concept with a deep bank
// cannot crowd the paper; a second pass lifts the cap only when the first could not fill it.
const PER_CONCEPT_CAP = 2
// UPSC Prelims gives 120 minutes for 100 questions.
const MINUTES_PER_QUESTION = 1.2

const ALL_BLOOM: Array<BloomLevel> = ['Remember', 'Understand', 'Apply', 'Analyse', 'Evaluate', 'Create']

interface Candidate {
  id: string
  concept_id: string
  chapter_id: string
}

/**
 * Picks `count` questions: chapters take turns (in random order), and inside a chapter its
 * concepts take turns, so no chapter dominates however unequal their banks are. The candidates
 * arrive already in random order.
 */
export function pickSpread(candidates: Array<Candidate>, count: number): Array<Candidate> {
  const picked: Array<Candidate> = []
  const taken = new Set<string>()
  const perConcept = new Map<string, number>()

  const byChapter = new Map<string, Map<string, Array<Candidate>>>()
  for (const c of candidates) {
    const concepts = byChapter.get(c.chapter_id) ?? new Map<string, Array<Candidate>>()
    const list = concepts.get(c.concept_id) ?? []
    list.push(c)
    concepts.set(c.concept_id, list)
    byChapter.set(c.chapter_id, concepts)
  }
  // Map insertion order follows the (random) candidate order, so the chapter order is random too.
  const chapters = [...byChapter.values()].map((concepts) => ({
    concepts: [...concepts.values()],
    nextConcept: 0,
  }))

  for (const cap of [PER_CONCEPT_CAP, Infinity]) {
    let progressed = true
    while (picked.length < count && progressed) {
      progressed = false
      for (const chapter of chapters) {
        if (picked.length >= count) break
        // This chapter's turn: the next concept (round robin) that still has an unused question
        // under the cap.
        for (let step = 0; step < chapter.concepts.length; step++) {
          const idx = (chapter.nextConcept + step) % chapter.concepts.length
          const list = chapter.concepts[idx]
          const next = list.find((c) => !taken.has(c.id))
          if (!next || (perConcept.get(next.concept_id) ?? 0) >= cap) continue
          picked.push(next)
          taken.add(next.id)
          perConcept.set(next.concept_id, (perConcept.get(next.concept_id) ?? 0) + 1)
          chapter.nextConcept = (idx + 1) % chapter.concepts.length
          progressed = true
          break
        }
      }
    }
    if (picked.length >= count) break
  }
  return picked
}

/** Finds or creates the stored blueprint for an N x 1-mark civil paper (nothing is deleted). */
async function ensureCivilBlueprint(
  db: Db,
  input: { subjectId: string; questionCount: number },
) {
  const name = `Civil Prelims MCQ ${input.questionCount}x1m`
  const existing = await db
    .selectFrom('blueprints')
    .selectAll()
    .where('subject_id', '=', input.subjectId)
    .where('name', '=', name)
    .executeTakeFirst()
  if (existing) return existing

  const bloomTargets: Record<BloomLevel, number> = {
    Remember: 0, Understand: 0, Apply: 0, Analyse: 0, Evaluate: 0, Create: 0,
  }
  return db
    .insertInto('blueprints')
    .values({
      subject_id: input.subjectId,
      board: CIVIL_BOARD,
      class: CIVIL_CLASS,
      name,
      total_marks: input.questionCount,
      duration_min: Math.ceil(input.questionCount * MINUTES_PER_QUESTION),
      sections: JSON.stringify([
        {
          name: 'Section A',
          count: input.questionCount,
          marks_per_question: 1,
          bloom_allowed: ALL_BLOOM,
        },
      ]),
      bloom_targets: JSON.stringify(bloomTargets),
    })
    .returningAll()
    .executeTakeFirstOrThrow()
}

export class CivilSubjectNotFoundError extends Error {}

/**
 * Generates one Civil Services Prelims practice paper for a student. The subject is always
 * resolved by code + board CIVILS + class 0 + active here, never from an id the caller supplied.
 * A bank too small for the request still produces a paper, with the gap reported (F032).
 */
export async function generateCivilPrelimsPaper(
  db: Db,
  input: { studentId: string; questionCount: CivilQuestionCount; subjectCode: CivilSubjectCode },
) {
  const subject = await db
    .selectFrom('subjects')
    .selectAll()
    .where('code', '=', input.subjectCode)
    .where('board', '=', CIVIL_BOARD)
    .where('class', '=', CIVIL_CLASS)
    .where('is_active', '=', true)
    .executeTakeFirst()
  if (!subject) throw new CivilSubjectNotFoundError(`No active civil subject ${input.subjectCode}`)

  const recentIds = await questionUsageRepository.listRecentQuestionIds(
    db,
    input.studentId,
    RECENT_WINDOW_DAYS,
  )
  const candidateParams = {
    subjectId: subject.id,
    types: CIVIL_OBJECTIVE_TYPES,
    tag: CIVIL_TAG,
  }
  const candidates = await questionsRepository.listCivilCandidates(db, {
    ...candidateParams,
    excludeQuestionIds: recentIds,
  })

  const selected = pickSpread(candidates, input.questionCount)

  const shortfalls: Array<{ section: string; reason: string }> = []
  if (selected.length < input.questionCount) {
    // Only worked out when the paper is short: how many eligible questions the 14-day rule held back.
    const recentlyUsed = recentIds.length === 0 ? 0 : (await questionsRepository.listCivilCandidates(db, { ...candidateParams, excludeQuestionIds: [] })).length - candidates.length
    shortfalls.push({
      section: 'Section A',
      reason:
        `${input.questionCount - selected.length} of ${input.questionCount} question(s) NOT printed -- ` +
        `the ${subject.name} bank has ${candidates.length} unseen question(s) for you` +
        (recentlyUsed > 0 ? ` (${recentlyUsed} more were in a paper of yours in the last ${RECENT_WINDOW_DAYS} days)` : ''),
    })
  }

  const blueprint = await ensureCivilBlueprint(db, {
    subjectId: subject.id,
    questionCount: input.questionCount,
  })
  const chapterIds = [...new Set(selected.map((s) => s.chapter_id))]

  const result = await db.transaction().execute(async (trx) => {
    const paper = await papersRepository.insert(trx, {
      student_id: input.studentId,
      blueprint_id: blueprint.id,
      blueprint_version: blueprint.version,
      subject_id: subject.id,
      chapter_ids: chapterIds,
      title: `${subject.name} practice (${selected.length} questions)`,
      total_marks: selected.length,
      duration_min: Math.ceil(selected.length * MINUTES_PER_QUESTION),
      weighting: JSON.stringify({ civil: true, requested: input.questionCount }),
      shortfalls: shortfalls.length > 0 ? JSON.stringify(shortfalls) : undefined,
    })

    const paperQuestions =
      selected.length > 0
        ? await paperQuestionsRepository.insertMany(
            trx,
            selected.map((item, index) => ({
              paper_id: paper.id,
              question_id: item.id,
              section: 'Section A',
              position: index + 1,
              marks: 1,
            })),
          )
        : []

    for (const item of selected) {
      await questionUsageRepository.insert(trx, {
        student_id: input.studentId,
        question_id: item.id,
        paper_id: paper.id,
      })
    }
    return { paper, paperQuestions, shortfalls }
  })

  return result
}
