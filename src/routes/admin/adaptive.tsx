import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Button } from '../../components/ui/button'
import { AdminPage, Notice, Panel, Pill, StatTile } from '../../components/admin/admin-ui'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'

export const Route = createFileRoute('/admin/adaptive')({ component: AdminAdaptive })

type Json = { [key: string]: number | Array<number> | Json }

interface AiStatus {
  provider: 'anthropic' | 'gemini' | null
  anthropic_key_set: boolean
  gemini_key_set: boolean
  forced: string | null
  models: { strong: string; cheap: string } | null
}

interface Subject {
  id: string
  board: string
  class: number
  name: string
  code: string
  is_active: boolean
  chapter_count: number
}

const GROUP_TITLES: Record<string, string> = {
  weights: 'Mastery score weights (must add up to 1)',
  levels: 'Level thresholds (lowest score of each level)',
  evidence: 'Evidence needed for Mastered',
  difficulty: 'Difficulty adjustment',
  adjustment: 'How fast a score can move',
  recency: 'Recent-question window',
  weightage: 'Question weightage across concepts',
  retention: 'Retention schedule (days, comma separated)',
}

function setPath(obj: Json, path: Array<string>, value: number | Array<number>): Json {
  const [head, ...rest] = path
  const copy: Json = { ...obj }
  copy[head] = rest.length === 0 ? value : setPath(obj[head] as Json, rest, value)
  return copy
}

function Fields({
  value,
  path,
  onChange,
}: {
  value: Json
  path: Array<string>
  onChange: (path: Array<string>, v: number | Array<number>) => void
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {Object.entries(value).map(([key, v]) => {
        const here = [...path, key]
        const id = `cfg-${here.join('-')}`
        if (Array.isArray(v)) {
          return (
            <div key={key} className="space-y-1.5">
              <Label htmlFor={id}>{key}</Label>
              <Input
                id={id}
                defaultValue={v.join(', ')}
                onBlur={(e) =>
                  onChange(
                    here,
                    e.target.value
                      .split(',')
                      .map((n) => Number(n.trim()))
                      .filter((n) => Number.isFinite(n) && n > 0),
                  )
                }
              />
            </div>
          )
        }
        if (typeof v === 'object') {
          return (
            <div key={key} className="sm:col-span-2">
              <p className="text-small mb-2 font-medium">{key}</p>
              <Fields value={v} path={here} onChange={onChange} />
            </div>
          )
        }
        return (
          <div key={key} className="space-y-1.5">
            <Label htmlFor={id}>{key}</Label>
            <Input
              id={id}
              type="number"
              step="any"
              value={v}
              onChange={(e) => onChange(here, Number(e.target.value))}
            />
          </div>
        )
      })}
    </div>
  )
}

