import jsQR from 'jsqr'
import sharp from 'sharp'
import { PAGE } from './booklet-layout'
import { parseQrContent } from './booklet-token'

// Reads one photographed booklet page: finds its QR code (the page's identity), works out how the
// phone was held, and straightens the page using the four black corner marks so every answer box
// is back where the layout says it is. Pure image work: no database, no secrets.
//
// Steps
//   1. Orient the photo (EXIF), shrink it to a working size, make a grey picture.
//   2. Find the QR with jsQR (it reads a QR at any rotation). Its three corner squares give the
//      angle of the page and the size of 1 mm in the photo. A page that is upside down or sideways
//      is simply rotated until the QR sits the right way up.
//   3. Look for the four corner marks near the corners of the turned page. With all four, the page
//      is stretched to exactly A4 (a perspective correction); with fewer, only the turn is applied.
//   4. Hand back the straightened picture (JPEG) and a plain quality note.

const WORK_EDGE = 1800 // longest side while looking for things
/** Other working sizes tried, in order, when no QR is found at the first. */
const QR_SEARCH_EDGES = [2600, 3600, 1200]
export const OUT_W = 1240 // straightened page: A4 at about 150 dpi
export const OUT_H = 1754
const QR_MM = 20
const MARK_MM = 5
const MARK_CENTRE_MM = { x: 7 + 2.5, fromRight: 12 - 2.5, y: 7 + 2.5 } // see booklet-layout corners
const CORNER_CENTRES_MM: Array<[number, number]> = [
  [MARK_CENTRE_MM.x, MARK_CENTRE_MM.y],
  [PAGE.w - MARK_CENTRE_MM.fromRight, MARK_CENTRE_MM.y],
  [MARK_CENTRE_MM.x, PAGE.h - MARK_CENTRE_MM.fromRight],
  [PAGE.w - MARK_CENTRE_MM.fromRight, PAGE.h - MARK_CENTRE_MM.fromRight],
]

export interface PageReading {
  /** The token inside the QR, or null when no QR of ours could be read. */
  token: string | null
  /** The raw QR text when a QR was read but is not one of ours. */
  foreignQr: string | null
  /** How many of the four corner marks were found after turning the page (0 to 4). */
  corners: number
  /** Degrees the photo was turned to put the page upright. */
  turnedDegrees: number
  /** True when the page was stretched to A4 using all four corner marks. */
  straightened: boolean
  /** The page picture: straightened when possible, otherwise just turned upright. Null if unreadable as an image. */
  image: Buffer | null
  /** Plain reason when something is wrong. */
  problem: string | null
}

interface Grey {
  data: Uint8Array
  w: number
  h: number
}

async function toGrey(
  input: Buffer,
  rotateDeg: number,
  edge: number = WORK_EDGE,
): Promise<{ grey: Grey; rgb: Buffer; w: number; h: number }> {
  let img = sharp(input, { failOn: 'none' }).rotate() // EXIF orientation
  if (rotateDeg) img = img.rotate(rotateDeg, { background: '#ffffff' })
  const resized = img.resize({
    width: edge,
    height: edge,
    fit: 'inside',
    // the later, larger working sizes may enlarge: a small photo's QR needs more pixels per module
    withoutEnlargement: edge === WORK_EDGE,
  })
  const { data, info } = await resized
    .clone()
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const rgb = await resized.clone().removeAlpha().raw().toBuffer()
  return {
    grey: { data: new Uint8Array(data), w: info.width, h: info.height },
    rgb,
    w: info.width,
    h: info.height,
  }
}

function toRgba(grey: Grey): Uint8ClampedArray {
  const out = new Uint8ClampedArray(grey.w * grey.h * 4)
  for (let i = 0; i < grey.data.length; i++) {
    const v = grey.data[i]
    out[i * 4] = v
    out[i * 4 + 1] = v
    out[i * 4 + 2] = v
    out[i * 4 + 3] = 255
  }
  return out
}

function findQr(grey: Grey) {
  const rgba = toRgba(grey)
  return jsQR(rgba, grey.w, grey.h, { inversionAttempts: 'attemptBoth' })
}

