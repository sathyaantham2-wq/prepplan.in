import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useBlocker } from '@tanstack/react-router'
import { CheckCircle2, ChevronLeft, ChevronRight, HelpCircle, Search, X } from 'lucide-react'
import { Btn, inputClass } from './ui'

// The shared parts of the redesigned school screens (docs/schools/UI_REDESIGN_PLAN.md, section 4): toasts, a confirm
// box, a right-side panel (drawer) that asks before unsaved changes are lost, a "?" tip, form controls and a table
// that turns into cards on a phone. Colours come from the school palette (school-theme.ts), so both themes work.

// ---------------------------------------------------------------- the frame's services (toast, confirm, theme)

export interface ConfirmOptions {
  title: string
  body?: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
}
interface ShellCtx {
  dark: boolean
  setDark: (on: boolean) => void
  toast: (text: string) => void
  confirm: (o: ConfirmOptions) => Promise<boolean>
}
const ShellContext = createContext<ShellCtx | null>(null)

/** The frame's services, or null outside the school frame (the public progress link page). */
export function useMaybeShell(): ShellCtx | null {
  return useContext(ShellContext)
}

/** The frame's services. Outside the school frame they fall back to plain browser behaviour. */
export function useShell(): ShellCtx {
  return (
    useContext(ShellContext) ?? {
      dark: false,
      setDark: () => undefined,
      toast: () => undefined,
      confirm: (o) => Promise.resolve(window.confirm(o.title)),
    }
  )
}

const THEME_KEY = 'prepplan-school-theme'

export function ShellProvider({ children, render }: { children?: ReactNode; render: (dark: boolean) => ReactNode }) {
  const [dark, setDarkState] = useState(false)
  const [toasts, setToasts] = useState<Array<{ id: number; text: string }>>([])
  const [ask, setAsk] = useState<(ConfirmOptions & { resolve: (ok: boolean) => void }) | null>(null)
  const next = useRef(1)
  useEffect(() => {
    try {
      setDarkState(window.localStorage.getItem(THEME_KEY) === 'dark')
    } catch {
      // private window: light
    }
  }, [])
  const setDark = useCallback((on: boolean) => {
    setDarkState(on)
    try {
      window.localStorage.setItem(THEME_KEY, on ? 'dark' : 'light')
    } catch {
      // ignore
    }
  }, [])
  const toast = useCallback((text: string) => {
    const id = next.current++
    setToasts((t) => [...t, { id, text }])
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500)
  }, [])
  const confirm = useCallback(
    (o: ConfirmOptions) => new Promise<boolean>((resolve) => setAsk({ ...o, resolve })),
    [],
  )
  const value = useMemo(() => ({ dark, setDark, toast, confirm }), [dark, setDark, toast, confirm])
  const close = (ok: boolean) => {
    ask?.resolve(ok)
    setAsk(null)
  }
  return (
    <ShellContext.Provider value={value}>
      {render(dark)}
      {children}
      <div aria-live="polite" className="pointer-events-none fixed right-4 bottom-4 z-[70] flex flex-col items-end gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            data-testid="toast"
            className="pointer-events-auto flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-[15px] font-semibold text-slate-900 shadow-lg"
          >
            <CheckCircle2 aria-hidden="true" className="size-5 text-emerald-700" />
            {t.text}
          </div>
        ))}
      </div>
      {ask ? <ConfirmBox o={ask} onClose={close} /> : null}
    </ShellContext.Provider>
  )
}

function ConfirmBox({ o, onClose }: { o: ConfirmOptions; onClose: (ok: boolean) => void }) {
  const titleId = useId()
  const okRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    okRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4">
      <div role="alertdialog" aria-modal="true" aria-labelledby={titleId} data-testid="confirm" className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl">
        <h2 id={titleId} className="text-lg font-bold text-slate-900">
          {o.title}
        </h2>
        {o.body ? <div className="mt-2 text-[15px] text-slate-700">{o.body}</div> : null}
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <Btn kind="plain" onClick={() => onClose(false)}>
            {o.cancelLabel ?? 'Cancel'}
          </Btn>
          <Btn ref={okRef} kind={o.danger ? 'danger' : 'primary'} onClick={() => onClose(true)} data-testid="confirm-yes">
            {o.confirmLabel ?? 'Yes'}
          </Btn>
        </div>
      </div>
    </div>
  )
}

/** Asks before leaving the page (or closing the tab) while there are unsaved changes. */
export function useUnsavedGuard(dirty: boolean) {
  const { confirm } = useShell()
  useBlocker({
    shouldBlockFn: async () =>
      dirty &&
      !(await confirm({ title: 'Leave without saving?', body: 'Your changes on this page will be lost.', confirmLabel: 'Leave', cancelLabel: 'Stay', danger: true })),
    enableBeforeUnload: () => dirty,
  })
}

