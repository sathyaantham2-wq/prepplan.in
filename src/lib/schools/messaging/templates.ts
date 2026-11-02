// The ONLY messages a school's people may receive (owner approval 2026-11-01; docs/schools/MESSAGING_PLAN.md
// section 6). One file, English and Telugu side by side, with {placeholders}. These are drafts for the owner to
// submit to Meta for approval: all are category "utility" (results, reminders and learning only). Nothing
// promotional exists here and nothing may be added without also passing templates.test.ts and the database
// CHECK on school_messages.template (migration 0096). Client-safe: no server imports.

export type Lang = 'en' | 'te'
export type Audience = 'parent' | 'teacher' | 'principal'

export const TEMPLATE_KEYS = [
  'result_ready',
  'weekly_focus',
  'flags_waiting',
  'uploads_pending',
  'dispute_closing',
  'teacher_attention',
  'monday_pulse',
] as const
export type TemplateKey = (typeof TEMPLATE_KEYS)[number]

export interface TemplateDef {
  key: TemplateKey
  audience: Audience
  /** Meta's category. Only "utility" is allowed (results, reminders, learning). */
  category: 'utility'
  /** The template's name at Meta (lower case, digits, underscores). */
  metaName: string
  /** The placeholders in the order Meta numbers them ({{1}}, {{2}} ...). Exactly what the text uses. */
  vars: ReadonlyArray<string>
  en: string
  te: string
}

const STOP_EN = 'Reply STOP to stop these messages.'
const STOP_TE = 'ఈ సందేశాలు వద్దంటే STOP అని జవాబు ఇవ్వండి.'

export const APPROVED_TEMPLATES: ReadonlyArray<TemplateDef> = [
  {
    key: 'result_ready',
    audience: 'parent',
    category: 'utility',
    metaName: 'result_ready_v1',
    vars: ['school', 'child', 'subject', 'exam', 'score', 'strength', 'practise_1', 'practise_2', 'link', 'link_days', 'window_days'],
    en: `Hello. {school} has released {child}'s {subject} result for {exam}: {score}. What went well: {strength}. To practise: {practise_1}, {practise_2}. Full report: {link} (valid for {link_days} days). If you think a mark is wrong, please ask the school within {window_days} days. ${STOP_EN}`,
    te: `నమస్కారం. {school} నుండి {child} {subject} ({exam}) ఫలితం విడుదలైంది: {score}. బాగా వచ్చినది: {strength}. సాధన చేయాల్సినవి: {practise_1}, {practise_2}. పూర్తి నివేదిక: {link} ({link_days} రోజులు చెల్లుతుంది). ఏదైనా మార్కు తప్పు అనిపిస్తే {window_days} రోజుల్లోపు పాఠశాలను అడగండి. ${STOP_TE}`,
  },
  {
    key: 'weekly_focus',
    audience: 'parent',
    category: 'utility',
    metaName: 'weekly_focus_v1',
    vars: ['child', 'focus_1', 'focus_2', 'focus_3', 'link', 'link_days'],
    en: `Hello. This week's focus for {child}: 1) {focus_1} 2) {focus_2} 3) {focus_3}. Practice sheet and details: {link} (valid for {link_days} days). ${STOP_EN}`,
    te: `నమస్కారం. ఈ వారం {child} దృష్టి పెట్టాల్సినవి: 1) {focus_1} 2) {focus_2} 3) {focus_3}. సాధన పత్రం, వివరాలు: {link} ({link_days} రోజులు చెల్లుతుంది). ${STOP_TE}`,
  },
  {
    key: 'flags_waiting',
    audience: 'teacher',
    category: 'utility',
    metaName: 'flags_waiting_v1',
    vars: ['teacher', 'count', 'sections', 'oldest_days', 'link'],
    en: 'Hello {teacher}. {count} flagged answer(s) are waiting for you in {sections}. The oldest has waited {oldest_days} day(s). Please review them here: {link}. Thank you.',
    te: 'నమస్కారం {teacher}. {sections} లో {count} ఫ్లాగ్ చేసిన జవాబులు మీ పరిశీలన కోసం ఎదురుచూస్తున్నాయి. పాతది {oldest_days} రోజులుగా ఉంది. దయచేసి ఇక్కడ చూడండి: {link}. ధన్యవాదాలు.',
  },
  {
    key: 'uploads_pending',
    audience: 'teacher',
    category: 'utility',
    metaName: 'uploads_pending_v1',
    vars: ['teacher', 'exam', 'section', 'names', 'link'],
    en: 'Hello {teacher}. Answer sheets are still missing for {exam} ({section}): {names}. Please upload them here: {link}. Thank you.',
    te: 'నమస్కారం {teacher}. {exam} ({section}) కు ఈ విద్యార్థుల జవాబు పత్రాలు ఇంకా రాలేదు: {names}. దయచేసి ఇక్కడ అప్‌లోడ్ చేయండి: {link}. ధన్యవాదాలు.',
  },
  {
    key: 'dispute_closing',
    audience: 'teacher',
    category: 'utility',
    metaName: 'dispute_closing_v1',
    vars: ['teacher', 'exam', 'section', 'closes', 'count', 'link'],
    en: 'Hello {teacher}. The query window for {exam} ({section}) closes on {closes}. {count} student query(ies) still need your decision: {link}. Thank you.',
    te: 'నమస్కారం {teacher}. {exam} ({section}) సందేహాల గడువు {closes} న ముగుస్తుంది. ఇంకా {count} సందేహాలపై మీ నిర్ణయం కావాలి: {link}. ధన్యవాదాలు.',
  },
  {
    key: 'teacher_attention',
    audience: 'teacher',
    category: 'utility',
    metaName: 'teacher_attention_v1',
    vars: ['teacher', 'child', 'section', 'subject', 'link'],
    en: 'Hello {teacher}. {child} ({section}) has scored lower in the last two {subject} tests. A quiet word may help. Details: {link}. Thank you.',
    te: 'నమస్కారం {teacher}. {child} ({section}) గత రెండు {subject} పరీక్షల్లో తక్కువ మార్కులు తెచ్చుకున్నారు. ఒకసారి మాట్లాడితే మంచిది. వివరాలు: {link}. ధన్యవాదాలు.',
  },
  {
    key: 'monday_pulse',
    audience: 'principal',
    category: 'utility',
    metaName: 'monday_pulse_v1',
    vars: ['name', 'school', 'weak_1', 'weak_2', 'weak_3', 'improved', 'stuck', 'link'],
    en: 'Good morning {name}. Weekly pulse for {school}. Weakest topics: {weak_1}; {weak_2}; {weak_3}. Sections that improved: {improved}. Stuck: {stuck}. Details: {link}. Thank you.',
    te: 'శుభోదయం {name}. {school} వారపు సారాంశం. బలహీనమైన అంశాలు: {weak_1}; {weak_2}; {weak_3}. మెరుగైన సెక్షన్లు: {improved}. ఆగిపోయినవి: {stuck}. వివరాలు: {link}. ధన్యవాదాలు.',
  },
]

