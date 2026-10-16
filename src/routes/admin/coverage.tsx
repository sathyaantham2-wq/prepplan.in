import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { AdminPage, Notice, Panel, Pill, StatTile } from '../../components/admin/admin-ui'
import { Label } from '../../components/ui/label'
import { STATUS } from '../../components/charts/palette'

export const Route = createFileRoute('/admin/coverage')({
  component: AdminCoverage,
})

interface Subject {
  id: string
  name: string
}

interface CoverageCell {
  bloom: string
  difficulty: string
  count: number
  target: number
  shortfall: boolean
}

interface ConceptGrid {
  concept_id: string
  concept_name: string
  target_question_count: number
  cells: Array<CoverageCell>
  empty_cells: number
}

const BLOOM_LEVELS = [
  'Remember',
  'Understand',
  'Apply',
  'Analyse',
  'Evaluate',
  'Create',
]
const DIFFICULTIES = ['Easy', 'Hard', 'Hardest']

function cellStyle(cell: CoverageCell): { background: string; color: string } {
  if (cell.count === 0) {
    return { background: `${STATUS.critical}1a`, color: STATUS.critical }
  }
  if (cell.shortfall) {
    return { background: `${STATUS.warning}1a`, color: STATUS.warning }
  }
  return { background: 'transparent', color: 'inherit' }
}

/**
 * F115 (tab03): "per concept, a 6 Bloom x 3 difficulty grid shows counts and target counts; a
 * shortfall report drives the next generation batch." Not in tab06's screen list -- that sheet
 * has no route for this reporting view at all -- so this is a standalone admin screen, same
 * pattern as /admin/questions and /admin/blueprints (no shared admin nav shell exists yet either).
 * Color is a secondary cue, not the signal: every cell's "count/target" text already carries the
 * meaning on its own (this app's print stylesheet flattens color to black-on-white), and the
 * legend spells out what the two tint states mean rather than relying on color alone.
 */
function AdminCoverage() {
  const [subjects, setSubjects] = useState<Array<Subject>>([])
  const [subjectId, setSubjectId] = useState('')
  const [grids, setGrids] = useState<Array<ConceptGrid> | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/syllabus/subjects?board=CBSE&class=7')
      .then((r) => r.json())
      .then((data: Array<Subject>) => {
        setSubjects(data)
        if (data.length === 1) setSubjectId(data[0].id)
      })
      .catch(() => setLoadError('Could not load the subjects.'))
  }, [])

  useEffect(() => {
    setGrids(null)
    setLoadError(null)
    if (!subjectId) return
    fetch(`/api/questions/coverage-grid?subject_id=${subjectId}`)
      .then(async (r) => {
        if (!r.ok) throw new Error('Could not load the coverage grid.')
        return r.json() as Promise<Array<ConceptGrid>>
      })
      .then(setGrids)
      .catch((err: Error) => setLoadError(err.message))
  }, [subjectId])

  const totalShortfallCells =
    grids?.reduce((sum, g) => sum + g.cells.filter((c) => c.shortfall).length, 0) ?? 0
  const totalEmptyCells = grids?.reduce((sum, g) => sum + g.empty_cells, 0) ?? 0
  const concepts = grids?.length ?? 0
  const incomplete = grids?.filter((g) => g.cells.some((c) => c.shortfall)).length ?? 0

  return (
    <AdminPage
      title="Bloom × difficulty coverage"
      description="Approved question count vs. target, per concept. Sorted worst-covered first — this is the report a targeted generation batch (F116) should be driven from."
      actions={
        <div className="flex items-center gap-2">
          <Label htmlFor="subject">Subject</Label>
          <select
            id="subject"
            className="border-input bg-card flex h-9 min-w-44 rounded-md border px-3 text-sm shadow-xs"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
          >
            <option value="">Select a subject</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      }
    >
      {loadError && <Notice tone="bad">{loadError}</Notice>}
      {!subjectId && !loadError && <Notice>Select a subject to see its coverage grid.</Notice>}
      {subjectId && !grids && !loadError && <Notice>Loading the coverage grid…</Notice>}

      {grids && (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatTile label="Concepts" value={concepts} />
            <StatTile label="Concepts below target" value={incomplete} tone={incomplete ? 'warn' : 'good'} />
            <StatTile label="Empty cells" value={totalEmptyCells} tone={totalEmptyCells ? 'bad' : 'good'} />
            <StatTile label="Cells below target" value={totalShortfallCells} tone={totalShortfallCells ? 'warn' : 'good'} />
          </div>

          <Panel
            title="Concepts"
            subtitle="Open a concept to see its grid."
            action={
              <div className="text-small text-muted-foreground flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: STATUS.critical }} />
                  Empty cell
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: STATUS.warning }} />
                  Below target ({totalShortfallCells} cells across all concepts)
                </span>
              </div>
            }
          >
            {grids.length === 0 && <Notice>This subject has no concepts yet.</Notice>}
            <div className="space-y-2">
              {grids.map((grid) => (
                <details key={grid.concept_id} className="border-border rounded-xl border">
                  <summary className="text-body flex cursor-pointer flex-wrap items-center gap-x-2 gap-y-1 px-4 py-3 font-medium">
                    {grid.concept_name}
                    <span className="text-small text-muted-foreground font-normal">
                      target {grid.target_question_count} — {grid.empty_cells} empty cell
                      {grid.empty_cells === 1 ? '' : 's'}
                    </span>
                    {grid.empty_cells > 0 && <Pill tone="bad">{grid.empty_cells} empty</Pill>}
                  </summary>
                  <div className="overflow-x-auto px-4 pb-4">
                    <table className="text-small w-full min-w-[520px] border-collapse tabular-nums">
                      <thead>
                        <tr>
                          <th className="text-muted-foreground p-1.5 text-left font-normal">
                            Difficulty \ Bloom
                          </th>
                          {BLOOM_LEVELS.map((b) => (
                            <th key={b} className="text-muted-foreground p-1.5 text-left font-normal">
                              {b}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {DIFFICULTIES.map((difficulty) => (
                          <tr key={difficulty} className="border-border border-t">
                            <th className="p-1.5 text-left font-medium">{difficulty}</th>
                            {BLOOM_LEVELS.map((bloom) => {
                              const cell = grid.cells.find(
                                (c) => c.bloom === bloom && c.difficulty === difficulty,
                              )
                              if (!cell) return <td key={bloom} className="p-1.5" />
                              const style = cellStyle(cell)
                              return (
                                <td key={bloom} className="rounded p-1.5" style={{ background: style.background }}>
                                  <span style={{ color: style.color }}>
                                    {cell.count}/{cell.target}
                                  </span>
                                </td>
                              )
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </details>
              ))}
            </div>
          </Panel>
        </>
      )}
    </AdminPage>
  )
}
