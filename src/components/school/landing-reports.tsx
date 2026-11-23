import { useRef, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'

// The example reports on the public /schools page (owner request 2026-11-21): one card per kind of
// report that the school app already has, chosen with tabs. Every name and figure is made up and
// every card says "Example". Show only screens that exist in the app (student exam report, student
// progress, exam results, section progress board, exam-week board): a school must find each one
// after it joins. A school-wide marks dashboard and a section-against-section comparison do NOT
// exist yet, so they are not drawn here.

const TABS = [
  {
    id: 'student',
    label: 'Student report',
    who: 'What a student sees after each exam.',
  },
  {
    id: 'progress',
    label: 'Student progress',
    who: 'A student’s own progress, exam after exam.',
  },
  {
    id: 'results',
    label: 'Exam results',
    who: 'The subject teacher’s view of one exam.',
  },
  {
    id: 'section',
    label: 'Section',
    who: 'The class teacher’s board for a section.',
  },
  {
    id: 'principal',
    label: 'Principal',
    who: 'The principal’s and office’s exam-week board.',
  },
] as const

type TabId = (typeof TABS)[number]['id']

export function ReportGallery() {
  const [active, setActive] = useState<TabId>('student')
  const refs = useRef<Array<HTMLButtonElement | null>>([])
  const tab = TABS.find((t) => t.id === active) ?? TABS[0]

  function onKey(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!step) return
    e.preventDefault()
    const next = (i + step + TABS.length) % TABS.length
    setActive(TABS[next].id)
    refs.current[next]?.focus()
  }

  return (
    <div className="min-w-0">
      <div
        role="tablist"
        aria-label="Example reports"
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
      >
        {TABS.map((t, i) => {
          const on = t.id === active
          return (
            <button
              key={t.id}
              ref={(el) => {
                refs.current[i] = el
              }}
              id={`report-tab-${t.id}`}
              type="button"
              role="tab"
              aria-selected={on}
              aria-controls="report-panel"
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(t.id)}
              onKeyDown={(e) => onKey(e, i)}
              className={`min-h-11 shrink-0 rounded-full px-3.5 text-[14px] font-semibold whitespace-nowrap transition-colors ${
                on
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-white text-slate-700 ring-1 ring-slate-900/10 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:ring-white/10 dark:hover:bg-slate-800'
              }`}
            >
              {t.label}
            </button>
          )
        })}
      </div>
      <p className="mt-2 mb-4 text-[15px] text-slate-600 dark:text-slate-400">
        {tab.who}
      </p>
      <div
        id="report-panel"
        role="tabpanel"
        aria-labelledby={`report-tab-${tab.id}`}
      >
        {active === 'student' ? <SampleReport /> : null}
        {active === 'progress' ? <ProgressReport /> : null}
        {active === 'results' ? <ExamResults /> : null}
        {active === 'section' ? <SectionBoard /> : null}
        {active === 'principal' ? <ExamWeekBoard /> : null}
      </div>
    </div>
  )
}

const cardCls =
  'rounded-[1.75rem] bg-white p-6 shadow-xl ring-1 shadow-slate-900/10 ring-slate-900/5 sm:p-8 dark:bg-slate-900 dark:ring-white/10'

function CardHead({ title, badge }: { title: string; badge?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
          Example report
        </p>
        <p className="mt-1 text-lg font-bold">{title}</p>
      </div>
      {badge}
    </div>
  )
}

function Sub({ children }: { children: ReactNode }) {
  return (
    <p className="mt-6 mb-3 text-sm font-bold text-slate-700 dark:text-slate-300">
      {children}
    </p>
  )
}

