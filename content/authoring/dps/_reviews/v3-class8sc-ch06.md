# Review v3: class8sc ch06 "Pressure, Winds, Storms, and Cyclones" (SCI8, hecu106)

Re-review after one fix pass. Pack: content/authoring/dps/class8sc/ch06.json (6 concepts, 122 items). Pre-edit copy diffed:
72 items changed (c0 9, c1 11, c2 10, c3 14, c4 16, c5 12; index = zero-based position within the concept, c0 = C8SC-6.1 ... c5 = C8SC-6.6).
All 72 changed items read; every number recomputed in python; facts checked against pages 012-014 of hecu106.

## v2 status
- v2 HIGH 1, C8SC-6.1 [10](b): FIXED. Force is now stated as fixed; key is "nail's tip area must be reduced to the needle's". One answer.
- v2 HIGH 2, C8SC-6.3 [11](d) (the sucker lamp): FIXED. Limit 0.0035 m2 and safe hold 125 N. Recomputed: S1 0.002 m2 fits but holds
  (100000-40000) x 0.002 = 120 N (< 125); S2 0.004 m2 does not fit and holds 80 N; S3 0.003 m2 fits and holds 150 N. Only S3 passes both. No tie at a limit.
- v2 MEDIUMs: most strawman case studies now carry a real competing factor (6.1 [0] and [14], 6.2 [3], 6.4 [0], 6.5 [1] and [15], 6.6 [2] and [15]);
  fill_blanks 6.3 [2] and 6.4 [3] are now numeric; the Anil depths, the tent wording, the "three ways more destructive" item and the match keys are fixed.

