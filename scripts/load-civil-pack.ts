/**
 * Loads a "civil pack" (UPSC Prelims-style Indian Polity MCQs, F132): content/authoring/civil/polity/packs/*.json.
 *
 *   node scripts/with-test-env.mjs npx tsx scripts/load-civil-pack.ts content/authoring/civil/polity/packs/lk05.json [--check]
 *   ... --retire-old     after loading, retire (status='retired', never delete) the OLD approved questions of every
 *                        concept in the pack that are not part of a civil pack, only if the concept now holds
 *                        at least 20 approved civil-pack questions. Without --apply it only prints what it would do.
 *   ... --apply          required with --retire-old to actually retire.
 *
 * Rules (CLAUDE.md invariants): additive and idempotent (a question whose text is already on the concept is
 * skipped), never deletes, options are SHUFFLED at load (a pack stores the correct option first), explanations
 * go to question_explanations (source 'authored'). A concept that does not exist is created only when the pack
 * carries the concept's metadata (new chapter); an upgrade pack for an existing concept never creates one.
 * --check validates the pack and writes nothing (needs no database).
 */
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { createDb } from '../src/db/connection'
import { computeTextHash } from '../src/lib/duplicate-detection'
import { createQuestion } from '../src/lib/questions'

type Bloom = 'Remember' | 'Understand' | 'Apply' | 'Analyse' | 'Evaluate' | 'Create'
type Tier = 'Easy' | 'Hard' | 'Hardest'
type QType = 'mcq' | 'assertion_reason' | 'multi_statement' | 'match'

export interface CivilQuestion {
  /** direct | which | howmany | stmt12 | match | case */
  f: string
  t: QType
  m: number
  q: string
  /** the correct option's text (never a letter) */
  a: string
  /** four options, the correct one first; shuffled at load */
  o: Array<string>
  /** explanation */
  e: string
  /** one reason per wrong option, in the order of o[1..3] */
  w: Array<string>
  tr?: Array<string>
  /** recall | two_step | elimination | application */
  sk?: string
  pg?: Array<number>
  id?: string
}

export interface CivilPack {
  kind: string
  subject: { code: string; name?: string; board: string; class: number }
  source?: { publisher: string; title: string; edition: string; year: number }
  chapter: { part: string; chapter_no: number; name?: string; blurb?: string; source_code: string; order_index?: number }
  scope_in?: Array<{ item: string; pages: string }>
  scope_out?: Array<{ item: string; reason: string }>
  concepts: Array<{
    code: string
    name?: string
    description?: string
    idea?: string
    rule?: string
    example?: string
    difficulty_base?: Tier
    questions: Array<CivilQuestion>
  }>
}

const TYPES = new Set(['mcq', 'assertion_reason', 'multi_statement', 'match'])

/** UPSC items are application or analysis; there are no easy items. Mapped from the author's skill tag. */
export function levelFor(q: CivilQuestion): { bloom: Bloom; difficulty: Tier } {
  if (q.sk === 'recall') return { bloom: 'Understand', difficulty: 'Hard' }
  if (q.sk === 'elimination') return { bloom: 'Analyse', difficulty: 'Hard' }
  if (q.f === 'stmt12') return { bloom: 'Analyse', difficulty: 'Hardest' }
  return { bloom: 'Apply', difficulty: 'Hard' }
}

