import { useEffect, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { useSchool } from '../../../../components/school/context'
import {
  Chip,
  EmptyState,
  Loading,
  Notice,
  PageHeader,
  cardClass,
} from '../../../../components/school/ui'
import { api } from '../../../../lib/school-client'
import type { myResults } from '../../../../lib/schools/results-release'

export const Route = createFileRoute('/school/$schoolId/my-results/')({
  component: MyResults,
})

type Row = Awaited<ReturnType<typeof myResults>>[number]

const day = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })

// A school student's own results, once her teacher has released them (M4). Nothing else of the school is here.
function MyResults() {
  const { schoolId } = useSchool()
  const [rows, setRows] = useState<Array<Row> | null>(null)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    void api<Array<Row>>(`/api/schools/${schoolId}/my-results`)
      .then(setRows)
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : 'Something went wrong.'),
      )
  }, [schoolId])
  if (error) return <Notice kind="error">{error}</Notice>
  if (!rows) return <Loading />
  return (
    <div className="space-y-4" data-testid="my-results">
      <PageHeader title="My results" subtitle="Your marked papers, and why marks were lost." />
      {rows.length === 0 ? (
        <EmptyState title="No results yet">
          When your teacher releases a marked paper, it appears here.
        </EmptyState>
      ) : (
        <ul className="space-y-3">
          {rows.map((r) => (
            <li key={r.paperId}>
              <Link
                to="/school/$schoolId/my-results/$paperId"
                params={{ schoolId, paperId: r.paperId }}
                className={`${cardClass} flex min-h-20 items-center gap-3`}
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-lg font-bold">{r.title}</span>
                  <span className="mt-1 block">
                    {r.locked ? (
                      <Chip>Marks are final</Chip>
                    ) : (
                      <Chip tone="wait">You can flag answers until {day(r.windowClosesAt)}</Chip>
                    )}
                  </span>
                </span>
                <span className="text-2xl font-bold text-slate-900">
                  {r.totalMarks}
                  <span className="text-slate-500"> / {r.maxMarks}</span>
                </span>
                <ChevronRight aria-hidden="true" className="size-5 shrink-0 text-slate-400" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
