import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../db/connection'
import { wrapRouteHandlers } from '../../../lib/error-log'
import { loadParentView } from '../../../lib/schools/messaging/parent-view'

// The data behind a parent's personal link (/p/<token>). No login: the signed, 7-day link is the whole key.
// An expired, altered or foreign link gets the same answer, so the page cannot be used to probe. Nothing is
// logged about the visit (purpose limit: no analytics on school people).
const hits = new Map<string, { n: number; since: number }>()
function tooMany(ip: string, now = Date.now()): boolean {
  const h = hits.get(ip)
  if (!h || now - h.since > 60_000) {
    hits.set(ip, { n: 1, since: now })
    return false
  }
  h.n += 1
  return h.n > 60
}

export const Route = createFileRoute('/api/parent-link/$token')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
        if (tooMany(ip)) return new Response('Too many requests', { status: 429 })
        const view = await loadParentView(getSharedDb(), params.token)
        return Response.json(view, {
          headers: {
            'cache-control': 'private, no-store',
            'referrer-policy': 'no-referrer',
            'x-robots-tag': 'noindex, nofollow',
          },
        })
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/parent-link/$token', ['GET'])
