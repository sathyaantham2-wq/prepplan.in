# Review v2: Class 7 Maths Part I ch 8 "Working with Fractions" (gegp108), dps/class7/p1ch08.json

Read all 143 questions (7 concepts, 20-21 each), none sampled. Every number was recomputed with python `fractions`; facts were checked on the extracted pages. **0 wrong keys, 0 second defensible answers, 0 arithmetic errors.** The two HIGH items and the decimal items of the previous review (v1: 8.6 Q18/Q19 plans, 8.4 decimal prices, 8.7 Q11 copied book exercise) are fixed. Scope is respected (no decimals, percentages, ratio or negatives appear; a few incidental fraction subtractions only). What remains is the "no easy questions" rule: about 30 items are one-step or one-line-rule items whatever their Bloom label.

Book facts verified on the pages: Brahmagupta's formula, Brahmasphutasiddhanta 628 CE (p.010, 017); Baudhayana's Sulbasutra c. 800 BCE with the 7 1/2 sq units / bricks of side 1/5 example (p.018); Bhaskaracharya's Lilavati, 1150 CE, 1 dramma = 1280 cowrie shells (p.021). The pack uses only: "Baudhayana's problem" bricks (8.7 Q15), "Bhaskaracharya's tale ... 1280" (8.7 Q10, Q9), "Brahmagupta's formula" (8.3 Q9, Q13). All consistent with the book; no date or claim is stated beyond it. Items left unchanged from the backup were checked for key correctness (all correct); no item was relabelled (Bloom labels equal the backup's for all unchanged texts); the four `match` items are new.

## HIGH
None.

## MEDIUM

