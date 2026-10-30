import ExcelJS from 'exceljs'
import { describe, expect, it } from 'vitest'
import {
  matchSubject,
  normalizePhone,
  parseClassTeacherOf,
  parseRosterFile,
  parseTeaches,
  validateStudentRow,
  validateTeacherRow,
} from './roster-parse'

describe('normalizePhone', () => {
  it.each([
    ['98765 43210', '+919876543210'],
    ['098765-43210', '+919876543210'],
    ['+91 98765 43210', '+919876543210'],
    ['919876543210', '+919876543210'],
    ['+44 7700 900123', '+447700900123'],
  ])('%s -> %s', (input, expected) => {
    expect(normalizePhone(input)).toBe(expected)
  })
  it.each(['', '12345', 'abc', '5876543210', '+0123456789'])(
    'rejects %j',
    (input) => {
      expect(normalizePhone(input)).toBeNull()
    },
  )
})

describe('validateStudentRow', () => {
  const good = {
    name: 'Asha K',
    class: '7',
    section: 'a',
    rollno: '12',
    parentphone: '9876543210',
  }
  it('accepts a complete row and normalises it', () => {
    const r = validateStudentRow(good)
    expect(r).toEqual({
      ok: true,
      value: {
        name: 'Asha K',
        grade: 7,
        section: 'A',
        rollNo: '12',
        admissionNo: null,
        guardianPhone: '+919876543210',
        guardianName: null,
      },
    })
  })
  it('accepts "7th" and a missing phone', () => {
    const r = validateStudentRow({ ...good, class: '7th', parentphone: '' })
    expect(r.ok && r.value.grade).toBe(7)
    expect(r.ok && r.value.guardianPhone).toBeNull()
  })
  it.each([
    [{ ...good, name: '' }, /Name/],
    [{ ...good, class: '13' }, /Class/],
    [{ ...good, class: 'seven' }, /Class/],
    [{ ...good, section: '' }, /Section/],
    [{ ...good, rollno: '' }, /Roll/],
    [{ ...good, parentphone: '123' }, /Parent phone/],
  ])('rejects %j', (row, message) => {
    const r = validateStudentRow(row)
    expect(!r.ok && r.error).toMatch(message)
  })
})

describe('admission number', () => {
  const base = { name: 'Asha K', class: '7', section: 'a', rollno: '12' }
  it('is optional, upper-cased and stripped of spaces', () => {
    expect(validateStudentRow(base)).toMatchObject({
      ok: true,
      value: { admissionNo: null },
    })
    const r = validateStudentRow({ ...base, admissionno: ' 2024/ab-01 ' })
    expect(r.ok && r.value.admissionNo).toBe('2024/AB-01')
  })
  it('refuses odd characters and long values', () => {
    for (const bad of ["a'b", 'x'.repeat(31), '/leading', 'a b$']) {
      expect(validateStudentRow({ ...base, admissionno: bad }).ok, bad).toBe(
        false,
      )
    }
  })
  it('is read from common column names', async () => {
    const rows = await parseRosterFile(
      'r.csv',
      Buffer.from('Name,Class,Section,Roll No,Admission No\nAsha,7,A,1,AD-1\n'),
    )
    expect(rows[0].admissionno).toBe('AD-1')
  })
})

describe('validateTeacherRow', () => {
  it('lower-cases the email', () => {
    expect(validateTeacherRow({ name: 'T', email: ' T@School.IN ' })).toEqual({
      ok: true,
      value: {
        name: 'T',
        email: 't@school.in',
        teaches: [],
        classTeacherOf: [],
      },
    })
  })
  it('rejects a bad email', () => {
    expect(validateTeacherRow({ name: 'T', email: 'nope' }).ok).toBe(false)
  })
  it('reads every class a teacher teaches, however it is written', () => {
    const r = validateTeacherRow({
      name: 'T',
      email: 't@s.in',
      teaches: '7A Maths; 7-b maths, class 8 C Science\n10A SST',
      classteacher: '7a',
    })
    expect(r).toEqual({
      ok: true,
      value: {
        name: 'T',
        email: 't@s.in',
        teaches: [
          { grade: 7, section: 'A', subject: 'Maths' },
          { grade: 7, section: 'B', subject: 'maths' },
          { grade: 8, section: 'C', subject: 'Science' },
          { grade: 10, section: 'A', subject: 'SST' },
        ],
        classTeacherOf: [{ grade: 7, section: 'A' }],
      },
    })
    expect(parseTeaches('Maths 7A').ok).toBe(false)
    expect(parseTeaches('13A Maths').ok).toBe(false)
    expect(parseClassTeacherOf('seven').ok).toBe(false)
  })
})

describe('matchSubject', () => {
  const subjects = [
    { name: 'Mathematics' },
    { name: 'Science' },
    { name: 'Social Science (Geography)' },
    { name: 'Hindi 2' },
    { name: 'Hindi 3' },
  ]
  it('knows the short names schools use, and never guesses between two', () => {
    expect(matchSubject('Maths', subjects)?.name).toBe('Mathematics')
    expect(matchSubject('maths', subjects)?.name).toBe('Mathematics')
    expect(matchSubject('SST', subjects)?.name).toBe(
      'Social Science (Geography)',
    )
    expect(matchSubject('Science', subjects)?.name).toBe('Science')
    expect(matchSubject('Hindi 3', subjects)?.name).toBe('Hindi 3')
    expect(matchSubject('Hindi', subjects)).toBeNull() // two Hindis: ask, never guess
    expect(matchSubject('Physics', subjects)).toBeNull()
  })
})

describe('parseRosterFile', () => {
  it('reads a CSV with aliased headers and skips blank lines', async () => {
    const csv =
      'Student Name,Grade,Sec,Roll No,Parent Mobile\nAsha,7,A,1,9876543210\n\nRavi,7,A,2,\n'
    const rows = await parseRosterFile('r.csv', Buffer.from(csv))
    expect(rows).toEqual([
      {
        name: 'Asha',
        class: '7',
        section: 'A',
        rollno: '1',
        parentphone: '9876543210',
      },
      { name: 'Ravi', class: '7', section: 'A', rollno: '2', parentphone: '' },
    ])
  })
  it('reads an XLSX, including numeric cells', async () => {
    const wb = new ExcelJS.Workbook()
    const ws = wb.addWorksheet('Students')
    ws.addRow(['Name', 'Class', 'Section', 'Roll No', 'Parent Phone'])
    ws.addRow(['Asha', 7, 'A', 1, 9876543210])
    const bytes = Buffer.from(await wb.xlsx.writeBuffer())
    const rows = await parseRosterFile('r.xlsx', bytes)
    expect(rows).toEqual([
      {
        name: 'Asha',
        class: '7',
        section: 'A',
        rollno: '1',
        parentphone: '9876543210',
      },
    ])
  })
  it('refuses unusable files with a plain message', async () => {
    await expect(parseRosterFile('r.csv', Buffer.alloc(0))).rejects.toThrow(
      'empty',
    )
    await expect(parseRosterFile('r.pdf', Buffer.from('x'))).rejects.toThrow(
      '.xlsx or .csv',
    )
    await expect(
      parseRosterFile('r.xlsx', Buffer.from('not a workbook')),
    ).rejects.toThrow('Excel')
    await expect(
      parseRosterFile('r.csv', Buffer.from('Name,Class\n')),
    ).rejects.toThrow('no data rows')
  })
})
