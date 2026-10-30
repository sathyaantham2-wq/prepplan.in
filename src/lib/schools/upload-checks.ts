import { createHash } from 'node:crypto'
import sharp from 'sharp'
import { z } from 'zod'
import type { Db } from '../../db/connection'
import {
  schoolOwnSheetsRepository,
  schoolUploadChecksRepository,
} from '../../db/repositories'
import type { SchoolScope } from '../../db/school-scope'
import {
  callWithProviderChain,
  ModelCallError,
  VISION_PROVIDERS,
} from '../ai-models'
import { enforceAiCallBudget, logAiJob } from '../ai-metering'
import { completeText, isAiConfigured, stripCodeFence } from '../ai-provider'
import { isProductionRuntime } from '../fixture-subjects'
import { assertSchoolAiBudget } from './school-ai-budget'

// Wrong-upload checks, made on every answer page before anything is marked (owner direction 2026-10-30,
// SCHOOLS_MODULE_PLAN.md section 12.4).
//
// On our own server, with no AI: an exact copy of a file already sent (sha256); the same photo re-saved
// or resized (a 32 x 32 thumbnail, compared by correlation); a blank page (almost no dark pixels); a photo too small
// to read.
// With the AI, two small calls, each sent only what it needs:
//   - the TOP STRIP of the page only (where the student wrote her name and roll number): the AI says what
//     it reads there; the comparison with the class list is made HERE, and no name from us is ever sent;
//   - the page with that strip blanked out: what kind of page it is (an answer sheet, the question paper,
//     blank, something else, unreadable), the subject it is about, the question numbers it answers.
// A clear mismatch refuses the page with a plain reason; anything unsure asks the teacher; every check is
// written to school_upload_checks (append-only). When the AI is not set up or the school's allowance is
// used up, the AI checks are skipped and the teacher is asked to confirm instead: never silently passed.

export type CheckResult = 'pass' | 'unsure' | 'fail' | 'skipped'
export type CheckName =
  | 'duplicate'
  | 'blank'
  | 'readable'
  | 'name'
  | 'page_kind'
  | 'subject'
  | 'teacher'

interface Outcome {
  check: CheckName
  result: CheckResult
  /** The plain sentence the teacher sees for a fail or an unsure result. */
  say?: string
  detail?: Record<string, unknown>
  /** For an unsure name: the student the sheet seems to belong to. */
  suggest?: { schoolStudentId: string; name: string; rollNo: string }
}

// ---------------------------------------------------------------- fingerprints and pixels (no AI)

/**
 * sha256 of the file as sent, and a thumbnail: the page shrunk to 32 x 32 grey pixels (1 KB, base64).
 * Two thumbnails are compared by correlation: the same photo re-saved, resized or re-compressed scores
 * 0.985 or more; two different written pages stayed at or below 0.834 when this was measured (a 64-bit
 * and a 256-bit difference hash were tried first and could not tell them apart reliably).
 */
export async function fingerprint(
  bytes: Buffer,
): Promise<{ sha256: string; thumb: string }> {
  const sha256 = createHash('sha256').update(bytes).digest('hex')
  const px = await sharp(bytes)
    .rotate()
    .grayscale()
    .resize(32, 32, { fit: 'fill' })
    .raw()
    .toBuffer()
  return { sha256, thumb: px.toString('base64') }
}

/** -1..1: how alike two thumbnails are (Pearson correlation of their grey values). */
export function likeness(a: string, b: string): number {
  const x = Buffer.from(a, 'base64')
  const y = Buffer.from(b, 'base64')
  if (x.length !== y.length || x.length === 0) return 0
  const n = x.length
  let mx = 0
  let my = 0
  for (let i = 0; i < n; i++) {
    mx += x[i]
    my += y[i]
  }
  mx /= n
  my /= n
  let sxy = 0
  let sxx = 0
  let syy = 0
  for (let i = 0; i < n; i++) {
    const dx = x[i] - mx
    const dy = y[i] - my
    sxy += dx * dy
    sxx += dx * dx
    syy += dy * dy
  }
  return sxx === 0 || syy === 0
    ? sxx === syy
      ? 1
      : 0
    : sxy / Math.sqrt(sxx * syy)
}

