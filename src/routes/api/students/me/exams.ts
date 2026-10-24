import { createFileRoute } from '@tanstack/react-router'
import { requireRole } from '../../../../lib/session'
import { resolveEnabledStudent } from '../../../../lib/access'
import { getSharedDb } from '../../../../db/connection'
import {
  examsInputSchema,
  getStudentExams,
  saveStudentExams,
  validateExamList,
} from '../../../../lib/student-exams'
import { wrapRouteHandlers } from '../../../../lib/error-log'

// The signed-in student's own exam dates. Student role only, her own record only; it writes
// nothing but students.target_exams. A student whose access is paused gets 423 like the other
// student write routes.
export const Route = createFileRoute('/api/students/me/exams')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const auth = await requireRole(request, 'student')
        if (auth instanceof Response) return auth
        const db = getSharedDb()
        const student = await resolveEnabledStudent(db, auth.id)
        if (student instanceof Response) return student
        return Response.json({ exams: await getStudentExams(db, student.id) })
      },
      PUT: async ({ request }) => {
        const auth = await requireRole(request, 'student')
        if (auth instanceof Response) return auth
        const db = getSharedDb()
        const student = await resolveEnabledStudent(db, auth.id)
        if (student instanceof Response) return student

        const body = await request.json().catch(() => null)
        const parsed = examsInputSchema.safeParse(body)
        if (!parsed.success) {
          return Response.json(
            { error: parsed.error.issues[0]?.message ?? 'Check the exam name and date' },
            { status: 400 },
          )
        }
        const checked = validateExamList(parsed.data.exams)
        if (!checked.ok) return Response.json({ error: checked.error }, { status: 400 })
        const exams = await saveStudentExams(db, student, auth.id, checked.exams)
        return Response.json({ exams })
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/students/me/exams', ['GET', 'PUT'])
