---
name: civil-polity-author
description: Author ONE topic pack of UPSC Prelims-style Indian Polity questions into content/authoring/civil/polity/packs/<chapter>.json, grounded in a Laxmikanth chapter and the PYQ trend data. Use when the owner asks to write, extend or fix polity practice questions for a Laxmikanth chapter. Never loads a database, never commits.
tools: Read, Write, Edit, Bash, Glob, Grep
model: sonnet
---

# Author one polity topic pack

## Read first
`CLAUDE.md` (hard rules), `docs/CIVIL_SERVICES_POLITY_PLAN.md`, `docs/CIVIL_SERVICES_POLITY_TRENDS.md`,
the chapter text `content/reference/civil-services/laxmikanth/chapters/chNN.txt` (use the map in
`chapter-map.json`), and the tagged PYQs of that chapter in `content/authoring/civil/polity/polity-tagged.json`
(filter `laxmikanth.chapter == NN`) so you write in the voice UPSC actually used.

## Source discipline (non-negotiable)
Every fact in a stem, option or explanation must be on a Laxmikanth page you read, cited as `pdf_page`.
**Student-visible text never names the book (owner rule 2026-10-16, copyright):** `q`, `o`, `e`, `w`, `tr` must not
contain "Laxmikanth", "the book/text/notes", page numbers (p.58), or the book's table/chapter numbers. Page
citations live ONLY in the `pg` field (internal). Explanations rest on the Article / Schedule / Act / amendment /
case. The word "according to <author>" is never used: if a claim is only the author's classification or opinion,
either word it as an established fact/classification a UPSC paper could carry, or drop it.
No constitutional fact, article number, amendment or judgement from memory. If the chapter does not
support a question idea, drop it. Do not copy a PYQ; build a new item on the same idea.

## Mode U - upgrade an existing concept (owner request 2026-10-09)
The app already holds 2,500 old polity MCQs in `content/authoring/civils/*.json` (95% one-line direct items,
Remember/Easy-labelled, graded by Bloom x difficulty). For ONE file: read it, VERIFY every old question
against the Laxmikanth page and list wrong/doubtful ones (key wrong, outdated, unsupported) in
`content/authoring/civil/polity/_reviews/verify-<file>.md`, then write a NEW pack
`content/authoring/civil/polity/packs/<file>.json` (kind `civil_pack`; same subject/chapter/source_code and
the SAME concept codes as the old file so it can be attached to the existing concepts) with 20 trend-style
questions per concept. Reuse an old idea only after rewriting it into the modern form. Never edit the old file.
Old files that are NCERT civics (polity1-5, own_fr) or ch1-7 only: still do the file you are given.
Validate with `python3 scripts/civil-services/check-civil-pack.py <pack>`; fix until 0 problems.
Per question fields: `f` (direct|which|howmany|stmt12|match|case), `t` (mcq|multi_statement|assertion_reason|match),
`m` 1, `q`, `a` (the text of the correct option, never a letter), `o` (4 options, correct FIRST; they are shuffled at load),
`e` explanation, `w` (3 one-line reasons, one per wrong option in `o` order), `tr` traps, `sk` skill, `pg` pdf pages.
Per concept 20 questions: 5 direct, 9 which-statements, 3 how-many, 2 Statement-I/II, 1 match or other; recall at most 8.

## Mode N - a NEW Laxmikanth chapter (owner request 2026-10-09)
For a chapter with no old file: read `chapter-map.json` and `chapters/chNN.txt`, define the concepts yourself
(about one per 5-7 book pages; minimum 5, maximum 12; each must trace to cited pages), then write
`content/authoring/civil/polity/packs/lkNN.json` (NN zero-padded chapter number). Same `civil_pack` format as
Mode U PLUS the metadata the loader needs to create the rows:
`{kind:'civil_pack', subject:{code:'POLITY',name:'Polity',board:'CIVILS',class:0}, source:{publisher:'Laxmikanth',
title:'Indian Polity (question set written from its topics)',edition:'8e',year:2026},
chapter:{part:'L',chapter_no:NN,name:'<book title>',blurb:'<one sentence>',source_code:'lkNN',order_index:100+NN},
scope_in:[{item,pages}], scope_out:[{item,reason}],
concepts:[{code:'LK-NN.m',name,description,idea,rule,example,difficulty_base:'Hard',questions:[...]}]}`
(`rule` = the facts of the concept in 3-6 sentences from the book; `idea` = one sentence). Concept codes are
`LK-<chapter>.<n>` (n from 1). `pg` entries are PDF page numbers as marked in chNN.txt. Also write
`_reviews/verify-lkNN.md` with the scope decisions (what is IN/OUT and why). Use the tagged PYQs of the chapter
(`polity-tagged.json`, `laxmikanth.chapter == NN`) to weight the concepts toward what UPSC actually asks, and
to write in its voice (do not copy them). The first review of every new pack will be hard: apply the Falsifier
rule and the lessons below from the start, and keep a statement's truth flag next to it while building so keys
and explanations cannot drift. DO NOT depend on builder scripts to apply edits: after the final write READ THE
SAVED FILE BACK and re-answer a sample of 20 items cold.

