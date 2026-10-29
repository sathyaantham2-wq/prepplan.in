// The Smart Answer Booklet's page layout, worked out in millimetres on an A4 page (210 x 297).
// It is pure: the same questions always give the same pages, so every student of an exam gets an
// identical booklet apart from the printed name, ID and QR codes. The result (the "manifest") is
// stored with the exam because the scan reader (a later step) crops each answer box from a photo
// using exactly these positions.
//
//   page 1            the student's details, short instructions, and one row of bubbles per
//                     multiple-choice question (more bubble pages if there are very many)
//   answer pages      one ruled answer box per written question, taller for more marks; an OR
//                     pair shares one box (the student writes which one she answers)
//   rough work page   not marked
//   extra space page  for an answer that runs over, with the question number written on it
//
// Every page has a QR code (top right) and four corner marks, so a phone photo can be straightened.

export const PAGE = { w: 210, h: 297 } as const
const MARGIN = 12
const CONTENT_TOP = 44 // clear of the 30 mm QR code (it ends at 38 mm)
const CONTENT_BOTTOM = 281
const LINE_H = 8
const LABEL_H = 7
const GAP = 5
const WORDS_PER_LINE = 10
const MIN_BOX = 24
const BUBBLE_R = 2.75
const BUBBLE_PITCH = 11
const ROW_PITCH = 9.5
const GRID_TOP = 118
const BUBBLE_OPTIONS = ['A', 'B', 'C', 'D'] as const

export interface BookletQuestion {
  /** The printed question number. */
  position: number
  /** A multiple-choice style question answered by filling a bubble. */
  isMcq: boolean
  marks: number
  expectedWords: number | null
  /** The question is printed with an OR (the student answers one of two). */
  hasAlternate: boolean
}

export interface BoxSpec {
  key: string
  label: string
  marks: number
  x: number
  y: number
  w: number
  h: number
}
export interface BubbleSpec {
  position: number
  r: number
  options: Array<{ label: string; cx: number; cy: number }>
}
export interface PageSpec {
  page: number
  kind: 'cover' | 'bubbles' | 'answers' | 'rough' | 'extra'
  boxes: Array<BoxSpec>
  bubbles: Array<BubbleSpec>
  /** Header labels above the bubble columns, when the page has bubbles. */
  bubbleHeaders: Array<{ label: string; cx: number; y: number }>
  qr: { x: number; y: number; size: number }
  corners: Array<{ x: number; y: number; size: number }>
}
export interface BookletManifest {
  version: 1
  pageW: number
  pageH: number
  pageCount: number
  pages: Array<PageSpec>
}

// Corner marks sit 7 mm in from each edge and the QR 16 mm in, inside what any printer can reach.
// 30 mm: at 150 dpi (a 1240 px wide A4 scan) each of its 29 modules is about 6 px, enough to read.
export const QR_SIZE_MM = 30
const qr = { x: PAGE.w - 16 - QR_SIZE_MM, y: 8, size: QR_SIZE_MM }
const corners = [
  { x: 7, y: 7, size: 5 },
  { x: PAGE.w - 12, y: 7, size: 5 },
  { x: 7, y: PAGE.h - 12, size: 5 },
  { x: PAGE.w - 12, y: PAGE.h - 12, size: 5 },
]
const blank = (page: number, kind: PageSpec['kind']): PageSpec => ({
  page,
  kind,
  boxes: [],
  bubbles: [],
  bubbleHeaders: [],
  qr,
  corners,
})

/** Height of the writing box for a question: enough ruled lines for its word limit. */
export function boxHeight(
  q: Pick<BookletQuestion, 'marks' | 'expectedWords'>,
): number {
  const words = q.expectedWords ?? 0
  if (words <= 0) return MIN_BOX
  return Math.max(MIN_BOX, Math.ceil(words / WORDS_PER_LINE) * LINE_H + 4)
}

