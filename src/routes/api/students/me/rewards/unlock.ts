import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { requireRole } from '../../../../../lib/session'
import { resolveEnabledStudent } from '../../../../../lib/access'
import { getSharedDb } from '../../../../../db/connection'
import { unlockItem } from '../../../../../lib/rewards'
import { wrapRouteHandlers } from '../../../../../lib/error-log'

const bodySchema = z.object({ key: z.string().min(1).max(100) })

/**
 * POST /api/students/me/rewards/unlock { key } -- spend coins on a paper theme. One transaction
 * with a row lock (see unlockItem), so a double click or two tabs never overspend or charge
 * twice; unlocking something already owned is a no-charge success.
 */
export const Route = createFileRoute('/api/students/me/rewards/unlock')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const auth = await requireRole(request, 'student')
        if (auth instanceof Response) return auth
        const parsed = bodySchema.safeParse(await request.json().catch(() => null))
        if (!parsed.success) return Response.json({ error: 'key is required' }, { status: 400 })
        const db = getSharedDb()
        const student = await resolveEnabledStudent(db, auth.id)
        if (student instanceof Response) return student
        const result = await unlockItem(db, student.id, parsed.data.key)
        if (result.ok) {
          return Response.json({ unlocked: true, already_unlocked: result.already, coins: result.coins })
        }
        if (result.reason === 'unknown_key') return Response.json({ error: 'unknown item' }, { status: 400 })
        if (result.reason === 'default_theme') {
          return Response.json({ error: 'the default theme is always free and cannot be bought' }, { status: 400 })
        }
        return Response.json(
          { error: 'not enough coins', coins: result.coins, price: result.price, missing: result.missing },
          { status: 409 },
        )
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/students/me/rewards/unlock', ['POST'])
