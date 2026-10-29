import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../../../db/connection'
import { wrapRouteHandlers } from '../../../../../../lib/error-log'
import { requireSchoolRole } from '../../../../../../lib/school-session'
import { SchoolError } from '../../../../../../lib/schools/common'
import { saveOwnSheetChunk } from '../../../../../../lib/schools/own-sheets'

// One piece (at most 3.5 MB, raw bytes) of a scanned page of an own paper's answer sheets.
export const Route = createFileRoute(
  '/api/schools/$schoolId/own-papers/$paperId/sheet-chunks/$uploadId',
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
          return Response.json(
            await saveOwnSheetChunk(
              getSharedDb(),
              scope,
              params.paperId,
              params.uploadId,
              seq,
              Buffer.from(await request.arrayBuffer()),
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
  '/api/schools/$schoolId/own-papers/$paperId/sheet-chunks/$uploadId',
  ['PUT'],
)
