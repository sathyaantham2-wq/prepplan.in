# Review: content/authoring/dps/class6/ch06.json (Class 6 Maths, Perimeter and Area, fegp106)

Read: all 126 questions (6 concepts x 21). Every number, key and case-study part recomputed (python / by hand) before the stored
answer was read; textbook pages 001-024 of fegp106 opened for the facts. Mechanical checks: every mcq/match key text equals exactly
one option, every AR/multi_statement key begins with exactly one option; step marks sum to `m` on every written item; no positional
option references anywhere. (This overwrites an earlier findings file at this path; its one distinct finding, the market-stall case
study, is kept below as MEDIUM 5.)

Result: 0 wrong keys, 0 arithmetic errors, 0 HIGH. A handful of MEDIUM ambiguity/wording issues and a structural template.

## HIGH
None.

## MEDIUM

1. **C6M-6.5 item 19 (boat-club sail case study), Cut B "so only one sail".** The two leftover 3 m x 4 m right triangles can be
   joined along their 4 m legs into a triangle of base 6 m and height 4 m, area 12 sq m (>= 10): a second sail. The chapter itself
   teaches cut-and-rejoin (6.2). A strong student has a second defensible reading of (c) and (d). Fix: add "pieces smaller than
   10 sq m are thrown away and cannot be joined".

2. **C6M-6.5 item 1 (triangular park, "30 m from the road, measured at right angles").** The stem does not say the foot of the
   perpendicular lies on the 40 m side. If it falls outside it is the obtuse case. scope_out: "a height that falls outside the
   triangle ... belong to a later grade". Fix: "directly above a point of the 40 m side" (or "fits inside a 40 m x 30 m rectangle").

3. **C6M-6.1 item 20 (cones case study, part (c)).** "finishes 5 m along the 45 m side" depends on which side she runs first from
   the corner, which the stem never says. Fix: "starting at a corner and running first along a 75 m side".

4. **C6M-6.1 item 19 (garden wire quotes, part (d)).** The key's logic is muddled: "B would suit the school only if the old gate
   is unusable, because then it buys the gate for a price near A's". If the gate is unusable, A also needs a bought gate, which is
   exactly when B wins. With only Rs 15 between the quotes and B's gate worthless to a school that owns one, the decision is close to a
   strawman. Fix: make B a little cheaper than A (e.g. Rs 3,250) so the old-gate point has to overturn it, or rewrite the key as
   "A: Rs 15 cheaper and no new gate needed; B would win only if a new gate had to be bought anyway".

5. **C6M-6.6 item 19 (market stalls).** The stem says "customers can reach only the stalls on the edge" but the key never uses it.
   Block X (4 x 6 stalls) has (4-2) x (6-2) = 8 unreachable interior stalls; Block Y (2 x 12) has none, so Y gives 24 reachable stalls
   against 16 and "either choice is fine" is wrong. "8 more stall fronts" is also an unclear count. Fix: say "Y has 8 more reachable
   stalls than X", have the key note X wastes 8 stalls while Y costs Rs 240 more rope, and let the decision rest on that.

6. **C6M-6.3 item 19 (tiles, supplier X vs Y).** The 30 sq m of spare tiles is worth 30 x 95 = Rs 2,850 at Y's rate, more than the
   Rs 1,100 saving, so "Y" is not the only defensible pick if repairs are likely. The key hedges, but the rubric step names Y. Fix:
   accept either with the stated trade-off, or state "no repairs are expected".

7. **C6M-6.4 item 6 (match, garbled stem).** "A shape on a grid has six squares of one kind, or eight if full" does not parse. The
   item is also the four-line counting convention restated as a match (recall in disguise). Fix: "A tracing has some squares of each
   kind. Match each group with the area it adds", with different counts and each square worth 4 sq m so it needs a calculation.

8. **C6M-6.4 item 11 (two students get 24 and 26).** Part (b) "Which kind of square decides the difference in the rule?" is vague and
   its key restates (a). Fix: "(b) If 2 squares were judged differently, by how much can the two counts differ?" (answer 2).

9. **C6M-6.6 item 16 wording.** The stem asks for a rectangle with "a perimeter close to it but a different area", but the key gives one
   with the same perimeter (42 ft). Fix: "with the same perimeter but a different area".

