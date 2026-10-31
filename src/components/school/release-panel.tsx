import { useCallback, useEffect, useState } from 'react'
import { Lock, Send } from 'lucide-react'
import { Btn, Chip, Notice } from './ui'
import { api } from '../../lib/school-client'
import type {
  SectionRelease,
  disputeQueue,
} from '../../lib/schools/results-release'

// Releasing marked results to the students, and the flags they raise (M4). A section is released once nobody
// in it is waiting for marking or a teacher's look; the students then have the school's dispute window to flag
// answers. The teacher's decision on a flag the AI kept is final.

type Dispute = Awaited<ReturnType<typeof disputeQueue>>[number]

const day = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
const num = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1))

export function ReleasePanel({
  base,
  version,
  onChanged,
}: {
  base: string
  version: number
  onChanged: () => void
}) {
  const [d, setD] = useState<{
    sections: Array<SectionRelease>
    disputes: Array<Dispute>
  } | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const load = useCallback(async () => {
    setD(
      await api<{ sections: Array<SectionRelease>; disputes: Array<Dispute> }>(
        `${base}/release`,
      ),
    )
  }, [base])
  useEffect(() => {
    void load().catch(() => undefined)
  }, [load, version])
  if (!d) return null

  async function release(sectionId: string) {
    setBusy(sectionId)
    setError(null)
    try {
      await api(`${base}/release`, {
        body: { action: 'release', section_id: sectionId },
      })
      await load()
      onChanged()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setBusy(null)
    }
  }

  const waiting = d.disputes.filter((x) => x.status === 'with_teacher')
  const done = d.disputes.filter((x) => x.status !== 'with_teacher')
  return (
    <section className="space-y-3" data-testid="release-panel">
      <div>
        <h2 className="text-lg font-bold">Release to students</h2>
        <p className="text-base text-slate-700">
          Release a section when everyone in it is marked. Students then see
          their own marks and can flag answers for a few days.
        </p>
      </div>
      {error ? <Notice kind="error">{error}</Notice> : null}
      <ul className="space-y-2">
        {d.sections.map((s) => (
          <li
            key={s.sectionId}
            className="space-y-2 rounded-2xl border border-slate-200 bg-white p-3.5"
            data-testid="release-section"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-base font-semibold">
                Section {s.name}{' '}
                <span className="font-normal text-slate-600">
                  · {s.marked} of {s.students} marked
                </span>
              </p>
              {s.released ? (
                s.released.locked ? (
                  <Chip>
                    <Lock aria-hidden="true" className="size-3.5" /> Locked
                  </Chip>
                ) : (
                  <Chip tone="good">Released</Chip>
                )
              ) : null}
            </div>
            {s.released ? (
              <p className="text-base text-slate-700">
                Released on {day(s.released.at)}.{' '}
                {s.released.locked
                  ? 'The marks are final.'
                  : `Students can flag answers until ${day(s.released.windowClosesAt)} (${s.released.windowDays} days).`}
              </p>
            ) : s.blockers.length > 0 ? (
              <ul className="list-disc pl-5 text-base text-amber-950">
                {s.blockers.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            ) : null}
            {!s.released ? (
              <Btn
                disabled={!s.canRelease || busy !== null}
                onClick={() => void release(s.sectionId)}
                data-testid="release-button"
              >
                <Send aria-hidden="true" className="size-5" />
                {busy === s.sectionId ? 'Releasing…' : `Release Section ${s.name} to students`}
              </Btn>
            ) : null}
          </li>
        ))}
      </ul>

      {waiting.length > 0 ? (
        <div className="space-y-2" data-testid="dispute-queue">
          <h3 className="text-base font-bold">
            Flags waiting for you ({waiting.length})
          </h3>
          <ul className="space-y-2">
            {waiting.map((x) => (
              <DisputeCard key={x.id} x={x} base={base} onDone={async () => { await load(); onChanged() }} />
            ))}
          </ul>
        </div>
      ) : null}
      {done.length > 0 ? (
        <details className="text-base">
          <summary className="cursor-pointer font-semibold text-slate-700">
            Flags already settled ({done.length})
          </summary>
          <ul className="mt-2 space-y-1">
            {done.map((x) => (
              <li key={x.id} className="text-[15px] text-slate-700">
                {x.student}, Q{x.questionNo}:{' '}
                {x.status === 'resolved'
                  ? `${num(x.marksBefore)} to ${num(x.marksAfter ?? x.marksBefore)}`
                  : 'the AI kept the mark; not sent to you'}
                {x.decisionNote ? ` — ${x.decisionNote}` : ''}
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </section>
  )
}

function DisputeCard({
  x,
  base,
  onDone,
}: {
  x: Dispute
  base: string
  onDone: () => Promise<void>
}) {
  const [marks, setMarks] = useState(String(x.marksNow ?? x.marksBefore))
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  async function decide() {
    setBusy(true)
    setError(null)
    try {
      await api(`${base}/release`, {
        body: { action: 'decide', dispute_id: x.id, marks: Number(marks), note },
      })
      await onDone()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }
  return (
    <li
      className="space-y-2 rounded-xl border border-amber-300 bg-amber-50 p-3"
      data-testid="dispute"
    >
      <p className="text-base">
        <b>
          {x.student} (roll {x.rollNo}) · Q{x.questionNo}
        </b>{' '}
        — {x.question}
      </p>
      {x.answerText ? (
        <p className="text-[15px] text-slate-700">Read from the sheet: “{x.answerText}”</p>
      ) : null}
      <p className="text-base">
        <b>She says:</b> {x.reason}
      </p>
      <p className="text-[15px] text-slate-700">
        {x.aiReply ?? 'The AI could not look at it again.'} Mark now: {num(x.marksNow ?? x.marksBefore)} of {num(x.maxMarks)}.
      </p>
      {error ? <Notice kind="error">{error}</Notice> : null}
      <div className="grid gap-2 sm:grid-cols-[7rem_1fr_auto]">
        <label className="text-sm font-semibold text-slate-700">
          Final mark
          <input
            type="number"
            min={0}
            max={x.maxMarks}
            step={0.5}
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
            className="mt-1 block min-h-11 w-full rounded-lg border border-slate-300 px-3 text-base"
          />
        </label>
        <label className="text-sm font-semibold text-slate-700">
          Why (the student will see this)
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mt-1 block min-h-11 w-full rounded-lg border border-slate-300 px-3 text-base"
          />
        </label>
        <Btn className="self-end" disabled={busy || !note.trim()} onClick={() => void decide()}>
          Decide (final)
        </Btn>
      </div>
    </li>
  )
}
