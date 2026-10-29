import { createHmac, hkdfSync } from 'node:crypto'
import QRCode from 'qrcode'
import { escapeHtml } from '../pdf/html-utils'
import { env } from '../env'
import { UNAMBIGUOUS_ALPHABET } from './alphabet'
import { PAGE, QR_SIZE_MM } from './booklet-layout'

// The QR cover page for answer sheets written on a school's OWN paper. One page per student, printed by
// PrepPlan, stapled on top of her sheets. It carries the same four corner marks and the same QR place and
// size as the exam booklet pages, so the page reader that straightens a booklet page straightens a cover
// too. The code is derived from a secret (HMAC), so a cover can be printed again identically, carries no
// name, and names exactly one student of one paper of one school.

export const COVER_QR_PREFIX = 'PPC1-'
const TOKEN_LENGTH = 26

const key = (secret: string) =>
  Buffer.from(hkdfSync('sha256', secret, 'prepplan-school', 'own-cover-v1', 32))

export function ownCoverToken(
  input: { schoolId: string; paperId: string; schoolStudentId: string },
  secret: string = env.BETTER_AUTH_SECRET,
): string {
  const mac = createHmac('sha256', key(secret))
    .update(`${input.schoolId}|${input.paperId}|${input.schoolStudentId}|cover`)
    .digest()
  let out = ''
  for (let i = 0; i < TOKEN_LENGTH; i++)
    out += UNAMBIGUOUS_ALPHABET[mac[i] % UNAMBIGUOUS_ALPHABET.length]
  return out
}

export const coverQrContent = (token: string) => `${COVER_QR_PREFIX}${token}`

/** The token inside scanned QR text, or null when it is not one of our covers. */
export function parseCoverQr(text: string | null): string | null {
  const t = (text ?? '').trim()
  if (!t.startsWith(COVER_QR_PREFIX)) return null
  const token = t.slice(COVER_QR_PREFIX.length)
  return token.length === TOKEN_LENGTH &&
    [...token].every((c) => UNAMBIGUOUS_ALPHABET.includes(c))
    ? token
    : null
}

export interface CoverStudent {
  name: string
  admissionNo: string
  rollNo: string
  sectionName: string
  token: string
}
export interface CoverInput {
  schoolName: string
  paperTitle: string
  subjectName: string
  grade: number
  totalMarks: number | null
  students: Array<CoverStudent>
}

const mm = (n: number) => `${Math.round(n * 100) / 100}mm`
const MARK = 5
const INSET = 7

async function qrSvg(token: string): Promise<string> {
  const svg = await QRCode.toString(coverQrContent(token), {
    type: 'svg',
    margin: 0,
    errorCorrectionLevel: 'M',
  })
  return svg.replace(
    '<svg ',
    '<svg width="100%" height="100%" preserveAspectRatio="xMidYMid meet" ',
  )
}

const CSS = `
@page { size: 210mm 297mm; margin: 0; }
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body { font-family: Arial, Helvetica, sans-serif; color: #111; }
.page { position: relative; width: 210mm; height: 297mm; overflow: hidden; page-break-after: always; break-after: page; background: #fff; }
.page:last-child { page-break-after: auto; break-after: auto; }
.corner { position: absolute; background: #000; width: ${mm(MARK)}; height: ${mm(MARK)}; }
.qr { position: absolute; }
.title { position: absolute; left: 16mm; top: 52mm; width: 178mm; }
.title h1 { font-size: 24pt; margin: 0 0 4mm; }
.title .school { font-size: 13pt; color: #333; }
table.who { border-collapse: collapse; width: 100%; margin-top: 8mm; font-size: 14pt; }
table.who td { border: 0.4mm solid #444; padding: 3.2mm 4mm; }
table.who td:first-child { background: #f1f1f1; width: 48mm; }
.mono { font-family: Menlo, 'DejaVu Sans Mono', Consolas, 'Courier New', monospace; font-weight: bold; }
.how { position: absolute; left: 16mm; top: 168mm; width: 178mm; font-size: 12pt; line-height: 1.55; }
.how h2 { font-size: 14pt; margin: 0 0 3mm; }
.how li { margin-bottom: 2mm; }
.foot { position: absolute; left: 16mm; right: 16mm; top: ${mm(PAGE.h - 12)}; font-size: 8pt; color: #666; }
`

function pageHtml(i: CoverInput, s: CoverStudent, svg: string): string {
  const corners = [
    [INSET, INSET],
    [PAGE.w - INSET - MARK, INSET],
    [INSET, PAGE.h - INSET - MARK],
    [PAGE.w - INSET - MARK, PAGE.h - INSET - MARK],
  ]
    .map(
      ([x, y]) =>
        `<div class="corner" style="left:${mm(x)};top:${mm(y)}"></div>`,
    )
    .join('')
  return `<section class="page">${corners}
<div class="qr" style="left:${mm(PAGE.w - 16 - QR_SIZE_MM)};top:${mm(8)};width:${mm(QR_SIZE_MM)};height:${mm(QR_SIZE_MM)}">${svg}</div>
<div class="title"><h1>${escapeHtml(i.paperTitle)}</h1><div class="school">${escapeHtml(i.schoolName)} · Class ${i.grade} · ${escapeHtml(i.subjectName)}${i.totalMarks !== null ? ` · ${i.totalMarks} marks` : ''}</div>
<table class="who"><tr><td>Name</td><td><b>${escapeHtml(s.name)}</b></td></tr><tr><td>Class and section</td><td>${i.grade} ${escapeHtml(s.sectionName)}</td></tr><tr><td>Roll no.</td><td class="mono">${escapeHtml(s.rollNo)}</td></tr><tr><td>Student ID</td><td class="mono">${escapeHtml(s.admissionNo)}</td></tr></table></div>
<div class="how"><h2>Staple this page on top of the answer sheets</h2><ol><li>Put this page first, then the student's answer sheets in order.</li><li>Do not write on the four black squares or on the code.</li><li>Scan or photograph the whole stack in order, this page first.</li></ol></div>
<div class="foot">${escapeHtml(s.name)} · Roll ${escapeHtml(s.rollNo)} · ${escapeHtml(i.paperTitle)}</div>
</section>`
}

export async function buildCoversHtml(input: CoverInput): Promise<string> {
  const pages: Array<string> = []
  for (const s of input.students)
    pages.push(pageHtml(input, s, await qrSvg(s.token)))
  return `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>${pages.join('')}</body></html>`
}
