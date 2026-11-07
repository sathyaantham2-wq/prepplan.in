import { useCallback, useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Button } from '../../components/ui/button'
import { AdminPage, Notice, Panel, Pill, StatTile } from '../../components/admin/admin-ui'
import { REPORT_REASON_LABEL } from '../../lib/question-reports-shared'
import type { ReportReason } from '../../lib/question-reports-shared'
import { formatDate } from '../../lib/dates'

export const Route = createFileRoute('/admin/quality')({
  component: AdminQuality,
})

type Status = 'open' | 'decided' | 'dismissed'

interface Signal {
  key: string
  kind: string
  severity: number
  n: number
  detail: string
}

interface CaseView {
  id: string
  status: Status
  severity: number
  signals: Array<Signal>
  stats: {
    firstExposures: number
    firstCorrect: number
    blank: number
    optionCounts: Record<string, number>
    medianTimeSec: number | null
    shrunkCorrectRate: number
    cellCorrectRate: number
  } | null
  decision: string | null
  decisionNote: string | null
  decidedAt: string | null
  createdAt: string
  question: {
    id: string
    text: string
    type: string
    answer: string
    difficulty: string
    bloom: string
    marks: number
    status: string
    subject: string
    classLevel: number
    chapter: string
    concept: string
    options: Array<{ label: string; text: string; isCorrect: boolean }>
  }
  reports: Array<{ reason: ReportReason; comment: string; createdAt: string }>
  cellApprovedCount: number
  markedAnswers: number
  schoolExamUses: number
}

interface RefreshSummary {
  answersUsed: number
  questionsWithStats: number
  casesOpened: number
  casesUpdated: number
}

const SEVERITY_LABEL: Record<number, string> = { 3: 'Likely wrong', 2: 'Probably wrong', 1: 'Worth a look' }
const SEVERITY_TONE = { 3: 'bad', 2: 'warn', 1: 'default' } as const
const DECISION_LABEL: Record<string, string> = {
  retire: 'Retired',
  fix_key: 'Key fixed',
  retag: 'Difficulty changed',
  dismiss: 'Dismissed',
}

const pct = (x: number) => `${Math.round(x * 100)}%`

/**
 * The question-bank quality queue (docs/QUALITY_LOOP_PLAN.md). The detectors look at first-time answers from
 * PrepPlan students (never school students) and at every open student report, and put a question here when
 * something looks off. Nothing changes until a person decides. A wrong key is fixed by retiring the question and
 * adding a corrected copy, so past papers and marks are never rewritten.
 */
function AdminQuality() {
  const [status, setStatus] = useState<Status>('open')
  const [data, setData] = useState<{ total: number; cases: Array<CaseView> } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [summary, setSummary] = useState<RefreshSummary | null>(null)

  const load = useCallback(() => {
    setData(null)
    setError(null)
    fetch(`/api/admin/quality?status=${status}`)
      .then((r) => {
        if (!r.ok) throw new Error()
        return r.json() as Promise<{ total: number; cases: Array<CaseView> }>
      })
      .then(setData)
      .catch(() => setError('Could not load the quality queue.'))
  }, [status])

  useEffect(load, [load])

  async function refresh() {
    setRefreshing(true)
    setError(null)
    try {
      const r = await fetch('/api/admin/quality', { method: 'POST' })
      if (!r.ok) throw new Error()
      setSummary((await r.json()) as RefreshSummary)
      load()
    } catch {
      setError('Could not refresh the statistics.')
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <AdminPage
      title="Question quality"
      description="Questions that students reported, or whose answers look wrong, waiting for your decision. Most severe first."
      actions={
        <Button size="sm" onClick={() => void refresh()} disabled={refreshing}>
          {refreshing ? 'Checking…' : 'Check latest answers'}
        </Button>
      }
    >
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter">
        {(['open', 'decided', 'dismissed'] as const).map((s) => (
          <button
            key={s}
            type="button"
            aria-pressed={status === s}
            onClick={() => setStatus(s)}
            className={
              'text-small rounded-full border px-3 py-1 capitalize transition-colors ' +
              (status === s ? 'border-primary bg-primary text-primary-foreground' : 'border-input hover:bg-muted')
            }
          >
            {s}
          </button>
        ))}
      </div>

      {summary && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile label="First-time answers read" value={summary.answersUsed} />
          <StatTile label="Questions with data" value={summary.questionsWithStats} />
          <StatTile label="New cases" value={summary.casesOpened} tone={summary.casesOpened > 0 ? 'warn' : 'default'} />
          <StatTile label="Cases updated" value={summary.casesUpdated} />
        </div>
      )}

      {error && <Notice tone="bad">{error}</Notice>}
      {data === null && !error && <Notice>Loading…</Notice>}
      {data && data.cases.length === 0 && (
        <Notice>
          {status === 'open'
            ? 'Nothing waiting. Press "Check latest answers" to look at new answers and reports.'
            : `No ${status} cases yet.`}
        </Notice>
      )}
      {data && data.total > data.cases.length && (
        <Notice>
          Showing the {data.cases.length} most severe of {data.total}. Decide these first; the rest move up.
        </Notice>
      )}

      <div className="space-y-4">
        {data?.cases.map((c) => (
          <CaseCard key={c.id} c={c} onDecided={load} />
        ))}
      </div>
    </AdminPage>
  )
}

