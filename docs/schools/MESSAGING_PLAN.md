# School messaging: parents, teachers, principal (pilot set)

Status: **Approved 2026-11-01. Stages 1-4 built locally (not committed, not deployed, production untouched).** What is left is your side: the Make scenario, Meta and (optionally) SMS steps in section 10, then a production migration (0096-0098) and deploy only on your go-ahead.

Owner change 2026-11-01: the **2-messages-per-child-per-week cap is removed** (so D2 no longer applies). The principal (or the office) now chooses a limit, if any, in Messages > Settings (migration 0098, `schools.parent_weekly_limit`, empty = none). When it is reached, a result waits until Monday 8 am and a weekly reminder is skipped. Everything else in section 1 stands. Local/test database only; no push, no
deploy, no production change, nothing created in Make, Meta/WhatsApp or any SMS account.
No F-number exists for this; section 14 proposes new tab 03 rows without numbers.

Principle: **PrepPlan decides WHAT is sent and to WHOM. Make only DELIVERS.** Recipients, timing, language,
templates, caps and consent all live in PrepPlan. Make gets one small signed webhook per message and reports
delivery back.

---

## 0. Decisions I need from you (they change rules already in CLAUDE.md)

| # | Question | My recommendation |
|---|---|---|
| D1 | CLAUDE.md "School module rules" says *no consent record per student* and *no weekly summaries / nudges to school students*. This feature adds a per-student **WhatsApp contact permission** and a **weekly_focus** message. | Treat the permission as a *contact permission*, not a data-processing consent (the school terms stay the legal basis). Allow `weekly_focus` **to parents only, with permission, and never to the student**. I will amend the "School module rules" paragraph once you approve. |
| D2 | **2-per-week cap vs. results.** A child can have 3 papers released in one week. If `result_ready` counts toward the cap, the third would be blocked. | Results win over focus: `weekly_focus` is dropped first. A `result_ready` that would exceed the cap is **held and sent Monday 8 am** (not lost). |
| D3 | Dispute line says "within 7 days". The window is a per-school setting (`dispute_window_days`, default 7). | The line uses the school's real number (`{window_days}`), never a hard-coded 7. Link life stays a fixed 7 days. |
| D4 | School name inside the parent message (parents must know who is writing). Your payload list does not name it. | Add `school` as one more template variable. It never appears in the link's title or preview. |
| D5 | Topic names exist only in English in the bank. A Telugu message would carry English topic names; habit names (e.g. "skipped steps") do have Telugu. | Accept for the pilot; Telugu topic names are a later bank task. |
| D6 | Vercel cron frequency depends on your plan (Hobby = once a day only). The dispatcher needs to run every 30 min. | Confirm you are on Pro. If not, fall back to one inline send at release time plus a daily sweep (slower retries). |
| D7 | **Teacher-only concern alert** ("fell two tests in a row"). You said it goes to the class teacher, but it is not in your event list. | Add it as an 8th event, `teacher_attention`, so the rule has somewhere to go. Teacher-only, never parents. |
| D8 | A STOP reply arrives as a phone number. One number can be a guardian in two schools. | STOP opts that number out **everywhere** (protective, leaks nothing). This one function is deliberately not school-scoped and gets its own test and isolation-lint exemption. |
| D9 | Very low scores (e.g. under 35%) go to parents automatically as "score". | Optional: hold such a `result_ready` for the class teacher to release by hand. Off in the pilot unless you say otherwise. |

---

## 1. Events

All times are IST. A message is created ("queued") by the event; the **dispatcher** decides when it really leaves.

### Parents (WhatsApp first; only with permission and not opted out)

| Event | Trigger | Content (variables only) |
|---|---|---|
| `result_ready` | `releaseSection()` succeeds (enqueue is wrapped in try/catch: releasing never fails because of messaging) | first name, subject, exam, score, school, one strength, two things to practise, personal report link, `window_days` line |
| `weekly_focus` | Sunday 6 pm | first name, 3 focus items, link to the practice sheet. **Skipped** if there are no new final marks since the last one |
| dispute line | inside `result_ready` | "If you think a mark is wrong, ask within `{window_days}` days." |

### Teachers (only their own section-subject pairs)

