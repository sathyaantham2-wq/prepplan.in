import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../../../db/connection'
import { wrapRouteHandlers } from '../../../../../../lib/error-log'
import { requireSchoolRole } from '../../../../../../lib/school-session'
import { SchoolError } from '../../../../../../lib/schools/common'
import { readJson, str } from '../../../../../../lib/schools/http'
import {
  cancelMarkingJob,
  latestJob,
  markingJobStep,
  startMarkingJob,
} from '../../../../../../lib/schools/marking-jobs'

// "Mark all ready students" as a job. GET: the newest job of this paper (so a reopened page can carry on).
// POST { action: 'start', student_ids? } starts one (or returns the one already running); { action: 'step',
// job_id } marks the next student and says where the job stands (call it until `remaining` is 0); { action:
// 'cancel', job_id } stops it.
export const Route = createFileRoute(
  '/api/schools/$schoolId/own-papers/$paperId/marking-jobs',
)({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const scope = await requireSchoolRole(request, params.schoolId, 'school_admin', 'teacher')
        if (scope instanceof Response) return scope
        try {
          return Response.json({ job: await latestJob(getSharedDb(), scope, params.paperId) }, { headers: { 'cache-control': 'private, no-store' } })
        } catch (e) {
          if (e instanceof SchoolError) return e.toResponse()
          throw e
        }
      },
      POST: async ({ request, params }) => {
        const scope = await requireSchoolRole(request, params.schoolId, 'school_admin', 'teacher')
        if (scope instanceof Response) return scope
        const b = await readJson(request)
        const db = getSharedDb()
        try {
          const action = str(b?.action)
          if (action === 'start')
            return Response.json({
              job: await startMarkingJob(
                db,
                scope,
                params.paperId,
                Array.isArray(b?.student_ids) ? (b.student_ids as Array<string>) : undefined,
              ),
            })
          if (action === 'step')
            return Response.json({ job: await markingJobStep(db, scope, str(b?.job_id) ?? '') })
          if (action === 'cancel')
            return Response.json({ job: await cancelMarkingJob(db, scope, str(b?.job_id) ?? '') })
          return new Response(null, { status: 400 })
        } catch (e) {
          if (e instanceof SchoolError) return e.toResponse()
          throw e
        }
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/schools/$schoolId/own-papers/$paperId/marking-jobs', ['GET', 'POST'])
