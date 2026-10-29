import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../../../../../db/connection'
import { wrapRouteHandlers } from '../../../../../../../../lib/error-log'
import { requireSchoolRole } from '../../../../../../../../lib/school-session'
import { SchoolError } from '../../../../../../../../lib/schools/common'
import { pdfResponse } from '../../../../../../../../lib/schools/pdf-response'
import { bookletJobResult } from '../../../../../../../../lib/schools/print-service'

// The joined PDF of a finished booklet print job.
export const Route = createFileRoute(
  '/api/schools/$schoolId/exams/$examId/booklet-jobs/$jobId/result',
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
          const { pdf, fileName } = await bookletJobResult(
            getSharedDb(),
            scope,
            params.jobId,
          )
          return pdfResponse(pdf, fileName)
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
  '/api/schools/$schoolId/exams/$examId/booklet-jobs/$jobId/result',
  ['GET'],
)