| Event | Trigger | Content |
|---|---|---|
| `flags_waiting` | daily 4 pm, only if open flags exist | count, sections, oldest age in days, app link |
| `uploads_pending` | daily 10 am while an exam is open (sheets expected, results not released) | exam, section, first names of up to 8 students with missing sheets (+N more), app link |
| `dispute_closing` | 10 am on the day before a window closes, only if student queries are still open | exam, section, close date, count, app link |
| `teacher_attention` (D7) | when a student's level falls on two consecutive tests (the existing "fall" rule in `topic-level.ts`) | class teacher only: first name, section, subject, app link |

### Principal

| Event | Trigger | Content |
|---|---|---|
| `monday_pulse` | Monday 8 am | 3 weakest class x subject x chapter boxes, count of sections that improved, "stuck" list (flags older than 48 h, uploads incomplete, AI spend over 80% of the cap), app link |

### Rules (enforced in one function, `canSendToParent`, that every parent message must pass)

1. ~~Max 2 parent messages per child per week~~ **Removed by the owner (2026-11-01).** A principal-set limit comes in stage 4. Every message is still idempotent (rule 6).
2. **Worrying news never goes to parents.** Parent builders accept a fixed, whitelisted shape (score, one strength, practise items). Levels, dips, falls, rank and comparisons are not in that shape, so they cannot leak. A test feeds a "fell twice" student and asserts the parent text contains none of it, while `teacher_attention` is created for the class teacher.
3. **Quiet hours: no parent message 9 pm to 8 am.** Queued messages wait until 8:00, they are not dropped. (Staff messages are scheduled inside working hours anyway.)
4. **Purpose limit.** Results, reminders and learning only. A single file lists the **approved templates** (section 6). The database column has a CHECK constraint on those names, the enqueue function refuses anything else, and a test fails if a template is added without being on the list, is not `utility`, or contains a URL other than `{link}` or a promotional word list match. No `product_events`, no leaderboard, no cross-sell.
5. Parent without permission, or opted out: **nothing is sent**; the school prints the one-page summary instead (existing `progress-share` PDF).
6. Idempotent: every message has a `dedupe_key` (event + recipient + period), unique in the table. Re-running a cron or double-clicking Release never sends twice.

---

## 2. Parent permission and preferences

* **Roster upload** gets two optional columns (aliases accepted like the existing ones): `parent_whatsapp_ok` (yes/no, **default no**) and `parent_language` (English/Telugu, default English). The existing parent phone column (`school_student_guardians.phone_e164`) is the number used.
* **Who confirmed and when:** new table `school_parent_messaging` (one row per student): `whatsapp_ok`, `language`, `confirmed_by_user_id` (the school admin who uploaded or edited), `confirmed_at`, `opted_out_at`, `opted_out_how` (`stop_reply` | `admin`).
* **STOP:** Make posts the inbound reply to the callback (section 4). PrepPlan marks every matching guardian row opted out, writes an event to the log and `audit_log`, and cancels queued parent messages. **A roster re-upload can never switch an opted-out parent back on**; the admin must re-enable on the student's page, which records who and when.
* **Admin screen** shows per student: permission yes/no, language, confirmed by/at, opted-out status.
* Phone must be valid E.164 (already validated by the roster parser); invalid number = no permission.

---

## 3. Personal report links

* Format: `https://www.prepplan.in/p/<token>`. Token = base64url(claims) + `.` + HMAC-SHA256 signature, key derived from `BETTER_AUTH_SECRET` with HKDF using its own context string (`parent-link-v1`), same approach as `booklet-token.ts`.
* Claims: school id, **one student id**, report kind (`exam` + paper id, or `focus`), expiry (issue time + 7 days), version. A **new link is minted for every message**, at send time (not queue time).
* The page `/p/$token` is **read-only, no login**, shows that child only. It re-checks on every open that the student is still active in that school.
* **Preview safety:** the page's `<title>` and Open Graph tags are fixed text ("PrepPlan report"), with no child name and no school name. `noindex`, `Referrer-Policy: no-referrer`, `Cache-Control: private, no-store`. The name and school appear only in the page body, behind the signature.
* Expired or tampered or wrong-student token: the same friendly page, "This link has expired or is not valid. Please ask the school for a new link." It says nothing about which of the three it was.
* Opens are **not** logged for analytics (purpose limit). Basic per-IP rate limit on the route.
* The `focus` link also serves the printable practice sheet PDF (`/p/<token>/practice.pdf`), same token check.
* Tests: expiry, tampering (flip a character in claims and in signature), another child's id swapped in, another school's id, student left the school, title/OG contain no name.

