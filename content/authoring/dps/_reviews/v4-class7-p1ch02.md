# Review v4: DPS bank, Class 7 Maths Part I ch 2 "Arithmetic Expressions" (gegp102)

File: content/authoring/dps/class7/p1ch02.json (150 items, 7 concepts). Latest earlier review: v3-class7-p1ch02.md.
Method: every item read; keys recomputed in Python (all multi_statement statements, all assertion_reason claims, every match, every mcq whose options are expressions) and by hand for the multi-part items (every part of every long_answer / case study). Structural checks in code: correct option is `o[0]` for all 68 option-bearing items, options distinct, no positional option reference ("option b", "above", "none of"), step-mark totals equal `m` for every item.

## Verdict: PASS (0 HIGH, 0 wrong keys, 0 second defensible answers; a short list of optional polish items)

## Did v3's findings get fixed?
The chapter file has not changed since v3 (file time 04:48 precedes the v3 write-up at 04:55; the text of every item v3 cites is identical to what is on disk now). So none of v3's remaining MEDIUM/LOW swaps were applied. They were all swap-level items, none touched a key, and none was HIGH. Status of the v3 list:
- v3 HIGHs (2.6 #19 and 2.7 #3 step lines): still fixed; step totals match stem, key and `m` everywhere (checked by code).
- v3 MEDIUM, 2.3 #6 and #11 use the identical false regrouping (7 - 3) - 5 = 7 - (3 - 5): NOT fixed (see below).
- v3 MEDIUM, "put brackets to hit a target" is 5 of 21 in 2.4 (#2b, #9, #12, #21b, plus #4): NOT fixed.
- v3 MEDIUM, "round number plus or minus a little" is 10 of 21 in 2.7: NOT fixed.
- v3 MEDIUM, "pair to a round number" (2.3 #12, #14, #17, #19) and the 2.5 plus-bracket/minus-bracket contrast cluster: NOT fixed.
- v3 LOW 2.3 #3 option 1 "27 and 36 cannot be added" still disputable; 2.7 #7 and 2.5 #3 are True with no misconception; 2.7 #11 and #18 both snails: all NOT fixed.
- v3 note on 2.7 #11 stored answer (explanation appended to the option text): re-checked against scripts/load-dps-pack.ts. The loader treats `o[0]` as the correct option and stores `a` only as the answer text shown after submit, so the appended explanation does not mis-mark anything. Downgraded to cosmetic (no action needed).
- v3 remark that "two-statement house style" applies: retracted correctly in v3; the dps-question-style skill asks for three-statement multi_statement items, which this chapter has (7 of 7). No issue.

## Keys recomputed (before reading the stored keys)
- multi_statement (7): 2.1 #17 (S1 50 true, S2 down by 5 true, S3 463 = 463 so false) = "1 and 2 only"; 2.2 #1 (S1 value 40 and 3 terms true, S2 false, S3 inverse cancels, 100) = "1 and 3 only"; 2.3 #8 (S1 5 vs -5 false, S2 true, S3 both 0 true) = "2 and 3 only"; 2.4 #13 (S1 20 true, S2 22 not 10 false, S3 130 - 10 = 120 true) = "1 and 3 only"; 2.5 #11 (S1 19 vs 31 false, S2 32 vs 40 false, S3 62 = 62 true) = "3 only"; 2.6 #14 (S1 true, S2 23 vs 35 false, S3 63 vs 99 false) = "1 only"; 2.7 #17 (S1 uses +2 not -2 false, S2 true, S3 false) = "2 only". All seven match. Each has exactly one defensible option.
- assertion_reason (7): 2.1 #13 (1,755 < 1,756, net +1, R explains) ok; 2.2 #9 (three terms true, R false) ok; 2.3 #11 (A true, R false) ok; 2.4 #19 (50 true, R explains) ok; 2.5 #22 (value is 75 not 55, so A false; R true) ok; 2.6 #13 (A true, R false: the property also covers subtraction, see 2.6 #1, #4) ok; 2.7 #11 (snail reaches 10 cm on day 8, so A false; R true) ok.
- match (4): 2.1 #14 (170, 33, 26, 25), 2.3 #15 (81, -7, 8, 31), 2.5 #9, 2.7 #12 (360, 290, 215, 212): each has exactly one correct mapping and the three wrong options are each wrong in at least two pairs.
- mcq with expression options: 2.1 #9 (only 4 x 25 - 45 - 30 gives 25, the others give 85), 2.2 #11 (only one of four has a negative term of -20), 2.3 #18 (only 25 - (14 + 9) - 6 changes the value, -4 against 14), 2.4 #6 (90 only from 120 - (4 x 5 + 10)), 2.4 #9 (30 only from 60 - 6 x (3 + 2)), 2.4 #10 (53 vs 77, difference 24), 2.5 #1, #6, #18, #21 (88 vs 120 and the others), 2.7 #4: all unique.
- Long answers and case studies, every part: 2.1 #3, #8, #20; 2.2 #6, #8, #13, #18; 2.3 #2, #5, #21, #22; 2.4 #3, #5, #8, #17, #20; 2.5 #4, #7, #12, #16; 2.6 #8, #10, #17; 2.7 #2, #5, #8, #10. All values, break-even points (100 guests; 3 absences; 133.3 pieces not asked) and the "which is cheaper by how much" results agree with the keys. 0 wrong keys.

## Scope (against structure/class7-maths-part1-ch02-08.md OUT list and the book text gegp102)
- MEDIUM (new, v3 said "no scope_out violation"): 2.1 #18 writes "2 x a + 2 x b where a and b are whole numbers". The chapter's OUT list excludes "variables/unknowns" (letter-numbers are chapter 4). The argument (two even numbers add to an even number) is also Class 6 content, not taught here. Fix, smallest: replace the letters with a concrete decision, e.g. "Which of 48, 51, 66, 70 cannot be written as 2 x a number + 2 x another number? Give a reason", or use boxes as in 2.1 #7.
- Everything else is in scope: no BODMAS acronym, no nested brackets (2.5 #17 has two separate brackets, not nested), no powers or fractions, tokens and "inverse of a term" are taught on p5 and p7 of the source, negative terms inside a bracket (2.5 #3, #9, #18) rest on the Class 6/Chapter 1 integer rules and the book's own sign-change examples.

## Defects that still stand (all swap-level; none changes an answer)
MEDIUM (repeated ideas; each is a quick swap, none blocks loading):
1. 2.3 #6 and #11: same false rule on the same expression, (7 - 3) - 5 against 7 - (3 - 5). Change #11's R to a different false reason (for example "Regrouping terms changes the sign of the terms moved"). Also 2.3 #1 and #8 S1 are the same swap error, so four items on "subtraction cannot be swapped".
2. 2.7: ten of 21 items rewrite one factor as "round number plus or minus a little" (#3, #4, #5, #6, #8, #9, #14, #16, #17, #21). Replace #21 and #9 (the thinnest) with a different shortcut (for example 25 x 48 = 100 x 12, or 5 x 72 + 5 x 28 = 5 x 100).
3. 2.4: "place brackets to hit a target" appears in #2b, #9, #12 and #21b. Keep #9 and #12; change #2b and #21b.
4. 2.5: the a + (b - c) against a - (b + c) contrast is in #7, #13, #15, #16, #20 and #21 (six of 22). Replace #15 or #20 with a refund-style case like #12.
5. 2.2 and 2.4: "a product term must not be split by a bracket or a missing sign" recurs: 2.2 #2, #8(b)(c), #16, #19; 2.4 #3(c), #11, #21. 2.4 #3(c) Bilal and #11 Anwar are literally the same slip.

LOW:
- 2.4 #3(c) key: Dev's route is described as "worked left to right" but the stated steps (18 + 24 = 42, 42 - 24 = 18, 18 / 3 = 6) multiply first and then go left to right; a strict left-to-right gives 36, not 6. Reword to "did the product 4 x (11 - 5) correctly but then worked the remaining +, -, / strictly left to right".
- 2.3 #3 option 1 says "27 and 36 cannot be added" (27 + 36 = 63 can be added; the issue is that the term is -27). Reword to "the second term is -27, not 27, so -27 + 36 = 9 and the answer is 73". The correct option is also the longest by far. Same for 2.4 #18.
- True/False keyed True with no misconception tested: 2.5 #3 and 2.7 #7 (make the second 4 x 7 x 15 - 4 x 15, which is False). Claim-checks keyed "Yes": 2.3 #19, 2.6 #6 (add a faulty reason).
- 2.7 #11 and #18: two snail items; 2.2 #20 and 2.3 #20 are both "which single move returns the score to 0".
- Decision parts that are close to settled by the stem: 2.3 #2(d) (21 m against 38 m with a 30 m cap), 2.4 #17(d) (either choice accepted, tied to a number: acceptable), 2.6 #8(d) (hedge "if the extra 10 students really come" is fine).
- 2.5 #11 has no "1, 2 and 3" option, so "3 only" can be reached by elimination (the only option with 3 alone).
- Thin one-step items, each 1 to 2 marks (not counted as easy-in-disguise): 2.1 #1, #6, #11, #12; 2.6 #11, #21; 2.7 #13, #20. These are single story-to-expression translations; fine in a paper that needs a few warm-up items.

## Other counts
- Easy-in-disguise (strict: one-step lookup or evaluation with no trap or decision): 13 of 150 (8.7%), the same set v3 listed (2.2 #15/#21, 2.3 #10/#14/#17/#19, 2.4 #19, 2.5 #2/#21, 2.6 #6/#11, 2.7 #9/#13). Under the bar for a chapter of this level; swap when convenient.
- Strawman case studies: none. All 14 case studies have a number-backed decision (reserve fund, permit cap, break-even guests, package against separate tickets, break-even absences, cheapest plan per item).
- Option-length template: correct mcq option is strictly longest in about 15% of mcqs; no template.
- Answer-key spread: multi_statement keys differ (1 and 2 only; 1 and 3 only twice; 2 and 3 only; 3 only; 1 only; 2 only); assertion_reason keys include both-true-explains x2, A-true-R-false x3, A-false-R-true x2 (the "both true, R not the explanation" outcome is absent; optional: turn 2.4 #19 into it).

## Overall
0 HIGH, 6 MEDIUM (five repeated-idea clusters plus the scope slip in 2.1 #18), about 12 LOW. Keys, step marks and options are sound. Verdict: pass. The chapter can load as is; the 2.1 #18 variable-letter item and the 2.3 #6/#11 duplicate are the two swaps worth doing first.
