import type { Db } from '../../db/connection'
import {
  bankRepository,
  schoolPaperTemplatesRepository,
  schoolSubjectsRepository,
} from '../../db/repositories'
import type { SchoolScope } from '../../db/school-scope'
import type { ThinkingLevel } from '../school-paper'
import { SchoolError, auditSchool } from './common'
import {
  computeCoverage,
  rowFitsSlot,
  shortfallLines,
} from './template-coverage'
import type {
  BankRow,
  CoverageChapter,
  CoverageResult,
} from './template-coverage'
import {
  DEFAULT_TEMPLATES,
  findDefaultTemplate,
  parseSections,
  toLayout,
  validateTemplate,
} from './templates'
import type { TemplateDefinition } from './templates'

// Paper layouts saved per school, and the coverage preview. Admin and teachers design layouts; the
// principal can look. Which chapters and subjects a person may use follows the same scope as the
// rest of the school screens: a teacher only the subjects they teach.

export interface SavedTemplate extends TemplateDefinition {
  id: string
  key: string
  version: number
  basedOn: string | null
}

type Row = NonNullable<
  Awaited<ReturnType<typeof schoolPaperTemplatesRepository.activeByKey>>
>

function fromRow(r: Row): SavedTemplate {
  const mix = r.level_mix as unknown as Record<ThinkingLevel, number>
  return {
    id: r.id,
    key: r.template_key,
    version: r.version,
    basedOn: r.based_on,
    name: r.name,
    totalMarks: r.total_marks,
    durationMin: r.duration_min,
    levelMix: mix,
    sections: parseSections(r.sections),
  }
}

function assertMayDesign(scope: SchoolScope) {
  if (scope.role !== 'school_admin' && scope.role !== 'teacher') {
    throw new SchoolError(
      'forbidden',
      'Only the school office and teachers can change paper layouts.',
    )
  }
}

export async function listTemplates(db: Db, scope: SchoolScope) {
  if (!['school_admin', 'teacher', 'principal'].includes(scope.role)) {
    throw new SchoolError('forbidden', 'This is not for your account.')
  }
  const rows = await schoolPaperTemplatesRepository.listActive(db, scope)
  return {
    templates: rows.map(fromRow),
    defaults: DEFAULT_TEMPLATES.map((d) => ({
      key: d.key,
      name: d.name,
      blurb: d.blurb,
      totalMarks: d.totalMarks,
      durationMin: d.durationMin,
    })),
  }
}

export async function saveTemplate(
  db: Db,
  scope: SchoolScope,
  input: {
    key?: string
    definition: TemplateDefinition
    basedOn?: string | null
  },
): Promise<SavedTemplate> {
  assertMayDesign(scope)
  const problems = validateTemplate(input.definition)
  if (problems.length > 0) throw new SchoolError('invalid', problems.join(' '))
  const d = input.definition
  const values = {
    name: d.name.trim(),
    total_marks: d.totalMarks,
    duration_min: d.durationMin,
    level_mix: JSON.stringify(d.levelMix),
    sections: JSON.stringify(
      d.sections.map((s) => ({ ...s, name: s.name.trim() })),
    ),
    created_by_user_id: scope.userId,
    status: 'active' as const,
  }
  return db.transaction().execute(async (trx) => {
    if (input.key) {
      const current = await schoolPaperTemplatesRepository.activeByKey(
        trx,
        scope,
        input.key,
      )
      if (!current) throw new SchoolError('not_found', 'Layout not found.')
      await schoolPaperTemplatesRepository.update(trx, scope, current.id, {
        status: 'retired',
      })
      const row = await schoolPaperTemplatesRepository.insert(trx, scope, {
        ...values,
        template_key: current.template_key,
        version: current.version + 1,
        based_on: current.based_on,
      })
      await auditSchool(
        trx,
        scope,
        'school.template_updated',
        'school_paper_templates',
        row.id,
        { version: current.version, name: current.name },
        { version: row.version, name: row.name },
      )
      return fromRow(row)
    }
    const row = await schoolPaperTemplatesRepository.insert(trx, scope, {
      ...values,
      template_key: crypto.randomUUID(),
      version: 1,
      based_on: input.basedOn ?? null,
    })
    await auditSchool(
      trx,
      scope,
      'school.template_created',
      'school_paper_templates',
      row.id,
      null,
      { name: row.name, based_on: row.based_on },
    )
    return fromRow(row)
  })
}

