import type { Db } from '../../db/connection'
import {
  bankRepository,
  examPrintRepository,
  schoolBookletLayoutsRepository,
  schoolBookletPagesRepository,
  schoolBookletsRepository,
  schoolClassesRepository,
  schoolExamQuestionsRepository,
  schoolExamSectionsRepository,
  schoolExamsRepository,
  schoolPaperTemplatesRepository,
  schoolSectionsRepository,
  schoolSubjectsRepository,
} from '../../db/repositories'
import type { SchoolScope } from '../../db/school-scope'
import { buildAnswerKeyHtml } from '../pdf/key-template'
import { buildPaperDocx } from '../pdf/paper-docx'
import { buildPaperHtml } from '../pdf/paper-template'
import type { PaperTemplateInput } from '../pdf/paper-template'
import { countPdfPages, renderWithPageCount } from '../pdf/page-count'
import { renderHtmlToPdf } from '../pdf/render'
import { markSplit } from '../school-paper'
import type { Layout } from '../school-paper'
import { isObjectiveType } from '../scoring'
import { buildBookletsHtml } from './booklet-html'
import { layoutBooklet } from './booklet-layout'
import type { BookletManifest, BookletQuestion } from './booklet-layout'
import { bookletPageToken } from './booklet-token'
import { SchoolError, auditSchool } from './common'
import { buildMasterPaper } from './exam-paper'
import { computeCoverage, shortfallLines } from './template-coverage'
import type { BankRow, CoverageChapter } from './template-coverage'
import { parseSections, toLayout } from './templates'
import type { TemplateDefinition } from './templates'
import { requireSchoolTerms } from './terms'

// One question paper per class and exam, the teacher's copy, and a Smart Answer Booklet for every
// student. Who may do what:
//   make an exam, open the teacher's copy, print booklets:  the school office, and a teacher who
//                                                           teaches the subject in the exam's sections
//   open the question paper:                                 the same, and the principal
//   students and parents:                                    nothing here, ever (the routes do not
//                                                           admit them and these functions refuse)

type ExamRow = NonNullable<
  Awaited<ReturnType<typeof schoolExamsRepository.findById>>
>

function assertStaff(scope: SchoolScope) {
  if (!['school_admin', 'teacher', 'principal'].includes(scope.role)) {
    throw new SchoolError('forbidden', 'This is not for your account.')
  }
}

async function examSections(db: Db, scope: SchoolScope, examId: string) {
  return (await schoolExamSectionsRepository.list(db, scope))
    .filter((s) => s.exam_id === examId)
    .map((s) => s.section_id)
}

/** A teacher handles an exam only if they teach its subject in every one of its sections. */
function teachesExam(
  scope: SchoolScope,
  subjectId: string,
  sectionIds: ReadonlyArray<string>,
): boolean {
  if (scope.pairs === 'all') return true
  const pairs = scope.pairs
  return (
    sectionIds.length > 0 &&
    sectionIds.every((sec) =>
      pairs.some((p) => p.sectionId === sec && p.subjectId === subjectId),
    )
  )
}

export async function loadExam(
  db: Db,
  scope: SchoolScope,
  examId: string,
  need: 'paper' | 'handle',
): Promise<{ exam: ExamRow; sectionIds: Array<string> }> {
  assertStaff(scope)
  const exam = await schoolExamsRepository.findById(db, scope, examId)
  if (!exam) throw new SchoolError('not_found', 'Exam not found.')
  const sectionIds = await examSections(db, scope, examId)
  if (scope.role === 'principal') {
    if (need === 'handle')
      throw new SchoolError(
        'forbidden',
        'The principal can look at the question paper but not the teacher copy or the booklets.',
      )
  } else if (!teachesExam(scope, exam.subject_id, sectionIds)) {
    throw new SchoolError('not_found', 'Exam not found.')
  }
  return { exam, sectionIds }
}

