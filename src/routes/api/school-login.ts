import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../db/connection'
import { wrapRouteHandlers } from '../../lib/error-log'
import { signInStudent } from '../../lib/schools/credentials'
import { readJson, signInResponse, str } from '../../lib/schools/http'

// A school student signs in with school code + login id (e.g. 7A-12) + password. Public by design
// (no session yet); five wrong tries lock the account for 15 minutes.
export const Route = createFileRoute('/api/school-login')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const b = await readJson(request)
        const schoolCode = str(b?.school_code)
        const loginId = str(b?.login_id)
        const password = str(b?.password)
        if (!schoolCode || !loginId || !password) {
          return Response.json(
            {
              error: 'invalid',
              message: 'Enter your school code, ID and password.',
            },
            { status: 400 },
          )
        }
        return signInResponse(
          await signInStudent(getSharedDb(), { schoolCode, loginId, password }),
        )
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/school-login', ['POST'])
