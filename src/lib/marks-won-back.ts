import type { Db } from '../db/connection'

export interface MarkWonBackItem {
  concept_id: string
  concept_name: string
  subject_name: string
  marks_back: number
  cause: 'knowledge' | 'habit' | null
}

export interface MarksWonBack {
  total: number
  items: Array<MarkWonBackItem>
}

const round1 = (n: number) => Math.round(n * 10) / 10

/**
 * "Marks Won Back" (owner-approved 2026-10-24): marks she lost on a concept before and has now
 * won back. Definition, exactly:
 *
 * - Only CONFIRMED items count: the item's evaluation has `confirmed_at` set (the gate every
 *   mark clears before the tracker uses it). Items the student removed from her grade
 *   (`excluded_by_student`) are skipped, as they are in grade and mastery. Retired questions are
 *   NOT filtered out: history is append-only and a lost mark stays lost.
 * - An item is dated by its evaluation's `confirmed_at`.
 * - Per concept, EARLIER = her most recent confirmed item dated BEFORE sinceDate with
 *   marks_awarded < marks_max; lost = marks_max - marks_awarded of that item. A concept with no
 *   such item earns nothing.
 * - If inside [sinceDate, untilDate] (both inclusive; untilDate omitted = no upper bound) she has
 *   at least one confirmed item on the same concept with marks_awarded = marks_max, credit
 *   min(lost, marks_max of that item) ONCE for that concept (the first such item). A partial
 *   improvement earns nothing, and a loss inside the window never counts as "before".
 * - cause is copied from the earlier loss, following evaluation.ts: knowledge_known = true means
 *   she knew it but did not deliver ('habit'); false or never reviewed is a 'knowledge' gap.
 *   (null is allowed by the type but not produced today.)
 * - total = sum of marks_back; never negative.
 */
export async function getMarksWonBack(
  db: Db,
  studentId: string,
  sinceDate: Date,
  untilDate?: Date,
): Promise<MarksWonBack> {
  let query = db
    .selectFrom('evaluation_items as ei')
    .innerJoin('evaluations as e', 'e.id', 'ei.evaluation_id')
    .innerJoin('attempts as a', 'a.id', 'e.attempt_id')
    .innerJoin('paper_questions as pq', 'pq.id', 'ei.paper_question_id')
    .innerJoin('questions as q', 'q.id', 'pq.question_id')
    .innerJoin('concepts as c', 'c.id', 'q.concept_id')
    .innerJoin('chapters as ch', 'ch.id', 'c.chapter_id')
    .innerJoin('subjects as s', 's.id', 'ch.subject_id')
    .select([
      'c.id as concept_id',
      'c.name as concept_name',
      's.name as subject_name',
      'e.confirmed_at',
      'ei.marks_awarded',
      'ei.marks_max',
      'ei.knowledge_known',
    ])
    .where('a.student_id', '=', studentId)
    .where('e.confirmed_at', 'is not', null)
    .where('ei.excluded_by_student', '=', false)
  if (untilDate) query = query.where('e.confirmed_at', '<=', untilDate)
  const rows = await query.orderBy('e.confirmed_at', 'asc').execute()

  const since = sinceDate.getTime()
  const earlierLoss = new Map<string, { lost: number; cause: 'knowledge' | 'habit' }>()
  const credited = new Map<string, MarkWonBackItem>()
  for (const r of rows) {
    const at = new Date(r.confirmed_at as Date).getTime()
    const awarded = Number(r.marks_awarded)
    const max = Number(r.marks_max)
    if (max <= 0) continue
    if (at < since) {
      // Ascending order, so a later row overwrites: the most recent loss wins.
      if (awarded < max) {
        earlierLoss.set(r.concept_id, {
          lost: max - awarded,
          cause: r.knowledge_known === true ? 'habit' : 'knowledge',
        })
      }
      continue
    }
    const loss = earlierLoss.get(r.concept_id)
    if (!loss || credited.has(r.concept_id) || awarded < max) continue
    const back = round1(Math.max(0, Math.min(loss.lost, max)))
    if (back <= 0) continue
    credited.set(r.concept_id, {
      concept_id: r.concept_id,
      concept_name: r.concept_name,
      subject_name: r.subject_name,
      marks_back: back,
      cause: loss.cause,
    })
  }
  const items = [...credited.values()].sort((x, y) => y.marks_back - x.marks_back)
  return { total: round1(items.reduce((sum, i) => sum + i.marks_back, 0)), items }
}
