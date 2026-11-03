import type { BloomLevel, QuestionType } from '../../db/enums'
import type { Layout, LayoutSection } from '../school-paper'

/**
 * The live checklist of the paper builder (docs/SCHOOLS_MODULE_PLAN.md section 16.6). One pure function, used by the
 * screen as the teacher works and by the server before a paper is finished, so the two always agree. No database.
 */
export interface BuilderPick {
  questionId: string
  section: string
  slot: string
  marks: number
  type: QuestionType
  chapterId: string
  bloom: BloomLevel
  isAlternate: boolean
  choiceGroup: string | null
}

export interface SlotStatus {
  section: string
  slot: string
  marks: number
  /** questions the slot prints, and how many of them carry an OR alternative */
  need: number
  needOr: number
  have: number
  haveOr: number
  full: boolean
}

export interface Checklist {
  marks: { picked: number; target: number }
  questions: { picked: number; target: number }
  slots: Array<SlotStatus>
  chapters: Array<{ id: string; label: string; marks: number }>
  /** share of marks on remember/understand questions, against the pattern's target */
  remember: { pct: number; targetPct: number }
  warnings: Array<string>
  /** every slot holds all its questions and OR alternatives */
  complete: boolean
}

const REMEMBER: ReadonlySet<BloomLevel> = new Set(['Remember', 'Understand'] as Array<BloomLevel>)

/** "Remember" for remember/understand questions, "Think" for the rest (the words the teacher sees). */
export function levelWord(bloom: BloomLevel): 'Remember' | 'Think' {
  return REMEMBER.has(bloom) ? 'Remember' : 'Think'
}

/** A slot is the pair (section heading, slot name); both are printed on the paper. */
export const slotKey = (s: { section: string; slot: string }) => `${s.section}::${s.slot}`

/** Does this question fit this slot (marks, and type when the slot names types)? Special tags are checked by the server. */
export function fitsSlot(q: { marks: number; type: QuestionType }, s: LayoutSection): boolean {
  return q.marks === s.marks_per_question && (!s.types || s.types.length === 0 || s.types.includes(q.type))
}

function plural(n: number, one: string, many = `${one}s`) {
  return `${n} ${n === 1 ? one : many}`
}

export function checkPaper(
  layout: Pick<Layout, 'sections' | 'config'>,
  picks: ReadonlyArray<BuilderPick>,
  chapters: ReadonlyArray<{ id: string; label: string }>,
): Checklist {
  const slots: Array<SlotStatus> = layout.sections.map((s) => {
    const mine = picks.filter((p) => p.section === s.name && p.slot === s.slot)
    const have = mine.filter((p) => !p.isAlternate).length
    const haveOr = mine.filter((p) => p.isAlternate).length
    const needOr = s.or_count ?? 0
    return {
      section: s.name,
      slot: s.slot,
      marks: s.marks_per_question,
      need: s.count,
      needOr,
      have,
      haveOr,
      full: have >= s.count && haveOr >= needOr,
    }
  })
  const printed = picks.filter((p) => !p.isAlternate)
  const pickedMarks = printed.reduce((n, p) => n + p.marks, 0)
  const targetMarks = layout.sections.reduce((n, s) => n + s.marks_per_question * s.count, 0)
  const targetQuestions = layout.sections.reduce((n, s) => n + s.count, 0)
  const chapterMarks = chapters.map((c) => ({
    ...c,
    marks: printed.filter((p) => p.chapterId === c.id).reduce((n, p) => n + p.marks, 0),
  }))
  const rememberMarks = printed.filter((p) => REMEMBER.has(p.bloom)).reduce((n, p) => n + p.marks, 0)
  const pct = pickedMarks === 0 ? 0 : Math.round((rememberMarks / pickedMarks) * 100)
  const targetPct = layout.config.level_mix.recall_understanding

  const warnings: Array<string> = []
  for (const s of slots) {
    if (s.have < s.need)
      warnings.push(`${s.section} needs ${plural(s.need - s.have, `more ${s.marks}-mark question`)} (${s.slot}).`)
    else if (s.have > s.need) warnings.push(`${s.section} has ${plural(s.have - s.need, 'question')} too many (${s.slot}).`)
    if (s.haveOr < s.needOr)
      warnings.push(`${s.section}: ${plural(s.needOr - s.haveOr, 'OR question')} still ${s.needOr - s.haveOr === 1 ? 'needs its' : 'need their'} second option.`)
  }
  for (const c of chapterMarks) if (c.marks === 0) warnings.push(`${c.label} has no questions yet.`)
  if (pickedMarks > 0 && Math.abs(pct - targetPct) > 10)
    warnings.push(
      pct > targetPct
        ? `Many remember questions: ${pct}% of the marks (the pattern aims for about ${targetPct}%).`
        : `Many think questions: only ${pct}% of the marks are remember questions (the pattern aims for about ${targetPct}%).`,
    )
  return {
    marks: { picked: pickedMarks, target: targetMarks },
    questions: { picked: printed.length, target: targetQuestions },
    slots,
    chapters: chapterMarks,
    remember: { pct, targetPct },
    warnings,
    complete: slots.every((s) => s.have === s.need && s.haveOr >= s.needOr),
  }
}

/** Positions 1..N in paper order (sections in layout order, then the order within the section); an OR pair shares one. */
export function renumber<T extends { section: string; slot: string; isAlternate: boolean; choiceGroup: string | null; order: number }>(
  layout: Pick<Layout, 'sections'>,
  picks: ReadonlyArray<T>,
): Array<T & { position: number }> {
  const out: Array<T & { position: number }> = []
  let position = 0
  for (const s of layout.sections) {
    const mine = picks.filter((p) => p.section === s.name && p.slot === s.slot).sort((a, b) => a.order - b.order)
    for (const p of mine.filter((x) => !x.isAlternate)) {
      position += 1
      out.push({ ...p, position })
      const partner = p.choiceGroup ? mine.find((x) => x.isAlternate && x.choiceGroup === p.choiceGroup) : undefined
      if (partner) out.push({ ...partner, position })
    }
  }
  return out
}
