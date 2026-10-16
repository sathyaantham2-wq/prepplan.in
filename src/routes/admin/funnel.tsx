import { useCallback, useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { RefreshCw } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { AdminPage, Notice, Panel, StatTile } from '../../components/admin/admin-ui'

export const Route = createFileRoute('/admin/funnel')({ component: AdminFunnel })

const STAGE_LABELS: Record<string, string> = {
  paper_generated: 'Paper generated',
  paper_downloaded: 'Paper downloaded',
  attempt_submitted: 'Attempt submitted',
  attempt_uploaded: 'Scan uploaded',
  evaluation_completed: 'Evaluation completed',
  remediation_started: 'Remediation started',
}

interface FunnelStage {
  event_type: string
  households: number
  students: number
  events: number
  pct_of_first_stage: number | null
}

interface FunnelReport {
  from: string
  to: string
  stages: Array<FunnelStage>
}

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`

/**
 * F093 (tab03): "Events: paper generated, downloaded, attempted, uploaded, evaluated,
 * remediated; funnel view." Shown as a horizontal funnel: bar width is households relative to
 * the first stage, with the step-to-step conversion between rows.
 */
function AdminFunnel() {
  const [report, setReport] = useState<FunnelReport | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    setBusy(true)
    setLoadError(null)
    try {
      const r = await fetch('/api/admin/product-funnel')
      if (!r.ok) throw new Error('Could not load the product funnel.')
      setReport((await r.json()) as FunnelReport)
    } catch (err) {
      setLoadError((err as Error).message)
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

  const stages = report?.stages ?? []
  const first = stages.at(0)
  const last = stages.at(-1)
  const top = Math.max(1, ...stages.map((s) => s.households))
  const overall =
    first && last && first.households > 0
      ? Math.round((last.households / first.households) * 100)
      : null

  return (
    <AdminPage
      title="Product funnel"
      description="Households reaching each stage, trailing 30 days."
      actions={refresh}
    >
      {loadError && <Notice tone="bad">{loadError}</Notice>}
      {!report && !loadError && <Notice>Loading the funnel…</Notice>}
      {report && stages.length === 0 && <Notice>No funnel events in this period yet.</Notice>}

      {report && stages.length > 0 && first && last && (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatTile label="Started" value={first.households} hint={STAGE_LABELS[first.event_type] ?? first.event_type} />
            <StatTile
              label="Reached the end"
              value={last.households}
              hint={STAGE_LABELS[last.event_type] ?? last.event_type}
            />
            <StatTile
              label="Overall conversion"
              value={overall === null ? '—' : `${overall}%`}
              tone={overall !== null && overall >= 50 ? 'good' : 'default'}
              hint="last stage / first stage"
            />
            <StatTile label="Stages" value={stages.length} hint={`${report.from} → ${report.to}`} />
          </div>

          <Panel title="Funnel" subtitle="Bar width is households, relative to the first stage.">
            <ol className="space-y-1">
              {stages.map((stage, i) => {
                const prev = i > 0 ? stages[i - 1] : null
                const step =
                  prev && prev.households > 0
                    ? Math.round((stage.households / prev.households) * 100)
                    : null
                return (
                  <li key={stage.event_type}>
                    {prev && (
                      <p className="text-caption text-muted-foreground py-1 pl-1 tabular-nums">
                        ↓ {step === null ? '—' : `${step}%`} continue to the next step
                      </p>
                    )}
                    <div className="grid items-center gap-x-4 gap-y-1 sm:grid-cols-[11rem_1fr_3.5rem]">
                      <div className="min-w-0">
                        <p className="text-body font-medium">
                          {STAGE_LABELS[stage.event_type] ?? stage.event_type}
                        </p>
                        <p className="text-caption text-muted-foreground">
                          {plural(stage.students, 'student')} · {plural(stage.events, 'event')}
                        </p>
                      </div>
                      <div className="bg-muted relative h-9 overflow-hidden rounded-lg">
                        <div
                          className="bar-grad h-full rounded-lg"
                          style={{ width: `${Math.max(2, (stage.households / top) * 100)}%` }}
                        />
                        <span className="text-small absolute inset-y-0 left-3 flex items-center font-semibold tabular-nums">
                          {plural(stage.households, 'household')}
                        </span>
                      </div>
                      <span className="text-h3 text-right tabular-nums">
                        {stage.pct_of_first_stage === null ? '—' : `${stage.pct_of_first_stage}%`}
                      </span>
                    </div>
                  </li>
                )
              })}
            </ol>
          </Panel>
        </>
      )}
    </AdminPage>
  )
}
