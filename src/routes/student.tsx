import { useEffect, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from '../components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card'
import {
  ContinueCard,
  HomeTiles,
  LeaderboardCard,
  MarkMap,
  MissionCard,
  RecentPapers,
  ShareCard,
  SubjectCards,
  WeekCard,
} from '../components/student-home/student-home-parts'
import type { StudentHomeData } from '../lib/student-home-types'
import { WeeklyCardPrompt } from '../components/weekly-card'
import { Flame } from 'lucide-react'
import type { AdaptiveOverviewData } from '../components/adaptive-overview'
import { AppShell } from '../components/app-shell'
import { useSession } from '../lib/auth-client'
import { PageLoading, PageSkeleton } from '../components/page-loading'

export const Route = createFileRoute('/student')({ component: StudentHome })

interface ChapterMastery {
  chapter_id: string
  chapter_name: string
  mastery_pct: number
}

interface FocusConcept {
  concept_id: string
  concept_name: string
}

interface StudentDashboard {
  chapters: Array<ChapterMastery>
  streak_days: number
  today_focus: FocusConcept | null
  recent_improvements: Array<FocusConcept>
}

interface IncomingInvite {
  id: string
  guardian_name: string
  guardian_role: string
}

interface SharingState {
  invites: Array<IncomingInvite>
  linkedTo: { guardian_name: string; guardian_role: string } | null
}

interface PaperListItem {
  id: string
  title: string
  total_marks: number
  duration_min: number
  generated_at: string
  attempt: { id: string; status: string } | null
}

/**
 * F072 (tab06 /student): "Mastery rings, today's drill, streak, recent wins" — no red shaming
 * language, so this screen never shows a raw status word (Weak/Priority/etc.), only concept
 * names and positive framing.
 *
 * F123: also the entry point into the online test engine (M08) -- GET /api/papers lists this
 * student's generated papers with their attempt status; Start/Continue is the only way a
 * generated paper was ever reachable before this, since nothing else surfaced a paper's id.
 */
function StudentHome() {
  const { data: session, isPending } = useSession()
  const navigate = useNavigate()
  const role = (session?.user as { role?: string } | undefined)?.role

  const [dashboard, setDashboard] = useState<StudentDashboard | null>(null)
  const [overview, setOverview] = useState<AdaptiveOverviewData | null>(null)
  const [home, setHome] = useState<StudentHomeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [papers, setPapers] = useState<Array<PaperListItem> | null>(null)
  const [sharing, setSharing] = useState<SharingState | null>(null)
  const [sharingError, setSharingError] = useState<string | null>(null)
  const [startError, setStartError] = useState<string | null>(null)
  const [startingId, setStartingId] = useState<string | null>(null)

  useEffect(() => {
    if (isPending) return
    if (!session || role !== 'student') {
      navigate({ to: '/' })
      return
    }
    // A student who has not finished her profile goes there first. Subject choice itself now
    // happens on /my-paper (its dropdown offers every subject in her class), so this fetch only
    // needs to check profile_complete.
    fetch('/api/students/me/profile')
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { profile: { profile_complete: boolean } } | null) => {
        if (data && !data.profile.profile_complete) {
          navigate({ to: '/profile-setup' })
        }
      })
    fetch('/api/adaptive/overview')
      .then((r) => (r.ok ? r.json() : null))
      .then(setOverview)
    fetch('/api/students/me/home')
      .then((r) => (r.ok ? r.json() : null))
      .then(setHome)
      .catch(() => setHome(null))
    // An error response is a JSON object too, so each fetch checks .ok before treating the body
    // as data -- an error body stored as `papers` would crash the .filter() below.
    fetch('/api/student-dashboard')
      .then((r) => (r.ok ? r.json() : null))
      .then(setDashboard)
      .catch(() => setDashboard(null))
      .finally(() => setLoading(false))
    fetch('/api/papers')
      .then((r) => (r.ok ? r.json() : []))
      .then(setPapers)
      .catch(() => setPapers([]))
    void loadSharing()
  }, [isPending, session, role, navigate])

  async function loadSharing() {
    const response = await fetch('/api/guardian-invites/incoming')
    if (response.ok) setSharing(await response.json())
  }

  // Approving lets a parent or teacher see her progress; she can stop it at any time.
  async function answerInvite(id: string, approve: boolean) {
    setSharingError(null)
    const response = await fetch(`/api/guardian-invites/${id}/respond`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ approve }),
    })
    if (!response.ok) {
      const body = await response.json().catch(() => null)
      setSharingError(body?.error ?? 'Could not answer this request.')
    }
    await loadSharing()
  }

  async function stopSharing() {
    setSharingError(null)
    const response = await fetch('/api/guardian-invites/leave', {
      method: 'POST',
    })
    if (!response.ok) setSharingError('Could not stop sharing.')
    await loadSharing()
  }

  // F123: a paper with no attempt yet needs one created (POST /api/attempts) before there's an
  // id to navigate to; a paper already in_progress just resumes at its existing attempt id --
  // POST-ing again would be a second, orphaned attempt row for the same paper.
  async function startOrResume(paper: PaperListItem) {
    setStartError(null)
    if (paper.attempt && paper.attempt.status === 'in_progress') {
      navigate({ to: '/attempt/$id', params: { id: paper.attempt.id } })
      return
    }
    setStartingId(paper.id)
    try {
      const response = await fetch('/api/attempts', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ paper_id: paper.id, mode: 'online' }),
      })
      const body = await response.json()
      if (!response.ok) {
        setStartError(body.error ?? 'Could not start this paper.')
        return
      }
      navigate({ to: '/attempt/$id', params: { id: body.id } })
    } finally {
      setStartingId(null)
    }
  }

  if (isPending || !session || role !== 'student') {
    return <PageLoading />
  }

  // 2026-09-24, user feedback: this card was showing completed papers too, under a label that
  // says "to attempt" -- confusing, and a completed row here did nothing when clicked. Completed
  // papers now live on their own page (/papers-attempted), linked from the sidebar and from here
  // when there's at least one; this card goes back to only what its name says.
  const toAttempt = (papers ?? []).filter(
    (p) => p.attempt?.status !== 'evaluated',
  )
  const hasCompleted = (papers ?? []).some(
    (p) => p.attempt?.status === 'evaluated',
  )
  const papersCard =
    toAttempt.length > 0 ? (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-h3">Papers to attempt</CardTitle>
            {hasCompleted && (
              <a
                href="/papers-attempted"
                className="text-small text-primary underline-offset-4 hover:underline"
              >
                See papers attempted
              </a>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {startError && (
            <p className="text-small text-destructive" role="alert">
              {startError}
            </p>
          )}
          {toAttempt.map((p) => {
            const status = p.attempt?.status
            const awaitingMarks = status === 'submitted'
            return (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <div>
                  <p className="text-body">{p.title}</p>
                  <p className="text-small text-muted-foreground">
                    {p.total_marks} marks, {p.duration_min} min
                  </p>
                </div>
                {awaitingMarks && p.attempt ? (
                  <a href={`/attempt/${p.attempt.id}`}>
                    <Button size="sm" variant="outline">
                      See my marks
                    </Button>
                  </a>
                ) : (
                  <Button
                    size="sm"
                    className="min-h-11"
                    disabled={startingId === p.id}
                    onClick={() => void startOrResume(p)}
                  >
                    {startingId === p.id
                      ? 'Starting…'
                      : status === 'in_progress'
                        ? 'Continue'
                        : 'Start'}
                  </Button>
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>
    ) : null

  const firstName =
    overview?.student.name.split(' ')[0] ??
    (session.user as { name?: string }).name?.split(' ')[0] ??
    ''
  const pendingInvites = sharing?.invites ?? []

  const streak = dashboard?.streak_days ?? 0
  // Her half-done paper has its own card above, so the list below does not repeat it.
  const continueId = home?.in_progress?.attempt_id ?? null

  return (
    <AppShell variant="student" active="home">
      <div className="mx-auto max-w-6xl p-4 sm:p-8">
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-h1">
              {firstName ? `Hi, ${firstName}` : 'Your progress'}
            </h1>
            {streak > 0 && (
              <span className="bg-card border-border text-caption inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-semibold">
                <Flame className="size-4 text-[var(--chart-5)]" aria-hidden="true" />
                {streak} day streak
              </span>
            )}
          </div>
          <p className="text-body text-muted-foreground">
            {overview &&
              `${overview.student.class === 0 ? 'Competitive exam' : `Class ${overview.student.class}`} · ${overview.student.board === 'CIVILS' ? 'Civil Services' : overview.student.board}`}
          </p>
        </div>

        {/* A pending request needs her answer, so it goes first; the "already sharing with"
          status is informational and sits at the bottom of the page instead. */}
        {pendingInvites.length > 0 && (
          <Card className="border-primary/40 mb-4">
            <CardHeader>
              <CardTitle className="text-h3">Sharing request</CardTitle>
              <CardDescription>
                Only people you approve can see your progress. You can stop at
                any time.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {sharingError && (
                <p className="text-small text-destructive" role="alert">
                  {sharingError}
                </p>
              )}
              {pendingInvites.map((inv) => (
                <div
                  key={inv.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-md border p-3"
                >
                  <p className="text-body">
                    {inv.guardian_name} ({inv.guardian_role}) wants to follow
                    your progress.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => void answerInvite(inv.id, true)}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => void answerInvite(inv.id, false)}
                    >
                      Decline
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {loading && !overview && <PageSkeleton />}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="stagger min-w-0 space-y-6">
            {home && <MissionCard home={home} />}
            {home?.in_progress && <ContinueCard item={home.in_progress} />}
            {home && <HomeTiles home={home} />}
            {home && <MarkMap home={home} />}
            {overview && <SubjectCards subjects={overview.subjects} />}
            {home && <RecentPapers papers={home.recent_papers} />}
            {papersCard && continueId === null && papersCard}
            {papersCard && continueId !== null && (
              <details className="group">
                <summary className="text-small text-muted-foreground flex min-h-11 cursor-pointer list-none items-center">
                  All papers to attempt
                </summary>
                <div className="mt-3">{papersCard}</div>
              </details>
            )}

            <WeekCard home={home} streak={streak} className="lg:hidden" />

            {sharing?.linkedTo && (
              <Card>
                <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-6">
                  <p className="text-body">
                    {sharing.linkedTo.guardian_name} (
                    {sharing.linkedTo.guardian_role}) can see your progress.
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => void stopSharing()}
                  >
                    Stop sharing
                  </Button>
                </CardContent>
                {sharingError && pendingInvites.length === 0 && (
                  <p className="text-small text-destructive px-6 pb-4" role="alert">
                    {sharingError}
                  </p>
                )}
              </Card>
            )}
          </div>

          <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            {home && <LeaderboardCard home={home} />}
            <WeeklyCardPrompt />
            {overview && (
              <ShareCard name={overview.student.name} subjects={overview.subjects} />
            )}
            <WeekCard home={home} streak={streak} className="hidden lg:block" />
          </aside>
        </div>
      </div>
    </AppShell>
  )
}
