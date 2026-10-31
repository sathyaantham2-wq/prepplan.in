import type { Db } from '../../db/connection'
import {
  bankRepository,
  schoolOwnPapersRepository,
  schoolOwnQuestionsRepository,
  schoolSubjectsRepository,
  schoolClassesRepository,
} from '../../db/repositories'
import type { SchoolScope } from '../../db/school-scope'
import { decryptScan, encryptScan } from '../scan-crypto'
import { getScanStore, ownPaperKey } from '../scan-storage'
import { SchoolError, auditSchool, storageOrRefuse } from './common'
import { isProductionRuntime } from '../fixture-subjects'
import { createFakeOwnPaperAi, createOwnPaperAi } from './own-paper-ai'
import type { AiImage, OwnPaperAi } from './own-paper-ai'
import {
  KeySchema,
  MAX_PAGES,
  MAX_UPLOAD_BYTES,
  MappingSchema,
  chunkText,
  docxParagraphs,
  docxToText,
  parseExtraction,
  parsePrepPlanParagraphs,
  pdfToText,
} from './own-paper-extract'
import type { ParsedQuestion } from './own-paper-extract'

// "Use your own paper" (step 3). The school uploads its own question paper (Word, PDF with text, or
// photos of the pages) and, if it has one, its answer key. PrepPlan reads it in small steps, one AI
// call per request (so no request runs long and the teacher sees progress), maps each question to a
// chapter of the bank, and a TEACHER approves the list. If there is no key, the AI drafts one, and a
// teacher must approve every question's key. Nothing may be marked from the paper until both are
// approved: assertPaperReadyForMarking is the one door every marking step must go through.

export interface UploadFile {
  name: string
  mediaType: string
  bytes: Buffer
}

const DOCX_TYPE =
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const isDocx = (f: UploadFile) =>
  f.mediaType === DOCX_TYPE || /\.docx$/i.test(f.name)
const isPdf = (f: UploadFile) =>
  f.mediaType === 'application/pdf' || /\.pdf$/i.test(f.name)
const isImage = (f: UploadFile) => IMAGE_TYPES.has(f.mediaType)

export function detectKind(
  files: ReadonlyArray<UploadFile>,
): 'docx' | 'pdf' | 'images' {
  if (files.length === 0)
    throw new SchoolError('invalid', 'Choose the question paper first.')
  if (files.some((f) => /\.doc$/i.test(f.name) && !isDocx(f)))
    throw new SchoolError(
      'invalid',
      'That is an old Word file (.doc). In Word, choose Save As and pick “Word Document (.docx)”, then upload that.',
    )
  if (files.every(isImage)) {
    if (files.length > MAX_PAGES)
      throw new SchoolError(
        'invalid',
        `A paper of more than ${MAX_PAGES} pages is too long to read in one go. Split it in two.`,
      )
    return 'images'
  }
  if (files.length === 1 && isDocx(files[0])) return 'docx'
  if (files.length === 1 && isPdf(files[0])) return 'pdf'
  throw new SchoolError(
    'invalid',
    'Upload one Word file (.docx), one PDF, or photos of the pages (JPG or PNG), not a mix.',
  )
}

function checkSize(files: ReadonlyArray<UploadFile>) {
  const total = files.reduce((n, f) => n + f.bytes.length, 0)
  if (total > MAX_UPLOAD_BYTES)
    throw new SchoolError(
      'invalid',
      `These files are too big (${(total / 1_000_000).toFixed(1)} MB; the limit is ${(MAX_UPLOAD_BYTES / 1_000_000).toFixed(1)} MB in all). For photos, take them at a normal size; for a PDF, save a smaller copy.`,
    )
  for (const f of files)
    if (f.bytes.length === 0)
      throw new SchoolError('invalid', `"${f.name}" is empty.`)
}

// ---------------------------------------------------------------- who may

async function loadSubject(
  db: Db,
  scope: SchoolScope,
  schoolSubjectId: string,
) {
  if (scope.role !== 'school_admin' && scope.role !== 'teacher')
    throw new SchoolError(
      'forbidden',
      'Only the school office or a teacher can do this.',
    )
  const ss = await schoolSubjectsRepository.findById(db, scope, schoolSubjectId)
  if (!ss) throw new SchoolError('not_found', 'Subject not found.')
  const subject = await db
    .selectFrom('subjects')
    .select(['id', 'name', 'class'])
    .where('id', '=', ss.subject_id)
    .executeTakeFirstOrThrow()
  const allowed =
    scope.pairs === 'all' ||
    scope.pairs.some((p) => p.subjectId === ss.subject_id)
  if (!allowed) throw new SchoolError('not_found', 'Subject not found.')
  const cls = await schoolClassesRepository.findById(db, scope, ss.class_id)
  return { ss, subject, grade: cls?.grade ?? subject.class }
}

type PaperRow = NonNullable<
  Awaited<ReturnType<typeof schoolOwnPapersRepository.findById>>
>

export async function loadOwnPaper(
  db: Db,
  scope: SchoolScope,
  paperId: string,
): Promise<
  PaperRow & { subject: { id: string; name: string }; grade: number }
> {
  const paper = await schoolOwnPapersRepository.findById(db, scope, paperId)
  if (!paper || paper.archived_at)
    throw new SchoolError('not_found', 'Paper not found.')
  const s = await loadSubject(db, scope, paper.school_subject_id)
  return { ...paper, subject: s.subject, grade: s.grade }
}

