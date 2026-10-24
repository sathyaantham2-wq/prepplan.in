import { useEffect, useState } from 'react'
import { Share2 } from 'lucide-react'
import { Button } from './ui/button'
import { isIstSunday, weeklyCardShareText } from '../lib/weekly-card-text'
import type { WeeklyCardData } from '../lib/weekly-card-text'

// Fixed light colours for the picture (a canvas cannot follow the page theme), matching the app's
// soft palette. All artwork is original.
const INK = '#26304a'
const SOFT = '#6b7390'
const BLUE = '#3b5fb0'
const PAPER = '#fffaf0'
const PINK = '#f7d7da'
const YELLOW = '#fbefb8'
const MINT = '#d3efe0'

function formatDay(key: string): string {
  const d = new Date(`${key}T00:00:00Z`)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: 'UTC' })
}

function weekRange(d: WeeklyCardData): string {
  return `${formatDay(d.week_start)} to ${formatDay(d.week_end)}`
}

function fitText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
  if (ctx.measureText(text).width <= maxWidth) return text
  let t = text
  while (t.length > 1 && ctx.measureText(`${t}...`).width > maxWidth) t = t.slice(0, -1)
  return `${t.trimEnd()}...`
}

/** Draws the card onto an offscreen canvas and returns it as a PNG file. */
export async function renderWeeklyCardPng(d: WeeklyCardData): Promise<File> {
  const W = 1080
  const H = 1080
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas is not available')
  const font = (px: number, weight = 600) => `${weight} ${px}px system-ui, -apple-system, "Segoe UI", sans-serif`
  const round = (x: number, y: number, w: number, h: number, r: number, fill: string) => {
    ctx.fillStyle = fill
    ctx.beginPath()
    ctx.roundRect(x, y, w, h, r)
    ctx.fill()
  }

  const bg = ctx.createLinearGradient(0, 0, W, H)
  bg.addColorStop(0, PINK)
  bg.addColorStop(0.5, YELLOW)
  bg.addColorStop(1, MINT)
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)
  round(50, 50, W - 100, H - 100, 48, PAPER)

  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = BLUE
  ctx.font = font(34, 800)
  ctx.fillText('PrepPlan', 100, 130)
  ctx.fillStyle = SOFT
  ctx.font = font(30, 500)
  ctx.textAlign = 'right'
  ctx.fillText(weekRange(d), W - 100, 130)
  ctx.textAlign = 'left'

  ctx.fillStyle = INK
  ctx.font = font(60, 800)
  ctx.fillText(fitText(ctx, `${d.student_first_name}'s week`, W - 200), 100, 225)
  ctx.fillStyle = SOFT
  ctx.font = font(30, 500)
  ctx.fillText(d.class_label, 100, 270)

  // The headline number.
  round(100, 310, W - 200, 250, 36, YELLOW)
  ctx.fillStyle = INK
  ctx.font = font(140, 800)
  const won = String(Math.round(d.marks_won_back * 10) / 10)
  ctx.fillText(won, 140, 470)
  const wonWidth = ctx.measureText(won).width
  ctx.font = font(40, 700)
  ctx.fillText(d.marks_won_back === 1 ? 'mark won back' : 'marks won back', 140 + wonWidth + 28, 435)
  ctx.fillStyle = SOFT
  ctx.font = font(28, 500)
  ctx.fillText('Marks she lost before and has now earned.', 140, 525)

  // Two small tiles.
  const tile = (x: number, fill: string, big: string, label: string) => {
    round(x, 590, 435, 150, 30, fill)
    ctx.fillStyle = INK
    ctx.font = font(66, 800)
    ctx.fillText(big, x + 36, 675)
    ctx.fillStyle = SOFT
    ctx.font = font(28, 500)
    ctx.fillText(label, x + 36, 715)
  }
  tile(100, PINK, String(d.papers_submitted), d.papers_submitted === 1 ? 'paper done' : 'papers done')
  tile(545, MINT, String(d.streak_days), d.streak_days === 1 ? 'day streak' : 'day streak')

  const list = (y: number, title: string, rows: Array<string>) => {
    ctx.fillStyle = BLUE
    ctx.font = font(30, 800)
    ctx.fillText(title, 100, y)
    ctx.fillStyle = INK
    ctx.font = font(34, 600)
    if (rows.length === 0) {
      ctx.fillStyle = SOFT
      ctx.fillText('Coming soon', 100, y + 48)
      return
    }
    rows.forEach((r, i) => ctx.fillText(fitText(ctx, r, W - 200), 100, y + 48 + i * 46))
  }
  list(805, 'STRONG', d.strongest_chapters)
  list(935, 'WORKING ON', d.chapters_to_work_on)

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
  if (!blob) throw new Error('Could not make the picture')
  return new File([blob], 'prepplan-week.png', { type: 'image/png' })
}

