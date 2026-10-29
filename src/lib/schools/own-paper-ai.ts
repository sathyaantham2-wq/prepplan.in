import type { Db } from '../../db/connection'
import {
  callWithProviderChain,
  ModelCallError,
  VISION_PROVIDERS,
} from '../ai-models'
import { enforceAiCallBudget, logAiJob } from '../ai-metering'
import { completeText, isAiConfigured, stripCodeFence } from '../ai-provider'
import { SchoolError } from './common'
import { assertSchoolAiBudget } from './school-ai-budget'

// The AI steps of "Use your own paper". Each is a small, separately metered call; the caller checks
// the school's rupee allowance before it. The model's answer comes back as text and is validated
// against a strict shape by own-paper-extract.ts before anything is saved. No student name, e-mail or
// roll number is ever sent: only the paper (and, for the key, the paper's own questions).

export interface AiImage {
  mediaType: string
  base64: string
}

export interface OwnPaperAi {
  available: () => boolean
  /** One piece of the paper (text) or one page (a photo) -> the questions on it, as JSON text. */
  extract: (input: {
    text?: string
    image?: AiImage
    fromNumber: number
    subject: string
    grade: number
  }) => Promise<string>
  /** Each question -> the code of the chapter it tests, as JSON text. */
  map: (input: {
    questions: Array<{ n: number; text: string }>
    chapters: Array<{ code: string; label: string }>
    subject: string
    grade: number
  }) => Promise<string>
  /** The school's own answer key (text or a photo) -> the answer to each numbered question, as JSON text. */
  readKey: (input: {
    text?: string
    image?: AiImage
    questions: Array<{ n: number; text: string }>
  }) => Promise<string>
  /** A drafted answer and marking steps for each question, as JSON text. A teacher must approve it. */
  draftKey: (input: {
    questions: Array<{
      n: number
      text: string
      marks: number
      type: string
      options: Array<{ label: string; text: string }>
    }>
    subject: string
    grade: number
  }) => Promise<string>
}

const ONLY_JSON =
  'Respond with ONLY the JSON, no other text and no markdown fence.'

const PROMPTS = {
  extract: (
    subject: string,
    grade: number,
    fromNumber: number,
    hasText: boolean,
  ) => `You are reading part of a CBSE Class ${grade} ${subject} question paper written by a school. ${hasText ? 'The paper text follows.' : 'The picture is one page of it.'}
List every question on it in order. Do NOT answer, solve, correct or improve any question. Copy each question's wording exactly. Write maths in plain text: use / for fractions (3/4), ^ for powers (x^2), √ for roots (√(x+1)) and keep symbols such as ≤ ≥ ≠ × ÷ π °.
If the page shows no question numbers at all, number from ${fromNumber}. A question with sub-parts (a), (b) stays ONE question, with its marks added up. An "OR" question: give the alternative as its own item with "or_with_previous": true.
For each question give: "number" (as printed, or null), "section" (the heading above it, like "Section B"), "text", "marks" (a number; if marks are only printed for the section, use that), "type" (one of mcq, assertion_reason, match, multi_statement, fill_blank, short_answer, long_answer, case_study, diagram) and "options" (for choice questions: [{"label":"A","text":"..."}], else []).
${ONLY_JSON}
Shape: {"questions":[{"number":"1","section":"Section A","text":"...","marks":1,"type":"mcq","options":[{"label":"A","text":"..."}],"or_with_previous":false}]}`,
  map: (
    subject: string,
    grade: number,
  ) => `Below are questions from a Class ${grade} ${subject} paper and the list of chapters of the textbook, each with a code. For every question give the code of the ONE chapter it mostly tests, and how sure you are from 0 to 1. If no chapter fits, give null and 0.
${ONLY_JSON}
Shape: [{"q": 1, "chapter": "C3", "confidence": 0.9}]`,
  readKey: `Below are the numbered questions of a paper, and then the school's own answer key (text or a picture). Copy the answer given for each question number, exactly as the key gives it. If the key shows marking steps, list them with their marks. If the key has nothing for a question, leave it out. Do NOT write an answer yourself.
${ONLY_JSON}
Shape: [{"q": 1, "answer": "...", "steps": [{"description": "...", "marks": 1}]}]`,
  draftKey: (
    subject: string,
    grade: number,
  ) => `You are drafting the answer key for a CBSE Class ${grade} ${subject} paper for a teacher to check. For each question write the correct answer (for a choice question, the correct option letter and its text) and, for written answers worth 2 or more marks, 2 to 5 marking steps whose marks add up to the question's marks. Be exact and short. If you are not certain of an answer, say so in the answer text. Write maths in plain text (3/4, x^2, √(x+1)).
${ONLY_JSON}
Shape: [{"q": 1, "answer": "...", "steps": [{"description": "...", "marks": 1}]}]`,
}

