import type { Db } from '../../db/connection'
import { bankRepository, examBuilderRepository, examPrintRepository, schoolExamsRepository, schoolQuestionsRepository, usableBySchool } from '../../db/repositories'
import type { SchoolScope } from '../../db/school-scope'
import type { BloomLevel, DifficultyTier, QuestionType } from '../../db/enums'
import { SPECIAL_TAGS, checkPaperStructure, expectedWordsFor, levelOfBloom } from '../school-paper'
import type { Layout, LayoutSection } from '../school-paper'
import { SchoolError, auditSchool } from './common'
import { checkPaper, fitsSlot, levelWord, renumber, slotKey } from './exam-builder-check'
import type { BuilderPick, Checklist } from './exam-builder-check'
import { isWrittenSlot } from './exam-paper'
import { loadExam } from './exam-service'
import { schoolYearStart } from './today'
import { normalizeMix, pickNext } from './fill-rank'
import type { DifficultyMix } from './fill-rank'

/**
 * Teacher control over the questions of a paper (docs/SCHOOLS_MODULE_PLAN.md section 16). A paper in the "building"
 * stage is edited question by question (add, remove, lock, reorder, swap, refill); "finalize" checks it, records the
 * exact questions as a new version (append-only) and makes it the paper that is printed. A finished paper can be
 * reopened; finishing it again makes the next version. The teacher copy is always made from the current questions.
 */

export type BuilderMode = 'quick' | 'auto_edit' | 'hand_pick'

interface ChapterInfo {
  id: string
  label: string
  short: string
  conceptIds: Array<string>
}

interface Ctx {
  exam: Awaited<ReturnType<typeof loadExam>>['exam']
  layout: Layout
  chapters: Array<ChapterInfo>
  chapterOfConcept: Map<string, string>
}

export interface PickView {
  id: string
  questionId: string
  position: number
  section: string
  slot: string
  marks: number
  type: QuestionType
  text: string
  difficulty: DifficultyTier
  bloom: BloomLevel
  level: 'Remember' | 'Think'
  chapterId: string
  chapter: string
  isAlternate: boolean
  choiceGroup: string | null
  locked: boolean
  /** the school's own question (section 16.13), not one from the PrepPlan bank */
  ours: boolean
  options: Array<{ label: string; text: string }>
}

// ---------------------------------------------------------------- loading

const STAFF_WRITE = new Set(['school_admin', 'teacher'])

async function context(db: Db, scope: SchoolScope, examId: string, write: boolean): Promise<Ctx> {
  if (write && !STAFF_WRITE.has(scope.role))
    throw new SchoolError('forbidden', 'Only the school office and the teacher of this subject can change a paper.')
  const { exam } = await loadExam(db, scope, examId, write ? 'handle' : 'paper')
  // a paper still being made is the maker's and the office's (owner decision 2026-11-03)
  if (exam.stage === 'building' && scope.role !== 'school_admin' && exam.created_by_user_id !== scope.userId)
    throw new SchoolError('not_found', 'Exam not found.')
  const layout = exam.layout as unknown as Layout
  const all = await bankRepository.chaptersForSubject(db, exam.subject_id)
  const conceptRows = await examPrintRepository.conceptCounts(db, exam.chapter_ids)
  const chapters = exam.chapter_ids
    .map((id) => all.find((c) => c.id === id))
    .filter((c): c is NonNullable<typeof c> => !!c)
    .map((c) => ({
      id: c.id,
      label: `Part ${c.part} · Chapter ${c.chapterNo} · ${c.name}`,
      short: `Ch ${c.chapterNo}${all.some((x) => x.chapterNo === c.chapterNo && x.part !== c.part) ? ` (Part ${c.part})` : ''}`,
      conceptIds: conceptRows.filter((r) => r.chapter_id === c.id).map((r) => r.id),
    }))
  const chapterOfConcept = new Map<string, string>()
  for (const c of chapters) for (const id of c.conceptIds) chapterOfConcept.set(id, c.id)
  return { exam, layout, chapters, chapterOfConcept }
}

function assertBuilding(ctx: Ctx) {
  if (ctx.exam.stage !== 'building')
    throw new SchoolError('conflict', 'This paper is finished. Press "Change this paper" to edit it again.')
}

async function picksOf(db: Db, scope: SchoolScope, ctx: Ctx): Promise<Array<PickView>> {
  const rows = await db
    .selectFrom('school_exam_questions as p')
    .innerJoin('questions as q', 'q.id', 'p.question_id')
    .select([
      'p.id as id',
      'p.question_id as question_id',
      'p.position as position',
      'p.section as section',
      'p.slot as slot',
      'p.marks as marks',
      'p.is_alternate as is_alternate',
      'p.choice_group as choice_group',
      'p.locked as locked',
      'p.chapter_id as chapter_id',
      'q.type as type',
      'q.text as text',
      'q.difficulty as difficulty',
      'q.bloom as bloom',
      'q.status as status',
    ])
    .where('p.school_id', '=', scope.schoolId)
    .where('p.exam_id', '=', ctx.exam.id)
    .orderBy('p.position')
    .orderBy('p.is_alternate')
    .execute()
  const options = await examPrintRepository.optionsFor(db, rows.map((r) => r.question_id))
  return rows.map((r) => ({
    id: r.id,
    questionId: r.question_id,
    position: r.position,
    section: r.section,
    slot: r.slot,
    marks: Number(r.marks),
    type: r.type,
    text: r.text,
    difficulty: r.difficulty,
    bloom: r.bloom,
    level: levelWord(r.bloom),
    chapterId: r.chapter_id,
    chapter: ctx.chapters.find((c) => c.id === r.chapter_id)?.short ?? '',
    isAlternate: r.is_alternate,
    choiceGroup: r.choice_group,
    locked: r.locked,
    ours: r.status === 'school',
    // the student's paper prints the options; which one is right is never sent here
    options: options.filter((o) => o.question_id === r.question_id).map((o) => ({ label: o.label, text: o.text })),
  }))
}

