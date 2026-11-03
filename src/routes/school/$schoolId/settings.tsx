import { useEffect, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import {
  ChevronRight,
  FileText,
  Gauge,
  LayoutGrid,
  MessageSquare,
  ScrollText,
  UserRound,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useSchool } from '../../../components/school/context'
import { MaskSettings } from '../../../components/school/mask-settings'
import { ModulePicker } from '../../../components/school/module-picker'
import { InfoTip, Switch, useShell, useUnsavedGuard } from '../../../components/school/kit'
import { Btn, Card, Notice, PageHeader, inputClass } from '../../../components/school/ui'
import { api } from '../../../lib/school-client'
import type { SchoolModule } from '../../../lib/schools/modules'

export const Route = createFileRoute('/school/$schoolId/settings')({
  component: SettingsPage,
})

// The office's settings (UI redesign plan, section 6): one page in sections with a small menu on the side on wide
// screens. Each section saves on its own and says "Saved"; leaving with unsaved changes asks first.
const SECTIONS = [
  { id: 'parts', label: 'What your school uses' },
  { id: 'progress', label: "Students' progress" },
  { id: 'name-area', label: 'Name area on sheets' },
  { id: 'school', label: 'Your school' },
  { id: 'advanced', label: 'Advanced' },
]

function SettingsPage() {
  const { overview, schoolId, reload } = useSchool()
  const { toast } = useShell()
  const [modules, setModules] = useState<Array<SchoolModule>>(
    overview.school.modules,
  )
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [progressDirty, setProgressDirty] = useState(false)
  const changed =
    [...modules].sort().join(',') !== [...overview.school.modules].sort().join(',')
  useUnsavedGuard(changed || progressDirty)

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
      toast('Saved')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" help={`How ${overview.school.name} uses PrepPlan. Each part saves on its own.`} />
      <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav aria-label="Settings sections" className="hidden lg:block">
          <ul className="sticky top-24 space-y-1">
            {SECTIONS.filter((x) => x.id !== 'advanced' || overview.school.modules.includes('papers')).map((x) => (
              <li key={x.id}>
                <a href={`#${x.id}`} className="block rounded-lg px-3 py-2 text-[15px] font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900">
                  {x.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="min-w-0 max-w-4xl space-y-6">
          <Card className="scroll-mt-24 space-y-4" id="parts">
            <SectionHead title="What your school uses" help="Turn on the parts of PrepPlan your school needs. Home and the menu show only these." />
            {message ? <Notice kind="good">{message}</Notice> : null}
            {error ? <Notice kind="error">{error}</Notice> : null}
            <ModulePicker value={modules} onChange={setModules} disabled={busy} />
            <div className="flex justify-end">
              <Btn disabled={busy || !changed} onClick={() => void save()}>
                {busy ? 'Saving…' : 'Save'}
              </Btn>
            </div>
          </Card>

          <ProgressSettings onDirty={setProgressDirty} />

          <div id="name-area" className="scroll-mt-24">
            <MaskSettings />
          </div>

          <Card className="scroll-mt-24 space-y-2" id="school">
            <SectionHead title="Your school" help="Set-up screens and agreements." />
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
              to="/school/$schoolId/messages"
              schoolId={schoolId}
              icon={MessageSquare}
              title="Parent messages"
              hint="Who agreed to get results on WhatsApp, and in which language"
            />
            {overview.school.modules.includes('correction') ? (
              <SettingsLink
                to="/school/$schoolId/board"
                schoolId={schoolId}
                icon={Gauge}
                title="Exam-week board"
                hint="Which sheets are uploaded, marked, waiting for a teacher or failed"
              />
            ) : null}
            <SettingsLink
              to="/school/$schoolId/terms"
              schoolId={schoolId}
              icon={ScrollText}
              title="School terms"
              hint={overview.termsAccepted ? 'Accepted' : 'Not accepted yet'}
            />
          </Card>

          {overview.school.modules.includes('papers') ? (
            <Card className="scroll-mt-24 space-y-2" id="advanced">
              <SectionHead title="Advanced" help="Most schools never need these." />
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
      </div>
    </div>
  )
}

function SectionHead({ title, help }: { title: string; help: string }) {
  return (
    <div>
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="text-[15px] text-slate-600">{help}</p>
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
    | '/school/$schoolId/messages'
    | '/school/$schoolId/board'
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
      className="group flex min-h-14 items-center gap-3 rounded-lg border border-slate-200 px-3.5 py-3 text-slate-900 transition-colors hover:border-slate-300 hover:bg-slate-50"
    >
      <span
        aria-hidden="true"
        className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800"
      >
        <Icon className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-base font-semibold">{title}</span>
        <span className="block text-sm text-slate-600">{hint}</span>
      </span>
      <ChevronRight
        aria-hidden="true"
        className="size-5 shrink-0 text-slate-500"
      />
    </Link>
  )
}

function ProgressSettings({ onDirty }: { onDirty: (dirty: boolean) => void }) {
  const { schoolId, overview, reload } = useSchool()
  const { toast } = useShell()
  const [rank, setRank] = useState(overview.school.showClassRank)
  const [days, setDays] = useState(String(overview.school.disputeWindowDays))
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const dirty = rank !== overview.school.showClassRank || days !== String(overview.school.disputeWindowDays)
  useEffect(() => onDirty(dirty), [dirty, onDirty])
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
      toast('Saved')
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }
  return (
    <Card className="scroll-mt-24 space-y-4" data-testid="progress-settings" id="progress">
      <SectionHead title="Students' progress" help="What students see after their results come out." />
      {msg ? <Notice kind="good">{msg}</Notice> : null}
      {err ? <Notice kind="error">{err}</Notice> : null}
      <Switch
        label="Show each student her class rank"
        hint="Off is kinder; her personal best is always shown."
        checked={rank}
        onChange={setRank}
        testId="rank-switch"
      />
      <div className="space-y-1.5">
        <label htmlFor="dispute-days" className="flex items-center gap-1 text-[15px] font-semibold text-slate-900">
          Days a student can flag a mark after results are released
          <InfoTip>
            The question window. After results come out, a student may ask about a mark she thinks is wrong. When these days
            are over, the marks are final.
          </InfoTip>
        </label>
        <input
          id="dispute-days"
          type="number"
          min={1}
          max={60}
          value={days}
          onChange={(e) => setDays(e.target.value)}
          className={`${inputClass} max-w-28`}
        />
      </div>
      <div className="flex justify-end">
        <Btn disabled={busy || !dirty} onClick={() => void save()}>
          {busy ? 'Saving…' : 'Save'}
        </Btn>
      </div>
    </Card>
  )
}