// ---------------------------------------------------------------- the right-side panel

export function Drawer({
  open,
  title,
  help,
  onClose,
  dirty = false,
  footer,
  children,
  testId,
}: {
  open: boolean
  title: string
  help?: ReactNode
  onClose: () => void
  /** true while the form has unsaved changes: closing asks first */
  dirty?: boolean
  footer?: ReactNode
  children: ReactNode
  testId?: string
}) {
  const { confirm } = useShell()
  const titleId = useId()
  const panel = useRef<HTMLDivElement>(null)
  const tryClose = useCallback(async () => {
    if (dirty && !(await confirm({ title: 'Close without saving?', body: 'What you typed here will be lost.', confirmLabel: 'Close', cancelLabel: 'Keep editing', danger: true })))
      return
    onClose()
  }, [dirty, confirm, onClose])
  useEffect(() => {
    if (!open) return
    const first = panel.current?.querySelector<HTMLElement>('input, select, textarea, button:not([data-drawer-close])')
    first?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && void tryClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, tryClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[60]">
      <div aria-hidden="true" className="absolute inset-0 bg-black/40" onClick={() => void tryClose()} />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-testid={testId ?? 'drawer'}
        className="absolute inset-y-0 right-0 flex w-full max-w-lg flex-col border-l border-slate-200 bg-white shadow-2xl motion-safe:animate-[sc-slide_160ms_ease-out]"
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-5 py-4">
          <div className="min-w-0">
            <h2 id={titleId} className="text-lg font-bold text-slate-900">
              {title}
            </h2>
            {help ? <p className="mt-0.5 text-[15px] text-slate-600">{help}</p> : null}
          </div>
          <button
            type="button"
            data-drawer-close
            onClick={() => void tryClose()}
            aria-label="Close"
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">{children}</div>
        {footer ? <div className="flex flex-wrap justify-end gap-2 border-t border-slate-200 px-5 py-4">{footer}</div> : null}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------- small parts

/** A "?" that explains a word a teacher may not know. Opens on tap, hover or keyboard focus. */
export function InfoTip({ children, label = 'What does this mean?' }: { children: ReactNode; label?: string }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  return (
    <span className="relative inline-flex align-middle" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        aria-label={label}
        aria-describedby={open ? id : undefined}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="-my-2.5 inline-flex size-11 items-center justify-center rounded-full text-slate-500 hover:text-slate-800"
      >
        <HelpCircle aria-hidden="true" className="size-4" />
      </button>
      {open ? (
        <span
          id={id}
          role="tooltip"
          className="absolute top-9 left-1/2 z-50 w-64 -translate-x-1/2 rounded-lg border border-slate-200 bg-white p-3 text-left text-sm font-normal text-slate-800 shadow-lg"
        >
          {children}
        </span>
      ) : null}
    </span>
  )
}

/** A clearly visible checkbox with its label (and an optional line under it). */
export function Checkbox({
  label,
  hint,
  checked,
  onChange,
  disabled,
  testId,
}: {
  label: ReactNode
  hint?: ReactNode
  checked: boolean
  onChange: (on: boolean) => void
  disabled?: boolean
  testId?: string
}) {
  const id = useId()
  return (
    <div className="flex items-start gap-3">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        data-testid={testId}
        className="mt-0.5 size-5 shrink-0 cursor-pointer rounded border-slate-400"
      />
      <label htmlFor={id} className="cursor-pointer text-[15px] text-slate-900">
        {label}
        {hint ? <span className="block text-sm text-slate-600">{hint}</span> : null}
      </label>
    </div>
  )
}

/** An on/off switch with its label, for settings that take effect as a whole. */
export function Switch({
  label,
  hint,
  checked,
  onChange,
  testId,
}: {
  label: ReactNode
  hint?: ReactNode
  checked: boolean
  onChange: (on: boolean) => void
  testId?: string
}) {
  const id = useId()
  return (
    <div className="flex items-start justify-between gap-4">
      <label htmlFor={id} className="cursor-pointer text-[15px] text-slate-900">
        {label}
        {hint ? <span className="block text-sm text-slate-600">{hint}</span> : null}
      </label>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        data-testid={testId}
        onClick={() => onChange(!checked)}
        className="inline-flex h-11 w-14 shrink-0 items-center justify-center rounded-full"
      >
        <span
          aria-hidden="true"
          className={`relative inline-flex h-7 w-12 items-center rounded-full border transition-colors ${checked ? 'border-emerald-700 bg-emerald-700' : 'border-slate-400 bg-slate-200'}`}
        >
          <span className={`inline-block size-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
        </span>
      </button>
    </div>
  )
}

// ---------------------------------------------------------------- the table

export interface Column<T> {
  key: string
  header: ReactNode
  cell: (row: T) => ReactNode
  className?: string
  /** left out of the phone card (a detail the card does not need) */
  hideOnPhone?: boolean
}

/**
 * A list as a table with search and pages; on a phone each row is a card. `filters` sits next to the search box;
 * `empty` is what shows when there is nothing at all (not when a search finds nothing).
 */
export function DataTable<T>({
  rows,
  columns,
  rowKey,
  search,
  searchLabel = 'Search',
  filters,
  pageSize = 25,
  empty,
  onRowClick,
  testId,
}: {
  rows: ReadonlyArray<T>
  columns: ReadonlyArray<Column<T>>
  rowKey: (row: T) => string
  /** the text a row is searched by; no search box without it */
  search?: (row: T) => string
  searchLabel?: string
  filters?: ReactNode
  pageSize?: number
  empty?: ReactNode
  onRowClick?: (row: T) => void
  testId?: string
}) {
  const [q, setQ] = useState('')
  const [page, setPage] = useState(0)
  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return needle && search ? rows.filter((r) => search(r).toLowerCase().includes(needle)) : rows
  }, [rows, q, search])
  const pages = Math.max(1, Math.ceil(shown.length / pageSize))
  const at = Math.min(page, pages - 1)
  const slice = shown.slice(at * pageSize, at * pageSize + pageSize)
  if (rows.length === 0 && empty) return <>{empty}</>
  return (
    <div className="space-y-3" data-testid={testId}>
      {search || filters ? (
        <div className="flex flex-wrap items-end gap-3">
          {search ? (
            <label className="relative block min-w-0 flex-1 basis-60">
              <span className="sr-only">{searchLabel}</span>
              <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-500" />
              <input
                type="search"
                value={q}
                onChange={(e) => {
                  setQ(e.target.value)
                  setPage(0)
                }}
                placeholder={searchLabel}
                className={`${inputClass} pl-9`}
              />
            </label>
          ) : null}
          {filters}
        </div>
      ) : null}
      {shown.length === 0 ? (
        <p className="rounded-lg border border-slate-200 bg-white px-4 py-6 text-center text-[15px] text-slate-600">Nothing matches your search.</p>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white md:block">
            <table className="w-full text-left text-[15px]">
              <thead className="bg-slate-50">
                <tr>
                  {columns.map((c) => (
                    <th key={c.key} scope="col" className={`px-4 py-2.5 text-sm font-semibold text-slate-600 ${c.className ?? ''}`}>
                      {c.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {slice.map((r) => (
                  <tr
                    key={rowKey(r)}
                    className={`border-t border-slate-200 ${onRowClick ? 'cursor-pointer hover:bg-slate-50' : ''}`}
                    onClick={onRowClick ? () => onRowClick(r) : undefined}
                  >
                    {columns.map((c) => (
                      <td key={c.key} className={`px-4 py-3 align-middle text-slate-900 ${c.className ?? ''}`}>
                        {c.cell(r)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="space-y-2 md:hidden">
            {slice.map((r) => (
              <li
                key={rowKey(r)}
                className={`rounded-xl border border-slate-200 bg-white p-4 ${onRowClick ? 'cursor-pointer' : ''}`}
                onClick={onRowClick ? () => onRowClick(r) : undefined}
              >
                <dl className="space-y-1">
                  {columns
                    .filter((c) => !c.hideOnPhone)
                    .map((c, i) =>
                      i === 0 ? (
                        <div key={c.key} className="text-base font-semibold text-slate-900">
                          {c.cell(r)}
                        </div>
                      ) : (
                        <div key={c.key} className="flex flex-wrap items-center justify-between gap-2 text-[15px]">
                          <dt className="text-slate-600">{c.header}</dt>
                          <dd className="text-slate-900">{c.cell(r)}</dd>
                        </div>
                      ),
                    )}
                </dl>
              </li>
            ))}
          </ul>
          {pages > 1 ? (
            <nav aria-label="Pages" className="flex items-center justify-between gap-2 text-[15px] text-slate-700">
              <span>
                {at * pageSize + 1}–{Math.min(shown.length, (at + 1) * pageSize)} of {shown.length}
              </span>
              <span className="flex gap-2">
                <Btn kind="plain" disabled={at === 0} onClick={() => setPage(at - 1)} aria-label="Previous page">
                  <ChevronLeft aria-hidden="true" className="size-4" />
                </Btn>
                <Btn kind="plain" disabled={at >= pages - 1} onClick={() => setPage(at + 1)} aria-label="Next page">
                  <ChevronRight aria-hidden="true" className="size-4" />
                </Btn>
              </span>
            </nav>
          ) : null}
        </>
      )}
    </div>
  )
}
