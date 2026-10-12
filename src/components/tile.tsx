import { Check } from 'lucide-react'
import { cn } from '../lib/utils'

// A shared look for both the board tiles and the class tiles: an elevated card that lifts on
// hover and gains a glowing ring once selected -- the "3D, professional" tile style requested to
// replace the old plain <select> dropdowns.
export function Tile({
  selected,
  disabled,
  onClick,
  children,
  className,
}: {
  selected: boolean
  disabled?: boolean
  onClick: () => void
  children: React.ReactNode
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={cn(
        'group relative flex flex-col items-center justify-center gap-2 rounded-xl border bg-card p-5 text-center',
        'shadow-[0_1px_2px_rgba(0,0,0,0.06),0_1px_1px_rgba(0,0,0,0.04)] transition-all duration-200 ease-out',
        !disabled &&
          'hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_12px_24px_-8px_rgba(0,0,0,0.18)] cursor-pointer',
        !disabled && 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        selected &&
          'border-primary ring-2 ring-primary/50 shadow-[0_12px_24px_-8px_rgba(0,0,0,0.22)] -translate-y-1',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
    >
      {selected && (
        <span className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
          <Check className="size-3.5" strokeWidth={3} />
        </span>
      )}
      {children}
    </button>
  )
}
