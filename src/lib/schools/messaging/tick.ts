import type { Db } from '../../../db/connection'
import { dispatchDue } from './dispatch'
import type { DispatchDeps, DispatchResult } from './dispatch'
import { scheduleDue } from './events'
import { purgeMessageLogs } from './retention'
import { istParts } from './ist'

// One run of the clock (every 30 minutes from /api/cron/school-messages): create what is due, send what is due, and
// once a day (the first run after 2 am India time) apply each school's log retention.
export async function runMessagingTick(
  db: Db,
  deps: DispatchDeps = {},
): Promise<{ events: Record<string, number>; sent: DispatchResult; purged: number | null }> {
  const now = deps.now ?? new Date()
  const events = await scheduleDue(db, now)
  const sent = await dispatchDue(db, { ...deps, now })
  const t = istParts(now)
  const purged = t.hour === 2 && t.minute < 30 ? await purgeMessageLogs(db, now) : null
  return { events, sent, purged }
}
