import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../../db/connection'
import { requireSchoolRole } from '../../../../../lib/school-session'
import { SchoolError } from '../../../../../lib/schools/common'
import { addPersonManually } from '../../../../../lib/schools/roster-manual'
import { wrapRouteHandlers } from '../../../../../lib/error-log'

// Add one student or teacher by hand: { kind, academic_year?, fields }. Same checks as the file upload.
export const Route = createFileRoute('/api/schools/$schoolId/imports/manual')({
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        const scope = await requireSchoolRole(request, params.schoolId, 'school_admin')
        if (scope instanceof Response) return scope
        const body = (await request.json().catch(() => null)) as {
          kind?: string
          academic_year?: string
          fields?: Record<string, unknown>
        } | null
        if (!body || (body.kind !== 'students' && body.kind !== 'teachers') || typeof body.fields !== 'object' || body.fields === null) {
          return Response.json({ error: 'invalid', message: 'Send kind and fields.' }, { status: 400 })
        }
        const fields: Record<string, string> = {}
        for (const [k, v] of Object.entries(body.fields)) if (typeof v === 'string' && v.length <= 300) fields[k] = v
        try {
          return Response.json(
            await addPersonManually(getSharedDb(), scope, {
              kind: body.kind,
              academicYear: body.academic_year,
              fields,
            }),
          )
        } catch (e) {
          if (e instanceof SchoolError) return e.toResponse()
          throw e
        }
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/schools/$schoolId/imports/manual', ['POST'])
