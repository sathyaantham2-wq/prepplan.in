import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import type {
  WaCompleteSignupResponse,
  WaConfigResponse,
  WaPollResponse,
  WaStartResponse,
} from '../lib/wa-login-types'
import {
  WA_COPY,
  challengeFromStart,
  fallbackLead,
  flowReducer,
  formatCountdown,
  initialFlowState,
  messageForStatus,
  pollIntervalMs,
  remainingFraction,
} from '../lib/wa-login-view'
import type { WaFlowResult } from '../lib/wa-login-view'

export type WhatsAppLoginResult = WaFlowResult

interface Props {
  purpose: 'signin' | 'link'
  onDone: (result: WhatsAppLoginResult) => void
  onCancel?: () => void
}

const WA_GREEN = '#25D366'

/** Our own drawn speech-bubble-with-handset mark; not a trademarked logo. */
function ChatIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" className={className}>
      <path
        d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9.2 8.6c.3-.5.7-.5 1-.2l.9 1.3c.2.3.1.6-.1.9l-.5.6c.6 1.2 1.5 2 2.7 2.6l.6-.6c.3-.3.6-.3.9-.1l1.3.9c.4.3.3.7 0 1-.7.8-1.7 1-2.7.6-2.5-1-4.2-2.8-5-5.1-.2-.7 0-1.2.9-1.9Z"
        fill="currentColor"
      />
    </svg>
  )
}

function Ring({ fraction, label }: { fraction: number; label: string }) {
  const r = 22
  const c = 2 * Math.PI * r
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true">
      <circle cx="28" cy="28" r={r} fill="none" strokeWidth="5" className="text-muted stroke-current" />
      <circle
        cx="28"
        cy="28"
        r={r}
        fill="none"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - fraction)}
        transform="rotate(-90 28 28)"
        className="text-primary stroke-current motion-safe:transition-[stroke-dashoffset] motion-safe:duration-1000 motion-safe:ease-linear"
      />
      <text x="28" y="32" textAnchor="middle" className="fill-current text-[11px] font-bold">
        {label}
      </text>
    </svg>
  )
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
    credentials: 'same-origin',
  })
  if (!response.ok) throw new Error('request failed')
  return (await response.json()) as T
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Older WebViews: fall back to selecting a temporary textarea.
    try {
      const area = document.createElement('textarea')
      area.value = text
      area.setAttribute('readonly', '')
      area.style.position = 'fixed'
      area.style.opacity = '0'
      document.body.appendChild(area)
      area.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(area)
      return ok
    } catch {
      return false
    }
  }
}

