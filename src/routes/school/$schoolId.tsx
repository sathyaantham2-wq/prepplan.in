import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import {
  Link,
  Outlet,
  createFileRoute,
  useNavigate,
  useRouterState,
} from '@tanstack/react-router'
import {
  BarChart3,
  BookOpenCheck,
  ChevronDown,
  ClipboardList,
  TrendingUp,
  Grid3x3,
  GraduationCap,
  HelpCircle,
  Home,
  LayoutGrid,
  LogOut,
  Menu as MenuIcon,
  MessageSquare,
  ScanLine,
  Settings,
  UserRound,
  Users,
  X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SchoolContext } from '../../components/school/context'
import { ShellProvider, Switch, useShell } from '../../components/school/kit'
import { Loading, Notice } from '../../components/school/ui'
import { schoolThemeCss } from '../../lib/schools/school-theme'
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
    | '/school/$schoolId/board'
    | '/school/$schoolId/results'
    | '/school/$schoolId/my-results'
    | '/school/$schoolId/progress'
    | '/school/$schoolId/class-progress'
    | '/school/$schoolId/messages'
    | '/school/$schoolId/settings'
  label: string
  icon: LucideIcon
  /** other address beginnings that count as this item (for the highlight and the page title) */
  also?: Array<string>
}
interface NavGroup {
  /** no title: the items stand alone */
  title?: string
  items: Array<NavItem>
}

// The sidebar (UI redesign plan, section 3): grouped, only the parts the school turned on, and only what each person may
// open. Settings sits at the bottom for the office.
function navFor(o: SchoolOverview): { groups: Array<NavGroup>; bottom: Array<NavItem> } {
  const has = (m: string) => o.school.modules.includes(m as never)
  const home: NavItem = { to: '/school/$schoolId', label: 'Home', icon: Home }
  const students: NavItem = { to: '/school/$schoolId/students', label: 'Students', icon: Users }
  const makePaper: NavItem = { to: '/school/$schoolId/exams', label: 'Make paper', icon: BookOpenCheck }
  const correction: NavItem = { to: '/school/$schoolId/own-papers', label: 'AI correction', icon: ScanLine, also: ['/board'] }
  const results: NavItem = { to: '/school/$schoolId/results', label: 'Results', icon: BarChart3 }
  const board: NavItem = { to: '/school/$schoolId/class-progress', label: 'Progress board', icon: Grid3x3 }
  const messages: NavItem = { to: '/school/$schoolId/messages', label: 'Messages', icon: MessageSquare }
  const exams = (items: Array<NavItem | false>): Array<NavGroup> => {
    const list = items.filter((i): i is NavItem => i !== false)
    return list.length ? [{ title: 'Exams', items: list }] : []
  }
  if (o.role === 'school_admin')
    return {
      groups: [
        { items: [home] },
        {
          title: 'Set up',
          items: [
            { to: '/school/$schoolId/classes', label: 'Classes', icon: LayoutGrid },
            { to: '/school/$schoolId/teachers', label: 'Teachers', icon: UserRound },
            students,
          ],
        },
        ...exams([has('papers') && makePaper, has('correction') && correction, has('papers') && results, has('correction') && board]),
        { items: [messages] },
      ],
      bottom: [{ to: '/school/$schoolId/settings', label: 'Settings', icon: Settings, also: ['/terms', '/papers'] }],
    }
  if (o.role === 'teacher')
    return {
      groups: [
        { items: [home, students] },
        ...exams([has('papers') && makePaper, has('correction') && correction, has('papers') && results, has('correction') && board]),
        { items: [messages] },
      ],
      bottom: [],
    }
  if (o.role === 'principal')
    return {
      groups: [
        { items: [home, students] },
        // the principal reads the correction through the exam-week board (the marking screens are the teachers')
        ...exams([
          has('papers') && makePaper,
          has('correction') && { ...correction, to: '/school/$schoolId/board', also: [] },
          has('correction') && board,
        ]),
        { items: [messages] },
      ],
      bottom: [],
    }
  if (o.role === 'student')
    return {
      groups: [
        {
          items: [
            home,
            { to: '/school/$schoolId/my-results', label: 'My results', icon: ClipboardList },
            { to: '/school/$schoolId/progress', label: 'Progress', icon: TrendingUp },
          ],
        },
      ],
      bottom: [],
    }
  return { groups: [{ items: [home, { to: '/school/$schoolId/progress', label: 'Progress', icon: TrendingUp }] }], bottom: [] }
}

/** Does this address belong to the item? Home only matches itself. */
function isActive(item: NavItem, schoolId: string, path: string): boolean {
  const base = `/school/${schoolId}`
  const own = item.to.replace('/school/$schoolId', base)
  if (item.to === '/school/$schoolId') return path === base || path === `${base}/`
  return [own, ...(item.also ?? []).map((a) => base + a)].some((p) => path === p || path.startsWith(`${p}/`))
}

const COLLAPSED = 'prepplan-school-nav-closed'

