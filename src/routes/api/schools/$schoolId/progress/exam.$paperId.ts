import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../../db/connection'
import { wrapRouteHandlers } from '../../../../../lib/error-log'
import { requireSchoolRole } from '../../../../../lib/school-session'
import { SchoolError } from '../../../../../lib/schools/common'
import { examInsight } from '../../../../../lib/schools/progress'

// One exam's report for a student or her parent: score, where the marks went, three things to fix, and the
// question grid.
export const Route = createFileRoute('/api/schools/$schoolId/progress/exam/$paperId')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const scope = await requireSchoolRole(request, params.schoolId, 'student', 'parent')
        if (scope instanceof Response) return scope
        try {
          const child = new URL(request.url).searchParams.get('child')
          return Response.json(await examInsight(getSharedDb(), scope, params.paperId, child), {
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

wrapRouteHandlers(Route, '/api/schools/$schoolId/progress/exam/$paperId', ['GET'])
