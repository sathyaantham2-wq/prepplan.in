// Pure helpers for the student's paper builder layouts (/my-paper?layout=a|b). No React, no
// server imports (src/lib/adaptive/plan.ts pulls in the database layer, which must never reach the
// client bundle), so everything here is unit-testable and safe to import from components.

// ---------------------------------------------------------------------------------------------
// Layout selection (URL query string only)
// ---------------------------------------------------------------------------------------------

export type BuilderLayout = 'classic' | 'a' | 'b'

/** The raw ?layout= value as the route keeps it: a string, or undefined when absent. */
export function normaliseLayoutParam(value: unknown): string | undefined {
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  return undefined
}

/** 'a' and 'b' (any case) pick a new layout; anything else, or nothing, is the current one. */
export function parseLayout(value: unknown): BuilderLayout {
  const raw = normaliseLayoutParam(value)?.trim().toLowerCase()
  if (raw === 'a') return 'a'
  if (raw === 'b') return 'b'
  return 'classic'
}

/** The comparison switcher shows only when a layout parameter is present at all. */
export function showLayoutSwitcher(value: unknown): boolean {
  return normaliseLayoutParam(value) !== undefined
}

export const LAYOUT_CHOICES: ReadonlyArray<{
  value: BuilderLayout
  label: string
  param: string
}> = [
  { value: 'classic', label: 'Classic', param: 'classic' },
  { value: 'a', label: 'A', param: 'a' },
  { value: 'b', label: 'B', param: 'b' },
]

// ---------------------------------------------------------------------------------------------
// Subject icons
// ---------------------------------------------------------------------------------------------

export type SubjectIconKind =
  | 'maths'
  | 'science'
  | 'social'
  | 'english'
  | 'hindi'
  | 'telugu'
  | 'generic'

/**
 * Picks an icon family from the subject's name. Social Science is tested before Science because
 * its name contains the word "science".
 */
export function subjectIconKind(name: string): SubjectIconKind {
  const n = name.toLowerCase()
  if (/\b(social|history|geography|polity|civics|economics|civil)/.test(n)) return 'social'
  if (/(math|ganita|algebra|geometry)/.test(n)) return 'maths'
  if (/(science|physics|chemistry|biology)/.test(n)) return 'science'
  if (/english/.test(n)) return 'english'
  if (/hindi/.test(n)) return 'hindi'
  if (/telugu/.test(n)) return 'telugu'
  return 'generic'
}

// ---------------------------------------------------------------------------------------------
// Chapters: grouping, mastery, "worth practising"
// ---------------------------------------------------------------------------------------------

export interface BuilderChapter {
  id: string
  name: string
  part: string
  chapter_no: number
}

export interface ChapterGroup<T extends BuilderChapter = BuilderChapter> {
  part: string
  chapters: Array<T>
}

export interface GroupedChapters<T extends BuilderChapter = BuilderChapter> {
  groups: Array<ChapterGroup<T>>
  // True when the subject (not just the filtered view) has more than one part. Chapter identity
  // is (book, part, chapter number), so only then must a card say which part it belongs to.
  showPart: boolean
}

function normalise(input: string): string {
  return input.toLowerCase().replace(/\s+/g, ' ').trim()
}

/** Groups chapters by part in their given order, after filtering by name. */
export function groupChaptersByPart<T extends BuilderChapter>(
  chapters: ReadonlyArray<T>,
  query = '',
): GroupedChapters<T> {
  const showPart = new Set(chapters.map((c) => c.part)).size > 1
  const q = normalise(query)
  const matches = q ? chapters.filter((c) => normalise(c.name).includes(q)) : chapters
  const groups: Array<ChapterGroup<T>> = []
  for (const c of matches) {
    let group = groups.find((g) => g.part === c.part)
    if (!group) {
      group = { part: c.part, chapters: [] }
      groups.push(group)
    }
    group.chapters.push(c)
  }
  return { groups, showPart }
}

// Mirrors `levels.proficient` in src/lib/adaptive/config.ts (default 60): below it the engine
// itself calls a concept weak and gives it the larger share of a paper.
export const WORTH_PRACTISING_BELOW = 60

/** True for a chapter she has been assessed on and has not yet reached Proficient. */
export function worthPractising(mastery: number | null | undefined): boolean {
  return typeof mastery === 'number' && mastery < WORTH_PRACTISING_BELOW
}

export function masteryPercent(mastery: number | null | undefined): number | null {
  return typeof mastery === 'number' ? Math.max(0, Math.min(100, Math.round(mastery))) : null
}

// ---------------------------------------------------------------------------------------------
// Size, minutes, "asked vs planned"
// ---------------------------------------------------------------------------------------------

export type BuilderQuestionType = 'combined' | 'mcq' | 'written'

export const QUESTION_TYPE_LABELS: Record<BuilderQuestionType, string> = {
  combined: 'Combined',
  mcq: 'Multiple choice',
  written: 'Written',
}

/**
 * Time estimate for a paper of `count` questions, for the labels under the count choices. It
 * repeats the arithmetic of buildPaperPlan (src/lib/adaptive/plan.ts): the section sizes for the
 * chosen type, 1.5 / 4 / 8 minutes per multiple-choice / short / long question, rounded up to the
 * next 5 minutes. For the paper actually selected the screen shows the plan's own figure instead.
 */