function Sidebar({
  o,
  schoolId,
  path,
  onNavigate,
}: {
  o: SchoolOverview
  schoolId: string
  path: string
  onNavigate?: () => void
}) {
  const { groups, bottom } = navFor(o)
  const [closed, setClosed] = useState<Array<string>>([])
  useEffect(() => {
    try {
      setClosed(JSON.parse(window.localStorage.getItem(COLLAPSED) ?? '[]') as Array<string>)
    } catch {
      // ignore
    }
  }, [])
  const flip = (title: string) => {
    const next = closed.includes(title) ? closed.filter((t) => t !== title) : [...closed, title]
    setClosed(next)
    try {
      window.localStorage.setItem(COLLAPSED, JSON.stringify(next))
    } catch {
      // ignore
    }
  }
  const link = (i: NavItem) => {
    const on = isActive(i, schoolId, path)
    return (
      <Link
        key={i.label}
        to={i.to}
        params={{ schoolId }}
        onClick={onNavigate}
        aria-current={on ? 'page' : undefined}
        className={`flex min-h-10 items-center gap-3 rounded-lg px-3 text-[15px] font-semibold transition-colors ${on ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'}`}
      >
        <i.icon aria-hidden="true" className="size-[18px] shrink-0" />
        <span className="truncate">{i.label}</span>
      </Link>
    )
  }
  return (
    <nav aria-label="School" className="flex h-full flex-col gap-1 overflow-y-auto px-3 pb-4" data-testid="sidebar">
      {groups.map((g, gi) =>
        g.title ? (
          <div key={g.title} className="mt-3">
            <button
              type="button"
              onClick={() => flip(g.title!)}
              aria-expanded={!closed.includes(g.title)}
              className="flex w-full items-center justify-between rounded-md px-3 py-1.5 text-xs font-bold tracking-wide text-slate-600 uppercase hover:text-slate-900"
            >
              {g.title}
              <ChevronDown aria-hidden="true" className={`size-4 transition-transform ${closed.includes(g.title) ? '-rotate-90' : ''}`} />
            </button>
            {closed.includes(g.title) ? null : <div className="mt-1 flex flex-col gap-0.5">{g.items.map(link)}</div>}
          </div>
        ) : (
          <div key={gi} className={`flex flex-col gap-0.5 ${gi > 0 ? 'mt-3' : ''}`}>
            {g.items.map(link)}
          </div>
        ),
      )}
      <div className="mt-auto flex flex-col gap-0.5 pt-4">{bottom.map(link)}</div>
    </nav>
  )
}

function titleFor(o: SchoolOverview, schoolId: string, path: string): string {
  const { groups, bottom } = navFor(o)
  const all = [...groups.flatMap((g) => g.items), ...bottom]
  const hit = all.filter((i) => isActive(i, schoolId, path)).sort((a, b) => b.to.length - a.to.length).at(0)
  if (path.endsWith('/terms')) return 'School terms'
  if (path.includes('/papers')) return 'Paper patterns'
  if (path.endsWith('/board')) return 'Where sheets stand'
  if (path.endsWith('/welcome')) return 'Set up your school'
  return hit?.label ?? o.school.name
}

function Menu({
  label,
  button,
  children,
  testId,
}: {
  label: string
  button: ReactNode
  children: (close: () => void) => ReactNode
  testId?: string
}) {
  const [open, setOpen] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])
  return (
    <div ref={box} className="relative">
      <button
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        data-testid={testId}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-2 text-[15px] font-semibold text-slate-800 hover:bg-slate-50"
      >
        {button}
      </button>
      {open ? (
        <div role="menu" className="absolute right-0 z-50 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-2 text-slate-900 shadow-xl">
          {children(() => setOpen(false))}
        </div>
      ) : null}
    </div>
  )
}

function SchoolLayout() {
  const { schoolId } = Route.useParams()
  const navigate = useNavigate()
  const path = useRouterState({ select: (s) => s.location.pathname })
  const [overview, setOverview] = useState<SchoolOverview | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [drawer, setDrawer] = useState(false)

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
  useEffect(() => setDrawer(false), [path])

  async function leave() {
    await signOut()
    await navigate({ to: '/school/sign-in' })
  }

  return (
    <ShellProvider
      render={(dark) => (
        <div className={`school-ui min-h-dvh bg-[var(--sc-page)] text-slate-900 ${dark ? 'school-dark' : ''}`} data-theme={dark ? 'dark' : 'light'}>
          <style>{schoolThemeCss()}</style>
          {error ? (
            <div className="mx-auto max-w-3xl p-4">
              <Notice kind="error">{error}</Notice>
            </div>
          ) : !overview ? (
            <div className="mx-auto max-w-3xl px-4">
              <Loading />
            </div>
          ) : (
            <Frame
              overview={overview}
              schoolId={schoolId}
              path={path}
              reload={reload}
              drawer={drawer}
              setDrawer={setDrawer}
              leave={leave}
            />
          )}
        </div>
      )}
    />
  )
}

