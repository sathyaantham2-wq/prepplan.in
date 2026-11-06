import { useState } from 'react'
import { Btn, Field, Notice, Select, TextInput, inputClass } from './ui'
import { api } from '../../lib/school-client'

interface ClassOption {
  grade: number
  academicYear: string
  sections: Array<{ name: string }>
}

/** Add one student or teacher by hand. It goes through the same check as the Excel upload. */
export function ManualAddForm({
  schoolId,
  kind,
  classes,
  defaultYear,
  onDone,
  onCancel,
}: {
  schoolId: string
  kind: 'students' | 'teachers'
  classes: Array<ClassOption>
  defaultYear: string
  onDone: () => void
  onCancel: () => void
}) {
  const [f, setF] = useState<Record<string, string>>({ whatsapp_ok: '', parent_language: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [added, setAdded] = useState<string | null>(null)
  const set = (k: string) => (v: string) => setF((cur) => ({ ...cur, [k]: v }))
  const isStudent = kind === 'students'
  const grades = [...classes].sort((a, b) => a.grade - b.grade)
  const sectionsOfGrade = grades.find((c) => String(c.grade) === f.class)?.sections ?? []

  async function save() {
    setBusy(true)
    setError(null)
    try {
      await api(`/api/schools/${schoolId}/imports/manual`, {
        body: { kind, academic_year: isStudent ? defaultYear : undefined, fields: f },
      })
      setAdded(f.name?.trim() || (isStudent ? 'The student' : 'The teacher'))
      onDone()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Nothing was added. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  if (added !== null) {
    return (
      <div className="space-y-3">
        <Notice kind="good">{added} was added.</Notice>
        <Btn
          className="w-full"
          onClick={() => {
            setF({ whatsapp_ok: '', parent_language: '' })
            setAdded(null)
          }}
        >
          Add another
        </Btn>
        <Btn kind="plain" className="w-full" onClick={onCancel}>
          Close
        </Btn>
      </div>
    )
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        void save()
      }}
    >
      <TextInput label="Full name" value={f.name ?? ''} onChange={(e) => set('name')(e.target.value)} required />
      {isStudent ? (
        <>
          <Field label="Class">
            {(id) => (
              <select
                id={id}
                className={inputClass}
                value={f.class ?? ''}
                onChange={(e) => setF((cur) => ({ ...cur, class: e.target.value, section: '' }))}
                required
              >
                <option value="">Choose a class</option>
                {grades.map((c) => (
                  <option key={c.grade} value={c.grade}>
                    Class {c.grade}
                  </option>
                ))}
              </select>
            )}
          </Field>
          <Field label="Section">
            {(id) => (
              <select id={id} className={inputClass} value={f.section ?? ''} onChange={(e) => set('section')(e.target.value)} required>
                <option value="">Choose a section</option>
                {sectionsOfGrade.map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            )}
          </Field>
          <TextInput label="Roll number" value={f.roll_no ?? ''} onChange={(e) => set('roll_no')(e.target.value)} required />
          <TextInput
            label="Admission number (optional)"
            hint="Leave empty and we make a permanent sign-in ID."
            value={f.admission_no ?? ''}
            onChange={(e) => set('admission_no')(e.target.value)}
          />
          <TextInput label="Parent name (optional)" value={f.parent_name ?? ''} onChange={(e) => set('parent_name')(e.target.value)} />
          <TextInput
            label="Parent phone (optional)"
            type="tel"
            value={f.parent_phone ?? ''}
            onChange={(e) => set('parent_phone')(e.target.value)}
          />
          <Select label="Parent may be messaged on WhatsApp" value={f.whatsapp_ok ?? ''} onChange={(e) => set('whatsapp_ok')(e.target.value)}>
            <option value="">Not decided</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </Select>
          <Select label="Language for parent messages" value={f.parent_language ?? ''} onChange={(e) => set('parent_language')(e.target.value)}>
            <option value="">Not decided</option>
            <option value="English">English</option>
            <option value="Telugu">Telugu</option>
          </Select>
        </>
      ) : (
        <>
          <TextInput label="Email" type="email" value={f.email ?? ''} onChange={(e) => set('email')(e.target.value)} required />
          <TextInput
            label="Teaches (optional)"
            hint="Class, section and subject, separated by semicolons: 7A Maths; 7B Maths; 8A Science"
            value={f.teaches ?? ''}
            onChange={(e) => set('teaches')(e.target.value)}
          />
          <TextInput
            label="Class teacher of (optional)"
            hint="For example 7A"
            value={f.class_teacher_of ?? ''}
            onChange={(e) => set('class_teacher_of')(e.target.value)}
          />
        </>
      )}
      {error ? <Notice kind="error">{error}</Notice> : null}
      <Btn type="submit" className="w-full" disabled={busy}>
        {busy ? 'Adding…' : isStudent ? 'Add this student' : 'Add this teacher'}
      </Btn>
      <Btn kind="plain" className="w-full" onClick={onCancel}>
        Cancel
      </Btn>
    </form>
  )
}
