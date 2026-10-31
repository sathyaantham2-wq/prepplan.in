import { useCallback, useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowDown, ArrowRight, ArrowUp, ChevronDown, Flag, Printer, Share2, Sparkles, Trophy } from 'lucide-react'
import { api } from '../../lib/school-client'
import { focusWhy } from '../../lib/school-i18n'
import type { Lang, Key } from '../../lib/school-i18n'
import type { HabitCode } from '../../lib/schools/marking-logic'
import type { examInsight, myProgress } from '../../lib/schools/progress'
import {
  Bars,
  GrowthLine,
  LevelMeter,
  PCard,
  Pill,
  Ring,
  SplitBar,
  cardCls,
  dayLabel,
  ghostBtn,
  levelKey,
  muted,
  solidBtn,
  strong,
} from './progress-ui'
import type { T } from './progress-ui'

export type Progress = Awaited<ReturnType<typeof myProgress>>
export type Insight = Awaited<ReturnType<typeof examInsight>>

const habitKey = (h: HabitCode) => `habit_${h}` as Key
const tipKey = (h: HabitCode) => `tip_${h}` as Key

/** "Practise this": a printable worksheet of bank questions for the topic (no attempt is recorded). */
export function practiseHref(schoolId: string, topicKey: string, lang: Lang, child?: string | null) {
  const q = new URLSearchParams({ topic: topicKey, lang })
  if (child) q.set('child', child)
  return `/api/schools/${schoolId}/progress/practise?${q.toString()}`
}

const trendIcon = (tr: 'up' | 'flat' | 'down' | null) =>
  tr === 'up' ? (
    <ArrowUp aria-hidden="true" className="size-5 text-emerald-600" />
  ) : tr === 'down' ? (
    <ArrowDown aria-hidden="true" className="size-5 text-red-600" />
  ) : tr === 'flat' ? (
    <ArrowRight aria-hidden="true" className="size-5 text-slate-500" />
  ) : null
const trendKey = (tr: 'up' | 'flat' | 'down' | null): Key =>
  tr === 'up' ? 'trendUp' : tr === 'down' ? 'trendDown' : 'trendFlat'

// ---------------------------------------------------------------- 1. My Progress

