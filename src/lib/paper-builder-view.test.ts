import { describe, expect, it } from 'vitest'
import {
  clampStep,
  describeAskedVsPlanned,
  estimateMinutes,
  groupChaptersByPart,
  masteryPercent,
  parseLayout,
  schoolPaperLine,
  showLayoutSwitcher,
  subjectIconKind,
  summaryText,
  wizardBlockReason,
  worthPractising,
} from './paper-builder-view'

describe('layout param', () => {
  it('picks a and b, anything else is the current layout', () => {
    expect(parseLayout('a')).toBe('a')
    expect(parseLayout('B')).toBe('b')
    expect(parseLayout(' b ')).toBe('b')
    expect(parseLayout(undefined)).toBe('classic')
    expect(parseLayout('')).toBe('classic')
    expect(parseLayout('c')).toBe('classic')
    expect(parseLayout('classic')).toBe('classic')
    expect(parseLayout(null)).toBe('classic')
  })
  it('shows the switcher only when the parameter is present', () => {
    expect(showLayoutSwitcher(undefined)).toBe(false)
    expect(showLayoutSwitcher(null)).toBe(false)
    expect(showLayoutSwitcher('a')).toBe(true)
    expect(showLayoutSwitcher('classic')).toBe(true)
    expect(showLayoutSwitcher('nonsense')).toBe(true)
  })
})

describe('subjectIconKind', () => {
  it('maps names by keyword', () => {
    expect(subjectIconKind('Mathematics')).toBe('maths')
    expect(subjectIconKind('Maths')).toBe('maths')
    expect(subjectIconKind('Science')).toBe('science')
    expect(subjectIconKind('Physics')).toBe('science')
    expect(subjectIconKind('Social Science')).toBe('social')
    expect(subjectIconKind('Social Science (Geography)')).toBe('social')
    expect(subjectIconKind('Indian Polity')).toBe('social')
    expect(subjectIconKind('History')).toBe('social')
    expect(subjectIconKind('English')).toBe('english')
    expect(subjectIconKind('Hindi')).toBe('hindi')
    expect(subjectIconKind('Telugu')).toBe('telugu')
    expect(subjectIconKind('Computer Applications')).toBe('generic')
  })
})

const ch = (id: string, part: string, no: number, name: string) => ({
  id,
  part,
  chapter_no: no,
  name,
})

describe('groupChaptersByPart', () => {
  const chapters = [
    ch('1', 'I', 3, 'A Peek Beyond the Point'),
    ch('2', 'I', 4, 'Expressions'),
    ch('3', 'II', 3, 'Another Peek Beyond the Point'),
  ]
  it('keeps both chapter 3s apart and shows the part when there are two', () => {
    const g = groupChaptersByPart(chapters)
    expect(g.showPart).toBe(true)
    expect(g.groups.map((x) => [x.part, x.chapters.length])).toEqual([
      ['I', 2],
      ['II', 1],
    ])
  })
  it('hides the part for a single-part subject', () => {
    const g = groupChaptersByPart(chapters.slice(0, 2))
    expect(g.showPart).toBe(false)
    expect(g.groups).toHaveLength(1)
  })
  it('filters by name without losing the subject-level part flag', () => {
    const g = groupChaptersByPart(chapters, '  peek ')
    expect(g.groups.map((x) => x.chapters.map((c) => c.id))).toEqual([['1'], ['3']])
    const one = groupChaptersByPart(chapters, 'expressions')
    expect(one.showPart).toBe(true)
    expect(one.groups).toHaveLength(1)
    expect(groupChaptersByPart(chapters, 'zzz').groups).toEqual([])
  })
})

describe('mastery helpers', () => {
  it('flags only assessed chapters below Proficient', () => {
    expect(worthPractising(null)).toBe(false)
    expect(worthPractising(undefined)).toBe(false)
    expect(worthPractising(59.9)).toBe(true)
    expect(worthPractising(60)).toBe(false)
    expect(worthPractising(0)).toBe(true)
  })
  it('rounds and clamps the ring percent', () => {
    expect(masteryPercent(null)).toBeNull()
    expect(masteryPercent(42.4)).toBe(42)
    expect(masteryPercent(130)).toBe(100)
    expect(masteryPercent(-3)).toBe(0)
  })
})

describe('estimateMinutes', () => {
  it('matches the plan arithmetic', () => {
    // 10 MCQ (15) + 2 short (8) + 1 long (8) = 31 -> 35
    expect(estimateMinutes(10, 'combined')).toBe(35)
    // 10 MCQ only = 15
    expect(estimateMinutes(10, 'mcq')).toBe(15)
    // written: 4 short (16) + 2 long (16) = 32 -> 35
    expect(estimateMinutes(10, 'written')).toBe(35)
    // 15 combined: 22.5 + 3x4 + 2x8 = 50.5 -> 55
    expect(estimateMinutes(15, 'combined')).toBe(55)
    // 30 combined: 45 + 6x4 + 3x8 = 93 -> 95
    expect(estimateMinutes(30, 'combined')).toBe(95)
  })
})