10. **Repeated ideas inside one concept.**
    - 6.2: the 8 x 6 card cut into two 8 x 3 pieces drives items 2, 5, 11, 13 and 17 (five of 21).
    - 6.3: "area is 4 x side" is both the AR (item 5) and the true_false (item 10); the claim in item 13 is the same family.
    - 6.4: "traced shape, then area x rate" in items 8(b), 10, 16, 19 and 20 (same frame, same computation).
    - 6.5: "third corner anywhere on the opposite side, same area" in items 2, 9, 12, 13, 14; the AEF + BEF split in items 5, 7, 11, 17;
      items 18 and 20 are the same rectangle-with-E-on-DC case study twice.
    - 6.6: "attach a unit square and track the perimeter" in items 2, 4 (S3) and 11.
    Fix: replace one or two per family with a new idea in the same concept (6.5: a triangle on a grid with a missing height; 6.3: a
    path or border area; 6.4: compare two traced shapes with no cost; 6.2: rods and a shared-side count).

11. **Slot-order template (structure, not content).** All six concepts have the identical 21-slot order: four scenario mcqs, MS, AR,
    fill/match alternating, one mcq, five 2-mark (true_false at slot 9 or 10 in a fixed 3+3 split), claim_check at slot 13,
    show_impossible at 14, reverse at 15, one apply, two long, two case studies. Frames recur: "X says ... Test his claim", "Show
    that no ... can ...", "Write a real situation for the expression ...". Eleven of the twelve case studies end in a rupee
    cost-comparison "which should we pick, justify". The anti-template rule asks for varied order and frames. Fix: reorder slots in
    2-3 concepts, and turn 3-4 case-study decisions into non-cost ones (space limit, time limit, safety margin).

12. **multi_statement uses 3 statements (I, II, III) in all six concepts**, while the Maths house convention noted in
    QUESTION_STANDARD (section 3 note) is two statements. Known bank-wide inconsistency; cut to two statements if this chapter is
    meant to follow the Maths house style.

## LOW

- 6.1 item 7 ("perimeter 36; which must be true") restates the rule l + b = half the perimeter; Analyse is generous. Add a second condition.
- 6.3 item 6 (450 / 25 = 18) and 6.5 item 6 (84 x 2 / 12 = 14) are one-step inversions of Figure-it-Out practice. Make two-step.
- 6.2 item 12(a) "State the property of a regular polygon" is half a mark of pure recall.
- 6.3 item 7 (choose the expression for lawn minus bed), 6.4 item 4 Statement 1 and 6.4 item 9 are close to one-line book facts.
- 6.3 item 20 (orchard): whole-square packing is not taught; add "only whole 6 m squares fit".
- 6.6 items 7, 12 and 6.3 item 17 repeat "split a rectangle by a parallel line".
- 6.6 item 3 is Figure-it-Out Q5 (p.149) recast; 6.1 items 2 and 17 follow the Akshi/Toshi tracks (p.133). Adaptations, not original.
- 6.6 item 20 part (c) (depth of the top right room) is not used by the decision in (d).
- 6.4 item 8(b): "adds more than the shape really has" over-claims; it is an over-count only on average.
- Difficulty is `Hard` (102) or `Hardest` (24) only and never varies inside a slot, so the `d` field carries no signal.
- Bloom: Apply 44, Analyse 59, Evaluate 17, Create 6, Understand 0; Analyse+Evaluate+Create = 65%. Fine.

## Template counts
- claim_check verdicts (6): right 2 (Kabir, Rani), partly right 2 (Rohan, Sana), wrong 2 (Meena, Gopal). Mixed, OK.
- true_false (6): True 3 (6.1, 6.4, 6.6), False 3. OK.
- multi_statement keys: "1 and 3 only", "2 and 3 only", "1 only", "1 and 2 only", "3 only", "1, 2 and 3". Well spread; false statements
  fall on 2, 1, 2+3, 3, 1+2, none.
- assertion_reason keys: A false/R true x2, A true/R false x1, both true and explains x2, both true not explains x1. Good.
- Correct option the unique longest among 44 mcq-like items: 2. No length tell.
- fill_blank 3, match 3, true_false 6, claim_check 6, show_impossible 6, reverse 6, case_study 12, figure 2.

## Per-concept verdicts
- C6M-6.1: pass after fixes (case studies 19 and 20; item 7 mild recall).
- C6M-6.2: pass after fixes (five items on one card; 12(a) recall).
- C6M-6.3: pass after fixes (4 x side twice; supplier trade-off; items 6, 7 easy).
- C6M-6.4: pass after fixes (garbled match stem; vague 11(b); repeated cost-from-tracing).
- C6M-6.5: pass after fixes (case study 19 second reading; item 1 height scope; same-base-same-height repeated).
- C6M-6.6: pass after fixes (case study 19 unused stem clause; item 16 wording).

## Counts read
126 questions read; 0 HIGH; 12 MEDIUM; 11 LOW. Templated at slot and frame level (identical slot order, fixed frames, cost-comparison
case studies); the numeric content is varied and every key is correct.

Overall verdict: pass after fixes.
