# Review v3: SST8 Part I ch6 (hees106), content/authoring/dps/class8s/p1ch06.json

Re-review after one fix pass. All 186 questions read (20, 20, 21, 21, 20, 22, 20, 21, 21), matched by text,
since every concept was reordered. Indices are 0-based in the NEW order. Every number recomputed in
python. Facts read off pages 001-024 of `content/extracted/hees106/pages/`. Scope read from
`content/authoring/class8s/p1ch06.json`.

## v2 status

| v2 finding | Now |
|---|---|
| HIGH 6.3 "largest group" tie | FIXED. 6.3[12] asks what links (iii) and (vi); both are executive accountability, and the other pair (i, v) is constitutional, so the answer is unique. |
| HIGH 6.3 part (d) second head | FIXED. 6.3[8](d) asks which value Law D serves and by what means; "Upholding Fundamental Rights and DPSP by framing laws and policies" is the only reading. |
| HIGH 6.8 state capitals | FIXED. 6.8[10] names Uttar Pradesh, Rajasthan, Madhya Pradesh and Odisha; 6.8[3] names states. |
| MEDIUM 6.9 AR [6] | FIXED. 6.9[18], R now carries the link ("so hours lost to disruption lower it"); key "R explains A" is the only defensible one. |
| MEDIUM 6.9 "accepts any justified pairing" | OK. 6.9[15] is a short_answer with three marking points (names two actions and two challenges, justifies each link); it is not an MCQ. |
| MEDIUM 6.5 Ayush extract not quoted | Partly fixed. Now quoted in 6.5[0] and [4], but see HIGH 1. |
| Repetition, easy-in-disguise, strawman case studies | Mostly NOT fixed. See MEDIUM. |

Arithmetic, all recomputed and correct: 72,000 units; Rs 5,76,000 a year; 12,00,000 / 5,76,000 = 2.083 (about 2.08);
36 and 72 hours; 93.6 hours; 15.6 hours; 90 / 132 = 68.2%; 65%; 72 and 18 languages (Rs 72 lakh); 41 of 47;
20%; 42-sitting percentages 37.5 / 25 / 20 / 17.5; 25% of 50 = 12.5 so 13, minus 7 = 6; 48.4 / 35.4 / 26.4 / 25.4;
23.14; 16.7 (17); 36.4; 5.3; 11.1; 83.3; 21.4; 35%. No arithmetic error anywhere.

The five fill_blanks:
- 17 (6.1[15]): the stem says "before the 18th was constituted", so the answer is the stem's own count minus one. It does not need the chapter. MEDIUM 1.
- 12 (6.2[18]): one natural answer, the number is only on the page (the stem names the six added languages, not the 12). OK, but it is a one-line fact.
- 2008 (6.4[6]): the stem gives "six years after the 86th Amendment Act" but not 2002, so the chapter is needed. One answer. OK.
- "civil" (6.6[15]): one answer on the page, but the stem defines the group and "civil servants" is general knowledge; "public" or "government" are the natural wrong guesses, and the item is a one-line fact. MEDIUM.
- 90 (6.9[16]): needs "6 hours a day" from the page; 15 x 6 = 90; one answer. OK.

## HIGH (1)

1. **C8S-6.5 [4]** (tagged figure, 5 marks): "(a) Which committee is reporting, and whose officers did it meet?" The key is "Standing Committee on Health and Family Welfare, meeting officers of the Ministry of Health and Family Welfare". The Ministry of Health and Family Welfare appears only in the book's caption on p.150. It is NOT in the quoted extract, and the extract's reply is voiced as the Ministry of Ayush ("Ministry of Ayush has requested State/UT Governments..."). A student reading the stem can defensibly answer "Ministry of Ayush". That is a second defensible answer and the key is not derivable from the stem. In addition parts (b), (c) and (d) are answerable by copying from the stem, so only (e) needs the chapter. Smallest fix: say in the stem that "the officers who attended were from the Ministry of Health and Family Welfare" (then (a) is read, not recalled) and drop (b)-(d) in favour of a decision: "Did the Ministry of Ayush accept the Committee's recommendation as worded? Use the Action Taken", with marks for the point that the creation of departments is a state matter and the 24 figure.

No other wrong key or second answer found. Statement, AR and match keys all verify.

## MEDIUM

