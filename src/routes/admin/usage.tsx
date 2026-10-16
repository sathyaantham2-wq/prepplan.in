import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Label } from '../../components/ui/label'
import { AdminPage, BarChart, BarList, Notice, Panel, StatTile } from '../../components/admin/admin-ui'

export const Route = createFileRoute('/admin/usage')({ component: AdminUsage })

type GroupBy = 'day' | 'feature' | 'student'

interface UsageBucket {
  group_key: string | null
  label: string
  calls: number
  tokens_in: number
  tokens_out: number
  cost_inr: number
  avg_latency_ms: number | null
  error_count: number
}

interface UsageReport {
  from: string
  to: string
  group_by: GroupBy
  totals: {
    calls: number
    tokens_in: number
    tokens_out: number
    cost_inr: number
    error_count: number
  }
  buckets: Array<UsageBucket>
}

const inr = (n: number) => `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
const compact = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `${(n / 1_000).toFixed(1)}k` : String(n)

/**
 * F091 (tab06 /admin/usage, "AI usage & cost"): tokens and cost by day, feature and student, from
 * the ai_jobs log every AI-*.ts call site now writes to. Rate-limit status and alerts (also named
 * in tab06's Key Elements) belong to F092/F121 -- separate not-yet-built features -- so this
 * screen sticks to what F091's own AC actually promises: logging and this dashboard.
 * The admin guard lives in the /admin layout route; the API enforces admin on the server.
 */
function AdminUsage() {
  const [groupBy, setGroupBy] = useState<GroupBy>('day')
  const [report, setReport] = useState<UsageReport | null>(null)
  const [dayReport, setDayReport] = useState<UsageReport | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    setLoadError(null)
    fetch(`/api/admin/ai-usage?group_by=${groupBy}`)
      .then(async (r) => {
        if (!r.ok) throw new Error('Could not load AI usage.')
        return r.json() as Promise<UsageReport>
      })
      .then((data) => {
        setReport(data)
        if (groupBy === 'day') setDayReport(data)
      })
      .catch((err: Error) => setLoadError(err.message))
  }, [groupBy])

  // The daily chart always shows days, whatever the table below is grouped by.
  useEffect(() => {
    if (groupBy === 'day' || dayReport) return
    fetch('/api/admin/ai-usage?group_by=day')
      .then((r) => (r.ok ? (r.json() as Promise<UsageReport>) : null))
      .then((d) => d && setDayReport(d))
      .catch(() => undefined)
  }, [groupBy, dayReport])

  const t = report?.totals
  const errorRate = t && t.calls > 0 ? (t.error_count / t.calls) * 100 : 0
  const days = dayReport ? [...dayReport.buckets].sort((a, b) => a.label.localeCompare(b.label)) : []
  const ranked = report && report.group_by !== 'day' ? [...report.buckets].sort((a, b) => b.cost_inr - a.cost_inr).slice(0, 8) : []

  const groupSelect = (
    <div className="flex items-center gap-2">
      <Label htmlFor="group-by" className="field-label">
        Group by
      </Label>
      <select
        id="group-by"
        className="border-input bg-card flex h-9 rounded-md border px-3 text-sm shadow-xs"
        value={groupBy}
        onChange={(e) => setGroupBy(e.target.value as GroupBy)}
      >
        <option value="day">Day</option>
        <option value="feature">Feature</option>
        <option value="student">Student</option>
      </select>
    </div>
  )

  return (
    <AdminPage
      title="AI usage & cost"
      description="Trailing 30 days of every logged AI call: tokens, cost and latency."
      actions={groupSelect}
    >
      {loadError && <Notice tone="bad">{loadError}</Notice>}
      {!report && !loadError && <Notice>Loading AI usage…</Notice>}

      {t && (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatTile label="Spend" value={inr(t.cost_inr)} hint="Last 30 days" />
          <StatTile label="Calls" value={t.calls.toLocaleString('en-IN')} hint={t.calls > 0 ? `${inr(t.cost_inr / t.calls)} per call` : undefined} />
          <StatTile
            label="Tokens"
            value={compact(t.tokens_in + t.tokens_out)}
            hint={`${t.tokens_in.toLocaleString('en-IN')} in / ${t.tokens_out.toLocaleString('en-IN')} out`}
          />
          <StatTile
            label="Error rate"
            value={`${errorRate.toFixed(1)}%`}
            tone={t.error_count === 0 ? 'good' : errorRate > 5 ? 'bad' : 'warn'}
            hint={`${t.error_count} error${t.error_count === 1 ? '' : 's'}`}
          />
        </div>
      )}

      {days.length > 0 && (
        <Panel title="Daily cost" subtitle="Spend per day, in rupees">
          <BarChart
            data={days.map((d) => d.cost_inr)}
            labelFirst={days[0].label}
            labelLast={days[days.length - 1].label}
          />
        </Panel>
      )}

      {ranked.length > 0 && (
        <Panel title={report?.group_by === 'feature' ? 'Cost by feature' : 'Cost by student'} subtitle="Top 8 by spend">
          <BarList
            items={ranked.map((b) => ({
              label: b.label,
              value: b.cost_inr,
              sub: `${b.calls} calls`,
            }))}
            format={inr}
          />
        </Panel>
      )}

      {report && (
        <Panel title="Detail">
          <div className="-mx-4 overflow-x-auto sm:-mx-5">
            <table className="text-small w-full min-w-[640px] border-collapse">
              <thead>
                <tr className="text-muted-foreground border-border border-b text-left">
                  {[
                    report.group_by === 'day' ? 'Day' : report.group_by === 'feature' ? 'Feature' : 'Student',
                    'Calls',
                    'Tokens in',
                    'Tokens out',
                    'Cost (₹)',
                    'Avg latency (ms)',
                    'Errors',
                  ].map((h, i) => (
                    <th key={h} className={`field-label px-4 py-2 font-semibold first:pl-4 sm:first:pl-5 ${i > 0 ? 'text-right' : ''}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {report.buckets.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-muted-foreground p-4 text-center">
                      No AI calls logged in this window.
                    </td>
                  </tr>
                )}
                {report.buckets.map((bucket) => (
                  <tr key={bucket.group_key ?? 'null'} className="border-border hover:bg-muted/50 border-t tabular-nums">
                    <td className="px-4 py-2 font-medium sm:pl-5">{bucket.label}</td>
                    <td className="px-4 py-2 text-right">{bucket.calls}</td>
                    <td className="px-4 py-2 text-right">{bucket.tokens_in}</td>
                    <td className="px-4 py-2 text-right">{bucket.tokens_out}</td>
                    <td className="px-4 py-2 text-right">{bucket.cost_inr.toFixed(2)}</td>
                    <td className="px-4 py-2 text-right">
                      {bucket.avg_latency_ms === null ? '—' : Math.round(bucket.avg_latency_ms)}
                    </td>
                    <td className={`px-4 py-2 text-right ${bucket.error_count > 0 ? 'text-[var(--bad)]' : ''}`}>
                      {bucket.error_count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}
    </AdminPage>
  )
}