/** What the share button did, so the caller can show a hint. */
export async function shareWeeklyCard(d: WeeklyCardData): Promise<'shared' | 'cancelled' | 'downloaded'> {
  const png = await renderWeeklyCardPng(d)
  const text = weeklyCardShareText(d)
  if (typeof navigator.canShare === 'function' && navigator.canShare({ files: [png] })) {
    try {
      await navigator.share({ files: [png], text })
      return 'shared'
    } catch (error) {
      // She closed the share sheet -- that is an answer, not a failure.
      if ((error as Error).name === 'AbortError') return 'cancelled'
    }
  }
  const url = URL.createObjectURL(png)
  const a = document.createElement('a')
  a.href = url
  a.download = png.name
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 5000)
  return 'downloaded'
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-background/70 rounded-2xl px-3 py-2 text-center">
      <div className="text-xl font-bold">{value}</div>
      <div className="text-muted-foreground text-xs">{label}</div>
    </div>
  )
}

export function WeeklyCard({ data }: { data: WeeklyCardData }) {
  const [hint, setHint] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function onShare() {
    setBusy(true)
    setHint(null)
    try {
      const result = await shareWeeklyCard(data)
      if (result === 'downloaded') {
        setHint('The picture was saved to your device. Send it to your parent from there.')
      }
    } catch {
      setHint('Could not make the picture just now. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section
      className="rounded-3xl p-5"
      style={{ background: 'var(--grad-soft)' }}
      aria-label="This week's card"
    >
      <p className="text-muted-foreground text-xs font-semibold">
        {data.student_first_name}'s week, {weekRange(data)}
      </p>
      <p className="mt-1 text-3xl font-extrabold">
        {Math.round(data.marks_won_back * 10) / 10}{' '}
        <span className="text-base font-semibold">
          {data.marks_won_back === 1 ? 'mark won back' : 'marks won back'}
        </span>
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Stat value={data.papers_submitted} label={data.papers_submitted === 1 ? 'paper' : 'papers'} />
        <Stat value={data.streak_days} label="day streak" />
      </div>
      {(data.strongest_chapters.length > 0 || data.chapters_to_work_on.length > 0) && (
        <div className="mt-3 space-y-1 text-sm">
          {data.strongest_chapters.length > 0 && (
            <p>
              <span className="font-semibold">Strong:</span> {data.strongest_chapters.join(', ')}
            </p>
          )}
          {data.chapters_to_work_on.length > 0 && (
            <p>
              <span className="font-semibold">Working on:</span> {data.chapters_to_work_on.join(', ')}
            </p>
          )}
        </div>
      )}
      <Button className="mt-4 min-h-11" size="sm" disabled={busy} onClick={() => void onShare()}>
        <Share2 className="mr-1.5 size-4" />
        Share this week's card
      </Button>
      {hint && <p className="text-muted-foreground mt-2 text-xs">{hint}</p>}
    </section>
  )
}

/** For the Home page: fetches her own card and shows it; on Sundays (India time) it nudges her. */
export function WeeklyCardPrompt() {
  const [data, setData] = useState<WeeklyCardData | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/students/me/weekly-card')
      .then((r) => (r.ok ? (r.json() as Promise<WeeklyCardData>) : null))
      .then((d) => {
        if (!cancelled) setData(d)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  if (!data) return null
  return (
    <div className="space-y-2">
      {isIstSunday(new Date()) && (
        <p className="text-sm font-semibold">It's Sunday — share this week's card with your parent</p>
      )}
      <WeeklyCard data={data} />
    </div>
  )
}
