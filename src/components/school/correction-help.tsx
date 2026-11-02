import { useLang } from '../../lib/school-i18n'

// "How AI correction works" in plain English and Telugu (owner request 2026-11-01): short steps, and the one rule
// teachers keep asking about: when is an AI mark final and when does the teacher decide. Shown on the AI correction
// start page and on every exam page, closed until opened.

const EN = {
  title: 'How AI correction works',
  steps: [
    ['Your paper', 'Add the question paper you used. PrepPlan reads the questions; you check them and approve.'],
    ['The answers', 'The correct answers are ready as drafts (or you add them). You read them and approve. The AI uses only answers you approved.'],
    ["Students' sheets", "Add photos of each student's handwritten sheets. PrepPlan finds whose sheet it is. If it is not sure, it asks you."],
    ['AI marks', 'The AI reads each student three times and marks every question. Multiple-choice is marked from your answers, not by the AI.'],
    ['Your look', 'Where the AI is not sure it marks the answer yellow ("Please check"). You accept its mark or change it. Nothing yellow is left when you release.'],
    ['Results', 'You release a section. Students see their marks and can ask about up to 5 answers for a few days. Then the marks are final.'],
  ],
  rule: 'The rule: an AI mark stands unless it is yellow. A yellow answer always waits for you, and what you decide is final.',
  honest: 'The AI can be wrong, mostly when handwriting is hard to read. That is why you can change any mark, and why a few answers are picked at random for you to double-check.',
} as const
const TE = {
  title: 'AI దిద్దుబాటు ఎలా పనిచేస్తుంది',
  steps: [
    ['మీ పేపర్', 'మీరు వాడిన ప్రశ్నాపత్రాన్ని చేర్చండి. PrepPlan ప్రశ్నలను చదువుతుంది; మీరు చూసి ఆమోదించండి.'],
    ['జవాబులు', 'సరైన జవాబులు ముసాయిదాగా సిద్ధమవుతాయి (లేదా మీరు రాస్తారు). మీరు చదివి ఆమోదించండి. AI మీరు ఆమోదించిన జవాబులనే వాడుతుంది.'],
    ['విద్యార్థుల పత్రాలు', 'ప్రతి విద్యార్థి చేతిరాత పత్రాల ఫోటోలు చేర్చండి. ఏ పత్రం ఎవరిదో PrepPlan కనుగొంటుంది. సందేహం ఉంటే మిమ్మల్ని అడుగుతుంది.'],
    ['AI మార్కులు', 'AI ప్రతి విద్యార్థిని మూడుసార్లు చదివి ప్రతి ప్రశ్నకు మార్కులు వేస్తుంది. బహుళైచ్ఛిక ప్రశ్నలు AI కాదు, మీ జవాబుల ప్రకారం దిద్దబడతాయి.'],
    ['మీ పరిశీలన', 'AI కి నమ్మకం లేని జవాబులను పసుపు రంగులో ("దయచేసి చూడండి") చూపిస్తుంది. దాని మార్కును అంగీకరించండి లేదా మార్చండి. విడుదల చేసేటప్పుడు పసుపు జవాబు ఏదీ మిగలకూడదు.'],
    ['ఫలితాలు', 'సెక్షన్‌ను విడుదల చేయండి. విద్యార్థులు తమ మార్కులు చూసి కొన్ని రోజులు గరిష్ఠంగా 5 జవాబుల గురించి అడగవచ్చు. తర్వాత మార్కులు తుది.'],
  ],
  rule: 'నియమం: పసుపు కాని AI మార్కు నిలుస్తుంది. పసుపు జవాబు ఎప్పుడూ మీ కోసం ఆగుతుంది, మీ నిర్ణయం తుది.',
  honest: 'AI తప్పు చేయవచ్చు, ముఖ్యంగా చేతిరాత చదవడం కష్టమైనప్పుడు. అందుకే ఏ మార్కునైనా మార్చవచ్చు, మరియు కొన్ని జవాబులు యాదృచ్ఛికంగా మీ రెండోసారి చూపు కోసం ఇస్తారు.',
} as const

export function CorrectionHelp({ open = false }: { open?: boolean }) {
  const [lang, setLang] = useLang()
  const t = lang === 'te' ? TE : EN
  return (
    <details className="rounded-2xl border border-slate-200 bg-white px-4 py-3" data-testid="correction-help" open={open}>
      <summary className="min-h-11 cursor-pointer content-center text-base font-semibold">{t.title}</summary>
      <div className="mt-3 space-y-3">
        <div role="group" aria-label="Language" className="inline-flex rounded-xl border border-slate-300 p-0.5">
          {(['en', 'te'] as const).map((l) => (
            <button
              key={l}
              type="button"
              aria-pressed={lang === l}
              onClick={() => setLang(l)}
              className={`min-h-11 min-w-12 rounded-[10px] px-3 text-base font-semibold ${lang === l ? 'bg-slate-900 text-white' : 'text-slate-700'}`}
            >
              {l === 'en' ? 'EN' : 'తె'}
            </button>
          ))}
        </div>
        <ol className="space-y-2">
          {t.steps.map(([name, text], i) => (
            <li key={name} className="flex gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">{i + 1}</span>
              <p className="text-base">
                <b>{name}.</b> {text}
              </p>
            </li>
          ))}
        </ol>
        <p className="rounded-xl bg-emerald-50 px-3 py-2 text-base font-semibold text-emerald-950">{t.rule}</p>
        <p className="text-base text-slate-700">{t.honest}</p>
      </div>
    </details>
  )
}
