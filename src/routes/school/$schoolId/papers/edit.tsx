import { useEffect, useMemo, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useSchool } from '../../../../components/school/context'
import {
  Btn,
  Card,
  Notice,
  Select,
  TextInput,
} from '../../../../components/school/ui'
import { api } from '../../../../lib/school-client'
import {
  KIND_LABEL,
  SECTION_KINDS,
  computeTotal,
  validateTemplate,
} from '../../../../lib/schools/templates'
import type {
  SectionKind,
  TemplateDefinition,
  TemplateSection,
} from '../../../../lib/schools/templates'
import type { SavedTemplate } from '../../../../lib/schools/template-service'

export const Route = createFileRoute('/school/$schoolId/papers/edit')({
  validateSearch: (s: Record<string, unknown>) => ({
    key: typeof s.key === 'string' ? s.key : undefined,
  }),
  component: Builder,
})

const BLANK: TemplateDefinition = {
  name: '',
  totalMarks: 40,
  durationMin: 90,
  levelMix: {
    recall_understanding: 40,
    application: 40,
    analysis_evaluation: 20,
  },
  sections: [
    { name: 'Section A', kind: 'mcq', count: 10, marks: 1, orCount: 0 },
  ],
}

const num = (v: string) => (v.trim() === '' ? Number.NaN : Number(v))
const show = (n: number) => (Number.isNaN(n) ? '' : String(n))