## HIGH (1, new, introduced or left in a changed item)
1. C8SC-6.1 [15] (brick on sand case study), part (b): "Which row of the record must contain a measuring mistake?" Key: "Row B ... its dent should be
   deeper than A's 3 mm". The record is A 0.02 m2 3 mm; B 0.01 m2 2 mm; C 0.005 m2 9 mm. The only fact the data supports is that A and B are in
   the wrong order (A has the least pressure so should have the shallowest dent, yet 3 mm > 2 mm). Row A being the mistake (it should be under 2 mm) is exactly
   as defensible as Row B. A marker holding the key would fail a correct "row A or B". (This was inherited from the first version; v2 missed it; the new part (d) leans on (b)'s idea.)
   Smallest fix: add to the stem "the teacher says dent depth is proportional to pressure" and change A to 3 mm, B to 2 mm, C to 12 mm (then A and C agree at 1250 Pa -> 3 mm and 5000 Pa -> 12 mm, so
   only B is out); or ask "Which TWO rows disagree with each other?" and key "A and B".

All other changed items: key correct, exactly one defensible answer, correct option at o[0], no wrong option equal to the key, no option named by position (0 found), step marks sum to item marks in every item (0 failures).

## MEDIUM
Slot templating (unchanged by the fix pass)
- The fixer did not reshuffle. The type-and-marks sequence of every concept is byte-identical to the pre-edit file. Every concept still opens with a
  case study or a pair of MCQs (6.1 lo4 mc mc; 6.2 mc mc; 6.3 as mc; 6.4 lo4 mc; 6.5 sh2 lo4; 6.6 mc sh2 lo4), the match item and the fill_blank sit at the same early positions
  (idx 2-9), and the last third is the same run in 6.4, 6.5 and 6.6 (lo5 lo4 lo5 / lo5 lo5 lo4 then short items). 12 case studies, all 4 marks, all (a)-(d) (6.1 [14] has (e)). Templating remains a MEDIUM:
  not wholesale (type mix, multi_statement keys, match keys and AR verdicts are well spread) but the slot order is identical. Fix: rotate the order of the 18-21 items in at least three concepts (move the case study and the 5-mark long answers to different positions).
Case-study decisions still thin
- C8SC-6.2 [3] (d): Plan Y fails the 5 m rule outright and is also too heavy for the roof, so the "decision" is a filter with a single survivor; the stated
  cost (fill twice a day) is never weighed. Give Y a feature that matters (for example a 6 m surface but 6000 kg of load) so that the trade-off is real.
- C8SC-6.2 [14] (d): Tank Q wins on one rule (depth 45 cm vs limit 50 cm), nothing against it. Same fix: add a cost or floor-space limit.
- C8SC-6.5 [1] (d): the filter leaves only quote A; B and C are broken, so the price column carries no weight. (a) and (b) are book retells.
- C8SC-6.5 [15] (d): classify a no-flash-to-ground event; the definition applied. (a) and (c) also single-line book facts.
- C8SC-6.6 [2] (d): "should fishers go to sea on Day 3" has an obvious answer, no cost for staying.
Recall in disguise remaining in changed items
- C8SC-6.5 [13] (5 marks): (a) names, (b) kharif, (e) harm and the "stay away from tall objects" rule are each one line from page 91-92. About 3 of the 5 marks are retrieval labelled Analyse.
- C8SC-6.5 [11] (3 marks): hail in three steps is the book paragraph retold; hail already appears in [2] S2 and [6] 1-d (three times in the concept).
- C8SC-6.6 [14]: (a), (b) (key gives only the "roads blocked" reason), (c) and (e) are recall; (b) accepts only one of several valid reasons for early evacuation (surge and winds are equally valid). Widen the mark point to "any sound reason".
- C8SC-6.2 [15] (b): the 10 N per kg is read off the stem; only (a), (d), (e) need the chapter.
Repeated ideas (still above about twice)
- C8SC-6.5: ground takes the charge opposite to the cloud's lower part appears in [0](b), [2] S1, [5], [13](d), [14] (five times); lightning conductor in [1] and [8].
- C8SC-6.4: land warmer so low pressure over land / sea-land breeze direction in [0], [5], [8], [9] 4-a, [19] (five); balloon-and-straw or punctured tube equalising in [6], [9] 2-c, [7] (three).
- C8SC-6.2: height of column decides pressure in [0], [1], [3], [5], [8], [13], [14], [15] (still the dominant idea).

## LOW
- C8SC-6.4 [11] (b): blowing along the outer side of only one bottle and predicting it rolls outward is Bernoulli applied to a free bottle; real behaviour can differ (Coanda pull towards the jet).
  Safer: a strip of paper held beside the stream, or keep to the two-bottle case.
- C8SC-6.4 [17] (ii): "opening doors and windows lowers the pressure inside the house" is the scope item's idea but is loose physics (it equalises inside and outside). Say "the pressures inside and above come closer".
- C8SC-6.6 [13]: card order P-before-R is the book's order, but R (spin) and P (inflow) could swap; add "follow the book's order".
- C8SC-6.5 [4] (distractor "X, as a smaller charge passes through the air more easily") and similar are plainly weak distractors, not chapter confusions; 6.6 [11] reversal ("making no plans 20 km inland") is also self-evidently wrong and is the longest option.
- C8SC-6.5 [3] (AR, both true and R explains) and 6.3 [6] (AR, both true and R explains) are both easy book lines; the AR slot in 6.3 [6] could be made R-does-not-explain.
- Bloom spread: Analyse 80, Evaluate 25, Apply 14, Create 3 of 122; many Analyse items are plain application. Tags are not wrong, only inflated.
- C8SC-6.6 [15] (c): fixed to a real comparison, but (b) and (d) restate book lines.

## Fill_blank, true_false, figure checks
- fill_blank (4): 6.1 [2] "4"; 6.2 [16] "120" (1500 Pa x 0.08 m2); 6.3 [2] "1002" (100800 Pa = 1008 hPa, minus 6); 6.4 [3] "15000" (500 x 30). Each is application with a single numeric answer; no free-text synonyms. 6.3 [2] depends on 1 mb = 1 hPa which the book states.
- true_false: 6 items; the False ones hinge on a misconception and ask for the correction. No figure items.

## Counts read
122 items: short_answer 44, long_answer 29, mcq 29, multi_statement 6, assertion_reason 6, fill_blank 4, match 4.
multi_statement keys: 1 and 3 only; 2 and 3 only; 1 only; all three; 1 and 2 only; 2 only (three-statement, spread fine).
Assertion-reason: A true R false 1, A false R true 1, both false 1, both true and explains 2, both true and does not explain 1.
Claim_check verdicts: Yes 1, Partly 2, No 3 (improved from 2/2/2 in v2).
Match keys: 1-b 2-d 3-a 4-c; 1-d 2-c 3-b 4-a; 1-d 2-b 3-a 4-c; 1-c 2-d 3-b 4-a (all different; v2's repeated key is gone).
MCQ-style items with options (mcq, multi_statement, AR, match) 45: key is the longest option in 12 (27 percent). Key at o[0] in all 45; 0 duplicated options; 0 position names.
Bloom: Analyse 80, Evaluate 25, Apply 14, Create 3.

## Verdicts per concept
- C8SC-6.1: pass after one fix (HIGH on [15](b)); case study [0] and [14] now have real tension.
- C8SC-6.2: pass (MEDIUM: two decisions with one survivor; column-height repeats).
- C8SC-6.3: pass (sucker case study correct; sea-and-land breeze items repeat).
- C8SC-6.4: pass (fill_blank fixed; tent key fixed).
- C8SC-6.5: pass after fixes at MEDIUM level (recall in [13] and [11]; ground-charge repeats).
- C8SC-6.6: pass (cleaned strongly; [14] recall).

## Chapter verdict
HIGH 1, MEDIUM about 14 (slot templating 1, thin decisions 5, recall 4, repeats 3, plus 1), LOW 7. Both v2 HIGHs are fixed and no new arithmetic or physics error was found
in the 72 changed items. One HIGH remains, in 6.1 [15](b): two rows are equally defensible as "the mistake". Not load-ready until that is fixed (a one-line stem edit); the MEDIUMs may follow after loading if the owner accepts them. Verdict: NOT load-ready, pass after one small fix.
