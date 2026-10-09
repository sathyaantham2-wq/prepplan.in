import type { Db } from '../db/connection'
import type { BloomLevel, DifficultyTier, QuestionType } from '../db/enums'
import {
  blueprintsRepository,
  papersRepository,
  paperQuestionsRepository,
  conceptStatusRepository,
  questionsRepository,
  questionUsageRepository,
  chaptersRepository,
} from '../db/repositories'
import { adaptiveLevel } from './adaptive/levels'
import type { AdaptiveLevel } from './adaptive/levels'
import { loadMasteryConfig, signalsForConcepts } from './adaptive/service'
import {
  allocateQuestions,
  bucketForConcept,
  bucketWeighting,
  computeConceptWeights,
  guaranteeRetention,
} from './adaptive/weights'
import type { ConceptSignal, ConceptWeight } from './adaptive/weights'
import {
  LEVEL_BLOOMS,
  SPECIAL_TAGS,
  THINKING_LEVELS,
  checkPaperStructure,
  expectedWordsFor,
  levelOfBloom,
  parseHalfYearlyConfig,
} from './school-paper'
import type { CheckSlot, ThinkingLevel } from './school-paper'
import { isObjectiveType } from './scoring'

const DIFFICULTY_ORDER: Array<DifficultyTier> = ['Easy', 'Hard', 'Hardest']

// F119: the ceiling limits which difficulty tiers are eligible, but does not touch which
// concepts get selected — the 40/40/20 weak/priority weighting below runs unconditionally.
export function difficultiesUpTo(
  ceiling: DifficultyTier,
): Array<DifficultyTier> {
  const idx = DIFFICULTY_ORDER.indexOf(ceiling)
  return DIFFICULTY_ORDER.slice(0, idx + 1)
}

export type Bucket = 'weak_priority' | 'needs_practice' | 'strong'

export interface Weighting {
  weak_priority: number
  needs_practice: number
  strong: number
}

export const DEFAULT_WEIGHTING: Weighting = {
  weak_priority: 40,
  needs_practice: 40,
  strong: 20,
}

// Largest-remainder apportionment: floor each key's share, then hand out the leftover units to
// whichever keys had the biggest fractional part, so the counts always sum to `total`. Weights
// are normalised by their own sum rather than assumed to sum to 100, so this works equally for
// percentage weightings (F028's 40/40/20) and raw counts (F113's per-chapter concept counts).
export function allocateProportionally<TKey extends string>(
  total: number,
  weights: Record<TKey, number>,
): Record<TKey, number> {
  const keys = Object.keys(weights) as Array<TKey>
  const weightSum = keys.reduce((sum, k) => sum + weights[k], 0)

  if (weightSum <= 0) {
    // No signal to weight by (e.g. every chapter has zero concepts) -- split as evenly as
    // possible rather than divide by zero, so generation still proceeds instead of erroring.
    const evenWeights = Object.fromEntries(keys.map((k) => [k, 1])) as Record<
      TKey,
      number
    >
    return allocateProportionally(total, evenWeights)
  }

  const raw = keys.map((key) => ({
    key,
    value: (total * weights[key]) / weightSum,
  }))
  const floored = raw.map((r) => ({
    key: r.key,
    count: Math.floor(r.value),
    frac: r.value % 1,
  }))
  let remainder = total - floored.reduce((sum, r) => sum + r.count, 0)

  const byFracDesc = [...floored].sort((a, b) => b.frac - a.frac)
  for (const entry of byFracDesc) {
    if (remainder <= 0) break
    entry.count += 1
    remainder -= 1
  }

  return Object.fromEntries(floored.map((r) => [r.key, r.count])) as Record<
    TKey,
    number
  >
}

export function allocateByWeighting(
  total: number,
  weighting: Weighting,
): Record<Bucket, number> {
  return allocateProportionally(total, weighting)
}

/**
 * F113: default per-chapter marks target is proportional to how many concepts that chapter
 * contributes to the selected scope; `override` (validated to sum to 100 by the route) replaces
 * that default entirely when the caller wants to weight chapters by hand instead.
 */
export function computeChapterMarksTargets(
  totalMarks: number,
  chapterConceptCounts: Record<string, number>,
  override?: Record<string, number>,
): Record<string, number> {
  return allocateProportionally(totalMarks, override ?? chapterConceptCounts)
}

interface BlueprintSection {
  name: string
  marks_per_question: number
  count: number
  bloom_allowed: Array<BloomLevel>
  // School Half-Yearly layout fields (see school-paper.ts); a legacy section sets none of them.
  slot?: string
  types?: Array<QuestionType>
  tag?: string
  discipline?: string
  or_count?: number
}

// F030: "Choice pairs marked in the paper, counted once in total marks, and handled correctly in
// evaluation and coverage stats." choice_rules (migration 0013) has always been stored but never
// shape-checked or acted on -- {section, count} is a documented default (the plan names the
// feature, never a parameter shape), the same kind RETEST_LADDER_DAYS and
// STUDENT_DAILY_GENERATION_QUOTA already are elsewhere in this codebase. `count` is how many of
// that section's slots (the first `count`, filled in generation order) become an OR pair: two
// alternative questions sharing a choice_group, of which the student answers only one.
interface ChoiceRule {
  section: string
  count: number
}