export async function adoptDefaultTemplate(
  db: Db,
  scope: SchoolScope,
  defaultKey: string,
): Promise<SavedTemplate> {
  const d = findDefaultTemplate(defaultKey)
  if (!d)
    throw new SchoolError('not_found', 'That ready-made layout does not exist.')
  const { key: _k, blurb: _b, ...definition } = d
  void _k
  void _b
  return saveTemplate(db, scope, { definition, basedOn: d.key })
}

export async function retireTemplate(
  db: Db,
  scope: SchoolScope,
  key: string,
): Promise<void> {
  assertMayDesign(scope)
  const current = await schoolPaperTemplatesRepository.activeByKey(
    db,
    scope,
    key,
  )
  if (!current) throw new SchoolError('not_found', 'Layout not found.')
  await schoolPaperTemplatesRepository.update(db, scope, current.id, {
    status: 'retired',
  })
  await auditSchool(
    db,
    scope,
    'school.template_retired',
    'school_paper_templates',
    current.id,
    { name: current.name },
    null,
  )
}

/** A subject the school teaches, and (for a teacher) one they teach. Anything else is "not found". */
async function assertSubjectAccess(
  db: Db,
  scope: SchoolScope,
  subjectId: string,
) {
  const mine = (await schoolSubjectsRepository.list(db, scope)).some(
    (s) => s.subject_id === subjectId,
  )
  const allowed =
    scope.pairs === 'all' ||
    scope.pairs.some((p) => p.subjectId === subjectId) ||
    scope.samplePairs.some((p) => p.subjectId === subjectId)
  if (!mine || !allowed)
    throw new SchoolError('not_found', 'Subject not found.')
}

/** Subjects the caller may use for layouts and previews, with their class. */
export async function listUsableSubjects(db: Db, scope: SchoolScope) {
  const rows = await schoolSubjectsRepository.list(db, scope)
  const subjects = await db
    .selectFrom('subjects')
    .select(['id', 'name', 'class'])
    .where(
      'id',
      'in',
      rows.length
        ? rows.map((r) => r.subject_id)
        : ['00000000-0000-0000-0000-000000000000'],
    )
    .execute()
  return subjects
    .filter(
      (s) =>
        scope.pairs === 'all' ||
        scope.pairs.some((p) => p.subjectId === s.id) ||
        scope.samplePairs.some((p) => p.subjectId === s.id),
    )
    .map((s) => ({ id: s.id, name: s.name, grade: s.class }))
    .sort((a, b) => a.grade - b.grade || a.name.localeCompare(b.name))
}

/** Chapters of a subject, each identified by book, part and chapter number (never the number alone). */
export async function listChapters(
  db: Db,
  scope: SchoolScope,
  subjectId: string,
) {
  await assertSubjectAccess(db, scope, subjectId)
  const chapters = await listChaptersRaw(db, subjectId)
  return chapters
}

async function listChaptersRaw(db: Db, subjectId: string) {
  return (await bankRepository.chaptersForSubject(db, subjectId)).map((c) => ({
    id: c.id,
    book: c.sourceTitle,
    part: c.part,
    chapterNo: c.chapterNo,
    name: c.name,
    label: chapterLabel(c),
    discipline: c.discipline,
    concepts: c.concepts,
    approvedQuestions: c.approvedQuestions,
  }))
}

/** What the bank holds for a whole subject, with a plain warning when a kind of question is missing altogether. */
export async function subjectDepthNote(
  db: Db,
  scope: SchoolScope,
  subjectId: string,
) {
  await assertSubjectAccess(db, scope, subjectId)
  const depth = await bankRepository.subjectDepth(db, subjectId)
  return { ...depth, note: depthNote(depth) }
}

