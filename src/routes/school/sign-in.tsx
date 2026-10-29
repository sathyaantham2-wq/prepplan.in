import { useState } from 'react'
import { AuthShell } from '../../components/school/auth-shell'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { Btn, Card, Notice, TextInput } from '../../components/school/ui'
import { GoogleSchoolButton } from '../../components/school/google-button'
import { signIn } from '../../lib/auth-client'
import { api } from '../../lib/school-client'

export const Route = createFileRoute('/school/sign-in')({
  component: SchoolSignIn,
})

function SchoolSignIn() {
  const navigate = useNavigate()
  const [who, setWho] = useState<'student' | 'staff'>('student')
  const [schoolCode, setSchoolCode] = useState('')
  const [studentId, setStudentId] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      if (who === 'student') {
        await api('/api/school-login', {
          body: { school_code: schoolCode, login_id: studentId, password },
        })
      } else {
        const res = await signIn.email({ email, password })
        if (res.error) throw new Error('That email or password is not right.')
      }
      await navigate({ to: '/school' })
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'We could not sign you in. Please try again.',
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthShell title="Sign in to your school">
      <div
        className="mb-4 grid grid-cols-2 gap-1 rounded-2xl bg-slate-200/70 p-1"
        role="tablist"
        aria-label="Who is signing in"
      >
        {(['student', 'staff'] as const).map((w) => (
          <button
            key={w}
            type="button"
            role="tab"
            aria-selected={who === w}
            onClick={() => {
              setWho(w)
              setError(null)
            }}
            className={`min-h-12 rounded-xl px-3 text-[15px] font-semibold transition-all ${
              who === w
                ? 'bg-white text-emerald-800 shadow-sm ring-1 ring-slate-900/5'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {w === 'student' ? 'I am a student' : 'Teacher or school office'}
          </button>
        ))}
      </div>

      <Card>
        <form onSubmit={submit} className="space-y-4" noValidate>
          {who === 'student' ? (
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
                hint="It is printed on your slip. It stays the same every year."
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                autoCapitalize="characters"
                autoComplete="username"
                required
              />
            </>
          ) : (
            <TextInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          )}
          <TextInput
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          {error ? <Notice kind="error">{error}</Notice> : null}
          <Btn type="submit" className="w-full" disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in'}
          </Btn>
        </form>
        {who === 'staff' ? (
          <div className="mt-4 space-y-2">
            <p className="text-center text-base text-slate-600">or</p>
            <GoogleSchoolButton label="Sign in with Google" />
          </div>
        ) : null}
      </Card>

      <p className="mt-5 text-base">
        First time here?{' '}
        <Link
          to="/school/set-password"
          search={{ token: undefined }}
          className="font-semibold text-emerald-800 underline"
        >
          Set up your sign-in
        </Link>
      </p>
      <p className="mt-3 text-base">
        Starting a new school?{' '}
        <Link
          to="/school/sign-up"
          className="font-semibold text-emerald-800 underline"
        >
          Create your school account
        </Link>
      </p>
      <p className="mt-3 text-sm text-slate-600">
        Forgot your password? Students: ask your class teacher. Teachers: ask
        the school office.
      </p>
    </AuthShell>
  )
}
