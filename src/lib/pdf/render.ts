import { chromium } from 'playwright-core'
import type { Browser } from 'playwright-core'

/**
 * F033: server-side HTML->PDF on headless Chromium (tab09's locked choice). A single browser
 * instance is kept warm for the lifetime of this process rather than launched fresh per call --
 * launching Chromium is the expensive part of a render (far more than opening a page), and this
 * runs inside a request handler today (no background job queue exists yet, tab09's own "do not
 * run OCR/PDF inside a request handler" warning is a known gap, not an oversight -- see the F033
 * backlog note), so a request-scoped process would relaunch it every time regardless; keeping one
 * instance warm at least avoids paying that cost per PDF within a single warm process (and,
 * concretely, per test run in this suite -- launch/teardown churn across repeated PDF tests was
 * observed contributing to Vitest worker crashes on this memory-constrained host).
 */
let browserPromise: Promise<Browser> | null = null

/**
 * Where the browser comes from. On a developer machine, in tests and in CI it is Playwright's own
 * Chromium (`npx playwright install`). On Vercel there is no such install -- a PDF there failed
 * with "Executable doesn't exist" -- so the serverless-sized Chromium from @sparticuz/chromium is
 * used instead; its version is pinned to the one Playwright 1.63 expects (153). The import is
 * dynamic so nothing else ever loads that package.
 */
async function launchBrowser(): Promise<Browser> {
  if (process.env.VERCEL) {
    const serverlessChromium = (await import('@sparticuz/chromium')).default
    // No WebGL is needed to print a page; this also skips unpacking the graphics stack.
    serverlessChromium.setGraphicsMode = false
    const executablePath = await step(
      'unpack chromium',
      STEP_LIMIT_MS.unpack,
      serverlessChromium.executablePath(),
    )
    return chromium.launch({
      executablePath,
      args: serverlessChromium.args,
      headless: true,
      timeout: STEP_LIMIT_MS.launch,
    })
  }
  return chromium.launch({ timeout: STEP_LIMIT_MS.launch })
}

/**
 * A PDF that could not be made. The message is a plain sentence for the person who asked; `step`
 * names where it stopped, so the error log (error_log, kept in the database) says which step failed
 * even after the host's own logs are gone. Routes turn it into a 503 with that sentence.
 */
export class PdfRenderError extends Error {
  readonly status = 503
  constructor(
    readonly failedStep: string,
    cause: unknown,
  ) {
    super(
      'The PDF could not be made just now. Please try again in a minute, or download the Word file instead.',
    )
    this.name = 'PdfRenderError'
    const why = cause instanceof Error ? cause.message : String(cause)
    // what the error log keeps: the step and the underlying reason (the message above is for people)
    this.stack = `PdfRenderError at step "${failedStep}": ${why}\n${cause instanceof Error ? (cause.stack ?? '') : ''}`
  }
  toResponse(): Response {
    return Response.json(
      {
        error: 'pdf_unavailable',
        message: this.message,
        step: this.failedStep,
      },
      { status: this.status },
    )
  }
}

/**
 * Every step of a render has a time limit (the host stops a request after 300 s and leaves no trace
 * of where it was; a step that hangs must fail here first, by name).
 */
const STEP_LIMIT_MS = {
  unpack: 40_000,
  launch: 40_000,
  content: 30_000,
  fonts: 20_000,
  pdf: 60_000,
} as const

async function step<T>(name: string, ms: number, work: Promise<T>): Promise<T> {
  const started = Date.now()
  let timer: ReturnType<typeof setTimeout> | undefined
  try {
    const out = await Promise.race([
      work,
      new Promise<never>((_, reject) => {
        timer = setTimeout(
          () => reject(new Error(`timed out after ${ms} ms`)),
          ms,
        )
      }),
    ])
    if (process.env.VERCEL)
      console.log(`[pdf] ${name}: ${Date.now() - started} ms`)
    return out
  } catch (e) {
    console.error(`[pdf] ${name} failed after ${Date.now() - started} ms`, e)
    throw e instanceof PdfRenderError ? e : new PdfRenderError(name, e)
  } finally {
    clearTimeout(timer)
  }
}

/** Forget a browser that failed or hung, so the next PDF starts a fresh one. */
async function dropBrowser() {
  const p = browserPromise
  browserPromise = null
  try {
    await (await p)?.close()
  } catch {
    // it was never started, or is already gone
  }
}

async function getBrowser(): Promise<Browser> {
  try {
    if (!browserPromise) browserPromise = launchBrowser()
    let browser = await step(
      'launch chromium',
      STEP_LIMIT_MS.launch + STEP_LIMIT_MS.unpack,
      browserPromise,
    )
    if (!browser.isConnected()) {
      browserPromise = launchBrowser()
      browser = await step(
        'relaunch chromium',
        STEP_LIMIT_MS.launch + STEP_LIMIT_MS.unpack,
        browserPromise,
      )
    }
    return browser
  } catch (e) {
    await dropBrowser()
    throw e
  }
}

/**
 * A4 with print margins every real printer can reach (most can't print within ~5 mm of the edge).
 * Exported so F107's print checks lay pages out exactly as production does.
 */
export const PDF_PAGE_OPTIONS = {
  format: 'A4',
  printBackground: true,
  margin: { top: '14mm', bottom: '14mm', left: '12mm', right: '12mm' },
} as const

/**
 * Pages whose layout is fixed in millimetres on the whole sheet (the school answer booklets): no
 * page margin at all and the page size taken from the document's own @page rule, so what is printed
 * sits exactly where the scan reader expects it. Everything on such a page stays at least 7 mm from
 * the edge, which any school printer can reach.
 */
export const PDF_FULL_PAGE_OPTIONS = {
  format: 'A4',
  printBackground: true,
  margin: { top: '0', bottom: '0', left: '0', right: '0' },
  preferCSSPageSize: true,
} as const

export async function renderHtmlToPdf(
  html: string,
  options: {
    fullPage?: boolean
    /** Shorter limits, for tests only. */
    limits?: Partial<Record<'content' | 'fonts' | 'pdf', number>>
  } = {},
): Promise<Buffer> {
  const limit = { ...STEP_LIMIT_MS, ...options.limits }
  const browser = await getBrowser()
  const page = await step('open page', limit.content, browser.newPage())
  try {
    // 'load' (not 'networkidle') -- the templates embed everything (styles, no remote images or
    // fonts), so there is no network activity to wait out.
    await step(
      'set content',
      limit.content,
      page.setContent(html, {
        waitUntil: 'load',
        timeout: limit.content,
      }),
    )
    // F087: web fonts (the inlined Telugu one) decode asynchronously after 'load'. Printing before
    // they are ready would silently use a fallback, or nothing, for those characters.
    await step(
      'wait for fonts',
      limit.fonts,
      page.evaluate(async () => {
        await document.fonts.ready
      }),
    )
    return await step(
      'print pdf',
      limit.pdf,
      page.pdf(options.fullPage ? PDF_FULL_PAGE_OPTIONS : PDF_PAGE_OPTIONS),
    )
  } catch (e) {
    // a step that hung may have left the browser stuck: start a fresh one next time
    if (e instanceof PdfRenderError) await dropBrowser()
    throw e
  } finally {
    await page.close().catch(() => undefined)
  }
}