/** Share of clearly dark pixels (writing) on the page, measured against the page's own paper colour. */
export async function inkShare(bytes: Buffer): Promise<number> {
  const px = await sharp(bytes)
    .rotate()
    .grayscale()
    .resize({ width: 600, withoutEnlargement: true })
    .raw()
    .toBuffer()
  const hist = new Array<number>(256).fill(0)
  for (const v of px) hist[v]++
  let acc = 0
  let median = 255
  for (let v = 0; v < 256; v++) {
    acc += hist[v]
    if (acc >= px.length / 2) {
      median = v
      break
    }
  }
  let dark = 0
  for (const v of px) if (v < median - 60) dark++
  return dark / px.length
}

// thresholds, starting values (to be tuned on the owner's real photos)
export const SAME_PHOTO = 0.97 // thumbnail likeness: the same photo, re-saved or resized
export const LOOKS_SAME = 0.93 // close enough to ask the teacher
export const BLANK_INK = 0.001 // under 0.1% dark pixels: nothing written
export const FAINT_INK = 0.0025 // under 0.25%: ask the teacher (a short answer is still an answer)
export const MIN_SIDE_PX = 600

// ---------------------------------------------------------------- the AI reads (small, separate calls)

export interface SheetCheckAi {
  available: () => boolean
  /** The top strip only -> JSON text {"name": string|null, "roll": string|null, "confidence": 0..1}. */
  readHeader: (strip: { mediaType: string; base64: string }) => Promise<string>
  /** The page with the top strip blanked -> JSON text (see PageKindSchema). */
  pageKind: (input: {
    page: { mediaType: string; base64: string }
    subject: string
    grade: number
    questionNumbers: Array<string>
  }) => Promise<string>
}

const HeaderSchema = z.object({
  name: z.string().max(80).nullable(),
  roll: z.string().max(20).nullable(),
  confidence: z.number().min(0).max(1),
})
const PageKindSchema = z.object({
  kind: z.enum([
    'answer_sheet',
    'question_paper',
    'blank',
    'other',
    'unreadable',
  ]),
  subject: z.string().max(60).nullable(),
  question_numbers: z.array(z.string().max(10)).max(80),
  confidence: z.number().min(0).max(1),
})

const ONLY_JSON = 'Reply with JSON only, no other words.'
const PROMPTS = {
  header: `This is the top strip of a student's handwritten answer sheet. Read the student's name and roll number written there. Do not guess: if you cannot read one, give null. ${ONLY_JSON}
Shape: {"name": "...", "roll": "...", "confidence": 0.0}`,
  pageKind: (subject: string, grade: number, numbers: Array<string>) =>
    `This is a photo of one page handed in for a CBSE Class ${grade} ${subject} exam (the top strip is blanked out on purpose). Say what it is:
- "answer_sheet": a student's handwritten answers;
- "question_paper": the printed question paper itself;
- "blank": nothing written;
- "unreadable": too blurred, dark or cut off to read;
- "other": anything else.
Also say which school subject the writing is about (or null if you cannot tell) and which question numbers it answers (as written on the page). The paper's questions are numbered ${numbers.join(', ')}. ${ONLY_JSON}
Shape: {"kind": "answer_sheet", "subject": "Mathematics", "question_numbers": ["1", "2"], "confidence": 0.0}`,
}

export function createSheetCheckAi(
  db: Db,
  school: { schoolId: string; householdId: string },
): SheetCheckAi {
  async function run(
    feature: 'SCH-05' | 'SCH-06',
    prompt: string,
    image: { mediaType: string; base64: string },
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
            { model, prompt, maxTokens: 300, images: [image] },
            provider,
          ),
        undefined,
        { only: VISION_PROVIDERS },
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
      return stripCodeFence(outcome.result.text ?? '')
    } catch (err) {
      await logAiJob(db, {
        feature,
        model: err instanceof ModelCallError ? err.label : feature,
        householdId: school.householdId,
        latencyMs: Date.now() - startedAt,
        status: 'error',
        error: err instanceof Error ? err.message : String(err),
      })
      throw err
    }
  }
  return {
    available: () => isAiConfigured(),
    readHeader: (strip) => run('SCH-05', PROMPTS.header, strip),
    pageKind: ({ page, subject, grade, questionNumbers }) =>
      run('SCH-06', PROMPTS.pageKind(subject, grade, questionNumbers), page),
  }
}

