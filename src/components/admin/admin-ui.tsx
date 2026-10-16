import type { ReactNode } from 'react'

/**
 * Building blocks of the admin console (2026-10-16 redesign). Every admin screen is a column of
 * these, inside AdminShell: a page header, stat tiles, panels, and a few tiny chart pieces drawn
 * as plain SVG/CSS (no chart library) so they stay light and follow the light/dark theme tokens.
 */

export function AdminPage({
  title,
  description,
  actions,
  children,
}: {
  title: string
  description?: string
  actions?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-8 sm:py-8">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-h1">{title}</h1>
          {description && (
            <p className="text-body text-muted-foreground mt-1 max-w-2xl">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="no-print flex items-center gap-2">{actions}</div>}
      </header>
      <div className="space-y-6">{children}</div>
    </div>
  )
}

export function Panel({
  title,
  subtitle,
  action,
  children,
  className = '',
}: {
  title?: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={`bg-card text-card-foreground border-border rounded-2xl border p-4 shadow-[0_1px_0_var(--highlight)_inset,0_10px_30px_-22px_var(--glow)] sm:p-5 ${className}`}
    >
      {(title || action) && (
        <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
          <div>
            {title && <h2 className="text-h3">{title}</h2>}
            {subtitle && (
              <p className="text-small text-muted-foreground mt-0.5">{subtitle}</p>
            )}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  )
}

type Tone = 'default' | 'good' | 'bad' | 'warn'

const TONE_CLASS: Record<Tone, string> = {
  default: 'text-foreground',
  good: 'text-[var(--good)]',
  bad: 'text-[var(--bad)]',
  warn: 'text-[oklch(0.6_0.13_70)]',
}

export function Delta({ now, before }: { now: number; before: number }) {
  if (before === 0 && now === 0) return <span className="text-muted-foreground">no change</span>
  if (before === 0) return <span className="text-[var(--good)]">new</span>
  const pct = Math.round(((now - before) / before) * 100)
  const up = pct >= 0
  return (
    <span className={up ? 'text-[var(--good)]' : 'text-[var(--bad)]'}>
      {up ? '▲' : '▼'} {Math.abs(pct)}%
    </span>
  )
}

export function StatTile({
  label,
  value,
  hint,
  tone = 'default',
  spark,
}: {
  label: string
  value: ReactNode
  hint?: ReactNode
  tone?: Tone
  spark?: Array<number>
}) {
  return (
    <div className="bg-card border-border relative overflow-hidden rounded-2xl border p-4 shadow-[0_1px_0_var(--highlight)_inset]">
      <p className="field-label">{label}</p>
      <p className={`display-title mt-1 text-3xl leading-none font-extrabold tracking-tight ${TONE_CLASS[tone]}`}>
        {value}
      </p>
      {hint && <p className="text-caption text-muted-foreground mt-2">{hint}</p>}
      {spark && spark.length > 1 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 opacity-70">
          <Sparkline data={spark} height={34} />
        </div>
      )}
    </div>
  )
}

/** A filled line chart with no axes: shape and direction only. */
export function Sparkline({
  data,
  height = 48,
  className = '',
}: {
  data: Array<number>
  height?: number
  className?: string
}) {
  const w = 200
  const max = Math.max(1, ...data)
  const step = data.length > 1 ? w / (data.length - 1) : w
  const pts = data.map((v, i) => [i * step, height - 3 - (v / max) * (height - 8)] as const)
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  const area = `${line} L${w} ${height} L0 ${height} Z`
  return (
    <svg
      viewBox={`0 0 ${w} ${height}`}
      preserveAspectRatio="none"
      className={`block w-full ${className}`}
      style={{ height }}
      aria-hidden="true"
    >
      <path d={area} fill="var(--chart-1)" opacity="0.14" />
      <path d={line} fill="none" stroke="var(--chart-1)" strokeWidth="1.8" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

/** Daily columns with a label under the first and last bar. */
export function BarChart({
  data,
  height = 120,
  color = 'var(--chart-1)',
  labelFirst,
  labelLast,
}: {
  data: Array<number>
  height?: number
  color?: string
  labelFirst?: string
  labelLast?: string
}) {
  const max = Math.max(1, ...data)
  return (
    <div>
      <div className="flex items-end gap-[3px]" style={{ height }} role="img" aria-label="Daily counts">
        {data.map((v, i) => (
          <div
            key={i}
            title={String(v)}
            className="min-w-0 flex-1 rounded-t-[4px]"
            style={{ height: `${Math.max(v === 0 ? 2 : 6, (v / max) * 100)}%`, background: color, opacity: v === 0 ? 0.25 : 0.9 }}
          />
        ))}
      </div>
      {(labelFirst || labelLast) && (
        <div className="text-caption text-muted-foreground mt-1 flex justify-between">
          <span>{labelFirst}</span>
          <span>{labelLast}</span>
        </div>
      )}
    </div>
  )
}

/** Ranked horizontal bars with the value at the right. */
export function BarList({
  items,
  format = (n: number) => String(n),
}: {
  items: Array<{ label: string; value: number; sub?: string }>
  format?: (n: number) => string
}) {
  const max = Math.max(1, ...items.map((i) => i.value))
  if (items.length === 0) return <p className="text-small text-muted-foreground">Nothing yet.</p>
  return (
    <ul className="space-y-2.5">
      {items.map((i) => (
        <li key={i.label}>
          <div className="text-small mb-1 flex items-baseline justify-between gap-3">
            <span className="min-w-0 truncate font-medium">{i.label}</span>
            <span className="text-muted-foreground shrink-0 tabular-nums">{format(i.value)}</span>
          </div>
          <div className="bg-muted h-2 overflow-hidden rounded-full">
            <div className="bar-grad h-full rounded-full" style={{ width: `${(i.value / max) * 100}%` }} />
          </div>
          {i.sub && <p className="text-caption text-muted-foreground mt-0.5">{i.sub}</p>}
        </li>
      ))}
    </ul>
  )
}

export function Pill({ children, tone = 'default' }: { children: ReactNode; tone?: Tone }) {
  const map: Record<Tone, string> = {
    default: 'bg-muted text-muted-foreground',
    good: 'bg-[var(--good-bg)] text-[var(--good)]',
    bad: 'bg-[var(--bad-bg)] text-[var(--bad)]',
    warn: 'bg-[var(--p-yellow)] text-[oklch(0.45_0.1_70)]',
  }
  return (
    <span className={`text-caption inline-flex items-center rounded-full px-2 py-0.5 font-semibold ${map[tone]}`}>
      {children}
    </span>
  )
}

/** Quiet empty / error states so a screen never shows a blank hole. */
export function Notice({ tone = 'default', children }: { tone?: Tone; children: ReactNode }) {
  const map: Record<Tone, string> = {
    default: 'bg-muted/60 text-muted-foreground',
    good: 'bg-[var(--good-bg)] text-[var(--good)]',
    bad: 'bg-[var(--bad-bg)] text-[var(--bad)]',
    warn: 'bg-[var(--p-yellow)] text-[oklch(0.4_0.08_70)]',
  }
  return (
    <p role={tone === 'bad' ? 'alert' : undefined} className={`text-small rounded-xl px-3 py-2 ${map[tone]}`}>
      {children}
    </p>
  )
}
