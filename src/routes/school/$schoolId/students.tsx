import { useCallback, useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useSchool } from '../../../components/school/context'
import { UploadPanel } from '../../../components/school/upload-panel'
import {
  Btn,
  Card,
  Chip,
  Dialog,
  Notice,
  Select,
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
  const [confirmReset, setConfirmReset] = useState<StudentRow | null>(null)
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

  async function reset(row: StudentRow) {
    setConfirmReset(null)
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
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Students</h1>
        <Notice>
          {isAdmin
            ? 'Add a class and a section first (see Classes).'
            : 'You have no classes yet.'}
        </Notice>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Students</h1>
      <Select
        label="Class"
        value={sectionId}
        onChange={(e) => setSectionId(e.target.value)}
      >
        {sections.map((s) => (
          <option key={s.id} value={s.id}>
            {s.label}
          </option>
        ))}
      </Select>
      {message ? <Notice kind={message.kind}>{message.text}</Notice> : null}

      {isAdmin ? (
        adding ? (
          <UploadPanel
            schoolId={schoolId}
            kind="students"
            defaultYear={year}
            onDone={() => void Promise.all([load(), reload()])}
            onCancel={() => setAdding(false)}
          />
        ) : (
          <Btn className="w-full" onClick={() => setAdding(true)}>
            Add students from a file
          </Btn>
        )
      ) : null}
      {mayHandle ? (
        <Btn
          kind="plain"
          className="w-full"
          disabled={!rows?.some((r) => !r.signedUp)}
          onClick={printSlips}
        >
          Print sign-in slips for students who have not signed in
        </Btn>
      ) : null}

      {rows === null ? (
        <p className="text-base text-slate-700">Loading…</p>
      ) : null}
      {rows?.length === 0 ? (
        <Notice>No students in this class yet.</Notice>
      ) : null}
      <ul className="space-y-2">
        {rows?.map((r) => (
          <li key={r.schoolStudentId}>
            <Card className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <b className="text-lg">{r.name}</b>
                <Chip tone={r.signedUp ? 'good' : 'wait'}>
                  {r.signedUp ? 'Has signed in' : 'Not signed in yet'}
                </Chip>
              </div>
              <p className="text-base text-slate-700">
                ID <b className="break-all">{r.admissionNo}</b> · Roll{' '}
                {r.rollNo}
              </p>
              {mayHandle ? (
                <Btn
                  kind="plain"
                  className="w-full"
                  onClick={() => setConfirmReset(r)}
                >
                  Give a new password code
                </Btn>
              ) : null}
            </Card>
          </li>
        ))}
      </ul>

      {confirmReset ? (
        <Dialog
          title={`New password code for ${confirmReset.name}?`}
          onClose={() => setConfirmReset(null)}
        >
          <p className="text-base">
            Her old password will stop working straight away and she will be
            signed out. She will choose a new password with the code.
          </p>
          <Btn
            kind="danger"
            className="mt-3 w-full"
            onClick={() => reset(confirmReset)}
          >
            Yes, give a new code
          </Btn>
        </Dialog>
      ) : null}
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
