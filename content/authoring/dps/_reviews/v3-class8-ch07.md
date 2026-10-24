# Review v3: Class 8 Maths ch07 (Proportional Reasoning-1), after one fix pass

File: content/authoring/dps/class8/ch07.json, 128 questions (21, 21, 22, 21, 21, 22). Diffed against the pre-edit copy: 41 changed or new items (7.1: 1, 7.2: 8, 7.3: 10, 7.4: 8, 7.5: 3, 7.6: 5, plus 7.2 and 7.3/7.6 new items counted within). Every changed item was recomputed by hand and in python-style checks (ratios, conversions, bricks and loads costing, washing-powder and visiting-card minimums, alloy costs, Fahrenheit conversions, pump timings). Facts checked against hegp107 p.176 (3.281 ft/m, 10.764 sq ft/sq m, F = 9/5 C + 32, C = 5/9 (F - 32)). Index = zero-based position in the concept list.

Result: no wrong key, no second defensible answer, no arithmetic error in any changed item. Counts: HIGH 0, MEDIUM 3, LOW 6. Verdict: load-ready (after the MEDIUM 1 wording fix, which is a one-sentence stem change; if the owner will not touch it, the item is still defensible).

## v2 status

| v2 finding | Status |
|---|---|
| M1 7.2 "adding the same number" repeated 8 times | Fixed. #5, #7, #13, #19 recast (recipe AR, unequal-scale photo, sugar batch, create-a-situation). Idea now sits in #12, #14d, #17, #20 only. The duplicate "32 years" is gone. |
| M2 7.4 direct-vs-not-direct 5 items | Fixed. #18 is now a price list (visiting cards); #14c is the child's height (needs only the direct-proportion test, no inverse method), #9 is a table test. |
| M3 7.4 mismatched units 6 items | Fixed. #5 S1 is now a wrong-ratio slip, #14 no longer a unit item, #20 tests order of terms. Left: #6, #15 (conversion is real work), #16a, #19. |
| M4 strawman decisions | 7.2 #15 fixed (P's 100 x 75 does not fit 96 wide, Q's 96 x 75 distorts, answer 96 x 72). 7.3 #15 fixed (packet Rs 24 vs two sachets Rs 18 vs limit Rs 20). 7.5 #13 mostly fixed (see MEDIUM 1). 7.6 #2 left as is (optional in v2). |
| M5 procedural 5-markers | Fixed. 7.5 #12 now has a budget plus teacher-condition decision; 7.6 #13 (e) adds a claim to test (9:20 vs "before 9:00"); 7.3 #14 (e) flips the earlier decision. |
| M6 7.6 #14 Delhi dead end | Fixed. Delhi dropped; (a)-(c) feed (d) and (d) converts Shimla. |
| M7 textbook clones | Fixed. Earth-Sun, manure (now compost, new data), saffron (now jaggery), silver/mercury duplicate (7.6 #20 now the mile vs 4 laps), medal ratio all changed. |
| M8 7.1 / 7.5 same impossibility | Fixed. 7.5 #9 is now sharbat (adding water can never give 1 : 2). |
| L1 7.1 #18 | Fixed (135 students, how many have no bed: 27). |
| L2 7.3 Sanskrit-term items | Fixed for #1 (tailor) and #18 (Kiran's order slip). |
| L3 7.3 #0 AR | Reworded; R is now the "same kind as phala" fact, key "both true, R not the explanation" is clean. |
| L4 7.2 #19/#20 named k and equations | Fixed. #19 replaced; #20 uses the parts method only. |
| L5 7.2 #6, 7.3 #6 true/false | Not changed (not in scope of the pass). Still LOW 4 below. |
| L6 three-part case studies | Fixed. 7.3 #16 and 7.4 #17 now have (a)-(d). |
| L7 no `reverse` in 7.2, 7.3, 7.6 | Fixed by adding 7.3 #21 and 7.6 #21 and tagging 7.2 #19 (see MEDIUM 2: the frames now repeat). |

## HIGH
None.

## MEDIUM

1. C8M-7.5 #13 (paint tin), "one 50 mL tube (Rs 40) covers the 40 mL" and "fixing gives 160 + 240 = 400 mL". Only 40 mL of blue is needed, but tubes hold 50 mL and 25 mL. The stem never says she may use part of a tube. If she adds a whole 50 mL tube she gets 170 : 240 = 17 : 24, not 2 : 3, and two 25 mL tubes also add 50 mL. The key silently assumes part-tube use (the Rs 40 and Rs 50 comparison still holds either way, so the verdict is safe, but a careful student can object to "400 mL of the original shade"). Fix: add to the stem "She may use only part of a tube, but must pay for the whole tube."

2. Create/reverse frame repeated: C8M-7.2 #19, C8M-7.3 #21, C8M-7.4 #20, C8M-7.6 #21 (and 7.5 #19) all open "(a) Write a real situation / word problem ... say what each number stands for", then show it, then change/vary. That is 5 of the 6 reversal items on one frame; only 7.1 #11 differs. Fix: keep it in two concepts (7.3 #21 and 7.6 #21 are the best), and recast 7.2 #19 and 7.4 #20 as a worked reversal (given the proportion answer, find the four-number change, or "the answer is 35; write two different proportions that give it").

3. C8M-7.3 #15 (kheer), "A family expects 14 guests" then everything computed for 14 people. The family itself would also eat, so "14 people" versus "14 guests" is ambiguous, and the decision still reads as set up by the Rs 20 rule (two sachets Rs 18 against packet Rs 24). Fix: write "14 people in all, including the family", and optionally make two sachets cost Rs 20 or more so the packet is not the only wrong move.

## LOW

1. C8M-7.4 #15 oil 30 mL and 2 lemons for 8 people is a little small for real lemon rice (about 100 mL of oil is typical). Data only, no key effect. Raise oil to 80 mL (then 80 x 50 / 8 = 500 mL = 0.5 L, and the key text changes).
2. C8M-7.3 #21 step 3 reads "Rs 52.50 (or 52.5 of the unit)" and the answer is a student-chosen context, so "Rs" is only the example. Fix: "52.5 (in the unit of the student's story)".
3. C8M-7.3 #8 stem says "about 1,500 blocks" and asks "About how many" while the key is the exact 10,500. Fine for a scenario, but drop "about" in the stem or keep it only in the question.
4. C8M-7.2 #6 and C8M-7.3 #6 (true/false) are unchanged from v2 LOW 5; 7.3 #6 relies on the swapped-terms rule a : c :: b : d that the book does not state. Optional: swap the statement for one the book teaches.
5. Bloom labels: C8M-7.4 #14 (five short direct/not-direct checks) and C8M-7.3 #14 are "Evaluate" with mostly procedural parts. They now each carry one decision part, so acceptable.
6. C8M-7.3 and C8M-7.6 now hold 22 questions (others 21). Fine if the loader allows it; mention to the loader owner. C8M-7.3 #14 still carries tag `figure` with no figure (the stem describes the walls fully in words, so it is acceptable).

## Item-level checks (all passed)

- 7.1 #18: 135 x 4/5 = 108 beds, 27 without. Distractors 1, 108, 34 are real slips. OK.
- 7.2 #4: 15 : 35 = 3 : 7; 24 : 56 = 3 : 7; the others 1 : 2, 5 : 9, 3 : 8. Unique. #5 A true, R true, explains. #7: factors 1.5 and 2 give 27 x 24; 9 : 8 is narrower than 3 : 2. #9 factors 5/6, 9/10; 2/3, 2/3. #13 30 spoons; 21 spoons gives 14 glasses; 14 : 21 = 20 : 30 = 2 : 3. #15 60 : 45 = 4 : 3, 18 mm, 120 mm, P is 4 : 3 but too wide, Q is 32 : 25, answer 96 x 72. #19 6 : 4 = 15 : 10 = 3 : 2, 15 : 12 = 5 : 4. #20 difference 24 years: 3 : 1 after 4 years (36, 12), 2 : 1 after 16 years (48, 24), 4 : 1 only now.
- 7.3 #0 key holds. #1 33 x 4 / 9 = 14.67 so 14 shirts, 33 - 31.5 = 1.5 m left (15 shirts would need 33.75 m). #8 1,500 / 12 = 125 per m, 84 m gives 10,500. #9 d = 10 1/2 kg, check 21/8 x 4 = 10 1/2. #11 1,330 / 14 = 95, 9.8 x 95 = 931. #14 68 ft, 9,520 bricks, Rs 63,400 vs Rs 65,000, 840 bricks, 10,360 total; 4 loads + 2,360 loose Rs 69,700 vs 5 loads + 360 loose Rs 67,700, so the decision does flip as stated (a sixth load Rs 78,000 is worse). #15 1,050 g, 1,575 mL, 12 people, need 420 g (60 g short), two sachets Rs 18, one sachet is too little, packet Rs 24 over the limit. #16 31.5, 10 h, 36 h x 4.5 = 162, 170 - 162 = 8 short. #18 41 1/7 vs 14; option 3 is the same equation written differently, but its recommendation "then 41 1/7 stands" is wrong for the story, so exactly one defensible option. #21 12 x 35 / 8 = 52.5.
- 7.4 #5 key "2 only" (350, 150, 266: 56, 150, 256 are the right values). #9 only the petrol table has Rs 105 per litre throughout; the hall table has a Rs 1,000 fixed charge. #12 54,750 / 365 = 150, x 73 = 10,950. #14 18 kg, 50 min, 12 m (absurd), 3 GB at the 1 GB rate Rs 57 not 49; child's-height part needs only the direct-proportion test. #15 3.75 kg, 0.1875 L, 12.5 so 13, 4 packets Rs 256. #17 25 : 3 vs 100 : 11, Rs 120/110/100 per kg, 660, 640, 620; brute force over all packet mixes for exactly 6 kg confirms 620 is the minimum. #18 2 : 5, 4 : 9, 1 : 2; 300 cards cheapest 200 + 100 at Rs 700, not Rs 750. #20 250 x 24 = 6 x 1,000 = 6,000, swapped proportion also true.
- 7.5 #9 240 mL syrup and 640 mL water, 1 : 2 needs 480 mL water, add 80 mL syrup. #12 8.4 g and 3.6 g, Rs 8.64, Rs 4,320 (Rs 320 over); 7.2 g and 4.8 g, Rs 7.92, Rs 3,960 (Rs 40 under), 7.2 >= 7. Copper Rs 900/kg and zinc Rs 300/kg are realistic and given as data. #13 120 : 180, then 120 : 240 = 1 : 2, add 40 mL (see MEDIUM 1).
- 7.6 #8 538.2 / 10.764 = 50 sq m exactly, 4 x 50 / 10 = 20 kg, distractors 200, 215.28, 2. #13 12,00,000 mL, 9,600 s, 2 h 40 min, 9:10 am; 900 L takes 7,200 s = 2 h, 7:20 + 2 h = 9:20, 20 minutes past the claim. #14 35, -5, 22.5, 15 degrees C; Shimla and Ooty qualify, Ooty is 2.5 from 20 against 5. #20 1,312.4 ft; 4 laps 5,249.6; mile is 30.4 ft (9.3 m) longer; the mile is given in the stem as data. #21 356 and 381.6, difference 25.6; 180 degrees C = 356 degrees F is a realistic oven setting.
- Options: every changed option item has the key at o[0]; no wrong option equals the key in value. Correct option strictly longest in 2 of 31 option items bank-wide (7.2 and 7.4, one each). No option named by position anywhere. Step marks equal item marks in all 128. Scope: no inverse proportion, no speed formula, no named constant k.

## Template check (counts)

- claim_check verdicts: No x3 (7.1, 7.3, 7.6), Yes x2 (7.2 #8, 7.5 #0), Partly x2 (7.2 #17, 7.4 #8). Good mix.
- true_false: False x3 (7.1, 7.4, 7.5), True x3 (7.2, 7.3, 7.6). Each asks for a reason.
- multi_statement keys: "1 and 2 only", "1 and 3 only", "2 and 3 only", "2 only", "1, 2 and 3", "1 only". All spread, 3 statements each.
- assertion_reason keys: explains x2, does not explain x1, A true R false x2, A false R true x1.
- Slot order: 7.4 and 7.5 and 7.6 still end with the 4 / 4 / 5 / 5 case-study block (positions 12-16), mild. Reversal frame repeats (MEDIUM 2).
- Settings repeated: none found in the changed items beyond the shop-price theme (7.3 #14, 7.4 #17, #18), which differ in the decision logic.

## Verdict per concept

- C8M-7.1: load-ready.
- C8M-7.2: load-ready (MEDIUM 2 on the reversal frame).
- C8M-7.3: load-ready (MEDIUM 2, 3).
- C8M-7.4: load-ready (MEDIUM 2).
- C8M-7.5: load-ready after the one-sentence fix in MEDIUM 1.
- C8M-7.6: load-ready.

Overall: load-ready. Read 128 (41 changed items re-verified in full). HIGH 0, MEDIUM 3, LOW 6.
