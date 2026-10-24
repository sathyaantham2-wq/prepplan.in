# Review v4: class6sc ch05 (SCI6, Measurement of Length and Motion, fecu105)

Whole file read after the second fix pass: 123 questions (20, 20, 20, 21, 20, 22), none sampled. Every key and every case-study part recomputed by hand and in python (scratch: scratchpad/v4-class6sc-ch05/show.py). Facts checked against content/extracted/fecu105/pages/. "idx" = 0-based position in the current file. Structure checks (python): step marks sum to marks in every item with steps (0 mismatches); no duplicate options; no option named by position; no "option (b)" text.

## 1. Status of v3

- v3 HIGH (5.4 idx 10 and idx 15, readings of 1.6 m / 2.3 m / 2.4 m on a 1 m scale): FIXED. idx 10 now uses "a 3 m measuring tape" for both readings (1.6 m straight gap, 2.3 m thread; 0.7 m short; an arc of chord 1.6 m and length 2.3 m is geometrically possible). idx 15 now lays the thread along the metre scale twice and reads 40 cm (2.4 m); the arithmetic (8.7 m, Rs 700 / 1.3 m spare vs Rs 690 / 0.3 m spare) is right.
- v3 M1 (5.4 idx 15 instrument): FIXED with the above.
- v3 M2 (5.5 rest/motion repetition, ten items): FIXED for rest/motion. Rest/motion now appears in three items only (idx 2 merry-go-round, idx 13(d), idx 16 escalator). A different repetition took its place, see M3.
- v3 5.1 idx 11 and similar one-line items: partly still there, see LOW list.

## 2. Key and arithmetic check

All 123 keys agree with my independent answer. No wrong key and no second defensible answer in any MCQ, fill_blank, match, assertion_reason or multi_statement. Recomputed examples: 5.1 idx 8 (15, 12, 11.25, 10; 0.25 x 16 = 4 cm), idx 18 (1.2 cm); 5.2 idx 4 (416 mm, 39 mm), idx 9 (100 cm, 4 cm, 10.4 mm), idx 19 (18 km); 5.3 idx 9 (41 cm), idx 18 (2.75 / 3.00 / 2.87 m, Charu wrongly qualifies), idx 19 (320/15 = 21.3, so 22 placements); 5.4 idx 14 (22.1 cm, 46.2 cm, 50 cm piece, 3.8 cm over), idx 20 (1350 m); 5.5 idx 8 (all eight distances), idx 19 (15.5 m both ways); 5.6 idx 4 (Rs 500 over / under, train within the Rs 600 allowance), idx 2 (answer 2).
Template counts: claim_check verdicts 12 items = 5 No, 5 Partly, 2 Yes (varied). true_false 7 = 5 False, 2 True (5.3 idx 5, 5.6 idx 8, both with real content). multi_statement keys: S1 only x2, S1+3, S2+3, S1+2, S1 only: spread fine. Correct option is the longest in 12 of 45 option items (27%, near chance). Slot order differs between concepts. Correct option at o[0] everywhere.
Scope: no item breaches scope_out (no speed, displacement as a concept, time period measurement, vernier, other units, inch conversion, forces). Items using inch/foot are not conversions.

## 3. Findings

### HIGH
None.

### MEDIUM

M1. C6SC-5.3 idx 7 (Ayesha, raised markings), part (b): "which one does not apply to her" - the key's own text calls the answer "an accepted extension", i.e. the book says only that raised-marking scales are read by touch (page 84, "How do visually challenged students measure lengths?"). That the eye-position rule "does not apply" is an inference, and a second reading (she still needs to touch the mark squarely at the end, so the same care applies) is defensible. Fix: drop (b) or ask "which precaution still applies to her, and why" with the placement precaution as the one answer; remove the "accepted extension" aside.

M2. C6SC-5.3 idx 1 (a): "His helper uses a metre scale and gets 205 cm" - a metre scale reads at most 100 cm in one placement; same kind of impossibility v3 caught in 5.4. Fix: "uses a 3 m measuring tape" or "a metre scale laid along it twice".

M3. C6SC-5.5 idx 1, 3, 7, 8, 10, 15, 17, 18, 19 (9 of 20 items): the idea "subtract two positions on one straight line from one reference point" recurs, and idx 1, 7 and 18 are bare one-step subtractions (250 m, 4 m, 1.5 km/1.5 km) with little thinking. Rest/motion is now well covered, but the concept leans on one calculation. Fix: replace idx 1 and idx 7 with items on a different 5.5 idea (what makes a poor reference point, a stone read after a stop and return, choosing the reference point that puts a named object at rest) and make idx 18 (b) the point (halfway shop is at the house) a decision rather than "what do you notice".

