# AKS notes - Mode A author brief (UPSC Prelims, Indian Polity)

Owner request 2026-10-11: study the uploaded polity notes and write questions so that NO concept, sub-concept or
fact is left untested, minute facts included, at UPSC Civil Services Prelims standard. The facts were inventoried first
(`aks/inventory/*.json`, one record per atomic fact with `fid`, `cluster`, `flag` ok|verify and a `note`), then grouped by
`aks/plan.json` into packs and concepts. You write ONE pack.

## Your inputs
- `aks/plan.json`: find your pack by name; it lists its concepts (`code` AKS-NN.m, `clusters`, `fids`). Write exactly these
  concepts, in this order, each with exactly 20 questions (validator wants 20-22).
- The inventory files of your chapter (`aks/inventory/chNN*.json`): read EVERY fact of your concepts, with its `note`.
- The notes text (`content/reference/civil-services/shashank/chapters/chNN.txt`, pages marked) for the pages in your
  facts (`pg`), so you see the facts in context. Own words only.
- Laxmikanth (`content/reference/civil-services/laxmikanth/chapters/`, `chapter-map.json`) to confirm each fact.
- The inventory also has, per unit, `laxmikanth_to_add` / outline remarks of Laxmikanth facts the notes omit. You MAY add
  up to 6 such questions per concept (they replace weaker ones) when the notes' topic is thin; cite Laxmikanth pages.

## Coverage rule (checked by `python3 scripts/civil-services/aks-coverage.py --chapter NN`)
Every `fid` of your concepts must appear in at least one question's `fi` list, or in the pack-level `skipped` list as
`{fid, reason}`. Allowed skip reasons: `verify-conflict` (the note says the fact contradicts Laxmikanth or settled law and
no corrected form is testable), `time-bound`, `untestable`. A `verify` fact whose note gives a safe corrected form should
be tested in that corrected form (say 'according to Laxmikanth' where needed), not skipped. At most 12% of a concept's
facts may be skipped; if more, say so in your report. A question tests the facts in `fi` (a which/how-many item with 4
statements tests 4 facts); aim for every fact tested once and the harder or minute ones (numbers, dates, names in lists,
exceptions, a table row, a footnote) tested twice in different forms.

## UPSC standard (apply from the start; these are lessons from 31 reviewed packs)
- Mix per concept: 5 direct (`f` direct, `t` mcq), 9 which-statements (`f` which, `t` multi_statement), 3 how-many
  (`f` howmany, `t` multi_statement), 2 Statement-I/II (`f` stmt12, `t` assertion_reason), 1 match (`f` match, `t` match).
  Recall at most 8 of 20; mostly two-step / elimination / application.
- Falsifier rule: a false statement or distractor must be false in REAL law/history AND per the sources, never false only
  because the notes word it differently or are silent. No distractor may also be supported. One defensible option only.
- Statement items: vary the position of the false statement, the number of true statements (0 to all), at least one
  all-correct and one single-correct item per concept; false statements are plausible near-misses (swapped body/Article/
  amendment/year, close number), without the tell-words only/always/every/never/wholly/alone unless true statements use
  them equally. Statement-I/II: II either clearly explains I or clearly does not; never let II restate I.
- An idea or fact appears at most twice per concept (and avoid copying existing statements in the other 31 packs: run
  `python3 scripts/civil-services/dup-check.py <your pack>`; re-angle every line it reports >= 0.7 or put the fact in a new form).
- Keys: the correct option is FIRST in `o` (the loader shuffles); key text must vary; in direct items the key must not be
  the longest option more than ~1/3 of the time; no option set reused more than twice per concept.
- Time-sensitive facts (counts, office holders, 'at present', thresholds) are worded 'according to the notes' / 'as of
  the notes' or tested via the stable rule instead. Law changes: CrPC/IPC/Evidence Act are replaced by BNSS/BNS/BSA (2024);
  Electoral Bonds struck down (Feb 2024); CEC and ECs appointment under the 2023 Act; 104th Amendment ended Anglo-Indian
  nominations; J&K Reorganisation Act 2019; Part IX-B (97th Amendment) invalid for state co-operatives (2021).
- Never mention the notes' author or the notes as 'the study notes' in the question stem; explanations may say 'per the
  chapter notes p.NN' only through `pg` (pages of the NOTES). Do not copy the notes' sentences.

## File format (`aks/packs/<pack>.json`, kind civil_pack)
`{kind:'civil_pack', subject:{code:'POLITY',name:'Polity',board:'CIVILS',class:0}, source:{publisher:'Study notes',
title:'Polity study notes (AKS v2)',edition:'v2',year:2026}, chapter:{part:'A',chapter_no:NN,name:'<plan name>',
blurb:'<one sentence>',source_code:'aksNN',order_index:200+NN}, scope_in:[{item,pages}], scope_out:[{item,reason}],
skipped:[{fid,reason}], concepts:[{code,name,description,idea,rule,example,difficulty_base:'Hard',questions:[...]}]}`.
Packs of the same chapter (a, b) carry the SAME chapter block. `rule` = the concept's facts in 3-6 sentences, `idea` = one
sentence. Each question: `{f,t,m:1,q,a,o:[4, correct first],e,w:[3 reasons in o order after the key],tr:[traps],sk,pg:[pages of the notes],
fi:[fids],id:'CS-POL-aksNN[x]-###'}`; `a` is the text of the correct option; explanation `e` says why the key is right
and, for statement items, lists each statement 'Statement n is correct/incorrect: reason' so the key can be recomputed.

## Procedure
1. Read the plan entry, the inventory facts and the notes pages of your concepts; decide each concept's name and its 20
   questions and the facts each tests BEFORE writing (write a small table in your scratch folder).
2. Build the pack in per-concept part files in YOUR OWN scratch folder `scratchpad/<pack>/` (other agents share the
   scratchpad and overwrite generic names); merge to `aks/packs/<pack>.json`. Keep a statement's truth flag next to it
   while building so keys and explanations cannot drift. Do NOT emit a whole pack in one tool call.
3. Run `python3 scripts/civil-services/check-civil-pack.py <pack>` (0 problems), `python3 scripts/civil-services/dup-check.py <pack>`,
   `python3 scripts/civil-services/aks-coverage.py --chapter NN` (nothing uncovered for your fids; ignore other packs' fids),
   then `python3 scripts/civil-services/reshape-options.py <pack> --write` LAST, then `permute-match.py`, then
   re-run the validator.
4. READ THE SAVED FILE BACK and re-answer 25 items cold from the sources. Report: items per format, facts covered/
   skipped (with ids and reasons), the `verify` facts you tested in corrected form, and any conflict you found between the
   notes, Laxmikanth and real law. No database, no git.
