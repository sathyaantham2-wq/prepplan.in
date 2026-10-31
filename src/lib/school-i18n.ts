import { useCallback, useEffect, useState } from 'react'

// English and Telugu for the Progress screens (owner direction 2026-10-31, plan section 15.1). Only fixed
// words are translated: screen text, level names, habit names and tips. Question text, the AI's per-answer
// reasons and the school's own wording stay as they were written. No server code here: it is shared by the
// screens, the parent PDF and the WhatsApp text.

export type Lang = 'en' | 'te'

const EN = {
  progress: 'Progress',
  subjects: 'Subjects',
  topics: 'Topics',
  habits: 'Writing habits',
  tabHabits: 'Habits',
  myProgress: 'My progress',
  growth: 'How your marks are growing',
  growthEmpty: 'Your first marked exam will start your growth line.',
  focus: "This week's focus",
  focusEmpty: 'Your focus will appear after your first locked exam.',
  best: 'Your best so far',
  newBest: 'A new personal best!',
  rank: 'Class rank',
  latest: 'Latest',
  trendUp: 'Going up',
  trendFlat: 'Steady',
  trendDown: 'Going down',
  proficientOf: 'topics at Proficient',
  assessed: 'topics so far',
  exams: 'Your exams',
  score: 'Score',
  grade: 'Grade',
  whereMarksWent: 'Where your marks went',
  didntKnow: "Didn't know it",
  writingHabits: 'Writing habits',
  notSure: 'Not sure why',
  marks: 'marks',
  threeFix: 'Three things to fix',
  practise: 'Practise this',
  noFix: 'Nothing to fix. Well done!',
  questionGrid: 'Question by question',
  yourPages: 'Your pages',
  perStep: 'Marks for each step',
  flag: 'I think this mark is wrong',
  notFinal: 'These marks are not final until',
  topicMap: 'Topic map',
  levelBeginner: 'Beginner',
  levelProgressing: 'Progressing',
  levelProficient: 'Proficient',
  notAssessed: 'Not assessed yet',
  dip: 'Dipped last time',
  howLevel:
    'Your level follows your recent exams. One weak test does not take away what you already showed.',
  habitTrend: 'How each habit changed from exam to exam',
  noHabits: 'No writing slips so far. Keep it up!',
  shareWhatsApp: 'Share on WhatsApp',
  parentPdf: 'Summary for parents (PDF)',
  reflection: 'About this exam',
  hardest: 'Which question was hardest?',
  nextTime: 'What will you do differently next time?',
  feeling: 'How did this exam feel?',
  feelHard: 'Hard',
  feelOk: 'Okay',
  feelGood: 'Good',
  save: 'Save',
  saved: 'Saved',
  optional: 'You can skip this.',
  language: 'Language',
  dark: 'Dark mode',
  loading: 'Loading…',
  back: 'Back',
  exam: 'Exam',
  habit_skipped_steps: 'Steps skipped',
  habit_units_missing: 'Units or final line missing',
  habit_stopped_early: 'Stopped writing too early',
  habit_misread_question: 'Misread the question',
  habit_other: 'Other writing slips',
  tip_skipped_steps: 'Show each step, even the easy ones.',
  tip_units_missing: 'End with the answer and its unit.',
  tip_stopped_early: 'Write the full answer, then read it once more.',
  tip_misread_question: 'Underline what the question asks before you start.',
  tip_other: 'Read your answer once more before you move on.',
  next_read_carefully: 'Read each question carefully',
  next_show_steps: 'Show all my steps',
  next_write_more: 'Write the full answer',
  next_revise_topic: 'Revise the topic that was weak',
  next_manage_time: 'Use my time better',
  noData: 'Nothing here yet. Your progress appears after an exam has been marked and its marks are final.',
  yourChild: 'Your child',
  summaryFor: 'Progress summary',
  exampleHonest: 'Only final marks are used.',
} as const

export type Key = keyof typeof EN

