import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { AdminPage, BarChart, Notice, Panel, StatTile } from '../../components/admin/admin-ui'
import { Button } from '../../components/ui/button'
import type { ActivityReport } from '../../lib/student-activity'

export const Route = createFileRoute('/admin/activity')({
  component: AdminActivity,
})

const WINDOWS = [7, 30, 90] as const

function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const rest = Math.round(minutes - hours * 60)
  return `${hours} h ${rest} min`
}

function formatLastSeen(iso: string | null): string {
  if (!iso) return 'never'
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  })
}

/**
 * Admin: how many students use the web app and for how many minutes (2026-10-03 request). No
 * tab06 screen names this, same standalone-admin-screen pattern as /admin/funnel and
 * /admin/usage. Minutes are active time from the in-app pings, not time with a tab merely open.
 * The admin layout route guards the page; the API enforces the admin role on the server.
 */
function AdminActivity() {
  const [days, setDays] = useState<number>(30)
  const [report, setReport] = useState<ActivityReport | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    setLoadError(null)
    fetch(`/api/admin/student-activity?days=${days}`)
      .then(async (r) => {
        if (!r.ok) throw new Error('Could not load student activity.')
        return r.json() as Promise<ActivityReport>
      })
      .then(setReport)
      .catch((err: Error) => setLoadError(err.message))
  }, [days])

  const first = report?.daily[0]?.day
  const last = report?.daily[report.daily.length - 1]?.day

  return (
    <AdminPage
      title="Student activity"
      description="Students using the web app and the minutes they spend in it."
      actions={
        <div className="flex gap-1.5" role="group" aria-label="Time window">
          {WINDOWS.map((w) => (
            <Button
              key={w}
              type="button"
              size="sm"
              variant={days === w ? 'default' : 'outline'}
              onClick={() => setDays(w)}
            >
              Last {w} days
            </Button>
          ))}
        </div>
      }
    >
      {loadError && <Notice tone="bad">{loadError}</Notice>}
      {!report && !loadError && <Notice>Loading student activity…</Notice>}

      {report && (
        <>
          <dl className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            <StatTile label="Students with a login" value={report.students_with_login} />
            <StatTile label="Active today" value={report.active_today} tone="good" />
            <StatTile label="Active, last 7 days" value={report.active_7d} />
            <StatTile label={`Active, last ${report.window_days} days`} value={report.active_window} />
            <StatTile label="Total time" value={formatMinutes(report.total_minutes)} />
            <StatTile
              label="Average per active day"
              value={formatMinutes(report.avg_minutes_per_active_day)}
            />
          </dl>

          <Notice>
            {report.tracking_since
              ? `Time is measured from ${report.tracking_since}; earlier use was not recorded.`
              : 'No activity recorded yet. Time is measured from the moment students next use the app.'}
          </Notice>

          <div className="grid gap-6 lg:grid-cols-2">
            <Panel title="Minutes per day" subtitle="Active minutes across all students">
              <BarChart data={report.daily.map((d) => d.minutes)} labelFirst={first} labelLast={last} />
            </Panel>
            <Panel title="Active students per day" subtitle="Students with any recorded time">
              <BarChart
                data={report.daily.map((d) => d.active_students)}
                color="var(--chart-2)"
                labelFirst={first}
                labelLast={last}
              />
            </Panel>
          </div>

          <Panel title="Each student">
            {report.students.length === 0 ? (
              <Notice>No students yet.</Notice>
            ) : (
              <div className="-mx-4 overflow-x-auto sm:-mx-5">
                <table className="text-small w-full min-w-[640px] text-left tabular-nums">
                  <thead className="text-muted-foreground bg-muted/50 text-caption uppercase">
                    <tr>
                      <th className="px-4 py-2 font-semibold sm:px-5">Student</th>
                      <th className="px-3 py-2 font-semibold">Class</th>
                      <th className="px-3 py-2 font-semibold">Today</th>
                      <th className="px-3 py-2 font-semibold">Last {report.window_days} days</th>
                      <th className="px-3 py-2 font-semibold">Days active</th>
                      <th className="px-3 py-2 font-semibold">Papers submitted</th>
                      <th className="px-3 py-2 font-semibold">Last seen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.students.map((s) => (
                      <tr key={s.student_id} className="border-border even:bg-muted/30 hover:bg-muted/60 border-t">
                        <td className="px-4 py-2 font-medium sm:px-5">{s.name}</td>
                        <td className="px-3 py-2">{s.class}</td>
                        <td className="px-3 py-2">{formatMinutes(s.minutes_today)}</td>
                        <td className="px-3 py-2">{formatMinutes(s.minutes_in_window)}</td>
                        <td className="px-3 py-2">{s.active_days}</td>
                        <td className="px-3 py-2">{s.papers_submitted}</td>
                        <td className="px-3 py-2 whitespace-nowrap">{formatLastSeen(s.last_seen_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>
        </>
      )}
    </AdminPage>
  )
}
