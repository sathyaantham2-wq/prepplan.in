import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../db/connection'
import { wrapRouteHandlers } from '../../../../lib/error-log'
import { requireSchoolRole } from '../../../../lib/school-session'
import { SchoolError } from '../../../../lib/schools/common'
import { readJson } from '../../../../lib/schools/http'
import { listOwnQuestions, ownQuestionInputFrom, saveOwnQuestion } from '../../../../lib/schools/school-questions'

// The school's own questions (docs/SCHOOLS_MODULE_PLAN.md section 16.13). GET ?subject=&chapter=&q=&retired=1: the list,
// with the form's choices; POST: write a new question. Staff only; the principal may look. Never a student.
export const Route = createFileRoute('/api/schools/$schoolId/our-questions')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const scope = await requireSchoolRole(request, params.schoolId, 'school_admin', 'teacher', 'principal')
        if (scope instanceof Response) return scope
        try {
          const q = new URL(request.url).searchParams
          const body = await listOwnQuestions(getSharedDb(), scope, {
            schoolSubjectId: q.get('subject'),
            chapterId: q.get('chapter'),
            q: q.get('q'),
            retired: q.get('retired') === '1',
          })
          return Response.json(body, { headers: { 'cache-control': 'private, no-store' } })
        } catch (e) {
          if (e instanceof SchoolError) return e.toResponse()
          throw e
        }
      },
      POST: async ({ request, params }) => {
        const scope = await requireSchoolRole(request, params.schoolId, 'school_admin', 'teacher', 'principal')
        if (scope instanceof Response) return scope
        const b = await readJson(request)
        try {
          return Response.json(await saveOwnQuestion(getSharedDb(), scope, ownQuestionInputFrom(b)))
        } catch (e) {
          if (e instanceof SchoolError) return e.toResponse()
          throw e
        }
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/schools/$schoolId/our-questions', ['GET', 'POST'])
