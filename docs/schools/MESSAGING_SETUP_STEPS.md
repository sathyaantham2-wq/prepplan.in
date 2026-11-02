# School messaging: what to set up in Make, Meta and Vercel (owner steps)

Written for the PrepPlan owner. PrepPlan has already built its side (docs/schools/MESSAGING_PLAN.md). Nothing here has
been created in any of your accounts. Do the steps in this order; each one can be checked before the next.

## 0. Before anything: the secret and the two Vercel variables

1. Make one long random secret on your Mac: `openssl rand -hex 32` (64 characters). Keep it private. It is used in three
   places: Vercel, Make (verify), Make (sign the callback).
2. In Vercel, project `examprep-ai`, Settings > Environment Variables (Production), add:
   - `MAKE_MESSAGING_SECRET` = the secret above
   - `MAKE_MESSAGING_WEBHOOK_URL` = the Make webhook address from step 1 below
3. Redeploy after adding them. Until both exist, PrepPlan queues messages as "Not sent" and sends nothing.
4. A school sends nothing until PrepPlan switches `messaging_enabled` on for it (owner only; ask Claude to do it for the
   pilot school when you are ready).
5. The 30-minute clock (`/api/cron/school-messages`) is **not** in `vercel.json` yet: Vercel's free plan allows only
   daily crons and would reject the deploy. After you confirm the Pro plan, Claude adds
   `{ "path": "/api/cron/school-messages", "schedule": "*/30 * * * *" }`.

## 1. Make scenario A: PrepPlan to WhatsApp (delivery)

1. New scenario, first module **Webhooks > Custom webhook**. Copy its address into `MAKE_MESSAGING_WEBHOOK_URL`.
2. Run it once from PrepPlan (or send a test) so Make learns this shape:

```json
{
  "message_id": "uuid",
  "template": "result_ready_v1",
  "language": "te",
  "channels": ["whatsapp"],
  "recipient": { "phone": "+919876500011", "email": null },
  "variables": { "school": "...", "child": "...", "link": "https://www.prepplan.in/p/..." },
  "timestamp": 1793500000
}
```

3. Header sent with it: `X-PrepPlan-Signature` (hex) and `X-PrepPlan-Timestamp`.
4. **Verify (a filter right after the webhook; stop the scenario if it fails):**
   signature must equal `sha256( timestamp + "." + message_id + "." + template + "." + recipient ; hex ; secret )`
   where `recipient` is `recipient.phone`, or `recipient.email` when there is no phone. Also reject when the timestamp
   is more than 5 minutes from now. (Make's text function `sha256(text; encoding; key)` with encoding `hex` is the keyed
   hash.)
5. **Router** on `channels[1]`: `whatsapp` goes to the **WhatsApp Business Cloud > Send a template message** module:
   template name = `template`, language = `language` (`en` or `te`), body variables in the order listed in
   docs/schools/MESSAGING_PLAN.md section 6 (the `{{1}}`, `{{2}}`... order is the order of `vars` in
   `src/lib/schools/messaging/templates.ts`). A route for `email` (teachers and principal only) sends a plain email
   with the same text.
6. **Last module: call back to PrepPlan** (HTTP > Make a request) `POST https://www.prepplan.in/api/messaging/callback`
   JSON `{ "message_id": ..., "status": "sent" | "delivered" | "read" | "failed", "reason": ..., "timestamp": <now in
   seconds>, "signature": ... }` where `signature = sha256( timestamp + "." + message_id + "." + status ; hex ; secret )`.
   Send `sent` right after the WhatsApp module; `delivered`, `read`, `failed` come from WhatsApp's status events
   (a second small scenario or the module's status trigger).
7. Keep Make's data minimal: scenario settings > turn on **Data is confidential**; do not store incomplete executions;
   set the shortest execution-log retention your plan allows; never copy the payload into a Data Store, sheet or email.

## 2. Make scenario B: a parent's reply (STOP)

1. Trigger: WhatsApp Business Cloud **Watch messages**.
2. If the text is anything, post it (PrepPlan decides if it is STOP) to the same callback address:
   `{ "type": "inbound", "phone": "+91...", "text": "<the reply>", "timestamp": <now seconds>,
   "signature": sha256( timestamp + "." + phone + ".inbound" ; hex ; secret ) }`.
3. PrepPlan only acts on a reply that is exactly STOP (any capitals, optional full stop). It then stops every message to
   that number in every school.

## 3. Meta (WhatsApp Business)

1. business.facebook.com: create or open your business account, in the legal name of your business.
2. Business verification (legal name, address, registration or GST documents, a website with the same details).
3. Create a WhatsApp Business Account; add a dedicated phone number that is not on WhatsApp and can get an OTP; get the
   display name approved.
4. Add a payment method (utility messages are charged per message; check Meta's current rate card for India).
5. Create a System User with a permanent token and connect Make with it (not a personal token).
6. WhatsApp Manager > Message templates: submit the seven templates, **category Utility**, languages English and Telugu.
   Use the numbered text from section 6 of docs/schools/MESSAGING_PLAN.md. Names: `result_ready_v1`, `weekly_focus_v1`,
   `flags_waiting_v1`, `uploads_pending_v1`, `dispute_closing_v1`, `teacher_attention_v1`, `monday_pulse_v1`.
   If Meta changes one to Marketing (most likely `weekly_focus_v1`), tell Claude and it will be reworded.
7. A new number starts with a small daily limit of different recipients; business verification raises it. Plan the pilot
   size to match.

## 4. Check it works (before any real parent)

1. Ask Claude to turn messaging on for the demo school only.
2. In PrepPlan: Messages > Parents: mark one test parent (your own number) as agreed, language Telugu.
3. Release a section's results. Within a minute the Messages > Activity screen shows Sent, then Delivered/Read after
   Make reports back. Open the link in the message: it shows the child's first name and the marks, nothing else.
4. Reply STOP from that phone: the parent shows "Replied STOP" and nothing more is sent.

## SMS fallback (optional; not recommended for the pilot)

Needs India DLT registration (entity, sender header, content templates, whitelisted link domain), which takes several
working days. Skip it for the pilot.
