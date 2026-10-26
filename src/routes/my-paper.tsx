import { useEffect, useRef, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { AppShell } from '../components/app-shell'
import { useSession } from '../lib/auth-client'
import { DEFAULT_THEME } from '../lib/pdf/themes'
import { PaperStylePicker } from '../components/paper-style'
import { PageLoading } from '../components/page-loading'
import type { TopicSubject, TopicSuggestion } from '../lib/topic-search'
import { PaperBuilder } from '../components/paper-builder/paper-builder'
import type { PaperBuilderProps } from '../components/paper-builder/types'
import type { BuilderQuestionType } from '../lib/paper-builder-view'
import {
  InstallAppDialog,
  useInstallOffer,
} from '../components/install-app-dialog'

const INSTALL_OFFER_KEY = 'prepplan-install-offer-generate'

export const Route = createFileRoute('/my-paper')({
  component: MyPaper,
  // chapters / concepts (comma-separated ids) arrive from "Practise this chapter" and "Practise
  // this concept" on the student's mastery view. Any other parameter (for example an old
  // ?layout=... link from the preview period) is simply not read.
  validateSearch: (
    search: Record<string, unknown>,
  ): {
    subject?: string
    chapters?: string
    concepts?: string
  } => ({
    subject: typeof search.subject === 'string' ? search.subject : undefined,
    chapters: typeof search.chapters === 'string' ? search.chapters : undefined,
    concepts: typeof search.concepts === 'string' ? search.concepts : undefined,
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

type QuestionType = BuilderQuestionType

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
  const [plan, setPlan] = useState<Plan | null>(null)
  // Average mastery (0-100) per chapter and subject, from the same overview as the topic search;
  // recommendedIds is the chapters the app chose for her for the current subject (null when the
  // selection came from a link or has not loaded).
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
    // A step without a Generate button on screen has nothing to focus: drop the request rather
    // than steal focus later.
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

  if (isPending || !session || role !== 'student') {
    return <PageLoading />
  }

  const withContent = subjects.filter((s) => s.has_content)

  // chapterIds === null means "not loaded yet" (the server picks her chapters); an empty array
  // means she actively cleared them.
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
        {/* One short heading and one line (2026-10-01 owner request), so the first choice is on
          the first screen of a phone. Same word, "paper", everywhere: heading, button and
          progress text. */}
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

        {withContent.length > 0 && (
          <div className="mb-4">
            <PaperBuilder {...builderProps} />
          </div>
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
      </div>
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
