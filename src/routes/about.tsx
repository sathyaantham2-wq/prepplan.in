import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ThemeToggle } from '../components/theme-toggle'
import { SUPPORT_EMAIL } from '../lib/legal'

// Public "what is PrepPlan and why" page (owner request 2026-10-16, no F-number). Readable signed
// in or out. Only claims what CLAUDE.md states is loaded; no counts, ratings or testimonials.
export const Route = createFileRoute('/about')({
  head: () => ({
    meta: [
      { title: 'About PrepPlan · Know why every mark was lost' },
      {
        name: 'description',
        content:
          'PrepPlan makes syllabus-exact practice papers, marks every answer question by question, and shows which lost marks were a knowledge gap and which were a delivery habit.',
      },
    ],
  }),
  component: AboutPage,
})

const btnPrimary =
  'bg-primary !text-primary-foreground inline-flex min-h-12 items-center justify-center rounded-full px-7 text-[0.95rem] font-semibold no-underline shadow-[0_4px_0_0_var(--edge),0_16px_28px_-12px_var(--glow)] transition-transform hover:-translate-y-0.5 active:translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none'
const btnQuiet =
  '!text-foreground border-border bg-card inline-flex min-h-12 items-center justify-center rounded-full border px-6 text-[0.95rem] font-semibold no-underline transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none'
const wrap = 'mx-auto w-full max-w-5xl px-4'
const eyebrow = 'field-label text-primary mb-3 block'

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 no-underline" aria-label="PrepPlan home">
      <div className="grad-surface flex size-[36px] shrink-0 items-center justify-center rounded-[11px]">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M22 10 12 5 2 10l10 5 10-5Z" />
          <path d="M6 12v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" />
        </svg>
      </div>
      <div className="display-title text-h3 text-foreground leading-tight">
        Prep<span className="grad-text">Plan</span>
      </div>
    </Link>
  )
}

/* ---------- Hero: a floating stack of exam sheets (CSS 3D) ---------- */

function TopSheetArt() {
  return (
    <svg viewBox="0 0 252 328" aria-hidden="true">
      <rect x="22" y="26" width="96" height="11" rx="5.5" fill="var(--ink-blue)" opacity="0.85" />
      <rect x="196" y="24" width="34" height="14" rx="7" fill="var(--p-yellow)" stroke="var(--border)" />
      {[66, 96, 126, 156, 186, 216].map((y, i) => (
        <rect key={y} x="22" y={y} width={[208, 188, 200, 170, 196, 120][i]} height="8" rx="4" fill="var(--muted-foreground)" opacity="0.3" />
      ))}
      {/* knowledge gap: a wrong working, crossed out */}
      <path d="M18 100 C 70 90, 130 112, 214 100" stroke="var(--bad)" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M18 106 C 80 98, 140 116, 214 106" stroke="var(--bad)" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.6" />
      {/* delivery habit: the answer stops short */}
      <path d="M124 218 v18" stroke="var(--bad)" strokeWidth="3" strokeLinecap="round" />
      <path d="M136 222 H 206" stroke="var(--muted-foreground)" strokeWidth="2.5" strokeDasharray="2 7" strokeLinecap="round" opacity="0.6" />
      {/* connectors */}
      <path d="M214 103 C 250 100, 268 78, 300 52" stroke="var(--ink-blue)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <circle cx="214" cy="103" r="3.5" fill="var(--bad)" />
      <path d="M124 236 C 110 270, 60 290, 6 292" stroke="var(--ink-blue)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <circle cx="124" cy="236" r="3.5" fill="var(--bad)" />
    </svg>
  )
}

function SheetStack() {
  const tints = ['var(--p-blue)', 'var(--p-pink)', 'var(--p-mint)', 'transparent']
  return (
    <div className="about-float">
      <div className="about-rig">
        <div className="about-floor" aria-hidden="true" />
        {tints.map((t, i) => (
          <div key={i} className="about-sheet" style={{ '--i': i, '--tint': t } as CSSProperties}>
            {i === 3 ? <TopSheetArt /> : null}
          </div>
        ))}
        <div
          className="about-chip3d"
          style={{ '--tone': 'var(--p-blue)', '--z': '150px', right: 'clamp(-38%, calc((100vw - var(--w)) * -0.12 - 8px), -12%)', top: '-2%' } as CSSProperties}
        >
          <span className="size-2.5 rounded-full" style={{ background: 'var(--ink-blue)' }} aria-hidden="true" />
          Knowledge gap
        </div>
        <div
          className="about-chip3d"
          style={{ '--tone': 'var(--p-peach)', '--z': '100px', left: 'clamp(-40%, calc((100vw - var(--w)) * -0.14 - 4px), -14%)', bottom: '4%', animationDelay: '-2.4s' } as CSSProperties}
        >
          <span className="size-2.5 rounded-full" style={{ background: 'var(--bad)' }} aria-hidden="true" />
          Delivery habit
        </div>
      </div>
    </div>
  )
}

