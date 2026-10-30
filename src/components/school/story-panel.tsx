import { useCallback, useEffect, useRef, useState } from 'react'
import type { KeyboardEvent, PointerEvent } from 'react'
import {
  BookOpenCheck,
  FileCheck2,
  Pause,
  Play,
  ShieldCheck,
} from 'lucide-react'
import { Brand } from './auth-shell'

// The left panel of the school sign-in: the product told in three steps, with an answer sheet that
// floats and tilts toward the mouse. CSS 3D and small inline drawings only (styles under .story- in
// styles.css): nothing here is fetched, so it never holds up the sign-in form, and the first paint is
// already the finished first step. With "reduce motion" on, there is no auto-play and no tilt.
// On a phone it is a short strip with a swipeable carousel, so the form stays in view.

const HEADLINE = 'Exams that show what each student needs next.'
const STEP_MS = 5000

const STEPS = [
  {
    title: 'Make the paper',
    text: "Chapter-exact papers from the NCERT textbook, in your school's own marks pattern. Download as Word or PDF, edit freely.",
    alt: 'Illustration: a question paper with sections and marks, ready as Word or PDF.',
  },
  {
    title: 'Correct with AI',
    text: "Upload each student's answer sheets. AI marks every answer step by step. Teachers check only the answers AI flags.",
    alt: 'Illustration: a handwritten answer with ticks and one flag, marked 3 out of 5. The two lost marks are labelled Knowledge gap minus 1 and Writing habit minus 1.',
  },
  {
    title: 'Know every student',
    text: 'For each student: strengths, topics to fix, and marks lost to writing habits (a missing step, a missing unit, stopping early), not just a total.',
    alt: 'Illustration: a student report with a small bar chart of topics, one a strength and one to fix, and a note about a missing unit.',
  },
] as const

const TRUST = [
  { icon: BookOpenCheck, text: 'CBSE / NCERT aligned' },
  { icon: FileCheck2, text: 'Works with your own question papers' },
  {
    icon: ShieldCheck,
    text: 'Student data used only for your school, never for advertising or AI training',
  },
] as const

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)')
    const read = () => setReduced(m.matches)
    read()
    m.addEventListener('change', read)
    return () => m.removeEventListener('change', read)
  }, [])
  return reduced
}

function PaperScene() {
  return (
    <div className="story-paper">
      <div className="text-center">
        <p className="text-[13px] font-bold tracking-wide text-slate-800">
          HALF-YEARLY EXAMINATION
        </p>
        <p className="text-xs text-slate-500">Class 7 · Mathematics</p>
      </div>
      <p className="mt-1.5 border-t border-slate-300 pt-1.5 text-center text-xs font-bold text-slate-700">
        SECTION A
      </p>
      {[
        ['1.', 'w-[78%]', '[1]'],
        ['2.', 'w-[64%]', '[1]'],
      ].map(([n, w, m]) => (
        <div key={n} className="story-qline">
          <span>{n}</span>
          <i className={w} />
          <b>{m}</b>
        </div>
      ))}
      <p className="mt-1 text-center text-xs font-bold text-slate-700">
        SECTION B
      </p>
      {[
        ['3.', 'w-[84%]', '[3]'],
        ['4.', 'w-[70%]', '[3]'],
      ].map(([n, w, m]) => (
        <div key={n} className="story-qline">
          <span>{n}</span>
          <i className={w} />
          <b>{m}</b>
        </div>
      ))}
      <div className="mt-auto flex justify-end gap-1.5 pt-1">
        <span className="story-pill">Word</span>
        <span className="story-pill">PDF</span>
      </div>
    </div>
  )
}

