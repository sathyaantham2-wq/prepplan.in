import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../../../db/connection'
import { requireSchoolRole } from '../../../../../../lib/school-session'
import { SchoolError } from '../../../../../../lib/schools/common'
import { commitRosterImport } from '../../../../../../lib/schools/roster'
import { wrapRouteHandlers } from '../../../../../../lib/error-log'

// Roster upload, step 2: applies the previewed batch in one transaction.
export const Route = createFileRoute(
  '/api/schools/$schoolId/imports/$batchId/commit',
)({
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        const scope = await requireSchoolRole(
          request,
          params.schoolId,
          'school_admin',
        )
        if (scope instanceof Response) return scope
        try {
          return Response.json(
            await commitRosterImport(getSharedDb(), scope, params.batchId),
          )
        } catch (e) {
          if (e instanceof SchoolError) return e.toResponse()
          throw e
        }
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/schools/$schoolId/imports/$batchId/commit', [
  'POST',
])
