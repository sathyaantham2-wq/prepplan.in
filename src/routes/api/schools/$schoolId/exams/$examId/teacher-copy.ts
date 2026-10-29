import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../../../db/connection'
import { wrapRouteHandlers } from '../../../../../../lib/error-log'
import { requireSchoolRole } from '../../../../../../lib/school-session'
import { SchoolError } from '../../../../../../lib/schools/common'
import { renderTeacherCopy } from '../../../../../../lib/schools/exam-service'
import { pdfResponse } from '../../../../../../lib/schools/pdf-response'

// teacher-copy (PDF). Staff of the school only; students and parents are never admitted.
export const Route = createFileRoute(
  '/api/schools/$schoolId/exams/$examId/teacher-copy',
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
          const { pdf, fileName } = await renderTeacherCopy(
            getSharedDb(),
            scope,
            params.examId,
          )
          return pdfResponse(pdf, fileName)
        } catch (e) {
          if (e instanceof SchoolError) return e.toResponse()
          throw e
        }
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/schools/$schoolId/exams/$examId/teacher-copy', [
  'GET',
])
