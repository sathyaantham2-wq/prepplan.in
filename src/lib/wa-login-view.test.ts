import { describe, expect, it } from 'vitest'
import {
  MAX_POLL_FAILURES,
  challengeFromStart,
  copyFallbackText,
  fallbackLead,
  flowReducer,
  formatCountdown,
  initialFlowState,
  isTerminal,
  messageForStatus,
  pollIntervalMs,
  remainingFraction,
} from './wa-login-view'
import type { WaFlowState } from './wa-login-view'

const start = {
  challenge_id: 'c1',
  code: 'K7M2XQ9A',
  message_text: 'PREPPLAN K7M2XQ9A',
  wa_url: 'https://wa.me/919876543210?text=PREPPLAN%20K7M2XQ9A',
  poll_token: 'secret',
  expires_at: '2026-10-24T10:10:00.000Z',
}
const now = Date.parse('2026-10-24T10:00:00.000Z')

function waiting(): WaFlowState {
  return flowReducer(initialFlowState, {
    type: 'started',
    challenge: challengeFromStart(start, now),
  })
}

describe('countdown', () => {
  it('formats minutes and seconds', () => {
    expect(formatCountdown(600000)).toBe('10:00')
    expect(formatCountdown(545000)).toBe('9:05')
    expect(formatCountdown(999)).toBe('0:01')
    expect(formatCountdown(-5)).toBe('0:00')
  })
  it('computes the remaining fraction, clamped', () => {
    expect(remainingFraction(0, 0, 100)).toBe(1)
    expect(remainingFraction(25, 0, 100)).toBe(0.75)
    expect(remainingFraction(200, 0, 100)).toBe(0)
    expect(remainingFraction(-5, 0, 100)).toBe(1)
    expect(remainingFraction(5, 10, 10)).toBe(0)
  })
})

describe('poll interval', () => {
  it('is 2s visible, 5s hidden, none when terminal', () => {
    expect(pollIntervalMs({ hidden: false, terminal: false })).toBe(2000)
    expect(pollIntervalMs({ hidden: true, terminal: false })).toBe(5000)
    expect(pollIntervalMs({ hidden: false, terminal: true })).toBeNull()
    expect(pollIntervalMs({ hidden: true, terminal: true })).toBeNull()
  })
})

describe('copy fallback', () => {
  it('uses the server text, or rebuilds it from the code', () => {
    expect(copyFallbackText(start)).toBe('PREPPLAN K7M2XQ9A')
    expect(copyFallbackText({ message_text: ' ', code: 'ABCD2345' })).toBe('PREPPLAN ABCD2345')
  })
  it('names the business number when known', () => {
    expect(fallbackLead('+91 98765 43210')).toBe(
      'WhatsApp did not open? Send this message to +91 98765 43210 yourself:',
    )
    expect(fallbackLead(null)).not.toContain('null')
  })
})

describe('messages', () => {
  it('maps terminal statuses', () => {
    expect(messageForStatus('phone_in_use')).toBe(
      'That WhatsApp number is already used by another PrepPlan account.',
    )
    expect(messageForStatus('not_allowed')).toBe('This number cannot be used to sign in here.')
  })
})

describe('flow reducer', () => {
  it('starts, then waits', () => {
    const s = waiting()
    expect(s.kind).toBe('waiting')
    if (s.kind === 'waiting') {
      expect(s.challenge.expiresAtMs).toBe(now + 600000)
    }
  })
  it('falls back to 10 minutes on a bad expiry', () => {
    const c = challengeFromStart({ ...start, expires_at: 'nonsense' }, now)
    expect(c.expiresAtMs).toBe(now + 600000)
  })
  it('keeps waiting on pending', () => {
    const s = waiting()
    expect(flowReducer(s, { type: 'polled', response: { status: 'pending' } })).toBe(s)
  })
  it.each([
    ['expired', { status: 'expired' as const }, 'expired'],
    ['phone_in_use', { status: 'phone_in_use' as const }, 'blocked'],
    ['not_allowed', { status: 'not_allowed' as const }, 'blocked'],
    ['signed_in', { status: 'signed_in' as const, is_new_account: false as const }, 'done'],
    ['linked', { status: 'linked' as const, phone_masked: '+91 ••••• ••123' }, 'done'],
  ])('handles %s as terminal', (_n, response, kind) => {
    const next = flowReducer(waiting(), { type: 'polled', response })
    expect(next.kind).toBe(kind)
    expect(isTerminal(next)).toBe(true)
  })
  it('goes to signup, and a signup success is done as a new account', () => {
    let s = flowReducer(waiting(), {
      type: 'polled',
      response: { status: 'needs_signup', signup_ticket: 't', phone_masked: '+91 ••123' },
    })
    expect(s.kind).toBe('needs_signup')
    s = flowReducer(s, { type: 'signup_submitting' })
    s = flowReducer(s, { type: 'signup_failed', message: 'x' })
    expect(s).toMatchObject({ kind: 'needs_signup', submitting: false, error: 'x' })
    s = flowReducer(s, { type: 'signup_done' })
    expect(s).toEqual({ kind: 'done', result: { status: 'signed_in', isNewAccount: true } })
  })
  it('ignores a late poll answer after a terminal state', () => {
    const expired = flowReducer(waiting(), { type: 'polled', response: { status: 'expired' } })
    expect(
      flowReducer(expired, {
        type: 'polled',
        response: { status: 'signed_in', is_new_account: false },
      }),
    ).toBe(expired)
    expect(flowReducer(expired, { type: 'poll_failed' })).toBe(expired)
  })
  it('tolerates a few failed polls then shows a retry message', () => {
    let s = waiting()
    for (let i = 0; i < MAX_POLL_FAILURES - 1; i++) {
      s = flowReducer(s, { type: 'poll_failed' })
      expect(s.kind).toBe('waiting')
    }
    s = flowReducer(s, { type: 'poll_failed' })
    expect(s.kind).toBe('error')
  })
  it('a success resets the failure count', () => {
    let s = flowReducer(waiting(), { type: 'poll_failed' })
    s = flowReducer(s, { type: 'polled', response: { status: 'pending' } })
    expect(s).toMatchObject({ kind: 'waiting', failures: 0 })
  })
  it('an unknown status is a retry, never a sign-in', () => {
    const next = flowReducer(waiting(), {
      type: 'polled',
      response: { status: 'mystery' } as never,
    })
    expect(next.kind).toBe('error')
  })
  it('restart goes back to starting', () => {
    expect(flowReducer({ kind: 'expired' }, { type: 'restart' })).toEqual({ kind: 'starting' })
  })
})
