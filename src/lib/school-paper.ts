import type { BloomLevel, QuestionType } from '../db/enums'

/**
 * "School Half-Yearly" paper type. Everything about the layout is blueprint DATA (sections plus
 * blueprints.config); this module holds only the pure rules that read it -- thinking levels,
 * word limits, mark splits, the stopped-early flag, the pre-show structural checks -- and the
 * two layout builders the seed script writes into the blueprints table. Nothing here names a
 * class or a subject.
 *
 * No F-number covers this paper type yet (CLAUDE.md: never invent one).
 */

export type ThinkingLevel = 'recall_understanding' | 'application' | 'analysis_evaluation'

export const THINKING_LEVELS: Array<ThinkingLevel> = [
  'recall_understanding',
  'application',
  'analysis_evaluation',
]

export const LEVEL_LABEL: Record<ThinkingLevel, string> = {
  recall_understanding: 'Recall and understanding',
  application: 'Application',
  analysis_evaluation: 'Analysis and evaluation',
}

// A question's Bloom level decides which thinking level it counts as. Create sits with analysis
// and evaluation: there is no separate "create" band in a school paper.
export const LEVEL_BLOOMS: Record<ThinkingLevel, Array<BloomLevel>> = {
  recall_understanding: ['Remember', 'Understand'],
  application: ['Apply'],
  analysis_evaluation: ['Analyse', 'Evaluate', 'Create'],
}

export function levelOfBloom(bloom: BloomLevel): ThinkingLevel {
  return THINKING_LEVELS.find((l) => LEVEL_BLOOMS[l].includes(bloom)) as ThinkingLevel
}

/**
 * Tags that mark a question as special. A slot that does not ask for the tag never receives such
 * a question: a case study must not turn up in a 3-mark short-answer slot, a map question needs
 * the map slot, and a ruler-and-compass question must not reach a phone attempt.
 */
export const SPECIAL_TAGS = ['case_study', 'map', 'construction', 'figure'] as const
export type SpecialTag = (typeof SPECIAL_TAGS)[number]
// Tags whose question is only usable when a real, original figure exists for it.
export const FIGURE_TAGS: Array<string> = ['map', 'figure']

export interface HalfYearlyConfig {
  kind: 'school_half_yearly'
  // A practice paper of this many questions (10, 15 or 30); unset for a full-length layout.
  question_count?: number
  // True while the layout is the owner's estimate awaiting confirmation against a real paper.
  draft?: boolean
  draft_note?: string
  instructions: Array<string>
  // marks -> expected words. Keys are strings because the config is JSON.
  word_limits: Record<string, number>
  level_mix: Record<ThinkingLevel, number>
  // Section heading -> marks it is worth. The pre-show check compares printed marks to this.
  section_totals: Record<string, number>
  // Headings in print order (a jsonb object does not keep key order, so it is stored separately).
  section_order: Array<string>
  // An answer shorter than this fraction of the expected length is flagged.
  stopped_early_ratio: number
}

export function parseHalfYearlyConfig(raw: unknown): HalfYearlyConfig | null {
  if (!raw || typeof raw !== 'object') return null
  const c = raw as Partial<HalfYearlyConfig>
  if (c.kind !== 'school_half_yearly') return null
  return {
    kind: 'school_half_yearly',
    question_count: c.question_count,
    draft: c.draft === true,
    draft_note: c.draft_note,
    instructions: c.instructions ?? [],
    word_limits: c.word_limits ?? {},
    level_mix: c.level_mix ?? { recall_understanding: 34, application: 33, analysis_evaluation: 33 },
    section_totals: c.section_totals ?? {},
    section_order: c.section_order ?? Object.keys(c.section_totals ?? {}),
    stopped_early_ratio: c.stopped_early_ratio ?? 0.5,
  }
}

export function expectedWordsFor(marks: number, cfg: HalfYearlyConfig): number | null {
  return cfg.word_limits[String(marks)] ?? null
}

export function wordCount(text: string | null | undefined): number {
  return (text ?? '').trim().split(/\s+/).filter(Boolean).length
}

/**
 * A possible "stopped writing too early" habit: she wrote something, but under about half of what
 * the question expected. An empty answer is "not attempted", a different diagnosis, so it is not
 * flagged here. This is a flag for the diagnosis, never a mark deduction.
 */
