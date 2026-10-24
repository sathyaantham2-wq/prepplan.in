import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { ThemeToggle } from './theme-toggle'
import { SoundToggle } from './sound-toggle'
import { ShareAppButton } from './share-app-button'
import { ProfileMenu } from './profile-menu'
import { signOut, useSession } from '../lib/auth-client'

// A persistent sidebar shell, in two variants -- 'parent' (the original: Home/Generate
// Paper/Progress/Settings) and 'student' (Home/Generate Paper/Papers Attempted/Leaderboard, added
// at the user's explicit request 2026-09-22 so a student landing here after sign-up gets the same
// sidebar+hero treatment, not just her parent). Each variant is built from that role's own real,
// reachable routes only -- a student's "Generate Paper" goes to /my-paper (her adaptive practice
// paper, AI-graded, no parent needed per CLAUDE.md's 2026-09-20 exception), never /generate, which
// redirects a student role away; a student has no /settings or /tracker/:id access at all, so
// neither appears in her nav. "Practice Tests" and "Question Bank" from the original reference
// mockup still have no real page for either role and stay left out. tab06's /papers "Paper
// library" now exists for the student variant (/papers-attempted, 2026-09-24); the parent-facing
// version is still unbuilt (F123's own commit notes), so 'My Papers' stays left out of that
// branch below until it is. 'drills' (2026-09-24): /remediation (F066-F070's refresher/worked-
// examples/practice-questions hub) was fully built but had no nav link anywhere -- a parent could
// trigger a task for her via its own API, but she had no way to discover or open it herself.
export type AppShellActive =
  | 'home'
  | 'generate'
  | 'papers'
  | 'drills'
  | 'progress'
  | 'settings'
  | 'leaderboard'
  | 'reports'
  | 'activity'
export type AppShellVariant = 'parent' | 'student'

interface AppShellProps {
  /** Defaults to 'parent' -- every call site before the student variant existed already means
   * that. */
  variant?: AppShellVariant
  /** null for a real screen that just has no nav item of its own (e.g. /onboarding, reached via
   * a link on /home rather than the sidebar itself) -- no item highlights, rather than picking a
   * misleading nearest match. */
  active: AppShellActive | null
  /** Parent variant only: the parent's currently-relevant student, for the Progress link
   * (/tracker/:studentId). Progress is left out of the nav entirely when this is not known yet,
   * rather than linking somewhere broken. Unused by the student variant. */
  studentId?: string | null
  children: ReactNode
}

function HomeIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 10 9-7 9 7" />
      <path d="M5 9v11h14V9" />
    </svg>
  )
}
function GenerateIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  )
}
function ProgressIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3v18h18" />
      <path d="M7 15v3M12 10v8M17 6v12" />
    </svg>
  )
}
function SettingsIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
    </svg>
  )
}
function SignOutIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5M21 12H9" />
    </svg>
  )
}
function MenuIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}
function CloseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

