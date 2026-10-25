import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { Button } from '../ui/button'
import {
  GUIDE_STEPS,
  QUESTION_TYPE_LABELS,
  builderMode,
  canGoToStep,
  generateBlockReason,
  nextBlockReason,
  nextStep,
  previousStep,
  sameChapterSet,
  schoolPaperLine,
  skipToReviewBlockReason,
  stepProgressText,
  REVIEW_STEP,
} from '../../lib/paper-builder-view'
import type { GuideStep } from '../../lib/paper-builder-view'
import {
  BuilderSection,
  ChapterCards,
  ChapterSearch,
  CountField,
  SubjectChips,
  SummaryBar,
  TypeField,
  cardClass,
  chevronDown,
  deriveBuilder,
} from './shared'
import type { PaperBuilderProps } from './types'

const heroStyle = {
  background: 'var(--grad-soft)',
  boxShadow: 'inset 0 1px 0 rgb(255 255 255 / 0.6), 0 12px 32px -16px var(--glow)',
} as const

const focusRing = 'outline-none focus-visible:ring-ring/60 focus-visible:ring-[3px]'

/** True from the `lg` breakpoint up. Starts false so server and first client render agree. */
function useIsDesktop() {
  const [desktop, setDesktop] = useState(false)
  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px)')
    const update = () => setDesktop(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return desktop
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// ---------------------------------------------------------------------------------------------
// Progress dots
// ---------------------------------------------------------------------------------------------

function StepDots({
  step,
  canGo,
  onGo,
}: {
  step: GuideStep
  canGo: (s: GuideStep) => boolean
  onGo: (s: GuideStep) => void
}) {
  return (
    <nav aria-label="Progress">
      <ol className="flex items-start">
        {GUIDE_STEPS.map((s, i) => {
          const done = i < step
          const current = i === step
          const reachable = !current && canGo(i as GuideStep)
          return (
            <li key={s.key} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
              <div className="flex w-full items-center">
                <span
                  aria-hidden="true"
                  className={`h-0.5 flex-1 ${i === 0 ? 'opacity-0' : done || current ? 'bg-primary' : 'bg-border'}`}
                />
                <button
                  type="button"
                  disabled={!reachable}
                  onClick={() => onGo(i as GuideStep)}
                  aria-current={current ? 'step' : undefined}
                  aria-label={`Step ${i + 1}: ${s.label}${current ? ', current step' : done ? ', done' : ''}`}
                  className={`flex size-11 shrink-0 items-center justify-center rounded-full border-2 text-sm font-extrabold ${focusRing} ${
                    current
                      ? 'border-primary bg-primary text-primary-foreground pb-pop'
                      : done
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-background text-muted-foreground'
                  }`}
                >
                  {done ? '✓' : i + 1}
                </button>
                <span
                  aria-hidden="true"
                  className={`h-0.5 flex-1 ${i === GUIDE_STEPS.length - 1 ? 'opacity-0' : done ? 'bg-primary' : 'bg-border'}`}
                />
              </div>
              <span
                className={`text-caption text-center leading-tight ${current ? 'font-bold' : 'text-muted-foreground'}`}
              >
                {s.label}
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

// ---------------------------------------------------------------------------------------------
// Live summary (desktop card)
// ---------------------------------------------------------------------------------------------

function SummaryCard({
  p,
  d,
  note,
  onGenerate,
  generateDisabled,
}: {
  p: PaperBuilderProps
  d: ReturnType<typeof deriveBuilder>
  note: string | null
  onGenerate: () => void
  generateDisabled: boolean
}) {
  return (
    <aside aria-labelledby="pb-c-summary-title" className={`${cardClass} sticky top-4`}>
      <p className="field-label text-muted-foreground">Live summary</p>
      <h2 id="pb-c-summary-title" className="display-title text-xl leading-tight">
        Your paper
      </h2>
      <p className="text-body mt-2 font-semibold [overflow-wrap:anywhere]" aria-live="polite">
        {d.summary}
      </p>
      {d.askedVsPlanned && (
        <p className="text-small bg-muted mt-3 rounded-xl p-3">
          <span className="font-bold">{d.askedVsPlanned.headline}.</span>{' '}
          {d.askedVsPlanned.explanation}
        </p>
      )}
      {p.loadingPlan && (
        <p className="text-small text-muted-foreground mt-3" role="status">
          Planning your paper{'…'}
        </p>
      )}
      {!p.loadingPlan && note && <p className="text-small text-muted-foreground mt-3">{note}</p>}
      {p.error && (
        <p className="text-small text-destructive mt-3" role="alert">
          {p.error}
        </p>
      )}
      <div className="mt-4 flex items-center gap-2">
        <Button type="button" variant="outline" size="lg" className="min-h-12" onClick={p.onReset}>
          Reset
        </Button>
        <Button
          ref={p.generateButtonRef}
          type="button"
          variant="pop"
          size="lg"
          className="min-h-12 flex-1"
          disabled={generateDisabled}
          onClick={onGenerate}
        >
          {p.starting ? 'Getting your paper ready…' : 'Make this paper'}
        </Button>
      </div>
    </aside>
  )
}

// ---------------------------------------------------------------------------------------------
// The layout
// ---------------------------------------------------------------------------------------------

/**
 * Layout C. The fast path is a "Made for you" card with one big button; "Customise" swaps it for a
 * three-step guide (subject, chapters, size and style) next to a live "Your paper" summary that
 * can generate at any step. Every step is skippable because smart defaults are already filled in.
 */
export function PaperBuilderC(p: PaperBuilderProps) {
  const d = deriveBuilder(p)
  const desktop = useIsDesktop()
  const [customising, setCustomising] = useState(false)
  const [step, setStep] = useState<GuideStep>(0)
  const [moreOpen, setMoreOpen] = useState(false)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const mounted = useRef(false)

  const hasRecommendation = p.recommendedChapterIds !== null && p.recommendedChapterIds.length > 0
  const settingUp = p.loadingPlan && !p.plan
  const mode = builderMode({ hasRecommendation, customising, settingUp })
  const isRecommended = hasRecommendation && sameChapterSet(p.selectedChapterIds, p.recommendedChapterIds ?? [])

  const state = {
    subjectId: p.subjectId,
    chapterCount: p.selectedChapterIds.length,
    planReady: p.readyToGenerate,
    planning: p.loadingPlan,
    starting: p.starting,
  }
  const generateReason = generateBlockReason(state)
  const generateDisabled = generateReason !== null
  // Planning and starting have their own status text; the note is for a missing choice.
  const generateNote = p.loadingPlan || p.starting ? null : generateReason

  // Focus follows the screen: the new step's heading, or the card's heading on the way back. Not
  // on first render, so the page does not jump.
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    headingRef.current?.focus({ preventScroll: true })
    headingRef.current?.scrollIntoView({
      block: 'start',
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    })
  }, [mode, step])

  function customise() {
    setStep(0)
    setCustomising(true)
  }
  function backToQuick() {
    setCustomising(false)
  }

  // ----- Quick path ---------------------------------------------------------------------------
  if (mode === 'quick') {
    const shown = d.selectedChapters.slice(0, 3)
    const more = d.selectedChapters.length - shown.length
    return (
      <section
        aria-labelledby="pb-c-hero-title"
        className="relative overflow-hidden rounded-3xl p-5 sm:p-7"
        style={heroStyle}
      >
        <p className="field-label">{isRecommended ? 'Made for you' : 'Your paper'}</p>
        <h2
          id="pb-c-hero-title"
          ref={headingRef}
          tabIndex={-1}
          className="display-title mt-1 text-3xl leading-tight outline-none"
        >
          {d.subject?.name ?? 'Choose a subject'}
        </h2>
        {isRecommended && (
          <p className="text-small text-muted-foreground mt-1">
            {p.plan?.is_initial_assessment
              ? 'A short first paper to see where you stand.'
              : 'Mixes what you know with what needs more practice.'}
          </p>
        )}
        {shown.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2" aria-label="Chapters in this paper">
            {shown.map((c) => (
              <li
                key={c.id}
                className="bg-card/80 border-border text-small max-w-full rounded-full border px-3 py-1.5 font-semibold [overflow-wrap:anywhere]"
              >
                {d.showPart ? `Part ${c.part} · ` : ''}
                {c.chapter_no}. {c.name}
              </li>
            ))}
            {more > 0 && (
              <li className="bg-card/80 border-border text-small rounded-full border px-3 py-1.5 font-semibold">
                +{more} more
              </li>
            )}
          </ul>
        )}
        <p className="text-body mt-3 font-semibold" aria-live="polite">
          {settingUp
            ? 'Planning your paper…'
            : d.school && p.plan
              ? `${p.plan.total_questions} questions · ${schoolPaperLine(d.school)}`
              : d.size}
        </p>
        {d.askedVsPlanned && (
          <p className="text-small text-muted-foreground mt-0.5">
            <span className="font-bold">{d.askedVsPlanned.headline}.</span>{' '}
            {d.askedVsPlanned.explanation}
          </p>
        )}
        {p.error && (
          <p className="text-small text-destructive mt-2" role="alert">
            {p.error}
          </p>
        )}
        {!p.loadingPlan && !p.starting && generateReason && (
          <p className="text-small text-muted-foreground mt-2">{generateReason}</p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button
            ref={p.generateButtonRef}
            type="button"
            variant="pop"
            size="lg"
            className="min-h-12"
            disabled={generateDisabled}
            onClick={p.onGenerate}
          >
            {p.starting ? 'Getting your paper ready…' : 'Make this paper'}
          </Button>
          <button
            type="button"
            onClick={customise}
            className={`bg-card/70 border-border text-body inline-flex min-h-12 items-center rounded-2xl border px-5 font-bold ${focusRing}`}
          >
            Customise
          </button>
        </div>
      </section>
    )
  }

  // ----- Guided path --------------------------------------------------------------------------
  const nextReason = nextBlockReason(step, state)
  const skipReason = skipToReviewBlockReason(state)
  const note = nextReason ?? (skipReason ? skipReason.replace(' to continue.', ' to skip ahead.') : null)
  const following = nextStep(step)
  const previous = previousStep(step)

  function next() {
    if (nextReason || following === null) return
    setStep(following)
  }
  // Enter on the step itself (not on a control) moves on. It never generates, and Escape is
  // deliberately not handled, so neither can do anything she did not ask for.
  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== 'Enter' || e.defaultPrevented) return
    if ((e.target as HTMLElement).closest('button, a, input, textarea, select, label')) return
    next()
  }

  return (
    <div className="space-y-4">
      {hasRecommendation && (
        <button
          type="button"
          onClick={backToQuick}
          className={`text-small text-primary -my-1 inline-flex min-h-11 items-center gap-1.5 font-bold underline-offset-4 hover:underline ${focusRing} rounded-lg`}
        >
          <span aria-hidden="true">{'←'}</span>
          Back to the quick version
        </button>
      )}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-start">
        <div className="min-w-0 space-y-4" onKeyDown={onKeyDown}>
          <StepDots step={step} canGo={(s) => canGoToStep(s, state)} onGo={setStep} />
          <p className="sr-only" aria-live="polite">
            {stepProgressText(step)}
          </p>

          {step === 0 && (
            <BuilderSection
              id="pb-c-subject"
              headingRef={headingRef}
              title="Which subject?"
              hint="Pick one. You can change it later."
            >
              <SubjectChips subjects={p.subjects} value={p.subjectId} onChange={p.onSubject} />
            </BuilderSection>
          )}

          {step === 1 && (
            <BuilderSection
              id="pb-c-chapters"
              headingRef={headingRef}
              title="Which chapters?"
              hint="We picked these for you. You can change them anytime."
            >
              <ChapterSearch p={p} />
              <ChapterCards
                chapters={p.chapters}
                selectedIds={p.selectedChapterIds}
                query={p.chapterQuery}
                onToggle={p.onToggleChapter}
                onSelectAll={p.onSelectAllChapters}
                onClear={p.onClearChapters}
                loading={p.loadingPlan}
              />
            </BuilderSection>
          )}

          {step === 2 && (
            <>
              <BuilderSection
                id="pb-c-size"
                headingRef={headingRef}
                title="Size and style"
                hint="Time is an estimate for your selection."
              >
                <div className="space-y-4">
                  <div>
                    <p className="field-label text-muted-foreground mb-2">How many questions</p>
                    <CountField p={p} />
                  </div>
                  {d.school && <TypeField p={p} />}
                  <div className="border-border rounded-2xl border">
                    <button
                      type="button"
                      aria-expanded={moreOpen}
                      aria-controls="pb-c-more"
                      onClick={() => setMoreOpen((o) => !o)}
                      className={`text-body flex min-h-12 w-full items-center justify-between gap-2 rounded-2xl px-3 text-left font-bold ${focusRing}`}
                    >
                      More options
                      <span className="text-small text-muted-foreground flex items-center gap-2 font-medium">
                        <span className="hidden sm:inline">
                          {d.school ? 'Paper style' : 'Question type, paper style'}
                        </span>
                        {chevronDown(moreOpen)}
                      </span>
                    </button>
                    {moreOpen && (
                      <div id="pb-c-more" className="space-y-4 px-3 pt-1 pb-3">
                        {!d.school && (
                          <div>
                            <p className="field-label text-muted-foreground mb-2">Question type</p>
                            <TypeField p={p} />
                          </div>
                        )}
                        {p.styleSlot}
                      </div>
                    )}
                  </div>
                </div>
              </BuilderSection>

              <section className={cardClass} aria-labelledby="pb-c-review-title">
                <p className="field-label text-muted-foreground">Review</p>
                <h2 id="pb-c-review-title" className="display-title text-xl leading-tight">
                  Check your paper
                </h2>
                <dl className="text-small mt-3 space-y-2">
                  <div className="flex gap-3">
                    <dt className="text-muted-foreground w-24 shrink-0">Subject</dt>
                    <dd className="font-semibold">{d.subject?.name}</dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="text-muted-foreground w-24 shrink-0">Chapters</dt>
                    <dd className="min-w-0 font-semibold [overflow-wrap:anywhere]">
                      {d.selectedChapters.length === 0 ? (
                        'None yet'
                      ) : (
                        <ul className="space-y-1">
                          {d.selectedChapters.map((c) => (
                            <li key={c.id}>
                              {d.showPart ? `Part ${c.part} \u00b7 ` : ''}
                              {c.chapter_no}. {c.name}
                            </li>
                          ))}
                        </ul>
                      )}
                    </dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="text-muted-foreground w-24 shrink-0">Questions</dt>
                    <dd className="font-semibold">
                      {p.plan ? p.plan.total_questions : p.questionCount}
                      {d.school ? '' : ` · ${QUESTION_TYPE_LABELS[p.questionType]}`}
                    </dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="text-muted-foreground w-24 shrink-0">Time</dt>
                    <dd className="font-semibold">
                      {d.school
                        ? schoolPaperLine(d.school)
                        : p.plan
                          ? `about ${p.plan.estimated_minutes} min`
                          : '…'}
                    </dd>
                  </div>
                </dl>
              </section>
            </>
          )}

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              {previous !== null && (
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="min-h-12"
                  onClick={() => setStep(previous)}
                >
                  Back
                </Button>
              )}
              {following !== null && (
                <Button
                  type="button"
                  size="lg"
                  className="min-h-12"
                  disabled={nextReason !== null}
                  aria-describedby={note ? 'pb-c-note' : undefined}
                  onClick={next}
                >
                  Next: {GUIDE_STEPS[following].label}
                </Button>
              )}
              {step < REVIEW_STEP && (
                <button
                  type="button"
                  disabled={skipReason !== null}
                  aria-describedby={note ? 'pb-c-note' : undefined}
                  onClick={() => setStep(REVIEW_STEP)}
                  className={`text-small text-primary inline-flex min-h-11 items-center rounded-lg px-1 font-bold underline underline-offset-4 disabled:cursor-not-allowed disabled:no-underline disabled:opacity-60 ${focusRing}`}
                >
                  Skip to review
                </button>
              )}
            </div>
            {note && (
              <p id="pb-c-note" className="text-small text-muted-foreground" aria-live="polite">
                {note}
              </p>
            )}
          </div>
        </div>

        {desktop && (
          <SummaryCard
            p={p}
            d={d}
            note={generateNote}
            onGenerate={p.onGenerate}
            generateDisabled={generateDisabled}
          />
        )}
      </div>

      {!desktop && (
        <SummaryBar
          summary={d.summary}
          askedVsPlanned={d.askedVsPlanned}
          planning={p.loadingPlan}
          error={p.error}
          note={generateNote}
          onReset={p.onReset}
          onPrimary={p.onGenerate}
          primaryLabel="Make this paper"
          primaryDisabled={generateDisabled}
          primaryBusy={p.starting}
          primaryRef={p.generateButtonRef}
        />
      )}
    </div>
  )
}
