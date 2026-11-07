// Which bank question the automatic fill picks next (owner decision 2026-11-04, no F-number yet).
//
// Three rules, in this order:
//  1. Honour the paper's difficulty mix (Easy / Medium / Hard, by marks) and every difficulty must appear: the
//     difficulty furthest below its target share goes first. "Medium" is the bank's Hard tier and "Hard" its Hardest
//     tier (the bank's three tiers are Easy, Hard, Hardest).
//  2. Inside that difficulty, a question this school has never printed (or has in no other draft) goes before one it has;
//     when every one has been used, the one used longest ago goes first (least recently used).
//  3. Among those left, the thinking level (recall and understanding, application, analysis and evaluation) furthest
//     below the template's mix goes first, then a random one.
// Pure functions, so the rule is tested without a database.

import type { BloomLevel, DifficultyTier } from '../../db/enums'
import { levelOfBloom } from '../school-paper'
import type { ThinkingLevel } from '../school-paper'

export type DifficultyMix = Record<DifficultyTier, number>

/** Percent of the marks. Used when the teacher has not chosen a mix. */
export const DEFAULT_DIFFICULTY_MIX: DifficultyMix = { Easy: 40, Hard: 40, Hardest: 20 }

export interface RankCandidate {
  id: string
  difficulty: DifficultyTier
  bloom: BloomLevel
  /** when this school last printed it, or had it in another draft; null = never */
  lastUsedMs: number | null
}

export interface FillState {
  marksByDifficulty: Partial<Record<DifficultyTier, number>>
  marksByLevel: Partial<Record<ThinkingLevel, number>>
  totalMarks: number
}

const TIERS: ReadonlyArray<DifficultyTier> = ['Easy', 'Hard', 'Hardest']

/** A teacher's mix as received from the screen: whole percents, any of the three missing falls back to the default. */
export function normalizeMix(input: unknown): DifficultyMix {
  if (typeof input !== 'object' || input === null) return DEFAULT_DIFFICULTY_MIX
  const o = input as Record<string, unknown>
  const mix = {} as DifficultyMix
  let sum = 0
  for (const t of TIERS) {
    const v = Number(o[t])
    mix[t] = Number.isFinite(v) && v >= 0 ? v : 0
    sum += mix[t]
  }
  return sum > 0 ? mix : DEFAULT_DIFFICULTY_MIX
}

function deficit(target: number, have: number, total: number): number {
  const share = total > 0 ? (have / total) * 100 : 0
  return target - share
}

export function pickNext<T extends RankCandidate>(
  candidates: ReadonlyArray<T>,
  state: FillState,
  mix: DifficultyMix,
  levelMix: Partial<Record<ThinkingLevel, number>>,
  random: () => number = Math.random,
): T | undefined {
  if (candidates.length === 0) return undefined

  // 1. the difficulty furthest below its target among those the bank can still give (a tier with target 0 is skipped)
  const available = TIERS.filter((t) => mix[t] > 0 && candidates.some((c) => c.difficulty === t))
  const tiers = available.length > 0 ? available : TIERS.filter((t) => candidates.some((c) => c.difficulty === t))
  const tier = [...tiers].sort(
    (a, b) =>
      deficit(mix[b], state.marksByDifficulty[b] ?? 0, state.totalMarks) - deficit(mix[a], state.marksByDifficulty[a] ?? 0, state.totalMarks) ||
      TIERS.indexOf(a) - TIERS.indexOf(b),
  )[0]
  const ofTier = candidates.filter((c) => c.difficulty === tier)

  // 2. never used first; otherwise the longest unused
  const never = ofTier.filter((c) => c.lastUsedMs === null)
  let pool: ReadonlyArray<T>
  if (never.length > 0) pool = never
  else {
    const oldest = Math.min(...ofTier.map((c) => c.lastUsedMs as number))
    pool = ofTier.filter((c) => c.lastUsedMs === oldest)
  }

  // 3. the thinking level furthest below the template's mix, then random
  const levelDeficit = (c: T) => {
    const l = levelOfBloom(c.bloom)
    return deficit(levelMix[l] ?? 0, state.marksByLevel[l] ?? 0, state.totalMarks)
  }
  const best = Math.max(...pool.map(levelDeficit))
  const top = pool.filter((c) => levelDeficit(c) === best)
  return top[Math.floor(random() * top.length)]
}
