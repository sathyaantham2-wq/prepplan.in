import { describe, expect, it } from 'vitest'
import { splitStatements } from './split-statements'

describe('splitStatements', () => {
  it('splits numbered statements and the closing question', () => {
    const r = splitStatements(
      "Consider the following statements about Article 160: 1. Article 160 lets the President provide for X. 2. Article 160 can be invoked only on death. 3. A person is exempt. 4. The Vice-Governor acts. How many of the statements given above are correct?",
    )
    expect(r.intro).toBe('Consider the following statements about Article 160:')
    expect(r.statements.map((s) => s.label)).toEqual(['1.', '2.', '3.', '4.'])
    expect(r.statements[0].text).toBe('Article 160 lets the President provide for X.')
    expect(r.tail).toBe('How many of the statements given above are correct?')
  })

  it('splits Statement-I / Statement-II', () => {
    const r = splitStatements(
      'Statement-I: A is true. Statement-II: B is true. Which one of the following is correct?',
    )
    expect(r.statements.map((s) => s.label)).toEqual(['Statement I', 'Statement II'])
    expect(r.tail).toBe('Which one of the following is correct?')
  })

  it('leaves ordinary text alone', () => {
    const r = splitStatements('Find the value of 2.5 + 1.5. Show working.')
    expect(r.statements).toEqual([])
    expect(r.intro).toBe('Find the value of 2.5 + 1.5. Show working.')
  })
})
