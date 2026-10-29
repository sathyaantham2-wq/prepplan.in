import { useEffect, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useSchool } from '../../../../components/school/context'
import { Card, Chip, Notice } from '../../../../components/school/ui'
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
      {rows === null && !error ? (
        <p className="text-base text-slate-700">Loading…</p>
      ) : null}
      {rows?.length === 0 ? (
        <Card className="space-y-3">
          <p className="text-base">
            {overview.school.isDemo
              ? 'No sample results yet. Make a paper, open it, and press “Use sample answer sheets”.'
              : 'Results appear here after the answer sheets of an exam have been marked.'}
          </p>
          <Link
            to="/school/$schoolId/exams"
            params={{ schoolId }}
            className="inline-flex min-h-12 items-center rounded-lg border border-slate-300 px-4 text-base font-semibold"
          >
            Go to exams
          </Link>
        </Card>
      ) : null}
      {rows?.map((r) => (
        <Link
          key={r.examId}
          to="/school/$schoolId/results/$examId"
          params={{ schoolId, examId: r.examId }}
          search={{ student: undefined }}
          className="block rounded-xl border border-slate-300 bg-white p-4 hover:bg-slate-50"
        >
          <span className="flex flex-wrap items-center gap-2">
            <b className="text-lg">{r.title}</b>
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
