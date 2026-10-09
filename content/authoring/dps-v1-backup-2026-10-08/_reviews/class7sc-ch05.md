# Review: DPS bank, CBSE Class 7 Science, Curiosity ch 5 (gecu105), Changes Around Us

File: content/authoring/dps/class7sc/ch05.json. Read against content/extracted/gecu105/pages/001-016 and content/authoring/class7sc/ch05.json (scope_in pp.57-68; scope_out: "Exercises needing figures"). Reference sheets checked: CL_7_WS_CHEMICAL_CHANGES, Cl7CHEMICAL_CHANGES_WS_Key, CL_7_SCIENCE_HY_REVISION_WS. No DPS item is copied (DPS asks balanced chemical equations, Fe+CuSO4, tarnishing, none of which this book teaches; the bank correctly stays with word equations).

Read: all 153 questions (7 concepts: 22+22+22+22+21+22+22). No sampling. Step marks sum to m in every short/long item (checked in code). Every MCQ, statement, AR, match and case-study part was recomputed from the book text before reading the key.

## Verdict
Facts are almost all correct and in-scope, and keys are right except where noted. But the chapter is **templated at slot level** and a large share of the "reasoning" items are the book's own examples with a strawman attached. It does not fully reach the section 9 standard. Fixes are mostly rewrites of individual items, listed below.

## HIGH (wrong/ambiguous key or fact error against the book)

1. **C7SC-5.2 Q14 (short_answer 2m)**: "Name the substance that makes lime water milky and the white substance that settles at the bottom." Key: "Carbon dioxide turns it milky; calcium carbonate settles." The book (p.60) says the white calcium carbonate is what makes the liquid appear milky ("Therefore, the liquid in the bottle appears milky"). A student writing calcium carbonate for both is right per the book, so the key is contestable and the item has two defensible answers. Fix: "Name the gas that is tested with lime water and the new white substance formed that makes it milky."
2. **C7SC-5.1 Q22 case study, part (d)**: "Meera is filling Table 5.1 and asks if all three belong in the 'physical change' column." The book's Table 5.1 (p.58) has columns S.No., Change, Observation(s); there is no physical-change column. Fact error against the book, and the item depends on "as in the book" (QUESTION_STANDARD 11). Fix: drop Table 5.1; ask her to sort the three changes into "physical" or "chemical" on her chart, and state that in the stem.
3. **C7SC-5.6 Q20 (long 5m)**: part (b) "Name the changes that are chemical" has **no answer in the key** (key covers a, c, d only) although it carries a 1-mark step. Also the book never states that milk to curd is chemical (it asks that as exercise 6) or that compost-making is chemical, so the only book-supported chemical items are rusting (and decay/compost by inference). Part (c) key "(iv) and (i) are decay" names two items for a "which one" question. Fix: give (b) in the key and restrict it to what the chapter states (rusting), or remove (b); reword (c) to "Which two of these are the same kind of change but need opposite decisions?"

## MEDIUM

