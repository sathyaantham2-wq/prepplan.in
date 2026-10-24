import { createFileRoute } from '@tanstack/react-router'
import { requireRole } from '../../../../lib/session'
import { resolveEnabledStudent } from '../../../../lib/access'
import { getSharedDb } from '../../../../db/connection'
import { getRewards } from '../../../../lib/rewards'
import { wrapRouteHandlers } from '../../../../lib/error-log'

/**
 * GET /api/students/me/rewards -- her spendable coins and the paper themes she can unlock. Own
 * data only: resolves to her own profile, there is no id to substitute (T09).
 */
export const Route = createFileRoute('/api/students/me/rewards')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const auth = await requireRole(request, 'student')
        if (auth instanceof Response) return auth
        const db = getSharedDb()
        const student = await resolveEnabledStudent(db, auth.id)
        if (student instanceof Response) return student
        return Response.json(await getRewards(db, student.id), { headers: { 'cache-control': 'no-store' } })
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/students/me/rewards', ['GET'])
