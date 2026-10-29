import type { BloomLevel, QuestionType } from '../../db/enums'
import { allocateProportionally } from '../papers'
import { SPECIAL_TAGS, THINKING_LEVELS, levelOfBloom } from '../school-paper'
import type { Layout, LayoutSection, ThinkingLevel } from '../school-paper'

// The coverage preview: before a paper is built, how well can the question bank fill a layout for
// the chosen chapters? It follows the same rule the paper generator uses to decide which
// questions may fill a slot (approved, right marks, an allowed type, an allowed thinking level, the
// case-study tag only where asked, no other special question in a plain slot), so what the preview
// promises is what generation can deliver. Nothing here reads the database: the caller passes the
// bank as counts.

/** Approved questions of one chapter, counted by what decides which slot they can fill. */
export interface BankRow {
  chapterId: string
  type: QuestionType
  marks: number
  bloom: BloomLevel
  /** The special tags the question carries (sorted, comma-joined), or '' for a plain question. */
  special: string
  hasDiagram: boolean
  n: number
}

export interface CoverageChapter {
  id: string
  /** How the teacher reads it: "Part I · Chapter 3 · Name". */
  label: string
  /** Share of the paper: by default the chapter's number of concepts, as the generator does. */
  weight: number
}

/** Does a bank row fit a layout row? Same rule as questionsRepository.findEligibleForSlot. */
export function rowFitsSlot(row: BankRow, slot: LayoutSection): boolean {
  if (row.marks !== slot.marks_per_question) return false
  if (!slot.bloom_allowed.includes(row.bloom)) return false
  if (slot.types && slot.types.length > 0 && !slot.types.includes(row.type))
    return false
  // A special question (case study, map, figure, construction) only fills the slot that asks for
  // it; a plain slot takes none, except a ruler-and-compass one, since papers are printed.
  const specials = row.special === '' ? [] : row.special.split(',')
  if (slot.tag) {
    if (!specials.includes(slot.tag)) return false
    if (specials.some((t) => t !== slot.tag)) return false
  } else if (specials.some((t) => t !== 'construction')) {
    return false
  }
  if ((slot.tag === 'map' || slot.tag === 'figure') && !row.hasDiagram)
    return false
  return true
}

export const SPECIAL_TAG_LIST: ReadonlyArray<string> = SPECIAL_TAGS

export interface SlotChapterCell {
  chapterId: string
  /** Questions this chapter is asked for in this row, by its share of the paper. */
  needed: number
  /** Approved questions the bank has in this chapter that can fill the row. */
  have: number
  /** needed - have when the chapter is short, otherwise 0. */
  short: number
  /** Questions the paper would draw from this chapter once other chapters make up a gap. */
  drawn: number
}

export interface SlotCoverage {
  section: string
  slot: string
  marksEach: number
  /** Questions printed for the row: its answers plus one alternative for every OR. */
  printed: number
  /** Marks the row is worth on the paper (an OR counts once). */
  marks: number
  cells: Array<SlotChapterCell>
  /** Questions the bank can supply for the row across all chosen chapters, at most `printed`. */
  fillable: number
  /** Questions that cannot be filled from any chosen chapter. */
  unfilled: number
  /** Marks left empty. A missing question that was only the alternative of an OR costs no marks, only that choice. */
  marksMissing: number
  /** OR choices that lose their alternative because the bank cannot supply it. */
  choicesLost: number
}

export interface ChapterCoverage {
  chapterId: string
  label: string
  plannedMarks: number
  expectedMarks: number
}

export interface LevelSplit {
  planned: Record<ThinkingLevel, number>
  expected: Record<ThinkingLevel, number>
  /** "Recall" is remembering and understanding; "thinking" is everything above it. */
  plannedRecall: number
  expectedRecall: number
}

export interface Shortfall {
  kind: 'chapter' | 'paper'
  section: string
  slot: string
  chapterId: string | null
  chapterLabel: string | null
  needed: number
  have: number
  short: number
  /** For a 'paper' line: marks the paper loses. Always 0 for a 'chapter' line (other chapters cover it where they can). */
  marksMissing: number
  /** For a 'paper' line: OR choices left without an alternative. */
  choicesLost: number
}