function toBuilderPicks(picks: ReadonlyArray<PickView>): Array<BuilderPick> {
  return picks.map((p) => ({
    questionId: p.questionId,
    section: p.section,
    slot: p.slot,
    marks: p.marks,
    type: p.type,
    chapterId: p.chapterId,
    bloom: p.bloom,
    isAlternate: p.isAlternate,
    choiceGroup: p.choiceGroup,
  }))
}

// ---------------------------------------------------------------- what the bank has

interface Candidate {
  id: string
  concept_id: string
  type: QuestionType
  marks: number
  difficulty: DifficultyTier
  bloom: BloomLevel
  tags: Array<string>
  diagram_kind: string | null
}

/** May this bank question go into this slot (marks, type, and the special tags of case study, map and figure)? */
function questionFitsSlot(q: Pick<Candidate, 'marks' | 'type' | 'tags' | 'diagram_kind'>, s: LayoutSection): boolean {
  if (!fitsSlot(q, s)) return false
  const special = q.tags.filter((t) => (SPECIAL_TAGS as ReadonlyArray<string>).includes(t) && t !== 'construction')
  if (s.tag) {
    if (!q.tags.includes(s.tag)) return false
    if ((s.tag === 'map' || s.tag === 'figure') && !q.diagram_kind) return false
    return special.every((t) => t === s.tag)
  }
  return special.length === 0
}

async function candidates(
  db: Db,
  schoolId: string,
  s: LayoutSection,
  conceptIds: ReadonlyArray<string>,
  exclude: ReadonlySet<string>,
  limit: number,
): Promise<Array<Candidate>> {
  if (conceptIds.length === 0 || limit <= 0) return []
  const rows = await examBuilderRepository.slotCandidates(db, {
    schoolId,
    conceptIds,
    marks: s.marks_per_question,
    blooms: s.bloom_allowed.length ? s.bloom_allowed : ['Remember', 'Understand', 'Apply', 'Analyse', 'Evaluate', 'Create'],
    types: s.types ?? [],
    exclude: [...exclude],
    limit: limit * 4,
  })
  return rows
    .map((r) => ({ ...r, marks: Number(r.marks), type: r.type, difficulty: r.difficulty, bloom: r.bloom, tags: r.tags }))
    .filter((r) => questionFitsSlot(r, s))
    .slice(0, limit)
}

/** Questions this school printed in other papers, with where and when (the "Used before" badge). */
async function usedBefore(
  db: Db,
  scope: SchoolScope,
  examId: string,
  questionIds: ReadonlyArray<string>,
): Promise<Map<string, Array<{ exam: string; section: string; at: string }>>> {
  const out = new Map<string, Array<{ exam: string; section: string; at: string }>>()
  if (questionIds.length === 0) return out
  const rows = await examBuilderRepository.usedBefore(db, scope, examId, questionIds)
  for (const r of rows) {
    const list = out.get(r.qid) ?? []
    if (!list.some((x) => x.exam === r.title && x.section === r.section))
      list.push({ exam: r.title, section: r.section, at: new Date(r.at).toISOString() })
    out.set(r.qid, list)
  }
  return out
}

/** Question ids this school printed since 1 April (avoided by Swap and the automatic fill while the bank has others). */
async function usedThisYear(db: Db, scope: SchoolScope, examId: string): Promise<Set<string>> {
  return new Set(await examBuilderRepository.usedSince(db, scope, examId, schoolYearStart(new Date())))
}

/** A bank question (shared or schools-only), or one of this school's own that is not retired (never another school's). */
async function usableHere(db: Db, scope: SchoolScope, q: { id: string; status: string }): Promise<boolean> {
  if (q.status === 'approved' || q.status === 'school_bank') return true
  if (q.status !== 'school') return false
  return (await schoolQuestionsRepository.activeByQuestion(db, scope, q.id)) !== undefined
}

// ---------------------------------------------------------------- the view

export async function builderView(db: Db, scope: SchoolScope, examId: string) {
  const ctx = await context(db, scope, examId, false)
  const picks = await picksOf(db, scope, ctx)
  const check = checkPaper(ctx.layout, toBuilderPicks(picks), ctx.chapters)
  const used = await usedBefore(db, scope, examId, picks.map((p) => p.questionId))
  // places still open that the bank could fill: until they are filled, "Make paper" waits
  const fillable = ctx.exam.stage === 'building' && !check.complete ? await stillFillable(db, ctx, check, picks) : []
  return {
    exam: {
      id: ctx.exam.id,
      title: ctx.exam.title,
      stage: ctx.exam.stage as 'building' | 'final',
      mode: ctx.exam.mode as BuilderMode,
      version: ctx.exam.version,
      setLabel: ctx.exam.set_label,
      durationMin: ctx.layout.duration_min,
      pattern: ctx.exam.template_name,
    },
    mayEdit: STAFF_WRITE.has(scope.role),
    sections: ctx.layout.sections.map((s) => ({
      key: slotKey({ section: s.name, slot: s.slot }),
      section: s.name,
      slot: s.slot,
      marks: s.marks_per_question,
      need: s.count,
      needOr: s.or_count ?? 0,
      types: s.types ?? [],
      tag: s.tag ?? null,
    })),
    chapters: ctx.chapters.map((c) => ({ id: c.id, label: c.label, short: c.short })),
    picks: picks.map((p) => ({ ...p, usedBefore: used.get(p.questionId) ?? [] })),
    check,
    fillable,
    /** every slot is full, or what is open the bank cannot fill (then it is printed as a gap) */
    canFinish: picks.length > 0 && !check.slots.some((x) => x.have > x.need) && (check.complete || fillable.length === 0),
  }
}

