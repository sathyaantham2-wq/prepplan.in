import type { Db } from '../../db/connection'
import {
  bankRepository,
  questionOptionsRepository,
  questionStepMarksRepository,
  questionsRepository,
  schoolClassesRepository,
  schoolQuestionsRepository,
  schoolSubjectsRepository,
} from '../../db/repositories'
import type { SchoolScope } from '../../db/school-scope'
import type { BloomLevel, DifficultyTier } from '../../db/enums'
import { computeTextHash } from '../duplicate-detection'
import { SchoolError, auditSchool } from './common'
import { levelWord } from './exam-builder-check'
import { aiFor } from './own-paper-service'
import { requireSchoolTerms } from './terms'

/**
 * The school's own questions (docs/SCHOOLS_MODULE_PLAN.md section 16.13). A teacher writes a question for a class-subject
 * the school teaches; the AI suggests its chapter, topic and level and the teacher confirms them before saving, so no
 * question exists without a confirmed chapter and topic. It is stored as a `questions` row with status 'school' (so the
 * paper, the teacher copy and the marking read it like any bank question) and owned through `school_questions`. It is
 * never in the shared bank, never seen by another school and never used to train anything. The office and its maker can
 * retire it; nothing is deleted. Changing a question that is already on a paper makes a new question and retires the old
 * one, so a printed paper keeps exactly what it printed.
 */

export const OWN_TYPES = ['mcq', 'assertion_reason', 'fill_blank', 'short_answer', 'long_answer'] as const
export type OwnType = (typeof OWN_TYPES)[number]
const CHOICE: ReadonlyArray<string> = ['mcq', 'assertion_reason']
const BLOOMS: ReadonlyArray<BloomLevel> = ['Remember', 'Understand', 'Apply', 'Analyse', 'Evaluate', 'Create']
const DIFFICULTIES: ReadonlyArray<DifficultyTier> = ['Easy', 'Hard', 'Hardest']
const LABELS = ['A', 'B', 'C', 'D']

const READ = new Set(['school_admin', 'teacher', 'principal'])
const WRITE = new Set(['school_admin', 'teacher'])

export interface OwnQuestionInput {
  schoolSubjectId: string
  chapterId: string
  conceptId: string
  type: string
  marks: number
  text: string
  /** choice questions: exactly four, one correct */
  options?: Array<{ text: string; correct: boolean }>
  /** written questions: the model answer */
  answer?: string
  /** written questions of 2 marks or more: what earns each mark (they add up to the marks) */
  steps?: Array<{ description: string; marks: number }>
  bloom: string
  difficulty: string
  /** what the AI suggested, kept beside what the teacher confirmed */
  aiSuggestion?: unknown
}

// ---------------------------------------------------------------- who may do what

function mayTeach(scope: SchoolScope, bankSubjectId: string): boolean {
  return scope.pairs === 'all' || scope.pairs.some((p) => p.subjectId === bankSubjectId)
}

async function subjectFor(db: Db, scope: SchoolScope, schoolSubjectId: string, write: boolean) {
  if (!(write ? WRITE : READ).has(scope.role))
    throw new SchoolError('forbidden', write ? 'Only the school office and teachers can write questions.' : 'Only school staff can see these questions.')
  const ss = await schoolSubjectsRepository.findById(db, scope, schoolSubjectId)
  if (!ss || !mayTeach(scope, ss.subject_id)) throw new SchoolError('not_found', 'Subject not found.')
  const subject = await db.selectFrom('subjects').select(['id', 'name', 'board', 'class']).where('id', '=', ss.subject_id).executeTakeFirstOrThrow()
  const cls = await schoolClassesRepository.findById(db, scope, ss.class_id)
  return { ss, subject, grade: cls?.grade ?? subject.class }
}

