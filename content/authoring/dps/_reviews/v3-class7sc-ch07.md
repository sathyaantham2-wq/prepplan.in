# Review v3: DPS pack, Class 7 Science, ch07 "Heat Transfer in Nature" (gecu107)

File: content/authoring/dps/class7sc/ch07.json, 120 questions (20 per concept, 6 concepts, 45 marks per concept). The book was read in full (gecu107 pages 001-016). The previous review was v2 (123 items). The chapter file was rewritten after v2, so every item was read afresh. All keys and numbers were recomputed in python before the keys were read: every cost, difference, ratio, date and time total in the fill_blank, short_answer and case-study items is correct. Each multi_statement and assertion_reason key was worked out from the book first. Every MCQ and match has four distinct options and one key. Every mark scheme sums to its question marks. The correct option is always first in the file because the loader shuffles it (scripts/load-dps-pack.ts). The correct option is the longest in only 10 of 42 MCQs.

Verdict: PASS. HIGH 0, MEDIUM 2, LOW 9.

## v2 findings, status
- Wrong key or second defensible answer: none in v2, none now.
- Easy-in-disguise (94 of 123 in v2): largely fixed. Most Hard items now need data, a comparison or two linked facts. A residue remains (MEDIUM 1).
- Templated multi_statement key spread (S1 always true): fixed. Keys now run 2&3, 1&2, 3 only, 1&3, all three, 2 only.
- Correct option longest (72% in v2): fixed (24%).
- Hedged case-study decisions with two keyed answers (7.2 #20, 7.3 #20 in v2): fixed. The case-study (d) parts are now rule-based. The remaining weakness is forced decisions (MEDIUM 2).
- 7.4 #20(d) in v2 (data did not refute the claim): fixed. The Chennai item now has soil 32 against water 34 indoors.
- "Large water bodies prevent extremes" stated as chapter text (v2 7.4 #9/#14/#19): fixed. 7.4 #5 and #18(ii) now label it an inference from Activity 7.4.
- 7.5 #20(c) pipe and smoke ambiguity: gone. 7.1 #1 "II" format: still bare "II"; fine for a fill_blank.
- The 3-statement multi_statement format is the known bank-wide inconsistency already recorded in CLAUDE.md. It is not repeated as a finding.

## Concept notes
### C7SC-7.1 Conduction
- Recomputed: #0 reversed strip falls IV, III, II, I, so third = II (correct). #12 gaps 60, 80, 100 s, next gap 120 s, so 400 s (correct). #16 58-28 = 30, 41-28 = 13, 33-28 = 5, and 58-41 = 17 (correct). #18 120 s and 200 s, Rs 3,000, and M2 at 270 s is over the 240 s rule (correct). #19 31, 4, 3 degrees; Rs 480, 780, 1,080 (correct).
- #7 multi_statement: S1 false (the book says pins will not fall on wood), S2 and S3 true. Key "2 and 3 only" is correct.
- #8 assertion_reason: A false, R true. Correct.
- #3 (pins at 5, 10, 15 cm on A and B) and #6 (thermometers 90, 62, 41, 30) are real data-reading items, no tell.
- #5 (air gap between two strip halves) goes beyond the book, which says air is a poor conductor. The key hedges "much later (or not at all)". It is fine, but see LOW 5.
- #11 (rods A to D) and #18 (sheets M1, M2) both use the "good conductor base, poor conductor handle" idea. #16, #19 and #9 use it again with handles, so that idea appears about five times. See LOW 7.

### C7SC-7.2 Poor conductors, insulators in daily life
- Recomputed: #2 24 and 11 degrees. #4 13, 3, fall of 10 (correct). #11 fill_blank 36/18 = 2 (correct). #16 28, 14, 17 degrees; Rs 4,400, 7,200, 6,400 (correct; a real trade-off, because steel fails the 60 degree rule, so the pair is the cheapest option that passes). #18 Rs 66,000, 84,000, 36,000 (correct; C fails at 5 degrees, A meets 12 exactly, so A wins by Rs 18,000 over B for 1 degree).
- #5 MCQ has a wording defect. The stem says the milk is "kept in three ways" but gives only two (single tumbler and tumbler inside tumbler). The key is still determinable (LOW 1).
- #9 "NOT the main reason" (clay cup is the key), #12 match, #10 multi_statement (S1, S2 true, S3 false because the book says hollow bricks keep houses cool in summer) are correct.
- #8, #9, #17, #19 and multi_statement #10 all rely on hollow bricks, and #4, #17 and #18 on the hill-house wall. Heavy repetition (LOW 7).

### C7SC-7.3 Convection
- Recomputed: #1 fill_blank 0.5 per minute then 2 per minute, ratio 4 (correct). #14 gaps 19, 4, 1. #16 gaps 0, 18, 12, 2, 0 (correct). #18 0.25 and 1.5 per minute, 6 times (correct). #19 gaps 17 s and 21 s; Rs 3,700 (correct).
- #2 multi_statement: S1 reverses the streak (false), S2 false, S3 true. Key "3 only" is correct. #4 assertion_reason: A true, R false. Correct.
- #0 (candle at the left edge), #3 (two candles) and #6 (heating rod at the bottom or the top) are genuine reasoning items. No second answer. #7 (freezer at top) carries the book's "cooler water comes down" over to air; sound.
- #3: after both cups are heated for several minutes the stick "returns close to horizontal" is reasonable, but the book gives no time scale. It is acceptable.
- #19 smoke alarm: only the ceiling sensor meets the 20 s rule, so the decision is forced (MEDIUM 2).

### C7SC-7.4 Land and sea breeze
- Recomputed: #4 land cooler than sea at 6 am, 8 pm, 11 pm only (correct). #5 5 against 21 degrees range, Town A (correct, flagged as an inference). #8 20/5 = 4 (correct). #14 35 and 47 degrees, 12 degrees apart (correct). #16 rises 18 and 5, falls 17 and 2, 13 warmer then 2 cooler (correct). #17 4 h x 120 = 480 against 9 h x 40 = 360 (correct). #18 4 and 19 degrees.
- #9 multi_statement: S1 true, S2 false (the land cools faster at night), S3 true. Key "1 and 3 only" is correct.
- #6 assertion_reason: both true, R is a use of the breeze, not its explanation. The key is defensible, though some teachers would call R an explanation. It is not a second correct answer under the stated options.
- #11: the strength of the sea breeze at 2 pm against 10 am, and "the wind drops to nothing before it reverses", are not in the book (LOW 4).
- #17 is a real trade-off, because the answer depends on overlap hours.

### C7SC-7.5 Radiation
- Recomputed: #7 15/5 = 3. #12 rises 11, 5, 1. #18 14, 8, 22; only the 1 m side place is at least 20 degrees and not above the stove. #19 rises 4, 14, black 10 hotter, Rs 12,000 and Rs 13,200 (correct).
- #4 multi_statement: all three true (S2 matches the book's "no medium for radiation"; S3 matches the dark-surface line). Key "1, 2 and 3" is correct.
- #3 (best evidence for radiation): the key is the decisive one. Option "face warmer than back" is also consistent with radiation. Under "best" the key stands, but it weakens the item (LOW 3).
- #6 assertion_reason pairs dark clothes with wool trapping air. Both true, no link. Correct but a weak, unrelated pair.
- White and black clothing recurs in #1, #7, #8, #15, #19 and multi_statement #4, which is six or seven items on one idea (LOW 7).
- #12: "no wind" does not remove convection currents sideways at 0.5 m, so radiation as the sole process is stipulated, not shown (LOW 6).

### C7SC-7.6 Water cycle, infiltration, groundwater, ice stupa
- Recomputed: #0 60,000 L. #3 5 m. #10 140/10 = 14. #18 13 m; Rs 1,60,000 and Rs 3,20,000. #19 60 days; 2,25,000 - 1,50,000 = 75,000 L; 1,50,000/90 = about 1,670 L, below 2,000 (all correct).
- #12 multi_statement: S1 false, S2 true, S3 false (the book says depth is "a few metres to hundreds of metres"). Key "2 only" is correct.
- #9 (gravel mixed with clay gives 60 mL): the mixture behaviour is not in the book. The reasoning follows from "wider, open, interconnected" and is acceptable (LOW 5). #13 (paved share against well fall) is a good data item.
- #3 "stands 9 m deep ... 14 m deep" reads as the water depth in the well, so 14-9 = 5 m is the rise. #18 uses "below the ground", so the two items use depth differently. Both are internally consistent.
- #18 and #19: the decision is dominated or forced (MEDIUM 2).

## Findings

HIGH: none. No wrong key, no second correct answer, no arithmetic error, no positional reference. All 12 multi_statement and assertion_reason items have verified keys. No scope violation: all six concepts are covered by pp. 89-104, including the water cycle and ice stupa on pp. 98-101.

MEDIUM
1. Easy-in-disguise residue. Five of the six fill_blank items (7.2 #11, 7.3 #1, 7.4 #8, 7.5 #7, 7.6 #10) are bare ratio arithmetic that needs no science at all, tagged Hard. About 12 more are one-step recall of a book line, tagged Hard: 7.2 #1 (steel or wood cover), 7.3 #11 (incense stick pointing downwards, Exercise 5), 7.3 #15 (balloon), 7.4 #12 (true/false, day and night), 7.4 #13 (Activity 7.4 fair test), 7.5 #8 (Jaisalmer caps), 7.5 #9 (Rina and Sana), 7.6 #2 and #15 (ice stupa timing), 7.6 #6, #8 (transpiration), #17. Fix: replace the five arithmetic items with a reading that needs a book fact (for example, which of two readings shows the better conductor) and raise two or three recall items to a data or reasoning item.
2. Forced or dominated case-study decisions in part (d). The answer is fixed by the stated rule, or one option loses on every axis, so the "weigh and decide" step is not a decision. Worst cases: 7.6 #18 (the pipeline costs more up front, more to run, and the well-life condition favours the pits, so there is nothing to weigh); 7.6 #19 (cutting use fails the 2,000 L floor, so the second stupa is forced); 7.3 #19 (only the ceiling meets 20 s). Milder: 7.5 #18, 7.5 #19, 7.2 #17 (Y is cheaper, 1 degree cooler and suits the summer, so it nearly dominates), 7.1 #16(iv), 7.1 #18. The genuine trade-offs (7.2 #16, 7.2 #18, 7.4 #17, 7.1 #19) show how to fix the others: give the cheaper option a small failing margin or a lifetime figure that cuts the other way.

LOW
1. 7.2 #5 (MCQ): "kept in three ways" but only two are given. Change to "in two ways".
2. 7.6 #3 and #18: "stands 9 m deep" and "21 metres below the ground" use depth in opposite senses. Make #3 say "9 m of water" so that the rise is unmistakable.
3. 7.5 #3: the option "Her face feels warmer than her back" is partly defensible as evidence for radiation. Weaken it (for example, "Her back feels warm too").
4. 7.4 #11: breeze strength at 2 pm against 10 am, and the calm before reversal, are not in the book. Acceptable as reasoning from the land-sea difference, but it is stated as fact.
5. 7.1 #5 (air gap) and 7.6 #9 (clay-gravel mixture) apply book ideas to a new case. The 7.1 #5 key hedges "(or not at all)". Pick one answer.
6. 7.5 #12: add that the room air is still, or ask only for the rise, because side-warming by convection currents at 0.5 m is not excluded.
7. Repeated ideas: hollow bricks and hill-house wall (7.2, 5 to 6 items), white and black clothing (7.5, 6 to 7 items), conductor base and poor-conductor handle (7.1, about 5), ice stupa (7.6, 3), soil-water heating (7.4, expected for the concept).
8. 7.4 #6 and 7.5 #6 assertion_reason: R is a true but unrelated fact, so the item tests recognition of "no link". Correct, but low discrimination.
9. Slot layout is identical in all six concepts (8 short, 4 long, 4 to 5 MCQ, one each of fill_blank, multi_statement, assertion_reason, and match in four concepts). The order within a concept varies, so this is a mild template. The long_answer items always come last or nearly last.

## Counts
Read 120 of 120. HIGH 0, MEDIUM 2, LOW 9. Verdict: pass.