// ---------------------------------------------------------------- the bank panel

export interface BankFilters {
  type?: string | null
  marks?: number | null
  difficulty?: string | null
  bloom?: string | null
  level?: 'Remember' | 'Think' | null
  chapterId?: string | null
  q?: string | null
  hideUsed?: boolean
  page?: number
  answers?: boolean
  /** 'ours': only the school's own questions; 'bank': only PrepPlan's */
  source?: 'ours' | 'bank' | null
}

const PAGE = 25

export async function builderBank(db: Db, scope: SchoolScope, examId: string, f: BankFilters) {
  const ctx = await context(db, scope, examId, false)
  // answers and marking schemes are for the teacher and the office only (never a student, and not the principal here)
  const withAnswers = f.answers === true && STAFF_WRITE.has(scope.role)
  const conceptIds = (f.chapterId ? ctx.chapters.filter((c) => c.id === f.chapterId) : ctx.chapters).flatMap((c) => c.conceptIds)
  if (conceptIds.length === 0) return { total: 0, page: 0, pages: 0, questions: [] }
  let q = db
    .selectFrom('questions')
    .select(['id', 'concept_id', 'type', 'marks', 'difficulty', 'bloom', 'tags', 'diagram_kind', 'text', 'answer', 'status'])
    .where(usableBySchool(scope.schoolId))
    .where('concept_id', 'in', conceptIds)
  if (f.source === 'ours') q = q.where('status', '=', 'school')
  if (f.source === 'bank') q = q.where('status', 'in', ['approved', 'school_bank'])
  if (f.type) q = q.where('type', '=', f.type as QuestionType)
  if (f.marks) q = q.where('marks', '=', f.marks)
  if (f.difficulty) q = q.where('difficulty', '=', f.difficulty as DifficultyTier)
  if (f.bloom) q = q.where('bloom', '=', f.bloom as BloomLevel)
  if (f.level === 'Remember') q = q.where('bloom', 'in', ['Remember', 'Understand'])
  if (f.level === 'Think') q = q.where('bloom', 'in', ['Apply', 'Analyse', 'Evaluate', 'Create'])
  if (f.q?.trim()) q = q.where('text', 'ilike', `%${f.q.trim().replace(/[%_]/g, '')}%`)
  let rows = await q.orderBy('marks').orderBy('type').orderBy('id').execute()
  const picks = await picksOf(db, scope, ctx)
  const inPaper = new Set(picks.map((p) => p.questionId))
  const used = await usedBefore(db, scope, examId, rows.map((r) => r.id))
  if (f.hideUsed) rows = rows.filter((r) => !used.has(r.id))
  const total = rows.length
  const pages = Math.max(1, Math.ceil(total / PAGE))
  const page = Math.min(Math.max(0, f.page ?? 0), pages - 1)
  const slice = rows.slice(page * PAGE, page * PAGE + PAGE)
  const ids = slice.map((r) => r.id)
  const [options, steps] = await Promise.all([examPrintRepository.optionsFor(db, ids), withAnswers ? examPrintRepository.stepMarksFor(db, ids) : Promise.resolve([])])
  const check = checkPaper(ctx.layout, toBuilderPicks(picks), ctx.chapters)
  return {
    total,
    page,
    pages,
    questions: slice.map((r) => {
      const cand = { marks: Number(r.marks), type: r.type, tags: r.tags, diagram_kind: r.diagram_kind }
      const fits = ctx.layout.sections.filter((s) => questionFitsSlot(cand, s))
      const open = fits.filter((s) => {
        const st = check.slots.find((x) => x.section === s.name && x.slot === s.slot)
        return st && (st.have < st.need || st.haveOr < st.needOr)
      })
      const chapterId = ctx.chapterOfConcept.get(r.concept_id) ?? ''
      return {
        id: r.id,
        text: r.text,
        type: r.type,
        marks: Number(r.marks),
        difficulty: r.difficulty,
        bloom: r.bloom,
        level: levelWord(r.bloom),
        chapterId,
        chapter: ctx.chapters.find((c) => c.id === chapterId)?.short ?? '',
        ours: r.status === 'school',
        inPaper: inPaper.has(r.id),
        usedBefore: used.get(r.id) ?? [],
        fits: fits.map((s) => slotKey({ section: s.name, slot: s.slot })),
        openSlots: open.map((s) => ({ key: slotKey({ section: s.name, slot: s.slot }), section: s.name, slot: s.slot })),
        why:
          fits.length === 0
            ? 'No section of this pattern takes this kind of question.'
            : open.length === 0
              ? `${fits.map((s) => s.name).join(' and ')} ${fits.length === 1 ? 'is' : 'are'} already full.`
              : null,
        options: options.filter((o) => o.question_id === r.id).map((o) => ({ label: o.label, text: o.text, ...(withAnswers ? { correct: o.is_correct } : {}) })),
        ...(withAnswers
          ? { answer: r.answer, steps: steps.filter((s) => s.question_id === r.id).map((s) => ({ description: s.description, marks: Number(s.marks) })) }
          : {}),
      }
    }),
  }
}

