/**
 * Loads a "DPS bank" file: school-exam-standard questions (docs/QUESTION_STANDARD.md) for
 * concepts that ALREADY exist. It never creates a subject, chapter or concept, never changes an
 * existing question and never deletes anything; a question whose text is already on the concept
 * is skipped, so a re-run adds 0.
 *
 *   node scripts/with-test-env.mjs npx tsx scripts/load-dps-pack.ts content/authoring/dps/class7/ch01.json [--check]
 *
 * --check validates the pack and writes nothing (it needs no database).
 * A pack is separate from the 20-per-concept Bloom x difficulty grid: it holds the item types the
 * school papers use and the grid lacks (case studies, 5-mark answers, claim-checks, match, ...).
 */
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { createDb } from '../src/db/connection'
import { computeTextHash } from '../src/lib/duplicate-detection'
import { createQuestion } from '../src/lib/questions'

type Bloom = 'Remember' | 'Understand' | 'Apply' | 'Analyse' | 'Evaluate' | 'Create'
type Tier = 'Easy' | 'Hard' | 'Hardest'
type QType = 'mcq' | 'short_answer' | 'long_answer' | 'fill_blank' | 'assertion_reason' | 'multi_statement' | 'match'

export interface PackQuestion {
  b: Bloom
  d: Tier
  t: QType
  m: number
  q: string
  a: string
  /** option types: 4 options, the correct one first */
  o?: Array<string>
  /** written questions: [what earns the mark, marks]; a case study has one step per part */
  s?: Array<[string, number]>
  rev?: boolean
  /** case_study, claim_check, show_impossible, reverse, scenario, match, map, figure, construction */
  tags?: Array<string>
}

export interface PackFile {
  kind: 'dps_pack'
  subject: { code: string; class: number; board: string }
  chapter: { part: string; chapter_no: number; name: string }
  source_code: string
  concepts: Array<{ code: string; questions: Array<PackQuestion> }>
}

const OPTION_TYPES: Array<QType> = ['mcq', 'assertion_reason', 'multi_statement', 'match']
const TAGS = ['case_study', 'claim_check', 'show_impossible', 'reverse', 'scenario', 'match', 'true_false', 'map', 'figure', 'construction']
const GENERIC_STEP = /^(step \d+|solve( the problem)?|answer|write the answer|final answer)$/i

/**
 * What every concept must hold in the DPS bank (the question bank is being rewritten to this
 * standard: 20 or so per concept in the proportions of a DPS revision paper, about 40% objective,
 * 25% two-mark, 15% three-mark, 10% five-mark, 10% case study). Counts are minimums per concept;
 * a chapter must also hold a few match-the-columns items.
 */
export const PACK_MINIMUMS = {
  objective: 8, // 1-mark items of every kind below
  scenario_mcq: 3, // application-level multiple choice; there are no plain recall items any more (owner decision 2026-10-08)
  multi_statement: 1,
  assertion_reason: 1,
  short2: 5,
  short2_multipart: 2, // (a) and (b)
  three_mark: 3,
  reasoning3: 1, // claim_check / show_impossible / reverse
  long5: 2,
  case_study: 2, // 4 marks, 3-4 parts that get harder, last part a decision or justification
}
export const CONCEPT_TOTAL = { min: 20, max: 24 }
export const chapterMatchMinimum = (concepts: number) => Math.max(2, Math.ceil(concepts / 2))
/** Fill-in-the-blank and true/false items DPS also sets: at least one per two concepts, per chapter. */
export const chapterBlankMinimum = (concepts: number) => Math.max(2, Math.ceil(concepts / 2))
/** Owner decision 2026-10-08: no easy questions. No Remember items, no Easy label, a thinking floor. */
export const LEVEL_RULES = { maxUnderstand: 0.3, minAnalyseUp: 0.3 }

function wordCount(s: string) {
  return s.trim().split(/\s+/).filter(Boolean).length
}