## Mode C - convert an old NCERT-style polity file (owner request 2026-10-09)
Files `content/authoring/civils/polity1..polity5.json` and `own_fr.json` were written from school Social Science
books (concept codes `CVP-n.m` / `POL-n.m`), not UPSC level. For ONE such file: read it, decide for EACH concept
whether Laxmikanth (chapter texts under `content/reference/civil-services/laxmikanth/chapters/`, any chapter) teaches
it deeply enough for UPSC. Write `content/authoring/civil/polity/packs/ncert_<file>.json` in `civil_pack` format with
the SAME `subject`, the SAME `chapter` block as the old file (so the loader attaches to the existing rows) and the SAME
concept codes, but ONLY for supported concepts: 20 UPSC-style questions each, every fact cited to a Laxmikanth
`pg` (PDF page from whichever chapter file it is on; also name the chapter in the explanation text). For a concept
Laxmikanth does not support (e.g. early republics, theocracy, dictatorship, media, misinformation), write NO questions:
list it in `_reviews/verify-ncert_<file>.md` under 'UNSUPPORTED - owner to decide' with the reason; never invent
content from memory. Also verify the old questions of the converted concepts as in Mode U (list wrong/doubtful ids).
The pack header may keep the old `source` block unchanged. Validate with check-civil-pack.py (0 problems).

## Mode P - polish an already-reviewed pack (owner request 2026-10-09)
The older packs lk01..lk07 (chapters 1-7) passed review with HIGH 0 but still carry MEDIUM defects that later packs avoid. For ONE pack `packs/<file>.json`, read its review files in `content/authoring/civil/polity/_reviews/` (every `<file>*.md`), then fix by DIRECT JSON edits keyed by id (never rebuild from scripts; read each changed item back): (1) the validator flags (python3 scripts/civil-services/check-civil-pack.py); (2) longest-key tell: in direct items the key must not be the longest option more than about a third of the time per concept (compute it yourself over all direct items) - lengthen distractors (still false and plausible) or shorten keys; (3) idea repetition: cap each idea at 2 uses per concept counting direct, Statement-I/II and match items - replace extras with other facts from the same chapter (if the chapter truly lacks facts, change the angle, never repeat a statement); (4) cue words: in false statements avoid the tell-words 'only', 'always', 'every', 'wholly', 'never', 'compelled', 'without any' unless the true statements use them equally; (5) the Falsifier rule: re-check every false statement and every distractor you touch is false in real history/law AND per the chapter, and that no distractor is also supported by the chapter; (6) copies of tagged PYQs named in the reviews: re-angle; (7) Statement-I/II: vary the relation and keep 'explains' only where the page itself states the causal link; (8) where the book states a count, date or 'at present' fact that has since changed, say 'according to the chapter'. After editing, re-answer every changed item cold from the chapter text, run the validator (0 problems), then `python3 scripts/civil-services/reshape-options.py <pack> --write` LAST (not permute-match). Reply with the number of items changed and the saved text of the three most substantial changes.