/**
 * A stand-in for the browser tests only (OWN_PAPER_AI=fake, ignored in a production runtime): every
 * page is an answer sheet and the name at the top always reads as FAKE_SHEET_NAME ("Asha Rao", roll 1),
 * so a page sent for anyone else shows the "is this the right student?" question.
 */
export function createFakeSheetCheckAi(): SheetCheckAi {
  return {
    available: () => true,
    readHeader: () =>
      Promise.resolve(
        JSON.stringify({
          name: process.env.FAKE_SHEET_NAME ?? 'Asha Rao',
          roll: process.env.FAKE_SHEET_ROLL ?? '1',
          confidence: 0.9,
        }),
      ),
    pageKind: ({ subject }) =>
      Promise.resolve(
        JSON.stringify({
          kind: 'answer_sheet',
          subject,
          question_numbers: ['1'],
          confidence: 0.9,
        }),
      ),
  }
}

export function sheetCheckAiFor(
  db: Db,
  school: { schoolId: string; householdId: string },
): SheetCheckAi {
  if (process.env.OWN_PAPER_AI === 'fake' && !isProductionRuntime())
    return createFakeSheetCheckAi()
  return createSheetCheckAi(db, school)
}

// ---------------------------------------------------------------- names, compared here (never by the AI)

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

function lev(a: string, b: string): number {
  const d = Array.from({ length: b.length + 1 }, (_, j) => j)
  for (let i = 1; i <= a.length; i++) {
    let prev = d[0]
    d[0] = i
    for (let j = 1; j <= b.length; j++) {
      const t = d[j]
      d[j] = Math.min(
        d[j] + 1,
        d[j - 1] + 1,
        prev + (a[i - 1] === b[j - 1] ? 0 : 1),
      )
      prev = t
    }
  }
  return d[b.length]
}

/** 0..1: how alike a name read from a sheet is to a name on the class list (spelling slips, initials). */
export function nameLikeness(read: string, listed: string): number {
  const a = norm(read)
  const b = norm(listed)
  if (!a || !b) return 0
  const whole = 1 - lev(a, b) / Math.max(a.length, b.length)
  // "Asha R" for "Asha Rao", "A. Rao" for "Asha Rao": token by token, an initial matches its word
  const ta = a.split(' ')
  const tb = b.split(' ')
  const tokenScore = (x: string, y: string) =>
    x.length === 1 || y.length === 1
      ? x[0] === y[0]
        ? 0.9
        : 0
      : 1 - lev(x, y) / Math.max(x.length, y.length)
  const short = ta.length <= tb.length ? ta : tb
  const long = ta.length <= tb.length ? tb : ta
  const tokens =
    short.reduce(
      (sum, t) => sum + Math.max(...long.map((u) => tokenScore(t, u))),
      0,
    ) / short.length
  return Math.max(whole, tokens * (short.length / long.length) ** 0.25)
}

interface Person {
  school_student_id: string
  name: string
  roll_no: string
}