export function isPossiblyStoppedEarly(
  responseText: string | null | undefined,
  expectedWords: number | null | undefined,
  ratio = 0.5,
): boolean {
  if (!expectedWords || expectedWords <= 0) return false
  const words = wordCount(responseText)
  return words > 0 && words < expectedWords * ratio
}

// "(1+2)" for a question whose mark scheme has several steps; empty when it has fewer than two.
export function markSplit(stepMarks: Array<number>): string {
  return stepMarks.length > 1 ? `(${stepMarks.join('+')})` : ''
}

export function formatWordLimits(cfg: HalfYearlyConfig): string {
  return Object.entries(cfg.word_limits)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([marks, words]) => `${marks} marks: ${words} words`)
    .join(', ')
}

// ---------------------------------------------------------------------------------------------
// Pre-show checks
// ---------------------------------------------------------------------------------------------

export interface CheckSlot {
  section: string
  position: number
  marks: number
  type: QuestionType
  optionCount: number
  // Both members of an OR pair share a choice_group; only one counts toward the totals.
  choiceGroup: string | null
  isChoiceAlternate: boolean
}

export interface CheckShortfall {
  section: string
  marksMissing: number
}

const OPTION_TYPES: Array<QuestionType> = ['mcq', 'assertion_reason', 'multi_statement', 'match']

/**
 * Run before a paper is saved or shown. Returns human-readable problems; empty means it passes.
 *  1. numbering is continuous (1..N, no gap or repeat);
 *  2. every multiple-choice style question has exactly four options;
 *  3. each section's printed marks plus the marks a shortfall note accounts for equal the
 *     section's total, and the section totals add up to the paper total.
 * A shortfall therefore never makes the totals fail -- it makes the shortfall visible -- but a
 * question quietly going missing does.
 */
export function checkPaperStructure(
  slots: Array<CheckSlot>,
  shortfalls: Array<CheckShortfall>,
  sectionTotals: Record<string, number>,
  paperTotal: number,
): Array<string> {
  const problems: Array<string> = []

  // An OR pair prints under one number, so numbering counts it once.
  const printed = slots.filter((s) => !s.isChoiceAlternate).sort((a, b) => a.position - b.position)
  const numbers = [...new Set(slots.map((s) => s.position))].sort((a, b) => a - b)
  const expected = numbers.map((_, i) => i + 1)
  if (numbers.some((n, i) => n !== expected[i])) {
    problems.push(`Numbering is not continuous: ${numbers.join(', ')}`)
  }

  for (const s of slots) {
    if (OPTION_TYPES.includes(s.type) && s.optionCount !== 4) {
      problems.push(`Question ${s.position} (${s.type}) has ${s.optionCount} options, not 4`)
    }
  }

  const printedBySection = new Map<string, number>()
  for (const s of printed) {
    printedBySection.set(s.section, (printedBySection.get(s.section) ?? 0) + s.marks)
  }
  const missingBySection = new Map<string, number>()
  for (const f of shortfalls) {
    missingBySection.set(f.section, (missingBySection.get(f.section) ?? 0) + f.marksMissing)
  }
  let sum = 0
  for (const [section, total] of Object.entries(sectionTotals)) {
    sum += total
    const have = (printedBySection.get(section) ?? 0) + (missingBySection.get(section) ?? 0)
    if (have !== total) {
      problems.push(`${section}: printed ${printedBySection.get(section) ?? 0} + shortfall ${missingBySection.get(section) ?? 0} marks is not the section total of ${total}`)
    }
  }
  if (sum !== paperTotal) {
    problems.push(`Section totals add to ${sum}, not the paper total of ${paperTotal}`)
  }
  return problems
}

// ---------------------------------------------------------------------------------------------
// Layouts (data written into blueprints by the seed script)
// ---------------------------------------------------------------------------------------------

export interface LayoutSection {
  // The printed section heading; paper_questions.section stores this.
  name: string
  // The slot within the heading, e.g. "2-mark short answer".
  slot: string
  marks_per_question: number
  count: number
  bloom_allowed: Array<BloomLevel>
  // Allowed question types; omitted means any type.
  types?: Array<QuestionType>
  // Required special tag (case_study, map, ...); omitted means a plain question.
  tag?: SpecialTag
  // Chapters of this discipline only (Social Science: History, Geography, Civics, Economics).
  discipline?: string
  // How many of this slot's questions are printed with an internal OR.
  or_count?: number
}

