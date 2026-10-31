import type { Db } from '../../db/connection'
import type { SchoolScope } from '../../db/school-scope'
import { SchoolError } from './common'
import { viewerFor } from './progress'
import type { Viewer } from './progress'

// "Practise this" (owner direction 2026-10-31, "try first, a hint on request, then a fresh one on your own").
// The questions come from the bank for one topic she has met in an exam, never the questions that were in her
// exams. NOTHING IS SAVED: no attempt row, no mark, no mastery (plan section 15, D5). Whether she did it on her
// own or with a hint lives only in her browser for that sitting. The server's part is to hand out questions
// without their answers, and to give the one hint or the solution when she asks for it, and only for a question
// of a topic she has met.

export interface PracticeItem {
  id: string
  text: string
  type: 'mcq' | 'short_answer'
  marks: number
  options: Array<{ label: string; text: string }>
}
export interface PracticeRound {
  first: PracticeItem
  /** A different question on the same idea, for her to do on her own. */
  fresh: PracticeItem | null
}

const SPECIAL = ['figure', 'map', 'case_study']
const KEY = /^([ch]):([0-9a-f-]{36})$/

interface Topic {
  viewer: Viewer
  label: string
  conceptIds: Array<string>
  /** The bank questions that were in her own exams: left out. */
  used: Set<string>
}

/** The topic, if she has met it in one of her exams; otherwise "not known" (the same answer for any other topic). */
export async function topicFor(
  db: Db,
  scope: SchoolScope,
  topicKey: string,
  childId?: string | null,
): Promise<Topic> {
  const { viewer } = await viewerFor(db, scope, childId)
  const m = KEY.exec(topicKey)
  if (!m) throw new SchoolError('invalid', 'That topic is not known.')
  let label: string
  let conceptIds: Array<string>
  if (m[1] === 'c') {
    const c = await db.selectFrom('concepts').select(['id', 'name']).where('id', '=', m[2]).executeTakeFirst()
    if (!c) throw new SchoolError('not_found', 'That topic is not known.')
    label = c.name
    conceptIds = [c.id]
  } else {
    const ch = await db.selectFrom('chapters').select(['id', 'name']).where('id', '=', m[2]).executeTakeFirst()
    if (!ch) throw new SchoolError('not_found', 'That topic is not known.')
    label = ch.name
    conceptIds = (await db.selectFrom('concepts').select('id').where('chapter_id', '=', ch.id).execute()).map((x) => x.id)
  }
  const met = await db
    .selectFrom('school_answer_marks as am')
    .innerJoin('school_own_questions as q', 'q.id', 'am.own_question_id')
    .leftJoin('school_exam_questions as eq', 'eq.id', 'q.source_exam_question_id')
    .leftJoin('questions as qq', 'qq.id', 'eq.question_id')
    .select(['q.chapter_id', 'qq.concept_id', 'eq.question_id'])
    .where('am.school_id', '=', scope.schoolId)
    .where('am.school_student_id', '=', viewer.studentId)
    .execute()
  const ok = m[1] === 'c' ? met.some((x) => x.concept_id === m[2]) : met.some((x) => x.chapter_id === m[2])
  if (!ok) throw new SchoolError('not_found', 'That topic is not known.')
  return {
    viewer,
    label,
    conceptIds,
    used: new Set(met.map((x) => x.question_id).filter((x): x is string => x !== null)),
  }
}

/** Bank questions for the topic that she may practise (not from her exams, no figure or map questions). */
export async function candidates(db: Db, topic: Topic, limit = 80) {
  if (topic.conceptIds.length === 0) return []
  const rows = await db
    .selectFrom('questions')
    .select(['id', 'concept_id', 'text', 'type', 'marks', 'answer', 'tags'])
    .where('concept_id', 'in', topic.conceptIds)
    .where('status', '=', 'approved')
    .where('type', 'in', ['mcq', 'short_answer'])
    .orderBy('marks')
    .limit(limit)
    .execute()
  return rows.filter((r) => !topic.used.has(r.id) && !r.tags.some((x) => SPECIAL.includes(x)))
}

/**
 * Up to three rounds. A round is two questions of the same kind on the same idea (the second is "a fresh one, on
 * your own"); where the bank has only one such question, the round has that one. No answers are included.
 */
