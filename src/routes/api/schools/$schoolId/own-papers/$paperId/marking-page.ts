import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../../../db/connection'
import { wrapRouteHandlers } from '../../../../../../lib/error-log'
import { requireSchoolRole } from '../../../../../../lib/school-session'
import { SchoolError } from '../../../../../../lib/schools/common'
import { markingPageImage } from '../../../../../../lib/schools/marking'

// One page of a student's answer sheet, for the teacher or the office only (never a student), for the side-by-side
// review. GET ?student_id=&page=1. The picture is decrypted here and never has a public address; every look is audited.
export const Route = createFileRoute(
  '/api/schools/$schoolId/own-papers/$paperId/marking-page',
)({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const scope = await requireSchoolRole(request, params.schoolId, 'school_admin', 'teacher')
        if (scope instanceof Response) return scope
        try {
          const q = new URL(request.url).searchParams
          const bytes = await markingPageImage(
            getSharedDb(),
            scope,
            params.paperId,
            q.get('student_id') ?? '',
            Number(q.get('page')),
          )
          const type = bytes.subarray(0, 4).toString('hex') === '89504e47' ? 'image/png' : 'image/jpeg'
          return new Response(new Uint8Array(bytes), {
            headers: {
              'content-type': type,
              'cache-control': 'private, no-store',
              'x-content-type-options': 'nosniff',
            },
          })
        } catch (e) {
          if (e instanceof SchoolError) return e.toResponse()
          throw e
        }
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/schools/$schoolId/own-papers/$paperId/marking-page', ['GET'])
