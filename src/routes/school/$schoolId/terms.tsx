import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useSchool } from '../../../components/school/context'
import { Btn, Card, Notice } from '../../../components/school/ui'
import { api } from '../../../lib/school-client'
import { TERMS_DOCUMENT } from '../../../lib/schools/terms-document'

export const Route = createFileRoute('/school/$schoolId/terms')({
  component: Terms,
})

function Terms() {
  const { overview, schoolId, reload } = useSchool()
  const [agree, setAgree] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isAdmin = overview.role === 'school_admin'

  async function accept() {
    setBusy(true)
    setError(null)
    try {
      await api(`/api/schools/${schoolId}/terms/accept`, {
        method: 'POST',
        body: {},
      })
      await reload()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">PrepPlan school terms</h1>
      {overview.termsAccepted ? (
        <Notice kind="good">Your school has accepted the current terms.</Notice>
      ) : null}
      <Card>
        <h2 className="mb-2 text-lg font-bold">
          What this means for your students
        </h2>
        <ul className="list-disc space-y-2 pl-5 text-base">
          <li>
            Student information is used only for your school’s exams and
            reports.
          </li>
          <li>It is never used for advertising, marketing, or to train AI.</li>
          <li>
            Students cannot sign up themselves. Only your school office adds
            them.
          </li>
          <li>Every change to marks and to who can sign in is written down.</li>
          <li>
            Student accounts are never joined to personal PrepPlan accounts.
          </li>
        </ul>
        {TERMS_DOCUMENT ? (
          <a
            className="mt-3 inline-flex min-h-12 items-center font-semibold underline"
            href={TERMS_DOCUMENT.url}
            target="_blank"
            rel="noreferrer"
          >
            {TERMS_DOCUMENT.label}
          </a>
        ) : (
          <div
            className="mt-3 rounded-lg border-2 border-dashed border-amber-500 bg-amber-50 p-3 text-base text-amber-950"
            data-testid="terms-placeholder"
          >
            <b>Placeholder.</b> The full PrepPlan school terms document has not
            been added yet. It will appear here.
          </div>
        )}
      </Card>
      {!overview.termsAccepted ? (
        isAdmin ? (
          <Card className="space-y-4">
            <label className="flex items-start gap-3 text-base">
              <input
                type="checkbox"
                className="mt-1 size-5"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              <span>
                I have read these terms and I can accept them for{' '}
                {overview.school.name}.
              </span>
            </label>
            {error ? <Notice kind="error">{error}</Notice> : null}
            <Btn className="w-full" disabled={!agree || busy} onClick={accept}>
              {busy ? 'Saving…' : 'Accept the terms'}
            </Btn>
          </Card>
        ) : (
          <Notice>
            The school office needs to accept the terms before students can be
            added.
          </Notice>
        )
      ) : null}
    </div>
  )
}
