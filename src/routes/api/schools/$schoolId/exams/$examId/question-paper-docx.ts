import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../../../db/connection'
import { wrapRouteHandlers } from '../../../../../../lib/error-log'
import { requireSchoolRole } from '../../../../../../lib/school-session'
import { SchoolError } from '../../../../../../lib/schools/common'
import { renderQuestionPaperDocx } from '../../../../../../lib/schools/exam-service'
import { docxResponse } from '../../../../../../lib/schools/pdf-response'

// The question paper as an editable Word file. Same people as the PDF: staff of the school only
// (office, the subject's teacher, the principal); students and parents are never admitted. The file
// holds no answers.
export const Route = createFileRoute(
  '/api/schools/$schoolId/exams/$examId/question-paper-docx',
)({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const scope = await requireSchoolRole(
          request,
          params.schoolId,
          'school_admin',
          'teacher',
          'principal',
        )
        if (scope instanceof Response) return scope
        try {
          const { docx, fileName } = await renderQuestionPaperDocx(
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
  '/api/schools/$schoolId/exams/$examId/question-paper-docx',
  ['GET'],
)
