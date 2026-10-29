import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../db/connection'
import { wrapRouteHandlers } from '../../../lib/error-log'
import {
  activateStaffWithCode,
  activateStaffWithToken,
} from '../../../lib/schools/credentials'
import { readJson, signInResponse, str } from '../../../lib/schools/http'

// Staff set their password: from the e-mailed link ({ token, new_password }) or with a printed
// code ({ email, code, new_password }). Public by design (no session yet).
export const Route = createFileRoute('/api/school-login/activate-staff')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const b = await readJson(request)
        const newPassword = str(b?.new_password)
        const token = str(b?.token)
        const email = str(b?.email)
        const code = str(b?.code)
        if (!newPassword || (!token && !(email && code))) {
          return Response.json(
            {
              error: 'invalid',
              message:
                'Send the link token, or your e-mail and code, and a new password.',
            },
            { status: 400 },
          )
        }
        const db = getSharedDb()
        return signInResponse(
          token
            ? await activateStaffWithToken(db, { token, newPassword })
            : await activateStaffWithCode(db, {
                email: email!,
                code: code!,
                newPassword,
              }),
        )
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/school-login/activate-staff', ['POST'])
