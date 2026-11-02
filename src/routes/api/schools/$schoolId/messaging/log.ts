import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../../db/connection'
import { wrapRouteHandlers } from '../../../../../lib/error-log'
import { requireSchoolRole } from '../../../../../lib/school-session'
import { SchoolError } from '../../../../../lib/schools/common'
import { messagingOverview } from '../../../../../lib/schools/messaging/log'

// The message log. The office sees every message; a teacher only her own sections; the principal a summary.
export const Route = createFileRoute('/api/schools/$schoolId/messaging/log')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const scope = await requireSchoolRole(request, params.schoolId, 'school_admin', 'principal', 'teacher')
        if (scope instanceof Response) return scope
        try {
          return Response.json(await messagingOverview(getSharedDb(), scope), { headers: { 'cache-control': 'private, no-store' } })
        } catch (e) {
          if (e instanceof SchoolError) return e.toResponse()
          throw e
        }
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/schools/$schoolId/messaging/log', ['GET'])