/** The class-subjects this person may write for, with each chapter and its topics (the form's choices). */
export async function ownQuestionChoices(db: Db, scope: SchoolScope) {
  if (!READ.has(scope.role)) throw new SchoolError('forbidden', 'Only school staff can see these questions.')
  const [subjects, classes] = await Promise.all([schoolSubjectsRepository.list(db, scope), schoolClassesRepository.list(db, scope)])
  const mine = subjects.filter((s) => mayTeach(scope, s.subject_id))
  const names = mine.length
    ? await db.selectFrom('subjects').select(['id', 'name']).where('id', 'in', mine.map((s) => s.subject_id)).execute()
    : []
  const out = []
  for (const s of mine) {
    const grade = classes.find((c) => c.id === s.class_id)?.grade ?? 0
    const chapters = await bankRepository.chaptersForSubject(db, s.subject_id)
    const concepts = chapters.length
      ? await db.selectFrom('concepts').select(['id', 'chapter_id', 'code', 'name']).where('chapter_id', 'in', chapters.map((c) => c.id)).orderBy('code').execute()
      : []
    out.push({
      id: s.id,
      label: `Class ${grade} · ${names.find((n) => n.id === s.subject_id)?.name ?? ''}`,
      grade,
      chapters: chapters.map((c) => ({
        id: c.id,
        label: `${chapters.some((x) => x.chapterNo === c.chapterNo && x.part !== c.part) ? `Part ${c.part} · ` : ''}Chapter ${c.chapterNo} · ${c.name}`,
        topics: concepts.filter((k) => k.chapter_id === c.id).map((k) => ({ id: k.id, name: k.name })),
      })),
    })
  }
  return { subjects: out.sort((a, b) => a.grade - b.grade || a.label.localeCompare(b.label)), mayWrite: WRITE.has(scope.role) }
}

// ---------------------------------------------------------------- the AI's suggestion

/** The chapter, topic and level the AI thinks a question tests. Only a suggestion: the teacher picks before saving. */
export async function suggestTags(
  db: Db,
  scope: SchoolScope,
  input: { schoolSubjectId: string; text: string; type: string; marks: number; options?: Array<{ text: string }> },
) {
  await requireSchoolTerms(db, scope)
  const { ss, subject, grade } = await subjectFor(db, scope, input.schoolSubjectId, true)
  const text = input.text.trim()
  if (text.length < 5) throw new SchoolError('invalid', 'Write the question first.')
  const chapters = await bankRepository.chaptersForSubject(db, ss.subject_id)
  const concepts = chapters.length
    ? await db.selectFrom('concepts').select(['id', 'chapter_id', 'name']).where('chapter_id', 'in', chapters.map((c) => c.id)).orderBy('code').execute()
    : []
  // short codes keep the prompt small and the answer easy to check
  const coded = chapters.map((c, i) => ({
    code: `C${i + 1}`,
    id: c.id,
    label: `Chapter ${c.chapterNo} · ${c.name}`,
    topics: concepts.filter((k) => k.chapter_id === c.id).map((k, j) => ({ code: `C${i + 1}.${j + 1}`, id: k.id, name: k.name })),
  }))
  const ai = await aiFor(db, scope)
  if (!ai.available()) throw new SchoolError('conflict', 'The AI helper is not switched on. Choose the chapter and topic yourself.')
  const raw = await ai.tag({
    text,
    type: String(input.type),
    marks: Number(input.marks) || 1,
    options: (input.options ?? []).map((o, i) => ({ label: LABELS[i] ?? String(i + 1), text: o.text })),
    chapters: coded.map((c) => ({ code: c.code, label: c.label, topics: c.topics.map((t) => ({ code: t.code, name: t.name })) })),
    subject: subject.name,
    grade,
  })
  let parsed: { chapter?: unknown; topic?: unknown; bloom?: unknown; difficulty?: unknown; confidence?: unknown } = {}
  try {
    parsed = JSON.parse(raw) as typeof parsed
  } catch {
    throw new SchoolError('conflict', 'The AI helper gave an answer that could not be read. Choose the chapter and topic yourself.')
  }
  const chapter = coded.find((c) => c.code === parsed.chapter)
  const topic = chapter?.topics.find((t) => t.code === parsed.topic)
  const bloom = BLOOMS.includes(parsed.bloom as BloomLevel) ? (parsed.bloom as BloomLevel) : null
  const difficulty = DIFFICULTIES.includes(parsed.difficulty as DifficultyTier) ? (parsed.difficulty as DifficultyTier) : null
  const confidence = typeof parsed.confidence === 'number' ? Math.max(0, Math.min(1, parsed.confidence)) : null
  return {
    chapterId: chapter?.id ?? null,
    conceptId: topic?.id ?? null,
    bloom,
    difficulty,
    confidence,
    message: chapter
      ? 'Suggested. Check the chapter, topic and level, and change anything that is wrong.'
      : 'The AI helper could not match a chapter. Choose it yourself.',
  }
}

// ---------------------------------------------------------------- checking and saving

