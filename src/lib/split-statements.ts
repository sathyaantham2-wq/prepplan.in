// Display-only: splits a "Consider the following statements ... 1. ... 2. ... How many are
// correct?" question into an intro, its statements and the closing question, so the statements
// can each sit on their own line. The stored text is never changed. If the text does not look
// like a numbered / Statement-I-II list, it comes back untouched as `intro`.

export type SplitQuestion = {
  intro: string
  statements: Array<{ label: string; text: string }>
  tail: string
}

const TAIL_RE =
  /\s+((?:How many|Which one of the|Which of the|Select the|Choose the|Which among|What is the number)[\s\S]*)$/i

function numbered(text: string): SplitQuestion | null {
  const starts: Array<{ n: number; at: number; end: number }> = []
  let from = 0
  for (let n = 1; n <= 9; n++) {
    const re = new RegExp(`(?:^|[\\s:;])(${n})\\.\\s+(?=\\S)`, 'g')
    re.lastIndex = from
    const m = re.exec(text)
    if (!m) break
    starts.push({ n, at: m.index, end: m.index + m[0].length })
    from = m.index + m[0].length
  }
  if (starts.length < 2) return null
  const intro = text.slice(0, starts[0].at).trim()
  const statements = starts.map((s, i) => ({
    label: `${s.n}.`,
    text: text.slice(s.end, i + 1 < starts.length ? starts[i + 1].at : undefined).trim(),
  }))
  let tail = ''
  const last = statements[statements.length - 1]
  const t = TAIL_RE.exec(last.text)
  if (t) {
    tail = t[1].trim()
    last.text = last.text.slice(0, t.index).trim()
  }
  return { intro, statements, tail }
}

function romanStatements(text: string): SplitQuestion | null {
  const re = /Statement[\s-]?(I{1,3}|IV|V)\s*[:.-]\s*/g
  const hits: Array<{ label: string; at: number; end: number }> = []
  let m: RegExpExecArray | null
  while ((m = re.exec(text))) {
    hits.push({ label: `Statement ${m[1]}`, at: m.index, end: m.index + m[0].length })
  }
  if (hits.length < 2) return null
  const statements = hits.map((h, i) => ({
    label: h.label,
    text: text.slice(h.end, i + 1 < hits.length ? hits[i + 1].at : undefined).trim(),
  }))
  let tail = ''
  const last = statements[statements.length - 1]
  const t = TAIL_RE.exec(last.text)
  if (t) {
    tail = t[1].trim()
    last.text = last.text.slice(0, t.index).trim()
  }
  return { intro: text.slice(0, hits[0].at).trim(), statements, tail }
}

export function splitStatements(text: string): SplitQuestion {
  return numbered(text) ?? romanStatements(text) ?? { intro: text, statements: [], tail: '' }
}
