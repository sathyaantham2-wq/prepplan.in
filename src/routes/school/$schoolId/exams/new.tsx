import { useEffect, useMemo, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useSchool } from '../../../../components/school/context'
import { ChapterPicker } from '../../../../components/school/chapter-picker'
import {
  Btn,
  Card,
  Notice,
  Select,
  TextInput,
} from '../../../../components/school/ui'
import { api } from '../../../../lib/school-client'
import type { SavedTemplate } from '../../../../lib/schools/template-service'

export const Route = createFileRoute('/school/$schoolId/exams/new')({
  component: NewExam,
})

interface Listing {
  templates: Array<SavedTemplate>
  subjects: Array<{ id: string; name: string; grade: number }>
}

function NewExam() {
  const { schoolId, overview } = useSchool()
  const navigate = useNavigate()
  const [listing, setListing] = useState<Listing | null>(null)
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [key, setKey] = useState('')
  const [sections, setSections] = useState<Set<string>>(new Set())
  const [picked, setPicked] = useState<Set<string>>(new Set())
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    api<Listing>(`/api/schools/${schoolId}/templates`)
      .then((l) => {
        setListing(l)
        setKey(l.templates[0]?.key ?? '')
        setSubjectId(l.subjects[0]?.id ?? '')
      })
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : 'Something went wrong.'),
      )
  }, [schoolId])

  const grade = listing?.subjects.find((s) => s.id === subjectId)?.grade
  // The sections of the class this subject belongs to (a teacher sees only the ones they teach).
  const sectionChoices = useMemo(
    () =>
      overview.classes
        .filter((c) => c.grade === grade)
        .flatMap((c) =>
          c.sections.map((s) => ({
            id: s.id,
            label: `Class ${c.grade} · Section ${s.name}`,
          })),
        ),
    [overview.classes, grade],
  )
  useEffect(() => {
    setSections(new Set(sectionChoices.map((s) => s.id)))
    setPicked(new Set())
  }, [subjectId, sectionChoices])

  async function make() {
    setBusy(true)
    setError(null)
    try {
      const r = await api<{ id: string }>(`/api/schools/${schoolId}/exams`, {
        body: {
          title,
          subject_id: subjectId,
          template_key: key,
          chapter_ids: [...picked],
          section_ids: [...sections],
          exam_date: date || undefined,
        },
      })
      await navigate({
        to: '/school/$schoolId/exams/$examId',
        params: { schoolId, examId: r.id },
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  if (!listing)
    return error ? (
      <Notice kind="error">{error}</Notice>
    ) : (
      <p className="text-base text-slate-700">Loading…</p>
    )
  if (listing.templates.length === 0 || listing.subjects.length === 0) {
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-bold">Make an exam paper</h1>
        <Notice>
          {listing.templates.length === 0
            ? 'Save a paper layout first (see Papers).'
            : 'You need a subject you teach in a class first.'}
        </Notice>
      </div>
    )
  }
  const ready =
    title.trim() && picked.size > 0 && sections.size > 0 && key && subjectId

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Make an exam paper</h1>
      <p className="text-base text-slate-700">
        One paper for the whole class. Students never see the answers.
      </p>
      <Card className="space-y-4">
        <TextInput
          label="Name of the exam"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="For example Unit Test 1"
        />
        <TextInput
          label="Date (optional)"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <Select
          label="Subject"
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
        >
          {listing.subjects.map((s) => (
            <option key={s.id} value={s.id}>
              Class {s.grade} · {s.name}
            </option>
          ))}
        </Select>
        <Select
          label="Paper layout"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        >
          {listing.templates.map((t) => (
            <option key={t.key} value={t.key}>
              {t.name}
            </option>
          ))}
        </Select>
      </Card>

      <Card className="space-y-1">
        <h2 className="text-lg font-bold">Who sits it</h2>
        {sectionChoices.length === 0 ? (
          <p className="text-base">No sections for this class yet.</p>
        ) : null}
        {sectionChoices.map((s) => (
          <label
            key={s.id}
            className="flex min-h-12 items-center gap-3 text-base"
          >
            <input
              type="checkbox"
              className="size-5"
              checked={sections.has(s.id)}
              onChange={(e) => {
                const next = new Set(sections)
                if (e.target.checked) next.add(s.id)
                else next.delete(s.id)
                setSections(next)
              }}
            />
            {s.label}
          </label>
        ))}
      </Card>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">Chapters</h2>
        <ChapterPicker
          schoolId={schoolId}
          subjectId={subjectId}
          picked={picked}
          onChange={setPicked}
        />
      </section>

      {error ? <Notice kind="error">{error}</Notice> : null}
      <Btn className="w-full" disabled={busy || !ready} onClick={make}>
        {busy ? 'Making the paper…' : 'Make the paper'}
      </Btn>
    </div>
  )
}
