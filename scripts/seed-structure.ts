/**
 * Creates a subject / source / chapter / scope / concepts skeleton (no questions) from a
 * content/structure/*.json file, so a DPS pack has concepts to attach to in a database that does
 * not hold the chapter yet. Used on the LOCAL test database for chapters whose full authored
 * file is not in this repo (Class 7 Maths): the file is a read-only copy of production's rows.
 * Refuses a non-local database. Idempotent.
 *
 *   node scripts/with-test-env.mjs npx tsx scripts/seed-structure.ts content/structure/class7-maths-p1ch01.json
 */
import { readFileSync } from 'node:fs'
import { createDb } from '../src/db/connection'

async function main() {
  const host = new URL(process.env.DATABASE_URL ?? 'x://').hostname
  if (!['localhost', '127.0.0.1', '::1'].includes(host)) throw new Error(`Refusing non-local database host "${host}"`)
  const f = JSON.parse(readFileSync(process.argv[2], 'utf8'))
  const db = createDb()
  try {
    let subject = await db.selectFrom('subjects').selectAll().where('code', '=', f.subject.code).where('class', '=', f.subject.class).executeTakeFirst()
    if (!subject) subject = await db.insertInto('subjects').values(f.subject).returningAll().executeTakeFirstOrThrow()
    let source = await db.selectFrom('sources').selectAll().where('subject_id', '=', subject.id).where('title', '=', f.source.title).executeTakeFirst()
    if (!source) source = await db.insertInto('sources').values({ ...f.source, subject_id: subject.id }).returningAll().executeTakeFirstOrThrow()
    const { source_code: _sc, ...chapterFields } = f.chapter
    let chapter = await db.selectFrom('chapters').selectAll().where('subject_id', '=', subject.id).where('part', '=', f.chapter.part).where('chapter_no', '=', f.chapter.chapter_no).executeTakeFirst()
    if (!chapter) {
      chapter = await db.insertInto('chapters').values({ ...chapterFields, subject_id: subject.id, source_id: source.id }).returningAll().executeTakeFirstOrThrow()
      for (const [kind, item_text, page_ref] of f.scope) {
        await db.insertInto('chapter_scope').values({ chapter_id: chapter.id, kind, item_text, page_ref }).execute()
      }
    }
    for (const c of f.concepts) {
      const have = await db.selectFrom('concepts').select('id').where('chapter_id', '=', chapter.id).where('code', '=', c.code).executeTakeFirst()
      if (!have) await db.insertInto('concepts').values({ ...c, chapter_id: chapter.id, board: subject.board, class: subject.class }).execute()
    }
    console.log(`structure ready: ${f.subject.code} class ${f.subject.class} ${f.chapter.part}${f.chapter.chapter_no}, ${f.concepts.length} concepts`)
  } finally {
    await db.destroy()
  }
}
void main()
