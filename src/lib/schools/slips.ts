import type { StudentSlip } from './credentials'

const esc = (t: string) =>
  t
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

/**
 * Printable one-time sign-in slips, eight to an A4 page with cut lines. A slip carries the school
 * code, the student's login id and her one-time code; it never carries a password because she
 * chooses her own on first sign-in. The code works once and expires after 7 days.
 */
export function buildSlipsHtml(input: {
  schoolName: string
  schoolCode: string
  sectionLabel: string
  signInUrl: string
  slips: Array<StudentSlip>
}): string {
  const cards = input.slips
    .map(
      (s) => `<div class="slip">
  <div class="school">${esc(input.schoolName)} &middot; ${esc(input.sectionLabel)}</div>
  <div class="name">${esc(s.name)}</div>
  <table>
    <tr><td>School code</td><td><b>${esc(input.schoolCode)}</b></td></tr>
    <tr><td>Your ID</td><td><b>${esc(s.loginId)}</b></td></tr>
    <tr><td>One-time code</td><td class="code">${esc(s.code)}</td></tr>
  </table>
  <div class="note">Go to ${esc(input.signInUrl)}, enter these, then choose your own password. The code works once and expires on ${esc(s.expiresAt.toISOString().slice(0, 10))}. Keep your password to yourself.</div>
</div>`,
    )
    .join('\n')
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@page { size: A4; margin: 10mm; }
body { font-family: Arial, Helvetica, sans-serif; margin: 0; }
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
.slip { box-sizing: border-box; height: 66mm; padding: 5mm; border: 1px dashed #888; page-break-inside: avoid; }
.school { font-size: 9pt; color: #444; }
.name { font-size: 13pt; font-weight: bold; margin: 2mm 0; }
table { font-size: 10pt; border-collapse: collapse; width: 100%; }
td { padding: 1mm 0; }
.code { font-family: 'Courier New', monospace; font-size: 15pt; font-weight: bold; letter-spacing: 1px; }
.note { font-size: 8pt; color: #444; margin-top: 2mm; }
</style></head><body><div class="grid">${cards}</div></body></html>`
}
