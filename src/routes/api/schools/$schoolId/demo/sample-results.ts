import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../../db/connection'
import { wrapRouteHandlers } from '../../../../../lib/error-log'
import { requireSchoolRole } from '../../../../../lib/school-session'
import { SchoolError } from '../../../../../lib/schools/common'
import { readJson, str } from '../../../../../lib/schools/http'
import { useSampleAnswerSheets } from '../../../../../lib/schools/demo'

export const Route = createFileRoute(
  '/api/schools/$schoolId/demo/sample-results',
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
          const examId = str(b?.exam_id)
          if (!examId) throw new SchoolError('invalid', 'Choose an exam.')
          return Response.json(
            await useSampleAnswerSheets(getSharedDb(), scope, examId),
          )
        } catch (e) {
          if (e instanceof SchoolError) return e.toResponse()
          throw e
        }
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/schools/$schoolId/demo/sample-results', ['POST'])