/* ---------- Two reasons: tilting glass cards ---------- */

function PuzzleArt() {
  return (
    <svg viewBox="0 0 220 150" className="h-auto w-full max-w-[250px]" aria-hidden="true">
      <ellipse cx="104" cy="136" rx="84" ry="9" fill="var(--glow)" />
      <g stroke="var(--ink-blue)" strokeWidth="2.5" strokeLinejoin="round">
        <rect x="26" y="22" width="56" height="56" rx="10" fill="var(--p-blue)" />
        <rect x="86" y="22" width="56" height="56" rx="10" fill="var(--p-mint)" />
        <rect x="26" y="82" width="56" height="56" rx="10" fill="var(--p-pink)" />
        <circle cx="82" cy="50" r="9" fill="var(--p-blue)" />
      </g>
      <rect x="86" y="82" width="56" height="56" rx="10" fill="none" stroke="var(--ink-blue)" strokeWidth="2.5" strokeDasharray="6 7" opacity="0.6" />
      <text x="114" y="119" textAnchor="middle" fontSize="26" fontWeight="800" fill="var(--ink-blue)" opacity="0.6">?</text>
      <g transform="translate(150 6) rotate(14 28 28)" stroke="var(--ink-blue)" strokeWidth="2.5" strokeLinejoin="round">
        <rect x="0" y="0" width="56" height="56" rx="10" fill="var(--p-yellow)" />
        <circle cx="0" cy="28" r="9" fill="var(--p-yellow)" />
      </g>
    </svg>
  )
}

function PenArt() {
  return (
    <svg viewBox="0 0 220 150" className="h-auto w-full max-w-[250px]" aria-hidden="true">
      <ellipse cx="108" cy="136" rx="84" ry="9" fill="var(--glow)" />
      <rect x="14" y="18" width="192" height="108" rx="14" fill="var(--popover)" stroke="var(--border)" strokeWidth="2" />
      {[44, 74].map((y) => (
        <path key={y} d={`M32 ${y} H190`} stroke="var(--muted-foreground)" strokeWidth="3" strokeLinecap="round" opacity="0.28" />
      ))}
      <path d="M32 104 C 44 92, 54 116, 66 102 S 88 92, 98 104 S 116 114, 124 104" stroke="var(--ink-blue)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M140 104 H186" stroke="var(--muted-foreground)" strokeWidth="3" strokeDasharray="1 9" strokeLinecap="round" opacity="0.6" />
      <g transform="rotate(38 148 60)">
        <rect x="136" y="2" width="20" height="62" rx="8" fill="var(--p-peach)" stroke="var(--ink-blue)" strokeWidth="2.5" />
        <rect x="136" y="2" width="20" height="14" rx="6" fill="var(--p-pink)" stroke="var(--ink-blue)" strokeWidth="2.5" />
        <path d="M137 64 L146 84 L155 64 Z" fill="var(--p-yellow)" stroke="var(--ink-blue)" strokeWidth="2.5" strokeLinejoin="round" />
      </g>
      <circle cx="128" cy="104" r="5" fill="var(--bad)" opacity="0.85" />
    </svg>
  )
}

