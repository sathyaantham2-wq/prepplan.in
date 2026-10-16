/**
 * Metadata half of the 2026-10-16 "do not name the source book" clean-up: concept text, scope records and the source
 * row of the civil-services (CIVILS) subject. Companion of scripts/apply-civil-debrand.ts (question text).
 *
 *   DATABASE_URL='postgres://...' npx tsx scripts/apply-civil-debrand-meta.ts <meta-migration.json>            # dry run
 *   DATABASE_URL='postgres://...' npx tsx scripts/apply-civil-debrand-meta.ts <meta-migration.json> --apply
 *
 * The migration file comes from scripts/civil-services/build-debrand-meta-migration.py (old pack text -> new pack text).
 * A database value is only replaced when it still names the book or says "the chapter" (so clean or
 * hand-edited rows are never overwritten) and the new text is clean. Nothing is deleted. Not routed through
 * with-test-env on purpose: run it only when you mean to write to the database in DATABASE_URL.
 */
import { readFileSync } from 'node:fs'
import { sql } from 'kysely'
import { createDb } from '../src/db/connection'

const NAMED = /laxmikanth|\bthe chapter\b|\bchapter['’]s\b|\bthe book\b/i

interface Meta {
  source: { old_publisher: string; new_publisher: string }
  concepts: Array<{ code: string; name?: string; description?: string; idea?: string; rule?: string; example?: string }>
  scope: Array<{ old: string; new: string }>
  tags: Array<{ old: string; new: string }>
}

async function main() {
  const path = process.argv[2]
  const apply = process.argv.includes('--apply')
  const meta = JSON.parse(readFileSync(path, 'utf8')) as Meta
  const db = createDb()
  const counts = { source: 0, concept_fields: 0, scope_item: 0, scope_page_ref: 0, tags: 0, skipped_dirty_new: 0 }
  try {
    const src = await db.selectFrom('sources').select('id').where('publisher', '=', meta.source.old_publisher).execute()
    counts.source = src.length
    if (apply && src.length) {
      await db.updateTable('sources').set({ publisher: meta.source.new_publisher }).where('publisher', '=', meta.source.old_publisher).execute()
    }

    for (const c of meta.concepts) {
      const rows = await db
        .selectFrom('concepts as c')
        .innerJoin('chapters as ch', 'ch.id', 'c.chapter_id')
        .innerJoin('subjects as s', 's.id', 'ch.subject_id')
        .select(['c.id', 'c.name', 'c.description', 'c.idea', 'c.rule', 'c.example'])
        .where('s.board', '=', 'CIVILS')
        .where('c.code', '=', c.code)
        .execute()
      for (const row of rows) {
        const patch: Record<string, string> = {}
        for (const f of ['name', 'description', 'idea', 'rule', 'example'] as const) {
          const next = c[f]
          if (next === undefined || next === row[f]) continue
          if (!NAMED.test(row[f] ?? '')) continue
          if (NAMED.test(next)) {
            counts.skipped_dirty_new++
            continue
          }
          patch[f] = next
        }
        if (Object.keys(patch).length) {
          counts.concept_fields += Object.keys(patch).length
          if (apply) await db.updateTable('concepts').set(patch).where('id', '=', row.id).execute()
        }
      }
    }

    for (const s of meta.scope) {
      if (NAMED.test(s.new)) {
        counts.skipped_dirty_new++
        continue
      }
      const a = await db.selectFrom('chapter_scope').select('id').where('item_text', '=', s.old).execute()
      counts.scope_item += a.length
      if (apply && a.length) await db.updateTable('chapter_scope').set({ item_text: s.new }).where('item_text', '=', s.old).execute()
      const b = await db.selectFrom('chapter_scope').select('id').where('page_ref', '=', s.old).execute()
      counts.scope_page_ref += b.length
      if (apply && b.length) await db.updateTable('chapter_scope').set({ page_ref: s.new }).where('page_ref', '=', s.old).execute()
    }

    for (const t of meta.tags) {
      // questions.tags is a text[]; swap one tag value for another on civil questions only
      const r = await sql<{ n: string }>`select count(*)::text as n from questions where board = 'CIVILS' and ${t.old} = any(tags)`.execute(db)
      counts.tags += Number(r.rows[0].n)
      if (apply) {
        await sql`update questions set tags = array_replace(tags, ${t.old}, ${t.new}) where board = 'CIVILS' and ${t.old} = any(tags)`.execute(db)
      }
    }
    console.log(apply ? 'APPLIED' : 'DRY RUN (add --apply to write)', JSON.stringify(counts))
  } finally {
    await db.destroy()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
