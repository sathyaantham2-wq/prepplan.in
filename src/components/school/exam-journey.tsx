import { useCallback, useEffect, useState } from 'react'
import { CheckCircle2, Circle, ChevronRight } from 'lucide-react'
import { Btn, Card, Chip } from './ui'
import { MarkAllPanel } from './marking-panel'
import type { Overview } from './marking-panel'
import { api } from '../../lib/school-client'
import type { OwnPaperView } from '../../lib/schools/own-paper-service'
import type { SectionRelease, disputeQueue } from '../../lib/schools/results-release'

// One place that says where an exam is and what to do next (owner request 2026-11-01): six steps, the one that
// matters now, and ONE button for it. The work itself is done in the sections below; every button here either does
// the single action (approve, mark everyone) or takes the teacher to the right section.

type Dispute = Awaited<ReturnType<typeof disputeQueue>>[number]
interface ReleaseData {
  sections: Array<SectionRelease>
  disputes: Array<Dispute>
}

export const STEPS = [
  { id: 'paper', label: 'Paper' },
  { id: 'answers', label: 'Answers' },
  { id: 'sheets', label: 'Sheets' },
  { id: 'marking', label: 'AI marks' },
  { id: 'review', label: 'Your look' },
  { id: 'release', label: 'Results' },
] as const
export type StepId = (typeof STEPS)[number]['id']

export interface JourneyFacts {
  paperApproved: boolean
  markable: boolean
  students: number
  noSheets: number
  readyForAi: number
  aiBusy: number
  needYou: number
  marked: number
  queries: number
  sectionsToRelease: number
  sectionsTotal: number
}

/** Which step is the one to do now. Pure, so it is tested without a screen. */
export function currentStep(f: JourneyFacts): StepId | 'done' {
  if (!f.paperApproved) return 'paper'
  if (!f.markable) return 'answers'
  if (f.students > 0 && f.noSheets === f.students) return 'sheets'
  if (f.readyForAi > 0 || f.aiBusy > 0) return 'marking'
  if (f.needYou > 0 || f.queries > 0) return 'review'
  if (f.marked > 0 && f.sectionsToRelease > 0) return 'release'
  if (f.marked === 0) return 'sheets'
  return 'done'
}

export function factsOf(v: OwnPaperView, o: Overview | null, r: ReleaseData | null): JourneyFacts {
  const st = o?.students ?? []
  const count = (...s: Array<string>) => st.filter((x) => s.includes(x.status)).length
  return {
    paperApproved: v.status === 'approved',
    markable: v.markable,
    students: st.length,
    noSheets: count('not_uploaded'),
    readyForAi: count('ready', 'rejected'),
    aiBusy: count('checking'),
    needYou: count('needs_teacher'),
    marked: count('marked', 'needs_teacher'),
    queries: r?.disputes.filter((d) => d.status === 'with_teacher').length ?? 0,
    sectionsToRelease: r?.sections.filter((s) => !s.released && s.marked > 0).length ?? 0,
    sectionsTotal: r?.sections.length ?? 0,
  }
}

function go(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  if (el instanceof HTMLDetailsElement) el.open = true
}

