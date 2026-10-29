import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../../../db/connection'
import { wrapRouteHandlers } from '../../../../../../lib/error-log'
import { requireSchoolRole } from '../../../../../../lib/school-session'
import { SchoolError } from '../../../../../../lib/schools/common'
import { renderBooklets } from '../../../../../../lib/schools/exam-service'
import { readJson, str } from '../../../../../../lib/schools/http'
import { pdfResponse } from '../../../../../../lib/schools/pdf-response'

// The Smart Answer Booklets (PDF) for a section, or one student: { section_id?, school_student_id? }.
// The office and the teacher of the subject only.
export const Route = createFileRoute(
  '/api/schools/$schoolId/exams/$examId/booklets',
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
        const b = await readJson(request)
        try {
          const r = await renderBooklets(getSharedDb(), scope, params.examId, {
            sectionId: str(b?.section_id) ?? undefined,
            schoolStudentId: str(b?.school_student_id) ?? undefined,
          })
          const res = pdfResponse(r.pdf, r.fileName)
          res.headers.set('x-booklet-students', String(r.students))
          res.headers.set('x-booklet-pages', String(r.pages))
          return res
        } catch (e) {
          if (e instanceof SchoolError) return e.toResponse()
          throw e
        }
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/schools/$schoolId/exams/$examId/booklets', [
  'POST',
])
