import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../db/connection'
import { wrapRouteHandlers } from '../../../../lib/error-log'
import { requireSchoolRole } from '../../../../lib/school-session'
import { SchoolError } from '../../../../lib/schools/common'
import { readJson } from '../../../../lib/schools/http'
import { maskSettings, saveMaskSettings } from '../../../../lib/schools/mask-settings'

// The part of an answer sheet that is painted white before a page goes to the marking AI.
export const Route = createFileRoute('/api/schools/$schoolId/mask')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const scope = await requireSchoolRole(request, params.schoolId, 'school_admin', 'principal')
        if (scope instanceof Response) return scope
        try {
          return Response.json(await maskSettings(getSharedDb(), scope), { headers: { 'cache-control': 'private, no-store' } })
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
          await saveMaskSettings(getSharedDb(), scope, b?.reset === true ? null : b?.template)
          return Response.json({ ok: true })
        } catch (e) {
          if (e instanceof SchoolError) return e.toResponse()
          throw e
        }
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/schools/$schoolId/mask', ['GET', 'POST'])
