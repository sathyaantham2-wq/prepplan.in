import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../../../db/connection'
import { wrapRouteHandlers } from '../../../../../../lib/error-log'
import { requireSchoolRole } from '../../../../../../lib/school-session'
import { SchoolError } from '../../../../../../lib/schools/common'
import { listSectionStudents } from '../../../../../../lib/schools/overview'

// The students of one section (name, admission number, roll number, whether she has signed in).
export const Route = createFileRoute(
  '/api/schools/$schoolId/sections/$sectionId/students',
)({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const scope = await requireSchoolRole(
          request,
          params.schoolId,
          'school_admin',
          'principal',
          'teacher',
        )
        if (scope instanceof Response) return scope
        try {
          return Response.json(
            {
              students: await listSectionStudents(
                getSharedDb(),
                scope,
                params.sectionId,
              ),
            },
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
  '/api/schools/$schoolId/sections/$sectionId/students',
  ['GET'],
)