const aiFor = async (db: Db, scope: SchoolScope): Promise<OwnPaperAi> => {
  // the browser tests read papers with a stand-in that costs nothing; a real deployment never does
  if (process.env.OWN_PAPER_AI === 'fake' && !isProductionRuntime())
    return createFakeOwnPaperAi()
  const s = await db
    .selectFrom('schools')
    .select(['household_id'])
    .where('id', '=', scope.schoolId)
    .executeTakeFirstOrThrow()
  return createOwnPaperAi(db, {
    schoolId: scope.schoolId,
    householdId: s.household_id,
  })
}

// ---------------------------------------------------------------- comparing an edited PrepPlan paper

const SUP: Record<string, string> = {
  '⁰': '0',
  '¹': '1',
  '²': '2',
  '³': '3',
  '⁴': '4',
  '⁵': '5',
  '⁶': '6',
  '⁷': '7',
  '⁸': '8',
  '⁹': '9',
  '⁻': '-',
  '⁺': '+',
  ⁿ: 'n',
}
const SUB: Record<string, string> = {
  '₀': '0',
  '₁': '1',
  '₂': '2',
  '₃': '3',
  '₄': '4',
  '₅': '5',
  '₆': '6',
  '₇': '7',
  '₈': '8',
  '₉': '9',
}

/** Text in a form where "x²" and "x^2", "H₂O" and "H2O" are the same, and spacing does not matter. */
export function plainMath(t: string): string {
  let s = t.replace(
    /[⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺ⁿ]+/g,
    (m) => `^${[...m].map((c) => SUP[c]).join('')}`,
  )
  s = s.replace(/[₀-₉]+/g, (m) => [...m].map((c) => SUB[c]).join(''))
  s = s.replace(/\^\(([^()]+)\)/g, '^$1')
  return s.replace(/\s+/g, ' ').trim()
}

// ---------------------------------------------------------------- creating

export interface CreateInput {
  schoolSubjectId: string
  title: string
  files: Array<UploadFile>
  keyFiles?: Array<UploadFile>
}

async function putAll(
  db: Db,
  scope: SchoolScope,
  paperId: string,
  kind: 'paper' | 'key',
  files: ReadonlyArray<UploadFile>,
): Promise<Array<string>> {
  void db
  const store = getScanStore()
  const keys: Array<string> = []
  for (const [i, f] of files.entries()) {
    const key = ownPaperKey(scope.schoolId, paperId, kind, i)
    await store.put(key, encryptScan(f.bytes))
    keys.push(key)
  }
  return keys
}

export async function createOwnPaper(
  db: Db,
  scope: SchoolScope,
  input: CreateInput,
): Promise<{ paperId: string }> {
  const { ss, grade, subject } = await loadSubject(
    db,
    scope,
    input.schoolSubjectId,
  )
  storageOrRefuse(getScanStore)
  const title = input.title.trim().slice(0, 120)
  if (title.length < 2)
    throw new SchoolError(
      'invalid',
      'Give the paper a name, like “Unit Test 2”.',
    )
  const kind = detectKind(input.files)
  checkSize(input.files)
  const keyFiles = input.keyFiles ?? []
  let keyKind: 'docx' | 'pdf' | 'images' | null = null
  if (keyFiles.length > 0) {
    keyKind = detectKind(keyFiles)
    checkSize([...input.files, ...keyFiles])
  }

  // find out what we are looking at before anything is saved
  let prepared:
    | { source_kind: 'prepplan_docx'; parsed: Array<ParsedQuestion> }
    | { source_kind: 'docx' | 'pdf'; chunks: Array<string> }
    | { source_kind: 'images' }
  if (kind === 'docx') {
    const paras = await docxParagraphs(input.files[0].bytes).catch(() => {
      throw new SchoolError(
        'invalid',
        'We could not open that Word file. Open it in Word and save it again as .docx.',
      )
    })
    const parsed = parsePrepPlanParagraphs(paras)
    if (parsed && parsed.length > 0)
      prepared = { source_kind: 'prepplan_docx', parsed }
    else {
      const text = paras
        .map((p) => p.text.replace(/\t/g, '  '))
        .filter((l) => l.trim() !== '')
        .join('\n')
      if (text.trim().length < 40)
        throw new SchoolError(
          'invalid',
          'That Word file has almost no text. Check it is the right file.',
        )
      prepared = { source_kind: 'docx', chunks: chunkText(text) }
    }
  } else if (kind === 'pdf') {
    const { text } = await pdfToText(input.files[0].bytes).catch(() => {
      throw new SchoolError('invalid', 'We could not open that PDF.')
    })
    if (text.trim().length < 200)
      throw new SchoolError(
        'invalid',
        'This PDF is a picture of a paper, not text. Upload the Word file, or photos of each page (JPG or PNG).',
      )
    prepared = { source_kind: 'pdf', chunks: chunkText(text) }
  } else prepared = { source_kind: 'images' }

  const paper = await schoolOwnPapersRepository.insert(db, scope, {
    class_id: ss.class_id,
    school_subject_id: ss.id,
    title,
    source_kind: prepared.source_kind,
    source_names: JSON.stringify(input.files.map((f) => f.name.slice(0, 120))),
    status: 'reading',
    phase: 'read',
    created_by_user_id: scope.userId,
    key_kind: keyKind,
  })
  const keys = await putAll(db, scope, paper.id, 'paper', input.files)
  const keyKeys =
    keyFiles.length > 0
      ? await putAll(db, scope, paper.id, 'key', keyFiles)
      : []
  await schoolOwnPapersRepository.update(db, scope, paper.id, {
    source_keys: JSON.stringify(keys),
    key_keys: JSON.stringify(keyKeys),
  })

  if (prepared.source_kind === 'prepplan_docx')
    await insertPrepPlanQuestions(db, scope, paper.id, prepared.parsed)
  else if (prepared.source_kind === 'images')
    await schoolOwnPapersRepository.update(db, scope, paper.id, {
      progress_total: input.files.length,
    })
  else
    await schoolOwnPapersRepository.update(db, scope, paper.id, {
      read_chunks: JSON.stringify(prepared.chunks),
      progress_total: prepared.chunks.length,
    })
  await auditSchool(
    db,
    scope,
    'school.own_paper_uploaded',
    'school_own_papers',
    paper.id,
    null,
    {
      kind: prepared.source_kind,
      files: input.files.length,
      key_files: keyFiles.length,
      subject: subject.name,
      grade,
    },
  )
  return { paperId: paper.id }
}