const TE: Record<Key, string> = {
  progress: 'పురోగతి',
  subjects: 'సబ్జెక్టులు',
  topics: 'అంశాలు',
  habits: 'రాసే అలవాట్లు',
  tabHabits: 'అలవాట్లు',
  myProgress: 'నా పురోగతి',
  growth: 'మీ మార్కులు ఎలా పెరుగుతున్నాయి',
  growthEmpty: 'మీ మొదటి మార్కైన పరీక్షతో మీ పెరుగుదల గీత మొదలవుతుంది.',
  focus: 'ఈ వారం దృష్టి పెట్టాల్సినవి',
  focusEmpty: 'మీ మొదటి ఖరారైన పరీక్ష తర్వాత ఇక్కడ కనిపిస్తాయి.',
  best: 'ఇప్పటివరకు మీ అత్యుత్తమం',
  newBest: 'కొత్త వ్యక్తిగత రికార్డు!',
  rank: 'తరగతి ర్యాంక్',
  latest: 'తాజా',
  trendUp: 'పెరుగుతోంది',
  trendFlat: 'స్థిరంగా ఉంది',
  trendDown: 'తగ్గుతోంది',
  proficientOf: 'అంశాల్లో నైపుణ్యం',
  assessed: 'అంశాలు ఇప్పటివరకు',
  exams: 'మీ పరీక్షలు',
  score: 'స్కోరు',
  grade: 'గ్రేడ్',
  whereMarksWent: 'మీ మార్కులు ఎక్కడ పోయాయి',
  didntKnow: 'తెలియలేదు',
  writingHabits: 'రాసే అలవాట్లు',
  notSure: 'కారణం స్పష్టంగా లేదు',
  marks: 'మార్కులు',
  threeFix: 'సరిచేసుకోవాల్సిన మూడు విషయాలు',
  practise: 'దీన్ని ప్రాక్టీస్ చేయండి',
  noFix: 'సరిచేయాల్సింది ఏమీ లేదు. బాగా చేశారు!',
  questionGrid: 'ప్రశ్న వారీగా',
  yourPages: 'మీ పేజీలు',
  perStep: 'ప్రతి దశకు మార్కులు',
  flag: 'ఈ మార్కు తప్పని నా అభిప్రాయం',
  notFinal: 'ఈ మార్కులు ఖరారు అయ్యేది',
  topicMap: 'అంశాల పటం',
  levelBeginner: 'ఆరంభ దశ (Beginner)',
  levelProgressing: 'పురోగతిలో (Progressing)',
  levelProficient: 'నైపుణ్యం (Proficient)',
  notAssessed: 'ఇంకా అంచనా వేయలేదు',
  dip: 'గత పరీక్షలో తగ్గింది',
  howLevel:
    'మీ స్థాయి ఇటీవలి పరీక్షలను బట్టి ఉంటుంది. ఒక బలహీన పరీక్ష మీరు ఇంతకు ముందు చూపినదాన్ని తీసివేయదు.',
  habitTrend: 'ప్రతి అలవాటు పరీక్ష నుండి పరీక్షకు ఎలా మారింది',
  noHabits: 'ఇప్పటివరకు రాతలో తప్పులు లేవు. ఇలాగే కొనసాగించండి!',
  shareWhatsApp: 'WhatsApp లో పంపండి',
  parentPdf: 'తల్లిదండ్రుల కోసం సారాంశం (PDF)',
  reflection: 'ఈ పరీక్ష గురించి',
  hardest: 'ఏ ప్రశ్న కష్టంగా అనిపించింది?',
  nextTime: 'వచ్చే సారి ఏం భిన్నంగా చేస్తారు?',
  feeling: 'ఈ పరీక్ష ఎలా అనిపించింది?',
  feelHard: 'కష్టం',
  feelOk: 'పర్వాలేదు',
  feelGood: 'బాగుంది',
  save: 'సేవ్ చేయండి',
  saved: 'సేవ్ అయింది',
  optional: 'ఇది మీరు వదిలేయవచ్చు.',
  language: 'భాష',
  dark: 'డార్క్ మోడ్',
  loading: 'లోడ్ అవుతోంది…',
  back: 'వెనుకకు',
  exam: 'పరీక్ష',
  habit_skipped_steps: 'దశలు వదిలేశారు',
  habit_units_missing: 'యూనిట్లు లేదా ముగింపు వాక్యం లేదు',
  habit_stopped_early: 'చాలా త్వరగా రాయడం ఆపేశారు',
  habit_misread_question: 'ప్రశ్నను తప్పుగా చదివారు',
  habit_other: 'ఇతర రాత తప్పులు',
  tip_skipped_steps: 'సులభమైన దశలతో సహా ప్రతి దశ రాయండి.',
  tip_units_missing: 'జవాబును దాని యూనిట్ తో ముగించండి.',
  tip_stopped_early: 'పూర్తి జవాబు రాసి, ఒకసారి మళ్లీ చదవండి.',
  tip_misread_question: 'మొదలుపెట్టే ముందు ప్రశ్న అడిగిన దాన్ని అండర్లైన్ చేయండి.',
  tip_other: 'తర్వాతి ప్రశ్నకు వెళ్లే ముందు మీ జవాబును ఒకసారి మళ్లీ చదవండి.',
  next_read_carefully: 'ప్రతి ప్రశ్నను జాగ్రత్తగా చదువుతాను',
  next_show_steps: 'అన్ని దశలు రాస్తాను',
  next_write_more: 'పూర్తి జవాబు రాస్తాను',
  next_revise_topic: 'బలహీనంగా ఉన్న అంశాన్ని మళ్లీ చదువుతాను',
  next_manage_time: 'సమయాన్ని బాగా వాడుకుంటాను',
  noData: 'ఇక్కడ ఇంకా ఏమీ లేదు. ఒక పరీక్ష మార్కులు వేసి, ఆ మార్కులు ఖరారైన తర్వాత మీ పురోగతి కనిపిస్తుంది.',
  yourChild: 'మీ పిల్లవాడు/పిల్ల',
  summaryFor: 'పురోగతి సారాంశం',
  exampleHonest: 'ఖరారైన మార్కులు మాత్రమే వాడతారు.',
}

