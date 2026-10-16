import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Button } from '../../components/ui/button'
import { AdminPage, Notice, Panel, Pill, StatTile } from '../../components/admin/admin-ui'
import { REPORT_REASON_LABEL } from '../../lib/question-reports-shared'
import type { ReportReason } from '../../lib/question-reports-shared'

export const Route = createFileRoute('/admin/reports')({
  component: AdminReports,
})

type Status = 'open' | 'resolved' | 'dismissed' | 'all'

interface ReportRow {
  id: string
  reason: ReportReason
  comment: string
  status: 'open' | 'resolved' | 'dismissed'
  created_at: string
  question_id: string
  question_text: string
  question_type: string
  expected_answer: string
  student_answer: string | null
  marks_awarded: string | null
  marks_max: string | null
}

const STATUS_TONE = { open: 'warn', resolved: 'good', dismissed: 'default' } as const

/**
 * F129: the student "Report a problem" queue. Each report shows the question, its answer key and
 * what the student wrote, side by side, so a spelling-only "marked wrong" is obvious at a glance.
 * Resolving here only closes the report -- fixing or retiring the question is done in
 * /admin/questions, and a confirmed mark is corrected through the normal evaluation flow.
 */
function AdminReports() {
  const [status, setStatus] = useState<Status>('open')
  const [rows, setRows] = useState<Array<ReportRow> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pendingId, setPendingId] = useState<string | null>(null)

  useEffect(() => {
    setRows(null)
    setError(null)
    fetch(`/api/admin/question-reports?status=${status}`)
      .then((r) => {
        if (!r.ok) throw new Error()
        return r.json() as Promise<Array<ReportRow>>
      })
      .then(setRows)
      .catch(() => setError('Could not load reports.'))
  }, [status])

  async function setReportStatus(id: string, next: ReportRow['status']) {
    setPendingId(id)
    setError(null)
    try {
      const response = await fetch('/api/admin/question-reports', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id, status: next }),
      })
      if (!response.ok) {
        setError('Could not update that report.')
        return
      }
      setRows((prev) =>
        (prev ?? [])
          .map((r) => (r.id === id ? { ...r, status: next } : r))
          .filter((r) => status === 'all' || r.status === status),
      )
    } finally {
      setPendingId(null)
    }
  }

  const count = (s: ReportRow['status']) => rows?.filter((r) => r.status === s).length ?? 0

  return (
    <AdminPage
      title="Question reports"
      description="Problems students have flagged on questions, with what they wrote next to the answer key."
      actions={
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter">
          {(['open', 'resolved', 'dismissed', 'all'] as const).map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={status === s}
              onClick={() => setStatus(s)}
              className={
                'text-small rounded-full border px-3 py-1 capitalize transition-colors ' +
                (status === s
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-input hover:bg-muted')
              }
            >
              {s}
            </button>
          ))}
        </div>
      }
    >
      {status === 'all' && rows && rows.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <StatTile label="Open" value={count('open')} tone={count('open') > 0 ? 'warn' : 'default'} />
          <StatTile label="Resolved" value={count('resolved')} tone="good" />
          <StatTile label="Dismissed" value={count('dismissed')} />
        </div>
      )}

      {error && <Notice tone="bad">{error}</Notice>}
      {rows === null && !error && <Notice>Loading reports…</Notice>}
      {rows?.length === 0 && <Notice>No {status === 'all' ? '' : status} reports.</Notice>}

      <div className="space-y-4">
        {rows?.map((r) => (
          <Panel key={r.id}>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Pill tone={STATUS_TONE[r.status]}>{r.status}</Pill>
              <Pill>{REPORT_REASON_LABEL[r.reason]}</Pill>
              <span className="text-caption text-muted-foreground">
                {new Date(r.created_at).toLocaleDateString()}
              </span>
            </div>
            <h3 className="question-text mb-3 font-semibold">{r.question_text}</h3>
            <div className="space-y-3">
              <div className="answer-box">
                <p className="field-label">Student says</p>
                <p className="answer-text">{r.comment}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="answer-box answer-box-mine">
                  <p className="field-label">
                    Student answered
                    {r.marks_max !== null && ` · ${Number(r.marks_awarded)}/${Number(r.marks_max)}`}
                  </p>
                  <p className="answer-text whitespace-pre-wrap">
                    {r.student_answer || '(blank / not yet answered)'}
                  </p>
                </div>
                <div className="answer-box answer-box-right">
                  <p className="field-label">Answer key</p>
                  <p className="answer-text whitespace-pre-wrap">{r.expected_answer}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {r.status !== 'resolved' && (
                  <Button
                    size="sm"
                    disabled={pendingId === r.id}
                    onClick={() => void setReportStatus(r.id, 'resolved')}
                  >
                    Mark resolved
                  </Button>
                )}
                {r.status !== 'dismissed' && (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={pendingId === r.id}
                    onClick={() => void setReportStatus(r.id, 'dismissed')}
                  >
                    Dismiss
                  </Button>
                )}
                {r.status !== 'open' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={pendingId === r.id}
                    onClick={() => void setReportStatus(r.id, 'open')}
                  >
                    Reopen
                  </Button>
                )}
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </AdminPage>
  )
}