/** An edited PrepPlan paper is read exactly: no AI. Each question is matched to the printed one it came from. */
async function insertPrepPlanQuestions(
  db: Db,
  scope: SchoolScope,
  paperId: string,
  parsed: Array<ParsedQuestion>,
) {
  const ids = parsed.map((q) => q.ppqId).filter((x): x is string => x !== null)
  const rows = ids.length
    ? await db
        .selectFrom('school_exam_questions as eq')
        .innerJoin('questions as q', 'q.id', 'eq.question_id')
        .select([
          'eq.id as eqId',
          'eq.exam_id',
          'eq.chapter_id',
          'eq.marks',
          'q.id as questionId',
          'q.text',
          'q.answer',
          'q.type',
        ])
        .where('eq.school_id', '=', scope.schoolId)
        .execute()
    : []
  const byHex = new Map(rows.map((r) => [r.eqId.replace(/-/g, ''), r]))
  const qids = [...new Set(rows.map((r) => r.questionId))]
  const options = qids.length
    ? await db
        .selectFrom('question_options')
        .select(['question_id', 'label', 'text', 'is_correct', 'order_index'])
        .where('question_id', 'in', qids)
        .execute()
    : []
  const steps = qids.length
    ? await db
        .selectFrom('question_step_marks')
        .select(['question_id', 'step_no', 'description', 'marks'])
        .where('question_id', 'in', qids)
        .execute()
    : []
  let examId: string | null = null
  let total = 0
  const seenGroup = new Set<string>()
  for (const [i, q] of parsed.entries()) {
    const src = q.ppqId ? byHex.get(q.ppqId) : undefined
    if (src) examId = examId ?? src.exam_id
    const srcOptions = src
      ? options
          .filter((o) => o.question_id === src.questionId)
          .sort((a, b) => a.order_index - b.order_index)
      : []
    const sameOptions =
      srcOptions.length === q.options.length &&
      srcOptions.every(
        (o, k) =>
          o.label === q.options[k].label &&
          plainMath(o.text) === plainMath(q.options[k].text),
      )
    const changed = src
      ? plainMath(src.text) !== plainMath(q.text) ||
        Number(src.marks) !== q.marks ||
        (srcOptions.length > 0 && !sameOptions)
      : false
    const correct = srcOptions.find((o) => o.is_correct)
    const keyText =
      src && !changed
        ? correct
          ? `Correct option: (${correct.label}) ${correct.text}`
          : src.answer
        : null
    const keySteps =
      src && !changed
        ? steps
            .filter((s) => s.question_id === src.questionId)
            .sort((a, b) => a.step_no - b.step_no)
            .map((s) => ({
              description: s.description,
              marks: Number(s.marks),
            }))
        : []
    await schoolOwnQuestionsRepository.insert(db, scope, {
      paper_id: paperId,
      position: i + 1,
      section: q.section,
      type: src?.type ?? (q.options.length > 0 ? 'mcq' : 'short_answer'),
      text: q.text,
      original_text: src ? src.text : q.text,
      options: JSON.stringify(q.options),
      marks: String(q.marks),
      or_group: q.orGroup,
      chapter_id: src?.chapter_id ?? null,
      map_confidence: src ? '1' : null,
      source_exam_question_id: src?.eqId ?? null,
      changed_from_source: changed,
      key_text: keyText,
      key_steps: JSON.stringify(keySteps),
      key_source: keyText ? 'bank' : null,
      key_status: keyText ? 'approved' : 'none',
    })
    // an OR pair is one mark
    if (q.orGroup) {
      if (!seenGroup.has(q.orGroup)) {
        seenGroup.add(q.orGroup)
        total += q.marks
      }
    } else total += q.marks
  }
  const missing =
    parsed.length - parsed.filter((q) => q.ppqId && byHex.get(q.ppqId)).length
  void missing
  const needKey = await schoolOwnQuestionsRepository.forPaper(
    db,
    scope,
    paperId,
  )
  const draftCount = needKey.filter((q) => q.key_status === 'none').length
  await schoolOwnPapersRepository.update(db, scope, paperId, {
    exam_id: examId,
    total_marks: String(total),
    phase: draftCount > 0 ? 'draft' : 'done',
    status: draftCount > 0 ? 'reading' : 'needs_review',
    progress: 0,
    progress_total: Math.ceil(draftCount / DRAFT_BATCH),
  })
}

// ---------------------------------------------------------------- reading, one small step at a time

const MAP_BATCH = 25
const DRAFT_BATCH = 8

export interface PaperProgress {
  paperId: string
  status: string
  phase: string
  progress: number
  total: number
  message: string | null
}

const progressOf = (p: {
  id: string
  status: string
  phase: string
  progress: number
  progress_total: number
  message: string | null
}): PaperProgress => ({
  paperId: p.id,
  status: p.status,
  phase: p.phase,
  progress: p.progress,
  total: p.progress_total,
  message: p.message,
})

