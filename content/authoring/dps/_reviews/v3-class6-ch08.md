# Review v3: DPS Class 6 Mathematics ch08 (Playing with Constructions)

File: content/authoring/dps/class6/ch08.json. Source fegp108. Compared against v2-class6-ch08.md.
123 questions read (20, 21, 20, 21, 20, 21). Every key decided before reading the stored answer; all numbers recomputed (wave counts, radii, tan-consistency of the frame angles, all Rs totals, time sums 5.8 / 23.2 / 20.2, sides sqrt(24), sqrt(33), sqrt(40), cable lengths sqrt(49+6.25), sqrt(49+4)). Programmatic checks: every mcq/match/AR/multi_statement key equals one of its options (0 failures), no duplicate options, every written item's step marks sum to its marks, no positional option references ("Drawing (ii)" is a label inside the stem, not an option position).

## v2 fixes confirmed
- 8.3 idx4 (the HIGH): wrong option replaced by "The angle at P is not 90 degrees, since PS is shorter than PQ"; now exactly one defensible answer.
- 8.1 idx16(e) restricted to the three openings; 8.1 idx19 rebuilt (P 107.5 m, Q 105 m, both pass, margin 2.5 m vs 5 m against gate 20 m vs 40 m; real trade-off); 8.2 idx19 now 40 minutes (P 40, Q 30, R 20); 8.4 idx20 now says "of the three trial positions"; 8.1 idx1 distractor, 8.6 idx19 rule reworded to "at least 23 m", 8.5 idx15 (Rahul) recast. All recomputed and correct.

## HIGH
None.

## MEDIUM
1. C6M-8.4 idx20 (cable on 7 x 4 ground, Rs 36,000): part (d) "recommend one" is forced. Only the 70 m trial fits the budget (74 m Rs 37,000; 73 m Rs 36,500) and the 70 m cable is also the shortest possible, so no weighing is needed. Parts (a) to (c) are the stem's numbers times 500. Smallest fix: raise the budget to Rs 37,500 so all three trials fit and the choice is cost against something else (for example a cable that must clear a tree so XY must exceed 7.2 cm), or accept and call it a 3-mark item.
2. C6M-8.2 idx20 (stencils, Rs 250 / Rs 90): parts (c) and (d) are money sums (90 + 8 x 5 and so on); only (a) and (b) need the chapter. Part (d) "2 squares: with each check which method" is two separate comparisons, not one decision. Smallest fix: move 2 marks to a property question, e.g. ask why a tilted 25 cm square drawn by hand needs the R2 check at all, or shorten to a 3-mark item.
3. Repeated ideas (counts from this read):
   - 8.3 and 8.4: "equal distances from A and B give XY = AB, ABYX a rectangle" appears in 8.4 idx0, idx5(S1), idx9, idx13, idx17(b,c), idx20(b); "farthest XY is a diagonal" in idx2, idx5(S2), idx12, idx13, idx17(d). Keep idx9 and idx12; recast the rest (for example, give a rectangle with unknown BC and readings of XY and ask for the possible range of BC).
   - "four right angles force opposite sides equal" in 8.2 idx12, idx15, idx19(b), 8.3 idx1 and idx17(d,e). Keep two.
   - 8.5: "45 and 45 means a square" in idx1, idx5, idx9, idx12, idx16(b,c), idx18(b).
   - 8.6: "arcs only, not full circles" in idx5(S1), idx6, idx10, idx13; "bigger house with all lines 7 cm" in idx1, idx11, idx15.
4. Case-study money frame: 7 of 12 case studies are "cost in Rs against a budget, then recommend" (8.2 idx20, 8.3 idx19, 8.4 idx19, idx20, 8.5 idx18, 8.6 idx19, idx20). Recast two as non-money decisions (fit, time, accuracy), for example 8.6 idx20 as which stall position keeps both arcs crossing given the gate gap.
5. Map scale is used in 8.1 idx19, 8.4 idx20 and 8.6 idx3, idx7, idx9, idx17, idx19, idx20. The chapter never teaches scale; every stem states it, so not a scope break, but the chapter idea in these items is one line and the rest is division by the scale. Keep idx7 and idx17 as the scale items and give the others a different test (can the two arcs cross when the posts are d apart).