/** A simple contrast stretch, for dim or shadowed photos where the first read fails. */
function contrast(grey: Grey): Grey {
  let lo = 255
  let hi = 0
  for (const v of grey.data) {
    if (v < lo) lo = v
    if (v > hi) hi = v
  }
  const span = Math.max(1, hi - lo)
  const out = new Uint8Array(grey.data.length)
  for (let i = 0; i < out.length; i++)
    out[i] = Math.max(0, Math.min(255, ((grey.data[i] - lo) * 255) / span))
  return { data: out, w: grey.w, h: grey.h }
}

/** Local (adaptive) black and white: robust to shadows across the page. Returns 1 for dark. */
function darkMask(grey: Grey, block = 41, offset = 18): Uint8Array {
  const { w, h, data } = grey
  const integral = new Float64Array((w + 1) * (h + 1))
  for (let y = 0; y < h; y++) {
    let row = 0
    for (let x = 0; x < w; x++) {
      row += data[y * w + x]
      integral[(y + 1) * (w + 1) + x + 1] = integral[y * (w + 1) + x + 1] + row
    }
  }
  const half = block >> 1
  const mask = new Uint8Array(w * h)
  for (let y = 0; y < h; y++) {
    const y0 = Math.max(0, y - half)
    const y1 = Math.min(h, y + half + 1)
    for (let x = 0; x < w; x++) {
      const x0 = Math.max(0, x - half)
      const x1 = Math.min(w, x + half + 1)
      const sum =
        integral[y1 * (w + 1) + x1] -
        integral[y0 * (w + 1) + x1] -
        integral[y1 * (w + 1) + x0] +
        integral[y0 * (w + 1) + x0]
      const mean = sum / ((x1 - x0) * (y1 - y0))
      mask[y * w + x] = data[y * w + x] < mean - offset ? 1 : 0
    }
  }
  return mask
}

interface Blob {
  cx: number
  cy: number
  w: number
  h: number
  area: number
}

/** Connected dark regions inside a window of the mask (4-connected flood fill, iterative). */
function blobsIn(
  mask: Uint8Array,
  w: number,
  h: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
): Array<Blob> {
  const seen = new Uint8Array(w * h)
  const out: Array<Blob> = []
  const stack: Array<number> = []
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const idx = y * w + x
      if (!mask[idx] || seen[idx]) continue
      let minX = x
      let maxX = x
      let minY = y
      let maxY = y
      let area = 0
      let sx = 0
      let sy = 0
      stack.push(idx)
      seen[idx] = 1
      while (stack.length) {
        const p = stack.pop() as number
        const px = p % w
        const py = (p - px) / w
        area++
        sx += px
        sy += py
        if (px < minX) minX = px
        if (px > maxX) maxX = px
        if (py < minY) minY = py
        if (py > maxY) maxY = py
        for (const [dx, dy] of [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ] as const) {
          const nx = px + dx
          const ny = py + dy
          if (nx < x0 || nx >= x1 || ny < y0 || ny >= y1) continue
          const ni = ny * w + nx
          if (mask[ni] && !seen[ni]) {
            seen[ni] = 1
            stack.push(ni)
          }
        }
      }
      out.push({
        cx: sx / area,
        cy: sy / area,
        w: maxX - minX + 1,
        h: maxY - minY + 1,
        area,
      })
    }
  }
  return out
}

/**
 * Finds the four solid black corner squares anywhere in the picture (the photo may be tilted, so the
 * page corners are not the picture's corners). A corner mark is a filled, square-ish blob about 5 mm
 * wide; the QR's own finder squares are not solid and are skipped by position. The four are the
 * extremes along the two diagonals, and they must make a page-shaped rectangle of the right size.
 */
