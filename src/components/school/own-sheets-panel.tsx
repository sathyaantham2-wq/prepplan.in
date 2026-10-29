import { useCallback, useEffect, useState } from 'react'
import { Btn, Card, Chip, Notice, Select } from './ui'
import { api, openPdf } from '../../lib/school-client'
import {
  filesToOriginalPages,
  sendInPieces,
} from '../../lib/school-scan-client'
import type {
  OwnSheetResult,
  OwnSheetsSummary,
} from '../../lib/schools/own-sheets'

interface Loaded extends OwnSheetsSummary {
  sections: Array<{ id: string; name: string; students: number }>
}

/** "12.pdf", "12-p2.jpg", "roll 12.png" -> "12". */
export function rollFromFileName(name: string): string | null {
  const base = name.replace(/\.[^.]+$/, '')
  const m =
    /^(?:roll[\s_-]*)?([A-Za-z0-9]+?)(?:[\s_-]+p?\d{1,2}|[\s_-]*p\d{1,2})?$/i.exec(
      base.trim(),
    )
  return m ? m[1] : null
}

export function AnswerSheets({ base }: { base: string }) {
  const [d, setD] = useState<Loaded | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [sectionId, setSectionId] = useState('')
  const [lines, setLines] = useState<Array<string>>([])
  const [pick, setPick] = useState<Record<string, string>>({})

  const load = useCallback(async () => {
    try {
      const x = await api<Loaded>(`${base}/sheets`)
      setD(x)
      setSectionId((s) => s || x.sections[0]?.id || '')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    }
  }, [base])
  useEffect(() => {
    void load()
  }, [load])

  async function covers() {
    setBusy(true)
    setError(null)
    try {
      await openPdf(`${base}/covers?section_id=${sectionId}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  async function sendOne(
    blob: Blob,
    name: string,
    extra: Record<string, unknown>,
  ) {
    const { uploadId, chunks } = await sendInPieces(base, blob, 'sheet-chunks')
    return api<OwnSheetResult>(`${base}/sheets`, {
      body: { action: 'add', upload_id: uploadId, chunks, name, ...extra },
    })
  }

  /** A stack scanned in order, cover page first for each student. */
  async function sendStack(files: Array<File>) {
    setBusy(true)
    setError(null)
    setLines([])
    try {
      const pages = await filesToOriginalPages(files)
      let current: string | null = null
      const out: Array<string> = []
      for (const p of pages) {
        const r = await sendOne(p.blob, p.source, {
          current_student_id: current,
        })
        if (r.status !== 'rejected') current = r.studentId ?? current
        if (r.status === 'unplaced') current = null
        out.push(`${p.source}: ${r.message}`)
        setLines([...out])
      }
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  /** One file (or a few) per student, named by roll number. */
  async function sendByRoll(files: Array<File>) {
    if (!d) return
    setBusy(true)
    setError(null)
    setLines([])
    try {
      const inSection = d.students.filter((s) => s.section === sectionName())
      const out: Array<string> = []
      const todo: Array<{ file: File; studentId: string }> = []
      for (const f of files) {
        const roll = rollFromFileName(f.name)
        const s = inSection.find(
          (x) => x.rollNo.toLowerCase() === (roll ?? '').toLowerCase(),
        )
        if (!s)
          out.push(
            `${f.name}: no student with roll number "${roll ?? ''}" in this section. Not sent.`,
          )
        else todo.push({ file: f, studentId: s.schoolStudentId })
      }
      setLines([...out])
      for (const t of todo) {
        for (const p of await filesToOriginalPages([t.file])) {
          const r = await sendOne(p.blob, p.source, { student_id: t.studentId })
          out.push(`${p.source}: ${r.message}`)
          setLines([...out])
        }
      }
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  function sectionName() {
    return d?.sections.find((s) => s.id === sectionId)?.name ?? ''
  }

  async function assign(sheetId: string) {
    const studentId = pick[sheetId]
    if (!studentId) return
    setError(null)
    try {
      await api(`${base}/sheets`, {
        body: { action: 'assign', sheet_id: sheetId, student_id: studentId },
      })
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    }
  }

  if (!d) return error ? <Notice kind="error">{error}</Notice> : null
  const mine = d.students.filter((s) => s.section === sectionName())
  return (
    <Card className="space-y-3" data-testid="own-sheets">
      <h2 className="text-lg font-bold">Answer sheets</h2>
      <p className="text-base text-slate-700">
        Print a cover page for each student and staple it on top of her answer
        sheets. Scan the stack in order, cover page first.
      </p>
      {error ? <Notice kind="error">{error}</Notice> : null}
      <Select
        label="For which section"
        value={sectionId}
        onChange={(e) => setSectionId(e.target.value)}
      >
        {d.sections.map((s) => (
          <option key={s.id} value={s.id}>
            Section {s.name} ({s.students} students)
          </option>
        ))}
      </Select>
      <Btn
        className="w-full"
        disabled={busy || !sectionId}
        onClick={() => void covers()}
      >
        {busy ? 'Please wait…' : 'Print the cover pages (PDF)'}
      </Btn>

      <label className="block text-base font-medium">
        Upload the scanned stack (PDF or photos, in order)
        <input
          type="file"
          multiple
          accept="application/pdf,image/*"
          disabled={busy}
          data-testid="own-stack-input"
          className="mt-1 block w-full text-base"
          onChange={(e) => {
            const f = Array.from(e.target.files ?? [])
            e.target.value = ''
            if (f.length > 0) void sendStack(f)
          }}
        />
      </label>
      <details className="rounded-xl border border-slate-200 px-3 py-2">
        <summary className="cursor-pointer text-base font-medium">
          No cover pages? Upload one file per student
        </summary>
        <p className="mt-2 text-base text-slate-700">
          Name each file with the roll number, for example 12.pdf, or 12-p2.jpg
          for a second page. Choose the section above first.
        </p>
        <input
          type="file"
          multiple
          accept="application/pdf,image/*"
          disabled={busy}
          data-testid="own-roll-input"
          className="mt-2 block w-full text-base"
          onChange={(e) => {
            const f = Array.from(e.target.files ?? [])
            e.target.value = ''
            if (f.length > 0) void sendByRoll(f)
          }}
        />
      </details>

      {lines.length > 0 ? (
        <ul
          className="space-y-1 text-base text-slate-700"
          data-testid="own-sheet-log"
        >
          {lines.map((l, i) => (
            <li key={i}>{l}</li>
          ))}
        </ul>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Chip tone="good">{d.totals.received} received</Chip>
        <Chip>{d.totals.none} not yet</Chip>
        {d.totals.unplaced > 0 ? (
          <Chip tone="wait">{d.totals.unplaced} waiting for a student</Chip>
        ) : null}
      </div>
      <ul className="space-y-1 text-base" data-testid="own-sheet-students">
        {mine.map((s) => (
          <li key={s.schoolStudentId} className="flex justify-between gap-2">
            <span>
              {s.rollNo} · {s.name}
            </span>
            <span
              className={
                s.state === 'received' ? 'font-medium' : 'text-slate-600'
              }
            >
              {s.state === 'received'
                ? `${s.pages} ${s.pages === 1 ? 'page' : 'pages'}`
                : 'none'}
            </span>
          </li>
        ))}
      </ul>

      {d.unplaced.length > 0 ? (
        <div className="space-y-2 border-t border-slate-200 pt-3">
          <h3 className="text-base font-bold">Pages waiting for a student</h3>
          {d.unplaced.map((u) => (
            <div
              key={u.id}
              className="space-y-2 rounded-xl border border-slate-200 p-3"
            >
              <p className="text-base">
                {u.name ?? 'A page'}
                {u.reason ? ` · ${u.reason}` : ''}
              </p>
              {u.url ? (
                <a
                  href={u.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-base underline"
                >
                  Look at the page
                </a>
              ) : null}
              <Select
                label="Whose page is this"
                value={pick[u.id] ?? ''}
                onChange={(e) => setPick({ ...pick, [u.id]: e.target.value })}
              >
                <option value="">Choose a student</option>
                {d.students.map((s) => (
                  <option key={s.schoolStudentId} value={s.schoolStudentId}>
                    {s.section} · {s.rollNo} · {s.name}
                  </option>
                ))}
              </Select>
              <Btn disabled={!pick[u.id]} onClick={() => void assign(u.id)}>
                Put it with this student
              </Btn>
            </div>
          ))}
        </div>
      ) : null}
    </Card>
  )
}