// ---------------------------------------------------------------- changing the paper

export type BuilderAction =
  | { action: 'add'; questionId: string; slot?: string | null }
  | { action: 'remove'; pickId: string }
  | { action: 'lock'; pickId: string; locked: boolean }
  | { action: 'move'; pickId: string; direction: 'up' | 'down' }
  | { action: 'swap_options'; pickId: string; seen?: Array<string> }
  | { action: 'swap_to'; pickId: string; questionId: string }
  | { action: 'refill_unlocked'; difficultyMix?: Partial<DifficultyMix> }
  | { action: 'fill_rest'; difficultyMix?: Partial<DifficultyMix> }
  | { action: 'set_mode'; mode: BuilderMode }
  | { action: 'finalize' }
  | { action: 'reopen' }
  | { action: 'make_set_b'; kind: 'shuffle' | 'alternatives' }

async function touch(db: Db, scope: SchoolScope, examId: string) {
  await schoolExamsRepository.update(db, scope, examId, { edited_at: new Date() })
}

/** Writes positions 1..N back after a change (an OR pair shares its number). */
async function renumberAll(db: Db, scope: SchoolScope, ctx: Ctx) {
  const picks = await picksOf(db, scope, ctx)
  const fixed = renumber(
    ctx.layout,
    picks.map((p) => ({ ...p, order: p.position })),
  )
  const changed = fixed.filter((p) => p.position !== picks.find((x) => x.id === p.id)?.position)
  if (changed.length === 0) return
  // (exam, position, is_alternate) is unique: park the moving rows on free negative numbers first
  for (const [i, p] of changed.entries())
    await db.updateTable('school_exam_questions').set({ position: -1 - i }).where('school_id', '=', scope.schoolId).where('id', '=', p.id).execute()
  for (const p of changed)
    await db.updateTable('school_exam_questions').set({ position: p.position }).where('school_id', '=', scope.schoolId).where('id', '=', p.id).execute()
}

async function insertPick(
  db: Db,
  scope: SchoolScope,
  ctx: Ctx,
  q: { id: string; concept_id: string },
  s: LayoutSection,
  extra: { isAlternate: boolean; choiceGroup: string | null; position: number },
) {
  await db
    .insertInto('school_exam_questions')
    .values({
      school_id: scope.schoolId,
      exam_id: ctx.exam.id,
      question_id: q.id,
      chapter_id: ctx.chapterOfConcept.get(q.concept_id) ?? ctx.chapters[0].id,
      position: extra.position,
      is_alternate: extra.isAlternate,
      marks: s.marks_per_question,
      section: s.name,
      slot: s.slot,
      choice_group: extra.choiceGroup,
      expected_words: isWrittenSlot(s) ? expectedWordsFor(s.marks_per_question, ctx.layout.config) : null,
    })
    .execute()
}

/** Puts one question into a slot: as a new numbered question, or as the second option of an OR still waiting for one. */
async function place(db: Db, scope: SchoolScope, ctx: Ctx, q: { id: string; concept_id: string }, s: LayoutSection, picks: ReadonlyArray<PickView>) {
  const mine = picks.filter((p) => p.section === s.name && p.slot === s.slot)
  const primaries = mine.filter((p) => !p.isAlternate)
  const groups = primaries.filter((p) => p.choiceGroup)
  const waiting = groups.find((g) => !mine.some((p) => p.isAlternate && p.choiceGroup === g.choiceGroup))
  const end = Math.max(0, ...picks.map((p) => p.position)) + 1
  if (primaries.length < s.count) {
    // the first or_count questions of a slot are its OR questions
    const group = groups.length < (s.or_count ?? 0) ? `or-${crypto.randomUUID().slice(0, 8)}` : null
    await insertPick(db, scope, ctx, q, s, { isAlternate: false, choiceGroup: group, position: end })
    return 'question'
  }
  if (waiting) {
    await insertPick(db, scope, ctx, q, s, { isAlternate: true, choiceGroup: waiting.choiceGroup, position: waiting.position })
    return 'or'
  }
  throw new SchoolError('conflict', `${s.name} is already full.`)
}

/**
 * Fills every open place in the paper from the bank, keeping what is there. Spreads across chapters, honours the
 * difficulty mix and the template's thinking mix, shows every difficulty, and prefers questions this school has not
 * used (then the least recently used). The rule itself is in fill-rank.ts.
 */