export function judgeName(
  read: { name: string | null; roll: string | null; confidence: number },
  chosen: Person,
  classmates: ReadonlyArray<Person>,
): Outcome {
  const detail = { read_name: read.name, read_roll: read.roll }
  const who = `${chosen.name} (roll ${chosen.roll_no})`
  if (!read.name && !read.roll)
    return {
      check: 'name',
      result: 'unsure',
      say: `We could not read a name or roll number at the top of this page. Is it ${who}'s?`,
      detail,
    }
  const rollOf = (p: Person) =>
    read.roll !== null &&
    read.roll.replace(/\D/g, '') !== '' &&
    read.roll.replace(/\D/g, '') === p.roll_no.replace(/\D/g, '')
  const score = (p: Person) => (read.name ? nameLikeness(read.name, p.name) : 0)
  const mine = score(chosen)
  if (
    read.confidence >= 0.5 &&
    (mine >= 0.8 || (rollOf(chosen) && mine >= 0.5))
  )
    return {
      check: 'name',
      result: 'pass',
      detail: { ...detail, likeness: mine },
    }
  const other = classmates
    .filter((p) => p.school_student_id !== chosen.school_student_id)
    .map((p) => ({ p, s: score(p), roll: rollOf(p) }))
    .filter((x) => x.s >= 0.8 || (x.roll && x.s >= 0.5))
    .sort((a, b) => b.s - a.s)
    .at(0)
  if (other)
    return {
      check: 'name',
      result: 'unsure',
      say: `The name on this sheet looks like ${other.p.name} (roll ${other.p.roll_no}). You chose ${who}.`,
      detail: {
        ...detail,
        likeness: mine,
        looks_like: other.p.school_student_id,
      },
      suggest: {
        schoolStudentId: other.p.school_student_id,
        name: other.p.name,
        rollNo: other.p.roll_no,
      },
    }
  return {
    check: 'name',
    result: 'unsure',
    say: `The name on this sheet${read.name ? ` (“${read.name}”)` : ''} does not clearly match ${who}. Is it hers?`,
    detail: { ...detail, likeness: mine },
  }
}

// ---------------------------------------------------------------- the whole check of one page

export interface PageCheckInput {
  sheetId: string
  paperId: string
  bytes: Buffer
  student: Person | null
  classmates: ReadonlyArray<Person>
  subject: string
  grade: number
  questionNumbers: Array<string>
}

export interface PageCheckVerdict {
  state: 'passed' | 'needs_confirm' | 'refused'
  summary: string | null
  suggest: Outcome['suggest'] | null
}

const SUBJECT_WORDS: Array<[RegExp, string]> = [
  [/math/i, 'mathematics'],
  [/science|physics|chemistry|biology/i, 'science'],
  [/social|history|geograph|civic|politic|econom/i, 'social science'],
  [/english/i, 'english'],
  [/hindi/i, 'hindi'],
  [/telugu/i, 'telugu'],
]
const subjectFamily = (s: string) =>
  SUBJECT_WORDS.find(([re]) => re.test(s))?.[1] ?? s.toLowerCase().trim()

