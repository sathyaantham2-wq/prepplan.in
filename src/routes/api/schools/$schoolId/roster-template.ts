import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../db/connection'
import { wrapRouteHandlers } from '../../../../lib/error-log'
import { requireSchoolRole } from '../../../../lib/school-session'
import { SchoolError } from '../../../../lib/schools/common'
import { buildRosterTemplate } from '../../../../lib/schools/roster-template'

// The sample Excel file for a roster upload: ?kind=students|teachers. The school office only.
export const Route = createFileRoute('/api/schools/$schoolId/roster-template')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const scope = await requireSchoolRole(
          request,
          params.schoolId,
          'school_admin',
        )
        if (scope instanceof Response) return scope
        const kind = new URL(request.url).searchParams.get('kind')
        if (kind !== 'students' && kind !== 'teachers')
          return Response.json(
            {
              error: 'invalid',
              message: 'Ask for the students or the teachers sample.',
            },
            { status: 400 },
          )
        try {
          const { bytes, fileName } = await buildRosterTemplate(
            getSharedDb(),
            scope,
            kind,
          )
          return new Response(new Uint8Array(bytes), {
            headers: {
              'content-type':
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              'content-disposition': `attachment; filename="${fileName}"`,
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

wrapRouteHandlers(Route, '/api/schools/$schoolId/roster-template', ['GET'])
