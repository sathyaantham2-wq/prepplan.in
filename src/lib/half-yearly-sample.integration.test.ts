import { writeFileSync } from 'node:fs'
import { describe, it } from 'vitest'
import { generateHalfYearlySample } from './half-yearly-sample'

// Not a real test: a way to run generateHalfYearlySample under Vitest (see that file). Skipped
// unless HY_SAMPLE is set, so the normal suite never writes PDFs or leaves fixture households.
describe.skipIf(!process.env.HY_SAMPLE)('School Half-Yearly sample paper', () => {
  it('generates and renders the sample', async () => {
    const opts = JSON.parse(process.env.HY_SAMPLE as string)
    const summary = await generateHalfYearlySample(opts)
    writeFileSync(`${opts.out}.summary.json`, JSON.stringify(summary, null, 2))
  }, 120_000)
})
