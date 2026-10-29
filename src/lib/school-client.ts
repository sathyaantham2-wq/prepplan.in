import type { SchoolOverview } from './schools/overview'

// Browser-side helpers for the school screens. Errors come back as plain sentences the screens
// can show as they are.
export type { SchoolOverview }

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message)
  }
}

export async function api<T = unknown>(
  path: string,
  init?: { method?: string; body?: unknown },
): Promise<T> {
  const res = await fetch(path, {
    method: init?.method ?? (init?.body === undefined ? 'GET' : 'POST'),
    headers:
      init?.body === undefined
        ? undefined
        : { 'content-type': 'application/json' },
    body: init?.body === undefined ? undefined : JSON.stringify(init.body),
    credentials: 'same-origin',
  })
  if (res.ok)
    return (
      res.headers.get('content-type')?.includes('json')
        ? await res.json()
        : undefined
    ) as T
  // Use the server's own plain sentence when it sent one; otherwise a sensible default.
  let message: string | null = null
  try {
    const j = (await res.json()) as { message?: string }
    if (j.message) message = j.message
  } catch {
    // no body
  }
  if (!message) {
    message =
      res.status === 401
        ? 'Please sign in again.'
        : res.status === 404
          ? 'We could not find that.'
          : 'Something went wrong. Please try again.'
  }
  throw new ApiError(res.status, message)
}

export interface MeResponse {
  name: string
  start: 'has_school' | 'can_create' | 'personal_account'
  schools: Array<{ id: string; name: string; role: string }>
}

export const ROLE_LABEL: Record<string, string> = {
  school_admin: 'School office',
  principal: 'Principal',
  teacher: 'Teacher',
  student: 'Student',
  parent: 'Parent',
}

export async function fileToBase64(file: File): Promise<string> {
  const bytes = new Uint8Array(await file.arrayBuffer())
  let binary = ''
  for (let i = 0; i < bytes.length; i += 0x8000)
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  return btoa(binary)
}

export function downloadText(fileName: string, text: string) {
  const url = URL.createObjectURL(
    new Blob([text], { type: 'text/csv;charset=utf-8' }),
  )
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  a.click()
  URL.revokeObjectURL(url)
}

/** A plain print window for a one-time code (nothing else on the page). */
export function printCodeSlip(lines: Array<[string, string]>, title: string) {
  const w = window.open('', '_blank', 'width=480,height=600')
  if (!w) return
  const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;')
  w.document.write(
    `<!doctype html><title>${esc(title)}</title><body style="font-family:Arial,sans-serif;padding:24px"><h2>${esc(title)}</h2>` +
      lines
        .map(
          ([k, v]) =>
            `<p style="font-size:16px">${esc(k)}<br><b style="font-size:22px;letter-spacing:1px">${esc(v)}</b></p>`,
        )
        .join('') +
      `<p style="color:#555;font-size:13px">The code works once. Keep it private.</p></body>`,
  )
  w.document.close()
  w.focus()
  w.print()
}

/**
 * Opens a PDF the signed-in person asked for in a new tab. The tab is opened first (a browser only
 * allows that from a tap) and pointed at the file once it has arrived.
 */
export async function openPdf(path: string, body?: unknown): Promise<void> {
  const tab = window.open('', '_blank')
  try {
    const res = await fetch(path, {
      method: body === undefined ? 'GET' : 'POST',
      headers:
        body === undefined ? undefined : { 'content-type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      credentials: 'same-origin',
    })
    if (!res.ok) {
      let message = 'We could not make that file. Please try again.'
      try {
        const j = (await res.json()) as { message?: string }
        if (j.message) message = j.message
      } catch {
        // keep the default
      }
      throw new ApiError(res.status, message)
    }
    const url = URL.createObjectURL(await res.blob())
    if (tab) tab.location.href = url
    else window.location.href = url
  } catch (e) {
    tab?.close()
    throw e
  }
}

export interface BookletJobProgress {
  jobId: string
  status: 'running' | 'done' | 'failed'
  total: number
  done: number
  batches: { done: number; total: number }
  pages: number | null
  message: string | null
  ready: boolean
}

/**
 * Prints answer booklets a few at a time: starts the job, then asks for one batch after another
 * (each a short request) and reports progress. Resolves with the finished job; the joined PDF is
 * then at `${base}/booklet-jobs/${jobId}/result`.
 */
export async function runBookletJob(
  base: string,
  body: Record<string, unknown>,
  onProgress: (p: BookletJobProgress) => void,
): Promise<BookletJobProgress> {
  let job = await api<BookletJobProgress>(`${base}/booklets`, { body })
  onProgress(job)
  while (job.status === 'running') {
    job = await api<BookletJobProgress>(`${base}/booklet-jobs/${job.jobId}`, {
      method: 'POST',
    })
    onProgress(job)
  }
  if (job.status === 'failed')
    throw new Error(job.message ?? 'The booklets could not be printed.')
  return job
}

/**
 * Downloads a file the signed-in person asked for (a Word paper): the request carries the sign-in,
 * and the browser is handed the file with its own name.
 */
export async function downloadFile(path: string): Promise<void> {
  const res = await fetch(path, { credentials: 'same-origin' })
  if (!res.ok) {
    let message = 'We could not make that file. Please try again.'
    try {
      const j = (await res.json()) as { message?: string }
      if (j.message) message = j.message
    } catch {
      // keep the default
    }
    throw new ApiError(res.status, message)
  }
  const name =
    /filename="([^"]+)"/.exec(
      res.headers.get('content-disposition') ?? '',
    )?.[1] ?? 'question-paper.docx'
  const url = URL.createObjectURL(await res.blob())
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 10_000)
}
