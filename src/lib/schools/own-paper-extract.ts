import JSZip from 'jszip'
import { z } from 'zod'

// Reading a school's own question paper (step 3). Everything here is pure: bytes in, text and
// questions out. The AI steps live in own-paper-ai.ts; the database steps in own-paper-service.ts.
//
// Two ways in:
//  - a Word file that PrepPlan itself made (it carries a hidden bookmark ppq_<id> on every question)
//    and that a teacher then edited: read exactly, with no AI, and each question knows which printed
//    question it came from (so what the teacher changed can be shown);
//  - anything else (the school's own Word file, a PDF with text, photos): the text (or pictures) go to
//    the AI, whose answer is checked against a strict shape before a teacher sees it.

export const MAX_UPLOAD_BYTES = 3_300_000 // one request may carry about 4.5 MB once it is text; a paper is far smaller
export const MAX_PAGES = 12

const decode = (s: string) =>
  s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')

// ---------------------------------------------------------------- Word files

/** Word's equation XML back to plain text: stacked fractions become a/b, radicals √(x). */
export function ommlToText(xml: string): string {
  let s = xml
  for (let i = 0; i < 6; i++) {
    const before = s
    s = s.replace(
      /<m:f>(?:(?!<m:f>)[\s\S])*?<m:num>([\s\S]*?)<\/m:num>[\s\S]*?<m:den>([\s\S]*?)<\/m:den>[\s\S]*?<\/m:f>/g,
      (_m, n: string, d: string) => `${ommlToText(n)}/${ommlToText(d)}`,
    )
    s = s.replace(
      /<m:rad>(?:(?!<m:rad>)[\s\S])*?<m:e>([\s\S]*?)<\/m:e>[\s\S]*?<\/m:rad>/g,
      (_m, e: string) => {
        const inner = ommlToText(e)
        return /^[0-9a-zA-Z.]+$/.test(inner) ? `√${inner}` : `√(${inner})`
      },
    )
    if (s === before) break
  }
  return decode(
    s
      .replace(/<m:t[^>]*>([^<]*)<\/m:t>/g, '$1')
      .replace(/<[^>]+>/g, '')
      .trim(),
  )
}

export interface DocxParagraph {
  text: string
  /** The ppq_ bookmark on this paragraph, if any. */
  bookmark: string | null
}

/** The paragraphs of a .docx, with equations and raised or lowered text turned back into plain text. */
export async function docxParagraphs(
  buf: Buffer,
): Promise<Array<DocxParagraph>> {
  const zip = await JSZip.loadAsync(buf)
  const file = zip.file('word/document.xml')
  if (!file) throw new Error('This is not a Word file we can read.')
  const xml = await file.async('string')
  const out: Array<DocxParagraph> = []
  for (const para of xml.match(/<w:p[ >][\s\S]*?<\/w:p>/g) ?? []) {
    const bookmark =
      /<w:bookmarkStart [^>]*w:name="(ppq_[0-9a-f]{32})"/.exec(para)?.[1] ??
      null
    let text = ''
    for (const tok of para.match(
      /<m:oMath>[\s\S]*?<\/m:oMath>|<w:r(?: [^>]*)?>[\s\S]*?<\/w:r>/g,
    ) ?? []) {
      if (tok.startsWith('<m:oMath>')) {
        text += ommlToText(tok)
        continue
      }
      const sup = /<w:vertAlign w:val="superscript"\/>/.test(tok)
      const sub = /<w:vertAlign w:val="subscript"\/>/.test(tok)
      let run = ''
      for (const part of tok.match(
        /<w:t[^>]*>[^<]*<\/w:t>|<w:tab\/>|<w:br\/>/g,
      ) ?? []) {
        if (part === '<w:tab/>') run += '\t'
        else if (part === '<w:br/>') run += '\n'
        else run += decode(part.replace(/<[^>]+>/g, ''))
      }
      text +=
        sup && run
          ? `^${run.length > 1 && !/^-?\d+$/.test(run) ? `(${run})` : run}`
          : sub && run
            ? run
            : run
    }
    out.push({ text, bookmark })
  }
  return out
}

