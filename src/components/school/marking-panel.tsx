import { useCallback, useEffect, useState } from 'react'
import { AlertTriangle, CheckCircle2, Loader2, Pencil } from 'lucide-react'
import { Btn, Chip, Notice } from './ui'
import { api } from '../../lib/school-client'
import type {
  MarkingStatus,
  StudentRow,
  markingOverview,
  studentReport,
} from '../../lib/schools/marking'

// AI correction, step 3: marking, flags and results (M4 stage 2). The teacher marks one student at a time
// (three AI passes over the pages), sees the answers the AI was unsure of first, can change any mark with a
// reason, and reads the student's report and the class results.

export type Overview = Awaited<ReturnType<typeof markingOverview>>
export type Report = Awaited<ReturnType<typeof studentReport>>

export const STATUS_LOOK: Record<
  MarkingStatus,
  { text: string; tone: 'plain' | 'good' | 'wait' | 'bad' }
> = {
  not_uploaded: { text: 'Not uploaded', tone: 'plain' },
  ready: { text: 'Ready to mark', tone: 'plain' },
  checking: { text: 'Checking', tone: 'plain' },
  marked: { text: 'Marked', tone: 'good' },
  needs_teacher: { text: 'Needs teacher', tone: 'wait' },
  rejected: { text: 'Rejected', tone: 'bad' },
}

const LOSS: Record<string, string> = {
  knowledge_gap: "Didn't know it",
  writing_habit: "Didn't write it well",
  unclear: 'Reason unclear',
}

const num = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1))

