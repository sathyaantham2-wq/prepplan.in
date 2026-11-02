import type { Db } from '../../../db/connection'
import { queueVars, templateDef } from './templates'
import type { Lang } from './templates'

// The one door into school_messages. Everything that wants a school person to get a message goes through
// enqueueMessage, which refuses anything not on the approved list (templates.ts), any variable the template does
// not declare, and a recipient of the wrong kind. It never throws for a duplicate: dedupe_key makes every event
// idempotent. Stage 1 of docs/schools/MESSAGING_PLAN.md; consent, caps and quiet hours are applied by the
// dispatcher (stage 3), which is the only thing that moves a message out of "queued".

export interface EnqueueInput {
  schoolId: string
  template: string
  language: Lang
  /** Parent messages: the student and the guardian whose number is used at send time. */
  studentId?: string
  guardianId?: string
  /** Teacher / principal messages. */
  memberId?: string
  variables: Record<string, string>
  dedupeKey: string
  notBefore?: Date
  /** The exam a link in this message opens (made at send time). */
  paperId?: string
}

const MAX_VALUE = 300

export class MessageRefused extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'MessageRefused'
  }
}

export function checkEnqueue(input: EnqueueInput) {
  const def = templateDef(input.template) // throws UnapprovedTemplateError
  if ((input.language as string) !== 'en' && (input.language as string) !== 'te') throw new MessageRefused('Unknown language.')
  if (def.audience === 'parent') {
    if (!input.studentId || !input.guardianId || input.memberId)
      throw new MessageRefused('A parent message needs a student and a guardian, and no staff member.')
  } else if (!input.memberId || input.studentId || input.guardianId)
    throw new MessageRefused('A staff message needs one staff member, and no student or guardian.')
  const keys = Object.keys(input.variables)
  const allowed = queueVars(def)
  const missing = allowed.filter((v) => !keys.includes(v))
  const extra = keys.filter((v) => !allowed.includes(v))
  if (missing.length > 0 || extra.length > 0)
    throw new MessageRefused(`Variables must be exactly the template's (missing: ${missing.join(', ') || 'none'}; not allowed: ${extra.join(', ') || 'none'}).`)
  for (const [k, v] of Object.entries(input.variables)) {
    if (typeof v !== 'string' || v.length === 0) throw new MessageRefused(`Variable ${k} must be a non-empty text.`)
    if (v.length > MAX_VALUE || /[\r\n\t]/.test(v)) throw new MessageRefused(`Variable ${k} is too long or has line breaks.`)
  }
  if (!input.dedupeKey) throw new MessageRefused('A message needs a dedupe key.')
  return def
}

/** Queues one message; returns its id, or null when the same event was already queued. */
export async function enqueueMessage(db: Db, input: EnqueueInput): Promise<string | null> {
  const def = checkEnqueue(input)
  const row = await db
    .insertInto('school_messages')
    .values({
      school_id: input.schoolId,
      template: def.key,
      audience: def.audience,
      recipient_student_id: input.studentId ?? null,
      recipient_guardian_id: input.guardianId ?? null,
      recipient_member_id: input.memberId ?? null,
      language: input.language,
      status: 'queued',
      variables: JSON.stringify(input.variables),
      dedupe_key: input.dedupeKey,
      not_before: input.notBefore ?? new Date(),
      ref_paper_id: input.paperId ?? null,
    })
    .onConflict((oc) => oc.columns(['school_id', 'dedupe_key']).doNothing())
    .returning('id')
    .executeTakeFirst()
  if (!row) return null
  await db
    .insertInto('school_message_events')
    .values({ school_id: input.schoolId, message_id: row.id, status: 'queued', detail: null })
    .execute()
  return row.id
}
