/**
 * Which part of an answer sheet is painted white before a page picture is sent to the AI (owner decision B,
 * 2026-11-02: the name and roll area never goes to the marking AI; only the separate, disclosed upload check reads it).
 * Boxes are fractions (0 to 1) of the upright first page; `everyPageStrip` also whitens the top strip of every page.
 */
export interface MaskBox {
  x: number
  y: number
  w: number
  h: number
}

export interface MaskTemplate {
  boxes: Array<MaskBox>
  everyPageStrip: boolean
}

/** The strip the upload check reads: the top 12 % of the first page, full width. */
export const STRIP_HEIGHT = 0.12

export const DEFAULT_MASK: MaskTemplate = {
  boxes: [{ x: 0, y: 0, w: 1, h: STRIP_HEIGHT }],
  everyPageStrip: false,
}

const MAX_BOXES = 6

function frac(v: unknown): number | null {
  return typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= 1 ? v : null
}

/** A stored or submitted template, checked; null when it is not valid (the caller then refuses or uses the default). */
export function parseMaskTemplate(raw: unknown): MaskTemplate | null {
  if (raw === null || typeof raw !== 'object') return null
  const r = raw as { boxes?: unknown; everyPageStrip?: unknown }
  if (!Array.isArray(r.boxes) || r.boxes.length > MAX_BOXES) return null
  const boxes: Array<MaskBox> = []
  for (const b of r.boxes as Array<Record<string, unknown>>) {
    const x = frac(b.x)
    const y = frac(b.y)
    const w = frac(b.w)
    const h = frac(b.h)
    if (x === null || y === null || w === null || h === null) return null
    if (w < 0.01 || h < 0.01 || x + w > 1.0001 || y + h > 1.0001) return null
    boxes.push({ x, y, w, h })
  }
  return { boxes, everyPageStrip: r.everyPageStrip === true }
}

/** What the marking code uses: the school's template, or the default when none is stored or it is damaged. */
export function maskFor(stored: unknown): MaskTemplate {
  return stored === null || stored === undefined ? DEFAULT_MASK : (parseMaskTemplate(stored) ?? DEFAULT_MASK)
}

/** The rectangles, in pixels, to paint white on one page of the given size. */
export function maskRects(
  template: MaskTemplate,
  firstPage: boolean,
  width: number,
  height: number,
): Array<{ left: number; top: number; width: number; height: number }> {
  const boxes: Array<MaskBox> = []
  if (firstPage) boxes.push(...template.boxes)
  if (template.everyPageStrip) boxes.push({ x: 0, y: 0, w: 1, h: STRIP_HEIGHT })
  return boxes.map((b) => {
    const left = Math.min(width - 1, Math.round(b.x * width))
    const top = Math.min(height - 1, Math.round(b.y * height))
    return {
      left,
      top,
      width: Math.max(1, Math.min(width - left, Math.round(b.w * width))),
      height: Math.max(1, Math.min(height - top, Math.round(b.h * height))),
    }
  })
}