function CaseCard({ c, onDecided }: { c: CaseView; onDecided: () => void }) {
  const [note, setNote] = useState('')
  const [label, setLabel] = useState('')
  const [answerText, setAnswerText] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const q = c.question
  const hasOptions = q.options.length > 0
  const total = c.stats ? Object.values(c.stats.optionCounts).reduce((a, b) => a + b, 0) : 0

  async function decide(body: Record<string, unknown>) {
    setPending(true)
    setError(null)
    try {
      const r = await fetch('/api/admin/quality', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ caseId: c.id, note, ...body }),
      })
      if (!r.ok) {
        const e = (await r.json().catch(() => ({}))) as { error?: string }
        setError(`Could not save that decision (${e.error ?? r.status}).`)
        return
      }
      onDecided()
    } finally {
      setPending(false)
    }
  }

  return (
    <Panel>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        {c.status === 'open' ? (
          <Pill tone={SEVERITY_TONE[c.severity as 1 | 2 | 3]}>{SEVERITY_LABEL[c.severity]}</Pill>
        ) : (
          <Pill tone="good">{DECISION_LABEL[c.decision ?? ''] ?? c.status}</Pill>
        )}
        <Pill>
          {q.subject} · Class {q.classLevel}
        </Pill>
        <Pill>
          {q.difficulty} · {q.bloom} · {q.type}
        </Pill>
        <span className="text-caption text-muted-foreground">
          {q.chapter} · {q.concept}
        </span>
      </div>

      <ul className="text-small mb-3 list-disc pl-5">
        {c.signals.map((s) => (
          <li key={s.key}>{s.detail}</li>
        ))}
      </ul>

      <h3 className="question-text mb-3 font-semibold whitespace-pre-wrap">{q.text}</h3>

      {hasOptions ? (
        <ul className="mb-3 space-y-1">
          {q.options.map((o) => {
            const n = c.stats?.optionCounts[o.label] ?? 0
            return (
              <li
                key={o.label}
                className={'text-small rounded-lg border px-3 py-1.5 ' + (o.isCorrect ? 'answer-box-right' : '')}
              >
                <span className="font-semibold">{o.label}.</span> {o.text}
                {o.isCorrect && <span className="ml-2 font-semibold">(key)</span>}
                {total > 0 && (
                  <span className="text-muted-foreground ml-2">
                    chosen by {n} of {total}
                  </span>
                )}
              </li>
            )
          })}
        </ul>
      ) : (
        <div className="answer-box answer-box-right mb-3">
          <p className="field-label">Answer key</p>
          <p className="answer-text whitespace-pre-wrap">{q.answer}</p>
        </div>
      )}

      <p className="text-small text-muted-foreground mb-3">
        {c.stats
          ? `${c.stats.firstExposures} first-time answers · ${c.stats.firstCorrect} right · estimated ${pct(c.stats.shrunkCorrectRate)} right (similar questions ${pct(c.stats.cellCorrectRate)})` +
            (c.stats.medianTimeSec != null ? ` · typical time ${c.stats.medianTimeSec}s` : '')
          : 'No answer data yet.'}
        {` · used in ${c.markedAnswers} marked answer${c.markedAnswers === 1 ? '' : 's'}`}
        {c.schoolExamUses > 0 && ` · in ${c.schoolExamUses} school exam paper${c.schoolExamUses === 1 ? '' : 's'}`}
      </p>

      {c.reports.length > 0 && (
        <div className="mb-3 space-y-2">
          {c.reports.map((r, i) => (
            <div key={i} className="answer-box">
              <p className="field-label">
                {REPORT_REASON_LABEL[r.reason]} · {formatDate(r.createdAt)}
              </p>
              <p className="answer-text">{r.comment}</p>
            </div>
          ))}
        </div>
      )}

      {c.status !== 'open' ? (
        c.decisionNote && <p className="text-small">Note: {c.decisionNote}</p>
      ) : (
        <div className="space-y-3 border-t pt-3">
          <textarea
            className="border-input w-full rounded-lg border px-3 py-2 text-sm"
            rows={2}
            placeholder="Note for the record (optional): why you decided this"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant="outline" disabled={pending} onClick={() => void decide({ decision: 'dismiss' })}>
              Nothing wrong
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={pending}
              onClick={() => {
                const left = c.cellApprovedCount - 1
                if (window.confirm(`Retire this question? ${left} similar question${left === 1 ? '' : 's'} will be left in its group.`)) {
                  void decide({ decision: 'retire' })
                }
              }}
            >
              Retire (leaves {c.cellApprovedCount - 1} similar)
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {hasOptions ? (
              <select
                className="border-input rounded-lg border px-2 py-1 text-sm"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                aria-label="Correct option"
              >
                <option value="">Correct option is…</option>
                {q.options
                  .filter((o) => !o.isCorrect)
                  .map((o) => (
                    <option key={o.label} value={o.label}>
                      {o.label}
                    </option>
                  ))}
              </select>
            ) : (
              <input
                className="border-input min-w-64 rounded-lg border px-2 py-1 text-sm"
                placeholder="Correct answer"
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
              />
            )}
            <Button
              size="sm"
              disabled={pending || (hasOptions ? !label : !answerText.trim())}
              onClick={() =>
                void decide(hasOptions ? { decision: 'fix_key', correctLabel: label } : { decision: 'fix_key', answerText })
              }
            >
              Fix the key
            </Button>
            <select
              className="border-input rounded-lg border px-2 py-1 text-sm"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              aria-label="New difficulty"
            >
              <option value="">Difficulty should be…</option>
              {['Easy', 'Hard', 'Hardest']
                .filter((d) => d !== q.difficulty)
                .map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
            </select>
            <Button
              size="sm"
              variant="outline"
              disabled={pending || !difficulty}
              onClick={() => void decide({ decision: 'retag', difficulty })}
            >
              Change difficulty
            </Button>
          </div>
          {error && <Notice tone="bad">{error}</Notice>}
        </div>
      )}
    </Panel>
  )
}
