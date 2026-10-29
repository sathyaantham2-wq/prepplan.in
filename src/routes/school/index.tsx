import { useEffect, useState } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { Btn, Card, Notice, TextInput  } from '../../components/school/ui'
import { signOut } from '../../lib/auth-client'
import { ROLE_LABEL, api } from '../../lib/school-client'
import type { MeResponse } from '../../lib/school-client'

export const Route = createFileRoute('/school/')({ component: SchoolStart })

// After sign-in: straight into the person's school; a choice only if they belong to several.
function SchoolStart() {
  const navigate = useNavigate()
  const [me, setMe] = useState<MeResponse | null>(null)
  const [schoolName, setSchoolName] = useState('')
  const [city, setCity] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    api<MeResponse>('/api/school-me')
      .then(async (m) => {
        if (m.schools.length === 1)
          await navigate({
            to: '/school/$schoolId',
            params: { schoolId: m.schools[0].id },
            replace: true,
          })
        else setMe(m)
      })
      .catch(async () => {
        await navigate({ to: '/school/sign-in', replace: true })
      })
  }, [navigate])

  async function createSchool(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      const r = await api<{ schoolId: string }>('/api/school-signup/create', {
        body: { school_name: schoolName, city },
      })
      await navigate({
        to: '/school/$schoolId',
        params: { schoolId: r.schoolId },
        replace: true,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setBusy(false)
    }
  }

  async function leave() {
    await signOut()
    await navigate({ to: '/school/sign-in' })
  }

  if (!me) return <p className="p-6 text-base text-slate-700">Loading…</p>
  return (
    <main className="mx-auto w-full max-w-md px-4 py-8">
      <h1 className="mb-4 text-3xl font-bold">Hello, {me.name}</h1>
      {me.schools.length === 0 && me.start === 'can_create' ? (
        <Card>
          <form onSubmit={createSchool} className="space-y-4" noValidate>
            <h2 className="text-xl font-bold">What is your school called?</h2>
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
            />
            {error ? <Notice kind="error">{error}</Notice> : null}
            <Btn type="submit" className="w-full" disabled={busy}>
              {busy ? 'Making your school…' : 'Create my school'}
            </Btn>
          </form>
        </Card>
      ) : me.schools.length === 0 && me.start === 'personal_account' ? (
        <Notice kind="error">
          This sign-in is a PrepPlan student or parent account, and a school
          needs its own sign-in. Sign out, then use a different Google account
          or e-mail.
        </Notice>
      ) : me.schools.length === 0 ? (
        <Notice>
          This sign-in is not part of any school. Ask your school office to add
          you.
        </Notice>
      ) : (
        <div className="space-y-3">
          <p className="text-base">Choose your school:</p>
          {me.schools.map((s) => (
            <Link
              key={s.id + s.role}
              to="/school/$schoolId"
              params={{ schoolId: s.id }}
              className="block"
            >
              <Card>
                <b className="text-lg">{s.name}</b>
                <p className="text-base text-slate-700">
                  {ROLE_LABEL[s.role] ?? s.role}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}
      <Btn kind="plain" className="mt-6 w-full" onClick={leave}>
        Sign out
      </Btn>
    </main>
  )
}
