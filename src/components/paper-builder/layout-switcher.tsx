import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import { LAYOUT_CHOICES } from '../../lib/paper-builder-view'
import type { BuilderLayout } from '../../lib/paper-builder-view'
import { cn } from '../../lib/utils'

/**
 * A small floating "Layout: Classic | A | B" pill for comparing the paper builder layouts on a
 * phone. The page renders it only when a ?layout= parameter is present. It sits bottom-left,
 * above the sticky bar (measured, because that bar grows with notes and errors) and the phone's
 * bottom tab bar.
 */
export function LayoutSwitcher({
  layout,
  onChange,
}: {
  layout: BuilderLayout
  onChange: (layout: BuilderLayout) => void
}) {
  const [bottom, setBottom] = useState<number | null>(null)
  const refs = useRef<Array<HTMLButtonElement | null>>([])
  // Portalled to <body>: the app shell's entrance animation makes its own box the containing block
  // for fixed children, which would put the pill far below the visible screen.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  useEffect(() => {
    let raf = 0
    const measure = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const bar = document.querySelector('[data-builder-bar]')
        if (!bar) return setBottom(null)
        const top = bar.getBoundingClientRect().top
        // A bar that has not scrolled into view yet does not push the pill up.
        setBottom(top >= window.innerHeight - 90 ? null : Math.round(window.innerHeight - top + 8))
      })
    }
    measure()
    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    const mo = new MutationObserver(measure)
    mo.observe(document.body, { childList: true, subtree: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
      mo.disconnect()
    }
  }, [])

  const current = Math.max(
    0,
    LAYOUT_CHOICES.findIndex((c) => c.value === layout),
  )
  function onKeyDown(e: KeyboardEvent<HTMLElement>) {
    let next = -1
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (current + 1) % LAYOUT_CHOICES.length
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp')
      next = (current - 1 + LAYOUT_CHOICES.length) % LAYOUT_CHOICES.length
    if (next < 0) return
    e.preventDefault()
    onChange(LAYOUT_CHOICES[next].value)
    refs.current[next]?.focus()
  }

  if (!mounted) return null
  return createPortal(
    <div
      className="no-print glass border-border fixed left-3 z-20 lg:left-[calc(232px+12px)] flex items-center gap-1 rounded-full border p-1 shadow-lg"
      style={{
        bottom:
          bottom === null
            ? 'calc(92px + env(safe-area-inset-bottom))'
            : `calc(${bottom}px)`,
      }}
    >
      <span id="pb-layout-label" className="text-caption text-muted-foreground pr-1 pl-3 font-semibold">
        Layout:
      </span>
      <div
        role="radiogroup"
        aria-labelledby="pb-layout-label"
        onKeyDown={onKeyDown}
        className="flex items-center gap-1"
      >
        {LAYOUT_CHOICES.map((c, i) => {
          const on = c.value === layout
          return (
            <button
              key={c.value}
              ref={(el) => {
                refs.current[i] = el
              }}
              type="button"
              role="radio"
              aria-checked={on}
              tabIndex={i === current ? 0 : -1}
              onClick={() => onChange(c.value)}
              className={cn(
                'focus-visible:ring-ring/60 text-small min-h-11 min-w-11 rounded-full px-3 font-bold outline-none focus-visible:ring-[3px]',
                on ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted',
              )}
            >
              {c.label}
            </button>
          )
        })}
      </div>
    </div>,
    document.body,
  )
}
