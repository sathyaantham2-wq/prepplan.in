import { randomBytes, randomUUID } from 'node:crypto'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { auth } from '../../lib/auth'
import { getSharedDb } from '../../db/connection'
import { usersRepository } from '../../db/repositories'
import { wrapRouteHandlers } from '../../lib/error-log'

export const GUEST_EMAIL_DOMAIN = 'guest.prepplan.invalid'
// A flood guard, not a quota: at most this many guest accounts may be created in any hour, by
// anyone. Real families never get near it; a script hammering the button does.
export const MAX_GUESTS_PER_HOUR = 60

const bodySchema = z.object({
  // The same declaration the normal student sign-up asks for, recorded as her consent.
  guardian_ok: z.literal(true),
})

/**
 * POST /api/guest -- "Try as guest" (2026-10-04 request): a one-tap student account with no email
 * and no password to remember, so someone can look around before signing up. It is a normal
 * student account underneath (own household, profile setup next, same spend caps), signed in on
 * the spot; the only difference is its email, a reserved undeliverable address, and a random
 * password nobody sees. The session lasts as long as any other, so a guest's progress stays with
 * that browser. The "my parent or guardian agrees" declaration is required here too: it is the
 * consent record.
 */
export const Route = createFileRoute('/api/guest')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json().catch(() => null)
        const parsed = bodySchema.safeParse(body)
        if (!parsed.success) {
          return Response.json(
            { error: 'Please confirm that your parent or guardian agrees.' },
            { status: 400 },
          )
        }

        const db = getSharedDb()
        const recent = await usersRepository.countGuestsSince(
          db,
          new Date(Date.now() - 60 * 60 * 1000),
        )
        if (recent >= MAX_GUESTS_PER_HOUR) {
          return Response.json(
            { error: 'Guest login is busy right now. Please try again in a little while.' },
            { status: 429 },
          )
        }

        const email = `guest-${randomUUID()}@${GUEST_EMAIL_DOMAIN}`
        const password = randomBytes(24).toString('hex')
        // A server-side call (no request attached), so the HTTP sign-up gate in lib/auth.ts does
        // not apply; the user hook still gives her a household, a student profile and consent.
        await auth.api.signUpEmail({
          body: { email, password, name: 'Guest', signup_type: 'student' },
        })
        const signedIn = await auth.api.signInEmail({
          body: { email, password },
          asResponse: true,
        })
        if (!signedIn.ok) {
          return Response.json(
            { error: 'Could not start a guest session. Please try again.' },
            { status: 500 },
          )
        }
        // Forward every cookie separately: one header read would glue several together.
        const headers = new Headers({ 'content-type': 'application/json' })
        for (const cookie of signedIn.headers.getSetCookie()) {
          headers.append('set-cookie', cookie)
        }
        return new Response(JSON.stringify({ ok: true }), { status: 200, headers })
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/guest', ['POST'])
