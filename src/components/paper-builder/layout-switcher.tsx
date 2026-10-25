import { useRef } from 'react'
import type { KeyboardEvent } from 'react'
import { LAYOUT_CHOICES } from '../../lib/paper-builder-view'
import type { BuilderLayout } from '../../lib/paper-builder-view'
import { cn } from '../../lib/utils'

/**
 * A small inline "Classic | New" switch for the page header row. The page renders it only while a
 * ?layout= parameter is present, so it never floats over the content.
 */
export function LayoutSwitch({
  layout,
  onChange,
}: {
  layout: BuilderLayout
  onChange: (layout: BuilderLayout) => void
}) {
  const refs = useRef<Array<HTMLButtonElement | null>>([])
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

  return (
    <div className="no-print flex shrink-0 items-center gap-2">
      <span id="pb-layout-label" className="text-caption text-muted-foreground font-semibold">
        Layout
      </span>
      <div
        role="radiogroup"
        aria-labelledby="pb-layout-label"
        onKeyDown={onKeyDown}
        className="bg-muted/70 border-border flex items-center gap-1 rounded-full border p-1"
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
                on ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-card',
              )}
            >
              {c.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
