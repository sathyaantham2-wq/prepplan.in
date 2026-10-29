import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../../../../../db/connection'
import { wrapRouteHandlers } from '../../../../../../../../lib/error-log'
import { requireSchoolRole } from '../../../../../../../../lib/school-session'
import { SchoolError } from '../../../../../../../../lib/schools/common'
import { readJson, str } from '../../../../../../../../lib/schools/http'
import { assignScanPage } from '../../../../../../../../lib/schools/scan-service'

export const Route = createFileRoute(
  '/api/schools/$schoolId/exams/$examId/scan-pages/$pageId/assign',
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
          return Response.json(
            await assignScanPage(
              getSharedDb(),
              scope,
              params.examId,
              params.pageId,
              {
                schoolStudentId: sid,
                pageNo: typeof b?.page_no === 'number' ? b.page_no : 0,
              },
              b?.replace === true,
            ),
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
  '/api/schools/$schoolId/exams/$examId/scan-pages/$pageId/assign',
  ['POST'],
)