function checked(input: OwnQuestionInput) {
  const type = input.type as OwnType
  if (!OWN_TYPES.includes(type)) throw new SchoolError('invalid', 'Choose the kind of question.')
  const marks = Number(input.marks)
  if (!Number.isInteger(marks) || marks < 1 || marks > 10) throw new SchoolError('invalid', 'Marks must be a whole number from 1 to 10.')
  const text = input.text.trim()
  if (text.length < 5 || text.length > 3000) throw new SchoolError('invalid', 'Write the question (5 to 3000 characters).')
  if (!BLOOMS.includes(input.bloom as BloomLevel)) throw new SchoolError('invalid', 'Choose the level of the question.')
  if (!DIFFICULTIES.includes(input.difficulty as DifficultyTier)) throw new SchoolError('invalid', 'Choose how hard the question is.')
  if (!input.chapterId || !input.conceptId) throw new SchoolError('invalid', 'Choose the chapter and the topic the question tests.')
  if (CHOICE.includes(type)) {
    const options = (input.options ?? []).map((o) => ({ text: o.text.trim(), correct: o.correct }))
    if (options.length !== 4 || options.some((o) => !o.text)) throw new SchoolError('invalid', 'Write all four options.')
    if (options.filter((o) => o.correct).length !== 1) throw new SchoolError('invalid', 'Mark exactly one option as the right answer.')
    if (marks !== 1) throw new SchoolError('invalid', 'A choice question carries 1 mark.')
    const right = options.findIndex((o) => o.correct)
    return { type, marks, text, options, answer: `(${LABELS[right]}) ${options[right].text}`, steps: [] as Array<{ description: string; marks: number }> }
  }
  const answer = (input.answer ?? '').trim()
  if (!answer) throw new SchoolError('invalid', 'Write the answer the teacher will mark against.')
  const steps = (input.steps ?? [])
    .map((s) => ({ description: s.description.trim(), marks: Number(s.marks) }))
    .filter((s) => s.description)
  if (marks >= 2) {
    if (steps.length === 0) throw new SchoolError('invalid', 'Write what earns each mark (at least one step).')
    if (steps.some((s) => !(s.marks > 0) || Math.round(s.marks * 2) !== s.marks * 2))
      throw new SchoolError('invalid', 'Each step needs marks (whole or half marks).')
    const sum = steps.reduce((n, s) => n + s.marks, 0)
    if (sum !== marks) throw new SchoolError('invalid', `The steps add up to ${sum} marks; the question carries ${marks}.`)
  }
  return { type, marks, text, options: [] as Array<{ text: string; correct: boolean }>, answer, steps: marks >= 2 ? steps : [] }
}

/** Is this question on any paper of the school (a finished version or a paper being made)? */
async function onAPaper(db: Db, scope: SchoolScope, questionId: string): Promise<boolean> {
  const live = await db
    .selectFrom('school_exam_questions')
    .select('id')
    .where('school_id', '=', scope.schoolId)
    .where('question_id', '=', questionId)
    .executeTakeFirst()
  if (live) return true
  const printed = await db
    .selectFrom('school_exam_versions')
    .select('id')
    .where('school_id', '=', scope.schoolId)
    .where('questions', '@>', JSON.stringify([{ question_id: questionId }]) as never)
    .executeTakeFirst()
  return printed !== undefined
}

