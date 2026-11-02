import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { copy } from '../lib/schools/messaging/parent-copy'
import type { CopyKey } from '../lib/schools/messaging/parent-copy'
import { tr, useLang } from '../lib/school-i18n'
import type { Key } from '../lib/school-i18n'
import type { ParentView } from '../lib/schools/messaging/parent-view'
import { useDarkMode } from '../components/school/progress-ui'

// A parent's personal report link. No login. The title and the link preview are FIXED text on purpose: WhatsApp
// shows a preview of a link, and it must never show a child's name or the school (owner rule 2026-11-01).
export const Route = createFileRoute('/p/$token')({
  head: () => ({
    meta: [
      { title: 'PrepPlan report' },
      { name: 'robots', content: 'noindex, nofollow' },
      { name: 'referrer', content: 'no-referrer' },
      { property: 'og:title', content: 'PrepPlan report' },
      { property: 'og:description', content: 'A progress report.' },
    ],
  }),
  component: ParentLinkPage,
})

const card = 'rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800'
const day = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' })

function ParentLinkPage() {
  const { token } = Route.useParams()
  const [lang, setLang] = useLang()
  const [dark, toggleDark] = useDarkMode()
  const [view, setView] = useState<ParentView | null>(null)
  const c = (k: CopyKey) => copy(lang, k)
  useEffect(() => {
    void fetch(`/api/parent-link/${encodeURIComponent(token)}`)
      .then((r) => (r.ok ? r.json() : { state: 'invalid' }))
      .then((v: ParentView) => setView(v))
      .catch(() => setView({ state: 'invalid' }))
  }, [token])

  return (
    <main
      data-testid="parent-link"
      className="mx-auto min-h-screen max-w-md bg-[#f5f6f8] px-4 py-4 text-slate-900 dark:bg-[#0b1220] dark:text-slate-100"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div role="group" aria-label={c('language')} className="inline-flex rounded-xl border border-slate-300 p-0.5 dark:border-slate-600">
          {(['en', 'te'] as const).map((l) => (
            <button
              key={l}
              type="button"
              aria-pressed={lang === l}
              onClick={() => setLang(l)}
              className={`min-h-11 min-w-12 rounded-[10px] px-3 text-base font-semibold ${
                lang === l ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900' : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              {l === 'en' ? 'EN' : 'తె'}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={toggleDark}
          aria-pressed={dark}
          className="min-h-11 rounded-xl border border-slate-300 px-3 text-base font-semibold dark:border-slate-600"
        >
          {c('dark')}
        </button>
      </div>

      {!view ? (
        <p className="text-base text-slate-600 dark:text-slate-400">{c('loading')}</p>
      ) : view.state === 'invalid' ? (
        <section className={card} data-testid="parent-link-invalid">
          <h1 className="text-xl font-bold">{c('expiredTitle')}</h1>
          <p className="mt-2 text-base">{c('expiredBody')}</p>
        </section>
      ) : (
        <div className="space-y-3">
          <section className={card}>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {c('for')} · {view.school}
            </p>
            <h1 className="text-2xl font-bold">{view.child}</h1>
            <p className="text-base text-slate-600 dark:text-slate-400">
              {c('classWord')} {view.grade} {view.section}
            </p>
          </section>

          {view.state === 'exam' ? (
            <>
              <section className={card}>
                <p className="text-base font-semibold">
                  {view.subject} · {view.exam}
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{c('score')}</p>
                <p className="text-4xl font-bold" data-testid="parent-score">
                  {view.earned}/{view.max}
                </p>
                <p className="text-base text-slate-600 dark:text-slate-400">{view.pct}%</p>
              </section>
              {view.strength ? (
                <section className={card}>
                  <h2 className="text-base font-semibold">{c('wentWell')}</h2>
                  <p className="mt-1 text-lg">{view.strength}</p>
                </section>
              ) : null}
              {view.practise.length > 0 ? (
                <section className={card}>
                  <h2 className="text-base font-semibold">{c('toPractise')}</h2>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-lg">
                    {view.practise.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </section>
              ) : null}
              <section className={card}>
                <p className="text-base">
                  {view.final
                    ? c('final')
                    : `${c('notFinal')} ${day(view.windowClosesAt)}. ${c('askSchool')} ${day(view.windowClosesAt)}.`}
                </p>
              </section>
            </>
          ) : (
            <section className={card}>
              <h2 className="text-base font-semibold">{c('focusTitle')}</h2>
              {view.focus.length === 0 ? (
                <p className="mt-1 text-base">{c('focusEmpty')}</p>
              ) : (
                <ol className="mt-1 list-decimal space-y-1 pl-5 text-lg">
                  {view.focus.map((f) => (
                    <li key={`${f.kind}-${f.title}`}>
                      {f.kind === 'habit' && f.habit ? tr(lang, `habit_${f.habit}` as Key) : f.title}
                    </li>
                  ))}
                </ol>
              )}
            </section>
          )}
          <p className="px-1 text-sm text-slate-600 dark:text-slate-400">
            {c('validUntil')} {day(view.expiresAt)}. {c('readOnly')}
          </p>
        </div>
      )}
    </main>
  )
}
