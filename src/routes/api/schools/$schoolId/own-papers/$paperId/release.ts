import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../../../db/connection'
import { wrapRouteHandlers } from '../../../../../../lib/error-log'
import { requireSchoolRole } from '../../../../../../lib/school-session'
import { SchoolError } from '../../../../../../lib/schools/common'
import { readJson, str } from '../../../../../../lib/schools/http'
import {
  decideDispute,
  disputeQueue,
  releaseSection,
  releaseStatus,
} from '../../../../../../lib/schools/results-release'

// Releasing an own paper's results to its students, section by section, and the flags students raise.
// GET: each section's release state (and what blocks it) and the flags. POST { action: 'release',
// section_id } hands the section's results to its students; POST { action: 'decide', dispute_id, marks,
// note } is the teacher's final decision on a flag.
export const Route = createFileRoute(
  '/api/schools/$schoolId/own-papers/$paperId/release',
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
          const db = getSharedDb()
          return Response.json(
            {
              sections: await releaseStatus(db, scope, params.paperId),
              disputes: await disputeQueue(db, scope, params.paperId),
            },
            { headers: { 'cache-control': 'private, no-store' } },
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
        const b = await readJson(request)
        const db = getSharedDb()
        try {
          if (str(b?.action) === 'release')
            return Response.json(
              await releaseSection(
                db,
                scope,
                params.paperId,
                str(b?.section_id) ?? '',
              ),
            )
          if (str(b?.action) === 'decide')
            return Response.json(
              await decideDispute(
                db,
                scope,
                str(b?.dispute_id) ?? '',
                Number(b?.marks),
                str(b?.note) ?? '',
              ),
            )
          return new Response(null, { status: 400 })
        } catch (e) {
          if (e instanceof SchoolError) return e.toResponse()
          throw e
        }
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/schools/$schoolId/own-papers/$paperId/release', [
  'GET',
  'POST',
])