### Not needing the chapter / answerable from the stem
- 6.1[15] fill_blank 17: see above. Make it a fact the stem does not imply, e.g. the year the first Lok Sabha was constituted is allowed only if not also in the stem ("the first one in 1952" is in the stem), so instead ask "In the chapter's words, the Parliament comprises all ___ and nominated representatives" (answer: elected).
- 6.1[12] and 6.1[17]: the same computation (30% of 2,40,000 = 72,000 units) is done twice. [17] parts (b) and (c) are stem arithmetic, and (d) "should the committee accept?" is a strawman (cost back in about 2 years of 40). Cut [12] or change its numbers; give [17](d) a real trade-off (for example a second option that is cheaper but saves 20%).
- 6.5[0]: answerable from the extract quoted in its own stem; it repeats [4]. Cut or re-point at what the Committee's recommendation was.
- 6.7[10]: (a) is arithmetic and (c) is read off the stem; only (b) and (d) need the chapter.
- 6.8[7]: the stem copies the chapter's list of the legislature's roles, so (a)-(d) are arithmetic and stem reading. Remove the list from the stem so (c) needs the chapter.
- 6.9[8]: both numbers are in the stem; pure subtraction and percentage. 6.9[13](b) and (c) are contrived arithmetic ((c) divides the lowest year by the lowest session, which compares different things); only (a) and (d) need the chapter.
- 6.9[19]: only (a) needs the chapter (the definition); the rest is stem arithmetic (acceptable as a case study but thin on the chapter).

### Arguable keys, premises, wording
- 6.2[4] (c): the key assumes every bill goes through both chambers (72 hours, 36 saved). The stem says only "each bill takes 3 hours in a chamber". Add "every bill passes through both chambers".
- 6.4[2]: statement 2 "It is based on Article 21A" is used as a reliable statement but the page says RTE's roots lie in the DPSP and that the 86th Amendment mandated Article 21A; it never says RTE "is based on" 21A. Part (c) "Which statement is reliable" also has two correct statements (the August 2009 assent too), saved only by "what age group does it name". Part (d) is a strawman ("correct two or rewrite four") decided by counting the stem's four sentences, not by the chapter. Reword statement 2 as "Article 21A, inserted by the 86th Amendment in 2002, covers children between 6 and 14", ask (c) "which two statements are reliable", and replace (d).
- 6.6[3] (a)/(b): "Which two rows show the Executive depends on the Legislature / acts on its own?" There are more than two defensible rows each (dependence: "provides information and explanations", "prepares and implements the budget approved by Parliament", the sanction row; independence: only "can function independently in day-to-day matters" is clear, and "most bills are introduced by the Executive" is arguable). Say "name any two" and accept any valid; rubric already reads that way, the key prints one set.
- 6.1[8]: Country Y is internally contradictory ("all adults vote ... but women may not vote"). Say "all men over 18 vote".
- 6.1[9]: "for what four needs" but the page says "including capacity, technology, sustainability and safety". Ask "name two needs" or accept "including".
- 6.4[14]: stem says stages "of your choice", but the marking points fix one grouping (introduction/reading/committee; consideration/clause-by-clause/vote; other House/assent/gazette). Either let the marks follow any consistent grouping with reasons or drop "of your choice". The groupings also depend on the figure order (next point).
- **Fig. 6.8 order (the author could not check it).** The extracted text of p.147 lists the nine boxes in a scrambled order (Introduction; Vote; Process repeated; Reading; Standing Committee; Taken up; Gazette; Clause-by-clause; Assent), so the pages do NOT give the sequence. The only source of the order the items use is the author's own `scope_in` line. Items that depend on it: 6.4[12] (reading, then committee, then clause-by-clause, then assent: key and the three wrong orderings), 6.4[14] (the stage groupings), 6.4[8] (vote, then other House, then assent, then gazette), 6.4[19], 6.4[20] (assent then gazette), 6.4[5](c) (other House follows the vote). The orders are the logical ones, and nothing contradicts them, but confirm against the printed figure before loading. If the printed order differs, 6.4[12] and [14] are the ones that break.
- 6.8[14]: Vidhana Soudha / Hanumanthaiah's four roles. Not in `scope_in` at all (a caption), and it asks for his "member of the Constituent Assembly" role, near the scope_out lines "The Constituent Assembly, its members" and "names of ... past holders of office". Replace with a `scope_in` idea (the role list of p.157 is used only in [12] and [18]).
- 6.5[8] (True/False, True): no misconception; it restates the chapter. Make it False ("committees may include only MPs of the ruling party") or cut.
- 6.5[3] key ends "The verdict rests on that second point", which muddles the verdict logic. Drop that sentence.

