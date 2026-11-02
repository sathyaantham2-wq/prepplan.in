import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../db/connection'
import { wrapRouteHandlers } from '../../../../lib/error-log'
import { requireSchoolRole } from '../../../../lib/school-session'
import { SchoolError } from '../../../../lib/schools/common'
import { boardStudents, examBoard } from '../../../../lib/schools/exam-board'
import type { BoardBucket } from '../../../../lib/schools/exam-board'

// The exam-week board: sheets uploaded, AI-marked, waiting for a teacher, failed and released, per paper and section.
// Principal and office only. With ?paper_id=&section_id=&bucket= it lists the students behind one count.
const BUCKETS = ['uploaded', 'marked', 'waiting', 'failed', 'released']

export const Route = createFileRoute('/api/schools/$schoolId/exam-board')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const scope = await requireSchoolRole(request, params.schoolId, 'school_admin', 'principal')
        if (scope instanceof Response) return scope
        try {
          const q = new URL(request.url).searchParams
          const bucket = q.get('bucket')
          const db = getSharedDb()
          const body =
            bucket !== null
              ? BUCKETS.includes(bucket)
                ? {
                    students: await boardStudents(db, scope, q.get('paper_id') ?? '', q.get('section_id') ?? '', bucket as BoardBucket),
                  }
                : null
              : await examBoard(db, scope)
          if (body === null) throw new SchoolError('invalid', 'That is not a count on the board.')
          return Response.json(body, { headers: { 'cache-control': 'private, no-store' } })
        } catch (e) {
          if (e instanceof SchoolError) return e.toResponse()
          throw e
        }
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/schools/$schoolId/exam-board', ['GET'])