export interface CreateExamInput {
  title: string
  subjectId: string
  templateKey: string
  chapterIds: Array<string>
  sectionIds: Array<string>
  examDate?: string | null
}

export async function createExam(
  db: Db,
  scope: SchoolScope,
  input: CreateExamInput,
): Promise<{ id: string }> {
  if (scope.role !== 'school_admin' && scope.role !== 'teacher')
    throw new SchoolError(
      'forbidden',
      'Only the school office and teachers can make an exam paper.',
    )
  await requireSchoolTerms(db, scope)
  const title = input.title.trim()
  if (!title || title.length > 100)
    throw new SchoolError(
      'invalid',
      'Give the exam a name (up to 100 characters).',
    )
  if (input.examDate && !/^\d{4}-\d{2}-\d{2}$/.test(input.examDate))
    throw new SchoolError('invalid', 'The date is not valid.')
  if (input.chapterIds.length === 0)
    throw new SchoolError('invalid', 'Choose at least one chapter.')
  if (new Set(input.chapterIds).size !== input.chapterIds.length)
    throw new SchoolError('invalid', 'A chapter is chosen twice.')
  if (input.sectionIds.length === 0)
    throw new SchoolError('invalid', 'Choose at least one section.')

  const sections = (await schoolSectionsRepository.list(db, scope)).filter(
    (s) => input.sectionIds.includes(s.id),
  )
  if (sections.length !== new Set(input.sectionIds).size)
    throw new SchoolError('not_found', 'A section was not found.')
  const classIds = new Set(sections.map((s) => s.class_id))
  if (classIds.size !== 1)
    throw new SchoolError(
      'invalid',
      'All sections of one exam must be in the same class.',
    )
  const classId = sections[0].class_id
  const cls = await schoolClassesRepository.findById(db, scope, classId)
  if (!cls) throw new SchoolError('not_found', 'Class not found.')
  const taught = (await schoolSubjectsRepository.list(db, scope)).some(
    (s) => s.class_id === classId && s.subject_id === input.subjectId,
  )
  if (!taught)
    throw new SchoolError(
      'not_found',
      'That subject is not taught in this class.',
    )
  if (!teachesExam(scope, input.subjectId, input.sectionIds))
    throw new SchoolError(
      'not_found',
      'You do not teach this subject in all of those sections.',
    )

  const template = await schoolPaperTemplatesRepository.activeByKey(
    db,
    scope,
    input.templateKey,
  )
  if (!template) throw new SchoolError('not_found', 'Layout not found.')
  const definition: TemplateDefinition = {
    name: template.name,
    totalMarks: template.total_marks,
    durationMin: template.duration_min,
    levelMix: template.level_mix as unknown as TemplateDefinition['levelMix'],
    sections: parseSections(template.sections),
  }
  const layout = toLayout(definition)

  const allChapters = await bankRepository.chaptersForSubject(
    db,
    input.subjectId,
  )
  const chosen = input.chapterIds.map((id) =>
    allChapters.find((c) => c.id === id),
  )
  if (chosen.some((c) => !c))
    throw new SchoolError(
      'not_found',
      'A chapter does not belong to this subject.',
    )
  const chapters = chosen as typeof allChapters
  const conceptRows = await examPrintRepository.conceptCounts(
    db,
    input.chapterIds,
  )
  const examChapters = chapters.map((c) => ({
    id: c.id,
    conceptIds: conceptRows
      .filter((r) => r.chapter_id === c.id)
      .map((r) => r.id),
    weight: c.concepts,
  }))

  let master: Awaited<ReturnType<typeof buildMasterPaper>>
  try {
    master = await buildMasterPaper(db, layout, examChapters)
  } catch (e) {
    // The paper is checked before it is saved (numbering, four options, section totals). A failed
    // check means a question in the bank is incomplete: say so plainly instead of a bare error.
    if (
      e instanceof Error &&
      e.message.startsWith('The paper did not pass its checks')
    ) {
      throw new SchoolError(
        'invalid',
        `The paper could not be made because a question in the bank is incomplete (${e.message.replace('The paper did not pass its checks: ', '')}). Please tell PrepPlan; nothing was saved.`,
      )
    }
    throw e
  }

  // The gaps printed on the teacher's copy: the same wording the coverage preview used.
  const bank = (await bankRepository.bankRows(
    db,
    input.chapterIds,
  )) as Array<BankRow>
  const coverageChapters: Array<CoverageChapter> = chapters.map((c) => ({
    id: c.id,
    label: `Part ${c.part} · Chapter ${c.chapterNo} · ${c.name}`,
    weight: c.concepts,
  }))
  const lines = shortfallLines(
    computeCoverage({ layout, chapters: coverageChapters, bank }),
  )

  const manifest = layoutBooklet(
    bookletQuestions(
      master.picks.map((p) => ({
        position: p.position,
        type: p.type,
        marks: p.marks,
        expectedWords: p.expectedWords,
        isAlternate: p.isAlternate,
      })),
    ),
  )

  return db.transaction().execute(async (trx) => {
    const exam = await schoolExamsRepository.insert(trx, scope, {
      class_id: classId,
      subject_id: input.subjectId,
      template_id: template.id,
      template_name: template.name,
      layout: JSON.stringify(layout),
      chapter_ids: input.chapterIds,
      title,
      exam_date: input.examDate ?? null,
      status: 'draft',
      shortfalls: JSON.stringify(master.shortfalls),
      teacher_copy_lines: JSON.stringify(lines),
      nominal_marks: master.nominalMarks,
      printed_marks: master.printedMarks,
      created_by_user_id: scope.userId,
    })
    for (const sectionId of input.sectionIds)
      await schoolExamSectionsRepository.insert(trx, scope, {
        exam_id: exam.id,
        section_id: sectionId,
      })
    for (const p of master.picks) {
      await schoolExamQuestionsRepository.insert(trx, scope, {
        exam_id: exam.id,
        question_id: p.questionId,
        chapter_id: p.chapterId,
        position: p.position,
        is_alternate: p.isAlternate,
        marks: p.marks,
        section: p.section,
        slot: p.slot,
        choice_group: p.choiceGroup,
        expected_words: p.expectedWords,
      })
    }
    await schoolBookletLayoutsRepository.insert(trx, scope, {
      exam_id: exam.id,
      version: 1,
      page_count: manifest.pageCount,
      manifest: JSON.stringify(manifest),
    })
    await auditSchool(
      trx,
      scope,
      'school.exam_created',
      'school_exams',
      exam.id,
      null,
      {
        title,
        template: template.name,
        template_version: template.version,
        printed_marks: master.printedMarks,
        nominal_marks: master.nominalMarks,
        gaps: lines.length,
      },
    )
    return { id: exam.id }
  })
}

