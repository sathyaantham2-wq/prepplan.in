import { describe, expect, it } from 'vitest'
import { SHRINKAGE_WEIGHT, computeQuestionStats, firstExposures, strongStudents } from './stats'
import type { AnswerObservation, QuestionStatRow  } from './stats'
import { caseSeverity, detectSignals, hasNewEvidence } from './detectors'

const t0 = new Date('2026-11-01T10:00:00Z').getTime()

function obs(partial: Partial<AnswerObservation> & { questionId: string; studentId: string }): AnswerObservation {
  return {
    answeredAt: new Date(t0),
    correct: true,
    blank: false,
    option: null,
    timeSec: 30,
    cellKey: 'subj|Hard',
    ...partial,
  }
}

function stat(partial: Partial<QuestionStatRow>): QuestionStatRow {
  return {
    questionId: 'q1',
    firstExposures: 0,
    firstCorrect: 0,
    blank: 0,
    optionCounts: {},
    strongOptionCounts: {},
    medianTimeSec: null,
    shrunkCorrectRate: 0.5,
    cellCorrectRate: 0.5,
    ...partial,
  }
}

describe('quality stats', () => {
  it('keeps only the first answer a student gave to a question', () => {
    const rows = [
      obs({ questionId: 'q1', studentId: 's1', correct: false, answeredAt: new Date(t0) }),
      obs({ questionId: 'q1', studentId: 's1', correct: true, answeredAt: new Date(t0 + 60_000) }),
      obs({ questionId: 'q1', studentId: 's2', correct: true, answeredAt: new Date(t0 + 30_000) }),
    ]
    const kept = firstExposures(rows)
    expect(kept).toHaveLength(2)
    expect(kept.find((r) => r.studentId === 's1')?.correct).toBe(false)
  })

  it('counts a student as strong only with enough answers and high accuracy', () => {
    const rows: Array<AnswerObservation> = []
    for (let i = 0; i < 10; i++) rows.push(obs({ questionId: `a${i}`, studentId: 'strong', correct: i < 8 }))
    for (let i = 0; i < 9; i++) rows.push(obs({ questionId: `b${i}`, studentId: 'few', correct: true }))
    for (let i = 0; i < 10; i++) rows.push(obs({ questionId: `c${i}`, studentId: 'weak', correct: i < 5 }))
    expect([...strongStudents(rows)]).toEqual(['strong'])
  })

  it('pulls a thinly answered question toward its cell average', () => {
    const rows: Array<AnswerObservation> = []
    // cell: 20 answers on other questions, all right
    for (let i = 0; i < 20; i++) rows.push(obs({ questionId: `other${i}`, studentId: `s${i}`, correct: true }))
    // the question: two answers, both wrong
    rows.push(obs({ questionId: 'q', studentId: 'x1', correct: false }))
    rows.push(obs({ questionId: 'q', studentId: 'x2', correct: false }))
    const q = computeQuestionStats(rows).find((s) => s.questionId === 'q')!
    const cellRate = 20 / 22
    expect(q.cellCorrectRate).toBeCloseTo(cellRate)
    expect(q.shrunkCorrectRate).toBeCloseTo((0 + SHRINKAGE_WEIGHT * cellRate) / (2 + SHRINKAGE_WEIGHT))
    // two wrong answers are nowhere near enough to call it a 0% question
    expect(q.shrunkCorrectRate).toBeGreaterThan(0.6)
  })

  it('tallies options, blanks and the median time', () => {
    const rows = [
      obs({ questionId: 'q', studentId: 's1', option: 'A', timeSec: 10 }),
      obs({ questionId: 'q', studentId: 's2', option: 'B', correct: false, timeSec: 30 }),
      obs({ questionId: 'q', studentId: 's3', option: 'B', correct: false, timeSec: 50 }),
      obs({ questionId: 'q', studentId: 's4', option: null, blank: true, correct: false, timeSec: null }),
    ]
    const q = computeQuestionStats(rows)[0]
    expect(q.optionCounts).toEqual({ A: 1, B: 2 })
    expect(q.blank).toBe(1)
    expect(q.medianTimeSec).toBe(30)
    expect(q.firstExposures).toBe(4)
    expect(q.firstCorrect).toBe(1)
  })
})