export function WhatsAppLogin({ purpose, onDone, onCancel }: Props) {
  const [state, dispatch] = useReducer(flowReducer, initialFlowState)
  // The poll token lives only in memory, in a ref: never in state shown to the DOM, a URL or storage.
  const pollToken = useRef<string | null>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const [businessNumber, setBusinessNumber] = useState<string | null>(null)
  const [now, setNow] = useState(() => Date.now())
  const [copied, setCopied] = useState<'yes' | 'no' | null>(null)
  const [name, setName] = useState('')
  const [consent, setConsent] = useState(false)
  const doneCalled = useRef(false)

  useEffect(() => {
    let cancelled = false
    fetch('/api/auth/whatsapp/config')
      .then((r) => (r.ok ? r.json() : null))
      .then((c: WaConfigResponse | null) => {
        if (!cancelled && c) setBusinessNumber(c.business_number_display)
      })
      .catch(() => undefined)
    return () => {
      cancelled = true
    }
  }, [])

  // Start a challenge whenever the flow is (re)entered.
  useEffect(() => {
    if (state.kind !== 'starting') return
    let cancelled = false
    pollToken.current = null
    setCopied(null)
    postJson<WaStartResponse>('/api/auth/whatsapp/start', { purpose })
      .then((s) => {
        if (cancelled) return
        pollToken.current = s.poll_token
        setNow(Date.now())
        dispatch({ type: 'started', challenge: challengeFromStart(s, Date.now()) })
      })
      .catch(() => {
        if (!cancelled) dispatch({ type: 'start_failed' })
      })
    return () => {
      cancelled = true
    }
  }, [state.kind, purpose])

  const challengeId = state.kind === 'waiting' ? state.challenge.challengeId : null
  const expiresAtMs = state.kind === 'waiting' ? state.challenge.expiresAtMs : 0

  // Poll while waiting only; the loop ends the moment the state is no longer 'waiting'.
  useEffect(() => {
    if (!challengeId) return
    let cancelled = false
    const isCancelled = () => cancelled
    let timer: ReturnType<typeof setTimeout> | undefined
    const schedule = () => {
      if (cancelled) return
      const delay = pollIntervalMs({ hidden: document.hidden, terminal: false })
      if (delay === null) return
      timer = setTimeout(() => void tick(), delay)
    }
    const tick = async () => {
      if (cancelled) return
      const token = pollToken.current
      if (!token) return
      try {
        const response = await postJson<WaPollResponse>('/api/auth/whatsapp/poll', {
          challenge_id: challengeId,
          poll_token: token,
        })
        if (isCancelled()) return
        dispatch({ type: 'polled', response })
        if (response.status !== 'pending') return
      } catch {
        if (isCancelled()) return
        dispatch({ type: 'poll_failed' })
      }
      schedule()
    }
    const onVisibility = () => {
      // Switching tabs changes the cadence: restart the timer with the right delay.
      if (timer) clearTimeout(timer)
      schedule()
    }
    document.addEventListener('visibilitychange', onVisibility)
    schedule()
    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [challengeId])

  // Countdown clock; also ends the wait locally if the server is slow to say 'expired'.
  useEffect(() => {
    if (!challengeId) return
    const id = setInterval(() => {
      const t = Date.now()
      setNow(t)
      if (t >= expiresAtMs + 3000) dispatch({ type: 'polled', response: { status: 'expired' } })
    }, 1000)
    return () => clearInterval(id)
  }, [challengeId, expiresAtMs])

  // Hand the result to the caller exactly once.
  useEffect(() => {
    if (state.kind === 'done' && !doneCalled.current) {
      doneCalled.current = true
      pollToken.current = null
      onDone(state.result)
    }
  }, [state, onDone])

  // Move focus to the heading of each new state so keyboard and screen-reader users land on it.
  useEffect(() => {
    headingRef.current?.focus()
  }, [state.kind])

  const copyMessage = useCallback(async (text: string) => {
    setCopied((await copyText(text)) ? 'yes' : 'no')
  }, [])

  async function submitSignup(e: React.FormEvent) {
    e.preventDefault()
    if (state.kind !== 'needs_signup' || state.submitting) return
    if (!consent || name.trim() === '') return
    dispatch({ type: 'signup_submitting' })
    try {
      await postJson<WaCompleteSignupResponse>('/api/auth/whatsapp/complete-signup', {
        signup_ticket: state.ticket,
        name: name.trim(),
        consent: true,
      })
      dispatch({ type: 'signup_done' })
    } catch {
      dispatch({ type: 'signup_failed', message: WA_COPY.signupFailed })
    }
  }

  const heading = 'text-h3 outline-none focus-visible:underline'
  const tall = 'min-h-11'

  let body: React.ReactNode = null
  switch (state.kind) {
    case 'starting':
      body = (
        <>
          <h2 ref={headingRef} tabIndex={-1} className={heading}>
            Getting ready…
          </h2>
          <p className="text-small text-muted-foreground">Preparing your WhatsApp message.</p>
        </>
      )
      break
    case 'waiting': {
      const c = state.challenge
      const msLeft = c.expiresAtMs - now
      body = (
        <>
          <h2 ref={headingRef} tabIndex={-1} className={heading}>
            {purpose === 'link' ? 'Add your WhatsApp number' : 'Continue with WhatsApp'}
          </h2>
          <a
            href={c.waUrl}
            target="_blank"
            rel="noopener"
            className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl text-base font-bold !text-black shadow-sm hover:brightness-95 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            style={{ background: WA_GREEN }}
          >
            <ChatIcon />
            Open WhatsApp
          </a>
          <p className="text-body">{WA_COPY.instruction}</p>
          <div className="flex items-center gap-3">
            <Ring fraction={remainingFraction(now, c.startedAtMs, c.expiresAtMs)} label={formatCountdown(msLeft)} />
            <p className="text-small text-muted-foreground">
              Waiting for your message. This page checks by itself.
            </p>
          </div>
          <div className="bg-muted/50 space-y-2 rounded-lg border p-3">
            <p className="text-small">{fallbackLead(businessNumber)}</p>
            <p
              className="bg-background rounded-md border px-3 py-2 font-mono text-base break-all select-all"
              data-testid="wa-message"
            >
              {c.messageText}
            </p>
            <Button
              type="button"
              variant="outline"
              className={`${tall} w-full`}
              onClick={() => void copyMessage(c.messageText)}
            >
              Copy message
            </Button>
            {copied === 'yes' && <p className="text-small text-muted-foreground">Copied.</p>}
            {copied === 'no' && (
              <p className="text-small text-muted-foreground">
                Could not copy. Press and hold the message above to select it.
              </p>
            )}
          </div>
          <p className="text-caption text-muted-foreground">{WA_COPY.safety}</p>
          {state.failures > 0 && (
            <p className="text-small text-muted-foreground">Having trouble reaching PrepPlan. Still trying…</p>
          )}
        </>
      )
      break
    }
    case 'expired':
      body = (
        <>
          <h2 ref={headingRef} tabIndex={-1} className={heading}>
            {WA_COPY.expired}
          </h2>
          <Button type="button" className={`${tall} w-full`} onClick={() => dispatch({ type: 'restart' })}>
            Try again
          </Button>
        </>
      )
      break
    case 'blocked':
      body = (
        <>
          <h2 ref={headingRef} tabIndex={-1} className={heading}>
            {messageForStatus(state.reason)}
          </h2>
          <Button type="button" variant="outline" className={`${tall} w-full`} onClick={() => dispatch({ type: 'restart' })}>
            Try again
          </Button>
        </>
      )
      break
    case 'error':
      body = (
        <>
          <h2 ref={headingRef} tabIndex={-1} className={heading}>
            {state.message}
          </h2>
          <Button type="button" className={`${tall} w-full`} onClick={() => dispatch({ type: 'restart' })}>
            Try again
          </Button>
        </>
      )
      break
    case 'needs_signup':
      body = (
        <form onSubmit={(e) => void submitSignup(e)} className="space-y-4">
          <h2 ref={headingRef} tabIndex={-1} className={heading}>
            Welcome to PrepPlan
          </h2>
          <p className="text-small text-muted-foreground">
            Your WhatsApp number {state.phoneMasked} is confirmed.
          </p>
          <div className="space-y-1.5">
            <Label htmlFor="wa-name">Your name</Label>
            <Input
              id="wa-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
              className={tall}
            />
          </div>
          <div className="flex items-start gap-3">
            <input
              id="wa-consent"
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              required
              className="mt-0.5 size-6 shrink-0"
            />
            <label htmlFor="wa-consent" className="text-caption text-muted-foreground">
              By signing up you confirm that your parent or guardian agrees to your using PrepPlan.
              See our{' '}
              <Link to="/privacy" className="underline">
                Privacy Policy
              </Link>
              .
            </label>
          </div>
          {state.error && (
            <p className="text-small text-destructive" role="alert">
              {state.error}
            </p>
          )}
          <Button
            type="submit"
            className={`${tall} w-full`}
            disabled={state.submitting || !consent || name.trim() === ''}
          >
            {state.submitting ? 'Please wait…' : 'Create my account'}
          </Button>
        </form>
      )
      break
    case 'done':
      body = (
        <h2 ref={headingRef} tabIndex={-1} className={heading}>
          {state.result.status === 'linked' ? 'WhatsApp number added.' : 'Signed in. Taking you in…'}
        </h2>
      )
      break
  }

  return (
    <section className="space-y-4" aria-live="polite" aria-label="Continue with WhatsApp">
      {body}
      {onCancel && state.kind !== 'done' && (
        <button
          type="button"
          className={`${tall} text-primary text-small underline-offset-4 hover:underline`}
          onClick={onCancel}
        >
          {purpose === 'signin' ? 'Use email instead' : 'Cancel'}
        </button>
      )}
    </section>
  )
}
