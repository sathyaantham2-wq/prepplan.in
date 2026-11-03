import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../../../db/connection'
import { wrapRouteHandlers } from '../../../../../../lib/error-log'
import { requireSchoolRole } from '../../../../../../lib/school-session'
import { SchoolError } from '../../../../../../lib/schools/common'
import { builderAction, builderBank, builderView } from '../../../../../../lib/schools/exam-builder'
import type { BuilderAction } from '../../../../../../lib/schools/exam-builder'
import { readJson } from '../../../../../../lib/schools/http'

// The paper builder (docs/SCHOOLS_MODULE_PLAN.md section 16). GET: the paper, its sections and the live checklist;
// GET ?bank=1&type=&marks=&difficulty=&bloom=&level=&chapter=&q=&hide_used=1&page=&answers=1: the question bank for
// the chosen chapters (answers only for the teacher and the office). POST { action, ... }: change the paper.
// The principal may look; only the office and the teacher of the subject may change. Never a student.
export const Route = createFileRoute('/api/schools/$schoolId/exams/$examId/builder')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const scope = await requireSchoolRole(request, params.schoolId, 'school_admin', 'teacher', 'principal')
        if (scope instanceof Response) return scope
        try {
          const q = new URL(request.url).searchParams
          const db = getSharedDb()
          const body =
            q.get('bank') === '1'
              ? await builderBank(db, scope, params.examId, {
                  type: q.get('type'),
                  marks: q.get('marks') ? Number(q.get('marks')) : null,
                  difficulty: q.get('difficulty'),
                  bloom: q.get('bloom'),
                  level: q.get('level') === 'Remember' || q.get('level') === 'Think' ? (q.get('level') as 'Remember' | 'Think') : null,
                  chapterId: q.get('chapter'),
                  q: q.get('q'),
                  hideUsed: q.get('hide_used') === '1',
                  page: Number(q.get('page') ?? 0) || 0,
                  answers: q.get('answers') === '1',
                })
              : await builderView(db, scope, params.examId)
          return Response.json(body, { headers: { 'cache-control': 'private, no-store' } })
        } catch (e) {
          if (e instanceof SchoolError) return e.toResponse()
          throw e
        }
      },
      POST: async ({ request, params }) => {
        const scope = await requireSchoolRole(request, params.schoolId, 'school_admin', 'teacher', 'principal')
        if (scope instanceof Response) return scope
        const b = await readJson(request)
        try {
          if (typeof b?.action !== 'string') throw new SchoolError('invalid', 'Say what to do.')
          return Response.json(await builderAction(getSharedDb(), scope, params.examId, b as unknown as BuilderAction))
        } catch (e) {
          if (e instanceof SchoolError) return e.toResponse()
          throw e
        }
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/schools/$schoolId/exams/$examId/builder', ['GET', 'POST'])
