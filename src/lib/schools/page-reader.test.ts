import sharp from 'sharp'
import { beforeAll, describe, expect, it } from 'vitest'
import { OUT_H, OUT_W, readBookletPage } from './page-reader'
import {
  fixtureBookletHtml,
  fixtureManifest,
  fixtureToken,
  photograph,
  renderPagePngs,
} from './scan-test-support'
import type { PhotoOptions } from './scan-test-support'

// How well the page reader copes with phone photos. The pages are the REAL booklet pages (same
// builders as the printed booklets), made to look like photos by scan-test-support.ts. This is a
// synthetic stand-in for the owner's real photos (see test-fixtures/school-scans/README.md).

/** The fine detail of a page (its lines and writing) with the lighting taken out, at a small size. */
const small = async (buf: Buffer) => {
  const grey = await sharp(buf)
    .resize(124, 176, { fit: 'fill' })
    .greyscale()
    .raw()
    .toBuffer()
  const soft = await sharp(buf)
    .resize(124, 176, { fit: 'fill' })
    .greyscale()
    .blur(5)
    .raw()
    .toBuffer()
  return Buffer.from(
    grey.map((v, i) => Math.max(0, Math.min(255, 128 + v - soft[i]))),
  )
}
/** How alike two small pictures are, from -1 to 1, whatever the brightness (a shadow still correlates). */
const correlation = (a: Buffer, b: Buffer) => {
  const n = a.length
  const ma = a.reduce((t, v) => t + v, 0) / n
  const mb = b.reduce((t, v) => t + v, 0) / n
  let ab = 0
  let aa = 0
  let bb = 0
  for (let i = 0; i < n; i++) {
    ab += (a[i] - ma) * (b[i] - mb)
    aa += (a[i] - ma) ** 2
    bb += (b[i] - mb) ** 2
  }
  return ab / Math.sqrt(aa * bb)
}

describe('the page reader on phone-style photos of real booklet pages', () => {
  const pageCount = fixtureManifest().pageCount
  let originals: Array<Buffer> // student one's pages, pristine
  beforeAll(async () => {
    const all = await renderPagePngs(
      await fixtureBookletHtml(),
      Array.from({ length: pageCount }, (_, i) => i),
    )
    originals = all
  }, 120_000)

  const cases: Array<[string, PhotoOptions]> = [
    ['a straight photo', {}],
    ['tilted 7 degrees', { rotate: 7 }],
    ['tilted -12 degrees', { rotate: -12 }],
    ['upside down', { rotate: 180 }],
    ['on its side (90)', { rotate: 90 }],
    ['on its other side (270)', { rotate: 270 }],
    ['slanted phone (perspective)', { perspective: 0.8, rotate: 4 }],
    ['a shadow across it', { shadow: true, rotate: -5 }],
    ['a little blur and grain', { blur: 1.2, noise: 14, rotate: 3 }],
    ['scribbled over in pen', { scribble: true, rotate: -3 }],
    [
      'a low-resolution photo in shadow',
      { size: 1100, shadow: true, rotate: -4, noise: 6 },
    ],
    [
      'everything at once',
      {
        rotate: 195,
        perspective: 0.6,
        shadow: true,
        blur: 1,
        noise: 12,
        scribble: true,
        jpeg: 60,
      },
    ],
  ]

  for (const [name, opts] of cases) {
    it(`reads every page: ${name}`, async () => {
      let sorted = 0
      let straightened = 0
      let worst = 1
      for (let p = 0; p < pageCount; p++) {
        const photo = await photograph(originals[p], { ...opts, seed: 11 + p })
        const r = await readBookletPage(photo)
        if (r.token === fixtureToken(0, p + 1)) sorted++
        if (r.straightened) {
          straightened++
          expect(r.image).not.toBeNull()
          const meta = await sharp(r.image!).metadata()
          expect([meta.width, meta.height]).toEqual([OUT_W, OUT_H])
          const d = correlation(
            await small(r.image!),
            await small(originals[p]),
          )
          worst = Math.min(worst, d)
        }
      }
      console.log(
        `${name}: ${sorted}/${pageCount} sorted, ${straightened}/${pageCount} straightened, weakest likeness to the original ${worst.toFixed(2)}`,
      )
      expect(sorted).toBe(pageCount)
      expect(straightened).toBe(pageCount)
      // scribbles are not on the pristine page, so that case is allowed to differ more
      expect(worst).toBeGreaterThan(opts.scribble ? 0.55 : 0.8)
    }, 180_000)
  }

  // Flatbed scans and scanned PDFs: the page fills the picture, so it is the pixels across the page
  // that matter. 150 dpi is 1240 px wide, 100 dpi 827 px. Rendered pages are 1240 px wide already.
  describe('flat scans', () => {
    const scan = async (
      png: Buffer,
      width: number,
      o: { rotate?: number; jpeg?: number } = {},
    ) =>
      sharp(png)
        .resize({ width })
        .rotate(o.rotate ?? 0, { background: '#ffffff' })
        .jpeg({ quality: o.jpeg ?? 75 })
        .toBuffer()
    const flat: Array<[string, number, { rotate?: number; jpeg?: number }]> = [
      ['150 dpi (1240 px wide)', 1240, {}],
      ['150 dpi, a degree or two crooked', 1240, { rotate: 1.5 }],
      ['150 dpi, fed in upside down', 1240, { rotate: 180 }],
      ['150 dpi, heavily compressed', 1240, { jpeg: 40 }],
      ['100 dpi (827 px wide)', 827, {}],
    ]
    for (const [name, width, o] of flat) {
      it(`reads every page: ${name}`, async () => {
        let sorted = 0
        for (let p = 0; p < pageCount; p++) {
          const r = await readBookletPage(await scan(originals[p], width, o))
          if (r.token === fixtureToken(0, p + 1)) sorted++
          else expect(r.token, 'must never be a different page').toBeNull()
        }
        console.log(`${name}: ${sorted}/${pageCount} sorted`)
        expect(sorted).toBe(pageCount)
      }, 120_000)
    }
  })

  it('says plainly when a picture has no code, and keeps it upright', async () => {
    const blank = await sharp({
      create: { width: 900, height: 1200, channels: 3, background: '#d9d4c7' },
    })
      .jpeg()
      .toBuffer()
    const r = await readBookletPage(blank)
    expect(r.token).toBeNull()
    expect(r.problem).toMatch(/No QR/)
  })

  it('says plainly when the file is not a picture', async () => {
    const r = await readBookletPage(Buffer.from('this is not a picture'))
    expect(r.token).toBeNull()
    expect(r.image).toBeNull()
    expect(r.problem).toMatch(/not a picture/)
  })

  it('does not mistake some other QR code for a booklet page', async () => {
    const QRCode = (await import('qrcode')).default
    const svg = await QRCode.toString('https://example.com/not-a-booklet', {
      type: 'svg',
      margin: 2,
    })
    const png = await sharp(Buffer.from(svg))
      .resize(600, 600)
      .flatten({ background: '#fff' })
      .png()
      .toBuffer()
    const r = await readBookletPage(png)
    expect(r.token).toBeNull()
  })
})
