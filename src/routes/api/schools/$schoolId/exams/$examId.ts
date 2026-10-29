import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../../db/connection'
import { wrapRouteHandlers } from '../../../../../lib/error-log'
import { requireSchoolRole } from '../../../../../lib/school-session'
import { SchoolError } from '../../../../../lib/schools/common'
import { getExam } from '../../../../../lib/schools/exam-service'

// One exam: what it is, its gaps, how many booklets have been made. No question text, no answers.
export const Route = createFileRoute('/api/schools/$schoolId/exams/$examId')({
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
          return Response.json(
            await getExam(getSharedDb(), scope, params.examId),
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

wrapRouteHandlers(Route, '/api/schools/$schoolId/exams/$examId', ['GET'])
