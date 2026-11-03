# M4 (AI correction): nine additions, plan only

Status: **Owner decisions A and B taken 2026-11-02 (section 12). Step 0 done (section 0). The rest is not built yet.** Local/test database only. No change of tech stack. No F-numbers:
section 11 proposes tab 03 rows for the owner to number.

Written for the PrepPlan owner. Source: the nine points pasted on 2026-11-02 from a review of an outside proposal.

## 0. What we know first (measured on Nainika's real sheets, 2026-11-02)

These facts decide the plan, so they come before it.

| Fact | Evidence |
|---|---|
| The marking engine now asks a long paper in parts and survives wide phone photos. | commit `ab8c378` (local) |
| **Real AI replies came back EMPTY on a 25-page, 61-question call** (text 0 characters, 115 s, 67k tokens, Rs 17.99). The earlier belief "the reply was cut off" is not proven. Cause unknown: our provider code discards `stop_reason` and thinking tokens. | trial `out-part1` |
| 2 pages, 20 multiple-choice answers: the AI read them correctly, valid JSON, Rs 7.09 for one pass, 39 s. | trial `out-onepass2` |
| Rs 123.5 spent so far on trials. The only usable result is the 2-page one. | |
| Pricing is dominated by the **page pictures** (about 60k input tokens for 25 pages), which today are re-sent in **every** call (3 passes x 3 parts = 9 times). | token counts above |

**Step 0 (before anything below): make the provider record `stop_reason`, thinking tokens and an empty-text error, then one small
paid test (5 to 8 pages, one part, about Rs 8 to 10).** No cost figure in this plan is trustworthy until that is done.

## 1. Model tiers

Today: SCH-05/06 (name, page kind) already use the **cheap** model; SCH-07 (marking) uses `strong` = Sonnet 5 for all three
passes. `mid` is not provisioned (it resolves to Sonnet 5).

Plan:
- Pre-checks stay cheap (Haiku tier). Add the missing ones to the same family: *page belongs to which student* (already
  SCH-05 plus roll match), *blank/unreadable* (already local pixels, no AI), *name match* (compared in our code).
- Marking: pass 1 and pass 2 on the main model (Sonnet 5).
- **Third pass only when pass 1 and 2 disagree** (or any is below the confidence line). New tier `top` in `ai-models.ts`
  (Opus 5.5) used for that re-check only; if the top pass resolves it, the answer is not flagged; if not, it is flagged for
  the teacher as today.
- **Owner decision A:** today the rule is "three passes, median". Two passes plus a tie-break is about one third cheaper but
  is a change of an approved rule. Recommended: yes, keep three passes for the pilot, switch to 2 + tie-break only if the pilot
  (section 9) shows the same agreement.
- Cost per student, with and without (estimate, to be replaced by the trial harness figure; it already prints
  cost per student): a 25-page, 80-mark paper.

| Setup | Estimate per student |
|---|---|
| Today (3 passes x 3 parts, pictures re-sent each time, no caching) | Rs 150 to 200 |
| + tiers only | Rs 130 to 180 (main model still does most of the work) |
| + image caching (section 2) | Rs 40 to 60 |
| + caching + 2 passes + tie-break | Rs 30 to 45 |
| + caching + batch (section 3) | Rs 20 to 30 |

The demo school's allowance is Rs 50 a month: it can mark **less than one** full paper at today's cost. This matters for the
pilot (see section 10).

- Tests: tier resolution (`ai-models.test`), "third pass is called only on disagreement" (stub counts calls), cost rows
  written to `ai_jobs` with the tier.

## 2. Prompt caching

The outside proposal says: cache the paper, key and scheme once per exam. That text is small (about 5k tokens). **The big
repeated cost is the student's own page pictures** (about 60k tokens) sent in all 9 calls. So:
- Put the pictures first (already true) and mark the end of the pictures with a cache breakpoint, so calls 2 to 9 for the same
  student read them at the cached price (about a tenth of the input price). The 5-minute cache life fits because one student's
  calls run back to back.
- Also cache the paper/key/scheme block per exam (second breakpoint) for the batch of students marked together.
- Needs `cache_control` support in `completeAnthropic` (SDK already supports it); Gemini path unchanged.
- Hard check: record cache read/creation tokens in `ai_jobs` so the saving is measured, not assumed.
- Tests: request builder puts the breakpoint after the images; usage fields stored; a stub provider proves the pictures
  are identical across calls (cache can only hit on an identical prefix).

## 3. Batch mode ("results by next morning")

