import type { Db } from '../../db/connection'
import type { SchoolScope } from '../../db/school-scope'
import { PDF_FONT_FACES, withTelugu } from '../pdf/fonts'
import { escapeHtml } from '../pdf/html-utils'
import { renderHtmlToPdf } from '../pdf/render'
import { focusWhy, tr } from '../school-i18n'
import type { Key, Lang } from '../school-i18n'
import { SchoolError } from './common'
import { myProgress, viewerFor } from './progress'
import type { Level } from './topic-level'

// The things a student or parent takes away from the Progress screens (owner direction 2026-10-31): a one-page
// summary PDF, a WhatsApp text, and a printable practice worksheet for one topic. All from final marks only; none
// of them is stored, e-mailed or sent anywhere by PrepPlan.

const LEVEL_KEY: Record<Level, Key> = {
  beginner: 'levelBeginner',
  progressing: 'levelProgressing',
  proficient: 'levelProficient',
}

/** A short text for a share sheet or WhatsApp. No link: nothing is stored. */
export async function summaryText(
  db: Db,
  scope: SchoolScope,
  lang: Lang,
  childId?: string | null,
): Promise<string> {
  const p = await myProgress(db, scope, childId)
  const t = (k: Key) => tr(lang, k)
  const lines = [
    `${t('summaryFor')}: ${p.viewer.name}`,
    `Class ${p.viewer.grade} ${p.viewer.sectionName}, ${p.viewer.schoolName}`,
    '',
  ]
  if (!p.hasData) lines.push(t('noData'))
  else {
    for (const e of p.exams.slice(0, 4)) lines.push(`${e.subject} ${e.title}: ${e.pct}% (${e.grade})`)
    if (p.best.bestPct !== null) lines.push('', `${t('best')}: ${p.best.bestPct}%`)
    const levels = (l: Level) => p.topics.filter((x) => x.level === l).length
    lines.push(
      '',
      `${t('levelProficient')}: ${levels('proficient')}, ${t('levelProgressing')}: ${levels('progressing')}, ${t('levelBeginner')}: ${levels('beginner')}`,
    )
    if (p.focus.length > 0) {
      lines.push('', `${t('focus')}:`)
      p.focus.forEach((f, i) =>
        lines.push(`${i + 1}. ${f.kind === 'habit' && f.habit ? t(`habit_${f.habit}` as Key) : f.title}`),
      )
    }
  }
  lines.push('', `${t('exampleHonest')} (PrepPlan)`)
  return lines.join('\n')
}

