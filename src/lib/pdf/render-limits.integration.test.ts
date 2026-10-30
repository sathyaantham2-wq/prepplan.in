import { describe, expect, it } from 'vitest'
import { withErrorCapture } from '../error-log'
import { PdfRenderError, renderHtmlToPdf } from './render'

// A render that hangs must fail by name within its step limit (the host stops a request after
// 300 s and leaves no trace), the person gets a plain sentence, and the next PDF still works.
describe('PDF step limits', () => {
  it('a page that never finishes loading fails at "set content", and the next PDF is fine', async () => {
    const hang = '<html><body><script>for(;;){}</script></body></html>'
    const err = await renderHtmlToPdf(hang, { limits: { content: 1500 } }).then(
      () => null,
      (e: unknown) => e,
    )
    expect(err).toBeInstanceOf(PdfRenderError)
    expect((err as PdfRenderError).failedStep).toBe('set content')
    expect((err as PdfRenderError).message).toMatch(/Word file/)
    expect((err as PdfRenderError).stack).toMatch(/step "set content"/)
    const ok = await renderHtmlToPdf('<html><body><p>Hello</p></body></html>')
    expect(ok.subarray(0, 4).toString()).toBe('%PDF')
  }, 120_000)

  it('a route answers a failed PDF with 503 and the plain sentence, not a bare 500', async () => {
    const handler = withErrorCapture('GET /test', () =>
      Promise.reject(new PdfRenderError('print pdf', new Error('timed out'))),
    )
    const res = await handler({
      request: new Request('http://localhost/x'),
      params: {},
    })
    expect(res.status).toBe(503)
    const body = (await res.json()) as { message: string; step: string }
    expect(body.message).toMatch(/download the Word file instead/)
    expect(body.step).toBe('print pdf')
    expect(res.headers.get('x-request-id')).toBeTruthy()
  })
})
