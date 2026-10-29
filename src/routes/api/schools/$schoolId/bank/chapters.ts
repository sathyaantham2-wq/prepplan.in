import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../../db/connection'
import { wrapRouteHandlers } from '../../../../../lib/error-log'
import { requireSchoolRole } from '../../../../../lib/school-session'
import { SchoolError } from '../../../../../lib/schools/common'
import { listChapters } from '../../../../../lib/schools/template-service'

// Chapters of one subject, each named by book, part and chapter number, with how many concepts and
// approved questions the bank holds for it. ?subject_id=
export const Route = createFileRoute('/api/schools/$schoolId/bank/chapters')({
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
        const subjectId = new URL(request.url).searchParams.get('subject_id')
        if (!subjectId || !/^[0-9a-f-]{36}$/i.test(subjectId))
          return Response.json(
            { error: 'invalid', message: 'Choose a subject.' },
            { status: 400 },
          )
        try {
          return Response.json(
            { chapters: await listChapters(getSharedDb(), scope, subjectId) },
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

wrapRouteHandlers(Route, '/api/schools/$schoolId/bank/chapters', ['GET'])