/** Write a new question (no id) or change one (id). Returns the id of the school question that now holds it. */
export async function saveOwnQuestion(db: Db, scope: SchoolScope, input: OwnQuestionInput, id?: string) {
  await requireSchoolTerms(db, scope)
  const { ss, subject } = await subjectFor(db, scope, input.schoolSubjectId, true)
  const q = checked(input)
  const chapters = await bankRepository.chaptersForSubject(db, ss.subject_id)
  if (!chapters.some((c) => c.id === input.chapterId)) throw new SchoolError('invalid', 'That chapter is not in this subject.')
  const concept = await db.selectFrom('concepts').select(['id', 'chapter_id']).where('id', '=', input.conceptId).executeTakeFirst()
  if (!concept || concept.chapter_id !== input.chapterId) throw new SchoolError('invalid', 'That topic is not in this chapter.')

  const old = id ? await schoolQuestionsRepository.findById(db, scope, id) : undefined
  if (id && (!old || old.retired_at)) throw new SchoolError('not_found', 'Question not found.')
  if (old && scope.role !== 'school_admin' && old.created_by_user_id !== scope.userId)
    throw new SchoolError('forbidden', 'Only the teacher who wrote this question and the school office can change it.')

  return db.transaction().execute(async (trx) => {
    const question = await questionsRepository.insert(trx, {
      concept_id: input.conceptId,
      board: subject.board,
      class: subject.class,
      bloom: input.bloom as BloomLevel,
      difficulty: input.difficulty as DifficultyTier,
      marks: q.marks,
      type: q.type,
      text: q.text,
      text_hash: computeTextHash(q.text),
      answer: q.answer,
      status: 'school',
      origin: 'school',
      created_by: scope.userId,
      tags: [],
    })
    for (const [i, o] of q.options.entries())
      await questionOptionsRepository.insert(trx, { question_id: question.id, label: LABELS[i], text: o.text, is_correct: o.correct, order_index: i })
    for (const [i, s] of q.steps.entries())
      await questionStepMarksRepository.insert(trx, { question_id: question.id, step_no: i + 1, description: s.description, marks: s.marks })
    const row = await schoolQuestionsRepository.insert(trx, scope, {
      question_id: question.id,
      school_subject_id: ss.id,
      chapter_id: input.chapterId,
      created_by_user_id: old ? old.created_by_user_id : scope.userId,
      ai_suggestion: input.aiSuggestion === undefined ? null : JSON.stringify(input.aiSuggestion),
    })
    if (old) {
      // the old question stays exactly as printed; papers still being made take the new one
      await schoolQuestionsRepository.update(trx, scope, old.id, { retired_at: new Date(), retired_by_user_id: scope.userId, replaced_by_id: row.id })
      const printed = await onAPaper(trx, scope, old.question_id)
      await trx
        .updateTable('school_exam_questions')
        .set({ question_id: question.id, chapter_id: input.chapterId })
        .where('school_id', '=', scope.schoolId)
        .where('question_id', '=', old.question_id)
        .where('exam_id', 'in', (eb) => eb.selectFrom('school_exams').select('id').where('school_id', '=', scope.schoolId).where('stage', '=', 'building'))
        .execute()
      await auditSchool(trx, scope, 'school.own_question_changed', 'school_questions', row.id, { id: old.id, question_id: old.question_id }, { question_id: question.id, was_printed: printed })
    } else {
      await auditSchool(trx, scope, 'school.own_question_added', 'school_questions', row.id, null, { question_id: question.id, type: q.type, marks: q.marks })
    }
    return { id: row.id, message: old ? 'Saved. Papers already finished keep the question as it was printed.' : 'Saved. It can now be picked in "Make paper".' }
  })
}

/** Take a question out of the picker. It stays on every paper that already has it; nothing is deleted. */
export async function retireOwnQuestion(db: Db, scope: SchoolScope, id: string) {
  if (!WRITE.has(scope.role)) throw new SchoolError('forbidden', 'Only the school office and teachers can do this.')
  const row = await schoolQuestionsRepository.findById(db, scope, id)
  if (!row || row.retired_at) throw new SchoolError('not_found', 'Question not found.')
  await subjectFor(db, scope, row.school_subject_id, true)
  if (scope.role !== 'school_admin' && row.created_by_user_id !== scope.userId)
    throw new SchoolError('forbidden', 'Only the teacher who wrote this question and the school office can retire it.')
  await db.transaction().execute(async (trx) => {
    await schoolQuestionsRepository.update(trx, scope, id, { retired_at: new Date(), retired_by_user_id: scope.userId })
    await auditSchool(trx, scope, 'school.own_question_retired', 'school_questions', id, null, { question_id: row.question_id })
  })
  return { message: 'Retired. It is no longer offered in "Make paper"; papers that have it keep it.' }
}

// ---------------------------------------------------------------- the list

export interface OwnQuestionFilters {
  schoolSubjectId?: string | null
  chapterId?: string | null
  q?: string | null
  retired?: boolean
}