---

## 4. Webhook to Make (delivery only)

Env: `MAKE_MESSAGING_WEBHOOK_URL`, `MAKE_MESSAGING_SECRET` (both optional in `env.ts`; the existing `MAKE_EMAIL_WEBHOOK_URL` is untouched).

**Outbound request**, one per message, `POST`, JSON:

```json
{
  "message_id": "uuid",
  "template": "result_ready",
  "language": "te",
  "channels": ["whatsapp", "email", "sms"],
  "recipient": { "phone": "+91...", "email": null },
  "variables": { "child": "Nainika", "subject": "Maths", "exam": "Unit Test 1",
                 "score": "32/40", "strength": "...", "practise_1": "...", "practise_2": "...",
                 "school": "...", "window_days": "7", "link_days": "7", "link": "https://..." },
  "timestamp": 1761900000
}
```

* **Never** the full report, other students, answer images, or any id other than `message_id`. A **snapshot test** pins the allowed keys per template; adding a key fails the test.
* `channels` is the order to try: WhatsApp, then email/SMS fallback. Parents: WhatsApp only in the pilot (no parent email is stored). Staff: email fallback from their login.
* **Signature** header `X-PrepPlan-Signature` = hex HMAC-SHA256 of the string `timestamp.message_id.template.recipient` (recipient = phone or email). I sign a short *canonical string* rather than the raw body because Make parses the JSON and cannot see the raw body; Make can recompute this string from the parsed fields with its `sha256(text; hex; key)` function. Timestamp older than 5 minutes is rejected by Make (replay).
* Delivery rules in PrepPlan: timeout 10 s; a 2xx means "accepted by Make", status `sent`. Retries: up to 3 attempts, backoff 5 min / 30 min / 2 h, then `failed` with a reason. Quiet-hour deferral does not use up attempts.
* **Webhook not configured:** message stays `not_sent` (visible to the admin as "not sent: messaging is not connected"); the triggering action is never affected. Same if Make is down.

**Inbound callback** `POST /api/messaging/callback`:

```json
{ "message_id": "uuid", "status": "delivered", "reason": null, "timestamp": 1761900100, "signature": "hex" }
```

* statuses: `sent`, `delivered`, `read`, `failed` (+ reason); and `{ "type": "inbound", "phone": "+91...", "text": "STOP" }` for STOP replies.
* Signature = HMAC of `timestamp.message_id.status` (or `timestamp.phone.inbound`), constant-time compare, 5-minute window. Unknown message id, bad signature, or stale timestamp = 401, no detail.
* Status only moves forward (`read` is never overwritten by a late `delivered`); every change appends to the status history. Repeated callbacks are harmless.

---

## 5. Message log, screens, retention

**Tables (new migration, local only; production only when you say so):**

* `school_messages`: id, school_id, template, audience (`parent`/`teacher`/`principal`), recipient student/member, language, channels, status (`queued`, `held`, `not_sent`, `sending`, `sent`, `delivered`, `read`, `failed`, `skipped`), reason, `variables` (jsonb, the template variables only), `dedupe_key` unique, `not_before`, attempts, next attempt, timestamps, `variables_purged_at`.
* `school_message_events`: one row per status change (the status history).
* `school_message_counts`: school, month, template, status, count (what remains after purging).
* `school_parent_messaging`: section 2.
* Added columns: `schools.messaging_enabled` (default **off**, pilot schools switched on by the owner), `schools.message_log_days` (default 365), `school_members.message_language`.
* All carry `school_id` with a `(school_id, id)` unique key so the isolation lint stays green. No message body beyond the variables; the phone number is **not** copied into the log (looked up at send time from the guardian row).

**Retention:** daily job: rows older than `message_log_days` get `variables = null`, `variables_purged_at` set, and their counts are rolled into `school_message_counts`. Per-school setting on the Settings screen.