async function loadFile(key: string): Promise<Buffer> {
  const sealed = await getScanStore().get(key)
  if (!sealed)
    throw new SchoolError(
      'not_found',
      'The uploaded file is no longer kept. Upload the paper again.',
    )
  return decryptScan(sealed)
}

const toImage = async (key: string): Promise<AiImage> => {
  const bytes = await loadFile(key)
  const png = bytes.subarray(0, 4).toString('hex') === '89504e47'
  const webp = bytes.subarray(8, 12).toString() === 'WEBP'
  return {
    mediaType: png ? 'image/png' : webp ? 'image/webp' : 'image/jpeg',
    base64: bytes.toString('base64'),
  }
}

async function moveTo(
  db: Db,
  scope: SchoolScope,
  paperId: string,
  phase: 'map' | 'key' | 'draft' | 'done',
  total: number,
) {
  await schoolOwnPapersRepository.update(db, scope, paperId, {
    phase,
    progress: 0,
    progress_total: total,
    message: null,
    ...(phase === 'done' ? { status: 'needs_review' as const } : {}),
  })
}

/** Does the next piece of work for a paper (one AI call at most) and says how far it is. Safe to repeat. */
export async function stepOwnPaper(
  db: Db,
  scope: SchoolScope,
  paperId: string,
  aiOverride?: OwnPaperAi,
): Promise<PaperProgress> {
  const paper = await loadOwnPaper(db, scope, paperId)
  if (paper.status !== 'reading') return progressOf(paper)
  const ai = aiOverride ?? (await aiFor(db, scope))
  const questions = await schoolOwnQuestionsRepository.forPaper(
    db,
    scope,
    paperId,
  )
  const advance = async (extra: Record<string, unknown> = {}) => {
    // only the request that still sees the old progress may move it on (two taps at once do one step)
    const r = await db
      .updateTable('school_own_papers')
      .set({ progress: paper.progress + 1, message: null, ...extra })
      .where('id', '=', paperId)
      .where('school_id', '=', scope.schoolId)
      .where('progress', '=', paper.progress)
      .where('phase', '=', paper.phase)
      .executeTakeFirst()
    return Number(r.numUpdatedRows) > 0
  }
  try {
    if (paper.phase === 'read') {
      if (!ai.available())
        throw new SchoolError(
          'conflict',
          'The paper reader is not switched on yet. Please write to support@prepplan.in.',
        )
      const next = questions.length + 1
      const keys = paper.source_keys as unknown as Array<string>
      const chunks = paper.read_chunks as unknown as Array<string>
      const raw =
        paper.source_kind === 'images'
          ? await ai.extract({
              image: await toImage(keys[paper.progress]),
              fromNumber: next,
              subject: paper.subject.name,
              grade: paper.grade,
            })
          : await ai.extract({
              text: chunks[paper.progress],
              fromNumber: next,
              subject: paper.subject.name,
              grade: paper.grade,
            })
      const { questions: found, dropped } = parseExtraction(raw)
      if (
        !(await advance({
          message:
            dropped > 0
              ? `${dropped} item${dropped === 1 ? '' : 's'} on this part could not be read as a question.`
              : null,
        }))
      )
        return progressOf(await loadOwnPaper(db, scope, paperId))
      let pos = questions.length
      let prevId = questions.at(-1)?.id ?? null
      let prevGroup = questions.at(-1)?.or_group ?? null
      let prevMarks = Number(questions.at(-1)?.marks ?? 0)
      for (const q of found) {
        pos += 1
        let group: string | null = null
        if (q.or_with_previous && prevId) {
          // an "OR" alternative joins the question before it into one pair
          group = prevGroup ?? `or${pos - 1}`
          if (!prevGroup)
            await schoolOwnQuestionsRepository.update(db, scope, prevId, {
              or_group: group,
            })
        }
        const marks = group && q.marks === 0 ? prevMarks : q.marks
        const row = await schoolOwnQuestionsRepository.insert(db, scope, {
          paper_id: paperId,
          position: pos,
          section: q.section,
          type: q.type,
          text: q.text.trim(),
          original_text: q.text.trim(),
          options: JSON.stringify(q.options),
          marks: String(marks),
          or_group: group,
        })
        prevId = row.id
        prevGroup = group
        prevMarks = marks
      }
      if (paper.progress + 1 >= paper.progress_total) {
        const all = await schoolOwnQuestionsRepository.forPaper(
          db,
          scope,
          paperId,
        )
        if (all.length === 0) {
          await schoolOwnPapersRepository.update(db, scope, paperId, {
            status: 'failed',
            message:
              'We could not find any question in this file. Check it is the question paper, or upload photos of the pages.',
          })
        } else {
          await schoolOwnPapersRepository.update(db, scope, paperId, {
            total_marks: String(totalOf(all)),
          })
          await moveTo(
            db,
            scope,
            paperId,
            'map',
            Math.ceil(all.length / MAP_BATCH),
          )
        }
      }
    } else if (paper.phase === 'map') {
      const chapters = await bankRepository.chaptersForSubject(
        db,
        paper.subject.id,
      )
      const coded = chapters.map((c, i) => ({
        code: `C${i + 1}`,
        id: c.id,
        label: `${c.sourceTitle}, Part ${c.part}, Chapter ${c.chapterNo}: ${c.name}`,
      }))
      const batch = questions
        .slice(paper.progress * MAP_BATCH, (paper.progress + 1) * MAP_BATCH)
        .filter((q) => q.chapter_id === null)
      if (batch.length > 0 && coded.length > 0) {
        const raw = await ai.map({
          questions: batch.map((q) => ({ n: q.position, text: q.text })),
          chapters: coded.map((c) => ({ code: c.code, label: c.label })),
          subject: paper.subject.name,
          grade: paper.grade,
        })
        const parsed = MappingSchema.parse(JSON.parse(raw))
        if (!(await advance()))
          return progressOf(await loadOwnPaper(db, scope, paperId))
        for (const m of parsed) {
          const q = batch.find((x) => x.position === m.q)
          const ch = coded.find((c) => c.code === m.chapter)
          if (q && ch)
            await schoolOwnQuestionsRepository.update(db, scope, q.id, {
              chapter_id: ch.id,
              map_confidence: String(Math.round(m.confidence * 1000) / 1000),
            })
        }
      } else if (!(await advance()))
        return progressOf(await loadOwnPaper(db, scope, paperId))
      if (paper.progress + 1 >= paper.progress_total)
        await toKeyPhase(db, scope, paper)
    } else if (paper.phase === 'key') {
      const keyKeys = paper.key_keys as unknown as Array<string>
      const kind = paper.key_kind
      const qlist = questions.map((q) => ({ n: q.position, text: q.text }))
      let raw: string
      if (kind === 'images')
        raw = await ai.readKey({
          image: await toImage(keyKeys[paper.progress]),
          questions: qlist,
        })
      else {
        const text = await keyFileText(keyKeys[0], kind)
        raw = await ai.readKey({
          text: chunkText(text, 6000)[paper.progress] ?? '',
          questions: qlist,
        })
      }
      const parsed = KeySchema.parse(JSON.parse(raw))
      if (!(await advance()))
        return progressOf(await loadOwnPaper(db, scope, paperId))
      for (const k of parsed) {
        const q = questions.find((x) => x.position === k.q)
        if (q && q.key_status === 'none')
          await schoolOwnQuestionsRepository.update(db, scope, q.id, {
            key_text: k.answer,
            key_steps: JSON.stringify(k.steps),
            key_source: 'uploaded',
            key_status: 'draft',
          })
      }
      if (paper.progress + 1 >= paper.progress_total)
        await toDraftPhase(db, scope, paperId)
    } else if (paper.phase === 'draft') {
      const need = questions
        .filter((q) => q.key_status === 'none')
        .slice(0, DRAFT_BATCH)
      if (need.length > 0 && ai.available()) {
        const raw = await ai.draftKey({
          questions: need.map((q) => ({
            n: q.position,
            text: q.text,
            marks: Number(q.marks),
            type: q.type,
            options: q.options as unknown as Array<{
              label: string
              text: string
            }>,
          })),
          subject: paper.subject.name,
          grade: paper.grade,
        })
        const parsed = KeySchema.parse(JSON.parse(raw))
        if (!(await advance()))
          return progressOf(await loadOwnPaper(db, scope, paperId))
        for (const k of parsed) {
          const q = need.find((x) => x.position === k.q)
          if (q)
            await schoolOwnQuestionsRepository.update(db, scope, q.id, {
              key_text: k.answer,
              key_steps: JSON.stringify(cleanSteps(k.steps, Number(q.marks))),
              key_source: 'ai_draft',
              key_status: 'draft',
            })
        }
      } else if (
        !(await advance({
          message:
            need.length > 0
              ? 'The AI drafter is not switched on: write the answers yourself.'
              : null,
        }))
      )
        return progressOf(await loadOwnPaper(db, scope, paperId))
      const left = (
        await schoolOwnQuestionsRepository.forPaper(db, scope, paperId)
      ).filter((q) => q.key_status === 'none').length
      if (
        paper.progress + 1 >= paper.progress_total ||
        left === 0 ||
        !ai.available()
      )
        await moveTo(db, scope, paperId, 'done', paper.progress_total)
    }
  } catch (e) {
    if (e instanceof SchoolError) {
      await schoolOwnPapersRepository.update(db, scope, paperId, {
        message: e.message,
      })
      throw e
    }
    const message =
      e instanceof SyntaxError || (e instanceof Error && e.name === 'ZodError')
        ? 'The reader gave an answer we could not use. Press “Try again”.'
        : 'Something went wrong while reading. Press “Try again”.'
    await schoolOwnPapersRepository.update(db, scope, paperId, { message })
    throw new SchoolError('conflict', message)
  }
  return progressOf(await loadOwnPaper(db, scope, paperId))
}