async function fillOpen(db: Db, scope: SchoolScope, ctx: Ctx, difficultyMix?: Partial<DifficultyMix>) {
  const mix = normalizeMix(difficultyMix)
  const levelMix = ctx.layout.config.level_mix
  for (const s of ctx.layout.sections) {
    for (;;) {
      const picks = await picksOf(db, scope, ctx)
      const mine = picks.filter((p) => p.section === s.name && p.slot === s.slot)
      const have = mine.filter((p) => !p.isAlternate).length
      const haveOr = mine.filter((p) => p.isAlternate).length
      if (have >= s.count && haveOr >= (s.or_count ?? 0)) break
      const inPaper = new Set(picks.map((p) => p.questionId))
      // the chapter with the fewest marks so far goes first
      const marksBy = new Map(ctx.chapters.map((c) => [c.id, picks.filter((p) => p.chapterId === c.id && !p.isAlternate).reduce((n, p) => n + p.marks, 0)]))
      const order = [...ctx.chapters].sort((a, b) => (marksBy.get(a.id) ?? 0) - (marksBy.get(b.id) ?? 0))
      const state = { marksByDifficulty: {} as Record<string, number>, marksByLevel: {} as Record<string, number>, totalMarks: 0 }
      for (const p of picks.filter((x) => !x.isAlternate)) {
        state.marksByDifficulty[p.difficulty] = (state.marksByDifficulty[p.difficulty] ?? 0) + p.marks
        const l = levelOfBloom(p.bloom)
        state.marksByLevel[l] = (state.marksByLevel[l] ?? 0) + p.marks
        state.totalMarks += p.marks
      }
      let found: Candidate | undefined
      for (const c of order) {
        const pool = await candidates(db, ctx.exam.school_id, s, c.conceptIds, inPaper, 40)
        if (pool.length === 0) continue
        const used = await examBuilderRepository.lastUsedAt(db, scope, ctx.exam.id, pool.map((q) => q.id))
        found = pickNext(
          pool.map((q) => ({ ...q, lastUsedMs: used.get(q.id)?.getTime() ?? null })),
          state,
          mix,
          levelMix,
        )
        if (found) break
      }
      if (!found) break // the bank has nothing more for this slot: it stays open and is printed as a gap
      await place(db, scope, ctx, found, s, picks)
    }
  }
  await renumberAll(db, scope, ctx)
}