export function layoutBooklet(
  questions: ReadonlyArray<BookletQuestion>,
): BookletManifest {
  const sorted = [...questions].sort((a, b) => a.position - b.position)
  const mcq = sorted.filter((q) => q.isMcq)
  const written = sorted.filter((q) => !q.isMcq)
  const pages: Array<PageSpec> = []

  // ---- page 1 and any more bubble pages -------------------------------------------------------
  const cols = mcq.length <= 12 ? 1 : mcq.length <= 24 ? 2 : 3
  const colW = (PAGE.w - 2 * MARGIN) / cols
  const rowsFit = Math.floor((CONTENT_BOTTOM - GRID_TOP - 6) / ROW_PITCH)
  const perPage = Math.max(1, rowsFit * cols)
  const firstCapacity = perPage
  let cursor = 0
  const cover = blank(1, 'cover')
  pages.push(cover)
  const fillBubbles = (
    page: PageSpec,
    top: number,
    count: number,
    capacity: number,
  ) => {
    const batch = mcq.slice(cursor, cursor + Math.min(count, capacity))
    cursor += batch.length
    const perCol = Math.ceil(batch.length / cols)
    batch.forEach((q, i) => {
      const col = Math.floor(i / perCol)
      const row = i % perCol
      const left = MARGIN + col * colW
      const cy = top + 6 + row * ROW_PITCH
      page.bubbles.push({
        position: q.position,
        r: BUBBLE_R,
        options: BUBBLE_OPTIONS.map((label, k) => ({
          label,
          cx: left + 16 + k * BUBBLE_PITCH,
          cy,
        })),
      })
    })
    for (let c = 0; c < cols && batch.length > 0; c++) {
      for (let k = 0; k < BUBBLE_OPTIONS.length; k++) {
        page.bubbleHeaders.push({
          label: BUBBLE_OPTIONS[k],
          cx: MARGIN + c * colW + 16 + k * BUBBLE_PITCH,
          y: top,
        })
      }
    }
  }
  fillBubbles(cover, GRID_TOP, mcq.length, firstCapacity)
  while (cursor < mcq.length) {
    const p = blank(pages.length + 1, 'bubbles')
    fillBubbles(
      p,
      CONTENT_TOP + 4,
      mcq.length - cursor,
      Math.max(
        1,
        Math.floor((CONTENT_BOTTOM - CONTENT_TOP - 10) / ROW_PITCH) * cols,
      ),
    )
    pages.push(p)
  }

  // ---- written answers ------------------------------------------------------------------------
  let page: PageSpec | null = null
  let y = CONTENT_TOP
  for (const q of written) {
    const h = boxHeight(q)
    if (!page || y + LABEL_H + h > CONTENT_BOTTOM) {
      page = blank(pages.length + 1, 'answers')
      pages.push(page)
      y = CONTENT_TOP
    }
    const label = q.hasAlternate
      ? `Q${q.position}: answer either ${q.position}A or ${q.position}B. Write which one at the start.`
      : `Q${q.position}`
    page.boxes.push({
      key: `q${q.position}`,
      label,
      marks: q.marks,
      x: MARGIN,
      y: y + LABEL_H,
      w: PAGE.w - 2 * MARGIN,
      h,
    })
    y += LABEL_H + h + GAP
  }

  // ---- rough work and extra space -------------------------------------------------------------
  const rough = blank(pages.length + 1, 'rough')
  rough.boxes.push({
    key: 'rough',
    label: 'Rough work (not marked)',
    marks: 0,
    x: MARGIN,
    y: CONTENT_TOP + LABEL_H,
    w: PAGE.w - 2 * MARGIN,
    h: CONTENT_BOTTOM - CONTENT_TOP - LABEL_H,
  })
  pages.push(rough)
  const extra = blank(pages.length + 1, 'extra')
  const panelH = (CONTENT_BOTTOM - CONTENT_TOP - 3 * GAP) / 3 - LABEL_H
  for (let i = 0; i < 3; i++) {
    extra.boxes.push({
      key: `extra${i + 1}`,
      label: 'Extra space. Question number: ______',
      marks: 0,
      x: MARGIN,
      y: CONTENT_TOP + i * (LABEL_H + panelH + GAP) + LABEL_H,
      w: PAGE.w - 2 * MARGIN,
      h: panelH,
    })
  }
  pages.push(extra)

  return {
    version: 1,
    pageW: PAGE.w,
    pageH: PAGE.h,
    pageCount: pages.length,
    pages,
  }
}