/** The sentence under a "this week's focus" item (kind topic: marks lost; habit: marks lost; near: latest percent). */
export function focusWhy(
  lang: Lang,
  f: { kind: 'topic' | 'habit' | 'near'; n: number; habit?: string },
): string {
  const te = lang === 'te'
  if (f.kind === 'topic')
    return te
      ? `గత పరీక్షలో ఇక్కడ మీరు ${f.n} మార్కులు కోల్పోయారు, ఎందుకంటే ఈ అంశం ఇంకా అర్థం కాలేదు.`
      : `You lost ${f.n} ${f.n === 1 ? 'mark' : 'marks'} here in your last exam because the idea was not there yet.`
  if (f.kind === 'habit') {
    const tip = f.habit ? tr(lang, `tip_${f.habit}` as Key) : ''
    return te
      ? `గత రెండు పరీక్షల్లో ఇది మీకు ${f.n} మార్కులు పోగొట్టింది. ${tip}`
      : `It cost you ${f.n} ${f.n === 1 ? 'mark' : 'marks'} in your last two exams. ${tip}`
  }
  return te
    ? `ఈ అంశంలో మీరు నైపుణ్యానికి దగ్గరగా ఉన్నారు (గత సారి ${f.n}%). మరో మంచి పరీక్ష మిమ్మల్ని అక్కడికి చేరుస్తుంది.`
    : `You are close to Proficient here (${f.n}% last time). One more good exam gets you there.`
}

export function tr(lang: Lang, key: Key): string {
  return lang === 'te' ? TE[key] : EN[key]
}

export const ALL_KEYS = Object.keys(EN) as Array<Key>
export const TELUGU_KEYS = Object.keys(TE) as Array<Key>

const STORE = 'prepplan-school-lang'

/** The chosen language, remembered in this browser (nothing is sent anywhere). */
export function useLang(): [Lang, (l: Lang) => void, (k: Key) => string] {
  const [lang, setLang] = useState<Lang>('en')
  useEffect(() => {
    try {
      const v = window.localStorage.getItem(STORE)
      if (v === 'te' || v === 'en') setLang(v)
    } catch {
      // storage can be blocked; English is fine
    }
  }, [])
  const set = useCallback((l: Lang) => {
    setLang(l)
    try {
      window.localStorage.setItem(STORE, l)
    } catch {
      // ignore
    }
  }, [])
  const t = useCallback((k: Key) => tr(lang, k), [lang])
  return [lang, set, t]
}
