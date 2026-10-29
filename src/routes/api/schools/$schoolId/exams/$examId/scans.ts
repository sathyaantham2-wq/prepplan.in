import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../../../db/connection'
import { wrapRouteHandlers } from '../../../../../../lib/error-log'
import { requireSchoolRole } from '../../../../../../lib/school-session'
import { SchoolError } from '../../../../../../lib/schools/common'
import { readJson, str } from '../../../../../../lib/schools/http'
import {
  MAX_SCAN_BYTES,
  ingestScanPage,
} from '../../../../../../lib/schools/scan-service'

export const Route = createFileRoute(
  '/api/schools/$schoolId/exams/$examId/scans',
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
        try {
          const b = await readJson(request)
          const data = typeof b?.data === 'string' ? b.data : ''
          // base64 is about a third bigger than the picture
          if (data.length > Math.ceil((MAX_SCAN_BYTES * 4) / 3) + 8)
            throw new SchoolError(
              'invalid',
              'That file is too big. Each photo must be under 12 MB.',
            )
          const bytes = Buffer.from(data, 'base64')
          const t =
            b?.target && typeof b.target === 'object'
              ? (b.target as Record<string, unknown>)
              : null
          return Response.json(
            await ingestScanPage(getSharedDb(), scope, params.examId, {
              bytes,
              name: str(b?.name),
              batchId: str(b?.batch_id),
              replace: b?.replace === true,
              target:
                t &&
                typeof t.school_student_id === 'string' &&
                typeof t.page_no === 'number'
                  ? { schoolStudentId: t.school_student_id, pageNo: t.page_no }
                  : null,
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

wrapRouteHandlers(Route, '/api/schools/$schoolId/exams/$examId/scans', ['POST'])
