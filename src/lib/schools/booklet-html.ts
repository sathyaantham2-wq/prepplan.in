import QRCode from 'qrcode'
import { escapeHtml } from '../pdf/html-utils'
import type { BookletManifest, PageSpec } from './booklet-layout'
import { qrContent } from './booklet-token'

// The printable Smart Answer Booklets. Every page is a fixed A4 sheet with everything placed in
// millimetres from the manifest (see booklet-layout.ts), so what is printed is exactly what the scan
// reader expects. One booklet after another, each page starting a new sheet.

export interface BookletStudent {
  name: string
  admissionNo: string
  rollNo: string
  sectionName: string
  /** One token per page, in page order. */
  tokens: Array<string>
}

export interface BookletHtmlInput {
  schoolName: string
  examTitle: string
  subjectName: string
  className: string
  durationMin: number
  totalMarks: number
  manifest: BookletManifest
  students: Array<BookletStudent>
}

async function qrSvg(token: string): Promise<string> {
  const svg = await QRCode.toString(qrContent(token), {
    type: 'svg',
    margin: 0,
    errorCorrectionLevel: 'M',
  })
  // Let the surrounding box set the size.
  return svg.replace(
    '<svg ',
    '<svg width="100%" height="100%" preserveAspectRatio="xMidYMid meet" ',
  )
}

const mm = (n: number) => `${Math.round(n * 100) / 100}mm`

function pageHtml(
  input: BookletHtmlInput,
  s: BookletStudent,
  p: PageSpec,
  qr: string,
): string {
  const m = input.manifest
  const parts: Array<string> = []
  for (const c of p.corners)
    parts.push(
      `<div class="corner" style="left:${mm(c.x)};top:${mm(c.y)};width:${mm(c.size)};height:${mm(c.size)}"></div>`,
    )
  parts.push(
    `<div class="qr" style="left:${mm(p.qr.x)};top:${mm(p.qr.y)};width:${mm(p.qr.size)};height:${mm(p.qr.size)}">${qr}</div>`,
  )
  // header: school, exam and (on every page) the pre-printed student identity
  parts.push(`<div class="head" style="left:16mm;top:8mm;width:${mm(p.qr.x - 20)}">
    <div class="school">${escapeHtml(input.schoolName)}</div>
    <div class="exam">${escapeHtml(input.examTitle)} · ${escapeHtml(input.subjectName)} · ${escapeHtml(input.className)}</div>
    <div class="who"><b>${escapeHtml(s.name)}</b> &nbsp; ID <span class="mono">${escapeHtml(s.admissionNo)}</span> &nbsp; Roll ${escapeHtml(s.rollNo)} &nbsp; ${escapeHtml(s.sectionName)}</div>
  </div>`)
  if (p.kind === 'cover') {
    parts.push(`<div class="cover-block" style="left:16mm;top:34mm;width:178mm">
      <div class="title">Answer Booklet</div>
      <table class="details">
        <tr><td>Name</td><td><b>${escapeHtml(s.name)}</b></td><td>Class</td><td>${escapeHtml(input.className)} ${escapeHtml(s.sectionName)}</td></tr>
        <tr><td>Student ID</td><td class="mono"><b>${escapeHtml(s.admissionNo)}</b></td><td>Roll no.</td><td>${escapeHtml(s.rollNo)}</td></tr>
        <tr><td>Subject</td><td>${escapeHtml(input.subjectName)}</td><td>Marks · Time</td><td>${input.totalMarks} marks · ${input.durationMin} min</td></tr>
      </table>
      <ul class="rules">
        <li>Write each answer only inside its own box. Use a dark pen.</li>
        <li>For a multiple-choice question, fill one circle completely.</li>
        <li>If a box is full, use the extra-space page and write the question number there.</li>
        <li>Do not write on the black squares or the QR code. Do not tear or fold this booklet.</li>
      </ul>
    </div>`)
  }
  if (p.kind === 'cover' && p.bubbleHeaders.length > 0) {
    parts.push(
      `<div class="label" style="left:16mm;top:${mm(p.bubbleHeaders[0].y - 9)};width:178mm">Multiple choice: fill one circle for each question</div>`,
    )
  }
  for (const h of p.bubbleHeaders)
    parts.push(
      `<div class="bubble-head" style="left:${mm(h.cx - 3)};top:${mm(h.y)};width:6mm">${escapeHtml(h.label)}</div>`,
    )
  for (const b of p.bubbles) {
    const first = b.options[0]
    parts.push(
      `<div class="qno" style="left:${mm(first.cx - 15)};top:${mm(first.cy - 2.5)}">${b.position}</div>`,
    )
    for (const o of b.options)
      parts.push(
        `<div class="bubble" data-q="${b.position}" data-o="${o.label}" style="left:${mm(o.cx - b.r)};top:${mm(o.cy - b.r)};width:${mm(b.r * 2)};height:${mm(b.r * 2)}"></div>`,
      )
  }
  for (const box of p.boxes) {
    parts.push(
      `<div class="label" style="left:${mm(box.x)};top:${mm(box.y - 6.5)};width:${mm(box.w)}">${escapeHtml(box.label)}${box.marks > 0 ? ` <span class="marks">[${box.marks} ${box.marks === 1 ? 'mark' : 'marks'}]</span>` : ''}</div>`,
    )
    parts.push(
      `<div class="box ${p.kind === 'rough' ? 'rough' : ''}" data-box="${escapeHtml(box.key)}" style="left:${mm(box.x)};top:${mm(box.y)};width:${mm(box.w)};height:${mm(box.h)}"></div>`,
    )
  }
  parts.push(
    `<div class="foot" style="left:16mm;top:${mm(m.pageH - 11)};width:${mm(m.pageW - 32)}"><span>${escapeHtml(s.name)} · ID ${escapeHtml(s.admissionNo)}</span><span>Page ${p.page} of ${m.pageCount}</span></div>`,
  )
  return `<section class="page">${parts.join('')}</section>`
}

