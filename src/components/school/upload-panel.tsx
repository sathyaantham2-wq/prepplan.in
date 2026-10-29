import { useState } from 'react'
import { Btn, Card, Notice, TextInput } from './ui'
import { api, downloadText, fileToBase64 } from '../../lib/school-client'

interface Preview {
  batchId: string
  counts: { new: number; unchanged: number; errors: number }
  rows: Array<{
    row: number
    status: 'new' | 'unchanged' | 'error'
    message?: string
  }>
  committable: boolean
}

const SAMPLE = {
  students:
    'Name,Class,Section,Roll No,Admission No,Parent Phone\nAsha Rao,7,A,1,2024/0101,9876543210\n',
  teachers: 'Name,Email\nMeena Iyer,meena@yourschool.in\n',
}

/** Choose a file, check it, see what is wrong, then add. Nobody is added until "Add them" is pressed. */
export function UploadPanel({
  schoolId,
  kind,
  defaultYear,
  onDone,
  onCancel,
}: {
  schoolId: string
  kind: 'students' | 'teachers'
  defaultYear: string
  onDone: () => void
  onCancel: () => void
}) {
  const [file, setFile] = useState<File | null>(null)
  const [year, setYear] = useState(defaultYear)
  const [preview, setPreview] = useState<Preview | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [added, setAdded] = useState<number | null>(null)
  const noun = kind === 'students' ? 'students' : 'teachers'

  async function check() {
    if (!file) return
    setBusy(true)
    setError(null)
    setPreview(null)
    try {
      setPreview(
        await api<Preview>(`/api/schools/${schoolId}/imports`, {
          body: {
            kind,
            academic_year: kind === 'students' ? year : undefined,
            file_name: file.name,
            content_base64: await fileToBase64(file),
          },
        }),
      )
    } catch (e) {
      setError(e instanceof Error ? e.message : 'We could not read that file.')
    } finally {
      setBusy(false)
    }
  }

  async function commit() {
    if (!preview) return
    setBusy(true)
    setError(null)
    try {
      const r = await api<{ added: number }>(
        `/api/schools/${schoolId}/imports/${preview.batchId}/commit`,
        { method: 'POST', body: {} },
      )
      setAdded(r.added)
      onDone()
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'Nothing was added. Please try again.',
      )
    } finally {
      setBusy(false)
    }
  }

  if (added !== null) {
    return (
      <Card className="space-y-3">
        <Notice kind="good">
          Done. {added} {noun} added.
        </Notice>
        <Btn kind="plain" className="w-full" onClick={onCancel}>
          Close
        </Btn>
      </Card>
    )
  }

  return (
    <Card className="space-y-4">
      <h2 className="text-xl font-bold">Add {noun} from a file</h2>
      <p className="text-base text-slate-700">
        Use an Excel or CSV file with one{' '}
        {kind === 'students' ? 'student' : 'teacher'} on each line.
      </p>
      <Btn
        kind="plain"
        className="w-full"
        onClick={() => downloadText(`${kind}-sample.csv`, SAMPLE[kind])}
      >
        Download a sample file
      </Btn>
      <label className="block">
        <span className="mb-1.5 block text-base font-medium">Your file</span>
        <input
          type="file"
          accept=".xlsx,.csv"
          className="block min-h-12 w-full text-base file:mr-3 file:min-h-12 file:rounded-lg file:border file:border-slate-300 file:bg-white file:px-4 file:text-base file:font-semibold"
          onChange={(e) => {
            setFile(e.target.files?.[0] ?? null)
            setPreview(null)
            setError(null)
          }}
        />
      </label>
      {kind === 'students' ? (
        <TextInput
          label="School year"
          hint="For example 2026-27. The classes must already be added."
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
      ) : null}
      {error ? <Notice kind="error">{error}</Notice> : null}
      <Btn
        className="w-full"
        disabled={!file || busy || (kind === 'students' && !year.trim())}
        onClick={check}
      >
        {busy && !preview ? 'Checking…' : 'Check my file'}
      </Btn>

      {preview ? (
        <div className="space-y-3" aria-live="polite">
          <p className="text-base">
            <b>{preview.counts.new}</b> ready to add ·{' '}
            <b>{preview.counts.unchanged}</b> already there ·{' '}
            <b className={preview.counts.errors ? 'text-red-700' : ''}>
              {preview.counts.errors}
            </b>{' '}
            need fixing
          </p>
          {preview.counts.errors ? (
            <>
              <Notice kind="error">
                Fix these lines in your file, then check it again. Nobody has
                been added yet.
              </Notice>
              <ul className="space-y-2">
                {preview.rows
                  .filter((r) => r.status === 'error')
                  .slice(0, 50)
                  .map((r) => (
                    <li
                      key={r.row}
                      className="rounded-lg border border-red-200 bg-white px-3 py-2 text-base"
                    >
                      <b>Line {r.row}:</b> {r.message}
                    </li>
                  ))}
              </ul>
            </>
          ) : preview.committable ? (
            <Btn className="w-full" disabled={busy} onClick={commit}>
              {busy ? 'Adding…' : `Add ${preview.counts.new} ${noun}`}
            </Btn>
          ) : (
            <Notice>Everyone in this file is already added.</Notice>
          )}
        </div>
      ) : null}
      <Btn kind="plain" className="w-full" onClick={onCancel}>
        Cancel
      </Btn>
    </Card>
  )
}