export class UnapprovedTemplateError extends Error {
  constructor(key: string) {
    super(`"${key}" is not an approved school message template.`)
    this.name = 'UnapprovedTemplateError'
  }
}

export function isApprovedTemplate(key: string): key is TemplateKey {
  return APPROVED_TEMPLATES.some((t) => t.key === key)
}

/** The definition, or throws: nothing outside the approved list can be queued, rendered or sent. */
export function templateDef(key: string): TemplateDef {
  const def = APPROVED_TEMPLATES.find((t) => t.key === key)
  if (!def) throw new UnapprovedTemplateError(key)
  return def
}

const PLACEHOLDER = /\{([a-z0-9_]+)\}/g

/** The placeholder names a text uses, in order of first appearance. */
export function placeholdersOf(text: string): Array<string> {
  return [...new Set([...text.matchAll(PLACEHOLDER)].map((m) => m[1]))]
}

/** The text with the variables filled in (for the admin's preview and for tests). Missing or extra variables throw. */
export function renderTemplate(key: string, lang: Lang, vars: Readonly<Record<string, string>>): string {
  const def = templateDef(key)
  const missing = def.vars.filter((v) => !(v in vars))
  const extra = Object.keys(vars).filter((v) => !def.vars.includes(v))
  if (missing.length > 0 || extra.length > 0)
    throw new Error(`Template ${key}: missing [${missing.join(', ')}], not allowed [${extra.join(', ')}].`)
  return def[lang].replace(PLACEHOLDER, (_m, name: string) => vars[name])
}

/** The text in Meta's numbered form ({{1}}, {{2}} ...) for the owner to submit for approval. */
export function metaBody(def: TemplateDef, lang: Lang): string {
  return def[lang].replace(PLACEHOLDER, (_m, name: string) => `{{${def.vars.indexOf(name) + 1}}}`)
}

/** Variables that are made at SEND time and never stored: a parent's link expires 7 days after it is sent. */
export const SEND_TIME_VARS: ReadonlyArray<string> = ['link', 'link_days']

/** The variables a message carries when it is queued: all of the template's, except the send-time ones. */
export function queueVars(def: TemplateDef): Array<string> {
  return def.vars.filter((v) => !SEND_TIME_VARS.includes(v))
}
