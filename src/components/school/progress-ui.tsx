import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Moon, Sun } from 'lucide-react'
import type { Key, Lang } from '../../lib/school-i18n'
import type { Level } from '../../lib/schools/topic-level'

// The building blocks of the Progress screens (original design, owner direction 2026-10-31): soft cards, one
// growth line, three-step level meters, a two-colour "where marks went" bar and small habit bars. Everything
// is inline SVG or plain boxes with light and dark colours; no chart library.

export type T = (k: Key) => string

const THEME = 'prepplan-school-dark'

/** Dark mode for the Progress screens: remembered in this browser, put back to light when the screen is left. */
export function useDarkMode(): [boolean, () => void] {
  const [dark, setDark] = useState(false)
  useEffect(() => {
    try {
      setDark(window.localStorage.getItem(THEME) === '1')
    } catch {
      // ignore
    }
  }, [])
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    // the page behind the cards must go dark too (the school layout has a light background of its own)
    document.body.style.backgroundColor = dark ? '#0b1220' : ''
    document.documentElement.style.backgroundColor = dark ? '#0b1220' : ''
    return () => {
      document.documentElement.classList.remove('dark')
      document.body.style.backgroundColor = ''
      document.documentElement.style.backgroundColor = ''
    }
  }, [dark])
  return [
    dark,
    () => {
      const n = !dark
      setDark(n)
      try {
        window.localStorage.setItem(THEME, n ? '1' : '0')
      } catch {
        // ignore
      }
    },
  ]
}

export const cardCls =
  'rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900'
export const muted = 'text-slate-600 dark:text-slate-400'
export const strong = 'text-slate-900 dark:text-slate-100'

export function PCard({
  title,
  children,
  testId,
}: {
  title?: ReactNode
  children: ReactNode
  testId?: string
}) {
  return (
    <section className={cardCls} data-testid={testId}>
      {title ? <h2 className={`mb-2 text-lg font-bold ${strong}`}>{title}</h2> : null}
      {children}
    </section>
  )
}

export function Pill({
  children,
  tone = 'plain',
}: {
  children: ReactNode
  tone?: 'plain' | 'good' | 'amber' | 'blue' | 'bad'
}) {
  const look =
    tone === 'good'
      ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
      : tone === 'amber'
        ? 'bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-200'
        : tone === 'blue'
          ? 'bg-sky-50 text-sky-900 dark:bg-sky-950 dark:text-sky-200'
          : tone === 'bad'
            ? 'bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200'
            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-semibold ${look}`}>
      {children}
    </span>
  )
}

export function ghostBtn(extra = '') {
  return `inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 text-base font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 ${extra}`
}
export function solidBtn(extra = '') {
  return `inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 text-base font-semibold text-white hover:bg-emerald-800 disabled:opacity-60 dark:bg-emerald-600 dark:hover:bg-emerald-500 ${extra}`
}

// ---------------------------------------------------------------- header, language and dark mode

export function Who({
  name,
  grade,
  section,
  school,
}: {
  name: string
  grade: number
  section: string
  school: string
}) {
  return (
    <div className="px-1" data-testid="who">
      <p className={`font-display text-2xl leading-tight font-bold ${strong}`}>{name}</p>
      <p className={`text-base ${muted}`}>
        Class {grade} {section} · {school}
      </p>
    </div>
  )
}

export function Toggles({
  lang,
  setLang,
  dark,
  toggleDark,
  t,
}: {
  lang: Lang
  setLang: (l: Lang) => void
  dark: boolean
  toggleDark: () => void
  t: T
}) {
  return (
    <div className="flex items-center justify-between gap-2 px-1">
      <div
        role="group"
        aria-label={t('language')}
        className="inline-flex rounded-xl border border-slate-300 p-0.5 dark:border-slate-600"
      >
        {(['en', 'te'] as const).map((l) => (
          <button
            key={l}
            type="button"
            aria-pressed={lang === l}
            onClick={() => setLang(l)}
            className={`min-h-11 min-w-12 rounded-[10px] px-3 text-base font-semibold ${
              lang === l
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            {l === 'en' ? 'EN' : 'తె'}
          </button>
        ))}
      </div>
      <button
        type="button"
        aria-pressed={dark}
        onClick={toggleDark}
        className={ghostBtn()}
      >
        {dark ? <Sun aria-hidden="true" className="size-5" /> : <Moon aria-hidden="true" className="size-5" />}
        <span>{t('dark')}</span>
      </button>
    </div>
  )
}

// ---------------------------------------------------------------- charts