/** The questions of the booklet: written ones get a box, multiple-choice ones get bubbles. An OR is one box. */
export function bookletQuestions(
  picks: ReadonlyArray<{
    position: number
    type: string
    marks: number
    expectedWords: number | null
    isAlternate: boolean
  }>,
): Array<BookletQuestion> {
  const alternates = new Set(
    picks.filter((p) => p.isAlternate).map((p) => p.position),
  )
  return picks
    .filter((p) => !p.isAlternate)
    .map((p) => ({
      position: p.position,
      isMcq: isObjectiveType(p.type as never),
      marks: p.marks,
      expectedWords: p.expectedWords,
      hasAlternate: alternates.has(p.position),
    }))
}

export interface ExamSummary {
  id: string
  title: string
  subjectId: string
  className: string
  sections: Array<string>
  nominalMarks: number
  printedMarks: number
  gaps: number
  status: string
  examDate: string | null
}

async function summarize(
  db: Db,
  scope: SchoolScope,
  exam: ExamRow,
  sectionIds: Array<string>,
): Promise<ExamSummary> {
  const cls = await schoolClassesRepository.findById(db, scope, exam.class_id)
  const secs = (await schoolSectionsRepository.list(db, scope)).filter((s) =>
    sectionIds.includes(s.id),
  )
  return {
    id: exam.id,
    title: exam.title,
    subjectId: exam.subject_id,
    className: cls ? `Class ${cls.grade}` : 'Class',
    sections: secs.map((s) => s.name).sort(),
    nominalMarks: exam.nominal_marks,
    printedMarks: exam.printed_marks,
    gaps: (exam.teacher_copy_lines as unknown as Array<string>).length,
    status: exam.status,
    examDate: exam.exam_date
      ? new Date(exam.exam_date).toISOString().slice(0, 10)
      : null,
  }
}