function TiltCard({ children, tone }: { children: React.ReactNode; tone: string }) {
  const ref = useRef<HTMLDivElement>(null)
  function move(e: ReactPointerEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    el.style.setProperty('--ry', String((x - 0.5) * 14))
    el.style.setProperty('--rx', String((0.5 - y) * 12))
    el.style.setProperty('--mx', `${x * 100}%`)
    el.style.setProperty('--my', `${y * 100}%`)
  }
  function reset() {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--ry', '0')
    el.style.setProperty('--rx', '0')
  }
  return (
    <div className="[perspective:1000px]">
      <div
        ref={ref}
        onPointerMove={move}
        onPointerLeave={reset}
        onPointerCancel={reset}
        className="about-tilt glass border-border rounded-[28px] border p-7 shadow-[0_30px_60px_-34px_var(--glow)] [touch-action:pan-y]"
        style={{ backgroundImage: `linear-gradient(150deg, color-mix(in oklab, ${tone} 70%, transparent), transparent 70%)` }}
      >
        <div className="about-spec" aria-hidden="true" />
        {children}
      </div>
    </div>
  )
}

/* ---------- Three steps: isometric tiles joined by a self-drawing path ---------- */

function IsoTile({ kind, tone }: { kind: 'paper' | 'pencil' | 'lens'; tone: string }) {
  return (
    <svg viewBox="0 0 160 140" className="h-auto w-[150px] sm:w-[168px]" aria-hidden="true">
      <ellipse cx="80" cy="118" rx="64" ry="14" fill="var(--glow)" />
      <polygon points="11,55 80,95 80,117 11,77" style={{ fill: `color-mix(in oklab, ${tone} 70%, var(--ink-blue))` }} />
      <polygon points="149,55 80,95 80,117 149,77" style={{ fill: `color-mix(in oklab, ${tone} 85%, var(--ink-blue))`, opacity: 0.85 }} />
      <polygon points="80,15 149,55 80,95 11,55" style={{ fill: tone }} stroke="var(--ink-blue)" strokeOpacity="0.5" strokeWidth="1.5" strokeLinejoin="round" />
      <g transform="translate(80 55) matrix(0.866 0.5 -0.866 0.5 0 0)" stroke="var(--ink-blue)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        {kind === 'paper' ? (
          <g>
            <rect x="-22" y="-30" width="44" height="60" rx="5" fill="var(--popover)" />
            <path d="M-13 -16H13M-13 -6H13M-13 4H13M-13 14H2" fill="none" strokeWidth="3.5" opacity="0.7" />
          </g>
        ) : null}
        {kind === 'pencil' ? (
          <g transform="rotate(-38)">
            <rect x="-40" y="-8" width="12" height="16" rx="3" fill="var(--p-pink)" />
            <rect x="-28" y="-8" width="46" height="16" fill="var(--p-yellow)" />
            <polygon points="18,-8 40,0 18,8" fill="var(--popover)" />
            <polygon points="33,-3 40,0 33,3" fill="var(--ink-blue)" />
          </g>
        ) : null}
        {kind === 'lens' ? (
          <g>
            <path d="M10 10 L30 30" strokeWidth="7" fill="none" />
            <circle cx="-6" cy="-6" r="20" fill="var(--popover)" strokeWidth="4.5" />
            <path d="M-14 -6 l6 7 12 -14" fill="none" stroke="var(--good)" strokeWidth="4.5" />
          </g>
        ) : null}
      </g>
    </svg>
  )
}

function Connector({ delay }: { delay: string }) {
  const d = { '--d': delay } as CSSProperties
  return (
    <>
      <svg viewBox="0 0 96 40" className="mt-16 hidden h-10 w-24 shrink-0 lg:block" fill="none" aria-hidden="true" style={d}>
        <path d="M2 24 C 26 -6, 62 50, 90 16" pathLength={1} className="about-draw" stroke="var(--ink-blue)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M82 12 L91 15 L86 24" pathLength={1} className="about-draw" stroke="var(--ink-blue)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <svg viewBox="0 0 40 64" className="h-16 w-10 shrink-0 lg:hidden" fill="none" aria-hidden="true" style={d}>
        <path d="M20 2 C 2 18, 38 40, 20 58" pathLength={1} className="about-draw" stroke="var(--ink-blue)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M13 50 L20 60 L28 51" pathLength={1} className="about-draw" stroke="var(--ink-blue)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </>
  )
}

const steps = [
  { kind: 'paper' as const, tone: 'var(--p-blue)', title: 'Take a paper', line: 'Built from your syllabus.' },
  { kind: 'pencil' as const, tone: 'var(--p-yellow)', title: 'Write it your way', line: 'On screen or on paper.' },
  { kind: 'lens' as const, tone: 'var(--p-mint)', title: 'See why', line: 'Every lost mark gets a reason.' },
]

