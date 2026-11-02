import { describe, expect, it } from 'vitest'
import { estimateCostInr } from './ai-metering'

describe('estimateCostInr with prompt caching', () => {
  it('prices cache reads at a tenth and writes at a quarter more than normal input', () => {
    const plain = estimateCostInr({ inputTokens: 100_000, outputTokens: 0 })
    expect(estimateCostInr({ inputTokens: 0, outputTokens: 0, cacheReadTokens: 100_000 })).toBeCloseTo(plain * 0.1, 6)
    expect(estimateCostInr({ inputTokens: 0, outputTokens: 0, cacheWriteTokens: 100_000 })).toBeCloseTo(plain * 1.25, 6)
  })
})
