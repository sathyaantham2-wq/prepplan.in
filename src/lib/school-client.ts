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
