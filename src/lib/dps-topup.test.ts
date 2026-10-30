import { describe, expect, it } from 'vitest'
import { fitsPaperSlot, validatePack } from '../../scripts/load-dps-pack'
import type { PackFile, PackQuestion } from '../../scripts/load-dps-pack'

// The top-up packs (owner request 2026-10-30: enough questions per chapter for three papers in both
// school layouts). The per-concept mix does not apply; the question rules, a page and a slot do.
const long4: PackQuestion = {
  b: 'Analyse',
  d: 'Hard',
  t: 'long_answer',
  m: 4,
  q: 'A shop sells pens in packs of 12 and pencils in packs of 18. Riya wants the same number of pens and pencils. (a) Find the least number of each she can buy. (b) How many packs of each is that? (c) Check your answer.',
  a: '(a) LCM(12, 18) = 36 of each. (b) 3 packs of pens, 2 packs of pencils. (c) 3 x 12 = 36 and 2 x 18 = 36.',
  s: [
    ['Finds LCM(12, 18) = 36 with working', 2],
    ['Packs: 3 of pens and 2 of pencils', 1],
    ['Checks both totals are 36', 1],
  ],
  p: 'p. 52',
}
const pack = (qs: Array<PackQuestion>): PackFile => ({
  kind: 'dps_topup',
  subject: { code: 'MATH', class: 7, board: 'CBSE' },
  chapter: { part: 'II', chapter_no: 3, name: 'Finding Common Ground' },
  source_code: 'gegp203',
  concepts: [{ code: 'C7M-3.1', questions: qs }],
})

describe('top-up packs', () => {
  it('a good 4-mark long answer passes and fits the 4-mark long-answer slot', () => {
    expect(validatePack(pack([long4]))).toEqual([])
    expect(fitsPaperSlot(long4)).toBe('la4')
  })
  it('needs a page, 3 to 5 marking steps that add up, and a slot', () => {
    const noPage = validatePack(pack([{ ...long4, p: undefined }]))
    expect(noPage.join()).toMatch(/names its NCERT page/)
    const twoSteps = validatePack(
      pack([
        {
          ...long4,
          s: [
            ['LCM 36 with working', 2],
            ['packs 3 and 2', 2],
          ],
        },
      ]),
    )
    expect(twoSteps.join()).toMatch(/3 to 5 marking steps/)
    const wrongSum = validatePack(
      pack([
        {
          ...long4,
          s: [
            ['a', 1],
            ['b', 1],
            ['c', 1],
          ],
        },
      ]),
    )
    expect(wrongSum.join()).toMatch(/steps sum to 3, question is 4/)
    const tooLow = validatePack(pack([{ ...long4, b: 'Understand' }]))
    expect(tooLow.join()).toMatch(/fits no paper slot/)
  })
  it('the per-concept mix of a full pack is not asked of a top-up', () => {
    const r = validatePack(pack([long4]))
    expect(r.join()).not.toMatch(/needs at least/)
  })
  it('a full pack still needs its mix', () => {
    expect(validatePack({ ...pack([long4]), kind: 'dps_pack' }).join()).toMatch(
      /needs at least/,
    )
  })
})
