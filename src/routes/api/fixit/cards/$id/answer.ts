import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { requireRole } from '../../../../../lib/session'
import { resolveEnabledStudent } from '../../../../../lib/access'
import { getSharedDb } from '../../../../../db/connection'
import { answerFixitCard } from '../../../../../lib/fixit'
import { wrapRouteHandlers } from '../../../../../lib/error-log'

const bodySchema = z.object({
  question_id: z.string().uuid(),
  answer: z.string().min(1).max(500),
})

/**
 * POST /api/fixit/cards/:id/answer -- marks her answer to the question the deck served for her own
 * card. Another student's card, or a question that was not the one served, is a 404/400 that
 * reveals nothing. The reply carries the right answer only now that hers has been checked.
 */
export const Route = createFileRoute('/api/fixit/cards/$id/answer')({
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        const auth = await requireRole(request, 'student')
        if (auth instanceof Response) return auth
        const db = getSharedDb()
        const student = await resolveEnabledStudent(db, auth.id)
        if (student instanceof Response) return student

        let json: unknown
        try {
          json = await request.json()
        } catch {
          return Response.json({ error: 'Send a JSON body' }, { status: 400 })
        }
        const parsed = bodySchema.safeParse(json)
        if (!parsed.success) return Response.json({ error: 'Check the question and your answer' }, { status: 400 })
        if (!z.string().uuid().safeParse(params.id).success) return new Response(null, { status: 404 })

        const result = await answerFixitCard(db, student.id, params.id, parsed.data.question_id, parsed.data.answer)
        if ('error' in result) {
          if (result.error === 'not_found') return new Response(null, { status: 404 })
          return Response.json({ error: 'That card is not ready for an answer' }, { status: 400 })
        }
        return Response.json(result, { headers: { 'cache-control': 'no-store' } })
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/fixit/cards/$id/answer', ['POST'])
