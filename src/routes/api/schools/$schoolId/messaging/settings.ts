import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../../db/connection'
import { wrapRouteHandlers } from '../../../../../lib/error-log'
import { requireSchoolRole } from '../../../../../lib/school-session'
import { SchoolError } from '../../../../../lib/schools/common'
import { readJson } from '../../../../../lib/schools/http'
import { messagingSettings, saveMessagingSettings } from '../../../../../lib/schools/messaging/log'

// The messaging settings the principal (or the office) chooses: a weekly limit of parent messages per child (empty =
// no limit) and how long the message log is kept. Whether messaging is switched on for the school is not here: the
// PrepPlan owner turns it on.
export const Route = createFileRoute('/api/schools/$schoolId/messaging/settings')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const scope = await requireSchoolRole(request, params.schoolId, 'school_admin', 'principal')
        if (scope instanceof Response) return scope
        try {
          return Response.json(await messagingSettings(getSharedDb(), scope), { headers: { 'cache-control': 'private, no-store' } })
        } catch (e) {
          if (e instanceof SchoolError) return e.toResponse()
          throw e
        }
      },
      POST: async ({ request, params }) => {
        const scope = await requireSchoolRole(request, params.schoolId, 'school_admin', 'principal')
        if (scope instanceof Response) return scope
        const b = await readJson(request)
        try {
          const w = b?.weeklyLimit
          await saveMessagingSettings(getSharedDb(), scope, {
            weeklyLimit: w === null || w === undefined || w === '' ? null : Number(w),
            logDays: Number(b?.logDays),
          })
          return Response.json({ ok: true })
        } catch (e) {
          if (e instanceof SchoolError) return e.toResponse()
          throw e
        }
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/schools/$schoolId/messaging/settings', ['GET', 'POST'])
