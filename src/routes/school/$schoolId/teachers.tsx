import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useSchool } from '../../../components/school/context'
import { UploadPanel } from '../../../components/school/upload-panel'
import { Btn, Card, Chip, Dialog, Notice } from '../../../components/school/ui'
import { api, printCodeSlip } from '../../../lib/school-client'

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

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Teachers</h1>
      {message ? <Notice kind={message.kind}>{message.text}</Notice> : null}
      {adding ? (
        <UploadPanel
          schoolId={schoolId}
          kind="teachers"
          defaultYear={year}
          onDone={() => void reload()}
          onCancel={() => setAdding(false)}
        />
      ) : (
        <Btn className="w-full" onClick={() => setAdding(true)}>
          Add teachers from a file
        </Btn>
      )}
      {staff.length === 0 ? <Notice>No teachers yet.</Notice> : null}
      <ul className="space-y-3">
        {staff.map((t) => (
          <li key={t.memberId}>
            <Card className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <b className="text-lg">{t.name}</b>
                {t.role === 'school_admin' ? <Chip>School office</Chip> : null}
                <Chip tone={t.hasPassword ? 'good' : 'wait'}>
                  {t.hasPassword ? 'Can sign in' : 'Not set up yet'}
                </Chip>
              </div>
              <p className="text-base break-all text-slate-700">{t.email}</p>
              <div className="grid gap-2 sm:grid-cols-2">
                <Btn
                  kind="plain"
                  onClick={() => issue(t.memberId, t.name, 'email')}
                >
                  {t.hasPassword
                    ? 'Email a new sign-in link'
                    : 'Email a sign-in link'}
                </Btn>
                <Btn
                  kind="plain"
                  onClick={() => issue(t.memberId, t.name, 'slip')}
                >
                  Print a code instead
                </Btn>
              </div>
            </Card>
          </li>
        ))}
      </ul>
      {slip ? (
        <Dialog title={`Code for ${slip.name}`} onClose={() => setSlip(null)}>
          <p className="text-base">
            Give this to {slip.name} on paper. It works once and stops working
            on {slip.result.expiresAt.slice(0, 10)}.
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
