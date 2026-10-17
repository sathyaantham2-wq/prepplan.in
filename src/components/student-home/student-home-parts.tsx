import { useState } from 'react'
import type { ReactNode } from 'react'
import { ArrowRight, Coins, Flame, Play, Trophy } from 'lucide-react'
import { Button } from '../ui/button'
import { MasteryRing } from '../mastery-ring'
import { ChevronIcon, SubjectChapters, VideoLink } from '../adaptive-overview'
import type { AdaptiveOverviewData, SubjectView } from '../adaptive-overview'
import { ShareMasteryButton } from '../share-mastery-button'

/** Numbers from GET /api/students/me/home. */
export interface StudentHomeData {
  week: Array<{ day: string; active: boolean }>
  points: number
  coins: number
  papers_this_week: number
  in_progress: { attempt_id: string; title: string; answered: number; total: number } | null
  marks_story: {
    attempt_id: string
    title: string
    total: number
    scored: number
    lost_knowledge: number
    lost_habit: number
  } | null
}

const heroClass = 'relative overflow-hidden rounded-3xl p-6 sm:p-8'
const heroStyle = {
  background: 'var(--grad-soft)',
  boxShadow: 'inset 0 1px 0 rgb(255 255 255 / 0.6), 0 12px 32px -16px var(--glow)',
} as const

const card =
  'bg-card border-border rounded-3xl border p-5 shadow-[0_1px_0_var(--highlight)_inset,0_14px_34px_-24px_var(--glow)] sm:p-6'

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="bg-background/70 border-border text-caption rounded-full border px-2.5 py-1 font-semibold backdrop-blur">
      {children}
    </span>
  )
}

/** A fanned stack of sheets, drawn once, quietly behind the Today card. */
function SheetsArt() {
  return (
    <svg
      className="pointer-events-none absolute -right-6 -bottom-6 hidden h-56 w-56 opacity-80 sm:block"
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden="true"
    >
      <g transform="rotate(10 100 100)">
        <rect x="40" y="30" width="110" height="140" rx="12" fill="var(--p-pink)" opacity="0.7" transform="rotate(-10 95 100)" />
        <rect x="46" y="28" width="110" height="140" rx="12" fill="var(--p-yellow)" opacity="0.85" transform="rotate(-3 100 100)" />
        <rect x="54" y="26" width="110" height="140" rx="12" fill="var(--card)" stroke="var(--border)" />
        <rect x="68" y="46" width="48" height="8" rx="4" fill="var(--primary)" opacity="0.8" />
        <rect x="68" y="66" width="78" height="6" rx="3" fill="var(--border)" />
        <rect x="68" y="82" width="70" height="6" rx="3" fill="var(--border)" />
        <rect x="68" y="98" width="52" height="6" rx="3" fill="var(--border)" />
        <path d="M68 124 q10 -10 20 0 t20 0" stroke="var(--bad)" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  )
}

/** The one thing to do today: the recommended concept and a single big button. */
export function TodayCard({ next }: { next: AdaptiveOverviewData['recommended_next'] }) {
  if (!next) {
    return (
      <section className={heroClass} style={heroStyle}>
        <p className="field-label">Today</p>
        <h2 className="display-title mt-1 text-3xl leading-tight">Make your first paper</h2>
        <p className="text-body text-muted-foreground mt-2 max-w-md">
          Pick a subject and chapters, and PrepPlan builds a paper from your syllabus.
        </p>
        <a href="/my-paper" className="mt-5 inline-block">
          <Button variant="pop" size="lg">
            Make a paper
          </Button>
        </a>
      </section>
    )
  }
  return (
    <section className={heroClass} style={heroStyle}>
      <SheetsArt />
      <p className="field-label relative">Today</p>
      <h2 className="display-title relative mt-1 max-w-xl text-3xl leading-[1.1] sm:text-[2.4rem]">{next.concept_name}</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        <Chip>{next.subject_name}</Chip>
        <Chip>{next.chapter_name}</Chip>
        <Chip>{next.is_initial_assessment ? 'Easy assessment' : `${next.recommended_difficulty} questions`}</Chip>
      </div>
      <p className="text-small text-muted-foreground mt-3 max-w-md">
        {next.is_initial_assessment
          ? 'A short Easy assessment so PrepPlan can find your level.'
          : next.level === 'Not started'
            ? 'You have not started this one yet.'
            : `Your level here: ${next.level}.`}
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-4">
        <a href={`/my-paper?subject=${next.subject_id}`}>
          <Button variant="pop" size="lg">
            {next.is_initial_assessment ? 'Take my first assessment' : 'Start today’s practice'}
            <ArrowRight />
          </Button>
        </a>
        {!next.is_initial_assessment && <VideoLink url={next.video_url} title={next.video_title} />}
      </div>
    </section>
  )
}

