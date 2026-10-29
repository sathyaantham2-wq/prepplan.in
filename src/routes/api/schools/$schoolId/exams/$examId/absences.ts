import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../../../db/connection'
import { wrapRouteHandlers } from '../../../../../../lib/error-log'
import { requireSchoolRole } from '../../../../../../lib/school-session'
import { SchoolError } from '../../../../../../lib/schools/common'
import { readJson, str } from '../../../../../../lib/schools/http'
import { setStudentAbsent } from '../../../../../../lib/schools/scan-service'

export const Route = createFileRoute(
  '/api/schools/$schoolId/exams/$examId/absences',
)({
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        const scope = await requireSchoolRole(
          request,
          params.schoolId,
          'school_admin',
          'teacher',
        )
        if (scope instanceof Response) return scope
        try {
          const b = await readJson(request)
          const sid = str(b?.school_student_id)
          if (!sid) throw new SchoolError('invalid', 'Choose a student.')
          await setStudentAbsent(
            getSharedDb(),
            scope,
            params.examId,
            sid,
            b?.absent !== false,
          )
          return Response.json({ ok: true })
        } catch (e) {
          if (e instanceof SchoolError) return e.toResponse()
          throw e
        }
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/schools/$schoolId/exams/$examId/absences', [
  'POST',
])