export async function listExams(
  db: Db,
  scope: SchoolScope,
): Promise<Array<ExamSummary>> {
  assertStaff(scope)
  const exams = await schoolExamsRepository.list(db, scope)
  const out: Array<ExamSummary> = []
  for (const e of exams
    .filter((x) => x.archived_at === null) // an archived exam (a reset demo) is out of sight, never deleted
    .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())) {
    const sectionIds = await examSections(db, scope, e.id)
    if (
      scope.role === 'teacher' &&
      !teachesExam(scope, e.subject_id, sectionIds)
    )
      continue
    out.push(await summarize(db, scope, e, sectionIds))
  }
  return out
}

export async function getExam(db: Db, scope: SchoolScope, examId: string) {
  const { exam, sectionIds } = await loadExam(db, scope, examId, 'paper')
  const summary = await summarize(db, scope, exam, sectionIds)
  const mayHandle = scope.role !== 'principal'
  const qs = await schoolExamQuestionsRepository.list(db, scope)
  const rows = qs.filter((q) => q.exam_id === examId && !q.is_alternate)
  const slots = new Map<
    string,
    { section: string; slot: string; questions: number; marks: number }
  >()
  for (const q of rows) {
    const k = `${q.section}|${q.slot}`
    const cur = slots.get(k) ?? {
      section: q.section,
      slot: q.slot,
      questions: 0,
      marks: 0,
    }
    cur.questions += 1
    cur.marks += q.marks
    slots.set(k, cur)
  }
  const layoutRow = (await schoolBookletLayoutsRepository.list(db, scope)).find(
    (l) => l.exam_id === examId,
  )
  const booklets = (await schoolBookletsRepository.list(db, scope)).filter(
    (b) => b.exam_id === examId,
  )
  // Staff see the gaps; the question text and answers are never in this payload.
  return {
    ...summary,
    gapLines: mayHandle
      ? (exam.teacher_copy_lines as unknown as Array<string>)
      : [],
    rows: [...slots.values()],
    bookletPages: layoutRow?.page_count ?? 0,
    bookletsMade: booklets.length,
    mayHandle,
  }
}

// ---- the printed documents ---------------------------------------------------------------------

async function loadPrintData(db: Db, scope: SchoolScope, exam: ExamRow) {
  const [rows, school, subject, cls, chapters] = await Promise.all([
    schoolExamQuestionsRepository.listFull(db, scope, exam.id),
    db
      .selectFrom('schools')
      .select(['name', 'board'])
      .where('id', '=', scope.schoolId)
      .executeTakeFirstOrThrow(),
    db
      .selectFrom('subjects')
      .select('name')
      .where('id', '=', exam.subject_id)
      .executeTakeFirstOrThrow(),
    schoolClassesRepository.findById(db, scope, exam.class_id),
    examPrintRepository.chaptersWithBook(db, exam.chapter_ids),
  ])
  const ids = [...new Set(rows.map((r) => r.question_id))]
  const [options, steps] = await Promise.all([
    examPrintRepository.optionsFor(db, ids),
    examPrintRepository.stepMarksFor(db, ids),
  ])
  return {
    rows,
    school,
    subject,
    grade: cls?.grade ?? 0,
    chapters,
    options,
    steps,
    layout: exam.layout as unknown as Layout,
  }
}

