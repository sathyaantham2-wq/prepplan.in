import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { requireRole } from '../../../lib/session'
import { getSharedDb } from '../../../db/connection'
import {
  QUEUE_PAGE_SIZE,
  decideQualityCase,
  listQualityCases,
  refreshQualityLoop,
} from '../../../lib/quality/quality-loop'
import { wrapRouteHandlers } from '../../../lib/error-log'

const listSchema = z.object({
  status: z.enum(['open', 'decided', 'dismissed']).default('open'),
  limit: z.coerce.number().int().min(1).max(100).default(QUEUE_PAGE_SIZE),
})

const note = z.string().max(1000).default('')
const decideSchema = z.discriminatedUnion('decision', [
  z.object({ caseId: z.string().uuid(), decision: z.literal('dismiss'), note }),
  z.object({ caseId: z.string().uuid(), decision: z.literal('retire'), note }),
  z.object({
    caseId: z.string().uuid(),
    decision: z.literal('retag'),
    note,
    difficulty: z.enum(['Easy', 'Hard', 'Hardest']),
  }),
  z.object({
    caseId: z.string().uuid(),
    decision: z.literal('fix_key'),
    note,
    correctLabel: z.string().min(1).max(4).optional(),
    answerText: z.string().min(1).max(2000).optional(),
  }),
])

/**
 * The question-bank quality queue (docs/QUALITY_LOOP_PLAN.md), admin only.
 * GET   ?status=open|decided|dismissed -- the cases, most severe first, de-identified (no student or household).
 * POST  -- recompute the statistics and open/update cases from the latest answers and reports.
 * PATCH -- a person's decision on one case: dismiss, retire, retag, or fix_key (retire + corrected copy).
 * Unlike /api/admin/question-reports this is platform-wide: the reports that matter come from every family, and
 * the queue only ever shows the question and what was said about it, never who said it.
 */
export const Route = createFileRoute('/api/admin/quality')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const auth = await requireRole(request, 'admin')
        if (auth instanceof Response) return auth
        const url = new URL(request.url)
        const parsed = listSchema.safeParse({
          status: url.searchParams.get('status') ?? undefined,
          limit: url.searchParams.get('limit') ?? undefined,
        })
        if (!parsed.success) return Response.json({ error: 'invalid_query' }, { status: 400 })
        return Response.json(await listQualityCases(getSharedDb(), parsed.data.status, parsed.data.limit))
      },
      POST: async ({ request }) => {
        const auth = await requireRole(request, 'admin')
        if (auth instanceof Response) return auth
        return Response.json(await refreshQualityLoop(getSharedDb()))
      },
      PATCH: async ({ request }) => {
        const auth = await requireRole(request, 'admin')
        if (auth instanceof Response) return auth
        const parsed = decideSchema.safeParse(await request.json().catch(() => null))
        if (!parsed.success) return Response.json({ error: 'invalid_body' }, { status: 400 })
        const result = await decideQualityCase(getSharedDb(), {
          ...parsed.data,
          actor: { id: auth.id, householdId: auth.householdId },
        })
        if (!result.ok) {
          const status = result.error === 'case_not_found' ? 404 : 409
          return Response.json({ error: result.error }, { status })
        }
        return Response.json(result)
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/admin/quality', ['GET', 'POST', 'PATCH'])