export interface Layout {
  name: string
  total_marks: number
  duration_min: number
  sections: Array<LayoutSection>
  bloom_targets: Record<BloomLevel, number>
  config: HalfYearlyConfig
}

const OBJECTIVE_1: Array<QuestionType> = ['mcq', 'assertion_reason', 'multi_statement', 'match']
const WRITTEN: Array<QuestionType> = ['short_answer', 'long_answer']
const SHORT_BLOOM: Array<BloomLevel> = ['Remember', 'Understand', 'Apply']
const MID_BLOOM: Array<BloomLevel> = ['Understand', 'Apply', 'Analyse']
const HIGH_BLOOM: Array<BloomLevel> = ['Apply', 'Analyse', 'Evaluate', 'Create']
const CASE_BLOOM: Array<BloomLevel> = ['Apply', 'Analyse', 'Evaluate']

const WORD_LIMITS = { '2': 40, '3': 60, '4': 100, '5': 120 }

const COMMON_INSTRUCTIONS = [
  'All questions are compulsory. Where a question has an OR, answer one of the two.',
  'The marks for each question, and for each part of it, are printed beside it.',
  'Write within the word limit for the marks: ',
  'Read each question fully before you answer. Check the words NOT, only, always and never.',
]

function sumMarks(sections: Array<LayoutSection>, heading: string): number {
  return sections
    .filter((s) => s.name === heading)
    .reduce((n, s) => n + s.marks_per_question * s.count, 0)
}

function totalsFor(sections: Array<LayoutSection>): Record<string, number> {
  const totals: Record<string, number> = {}
  for (const s of sections) totals[s.name] = sumMarks(sections, s.name)
  return totals
}

function orderOf(sections: Array<LayoutSection>): Array<string> {
  return [...new Set(sections.map((s) => s.name))]
}

function wordLimitLine(): string {
  return `${COMMON_INSTRUCTIONS[2]}2 marks: 40 words, 3 marks: 60 words, 4 marks: 100 words, 5 marks: 120 words.`
}

/**
 * Social Science: History 25, Geography 25, Civics 20, Economics 10 = 80 marks, 37 questions,
 * 3 hours. Mix about 50 / 30 / 20. The slot counts inside each section are this project's
 * reading of the school layout (marks and question count are what is fixed) and are data: change
 * the blueprint row, not this code.
 */
