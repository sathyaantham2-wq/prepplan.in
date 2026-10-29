/** A PDF a signed-in staff member asked for: shown in the browser, never cached or shared. */
export function pdfResponse(pdf: Buffer, fileName: string): Response {
  return new Response(new Uint8Array(pdf), {
    headers: {
      'content-type': 'application/pdf',
      'content-disposition': `inline; filename="${fileName}"`,
      'cache-control': 'private, no-store',
      'x-content-type-options': 'nosniff',
    },
  })
}

/** A Word file a signed-in staff member asked for: downloaded, never cached or shared. */
export function docxResponse(docx: Buffer, fileName: string): Response {
  return new Response(new Uint8Array(docx), {
    headers: {
      'content-type':
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'content-disposition': `attachment; filename="${fileName}"`,
      'cache-control': 'private, no-store',
      'x-content-type-options': 'nosniff',
    },
  })
}