// A drawn example of a student report. Made-up figures, labelled as an example, never a real student.
// Owner (2026-11-21): keep this card exactly as it is.
function SampleReport() {
  const topics = [
    { name: 'Large Numbers Around Us', pct: 90, tone: 'bg-emerald-500' },
    { name: 'Working with Fractions', pct: 72, tone: 'bg-emerald-500' },
    { name: 'Expressions using Letter-Numbers', pct: 45, tone: 'bg-amber-500' },
    { name: 'Parallel and Intersecting Lines', pct: 30, tone: 'bg-rose-500' },
  ]
  return (
    <figure aria-label="Example of a student report" className={cardCls}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
            Example report
          </p>
          <p className="mt-1 text-lg font-bold">
            Half-Yearly · Class 7 · Mathematics
          </p>
        </div>
        <span className="rounded-2xl bg-emerald-50 px-4 py-2 text-2xl font-bold text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
          58
          <span className="text-base text-emerald-700/70 dark:text-emerald-300/70">
            /80
          </span>
        </span>
      </div>
      <ul className="mt-6 space-y-4">
        {topics.map((t) => (
          <li key={t.name}>
            <div className="flex justify-between text-[15px]">
              <span className="font-medium">{t.name}</span>
              <span className="text-slate-500 dark:text-slate-400">
                {t.pct}%
              </span>
            </div>
            <div className="mt-1.5 h-2.5 rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className={`h-full rounded-full ${t.tone}`}
                style={{ width: `${t.pct}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-rose-50 p-4 dark:bg-rose-950/40">
          <p className="text-2xl font-bold text-rose-700 dark:text-rose-300">
            −14
          </p>
          <p className="text-sm text-rose-900/80 dark:text-rose-200/80">
            Topic not learnt
          </p>
        </div>
        <div className="rounded-2xl bg-amber-50 p-4 dark:bg-amber-950/40">
          <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">
            −8
          </p>
          <p className="text-sm text-amber-900/80 dark:text-amber-200/80">
            Writing habits: missing units, stopped early
          </p>
        </div>
      </div>
    </figure>
  )
}

// Same student as the report above: the Half-Yearly 58/80 is the 73% point.
function ProgressReport() {
  const exams = [
    { name: 'Unit Test 1', pct: 52 },
    { name: 'Unit Test 2', pct: 61 },
    { name: 'Half-Yearly', pct: 73 },
    { name: 'Unit Test 3', pct: 78 },
  ]
  const W = 320
  const H = 120
  const x = (i: number) => 36 + (i * (W - 72)) / (exams.length - 1)
  const y = (p: number) => H - 16 - ((p - 40) / 60) * (H - 36)
  const line = exams
    .map((e, i) => `${i ? 'L' : 'M'}${x(i)},${y(e.pct)}`)
    .join(' ')
  return (
    <figure
      aria-label="Example of a student's progress across exams"
      className={cardCls}
    >
      <CardHead
        title="My progress · Class 7 · Mathematics"
        badge={
          <span className="rounded-2xl bg-emerald-50 px-3 py-2 text-center text-sm leading-tight font-bold text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
            A new
            <br />
            personal best!
          </span>
        }
      />
      <Sub>How your marks are growing</Sub>
      <svg
        viewBox={`0 0 ${W} ${H + 18}`}
        className="h-auto w-full"
        role="img"
        aria-label="Marks went from 52% to 61%, 73% and 78% across four exams"
      >
        {[50, 75, 100].map((p) => (
          <line
            key={p}
            x1="16"
            x2={W - 8}
            y1={y(p)}
            y2={y(p)}
            className="stroke-slate-200 dark:stroke-slate-700"
            strokeDasharray="3 5"
          />
        ))}
        <path
          d={line}
          fill="none"
          className="stroke-emerald-500"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {exams.map((e, i) => (
          <g key={e.name}>
            <circle
              cx={x(i)}
              cy={y(e.pct)}
              r="5"
              className="fill-white stroke-emerald-600 dark:fill-slate-900"
              strokeWidth="2.5"
            />
            <text
              x={x(i)}
              y={y(e.pct) - 11}
              textAnchor="middle"
              className="fill-slate-800 text-[13px] font-bold dark:fill-slate-100"
            >
              {e.pct}%
            </text>
            <text
              x={x(i)}
              y={H + 14}
              textAnchor="middle"
              className="fill-slate-500 text-[11px] dark:fill-slate-400"
            >
              {e.name}
            </text>
          </g>
        ))}
      </svg>
      <Sub>Question by question · Half-Yearly</Sub>
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        <div className="flex shrink-0 gap-1.5" aria-label="Your pages (4)">
          {[0, 1, 2, 3].map((p) => (
            <div
              key={p}
              aria-hidden="true"
              className={`flex h-16 w-11 flex-col gap-1 rounded-md bg-slate-50 p-1.5 ring-1 ring-slate-300 dark:bg-slate-800 dark:ring-slate-600 ${p === 1 ? 'ring-2 ring-emerald-500 dark:ring-emerald-400' : ''}`}
            >
              {[80, 60, 90, 50, 70].map((w, k) => (
                <i
                  key={k}
                  className="block h-[2px] rounded bg-slate-400/60"
                  style={{ width: `${w}%` }}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="min-w-0 flex-1 text-[14px] leading-snug">
          <p className="font-bold">
            Q7 · <span className="text-amber-700 dark:text-amber-300">3/5</span>
          </p>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            Marks for each step
          </p>
          <ul className="mt-1 space-y-0.5">
            <li>✓ Found the speed: 50 km/h · 1</li>
            <li>✓ Time = 300 ÷ 50 · 2</li>
            <li className="text-amber-800 dark:text-amber-300">
              ✗ Wrote 6, not 6 hours · 0
            </li>
          </ul>
        </div>
      </div>
      <Sub>Three things to fix</Sub>
      <ol className="space-y-1.5 text-[15px]">
        <li>1. Parallel and Intersecting Lines: learn it again</li>
        <li>2. Write the unit with every answer</li>
        <li>3. Show every step in long answers</li>
      </ol>
    </figure>
  )
}

function ExamResults() {
  const chips = [
    ['108 marked', ''],
    ['4 not uploaded', 'text-amber-800 dark:text-amber-300'],
    ['Average 64%', ''],
    ['Highest 96%', ''],
    ['Lowest 21%', ''],
  ]
  const byQ = [92, 88, 81, 74, 69, 58, 47, 63, 39, 55]
  return (
    <figure
      aria-label="Example of exam results for a teacher"
      className={cardCls}
    >
      <CardHead title="Half-Yearly · Class 7 · Mathematics · Results" />
      <ul className="mt-5 flex flex-wrap gap-2">
        {chips.map(([t, c]) => (
          <li
            key={t}
            className={`rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold dark:bg-slate-800 ${c}`}
          >
            {t}
          </li>
        ))}
      </ul>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-rose-50 p-4 dark:bg-rose-950/40">
          <p className="text-2xl font-bold text-rose-700 dark:text-rose-300">
            1,240
          </p>
          <p className="text-sm text-rose-900/80 dark:text-rose-200/80">
            marks lost because the students did not know it
          </p>
        </div>
        <div className="rounded-2xl bg-amber-50 p-4 dark:bg-amber-950/40">
          <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">
            610
          </p>
          <p className="text-sm text-amber-900/80 dark:text-amber-200/80">
            marks lost because of how it was written
          </p>
        </div>
      </div>
      <Sub>By question: how the class did</Sub>
      <div
        className="flex h-32 items-end gap-1.5 sm:gap-2"
        role="img"
        aria-label="Share of marks the class got on each of questions 1 to 10"
      >
        {byQ.map((p, i) => (
          <div
            key={i}
            className="flex h-full flex-1 flex-col items-center justify-end gap-1"
          >
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              {p}
            </span>
            <div
              className={`w-full rounded-t-md ${p < 50 ? 'bg-rose-500' : p < 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
              style={{ height: `${p * 0.75}%` }}
            />
            <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
              Q{i + 1}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
        Q9 and Q7 need teaching again: most of the class lost marks there.
      </p>
    </figure>
  )
}

const LEVEL = {
  B: { cls: 'bg-rose-500', name: 'Beginner' },
  P: { cls: 'bg-amber-400', name: 'Progressing' },
  F: { cls: 'bg-emerald-500', name: 'Proficient' },
  N: { cls: 'bg-slate-200 dark:bg-slate-700', name: 'Not assessed' },
} as const

function SectionBoard() {
  const topics = [
    'Large Numbers',
    'Expres\u00adsions',
    'Fractions',
    'Lines',
    'Number Play',
  ]
  const rows: Array<[string, string]> = [
    ['Aarav', 'FPBBP'],
    ['Diya', 'FFFPF'],
    ['Kabir', 'PPFBN'],
    ['Meera', 'FBPPP'],
    ['Rohan', 'FFPFF'],
    ['Sana', 'PFFPN'],
  ]
  return (
    <figure
      aria-label="Example of a class teacher's section board"
      className={cardCls}
    >
      <CardHead title="Class progress · 7-B · Mathematics" />
      <Sub>Students who need attention this week</Sub>
      <ul className="space-y-2 text-[15px]">
        <li className="flex justify-between gap-3 rounded-xl bg-rose-50 px-3 py-2 dark:bg-rose-950/40">
          <b>Aarav</b>
          <span className="text-rose-800 dark:text-rose-200">
            Beginner in 2 topics
          </span>
        </li>
        <li className="flex justify-between gap-3 rounded-xl bg-amber-50 px-3 py-2 dark:bg-amber-950/40">
          <b>Meera</b>
          <span className="text-amber-800 dark:text-amber-200">
            down 12 points on the exam before
          </span>
        </li>
      </ul>
      <Sub>Topic levels</Sub>
      <div className="overflow-x-auto">
        <table className="w-full table-fixed border-separate border-spacing-1 text-[13px]">
          <thead>
            <tr>
              <th className="w-14 text-left align-bottom font-semibold sm:w-20 text-slate-500 dark:text-slate-400">
                Student
              </th>
              {topics.map((t) => (
                <th
                  key={t}
                  className="px-0 text-center align-bottom text-[10px] leading-tight break-words sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400"
                >
                  {t}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([name, levels]) => (
              <tr key={name}>
                <td className="w-14 truncate pr-1 font-medium sm:w-20">
                  {name}
                </td>
                {levels.split('').map((l, k) => {
                  const lv = LEVEL[l as keyof typeof LEVEL]
                  return (
                    <td key={k} className="p-0">
                      <div
                        className={`h-6 rounded-md ${lv.cls}`}
                        title={lv.name}
                      >
                        <span className="sr-only">{lv.name}</span>
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-slate-600 dark:text-slate-400">
        {Object.values(LEVEL).map((l) => (
          <li key={l.name} className="flex items-center gap-1.5">
            <span className={`size-3 rounded ${l.cls}`} aria-hidden="true" />
            {l.name}
          </li>
        ))}
      </ul>
    </figure>
  )
}

function ExamWeekBoard() {
  const totals = [
    ['Students', '1,240'],
    ['Sheets uploaded', '1,186'],
    ['AI-marked', '1,152'],
    ['Teacher to check', '34'],
  ]
  const rows: Array<[string, string, string, string, boolean]> = [
    ['7-A', '40/40', '40', '0', true],
    ['7-B', '38/40', '38', '0', true],
    ['7-C', '39/41', '35', '4', false],
    ['8-A', '42/42', '30', '12', false],
  ]
  return (
    <figure
      aria-label="Example of the principal's exam-week board"
      className={cardCls}
    >
      <CardHead title="Exam-week board · Half-Yearly" />
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {totals.map(([k, v]) => (
          <div
            key={k}
            className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800"
          >
            <p className="text-xl font-bold">{v}</p>
            <p className="text-[13px] leading-tight text-slate-600 dark:text-slate-400">
              {k}
            </p>
          </div>
        ))}
      </div>
      <Sub>Mathematics · by section</Sub>
      <table className="w-full text-[14px]">
        <thead>
          <tr className="text-left text-[12px] text-slate-500 dark:text-slate-400">
            <th className="pb-2 font-semibold">Section</th>
            <th className="pb-2 font-semibold">Uploaded</th>
            <th className="pb-2 font-semibold">AI-marked</th>
            <th className="pb-2 font-semibold">To check</th>
            <th className="pb-2 font-semibold">Results</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([s, up, ai, chk, rel]) => (
            <tr
              key={s}
              className="border-t border-slate-100 dark:border-slate-800"
            >
              <td className="py-2 font-semibold">{s}</td>
              <td className="py-2">{up}</td>
              <td className="py-2">{ai}</td>
              <td
                className={`py-2 ${chk !== '0' ? 'font-semibold text-amber-700 dark:text-amber-300' : ''}`}
              >
                {chk}
              </td>
              <td className="py-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-[12px] font-semibold ${rel ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}
                >
                  {rel ? 'Released' : 'Not released'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
        Tap any number to see the students behind it.
      </p>
    </figure>
  )
}
