# Review v3: Class 7 Maths Part II ch 6 "Constructions and Tilings" (content/authoring/dps/class7/p2ch06.json)

Read all 150 questions (7 concepts; 21/21/22/21/22/21/22). The file is a full rewrite of the one v2 reviewed: almost no stem is the same. Latest earlier review was v2 (v2-class7-p2ch06.md; 1 HIGH, 27 MEDIUM, 54% easy items).
Method: every key decided before reading the key; all arithmetic recomputed; every tiling claim in 6.6 checked by exhaustive search (python): 4x4 minus the four named squares (not tileable, square (1,1) isolated), staircase 1-2-3-4 (not tileable), 5x6 minus two opposite corners (tileable), 4x4 minus two stacked squares (tileable), 3x8 (tileable), 5x3 minus corner (tileable), 5x3 minus three black squares (not), 5x5 minus corner (tileable, 12 tiles), 6x9 minus (1,1),(3,3) plus two white squares (350 tileable pairs, so Option P in the case study is feasible), 6x9 minus (1,1),(6,9) (tileable). Numbers also checked: rope heights (sqrt), 7x/2x chains, 4 x 14 = 56 etc. Book (gegp206) pages 002, 004, 005, 007 checked for scope.

## Status of v2 findings
- v2 HIGH (6.1 match, OX = 5 vs 7): FIXED. Row 4 now asks XY from OX = 2t+1 = 7, so 14 cm; key 1-c, 2-d, 3-b, 4-a is correct.
- v2 HIGH (earlier, 6.5 tile count): stays fixed (new tile problem [8] recomputed: 21,600 / 20,550.40, 600 / 741 minutes).
- v2 repetition/easy-item/forced-decision/"reverse that is a procedure" findings: mostly rewritten away. The three old forced case studies (6.2 rope, 6.3 radius, 6.5 tile, 6.6 pillars) now have real constraints in most cases. Some residue remains (below). v2's 2-statement vs 3-statement note: the 7 multi_statement items here use 3 statements (I, II, III); 6.3 [19] and 6.5 [10], 6.4 [6], 6.6 [17], 6.7 [18], 6.1 [15], 6.2 [19] all do it consistently inside this chapter (the known bank-wide inconsistency is for Maths 2-statement; see CLAUDE.md note, not new here).

## HIGH
1. C7M-6.4 [1] (mcq, "Neha ... bisects the interior angle between l and n that lies below n, on the same side of l as the 70 degree angle"): the stem never says whether the 70 degree angle at A is above or below m, so the angle below n on that side is either 110 degrees (bisector 55, the key) or 70 degrees (bisector 35, also an option). Both are defensible from the text. Fix: state the position, e.g. "the 70 degree angle at A lies above m, on the right of l; she bisects the angle between l and n that lies below n on the right of l (it is 110 degrees)", or ask for the bisector of the copied 70 degree angle directly.

