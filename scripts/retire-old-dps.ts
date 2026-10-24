/**
 * Retires (status='retired', never deletes) the OLD approved questions of every concept covered by a
 * DPS pack, once that concept already holds its full set of approved DPS questions in the database.
 *
 *   DATABASE_URL='postgres://...' npx tsx scripts/retire-old-dps.ts class7 class7sc class7s          # dry run
 *   DATABASE_URL='postgres://...' npx tsx scripts/retire-old-dps.ts class7 class7sc class7s --apply  # does it
 *
 * Arguments are folder names under content/authoring/dps/. Old = an approved question on the concept
 * whose tags do not include 'dps'. A concept is skipped (and its old questions kept) when it holds
 * fewer approved DPS questions than its pack has, so a concept is never left thin. Run the load
 * scripts first. Like them, this does not go through with-test-env.mjs: it writes to DATABASE_URL.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createDb } from '../src/db/connection'
import type { PackFile } from './load-dps-pack'

async function main() {
  const apply = process.argv.includes('--apply')
  const sets = process.argv.slice(2).filter((a) => !a.startsWith('--'))
  if (sets.length === 0) {
    console.error('usage: retire-old-dps.ts <set>... [--apply]   e.g. class7 class7sc class7s')
    process.exit(2)
  }
  const db = createDb()
  const isDps = (t: unknown) => Array.isArray(t) && t.includes('dps')
  let retired = 0
  let kept = 0
  let thin = 0
  const retiredIds: Array<string> = []
  try {
    for (const set of sets) {
      const dir = `content/authoring/dps/${set}`
      for (const name of readdirSync(dir).filter((f) => f.endsWith('.json')).sort()) {
        const file = JSON.parse(readFileSync(`${dir}/${name}`, 'utf8')) as PackFile
        const { subject: sub, chapter: ch } = file
        const subject = await db.selectFrom('subjects').select('id').where('code', '=', sub.code).where('class', '=', sub.class).executeTakeFirstOrThrow()
        const chapter = await db.selectFrom('chapters').select('id').where('subject_id', '=', subject.id).where('part', '=', ch.part).where('chapter_no', '=', ch.chapter_no).executeTakeFirstOrThrow()
        for (const c of file.concepts) {
          const concept = await db.selectFrom('concepts').select('id').where('chapter_id', '=', chapter.id).where('code', '=', c.code).executeTakeFirstOrThrow()
          const rows = await db.selectFrom('questions').select(['id', 'tags']).where('concept_id', '=', concept.id).where('status', '=', 'approved').execute()
          const dps = rows.filter((r) => isDps(r.tags))
          const old = rows.filter((r) => !isDps(r.tags))
          if (dps.length < c.questions.length) {
            console.log(`  ${set}/${name} ${c.code}: ${dps.length}/${c.questions.length} DPS questions loaded, keeping ${old.length} old`)
            thin++
            kept += old.length
            continue
          }
          retired += old.length
          if (apply && old.length > 0) {
            await db.updateTable('questions').set({ status: 'retired' }).where('id', 'in', old.map((r) => r.id)).execute()
            retiredIds.push(...old.map((r) => r.id))
          }
        }
      }
    }
    if (apply && retiredIds.length > 0) {
      // timestamped and set-named so a later run never overwrites an earlier undo list
      const out = `content/authoring/dps/_undo/retired-dps-ids-${new Date().toISOString().replace(/[:.]/g, '-')}-${sets.join('-')}.json`
      writeFileSync(out, JSON.stringify(retiredIds))
      console.log(`Saved the ${retiredIds.length} retired question ids to ${out} (keep it: it is the undo list)`)
    }
    console.log(
      `${apply ? 'RETIRED' : 'DRY RUN: would retire'} ${retired} old questions (status only; nothing deleted). ` +
        `${thin} concept(s) skipped because their DPS set is not fully loaded (${kept} old questions kept).` +
        (apply ? '' : ' Add --apply to do it.'),
    )
  } finally {
    await db.destroy()
  }
}

void main()
