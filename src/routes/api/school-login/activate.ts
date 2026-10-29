import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../db/connection'
import { wrapRouteHandlers } from '../../../lib/error-log'
import { activateStudent } from '../../../lib/schools/credentials'
import { readJson, signInResponse, str } from '../../../lib/schools/http'

// A student's first sign-in: school code + login id + the one-time code from her slip + a new password.
export const Route = createFileRoute('/api/school-login/activate')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const b = await readJson(request)
        const schoolCode = str(b?.school_code)
        const loginId = str(b?.login_id)
        const code = str(b?.code)
        const newPassword = str(b?.new_password)
        if (!schoolCode || !loginId || !code || !newPassword) {
          return Response.json(
            { error: 'invalid', message: 'Fill in every box.' },
            { status: 400 },
          )
        }
        return signInResponse(
          await activateStudent(getSharedDb(), {
            schoolCode,
            loginId,
            code,
            newPassword,
          }),
        )
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/school-login/activate', ['POST'])