- Anthropic Message Batches API: half price, normally done within an hour, at most 24 hours. Instant mode stays for a small
  test (rule: up to 10 students, or chosen by the teacher).
- UI: on "Mark all", two buttons: **Mark now** and **Results by tomorrow morning (cheaper)**, with an estimated ready time
  (rule of thumb shown honestly: "usually within a few hours, never later than tomorrow morning").
- New table `school_marking_batches` (batch id at the provider, school_id, paper_id, state, submitted/finished at); results
  fetched by the school-messages-style dispatcher job.
- **Dependency (open, from earlier work):** `CRON_SECRET` is not set in production and the 30-minute cron is not in
  `vercel.json` (needs the Vercel Pro plan). Batch mode needs a poller; until then a "Check now" button works.
- Cache and batch can combine but cache hits inside a batch are best effort; the estimate in section 1 assumes half the benefit.
- Tests: submit builds one request per student-part with a custom id; results map back by id; a failed or expired item
  becomes "failed", never a mark; re-submission is idempotent.

## 4. Points-based rubric for descriptive answers (SST, English, Telugu)

Today the key is `key_text` plus `key_steps` (`{description, marks}`), which fits Maths/Science working steps.
- Add `rubric` as a second key kind on `school_own_questions`: `key_kind` ('steps' | 'rubric') and `key_criteria` JSON:
  `[{ "kind": "concept" | "key_points" | "explanation" | "conclusion" | "diagram" | "language", "marks": 2, "descriptor": "...", "levels": [{ "marks": 2, "says": "..." }, { "marks": 1, "says": "..." }] }]`. The sum of criteria marks must equal the
  question marks (checked in code, like steps today).
- The AI drafts the rubric (SCH-03 extended); the teacher approves it **together with the answer key** (same
  `key_status` approval, same screen). A question with a draft rubric cannot be marked (existing rule).
- The marking prompt gets the rubric; the AI returns per criterion `{criterion, awarded, reason}`; our code sums them and
  clamps (section 7). Half marks stay allowed.
- **Telugu and English language answers:** subject language comes from `subjects.language`; the prompt states the language;
  the transcription is kept in the script written. Spelling/grammar marks only if the rubric has a `language` criterion.
- Storage: `school_answer_marks.steps` already holds per-step awards; reuse it for per-criterion awards (no new column).
- Tests: rubric sum must equal marks; unapproved rubric blocks marking; criterion awards above their max are clamped;
  a Telugu fixture round-trips through parse, store and screen.

## 5. Teacher review screen (side by side)

Today (`marking-panel.tsx`): the AI's transcription line, the reason and the loss kind. **Missing:** the original image and the
model answer next to it.
- The AI returns, per answer, `page` (1-based) and an approximate box `[x0, y0, x1, y1]` (0 to 1) of where it found it.
  A box that is missing or nonsense falls back to the whole page; never invented.
- New route `GET /api/schools/:schoolId/marking/:paperId/students/:studentId/pages/:seq` returning the **decrypted page image**
  (teacher/admin/principal of that school and subject only; **never the student role**; audited). Images stay in the encrypted
  scan store; no public URL.
- Screen, one answer at a time: left = cropped original; right column = AI transcription, model answer (key), per step or
  criterion: marks awarded, max, one-line reason; bottom = the final mark and the teacher's accept/change buttons.
  On a phone the columns stack.
- Keyboard/one-tap: Accept AI mark, Set full, Set zero, Next flagged.
- Tests: route refuses a student, another school's teacher, a teacher not assigned to the section-subject; crop box
  clamped inside the page; screenshot at desktop and phone sizes.

## 6. Exam-week board (office and principal)

One screen per exam (and a cross-exam summary), a grid of **sections** with counts: *uploaded, AI-marked, waiting for
teacher, failed, released*. All values come from existing tables (`school_own_sheets`, `school_sheet_marking`,
`school_answer_marks`, release state); "failed" = marking row `rejected` or a page refused by the upload checks.
- Click a count to see the students behind it; failed shows the plain reason and a Retry.
- Read-only for the principal; the office admin can retry. Teachers keep their own narrower list.
- Tests: counts add up to the roster per section; a teacher cannot read another section's row; school scoping lint passes.

## 7. Hard rules, each with a test

