import { formatDate } from '../../dates'
// India time, for quiet hours and "4 pm" style schedules. India has no daylight saving, so a fixed +5:30 is exact.
const IST_MS = 5.5 * 3_600_000

export interface IstParts {
  /** YYYY-MM-DD in India */
  date: string
  hour: number
  minute: number
  /** 0 = Sunday */
  dow: number
}

export function istParts(now: Date): IstParts {
  const d = new Date(now.getTime() + IST_MS)
  return {
    date: d.toISOString().slice(0, 10),
    hour: d.getUTCHours(),
    minute: d.getUTCMinutes(),
    dow: d.getUTCDay(),
  }
}

/** No parent message from 9 pm to 8 am India time. */
export function inQuietHours(now: Date): boolean {
  const h = istParts(now).hour
  return h >= 21 || h < 8
}

/** The next 8:00 am India time at or after `now`. */
export function nextQuietEnd(now: Date): Date {
  const p = istParts(now)
  const [y, m, d] = p.date.split('-').map(Number)
  let t = Date.UTC(y, m - 1, d, 8, 0, 0) - IST_MS
  if (t < now.getTime()) t += 86_400_000
  return new Date(t)
}

/** "03/11/2026" in India. */
export function istDayLabel(d: Date): string {
  return formatDate(d)
}

/** The start of this week in India: Monday 00:00. */
export function weekStart(now: Date): Date {
  const p = istParts(now)
  const [y, m, d] = p.date.split('-').map(Number)
  const daysSinceMonday = (p.dow + 6) % 7
  return new Date(Date.UTC(y, m - 1, d - daysSinceMonday, 0, 0, 0) - IST_MS)
}

/** The next Monday 8:00 am in India (a message held by the weekly limit goes then). */
export function nextMondayMorning(now: Date): Date {
  const start = weekStart(now)
  return new Date(start.getTime() + 7 * 86_400_000 + 8 * 3_600_000)
}
