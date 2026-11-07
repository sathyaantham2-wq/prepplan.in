import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  GripVertical,
  Lock,
  Plus,
  RefreshCw,
  Repeat,
  Sparkles,
  Trash2,
  Unlock,
} from 'lucide-react'
import { MathText } from '../math-text'
import { useSchool } from './context'
import { InfoTip, useNarrow, useShell } from './kit'
import { Btn, Chip, Loading, Notice, PageHeader, inputClass } from './ui'
import { api } from '../../lib/school-client'
import { formatDate } from '../../lib/dates'
import type { builderBank, builderView } from '../../lib/schools/exam-builder'

// The paper builder (docs/SCHOOLS_MODULE_PLAN.md section 16): the paper on the left, the question bank on the right, a
// live checklist on top. Every change is saved at once, so leaving and coming back loses nothing. Plain words throughout.

type View = Awaited<ReturnType<typeof builderView>>
type Pick = View['picks'][number]
type Bank = Awaited<ReturnType<typeof builderBank>>
type BankQ = Bank['questions'][number]
interface SwapOption {
  id: string
  text: string
  type: string
  marks: number
  difficulty: string
  level: string
  chapter: string
  otherChapter: boolean
  usedBefore: Array<{ exam: string; section: string; at: string }>
}

const TYPE_WORD: Record<string, string> = {
  mcq: 'Multiple choice',
  assertion_reason: 'Assertion–reason',
  match: 'Match',
  multi_statement: 'Statements',
  fill_blank: 'Fill in',
  short_answer: 'Short answer',
  long_answer: 'Long answer',
  diagram: 'Diagram',
}

