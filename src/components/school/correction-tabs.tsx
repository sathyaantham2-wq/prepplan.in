import { Link } from '@tanstack/react-router'
import { useSchool } from './context'

// The two views of AI correction (owner decision 2026-11-03): where every sheet stands (the exam-week board, for the
// office) and the papers themselves. A teacher only has the papers; the principal only the board, so neither sees tabs.
export function CorrectionTabs({ at }: { at: 'board' | 'papers' }) {
  const { schoolId, overview } = useSchool()
  if (overview.role !== 'school_admin') return null
  const tab = (on: boolean) =>
    `inline-flex min-h-11 items-center border-b-2 px-3 text-[15px] font-semibold ${on ? 'border-emerald-700 text-emerald-800' : 'border-transparent text-slate-600 hover:text-slate-900'}`
  return (
    <nav aria-label="AI correction" className="flex gap-2 border-b border-slate-200" data-testid="correction-tabs">
      <Link to="/school/$schoolId/board" params={{ schoolId }} className={tab(at === 'board')} aria-current={at === 'board' ? 'page' : undefined}>
        Where sheets stand
      </Link>
      <Link to="/school/$schoolId/own-papers" params={{ schoolId }} className={tab(at === 'papers')} aria-current={at === 'papers' ? 'page' : undefined}>
        Papers
      </Link>
    </nav>
  )
}
