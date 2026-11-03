import { describe, expect, it } from 'vitest'
import { DARK, LIGHT, colour, contrast, schoolThemeCss } from './school-theme'
import type { Palette } from './school-theme'

// WCAG AA for the text/background pairs the school screens use, in both themes (UI redesign plan, section 2).
// Body text 4.5:1. Each pair is [text, background].
const PAIRS: Array<[string, string]> = [
  ['slate-900', 'white'], ['slate-900', 'page'], ['slate-800', 'white'], ['slate-700', 'white'], ['slate-700', 'slate-50'],
  ['slate-700', 'page'], ['slate-600', 'white'], ['slate-600', 'slate-50'], ['slate-600', 'page'], ['slate-500', 'white'],
  ['slate-500', 'page'], ['slate-400', 'white'], ['slate-800', 'slate-100'],
  ['emerald-700', 'white'], ['white', 'emerald-700'], ['white', 'emerald-800'], ['emerald-800', 'emerald-50'],
  ['emerald-900', 'emerald-50'], ['emerald-950', 'emerald-50'], ['emerald-50', 'emerald-700'], ['emerald-800', 'white'],
  ['amber-800', 'amber-50'], ['amber-900', 'amber-50'], ['amber-950', 'amber-50'], ['amber-950', 'amber-300'], ['amber-900', 'white'],
  ['red-700', 'white'], ['red-700', 'red-50'], ['red-800', 'red-50'], ['red-900', 'red-50'],
  ['sky-900', 'sky-50'], ['sky-800', 'sky-50'], ['teal-800', 'teal-50'], ['rose-800', 'rose-50'],
]

describe.each([['light', LIGHT], ['dark', DARK]] as Array<[string, Palette]>)('%s theme', (_name, p) => {
  it.each(PAIRS)('%s text on %s meets WCAG AA (4.5:1)', (fg, bg) => {
    expect(contrast(colour(p, fg), colour(p, bg))).toBeGreaterThanOrEqual(4.5)
  })
})

describe('theme style sheet', () => {
  it('sets every palette variable for both themes and the page colour', () => {
    const css = schoolThemeCss()
    expect(css).toContain('.school-ui.school-dark{--color-white:#171c22;--sc-page:#0f1318')
    expect(css.match(/--color-slate-900:/g)).toHaveLength(2)
    expect(css).toContain('accent-color')
  })
})
