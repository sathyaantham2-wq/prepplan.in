import ExcelJS from 'exceljs'
import Papa from 'papaparse'

// Pure parsing and row validation for the roster upload (no database), so it can be tested
// exhaustively. roster.ts does the database checks and the commit.

export const MAX_ROSTER_BYTES = 5 * 1024 * 1024
export const MAX_ROSTER_ROWS = 2000

export type RawRow = Record<string, string | undefined>

export interface StudentRow {
  name: string
  grade: number
  section: string
  rollNo: string
  /** The school's own admission number, upper-cased; null when the row has none (one is generated). */
  admissionNo: string | null
  guardianPhone: string | null
  guardianName: string | null
}
/** One "7A Maths" from a teacher's Teaches cell: class, section and the subject as the school wrote it. */
export interface TeachItem {
  grade: number
  section: string
  subject: string
}
export interface TeacherRow {
  name: string
  email: string
  /** What she teaches (optional column "Teaches"), e.g. "7A Maths; 7B Maths; 8A Science". */
  teaches: Array<TeachItem>
  /** Sections she is the class teacher of (optional column "Class teacher of"), e.g. "7A". */
  classTeacherOf: Array<{ grade: number; section: string }>
}
export type RowResult<T> = { ok: true; value: T } | { ok: false; error: string }

const norm = (h: string) => h.toLowerCase().replace(/[^a-z0-9]/g, '')

const ALIASES: Record<string, string> = {
  name: 'name',
  studentname: 'name',
  teachername: 'name',
  fullname: 'name',
  class: 'class',
  grade: 'class',
  std: 'class',
  standard: 'class',
  section: 'section',
  sec: 'section',
  rollno: 'rollno',
  rollnumber: 'rollno',
  roll: 'rollno',
  admissionno: 'admissionno',
  admissionnumber: 'admissionno',
  admission: 'admissionno',
  admno: 'admissionno',
  adno: 'admissionno',
  parentphone: 'parentphone',
  guardianphone: 'parentphone',
  parentmobile: 'parentphone',
  phone: 'parentphone',
  mobile: 'parentphone',
  parentname: 'parentname',
  guardianname: 'parentname',
  email: 'email',
  emailid: 'email',
  emailaddress: 'email',
  teaches: 'teaches',
  classesandsubjects: 'teaches',
  classesubjects: 'teaches',
  subjects: 'teaches',
  teachesclasses: 'teaches',
  classteacher: 'classteacher',
  classteacherof: 'classteacher',
}

function cellText(v: ExcelJS.CellValue): string {
  if (v === null || v === undefined) return ''
  if (typeof v === 'object') {
    if (v instanceof Date) return v.toISOString().slice(0, 10)
    if ('richText' in v) return v.richText.map((r) => r.text).join('')
    if ('text' in v) return String(v.text)
    if ('result' in v) return v.result === undefined ? '' : String(v.result)
    return ''
  }
  return String(v).trim()
}

function toRows(
  headers: Array<string>,
  body: Array<Array<string>>,
): Array<RawRow> {
  const keys = headers.map((h) => ALIASES[norm(h)] ?? '')
  return body
    .filter((cells) => cells.some((c) => c.trim() !== ''))
    .map((cells) => {
      const row: RawRow = {}
      keys.forEach((k, i) => {
        if (k) row[k] = (cells[i] ?? '').trim()
      })
      return row
    })
}

function stripBom(text: string): string {
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text
}