export async function practiceSet(
  db: Db,
  scope: SchoolScope,
  topicKey: string,
  childId?: string | null,
  shuffle: (xs: Array<string>) => Array<string> = (xs) => [...xs].sort(() => Math.random() - 0.5),
) {
  const topic = await topicFor(db, scope, topicKey, childId)
  const rows = await candidates(db, topic)
  const opts = rows.length
    ? await db
        .selectFrom('question_options')
        .select(['question_id', 'label', 'text', 'order_index'])
        .where('question_id', 'in', rows.map((r) => r.id))
        .orderBy('order_index')
        .execute()
    : []
  const item = (r: (typeof rows)[number]): PracticeItem => ({
    id: r.id,
    text: r.text,
    type: r.type as 'mcq' | 'short_answer',
    marks: r.marks,
    options: opts.filter((o) => o.question_id === r.id).map((o) => ({ label: o.label, text: o.text })),
  })
  const groups = new Map<string, Array<(typeof rows)[number]>>()
  for (const r of rows) {
    const k = `${r.concept_id}|${r.type}`
    groups.set(k, [...(groups.get(k) ?? []), r])
  }
  const rounds: Array<PracticeRound> = []
  for (const key of shuffle([...groups.keys()])) {
    const g = shuffle((groups.get(key) ?? []).map((x) => x.id)).map((id) => (groups.get(key) ?? []).find((x) => x.id === id)!)
    if (g.length >= 2) rounds.push({ first: item(g[0]), fresh: item(g[1]) })
    if (rounds.length === 3) break
  }
  if (rounds.length < 3)
    for (const key of shuffle([...groups.keys()])) {
      const g = groups.get(key) ?? []
      if (g.length === 1 && rounds.length < 3) rounds.push({ first: item(g[0]), fresh: null })
    }
  return { topic: { key: topicKey, label: topic.label }, rounds }
}

/** The one hint for a question: the first step of its marking scheme, or else the idea of its topic. */
export async function practiceHint(
  db: Db,
  scope: SchoolScope,
  topicKey: string,
  questionId: string,
  childId?: string | null,
): Promise<{ hint: string }> {
  const topic = await topicFor(db, scope, topicKey, childId)
  const q = (await candidates(db, topic, 400)).find((x) => x.id === questionId)
  if (!q) throw new SchoolError('not_found', 'That question is not available.')
  const step = await db
    .selectFrom('question_step_marks')
    .select('description')
    .where('question_id', '=', questionId)
    .orderBy('step_no')
    .executeTakeFirst()
  if (step) return { hint: step.description }
  const c = await db.selectFrom('concepts').select(['idea', 'rule']).where('id', '=', q.concept_id).executeTakeFirst()
  return { hint: c?.rule ?? c?.idea ?? 'Read the question again and write down what is given.' }
}

/**
 * Her turn is over (she chose, or she wrote it down): the answer, and the steps one by one for her to compare.
 * A multiple-choice answer is checked here; a written answer is compared by her against the steps (no AI, no
 * cost, nothing stored).
 */
export async function practiceCheck(
  db: Db,
  scope: SchoolScope,
  topicKey: string,
  questionId: string,
  chosen: string | null,
  childId?: string | null,
) {
  const topic = await topicFor(db, scope, topicKey, childId)
  const q = (await candidates(db, topic, 400)).find((x) => x.id === questionId)
  if (!q) throw new SchoolError('not_found', 'That question is not available.')
  const options = await db
    .selectFrom('question_options')
    .select(['label', 'text', 'is_correct'])
    .where('question_id', '=', questionId)
    .orderBy('order_index')
    .execute()
  const steps = await db
    .selectFrom('question_step_marks')
    .select(['step_no', 'description', 'marks'])
    .where('question_id', '=', questionId)
    .orderBy('step_no')
    .execute()
  const right = options.find((o) => o.is_correct)
  return {
    type: q.type,
    correct: q.type === 'mcq' && right ? chosen?.trim().toUpperCase() === right.label.toUpperCase() : null,
    answer: right ? `(${right.label}) ${right.text}` : q.answer,
    steps: steps.map((s) => ({ no: s.step_no, description: s.description, marks: s.marks })),
  }
}
