import { createHash } from 'node:crypto'
import type { Db } from '../../db/connection'
import {
  existingUserEmails,
  schoolClassesRepository,
  schoolImportBatchesRepository,
  schoolSectionsRepository,
  schoolStudentsRepository,
} from '../../db/repositories'
import type { SchoolScope } from '../../db/school-scope'
import { SchoolError, assertAdmin, auditSchool } from './common'
import { createSchoolStudent, createSchoolTeacher } from './people'
import {
  parseRosterFile,
  validateStudentRow,
  validateTeacherRow,
} from './roster-parse'
import type { StudentRow, TeacherRow } from './roster-parse'
import { requireSchoolTerms } from './terms'

// Roster upload (students and teachers) in two steps. A dry run validates every row against the
// school's own setup and stores the rows exactly as previewed; commit applies that stored batch in
// ONE transaction, so it is all-or-reportable: a batch with any row error cannot be committed
// (fix the file and upload again), and a conflict found at commit rolls everything back.
// Uploading the same file again adds nobody twice: a student already on the roll with the same
// name is "unchanged", and a roll number held by someone else is an error.

export interface RowReport {
  row: number // 1-based data row, as the spreadsheet shows it minus the header
  status: 'new' | 'unchanged' | 'error'
  message?: string
}

export interface DryRunResult {
  batchId: string
  kind: 'students' | 'teachers'
  counts: { new: number; unchanged: number; errors: number }
  rows: Array<RowReport>
  committable: boolean
}

export async function dryRunRosterImport(
  db: Db,
  scope: SchoolScope,
  input: {
    kind: 'students' | 'teachers'
    academicYear?: string
    fileName: string
    bytes: Buffer
  },
): Promise<DryRunResult> {
  assertAdmin(scope)
  await requireSchoolTerms(db, scope)
  let raw
  try {
    raw = await parseRosterFile(input.fileName, input.bytes)
  } catch (e) {
    throw new SchoolError(
      'invalid',
      e instanceof Error ? e.message : 'The file could not be read.',
    )
  }
  const reports: Array<RowReport> = []
  const payload: Array<StudentRow | TeacherRow> = []

  if (input.kind === 'students') {
    const year = (input.academicYear ?? '').trim()
    if (!year)
      throw new SchoolError(
        'invalid',
        'Academic year is required for a student upload.',
      )
    const classes = (await schoolClassesRepository.list(db, scope)).filter(
      (c) => c.academic_year === year,
    )
    const sections = await schoolSectionsRepository.list(db, scope)
    const index = await schoolStudentsRepository.rosterIndex(db, scope)
    const held = new Map(
      index.map((r) => [`${r.section_id}|${r.roll_no}`, r.name]),
    )
    const byAdmission = new Map(
      index.map((r) => [r.admission_no.toUpperCase(), r]),
    )
    const admissionInFile = new Set<string>()
    const inFile = new Set<string>()
    raw.forEach((r, i) => {
      const row = i + 1
      const v = validateStudentRow(r)
      if (!v.ok)
        return void reports.push({ row, status: 'error', message: v.error })
      const cls = classes.find((c) => c.grade === v.value.grade)
      const section =
        cls &&
        sections.find(
          (s) =>
            s.class_id === cls.id && s.name.toUpperCase() === v.value.section,
        )
      if (!cls)
        return void reports.push({
          row,
          status: 'error',
          message: `Class ${v.value.grade} is not set up for ${year}.`,
        })
      if (!section)
        return void reports.push({
          row,
          status: 'error',
          message: `Section ${v.value.section} is not set up in class ${v.value.grade}.`,
        })
      const adm = v.value.admissionNo
      if (adm) {
        if (admissionInFile.has(adm))
          return void reports.push({
            row,
            status: 'error',
            message: `Admission number ${adm} appears twice in the file.`,
          })
        admissionInFile.add(adm)
        const owner = byAdmission.get(adm)
        if (owner) {
          const same =
            owner.section_id === section.id &&
            owner.roll_no === v.value.rollNo &&
            owner.name.trim().toLowerCase() === v.value.name.toLowerCase()
          return void reports.push(
            same
              ? { row, status: 'unchanged' }
              : {
                  row,
                  status: 'error',
                  message: `Admission number ${adm} already belongs to another student.`,
                },
          )
        }
      }
      const key = `${section.id}|${v.value.rollNo}`
      if (inFile.has(key))
        return void reports.push({
          row,
          status: 'error',
          message: `Roll number ${v.value.rollNo} appears twice in class ${v.value.grade}-${v.value.section}.`,
        })
      inFile.add(key)
      const holder = held.get(key)
      if (holder !== undefined) {
        if (holder.trim().toLowerCase() === v.value.name.toLowerCase())
          return void reports.push({ row, status: 'unchanged' })
        return void reports.push({
          row,
          status: 'error',
          message: `Roll number ${v.value.rollNo} in class ${v.value.grade}-${v.value.section} already belongs to another student.`,
        })
      }
      reports.push({ row, status: 'new' })
      payload.push(v.value)
    })
  } else {
    const valid: Array<{ row: number; value: TeacherRow }> = []
    raw.forEach((r, i) => {
      const v = validateTeacherRow(r)
      if (!v.ok) reports.push({ row: i + 1, status: 'error', message: v.error })
      else valid.push({ row: i + 1, value: v.value })
    })
    const taken = await existingUserEmails(
      db,
      valid.map((v) => v.value.email),
    )
    const seen = new Set<string>()
    for (const { row, value } of valid) {
      if (seen.has(value.email))
        reports.push({
          row,
          status: 'error',
          message: `${value.email} appears twice in the file.`,
        })
      else if (taken.has(value.email))
        reports.push({
          row,
          status: 'error',
          message: `${value.email} already has a PrepPlan account; teachers with an existing account are not added in this version.`,
        })
      else {
        reports.push({ row, status: 'new' })
        payload.push(value)
      }
      seen.add(value.email)
    }
    reports.sort((a, b) => a.row - b.row)
  }

  const counts = {
    new: reports.filter((r) => r.status === 'new').length,
    unchanged: reports.filter((r) => r.status === 'unchanged').length,
    errors: reports.filter((r) => r.status === 'error').length,
  }
  const batch = await schoolImportBatchesRepository.insert(db, scope, {
    kind: input.kind,
    academic_year:
      input.kind === 'students' ? (input.academicYear ?? '').trim() : null,
    file_name: input.fileName.slice(0, 200),
    file_sha256: createHash('sha256').update(input.bytes).digest('hex'),
    status: 'dry_run',
    counts: JSON.stringify(counts),
    row_errors: JSON.stringify(reports.filter((r) => r.status === 'error')),
    payload: JSON.stringify(payload),
    created_by_user_id: scope.userId,
  })
  return {
    batchId: batch.id,
    kind: input.kind,
    counts,
    rows: reports,
    committable: counts.errors === 0 && counts.new > 0,
  }
}

