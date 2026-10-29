import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../../../db/connection'
import { wrapRouteHandlers } from '../../../../../../lib/error-log'
import { requireSchoolRole } from '../../../../../../lib/school-session'
import { SchoolError } from '../../../../../../lib/schools/common'
import { resetStudentPassword } from '../../../../../../lib/schools/credentials'

// Class teacher (or admin): reset a student's password. The old one stops working at once and
// she gets a new one-time code to print. Recorded in audit_log (the code is not).
export const Route = createFileRoute(
  '/api/schools/$schoolId/students/$schoolStudentId/reset-password',
)({
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        const scope = await requireSchoolRole(
          request,
          params.schoolId,
          'school_admin',
          'teacher',
        )
        if (scope instanceof Response) return scope
        try {
          const slip = await resetStudentPassword(
            getSharedDb(),
            scope,
            params.schoolStudentId,
          )
          return Response.json(
            { slip },
            { headers: { 'cache-control': 'no-store' } },
          )
        } catch (e) {
          if (e instanceof SchoolError) return e.toResponse()
          throw e
        }
      },
    },
  },
})

wrapRouteHandlers(
  Route,
  '/api/schools/$schoolId/students/$schoolStudentId/reset-password',
  ['POST'],
)