export function StudentMarking({
  base,
  studentId,
  status,
  onChanged,
}: {
  base: string
  studentId: string
  status: StudentRow['status']
  onChanged: () => Promise<void>
}) {
  const [r, setR] = useState<Report | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setR(await api<Report>(`${base}/marking?student_id=${studentId}`))
  }, [base, studentId])
  useEffect(() => {
    void load().catch((e: unknown) =>
      setError(e instanceof Error ? e.message : 'Something went wrong.'),
    )
  }, [load, status])

  async function mark() {
    setBusy(true)
    setError(null)
    try {
      await api(`${base}/marking`, {
        body: { action: 'mark', student_id: studentId },
      })
      await load()
      await onChanged()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  const canMark = status !== 'not_uploaded'
  return (
    <div
      className="space-y-3 border-t border-slate-200 px-3.5 py-3"
      data-testid="student-marking"
    >
      {error ? <Notice kind="error">{error}</Notice> : null}
      {canMark ? (
        <Btn
          disabled={busy}
          onClick={() => void mark()}
          data-testid="mark-student"
        >
          {busy ? (
            <>
              <Loader2 aria-hidden="true" className="size-5 animate-spin" />
              Marking… this takes about a minute
            </>
          ) : status === 'marked' || status === 'needs_teacher' ? (
            'Mark again with the current pages'
          ) : (
            'Mark this student'
          )}
        </Btn>
      ) : (
        <p className="text-base text-slate-600">
          Add her answer sheets above, then she can be marked.
        </p>
      )}
      {r?.status === 'rejected' && r.message ? (
        <Notice kind="error">{r.message}</Notice>
      ) : null}
      {r && (r.status === 'marked' || r.status === 'needs_teacher') ? (
        <>
          <Report r={r} />
          <Answers r={r} base={base} reload={load} onChanged={onChanged} />
        </>
      ) : null}
    </div>
  )
}

function Report({ r }: { r: Report }) {
  const rep = r.report
  return (
    <section
      className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5"
      data-testid="student-report"
    >
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="text-lg font-bold">Report</h3>
        {r.totalMarks !== null && r.maxMarks !== null ? (
          <p className="text-2xl font-bold text-slate-900">
            {num(r.totalMarks)} <span className="text-slate-500">/ {num(r.maxMarks)}</span>
          </p>
        ) : null}
        {r.status === 'needs_teacher' ? (
          <Chip tone="wait">Provisional: answers below need you</Chip>
        ) : null}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <p className="text-sm font-semibold text-slate-700">Did well</p>
          {rep.strengths.length === 0 ? (
            <p className="text-base text-slate-600">No question with full marks.</p>
          ) : (
            <p className="text-base">
              Questions {rep.strengths.map((s) => s.questionNo).join(', ')}
            </p>
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-700">Topics to fix (did not know it)</p>
          {rep.toFix.length === 0 ? (
            <p className="text-base text-slate-600">None.</p>
          ) : (
            <ul className="text-base">
              {rep.toFix.map((t) => (
                <li key={t.questionNo}>
                  Q{t.questionNo}: lost {num(t.lost)}
                  {t.why ? ` — ${t.why}` : ''}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="sm:col-span-2">
          <p className="text-sm font-semibold text-slate-700">Writing habits (knew it, did not write it well)</p>
          {rep.writingHabits.length === 0 ? (
            <p className="text-base text-slate-600">None found.</p>
          ) : (
            <ul className="text-base">
              {rep.writingHabits.map((h) => (
                <li key={h.habit}>
                  {h.habit} <span className="text-slate-500">(lost {num(h.lost)})</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <p className="text-sm text-slate-600">
        Marks lost: {num(rep.marksLostToKnowledge)} to not knowing it,{' '}
        {num(rep.marksLostToWriting)} to how it was written.
      </p>
    </section>
  )
}

function Answers({
  r,
  base,
  reload,
  onChanged,
}: {
  r: Report
  base: string
  reload: () => Promise<void>
  onChanged: () => Promise<void>
}) {
  const sorted = [...r.answers].sort(
    (a, b) =>
      Number(b.state === 'flagged') - Number(a.state === 'flagged') ||
      Number(a.questionNo) - Number(b.questionNo),
  )
  return (
    <section className="space-y-2" data-testid="answers">
      <h3 className="text-lg font-bold">Answers</h3>
      <ul className="space-y-2">
        {sorted.map((a) => (
          <AnswerRow key={a.questionId} a={a} base={base} reload={reload} onChanged={onChanged} />
        ))}
      </ul>
    </section>
  )
}

function AnswerRow({
  a,
  base,
  reload,
  onChanged,
}: {
  a: Report['answers'][number]
  base: string
  reload: () => Promise<void>
  onChanged: () => Promise<void>
}) {
  const flagged = a.state === 'flagged'
  const [open, setOpen] = useState(flagged)
  const [marks, setMarks] = useState(String(a.finalMarks ?? 0))
  const [why, setWhy] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  async function save() {
    setBusy(true)
    setError(null)
    try {
      await api(`${base}/marking`, {
        body: {
          action: 'set_mark',
          answer_mark_id: a.answerMarkId,
          marks: Number(marks),
          reason: why,
        },
      })
      setWhy('')
      setOpen(false)
      await reload()
      await onChanged()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }
  return (
    <li
      className={`rounded-xl border p-3 ${flagged ? 'border-amber-400 bg-amber-50' : 'border-slate-200 bg-white'}`}
      data-testid={flagged ? 'flagged-answer' : 'answer'}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="min-w-0 flex-1 text-base">
          <b>Q{a.questionNo}.</b> {a.text}
        </p>
        <p className="text-lg font-bold">
          {a.finalMarks === null ? '—' : num(a.finalMarks)}{' '}
          <span className="text-slate-500">/ {num(a.maxMarks)}</span>
        </p>
      </div>
      <div className="mt-1 flex flex-wrap items-center gap-2">
        {flagged ? (
          <Chip tone="wait">
            <AlertTriangle aria-hidden="true" className="size-3.5" /> Flagged
          </Chip>
        ) : a.state === 'teacher_set' ? (
          <Chip>Set by a teacher</Chip>
        ) : (
          <Chip tone="good">
            <CheckCircle2 aria-hidden="true" className="size-3.5" /> AI mark
          </Chip>
        )}
        {a.lossKind && a.lossKind !== 'none' ? (
          <Chip>{LOSS[a.lossKind]}</Chip>
        ) : null}
      </div>
      {a.flagReason ? (
        <p className="mt-1 text-[15px] text-amber-950">{a.flagReason}</p>
      ) : null}
      {a.lossReason ? (
        <p className="mt-1 text-[15px] text-slate-700">{a.lossReason}</p>
      ) : null}
      {a.answerText ? (
        <p className="mt-1 text-[15px] text-slate-600">
          Read from the sheet: “{a.answerText}”
        </p>
      ) : null}
      {a.answerMarkId ? (
        open ? (
          <div className="mt-2 space-y-2 border-t border-slate-200 pt-2">
            {error ? <Notice kind="error">{error}</Notice> : null}
            <div className="grid gap-2 sm:grid-cols-[8rem_1fr_auto]">
              <label className="text-sm font-semibold text-slate-700">
                Mark
                <input
                  type="number"
                  min={0}
                  max={a.maxMarks}
                  step={0.5}
                  value={marks}
                  onChange={(e) => setMarks(e.target.value)}
                  className="mt-1 block min-h-11 w-full rounded-lg border border-slate-300 px-3 text-base"
                />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Why
                <input
                  type="text"
                  value={why}
                  onChange={(e) => setWhy(e.target.value)}
                  className="mt-1 block min-h-11 w-full rounded-lg border border-slate-300 px-3 text-base"
                />
              </label>
              <Btn
                className="self-end"
                disabled={busy || !why.trim()}
                onClick={() => void save()}
              >
                Save mark
              </Btn>
            </div>
          </div>
        ) : (
          <div className="mt-2">
            <Btn kind="plain" onClick={() => setOpen(true)}>
              <Pencil aria-hidden="true" className="size-4" /> Change this mark
            </Btn>
          </div>
        )
      ) : null}
    </li>
  )
}

export function ClassResults({
  base,
  version,
}: {
  base: string
  version: number
}) {
  const [o, setO] = useState<Overview | null>(null)
  useEffect(() => {
    void api<Overview>(`${base}/marking`)
      .then(setO)
      .catch(() => undefined)
  }, [base, version])
  if (!o) return null
  const c = o.class
  return (
    <section className="space-y-3" data-testid="class-results">
      <div>
        <h2 className="text-lg font-bold">Results</h2>
        {o.resultsReady ? null : (
          <p className="text-base text-slate-700">
            {c.marked === 0
              ? 'Results appear here after answer sheets have been marked.'
              : `${c.waiting} student${c.waiting === 1 ? ' is' : 's are'} not finished yet, so these are partial results.`}
          </p>
        )}
      </div>
      {c.marked > 0 ? (
        <>
          <div className="flex flex-wrap gap-2">
            <Chip tone="good">{c.marked} marked</Chip>
            {c.waiting > 0 ? <Chip tone="wait">{c.waiting} to finish</Chip> : null}
            {c.notUploaded > 0 ? <Chip>{c.notUploaded} not uploaded</Chip> : null}
            <Chip>Average {c.averagePct}%</Chip>
            <Chip>Highest {c.highest}%</Chip>
            <Chip>Lowest {c.lowest}%</Chip>
          </div>
          <p className="text-base text-slate-700">
            Marks lost across the class: {num(c.marksLostToKnowledge)} because the
            students did not know it, {num(c.marksLostToWriting)} because of how it was
            written.
          </p>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-base">
              <thead className="bg-slate-50 text-sm text-slate-700">
                <tr>
                  <th className="px-3 py-2">Roll</th>
                  <th className="px-3 py-2">Student</th>
                  <th className="px-3 py-2">Marks</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {o.students.map((s) => (
                  <tr key={s.schoolStudentId} className="border-t border-slate-100">
                    <td className="px-3 py-2">{s.rollNo}</td>
                    <td className="px-3 py-2">{s.name}</td>
                    <td className="px-3 py-2">
                      {s.totalMarks === null
                        ? '—'
                        : `${num(s.totalMarks)} / ${num(s.maxMarks ?? 0)}`}
                    </td>
                    <td className="px-3 py-2">
                      <Chip tone={STATUS_LOOK[s.status].tone}>{STATUS_LOOK[s.status].text}</Chip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <h3 className="text-base font-bold">By question: how the class did</h3>
            <ul className="mt-1 space-y-1">
              {c.perQuestion.map((q) => (
                <li key={q.questionNo} className="flex items-center gap-3 text-base">
                  <span className="w-10 shrink-0 font-semibold">Q{q.questionNo}</span>
                  <span
                    className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100"
                    role="img"
                    aria-label={`Question ${q.questionNo}: class average ${q.averagePct ?? 0} percent`}
                  >
                    <span
                      className="block h-full rounded-full bg-emerald-600"
                      style={{ width: `${q.averagePct ?? 0}%` }}
                    />
                  </span>
                  <span className="w-12 shrink-0 text-right">{q.averagePct ?? 0}%</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : null}
    </section>
  )
}
