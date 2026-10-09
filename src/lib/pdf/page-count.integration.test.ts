import { describe, expect, it } from 'vitest'
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'
import { countPdfPages, renderWithPageCount } from './page-count'

// The printed "Printed pages: N" must equal the pages actually produced, and the cheap byte count
// must agree with pdfjs's own, so a change of PDF renderer cannot silently break the check.
const longPaper = (pageCount: number | undefined) =>
  `<!doctype html><html><body><p>Printed pages: ${pageCount ?? ''}</p>${Array.from({ length: 160 }, (_, i) => `<p>Line ${i}</p>`).join('')}</body></html>`

describe('renderWithPageCount', () => {
  it('prints the real page count and counts pages the way pdfjs does', async () => {
    const { pdf, pages } = await renderWithPageCount(longPaper)
    expect(pages).toBeGreaterThan(1)
    const doc = await getDocument({ data: new Uint8Array(pdf) }).promise
    expect(doc.numPages).toBe(pages)
    expect(countPdfPages(pdf)).toBe(doc.numPages)
    const page = await doc.getPage(1)
    const text = (await page.getTextContent()).items.map((i) => ('str' in i ? i.str : '')).join(' ')
    expect(text).toContain(`Printed pages: ${pages}`)
  }, 60_000)
})
