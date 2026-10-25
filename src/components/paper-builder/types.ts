import type { ReactNode, RefObject } from 'react'
import type { TopicSubject, TopicSuggestion } from '../../lib/topic-search'
import type {
  BuilderChapter,
  BuilderQuestionType,
  PlanLike,
} from '../../lib/paper-builder-view'

export interface BuilderSubject {
  id: string
  name: string
  // Average mastery 0-100 from /api/adaptive/overview, or null when she has not been assessed.
  mastery: number | null
}

export interface BuilderChapterItem extends BuilderChapter {
  mastery: number | null
}

export interface BuilderPlan extends PlanLike {
  is_initial_assessment: boolean
}

/**
 * Everything a paper-builder layout needs. All state, data loading and handlers stay in
 * src/routes/my-paper.tsx; the layouts only render these props.
 */
export interface PaperBuilderProps {
  subjects: Array<BuilderSubject>
  subjectId: string
  onSubject: (id: string) => void

  countOptions: ReadonlyArray<number>
  questionCount: number
  onQuestionCount: (n: number) => void
  questionType: BuilderQuestionType
  onQuestionType: (t: BuilderQuestionType) => void

  plan: BuilderPlan | null
  loadingPlan: boolean
  starting: boolean
  error: string | null

  chapters: Array<BuilderChapterItem>
  selectedChapterIds: Array<string>
  // The chapters the app picked for her for this subject, or null when the selection came from a
  // link or there is nothing recommended yet.
  recommendedChapterIds: Array<string> | null
  onToggleChapter: (id: string) => void
  onSelectAllChapters: () => void
  onClearChapters: () => void
  chapterQuery: string
  onChapterQuery: (text: string) => void

  topicSubjects: Array<TopicSubject>
  onSelectTopic: (s: TopicSuggestion) => void

  readyToGenerate: boolean
  onGenerate: () => void
  onReset: () => void
  generateButtonRef: RefObject<HTMLButtonElement | null>

  // The Paper style picker (coins unlock themes), rendered by the page.
  styleSlot: ReactNode
}