## MEDIUM
1. C7M-6.3 [1] (mcq, eight rays R1 to R8): "equal angles between neighbours" does not say the rays go all the way round, so 45 degrees (and therefore 180 for R2 to R6) is assumed. Add "so that R8 and R1 are also neighbours / the rays go all the way round O".
2. C7M-6.3 [19] (multi_statement) Statement 2: "equal arcs drawn on the far side of O from the angle still gives an angle bisector". The book never says this (it only treats the arcs on the angle's side and above/below XY); the crossing beyond O gives the opposite ray, which is not inside XY and bisects the vertically opposite angle. A careful student can call it false, and then no option fits. Replace by a statement the chapter supports (for example "equal arcs from A and B may have any radius greater than half of AB").
3. C7M-6.3 [10] (short_answer): "smallest whole-number radius for which the arcs meet", key 3 cm (arcs touch at the midpoint of AB). Chapter 6.2 itself teaches that a radius of exactly half only touches and gives no crossing, so 4 cm is a second defensible answer. Say "cross at two points" and use 4, or ask for "at least" explicitly and accept both.
4. C7M-6.2 [0] (case study): option (c) already shows only Q meets both limits, so (d) "buy P within money or ask for 10 more for Q" is decided by the 3 m requirement; the 3.4 percent vs 13 percent comparison mixes a money overshoot with a height shortfall. It is a forced answer in disguise. Make a real trade-off (e.g. P gives 2.9 m, the priest says 3 m is a preference not a rule).
5. C7M-6.5 [8] and [6] (case study and 5-mark): the 10-hour limit decides [8] (9 cm tiles miss it, so 10 cm) and the 10-minute limit removes the six-piece plan in [6]; both then read as "pick the feasible one" with the key hedging "a justified choice earns the mark". Acceptable once, but both decisions are made by a hard constraint.
6. C7M-6.4 [2] (case study): late finish earns Rs 560 against Rs 450 on time, so "finish late" dominates; the key's "either is defensible" cites a risk that is not in the stem. Add a cost for risk or lower the stripe price so the penalty bites.
7. C7M-6.7 [19] (mcq): "a honeycomb needs at least 3 colours" is colouring theory; the book's only colouring is the chessboard (pages 024-025). The reasoning (three cells meet at a corner, each touching the other two) is sound but it is outside the chapter's taught content; keep only if the standard allows reasoned extensions.
8. Repetition: the 5x3 grid with chessboard colouring is used in 6.6 [9], [13], [14] and [17](S3) (four items, one idea; [9] and [13] both ask which square may be removed). 6.5 diagonal AOD straight in [5] and [20]; "gap angle = 360 minus sum" in 6.5 [4], [17], [19]; 6.7 "k copies of an angle vs 360" in [0], [1], [2], [8], [11], [16], [20]. Swap one of each pair for a new idea.
9. 6.6 [19] (counting tilings of a 2 x n strip, Fibonacci-like 1, 2, 3, 5): not in the chapter (the book does not count tilings). Marked as short Analyse; either drop or mark it clearly as an extension. Scope borderline.

## LOW
- 6.4 [10]: "the two perpendiculars from P1 and P2 are parallel" is false if P2 lies on the first perpendicular (same line). Add "from two points not on one perpendicular".
- 6.4 [16] ("NOT true"): "interior angles on the same side are equal" is false in general but true for a perpendicular transversal; add "in general".
- 6.1 [14] and 6.2 option lengths: correct MCQ option is the strictly longest in 14 of 39 MCQs (36 percent); 6.1 [14] (93 vs ~85) and 6.2 [9] are the clearest. Trim the correct option or lengthen distractors.
- 6.1 [8] case study key (b) "Yes. CX = CY and XY has only one perpendicular bisector" restates the cue; fine but easy.
- 6.5 [4] tagged reverse and Create is a reasonable open item, but the check "none of them 90" is a useless constraint (a student cannot use 90 anyway because the answer is open).
- 6.7 [9] tagged Create but is a two-step lookup (330 then 30; bisect 60).
- Easy-in-disguise (one-line book facts, numbers decorative): about 20 of 150 (13 percent), down from 81 (54 percent) in v2: 6.1 [2], [6], [16], [20]; 6.2 [1], [3], [11]; 6.3 [4], [5], [6], [7], [14]; 6.4 [0], [3], [7], [20]; 6.5 [1], [19]; 6.6 [3], [16]; 6.7 [2], [18]. Acceptable at this share.
- Claim-check verdicts: No 4 (6.1, 6.3, 6.4, 6.5 in different forms), Yes 2 (6.2, 6.6), Partly right 1 (6.7). Good mix.

## Recomputed keys (all correct unless listed above)
- 6.1: [0] 2 spots (height sqrt(100-36) = 8); [2] 16 m; [4] x = 4, 11 and 11; [7] 13.5; [10] 28, 56, 62; [12] match 14 cm, key correct; [13] 3 cm toward Y; [15] multi_statement "1 and 3 only" (S2 false: other bisector points are farther than the midpoint); [18] S1 8,000, S2 7,200; [19] proof chain correct.
- 6.2: heights sqrt(16-9) = 2.65, 4, sqrt(36-9) = 5.20; [2] only the 3 m pegs with 8 m rope work (6 < 8; 8 = 8, 9 < 10 and 4 = 4 fail); [9] 8.4, 35.7, 71.9; [11] 7 m; [13] 15 vs 20 arcs; [15] 3, 4.47, 5.74; [16] 0.1 cm to the right; [19] multi_statement "2 and 3 only" matches the book (Figure it Out 2 and 3); [20] correct.
- 6.3: [2] 95; [5] 32 rays, 90 degrees; [8] 40, 20, 10; 2.5; first below 1 after 7; [9] 63; [13] match key correct (80/4/... chain); [15] 16 and 40 minutes, 12 bisections, 5 spare = 2 redos; [18] assertion_reason: A true, R false (SSS not SAS), key correct.
- 6.4: [2] 110, 450, 560; [3] 25, 65; [5] 12 m, 12,600 vs 10,400; [6] multi_statement "1 and 2 only" (S3 false); [17] 6 cm; [18] key correct.
- 6.5: [2] 48 cm; [3] 72 and 48; [6] 6, 5, 4 pieces and Rs 42, 43, 44; [8] as above; [10] multi_statement all three true; [14] 30 cm; [15] 1080, 360, 720, 120; [16] 42 m; [17] 320, 40, 5, Rs 360 vs 150; [18] match key correct (40 cm perimeter of ABCD = 3 x 8 + 16); [19] 60 degrees.
- 6.6: all counts above; [8] A 1,360 / 1,480, B 1,445; [15] P Rs 3,945 (feasible, 350 pairs), Q Rs 4,080; [17] multi_statement "1 only" (S2 needs equal counts; S3 false because a white square removed leaves 8 vs 6); [20] only the staircase fails (6 black, 4 white).
- 6.7: [5] 360, 360, 330; [7] 19 x 9 = 171; [10] 48 cm; [13] 60 min, 90 cells, 40 min; [14] 12, 42, 90 cm, 54 cm, 6; [15] match key correct; [17] 3 + 3 + 1 = 7 lists (checked by enumeration), 3 without hexagons; [18] multi_statement "3 only".

## Template / format checks
- No option is named by position in any question or key. Pass.
- All 39 MCQ keys are stored as option 0 (the loader shuffles, per scripts/load-dps-pack.ts). OK.
- Slot order is now varied across concepts (M/S/L/R/X/T/F interleaved; no fixed run). v2's template finding is fixed.
- Counts: short_answer 60, mcq 39, long_answer 28, assertion_reason 7, multi_statement 7, fill_blank 5, match 4 (true_false and claim_check carried inside short_answer by tag). Bloom: Analyse 65, Apply 42, Evaluate 30, Create 7, Understand 6 (Analyse/Evaluate/Create = 102 of 150, 68 percent; labels slightly generous).
- assertion_reason outcomes: explains x4 (6.1, 6.2, 6.4, 6.5), A true R false x1 (6.3), A false R true x1 (6.6), true-not-explain x1 (6.7). The same spread as v2; lean once more toward non-"explains".
- multi_statement keys: 1&3, 2&3, 1&2, 2 only, 1 only, 1,2&3, 3 only: spread well. 6.5 [10] (all three true) is the weakest (three book facts).
- Scope: no scope_out violations except the borderline items 6.3 [19] S2, 6.6 [19], 6.7 [19] listed above. Constructions are written as steps in words; no figure-dependent item.
- No strawman case study remains except the soft ones in MEDIUM 4-6.

## Verdict
Counts read: 150 of 150. HIGH 1, MEDIUM 9, LOW 8. Verdict: NOT YET PASS, because of the single HIGH (6.4 [1] has two defensible keys). With that one stem fixed and MEDIUM 1-3 (6.3 [1], [10], [19]) tidied, this is a pass: keys are otherwise all correct and the pack is much harder and less templated than v2.
