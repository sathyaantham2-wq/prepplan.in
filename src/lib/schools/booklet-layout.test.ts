import { describe, expect, it } from 'vitest'
import { PAGE, boxHeight, layoutBooklet } from './booklet-layout'
import type { BookletQuestion } from './booklet-layout'
import { bookletPageToken, parseQrContent, qrContent } from './booklet-token'

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
const cbse80 = (): Array<BookletQuestion> => [
  ...Array.from({ length: 20 }, (_, i) =>
    q(i + 1, { isMcq: true, marks: 1, expectedWords: null }),
  ),
  ...Array.from({ length: 5 }, (_, i) =>
    q(21 + i, { marks: 2, expectedWords: 40, hasAlternate: i < 2 }),
  ),
  ...Array.from({ length: 6 }, (_, i) =>
    q(26 + i, { marks: 3, expectedWords: 60, hasAlternate: i < 2 }),
  ),
  ...Array.from({ length: 4 }, (_, i) =>
    q(32 + i, { marks: 5, expectedWords: 120, hasAlternate: i < 3 }),
  ),
  ...Array.from({ length: 3 }, (_, i) =>
    q(36 + i, { marks: 4, expectedWords: 100, hasAlternate: i < 1 }),
  ),
]

describe('boxHeight', () => {
  it('grows with the word limit, so more marks get a bigger box', () => {
    const h = (marks: number, words: number) =>
      boxHeight({ marks, expectedWords: words })
    expect(h(2, 40)).toBeLessThan(h(3, 60))
    expect(h(3, 60)).toBeLessThan(h(4, 100))
    expect(h(4, 100)).toBeLessThan(h(5, 120))
    expect(h(1, 0)).toBe(24)
  })
})