### Systemic
4. **Every claim, and every named character, is wrong.** Claim-checks in all seven concepts are "X says ... Do you agree?" keyed "No" (Tarun 5.1, Isha 5.2, Dev 5.3, Kavya 5.4, Rohan 5.5, Tara 5.6, Ritu 5.7). Case-study (d) is the same: Anu (5.1 Q21), the friend (5.2 Q21), "a student" (5.3 Q21), the brother (5.5 Q20), the secretary (5.6 Q21), the farmer (5.7 Q22) are all wrong. Students learn "the named person is wrong". Fix: make at least 2 of the 7 claim-checks correct or half-correct (e.g. 5.4: "Kavya says a substance can burn without a flame. Right? What more must she add?"; 5.7 Ritu: "weathering can include chemical change" = agree). Make 2 or 3 case-study (d)s real trade-offs.
5. **Strawman decisions** (the claim is absurd, the decision trivial): 5.1 Q20 Ravi "nothing changes at all"; 5.1 Q21(d) Anu "all three chemical"; 5.2 Q21(d) "something dissolved"; 5.3 Q21(d) "physical like a bulb glowing"; 5.3 Q17 Rohit "candle will keep burning in a sealed jar"; 5.5 Q7 (Asha/Bilal/Chitra, where "Nobody" is absurd); 5.6 Q21(d) "ban all decay"; 5.7 Q17 Mayank rebuilds a cliff in days; 5.7 Q22(d) farmer. Replace with a real two-sided decision, e.g. 5.6 Q21(d): "Society can keep the pit open (compost, smell near homes) or send waste away; decide using desirable/undesirable"; 5.7 Q21(d): which of two slopes/sites is more at risk from erosion given given data.
6. **Statement items are templated (all 7).** Always one false statement and two true; statement I is true in every concept (false sits at II in 5.1, 5.2, 5.5 and at III in 5.3, 5.4, 5.6, 5.7, never at I); keyed combos are only "I and III only" (x3) and "I and II only" (x4); the four options are word-for-word identical in all seven. Fix: make the false statement I in two concepts, key "II and III only" in one and "I, II and III" in one, and vary option wording.
7. **Match items (5.1, 5.2, 5.4, 5.6, 5.7)**: the correct mapping always ends "4-D" and three of four options contain 4-D, so item 4 is free and the distractor pairs differ only in items 1-3. Vary which row is the odd one and put the swapped pair in the last two rows in some. Match count (5 of 7 concepts) meets the 1-per-2-concepts rule; 5.3 and 5.5 have none, which is acceptable.
8. **Slot pattern identical in every concept** (positions 1-22): 3-4 plain MCQs with a NOT item at position 3 or 4 in six of seven concepts; three scenario MCQs; MS; AR; match; five 2-marks with "Define ... with one example" and "Differentiate between ..." at position 13 and 15 (7/7 concepts have "Differentiate"); claim-check at 16, show-impossible at 17, "reverse" at 18; two 5-markers; two case studies whose stems end in "decide". Reorder and vary frames (e.g. 5.5 could use a data-table scenario, 5.7 a ranking item).
9. **Correct option is the longest** in 32 of 49 MCQs (65%); worst: 5.3 (6 of 7), 5.7 (6 of 7), 5.1 Q2/Q4/Q5/Q6. Equalise lengths by lengthening distractors (5.7 Q2, 5.3 Q5/Q6, 5.5 Q4/Q6/Q7, 5.6 Q7 are the clearest).
10. **One example used again and again** (recall in disguise): paper/balloon/chalk activity in 5.1 Q1, Q5, Q12, Q16, Q20, Q22 (and Q22 mixes all three); kadhai-oil fire in 5.4 Q7, Q18, Q20, Q22; synthetic-cloth caution in 5.3 Q6, Q14, Q18, Q22(d) and 5.4 Q20, Q22; vinegar+baking soda+lime water test in 5.2 Q5, Q12, Q18, Q19, Q21, Q22; Activity 5.6 (matchstick/magnifying glass) in 5.4 Q5, Q6, Q11, Q12, Q13, Q16, Q17, Q21; compost in 5.6 Q5, Q12, Q17, Q21; Faraday in 5.5 Q3, Q4, Q12, Q21. Replace some with new settings.
11. **Near-duplicates.**
    - 5.4 Q4 and Q14 (paper kept in air never catches fire) are the same question.
    - 5.1 Q18 and Q19 (and Q7) are nearly the same classification list (chopping/boiling/drying/burning wood).
    - 5.1 Q17 (physical change that cannot be reversed: chopping vegetables) and 5.6 Q16 (Tara: every physical change reversible: chopping vegetables) are the same move in two concepts; 5.1 Q9 and Q8-II also use it.
    - 5.1 Q16 (Tarun: looks nothing like chalk) and 5.1 Q22(c) (brother: no longer looks like paper) are the same claim.
    - 5.5 Q10, Q11, Q17, Q18 all ask "melting/evaporation physical, burning vapour chemical".
    - 5.7 Q18 and Q19 (rock to new rock sequence).
    - 5.6 Q2 and Q3 (same four-item desirable/undesirable set, mirrored).
