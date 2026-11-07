import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../../db/connection'
import { wrapRouteHandlers } from '../../../../../lib/error-log'
import { requireSchoolRole } from '../../../../../lib/school-session'
import { SchoolError } from '../../../../../lib/schools/common'
import { readJson } from '../../../../../lib/schools/http'
import { ownQuestionInputFrom, retireOwnQuestion, saveOwnQuestion } from '../../../../../lib/schools/school-questions'

// One of the school's own questions. POST { action: 'retire' }: out of the picker (nothing deleted). POST with the
// question: change it (a question already on a paper becomes a new question; the printed one stays as it was).
export const Route = createFileRoute('/api/schools/$schoolId/our-questions/$questionId')({
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        const scope = await requireSchoolRole(request, params.schoolId, 'school_admin', 'teacher', 'principal')
        if (scope instanceof Response) return scope
        const b = await readJson(request)
        try {
          const db = getSharedDb()
          if (b?.action === 'retire') return Response.json(await retireOwnQuestion(db, scope, params.questionId))
          return Response.json(await saveOwnQuestion(db, scope, ownQuestionInputFrom(b), params.questionId))
        } catch (e) {
          if (e instanceof SchoolError) return e.toResponse()
          throw e
        }
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/schools/$schoolId/our-questions/$questionId', ['POST'])
