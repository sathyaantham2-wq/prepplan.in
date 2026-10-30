import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../db/connection'
import { wrapRouteHandlers } from '../../../../lib/error-log'
import { requireSchoolRole } from '../../../../lib/school-session'
import { SchoolError } from '../../../../lib/schools/common'
import { readJson } from '../../../../lib/schools/http'
import { saveModules } from '../../../../lib/schools/modules'

// The school's settings. POST { modules: ['papers', 'correction'] }: which parts the school uses.
// The office only (the list is read through the overview, which every member already gets).
export const Route = createFileRoute('/api/schools/$schoolId/settings')({
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        const scope = await requireSchoolRole(
          request,
          params.schoolId,
          'school_admin',
        )
        if (scope instanceof Response) return scope
        const b = await readJson(request)
        try {
          const modules = await saveModules(getSharedDb(), scope, b?.modules)
          return Response.json({ modules })
        } catch (e) {
          if (e instanceof SchoolError) return e.toResponse()
          throw e
        }
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/schools/$schoolId/settings', ['POST'])