export async function builderAction(db: Db, scope: SchoolScope, examId: string, a: BuilderAction): Promise<{ message: string; options?: unknown }> {
  const ctx = await context(db, scope, examId, true)
  if (a.action === 'reopen') return reopen(db, scope, ctx)
  if (a.action === 'make_set_b') return makeSetB(db, scope, ctx, a.kind)
  if (a.action === 'set_mode') {
    if (!['quick', 'auto_edit', 'hand_pick'].includes(a.mode)) throw new SchoolError('invalid', 'Choose one of the three ways.')
    await schoolExamsRepository.update(db, scope, examId, { mode: a.mode })
    return { message: 'Saved.' }
  }
  assertBuilding(ctx)
  const picks = await picksOf(db, scope, ctx)
  const pick = 'pickId' in a ? picks.find((p) => p.id === a.pickId) : undefined
  if ('pickId' in a && !pick) throw new SchoolError('not_found', 'That question is no longer on the paper.')

  switch (a.action) {
    case 'add': {
      if (picks.some((p) => p.questionId === a.questionId)) throw new SchoolError('conflict', 'This question is already on the paper.')
      const q = await db
        .selectFrom('questions')
        .select(['id', 'concept_id', 'type', 'marks', 'tags', 'diagram_kind', 'status'])
        .where('id', '=', a.questionId)
        .executeTakeFirst()
      if (!q || !(await usableHere(db, scope, q)) || !ctx.chapterOfConcept.has(q.concept_id))
        throw new SchoolError('not_found', 'That question is not in the chosen chapters.')
      const cand = { marks: Number(q.marks), type: q.type, tags: q.tags, diagram_kind: q.diagram_kind }
      const fits = ctx.layout.sections.filter((s) => questionFitsSlot(cand, s) && (!a.slot || slotKey({ section: s.name, slot: s.slot }) === a.slot))
      if (fits.length === 0) throw new SchoolError('invalid', 'No section of this pattern takes this kind of question.')
      for (const s of fits) {
        try {
          const what = await place(db, scope, ctx, q, s, picks)
          await renumberAll(db, scope, ctx)
          await touch(db, scope, examId)
          return { message: what === 'or' ? `Added to ${s.name} as the second option of an OR question.` : `Added to ${s.name}.` }
        } catch (e) {
          if (!(e instanceof SchoolError)) throw e
        }
      }
      throw new SchoolError('conflict', `${fits.map((s) => s.name).join(' and ')} ${fits.length === 1 ? 'is' : 'are'} already full. Remove a question there first.`)
    }
    case 'remove': {
      const p = pick as PickView
      const partner = p.choiceGroup ? picks.find((x) => x.choiceGroup === p.choiceGroup && x.id !== p.id) : undefined
      await db.deleteFrom('school_exam_questions').where('school_id', '=', scope.schoolId).where('id', '=', p.id).execute()
      // the second option of an OR takes the removed question's place
      if (!p.isAlternate && partner)
        await db.updateTable('school_exam_questions').set({ is_alternate: false }).where('school_id', '=', scope.schoolId).where('id', '=', partner.id).execute()
      await renumberAll(db, scope, ctx)
      await touch(db, scope, examId)
      return { message: 'Removed.' }
    }
    case 'lock': {
      const p = pick as PickView
      const ids = picks.filter((x) => x.id === p.id || (p.choiceGroup && x.choiceGroup === p.choiceGroup)).map((x) => x.id)
      await db.updateTable('school_exam_questions').set({ locked: a.locked }).where('school_id', '=', scope.schoolId).where('id', 'in', ids).execute()
      await touch(db, scope, examId)
      return { message: a.locked ? 'Locked: it stays when the rest is refilled.' : 'Unlocked.' }
    }
    case 'move': {
      const p = pick as PickView
      const primary = p.isAlternate ? picks.find((x) => !x.isAlternate && x.choiceGroup === p.choiceGroup) ?? p : p
      const row = picks.filter((x) => !x.isAlternate && x.section === p.section && x.slot === p.slot).sort((x, y) => x.position - y.position)
      const i = row.findIndex((x) => x.id === primary.id)
      const j = a.direction === 'up' ? i - 1 : i + 1
      if (j < 0 || j >= row.length) return { message: 'It is already at the edge of its section.' }
      const other = row[j]
      const setPos = async (from: PickView, to: number) => {
        const ids = picks.filter((x) => x.id === from.id || (from.choiceGroup && x.choiceGroup === from.choiceGroup)).map((x) => x.id)
        await db.updateTable('school_exam_questions').set({ position: to }).where('school_id', '=', scope.schoolId).where('id', 'in', ids).execute()
      }
      await setPos(primary, -1000)
      await setPos(other, primary.position)
      await setPos({ ...primary, position: -1000 }, other.position)
      await renumberAll(db, scope, ctx)
      await touch(db, scope, examId)
      return { message: 'Moved.' }
    }
    case 'swap_options': {
      const p = pick as PickView
      const s = ctx.layout.sections.find((x) => x.name === p.section && x.slot === p.slot)
      if (!s) throw new SchoolError('not_found', 'That section is not in this pattern.')
      const inPaper = new Set([...picks.map((x) => x.questionId), ...(a.seen ?? [])])
      const avoid = await usedThisYear(db, scope, examId)
      const same = ctx.chapters.find((c) => c.id === p.chapterId)?.conceptIds ?? []
      const others = ctx.chapters.filter((c) => c.id !== p.chapterId).flatMap((c) => c.conceptIds)
      const found: Array<Candidate & { otherChapter: boolean }> = []
      const take = async (ids: ReadonlyArray<string>, exclude: ReadonlySet<string>, otherChapter: boolean) => {
        if (found.length >= 3) return
        for (const c of await candidates(db, ctx.exam.school_id, s, ids, new Set([...exclude, ...found.map((f) => f.id)]), 3 - found.length)) found.push({ ...c, otherChapter })
      }
      await take(same, new Set([...inPaper, ...avoid]), false)
      await take(same, inPaper, false)
      await take(others, new Set([...inPaper, ...avoid]), true)
      const texts = await db.selectFrom('questions').select(['id', 'text']).where('id', 'in', found.length ? found.map((f) => f.id) : ['00000000-0000-0000-0000-000000000000']).execute()
      const used = await usedBefore(db, scope, examId, found.map((f) => f.id))
      return {
        message: found.length ? 'Pick one to use instead.' : 'The bank has no other question of this kind for these chapters.',
        options: found.map((f) => ({
          id: f.id,
          text: texts.find((t) => t.id === f.id)?.text ?? '',
          type: f.type,
          marks: f.marks,
          difficulty: f.difficulty,
          level: levelWord(f.bloom),
          chapter: ctx.chapters.find((c) => c.id === ctx.chapterOfConcept.get(f.concept_id))?.short ?? '',
          otherChapter: f.otherChapter,
          usedBefore: used.get(f.id) ?? [],
        })),
      }
    }
    case 'swap_to': {
      const p = pick as PickView
      if (picks.some((x) => x.questionId === a.questionId)) throw new SchoolError('conflict', 'That question is already on the paper.')
      const s = ctx.layout.sections.find((x) => x.name === p.section && x.slot === p.slot)
      const q = await db.selectFrom('questions').select(['id', 'concept_id', 'type', 'marks', 'tags', 'diagram_kind', 'status']).where('id', '=', a.questionId).executeTakeFirst()
      if (!s || !q || !(await usableHere(db, scope, q)) || !ctx.chapterOfConcept.has(q.concept_id) || !questionFitsSlot({ marks: Number(q.marks), type: q.type, tags: q.tags, diagram_kind: q.diagram_kind }, s))
        throw new SchoolError('invalid', 'That question does not fit this place on the paper.')
      await db
        .updateTable('school_exam_questions')
        .set({ question_id: q.id, chapter_id: ctx.chapterOfConcept.get(q.concept_id) as string, locked: false })
        .where('school_id', '=', scope.schoolId)
        .where('id', '=', p.id)
        .execute()
      await touch(db, scope, examId)
      return { message: 'Swapped.' }
    }
    case 'refill_unlocked': {
      const drop = picks.filter((p) => !p.locked).map((p) => p.id)
      if (drop.length) await db.deleteFrom('school_exam_questions').where('school_id', '=', scope.schoolId).where('id', 'in', drop).execute()
      await fillOpen(db, scope, ctx, a.difficultyMix)
      await touch(db, scope, examId)
      return { message: 'Everything not locked was picked again.' }
    }
    case 'fill_rest': {
      await fillOpen(db, scope, ctx, a.difficultyMix)
      await touch(db, scope, examId)
      return { message: 'The open places were filled.' }
    }
    case 'finalize':
      return finalize(db, scope, ctx, picks)
  }
}

// ---------------------------------------------------------------- finishing, reopening, set B