**Screens (mobile-first, EN/TE, dark mode, like the Progress screens):**

1. **Messages (admin)** `/school/$schoolId/messages`: this week's sent count, failed (with reason and a "try again" button), "not sent: messaging not connected", opted-out parents, permission coverage per section.
2. **Teacher view**: same screen, filtered to their own sections only.
3. **Principal view**: school summary (counts per event, failures, opted out), no student-level rows.
4. **Student page**: permission, language, confirmed by/at, opt-out status, re-enable.
5. **Parent link page** `/p/$token` and the **expired link page**, checked at phone width.
6. Settings: messaging on/off, log retention.

Screenshots of every screen above (and of the parent page at phone width, valid and expired) will be produced after build.

---

## 6. Templates (drafts, category **utility**)

Names end in `_v1` for Meta. Variables are written as `{name}` here; Meta numbers them `{{1}}...` and the templates file keeps the mapping. Meta rules respected: no template starts or ends with a variable, no newlines inside variables, no promotion. Every parent template ends with the STOP line. Telugu is written to be gender-neutral for the child.

### 6.1 Parent: `result_ready_v1`

| English | తెలుగు |
|---|---|
| Hello. {school} has released {child}'s {subject} result for {exam}: {score}. What went well: {strength}. To practise: {practise_1}, {practise_2}. Full report: {link} (valid for {link_days} days). If you think a mark is wrong, please ask the school within {window_days} days. Reply STOP to stop these messages. | నమస్కారం. {school} నుండి {child} {subject} ({exam}) ఫలితం విడుదలైంది: {score}. బాగా వచ్చినది: {strength}. సాధన చేయాల్సినవి: {practise_1}, {practise_2}. పూర్తి నివేదిక: {link} ({link_days} రోజులు చెల్లుతుంది). ఏదైనా మార్కు తప్పు అనిపిస్తే {window_days} రోజుల్లోపు పాఠశాలను అడగండి. ఈ సందేశాలు వద్దంటే STOP అని జవాబు ఇవ్వండి. |

### 6.2 Parent: `weekly_focus_v1`

| English | తెలుగు |
|---|---|
| Hello. This week's focus for {child}: 1) {focus_1} 2) {focus_2} 3) {focus_3}. Practice sheet and details: {link} (valid for {link_days} days). Reply STOP to stop these messages. | నమస్కారం. ఈ వారం {child} దృష్టి పెట్టాల్సినవి: 1) {focus_1} 2) {focus_2} 3) {focus_3}. సాధన పత్రం, వివరాలు: {link} ({link_days} రోజులు చెల్లుతుంది). ఈ సందేశాలు వద్దంటే STOP అని జవాబు ఇవ్వండి. |

Risk: Meta may reclassify a weekly message as *marketing*. Wording is kept to the child's study items only, with no invitation to buy or open the app.

### 6.3 Teacher: `flags_waiting_v1`

| English | తెలుగు |
|---|---|
| Hello {teacher}. {count} flagged answer(s) are waiting for you in {sections}. The oldest has waited {oldest_days} day(s). Please review them here: {link}. Thank you. | నమస్కారం {teacher}. {sections} లో {count} ఫ్లాగ్ చేసిన జవాబులు మీ పరిశీలన కోసం ఎదురుచూస్తున్నాయి. పాతది {oldest_days} రోజులుగా ఉంది. దయచేసి ఇక్కడ చూడండి: {link}. ధన్యవాదాలు. |

### 6.4 Teacher: `uploads_pending_v1`

| English | తెలుగు |
|---|---|
| Hello {teacher}. Answer sheets are still missing for {exam} ({section}): {names}. Please upload them here: {link}. Thank you. | నమస్కారం {teacher}. {exam} ({section}) కు ఈ విద్యార్థుల జవాబు పత్రాలు ఇంకా రాలేదు: {names}. దయచేసి ఇక్కడ అప్‌లోడ్ చేయండి: {link}. ధన్యవాదాలు. |

### 6.5 Teacher: `dispute_closing_v1`

