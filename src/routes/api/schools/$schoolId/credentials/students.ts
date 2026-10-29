import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../../db/connection'
import { wrapRouteHandlers } from '../../../../../lib/error-log'
import { env } from '../../../../../lib/env'
import { renderHtmlToPdf } from '../../../../../lib/pdf/render'
import { requireSchoolRole } from '../../../../../lib/school-session'
import { SchoolError } from '../../../../../lib/schools/common'
import { issueStudentSlips } from '../../../../../lib/schools/credentials'
import { readJson, str } from '../../../../../lib/schools/http'
import { buildSlipsHtml } from '../../../../../lib/schools/slips'

// Class teacher (or admin): one-time code slips for a section. { section_id, include_activated?, format?: 'json'|'pdf' }.
// Issuing replaces any earlier unused codes for those students. Students who already chose a
// password are skipped unless include_activated is true.
export const Route = createFileRoute(
  '/api/schools/$schoolId/credentials/students',
)({
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        const scope = await requireSchoolRole(
          request,
          params.schoolId,
          'school_admin',
          'teacher',
        )
        if (scope instanceof Response) return scope
        const b = await readJson(request)
        const sectionId = str(b?.section_id)
        if (!sectionId)
          return Response.json(
            { error: 'invalid', message: 'Send section_id.' },
            { status: 400 },
          )
        try {
          const db = getSharedDb()
          const slips = await issueStudentSlips(db, scope, sectionId, {
            includeActivated: b?.include_activated === true,
          })
          if (b?.format !== 'pdf')
            return Response.json(
              { slips },
              { headers: { 'cache-control': 'no-store' } },
            )
          const school = await db
            .selectFrom('schools')
            .select(['name', 'code'])
            .where('id', '=', scope.schoolId)
            .executeTakeFirstOrThrow()
          const sec = await db
            .selectFrom('school_sections as s')
            .innerJoin('school_classes as c', 'c.id', 's.class_id')
            .select(['s.name', 'c.grade'])
            .where('s.id', '=', sectionId)
            .where('s.school_id', '=', scope.schoolId)
            .executeTakeFirstOrThrow()
          const pdf = await renderHtmlToPdf(
            buildSlipsHtml({
              schoolName: school.name,
              schoolCode: school.code,
              sectionLabel: `Class ${sec.grade}-${sec.name}`,
              signInUrl: `${env.BETTER_AUTH_URL}/school/sign-in`,
              slips,
            }),
          )
          return new Response(new Uint8Array(pdf), {
            headers: {
              'content-type': 'application/pdf',
              'cache-control': 'no-store',
              'content-disposition': 'inline; filename="sign-in-slips.pdf"',
            },
          })
        } catch (e) {
          if (e instanceof SchoolError) return e.toResponse()
          throw e
        }
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/schools/$schoolId/credentials/students', [
  'POST',
])