12. **Items reusing the book verbatim** (settings, numbers or wording from the page; section 1 asks for a change then a raise): 5.1 Q1 (chalk), Q11 (ice cube half hour), Q14 (banana spots), Q17; 5.2 Q5/Q6 (Activities 5.3, 5.4 as written), Q7 (nearly exercise 10 / Fig 5.11, with the salt row removed); 5.3 Q5 (Activity 5.5), Q11 (the magnesium equation); 5.4 Q5, Q6, Q21 (Activity 5.6 as written, with "about half a minute" invented; the book says "for some time"); 5.5 Q5 (wax "flows and solidifies in different shapes"), Q19 (Prem/Rina/Sam are Fig 5.9's speech bubbles reworded); 5.7 Q4 (basalt), Q21 (Fig 5.10 scene).
13. **Case-study part printed in the stem (free mark) or parts not climbing**:
    - 5.7 Q22 (a) "What moves the soil" and (b) "What happens at the reservoir where the water slows" are both stated in the stem ("river carries soil ... slows near the village reservoir, where mud settles").
    - 5.2 Q22 (b) "What does the white layer show" and (a) (the white layer in B is in the stem).
    - 5.2 Q21 (a) evidence ("it turned milky") is in the stem.
    - 5.5 Q21 (b) and (c): the stem says Group Q watches the flame and Group R the drops that harden.
    - 5.1 Q21 (a): "cubes had become water" gives the state change.
    - 5.1 Q22 (b) and 5.6 Q21 (a)/(b), 5.6 Q22(b) (circular: "popcorn cannot go back to corn"), 5.4 Q21 (b)/(c) mirror each other.
    - Last parts are mostly "state the rule", not a justified trade-off: 5.2 Q22(d), 5.4 Q22(d), 5.5 Q21(d), 5.7 Q21(d) ("will the red layer turn black again?" has one obvious answer).
    Fix: remove the answer from the stem, make (c) use numbers/observations from the stem, and make (d) a two-sided choice.
14. **Case-study stems under 45 words** (section 10): 5.1 Q22 (33), 5.2 Q22 (44), 5.3 Q21 (29), 5.4 Q22 (35), 5.5 Q21 (42), 5.6 Q21 (33), 5.6 Q22 (37), 5.7 Q22 (40). 5.3 Q21 also carries a pointless "3 cm".
15. **5.4 Q19 (long 5m)**: trial (iv) "a lighted candle under a sealed tumbler for a long time": "predict whether fire occurs" is ambiguous (the candle is burning at the start) and the missing side in "each trial that has no fire" is then unclear; key "(iv) goes out, oxygen missing". Rewrite (iv) as "an unlit candle in a sealed tumbler" or ask "will the flame last?".
16. **5.5 Q19(c)** "State which students give a partial picture": all three are partial (Rina and Sam are also incomplete); the key says only Prem is incomplete. Fix key or reword to "which statements are true but incomplete".
17. **5.4 Q22(a)**: "Name the fuel, oxygen and heat in the first fire": the stem never says what set the oil alight, so "flame/hot pan" is a guess; the key is not determinable from the stem. Give the heat source (a stove flame) in the stem.
18. **5.6 Q22(d)**: "Decide which one Aman should reduce first" with no data; key accepts either fuel or paint. Not scorable as a decision. Add a number (litres of fuel per week, a repainting date) or reframe.
19. **5.4 Q15** "Differentiate between a combustible substance and its ignition temperature": not a comparable pair (substance vs temperature). Fix: differentiate "ignition temperature" and "the temperature of a lighted matchstick", or "fuel" vs "oxygen" in the fire triangle.
20. **5.3 Q6** "thick woollen cloth": the book only says "a blanket or cloth", with synthetic forbidden; wool is not mentioned. Use "a thick cotton blanket" (the book's cotton/synthetic line) so the book alone justifies the key. Same for 5.4 Q22 where cotton is used; fine there.

## LOW

21. **Bloom labels inflated**: many recall items carry Analyse (5.1 Q7 and 5.3 Q7 where the stem hands over the answer: "it is not warm"; 5.6 Q7). Section 10 asks that at least 15% be Analyse/Evaluate/Create; the file shows 39% by label, but the real reasoning proportion is nearer 25% (many "Evaluate" 3-markers and "Analyse" 5-markers are restatements of one book paragraph: 5.5 Q18, 5.6 Q19, 5.7 Q19). Remember/Understand is 39%, within the 60% cap.
22. **Mislabelled tags**: "reverse" is used for 5.1 Q17 (physical change that cannot be reversed: not a reverse item), 5.5 Q16 and 5.7 Q18 (describe-in-order items), 5.4 Q18 (a recall of the kadhai lid). Only 5.6 Q18 is a true reverse (write a story that gives these labels). Add genuine "make a question / situation whose answer is..." items to 2 or 3 concepts.
23. **Reversal flag**: 5.6 Q6 "Which pair **cannot** be reversed?" should carry `"rev": true`.
24. **2-mark (a)/(b) pairs that are two recall facts** (section 11): 5.1 Q11 ((b) restates (a)), 5.2 Q11, 5.5 Q10, 5.6 Q11 ("give a reversible change; say how it is reversed"), 5.7 Q11, Q14. Make (b) a consequence or comparison.
25. **Weak or absurd distractors**: 5.1 Q6 opt 4 ("cloth changed from solid to liquid"), 5.1 Q4 opts 2-4 ("sight alone", "touch alone"), 5.3 Q5 opt 4, 5.3 Q6 opt 4 (pour lime water), 5.3 Q7 opt 2 (wax vapour in insects), 5.5 Q4 opts 2-4, 5.5 Q7 opt 4, 5.6 Q7 opts 2-4, 5.7 Q7 opt 4 (garbled), 5.2 Q2 opt 2, 5.4 Q6 opt 3 (contradicts the stem). Use real confusions: melting = chemical, boiling = chemical, tap water also turns milky, etc.
26. **Statement/absolute pattern**: false options almost always hinge on always/only/every (5.2 Q8, 5.3 Q8, 5.4 Q8-III, 5.4 Q4 opt 4, 5.6 Q8-III, 5.6 Q7 opt 4, 5.7 Q3 is the exception). The "true because absolute" counter-example exists only in 5.4 Q8-II ("any one of fuel, oxygen or heat"). Add one or two more true absolute statements.
27. **5.7 Q8-II** "Erosion needs wind or flowing water": the book says "natural forces like wind and flowing water" and counts a landslide as erosion, so "needs" is slightly over-stated; use "can be caused by".
28. **5.2 Q7** states that lemon juice with vinegar and baking soda with plain water give no gas; the book supports the second (Activity 5.4 follow-up) but never states the first (only Fig 5.11c shows the set-up, no result). Key is right by the "CO2 comes from baking soda + acid" logic but it is an inference; say "lemon juice with vinegar (no baking soda)" in the stem.
29. **5.2 Q22 (c)** "control" is not a word in this chapter; use "comparison cup".
30. **5.7 Q20 (d)** "Decide which is easier to see in the rock's colour" is a thin decision (2 marks) based on the single basalt example; and "chemical weathering" as a term is not used by the book (it says weathering includes physical and chemical changes). Reword to the book's phrase.
31. **5.3 Q18** "three steps" are really one action + one reason + one caution; fine for marks but label "Q18" 3 steps accordingly. **5.6 Q18** mark "Coherent setting" is not a real step; replace with "uses each idea correctly with its reason".
32. **5.4 Q20 (d)** "Name the side of the triangle each rule removes": the key never states them explicitly; key (b) "Cool or cut off air" - the book never mentions cooling; reword to "cut off the air by covering" to stay in-chapter.

## Per-concept verdict
- **C7SC-5.1** (22): keys correct; factual error in Q22(d) (Table 5.1); heavy reuse of paper/balloon/chalk; two strawman case/long items; Q18/Q19 near-duplicates. Needs rewrite of Q20-Q22.
- **C7SC-5.2** (22): Q14 key contestable (HIGH); otherwise sound; test repeated six times; Q22(d) not a decision.
- **C7SC-5.3** (22): keys correct; synthetic-cloth and covered-candle repeated; Q21 is Fig 5.5 with a strawman (d); Q22 is the best case study in the chapter (real cotton/synthetic decision).
- **C7SC-5.4** (22): keys correct; Activity 5.6 over-used; Q4/Q14 duplicate; Q19(iv) ambiguous; Q15 category error; Q22(a) under-specified.
- **C7SC-5.5** (21, one below 20 target but meets the loader minimums): keys correct; narrow concept, many near-duplicate recall items; Q19(c) key incomplete; Q21(d) leading; 4 Faraday items.
- **C7SC-5.6** (22): Q20 key incomplete and chemical status unsupported (HIGH); Q22(d) undecidable; Q11 trivial; Q6 needs `rev`.
- **C7SC-5.7** (22): keys correct; Q22 gives (a) and (b) away; Q17 and Q22(d) strawmen; Q18/Q19 duplicate; correct option longest in 6 of 7 MCQs.

## Count read
153 of 153 questions read in full. Findings: 3 HIGH, 17 MEDIUM, 12 LOW.