function findCornerMarks(
  grey: Grey,
  pxPerMm: number,
  qrCentre: [number, number] | null,
): Array<[number, number]> {
  const side = MARK_MM * pxPerMm
  // The local-threshold window must be bigger than a mark, or a big solid square would look hollow.
  const block = Math.max(41, Math.round(side * 3) | 1)
  const mask = darkMask(grey, block)
  const { w, h } = grey
  const marks = blobsIn(mask, w, h, 0, 0, w, h).filter((b) => {
    const squareish = Math.min(b.w, b.h) / Math.max(b.w, b.h) > 0.65
    const sized =
      b.w > side * 0.55 &&
      b.w < side * 1.9 &&
      b.h > side * 0.55 &&
      b.h < side * 1.9
    const filled = b.area / (b.w * b.h) > 0.55 // a square seen at an angle fills less of its bounding box
    const inQr = qrCentre
      ? Math.hypot(b.cx - qrCentre[0], b.cy - qrCentre[1]) < 14 * pxPerMm
      : false
    return squareish && sized && filled && !inQr
  })
  if (marks.length < 4)
    return marks.map((m) => [m.cx, m.cy] as [number, number])
  const pick = (score: (b: Blob) => number) =>
    marks.reduce((best, b) => (score(b) < score(best) ? b : best))
  const tl = pick((b) => b.cx + b.cy)
  const tr = pick((b) => -(b.cx - b.cy))
  const bl = pick((b) => b.cx - b.cy)
  const br = pick((b) => -(b.cx + b.cy))
  const four = [tl, tr, bl, br]
  if (new Set(four).size < 4)
    return four.map((m) => [m.cx, m.cy] as [number, number]).slice(0, 3)
  // the rectangle they make must be about as wide and tall as the page's corner marks are apart
  const top = Math.hypot(tr.cx - tl.cx, tr.cy - tl.cy) / pxPerMm
  const left = Math.hypot(bl.cx - tl.cx, bl.cy - tl.cy) / pxPerMm
  const wantW = CORNER_CENTRES_MM[1][0] - CORNER_CENTRES_MM[0][0]
  const wantH = CORNER_CENTRES_MM[2][1] - CORNER_CENTRES_MM[0][1]
  const ok =
    Math.abs(top - wantW) / wantW < 0.18 &&
    Math.abs(left - wantH) / wantH < 0.18
  return ok
    ? four.map((m) => [m.cx, m.cy] as [number, number])
    : four.map((m) => [m.cx, m.cy] as [number, number]).slice(0, 3)
}

/** Solves the 3x3 projective map taking four source points to four destination points. */
function homography(
  src: Array<[number, number]>,
  dst: Array<[number, number]>,
): Array<number> {
  // 8 equations, 8 unknowns (h33 = 1)
  const A: Array<Array<number>> = []
  const b: Array<number> = []
  for (let i = 0; i < 4; i++) {
    const [x, y] = src[i]
    const [u, v] = dst[i]
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y])
    b.push(u)
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y])
    b.push(v)
  }
  const n = 8
  for (let c = 0; c < n; c++) {
    let p = c
    for (let r = c + 1; r < n; r++)
      if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r
    ;[A[c], A[p]] = [A[p], A[c]]
    ;[b[c], b[p]] = [b[p], b[c]]
    const d = A[c][c] || 1e-12
    for (let r = c + 1; r < n; r++) {
      const f = A[r][c] / d
      for (let k = c; k < n; k++) A[r][k] -= f * A[c][k]
      b[r] -= f * b[c]
    }
  }
  const x = new Array<number>(n).fill(0)
  for (let r = n - 1; r >= 0; r--) {
    let s = b[r]
    for (let k = r + 1; k < n; k++) s -= A[r][k] * x[k]
    x[r] = s / (A[r][r] || 1e-12)
  }
  return [...x, 1]
}

/** Builds the straightened page: for each output pixel, look up where it is in the photo (bilinear). */
function warp(
  rgb: Buffer,
  w: number,
  h: number,
  photoCorners: Array<[number, number]>,
): Buffer {
  const scale = OUT_W / PAGE.w
  const dst = CORNER_CENTRES_MM.map(
    ([x, y]) => [x * scale, y * scale] as [number, number],
  )
  // map output -> photo
  const m = homography(dst, photoCorners)
  const out = Buffer.alloc(OUT_W * OUT_H * 3, 255)
  for (let y = 0; y < OUT_H; y++) {
    for (let x = 0; x < OUT_W; x++) {
      const d = m[6] * x + m[7] * y + 1
      const sx = (m[0] * x + m[1] * y + m[2]) / d
      const sy = (m[3] * x + m[4] * y + m[5]) / d
      if (sx < 0 || sy < 0 || sx >= w - 1 || sy >= h - 1) continue
      const x0 = Math.floor(sx)
      const y0 = Math.floor(sy)
      const fx = sx - x0
      const fy = sy - y0
      const o = (y * OUT_W + x) * 3
      for (let c = 0; c < 3; c++) {
        const p00 = rgb[(y0 * w + x0) * 3 + c]
        const p10 = rgb[(y0 * w + x0 + 1) * 3 + c]
        const p01 = rgb[((y0 + 1) * w + x0) * 3 + c]
        const p11 = rgb[((y0 + 1) * w + x0 + 1) * 3 + c]
        out[o + c] =
          p00 * (1 - fx) * (1 - fy) +
          p10 * fx * (1 - fy) +
          p01 * (1 - fx) * fy +
          p11 * fx * fy
      }
    }
  }
  return out
}

