import { useEffect, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { BookOpenCheck, Plus } from 'lucide-react'
import { useSchool } from '../../../../components/school/context'
import { DataTable } from '../../../../components/school/kit'
import {
  Btn,
  Chip,
  EmptyState,
  Loading,
  Notice,
  PageHeader,
} from '../../../../components/school/ui'
import { api } from '../../../../lib/school-client'
import type { ExamSummary } from '../../../../lib/schools/exam-service'
import { formatDate } from '../../../../lib/dates'

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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Exams"
        help="Papers made in PrepPlan from your chapters: the question paper, and the answer key for teachers. Students write on your school’s own answer sheets."
        primary={
          canMake ? (
            <Btn
              onClick={() =>
                void navigate({
                  to: '/school/$schoolId/exams/new',
                  params: { schoolId },
                })
              }
            >
              <Plus aria-hidden="true" className="size-5" />
              Make an exam paper
            </Btn>
          ) : null
        }
      />
      {error ? <Notice kind="error">{error}</Notice> : null}
      {!exams && !error ? <Loading /> : null}
      {exams ? (
        <DataTable
          testId="exams-table"
          rows={exams}
          rowKey={(e) => e.id}
          search={(e) => `${e.title} ${e.className}`}
          searchLabel="Search papers"
          empty={
            <EmptyState
              icon={<BookOpenCheck className="size-6" />}
              title="No exam papers yet."
            >
              Make one from your chapters. You get the question paper and the
              answer key, as PDF and Word.
            </EmptyState>
          }
          columns={[
            {
              key: 'title',
              header: 'Paper',
              cell: (e) => (
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold">{e.title}</span>
                  {e.stage === 'building' ? (
                    <Chip tone="wait">
                      Draft · last changed {formatDate(e.editedAt)}
                    </Chip>
                  ) : null}
                  {e.gaps > 0 ? (
                    <Chip tone="wait">
                      {e.gaps} {e.gaps === 1 ? 'gap' : 'gaps'}
                    </Chip>
                  ) : null}
                </span>
              ),
            },
            {
              key: 'class',
              header: 'Class',
              cell: (e) =>
                `${e.className} · ${e.sections.map((x) => `Section ${x}`).join(', ')}`,
            },
            { key: 'marks', header: 'Marks', cell: (e) => e.printedMarks },
            {
              key: 'date',
              header: 'Date',
              hideOnPhone: true,
              cell: (e) => formatDate(e.examDate),
            },
            {
              key: 'open',
              header: <span className="sr-only">Open</span>,
              className: 'text-right',
              cell: (e) =>
                e.stage === 'building' ? (
                  <Btn
                    onClick={() =>
                      void navigate({
                        to: '/school/$schoolId/exams/build/$examId',
                        params: { schoolId, examId: e.id },
                      })
                    }
                  >
                    Go on choosing
                  </Btn>
                ) : (
                  <Btn
                    kind="plain"
                    onClick={() =>
                      void navigate({
                        to: '/school/$schoolId/exams/$examId',
                        params: { schoolId, examId: e.id },
                      })
                    }
                  >
                    Open
                  </Btn>
                ),
            },
          ]}
        />
      ) : null}
    </div>
  )
}
