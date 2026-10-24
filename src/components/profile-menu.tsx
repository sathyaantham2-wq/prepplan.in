import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { ReactNode } from 'react'
import { useTheme } from 'next-themes'
import {
  Check,
  Moon,
  Settings,
  Share2,
  Sun,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { signOut } from '../lib/auth-client'
import { isSfxMuted, onSfxMutedChange, setSfxMuted } from '../lib/sfx'
import { shareApp } from './share-app-button'

// The student's one account menu (owner decision 2026-10-24): Settings, Share PrepPlan, sound,
// dark mode and Sign out in a single place. 'sidebar' is the desktop avatar+name row that opens a
// popover above itself; 'tab' is the phone "Me" tab that opens a bottom sheet.
interface ProfileMenuProps {
  layout: 'sidebar' | 'tab'
  displayName: string
}

const ITEM =
  'hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-medium outline-none'

function MenuRow({
  icon,
  children,
  onClick,
  href,
  trailing,
  disabled,
  role = 'menuitem',
  checked,
}: {
  icon: ReactNode
  children: ReactNode
  onClick?: () => void
  href?: string
  trailing?: ReactNode
  disabled?: boolean
  role?: 'menuitem' | 'menuitemcheckbox'
  checked?: boolean
}) {
  const content = (
    <>
      <span className="text-muted-foreground flex size-4 shrink-0 items-center justify-center">
        {icon}
      </span>
      <span className="flex-1">{children}</span>
      {trailing}
    </>
  )
  if (href) {
    return (
      <a href={href} role="menuitem" className={ITEM}>
        {content}
      </a>
    )
  }
  return (
    <button
      type="button"
      role={role}
      aria-checked={role === 'menuitemcheckbox' ? checked : undefined}
      disabled={disabled}
      onClick={onClick}
      className={ITEM}
    >
      {content}
    </button>
  )
}

export function ProfileMenu({ layout, displayName }: ProfileMenuProps) {
  const [open, setOpen] = useState(false)
  const [muted, setMuted] = useState(false)
  const [copied, setCopied] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    setMuted(isSfxMuted())
    return onSfxMutedChange(setMuted)
  }, [])

  // Outside click, Escape (focus goes back to the trigger) and arrow-key movement.
  useEffect(() => {
    if (!open) return
    const items = () =>
      Array.from(
        menuRef.current?.querySelectorAll<HTMLElement>(
          '[role^="menuitem"]:not([disabled])',
        ) ?? [],
      )
    items()[0]?.focus()
    function onPointerDown(e: MouseEvent | TouchEvent) {
      const t = e.target as Node
      if (!rootRef.current?.contains(t) && !menuRef.current?.contains(t)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        const list = items()
        const at = list.indexOf(document.activeElement as HTMLElement)
        const next =
          e.key === 'ArrowDown'
            ? (at + 1) % list.length
            : (at - 1 + list.length) % list.length
        list[next]?.focus()
      } else if (e.key === 'Tab') {
        // The menu is short; Tab leaving it simply closes it.
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('touchstart', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('touchstart', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  // The sheet covers the page, so the page behind it must not scroll.
  useEffect(() => {
    if (!open || layout !== 'tab') return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open, layout])

  async function handleShare() {
    if ((await shareApp()) === 'copied') {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    }
  }

  async function handleSignOut() {
    setSigningOut(true)
    try {
      await signOut()
    } finally {
      window.location.href = '/'
    }
  }

  const dark = mounted && resolvedTheme === 'dark'
  const initial = displayName ? displayName.trim().charAt(0).toUpperCase() : '?'

  const menu = (
    <div
      ref={menuRef}
      role="menu"
      aria-label="Account menu"
      className={
        layout === 'sidebar'
          ? 'glass border-border absolute inset-x-0 bottom-full z-50 mb-2 rounded-2xl border p-1.5 shadow-lg'
          : 'bg-background border-border fixed inset-x-0 bottom-0 z-50 rounded-t-3xl border-t p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-lg'
      }
    >
      {layout === 'tab' && (
        <p className="truncate px-3 pt-1 pb-2 text-sm font-semibold">
          {displayName}
        </p>
      )}
      <MenuRow icon={<Settings className="size-4" />} href="/settings">
        Settings
      </MenuRow>
      <MenuRow
        icon={
          copied ? <Check className="size-4" /> : <Share2 className="size-4" />
        }
        onClick={() => void handleShare()}
      >
        {copied ? 'Link copied' : 'Share PrepPlan'}
      </MenuRow>
      <MenuRow
        role="menuitemcheckbox"
        checked={!muted}
        icon={
          muted ? (
            <VolumeX className="size-4" />
          ) : (
            <Volume2 className="size-4" />
          )
        }
        trailing={
          <span className="text-muted-foreground text-xs">
            {muted ? 'Off' : 'On'}
          </span>
        }
        onClick={() => setSfxMuted(!muted)}
      >
        Sound
      </MenuRow>
      <MenuRow
        role="menuitemcheckbox"
        checked={dark}
        icon={dark ? <Moon className="size-4" /> : <Sun className="size-4" />}
        trailing={
          <span className="text-muted-foreground text-xs">
            {dark ? 'On' : 'Off'}
          </span>
        }
        onClick={() => setTheme(dark ? 'light' : 'dark')}
      >
        Dark mode
      </MenuRow>
      <div className="bg-border my-1 h-px" role="separator" />
      <MenuRow
        icon={<SignOutIcon />}
        disabled={signingOut}
        onClick={() => void handleSignOut()}
      >
        {signingOut ? 'Signing out…' : 'Sign out'}
      </MenuRow>
    </div>
  )

  return (
    <div
      ref={rootRef}
      className={layout === 'sidebar' ? 'relative' : 'flex flex-1'}
    >
      {layout === 'tab' &&
        open &&
        mounted &&
        // Portalled to <body>: the tab bar's backdrop-filter makes it the containing block for
        // fixed children, which left the scrim covering only the bar and the sheet see-through.
        createPortal(
          <div
            className="fixed inset-0 z-40 bg-black/40"
            aria-hidden="true"
            onClick={() => setOpen(false)}
          />,
          document.body,
        )}
      {layout === 'sidebar' ? (
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label={`Account menu for ${displayName || 'you'}`}
          onClick={() => setOpen((v) => !v)}
          className="hover:bg-accent flex min-h-11 w-full items-center gap-2.5 rounded-xl px-1.5 py-1.5 text-left"
        >
          <span className="grad-surface flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold">
            {initial}
          </span>
          <span className="min-w-0 flex-1 truncate text-sm font-semibold">
            {displayName}
          </span>
        </button>
      ) : (
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={`flex min-h-14 min-w-0 flex-1 flex-col items-center justify-center gap-1 text-[11px] leading-none ${
            open ? 'text-primary font-semibold' : 'text-muted-foreground'
          }`}
        >
          <span className="grad-surface flex size-7 items-center justify-center rounded-full text-xs font-bold">
            {initial}
          </span>
          Me
        </button>
      )}
      {open && (layout === 'tab' && mounted ? createPortal(menu, document.body) : menu)}
    </div>
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
