# Review v2: Class 8 Social Science, Part II ch4, The Role of the Judiciary in Our Society (hees204)

Pack: `content/authoring/dps/class8s/p2ch04.json` (the path in the task said `content/authoring/class8s/...`; that is the scope file, the 160 questions live in the dps pack). Reviewed: all 160 questions (8 concepts x 20), every number recomputed in python (7, 16, 28 [n/a], 27, 29, 34, 76, 77, 113, 151, 163, 2015, 2024, 2030, 2032, 2035), every fact checked against pages 001-018. Concept index is 0-based within each concept.

Verdict: NOT load-ready. 10 HIGH, all cheap to fix. Facts and keys are otherwise sound: no wrong-key arithmetic, no scope_out violation, no name-dependence on "National Judicial Grid / Data Grid", step marks sum to marks everywhere, o[0] == a everywhere, no option named by position.

## HIGH (10)

1. C8S-4.1 [0] case study, part (d). "Which of the three (after correction) serves best, and why?" Key picks corrected Line 2 with a reason ("neither the legislature nor the executive is placed to do [that] about itself") that the book never states. Line 1 (government makes laws to ensure justice) and Line 3 (disputes are settled by courts) both defensibly serve; it is a tie dressed as a decision. Also part (c) is answerable from the stem alone (Line 3 itself says "dialogue, mediation or adjudication"). Fix: make (d) a real trade-off the book supports one way (e.g. "Which corrected line states the judiciary's reason for independence, quoting the chapter's wording?"), and make (c) ask for something not printed in the stem.

2. C8S-4.2 [2] fill_blank "Criminal Tribes Act 1871 ... Vernacular Press Act 1878 ... older by ___ years" = 7. Both years are in the stem; it is subtraction with no chapter fact needed. Fix: give only one year in the stem and require the chapter's year for the other, or replace the item.

3. C8S-4.3 [1] long_answer part (c). "Sana turns 61 in 2026. In which year does she reach the retirement age, and what is that age?" Key 2030 (age 65). Sana is stated to be a High Court judge; by the chapter a High Court judge retires at 62 (2027), and she has not been appointed to the Supreme Court in the stem. Two defensible answers. Fix: "If she is appointed to the Supreme Court in 2026 ..."

4. C8S-4.3 [12] fill_blank "completes ___ years" on 26 January 2026 = 76. The stem prints 26.01.1950, so 2026 - 1950 needs no chapter. Same idea reused in [16](a). Fix: drop the date from the stem (chapter fact needed) or retire the item.

5. C8S-4.4 [3] fill_blank "guidelines in 1997 ... Act in 2013 ... came ___ years after" = 16. Both years in the stem; pure subtraction. The 1997/2013 order is tested four times in this concept ([3], [9], [10], [19]). Fix: replace; keep at most two uses.

6. C8S-4.4 [10] case study part (d). Asks "Which two entries, as corrected, show the Court acting on an issue of public concern?" Key lists "Entries 2 and 3 (and Entry 1 as corrected)", i.e. three, which contradicts "two" and makes any pair correct. Fix: ask "which entry, as corrected, shows the Government acting after the Court" or ask what the three share.

7. C8S-4.6 [0] fill_blank "25 High Courts, of which 18 each cover a single State. The remaining ___ ..." = 7. Two problems. (i) The 18 is only reached by counting the Delhi High Court (table: "Delhi") as a single State; the book's own 28 States do not include Delhi, so the true single-State count is 17 (check: 17 single-State courts + 11 States in multi-State courts = 28). The stem therefore asserts something false by the book and depends on the Delhi State/UT question the author meant to avoid. (ii) Answer is 25 - 18 from the stem alone. Fix: replace with "the Gauhati High Court covers ___ States" (4) or a count of rows that mention a Union Territory (J&K and Ladakh, Bombay, Calcutta, Kerala, Madras, Punjab & Haryana = 6).

8. C8S-4.7 [1] fill_blank "plan 2011 ... no sign even after four years. The family noticed the breach in the year ___" = 2015. 2011 + 4 in the stem; no chapter fact; any year from 2015 on is arguable. The builder case is also tested four times in this concept ([0], [1], [8], [10]). Fix: retire; cut the case to two items.

9. C8S-4.7 [2] long_answer, D5: "a large consumer disputes an electricity supplier's charges". Key: Appellate Tribunal for Electricity. The book's figure also lists "Consumer Fora decides consumer disputes"; the stem calls her a consumer. Two defensible tribunals. Fix: "an electricity distribution company challenges a regulator's order" or drop the word consumer.