// Everything the adaptive learning engine uses is set here, and every change is audit logged.
function AdminAdaptive() {
  const [config, setConfig] = useState<Json | null>(null)
  const [defaults, setDefaults] = useState<Json | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [subjects, setSubjects] = useState<Array<Subject>>([])
  const [ai, setAi] = useState<AiStatus | null>(null)
  const [aiTest, setAiTest] = useState<string | null>(null)
  const [form, setForm] = useState({ board: 'CBSE', class: 7, name: '', code: '' })

  async function loadSubjects() {
    const r = await fetch('/api/admin/subjects')
    if (r.ok) setSubjects(await r.json())
  }

  useEffect(() => {
    fetch('/api/admin/mastery-settings')
      .then((r) => r.json())
      .then((d: { config: Json; defaults: Json }) => {
        setConfig(d.config)
        setDefaults(d.defaults)
      })
      .catch(() => setError('Could not load the settings.'))
    void loadSubjects()
    fetch('/api/admin/ai-status')
      .then((r) => r.json())
      .then(setAi)
  }, [])

  async function testAi() {
    setAiTest('Testing…')
    const response = await fetch('/api/admin/ai-status', { method: 'POST' })
    const body = (await response.json()) as { ok: boolean; provider?: string; model?: string; latency_ms?: number; error?: string | null }
    setAiTest(
      body.ok
        ? `Working: ${body.provider} (${body.model}) answered in ${body.latency_ms} ms.`
        : `Not working: ${body.error ?? 'unknown error'}`,
    )
  }

  async function saveConfig() {
    setMessage(null)
    setError(null)
    const response = await fetch('/api/admin/mastery-settings', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(config),
    })
    const body = await response.json()
    if (!response.ok) {
      setError('These settings were not saved. Check that the weights add up to 1 and the thresholds increase.')
      return
    }
    setConfig(body.config)
    setMessage('Saved. New answers use these settings straight away.')
  }

  async function toggleSubject(subject: Subject) {
    await fetch(`/api/admin/subjects/${subject.id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ is_active: !subject.is_active }),
    })
    await loadSubjects()
  }

  async function renameSubject(subject: Subject, name: string) {
    if (!name.trim() || name === subject.name) return
    await fetch(`/api/admin/subjects/${subject.id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    await loadSubjects()
  }

  async function addSubject(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const response = await fetch('/api/admin/subjects', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (!response.ok) {
      const body = await response.json().catch(() => null)
      setError(typeof body?.error === 'string' ? body.error : 'Could not add the subject.')
      return
    }
    setForm({ ...form, name: '', code: '' })
    await loadSubjects()
  }

  const active = subjects.filter((x) => x.is_active).length

  return (
    <AdminPage
      title="Adaptive learning settings"
      description="Subjects, mastery rules and question weightage."
      actions={
        <a href="/admin/videos" className="text-primary text-small underline-offset-4 hover:underline">
          Concept videos
        </a>
      }
    >
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Subjects" value={subjects.length} />
        <StatTile label="Active subjects" value={active} tone="good" />
        <StatTile
          label="AI provider"
          value={ai ? (ai.provider === null ? 'None' : ai.provider === 'gemini' ? 'Gemini' : 'Claude') : '…'}
          tone={ai && ai.provider === null ? 'bad' : 'default'}
        />
        <StatTile label="Setting groups" value={config ? Object.values(config).filter((v) => typeof v === 'object').length : 0} />
      </div>

      <Panel
        title="AI provider"
        subtitle="Set ANTHROPIC_API_KEY or GEMINI_API_KEY in the deployment settings (see .env.example). Keys are never shown here."
      >
        <div className="space-y-3">
          {ai && (
            <p className="text-body">
              {ai.provider === null
                ? 'No AI key is set. Written answers wait for a parent to mark them.'
                : `In use: ${ai.provider === 'gemini' ? 'Google Gemini' : 'Anthropic Claude'}` +
                  (ai.models ? ` · main model ${ai.models.strong}, backup ${ai.models.cheap}` : '')}
            </p>
          )}
          {ai && (
            <p className="text-small text-muted-foreground flex flex-wrap items-center gap-2">
              <Pill tone={ai.anthropic_key_set ? 'good' : 'default'}>Anthropic key: {ai.anthropic_key_set ? 'set' : 'not set'}</Pill>
              <Pill tone={ai.gemini_key_set ? 'good' : 'default'}>Gemini key: {ai.gemini_key_set ? 'set' : 'not set'}</Pill>
              {ai.forced ? <Pill tone="warn">forced to {ai.forced}</Pill> : null}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" variant="outline" disabled={!ai?.provider} onClick={() => void testAi()}>
              Test connection
            </Button>
            {aiTest && <span className="text-small text-muted-foreground" role="status">{aiTest}</span>}
          </div>
        </div>
      </Panel>

      <Panel
        title="Subjects"
        subtitle="Students choose from the active subjects of their class. Switching a subject off hides it; nothing is deleted."
      >
        <div className="space-y-3">
          {subjects.length === 0 && <Notice>No subjects yet. Add one below.</Notice>}
          {subjects.map((s) => (
            <div key={s.id} className="border-border bg-muted/20 flex flex-wrap items-center gap-3 rounded-xl border p-3">
              <Input
                aria-label={`Name of ${s.name}`}
                className="w-full sm:max-w-56"
                defaultValue={s.name}
                onBlur={(e) => void renameSubject(s, e.target.value)}
              />
              <span className="text-small text-muted-foreground">
                {s.board} · Class {s.class} · {s.code} · {s.chapter_count} chapters
              </span>
              <Pill tone={s.is_active ? 'good' : 'default'}>{s.is_active ? 'Active' : 'Off'}</Pill>
              <Button
                type="button"
                size="sm"
                variant={s.is_active ? 'outline' : 'default'}
                className="ml-auto"
                onClick={() => void toggleSubject(s)}
              >
                {s.is_active ? 'Deactivate' : 'Activate'}
              </Button>
            </div>
          ))}
          <form onSubmit={addSubject} className="border-border grid gap-3 rounded-xl border border-dashed p-3 sm:grid-cols-5">
            <Input aria-label="Board" value={form.board} onChange={(e) => setForm({ ...form, board: e.target.value })} required />
            <Input
              aria-label="Class"
              type="number"
              min={1}
              max={12}
              value={form.class}
              onChange={(e) => setForm({ ...form, class: Number(e.target.value) })}
              required
            />
            <Input aria-label="Subject name" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input aria-label="Subject code" placeholder="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required />
            <Button type="submit">Add subject</Button>
          </form>
        </div>
      </Panel>

      {!config && !error && <Notice>Loading mastery settings…</Notice>}

      {config &&
        Object.entries(config).map(([group, value]) => {
          if (typeof value !== 'object') return null
          return (
            <Panel key={group} title={GROUP_TITLES[group] ?? group}>
              <Fields
                value={value as Json}
                path={[group]}
                onChange={(path, v) => setConfig((c) => (c ? setPath(c, path, v) : c))}
              />
            </Panel>
          )
        })}

      {config && (
        <Panel title="Other">
          <div className="grid gap-3 sm:grid-cols-2">
            {(['correctCredit', 'weakPriorityFloorPercent'] as const).map((key) => (
              <div key={key} className="space-y-1.5">
                <Label htmlFor={`cfg-${key}`}>{key}</Label>
                <Input
                  id={`cfg-${key}`}
                  type="number"
                  step="any"
                  value={config[key] as number}
                  onChange={(e) => setConfig((c) => (c ? setPath(c, [key], Number(e.target.value)) : c))}
                />
              </div>
            ))}
          </div>
        </Panel>
      )}

      {error && <Notice tone="bad">{error}</Notice>}
      {message && (
        <p className="text-small text-muted-foreground" role="status">
          {message}
        </p>
      )}
      {config && (
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => void saveConfig()}>Save settings</Button>
          <Button variant="outline" onClick={() => defaults && setConfig(defaults)}>
            Reset to defaults
          </Button>
        </div>
      )}
    </AdminPage>
  )
}
