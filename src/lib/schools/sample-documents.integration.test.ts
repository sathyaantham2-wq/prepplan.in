import { it } from 'vitest'
import { renderSampleDocuments } from './sample-documents'

// Only runs when asked: S5_SAMPLES_DIR=<folder>. Writes sample PDFs and page images for review.
it.skipIf(!process.env.S5_SAMPLES_DIR)(
  'renders sample pages of the school exam documents',
  async () => {
    await renderSampleDocuments(process.env.S5_SAMPLES_DIR as string)
  },
  180_000,
)
