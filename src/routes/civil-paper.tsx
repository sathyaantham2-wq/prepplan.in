import { useEffect, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowRight, FileText, Globe, Landmark, Layers, LineChart, Lock, Newspaper } from 'lucide-react'
import { Button } from '../components/ui/button'
import { AppShell } from '../components/app-shell'
import { PageLoading } from '../components/page-loading'
import { Tile } from '../components/tile'
import { useSession } from '../lib/auth-client'
import { cn } from '../lib/utils'

// F132: the Civil Services (UPSC Prelims) "New paper" screen, the competitive-exam counterpart of
// /my-paper. Only Polity has a question bank so far; the other three subjects are shown, disabled,
// so she can see what is coming.
export const Route = createFileRoute('/civil-paper')({
  component: CivilPaper,
})

// Kept in step with CIVIL_QUESTION_COUNTS in src/lib/civil-paper.ts -- repeated here rather than
// imported, because that file pulls in server-only modules (db, pg) that must not reach the client.
const QUESTION_COUNTS = [10, 15, 30] as const
type QuestionCount = (typeof QUESTION_COUNTS)[number]

const SUBJECTS = [
  { code: 'POLITY', label: 'Polity', icon: Landmark, available: true },
  { code: 'GEOGRAPHY', label: 'Geography', icon: Globe, available: false },
  { code: 'ECONOMY', label: 'Economy', icon: LineChart, available: false },
  { code: 'CURRENT_AFFAIRS', label: 'Current Affairs', icon: Newspaper, available: false },
] as const

interface ShortPaper {
  attemptId: string
  printed: number
  notes: Array<string>
}

function CivilPaper() {
  const { data: session, isPending } = useSession()
  const navigate = useNavigate()
  const role = (session?.user as { role?: string } | undefined)?.role

  const [ready, setReady] = useState(false)
  const [selected, setSelected] = useState<Array<string>>(['POLITY'])
  const [questionCount, setQuestionCount] = useState<QuestionCount>(15)
  const [starting, setStarting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [short, setShort] = useState<ShortPaper | null>(null)

  useEffect(() => {
    if (isPending) return
    if (!session || role !== 'student') {
      navigate({ to: '/' })
      return
    }
    // This screen is only for the competitive-exam track; a school student belongs on /my-paper.
    fetch('/api/students/me/profile')
      .then((r) => r.json())
      .then((data: { profile: { board: string } }) => {
        if (data.profile.board !== 'CIVILS') {
          navigate({ to: '/my-paper' })
          return
        }
        setReady(true)
      })
  }, [isPending, session, role, navigate])

  function toggle(code: string) {
    setError(null)
    setShort(null)
    // Polity is the only subject with questions, so it cannot be unticked into an empty paper.
    setSelected((current) =>
      current.includes(code) ? (current.length > 1 ? current.filter((c) => c !== code) : current) : [...current, code],
    )
  }

  async function startTest() {
    setStarting(true)
    setError(null)
    setShort(null)
    try {
      const generated = await fetch('/api/papers/generate-civil', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ question_count: questionCount, subject_codes: selected }),
      })
      const paper = await generated.json().catch(() => ({}))
      if (!generated.ok) {
        setError(
          paper.message ??
            (typeof paper.error === 'string' ? paper.error : 'Could not create the paper.'),
        )
        return
      }
      if (paper.paperQuestions.length === 0) {
        setError(
          'There are no new questions for you in this subject right now. Try again later, once more questions are added.',
        )
        return
      }
      const attempt = await fetch('/api/attempts', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ paper_id: paper.paper.id, mode: 'online' }),
      })
      const started = await attempt.json()
      if (!attempt.ok) {
        setError(typeof started.error === 'string' ? started.error : 'Could not start the test.')
        return
      }
      // A short paper is never hidden (F032): she is told, and starts it with one more tap.
      const notes = (paper.shortfalls as Array<{ reason: string }>).map((s) => s.reason)
      if (notes.length > 0) {
        setShort({ attemptId: started.id, printed: paper.paperQuestions.length, notes })
        return
      }
      await navigate({ to: '/attempt/$id', params: { id: started.id } })
    } finally {
      setStarting(false)
    }
  }

  if (isPending || !session || role !== 'student' || !ready) {
    return <PageLoading />
  }

  return (
    <AppShell variant="student" active="generate">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl border bg-card p-4 shadow-sm sm:p-8">
          <div className="mb-6 flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary sm:size-16">
              <FileText className="size-6 sm:size-8" strokeWidth={1.5} />
            </div>
            <div className="min-w-0">
              <h1 className="text-h1">New paper</h1>
              <p className="text-body text-muted-foreground">
                Select subjects and choose number of questions for your practice paper.
              </p>
            </div>
          </div>

          <section className="mb-6">
            <h2 className="text-h3 mb-3 flex items-center gap-2">
              <Layers className="size-5 text-primary" strokeWidth={1.75} /> Select subjects
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {SUBJECTS.map((s) => (
                <Tile
                  key={s.code}
                  selected={s.available && selected.includes(s.code)}
                  disabled={!s.available}
                  onClick={() => toggle(s.code)}
                  className="p-4"
                >
                  <s.icon className="size-7 text-primary" strokeWidth={1.5} />
                  <span className="text-body font-semibold">{s.label}</span>
                  {!s.available && (
                    <span className="flex items-center gap-1 text-small text-muted-foreground">
                      <Lock className="size-3" /> Coming soon
                    </span>
                  )}
                </Tile>
              ))}
            </div>
          </section>

          <div className="flex flex-col gap-5 border-t pt-6 sm:flex-row sm:items-end sm:justify-between">
            <section>
              <h2 className="text-h3 mb-3"># Number of questions</h2>
              <div
                role="radiogroup"
                aria-label="Number of questions"
                className="inline-flex rounded-xl border bg-background p-1"
              >
                {QUESTION_COUNTS.map((n) => (
                  <button
                    key={n}
                    type="button"
                    role="radio"
                    aria-checked={questionCount === n}
                    onClick={() => {
                      setQuestionCount(n)
                      setShort(null)
                    }}
                    className={cn(
                      'min-w-16 rounded-lg px-5 py-2 font-semibold transition-colors',
                      questionCount === n
                        ? 'bg-primary text-primary-foreground shadow'
                        : 'text-foreground hover:bg-muted',
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </section>

            <Button
              size="lg"
              onClick={() => void startTest()}
              disabled={starting || selected.length === 0}
              className="w-full sm:w-auto"
            >
              <FileText className="size-5" />
              {starting ? 'Preparing…' : 'Generate Paper'}
              <ArrowRight className="size-5" />
            </Button>
          </div>

          {error && (
            <p className="mt-4 text-small text-destructive" role="alert">
              {error}
            </p>
          )}
          {short && (
            <div className="mt-4 rounded-xl border border-amber-500/50 bg-amber-500/10 p-4" role="status">
              <p className="text-body font-semibold">
                Your paper has {short.printed} question{short.printed === 1 ? '' : 's'}, fewer than you asked for.
              </p>
              {short.notes.map((note) => (
                <p key={note} className="text-small text-muted-foreground">
                  {note}
                </p>
              ))}
              <Button
                className="mt-3"
                onClick={() => void navigate({ to: '/attempt/$id', params: { id: short.attemptId } })}
              >
                Start with {short.printed} question{short.printed === 1 ? '' : 's'}
                <ArrowRight className="size-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
