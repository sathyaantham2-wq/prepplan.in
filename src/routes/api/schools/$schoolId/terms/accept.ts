import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../../db/connection'
import { requireSchoolRole } from '../../../../../lib/school-session'
import { SchoolError } from '../../../../../lib/schools/common'
import { acceptSchoolTerms } from '../../../../../lib/schools/terms'
import { wrapRouteHandlers } from '../../../../../lib/error-log'

// The school admin accepts the current PrepPlan school terms (who, when, version are recorded).
export const Route = createFileRoute('/api/schools/$schoolId/terms/accept')({
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
          const row = await acceptSchoolTerms(getSharedDb(), scope, {
            ip:
              request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
              null,
          })
          return Response.json({
            terms_version: row.terms_version,
            accepted_at: row.accepted_at,
          })
        } catch (e) {
          if (e instanceof SchoolError) return e.toResponse()
          throw e
        }
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/schools/$schoolId/terms/accept', ['POST'])
