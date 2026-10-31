import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../db/connection'
import { wrapRouteHandlers } from '../../../../lib/error-log'
import { requireSchoolRole } from '../../../../lib/school-session'
import { SchoolError } from '../../../../lib/schools/common'
import { classProgress, exportProgress } from '../../../../lib/schools/class-progress'

// Class Progress for a teacher (their own sections and subjects) or the office. GET ?section=&subject= returns
// the heatmaps and the students who need attention; GET ?export=csv|xlsx&section= downloads the topic levels
// and self-reflections for the Holistic Progress Card.
export const Route = createFileRoute('/api/schools/$schoolId/class-progress')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const scope = await requireSchoolRole(request, params.schoolId, 'school_admin', 'principal', 'teacher')
        if (scope instanceof Response) return scope
        try {
          const q = new URL(request.url).searchParams
          const db = getSharedDb()
          const fmt = q.get('export')
          if (fmt === 'csv' || fmt === 'xlsx') {
            const out = await exportProgress(db, scope, q.get('section') ?? '', fmt)
            return new Response(typeof out.body === 'string' ? out.body : new Uint8Array(out.body), {
              headers: {
                'content-type': out.type,
                'content-disposition': `attachment; filename="${out.name}"`,
                'cache-control': 'private, no-store',
              },
            })
          }
          return Response.json(await classProgress(db, scope, q.get('section'), q.get('subject')), {
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

wrapRouteHandlers(Route, '/api/schools/$schoolId/class-progress', ['GET'])
