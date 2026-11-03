import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Plus, UserRound } from 'lucide-react'
import { useSchool } from '../../../components/school/context'
import { DataTable, Drawer, useShell } from '../../../components/school/kit'
import { UploadPanel } from '../../../components/school/upload-panel'
import { Btn, Chip, Dialog, EmptyState, Notice, PageHeader } from '../../../components/school/ui'
import { api, printCodeSlip } from '../../../lib/school-client'
import { formatDate } from '../../../lib/dates'

export const Route = createFileRoute('/school/$schoolId/teachers')({
  component: Teachers,
})

interface SlipResult {
  delivery: 'slip'
  code: string
  email: string
  expiresAt: string
}
interface EmailResult {
  delivery: 'email'
  emailStatus: 'sent' | 'skipped' | 'failed'
}

function Teachers() {
  const { overview, schoolId, reload } = useSchool()
  const [adding, setAdding] = useState(false)
  const [slip, setSlip] = useState<{ name: string; result: SlipResult } | null>(
    null,
  )
  const [message, setMessage] = useState<{
    kind: 'error' | 'good'
    text: string
  } | null>(null)
  const { toast } = useShell()
  const staff = overview.teachers
  const year = overview.classes[0]?.academicYear ?? '2026-27'

  async function issue(
    memberId: string,
    name: string,
    delivery: 'email' | 'slip',
  ) {
    setMessage(null)
    try {
      const r = await api<SlipResult | EmailResult>(
        `/api/schools/${schoolId}/credentials/staff`,
        { body: { member_id: memberId, delivery } },
      )
      if (r.delivery === 'slip') setSlip({ name, result: r })
      else if (r.emailStatus === 'sent')
        setMessage({
          kind: 'good',
          text: `We emailed a sign-in link to ${name}. It works once and lasts 7 days.`,
        })
      else
        setMessage({
          kind: 'error',
          text: `We could not send the email to ${name}. Print a code for them instead.`,
        })
    } catch (e) {
      setMessage({
        kind: 'error',
        text: e instanceof Error ? e.message : 'Something went wrong.',
      })
    }
  }

  // what each person teaches, from the assignments ("7A Maths")
  const teaches = (memberId: string) =>
    overview.assignments
      .filter((a) => a.memberId === memberId)
      .map((a) => {
        const c = overview.classes.find((x) => x.sections.some((sec) => sec.id === a.sectionId))
        const sec = c?.sections.find((x) => x.id === a.sectionId)
        const sub = c?.subjects.find((x) => x.id === a.schoolSubjectId)
        return c && sec ? `${c.grade}${sec.name} ${sub?.name ?? ''}`.trim() : null
      })
      .filter((x): x is string => x !== null)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Teachers"
        help="Everyone on your staff, what they teach, and whether they can sign in."
        primary={
          <Btn onClick={() => setAdding(true)}>
            <Plus aria-hidden="true" className="size-5" />
            Add teachers from a file
          </Btn>
        }
      />
      {message ? <Notice kind={message.kind}>{message.text}</Notice> : null}
      <DataTable
        testId="teachers-table"
        rows={staff}
        rowKey={(t) => t.memberId}
        search={(t) => `${t.name} ${t.email} ${teaches(t.memberId).join(' ')}`}
        searchLabel="Search by name, email or class"
        empty={
          <EmptyState
            icon={<UserRound className="size-6" />}
            title="No teachers yet"
            action={
              <Btn onClick={() => setAdding(true)}>
                <Plus aria-hidden="true" className="size-5" />
                Upload your Excel list
              </Btn>
            }
            extra={
              <a href={`/api/schools/${schoolId}/roster-template?kind=teachers`} className="font-semibold text-emerald-800 underline">
                Download the Excel template
              </a>
            }
          >
            Add all your teachers at once, with the classes each one teaches.
          </EmptyState>
        }
        columns={[
          {
            key: 'name',
            header: 'Name',
            cell: (t) => (
              <span className="flex flex-wrap items-center gap-2">
                <span className="font-semibold">{t.name}</span>
                {t.role === 'school_admin' ? <Chip>School office</Chip> : null}
              </span>
            ),
          },
          { key: 'email', header: 'Email', cell: (t) => <span className="break-all">{t.email}</span> },
          {
            key: 'teaches',
            header: 'Teaches',
            hideOnPhone: true,
            cell: (t) => {
              const list = teaches(t.memberId)
              return list.length ? list.join('; ') : <span className="text-slate-600">Nothing yet</span>
            },
          },
          {
            key: 'status',
            header: 'Sign-in',
            cell: (t) => <Chip tone={t.hasPassword ? 'good' : 'wait'}>{t.hasPassword ? 'Can sign in' : 'Not set up yet'}</Chip>,
          },
          {
            key: 'actions',
            header: <span className="sr-only">Actions</span>,
            className: 'text-right',
            cell: (t) => (
              <span className="flex flex-wrap justify-end gap-2">
                <Btn kind="plain"  onClick={() => void issue(t.memberId, t.name, 'email')}>
                  {t.hasPassword ? 'Email a new sign-in link' : 'Email a sign-in link'}
                </Btn>
                <Btn kind="plain"  onClick={() => void issue(t.memberId, t.name, 'slip')}>
                  Print a code instead
                </Btn>
              </span>
            ),
          },
        ]}
      />
      <Drawer
        open={adding}
        title="Add teachers from a file"
        help="Upload your Excel or CSV list. We check it first and show any mistakes before anything is added."
        onClose={() => setAdding(false)}
        testId="add-teachers-drawer"
      >
        <UploadPanel
          schoolId={schoolId}
          kind="teachers"
          defaultYear={year}
          onDone={() => {
            toast('Teachers added')
            void reload()
          }}
          onCancel={() => setAdding(false)}
          bare
        />
      </Drawer>
      {slip ? (
        <Dialog title={`Code for ${slip.name}`} onClose={() => setSlip(null)}>
          <p className="text-base">
            Give this to {slip.name} on paper. It works once and stops working
            on {formatDate(slip.result.expiresAt)}.
          </p>
          <p
            className="my-4 rounded-lg bg-slate-100 p-4 text-center font-mono text-3xl font-bold tracking-widest"
            aria-label="Code"
          >
            {slip.result.code}
          </p>
          <p className="text-base">
            They open <b>Set up your sign-in</b> on the school sign-in page and
            enter their email (<b className="break-all">{slip.result.email}</b>)
            and this code.
          </p>
          <Btn
            kind="plain"
            className="mt-3 w-full"
            onClick={() =>
              printCodeSlip(
                [
                  ['Email', slip.result.email],
                  ['One-time code', slip.result.code],
                ],
                `Sign-in code for ${slip.name}`,
              )
            }
          >
            Print this
          </Btn>
        </Dialog>
      ) : null}
    </div>
  )
}
