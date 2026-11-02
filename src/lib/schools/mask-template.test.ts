import sharp from 'sharp'
import { describe, expect, it } from 'vitest'
import { DEFAULT_MASK, maskFor, maskRects, parseMaskTemplate } from './mask-template'
import { pageForMarking } from './marking'

// The name and roll area never goes to the marking AI (owner decision B, 2026-11-02): a pixel test on the picture
// that would be sent, and the rules for a school's own template.
const black = (w: number, h: number) =>
  sharp({ create: { width: w, height: h, channels: 3, background: '#000000' } }).png().toBuffer()

async function pixels(out: { base64: string }) {
  const r = await sharp(Buffer.from(out.base64, 'base64')).raw().toBuffer({ resolveWithObject: true })
  const at = (x: number, y: number) => r.data[(y * r.info.width + x) * r.info.channels]
  return { w: r.info.width, h: r.info.height, at }
}

describe('mask template rules', () => {
  it('no stored template means the top 12 % of the first page', () => {
    expect(maskFor(null)).toEqual(DEFAULT_MASK)
    expect(maskRects(DEFAULT_MASK, true, 1000, 1000)).toEqual([{ left: 0, top: 0, width: 1000, height: 120 }])
    expect(maskRects(DEFAULT_MASK, false, 1000, 1000)).toEqual([])
  })

  it('a damaged stored template falls back to the default, never to "mask nothing"', () => {
    expect(maskFor({ boxes: 'x' })).toEqual(DEFAULT_MASK)
    expect(maskFor({ boxes: [{ x: 0.9, y: 0, w: 0.5, h: 0.1 }] })).toEqual(DEFAULT_MASK)
  })

  it('refuses boxes outside the page, tiny boxes, NaN, strings and too many boxes', () => {
    const box = { x: 0.1, y: 0.1, w: 0.3, h: 0.1 }
    expect(parseMaskTemplate({ boxes: [box], everyPageStrip: false })).not.toBeNull()
    for (const bad of [
      { ...box, x: -0.1 },
      { ...box, w: 1.2 },
      { ...box, h: 0.001 },
      { ...box, x: Number.NaN },
      { ...box, y: '0.1' },
      { ...box, x: 0.8, w: 0.5 },
    ])
      expect(parseMaskTemplate({ boxes: [bad], everyPageStrip: false })).toBeNull()
    expect(parseMaskTemplate({ boxes: Array(7).fill(box), everyPageStrip: false })).toBeNull()
    expect(parseMaskTemplate(null)).toBeNull()
  })

  it('the every-page strip adds the top strip to later pages too', () => {
    const t = { boxes: [], everyPageStrip: true }
    expect(maskRects(t, false, 500, 1000)).toEqual([{ left: 0, top: 0, width: 500, height: 120 }])
  })
})

describe('the picture that goes to the AI', () => {
  it('a school box is white in the outgoing picture and the rest is untouched', async () => {
    const t = parseMaskTemplate({ boxes: [{ x: 0.5, y: 0.5, w: 0.25, h: 0.25 }], everyPageStrip: false })!
    const p = await pixels(await pageForMarking(await black(400, 400), true, t))
    expect(p.at(Math.round(p.w * 0.6), Math.round(p.h * 0.6))).toBeGreaterThan(240)
    expect(p.at(5, 5)).toBeLessThan(15) // the default strip is not applied when the school chose its own box
    expect(p.at(Math.round(p.w * 0.9), Math.round(p.h * 0.9))).toBeLessThan(15)
  })

  it('later pages stay unmasked unless the school asked for the strip on every page', async () => {
    const plain = await pixels(await pageForMarking(await black(400, 400), false, DEFAULT_MASK))
    expect(plain.at(5, 5)).toBeLessThan(15)
    const strip = await pixels(await pageForMarking(await black(400, 400), false, { boxes: [], everyPageStrip: true }))
    expect(strip.at(5, 5)).toBeGreaterThan(240)
    expect(strip.at(5, Math.round(strip.h * 0.5))).toBeLessThan(15)
  })

  it('the outgoing picture never equals the original, even with no box on a later page being asked for', async () => {
    const png = await black(300, 300)
    const out = await pageForMarking(png, true)
    expect(out.base64).not.toBe(png.toString('base64'))
  })
})
