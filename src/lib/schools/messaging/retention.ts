import type { Db } from '../../../db/connection'

// Retention (plan section 5): a message log is kept for the school's own period (default one year). After that the
// template variables are removed and only counts stay (per month, template and final status). Nothing is deleted:
// the row, its status history and its timing remain, so the audit trail still shows that a message existed.
export async function purgeMessageLogs(db: Db, now = new Date()): Promise<number> {
  let purged = 0
  const schools = await db.selectFrom('schools').select(['id', 'message_log_days']).execute()
  for (const s of schools) {
    const cutoff = new Date(now.getTime() - s.message_log_days * 86_400_000)
    await db.transaction().execute(async (trx) => {
      const old = await trx
        .selectFrom('school_messages')
        .select(['id', 'template', 'status', 'created_at'])
        .where('school_id', '=', s.id)
        .where('created_at', '<', cutoff)
        .where('variables_purged_at', 'is', null)
        .forUpdate()
        .execute()
      if (old.length === 0) return
      const tally = new Map<string, { month: string; template: string; status: string; n: number }>()
      for (const m of old) {
        const month = `${m.created_at.toISOString().slice(0, 7)}-01`
        const key = `${month}|${m.template}|${m.status}`
        const t = tally.get(key) ?? { month, template: m.template, status: m.status, n: 0 }
        t.n += 1
        tally.set(key, t)
      }
      for (const t of tally.values())
        await trx
          .insertInto('school_message_counts')
          .values({ school_id: s.id, month: t.month as never, template: t.template, status: t.status, count: t.n })
          .onConflict((oc) => oc.columns(['school_id', 'month', 'template', 'status']).doUpdateSet((eb) => ({ count: eb('school_message_counts.count', '+', eb.ref('excluded.count')) })))
          .execute()
      await trx
        .updateTable('school_messages')
        .set({ variables: null, variables_purged_at: now })
        .where('school_id', '=', s.id)
        .where('id', 'in', old.map((m) => m.id))
        .execute()
      purged += old.length
    })
  }
  return purged
}