function Steps() {
  const ref = useRef<HTMLOListElement>(null)
  const [drawn, setDrawn] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
      setDrawn(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setDrawn(true)
          io.disconnect()
        }
      },
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <ol
      ref={ref}
      className={`mt-12 flex flex-col items-center lg:flex-row lg:items-start lg:justify-between ${drawn ? 'about-drawn' : ''}`}
    >
      {steps.flatMap((s, i) => {
        const item = (
          <li key={s.title} className="flex flex-col items-center text-center">
            <div className="about-iso" style={{ '--d': `${i * -1.7}s` } as CSSProperties}>
              <IsoTile kind={s.kind} tone={s.tone} />
            </div>
            <h3 className="text-h3 mt-2">
              <span className="sr-only">Step {i + 1}: </span>
              {s.title}
            </h3>
            <p className="text-muted-foreground mt-1">{s.line}</p>
          </li>
        )
        return i < steps.length - 1 ? [item, <Connector key={`c${i}`} delay={`${0.2 + i * 1.0}s`} />] : [item]
      })}
    </ol>
  )
}

/* ---------- What is inside: floating glass chips ---------- */

const subjects = [
  { name: 'Mathematics', note: 'Classes 6 to 12', tone: 'var(--p-blue)', r: -12 },
  { name: 'Science', note: 'Classes 6 to 9', tone: 'var(--p-mint)', r: 8 },
  { name: 'Social Science', note: 'Classes 6 to 9', tone: 'var(--p-pink)', r: -6 },
  { name: 'Geography', note: 'Class 10', tone: 'var(--p-yellow)', r: 10 },
  { name: 'Indian Polity', note: 'UPSC Civil Services Prelims', tone: 'var(--p-peach)', r: -9 },
]

