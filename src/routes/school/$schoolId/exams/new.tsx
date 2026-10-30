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
  defaults: Array<{
    key: string
    name: string
    blurb: string
    totalMarks: number
    durationMin: number
  }>
  subjects: Array<{ id: string; name: string; grade: number }>
}

/** The ready patterns by the names schools use for them (owner direction 2026-10-30). */
const READY_NAMES: Record<string, string> = {
  unit_test_40: 'Unit Test, 40 marks',
  cbse_80: 'Half-yearly, 80 marks',
}

interface Pattern {
  key: string
  name: string
  blurb: string
}

function patternsOf(l: Listing): Array<Pattern> {
  const ready = [...l.defaults]
    .sort((a, b) => a.totalMarks - b.totalMarks)
    .map((d) => ({
      key: `ready:${d.key}`,
      name: READY_NAMES[d.key] ?? d.name,
      blurb: d.blurb,
    }))
  // the school's own: anything it built or changed (an unchanged copy of a ready one is that ready one)
  const own = l.templates
    .filter((t) => !(t.basedOn && t.version === 1))
    .map((t) => ({
      key: t.key,
      name: t.name,
      blurb: `Your school's pattern · ${t.totalMarks} marks · ${t.durationMin} minutes`,
    }))
  return [...ready, ...own]
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
        setKey(patternsOf(l)[0]?.key ?? '')
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
  if (listing.subjects.length === 0) {
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-bold">Make an exam paper</h1>
        <Notice>You need a subject you teach in a class first.</Notice>
      </div>
    )
  }
  const patterns = patternsOf(listing)
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
        <fieldset className="space-y-2">
          <legend className="mb-1.5 text-[15px] font-semibold text-slate-800">
            Pattern
          </legend>
          {patterns.map((p) => (
            <label
              key={p.key}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 px-3.5 py-3 transition-colors ${key === p.key ? 'border-emerald-600 bg-emerald-50/60' : 'border-slate-200 bg-white hover:border-slate-300'}`}
            >
              <input
                type="radio"
                name="pattern"
                className="mt-1 size-5 shrink-0"
                checked={key === p.key}
                onChange={() => setKey(p.key)}
              />
              <span className="min-w-0">
                <span className="block text-base font-semibold text-slate-900">
                  {p.name}
                </span>
                <span className="block text-sm text-slate-600">{p.blurb}</span>
              </span>
            </label>
          ))}
        </fieldset>
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
