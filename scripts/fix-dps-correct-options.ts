/**
 * Repairs `question_options.is_correct` for DPS questions already loaded, so the correct option is
 * the pack's o[0]. Needed because 27 items were written with the key in another position and the
 * loader always marks o[0] correct (found 2026-10-22; the packs are fixed and --check now rejects it).
 *
 *   DATABASE_URL='postgres://...' npx tsx scripts/fix-dps-correct-options.ts class7 class7sc class7s class9 class9sc class9s          # dry run
 *   DATABASE_URL='postgres://...' npx tsx scripts/fix-dps-correct-options.ts class7 class7sc class7s class9 class9sc class9s --apply
 *
 * Only option flags change; no question, option text or evaluation is touched or deleted.
 */
import { readdirSync, readFileSync } from 'node:fs'
import { createDb } from '../src/db/connection'
import { computeTextHash } from '../src/lib/duplicate-detection'
import type { PackFile } from './load-dps-pack'

const norm = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase()

async function main() {
  const apply = process.argv.includes('--apply')
  const sets = process.argv.slice(2).filter((a) => !a.startsWith('--'))
  const db = createDb()
  let checked = 0
  let notLoaded = 0
  const wrong: Array<string> = []
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
          for (const q of c.questions) {
            if (!q.o) continue
            const row = await db.selectFrom('questions').select('id').where('concept_id', '=', concept.id).where('text_hash', '=', computeTextHash(q.q)).executeTakeFirst()
            if (!row) {
              notLoaded++
              continue
            }
            checked++
            const opts = await db.selectFrom('question_options').select(['id', 'text', 'is_correct']).where('question_id', '=', row.id).execute()
            const want = opts.filter((o) => norm(o.text) === norm(q.o![0]))
            if (want.length !== 1) {
              wrong.push(`${set}/${name} ${c.code}: cannot match the correct option text (${want.length} matches) - left alone`)
              continue
            }
            const bad = opts.filter((o) => o.is_correct !== (o.id === want[0].id))
            if (bad.length === 0) continue
            wrong.push(`${set}/${name} ${c.code} question ${row.id}`)
            if (apply) {
              await db.transaction().execute(async (trx) => {
                await trx.updateTable('question_options').set({ is_correct: false }).where('question_id', '=', row.id).execute()
                await trx.updateTable('question_options').set({ is_correct: true }).where('id', '=', want[0].id).execute()
              })
            }
          }
        }
      }
    }
    for (const w of wrong) console.log('  ' + w)
    console.log(`${checked} loaded option questions checked, ${notLoaded} not loaded yet; ${wrong.length} ${apply ? 'repaired' : 'need repair (DRY RUN, add --apply)'}`)
  } finally {
    await db.destroy()
  }
}

void main()
