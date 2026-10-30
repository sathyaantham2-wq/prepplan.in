import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../../../db/connection'
import { wrapRouteHandlers } from '../../../../../../lib/error-log'
import { requireSchoolRole } from '../../../../../../lib/school-session'
import { SchoolError } from '../../../../../../lib/schools/common'
import { readJson, str } from '../../../../../../lib/schools/http'
import {
  assignOwnSheet,
  confirmOwnSheet,
  coverSections,
  ingestOwnSheet,
  ownSheetsSummary,
  removeOwnSheet,
  studentSheets,
  takeOwnSheetUpload,
} from '../../../../../../lib/schools/own-sheets'

// The scanned answer sheets of an own paper. GET: who has sent what, the sections to print covers for, the
// pages waiting for a student; with ?student_id= one student's pages. POST { action: 'add' | 'assign' |
// 'confirm' | 'remove' }: one page (its file arrives in pieces sent to .../sheet-chunks/:uploadId first), a teacher
// saying whose a waiting page is, or a teacher taking a wrong page out (kept, never deleted).
export const Route = createFileRoute(
  '/api/schools/$schoolId/own-papers/$paperId/sheets',
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
          const db = getSharedDb()
          const studentId = new URL(request.url).searchParams.get('student_id')
          if (studentId)
            return Response.json(
              await studentSheets(db, scope, params.paperId, studentId),
              { headers: { 'cache-control': 'private, no-store' } },
            )
          return Response.json(
            {
              sections: await coverSections(db, scope, params.paperId),
              ...(await ownSheetsSummary(db, scope, params.paperId)),
            },
            { headers: { 'cache-control': 'private, no-store' } },
          )
        } catch (e) {
          if (e instanceof SchoolError) return e.toResponse()
          throw e
        }
      },
      POST: async ({ request, params }) => {
        const scope = await requireSchoolRole(
          request,
          params.schoolId,
          'school_admin',
          'teacher',
        )
        if (scope instanceof Response) return scope
        const b = await readJson(request)
        const db = getSharedDb()
        try {
          if (str(b?.action) === 'assign') {
            await assignOwnSheet(
              db,
              scope,
              params.paperId,
              str(b?.sheet_id) ?? '',
              str(b?.student_id) ?? '',
            )
            return Response.json({ ok: true })
          }
          if (str(b?.action) === 'confirm') {
            await confirmOwnSheet(
              db,
              scope,
              params.paperId,
              str(b?.sheet_id) ?? '',
              str(b?.decision) ?? '',
              str(b?.student_id),
            )
            return Response.json({ ok: true })
          }
          if (str(b?.action) === 'remove') {
            await removeOwnSheet(
              db,
              scope,
              params.paperId,
              str(b?.sheet_id) ?? '',
            )
            return Response.json({ ok: true })
          }
          if (str(b?.action) !== 'add')
            return Response.json(
              {
                error: 'invalid',
                message:
                  'Something is missing. Check your answer and try again.',
              },
              { status: 400 },
            )
          const bytes = await takeOwnSheetUpload(
            db,
            scope,
            params.paperId,
            str(b?.upload_id) ?? '',
            typeof b?.chunks === 'number' ? b.chunks : 0,
          )
          return Response.json(
            await ingestOwnSheet(db, scope, params.paperId, {
              bytes,
              name: str(b?.name),
              currentStudentId: str(b?.current_student_id),
              studentId: str(b?.student_id),
            }),
            { headers: { 'cache-control': 'no-store' } },
          )
        } catch (e) {
          if (e instanceof SchoolError) return e.toResponse()
          throw e
        }
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/schools/$schoolId/own-papers/$paperId/sheets', [
  'GET',
  'POST',
])
