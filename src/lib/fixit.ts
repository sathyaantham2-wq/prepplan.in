import { randomUUID } from 'node:crypto'
import type { Db } from '../db/connection'
import type { QuestionType } from '../db/enums'
import { fixitRepository } from '../db/repositories'
import type { FixitCardRow } from '../db/repositories'
import { captureError, describeError } from './error-log'
import { DAILY_CARD_LIMIT, nextSchedule } from './fixit-schedule'
import { fillBlankMatches, isObjectiveType } from './scoring'

// The student's Fix-it Deck: each concept she lost marks on becomes one card that returns on a
// spaced schedule until she can answer it (nextSchedule). Grading is here, on the server; the
// question sent to the browser never carries the key (T09). Once she has answered, her own answer
// has been checked, so the reply may show the right answer and the authored explanation.

export type FixitCause = 'knowledge' | 'habit'

export interface LostMarkItem {
  evaluationItemId: string
  conceptId: string
  marksAwarded: number
  marksMax: number
  knowledgeKnown: boolean | null
  errorType: string | null
}

/** Same split the app already uses: a mark the reviewer says she knew is a delivery habit. */
export function causeForItem(item: Pick<LostMarkItem, 'knowledgeKnown' | 'errorType'>): FixitCause {
  if (item.knowledgeKnown === true) return 'habit'
  if (item.errorType === 'Reading Discipline') return 'habit'
  return 'knowledge'
}

/**
 * Called from confirmEvaluation() inside its transaction, next to the points ledger. A lost mark
 * opens a card for its concept (or re-opens a mastered one); an active card is left alone. It runs
 * under a savepoint so a failure here is recorded and rolled back without undoing the marks.
 * Must be called with a transaction.
 */
export async function recordFixitCardsForLostMarks(db: Db, studentId: string, items: Array<LostMarkItem>): Promise<void> {
  const lost = items.filter((i) => i.marksMax > 0 && i.marksAwarded < i.marksMax)
  if (lost.length === 0) return
  await fixitRepository.savepoint(db, 'start')
  try {
    const seen = new Set<string>()
    for (const item of lost) {
      if (seen.has(item.conceptId)) continue
      seen.add(item.conceptId)
      await fixitRepository.upsertForLostMark(db, {
        studentId,
        conceptId: item.conceptId,
        evaluationItemId: item.evaluationItemId,
        cause: causeForItem(item),
      })
    }
    await fixitRepository.savepoint(db, 'release')
  } catch (error) {
    await fixitRepository.savepoint(db, 'rollback')
    const { message, stack } = describeError(error)
    await captureError({ requestId: randomUUID(), source: 'server', route: 'evaluation-confirm:fixit-cards', message, stack })
  }
}

/** First time she opens the deck with no cards ever: cards from her last 30 days of lost marks (max 10). */
export async function ensureFixitBackfill(db: Db, studentId: string): Promise<void> {
  if ((await fixitRepository.countAll(db, studentId)) > 0) return
  const lost = await fixitRepository.recentLostItems(db, studentId, 10)
  for (const row of lost) {
    await fixitRepository.upsertForLostMark(db, {
      studentId,
      conceptId: row.concept_id,
      evaluationItemId: row.evaluation_item_id,
      cause: causeForItem({ knowledgeKnown: row.knowledge_known, errorType: row.error_type }),
    })
  }
}

export interface FixitSummary {
  due: number
  answered_today: number
  mastered_total: number
  /** Every card she has ever had, of any status. 0 means she has not had a marked paper with lost marks yet. */
  total_cards_ever: number
}

/** Numbers for the student home. `due` is what the deck would serve right now (at most 3 a day). */
export async function getFixitSummary(db: Db, studentId: string): Promise<FixitSummary> {
  const [dueTotal, answeredToday, mastered, totalEver] = await Promise.all([
    fixitRepository.countDue(db, studentId),
    fixitRepository.countAnsweredToday(db, studentId),
    fixitRepository.countMastered(db, studentId),
    fixitRepository.countAll(db, studentId),
  ])
  return {
    due: Math.min(dueTotal, Math.max(0, DAILY_CARD_LIMIT - answeredToday)),
    answered_today: answeredToday,
    mastered_total: mastered,
    total_cards_ever: totalEver,
  }
}

export interface FixitQuestionView {
  id: string
  type: QuestionType
  text: string
  marks: number
  options?: Array<{ label: string; text: string }>
}

export interface FixitCardView {
  id: string
  concept_name: string
  subject_name: string
  why: FixitCause | null
  question: FixitQuestionView
}