export async function checkPage(
  db: Db,
  scope: SchoolScope,
  ai: SheetCheckAi,
  input: PageCheckInput,
): Promise<PageCheckVerdict> {
  const outcomes: Array<Outcome & { aiUsed?: boolean }> = []
  const { sha256, thumb } = await fingerprint(input.bytes)
  await schoolOwnSheetsRepository.update(db, scope, input.sheetId, {
    sha256,
    thumb,
    check_state: 'pending',
  })

  // 1. the same image under another student (or twice for this one); blank pages all look alike, so a
  // blank page is left to the blank check below
  const blankPage = (await inkShare(input.bytes)) < BLANK_INK
  const others = (
    await db
      .selectFrom('school_own_sheets as s')
      .leftJoin('school_students as ss', 'ss.id', 's.school_student_id')
      .leftJoin('students as st', 'st.id', 'ss.student_id')
      .select([
        's.id',
        's.sha256',
        's.thumb',
        's.seq',
        's.school_student_id',
        'st.name',
      ])
      .where('s.school_id', '=', scope.schoolId)
      .where('s.paper_id', '=', input.paperId)
      .where('s.id', '!=', input.sheetId)
      .where('s.status', '!=', 'rejected')
      .where('s.kind', '=', 'page')
      .execute()
  ).filter((o) => o.thumb !== null)
  const near = others
    .map((o) => ({
      o,
      like: o.sha256 === sha256 ? 1 : likeness(String(o.thumb), thumb),
    }))
    .sort((a, b) => b.like - a.like)
    .at(0)
  const whose = (o: (typeof others)[number]) =>
    o.school_student_id === input.student?.school_student_id
      ? `already sent for this student (page ${o.seq ?? '?'})`
      : `the same photo as ${o.name ?? 'a page waiting for a student'}${o.seq ? `'s page ${o.seq}` : ''}`
  if (blankPage) outcomes.push({ check: 'duplicate', result: 'skipped' })
  else if (near && near.like >= SAME_PHOTO)
    outcomes.push({
      check: 'duplicate',
      result: 'fail',
      say: `This page is ${whose(near.o)}.`,
      detail: {
        sheet_id: near.o.id,
        likeness: near.like,
        exact: near.o.sha256 === sha256,
      },
    })
  else if (near && near.like >= LOOKS_SAME)
    outcomes.push({
      check: 'duplicate',
      result: 'unsure',
      say: `This page looks very like ${whose(near.o).replace('the same photo as ', '')}. Is it a different page?`,
      detail: { sheet_id: near.o.id, likeness: near.like },
    })
  else
    outcomes.push({
      check: 'duplicate',
      result: 'pass',
      detail: near ? { nearest_likeness: near.like } : {},
    })

  // 2. readable size, and 3. blank
  const meta = await sharp(input.bytes).metadata()
  const side = Math.min(meta.width, meta.height)
  if (side < MIN_SIDE_PX)
    outcomes.push({
      check: 'readable',
      result: 'fail',
      say: 'This photo is too small to read. Send the original photo from the phone or scanner.',
      detail: { width: meta.width, height: meta.height },
    })
  else
    outcomes.push({
      check: 'readable',
      result: 'pass',
      detail: { width: meta.width, height: meta.height },
    })
  const ink = await inkShare(input.bytes)
  if (ink < BLANK_INK)
    outcomes.push({
      check: 'blank',
      result: 'fail',
      say: 'This page is blank.',
      detail: { ink },
    })
  else if (ink < FAINT_INK)
    outcomes.push({
      check: 'blank',
      result: 'unsure',
      say: 'This page has almost nothing written on it. Keep it?',
      detail: { ink },
    })
  else outcomes.push({ check: 'blank', result: 'pass', detail: { ink } })

  // 4. and 5. the AI reads, only when nothing has already refused the page
  if (!outcomes.some((o) => o.result === 'fail')) {
    const oriented = await sharp(input.bytes).rotate().toBuffer()
    const om = await sharp(oriented).metadata()
    const w = om.width
    const h = om.height
    const stripH = Math.max(1, Math.round(h * 0.12))
    let aiOff: string | null = !ai.available()
      ? 'The AI checks are not set up, so please confirm this page yourself.'
      : null
    if (!aiOff)
      try {
        await assertSchoolAiBudget(db, scope.schoolId)
      } catch {
        aiOff =
          'Your school has used its AI allowance for this month, so the AI checks are off. Please confirm this page yourself.'
      }
    if (aiOff) {
      outcomes.push({ check: 'name', result: 'skipped', say: aiOff })
      outcomes.push({ check: 'page_kind', result: 'skipped' })
    } else {
      // the name: the top strip only
      if (input.student)
        try {
          const strip = await sharp(oriented)
            .extract({ left: 0, top: 0, width: w, height: stripH })
            .resize({ width: 1200, withoutEnlargement: true })
            .jpeg({ quality: 80 })
            .toBuffer()
          const read = HeaderSchema.parse(
            JSON.parse(
              await ai.readHeader({
                mediaType: 'image/jpeg',
                base64: strip.toString('base64'),
              }),
            ),
          )
          outcomes.push({
            ...judgeName(read, input.student, input.classmates),
            aiUsed: true,
          })
        } catch (e) {
          outcomes.push({
            check: 'name',
            result: 'unsure',
            say: `We could not check the name on this page. Is it ${input.student.name}'s?`,
            detail: {
              error: e instanceof Error ? e.message.slice(0, 200) : 'unknown',
            },
          })
        }
      // what the page is: the page with the name strip blanked out
      try {
        // (sharp resizes before it composites, so the strip is blanked first and the page shrunk after)
        const blanked = await sharp(oriented)
          .composite([
            {
              input: await sharp({
                create: {
                  width: w,
                  height: stripH,
                  channels: 3,
                  background: '#ffffff',
                },
              })
                .png()
                .toBuffer(),
              top: 0,
              left: 0,
            },
          ])
          .png()
          .toBuffer()
        const page = await sharp(blanked)
          .resize({ width: 1024, withoutEnlargement: true })
          .jpeg({ quality: 75 })
          .toBuffer()
        const k = PageKindSchema.parse(
          JSON.parse(
            await ai.pageKind({
              page: {
                mediaType: 'image/jpeg',
                base64: page.toString('base64'),
              },
              subject: input.subject,
              grade: input.grade,
              questionNumbers: input.questionNumbers,
            }),
          ),
        )
        const sure = k.confidence >= 0.7
        const detail = {
          kind: k.kind,
          subject: k.subject,
          question_numbers: k.question_numbers,
          confidence: k.confidence,
        }
        if (k.kind === 'question_paper')
          outcomes.push({
            check: 'page_kind',
            result: sure ? 'fail' : 'unsure',
            say: 'This looks like a photo of the question paper, not an answer sheet.',
            detail,
            aiUsed: true,
          })
        else if (k.kind === 'blank')
          outcomes.push({
            check: 'page_kind',
            result: sure ? 'fail' : 'unsure',
            say: 'This page looks blank.',
            detail,
            aiUsed: true,
          })
        else if (k.kind === 'other')
          outcomes.push({
            check: 'page_kind',
            result: sure ? 'fail' : 'unsure',
            say: 'This does not look like an answer sheet.',
            detail,
            aiUsed: true,
          })
        else if (k.kind === 'unreadable')
          outcomes.push({
            check: 'page_kind',
            result: 'unsure',
            say: 'This page looks too blurred or dark to read. Keep it, or take the photo again?',
            detail,
            aiUsed: true,
          })
        else {
          outcomes.push({
            check: 'page_kind',
            result: 'pass',
            detail,
            aiUsed: true,
          })
          // the subject and the question numbers, compared here
          const wrongSubject =
            k.subject !== null &&
            k.confidence >= 0.8 &&
            subjectFamily(k.subject) !== subjectFamily(input.subject)
          const known = new Set(
            input.questionNumbers.map((n) => n.replace(/\D/g, '')),
          )
          const strange = k.question_numbers
            .map((n) => n.replace(/\D/g, ''))
            .filter((n) => n && !known.has(n))
          if (wrongSubject)
            outcomes.push({
              check: 'subject',
              result: 'fail',
              say: `This looks like a ${k.subject} answer sheet; this paper is ${input.subject}.`,
              detail,
            })
          else if (strange.length > 0)
            outcomes.push({
              check: 'subject',
              result: 'unsure',
              say: `This page answers question ${strange.slice(0, 3).join(', ')}, which this paper does not have. Is it for this exam?`,
              detail,
            })
          else outcomes.push({ check: 'subject', result: 'pass', detail })
        }
      } catch (e) {
        outcomes.push({
          check: 'page_kind',
          result: 'unsure',
          say: 'We could not check what this page is. Please look at it.',
          detail: {
            error: e instanceof Error ? e.message.slice(0, 200) : 'unknown',
          },
        })
      }
    }
  }

  // every check is logged
  for (const o of outcomes)
    await schoolUploadChecksRepository.insert(db, scope, {
      sheet_id: input.sheetId,
      check: o.check,
      result: o.result,
      detail: JSON.stringify({
        ...(o.detail ?? {}),
        ...(o.say ? { said: o.say } : {}),
        ...(o.suggest ? { suggest: o.suggest.schoolStudentId } : {}),
      }),
    })

  const fail = outcomes.find((o) => o.result === 'fail')
  const unsure = outcomes.filter(
    (o) => o.result === 'unsure' || (o.result === 'skipped' && o.say),
  )
  const verdict: PageCheckVerdict = fail
    ? {
        state: 'refused',
        summary: fail.say ?? 'This page was refused.',
        suggest: null,
      }
    : unsure.length > 0
      ? {
          state: 'needs_confirm',
          summary: unsure
            .map((o) => o.say)
            .filter(Boolean)
            .join(' '),
          suggest: unsure.find((o) => o.suggest)?.suggest ?? null,
        }
      : { state: 'passed', summary: null, suggest: null }
  await schoolOwnSheetsRepository.update(db, scope, input.sheetId, {
    check_state: verdict.state,
    check_summary: verdict.summary,
    ...(verdict.state === 'refused'
      ? { status: 'rejected' as const, reason: verdict.summary }
      : {}),
  })
  return verdict
}
