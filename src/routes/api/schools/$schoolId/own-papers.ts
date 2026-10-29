import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../db/connection'
import { wrapRouteHandlers } from '../../../../lib/error-log'
import { requireSchoolRole } from '../../../../lib/school-session'
import { SchoolError } from '../../../../lib/schools/common'
import { readJson, str } from '../../../../lib/schools/http'
import {
  createOwnPaper,
  listOwnPapers,
} from '../../../../lib/schools/own-paper-service'
import type { UploadFile } from '../../../../lib/schools/own-paper-service'

// "Use your own paper": the school's papers (GET) and a new upload (POST). The office and the teacher
// of the subject only. Files arrive as base64 inside the JSON and are kept sealed in private storage.
const MAX_BODY_CHARS = 4_400_000

function files(v: unknown): Array<UploadFile> {
  if (!Array.isArray(v)) return []
  return v.map((f) => {
    const o = (f && typeof f === 'object' ? f : {}) as Record<string, unknown>
    const data = typeof o.data === 'string' ? o.data : ''
    return {
      name: str(o.name) ?? 'file',
      mediaType: str(o.media_type) ?? '',
      bytes: Buffer.from(data, 'base64'),
    }
  })
}

export const Route = createFileRoute('/api/schools/$schoolId/own-papers')({
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
          return Response.json(await listOwnPapers(getSharedDb(), scope), {
            headers: { 'cache-control': 'private, no-store' },
          })
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
        try {
          const len = Number(request.headers.get('content-length') ?? '0')
          if (len > MAX_BODY_CHARS)
            throw new SchoolError(
              'invalid',
              'These files are too big to send in one go. Use a smaller copy.',
            )
          const b = await readJson(request)
          return Response.json(
            await createOwnPaper(getSharedDb(), scope, {
              schoolSubjectId: str(b?.school_subject_id) ?? '',
              title: str(b?.title) ?? '',
              files: files(b?.files),
              keyFiles: files(b?.key_files),
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

wrapRouteHandlers(Route, '/api/schools/$schoolId/own-papers', ['GET', 'POST'])
