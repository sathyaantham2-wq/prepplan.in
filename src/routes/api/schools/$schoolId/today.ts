import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../db/connection'
import { wrapRouteHandlers } from '../../../../lib/error-log'
import { requireSchoolRole } from '../../../../lib/school-session'
import { SchoolError } from '../../../../lib/schools/common'
import { schoolToday } from '../../../../lib/schools/today'

// The Home screen's "Today" list, the exams-this-year figure and the recent papers (read-only, staff only; a teacher
// sees only their own section-subject pairs).
export const Route = createFileRoute('/api/schools/$schoolId/today')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const scope = await requireSchoolRole(request, params.schoolId, 'school_admin', 'principal', 'teacher')
        if (scope instanceof Response) return scope
        try {
          return Response.json(await schoolToday(getSharedDb(), scope), { headers: { 'cache-control': 'private, no-store' } })
        } catch (e) {
          if (e instanceof SchoolError) return e.toResponse()
          throw e
        }
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/schools/$schoolId/today', ['GET'])
