import { useId, useRef, useState } from 'react'
import type { KeyboardEvent, ReactNode, RefObject } from 'react'
import { Button } from '../ui/button'
import { cn } from '../../lib/utils'
import {
  QUESTION_TYPE_LABELS,
  describeAskedVsPlanned,
  estimateMinutes,
  groupChaptersByPart,
  masteryPercent,
  schoolPaperLine,
  sizeText,
  subjectIconKind,
  summaryText,
  worthPractising,
} from '../../lib/paper-builder-view'
import type { BuilderQuestionType, SubjectIconKind } from '../../lib/paper-builder-view'
import { TopicSearchBox } from '../topic-search-box'
import type { BuilderChapterItem, BuilderSubject, PaperBuilderProps } from './types'

// Shared building blocks for the new paper builder (paper-builder.tsx). Presentational only.

export const cardClass =
  'bg-card border-border rounded-3xl border p-4 shadow-[0_1px_0_var(--highlight)_inset,0_14px_34px_-24px_var(--glow)] sm:p-6'

const focusRing =
  'outline-none focus-visible:ring-ring/60 focus-visible:ring-[3px]'

// ---------------------------------------------------------------------------------------------
// Roving radio keyboard (arrow keys move and select, like native radios)
// ---------------------------------------------------------------------------------------------

function useRovingRadios(count: number, current: number, select: (index: number) => void) {
  const refs = useRef<Array<HTMLButtonElement | null>>([])
  function onKeyDown(e: KeyboardEvent<HTMLElement>) {
    let next = -1
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (current + 1) % count
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (current - 1 + count) % count
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = count - 1
    if (next < 0) return
    e.preventDefault()
    select(next)
    refs.current[next]?.focus()
  }
  return { refs, onKeyDown }
}

// ---------------------------------------------------------------------------------------------
// Section wrapper with a numbered heading
// ---------------------------------------------------------------------------------------------

