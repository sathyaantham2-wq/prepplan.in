import { useCallback, useEffect, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useSchool } from '../../../components/school/context'
import { Btn, Card, Chip, Dialog, Loading, Notice, PageHeader, Select, Stat, TextInput } from '../../../components/school/ui'
import { api } from '../../../lib/school-client'
import type { MessagingOverview, MessagingSettings } from '../../../lib/schools/messaging/log'
import type { PermissionRow } from '../../../lib/schools/messaging/permissions'

type Tab = 'activity' | 'permissions' | 'settings'

export const Route = createFileRoute('/school/$schoolId/messages')({
  validateSearch: (s: Record<string, unknown>): { tab?: Tab } => ({
    tab: s.tab === 'activity' || s.tab === 'permissions' || s.tab === 'settings' ? s.tab : undefined,
  }),
  component: MessagesPage,
})

const day = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' })

// Parent messaging permission (the office only): who agreed to get results and reminders on WhatsApp, in which
// language, who confirmed it and when, and who replied STOP. A parent without a recorded yes gets nothing; the
// school prints the one-page summary instead. Nothing on this screen sends a message.
function PermissionsTab() {
  const { overview, schoolId } = useSchool()
  const [rows, setRows] = useState<Array<PermissionRow> | null>(null)
  const [sectionId, setSectionId] = useState('all')
  const [busy, setBusy] = useState<string | null>(null)
  const [message, setMessage] = useState<{ kind: 'error' | 'good'; text: string } | null>(null)
  const [reenable, setReenable] = useState<PermissionRow | null>(null)
  const sections = overview.classes.flatMap((c) => c.sections.map((s) => ({ id: s.id, label: `Class ${c.grade} · Section ${s.name}` })))

  const load = useCallback(async () => {
    try {
      setRows((await api<{ students: Array<PermissionRow> }>(`/api/schools/${schoolId}/messaging/permissions`)).students)
    } catch (e) {
      setRows([])
      setMessage({ kind: 'error', text: e instanceof Error ? e.message : 'Something went wrong.' })
    }
  }, [schoolId])
  useEffect(() => {
    void load()
  }, [load])

  async function save(r: PermissionRow, body: Record<string, unknown>, done: string) {
    setBusy(r.studentId)
    setMessage(null)
    try {
      await api(`/api/schools/${schoolId}/messaging/permissions/${r.studentId}`, { body })
      await load()
      setMessage({ kind: 'good', text: done })
    } catch (e) {
      setMessage({ kind: 'error', text: e instanceof Error ? e.message : 'Something went wrong.' })
    } finally {
      setBusy(null)
      setReenable(null)
    }
  }

  if (!rows) return <Loading />
  const shown = sectionId === 'all' ? rows : rows.filter((r) => r.sectionId === sectionId)
  const on = rows.filter((r) => r.whatsappOk).length
  const stopped = rows.filter((r) => r.optedOutAt).length
  const noPhone = rows.filter((r) => !r.hasPhone).length

  return (
    <div className="space-y-4" data-testid="messages-permissions">
      <Notice>
        A parent gets nothing until you record here that they agreed. If a parent replies STOP, messages stop at once and only you can switch them
        back on, after the parent asks again. Parents without a yes can be given the printed one-page summary instead.
      </Notice>
      {message ? <Notice kind={message.kind}>{message.text}</Notice> : null}
      <div className="grid grid-cols-3 gap-2">
        <Stat label="Agreed" n={on} />
        <Stat label="Replied STOP" n={stopped} />
        <Stat label="No phone" n={noPhone} />
      </div>
      <Select label="Section" value={sectionId} onChange={(e) => setSectionId(e.target.value)}>
        <option value="all">All sections</option>
        {sections.map((s) => (
          <option key={s.id} value={s.id}>
            {s.label}
          </option>
        ))}
      </Select>
      {shown.length === 0 ? (
        <Card>
          <p className="text-base">No students here yet.</p>
        </Card>
      ) : (
        <ul className="space-y-2">
          {shown.map((r) => (
            <li key={r.studentId}>
              <Card className="space-y-3" data-testid={`perm-${r.studentId}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-base font-semibold">{r.name}</p>
                    <p className="text-sm text-slate-600">
                      Class {r.grade}-{r.sectionName} · Roll {r.rollNo}
                    </p>
                  </div>
                  {r.optedOutAt ? (
                    <Chip tone="bad">Replied STOP</Chip>
                  ) : r.whatsappOk ? (
                    <Chip tone="good">WhatsApp on</Chip>
                  ) : !r.hasPhone ? (
                    <Chip tone="wait">No phone</Chip>
                  ) : (
                    <Chip>Off</Chip>
                  )}
                </div>
                {r.whatsappOk && r.confirmedAt ? (
                  <p className="text-sm text-slate-600">
                    Confirmed by {r.confirmedBy ?? 'the office'} on {day(r.confirmedAt)}
                  </p>
                ) : null}
                {r.optedOutAt ? (
                  <p className="text-sm text-slate-600">
                    Stopped on {day(r.optedOutAt)} ({r.optedOutHow === 'stop_reply' ? 'parent replied STOP' : 'by the office'})
                  </p>
                ) : null}
                <div className="flex flex-wrap items-end gap-2">
                  <label className="text-sm font-semibold">
                    Language
                    <select
                      className="mt-1 block min-h-12 rounded-xl border border-slate-300 bg-white px-3 text-base"
                      value={r.language}
                      disabled={busy === r.studentId}
                      onChange={(e) => void save(r, { language: e.target.value }, 'Language saved.')}
                    >
                      <option value="en">English</option>
                      <option value="te">తెలుగు</option>
                    </select>
                  </label>
                  {r.optedOutAt ? (
                    <Btn kind="plain" disabled={busy === r.studentId} onClick={() => setReenable(r)}>
                      Parent asked again…
                    </Btn>
                  ) : r.whatsappOk ? (
                    <Btn kind="plain" disabled={busy === r.studentId} onClick={() => void save(r, { whatsappOk: false }, 'Switched off.')}>
                      Switch off
                    </Btn>
                  ) : (
                    <Btn
                      disabled={busy === r.studentId || !r.hasPhone}
                      onClick={() => void save(r, { whatsappOk: true }, 'Recorded. This parent will get messages.')}
                    >
                      The parent agreed
                    </Btn>
                  )}
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
      {reenable ? (
        <Dialog title="Switch messages back on?" onClose={() => setReenable(null)}>
          <p className="text-base">
            {reenable.name}&apos;s parent replied STOP. Only switch this on if the parent has told you they want messages again.
          </p>
          <div className="mt-4 flex gap-2">
            <Btn className="w-full" onClick={() => void save(reenable, { whatsappOk: true, reenableAfterStop: true }, 'Switched on again.')}>
              The parent asked
            </Btn>
          </div>
        </Dialog>
      ) : null}
    </div>
  )
}

const TEMPLATE_LABEL: Record<string, string> = {
  result_ready: 'Results ready (parent)',
  weekly_focus: "This week's focus (parent)",
  flags_waiting: 'Flagged answers waiting',
  uploads_pending: 'Answer sheets missing',
  dispute_closing: 'Student queries closing',
  teacher_attention: 'A student needs a quiet word',
  monday_pulse: 'Monday pulse',
}
const REASON_LABEL: Record<string, string> = {
  messaging_not_connected: 'Messaging is not connected yet.',
  quiet_hours: 'Waiting until 8 am.',
  weekly_limit: 'Weekly limit reached.',
  parent_opted_out: 'The parent replied STOP.',
  no_permission: 'No permission recorded.',
  no_parent_phone: 'No parent phone number.',
  student_not_active: 'The student has left.',
  recipient_not_active: 'The person is no longer active.',
  expired: 'Too old to send.',
  webhook_unreachable: 'The delivery service could not be reached.',
  webhook_timeout: 'The delivery service did not answer in time.',
  webhook_500: 'The delivery service had a problem.',
  delivery_failed: 'It could not be delivered.',
  dispatch_error: 'A problem on our side. It will be tried again.',
}
const reasonText = (r: string | null) => (r ? (REASON_LABEL[r] ?? (r.startsWith('webhook_') ? 'The delivery service refused it.' : r.startsWith('missing_variables') ? 'Something needed for the message was missing.' : r)) : '')
const STATUS: Partial<Record<string, { label: string; tone: 'plain' | 'good' | 'wait' | 'bad' }>> = {
  queued: { label: 'Waiting', tone: 'wait' },
  held: { label: 'Waiting', tone: 'wait' },
  sending: { label: 'Sending', tone: 'wait' },
  not_sent: { label: 'Not sent', tone: 'bad' },
  sent: { label: 'Sent', tone: 'good' },
  delivered: { label: 'Delivered', tone: 'good' },
  read: { label: 'Read', tone: 'good' },
  failed: { label: 'Failed', tone: 'bad' },
  skipped: { label: 'Not sent', tone: 'plain' },
}
const when = (iso: string) =>
  new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Kolkata' })

function ActivityTab() {
  const { schoolId } = useSchool()
  const [d, setD] = useState<MessagingOverview | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [message, setMessage] = useState<{ kind: 'error' | 'good'; text: string } | null>(null)
  const load = useCallback(async () => {
    try {
      setD(await api<MessagingOverview>(`/api/schools/${schoolId}/messaging/log`))
    } catch (e) {
      setMessage({ kind: 'error', text: e instanceof Error ? e.message : 'Something went wrong.' })
    }
  }, [schoolId])
  useEffect(() => {
    void load()
  }, [load])
  async function again(id: string) {
    setBusy(id)
    setMessage(null)
    try {
      await api(`/api/schools/${schoolId}/messaging/retry/${id}`, { method: 'POST', body: {} })
      await load()
      setMessage({ kind: 'good', text: 'It will be tried again at the next run.' })
    } catch (e) {
      setMessage({ kind: 'error', text: e instanceof Error ? e.message : 'Something went wrong.' })
    } finally {
      setBusy(null)
    }
  }
  if (!d) return message ? <Notice kind="error">{message.text}</Notice> : <Loading />
  return (
    <div className="space-y-4" data-testid="messages-activity">
      {!d.messagingOn ? <Notice>Messaging is not switched on for your school yet. Nothing is sent. PrepPlan turns it on when you are ready.</Notice> : null}
      {message ? <Notice kind={message.kind}>{message.text}</Notice> : null}
      <div className="grid grid-cols-2 gap-2">
        <Stat label="Sent this week" n={d.summary.sent} />
        <Stat label="Delivered" n={d.summary.delivered} />
        <Stat label="Failed" n={d.summary.failed + d.summary.notSent} />
        <Stat label="Waiting" n={d.summary.waiting} />
      </div>
      {d.role !== 'teacher' ? (
        <Card>
          <p className="text-base">
            <b>{d.optedOut}</b> {d.optedOut === 1 ? 'parent has' : 'parents have'} replied STOP.
          </p>
        </Card>
      ) : null}
      {d.byTemplate.length > 0 ? (
        <Card className="space-y-2">
          <h2 className="text-lg font-bold">This week by kind</h2>
          <ul className="space-y-1.5">
            {d.byTemplate.map((t) => (
              <li key={t.template} className="flex items-center justify-between gap-2 text-base">
                <span>{TEMPLATE_LABEL[t.template] ?? t.template}</span>
                <span className="font-semibold">
                  {t.sent}
                  {t.failed ? <span className="text-red-700"> · {t.failed} failed</span> : null}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
      {d.rows === null ? (
        <Notice>The principal sees the school summary. Individual messages are seen by the office and the teachers concerned.</Notice>
      ) : d.rows.length === 0 ? (
        <Card>
          <p className="text-base">No messages yet.</p>
        </Card>
      ) : (
        <ul className="space-y-2">
          {d.rows.map((r) => (
            <li key={r.id}>
              <Card className="space-y-2" data-testid="message-row">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-base font-semibold">{TEMPLATE_LABEL[r.template] ?? r.template}</p>
                    <p className="truncate text-sm text-slate-600">
                      {r.recipient}
                      {r.section ? ` · ${r.section}` : ''} · {r.language === 'te' ? 'తెలుగు' : 'English'}
                    </p>
                  </div>
                  <Chip tone={STATUS[r.status]?.tone ?? 'plain'}>{STATUS[r.status]?.label ?? r.status}</Chip>
                </div>
                <p className="text-sm text-slate-600">
                  {r.sentAt ? `Sent ${when(r.sentAt)}` : `Queued ${when(r.createdAt)}`}
                  {r.reason ? ` · ${reasonText(r.reason)}` : ''}
                </p>
                {d.role === 'school_admin' && (r.status === 'failed' || r.status === 'not_sent') ? (
                  <Btn kind="plain" disabled={busy === r.id} onClick={() => void again(r.id)}>
                    Try again
                  </Btn>
                ) : null}
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function SettingsTab() {
  const { schoolId } = useSchool()
  const [s, setS] = useState<MessagingSettings | null>(null)
  const [limit, setLimit] = useState('')
  const [days, setDays] = useState('365')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<{ kind: 'error' | 'good'; text: string } | null>(null)
  useEffect(() => {
    void api<MessagingSettings>(`/api/schools/${schoolId}/messaging/settings`)
      .then((r) => {
        setS(r)
        setLimit(r.weeklyLimit === null ? '' : String(r.weeklyLimit))
        setDays(String(r.logDays))
      })
      .catch((e: unknown) => setMessage({ kind: 'error', text: e instanceof Error ? e.message : 'Something went wrong.' }))
  }, [schoolId])
  async function save() {
    setBusy(true)
    setMessage(null)
    try {
      await api(`/api/schools/${schoolId}/messaging/settings`, { body: { weeklyLimit: limit === '' ? null : Number(limit), logDays: Number(days) } })
      setMessage({ kind: 'good', text: 'Saved.' })
    } catch (e) {
      setMessage({ kind: 'error', text: e instanceof Error ? e.message : 'Something went wrong.' })
    } finally {
      setBusy(false)
    }
  }
  if (!s) return message ? <Notice kind="error">{message.text}</Notice> : <Loading />
  return (
    <div className="space-y-4" data-testid="messages-settings">
      {message ? <Notice kind={message.kind}>{message.text}</Notice> : null}
      <Card className="space-y-4">
        <h2 className="text-lg font-bold">Parent messages</h2>
        <Select
          label="Most messages a parent may get about one child in a week"
          hint="Leave it on No limit unless you want one. A result is never lost: if the limit is reached it waits until Monday 8 am. A weekly reminder is skipped."
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
        >
          <option value="">No limit</option>
          {Array.from({ length: 14 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={String(n)}>
              {n} a week
            </option>
          ))}
        </Select>
        <TextInput
          label="Keep the message log for (days)"
          hint="After this, only counts are kept; what each message said is removed. 30 to 1830."
          inputMode="numeric"
          value={days}
          onChange={(e) => setDays(e.target.value.replace(/[^\d]/g, ''))}
        />
        <Btn className="w-full" disabled={busy} onClick={() => void save()}>
          {busy ? 'Saving…' : 'Save'}
        </Btn>
      </Card>
      <Notice>{s.messagingOn ? 'Messaging is switched on for your school.' : 'Messaging is not switched on for your school yet. PrepPlan turns it on when you are ready.'}</Notice>
    </div>
  )
}

function MessagesPage() {
  const { overview } = useSchool()
  const navigate = useNavigate({ from: Route.fullPath })
  const search = Route.useSearch()
  const role = overview.role
  const tabs: Array<{ id: Tab; label: string }> =
    role === 'school_admin'
      ? [
          { id: 'activity', label: 'Activity' },
          { id: 'permissions', label: 'Parents' },
          { id: 'settings', label: 'Settings' },
        ]
      : role === 'principal'
        ? [
            { id: 'activity', label: 'Summary' },
            { id: 'settings', label: 'Settings' },
          ]
        : [{ id: 'activity', label: 'Activity' }]
  if (!['school_admin', 'principal', 'teacher'].includes(role)) return <Notice kind="error">This is for the school office and teachers.</Notice>
  const tab = tabs.some((t) => t.id === search.tab) ? search.tab! : tabs[0].id
  return (
    <div className="space-y-4">
      <PageHeader title="Messages" subtitle={role === 'teacher' ? 'Messages about your sections' : 'Results and reminders sent to parents and teachers'} />
      {tabs.length > 1 ? (
        <div role="tablist" className="flex gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => void navigate({ search: { tab: t.id } })}
              className={`min-h-11 flex-1 rounded-xl px-3 text-base font-semibold ${tab === t.id ? 'bg-emerald-700 text-white' : 'border border-slate-300 bg-white text-slate-800'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      ) : null}
      {tab === 'activity' ? <ActivityTab /> : tab === 'permissions' ? <PermissionsTab /> : <SettingsTab />}
    </div>
  )
}