export interface CoverageResult {
  totalMarks: number
  /** Marks the bank can fill (the paper's marks less the empty ones). */
  fillableMarks: number
  slots: Array<SlotCoverage>
  chapters: Array<ChapterCoverage>
  levels: LevelSplit
  shortfalls: Array<Shortfall>
}

const roundPct = (n: number) => Math.round(n * 10) / 10

/**
 * Works out, row by row, what each chosen chapter is asked for, what it has, where it is short and
 * who covers the gap. A shortfall is reported, never hidden: the teacher's copy prints every line
 * of `shortfalls` (see shortfallLines).
 */
export function computeCoverage(input: {
  layout: Layout
  chapters: ReadonlyArray<CoverageChapter>
  bank: ReadonlyArray<BankRow>
}): CoverageResult {
  const { layout, chapters, bank } = input
  const weights = Object.fromEntries(
    chapters.map((c) => [c.id, Math.max(1, c.weight)]),
  ) as Record<string, number>
  const labels = new Map(chapters.map((c) => [c.id, c.label]))
  const plannedByChapter = new Map<string, number>(
    chapters.map((c) => [c.id, 0]),
  )
  const expectedByChapter = new Map<string, number>(
    chapters.map((c) => [c.id, 0]),
  )
  const plannedLevel = emptyLevels()
  const expectedLevel = emptyLevels()
  const slots: Array<SlotCoverage> = []
  const shortfalls: Array<Shortfall> = []

  for (const slot of layout.sections) {
    // A row of `count` answers with `or_count` choices prints count + or_count questions (each OR
    // adds an alternative), but is worth only count x marks.
    const printed = slot.count + (slot.or_count ?? 0)
    const marks = slot.marks_per_question * slot.count
    const need = allocateProportionally(printed, weights)
    const matching = bank.filter((r) => rowFitsSlot(r, slot))
    const have = new Map<string, number>(chapters.map((c) => [c.id, 0]))
    for (const r of matching)
      if (have.has(r.chapterId))
        have.set(r.chapterId, (have.get(r.chapterId) ?? 0) + r.n)

    // Chapters that have more than they are asked for lend the difference to the ones that are short.
    const shortOf = (id: string) =>
      Math.max(0, (need[id] ?? 0) - (have.get(id) ?? 0))
    const surplusOf = (id: string) =>
      Math.max(0, (have.get(id) ?? 0) - (need[id] ?? 0))
    const totalShort = chapters.reduce((n, c) => n + shortOf(c.id), 0)
    const totalSurplus = chapters.reduce((n, c) => n + surplusOf(c.id), 0)
    const covered = Math.min(totalShort, totalSurplus)
    const lent =
      covered > 0
        ? allocateProportionally(
            covered,
            Object.fromEntries(
              chapters
                .map((c) => [c.id, surplusOf(c.id)])
                .filter(([, s]) => (s as number) > 0),
            ),
          )
        : {}
    const unfilled = totalShort - covered
    const fillable = printed - unfilled

    const cells: Array<SlotChapterCell> = chapters.map((c) => ({
      chapterId: c.id,
      needed: need[c.id] ?? 0,
      have: have.get(c.id) ?? 0,
      short: shortOf(c.id),
      drawn: Math.min(need[c.id] ?? 0, have.get(c.id) ?? 0) + (lent[c.id] ?? 0),
    }))
    const marksPerDrawn = printed === 0 ? 0 : marks / printed
    // Each OR adds an alternative that costs no marks if it is missing, so only questions beyond
    // those alternatives take marks away from the paper.
    const orCount = slot.or_count ?? 0
    const marksMissing =
      Math.max(0, unfilled - orCount) * slot.marks_per_question
    const choicesLost = Math.min(unfilled, orCount)
    slots.push({
      section: slot.name,
      slot: slot.slot,
      marksEach: slot.marks_per_question,
      printed,
      marks,
      cells,
      fillable,
      unfilled,
      marksMissing,
      choicesLost,
    })

    for (const cell of cells) {
      plannedByChapter.set(
        cell.chapterId,
        (plannedByChapter.get(cell.chapterId) ?? 0) +
          cell.needed * marksPerDrawn,
      )
      expectedByChapter.set(
        cell.chapterId,
        (expectedByChapter.get(cell.chapterId) ?? 0) +
          cell.drawn * marksPerDrawn,
      )
      if (cell.short > 0) {
        shortfalls.push({
          kind: 'chapter',
          section: slot.name,
          slot: slot.slot,
          chapterId: cell.chapterId,
          chapterLabel: labels.get(cell.chapterId) ?? null,
          needed: cell.needed,
          have: cell.have,
          short: cell.short,
          marksMissing: 0,
          choicesLost: 0,
        })
      }
    }
    if (unfilled > 0) {
      shortfalls.push({
        kind: 'paper',
        section: slot.name,
        slot: slot.slot,
        chapterId: null,
        chapterLabel: null,
        needed: printed,
        have: fillable,
        short: unfilled,
        marksMissing,
        choicesLost,
      })
    }

    // Thinking levels: the planned share is the layout's own target; the expected share follows the
    // levels of the questions the bank actually has for this row.
    const levelCounts = emptyLevels()
    for (const r of matching)
      if (have.has(r.chapterId)) levelCounts[levelOfBloom(r.bloom)] += r.n
    const levelTotal = THINKING_LEVELS.reduce((n, l) => n + levelCounts[l], 0)
    const fillableMarks = fillable * marksPerDrawn
    if (levelTotal > 0)
      for (const l of THINKING_LEVELS)
        expectedLevel[l] += fillableMarks * (levelCounts[l] / levelTotal)
  }

  const totalMarks = slots.reduce((n, s) => n + s.marks, 0)
  const missing = slots.reduce((n, s) => n + s.marksMissing, 0)
  for (const l of THINKING_LEVELS)
    plannedLevel[l] = (layout.config.level_mix[l] / 100) * totalMarks
  const expectedTotal = THINKING_LEVELS.reduce(
    (n, l) => n + expectedLevel[l],
    0,
  )
  const pct = (
    v: Record<ThinkingLevel, number>,
    total: number,
  ): Record<ThinkingLevel, number> => ({
    recall_understanding: total
      ? roundPct((v.recall_understanding / total) * 100)
      : 0,
    application: total ? roundPct((v.application / total) * 100) : 0,
    analysis_evaluation: total
      ? roundPct((v.analysis_evaluation / total) * 100)
      : 0,
  })
  const planned = pct(plannedLevel, totalMarks)
  const expected = pct(expectedLevel, expectedTotal)
  return {
    totalMarks: roundPct(totalMarks),
    fillableMarks: roundPct(totalMarks - missing),
    slots,
    chapters: chapters.map((c) => ({
      chapterId: c.id,
      label: c.label,
      plannedMarks: roundPct(plannedByChapter.get(c.id) ?? 0),
      expectedMarks: roundPct(expectedByChapter.get(c.id) ?? 0),
    })),
    levels: {
      planned,
      expected,
      plannedRecall: planned.recall_understanding,
      expectedRecall: expected.recall_understanding,
    },
    shortfalls,
  }
}

