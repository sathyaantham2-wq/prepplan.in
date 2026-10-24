// Pure review schedule for the Fix-it Deck. A correct answer climbs one stage (back in 2, 7, then
// 21 days); a correct answer at the last stage finishes the card. A wrong answer starts the card
// over at stage 0 and brings it back tomorrow. Dates are 'YYYY-MM-DD' strings in India time.

export const MAX_STAGE = 3
/** Days until the card returns after a correct answer AT stage 0, 1, 2. */
export const CORRECT_GAP_DAYS = [2, 7, 21] as const
export const DAILY_CARD_LIMIT = 3

export type FixitStatus = 'active' | 'mastered'

export interface Schedule {
  stage: number
  due_on: string
  status: FixitStatus
}

export function addDays(day: string, days: number): string {
  const [y, m, d] = day.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10)
}

export function nextSchedule(stage: number, correct: boolean, today: string): Schedule {
  if (!correct) return { stage: 0, due_on: addDays(today, 1), status: 'active' }
  if (stage >= MAX_STAGE) return { stage: MAX_STAGE, due_on: today, status: 'mastered' }
  return { stage: stage + 1, due_on: addDays(today, CORRECT_GAP_DAYS[stage]), status: 'active' }
}