async function keyFileText(key: string, kind: string | null): Promise<string> {
  const bytes = await loadFile(key)
  return kind === 'pdf' ? (await pdfToText(bytes)).text : docxToText(bytes)
}

/** After mapping: read the school's own key if it sent one, otherwise go straight to drafting. */
async function toKeyPhase(db: Db, scope: SchoolScope, paper: PaperRow) {
  const keyKeys = paper.key_keys as unknown as Array<string>
  if (keyKeys.length === 0) return toDraftPhase(db, scope, paper.id)
  let total = keyKeys.length
  if (paper.key_kind !== 'images')
    total = Math.max(
      1,
      chunkText(await keyFileText(keyKeys[0], paper.key_kind), 6000).length,
    )
  await moveTo(db, scope, paper.id, 'key', total)
}

async function toDraftPhase(db: Db, scope: SchoolScope, paperId: string) {
  const left = (
    await schoolOwnQuestionsRepository.forPaper(db, scope, paperId)
  ).filter((q) => q.key_status === 'none').length
  if (left === 0) return moveTo(db, scope, paperId, 'done', 0)
  await moveTo(db, scope, paperId, 'draft', Math.ceil(left / DRAFT_BATCH))
}

/** Marks that add up to the question's marks, or none (a teacher then writes the steps). */
function cleanSteps(
  steps: Array<{ description: string; marks: number }>,
  marks: number,
) {
  const sum = steps.reduce((n, s) => n + s.marks, 0)
  return Math.abs(sum - marks) < 0.01 ? steps : []
}

