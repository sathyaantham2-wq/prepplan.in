import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { AdminPage, Notice, Panel, Pill, StatTile } from '../../components/admin/admin-ui'

export const Route = createFileRoute('/admin/syllabus')({
  component: AdminSyllabus,
})

interface Subject {
  id: string
  name: string
  code: string
  board: string
  class: number
}
interface Chapter {
  id: string
  part: string
  chapter_no: number
  name: string
  blurb: string | null
  in_scope_count: number
  out_scope_count: number
}
interface Concept {
  id: string
  code: string
  name: string
  difficulty_base: string
  target_question_count: number
  description: string | null
}
interface ScopeItem {
  id: string
  item_text: string
  page_ref: string | null
}
interface ChapterScope {
  in: Array<ScopeItem>
  out: Array<ScopeItem>
}

/**
 * F083 (tab06 /admin/syllabus): deliberately read-only -- a browser over the hierarchy the
 * ingest-source and scope-authoring skills populate (F015 scoped a write CRUD API out). Board/class
 * fetched for CBSE/7 directly, same precedent as /admin/questions and /admin/blueprints.
 */
function AdminSyllabus() {
  const [subjects, setSubjects] = useState<Array<Subject>>([])
  const [subjectsLoaded, setSubjectsLoaded] = useState(false)
  const [subjectId, setSubjectId] = useState('')
  const [chapters, setChapters] = useState<Array<Chapter>>([])
  const [loadError, setLoadError] = useState<string | null>(null)

  const [expandedChapterId, setExpandedChapterId] = useState<string | null>(null)
  const [concepts, setConcepts] = useState<Array<Concept>>([])
  const [scope, setScope] = useState<ChapterScope | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  useEffect(() => {
    fetch('/api/syllabus/subjects?board=CBSE&class=7')
      .then(async (r) => {
        if (!r.ok) throw new Error('Could not load subjects.')
        return r.json() as Promise<Array<Subject>>
      })
      .then((data) => {
        setSubjects(data)
        if (data.length === 1) setSubjectId(data[0].id)
      })
      .catch((err: Error) => setLoadError(err.message))
      .finally(() => setSubjectsLoaded(true))
  }, [])

  useEffect(() => {
    setChapters([])
    setExpandedChapterId(null)
    if (!subjectId) return
    fetch(`/api/syllabus/chapters?subject_id=${subjectId}`)
      .then(async (r) => {
        if (!r.ok) throw new Error('Could not load chapters.')
        return r.json() as Promise<Array<Chapter>>
      })
      .then(setChapters)
      .catch((err: Error) => setLoadError(err.message))
  }, [subjectId])

  async function toggleChapter(chapter: Chapter) {
    if (expandedChapterId === chapter.id) {
      setExpandedChapterId(null)
      return
    }
    setExpandedChapterId(chapter.id)
    setDetailLoading(true)
    setConcepts([])
    setScope(null)
    try {
      const [conceptsRes, scopeRes] = await Promise.all([
        fetch(`/api/syllabus/concepts?chapter_id=${chapter.id}`),
        fetch(`/api/syllabus/chapters/${chapter.id}/scope`),
      ])
      if (conceptsRes.ok) setConcepts(await conceptsRes.json())
      if (scopeRes.ok) setScope(await scopeRes.json())
    } finally {
      setDetailLoading(false)
    }
  }

  const totalIn = chapters.reduce((n, c) => n + c.in_scope_count, 0)
  const totalOut = chapters.reduce((n, c) => n + c.out_scope_count, 0)

  const scopeList = (title: string, items: Array<ScopeItem>) => (
    <div>
      <p className="field-label mb-2">
        {title} ({items.length})
      </p>
      {items.length === 0 ? (
        <p className="text-small text-muted-foreground">None recorded.</p>
      ) : (
        <ul className="space-y-1.5">
          {items.map((item) => (
            <li key={item.id} className="text-small">
              {item.item_text}
              {item.page_ref && <span className="text-muted-foreground"> ({item.page_ref})</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  )

  return (
    <AdminPage
      title="Syllabus"
      description="Read-only view of the board/class/subject/chapter/concept hierarchy and each chapter's IN/OUT scope. Content is added via the ingest-source and scope-authoring skills, not from here."
      actions={
        subjects.length > 1 ? (
          <select
            id="subject"
            aria-label="Subject"
            className="border-input bg-card h-9 rounded-md border px-3 text-sm"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
          >
            <option value="">Select a subject</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} (Class {s.class})
              </option>
            ))}
          </select>
        ) : undefined
      }
    >
      {loadError && <Notice tone="bad">{loadError}</Notice>}
      {subjectsLoaded && subjects.length === 0 && !loadError && (
        <Notice>No subjects found for CBSE Class 7 yet.</Notice>
      )}
      {subjects.length > 1 && !subjectId && <Notice>Pick a subject to browse its chapters.</Notice>}

      {chapters.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <StatTile label="Chapters" value={chapters.length} />
          <StatTile label="In scope items" value={totalIn} tone="good" />
          <StatTile label="Out of scope items" value={totalOut} />
        </div>
      )}

      {chapters.length > 0 && (
        <Panel title="Chapters" subtitle="Select a chapter to see its concepts and scope.">
          <ul className="divide-border -mx-2 divide-y">
            {chapters.map((chapter) => {
              const open = expandedChapterId === chapter.id
              return (
                <li key={chapter.id}>
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => void toggleChapter(chapter)}
                    className="hover:bg-muted/50 flex w-full items-center gap-3 rounded-lg px-2 py-3 text-left transition-colors"
                  >
                    <ChevronRight
                      className={`text-muted-foreground size-4 shrink-0 transition-transform ${open ? 'rotate-90' : ''}`}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="text-body block font-medium">
                        {chapter.part} Ch {chapter.chapter_no}: {chapter.name}
                      </span>
                      {chapter.blurb && (
                        <span className="text-small text-muted-foreground block">{chapter.blurb}</span>
                      )}
                    </span>
                    <span className="flex shrink-0 flex-col items-end gap-1 sm:flex-row">
                      <Pill tone="good">{chapter.in_scope_count} in</Pill>
                      <Pill>{chapter.out_scope_count} out</Pill>
                    </span>
                  </button>

                  {open && (
                    <div className="bg-muted/30 mx-2 mb-3 space-y-5 rounded-xl p-4">
                      {detailLoading && <Notice>Loading…</Notice>}
                      {!detailLoading && (
                        <>
                          <div>
                            <p className="field-label mb-2">Concepts ({concepts.length})</p>
                            {concepts.length === 0 ? (
                              <p className="text-small text-muted-foreground">
                                No concepts scoped for this chapter yet.
                              </p>
                            ) : (
                              <div className="overflow-x-auto">
                                <table className="text-small w-full min-w-[480px]">
                                  <thead>
                                    <tr className="text-muted-foreground border-border border-b text-left">
                                      <th className="py-1.5 pr-3 font-medium">Code</th>
                                      <th className="py-1.5 pr-3 font-medium">Concept</th>
                                      <th className="py-1.5 pr-3 font-medium">Base level</th>
                                      <th className="py-1.5 text-right font-medium">Target Qs</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {concepts.map((c) => (
                                      <tr key={c.id} className="border-border hover:bg-muted/50 border-b last:border-0">
                                        <td className="text-muted-foreground py-1.5 pr-3 whitespace-nowrap">{c.code}</td>
                                        <td className="py-1.5 pr-3">{c.name}</td>
                                        <td className="py-1.5 pr-3 whitespace-nowrap">{c.difficulty_base}</td>
                                        <td className="py-1.5 text-right tabular-nums">{c.target_question_count}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                          {scope && (
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                              {scopeList('IN scope', scope.in)}
                              {scopeList('OUT of scope', scope.out)}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </Panel>
      )}
    </AdminPage>
  )
}