export async function commitRosterImport(
  db: Db,
  scope: SchoolScope,
  batchId: string,
) {
  assertAdmin(scope)
  await requireSchoolTerms(db, scope)
  const batch = await schoolImportBatchesRepository.findById(db, scope, batchId)
  if (!batch) throw new SchoolError('not_found', 'Upload not found.')
  if (batch.status !== 'dry_run')
    throw new SchoolError(
      'conflict',
      'This upload was already applied or has failed; upload the file again.',
    )
  const errors = batch.row_errors as unknown as Array<unknown>
  if (errors.length > 0)
    throw new SchoolError(
      'invalid',
      'This upload has row errors. Fix the file and upload it again.',
    )
  const payload = batch.payload as unknown as Array<StudentRow & TeacherRow>
  if (payload.length === 0)
    throw new SchoolError('invalid', 'There is nobody new to add.')

  try {
    await db.transaction().execute(async (trx) => {
      if (batch.kind === 'students') {
        const classes = (await schoolClassesRepository.list(trx, scope)).filter(
          (c) => c.academic_year === batch.academic_year,
        )
        const sections = await schoolSectionsRepository.list(trx, scope)
        for (const row of payload) {
          const cls = classes.find((c) => c.grade === row.grade)
          const section =
            cls &&
            sections.find(
              (s) =>
                s.class_id === cls.id && s.name.toUpperCase() === row.section,
            )
          if (!section)
            throw new SchoolError(
              'conflict',
              `Class ${row.grade}-${row.section} is no longer set up.`,
            )
          await createSchoolStudent(trx, scope, {
            name: row.name,
            grade: row.grade,
            sectionId: section.id,
            sectionName: section.name,
            rollNo: row.rollNo,
            admissionNo: row.admissionNo,
            guardianPhone: row.guardianPhone,
            guardianName: row.guardianName,
          })
        }
      } else {
        for (const row of payload)
          await createSchoolTeacher(trx, scope, {
            name: row.name,
            email: row.email,
          })
      }
      await schoolImportBatchesRepository.update(trx, scope, batch.id, {
        status: 'committed',
        committed_at: new Date(),
      })
      await auditSchool(
        trx,
        scope,
        `school.${batch.kind}_imported`,
        'school_import_batches',
        batch.id,
        null,
        {
          added: payload.length,
          file_sha256: batch.file_sha256,
        },
      )
    })
  } catch (e) {
    await schoolImportBatchesRepository.update(db, scope, batch.id, {
      status: 'failed',
    })
    if (e instanceof SchoolError) throw e
    throw new SchoolError(
      'conflict',
      'Someone else changed the roster since the preview. Nothing was added; upload the file again.',
    )
  }
  return { added: payload.length }
}