/**
 * The HTML of the paper every student of the class sits, as a function of the printed page count.
 * Never contains an answer or which option is right: only text, options and marks are read.
 */
export async function questionPaperHtml(
  db: Db,
  scope: SchoolScope,
  examId: string,
): Promise<{
  build: (pageCount?: number) => string
  /** The same paper as plain data, for the Word file. */
  input: (pageCount?: number) => PaperTemplateInput
  title: string
}> {
  const { exam } = await loadExam(db, scope, examId, 'paper')
  const d = await loadPrintData(db, scope, exam)
  const printed = d.rows.filter((r) => !r.is_alternate)
  const sectionTotals: Record<string, number> = {}
  for (const r of printed)
    sectionTotals[r.section] = (sectionTotals[r.section] ?? 0) + r.marks
  const sectionOrder = d.layout.config.section_order.filter((s) =>
    printed.some((r) => r.section === s),
  )
  const input = (pageCount?: number): PaperTemplateInput => ({
    title: `${d.school.name} — ${exam.title}`,
    studentName: '',
    board: d.school.board,
    class: d.grade,
    durationMin: d.layout.duration_min,
    totalMarks: exam.printed_marks,
    chapters: d.chapters.map((c) => ({
      part: c.part,
      chapter_no: c.chapter_no,
      name: c.name,
    })),
    questions: d.rows.map((r) => ({
      id: r.id,
      section: r.section,
      position: r.position,
      marks: r.marks,
      bloom: r.bloom,
      difficulty: r.difficulty,
      type: r.type,
      text: r.text,
      diagram_kind: r.diagram_kind,
      diagram_params: r.diagram_params,
      concept_name: null,
      choice_group: r.choice_group,
      slot: r.slot,
      mark_split: isObjectiveType(r.type)
        ? undefined
        : markSplit(
            d.steps
              .filter((s) => s.question_id === r.question_id)
              .map((s) => s.marks),
          ),
      options: d.options
        .filter((o) => o.question_id === r.question_id)
        .map((o) => ({
          label: o.label,
          text: o.text,
          order_index: o.order_index,
        })),
    })),
    // Gaps are for the teacher's copy; the students' paper just prints what is on it.
    shortfalls: [],
    halfYearly: {
      subjectName: d.subject.name,
      instructions: d.layout.config.instructions,
      sectionOrder,
      sectionTotals,
      nominalMarks: exam.printed_marks,
      pageCount,
      draftNote: null,
    },
  })
  const build = (pageCount?: number) => buildPaperHtml(input(pageCount))
  return { build, input, title: exam.title }
}

/** The question paper as an editable Word file. Same data as the PDF, so the two always agree; no answers. */
export async function renderQuestionPaperDocx(
  db: Db,
  scope: SchoolScope,
  examId: string,
): Promise<{ docx: Buffer; fileName: string }> {
  const { input, title } = await questionPaperHtml(db, scope, examId)
  const docx = await buildPaperDocx(input())
  await auditSchool(
    db,
    scope,
    'school.question_paper_docx_downloaded',
    'school_exams',
    examId,
    null,
    { bytes: docx.length },
  )
  return { docx, fileName: `${slug(title)}-question-paper.docx` }
}

export async function renderQuestionPaper(
  db: Db,
  scope: SchoolScope,
  examId: string,
): Promise<{ pdf: Buffer; fileName: string }> {
  const { build, title } = await questionPaperHtml(db, scope, examId)
  const { pdf } = await renderWithPageCount(build)
  return { pdf, fileName: `${slug(title)}-question-paper.pdf` }
}

