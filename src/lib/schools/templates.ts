import type { BloomLevel, QuestionType } from '../../db/enums'
import {
  CASE_BLOOM,
  COMMON_INSTRUCTIONS,
  HIGH_BLOOM,
  MID_BLOOM,
  SHORT_BLOOM,
  WORD_LIMITS,
  wordLimitLine,
} from '../school-paper'
import type { Layout, LayoutSection, ThinkingLevel } from '../school-paper'

// A school's paper layout as a teacher edits it, and the rules that keep it sound. It becomes the
// existing blueprint `Layout` (src/lib/school-paper.ts) through toLayout(), so the paper generator,
// the pre-show structural checks, the word limits and the stopped-early flag all work on it as
// they do for the built-in School Half-Yearly layouts.

export type SectionKind =
  'mcq' | 'assertion_reason' | 'short_answer' | 'long_answer' | 'case_study'

export const SECTION_KINDS: ReadonlyArray<SectionKind> = [
  'mcq',
  'assertion_reason',
  'short_answer',
  'long_answer',
  'case_study',
]

/** What a teacher sees for each kind of question. Plain words only. */
export const KIND_LABEL: Record<SectionKind, string> = {
  mcq: 'Multiple choice',
  assertion_reason: 'Assertion and reason',
  short_answer: 'Short answer',
  long_answer: 'Long answer',
  case_study: 'Case study',
}

export interface TemplateSection {
  /** The heading printed on the paper, e.g. "Section C — Short answer (3 marks each)". */
  name: string
  kind: SectionKind
  /** Questions the student answers in this row. */
  count: number
  /** Marks for each question. */
  marks: number
  /** How many of those are printed with an OR: a choice between two questions (one extra is printed for each). */
  orCount: number
}

export interface TemplateDefinition {
  name: string
  totalMarks: number
  durationMin: number
  sections: Array<TemplateSection>
  /** Whole percentages adding to 100. */
  levelMix: Record<ThinkingLevel, number>
}

export const MAX_SECTIONS = 12

/** Marks of the paper: an OR is one answer, so a row is worth count x marks. */
export function computeTotal(sections: ReadonlyArray<TemplateSection>): number {
  return sections.reduce((n, s) => n + s.count * s.marks, 0)
}

/** Plain-English problems with a layout; an empty list means it can be saved. */
export function validateTemplate(t: TemplateDefinition): Array<string> {
  const problems: Array<string> = []
  const name = t.name.trim()
  if (!name) problems.push('Give the layout a name.')
  if (name.length > 80) problems.push('The name is longer than 80 characters.')
  if (!Number.isInteger(t.totalMarks) || t.totalMarks < 1 || t.totalMarks > 200)
    problems.push('Total marks must be a whole number from 1 to 200.')
  if (
    !Number.isInteger(t.durationMin) ||
    t.durationMin < 15 ||
    t.durationMin > 300
  )
    problems.push('Time must be from 15 to 300 minutes.')
  if (t.sections.length === 0) problems.push('Add at least one section.')
  if (t.sections.length > MAX_SECTIONS)
    problems.push(`Use at most ${MAX_SECTIONS} rows.`)

  const seen = new Set<string>()
  t.sections.forEach((s, i) => {
    const row = `Row ${i + 1}`
    if (!s.name.trim()) problems.push(`${row}: give the section a heading.`)
    if (s.name.length > 80)
      problems.push(`${row}: the heading is longer than 80 characters.`)
    if (!SECTION_KINDS.includes(s.kind))
      problems.push(`${row}: choose a kind of question.`)
    if (!Number.isInteger(s.count) || s.count < 1 || s.count > 50)
      problems.push(`${row}: the number of questions must be from 1 to 50.`)
    if (!Number.isInteger(s.marks) || s.marks < 1 || s.marks > 20)
      problems.push(`${row}: marks for each question must be from 1 to 20.`)
    if ((s.kind === 'mcq' || s.kind === 'assertion_reason') && s.marks > 2)
      problems.push(
        `${row}: a ${KIND_LABEL[s.kind].toLowerCase()} question is worth 1 or 2 marks.`,
      )
    if (!Number.isInteger(s.orCount) || s.orCount < 0 || s.orCount > s.count)
      problems.push(
        `${row}: the questions with a choice cannot be more than the questions.`,
      )
    if ((s.kind === 'mcq' || s.kind === 'assertion_reason') && s.orCount > 0)
      problems.push(`${row}: a choice (OR) is only for written answers.`)
    const key = `${s.name.trim()}|${s.kind}|${s.marks}`
    if (seen.has(key))
      problems.push(
        `${row}: the same heading, kind and marks appear twice. Join them into one row.`,
      )
    seen.add(key)
  })

  const total = computeTotal(t.sections)
  if (t.sections.length > 0 && total !== t.totalMarks) {
    problems.push(
      `The rows add up to ${total} marks, but the total is ${t.totalMarks}. Make them the same.`,
    )
  }
  const mix = t.levelMix
  const parts = [
    mix.recall_understanding,
    mix.application,
    mix.analysis_evaluation,
  ]
  if (parts.some((p) => !Number.isInteger(p) || p < 0 || p > 100))
    problems.push('The thinking mix must be whole numbers from 0 to 100.')
  else if (parts[0] + parts[1] + parts[2] !== 100)
    problems.push(
      `The thinking mix adds up to ${parts[0] + parts[1] + parts[2]}, not 100.`,
    )
  return problems
}

