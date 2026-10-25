import { useEffect, useMemo, useRef, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from '../components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card'
import { Label } from '../components/ui/label'
import { AppShell } from '../components/app-shell'
import { useSession } from '../lib/auth-client'
import { DEFAULT_THEME } from '../lib/pdf/themes'
import { PaperStylePicker } from '../components/paper-style'
import { PageLoading } from '../components/page-loading'
import { TopicSearchBox } from '../components/topic-search-box'
import type { TopicSubject, TopicSuggestion } from '../lib/topic-search'
import { PaperBuilderA } from '../components/paper-builder/layout-a'
import { PaperBuilderB } from '../components/paper-builder/layout-b'
import { LayoutSwitcher } from '../components/paper-builder/layout-switcher'
import type { PaperBuilderProps } from '../components/paper-builder/types'
import {
  normaliseLayoutParam,
  parseLayout,
  showLayoutSwitcher,
} from '../lib/paper-builder-view'
import type { BuilderLayout } from '../lib/paper-builder-view'
import {
  InstallAppDialog,
  useInstallOffer,
} from '../components/install-app-dialog'

const INSTALL_OFFER_KEY = 'prepplan-install-offer-generate'

export const Route = createFileRoute('/my-paper')({
  component: MyPaper,
  // chapters / concepts (comma-separated ids) arrive from "Practise this chapter" and "Practise
  // this concept" on the student's mastery view.
  validateSearch: (
    search: Record<string, unknown>,
  ): {
    subject?: string
    chapters?: string
    concepts?: string
    layout?: string
  } => ({
    subject: typeof search.subject === 'string' ? search.subject : undefined,
    chapters: typeof search.chapters === 'string' ? search.chapters : undefined,
    concepts: typeof search.concepts === 'string' ? search.concepts : undefined,
    // ?layout=a|b previews the alternative builder layouts; anything else is the classic one.
    layout: normaliseLayoutParam(search.layout),
  }),
})

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
function idList(value: string | undefined): Array<string> {
  return (value ?? '').split(',').filter((id) => UUID.test(id))
}

// Mirrors src/lib/adaptive/plan.ts's QUESTION_COUNT_OPTIONS -- kept as a local literal rather
// than an import, since that file pulls in server-only modules (db/connection, pg) that must
// never end up in the client bundle.
const QUESTION_COUNT_OPTIONS = [10, 15, 30] as const

const QUESTION_TYPES = [
  { value: 'combined', label: 'Combined' },
  { value: 'mcq', label: 'Multiple choice' },
  { value: 'written', label: 'Written' },
] as const
type QuestionType = (typeof QUESTION_TYPES)[number]['value']

// Small field icons for the paper settings card -- same inline-SVG convention as the rest of
// the app (no icon library), one per field so each reads at a glance rather than by label text
// alone, matching the reference design.
function BookIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
    </svg>
  )
}
function HashIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 9h14M5 15h14M10 3 8 21M16 3l-2 18" />
    </svg>
  )
}
function ListIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  )
}
function ResetIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 3v5h5" />
    </svg>
  )
}
function BulbIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.5 10.9c.4.3.5.8.5 1.3V16h6v-.8c0-.5.1-1 .5-1.3A6 6 0 0 0 12 3Z" />
    </svg>
  )
}
function SearchIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}
function ChevronIcon({ up }: { up: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-transform ${up ? '' : 'rotate-180'}`}
    >
      <path d="m18 15-6-6-6 6" />
    </svg>
  )
}
function ChevronRightIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}
function CheckIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

// Colour per part -- cycles for however many parts a subject has (matches the reference design's
// blue Part I / green Part II exactly for the common 2-part case; amber/purple cover a third or
// fourth part rather than reusing blue, which would make two different parts look like one).
const PART_COLORS = [
  {
    badge: 'bg-blue-600',
    header: 'bg-blue-50 dark:bg-blue-950/40',
    pill: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200',
    row: 'bg-blue-50/60 border-blue-200 dark:bg-blue-950/30 dark:border-blue-900',
  },
  {
    badge: 'bg-emerald-600',
    header: 'bg-emerald-50 dark:bg-emerald-950/40',
    pill: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200',
    row: 'bg-emerald-50/60 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900',
  },
  {
    badge: 'bg-amber-600',
    header: 'bg-amber-50 dark:bg-amber-950/40',
    pill: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200',
    row: 'bg-amber-50/60 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900',
  },
  {
    badge: 'bg-purple-600',
    header: 'bg-purple-50 dark:bg-purple-950/40',
    pill: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200',
    row: 'bg-purple-50/60 border-purple-200 dark:bg-purple-950/30 dark:border-purple-900',
  },
] as const

interface ProfileSubject {
  id: string
  name: string
  has_content: boolean
}

interface PlanConcept {
  concept_id: string
  concept_name: string
  chapter_name: string
  level_name: string
  mastery_score: number | null
  mastery_level: string | null
  questions_planned: number
  reasons: Array<string>
}

interface Plan {
  subject_name: string
  is_initial_assessment: boolean
  chapters: Array<{
    id: string
    name: string
    part: string
    chapter_no: number
  }>
  concepts: Array<PlanConcept>
  total_questions: number
  total_marks: number
  difficulty_range: { min: string; max: string }
  estimated_minutes: number
  question_types: Array<string>
  // Set when the subject has a school-exam-standard paper: fixed sections and marks, no choice of
  // question count, type or difficulty.
  school_paper?: { name: string; total_marks: number; duration_min: number; draft: boolean } | null
}

interface ChapterChoice {
  id: string
  name: string
  part: string
  chapter_no: number
}

// "Generate My Question Paper": the recommendation comes from her own concept mastery. She can
// accept it as it is, or change the chapters, then start the test.
function MyPaper() {
  const { data: session, isPending } = useSession()
  const navigate = useNavigate()
  const search = Route.useSearch()
  const role = (session?.user as { role?: string } | undefined)?.role

  const [subjects, setSubjects] = useState<Array<ProfileSubject>>([])
  const [subjectId, setSubjectId] = useState('')
  const [allChapters, setAllChapters] = useState<Array<ChapterChoice>>([])
  const [chapterIds, setChapterIds] = useState<Array<string> | null>(null)
  const [chapterSearch, setChapterSearch] = useState('')
  // Parts start closed (2026-10-03 request): she opens the one she wants. While she is searching
  // the matching chapters always show, so a search never looks like it found nothing.
  const [expandedParts, setExpandedParts] = useState<Set<string>>(new Set())
  const [plan, setPlan] = useState<Plan | null>(null)
  // Average mastery (0-100) per chapter and subject, from the same overview as the topic search;
  // only the alternative layouts show it. recommendedIds is the chapters the app chose for her
  // for the current subject (null when the selection came from a link or has not loaded).
  const [chapterMastery, setChapterMastery] = useState<
    Record<string, number | null>
  >({})
  const [subjectMastery, setSubjectMastery] = useState<
    Record<string, number | null>
  >({})
  const [recommendedIds, setRecommendedIds] = useState<Array<string> | null>(
    null,
  )
  const [chapterQuery, setChapterQuery] = useState('')
  const [loadingPlan, setLoadingPlan] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [starting, setStarting] = useState(false)
  // A paper narrowed to particular concepts. Kept in a ref as well, because loadPlan is called
  // from handlers that must see the value they have just set.
  const [focusConceptIds, setFocusConceptIds] = useState<Array<string>>([])
  const focusRef = useRef<Array<string>>([])
  // The chapter/concept she came here to practise is applied to the first subject shown only;
  // changing the subject afterwards starts from the normal recommendation.
  const linkedFocusUsed = useRef(false)
  function setFocus(ids: Array<string>) {
    focusRef.current = ids
    setFocusConceptIds(ids)
  }
  const installOffer = useInstallOffer(INSTALL_OFFER_KEY)
  const [showInstall, setShowInstall] = useState(false)
  // Topic search: the subjects, chapters and concepts she can practise, from the same overview
  // the home screen uses (ids, names and numbers only -- no question text, no answers).
  const [topicSubjects, setTopicSubjects] = useState<Array<TopicSubject>>([])
  // A chapter picked from the search that belongs to another subject: applied once that
  // subject's chapters have loaded (the subject effect reads it).
  const pendingChapterRef = useRef<string | null>(null)
  const [focusGenerate, setFocusGenerate] = useState(false)
  const generateButtonRef = useRef<HTMLButtonElement>(null)
  const [installAsked, setInstallAsked] = useState(false)
  // No F-number covers the adaptive layer itself yet (see memory examprep_adaptive_learning.md).
  // The theme picker was removed from this screen at the user's request -- every paper from here
  // still renders through the same already-Done F034/F120 theme pack pipeline, just fixed to the
  // default theme rather than exposing a choice.

  // Real, student-driven controls -- unlike the theme, these actually change what gets generated
  // (buildPaperPlan honours all three; difficulty_ceiling already worked for adaptive papers
  // before this screen exposed it, same as /generate's F119 selector).
  const [questionCount, setQuestionCount] =
    useState<(typeof QUESTION_COUNT_OPTIONS)[number]>(10)
  const [questionType, setQuestionType] = useState<QuestionType>('combined')
  // Paper style: the default is always free; the others are unlocked with coins (/rewards). The
  // server falls back to the default for any theme she has not unlocked.
  const [theme, setTheme] = useState<string>(DEFAULT_THEME)

  useEffect(() => {
    if (isPending) return
    if (!session || role !== 'student') {
      navigate({ to: '/' })
      return
    }
    fetch('/api/students/me/profile')
      .then((r) => r.json())
      .then(
        (data: {
          profile: { board: string; class: number }
          options: Array<{
            board: string
            class: number
            subjects: Array<ProfileSubject>
          }>
        }) => {
          // F132: a Civil Services student has her own New paper screen.
          if (data.profile.board === 'CIVILS') {
            void navigate({ to: '/civil-paper' })
            return
          }
          // Every subject offered for her board + class, not just the ones she pre-selected
          // during profile setup -- picking a subject now happens right here, at generation
          // time, instead of being locked in earlier.
          const offered =
            data.options.find(
              (o) =>
                o.board === data.profile.board &&
                o.class === data.profile.class,
            )?.subjects ?? []
          setSubjects(offered)
          const preferred = offered.find(
            (s) => s.id === search.subject && s.has_content,
          )
          const first = preferred ?? offered.find((s) => s.has_content)
          if (first) setSubjectId(first.id)
        },
      )
  }, [isPending, session, role, navigate, search.subject])

  useEffect(() => {
    if (isPending || !session || role !== 'student') return
    fetch('/api/adaptive/overview')
      .then((r) => (r.ok ? r.json() : null))
      .then(
        (
          data: {
            subjects: Array<{
              subject_id: string
              subject_name: string
              has_content: boolean
              average_mastery: number | null
              chapters: Array<{
                chapter_id: string
                average_mastery: number | null
                chapter_name: string
                part: string
                chapter_no: number
                concepts: Array<{ concept_id: string; concept_name: string }>
              }>
            }>
          } | null,
        ) => {
          if (!data) return
          const chapterScores: Record<string, number | null> = {}
          const subjectScores: Record<string, number | null> = {}
          for (const s of data.subjects) {
            subjectScores[s.subject_id] = s.average_mastery
            for (const c of s.chapters)
              chapterScores[c.chapter_id] = c.average_mastery
          }
          setChapterMastery(chapterScores)
          setSubjectMastery(subjectScores)
          setTopicSubjects(
            data.subjects
              .filter((s) => s.has_content)
              .map((s) => ({
                id: s.subject_id,
                name: s.subject_name,
                chapters: s.chapters.map((c) => ({
                  id: c.chapter_id,
                  name: c.chapter_name,
                  part: c.part,
                  chapterNo: c.chapter_no,
                  concepts: c.concepts.map((k) => ({
                    id: k.concept_id,
                    name: k.concept_name,
                  })),
                })),
              })),
          )
        },
      )
      .catch(() => {
        // The search box is a shortcut; the normal controls still work without it.
      })
  }, [isPending, session, role])

  useEffect(() => {
    setPlan(null)
    setChapterIds(null)
    setRecommendedIds(null)
    setAllChapters([])
    if (!subjectId) return
    fetch(`/api/syllabus/chapters?subject_id=${subjectId}`)
      .then((r) => r.json())
      .then((data: Array<ChapterChoice>) => setAllChapters(data))
    const pickedChapter = pendingChapterRef.current
    pendingChapterRef.current = null
    const linkedChapters = pickedChapter
      ? [pickedChapter]
      : linkedFocusUsed.current
        ? []
        : idList(search.chapters)
    const linkedConcepts =
      pickedChapter || linkedFocusUsed.current ? [] : idList(search.concepts)
    linkedFocusUsed.current = true
    setFocus(linkedConcepts)
    if (linkedChapters.length > 0) setChapterIds(linkedChapters)
    void loadPlan(
      subjectId,
      linkedChapters.length > 0 ? linkedChapters : null,
      questionCount,
      questionType,
    )
    // Only the subject should reset chapters and re-fetch them -- questionCount/questionType
    // changes reuse the current chapter selection via their own handlers (updateQuestionCount/
    // updateQuestionType below) instead of an effect, so they're deliberately not dependencies
    // here.
  }, [subjectId])

  async function loadPlan(
    subject: string,
    chapters: Array<string> | null,
    count: number,
    type: QuestionType,
  ) {
    setLoadingPlan(true)
    setError(null)
    try {
      const query = new URLSearchParams({
        subject_id: subject,
        question_count: String(count),
        question_type: type,
      })
      if (chapters && chapters.length > 0)
        query.set('chapter_ids', chapters.join(','))
      if (focusRef.current.length > 0)
        query.set('concept_ids', focusRef.current.join(','))
      const response = await fetch(`/api/adaptive/plan?${query}`)
      const body = await response.json()
      if (!response.ok) {
        setPlan(null)
        setError(body.message ?? 'Could not prepare your paper.')
        return
      }
      setPlan(body)
      if (chapters === null) {
        const picked = body.chapters.map((c: { id: string }) => c.id)
        setChapterIds(picked)
        setRecommendedIds(picked)
      }
    } finally {
      setLoadingPlan(false)
    }
  }

  function toggleChapter(id: string) {
    const current = chapterIds ?? []
    const next = current.includes(id)
      ? current.filter((c) => c !== id)
      : [...current, id]
    setFocus([])
    setChapterIds(next)
    // A momentarily-empty selection (the last box unchecked, or Clear All) just isn't sent to
    // GET /api/adaptive/plan -- an empty chapter_ids param is indistinguishable from "none given"
    // there, which would silently fall back to the server's own recommended chapters rather than
    // genuinely showing zero. readyToGenerate (chapterIds.length > 0) blocks generating instead.
    if (next.length > 0)
      void loadPlan(subjectId, next, questionCount, questionType)
  }

  // A suggestion from the search box: same result as choosing the subject and then ticking that
  // one chapter. Nothing is generated; the Generate button just receives focus once the plan has
  // loaded, so it is one tap away.
  function selectTopic(s: TopicSuggestion) {
    setFocusGenerate(true)
    setExpandedParts((prev) => new Set(prev).add(s.part))
    if (s.subjectId === subjectId) {
      setFocus([])
      setChapterIds([s.chapterId])
      void loadPlan(subjectId, [s.chapterId], questionCount, questionType)
    } else {
      pendingChapterRef.current = s.chapterId
      setSubjectId(s.subjectId)
    }
  }

  useEffect(() => {
    if (!focusGenerate || loadingPlan || !plan || starting) return
    const button = generateButtonRef.current
    // A layout without a Generate button on this screen (Layout B, before its last step) has
    // nothing to focus: drop the request rather than steal focus later.
    if (!button) {
      setFocusGenerate(false)
      return
    }
    if (button.disabled) return
    button.focus({ preventScroll: true })
    button.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    setFocusGenerate(false)
  }, [focusGenerate, loadingPlan, plan, starting])

  function selectAllChapters() {
    const all = allChapters.map((c) => c.id)
    setFocus([])
    setChapterIds(all)
    void loadPlan(subjectId, all, questionCount, questionType)
  }

  function clearAllChapters() {
    setFocus([])
    setChapterIds([])
  }

  // Drops the concept focus but keeps the chapters, so the paper covers those chapters in full.
  function practiseWholeChapters() {
    setFocus([])
    if (subjectId)
      void loadPlan(subjectId, chapterIds, questionCount, questionType)
  }

  function togglePartCollapsed(part: string) {
    setExpandedParts((prev) => {
      const next = new Set(prev)
      if (next.has(part)) next.delete(part)
      else next.add(part)
      return next
    })
  }

  function updateQuestionCount(count: (typeof QUESTION_COUNT_OPTIONS)[number]) {
    setQuestionCount(count)
    if (subjectId) void loadPlan(subjectId, chapterIds, count, questionType)
  }

  function updateQuestionType(type: QuestionType) {
    setQuestionType(type)
    if (subjectId) void loadPlan(subjectId, chapterIds, questionCount, type)
  }

  function resetPreferences() {
    setQuestionCount(10)
    setQuestionType('combined')
    if (subjectId) void loadPlan(subjectId, chapterIds, 10, 'combined')
  }

  // Generating a paper is the moment she has decided to use the app, so it is where the install
  // is offered (2026-10-02 request). Asked once; the paper is generated whichever way she answers.
  function handleGenerate() {
    if (installOffer && !installAsked) {
      setInstallAsked(true)
      setShowInstall(true)
    } else void startTest()
  }

  async function startTest() {
    if (!plan || !chapterIds) return
    setStarting(true)
    setError(null)
    try {
      const generated = await fetch('/api/papers/generate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          adaptive: true,
          subject_id: subjectId,
          chapter_ids: chapterIds,
          ...(focusConceptIds.length > 0
            ? { concept_ids: focusConceptIds }
            : {}),
          theme,
          adaptive_question_count: questionCount,
          adaptive_question_type: questionType,
        }),
      })
      const paper = await generated.json()
      if (!generated.ok) {
        setError(
          paper.message ??
            (typeof paper.error === 'string'
              ? paper.error
              : 'Could not create the paper.'),
        )
        return
      }
      if (paper.paperQuestions.length === 0) {
        setError(
          'The question bank ran short for these chapters right now. Try other chapters or try again later.',
        )
        return
      }
      const attempt = await fetch('/api/attempts', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ paper_id: paper.paper.id, mode: 'online' }),
      })
      const started = await attempt.json()
      if (!attempt.ok) {
        setError(
          typeof started.error === 'string'
            ? started.error
            : 'Could not start the test.',
        )
        return
      }
      await navigate({ to: '/attempt/$id', params: { id: started.id } })
    } finally {
      setStarting(false)
    }
  }

  // Grouped by part (same reasoning as /generate.tsx: chapter identity is (book, part, number),
  // never the number alone -- Ganita Prakash repeats chapter numbers across parts). Search filters
  // within that same grouped structure; Select All / Clear All always act on every chapter, not
  // just what's currently visible, so the "N selected" count never surprises her mid-search.
  const chaptersByPart = useMemo(() => {
    const query = chapterSearch.trim().toLowerCase()
    const matches = query
      ? allChapters.filter((c) => c.name.toLowerCase().includes(query))
      : allChapters
    const groups: Array<{ part: string; chapters: Array<ChapterChoice> }> = []
    for (const c of matches) {
      let group = groups.find((g) => g.part === c.part)
      if (!group) {
        group = { part: c.part, chapters: [] }
        groups.push(group)
      }
      group.chapters.push(c)
    }
    return groups
  }, [allChapters, chapterSearch])

  if (isPending || !session || role !== 'student') {
    return <PageLoading />
  }

  // ?layout=a|b: alternative builder layouts for comparison. No parameter is the classic layout,
  // exactly as before. Read from the router's search params, so server and client agree.
  const layout = parseLayout(search.layout)
  const classic = layout === 'classic'
  function setLayout(next: BuilderLayout) {
    // The search box remounts empty, so its filter must not outlive it.
    setChapterQuery('')
    void navigate({
      to: '/my-paper',
      search: (prev) => ({ ...prev, layout: next }),
      replace: true,
    })
  }

  const withContent = subjects.filter((s) => s.has_content)

  // chapterIds === null means "not loaded yet" (the server picks her chapters); an empty array
  // means she actively cleared them, which is the only case worth calling out to her.
  const noChaptersSelected = chapterIds !== null && chapterIds.length === 0
  const readyToGenerate =
    Boolean(plan) && Boolean(chapterIds) && (chapterIds?.length ?? 0) > 0

  const builderProps: PaperBuilderProps = {
    subjects: withContent.map((s) => ({
      id: s.id,
      name: s.name,
      mastery: subjectMastery[s.id] ?? null,
    })),
    subjectId,
    onSubject: setSubjectId,
    countOptions: QUESTION_COUNT_OPTIONS,
    questionCount,
    onQuestionCount: (n) =>
      updateQuestionCount(n as (typeof QUESTION_COUNT_OPTIONS)[number]),
    questionType,
    onQuestionType: updateQuestionType,
    plan,
    loadingPlan,
    starting,
    error,
    chapters: allChapters.map((c) => ({
      id: c.id,
      name: c.name,
      part: c.part,
      chapter_no: c.chapter_no,
      mastery: chapterMastery[c.id] ?? null,
    })),
    selectedChapterIds: chapterIds ?? [],
    recommendedChapterIds: recommendedIds,
    onToggleChapter: toggleChapter,
    onSelectAllChapters: selectAllChapters,
    onClearChapters: clearAllChapters,
    chapterQuery,
    onChapterQuery: setChapterQuery,
    topicSubjects,
    onSelectTopic: selectTopic,
    readyToGenerate,
    onGenerate: handleGenerate,
    onReset: resetPreferences,
    generateButtonRef,
    styleSlot: <PaperStylePicker value={theme} onChange={setTheme} />,
  }

  return (
    <AppShell variant="student" active="generate">
      <div className="mx-auto max-w-5xl p-4 sm:p-8">
        {/* 2026-10-01 (owner request): one short heading and one line. The old hero card (three
          marketing chips, an icon) plus a second "Assessment Details" heading pushed the form
          below the fold on a phone; now Subject is on the first screen. Same word, "paper",
          everywhere: heading, button and progress text. */}
        <div className="mb-4">
          <h1 className="display-title text-[1.6rem] leading-tight font-bold tracking-tight">
            New paper
          </h1>
          <p className="text-small text-muted-foreground mt-1">
            Mixes what you already know with what needs more practice.
          </p>
        </div>

        {subjects.length > 0 && withContent.length === 0 && (
          <Card>
            <CardContent className="text-body pt-6 text-muted-foreground">
              Practice papers for your subjects are coming soon.{' '}
              <a
                href="/profile-setup"
                className="text-primary underline-offset-4 hover:underline"
              >
                Change subjects
              </a>
            </CardContent>
          </Card>
        )}

        {withContent.length > 0 && !classic && (
          <div className="mb-4">
            {layout === 'a' ? (
              <PaperBuilderA {...builderProps} />
            ) : (
              <PaperBuilderB {...builderProps} />
            )}
          </div>
        )}

        {withContent.length > 0 && classic && (
          // No card heading: the page heading says what this is, and the question count and time
          // are in the sticky bar below (2026-10-01). The Time field stays removed -- it was only
          // ever derived from the question count.
          <Card className="mb-4 py-4">
            <CardContent className="px-4">
              {/* Single row from `lg` up (matches the reference design), stacking to 2 then 1
                  column below that -- 4 items never fit one line on a phone or portrait tablet
                  without becoming unreadable, so this is "single line" on desktop, gracefully
                  wrapped everywhere narrower. */}
              <TopicSearchBox subjects={topicSubjects} onSelect={selectTopic} />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-1">
                  <Label
                    htmlFor="my-paper-subject"
                    className="text-muted-foreground text-xs flex items-center gap-1.5"
                  >
                    <BookIcon />
                    Subject
                  </Label>
                  <select
                    id="my-paper-subject"
                    className="border-input flex h-8 w-full rounded-md border bg-transparent px-2 text-sm shadow-xs"
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                  >
                    {withContent.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="my-paper-questions"
                    className="text-muted-foreground text-xs flex items-center gap-1.5"
                  >
                    <HashIcon />
                    Questions
                  </Label>
                  <select
                    id="my-paper-questions"
                    className="border-input flex h-8 w-full rounded-md border bg-transparent px-2 text-sm shadow-xs"
                    value={questionCount}
                    onChange={(e) =>
                      updateQuestionCount(
                        Number(
                          e.target.value,
                        ) as (typeof QUESTION_COUNT_OPTIONS)[number],
                      )
                    }
                  >
                    {QUESTION_COUNT_OPTIONS.map((n) => (
                      <option key={n} value={n}>
                        {n} questions
                      </option>
                    ))}
                  </select>
                </div>

                {!plan?.school_paper && (
                <div className="space-y-1">
                  <Label
                    htmlFor="my-paper-question-type"
                    className="text-muted-foreground text-xs flex items-center gap-1.5"
                  >
                    <ListIcon />
                    Question type
                  </Label>
                  <select
                    id="my-paper-question-type"
                    className="border-input flex h-8 w-full rounded-md border bg-transparent px-2 text-sm shadow-xs"
                    value={questionType}
                    onChange={(e) =>
                      updateQuestionType(e.target.value as QuestionType)
                    }
                  >
                    {QUESTION_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
                )}
                {plan?.school_paper && (
                  <p className="text-caption text-muted-foreground col-span-full">
                    Your questions are written in the style of school exams: multiple choice, short and long answers, and case studies.
                  </p>
                )}
                <PaperStylePicker value={theme} onChange={setTheme} />
              </div>

              {/* Only the no-chapters-selected guard remains here now -- the plan-summary
                  sentence ("This paper will have N questions...") was removed at the user's
                  request (2026-09-24); this one stays because it explains an otherwise
                  unexplained disabled button, the same reason it was added in the first place. */}
              {noChaptersSelected && (
                <p className="text-caption bg-destructive/10 text-destructive mt-3 flex items-start gap-2 rounded-md p-2.5">
                  <span className="shrink-0 pt-0.5">
                    <BulbIcon />
                  </span>
                  Pick at least one chapter below to generate a paper.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {plan && focusConceptIds.length > 0 && (
          <Card className="border-primary/40 mb-4">
            <CardContent className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="field-label">Focused practice</p>
                <p className="text-body font-medium">
                  {plan.concepts.map((c) => c.concept_name).join(' · ')}
                </p>
                <p className="text-small text-muted-foreground">
                  This paper asks only about{' '}
                  {plan.concepts.length === 1
                    ? 'this concept'
                    : 'these concepts'}
                  .
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={practiseWholeChapters}
              >
                Practise the whole chapter instead
              </Button>
            </CardContent>
          </Card>
        )}

        {plan && classic && (
          <div className="space-y-4">
            {allChapters.length > 1 && (
              <Card>
                <CardHeader>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 text-primary mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg">
                        <BookIcon />
                      </div>
                      <div>
                        <CardTitle className="text-h3">
                          Select Chapters
                        </CardTitle>
                        <CardDescription>
                          We picked these for you. You can change them anytime.
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-caption bg-primary/10 text-primary rounded-full px-3 py-1.5 font-medium">
                        {(chapterIds ?? []).length} selected
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={selectAllChapters}
                      >
                        Select All
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-destructive border-destructive/40 hover:bg-destructive/10"
                        onClick={clearAllChapters}
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>

                  <div className="border-input mt-4 flex h-9 items-center gap-2 rounded-md border px-3">
                    <span className="text-muted-foreground shrink-0">
                      <SearchIcon />
                    </span>
                    <input
                      type="text"
                      value={chapterSearch}
                      onChange={(e) => setChapterSearch(e.target.value)}
                      placeholder="Search chapters…"
                      className="placeholder:text-muted-foreground w-full bg-transparent text-sm outline-none"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  {chaptersByPart.length === 0 && (
                    <p className="text-small text-muted-foreground">
                      No chapter matches "{chapterSearch}".
                    </p>
                  )}
                  <div className="grid gap-4 sm:grid-cols-2">
                    {chaptersByPart.map((group, i) => {
                      const colors = PART_COLORS[i % PART_COLORS.length]
                      const selectedInPart = group.chapters.filter((c) =>
                        (chapterIds ?? []).includes(c.id),
                      ).length
                      const collapsed =
                        !expandedParts.has(group.part) &&
                        chapterSearch.trim() === ''
                      return (
                        <div
                          key={group.part}
                          className="border-border overflow-hidden rounded-lg border"
                        >
                          <button
                            type="button"
                            onClick={() => togglePartCollapsed(group.part)}
                            aria-expanded={!collapsed}
                            className={`flex w-full items-center gap-3 px-4 py-3 text-left ${colors.header}`}
                          >
                            <span
                              className={`flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${colors.badge}`}
                            >
                              {group.part}
                            </span>
                            <span className="text-body flex-1 font-semibold">
                              Part {group.part}
                            </span>
                            <span className="text-small text-muted-foreground">
                              {selectedInPart} / {group.chapters.length}
                            </span>
                            <ChevronIcon up={!collapsed} />
                          </button>

                          {!collapsed && (
                            <div className="divide-border divide-y">
                              {group.chapters.map((c) => {
                                const selected = (chapterIds ?? []).includes(
                                  c.id,
                                )
                                return (
                                  <label
                                    key={c.id}
                                    // The real checkbox is sr-only (a custom tick replaces it),
                                    // so the row itself has to carry the focus ring -- same
                                    // has-[:focus-visible] pattern /generate.tsx uses -- or this
                                    // list becomes invisible to keyboard users.
                                    className={`has-[:focus-visible]:ring-ring flex cursor-pointer items-center gap-3 border-l-2 px-4 py-2.5 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-inset ${
                                      selected
                                        ? colors.row
                                        : 'hover:bg-muted/50 border-transparent'
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={selected}
                                      onChange={() => toggleChapter(c.id)}
                                      className="sr-only"
                                    />
                                    <span
                                      className={`flex size-4 shrink-0 items-center justify-center rounded border-2 ${
                                        selected
                                          ? `${colors.badge} border-transparent text-white`
                                          : 'border-input text-transparent'
                                      }`}
                                      aria-hidden="true"
                                    >
                                      <CheckIcon />
                                    </span>
                                    <span
                                      className={`text-small flex size-6 shrink-0 items-center justify-center rounded-full font-medium ${
                                        selected
                                          ? colors.pill
                                          : 'bg-muted text-muted-foreground'
                                      }`}
                                    >
                                      {c.chapter_no}
                                    </span>
                                    <span className="text-small flex-1">
                                      {c.name}
                                    </span>
                                    <span className="text-muted-foreground shrink-0">
                                      <ChevronRightIcon />
                                    </span>
                                  </label>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  <p className="text-small text-muted-foreground mt-4">
                    {(chapterIds ?? []).length} chapter
                    {(chapterIds ?? []).length === 1 ? '' : 's'} selected. You
                    can modify your selection anytime.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* "What this paper covers" (plan.concepts breakdown) is intentionally hidden
                here at the user's request -- the data is still fetched and used elsewhere
                on this screen (summary fields above), just not rendered as its own table.
                "Generate paper" and its error display live in the sticky action bar at
                the bottom of this page. */}
          </div>
        )}

        {/* Sticky action bar (2026-09-30 UX rework): the generate button used to sit inside the
          settings card, above the chapter list -- so after picking chapters she had to
          scroll back up to find it. It now stays in view at the bottom of the screen the whole
          time, above the phone tab bar, with the same Reset and error display it had before. */}
        {withContent.length > 0 && classic && (
          <div data-builder-bar className="no-print bg-card/95 border-border sticky bottom-[calc(60px+env(safe-area-inset-bottom))] z-10 mt-4 rounded-xl border p-3 shadow-lg backdrop-blur lg:bottom-4">
            {error && (
              <p className="text-small text-destructive mb-2" role="alert">
                {error}
              </p>
            )}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-small text-muted-foreground">
                {(chapterIds ?? []).length} chapter
                {(chapterIds ?? []).length === 1 ? '' : 's'}
                {plan?.school_paper
                  ? ` · ${plan.total_questions} questions · ${plan.school_paper.total_marks} marks · ${plan.school_paper.duration_min} min`
                  : ` · ${plan ? plan.total_questions : questionCount} questions${plan ? ` · about ${plan.estimated_minutes} min` : ''}`}
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetPreferences}
                >
                  <ResetIcon />
                  Reset
                </Button>
                <Button
                  ref={generateButtonRef}
                  disabled={starting || loadingPlan || !readyToGenerate}
                  onClick={handleGenerate}
                >
                  {starting ? 'Getting your paper ready…' : 'Generate paper'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      {showLayoutSwitcher(search.layout) && withContent.length > 0 && (
        <LayoutSwitcher layout={layout} onChange={setLayout} />
      )}
      {showInstall && (
        <InstallAppDialog
          storageKey={INSTALL_OFFER_KEY}
          onClose={() => {
            setShowInstall(false)
            void startTest()
          }}
        />
      )}
    </AppShell>
  )
}
