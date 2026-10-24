# Review: content/authoring/dps/class8/p2ch03.json (MATH8, Ganita Prakash Gr 8 Part II ch3, hegp203)

Reviewer: independent first review. Indices are `concept index.question index` (0-based, as in the file; e.g. 0.3 = C8M-3.1 question 4th in file). All keys recomputed in python/by hand against pages 55-69.

## Summary (read this first)

127 questions read (21/22/21/21/21/21), every key and every case-study part recomputed in python or by hand against pages 55-69. **HIGH: 0. MEDIUM: 19. LOW: 33.** Verdict: **PASS AFTER FIXES**.

Index convention: `c.q` = concept index (0 = C8M-3.1 ... 5 = C8M-3.6) and question position in that concept's list (0-based), e.g. 1.18 = C8M-3.2, 19th question.

### HIGH
None. No wrong key, no second correct option in any MCQ, match, statement or assertion-reason item; every numeric answer, fill_blank and case-study part reproduced.

### MEDIUM (full detail under each concept below)
1. 3.13 (C8M-3.4) "smallest piece first as in the original order" is self-contradictory: 2 : 2 : 2 : 3 and 2 : 3 : 2 : 2 are both defensible. Reword the ordering.
2. 2.19 and 2.16(b) (C8M-3.3) "which material/spice is wrong" has a second reading (the two agreeing quantities could be the wrong ones). State which count is trusted.
3. 1.18(e) (C8M-3.2, the shortest-path 5-mark argument): "no road is shorter than the straight line" is asserted, not derived from a tool the book teaches (the book only has the triangle test on p.60). Reword to use AB + BC > AC from the three map distances, or give the fact in the stem.
4. 3.20(c), 4.20(d), 4.16(a): a part answerable from its own stem, or whose "decision" is dictated by the stem.
5. 5.7(c), 5.6, 5.18, 5.15(d): case-study/5-mark parts are the same step repeated or a forced decision (P alone cannot meet 9:00, so "hire R" is the only possibility).
6. Easy in disguise, book re-dressed: 1.4 (book's 1 : 60,00,000 = 60 km), 2.4 (book Example 2), 5.0 (book Fig-it-out Q6), 5.1 (book classification), 5.9 (book Lucknow-Kanpur), 3.18.
7. Repetition: "mixture off the standard, how much to add" four times in C8M-3.1; "which runs out first" five times in C8M-3.3; triangle-angle ratio six times and triangle inequality five times in C8M-3.4; a cement-sand register case study in both 0.15 and 2.19.

### Author-supplied values (asked about)
- Kanyakumari to Srinagar 3,000 km (1.8): realistic (great-circle about 2,900 km), written as "is taken as" data, the answer depends only on RF arithmetic. OK.
- Delhi to Kolkata 1,300 km (1.14): realistic (about 1,305 km straight line), given as data. OK. The "show it cannot be done" part (32.5 cm > 30 cm) is correct and the best fitting RF (1 : 50,00,000, 26 cm) is unique.
- Shortest-path argument (1.18(e)): see MEDIUM 3. The rest of 1.18 (130/160/240/50, road 275) is correct and uses only RF.

### Template counts (counted)
- Slot order: six different slot strings, no identical order across concepts; case studies at different positions. Not templated by slot.
- Types: 50 short_answer, 27 mcq, 26 long_answer, 6 each multi_statement / fill_blank / match / assertion_reason. 11 case studies; the only weak decisions are those listed in MEDIUM 5.
- claim_check verdicts (6): Yes 2 (Meera, Ishaan), partly right 2 (Kiran, Arun), No 2 (Neha, Simran). Balanced, a little light on "No" against the standard's "about half".
- true_false (6): True 3, False 3. Two True items (3.10, 5.20) probe no misconception.
- multi_statement keys: 1 and 3 only, 2 and 3 only, 1 and 2 only, 2 only, 1 only, 1-2-3. Well spread (5.5 is all-true textbook facts).
- assertion_reason keys: A false/R true 1, both true + explains 2, both true no-explain 2, A true/R false 1. All four outcomes used.
- Correct option is the unique longest in 0 of 33 mcq/match items; all keys at o[0]; no option named by position; no wrong option equal to the key in value.
- Bloom: Analyse 48, Apply 38, Evaluate 33, Understand 5 (3.9%), Create 3; no Remember, no Easy (102 Hard, 25 Hardest). Analyse+Evaluate+Create = 66%.
- Marks per concept: 8-9 one-mark, 5-6 two-mark, 3-4 three-mark, 2-3 four-mark, 2 five-mark; step marks sum to the stated marks in every long item.
- Scope: no scope_out line broken (no 3-agent or staggered work: 5.7 runs two machines at a time; no graphs, compound ratios, interest).
- rev flag used only on the two NOT-stems (0.0, 2.17): correct.

## Findings by concept (severity-tagged)

### C8M-3.1 (21 questions)
- No wrong key. All 21 recomputed (cross products, 840 students, 10.5, 10, 68, 12 cm, 0.05 L, 2.5 L, 50 g, 6.5 bags / 0.5 left).
- MEDIUM 0.3, 0.8, 0.12, 0.15: the same idea "test mixtures against a standard ratio, find the off one, say how much to add to fix it" is used in four items of one concept (canteen drink (d), petrol cans (c)(d), chapati (c), cement (d)). Limit is about twice. Keep the canteen case study (it has the best part (d)) and turn 0.12 into a different frame (for example a missing-term or a unit-conversion test).
- MEDIUM 0.20 (5-mark bean plant): parts (a), (b), (c) are the same cross-product test run three times; only (e) is thinking. Replace (b) with a different step (e.g. ask which single day's reading, if changed, would make the whole record proportional) or fold (a)-(b) into one part.
- LOW 0.9 "In the proportion 2.4 : 6 :: 4 : x" bare plug-in of the rule of three, no context, tagged Understand/Hard. Wrap in a short situation or make the unknown the first term and ask which wrong option comes from which slip.
- LOW 0.18 stem hands over the setup ("Using 36 : 48 :: 51 : x") so the student only plugs in; drop the proportion statement from the stem.
- LOW 0.6 (true_false) the false claim "decimals cannot be proportional to whole numbers" is a thin misconception for Class 8; the chapter itself uses 1 : 1.5 : 3. Acceptable, but prefer a misconception such as "equal difference" (already in 0.14, so keep as is only if verdict mix needs a False).
- LOW 0.11 option "since both shops sell more than 5" is not a chapter confusion; replace by "Not proportional, since 10 - 6 = 4 and 75 - 45 = 30" style slip or reversed pairing.
- LOW 0.12 part (c) "she or he": part (b) already identified Asha; write "that student" with the name.
- LOW 0.3 (d) is a calculation, not a decision; add "which liquid and how much" is fine but a trade-off (the cook has only 0.2 L syrup left, is it enough?) would make it a decision.
- LOW 0.7 fill_blank answer "10.5": natural equivalents "10 1/2", "10.50", "21/2". State "as a decimal" in the stem and have the app accept 10.50.

### C8M-3.2 (22 questions)
- No wrong key. All 22 recomputed (S1 of 1.0 is false because 1 cm = 25 km not 250 km; 140 km; 40 km; 13.6/16.2/11.8 and 11/14/9.6; 3.7 km; 32.5/26/21.7 cm; 130/160/240/50; 18 cm; 2.4 cm; 3.25 m vs 3.3 m; 312/340/310; match 1-d 2-a 3-b 4-c; RFs 30 lakh and 50 lakh).
- Author-supplied values: Kanyakumari-Srinagar 3,000 km and Delhi-Kolkata 1,300 km are both realistic (great-circle roughly 2,900 and 1,300 km) and both are given as data ("is taken as"), so acceptable. Neither needs the book.
- MEDIUM 1.18 part (e) (shortest-path argument, 5-mark): "no path between two places is shorter than the straight line" is asserted, not derived. The book teaches only the triangle test on p.60 (sides 1 : 3 : 5 cannot make a triangle). The map data (6.5, 8, 12 cm) can show AB + BC > AC (290 > 240) by that tool, but a general road from A to C is not covered. Fix: reword (e) to "Could the path A to B to C ever be shorter than AC? Use the three map distances" and mark the triangle-side comparison; or state the straight-line-is-shortest fact in the stem as given.
- MEDIUM 1.4 "what distance does 1 cm stand for, and why?" for RF 1 : 60,00,000 is the book's own worked example (p.56, answer 60 km). Recall in disguise despite the "Understand/Hard" tag. Change the RF (e.g. 1 : 45,00,000) and have the stem give a map distance in mm, or merge into 1.20.
- LOW 1.3 (Wayanad case study): parts (a) and (b) are the same multiplication; part (c) is a plain filter with exactly one site passing, so no trade-off. Fix: let two sites pass one condition each tightly and ask which condition the office should relax or whether a site at exactly the limit counts.
- LOW 1.11 part (e): Qasim is the "odd" reading in (b), yet Qasim's map is the answer to (e); say "which map" clearly (it does) and add in (e) that the odd result was a reading slip not a map fault. Minor.
- LOW 1.16 "On a road atlas ... (geographical distance)": road atlas versus geographical distance contradicts the chapter's own warning; write "On a state map".
- LOW 1.20 (a) is a one-line conversion the stem then reuses; acceptable as an (a)+(b) item.
- LOW 1.6, 1.9, 1.1, 1.21: single-step conversions with a context; fine for 1 mark but 1.1, 1.6 and 1.9 are one idea (map x k) in three items; vary 1.6 to ask for the unit slip (answer in km from mm).

### C8M-3.3 (21 questions)
- No wrong key. All recomputed (yellow limits at 1.2 L/part, 12 L, Rs 1,280; 7.5/3 cups; 24.5; 20 pots; x + y = 21; 2,925 g; almonds 0.35 kg per part; 15 cricket balls / 6 / 36; 126 bags).
- MEDIUM 2.19 (a)/(b) and 2.16 (b): "which material is wrong" has a second defensible reading. In 2.19 Day 2 (7 : 14 : 24) the cement and sand agree with each other (1 : 2), so the key says aggregate is short (28), but 7 : 14 : 24 is equally fixed by cement 6 and sand 12 if aggregate 24 was the weighed figure. Same in 2.16 B (6 : 9 : 3 : 2): three spices agree, cardamom is the odd one, but the other three could be the ones that are short. Fix: say in the stem which entry is the trusted one ("the aggregate count is from the delivery slip, the cement and sand counts were estimated") or ask "by what common factor do the first three terms scale, and what should the last be".
- MEDIUM 2.19 vs 0.15 (cross-concept template): both are a site register of cement : sand (: aggregate) batches, find the entry that breaks the ratio, fix it, then a stock-limit question. Change one setting (e.g. 2.19 to a tile-adhesive or school-uniform dye mix) and one part pattern.
- MEDIUM 2.0, 2.3(b), 2.5(d), 2.8, 2.19(c): "which ingredient runs out first / how many batches" appears five times in a 21-question concept (and 2.7(b), 2.16(e) are "add to correct" again). The chapter only teaches scaling from ONE known term; the limiting-term idea is a reasonable extension but cap at two items. Rework 2.8 (the MCQ, keep, it has the 5.1 kg trap) and 2.3; replace 2.5(d) by a part that asks the mix for a pot whose TOTAL weight is given.
- MEDIUM 2.4 fill_blank (1 : 2 : 4, 14 bags of gravel, total 24.5) is the book's Example 2 (p.58, cement 3 bags, total 16.5) with new numbers: recall of a worked example. Make it a total given and a term asked, or use four terms with one decimal.
- LOW 2.6 bare "If 6 : 10 : 4 :: 9 : x : y, what is x + y?" no context; a one-step scale by 1.5. Acceptable for 1 mark but best given a situation.
- LOW 2.15 (a)/(b) "Ravi copies the ratio in a different order" is a very light misconception (reordering terms with the quantities) for 2 marks; either add a third step (find the amounts for 3 cups of ghee) or lift to 3 marks.
- LOW 2.7 (b): state in the stem that the besan and ghee had already been added in the planned amounts, otherwise "how much more" is ambiguous.
- LOW 2.0 (e) cost step (Rs 240 and Rs 200 per litre) is plain multiplication outside the chapter; fine as a tail, but then (d) is the real decision point and should come last.
- LOW 2.20 (claim check) verdict No (see claim mix); the premise "decimal term means it cannot be whole" duplicates the 0.6 true/false in C8M-3.1 (0.6) - same misconception twice in the chapter.

### C8M-3.4 (21 questions)
- No wrong key. All recomputed (280/560; 2 only; Rs 1,100; 4:3:5, 9,000/6,750/11,250, 7,500; 0.3/0.6/1.5 and 0.6/0.8/1.0; 105; Rs 260; 24/36/48/72, Rs 588, 20:15:8:6; 40/60/80; 375 ml, 600 ml, Rs 232.50, Rs 225 vs Rs 210; 75/60/45; 1:1; 8/10/16 cm; 40 min; Rs 900/600/300).
- MEDIUM 3.13 (b) "smallest piece first as in the original order" contradicts itself. The pieces are 20, 30, 20, 20; "smallest first" would give 2 : 2 : 2 : 3, "original order" gives 2 : 3 : 2 : 2. Two defensible answers. Fix: "Write the ratio of the four pieces in the order: first piece, second piece, the two halves of the third piece."
- MEDIUM repetition in this concept: triangle-angle ratios are tested in 3.1(S2), 3.7, 3.11, 3.12, 3.17(a)(b)(e), 3.18 (six items) and the triangle-inequality in 3.1(S1), 3.4, 3.6, 3.11, 3.17(c) (five). The scope lists both as ONE bullet each (p.60). Keep 3.4 (explain), 3.6 (carpenter), 3.12 (match), 3.17 (5-mark); replace 3.7, 3.18 and 3.11's angle half with money/time/length division items using different term counts (e.g. a 5-term ratio, two decimal terms) so division with 3 terms is not almost absent.
- MEDIUM 3.18 (Understand, 2 marks): angles 1 : 1 : 2, then "name the type" is Class 7 classification after a one-step division. Easy in disguise. Fix: give the largest angle and ask which ratio could have produced it, or merge into 3.17.
- MEDIUM 3.20 (c): "check whether the first friend travelled 1.5 times as far as the second" is answered by the stem's own 4.5 : 3 (= 1.5); it needs nothing from the chapter and the (c) mark is free. Fix: ask the fare each would pay if the cab fare rose to Rs 2,400, or whether the friend with 1.5 km would pay one-third of the first.
- LOW 3.5 (AR): R ("each decimal term must first be rounded to the nearest whole number") is a strawman no student holds; A is Example 3 (110 units, 1 : 1.5 : 3, p.59) scaled by 10. Better R: "the ratio 1 : 1.5 : 3 has the same parts as 2 : 3 : 6" (true, does not explain A -> a different outcome) or "terms must be whole numbers" (still false but a real slip).
- LOW 3.3 (case study): (d) is a check against a threshold (March fails, April passes), not a trade-off; (a) is simplification. The decision part could ask what profit would make Bina's share exactly Rs 7,000.
- LOW 3.8 and 3.9 both test "count ratio is not value ratio" for coins, and both are the book's Figure-it-out Q3 (100 coins, 4 : 3 : 2 : 1) re-dressed. Two items is the limit; change the coin set in one.
- LOW 3.2, 3.7, 3.19 are single-step divisions; fine for 1 mark, but 3.7 (fill_blank 105) and 3.19 add little beyond 3.0/3.2. 
- LOW 3.10 (true/false, True): fine, but the ratio family "doubling every term" recurs in 3.3 Q9 true/false, 0.2 AR and 2.14: see chapter-level repetition.

### C8M-3.5 (21 questions)
- No wrong key. All recomputed (10 students; 75 degrees; 60/15/5:4:3; 54 degrees; 1 only (S2 false, S3 sums to 370); 126/90/81/36/27, 22.5%, 5,25,000/3,75,000; 150 households; 10:6:5:3 -> 150/90/75/45; 54/144/90/72, 400 L; 180; 65.5; 5/24 -> 75 degrees, 5 h; 4:3:2:1; 15%; 105%, 420 t, 120 t; 150/120/90; 40/25/15/10; match 1-b 2-d 3-a 4-c; 100/70, 25%/35%, 40 more).
- MEDIUM 4.20 (d): the stem itself defines the award as "the larger share", and part (c) already asks "which has the larger share", so the "decision" is a restatement. Remove the criterion from the stem: "The district wants to reward the school that is more Maths-friendly. Which should it pick, and why would counting students mislead?"
- MEDIUM 4.16 (a): "show these labels cannot be correct" (30 + 25 + 40 + 10 = 105) is answerable from the stem alone, no chapter; the case study's (d) is a calculation, not a decision. Fix: make (a) ask which single label could be the error and what each correction implies, so (b) is a real judgement.
- LOW 4.5 (c)/(d) the funding rule decides the answer; there is no trade-off. A better last part: the committee may fund only problems that together cover at least 60% of households - which sets are possible and which is cheapest.
- LOW 4.8 (AR): A (25% -> 90 degrees) and R (angle is the same fraction of 360) are the book's one-line definition; every wrong reading is excluded, so it is recall. Use a numeric A that tests a slip (percentage used as angle) with a true R that does not explain it.
- LOW 4.1, 4.6, 4.11, 4.14, 4.15, 4.19: six single-step angle/percentage/count conversions at 1 mark; 4.15 (54 degrees -> 15%) is the thinnest. Swap 4.15 for a version where two sectors are given and the percentage of the third is asked.
- LOW 4.12 steps list (c) and (d) under one mark; split or say "Parts (c) and (d), half a mark each" for the marking scheme.
- LOW 4.13 fraction addition (1/3 + 1/4 + 1/8 + 1/12) is Class 7 arithmetic, not this chapter; fine as application but heavier on fractions than on pie charts.

### C8M-3.6 (21 questions)
- No wrong key. All recomputed (2 days for 6 workers; k = 240 and 20/15/6; 9 days; 14.4 days / 300 people / 36-24-12-8 / 480 max; 30 days, 60 machines, 18 extra, Rs 45,00,000; 1,500 and 1,000 per hour, 8:24, 8:13; 3 hours; 3 h for the 3-hour MCQ; 30 days; 16 days / 35 workers / Rs 1,44,000 / 24 workers; 20 rows, 14.4; 12 min, 15 min; Rs 1,980). 5.17: the only single y-change that works is 6 -> 5 (two products already equal 50), so the key is unique.
- MEDIUM 5.0 (claim check): the first half (3 workers 4 days, 4 workers 3 days) and the statement of the setting are the book's Figure-it-out Q6 (p.68, "Three workers can paint a fence in 4 days, one more joins"). Half of the claim is the textbook answer. Change to 5 workers and 6 days (30 worker-days) so the numbers are new.
- MEDIUM 5.1 (Which pair is in inverse proportion?) is the book's Figure-it-out classification (Q1, p.67) in MCQ dress; with no numbers it is recall. Fix: give two small tables or quantity pairs where one looks inverse (both fall) but the product is not constant, and ask which is inverse.
- MEDIUM 5.9 (Understand, 2 marks): bus 40 -> 60 km/h and 3 -> 2 h is the book's Lucknow-Kanpur example (p.63-64) with new numbers; both parts are one-line facts from the book (product is constant, inverse factor). Raise: give three of four values of a table with one error and ask which entry breaks the product, or drop and use the marks elsewhere.
- MEDIUM 5.6 (5 marks): parts (a), (b), (c) are the same x1y1 = x2y2 step three times and (d) is one multiplication; only (e) is thinking. Fold (a)-(b) into one part and make (d) a decision, e.g. compare buying 18 machines against running 36 machines 12 extra hours a day, which uses the product idea in a new way.
- MEDIUM 5.7 (case study): the "decision" in (c) is forced. P alone ends at 10:00 am, far past 9:00, so the only option that can work is hiring R; no cost, reliability or trade-off is given. Give a second feasible option (hire R, or run P for an extra shift at a stated cost) so the answer rests on a comparison.
- LOW 5.18 (5 marks): (c) is a check of (b) and (e) is obvious (B is the faster hose); parts do not climb. Replace (c) with "hose A is blocked for 5 minutes after starting; how long in all" if allowed, or drop (c).
- LOW 5.15 (d): once the wage bill is shown to be the same for every crew, "choose the smallest crew" has no stated reason; add "the camp can house only 25 workers" or "the crew must not exceed 30" so the choice is justified.
- LOW 5.5 (multi_statement): the three statements are all true textbook facts with no word-hinged false statement; the answer "1, 2 and 3" teaches that all true is safe. Make statement 3 false (e.g. "the number of pages in a book and the time to read it at a fixed speed are in inverse proportion").
- LOW 5.20 (true_false, True): no misconception is probed; a True item should defend a result that students tend to doubt (for example that 10 machines are 4 : 6 on days but not 10 : 6). Consider making it False by giving 11 days.
- LOW 5.11 (c): "within less than 3 hours" with an answer of exactly 3 is engineered to produce "No by equality"; fine but say "before 3 hours are over".
- LOW 5.16, 5.19, 5.13, 5.3, 5.14 are mirrors of the book's Figure-it-out items (Q8, Q2, Q10, Example 3, Example 5) with new numbers. Acceptable as 1-2 mark applications, but five of the 21 are direct re-dressings; swap two for items that join two ideas (a direct proportion inside an inverse one).

## Per-concept verdicts
- C8M-3.1 (21): keys all right; PASS AFTER FIXES (reduce the four "add to correct" items to two, tighten 0.20).
- C8M-3.2 (22): keys all right; PASS AFTER FIXES (reword 1.18(e), replace book example 1.4).
- C8M-3.3 (21): keys all right; PASS AFTER FIXES (settle which count is trusted in 2.19/2.16, cut "runs out first" items, vary 2.19 setting).
- C8M-3.4 (21): keys all right; PASS AFTER FIXES (fix 3.13 ordering, thin out angle-ratio and triangle items, give 3.20(c) real content).
- C8M-3.5 (21): keys all right; PASS AFTER FIXES (4.20 decision, 4.16(a), AR 4.8).
- C8M-3.6 (21): keys all right; PASS AFTER FIXES (five book re-dressings, forced decision in 5.7, 5-mark chains in 5.6 and 5.18).

## Count read
127 questions read in full (C8M-3.1 21, 3.2 22, 3.3 21, 3.4 21, 3.5 21, 3.6 21). HIGH 0, MEDIUM 19, LOW 33. Not templated by slot order or wording; repetition pockets listed above. Overall: PASS AFTER FIXES.