export function validatePack(file: PackFile): Array<string> {
  const problems: Array<string> = []
  if (file.kind !== 'dps_pack') problems.push('kind must be "dps_pack"')
  let matchCount = 0
  let blankCount = 0
  let trueFalseCount = 0
  let trueVerdicts = 0
  const seen = new Set<string>()
  for (const c of file.concepts) {
    const have = { objective: 0, case_study: 0, long5: 0, reasoning3: 0, scenario_mcq: 0, multi_statement: 0, assertion_reason: 0, short2: 0, short2_multipart: 0, three_mark: 0 }
    if (c.questions.length < CONCEPT_TOTAL.min || c.questions.length > CONCEPT_TOTAL.max) {
      problems.push(`${c.code}: has ${c.questions.length} questions, wants ${CONCEPT_TOTAL.min} to ${CONCEPT_TOTAL.max}`)
    }
    for (const [i, q] of c.questions.entries()) {
      const where = `${c.code} #${i + 1}`
      const tags = q.tags ?? []
      for (const t of tags) if (!TAGS.includes(t)) problems.push(`${where}: unknown tag "${t}"`)
      if (q.b === 'Remember') problems.push(`${where}: Remember-level (recall) items are not allowed; raise it to Understand or above with a situation, comparison or reason`)
      if (q.d === 'Easy') problems.push(`${where}: the "Easy" label is retired; use Hard, or Hardest for 5-mark and case-study items`)
      if (seen.has(q.q)) problems.push(`${where}: duplicate text`)
      seen.add(q.q)
      if (!q.a.trim()) problems.push(`${where}: empty answer`)
      // The loader shuffles the options, so an answer that names a letter or number ("Option (b)",
      // "choice 2") would point at the wrong option. Say what the correct option SAYS instead.
      if (/\b(option|choice)s?\s*\(?\s*[a-d1-4]\s*\)?(?![a-z])/i.test(q.a) || (q.s ?? []).some(([d]) => /\b(option|choice)s?\s*\(?\s*[a-d1-4]\s*\)?(?![a-z])/i.test(d))) {
        problems.push(`${where}: the answer refers to an option by letter or number; the options are shuffled at load, so describe the correct option instead`)
      }
      if (!/[A-Za-z]/.test(q.q)) problems.push(`${where}: question has no words`)

      if (OPTION_TYPES.includes(q.t)) {
        have.objective++
        if (q.m !== 1) problems.push(`${where}: ${q.t} is worth 1 mark`)
        if (!q.o || q.o.length !== 4) problems.push(`${where}: ${q.t} needs 4 options`)
        else if (new Set(q.o.map((x) => x.trim())).size !== 4) problems.push(`${where}: options are not distinct`)
        if (q.s) problems.push(`${where}: ${q.t} has step marks`)
        if (q.t === 'match') {
          matchCount++
          if (!tags.includes('match')) problems.push(`${where}: a match item carries the "match" tag`)
        }
        if (q.t === 'mcq' && tags.includes('scenario')) have.scenario_mcq++
        if (q.t === 'multi_statement') {
          have.multi_statement++
          if (!/\b(I|1)\b.*\b(II|2)\b.*\b(III|3)\b/s.test(q.q)) problems.push(`${where}: a statement item has three numbered statements`)
        }
        if (q.t === 'assertion_reason') {
          have.assertion_reason++
          if (!/Assertion/i.test(q.q) || !/Reason/i.test(q.q)) problems.push(`${where}: assertion_reason needs an Assertion and a Reason`)
        }
        continue
      }
      if (q.t === 'fill_blank') {
        have.objective++
        blankCount++
        if (q.m !== 1) problems.push(`${where}: fill_blank is worth 1 mark`)
        if (!/_{3,}/.test(q.q)) problems.push(`${where}: fill_blank needs a blank written as ___ in the text`)
        if (q.o || q.s) problems.push(`${where}: fill_blank has no options and no step marks`)
        if (q.a.trim().split(/\s+/).length > 4) problems.push(`${where}: a fill_blank answer is a word or number (at most 4 words) so it can be marked automatically`)
        continue
      }
      // written
      const steps = q.s ?? []
      const sum = steps.reduce((n, [, m]) => n + m, 0)
      if (steps.length === 0) problems.push(`${where}: written question needs step marks`)
      else if (sum !== q.m) problems.push(`${where}: steps sum to ${sum}, question is ${q.m}`)
      for (const [desc, marks] of steps) {
        if (GENERIC_STEP.test(desc.trim())) problems.push(`${where}: step "${desc}" does not name what earns the mark`)
        if (!Number.isInteger(marks) || marks < 1) problems.push(`${where}: step marks are whole numbers of at least 1`)
      }
      if (q.t === 'short_answer' && ![2, 3].includes(q.m)) problems.push(`${where}: short_answer is 2 or 3 marks`)
      if (tags.includes('true_false')) {
        trueFalseCount++
        if (q.t !== 'short_answer' || q.m !== 2 || steps.length !== 2) problems.push(`${where}: a true_false item is a 2-mark short_answer with two steps (the verdict, then the reason or the corrected statement)`)
        if (!/\b(true|false)\b/i.test(q.a)) problems.push(`${where}: a true_false answer states True or False`)
        if (/^\W*true\b/i.test(q.a)) trueVerdicts++
      }
      if (q.t === 'long_answer' && ![3, 4, 5].includes(q.m)) problems.push(`${where}: long_answer is 3, 4 or 5 marks`)

      if (tags.includes('case_study')) {
        have.case_study++
        if (q.t !== 'long_answer' || q.m !== 4) problems.push(`${where}: a case study is a 4-mark long_answer`)
        if (steps.length < 3 || steps.length > 4) problems.push(`${where}: a 4-mark case study has 3 or 4 parts, one step each`)
        if (wordCount(q.q) < 45) problems.push(`${where}: a case study needs a real stem (setting and data), not one line`)
        const markers = (q.q.match(/(^|\n|\s)\(?(a|b|c|d|i|ii|iii|iv)\)/gi) ?? []).length
        if (markers < steps.length) problems.push(`${where}: the question text must label each of its ${steps.length} parts (a), (b), ...`)
      }
      if (q.t === 'long_answer' && q.m === 5) {
        have.long5++
        if (steps.length < 2) problems.push(`${where}: a 5-mark answer is multi-part (at least 2 steps)`)
      }
      if (q.t === 'short_answer' && q.m === 3 && ['claim_check', 'show_impossible', 'reverse'].some((t) => tags.includes(t))) have.reasoning3++
      if (q.t === 'short_answer' && q.m === 2) have.short2++
      if (q.t === 'short_answer' && q.m === 2 && steps.length >= 2) have.short2_multipart++
      if ((q.t === 'short_answer' || q.t === 'long_answer') && q.m === 3) have.three_mark++
    }
    for (const [key, min] of Object.entries(PACK_MINIMUMS)) {
      if (have[key as keyof typeof have] < min) problems.push(`${c.code}: needs at least ${min} ${key}, has ${have[key as keyof typeof have]}`)
    }
  }
  const wantBlank = chapterBlankMinimum(file.concepts.length)
  if (blankCount < wantBlank) problems.push(`chapter: needs at least ${wantBlank} fill_blank items, has ${blankCount}`)
  // A chapter whose true/false items are all "False" teaches "true/false means False". Keep a real mix.
  if (trueFalseCount >= 4 && (trueVerdicts < trueFalseCount * 0.25 || trueVerdicts > trueFalseCount * 0.75)) {
    problems.push(`chapter: true_false verdicts must be mixed (25% to 75% True); has ${trueVerdicts} True of ${trueFalseCount}`)
  }
  if (trueFalseCount < wantBlank) problems.push(`chapter: needs at least ${wantBlank} true_false items, has ${trueFalseCount}`)
  const wantMatch = chapterMatchMinimum(file.concepts.length)
  if (matchCount < wantMatch) problems.push(`chapter: needs at least ${wantMatch} match items, has ${matchCount}`)
  // The chapter as a whole must not sit at the recall end: DPS items test thinking, not memory.
  const all = file.concepts.flatMap((c) => c.questions)
  const share = (bs: Array<Bloom>) => all.filter((q) => bs.includes(q.b)).length / Math.max(all.length, 1)
  if (share(['Understand']) > LEVEL_RULES.maxUnderstand) problems.push(`chapter: more than ${LEVEL_RULES.maxUnderstand * 100}% of the questions are Understand level`)
  if (share(['Analyse', 'Evaluate', 'Create']) < LEVEL_RULES.minAnalyseUp) problems.push(`chapter: fewer than ${LEVEL_RULES.minAnalyseUp * 100}% of the questions are Analyse/Evaluate/Create`)
  return problems
}

