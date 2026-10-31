import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import {
  ChevronRight,
  FileText,
  LayoutGrid,
  ScrollText,
  UserRound,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useSchool } from '../../../components/school/context'
import { ModulePicker } from '../../../components/school/module-picker'
import { Btn, Card, Notice, PageHeader } from '../../../components/school/ui'
import { api } from '../../../lib/school-client'
import type { SchoolModule } from '../../../lib/schools/modules'

export const Route = createFileRoute('/school/$schoolId/settings')({
  component: SettingsPage,
})

// The office's settings: which parts of PrepPlan the school uses, the paper patterns (advanced), and the
// set-up screens a phone's bottom bar has no room for.
function SettingsPage() {
  const { overview, schoolId, reload } = useSchool()
  const [modules, setModules] = useState<Array<SchoolModule>>(
    overview.school.modules,
  )
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const changed =
    modules.join(',') !== [...overview.school.modules].sort().join(',')

  if (overview.role !== 'school_admin')
    return (
      <Notice kind="error">Only the school office can change settings.</Notice>
    )

  async function save() {
    setBusy(true)
    setMessage(null)
    setError(null)
    try {
      await api(`/api/schools/${schoolId}/settings`, { body: { modules } })
      await reload()
      setMessage('Saved. Your home screen now shows what you chose.')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader title="Settings" subtitle={overview.school.name} />
      {message ? <Notice kind="good">{message}</Notice> : null}
      {error ? <Notice kind="error">{error}</Notice> : null}

      <Card className="space-y-4">
        <h2 className="text-lg font-bold">What your school uses</h2>
        <ModulePicker value={modules} onChange={setModules} disabled={busy} />
        <Btn
          className="w-full"
          disabled={busy || !changed}
          onClick={() => void save()}
        >
          {busy ? 'Saving…' : 'Save'}
        </Btn>
      </Card>

      <ProgressSettings />

      <Card className="space-y-2">
        <h2 className="text-lg font-bold">Your school</h2>
        <SettingsLink
          to="/school/$schoolId/classes"
          schoolId={schoolId}
          icon={LayoutGrid}
          title="Classes and sections"
          hint="Sections, subjects, class teachers, who teaches what"
        />
        <SettingsLink
          to="/school/$schoolId/teachers"
          schoolId={schoolId}
          icon={UserRound}
          title="Teachers"
          hint="Add teachers and give them their sign-in"
        />
        <SettingsLink
          to="/school/$schoolId/terms"
          schoolId={schoolId}
          icon={ScrollText}
          title="School terms"
          hint={overview.termsAccepted ? 'Accepted' : 'Not accepted yet'}
        />
      </Card>

      {overview.school.modules.includes('papers') ? (
        <Card className="space-y-2">
          <h2 className="text-lg font-bold">Advanced settings</h2>
          <SettingsLink
            to="/school/$schoolId/papers"
            schoolId={schoolId}
            icon={FileText}
            title="Paper patterns"
            hint="Your own sections, marks and kinds of question. Most schools use the ready ones."
          />
        </Card>
      ) : null}
    </div>
  )
}

function SettingsLink({
  to,
  schoolId,
  icon: Icon,
  title,
  hint,
}: {
  to:
    | '/school/$schoolId/classes'
    | '/school/$schoolId/teachers'
    | '/school/$schoolId/terms'
    | '/school/$schoolId/papers'
  schoolId: string
  icon: LucideIcon
  title: string
  hint: string
}) {
  return (
    <Link
      to={to}
      params={{ schoolId }}
      className="group flex min-h-14 items-center gap-3 rounded-xl border border-slate-200 px-3.5 py-3 text-slate-900 transition-colors hover:border-slate-300 hover:bg-slate-50"
    >
      <span
        aria-hidden="true"
        className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"
      >
        <Icon className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-base font-semibold">{title}</span>
        <span className="block text-sm text-slate-600">{hint}</span>
      </span>
      <ChevronRight
        aria-hidden="true"
        className="size-5 shrink-0 text-slate-400"
      />
    </Link>
  )
}

function ProgressSettings() {
  const { schoolId, overview, reload } = useSchool()
  const [rank, setRank] = useState(overview.school.showClassRank)
  const [days, setDays] = useState(String(overview.school.disputeWindowDays))
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)
  async function save() {
    setBusy(true)
    setMsg(null)
    setErr(null)
    try {
      await api(`/api/schools/${schoolId}/settings`, {
        body: { progress: { show_class_rank: rank, dispute_window_days: Number(days) } },
      })
      await reload()
      setMsg('Saved.')
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }
  return (
    <Card className="space-y-3" data-testid="progress-settings">
      <h2 className="text-lg font-bold">Students' progress</h2>
      {msg ? <Notice kind="good">{msg}</Notice> : null}
      {err ? <Notice kind="error">{err}</Notice> : null}
      <label className="flex min-h-11 items-center gap-3 text-base">
        <input type="checkbox" checked={rank} onChange={(e) => setRank(e.target.checked)} className="size-5" />
        Show each student her class rank (off is kinder; her personal best is always shown)
      </label>
      <label className="block text-base font-semibold">
        Days a student can flag a mark after results are released
        <input
          type="number"
          min={1}
          max={60}
          value={days}
          onChange={(e) => setDays(e.target.value)}
          className="mt-1 block min-h-11 w-28 rounded-lg border border-slate-300 px-3 text-base"
        />
      </label>
      <Btn disabled={busy} onClick={() => void save()}>
        {busy ? 'Saving…' : 'Save'}
      </Btn>
    </Card>
  )
}
