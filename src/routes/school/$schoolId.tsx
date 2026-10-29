import { useCallback, useEffect, useState } from 'react'
import {
  Link,
  Outlet,
  createFileRoute,
  useNavigate,
} from '@tanstack/react-router'
import { SchoolContext } from '../../components/school/context'
import { Notice } from '../../components/school/ui'
import { signOut } from '../../lib/auth-client'
import { ApiError, ROLE_LABEL, api } from '../../lib/school-client'
import type { SchoolOverview } from '../../lib/school-client'

export const Route = createFileRoute('/school/$schoolId')({
  component: SchoolLayout,
})

interface NavItem {
  to:
    | '/school/$schoolId'
    | '/school/$schoolId/classes'
    | '/school/$schoolId/teachers'
    | '/school/$schoolId/students'
    | '/school/$schoolId/papers'
    | '/school/$schoolId/exams'
  label: string
}

function navFor(role: SchoolOverview['role']): Array<NavItem> {
  const home: NavItem = { to: '/school/$schoolId', label: 'Home' }
  if (role === 'school_admin') {
    return [
      home,
      { to: '/school/$schoolId/classes', label: 'Classes' },
      { to: '/school/$schoolId/teachers', label: 'Teachers' },
      { to: '/school/$schoolId/students', label: 'Students' },
      { to: '/school/$schoolId/papers', label: 'Papers' },
      { to: '/school/$schoolId/exams', label: 'Exams' },
    ]
  }
  if (role === 'teacher' || role === 'principal')
    return [
      home,
      { to: '/school/$schoolId/students', label: 'Students' },
      { to: '/school/$schoolId/papers', label: 'Papers' },
      { to: '/school/$schoolId/exams', label: 'Exams' },
    ]
  return [home]
}

function SchoolLayout() {
  const { schoolId } = Route.useParams()
  const navigate = useNavigate()
  const [overview, setOverview] = useState<SchoolOverview | null>(null)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    try {
      setOverview(
        await api<SchoolOverview>(`/api/schools/${schoolId}/overview`),
      )
      setError(null)
    } catch (e) {
      if (e instanceof ApiError && e.status === 401)
        await navigate({ to: '/school/sign-in', replace: true })
      else if (e instanceof ApiError && e.status === 404)
        await navigate({ to: '/school', replace: true })
      else setError(e instanceof Error ? e.message : 'Something went wrong.')
    }
  }, [schoolId, navigate])

  useEffect(() => {
    void reload()
  }, [reload])

  async function leave() {
    await signOut()
    await navigate({ to: '/school/sign-in' })
  }

  if (error)
    return (
      <div className="p-4">
        <Notice kind="error">{error}</Notice>
      </div>
    )
  if (!overview) return <p className="p-6 text-base text-slate-700">Loading…</p>
  const items = navFor(overview.role)

  return (
    <SchoolContext.Provider value={{ schoolId, overview, reload }}>
      <header className="sticky top-0 z-20 border-b border-slate-300 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-lg leading-tight font-bold">
              {overview.school.name}
            </p>
            <p className="truncate text-sm text-slate-600">
              {overview.me.name} · {ROLE_LABEL[overview.role] ?? overview.role}
            </p>
          </div>
          <button
            type="button"
            onClick={leave}
            className="min-h-11 shrink-0 rounded-lg border border-slate-300 px-3 text-base font-semibold"
          >
            Sign out
          </button>
        </div>
        {overview.school.isDemo ? (
          <p
            data-testid="demo-banner"
            className="bg-amber-300 px-4 py-1.5 text-center text-sm font-bold tracking-wide text-amber-950"
          >
            DEMO - sample data
          </p>
        ) : null}
        {items.length > 1 ? (
          <nav
            aria-label="School"
            className="mx-auto hidden max-w-3xl gap-1 px-4 pb-2 sm:flex"
          >
            {items.map((i) => (
              <Link
                key={i.to}
                to={i.to}
                params={{ schoolId }}
                activeOptions={{ exact: i.to === '/school/$schoolId' }}
                className="rounded-lg px-4 py-2 text-base font-semibold text-slate-700"
                activeProps={{ className: 'bg-emerald-100 text-emerald-900' }}
              >
                {i.label}
              </Link>
            ))}
          </nav>
        ) : null}
      </header>
      <div className="mx-auto w-full max-w-3xl px-4 pt-5 pb-28 sm:pb-10">
        <Outlet />
      </div>
      {items.length > 1 ? (
        <nav
          aria-label="School"
          className="fixed inset-x-0 bottom-0 z-20 grid border-t border-slate-300 bg-white sm:hidden"
          style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}
        >
          {items.map((i) => (
            <Link
              key={i.to}
              to={i.to}
              params={{ schoolId }}
              activeOptions={{ exact: i.to === '/school/$schoolId' }}
              className={`flex min-h-14 items-center justify-center font-semibold text-slate-700 ${items.length > 5 ? 'text-sm' : 'text-base'}`}
              activeProps={{ className: 'bg-emerald-100 text-emerald-900' }}
            >
              {i.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </SchoolContext.Provider>
  )
}
