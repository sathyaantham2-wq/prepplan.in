import { Link, createFileRoute } from '@tanstack/react-router'
import { ExamReport } from '../../../../components/school/progress-screens'
import { Toggles, muted, useDarkMode } from '../../../../components/school/progress-ui'
import { useLang } from '../../../../lib/school-i18n'

export const Route = createFileRoute('/school/$schoolId/progress/exam/$paperId')({
  validateSearch: (s: Record<string, unknown>): { child?: string } => ({
    child: typeof s.child === 'string' ? s.child : undefined,
  }),
  component: ExamPage,
})

// One exam's report, insight first (owner direction 2026-10-31).
function ExamPage() {
  const { schoolId, paperId } = Route.useParams()
  const { child } = Route.useSearch()
  const [lang, setLang, t] = useLang()
  const [dark, toggleDark] = useDarkMode()
  return (
    <div className="space-y-4">
      <Toggles lang={lang} setLang={setLang} dark={dark} toggleDark={toggleDark} t={t} />
      <Link
        to="/school/$schoolId/progress"
        params={{ schoolId }}
        search={child ? { child } : {}}
        className={`inline-flex min-h-11 items-center text-base font-semibold underline ${muted}`}
      >
        {t('back')}
      </Link>
      <ExamReport schoolId={schoolId} paperId={paperId} lang={lang} t={t} child={child ?? null} />
    </div>
  )
}
