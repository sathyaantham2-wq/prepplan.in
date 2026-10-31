import { useCallback, useEffect, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { Lightbulb, Printer } from 'lucide-react'
import { MathText } from '../../../../components/math-text'
import { PCard, Pill, Toggles, ghostBtn, muted, solidBtn, strong, useDarkMode } from '../../../../components/school/progress-ui'
import type { T } from '../../../../components/school/progress-ui'
import { api } from '../../../../lib/school-client'
import { useLang } from '../../../../lib/school-i18n'
import type { practiceCheck, practiceSet } from '../../../../lib/schools/practice'

export const Route = createFileRoute('/school/$schoolId/progress/practise')({
  validateSearch: (s: Record<string, unknown>): { topic?: string; child?: string } => ({
    topic: typeof s.topic === 'string' ? s.topic : undefined,
    child: typeof s.child === 'string' ? s.child : undefined,
  }),
  component: PractisePage,
})

type SetData = Awaited<ReturnType<typeof practiceSet>>
type Item = SetData['rounds'][number]['first']
type Checked = Awaited<ReturnType<typeof practiceCheck>>

interface Outcome {
  round: number
  which: 'first' | 'fresh'
  hint: boolean
  /** Whether she got it: a choice is checked for her; a written answer she compares with the steps herself. */
  right: boolean
}

// "Practise this" as a sitting of her own (owner direction 2026-10-31): try a question, ask for a hint only if
// she wants one, see the answer and the steps one at a time, then a fresh question on the same idea to do on her
// own. Nothing is saved or sent anywhere; the outcome of each question lives only on this screen.
function PractisePage() {
  const { schoolId } = Route.useParams()
  const { topic, child } = Route.useSearch()
  const [lang, setLang, t] = useLang()
  const [dark, toggleDark] = useDarkMode()
  const [data, setData] = useState<SetData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pos, setPos] = useState({ round: 0, which: 'first' as 'first' | 'fresh' })
  const [outcomes, setOutcomes] = useState<Array<Outcome>>([])
  const [done, setDone] = useState(false)
  const base = `/api/schools/${schoolId}/progress/practise-set`
  const load = useCallback(async () => {
    setData(null)
    setOutcomes([])
    setDone(false)
    setPos({ round: 0, which: 'first' })
    const q = new URLSearchParams({ topic: topic ?? '' })
    if (child) q.set('child', child)
    setData(await api<SetData>(`${base}?${q.toString()}`))
  }, [base, topic, child])
  useEffect(() => {
    void load().catch((e: unknown) => setError(e instanceof Error ? e.message : 'Something went wrong.'))
  }, [load])

  const back = (
    <Link
      to="/school/$schoolId/progress"
      params={{ schoolId }}
      search={child ? { child } : {}}
      className={`inline-flex min-h-11 items-center text-base font-semibold underline ${muted}`}
    >
      {t('back')}
    </Link>
  )
  const frame = (body: React.ReactNode) => (
    <div className="space-y-4" data-testid="practise">
      <Toggles lang={lang} setLang={setLang} dark={dark} toggleDark={toggleDark} t={t} />
      {back}
      {body}
    </div>
  )
  if (error) return frame(<p className="text-base text-red-700 dark:text-red-300">{error}</p>)
  if (!data) return frame(<p className={`text-base ${muted}`}>{t('loading')}</p>)
  if (data.rounds.length === 0)
    return frame(
      <PCard title={`${t('practise')}: ${data.topic.label}`}>
        <p className={`text-base ${strong}`}>{t('noQuestions')}</p>
      </PCard>,
    )
  const printHref = `/api/schools/${schoolId}/progress/practise?${new URLSearchParams({ topic: topic ?? '', lang, ...(child ? { child } : {}) }).toString()}`

  if (done)
    return frame(
      <PCard title={t('howDidYouDo')} testId="practise-summary">
        <ul className="space-y-2">
          {outcomes.map((o, i) => (
            <li key={i} className="flex items-center justify-between gap-2 text-base">
              <span className={strong}>
                {t('round')} {o.round + 1} · {o.which === 'first' ? t('firstOne') : t('freshOne')}
              </span>
              <span className="flex gap-2">
                <Pill tone={o.right ? 'good' : 'plain'}>{o.right ? '✓' : '·'}</Pill>
                <Pill tone={o.hint ? 'amber' : 'blue'}>{o.hint ? t('withHint') : t('onMyOwn')}</Pill>
              </span>
            </li>
          ))}
        </ul>
        <p className={`mt-3 text-base ${muted}`}>{t('oneSuccess')}</p>
        <p className={`mt-1 text-sm ${muted}`}>{t('nothingSaved')}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" className={solidBtn()} onClick={() => void load()}>
            {t('practiseAgain')}
          </button>
          <a className={ghostBtn()} href={printHref} target="_blank" rel="noreferrer">
            <Printer aria-hidden="true" className="size-4" /> {t('printInstead')}
          </a>
        </div>
      </PCard>,
    )

  const round = data.rounds[pos.round]
  const item = pos.which === 'first' ? round.first : (round.fresh ?? round.first)
  const last = pos.round === data.rounds.length - 1
  const hasFresh = round.fresh !== null
  function finished(o: Outcome) {
    const all = [...outcomes, o]
    setOutcomes(all)
    if (pos.which === 'first' && hasFresh) setPos({ round: pos.round, which: 'fresh' })
    else if (!last) setPos({ round: pos.round + 1, which: 'first' })
    else setDone(true)
  }
  return frame(
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <p className={`text-lg font-bold ${strong}`}>
          {t('practise')}: {data.topic.label}
        </p>
        <Pill>
          {t('round')} {pos.round + 1}/{data.rounds.length}
        </Pill>
      </div>
      <p className={`px-1 text-base ${muted}`}>{pos.which === 'first' ? t('tryFirst') : t('tryFresh')}</p>
      <Question
        key={`${pos.round}-${pos.which}`}
        item={item}
        topic={topic ?? ''}
        child={child ?? null}
        base={base}
        t={t}
        last={last && (pos.which === 'fresh' || !hasFresh)}
        onFinished={(hint, right) => finished({ round: pos.round, which: pos.which, hint, right })}
      />
      <p className={`px-1 text-sm ${muted}`}>{t('nothingSaved')}</p>
    </div>,
  )
}

