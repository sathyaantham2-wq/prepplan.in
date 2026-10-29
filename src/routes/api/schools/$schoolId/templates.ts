import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../db/connection'
import { wrapRouteHandlers } from '../../../../lib/error-log'
import { requireSchoolRole } from '../../../../lib/school-session'
import { SchoolError } from '../../../../lib/schools/common'
import { readJson, str } from '../../../../lib/schools/http'
import {
  adoptDefaultTemplate,
  listTemplates,
  listUsableSubjects,
  retireTemplate,
  saveTemplate,
} from '../../../../lib/schools/template-service'
import { parseDefinition } from '../../../../lib/schools/template-input'

// The school's paper layouts. GET lists them with the two ready-made ones and the subjects the
// caller may use; POST { action: 'save' | 'adopt_default' | 'retire', ... } changes them.
export const Route = createFileRoute('/api/schools/$schoolId/templates')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const scope = await requireSchoolRole(
          request,
          params.schoolId,
          'school_admin',
          'teacher',
          'principal',
        )
        if (scope instanceof Response) return scope
        const db = getSharedDb()
        return Response.json(
          {
            ...(await listTemplates(db, scope)),
            subjects: await listUsableSubjects(db, scope),
          },
          { headers: { 'cache-control': 'no-store' } },
        )
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
          switch (str(b?.action)) {
            case 'save': {
              const definition = parseDefinition(b?.definition)
              if (!definition)
                return Response.json(
                  { error: 'invalid', message: 'The layout is not complete.' },
                  { status: 400 },
                )
              return Response.json(
                await saveTemplate(db, scope, {
                  key: str(b?.key) ?? undefined,
                  definition,
                }),
              )
            }
            case 'adopt_default': {
              const key = str(b?.default_key)
              if (!key)
                return Response.json(
                  { error: 'invalid', message: 'Choose a ready-made layout.' },
                  { status: 400 },
                )
              return Response.json(await adoptDefaultTemplate(db, scope, key))
            }
            case 'retire': {
              const key = str(b?.key)
              if (!key)
                return Response.json(
                  { error: 'invalid', message: 'Choose a layout.' },
                  { status: 400 },
                )
              await retireTemplate(db, scope, key)
              return Response.json({ ok: true })
            }
            default:
              return Response.json(
                { error: 'invalid', message: 'Unknown action.' },
                { status: 400 },
              )
          }
        } catch (e) {
          if (e instanceof SchoolError) return e.toResponse()
          throw e
        }
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/schools/$schoolId/templates', ['GET', 'POST'])
