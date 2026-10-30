import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../../../db/connection'
import { wrapRouteHandlers } from '../../../../../../lib/error-log'
import { requireSchoolRole } from '../../../../../../lib/school-session'
import { SchoolError } from '../../../../../../lib/schools/common'
import { renderAnswerKeyDocx } from '../../../../../../lib/schools/exam-service'
import { docxResponse } from '../../../../../../lib/schools/pdf-response'

// The answer key and marking scheme as a Word file. Staff only (the office and the teacher of the subject);
// students and parents are never admitted.
export const Route = createFileRoute(
  '/api/schools/$schoolId/exams/$examId/answer-key-docx',
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
          const { docx, fileName } = await renderAnswerKeyDocx(
            getSharedDb(),
            scope,
            params.examId,
          )
          return docxResponse(docx, fileName)
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
  '/api/schools/$schoolId/exams/$examId/answer-key-docx',
  ['GET'],
)
