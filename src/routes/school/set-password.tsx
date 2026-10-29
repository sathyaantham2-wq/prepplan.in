import { useEffect, useState } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { Btn, Card, Notice, TextInput } from '../../components/school/ui'
import { api } from '../../lib/school-client'

export const Route = createFileRoute('/school/set-password')({
  validateSearch: (s: Record<string, unknown>) => ({
    token: typeof s.token === 'string' ? s.token : undefined,
  }),
  component: SetPassword,
})

type Kind = 'link' | 'student' | 'staff'

function SetPassword() {
  const { token } = Route.useSearch()
  const [kind, setKind] = useState<Kind | null>(token ? 'link' : null)
  useEffect(() => {
    if (token) setKind('link')
  }, [token])

  return (
    <main className="mx-auto w-full max-w-md px-4 py-8">
      <p className="text-sm font-semibold tracking-wide text-emerald-800 uppercase">
        PrepPlan for Schools
      </p>
      <h1 className="mt-1 mb-6 text-3xl font-bold">Set up your sign-in</h1>

      {kind === null ? (
        <div className="space-y-3">
          <p className="text-base text-slate-700">
            How did your school give you your sign-in details?
          </p>
          <ChoiceButton onClick={() => setKind('student')}>
            I am a student and have a code slip
          </ChoiceButton>
          <ChoiceButton onClick={() => setKind('staff')}>
            I am a teacher or office staff and have a code slip
          </ChoiceButton>
          <Card>
            <p className="text-base">
              <b>Got an email from your school?</b> Open the link in that email.
              If it has stopped working, ask the school office for a new one.
            </p>
          </Card>
        </div>
      ) : (
        <>
          <Form kind={kind} token={token} />
          {!token ? (
            <Btn
              kind="plain"
              className="mt-4 w-full"
              onClick={() => setKind(null)}
            >
              Go back
            </Btn>
          ) : null}
        </>
      )}
      <p className="mt-6 text-base">
        Already set up?{' '}
        <Link
          to="/school/sign-in"
          className="font-semibold text-emerald-800 underline"
        >
          Sign in
        </Link>
      </p>
    </main>
  )
}

function ChoiceButton({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="min-h-14 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-left text-base font-semibold hover:bg-slate-50"
    >
      {children}
    </button>
  )
}

function Form({ kind, token }: { kind: Kind; token: string | undefined }) {
  const navigate = useNavigate()
  const [schoolCode, setSchoolCode] = useState('')
  const [studentId, setStudentId] = useState('')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [again, setAgain] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (password.length < 8)
      return setError('Choose a password with at least 8 characters.')
    if (password !== again)
      return setError('The two passwords are not the same.')
    setBusy(true)
    try {
      if (kind === 'student') {
        await api('/api/school-login/activate', {
          body: {
            school_code: schoolCode,
            login_id: studentId,
            code,
            new_password: password,
          },
        })
      } else if (kind === 'link') {
        await api('/api/school-login/activate-staff', {
          body: { token, new_password: password },
        })
      } else {
        await api('/api/school-login/activate-staff', {
          body: { email, code, new_password: password },
        })
      }
      await navigate({ to: '/school' })
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'That did not work. Please try again.',
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card>
      <form onSubmit={submit} className="space-y-4" noValidate>
        {kind === 'link' ? (
          <p className="text-base text-slate-700">
            Choose a password. You will use it every time you sign in.
          </p>
        ) : null}
        {kind === 'student' ? (
          <>
            <TextInput
              label="School code"
              value={schoolCode}
              onChange={(e) => setSchoolCode(e.target.value)}
              autoCapitalize="none"
              autoComplete="off"
              required
            />
            <TextInput
              label="Your ID"
              hint="It is printed on your slip."
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              autoCapitalize="characters"
              autoComplete="off"
              required
            />
          </>
        ) : null}
        {kind === 'staff' ? (
          <TextInput
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
          />
        ) : null}
        {kind !== 'link' ? (
          <TextInput
            label="Code from your slip"
            hint="It works once."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            autoCapitalize="characters"
            autoComplete="off"
            required
          />
        ) : null}
        <TextInput
          label="Choose a password"
          hint="At least 8 characters."
          type={show ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          required
        />
        <TextInput
          label="Type it again"
          type={show ? 'text' : 'password'}
          value={again}
          onChange={(e) => setAgain(e.target.value)}
          autoComplete="new-password"
          required
        />
        <label className="flex min-h-12 items-center gap-3 text-base">
          <input
            type="checkbox"
            className="size-5"
            checked={show}
            onChange={(e) => setShow(e.target.checked)}
          />
          Show my password
        </label>
        {error ? <Notice kind="error">{error}</Notice> : null}
        <Btn type="submit" className="w-full" disabled={busy}>
          {busy ? 'Saving…' : 'Save and continue'}
        </Btn>
      </form>
    </Card>
  )
}
