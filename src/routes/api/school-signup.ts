import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../db/connection'
import { wrapRouteHandlers } from '../../lib/error-log'
import { readJson, str } from '../../lib/schools/http'
import { signUpSchoolWithEmail } from '../../lib/schools/signup'

// A school starts itself with an e-mail and a password (public by design, owner decision
// 2026-10-29). Answers { schoolId } and signs the new office admin in. Refusals are plain sentences.
export const Route = createFileRoute('/api/school-signup')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const b = await readJson(request)
        const result = await signUpSchoolWithEmail(getSharedDb(), {
          schoolName: str(b?.school_name) ?? '',
          city: str(b?.city) ?? '',
          yourName: str(b?.your_name) ?? '',
          email: str(b?.email) ?? '',
          password: typeof b?.password === 'string' ? b.password : '',
          website: typeof b?.website === 'string' ? b.website : '',
        })
        if (!result.ok)
          return Response.json(
            { error: 'signup_refused', message: result.message },
            { status: result.status, headers: { 'cache-control': 'no-store' } },
          )
        const headers = new Headers({
          'content-type': 'application/json',
          'cache-control': 'no-store',
        })
        for (const c of result.setCookies) headers.append('set-cookie', c)
        return new Response(JSON.stringify({ schoolId: result.schoolId }), {
          status: 200,
          headers,
        })
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/school-signup', ['POST'])
