import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'

interface Exam {
  name: string
  date: string
}

const SUGGESTIONS = ['Half-yearly', 'Annual exam', 'Unit test']
const fieldClass =
  'border-input flex h-11 w-full rounded-md border bg-transparent px-3 text-base outline-none focus-visible:ring-[3px] focus-visible:ring-ring'

function prettyDate(date: string): string {
  const d = new Date(`${date}T00:00:00.000Z`)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
}

/** Student settings: her own exam dates, which feed the Home countdown and her revision plan. */
export function MyExamsSection() {
  const [exams, setExams] = useState<Array<Exam> | null>(null)
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetch('/api/students/me/exams')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('load'))))
      .then((body: { exams: Array<Exam> }) => setExams(body.exams))
      .catch(() => setMessage({ kind: 'error', text: 'Could not load your exams.' }))
  }, [])

  async function save(next: Array<Exam>, okText: string): Promise<boolean> {
    setSaving(true)
    setMessage(null)
    try {
      const response = await fetch('/api/students/me/exams', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ exams: next }),
      })
      const body = (await response.json().catch(() => ({}))) as { exams?: Array<Exam>; error?: string; message?: string }
      if (!response.ok || !body.exams) {
        setMessage({ kind: 'error', text: body.error ?? body.message ?? 'Could not save your exams. Try again.' })
        return false
      }
      setExams(body.exams)
      setMessage({ kind: 'ok', text: okText })
      return true
    } catch {
      setMessage({ kind: 'error', text: 'Could not save your exams. Check your connection and try again.' })
      return false
    } finally {
      setSaving(false)
    }
  }

  async function handleAdd(e: FormEvent) {
    e.preventDefault()
    if (!exams) return
    if (!name.trim() || !date) {
      setMessage({ kind: 'error', text: 'Add a name and a date for the exam.' })
      return
    }
    if (await save([...exams, { name: name.trim(), date }], 'Saved. PrepPlan will count the days for you.')) {
      setName('')
      setDate('')
    }
  }

  return (
    <Card id="my-exams" className="mb-4 scroll-mt-4">
      <CardHeader>
        <CardTitle className="text-h3">My exams</CardTitle>
        <CardDescription>PrepPlan counts the days for you and plans your revision.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {exams && exams.length === 0 && (
          <p className="text-small text-muted-foreground">No exam added yet.</p>
        )}
        {exams && exams.length > 0 && (
          <ul className="space-y-2" aria-label="Your exams">
            {exams.map((x) => (
              <li key={`${x.name}|${x.date}`} className="border-border flex items-center gap-3 rounded-xl border p-3">
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">{x.name}</span>
                  <span className="text-caption text-muted-foreground block">{prettyDate(x.date)}</span>
                </span>
                <Button
                  type="button"
                  variant="outline"
                  className="min-h-11"
                  disabled={saving}
                  aria-label={`Remove ${x.name}, ${prettyDate(x.date)}`}
                  onClick={() =>
                    void save(
                      exams.filter((y) => !(y.name === x.name && y.date === x.date)),
                      'Removed.',
                    )
                  }
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={(e) => void handleAdd(e)} className="space-y-3" aria-label="Add an exam">
          <p className="font-semibold">Add an exam</p>
          <div className="space-y-1.5">
            <Label htmlFor="exam-name">Exam name</Label>
            <input
              id="exam-name"
              className={fieldClass}
              value={name}
              maxLength={60}
              autoComplete="off"
              onChange={(e) => setName(e.target.value)}
            />
            <div className="flex flex-wrap gap-2" role="group" aria-label="Suggested exam names">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setName(s)}
                  className="border-border focus-visible:ring-ring text-caption min-h-11 rounded-full border px-4 font-semibold outline-none focus-visible:ring-[3px]"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="exam-date">Exam date</Label>
            <input
              id="exam-date"
              type="date"
              className={fieldClass}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <Button type="submit" className="min-h-11" disabled={saving || !exams}>
            {saving ? 'Saving…' : 'Add exam'}
          </Button>
        </form>

        {message && (
          <p
            className={`text-small ${message.kind === 'error' ? 'text-destructive' : 'text-[var(--good)]'}`}
            role={message.kind === 'error' ? 'alert' : 'status'}
          >
            {message.text}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
