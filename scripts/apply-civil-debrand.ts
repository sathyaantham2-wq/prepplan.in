/**
 * Applies the 2026-10-16 "do not name the book" rewrite of civil-services questions to the database named by
 * DATABASE_URL, from a migration file produced by scripts/civil-services/build-debrand-migration.py.
 *
 *   DATABASE_URL='postgres://...' npx tsx scripts/apply-civil-debrand.ts <migration.json>            # dry run
 *   DATABASE_URL='postgres://...' npx tsx scripts/apply-civil-debrand.ts <migration.json> --apply
 *
 * Per entry (matched on source_ref (the pack's chapter source_code) + concept code + the OLD stem's text hash, approved questions only):
 *   kind 'edit'     the stem keeps its meaning and key: question text, text_hash, tags and the authored
 *                   explanation are updated in place (the explanation is rebuilt exactly as the loader does).
 *   kind 'replace'  the question could only be answered from the book itself: the old row is retired (status only,
 *                   never deleted). Its replacement arrives through the normal additive loader run afterwards.
 * Nothing is deleted. A dry run writes nothing. Not routed through with-test-env on purpose: run it only when you
 * mean to write to the database in DATABASE_URL.
 */
import { readFileSync } from 'node:fs'
import { createDb } from '../src/db/connection'
import { computeTextHash } from '../src/lib/duplicate-detection'

interface Entry {
  kind: 'edit' | 'replace'
  source_code: string
  concept_code: string
  old_q: string
  new_q?: string
  new_explanation?: string
  new_tags?: Array<string>
}

async function main() {
  const path = process.argv[2]
  const apply = process.argv.includes('--apply')
  const entries = JSON.parse(readFileSync(path, 'utf8')) as Array<Entry>
  const db = createDb()
  const counts = { edited: 0, retired: 0, missing: 0, clash: 0, explanation_rows: 0 }
  try {
    for (const e of entries) {
      const found = await db
        .selectFrom('questions as q')
        .innerJoin('concepts as c', 'c.id', 'q.concept_id')
        .select(['q.id', 'q.concept_id'])
        .where('q.source_ref', '=', e.source_code)
        .where('c.code', '=', e.concept_code)
        .where('q.status', '=', 'approved')
        .where('q.text_hash', '=', computeTextHash(e.old_q))
        .executeTakeFirst()
      if (!found) {
        counts.missing++
        continue
      }
      if (e.kind === 'replace') {
        counts.retired++
        if (apply) await db.updateTable('questions').set({ status: 'retired' }).where('id', '=', found.id).execute()
        continue
      }
      const newHash = computeTextHash(e.new_q ?? e.old_q)
      if (newHash !== computeTextHash(e.old_q)) {
        const clash = await db
          .selectFrom('questions')
          .select('id')
          .where('concept_id', '=', found.concept_id)
          .where('text_hash', '=', newHash)
          .where('id', '!=', found.id)
          .executeTakeFirst()
        if (clash) {
          counts.clash++
          console.warn(`text clash, skipped: ${e.concept_code} ${e.new_q?.slice(0, 70)}`)
          continue
        }
      }
      counts.edited++
      if (apply) {
        await db
          .updateTable('questions')
          .set({ text: e.new_q ?? e.old_q, text_hash: newHash, ...(e.new_tags ? { tags: e.new_tags } : {}) })
          .where('id', '=', found.id)
          .execute()
        if (e.new_explanation) {
          const r = await db
            .updateTable('question_explanations')
            .set({ explanation: e.new_explanation })
            .where('question_id', '=', found.id)
            .where('source', '=', 'authored')
            .executeTakeFirst()
          counts.explanation_rows += Number(r.numUpdatedRows)
        }
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
