import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../../../db/connection'
import { wrapRouteHandlers } from '../../../../../../lib/error-log'
import { requireSchoolRole } from '../../../../../../lib/school-session'
import { SchoolError } from '../../../../../../lib/schools/common'
import { readJson } from '../../../../../../lib/schools/http'
import { setParentPermission } from '../../../../../../lib/schools/messaging/permissions'

// POST { whatsappOk?: boolean, language?: 'en' | 'te', reenableAfterStop?: boolean }: the office records what the
// parent agreed to. It is written with who confirmed it and when. Switching a parent back on after STOP needs
// reenableAfterStop: true (the office confirms the parent asked to be messaged again).
export const Route = createFileRoute('/api/schools/$schoolId/messaging/permissions/$studentId')({
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        const scope = await requireSchoolRole(request, params.schoolId, 'school_admin')
        if (scope instanceof Response) return scope
        const b = await readJson(request)
        try {
          if (b?.language !== undefined && b.language !== 'en' && b.language !== 'te')
            throw new SchoolError('invalid', 'Language must be English or Telugu.')
          if (b?.whatsappOk !== undefined && typeof b.whatsappOk !== 'boolean')
            throw new SchoolError('invalid', 'WhatsApp OK must be yes or no.')
          const result = await setParentPermission(
            getSharedDb(),
            scope,
            params.studentId,
            {
              whatsappOk: b?.whatsappOk,
              language: b?.language,
              reenableAfterStop: b?.reenableAfterStop === true,
            },
            'admin',
          )
          return Response.json({ result })
        } catch (e) {
          if (e instanceof SchoolError) return e.toResponse()
          throw e
        }
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/schools/$schoolId/messaging/permissions/$studentId', ['POST'])