function shuffled<T>(items: Array<T>, seed: string): Array<T> {
  const keyed = items.map((item, i) => ({ item, k: createHash('sha256').update(`${seed}|${i}`).digest('hex') }))
  return keyed.sort((x, y) => (x.k < y.k ? -1 : 1)).map((x) => x.item)
}

async function main() {
  const path = process.argv[2]
  const check = process.argv.includes('--check')
  const file = JSON.parse(readFileSync(path, 'utf8')) as PackFile
  const problems = validatePack(file)
  if (problems.length > 0) {
    console.error(problems.join('\n'))
    process.exit(1)
  }
  const total = file.concepts.reduce((n, c) => n + c.questions.length, 0)
  console.log(`${path}: ${file.concepts.length} concepts, ${total} questions, valid`)
  if (check) return

  const db = createDb()
  try {
    const { subject: sub, chapter: ch } = file
    const subject = await db.selectFrom('subjects').selectAll().where('code', '=', sub.code).where('class', '=', sub.class).executeTakeFirstOrThrow()
    const chapter = await db
      .selectFrom('chapters')
      .selectAll()
      .where('subject_id', '=', subject.id)
      .where('part', '=', ch.part)
      .where('chapter_no', '=', ch.chapter_no)
      .executeTakeFirstOrThrow()
    let added = 0
    let skipped = 0
    for (const c of file.concepts) {
      const concept = await db.selectFrom('concepts').selectAll().where('chapter_id', '=', chapter.id).where('code', '=', c.code).executeTakeFirst()
      if (!concept) throw new Error(`concept ${c.code} does not exist in ${sub.code} class ${sub.class} ${ch.part}${ch.chapter_no}; a pack never creates concepts`)
      for (const q of c.questions) {
        const exists = await db.selectFrom('questions').select('id').where('concept_id', '=', concept.id).where('text_hash', '=', computeTextHash(q.q)).executeTakeFirst()
        if (exists) {
          skipped++
          continue
        }
        const options = q.o
          ? shuffled(q.o.map((text, i) => ({ text, is_correct: i === 0 })), q.q).map((o, i) => ({
              label: 'ABCD'[i],
              text: o.text,
              is_correct: o.is_correct,
              order_index: i + 1,
            }))
          : undefined
        await createQuestion(db, {
          concept_id: concept.id,
          board: sub.board,
          class: sub.class,
          bloom: q.b,
          difficulty: q.d,
          marks: q.m,
          type: q.t,
          text: q.q,
          answer: q.a,
          options,
          step_marks: q.s?.map(([description, marks], i) => ({ step_no: i + 1, description, marks })),
          is_reversal_word: q.rev,
          tags: ['dps', ...(q.tags ?? [])],
          created_by: `claude-dps-pack-${sub.code}-${ch.part}${ch.chapter_no}`,
          origin: 'ai_generated',
          source_ref: file.source_code,
        })
        added++
      }
    }
    console.log(`DPS pack ${ch.part}${ch.chapter_no}: ${added} questions added, ${skipped} already present`)
  } finally {
    await db.destroy()
  }
}

if (process.argv[1]?.includes('load-dps-pack')) void main()