/** The HTML of the teacher's copy: answer key, step-wise marking scheme and every gap. For the teacher only. */
export async function teacherCopyHtml(
  db: Db,
  scope: SchoolScope,
  examId: string,
): Promise<{ html: string; title: string }> {
  const { exam, sectionIds } = await loadExam(db, scope, examId, 'handle')
  const d = await loadPrintData(db, scope, exam)
  const secs = (await schoolSectionsRepository.list(db, scope))
    .filter((s) => sectionIds.includes(s.id))
    .map((s) => s.name)
    .sort()
  const gaps = exam.teacher_copy_lines as unknown as Array<string>
  const html = buildAnswerKeyHtml({
    title: `${d.school.name} — ${exam.title}`,
    coverage: [],
    questions: d.rows.map((r) => {
      const opts = d.options.filter((o) => o.question_id === r.question_id)
      return {
        position: r.position,
        section: r.section,
        marks: r.marks,
        type: r.type,
        text: r.text,
        answer: r.answer,
        diagram_kind: r.diagram_kind,
        diagram_params: r.diagram_params,
        choice_group: r.choice_group,
        correctOptionLabel: opts.find((o) => o.is_correct)?.label ?? null,
        stepMarks: d.steps
          .filter((s) => s.question_id === r.question_id)
          .map((s) => ({
            step_no: s.step_no,
            description: s.description,
            marks: s.marks,
          })),
      }
    }),
    teacherCopy: {
      details: [
        `Subject: ${d.subject.name} · Class ${d.grade} ${secs.join(', ')} · ${d.layout.duration_min} minutes`,
        `Layout: ${exam.template_name}. Marks: ${exam.printed_marks} printed${exam.printed_marks !== exam.nominal_marks ? ` of ${exam.nominal_marks} planned` : ''}`,
        `Chapters: ${d.chapters.map((c) => `Part ${c.part} · Chapter ${c.chapter_no} · ${c.name}`).join('; ')}`,
        ...(exam.exam_date
          ? [`Date: ${new Date(exam.exam_date).toISOString().slice(0, 10)}`]
          : []),
      ],
      gaps,
    },
  })
  return { html, title: exam.title }
}

export async function renderTeacherCopy(
  db: Db,
  scope: SchoolScope,
  examId: string,
): Promise<{ pdf: Buffer; fileName: string }> {
  const { html, title } = await teacherCopyHtml(db, scope, examId)
  return {
    pdf: await renderHtmlToPdf(html),
    fileName: `${slug(title)}-teacher-copy.pdf`,
  }
}

export interface BookletRequest {
  sectionId?: string
  schoolStudentId?: string
}

export type BookletStudentRow = Awaited<
  ReturnType<typeof examPrintRepository.studentsOfSections>
>[number]

/** Who a booklet request is for: a section (default: all the exam's sections), or one student. */
export async function bookletStudents(
  db: Db,
  scope: SchoolScope,
  examId: string,
  req: BookletRequest,
) {
  const { exam, sectionIds } = await loadExam(db, scope, examId, 'handle')
  await requireSchoolTerms(db, scope)
  const wanted = req.sectionId ? [req.sectionId] : sectionIds
  if (wanted.some((s) => !sectionIds.includes(s)))
    throw new SchoolError('not_found', 'That section is not part of this exam.')
  let students = await examPrintRepository.studentsOfSections(db, scope, wanted)
  if (req.schoolStudentId)
    students = students.filter(
      (s) => s.school_student_id === req.schoolStudentId,
    )
  if (students.length === 0)
    throw new SchoolError(
      'invalid',
      'There are no students to print booklets for.',
    )
  const layoutRow = (await schoolBookletLayoutsRepository.list(db, scope)).find(
    (l) => l.exam_id === examId,
  )
  if (!layoutRow)
    throw new SchoolError('not_found', 'This exam has no booklet layout.')
  return {
    exam,
    students,
    manifest: layoutRow.manifest as unknown as BookletManifest,
  }
}

