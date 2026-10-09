# Review v2: DPS Class 7 Maths, Part II ch 4 "Another Peek Beyond the Point" (gegp204)

File: content/authoring/dps/class7/p2ch04.json (second review, after the no-easy-questions rework). Compared with content/authoring/dps-v1-backup-2026-10-08/class7/p2ch04.json and the earlier review class7-p2ch04.md. Every item read, none sampled; all numbers recomputed with Python Decimal/integers. Findings are appended concept by concept; the summary, counts and per-concept verdicts are at the end.

Headline fact: 149 items, 119 are text-identical (same stem) to the v1 backup. Only 30 stems changed (4.1: 5, 4.2: 4, 4.3: 5, 4.4: 4, 4.5: 4, 4.6: 4, 4.7: 4). The slot order of the old file is also unchanged except where those 30 were swapped in.

## Working notes per concept (item numbers are 0-based positions in the concept's list)

### C7M-4.1 (21 items; 5 new: #5, #6, #14, #16, #19)
Keys: all 21 recomputed, all correct (0.346/270; 0.009 and 0.225; 0.0059; 0.045 m and 45 mm; 38; 0.365/0.4078/5.09; NOT-equal = 372/100; 12.345 L, 0.12345 L, 123.45 mL, 1.2345 L; case study 7.85 kg, 0.785, 78.5 g, tins 1200 vs pouches 1100; paper case 0.095 mm, 0.95 cm, 95 cm, A 4550 vs B 4500; 0.0064/0.000064; 5.206; 3.9/100 = 0.039; 6107; 0.045 kg; 0.9 kg; match 1-b 2-c 3-a 4-d; Rohan claim is correct, verdict Yes). No HIGH.
Easy in disguise (answer is the book's one-line rule applied once, whatever the label):
- #1 "Find (a) 34.6 / 100 and (b) 0.27 x 1000" (Apply, 2 marks): two rule look-ups, unchanged from v1.
- #3 multi_statement "Dividing a number by 1000 always moves its decimal point..." (Understand): rule recall; statement 2 (37/1000 = 0.37) is the only thing to catch. Unchanged.
- #4 assertion_reason "48213 / 1000 = 48.213 ... 1000 has three zeroes" (Understand): both true, R explains; a restatement of the book's rule. Unchanged.
- #6 NEW mcq "59 m wire into 10000 pieces ... 59/10000 m as a decimal": one step (four zeroes, four places). Relabelled scenario, still one lookup.
- #7 "Convert 4.5 cm into metres ... then millimetres": two unit shifts, unchanged.
- #8 "Prakash writes 0.38 x 100 = 0.0038. Name his mistake": direction-of-shift lookup, unchanged.
- #9 (5 marks, Hardest) "Write each fraction as a sum of tenths, hundredths ... 365/1000, 4078/10000, 509/100": the book's own expansion table done three times; a 5-mark item whose thinking is one-line recall repeated. Step marks 1+2+2 reward copying the pattern. Unchanged.
- #10 "Which is NOT equal to 0.372": three conversions, no more; acceptable as the hard mcq of the concept but still one rule.
- #11 (5 marks, Hardest) tank 12345 mL: four separate single shifts (a) /1000 (b) /100 (c) x1000 (d) /10; part (b) gets 2 marks for one division. Unchanged.
- #13 "6/1000 + 4/10000 as a decimal, then divide by 100": two lookups, unchanged.
- #14 NEW fill_blank "5206 kg ... load is ___ tonnes": single division by 1000; application-level in name only. The answer 5.206 is machine-matchable, so type is fine, but the thinking is one step.
- #15 mcq Anuja ribbon 3.9 m / 100: the book's Example 6 itself, unchanged numbers (3.9, 100, 0.039).
- #16 NEW mcq "100 note-pads at 61.07 each ... total": one multiplication by 100.
- #17 mcq "45 g of saffron ... in kilograms": one step.
- #19 NEW match 0.417 x 1000, 417 / 1000, 0.61 / 100, 6.1 x 100: four rule look-ups, no trap beyond the shift direction.
Total easy-in-disguise in 4.1: 14 of 21 (#1, 3, 4, 6, 7, 8, 9, 11, 13, 14, 15, 16, 17, 19). Genuinely thinking items: #0 case study, #2 reverse (three divisions giving 0.045), #5 (needs part (a) to feed (b)), #10, #12 case study (A vs B, with a considered reason), #18 (four conversions plus a check, marginal), #20 claim-check.

MEDIUM (4.1)
- M1 #14 fill_blank is a unit-conversion look-up, not "a computed value, a reasoned term, a rule applied" at application level in the spirit of section 12. Fix: make the blank need two steps, e.g. "A jar of 0.8 kg is shared equally among 1000 pills; each pill weighs ___ g" (0.8 g) or "250 mL is poured into 10000 drops; each drop holds ___ mL" (0.025).
- M2 #19 NEW match is a pure drill. Fix: include products that look alike (0.0417 x 100, 41.7 / 1000, 4.17 x 10) so the student must count zeroes and direction, or match "wrong move" descriptions to the correct values.
- M3 #3/#4 (Understand label) should be re-cut; the loader tolerates 30% Understand but these are not application. Fix: use a numeric multi_statement such as "A: 0.5 / 1000 = 0.0005, B: 7.2 x 1000 = 7200, C: 120 / 100 = 1.2" and an assertion_reason whose A is a computation with a zero to be filled, whose R is the (true but non-explaining) statement "the decimal point never moves when you divide by 1".
LOW (4.1)
- L1 #15 distractor "Each piece is 39 m, since 39/10 is divided by 100" and "0.0039 m, since 3.9 has two digits" are not real confusions; the real confusions are 0.39 (divided by 10), 0.39 stays. Fix: use 0.39 m, 0.039 m, 0.0039 m, 3.9 / 100 = 3.09 m.
- L2 #2 reverse item has three correct families; answer is open ("one possible answer") which is fine.

### C7M-4.2 (21 items; 4 new: #0, #10, #11, #12)
Keys: all 21 recomputed, all correct (match 1-c 2-d 3-b 4-a; 105.625 both ways; Rs 41; 8.88 and 0.00888; 105 km, 120 km, Rs 1156.25; 5.6 and 0.54; 36 sq m, Rs 3228 vs 3230; 1.45, 8.7, 34.8 km, 8700 m; 6.3 x 2.15 has 3 places; Meena's claim is true; 0.17408 kg; 2.5 x 0.4 = 1, so False; 10.368; 6.8 km; 9.4 m and Rs 1692; 7.2 cm; multi_statement S1 true, S2 true, S3 false so "1 and 2 only"; Rs 750/1000/250; 127.4; 0.0684). No HIGH. Assertion-reason #18: A true, R true, R does not explain A: key correct.
Easy in disguise (one rule applied once, whatever the label):
- #0 NEW match "1.2 x 0.5, 0.12 x 0.05, 12 x 0.5, 1.2 x 0.05": four point-placement drills; no trap beyond counting places.
- #3 "Given 37 x 24 = 888, write 3.7 x 2.4 and 0.37 x 0.024": the book's "known product" exercise (596 x 248) with new digits; two look-ups. (Also overlaps C7M-4.3's "use a known product" skill.)
- #5 "Find 8 x 0.7 and 6 x 9 hundredths": book Figure-it-out 1 pattern, one step each.
- #8 (Understand) "Which product has exactly three digits after the decimal point": add the places, one rule. Unchanged.
- #10 NEW mcq Kiran, 512 x 34 = 17408, place the point: 3 + 2 = 5 places, one step.
- #12 NEW mcq garden 384 x 27 = 10368: 2 + 1 = 3 places, one step. #10 and #12 are the same item twice (given counting product, place the point).
- #16 (Understand) multi_statement: S1 is the places-add rule, S3 the negation of it. Unchanged.
Borderline (arithmetic chains, no concept thinking; each is at least two lines of working, so counted separately and not in the easy total): #7 (5 marks, Hardest: four sequential multiplications, 2 of the 5 marks for 8.7 km = 8700 m), #13, #14, #15, #17.
Total easy-in-disguise in 4.2: 7 (#0, 3, 5, 8, 10, 12, 16), plus 5 borderline.
Not easy: #1 (explain dropping zeroes), #2, #4, #6, #9, #11 (good true_false), #18, #19, #20.

MEDIUM (4.2)
- M1 #4 case-study (d) is forced: Bus A reaches only 105 km of 110 km, so "no fuel stop" decides it; part (c) (cost of a full tank) is never used in (d). Fix: remove (c) or make (d) a real trade-off (e.g. Bus B hire costs more per km; is a 5 km refuel stop on A cheaper than hiring B?).
- M2 #10 and #12 duplicate each other and #3; replace one with an item where the student must decide the number of places from the factors without being handed the product (for example "0.045 x 0.8: how many digits after the point, and is the product greater or smaller than 0.045").
- M3 #0 match: add distractor values with the same digits and wrong point (0.06, 0.6, 6, 0.006 are the same digits as the answers, which is good) but all four rows are single-rule; consider matching a product to the number of places it will have plus a size statement.
LOW (4.2)
- L1 #11 true_false answer text contains an embedded newline ("False. ... decimal digits.\nThe correct product is ..."); harmless but keep it one line so the auto-marker's "begins with False" test is unambiguous.
- L2 #10 wording "uses 0.34 of a 0.512 kg bag" reads like a fraction of the bag; say "uses 0.34 times 0.512 kg" or "a recipe needs 0.34 kg per portion and 0.512 portions".

### C7M-4.3 (21 items; 5 new: #6, #7, #12, #15, #16)
Keys: all 21 recomputed, all correct (0.6/3.6; 3.6, 0.036, 3.6, 0.036; 35.77; A true R false; board Rs 146, frame Rs 1.46, 36 frames cost Rs 52.56, Rs 1.44 left, 20 frames leave Rs 24.8; 0.195 kg; 1.2 x 0.9 = 1.08 is between 0.9 and 1.2; S1 false S2 true S3 true = "2 and 3 only"; 0.36 < 0.6; only 3 x 0.4 = 1.2 is not below 1 (0.72, 0.3, 0.9025); 9.9 and 0.0099; 0.9 x 250 = 225 so claim is right; Rs 800, 680, 700, break-even Rs 666.67; 0.054; 0.3 and 1.5 x 0.8 = 1.2; 29.4 and 0.0294; match 1-a 2-b 3-c 4-d; 4.2 and 0.0042; sort 0.83 < 1.577 < 1.9 < 46.812 < 56.4 < 107.16). No HIGH.
Easy in disguise:
- #3 (Understand) "Without multiplying, greater or less than 36.5: 36.5 x 0.98": the book's situation table read once.
- #4 assertion_reason 1.5 x 4 = 6 / "always greater": rule recall with an absolute-word R.
- #6 NEW mcq 0.65 kg x 0.3: one multiplication, three places.
- #7 NEW (Analyse) mcq 1.2 x 0.9 "less than 1.2 and greater than 0.9": the book's Situation 3 row restated; the label Analyse is generous.
- #8 (Understand) multi_statement: the three situations of the book's table; S1 is the "always greater" misconception. Recall.
- #9 rangoli 0.6: a single comparison 0.36 < 0.6.
- #10 "Which product is NOT less than 1": four mental products.
- #11 Mehul 0.8 kg at Rs 250: Situation 3 once.
- #12 NEW, #17, #18 and #15 NEW (fill_blank): the same "given a counting product, place the point" move four times (plus #1 in 5 marks) and 4.2 #3 also asks it. See M1.
- #13 claim-check: the claim is the rule itself and is correct, the check is 0.9 x 250.
Total easy-in-disguise in 4.3: 13 of 21 (#3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 15, 17, 18). Borderline: #1 (5 marks, drill plus a read-off).
Genuinely thinking: #0 reverse, #2 show-impossible, #5 and #14 case studies (#14 has a real break-even), #16, #19 (see M3), #20 sorting.

MEDIUM (4.3)
- M1 Repeated idea: "given a product of counting numbers, write the product with the point moved" is asked in #1, #12, #15, #17, #18 of this concept (five items) and in 4.2 #3. It is also the sole skill of the fill_blank #15. Fix: keep #1 and #18; replace #12, #15, #17 with items that use a known product to find a quotient-free "related product" in context, or make #15 fill_blank something like "0.9 x ___ = 0.0063 when 9 x 7 = 63" (answer 0.007), a reverse use of a known product.
- M2 #5 case-study (d): "Either is acceptable with a reason" (spend to the limit or keep a reserve) is not a decision with a defensible best answer; a student gets the mark with either choice. It is also physically odd (36 frames beside a 2.5 m x 1.6 m board). Fix: give a cost for a fixed number of frames and ask whether Rs 200 is enough for the board plus 30 frames (needs 146 + 43.80 = 189.80, yes) and what is left.
- M3 #19 (a) says "Without multiplying" but the key's reason ("0.6 is close to 1 and 7 is large") is not a chapter rule; the chapter rule only puts 7 x 0.6 between 0.6 and 7, which does not decide "< 1". Fix: drop "without multiplying" for (a), or key the reason as "0.6 > 1/7, so 7 x 0.6 > 1" which is arithmetic, or change (a) to 7 x 0.06.
LOW (4.3)
- L1 #7 and #3 both end in "between"/"less than" statements the book states in a table; #7 Analyse label should be Apply or the item should add a decision (e.g. compare the area with the longer side and say what happens if 0.9 becomes 1.1).
- L2 #11 option distractors are fine; the bill-in-rupees-versus-0.8 unit mix noted in the earlier review is fixed.

### C7M-4.4 (21 items; 4 new: #0, #3, #11, #13)
Keys: all 21 recomputed, all correct (5.4 L; 0.0385; 56.625 with every remainder in #2; 0.354/6 = 0.059 so True; 4.625; 0.45/10 = 0.045 is the odd one; 0.8 m; 1.325; 0.925; 1347/4 = 336.75 and 1348/4 = 337 with R explaining A; 0.175, 0.0175; match 1-a 2-b 3-c 4-d; 0.45 kg, 18 laddus, 0.4 kg, 16 laddus, 7.65 kg, 0.45 kg extra; 2.375; Rs 124.86, 104.05, 20.81, Rs 3150 vs 3121.50; 0.625 L = 625 mL; 0.75 m; S1 true S2 false (0.014) S3 false (0.0385) = "1 only"; 3.15, 0.63, 630 g, 31.5; 5.875; 0.9375). No HIGH.
Easy in disguise:
- #0 NEW mcq 27 L into 5 cans: one division.
- #3 NEW true_false "0.354 / 6 = 0.059" keyed True: a plain verification with no misconception (see M2).
- #4 "Write 37/8 as a decimal by first finding an equivalent fraction with denominator 1000": the book's method in Example 7 (29/4) with other numbers; one procedure, two marks.
- #9 (Understand) assertion_reason 1347 / 4 vs 1348 / 4: reads the book's regrouping remark back.
- #10 "(a) 0.7 / 4 (b) 0.07 / 4": two direct long divisions.
- #11 NEW match 6/8, 3/8, 0.6/8, 7.5/5: four direct divisions (6/8 repeats #16).
- #13 NEW mcq "Rekha gets the digits 2, 3, 7, 5 in order. The quotient is": the digits are handed over; only the point's place is tested (rule: point after the ones).
- #15 and #16 (lassi 5/8 and rope 6/8, each with a unit conversion), #19 (47/8), #20 (7.5/8): four word-problem divisions by 8, each a straight application.
Total easy-in-disguise in 4.4: 11 (#0, 3, 4, 9, 10, 11, 13, 15, 16, 19, 20). Borderline: #2 (5 marks, the book's Example 9 steps re-run on 453/8; a faithful reproduction of a taught procedure), #5, #17, #18 (four mechanical chained divisions, 5 marks).
Genuinely thinking: #1 (digits the same, point differs), #6 story, #7, #8, #12 (a real decision with a shortfall), #14.

MEDIUM (4.4)
- M1 Repeated idea / divisor: "divide by 8" is the divisor in #2, #4, #8, #11, #15, #16, #19, #20, five of them with a unit conversion tail. 6/8 appears twice (#11, #16). Fix: change #16 to a divide-by-6 or by-12 situation with a remainder to regroup twice (e.g. 7 m cut into 8 or 9.1 / 14), and make #19/#20 one item.
- M2 #3 true_false: the verdict is True and the "misconception" is nothing; the student can just divide. The spec asks for a real chapter misconception, and the chapter's strongest one is the digits-same / point-different slip (already in #1 claim-check). Fix: make it a False item with the slip, e.g. "True or False: 5.6 / 8 = 7, because 56 / 8 = 7" (False, 0.7), keeping verdict mix (see chapter totals).
- M3 #14 case study (d): "Either choice is acceptable if the reason uses these figures" so it is not a decision with a best answer; part (c) is a subtraction of two earlier answers. Fix: give a constraint that forces a trade-off, e.g. the bus operator wants the full Rs 3121.50 paid in notes of Rs 5 or more and the class fund may not be used; then Rs 105 x 30 = 3150 collects Rs 28.50 more and the student must say what to do with it.
LOW (4.4)
- L1 #3 answer has an embedded newline after the justification ("... quotient is 0.059.\nChecking: ..."); keep to one line.
- L2 #2 prompt "Divide 453 (4 hundreds, 5 tens and 3 ones)" repeats the dividend as words; fine, but the item copies the book's Example 9 method step for step (textbook-verbatim procedure). Fix: use 1536 / 12 -> not scope-safe; better ask a "find the step where the point enters and why" version.

### C7M-4.5 (22 items; 4 new: #2, #3, #4, #21)
Keys: all 22 recomputed, all correct (30; 40/100/125/2500; 45 / 0.9 = 50; 38.64 / 1.38 = 28; 7.5 / 0.05 = 150; A false R true; 18.5 km/L and 16 L; 8 dupattas, 22 blouse pieces with 0.4 m left, Rs 5120 vs 5280; multi_statement S1 false (4.9 vs 49), S2 true, S3 false (3.51 / 0.045 = 78) = "2 only"; 30; only 7.35 / 1.5 (= 4.9) is not 49; 75 km/h; 75, 60, 2 h, 1.4 h, margins 0.6/0.7 h; 29, 14, 0.29, 2900, 0.14; 19.775; 15; match 1-a 2-b 3-c 4-d; claim No; 6.5; 84 and 840; 36 packets and Rs 522). No HIGH.
Easy in disguise:
- #0 mcq 12 m cloth / 0.4 m: one rule (x10); and #9 asks the same 12 / 0.4 = 30 again (show-impossible with the same numbers, same scenario). See M1.
- #3 NEW mcq 38.64 / 1.38: one rule (x100), then 3864 / 138.
- #4 NEW fill_blank 7.5 L / 0.05 L: same single step; the answer 150 is machine-matchable but the thinking is one conversion.
- #5 (Analyse) assertion_reason: A is the book's "divisor below 1" rule negated, R is a single computation; A false R true is the easy keying.
- #8 (Understand) multi_statement: S1 is "multiply only the divisor", S2 the rule, S3 a division; recall.
- #11 mcq 187.5 / 2.5 (the book's Example 12 type), one division.
- #13 (5 marks, Hardest) "Given 29 x 14 = 406, find (a)-(e)": five separate rule applications at 1 mark each; five marks for look-ups.
- #15 "Rewrite 31.64 / 1.6 as a division by a counting number; find the quotient": the book's Example 13 procedure.
- #17 match using 648 / 24 = 27: four rule applications.
- #19 "9 3/4 / 1 1/2 using decimals": the book's Sridharacharya exercise with changed numbers.
- #20 "42 / 0.5 and 42 / 0.05": two rule applications.
- #21 NEW "4.68 kg into packets of 0.13 kg ... then Rs 14.50": the book's 4.68 / 0.13 example; the money part is one multiplication.
Total easy-in-disguise in 4.5: 12 (#0, 3, 4, 5, 8, 11, 13, 15, 17, 19, 20, 21). Borderline: #1 (rule restated), #6, #9, #10, #16, #18.
Genuinely thinking: #2 NEW (Rahul: clue that exposes the error, good), #7 and #12 (trade-offs), #14 reverse.

MEDIUM (4.5)
- M1 #0 and #9 are the same fact (12 m / 0.4 m = 30 pieces) in the same setting. Fix: change #9 to a different shortfall claim such as "a 7.5 L can fills 15 bottles of 0.05 L; show this cannot be right" (150).
- M2 #7 and #12 case-study (d) still say "Either choice is acceptable", so the decision cannot be wrong. #7 is a real trade-off (Rs 160 more against 0.4 m wasted) and a good model; #12 should state which trip priority is binding (e.g. the budget has no room for the toll) so one road wins. Fix #12 (d): add "the trip budget has no money left for tolls" and key the hill road with the 0.1 h margin as the risk to mention.
- M3 #13 five 1-mark look-ups for 5 marks (Hardest). Fix: keep two of the five and add (f) "which of (a)-(e) is greater than the dividend and why" with 2 marks.
- M4 #4 fill_blank is single-step. Fix: "A recipe needs 0.35 kg of dough per roti and 14.7 kg of dough is available; after ___ rotis the dough is used up" (42), or require two-stage (grams to litres first).
LOW (4.5)
- L1 #12 converts 2 h 30 min and 2 h 15 min to decimal hours; correct, but the conversion 15 min = 0.25 h is a fraction fact not taught in this chapter; the stem could give "2.5 hours" and "2.25 hours" to keep the item on the chapter's skill.
- L2 #2 option rationale: the distractor "4.5, since 0.9 means nine tenths of 45" is a nice real confusion; keep.

### C7M-4.6 (21 items; 4 new: #2, #7, #10, #14)
Keys: all 21 recomputed with an integer long-division routine, all correct (1/6 = 0.1666 with remainder 4 each time; 3/7 = 0.428571 with remainders 2,6,4,5,1,3 and the 20th digit 2; 2/7 = 0.28571428 with remainders 6,4,5,1,3,2,6,4; 100/11 = 9.0909 with remainders 1,10 alternating; 13/8 ends; 10/9 = 1.1111; match 1-b 2-a 3-c 4-d; S1 false, S2 false, S3 true = "3 only"; 1/12 = 0.08333 with the remainder 4 repeating, so False; Rs 0.01 left in 10/3; A true R true not explaining; 3/5 = 0.6; 11 x 9.09 = 99.99; 100/8 = 12.5; 1/13 block 076923 with 6 remainders; 1/11 block 09, 1/37 block 027 with remainders 1,10,26). No HIGH.
Easy in disguise:
- #0 "Divide 1 by 6, four digits; what do you notice about the remainders": the book's 10/3 note on another number.
- #1 (Understand) "Why can 1 / 7 never give more than 6 different non-zero remainders": the book's own sentence. #15 is the same argument as a show-impossible.
- #2 NEW mcq "dividing 3 by 7 ... remainders 3,2,6,4,5,1 ... next remainder": read off the cycle; one step (and the same chain as #3, #16, #18).
- #3 mcq 2/7 remainders then 2 again: restates "a repeated remainder means repeated digits".
- #4 "Divide 100 by 11 ... six digits, list the remainders": the book's "can you find 100/11" challenge, a drill.
- #5 (Analyse) "Which of these divisions comes to an end": 13/8 is the only one the student can finish quickly; the other three are exactly the book's examples (1/7, 10/9, 100/11).
- #6 "10 / 9 first four digits": the book's try-it.
- #7 NEW match 10/3, 1/8, 20/9, 3/5: four known quotients; the item tests no remainder reasoning.
- #8 (Understand) multi_statement: S3 is the book's rule; S1/S2 are absolute-word statements that are plainly false.
- #12 (Analyse) assertion_reason 1/8 ends / 10/3 does not: both true, R irrelevant by construction.
- #14 NEW mcq "100 / 11 ... the remainders alternate between": duplicate of #4(b); answer read from #4.
- #18 (5 marks, Hardest) "Divide 2 by 7, eight digits, remainders ...": mechanical long division, a near-copy of #3's setting and the book's 1/7 chain; 5 marks for transcription of a worked division.
- #20 "1/13 gives remainders 1,10,9,12,3,4 and then 1 again. (a) How many different non-zero remainders (b) the repeating block": the remainders are handed to the student; (a) is a count of the list, (b) is a division the stem effectively outlines.
Total easy-in-disguise in 4.6: 13 (#0, 1, 2, 3, 4, 5, 6, 7, 8, 12, 14, 18, 20). Borderline: #11, #13, #17.
Genuinely thinking: #9, #10 (good), #15, #16 (20th digit by cycle length), #19.

MEDIUM (4.6)
- M1 Repeated idea: the 7-chain (1/7, 2/7, 3/7) is used in #2, #3, #15, #16, #18 and #1; 100/11 in #4, #14, #19; 10/9 and 20/9 in #6, #7; 1/6 in #0 and #17. Five items would suffice for the whole idea. Fix: replace #2, #14 and #18 by items on other divisors (for example 5/6, 4/15 or 1/9, 2/13) so the student must carry out and spot a new cycle, and ask for the cycle length in one of them.
- M2 #19 case-study (d) is forced: the stated rule "cannot run with fewer than 10 volunteers" rules out the team of 8, so the "reasoned choice" is not a choice, and the key's escape ("or the team of 8 only if extra unpaid helpers make up the numbers") contradicts the stem. Fix: relax to "prefer at least 10, though 8 is possible" and add a cost to each side, or ask which team leaves exact payment and what the school should do with the 1 paisa.
- M3 #16 case-study (d): both candidates fit the poster rule ("at most three digits, at least two different digits"), so the question is asked as "either choice accepted". Fix: make the rule exclude one (for example "block must have exactly three digits" so 1/37 wins) or add a numerical criterion (number of remainders to check by hand).
- M4 #10 true_false is good (even divisor / ends) but the key shows the remainders "1, 10, 4, 4, 4" while the stem asks only for the verdict and reason; the key contains an embedded newline. Fix: one line. Also state the step-2 reason in terms of "a remainder repeats" (not factors of 12, which the book does not teach).
LOW (4.6)
- L1 #5 distractors are the book's three never-ending divisions; the correct option 13/8 is the only unfamiliar one, so the item is solved by elimination from memory.
- L2 #20 stem says "remainders 1, 10, 9, 12, 3, 4 and then 1 again": the leading 1 is the starting remainder; say so, because #0 and #6 treat "remainders after each digit" differently.

### C7M-4.7 (22 items; 4 new: #0, #4, #9, #10)
Keys: all 22 recomputed with Python's calendar arithmetic and the leap rule, all correct (731 pages for 2027-2028; 24.22; 48 leap years and 73048 days in 2001-2200; 8000 years: 1940 leap years, 2921940 days against 2921937.6, 2.4 days, 8000 / 2.4 = 3333; 50 x 0.2422 = 12.11; 2400 leap, 2200 not; 1900 not a leap year and R explains A; 5, 15, 480, 485, 730485 vs 730484.4; 4382 days 1897-1908 with 1904 and 1908; 97 leap years in 400 consecutive years, True; 1996 has 366 days, 1800 has 365; next 29 Feb after 2096 is 2104; match 2032-a, 2100-b, 2000-c, 2027-d; 1461 for 2024-2027; Ritu is right and 2300 is not leap; 1461, 1826, 3287 pages, cheapest cover 3 reams + 1 pack = Rs 7600 (I enumerated reams and packs: next best 2 reams + 3 packs Rs 7750, so the key's comparators 7 packs Rs 8050 and 4 reams Rs 8600 are valid, though not the closest); 36524; all three statements true; 2200 is the non-leap; Rule A 146100, Rule B 146097, Earth 146096.88, gaps 3.12 and 0.12; 1461 vs 1460.9688, 0.0312). No HIGH.
Easy in disguise:
- #0 NEW fill_blank "1 Jan 2027 to 31 Dec 2028": 365 + 366 once you know 2028 is a leap year; one rule, one add.
- #1 "(a) 0.2422 x 100 (b) what it tells us": the book's own sentence ("After 100 calendar years the Earth will need 24.22 more days", p.22).
- #4 NEW mcq 50 x 0.2422: one multiplication, the book's calculation with 50 instead of 100.
- #5 reverse "Name one century year that is leap and one that is not": two recalled examples (2400, 2200); the reasons are the rule.
- #6 (Understand) assertion_reason 1900: rule restated; R explains A.
- #10 NEW "Decide whether 1800, 1996 and 2200 are leap years; days in 1996 and 1800": three rule applications; 2200 is classified and never used in (b).
- #12 (Understand) match of years to rule descriptions: rule recall in four lines.
- #14 mcq 1 Jan 2024 to 31 Dec 2027: 4 x 365 + 1; one rule.
- #15 claim-check (verdict Yes): the rule itself; 2300 added as a second recall.
- #17 "(a) years in 100 divisible by 4 and stay leap (b) total days": the book's 100-year computation (24 x 366 + 76 x 365 = 36524) verbatim.
- #18 (Understand) multi_statement: all three statements are true and are the chapter's three sentences.
- #19 (Understand) "Which of these years is NOT a leap year": one-rule look-up, the other three options are 2000, 2024, 2400.
- #21 "(a) calendar days in 4 years vs 4 x 365.2422, (b) difference": the book's calculation shape on 4 years.
Total easy-in-disguise in 4.7: 13 (#0, 1, 4, 5, 6, 10, 12, 14, 15, 17, 18, 19, 21). Borderline: #2, #8, #9, #3, #7 (the book's 1000-year method re-run on 2000 and 8000 years, 5 marks each).
Genuinely thinking: #11 (Tara's birthday, a good item), #13 show-impossible, #16 case study (real cost optimisation), #20 (see M2).

MEDIUM (4.7)
- M1 Repeated idea: 1461 is the answer of #14, #16(a) and #21(a) (and 731 in #0, 1826 in #16(b)); "count days over a window using the leap rule" is also #2, #7, #8, #17. Fix: replace #14 and #21 with different windows that contain a century non-leap year (e.g. 1 Jan 1899 to 31 Dec 1902 = 1460), so the century rule has to be used, or ask for the day of the week shift.
- M2 #20 case-study (d): "which rule should a calendar maker prefer" is answered by the gap figures it has just computed (0.12 vs 3.12 days); there is no competing consideration. Also (a)-(c) are the same 400-year count as #9 (True/False 97 leap years in 400 years) and #7. Fix: add a cost (a rule that needs a computer vs a rule anyone remembers) or ask the student to choose between Rule B and a third rule C (leap every 4th year except every 128th) with figures.
- M3 #9 true_false is keyed True; the real misconception (100 leap years in 400, forgetting the century correction) is only implied. Fix: make it a False item "In any 400 consecutive years there are exactly 100 leap years, since every fourth year is a leap year" (False, 97), or keep True and add the reason they must state (the two corrections).
- M4 #17 is the book's 100-year example with its numbers unchanged (24, 76, 36524) and #17's stem fixes "century years are excluded", so it cannot test the 2000-type exception that makes a 100-year window hold 25 leap years (1901-2000). Fix: ask for the leap years in 1901-2000 and 2001-2100 (25 and 24).
LOW (4.7)
- L1 #9 and #3/#7 keys have embedded newlines in the justification; keep keys to one paragraph.
- L2 #16 (d) comparators are valid but are not the nearest alternatives (2 reams + 3 packs, Rs 7750, is closer); add it to the key as the near miss.

## Chapter-level checks (counts read)

Items read: 149 of 149 (4.1: 21, 4.2: 21, 4.3: 21, 4.4: 21, 4.5: 22, 4.6: 21, 4.7: 22); nothing sampled. Step marks sum to the item marks in every item that has steps. No option or step names an option by position (the one "Option A / Option B" at 4.1 #12 names the scenarios in the stem, not a shuffled choice).

1. Text-identical to the backup: 119 of 149 (80%), including the Bloom and difficulty labels; the other 30 are exactly the 30 backup items that were labelled Remember (23), Understand/Easy (6) or Apply/Easy (1). So the rework replaced the items the loader would reject and nothing else.
2. Easy-in-disguise (answer is one rule or one look-up the book states, whatever the label): 83 of 149 (4.1: 14, 4.2: 7, 4.3: 13, 4.4: 11, 4.5: 12, 4.6: 13, 4.7: 13); 24 of the 30 new items belong to that list (new easy: 4.1 #6, #14, #16, #19; 4.2 #0, #10, #12; 4.3 #6, #7, #12, #15; 4.4 #0, #3, #11, #13; 4.5 #3, #4, #21; 4.6 #2, #7, #14; 4.7 #0, #4, #10) and 59 are unchanged from the backup. A further 24 borderline items (arithmetic chains, textbook procedures at 5 marks) are listed per concept and not counted. The replacements are one-step scenario/mcq/fill_blank/match items; they keep the item count and the labels but not the thinking the no-easy rule asks for. The loader will accept the file; the standard intent is not met.
3. Newly written items recomputed: all 30 correct, none ambiguous. Unchanged items also recomputed: all correct. Wrong keys: 0.
4. fill_blank: 4 (4.1 #14 = 5.206, 4.3 #15 = 0.054, 4.5 #4 = 150, 4.7 #0 = 731), the required minimum for 7 concepts. Each answer is one number, machine-matchable. All four are one-step (see M1 in 4.1, M1 in 4.3, M4 in 4.5, and 4.7 #0).
5. true_false: 4 (4.2 #11 False, 4.4 #3 True, 4.6 #10 False, 4.7 #9 True) = 50% True, inside the 25-75% band. Two have a real misconception (4.2 #11 digits-times-100; 4.6 #10 even divisor), two are verification with a True verdict (4.4 #3, 4.7 #9). No concept has more than one; 4.1, 4.3, 4.5 have none (not required).
6. match: 7 (one per concept), required 4: met. Every match is four rule look-ups; keys are all "1-a, 2-b, 3-c, 4-d" or its equivalent order in the unshuffled file (the option order is shuffled by the loader, so this is not a defect, but the content has no wrong-pair trap beyond the digit shift).
7. Per-concept minimums (scenario mcq 3+, ms 1+, ar 1+, one-mark 8+, two-mark 5+, three-mark 3+, five-mark 2+, case studies 2+): met in all seven concepts. Bloom mix over the chapter: Apply 76, Analyse 29, Evaluate 22, Understand 15, Create 7; Understand 10% (limit 30%), Analyse/Evaluate/Create 39% (minimum 30%). Difficulty: Hard 121, Hardest 28, no Easy. The labels pass, but 83 items labelled Apply/Hard or above are one-step rules (labels were left unchanged on the 119 old items).
8. Correct-option-is-longest: 3 of 34 mcq (9%; 4.2 #8, 4.4 #5, 4.6 #2 strictly longest; 9 incl. ties). Not a cue. The correct option is listed first in the file for every item (shuffled on load).
9. Claim-check verdict mix: 4 Yes / 3 No (4.1 Yes, 4.2 Yes, 4.3 Yes, 4.4 No, 4.5 No, 4.6 No, 4.7 Yes). Mixed, but unchanged from the backup and in two blocks (Yes, Yes, Yes, No, No, No, Yes); the Yes claims are all "the rule is right" items that restate the rule and ask for a check number (easy).
10. multi_statement key spread: "1 and 3 only" (4.1), "1 and 2 only" (4.2), "2 and 3 only" (4.3), "1 only" (4.4), "2 only" (4.5), "3 only" (4.6), "1, 2 and 3" (4.7): seven different keys, false statements spread over 1, 2, 3. Good. assertion_reason keys: explains (4.1, 4.6 #6, 4.4 #9... counted per concept: 4.1 explains, 4.2 not-explain, 4.3 A true R false, 4.4 explains, 4.5 A false R true, 4.6 not-explain, 4.7 explains): varied. Two "R true but irrelevant" ARs (4.5 #5, 4.6 #12) pair a rule with an unrelated true calculation, which makes the keying guessable.
11. Slot order: not identical across concepts. The type sequences differ (e.g. 4.1 "LssSRsMssLMLLs...", 4.2 "TLMsLsLL...", 4.6 "ssMMsMsTSL..."). But every concept has the same composition (2 case studies, 2 five-mark, 1 match, 1 ms, 1 ar, 1 claim_check, 1 reverse, 1 show-impossible-or-error item, 8-9 one-mark), and the 30 new items were put into the exact slots of the 30 removed ones, so the slot-level template of the backup is preserved; the earlier review's slot-templating comment (item 1 there) is still true for composition.
12. Repeated ideas (counts): "given a counting-number product, place the point" 4.2 #3 + 4.3 #1, #12, #15, #17, #18; "divide by 8 with a unit tail" 4.4 (8 items); "7-cycle chain" 4.6 (6 items); "1461 days over four years" 4.7 (3 items); "12 / 0.4 = 30" 4.5 #0 and #9.
13. Case-study decisions: real trade-offs in 4.1 #0, 4.1 #12 (partly), 4.2 #6, 4.3 #14, 4.4 #12, 4.5 #7, 4.7 #16; forced or "either choice accepted" in 4.2 #4, 4.3 #5, 4.4 #14, 4.5 #12, 4.6 #16, 4.6 #19, 4.7 #20. 7 of 14 are not genuine decisions.
14. Scope: no bar notation, no rounding to places, no cyclic-number/Artin or Hidato item, no recurring-to-fraction conversion. 4.6 #16 asks the 20th digit of 3/7 by cycle length: stays inside "the digits cycle". 4.5 #12 converts minutes to decimal hours (L1 in 4.5): a mild step outside the chapter.

## Per-concept verdicts
- C7M-4.1 (21): keys correct; 14 easy-in-disguise (4 of them new); verdict rework items #1, #3, #4, #6-#9, #11, #13-#17, #19.
- C7M-4.2 (21): keys correct; 7 easy; best concept; fix #4 case-study (d), dedupe #10/#12; pass after fixes.
- C7M-4.3 (21): keys correct; 13 easy and a five-fold repeat of the known-product move; rework.
- C7M-4.4 (21): keys correct; 11 easy; the divide-by-8 repeat and the True-verdict true_false need replacing; pass after fixes.
- C7M-4.5 (22): keys correct; 12 easy; case-study (d) of #12 forced; the 5-mark #13 is five look-ups; pass after fixes.
- C7M-4.6 (21): keys correct; 13 easy; chain of 7-cycle items; two forced case-study decisions; rework.
- C7M-4.7 (22): keys correct; 13 easy; 1461 repeated; #20 forced; pass after fixes.

## Overall
0 HIGH, 24 MEDIUM, 14 LOW; zero wrong keys. Not templated by slot order, but templated in composition and still dominated by one-step rule items: 83 of 149 (56%) are easy-in-disguise and 119 of 149 are unchanged from the backup, so the "no easy questions" rework only swapped the 30 flagged items for one-step application items. Verdict: rework (replace the easy items listed per concept with items that need two or more chapter ideas, a trap, or a decision) before the file counts as meeting section 12; keys are safe to keep as they stand.