| English | తెలుగు |
|---|---|
| Hello {teacher}. The query window for {exam} ({section}) closes on {closes}. {count} student query(ies) still need your decision: {link}. Thank you. | నమస్కారం {teacher}. {exam} ({section}) సందేహాల గడువు {closes} న ముగుస్తుంది. ఇంకా {count} సందేహాలపై మీ నిర్ణయం కావాలి: {link}. ధన్యవాదాలు. |

### 6.6 Teacher: `teacher_attention_v1` (D7)

| English | తెలుగు |
|---|---|
| Hello {teacher}. {child} ({section}) has scored lower in the last two {subject} tests. A quiet word may help. Details: {link}. Thank you. | నమస్కారం {teacher}. {child} ({section}) గత రెండు {subject} పరీక్షల్లో తక్కువ మార్కులు తెచ్చుకున్నారు. ఒకసారి మాట్లాడితే మంచిది. వివరాలు: {link}. ధన్యవాదాలు. |

### 6.7 Principal: `monday_pulse_v1`

| English | తెలుగు |
|---|---|
| Good morning {name}. Weekly pulse for {school}. Weakest topics: {weak_1}; {weak_2}; {weak_3}. Sections that improved: {improved}. Stuck: {stuck}. Details: {link}. Thank you. | శుభోదయం {name}. {school} వారపు సారాంశం. బలహీనమైన అంశాలు: {weak_1}; {weak_2}; {weak_3}. మెరుగైన సెక్షన్లు: {improved}. ఆగిపోయినవి: {stuck}. వివరాలు: {link}. ధన్యవాదాలు. |

Staff links are normal app links (they sign in as usual); they carry no student data. `{names}` in 6.4 is first names only, capped at 8.
Staff language comes from `school_members.message_language` (default English).

---

## 7. Dispatcher and scheduling

* One cron route `/api/cron/school-messages` (same `CRON_SECRET` pattern as the existing crons), every 30 min (D6). It: (1) creates due scheduled events (Sunday 6 pm, 4 pm, 10 am, Monday 8 am windows, IST), (2) applies consent, cap, quiet hours, (3) sends due messages and retries, (4) runs the daily retention purge. `result_ready` also tries one immediate send after release (best effort).
* A kill switch per school (`messaging_enabled`) and a global one (no webhook URL = nothing leaves).
* The AI is not involved anywhere in this feature; there is no AI cost.

## 8. Tests (all on the local test DB; Make is faked with a local stub)

1. Each event reaches only the right people (class teacher vs subject teacher vs principal), and `teacher_attention` never creates a parent message.
2. Consent: no permission / opted out / invalid number = nothing; roster re-upload cannot undo STOP.
3. Quiet hours (8:59 pm sends, 9:00 pm waits, 8:00 am releases), 2-per-week cap and D2 hold, `weekly_focus` skipped with no new marks.
4. School isolation: a message built for school A never has a recipient, student or link from school B (also the isolation lint for new tables).
5. Payload snapshot per template: only allowed keys; no names beyond first name, no ids other than `message_id`.
6. Webhook down / not configured: `releaseSection` still succeeds, message `not_sent`/`queued`, retries 3x with backoff then `failed`.
7. Callback: bad signature, stale timestamp, unknown id, out-of-order statuses, duplicate callbacks.
8. STOP handling (including a number shared by two schools, D8).
9. Link: expiry, tampering, another child, another school, left student, title/OG without names.
10. Approved-template guard (section 1, rule 4): unknown template refused at the enqueue function and by the database CHECK; every template is `utility`; no stray URLs or promotional words.
11. Retention purge keeps counts and removes variables.
12. Worry test: a "fell twice" student's parent message text contains nothing about it.
13. Playwright: admin messages screen, student permission, parent link page (phone size), expired page.

## 9. Work in stages (each stops for your check)

1. Migration, tables, repositories, templates file, approved-list guard, links + parent page, tests 4, 9, 10.
2. Roster columns, permission screens, STOP, tests 2, 8.
3. Events, dispatcher, caps, quiet hours, webhook + callback with a local stub, tests 1, 3, 5, 6, 7, 11, 12.
4. Screens, screenshots, Playwright.

---

## 10. What YOU must do (I will not do these)

### Make (nothing created by me)

