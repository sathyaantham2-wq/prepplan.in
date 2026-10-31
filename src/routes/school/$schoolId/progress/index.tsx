import { useEffect, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useSchool } from '../../../../components/school/context'
import { HomeTab, HabitsTab, ShareButtons, SubjectsTab, TopicsTab } from '../../../../components/school/progress-screens'
import type { Progress } from '../../../../components/school/progress-screens'
import { Toggles, Who, muted, useDarkMode } from '../../../../components/school/progress-ui'
import { api } from '../../../../lib/school-client'
import { useLang } from '../../../../lib/school-i18n'
import type { Key } from '../../../../lib/school-i18n'

type Tab = 'home' | 'subjects' | 'topics' | 'habits'
const TABS: Array<{ id: Tab; label: Key }> = [
  { id: 'home', label: 'progress' },
  { id: 'subjects', label: 'subjects' },
  { id: 'topics', label: 'topics' },
  { id: 'habits', label: 'tabHabits' },
]

export const Route = createFileRoute('/school/$schoolId/progress/')({
  validateSearch: (s: Record<string, unknown>): { tab?: Tab; child?: string } => ({
    tab: TABS.some((t) => t.id === s.tab) ? (s.tab as Tab) : undefined,
    child: typeof s.child === 'string' ? s.child : undefined,
  }),
  component: ProgressPage,
})

// The Progress Report for a school student or a parent (owner direction 2026-10-31): five screens, all from
// locked marks only. English or Telugu, light or dark.
function ProgressPage() {
  const { schoolId } = useSchool()
  const { tab = 'home', child } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const [lang, setLang, t] = useLang()
  const [dark, toggleDark] = useDarkMode()
  const [d, setD] = useState<Progress | null>(null)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    void api<Progress>(`/api/schools/${schoolId}/progress${child ? `?child=${child}` : ''}`)
      .then(setD)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Something went wrong.'))
  }, [schoolId, child])
  if (error) return <p className="text-base text-red-700 dark:text-red-300">{error}</p>
  if (!d) return <p className={`text-base ${muted}`}>{t('loading')}</p>
  return (
    <div className="space-y-4" data-testid="progress">
      <Toggles lang={lang} setLang={setLang} dark={dark} toggleDark={toggleDark} t={t} />
      <Who name={d.viewer.name} grade={d.viewer.grade} section={d.viewer.sectionName} school={d.viewer.schoolName} />
      {d.children.length > 1 ? (
        <div className="flex flex-wrap gap-2" role="group" aria-label={t('yourChild')}>
          {d.children.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => void navigate({ search: { tab, child: c.id } })}
              className="min-h-11 rounded-xl border border-slate-300 px-3 text-base font-semibold dark:border-slate-600 dark:text-slate-100"
            >
              {c.name}
            </button>
          ))}
        </div>
      ) : null}
      <div role="tablist" aria-label={t('progress')} className="grid grid-cols-4 gap-1 rounded-2xl bg-slate-100 p-1 dark:bg-slate-800">
        {TABS.map((x) => (
          <button
            key={x.id}
            type="button"
            role="tab"
            aria-selected={tab === x.id}
            onClick={() => void navigate({ search: { tab: x.id, child } })}
            className={`min-h-11 rounded-xl px-1 text-[15px] font-semibold ${tab === x.id ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-slate-100' : 'text-slate-600 dark:text-slate-300'}`}
          >
            {t(x.label)}
          </button>
        ))}
      </div>
      {tab === 'home' ? <HomeTab d={d} schoolId={schoolId} lang={lang} t={t} child={child ?? null} /> : null}
      {tab === 'subjects' ? <SubjectsTab d={d} t={t} /> : null}
      {tab === 'topics' ? <TopicsTab d={d} t={t} /> : null}
      {tab === 'habits' ? <HabitsTab d={d} t={t} /> : null}
      {d.hasData ? <ShareButtons schoolId={schoolId} lang={lang} t={t} child={child ?? null} /> : null}
    </div>
  )
}
