import { SECTION_KINDS } from './templates'
import type { SectionKind, TemplateDefinition } from './templates'

/** Shapes untrusted JSON into a TemplateDefinition, or null when it is not even the right kind of thing. */
export function parseDefinition(raw: unknown): TemplateDefinition | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  const mix = o.levelMix as Record<string, unknown> | undefined
  if (!Array.isArray(o.sections) || !mix || typeof o.name !== 'string')
    return null
  const num = (v: unknown) => (typeof v === 'number' ? v : Number.NaN)
  return {
    name: o.name,
    totalMarks: num(o.totalMarks),
    durationMin: num(o.durationMin),
    levelMix: {
      recall_understanding: num(mix.recall_understanding),
      application: num(mix.application),
      analysis_evaluation: num(mix.analysis_evaluation),
    },
    sections: o.sections.map((s) => {
      const r = (s ?? {}) as Record<string, unknown>
      return {
        name: typeof r.name === 'string' ? r.name : '',
        kind: (SECTION_KINDS.includes(r.kind as SectionKind)
          ? r.kind
          : 'short_answer') as SectionKind,
        count: num(r.count),
        marks: num(r.marks),
        orCount: num(r.orCount ?? 0),
      }
    }),
  }
}
