import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../../../../db/connection'
import { wrapRouteHandlers } from '../../../../../../../lib/error-log'
import { requireSchoolRole } from '../../../../../../../lib/school-session'
import { SchoolError } from '../../../../../../../lib/schools/common'
import {
  getBookletJob,
  stepBookletJob,
} from '../../../../../../../lib/schools/print-service'

// A booklet print job. GET: how far it is. POST: make the next batch (and, after the last, join
// them into one PDF), then say how far it is.
export const Route = createFileRoute(
  '/api/schools/$schoolId/exams/$examId/booklet-jobs/$jobId',
)({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const scope = await requireSchoolRole(
          request,
          params.schoolId,
          'school_admin',
          'teacher',
        )
        if (scope instanceof Response) return scope
        try {
          return Response.json(
            await getBookletJob(getSharedDb(), scope, params.jobId),
            { headers: { 'cache-control': 'no-store' } },
          )
        } catch (e) {
          if (e instanceof SchoolError) return e.toResponse()
          throw e
        }
      },
      POST: async ({ request, params }) => {
        const scope = await requireSchoolRole(
          request,
          params.schoolId,
          'school_admin',
          'teacher',
        )
        if (scope instanceof Response) return scope
        try {
          return Response.json(
            await stepBookletJob(getSharedDb(), scope, params.jobId),
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
  '/api/schools/$schoolId/exams/$examId/booklet-jobs/$jobId',
  ['GET', 'POST'],
)