function Builder() {
  const { key } = Route.useSearch()
  const { schoolId } = useSchool()
  const navigate = useNavigate()
  const [def, setDef] = useState<TemplateDefinition>(BLANK)
  const [loaded, setLoaded] = useState(!key)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!key) return
    api<{ templates: Array<SavedTemplate> }>(
      `/api/schools/${schoolId}/templates`,
    )
      .then((r) => {
        const t = r.templates.find((x) => x.key === key)
        if (!t) throw new Error('We could not find that layout.')
        setDef({
          name: t.name,
          totalMarks: t.totalMarks,
          durationMin: t.durationMin,
          levelMix: t.levelMix,
          sections: t.sections,
        })
        setLoaded(true)
      })
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : 'Something went wrong.'),
      )
  }, [key, schoolId])

  const problems = useMemo(() => validateTemplate(def), [def])
  const sum = computeTotal(def.sections)
  const mixSum =
    def.levelMix.recall_understanding +
    def.levelMix.application +
    def.levelMix.analysis_evaluation

  const setSection = (i: number, patch: Partial<TemplateSection>) =>
    setDef((d) => ({
      ...d,
      sections: d.sections.map((s, j) => (j === i ? { ...s, ...patch } : s)),
    }))
  const move = (i: number, by: number) =>
    setDef((d) => {
      const next = [...d.sections]
      const j = i + by
      if (j < 0 || j >= next.length) return d
      ;[next[i], next[j]] = [next[j], next[i]]
      return { ...d, sections: next }
    })

  async function save() {
    setBusy(true)
    setError(null)
    try {
      const saved = await api<SavedTemplate>(
        `/api/schools/${schoolId}/templates`,
        { body: { action: 'save', key, definition: def } },
      )
      await navigate({
        to: '/school/$schoolId/papers/check',
        params: { schoolId },
        search: { key: saved.key },
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  if (!loaded)
    return error ? (
      <Notice kind="error">{error}</Notice>
    ) : (
      <p className="text-base text-slate-700">Loading…</p>
    )

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">
        {key ? 'Change layout' : 'Make a layout'}
      </h1>

      <Card className="space-y-4">
        <TextInput
          label="Name"
          value={def.name}
          onChange={(e) => setDef({ ...def, name: e.target.value })}
          placeholder="For example Half-yearly, 80 marks"
        />
        <div className="grid grid-cols-2 gap-3">
          <TextInput
            label="Total marks"
            type="number"
            inputMode="numeric"
            value={show(def.totalMarks)}
            onChange={(e) =>
              setDef({ ...def, totalMarks: num(e.target.value) })
            }
          />
          <TextInput
            label="Time (minutes)"
            type="number"
            inputMode="numeric"
            value={show(def.durationMin)}
            onChange={(e) =>
              setDef({ ...def, durationMin: num(e.target.value) })
            }
          />
        </div>
      </Card>

      <h2 className="text-lg font-bold">Sections</h2>
      {def.sections.map((s, i) => {
        const written = s.kind !== 'mcq' && s.kind !== 'assertion_reason'
        return (
          <Card key={i} className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <b className="text-base">Row {i + 1}</b>
              <span className="text-base text-slate-700">
                {s.count * s.marks || 0} marks
                {s.orCount ? ` · ${s.count + s.orCount} questions printed` : ''}
              </span>
            </div>
            <TextInput
              label="Heading on the paper"
              value={s.name}
              onChange={(e) => setSection(i, { name: e.target.value })}
            />
            <Select
              label="Kind of question"
              value={s.kind}
              onChange={(e) => {
                const kind = e.target.value as SectionKind
                setSection(i, {
                  kind,
                  orCount:
                    kind === 'mcq' || kind === 'assertion_reason'
                      ? 0
                      : s.orCount,
                })
              }}
            >
              {SECTION_KINDS.map((k) => (
                <option key={k} value={k}>
                  {KIND_LABEL[k]}
                </option>
              ))}
            </Select>
            <div className="grid grid-cols-2 gap-3">
              <TextInput
                label="How many questions"
                type="number"
                inputMode="numeric"
                value={show(s.count)}
                onChange={(e) => setSection(i, { count: num(e.target.value) })}
              />
              <TextInput
                label="Marks for each"
                type="number"
                inputMode="numeric"
                value={show(s.marks)}
                onChange={(e) => setSection(i, { marks: num(e.target.value) })}
              />
            </div>
            {written ? (
              <TextInput
                label="Questions with a choice (OR)"
                hint="For each one, the student picks one of two questions."
                type="number"
                inputMode="numeric"
                value={show(s.orCount)}
                onChange={(e) =>
                  setSection(i, { orCount: num(e.target.value) })
                }
              />
            ) : null}
            <div className="grid grid-cols-3 gap-2">
              <Btn
                kind="plain"
                disabled={i === 0}
                onClick={() => move(i, -1)}
                aria-label={`Move row ${i + 1} up`}
              >
                Up
              </Btn>
              <Btn
                kind="plain"
                disabled={i === def.sections.length - 1}
                onClick={() => move(i, 1)}
                aria-label={`Move row ${i + 1} down`}
              >
                Down
              </Btn>
              <Btn
                kind="danger"
                onClick={() =>
                  setDef({
                    ...def,
                    sections: def.sections.filter((_, j) => j !== i),
                  })
                }
                aria-label={`Remove row ${i + 1}`}
              >
                Remove
              </Btn>
            </div>
          </Card>
        )
      })}
      <Btn
        kind="plain"
        className="w-full"
        disabled={def.sections.length >= 12}
        onClick={() =>
          setDef({
            ...def,
            sections: [
              ...def.sections,
              {
                name: `Section ${String.fromCharCode(65 + def.sections.length)}`,
                kind: 'short_answer',
                count: 1,
                marks: 2,
                orCount: 0,
              },
            ],
          })
        }
      >
        Add a row
      </Btn>

      <Card className="space-y-3">
        <h2 className="text-lg font-bold">How much thinking</h2>
        <p className="text-base text-slate-700">
          What share of the marks should come from each kind of thinking? It
          must add up to 100.
        </p>
        <TextInput
          label="Remembering and understanding (%)"
          type="number"
          inputMode="numeric"
          value={show(def.levelMix.recall_understanding)}
          onChange={(e) =>
            setDef({
              ...def,
              levelMix: {
                ...def.levelMix,
                recall_understanding: num(e.target.value),
              },
            })
          }
        />
        <TextInput
          label="Using what you know (%)"
          type="number"
          inputMode="numeric"
          value={show(def.levelMix.application)}
          onChange={(e) =>
            setDef({
              ...def,
              levelMix: { ...def.levelMix, application: num(e.target.value) },
            })
          }
        />
        <TextInput
          label="Thinking deeper (%)"
          type="number"
          inputMode="numeric"
          value={show(def.levelMix.analysis_evaluation)}
          onChange={(e) =>
            setDef({
              ...def,
              levelMix: {
                ...def.levelMix,
                analysis_evaluation: num(e.target.value),
              },
            })
          }
        />
        <p
          className={`text-base font-semibold ${mixSum === 100 ? 'text-emerald-800' : 'text-amber-800'}`}
        >
          Adds up to {Number.isNaN(mixSum) ? '…' : mixSum}
        </p>
      </Card>

      <Card
        className={`space-y-2 ${problems.length === 0 ? 'border-emerald-400' : 'border-amber-500'}`}
      >
        <p className="text-lg font-bold" aria-live="polite">
          {problems.length === 0
            ? `Ready: ${sum} marks`
            : `The rows add up to ${Number.isNaN(sum) ? '…' : sum} marks`}
        </p>
        {problems.length > 0 ? (
          <ul className="list-disc space-y-1 pl-5 text-base text-amber-950">
            {problems.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        ) : null}
      </Card>

      {error ? <Notice kind="error">{error}</Notice> : null}
      <Btn
        className="w-full"
        disabled={busy || problems.length > 0}
        onClick={save}
      >
        {busy ? 'Saving…' : 'Save layout'}
      </Btn>
      <Btn
        kind="plain"
        className="w-full"
        onClick={() =>
          navigate({ to: '/school/$schoolId/papers', params: { schoolId } })
        }
      >
        Cancel
      </Btn>
    </div>
  )
}