export function PaperBuilder({ examId }: { examId: string }) {
  const { schoolId } = useSchool()
  const { toast, confirm } = useShell()
  const navigate = useNavigate()
  const narrow = useNarrow()
  const base = `/api/schools/${schoolId}/exams/${examId}/builder`
  const [v, setV] = useState<View | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [tab, setTab] = useState<'paper' | 'bank'>('paper')
  const [bankVersion, setBankVersion] = useState(0)

  const load = useCallback(async () => {
    setV(await api<View>(base))
  }, [base])
  useEffect(() => {
    void load().catch((e: unknown) =>
      setError(e instanceof Error ? e.message : 'Something went wrong.'),
    )
  }, [load])

  async function act(
    body: Record<string, unknown>,
    label: string,
    quiet = false,
  ) {
    setBusy(label)
    setError(null)
    try {
      const r = await api<{ message: string; options?: unknown }>(base, {
        body,
      })
      await load()
      setBankVersion((n) => n + 1)
      if (!quiet) toast(r.message)
      return r
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
      return null
    } finally {
      setBusy(null)
    }
  }

  if (!v) return error ? <Notice kind="error">{error}</Notice> : <Loading />
  const editing = v.exam.stage === 'building' && v.mayEdit
  const c = v.check

  async function finish() {
    if (!c.complete) {
      const ok = await confirm({
        title: 'Make the paper with gaps?',
        body: 'The question bank has nothing more for the empty places. They are left out of the paper and listed on the teacher copy.',
        confirmLabel: 'Make the paper',
      })
      if (!ok) return
    }
    const r = await act({ action: 'finalize' }, 'finalize', true)
    if (r) {
      toast(r.message)
      await navigate({
        to: '/school/$schoolId/exams/$examId',
        params: { schoolId, examId },
      })
    }
  }

  const nextStep = !editing
    ? null
    : c.complete
      ? 'Everything is in place. Check the paper, then press "Make paper".'
      : v.fillable.length > 0
        ? `${c.warnings[0] ?? 'Some places are empty.'} Pick from the question bank, or press "Fill the rest automatically".`
        : 'The bank has nothing more for the empty places. You can make the paper now; the gaps are listed on the teacher copy.'

  const paper = (
    <PaperPanel v={v} editing={editing} busy={busy} act={act} base={base} />
  )
  const bank = editing ? (
    <BankPanel
      base={base}
      version={bankVersion}
      onAdd={(questionId, slot) =>
        act({ action: 'add', questionId, slot }, `add-${questionId}`)
      }
      busy={busy}
    />
  ) : null

  return (
    <div className="space-y-5" data-testid="paper-builder">
      <PageHeader
        title={v.exam.title}
        help={`${v.exam.pattern} · ${v.exam.durationMin} minutes${v.exam.stage === 'final' ? ` · Version ${v.exam.version}` : ' · not finished yet'}`}
        actions={
          editing ? (
            <Btn
              kind="plain"
              onClick={() => {
                toast(
                  'Saved. Find it under Make paper whenever you want to go on.',
                )
                void navigate({
                  to: '/school/$schoolId/exams',
                  params: { schoolId },
                })
              }}
            >
              Save and finish later
            </Btn>
          ) : null
        }
        primary={
          editing ? (
            <Btn
              disabled={!v.canFinish || busy !== null}
              onClick={() => void finish()}
              data-testid="make-paper"
            >
              {busy === 'finalize' ? 'Making the paper…' : 'Make paper'}
            </Btn>
          ) : null
        }
      />
      {error ? <Notice kind="error">{error}</Notice> : null}
      <Checklist v={v} nextStep={nextStep} />
      {editing ? (
        <div
          className="flex flex-wrap items-center gap-2"
          data-testid="builder-tools"
        >
          <ModeSwitch
            mode={v.exam.mode}
            onChange={(mode) =>
              void act({ action: 'set_mode', mode }, 'mode', true)
            }
          />
          <span className="flex-1" />
          <Btn
            kind="plain"
            disabled={busy !== null}
            onClick={() => void act({ action: 'fill_rest' }, 'fill')}
            data-testid="fill-rest"
          >
            <Sparkles aria-hidden="true" className="size-4" />
            {busy === 'fill' ? 'Filling…' : 'Fill the rest automatically'}
          </Btn>
          <Btn
            kind="plain"
            disabled={busy !== null || v.picks.length === 0}
            onClick={async () => {
              if (
                await confirm({
                  title: 'Pick again everything that is not locked?',
                  body: 'Locked questions stay where they are. Every other question is replaced by a new one from the bank.',
                  confirmLabel: 'Refill unlocked',
                })
              )
                await act({ action: 'refill_unlocked' }, 'refill')
            }}
          >
            <RefreshCw aria-hidden="true" className="size-4" />
            {busy === 'refill' ? 'Refilling…' : 'Refill unlocked'}
          </Btn>
        </div>
      ) : null}
      {editing && narrow ? (
        <>
          <div
            role="tablist"
            aria-label="Paper or bank"
            className="grid grid-cols-2 rounded-lg border border-slate-200 bg-white p-1"
          >
            {(['paper', 'bank'] as const).map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={`min-h-11 rounded-md text-[15px] font-semibold ${tab === t ? 'bg-emerald-700 text-white' : 'text-slate-700'}`}
              >
                {t === 'paper'
                  ? `Paper (${c.questions.picked}/${c.questions.target})`
                  : 'Question bank'}
              </button>
            ))}
          </div>
          {tab === 'paper' ? paper : bank}
        </>
      ) : editing ? (
        <div className="grid items-start gap-5 xl:grid-cols-12">
          <div className="xl:col-span-7">{paper}</div>
          <div className="xl:sticky xl:top-40 xl:col-span-5">{bank}</div>
        </div>
      ) : (
        paper
      )}
    </div>
  )
}

// ---------------------------------------------------------------- the checklist

function Checklist({ v, nextStep }: { v: View; nextStep: string | null }) {
  const narrow = useNarrow()
  const [open, setOpen] = useState(false)
  if (!narrow) return <ChecklistFull v={v} nextStep={nextStep} sticky />
  const c = v.check
  // a phone gets a slim bar that stays on top; the full checklist opens under it
  return (
    <div className="sticky top-16 z-10 space-y-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        data-testid="checklist-bar"
        className={`flex min-h-11 w-full items-center gap-2 rounded-xl border px-3 text-left text-[15px] font-semibold shadow-sm ${c.complete ? 'border-emerald-300 bg-emerald-50 text-emerald-900' : 'border-amber-300 bg-amber-50 text-amber-950'}`}
      >
        {c.complete ? <CheckCircle2 aria-hidden="true" className="size-5 shrink-0" /> : <AlertTriangle aria-hidden="true" className="size-5 shrink-0" />}
        <span className="flex-1">
          {c.marks.picked}/{c.marks.target} marks · {c.questions.picked}/{c.questions.target} questions
          {c.warnings.length ? ` · ${c.warnings.length} to look at` : ''}
        </span>
        <span className="text-sm underline">{open ? 'Hide' : 'Details'}</span>
      </button>
      {open ? <ChecklistFull v={v} nextStep={nextStep} sticky={false} /> : null}
    </div>
  )
}

