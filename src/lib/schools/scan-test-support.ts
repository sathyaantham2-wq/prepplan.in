import sharp from 'sharp'
import { chromium } from 'playwright-core'
import { PAGE, layoutBooklet } from './booklet-layout'
import type { BookletManifest, BookletQuestion } from './booklet-layout'
import { buildBookletsHtml } from './booklet-html'
import { bookletPageToken } from './booklet-token'

// Test support for the scan reader (S6): renders REAL booklet pages with the real builders, and
// makes them look like phone photos (tilt, perspective, shadow, blur, noise, scribbles, a desk
// around the page, any way up). Also holds the fixed ids and secret of the printable fixture
// booklet, so a hand-filled copy photographed by the owner can be checked against known codes on
// any machine. Nothing here runs in production.

export const FIXTURE = {
  secret: 'prepplan-printable-fixture-booklet-secret',
  schoolId: '5c3f0000-0000-4000-8000-000000000001',
  examId: '5c3f0000-0000-4000-8000-000000000002',
  students: [
    {
      id: '5c3f0000-0000-4000-8000-0000000000a1',
      name: 'Practice Student One',
      admissionNo: 'FX0001',
      rollNo: '1',
    },
    {
      id: '5c3f0000-0000-4000-8000-0000000000a2',
      name: 'Practice Student Two',
      admissionNo: 'FX0002',
      rollNo: '2',
    },
  ],
} as const

const q = (
  position: number,
  o: Partial<BookletQuestion> = {},
): BookletQuestion => ({
  position,
  isMcq: false,
  marks: 3,
  expectedWords: 60,
  hasAlternate: false,
  ...o,
})

/** A small but complete paper: 10 multiple-choice, a few written answers of different sizes. */
export const FIXTURE_QUESTIONS: Array<BookletQuestion> = [
  ...Array.from({ length: 10 }, (_, i) =>
    q(i + 1, { isMcq: true, marks: 1, expectedWords: null }),
  ),
  q(11, { marks: 2, expectedWords: 40 }),
  q(12, { marks: 3, expectedWords: 60, hasAlternate: true }),
  q(13, { marks: 5, expectedWords: 120 }),
]

export function fixtureManifest(): BookletManifest {
  return layoutBooklet(FIXTURE_QUESTIONS)
}

export function fixtureToken(studentIndex: number, page: number): string {
  return bookletPageToken(
    {
      schoolId: FIXTURE.schoolId,
      examId: FIXTURE.examId,
      schoolStudentId: FIXTURE.students[studentIndex].id,
      page,
    },
    FIXTURE.secret,
  )
}

export async function fixtureBookletHtml(): Promise<string> {
  const manifest = fixtureManifest()
  return buildBookletsHtml({
    schoolName: 'Practice School',
    examTitle: 'Practice booklet (for testing the scan reader)',
    subjectName: 'Mathematics',
    className: 'Class 7',
    durationMin: 60,
    totalMarks: 30,
    manifest,
    students: FIXTURE.students.map((s, i) => ({
      name: s.name,
      admissionNo: s.admissionNo,
      rollNo: s.rollNo,
      sectionName: 'A',
      tokens: Array.from({ length: manifest.pageCount }, (_, p) =>
        fixtureToken(i, p + 1),
      ),
    })),
  })
}

/** Each `.page` of the html as a PNG, about 150 dpi. */
export async function renderPagePngs(
  html: string,
  which?: ReadonlyArray<number>,
): Promise<Array<Buffer>> {
  const browser = await chromium.launch()
  try {
    const page = await browser.newPage({
      viewport: { width: 794, height: 1123 },
      deviceScaleFactor: 1.5625,
    })
    await page.setContent(html, { waitUntil: 'load' })
    await page.evaluate(async () => {
      await document.fonts.ready
    })
    const count = await page.locator('.page').count()
    const out: Array<Buffer> = []
    for (const i of which ?? Array.from({ length: count }, (_, k) => k)) {
      out.push(await page.locator('.page').nth(i).screenshot({ type: 'png' }))
    }
    return out
  } finally {
    await browser.close()
  }
}

// ---------------------------------------------------------------- phone-photo distortions

export interface PhotoOptions {
  /** Degrees the page is turned in the frame (any value; 180 is upside down). */
  rotate?: number
  /** 0..1: how much the top edge is nearer the camera than the bottom (a slanted phone). */
  perspective?: number
  /** A shadow falling across one side of the page. */
  shadow?: boolean
  blur?: number
  /** Standard deviation of the grain added to every pixel. */
  noise?: number
  jpeg?: number
  /** Heavy pen scribbles over the writing area. */
  scribble?: boolean
  /** Longest side of the photo in pixels. */
  size?: number
  seed?: number
}

function rng(seed: number) {
  let s = seed >>> 0 || 1
  return () => {
    s ^= s << 13
    s ^= s >>> 17
    s ^= s << 5
    return (s >>> 0) / 4294967296
  }
}

/** Solves for the 3x3 projective map taking the unit-page corners to `dst` (and back). */
function solveHomography(
  src: Array<[number, number]>,
  dst: Array<[number, number]>,
): Array<number> {
  const a: Array<Array<number>> = []
  for (let i = 0; i < 4; i++) {
    const [x, y] = src[i]
    const [u, v] = dst[i]
    a.push([x, y, 1, 0, 0, 0, -u * x, -u * y, u])
    a.push([0, 0, 0, x, y, 1, -v * x, -v * y, v])
  }
  for (let c = 0; c < 8; c++) {
    let p = c
    for (let r = c + 1; r < 8; r++)
      if (Math.abs(a[r][c]) > Math.abs(a[p][c])) p = r
    ;[a[c], a[p]] = [a[p], a[c]]
    for (let r = 0; r < 8; r++) {
      if (r === c) continue
      const f = a[r][c] / a[c][c]
      for (let k = c; k < 9; k++) a[r][k] -= f * a[c][k]
    }
  }
  return [...Array.from({ length: 8 }, (_, i) => a[i][8] / a[i][i]), 1]
}

