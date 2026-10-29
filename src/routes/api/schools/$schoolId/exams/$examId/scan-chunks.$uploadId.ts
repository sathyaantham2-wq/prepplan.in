import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../../../db/connection'
import { wrapRouteHandlers } from '../../../../../../lib/error-log'
import { requireSchoolRole } from '../../../../../../lib/school-session'
import { SchoolError } from '../../../../../../lib/schools/common'
import { saveScanChunk } from '../../../../../../lib/schools/scan-service'

// One piece (at most 3.5 MB, raw bytes, not base64) of a file being uploaded. The pieces are joined
// when the page is submitted to .../scans with the same upload id. The office and the teacher of
// the subject only.
export const Route = createFileRoute(
  '/api/schools/$schoolId/exams/$examId/scan-chunks/$uploadId',
)({
  server: {
    handlers: {
      PUT: async ({ request, params }) => {
        const scope = await requireSchoolRole(
          request,
          params.schoolId,
          'school_admin',
          'teacher',
        )
        if (scope instanceof Response) return scope
        try {
          const seq = Number(new URL(request.url).searchParams.get('seq'))
          const bytes = Buffer.from(await request.arrayBuffer())
          return Response.json(
            await saveScanChunk(
              getSharedDb(),
              scope,
              params.examId,
              params.uploadId,
              seq,
              bytes,
            ),
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
  '/api/schools/$schoolId/exams/$examId/scan-chunks/$uploadId',
  ['PUT'],
)
