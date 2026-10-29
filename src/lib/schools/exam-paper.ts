import type { Db } from '../../db/connection'
import type { QuestionType } from '../../db/enums'
import { examPrintRepository, questionsRepository } from '../../db/repositories'
import { allocateProportionally } from '../papers'
import {
  SPECIAL_TAGS,
  checkPaperStructure,
  expectedWordsFor,
} from '../school-paper'
import type { Layout, LayoutSection } from '../school-paper'
import { isObjectiveType } from '../scoring'

// The master paper of an exam: one set of questions for the whole class, chosen from the bank to
// fill a layout across the chosen chapters. It uses the same eligibility rule as the student paper
// generator (questionsRepository.findEligibleForSlot) and the same pre-show structural checks, but
// it is not tied to a student: the generator weights questions by one student's weak concepts, and
// an exam paper is the same for everyone.

export interface ExamChapter {
  id: string
  conceptIds: Array<string>
  /** Share of the paper; by default the chapter's number of concepts, as the generator does. */
  weight: number
}

export interface PickedQuestion {
  questionId: string
  conceptId: string
  chapterId: string
  type: QuestionType
  position: number
  isAlternate: boolean
  marks: number
  section: string
  slot: string
  choiceGroup: string | null
  expectedWords: number | null
}

export interface ExamShortfall {
  section: string
  slot: string
  reason: string
  /** Marks the printed paper loses. An OR alternative that could not be found loses none. */
  marks_missing: number
}

export interface MasterPaper {
  picks: Array<PickedQuestion>
  shortfalls: Array<ExamShortfall>
  /** Marks the layout is worth, and the marks actually printed (an OR counts once). */
  nominalMarks: number
  printedMarks: number
}

const ALL_DIFFICULTIES: Array<'Easy' | 'Hard' | 'Hardest'> = [
  'Easy',
  'Hard',
  'Hardest',
]

interface Candidate {
  id: string
  concept_id: string
  type: QuestionType
}

/** One question per concept in turn, so a chapter's picks spread across its concepts. */
function spread(candidates: Array<Candidate>, n: number): Array<Candidate> {
  const byConcept = new Map<string, Array<Candidate>>()
  for (const c of candidates)
    byConcept.set(c.concept_id, [...(byConcept.get(c.concept_id) ?? []), c])
  const lists = [...byConcept.values()]
  const out: Array<Candidate> = []
  for (
    let round = 0;
    out.length < n && lists.some((l) => l.length > round);
    round++
  ) {
    for (const l of lists) {
      if (out.length >= n) break
      if (l.length > round) out.push(l[round])
    }
  }
  return out
}

async function eligible(
  db: Db,
  slot: LayoutSection,
  conceptIds: Array<string>,
  exclude: Set<string>,
  limit: number,
): Promise<Array<Candidate>> {
  if (conceptIds.length === 0 || limit <= 0) return []
  // A plain slot never receives a case study, map or figure question; a ruler-and-compass one is
  // fine because school papers are printed.
  const rows = await questionsRepository.findEligibleForSlot(
    db,
    {
      conceptIds,
      bloomAllowed: slot.bloom_allowed,
      difficultiesAllowed: ALL_DIFFICULTIES,
      marks: slot.marks_per_question,
      excludeQuestionIds: [...exclude],
      types: slot.types,
      requiredTag: slot.tag,
      excludeTags: SPECIAL_TAGS.filter(
        (t) => t !== slot.tag && t !== 'construction',
      ),
      requireDiagram: slot.tag === 'map' || slot.tag === 'figure',
    },
    limit,
  )
  return rows.map((r) => ({ id: r.id, concept_id: r.concept_id, type: r.type }))
}