| Rule | Today | Plan |
|---|---|---|
| **Totals are computed by our code, never by the AI** | `totalsOf` sums our own final marks; the AI's JSON has no total field | Add an explicit test that a reply containing `total`/`marks_total` is ignored, and that the stored total equals the recomputed sum |
| **AI marks can never exceed the question maximum** | `clamp()` per pass, per step | Test: marks 99, negative, NaN, a string, step awards above their max, steps whose sum exceeds the question |
| **Unreadable handwriting is flagged, never guessed** | low confidence flags; not-found is "no answer" | Add: `found: true` with empty/"?" transcription, or the AI writing a guess for an `[illegible]` span, flags the answer; prompt tells the AI to write `[illegible]` rather than guess; test with stub replies |
| An empty or unparsable reply never produces a mark | flagged "0 of 3 readings used" | Keep; add the recorded `stop_reason` to the flag text |
| The student role never sees the model answer before release | enforced | Re-run the existing key-leak tests against the new image route and review screen |

## 8. Privacy: mask the name and roll area before a page goes to the AI

Today `pageForMarking` whites out the top 12% of the **first page** only. Gaps: a sheet with the name box elsewhere, or a name on
every supplementary sheet.
- Per-school **mask template** set in the wizard on a sample sheet: the teacher drags a box; default is the first-page top strip
  as now. Option "also mask the top strip of every page".
- Masking happens on our server before the AI call; the original stays in the encrypted store.
- A pixel-level test: the masked region of the outgoing image is white; the AI-bound image never equals the original.
- **Conflict to decide (owner decision B):** the *upload check* SCH-05 deliberately sends that same strip to the cheap model to
  read the name and roll number and match them to the class list (the match is made in our code). Masking before every AI call
  means that check must go. Options: (1) keep SCH-05 as a separate, disclosed, cheap, name-reading step (recommended; it is the
  only place a name is read and it is what stops a sheet being marked for the wrong child); (2) drop it and rely on the
  teacher's yes plus a printed barcode/roll sticker read locally. Recommended: (1), with the school terms saying so.

## 9. Pilot accuracy test (100 double-marked papers)

- **Sample:** 100 papers, spread across at least Maths, Science, Social Science, English and Telugu, with at least 20 in each of
  the descriptive subjects and at least 20 handwritten in Telugu. Mixed handwriting quality, including some poor.
- **Double marking:** two teachers mark each paper **independently** (blind to the AI and to each other) on a simple sheet or
  our teacher screen set to "blind"; a third settles differences for the reference mark.
- **Metrics per subject and per question type** (script extends `marking-trial.manual.test.ts`, which already prints the AI's
  reading, three marks, flags, cost): exact agreement, within half a mark, mean absolute error of the total, weighted kappa
  between AI and the reference, and the teacher-vs-teacher agreement as the ceiling; **flag precision** (flagged answers the
  teacher changed) and **flag recall** (answers the teacher changed that were flagged); cost and time per paper.
- **Proposed pass line (owner to set):** AI total within 2 marks of the reference on at least 90% of papers; flag recall at
  least 90%; no paper with an unflagged answer wrong by more than 2 marks.
- **Handling:** real sheets stay in the git-ignored `local-private/`; never committed; the school consents in writing for the
  pilot; names removed before any file leaves the school's folder. The report goes to the owner per subject.

## 10. Order, cost and risk

1. Step 0: record `stop_reason`; one small paid test (Rs 8 to 10). Decide whether empty replies were thinking, a refusal or a limit.
2. Image caching (section 2) and hard-rule tests (section 7): cheapest, biggest saving, no screens.
3. Tiers and tie-break (section 1), masking template (section 8).
4. Rubric (section 4) then review screen (section 5), board (section 6).
5. Batch (section 3) last: it depends on the cron/Pro-plan decision.
6. Pilot accuracy test (section 9) after 1 to 5; budget for real AI spend about Rs 3,000 to 5,000 at today's per-paper cost,
   about Rs 1,000 to 1,500 after caching and tiers. **Raise the pilot school's allowance deliberately** (the demo cap of Rs 50
   cannot mark one paper).

Risks: the empty-reply cause may change the design of section 1 and 2; Opus pricing for the tie-break pass is unmeasured;
batch results arrive unattended, so "failed" must never look like "marked".

## 11. Proposed tab 03 rows (no numbers; owner assigns F-numbers)

