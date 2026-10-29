import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../db/connection'
import { requireSchoolRole } from '../../../../lib/school-session'
import { SchoolError } from '../../../../lib/schools/common'
import { dryRunRosterImport } from '../../../../lib/schools/roster'
import { MAX_ROSTER_BYTES } from '../../../../lib/schools/roster-parse'
import { wrapRouteHandlers } from '../../../../lib/error-log'

// Roster upload, step 1 (dry run): validates and previews, adds nobody. JSON body so the file
// travels as base64: { kind: 'students'|'teachers', academic_year?, file_name, content_base64 }.
export const Route = createFileRoute('/api/schools/$schoolId/imports')({
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        const scope = await requireSchoolRole(
          request,
          params.schoolId,
          'school_admin',
        )
        if (scope instanceof Response) return scope
        const body = (await request.json().catch(() => null)) as {
          kind?: string
          academic_year?: string
          file_name?: string
          content_base64?: string
        } | null
        if (
          !body ||
          (body.kind !== 'students' && body.kind !== 'teachers') ||
          typeof body.file_name !== 'string' ||
          typeof body.content_base64 !== 'string' ||
          body.content_base64.length > Math.ceil((MAX_ROSTER_BYTES * 4) / 3) + 8
        ) {
          return Response.json(
            {
              error: 'invalid',
              message: 'Send kind, file_name and content_base64 (up to 5 MB).',
            },
            { status: 400 },
          )
        }
        try {
          const result = await dryRunRosterImport(getSharedDb(), scope, {
            kind: body.kind,
            academicYear: body.academic_year,
            fileName: body.file_name,
            bytes: Buffer.from(body.content_base64, 'base64'),
          })
          return Response.json(result)
        } catch (e) {
          if (e instanceof SchoolError) return e.toResponse()
          throw e
        }
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/schools/$schoolId/imports', ['POST'])