describe('layoutBooklet (80-mark CBSE paper)', () => {
  const m = layoutBooklet(cbse80())

  it('has a cover with 20 bubble rows, answer pages, a rough work page and an extra-space page', () => {
    expect(m.pages[0].kind).toBe('cover')
    expect(m.pages[0].bubbles).toHaveLength(20)
    expect(m.pages.at(-2)?.kind).toBe('rough')
    expect(m.pages.at(-1)?.kind).toBe('extra')
    expect(
      m.pages.filter((p) => p.kind === 'answers').length,
    ).toBeGreaterThanOrEqual(3)
    expect(m.pageCount).toBe(m.pages.length)
    m.pages.forEach((p, i) => expect(p.page).toBe(i + 1))
  })

  it('gives every written question exactly one box, in order, and every MCQ four bubbles', () => {
    const boxes = m.pages
      .flatMap((p) => p.boxes)
      .filter((b) => b.key.startsWith('q'))
    expect(boxes.map((b) => b.key)).toEqual(
      Array.from({ length: 18 }, (_, i) => `q${21 + i}`),
    )
    for (const p of m.pages)
      for (const b of p.bubbles)
        expect(b.options.map((o) => o.label)).toEqual(['A', 'B', 'C', 'D'])
    expect(m.pages.flatMap((p) => p.bubbles).map((b) => b.position)).toEqual(
      Array.from({ length: 20 }, (_, i) => i + 1),
    )
  })

  it('sizes a box to its marks: 5-mark boxes are taller than 2-mark boxes', () => {
    const h = (key: string) =>
      m.pages.flatMap((p) => p.boxes).find((b) => b.key === key)!.h
    expect(h('q32')).toBeGreaterThan(h('q26'))
    expect(h('q26')).toBeGreaterThan(h('q21'))
  })

  it('an OR question has one box that says to write which one is answered', () => {
    const b = m.pages.flatMap((p) => p.boxes).find((x) => x.key === 'q21')!
    expect(b.label).toMatch(/answer either 21A or 21B/)
  })

  it('everything stays on the page, clear of the corner marks and the QR, and nothing overlaps', () => {
    for (const p of m.pages) {
      const rects = [
        ...p.boxes.map((b) => ({
          name: b.key,
          x: b.x,
          y: b.y - 7,
          w: b.w,
          h: b.h + 7,
        })),
        ...p.bubbles.flatMap((b) =>
          b.options.map((o) => ({
            name: `b${b.position}${o.label}`,
            x: o.cx - b.r,
            y: o.cy - b.r,
            w: b.r * 2,
            h: b.r * 2,
          })),
        ),
      ]
      for (const r of rects) {
        expect(r.x, `${r.name} left`).toBeGreaterThanOrEqual(10)
        expect(r.y, `${r.name} top`).toBeGreaterThanOrEqual(26)
        expect(r.x + r.w, `${r.name} right`).toBeLessThanOrEqual(PAGE.w - 10)
        expect(r.y + r.h, `${r.name} bottom`).toBeLessThanOrEqual(PAGE.h - 12)
        // not under the QR code
        const underQr =
          r.x < p.qr.x + p.qr.size &&
          r.x + r.w > p.qr.x &&
          r.y < p.qr.y + p.qr.size &&
          r.y + r.h > p.qr.y
        expect(underQr, `${r.name} under the QR`).toBe(false)
      }
      const boxes = p.boxes.map((b) => ({ y: b.y - 7, bottom: b.y + b.h }))
      boxes.sort((a, b) => a.y - b.y)
      for (let i = 1; i < boxes.length; i++)
        expect(boxes[i].y).toBeGreaterThanOrEqual(boxes[i - 1].bottom)
      expect(p.corners).toHaveLength(4)
    }
  })

  it('is deterministic: the same paper always gives the same pages', () => {
    expect(JSON.stringify(layoutBooklet(cbse80()))).toBe(JSON.stringify(m))
  })

  it('a paper with no multiple choice has no bubbles; a very long one adds bubble pages', () => {
    expect(layoutBooklet([q(1), q(2)]).pages[0].bubbles).toEqual([])
    const many = layoutBooklet(
      Array.from({ length: 90 }, (_, i) =>
        q(i + 1, { isMcq: true, marks: 1, expectedWords: null }),
      ),
    )
    expect(many.pages.flatMap((p) => p.bubbles)).toHaveLength(90)
    expect(many.pages.some((p) => p.kind === 'bubbles')).toBe(true)
  })
})

describe('booklet page tokens', () => {
  const base = { schoolId: 's', examId: 'e', schoolStudentId: 'st', page: 1 }
  const secret = 'test-secret'
  it('are stable, unique per page and per student, and use no look-alike characters', () => {
    const a = bookletPageToken(base, secret)
    expect(bookletPageToken(base, secret)).toBe(a)
    expect(a).toMatch(/^[2-9A-HJKMNP-Z]{26}$/)
    const all = new Set(
      [1, 2, 3, 4, 5, 6].map((page) =>
        bookletPageToken({ ...base, page }, secret),
      ),
    )
    all.add(bookletPageToken({ ...base, schoolStudentId: 'other' }, secret))
    all.add(bookletPageToken({ ...base, examId: 'other' }, secret))
    all.add(bookletPageToken({ ...base, schoolId: 'other' }, secret))
    expect(all.size).toBe(9)
  })
  it('cannot be made without the secret, and the QR text carries nothing but the token', () => {
    expect(bookletPageToken(base, 'another-secret')).not.toBe(
      bookletPageToken(base, secret),
    )
    const text = qrContent(bookletPageToken(base, secret))
    expect(text).toMatch(/^PPB1-[2-9A-HJKMNP-Z]{26}$/)
    expect(text).not.toMatch(/st|other/i)
    expect(parseQrContent(text)).toBe(bookletPageToken(base, secret))
    expect(parseQrContent('PPB1-short')).toBeNull()
    expect(parseQrContent('https://evil.example')).toBeNull()
  })
})