export function estimateMinutes(count: number, type: BuilderQuestionType): number {
  const written = type === 'combined' || type === 'written'
  const only = type === 'written'
  const mcq = only ? 0 : count
  const short = written ? Math.max(2, Math.round(count * (only ? 0.4 : 0.2))) : 0
  const long = written ? Math.max(1, Math.round(count * (only ? 0.2 : 0.1))) : 0
  const raw = mcq * 1.5 + short * 4 + long * 8
  return Math.max(5, Math.ceil(raw / 5) * 5)
}

export interface PlanSectionLike {
  count: number
  marks_per_question: number
}

export interface PlanLike {
  total_questions: number
  estimated_minutes: number
  sections?: Array<PlanSectionLike>
  school_paper?: { total_marks: number; duration_min: number } | null
}

export interface AskedVsPlanned {
  asked: number
  planned: number
  headline: string
  explanation: string
}

function plural(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`
}

/**
 * Why a paper can hold more questions than the count she picked, stated only from the plan's own
 * sections. The count she picks sizes the multiple-choice part (or, for a written-only paper, the
 * paper as a whole); a Combined or Written paper then adds short-answer and long-answer sections
 * of its own (buildPaperPlan: about 20% and 10% of the count for Combined, 40% and 20% for
 * Written). Returns null when the numbers agree, for a school-format paper (fixed layout), or
 * when the plan carries no sections to explain from.
 */
export function describeAskedVsPlanned(
  asked: number,
  type: BuilderQuestionType,
  plan: PlanLike | null,
): AskedVsPlanned | null {
  if (!plan || plan.school_paper || !plan.sections || plan.sections.length === 0) return null
  const planned = plan.total_questions
  if (planned === asked) return null
  const mcq = plan.sections.filter((s) => s.marks_per_question === 1).reduce((a, s) => a + s.count, 0)
  const short = plan.sections.filter((s) => s.marks_per_question === 2).reduce((a, s) => a + s.count, 0)
  const long = plan.sections.filter((s) => s.marks_per_question === 3).reduce((a, s) => a + s.count, 0)
  const parts: Array<string> = []
  if (mcq > 0) parts.push(plural(mcq, 'multiple-choice question', 'multiple-choice questions'))
  if (short > 0) parts.push(plural(short, 'short-answer question', 'short-answer questions'))
  if (long > 0) parts.push(plural(long, 'long-answer question', 'long-answer questions'))
  const list = parts.length > 1 ? `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}` : (parts[0] ?? '')
  let explanation: string
  if (type === 'combined' && mcq === asked) {
    explanation = `The ${asked} is the multiple-choice part. A Combined paper adds written questions on top: ${list}.`
  } else if (type === 'written') {
    explanation = `A written paper is sized from the ${asked} you chose: ${list}.`
  } else {
    explanation = `This paper has ${list}.`
  }
  return {
    asked,
    planned,
    headline: `${asked} asked, ${planned} planned`,
    explanation,
  }
}

// ---------------------------------------------------------------------------------------------
// Summary text
// ---------------------------------------------------------------------------------------------

/** '13 questions · about 35 min' (school paper: '38 questions · 80 marks · 180 min'). */
export function sizeText(questionCount: number, plan: PlanLike | null): string {
  const parts: Array<string> = []
  if (plan?.school_paper) {
    parts.push(`${plan.total_questions} questions`)
    parts.push(`${plan.school_paper.total_marks} marks`)
    parts.push(`${plan.school_paper.duration_min} min`)
  } else {
    parts.push(plural(plan ? plan.total_questions : questionCount, 'question', 'questions'))
    if (plan) parts.push(`about ${plan.estimated_minutes} min`)
  }
  return parts.join(' \u00b7 ')
}

export function summaryText(input: {
  subjectName: string | null
  chapterCount: number
  questionCount: number
  plan: PlanLike | null
}): string {
  const parts: Array<string> = []
  if (input.subjectName) parts.push(input.subjectName)
  parts.push(plural(input.chapterCount, 'chapter', 'chapters'))
  parts.push(sizeText(input.questionCount, input.plan))
  return parts.join(' \u00b7 ')
}

/** '80 marks · 3 hours' for the school-format paper. */
export function schoolPaperLine(school: { total_marks: number; duration_min: number }): string {
  const hours = school.duration_min / 60
  const time = Number.isInteger(hours)
    ? `${hours} ${hours === 1 ? 'hour' : 'hours'}`
    : `${school.duration_min} min`
  return `${school.total_marks} marks · ${time}`
}

// ---------------------------------------------------------------------------------------------
// Guided steps (Layout B)
// ---------------------------------------------------------------------------------------------

export const WIZARD_STEPS = [
  { key: 'subject', label: 'Subject' },
  { key: 'chapters', label: 'Chapters' },
  { key: 'size', label: 'Size and style' },
] as const

export type WizardStep = 0 | 1 | 2

export interface WizardState {
  subjectId: string
  chapterCount: number
  planReady: boolean
  planning: boolean
  starting: boolean
}

/**
 * One plain sentence saying why she cannot move on from `step`, or null when she can. On the last
 * step "move on" means generating the paper.
 */
export function wizardBlockReason(step: WizardStep, s: WizardState): string | null {
  if (!s.subjectId) return 'Choose a subject to continue.'
  if (step >= 1 && s.chapterCount === 0) return 'Pick at least one chapter to continue.'
  if (step === 2) {
    if (s.planning) return 'Planning your paper…'
    if (!s.planReady) return 'Your paper is not ready yet.'
    if (s.starting) return 'Getting your paper ready…'
  }
  return null
}

export function clampStep(step: number): WizardStep {
  return Math.max(0, Math.min(2, Math.round(step))) as WizardStep
}
