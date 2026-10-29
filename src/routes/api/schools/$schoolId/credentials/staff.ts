import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../../db/connection'
import { wrapRouteHandlers } from '../../../../../lib/error-log'
import { requireSchoolRole } from '../../../../../lib/school-session'
import { SchoolError } from '../../../../../lib/schools/common'
import { issueStaffCredentials } from '../../../../../lib/schools/credentials'
import { readJson, str } from '../../../../../lib/schools/http'

// School admin: send a staff member a one-time set-password link ('email'), or print a one-time
// code ('slip'). A slip's code is shown once, here, and is never stored in readable form.
export const Route = createFileRoute(
  '/api/schools/$schoolId/credentials/staff',
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
        const b = await readJson(request)
        const memberId = str(b?.member_id)
        const delivery =
          b?.delivery === 'slip'
            ? 'slip'
            : b?.delivery === 'email'
              ? 'email'
              : null
        if (!memberId || !delivery)
          return Response.json(
            {
              error: 'invalid',
              message: 'Send member_id and delivery (email or slip).',
            },
            { status: 400 },
          )
        try {
          const r = await issueStaffCredentials(getSharedDb(), scope, {
            memberId,
            delivery,
          })
          return Response.json(r, { headers: { 'cache-control': 'no-store' } })
        } catch (e) {
          if (e instanceof SchoolError) return e.toResponse()
          throw e
        }
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/schools/$schoolId/credentials/staff', ['POST'])