export function socialScienceLayout(): Layout {
  const mcq = (name: string, count: number, discipline: string): LayoutSection => ({
    name, slot: '1-mark multiple choice', marks_per_question: 1, count,
    bloom_allowed: SHORT_BLOOM, types: OBJECTIVE_1, discipline,
  })
  const shortAns = (name: string, count: number, discipline: string, or = 0): LayoutSection => ({
    name, slot: '2-mark very short answer', marks_per_question: 2, count,
    bloom_allowed: SHORT_BLOOM, types: WRITTEN, discipline, or_count: or,
  })
  const map = (name: string, discipline: string): LayoutSection => ({
    name, slot: '2-mark map question', marks_per_question: 2, count: 1,
    bloom_allowed: SHORT_BLOOM, tag: 'map', discipline,
  })
  const three = (name: string, count: number, discipline: string, or = 0): LayoutSection => ({
    name, slot: '3-mark short answer', marks_per_question: 3, count,
    bloom_allowed: MID_BLOOM, types: WRITTEN, discipline, or_count: or,
  })
  const caseStudy = (name: string, discipline: string): LayoutSection => ({
    name, slot: '4-mark case study (1+1+2)', marks_per_question: 4, count: 1,
    bloom_allowed: CASE_BLOOM, tag: 'case_study', discipline,
  })
  const five = (name: string, discipline: string): LayoutSection => ({
    name, slot: '5-mark long answer', marks_per_question: 5, count: 1,
    bloom_allowed: HIGH_BLOOM, types: WRITTEN, discipline, or_count: 1,
  })

  const A = 'Section A — History'
  const B = 'Section B — Geography'
  const C = 'Section C — Civics'
  const D = 'Section D — Economics'
  const sections: Array<LayoutSection> = [
    mcq(A, 6, 'History'), shortAns(A, 1, 'History'), map(A, 'History'), three(A, 2, 'History', 1), caseStudy(A, 'History'), five(A, 'History'),
    mcq(B, 6, 'Geography'), shortAns(B, 1, 'Geography'), map(B, 'Geography'), three(B, 2, 'Geography', 1), caseStudy(B, 'Geography'), five(B, 'Geography'),
    mcq(C, 4, 'Civics'), shortAns(C, 2, 'Civics'), three(C, 1, 'Civics', 1), caseStudy(C, 'Civics'), five(C, 'Civics'),
    shortAns(D, 2, 'Economics', 1), three(D, 2, 'Economics', 1),
  ]
  return {
    name: 'School Half-Yearly (Social Science)',
    total_marks: 80,
    duration_min: 180,
    sections,
    bloom_targets: { Remember: 20, Understand: 30, Apply: 30, Analyse: 10, Evaluate: 5, Create: 5 },
    config: {
      kind: 'school_half_yearly',
      instructions: [...COMMON_INSTRUCTIONS.slice(0, 2), wordLimitLine(), COMMON_INSTRUCTIONS[3]],
      word_limits: WORD_LIMITS,
      level_mix: { recall_understanding: 50, application: 30, analysis_evaluation: 20 },
      section_totals: totalsFor(sections),
      section_order: orderOf(sections),
      stopped_early_ratio: 0.5,
    },
  }
}

/**
 * Maths and Science: A 20 x 1 (18 MCQ + 2 assertion-reason), B 5 x 2, C 6 x 3, D 4 x 5,
 * E 3 x 4-mark case studies = 80 marks. Mix about 25 / 45 / 30. This layout is the owner's
 * estimate, not a copy of a real paper, and is marked as a draft until it is checked against one.
 */
export function stemLayout(subjectLabel: string): Layout {
  const A = 'Section A — Multiple Choice (1 mark each)'
  const B = 'Section B — Short Answer (2 marks each)'
  const C = 'Section C — Short Answer (3 marks each)'
  const D = 'Section D — Long Answer (5 marks each)'
  const E = 'Section E — Case Studies (4 marks each)'
  const sections: Array<LayoutSection> = [
    { name: A, slot: 'Multiple choice', marks_per_question: 1, count: 18, bloom_allowed: ['Remember', 'Understand', 'Apply', 'Analyse'], types: ['mcq', 'multi_statement', 'match'] },
    { name: A, slot: 'Assertion and reason', marks_per_question: 1, count: 2, bloom_allowed: ['Understand', 'Apply', 'Analyse'], types: ['assertion_reason'] },
    { name: B, slot: '2-mark short answer', marks_per_question: 2, count: 5, bloom_allowed: SHORT_BLOOM, types: WRITTEN, or_count: 2 },
    { name: C, slot: '3-mark short answer', marks_per_question: 3, count: 6, bloom_allowed: MID_BLOOM, types: WRITTEN, or_count: 2 },
    { name: D, slot: '5-mark long answer', marks_per_question: 5, count: 4, bloom_allowed: HIGH_BLOOM, types: WRITTEN, or_count: 3 },
    { name: E, slot: '4-mark case study', marks_per_question: 4, count: 3, bloom_allowed: CASE_BLOOM, tag: 'case_study', or_count: 1 },
  ]
  return {
    name: `School Half-Yearly (${subjectLabel})`,
    total_marks: 80,
    duration_min: 180,
    sections,
    bloom_targets: { Remember: 10, Understand: 15, Apply: 45, Analyse: 15, Evaluate: 10, Create: 5 },
    config: {
      kind: 'school_half_yearly',
      draft: true,
      draft_note:
        'DRAFT layout: the five-section CBSE pattern, estimated by the owner. Not yet checked against a real half-yearly paper for this subject.',
      instructions: [...COMMON_INSTRUCTIONS.slice(0, 2), wordLimitLine(), COMMON_INSTRUCTIONS[3]],
      word_limits: WORD_LIMITS,
      level_mix: { recall_understanding: 25, application: 45, analysis_evaluation: 30 },
      section_totals: totalsFor(sections),
      section_order: orderOf(sections),
      stopped_early_ratio: 0.5,
    },
  }
}