function Frame({
  overview,
  schoolId,
  path,
  reload,
  drawer,
  setDrawer,
  leave,
}: {
  overview: SchoolOverview
  schoolId: string
  path: string
  reload: () => Promise<void>
  drawer: boolean
  setDrawer: (open: boolean) => void
  leave: () => Promise<void>
}) {
  const { dark, setDark } = useShell()
  const initials = overview.school.name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z0-9]/.test(w))
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join('')
  const me = overview.me.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join('')
  const brand = (
    <div className="flex min-w-0 items-center gap-3 px-5 py-4">
      <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-700 text-sm font-bold text-white">
        {initials || <GraduationCap className="size-5" />}
      </span>
      <div className="min-w-0">
        <p className="truncate text-[15px] leading-tight font-bold text-slate-900">{overview.school.name}</p>
        <p className="truncate text-sm text-slate-600">{ROLE_LABEL[overview.role] ?? overview.role}</p>
      </div>
    </div>
  )
  return (
    <SchoolContext.Provider value={{ schoolId, overview, reload }}>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[90] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2">
        Skip to the page
      </a>
      {/* wide screens: the sidebar is always there */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
        {brand}
        <Sidebar o={overview} schoolId={schoolId} path={path} />
      </aside>
      {/* narrow screens: the same sidebar slides in from the left */}
      {drawer ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div aria-hidden="true" className="absolute inset-0 bg-black/40" onClick={() => setDrawer(false)} />
          <aside role="dialog" aria-modal="true" aria-label="Menu" className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col border-r border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between pr-2">
              {brand}
              <button type="button" aria-label="Close the menu" onClick={() => setDrawer(false)} className="inline-flex size-11 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100">
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>
            <Sidebar o={overview} schoolId={schoolId} path={path} onNavigate={() => setDrawer(false)} />
          </aside>
        </div>
      ) : null}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
          <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-3 px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              aria-label="Open the menu"
              data-testid="menu-button"
              onClick={() => setDrawer(true)}
              className="inline-flex size-11 items-center justify-center rounded-lg border border-slate-200 text-slate-800 hover:bg-slate-50 lg:hidden"
            >
              <MenuIcon aria-hidden="true" className="size-5" />
            </button>
            <div className="min-w-0 flex-1">
              <p className="truncate text-lg leading-tight font-bold text-slate-900" data-testid="page-title">
                {titleFor(overview, schoolId, path)}
              </p>
              {/* the sidebar shows the school's name on a wide screen; on a phone it sits under the title */}
              <p className="truncate text-sm text-slate-600 lg:hidden">{overview.school.name}</p>
            </div>
            <Menu label="Help" button={<HelpCircle aria-hidden="true" className="size-5" />} testId="help-button">
              {(close) => (
                <div className="space-y-1 p-1 text-[15px]">
                  <p className="px-2 pt-1 pb-2 font-bold">Help</p>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      close()
                      window.dispatchEvent(new Event('school-tour'))
                    }}
                    className="block w-full rounded-lg px-2 py-2 text-left hover:bg-slate-100"
                  >
                    Show me around (the short tour)
                  </button>
                  <a role="menuitem" href="mailto:support@prepplan.in" className="block rounded-lg px-2 py-2 text-slate-900 hover:bg-slate-100">
                    Write to support@prepplan.in
                  </a>
                </div>
              )}
            </Menu>
            <Menu
              label="Your account"
              testId="profile-button"
              button={
                <>
                  <span aria-hidden="true" className="flex size-7 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-800">
                    {me}
                  </span>
                  <span className="hidden max-w-40 truncate md:inline">{overview.me.name}</span>
                  <ChevronDown aria-hidden="true" className="hidden size-4 md:inline" />
                </>
              }
            >
              {(close) => (
                <div className="space-y-1 p-1 text-[15px]">
                  <div className="px-2 pt-1 pb-2">
                    <p className="font-bold">{overview.me.name}</p>
                    <p className="text-sm text-slate-600">{ROLE_LABEL[overview.role] ?? overview.role}</p>
                  </div>
                  <div className="border-t border-slate-200 px-2 py-3">
                    <Switch label="Dark theme" checked={dark} onChange={setDark} testId="dark-toggle" />
                  </div>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      close()
                      void leave()
                    }}
                    className="flex w-full items-center gap-2 rounded-lg border-t border-slate-200 px-2 py-2.5 text-left font-semibold hover:bg-slate-100"
                  >
                    <LogOut aria-hidden="true" className="size-5 text-slate-600" />
                    Sign out
                  </button>
                </div>
              )}
            </Menu>
          </div>
          {overview.school.isDemo ? (
            <p data-testid="demo-banner" className="bg-amber-300 px-4 py-1.5 text-center text-sm font-bold tracking-wide text-amber-950">
              DEMO - sample data
            </p>
          ) : null}
        </header>
        <main id="main" className="mx-auto w-full max-w-[1440px] px-4 pt-6 pb-16 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </SchoolContext.Provider>
  )
}