export function depthNote(depth: {
  longAnswers: number
  caseStudies: number
}): string | null {
  if (depth.longAnswers === 0 && depth.caseStudies === 0) {
    return 'This subject has no long-answer (4 or 5 mark) questions and no case-based questions in the bank at all. Any section of a paper that asks for them, such as Sections D and E of the 80-mark layout, will be empty whichever chapters you choose. Papers made of 1 to 3 mark questions are not affected.'
  }
  if (depth.longAnswers === 0)
    return 'This subject has no long-answer (4 or 5 mark) questions in the bank at all. A section that asks for them will be empty whichever chapters you choose.'
  if (depth.caseStudies === 0)
    return 'This subject has no case-based questions in the bank at all. A case-study section will be empty whichever chapters you choose.'
  return null
}

const chapterLabel = (c: {
  part: string
  chapterNo: number
  name: string
  sourceTitle?: string
}) => `Part ${c.part} · Chapter ${c.chapterNo} · ${c.name}`

export interface CoveragePreview extends CoverageResult {
  layoutName: string
  durationMin: number
  teacherCopyLines: Array<string>
  /** Rows that nothing in the whole subject can fill, whichever chapters are chosen. */
  subjectNotes: Array<string>
  chapterLabels: Array<{ id: string; label: string }>
}

export async function previewCoverage(
  db: Db,
  scope: SchoolScope,
  input: {
    subjectId: string
    chapterIds: Array<string>
    templateKey?: string
    definition?: TemplateDefinition
  },
): Promise<CoveragePreview> {
  await assertSubjectAccess(db, scope, input.subjectId)
  if (input.chapterIds.length === 0)
    throw new SchoolError('invalid', 'Choose at least one chapter.')
  if (new Set(input.chapterIds).size !== input.chapterIds.length)
    throw new SchoolError('invalid', 'A chapter is chosen twice.')

  let definition: TemplateDefinition
  if (input.templateKey) {
    const row = await schoolPaperTemplatesRepository.activeByKey(
      db,
      scope,
      input.templateKey,
    )
    if (!row) throw new SchoolError('not_found', 'Layout not found.')
    definition = fromRow(row)
  } else if (input.definition) {
    const problems = validateTemplate(input.definition)
    if (problems.length > 0)
      throw new SchoolError('invalid', problems.join(' '))
    definition = input.definition
  } else {
    throw new SchoolError('invalid', 'Choose a layout.')
  }

  const all = await bankRepository.chaptersForSubject(db, input.subjectId)
  const chosen = input.chapterIds.map((id) => all.find((c) => c.id === id))
  if (chosen.some((c) => !c))
    throw new SchoolError(
      'not_found',
      'A chapter does not belong to this subject.',
    )
  const chapters: Array<CoverageChapter> = (chosen as typeof all).map((c) => ({
    id: c.id,
    label: chapterLabel(c),
    weight: c.concepts,
  }))
  const bank = (await bankRepository.bankRows(
    db,
    input.chapterIds,
  )) as Array<BankRow>
  const layout = toLayout(definition)
  const result = computeCoverage({ layout, chapters, bank })
  const wholeSubject = (await bankRepository.bankRows(
    db,
    all.map((c) => c.id),
  )) as Array<BankRow>
  const subjectNotes = layout.sections
    .filter((slot) => !wholeSubject.some((r) => rowFitsSlot(r, slot)))
    .map(
      (slot) =>
        `${slot.name} — ${slot.slot}: the bank has nothing that fits this row anywhere in this subject, so it will be empty whichever chapters you choose.`,
    )
  return {
    ...result,
    layoutName: definition.name,
    durationMin: definition.durationMin,
    teacherCopyLines: shortfallLines(result),
    subjectNotes,
    chapterLabels: chapters.map((c) => ({ id: c.id, label: c.label })),
  }
}