function bloomFor(s: TemplateSection): Array<BloomLevel> {
  switch (s.kind) {
    case 'mcq':
      return ['Remember', 'Understand', 'Apply', 'Analyse']
    case 'assertion_reason':
      return ['Understand', 'Apply', 'Analyse']
    case 'case_study':
      return CASE_BLOOM
    case 'long_answer':
      return HIGH_BLOOM
    case 'short_answer':
      return s.marks <= 2 ? SHORT_BLOOM : s.marks === 3 ? MID_BLOOM : HIGH_BLOOM
  }
}

const WRITTEN: Array<QuestionType> = ['short_answer', 'long_answer']

function slotLabel(s: TemplateSection): string {
  switch (s.kind) {
    case 'mcq':
      return s.marks === 1
        ? 'Multiple choice'
        : `${s.marks}-mark multiple choice`
    case 'assertion_reason':
      return s.marks === 1
        ? 'Assertion and reason'
        : `${s.marks}-mark assertion and reason`
    case 'short_answer':
      return `${s.marks}-mark short answer`
    case 'long_answer':
      return `${s.marks}-mark long answer`
    case 'case_study':
      return `${s.marks}-mark case study`
  }
}

/** One layout row as the paper generator wants it (see LayoutSection in school-paper.ts). */
export function toLayoutSection(s: TemplateSection): LayoutSection {
  const base: LayoutSection = {
    name: s.name.trim(),
    slot: slotLabel(s),
    marks_per_question: s.marks,
    count: s.count,
    bloom_allowed: bloomFor(s),
  }
  if (s.kind === 'mcq') base.types = ['mcq', 'multi_statement', 'match']
  else if (s.kind === 'assertion_reason') base.types = ['assertion_reason']
  else if (s.kind === 'case_study') base.tag = 'case_study'
  else base.types = WRITTEN
  if (s.orCount > 0) base.or_count = s.orCount
  return base
}

function sectionTotals(sections: Array<LayoutSection>): Record<string, number> {
  const totals: Record<string, number> = {}
  for (const s of sections)
    totals[s.name] = (totals[s.name] ?? 0) + s.marks_per_question * s.count
  return totals
}

