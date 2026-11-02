import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../db/connection'
import { wrapRouteHandlers } from '../../../lib/error-log'
import { handleCallback } from '../../../lib/schools/messaging/callback'

// Make reports back here: a delivery status for one message, or a parent's reply (STOP). Signed with the shared
// secret. Every refusal is the same bare 401, so the route cannot be used to find out which message ids exist.
export const Route = createFileRoute('/api/messaging/callback')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json().catch(() => null)) as unknown
        const r = await handleCallback(getSharedDb(), body)
        if (!r.ok) return new Response(null, { status: r.reason === 'bad_request' ? 400 : 401 })
        return Response.json({ ok: true })
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/messaging/callback', ['POST'])