/** CSV or XLSX bytes to header-normalised rows. Throws a plain-English Error for an unusable file. */
export async function parseRosterFile(
  fileName: string,
  bytes: Buffer,
): Promise<Array<RawRow>> {
  if (bytes.length === 0) throw new Error('The file is empty.')
  if (bytes.length > MAX_ROSTER_BYTES)
    throw new Error('The file is larger than 5 MB.')
  const lower = fileName.toLowerCase()
  let headers: Array<string>
  let body: Array<Array<string>>
  if (lower.endsWith('.csv')) {
    const parsed = Papa.parse<Array<string>>(stripBom(bytes.toString('utf8')), {
      skipEmptyLines: true,
    })
    if (parsed.data.length < 2) throw new Error('The file has no data rows.')
    headers = parsed.data[0]
    body = parsed.data.slice(1)
  } else if (lower.endsWith('.xlsx')) {
    const wb = new ExcelJS.Workbook()
    try {
      await wb.xlsx.load(bytes as unknown as ArrayBuffer)
    } catch {
      throw new Error(
        'That file could not be read as an Excel (.xlsx) workbook.',
      )
    }
    const sheet = wb.worksheets[0]
    if (sheet.rowCount < 2) throw new Error('The first sheet has no data rows.')
    const all: Array<Array<string>> = []
    sheet.eachRow({ includeEmpty: false }, (row) => {
      const cells: Array<string> = []
      for (let c = 1; c <= sheet.columnCount; c++)
        cells.push(cellText(row.getCell(c).value))
      all.push(cells)
    })
    headers = all[0]
    body = all.slice(1)
  } else {
    throw new Error('Upload an .xlsx or .csv file.')
  }
  const rows = toRows(headers, body)
  if (rows.length === 0) throw new Error('The file has no data rows.')
  if (rows.length > MAX_ROSTER_ROWS)
    throw new Error(`The file has more than ${MAX_ROSTER_ROWS} rows; split it.`)
  return rows
}

/** E.164 for an Indian-style number, or null when it cannot be one. 10-digit mobiles get +91. */
export function normalizePhone(input: string): string | null {
  const raw = input.trim()
  if (!raw) return null
  const digits = raw.replace(/[^\d]/g, '')
  if (raw.startsWith('+'))
    return /^[1-9]\d{7,14}$/.test(digits) ? `+${digits}` : null
  if (/^[6-9]\d{9}$/.test(digits)) return `+91${digits}`
  if (/^0[6-9]\d{9}$/.test(digits)) return `+91${digits.slice(1)}`
  if (/^91[6-9]\d{9}$/.test(digits)) return `+${digits}`
  return null
}

/** Letters, numbers and / . _ - ; 30 characters at most. Matches the database check. */
export const ADMISSION_NO = /^[A-Za-z0-9][A-Za-z0-9/._-]{0,29}$/

export function validateStudentRow(row: RawRow): RowResult<StudentRow> {
  const name = (row.name ?? '').trim()
  if (!name) return { ok: false, error: 'Name is missing.' }
  if (name.length > 120)
    return { ok: false, error: 'Name is longer than 120 characters.' }
  const gradeText = (row.class ?? '').replace(/(st|nd|rd|th)$/i, '').trim()
  const grade = Number(gradeText)
  if (!Number.isInteger(grade) || grade < 1 || grade > 12) {
    return {
      ok: false,
      error: `Class "${row.class ?? ''}" is not a number from 1 to 12.`,
    }
  }
  const section = (row.section ?? '').trim().toUpperCase()
  if (!section || section.length > 10)
    return {
      ok: false,
      error: 'Section is missing or longer than 10 characters.',
    }
  const rollNo = (row.rollno ?? '').trim()
  if (!rollNo || rollNo.length > 20)
    return {
      ok: false,
      error: 'Roll number is missing or longer than 20 characters.',
    }
  const admissionRaw = (row.admissionno ?? '').trim().replace(/\s+/g, '')
  if (admissionRaw && !ADMISSION_NO.test(admissionRaw)) {
    return {
      ok: false,
      error: `Admission number "${admissionRaw}" can only use letters, numbers and / . _ - (up to 30 characters).`,
    }
  }
  let guardianPhone: string | null = null
  if ((row.parentphone ?? '').trim()) {
    guardianPhone = normalizePhone(row.parentphone ?? '')
    if (!guardianPhone)
      return {
        ok: false,
        error: `Parent phone "${row.parentphone}" is not a valid number.`,
      }
  }
  return {
    ok: true,
    value: {
      name,
      grade,
      section,
      rollNo,
      admissionNo: admissionRaw ? admissionRaw.toUpperCase() : null,
      guardianPhone,
      guardianName: (row.parentname ?? '').trim() || null,
    },
  }
}

