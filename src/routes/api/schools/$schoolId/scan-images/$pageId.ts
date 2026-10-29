import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../../db/connection'
import { wrapRouteHandlers } from '../../../../../lib/error-log'
import { requireSchoolRole } from '../../../../../lib/school-session'
import { SchoolError } from '../../../../../lib/schools/common'
import { scanImage } from '../../../../../lib/schools/scan-service'

export const Route = createFileRoute(
  '/api/schools/$schoolId/scan-images/$pageId',
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
          const png = await scanImage(
            getSharedDb(),
            scope,
            params.pageId,
            url.searchParams.get('exp'),
            url.searchParams.get('sig'),
          )
          return new Response(new Uint8Array(png), {
            headers: {
              'content-type': 'image/jpeg',
              'cache-control': 'private, no-store',
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

wrapRouteHandlers(Route, '/api/schools/$schoolId/scan-images/$pageId', ['GET'])
