import { useCallback, useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { FileQuestion, Plus } from 'lucide-react'
import { useSchool } from '../../../components/school/context'
import { DataTable, Switch, useShell } from '../../../components/school/kit'
import { KINDS, OwnQuestionForm } from '../../../components/school/own-question-form'
import type { Choices, OwnQuestion } from '../../../components/school/own-question-form'
import { Btn, Chip, EmptyState, Loading, Notice, PageHeader, Select } from '../../../components/school/ui'
import { api } from '../../../lib/school-client'
import { formatDate } from '../../../lib/dates'

// "Our questions" (docs/SCHOOLS_MODULE_PLAN.md section 16.13): the questions the school's teachers write. Only this school
// sees them; in Make paper they sit in the question bank with an "Our question" badge.
export const Route = createFileRoute('/school/$schoolId/questions')({
  component: OurQuestions,
})

interface Row extends OwnQuestion {
  subject: string
  chapter: string
  topic: string
  level: string
  author: string
  createdAt: string
  retired: boolean
  onPapers: number
  mayChange: boolean
}

interface ListResponse extends Choices {
  questions: Array<Row>
}

function OurQuestions() {
  const { schoolId } = useSchool()
  const { toast, confirm } = useShell()
  const [data, setData] = useState<ListResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [subjectId, setSubjectId] = useState('')
  const [chapterId, setChapterId] = useState('')
  const [retired, setRetired] = useState(false)
  const [form, setForm] = useState<{ editing: Row | null; key: number } | null>(null)

  const load = useCallback(async () => {
    const q = new URLSearchParams()
    if (subjectId) q.set('subject', subjectId)
    if (chapterId) q.set('chapter', chapterId)
    if (retired) q.set('retired', '1')
    try {
      setData(await api<ListResponse>(`/api/schools/${schoolId}/our-questions?${q.toString()}`))
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    }
  }, [schoolId, subjectId, chapterId, retired])

  useEffect(() => {
    void load()
  }, [load])

  async function retire(r: Row) {
    const ok = await confirm({
      title: 'Retire this question?',
      body: 'It will no longer be offered in Make paper. Papers that already have it keep it, and nothing is deleted.',
      confirmLabel: 'Retire',
      cancelLabel: 'Keep it',
      danger: true,
    })
    if (!ok) return
    try {
      const res = await api<{ message: string }>(`/api/schools/${schoolId}/our-questions/${r.id}`, { body: { action: 'retire' } })
      toast(res.message)
      void load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    }
  }

  if (!data && !error) return <Loading />
  const subject = data?.subjects.find((s) => s.id === subjectId)
  const mayWrite = (data?.mayWrite ?? false) && (data?.subjects.length ?? 0) > 0
  const openNew = () => setForm({ editing: null, key: Date.now() })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Our questions"
        help="Questions your teachers write. Only your school sees them. In Make paper they appear in the question bank marked “Our question”."
        primary={
          mayWrite ? (
            <Btn onClick={openNew}>
              <Plus aria-hidden="true" className="size-5" />
              Write a question
            </Btn>
          ) : undefined
        }
      />
      {error ? <Notice kind="error">{error}</Notice> : null}
      {data && data.subjects.length === 0 ? (
        <Notice kind="info">You do not teach a subject here yet. The school office assigns subjects on the Teachers page.</Notice>
      ) : null}
      {data ? (
        <DataTable
          testId="our-questions-table"
          rows={data.questions}
          rowKey={(r) => r.id}
          search={(r) => `${r.text} ${r.chapter} ${r.topic} ${r.author}`}
          searchLabel="Search the questions"
          filters={
            <div className="flex flex-wrap items-end gap-3">
              <div className="w-56">
                <Select label="Class and subject" value={subjectId} onChange={(e) => { setSubjectId(e.target.value); setChapterId('') }}>
                  <option value="">All</option>
                  {data.subjects.map((s) => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </Select>
              </div>
              <div className="w-64">
                <Select label="Chapter" value={chapterId} disabled={!subject} onChange={(e) => setChapterId(e.target.value)}>
                  <option value="">{subject ? 'All chapters' : 'Choose a subject first'}</option>
                  {subject?.chapters.map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </Select>
              </div>
              <Switch label="Show retired" checked={retired} onChange={setRetired} />
            </div>
          }
          empty={
            <EmptyState
              icon={<FileQuestion className="size-6" />}
              title={retired ? 'No retired questions' : 'No questions yet'}
              action={
                mayWrite && !retired ? (
                  <Btn onClick={openNew}>
                    <Plus aria-hidden="true" className="size-5" />
                    Write your first question
                  </Btn>
                ) : undefined
              }
            >
              Write a question once and use it in any paper of that class. The AI suggests the chapter and level for you.
            </EmptyState>
          }
          columns={[
            {
              key: 'text',
              header: 'Question',
              cell: (r) => (
                <div className="space-y-1.5">
                  <p className="font-medium text-slate-900">{r.text}</p>
                  <span className="flex flex-wrap gap-1.5">
                    <Chip>{KINDS.find((k) => k.value === r.type)?.label ?? r.type}</Chip>
                    <Chip>{r.marks} mark{r.marks === 1 ? '' : 's'}</Chip>
                    <Chip>{r.bloom}</Chip>
                    <Chip>{r.difficulty}</Chip>
                    {r.retired ? <Chip tone="wait">Retired</Chip> : null}
                  </span>
                </div>
              ),
            },
            {
              key: 'where',
              header: 'Chapter and topic',
              cell: (r) => (
                <span className="text-sm">
                  <span className="block font-semibold">{r.subject}</span>
                  {r.chapter}
                  <span className="block text-slate-600">{r.topic}</span>
                </span>
              ),
            },
            {
              key: 'who',
              header: 'Written by',
              hideOnPhone: true,
              cell: (r) => (
                <span className="text-sm">
                  {r.author}
                  <span className="block text-slate-600">{formatDate(r.createdAt)}</span>
                </span>
              ),
            },
            {
              key: 'used',
              header: 'On papers',
              hideOnPhone: true,
              cell: (r) => (r.onPapers ? `${r.onPapers} paper${r.onPapers === 1 ? '' : 's'}` : <span className="text-slate-600">Not yet</span>),
            },
            {
              key: 'actions',
              header: <span className="sr-only">Actions</span>,
              className: 'text-right',
              cell: (r) =>
                r.mayChange ? (
                  <span className="flex flex-wrap justify-end gap-2">
                    <Btn kind="plain" onClick={() => setForm({ editing: r, key: Date.now() })}>
                      Change
                    </Btn>
                    <Btn kind="plain" onClick={() => void retire(r)}>
                      Retire
                    </Btn>
                  </span>
                ) : null,
            },
          ]}
        />
      ) : null}
      {data && form ? (
        <OwnQuestionForm
          key={form.key}
          schoolId={schoolId}
          choices={data}
          editing={form.editing}
          open
          onClose={() => setForm(null)}
          onSaved={() => {
            setForm(null)
            void load()
          }}
        />
      ) : null}
    </div>
  )
}
