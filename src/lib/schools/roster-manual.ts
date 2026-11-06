import Papa from 'papaparse'
import type { Db } from '../../db/connection'
import type { SchoolScope } from '../../db/school-scope'
import { SchoolError } from './common'
import { commitRosterImport, dryRunRosterImport } from './roster'

// Adding ONE student or teacher by hand (owner request 2026-11-06, no F-number yet), next to the Excel upload.
//
// It is not a second path: the fields are written as a one-row file and go through exactly the same check and
// commit as an upload (terms accepted, roll number free, phone and e-mail valid, section and subject set up, an
// e-mail that already belongs to a PrepPlan account refused). So the two ways can never disagree. Only the school
// admin may do it, as with the upload; there is still no public sign-up for school students or teachers.

export interface ManualPerson {
  kind: 'students' | 'teachers'
  academicYear?: string
  fields: Record<string, string | undefined>
}

const STUDENT_COLUMNS: Array<[string, string]> = [
  ['name', 'Name'],
  ['class', 'Class'],
  ['section', 'Section'],
  ['roll_no', 'Roll No'],
  ['admission_no', 'Admission No'],
  ['parent_name', 'Parent Name'],
  ['parent_phone', 'Parent Phone'],
  ['whatsapp_ok', 'Parent WhatsApp OK'],
  ['parent_language', 'Parent Language'],
]
const TEACHER_COLUMNS: Array<[string, string]> = [
  ['name', 'Name'],
  ['email', 'Email'],
  ['teaches', 'Teaches'],
  ['class_teacher_of', 'Class teacher of'],
]

/** The one-row CSV the upload check reads (the same column names as the Excel template). */
export function manualRosterCsv(input: ManualPerson): string {
  const cols = input.kind === 'students' ? STUDENT_COLUMNS : TEACHER_COLUMNS
  const clean = (v: string | undefined) => (v ?? '').replace(/[\r\n]+/g, ' ').trim()
  return Papa.unparse([cols.map(([, header]) => header), cols.map(([key]) => clean(input.fields[key]))])
}

export async function addPersonManually(
  db: Db,
  scope: SchoolScope,
  input: ManualPerson,
): Promise<{ added: number; updated: number }> {
  const csv = manualRosterCsv(input)
  const preview = await dryRunRosterImport(db, scope, {
    kind: input.kind,
    academicYear: input.academicYear,
    fileName: 'manual.csv',
    bytes: Buffer.from(csv, 'utf8'),
  })
  const row = preview.rows[0]
  if (!row || row.status === 'error') throw new SchoolError('invalid', row?.message ?? 'Please check the details and try again.')
  if (row.status === 'unchanged')
    throw new SchoolError('conflict', input.kind === 'students' ? 'This student is already on the roll.' : 'This teacher is already added.')
  const done = await commitRosterImport(db, scope, preview.batchId)
  return { added: Number(done.added ?? 0), updated: Number(done.updated ?? 0) }
}