M4. C6SC-5.6 idx 4, 5, 13, 18, 20 (and 1, 21 in part): the same park scene (swing, merry-go-round, slide, see-saw, giant wheel) and "linear is not periodic" in five items. Fix: move idx 13 and idx 5 to other settings (kitchen, sports ground, factory) or merge; keep idx 20 as the park classification item.

M5. C6SC-5.5 idx 19 (d): key reads "he will look at 3 m above the ground, 14 m away from it" - "it" is ambiguous (leak or ground). The question asks "How far from the leak will he look?" Fix key: "He looks 3 m above the ground, which is 14 m below the real leak (17 m up)"; step text "looks 14 m below the leak".

### LOW

L1. C6SC-5.5 idx 0: answer 38 equals the 38 km in the stem, so a guess from the stem scores; and "travels 38 km ... then 9 km more ... towards Jaipur" leaves the first leg's direction to the word "more". Fix: change to 36 km (answer 40) and say "travelling towards Jaipur" at the start.

L2. C6SC-5.5 idx 4: the direction of the stalls from the cart (away from the gate) is not stated; add "farther along the path from the gate".

L3. C6SC-5.1 idx 0 (d): "wait to measure with a tape" is odd, since a tape could be used today; say the tape is not available until after the event. Also the key says the foot-based 8 m is "off by only a little" without data; harmless.

L4. C6SC-5.2 idx 15 (d): the key hedges ("Waiting is acceptable only if ..."), so two answers are tolerated; fine for a justified decision but state the one preferred answer without the hedge.

L5. C6SC-5.3 idx 4 (d) and idx 18 (d), C6SC-5.5 idx 3 (d), 5.2 idx 4 (d): decision parts where the stem's numbers make one side clearly losing (30 min vs 20 min; hour late final; 25 min vs 20 min start; storybooks used monthly). Real decisions but not close; acceptable, noted for the author.

L6. Recall in disguise (one-line book facts): 5.1 idx 5 (Harappan strip), idx 11 (Length = 42 needs a unit), idx 17 (angula still used, p.82); 5.2 idx 2 (unit-writing rules); 5.5 idx 5; 5.6 idx 17 (orange vs pendulum definitions), idx 16 (wiper), idx 21 (lift not periodic). Each has some twist or scenario, so not failing, but the bank allows no easy items; strengthen idx 11, 17 and 5.6 idx 17 with a second step or numbers if time allows.

L7. C6SC-5.6 idx 11 (sewing needle) and idx 16 (wiper): not in the book (the book's up-and-down example is the metal strip, p.94); consistent with the book's definition, and key "best described" is defensible. Wiper tip moves on an arc, so a stronger distractor than usual; no change needed.

L8. C6SC-5.5 idx 19 (vertical heights above/below a reference point) and idx 10 (sides of the reference point) go slightly beyond the book's road and bus examples; consistent with the definition of a reference point, no change required.

L9. C6SC-5.4 idx 20 (bicycle clicks) mirrors the end-of-chapter question's idea but with new data and a strong (d)/(e); fine.

## 4. Verdicts per concept

- C6SC-5.1: no HIGH; 0 MEDIUM; LOW L3, L5, L6. Pass.
- C6SC-5.2: no HIGH; 0 MEDIUM; LOW L4, L5, L6. Pass.
- C6SC-5.3: no HIGH; MEDIUM M1, M2; LOW L5. Pass after fixes (one-line edits).
- C6SC-5.4: no HIGH; 0 MEDIUM; LOW L9. Pass (v3 HIGH fixed).
- C6SC-5.5: no HIGH; MEDIUM M3, M5; LOW L1, L2, L5, L8. Pass after fixes.
- C6SC-5.6: no HIGH; MEDIUM M4; LOW L6, L7. Pass.

Counts read: 123 questions. HIGH 0. MEDIUM 5. LOW 9. Not templated (verdict mix, MS keys, option length and slot order all varied); two topical clusters noted in M3 and M4.

Verdict: load-ready (no wrong key, no second answer, no impossible data; M1, M2 and M5 are one-line edits worth making before load, M3 and M4 are polish).
