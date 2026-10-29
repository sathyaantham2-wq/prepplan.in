import ExcelJS from 'exceljs'
import { describe, expect, it } from 'vitest'
import {
  normalizePhone,
  parseRosterFile,
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

describe('validateTeacherRow', () => {
  it('lower-cases the email', () => {
    expect(validateTeacherRow({ name: 'T', email: ' T@School.IN ' })).toEqual({
      ok: true,
      value: { name: 'T', email: 't@school.in' },
    })
  })
  it('rejects a bad email', () => {
    expect(validateTeacherRow({ name: 'T', email: 'nope' }).ok).toBe(false)
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
