# Civil Services Polity bank - status (2026-10-12, updated end of day)

F132 (UPSC Civil Services Prelims, Indian Polity). Plan: `CIVIL_SERVICES_POLITY_PLAN.md`, trends:
`CIVIL_SERVICES_POLITY_TRENDS.md`.

## Production (Supabase `examprep-ai-dev`) - state on 2026-10-12
- **Loaded (owner OK 2026-10-10):** the 31 Laxmikanth packs, 4,160 questions, verified per chapter (0 mismatches), all
  `approved`. Upgrade packs attach to the old chapters L1-L7 and new chapters L8-L83 were created.
- **Old bank retired (owner OK):** 1,840 old one-line questions set to `retired` (status only, nothing deleted): the
  1,720 of L1-L7 and the 120 of I5 (Elections), each replaced by 20 new questions per concept.
- **Still live (660 old questions):** NCERT-style chapters I1-I4 and II1 have no replacement pack, so retiring them would
  leave their concepts empty. Owner decision pending (keep, or retire/replace).
- **Not loaded yet:** the AKS pack set below.
- No concept in POLITY is left without an approved question.

## Pack set 1: Laxmikanth (loaded)
31 packs in `content/authoring/civil/polity/packs/`: lk01-lk07 upgrades (1,720), 17 new chapters (2,320),
ncert_polity5 (120). `ncert_own_fr` stays deferred in `packs-deferred/`.

## Pack set 2: AKS study notes (built, NOT loaded)
Owner uploaded polity study notes (M S Shashank, 254 pages, 21 chapters; local only and gitignored under
`content/reference/civil-services/shashank/`) and asked for questions that leave no concept, sub-concept or fact
untested, minute facts included, at UPSC standard.
- **Pipeline:** (1) inventory: 29 unit files `content/authoring/civil/polity/aks/inventory/*.json`, 4,357 atomic facts
  (397 flagged `verify` where the notes disagree with Laxmikanth or real law); (2) plan `aks/plan.json`: 25 packs, 106
  concepts (about 40 facts each); (3) authoring (agent Mode A, `aks/AUTHOR_BRIEF.md`); (4) independent review, fix, final
  verification of every pack; (5) mechanical sweep that removed every reference to the notes from student-visible text
  and gave empty "Statement n is correct" explanations real text.
- **Result:** `aks/packs/aks01..aks21b.json`, 25 packs, 106 concepts, **2,120 questions** (530 direct, 954 which-statements,
  318 how-many, 212 Statement-I/II, 106 match). Chapter block `part 'A'`, chapters A1-A21, concept codes `AKS-NN.m`,
  source "Polity study notes (AKS v2)". Every pack: validator 0 problems, final verification HIGH 0, `fi` coverage ledger
  0 uncovered (`scripts/civil-services/aks-coverage.py`).
- **Facts skipped on purpose** (about 250 of 4,357, each with a reason in the pack's `skipped`): notes errors or claims that
  conflict with Laxmikanth or settled law (e.g. 448 Articles, Union List 100, Canada 47 Articles, Navy Act year, Minerva Mills
  attributions, Golak Nath "soul", contested 2025 Governor-assent rulings), time-bound counts and untestable remarks.
  `verify` facts with a safe form are tested in the corrected form.
- **Local test DB:** all 25 packs loaded on 2026-10-12 (21 chapters, 106 concepts, 2,120 questions, exactly 4 options and
  1 correct each, explanations present).
- **Known residuals (accepted):** repetition above 2 per idea in thin chapters; some Statement-I/II "explains" calls are
  judgement calls; a few items lean on real law not in Laxmikanth and say so in their explanation.

## Loader and runbook
- `scripts/load-civil-pack.ts`: additive and idempotent (text hash), shuffles options at load (packs store the correct
  option FIRST), explanations to `question_explanations` (source `authored`), never deletes; `--retire-old [--apply]`.
  Accepts concept codes `LK-`, `CVP-`, `POL-`, `AKS-`.
- `scripts/load-civil-polity.sh trial|all|retire-dry|retire` covers `packs/` (the Laxmikanth set). For the AKS set call
  the loader per pack: `npx tsx scripts/load-civil-pack.ts content/authoring/civil/polity/aks/packs/<pack>.json`
  with `DATABASE_URL` set; retry a pack if the Supabase pooler drops the connection (re-runs skip what is loaded).
- Production connection from a laptop is slow (one round trip per question) and the pooler drops long runs: load pack by
  pack with retries, then verify counts per chapter against the pack totals.

## Tooling added (scripts/civil-services/)
`aks-inventory-check.py`, `aks-plan.py`, `aks-coverage.py`, `dup-check.py`, `strip-notes-refs.py`; the validator
`check-civil-pack.py` now also requires List-I rows in match items (two packs once lost them when List-II was re-ordered
by hand).

## Process lessons
- First review of a pack finds a HIGH about half of the time (second defensible answer from a "false by silence"
  statement, `if` read as `only if`, notes-only claims). Always re-verify the changed ids after a fix.
- The study notes are a secondary source with many errors: a fact is valid only if also true in Laxmikanth/real law.
- Agents sharing one scratchpad overwrite each other's files: give each agent its own folder.
- API rate limits and network drops killed running agents several times: reports are written early and every fixer keeps
  a progress file so work resumes without loss.
- `reshape-options.py` rebuilds options and wrong-reasons; never run it after hand-built options. `permute-match.py`
  only renumbers List-II.

## Owner decisions outstanding
1. Load the AKS set (2,120 questions) to production: needs explicit OK.
2. The 660 old NCERT-style questions (I1-I4, II1): keep, retire, or write replacements.
3. Time-sensitive figures to recheck before launch (pay, party thresholds, OCI fees, Immigration and Foreigners Act 2025,
   Part IX-B status, NITI/Finance Commission details).
4. Rotate the Supabase database password (it was typed in a chat) and update Vercel's `DATABASE_URL`.
5. History, Geography and Economy get their own agents later.

## Update 2026-10-12 (end of day): production complete
- **AKS set loaded to production** (owner OK): 25 packs, 2,120 questions, chapters A1-A21, verified per chapter (0 mismatches).
- **Old NCERT-style chapters upgraded** (owner OK): `ncert_polity1..4.json` and `ncert_own_fr.json` (660 questions, same
  chapters I1-I4/II1 and concept codes CVP-1.x..4.x, POL-1.x) written, independently reviewed, fixed and finally verified
  (0 HIGH), loaded to production, and the 660 old questions retired (status only). Production now holds exactly 20
  approved questions for every CVP/POL concept (checked 0 exceptions).
- Old-question errors that are now retired: Article 18 titles, Article 21A '2009', all-India services 'IFS', governors as elected.
- `/tmp/prod.env` deleted. **Owner still to do: rotate the Supabase DB password and update Vercel DATABASE_URL.**
- Small leftovers (accepted): see `_reviews/final2-*.md` MEDIUM/LOW lists (polity3 3-09, 7-10 near past-year items,
  5-14 page cite p.852; polity2 3-16 cite p.91; own_fr 27 thin explanations).