### Easy in disguise (answer is one line of the book, whatever the label)
About 47 items, plus nine five-mark transcriptions of a paragraph or table. 6.1: [4], [9], [13], [15]. 6.2: [1], [3], [11], [14], [16], [18], [19]. 6.3: [0], [5], [9], [13], [16]. 6.4: [3], [7], [15], [20]. 6.5: [2], [13], [16], [19]. 6.6: [1], [2], [15], [17], [19], [20], [21]. 6.7: [0], [3], [6], [9], [18]. 6.8: [1], [4], [10], [14], [16], [18], [20]. 6.9: [0], [14], [20]. Five-mark recall bundles labelled Analyse/Create/Evaluate: 6.1[18], 6.2[6] and [12], 6.3[20], 6.4[18], 6.5[12], 6.7[11] and [15], 6.8[12]. Fix: for each of these ask "what follows if the rule were different" or a misconception, as 6.9[7] (the sittings table cannot prove lower productivity) and 6.6[16](d) do.

### Case studies (19 incl. 6.5[4])
The last part is a real decision in only about 6 of 19 (6.2[4], 6.6[9], 6.6[16], 6.7[10], 6.9[13], 6.9[19]). Weak or strawman last part: 6.1[16](d) (recall of the correct relation), 6.1[17](d), 6.2[7](d) ("does adding three finish the work": the stem already shows 6 of 47 MPs unserved), 6.3[8](d) (a lookup), 6.3[15] (a)-(c) restate [1] and [10] and (d) is a hypothetical with a trivial answer, 6.4[2](d), 6.4[5](d), 6.5[7](d), 6.5[15](d) (obviously the one ministry that failed), 6.6[14](d), 6.7[1](d), 6.8[3] ((d) restates (a)), 6.8[7](d). Fix by making the last part a trade-off with two defensible options and a numbered reason, as 6.9[19](d) does.

### Repetition above the twice-per-idea limit
- 6.1: the four needs of the new building in [5], [9], [14], [16], [19]; 1952 / 17 / 18 in [6], [15], [16]; the 30% saving in [12], [17], [19].
- 6.2: "a single directly elected House is inadequate" in [0], [1], [4], [12], and [6e]; presiding officers in [6], [13], [14].
- 6.3: the four core values in six items, [6], [8], [13], [16], [19], [20]; Rajya Sabha MP made minister / both houses vs Lok Sabha in [1], [2], [10], [15]; four heads sorted in [3], [9], [12].
- 6.4: RTE dates and the 6-14 / 2002 / 2008 facts in [2], [6], [9], [13], [15], [18]; the optional committee step in [3], [12], [14], [17], [19].
- 6.5: "committees may include MPs of different parties" in [3], [8], [9], [14], [18]; the poetry example in [2], [7], [16], [19]; the first-hour scenario in both [11] and [17] (same situation); the Ayush extract in [0] and [4].
- 6.6: civil servants in [2], [15], [17], [19]; the table's sanction/budget row in [3], [7], [13], [21]; nominal/de facto in [5], [6], [8], [18]; the PM's four functions matched in [0] and again in [10] (duplicate).
- 6.7: "Judiciary steps in on implementation" in [1], [2], [10], [11], [13], [19]; "Judiciary checks laws against the Constitution" in [3], [4], [9], [11], [15], [16]; "no organ too powerful" in [2], [6], [7], [11], [15]; "Judiciary is separate from Parliament's arms" in [12], [14], [17].
- 6.9: the definition of productivity appears in [1], [2], [3], [7], [9], [10], [13], [16], [18]; the Naidu figures in [4], [8], [10], [13]; the sittings table in [3], [7], [12]. The non-numeric ideas (criminal cases, angry debates, the media) get [0], [11] only.

### Option length
MCQ only (47): the correct option is the longest in 18 (38%), strictly longest in 15; mean correct 82 characters against 73 for wrong ones. Not systematic, but six clear outliers: 6.1[7] (63 vs 38-42), 6.2[13] (136 vs 80-104), 6.3[18] (162 vs 77-98), 6.7[8] (60 vs 17-31, the one long answer among one-word options), 6.9[5] (148 vs 70-84) and 6.9[11] (108 vs 59-79). Equalise these.

### Template frames
- "The outcome is / A headline reads: '...' Write a short imaginary situation (illustrative) ..." in 6.3[11], 6.5[1], 6.6[7], 6.7[2], 6.8[0], 6.9[2]: six near-identical frames with swapped nouns. Keep two, rewrite the rest.
- "X says: '...' Test his/her claim" in all nine concepts (10 items); keep it, but vary (a claim to repair, a claim to rank).
- "True or False? '...' Give the verdict and the reason or correction" in 6.2[2], 6.3[14], 6.5[8], 6.7[19], 6.9[9]; "Show that ..." in 6.2[16], 6.4[8], 6.6[12]; "poster / leaflet / speech" 5-mark recall in 6.3[20], 6.8[12], 6.7[15].
- Slot order is no longer identical across concepts (the reorder worked), and the marks mix varies.

