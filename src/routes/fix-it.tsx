import { useEffect, useRef, useState } from 'react'
import { Check } from 'lucide-react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from '../components/ui/button'
import { AppShell } from '../components/app-shell'
import { PageLoading } from '../components/page-loading'
import { useSession } from '../lib/auth-client'

export const Route = createFileRoute('/fix-it')({ component: FixIt })

interface FixitQuestion {
  id: string
  type: string
  text: string
  marks: number
  options?: Array<{ label: string; text: string }>
}

interface FixitCard {
  id: string
  concept_name: string
  subject_name: string
  why: 'knowledge' | 'habit' | null
  question: FixitQuestion
}

interface TodayData {
  due_total: number
  answered_today: number
  cards: Array<FixitCard>
}

interface AnswerResult {
  correct: boolean
  correct_answer_text: string
  explanation: string | null
}

const card =
  'bg-card border-border rounded-3xl border p-5 shadow-[0_1px_0_var(--highlight)_inset,0_14px_34px_-24px_var(--glow)] sm:p-6'

const WHY_TEXT = {
  knowledge: 'A fresh look at an idea that cost you marks',
  habit: 'You knew this one. A habit cost you the marks',
} as const

/**
 * Fix-it Deck: every mark she lost comes back as a small card, three a day, until she can answer
 * it. One card at a time; the key is only shown after she has checked her own answer.
 */
