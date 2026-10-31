import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../db/connection'
import { wrapRouteHandlers } from '../../../../lib/error-log'
import { requireSchoolRole } from '../../../../lib/school-session'
import { SchoolError } from '../../../../lib/schools/common'
import { myProgress } from '../../../../lib/schools/progress'

// The Progress Report data for a school student (her own) or a parent (one of her own children, ?child=).
// Only locked marks feed the levels, the trends and the growth line.
export const Route = createFileRoute('/api/schools/$schoolId/progress')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const scope = await requireSchoolRole(request, params.schoolId, 'student', 'parent')
        if (scope instanceof Response) return scope
        try {
          const child = new URL(request.url).searchParams.get('child')
          return Response.json(await myProgress(getSharedDb(), scope, child), {
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

wrapRouteHandlers(Route, '/api/schools/$schoolId/progress', ['GET'])
