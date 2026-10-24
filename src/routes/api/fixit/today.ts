import { createFileRoute } from '@tanstack/react-router'
import { requireRole } from '../../../lib/session'
import { resolveEnabledStudent } from '../../../lib/access'
import { getSharedDb } from '../../../db/connection'
import { getFixitToday } from '../../../lib/fixit'
import { wrapRouteHandlers } from '../../../lib/error-log'

/**
 * GET /api/fixit/today -- up to 3 of the signed-in student's Fix-it cards that are due, each with
 * one question and NO answer key (T09). Resolves to her own profile only, so there is no id to swap.
 */
export const Route = createFileRoute('/api/fixit/today')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const auth = await requireRole(request, 'student')
        if (auth instanceof Response) return auth
        const db = getSharedDb()
        const student = await resolveEnabledStudent(db, auth.id)
        if (student instanceof Response) return student
        return Response.json(await getFixitToday(db, student.id), { headers: { 'cache-control': 'no-store' } })
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/fixit/today', ['GET'])