const CSS = `
@page { size: 210mm 297mm; margin: 0; }
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body { font-family: Arial, Helvetica, sans-serif; color: #111; }
.page { position: relative; width: 210mm; height: 297mm; overflow: hidden; page-break-after: always; break-after: page; background: #fff; }
.page:last-child { page-break-after: auto; break-after: auto; }
.corner { position: absolute; background: #000; }
.qr { position: absolute; }
.head { position: absolute; font-size: 8.5pt; line-height: 1.35; }
.school { font-size: 11pt; font-weight: bold; }
.exam { color: #333; }
.who { margin-top: 1mm; }
.mono { font-family: Menlo, 'DejaVu Sans Mono', Consolas, 'Courier New', monospace; font-weight: bold; }
.cover-block { position: absolute; }
.title { font-size: 20pt; font-weight: bold; margin-bottom: 3mm; }
table.details { border-collapse: collapse; width: 100%; font-size: 10pt; }
table.details td { border: 0.3mm solid #444; padding: 1.6mm 2.4mm; }
table.details td:nth-child(odd) { background: #f1f1f1; width: 24mm; }
ul.rules { font-size: 8.5pt; margin: 3mm 0 0; padding-left: 5mm; line-height: 1.45; }
.bubble-head { position: absolute; text-align: center; font-size: 8pt; font-weight: bold; color: #333; }
.qno { position: absolute; width: 9mm; text-align: right; font-size: 9pt; font-weight: bold; }
.bubble { position: absolute; border: 0.45mm solid #222; border-radius: 50%; }
.label { position: absolute; font-size: 9pt; font-weight: bold; }
.label .marks { font-weight: normal; color: #444; }
.box { position: absolute; border: 0.5mm solid #222; background-image: repeating-linear-gradient(to bottom, transparent 0, transparent 7.7mm, #cfcfcf 7.7mm, #cfcfcf 8mm); }
.box.rough { background-image: radial-gradient(#cfcfcf 0.3mm, transparent 0.35mm); background-size: 6mm 6mm; }
.foot { position: absolute; display: flex; justify-content: space-between; font-size: 7.5pt; color: #555; }
`

export async function buildBookletsHtml(
  input: BookletHtmlInput,
): Promise<string> {
  const tokens = new Set(input.students.flatMap((s) => s.tokens))
  const svgs = new Map<string, string>()
  for (const t of tokens) svgs.set(t, await qrSvg(t))
  const pages: Array<string> = []
  for (const s of input.students) {
    if (s.tokens.length !== input.manifest.pageCount)
      throw new Error('A booklet needs one token for every page')
    input.manifest.pages.forEach((p, i) =>
      pages.push(pageHtml(input, s, p, svgs.get(s.tokens[i]) ?? '')),
    )
  }
  return `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>${pages.join('')}</body></html>`
}
