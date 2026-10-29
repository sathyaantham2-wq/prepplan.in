import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../../../db/connection'
import { wrapRouteHandlers } from '../../../../../../lib/error-log'
import { requireSchoolRole } from '../../../../../../lib/school-session'
import { SchoolError } from '../../../../../../lib/schools/common'
import { renderCovers } from '../../../../../../lib/schools/own-sheets'
import { pdfResponse } from '../../../../../../lib/schools/pdf-response'

// The QR cover pages of one section, as a PDF to print: ?section_id=. The office and the teacher of the
// subject only; only for an approved paper.
export const Route = createFileRoute(
  '/api/schools/$schoolId/own-papers/$paperId/covers',
)({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const scope = await requireSchoolRole(
          request,
          params.schoolId,
          'school_admin',
          'teacher',
        )
        if (scope instanceof Response) return scope
        try {
          const sectionId =
            new URL(request.url).searchParams.get('section_id') ?? ''
          if (!/^[0-9a-f-]{36}$/i.test(sectionId))
            throw new SchoolError('invalid', 'Choose a section.')
          const { pdf, fileName } = await renderCovers(
            getSharedDb(),
            scope,
            params.paperId,
            sectionId,
          )
          return pdfResponse(pdf, fileName)
        } catch (e) {
          if (e instanceof SchoolError) return e.toResponse()
          throw e
        }
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/schools/$schoolId/own-papers/$paperId/covers', [
  'GET',
])
