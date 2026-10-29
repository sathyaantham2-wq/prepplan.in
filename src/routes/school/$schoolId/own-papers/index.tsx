import { useEffect, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useSchool } from '../../../../components/school/context'
import { FileUp } from 'lucide-react'
import {
  Chip,
  EmptyState,
  Loading,
  Notice,
  cardClass,
  linkButton,
} from '../../../../components/school/ui'
import { api } from '../../../../lib/school-client'

export const Route = createFileRoute('/school/$schoolId/own-papers/')({
  component: OwnPapers,
})

interface Row {
  id: string
  title: string
  status: string
  subjectName: string
  grade: number
  totalMarks: number | null
}

const STATUS: Partial<
  Record<string, { text: string; tone: 'plain' | 'good' | 'wait' }>
> = {
  reading: { text: 'Being read', tone: 'wait' },
  needs_review: { text: 'Check it', tone: 'wait' },
  approved: { text: 'Approved', tone: 'good' },
  failed: { text: 'Could not be read', tone: 'plain' },
  uploaded: { text: 'Uploaded', tone: 'plain' },
}

function OwnPapers() {
  const { schoolId } = useSchool()
  const [rows, setRows] = useState<Array<Row> | null>(null)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    void api<Array<Row>>(`/api/schools/${schoolId}/own-papers`).then(
      setRows,
      (e: unknown) =>
        setError(e instanceof Error ? e.message : 'Something went wrong.'),
    )
  }, [schoolId])
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Your own papers</h1>
      <p className="text-base text-slate-700">
        Upload a question paper you already have (Word, PDF or photos). We read
        it, match each question to a chapter, and you check it.
      </p>
      <Link
        to="/school/$schoolId/own-papers/new"
        params={{ schoolId }}
        className={`${linkButton.primary} min-h-14 w-full`}
      >
        <FileUp aria-hidden="true" className="size-5" />
        Use your own paper
      </Link>
      {error ? <Notice kind="error">{error}</Notice> : null}
      {rows === null && !error ? <Loading /> : null}
      {rows?.length === 0 ? (
        <EmptyState icon={<FileUp className="size-6" />} title="No papers yet.">
          A paper you upload is listed here while it is read, checked and
          approved.
        </EmptyState>
      ) : null}
      {rows?.map((r) => (
        <Link
          key={r.id}
          to="/school/$schoolId/own-papers/$paperId"
          params={{ schoolId, paperId: r.id }}
          className={`${cardClass} block p-4! text-slate-900 transition-colors hover:border-emerald-300`}
        >
          <span className="flex flex-wrap items-center gap-2">
            <b className="font-display text-lg">{r.title}</b>
            <Chip tone={STATUS[r.status]?.tone ?? 'plain'}>
              {STATUS[r.status]?.text ?? r.status}
            </Chip>
          </span>
          <span className="mt-1 block text-base text-slate-700">
            Class {r.grade} · {r.subjectName}
            {r.totalMarks !== null ? ` · ${r.totalMarks} marks` : ''}
          </span>
        </Link>
      ))}
    </div>
  )
}
