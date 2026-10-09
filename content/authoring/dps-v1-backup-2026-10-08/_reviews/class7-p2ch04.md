# Review: DPS Class 7 Maths, Part II ch 4 "Another Peek Beyond the Point" (gegp204)

File: content/authoring/dps/class7/p2ch04.json. Questions read: all 149 (21+21+21+21+22+21+22), none sampled. Every decimal, remainder, leap-year count and money figure was recomputed in Python (Decimal and integer long division). The loader's `--check` could not be run (no `timeout` binary on this machine; not retried).

## Result of the recomputation
No wrong key, no second defensible option, no arithmetic or fact error found. All 149 keys, all case-study parts (a)-(d), all step-mark figures, the remainder lists (2/7, 1/7, 3/7, 1/13, 1/6, 100/11) and the leap-year counts (24, 97, 485, 2425, 2921, 3287) check out. Scope: no bar notation, no rounding to places, no cyclic-number / Artin / Hidato material found (the "..." notation is used throughout).

## HIGH
None.

## MEDIUM (fix before this counts as DPS standard)

1. Whole chapter is templated by slot. Every concept has the identical shape: 6 mcq + 1 match + 1 multi_statement + 1 assertion_reason + 8 (9 in 4.5, 4.7) short + 4 long, and the same index positions carry the same item kind in all seven concepts: #3 is always a "Which ... is NOT / does ... come to an end" mcq with rev, #4 the match, #5-#6 the two scenario mcqs, #7 multi_statement, #8 assertion_reason, #12/#13 always "X writes ... Name the mistake and give the correct value", #14 claim_check, #15 show_impossible/reverse, #16 a money/measure word problem, #17-#18 "given/compute (a)-(e)" long answers, #19-#20 two case studies. Fix: re-cut at least 3 concepts so slot order, long-answer kind (e.g. one "explain why" 5-marker, one error-analysis 5-marker) and the type of the hard mcq differ; do not give every concept exactly one mistake-naming item with the same "Name her mistake and give the correct ..." frame.

2. Claim-checks are 7/7 verdict "No" (4.1 Rohan, 4.2 Dev, 4.3 Anita, 4.4 Imran, 4.5 Tanvi, 4.6 Rahul, 4.7 Ritu). Each is also built "X says <absolute>. Do you agree? Test with ...". Fix: make at least 2 of them correct claims (for example 4.3: "0.9 x 250 is less than 250 because 0.9 < 1", 4.7: "2400 is a leap year because 2400/400 = 6" with a justification to check, or 4.2: a claim that 2.5 x 0.4 is a counting number), keyed "Yes, because ...", or make a claim half-right.

3. Case-study (d) is often a computation, not a decision. C7M-4.5 #21 (bus: only the highway meets 1.5 h; the hill road at 2 h is simply out), 4.6 #20 (3/7 six-digit block vs a three-digit poster: answer is forced), 4.6 #19 (8 vs 11 volunteers "to pay exactly": forced), 4.1 #20 (fits/does not fit, then halve), 4.3 #20 (budget left), 4.7 #20 (pack arithmetic). Good real trade-offs, keep as models: 4.2 #19 (A vs B, difference Rs 2, spare carpet), 4.3 #19 (deal 1 vs deal 2 with break-even about Rs 667), 4.4 #19, 4.4 #20, 4.5 #20 (blouse earns Rs 160 more, 0.4 m wasted), 4.1 #19 (Rs 100 more for tins, break-even Rs 2). Fix the weak ones by giving both options a real advantage (e.g. 4.5 #21: highway shorter but toll or higher fuel use; 4.6 #20: add a second candidate whose block fits but is hard to read).