export async function buildMasterPaper(
  db: Db,
  layout: Layout,
  chapters: ReadonlyArray<ExamChapter>,
): Promise<MasterPaper> {
  if (chapters.length === 0) throw new Error('Choose at least one chapter')
  const weights = Object.fromEntries(
    chapters.map((c) => [c.id, Math.max(1, c.weight)]),
  ) as Record<string, number>
  const chapterOf = new Map<string, string>()
  for (const c of chapters)
    for (const id of c.conceptIds) chapterOf.set(id, c.id)
  const used = new Set<string>()
  const picks: Array<PickedQuestion> = []
  const shortfalls: Array<ExamShortfall> = []
  let position = 0

  for (const slot of layout.sections) {
    const orCount = slot.or_count ?? 0
    const printed = slot.count + orCount
    const need = allocateProportionally(printed, weights)
    const got: Array<Candidate> = []

    for (const ch of chapters) {
      const want = need[ch.id] ?? 0
      const rows = await eligible(db, slot, ch.conceptIds, used, want * 3)
      for (const r of spread(rows, want)) {
        got.push(r)
        used.add(r.id)
      }
    }
    // Chapters that were short are made up from the others, as the coverage preview promised.
    if (got.length < printed) {
      const all = chapters.flatMap((c) => c.conceptIds)
      const rows = await eligible(
        db,
        slot,
        all,
        used,
        (printed - got.length) * 3,
      )
      for (const r of spread(rows, printed - got.length)) {
        got.push(r)
        used.add(r.id)
      }
    }

    const answers = Math.min(slot.count, got.length)
    const alternates = Math.max(0, Math.min(orCount, got.length - answers))
    const words = isWrittenSlot(slot)
      ? expectedWordsFor(slot.marks_per_question, layout.config)
      : null
    const primaries = got.slice(0, answers)
    const spare = got.slice(answers, answers + alternates)
    const orPositions = primaries.slice(0, alternates)
    const partnerOf = new Map<string, Candidate>()
    const free = [...spare]
    for (const p of orPositions) {
      // The alternative of an OR comes from a different concept where there is a choice.
      const at = free.findIndex((f) => f.concept_id !== p.concept_id)
      const idx = at >= 0 ? at : 0
      partnerOf.set(p.id, free.splice(idx, 1)[0])
    }
    for (const p of primaries) {
      position += 1
      const partner = partnerOf.get(p.id)
      const group = partner ? `or-${position}` : null
      picks.push({
        questionId: p.id,
        conceptId: p.concept_id,
        chapterId: chapterOf.get(p.concept_id) ?? chapters[0].id,
        type: p.type,
        position,
        isAlternate: false,
        marks: slot.marks_per_question,
        section: slot.name,
        slot: slot.slot,
        choiceGroup: group,
        expectedWords: words,
      })
      if (partner) {
        picks.push({
          questionId: partner.id,
          conceptId: partner.concept_id,
          chapterId: chapterOf.get(partner.concept_id) ?? chapters[0].id,
          type: partner.type,
          position,
          isAlternate: true,
          marks: slot.marks_per_question,
          section: slot.name,
          slot: slot.slot,
          choiceGroup: group,
          expectedWords: words,
        })
      }
    }

    const missingAnswers = slot.count - answers
    if (missingAnswers > 0) {
      shortfalls.push({
        section: slot.name,
        slot: slot.slot,
        reason: `Only ${answers} of ${slot.count} ${slot.slot} question${slot.count === 1 ? '' : 's'} could be found in the bank for these chapters.`,
        marks_missing: missingAnswers * slot.marks_per_question,
      })
    }
    const lostChoices = orCount - alternates
    if (lostChoices > 0 && missingAnswers === 0) {
      shortfalls.push({
        section: slot.name,
        slot: slot.slot,
        reason: `${lostChoices} ${lostChoices === 1 ? 'choice (OR)' : 'choices (OR)'} in ${slot.slot} has no alternative question, because the bank had no more to offer.`,
        marks_missing: 0,
      })
    }
  }

  const nominalMarks = layout.sections.reduce(
    (n, s) => n + s.marks_per_question * s.count,
    0,
  )
  const printedMarks = picks
    .filter((p) => !p.isAlternate)
    .reduce((n, p) => n + p.marks, 0)

  // The same pre-show checks the student paper has: continuous numbering, four options, section totals.
  const optionRows = await examPrintRepository.optionsFor(
    db,
    picks.map((p) => p.questionId),
  )
  const optionCount = new Map<string, number>()
  for (const o of optionRows)
    optionCount.set(o.question_id, (optionCount.get(o.question_id) ?? 0) + 1)
  const missingBySection = new Map<string, number>()
  for (const f of shortfalls)
    missingBySection.set(
      f.section,
      (missingBySection.get(f.section) ?? 0) + f.marks_missing,
    )
  const problems = checkPaperStructure(
    picks.map((p) => ({
      section: p.section,
      position: p.position,
      marks: p.marks,
      type: p.type,
      optionCount: optionCount.get(p.questionId) ?? 0,
      choiceGroup: p.choiceGroup,
      isChoiceAlternate: p.isAlternate,
    })),
    [...missingBySection].map(([section, marksMissing]) => ({
      section,
      marksMissing,
    })),
    layout.config.section_totals,
    nominalMarks,
  )
  if (problems.length > 0)
    throw new Error(`The paper did not pass its checks: ${problems.join('; ')}`)
  return { picks, shortfalls, nominalMarks, printedMarks }
}

/** A row the student answers in writing (so it gets a word limit and a written answer box). */
export function isWrittenSlot(slot: LayoutSection): boolean {
  if (slot.tag) return true
  return !(slot.types ?? []).every((t) => isObjectiveType(t))
}
