import { useEffect, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useSchool } from '../../../../components/school/context'
import { BarChart3 } from 'lucide-react'
import {
  Chip,
  EmptyState,
  Loading,
  Notice,
  PageHeader,
  linkButton,
} from '../../../../components/school/ui'
import { DataTable } from '../../../../components/school/kit'
import { api } from '../../../../lib/school-client'
import type { ResultsListRow } from '../../../../lib/schools/demo'

export const Route = createFileRoute('/school/$schoolId/results/')({
  component: ResultsList,
})

function ResultsList() {
  const { schoolId, overview } = useSchool()
  const [rows, setRows] = useState<Array<ResultsListRow> | null>(null)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    void api<Array<ResultsListRow>>(`/api/schools/${schoolId}/results`).then(
      setRows,
      (e: unknown) =>
        setError(e instanceof Error ? e.message : 'Something went wrong.'),
    )
  }, [schoolId])
  return (
    <div className="space-y-6">
      <PageHeader title="Results" help="Each exam's marks once its answer sheets are marked: the class average, and each student's strong topics and topics to fix." />
      {error ? <Notice kind="error">{error}</Notice> : null}
      {rows === null && !error ? <Loading /> : null}
      {rows?.length === 0 ? (
        <EmptyState
          icon={<BarChart3 className="size-6" />}
          title={
            overview.school.isDemo
              ? 'No sample results yet.'
              : 'No results yet.'
          }
          action={
            <Link
              to="/school/$schoolId/exams"
              params={{ schoolId }}
              className={linkButton.plain}
            >
              Go to exams
            </Link>
          }
        >
          {overview.school.isDemo
            ? 'Make a paper, open it, and press “Use sample answer sheets”.'
            : 'Results appear here after the answer sheets of an exam have been marked.'}
        </EmptyState>
      ) : null}
      {rows && rows.length > 0 ? (
        <DataTable
          testId="results-table"
          rows={rows}
          rowKey={(r) => r.examId}
          search={(r) => r.title}
          searchLabel="Search exams"
          columns={[
            {
              key: 'title',
              header: 'Exam',
              cell: (r) => (
                <Link
                  to="/school/$schoolId/results/$examId"
                  params={{ schoolId, examId: r.examId }}
                  search={{ student: undefined }}
                  className="inline-flex flex-wrap items-center gap-2 font-semibold text-slate-900! hover:underline"
                >
                  {r.title}
                  {r.demo ? <Chip tone="wait">DEMO - sample data</Chip> : null}
                </Link>
              ),
            },
            { key: 'students', header: 'Students', cell: (r) => r.students },
            { key: 'avg', header: 'Class average', cell: (r) => `${r.average}%` },
          ]}
        />
      ) : null}
    </div>
  )
}
