import type { Lang } from '../../school-i18n'

// The fixed words on the parent's link page, English and Telugu. Kept apart from school-i18n so the parent page
// does not widen the student screens' dictionary. Client-safe.
const EN = {
  title: 'Progress report',
  for: 'Report for',
  classWord: 'Class',
  score: 'Score',
  wentWell: 'What went well',
  toPractise: 'To practise',
  focusTitle: "This week's focus",
  focusEmpty: 'There is no new focus yet.',
  notFinal: 'These marks are not final yet. The school can still change them until the question window closes on',
  final: 'These marks are final.',
  askSchool: 'If you think a mark is wrong, please ask the school before',
  validUntil: 'This link works until',
  readOnly: 'This page only shows the report. Nothing here can be changed.',
  expiredTitle: 'This link is not working',
  expiredBody: 'It may have expired or been copied wrongly. Please ask the school for a new link.',
  loading: 'Loading…',
  language: 'Language',
  dark: 'Dark mode',
} as const
export type CopyKey = keyof typeof EN
const TE: Record<CopyKey, string> = {
  title: 'ప్రగతి నివేదిక',
  for: 'నివేదిక',
  classWord: 'తరగతి',
  score: 'మార్కులు',
  wentWell: 'బాగా వచ్చినది',
  toPractise: 'సాధన చేయాల్సినవి',
  focusTitle: 'ఈ వారం దృష్టి పెట్టాల్సినవి',
  focusEmpty: 'ఇంకా కొత్త అంశాలు లేవు.',
  notFinal: 'ఈ మార్కులు ఇంకా తుది కాదు. సందేహాల గడువు ముగిసే వరకు పాఠశాల వీటిని మార్చవచ్చు:',
  final: 'ఈ మార్కులు తుది మార్కులు.',
  askSchool: 'ఏదైనా మార్కు తప్పు అనిపిస్తే దయచేసి ఈ తేదీకి ముందే పాఠశాలను అడగండి:',
  validUntil: 'ఈ లింక్ ఈ తేదీ వరకు పనిచేస్తుంది:',
  readOnly: 'ఈ పేజీ నివేదికను చూపడానికి మాత్రమే. ఇక్కడ ఏదీ మార్చలేరు.',
  expiredTitle: 'ఈ లింక్ పనిచేయడం లేదు',
  expiredBody: 'గడువు ముగిసి ఉండవచ్చు లేదా తప్పుగా కాపీ అయి ఉండవచ్చు. దయచేసి పాఠశాలను కొత్త లింక్ అడగండి.',
  loading: 'లోడ్ అవుతోంది…',
  language: 'భాష',
  dark: 'డార్క్ మోడ్',
}
export function copy(lang: Lang, key: CopyKey): string {
  return lang === 'te' ? TE[key] : EN[key]
}
export const COPY_KEYS = Object.keys(EN) as Array<CopyKey>
export const COPY_KEYS_TE = Object.keys(TE) as Array<CopyKey>