/** The one-page summary for parents, A4, English or Telugu. */
export async function summaryHtml(
  db: Db,
  scope: SchoolScope,
  lang: Lang,
  childId?: string | null,
): Promise<string> {
  const p = await myProgress(db, scope, childId)
  const t = (k: Key) => tr(lang, k)
  const e = escapeHtml
  const levels = (l: Level) => p.topics.filter((x) => x.level === l)
  const latest = p.exams.at(0)
  const habits = p.habits.filter((h) => h.total > 0).sort((a, b) => b.total - a.total).slice(0, 3)
  const bar = (n: number, color: string) => `<div style="height:10px;background:#e2e8f0;border-radius:6px"><div style="height:10px;width:${Math.min(100, n)}%;background:${color};border-radius:6px"></div></div>`
  return `<!doctype html><html><head><meta charset="utf-8"><style>
${PDF_FONT_FACES}
@page { size: A4; margin: 14mm }
body { font-family: ${withTelugu("'Helvetica Neue', Arial, sans-serif")}; color:#0f172a; font-size:12.5px; line-height:1.4 }
h1 { font-size:22px; margin:0 } h2 { font-size:14px; margin:16px 0 6px; color:#047857 }
.muted { color:#475569 } table { width:100%; border-collapse:collapse } td,th { padding:5px 6px; border-bottom:1px solid #e2e8f0; text-align:left }
.pill { display:inline-block; padding:2px 8px; border-radius:99px; background:#e0f2fe; font-weight:700 }
.cols { display:flex; gap:14px } .cols > div { flex:1 }
.lvl b { font-size:20px }
</style></head><body>
<h1>${e(p.viewer.name)}</h1>
<div class="muted">Class ${p.viewer.grade} ${e(p.viewer.sectionName)} · ${e(p.viewer.schoolName)}</div>
<div class="muted">${e(t('summaryFor'))} · ${e(t('exampleHonest'))}</div>
${
  !p.hasData
    ? `<p>${e(t('noData'))}</p>`
    : `<h2>${e(t('exams'))}</h2>
<table><tr><th>${e(t('exam'))}</th><th>${e(t('score'))}</th><th>${e(t('grade'))}</th></tr>
${p.exams.map((x) => `<tr><td>${e(x.subject)} · ${e(x.title)}</td><td>${x.pct}%</td><td><span class="pill">${e(x.grade)}</span></td></tr>`).join('')}</table>
${p.best.bestPct !== null ? `<p>${e(t('best'))}: <b>${p.best.bestPct}%</b></p>` : ''}
${
  latest
    ? `<h2>${e(t('whereMarksWent'))} (${e(latest.title)})</h2>
<table><tr><td>${e(t('didntKnow'))}</td><td><b>${latest.lostKnowledge}</b> ${e(t('marks'))}</td><td style="width:45%">${bar(latest.lostKnowledge * 10, '#0ea5e9')}</td></tr>
<tr><td>${e(t('writingHabits'))}</td><td><b>${latest.lostHabit}</b> ${e(t('marks'))}</td><td>${bar(latest.lostHabit * 10, '#f59e0b')}</td></tr></table>`
    : ''
}
<h2>${e(t('topicMap'))}</h2>
<div class="cols lvl">
${(['proficient', 'progressing', 'beginner'] as const).map((l) => `<div><b>${levels(l).length}</b><br>${e(t(LEVEL_KEY[l]))}</div>`).join('')}
</div>
<h2>${e(t('focus'))}</h2>
<ol>${p.focus.map((f) => `<li><b>${e(f.kind === 'habit' && f.habit ? t(`habit_${f.habit}` as Key) : f.title)}</b><br><span class="muted">${e(focusWhy(lang, f))}</span></li>`).join('')}</ol>
${
  habits.length > 0
    ? `<h2>${e(t('habits'))}</h2><ul>${habits.map((h) => `<li>${e(t(`habit_${h.habit}` as Key))}: ${h.total} ${e(t('marks'))}. ${e(t(`tip_${h.habit}` as Key))}</li>`).join('')}</ul>`
    : ''
}`
}
</body></html>`
}

export async function summaryPdf(db: Db, scope: SchoolScope, lang: Lang, childId?: string | null) {
  return renderHtmlToPdf(await summaryHtml(db, scope, lang, childId))
}

// ---------------------------------------------------------------- "Practise this"

/**
 * A printable worksheet of bank questions for one topic of hers (a concept, or a chapter), leaving out the
 * questions already in her exams, with an answer page at the end. Nothing is recorded: no attempt, no marking,
 * no mastery. She has already seen her marks for this topic, so the answer page follows CLAUDE.md (2026-09-22).
 */
