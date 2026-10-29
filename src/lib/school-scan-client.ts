import { ApiError } from './school-client'

// Browser side of the school scan upload. Unlike the personal app's uploader (src/lib/scan-client.ts,
// which shrinks pages to 1800 px and re-compresses them), nothing is shrunk or re-encoded here:
//   - a photo is sent as the very file the phone or scanner made, byte for byte;
//   - a PDF page is drawn at 200 dpi and saved as PNG (lossless), because a page of a PDF is not a
//     file of its own and has to be drawn to become a picture.
// A file bigger than one request may carry (about 4.5 MB on the host) is sent in pieces of at most
// 3.5 MB and joined on the server.

export const MAX_FILE_BYTES = 12 * 1024 * 1024
export const CHUNK_BYTES = 3.5 * 1024 * 1024
const PDF_DPI = 200

export interface OriginalPage {
  key: string
  /** For messages: "IMG_2041.jpg" or "scan.pdf, page 3". */
  source: string
  blob: Blob
}

let counter = 0
const keyOf = () => `orig-${Date.now()}-${(counter += 1)}`

async function pdfToPages(file: File): Promise<Array<OriginalPage>> {
  const [pdfjs, worker] = await Promise.all([
    import('pdfjs-dist'),
    import('pdfjs-dist/build/pdf.worker.min.mjs?url'),
  ])
  pdfjs.GlobalWorkerOptions.workerSrc = worker.default
  const task = pdfjs.getDocument({ data: await file.arrayBuffer() })
  const doc = await task.promise
  const pages: Array<OriginalPage> = []
  try {
    for (let n = 1; n <= doc.numPages; n++) {
      const page = await doc.getPage(n)
      // a PDF page is 72 units to the inch
      const viewport = page.getViewport({ scale: PDF_DPI / 72 })
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(viewport.width)
      canvas.height = Math.round(viewport.height)
      await page.render({ canvas, viewport, background: '#ffffff' }).promise
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, 'image/png'),
      )
      if (!blob)
        throw new Error(`Page ${n} of "${file.name}" could not be read.`)
      pages.push({ key: keyOf(), source: `${file.name}, page ${n}`, blob })
      page.cleanup()
    }
  } finally {
    await task.destroy()
  }
  return pages
}

/** Every page in the chosen files, in the order chosen. Photos are passed on untouched. */
export async function filesToOriginalPages(
  files: Array<File>,
): Promise<Array<OriginalPage>> {
  const pages: Array<OriginalPage> = []
  for (const file of files) {
    if (
      file.type === 'application/pdf' ||
      file.name.toLowerCase().endsWith('.pdf')
    )
      pages.push(...(await pdfToPages(file)))
    else if (file.type.startsWith('image/'))
      pages.push({ key: keyOf(), source: file.name, blob: file })
    else throw new Error(`"${file.name}" is not a photo or a PDF.`)
  }
  return pages
}

/** Sends a file in pieces; returns what to name in the final request. */
export async function sendInPieces(
  base: string,
  blob: Blob,
  chunkPath = 'scan-chunks',
): Promise<{ uploadId: string; chunks: number }> {
  if (blob.size > MAX_FILE_BYTES)
    throw new Error(
      'This file is bigger than 12 MB. Send the original photo, not a bigger copy.',
    )
  const uploadId = crypto.randomUUID()
  const chunks = Math.max(1, Math.ceil(blob.size / CHUNK_BYTES))
  for (let i = 0; i < chunks; i++) {
    const res = await fetch(`${base}/${chunkPath}/${uploadId}?seq=${i}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/octet-stream' },
      body: blob.slice(i * CHUNK_BYTES, (i + 1) * CHUNK_BYTES),
      credentials: 'same-origin',
    })
    if (!res.ok) {
      let message = 'This file could not be sent. Please try again.'
      try {
        const j = (await res.json()) as { message?: string }
        if (j.message) message = j.message
      } catch {
        // keep the default
      }
      throw new ApiError(res.status, message)
    }
  }
  return { uploadId, chunks }
}
