import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../../db/connection'
import { wrapRouteHandlers } from '../../../../../lib/error-log'
import { requireSchoolRole } from '../../../../../lib/school-session'
import { SchoolError } from '../../../../../lib/schools/common'
import { readJson, str } from '../../../../../lib/schools/http'
import {
  addOwnQuestion,
  approveOwnKeys,
  approveOwnPaper,
  getOwnPaper,
  removeOwnQuestion,
  setOwnKey,
  stepOwnPaper,
  updateOwnQuestion,
} from '../../../../../lib/schools/own-paper-service'

// One own paper. GET: the whole paper for the review screen. POST { action }: read the next piece
// (step), change or add or remove a question, write or approve a key, approve the paper.
const num = (v: unknown) => (typeof v === 'number' ? v : Number.NaN)

export const Route = createFileRoute(
  '/api/schools/$schoolId/own-papers/$paperId',
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
          return Response.json(
            await getOwnPaper(getSharedDb(), scope, params.paperId),
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
        const id = params.paperId
        const qid = str(b?.question_id) ?? ''
        try {
          switch (str(b?.action)) {
            case 'step':
              return Response.json(await stepOwnPaper(db, scope, id), {
                headers: { 'cache-control': 'no-store' },
              })
            case 'update_question':
              await updateOwnQuestion(db, scope, id, qid, {
                text: typeof b?.text === 'string' ? b.text : undefined,
                marks: b?.marks === undefined ? undefined : num(b.marks),
                section: typeof b?.section === 'string' ? b.section : undefined,
                chapterId:
                  b?.chapter_id === undefined
                    ? undefined
                    : typeof b.chapter_id === 'string'
                      ? b.chapter_id
                      : null,
                options: Array.isArray(b?.options)
                  ? (b.options as Array<{ label: string; text: string }>)
                  : undefined,
              })
              break
            case 'add_question':
              await addOwnQuestion(db, scope, id, {
                text: str(b?.text) ?? '',
                marks: num(b?.marks),
                section: typeof b?.section === 'string' ? b.section : undefined,
                chapterId:
                  typeof b?.chapter_id === 'string' ? b.chapter_id : null,
              })
              break
            case 'remove_question':
              await removeOwnQuestion(db, scope, id, qid)
              break
            case 'set_key':
              await setOwnKey(db, scope, id, qid, {
                answer: typeof b?.answer === 'string' ? b.answer : '',
                steps: Array.isArray(b?.steps)
                  ? (b.steps as Array<{ description: string; marks: number }>)
                  : undefined,
                approve: b?.approve === true,
              })
              break
            case 'approve_keys':
              await approveOwnKeys(
                db,
                scope,
                id,
                Array.isArray(b?.question_ids)
                  ? (b.question_ids as Array<string>)
                  : 'all',
              )
              break
            case 'approve':
              await approveOwnPaper(db, scope, id)
              break
            default:
              return Response.json(
                {
                  error: 'invalid',
                  message:
                    'Something is missing. Check your answer and try again.',
                },
                { status: 400 },
              )
          }
          return Response.json(await getOwnPaper(db, scope, id), {
            headers: { 'cache-control': 'private, no-store' },
          })
        } catch (e) {
          if (e instanceof SchoolError) return e.toResponse()
          throw e
        }
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/schools/$schoolId/own-papers/$paperId', [
  'GET',
  'POST',
])