export function BuilderSection({
  id,
  number,
  title,
  hint,
  headingRef,
  children,
  aside,
}: {
  id: string
  number?: number
  title: string
  hint?: string
  headingRef?: RefObject<HTMLHeadingElement | null>
  children: ReactNode
  aside?: ReactNode
}) {
  return (
    <section className={cardClass} aria-labelledby={`${id}-title`}>
      <div className="mb-3 flex items-start gap-3">
        {number !== undefined && (
          <span
            aria-hidden="true"
            className="grad-surface flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-extrabold"
          >
            {number}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <h2
            id={`${id}-title`}
            ref={headingRef}
            tabIndex={headingRef ? -1 : undefined}
            className="display-title text-xl leading-tight outline-none"
          >
            {title}
          </h2>
          {hint && <p className="text-small text-muted-foreground mt-0.5">{hint}</p>}
        </div>
        {aside}
      </div>
      {children}
    </section>
  )
}

// ---------------------------------------------------------------------------------------------
// Segmented control
// ---------------------------------------------------------------------------------------------

export interface SegmentOption<T extends string | number> {
  value: T
  label: string
  sub?: string
}

export function SegmentedControl<T extends string | number>({
  label,
  options,
  value,
  onChange,
  className,
}: {
  label: string
  options: ReadonlyArray<SegmentOption<T>>
  value: T
  onChange: (value: T) => void
  className?: string
}) {
  const labelId = useId()
  const current = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  )
  const { refs, onKeyDown } = useRovingRadios(options.length, current, (i) =>
    onChange(options[i].value),
  )
  return (
    <div className={className}>
      <span id={labelId} className="sr-only">
        {label}
      </span>
      <div
        role="radiogroup"
        aria-labelledby={labelId}
        onKeyDown={onKeyDown}
        className="bg-muted/70 border-border grid auto-cols-fr grid-flow-col gap-1 rounded-2xl border p-1"
      >
        {options.map((o, i) => {
          const selected = o.value === value
          return (
            <button
              key={String(o.value)}
              ref={(el) => {
                refs.current[i] = el
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={i === current ? 0 : -1}
              onClick={() => onChange(o.value)}
              className={cn(
                'flex min-h-12 min-w-0 flex-col items-center justify-center rounded-xl px-2 py-1.5 text-center leading-tight font-bold motion-safe:transition-transform motion-safe:active:scale-[0.97]',
                focusRing,
                selected
                  ? 'bg-card text-foreground border-primary pb-pop border-2 shadow-sm'
                  : 'text-muted-foreground hover:text-foreground border-2 border-transparent',
              )}
            >
              <span className="text-body">{o.label}</span>
              {o.sub && (
                <span className="text-caption text-muted-foreground font-medium">{o.sub}</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------------------------
// Small original icons
// ---------------------------------------------------------------------------------------------

const svgProps = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

export function SubjectIcon({ kind }: { kind: SubjectIconKind }) {
  switch (kind) {
    case 'maths':
      return (
        <svg {...svgProps}>
          <path d="M7 3.5v7M3.5 7h7" />
          <path d="M14 7h6.5" />
          <path d="m14.5 14.5 6 6m0-6-6 6" />
          <path d="M3.5 18h7" />
          <circle cx="7" cy="14.8" r="0.6" />
          <circle cx="7" cy="21" r="0.6" />
        </svg>
      )
    case 'science':
      return (
        <svg {...svgProps}>
          <path d="M9 3h6" />
          <path d="M10 3v6.2L4.8 18.5A2 2 0 0 0 6.6 21.5h10.8a2 2 0 0 0 1.8-3L14 9.2V3" />
          <path d="M7.4 15h9.2" />
        </svg>
      )
    case 'social':
      return (
        <svg {...svgProps}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3c3.2 3.6 3.2 14.4 0 18" />
          <path d="M12 3c-3.2 3.6-3.2 14.4 0 18" />
        </svg>
      )
    case 'english':
      return (
        <svg {...svgProps}>
          <path d="M4 5h16v11H9.5L5 20v-4H4Z" />
          <path d="M8 9h8M8 12.2h5" />
        </svg>
      )
    case 'hindi':
      return (
        <svg {...svgProps}>
          <path d="M3.5 7h17" />
          <path d="M14 7v13" />
          <path d="M14 12.5c-3.6-3.2-7.6.6-4.4 3.6 1.9 1.8 4.4.6 4.4-3.6Z" />
        </svg>
      )
    case 'telugu':
      return (
        <svg {...svgProps}>
          <path d="M5.5 5.5c2.2-2 10.8-2 13 0" />
          <path d="M8 9c0-3 7-3 7 0.2 0 3.2-7 3-7 6.3 0 3.4 8 3.6 8-0.8" />
        </svg>
      )
    default:
      return (
        <svg {...svgProps}>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
        </svg>
      )
  }
}

export function TinyRing({
  percent,
  size = 28,
  children,
}: {
  percent: number | null
  size?: number
  children?: ReactNode
}) {
  const stroke = 3
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true" className="absolute inset-0">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="text-border stroke-current" />
        {percent !== null && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - percent / 100)}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            className="text-primary stroke-current"
          />
        )}
      </svg>
      {children}
    </span>
  )
}

// ---------------------------------------------------------------------------------------------
// Subject chips
// ---------------------------------------------------------------------------------------------

export function SubjectChips({
  subjects,
  value,
  onChange,
  label = 'Subject',
}: {
  subjects: Array<BuilderSubject>
  value: string
  onChange: (id: string) => void
  label?: string
}) {
  const labelId = useId()
  const current = Math.max(
    0,
    subjects.findIndex((s) => s.id === value),
  )
  const { refs, onKeyDown } = useRovingRadios(subjects.length, current, (i) => onChange(subjects[i].id))
  return (
    <div>
      <span id={labelId} className="sr-only">
        {label}
      </span>
      <div role="radiogroup" aria-labelledby={labelId} onKeyDown={onKeyDown} className="flex flex-wrap gap-2">
        {subjects.map((s, i) => {
          const selected = s.id === value
          const pct = masteryPercent(s.mastery)
          return (
            <button
              key={s.id}
              ref={(el) => {
                refs.current[i] = el
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={i === current ? 0 : -1}
              onClick={() => onChange(s.id)}
              className={cn(
                'flex min-h-12 max-w-full items-center gap-2.5 rounded-2xl border-2 py-2 pr-4 pl-3 text-left font-bold motion-safe:transition-transform motion-safe:active:scale-[0.97]',
                focusRing,
                selected
                  ? 'border-primary bg-primary/10 text-foreground pb-pop'
                  : 'border-border bg-background hover:bg-muted/60',
              )}
            >
              <span
                className={cn(
                  'flex size-9 shrink-0 items-center justify-center rounded-xl',
                  selected ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground',
                )}
              >
                <SubjectIcon kind={subjectIconKind(s.name)} />
              </span>
              <span className="text-body min-w-0 leading-tight [overflow-wrap:anywhere]">{s.name}</span>
              {pct !== null && (
                <TinyRing percent={pct} size={26}>
                  <span className="sr-only">{`, mastery ${pct} percent`}</span>
                </TinyRing>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------------------------
// Chapter cards
// ---------------------------------------------------------------------------------------------

function CheckMark() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function SparkIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
    </svg>
  )
}

export function ChapterCards({
  chapters,
  selectedIds,
  query,
  onToggle,
  onSelectAll,
  onClear,
  loading,
}: {
  chapters: Array<BuilderChapterItem>
  selectedIds: Array<string>
  query: string
  onToggle: (id: string) => void
  onSelectAll: () => void
  onClear: () => void
  loading?: boolean
}) {
  const { groups, showPart } = groupChaptersByPart(chapters, query)
  const selected = new Set(selectedIds)
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span
          className="text-caption bg-primary/10 text-primary rounded-full px-3 py-1.5 font-bold"
          aria-live="polite"
        >
          {selectedIds.length} selected
        </span>
        <Button type="button" variant="outline" size="sm" className="min-h-11" onClick={onSelectAll}>
          Select all
        </Button>
        <Button type="button" variant="outline" size="sm" className="min-h-11" onClick={onClear}>
          Clear
        </Button>
      </div>
      {loading && chapters.length === 0 && (
        <p className="text-small text-muted-foreground" role="status">
          Loading chapters…
        </p>
      )}
      {!loading && groups.length === 0 && (
        <p className="text-small text-muted-foreground">
          {query.trim() ? `No chapter matches “${query.trim()}”.` : 'No chapters to show.'}
        </p>
      )}
      <div className="space-y-4">
        {groups.map((g) => (
          <div key={g.part}>
            {showPart && (
              <p className="field-label text-muted-foreground mb-2">
                Part {g.part} {'·'}{' '}
                {g.chapters.filter((c) => selected.has(c.id)).length} of {g.chapters.length} selected
              </p>
            )}
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2" role="list">
              {g.chapters.map((c) => {
                const on = selected.has(c.id)
                const pct = masteryPercent(c.mastery)
                const worth = worthPractising(c.mastery)
                return (
                  <li key={c.id}>
                    <label
                      className={cn(
                        'has-[:focus-visible]:ring-ring/60 flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border-2 p-3 has-[:focus-visible]:ring-[3px] motion-safe:transition-transform motion-safe:active:scale-[0.98]',
                        on ? 'border-primary bg-primary/10 pb-pop' : 'border-border bg-background hover:bg-muted/50',
                      )}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={on}
                        onChange={() => onToggle(c.id)}
                      />
                      <TinyRing percent={pct} size={40}>
                        <span className="text-small font-extrabold tabular-nums">{c.chapter_no}</span>
                      </TinyRing>
                      <span className="min-w-0 flex-1">
                        <span className="text-small block leading-snug font-semibold [overflow-wrap:anywhere]">
                          {c.name}
                        </span>
                        <span className="text-caption text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-0.5">
                          {showPart && <span>Part {c.part}</span>}
                          {pct !== null && <span>{pct}% mastery</span>}
                          {worth && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 font-semibold text-amber-900 dark:bg-amber-900/50 dark:text-amber-100">
                              <SparkIcon />
                              Worth practising
                            </span>
                          )}
                        </span>
                      </span>
                      <span
                        aria-hidden="true"
                        className={cn(
                          'flex size-6 shrink-0 items-center justify-center rounded-full border-2',
                          on ? 'border-transparent bg-primary text-primary-foreground' : 'border-input text-transparent',
                        )}
                      >
                        <CheckMark />
                      </span>
                    </label>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------------------------
// Sticky summary bar
// ---------------------------------------------------------------------------------------------

export function SummaryBar({
  summary,
  askedVsPlanned,
  planning,
  error,
  note,
  onReset,
  onPrimary,
  primaryLabel,
  primaryDisabled,
  primaryBusy,
  primaryRef,
  extra,
}: {
  summary: string
  askedVsPlanned: { headline: string; explanation: string } | null
  planning: boolean
  error: string | null
  // One short line saying why the primary button is disabled, when it is.
  note?: string | null
  onReset?: () => void
  onPrimary: () => void
  primaryLabel: string
  primaryDisabled: boolean
  primaryBusy: boolean
  primaryRef?: RefObject<HTMLButtonElement | null>
  extra?: ReactNode
}) {
  const [infoOpen, setInfoOpen] = useState(false)
  const infoId = useId()
  return (
    <div
      data-builder-bar
      className="no-print bg-popover border-border sticky bottom-[calc(76px+env(safe-area-inset-bottom))] z-10 mt-4 rounded-2xl border p-3 shadow-lg backdrop-blur lg:bottom-4"
    >
      {error && (
        <p className="text-small text-destructive mb-2" role="alert">
          {error}
        </p>
      )}
      <div className="flex flex-col gap-2">
        <div className="min-w-0">
          <p className="text-small font-semibold [overflow-wrap:anywhere]" aria-live="polite">
            {summary}
          </p>
          <div className="flex flex-wrap items-center gap-x-2">
            {planning && (
              <p className="text-caption text-muted-foreground" role="status">
                Planning your paper{'…'}
              </p>
            )}
            {!planning && note && <p className="text-caption text-muted-foreground">{note}</p>}
            {askedVsPlanned && (
              <button
                type="button"
                aria-expanded={infoOpen}
                aria-controls={infoId}
                onClick={() => setInfoOpen((o) => !o)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setInfoOpen(false)
                }}
                className={cn(
                  'text-caption text-primary -my-2 inline-flex min-h-11 items-center gap-1 font-semibold underline-offset-2 hover:underline',
                  focusRing,
                )}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 11v5M12 8h.01" />
                </svg>
                {askedVsPlanned.headline}
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 [&>button:last-child]:flex-1 lg:justify-end lg:[&>button:last-child]:max-w-xs">
          {onReset && (
            <Button type="button" variant="outline" size="lg" className="min-h-12" onClick={onReset}>
              Reset
            </Button>
          )}
          {extra}
          <Button
            ref={primaryRef}
            type="button"
            size="lg"
            className="min-h-12"
            disabled={primaryDisabled}
            onClick={onPrimary}
          >
            {primaryBusy ? 'Getting your paper ready…' : primaryLabel}
          </Button>
        </div>
      </div>
      {askedVsPlanned && infoOpen && (
        <p
          id={infoId}
          role="note"
          className="text-small bg-muted mt-2 rounded-xl p-3"
        >
          {askedVsPlanned.explanation}
        </p>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------------------------
// Derived values and the fields the builder's steps share
// ---------------------------------------------------------------------------------------------

const TYPE_ORDER: Array<BuilderQuestionType> = ['combined', 'mcq', 'written']

export function deriveBuilder(p: PaperBuilderProps) {
  const subject = p.subjects.find((s) => s.id === p.subjectId) ?? null
  const selected = new Set(p.selectedChapterIds)
  const selectedChapters = p.chapters.filter((c) => selected.has(c.id))
  const school = p.plan?.school_paper ?? null
  return {
    subject,
    selectedChapters,
    school,
    summary: summaryText({
      subjectName: subject?.name ?? null,
      chapterCount: p.selectedChapterIds.length,
      questionCount: p.questionCount,
      plan: p.plan,
    }),
    size: sizeText(p.questionCount, p.plan),
    showPart: new Set(p.chapters.map((c) => c.part)).size > 1,
    askedVsPlanned: describeAskedVsPlanned(p.questionCount, p.questionType, p.plan),
    noChapters: p.selectedChapterIds.length === 0,
  }
}

export function CountField({ p }: { p: PaperBuilderProps }) {
  return (
    <SegmentedControl
      label="How many questions"
      value={p.questionCount}
      onChange={p.onQuestionCount}
      options={p.countOptions.map((n) => ({
        value: n,
        label: String(n),
        sub: `${
          n === p.questionCount && p.plan && !p.plan.school_paper
            ? p.plan.estimated_minutes
            : estimateMinutes(n, p.questionType)
        } min`,
      }))}
    />
  )
}

export function TypeField({ p }: { p: PaperBuilderProps }) {
  const school = p.plan?.school_paper ?? null
  if (school) {
    return (
      <div className="bg-muted/60 rounded-2xl p-3">
        <p className="text-body font-bold">{schoolPaperLine(school)}</p>
        <p className="text-small text-muted-foreground mt-0.5">
          Your questions are written in the style of school exams: multiple choice, short and long
          answers, and case studies.
        </p>
      </div>
    )
  }
  return (
    <SegmentedControl
      label="Question type"
      value={p.questionType}
      onChange={p.onQuestionType}
      options={TYPE_ORDER.map((t) => ({ value: t, label: QUESTION_TYPE_LABELS[t] }))}
    />
  )
}

/** The one search box: it filters the chapter cards and, as before, suggests topics to jump to. */
export function ChapterSearch({ p }: { p: PaperBuilderProps }) {
  return (
    <TopicSearchBox
      subjects={p.topicSubjects}
      onSelect={p.onSelectTopic}
      onTextChange={p.onChapterQuery}
      label="Find a chapter or topic"
      placeholder="Try Fractions, or ch 3 science"
      className="relative mb-3"
    />
  )
}

export const chevronDown = (open: boolean) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={cn('motion-safe:transition-transform', open ? 'rotate-180' : '')}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
)