export function GrowthLine({
  points,
}: {
  points: Array<{ title: string; subject: string; at: string; pct: number }>
}) {
  const W = 320
  const H = 150
  const padX = 20
  const top = 18
  const bottom = 14
  if (points.length === 0) return null
  const times = points.map((p) => new Date(p.at).getTime())
  const lo = Math.min(...times)
  const hi = Math.max(...times)
  const x = (tm: number) => (hi === lo ? W / 2 : padX + ((tm - lo) / (hi - lo)) * (W - 2 * padX))
  const y = (pct: number) => top + (1 - pct / 100) * (H - top - bottom)
  const pts = points.map((p, i) => ({ ...p, x: x(times[i]), y: y(p.pct) }))
  const line = pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  const area = `${pts[0].x.toFixed(1)},${H - bottom} ${line} ${pts[pts.length - 1].x.toFixed(1)},${H - bottom}`
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={`Growth line: ${points.map((p) => `${p.title} ${p.subject} ${p.pct} percent`).join(', ')}`}
      className="w-full"
      data-testid="growth-line"
    >
      <defs>
        <linearGradient id="gl" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#059669" stopOpacity="0.28" />
          <stop offset="1" stopColor="#059669" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 50, 100].map((g) => (
        <g key={g}>
          <line x1={padX} x2={W - padX} y1={y(g)} y2={y(g)} className="stroke-slate-200 dark:stroke-slate-700" strokeDasharray="3 4" />
          <text x={2} y={y(g) + 3} className="fill-slate-500 text-[8px] dark:fill-slate-400">
            {g}
          </text>
        </g>
      ))}
      <polygon points={area} fill="url(#gl)" />
      <polyline points={line} fill="none" stroke="#059669" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {pts.map((p, i) => (
        <g key={i}>
          <title>{`${p.title}, ${p.subject}: ${p.pct}%`}</title>
          <circle cx={p.x} cy={p.y} r="4.5" className="fill-white stroke-emerald-600 dark:fill-slate-900" strokeWidth="2.5" />
          <text x={p.x} y={p.y - 8} textAnchor="middle" className="fill-slate-700 text-[9px] font-bold dark:fill-slate-200">
            {p.pct}
          </text>
        </g>
      ))}
    </svg>
  )
}

export function Ring({ value, total, size = 56 }: { value: number; total: number; size?: number }) {
  const r = size / 2 - 5
  const c = 2 * Math.PI * r
  const frac = total === 0 ? 0 : value / total
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${value} of ${total}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth="5" className="stroke-slate-200 dark:stroke-slate-700" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        strokeWidth="5"
        strokeLinecap="round"
        className="stroke-emerald-600"
        strokeDasharray={`${c * frac} ${c}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" className="fill-slate-800 text-[13px] font-bold dark:fill-slate-100">
        {value}/{total}
      </text>
    </svg>
  )
}

const LEVEL_KEY: Record<Level, Key> = {
  beginner: 'levelBeginner',
  progressing: 'levelProgressing',
  proficient: 'levelProficient',
}
export const levelKey = (l: Level) => LEVEL_KEY[l]

/** Three steps filled up to the level. */
export function LevelMeter({ level }: { level: Level | null }) {
  const n = level === 'proficient' ? 3 : level === 'progressing' ? 2 : level === 'beginner' ? 1 : 0
  const tone = ['bg-slate-300 dark:bg-slate-600', 'bg-sky-500', 'bg-amber-500', 'bg-emerald-600'][n]
  return (
    <span className="inline-flex gap-1" aria-hidden="true">
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className={`h-2.5 w-7 rounded-full ${i <= n ? tone : 'bg-slate-200 dark:bg-slate-700'}`}
        />
      ))}
    </span>
  )
}

/** "Where marks went": blue = did not know it, amber = writing habits (grey = not sure why). */
export function SplitBar({
  knowledge,
  habit,
  unclear,
  t,
}: {
  knowledge: number
  habit: number
  unclear: number
  t: T
}) {
  const total = knowledge + habit + unclear
  const seg = (n: number) => (total === 0 ? 0 : (n / total) * 100)
  return (
    <div data-testid="split-bar">
      <div
        className="flex h-5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
        role="img"
        aria-label={`${t('didntKnow')} ${knowledge}, ${t('writingHabits')} ${habit}`}
      >
        <span className="bg-sky-500" style={{ width: `${seg(knowledge)}%` }} />
        <span className="bg-amber-500" style={{ width: `${seg(habit)}%` }} />
        <span className="bg-slate-400" style={{ width: `${seg(unclear)}%` }} />
      </div>
      <ul className={`mt-2 flex flex-wrap gap-x-4 gap-y-1 text-base ${strong}`}>
        <li className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-sky-500" aria-hidden="true" />
          {t('didntKnow')}: <b>{knowledge}</b> {t('marks')}
        </li>
        <li className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-amber-500" aria-hidden="true" />
          {t('writingHabits')}: <b>{habit}</b> {t('marks')}
        </li>
        {unclear > 0 ? (
          <li className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-slate-400" aria-hidden="true" />
            {t('notSure')}: <b>{unclear}</b> {t('marks')}
          </li>
        ) : null}
      </ul>
    </div>
  )
}

export function Bars({ values, max }: { values: Array<number>; max: number }) {
  const top = Math.max(max, 1)
  return (
    <span className="inline-flex h-10 items-end gap-1" aria-hidden="true">
      {values.map((v, i) => (
        <span
          key={i}
          className={`w-3 rounded-t ${v > 0 ? 'bg-amber-500' : 'bg-slate-200 dark:bg-slate-700'}`}
          style={{ height: `${Math.max(4, (v / top) * 40)}px` }}
        />
      ))}
    </span>
  )
}

export const dayLabel = (iso: string, lang: Lang) =>
  new Date(iso).toLocaleDateString(lang === 'te' ? 'te-IN' : 'en-IN', { day: 'numeric', month: 'short' })
