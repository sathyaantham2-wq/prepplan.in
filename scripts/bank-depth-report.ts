/**
 * How deep is the question bank for the paper kinds a school needs most: long answers (4-5 marks)
 * and case-based questions? Reads the authored question files under content/authoring (the source
 * of what was loaded), never a database, so it is safe to run anywhere:
 *
 *   npx tsx scripts/bank-depth-report.ts
 *
 * Writes docs/schools/BANK_DEPTH_REPORT.md and docs/schools/bank-depth-by-chapter.csv.
 *
 * Where a subject has a DPS-style set (content/authoring/dps) that set is counted, because it
 * replaced the older grid in production; otherwise the older set is counted. Which sets are live in
 * production comes from docs/DPS_BANK_STATUS.md (2026-10-24) and should be confirmed against
 * production with the read-only query printed at the end of the report.
 */
import {
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { join } from 'node:path'

interface Q {
  m?: number
  marks?: number
  t?: string
  type?: string
  tags?: Array<string> | null
}
interface Pack {
  subject?: { board: string; class: number; code: string }
  chapter?: { part?: string; chapter_no?: number; name?: string }
  concepts?: Array<{ questions?: Array<Q> | null }>
}

const ROOT = 'content/authoring'

function walk(dir: string, out: Array<string> = []): Array<string> {
  for (const name of readdirSync(dir)) {
    if (
      name.startsWith('_') ||
      name.includes('backup') ||
      name === 'civil' ||
      name === 'civils' ||
      name === 'packs'
    )
      continue
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (name.endsWith('.json')) out.push(p)
  }
  return out
}

interface ChapterStat {
  part: string
  no: number
  name: string
  total: number
  byMarks: Partial<Record<number, number>>
  long4: number
  long5: number
  caseStudy: number
}
interface SubjectStat {
  code: string
  grade: number
  set: string
  dps: boolean
  chapters: Array<ChapterStat>
}

const subjects = new Map<string, Map<string, SubjectStat>>() // code -> set -> stat
for (const file of walk(ROOT)) {
  let pack: Pack
  try {
    pack = JSON.parse(readFileSync(file, 'utf8'))
  } catch {
    continue
  }
  if (!pack.subject || !pack.concepts) continue
  const parts = file.split('/')
  const set = parts[2] === 'dps' ? `dps/${parts[3]}` : parts[2]
  const code = pack.subject.code
  const bySet = subjects.get(code) ?? new Map<string, SubjectStat>()
  subjects.set(code, bySet)
  const stat = bySet.get(set) ?? {
    code,
    grade: pack.subject.class,
    set,
    dps: parts[2] === 'dps',
    chapters: [],
  }
  bySet.set(set, stat)
  const ch: ChapterStat = {
    part: pack.chapter?.part ?? 'I',
    no: pack.chapter?.chapter_no ?? 0,
    name: pack.chapter?.name ?? '',
    total: 0,
    byMarks: {},
    long4: 0,
    long5: 0,
    caseStudy: 0,
  }
  for (const c of pack.concepts) {
    for (const q of c.questions ?? []) {
      const marks = q.m ?? q.marks ?? 0
      const type = q.t ?? q.type ?? ''
      const tags = q.tags ?? []
      ch.total++
      ch.byMarks[marks] = (ch.byMarks[marks] ?? 0) + 1
      const isCase = tags.includes('case_study')
      if (isCase) ch.caseStudy++
      else if (
        (type === 'short_answer' || type === 'long_answer') &&
        marks === 4
      )
        ch.long4++
      else if (
        (type === 'short_answer' || type === 'long_answer') &&
        marks === 5
      )
        ch.long5++
    }
  }
  stat.chapters.push(ch)
}

// Sets live in production per docs/DPS_BANK_STATUS.md (2026-10-24). Everything else in a DPS dir is
// written but not loaded; an old-grid set is live until its DPS replacement is loaded.
const DPS_LIVE = new Set([
  'dps/class6s',
  'dps/class6sc',
  'dps/class7',
  'dps/class7s',
  'dps/class7sc',
  'dps/class8',
  'dps/class8sc',
  'dps/class8s',
  'dps/class9',
  'dps/class9s',
  'dps/class9sc',
])

const rows: Array<{ s: SubjectStat; live: string }> = []
for (const [, bySet] of subjects) {
  const sets = [...bySet.values()]
  const dps = sets.find((s) => s.dps)
  const chosen = dps ?? sets[0]
  const live = dps
    ? DPS_LIVE.has(dps.set)
      ? 'DPS set, in production'
      : 'DPS set written, NOT confirmed in production (old grid is live)'
    : 'older grid set, in production'
  rows.push({ s: chosen, live })
}
rows.sort((a, b) =>
  a.s.grade === 7 && a.s.code === 'MATH'
    ? -1
    : b.s.grade === 7 && b.s.code === 'MATH'
      ? 1
      : a.s.grade - b.s.grade || a.s.code.localeCompare(b.s.code),
)

const sum = (a: Array<number>) => a.reduce((n, x) => n + x, 0)
const median = (a: Array<number>) => {
  if (a.length === 0) return 0
  const s = [...a].sort((x, y) => x - y)
  return s.length % 2
    ? s[(s.length - 1) / 2]
    : (s[s.length / 2 - 1] + s[s.length / 2]) / 2
}

const lines: Array<string> = []
const csv: Array<string> = [
  'subject,class,set,part,chapter_no,chapter_name,total,m1,m2,m3,m4,m5,long_4mark_written,long_5mark_written,case_study',
]
for (const { s } of rows) {
  for (const c of s.chapters.sort(
    (a, b) => a.part.localeCompare(b.part) || a.no - b.no,
  )) {
    csv.push(
      [
        s.code,
        s.grade,
        s.set,
        c.part,
        c.no,
        JSON.stringify(c.name),
        c.total,
        c.byMarks[1] ?? 0,
        c.byMarks[2] ?? 0,
        c.byMarks[3] ?? 0,
        c.byMarks[4] ?? 0,
        c.byMarks[5] ?? 0,
        c.long4,
        c.long5,
        c.caseStudy,
      ].join(','),
    )
  }
}

lines.push('# Question bank depth: long answers and case studies', '')
lines.push(
  'Generated by `scripts/bank-depth-report.ts` from the authored question files in `content/authoring` (not from a database).',
)
lines.push(
  '"Long answer" means a written (short or long answer) question worth 4 or 5 marks that is not a case study; "case study" means a question tagged `case_study` (4 marks in the DPS sets).',
  '',
)
lines.push(
  'A CBSE-style 80-mark paper needs, for one subject: **7 five-mark long answers** (4 plus 3 with an OR) and **4 case studies** (3 plus 1 with an OR), spread over the chosen chapters. A 40-mark Unit Test needs 3 four-mark written questions and no case study.',
  '',
)
lines.push(
  '| Class | Subject | Set counted | Chapters | Questions | 4-mark long | 5-mark long | Case studies | Chapters with no 5-mark long | Chapters with no case study | 5-mark long per chapter (median) | Case studies per chapter (median) | Full 80-mark papers the whole subject could fill |',
)
lines.push('|---|---|---|---|---|---|---|---|---|---|---|---|---|')
for (const { s, live } of rows) {
  const ch = s.chapters
  const l4 = sum(ch.map((c) => c.long4))
  const l5 = sum(ch.map((c) => c.long5))
  const cs = sum(ch.map((c) => c.caseStudy))
  const papers = Math.min(Math.floor(l5 / 7), Math.floor(cs / 4))
  lines.push(
    `| ${s.grade} | ${s.code}${s.grade === 7 && s.code === 'MATH' ? ' ★' : ''} | ${s.set} (${live}) | ${ch.length} | ${sum(ch.map((c) => c.total))} | ${l4} | ${l5} | ${cs} | ${ch.filter((c) => c.long5 === 0).length} | ${ch.filter((c) => c.caseStudy === 0).length} | ${median(ch.map((c) => c.long5))} | ${median(ch.map((c) => c.caseStudy))} | ${papers} |`,
  )
}
lines.push(
  '',
  "★ Class 7 Maths is the original launch subject; the others were added at the owner's request (see CLAUDE.md).",
  '',
)
lines.push('## What this means', '')
const thin = rows.filter(
  ({ s }) =>
    sum(s.chapters.map((c) => c.long5)) < 7 ||
    sum(s.chapters.map((c) => c.caseStudy)) < 4,
)
lines.push(
  thin.length === 0
    ? '- Every subject has enough long answers and case studies for at least one full 80-mark paper over the whole subject.'
    : `- **No long answers or case studies at all (older grid sets):** ${thin.map(({ s }) => `Class ${s.grade} ${s.code}`).join(', ')}. A CBSE-style 80-mark paper cannot be filled for these (Sections D and E stay empty); a Unit Test with only 1-3 mark questions can.`,
)
lines.push(
  '- The DPS sets hold about one 4-mark case study and one 5-mark long answer for every 12-13 questions, but they are spread by concept, so a paper on only two or three chapters can run short. The coverage preview shows this chapter by chapter before a paper is made.',
)
lines.push(
  '- Chapter-by-chapter counts are in `bank-depth-by-chapter.csv`.',
  '',
)
lines.push('## Check it against production (read-only)', '')
lines.push(
  'The counts above are from the files. Run this in the Supabase SQL editor (it only reads) to see what is actually live:',
  '',
)
lines.push('```sql')
lines.push(`select s.board, s.class, s.code,
  count(*) filter (where q.type in ('short_answer','long_answer') and q.marks = 5 and not (q.tags @> array['case_study'])) as long5,
  count(*) filter (where q.type in ('short_answer','long_answer') and q.marks = 4 and not (q.tags @> array['case_study'])) as long4,
  count(*) filter (where q.tags @> array['case_study']) as case_study
from questions q
join concepts c on c.id = q.concept_id
join chapters ch on ch.id = c.chapter_id
join subjects s on s.id = ch.subject_id
where q.status = 'approved'
group by 1, 2, 3 order by 2, 3;`)
lines.push('```', '')
mkdirSync('docs/schools', { recursive: true })
writeFileSync('docs/schools/BANK_DEPTH_REPORT.md', lines.join('\n'))
writeFileSync('docs/schools/bank-depth-by-chapter.csv', csv.join('\n') + '\n')
console.log(lines.slice(4, 4 + rows.length + 4).join('\n'))
