import { useEffect, useId } from 'react'
import type { ReactNode } from 'react'

// The school screens' own small building blocks. They deliberately do not use the personal
// PrepPlan look (pastel washes, glass cards, sounds): plain white, dark green, big tap targets.

const base =
  'inline-flex min-h-12 items-center justify-center rounded-lg px-4 text-base font-semibold transition disabled:cursor-not-allowed disabled:opacity-50'
export function Btn({
  kind = 'primary',
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  kind?: 'primary' | 'plain' | 'danger'
}) {
  const look =
    kind === 'primary'
      ? 'bg-emerald-700 text-white hover:bg-emerald-800'
      : kind === 'danger'
        ? 'border border-red-300 bg-white text-red-700 hover:bg-red-50'
        : 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
  return (
    <button
      type="button"
      {...props}
      className={`${base} ${look} ${className}`}
    />
  )
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
        className="block text-base font-medium text-slate-900"
      >
        {label}
      </label>
      {children(id)}
      {hint ? <p className="text-sm text-slate-600">{hint}</p> : null}
    </div>
  )
}

export const inputClass =
  'block min-h-12 w-full rounded-lg border border-slate-400 bg-white px-3 text-base text-slate-900 placeholder:text-slate-500 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/30'

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

export function Card({
  children,
  className = '',
  ...rest
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <section
      {...rest}
      className={`rounded-xl border border-slate-300 bg-white p-4 sm:p-5 ${className}`}
    >
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
      ? 'border-red-300 bg-red-50 text-red-900'
      : kind === 'good'
        ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
        : 'border-slate-300 bg-slate-50 text-slate-800'
  return (
    <div
      role={kind === 'error' ? 'alert' : 'status'}
      className={`rounded-lg border px-4 py-3 text-base ${look}`}
    >
      {children}
    </div>
  )
}

export function Chip({
  children,
  tone = 'plain',
}: {
  children: ReactNode
  tone?: 'plain' | 'good' | 'wait'
}) {
  const look =
    tone === 'good'
      ? 'bg-emerald-100 text-emerald-900'
      : tone === 'wait'
        ? 'bg-amber-100 text-amber-900'
        : 'bg-slate-100 text-slate-800'
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-sm font-medium ${look}`}
    >
      {children}
    </span>
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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="max-h-[90vh] w-full max-w-md overflow-auto rounded-t-2xl bg-white p-5 sm:rounded-2xl"
      >
        <h2 className="mb-3 text-xl font-bold text-slate-900">{title}</h2>
        {children}
        <Btn kind="plain" className="mt-4 w-full" onClick={onClose}>
          Close
        </Btn>
      </div>
    </div>
  )
}