export async function practiseHtml(
  db: Db,
  scope: SchoolScope,
  topicKey: string,
  lang: Lang,
  childId?: string | null,
): Promise<string> {
  const { viewer } = await viewerFor(db, scope, childId)
  const m = /^([ch]):([0-9a-f-]{36})$/.exec(topicKey)
  if (!m) throw new SchoolError('invalid', 'That topic is not known.')
  let label: string
  let conceptIds: Array<string>
  if (m[1] === 'c') {
    const c = await db.selectFrom('concepts').select(['id', 'name']).where('id', '=', m[2]).executeTakeFirst()
    if (!c) throw new SchoolError('not_found', 'That topic is not known.')
    label = c.name
    conceptIds = [c.id]
  } else {
    const ch = await db.selectFrom('chapters').select(['id', 'name']).where('id', '=', m[2]).executeTakeFirst()
    if (!ch) throw new SchoolError('not_found', 'That topic is not known.')
    label = ch.name
    conceptIds = (await db.selectFrom('concepts').select('id').where('chapter_id', '=', ch.id).execute()).map((x) => x.id)
  }
  // a student may only ask for a topic she has actually met in one of her exams
  const met = await db
    .selectFrom('school_answer_marks as am')
    .innerJoin('school_own_questions as q', 'q.id', 'am.own_question_id')
    .leftJoin('school_exam_questions as eq', 'eq.id', 'q.source_exam_question_id')
    .leftJoin('questions as qq', 'qq.id', 'eq.question_id')
    .select(['q.chapter_id', 'qq.concept_id', 'eq.question_id'])
    .where('am.school_id', '=', scope.schoolId)
    .where('am.school_student_id', '=', viewer.studentId)
    .execute()
  const ok = m[1] === 'c' ? met.some((x) => x.concept_id === m[2]) : met.some((x) => x.chapter_id === m[2])
  if (!ok) throw new SchoolError('not_found', 'That topic is not known.')
  const used = new Set(met.map((x) => x.question_id).filter((x): x is string => x !== null))
  const rows = conceptIds.length
    ? await db
        .selectFrom('questions')
        .select(['id', 'text', 'type', 'marks', 'answer', 'tags'])
        .where('concept_id', 'in', conceptIds)
        .where('status', '=', 'approved')
        .where('type', 'in', ['mcq', 'short_answer'])
        .orderBy('marks')
        .limit(80)
        .execute()
    : []
  const picked = rows
    .filter((r) => !used.has(r.id) && !r.tags.some((x) => ['figure', 'map', 'case_study'].includes(x)))
    .slice(0, 8)
  const opts = picked.length
    ? await db
        .selectFrom('question_options')
        .select(['question_id', 'label', 'text', 'is_correct', 'order_index'])
        .where('question_id', 'in', picked.map((r) => r.id))
        .orderBy('order_index')
        .execute()
    : []
  const e = escapeHtml
  const t = (k: Key) => tr(lang, k)
  return `<!doctype html><html><head><meta charset="utf-8"><style>
${PDF_FONT_FACES}
@page { size: A4; margin: 16mm }
body { font-family: ${withTelugu("'Helvetica Neue', Arial, sans-serif")}; font-size:13px; line-height:1.45; color:#0f172a }
h1 { font-size:20px; margin:0 0 4px } .muted { color:#475569 } li { margin:0 0 12px } .opt { margin-left:18px } .page { page-break-before: always }
</style></head><body>
<h1>${e(t('practise'))}: ${e(label)}</h1>
<div class="muted">${e(viewer.schoolName)} · Class ${viewer.grade} ${e(viewer.sectionName)}</div>
${picked.length === 0 ? `<p>${e('No new questions for this topic yet.')}</p>` : ''}
<ol>${picked
    .map(
      (r) =>
        `<li>${e(r.text)} <span class="muted">[${r.marks}]</span>${opts
          .filter((o) => o.question_id === r.id)
          .map((o) => `<div class="opt">(${e(o.label)}) ${e(o.text)}</div>`)
          .join('')}</li>`,
    )
    .join('')}</ol>
<div class="page"><h1>Answers</h1><ol>${picked
    .map((r) => {
      const right = opts.find((o) => o.question_id === r.id && o.is_correct)
      return `<li>${e(right ? `(${right.label}) ${right.text}` : r.answer)}</li>`
    })
    .join('')}</ol></div>
</body></html>`
}

export async function practisePdf(db: Db, scope: SchoolScope, topicKey: string, lang: Lang, childId?: string | null) {
  return renderHtmlToPdf(await practiseHtml(db, scope, topicKey, lang, childId))
}
