import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { requireRole } from '../../../lib/session'
import { resolveEnabledStudent } from '../../../lib/access'
import {
  CivilSubjectNotFoundError,
  generateCivilPrelimsPaper,
} from '../../../lib/civil-paper'
import { getSharedDb } from '../../../db/connection'
import {
  consentsRepository,
  generationEventsRepository,
} from '../../../db/repositories'
import {
  StudentSpendCapReachedError,
  enforceStudentSpendBudget,
} from '../../../lib/ai-metering'
import { logProductEvent } from '../../../lib/product-events'
import { wrapRouteHandlers } from '../../../lib/error-log'

// F132: the Civil Services "New paper" screen. Student-only, and only for a student whose profile
// is the competitive-exam track (board CIVILS, class 0). The paper is drawn from the bank; nothing
// here calls the AI, so there is no parent email either (the track has no parent).
const generateCivilSchema = z.object({
  question_count: z.union([z.literal(10), z.literal(15), z.literal(30)]),
  // One subject today (Polity). The screen sends an array so Geography/Economy can join later
  // without changing this contract; the server resolves each code itself, never an id.
  subject_codes: z.array(z.enum(['POLITY'])).length(1),
})

export const Route = createFileRoute('/api/papers/generate-civil')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const auth = await requireRole(request, 'student')
        if (auth instanceof Response) return auth

        const parsed = generateCivilSchema.safeParse(await request.json().catch(() => null))
        if (!parsed.success) {
          return Response.json({ error: parsed.error.flatten() }, { status: 400 })
        }

        const db = getSharedDb()
        // A student always generates as herself (F010's access_enabled gate applies here too).
        const student = await resolveEnabledStudent(db, auth.id)
        if (student instanceof Response) return student

        if (student.board !== 'CIVILS' || student.class !== 0) {
          return Response.json(
            { error: 'This paper is only for the Civil Services track.' },
            { status: 403 },
          )
        }

        // F095: same consent gate as /api/papers/generate -- no active consent row means no valid
        // consent on file, whether never given or withdrawn.
        const activeConsent = await consentsRepository.findActiveForStudent(db, student.id)
        if (!activeConsent) {
          return Response.json(
            {
              error:
                'Parental consent for this student is missing or has been withdrawn -- generation is blocked until consent is given again',
            },
            { status: 403 },
          )
        }

        // F121: the INR spend ceiling still applies, even though this paper costs no AI call
        // itself (the student's own grading does).
        try {
          await enforceStudentSpendBudget(db, { studentId: student.id })
        } catch (err) {
          if (err instanceof StudentSpendCapReachedError) {
            return Response.json(
              { error: 'spend_cap_exceeded', message: err.message },
              { status: 429 },
            )
          }
          throw err
        }

        let result
        try {
          result = await generateCivilPrelimsPaper(db, {
            studentId: student.id,
            questionCount: parsed.data.question_count,
            subjectCode: parsed.data.subject_codes[0],
          })
        } catch (err) {
          if (err instanceof CivilSubjectNotFoundError) {
            return Response.json(
              { error: 'no_content', message: 'Questions for this subject are not available yet.' },
              { status: 404 },
            )
          }
          throw err
        }

        await generationEventsRepository.insert(db, {
          student_id: student.id,
          triggered_by: 'student',
        })
        await logProductEvent(db, {
          eventType: 'paper_generated',
          householdId: student.household_id,
          studentId: student.id,
        })

        // paperQuestions are ids and positions only -- no question text, options, answers or
        // explanations leave this route; the attempt screen fetches questions through its own
        // student-safe route.
        return Response.json(result, { status: 201 })
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/papers/generate-civil', ['POST'])
