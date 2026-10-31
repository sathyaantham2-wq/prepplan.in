// Maths typed as plain text in a question (3/4, x^2, (a+b)/(c+d), (x+y)^2, √(x+1), ∛8, x², H₂) becomes real
// maths in three places that share THIS parser: the app screens (mathHtml), the PDF papers (mathHtml again,
// with MATH_CSS) and the Word export (paper-docx.ts reads the same segments). No library and no math font is
// needed: fractions, roots and powers are drawn with plain HTML and CSS, so they look right in any browser and
// in a PDF printed on a server with no maths fonts. Anything the parser is not sure of stays exactly as typed.
// Client-safe: no server imports.

export type MathSeg =
  | { kind: 'text'; text: string }
  | { kind: 'frac'; num: string; den: string }
  | { kind: 'sqrt'; inner: string; degree?: string }
  | { kind: 'sup'; text: string; base?: string }
  | { kind: 'sub'; text: string; base?: string }

const SUP: Record<string, string> = {
  '⁰': '0',
  '¹': '1',
  '²': '2',
  '³': '3',
  '⁴': '4',
  '⁵': '5',
  '⁶': '6',
  '⁷': '7',
  '⁸': '8',
  '⁹': '9',
  '⁺': '+',
  '⁻': '-',
  ⁿ: 'n',
}
const SUB: Record<string, string> = {
  '₀': '0',
  '₁': '1',
  '₂': '2',
  '₃': '3',
  '₄': '4',
  '₅': '5',
  '₆': '6',
  '₇': '7',
  '₈': '8',
  '₉': '9',
}

const isWordChar = (c: string | undefined) => c !== undefined && /[\w]/.test(c)

/** The index of the bracket that closes the one at `open` (nested brackets allowed), or -1. */
function closeOf(s: string, open: number, max = 80): number {
  const o = s[open]
  const c = o === '(' ? ')' : o === '{' ? '}' : ''
  if (!c) return -1
  let depth = 0
  for (let i = open; i < s.length && i - open <= max; i++) {
    if (s[i] === o) depth++
    else if (s[i] === c && --depth === 0) return i
  }
  return -1
}

/** The index of the bracket that opens the `)` at `close`, or -1. */
function openOf(s: string, close: number, max = 80): number {
  let depth = 0
  for (let i = close; i >= 0 && close - i <= max; i--) {
    if (s[i] === ')') depth++
    else if (s[i] === '(' && --depth === 0) return i
  }
  return -1
}

/** A bracket group looks like maths, not like a sentence ("(a+b)", "(2x-1)", never "(see Fig. 2)"). */
function mathy(inner: string): boolean {
  return inner.length > 0 && /^[\w\s+\-−*×÷/^.,²³√π()]+$/.test(inner) && !/[A-Za-z]{4,}/.test(inner)
}

const strip = (s: string) => (s.startsWith('(') && s.endsWith(')') && closeOf(s, 0) === s.length - 1 ? s.slice(1, -1) : s)

interface Hit {
  start: number
  end: number
  seg: MathSeg
  /** For a power or subscript: where its base begins (the text before it is cut there). */
  baseStart?: number
}

function fractionAt(s: string, k: number): Hit | null {
  if (s[k] !== '/' || s[k - 1] === '/' || s[k + 1] === '/') return null
  // left operand
  let ls = -1
  let left = ''
  let bracketed = false
  if (s[k - 1] === ')') {
    const o = openOf(s, k - 1)
    if (o >= 0 && !isWordChar(s[o - 1]) && mathy(s.slice(o + 1, k - 1))) {
      ls = o
      left = s.slice(o, k)
      bracketed = true
    }
  } else {
    const m = /(\d+(?:\.\d+)?|[A-Za-z])$/.exec(s.slice(0, k))
    if (m && !/[\w./]/.test(s[k - m[1].length - 1] ?? '')) {
      ls = k - m[1].length
      left = m[1]
    }
  }
  if (ls < 0) return null
  // right operand
  let re = -1
  let right = ''
  if (s[k + 1] === '(') {
    const c = closeOf(s, k + 1)
    if (c >= 0 && mathy(s.slice(k + 2, c)) && !isWordChar(s[c + 1]) && s[c + 1] !== '/') {
      re = c + 1
      right = s.slice(k + 1, c + 1)
      bracketed = true
    }
  } else {
    const m = /^(\d+(?:\.\d+)?|[A-Za-z])(?![\w/])/.exec(s.slice(k + 1))
    if (m) {
      re = k + 1 + m[1].length
      right = m[1]
    }
  }
  if (re < 0) return null
  // a fraction needs a digit on one side or a bracket group ("km/h" and "and/or" are words)
  if (!bracketed && !/\d/.test(left + right)) return null
  return { start: ls, end: re, seg: { kind: 'frac', num: strip(left), den: strip(right) } }
}

function sqrtAt(s: string, i: number): Hit | null {
  const c = s[i]
  if (c !== '√' && c !== '∛' && c !== '∜') return null
  const degree = c === '∛' ? '3' : c === '∜' ? '4' : undefined
  const next = s[i + 1]
  if (next === '(') {
    const close = closeOf(s, i + 1, 60)
    if (close < 0) return null
    return { start: i, end: close + 1, seg: { kind: 'sqrt', inner: s.slice(i + 2, close), degree } }
  }
  const m = /^(\d+(?:\.\d+)?|[A-Za-z])/.exec(s.slice(i + 1))
  if (!m) return null
  return { start: i, end: i + 1 + m[1].length, seg: { kind: 'sqrt', inner: m[1], degree } }
}