/** A half-done paper, with how far she got. */
export function ContinueCard({ item }: { item: NonNullable<StudentHomeData['in_progress']> }) {
  const pct = item.total > 0 ? Math.round((item.answered / item.total) * 100) : 0
  return (
    <section className={`${card} flex flex-wrap items-center gap-4`}>
      <div className="bg-accent text-accent-foreground flex size-11 shrink-0 items-center justify-center rounded-2xl">
        <Play className="size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="field-label">Pick up where you left off</p>
        <p className="truncate font-semibold">{item.title}</p>
        <div className="mt-2 flex items-center gap-3">
          <div className="bg-muted h-2 flex-1 overflow-hidden rounded-full" role="img" aria-label={`${pct}% answered`}>
            <div className="bar-grad h-full rounded-full" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-caption text-muted-foreground tabular-nums">
            {item.answered}/{item.total} answered
          </span>
        </div>
      </div>
      <a href={`/attempt/${item.attempt_id}`}>
        <Button>Continue</Button>
      </a>
    </section>
  )
}

function Legend({ color, label, value }: { color: string; label: string; value: number }) {
  return (
    <li className="flex items-center gap-1.5">
      <span className="size-2.5 rounded-full" style={{ background: color }} />
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold tabular-nums">{value}</span>
    </li>
  )
}

/** Where the marks of her latest marked paper went: scored, lost to knowledge, lost to habit. */
export function MarksStory({ story }: { story: StudentHomeData['marks_story'] }) {
  if (!story) {
    return (
      <section className={card}>
        <p className="field-label">Where my marks went</p>
        <h2 className="text-h3 mt-1">Your first marked paper will show it here</h2>
        <p className="text-small text-muted-foreground mt-1 max-w-lg">
          For every lost mark PrepPlan tells you if you did not know it, or knew it and did not write it fully.
        </p>
      </section>
    )
  }
  const { total, scored, lost_knowledge: gap, lost_habit: habit } = story
  const pct = (n: number) => `${Math.max(0, Math.min(100, (n / total) * 100))}%`
  const line =
    gap === 0 && habit === 0
      ? 'Full marks. You knew it and you delivered it.'
      : habit >= gap
        ? `You knew more than this paper shows: ${habit} mark${habit === 1 ? '' : 's'} went on how you wrote it, such as stopping early or skipping steps.`
        : `${gap} mark${gap === 1 ? '' : 's'} came from ideas that are not solid yet. Today’s practice goes there first.`
  return (
    <section className={card}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <p className="field-label">Where my marks went</p>
          <h2 className="text-h3 mt-1">
            {scored} of {total} marks <span className="text-muted-foreground font-medium">in {story.title}</span>
          </h2>
        </div>
        <a href={`/attempt/${story.attempt_id}`} className="text-small text-primary underline-offset-4 hover:underline">
          See my answers
        </a>
      </div>
      <div
        className="mt-4 flex h-4 overflow-hidden rounded-full"
        role="img"
        aria-label={`${scored} scored, ${gap} lost to knowledge gaps, ${habit} lost to delivery habits`}
      >
        <div style={{ width: pct(scored), background: 'var(--good)' }} />
        <div style={{ width: pct(gap), background: 'var(--chart-1)' }} />
        <div style={{ width: pct(habit), background: 'var(--chart-5)' }} />
      </div>
      <ul className="text-small mt-3 flex flex-wrap gap-x-5 gap-y-1">
        <Legend color="var(--good)" label="Scored" value={scored} />
        <Legend color="var(--chart-1)" label="Did not know it" value={gap} />
        <Legend color="var(--chart-5)" label="Knew it, did not deliver" value={habit} />
      </ul>
      <p className="text-body mt-3">{line}</p>
    </section>
  )
}

function dotColor(m: number | null): string {
  if (m === null) return 'var(--muted)'
  if (m >= 75) return 'var(--good)'
  if (m >= 40) return 'var(--chart-3)'
  return 'var(--chart-2)'
}

