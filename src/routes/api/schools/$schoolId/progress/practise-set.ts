import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../../db/connection'
import { wrapRouteHandlers } from '../../../../../lib/error-log'
import { requireSchoolRole } from '../../../../../lib/school-session'
import { SchoolError } from '../../../../../lib/schools/common'
import { readJson, str } from '../../../../../lib/schools/http'
import { practiceCheck, practiceHint, practiceSet } from '../../../../../lib/schools/practice'

// "Practise this", the interactive way: GET ?topic= gives up to three rounds of questions WITHOUT answers;
// POST { action: 'hint' | 'check', topic, question_id, chosen? } gives the one hint, or the answer and the
// steps once she has had her turn. Nothing is stored (no attempt, no mark, no mastery).
export const Route = createFileRoute('/api/schools/$schoolId/progress/practise-set')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const scope = await requireSchoolRole(request, params.schoolId, 'student')
        if (scope instanceof Response) return scope
        try {
          const q = new URL(request.url).searchParams
          return Response.json(await practiceSet(getSharedDb(), scope, q.get('topic') ?? '', q.get('child')), {
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
          const topic = str(b?.topic) ?? ''
          const qid = str(b?.question_id) ?? ''
          if (str(b?.action) === 'hint')
            return Response.json(await practiceHint(db, scope, topic, qid, str(b?.child) ?? null), {
              headers: { 'cache-control': 'private, no-store' },
            })
          if (str(b?.action) === 'check')
            return Response.json(await practiceCheck(db, scope, topic, qid, str(b?.chosen) ?? null, str(b?.child) ?? null), {
              headers: { 'cache-control': 'private, no-store' },
            })
          return new Response(null, { status: 400 })
        } catch (e) {
          if (e instanceof SchoolError) return e.toResponse()
          throw e
        }
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/schools/$schoolId/progress/practise-set', ['GET', 'POST'])
