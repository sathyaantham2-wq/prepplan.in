import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../../db/connection'
import { wrapRouteHandlers } from '../../../../../lib/error-log'
import { requireSchoolRole } from '../../../../../lib/school-session'
import { SchoolError } from '../../../../../lib/schools/common'
import { readJson, str } from '../../../../../lib/schools/http'
import {
  askTeacher,
  flagAnswer,
  myResult,
} from '../../../../../lib/schools/results-release'

// One released paper, for the student it belongs to: her marks, the correct answers, her report and her
// flags. POST { action: 'flag', answer_mark_id, reason } flags an answer (the AI reads it again once);
// POST { action: 'ask_teacher', dispute_id } sends a flag the AI kept to her teacher.
export const Route = createFileRoute(
  '/api/schools/$schoolId/my-results/$paperId',
)({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const scope = await requireSchoolRole(request, params.schoolId, 'student')
        if (scope instanceof Response) return scope
        try {
          return Response.json(await myResult(getSharedDb(), scope, params.paperId), {
            headers: { 'cache-control': 'private, no-store' },
          })
        } catch (e) {
          if (e instanceof SchoolError) return e.toResponse()
          throw e
        }
      },
      POST: async ({ request, params }) => {
        const scope = await requireSchoolRole(request, params.schoolId, 'student')
        if (scope instanceof Response) return scope
        const b = await readJson(request)
        const db = getSharedDb()
        try {
          if (str(b?.action) === 'flag')
            return Response.json(
              await flagAnswer(
                db,
                scope,
                str(b?.answer_mark_id) ?? '',
                str(b?.reason) ?? '',
              ),
            )
          if (str(b?.action) === 'ask_teacher') {
            await askTeacher(db, scope, str(b?.dispute_id) ?? '')
            return Response.json({ ok: true })
          }
          return new Response(null, { status: 400 })
        } catch (e) {
          if (e instanceof SchoolError) return e.toResponse()
          throw e
        }
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/schools/$schoolId/my-results/$paperId', [
  'GET',
  'POST',
])