export interface GeneratePaperInput {
  student_id: string
  blueprint_id: string
  chapter_ids: Array<string>
  // Narrows the paper to these concepts inside chapter_ids (a student practising one concept, or
  // the few a chapter needs most). Unset means every concept of the chosen chapters, as before.
  // The weak/priority weighting still applies among whatever concepts are left.
  concept_ids?: Array<string>
  theme?: string
  // Honoured only when `adaptive` is true. A normal paper's difficulty mix comes from its
  // blueprint, never from the caller (owner decision 2026-10-05).
  difficulty_ceiling?: DifficultyTier
  weighting_override?: Weighting
  // Where the paper will be answered. A ruler-and-compass (construction) question is only
  // eligible for a paper that will be printed or uploaded, never for a phone attempt.
  delivery?: 'screen' | 'print'
  // F113: chapter_id -> percentage (must sum to 100, enforced by the route). Overrides the
  // concept-count-proportional default entirely when supplied.
  chapter_weighting_override?: Record<string, number>
  // How far back "recently served" looks when avoiding repeats — a lightweight version of F026.
  recentUsageWindowDays?: number
  // Concept-level adaptive mode: buckets, per-concept question counts and per-concept difficulty
  // come from the student's own mastery. A student with no history starts at Easy (level 1).
  adaptive?: boolean
  // Overrides the blueprint name as the paper title (adaptive papers use a friendlier one).
  title?: string
}

interface AdaptiveContext {
  signals: Array<ConceptSignal>
  weights: Array<ConceptWeight>
  targetByConcept: Map<string, number>
  assignedByConcept: Map<string, number>
  levelByConcept: Map<string, AdaptiveLevel>
  relaxedSlots: number
}

interface Shortfall {
  section: string
  bucket?: Bucket
  reason: string
  // School Half-Yearly: the layout slot, and how many marks of it the shortfall leaves unfilled.
  slot?: string
  marks_missing?: number
}

/**
 * The paper generator (F027-F032, F113, F119). Draws questions per blueprint section, weighting
 * concept selection 40/40/20 across weak+priority / needs-practice / strong (F028) regardless of
 * the difficulty ceiling the student picked (F119), spreads marks across the selected chapters
 * proportionally to each chapter's concept count (F113), and reports rather than blocks when a
 * slot, the Bloom mix, or a chapter's proportional target can't be satisfied (F032/F029/F113).
 *
 * F030: blueprint.choice_rules ({section, count}) turns the first `count` slots filled in a
 * named section into OR pairs -- two alternative questions sharing a paper_questions.choice_group,
 * of which the student answers only one. A section with no matching rule behaves exactly as
 * before this feature existed.
 */