async function loadQuestionView(db: Db, questionId: string): Promise<FixitQuestionView | null> {
  const q = await db
    .selectFrom('questions')
    .select(['id', 'type', 'text', 'marks'])
    .where('id', '=', questionId)
    .executeTakeFirst()
  if (!q) return null
  const view: FixitQuestionView = { id: q.id, type: q.type, text: q.text, marks: q.marks }
  if (q.type !== 'fill_blank') {
    // is_correct is deliberately not selected.
    const options = await db
      .selectFrom('question_options')
      .select(['label', 'text'])
      .where('question_id', '=', q.id)
      .orderBy('order_index')
      .execute()
    view.options = options
  }
  return view
}

/** Picks and pins today's question for a card (stable across reloads the same day). */
async function servedQuestionFor(db: Db, studentId: string, card: FixitCardRow, today: string): Promise<string | null> {
  if (card.served_question_id && card.served_on === today) return card.served_question_id
  const picked = await fixitRepository.pickQuestion(db, studentId, card.id, card.concept_id)
  if (picked) await fixitRepository.setServed(db, studentId, card.id, picked)
  return picked
}

export async function getFixitToday(db: Db, studentId: string) {
  await ensureFixitBackfill(db, studentId)
  const today = await fixitRepository.today(db)
  const [dueTotal, answeredToday] = await Promise.all([
    fixitRepository.countDue(db, studentId),
    fixitRepository.countAnsweredToday(db, studentId),
  ])
  const due = await fixitRepository.listDue(db, studentId, Math.max(0, DAILY_CARD_LIMIT - answeredToday))
  const cards: Array<FixitCardView> = []
  for (const card of due) {
    const questionId = await servedQuestionFor(db, studentId, card, today)
    const question = questionId ? await loadQuestionView(db, questionId) : null
    if (!question) continue
    cards.push({
      id: card.id,
      concept_name: card.concept_name,
      subject_name: card.subject_name,
      why: card.cause,
      question,
    })
  }
  return { due_total: dueTotal, answered_today: answeredToday, cards }
}

export type FixitAnswerResult =
  | { error: 'not_found' | 'not_served' | 'not_due' | 'bad_answer' }
  | {
      correct: boolean
      correct_answer_text: string
      explanation: string | null
      next: { id: string; stage: number; due_on: string; status: 'active' | 'mastered' }
    }

export async function answerFixitCard(
  db: Db,
  studentId: string,
  cardId: string,
  questionId: string,
  answer: string,
): Promise<FixitAnswerResult> {
  const card = await fixitRepository.findOwn(db, studentId, cardId)
  if (!card) return { error: 'not_found' }
  const today = await fixitRepository.today(db)
  if (card.status !== 'active' || card.due_on > today) return { error: 'not_due' }
  if (!card.served_question_id || card.served_on !== today || card.served_question_id !== questionId) {
    return { error: 'not_served' }
  }
  const q = await db.selectFrom('questions').selectAll().where('id', '=', questionId).executeTakeFirst()
  if (!q || !isObjectiveType(q.type)) return { error: 'not_served' }

  let correct: boolean
  let correctText: string
  if (q.type === 'fill_blank') {
    if (!answer.trim()) return { error: 'bad_answer' }
    correct = fillBlankMatches(answer, q.answer)
    correctText = q.answer
  } else {
    const options = await db
      .selectFrom('question_options')
      .select(['label', 'text', 'is_correct'])
      .where('question_id', '=', q.id)
      .orderBy('order_index')
      .execute()
    if (!options.some((o) => o.label === answer)) return { error: 'bad_answer' }
    const right = options.filter((o) => o.is_correct)
    correct = right.some((o) => o.label === answer)
    correctText = right.map((o) => `${o.label}. ${o.text}`).join('; ')
  }

  const schedule = nextSchedule(card.stage, correct, today)
  await db.transaction().execute(async (trx) => {
    await fixitRepository.applyAnswer(trx, {
      studentId,
      cardId,
      questionId,
      correct,
      stage: schedule.stage,
      dueOn: schedule.due_on,
      status: schedule.status,
    })
  })
  const explanation = await db
    .selectFrom('question_explanations')
    .select('explanation')
    .where('question_id', '=', q.id)
    .executeTakeFirst()
  return {
    correct,
    correct_answer_text: correctText,
    explanation: explanation?.explanation ?? null,
    next: { id: cardId, stage: schedule.stage, due_on: schedule.due_on, status: schedule.status },
  }
}
