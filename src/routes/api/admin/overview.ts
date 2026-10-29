import { createFileRoute } from '@tanstack/react-router'
import { requireRole } from '../../../lib/session'
import { getSharedDb } from '../../../db/connection'
import { getAdminOverview } from '../../../db/repositories'
import { wrapRouteHandlers } from '../../../lib/error-log'
import { listActiveFixtureSubjects } from '../../../lib/fixture-subjects'

/** GET /api/admin/overview -- the numbers behind the admin console's first screen. Admin only. */
export const Route = createFileRoute('/api/admin/overview')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const auth = await requireRole(request, 'admin')
        if (auth instanceof Response) return auth
        const db = getSharedDb()
        // a seed/fixture/E2E subject that is active is a warning for the admin to act on
        return Response.json(
          {
            ...(await getAdminOverview(db)),
            fixtureSubjectsActive: await listActiveFixtureSubjects(db),
          },
          {
            headers: { 'cache-control': 'no-store' },
          },
        )
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/admin/overview', ['GET'])