export interface ParsedQuestion {
  /** The number printed on the paper ("7", "7A"), if one was read. */
  number: string | null
  section: string
  text: string
  marks: number
  options: Array<{ label: string; text: string }>
  orGroup: string | null
  /** The hidden bookmark, for a PrepPlan paper that was edited. */
  ppqId: string | null
}

const SECTION = /^Section\s+[A-Z]\b/i
const MARKS_AT_END = /\t\[(\d+(?:\.\d+)?)\](?:\s*\((\d+(?:\+\d+)*)\))?\s*$/

/**
 * Reads a Word paper that PrepPlan made (and a teacher may have edited). Returns null when the file
 * carries no PrepPlan question marker: it is then a school's own paper and goes to the AI instead.
 */
export function parsePrepPlanParagraphs(
  paras: ReadonlyArray<DocxParagraph>,
): Array<ParsedQuestion> | null {
  if (!paras.some((p) => p.bookmark)) return null
  const out: Array<ParsedQuestion> = []
  let section = ''
  let pendingOr = false
  let groupSeq = 0
  let currentGroup: string | null = null
  for (const p of paras) {
    const t = p.text.replaceAll('\u00a0', ' ')
    if (p.bookmark) {
      const m = MARKS_AT_END.exec(t)
      const body = m ? t.slice(0, m.index) : t
      const numMatch = /^(\d+)\.\t/.exec(body)
      const text = body.replace(/^(\d+\.)?\t/, '').trim()
      if (pendingOr) pendingOr = false
      else currentGroup = null
      out.push({
        number: numMatch?.[1] ?? null,
        section,
        text,
        marks: m ? Number(m[1]) : 0,
        options: [],
        orGroup: null,
        ppqId: p.bookmark.slice(4),
      })
      // the second member of an OR pair has no number of its own and follows an "OR" line
      if (out.length >= 2 && currentGroup !== null)
        out[out.length - 1].orGroup = currentGroup
      continue
    }
    if (t.trim() === 'OR') {
      pendingOr = true
      groupSeq += 1
      currentGroup = `or${groupSeq}`
      const prev = out[out.length - 1]
      prev.orGroup = currentGroup
      continue
    }
    const opt = /^\(([A-Z])\)\t(.*)$/s.exec(t)
    if (opt && out.length > 0) {
      out[out.length - 1].options.push({ label: opt[1], text: opt[2].trim() })
      continue
    }
    if (SECTION.test(t.trim())) {
      section = t.replace(/\s*\[[\d.]+ marks?\]\s*$/, '').trim()
      continue
    }
  }
  // an OR pair shares one mark: the last member carries it
  const byGroup = new Map<string, Array<ParsedQuestion>>()
  for (const q of out)
    if (q.orGroup)
      byGroup.set(q.orGroup, [...(byGroup.get(q.orGroup) ?? []), q])
  for (const g of byGroup.values()) {
    const marks = g.find((q) => q.marks > 0)?.marks ?? 0
    for (const q of g) q.marks = marks
  }
  return out
}

/** The text of a school's own Word file, for the AI. */
export async function docxToText(buf: Buffer): Promise<string> {
  return (await docxParagraphs(buf))
    .map((p) => p.text.replace(/\t/g, '  '))
    .filter((l) => l.trim() !== '')
    .join('\n')
}

// ---------------------------------------------------------------- PDF files