function totalOf(
  qs: ReadonlyArray<{ marks: string; or_group: string | null }>,
): number {
  const seen = new Set<string>()
  let total = 0
  for (const q of qs) {
    if (q.or_group) {
      if (seen.has(q.or_group)) continue
      seen.add(q.or_group)
    }
    total += Number(q.marks)
  }
  return total
}

// ---------------------------------------------------------------- the teacher's review

export interface OwnQuestionView {
  id: string
  position: number
  section: string
  type: string
  text: string
  options: Array<{ label: string; text: string }>
  marks: number
  orGroup: string | null
  chapterId: string | null
  chapterLabel: string | null
  confidence: number | null
  /** Needs a teacher's eye: no chapter, or a weak guess. */
  check: boolean
  changedFromSource: boolean
  fromPrepPlan: boolean
  keyText: string | null
  keySteps: Array<{ description: string; marks: number }>
  keySource: string | null
  keyStatus: string
  /** The teacher's note to whoever marks this question (the AI reads it too). */
  markingNote: string | null
}

export interface OwnPaperView {
  id: string
  title: string
  status: string
  phase: string
  progress: number
  total: number
  message: string | null
  sourceKind: string
  subjectName: string
  grade: number
  totalMarks: number | null
  approvedAt: string | null
  questions: Array<OwnQuestionView>
  chapters: Array<{ id: string; label: string }>
  summary: {
    questions: number
    toCheck: number
    changed: number
    keysApproved: number
    keysDraft: number
    keysNone: number
  }
  canApprove: boolean
  markable: boolean
}

export async function getOwnPaper(
  db: Db,
  scope: SchoolScope,
  paperId: string,
): Promise<OwnPaperView> {
  const paper = await loadOwnPaper(db, scope, paperId)
  const qs = await schoolOwnQuestionsRepository.forPaper(db, scope, paperId)
  const chapters = (
    await bankRepository.chaptersForSubject(db, paper.subject.id)
  ).map((c) => ({
    id: c.id,
    label: `Part ${c.part} · Chapter ${c.chapterNo} · ${c.name}`,
  }))
  const label = new Map(chapters.map((c) => [c.id, c.label]))
  const questions: Array<OwnQuestionView> = qs.map((q) => {
    const conf = q.map_confidence === null ? null : Number(q.map_confidence)
    return {
      id: q.id,
      position: q.position,
      section: q.section,
      type: q.type,
      text: q.text,
      options: q.options as unknown as Array<{ label: string; text: string }>,
      marks: Number(q.marks),
      orGroup: q.or_group,
      chapterId: q.chapter_id,
      chapterLabel: q.chapter_id ? (label.get(q.chapter_id) ?? null) : null,
      confidence: conf,
      check: q.chapter_id === null || (conf !== null && conf < 0.6),
      changedFromSource: q.changed_from_source,
      fromPrepPlan: q.source_exam_question_id !== null,
      keyText: q.key_text,
      keySteps: q.key_steps as unknown as Array<{
        description: string
        marks: number
      }>,
      keySource: q.key_source,
      keyStatus: q.key_status,
      markingNote: q.marking_note,
    }
  })
  const keysApproved = questions.filter(
    (q) => q.keyStatus === 'approved',
  ).length
  const done = paper.phase === 'done' && paper.status === 'needs_review'
  return {
    id: paper.id,
    title: paper.title,
    status: paper.status,
    phase: paper.phase,
    progress: paper.progress,
    total: paper.progress_total,
    message: paper.message,
    sourceKind: paper.source_kind,
    subjectName: paper.subject.name,
    grade: paper.grade,
    totalMarks: paper.total_marks === null ? null : Number(paper.total_marks),
    approvedAt: paper.approved_at ? paper.approved_at.toISOString() : null,
    questions,
    chapters,
    summary: {
      questions: questions.length,
      toCheck: questions.filter((q) => q.check).length,
      changed: questions.filter((q) => q.changedFromSource).length,
      keysApproved,
      keysDraft: questions.filter((q) => q.keyStatus === 'draft').length,
      keysNone: questions.filter((q) => q.keyStatus === 'none').length,
    },
    canApprove:
      done && questions.length > 0 && questions.every((q) => q.marks > 0),
    markable:
      paper.status === 'approved' &&
      questions.length > 0 &&
      keysApproved === questions.length,
  }
}

export async function listOwnPapers(db: Db, scope: SchoolScope) {
  if (scope.role !== 'school_admin' && scope.role !== 'teacher')
    throw new SchoolError(
      'forbidden',
      'Only the school office or a teacher can do this.',
    )
  const rows = await schoolOwnPapersRepository.list(db, scope)
  const out: Array<{
    id: string
    title: string
    status: string
    subjectName: string
    grade: number
    createdAt: string
    totalMarks: number | null
  }> = []
  for (const r of rows
    .filter((x) => !x.archived_at)
    .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())) {
    try {
      const p = await loadOwnPaper(db, scope, r.id)
      out.push({
        id: p.id,
        title: p.title,
        status: p.status,
        subjectName: p.subject.name,
        grade: p.grade,
        createdAt: p.created_at.toISOString(),
        totalMarks: p.total_marks === null ? null : Number(p.total_marks),
      })
    } catch {
      // a teacher sees only the papers of the subjects she teaches
    }
  }
  return out
}

export interface QuestionPatch {
  text?: string
  marks?: number
  section?: string
  chapterId?: string | null
  options?: Array<{ label: string; text: string }>
}