const CLASS_SECTION = /^(?:class\s*)?(\d{1,2})\s*[-\s]?\s*([a-z]{1,3})$/i
const CLASS_SECTION_SUBJECT =
  /^(?:class\s*)?(\d{1,2})\s*[-\s]?\s*([a-z]{1,3})\s+(.+)$/i

/** "7A Maths; 7B Maths, 8-A Science" -> items. Separated by ; , or new lines. */
export function parseTeaches(text: string): RowResult<Array<TeachItem>> {
  const out: Array<TeachItem> = []
  for (const part of text.split(/[;,\n]+/)) {
    const p = part.trim().replace(/\s+/g, ' ')
    if (!p) continue
    const m = CLASS_SECTION_SUBJECT.exec(p)
    const grade = m ? Number(m[1]) : NaN
    if (!m || grade < 1 || grade > 12)
      return {
        ok: false,
        error: `"${p}" in Teaches: write the class, section and subject, like 7A Maths.`,
      }
    out.push({ grade, section: m[2].toUpperCase(), subject: m[3].trim() })
  }
  return { ok: true, value: out }
}

export function parseClassTeacherOf(
  text: string,
): RowResult<Array<{ grade: number; section: string }>> {
  const out: Array<{ grade: number; section: string }> = []
  for (const part of text.split(/[;,\n]+/)) {
    const p = part.trim().replace(/\s+/g, ' ')
    if (!p) continue
    const m = CLASS_SECTION.exec(p)
    const grade = m ? Number(m[1]) : NaN
    if (!m || grade < 1 || grade > 12)
      return {
        ok: false,
        error: `"${p}" in Class teacher of: write the class and section, like 7A.`,
      }
    out.push({ grade, section: m[2].toUpperCase() })
  }
  return { ok: true, value: out }
}

export function validateTeacherRow(row: RawRow): RowResult<TeacherRow> {
  const name = (row.name ?? '').trim()
  if (!name) return { ok: false, error: 'Name is missing.' }
  const email = (row.email ?? '').trim().toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { ok: false, error: `Email "${row.email ?? ''}" is not valid.` }
  const teaches = parseTeaches(row.teaches ?? '')
  if (!teaches.ok) return teaches
  const classTeacherOf = parseClassTeacherOf(row.classteacher ?? '')
  if (!classTeacherOf.ok) return classTeacherOf
  return {
    ok: true,
    value: {
      name,
      email,
      teaches: teaches.value,
      classTeacherOf: classTeacherOf.value,
    },
  }
}

const SUBJECT_ALIASES: Record<string, string> = {
  maths: 'mathematics',
  math: 'mathematics',
  mat: 'mathematics',
  sci: 'science',
  sst: 'socialscience',
  social: 'socialscience',
  socialstudies: 'socialscience',
  eng: 'english',
}

/** The school subject a teacher's file means by "Maths", "Science", "SST"...; null if none or several. */
export function matchSubject<T extends { name: string }>(
  written: string,
  subjects: ReadonlyArray<T>,
): T | null {
  const key = (t: string) => t.toLowerCase().replace(/[^a-z0-9]/g, '')
  const w = SUBJECT_ALIASES[key(written)] ?? key(written)
  if (!w) return null
  const exact = subjects.filter(
    (s) => (SUBJECT_ALIASES[key(s.name)] ?? key(s.name)) === w,
  )
  if (exact.length === 1) return exact[0]
  const loose = subjects.filter((s) => {
    const n = key(s.name)
    return n.startsWith(w) || w.startsWith(n)
  })
  return loose.length === 1 ? loose[0] : null
}
