import { useEffect, useMemo, useState } from 'react'
import { Card, Notice } from './ui'
import { api } from '../../lib/school-client'

export interface PickerChapter {
  id: string
  book: string
  part: string
  chapterNo: number
  name: string
  label: string
  concepts: number
  approvedQuestions: number
}

/**
 * Chapters of one subject, grouped as the book groups them (book, part), each named by its part and
 * chapter number, never by the number alone. Also shows the bank's warning when the subject has no
 * long-answer or case-based questions at all.
 */
export function ChapterPicker({
  schoolId,
  subjectId,
  picked,
  onChange,
}: {
  schoolId: string
  subjectId: string
  picked: ReadonlySet<string>
  onChange: (next: Set<string>) => void
}) {
  const [chapters, setChapters] = useState<Array<PickerChapter>>([])
  const [note, setNote] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!subjectId) return
    setError(null)
    api<{ chapters: Array<PickerChapter>; depth: { note: string | null } }>(
      `/api/schools/${schoolId}/bank/chapters?subject_id=${subjectId}`,
    )
      .then((r) => {
        setChapters(r.chapters)
        setNote(r.depth.note)
      })
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : 'Something went wrong.'),
      )
  }, [schoolId, subjectId])

  const groups = useMemo(() => {
    const out: Array<{ heading: string; items: Array<PickerChapter> }> = []
    for (const c of chapters) {
      const heading = `${c.book} · Part ${c.part}`
      const last = out.length > 0 ? out[out.length - 1] : null
      if (last && last.heading === heading) last.items.push(c)
      else out.push({ heading, items: [c] })
    }
    return out
  }, [chapters])

  return (
    <div className="space-y-3">
      {error ? <Notice kind="error">{error}</Notice> : null}
      {note ? (
        <div
          role="alert"
          data-testid="depth-note"
          className="rounded-lg border-2 border-amber-500 bg-amber-50 px-4 py-3 text-base text-amber-950"
        >
          <b>Before you start.</b> {note}
        </div>
      ) : null}
      {groups.length === 0 && !error ? (
        <Notice>This subject has no chapters in the bank yet.</Notice>
      ) : null}
      {groups.map((g) => (
        <Card key={g.heading} className="space-y-1">
          <h3 className="text-base font-bold">{g.heading}</h3>
          {g.items.map((c) => (
            <label
              key={c.id}
              className="flex min-h-12 items-start gap-3 py-2 text-base"
            >
              <input
                type="checkbox"
                className="mt-1 size-5 shrink-0"
                checked={picked.has(c.id)}
                onChange={(e) => {
                  const next = new Set(picked)
                  if (e.target.checked) next.add(c.id)
                  else next.delete(c.id)
                  onChange(next)
                }}
              />
              <span>
                <b>Chapter {c.chapterNo}</b> · {c.name}
                <span className="block text-sm text-slate-600">
                  {c.approvedQuestions} questions in the bank
                </span>
              </span>
            </label>
          ))}
        </Card>
      ))}
    </div>
  )
}