function assertEditable(paper: PaperRow) {
  if (paper.status === 'approved')
    throw new SchoolError(
      'conflict',
      'This paper is approved and cannot be changed. Make a copy by uploading it again.',
    )
  if (paper.status === 'failed')
    throw new SchoolError(
      'conflict',
      'This paper could not be read. Upload it again.',
    )
}

export async function updateOwnQuestion(
  db: Db,
  scope: SchoolScope,
  paperId: string,
  questionId: string,
  patch: QuestionPatch,
) {
  const paper = await loadOwnPaper(db, scope, paperId)
  assertEditable(paper)
  const q = await schoolOwnQuestionsRepository.findById(db, scope, questionId)
  if (!q || q.paper_id !== paperId || q.removed_at)
    throw new SchoolError('not_found', 'Question not found.')
  const set: Record<string, unknown> = { edited_by_user_id: scope.userId }
  if (patch.text !== undefined) {
    const t = patch.text.trim()
    if (t.length < 2 || t.length > 4000)
      throw new SchoolError(
        'invalid',
        'A question needs between 2 and 4000 letters.',
      )
    set.text = t
    // a changed question's key must be looked at again
    if (plainMath(t) !== plainMath(q.text) && q.key_status === 'approved')
      set.key_status = 'draft'
  }
  if (patch.marks !== undefined) {
    if (!Number.isFinite(patch.marks) || patch.marks < 0.5 || patch.marks > 100)
      throw new SchoolError('invalid', 'Marks must be between 0.5 and 100.')
    set.marks = String(patch.marks)
  }
  if (patch.section !== undefined)
    set.section = patch.section.trim().slice(0, 200)
  if (patch.options !== undefined) {
    if (
      patch.options.length > 6 ||
      patch.options.some(
        (o) => !o.label.trim() || o.label.length > 3 || o.text.length > 600,
      )
    )
      throw new SchoolError(
        'invalid',
        'Check the options: a letter and the text for each.',
      )
    set.options = JSON.stringify(
      patch.options.map((o) => ({
        label: o.label.trim(),
        text: o.text.trim(),
      })),
    )
  }
  if (patch.chapterId !== undefined) {
    if (patch.chapterId !== null) {
      const ok = (
        await bankRepository.chaptersForSubject(db, paper.subject.id)
      ).some((c) => c.id === patch.chapterId)
      if (!ok)
        throw new SchoolError('invalid', 'That chapter is not in this subject.')
    }
    set.chapter_id = patch.chapterId
    set.map_confidence = patch.chapterId === null ? null : '1'
  }
  await schoolOwnQuestionsRepository.update(db, scope, questionId, set)
  await refreshTotal(db, scope, paperId)
}

export async function addOwnQuestion(
  db: Db,
  scope: SchoolScope,
  paperId: string,
  input: {
    text: string
    marks: number
    section?: string
    chapterId?: string | null
  },
) {
  const paper = await loadOwnPaper(db, scope, paperId)
  assertEditable(paper)
  const t = input.text.trim()
  if (t.length < 2 || t.length > 4000)
    throw new SchoolError(
      'invalid',
      'A question needs between 2 and 4000 letters.',
    )
  if (!Number.isFinite(input.marks) || input.marks < 0.5 || input.marks > 100)
    throw new SchoolError('invalid', 'Marks must be between 0.5 and 100.')
  const qs = await schoolOwnQuestionsRepository.forPaper(db, scope, paperId)
  const row = await schoolOwnQuestionsRepository.insert(db, scope, {
    paper_id: paperId,
    position: (qs.at(-1)?.position ?? 0) + 1,
    section: input.section?.trim().slice(0, 200) ?? qs.at(-1)?.section ?? '',
    text: t,
    original_text: t,
    marks: String(input.marks),
    chapter_id: input.chapterId ?? null,
    map_confidence: input.chapterId ? '1' : null,
    edited_by_user_id: scope.userId,
  })
  await refreshTotal(db, scope, paperId)
  return { id: row.id }
}

export async function removeOwnQuestion(
  db: Db,
  scope: SchoolScope,
  paperId: string,
  questionId: string,
) {
  const paper = await loadOwnPaper(db, scope, paperId)
  assertEditable(paper)
  const q = await schoolOwnQuestionsRepository.findById(db, scope, questionId)
  if (!q || q.paper_id !== paperId || q.removed_at)
    throw new SchoolError('not_found', 'Question not found.')
  await schoolOwnQuestionsRepository.update(db, scope, questionId, {
    removed_at: new Date(),
    edited_by_user_id: scope.userId,
  })
  await auditSchool(
    db,
    scope,
    'school.own_question_removed',
    'school_own_questions',
    questionId,
    { position: q.position },
    null,
  )
  await refreshTotal(db, scope, paperId)
}

async function refreshTotal(db: Db, scope: SchoolScope, paperId: string) {
  const qs = await schoolOwnQuestionsRepository.forPaper(db, scope, paperId)
  await schoolOwnPapersRepository.update(db, scope, paperId, {
    total_marks: String(totalOf(qs)),
  })
}