/** Makes the booklet and page records (once per student) so each printed page can be recognised later. */
export async function ensureBookletRecords(
  db: Db,
  scope: SchoolScope,
  examId: string,
  students: ReadonlyArray<BookletStudentRow>,
  manifest: BookletManifest,
): Promise<void> {
  const existing = new Map(
    (await schoolBookletsRepository.list(db, scope))
      .filter((b) => b.exam_id === examId)
      .map((b) => [b.school_student_id, b.id]),
  )
  await db.transaction().execute(async (trx) => {
    for (const s of students) {
      if (existing.has(s.school_student_id)) continue
      const bookletId = (
        await schoolBookletsRepository.insert(trx, scope, {
          exam_id: examId,
          school_student_id: s.school_student_id,
          page_count: manifest.pageCount,
        })
      ).id
      for (let page = 1; page <= manifest.pageCount; page++) {
        await schoolBookletPagesRepository.insert(trx, scope, {
          booklet_id: bookletId,
          page_no: page,
          token: bookletPageToken({
            schoolId: scope.schoolId,
            examId,
            schoolStudentId: s.school_student_id,
            page,
          }),
        })
      }
    }
    await schoolExamsRepository.update(trx, scope, examId, {
      status: 'booklets_ready',
    })
  })
}

/** One batch of booklets as a PDF. The printed page count is checked against the layout. */
export async function renderBookletBatch(
  db: Db,
  scope: SchoolScope,
  exam: ExamRow,
  manifest: BookletManifest,
  students: ReadonlyArray<BookletStudentRow>,
): Promise<{ pdf: Buffer; pages: number }> {
  const d = await loadPrintData(db, scope, exam)
  const html = await buildBookletsHtml({
    schoolName: d.school.name,
    examTitle: exam.title,
    subjectName: d.subject.name,
    className: `Class ${d.grade}`,
    durationMin: d.layout.duration_min,
    totalMarks: exam.printed_marks,
    manifest,
    students: students.map((s) => ({
      name: s.name,
      admissionNo: s.admission_no,
      rollNo: s.roll_no,
      sectionName: s.section_name,
      tokens: Array.from({ length: manifest.pageCount }, (_, i) =>
        bookletPageToken({
          schoolId: scope.schoolId,
          examId: exam.id,
          schoolStudentId: s.school_student_id,
          page: i + 1,
        }),
      ),
    })),
  })
  const pdf = await renderHtmlToPdf(html, { fullPage: true })
  const pages = countPdfPages(pdf)
  if (pages !== manifest.pageCount * students.length)
    throw new Error(
      `The booklets printed ${pages} pages, expected ${manifest.pageCount * students.length}`,
    )
  return { pdf, pages }
}

/**
 * The answer booklets for a section, or one student, as ONE PDF made in a single go. Fine for a
 * handful of students (tests, one reprint); a class is printed through a print job (print-service.ts),
 * which does it in batches so no request runs long.
 */
export async function renderBooklets(
  db: Db,
  scope: SchoolScope,
  examId: string,
  req: BookletRequest = {},
): Promise<{ pdf: Buffer; fileName: string; students: number; pages: number }> {
  const { exam, students, manifest } = await bookletStudents(
    db,
    scope,
    examId,
    req,
  )
  await ensureBookletRecords(db, scope, examId, students, manifest)
  const { pdf, pages } = await renderBookletBatch(
    db,
    scope,
    exam,
    manifest,
    students,
  )
  await auditSchool(
    db,
    scope,
    'school.booklets_printed',
    'school_exams',
    examId,
    null,
    { students: students.length, pages },
  )
  return {
    pdf,
    fileName: `${slug(exam.title)}-answer-booklets.pdf`,
    students: students.length,
    pages,
  }
}

const slug = (t: string) =>
  t
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60) || 'exam'