export function validateCivilPack(file: CivilPack): Array<string> {
  const p: Array<string> = []
  if (file.kind !== 'civil_pack') p.push('kind must be "civil_pack"')
  if (file.subject?.board !== 'CIVILS' || file.subject?.class !== 0) p.push('subject must be board CIVILS, class 0')
  if (!file.chapter?.source_code) p.push('chapter.source_code missing')
  if (!file.concepts?.length) p.push('no concepts')
  const seen = new Set<string>()
  for (const c of file.concepts ?? []) {
    if (!/^(LK|CVP|POL|AKS)-\d+\.\d+$/.test(c.code)) p.push(`${c.code}: concept code must look like LK-<chapter>.<n> (or CVP-/POL- for the converted NCERT-style chapters, AKS- for the study-notes chapters)`)
    if (c.questions.length < 20 || c.questions.length > 22) p.push(`${c.code}: ${c.questions.length} questions, wants 20-22`)
    for (const [i, q] of c.questions.entries()) {
      const w = `${c.code} #${i + 1}`
      if (!TYPES.has(q.t)) p.push(`${w}: type ${q.t}`)
      if (q.m !== 1) p.push(`${w}: 1 mark`)
      if (!Array.isArray(q.o) || q.o.length !== 4 || new Set(q.o.map((x) => x.trim())).size !== 4) p.push(`${w}: needs 4 distinct options`)
      else if (q.o[0].trim() !== q.a.trim()) p.push(`${w}: the correct option must be o[0] and equal a`)
      if (!q.e) p.push(`${w}: explanation missing`)
      if (!Array.isArray(q.w) || q.w.length !== 3) p.push(`${w}: w needs 3 reasons`)
      if (/\b(option|choice)s?\s*\(?[a-d1-4]\)?(?![a-z])/i.test(q.a)) p.push(`${w}: answer names a letter (options are shuffled)`)
      if (seen.has(q.q)) p.push(`${w}: duplicate text`)
      seen.add(q.q)
    }
  }
  return p
}

function shuffled<T>(items: Array<T>, seed: string): Array<T> {
  const keyed = items.map((item, i) => ({ item, k: createHash('sha256').update(`${seed}|${i}`).digest('hex') }))
  return keyed.sort((x, y) => (x.k < y.k ? -1 : 1)).map((x) => x.item)
}

/** The student-facing explanation: why the key is right, then why each wrong option fails. */
export function explanationText(q: CivilQuestion): string {
  const wrong = q.o.slice(1).map((o, i) => `- ${o}: ${q.w[i]}`)
  return [q.e.trim(), '', 'Why the other options fail:', ...wrong].join('\n')
}