/** Open places the bank could still fill (finishing is refused while there are any). */
async function stillFillable(db: Db, ctx: Ctx, check: Checklist, picks: ReadonlyArray<PickView>): Promise<Array<string>> {
  const inPaper = new Set(picks.map((p) => p.questionId))
  const all = ctx.chapters.flatMap((c) => c.conceptIds)
  const out: Array<string> = []
  for (const st of check.slots) {
    if (st.have >= st.need && st.haveOr >= st.needOr) continue
    const s = ctx.layout.sections.find((x) => x.name === st.section && x.slot === st.slot) as LayoutSection
    if ((await candidates(db, ctx.exam.school_id, s, all, inPaper, 1)).length > 0) out.push(`${st.section} (${st.slot})`)
  }
  return out
}

async function finalize(db: Db, scope: SchoolScope, ctx: Ctx, picks: ReadonlyArray<PickView>) {
  const check = checkPaper(ctx.layout, toBuilderPicks(picks), ctx.chapters)
  if (check.slots.some((s) => s.have > s.need)) throw new SchoolError('invalid', check.warnings.filter((w) => w.includes('too many')).join(' '))
  if (!check.complete) {
    const open = await stillFillable(db, ctx, check, picks)
    if (open.length > 0)
      throw new SchoolError('invalid', `The bank still has questions for ${open.join(', ')}. Pick them, or press "Fill the rest automatically".`)
  }
  if (picks.length === 0) throw new SchoolError('invalid', 'The paper has no questions yet.')
  const shortfalls = check.slots
    .filter((s) => s.have < s.need || s.haveOr < s.needOr)
    .map((s) => ({
      section: s.section,
      slot: s.slot,
      reason:
        s.have < s.need
          ? `Only ${s.have} of ${s.need} ${s.slot} question${s.need === 1 ? '' : 's'} could be found in the bank for these chapters.`
          : `${s.needOr - s.haveOr} OR question${s.needOr - s.haveOr === 1 ? '' : 's'} in ${s.slot} has no second option, because the bank had no more to offer.`,
      marks_missing: (s.need - s.have) * s.marks,
    }))
  const options = await examPrintRepository.optionsFor(db, picks.map((p) => p.questionId))
  const missingBySection = new Map<string, number>()
  for (const f of shortfalls) missingBySection.set(f.section, (missingBySection.get(f.section) ?? 0) + f.marks_missing)
  const problems = checkPaperStructure(
    picks.map((p) => ({
      section: p.section,
      position: p.position,
      marks: p.marks,
      type: p.type,
      optionCount: options.filter((o) => o.question_id === p.questionId).length,
      choiceGroup: p.choiceGroup,
      isChoiceAlternate: p.isAlternate,
    })),
    [...missingBySection].map(([section, marksMissing]) => ({ section, marksMissing })),
    ctx.layout.config.section_totals,
    check.marks.target,
  )
  if (problems.length > 0) throw new SchoolError('invalid', `The paper is not ready: ${problems.join('; ')}`)
  const last = await db
    .selectFrom('school_exam_versions')
    .select((eb) => eb.fn.max('version').as('v'))
    .where('school_id', '=', scope.schoolId)
    .where('exam_id', '=', ctx.exam.id)
    .executeTakeFirst()
  const version = Number(last?.v ?? 0) + 1
  const gapLines = shortfalls.map((f) => `${f.section} — ${f.slot}: ${f.reason}`)
  await db.transaction().execute(async (trx) => {
    await trx
      .insertInto('school_exam_versions')
      .values({
        school_id: scope.schoolId,
        exam_id: ctx.exam.id,
        version,
        finalized_by_user_id: scope.userId,
        questions: JSON.stringify(
          picks.map((p) => ({ question_id: p.questionId, section: p.section, slot: p.slot, position: p.position, marks: p.marks, choice_group: p.choiceGroup, is_alternate: p.isAlternate })),
        ),
        printed_marks: check.marks.picked,
      })
      .execute()
    await schoolExamsRepository.update(trx, scope, ctx.exam.id, {
      stage: 'final',
      version,
      printed_marks: check.marks.picked,
      nominal_marks: check.marks.target,
      shortfalls: JSON.stringify(shortfalls),
      teacher_copy_lines: JSON.stringify(gapLines),
      edited_at: new Date(),
    })
    await auditSchool(trx, scope, 'school.exam_finalized', 'school_exams', ctx.exam.id, null, { version, printed_marks: check.marks.picked, gaps: shortfalls.length })
  })
  return { message: shortfalls.length ? `The paper is ready (version ${version}). The bank had nothing more for ${shortfalls.length} place${shortfalls.length === 1 ? '' : 's'}; they are printed on the teacher copy.` : `The paper is ready (version ${version}).` }
}

async function reopen(db: Db, scope: SchoolScope, ctx: Ctx) {
  if (ctx.exam.stage === 'building') return { message: 'The paper is already open for changes.' }
  await schoolExamsRepository.update(db, scope, ctx.exam.id, { stage: 'building', edited_at: new Date() })
  await auditSchool(db, scope, 'school.exam_reopened', 'school_exams', ctx.exam.id, { version: ctx.exam.version }, null)
  return { message: `You can change the paper now. Finishing it again makes version ${ctx.exam.version + 1}; version ${ctx.exam.version} stays on record.` }
}