export async function listOwnQuestions(db: Db, scope: SchoolScope, f: OwnQuestionFilters) {
  const { subjects, mayWrite } = await ownQuestionChoices(db, scope)
  const allowed = subjects.map((s) => s.id)
  if (allowed.length === 0) return { questions: [], subjects, mayWrite }
  let query = db
    .selectFrom('school_questions as sq')
    .innerJoin('questions as q', 'q.id', 'sq.question_id')
    .innerJoin('concepts as c', 'c.id', 'q.concept_id')
    .leftJoin('users as u', 'u.id', 'sq.created_by_user_id')
    .select([
      'sq.id as id',
      'sq.question_id as question_id',
      'sq.school_subject_id as school_subject_id',
      'sq.chapter_id as chapter_id',
      'sq.created_by_user_id as created_by_user_id',
      'sq.created_at as created_at',
      'sq.retired_at as retired_at',
      'q.text as text',
      'q.type as type',
      'q.marks as marks',
      'q.bloom as bloom',
      'q.difficulty as difficulty',
      'q.answer as answer',
      'q.concept_id as concept_id',
      'c.name as topic',
      'u.name as author',
    ])
    .where('sq.school_id', '=', scope.schoolId)
    .where('sq.school_subject_id', 'in', allowed)
  if (f.schoolSubjectId) query = query.where('sq.school_subject_id', '=', f.schoolSubjectId)
  if (f.chapterId) query = query.where('sq.chapter_id', '=', f.chapterId)
  if (f.q?.trim()) query = query.where('q.text', 'ilike', `%${f.q.trim().replace(/[%_]/g, '')}%`)
  query = f.retired ? query.where('sq.retired_at', 'is not', null).where('sq.replaced_by_id', 'is', null) : query.where('sq.retired_at', 'is', null)
  const rows = await query.orderBy('sq.created_at', 'desc').limit(500).execute()
  const ids = rows.map((r) => r.question_id)
  const [options, steps] = await Promise.all([
    ids.length ? db.selectFrom('question_options').select(['question_id', 'label', 'text', 'is_correct', 'order_index']).where('question_id', 'in', ids).orderBy('order_index').execute() : [],
    ids.length ? db.selectFrom('question_step_marks').select(['question_id', 'step_no', 'description', 'marks']).where('question_id', 'in', ids).orderBy('step_no').execute() : [],
  ])
  const used = new Map<string, number>()
  if (ids.length) {
    const live = await db
      .selectFrom('school_exam_questions')
      .select(['question_id', 'exam_id'])
      .where('school_id', '=', scope.schoolId)
      .where('question_id', 'in', ids)
      .execute()
    for (const id of ids) used.set(id, new Set(live.filter((l) => l.question_id === id).map((l) => l.exam_id)).size)
  }
  return {
    subjects,
    mayWrite,
    questions: rows.map((r) => {
      const subject = subjects.find((s) => s.id === r.school_subject_id)
      return {
        id: r.id,
        schoolSubjectId: r.school_subject_id,
        subject: subject?.label ?? '',
        chapterId: r.chapter_id,
        chapter: subject?.chapters.find((c) => c.id === r.chapter_id)?.label ?? '',
        conceptId: r.concept_id,
        topic: r.topic,
        text: r.text,
        type: r.type,
        marks: Number(r.marks),
        bloom: r.bloom,
        level: levelWord(r.bloom),
        difficulty: r.difficulty,
        answer: r.answer,
        options: options.filter((o) => o.question_id === r.question_id).map((o) => ({ text: o.text, correct: o.is_correct })),
        steps: steps.filter((s) => s.question_id === r.question_id).map((s) => ({ description: s.description, marks: Number(s.marks) })),
        author: r.author ?? '',
        createdAt: r.created_at.toISOString(),
        retired: r.retired_at !== null,
        onPapers: used.get(r.question_id) ?? 0,
        mayChange: mayWrite && !r.retired_at && (scope.role === 'school_admin' || r.created_by_user_id === scope.userId),
      }
    }),
  }
}

const text = (v: unknown): string => (typeof v === 'string' ? v : '')

/** A request body, read into the shape saveOwnQuestion checks (anything missing becomes empty and is refused there). */
export function ownQuestionInputFrom(b: Record<string, unknown> | null): OwnQuestionInput {
  const list = (v: unknown): Array<Record<string, unknown>> =>
    Array.isArray(v) ? v.filter((x): x is Record<string, unknown> => !!x && typeof x === 'object').slice(0, 10) : []
  return {
    schoolSubjectId: text(b?.schoolSubjectId),
    chapterId: text(b?.chapterId),
    conceptId: text(b?.conceptId),
    type: text(b?.type),
    marks: Number(b?.marks),
    text: text(b?.text),
    options: list(b?.options).map((o) => ({ text: text(o.text), correct: o.correct === true })),
    answer: text(b?.answer),
    steps: list(b?.steps).map((s) => ({ description: text(s.description), marks: Number(s.marks) })),
    bloom: text(b?.bloom),
    difficulty: text(b?.difficulty),
    aiSuggestion: b?.aiSuggestion && typeof b.aiSuggestion === 'object' ? b.aiSuggestion : undefined,
  }
}