function Question({
  item,
  topic,
  child,
  base,
  t,
  last,
  onFinished,
}: {
  item: Item
  topic: string
  child: string | null
  base: string
  t: T
  last: boolean
  onFinished: (hint: boolean, right: boolean) => void
}) {
  const [hint, setHint] = useState<string | null>(null)
  const [chosen, setChosen] = useState<string | null>(null)
  const [written, setWritten] = useState('')
  const [checked, setChecked] = useState<Checked | null>(null)
  const [shown, setShown] = useState(0)
  const [had, setHad] = useState<Array<boolean>>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function post(body: Record<string, unknown>) {
    setBusy(true)
    setError(null)
    try {
      return await api<Record<string, unknown>>(base, { body: { topic, question_id: item.id, child, ...body } })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
      return null
    } finally {
      setBusy(false)
    }
  }
  async function askHint() {
    const r = await post({ action: 'hint' })
    if (r) setHint(String(r.hint))
  }
  async function check() {
    const r = await post({ action: 'check', chosen })
    if (r) setChecked(r as unknown as Checked)
  }
  const steps = checked?.steps ?? []
  const stepsDone = checked !== null && checked.type !== 'mcq' && steps.length > 0 && had.length === steps.length
  const written2 = checked !== null && checked.type !== 'mcq'
  const rightNow = written2 && steps.length > 0 ? had.every(Boolean) : null

  return (
    <PCard testId="practise-question">
      <p className={`text-lg ${strong}`}>
        <MathText text={item.text} />
      </p>
      {item.type === 'mcq' ? (
        <ul className="mt-3 space-y-2" role="radiogroup">
          {item.options.map((o) => (
            <li key={o.label}>
              <button
                type="button"
                role="radio"
                aria-checked={chosen === o.label}
                disabled={checked !== null}
                onClick={() => setChosen(o.label)}
                className={`flex min-h-12 w-full items-center gap-3 rounded-xl border px-3 text-left text-base ${chosen === o.label ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950' : 'border-slate-300 dark:border-slate-600'} ${strong}`}
              >
                <b>{o.label}</b>
                <MathText text={o.text} />
              </button>
            </li>
          ))}
        </ul>
      ) : checked === null ? (
        <label className={`mt-3 block text-base font-semibold ${strong}`}>
          {t('writeHere')}
          <textarea
            rows={4}
            value={written}
            onChange={(e) => setWritten(e.target.value)}
            className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-base font-normal text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          />
        </label>
      ) : null}
      {error ? <p className="mt-2 text-base text-red-700 dark:text-red-300">{error}</p> : null}

      {hint !== null ? (
        <p className="mt-3 flex gap-2 rounded-xl bg-amber-50 p-3 text-base text-amber-950 dark:bg-amber-950 dark:text-amber-100" data-testid="hint">
          <Lightbulb aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <span>
            <b>{t('hintLabel')}:</b> <MathText text={hint} />
          </span>
        </p>
      ) : null}

      {checked === null ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {hint === null ? (
            <button type="button" className={ghostBtn()} disabled={busy} onClick={() => void askHint()} data-testid="hint-btn">
              <Lightbulb aria-hidden="true" className="size-4" /> {t('hintBtn')}
            </button>
          ) : null}
          <button
            type="button"
            className={solidBtn()}
            disabled={busy || (item.type === 'mcq' && chosen === null)}
            onClick={() => void check()}
            data-testid="check-btn"
          >
            {item.type === 'mcq' ? t('checkBtn') : t('iWrote')}
          </button>
        </div>
      ) : (
        <div className="mt-3 space-y-3" data-testid="checked">
          {checked.type === 'mcq' ? (
            <p className={`rounded-xl p-3 text-base ${checked.correct ? 'bg-emerald-50 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-100' : 'bg-slate-100 dark:bg-slate-800 ' + strong}`}>
              <b>{checked.correct ? t('correctNice') : t('notQuite')}</b>{' '}
              <span>
                {t('answerIs')}: <MathText text={checked.answer} />
              </span>
            </p>
          ) : (
            <p className={`rounded-xl bg-slate-100 p-3 text-base dark:bg-slate-800 ${strong}`}>
              <b>{t('answerIs')}:</b> <MathText text={checked.answer} />
            </p>
          )}

          {written2 && steps.length > 0 ? (
            <div>
              <p className={`text-sm font-semibold ${muted}`}>{t('stepsTitle')}</p>
              <ol className="mt-1 space-y-2">
                {steps.slice(0, shown).map((s, i) => (
                  <li key={s.no} className="rounded-xl border border-slate-200 p-2 dark:border-slate-700" data-testid="step">
                    <p className={`text-base ${strong}`}>
                      {i + 1}. <MathText text={s.description} />
                    </p>
                    {had.length <= i ? (
                      <div className="mt-1 flex gap-2">
                        <button type="button" className={ghostBtn()} onClick={() => setHad([...had, true])}>
                          {t('hadStep')}
                        </button>
                        <button type="button" className={ghostBtn()} onClick={() => setHad([...had, false])}>
                          {t('missedStep')}
                        </button>
                      </div>
                    ) : (
                      <Pill tone={had[i] ? 'good' : 'amber'}>{had[i] ? t('hadStep') : t('missedStep')}</Pill>
                    )}
                  </li>
                ))}
              </ol>
              {shown < steps.length && had.length === shown ? (
                <button type="button" className={`${ghostBtn()} mt-2`} onClick={() => setShown(shown + 1)} data-testid="next-step">
                  {shown === 0 ? t('showSteps') : t('nextStep')}
                </button>
              ) : null}
            </div>
          ) : null}

          {written2 && steps.length === 0 ? (
            <div className="flex flex-wrap gap-2">
              <button type="button" className={solidBtn()} onClick={() => onFinished(hint !== null, true)}>
                {t('gotIt')}
              </button>
              <button type="button" className={ghostBtn()} onClick={() => onFinished(hint !== null, false)}>
                {t('notYet')}
              </button>
            </div>
          ) : null}

          {checked.type === 'mcq' || stepsDone ? (
            <button
              type="button"
              className={solidBtn()}
              onClick={() => onFinished(hint !== null, checked.type === 'mcq' ? checked.correct === true : rightNow === true)}
              data-testid="next-btn"
            >
              {last ? t('finishBtn') : t('nextBtn')}
            </button>
          ) : null}
        </div>
      )}
    </PCard>
  )
}
