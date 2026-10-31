import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../../db/connection'
import { wrapRouteHandlers } from '../../../../../lib/error-log'
import { requireSchoolRole } from '../../../../../lib/school-session'
import { SchoolError } from '../../../../../lib/schools/common'
import { summaryHtml, summaryPdf, summaryText } from '../../../../../lib/schools/progress-share'

// The one-page summary for parents: ?format=pdf (default), ?format=text (for WhatsApp) or ?format=html (the page the PDF is printed from), ?lang=en|te.
// Built when asked from final marks, never stored or sent by PrepPlan.
export const Route = createFileRoute('/api/schools/$schoolId/progress/summary')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const scope = await requireSchoolRole(request, params.schoolId, 'student', 'parent')
        if (scope instanceof Response) return scope
        try {
          const q = new URL(request.url).searchParams
          const lang = q.get('lang') === 'te' ? 'te' : 'en'
          const child = q.get('child')
          const db = getSharedDb()
          if (q.get('format') === 'text')
            return Response.json({ text: await summaryText(db, scope, lang, child) }, { headers: { 'cache-control': 'private, no-store' } })
          if (q.get('format') === 'html')
            return new Response(await summaryHtml(db, scope, lang, child), {
              headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'private, no-store' },
            })
          const pdf = await summaryPdf(db, scope, lang, child)
          return new Response(new Uint8Array(pdf), {
            headers: {
              'content-type': 'application/pdf',
              'content-disposition': 'inline; filename="progress-summary.pdf"',
              'cache-control': 'private, no-store',
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

wrapRouteHandlers(Route, '/api/schools/$schoolId/progress/summary', ['GET'])