export async function generatePaper(db: Db, input: GeneratePaperInput) {
  const blueprint = await blueprintsRepository.findById(db, input.blueprint_id)
  if (!blueprint) {
    throw new Error('Blueprint not found')
  }

  const sections = blueprint.sections as unknown as Array<BlueprintSection>
  const bloomTargets = blueprint.bloom_targets as unknown as Record<
    BloomLevel,
    number
  >
  const choiceRules = (blueprint.choice_rules ??
    []) as unknown as Array<ChoiceRule>
  const choicePairCountBySection = new Map(
    choiceRules.map((r) => [r.section, r.count]),
  )
  let weighting = input.weighting_override ?? DEFAULT_WEIGHTING
  const difficultyCeiling = input.adaptive
    ? (input.difficulty_ceiling ?? 'Hardest')
    : 'Hardest'
  const difficultiesAllowed = difficultiesUpTo(difficultyCeiling)
  const recentWindowDays = input.recentUsageWindowDays ?? 14

  const chapterConcepts = await db
    .selectFrom('concepts')
    .select(['id', 'chapter_id'])
    .where('chapter_id', 'in', input.chapter_ids)
    .$if(Boolean(input.concept_ids?.length), (qb) =>
      qb.where('id', 'in', input.concept_ids!),
    )
    .execute()
  const conceptIds = chapterConcepts.map((c) => c.id)
  const chapterByConceptId = new Map(
    chapterConcepts.map((c) => [c.id, c.chapter_id]),
  )

  // F113: every requested chapter gets an entry even with zero concepts, so it still shows up
  // (at a 0-mark target) rather than silently vanishing from the proportional split.
  const chapterConceptCounts: Record<string, number> = Object.fromEntries(
    input.chapter_ids.map((id) => [id, 0]),
  )
  for (const c of chapterConcepts) {
    chapterConceptCounts[c.chapter_id] =
      (chapterConceptCounts[c.chapter_id] ?? 0) + 1
  }
  const nominalTotalMarks = sections.reduce(
    (sum, s) => sum + s.marks_per_question * s.count,
    0,
  )
  // School Half-Yearly: the layout is blueprint data (blueprints.config); a legacy blueprint has
  // none, and every half-yearly branch below is skipped for it.
  const halfYearly = parseHalfYearlyConfig(blueprint.config)
  const delivery = input.delivery ?? 'screen'
  const chapterRows = await db
    .selectFrom('chapters')
    .select(['id', 'discipline', 'name'])
    .where('id', 'in', input.chapter_ids)
    .execute()
  const disciplineByChapter = new Map(chapterRows.map((c) => [c.id, c.discipline]))
  const chapterNameById = new Map(chapterRows.map((c) => [c.id, c.name]))
  const hasDisciplineOf = (chapterId: string, discipline: string | undefined) =>
    !discipline || disciplineByChapter.get(chapterId) === discipline

  // F113 per-chapter marks targets. A slot tied to a discipline (Social Science: History,
  // Geography, ...) only draws on that discipline's chapters, so its marks are shared out among
  // those chapters alone; everything else is shared across all chosen chapters as before.
  const chapterMarksTargets: Record<string, number> = computeChapterMarksTargets(
    sections
      .filter((s) => !s.discipline)
      .reduce((sum, s) => sum + s.marks_per_question * s.count, 0),
    chapterConceptCounts,
    input.chapter_weighting_override,
  )
  for (const discipline of new Set(sections.flatMap((s) => (s.discipline ? [s.discipline] : [])))) {
    const marks = sections
      .filter((s) => s.discipline === discipline)
      .reduce((sum, s) => sum + s.marks_per_question * s.count, 0)
    const inDiscipline = input.chapter_ids.filter((id) => hasDisciplineOf(id, discipline))
    if (inDiscipline.length === 0) continue
    const shares = allocateProportionally(
      marks,
      Object.fromEntries(inDiscipline.map((id) => [id, chapterConceptCounts[id] ?? 0])),
    )
    for (const id of inDiscipline) chapterMarksTargets[id] = (chapterMarksTargets[id] ?? 0) + shares[id]
  }
  const chapterMarksAssigned: Record<string, number> = Object.fromEntries(
    input.chapter_ids.map((id) => [id, 0]),
  )

  const statuses = await conceptStatusRepository.list(db, input.student_id)
  const statusByConcept = new Map(statuses.map((s) => [s.concept_id, s.status]))

  const now = new Date()
  let adaptiveCtx: AdaptiveContext | null = null
  let adaptiveConfig: Awaited<ReturnType<typeof loadMasteryConfig>> | null = null
  if (input.adaptive) {
    adaptiveConfig = await loadMasteryConfig(db)
    const signals = await signalsForConcepts(db, input.student_id, conceptIds, now)
    const weights = computeConceptWeights(signals, adaptiveConfig, now)
    const totalSlots = sections.reduce((sum, s) => sum + s.count, 0)
    adaptiveCtx = {
      signals,
      weights,
      targetByConcept: guaranteeRetention(
        allocateQuestions(weights, totalSlots, (id) => chapterByConceptId.get(id) ?? id),
        signals,
        totalSlots,
      ),
      assignedByConcept: new Map(),
      levelByConcept: new Map(signals.map((s) => [s.conceptId, s.currentLevel])),
      relaxedSlots: 0,
    }
    if (!input.weighting_override) {
      weighting = bucketWeighting(weights, signals, adaptiveConfig)
    }
  }

  const buckets: Record<Bucket, Array<string>> = {
    weak_priority: [],
    needs_practice: [],
    strong: [],
  }
  for (const conceptId of conceptIds) {
    if (adaptiveCtx && adaptiveConfig) {
      const signal = adaptiveCtx.signals.find((s) => s.conceptId === conceptId)
      buckets[signal ? bucketForConcept(signal, adaptiveConfig) : 'needs_practice'].push(conceptId)
      continue
    }
    const status = statusByConcept.get(conceptId)
    if (status === 'Weak' || status === 'Priority')
      buckets.weak_priority.push(conceptId)
    else if (status === 'Strong' || status === 'Maintenance')
      buckets.strong.push(conceptId)
    else buckets.needs_practice.push(conceptId) // "Needs Practice" and never-attempted both land here
  }

  // F069: "re-test items appear automatically in the next generated paper." A cleared concept
  // whose spaced-retest date has passed gets first refusal on any 'strong' bucket slot -- see the
  // due-pool preference a few lines below, inside the section loop.
  const dueRetestConceptIds = adaptiveCtx
    ? new Set(
        adaptiveCtx.signals
          .filter((s) => s.retention === 'due' || s.retention === 'lapsed')
          .map((s) => s.conceptId),
      )
    : new Set(
        statuses
          .filter(
            (s) =>
              (s.status === 'Strong' || s.status === 'Maintenance') &&
              s.next_retest_at !== null &&
              new Date(s.next_retest_at) <= now,
          )
          .map((s) => s.concept_id),
      )

  const excludeQuestionIds = new Set(
    await questionUsageRepository.listRecentQuestionIds(
      db,
      input.student_id,
      recentWindowDays,
    ),
  )

  type Candidate = { id: string; bloom: BloomLevel; concept_id: string; difficulty: DifficultyTier; type: QuestionType }

  // One place that fetches a question for a slot. Normal mode is the original single query over
  // the pool. Adaptive mode walks the pool from the concept with the biggest unmet question target
  // and only offers questions at or below that concept's current difficulty level (preferring the
  // level itself), so a new student starts on Easy and a strong concept gets harder questions.
  async function findForSlot(
    pool: Array<string>,
    section: BlueprintSection,
  ): Promise<Candidate | undefined> {
    const base = {
      bloomAllowed: section.bloom_allowed,
      difficultiesAllowed,
      marks: section.marks_per_question,
      excludeQuestionIds: [...excludeQuestionIds],
      ...(halfYearly
        ? {
            types: section.types,
            requiredTag: section.tag,
            // A plain slot never receives a special question; a ruler-and-compass one is only
            // eligible when the paper will be printed.
            excludeTags: SPECIAL_TAGS.filter(
              (t) => t !== section.tag && !(t === 'construction' && delivery === 'print'),
            ),
            requireDiagram: section.tag === 'map' || section.tag === 'figure',
          }
        : {}),
    }
    if (!adaptiveCtx) {
      const rows = await questionsRepository.findEligibleForSlot(db, { conceptIds: pool, ...base }, 1)
      return rows.at(0)
    }
    const ctx = adaptiveCtx
    const deficit = (id: string) =>
      (ctx.targetByConcept.get(id) ?? 0) - (ctx.assignedByConcept.get(id) ?? 0)
    const ordered = [...pool]
      .map((id) => ({ id, d: deficit(id) + Math.random() * 0.01 }))
      .sort((a, b) => b.d - a.d)
      .map((x) => x.id)
    let fallback: Candidate | undefined
    for (const conceptId of ordered) {
      const level = ctx.levelByConcept.get(conceptId) ?? 1
      const rows = await questionsRepository.findEligibleForSlot(db, { conceptIds: [conceptId], ...base }, 12)
      if (rows.length === 0) continue
      const withLevel = rows.map((q) => ({ q, l: adaptiveLevel(q.bloom, q.difficulty) }))
      const usable = withLevel.filter((x) => x.l <= level)
      if (usable.length > 0) {
        return (usable.find((x) => x.l === level) ?? usable[0]).q
      }
      const lowest = withLevel.sort((a, b) => a.l - b.l)[0]
      if (!fallback || adaptiveLevel(fallback.bloom, fallback.difficulty) > lowest.l) fallback = lowest.q
    }
    if (fallback) ctx.relaxedSlots += 1
    return fallback
  }

  const selected: Array<{
    section: string
    marks: number
    bucket: Bucket
    question: { id: string; bloom: BloomLevel }
    // F030: set on both members of an OR pair. The alternate (isChoiceAlternate) still gets its
    // own paper_questions row (position, question_usage) but is excluded from every "actual mix"
    // stat below (Bloom/chapter/bucket/total marks) -- only one of the pair was ever going to be
    // answered, so only one should count toward what the paper's contents "really" are.
    choiceGroup?: string
    isChoiceAlternate?: boolean
    slot?: string
    expectedWords?: number
    type: QuestionType
    concept_id: string
  }> = []
  const shortfalls: Array<Shortfall> = []

  // ---- School Half-Yearly helpers (all inert for a legacy blueprint) -------------------------
  const levelTargetMarks: Record<ThinkingLevel, number> = {
    recall_understanding: 0,
    application: 0,
    analysis_evaluation: 0,
  }
  const levelAssignedMarks: Record<ThinkingLevel, number> = { ...levelTargetMarks }
  // Thinking levels a slot can serve: those that share a Bloom level with its bloom_allowed.
  const levelsFor = (section: BlueprintSection): Array<ThinkingLevel> =>
    THINKING_LEVELS.filter((l) => LEVEL_BLOOMS[l].some((b) => section.bloom_allowed.includes(b)))
  // One planned thinking level per question slot, so the paper lands on the blueprint's mix
  // instead of whatever the first slots happen to draw. The most constrained slots are placed
  // first; each goes to the allowed level with the most marks still to fill.
  const levelPlan = new Map<BlueprintSection, Array<ThinkingLevel>>()
  if (halfYearly) {
    for (const l of THINKING_LEVELS) {
      levelTargetMarks[l] = (halfYearly.level_mix[l] / 100) * nominalTotalMarks
    }
    const remaining = { ...levelTargetMarks }
    const units = sections.flatMap((section) =>
      Array.from({ length: section.count }, () => section),
    )
    const order = [...units].sort(
      (a, b) =>
        levelsFor(a).length - levelsFor(b).length ||
        b.marks_per_question - a.marks_per_question,
    )
    for (const section of order) {
      const allowed = levelsFor(section)
      const best = [...allowed].sort((x, y) => remaining[y] - remaining[x])[0]
      remaining[best] -= section.marks_per_question
      const plan = levelPlan.get(section) ?? []
      plan.push(best)
      levelPlan.set(section, plan)
    }
  }
  // Unfilled slots are reported once per layout slot (not once per question), with the marks the
  // gap leaves empty, so the section totals still reconcile and nothing is hidden (F032).
  const slotMissing = new Map<
    string,
    { section: string; slot: string; count: number; marks: number; reason: string }
  >()
  const orMissing = new Map<string, { section: string; slot: string; count: number }>()
  const slotFields = (section: BlueprintSection, q: Candidate) => ({
    slot: section.slot,
    // Only a written question has an expected length; the word limit is snapshotted here so an
    // old paper never changes if the blueprint's limits are edited later.
    expectedWords:
      halfYearly && !isObjectiveType(q.type)
        ? (expectedWordsFor(section.marks_per_question, halfYearly) ?? undefined)
        : undefined,
    type: q.type,
    concept_id: q.concept_id,
  })

  for (const section of sections) {
    const allocation = allocateByWeighting(section.count, weighting)
    const choicePairCount = Math.min(
      halfYearly
        ? (section.or_count ?? 0)
        : (choicePairCountBySection.get(section.name) ?? 0),
      section.count,
    )
    let sectionSlotIndex = 0
    // A discipline slot (History, Geography, ...) draws only on chapters of that discipline;
    // the other disciplines' chapters are never used to fill it.
    const sectionChapterIds = input.chapter_ids.filter((id) =>
      hasDisciplineOf(id, section.discipline),
    )
    const sectionConceptSet = new Set(
      conceptIds.filter((id) => sectionChapterIds.includes(chapterByConceptId.get(id) ?? '')),
    )
    const sectionConceptIds = [...sectionConceptSet]
    const plannedLevels = [...(levelPlan.get(section) ?? [])]

    // Picks a question for this slot at its planned thinking level, falling back to the other
    // levels this slot can serve (the shortfall report then shows the mix drifted).
    const pickForSlot = async (
      pool: Array<string>,
      preferred: ThinkingLevel | undefined,
    ): Promise<Candidate | undefined> => {
      if (!halfYearly || !preferred) return findForSlot(pool, section)
      const levels = [
        preferred,
        ...levelsFor(section)
          .filter((l) => l !== preferred)
          .sort((x, y) => levelTargetMarks[y] - levelAssignedMarks[y] - (levelTargetMarks[x] - levelAssignedMarks[x])),
      ]
      for (const level of levels) {
        if (!levelsFor(section).includes(level)) continue
        const hit = await findForSlot(pool, {
          ...section,
          bloom_allowed: section.bloom_allowed.filter((b) => LEVEL_BLOOMS[level].includes(b)),
        })
        if (hit) return hit
      }
      return undefined
    }

    for (const bucket of [
      'weak_priority',
      'needs_practice',
      'strong',
    ] as Array<Bucket>) {
      for (let i = 0; i < allocation[bucket]; i++) {
        // Fall back to the full chapter concept pool if this bucket happens to be empty (e.g. a
        // brand-new student with no Strong concepts yet) rather than silently under-filling.
        const plannedLevel = plannedLevels.shift()
        const bucketPool = buckets[bucket].filter((id) => sectionConceptSet.has(id))
        const pool = bucketPool.length > 0 ? bucketPool : sectionConceptIds

        // F113: try chapters in order of largest remaining proportional deficit first, so marks
        // land on the chapter that most needs them; a chapter with a 0 target (e.g. no concepts)
        // is skipped entirely.
        const chaptersByDeficit = [...sectionChapterIds].sort(
          (a, b) =>
            chapterMarksTargets[b] -
            chapterMarksAssigned[b] -
            (chapterMarksTargets[a] - chapterMarksAssigned[a]),
        )

        let picked: Candidate | undefined
        let chosenChapterId: string | undefined

        for (const chapterId of chaptersByDeficit) {
          if ((chapterMarksTargets[chapterId] ?? 0) <= 0) continue
          const chapterPool = pool.filter(
            (id) => chapterByConceptId.get(id) === chapterId,
          )
          if (chapterPool.length === 0) continue

          // F069: a 'strong' slot goes to a due re-test concept first, if this chapter has one
          // eligible for this slot's bloom/difficulty/marks -- falls through to the normal
          // chapterPool below when it doesn't.
          if (bucket === 'strong') {
            const duePool = chapterPool.filter((id) =>
              dueRetestConceptIds.has(id),
            )
            if (duePool.length > 0) {
              const dueEligible = await pickForSlot(duePool, plannedLevel)
              if (dueEligible) {
                picked = dueEligible
                chosenChapterId = chapterId
                break
              }
            }
          }

          const eligible = await pickForSlot(chapterPool, plannedLevel)
          if (eligible) {
            picked = eligible
            chosenChapterId = chapterId
            break
          }
        }

        // No chapter with a live deficit could supply this slot -- fall back to the whole pool
        // (old, chapter-agnostic behaviour) so the paper still fills, and say so rather than
        // silently drifting from the proportional target (F032's "report, never hide").
        if (!picked) {
          picked = await pickForSlot(pool, plannedLevel)
          chosenChapterId = picked
            ? chapterByConceptId.get(picked.concept_id)
            : undefined
          if (picked) {
            shortfalls.push({
              section: section.name,
              bucket,
              reason: `Question drawn from chapter ${chosenChapterId ?? 'unknown'} instead of the chapter with the largest remaining proportional target -- no eligible question existed there for this slot`,
            })
          }
        }

        if (!picked) {
          if (halfYearly) {
            const key = `${section.name}#${section.slot ?? ''}`
            const entry = slotMissing.get(key) ?? {
              section: section.name,
              slot: section.slot ?? `${section.marks_per_question}-mark`,
              count: 0,
              marks: 0,
              reason: section.discipline && sectionChapterIds.length === 0
                ? `none of the chosen chapters is ${section.discipline}, so this was left out rather than filled from another discipline`
                : `no approved question in the bank for ${section.tag ? `a ${section.tag.replace('_', ' ')} question` : `types [${(section.types ?? ['any']).join(', ')}]`}, bloom [${section.bloom_allowed.join(', ')}], ${section.marks_per_question} mark(s)${section.tag === 'map' || section.tag === 'figure' ? ', with an original figure' : ''}`,
            }
            entry.count += 1
            entry.marks += section.marks_per_question
            slotMissing.set(key, entry)
            continue
          }
          shortfalls.push({
            section: section.name,
            bucket,
            reason: `No approved question available for bloom in [${section.bloom_allowed.join(', ')}], difficulty<=${difficultyCeiling}, ${section.marks_per_question} mark(s)`,
          })
          continue
        }
        levelAssignedMarks[levelOfBloom(picked.bloom)] += section.marks_per_question

        excludeQuestionIds.add(picked.id)
        if (adaptiveCtx) {
          adaptiveCtx.assignedByConcept.set(
            picked.concept_id,
            (adaptiveCtx.assignedByConcept.get(picked.concept_id) ?? 0) + 1,
          )
        }
        if (chosenChapterId) {
          chapterMarksAssigned[chosenChapterId] =
            (chapterMarksAssigned[chosenChapterId] ?? 0) +
            section.marks_per_question
        }

        // F030: the first `choicePairCount` slots filled in this section (across every bucket,
        // in generation order) become OR pairs -- a documented default for "which slots", since
        // the plan names the count per section, never which specific ones.
        const isChoiceSlot = sectionSlotIndex < choicePairCount
        sectionSlotIndex += 1
        let choiceGroup: string | undefined

        if (isChoiceSlot) {
          const alternatePool = chosenChapterId
            ? pool.filter((id) => chapterByConceptId.get(id) === chosenChapterId)
            : pool
          // Half-Yearly OR: same marks and same thinking level as the first option, but from a
          // DIFFERENT concept of the chosen chapters, so the choice is a real one.
          const alternate = halfYearly
            ? await findForSlot(
                sectionConceptIds.filter((id) => id !== picked.concept_id),
                {
                  ...section,
                  bloom_allowed: section.bloom_allowed.filter((b) =>
                    LEVEL_BLOOMS[levelOfBloom(picked.bloom)].includes(b),
                  ),
                },
              )
            : await findForSlot(
                alternatePool.length > 0 ? alternatePool : pool,
                section,
              )
          if (alternate) {
            choiceGroup = `${section.name}#${section.slot ?? ''}#${sectionSlotIndex}`
            excludeQuestionIds.add(alternate.id)
            selected.push({
              ...slotFields(section, picked),
              section: section.name,
              marks: section.marks_per_question,
              bucket,
              question: { id: picked.id, bloom: picked.bloom },
              choiceGroup,
            })
            selected.push({
              ...slotFields(section, alternate),
              section: section.name,
              marks: section.marks_per_question,
              bucket,
              question: alternate,
              choiceGroup,
              isChoiceAlternate: true,
            })
            continue
          }
          if (halfYearly) {
            const key = `${section.name}#${section.slot ?? ''}`
            const entry = orMissing.get(key) ?? { section: section.name, slot: section.slot ?? '', count: 0 }
            entry.count += 1
            orMissing.set(key, entry)
          } else {
            shortfalls.push({
              section: section.name,
              bucket,
              reason:
                'Internal choice requested for this slot but no second eligible question was available -- printed as a single required question instead',
            })
          }
        }

        selected.push({
          ...slotFields(section, picked),
          section: section.name,
          marks: section.marks_per_question,
          bucket,
          question: { id: picked.id, bloom: picked.bloom },
        })
      }
    }
  }

  // F030: every "actual mix" stat below counts each OR pair once (the primary member only) --
  // only one of the pair was ever going to be answered, so the alternate shouldn't inflate what
  // the paper's contents "really" are. paperQuestions/question_usage still use `selected` in
  // full, since BOTH members are real rows the student needs printed and excluded from reuse.
  const countedSelected = selected.filter((item) => !item.isChoiceAlternate)

  // School Half-Yearly: one shortfall line per unfilled layout slot, carrying the marks it
  // leaves empty (so printed + shortfall marks still add up to the section total).
  for (const m of slotMissing.values()) {
    shortfalls.push({
      section: m.section,
      slot: m.slot,
      marks_missing: m.marks,
      reason: `${m.slot}: ${m.count} question(s), ${m.marks} mark(s) NOT printed -- ${m.reason}`,
    })
  }
  for (const m of orMissing.values()) {
    shortfalls.push({
      section: m.section,
      slot: m.slot,
      marks_missing: 0,
      reason: `${m.slot}: ${m.count} internal choice(s) printed without an OR -- no second question of the same marks and thinking level from a different concept was available`,
    })
  }

  // F029: report the actual Bloom mix and flag any target missed by more than 5 percentage
  // points, rather than blocking paper generation on it.
  const bloomCounts = new Map<BloomLevel, number>()
  for (const item of countedSelected) {
    bloomCounts.set(
      item.question.bloom,
      (bloomCounts.get(item.question.bloom) ?? 0) + 1,
    )
  }
  const bloomActual: Partial<Record<BloomLevel, number>> = {}
  for (const [bloom, count] of bloomCounts) {
    bloomActual[bloom] =
      Math.round((count / Math.max(countedSelected.length, 1)) * 1000) / 10
  }
  // Adaptive papers choose by difficulty level, so a fixed Bloom mix does not apply to them.
  for (const [bloom, target] of (input.adaptive || halfYearly
    ? []
    : Object.entries(bloomTargets)) as Array<[BloomLevel, number]>) {
    const actual = bloomActual[bloom] ?? 0
    if (Math.abs(actual - target) > 5) {
      shortfalls.push({
        section: 'overall',
        reason: `Bloom mix off target: ${bloom} is ${actual}% vs a ${target}% target`,
      })
    }
  }

  // School Half-Yearly: the mix is stated in thinking levels (by marks). Report the real one and
  // flag a level that missed its target by more than 5 points.
  const levelPrinted = Math.max(
    THINKING_LEVELS.reduce((n, l) => n + levelAssignedMarks[l], 0),
    1,
  )
  const levelActualPct = Object.fromEntries(
    THINKING_LEVELS.map((l) => [l, Math.round((levelAssignedMarks[l] / levelPrinted) * 1000) / 10]),
  ) as Record<ThinkingLevel, number>
  if (halfYearly) {
    for (const l of THINKING_LEVELS) {
      if (Math.abs(levelActualPct[l] - halfYearly.level_mix[l]) > 5) {
        shortfalls.push({
          section: 'overall',
          reason: `Thinking-level mix off target: ${l.replace('_', ' ')} is ${levelActualPct[l]}% of the printed marks vs a ${halfYearly.level_mix[l]}% target`,
        })
      }
    }
  }

  // F113: flag any chapter whose actual marks drift from its proportional target by more than a
  // mark (or 5% of the paper, whichever is larger) -- small rounding gaps are expected and fine.
  // A Half-Yearly paper's chapter drift is a consequence of the unfilled slots already reported
  // one by one above, so it is not repeated per chapter.
  for (const chapterId of halfYearly ? [] : input.chapter_ids) {
    const target = chapterMarksTargets[chapterId] ?? 0
    const actual = chapterMarksAssigned[chapterId] ?? 0
    const tolerance = Math.max(1, nominalTotalMarks * 0.05)
    if (Math.abs(actual - target) > tolerance) {
      shortfalls.push({
        section: 'overall',
        reason: `Chapter ${halfYearly ? (chapterNameById.get(chapterId) ?? chapterId) : chapterId} got ${actual} mark(s) vs a ${target} mark proportional target`,
      })
    }
  }

  const bucketActual: Record<Bucket, number> = {
    weak_priority: 0,
    needs_practice: 0,
    strong: 0,
  }
  for (const item of countedSelected) bucketActual[item.bucket] += 1
  const bucketActualPct = Object.fromEntries(
    (Object.entries(bucketActual) as Array<[Bucket, number]>).map(
      ([bucket, count]) => [
        bucket,
        Math.round((count / Math.max(countedSelected.length, 1)) * 1000) / 10,
      ],
    ),
  )

  // F030: "counted once in total marks" -- an OR pair contributes its shared mark value once,
  // not once per printed alternative.
  const totalMarks = countedSelected.reduce((sum, item) => sum + item.marks, 0)

  // Slot numbers. A legacy paper numbers every row (an OR pair takes two numbers); a Half-Yearly
  // paper numbers a slot once, so both members of an OR pair share the printed number and the
  // paper reads 1..N with no gap.
  let runningNumber = 0
  const positions = selected.map((item) => {
    if (!halfYearly) return ++runningNumber
    if (!item.isChoiceAlternate) runningNumber += 1
    return runningNumber
  })

  // School Half-Yearly: structural checks before the paper is saved, so a broken paper is never
  // shown. Continuous numbering, four options on every multiple-choice question, and section
  // marks (printed + shortfall) adding up to the section totals and the paper total.
  if (halfYearly) {
    const optionTypeIds = selected
      .filter((item) => ['mcq', 'assertion_reason', 'multi_statement', 'match'].includes(item.type))
      .map((item) => item.question.id)
    const optionCounts = new Map<string, number>()
    if (optionTypeIds.length > 0) {
      const rows = await db
        .selectFrom('question_options')
        .select(['question_id', (eb) => eb.fn.countAll<string>().as('n')])
        .where('question_id', 'in', optionTypeIds)
        .groupBy('question_id')
        .execute()
      for (const r of rows) optionCounts.set(r.question_id, Number(r.n))
    }
    const checkSlots: Array<CheckSlot> = selected.map((item, index) => ({
      section: item.section,
      position: positions[index],
      marks: item.marks,
      type: item.type,
      optionCount: optionCounts.get(item.question.id) ?? 0,
      choiceGroup: item.choiceGroup ?? null,
      isChoiceAlternate: item.isChoiceAlternate ?? false,
    }))
    const problems = checkPaperStructure(
      checkSlots,
      shortfalls
        .filter((f) => f.marks_missing)
        .map((f) => ({ section: f.section, marksMissing: f.marks_missing ?? 0 })),
      halfYearly.section_totals,
      blueprint.total_marks,
    )
    if (problems.length > 0) {
      throw new Error(`School Half-Yearly paper failed its pre-show checks: ${problems.join('; ')}`)
    }
  }

  // F113: resolved for the paper header (part + chapter_no + name) -- read-only, so it's safe to
  // fetch outside the write transaction below.
  const chapters = await chaptersRepository.listByIds(db, input.chapter_ids)

  const result = await db.transaction().execute(async (trx) => {
    const paper = await papersRepository.insert(trx, {
      student_id: input.student_id,
      blueprint_id: input.blueprint_id,
      // F038: snapshots the blueprint's version at generation time, since blueprint_id alone is
      // a live FK -- if a blueprint is ever edited in place, this is what keeps an old paper
      // provably tied to the exact version it was actually generated from.
      blueprint_version: blueprint.version,
      subject_id: blueprint.subject_id,
      chapter_ids: input.chapter_ids,
      title: input.title ?? blueprint.name,
      total_marks: totalMarks,
      duration_min: blueprint.duration_min,
      theme: input.theme ?? 'Clean School',
      weighting: JSON.stringify({
        target: weighting,
        actual: bucketActualPct,
        bloom_target: bloomTargets,
        bloom_actual: bloomActual,
        ...(halfYearly
          ? {
              half_yearly: {
                draft: halfYearly.draft ?? false,
                draft_note: halfYearly.draft_note ?? null,
                section_totals: halfYearly.section_totals,
                section_order: halfYearly.section_order,
                instructions: halfYearly.instructions,
                word_limits: halfYearly.word_limits,
                level_target: halfYearly.level_mix,
                level_actual: levelActualPct,
                delivery,
              },
            }
          : {}),
        chapter_target: chapterMarksTargets,
        chapter_actual: chapterMarksAssigned,
        ...(adaptiveCtx
          ? {
              adaptive: {
                enabled: true,
                relaxed_slots: adaptiveCtx.relaxedSlots,
                concepts: adaptiveCtx.weights.map((w) => ({
                  concept_id: w.conceptId,
                  weight: Math.round(w.weight * 1000) / 1000,
                  reasons: w.reasons,
                  level: adaptiveCtx.levelByConcept.get(w.conceptId) ?? 1,
                  target: adaptiveCtx.targetByConcept.get(w.conceptId) ?? 0,
                  assigned: adaptiveCtx.assignedByConcept.get(w.conceptId) ?? 0,
                })),
              },
            }
          : {}),
      }),
      shortfalls:
        shortfalls.length > 0 ? JSON.stringify(shortfalls) : undefined,
    })

    const paperQuestions =
      selected.length > 0
        ? await paperQuestionsRepository.insertMany(
            trx,
            selected.map((item, index) => ({
              paper_id: paper.id,
              question_id: item.question.id,
              section: item.section,
              position: positions[index],
              marks: item.marks,
              choice_group: item.choiceGroup ?? null,
              slot: item.slot ?? null,
              expected_words: item.expectedWords ?? null,
            })),
          )
        : []

    for (const item of selected) {
      await questionUsageRepository.insert(trx, {
        student_id: input.student_id,
        question_id: item.question.id,
        paper_id: paper.id,
      })
    }

    return { paper, paperQuestions, shortfalls }
  })

  return { ...result, chapters }
}