10. C8S-4.8 [5] fill_blank "Indian Evidence Act, 1872 replaced ... in 2023, after ___ years" = 151. Both years in the stem. Same idea as [1](d) (163) and [6](b) (113): three year-difference items on one table. Fix: replace; keep one.

## MEDIUM

C8S-4.1
- [2] fill_blank "adjudication": "litigation" and "trial" are also natural answers for "takes place only in a court of law". Add the chapter's wording to the stem or accept-list.
- [6] 5-mark: marks for "why a court controlled by that body could not check it fairly" rest on reasoning the book does not state. Mark scheme must accept any sound reason, or ask only for what the chapter says.
- [3] (2 marks, "name the three routes ... which one is carried out by courts"), [9] (true: mediation is a listed route), [13] (Preamble promises justice to all), [14](a) and [19] are one-line page facts under Analyse/Understand labels.
- [11] match: situation 1 (hawker cheated) also fits "disputes arise from personal and professional interactions"; only elimination fixes the key (LOW).

C8S-4.2
- [1] case: (d) "does the rehearing now meet both aspects?" is a yes by construction; not a decision.
- [6] "NOT named as a consequence" is a list recall; wrong options include invented extras ("even a small one").
- [9] match and [11] AR are straight recall of the two Acts and two countries.
- [18] (d) "the common reason the chapter gives for calling these laws unjust" across India, US and South Africa: the book gives different wording for each (India: inconsistent with justice and a democratic republic; US/SA: denied public facilities and a life with dignity). No single common reason. Reword to "reason for the US and South African laws".

C8S-4.3
- [9] case: after (a) the rest is corrections plus a tally ("2 correct, 2 wrong, score 2 of 4"); (d) is arithmetic on (a), not a decision.
- [10] translation of the motto: one-page lookup with distractors that are invented sayings.
- [15] flowchart reorder and [17] 5-mark "identity card" (five lookups, labelled Understand/Hardest) are recall.
- [16](d) asks for "numbers the chapter confirms" but 76 is not printed in the chapter (computed).
- [18] MCQ options are four bare years 2028-2031; none carries the High Court "62" confusion (that would give 2027). Add 2027 as an option.
- Repetition: retirement at 65 appears in [1](c), [3], [9], [13], [16], [17], [18]; 33+1 arithmetic in [4], [5], [14 of 4.5]; 76 in [12] and [16].

C8S-4.4
- [2] 5-mark: four of five parts are page lookups of the Hingorani paragraph.
- [9] chronology MCQ restates the 1997/2013 order (already four uses).

C8S-4.5
- [2] fill_blank "original" and [16] fill_blank "President" are names/terms copied from the page, one chapter line each, not application level.
- [5] two-part recall (Articles 142, 144) under Apply.
- [9] (c) and (d) overlap (NCLAT/NGT named in the correction).
- Repetition: the five-judge Constitution Bench is tested in [1](b), [6], [14](b), [18](c); the 142/144 articles in [5], [15], [18].
- [8] match: situation 4 (appeal against a tribunal order, "leave") could be read as appellate (NGT/NCLAT); only "leave" and "substantive justice" separate it (LOW).

C8S-4.6
- [2] case: parts (a)-(c) are three lookups in the same table rows; (d) is arithmetic, not a decision.
- [4] (a) recall; [5] one-line appointment list; [6] true/false rests on a table row, no misconception.
- [9] key says "exercised sparingly in all cases"; the book says only "exercised sparingly". Drop "in all cases".
- [11], [19] 5-mark answers are five lookups each.
- Repetition: retirement-year computations at [8], [13], [15] (three), appointment consultation at [5], [12], [14].

C8S-4.7
- [0] MCQ, [8] two-mark and [10](b),(d) re-ask the builder paragraph; case [10] reprints the whole paragraph in the stem so (a), (b) are answerable from the stem.
- [2] 5-mark is five tribunal-figure lookups.
- [14] fill_blank "National Company ___ Tribunal" = Law: a name copied from the page.
- [15] second error ("free of any control") is weakly keyed: the book says Articles 233-237 ensure the independence of the subordinate judiciary and that the High Court has "supervisory control" (p.136, Article 227). Key should cite supervisory control and Article 227, not only the honour-and-integrity duty.
- [17] 5-mark and [11] are recall lists; [18] case: rival's claim is a strawman and (a), (b), (d) are lookups.

