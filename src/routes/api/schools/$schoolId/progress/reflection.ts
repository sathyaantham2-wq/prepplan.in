import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../../db/connection'
import { wrapRouteHandlers } from '../../../../../lib/error-log'
import { requireSchoolRole } from '../../../../../lib/school-session'
import { SchoolError } from '../../../../../lib/schools/common'
import { readJson, str } from '../../../../../lib/schools/http'
import { getReflection, saveReflection } from '../../../../../lib/schools/reflection'

// The optional three-question reflection after an exam. GET ?paper=; POST { paper_id, hardest, next_time, note,
// feeling } (the student only).
export const Route = createFileRoute('/api/schools/$schoolId/progress/reflection')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const scope = await requireSchoolRole(request, params.schoolId, 'student', 'parent')
        if (scope instanceof Response) return scope
        try {
          const q = new URL(request.url).searchParams
          return Response.json({ reflection: await getReflection(getSharedDb(), scope, q.get('paper') ?? '', q.get('child')) }, { headers: { 'cache-control': 'private, no-store' } })
        } catch (e) {
          if (e instanceof SchoolError) return e.toResponse()
          throw e
        }
      },
      POST: async ({ request, params }) => {
        const scope = await requireSchoolRole(request, params.schoolId, 'student')
        if (scope instanceof Response) return scope
        const b = await readJson(request)
        try {
          await saveReflection(getSharedDb(), scope, str(b?.paper_id) ?? '', {
            hardest: str(b?.hardest) ?? null,
            nextTime: str(b?.next_time) ?? null,
            note: str(b?.note) ?? null,
            feeling: typeof b?.feeling === 'number' ? b.feeling : null,
          })
          return Response.json({ ok: true })
        } catch (e) {
          if (e instanceof SchoolError) return e.toResponse()
          throw e
        }
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/schools/$schoolId/progress/reflection', ['GET', 'POST'])