/** The base a power or subscript at `k` attaches to: a bracket group, a letter or a number just before it. */
function baseBefore(s: string, k: number): number {
  if (s[k - 1] === ')') {
    const o = openOf(s, k - 1)
    return o >= 0 && mathy(s.slice(o + 1, k - 1)) ? o : -1
  }
  const m = /(\d+(?:\.\d+)?|[A-Za-z])$/.exec(s.slice(0, k))
  return m ? k - m[1].length : -1
}

function caretAt(s: string, k: number): Hit | null {
  if (s[k] !== '^') return null
  let end = -1
  let text = ''
  const rest = s.slice(k + 1)
  const open = s[k + 1]
  if (open === '(' || open === '{') {
    const close = closeOf(s, k + 1, 24)
    if (close < 0) return null
    text = s.slice(k + 2, close)
    end = close + 1
  } else {
    const m = /^(-?\d+|[A-Za-z])/.exec(rest)
    if (!m) return null
    text = m[1]
    end = k + 1 + m[1].length
  }
  const bs = baseBefore(s, k)
  return { start: k, end, seg: { kind: 'sup', text }, baseStart: bs >= 0 && s[k - 1] === ')' ? bs : undefined }
}

function unicodeScript(s: string, k: number): Hit | null {
  const isSup = s[k] in SUP
  const isSub = s[k] in SUB
  if (!isSup && !isSub) return null
  let end = k
  while (end < s.length && (isSup ? s[end] in SUP : s[end] in SUB)) end++
  const map = isSup ? SUP : SUB
  const text = [...s.slice(k, end)].map((c) => map[c]).join('')
  const bs = baseBefore(s, k)
  return { start: k, end, seg: { kind: isSup ? 'sup' : 'sub', text }, baseStart: bs >= 0 && s[k - 1] === ')' ? bs : undefined }
}

/** A bracket group that is the top of a fraction ("(n²+1)/(n-1)"): found at its "(", before the maths inside is read. */
function bracketFractionAt(s: string, i: number): Hit | null {
  if (s[i] !== '(') return null
  const close = closeOf(s, i)
  if (close < 0 || s[close + 1] !== '/') return null
  const hit = fractionAt(s, close + 1)
  return hit && hit.start === i ? hit : null
}

/** Splits a question's text into plain text and the pieces that become real maths. */
export function parseMathText(input: string): Array<MathSeg> {
  const out: Array<MathSeg> = []
  let last = 0
  const push = (t: string) => {
    if (t) out.push({ kind: 'text', text: t })
  }
  let i = 0
  while (i < input.length) {
    const hit =
      bracketFractionAt(input, i) ??
      sqrtAt(input, i) ??
      caretAt(input, i) ??
      unicodeScript(input, i) ??
      (input[i] === '/' ? fractionAt(input, i) : null)
    if (!hit) {
      i++
      continue
    }
    // a fraction begins before the "/" we stopped at; powers of a bracket group begin before the "^"
    const cut = hit.seg.kind === 'frac' ? hit.start : (hit.baseStart ?? hit.start)
    if (cut < last) {
      i++
      continue
    }
    push(input.slice(last, cut))
    if ((hit.seg.kind === 'sup' || hit.seg.kind === 'sub') && hit.baseStart !== undefined)
      hit.seg.base = input.slice(hit.baseStart, hit.start)
    out.push(hit.seg)
    last = hit.end
    i = hit.end
  }
  push(input.slice(last))
  return out
}

// ---------------------------------------------------------------- HTML (app screens and PDF)

const ESC: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ESC[c])

/**
 * The text as safe HTML with real fractions, roots and powers (plain spans, no MathML, no font needed).
 * Everything is escaped; the only markup is what this function writes.
 */
export function mathHtml(input: string, depth = 0): string {
  return parseMathText(input)
    .map((s) => {
      switch (s.kind) {
        case 'text':
          return esc(s.text)
        case 'frac':
          return depth > 2
            ? `${esc(s.num)}/${esc(s.den)}`
            : `<span class="m-frac"><span class="m-n">${mathHtml(s.num, depth + 1)}</span><span class="m-d">${mathHtml(s.den, depth + 1)}</span></span>`
        case 'sqrt':
          return `<span class="m-sqrt">${s.degree ? `<sup class="m-deg">${esc(s.degree)}</sup>` : ''}<span class="m-rad">√</span><span class="m-in">${mathHtml(s.inner, depth + 1)}</span></span>`
        case 'sup':
          return `${s.base !== undefined ? esc(s.base) : ''}<sup class="m-sup">${esc(s.text)}</sup>`
        case 'sub':
          return `${s.base !== undefined ? esc(s.base) : ''}<sub class="m-sub">${esc(s.text)}</sub>`
      }
    })
    .join('')
}

/** The CSS the HTML above needs. In the app it lives in styles.css; a PDF template puts this in its own <style>. */
export const MATH_CSS = `
.m-frac{display:inline-flex;flex-direction:column;vertical-align:middle;text-align:center;line-height:1.15;margin:0 .12em;font-size:.92em}
.m-frac>.m-n{border-bottom:1px solid currentColor;padding:0 .2em .05em}
.m-frac>.m-d{padding:.05em .2em 0}
.m-sqrt{white-space:nowrap}
.m-sqrt>.m-rad{font-size:1.05em}
.m-sqrt>.m-in{border-top:1px solid currentColor;padding:0 .1em;margin-left:-.05em}
.m-deg{font-size:.65em;vertical-align:super;margin-right:-.15em}
.m-sup,.m-sub{font-size:.75em;line-height:0}
`
