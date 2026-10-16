import { createFileRoute } from '@tanstack/react-router'
import { requireRole } from '../../../lib/session'
import { getSharedDb } from '../../../db/connection'
import { getAdminOverview } from '../../../db/repositories'
import { wrapRouteHandlers } from '../../../lib/error-log'

/** GET /api/admin/overview -- the numbers behind the admin console's first screen. Admin only. */
export const Route = createFileRoute('/api/admin/overview')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const auth = await requireRole(request, 'admin')
        if (auth instanceof Response) return auth
        return Response.json(await getAdminOverview(getSharedDb()), {
          headers: { 'cache-control': 'no-store' },
        })
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/admin/overview', ['GET'])
