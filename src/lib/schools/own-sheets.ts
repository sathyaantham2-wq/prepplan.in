import { randomUUID } from 'node:crypto'
import { checkPage, sheetCheckAiFor } from './upload-checks'
import type { PageCheckVerdict, SheetCheckAi } from './upload-checks'
import type { Db } from '../../db/connection'
import {
  examPrintRepository,
  schoolOwnCoversRepository,
  schoolOwnSheetsRepository,
  schoolUploadChecksRepository,
  schoolScanChunksRepository,
  schoolSectionsRepository,
} from '../../db/repositories'
import type { SchoolScope } from '../../db/school-scope'
import {
  decryptScan,
  encryptScan,
  signedScanPageUrl,
  verifyScanPageSignature,
} from '../scan-crypto'
import { chunkKey, getScanStore } from '../scan-storage'
import { renderHtmlToPdf } from '../pdf/render'
import { countPdfPages } from '../pdf/page-count'
import { SchoolError, auditSchool, storageOrRefuse } from './common'
import { buildCoversHtml, ownCoverToken, parseCoverQr } from './own-cover'
import { loadOwnPaper } from './own-paper-service'
import { readBookletPage } from './page-reader'
import { MAX_CHUNK_BYTES, MAX_SCAN_BYTES } from './scan-service'

// Answer sheets written on a school's OWN paper. PrepPlan prints a QR cover page per student; the school
// staples it on top of her sheets and scans or photographs the whole stack IN ORDER, cover first. The
// cover's code names the student; every page after it, up to the next cover, is hers. When a student has
// no cover, the teacher names her (one upload per student, files named by roll number) or the page waits
// as "unplaced". A cover or page from another school or another paper is refused and nothing of it is
// kept. Marking waits for step 4 and for the real-photo check of the reader.

type Paper = Awaited<ReturnType<typeof loadOwnPaper>>

/** The sections of the paper's class the person may handle: the office all of them, a teacher hers. */
async function sectionsFor(db: Db, scope: SchoolScope, paper: Paper) {
  const all = (await schoolSectionsRepository.list(db, scope)).filter(
    (s) => s.class_id === paper.class_id,
  )
  if (scope.pairs === 'all') return all
  const mine = new Set(
    scope.pairs
      .filter((p) => p.subjectId === paper.subject.id)
      .map((p) => p.sectionId),
  )
  return all.filter((s) => mine.has(s.id))
}

async function studentsFor(
  db: Db,
  scope: SchoolScope,
  paper: Paper,
  sectionId?: string,
) {
  const secs = await sectionsFor(db, scope, paper)
  const wanted = sectionId ? secs.filter((s) => s.id === sectionId) : secs
  if (sectionId && wanted.length === 0)
    throw new SchoolError(
      'not_found',
      'That section is not yours for this paper.',
    )
  return examPrintRepository.studentsOfSections(
    db,
    scope,
    wanted.map((s) => s.id),
  )
}

function assertApproved(paper: Paper) {
  if (paper.status !== 'approved')
    throw new SchoolError(
      'conflict',
      'Approve the paper first. Answer sheets are only for an approved paper.',
    )
}