const combinedPlan = {
  total_questions: 13,
  estimated_minutes: 35,
  sections: [
    { count: 10, marks_per_question: 1 },
    { count: 2, marks_per_question: 2 },
    { count: 1, marks_per_question: 3 },
  ],
}

describe('describeAskedVsPlanned', () => {
  it('explains a Combined paper from its sections', () => {
    const r = describeAskedVsPlanned(10, 'combined', combinedPlan)
    expect(r?.headline).toBe('10 asked, 13 planned')
    expect(r?.explanation).toBe(
      'The 10 is the multiple-choice part. A Combined paper adds written questions on top: 10 multiple-choice questions, 2 short-answer questions and 1 long-answer question.',
    )
  })
  it('explains a written-only paper', () => {
    const r = describeAskedVsPlanned(10, 'written', {
      total_questions: 6,
      estimated_minutes: 35,
      sections: [
        { count: 4, marks_per_question: 2 },
        { count: 2, marks_per_question: 3 },
      ],
    })
    expect(r?.headline).toBe('10 asked, 6 planned')
    expect(r?.explanation).toContain('sized from the 10 you chose')
  })
  it('says nothing when the numbers agree, for a school paper, or with no sections', () => {
    expect(
      describeAskedVsPlanned(10, 'mcq', {
        total_questions: 10,
        estimated_minutes: 15,
        sections: [{ count: 10, marks_per_question: 1 }],
      }),
    ).toBeNull()
    expect(
      describeAskedVsPlanned(10, 'combined', {
        ...combinedPlan,
        school_paper: { total_marks: 80, duration_min: 180 },
      }),
    ).toBeNull()
    expect(
      describeAskedVsPlanned(10, 'combined', { total_questions: 13, estimated_minutes: 35 }),
    ).toBeNull()
    expect(describeAskedVsPlanned(10, 'combined', null)).toBeNull()
  })
})

describe('summaryText', () => {
  it('lists subject, chapters, questions and minutes', () => {
    expect(
      summaryText({ subjectName: 'Maths', chapterCount: 2, questionCount: 10, plan: combinedPlan }),
    ).toBe('Maths · 2 chapters · 13 questions · about 35 min')
  })
  it('falls back to the asked count while the plan loads and singularises', () => {
    expect(
      summaryText({ subjectName: null, chapterCount: 1, questionCount: 10, plan: null }),
    ).toBe('1 chapter · 10 questions')
  })
  it('prints the school paper marks and time', () => {
    expect(
      summaryText({
        subjectName: 'Maths',
        chapterCount: 3,
        questionCount: 10,
        plan: {
          total_questions: 38,
          estimated_minutes: 180,
          school_paper: { total_marks: 80, duration_min: 180 },
        },
      }),
    ).toBe('Maths · 3 chapters · 38 questions · 80 marks · 180 min')
    expect(schoolPaperLine({ total_marks: 80, duration_min: 180 })).toBe('80 marks · 3 hours')
    expect(schoolPaperLine({ total_marks: 40, duration_min: 90 })).toBe('40 marks · 90 min')
  })
})

describe('wizard', () => {
  const base = { subjectId: 's', chapterCount: 2, planReady: true, planning: false, starting: false }
  it('needs a subject first', () => {
    expect(wizardBlockReason(0, { ...base, subjectId: '' })).toBe('Choose a subject to continue.')
    expect(wizardBlockReason(0, base)).toBeNull()
  })
  it('needs a chapter from step 2 on, not on step 1', () => {
    expect(wizardBlockReason(0, { ...base, chapterCount: 0 })).toBeNull()
    expect(wizardBlockReason(1, { ...base, chapterCount: 0 })).toBe(
      'Pick at least one chapter to continue.',
    )
    expect(wizardBlockReason(1, base)).toBeNull()
  })
  it('waits for the plan before generating', () => {
    expect(wizardBlockReason(2, { ...base, planning: true })).toBe('Planning your paper…')
    expect(wizardBlockReason(2, { ...base, planReady: false })).toBe('Your paper is not ready yet.')
    expect(wizardBlockReason(2, { ...base, starting: true })).toBe('Getting your paper ready…')
    expect(wizardBlockReason(2, base)).toBeNull()
  })
  it('clamps the step', () => {
    expect(clampStep(-1)).toBe(0)
    expect(clampStep(5)).toBe(2)
    expect(clampStep(1)).toBe(1)
  })
})