| Working title | User story (one line) | Acceptance (short) |
|---|---|---|
| M4-a Tiered marking with tie-break | As the office, I want AI cost to stay low without losing accuracy | Tie-break pass only on disagreement; cost per student reported with and without |
| M4-b Page-picture caching | As the owner, I want repeated page pictures not re-billed | Cache read tokens recorded; saving measured on the trial |
| M4-c Overnight batch marking | As a teacher, I want cheaper next-morning marking for big uploads | Batch submit/fetch, ready-time estimate, failures never become marks |
| M4-d Rubric answer keys | As a teacher of SST/English/Telugu, I want criteria-based marking | Rubric drafted, teacher-approved with the key, criteria sum = marks |
| M4-e Side-by-side review | As a teacher, I want to see the answer image next to the AI's reading | Crop, transcription, model answer, per-criterion marks, final mark |
| M4-f Exam-week board | As the principal, I want to see where every section is | Five counts per section, drill-down, retry on failed |
| M4-g Marking hard-rule tests | As the owner, I want the AI unable to break the marks | Tests for totals, maximum, illegible, empty reply |
| M4-h Name-area masking template | As a school, I want the name area never sent to the AI | Per-school mask box, pixel test, disclosed name check |
| M4-i Pilot accuracy study | As the owner, I want evidence before selling | 100 double-marked papers, per-subject agreement report |

## 12. Owner decisions and progress (2026-11-02)

- **Decision A = 2 passes plus a tie-break pass** (not three passes). Passes 1 and 2 on the main model; a third pass on the
  stronger `top` model only where they disagree or either is below the confidence line. `PASSES` and the "readings used"
  rules in `marking-logic.ts` change accordingly (build step 3).
- **Decision B = option 1:** keep the name-reading upload check (SCH-05) as a separate, disclosed, cheap-model step; every
  other AI call gets the masked pages. The school terms will say so (build step 3).
- **Step 0 result (done, paid test Rs 11.40 then Rs 6.28):** the empty replies were **thinking, not a cut-off**:
  `stop_reason max_tokens, 10250 tokens written, 10249 spent thinking`. Marking now sends `thinking: disabled`
  (`noThinking` on `CompletionInput`); an empty reply is now a visible error with its stop reason, never a quiet blank.
  Re-test on 6 pages, part 1 of 3: valid JSON, 37 answers, 27 found, Rs 6.28, 31 s.
- Trial spend to date: about Rs 141. Estimates in section 1 stand until a full 25-page, three-part run is measured.

### Built so far (local commits, tests green: 438 passed in `src/lib/schools`)
- Thinking off for marking; empty reply = visible error with stop reason (`63dc67f`).
- Page-picture caching (`cache_control` on the last picture), cache read/write priced and stored in `ai_jobs`; hard-rule tests;
  unreadable writing flagged (`6be7c08`).
- **Two readings + stronger tie-break** (decision A): `PASSES = 2`; `needsTieBreak`, `combinePasses` takes 2 readings and an
  optional third; the third is asked only about the answers the two did not settle, on a new `top` tier (feature `SCH-07T`,
  Claude Opus 5.5 by default, `ANTHROPIC_MODEL_TOP` to change). **Opus's price is not known to the app:** set
  `ANTHROPIC_TOP_USD_PER_1M_INPUT` and `ANTHROPIC_TOP_USD_PER_1M_OUTPUT`, otherwise its calls are priced like Sonnet's and cost
  figures will be too low.
