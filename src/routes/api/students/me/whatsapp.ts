import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../db/connection'
import {
  auditLogRepository,
  studentsRepository,
  waLoginRepository,
} from '../../../../db/repositories'
import { wrapRouteHandlers } from '../../../../lib/error-log'
import { requireRole } from '../../../../lib/session'
import { maskPhone } from '../../../../lib/wa-login'
import type { WaLinkStatusResponse } from '../../../../lib/wa-login-types'

// The signed-in student's own WhatsApp number (the one she signs in with): see it masked, or
// remove it. Own record only. She cannot remove it if that would leave her no way to sign in.
export const Route = createFileRoute('/api/students/me/whatsapp')({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        const auth = await requireRole(request, 'student')
        if (auth instanceof Response) return auth
        const db = getSharedDb()
        const row = await waLoginRepository.findUserPhone(db, auth.id)
        const body: WaLinkStatusResponse = {
          linked: !!row?.phone_number,
          phone_masked: row?.phone_number ? maskPhone(row.phone_number) : null,
          can_unlink: await waLoginRepository.hasOtherSignInMethod(db, auth.id),
        }
        return Response.json(body)
      },
      DELETE: async ({ request }: { request: Request }) => {
        const auth = await requireRole(request, 'student')
        if (auth instanceof Response) return auth
        const db = getSharedDb()
        const row = await waLoginRepository.findUserPhone(db, auth.id)
        if (!row?.phone_number) {
          return Response.json({ error: 'not_linked' }, { status: 404 })
        }
        if (!(await waLoginRepository.hasOtherSignInMethod(db, auth.id))) {
          return Response.json({ error: 'cannot_unlink' }, { status: 409 })
        }
        await waLoginRepository.clearUserPhone(db, auth.id)
        const student = await studentsRepository.findByUserId(db, auth.id)
        if (student) {
          await auditLogRepository.insert(db, {
            household_id: student.household_id,
            actor_user_id: auth.id,
            action: 'student.whatsapp_unlinked',
            entity: 'students',
            entity_id: student.id,
            before: JSON.stringify({ phone: maskPhone(row.phone_number) }),
            after: null,
          })
        }
        return Response.json({ linked: false, phone_masked: null, can_unlink: true })
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/students/me/whatsapp', ['GET', 'DELETE'])
