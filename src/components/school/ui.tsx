import { useEffect, useId } from 'react'
import type { ReactNode } from 'react'
import { AlertCircle, CheckCircle2, Info, Loader2 } from 'lucide-react'

// The school screens' own building blocks. They deliberately do not use the personal PrepPlan
// look (pastel washes, glass cards, sounds): a calm light-grey page, white cards with a thin border,
// one dark green for actions, tap targets of at least 44 px and clear focus rings. Colours are the
// school palette (src/lib/schools/school-theme.ts), so every part works in the light and dark theme.
// The larger parts (drawer, table, toast, confirm, tip, switch) are in kit.tsx.

const base =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-[15px] font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50'
export function Btn({
  kind = 'primary',
  className = '',
  ...props
}: React.ComponentProps<'button'> & {
  kind?: 'primary' | 'plain' | 'danger'
}) {
  const look =
    kind === 'primary'
      ? 'bg-emerald-700 text-white hover:bg-emerald-800 active:bg-emerald-900'
      : kind === 'danger'
        ? 'border border-red-200 bg-white text-red-700 hover:border-red-300 hover:bg-red-50'
        : 'border border-slate-300 bg-white text-slate-800 shadow-xs hover:border-slate-400 hover:bg-slate-50'
  return (
    <button
      type="button"
      {...props}
      className={`${base} ${look} ${className}`}
    />
  )
}

/** The look of a button, for a link that leads somewhere. */
export const linkButton = {
  primary: `${base} bg-emerald-700 text-white hover:bg-emerald-800`,
  plain: `${base} border border-slate-300 bg-white text-slate-800 shadow-xs hover:border-slate-400 hover:bg-slate-50`,
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: (id: string) => ReactNode
}) {
  const id = useId()
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-[15px] font-semibold text-slate-900"
      >
        {label}
      </label>
      {children(id)}
      {hint ? <p className="text-sm text-slate-600">{hint}</p> : null}
    </div>
  )
}

export const inputClass =
  'block min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-[15px] text-slate-900 transition-colors placeholder:text-slate-500 hover:border-slate-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/15 focus:outline-none'

export function TextInput(
  props: React.InputHTMLAttributes<HTMLInputElement> & {
    label: string
    hint?: string
  },
) {
  const { label, hint, className = '', ...rest } = props
  return (
    <Field label={label} hint={hint}>
      {(id) => (
        <input id={id} {...rest} className={`${inputClass} ${className}`} />
      )}
    </Field>
  )
}

export function Select({
  label,
  hint,
  children,
  ...rest
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string
  hint?: string
}) {
  return (
    <Field label={label} hint={hint}>
      {(id) => (
        <select id={id} {...rest} className={inputClass}>
          {children}
        </select>
      )}
    </Field>
  )
}

export const cardClass =
  'rounded-xl border border-slate-200 bg-white p-4 text-slate-900 sm:p-5'

export function Card({
  children,
  className = '',
  ...rest
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <section {...rest} className={`${cardClass} ${className}`}>
      {children}
    </section>
  )
}

export function Notice({
  kind = 'info',
  children,
}: {
  kind?: 'info' | 'error' | 'good'
  children: ReactNode
}) {
  const look =
    kind === 'error'
      ? 'border-red-200 bg-red-50 text-red-900'
      : kind === 'good'
        ? 'border-emerald-200 bg-emerald-50 text-emerald-950'
        : 'border-sky-200 bg-sky-50 text-sky-900'
  const Icon =
    kind === 'error' ? AlertCircle : kind === 'good' ? CheckCircle2 : Info
  const iconColor =
    kind === 'error'
      ? 'text-red-600'
      : kind === 'good'
        ? 'text-emerald-600'
        : 'text-sky-800'
  return (
    <div
      role={kind === 'error' ? 'alert' : 'status'}
      className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-[15px] ${look}`}
    >
      <Icon
        aria-hidden="true"
        className={`mt-0.5 size-5 shrink-0 ${iconColor}`}
      />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}

export function Chip({
  children,
  tone = 'plain',
}: {
  children: ReactNode
  tone?: 'plain' | 'good' | 'wait' | 'bad'
}) {
  const look =
    tone === 'good'
      ? 'bg-emerald-50 text-emerald-800 ring-emerald-600/20'
      : tone === 'wait'
        ? 'bg-amber-50 text-amber-900 ring-amber-600/25'
        : tone === 'bad'
          ? 'bg-red-50 text-red-800 ring-red-600/20'
          : 'bg-slate-50 text-slate-700 ring-slate-500/20'
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-semibold ring-1 ring-inset ${look}`}
    >
      {children}
    </span>
  )
}