/** Opens a student's row in the answer-sheets list (the same as tapping her name). */
function openStudent(studentId: string) {
  const li = document.getElementById(`stu-${studentId}`)
  if (!li) return go('step-sheets')
  const btn = li.querySelector('button[aria-expanded]')
  if (btn instanceof HTMLButtonElement && btn.getAttribute('aria-expanded') === 'false') btn.click()
  li.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function ExamJourney({
  base,
  v,
  version,
  onChanged,
  act,
}: {
  base: string
  v: OwnPaperView
  version: number
  onChanged: () => void
  act: (b: Record<string, unknown>) => Promise<void>
}) {
  const [o, setO] = useState<Overview | null>(null)
  const [r, setR] = useState<ReleaseData | null>(null)
  const load = useCallback(async () => {
    if (!v.markable) {
      setO(null)
      setR(null)
      return
    }
    setO(await api<Overview>(`${base}/marking`).catch(() => null))
    setR(await api<ReleaseData>(`${base}/release`).catch(() => null))
  }, [base, v.markable])
  useEffect(() => {
    void load()
  }, [load, version, v.status])

  if (v.status === 'reading' || v.status === 'failed') return null
  const f = factsOf(v, o, r)
  const now = currentStep(f)
  const idx = now === 'done' ? STEPS.length : STEPS.findIndex((s) => s.id === now)
  const need = o?.students.filter((s) => s.status === 'needs_teacher') ?? []
  const open = r?.disputes.filter((d) => d.status === 'with_teacher').length ?? 0

  return (
    <section className="space-y-3" data-testid="journey" data-step={now}>
      <div>
        <p className="text-sm font-semibold text-slate-700">
          {now === 'done' ? 'All steps done' : `Step ${idx + 1} of ${STEPS.length}: ${STEPS[idx].label}`}
        </p>
        <ol className="mt-1.5 grid grid-cols-6 gap-1.5" aria-label="Steps">
          {STEPS.map((s, i) => (
            <li
              key={s.id}
              aria-current={i === idx ? 'step' : undefined}
              className={`h-2 rounded-full ${i < idx ? 'bg-emerald-700' : i === idx ? 'bg-amber-500' : 'bg-slate-200'}`}
              title={s.label}
            />
          ))}
        </ol>
        <ol className="mt-1.5 hidden grid-cols-6 gap-1.5 text-center text-xs text-slate-600 sm:grid">
          {STEPS.map((s) => (
            <li key={s.id}>{s.label}</li>
          ))}
        </ol>
      </div>

      <Card className="space-y-3 border-emerald-700 bg-emerald-50/60" data-testid="next-step">
        {now === 'paper' ? (
          <>
            <h2 className="text-lg font-bold">Next: check the paper, then approve it</h2>
            <p className="text-base">
              {v.summary.toCheck > 0
                ? `${v.summary.toCheck} question${v.summary.toCheck === 1 ? ' needs' : 's need'} their chapter checked (marked yellow below).`
                : 'Look through the questions, marks and chapters below. Change anything that is wrong.'}
            </p>
            <Btn className="w-full" disabled={!v.canApprove} onClick={() => void act({ action: 'approve' })}>
              Approve this paper
            </Btn>
            <Btn kind="plain" className="w-full" onClick={() => go('step-questions')}>
              Go to the questions
            </Btn>
          </>
        ) : now === 'answers' ? (
          <>
            <h2 className="text-lg font-bold">Next: approve the answers</h2>
            <p className="text-base">
              {v.summary.keysDraft + v.summary.keysNone} of {v.summary.questions} answers are not approved yet. The AI marks only against
              answers you approved.
            </p>
            {v.summary.keysDraft > 0 ? (
              <Btn className="w-full" onClick={() => void act({ action: 'approve_keys' })}>
                Approve all {v.summary.keysDraft} answers
              </Btn>
            ) : null}
            <Btn kind="plain" className="w-full" onClick={() => go('step-questions')}>
              Read the answers first
            </Btn>
          </>
        ) : now === 'sheets' ? (
          <>
            <h2 className="text-lg font-bold">Next: add the students' answer sheets</h2>
            <p className="text-base">
              Choose a student below and add photos of her sheets. {f.noSheets} of {f.students} students have no sheets yet.
            </p>
            <Btn className="w-full" onClick={() => go('step-sheets')}>
              Add answer sheets
            </Btn>
          </>
        ) : now === 'marking' ? (
          <>
            <h2 className="text-lg font-bold">Next: let the AI mark the class</h2>
            <p className="text-base">
              {f.aiBusy > 0
                ? 'The AI is marking. You can leave this page; it carries on.'
                : `${f.readyForAi} student${f.readyForAi === 1 ? ' has' : 's have'} sheets and ${f.readyForAi === 1 ? 'is' : 'are'} ready. This takes about a minute for each student.`}
            </p>
            {f.noSheets > 0 ? (
              <p className="text-sm text-slate-700">
                {f.noSheets} {f.noSheets === 1 ? 'student has' : 'students have'} no sheets yet; {f.noSheets === 1 ? 'she is' : 'they are'} left out.
              </p>
            ) : null}
          </>
        ) : now === 'review' ? (
          <>
            <h2 className="text-lg font-bold">Next: look at the answers the AI was not sure about</h2>
            {need.length > 0 ? (
              <>
                <p className="text-base">
                  {need.length} student{need.length === 1 ? ' has' : 's have'} yellow answers. Open a name, then accept the AI's mark or change
                  it.
                </p>
                <ul className="space-y-2">
                  {need.map((s) => (
                    <li key={s.schoolStudentId}>
                      <button
                        type="button"
                        onClick={() => openStudent(s.schoolStudentId)}
                        className="flex min-h-12 w-full items-center justify-between gap-2 rounded-xl border border-amber-400 bg-white px-3.5 text-left text-base font-semibold"
                      >
                        <span>
                          {s.rollNo} · {s.name}
                        </span>
                        <span className="flex items-center gap-1 text-amber-900">
                          {s.flagged} to check <ChevronRight aria-hidden="true" className="size-4" />
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            {open > 0 ? (
              <>
                <p className="text-base">
                  {open} student {open === 1 ? 'question is' : 'questions are'} waiting for your decision. Your decision is final.
                </p>
                <Btn kind="plain" className="w-full" onClick={() => go('step-release')}>
                  Go to the students' questions
                </Btn>
              </>
            ) : null}
          </>
        ) : now === 'release' ? (
          <>
            <h2 className="text-lg font-bold">Next: release the results</h2>
            <p className="text-base">
              Everything is marked. Release a section and its students see their marks. They can then ask about up to 5 answers for{' '}
              {r?.sections.find((s) => s.released)?.released?.windowDays ?? 'a few'} days.
            </p>
            {f.noSheets > 0 ? (
              <p className="text-sm text-slate-700">
                {f.noSheets} {f.noSheets === 1 ? 'student has' : 'students have'} no sheets; {f.noSheets === 1 ? 'her sheets' : 'their sheets'} can be added later.
              </p>
            ) : null}
            <Btn className="w-full" onClick={() => go('step-release')}>
              Go to Release
            </Btn>
          </>
        ) : (
          <>
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <CheckCircle2 aria-hidden="true" className="size-6 text-emerald-700" /> The results are with the students
            </h2>
            <p className="text-base">Nothing is waiting for you. After the question window the marks become final.</p>
          </>
        )}
        {v.markable ? (
          <div id="step-marking">
            <MarkAllPanel base={base} ready={f.readyForAi} onChanged={onChanged} />
          </div>
        ) : null}
      </Card>

      <details className="rounded-2xl border border-slate-200 bg-white px-4 py-2" data-testid="all-steps">
        <summary className="min-h-11 cursor-pointer content-center text-base font-semibold">All the steps</summary>
        <ol className="space-y-1 pb-2">
          {STEPS.map((s, i) => (
            <li key={s.id} className="flex min-h-9 items-center gap-2 text-base">
              {i < idx ? (
                <CheckCircle2 aria-hidden="true" className="size-5 text-emerald-700" />
              ) : (
                <Circle aria-hidden="true" className={`size-5 ${i === idx ? 'text-amber-600' : 'text-slate-400'}`} />
              )}
              <span className={i === idx ? 'font-bold' : ''}>
                {i + 1}. {s.label}
              </span>
              {i === idx ? <Chip tone="wait">now</Chip> : null}
            </li>
          ))}
        </ol>
      </details>
    </section>
  )
}
