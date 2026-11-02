import { Btn } from './ui'
import { CRITERION_KINDS } from '../../lib/schools/rubric'
import type { Criterion } from '../../lib/schools/rubric'

// The teacher's rubric for a descriptive question: criteria, the marks each is worth, and what earns each level.
// The criteria must add up to the question's marks; the server checks it too.
const KIND_TEXT: Record<Criterion['kind'], string> = {
  concept: 'Concept',
  key_points: 'Key points',
  explanation: 'Explanation',
  conclusion: 'Conclusion',
  diagram: 'Diagram',
  language: 'Language',
}

export function blankCriterion(marks: number): Criterion {
  return { kind: 'concept', marks, descriptor: '', levels: [] }
}

export function RubricEditor({
  value,
  onChange,
  questionMarks,
}: {
  value: Array<Criterion>
  onChange: (next: Array<Criterion>) => void
  questionMarks: number
}) {
  const total = value.reduce((n, c) => n + (Number.isFinite(c.marks) ? c.marks : 0), 0)
  const set = (i: number, patch: Partial<Criterion>) =>
    onChange(value.map((c, j) => (j === i ? { ...c, ...patch } : c)))
  return (
    <div className="space-y-3" data-testid="rubric-editor">
      {value.map((c, i) => (
        <div key={i} className="space-y-2 rounded-lg border border-slate-300 p-3">
          <div className="flex flex-wrap items-end gap-2">
            <label className="text-sm font-semibold">
              Kind
              <select
                className="mt-1 block min-h-11 rounded-lg border border-slate-400 px-2 text-base font-normal"
                value={c.kind}
                onChange={(e) => set(i, { kind: e.target.value as Criterion['kind'] })}
              >
                {CRITERION_KINDS.map((k) => (
                  <option key={k} value={k}>
                    {KIND_TEXT[k]}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-semibold">
              Marks
              <input
                type="number"
                min={0.5}
                step={0.5}
                value={c.marks}
                onChange={(e) => set(i, { marks: Number(e.target.value) })}
                className="mt-1 block min-h-11 w-20 rounded-lg border border-slate-400 px-2 text-base font-normal"
              />
            </label>
            <Btn kind="plain" onClick={() => onChange(value.filter((_, j) => j !== i))}>
              Remove
            </Btn>
          </div>
          <label className="block text-sm font-semibold">
            What earns this criterion
            <input
              type="text"
              maxLength={400}
              value={c.descriptor}
              onChange={(e) => set(i, { descriptor: e.target.value })}
              className="mt-1 block min-h-11 w-full rounded-lg border border-slate-400 px-3 text-base font-normal"
            />
          </label>
          {c.levels.map((l, li) => (
            <div key={li} className="flex flex-wrap items-end gap-2">
              <label className="text-sm font-semibold">
                Level marks
                <input
                  type="number"
                  min={0}
                  step={0.5}
                  value={l.marks}
                  onChange={(e) =>
                    set(i, { levels: c.levels.map((x, k) => (k === li ? { ...x, marks: Number(e.target.value) } : x)) })
                  }
                  className="mt-1 block min-h-11 w-20 rounded-lg border border-slate-400 px-2 text-base font-normal"
                />
              </label>
              <label className="min-w-0 flex-1 text-sm font-semibold">
                The answer says
                <input
                  type="text"
                  maxLength={300}
                  value={l.says}
                  onChange={(e) =>
                    set(i, { levels: c.levels.map((x, k) => (k === li ? { ...x, says: e.target.value } : x)) })
                  }
                  className="mt-1 block min-h-11 w-full rounded-lg border border-slate-400 px-3 text-base font-normal"
                />
              </label>
              <Btn kind="plain" onClick={() => set(i, { levels: c.levels.filter((_, k) => k !== li) })}>
                Remove level
              </Btn>
            </div>
          ))}
          <Btn kind="plain" onClick={() => set(i, { levels: [...c.levels, { marks: c.marks, says: '' }] })}>
            Add a level
          </Btn>
        </div>
      ))}
      {value.length < 8 ? (
        <Btn kind="plain" onClick={() => onChange([...value, blankCriterion(0.5)])}>
          Add a criterion
        </Btn>
      ) : null}
      <p
        className={`text-base font-semibold ${Math.abs(total - questionMarks) < 0.01 ? 'text-emerald-800' : 'text-red-700'}`}
        data-testid="rubric-total"
      >
        The criteria add up to {total} of {questionMarks} marks.
      </p>
    </div>
  )
}
