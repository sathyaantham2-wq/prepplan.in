import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { LayoutGrid, Plus } from 'lucide-react'
import { useSchool } from '../../../components/school/context'
import { Drawer, InfoTip, useShell } from '../../../components/school/kit'
import {
  Btn,
  Card,
  Chip,
  EmptyState,
  Notice,
  PageHeader,
  Select,
  TextInput,
} from '../../../components/school/ui'
import { api } from '../../../lib/school-client'
import type { SchoolOverview } from '../../../lib/school-client'

export const Route = createFileRoute('/school/$schoolId/classes')({
  component: Classes,
})

function Classes() {
  const { overview, schoolId, reload } = useSchool()
  const { toast } = useShell()
  const [error, setError] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const teachers = overview.teachers.filter((t) => t.role === 'teacher')

  async function act(body: Record<string, unknown>, ok?: string) {
    setError(null)
    try {
      await api(`/api/schools/${schoolId}/setup`, { body })
      await reload()
      if (ok) toast(ok)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Classes"
        help="Each class with its sections and subjects, the class teacher of each section, and who teaches what."
        primary={
          <Btn onClick={() => setAdding(true)}>
            <Plus aria-hidden="true" className="size-5" />
            Add a class
          </Btn>
        }
      />
      {error ? <Notice kind="error">{error}</Notice> : null}
      {overview.classes.length === 0 ? (
        <EmptyState
          icon={<LayoutGrid className="size-6" />}
          title="No classes yet"
          action={
            <Btn onClick={() => setAdding(true)}>
              <Plus aria-hidden="true" className="size-5" />
              Add your first class
            </Btn>
          }
        >
          Add a class (for example Class 7), then its sections (A, B) and the subjects it studies.
        </EmptyState>
      ) : null}
      {overview.classes.map((c) => (
        <ClassCard key={c.id} cls={c} teachers={teachers} assignments={overview.assignments} act={act} />
      ))}
      <Drawer open={adding} title="Add a class" help="Choose the class and the school year. You add its sections and subjects next." onClose={() => setAdding(false)}>
        <AddClass
          act={async (b, ok) => {
            await act(b, ok)
            setAdding(false)
          }}
        />
      </Drawer>
    </div>
  )
}

function AddClass({
  act,
}: {
  act: (b: Record<string, unknown>, ok?: string) => Promise<void>
}) {
  const [grade, setGrade] = useState('7')
  const [year, setYear] = useState('2026-27')
  return (
    <div className="space-y-4">
      <Select
        label="Class"
        value={grade}
        onChange={(e) => setGrade(e.target.value)}
      >
        {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => (
          <option key={g} value={g}>
            Class {g}
          </option>
        ))}
      </Select>
      <TextInput
        label="School year"
        value={year}
        onChange={(e) => setYear(e.target.value)}
      />
      <Btn
        className="w-full"
        onClick={() =>
          act(
            {
              action: 'create_class',
              grade: Number(grade),
              academic_year: year,
            },
            `Class ${grade} added.`,
          )
        }
      >
        Add class
      </Btn>
    </div>
  )
}