function emptyLevels(): Record<ThinkingLevel, number> {
  return { recall_understanding: 0, application: 0, analysis_evaluation: 0 }
}

/**
 * The lines printed on the teacher's copy of the paper. One line per row that cannot be filled
 * from the chosen chapters, then one per chapter that is short in a row. Never left out: a paper
 * with a gap says so (CLAUDE.md "Shortfalls are reported, never hidden").
 */
export function shortfallLines(result: CoverageResult): Array<string> {
  const lines: Array<string> = []
  for (const s of result.shortfalls.filter((x) => x.kind === 'paper')) {
    const parts = [
      `${s.short} of ${s.needed} question${s.needed === 1 ? '' : 's'} could not be filled from the bank`,
    ]
    if (s.marksMissing > 0) parts.push(`${s.marksMissing} marks short`)
    if (s.choicesLost > 0)
      parts.push(
        `${s.choicesLost} choice${s.choicesLost === 1 ? '' : 's'} (OR) will have no alternative`,
      )
    lines.push(`${s.section} — ${s.slot}: ${parts.join('; ')}.`)
  }
  for (const s of result.shortfalls.filter((x) => x.kind === 'chapter')) {
    lines.push(
      `${s.chapterLabel}: ${s.slot} in ${s.section} needed ${s.needed}, the bank has ${s.have}.`,
    )
  }
  return lines
}