function ChecklistFull({ v, nextStep, sticky }: { v: View; nextStep: string | null; sticky: boolean }) {
  const c = v.check
  const pct = c.marks.target
    ? Math.min(100, Math.round((c.marks.picked / c.marks.target) * 100))
    : 0
  const maxCh = Math.max(1, ...c.chapters.map((x) => x.marks))
  return (
    <section
      aria-label="Checklist"
      data-testid="checklist"
      className={`${sticky ? 'sticky top-16 z-10' : ''} space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm`}
    >
      <div className="grid gap-4 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="flex items-baseline justify-between text-[15px]">
            <span className="font-semibold text-slate-900">Marks</span>
            <span
              className="font-bold text-slate-900 tabular-nums"
              data-testid="marks-count"
            >
              {c.marks.picked} of {c.marks.target}
            </span>
          </p>
          <div
            aria-hidden="true"
            className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-slate-100"
          >
            <div
              className={`h-full rounded-full ${c.complete ? 'bg-emerald-700' : 'bg-amber-500'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-1 text-sm text-slate-600">
            {c.questions.picked} of {c.questions.target} questions
          </p>
        </div>
        <div>
          <p className="flex items-center gap-1 text-[15px] font-semibold text-slate-900">
            Remember / Think
            <InfoTip>
              Remember questions ask a student to recall or explain what she
              learnt. Think questions ask her to use it, work something out or
              judge. The pattern sets the mix.
            </InfoTip>
          </p>
          <div
            aria-hidden="true"
            className="mt-1.5 flex h-2.5 overflow-hidden rounded-full bg-slate-100"
          >
            <div
              className="h-full bg-sky-600"
              style={{ width: `${c.remember.pct}%` }}
            />
            <div
              className="h-full bg-emerald-700"
              style={{ width: `${c.marks.picked ? 100 - c.remember.pct : 0}%` }}
            />
          </div>
          <p className="mt-1 text-sm text-slate-600">
            {c.remember.pct}% remember · aim about {c.remember.targetPct}%
          </p>
        </div>
        <div>
          <p className="text-[15px] font-semibold text-slate-900">
            Marks per chapter
          </p>
          <ul className="mt-1 space-y-1">
            {c.chapters.map((ch) => (
              <li key={ch.id} className="flex items-center gap-2 text-sm">
                <span className="w-40 truncate text-slate-700" title={ch.label}>
                  {ch.label.replace(/^Part [IV]+ · /, '')}
                </span>
                <span
                  aria-hidden="true"
                  className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100"
                >
                  <span
                    className={`block h-full rounded-full ${ch.marks ? 'bg-emerald-700' : ''}`}
                    style={{ width: `${(ch.marks / maxCh) * 100}%` }}
                  />
                </span>
                <span className="w-6 text-right font-semibold tabular-nums">
                  {ch.marks}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {nextStep ? (
        <p
          className={`flex items-start gap-2 rounded-lg px-3 py-2 text-[15px] ${c.complete ? 'bg-emerald-50 text-emerald-900' : 'bg-amber-50 text-amber-950'}`}
          data-testid="next-step"
        >
          {c.complete ? (
            <CheckCircle2
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0"
            />
          ) : (
            <AlertTriangle
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0"
            />
          )}
          {nextStep}
        </p>
      ) : null}
      {c.warnings.length > 1 ? (
        <details className="text-sm text-slate-700">
          <summary className="cursor-pointer font-semibold">
            All {c.warnings.length} things to look at
          </summary>
          <ul
            className="mt-1 list-disc space-y-0.5 pl-5"
            data-testid="warnings"
          >
            {c.warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </details>
      ) : null}
    </section>
  )
}

function ModeSwitch({
  mode,
  onChange,
}: {
  mode: string
  onChange: (m: 'auto_edit' | 'hand_pick') => void
}) {
  const opts = [
    {
      key: 'auto_edit' as const,
      label: 'Auto + edit',
      hint: 'PrepPlan picks; you change what you like',
    },
    {
      key: 'hand_pick' as const,
      label: 'Hand-pick',
      hint: 'You choose every question',
    },
  ]
  return (
    <div
      role="radiogroup"
      aria-label="How you are making this paper"
      className="inline-flex rounded-lg border border-slate-200 bg-white p-1"
    >
      {opts.map((o) => (
        <button
          key={o.key}
          role="radio"
          aria-checked={mode === o.key}
          title={o.hint}
          onClick={() => onChange(o.key)}
          className={`min-h-10 rounded-md px-3 text-[15px] font-semibold ${mode === o.key ? 'bg-emerald-700 text-white' : 'text-slate-700 hover:bg-slate-50'}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------- the paper

function PaperPanel({
  v,
  editing,
  busy,
  act,
  base,
}: {
  v: View
  editing: boolean
  busy: string | null
  act: (
    body: Record<string, unknown>,
    label: string,
    quiet?: boolean,
  ) => Promise<{ message: string; options?: unknown } | null>
  base: string
}) {
  const [dragging, setDragging] = useState<string | null>(null)
  return (
    <div className="space-y-4" data-testid="paper-panel">
      {v.sections.map((s) => {
        const st = v.check.slots.find(
          (x) => x.section === s.section && x.slot === s.slot,
        )
        const mine = v.picks.filter(
          (p) => p.section === s.section && p.slot === s.slot,
        )
        const primaries = mine
          .filter((p) => !p.isAlternate)
          .sort((a, b) => a.position - b.position)
        const open = Math.max(0, s.need - primaries.length)
        const full = st?.full ?? false
        return (
          <section
            key={s.key}
            className="rounded-xl border border-slate-200 bg-white"
            data-testid="paper-section"
          >
            <header className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {s.section}
                </h3>
                <p className="text-sm text-slate-600">
                  {s.slot} · {s.marks} mark{s.marks === 1 ? '' : 's'} each
                  {s.needOr ? ` · ${s.needOr} with an OR choice` : ''}
                </p>
              </div>
              <Chip tone={full ? 'good' : 'wait'}>
                picked {primaries.length} of {s.need}
                {s.needOr ? ` · OR ${st?.haveOr ?? 0} of ${s.needOr}` : ''}
              </Chip>
            </header>
            <ol className="divide-y divide-slate-200">
              {primaries.map((p, i) => {
                const partner = p.choiceGroup
                  ? mine.find(
                      (x) => x.isAlternate && x.choiceGroup === p.choiceGroup,
                    )
                  : undefined
                return (
                  <li
                    key={p.id}
                    draggable={editing}
                    onDragStart={() => setDragging(p.id)}
                    onDragOver={(e) => {
                      if (dragging && primaries.some((x) => x.id === dragging))
                        e.preventDefault()
                    }}
                    onDrop={async () => {
                      const from = primaries.findIndex((x) => x.id === dragging)
                      if (from < 0 || from === i || !dragging) return
                      const dir = from < i ? 'down' : 'up'
                      for (let k = 0; k < Math.abs(i - from); k++)
                        await act(
                          { action: 'move', pickId: dragging, direction: dir },
                          'move',
                          true,
                        )
                      setDragging(null)
                    }}
                    className="px-4 py-3"
                    data-testid="paper-question"
                  >
                    <QuestionCard
                      p={p}
                      editing={editing}
                      busy={busy}
                      act={act}
                      base={base}
                      first={i === 0}
                      last={i === primaries.length - 1}
                    />
                    {p.choiceGroup ? (
                      <div className="mt-3 border-l-4 border-sky-300 pl-3">
                        <p className="mb-2 text-sm font-bold tracking-wide text-sky-900">
                          OR
                        </p>
                        {partner ? (
                          <QuestionCard
                            p={partner}
                            editing={editing}
                            busy={busy}
                            act={act}
                            base={base}
                            first
                            last
                          />
                        ) : (
                          <p className="rounded-lg border border-dashed border-sky-300 bg-sky-50 px-3 py-2 text-[15px] text-sky-900">
                            The second option of this OR question is still
                            empty. Add a {s.marks}-mark question from the bank,
                            or press “Fill the rest automatically”.
                          </p>
                        )}
                      </div>
                    ) : null}
                  </li>
                )
              })}
              {Array.from({ length: open }, (_, k) => (
                <li key={`open-${k}`} className="px-4 py-3">
                  <p
                    className="rounded-lg border border-dashed border-slate-300 px-3 py-3 text-[15px] text-slate-600"
                    data-testid="empty-place"
                  >
                    Empty place for a {s.marks}-mark question. Choose one from
                    the question bank, or press “Fill the rest automatically”.
                  </p>
                </li>
              ))}
            </ol>
          </section>
        )
      })}
    </div>
  )
}

function Meta({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-sm font-medium text-slate-700">
      {children}
    </span>
  )
}

function UsedBadge({
  used,
}: {
  used: Array<{ exam: string; section: string; at: string }>
}) {
  if (used.length === 0) return null
  const last = used[0]
  return (
    <span
      className="rounded-md bg-amber-50 px-2 py-0.5 text-sm font-semibold text-amber-900 ring-1 ring-amber-600/25"
      title={used
        .map((u) => `${u.exam} · ${u.section} · ${formatDate(u.at)}`)
        .join('\n')}
      data-testid="used-before"
    >
      Used before: {last.exam}, {formatDate(last.at)}
      {used.length > 1 ? ` (+${used.length - 1})` : ''}
    </span>
  )
}

/** The school's own question (written on "Our questions"), not one from the PrepPlan bank. */
function OursBadge({ ours }: { ours: boolean }) {
  if (!ours) return null
  return (
    <span className="rounded-md bg-sky-50 px-2 py-0.5 text-sm font-semibold text-sky-900 ring-1 ring-sky-600/25" data-testid="ours-badge">
      Our question
    </span>
  )
}

function QuestionCard({
  p,
  editing,
  busy,
  act,
  first,
  last,
}: {
  p: Pick
  editing: boolean
  busy: string | null
  act: (
    body: Record<string, unknown>,
    label: string,
    quiet?: boolean,
  ) => Promise<{ message: string; options?: unknown } | null>
  base: string
  first: boolean
  last: boolean
}) {
  const [swap, setSwap] = useState<Array<SwapOption> | null>(null)
  const [seen, setSeen] = useState<Array<string>>([])
  const [more, setMore] = useState(false)
  const label = p.isAlternate ? '(b)' : `${p.position}.`
  async function openSwap(extra: Array<string> = []) {
    const r = await act(
      { action: 'swap_options', pickId: p.id, seen: extra },
      `swap-${p.id}`,
      true,
    )
    if (r) setSwap((r.options as Array<SwapOption> | undefined) ?? [])
  }
  return (
    <div className="space-y-2">
      <div className="flex gap-3">
        {editing && !p.isAlternate ? (
          <GripVertical
            aria-hidden="true"
            className="mt-1 hidden size-4 shrink-0 cursor-grab text-slate-400 md:block"
          />
        ) : null}
        <span className="w-8 shrink-0 text-[15px] font-bold text-slate-900">
          {label}
        </span>
        <div className="min-w-0 flex-1 space-y-2">
          <div
            className={`text-[15px] text-slate-900 ${more ? '' : 'line-clamp-3'}`}
          >
            <MathText text={p.text} />
            {p.options.length ? (
              <span className="mt-1 block text-sm text-slate-700">
                {p.options.map((o) => `(${o.label}) ${o.text}`).join('   ')}
              </span>
            ) : null}
          </div>
          {p.text.length > 180 ? (
            <button
              type="button"
              className="text-sm font-semibold text-emerald-800 underline"
              onClick={() => setMore((m) => !m)}
            >
              {more ? 'Show less' : 'Show all'}
            </button>
          ) : null}
          <div className="flex flex-wrap gap-1.5">
            <Meta>{p.chapter}</Meta>
            <Meta>{TYPE_WORD[p.type] ?? p.type}</Meta>
            <Meta>
              {p.marks} mark{p.marks === 1 ? '' : 's'}
            </Meta>
            <Meta>{p.difficulty}</Meta>
            <Meta>{p.level}</Meta>
            {p.locked ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-sm font-semibold text-emerald-800">
                <Lock aria-hidden="true" className="size-3.5" /> Locked
              </span>
            ) : null}
            <OursBadge ours={p.ours} />
            <UsedBadge used={p.usedBefore} />
          </div>
          {editing ? (
            <div className="flex flex-wrap gap-2">
              <Btn
                kind="plain"
                disabled={busy !== null}
                onClick={() => (swap ? setSwap(null) : void openSwap())}
                data-testid="swap"
              >
                <Repeat aria-hidden="true" className="size-4" /> Swap
              </Btn>
              <Btn
                kind="plain"
                disabled={busy !== null}
                onClick={() =>
                  void act(
                    { action: 'lock', pickId: p.id, locked: !p.locked },
                    `lock-${p.id}`,
                  )
                }
              >
                {p.locked ? (
                  <Unlock aria-hidden="true" className="size-4" />
                ) : (
                  <Lock aria-hidden="true" className="size-4" />
                )}
                {p.locked ? 'Unlock' : 'Lock'}
              </Btn>
              <Btn
                kind="plain"
                disabled={busy !== null}
                onClick={() =>
                  void act({ action: 'remove', pickId: p.id }, `remove-${p.id}`)
                }
              >
                <Trash2 aria-hidden="true" className="size-4" /> Remove
              </Btn>
              {!p.isAlternate ? (
                <>
                  <Btn
                    kind="plain"
                    aria-label="Move up"
                    disabled={busy !== null || first}
                    onClick={() =>
                      void act(
                        { action: 'move', pickId: p.id, direction: 'up' },
                        'move',
                        true,
                      )
                    }
                  >
                    <ArrowUp aria-hidden="true" className="size-4" />
                  </Btn>
                  <Btn
                    kind="plain"
                    aria-label="Move down"
                    disabled={busy !== null || last}
                    onClick={() =>
                      void act(
                        { action: 'move', pickId: p.id, direction: 'down' },
                        'move',
                        true,
                      )
                    }
                  >
                    <ArrowDown aria-hidden="true" className="size-4" />
                  </Btn>
                </>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
      {swap ? (
        <div
          className="ml-11 space-y-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3"
          data-testid="swap-panel"
        >
          <p className="text-[15px] font-semibold text-emerald-950">
            {swap.length
              ? 'Use one of these instead (same kind, same marks):'
              : 'The bank has no other question of this kind for these chapters.'}
          </p>
          {swap.map((o) => (
            <div
              key={o.id}
              className="space-y-2 rounded-lg border border-slate-200 bg-white p-3"
            >
              <div className="line-clamp-3 text-[15px] text-slate-900">
                <MathText text={o.text} />
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <Meta>{o.chapter}</Meta>
                {o.otherChapter ? <Meta>Another chapter</Meta> : null}
                <Meta>{o.difficulty}</Meta>
                <Meta>{o.level}</Meta>
                <UsedBadge used={o.usedBefore} />
                <span className="flex-1" />
                <Btn
                  onClick={async () => {
                    if (
                      await act(
                        { action: 'swap_to', pickId: p.id, questionId: o.id },
                        `swapto-${o.id}`,
                      )
                    )
                      setSwap(null)
                  }}
                  disabled={busy !== null}
                  data-testid="use-this"
                >
                  Use this
                </Btn>
              </div>
            </div>
          ))}
          <div className="flex gap-2">
            {swap.length === 3 ? (
              <Btn
                kind="plain"
                disabled={busy !== null}
                onClick={() => {
                  const next = [...seen, ...swap.map((o) => o.id)]
                  setSeen(next)
                  void openSwap(next)
                }}
              >
                Show 3 more
              </Btn>
            ) : null}
            <Btn kind="plain" onClick={() => setSwap(null)}>
              Cancel
            </Btn>
          </div>
        </div>
      ) : null}
    </div>
  )
}

// ---------------------------------------------------------------- the bank

function BankPanel({
  base,
  version,
  onAdd,
  busy,
}: {
  base: string
  version: number
  onAdd: (questionId: string, slot: string) => Promise<unknown>
  busy: string | null
}) {
  const [f, setF] = useState({
    q: '',
    type: '',
    marks: '',
    difficulty: '',
    level: '',
    chapter: '',
    source: '',
    hideUsed: false,
  })
  const [page, setPage] = useState(0)
  const [answers, setAnswers] = useState<Set<string>>(new Set())
  const [b, setB] = useState<Bank | null>(null)
  const [chapters, setChapters] = useState<
    Array<{ id: string; short: string; label: string }>
  >([])
  const query = useMemo(() => {
    const u = new URLSearchParams({ bank: '1', page: String(page) })
    if (f.q.trim()) u.set('q', f.q.trim())
    if (f.type) u.set('type', f.type)
    if (f.marks) u.set('marks', f.marks)
    if (f.difficulty) u.set('difficulty', f.difficulty)
    if (f.level) u.set('level', f.level)
    if (f.chapter) u.set('chapter', f.chapter)
    if (f.source) u.set('source', f.source)
    if (f.hideUsed) u.set('hide_used', '1')
    if (answers.size) u.set('answers', '1')
    return u.toString()
  }, [f, page, answers.size])
  useEffect(() => {
    const t = window.setTimeout(() => {
      void api<Bank>(`${base}?${query}`).then(setB)
    }, 200)
    return () => window.clearTimeout(t)
  }, [base, query, version])
  useEffect(() => {
    void api<View>(base).then((x) => setChapters(x.chapters))
  }, [base])
  const set = (k: keyof typeof f, val: string | boolean) => {
    setF({ ...f, [k]: val })
    setPage(0)
  }
  const select = (
    label: string,
    k: 'type' | 'marks' | 'difficulty' | 'level' | 'chapter' | 'source',
    opts: Array<[string, string]>,
  ) => (
    <label className="text-sm font-semibold text-slate-700">
      {label}
      <select
        value={f[k]}
        onChange={(e) => set(k, e.target.value)}
        className={`${inputClass} mt-1 min-h-10!`}
      >
        <option value="">Any</option>
        {opts.map(([v, t]) => (
          <option key={v} value={v}>
            {t}
          </option>
        ))}
      </select>
    </label>
  )
  return (
    <section
      className="space-y-3 rounded-xl border border-slate-200 bg-white p-4"
      data-testid="bank-panel"
    >
      <div>
        <h3 className="text-base font-bold text-slate-900">Question bank</h3>
        <p className="text-sm text-slate-600">
          Questions from the chapters you chose. Add one and it goes to the
          section that takes it.
        </p>
      </div>
      <input
        type="search"
        value={f.q}
        onChange={(e) => set('q', e.target.value)}
        placeholder="Search the questions"
        aria-label="Search the questions"
        className={inputClass}
      />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {select(
          'Chapter',
          'chapter',
          chapters.map((c) => [c.id, c.short]),
        )}
        {select('Type', 'type', Object.entries(TYPE_WORD))}
        {select(
          'Marks',
          'marks',
          [1, 2, 3, 4, 5, 6].map((m) => [
            String(m),
            `${m} mark${m === 1 ? '' : 's'}`,
          ]),
        )}
        {select('Difficulty', 'difficulty', [
          ['Easy', 'Easy'],
          ['Hard', 'Hard'],
          ['Hardest', 'Hardest'],
        ])}
        {select('Level', 'level', [
          ['Remember', 'Remember'],
          ['Think', 'Think'],
        ])}
        {select('From', 'source', [
          ['ours', 'Ours'],
          ['bank', 'PrepPlan'],
        ])}
      </div>
      <label className="flex min-h-11 items-center gap-2 text-[15px] text-slate-900">
        <input
          type="checkbox"
          checked={f.hideUsed}
          onChange={(e) => set('hideUsed', e.target.checked)}
          data-testid="hide-used"
        />
        Hide questions used in our earlier papers
      </label>
      {!b ? (
        <Loading />
      ) : b.questions.length === 0 ? (
        <p className="rounded-lg bg-slate-50 px-3 py-4 text-center text-[15px] text-slate-600">
          No question matches these choices.
        </p>
      ) : (
        <ul className="space-y-2" data-testid="bank-list">
          {b.questions.map((q) => (
            <BankCard
              key={q.id}
              q={q}
              showAnswer={answers.has(q.id)}
              toggleAnswer={() => {
                const n = new Set(answers)
                if (n.has(q.id)) n.delete(q.id)
                else n.add(q.id)
                setAnswers(n)
              }}
              onAdd={onAdd}
              busy={busy}
            />
          ))}
        </ul>
      )}
      {b && b.pages > 1 ? (
        <div className="flex items-center justify-between text-[15px] text-slate-700">
          <span>
            {b.page * 25 + 1}–{Math.min(b.total, (b.page + 1) * 25)} of{' '}
            {b.total}
          </span>
          <span className="flex gap-2">
            <Btn
              kind="plain"
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Btn>
            <Btn
              kind="plain"
              disabled={page >= b.pages - 1}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Btn>
          </span>
        </div>
      ) : null}
    </section>
  )
}

function BankCard({
  q,
  showAnswer,
  toggleAnswer,
  onAdd,
  busy,
}: {
  q: BankQ
  showAnswer: boolean
  toggleAnswer: () => void
  onAdd: (questionId: string, slot: string) => Promise<unknown>
  busy: string | null
}) {
  const [choose, setChoose] = useState(false)
  // shown as added at once, before the list is fetched again
  const [added, setAdded] = useState(false)
  const add = async (slot: string) => {
    if (await onAdd(q.id, slot)) setAdded(true)
  }
  const target = q.openSlots.at(0)
  const answer =
    'answer' in q
      ? (q as BankQ & {
          answer: string
          steps: Array<{ description: string; marks: number }>
        })
      : null
  return (
    <li
      className="space-y-2 rounded-lg border border-slate-200 p-3"
      data-testid="bank-question"
    >
      <div className="line-clamp-4 text-[15px] text-slate-900">
        <MathText text={q.text} />
        {q.options.length ? (
          <span className="mt-1 block text-sm text-slate-700">
            {q.options.map((o) => `(${o.label}) ${o.text}`).join('   ')}
          </span>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-1.5">
        <Meta>{q.chapter}</Meta>
        <Meta>{TYPE_WORD[q.type] ?? q.type}</Meta>
        <Meta>
          {q.marks} mark{q.marks === 1 ? '' : 's'}
        </Meta>
        <Meta>{q.difficulty}</Meta>
        <Meta>{q.level}</Meta>
        <OursBadge ours={q.ours} />
        <UsedBadge used={q.usedBefore} />
      </div>
      {showAnswer && answer ? (
        <div
          className="rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-800"
          data-testid="bank-answer"
        >
          <p>
            <b>Answer:</b> <MathText text={answer.answer} />
          </p>
          {answer.steps.length ? (
            <ul className="mt-1 list-disc pl-5">
              {answer.steps.map((s, i) => (
                <li key={i}>
                  {s.description} ({s.marks})
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
      <div className="flex flex-wrap items-center gap-2">
        <Btn kind="plain" onClick={toggleAnswer}>
          {showAnswer ? 'Hide answer' : 'Show answer'}
        </Btn>
        <span className="flex-1" />
        {q.inPaper || added ? (
          <Chip tone="good">On the paper</Chip>
        ) : q.why ? (
          <span className="text-sm text-slate-600">{q.why}</span>
        ) : q.openSlots.length > 1 && !choose ? (
          <Btn onClick={() => setChoose(true)} disabled={busy !== null}>
            <Plus aria-hidden="true" className="size-4" /> Add
          </Btn>
        ) : choose ? (
          q.openSlots.map((s) => (
            <Btn
              key={s.key}
              onClick={() => void add(s.key)}
              disabled={busy !== null}
            >
              Add to {s.section.split(' — ')[0]}
            </Btn>
          ))
        ) : target ? (
          <Btn
            onClick={() => void add(target.key)}
            disabled={busy !== null}
            data-testid="add-question"
          >
            <Plus aria-hidden="true" className="size-4" /> Add to{' '}
            {target.section.split(' — ')[0]}
          </Btn>
        ) : null}
      </div>
    </li>
  )
}