async function main() {
  const path = process.argv[2]
  const check = process.argv.includes('--check')
  const retireOld = process.argv.includes('--retire-old')
  const apply = process.argv.includes('--apply')
  const file = JSON.parse(readFileSync(path, 'utf8')) as CivilPack
  const problems = validateCivilPack(file)
  if (problems.length > 0) {
    console.error(problems.join('\n'))
    process.exit(1)
  }
  const total = file.concepts.reduce((n, c) => n + c.questions.length, 0)
  console.log(`${path}: ${file.concepts.length} concepts, ${total} questions, valid`)
  if (check) return

  const db = createDb()
  try {
    const { subject: sub, source: src, chapter: ch } = file
    const subject = await db.selectFrom('subjects').selectAll().where('code', '=', sub.code).executeTakeFirst()
    if (!subject) throw new Error(`subject ${sub.code} does not exist; run the original chapter load first`)

    let chapter = await db
      .selectFrom('chapters')
      .selectAll()
      .where('subject_id', '=', subject.id)
      .where('part', '=', ch.part)
      .where('chapter_no', '=', ch.chapter_no)
      .executeTakeFirst()
    if (!chapter) {
      // A new chapter: the pack must carry its scope record (invariant 5).
      if (!src || !ch.name || !file.scope_in?.length) throw new Error(`chapter ${ch.part}${ch.chapter_no} does not exist and the pack has no chapter metadata`)
      let source = await db.selectFrom('sources').selectAll().where('subject_id', '=', subject.id).where('title', '=', src.title).executeTakeFirst()
      if (!source) {
        source = await db
          .insertInto('sources')
          .values({ subject_id: subject.id, publisher: src.publisher, title: src.title, edition: src.edition, year: src.year })
          .returningAll()
          .executeTakeFirstOrThrow()
      }
      chapter = await db
        .insertInto('chapters')
        .values({
          subject_id: subject.id,
          source_id: source.id,
          part: ch.part,
          chapter_no: ch.chapter_no,
          name: ch.name,
          blurb: ch.blurb ?? '',
          order_index: ch.order_index ?? 100 + ch.chapter_no,
        })
        .returningAll()
        .executeTakeFirstOrThrow()
      await db
        .insertInto('chapter_scope')
        .values([
          ...file.scope_in.map((s) => ({ chapter_id: chapter!.id, kind: 'IN' as const, item_text: s.item, page_ref: s.pages })),
          ...(file.scope_out ?? []).map((s) => ({ chapter_id: chapter!.id, kind: 'OUT' as const, item_text: s.item, page_ref: s.reason })),
        ])
        .execute()
      console.log(`created chapter ${ch.part}${ch.chapter_no} ${ch.name}`)
    }

    let added = 0
    let skipped = 0
    for (const c of file.concepts) {
      let concept = await db.selectFrom('concepts').selectAll().where('chapter_id', '=', chapter.id).where('code', '=', c.code).executeTakeFirst()
      if (!concept) {
        if (!c.name || !c.description || !c.idea || !c.rule) throw new Error(`concept ${c.code} does not exist and the pack has no concept metadata for it`)
        concept = await db
          .insertInto('concepts')
          .values({
            chapter_id: chapter.id,
            board: sub.board,
            class: sub.class,
            code: c.code,
            name: c.name,
            description: c.description,
            idea: c.idea,
            rule: c.rule,
            example: c.example ?? '',
            difficulty_base: c.difficulty_base ?? 'Hard',
            target_question_count: 20,
          })
          .returningAll()
          .executeTakeFirstOrThrow()
      }
      for (const q of c.questions) {
        const exists = await db.selectFrom('questions').select('id').where('concept_id', '=', concept.id).where('text_hash', '=', computeTextHash(q.q)).executeTakeFirst()
        if (exists) {
          skipped++
          continue
        }
        const { bloom, difficulty } = levelFor(q)
        const options = shuffled(q.o.map((text, i) => ({ text, is_correct: i === 0 })), q.q).map((o, i) => ({
          label: 'ABCD'[i],
          text: o.text,
          is_correct: o.is_correct,
          order_index: i + 1,
        }))
        const created = await createQuestion(db, {
          concept_id: concept.id,
          board: sub.board,
          class: sub.class,
          bloom,
          difficulty,
          marks: q.m,
          type: q.t,
          text: q.q,
          answer: q.a,
          options,
          tags: ['civil', q.f, ...(q.tr ?? []).map((t) => t.replace(/\W+/g, '_'))],
          created_by: `claude-civil-pack-${ch.source_code}`,
          origin: 'ai_generated',
          source_ref: ch.source_code,
        })
        await db
          .insertInto('question_explanations')
          .values({ question_id: created.id, explanation: explanationText(q), source: 'authored', model: null })
          .execute()
        added++
      }
    }
    console.log(`civil pack ${ch.part}${ch.chapter_no} (${ch.source_code}): ${added} questions added, ${skipped} already present`)

    if (retireOld) {
      // Old = approved questions on these concepts that are not civil-pack questions. Retire only a concept that
      // now holds 20 approved civil-pack questions, so a concept is never left thin.
      let wouldRetire = 0
      for (const c of file.concepts) {
        const concept = await db.selectFrom('concepts').select('id').where('chapter_id', '=', chapter.id).where('code', '=', c.code).executeTakeFirstOrThrow()
        const rows = await db.selectFrom('questions').select(['id', 'tags']).where('concept_id', '=', concept.id).where('status', '=', 'approved').execute()
        const isCivil = (t: unknown) => Array.isArray(t) && t.includes('civil')
        const civil = rows.filter((r) => isCivil(r.tags))
        const old = rows.filter((r) => !isCivil(r.tags))
        if (civil.length < 20) {
          console.log(`  ${c.code}: only ${civil.length} civil questions, keeping ${old.length} old ones`)
          continue
        }
        wouldRetire += old.length
        if (apply && old.length > 0) {
          await db.updateTable('questions').set({ status: 'retired' }).where('id', 'in', old.map((r) => r.id)).execute()
        }
      }
      console.log(apply ? `retired ${wouldRetire} old questions (status only; nothing deleted)` : `DRY RUN: would retire ${wouldRetire} old questions; add --apply to do it`)
    }
  } finally {
    await db.destroy()
  }
}

if (process.argv[1]?.includes('load-civil-pack')) void main()