1. **Easy-in-disguise (30 items; whatever the Bloom label).** Each is answered by one multiplication or division, or by the chapter's one-line size rule, with no choice or comparison to make. Replace or deepen (add a second stage, a comparison, a constraint or a flaw to find).
   - 8.1: Q2 (7 x 1 1/2), Q3 (9 x 5/6), Q19 (6 x 3/4), Q5 fill_blank (18 x 5/6), Q12 AR (R is the book's meaning of "3/7 x 4", both true, R explains: the default cue answer).
   - 8.2: Q2 (2 shaded of 3 x 5 parts), Q9 AR (1/6 x 1/7 = 1/42, with the size rule as R), Q11 (1/4 x 1/6), Q15 (3/5 x 5/9, single product).
   - 8.3: Q3 and Q21 (rate x fraction of an hour; the same item twice), Q10 and Q20 (cancel and multiply; Q10 is tagged `scenario` but has no scenario).
   - 8.4: Q5 (20 x 5/4 vs 20 x 3/4), Q8 fill_blank ("between": the rule, with the three choices written in the stem), Q13 AR (R "the product is always larger than both" is absurd), Q17 (three look-ups of the book's table), Q20 (which multiplier exceeds 1).
   - 8.5: Q1 (1/2 / 6), Q4 fill_blank (10 / 2/3), Q10 (3 / 3/8), Q16 (5 / 3/4), Q21 (3 3/4 / 1/4).
   - 8.6: Q4 (5 / 5/6; the options carry the reasoning), Q11 fill_blank (15 / 20), Q14 (3/4 / 1/8), Q15 (3/4 / 3).
   - 8.7: Q2 fill_blank (7 1/2 / 3/10), Q8 AR (R "of means addition" is absurd), Q20 (1/4 of 4/5).
   - Borderline (not counted): 8.4 Q2(b) (name the order property), 8.4 Q14 and 8.6 Q2 claim-checks that agree with the book's rule, 8.5 Q12 (self-reciprocal is 1), 8.6 Q10, 8.1 Q4.
   Fix: for each pair of duplicates keep one and replace the other with a different shape (an error to find in a two-stage computation, a "which is greater without computing" comparison with a non-obvious winner, a missing-number puzzle like 8.6 Q17 which is good).
2. **C7M-8.2 Q1 vs Q5: row/column convention contradicts.** Q1 stem fixes 4/6 x 3/5 as "5 rows and 6 columns" (rows from the second fraction's denominator); Q5 key says 2/5 x 3/4 is "5 rows and 4 columns" (rows from the first). The book (p.178-181) says rows = denominator of the multiplicand, columns = denominator of the multiplier, and its own examples are not consistent in which fraction is written first. Fix: Q5 key "20 equal parts of which 6 are shaded" with no rows/columns; Q1 stem "a unit square cut into 30 equal parts (5 by 6)".
3. **fill_blank answers not unique to a machine.** 8.2 Q4 (5/6 m by 3/10 m, key `1/4`; `15/60` and `0.25` are also correct) and 8.6 Q11 (15 litres into 20 cans, key `3/4`; `15/20`, `0.75`). Add "(in lowest form)" to the stems. (8.3 Q8 already says it.) 8.4 Q8 `between` is a rule recall with the options in the stem; replace with a computed value.
4. **Repeated ideas inside concepts.** 8.3: "cancel only numerator with denominator" appears in Q6 (AR), Q12 (claim-check), Q17 (error find) and Q18 (true_false): 4 of 21; change Q17 to a different error (e.g. forgetting to write n as n/1). 8.5: "total / size of one piece, how many" in Q4, Q10, Q16, Q20, Q21 (5 of 21). 8.6: Q10 (12 / 1/2, 1, 4) and Q19 (6 / 3/2, 3/4, 3) are the same item, and Q16 is a third version. 8.7: Q9 and Q10 are both the miser chain with 1280 shells; Q11 and Q15 are both "area / brick area" (Baudhayana's bricks). 8.4: Q14 and Q15 test the same "multiplier below, equal, above 1" with new numbers. 8.2: rectangle area from fractional sides is 7 of 20 (Q3, Q4, Q6, Q7, Q8, Q13, Q15). Fix: replace one of each pair.
5. **Cross-concept mirrors (8.4 and 8.6 are the same concept in two operations).** 8.4 Q14 / 8.6 Q2 (claim-check "factor/divisor above or below 1", test values, verdict Yes), 8.4 Q15 / 8.6 Q19 (one number, three multipliers/divisors), 8.4 Q18 / 8.6 Q18 (true_false size rule), 8.4 Q4 / 8.6 Q9 (show impossible). Change the operation or the shape in one of each pair.
6. **Assertion-reason cues.** Of 7 AR items, 8.4 Q13 and 8.7 Q8 have an obviously false R ("always larger than both", "of means addition"), and 8.1 Q12 has R restating the definition: the key is guessable without the chapter. Make R a plausible but wrong rule (e.g. "dividing 4 into 7 parts and taking 3 means 3 x 7") or a real rule that does not explain.

## LOW

7. 8.6 Q6 AR: A states a value (6) and a comparison; R explains only the comparison. Keyed "R explains A", yet 8.5 Q15 (A value, R size rule) is keyed "does not explain". Make A only "3/4 / 1/8 is greater than 3/4".
8. true_false without a misconception: 8.2 Q5 (True, re-checks a correct computation) and 8.5 Q11 (True, equal counts). Verdict mix is 3 True / 4 False (43/57%), within limits, but make 8.2 Q5 a False version (e.g. "5 shaded").
9. Claim-checks: verdicts are Yes x4 (8.1, 8.2, 8.4, 8.6), No x2 (8.5, 8.7), "partly" x1 (8.3). The mix is acceptable, but the four Yes claims all restate the chapter's rule, so they are easy; make one Yes claim carry a subtle error to find.
10. Case-study decisions: 8.3 Q7 (d) "should the teacher allow Rani double time" is near strawman; 8.5 Q14 (d) is nearly forced (a Rs 50 piece covers the shortfall) and its (a) (32 badges) is not used later; 8.2 Q3 (d) is forced by Rs 93 > Rs 90. Good real trade-offs: 8.1 Q10, 8.1 Q11, 8.2 Q10, 8.3 Q19, 8.4 Q9, 8.4 Q11, 8.5 Q18, 8.7 Q12, 8.7 Q13.
11. Incidental subtraction/addition of unlike fractions (scope_out "adding/subtracting fractions as its own topic"): 8.2 Q10 (1/2 - 1/6 - 1/6), 8.7 Q16 (1/4 + 1/3 as the distractor logic), 8.7 Q17 (4/5 - 3/10 - 1/5), 8.7 Q18 (3/4 - 1/2). Not asked as a skill; keep or give the remainder in the data.
12. 8.3 Q10 tagged `scenario` but is a bare computation; retag or give a setting.

## Template and count checks
- Questions: 143. Bloom: Apply 72, Analyse 38, Evaluate 23, Understand 5 (3.5%), Create 5, Remember 0. Analyse/Evaluate/Create = 66 (46%): loader limits met. `d`: Hard 115, Hardest 28, Easy 0.
- Types: short_answer 58, mcq 32, long_answer 28, fill_blank 7, multi_statement 7, assertion_reason 7, match 4, true_false (tag) 7, claim_check 7, reverse 5, show_impossible 3. Per concept: 8+ one-mark (8 or 9), 5-6 two-mark, 3 three-mark, 2 five-mark, 2 case studies (80-156 words, 3-4 parts). Step marks equal the item marks in every item; no option named by position; every key is an option.
- Slot order differs in every concept (strings compared): not identical. The mark profile (8/5/3/2/2) is the same in all seven, as the standard prescribes.
- `multi_statement` keys: 1 and 3 only (8.1, 8.4), 1 and 2 only (8.2, 8.5), 2 and 3 only (8.3), 1 only (8.6), 3 only (8.7). The false statement lands on S1 x1 (plus S2, S3 in 8.6), S2 x2, S3 x2, and 8.6/8.7 have two false statements: well spread.
- `assertion_reason` keys: R explains x2, not explain x2, A false R true x1, A true R false x2: well spread.
- claim-check verdicts: Yes 4, No 2, partly 1. true_false: True 3, False 4.
- Correct MCQ option longest: 2 of 32 overall (8.2 Q17, 8.6 Q13); among the 11 MCQs with text options it is 2 of 11. No length cue. (Numeric options are of equal length.)
- Repeated ideas: see MEDIUM 4 and 5.

## Per-concept verdict
- C7M-8.1 (20): keys right; swap Q2/Q3/Q19/Q5/Q12 for deeper items; Q10, Q11 case studies good. Pass after fixes.
- C7M-8.2 (20): keys right; fix convention (Q1/Q5) and fill_blank Q4; replace Q2, Q9, Q11, Q15; Q8 and Q10 good. Pass after fixes.
- C7M-8.3 (21): keys right; four items on one cancelling idea; replace Q3/Q21 duplicate and Q10/Q20; Q19 case study is a real trade-off. Pass after fixes.
- C7M-8.4 (20): keys right; five rule-lookups (Q5, Q8, Q13, Q17, Q20) and the Q14/Q15 duplicate; Q9, Q11 are strong. Pass after fixes.
- C7M-8.5 (21): keys right; six single divisions; Q9, Q18 and the match are good. Pass after fixes.
- C7M-8.6 (20): keys right, v1 HIGH issues fixed (30-cup limit stated; two plans stated); Q10 duplicates Q19; fill_blank Q11 unit. Pass after fixes.
- C7M-8.7 (21): keys right; v1 copied exercise removed; Q9/Q10 and Q11/Q15 duplicate; Q8 AR cue; Q12, Q13 good. Pass after fixes.

## Count
143 read; keys recomputed, 143/143 correct. HIGH 0, MEDIUM 6, LOW 6 (items 7-12). Easy-in-disguise 30 (borderline 6 more). Templated at the sentence level: no; repeated ideas: yes (pairs listed). Verdict: pass after fixes.
