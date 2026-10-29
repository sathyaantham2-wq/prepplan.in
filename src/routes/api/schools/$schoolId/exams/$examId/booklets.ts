import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../../../db/connection'
import { wrapRouteHandlers } from '../../../../../../lib/error-log'
import { requireSchoolRole } from '../../../../../../lib/school-session'
import { SchoolError } from '../../../../../../lib/schools/common'
import { readJson, str } from '../../../../../../lib/schools/http'
import { startBookletJob } from '../../../../../../lib/schools/print-service'

// Starts printing the answer booklets of a section (or one student) in batches:
// { section_id?, school_student_id?, batch_size? }. Returns the job; the page then asks for each
// batch in turn and downloads the joined PDF when it is done. The office and the teacher of the
// subject only.
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
          return Response.json(
            await startBookletJob(getSharedDb(), scope, params.examId, {
              sectionId: str(b?.section_id) ?? undefined,
              schoolStudentId: str(b?.school_student_id) ?? undefined,
              batchSize:
                typeof b?.batch_size === 'number' ? b.batch_size : undefined,
            }),
          )
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
