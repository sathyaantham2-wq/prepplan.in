import { useCallback, useEffect, useState } from 'react'
import {
  Link,
  Outlet,
  createFileRoute,
  useNavigate,
} from '@tanstack/react-router'
import {
  BookOpenCheck,
  ClipboardList,
  TrendingUp,
  Grid3x3,
  GraduationCap,
  Home,
  LayoutGrid,
  LogOut,
  ScanLine,
  Settings,
  UserRound,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SchoolContext } from '../../components/school/context'
import { Loading, Notice } from '../../components/school/ui'
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
    | '/school/$schoolId/exams'
    | '/school/$schoolId/own-papers'
    | '/school/$schoolId/my-results'
    | '/school/$schoolId/progress'
    | '/school/$schoolId/class-progress'
    | '/school/$schoolId/settings'
  label: string
  icon: LucideIcon
  /** Shown on wide screens only; on a phone it is reached from Settings. */
  wideOnly?: boolean
}

// The tabs follow the parts the school chose (owner direction 2026-10-30): "Exams" for making papers,
// "Correction" for AI correction. Paper patterns live under Settings > Advanced.
function navFor(o: SchoolOverview): Array<NavItem> {
  const home: NavItem = { to: '/school/$schoolId', label: 'Home', icon: Home }
  const students: NavItem = {
    to: '/school/$schoolId/students',
    label: 'Students',
    icon: Users,
  }
  const parts: Array<NavItem> = [
    ...(o.school.modules.includes('papers')
      ? [
          {
            to: '/school/$schoolId/exams' as const,
            label: 'Exams',
            icon: BookOpenCheck,
          },
        ]
      : []),
    ...(o.school.modules.includes('correction')
      ? [
          {
            to: '/school/$schoolId/own-papers' as const,
            label: 'Correction',
            icon: ScanLine,
          },
        ]
      : []),
    ...(o.school.modules.includes('correction')
      ? [
          {
            to: '/school/$schoolId/class-progress' as const,
            label: 'Progress',
            icon: Grid3x3,
          },
        ]
      : []),
  ]
  if (o.role === 'school_admin') {
    return [
      home,
      {
        to: '/school/$schoolId/classes',
        label: 'Classes',
        icon: LayoutGrid,
        wideOnly: true,
      },
      {
        to: '/school/$schoolId/teachers',
        label: 'Teachers',
        icon: UserRound,
        wideOnly: true,
      },
      students,
      ...parts,
      { to: '/school/$schoolId/settings', label: 'Settings', icon: Settings },
    ]
  }
  if (o.role === 'teacher' || o.role === 'principal')
    return [home, students, ...parts]
  if (o.role === 'student')
    return [
      home,
      {
        to: '/school/$schoolId/my-results',
        label: 'My results',
        icon: ClipboardList,
      },
      { to: '/school/$schoolId/progress', label: 'Progress', icon: TrendingUp },
    ]
  // a parent
  return [
    home,
    { to: '/school/$schoolId/progress', label: 'Progress', icon: TrendingUp },
  ]
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
      <div className="mx-auto max-w-3xl p-4">
        <Notice kind="error">{error}</Notice>
      </div>
    )
  if (!overview)
    return (
      <div className="mx-auto max-w-3xl px-4">
        <Loading />
      </div>
    )
  const items = navFor(overview)
  const phoneItems = items.filter((i) => !i.wideOnly)
  const initials = overview.me.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join('')

  return (
    <SchoolContext.Provider value={{ schoolId, overview, reload }}>
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 dark:border-slate-800 dark:bg-slate-900/90 dark:supports-[backdrop-filter]:bg-slate-900/80">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <span
              aria-hidden="true"
              className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white shadow-sm shadow-emerald-900/30"
            >
              <GraduationCap className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="font-display truncate text-[17px] leading-tight font-bold text-slate-900 dark:text-slate-100">
                {overview.school.name}
              </p>
              <p className="truncate text-sm text-slate-600 dark:text-slate-400">
                {overview.me.name} ·{' '}
                {ROLE_LABEL[overview.role] ?? overview.role}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span
              aria-hidden="true"
              className="hidden size-10 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700 ring-1 ring-slate-200 sm:flex"
            >
              {initials}
            </span>
            <button
              type="button"
              onClick={leave}
              className="inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-2.5 text-base font-semibold text-slate-800 hover:bg-slate-50 sm:px-3 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
            >
              <LogOut aria-hidden="true" className="size-5 text-slate-500" />
              <span className="sr-only sm:not-sr-only">Sign out</span>
            </button>
          </div>
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
            className="mx-auto hidden max-w-3xl gap-1 px-3 pb-2 sm:flex"
          >
            {items.map((i) => (
              <Link
                key={i.to}
                to={i.to}
                params={{ schoolId }}
                activeOptions={{ exact: i.to === '/school/$schoolId' }}
                className="inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-[15px] font-semibold"
                activeProps={{
                  className:
                    'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-600/15 dark:bg-emerald-950 dark:text-emerald-200',
                }}
                inactiveProps={{
                  className:
                    'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100',
                }}
              >
                <i.icon aria-hidden="true" className="size-4" />
                {i.label}
              </Link>
            ))}
          </nav>
        ) : null}
      </header>
      <div className="mx-auto w-full max-w-3xl px-4 pt-6 pb-32 sm:pb-12">
        <Outlet />
      </div>
      {items.length > 1 ? (
        <nav
          aria-label="School"
          className="fixed inset-x-0 bottom-0 z-20 grid border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] dark:border-slate-800 dark:bg-slate-900/95 backdrop-blur-md sm:hidden"
          style={{ gridTemplateColumns: `repeat(${phoneItems.length}, 1fr)` }}
        >
          {phoneItems.map((i) => (
            <Link
              key={i.to}
              to={i.to}
              params={{ schoolId }}
              activeOptions={{ exact: i.to === '/school/$schoolId' }}
              className="group flex min-h-16 flex-col items-center justify-center gap-1 font-semibold"
              activeProps={{ className: 'is-active text-emerald-800 dark:text-emerald-200' }}
              inactiveProps={{ className: 'text-slate-500 dark:text-slate-400' }}
            >
              <span className="flex h-7 w-12 items-center justify-center rounded-full transition-colors group-[.is-active]:bg-emerald-100 dark:group-[.is-active]:bg-emerald-900">
                <i.icon aria-hidden="true" className="size-5" />
              </span>
              <span
                className={phoneItems.length > 5 ? 'text-[11px]' : 'text-xs'}
              >
                {i.label}
              </span>
            </Link>
          ))}
        </nav>
      ) : null}
    </SchoolContext.Provider>
  )
}
