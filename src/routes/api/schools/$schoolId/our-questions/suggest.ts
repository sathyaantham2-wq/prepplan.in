import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../../db/connection'
import { wrapRouteHandlers } from '../../../../../lib/error-log'
import { requireSchoolRole } from '../../../../../lib/school-session'
import { SchoolError } from '../../../../../lib/schools/common'
import { readJson } from '../../../../../lib/schools/http'
import { ownQuestionInputFrom, suggestTags } from '../../../../../lib/schools/school-questions'

// The AI's guess at the chapter, topic and level of a question being written. Only a suggestion: the teacher confirms.
export const Route = createFileRoute('/api/schools/$schoolId/our-questions/suggest')({
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        const scope = await requireSchoolRole(request, params.schoolId, 'school_admin', 'teacher')
        if (scope instanceof Response) return scope
        const input = ownQuestionInputFrom(await readJson(request))
        try {
          return Response.json(await suggestTags(getSharedDb(), scope, input))
        } catch (e) {
          if (e instanceof SchoolError) return e.toResponse()
          throw e
        }
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/schools/$schoolId/our-questions/suggest', ['POST'])