/** "Yes, this is the paper." Freezes the list. Marking still waits for every key to be approved. */
export async function approveOwnPaper(
  db: Db,
  scope: SchoolScope,
  paperId: string,
): Promise<void> {
  const paper = await loadOwnPaper(db, scope, paperId)
  if (paper.status === 'approved')
    throw new SchoolError('conflict', 'This paper is already approved.')
  if (paper.status !== 'needs_review' || paper.phase !== 'done')
    throw new SchoolError(
      'conflict',
      'The paper is still being read. Wait until it says it is ready to check.',
    )
  const qs = await schoolOwnQuestionsRepository.forPaper(db, scope, paperId)
  if (qs.length === 0)
    throw new SchoolError('invalid', 'The paper has no questions.')
  if (qs.some((q) => Number(q.marks) <= 0))
    throw new SchoolError('invalid', 'Every question needs marks.')
  await schoolOwnPapersRepository.update(db, scope, paperId, {
    status: 'approved',
    approved_at: new Date(),
    approved_by_user_id: scope.userId,
    total_marks: String(totalOf(qs)),
  })
  await auditSchool(
    db,
    scope,
    'school.own_paper_approved',
    'school_own_papers',
    paperId,
    null,
    {
      questions: qs.length,
      marks: totalOf(qs),
      unmapped: qs.filter((q) => q.chapter_id === null).length,
    },
  )
}

// ---------------------------------------------------------------- the answer key

export async function setOwnKey(
  db: Db,
  scope: SchoolScope,
  paperId: string,
  questionId: string,
  input: {
    answer: string
    steps?: Array<{ description: string; marks: number }>
    approve?: boolean
    /** undefined leaves the note as it is; an empty text clears it. */
    note?: string | null
  },
) {
  const paper = await loadOwnPaper(db, scope, paperId)
  if (paper.status === 'failed')
    throw new SchoolError(
      'conflict',
      'This paper could not be read. Upload it again.',
    )
  const q = await schoolOwnQuestionsRepository.findById(db, scope, questionId)
  if (!q || q.paper_id !== paperId || q.removed_at)
    throw new SchoolError('not_found', 'Question not found.')
  const answer = input.answer.trim()
  if (answer.length < 1 || answer.length > 3000)
    throw new SchoolError('invalid', 'Write the answer (up to 3000 letters).')
  const steps = (input.steps ?? []).filter((s) => s.description.trim() !== '')
  if (steps.length > 0) {
    if (steps.some((s) => !Number.isFinite(s.marks) || s.marks < 0))
      throw new SchoolError('invalid', 'Check the marks of each step.')
    const sum = steps.reduce((n, s) => n + s.marks, 0)
    if (Math.abs(sum - Number(q.marks)) > 0.01)
      throw new SchoolError(
        'invalid',
        `The steps add up to ${sum} marks but the question is worth ${Number(q.marks)}.`,
      )
  }
  let markingNote: { marking_note: string | null } | Record<string, never> = {}
  if (input.note !== undefined) {
    const note = (input.note ?? '').trim()
    if (note.length > 400)
      throw new SchoolError('invalid', 'The marking note can be up to 400 letters.')
    markingNote = { marking_note: note === '' ? null : note }
  }
  await schoolOwnQuestionsRepository.update(db, scope, questionId, {
    ...markingNote,
    key_text: answer,
    key_steps: JSON.stringify(
      steps.map((s) => ({ description: s.description.trim(), marks: s.marks })),
    ),
    key_source: 'teacher',
    key_status: input.approve ? 'approved' : 'draft',
    key_approved_by_user_id: input.approve ? scope.userId : null,
    key_approved_at: input.approve ? new Date() : null,
    edited_by_user_id: scope.userId,
  })
  await auditSchool(
    db,
    scope,
    input.approve ? 'school.own_key_approved' : 'school.own_key_edited',
    'school_own_questions',
    questionId,
    null,
    { by: 'teacher' },
  )
}

/** The teacher says each of these keys is right (all of them, or the listed questions). */
export async function approveOwnKeys(
  db: Db,
  scope: SchoolScope,
  paperId: string,
  questionIds: 'all' | Array<string>,
): Promise<{ approved: number }> {
  const paper = await loadOwnPaper(db, scope, paperId)
  if (paper.status === 'failed')
    throw new SchoolError(
      'conflict',
      'This paper could not be read. Upload it again.',
    )
  const qs = (
    await schoolOwnQuestionsRepository.forPaper(db, scope, paperId)
  ).filter(
    (q) =>
      q.key_status === 'draft' &&
      q.key_text !== null &&
      (questionIds === 'all' || questionIds.includes(q.id)),
  )
  const now = new Date()
  for (const q of qs)
    await schoolOwnQuestionsRepository.update(db, scope, q.id, {
      key_status: 'approved',
      key_approved_by_user_id: scope.userId,
      key_approved_at: now,
    })
  if (qs.length > 0)
    await auditSchool(
      db,
      scope,
      'school.own_keys_approved',
      'school_own_papers',
      paperId,
      null,
      {
        count: qs.length,
        ai_drafts: qs.filter((q) => q.key_source === 'ai_draft').length,
      },
    )
  return { approved: qs.length }
}

/**
 * The one door every marking step goes through: the paper must be approved by a teacher AND every
 * question's answer key must be approved by a teacher (or be the bank's own reviewed answer). Nothing
 * that is only a draft, and nothing the AI wrote on its own, can be marked against.
 */
export async function assertPaperReadyForMarking(
  db: Db,
  scope: SchoolScope,
  paperId: string,
): Promise<void> {
  const paper = await loadOwnPaper(db, scope, paperId)
  if (paper.status !== 'approved')
    throw new SchoolError(
      'conflict',
      'This paper has not been approved yet, so nothing can be marked from it.',
    )
  const qs = await schoolOwnQuestionsRepository.forPaper(db, scope, paperId)
  const pending = qs.filter((q) => q.key_status !== 'approved').length
  if (qs.length === 0 || pending > 0)
    throw new SchoolError(
      'conflict',
      `The answer key is not approved yet (${pending} of ${qs.length} questions still need a teacher's yes). Nothing can be marked until every key is approved.`,
    )
}
