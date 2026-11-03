/**
 * Dates as Indian users read them (owner direction 2026-11-03): dd/mm/yyyy, in India time. Every date shown on a
 * screen, in a PDF or in a message goes through these; internal keys (yyyy-mm-dd) stay as they are.
 */
const TZ = 'Asia/Kolkata'
const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/

type DateLike = Date | string | number | null | undefined

function toDate(v: Exclude<DateLike, null | undefined>): Date {
  return v instanceof Date ? v : new Date(v)
}

/** 03/11/2026. A plain "2026-11-03" is a calendar date and is shown as it is, never shifted by a time zone. */
export function formatDate(v: DateLike, fallback = '–'): string {
  if (v === null || v === undefined || v === '') return fallback
  if (typeof v === 'string') {
    const m = DATE_ONLY.exec(v)
    if (m) return `${m[3]}/${m[2]}/${m[1]}`
  }
  const d = toDate(v)
  if (Number.isNaN(d.getTime())) return fallback
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: TZ }).format(d)
}

/** 03/11/2026, 4:05 pm (India time). */
export function formatDateTime(v: DateLike, fallback = '–'): string {
  if (v === null || v === undefined || v === '') return fallback
  const d = toDate(v)
  if (Number.isNaN(d.getTime())) return fallback
  const time = new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: TZ }).format(d)
  return `${formatDate(d)}, ${time.toLowerCase()}`
}
