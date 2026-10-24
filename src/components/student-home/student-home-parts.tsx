/* eslint-disable @typescript-eslint/no-unnecessary-condition -- the home response may come from an older server build: every contract field is read defensively so a missing one renders nothing instead of crashing */
import { useState } from 'react'
import { ArrowRight, Check, Coins, Flame, Play, Trophy } from 'lucide-react'
import { Button, buttonVariants } from '../ui/button'
import { MasteryRing } from '../mastery-ring'
import { ChevronIcon, SubjectChapters } from '../adaptive-overview'
import type { AdaptiveOverviewData, SubjectView } from '../adaptive-overview'
import { ShareMasteryButton } from '../share-mastery-button'
import type { StudentHomeData } from '../../lib/student-home-types'
import {
  FIRST_RUN_COPY,
  biggerSlice,
  donutArcs,
  examChipText,
  firstNotDoneIndex,
  fixItButtonLabel,
  isFirstRun,
  leaderboardLine,
  mapLine,
  missionHeadline,
  missionProgress,
  missionSteps,
  paperScoreText,
  paperStoryLine,
} from '../../lib/student-home-view'
import type { MapCause } from '../../lib/student-home-view'

const heroClass = 'relative overflow-hidden rounded-3xl p-6 sm:p-8'
const heroStyle = {
  background: 'var(--grad-soft)',
  boxShadow: 'inset 0 1px 0 rgb(255 255 255 / 0.6), 0 12px 32px -16px var(--glow)',
} as const

const card =
  'bg-card border-border rounded-3xl border p-5 shadow-[0_1px_0_var(--highlight)_inset,0_14px_34px_-24px_var(--glow)] sm:p-6'

function ProgressRing({ pct, label }: { pct: number; label: string }) {
  const r = 26
  const c = 2 * Math.PI * r
  return (
    <svg width="68" height="68" viewBox="0 0 68 68" role="img" aria-label={`${label} steps done today`}>
      <circle cx="34" cy="34" r={r} fill="none" strokeWidth="7" className="text-muted stroke-current" />
      <circle
        cx="34"
        cy="34"
        r={r}
        fill="none"
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct / 100)}
        transform="rotate(-90 34 34)"
        className="text-primary stroke-current motion-safe:transition-[stroke-dashoffset] motion-safe:duration-500"
      />
      <text x="34" y="39" textAnchor="middle" className="fill-current text-[15px] font-extrabold">
        {label.split(' ')[0]}
      </text>
    </svg>
  )
}

function StepCheck({ done }: { done: boolean }) {
  return (
    <span
      className={`flex size-7 shrink-0 items-center justify-center rounded-full border-2 ${done ? 'border-transparent bg-[var(--good)] text-white' : 'border-border bg-background'}`}
      aria-hidden="true"
    >
      {done && <Check className="size-4" strokeWidth={3} />}
    </span>
  )
}

/** Today's mission: three steps, the first one still to do carries the big button. */
export function MissionCard({ home }: { home: StudentHomeData }) {
  const steps = missionSteps(home.mission)
  const progress = missionProgress(home.mission)
  const nextIdx = firstNotDoneIndex(steps)
  const firstRun = isFirstRun(home.mission, home.marks_story)
  const chip = examChipText(home.exam)
  const subline = firstRun ? FIRST_RUN_COPY : missionHeadline(home.mission)
  return (
    <section className={heroClass} style={heroStyle} aria-labelledby="mission-title">
      <div className="relative flex items-center gap-4">
        <ProgressRing pct={progress.pct} label={progress.label} />
        <div className="min-w-0">
          <p className="field-label">{progress.label} done</p>
          <h2 id="mission-title" className="display-title text-3xl leading-tight">
            Today’s mission
          </h2>
          <p className="text-small text-muted-foreground mt-1">{subline}</p>
        </div>
      </div>
      {steps.length > 0 && (
        <ol className="relative mt-5 space-y-2">
          {steps.map((s, i) => {
            const isNext = i === nextIdx
            return (
              <li key={s.key}>
                <a
                  href={s.href}
                  aria-label={`${s.label}${s.hint ? `, ${s.hint}` : ''}${s.done ? ', done' : ''}`}
                  className={`bg-card/80 focus-visible:ring-ring flex min-h-11 items-center gap-3 rounded-2xl border p-3 outline-none focus-visible:ring-[3px] ${isNext ? 'border-primary' : 'border-border'}`}
                >
                  <StepCheck done={s.done} />
                  <span className="min-w-0 flex-1">
                    <span className={`block font-semibold ${s.done ? 'text-muted-foreground' : ''}`}>{s.label}</span>
                    {s.hint && <span className="text-caption text-muted-foreground block truncate">{s.hint}</span>}
                  </span>
                  {isNext ? (
                    <span className={buttonVariants({ variant: 'pop', size: 'lg' })}>
                      Start
                      <ArrowRight />
                    </span>
                  ) : (
                    <ArrowRight className="text-muted-foreground size-5 shrink-0" aria-hidden="true" />
                  )}
                </a>
              </li>
            )
          })}
        </ol>
      )}
      {chip && (
        <a
          href="/plan"
          className="bg-background/70 border-border text-caption focus-visible:ring-ring relative mt-4 inline-flex min-h-11 items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-semibold outline-none focus-visible:ring-[3px]"
        >
          {chip}
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </a>
      )}
      {!chip && (
        <a
          href="/settings#my-exams"
          className="text-caption text-muted-foreground focus-visible:ring-ring relative mt-3 inline-flex min-h-11 items-center underline outline-none focus-visible:ring-[3px]"
        >
          Set your exam date
        </a>
      )}
    </section>
  )
}

