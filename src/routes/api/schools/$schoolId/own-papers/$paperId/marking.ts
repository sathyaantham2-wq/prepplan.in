import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../../../db/connection'
import { wrapRouteHandlers } from '../../../../../../lib/error-log'
import { requireSchoolRole } from '../../../../../../lib/school-session'
import { SchoolError } from '../../../../../../lib/schools/common'
import { readJson, str } from '../../../../../../lib/schools/http'
import {
  markStudentSheets,
  markingOverview,
  setAnswerMark,
  studentReport,
} from '../../../../../../lib/schools/marking'

// AI marking of an own paper's answer sheets. GET: where every student stands and the class summary; with
// ?student_id= one student's answers, flags and report. POST { action: 'mark', student_id } marks one
// student (three AI passes, so it can take a minute); POST { action: 'set_mark', answer_mark_id, marks,
// reason } is a teacher changing a mark (logged).
export const Route = createFileRoute(
  '/api/schools/$schoolId/own-papers/$paperId/marking',
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
          const db = getSharedDb()
          const studentId = new URL(request.url).searchParams.get('student_id')
          return Response.json(
            studentId
              ? await studentReport(db, scope, params.paperId, studentId)
              : await markingOverview(db, scope, params.paperId),
            { headers: { 'cache-control': 'private, no-store' } },
          )
        } catch (e) {
          if (e instanceof SchoolError) return e.toResponse()
          throw e
        }
      },
      POST: async ({ request, params }) => {
        const scope = await requireSchoolRole(
          request,
          params.schoolId,
          'school_admin',
          'teacher',
        )
        if (scope instanceof Response) return scope
        const b = await readJson(request)
        const db = getSharedDb()
        try {
          if (str(b?.action) === 'set_mark')
            return Response.json(
              await setAnswerMark(
                db,
                scope,
                str(b?.answer_mark_id) ?? '',
                Number(b?.marks),
                str(b?.reason) ?? '',
              ),
            )
          if (str(b?.action) === 'mark')
            return Response.json(
              await markStudentSheets(
                db,
                scope,
                params.paperId,
                str(b?.student_id) ?? '',
              ),
            )
          return new Response(null, { status: 400 })
        } catch (e) {
          if (e instanceof SchoolError) return e.toResponse()
          throw e
        }
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/schools/$schoolId/own-papers/$paperId/marking', [
  'GET',
  'POST',
])
