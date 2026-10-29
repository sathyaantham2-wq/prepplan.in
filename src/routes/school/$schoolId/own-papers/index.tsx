import { useEffect, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useSchool } from '../../../../components/school/context'
import { Card, Chip, Notice } from '../../../../components/school/ui'
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
        className="flex min-h-14 items-center justify-center rounded-lg bg-emerald-700 px-4 text-base font-semibold [&_a]:text-white!"
      >
        <span className="text-white">Use your own paper</span>
      </Link>
      {error ? <Notice kind="error">{error}</Notice> : null}
      {rows === null && !error ? (
        <p className="text-base text-slate-700">Loading…</p>
      ) : null}
      {rows?.length === 0 ? (
        <Card>
          <p className="text-base">No papers yet.</p>
        </Card>
      ) : null}
      {rows?.map((r) => (
        <Link
          key={r.id}
          to="/school/$schoolId/own-papers/$paperId"
          params={{ schoolId, paperId: r.id }}
          className="block rounded-xl border border-slate-300 bg-white p-4 hover:bg-slate-50"
        >
          <span className="flex flex-wrap items-center gap-2">
            <b className="text-lg">{r.title}</b>
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
