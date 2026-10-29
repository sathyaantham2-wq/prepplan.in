import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../db/connection'
import { schoolLoginRepository } from '../../db/repositories'
import { wrapRouteHandlers } from '../../lib/error-log'
import { getCurrentUser } from '../../lib/session'
import { startState } from '../../lib/schools/signup'

// Who is signed in, and which schools they belong to. For the school screens only. It reads the
// session directly (not requireUser) because school logins are refused by the consumer guard.
export const Route = createFileRoute('/api/school-me')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const user = await getCurrentUser(request)
        if (!user) return new Response(null, { status: 401 })
        const db = getSharedDb()
        const row = await db
          .selectFrom('users')
          .select('name')
          .where('id', '=', user.id)
          .executeTakeFirstOrThrow()
        const memberships = await schoolLoginRepository.membershipsOf(
          db,
          user.id,
        )
        return Response.json(
          {
            name: row.name,
            // can_create: a school login with no school yet (a first Google sign-in);
            // personal_account: a PrepPlan student or parent login, which can never be a school login
            start: (await startState(db, user.id)).state,
            schools: memberships.map((m) => ({
              id: m.school_id,
              name: m.school_name,
              role: m.role,
            })),
          },
          { headers: { 'cache-control': 'no-store' } },
        )
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/school-me', ['GET'])
