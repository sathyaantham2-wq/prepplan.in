import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { countPdfPages } from '../pdf/page-count'
import { renderHtmlToPdf } from '../pdf/render'
import { fixtureBookletHtml, fixtureManifest } from './scan-test-support'

// Makes the printable practice booklet used to check the scan reader against REAL phone photos.
// Not part of the normal run:
//   S6_FIXTURE_DIR=test-fixtures/school-scans npx vitest run src/lib/schools/scan-fixture-booklet.test.ts
// The booklet is deterministic (fixed ids and secret, see scan-test-support.ts), so the same codes
// are printed every time and the photos can be checked on any machine.
describe.skipIf(!process.env.S6_FIXTURE_DIR)(
  'printable practice booklet',
  () => {
    it('writes fixture-booklet.pdf: two practice students, every page', async () => {
      const dir = process.env.S6_FIXTURE_DIR as string
      mkdirSync(dir, { recursive: true })
      const pdf = await renderHtmlToPdf(await fixtureBookletHtml(), {
        fullPage: true,
      })
      expect(countPdfPages(pdf)).toBe(fixtureManifest().pageCount * 2)
      writeFileSync(join(dir, 'fixture-booklet.pdf'), pdf)
    }, 120_000)
  },
)