### Counts read
- Types: 74 short_answer, 47 mcq, 37 long_answer, 9 multi_statement (all three-statement, the DPS standard), 9 assertion_reason, 5 match, 5 fill_blank, 0 typed true_false (five tagged `true_false` inside short_answer).
- Claim-check verdicts (10): No 4, Partly right 3, Yes 3. Fine.
- `multi_statement` keys (9): I and II only 3, I and III only 2, II and III only 1, I only 1, II only 1, III only 1. Fine. The false statement is III in all three "I and II only" items (6.4[16], 6.5[18], 6.6[5]); spread the false one.
- `assertion_reason` keys (9): both true / R not the explanation 4, both true / R explains 2, A false R true 2, A true R false 1. Good spread.
- `a` identical to `o[0]` on all 70 option items; step marks sum to `m` on every item with steps; no option named by position anywhere (script-checked); no duplicate options.
- Level mix and difficulty: only Hard and Hardest; every 1-mark item is Hard.

## LOW
- 6.1[6]: "18 Lok Sabhas since 1952" also conflicts with the chapter's own phrase "17 since the first one"; the key (2019 vs June 2024) is still the only offered correction. Options 3 and 4 are absurd.
- 6.1[14]: options 2 and 3 are near-duplicates (both "old building, now Samvidhan Sadan, where the Assembly met").
- 6.1[18]: stem says "three questions" but lists (a)-(e).
- 6.1[1]: first two marking points overlap (foundational principles / right to vote).
- 6.2[10]: second marking point ("the phrase shows it was limited") is tautological.
- 6.2[17], [19], 6.4[4], 6.5[19], 6.9[5], 6.9[11]: two or three wrong options are plainly absurd; make them real confusions (for example 6.9[11]: "The media records exact productivity").
- 6.5[9]: R is plainly unrelated to A (an obvious "not the explanation"); 6.3[4] likewise.
- 6.5[15]: 6.5[15](d) lacks a real tension (one ministry fails both); add a second ministry with only one failure.
- 6.6[0]/[10], 6.6[19](b): "permanent" read as "do not leave when a minister changes" goes slightly beyond the page.
- 6.6[16](a): "two details" while the answer has three problems (the third is the generalisation, covered by (d)).
- 6.8[13]: (c) and (d) repeat what (b) already names.
- 6.8[3]: (a) and (d) answer the same fact.
- 6.4[19] key: "the steps themselves do not change" is an inference; fine, but say "by the flowchart".
- Tag `scenario` is put on plain "NOT among ..." items (6.3[19], 6.7[8], 6.9[14], 6.4[17]); drop it.
- 6.9[6](b): "what else can she do" has a second defensible answer ("stay informed"); say "engage with whom".

## Per-concept verdict
- C8S-6.1: pass after fixes (MEDIUM only; fill_blank 17, duplicate 30% arithmetic, Country Y wording).
- C8S-6.2: pass after fixes ([4](c) assumption, repetition of the inadequate-House idea).
- C8S-6.3: pass (v2 HIGHs fixed); repetition of the four values and weak case-study parts.
- C8S-6.4: pass after fixes ([2] statement 2 and (d), Fig. 6.8 order unverified).
- C8S-6.5: NOT load-ready until HIGH 1 ([4](a)) is fixed; also [0] duplicate, repetition.
- C8S-6.6: pass after fixes ([3] "which two rows", duplicates [0]/[10], civil servants x4).
- C8S-6.7: pass after fixes (repetition of three ideas, easy items).
- C8S-6.8: pass after fixes ([7] stem copies the chapter's list, [14] scope).
- C8S-6.9: pass after fixes (arithmetic that does not need the chapter, productivity repetition).

## Counts
Read 186 / 186. HIGH 1. MEDIUM about 45 (individual items; many are grouped above). LOW about 20.
Templated: partly (six identical "outcome is ... write a situation" frames; claim-check and true-false frames in every concept), but slot order is no longer identical.

## Verdict: NOT load-ready.
One HIGH (6.5[4](a)) must be fixed first. The three v2 HIGHs are fixed and no new wrong key was introduced; all arithmetic verifies. Then, before loading, confirm the Fig. 6.8 order against the printed figure, and fix the MEDIUMs that touch correctness or scope (6.2[4], 6.4[2], 6.6[3], 6.1[8], 6.8[14]). The rest (repetition, easy-in-disguise items, weak last parts of case studies, option-length outliers) is quality debt that should be cut or rewritten but does not break a key.
