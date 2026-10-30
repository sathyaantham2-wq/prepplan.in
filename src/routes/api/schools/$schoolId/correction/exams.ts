import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../../db/connection'
import { wrapRouteHandlers } from '../../../../../lib/error-log'
import { requireSchoolRole } from '../../../../../lib/school-session'
import { SchoolError } from '../../../../../lib/schools/common'
import {
  examsForCorrection,
  ownPaperFromExam,
} from '../../../../../lib/schools/correction'
import { readJson, str } from '../../../../../lib/schools/http'

// AI correction of a paper made here. GET: the exams this person may take into correction (and the ones
// already taken). POST { exam_id }: take one in (its answers come in as drafts for a teacher to approve).
export const Route = createFileRoute('/api/schools/$schoolId/correction/exams')(
  {
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
            return Response.json(
              { exams: await examsForCorrection(getSharedDb(), scope) },
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
          try {
            return Response.json(
              await ownPaperFromExam(
                getSharedDb(),
                scope,
                str(b?.exam_id) ?? '',
              ),
            )
          } catch (e) {
            if (e instanceof SchoolError) return e.toResponse()
            throw e
          }
        },
      },
    },
  },
)

wrapRouteHandlers(Route, '/api/schools/$schoolId/correction/exams', [
  'GET',
  'POST',
])