const rad2deg = (r: number) => (r * 180) / Math.PI

export async function readBookletPage(input: Buffer): Promise<PageReading> {
  const empty: PageReading = {
    token: null,
    foreignQr: null,
    corners: 0,
    turnedDegrees: 0,
    straightened: false,
    image: null,
    problem: null,
  }
  let first
  try {
    first = await toGrey(input, 0)
  } catch {
    return { ...empty, problem: 'This file is not a picture we can read.' }
  }

  // Look for the QR on the photo as it is, then on a contrast-stretched copy (a shadow), at a few
  // working sizes: a small code in a big photo needs the big one, a blurred one the small one.
  let qr = findQr(first.grey) ?? findQr(contrast(first.grey))
  let edge = WORK_EDGE
  for (const tryEdge of QR_SEARCH_EDGES) {
    if (qr) break
    const look = await toGrey(input, 0, tryEdge)
    qr = findQr(look.grey) ?? findQr(contrast(look.grey))
    if (qr) edge = tryEdge
  }
  if (!qr) {
    const upright = await sharp(input, { failOn: 'none' })
      .rotate()
      .resize({
        width: WORK_EDGE,
        height: WORK_EDGE,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: 80 })
      .toBuffer()
    return {
      ...empty,
      image: upright,
      problem: 'No QR code could be read on this page.',
    }
  }

  const token = parseQrContent(qr.data)
  const loc = qr.location
  // Angle of the QR's top edge in the photo: 0 when the page is upright.
  const angle = rad2deg(
    Math.atan2(
      loc.topRightFinderPattern.y - loc.topLeftFinderPattern.y,
      loc.topRightFinderPattern.x - loc.topLeftFinderPattern.x,
    ),
  )
  const turn = Math.round(angle * 10) / 10
  const turned = await toGrey(input, -turn, edge)
  // after the turn the QR sits upright; find it again for its size and place
  const again = findQr(turned.grey) ?? findQr(contrast(turned.grey))
  const loc2 = again?.location ?? null
  const qrSidePx = loc2
    ? Math.hypot(
        loc2.topRightFinderPattern.x - loc2.topLeftFinderPattern.x,
        loc2.topRightFinderPattern.y - loc2.topLeftFinderPattern.y,
      )
    : Math.hypot(
        loc.topRightFinderPattern.x - loc.topLeftFinderPattern.x,
        loc.topRightFinderPattern.y - loc.topLeftFinderPattern.y,
      )
  // finder centres are about 0.8 of the QR side apart for a short version code; use the printed size
  const qrBox = loc2 ?? loc
  const widthPx = Math.max(
    Math.hypot(
      qrBox.topRightCorner.x - qrBox.topLeftCorner.x,
      qrBox.topRightCorner.y - qrBox.topLeftCorner.y,
    ),
    qrSidePx,
  )
  const pxPerMm = widthPx / QR_MM
  const qrCentre: [number, number] | null = loc2
    ? [
        (loc2.topLeftCorner.x + loc2.bottomRightCorner.x) / 2,
        (loc2.topLeftCorner.y + loc2.bottomRightCorner.y) / 2,
      ]
    : null

  const marks = findCornerMarks(turned.grey, pxPerMm, qrCentre)
  const found = marks
  let image: Buffer
  let straightened = false
  if (found.length === 4) {
    const warped = warp(turned.rgb, turned.w, turned.h, marks)
    image = await sharp(warped, {
      raw: { width: OUT_W, height: OUT_H, channels: 3 },
    })
      .jpeg({ quality: 82 })
      .toBuffer()
    straightened = true
  } else {
    image = await sharp(turned.rgb, {
      raw: { width: turned.w, height: turned.h, channels: 3 },
    })
      .jpeg({ quality: 82 })
      .toBuffer()
  }
  return {
    token,
    foreignQr: token ? null : qr.data.slice(0, 80),
    corners: found.length,
    turnedDegrees: turn,
    straightened,
    image,
    problem: token
      ? null
      : 'The QR code on this page is not from a PrepPlan booklet.',
  }
}
