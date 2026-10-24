import { describe, expect, it, vi } from 'vitest'


import { auth } from '../lib/auth'
import { Route as WebhookRoute } from './api/webhooks/whatsapp'

// Set before any module reads the env (vi.hoisted runs ahead of the imports).
vi.hoisted(() => {
  for (const key of [
    'WHATSAPP_BUSINESS_NUMBER',
    'WHATSAPP_APP_SECRET',
    'WHATSAPP_VERIFY_TOKEN',
    'WHATSAPP_ACCESS_TOKEN',
    'WHATSAPP_PHONE_NUMBER_ID',
  ]) {
    delete process.env[key]
  }
})

type RouteHandler = (opts: { request: Request }) => Promise<Response>
const handlers = (WebhookRoute.options.server as { handlers: Record<string, RouteHandler> }).handlers

function api(path: string, method: string, body?: unknown) {
  return auth.handler(
    new Request(`http://localhost:3000/api/auth${path}`, {
      method,
      headers: { 'content-type': 'application/json', origin: 'http://localhost:3000' },
      body: method === 'GET' ? undefined : JSON.stringify(body ?? {}),
    }),
  )
}

describe('Continue with WhatsApp when not configured', () => {
  it('config says disabled', async () => {
    const res = await api('/whatsapp/config', 'GET')
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ enabled: false, business_number_display: null })
  })

  it('start, poll and complete-signup answer 404 not_enabled', async () => {
    const cases: Array<[string, unknown]> = [
      ['/whatsapp/start', { purpose: 'signin' }],
      ['/whatsapp/poll', { challenge_id: '00000000-0000-4000-8000-000000000000', poll_token: 'x' }],
      ['/whatsapp/complete-signup', { signup_ticket: 'x', name: 'A', consent: true }],
    ]
    for (const [path, body] of cases) {
      const res = await api(path, 'POST', body)
      expect(res.status).toBe(404)
      expect(await res.json()).toMatchObject({ error: 'not_enabled' })
    }
  })

  it('the webhook is 404 for GET and POST', async () => {
    const get = await handlers.GET({
      request: new Request('http://localhost/api/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=x&hub.challenge=1'),
    })
    expect(get.status).toBe(404)
    const post = await handlers.POST({
      request: new Request('http://localhost/api/webhooks/whatsapp', { method: 'POST', body: '{}' }),
    })
    expect(post.status).toBe(404)
  })
})