export async function photograph(
  png: Buffer,
  o: PhotoOptions = {},
): Promise<Buffer> {
  const rand = rng(o.seed ?? 7)
  const { data: pageRgb, info } = await sharp(png)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  let src = pageRgb
  const sw = info.width
  const sh = info.height

  if (o.scribble) {
    const px = sw / PAGE.w
    const strokes: Array<string> = []
    for (let i = 0; i < 14; i++) {
      const x0 = (22 + rand() * 150) * px
      const y0 = (60 + rand() * 200) * px
      const pts = Array.from(
        { length: 6 },
        (_, k) =>
          `${(x0 + k * 14 * px * (rand() + 0.3)).toFixed(0)},${(y0 + (rand() - 0.5) * 28 * px).toFixed(0)}`,
      )
      strokes.push(
        `<polyline points="${pts.join(' ')}" fill="none" stroke="#1b2a6b" stroke-width="${(0.6 * px).toFixed(1)}" stroke-linecap="round"/>`,
      )
    }
    src = await sharp(src, { raw: { width: sw, height: sh, channels: 3 } })
      .composite([
        {
          input: Buffer.from(
            `<svg xmlns="http://www.w3.org/2000/svg" width="${sw}" height="${sh}">${strokes.join('')}</svg>`,
          ),
        },
      ])
      .removeAlpha()
      .raw()
      .toBuffer()
  }

  // where the page lands in the photo
  const side = o.size ?? 1600
  const ow = Math.round(side * 0.78)
  const oh = side
  const cx = ow / 2
  const cy = oh / 2
  const pw = ow * 0.8
  const ph = pw * (PAGE.h / PAGE.w)
  const persp = o.perspective ?? 0
  const top = pw * (1 + 0.14 * persp)
  const bot = pw * (1 - 0.14 * persp)
  const quad: Array<[number, number]> = [
    [-top / 2, -ph / 2],
    [top / 2, -ph / 2],
    [bot / 2, ph / 2],
    [-bot / 2, ph / 2],
  ]
  const th = ((o.rotate ?? 0) * Math.PI) / 180
  const c = Math.cos(th)
  const s = Math.sin(th)
  const dst = quad.map(
    ([x, y]) => [cx + x * c - y * s, cy + x * s + y * c] as [number, number],
  )
  const xs = dst.map((p) => p[0])
  const ys = dst.map((p) => p[1])
  const k = Math.min(
    1,
    (ow * 0.96) / (Math.max(...xs) - Math.min(...xs)),
    (oh * 0.96) / (Math.max(...ys) - Math.min(...ys)),
  )
  const fit = dst.map(
    ([x, y]) => [cx + (x - cx) * k, cy + (y - cy) * k] as [number, number],
  )
  const H = solveHomography(fit, [
    [0, 0],
    [sw - 1, 0],
    [sw - 1, sh - 1],
    [0, sh - 1],
  ]) // photo -> page

  const out = Buffer.alloc(ow * oh * 3)
  const desk = [92, 78, 64]
  for (let y = 0; y < oh; y++) {
    for (let x = 0; x < ow; x++) {
      const w = H[6] * x + H[7] * y + 1
      const u = (H[0] * x + H[1] * y + H[2]) / w
      const v = (H[3] * x + H[4] * y + H[5]) / w
      const i = (y * ow + x) * 3
      let r = desk[0] + (x / ow) * 20
      let g = desk[1] + (x / ow) * 16
      let b = desk[2] + (x / ow) * 12
      if (u >= 0 && v >= 0 && u < sw - 1 && v < sh - 1) {
        const u0 = Math.floor(u)
        const v0 = Math.floor(v)
        const fx = u - u0
        const fy = v - v0
        const at = (xx: number, yy: number, ch: number) =>
          src[(yy * sw + xx) * 3 + ch]
        const px = (ch: number) =>
          at(u0, v0, ch) * (1 - fx) * (1 - fy) +
          at(u0 + 1, v0, ch) * fx * (1 - fy) +
          at(u0, v0 + 1, ch) * (1 - fx) * fy +
          at(u0 + 1, v0 + 1, ch) * fx * fy
        r = px(0)
        g = px(1)
        b = px(2)
      }
      if (o.shadow) {
        const t = Math.min(1, Math.max(0, (x / ow + y / oh) / 2 - 0.2) / 0.5)
        const f = 1 - 0.5 * t
        r *= f
        g *= f
        b *= f
      }
      if (o.noise) {
        const n = (rand() + rand() + rand() - 1.5) * 2 * o.noise
        r += n
        g += n
        b += n
      }
      out[i] = Math.max(0, Math.min(255, r))
      out[i + 1] = Math.max(0, Math.min(255, g))
      out[i + 2] = Math.max(0, Math.min(255, b))
    }
  }
  let img = sharp(out, { raw: { width: ow, height: oh, channels: 3 } })
  if (o.blur) img = img.blur(o.blur)
  return img.jpeg({ quality: o.jpeg ?? 82 }).toBuffer()
}
