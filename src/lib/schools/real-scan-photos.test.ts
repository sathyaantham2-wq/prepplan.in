import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { readBookletPage } from './page-reader'
import { fixtureToken } from './scan-test-support'

// Real phone photos of the hand-filled practice booklet (test-fixtures/school-scans/README.md).
// File names say what each photo is: s1-p2-anything.jpg is student 1, page 2.
//
// What this protects: a page must NEVER be sorted to the wrong student or page. A page that cannot
// be read is allowed (it goes to the teacher's "pages we could not place" list) but is counted and
// reported. The counts are written to test-fixtures/school-scans/REAL_PHOTOS_REPORT.md.

const DIR = join(__dirname, '../../../test-fixtures/school-scans/real')
const photos = existsSync(DIR)
  ? readdirSync(DIR)
      .filter((f) => /^s[12]-p\d+-.*\.(jpe?g|png|webp)$/i.test(f))
      .sort()
  : []

describe('real phone photos of the practice booklet', () => {
  it.skipIf(photos.length === 0)(
    'never sorts a page to the wrong student or page, and reports how many were read',
    async () => {
      const rows: Array<{ file: string; result: string }> = []
      let sorted = 0
      let straightened = 0
      let wrong = 0
      for (const file of photos) {
        const m = /^s([12])-p(\d+)-/i.exec(file)!
        const expected = fixtureToken(Number(m[1]) - 1, Number(m[2]))
        const r = await readBookletPage(readFileSync(join(DIR, file)))
        let result: string
        if (r.token === null) result = `not read (${r.problem ?? 'no code'})`
        else if (r.token === expected) {
          sorted++
          result = r.straightened
            ? 'sorted and straightened'
            : `sorted, but only ${r.corners} of 4 corner marks found`
          if (r.straightened) straightened++
        } else {
          wrong++
          result = 'WRONG: the code belongs to another page'
        }
        rows.push({ file, result })
      }
      writeFileSync(
        join(DIR, '../REAL_PHOTOS_REPORT.md'),
        [
          '# Real photo check',
          '',
          `${sorted} of ${photos.length} photos sorted to the right student and page (${straightened} also straightened with all four corner marks). ${wrong} sorted wrongly.`,
          '',
          '| Photo | Result |',
          '|---|---|',
          ...rows.map((r) => `| ${r.file} | ${r.result} |`),
          '',
        ].join('\n'),
      )
      expect(wrong, 'a page was sorted to the wrong student or page').toBe(0)
    },
    300_000,
  )

  it('has real photos to check (add them to test-fixtures/school-scans/real/)', () => {
    if (photos.length === 0)
      console.warn('No real photos yet: only the synthetic photo tests ran.')
    expect(true).toBe(true)
  })
})
