import { useCallback, useEffect, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useSchool } from '../../../../components/school/context'
import {
  Btn,
  Card,
  Chip,
  Dialog,
  Notice,
} from '../../../../components/school/ui'
import { api } from '../../../../lib/school-client'
import { KIND_LABEL } from '../../../../lib/schools/templates'
import type { SavedTemplate } from '../../../../lib/schools/template-service'

export const Route = createFileRoute('/school/$schoolId/papers/')({
  component: Papers,
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

function Papers() {
  const { schoolId, overview } = useSchool()
  const navigate = useNavigate()
  const [data, setData] = useState<Listing | null>(null)
  const [message, setMessage] = useState<{
    kind: 'error' | 'good'
    text: string
  } | null>(null)
  const [removing, setRemoving] = useState<SavedTemplate | null>(null)
  const canEdit =
    overview.role === 'school_admin' || overview.role === 'teacher'

  const load = useCallback(async () => {
    try {
      setData(await api<Listing>(`/api/schools/${schoolId}/templates`))
    } catch (e) {
      setMessage({
        kind: 'error',
        text: e instanceof Error ? e.message : 'Something went wrong.',
      })
    }
  }, [schoolId])
  useEffect(() => {
    void load()
  }, [load])

  async function use(key: string) {
    setMessage(null)
    try {
      await api(`/api/schools/${schoolId}/templates`, {
        body: { action: 'adopt_default', default_key: key },
      })
      setMessage({ kind: 'good', text: 'Saved. You can change it any time.' })
      await load()
    } catch (e) {
      setMessage({
        kind: 'error',
        text: e instanceof Error ? e.message : 'Something went wrong.',
      })
    }
  }
  async function remove(t: SavedTemplate) {
    setRemoving(null)
    try {
      await api(`/api/schools/${schoolId}/templates`, {
        body: { action: 'retire', key: t.key },
      })
      await load()
    } catch (e) {
      setMessage({
        kind: 'error',
        text: e instanceof Error ? e.message : 'Something went wrong.',
      })
    }
  }

  if (!data) return <p className="text-base text-slate-700">Loading…</p>
  const noSubjects = data.subjects.length === 0

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Paper layouts</h1>
      <p className="text-base text-slate-700">
        A layout is the pattern of a paper: how many marks, how long, and how
        many questions of each kind.
      </p>
      {message ? <Notice kind={message.kind}>{message.text}</Notice> : null}

      <section className="space-y-3">
        <h2 className="text-lg font-bold">Your school’s layouts</h2>
        {data.templates.length === 0 ? (
          <Notice>
            No layouts yet. Use a ready-made one below, or make your own.
          </Notice>
        ) : null}
        {data.templates.map((t) => (
          <Card key={t.key} className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <b className="text-lg">{t.name}</b>
              <Chip tone="good">{t.totalMarks} marks</Chip>
              <Chip>{t.durationMin} minutes</Chip>
            </div>
            <ul className="space-y-1 text-base text-slate-700">
              {t.sections.map((s, i) => (
                <li key={i}>
                  {s.count} × {s.marks}-mark {KIND_LABEL[s.kind].toLowerCase()}
                  {s.orCount ? ` (${s.orCount} with a choice)` : ''}
                </li>
              ))}
            </ul>
            <div className="grid gap-2 sm:grid-cols-3">
              <Btn
                onClick={() =>
                  navigate({
                    to: '/school/$schoolId/papers/check',
                    params: { schoolId },
                    search: { key: t.key },
                  })
                }
              >
                Check against the bank
              </Btn>
              {canEdit ? (
                <>
                  <Btn
                    kind="plain"
                    onClick={() =>
                      navigate({
                        to: '/school/$schoolId/papers/edit',
                        params: { schoolId },
                        search: { key: t.key },
                      })
                    }
                  >
                    Change
                  </Btn>
                  <Btn kind="danger" onClick={() => setRemoving(t)}>
                    Remove
                  </Btn>
                </>
              ) : null}
            </div>
          </Card>
        ))}
        {canEdit ? (
          <Btn
            className="w-full"
            onClick={() =>
              navigate({
                to: '/school/$schoolId/papers/edit',
                params: { schoolId },
                search: { key: undefined },
              })
            }
          >
            Make your own layout
          </Btn>
        ) : null}
      </section>

      {canEdit ? (
        <section className="space-y-3">
          <h2 className="text-lg font-bold">Ready-made layouts</h2>
          {data.defaults.map((d) => (
            <Card key={d.key} className="space-y-2">
              <b className="text-lg">{d.name}</b>
              <p className="text-base text-slate-700">{d.blurb}</p>
              <Btn kind="plain" className="w-full" onClick={() => use(d.key)}>
                Use this layout
              </Btn>
            </Card>
          ))}
        </section>
      ) : null}
      {noSubjects ? (
        <Notice>
          You can check a layout against the bank once a subject is added to
          your class and you are its teacher.
        </Notice>
      ) : null}

      {removing ? (
        <Dialog
          title={`Remove “${removing.name}”?`}
          onClose={() => setRemoving(null)}
        >
          <p className="text-base">
            It will no longer be offered. Papers already made from it stay as
            they are.
          </p>
          <Btn
            kind="danger"
            className="mt-3 w-full"
            onClick={() => remove(removing)}
          >
            Yes, remove it
          </Btn>
        </Dialog>
      ) : null}
    </div>
  )
}
