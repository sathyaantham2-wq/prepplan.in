import { Check, FilePlus2, ScanLine } from 'lucide-react'
import type { SchoolModule } from '../../lib/schools/modules'

// The two parts of PrepPlan a school can use, as two big tick cards (at least one stays ticked).
const PARTS: Array<{
  id: SchoolModule
  title: string
  text: string
  icon: typeof FilePlus2
}> = [
  {
    id: 'papers',
    title: 'Make exam papers',
    text: 'Choose the chapters and a pattern. Get the question paper and the answer key, in Word and PDF.',
    icon: FilePlus2,
  },
  {
    id: 'correction',
    title: 'AI correction of answer sheets',
    text: 'Upload any question paper and each student’s answer sheets. The AI marks them; your teachers check.',
    icon: ScanLine,
  },
]

export function ModulePicker({
  value,
  onChange,
  disabled = false,
}: {
  value: Array<SchoolModule>
  onChange: (v: Array<SchoolModule>) => void
  disabled?: boolean
}) {
  return (
    <fieldset className="space-y-3" data-testid="module-picker">
      <legend className="sr-only">What will you use PrepPlan for?</legend>
      {PARTS.map((p) => {
        const on = value.includes(p.id)
        const last = on && value.length === 1
        return (
          <label
            key={p.id}
            className={`flex cursor-pointer items-start gap-4 rounded-2xl border-2 p-4 transition-colors ${on ? 'border-emerald-600 bg-emerald-50/60' : 'border-slate-200 bg-white hover:border-slate-300'} ${disabled ? 'opacity-60' : ''}`}
          >
            <input
              type="checkbox"
              className="sr-only"
              checked={on}
              disabled={disabled || last}
              onChange={() =>
                onChange(
                  on
                    ? value.filter((m) => m !== p.id)
                    : [...value, p.id].sort(),
                )
              }
            />
            <span
              aria-hidden="true"
              className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${on ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}
            >
              <p.icon className="size-6" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="font-display block text-lg font-bold text-slate-900">
                {p.title}
              </span>
              <span className="mt-0.5 block text-[15px] text-slate-600">
                {p.text}
              </span>
              {last ? (
                <span className="mt-1 block text-sm text-slate-500">
                  At least one part stays on.
                </span>
              ) : null}
            </span>
            <span
              aria-hidden="true"
              className={`mt-1 flex size-6 shrink-0 items-center justify-center rounded-md border-2 ${on ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300 bg-white'}`}
            >
              {on ? <Check className="size-4" strokeWidth={3} /> : null}
            </span>
          </label>
        )
      })}
    </fieldset>
  )
}
