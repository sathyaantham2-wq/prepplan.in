import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { Button } from '../ui/button'
import { QUESTION_TYPE_LABELS, WIZARD_STEPS, wizardBlockReason } from '../../lib/paper-builder-view'
import type { WizardStep } from '../../lib/paper-builder-view'
import {
  BuilderSection,
  ChapterCards,
  ChapterSearch,
  CountField,
  SubjectChips,
  SummaryBar,
  TypeField,
  cardClass,
  deriveBuilder,
} from './shared'
import type { PaperBuilderProps } from './types'

function StepDots({
  step,
  onGo,
}: {
  step: WizardStep
  onGo: (s: WizardStep) => void
}) {
  return (
    <nav aria-label="Progress" className="mb-4">
      <ol className="flex items-start">
        {WIZARD_STEPS.map((s, i) => {
          const done = i < step
          const current = i === step
          return (
            <li key={s.key} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
              <div className="flex w-full items-center">
                <span
                  aria-hidden="true"
                  className={`h-0.5 flex-1 ${i === 0 ? 'opacity-0' : done || current ? 'bg-primary' : 'bg-border'}`}
                />
                <button
                  type="button"
                  disabled={!done}
                  onClick={() => onGo(i as WizardStep)}
                  aria-current={current ? 'step' : undefined}
                  aria-label={`Step ${i + 1}: ${s.label}${done ? ', done. Go back to this step' : current ? ', current step' : ''}`}
                  className={`focus-visible:ring-ring/60 flex size-11 shrink-0 items-center justify-center rounded-full border-2 text-sm font-extrabold outline-none focus-visible:ring-[3px] ${
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
                  className={`h-0.5 flex-1 ${i === WIZARD_STEPS.length - 1 ? 'opacity-0' : done ? 'bg-primary' : 'bg-border'}`}
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

/**
 * Layout B, "Guided steps": subject, then chapters, then size and style with a final review. One
 * thing to decide per screen; Back keeps everything she chose.
 */
export function PaperBuilderB(p: PaperBuilderProps) {
  const d = deriveBuilder(p)
  const [step, setStep] = useState<WizardStep>(0)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const mounted = useRef(false)

  // Focus moves to the new step's heading (not on first render, so the page does not jump).
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    headingRef.current?.focus({ preventScroll: true })
    headingRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' })
  }, [step])

  const reason = wizardBlockReason(step, {
    subjectId: p.subjectId,
    chapterCount: p.selectedChapterIds.length,
    planReady: p.readyToGenerate,
    planning: p.loadingPlan,
    starting: p.starting,
  })
  const last = step === 2

  function next() {
    if (reason) return
    if (last) p.onGenerate()
    else setStep((step + 1) as WizardStep)
  }
  function back() {
    if (step > 0) setStep((step - 1) as WizardStep)
  }
  // Enter on the step itself (not on a control) moves on; Escape is deliberately not handled.
  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== 'Enter' || e.defaultPrevented) return
    const el = e.target as HTMLElement
    if (el.closest('button, a, input, textarea, select, label')) return
    next()
  }

  return (
    <div className="space-y-4" onKeyDown={onKeyDown}>
      <StepDots step={step} onGo={setStep} />

      {step === 0 && (
        <BuilderSection
          id="pb-b-subject"
          headingRef={headingRef}
          title="Which subject?"
          hint="Pick one. You can change it later."
        >
          <SubjectChips subjects={p.subjects} value={p.subjectId} onChange={p.onSubject} />
        </BuilderSection>
      )}

      {step === 1 && (
        <BuilderSection
          id="pb-b-chapters"
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
        <div className="space-y-4">
          <BuilderSection
            id="pb-b-size"
            headingRef={headingRef}
            title="Size and style"
            hint="Time is an estimate for your selection."
          >
            <div className="space-y-4">
              <div>
                <p className="field-label text-muted-foreground mb-2">How many questions</p>
                <CountField p={p} />
              </div>
              <div>
                <p className="field-label text-muted-foreground mb-2">Question type</p>
                <TypeField p={p} />
              </div>
              {p.styleSlot}
            </div>
          </BuilderSection>

          <section className={cardClass} aria-labelledby="pb-b-review-title">
            <p className="field-label text-muted-foreground">Review</p>
            <h2 id="pb-b-review-title" className="display-title text-xl leading-tight">
              Your paper
            </h2>
            <dl className="text-small mt-3 space-y-2">
              <div className="flex gap-3">
                <dt className="text-muted-foreground w-24 shrink-0">Subject</dt>
                <dd className="font-semibold">{d.subject?.name}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="text-muted-foreground w-24 shrink-0">Chapters</dt>
                <dd className="min-w-0 font-semibold [overflow-wrap:anywhere]">
                  {d.selectedChapters.map((c) => c.name).join(', ') || 'None yet'}
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
                    ? `${d.school.duration_min} min`
                    : p.plan
                      ? `about ${p.plan.estimated_minutes} min`
                      : '…'}
                </dd>
              </div>
            </dl>
            {d.askedVsPlanned && (
              <p className="text-small bg-muted mt-3 rounded-xl p-3">
                <span className="font-bold">{d.askedVsPlanned.headline}.</span>{' '}
                {d.askedVsPlanned.explanation}
              </p>
            )}
          </section>
        </div>
      )}

      <SummaryBar
        summary={d.summary}
        askedVsPlanned={null}
        planning={p.loadingPlan && last}
        error={p.error}
        note={reason}
        onPrimary={next}
        primaryLabel={last ? 'Generate paper' : 'Next'}
        primaryDisabled={reason !== null}
        primaryBusy={last && p.starting}
        primaryRef={last ? p.generateButtonRef : undefined}
        extra={
          step > 0 ? (
            <Button type="button" variant="outline" size="lg" className="min-h-12" onClick={back}>
              Back
            </Button>
          ) : null
        }
      />
    </div>
  )
}
