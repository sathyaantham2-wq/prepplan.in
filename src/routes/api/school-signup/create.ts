import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../db/connection'
import { wrapRouteHandlers } from '../../../lib/error-log'
import { getCurrentUser } from '../../../lib/session'
import { SchoolError } from '../../../lib/schools/common'
import { readJson, str } from '../../../lib/schools/http'
import { createSchoolForSignedInUser } from '../../../lib/schools/signup'

// After "Continue with Google" from a school page: the signed-in person names her school. Only a
// school-type login with no school yet may do this; a student or parent login is refused. Reads the
// session directly, because school logins are refused by the consumer guard.
export const Route = createFileRoute('/api/school-signup/create')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const user = await getCurrentUser(request)
        if (!user) return new Response(null, { status: 401 })
        const b = await readJson(request)
        try {
          return Response.json(
            await createSchoolForSignedInUser(getSharedDb(), user.id, {
              schoolName: str(b?.school_name) ?? '',
              city: str(b?.city) ?? '',
            }),
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

wrapRouteHandlers(Route, '/api/school-signup/create', ['POST'])
