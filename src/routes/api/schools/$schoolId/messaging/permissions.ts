import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../../db/connection'
import { wrapRouteHandlers } from '../../../../../lib/error-log'
import { requireSchoolRole } from '../../../../../lib/school-session'
import { SchoolError } from '../../../../../lib/schools/common'
import { listPermissions } from '../../../../../lib/schools/messaging/permissions'

// Parent WhatsApp contact permission, one row per active student. The office only.
export const Route = createFileRoute('/api/schools/$schoolId/messaging/permissions')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const scope = await requireSchoolRole(request, params.schoolId, 'school_admin')
        if (scope instanceof Response) return scope
        try {
          return Response.json(
            { students: await listPermissions(getSharedDb(), scope) },
            { headers: { 'cache-control': 'private, no-store' } },
          )
        } catch (e) {
          if (e instanceof SchoolError) return e.toResponse()
          throw e
        }
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/schools/$schoolId/messaging/permissions', ['GET'])
