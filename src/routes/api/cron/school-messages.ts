import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../db/connection'
import { env } from '../../../lib/env'
import { wrapRouteHandlers } from '../../../lib/error-log'
import { runMessagingTick } from '../../../lib/schools/messaging/tick'

/**
 * School messaging clock (docs/schools/MESSAGING_PLAN.md section 7): every 30 minutes it creates the scheduled
 * events that are due (India time), sends what is due, and applies log retention. Same CRON_SECRET pattern as the
 * other cron routes. A school only takes part when its `messaging_enabled` switch is on, and nothing leaves at all
 * until MAKE_MESSAGING_WEBHOOK_URL and MAKE_MESSAGING_SECRET are set.
 */
export const Route = createFileRoute('/api/cron/school-messages')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!env.CRON_SECRET) return new Response('CRON_SECRET is not configured', { status: 500 })
        if (request.headers.get('authorization') !== `Bearer ${env.CRON_SECRET}`)
          return new Response('Unauthorized', { status: 401 })
        return Response.json(await runMessagingTick(getSharedDb()))
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/cron/school-messages', ['GET'])