/** One card per subject: a ring, progress, the chapter to look at, and the chapter details on tap. */
export function SubjectCards({ subjects }: { subjects: Array<SubjectView> }) {
  const [open, setOpen] = useState<string | null>(null)
  if (subjects.length === 0) return null
  return (
    <section>
      <h2 className="text-h3 mb-3">Your subjects</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {subjects.map((s) => {
          const isOpen = open === s.subject_id
          const assessed = s.chapters.filter((c) => c.average_mastery !== null)
          const weakest =
            assessed.length > 1
              ? [...assessed].sort((a, b) => (a.average_mastery ?? 0) - (b.average_mastery ?? 0))[0]
              : null
          return (
            <div key={s.subject_id} className={`${card} ${isOpen ? 'sm:col-span-2' : ''} !p-0`}>
              <button
                type="button"
                disabled={!s.has_content}
                aria-expanded={s.has_content ? isOpen : undefined}
                onClick={() => setOpen(isOpen ? null : s.subject_id)}
                className="hover:bg-muted/40 flex w-full items-center gap-4 rounded-3xl p-5 text-left disabled:cursor-default disabled:hover:bg-transparent"
              >
                <span className="shrink-0 [&>span>span]:hidden">
                  <MasteryRing percent={s.average_mastery ?? 0} label="" size={72} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{s.subject_name}</p>
                  <p className="text-small text-muted-foreground">
                    {s.has_content
                      ? `${s.concepts_assessed} of ${s.concepts_total} concepts started`
                      : 'Practice papers coming soon'}
                  </p>
                  {s.has_content && (
                    <div className="mt-2 flex flex-wrap items-center gap-1" aria-hidden="true">
                      {s.chapters.map((c) => (
                        <span
                          key={c.chapter_id}
                          title={c.chapter_name}
                          className="size-2.5 rounded-[4px]"
                          style={{ background: dotColor(c.average_mastery) }}
                        />
                      ))}
                    </div>
                  )}
                  {weakest && <p className="text-caption text-muted-foreground mt-2">Take a look: {weakest.chapter_name}</p>}
                </div>
                {s.has_content && <ChevronIcon open={isOpen} />}
              </button>
              {s.has_content && isOpen && <SubjectChapters subject={s} />}
            </div>
          )
        })}
      </div>
    </section>
  )
}

const DAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

/** The week at a glance: seven dots, today ringed, and the streak. */
export function WeekCard({ home, streak, className = '' }: { home: StudentHomeData | null; streak: number; className?: string }) {
  const todayKey = new Date().toISOString().slice(0, 10)
  return (
    <section className={`${card} ${className}`}>
      <div className="flex items-center gap-2">
        <Flame className="size-5 text-[var(--chart-5)]" />
        <p className="font-semibold">{streak > 0 ? `${streak} day streak` : 'Start a streak today'}</p>
      </div>
      <div className="mt-4 flex justify-between gap-1" aria-label="Practice this week">
        {(home?.week ?? []).map((d) => (
          <div key={d.day} className="flex flex-col items-center gap-1.5">
            <span
              className={`size-8 rounded-full border-2 ${d.active ? 'border-transparent' : 'border-border'} ${d.day === todayKey ? 'ring-primary ring-2 ring-offset-2 ring-offset-[var(--card)]' : ''}`}
              style={d.active ? { background: 'var(--chart-4)' } : undefined}
              title={`${d.day}${d.active ? ': practised' : ''}`}
            />
            <span className="text-caption text-muted-foreground">
              {DAY_LETTERS[new Date(`${d.day}T00:00:00Z`).getUTCDay()]}
            </span>
          </div>
        ))}
      </div>
      {home && (
        <p className="text-caption text-muted-foreground mt-3">
          {home.papers_this_week} paper{home.papers_this_week === 1 ? '' : 's'} submitted in the last 7 days.
        </p>
      )}
    </section>
  )
}

export function RewardsCard({ home }: { home: StudentHomeData | null }) {
  return (
    <section className={card}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Coins className="size-5 text-[var(--chart-3)]" />
          <span className="display-title text-2xl font-extrabold tabular-nums">{home?.coins ?? 0}</span>
          <span className="text-small text-muted-foreground">coins</span>
        </div>
        <a href="/leaderboard" className="text-small text-primary inline-flex items-center gap-1 underline-offset-4 hover:underline">
          <Trophy className="size-4" /> Leaderboard
        </a>
      </div>
      <p className="text-caption text-muted-foreground mt-2">{home?.points ?? 0} points earned from correct answers.</p>
    </section>
  )
}

export function ShareCard({ name, subjects }: { name: string; subjects: Array<SubjectView> }) {
  return (
    <section className={card}>
      <p className="font-semibold">Share my progress</p>
      <p className="text-small text-muted-foreground mt-1">Send your chapter progress to a parent. You choose what is sent.</p>
      <div className="mt-3">
        <ShareMasteryButton studentName={name} subjects={subjects} />
      </div>
    </section>
  )
}

/** Concepts to revise and concepts that need practice, as two short action rows. */
export function NextActions({ data }: { data: AdaptiveOverviewData }) {
  const needs = data.needs_improvement.length
  const due = data.retention_due.length
  if (needs === 0 && due === 0) return null
  return (
    <section className={`${card} space-y-3`}>
      {needs > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-body">
            <span className="font-semibold">{needs} concept{needs === 1 ? '' : 's'}</span> could use more practice. They get more questions in your next paper.
          </p>
          <a href="/needs-improvement">
            <Button size="sm" variant="outline">
              See them
            </Button>
          </a>
        </div>
      )}
      {due > 0 && (
        <p className="text-body">
          <span className="font-semibold">Time to revise:</span> {data.retention_due.map((c) => c.concept_name).join(', ')}.
        </p>
      )}
    </section>
  )
}
