import { createFileRoute } from '@tanstack/react-router'
import { requireRole } from '../../../../lib/session'
import { resolveEnabledStudent } from '../../../../lib/access'
import { getSharedDb } from '../../../../db/connection'
import { getWeeklyCardData } from '../../../../lib/weekly-card'
import { wrapRouteHandlers } from '../../../../lib/error-log'

/**
 * GET /api/students/me/weekly-card -- the signed-in student's own numbers for the weekly picture
 * card she may send a parent. Resolves to her own profile only, so there is no id to substitute.
 */
export const Route = createFileRoute('/api/students/me/weekly-card')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const auth = await requireRole(request, 'student')
        if (auth instanceof Response) return auth
        const db = getSharedDb()
        const student = await resolveEnabledStudent(db, auth.id)
        if (student instanceof Response) return student
        return Response.json(await getWeeklyCardData(db, student.id, new Date()), { headers: { 'cache-control': 'no-store' } })
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/students/me/weekly-card', ['GET'])
