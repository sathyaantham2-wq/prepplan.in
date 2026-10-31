import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../../db/connection'
import { wrapRouteHandlers } from '../../../../../lib/error-log'
import { requireSchoolRole } from '../../../../../lib/school-session'
import { SchoolError } from '../../../../../lib/schools/common'
import { practisePdf } from '../../../../../lib/schools/progress-share'

// "Practise this": a printable worksheet of bank questions for one topic the student has met (?topic=c:<id> or
// h:<id>). Nothing is recorded: no attempt, no marking, no mastery.
export const Route = createFileRoute('/api/schools/$schoolId/progress/practise')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const scope = await requireSchoolRole(request, params.schoolId, 'student', 'parent')
        if (scope instanceof Response) return scope
        try {
          const q = new URL(request.url).searchParams
          const pdf = await practisePdf(getSharedDb(), scope, q.get('topic') ?? '', q.get('lang') === 'te' ? 'te' : 'en', q.get('child'))
          return new Response(new Uint8Array(pdf), {
            headers: {
              'content-type': 'application/pdf',
              'content-disposition': 'inline; filename="practice.pdf"',
              'cache-control': 'private, no-store',
            },
          })
        } catch (e) {
          if (e instanceof SchoolError) return e.toResponse()
          throw e
        }
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/schools/$schoolId/progress/practise', ['GET'])