export function HomeTab({
  d,
  schoolId,
  lang,
  t,
  child,
}: {
  d: Progress
  schoolId: string
  lang: Lang
  t: T
  child: string | null
}) {
  if (!d.hasData)
    return (
      <PCard testId="no-data">
        <p className={`text-base ${muted}`}>{t('noData')}</p>
      </PCard>
    )
  return (
    <div className="space-y-4">
      <PCard title={t('growth')}>
        <GrowthLine points={d.growth} />
        <div className="mt-2 flex flex-wrap items-center gap-2" data-testid="best">
          <Pill tone={d.best.latestIsBest ? 'good' : 'plain'}>
            <Trophy aria-hidden="true" className="size-4" />
            {d.best.latestIsBest ? t('newBest') : `${t('best')}: ${d.best.bestPct}%`}
          </Pill>
          {d.rank ? (
            <Pill>
              {t('rank')}: {d.rank.place}/{d.rank.of}
            </Pill>
          ) : null}
        </div>
      </PCard>

      <PCard title={t('focus')} testId="focus">
        {d.focus.length === 0 ? (
          <p className={`text-base ${muted}`}>{t('focusEmpty')}</p>
        ) : (
          <ul className="space-y-3">
            {d.focus.map((f, i) => (
              <li
                key={i}
                className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800"
                data-testid="focus-item"
              >
                <p className={`flex items-center gap-2 text-base font-bold ${strong}`}>
                  <Sparkles aria-hidden="true" className="size-4 text-amber-500" />
                  {f.kind === 'habit' && f.habit ? t(habitKey(f.habit)) : f.title}
                </p>
                <p className={`mt-1 text-base ${muted}`}>{focusWhy(lang, f)}</p>
                {f.topicKey ? (
                  <a
                    className={ghostBtn('mt-2')}
                    href={practiseHref(schoolId, f.topicKey, lang, child)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Printer aria-hidden="true" className="size-4" /> {t('practise')}
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </PCard>

      <PCard title={t('exams')}>
        <ul className="space-y-2">
          {d.exams.map((e) => (
            <li key={e.paperId}>
              <Link
                to="/school/$schoolId/progress/exam/$paperId"
                params={{ schoolId, paperId: e.paperId }}
                search={child ? { child } : {}}
                className="flex min-h-16 items-center gap-3 rounded-2xl border border-slate-200 px-3 py-2 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                data-testid="exam-link"
              >
                <span className="min-w-0 flex-1">
                  <span className={`block text-base font-bold ${strong}`}>{e.title}</span>
                  <span className={`block text-sm ${muted}`}>{dayLabel(e.at, lang)}</span>
                </span>
                <Pill tone="blue">{e.grade}</Pill>
                <span className={`text-xl font-bold ${strong}`}>{e.pct}%</span>
              </Link>
            </li>
          ))}
        </ul>
      </PCard>
    </div>
  )
}

// ---------------------------------------------------------------- 2. Subjects

export function SubjectsTab({ d, t }: { d: Progress; t: T }) {
  if (!d.hasData)
    return (
      <PCard>
        <p className={`text-base ${muted}`}>{t('noData')}</p>
      </PCard>
    )
  return (
    <ul className="grid gap-3 sm:grid-cols-2" data-testid="subjects">
      {d.subjects.map((s) => (
        <li key={s.subject} className={`${cardCls} flex items-center gap-4`} data-testid="subject-tile">
          <Ring value={s.proficient} total={s.assessed} />
          <div className="min-w-0 flex-1">
            <p className={`text-lg font-bold ${strong}`}>{s.subject}</p>
            <p className={`flex items-center gap-1 text-base ${muted}`}>
              {trendIcon(s.trend)}
              {s.trend ? t(trendKey(s.trend)) : t('latest')}
            </p>
            <p className={`text-sm ${muted}`}>
              {s.proficient} / {s.assessed} {t('proficientOf')}
            </p>
          </div>
          <p className={`text-3xl font-bold ${strong}`}>
            {s.latestPct}
            <span className={`text-lg ${muted}`}>%</span>
          </p>
        </li>
      ))}
    </ul>
  )
}

// ---------------------------------------------------------------- 4. Topic map

export function TopicsTab({ d, t }: { d: Progress; t: T }) {
  if (!d.hasData)
    return (
      <PCard>
        <p className={`text-base ${muted}`}>{t('noData')}</p>
      </PCard>
    )
  const subjects = [...new Set(d.topics.map((x) => x.subject))]
  return (
    <div className="space-y-4" data-testid="topic-map">
      <p className={`px-1 text-base ${muted}`}>{t('howLevel')}</p>
      {subjects.map((s) => (
        <PCard key={s} title={s}>
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {d.topics
              .filter((x) => x.subject === s)
              .map((x) => (
                <li key={x.key} className="flex items-center gap-3 py-2.5" data-testid="topic-row">
                  <span className="min-w-0 flex-1">
                    <span className={`block text-base font-semibold ${strong}`}>{x.label}</span>
                    <span className={`block text-sm ${muted}`}>
                      {x.level ? t(levelKey(x.level)) : t('notAssessed')}
                      {x.latestPct !== null ? ` · ${x.latestPct}%` : ''}
                    </span>
                  </span>
                  {x.dip ? <Pill tone="amber">{t('dip')}</Pill> : null}
                  <LevelMeter level={x.level} />
                </li>
              ))}
          </ul>
        </PCard>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------- 5. Writing habits

export function HabitsTab({ d, t }: { d: Progress; t: T }) {
  const used = d.habits.filter((h) => h.total > 0)
  const max = Math.max(1, ...d.habits.flatMap((h) => h.perExam.map((p) => p.lost)))
  if (!d.hasData)
    return (
      <PCard>
        <p className={`text-base ${muted}`}>{t('noData')}</p>
      </PCard>
    )
  return (
    <div className="space-y-3" data-testid="habits">
      <p className={`px-1 text-base ${muted}`}>{t('habitTrend')}</p>
      {used.length === 0 ? (
        <PCard>
          <p className={`text-base ${strong}`}>{t('noHabits')}</p>
        </PCard>
      ) : (
        used
          .sort((a, b) => b.total - a.total)
          .map((h) => (
            <PCard key={h.habit}>
              <div className="flex items-center gap-3" data-testid="habit-card">
                <div className="min-w-0 flex-1">
                  <p className={`text-base font-bold ${strong}`}>{t(habitKey(h.habit))}</p>
                  <p className={`text-sm ${muted}`}>
                    {h.total} {t('marks')}
                  </p>
                </div>
                <Bars values={h.perExam.map((p) => p.lost)} max={max} />
              </div>
              <p className={`mt-2 text-base ${muted}`}>{t(tipKey(h.habit))}</p>
            </PCard>
          ))
      )}
    </div>
  )
}

// ---------------------------------------------------------------- 3. Exam report

function SignedImg({ src, alt }: { src: string; alt: string }) {
  const [url, setUrl] = useState<string | null>(null)
  useEffect(() => {
    let gone = false
    let made: string | null = null
    void fetch(src, { credentials: 'same-origin' })
      .then((r) => (r.ok ? r.blob() : null))
      .then((b) => {
        if (b && !gone) {
          made = URL.createObjectURL(b)
          setUrl(made)
        }
      })
      .catch(() => undefined)
    return () => {
      gone = true
      if (made) URL.revokeObjectURL(made)
    }
  }, [src])
  const cls = 'aspect-[3/4] w-full rounded-xl bg-slate-100 object-cover dark:bg-slate-800'
  return url ? <img src={url} alt={alt} className={cls} /> : <div role="img" aria-label={alt} className={cls} />
}

export function ExamReport({
  schoolId,
  paperId,
  lang,
  t,
  child,
}: {
  schoolId: string
  paperId: string
  lang: Lang
  t: T
  child: string | null
}) {
  const [d, setD] = useState<Insight | null>(null)
  const [error, setError] = useState<string | null>(null)
  const url = `/api/schools/${schoolId}/progress/exam/${paperId}${child ? `?child=${child}` : ''}`
  const load = useCallback(async () => {
    setD(await api<Insight>(url))
  }, [url])
  useEffect(() => {
    void load().catch((e: unknown) => setError(e instanceof Error ? e.message : 'Something went wrong.'))
  }, [load])
  if (error) return <p className="text-base text-red-700 dark:text-red-300">{error}</p>
  if (!d) return <p className={`text-base ${muted}`}>{t('loading')}</p>
  return (
    <div className="space-y-4" data-testid="exam-report">
      <div className="px-1">
        <p className={`text-base ${muted}`}>
          {d.exam.subject} · {dayLabel(d.exam.at, lang)}
        </p>
        <h1 className={`font-display text-2xl font-bold ${strong}`}>{d.exam.title}</h1>
      </div>
      {!d.exam.locked ? (
        <p className="rounded-2xl bg-amber-50 p-3 text-base text-amber-950 dark:bg-amber-950 dark:text-amber-100" data-testid="not-final">
          {t('notFinal')} {dayLabel(d.exam.windowClosesAt, lang)}.
        </p>
      ) : null}

      <PCard>
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className={`text-sm font-semibold ${muted}`}>{t('score')}</p>
            <p className={`text-4xl font-bold ${strong}`} data-testid="score">
              {d.score.earned}
              <span className={`text-2xl ${muted}`}> / {d.score.max}</span>
            </p>
          </div>
          <div className="text-right">
            <p className={`text-sm font-semibold ${muted}`}>{t('grade')}</p>
            <p className="text-4xl font-bold text-sky-600 dark:text-sky-300" data-testid="grade">
              {d.score.grade}
            </p>
          </div>
        </div>
      </PCard>

      <PCard title={t('whereMarksWent')}>
        <SplitBar knowledge={d.split.knowledge} habit={d.split.habit} unclear={d.split.unclear} t={t} />
      </PCard>

      <PCard title={t('threeFix')} testId="fixes">
        {d.fixes.length === 0 ? (
          <p className={`text-base ${strong}`}>{t('noFix')}</p>
        ) : (
          <ol className="space-y-3">
            {d.fixes.map((f, i) => (
              <li key={f.topicKey} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-slate-800" data-testid="fix">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white font-bold text-slate-800 dark:bg-slate-700 dark:text-slate-100">
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`block text-base font-bold ${strong}`}>{f.title}</span>
                  <span className={`block text-sm ${muted}`}>
                    {f.lost} {t('marks')} · {f.kind === 'knowledge_gap' ? t('didntKnow') : t('writingHabits')}
                  </span>
                </span>
                <a
                  className={ghostBtn()}
                  href={practiseHref(schoolId, f.topicKey, lang, child)}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t('practise')}
                </a>
              </li>
            ))}
          </ol>
        )}
      </PCard>

      <PCard title={t('questionGrid')} testId="grid">
        {d.pages.length > 0 ? (
          <details className="mb-3">
            <summary className={`min-h-11 cursor-pointer content-center text-base font-semibold ${strong}`}>
              {t('yourPages')} ({d.pages.length})
            </summary>
            <ul className="mt-2 grid grid-cols-3 gap-2">
              {d.pages.map((p) => (
                <li key={p.id}>
                  <SignedImg src={child ? `${p.url}&child=${child}` : p.url} alt={`${t('yourPages')} ${p.seq ?? ''}`} />
                </li>
              ))}
            </ul>
          </details>
        ) : null}
        <ul className="space-y-2">
          {d.grid.map((g) => (
            <GridRow key={g.questionNo} g={g} schoolId={schoolId} paperId={paperId} t={t} reload={load} canFlag={d.canFlag} />
          ))}
        </ul>
      </PCard>
      {d.canFlag ? (
        <Reflection schoolId={schoolId} paperId={paperId} questions={d.grid.map((g) => ({ questionNo: g.questionNo, text: g.text }))} t={t} />
      ) : null}
    </div>
  )
}

function GridRow({
  g,
  schoolId,
  paperId,
  t,
  reload,
  canFlag,
}: {
  g: Insight['grid'][number]
  schoolId: string
  paperId: string
  t: T
  reload: () => Promise<void>
  canFlag: boolean
}) {
  const [why, setWhy] = useState('')
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const full = g.marks !== null && g.marks >= g.maxMarks
  async function flag() {
    if (!g.flag?.answerMarkId) return
    setBusy(true)
    setError(null)
    try {
      await api(`/api/schools/${schoolId}/my-results/${paperId}`, {
        body: { action: 'flag', answer_mark_id: g.flag.answerMarkId, reason: why },
      })
      setOpen(false)
      await reload()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }
  return (
    <li className="rounded-2xl border border-slate-200 dark:border-slate-700" data-testid="grid-row">
      <details>
        <summary className="flex min-h-14 cursor-pointer items-center gap-3 px-3 py-2">
          <span className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${full ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200' : g.lossKind === 'writing_habit' ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200' : g.lossKind === 'knowledge_gap' ? 'bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-200' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'}`}>
            {g.questionNo}
          </span>
          <span className={`min-w-0 flex-1 truncate text-base ${strong}`}>{g.text}</span>
          <span className={`text-base font-bold ${strong}`}>
            {g.marks ?? '—'}/{g.maxMarks}
          </span>
          <ChevronDown aria-hidden="true" className="size-4 shrink-0 text-slate-400" />
        </summary>
        <div className="space-y-2 border-t border-slate-100 px-3 py-3 dark:border-slate-800">
          {g.steps.length > 0 ? (
            <div>
              <p className={`text-sm font-semibold ${muted}`}>{t('perStep')}</p>
              <ul className="mt-1 space-y-1">
                {g.steps.map((s) => (
                  <li key={s.no} className={`flex items-center justify-between text-base ${strong}`}>
                    <span>{s.description}</span>
                    <span className={s.awarded >= s.max ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-700 dark:text-amber-300'}>
                      {s.awarded}/{s.max}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {g.reason ? <p className={`text-base ${muted}`}>{g.reason}</p> : null}
          {g.habit ? <Pill tone="amber">{t(habitKey(g.habit as HabitCode))}</Pill> : null}
          {canFlag && g.flag?.dispute ? (
            <p className={`rounded-xl bg-slate-50 p-3 text-base dark:bg-slate-800 ${strong}`}>
              {g.flag.dispute.reason}
              {g.flag.dispute.aiReply ? ` — ${g.flag.dispute.aiReply}` : ''}
            </p>
          ) : null}
          {canFlag && g.flag?.canFlag ? (
            open ? (
              <div className="space-y-2">
                {error ? <p className="text-base text-red-700 dark:text-red-300">{error}</p> : null}
                <textarea
                  value={why}
                  rows={3}
                  maxLength={500}
                  onChange={(e) => setWhy(e.target.value)}
                  className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-base dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                />
                <button type="button" className={solidBtn()} disabled={busy || why.trim().length < 5} onClick={() => void flag()}>
                  {t('save')}
                </button>
              </div>
            ) : (
              <button type="button" className={ghostBtn()} onClick={() => setOpen(true)}>
                <Flag aria-hidden="true" className="size-4" /> {t('flag')}
              </button>
            )
          ) : null}
        </div>
      </details>
    </li>
  )
}

export function ShareButtons({ schoolId, lang, t, child }: { schoolId: string; lang: Lang; t: T; child: string | null }) {
  const q = new URLSearchParams({ lang })
  if (child) q.set('child', child)
  async function whatsapp() {
    const r = await api<{ text: string }>(`/api/schools/${schoolId}/progress/summary?${q.toString()}&format=text`)
    window.open(`https://wa.me/?text=${encodeURIComponent(r.text)}`, '_blank', 'noopener')
  }
  return (
    <div className="flex flex-wrap gap-2" data-testid="share">
      <a className={ghostBtn()} href={`/api/schools/${schoolId}/progress/summary?${q.toString()}&format=pdf`} target="_blank" rel="noreferrer" data-testid="parent-pdf">
        <Printer aria-hidden="true" className="size-4" /> {t('parentPdf')}
      </a>
      <button type="button" className={ghostBtn()} onClick={() => void whatsapp()} data-testid="whatsapp">
        <Share2 aria-hidden="true" className="size-4" /> {t('shareWhatsApp')}
      </button>
    </div>
  )
}

const NEXT: Array<{ id: string; k: Key }> = [
  { id: 'read_carefully', k: 'next_read_carefully' },
  { id: 'show_steps', k: 'next_show_steps' },
  { id: 'write_more', k: 'next_write_more' },
  { id: 'revise_topic', k: 'next_revise_topic' },
  { id: 'manage_time', k: 'next_manage_time' },
]

/** The optional three questions after an exam. Kept for the Holistic Progress Card export; used for nothing else. */
export function Reflection({
  schoolId,
  paperId,
  questions,
  t,
}: {
  schoolId: string
  paperId: string
  questions: Array<{ questionNo: string; text: string }>
  t: T
}) {
  const url = `/api/schools/${schoolId}/progress/reflection`
  const [hardest, setHardest] = useState('')
  const [next, setNext] = useState('')
  const [feeling, setFeeling] = useState(0)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    void api<{ reflection: { hardest: string | null; nextTime: string | null; feeling: number | null } | null }>(`${url}?paper=${paperId}`)
      .then((r) => {
        if (r.reflection) {
          setHardest(r.reflection.hardest ?? '')
          setNext(r.reflection.nextTime ?? '')
          setFeeling(r.reflection.feeling ?? 0)
          setSaved(true)
        }
      })
      .catch(() => undefined)
  }, [url, paperId])
  async function save() {
    setError(null)
    try {
      await api(url, { body: { paper_id: paperId, hardest: hardest || null, next_time: next || null, feeling: feeling || null } })
      setSaved(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    }
  }
  const sel =
    'mt-1 block min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-base text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100'
  return (
    <PCard title={t('reflection')} testId="reflection">
      <p className={`mb-3 text-sm ${muted}`}>{t('optional')}</p>
      {error ? <p className="mb-2 text-base text-red-700 dark:text-red-300">{error}</p> : null}
      <div className="space-y-3">
        <label className={`block text-base font-semibold ${strong}`}>
          {t('hardest')}
          <select value={hardest} onChange={(e) => { setHardest(e.target.value); setSaved(false) }} className={sel}>
            <option value="">—</option>
            {questions.map((q) => (
              <option key={q.questionNo} value={q.questionNo}>
                {q.questionNo}. {q.text.slice(0, 50)}
              </option>
            ))}
          </select>
        </label>
        <label className={`block text-base font-semibold ${strong}`}>
          {t('nextTime')}
          <select value={next} onChange={(e) => { setNext(e.target.value); setSaved(false) }} className={sel}>
            <option value="">—</option>
            {NEXT.map((n) => (
              <option key={n.id} value={n.id}>
                {t(n.k)}
              </option>
            ))}
          </select>
        </label>
        <div>
          <p className={`text-base font-semibold ${strong}`}>{t('feeling')}</p>
          <div className="mt-1 grid grid-cols-3 gap-2" role="group" aria-label={t('feeling')}>
            {([['feelHard', 1], ['feelOk', 2], ['feelGood', 3]] as const).map(([k, v]) => (
              <button
                key={v}
                type="button"
                aria-pressed={feeling === v}
                onClick={() => { setFeeling(v); setSaved(false) }}
                className={`min-h-11 rounded-xl border text-base font-semibold ${feeling === v ? 'border-emerald-600 bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100' : 'border-slate-300 text-slate-700 dark:border-slate-600 dark:text-slate-200'}`}
              >
                {t(k)}
              </button>
            ))}
          </div>
        </div>
        <button type="button" className={solidBtn()} onClick={() => void save()} disabled={saved}>
          {saved ? t('saved') : t('save')}
        </button>
      </div>
    </PCard>
  )
}
