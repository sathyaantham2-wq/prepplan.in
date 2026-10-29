import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../../db/connection'
import { wrapRouteHandlers } from '../../../../../lib/error-log'
import { requireSchoolRole } from '../../../../../lib/school-session'
import { SchoolError } from '../../../../../lib/schools/common'
import { readJson, str } from '../../../../../lib/schools/http'
import { parseDefinition } from '../../../../../lib/schools/template-input'
import { previewCoverage } from '../../../../../lib/schools/template-service'

// Coverage preview: { subject_id, chapter_ids, key | definition }. Reads only; changes nothing.
export const Route = createFileRoute(
  '/api/schools/$schoolId/templates/preview',
)({
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        const scope = await requireSchoolRole(
          request,
          params.schoolId,
          'school_admin',
          'teacher',
          'principal',
        )
        if (scope instanceof Response) return scope
        const b = await readJson(request)
        const subjectId = str(b?.subject_id)
        const chapterIds = Array.isArray(b?.chapter_ids)
          ? b.chapter_ids.filter((x): x is string => typeof x === 'string')
          : []
        if (!subjectId)
          return Response.json(
            { error: 'invalid', message: 'Choose a subject.' },
            { status: 400 },
          )
        try {
          const result = await previewCoverage(getSharedDb(), scope, {
            subjectId,
            chapterIds,
            templateKey: str(b?.key) ?? undefined,
            definition: b?.definition
              ? (parseDefinition(b.definition) ?? undefined)
              : undefined,
          })
          return Response.json(result, {
            headers: { 'cache-control': 'no-store' },
          })
        } catch (e) {
          if (e instanceof SchoolError) return e.toResponse()
          throw e
        }
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/schools/$schoolId/templates/preview', ['POST'])