## LOW
- Easy in disguise (answer is one line of the book or one step): 8.1 idx7 (24 / 4), idx6 (AR restates the definition), idx12 (true_false with answer True and no misconception; recast as "moving the tip to Q makes the circle bigger"); 8.2 idx4 (NOT true of every rectangle), idx10, idx11, idx12 ("R2 forces R1" is the book's answer to Construct Q3; say so); 8.3 idx7 (21 / 3), idx10, idx13 is fine; 8.4 idx7 (21 / 3 = 7 is 8.4 idx7; same), idx10; 8.5 idx3 and idx7 (90 minus a part), idx0, idx17(e) (6.3 > 3 and 7 > 6.3); 8.6 idx7 (12 / 3), idx13 (True with no misconception), idx10 (two "ways" are one idea).
- 8.2 idx8 (match): item 1 (a paper square turned) fits both "A square" and "Has the same sides and angles as before the turn"; unique only because the matching is one-to-one (item 4 can only be A). Smallest fix: reword A as "A square that was never turned".
- 8.2 idx19: Plan Q dominates P (cheaper, equally decisive); the answer's "unless readings are error-prone" carries the choice. Make P cover a stated extra purpose or accept.
- 8.4 idx16: "has no ruler, only a compass" but the steps use perpendiculars; say "no ruler, but a set square".
- 8.5 idx18: the committee's 2 cm acceptance rule fixes F3, so (d) is nearly arithmetic; the real decision is the closing sentence. 8.6 idx18 (settings 6, 3, saves 3) is counting; (e) is obvious.
- 8.5 idx12: uses "3 + 3 < 7 so the arcs cannot meet" (shortest path idea) which the book does not state; fine reasoning but beyond the book's text. 8.4 idx4 (centre of a square plate at the crossing of diagonals) is inferred from the book's "Square with a Hole" hint, not stated.
- 8.1 idx5 and statement items use "Statement 1/2/3": correct for the DPS three-statement style.

## Scope check
scope_out lines read (diameter/chord, compass-only angle construction, other quadrilaterals, proof via parallel lines, perimeter and area, symmetry, coordinates): no violation found. Dot-grid steps in 8.2 idx3 are moves, not coordinates; 25 cm "length used" in 8.3 idx19 is addition, not perimeter. Facts checked against pages 005 to 029: R1/R2/S1/S2, valid names, rotation keeps lengths and angles, X/Y exploration, rectangle in two or three squares, 60/30 methods, side 5 diagonal 7, House steps, supporting lines (eyes hint).

## Template counts
- Slot order: two patterns only (with and without a match item); 8.1, 8.3, 8.5 identical, 8.2, 8.4, 8.6 identical; mcq x5, multi_statement, AR, fill_blank, [match], 8 short answers, 2 long, 2 case studies in every concept. Not a blocker but vary in two concepts.
- claim_check verdicts: No 4, Partly 2, Yes 1. multi_statement keys: "1 and 3 only" 2, "1 only", "1 and 2 only", "3 only", "all three" (spread good). AR keys: R explains 2, not explain 2, A true R false 1, A false R true 1 (good).
- Correct mcq option is the longest in 19 of 30 (63%); lengthen distractors in 8.1 idx1 (the correct option is shortest there, fine), and 8.4 idx0, 8.6 idx3 as noted before.
- Difficulty Hard 16 or 17, Hardest 4 per concept; Bloom mix Apply/Analyse dominant, Evaluate 3 to 4, no Remember.

## Verdicts
- C6M-8.1: pass.
- C6M-8.2: pass after small fixes (idx20 mixed arithmetic, match wording).
- C6M-8.3: pass (HIGH cleared).
- C6M-8.4: pass after small fixes (idx20 forced decision, repeated XY ideas).
- C6M-8.5: pass (repeated 45/45 idea, a few one-step items).
- C6M-8.6: pass after small fixes (scale and money frames, repeated arcs idea).

Overall: pass. No wrong key and no second defensible answer found in 123 items; only MEDIUM and LOW polish remain. Counts: HIGH 0, MEDIUM 5, LOW about 15.
