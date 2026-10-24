// The shape of GET /api/students/me/home. The server (getStudentHome) fills it and the student
// Home page reads it, so this file is the contract between the two and has no imports from either
// side. It is browser-safe: types only.

export interface HomeMissionStep {
  /** 'check' = today's quick check, 'fixit' = the Fix-it Deck, 'paper' = one short paper. */
  key: 'check' | 'fixit' | 'paper'
  label: string
  /** One short line under the label, e.g. "Fractions" or "3 cards waiting". */
  hint: string
  done: boolean
  /** True while the step cannot start yet (e.g. Fix-it before her first marked paper); never counted as done. */
  waiting?: boolean
  href: string
}

export interface HomeLostConcept {
  concept_id: string
  concept_name: string
  subject_name: string
  marks_lost: number
}

export interface HomeRecentPaper {
  attempt_id: string
  title: string
  scored: number
  total: number
  /** ISO timestamp the marks were confirmed. */
  confirmed_at: string
}

export interface StudentHomeData {
  /** Last 7 days, oldest first; `day` is YYYY-MM-DD in India time. */
  week: Array<{ day: string; active: boolean }>
  points: number
  /** Spendable coins: earned minus spent on rewards. */
  coins: number
  papers_this_week: number
  in_progress: { attempt_id: string; title: string; answered: number; total: number } | null

  /** Her latest marked paper: where its marks went. Kept for the old card and the Mark Map header. */
  marks_story: {
    attempt_id: string
    title: string
    total: number
    scored: number
    lost_knowledge: number
    lost_habit: number
  } | null

  /** Today's mission: three steps and how many are done today (India time). */
  mission: { steps: Array<HomeMissionStep>; done_count: number }

  /** Marks she lost before and has won back this week (Monday to now, India time). */
  won_back: {
    total: number
    items: Array<{ concept_name: string; subject_name: string; marks_back: number }>
  }

  /** The Fix-it Deck at a glance. */
  fixit: { due: number; answered_today: number; mastered_total: number; total_cards_ever: number }

  /**
   * The Mark Map: over her confirmed marks of the last 30 days, which concepts cost her marks
   * because she did not know them ('knowledge') and which because she knew them but did not
   * deliver ('habit'). At most 5 each, biggest loss first. Totals cover all concepts, not just
   * the 5 listed.
   */
  mark_map: {
    knowledge: { total: number; concepts: Array<HomeLostConcept> }
    habit: { total: number; concepts: Array<HomeLostConcept> }
  }

  /** Her last 3 marked papers, newest first. */
  recent_papers: Array<HomeRecentPaper>

  /**
   * A small class standing. `opted_in` false means she has not joined the leaderboard: show an
   * invitation, never other students' names. Names follow the leaderboard's own privacy rules.
   */
  leaderboard: {
    opted_in: boolean
    rank: number | null
    class_size: number | null
    top: Array<{ display_name: string; points: number; is_you: boolean }>
  }

  /** Her nearest upcoming exam, or null when she has not set one. */
  exam: {
    exam_name: string
    exam_date: string
    days_remaining: number
    untested_chapters: number
  } | null
}
