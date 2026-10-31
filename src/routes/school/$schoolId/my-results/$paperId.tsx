import { useCallback, useEffect, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { CheckCircle2, Flag } from 'lucide-react'
import {
  Btn,
  Card,
  Chip,
  Loading,
  Notice,
  PageHeader,
} from '../../../../components/school/ui'
import { api } from '../../../../lib/school-client'
import type { myResult } from '../../../../lib/schools/results-release'

export const Route = createFileRoute('/school/$schoolId/my-results/$paperId')({
  component: MyResult,
})

type R = Awaited<ReturnType<typeof myResult>>
type A = R['answers'][number]

const day = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
const num = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1))
const LOSS: Record<string, string> = {
  knowledge_gap: "You didn't know this one",
  writing_habit: 'You knew it, but it was not written well enough',
  unclear: 'Reason not clear',
}

// One released paper, for the student it belongs to (M4): her marks, the correct answer next to her own, what
// to work on, and the flags she may raise while the window is open. No answer key can be downloaded.
function MyResult() {
  const { schoolId, paperId } = Route.useParams()
  const base = `/api/schools/${schoolId}/my-results/${paperId}`
  const [r, setR] = useState<R | null>(null)
  const [error, setError] = useState<string | null>(null)
  const load = useCallback(async () => {
    setR(await api<R>(base))
  }, [base])
  useEffect(() => {
    void load().catch((e: unknown) =>
      setError(e instanceof Error ? e.message : 'Something went wrong.'),
    )
  }, [load])
  if (error) return <Notice kind="error">{error}</Notice>
  if (!r) return <Loading />
  const rep = r.report
  return (
    <div className="space-y-4" data-testid="my-result">
      <PageHeader
        back={
          <Link to="/school/$schoolId/my-results" params={{ schoolId }}>
            My results
          </Link>
        }
        title={r.title}
        subtitle={
          <span className="text-2xl font-bold text-slate-900">
            {r.totalMarks} <span className="text-slate-500">/ {r.maxMarks}</span>
          </span>
        }
      />
      {r.locked ? (
        <Notice>These marks are final.</Notice>
      ) : r.windowOpen ? (
        <Notice kind="good">
          If you think a mark is wrong, flag it before {day(r.windowClosesAt)}. You can flag{' '}
          {r.flagsLeft} more {r.flagsLeft === 1 ? 'answer' : 'answers'} (at most {r.flagsAllowed}).
        </Notice>
      ) : (
        <Notice>The time to flag answers is over. Your teacher is finishing the last flags.</Notice>
      )}

      <Card>
        <h2 className="mb-2 text-lg font-bold">What to work on</h2>
        <div className="space-y-3 text-base">
          <p>
            <b>Did well:</b>{' '}
            {rep.strengths.length === 0
              ? 'No question with full marks this time.'
              : `Questions ${rep.strengths.map((s) => s.questionNo).join(', ')}.`}
          </p>
          <div>
            <b>Topics to learn again</b> (you lost marks because the idea was not there):
            {rep.toFix.length === 0 ? (
              <p>None. Well done.</p>
            ) : (
              <ul className="list-disc pl-5">
                {rep.toFix.map((t) => (
                  <li key={t.questionNo}>
                    Question {t.questionNo}: {t.text}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <b>How you write</b> (you knew it, but marks were lost in the writing):
            {rep.writingHabits.length === 0 ? (
              <p>Nothing to fix here.</p>
            ) : (
              <ul className="list-disc pl-5">
                {rep.writingHabits.map((h) => (
                  <li key={h.habit}>{h.habit}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Card>

      <ul className="space-y-3">
        {r.answers.map((a) => (
          <Answer key={a.questionNo} a={a} base={base} reload={load} />
        ))}
      </ul>
    </div>
  )
}

function Answer({ a, base, reload }: { a: A; base: string; reload: () => Promise<void> }) {
  const [open, setOpen] = useState(false)
  const [why, setWhy] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  async function post(body: Record<string, unknown>) {
    setBusy(true)
    setError(null)
    try {
      await api(base, { body })
      setOpen(false)
      setWhy('')
      await reload()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }
  const d = a.dispute
  return (
    <li className="space-y-2 rounded-2xl border border-slate-200 bg-white p-3.5" data-testid="my-answer">
      <div className="flex items-start justify-between gap-2">
        <p className="min-w-0 flex-1 text-base">
          <b>Q{a.questionNo}.</b> {a.text}
        </p>
        <p className="text-xl font-bold">
          {a.marks === null ? '—' : num(a.marks)} <span className="text-slate-500">/ {num(a.maxMarks)}</span>
        </p>
      </div>
      {a.yourAnswer ? <p className="text-[15px] text-slate-700"><b>Your answer:</b> {a.yourAnswer}</p> : null}
      <p className="text-[15px] text-slate-700"><b>Correct answer:</b>{' '}
        {a.correctAnswer.replace(/^Correct option:\s*/, '')}</p>
      {a.lossKind && a.lossKind !== 'none' ? (
        <p className="text-[15px]">
          <Chip tone="wait">{LOSS[a.lossKind]}</Chip>
          {a.lossReason ? <span className="ml-2 text-slate-700">{a.lossReason}</span> : null}
        </p>
      ) : (
        <p className="flex items-center gap-1 text-[15px] text-emerald-800">
          <CheckCircle2 aria-hidden="true" className="size-4" /> Full marks
        </p>
      )}
      {d ? (
        <div className="space-y-1 rounded-xl bg-slate-50 p-3 text-[15px]" data-testid="my-dispute">
          <p><b>You flagged this:</b> {d.reason}</p>
          {d.aiReply ? <p>{d.aiReply}</p> : null}
          {d.status === 'with_teacher' ? <p><b>Your teacher is looking at it.</b></p> : null}
          {d.status === 'resolved' && d.decisionNote ? (
            <p><b>Your teacher decided:</b> {num(d.marksAfter ?? 0)} / {num(a.maxMarks)}. {d.decisionNote}</p>
          ) : null}
          {d.canAskTeacher ? (
            <Btn kind="plain" disabled={busy} onClick={() => void post({ action: 'ask_teacher', dispute_id: d.id })}>
              Ask my teacher to look at it
            </Btn>
          ) : null}
        </div>
      ) : a.canFlag ? (
        open ? (
          <div className="space-y-2 border-t border-slate-200 pt-2">
            {error ? <Notice kind="error">{error}</Notice> : null}
            <label className="block text-sm font-semibold text-slate-700">
              Why do you think this mark is wrong? (Please do not write your name.)
              <textarea
                value={why}
                maxLength={500}
                onChange={(e) => setWhy(e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-base"
              />
            </label>
            <div className="grid gap-2 sm:grid-cols-2">
              <Btn disabled={busy || why.trim().length < 5} onClick={() => void post({ action: 'flag', answer_mark_id: a.answerMarkId, reason: why })}>
                {busy ? 'Looking again…' : 'Send'}
              </Btn>
              <Btn kind="plain" disabled={busy} onClick={() => setOpen(false)}>Cancel</Btn>
            </div>
          </div>
        ) : (
          <Btn kind="plain" onClick={() => setOpen(true)}>
            <Flag aria-hidden="true" className="size-4" /> I think this mark is wrong
          </Btn>
        )
      ) : null}
      {!d && error ? <Notice kind="error">{error}</Notice> : null}
    </li>
  )
}