- Still to build: batch, pilot study.
- Still to measure: a full 25-page, three-part run with caching and tie-break (needs the owner's go-ahead; expected Rs 20 to 40).

### Masking template and disclosure (2026-11-02, decision B built)
- `schools.mask_template` (jsonb, NULL = default; migration `0099_school_mask_template`, **local scratch DB only; the owner runs it on
  production**). Shape: `{ boxes: [{x,y,w,h}] (fractions of the upright first page, at most 6), everyPageStrip }`. Default = the top
  12 % of the first page, as before. `src/lib/schools/mask-template.ts` validates it; a damaged stored value falls back to the
  default, never to "mask nothing".
- `pageForMarking(bytes, firstPage, mask)` paints the boxes (and the top strip of every page when asked) white on our server before
  any marking picture leaves it. Both callers (`loadMarkingPages`, `markStudentSheets`) read the school's template.
- Office and principal set it at School > Settings > "Name area on answer sheets" (percent boxes with a small preview; a drag-on-a-
  sample-sheet picker is not built). Every change is written to the audit log (`school.mask_template`).
- Tests: pixel tests (box white in the outgoing picture, rest untouched, later pages unmasked unless asked), validation, teacher
  forbidden, audit, default restore.
- Disclosure bullet added to the school-terms page (name area masked; the one exception is the upload check SCH-05). **The terms
  version was NOT bumped** (`2026-10-v1`): bumping makes every school accept again. The full terms document is the owner's.

### Rubric answer keys (2026-11-02, core built)
- `school_own_questions.key_kind` ('steps' | 'rubric', default 'steps') and `key_criteria` (jsonb); migration `0100_own_question_rubric`
  (**local scratch DB only; the owner runs it on production**).
- `src/lib/schools/rubric.ts`: `parseCriteria` (1 to 8 criteria, kinds concept/key_points/explanation/conclusion/diagram/language,
  half-mark steps, levels within the criterion's marks, **sum must equal the question's marks**), `criteriaAsSteps` (a rubric is read
  by the marker as one step per criterion, levels in the text, so the existing award, clamp, half-mark and total code is reused and
  `school_answer_marks.steps` stores per-criterion awards), and the rule sent with a rubric question (no spelling/grammar marks unless
  a `language` criterion exists).
- Teacher saves a rubric through `set_key` (`criteria`); it goes through the same draft/approved status as steps, so an unapproved
  rubric blocks marking exactly as before. Saving steps again switches the question back to a steps key.
- Tests: sum rule, bad kinds/levels/NaN, Telugu round trip, refusal, draft blocks marking, prompt carries the criteria and the rule,
  awards clamped (`rubric.test.ts`, `school-marking.integration.test.ts`).
- **Rubric editor** on the key screen (`rubric-editor.tsx`): tick "Mark by criteria", add criteria (kind, marks, what earns it, levels),
  a live "add up to N of M marks" line; saving keeps the rubric (a steps save sends `criteria: []`, a rubric save sends the criteria).
- **AI rubric draft** (SCH-03 extended): for descriptive subjects (Social Science, English, the languages) the draft prompt tags written
  questions of 3 or more marks `RUBRIC` and asks for `criteria`; `keptDraft` keeps it only if it adds up to the question's marks,
  otherwise the drafted steps (if they add up) or none. Maths and Science never get a rubric. Always a draft: a teacher approves it.
  **No real AI call has been made for this prompt yet** (tests use stand-ins); try it on one real descriptive paper before relying on it.

### Side-by-side review screen (2026-11-02, built)
- The marking prompt now also asks, for each answer found, `page` (1-based, among the pictures sent) and `box` [left, top, right,
  bottom] as fractions 0 to 1. `cleanLocation` keeps a page that exists and a box inside the page with some size; a nonsense box falls
  back to the whole page; no page means no place (never invented). A bad `page`/`box` in a reply never costs the answer its mark.
  Stored in `school_answer_marks.location` (migration `0101_answer_location`, **local scratch DB only; the owner runs it on
  production**).
- `GET .../own-papers/:paperId/marking?student_id=&review=1` (teacher and office) returns the usual answers plus, per answer, the
  steps or criteria with marks awarded, the model scheme and the location. Kept off the student's results view on purpose: nothing
  new reaches the student role.
- `GET .../own-papers/:paperId/marking-page?student_id=&page=N` returns the decrypted page picture (the same pictures the AI saw,
  numbered the same way), teacher/office of that class only (a teacher outside the class and the student role are refused), every
  look written to the audit log (`school.marking_page_viewed`). Query parameters instead of the plan's path segments; same effect.
  The screen fetches it into memory (a plain image request gets a 404 from the dev server, as for the other page pictures).
- Screen (`review-screen.tsx`, opened from a marked student): left the page cropped to the box (whole page if no box, a note if no
  place), page buttons; right the question, what the AI read, the approved answer, marks per step/criterion, "Accept", "Full marks",
  "No marks" (each logged through the existing `set_mark`, with a reason), Next to check, Previous/Next. Stacks on a phone.
- Tests: crop/clamp/fallback rules, stored location, page route refused for outsider and student role, audit; browser test on a
  phone-size screen opens the review and checks the picture loads. Repaired along the way: the browser tests' stand-in marking AI
  still assumed two calls per student and had been failing since the cheap-model routing; it now tells students apart by call kind.
- Not built: keyboard shortcuts, a zoom on the crop, and a test that a teacher not assigned to the section-subject (but in the same
  school) is refused is the existing `studentOfPaper` rule, covered by the "does not teach this class" test.

### Exam-week board (2026-11-03, built)
- `src/lib/schools/exam-board.ts` counts, per approved paper and section, from existing tables only (nothing new stored, **no
  migration**): students (active), sheets uploaded (a page that passed the checks), AI-marked (marking `marked`), waiting for a
  teacher (`needs_teacher` or still `checking`), failed (marking `rejected`, or every page refused by the upload checks) and whether
  the section is released. Totals across all papers on top. `boardStudents` lists the students behind one count; a failed one carries
  its plain reason.
- `GET /api/schools/:schoolId/exam-board` (principal and office; teachers and the student role are refused, other schools see
  nothing). Screen `/school/:id/board`: a card per paper, a row per section, tap a count to see who. The office has "Try again" on
  a failed student (it re-runs the same marking call as the correction screen); the principal's view is read-only. Reached from
  the "Board" tab on wide screens, Settings for the office on a phone and a card on the principal's Home.
- Tests: counts add up to the roster, reasons for failed, released section, principal sees / teacher and student refused, other
  school empty (`exam-board.integration.test.ts`); browser test opens the board and a count.
- Not built: a per-exam grouping (it lists papers; a paper linked to an exam is not yet grouped by it), a "released" count per
  section beyond the badge, auto-refresh.

### Real-AI measurement after the additions (2026-11-03, Nainika, 25 pages, reconstructed paper)
- Rs 57.90 (Sonnet-rate prices for every model, since Opus/Haiku prices are not set), 207 s, 61 answers, 3 flagged; harness
  accuracy 91% exact, 96% within half a mark. By call: Sonnet 5 calls Rs 32.54 (278k tokens in), Haiku MCQ reading 1 call Rs 10.76
  (41k in), Opus tie-break 1 call Rs 14.60 (56k in).
- **Haiku for the multiple-choice reading does not save money; it adds cost.** Every call sends all page pictures, and the picture
  cache is per model, so the Haiku call is one more full set of pictures on top of Sonnet's reading 1 (which still sends every page
  for the written answers). Recommendation: put the MCQ questions back into Sonnet's reading 1 (one call), owner to decide.
