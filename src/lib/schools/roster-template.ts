import ExcelJS from 'exceljs'
import type { Db } from '../../db/connection'
import {
  schoolClassesRepository,
  schoolSectionsRepository,
} from '../../db/repositories'
import type { SchoolScope } from '../../db/school-scope'
import { assertAdmin } from './common'

// The sample Excel files the office downloads, fills and uploads again (owner request 2026-10-30): one
// sheet to fill, with the right column names and two example rows made from the school's own classes,
// sections and subjects, and a second sheet that says how to fill each column. The upload reads the
// same column names (roster-parse.ts), so a filled sample always goes back in.

const GREEN = 'FF047857'

function headerRow(ws: ExcelJS.Worksheet, names: Array<[string, number]>) {
  ws.columns = names.map(([header, width]) => ({ header, width }))
  const row = ws.getRow(1)
  row.font = { bold: true, color: { argb: 'FFFFFFFF' } }
  row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: GREEN } }
  row.height = 22
  ws.views = [{ state: 'frozen', ySplit: 1 }]
}

function howTo(wb: ExcelJS.Workbook, lines: Array<[string, string]>) {
  const ws = wb.addWorksheet('How to fill')
  ws.columns = [
    { header: 'Column', width: 22 },
    { header: 'What to write', width: 90 },
  ]
  ws.getRow(1).font = { bold: true }
  for (const [c, t] of lines)
    ws.addRow([c, t]).alignment = { wrapText: true, vertical: 'top' }
}

/** The sample file for 'students' or 'teachers', as .xlsx bytes. */
export async function buildRosterTemplate(
  db: Db,
  scope: SchoolScope,
  kind: 'students' | 'teachers',
): Promise<{ bytes: Buffer; fileName: string }> {
  assertAdmin(scope)
  const classes = (await schoolClassesRepository.list(db, scope)).sort(
    (a, b) => a.grade - b.grade,
  )
  const year = classes
    .map((c) => c.academic_year)
    .sort()
    .at(-1)
  const current = classes.filter((c) => c.academic_year === year)
  const sections = await schoolSectionsRepository.list(db, scope)
  const subjects = await db
    .selectFrom('school_subjects as ss')
    .innerJoin('subjects as s', 's.id', 'ss.subject_id')
    .select(['ss.class_id', 's.name'])
    .where('ss.school_id', '=', scope.schoolId)
    .execute()
  // two real class-sections whose class has a subject (two sections of one class if there are), so the
  // example, copied as it is, passes the check; made-up ones when nothing is set up yet
  const taught = current
    .filter((c) => subjects.some((x) => x.class_id === c.id))
    .map((c) => ({
      grade: c.grade,
      subject: subjects
        .find((x) => x.class_id === c.id)!
        .name.replace(/\s*\(.*\)$/, ''),
      sections: sections
        .filter((s) => s.class_id === c.id)
        .map((s) => s.name)
        .sort((a, b) => a.localeCompare(b)),
    }))
    .filter((c) => c.sections.length > 0)
    .sort((a, b) => b.sections.length - a.sections.length || a.grade - b.grade)
  const pairs = taught
    .flatMap((c) =>
      c.sections.map((section) => ({
        grade: c.grade,
        section,
        subject: c.subject,
      })),
    )
    .slice(0, 2)
  while (pairs.length < 2)
    pairs.push({
      grade: 7,
      section: pairs.length ? 'B' : 'A',
      subject: 'Maths',
    })

  const wb = new ExcelJS.Workbook()
  wb.creator = 'PrepPlan'
  if (kind === 'students') {
    const cols: Array<[string, number]> = [
      ['Name', 28],
      ['Class', 8],
      ['Section', 9],
      ['Roll No', 9],
      ['Admission No', 15],
      ['Parent Name', 24],
      ['Parent Phone', 15],
    ]
    // the first sheet is the one read on upload: headers only, so no example is ever added by mistake
    const fill = wb.addWorksheet('Students')
    headerRow(fill, cols)
    for (const c of [5, 7]) fill.getColumn(c).numFmt = '@'
    const ws = wb.addWorksheet('Example')
    headerRow(ws, cols)
    ws.addRow([
      'Asha Rao',
      pairs[0].grade,
      pairs[0].section,
      1,
      '2026/0101',
      'Lakshmi Rao',
      '9876543210',
    ])
    ws.addRow([
      'Ravi Kumar',
      pairs[0].grade,
      pairs[0].section,
      2,
      '',
      'Suresh Kumar',
      '',
    ])
    ws.getColumn(7).numFmt = '@'
    ws.getColumn(5).numFmt = '@'
    howTo(wb, [
      ['Name', "The student's full name, as it should print on reports."],
      ['Class', 'A number from 1 to 12, for example 7.'],
      [
        'Section',
        'The section, for example A. The class and section must already be added in Classes.',
      ],
      [
        'Roll No',
        'The roll number in that section. Each roll number once per section.',
      ],
      [
        'Admission No',
        "Optional. The school's own admission number; it becomes the student's sign-in ID. Leave it empty and PrepPlan makes one.",
      ],
      ['Parent Name', 'Optional.'],
      ['Parent Phone', 'Optional. A 10-digit mobile number.'],
      [
        '',
        'Paste your students on the first sheet, "Students", one per row (the "Example" sheet shows how), save as .xlsx and upload. Nothing is added until you press "Add" after the check.',
      ],
    ])
  } else {
    const cols: Array<[string, number]> = [
      ['Name', 26],
      ['Email', 30],
      ['Teaches', 40],
      ['Class teacher of', 16],
    ]
    headerRow(wb.addWorksheet('Teachers'), cols)
    const ws = wb.addWorksheet('Example')
    headerRow(ws, cols)
    const [a, b] = pairs
    ws.addRow([
      'Meena Iyer',
      'meena@yourschool.in',
      `${a.grade}${a.section} ${a.subject}; ${b.grade}${b.section} ${b.subject}`,
      `${a.grade}${a.section}`,
    ])
    ws.addRow(['Rahul Verma', 'rahul@yourschool.in', '', ''])
    howTo(wb, [
      ['Name', "The teacher's full name."],
      [
        'Email',
        'Her own e-mail. Her sign-in is sent there (or printed as a code).',
      ],
      [
        'Teaches',
        'Optional. Every class, section and subject she teaches, separated by ; — for example "7A Maths; 7B Maths; 8A Science". As many as she has. The classes, sections and subjects must already be set up in Classes.',
      ],
      [
        'Class teacher of',
        'Optional. The section she is class teacher of, for example 7A.',
      ],
      [
        '',
        'A teacher who is already added can be listed again, with only her new classes, to give her more.',
      ],
      [
        '',
        'If a class-subject already has another teacher, the check tells you it will move to this teacher before anything is saved.',
      ],
      [
        '',
        'Paste your teachers on the first sheet, "Teachers", one per row (the "Example" sheet shows how), save as .xlsx and upload.',
      ],
    ])
  }
  const bytes = Buffer.from(await wb.xlsx.writeBuffer())
  return { bytes, fileName: `prepplan-${kind}-sample.xlsx` }
}
