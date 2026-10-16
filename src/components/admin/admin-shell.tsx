import { useState } from 'react'
import type { ReactNode } from 'react'
import { useRouterState } from '@tanstack/react-router'
import {
  Activity,
  BookOpen,
  BrainCircuit,
  ClipboardList,
  Coins,
  Filter,
  Flag,
  Info,
  LayoutDashboard,
  LayoutGrid,
  ListChecks,
  LogOut,
  Menu,
  PlayCircle,
  Users,
  X,
  Library,
} from 'lucide-react'
import { ThemeToggle } from '../theme-toggle'
import { signOut, useSession } from '../../lib/auth-client'

interface NavItem {
  href: string
  label: string
  icon: ReactNode
}

const ic = 'size-[18px] shrink-0'

const GROUPS: Array<{ title: string; items: Array<NavItem> }> = [
  {
    title: 'Insights',
    items: [
      { href: '/admin', label: 'Overview', icon: <LayoutDashboard className={ic} /> },
      { href: '/admin/activity', label: 'Student activity', icon: <Activity className={ic} /> },
      { href: '/admin/funnel', label: 'Product funnel', icon: <Filter className={ic} /> },
      { href: '/admin/usage', label: 'AI usage & cost', icon: <Coins className={ic} /> },
    ],
  },
  {
    title: 'Content',
    items: [
      { href: '/admin/questions', label: 'Question bank', icon: <Library className={ic} /> },
      { href: '/admin/reports', label: 'Question reports', icon: <Flag className={ic} /> },
      { href: '/admin/coverage', label: 'Coverage', icon: <LayoutGrid className={ic} /> },
      { href: '/admin/syllabus', label: 'Syllabus', icon: <BookOpen className={ic} /> },
      { href: '/admin/blueprints', label: 'Blueprints', icon: <ClipboardList className={ic} /> },
      { href: '/admin/videos', label: 'Concept videos', icon: <PlayCircle className={ic} /> },
    ],
  },
  {
    title: 'People & system',
    items: [
      { href: '/admin/users', label: 'Users', icon: <Users className={ic} /> },
      { href: '/admin/adaptive', label: 'Adaptive settings', icon: <BrainCircuit className={ic} /> },
    ],
  },
  {
    title: 'Resources',
    items: [{ href: '/about', label: 'About PrepPlan', icon: <Info className={ic} /> }],
  },
]

/** The admin console frame: a grouped sidebar (a drawer below `lg`), no parent or student items. */
export function AdminShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const { data: session } = useSession()
  const path = useRouterState({ select: (s) => s.location.pathname }).replace(/\/$/, '') || '/'

  const isActive = (href: string) => (href === '/admin' ? path === '/admin' : path === href || path.startsWith(`${href}/`))

  const logo = (
    <a href="/admin" className="flex items-center gap-2.5 px-1">
      <div className="grad-surface flex size-9 shrink-0 items-center justify-center rounded-[11px]">
        <ListChecks className="size-[18px]" />
      </div>
      <div className="leading-tight">
        <div className="display-title text-h3">
          Prep<span className="grad-text">Plan</span>
        </div>
        <div className="text-caption text-muted-foreground font-semibold tracking-wider uppercase">Admin console</div>
      </div>
    </a>
  )

  const nav = (
    <nav className="flex flex-col gap-5" aria-label="Admin">
      {GROUPS.map((g) => (
        <div key={g.title}>
          <p className="field-label px-3">{g.title}</p>
          <div className="mt-1 flex flex-col gap-0.5">
            {g.items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                onClick={() => setOpen(false)}
                className={
                  isActive(item.href)
                    ? 'nav-active flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-bold'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors'
                }
              >
                {item.icon}
                {item.label}
              </a>
            ))}
          </div>
        </div>
      ))}
    </nav>
  )

  return (
    <div className="min-h-screen lg:flex">
      <div className="no-print glass border-border sticky top-0 z-30 flex items-center justify-between border-b p-3 lg:hidden">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="text-muted-foreground hover:bg-accent flex size-9 items-center justify-center rounded-md"
          >
            <Menu className="size-5" />
          </button>
          {logo}
        </div>
        <ThemeToggle />
      </div>

      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} aria-hidden="true" />}

      <aside
        className={`no-print glass border-border fixed inset-y-0 left-0 z-40 flex w-[272px] max-w-[85vw] shrink-0 flex-col overflow-y-auto overscroll-contain border-r p-4 pt-6 transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          {logo}
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="text-muted-foreground hover:bg-accent flex size-8 items-center justify-center rounded-md lg:hidden"
          >
            <X className="size-4" />
          </button>
        </div>
        {nav}
        <div className="border-border mt-auto border-t pt-4">
          <p className="text-caption text-muted-foreground truncate px-1">Signed in as</p>
          <p className="text-small mb-3 truncate px-1 font-semibold">{session?.user.email ?? ''}</p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={async () => {
                await signOut()
                window.location.href = '/'
              }}
              className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex flex-1 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium"
            >
              <LogOut className="size-4" />
              Sign out
            </button>
            <span className="hidden lg:block">
              <ThemeToggle />
            </span>
          </div>
        </div>
      </aside>

      <main className="rise-in min-w-0 flex-1">{children}</main>
    </div>
  )
}
