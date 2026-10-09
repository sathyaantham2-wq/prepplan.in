/**
 * Writes the three DPS practice-paper blueprints (10, 15 and 30 questions) for one subject+class
 * into the blueprints table. The layout itself is data from src/lib/school-paper.ts
 * (practiceLayout); this script only inserts it.
 *
 *   node scripts/with-test-env.mjs npx tsx scripts/seed-school-half-yearly.ts --subject SST --class 7
 *
 * Idempotent: an existing blueprint of the same name for the subject is left alone. Refuses a
 * non-local database unless ALLOW_NON_LOCAL=yes, so it cannot touch production by accident.
 */
import { createDb } from '../src/db/connection'
import { blueprintsRepository } from '../src/db/repositories'
import { PRACTICE_COUNTS, practiceLayout } from '../src/lib/school-paper'

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`)
  return i >= 0 ? process.argv[i + 1] : undefined
}

async function main() {
  const host = new URL(process.env.DATABASE_URL ?? 'x://').hostname
  if (!['localhost', '127.0.0.1', '::1'].includes(host) && process.env.ALLOW_NON_LOCAL !== 'yes') {
    throw new Error(`Refusing to write to non-local database host "${host}"`)
  }
  const code = arg('subject')
  const klass = Number(arg('class'))
  if (!code || !klass) throw new Error('usage: --subject <code> --class <n>')

  const db = createDb()
  try {
    const subject = await db
      .selectFrom('subjects')
      .selectAll()
      .where('code', '=', code)
      .where('class', '=', klass)
      .executeTakeFirstOrThrow()
    const kind = code.startsWith('SST') ? 'social' : 'stem'
    const existing = await blueprintsRepository.listBySubject(db, subject.id)
    for (const count of PRACTICE_COUNTS) {
      const layout = practiceLayout(kind, count, subject.name)
      const name = `${layout.name} — Class ${klass}`
      if (existing.some((b) => b.name === name)) {
        console.log(`blueprint already present: ${name}`)
        continue
      }
      const created = await blueprintsRepository.insert(db, {
        subject_id: subject.id,
        board: subject.board,
        class: subject.class,
        name,
        total_marks: layout.total_marks,
        duration_min: layout.duration_min,
        sections: JSON.stringify(layout.sections),
        bloom_targets: JSON.stringify(layout.bloom_targets),
        config: JSON.stringify(layout.config),
      })
      console.log(`created blueprint ${created.id}: ${name} (${layout.total_marks} marks)`)
    }
  } finally {
    await db.destroy()
  }
}

main().catch((e) => { console.error(e); process.exit(1) })