/** The text of a PDF that has real text. A scanned PDF has none: the caller then asks for photos. */
export async function pdfToText(
  buf: Buffer,
): Promise<{ text: string; pages: number }> {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs')
  const task = pdfjs.getDocument({
    data: new Uint8Array(buf),
    useSystemFonts: true,
    disableFontFace: true,
  })
  const doc = await task.promise
  const pages: Array<string> = []
  try {
    for (let n = 1; n <= Math.min(doc.numPages, MAX_PAGES); n++) {
      const page = await doc.getPage(n)
      const content = await page.getTextContent()
      let line = ''
      let lastY: number | null = null
      const lines: Array<string> = []
      for (const item of content.items) {
        if (!('str' in item)) continue
        const y = item.transform[5]
        if (lastY !== null && Math.abs(y - lastY) > 2) {
          lines.push(line)
          line = ''
        }
        line += item.str
        lastY = y
      }
      lines.push(line)
      pages.push(
        lines
          .map((l) => l.replace(/\s+/g, ' ').trim())
          .filter(Boolean)
          .join('\n'),
      )
      page.cleanup()
    }
    return { text: pages.join('\n'), pages: doc.numPages }
  } finally {
    await task.destroy()
  }
}

// ---------------------------------------------------------------- splitting for the AI

/** Splits a paper's text into pieces the AI can read in one go, at a question boundary where possible. */
export function chunkText(text: string, max = 5500): Array<string> {
  const lines = text.split('\n')
  const chunks: Array<string> = []
  let cur = ''
  const starts = /^\s*(?:Q(?:uestion)?\.?\s*)?\d{1,3}\s*[.)]\s*\S/i
  for (const line of lines) {
    if (
      cur.length + line.length + 1 > max &&
      cur.length > 0 &&
      starts.test(line)
    ) {
      chunks.push(cur)
      cur = ''
    }
    // a very long line with no boundary is cut so a chunk never grows without bound
    if (cur.length + line.length + 1 > max * 1.5 && cur.length > 0) {
      chunks.push(cur)
      cur = ''
    }
    cur += (cur ? '\n' : '') + line
  }
  if (cur.trim()) chunks.push(cur)
  return chunks
}

// ---------------------------------------------------------------- what the AI must answer

export const QUESTION_TYPES = [
  'mcq',
  'assertion_reason',
  'match',
  'multi_statement',
  'fill_blank',
  'short_answer',
  'long_answer',
  'case_study',
  'diagram',
] as const

const marksNumber = z.coerce.number().min(0).max(100)
export const ExtractedQuestionSchema = z.object({
  number: z.union([z.string(), z.number()]).transform(String).optional(),
  section: z.string().max(200).optional().default(''),
  text: z.string().min(2).max(4000),
  marks: marksNumber,
  type: z.enum(QUESTION_TYPES).catch('short_answer'),
  options: z
    .array(
      z.object({ label: z.string().min(1).max(3), text: z.string().max(600) }),
    )
    .max(6)
    .optional()
    .default([]),
  or_with_previous: z.boolean().optional().default(false),
})
export type ExtractedQuestion = z.infer<typeof ExtractedQuestionSchema>

/** The AI's JSON for one piece of the paper: valid questions, and a count of the ones that were dropped. */
export function parseExtraction(raw: string): {
  questions: Array<ExtractedQuestion>
  dropped: number
} {
  const parsed: unknown = JSON.parse(raw)
  const list = Array.isArray(parsed)
    ? parsed
    : parsed &&
        typeof parsed === 'object' &&
        Array.isArray((parsed as { questions?: unknown }).questions)
      ? (parsed as { questions: Array<unknown> }).questions
      : null
  if (!list) throw new Error('The reader did not return a list of questions.')
  const questions: Array<ExtractedQuestion> = []
  let dropped = 0
  for (const item of list) {
    const r = ExtractedQuestionSchema.safeParse(item)
    if (r.success) questions.push(r.data)
    else dropped++
  }
  return { questions, dropped }
}

export const MappingSchema = z.array(
  z.object({
    q: z.coerce.number().int(),
    chapter: z.string().max(12).nullable(),
    confidence: z.coerce.number().min(0).max(1).catch(0),
  }),
)

export const KeySchema = z.array(
  z.object({
    q: z.coerce.number().int(),
    answer: z.string().min(1).max(3000),
    steps: z
      .array(
        z.object({
          description: z.string().min(1).max(400),
          marks: z.coerce.number().min(0).max(50),
        }),
      )
      .max(12)
      .optional()
      .default([]),
  }),
)