/** The blueprint-shaped layout the generator and the paper checks use. */
export function toLayout(t: TemplateDefinition): Layout {
  const sections = t.sections.map(toLayoutSection)
  const m = t.levelMix
  return {
    name: t.name.trim(),
    total_marks: t.totalMarks,
    duration_min: t.durationMin,
    sections,
    // A rough spread of the three thinking levels over Bloom's six, for the generator's mix target.
    bloom_targets: {
      Remember: Math.round(m.recall_understanding * 0.4),
      Understand: Math.round(m.recall_understanding * 0.6),
      Apply: m.application,
      Analyse: Math.round(m.analysis_evaluation * 0.5),
      Evaluate: Math.round(m.analysis_evaluation * 0.3),
      Create:
        m.analysis_evaluation -
        Math.round(m.analysis_evaluation * 0.5) -
        Math.round(m.analysis_evaluation * 0.3),
    },
    config: {
      kind: 'school_half_yearly',
      instructions: [
        ...COMMON_INSTRUCTIONS.slice(0, 2),
        wordLimitLine(),
        COMMON_INSTRUCTIONS[3],
      ],
      word_limits: WORD_LIMITS,
      level_mix: m,
      section_totals: sectionTotals(sections),
      section_order: [...new Set(sections.map((s) => s.name))],
      stopped_early_ratio: 0.5,
    },
  }
}

// ---- the two ready-made layouts --------------------------------------------------------------

export type DefaultTemplateKey = 'cbse_80' | 'unit_test_40'

export interface DefaultTemplate extends TemplateDefinition {
  key: DefaultTemplateKey
  blurb: string
}

const A = 'Section A — Multiple choice (1 mark each)'
const B = 'Section B — Short answer (2 marks each)'
const C = 'Section C — Short answer (3 marks each)'
const D = 'Section D — Long answer (5 marks each)'
const E = 'Section E — Case studies (4 marks each)'

export const DEFAULT_TEMPLATES: ReadonlyArray<DefaultTemplate> = [
  {
    key: 'cbse_80',
    name: 'CBSE-style paper, 80 marks',
    blurb:
      '3 hours. 20 one-mark, 5 two-mark, 6 three-mark, 4 five-mark and 3 case studies of 4 marks.',
    totalMarks: 80,
    durationMin: 180,
    levelMix: {
      recall_understanding: 25,
      application: 45,
      analysis_evaluation: 30,
    },
    sections: [
      { name: A, kind: 'mcq', count: 18, marks: 1, orCount: 0 },
      { name: A, kind: 'assertion_reason', count: 2, marks: 1, orCount: 0 },
      { name: B, kind: 'short_answer', count: 5, marks: 2, orCount: 2 },
      { name: C, kind: 'short_answer', count: 6, marks: 3, orCount: 2 },
      { name: D, kind: 'long_answer', count: 4, marks: 5, orCount: 3 },
      { name: E, kind: 'case_study', count: 3, marks: 4, orCount: 1 },
    ],
  },
  {
    key: 'unit_test_40',
    name: 'Unit Test, 40 marks',
    blurb:
      '90 minutes. 10 one-mark, 5 two-mark, 4 three-mark and 2 four-mark questions.',
    totalMarks: 40,
    durationMin: 90,
    levelMix: {
      recall_understanding: 40,
      application: 40,
      analysis_evaluation: 20,
    },
    sections: [
      {
        name: 'Section A — Multiple choice (1 mark each)',
        kind: 'mcq',
        count: 8,
        marks: 1,
        orCount: 0,
      },
      {
        name: 'Section A — Multiple choice (1 mark each)',
        kind: 'assertion_reason',
        count: 2,
        marks: 1,
        orCount: 0,
      },
      { name: B, kind: 'short_answer', count: 5, marks: 2, orCount: 1 },
      { name: C, kind: 'short_answer', count: 4, marks: 3, orCount: 1 },
      {
        name: 'Section D — Longer answer (4 marks each)',
        kind: 'long_answer',
        count: 2,
        marks: 4,
        orCount: 1,
      },
    ],
  },
]

export function findDefaultTemplate(key: string): DefaultTemplate | undefined {
  return DEFAULT_TEMPLATES.find((t) => t.key === key)
}

/** Reads a stored definition back, refusing anything that is not the expected shape. */
export function parseSections(raw: unknown): Array<TemplateSection> {
  if (!Array.isArray(raw)) return []
  return raw.map((r) => {
    const o = r as Partial<TemplateSection>
    return {
      name: String(o.name ?? ''),
      kind: (SECTION_KINDS.includes(o.kind as SectionKind)
        ? o.kind
        : 'short_answer') as SectionKind,
      count: Number(o.count ?? 0),
      marks: Number(o.marks ?? 0),
      orCount: Number(o.orCount ?? 0),
    }
  })
}