1. New scenario "PrepPlan messaging". Trigger: **Custom webhook**; copy its URL into `MAKE_MESSAGING_WEBHOOK_URL` (Vercel env, later).
2. Pick a long random secret; set it as `MAKE_MESSAGING_SECRET` in PrepPlan and store it in Make (team variable or scenario variable).
3. First module after the webhook: a filter that recomputes `sha256(timestamp + "." + message_id + "." + template + "." + recipient; hex; secret)` and compares it with the `X-PrepPlan-Signature` header, and rejects if the timestamp is older than 5 minutes. Stop the scenario on mismatch.
4. Router by `channels[1]`: **WhatsApp Business Cloud** module "send template message" (template name = `template`, language = `language`, variables in the order of the templates file). On failure, route to **email** (staff) or **SMS** (only if you choose SMS, see below).
5. Final step: **HTTP "Make a request"** to `https://www.prepplan.in/api/messaging/callback` with `message_id`, `status`, `reason`, `timestamp` and a signature computed the same way with the same secret. Add a second tiny scenario (WhatsApp "Watch messages") that posts inbound replies, especially STOP, to the same callback.
6. **Keep Make's own data minimal:** turn on *Data is confidential* for the scenario (no payloads stored in execution logs); do not store incomplete executions; set the shortest execution-log retention your plan allows; do not copy payloads into any Data Store, sheet or email; give the team only the people who need access.

### Meta / WhatsApp

1. Create or open a Meta Business account (business.facebook.com) in the legal name of the business.
2. Complete **business verification** (legal name, address, registration/GST or equivalent documents, website, phone/email on the website).
3. Create a WhatsApp Business Account and add a **dedicated phone number** that is not registered on WhatsApp, and that can receive an OTP. Get the display name approved.
4. Add a payment method (utility messages are charged per message; check Meta's current India rate card).
5. Create a **System User** with a permanent token for the Make connection (not a personal token).
6. In WhatsApp Manager, submit the seven templates above, **category Utility**, languages English and Telugu, one by one, using the numbered-variable form that the templates file will give you. Approval can take minutes to a couple of days; if Meta recategorises one as Marketing, tell me and I will reword it.
7. New numbers start with a daily limit of unique recipients; completing verification raises it. Plan the pilot size accordingly.

### SMS (only if you want an SMS fallback; I recommend **not** for the pilot)

1. Register the business (the Principal Entity) on a telecom operator's **DLT portal** (Jio, Airtel, Vi or BSNL) and get the PE ID.
2. Register a **sender header** (6 characters) and **content templates** with `{#var#}` placeholders for every SMS you want; each gets a template ID.
3. Register and **whitelist the link domain** (www.prepplan.in) because unregistered links are blocked.
4. Pick an SMS gateway that supports DLT, give it the PE ID, header and template IDs, and connect it in Make as the fallback branch.
5. Allow several working days for approval.

---

## 11. Not in this pilot

Email to parents, marketing of any kind, student-facing messages, two-way chat, delivery to anyone without a recorded permission, message editing by teachers, production rollout.

## 12. Production

Not touched. After you approve and I build and test locally, the migration and deploy each wait for your separate go-ahead.

## 13. Risks I see

* Meta reclassifying `weekly_focus` as marketing (6.2).
* Telugu messages carrying English topic names (D5).
* Make's inability to see the raw body, which is why the signature uses a canonical string (section 4).
* Message volume per school day when a whole class is released at once: batched in the dispatcher (50 per run) so Make is not flooded.

## 14. Proposed tab 03 rows (no numbers assigned)

| Proposed title | One-line acceptance |
|---|---|
| Parent contact permission and roster columns | Default no; confirmed by/at stored; STOP honoured; admin sees status |
| Personal signed report links and parent page | 7-day expiry, per child, no name in preview, friendly expired page |
| Message templates (EN/TE) and approved-list guard | Unlisted template is refused in code and in the database |
| Message events: results, weekly focus | Cap 2/week, quiet hours, teacher-first for worrying news |
| Message events: teacher reminders | flags, uploads, dispute closing, attention |
| Principal Monday pulse | 3 weakest boxes, improved, stuck |
| Delivery webhook to Make and signed callback | Minimal payload, 3 retries, never blocks the main action |
| Message log, screens and retention | Per-school retention; admin/teacher/principal views |
