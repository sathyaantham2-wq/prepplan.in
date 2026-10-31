import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../../db/connection'
import { wrapRouteHandlers } from '../../../../../lib/error-log'
import { requireSchoolRole } from '../../../../../lib/school-session'
import { SchoolError } from '../../../../../lib/schools/common'
import { mySheetImage } from '../../../../../lib/schools/progress'

// One of a student's own scanned pages (or her child's, for a parent), through a signed link that expires in
// ten minutes. Another student's page, a bad link and a missing page all look the same.
export const Route = createFileRoute('/api/schools/$schoolId/my-sheet-images/$sheetId')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const scope = await requireSchoolRole(request, params.schoolId, 'student', 'parent')
        if (scope instanceof Response) return scope
        try {
          const url = new URL(request.url)
          const bytes = await mySheetImage(
            getSharedDb(),
            scope,
            params.sheetId,
            url.searchParams.get('exp'),
            url.searchParams.get('sig'),
            url.searchParams.get('child'),
          )
          const type =
            bytes.subarray(0, 4).toString('hex') === '89504e47' ? 'image/png' : 'image/jpeg'
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

wrapRouteHandlers(Route, '/api/schools/$schoolId/my-sheet-images/$sheetId', ['GET'])