function ClassCard({
  cls,
  teachers,
  assignments,
  act,
}: {
  cls: SchoolOverview['classes'][number]
  teachers: SchoolOverview['teachers']
  assignments: SchoolOverview['assignments']
  act: (b: Record<string, unknown>, ok?: string) => Promise<void>
}) {
  const [section, setSection] = useState('')
  const [subject, setSubject] = useState('')
  return (
    <Card className="space-y-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-xl font-bold">
          Class {cls.grade}{' '}
          <span className="text-base font-normal text-slate-600">
            · {cls.academicYear}
          </span>
        </h2>
        <p className="text-[15px] text-slate-600">
          {cls.sections.length} section{cls.sections.length === 1 ? '' : 's'} · {cls.subjects.length} subject{cls.subjects.length === 1 ? '' : 's'} ·{' '}
          {cls.sections.reduce((n, x) => n + x.studentCount, 0)} students
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="flex items-center gap-1 text-base font-bold">
          Sections
          <InfoTip>For each section choose the class teacher, and the teacher of each subject. The class teacher prints the sign-in slips and does the spot-checks unless you choose the subject teacher.</InfoTip>
        </h3>
        {cls.sections.length === 0 ? (
          <p className="text-base text-slate-700">No sections yet.</p>
        ) : null}
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {cls.sections.map((s) => (
          <div
            key={s.id}
            className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <b className="text-base">Section {s.name}</b>
              <Chip>{s.studentCount} students</Chip>
            </div>
            <Select
              label="Class teacher"
              value={s.classTeacherMemberId ?? ''}
              onChange={(e) =>
                act(
                  {
                    action: 'set_class_teacher',
                    section_id: s.id,
                    member_id: e.target.value || null,
                  },
                  'Class teacher saved.',
                )
              }
            >
              <option value="">Not chosen yet</option>
              {teachers.map((t) => (
                <option key={t.memberId} value={t.memberId}>
                  {t.name}
                </option>
              ))}
            </Select>
            {cls.subjects.length > 0 ? (
              <div className="space-y-3 border-t border-slate-200 pt-3">
                <h4 className="text-base font-bold">Who teaches what</h4>
                {cls.subjects.map((sub) => {
                  const a = assignments.find(
                    (x) => x.sectionId === s.id && x.schoolSubjectId === sub.id,
                  )
                  return (
                    <div key={sub.id} className="space-y-2">
                      <Select
                        label={sub.name}
                        value={a?.memberId ?? ''}
                        onChange={(e) =>
                          e.target.value &&
                          act(
                            {
                              action: 'assign_teacher',
                              member_id: e.target.value,
                              section_id: s.id,
                              school_subject_id: sub.id,
                            },
                            `${sub.name}: teacher saved.`,
                          )
                        }
                      >
                        <option value="">Choose a teacher</option>
                        {teachers.map((t) => (
                          <option key={t.memberId} value={t.memberId}>
                            {t.name}
                          </option>
                        ))}
                      </Select>
                      {a ? (
                        <Select
                          label="Spot-checks done by"
                          hint="About 1 in 20 answers the AI marked is picked for a person to look over (a sample check)."
                          value={a.sampleChecker}
                          onChange={(e) =>
                            act(
                              {
                                action: 'set_sample_checker',
                                assignment_id: a.id,
                                checker: e.target.value,
                              },
                              'Saved.',
                            )
                          }
                        >
                          <option value="class_teacher">
                            The class teacher
                          </option>
                          <option value="subject_teacher">
                            The subject teacher
                          </option>
                        </Select>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            ) : null}
          </div>
        ))}
        </div>
        <div className="flex max-w-md gap-2">
          <div className="flex-1">
            <TextInput
              label="New section"
              placeholder="For example A"
              value={section}
              onChange={(e) => setSection(e.target.value)}
            />
          </div>
          <Btn
            className="mt-[1.9rem] shrink-0"
            aria-label="Add section"
            disabled={!section.trim()}
            onClick={async () => {
              await act(
                {
                  action: 'create_section',
                  class_id: cls.id,
                  name: section.trim(),
                },
                `Section ${section.trim().toUpperCase()} added.`,
              )
              setSection('')
            }}
          >
            Add
          </Btn>
        </div>
      </div>

      <div className="space-y-2 border-t border-slate-200 pt-3">
        <h3 className="text-base font-bold">Subjects</h3>
        <div className="flex flex-wrap gap-2">
          {cls.subjects.length === 0 ? (
            <p className="text-base text-slate-700">No subjects chosen yet.</p>
          ) : null}
          {cls.subjects.map((s) => (
            <Chip key={s.id} tone="good">
              {s.name}
            </Chip>
          ))}
        </div>
        {cls.availableSubjects.length > 0 ? (
          <div className="flex max-w-md gap-2">
            <div className="flex-1">
              <Select
                label="Add a subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                <option value="">Choose…</option>
                {cls.availableSubjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </Select>
            </div>
            <Btn
              className="mt-[1.9rem] shrink-0"
              aria-label="Add subject"
              disabled={!subject}
              onClick={async () => {
                await act(
                  {
                    action: 'add_subject',
                    class_id: cls.id,
                    subject_id: subject,
                  },
                  'Subject added.',
                )
                setSubject('')
              }}
            >
              Add
            </Btn>
          </div>
        ) : null}
      </div>
    </Card>
  )
}