- Answer places: 53 of 61 answers came back with a page and box; a visual check of 7 crops found 6 on the right answer (boxes are
  generous, full width) and 1 a line off (Q19 showed the printed "20.", possibly the reconstructed numbering).
- Rubric draft prompt (SCH-03), 3 Social Science written questions and 1 MCQ, Rs 1.19 per call: all three got a valid rubric whose
  criteria add up (3, 5, 3 marks, half marks used, levels sensible); the MCQ stayed a plain key.

### Full-paper measurement (2026-11-02, Nainika, 25 pages, 61 answers, reconstructed paper)
Two readings in three parts, page pictures cached, Opus tie-break only where needed:

| | Result |
|---|---|
| Cost | **Rs 36.70** per student (it was estimated Rs 150 to 200 before caching); the Opus part is priced like Sonnet until its price is set, so the true figure is somewhat higher |
| Time | 207 s |
| AI total vs GenEval | 66 / 80 vs 67.5 / 80 (the harness total of 70.5 counts optional alternatives too) |
| Per answer | 89% exactly the same mark, 94% within half a mark (54 answers with a GenEval mark); 6 differ |
| Flagged | 1 of 61 |
| Where it differed | Q38 and Q40 (AI found no answer; GenEval gave 1 each), Q42 (AI 5, GenEval 3), Q37 (AI 1, GenEval 0.5), Q45, Q46 |

Caveat: the questions of this paper are a reconstruction, so a per-answer comparison is an indication, not an accuracy figure.
An earlier run of the same size failed because Opus refuses `thinking: disabled`; that left all 61 answers unmarked and a
failed tie-break discarded the two good readings. Fixed: Opus runs with adaptive thinking at low effort, and a failed
tie-break now leaves the unsettled answers flagged instead of throwing the marking away.
Trial spend to date: about Rs 179.

### Cheap model for multiple choice (built 2026-11-02)
Comparison on the same 6 pages (part 1, 37 answers): Haiku read all **20 of 20 multiple-choice letters the same as Sonnet**,
but skipped 9 written answers (Q29 to Q37) and disagreed on whether 11 of 17 written answers were found. So Haiku is used for
the ticked letters only. Reading 1: Haiku (feature `SCH-07M`) reads the multiple-choice answers, Sonnet reads the written
ones; reading 2: Sonnet reads everything; Opus reads what the two do not settle. Every multiple-choice answer is therefore
read by two different models. One student, one set: re-check on more sheets in the pilot. **Haiku's price is not known to the
app:** set `ANTHROPIC_CHEAP_USD_PER_1M_INPUT` and `ANTHROPIC_CHEAP_USD_PER_1M_OUTPUT`. The saving of this change has not been
measured on a full paper yet (a run costs about Rs 35).
