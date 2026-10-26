// Pure helpers for the student's paper builder (/my-paper). No React, no
// server imports (src/lib/adaptive/plan.ts pulls in the database layer, which must never reach the
// client bundle), so everything here is unit-testable and safe to import from components.

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
// Quick path vs guided path, and the three steps
// ---------------------------------------------------------------------------------------------

export const GUIDE_STEPS = [
  { key: 'subject', label: 'Subject' },
  { key: 'chapters', label: 'Chapters' },
  { key: 'size', label: 'Size and style' },
] as const

export type GuideStep = 0 | 1 | 2

/** The last step is the review: it is where "Skip to review" lands. */
export const REVIEW_STEP: GuideStep = 2

export interface GuideState {
  subjectId: string
  chapterCount: number
  planReady: boolean
  planning: boolean
  starting: boolean
}

export function clampStep(step: number): GuideStep {
  return Math.max(0, Math.min(2, Math.round(step))) as GuideStep
}

/** 'Step 2 of 3: Chapters'. */
export function stepProgressText(step: GuideStep): string {
  return `Step ${step + 1} of ${GUIDE_STEPS.length}: ${GUIDE_STEPS[step].label}`
}

export function nextStep(step: GuideStep): GuideStep | null {
  return step >= REVIEW_STEP ? null : ((step + 1) as GuideStep)
}

export function previousStep(step: GuideStep): GuideStep | null {
  return step <= 0 ? null : ((step - 1) as GuideStep)
}

/** The two things a paper cannot exist without. Everything else has a smart default. */
export function selectionBlockReason(s: Pick<GuideState, 'subjectId' | 'chapterCount'>): string | null {
  if (!s.subjectId) return 'Choose a subject to continue.'
  if (s.chapterCount === 0) return 'Pick at least one chapter to continue.'
  return null
}

/**
 * Why Next is disabled on `step`, or null. Smart defaults are already filled in, so a step is a
 * dead end only when its own required choice is truly missing: a subject on step 1, a chapter on
 * step 2. The last step has no Next (the summary's Generate button takes over).
 */
export function nextBlockReason(step: GuideStep, s: Pick<GuideState, 'subjectId' | 'chapterCount'>): string | null {
  if (step === 0) return s.subjectId ? null : 'Choose a subject to continue.'
  if (step === 1) return s.chapterCount > 0 ? null : 'Pick at least one chapter to continue.'
  return null
}

/** Why "Skip to review" cannot be used yet: the review needs a subject and a chapter. */
export function skipToReviewBlockReason(s: Pick<GuideState, 'subjectId' | 'chapterCount'>): string | null {
  return selectionBlockReason(s)
}

/** Why Generate is disabled, or null when the paper can be made. */
export function generateBlockReason(s: GuideState): string | null {
  const missing = selectionBlockReason(s)
  if (missing) return missing.replace(' to continue', ' to make a paper')
  if (s.planning) return 'Planning your paper\u2026'
  if (s.starting) return 'Getting your paper ready\u2026'
  if (!s.planReady) return 'Your paper is not ready yet.'
  return null
}

/** Whether the progress dots may jump straight to `target` (always backwards, forwards when valid). */
export function canGoToStep(target: GuideStep, s: Pick<GuideState, 'subjectId' | 'chapterCount'>): boolean {
  if (target === 0) return true
  if (target === 1) return Boolean(s.subjectId)
  return selectionBlockReason(s) === null
}

export type BuilderMode = 'quick' | 'guided'

/**
 * The "Made for you" card is the first thing she sees when the app has a recommendation; without
 * one the guided steps show directly. "Customise" switches to the steps, "Back to the quick
 * version" returns to the card. While the first plan is still loading the card shows (planning).
 */
export function builderMode(input: {
  hasRecommendation: boolean
  customising: boolean
  settingUp: boolean
}): BuilderMode {
  if (input.customising) return 'guided'
  if (input.hasRecommendation || input.settingUp) return 'quick'
  return 'guided'
}

export function sameChapterSet(a: ReadonlyArray<string>, b: ReadonlyArray<string>): boolean {
  return a.length === b.length && a.every((x) => b.includes(x))
}
