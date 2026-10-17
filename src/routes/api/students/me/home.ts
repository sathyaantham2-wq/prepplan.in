import { createFileRoute } from '@tanstack/react-router'
import { requireRole } from '../../../../lib/session'
import { resolveEnabledStudent } from '../../../../lib/access'
import { getSharedDb } from '../../../../db/connection'
import { getStudentHome } from '../../../../db/repositories'
import { wrapRouteHandlers } from '../../../../lib/error-log'

/**
 * GET /api/students/me/home -- the signed-in student's own numbers for her home screen (week of
 * practice, points, a half-done paper, where her latest marks went). Resolves to her own profile
 * only, like /api/student-dashboard, so there is no id to substitute (T09).
 */
export const Route = createFileRoute('/api/students/me/home')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const auth = await requireRole(request, 'student')
        if (auth instanceof Response) return auth
        const db = getSharedDb()
        const student = await resolveEnabledStudent(db, auth.id)
        if (student instanceof Response) return student
        return Response.json(await getStudentHome(db, student.id), { headers: { 'cache-control': 'no-store' } })
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/students/me/home', ['GET'])