4. Part (a)/(b) of several case studies are one-step arithmetic that the stem practically prints (4.7 #20 (a) "365 since 2100 is not a leap year" restates a rule given in the concept; 4.1 #19 (a) 7850 g to kg; 4.5 #21 (a),(b) speeds). The parts do climb overall, but the first two parts add nothing for the DPS "gets harder" requirement. Fix: make (a) the first genuine decimal step of the chapter (e.g. 4.7 #20 (a): "pages for 2096 to 2099").

5. Items copied from the textbook with its numbers unchanged (QUESTION_STANDARD asks for fresh numbers). Textbook-verbatim: 23.02 x 100 (4.1 #2); 678 / 1000 (4.1 #1); Jonali, 50 g cinnamon, 100 g cumin?, 25 g cardamom, 250 g pepper (4.1 #5, #16); 596 x 248 = 147808 (4.2 #0); 5.8 x 1.24 = Example 5 (4.2 #3, as the correct option); 0.432 x 0.23 appears three times in one concept (4.2 #1, #7, #12); 18 x 12 / 1.8 x 1.2 (4.3 #2, #4); 0.306 and 24.67 (4.3 #13); 126 / 8 and 0.126 / 8, 1.32 / 4 (4.4 #2, #7, #14); 4.68 / 0.13 and 4.68 / 1.3 appear four times in 4.5 (#0, #3, #7, #13); 5.728 / 1.52 (4.5 #1); 128 / 0.4 appears three times in 4.5 (#2, #8, #14); Sridharacharya 6 1/4 / 2 1/2 (4.5 #11); 10 / 3, 1 / 7, 100 / 11 across 4.6 (these are the book's own cases and can stay for recall, but vary them in the hard items); 4.7 #19 is the book's "Try This" word for word (10,000 years). Fix: keep each textbook example at most once per concept (as recall) and change the numbers in the others (e.g. 0.532 x 0.27 for 4.2 #7/#12, 7.35 / 0.15 for 4.5 #3/#13).

6. C7M-4.3 #13 is mis-filed and unclear: "Complete the table row by multiplying 0.306 and 24.67 as asked: (a) 0.306 x 10 and 0.306 x 1000 (b) 24.67 x 100." There is no table in the stem, and multiplying by 10/100/1000 is C7M-4.1 content, not "size of a product". It also uses the book's table numbers. Fix: replace with a 4.3-skill item (e.g. "Given 45 x 22 = 990, write 4.5 x 22 and 0.45 x 0.22").

7. Near-duplicate pair inside C7M-4.7: #11 ("How many of 100 calendar years stay leap years ... total days") and #13 ("leap years 2001 to 2100 ... total days") both compute 24 x 366 + 76 x 365 = 36524. Also #5, #17 and #20 all use the same 2096-2104 window. Fix: change #13 to 1901-2000 or 1801-1900 (24 leap years, 36524 days is the same count, so rather use 2001-2200 for 48 leap years), and move #17 to a different century boundary (1897-1904).

## LOW

8. C7M-4.3 #5 (Mehul 0.8 kg at Rs 250/kg): the keyed statement compares the bill (rupees) with 0.8 (kg), which is unit-mixed and vacuous. Fix: ask "which is certain: the bill is less than Rs 250" with distractors on the other side.
9. C7M-4.7 #2 distractors (365.4222, 364.2422, 366.2422) are digit shuffles, not chapter confusions. Fix: use 365, 366, 365.25 (the book's near-values).
10. C7M-4.6 #3 carries `rev: true` but the stem has no reversal word ("Which of these divisions comes to an end?"); 4.4 #3 and others with NOT are correctly flagged. Remove the flag or reword to "does NOT come to an end".
11. C7M-4.5 #19 "Complete a table ..." and 4.3 #13: no table is printed; reword "Find".
12. C7M-4.5 #17 key ends "which is 20" (should read "which is the original 20").
13. C7M-4.3 #17 key writes "0.0360", inconsistent with the 0.036 in the working.
14. C7M-4.4 #17 step wording: "4 hundreds = 40 tens" is correct, but the stem asks to "show how the 4 hundreds ... are handled" while the dividend is 453; fine, but state "453 = 4 hundreds, 5 tens, 3 ones" so a Class 7 reader does not wonder about 4 / 8.
15. Settings: nearly every case study is "a school in <city> ... annual day / picnic / canteen" (4.1 #20, 4.2 #19, 4.3 #19/#20, 4.4 #19/#20, 4.5 #21, 4.6 #19, 4.7 #20). Indian and plausible, but vary at least three (market stall, railway, farm, post office).
16. Absolute-word falsity: false statements hinge on always/never/every/any in 4.1 (none), 4.2 #14, 4.3 #7/#8, 4.5 #14, 4.6 #7/#14. Acceptable in number, but together with item 2 they make the "absolute means false" cue exploitable; two of them should be absolute and true (e.g. "dividing by 1000 always moves the point three places left").
17. Option length: correct option is the longest in 5 of 63 option items (4.2 one, 4.3 one, 4.4 two, 4.6 two); not systematic. OK.

## Checks that passed
- Assertion-reason keys vary (explains: 4.1, 4.4, 4.7; not-explanation: 4.2, 4.6; A true R false: 4.3; A false R true: 4.5). Not all "R explains A". Each A and R truth was checked.
- multi_statement: false statement position varies (S2, S3, S1, S2+S3, S3, S1+S2, none) and keys vary ("1 and 3 only", "1 and 2 only", "2 and 3 only", "1 only", "1 and 2 only", "3 only", "1, 2 and 3"). 4.2 and 4.5 both key "1 and 2 only"; vary one.
- Match items: all 7 are consistent, one-to-one, distractor orderings are real swaps.
- Step marks name real points everywhere; case studies are 4 x 1 mark for four parts; long answers sum correctly.
- Scope: no bar notation, no rounding to places (4.6 truncation to digits is long division, not rounding), no cyclic-number or Artin item.
- Cross-concept near-duplicates: none beyond the 4.7 pair and the textbook repeats noted above.

## Per-concept verdicts
- C7M-4.1 (21 q): keys all correct; sound, but textbook numbers in 3 items and 4.1 #19 (d) is a clean trade-off. Medium: items 1, 5.
- C7M-4.2 (21 q): keys correct; 0.432 x 0.23 used three times; claim-check "No". Medium: items 2, 5.
- C7M-4.3 (21 q): keys correct; #13 off-concept and unclear (item 6); #5 unit-mixed (8). Case study 4.3 #19 is a good decision.
- C7M-4.4 (21 q): keys correct; best case studies in the chapter (4.4 #19, #20); 126 / 8 repeated.
- C7M-4.5 (22 q): keys correct; 4.68 / 0.13 four times and 128 / 0.4 three times; 4.5 #21 decision forced (item 3).
- C7M-4.6 (21 q): keys correct, remainder lists verified; case-study decisions forced (item 3); #3 rev flag (10).
- C7M-4.7 (22 q): keys correct (24, 97, 485, 2425, 2921, 3287, 146097 all verified); duplicate pair #11/#13 and repeated 2096-2104 window (item 7); #2 distractors weak (9).

## Count read
149 of 149 questions (4.1: 21, 4.2: 21, 4.3: 21, 4.4: 21, 4.5: 22, 4.6: 21, 4.7: 22); nothing sampled.

## Overall
Content is accurate and in scope; it is not recall in disguise (the case studies and 5-markers need multi-step decimal work). It falls short of the standard on templating (items 1, 2), weak case-study decisions (3, 4) and textbook-number reuse (5). Fix the Medium items; no key needs changing.