function AboutPage() {
  const stageRef = useRef<HTMLDivElement>(null)
  function heroMove(e: ReactPointerEvent<HTMLElement>) {
    const el = stageRef.current
    if (!el || prefersReducedMotion()) return
    const r = e.currentTarget.getBoundingClientRect()
    const x = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - 0.5) * 2))
    const y = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - 0.5) * 2))
    el.style.setProperty('--tx', x.toFixed(3))
    el.style.setProperty('--ty', y.toFixed(3))
  }
  function heroLeave() {
    stageRef.current?.style.setProperty('--tx', '0')
    stageRef.current?.style.setProperty('--ty', '0')
  }

  return (
    <div className="text-foreground relative min-h-screen overflow-x-clip scroll-smooth">
      <div className="about-grain" aria-hidden="true" />
      {/* gradient mesh */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(46% 34% at 12% 8%, var(--p-blue), transparent 70%), radial-gradient(40% 30% at 92% 12%, var(--p-pink), transparent 70%), radial-gradient(40% 28% at 70% 38%, var(--p-yellow), transparent 70%), radial-gradient(44% 26% at 10% 62%, var(--p-mint), transparent 70%), radial-gradient(40% 24% at 90% 82%, var(--p-peach), transparent 70%)',
          opacity: 0.75,
        }}
      />
      <a
        href="#main"
        className="bg-primary text-primary-foreground sr-only z-50 rounded-md px-3 py-2 focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Skip to content
      </a>

      <header className="glass border-border sticky top-0 z-40 border-b">
        <div className={`${wrap} flex h-14 items-center justify-between gap-2`}>
          <Logo />
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Link to="/" className={`${btnPrimary} !min-h-9 !px-4`}>
              Sign in
            </Link>
          </div>
        </div>
      </header>

      <main id="main" className="relative z-[2]">
        {/* 1. Hero */}
        <section
          onPointerMove={heroMove}
          onPointerLeave={heroLeave}
          className={`${wrap} grid items-center gap-6 pt-10 pb-16 sm:pt-16 md:grid-cols-[1.05fr_1fr] md:gap-4 md:pb-24`}
        >
          <div className="rise-in text-center md:text-left">
            <h1 className="display-title text-[2.6rem] leading-[1.02] sm:text-6xl lg:text-7xl">
              Did she not know it, or{' '}
              <span className="grad-text">stop writing too early?</span>
            </h1>
            <p className="text-muted-foreground mx-auto mt-6 max-w-md text-lg leading-relaxed md:mx-0">
              PrepPlan marks every answer and tells you the real reason behind each lost mark.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:justify-start">
              <Link to="/" className={btnPrimary}>
                Get started
              </Link>
              <Link to="/" className={btnQuiet}>
                Sign in
              </Link>
            </div>
          </div>
          <div ref={stageRef} className="about-stage rise-in" role="img" aria-label="A floating stack of exam sheets with a knowledge gap and a delivery habit marked on the top sheet">
            <SheetStack />
          </div>
        </section>

        {/* 2. Two reasons */}
        <section className={`${wrap} py-16 sm:py-24`}>
          <div className="text-center">
            <span className={eyebrow}>A lost mark has two possible causes</span>
            <h2 className="display-title text-4xl sm:text-5xl">Two reasons, one answer</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <TiltCard tone="var(--p-blue)">
              <div className="about-pop flex flex-col items-center text-center">
                <PuzzleArt />
                <h3 className="text-h2 mt-4">Knowledge gap</h3>
                <p className="text-muted-foreground mt-1.5 max-w-xs">She did not know it, so back to the chapter.</p>
              </div>
            </TiltCard>
            <TiltCard tone="var(--p-peach)">
              <div className="about-pop flex flex-col items-center text-center">
                <PenArt />
                <h3 className="text-h2 mt-4">Delivery habit</h3>
                <p className="text-muted-foreground mt-1.5 max-w-xs">She knew it, but stopped a line short.</p>
              </div>
            </TiltCard>
          </div>
        </section>

        {/* 3. Three steps */}
        <section className={`${wrap} py-16 sm:py-24`}>
          <div className="text-center">
            <span className={eyebrow}>How it works</span>
            <h2 className="display-title text-4xl sm:text-5xl">Three steps</h2>
          </div>
          <Steps />
        </section>

        {/* 4. What is inside */}
        <section className={`${wrap} py-16 sm:py-24`}>
          <div className="text-center">
            <span className={eyebrow}>CBSE, NCERT-based</span>
            <h2 className="display-title text-4xl sm:text-5xl">What is inside</h2>
          </div>
          <ul className="mt-14 flex flex-wrap justify-center gap-x-6 gap-y-8 [perspective:900px]" aria-label="Subjects available">
            {subjects.map((s, i) => (
              <li key={s.name} className="about-iso" style={{ '--d': `${i * -1.3}s` } as CSSProperties}>
                <div
                  className="glass border-border rounded-3xl border px-6 py-4 text-center"
                  style={
                    {
                      backgroundImage: `linear-gradient(145deg, color-mix(in oklab, ${s.tone} 85%, transparent), color-mix(in oklab, ${s.tone} 25%, transparent))`,
                      transform: `rotateX(10deg) rotateY(${s.r}deg)`,
                      boxShadow:
                        'inset 0 1px 0 var(--highlight), 0 4px 0 0 color-mix(in oklab, var(--foreground) 14%, transparent), 0 30px 36px -18px var(--glow), 0 12px 16px -10px rgb(30 30 60 / 0.25)',
                    }
                  }
                >
                  <div className="text-h3">{s.name}</div>
                  <div className="text-small text-muted-foreground mt-0.5">{s.note}</div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* 5. Closing */}
        <section className="relative overflow-hidden py-12 sm:py-20">
          <div className={`${wrap} relative flex min-h-[440px] flex-col items-center justify-center text-center sm:min-h-[640px]`}>
            <div className="about-orb" aria-hidden="true" />
            <h2 className="display-title relative max-w-lg text-4xl sm:text-5xl">Find out why the marks went.</h2>
            <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to="/" className={btnPrimary}>
                Get started
              </Link>
              <Link to="/" className={btnQuiet}>
                Sign in
              </Link>
            </div>
            <p className="relative mt-5 text-sm font-medium">No ads. Your data is never sold.</p>
          </div>
        </section>
      </main>

      <footer className="border-border glass relative z-[2] border-t">
        <div className={`${wrap} text-muted-foreground flex flex-wrap items-center justify-between gap-3 py-5 text-sm`}>
          <span>PrepPlan</span>
          <span className="flex flex-wrap gap-x-5 gap-y-1">
            <Link to="/privacy" className="hover:underline">Privacy policy</Link>
            <Link to="/" className="hover:underline">Sign in</Link>
            <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:underline">{SUPPORT_EMAIL}</a>
          </span>
        </div>
      </footer>
    </div>
  )
}
