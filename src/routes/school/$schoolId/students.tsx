import { useCallback, useEffect, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { Plus, Printer, Users } from 'lucide-react'
import { useSchool } from '../../../components/school/context'
import { DataTable, Drawer, InfoTip, useShell } from '../../../components/school/kit'
import { UploadPanel } from '../../../components/school/upload-panel'
import {
  Btn,
  Chip,
  Dialog,
  EmptyState,
  Loading,
  Notice,
  PageHeader,
  Select,
  linkButton,
} from '../../../components/school/ui'
import { api, printCodeSlip } from '../../../lib/school-client'

export const Route = createFileRoute('/school/$schoolId/students')({
  validateSearch: (s: Record<string, unknown>) => ({
    section: typeof s.section === 'string' ? s.section : undefined,
  }),
  component: Students,
})

interface StudentRow {
  schoolStudentId: string
  name: string
  rollNo: string
  admissionNo: string
  signedUp: boolean
}
interface Slip {
  name: string
  loginId: string
  code: string
  expiresAt: string
}

function Students() {
  const { overview, schoolId, reload } = useSchool()
  const search = Route.useSearch()
  const sections = overview.classes.flatMap((c) =>
    c.sections.map((s) => ({
      id: s.id,
      label: `Class ${c.grade} · Section ${s.name}`,
      classTeacherMemberId: s.classTeacherMemberId,
    })),
  )
  const [sectionId, setSectionId] = useState(
    search.section ?? (sections.length > 0 ? sections[0].id : ''),
  )
  const [rows, setRows] = useState<Array<StudentRow> | null>(null)
  const [message, setMessage] = useState<{
    kind: 'error' | 'good'
    text: string
  } | null>(null)
  const [adding, setAdding] = useState(false)
  const [shown, setShown] = useState<Slip | null>(null)
  const { confirm, toast } = useShell()
  const isAdmin = overview.role === 'school_admin'
  const current = sections.find((s) => s.id === sectionId)
  const mayHandle =
    isAdmin ||
    (overview.role === 'teacher' &&
      !!current &&
      current.classTeacherMemberId === overview.me.memberId)
  const year = overview.classes[0]?.academicYear ?? '2026-27'

  const load = useCallback(async () => {
    if (!sectionId) return setRows([])
    try {
      setRows(
        (
          await api<{ students: Array<StudentRow> }>(
            `/api/schools/${schoolId}/sections/${sectionId}/students`,
          )
        ).students,
      )
    } catch (e) {
      setRows([])
      setMessage({
        kind: 'error',
        text: e instanceof Error ? e.message : 'Something went wrong.',
      })
    }
  }, [schoolId, sectionId])
  useEffect(() => {
    void load()
  }, [load])

  async function printSlips() {
    setMessage(null)
    try {
      const res = await fetch(`/api/schools/${schoolId}/credentials/students`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ section_id: sectionId, format: 'pdf' }),
      })
      if (!res.ok)
        throw new Error(
          (await res.json().catch(() => ({ message: '' }))).message ||
            'We could not make the slips.',
        )
      window.open(URL.createObjectURL(await res.blob()), '_blank')
      setMessage({
        kind: 'good',
        text: 'Your slips are ready. Print them and cut along the dotted lines. Older unused codes no longer work.',
      })
      await load()
    } catch (e) {
      setMessage({
        kind: 'error',
        text: e instanceof Error ? e.message : 'Something went wrong.',
      })
    }
  }

  async function askReset(row: StudentRow) {
    if (
      await confirm({
        title: `New password code for ${row.name}?`,
        body: 'Her old password will stop working straight away and she will be signed out. She will choose a new password with the code.',
        confirmLabel: 'Yes, give a new code',
        danger: true,
      })
    )
      await reset(row)
  }

  async function reset(row: StudentRow) {
    setMessage(null)
    try {
      const r = await api<{
        slip: { name: string; loginId: string; code: string; expiresAt: string }
      }>(
        `/api/schools/${schoolId}/students/${row.schoolStudentId}/reset-password`,
        { method: 'POST', body: {} },
      )
      setShown(r.slip)
      await load()
    } catch (e) {
      setMessage({
        kind: 'error',
        text: e instanceof Error ? e.message : 'Something went wrong.',
      })
    }
  }

  if (sections.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title="Students" help="Everyone in each class, and whether they have signed in." />
        <EmptyState
          icon={<Users className="size-6" />}
          title={isAdmin ? 'No classes yet' : 'You have no classes yet'}
          action={
            isAdmin ? (
              <Link to="/school/$schoolId/classes" params={{ schoolId }} className={linkButton.primary}>
                Add a class first
              </Link>
            ) : undefined
          }
        >
          {isAdmin ? 'Students are added to a class and section. Add a class and a section first.' : 'The school office will add you to your classes.'}
        </EmptyState>
      </div>
    )
  }

  const templateLink = isAdmin ? (
    <a href={`/api/schools/${schoolId}/roster-template?kind=students`} className="font-semibold text-emerald-800 underline">
      Download the Excel template
    </a>
  ) : null
  const filter = (
    <div className="w-full sm:w-72">
      <Select label="Class" value={sectionId} onChange={(e) => setSectionId(e.target.value)}>
        {sections.map((s) => (
          <option key={s.id} value={s.id}>
            {s.label}
          </option>
        ))}
      </Select>
    </div>
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Students"
        help="Everyone in each class, and whether they have signed in. Pick a class to see its students."
        actions={
          mayHandle ? (
            <Btn kind="plain" disabled={!rows?.some((r) => !r.signedUp)} onClick={printSlips}>
              <Printer aria-hidden="true" className="size-5" />
              Print sign-in slips for students who have not signed in
            </Btn>
          ) : null
        }
        primary={
          isAdmin ? (
            <Btn onClick={() => setAdding(true)}>
              <Plus aria-hidden="true" className="size-5" />
              Add students from a file
            </Btn>
          ) : null
        }
      />
      {message ? <Notice kind={message.kind}>{message.text}</Notice> : null}

      {rows === null ? (
        <Loading />
      ) : (
        <DataTable
          testId="students-table"
          rows={rows}
          rowKey={(r) => r.schoolStudentId}
          search={(r) => `${r.name} ${r.admissionNo} ${r.rollNo}`}
          searchLabel="Search by name, ID or roll number"
          filters={filter}
          empty={
            <div className="space-y-4">
              {filter}
              <EmptyState
                icon={<Users className="size-6" />}
                title="No students in this class yet"
                action={
                  isAdmin ? (
                    <Btn onClick={() => setAdding(true)}>
                      <Plus aria-hidden="true" className="size-5" />
                      Upload your Excel list
                    </Btn>
                  ) : undefined
                }
                extra={templateLink}
              >
                {isAdmin ? 'Add the whole class at once from an Excel or CSV list.' : 'The school office adds students.'}
              </EmptyState>
            </div>
          }
          columns={[
            { key: 'name', header: 'Name', cell: (r) => <span className="font-semibold">{r.name}</span> },
            { key: 'id', header: 'ID', cell: (r) => <span className="break-all">{r.admissionNo}</span> },
            { key: 'roll', header: 'Roll', cell: (r) => r.rollNo },
            {
              key: 'signed',
              header: (
                <span className="inline-flex items-center gap-0.5">
                  Sign-in
                  <InfoTip>Whether the student has set her own password with the code from her sign-in slip.</InfoTip>
                </span>
              ),
              cell: (r) => <Chip tone={r.signedUp ? 'good' : 'wait'}>{r.signedUp ? 'Has signed in' : 'Not signed in yet'}</Chip>,
            },
            ...(mayHandle
              ? [
                  {
                    key: 'code',
                    header: <span className="sr-only">Actions</span>,
                    className: 'text-right',
                    cell: (r: StudentRow) => (
                      <Btn kind="plain"  onClick={() => void askReset(r)}>
                        Give a new password code
                      </Btn>
                    ),
                  },
                ]
              : []),
          ]}
        />
      )}

      <Drawer
        open={adding}
        title="Add students from a file"
        help="Upload your Excel or CSV list. We check it first and show any mistakes before anything is added."
        onClose={() => setAdding(false)}
        testId="add-students-drawer"
      >
        <UploadPanel
          schoolId={schoolId}
          kind="students"
          defaultYear={year}
          onDone={() => {
            toast('Students added')
            void Promise.all([load(), reload()])
          }}
          onCancel={() => setAdding(false)}
          bare
        />
      </Drawer>

      {shown ? (
        <Dialog title={`Code for ${shown.name}`} onClose={() => setShown(null)}>
          <p className="text-base">
            Give this to {shown.name} on paper. It works once and stops working
            on {shown.expiresAt.slice(0, 10)}.
          </p>
          <p className="my-3 text-base">
            Her ID: <b>{shown.loginId}</b>
          </p>
          <p className="my-3 rounded-lg bg-slate-100 p-4 text-center font-mono text-3xl font-bold tracking-widest">
            {shown.code}
          </p>
          <Btn
            kind="plain"
            className="w-full"
            onClick={() =>
              printCodeSlip(
                [
                  ['ID', shown.loginId],
                  ['One-time code', shown.code],
                ],
                `Sign-in code for ${shown.name}`,
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