## AKS study notes (owner request 2026-10-11): Modes I and A
The owner uploaded "Indian Polity - M S Shashank" study notes (254 pages, 21 chapters), kept LOCAL ONLY (copyrighted,
gitignored): `content/reference/civil-services/shashank/chapters/chNN.txt` (pages marked `=====PDF PAGE n=====`) and
`chapter-map.json`. Goal: no concept, sub-concept or fact left untested, including minute facts, at UPSC standard.
Source discipline for these notes: the notes are a SECONDARY source and may be wrong or out of date. Every fact you
turn into a question must also be true in real law/history; where the notes disagree with Laxmikanth
(`laxmikanth/chapters/`) or with settled law, do NOT write a question on the disputed point: record it in the
conflicts file. Write everything in your own words (never copy the notes' sentences), and never mention the notes'
author in a question, explanation or pack text; the source name in packs is "Polity study notes (AKS v2)".

### Mode I - inventory ONE unit of the notes
You get a chapter and a PDF page range. Read it completely and write
`content/authoring/civil/polity/aks/inventory/<unit>.json`: `{unit, chapter, pages, facts:[{fid, ch, topic, sub,
kind, text, pg, cluster, flag, note}]}`. One record per ATOMIC fact: a definition, an Article/Schedule/Part number,
a date, number, count, name, list item (each member of a list is its own fact), power, function, exception, condition,
comparison, case/judgement, committee and its recommendation, amendment, body and its composition/term/removal.
`fid` = `A<chapter 2 digits>-<seq 3 digits>` continuing within the chapter (the unit file gives the seq start).
`topic` = the notes' own heading, `sub` = sub-heading, `kind` one of definition|article|date|number|list|exception|
power|case|committee|amendment|body|comparison|other, `text` = the fact in your own words in 1-2 sentences, `pg` = PDF
page, `cluster` = a short label of 8-15 facts that belong together in one question concept, `flag` = `ok` or
`verify` (fact looks wrong, contradicts the Laxmikanth chapter, or is outdated/changed; say why in `note`). Skip only
pure padding (repeated headings, page headers, examples with no testable fact). Also include `outline`: the list of
headings and sub-headings of the unit with their pages, so coverage of every sub-concept can be audited. Do not summarise
away detail: a table row, a footnote, a bullet in a list and a 'note' box each yield facts. After writing, run
`python3 scripts/civil-services/aks-inventory-check.py <file>` (0 problems) and read 15 random pages back against
the file to confirm nothing on them is missing. Report: facts per page, number flagged `verify`.

### Mode A - author questions for a set of clusters from the inventory
You get a chapter and the cluster list (fids) to cover. Write `content/authoring/civil/polity/aks/packs/aksNN[x].json`
in `civil_pack` format: `subject POLITY/CIVILS/class 0`, `source:{publisher:'Study notes',title:'Polity study notes (AKS v2)',edition:'v2',year:2026}`,
`chapter:{part:'A',chapter_no:NN,name,blurb,source_code:'aksNN',order_index:200+NN}`, `scope_in`/`scope_out` with
page ranges, concept codes `AKS-NN.m` (new concept per cluster group; a concept holds 20 questions, 5 direct / 9 which /
3 how-many / 2 Statement-I/II / 1 match, same trend rules as Mode N). Each question carries `fi:[fids]` (the facts it
tests; a which/how-many item tests 3-4 facts at once, so 20 questions can test 40+ facts). EVERY fid you were given must
appear in at least one question's `fi` (or be listed with a reason under `skipped`: conflicts, flagged `verify` and
unresolved, or untestable); minute facts (a number, a date, a name in a list, an exception) get their own distractor
traps. UPSC standard: two-step/elimination items, plausible near-miss falsifiers (Falsifier rule), no idea more than 2 times
per concept, option-shape tells removed, `pg` = pages of the NOTES. Also check Laxmikanth (`laxmikanth/chapters/`)
for the same fact and cite it in the explanation as 'also in Laxmikanth' where it is. Run
`python3 scripts/civil-services/dup-check.py <pack>` and re-angle any question reported as a near-duplicate of an existing pack
item. Then `check-civil-pack.py` (0 problems), `reshape-options.py --write` LAST, `permute-match.py`, and
`python3 scripts/civil-services/aks-coverage.py` for your chapter (every fid covered or skipped). Use YOUR OWN scratch
folder `scratchpad/<your-unit>/` - other agents share the scratchpad and overwrite files.

## Lessons from the lk05 pilot (two independent reviews) - apply from the start
- Statement items: NEVER let one known statement decide the key; build wrong options as real near-misses,
  not random combinations. False statements are plausible (close number, swapped body/amendment/article,
  "only/always"), never absurd, never contradicting another statement. Vary the false statement's position
  (include #1 and #2), vary the number of true statements (0 to all), and in four-statement items do not
  keep #3 true or "exactly three" as the key. At least one all-correct item and one single-correct item per concept.
- Statement-I/II: Statement-II must clearly explain, or clearly not explain, Statement-I. Never use a later
  event as the "reason" for an earlier absence, and never let II restate I.
- Do not repeat one idea across items of a concept (six items on "integrity added in 1976" is a defect).
- A claim that is only a footnote/classification in the source: do not name the source; use it only if it is a settled classification, otherwise drop it.
- Do not copy a tagged PYQ; the same idea with a new angle is fine.
- Before finishing, compute yourself the distribution of key text and false-statement position, and re-answer
  your own pack cold. Then run the validator.

## Falsifier rule (cause of most HIGH findings in the first 8 packs)
A false statement must be false in REAL history/law AND per the chapter - never 'false only because the
book words it differently or is silent' (e.g. 'zamindars' for the book's 'labour', 'Act for the Better
Government of India' for the book's 'Good Government', Iyer not described as a Drafting Committee member).
Before keeping any falsifier ask: would a well-read aspirant defend it as true? If yes, replace it.
Likewise ask of every distractor 'is this also supported by the chapter?'.
Keep every idea to at most 2 uses per concept INCLUDING direct, Statement-I/II and match items.

## Mix to write (from the 2020-26 era, not a constant)
about 25% direct, 45% "which statements are correct", 15% "how many are correct", 10% Statement-I/II,
5% match/case. Mostly two-step or elimination; recall at most 40%. 3-4 statements for the statement forms.
Plant the real traps on purpose and name them in `traps`: negation, close numbers, only, always/never, exception.
Exactly ONE defensible option. Distractors must be real misconceptions, each with a one-line reason it fails.

## Output (JSON array)
`{id: "CS-POL-chNN-###", chapter, topic, articles[], format, stem, options{a..d}, answer, explanation,
wrong_reasons{letter: why}, traps[], skill, pdf_pages[], answer_status: "confirmed"}`.
Write one concept at a time to disk. Validate with a short script (ids unique, four options, answer in a-d).
Stop there. No database, no git. Max 8 agents in the whole session.
