import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../../db/connection'
import { wrapRouteHandlers } from '../../../../../lib/error-log'
import { requireSchoolRole } from '../../../../../lib/school-session'
import { SchoolError } from '../../../../../lib/schools/common'
import { ownSheetImage } from '../../../../../lib/schools/own-sheets'

// One scanned page of an own paper's answer sheets, through a signed link that expires in ten minutes,
// for the office and the teacher of the subject only. A bad link and a missing page look the same.
export const Route = createFileRoute(
  '/api/schools/$schoolId/own-sheet-images/$sheetId',
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
          const url = new URL(request.url)
          const bytes = await ownSheetImage(
            getSharedDb(),
            scope,
            params.sheetId,
            url.searchParams.get('exp'),
            url.searchParams.get('sig'),
          )
          const type =
            bytes.subarray(0, 4).toString('hex') === '89504e47'
              ? 'image/png'
              : bytes.subarray(0, 4).toString() === '%PDF'
                ? 'application/pdf'
                : 'image/jpeg'
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

wrapRouteHandlers(Route, '/api/schools/$schoolId/own-sheet-images/$sheetId', [
  'GET',
])
