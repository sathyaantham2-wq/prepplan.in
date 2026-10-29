import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../db/connection'
import { wrapRouteHandlers } from '../../../../lib/error-log'
import { requireSchoolRole } from '../../../../lib/school-session'
import { SchoolError } from '../../../../lib/schools/common'
import { readJson, str } from '../../../../lib/schools/http'
import {
  addWizardTeacher,
  finishWizard,
  getWizard,
  reopenWizard,
  saveAdminDetails,
  saveClasses,
  saveSchoolDetails,
  saveWizardStep,
} from '../../../../lib/schools/wizard'

// The first-sign-in wizard of the school admin. GET: where she is and what is already saved.
// POST { action, ... }: save one answer, remember the step, finish or skip. Admin only.
export const Route = createFileRoute('/api/schools/$schoolId/wizard')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const scope = await requireSchoolRole(
          request,
          params.schoolId,
          'school_admin',
        )
        if (scope instanceof Response) return scope
        try {
          return Response.json(await getWizard(getSharedDb(), scope), {
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
        )
        if (scope instanceof Response) return scope
        const b = await readJson(request)
        const db = getSharedDb()
        const bad = () =>
          Response.json(
            {
              error: 'invalid',
              message: 'Something is missing. Check your answer and try again.',
            },
            { status: 400 },
          )
        try {
          switch (str(b?.action)) {
            case 'admin':
              await saveAdminDetails(db, scope, {
                name: str(b?.name) ?? '',
                phone: str(b?.phone) ?? '',
              })
              break
            case 'school':
              await saveSchoolDetails(db, scope, {
                name: str(b?.name) ?? '',
                city: str(b?.city) ?? '',
                board: str(b?.board) ?? 'CBSE',
                acceptTerms: b?.accept_terms === true,
              })
              break
            case 'classes': {
              const list = Array.isArray(b?.classes)
                ? (b.classes as Array<Record<string, unknown>>)
                : []
              await saveClasses(db, scope, {
                academicYear: str(b?.academic_year) ?? '',
                classes: list.map((c) => ({
                  grade: Number(c.grade),
                  sections: Number(c.sections),
                })),
              })
              break
            }
            case 'teacher':
              await addWizardTeacher(db, scope, {
                name: str(b?.name) ?? '',
                email: str(b?.email) ?? '',
                sectionId: str(b?.section_id) ?? '',
                schoolSubjectId: str(b?.school_subject_id) ?? '',
              })
              break
            case 'step':
              await saveWizardStep(db, scope, str(b?.step) ?? '')
              break
            case 'finish':
              await finishWizard(
                db,
                scope,
                b?.skipped === true ? 'skipped' : 'finished',
              )
              break
            case 'reopen':
              await reopenWizard(db, scope)
              break
            default:
              return bad()
          }
          return Response.json(await getWizard(db, scope), {
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

wrapRouteHandlers(Route, '/api/schools/$schoolId/wizard', ['GET', 'POST'])
