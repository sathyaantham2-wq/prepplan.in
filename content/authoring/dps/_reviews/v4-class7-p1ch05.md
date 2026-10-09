# v4 review: Class 7 Maths, Part I ch 5 (content/authoring/dps/class7/p1ch05.json), after the v3 fix pass

Method: read the latest earlier review (v3), checked each v3 finding against the current file (modified after v3), then read all 164 items. Every numeric key, interval, cost comparison and table was recomputed independently (python and by hand) before the key was read; every figure item was re-drawn from the stated layout (E above F, A and C left, B and D right, P above E, Q below F; P above Q with 1-8 numbering; ABCD parallelograms) and each angle placed by position. Mechanical checks by script: every step list sums to its item's marks (0 mismatches), every non-mcq key appears among its options, no duplicate options, no answer or option names another option by position (the only hit, 5.8 #20 "Option 1/2", is a design choice inside the story). Source: gegp105 pages 001-021 and the scope file content/structure/class7-maths-part1-ch02-08.md (same-side interior angles, alternate angles and corresponding angles are all in the book; skew lines, slopes, formal two-column proofs, triangle angle sum are OUT and were not found).

## Verdict: PASS (no HIGH; MEDIUM items are small edits)

## Were the v3 findings fixed?
- v3 HIGH 1 (5.1 case study, true value interval): fixed. Now 5.1 #11 uses AOD 118 and BOC 116; T from 63 to 67 (first pair), 59 to 65 and 61 to 67 (second pair), overall 63 to 65; 63 would fail the rule of 64, 64 and 65 pass, re-measure is justified. Recomputed, correct.
- v3 HIGH 2 (5.2 Plan 3 tie): fixed. Plan 3 now costs 2.0, fixed 2.7; door routes 2.8, 2.6, 2.7; cheapest 2.6 is 0.5 over 2.1, above the 0.4 limit, so Plan 1. Correct and no tie.
- v3 HIGH 3 (5.4 "single angle" ambiguous): fixed. 5.4 #1(b) now asks for "the corresponding angle of angle 2" (angle 6), unique.
- v3 HIGH 4 (5.5 #4 impossible vertically opposite data): fixed. The item was replaced by an exact-measurement true/false (70 vs 72).
- v3 near-HIGH second-answer risks (5.2 #8 option D, 5.5 #8 AR, 5.3 #2 floor/ceiling 3-D, 5.2 #6 right-angle count): all four items were replaced; the replacements (5.2 #8, 5.5 #8, 5.3 #2, 5.2 #6) are clean on recomputation.
- v3 claim_check "Yes" with no trap: 5.7 #17 fixed (Sana's claim is now wrong, verdict No). 5.5 #14 (now 5.5 #8, Ritu) is NOT fixed, see MEDIUM 2.
- v3 "identical 12-slot tail": fixed. Slot patterns now differ per concept (checked), tail is no longer a template.
- Forced or strawman decisions: partly addressed (5.2 #20, 5.4 #19/#20, 5.7 #20(d) etc. replaced). Remaining, see MEDIUM 7.
- Repetition: 5.8 and 5.4 only partly addressed, see MEDIUM 6.

## HIGH
None. No wrong key and no second defensible answer that survives a careful reading was found in 164 items.

## MEDIUM
1. C7M-5.2 #19 (mcq, folded sheet): the stem says she folds "from top to bottom" and then asks about "the top-to-bottom crease". A reader can take "top-to-bottom crease" as the crease that runs from top to bottom (vertical, parallel to the left edge), which makes option B ("parallel to the left edge") defensible; only the key's parenthetical (not visible to the student) says the fold bringing the top edge onto the bottom edge makes a horizontal crease. Fix: "the crease made by the first fold" and drop "top-to-bottom crease".
2. C7M-5.5 #8 (short_answer, claim_check, Ritu): the verdict is Yes and the claim is the book's summary read back, so it is a lookup with no trap (v3 flagged it, unchanged). Fix: add a wrong rider (for example "...and the corresponding angles will then add up to 180") and make it Partly right, or change the claim so one half is false.
3. C7M-5.3 #14 (create, "reverse"): the stem requires the second reading to be in a different position AND have a different number from 70, but the key's accepted alternatives list "the lower-left angle 70", which has the same number. Remove that alternative (keep 110 forms: lower-right 110, upper-left 110).
4. C7M-5.3 #9(d) (case study): "Can the true corresponding angles of all three readings be equal?" but four readings are given (72, 72, 72, 70). Say "all four readings". Also rung 2 alone fixes the true angle at 71 only for that rung, so "71 on both rails" should be worded "for each rung".
5. C7M-5.6 #21 (5 marks, jumbled argument): still proves the converse for alternate angles (equal alternate angles give parallel lines), which the book states only for corresponding angles, in a format close to the OUT line "formal two-column proofs". The reasoning is valid and the task is "order and name the rule", so acceptable; either add the alternate-angle converse to the scope IN list or note it. The key states S2/S4 may swap; good.
6. Repetition. 5.8: 13 of 20 items are 2^n + 1 fold counting (#1, 4, 5, 6, 8, 11, 12, 13, 14, 15, 16, 17, 18), with the lattice/transversal items the only variety; this is the book's own activity but the density is high, and #5, #12, #13 are near-duplicates (count lines, count grid points, count cells). 5.4: "how many different measures" appears in #5-adjacent items #6(c), #8, #16, #18, #20, #21 and the 40/140/60/120 data twice. 5.7: parallelogram-with-angles in #3, #7, #10, #18, #21. 5.1: "two opposite angles together S, halve" in #1, #8, #9 (#9 and match #8-III are the same equation). Replace two items in 5.8 and one each in 5.4 and 5.7.
7. Forced or near-forced decisions (the decision is read straight off the stated rule): 5.3 #20(d) (redraw c, obviously), 5.4 #6(d) (rule says order inspection once the gap exceeds 1), 5.7 #6(d) (only one design passes), 5.8 #8(d) (two plans, one over 30 minutes), 5.8 #20(d) (two sums). They are real cost comparisons with arithmetic, not strawman students, so MEDIUM-low only; one genuine trade-off in each concept would be better. No strawman students remain.
8. Easy-in-disguise, strict yardstick (one book line or one subtraction, no choice): about 34 of 164 (21 percent), down from 38 in v3. Definite: 5.1 #1, #7, #9, #17; 5.2 #6, #8, #13, #16, #20; 5.3 #4, #7, #10, #17, #19; 5.4 #1, #7, #13; 5.5 #9, #10, #11, #15, #19; 5.6 #7, #18, #19; 5.7 #2, #4, #5, #12, #20; 5.8 #5, #11, #13, #14. Most are 1-mark items, so the Hard/Hardest labelling is generous there; relabel a few as Apply/Medium or merge duplicates (5.2 #6 and 5.2 #13 are the same bisector idea; 5.7 #2 and #12 are the same same-side equation with different numbers).

## LOW
- 5.2 #14: distractor "m = 35, and the lines are parallel" is obviously wrong (crossing lines); the explanation of 37 ("5m+5=185 divided by 5") is sloppy (185-5=180, 36). Rework the distractors.
- 5.2 #16: "how many pairs does the diagram mark" is right only because of the word "mark" (geometry makes all four p/q-with-r/s pairs perpendicular); fine but fragile.
- 5.8 #17: the reason is typed "2n + 1" against the chapter's "2^n + 1"; the key (R false) is right for the text as written, but a reader who assumes a lost superscript would pick the other key. Write "2 times n, plus 1".
- 5.5 #16: "y is measured as 20 for both designs" is an odd phrase for a variable in an expression; say "the site value of y is 20".
- 5.8 #1: the 32 count depends on "inside the sheet" (2 right angles at each edge end); 36 is the obvious wrong count and is offered as a distractor, which is fine.
- The label Understand holds only 7 of 164 (4.3 percent) and Create 3; Analyse is 84 of 164 and includes many two-step Apply items (5.4 #7, 5.7 #12 style). Analyse/Evaluate/Create is 120 of 164 (73 percent) on the labels.
- Name pair P, Q means crossing points in 5.4 (items with numbered angles) and transversal ends in 5.5-5.7.

## Per-concept recomputation notes
- 5.1 (21): #6 NE 95 exactly, bay built; #11 T 63 to 65; #13 only 62,118,62,118 is within 1 of 61,119,63,117 (the others need a miss of 2); #17 z=25, 4z=100 (60 from equating, 80 other angle); #19 x=30, 40/55/85; #21 a=38, 86/94 and 94/86. All correct.
- 5.2 (20): #3 T 86 to 89 (ranges 86-90, 85-89, 85-89, 86-90); #5 91, 1/0/4, Plans 1 and 2, then Plan 1; #7 k=30; #9 y=25, 80/100, Suchi's 120/120; #14 m=35, 90 each; #15 x=10, 30/150; #18 only junction 3 is impossible, junction 1 only perpendicular. All correct.
- 5.3 (20): #4 x=30; #8 Ali, Bina, Dev parallel and Chetan not; #13 52 b parallel, c fails (58); #15 transitivity; #20 b parallel to a, d off by 2 (limit 1), redraw c. Correct.
- 5.4 (21): #2 a=35; #6 80/100 corrected to 72/108, four measures, gaps 2 within error of 3; #8 corrected list gives 110/70/110/70 and 70/110/70/110; #11 turn 68; #12 x=45, y=20; #13 x=20; #17 only the first set is valid; #18 I-B, II-D, III-A, IV-C; #20 y=x or 180-x. Correct.
- 5.5 (20): #1 a=45; #3 y=24, 84; #5 t=10, 62; #7 totals 8,000 / 9,500 / 9,000, pair 1 cheapest and a 0.8 m piece gives exactly 5.0 m; #11 70 each, 110; #14 y=22, x=10, 114; #16 88/88, 80/90, 4.4 vs 4.2 lakh; #18 z=27, 102/78; #19 sets of four verified; #17 statement 3 false (equal corresponding angles force parallel). Correct.
- 5.6 (21): #1 126; #2 overlap 65 to 66; #3 145; #9 85 and 95 (A=95 checks); #10 38/47 gives 85, 42/48 gives 90, 6.7 vs 6.5; #13 m=30, 77/103; #15 x=15, 49; #16 only AEF and CFE not guaranteed; #17 I-B, II-C, III-D, IV-A; #18 105. Correct.
- 5.7 (21): #2 x=38, 76; #6 larger angles 95/100/105, with a 2 degree error 97/102/107, only A passes; #7 k=28, 94/86/100/80; #8 100, 90, 108, 105; #9 85 / 95 / eight angles; #13 DFE 67 to 69, DHG 69 to 71, ranges meet; #15 100 = 40+55 -> 95, 70+30 -> 100 (walked with coordinates); #17 BEF 80; #21 CAB 62. Correct.
- 5.8 (20): #1 32; #6 128 = 2^7, 257; #8 17/33 lines, 15/31 minutes, 13 extra, 28 minutes; #12 25 points, 16 border, 9 interior; #13 4 x 8 = 32; #16 2^n = 19 impossible; #18 24; #20 1,200 vs 1,000. Correct.

## Counts read
- Items 164 of 164. Types: mcq 40, short_answer 64, long_answer 32 (case studies included), fill_blank 8, multi_statement 8, assertion_reason 8, match 4. Marks: 1m 68, 2m 40, 3m 24, 4m 16, 5m 16 (total 365).
- multi_statement keys: 1 and 3 only, 2 only, 2 and 3 only, 2 and 3 only, 1 only, 1 and 2 only, 3 only, 1 and 3 only: spread across positions. assertion_reason: both true / explains (5.2), both true / not explains (5.1, 5.7), A true R false (5.4, 5.6, 5.8), A false R true (5.3, 5.5): balanced, all recomputed.
- claim_check verdicts now include No (5.3 Faiz-type, 5.7 Sana, 5.8 Isha), Partly right (5.2, 5.4, 5.6), and one trapless Yes (5.5 #8).
- true_false: 4 False (5.1, 5.3, 5.4, 5.6, 5.4#16 counted once) versus True (5.2, 5.5, 5.7, 5.8) roughly 50/50; the 5.5 #4 True (70 vs 72, exact) is the useful one.

## Overall
Pass. The four v3 HIGHs and the second-answer risks are cured and nothing wrong was found on a full recomputation. Remaining work is polish: the 5.2 #19 wording, the trapless 5.5 claim_check, two small stem/key mismatches (5.3 #9, #14), and thinning repetition in 5.8, 5.4 and 5.7.
