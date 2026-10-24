import type { Db } from '../db/connection'
import { studentUnlocksRepository } from '../db/repositories'
import { DEFAULT_THEME, PAPER_THEMES, isKnownTheme } from './pdf/theme-keys'
import type { PaperTheme } from './pdf/theme-keys'

// Coins are earned (student_points_ledger, 1 coin per point) and spent here, on unlocking paper
// themes (owner-approved 2026-10-24). Points stay a pure score and are never reduced.
//
// PRICE TABLE -- the one place to edit. The default theme is always free. The two other packs are
// the same kind of reward (a decorative border and font over the same paper; neither is clearly
// more "premium" than the other), so they share one price: 200 coins (an Easy answer pays 10,
// a Hard 20, a Hardest 30). Add a tier by giving a theme a bigger number.
export const THEME_PRICES: Record<PaperTheme, number> = {
  'Clean School': 0,
  'Doodle Journal': 200,
  Manga: 200,
}

export type RewardKind = 'paper_theme'

export interface RewardItem {
  key: string
  name: string
  kind: RewardKind
  price: number
  unlocked: boolean
  is_default: boolean
}

export interface RewardsView {
  coins: number
  items: Array<RewardItem>
}

export function isDefaultTheme(key: string): boolean {
  return key === DEFAULT_THEME
}

export const spendableCoins = (db: Db, studentId: string) =>
  studentUnlocksRepository.spendableCoins(db, studentId)
export const unlockedKeys = (db: Db, studentId: string) => studentUnlocksRepository.keys(db, studentId)

export async function getRewards(db: Db, studentId: string): Promise<RewardsView> {
  const [coins, owned] = await Promise.all([
    spendableCoins(db, studentId),
    unlockedKeys(db, studentId),
  ])
  return {
    coins,
    items: PAPER_THEMES.map((key) => ({
      key,
      name: key,
      kind: 'paper_theme' as const,
      price: THEME_PRICES[key],
      unlocked: isDefaultTheme(key) || owned.has(key),
      is_default: isDefaultTheme(key),
    })),
  }
}

/**
 * The theme a student may actually use: what she asked for if it is the default or she has
 * unlocked it, otherwise the default. Never throws -- a stale client must still get a paper.
 */
export async function resolveAllowedTheme(
  db: Db,
  studentId: string,
  requested: string | null | undefined,
): Promise<PaperTheme> {
  if (!isKnownTheme(requested) || isDefaultTheme(requested)) return DEFAULT_THEME
  const owned = await unlockedKeys(db, studentId)
  return owned.has(requested) ? requested : DEFAULT_THEME
}

export type UnlockResult =
  | { ok: true; already: boolean; coins: number }
  | { ok: false; reason: 'unknown_key' }
  | { ok: false; reason: 'default_theme' }
  | { ok: false; reason: 'not_enough_coins'; coins: number; price: number; missing: number }

/**
 * One transaction. The student row is locked (FOR UPDATE) first, so two clicks or two tabs for
 * the same student queue up behind each other: the second sees the first's row (already
 * unlocked, no charge) or the reduced balance (never overspends).
 */
export async function unlockItem(db: Db, studentId: string, key: string): Promise<UnlockResult> {
  if (!isKnownTheme(key)) return { ok: false, reason: 'unknown_key' }
  if (isDefaultTheme(key)) return { ok: false, reason: 'default_theme' }
  const price = THEME_PRICES[key]
  return db.transaction().execute(async (trx) => {
    await studentUnlocksRepository.lockStudent(trx, studentId)
    const owned = await unlockedKeys(trx, studentId)
    const coins = await spendableCoins(trx, studentId)
    if (owned.has(key)) return { ok: true, already: true, coins }
    if (coins < price) {
      return { ok: false, reason: 'not_enough_coins', coins, price, missing: price - coins }
    }
    await studentUnlocksRepository.insert(trx, {
      student_id: studentId,
      item_key: key,
      kind: 'paper_theme',
      price_coins: price,
    })
    return { ok: true, already: false, coins: coins - price }
  })
}
