import { useState } from 'react'
import { Button } from '../ui/button'
import {
  BuilderSection,
  ChapterCards,
  ChapterSearch,
  CountField,
  SubjectChips,
  SummaryBar,
  TypeField,
  chevronDown,
  deriveBuilder,
} from './shared'
import type { PaperBuilderProps } from './types'

const heroStyle = {
  background: 'var(--grad-soft)',
  boxShadow: 'inset 0 1px 0 rgb(255 255 255 / 0.6), 0 12px 32px -16px var(--glow)',
} as const

function sameSet(a: Array<string>, b: Array<string>) {
  return a.length === b.length && a.every((x) => b.includes(x))
}

/**
 * Layout A, "Smart preset + customise": a ready-made paper at the top with one big button, and the
 * choices (subject, size, chapters, more options) a tap away under "Change".
 */
export function PaperBuilderA(p: PaperBuilderProps) {
  const d = deriveBuilder(p)
  const [changing, setChanging] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)

  const hasRecommendation = p.recommendedChapterIds !== null && p.recommendedChapterIds.length > 0
  const settingUp = p.loadingPlan && !p.plan
  // Collapsed only when the app has a recommendation; always open otherwise.
  const expanded = changing || (!hasRecommendation && !settingUp)
  const isRecommended =
    hasRecommendation &&
    sameSet(p.selectedChapterIds, p.recommendedChapterIds ?? [])

  const shown = d.selectedChapters.slice(0, 3)
  const more = d.selectedChapters.length - shown.length
  const blocked = p.starting || p.loadingPlan || !p.readyToGenerate

  return (
    <div className="space-y-4">
      <section
        aria-labelledby="pb-a-hero-title"
        className="relative overflow-hidden rounded-3xl p-5 sm:p-7"
        style={heroStyle}
      >
        <p className="field-label">{isRecommended ? 'Made for you' : 'Your paper'}</p>
        <h2 id="pb-a-hero-title" className="display-title mt-1 text-3xl leading-tight">
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
          {settingUp ? 'Planning your paper…' : d.size}
        </p>
        {d.askedVsPlanned && (
          <p className="text-small text-muted-foreground mt-0.5">{d.askedVsPlanned.explanation}</p>
        )}
        {p.error && !expanded && (
          <p className="text-small text-destructive mt-2" role="alert">
            {p.error}
          </p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {!expanded && (
            <Button
              ref={p.generateButtonRef}
              type="button"
              variant="pop"
              size="lg"
              className="min-h-12"
              disabled={blocked}
              onClick={p.onGenerate}
            >
              {p.starting ? 'Getting your paper ready…' : 'Make this paper'}
            </Button>
          )}
          {hasRecommendation && (
            <button
              type="button"
              aria-expanded={expanded}
              aria-controls="pb-a-options"
              onClick={() => setChanging((c) => !c)}
              className="bg-card/70 border-border focus-visible:ring-ring/60 text-body inline-flex min-h-12 items-center gap-2 rounded-2xl border px-4 font-bold outline-none focus-visible:ring-[3px]"
            >
              {expanded ? 'Hide options' : 'Change'}
              {chevronDown(expanded)}
            </button>
          )}
        </div>
      </section>

      {expanded && (
        <div id="pb-a-options" className="space-y-4">
          <BuilderSection id="pb-a-subject" number={1} title="Subject">
            <SubjectChips subjects={p.subjects} value={p.subjectId} onChange={p.onSubject} />
          </BuilderSection>

          <BuilderSection
            id="pb-a-count"
            number={2}
            title="How many questions"
            hint="Time is an estimate for your selection."
          >
            <CountField p={p} />
          </BuilderSection>

          <BuilderSection
            id="pb-a-chapters"
            number={3}
            title="Chapters"
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

          <section className="bg-card border-border rounded-3xl border p-2 sm:p-3">
            <button
              type="button"
              aria-expanded={moreOpen}
              aria-controls="pb-a-more"
              onClick={() => setMoreOpen((o) => !o)}
              className="focus-visible:ring-ring/60 text-body flex min-h-12 w-full items-center justify-between gap-2 rounded-2xl px-3 text-left font-bold outline-none focus-visible:ring-[3px]"
            >
              More options
              <span className="text-small text-muted-foreground flex items-center gap-2 font-medium">
                Question type, paper style
                {chevronDown(moreOpen)}
              </span>
            </button>
            {moreOpen && (
              <div id="pb-a-more" className="space-y-4 px-3 pt-2 pb-3">
                <div>
                  <p className="field-label text-muted-foreground mb-2">Question type</p>
                  <TypeField p={p} />
                </div>
                {p.styleSlot}
              </div>
            )}
          </section>
        </div>
      )}

      {expanded && (
        <SummaryBar
          summary={d.summary}
          askedVsPlanned={d.askedVsPlanned}
          planning={p.loadingPlan}
          error={p.error}
          note={d.noChapters ? 'Pick at least one chapter to make a paper.' : null}
          onReset={p.onReset}
          onPrimary={p.onGenerate}
          primaryLabel="Make this paper"
          primaryDisabled={blocked}
          primaryBusy={p.starting}
          primaryRef={p.generateButtonRef}
        />
      )}
    </div>
  )
}
