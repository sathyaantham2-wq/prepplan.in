import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../../db/connection'
import { wrapRouteHandlers } from '../../../../lib/error-log'
import { requireSchoolRole } from '../../../../lib/school-session'
import { SchoolError } from '../../../../lib/schools/common'
import { readJson, str } from '../../../../lib/schools/http'
import {
  addSchoolSubject,
  assignTeacher,
  createClass,
  createSection,
  setClassTeacher,
  setSampleChecker,
} from '../../../../lib/schools/setup'

// One door for the admin's setup actions: { action, ...fields }. Every action is admin-only and
// audited inside its service.
export const Route = createFileRoute('/api/schools/$schoolId/setup')({
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
        const action = str(b?.action)
        const db = getSharedDb()
        const bad = () =>
          Response.json(
            {
              error: 'invalid',
              message: 'Something is missing. Check the form and try again.',
            },
            { status: 400 },
          )
        try {
          switch (action) {
            case 'create_class': {
              const grade = Number(b?.grade)
              const year = str(b?.academic_year)
              if (!year) return bad()
              return Response.json(await createClass(db, scope, grade, year))
            }
            case 'create_section': {
              const classId = str(b?.class_id)
              const name = str(b?.name)
              if (!classId || !name) return bad()
              return Response.json(
                await createSection(db, scope, classId, name),
              )
            }
            case 'add_subject': {
              const classId = str(b?.class_id)
              const subjectId = str(b?.subject_id)
              if (!classId || !subjectId) return bad()
              return Response.json(
                await addSchoolSubject(db, scope, classId, subjectId),
              )
            }
            case 'set_class_teacher': {
              const sectionId = str(b?.section_id)
              if (!sectionId) return bad()
              return Response.json(
                await setClassTeacher(db, scope, sectionId, str(b?.member_id)),
              )
            }
            case 'assign_teacher': {
              const memberId = str(b?.member_id)
              const sectionId = str(b?.section_id)
              const schoolSubjectId = str(b?.school_subject_id)
              if (!memberId || !sectionId || !schoolSubjectId) return bad()
              return Response.json(
                await assignTeacher(db, scope, {
                  memberId,
                  sectionId,
                  schoolSubjectId,
                }),
              )
            }
            case 'set_sample_checker': {
              const assignmentId = str(b?.assignment_id)
              const checker =
                b?.checker === 'subject_teacher'
                  ? 'subject_teacher'
                  : b?.checker === 'class_teacher'
                    ? 'class_teacher'
                    : null
              if (!assignmentId || !checker) return bad()
              return Response.json(
                await setSampleChecker(db, scope, assignmentId, checker),
              )
            }
            default:
              return bad()
          }
        } catch (e) {
          if (e instanceof SchoolError) return e.toResponse()
          throw e
        }
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/schools/$schoolId/setup', ['POST'])