export function AppShell({
  variant = 'parent',
  active,
  studentId,
  children,
}: AppShellProps) {
  // shortLabel is what the phone-width bottom tab bar shows -- five full labels never fit a
  // 360px row side by side.
  const { data: session } = useSession()
  const isAdmin =
    (session?.user as { role?: string } | undefined)?.role === 'admin'
  // An admin lives in the admin console only (2026-10-16): the parent and student screens are not for
  // that account, so any page that mounts this shell sends it to /admin.
  useEffect(() => {
    if (isAdmin) window.location.replace('/admin')
  }, [isAdmin])

  // F132: a Civil Services student's "Generate Paper" is /civil-paper, not /my-paper. Only the
  // student variant needs her board, so a parent's screens make no extra request.
  const [isCivilStudent, setIsCivilStudent] = useState(false)
  useEffect(() => {
    if (variant !== 'student') return
    let cancelled = false
    fetch('/api/students/me/profile')
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { profile?: { board?: string } } | null) => {
        if (!cancelled) setIsCivilStudent(data?.profile?.board === 'CIVILS')
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [variant])

  const items: Array<{
    key: AppShellActive
    label: string
    shortLabel: string
    href: string
    icon: ReactNode
  }> =
    variant === 'student'
      ? [
          // Owner decision 2026-10-24: a student's nav is just Home and Generate Paper. Papers
          // Attempted, Practice Drills and Leaderboard are reached from the Home page and count as
          // children of Home (see highlightKey below).
          {
            key: 'home',
            label: 'Home',
            shortLabel: 'Home',
            href: '/student',
            icon: <HomeIcon />,
          },
          {
            key: 'generate',
            label: 'Generate Paper',
            shortLabel: 'Generate',
            href: isCivilStudent ? '/civil-paper' : '/my-paper',
            icon: <GenerateIcon />,
          },
        ]
      : [
          {
            key: 'home',
            label: 'Home',
            shortLabel: 'Home',
            href: '/home',
            icon: <HomeIcon />,
          },
          {
            key: 'generate',
            label: 'Generate Paper',
            shortLabel: 'Generate',
            href: '/generate',
            icon: <GenerateIcon />,
          },
          // 'My Papers' intentionally omitted -- /papers does not exist yet (see the note above
          // AppShellActive). PapersIcon stays imported/used once it does.
          ...(studentId
            ? [
                {
                  key: 'progress' as const,
                  label: 'Progress',
                  shortLabel: 'Progress',
                  href: `/tracker/${studentId}`,
                  icon: <ProgressIcon />,
                },
              ]
            : []),
          {
            key: 'settings',
            label: 'Settings',
            shortLabel: 'Settings',
            href: '/settings',
            icon: <SettingsIcon />,
          },
        ]

  const isStudent = variant === 'student'
  // Pages that hang off the student's Home highlight Home.
  const highlightKey: AppShellActive | null =
    isStudent &&
    (active === 'papers' || active === 'drills' || active === 'leaderboard')
      ? 'home'
      : active
  const [mobileOpen, setMobileOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  // With the drawer open the page behind it must not scroll (it did, on touch devices, which made
  // the drawer feel stuck and the page jump).
  useEffect(() => {
    if (!mobileOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [mobileOpen])
  const user = session?.user as { name?: string; email?: string } | undefined
  const displayName = user?.name || user?.email || ''

  // Sign out used to live only in /student's page header, so from every other screen there was
  // no way out at all. It belongs to the shell, reachable from any page.
  async function handleSignOut() {
    setSigningOut(true)
    try {
      await signOut()
    } finally {
      window.location.href = '/'
    }
  }

  const account = isStudent ? (
    <div className="border-border border-t pt-3">
      <ProfileMenu layout="sidebar" displayName={displayName} />
    </div>
  ) : (
    <div className="border-border space-y-3 border-t pt-4">
      <div className="flex items-center justify-between px-1">
        <span className="text-caption text-muted-foreground">
          Share, sound &amp; theme
        </span>
        <div className="flex items-center">
          <ShareAppButton />
          <SoundToggle />
          <ThemeToggle />
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        <div className="grad-surface flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold">
          {displayName ? displayName.trim().charAt(0).toUpperCase() : '?'}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{displayName}</p>
          <button
            type="button"
            onClick={() => void handleSignOut()}
            disabled={signingOut}
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-xs whitespace-nowrap"
          >
            <SignOutIcon />
            {signingOut ? 'Signing out…' : 'Sign out'}
          </button>
        </div>
      </div>
    </div>
  )

  const logo = (
    <div className="flex items-center gap-2.5 px-2">
      <div className="grad-surface flex size-[36px] shrink-0 items-center justify-center rounded-[11px]">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 10 12 5 2 10l10 5 10-5Z" />
          <path d="M6 12v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" />
        </svg>
      </div>
      <div className="display-title text-h3 leading-tight">
        Prep<span className="grad-text">Plan</span>
      </div>
    </div>
  )

  const nav = (
    <nav className="flex flex-col gap-0.5">
      {items.map((item) => (
        <a
          key={item.key}
          href={item.href}
          aria-current={item.key === highlightKey ? 'page' : undefined}
          onClick={() => setMobileOpen(false)}
          className={
            item.key === highlightKey
              ? 'nav-active flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors'
          }
        >
          {item.icon}
          {item.label}
        </a>
      ))}
    </nav>
  )

  return (
    <div className="min-h-screen lg:flex">
      {/* Mobile/tablet top bar -- the sidebar itself becomes an off-canvas drawer below `lg`,
          since a permanently fixed 232px column has no way to fit a phone or a portrait tablet.
          "Dynamic sidebar" per the user's 2026-09-23 request. */}
      <div className="no-print glass border-border sticky top-0 z-30 flex items-center justify-between border-b p-3 lg:hidden">
        <div className="flex items-center gap-2">
          {!isStudent && (
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex size-9 shrink-0 items-center justify-center rounded-md"
            >
              <MenuIcon />
            </button>
          )}
          {logo}
        </div>
        {!isStudent && (
          <div className="flex items-center">
            <ShareAppButton />
            <SoundToggle />
            <ThemeToggle />
          </div>
        )}
      </div>

      {mobileOpen && !isStudent && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={`no-print glass border-border ${isStudent ? 'hidden lg:flex' : 'flex'} fixed inset-y-0 left-0 z-40 w-[260px] overflow-y-auto overscroll-contain max-w-[80vw] shrink-0 flex-col border-r p-[18px] pt-7 transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:w-[232px] lg:max-w-none lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-7 flex items-center justify-between">
          {logo}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex size-8 shrink-0 items-center justify-center rounded-md lg:hidden"
          >
            <CloseIcon />
          </button>
        </div>

        {nav}

        <div className="mt-auto pt-4">{account}</div>
      </div>

      {/* Bottom padding on phones so the fixed tab bar never covers the last card. */}
      <div className="rise-in min-w-0 flex-1 pb-20 lg:pb-0">{children}</div>

      {/* Phone/tablet bottom tab bar: the main sections one thumb-tap away, instead of hidden
          behind the menu button. The drawer stays for account/sign out and the theme toggle.
          lg:hidden (display:none) also keeps it out of the accessibility tree on desktop, so each
          nav link still has exactly one accessible match there. */}
      {isStudent ? (
        <nav
          aria-label="Main"
          className="no-print glass border-border fixed inset-x-0 bottom-0 z-20 flex items-end border-t pb-[env(safe-area-inset-bottom)] lg:hidden"
        >
          <a
            href="/student"
            aria-current={highlightKey === 'home' ? 'page' : undefined}
            className={`flex min-h-14 min-w-0 flex-1 flex-col items-center justify-center gap-1 text-[11px] leading-none ${
              highlightKey === 'home'
                ? 'text-primary font-semibold'
                : 'text-muted-foreground'
            }`}
          >
            <HomeIcon />
            Home
          </a>
          {/* The centre button goes straight to a new paper. A "Scan my answers" choice is left
              out on purpose: the only scan route is /scan/$attemptId, which needs an existing
              attempt, so there is no standalone entry to link to. */}
          <div className="flex flex-1 justify-center">
            <a
              href={isCivilStudent ? '/civil-paper' : '/my-paper'}
              aria-label="New paper"
              className="grad-surface -mt-6 flex size-14 items-center justify-center rounded-full text-3xl leading-none font-bold shadow-lg"
            >
              +
            </a>
          </div>
          <ProfileMenu layout="tab" displayName={displayName} />
        </nav>
      ) : (
        <nav
          aria-label="Main"
          className="no-print glass border-border fixed inset-x-0 bottom-0 z-20 flex border-t pb-[env(safe-area-inset-bottom)] lg:hidden"
        >
          {items.map((item) => (
            <a
              key={item.key}
              href={item.href}
              aria-current={item.key === highlightKey ? 'page' : undefined}
              className={`flex min-w-0 flex-1 flex-col items-center gap-1 px-1 py-2 text-[11px] leading-none ${
                item.key === highlightKey
                  ? 'text-primary font-semibold'
                  : 'text-muted-foreground'
              }`}
            >
              <span
                className={`flex h-7 w-12 items-center justify-center rounded-full ${
                  item.key === highlightKey ? 'nav-active' : ''
                }`}
              >
                {item.icon}
              </span>
              <span className="max-w-full truncate">{item.shortLabel}</span>
            </a>
          ))}
        </nav>
      )}
    </div>
  )
}
