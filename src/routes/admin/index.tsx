import { useCallback, useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { RefreshCw } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { AdminPage, BarChart, BarList, Delta, Notice, Panel, Pill, StatTile } from '../../components/admin/admin-ui'
import type { AdminOverview } from '../../db/repositories'

export const Route = createFileRoute('/admin/')({ component: AdminOverviewPage })

const inr = (n: number) => `₹${n.toLocaleString('en-IN', { maximumFractionDigits: n < 100 ? 2 : 0 })}`

function shortDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: 'UTC' })
}

function ago(iso: string): string {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 3600) return `${Math.max(1, Math.round(s / 60))} min ago`
  if (s < 86400) return `${Math.round(s / 3600)} h ago`
  return `${Math.round(s / 86400)} d ago`
}

function AdminOverviewPage() {
  const [data, setData] = useState<(AdminOverview & { fixtureSubjectsActive?: Array<string> }) | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    setBusy(true)
    setError(null)
    try {
      const r = await fetch('/api/admin/overview')
      if (!r.ok) throw new Error('Could not load the overview.')
      setData((await r.json()) as AdminOverview & { fixtureSubjectsActive?: Array<string> })
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setBusy(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const refresh = (
    <Button variant="outline" size="sm" onClick={() => void load()} disabled={busy}>
      <RefreshCw className={busy ? 'animate-spin' : ''} />
      Refresh
    </Button>
  )

  if (!data) {
    return (
      <AdminPage title="Overview" description="How PrepPlan is doing right now." actions={refresh}>
        {error ? <Notice tone="bad">{error}</Notice> : <Notice>Loading the numbers…</Notice>}
      </AdminPage>
    )
  }

  const first = shortDate(data.days[0])
  const last = shortDate(data.days[data.days.length - 1])
  const attention: Array<{ text: string; href: string; tone: 'warn' | 'bad' }> = []
  if (data.usage.awaiting_confirmation > 0)
    attention.push({ text: `${data.usage.awaiting_confirmation} evaluation${data.usage.awaiting_confirmation === 1 ? '' : 's'} not yet confirmed`, href: '/admin/activity', tone: 'warn' })
  if (data.health.open_reports > 0)
    attention.push({ text: `${data.health.open_reports} open question report${data.health.open_reports === 1 ? '' : 's'}`, href: '/admin/reports', tone: 'warn' })
  if (data.health.errors_24h > 0)
    attention.push({ text: `${data.health.errors_24h} error${data.health.errors_24h === 1 ? '' : 's'} in the last 24 hours`, href: '#health', tone: 'bad' })
  if (data.content.concepts_short > 0)
    attention.push({ text: `${data.content.concepts_short} concepts have fewer questions than their target`, href: '/admin/coverage', tone: 'warn' })
  if (data.ai.failed_7d > 0)
    attention.push({ text: `${data.ai.failed_7d} failed AI call${data.ai.failed_7d === 1 ? '' : 's'} in 7 days`, href: '/admin/usage', tone: 'warn' })

  return (
    <AdminPage
      title="Overview"
      description={`Last 30 days, ${first} to ${last}. Updated ${ago(data.generated_at)}.`}
      actions={refresh}
    >
      {error && <Notice tone="bad">{error}</Notice>}
      {data.fixtureSubjectsActive && data.fixtureSubjectsActive.length > 0 && (
        <Notice tone="warn">
          Test subjects are switched on: {data.fixtureSubjectsActive.join(', ')}. Students must not see these. Switch them off
          (is_active = false).
        </Notice>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile
          label="Students"
          value={data.people.students_total}
          hint={`${data.people.parents_total} parent account${data.people.parents_total === 1 ? '' : 's'} · ${data.people.never_started} never attempted a paper`}
        />
        <StatTile
          label="New sign-ups · 7 days"
          value={data.people.signups_7d}
          hint={<Delta now={data.people.signups_7d} before={data.people.signups_prev_7d} />}
          spark={data.people.signups_series}
        />
        <StatTile
          label="Active today"
          value={data.people.active_today}
          hint={`${data.people.active_7d} this week · ${data.people.active_30d} this month`}
          spark={data.people.active_series}
        />
        <StatTile
          label="Papers · 7 days"
          value={data.usage.papers_7d}
          hint={<Delta now={data.usage.papers_7d} before={data.usage.papers_prev_7d} />}
          spark={data.usage.papers_series}
        />
        <StatTile
          label="Papers submitted · 7 days"
          value={data.usage.submitted_7d}
          hint={<Delta now={data.usage.submitted_7d} before={data.usage.submitted_prev_7d} />}
          spark={data.usage.submitted_series}
        />
        <StatTile
          label="Average score · 30 days"
          value={data.usage.average_score_30d == null ? '—' : `${data.usage.average_score_30d}%`}
          hint="Confirmed papers only"
        />
        <StatTile
          label="AI cost today"
          value={inr(data.ai.cost_today_inr)}
          hint={`${inr(data.ai.cost_month_inr)} this month`}
          spark={data.ai.cost_series}
        />
        <StatTile
          label="Errors · 24 hours"
          value={data.health.errors_24h}
          tone={data.health.errors_24h > 0 ? 'bad' : 'good'}
          hint={`${data.health.errors_7d} in 7 days`}
        />
      </div>

      <Panel title="Needs your attention" subtitle="Things a person has to look at.">
        {attention.length === 0 ? (
          <Notice tone="good">All clear. Nothing is waiting for you.</Notice>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2">
            {attention.map((a) => (
              <li key={a.text}>
                <a
                  href={a.href}
                  className="hover:bg-accent border-border flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors"
                >
                  <span>{a.text}</span>
                  <Pill tone={a.tone}>{a.tone === 'bad' ? 'urgent' : 'review'}</Pill>
                </a>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Sign-ups per day" subtitle="New student and parent accounts.">
          <BarChart data={data.people.signups_series} labelFirst={first} labelLast={last} />
        </Panel>
        <Panel title="Active students per day" subtitle="Students who had the app open that day.">
          <BarChart data={data.people.active_series} color="var(--chart-4)" labelFirst={first} labelLast={last} />
        </Panel>
        <Panel title="Papers generated per day">
          <BarChart data={data.usage.papers_series} color="var(--chart-3)" labelFirst={first} labelLast={last} />
        </Panel>
        <Panel title="Papers submitted per day">
          <BarChart data={data.usage.submitted_series} color="var(--chart-2)" labelFirst={first} labelLast={last} />
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="AI cost" subtitle="Where the money goes, last 30 days." action={<a href="/admin/usage" className="text-small text-primary underline-offset-4 hover:underline">Details</a>}>
          <BarChart data={data.ai.cost_series} color="var(--chart-5)" labelFirst={first} labelLast={last} height={90} />
          <div className="mt-4">
            <BarList
              items={data.ai.top_features.map((f) => ({ label: f.feature, value: f.cost_inr, sub: `${f.calls} calls` }))}
              format={inr}
            />
          </div>
        </Panel>

        <Panel title="Question bank health" subtitle={`${data.content.approved_total.toLocaleString('en-IN')} approved questions across ${data.content.concepts_total.toLocaleString('en-IN')} concepts.`} action={<a href="/admin/coverage" className="text-small text-primary underline-offset-4 hover:underline">Coverage</a>}>
          <div className="mb-4 flex flex-wrap gap-2">
            {data.content.by_board.map((b) => (
              <Pill key={b.board}>
                {b.board} · {b.approved.toLocaleString('en-IN')}
              </Pill>
            ))}
          </div>
          {data.content.shortfalls.length === 0 ? (
            <Notice tone="good">Every concept has all the questions it needs.</Notice>
          ) : (
            <BarList
              items={data.content.shortfalls.map((s) => ({
                label: `${s.subject} (${s.board}${s.class ? `, class ${s.class}` : ''})`,
                value: s.short,
                sub: `${s.concepts} concept${s.concepts === 1 ? '' : 's'} short`,
              }))}
              format={(n) => `${n} short`}
            />
          )}
        </Panel>
      </div>

      <div id="health" className="grid gap-6 lg:grid-cols-2">
        <Panel title="Errors" subtitle="From the app's own error log.">
          <BarChart data={data.health.errors_series} color="var(--bad)" labelFirst={first} labelLast={last} height={80} />
          <div className="mt-4">
            <p className="field-label">Noisiest routes, 7 days</p>
            <BarList items={data.health.top_error_routes.map((r) => ({ label: r.route, value: r.count }))} />
          </div>
          {data.health.recent_errors.length > 0 && (
            <ul className="mt-4 space-y-2">
              {data.health.recent_errors.map((e) => (
                <li key={e.at + e.message} className="border-border rounded-xl border px-3 py-2">
                  <p className="text-caption text-muted-foreground">
                    {ago(e.at)} · {e.route ?? '(unknown)'}
                  </p>
                  <p className="text-small break-words">{e.message}</p>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Newest accounts">
          {data.recent_signups.length === 0 && <Notice>No accounts yet.</Notice>}
          <ul className="divide-border divide-y">
            {data.recent_signups.map((u) => (
              <li key={u.email} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="text-small truncate font-semibold">{u.name}</p>
                  <p className="text-caption text-muted-foreground truncate">{u.email}</p>
                </div>
                <div className="shrink-0 text-right">
                  <Pill>{u.role}</Pill>
                  <p className="text-caption text-muted-foreground mt-0.5">{ago(u.at)}</p>
                </div>
              </li>
            ))}
          </ul>
          <a href="/admin/users" className="text-small text-primary mt-3 inline-block underline-offset-4 hover:underline">
            All users
          </a>
        </Panel>
      </div>
    </AdminPage>
  )
}
