import { useState } from 'react'
import { AuthShell } from '../../components/school/auth-shell'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { GoogleSchoolButton } from '../../components/school/google-button'
import { Btn, Card, Notice, TextInput } from '../../components/school/ui'
import { ApiError, api } from '../../lib/school-client'

export const Route = createFileRoute('/school/sign-up')({
  component: SchoolSignUp,
})

// A school starts itself. Students and teachers are never made here: the school adds them.
function SchoolSignUp() {
  const navigate = useNavigate()
  const [schoolName, setSchoolName] = useState('')
  const [city, setCity] = useState('')
  const [yourName, setYourName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [website, setWebsite] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      const r = await api<{ schoolId: string }>('/api/school-signup', {
        body: {
          school_name: schoolName,
          city,
          your_name: yourName,
          email,
          password,
          website,
        },
      })
      await navigate({
        to: '/school/$schoolId',
        params: { schoolId: r.schoolId },
      })
    } catch (err) {
      setError(
        err instanceof ApiError || err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.',
      )
      setBusy(false)
    }
  }

  return (
    <AuthShell
      title="Start with your school"
      intro={
        <>
          Make question papers from your syllabus and see how every student did.
          It takes about five minutes.
        </>
      }
    >
      <Card className="space-y-4">
        <GoogleSchoolButton label="Continue with Google" />
        <p className="text-center text-base text-slate-600">
          or use your e-mail
        </p>
        <form onSubmit={submit} className="space-y-4" noValidate>
          <TextInput
            label="School name"
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
            autoComplete="organization"
            required
          />
          <TextInput
            label="Town or city (you can leave this empty)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            autoComplete="address-level2"
          />
          <TextInput
            label="Your name"
            value={yourName}
            onChange={(e) => setYourName(e.target.value)}
            autoComplete="name"
            required
          />
          <TextInput
            label="Your e-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
          />
          <TextInput
            label="Choose a password"
            type="password"
            hint="At least 8 characters."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
          {/* a person never sees or fills this; a robot filling every field does */}
          <div aria-hidden="true" className="hidden">
            <label>
              Website
              <input
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </label>
          </div>
          {error ? <Notice kind="error">{error}</Notice> : null}
          <Btn type="submit" className="w-full" disabled={busy}>
            {busy ? 'Making your school…' : 'Create my school'}
          </Btn>
        </form>
      </Card>
      <p className="mt-5 text-base">
        Already have a school account?{' '}
        <Link
          to="/school/sign-in"
          className="font-semibold text-emerald-800 underline"
        >
          Sign in
        </Link>
      </p>
      <p className="mt-3 text-sm text-slate-600">
        You become the school office. You add your teachers and students
        yourself. Students and teachers cannot sign up on their own.
      </p>
    </AuthShell>
  )
}
