import { useEffect, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useSchool } from '../../../../components/school/context'
import { BarChart3 } from 'lucide-react'
import {
  Chip,
  EmptyState,
  Loading,
  Notice,
  cardClass,
  linkButton,
} from '../../../../components/school/ui'
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
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Results</h1>
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
      {rows?.map((r) => (
        <Link
          key={r.examId}
          to="/school/$schoolId/results/$examId"
          params={{ schoolId, examId: r.examId }}
          search={{ student: undefined }}
          className={`${cardClass} block p-4! text-slate-900 transition-colors hover:border-emerald-300`}
        >
          <span className="flex flex-wrap items-center gap-2">
            <b className="font-display text-lg">{r.title}</b>
            {r.demo ? <Chip tone="wait">DEMO - sample data</Chip> : null}
          </span>
          <span className="mt-1 block text-base text-slate-700">
            {r.students} students · class average {r.average}%
          </span>
        </Link>
      ))}
    </div>
  )
}