function FixIt() {
  const { data: session, isPending } = useSession()
  const navigate = useNavigate()
  const role = (session?.user as { role?: string } | undefined)?.role

  const [data, setData] = useState<TodayData | null>(null)
  const [failed, setFailed] = useState(false)
  const [index, setIndex] = useState(0)
  const [choice, setChoice] = useState('')
  const [result, setResult] = useState<AnswerResult | null>(null)
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (isPending) return
    if (!session || role !== 'student') {
      navigate({ to: '/' })
      return
    }
    fetch('/api/fixit/today')
      .then((r) => (r.ok ? (r.json() as Promise<TodayData>) : Promise.reject(new Error('load'))))
      .then(setData)
      .catch(() => setFailed(true))
  }, [isPending, session, role, navigate])

  useEffect(() => {
    headingRef.current?.focus()
  }, [index, data])

  if (isPending || (!data && !failed)) return <PageLoading />

  const cards = data?.cards ?? []
  const current = cards.at(index)
  const total = cards.length
  const finished = !!data && total > 0 && index >= total

  async function check() {
    if (!current || !choice.trim() || checking) return
    setChecking(true)
    setError(null)
    try {
      const r = await fetch(`/api/fixit/cards/${current.id}/answer`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ question_id: current.question.id, answer: choice }),
      })
      if (!r.ok) throw new Error('answer')
      setResult((await r.json()) as AnswerResult)
    } catch {
      setError('We could not check that just now. Please try again.')
    } finally {
      setChecking(false)
    }
  }

  function next() {
    setResult(null)
    setChoice('')
    setError(null)
    setIndex((i) => i + 1)
  }

  let body
  if (failed) {
    body = (
      <div className={card}>
        <p className="text-body">We could not open your Fix-it deck. Please refresh and try again.</p>
      </div>
    )
  } else if (total === 0) {
    const doneToday = (data?.answered_today ?? 0) > 0
    body = (
      <div className={`${card} text-center`}>
        <h1 ref={headingRef} tabIndex={-1} className="display-title text-h1 mb-2 outline-none">
          {doneToday ? 'That’s today’s deck.' : 'Nothing to fix.'}
        </h1>
        <p className="text-body text-muted-foreground mb-5">
          {doneToday
            ? 'Come back tomorrow.'
            : 'Take a paper and we’ll collect your slips here.'}
        </p>
        <a href={doneToday ? '/student' : '/my-paper'}>
          <Button size="lg" className="min-h-11">{doneToday ? 'Back to home' : 'Take a paper'}</Button>
        </a>
      </div>
    )
  } else if (finished) {
    body = (
      <div className={`${card} text-center`}>
        <h1 ref={headingRef} tabIndex={-1} className="display-title text-h1 mb-2 outline-none">
          That’s today’s deck.
        </h1>
        <p className="text-body text-muted-foreground mb-5">Come back tomorrow.</p>
        <a href="/student">
          <Button size="lg" className="min-h-11">Back to home</Button>
        </a>
      </div>
    )
  } else if (current) {
    const q = current.question
    body = (
      <div className={card}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="field-label !mb-0">
            Card {index + 1} of {total}
          </p>
          <div className="flex gap-1.5" aria-hidden="true">
            {cards.map((c, i) => (
              <span
                key={c.id}
                className={`h-2.5 w-2.5 rounded-full ${i < index ? 'bg-primary' : i === index ? 'bg-primary/60' : 'bg-border'}`}
              />
            ))}
          </div>
        </div>
        <p className="field-label">{current.subject_name} · {current.concept_name}</p>
        {current.why && <p className="text-small text-muted-foreground mb-3">{WHY_TEXT[current.why]}</p>}
        <h1 ref={headingRef} tabIndex={-1} className="display-title text-h2 mb-5 whitespace-pre-line outline-none">
          {q.text}
        </h1>

        {q.options ? (
          <div className="grid gap-2.5" role="radiogroup" aria-label="Choose your answer">
            {q.options.map((o) => {
              const selected = choice === o.label
              const isRight = !!result && result.correct_answer_text.split('; ').some((t) => t.startsWith(`${o.label}. `))
              const isWrongPick = !!result && !result.correct && selected && !isRight
              return (
                <button
                  key={o.label}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  disabled={!!result}
                  onClick={() => setChoice(o.label)}
                  className={`flex min-h-11 flex-wrap items-center gap-x-2 rounded-2xl border px-4 py-3 text-left text-base font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none ${
                    isRight
                      ? 'border-[var(--good)] bg-[var(--good)]/10'
                      : isWrongPick
                        ? 'border-[var(--chart-3)] bg-background'
                        : selected
                          ? 'border-primary bg-primary/5'
                          : 'border-border bg-background hover:bg-muted'
                  }`}
                >
                  <span className="text-muted-foreground">{o.label}.</span>
                  <span>{o.text}</span>
                  {isRight && (
                    <span className="text-small ml-auto inline-flex items-center gap-1 font-bold text-[var(--good)]">
                      <Check className="size-4" strokeWidth={3} aria-hidden="true" />
                      Right answer
                    </span>
                  )}
                  {isWrongPick && <span className="text-small ml-auto font-bold">Your answer</span>}
                </button>
              )
            })}
          </div>
        ) : (
          <div>
            <label htmlFor="fixit-answer" className="field-label">Your answer</label>
            <input
              id="fixit-answer"
              value={choice}
              disabled={!!result}
              onChange={(e) => setChoice(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') void check()
              }}
              autoComplete="off"
              className="border-border bg-background min-h-11 w-full rounded-2xl border px-4 py-3 text-base"
            />
          </div>
        )}

        {error && <p role="alert" className="text-small text-muted-foreground mt-3">{error}</p>}

        {!result ? (
          <Button
            size="lg"
            className="mt-5 min-h-11 w-full sm:w-auto"
            disabled={!choice.trim() || checking}
            onClick={() => void check()}
          >
            {checking ? 'Checking…' : 'Check'}
          </Button>
        ) : (
          <div className="mt-5" role="status" aria-live="polite">
            <p className="display-title text-h3 mb-1">
              {result.correct ? 'Got it' : 'Not yet, we’ll bring this back tomorrow'}
            </p>
            <p className="field-label mt-3">Right answer</p>
            <p className="text-body">{result.correct_answer_text}</p>
            {result.explanation && (
              <>
                <p className="field-label mt-3">Why</p>
                <p className="text-body whitespace-pre-line">{result.explanation}</p>
              </>
            )}
            <Button size="lg" className="mt-5 min-h-11 w-full sm:w-auto" onClick={next} autoFocus>
              {index + 1 >= total ? 'Finish' : 'Next card'}
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <AppShell variant="student" active="home">
      <div className="mx-auto max-w-2xl p-4 sm:p-8">{body}</div>
    </AppShell>
  )
}