/** Two small tiles: marks won back this week and the Fix-it Deck. */
export function HomeTiles({ home }: { home: StudentHomeData }) {
  const wonTotal = home.won_back?.total ?? 0
  const items = (home.won_back?.items ?? []).slice(0, 3)
  const due = home.fixit?.due ?? 0
  const answered = home.fixit?.answered_today ?? 0
  const mastered = home.fixit?.mastered_total ?? 0
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <section className={card} aria-labelledby="won-back-title">
        <p id="won-back-title" className="field-label">Marks won back</p>
        {wonTotal > 0 ? (
          <>
            <p className="display-title mt-1 text-4xl font-extrabold tabular-nums">+{wonTotal}</p>
            <p className="text-caption text-muted-foreground">this week</p>
            <ul className="text-small mt-2 space-y-0.5">
              {items.map((it) => (
                <li key={`${it.subject_name}-${it.concept_name}`} className="truncate">
                  <span className="font-semibold tabular-nums">+{it.marks_back}</span> {it.concept_name}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-body text-muted-foreground mt-2">Your first win will show up here.</p>
        )}
      </section>
      <section className={`${card} flex flex-col`} aria-labelledby="fixit-title">
        <p id="fixit-title" className="field-label">Fix-it Deck</p>
        <p className="display-title mt-1 text-4xl font-extrabold tabular-nums">{due}</p>
        <p className="text-caption text-muted-foreground">card{due === 1 ? '' : 's'} due</p>
        <p className="text-small text-muted-foreground mt-2">
          {answered} answered today · {mastered} mastered
        </p>
        <div className="mt-auto pt-3">
          {due > 0 ? (
            <a href="/fix-it" className={buttonVariants({ variant: 'default', size: 'lg', className: 'w-full' })}>
              {fixItButtonLabel(due)}
            </a>
          ) : (
            <p className="text-small font-semibold">{fixItButtonLabel(due)}</p>
          )}
        </div>
      </section>
    </div>
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
        <Button className="min-h-11">Continue</Button>
      </a>
    </section>
  )
}

const CAUSE_COLOR: Record<MapCause, string> = { knowledge: 'var(--chart-1)', habit: 'var(--chart-5)' }
const CAUSE_LABEL: Record<MapCause, string> = {
  knowledge: 'Did not know it',
  habit: 'Knew it, did not write it fully',
}

/** Where her marks went over the last 30 days: a ring with two causes, each opens its concepts. */
export function MarkMap({ home }: { home: StudentHomeData }) {
  const [open, setOpen] = useState<MapCause | null>(null)
  const story = home.marks_story
  const k = home.mark_map?.knowledge
  const h = home.mark_map?.habit
  const kTotal = k?.total ?? 0
  const hTotal = h?.total ?? 0
  const latest = story && (
    <div className="border-border mt-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t pt-3">
      <div className="min-w-0">
        <p className="text-small font-semibold">
          {story.scored} of {story.total} marks <span className="text-muted-foreground font-medium">in {story.title}</span>
        </p>
        <p className="text-small text-muted-foreground">{paperStoryLine(story.lost_knowledge, story.lost_habit)}</p>
      </div>
      <a
        href={`/attempt/${story.attempt_id}`}
        className="text-small text-primary inline-flex min-h-11 items-center underline-offset-4 hover:underline"
      >
        See my answers
      </a>
    </div>
  )
  if (kTotal + hTotal === 0) {
    return (
      <section className={card}>
        <p className="field-label">Mark Map</p>
        <h2 className="text-h3 mt-1">Your first marked paper will show it here</h2>
        <p className="text-small text-muted-foreground mt-1 max-w-lg">
          For every lost mark PrepPlan tells you if you did not know it, or knew it and did not write it fully.
        </p>
        {latest}
      </section>
    )
  }
  const R = 44
  const arcs = donutArcs(kTotal, hTotal, R)
  const line = mapLine(kTotal, hTotal)
  const big = biggerSlice(kTotal, hTotal)
  const toggle = (c: MapCause) => setOpen((cur) => (cur === c ? null : c))
  const concepts = open ? ((open === 'knowledge' ? k?.concepts : h?.concepts) ?? []).slice(0, 5) : []
  return (
    <section className={card} aria-labelledby="mark-map-title">
      <p className="field-label">Mark Map</p>
      <h2 id="mark-map-title" className="text-h3 mt-1">
        Where your marks went, last 30 days
      </h2>
      <div className="mt-4 flex flex-wrap items-center gap-5">
        <svg width="132" height="132" viewBox="0 0 120 120" role="img" aria-label={`${kTotal} marks lost because you did not know it, ${hTotal} because you knew it but did not write it fully`} className="shrink-0">
          <g transform="rotate(-90 60 60)">
            <circle cx="60" cy="60" r={R} fill="none" strokeWidth="16" className="text-muted stroke-current" />
            {arcs.map((a) => (
              <circle
                key={a.cause}
                cx="60"
                cy="60"
                r={R}
                fill="none"
                strokeWidth={open === a.cause ? 20 : 16}
                stroke={CAUSE_COLOR[a.cause]}
                strokeDasharray={a.dasharray}
                strokeDashoffset={a.dashoffset}
                className="cursor-pointer motion-safe:transition-[stroke-width] motion-safe:duration-200"
                onClick={() => toggle(a.cause)}
              />
            ))}
          </g>
          <text x="60" y="58" textAnchor="middle" className="fill-current text-[26px] font-extrabold">
            {kTotal + hTotal}
          </text>
          <text x="60" y="71" textAnchor="middle" className="fill-current text-[10px]">
            marks to
          </text>
          <text x="60" y="82" textAnchor="middle" className="fill-current text-[10px]">
            win back
          </text>
        </svg>
        <ul className="min-w-0 flex-1 space-y-2">
          {(['knowledge', 'habit'] as const).map((c) => {
            const total = c === 'knowledge' ? kTotal : hTotal
            return (
              <li key={c}>
                <button
                  type="button"
                  aria-expanded={open === c}
                  aria-controls={`mark-map-${c}`}
                  onClick={() => toggle(c)}
                  className={`hover:bg-muted/40 focus-visible:ring-ring flex min-h-11 w-full items-center gap-2 rounded-xl border px-3 py-2 text-left outline-none focus-visible:ring-[3px] ${open === c ? 'border-primary' : 'border-border'}`}
                >
                  <span className="size-3 shrink-0 rounded-full" style={{ background: CAUSE_COLOR[c] }} aria-hidden="true" />
                  <span className="text-small min-w-0 flex-1">{CAUSE_LABEL[c]}</span>
                  <span className="font-semibold tabular-nums">{total}</span>
                  <ChevronIcon open={open === c} />
                </button>
              </li>
            )
          })}
        </ul>
      </div>
      {big && <p className="text-body mt-4">{line}</p>}
      {open && (
        <div id={`mark-map-${open}`} className="mt-3 space-y-2">
          <p className="text-small font-semibold">{CAUSE_LABEL[open]}</p>
          {concepts.length === 0 && <p className="text-small text-muted-foreground">No concepts to list yet.</p>}
          {concepts.map((c) => (
            <div key={c.concept_id} className="border-border flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3">
              <div className="min-w-0">
                <p className="truncate font-semibold">{c.concept_name}</p>
                <p className="text-caption text-muted-foreground">
                  {c.subject_name} · {c.marks_lost} mark{c.marks_lost === 1 ? '' : 's'}
                </p>
              </div>
              <a href="/fix-it" aria-label={`Practise ${c.concept_name} in the Fix-it Deck`} className={buttonVariants({ variant: 'outline', size: 'sm', className: 'min-h-11' })}>
                Practise this
              </a>
            </div>
          ))}
        </div>
      )}
      {latest}
    </section>
  )
}

/** Recent marked papers, newest first; hidden when there are none. */
export function RecentPapers({ papers }: { papers: StudentHomeData['recent_papers'] | undefined }) {
  const list = Array.isArray(papers) ? papers.slice(0, 3) : []
  if (list.length === 0) return null
  return (
    <section className={card} aria-labelledby="recent-papers-title">
      <div className="flex items-center justify-between gap-3">
        <h2 id="recent-papers-title" className="text-h3">Recent papers</h2>
        <a href="/papers-attempted" className="text-small text-primary inline-flex min-h-11 items-center underline-offset-4 hover:underline">
          See all papers
        </a>
      </div>
      <ul className="mt-1">
        {list.map((p) => (
          <li key={p.attempt_id}>
            <a href={`/attempt/${p.attempt_id}`} className="hover:bg-muted/40 focus-visible:ring-ring flex min-h-11 items-center justify-between gap-3 rounded-xl px-2 py-2 outline-none focus-visible:ring-[3px]">
              <span className="min-w-0 truncate">{paperScoreText(p)}</span>
              <ArrowRight className="text-muted-foreground size-4 shrink-0" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
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

/** Class standing (or an invitation to join) and the coins chip with its Rewards link. */
export function LeaderboardCard({ home }: { home: StudentHomeData }) {
  const lb = home.leaderboard
  const line = leaderboardLine(lb)
  const top = (lb?.top ?? []).slice(0, 3)
  return (
    <section className={card} aria-labelledby="leaderboard-title">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <h2 id="leaderboard-title" className="flex items-center gap-2 font-semibold whitespace-nowrap">
          <Trophy className="size-5 text-[var(--chart-3)]" aria-hidden="true" /> Class leaderboard
        </h2>
        <a
          href="/rewards"
          className="bg-background/70 border-border focus-visible:ring-ring inline-flex min-h-11 items-center gap-1.5 rounded-full border px-3 whitespace-nowrap outline-none focus-visible:ring-[3px]"
        >
          <Coins className="size-4 text-[var(--chart-3)]" aria-hidden="true" />
          <span className="font-semibold tabular-nums">{home.coins ?? 0}</span>
          <span className="text-caption text-muted-foreground">coins · Rewards</span>
        </a>
      </div>
      {lb?.opted_in ? (
        <>
          {line && <p className="text-body mt-3 font-semibold">{line}</p>}
          {top.length > 0 && (
            <ol className="text-small mt-2 space-y-1">
              {top.map((t, i) => (
                <li key={`${i}-${t.display_name}`} className="flex justify-between gap-3">
                  <span className={`truncate ${t.is_you ? 'font-semibold' : ''}`}>
                    {i + 1}. {t.display_name}
                    {t.is_you ? ' (you)' : ''}
                  </span>
                  <span className="tabular-nums">{t.points} points</span>
                </li>
              ))}
            </ol>
          )}
          <a href="/leaderboard" className="text-small text-primary mt-1 inline-flex min-h-11 items-center underline-offset-4 hover:underline">
            See everyone
          </a>
        </>
      ) : (
        <>
          <p className="text-body mt-3 font-semibold">Join the class leaderboard</p>
          <p className="text-small text-muted-foreground mt-1">
            Only your first name and your points are shown to your class. You choose whether to join.
          </p>
          <a href="/leaderboard" className="text-small text-primary mt-1 inline-flex min-h-11 items-center underline-offset-4 hover:underline">
            See how it works
          </a>
        </>
      )}
      <p className="text-caption text-muted-foreground mt-1">{home.points ?? 0} points earned from correct answers.</p>
    </section>
  )
}

/** The secondary way to share: her chapter progress as plain text. */
export function ShareCard({ name, subjects }: { name: string; subjects: Array<SubjectView> }) {
  return (
    <section className={`${card} flex flex-wrap items-center justify-between gap-3 !p-4`}>
      <p className="text-small text-muted-foreground">You choose what is sent.</p>
      <ShareMasteryButton studentName={name} subjects={subjects} label="Send chapter progress as text" />
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