export const PRACTICE_COUNTS = [10, 15, 30] as const

/**
 * The paper a student gets when she picks 10, 15 or 30 questions: the DPS Class 7 revision-paper
 * pattern (a 30-question set is 12 multiple choice including assertion-reason, 8 two-mark, 7
 * longer answers and 3 case studies), scaled down for 10 and 15 by keeping the same proportions.
 * Chapters are the student's choice and the marks follow from the questions, so there is no fixed
 * mark total. `kind` picks the thinking-level mix: 'stem' (Maths, Science) or 'social'.
 */
export function practiceLayout(kind: 'stem' | 'social', count: (typeof PRACTICE_COUNTS)[number], subjectLabel: string): Layout {
  const shape = {
    10: { mcq: 4, ar: 0, two: 3, three: 1, five: 1, caseStudy: 1 },
    15: { mcq: 6, ar: 1, two: 4, three: 2, five: 1, caseStudy: 1 },
    30: { mcq: 10, ar: 2, two: 8, three: 4, five: 3, caseStudy: 3 },
  }[count]
  const A = 'Section A — Multiple Choice (1 mark each)'
  const B = 'Section B — Short Answer (2 marks each)'
  const C = 'Section C — Long Answer (3 and 5 marks)'
  const D = 'Section D — Case Study (4 marks)'
  const mcqBloom: Array<BloomLevel> = kind === 'stem' ? ['Remember', 'Understand', 'Apply', 'Analyse'] : ['Remember', 'Understand', 'Apply']
  const sections: Array<LayoutSection> = [
    { name: A, slot: 'Multiple choice', marks_per_question: 1, count: shape.mcq, bloom_allowed: mcqBloom, types: ['mcq', 'multi_statement', 'match'] },
    ...(shape.ar > 0 ? [{ name: A, slot: 'Assertion and reason', marks_per_question: 1, count: shape.ar, bloom_allowed: ['Understand', 'Apply', 'Analyse'] as Array<BloomLevel>, types: ['assertion_reason'] as Array<QuestionType> }] : []),
    { name: B, slot: '2-mark short answer', marks_per_question: 2, count: shape.two, bloom_allowed: SHORT_BLOOM, types: WRITTEN },
    { name: C, slot: '3-mark answer', marks_per_question: 3, count: shape.three, bloom_allowed: MID_BLOOM, types: WRITTEN },
    { name: C, slot: '5-mark answer', marks_per_question: 5, count: shape.five, bloom_allowed: HIGH_BLOOM, types: WRITTEN },
    { name: D, slot: '4-mark case study', marks_per_question: 4, count: shape.caseStudy, bloom_allowed: CASE_BLOOM, tag: 'case_study' },
  ]
  const total = marksOfSections(sections)
  return {
    name: `DPS practice paper (${subjectLabel}) — ${count} questions`,
    total_marks: total,
    duration_min: count * 3,
    sections,
    bloom_targets: kind === 'stem'
      ? { Remember: 10, Understand: 15, Apply: 45, Analyse: 15, Evaluate: 10, Create: 5 }
      : { Remember: 20, Understand: 30, Apply: 30, Analyse: 10, Evaluate: 5, Create: 5 },
    config: {
      kind: 'school_half_yearly',
      question_count: count,
      instructions: [
        'All questions are compulsory.',
        'The marks for each question, and for each part of it, are printed beside it.',
        wordLimitLine(),
        COMMON_INSTRUCTIONS[3],
      ],
      word_limits: WORD_LIMITS,
      level_mix: kind === 'stem'
        ? { recall_understanding: 25, application: 45, analysis_evaluation: 30 }
        : { recall_understanding: 50, application: 30, analysis_evaluation: 20 },
      section_totals: totalsFor(sections),
      section_order: orderOf(sections),
      stopped_early_ratio: 0.5,
    },
  }
}

function marksOfSections(sections: Array<LayoutSection>): number {
  return sections.reduce((n, s) => n + s.marks_per_question * s.count, 0)
}
