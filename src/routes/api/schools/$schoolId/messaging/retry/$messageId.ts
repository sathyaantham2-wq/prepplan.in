import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../../../db/connection'
import { wrapRouteHandlers } from '../../../../../../lib/error-log'
import { requireSchoolRole } from '../../../../../../lib/school-session'
import { SchoolError } from '../../../../../../lib/schools/common'
import { retryMessage } from '../../../../../../lib/schools/messaging/log'

// The office tries a failed or "not sent" message again.
export const Route = createFileRoute('/api/schools/$schoolId/messaging/retry/$messageId')({
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        const scope = await requireSchoolRole(request, params.schoolId, 'school_admin')
        if (scope instanceof Response) return scope
        try {
          await retryMessage(getSharedDb(), scope, params.messageId)
          return Response.json({ ok: true })
        } catch (e) {
          if (e instanceof SchoolError) return e.toResponse()
          throw e
        }
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/schools/$schoolId/messaging/retry/$messageId', ['POST'])