function shuffled<T>(xs: ReadonlyArray<T>): Array<T> {
  const a = [...xs]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Set B: the same questions in a new order within each section, or equal-difficulty alternatives. Its own paper. */
async function makeSetB(db: Db, scope: SchoolScope, ctx: Ctx, kind: 'shuffle' | 'alternatives') {
  if (ctx.exam.stage !== 'final') throw new SchoolError('conflict', 'Finish the paper first; set B is made from the finished paper.')
  if (ctx.exam.set_label === 'B') throw new SchoolError('conflict', 'This is already set B.')
  const existing = await db.selectFrom('school_exams').select('id').where('school_id', '=', scope.schoolId).where('set_of', '=', ctx.exam.id).where('archived_at', 'is', null).executeTakeFirst()
  if (existing) throw new SchoolError('conflict', 'Set B of this paper already exists.')
  const picks = await picksOf(db, scope, ctx)
  const sections = await db.selectFrom('school_exam_sections').select('section_id').where('school_id', '=', scope.schoolId).where('exam_id', '=', ctx.exam.id).execute()
  const avoid = new Set(picks.map((p) => p.questionId))
  // the new paper's questions, slot by slot
  const plan: Array<{ questionId: string; conceptChapter: string; s: LayoutSection; isAlternate: boolean; group: string | null; order: number }> = []
  for (const s of ctx.layout.sections) {
    const mine = picks.filter((p) => p.section === s.name && p.slot === s.slot)
    const units = mine.filter((p) => !p.isAlternate).map((p) => [p, ...mine.filter((x) => x.isAlternate && x.choiceGroup && x.choiceGroup === p.choiceGroup)])
    const ordered = kind === 'shuffle' ? shuffled(units) : units
    for (const [i, unit] of ordered.entries()) {
      const group = unit[0].choiceGroup ? `or-${crypto.randomUUID().slice(0, 8)}` : null
      for (const p of unit) {
        let questionId = p.questionId
        let chapterId = p.chapterId
        if (kind === 'alternatives') {
          const sameChapter = ctx.chapters.find((c) => c.id === p.chapterId)?.conceptIds ?? []
          const alt = (await candidates(db, ctx.exam.school_id, s, sameChapter, avoid, 6)).find((c) => c.difficulty === p.difficulty) ?? (await candidates(db, ctx.exam.school_id, s, sameChapter, avoid, 1)).at(0)
          if (alt) {
            questionId = alt.id
            chapterId = ctx.chapterOfConcept.get(alt.concept_id) ?? p.chapterId
            avoid.add(alt.id)
          }
        }
        plan.push({ questionId, conceptChapter: chapterId, s, isAlternate: p.isAlternate, group, order: i })
      }
    }
  }
  const result = await db.transaction().execute(async (trx) => {
    await schoolExamsRepository.update(trx, scope, ctx.exam.id, { set_label: 'A' })
    const b = await schoolExamsRepository.insert(trx, scope, {
      class_id: ctx.exam.class_id,
      subject_id: ctx.exam.subject_id,
      template_id: ctx.exam.template_id,
      template_name: ctx.exam.template_name,
      layout: JSON.stringify(ctx.layout),
      chapter_ids: ctx.exam.chapter_ids,
      title: `${ctx.exam.title.replace(/ · Set A$/, '')} · Set B`,
      exam_date: ctx.exam.exam_date,
      status: 'draft',
      shortfalls: JSON.stringify(ctx.exam.shortfalls),
      teacher_copy_lines: JSON.stringify(ctx.exam.teacher_copy_lines),
      nominal_marks: ctx.exam.nominal_marks,
      printed_marks: ctx.exam.printed_marks,
      created_by_user_id: scope.userId,
      stage: 'final',
      mode: ctx.exam.mode,
      set_label: 'B',
      set_of: ctx.exam.id,
    })
    for (const s of sections) await trx.insertInto('school_exam_sections').values({ school_id: scope.schoolId, exam_id: b.id, section_id: s.section_id }).execute()
    const rows = renumber(
      ctx.layout,
      plan.map((p, i) => ({ ...p, section: p.s.name, slot: p.s.slot, choiceGroup: p.group, order: p.order * 2 + (p.isAlternate ? 1 : 0) + i * 0 })),
    )
    for (const r of rows)
      await trx
        .insertInto('school_exam_questions')
        .values({
          school_id: scope.schoolId,
          exam_id: b.id,
          question_id: r.questionId,
          chapter_id: r.conceptChapter,
          position: r.position,
          is_alternate: r.isAlternate,
          marks: r.s.marks_per_question,
          section: r.s.name,
          slot: r.s.slot,
          choice_group: r.choiceGroup,
          expected_words: isWrittenSlot(r.s) ? expectedWordsFor(r.s.marks_per_question, ctx.layout.config) : null,
        })
        .execute()
    await trx
      .insertInto('school_exam_versions')
      .values({
        school_id: scope.schoolId,
        exam_id: b.id,
        version: 1,
        finalized_by_user_id: scope.userId,
        questions: JSON.stringify(rows.map((r) => ({ question_id: r.questionId, section: r.s.name, slot: r.s.slot, position: r.position, marks: r.s.marks_per_question, choice_group: r.choiceGroup, is_alternate: r.isAlternate }))),
        printed_marks: ctx.exam.printed_marks,
      })
      .execute()
    await auditSchool(trx, scope, 'school.exam_set_b_made', 'school_exams', b.id, null, { set_of: ctx.exam.id, kind })
    return b
  })
  return { message: kind === 'shuffle' ? 'Set B is ready: the same questions in a new order.' : 'Set B is ready: other questions of the same kind and difficulty.', options: { examId: result.id } }
}