export function createOwnPaperAi(
  db: Db,
  school: { schoolId: string; householdId: string },
): OwnPaperAi {
  async function run(
    feature: string,
    prompt: string,
    image: AiImage | undefined,
    maxTokens: number,
  ): Promise<string> {
    await assertSchoolAiBudget(db, school.schoolId)
    await enforceAiCallBudget(db, {
      feature,
      model: feature,
      householdId: school.householdId,
    })
    const startedAt = Date.now()
    try {
      const outcome = await callWithProviderChain(
        feature,
        (provider, model) =>
          completeText(
            { model, prompt, maxTokens, images: image ? [image] : undefined },
            provider,
          ),
        undefined,
        image ? { only: VISION_PROVIDERS } : {},
      )
      await logAiJob(db, {
        feature,
        model: outcome.label,
        householdId: school.householdId,
        tokensIn: outcome.result.tokensIn,
        tokensOut: outcome.result.tokensOut,
        latencyMs: Date.now() - startedAt,
        status: 'success',
      })
      if (!outcome.result.text)
        throw new SchoolError(
          'invalid',
          'The reader sent nothing back. Please try again.',
        )
      return stripCodeFence(outcome.result.text)
    } catch (err) {
      if (err instanceof SchoolError) throw err
      await logAiJob(db, {
        feature,
        model: err instanceof ModelCallError ? err.label : feature,
        householdId: school.householdId,
        latencyMs: Date.now() - startedAt,
        status: 'error',
        error: err instanceof Error ? err.message : String(err),
      })
      throw new SchoolError(
        'conflict',
        'The reader could not be reached just now. Please try again in a minute.',
      )
    }
  }
  return {
    available: () => isAiConfigured(),
    extract: ({ text, image, fromNumber, subject, grade }) =>
      run(
        'SCH-01',
        `${PROMPTS.extract(subject, grade, fromNumber, text !== undefined)}${text !== undefined ? `\n\n--- PAPER TEXT ---\n${text}` : ''}`,
        image,
        4000,
      ),
    map: ({ questions, chapters, subject, grade }) =>
      run(
        'SCH-02',
        `${PROMPTS.map(subject, grade)}\n\n--- CHAPTERS ---\n${chapters.map((c) => `${c.code}: ${c.label}`).join('\n')}\n\n--- QUESTIONS ---\n${questions.map((q) => `${q.n}. ${q.text.slice(0, 300)}`).join('\n')}`,
        undefined,
        2000,
      ),
    readKey: ({ text, image, questions }) =>
      run(
        'SCH-04',
        `${PROMPTS.readKey}\n\n--- QUESTIONS ---\n${questions.map((q) => `${q.n}. ${q.text.slice(0, 200)}`).join('\n')}${text !== undefined ? `\n\n--- ANSWER KEY ---\n${text}` : '\n\n(The answer key is the picture.)'}`,
        image,
        4000,
      ),
    draftKey: ({ questions, subject, grade }) =>
      run(
        'SCH-03',
        `${PROMPTS.draftKey(subject, grade)}\n\n--- QUESTIONS ---\n${questions
          .map(
            (q) =>
              `${q.n}. [${q.marks} marks, ${q.type}] ${q.text}${q.options.length ? `\n${q.options.map((o) => `   (${o.label}) ${o.text}`).join('\n')}` : ''}`,
          )
          .join('\n\n')}`,
        undefined,
        4000,
      ),
  }
}

/**
 * A stand-in reader for the browser tests only: it answers from the paper's own text, with no AI
 * vendor and no cost. It is refused in a production runtime (OWN_PAPER_AI=fake is ignored there).
 */
export function createFakeOwnPaperAi(): OwnPaperAi {
  return {
    available: () => true,
    extract: ({ text, fromNumber }) => {
      const out: Array<Record<string, unknown>> = []
      if (text === undefined)
        out.push({
          number: String(fromNumber),
          text: 'A question read from a photo of the paper.',
          marks: 2,
          type: 'short_answer',
        })
      else
        for (const line of text.split('\n')) {
          const m = /^\s*(\d+)\.\s*(.+?)(?:\s*\[(\d+)\])?\s*$/.exec(line)
          if (m)
            out.push({
              number: m[1],
              section: '',
              text: m[2],
              marks: m[3] ? Number(m[3]) : 1,
              type: 'short_answer',
            })
        }
      return Promise.resolve(JSON.stringify({ questions: out }))
    },
    map: ({ questions, chapters }) =>
      Promise.resolve(
        JSON.stringify(
          questions.map((q, i) => ({
            q: q.n,
            chapter: chapters[i % chapters.length]?.code ?? null,
            confidence: i % 3 === 2 ? 0.4 : 0.9,
          })),
        ),
      ),
    readKey: () => Promise.resolve('[]'),
    draftKey: ({ questions }) =>
      Promise.resolve(
        JSON.stringify(
          questions.map((q) => ({
            q: q.n,
            answer: `Draft answer for question ${q.n}`,
            steps:
              q.marks >= 2
                ? [
                    { description: 'Method', marks: q.marks - 1 },
                    { description: 'Answer', marks: 1 },
                  ]
                : [],
          })),
        ),
      ),
  }
}
