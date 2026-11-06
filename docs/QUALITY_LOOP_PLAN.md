# Question-bank quality loop (F167, F168, F169)

Approved by the owner on 2026-11-04. This is how PrepPlan improves its own questions and AI marking from
evidence. It is not a model that retrains itself: detectors find suspect questions, an AI may recommend,
and a person decides. Nothing is changed or deleted automatically.

## Why it is built this way (the facts on 2026-11-04)

- Only 1,921 of 40,209 approved questions had ever been served; most were answered once, none more than 7
  times; 35 students had submitted a paper. Per-question statistics will stay thin for a long time, so:
  - statistics are shrunk toward the (subject, difficulty) cell average;
  - the fastest win is a proactive AI re-check of the whole bank (F168), not waiting for answers.
- All 6 open student reports were invisible to the owner: `/admin/reports` shows only the admin's own
  household. The quality queue is platform-wide and de-identified instead.
- The AI provider changed from Gemini to Groq with no way to measure what that did to marking. Every AI
  mark now records the model and the marking-prompt version.

## Rules

1. **Only first exposures count.** A student who meets a question again may remember it (allowed by design).
2. **Only objective answers count.** These are scored against the key with no AI involved. Written answers are
   AI-marked, so using them would teach the loop the AI's own mistakes.
3. **School students are never read.** Their answers serve their school only (CLAUDE.md school rules).
4. **A person decides, and nothing is deleted.** A wrong key is fixed by retiring the question and adding a
   corrected copy, so every past paper and mark still points at what the student saw.
5. **Every decision goes to `audit_log`.** Student reports linked to a case close with its decision.
6. **The queue stays small.** It shows the 15 most severe cases first. A dismissed case comes back only on new
   evidence (more reports, more answers, a new kind of signal).
7. **No children's answers in AI prompts as examples.** Any examples used to improve prompts are written by us.

## Phases

| Phase | What | Status |
|---|---|---|
| 0 | Foundations, part 1: record the AI model and prompt version on each AI mark; drop a cached explanation when a question's text or key is edited | Done on `feat/quality-loop` |
| 0 | Foundations, part 2: backups (owner adds 2 GitHub secrets), green CI, real AI prices in the cost meter | Owner / next |
| 1 | **F167 quality queue**: `question_stats`, detectors, `question_quality_cases`, `/admin/quality`, decisions | Done on `feat/quality-loop` (migration 0105) |
| 1b | Re-mark past answers after a key fix and tell the students (append-only correction) | Done on `feat/quality-loop` (migration 0106, `src/lib/quality/remark.ts`). See "Phase 1b" below |
| 2 | **F168 AI key audit**: an independent model re-solves objective questions without the key; a second model checks any disagreement; budget cap; opens F167 cases | Needs the owner's AI key and budget |
| 3 | **F105 AI marking accuracy**: the owner marks about 100 written answers as a golden set; a regression run before any prompt, model or provider change; an agreement percentage on the dashboard | Needs the owner's golden set |
| 4 | **F169 difficulty calibration**: ability-adjusted, proposed through the F167 queue | Waits for more data |
| 5 | Authoring lessons: turn the defects found in review reports and quality cases into rules in `docs/QUESTION_STANDARD.md` and the author agents | Later |

## Detectors (F167)

| Signal | Fires when | Severity |
|---|---|---|
| Student report | Any open report. "Answer key is wrong" is 3; "marked wrong" and "question error" are 2; others are 1 | 1–3 |
| Strong students pick the same wrong option | At least 3 strong students (10+ answers, 75%+ right), and 60%+ of them chose the same non-key option | 3 |
| Wrong option more popular than the key | 8+ answers, and a wrong option beats the key with 40%+ of answers | 2 |
| Harder or easier than tagged | 10+ answers; Easy with a shrunk rate under 35%, or Hardest over 85% | 1 |
| Often left blank | 8+ answers and half or more blank | 1 |

## How to use it

1. Go to Admin → Question quality.
2. Press "Check latest answers" to recompute the statistics and open cases. It is on demand for now; a nightly
   run can be added once `CRON_SECRET` is confirmed in Vercel.
3. Decide each case:
   - **Nothing wrong**
   - **Retire**: the page shows how many similar questions are left
   - **Fix the key**: pick the right option, or type the right answer
   - **Change difficulty**

## Measures

- Wrong keys found per 1,000 served questions.
- Days from a student report to a decision.
- Open queue size: target under 15 a week.
- AI marking agreement with the golden set (phase 3).

## Phase 1b: what a key fix does to past marks

When the owner fixes a key, `decideQualityCase` retires the old question, adds the corrected copy and, in the same
transaction, re-scores every confirmed mark that used the old question (`remarkAfterKeyFix`).

- Only a PrepPlan student's mark in the latest evaluation of an attempt is changed. A school student's marks are
  counted (`schoolMarksSkipped` in the audit entry) and left to her school.
- A mark can go up (she chose the new key) or down (she chose the old, wrong key). Both are recorded.
- Each change is a `mark_corrections` row: old and new mark, old and new error type, the case, the question pair.
  Unique per case and mark, so re-running never counts twice.
- `evaluation_items` marks, the evaluation's score, percentage and grade, the adaptive answer log (and the
  concept performance rebuilt from it) follow the corrected marks. The older concept ledger only grows, so one
  corrective row is appended per concept and evaluation (this adds one to that concept's attempt count).
- The student's result page shows "Answer key corrected: your mark changed from X to Y" and the corrected right
  answer; `seen_at` is set when she opens it.
- Not changed: points already awarded and Fix-it cards already created (taking them back would punish a child for our
  mistake). Parent-facing screens read the same corrected marks but show no notice yet.
