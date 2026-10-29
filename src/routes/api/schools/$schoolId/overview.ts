import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../db/connection'
import { wrapRouteHandlers } from '../../../../lib/error-log'
import { requireSchoolRole } from '../../../../lib/school-session'
import { loadSchoolOverview } from '../../../../lib/schools/overview'

// Everything the school screens need for one school, trimmed to what the caller's role may see.
export const Route = createFileRoute('/api/schools/$schoolId/overview')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const scope = await requireSchoolRole(request, params.schoolId)
        if (scope instanceof Response) return scope
        return Response.json(await loadSchoolOverview(getSharedDb(), scope), {
          headers: { 'cache-control': 'no-store' },
        })
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/schools/$schoolId/overview', ['GET'])
