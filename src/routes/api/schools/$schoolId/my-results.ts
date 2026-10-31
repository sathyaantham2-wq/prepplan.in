import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../db/connection'
import { wrapRouteHandlers } from '../../../../lib/error-log'
import { requireSchoolRole } from '../../../../lib/school-session'
import { SchoolError } from '../../../../lib/schools/common'
import { myResults } from '../../../../lib/schools/results-release'

// A school student's list of released results (only her own). No other role can open it.
export const Route = createFileRoute('/api/schools/$schoolId/my-results')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const scope = await requireSchoolRole(request, params.schoolId, 'student')
        if (scope instanceof Response) return scope
        try {
          return Response.json(await myResults(getSharedDb(), scope), {
            headers: { 'cache-control': 'private, no-store' },
          })
        } catch (e) {
          if (e instanceof SchoolError) return e.toResponse()
          throw e
        }
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/schools/$schoolId/my-results', ['GET'])