/**
 * The title of a screen: one plain line of help under it, and at most one main button on the right (`primary`;
 * `actions` is kept for screens with a pair of buttons). An optional link back sits above it.
 */
export function PageHeader({
  title,
  subtitle,
  help,
  back,
  actions,
  primary,
}: {
  title: ReactNode
  /** the same as `help` (older name) */
  subtitle?: ReactNode
  help?: ReactNode
  back?: ReactNode
  actions?: ReactNode
  primary?: ReactNode
}) {
  const line = help ?? subtitle
  return (
    <header className="space-y-1">
      {back ? (
        <div className="mb-2 text-[15px] font-semibold">{back}</div>
      ) : null}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-[26px] leading-tight font-bold text-slate-900">
            {title}
          </h1>
          {line ? (
            <p className="mt-1 text-base text-slate-600">{line}</p>
          ) : null}
        </div>
        {actions || primary ? (
          <div className="flex flex-wrap gap-2">
            {actions}
            {primary}
          </div>
        ) : null}
      </div>
    </header>
  )
}

/** A number and what it counts, for a row of figures. */
export function Stat({
  n,
  label,
  icon,
}: {
  n: ReactNode
  label: string
  icon?: ReactNode
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
      {icon ? (
        <div
          aria-hidden="true"
          className="mb-2 flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700"
        >
          {icon}
        </div>
      ) : null}
      <p className="font-display text-2xl font-bold text-slate-900 tabular-nums">
        {n}
      </p>
      <p className="text-sm font-medium text-slate-600">{label}</p>
    </div>
  )
}

/** What a list shows while it has nothing in it yet: what it is for and what to do first. */
export function EmptyState({
  icon,
  title,
  children,
  action,
  extra,
}: {
  icon?: ReactNode
  title: string
  children?: ReactNode
  action?: ReactNode
  /** a second, smaller link under the button (e.g. "Download the Excel template") */
  extra?: ReactNode
}) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center">
      {icon ? (
        <div
          aria-hidden="true"
          className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"
        >
          {icon}
        </div>
      ) : null}
      <p className="font-display text-lg font-bold text-slate-900">{title}</p>
      {children ? (
        <div className="mx-auto mt-1 max-w-sm text-base text-slate-600">
          {children}
        </div>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
      {extra ? <div className="mt-3 text-[15px]">{extra}</div> : null}
    </div>
  )
}

/** While a screen is fetching. The words stay for screen readers and for anyone on a slow line. */
export function Loading({ label = 'Loading…' }: { label?: string }) {
  return (
    <p
      role="status"
      className="flex items-center gap-2 py-6 text-base text-slate-600"
    >
      <Loader2
        aria-hidden="true"
        className="size-5 animate-spin text-emerald-700"
      />
      {label}
    </p>
  )
}

/** A box that opens over the page, for showing a one-time code. Closes with the button or Escape. */
export function Dialog({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: ReactNode
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="max-h-[90vh] w-full max-w-md overflow-auto rounded-t-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-2xl sm:rounded-xl"
      >
        <h2 className="mb-3 text-xl font-bold">{title}</h2>
        {children}
        <Btn kind="plain" className="mt-5 w-full" onClick={onClose}>
          Close
        </Btn>
      </div>
    </div>
  )
}
