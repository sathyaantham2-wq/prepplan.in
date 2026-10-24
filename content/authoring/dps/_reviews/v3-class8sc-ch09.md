# Review v3: class8sc ch09 (SCI8, hecu109), re-review after one fix pass

File: content/authoring/dps/class8sc/ch09.json. 123 questions (9.1 20, 9.2 21, 9.3 20, 9.4 21, 9.5 21, 9.6 20). Diffed against the pre-edit copy by exact question content: 38 items changed or new. All 38 were fully checked (numbers recomputed, facts against hecu109 pages). Mechanical checks over all 123: correct option at o[0], no duplicate options, step marks sum to marks, no option named by position, multi_statement keys spread (1 and 3 only / 2 and 3 only / 1 only / all three / 1 and 2 only / 2 only).

## v2 status
- M1 oxygen as solute (9.1 idx 10, 18): FIXED. Oxygen dropped from the five-mixture list (now sand is (v)); idx 18 asks only about uniformity of dissolved oxygen.
- M2 lake premise (9.3 idx 9): FIXED. Now two saturated beakers at 30 and 60 C with crystals on cooling; no afternoon-oxygen claim.
- M9 strawman case study (9.6 idx 16): FIXED. Recomputed: 2 L x 1.2 = 2.4 g; 2 x 3.6 = 7.2 g, so 4.8 g pushed in; 4.2 g/L limit gives 8.4 g (6.0 g more). All correct, step marks 4.
- M7 easy-in-disguise: mostly FIXED. Reworked with data or a wrong record to judge: 9.1 idx 13, 15; 9.2 idx 0; 9.3 idx 5; 9.4 idx 10, 15, 17; 9.5 idx 1, 8, 20; 9.6 idx 18. Residual see M-A.
- M3 to M6, M8 repetition: PARTLY fixed (see M-A, M-B).
- L1 salt/sugar typo: gone (item rewritten). L2 (air premise now stated), L3 (16(d) now a justify-the-test decision), L4 (recipe fixed at 20 mL + 80 mL, answer 81 mL): fixed. L5 (spoon counts now 6/7): fixed.

## HIGH

H1. C8SC-9.3 idx 14 (changed): "30 g at 20 C, 45 g at 40 C, 45 g at 60 C and 61 g at 80 C. (a) Which reading is most likely a recording error?" Key: the 60 C reading, "the other readings rise steadily (by about 15 g every 20 C)". Two defensible answers. If 60 C is the error the true value is about 53 g; but if the 40 C reading is the error, the remaining readings 30, 45, 61 at 20, 60, 80 C do not rise "15 g every 20 C" either, and a student can equally say the 40 C value should be near 38. The key's own justification is also false: 45 to 61 over 40 C is 16 g, not 15 g per 20 C. Nothing in the data singles out the 60 C reading. Smallest fix: make one reading fall, for example "30 g, 45 g, 40 g, 61 g" (20, 40, 60, 80 C); then 60 C is the only value that breaks the rise, and (b) is "between 45 g and 61 g, about 53 g". Reword the reason to "the others rise with temperature but this one falls".

## MEDIUM

M-A. C8SC-9.1 repetition remains: naming the solute/solvent by the two rules is the task of idx 0, 1, 6, 10, 16(b, d), 17 (six to seven items; the v2 target was two). Items 3, 11, 14, 15, 18, 19 now cover uniformity, which is good, but idx 10, 16 and 17 are three long answers on the same pair of rules. Fix: make idx 16 (b) or idx 17 (b)/(d) a different task, or replace idx 1 and 6 with a gas-in-liquid or "dissolve" item.

M-B. Residual repetition elsewhere (keyword counts, approximate): 9.3 dissolved oxygen/warm water in idx 6, 8, 11, 16, 18, 19 (down from 10, still six); 9.5 tare in idx 0, 3, 9, 16; 9.6 heating-lowers-density runs through about 8 items and "ice floats" through idx 8 to 12, 14, 17. Not wrong, but over the limit. Fix: change one item each in 9.3 and 9.6 to a different idea (second solid-solubility table in 9.3; pressure on a solid or liquid in 9.6).

## LOW

L-a. C8SC-9.2 idx 5 (fill_blank): answer "unsaturated" contains "saturated"; a substring matcher would accept a wrong answer "saturated" as a hit and an answer-matcher reading "saturated" mismatches. Also a one-step comparison (9 g under 14 g). Fix: ask for "how many more grams will dissolve" (5) or set a whole-word match.
L-b. C8SC-9.2 idx 17 (mcq) "solubility of salt is 36 g, what is missing": the book's own definition (fixed water and temperature); easy-in-disguise, one line recall. Fix: give two quoted statements and ask which one is complete.
L-c. C8SC-9.1 idx 18: part (a) is still the book's sentence (dissolved oxygen is uniform); part (b) is trivial restatement. Fix: add a number (two jars, 5 mg/L in one, ask which sample was not stirred).
L-d. C8SC-9.1 idx 8 and idx 5: the distractors are weak ("only on cold days when the gases stop moving"); idx 5 R ("oxygen dissolves only to a small extent") is true in fact but the chapter's page range does not state it in words. Acceptable.
L-e. C8SC-9.6 idx 16 (d): the choice among 3.6, 4.2 and 4.8 is settled by the stem ("firmer rolls more easily", limit 4.2); the chapter adds nothing to the decision, only to parts (c). Better than the old strawman but still a boundary pick. Fix: add that firmer tubes puncture more easily so the student weighs two effects.
L-f. C8SC-9.6 idx 5: "sealed plastic bottle completely full of water" squeezed with a large force; a plastic bottle deforms. The key (air, then water, then steel) follows the book (liquids nearly incompressible, solids even less, p. 15 of the pages), so it stands.

Facts checked clean: 9.4 idx 7 (1.2, 0.8, 1.03 g/mL; 800 kg/m3; R differs 0.03), 9.4 idx 17 (34/4 = 8.5, brass), 9.5 idx 5 (9.6/8 = 1.2), idx 9 (3 cm3, 8.4 g/cm3, 25.2/43 = 0.59), idx 15 (5x2x1.2 = 12 cm3, 1.5 g/cm3), idx 20 (95 + 12 = 107 over 100), idx 12 (27 mL), idx 8 (digital balances measure weight: book p. says so), 9.3 idx 5 (37.3 - 36.0 = 1.3), 9.3 idx 7 match unique (1-b, 2-a, 3-c, 4-d), 9.1 idx 10, 16, 17 (81 mL), 9.2 idx 7, 13 and 19.

## Per-concept verdict
- C8SC-9.1: pass after fixes (M-A, L-c).
- C8SC-9.2: pass after fixes (L-a, L-b).
- C8SC-9.3: NOT load-ready until H1 is fixed.
- C8SC-9.4: pass.
- C8SC-9.5: pass.
- C8SC-9.6: pass (L-e optional).

## Counts
HIGH 1, MEDIUM 2, LOW 6. Changed items read: 38 of 38. Template: not templated (varied settings and tasks; type counts identical per concept as the format requires).

## Verdict
Not load-ready: fix H1 (9.3 idx 14 has a second defensible answer and a false justification). The MEDIUMs are residual repetition and can be shipped as is if the owner accepts them. After H1 is corrected the chapter is load-ready.
