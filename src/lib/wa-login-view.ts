// Pure view logic for the "Continue with WhatsApp" flow: no DOM, no fetch, so it is unit-testable.
import { waMessageText } from './wa-login-types'
import type { WaPollResponse, WaStartResponse } from './wa-login-types'

export const POLL_VISIBLE_MS = 2000
export const POLL_HIDDEN_MS = 5000
/** Consecutive failed polls before the student is told something is wrong. */
export const MAX_POLL_FAILURES = 5

export const WA_COPY = {
  instruction: 'Press Send in WhatsApp. That is all. You will be signed in here.',
  safety:
    'Only send the message you see on YOUR screen. Never send a code someone else gives you.',
  expired: 'This took too long. Start again.',
  phoneInUse: 'That WhatsApp number is already used by another PrepPlan account.',
  notAllowed: 'This number cannot be used to sign in here.',
  retry: 'Something went wrong on our side. Please try again in a moment.',
  signupFailed: 'We could not create your account. Please try again in a moment.',
} as const

/** "9:05" for 545000 ms; never negative. */
export function formatCountdown(msLeft: number): string {
  const total = Math.max(0, Math.ceil(msLeft / 1000))
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

/** Fraction of the challenge window still left, clamped to 0..1 (1 = just started). */
export function remainingFraction(nowMs: number, startedMs: number, expiresMs: number): number {
  const span = expiresMs - startedMs
  if (!(span > 0)) return 0
  return Math.min(1, Math.max(0, (expiresMs - nowMs) / span))
}

/** Polling cadence; null means do not poll (terminal status reached). */
export function pollIntervalMs(opts: { hidden: boolean; terminal: boolean }): number | null {
  if (opts.terminal) return null
  return opts.hidden ? POLL_HIDDEN_MS : POLL_VISIBLE_MS
}

/** The sentence shown in the copy-able box. Falls back to rebuilding it from the code. */
export function copyFallbackText(start: Pick<WaStartResponse, 'message_text' | 'code'>): string {
  return start.message_text.trim() !== '' ? start.message_text : waMessageText(start.code)
}

export function fallbackLead(businessNumber: string | null): string {
  return businessNumber
    ? `WhatsApp did not open? Send this message to ${businessNumber} yourself:`
    : 'WhatsApp did not open? Send this message on WhatsApp yourself:'
}

export type WaTerminalMessage = 'phone_in_use' | 'not_allowed'

export function messageForStatus(status: WaTerminalMessage): string {
  return status === 'phone_in_use' ? WA_COPY.phoneInUse : WA_COPY.notAllowed
}

// ---- state machine ---------------------------------------------------------------------------

export interface WaChallengeView {
  challengeId: string
  code: string
  messageText: string
  waUrl: string
  startedAtMs: number
  expiresAtMs: number
}

export type WaFlowState =
  | { kind: 'starting' }
  | { kind: 'waiting'; challenge: WaChallengeView; failures: number }
  | { kind: 'expired' }
  | { kind: 'needs_signup'; ticket: string; phoneMasked: string; submitting: boolean; error: string | null }
  | { kind: 'blocked'; reason: WaTerminalMessage }
  | { kind: 'error'; message: string }
  | { kind: 'done'; result: WaFlowResult }

export type WaFlowResult =
  | { status: 'signed_in'; isNewAccount: boolean }
  | { status: 'linked'; phoneMasked: string }

export type WaFlowAction =
  | { type: 'restart' }
  | { type: 'started'; challenge: WaChallengeView }
  | { type: 'start_failed' }
  | { type: 'polled'; response: WaPollResponse }
  | { type: 'poll_failed' }
  | { type: 'signup_submitting' }
  | { type: 'signup_failed'; message: string }
  | { type: 'signup_done' }

export const initialFlowState: WaFlowState = { kind: 'starting' }

export function challengeFromStart(start: WaStartResponse, nowMs: number): WaChallengeView {
  const parsed = Date.parse(start.expires_at)
  return {
    challengeId: start.challenge_id,
    code: start.code,
    messageText: copyFallbackText(start),
    waUrl: start.wa_url,
    startedAtMs: nowMs,
    // A malformed timestamp must not make the screen claim "expired" at once: assume 10 minutes.
    expiresAtMs: Number.isNaN(parsed) ? nowMs + 10 * 60 * 1000 : parsed,
  }
}

/** True once no further poll may be sent. */
export function isTerminal(state: WaFlowState): boolean {
  return state.kind !== 'waiting'
}

export function flowReducer(state: WaFlowState, action: WaFlowAction): WaFlowState {
  switch (action.type) {
    case 'restart':
      return { kind: 'starting' }
    case 'started':
      return state.kind === 'starting'
        ? { kind: 'waiting', challenge: action.challenge, failures: 0 }
        : state
    case 'start_failed':
      return { kind: 'error', message: WA_COPY.retry }
    case 'polled': {
      // A late poll answer after a terminal state must never revive or overwrite it.
      if (state.kind !== 'waiting') return state
      const r = action.response
      switch (r.status) {
        case 'pending':
          return state.failures === 0 ? state : { ...state, failures: 0 }
        case 'expired':
          return { kind: 'expired' }
        case 'signed_in':
          return { kind: 'done', result: { status: 'signed_in', isNewAccount: false } }
        case 'needs_signup':
          return {
            kind: 'needs_signup',
            ticket: r.signup_ticket,
            phoneMasked: r.phone_masked,
            submitting: false,
            error: null,
          }
        case 'linked':
          return { kind: 'done', result: { status: 'linked', phoneMasked: r.phone_masked } }
        case 'phone_in_use':
          return { kind: 'blocked', reason: 'phone_in_use' }
        case 'not_allowed':
          return { kind: 'blocked', reason: 'not_allowed' }
        default:
          // An unknown status from a newer server: treat as a calm retry, never as success.
          return { kind: 'error', message: WA_COPY.retry }
      }
    }
    case 'poll_failed': {
      if (state.kind !== 'waiting') return state
      const failures = state.failures + 1
      return failures >= MAX_POLL_FAILURES
        ? { kind: 'error', message: WA_COPY.retry }
        : { ...state, failures }
    }
    case 'signup_submitting':
      return state.kind === 'needs_signup' ? { ...state, submitting: true, error: null } : state
    case 'signup_failed':
      return state.kind === 'needs_signup'
        ? { ...state, submitting: false, error: action.message }
        : state
    case 'signup_done':
      return state.kind === 'needs_signup'
        ? { kind: 'done', result: { status: 'signed_in', isNewAccount: true } }
        : state
  }
}
