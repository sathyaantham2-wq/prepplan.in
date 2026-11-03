import { useEffect, useState } from 'react'
import { useSchool } from './context'
import { useShell } from './kit'
import { Btn, Card, Notice } from './ui'
import { api } from '../../lib/school-client'
import type { MaskTemplate } from '../../lib/schools/mask-template'

// Which part of an answer sheet is painted white before a page picture goes to the marking AI.
// Percent values (0 to 100) of the first page; the picture on the right shows where the boxes fall.
type Row = { x: string; y: string; w: string; h: string }

const toRow = (b: MaskTemplate['boxes'][number]): Row => ({
  x: String(Math.round(b.x * 100)),
  y: String(Math.round(b.y * 100)),
  w: String(Math.round(b.w * 100)),
  h: String(Math.round(b.h * 100)),
})
const pct = (v: string) => Number(v) / 100

export function MaskSettings() {
  const { schoolId } = useSchool()
  const { toast } = useShell()
  const [rows, setRows] = useState<Array<Row>>([])
  const [everyPage, setEveryPage] = useState(false)
  const [custom, setCustom] = useState(false)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)

  function apply(r: { template: MaskTemplate; custom: boolean }) {
    setRows(r.template.boxes.map(toRow))
    setEveryPage(r.template.everyPageStrip)
    setCustom(r.custom)
  }
  useEffect(() => {
    api<{ template: MaskTemplate; custom: boolean }>(`/api/schools/${schoolId}/mask`)
      .then(apply)
      .catch(() => setErr('Could not load this setting.'))
  }, [schoolId])

  async function send(body: unknown) {
    setBusy(true)
    setMsg(null)
    setErr(null)
    try {
      await api(`/api/schools/${schoolId}/mask`, { body })
      apply(await api(`/api/schools/${schoolId}/mask`))
      setMsg('Saved.')
      toast('Saved')
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }
  const save = () =>
    send({
      template: {
        boxes: rows.map((r) => ({ x: pct(r.x), y: pct(r.y), w: pct(r.w), h: pct(r.h) })),
        everyPageStrip: everyPage,
      },
    })
  const edit = (i: number, key: keyof Row, v: string) =>
    setRows(rows.map((r, j) => (j === i ? { ...r, [key]: v } : r)))

  return (
    <Card className="space-y-3" data-testid="mask-settings">
      <h2 className="text-lg font-bold">Name area on answer sheets</h2>
      <p className="text-base">
        The part of each answer sheet where a student writes her name and roll number is painted white on our server
        before any page is sent to the marking AI. By default this is the top strip of the first page
        {custom ? ' (your school has chosen its own boxes below)' : ''}.
      </p>
      {msg ? <Notice kind="good">{msg}</Notice> : null}
      {err ? <Notice kind="error">{err}</Notice> : null}
      <div className="flex flex-wrap gap-4">
        <div
          className="relative h-56 w-40 shrink-0 border-2 border-slate-400 bg-white"
          aria-label="Preview of the first page"
        >
          {rows.map((r, i) => (
            <div
              key={i}
              className="absolute border border-red-600 bg-red-200/70"
              style={{ left: `${r.x}%`, top: `${r.y}%`, width: `${r.w}%`, height: `${r.h}%` }}
            />
          ))}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          {rows.map((r, i) => (
            <div key={i} className="flex flex-wrap items-end gap-2">
              {(['x', 'y', 'w', 'h'] as const).map((k) => (
                <label key={k} className="text-sm font-semibold">
                  {{ x: 'Left %', y: 'Top %', w: 'Width %', h: 'Height %' }[k]}
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={r[k]}
                    onChange={(e) => edit(i, k, e.target.value)}
                    className="mt-1 block min-h-11 w-20 rounded-lg border border-slate-300 px-2 text-base"
                  />
                </label>
              ))}
              <Btn kind="plain" onClick={() => setRows(rows.filter((_, j) => j !== i))}>
                Remove
              </Btn>
            </div>
          ))}
          {rows.length < 6 ? (
            <Btn kind="plain" onClick={() => setRows([...rows, { x: '0', y: '0', w: '50', h: '10' }])}>
              Add a box
            </Btn>
          ) : null}
        </div>
      </div>
      <label className="flex min-h-11 items-center gap-3 text-base">
        <input type="checkbox" checked={everyPage} onChange={(e) => setEveryPage(e.target.checked)} className="size-5" />
        Also paint the top strip of every other page (for extra sheets where a name is written again)
      </label>
      <div className="flex flex-wrap gap-2">
        <Btn disabled={busy} onClick={() => void save()}>
          {busy ? 'Saving…' : 'Save'}
        </Btn>
        <Btn kind="plain" disabled={busy || !custom} onClick={() => void send({ reset: true })}>
          Back to the default
        </Btn>
      </div>
    </Card>
  )
}
