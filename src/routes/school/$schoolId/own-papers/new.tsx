import { useMemo, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useSchool } from '../../../../components/school/context'
import {
  Btn,
  Card,
  Notice,
  Select,
  TextInput,
} from '../../../../components/school/ui'
import { api, fileToBase64 } from '../../../../lib/school-client'

export const Route = createFileRoute('/school/$schoolId/own-papers/new')({
  component: NewOwnPaper,
})

const TOTAL_LIMIT = 3_300_000
const ACCEPT = '.docx,.pdf,image/jpeg,image/png,image/webp'

/** A photo of a printed paper only has to be readable, so it is brought to a size the upload can carry. */
async function smallerPhoto(file: File): Promise<File> {
  if (!file.type.startsWith('image/') || file.size < 600_000) return file
  const bitmap = await createImageBitmap(file, {
    imageOrientation: 'from-image',
  })
  const scale = Math.min(1, 2000 / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  const blob = await new Promise<Blob | null>((r) =>
    canvas.toBlob(r, 'image/jpeg', 0.85),
  )
  return blob
    ? new File([blob], file.name.replace(/\.\w+$/, '') + '.jpg', {
        type: 'image/jpeg',
      })
    : file
}

const Pick = ({
  id,
  label,
  onFiles,
  multiple,
}: {
  id: string
  label: string
  onFiles: (f: Array<File>) => void
  multiple: boolean
}) => (
  <label
    htmlFor={id}
    className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-base font-semibold text-slate-800 hover:bg-slate-50"
  >
    <input
      id={id}
      type="file"
      className="sr-only"
      multiple={multiple}
      accept={ACCEPT}
      onChange={(e) => {
        const f = Array.from(e.target.files ?? [])
        e.target.value = ''
        if (f.length > 0) onFiles(f)
      }}
    />
    {label}
  </label>
)

function NewOwnPaper() {
  const { schoolId, overview } = useSchool()
  const navigate = useNavigate()
  const mine = new Set(
    overview.assignments
      .filter((a) => a.memberId === overview.me.memberId)
      .map((a) => a.schoolSubjectId),
  )
  const choices = useMemo(
    () =>
      overview.classes.flatMap((c) =>
        c.subjects
          .filter((s) => overview.role === 'school_admin' || mine.has(s.id))
          .map((s) => ({ id: s.id, label: `Class ${c.grade} · ${s.name}` })),
      ),
    [overview],
  )
  const [subject, setSubject] = useState(choices[0]?.id ?? '')
  const [title, setTitle] = useState('')
  const [paper, setPaper] = useState<Array<File>>([])
  const [key, setKey] = useState<Array<File>>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const total = [...paper, ...key].reduce((n, f) => n + f.size, 0)

  async function send() {
    setBusy(true)
    setError(null)
    try {
      const enc = async (fs: Array<File>) =>
        Promise.all(
          fs.map(async (f) => ({
            name: f.name,
            media_type: f.type,
            data: await fileToBase64(f),
          })),
        )
      const r = await api<{ paperId: string }>(
        `/api/schools/${schoolId}/own-papers`,
        {
          body: {
            school_subject_id: subject,
            title,
            files: await enc(paper),
            key_files: await enc(key),
          },
        },
      )
      await navigate({
        to: '/school/$schoolId/own-papers/$paperId',
        params: { schoolId, paperId: r.paperId },
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
      setBusy(false)
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Use your own paper</h1>
      {choices.length === 0 ? (
        <Notice>
          Add a class and a subject first (and, for a teacher, be given a
          subject by the school office).
        </Notice>
      ) : (
        <Card className="space-y-4">
          <Select
            label="Which subject is it for?"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            {choices.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </Select>
          <TextInput
            label="Name of the paper"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            hint="For example Unit Test 2."
          />
          <div className="space-y-2">
            <p className="text-base font-medium">The question paper</p>
            <p className="text-sm text-slate-600">
              A Word file (.docx), a PDF with text, or photos of the pages. A
              paper made by PrepPlan and edited in Word is read exactly.
            </p>
            <Pick
              id="paper-files"
              label={
                paper.length
                  ? 'Choose a different file'
                  : 'Choose the question paper'
              }
              multiple
              onFiles={async (f) =>
                setPaper(await Promise.all(f.map(smallerPhoto)))
              }
            />
            {paper.length > 0 ? (
              <p className="text-base break-words" data-testid="paper-chosen">
                {paper.map((f) => f.name).join(', ')}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <p className="text-base font-medium">
              Your answer key (if you have one)
            </p>
            <p className="text-sm text-slate-600">
              If you do not, we draft one and you check every answer before
              anything is marked.
            </p>
            <Pick
              id="key-files"
              label={
                key.length
                  ? 'Choose a different key file'
                  : 'Choose the answer key'
              }
              multiple
              onFiles={async (f) =>
                setKey(await Promise.all(f.map(smallerPhoto)))
              }
            />
            {key.length > 0 ? (
              <p className="text-base break-words">
                {key.map((f) => f.name).join(', ')}
              </p>
            ) : null}
          </div>
          {total > TOTAL_LIMIT ? (
            <Notice kind="error">
              These files are {(total / 1_000_000).toFixed(1)} MB in all. The
              limit is {(TOTAL_LIMIT / 1_000_000).toFixed(1)} MB. Use a smaller
              file.
            </Notice>
          ) : null}
          {error ? <Notice kind="error">{error}</Notice> : null}
          <Btn
            className="w-full"
            disabled={
              busy ||
              paper.length === 0 ||
              title.trim().length < 2 ||
              total > TOTAL_LIMIT
            }
            onClick={() => void send()}
          >
            {busy ? 'Sending…' : 'Upload and read the paper'}
          </Btn>
        </Card>
      )}
    </div>
  )
}
