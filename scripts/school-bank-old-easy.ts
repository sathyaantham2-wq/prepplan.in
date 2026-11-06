/**
 * Brings the old Easy questions back FOR SCHOOLS ONLY (owner decision 2026-11-04, PrepPlan for Schools, no F-number yet).
 * The DPS rewrite retired the old Easy/Hard/Hardest grid on 2026-10-22/23; schools then had almost no Easy questions.
 * This moves the old EASY ones from 'retired' to 'school_bank' (migration 0107): school paper builders may use them,
 * PrepPlan's own students never do (every student pool takes status 'approved' only). Nothing is deleted.
 *
 *   DATABASE_URL='postgres://...' npx tsx scripts/school-bank-old-easy.ts 7          # dry run: counts only
 *   DATABASE_URL='postgres://...' npx tsx scripts/school-bank-old-easy.ts 7 --apply  # does it, writes an undo list
 *
 * Only questions in the DPS retire list (content/authoring/dps/_undo/retired-dps-ids-2026-10-23-class7-9-REBUILT-superset.json)
 * are candidates, and a candidate is skipped when a student ever reported it (it may have been retired for a defect)
 * or when an active question on the same concept has the same text. Undo: set the ids in the written list back to
 * 'retired'.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { createDb } from '../src/db/connection'

const UNDO_SOURCE = 'content/authoring/dps/_undo/retired-dps-ids-2026-10-23-class7-9-REBUILT-superset.json'

async function main() {
  const apply = process.argv.includes('--apply')
  const cls = Number(process.argv.slice(2).find((a) => !a.startsWith('--')))
  if (![7, 9].includes(cls)) {
    console.error('usage: school-bank-old-easy.ts <7|9> [--apply]')
    process.exit(2)
  }
  const retiredByDps = JSON.parse(readFileSync(UNDO_SOURCE, 'utf8')) as Array<string>
  const db = createDb()
  try {
    const rows = await db
      .selectFrom('questions as q')
      .innerJoin('concepts as c', 'c.id', 'q.concept_id')
      .innerJoin('chapters as ch', 'ch.id', 'c.chapter_id')
      .innerJoin('subjects as s', 's.id', 'ch.subject_id')
      .select(['q.id', 'q.concept_id', 'q.text_hash', 's.code as subject'])
      .where('q.status', '=', 'retired')
      .where('q.difficulty', '=', 'Easy')
      .where('s.class', '=', cls)
      .where('s.board', '=', 'CBSE')
      .where('q.id', 'in', retiredByDps)
      .where(({ not, exists, selectFrom }) => not(exists(selectFrom('question_reports as r').select('r.id').whereRef('r.question_id', '=', 'q.id'))))
      .where(({ not, exists, selectFrom }) =>
        not(
          exists(
            selectFrom('questions as other')
              .select('other.id')
              .whereRef('other.concept_id', '=', 'q.concept_id')
              .whereRef('other.text_hash', '=', 'q.text_hash')
              .where('other.status', 'in', ['approved', 'school_bank']),
          ),
        ),
      )
      .execute()
    const bySubject = new Map<string, number>()
    for (const r of rows) bySubject.set(r.subject, (bySubject.get(r.subject) ?? 0) + 1)
    console.log(`Class ${cls}: ${rows.length} old Easy questions can go to the schools-only bank`, Object.fromEntries(bySubject))
    if (!apply) {
      console.log('dry run: nothing changed (add --apply)')
      return
    }
    const ids = rows.map((r) => r.id)
    const undo = `content/authoring/schools/_undo/school-bank-old-easy-class${cls}-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
    writeFileSync(undo, JSON.stringify(ids, null, 0))
    let moved = 0
    for (let i = 0; i < ids.length; i += 500) {
      const r = await db
        .updateTable('questions')
        .set({ status: 'school_bank' })
        .where('id', 'in', ids.slice(i, i + 500))
        .where('status', '=', 'retired')
        .executeTakeFirst()
      moved += Number(r.numUpdatedRows)
    }
    console.log(`${moved} questions moved to the schools-only bank; undo list: ${undo}`)
  } finally {
    await db.destroy()
  }
}

void main()