function Tick() {
  return (
    <svg viewBox="0 0 20 20" className="size-4 shrink-0" aria-hidden="true">
      <path
        d="M3 11l5 5L17 4"
        fill="none"
        stroke="#047857"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Flag() {
  return (
    <svg viewBox="0 0 20 20" className="size-4 shrink-0" aria-hidden="true">
      <path
        d="M5 2v16"
        stroke="#b45309"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M5 3h10l-2.5 3.5L15 10H5z" fill="#f59e0b" />
    </svg>
  )
}

function AnswerScene() {
  return (
    <div className="story-paper">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs leading-snug text-slate-600">
          <b className="text-slate-800">Q7.</b> A car goes 150 km in 3 hours.
          How long for 300 km?
        </p>
        <span className="story-badge">3/5</span>
      </div>
      <div className="story-hand mt-1">
        <p>
          Speed = 150 ÷ 3 = 50 <Tick />
        </p>
        <p>
          Time = 300 ÷ 50 <Tick />
        </p>
        <p>
          = 6 <Flag />
        </p>
      </div>
      <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
        <span className="story-chip story-chip-a">Knowledge gap -1</span>
        <span className="story-chip story-chip-b">Writing habit -1</span>
      </div>
    </div>
  )
}

function ReportScene() {
  const bars = [
    ['Fractions', 'w-[88%]', 'bg-emerald-600'],
    ['Integers', 'w-[66%]', 'bg-emerald-500'],
    ['Angles', 'w-[34%]', 'bg-amber-500'],
  ] as const
  return (
    <div className="story-paper">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-bold tracking-wide text-slate-800">
          STUDENT REPORT
        </p>
        <span className="story-pill">Class 7</span>
      </div>
      <div className="mt-2 flex flex-1 flex-col justify-around">
        {bars.map(([name, w, color], i) => (
          <div
            key={name}
            className="grid grid-cols-[4rem_1fr] items-center gap-2"
          >
            <span className="text-xs text-slate-600">{name}</span>
            <span className="h-3 overflow-hidden rounded-full bg-slate-200">
              <span
                className={`story-bar block h-full rounded-full ${w} ${color}`}
                style={{ transitionDelay: `${250 + i * 120}ms` }}
              />
            </span>
          </div>
        ))}
      </div>
      <div className="mt-auto space-y-1 pt-1.5 text-xs leading-snug">
        <p className="text-emerald-800">
          <b>Strength:</b> Fractions
        </p>
        <p className="text-amber-800">
          <b>To fix:</b> Angles
        </p>
        <p className="text-slate-600">
          <b>Writing habit:</b> a missing unit
        </p>
      </div>
    </div>
  )
}

const SCENES = [PaperScene, AnswerScene, ReportScene]

export function StoryPanel() {
  const [step, setStep] = useState(0)
  const [hovering, setHovering] = useState(false)
  const [focused, setFocused] = useState(false)
  const [stopped, setStopped] = useState(false)
  const reduced = usePrefersReducedMotion()
  const root = useRef<HTMLElement | null>(null)
  const frame = useRef(0)
  const tabs = useRef<Array<HTMLButtonElement | null>>([])
  const paused = hovering || focused || stopped

  useEffect(() => {
    if (reduced || paused) return
    if (!window.matchMedia('(min-width: 1024px)').matches) return
    // an interval, not a single timeout: a hidden browser tab skips a beat and carries on when it is back
    const t = window.setInterval(() => {
      if (!document.hidden) setStep((s) => (s + 1) % STEPS.length)
    }, STEP_MS)
    return () => window.clearInterval(t)
  }, [step, paused, reduced])

  // The tilt writes two CSS numbers straight to the panel, once a frame, so moving the mouse never
  // re-renders anything.
  const move = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      if (reduced || e.pointerType === 'touch') return
      const { clientX, clientY } = e
      cancelAnimationFrame(frame.current)
      frame.current = requestAnimationFrame(() => {
        const el = root.current
        if (!el) return
        const r = el.getBoundingClientRect()
        el.style.setProperty(
          '--story-x',
          (((clientX - r.left) / r.width) * 2 - 1).toFixed(3),
        )
        el.style.setProperty(
          '--story-y',
          (((clientY - r.top) / r.height) * 2 - 1).toFixed(3),
        )
      })
    },
    [reduced],
  )
  const leave = () => {
    setHovering(false)
    cancelAnimationFrame(frame.current)
    root.current?.style.setProperty('--story-x', '0')
    root.current?.style.setProperty('--story-y', '0')
  }
  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  function onTabKey(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    const last = STEPS.length - 1
    const next =
      e.key === 'ArrowRight'
        ? i === last
          ? 0
          : i + 1
        : e.key === 'ArrowLeft'
          ? i === 0
            ? last
            : i - 1
          : e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? last
              : null
    if (next === null) return
    e.preventDefault()
    setStep(next)
    tabs.current[next]?.focus()
  }

  return (
    <>
      <aside
        ref={root}
        data-testid="story-panel"
        data-paused={paused || reduced ? 'true' : 'false'}
        onPointerEnter={(e) => {
          if (e.pointerType !== 'touch') setHovering(true)
        }}
        onPointerMove={move}
        onPointerLeave={leave}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="story-panel relative hidden min-h-screen flex-col overflow-hidden px-10 py-8 text-white lg:flex xl:px-12"
      >
        <div aria-hidden="true" className="story-glow story-glow-a" />
        <div aria-hidden="true" className="story-glow story-glow-b" />
        <div className="relative mx-auto w-full max-w-xl">
          <Brand light />
        </div>

        <div className="relative mx-auto flex w-full max-w-xl flex-1 flex-col justify-center gap-4 py-4">
          <div>
            <p className="font-display text-[clamp(1.75rem,3.9vh,2.25rem)] leading-tight font-bold tracking-tight">
              {HEADLINE}
            </p>
            <p className="mt-1.5 text-base text-emerald-50/85">
              From question paper to personal report, in one place.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div
              role="tablist"
              aria-label="How PrepPlan works, in three steps"
              className="grid flex-1 grid-cols-3 gap-1.5"
            >
              {STEPS.map((s, i) => (
                <button
                  key={s.title}
                  ref={(el) => {
                    tabs.current[i] = el
                  }}
                  id={`story-tab-${i}`}
                  type="button"
                  role="tab"
                  aria-selected={step === i}
                  aria-controls="story-tabpanel"
                  tabIndex={step === i ? 0 : -1}
                  onClick={() => setStep(i)}
                  onKeyDown={(e) => onTabKey(e, i)}
                  className="story-tab"
                >
                  <span className="story-tab-no" aria-hidden="true">
                    {i + 1}
                  </span>
                  <span className="min-w-0">
                    <span className="sr-only">Step {i + 1}: </span>
                    {s.title}
                  </span>
                  {step === i ? (
                    <span
                      key={step}
                      aria-hidden="true"
                      className="story-tab-progress"
                    />
                  ) : null}
                </button>
              ))}
            </div>
            {reduced ? null : (
              <button
                type="button"
                onClick={() => setStopped((v) => !v)}
                aria-label={
                  stopped ? 'Play the three steps' : 'Pause the three steps'
                }
                className="story-pause"
              >
                {stopped ? (
                  <Play aria-hidden="true" className="size-4" />
                ) : (
                  <Pause aria-hidden="true" className="size-4" />
                )}
              </button>
            )}
          </div>

          <div
            id="story-tabpanel"
            role="tabpanel"
            aria-labelledby={`story-tab-${step}`}
          >
            <p className="min-h-[4.5rem] text-[15px] leading-relaxed text-emerald-50/90 xl:min-h-[3rem]">
              {STEPS[step].text}
            </p>
            <div className="story-stage mt-3">
              <div aria-hidden="true" className="story-layer story-layer-1" />
              <div aria-hidden="true" className="story-layer story-layer-2" />
              <div aria-hidden="true" className="story-layer story-layer-3" />
              <div
                className="story-card"
                role="img"
                aria-label={STEPS[step].alt}
              >
                {SCENES.map((Scene, i) => (
                  <div
                    key={STEPS[i].title}
                    className="story-scene"
                    data-active={step === i}
                  >
                    <Scene />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="story-highlight">
            Every lost mark, explained: didn&apos;t know it, or didn&apos;t
            write it well?
          </p>

          <ul className="grid gap-x-4 gap-y-1.5 text-[13px] leading-snug text-emerald-50/85 xl:grid-cols-[1fr_1.25fr_2fr]">
            {TRUST.map((t) => (
              <li key={t.text} className="flex gap-2">
                <t.icon
                  aria-hidden="true"
                  className="mt-px size-4 shrink-0 text-emerald-200"
                />
                {t.text}
              </li>
            ))}
          </ul>
        </div>
      </aside>
      <StoryStrip />
    </>
  )
}

/** The phone version: a short strip, swiped by hand. It never moves on its own. */
function StoryStrip() {
  const [at, setAt] = useState(0)
  const track = useRef<HTMLDivElement | null>(null)
  const go = (i: number) => {
    const el = track.current
    if (el) el.scrollTo({ left: el.clientWidth * i })
  }
  return (
    <section
      aria-label="PrepPlan for Schools"
      data-testid="story-strip"
      className="story-panel px-4 pt-3 pb-2.5 text-white lg:hidden"
    >
      <div className="story-strip-brand mb-2">
        <Brand light />
      </div>
      <p className="font-display text-[17px] leading-snug font-bold">
        {HEADLINE}
      </p>
      <div
        ref={track}
        tabIndex={0}
        role="group"
        aria-label="Three steps. Swipe or scroll sideways."
        onScroll={(e) => {
          const el = e.currentTarget
          setAt(Math.round(el.scrollLeft / el.clientWidth))
        }}
        className="story-track mt-1.5"
      >
        {STEPS.map((s, i) => (
          <div key={s.title} className="story-slide">
            <p className="text-sm font-semibold">
              {i + 1}. {s.title}
            </p>
            <p className="text-[13px] leading-snug text-emerald-50/90">
              {s.text}
            </p>
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        {STEPS.map((s, i) => (
          <button
            key={s.title}
            type="button"
            aria-label={`Step ${i + 1}: ${s.title}`}
            aria-current={at === i ? 'step' : undefined}
            onClick={() => go(i)}
            className="story-dot"
          />
        ))}
      </div>
    </section>
  )
}