export async function coverSections(
  db: Db,
  scope: SchoolScope,
  paperId: string,
) {
  const paper = await loadOwnPaper(db, scope, paperId)
  const secs = await sectionsFor(db, scope, paper)
  const students = await studentsFor(db, scope, paper)
  return secs
    .map((s) => ({
      id: s.id,
      name: s.name,
      students: students.filter((x) => x.section_id === s.id).length,
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

/** The cover pages of one section, as one PDF (the codes are made once and printed identically every time). */
export async function renderCovers(
  db: Db,
  scope: SchoolScope,
  paperId: string,
  sectionId: string,
): Promise<{ pdf: Buffer; fileName: string; students: number }> {
  const paper = await loadOwnPaper(db, scope, paperId)
  assertApproved(paper)
  const students = await studentsFor(db, scope, paper, sectionId)
  if (students.length === 0)
    throw new SchoolError('invalid', 'There are no students in that section.')
  const school = await db
    .selectFrom('schools')
    .select('name')
    .where('id', '=', scope.schoolId)
    .executeTakeFirstOrThrow()
  const have = new Map(
    (await schoolOwnCoversRepository.list(db, scope))
      .filter((c) => c.paper_id === paperId)
      .map((c) => [c.school_student_id, c.token]),
  )
  const cover: Array<{
    name: string
    admissionNo: string
    rollNo: string
    sectionName: string
    token: string
  }> = []
  for (const s of students) {
    let token = have.get(s.school_student_id)
    if (!token) {
      token = ownCoverToken({
        schoolId: scope.schoolId,
        paperId,
        schoolStudentId: s.school_student_id,
      })
      await schoolOwnCoversRepository.insert(db, scope, {
        paper_id: paperId,
        school_student_id: s.school_student_id,
        token,
      })
    }
    cover.push({
      name: s.name,
      admissionNo: s.admission_no,
      rollNo: s.roll_no,
      sectionName: s.section_name,
      token,
    })
  }
  const html = await buildCoversHtml({
    schoolName: school.name,
    paperTitle: paper.title,
    subjectName: paper.subject.name,
    grade: paper.grade,
    totalMarks: paper.total_marks === null ? null : Number(paper.total_marks),
    students: cover,
  })
  const pdf = await renderHtmlToPdf(html, { fullPage: true })
  if (countPdfPages(pdf) !== students.length)
    throw new SchoolError(
      'conflict',
      'The cover pages did not print as one page each. Please try again.',
    )
  await auditSchool(
    db,
    scope,
    'school.own_covers_printed',
    'school_own_papers',
    paperId,
    null,
    { students: students.length, section_id: sectionId },
  )
  const slug =
    paper.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 50) || 'paper'
  return { pdf, fileName: `${slug}-cover-pages.pdf`, students: students.length }
}

export interface OwnSheetResult {
  sheetId: string
  status: 'placed' | 'unplaced' | 'rejected'
  kind: 'cover' | 'page'
  studentId: string | null
  student: string | null
  message: string
  /** Where the wrong-upload checks stand for a page (covers are not checked). */
  checkState?: 'passed' | 'needs_confirm' | 'refused'
  /** For a page whose name looks like another student's: that student. */
  suggest?: { schoolStudentId: string; name: string; rollNo: string } | null
}

/**
 * One scanned page. `currentStudentId` is the student of the last cover or page in this same upload
 * (the browser keeps it), `studentId` is a teacher's explicit choice (the one-upload-per-student fallback).
 */
export async function ingestOwnSheet(
  db: Db,
  scope: SchoolScope,
  paperId: string,
  input: {
    bytes: Buffer
    name?: string | null
    currentStudentId?: string | null
    studentId?: string | null
  },
  ai?: SheetCheckAi,
): Promise<OwnSheetResult> {
  const paper = await loadOwnPaper(db, scope, paperId)
  assertApproved(paper)
  storageOrRefuse(getScanStore)
  if (input.bytes.length === 0 || input.bytes.length > MAX_SCAN_BYTES)
    throw new SchoolError(
      'invalid',
      'That file is empty or too big. Each photo must be under 12 MB.',
    )
  const students = await studentsFor(db, scope, paper)
  const byId = new Map(students.map((s) => [s.school_student_id, s]))
  const named = input.studentId ?? null
  if (named && !byId.has(named))
    throw new SchoolError(
      'not_found',
      'That student is not in your class for this paper.',
    )
  const carry =
    input.currentStudentId && byId.has(input.currentStudentId)
      ? input.currentStudentId
      : null

  const reading = await readBookletPage(input.bytes)
  const base = {
    paper_id: paperId,
    original_name: input.name?.slice(0, 200) ?? null,
    size_bytes: input.bytes.length,
    uploaded_by_user_id: scope.userId,
  }
  const reject = async (reason: string): Promise<OwnSheetResult> => {
    const row = await schoolOwnSheetsRepository.insert(db, scope, {
      ...base,
      kind: 'page',
      status: 'rejected',
      reason,
    })
    return {
      sheetId: row.id,
      status: 'rejected',
      kind: 'page',
      studentId: null,
      student: null,
      message: reason,
    }
  }
  if (
    reading.problem &&
    !reading.image &&
    !reading.token &&
    !reading.foreignQr
  ) {
    // not a picture at all
    if (/not a picture/i.test(reading.problem)) return reject(reading.problem)
  }
  if (reading.token)
    return reject(
      'This is a page of a PrepPlan exam booklet, not a sheet for this paper. It was not saved.',
    )

  const coverToken = parseCoverQr(reading.foreignQr)
  const store = getScanStore()
  const id = randomUUID()
  const originalKey = `${scope.schoolId}/_own/${paperId}/sheets/${id}-original.bin`
  const imageKey = `${scope.schoolId}/_own/${paperId}/sheets/${id}-cover.bin`
  const written: Array<string> = []
  let page: OwnSheetResult | null = null
  try {
    if (coverToken) {
      const found = await schoolOwnCoversRepository.findByToken(db, coverToken)
      if (!found)
        return reject(
          'This cover page was not made by PrepPlan. It was not saved.',
        )
      if (found.school_id !== scope.schoolId)
        return reject(
          'This cover page belongs to a different school. It was not saved.',
        )
      if (found.paper_id !== paperId)
        return reject(
          'This cover page is for a different paper. It was not saved.',
        )
      const st = byId.get(found.school_student_id)
      if (!st)
        return reject(
          'This cover page is for a student who is not in your class for this paper. It was not saved.',
        )
      await store.put(originalKey, encryptScan(input.bytes))
      written.push(originalKey)
      if (reading.image) {
        await store.put(imageKey, encryptScan(reading.image))
        written.push(imageKey)
      }
      const row = await schoolOwnSheetsRepository.insert(db, scope, {
        ...base,
        id,
        school_student_id: found.school_student_id,
        kind: 'cover',
        status: 'placed',
        placed_by: 'cover',
        seq: 0,
        original_key: originalKey,
        image_key: reading.image ? imageKey : null,
      })
      return {
        sheetId: row.id,
        status: 'placed',
        kind: 'cover',
        studentId: found.school_student_id,
        student: st.name,
        message: `Cover page: ${st.name}. The pages after it are hers.`,
      }
    }
    if (reading.foreignQr && !named)
      return reject(
        'The code on this page is not from a PrepPlan cover page. It was not saved.',
      )
    const target = named ?? carry
    await store.put(originalKey, encryptScan(input.bytes))
    written.push(originalKey)
    if (!target) {
      const row = await schoolOwnSheetsRepository.insert(db, scope, {
        ...base,
        id,
        kind: 'page',
        status: 'unplaced',
        reason:
          'No cover page came before this page, so we do not know whose it is. Choose the student.',
        original_key: originalKey,
      })
      page = {
        sheetId: row.id,
        status: 'unplaced',
        kind: 'page',
        studentId: null,
        student: null,
        message: 'No cover page came before this page. Choose whose it is.',
      }
    } else {
      const seq =
        (await schoolOwnSheetsRepository.listForPaper(db, scope, paperId))
          .filter(
            (x) => x.school_student_id === target && x.status === 'placed',
          )
          .reduce((m, x) => Math.max(m, x.seq ?? 0), 0) + 1
      const row = await schoolOwnSheetsRepository.insert(db, scope, {
        ...base,
        id,
        school_student_id: target,
        kind: 'page',
        status: 'placed',
        placed_by: named ? 'teacher' : 'order',
        seq,
        original_key: originalKey,
      })
      const st = byId.get(target)
      page = {
        sheetId: row.id,
        status: 'placed',
        kind: 'page',
        studentId: target,
        student: st?.name ?? null,
        message: `Page ${seq} of ${st?.name ?? 'the student'}.`,
      }
    }
  } catch (e) {
    await Promise.all(
      written.map((k) => store.remove(k).catch(() => undefined)),
    )
    throw e
  }
  // (set inside the try above; TypeScript cannot follow that)
  const saved = page as OwnSheetResult | null
  if (!saved) throw new SchoolError('conflict', 'This page could not be saved.')
  // the wrong-upload checks, before anything is marked (SCHOOLS_MODULE_PLAN.md 12.4)
  const chosen = saved.studentId ? byId.get(saved.studentId) : undefined
  let verdict: PageCheckVerdict
  try {
    const own = await db
      .selectFrom('school_own_questions')
      .select('position')
      .where('school_id', '=', scope.schoolId)
      .where('paper_id', '=', paperId)
      .where('removed_at', 'is', null)
      .orderBy('position')
      .execute()
    const school = await db
      .selectFrom('schools')
      .select('household_id')
      .where('id', '=', scope.schoolId)
      .executeTakeFirstOrThrow()
    verdict = await checkPage(
      db,
      scope,
      ai ??
        sheetCheckAiFor(db, {
          schoolId: scope.schoolId,
          householdId: school.household_id,
        }),
      {
        sheetId: saved.sheetId,
        paperId,
        bytes: input.bytes,
        student: chosen ?? null,
        classmates: chosen
          ? students.filter((s) => s.section_id === chosen.section_id)
          : students,
        subject: paper.subject.name,
        grade: paper.grade,
        questionNumbers: own.map((q) => String(q.position)),
      },
    )
  } catch (e) {
    console.error('[own-sheets] checks failed', e)
    const summary =
      'We could not check this saved. Please look at it and confirm.'
    await schoolOwnSheetsRepository.update(db, scope, saved.sheetId, {
      check_state: 'needs_confirm',
      check_summary: summary,
    })
    verdict = { state: 'needs_confirm', summary, suggest: null }
  }
  if (verdict.state === 'refused')
    return {
      ...saved,
      status: 'rejected',
      studentId: null,
      student: null,
      message: verdict.summary ?? 'This page was refused.',
      checkState: 'refused',
      suggest: null,
    }
  return {
    ...saved,
    message:
      verdict.state === 'needs_confirm'
        ? `${saved.message} Please check: ${verdict.summary}`
        : saved.message,
    checkState: verdict.state,
    suggest: verdict.suggest,
  }
}

export interface OwnSheetsSummary {
  students: Array<{
    schoolStudentId: string
    name: string
    rollNo: string
    section: string
    covers: number
    pages: number
    /** none: nothing yet; received: pages in and passed; checking: checks not finished; needs_you: a
     *  teacher must confirm a page; refused: a page was refused and nothing usable is in. */
    state: 'received' | 'none' | 'checking' | 'needs_you' | 'refused'
  }>
  unplaced: Array<{
    id: string
    name: string | null
    reason: string | null
    url: string | null
  }>
  totals: {
    students: number
    received: number
    none: number
    needsYou: number
    unplaced: number
    rejected: number
  }
}

export async function ownSheetsSummary(
  db: Db,
  scope: SchoolScope,
  paperId: string,
): Promise<OwnSheetsSummary> {
  const paper = await loadOwnPaper(db, scope, paperId)
  const students = await studentsFor(db, scope, paper)
  const sheets = await schoolOwnSheetsRepository.listForPaper(
    db,
    scope,
    paperId,
  )
  const rows = students.map((s) => {
    const mine = sheets.filter(
      (x) =>
        x.school_student_id === s.school_student_id && x.status === 'placed',
    )
    const covers = mine.filter((x) => x.kind === 'cover').length
    const pages = mine.filter((x) => x.kind === 'page').length
    const refused = sheets.some(
      (x) =>
        x.school_student_id === s.school_student_id &&
        x.check_state === 'refused',
    )
    const state = mine.some((x) => x.check_state === 'needs_confirm')
      ? ('needs_you' as const)
      : mine.some((x) => x.check_state === 'pending')
        ? ('checking' as const)
        : covers + pages > 0
          ? ('received' as const)
          : refused
            ? ('refused' as const)
            : ('none' as const)
    return {
      schoolStudentId: s.school_student_id,
      name: s.name,
      rollNo: s.roll_no,
      section: s.section_name,
      covers,
      pages,
      state,
    }
  })
  const unplaced = sheets
    .filter((x) => x.status === 'unplaced')
    .map((x) => ({
      id: x.id,
      name: x.original_name,
      reason: x.reason,
      url: x.has_file ? signedUrl(scope.schoolId, x.id) : null,
    }))
  return {
    students: rows,
    unplaced,
    totals: {
      students: rows.length,
      received: rows.filter((r) => r.state === 'received').length,
      none: rows.filter((r) => r.state === 'none').length,
      needsYou: rows.filter((r) => r.state === 'needs_you').length,
      unplaced: unplaced.length,
      rejected: sheets.filter((x) => x.status === 'rejected').length,
    },
  }
}

const signedUrl = (schoolId: string, sheetId: string) =>
  signedScanPageUrl(sheetId).replace(
    '/api/scan-pages/',
    `/api/schools/${schoolId}/own-sheet-images/`,
  )

/** One student's pages for this paper, in order, with a short-lived picture link and where the checks stand. */
export async function studentSheets(
  db: Db,
  scope: SchoolScope,
  paperId: string,
  studentId: string,
) {
  const paper = await loadOwnPaper(db, scope, paperId)
  const students = await studentsFor(db, scope, paper)
  const st = students.find((s) => s.school_student_id === studentId)
  if (!st)
    throw new SchoolError(
      'not_found',
      'That student is not in your class for this paper.',
    )
  const sheets = (
    await schoolOwnSheetsRepository.listForPaper(db, scope, paperId)
  ).filter(
    (x) =>
      x.school_student_id === studentId &&
      (x.status === 'placed' || x.check_state === 'refused'),
  )
  // for a page whose name looked like a classmate's: who (from the logged name check)
  const looksLike = new Map<string, string>()
  for (const c of await schoolUploadChecksRepository.listForSheets(
    db,
    scope,
    sheets.map((x) => x.id),
  )) {
    const d = c.detail as { looks_like?: string } | null
    if (c.check === 'name' && d?.looks_like)
      looksLike.set(c.sheet_id, d.looks_like)
  }
  return {
    student: {
      schoolStudentId: st.school_student_id,
      name: st.name,
      rollNo: st.roll_no,
      section: st.section_name,
    },
    pages: sheets
      .sort(
        (a, b) =>
          (a.status === 'placed' ? 0 : 1) - (b.status === 'placed' ? 0 : 1) ||
          (a.seq ?? 0) - (b.seq ?? 0),
      )
      .map((x) => ({
        id: x.id,
        seq: x.seq,
        kind: x.kind,
        status: x.status,
        name: x.original_name,
        checkState: x.check_state,
        checkSummary: x.check_summary,
        suggestId: looksLike.get(x.id) ?? null,
        url:
          x.has_file && x.purged_at === null
            ? signedUrl(scope.schoolId, x.id)
            : null,
      })),
  }
}

/**
 * A teacher takes a wrong page out (a page of another student, a blurred photo sent again). It is kept,
 * marked as removed, and no longer counts for the student; nothing is deleted.
 */
export async function removeOwnSheet(
  db: Db,
  scope: SchoolScope,
  paperId: string,
  sheetId: string,
): Promise<void> {
  await loadOwnPaper(db, scope, paperId)
  const sheet = await schoolOwnSheetsRepository.findById(db, scope, sheetId)
  if (!sheet || sheet.paper_id !== paperId)
    throw new SchoolError('not_found', 'Page not found.')
  if (sheet.status === 'rejected') return
  await schoolOwnSheetsRepository.update(db, scope, sheetId, {
    status: 'rejected',
    reason: 'Removed by a teacher.',
  })
  await auditSchool(
    db,
    scope,
    'school.own_sheet_removed',
    'school_own_sheets',
    sheetId,
    { status: sheet.status, school_student_id: sheet.school_student_id },
    { status: 'rejected' },
  )
}

/**
 * A teacher answers a page the checks were unsure of: it is hers (keep), it is another student's (move),
 * or it is a wrong page (remove; kept, never deleted). The decision is logged with who made it.
 */
export async function confirmOwnSheet(
  db: Db,
  scope: SchoolScope,
  paperId: string,
  sheetId: string,
  decision: string,
  toStudentId?: string | null,
): Promise<void> {
  const paper = await loadOwnPaper(db, scope, paperId)
  const sheet = await schoolOwnSheetsRepository.findById(db, scope, sheetId)
  if (!sheet || sheet.paper_id !== paperId)
    throw new SchoolError('not_found', 'Page not found.')
  if (sheet.check_state !== 'needs_confirm')
    throw new SchoolError('conflict', 'This page does not need a decision.')
  if (decision !== 'keep' && decision !== 'move' && decision !== 'remove')
    throw new SchoolError('invalid', 'Choose keep, move or remove.')
  let target = sheet.school_student_id
  if (decision === 'move') {
    const students = await studentsFor(db, scope, paper)
    if (
      !toStudentId ||
      !students.some((x) => x.school_student_id === toStudentId)
    )
      throw new SchoolError(
        'not_found',
        'That student is not in your class for this paper.',
      )
    target = toStudentId
  }
  const seq =
    decision === 'move'
      ? (await schoolOwnSheetsRepository.listForPaper(db, scope, paperId))
          .filter(
            (x) => x.school_student_id === target && x.status === 'placed',
          )
          .reduce((m, x) => Math.max(m, x.seq ?? 0), 0) + 1
      : sheet.seq
  await db.transaction().execute(async (trx) => {
    await schoolUploadChecksRepository.insert(trx, scope, {
      sheet_id: sheetId,
      check: 'teacher',
      result: decision === 'remove' ? 'fail' : 'pass',
      detail: JSON.stringify({
        decision,
        from: sheet.school_student_id,
        to: target,
        was: sheet.check_summary,
      }),
      decided_by_user_id: scope.userId,
    })
    await schoolOwnSheetsRepository.update(trx, scope, sheetId, {
      check_state: decision === 'remove' ? 'refused' : 'passed',
      ...(decision === 'remove'
        ? { status: 'rejected' as const, reason: 'Removed by a teacher.' }
        : {
            status: 'placed' as const,
            school_student_id: target,
            seq,
            placed_by: 'teacher' as const,
          }),
    })
    await auditSchool(
      trx,
      scope,
      'school.own_sheet_confirmed',
      'school_own_sheets',
      sheetId,
      {
        school_student_id: sheet.school_student_id,
        check_state: 'needs_confirm',
      },
      { decision, school_student_id: target },
    )
  })
}

/** A teacher says whose an unplaced page is. */
export async function assignOwnSheet(
  db: Db,
  scope: SchoolScope,
  paperId: string,
  sheetId: string,
  studentId: string,
): Promise<void> {
  const paper = await loadOwnPaper(db, scope, paperId)
  const students = await studentsFor(db, scope, paper)
  if (!students.some((s) => s.school_student_id === studentId))
    throw new SchoolError(
      'not_found',
      'That student is not in your class for this paper.',
    )
  const sheet = await schoolOwnSheetsRepository.findById(db, scope, sheetId)
  if (!sheet || sheet.paper_id !== paperId)
    throw new SchoolError('not_found', 'Page not found.')
  if (sheet.status !== 'unplaced')
    throw new SchoolError(
      'conflict',
      'Only a page that is waiting can be given to a student.',
    )
  const seq =
    (await schoolOwnSheetsRepository.listForPaper(db, scope, paperId))
      .filter((x) => x.school_student_id === studentId && x.status === 'placed')
      .reduce((m, x) => Math.max(m, x.seq ?? 0), 0) + 1
  await schoolOwnSheetsRepository.update(db, scope, sheetId, {
    school_student_id: studentId,
    status: 'placed',
    placed_by: 'teacher',
    seq,
    reason: null,
  })
  await auditSchool(
    db,
    scope,
    'school.own_sheet_assigned',
    'school_own_sheets',
    sheetId,
    { status: 'unplaced' },
    { school_student_id: studentId },
  )
}

/** One stored page for the office and the teacher of the subject, through a signed, short-lived link. */
export async function ownSheetImage(
  db: Db,
  scope: SchoolScope,
  sheetId: string,
  exp: string | null,
  sig: string | null,
): Promise<Buffer> {
  const notFound = new SchoolError(
    'not_found',
    'We could not find that picture.',
  )
  if (!verifyScanPageSignature(sheetId, exp, sig)) throw notFound
  const sheet = await schoolOwnSheetsRepository.findById(db, scope, sheetId)
  const key = sheet?.image_key ?? sheet?.original_key
  if (!sheet || !key) throw notFound
  try {
    await loadOwnPaper(db, scope, sheet.paper_id)
  } catch {
    throw notFound
  }
  const sealed = await getScanStore().get(key)
  if (!sealed) throw notFound
  return decryptScan(sealed)
}

// ---------------------------------------------------------------- big files, in pieces (as for exam sheets)

const MAX_CHUNKS = 4

/** Keeps one sealed piece of a file on its way up (same rule as the exam sheets: never shrunk or re-encoded). */
export async function saveOwnSheetChunk(
  db: Db,
  scope: SchoolScope,
  paperId: string,
  uploadId: string,
  seq: number,
  bytes: Buffer,
): Promise<{ received: number }> {
  const paper = await loadOwnPaper(db, scope, paperId)
  assertApproved(paper)
  storageOrRefuse(getScanStore)
  if (!/^[0-9a-f-]{36}$/i.test(uploadId))
    throw new SchoolError('invalid', 'That upload code is not valid.')
  if (!Number.isInteger(seq) || seq < 0 || seq >= MAX_CHUNKS)
    throw new SchoolError(
      'invalid',
      'That file is too big. Each photo must be under 12 MB.',
    )
  if (bytes.length === 0 || bytes.length > MAX_CHUNK_BYTES)
    throw new SchoolError(
      'invalid',
      'That piece of the file is empty or too big.',
    )
  const mine = await schoolScanChunksRepository.piecesOfPaper(
    db,
    scope,
    paperId,
    uploadId,
  )
  const existing = mine.find((m) => m.seq === seq)
  if (existing?.consumed_at)
    throw new SchoolError('conflict', 'That upload was already used.')
  const key = chunkKey(scope.schoolId, uploadId, seq)
  await getScanStore().put(key, encryptScan(bytes))
  if (existing)
    await schoolScanChunksRepository.update(db, scope, existing.id, {
      storage_key: key,
      size_bytes: bytes.length,
    })
  else
    await schoolScanChunksRepository.insert(db, scope, {
      own_paper_id: paperId,
      upload_id: uploadId,
      seq,
      storage_key: key,
      size_bytes: bytes.length,
      created_by_user_id: scope.userId,
    })
  return { received: mine.length + (existing ? 0 : 1) }
}

/** Joins the pieces into the original file and deletes them from storage (the rows stay, key cleared). */
export async function takeOwnSheetUpload(
  db: Db,
  scope: SchoolScope,
  paperId: string,
  uploadId: string,
  chunks: number,
): Promise<Buffer> {
  if (!Number.isInteger(chunks) || chunks < 1 || chunks > MAX_CHUNKS)
    throw new SchoolError('invalid', 'That upload is not valid.')
  const pieces = await schoolScanChunksRepository.piecesOfPaper(
    db,
    scope,
    paperId,
    uploadId,
  )
  const ok =
    pieces.length === chunks &&
    pieces.every(
      (p, i) => p.seq === i && p.storage_key !== null && p.consumed_at === null,
    )
  if (!ok)
    throw new SchoolError(
      'invalid',
      'Some of that file did not arrive. Please send it again.',
    )
  const store = getScanStore()
  const parts: Array<Buffer> = []
  for (const p of pieces) {
    const sealed = p.storage_key ? await store.get(p.storage_key) : null
    if (!sealed)
      throw new SchoolError(
        'invalid',
        'Some of that file did not arrive. Please send it again.',
      )
    parts.push(decryptScan(sealed))
  }
  for (const p of pieces) {
    if (p.storage_key) await store.remove(p.storage_key)
    await schoolScanChunksRepository.update(db, scope, p.id, {
      storage_key: null,
      consumed_at: new Date(),
    })
  }
  return Buffer.concat(parts)
}
