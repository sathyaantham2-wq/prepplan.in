import { renderHtmlToPdf } from './render'

/**
 * Number of pages in a PDF Chromium produced. Page objects are written as plain dictionaries
 * (`/Type /Page`), distinct from the `/Type /Pages` tree node, so counting them is exact for this
 * renderer; the test compares the result with pdfjs's own count so a change of renderer shows up.
 */
export function countPdfPages(pdf: Buffer | Uint8Array): number {
  const text = Buffer.from(pdf).toString('latin1')
  return (text.match(/\/Type\s*\/Page(?![A-Za-z])/g) ?? []).length
}

/**
 * A paper that prints "this paper has N pages" must say the right N, and N is only known after
 * rendering. Render, read the real page count, render again with that count in the header, and
 * repeat until the number printed equals the number of pages produced. Throws rather than
 * returning a paper whose printed page count is wrong.
 */
export async function renderWithPageCount(
  buildHtml: (pageCount: number | undefined) => string,
): Promise<{ pdf: Buffer; pages: number }> {
  let printed: number | undefined
  for (let attempt = 0; attempt < 4; attempt++) {
    const pdf = await renderHtmlToPdf(buildHtml(printed))
    const actual = countPdfPages(pdf)
    if (actual === printed) return { pdf, pages: actual }
    printed = actual
  }
  throw new Error('The printed page count did not settle after four renders')
}
