import { describe, expect, it } from 'vitest'
import {
  APPROVED_TEMPLATES,
  TEMPLATE_KEYS,
  UnapprovedTemplateError,
  isApprovedTemplate,
  metaBody,
  placeholdersOf,
  renderTemplate,
  templateDef,
} from './templates'

// The approved-template guard (plan section 1 rule 4 and section 8 test 10): the list is the only door.
const PROMO = /\b(offer|discount|sale|subscribe|subscription|buy now|upgrade|premium|free trial|coupon|deal|win|prize|download the app|install|refer|cashback|limited time)\b/i

describe('approved school message templates', () => {
  it('the list and the keys agree, with no duplicates', () => {
    expect(APPROVED_TEMPLATES.map((t) => t.key).sort()).toEqual([...TEMPLATE_KEYS].sort())
    expect(new Set(APPROVED_TEMPLATES.map((t) => t.metaName)).size).toBe(APPROVED_TEMPLATES.length)
  })

  it('every template is utility and named for Meta', () => {
    for (const t of APPROVED_TEMPLATES) {
      expect(t.category).toBe('utility')
      expect(t.metaName).toMatch(/^[a-z0-9_]+_v\d+$/)
    }
  })

  it('English and Telugu use exactly the declared placeholders', () => {
    for (const t of APPROVED_TEMPLATES) {
      expect(placeholdersOf(t.en).sort(), `${t.key} en`).toEqual([...t.vars].sort())
      expect(placeholdersOf(t.te).sort(), `${t.key} te`).toEqual([...t.vars].sort())
    }
  })

  it('no template starts or ends with a variable (Meta rule) and none is empty', () => {
    for (const t of APPROVED_TEMPLATES)
      for (const text of [t.en, t.te]) {
        expect(text.trim().length).toBeGreaterThan(20)
        expect(text.startsWith('{'), t.key).toBe(false)
        expect(text.endsWith('}'), t.key).toBe(false)
      }
  })

  it('no promotion, marketing words or links other than {link}', () => {
    for (const t of APPROVED_TEMPLATES)
      for (const text of [t.en, t.te]) {
        expect(PROMO.test(text), `${t.key}: ${text}`).toBe(false)
        expect(/https?:\/\/|www\./i.test(text), t.key).toBe(false)
      }
  })

  it('parent templates carry the STOP line; staff templates do not need it', () => {
    for (const t of APPROVED_TEMPLATES.filter((x) => x.audience === 'parent')) {
      expect(t.en).toContain('STOP')
      expect(t.te).toContain('STOP')
    }
  })

  it('the result message carries the dispute line with the real window, not a fixed 7', () => {
    const t = templateDef('result_ready')
    expect(t.vars).toContain('window_days')
    expect(t.en).toContain('{window_days}')
    expect(t.en).not.toMatch(/within 7 days/)
  })

  it('refuses a template that is not on the list', () => {
    for (const bad of ['promo_offer', 'welcome', 'weekly_summary', 'daily_nudge', '', 'RESULT_READY']) {
      expect(isApprovedTemplate(bad)).toBe(false)
      expect(() => templateDef(bad)).toThrow(UnapprovedTemplateError)
      expect(() => renderTemplate(bad, 'en', {})).toThrow(UnapprovedTemplateError)
    }
  })

  it('renders only with exactly the declared variables', () => {
    const vars = Object.fromEntries(templateDef('weekly_focus').vars.map((v) => [v, `<${v}>`]))
    const out = renderTemplate('weekly_focus', 'en', vars)
    expect(out).toContain('<child>')
    expect(out).not.toMatch(/\{[a-z_]+\}/)
    expect(() => renderTemplate('weekly_focus', 'en', { ...vars, extra: 'x' })).toThrow(/not allowed/)
    const { child: _c, ...fewer } = vars
    expect(() => renderTemplate('weekly_focus', 'te', fewer)).toThrow(/missing/)
  })

  it("Meta's numbered form numbers every variable in declared order", () => {
    const d = templateDef('flags_waiting')
    const body = metaBody(d, 'en')
    expect(body).toContain('{{1}}')
    expect(body).toContain(`{{${d.vars.length}}}`)
    expect(body).not.toMatch(/\{[a-z_]+\}/)
  })
})