describe('quality detectors', () => {
  it('turns open student reports into signals, an answer-key report being the most severe', () => {
    const signals = detectSignals({
      stat: null,
      difficulty: 'Hard',
      correctLabel: 'A',
      openReports: [
        { reason: 'answer_error', count: 2 },
        { reason: 'unclear', count: 1 },
      ],
    })
    expect(signals.map((s) => s.key)).toEqual(['student_report:answer_error', 'student_report:unclear'])
    expect(caseSeverity(signals)).toBe(3)
  })

  it('flags strong students agreeing on the same wrong option as a likely wrong key', () => {
    const signals = detectSignals({
      stat: stat({ firstExposures: 5, strongOptionCounts: { B: 3, A: 1 }, optionCounts: { B: 3, A: 2 } }),
      difficulty: 'Hard',
      correctLabel: 'A',
      openReports: [],
    })
    expect(signals.map((s) => s.kind)).toContain('strong_students_pick_same_wrong_option')
    expect(caseSeverity(signals)).toBe(3)
  })

  it('stays quiet when only two strong students disagree with the key', () => {
    const signals = detectSignals({
      stat: stat({ firstExposures: 3, strongOptionCounts: { B: 2 }, optionCounts: { B: 2, A: 1 } }),
      difficulty: 'Hard',
      correctLabel: 'A',
      openReports: [],
    })
    expect(signals).toEqual([])
  })

  it('flags a wrong option chosen more often than the key, given enough answers', () => {
    const signals = detectSignals({
      stat: stat({ firstExposures: 10, optionCounts: { A: 2, C: 6, B: 2 } }),
      difficulty: 'Hard',
      correctLabel: 'A',
      openReports: [],
    })
    expect(signals.map((s) => s.kind)).toEqual(['wrong_option_more_popular_than_key'])
  })

  it('compares difficulty only after enough answers, using the shrunk rate', () => {
    const easyButHard = (n: number) =>
      detectSignals({
        stat: stat({ firstExposures: n, shrunkCorrectRate: 0.2 }),
        difficulty: 'Easy',
        correctLabel: null,
        openReports: [],
      }).map((s) => s.kind)
    expect(easyButHard(9)).toEqual([])
    expect(easyButHard(10)).toEqual(['harder_than_tagged'])
    const hardestButEasy = detectSignals({
      stat: stat({ firstExposures: 12, shrunkCorrectRate: 0.9 }),
      difficulty: 'Hardest',
      correctLabel: null,
      openReports: [],
    })
    expect(hardestButEasy.map((s) => s.kind)).toEqual(['easier_than_tagged'])
  })

  it('flags a question most students leave blank', () => {
    const signals = detectSignals({
      stat: stat({ firstExposures: 8, blank: 4 }),
      difficulty: 'Hard',
      correctLabel: null,
      openReports: [],
    })
    expect(signals.map((s) => s.kind)).toEqual(['often_left_blank'])
  })

  it('reopens a closed case only on new evidence', () => {
    const before = detectSignals({ stat: null, difficulty: 'Hard', correctLabel: 'A', openReports: [{ reason: 'unclear', count: 1 }] })
    const same = detectSignals({ stat: null, difficulty: 'Hard', correctLabel: 'A', openReports: [{ reason: 'unclear', count: 1 }] })
    const more = detectSignals({ stat: null, difficulty: 'Hard', correctLabel: 'A', openReports: [{ reason: 'unclear', count: 2 }] })
    const other = detectSignals({ stat: null, difficulty: 'Hard', correctLabel: 'A', openReports: [{ reason: 'answer_error', count: 1 }] })
    expect(hasNewEvidence(same, before)).toBe(false)
    expect(hasNewEvidence(more, before)).toBe(true)
    expect(hasNewEvidence(other, before)).toBe(true)
  })
})
