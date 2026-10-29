import { useEffect, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { BookOpenCheck } from 'lucide-react'
import { useSchool } from '../../../../components/school/context'
import {
  Btn,
  Card,
  Chip,
  EmptyState,
  Notice,
} from '../../../../components/school/ui'
import { api } from '../../../../lib/school-client'
import type { ExamSummary } from '../../../../lib/schools/exam-service'

export const Route = createFileRoute('/school/$schoolId/exams/')({
  component: Exams,
})

function Exams() {
  const { schoolId, overview } = useSchool()
  const navigate = useNavigate()
  const [exams, setExams] = useState<Array<ExamSummary> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const canMake =
    overview.role === 'school_admin' || overview.role === 'teacher'

  useEffect(() => {
    api<{ exams: Array<ExamSummary> }>(`/api/schools/${schoolId}/exams`)
      .then((r) => setExams(r.exams))
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : 'Something went wrong.'),
      )
  }, [schoolId])

  if (error) return <Notice kind="error">{error}</Notice>
  if (!exams) return <p className="text-base text-slate-700">Loading…</p>
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Exams</h1>
      {canMake ? (
        <Btn
          className="w-full"
          onClick={() =>
            navigate({
              to: '/school/$schoolId/exams/new',
              params: { schoolId },
            })
          }
        >
          Make an exam paper
        </Btn>
      ) : null}
      {exams.length === 0 ? (
        <EmptyState
          icon={<BookOpenCheck className="size-6" />}
          title="No exam papers yet."
        >
          Make one from your chapters, then print it with an answer booklet for
          every student.
        </EmptyState>
      ) : null}
      {exams.map((e) => (
        <Card key={e.id} className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <b className="font-display text-lg">{e.title}</b>
            <Chip tone="good">{e.printedMarks} marks</Chip>
            {e.gaps > 0 ? (
              <Chip tone="wait">
                {e.gaps} {e.gaps === 1 ? 'gap' : 'gaps'}
              </Chip>
            ) : null}
          </div>
          <p className="text-base text-slate-700">
            {e.className} · {e.sections.map((s) => `Section ${s}`).join(', ')}
            {e.examDate ? ` · ${e.examDate}` : ''}
          </p>
          <Btn
            kind="plain"
            className="w-full"
            onClick={() =>
              navigate({
                to: '/school/$schoolId/exams/$examId',
                params: { schoolId, examId: e.id },
              })
            }
          >
            Open
          </Btn>
        </Card>
      ))}
    </div>
  )
}