C8S-4.8
- [1] case: (d) 163 years is arithmetic on printed years; (a)-(c) correct two printed claims.
- [18] two-mark year and "what it reinforces": one-line page fact.
- [0], [2], [8], [13], [17], [19] are single-fact scenarios whose wrong options are invented absurdities (arbitration "inside a Supreme Court building"), not chapter confusions.
- Repetition: mediator-has-no-power-to-decide appears in [0], [4], [9], [10], [14]; burden-on-judiciary in [8], [15], [16].
- [11] 5-mark and [15] 5-mark overlap on the alternate-mode facts.

## LOW
- Several MCQs carry the `scenario` tag with no scenario ([2][6], [3][10]).
- C8S-4.1 [11] and C8S-4.5 [8] match items see above.
- C8S-4.6 [4]: "(a) the other kind of unit" is a one-word recall.
- C8S-4.3 [1] retirement age for Sana is in effect a duplicate of [18].

## Checks that passed (counts read)
- Questions 160; Bloom: Apply 63, Analyse 55, Evaluate 22, Understand 13 (8%), Create 7; Analyse/Evaluate/Create = 84 = 52.5%, above the 30% floor; no Remember, no Easy (128 Hard, 32 Hardest).
- Types: short 64, long 32, mcq 31, fill_blank 12, AR 8, multi_statement 8, match 5. Per concept 8 short, 4 long, 3-4 mcq, 1 AR, 1 MS, 1-2 fill_blank.
- Option length: correct MCQ option is longest in 7 of 31 (23%) and shortest in 0; the C8 [19] pairing item is longest by 2 characters (97 vs 95), not a tell on its own.
- multi_statement keys: 1&2, 2&3, 1&3, all three, 1 only, 2 only, 3 only, 1&2 (well spread). Every false statement is clearly false by the book ("only", "alone", "every", swapped article).
- AR keys: R explains 2, both true no link 2, A false 2, R false 2. The "R does not explain" items (C2, C5) are unarguable; "R explains" (C1, C6) have the link stated by the book ("since", independence essential for fair decisions).
- claim_check verdicts: No 4, Partly 3, Yes 3. true_false: True 4, False 4. Both well mixed.
- MCQ numeric-only item (C3 [18], retirement year) is arithmetically right (2026 + 4 = 2030); see MEDIUM on distractors.
- National Judicial Grid / Data Grid: no item depends on it. Delhi State/UT: only C8S-4.6 [0] relies on it (HIGH 7). Delhi appears in C8S-4.4 [16] only as a residence, harmlessly.
- Numbers recomputed and correct: 1878-1871 = 7; 2013-1997 = 16; 2026-1950 = 76; 33+1 = 34; 34-5 = 29; 34-7 = 27; 65+12 = 77; 1973-1860 = 113; 2023-1872 = 151; 2023-1860 = 163; 2021+5 = 2026; 2026+4 = 2030; 1970+62 = 2032, 1970+65 = 2035; 1968+62 = 2030; 2026+3 = 2029, 2026+6 = 2032; 25+2 = 27; 25-1+4 = 28.

## Template check
- Slot order differs per concept, so no identical-order template.
- Frame repetition is the real template: every concept has one "A note/pamphlet/newspaper says ... Correct the two errors using the chapter" item (8 of 8), one "write an imaginary situation for each" reverse item (7 of 8), one five-part 5-mark "(a)-(e) using the chapter" recall list (8 of 8), and five case studies share the "imaginary document with numbered claims, find which are wrong, correct, tally" frame (C4.1 [0], C4.3 [9], C4.4 [10], C4.5 [9], C4.8 [1]). Vary these.
- Five fill_blanks (C4.2 [2], C4.3 [12], C4.4 [3], C4.7 [1], C4.8 [5]) are subtraction from numbers printed in the stem, plus three (original, President, Law) that are page copies. Only 4 of 12 fill_blanks (adjudication, 2024, 2030, and arguably the 7 in 4.6 once fixed) need a chapter fact.
- Easy-in-disguise estimate: about 35 of 160 items are one-line page lookups under Apply/Understand/Analyse labels (largest cluster in C8S-4.7 and C8S-4.8), and about 8 of the 16 five-markers are lettered recall lists.

## Per-concept status
- C8S-4.1: fix (HIGH 1) plus MEDIUMs; otherwise sound.
- C8S-4.2: fix (HIGH 2).
- C8S-4.3: fix (HIGH 3, 4).
- C8S-4.4: fix (HIGH 5, 6).
- C8S-4.5: no HIGH; MEDIUM repetition and recall; pass after trims.
- C8S-4.6: fix (HIGH 7).
- C8S-4.7: fix (HIGH 8, 9).
- C8S-4.8: fix (HIGH 10).

Overall: pass after fixes (not load-ready as is). Needs a second review after the 10 HIGH items and the fill_blank and repetition MEDIUMs are fixed.
