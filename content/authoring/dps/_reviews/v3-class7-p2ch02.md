# Review v3: content/authoring/dps/class7/p2ch02.json (C7M-2.1 to 2.7, Operations with Integers, gegp202)

Method: all 144 items read (21+20+21+20+21+20+21). Every numeric key, case-study part, match mapping and the 2.7 #13 extremum were recomputed independently (python brute force for 2.7 #13 and 2.7 #3(d)), then compared with the stored key. Compared against v2 (latest earlier review): the file was rewritten after v2 (file time later than v2), so v2's "78% unchanged, 53% easy" no longer describes it.

## Previous findings (v2) status
- Wrong keys / HIGH: none in v2; none now.
- v2 MEDIUM "easy-in-disguise 77 of 144": largely fixed. Old one-step items (book-copy hot spots, e.g. 2.2 #20 Figure-it-Out copy, 2.3 #6 table, 2.5 Examples 1-2 copies) are replaced by error-finding, comparison and decision items. About 22-25 one-step items remain (listed below).
- v2 "2.1 #20 and 2.5 #17 true_false must not be plain True restatements": 2.1 true_false is now False with a misconception (fixed); 2.5 #17 is still True (kept, but now a genuine non-obvious fact, 50 is reachable, so acceptable).
- v2 claim-check verdict skew (5 Yes / 2 No): now mixed (No 2.1, 2.3, 2.7; Yes 2.4; partly 2.2, 2.6; Yes 2.5): fixed.

## Keys: all 144 recomputed, no wrong key, no second defensible answer among the MCQ/AR/MS options
- multi_statement (7): 2.1 #16 "1 and 2 only" (3 false: -11 reds); 2.2 #2 "1 and 3 only" (2 is 5 x (-3), not (-5) x (-3)); 2.3 #18 "2 and 3 only"; 2.4 #5 "1 only"; 2.5 #5 "1, 2 and 3" (42-12=30; 24000-24000=0; 20-200=-180); 2.6 #7 "2 only"; 2.7 #12 "3 only" (both -288). All correct, 2-statement format, keys spread (not all "all true").
- assertion_reason (7): 2.1 A false R true; 2.2 A true R false; 2.3 both true, R not explaining; 2.4 both true, R explains (6 x (-25) and (-6) x 25 both -150); 2.5 both true, not explaining; 2.6 A false (5 negatives, product -120) R true; 2.7 both true, not explaining. All correct. Spread good.
- match (4): 2.1 #14, 2.3 #3, 2.5 #21, 2.7 #7 all recomputed, unique mapping.
- 2.7 #13 brute-forced over every bracketing with each of +,-,x once and 4,-3,2,-5 once: max 45, min -45. Key right.
- 2.7 #3(d): 11a - 7b = 6 has no solution with a+b <= 9; least is a=5, b=7 (12 tokens). Key right.
- 2.3 #16 counts (10, 10, 20), 2.4 #9 (12 and 16), 2.5 #19 (63, 69, 70, 71), 2.3 #20, 2.1 #21, 2.4 #14 (15+10=25, battery 25, exact), 2.5 #6 (34 min exact) recomputed: right.
- No positional option references ("the first option", "option A" etc.): none found. Option-order cue: correct MCQ option is the longest in 3 of 29 plain MCQ; no cue.

## HIGH
None.

## MEDIUM
1. 2.3 #14 range ambiguity. "both lying between -12 and 12" with key including (-2, -12). If "between" is read as exclusive (the usual reading), -12 is not allowed and only (-3, -8), (-4, -6) qualify, so the stated three-pair key is contestable. Fix: say "from -12 to 12 inclusive" or change bounds to "between -13 and 13".
2. Repeated ideas inside concepts. 2.1: the sum-and-difference puzzle ((S+D)/2) is the core of 7 of 21 items (#3, #5, #6, #9, #10, #13, #14); 2.5: test-marking / gain-loss tallies appear in about 9 of 21 (#1, #5, #8, #10, #12, #17, #19, #20, #21); 2.2: loss-times-count repeats in #4, #12, #13. Replace 2 items in each of 2.1 and 2.5 with other ideas (e.g. 2.1: temperature differences across several days; 2.5: mixed expression with a bracket and order of operations).
3. Easy-in-disguise remnants (labelled Analyse/Hard but one step or guessable): 2.1 #7, #8, #18; 2.2 #6, #9, #15, #17; 2.3 #1, #2, #5, #9, #12, #15, #21; 2.4 #12, #16, #18, #20; 2.5 #3, #13, #18; 2.6 #2, #12, #13, #15, #16; 2.7 #5, #6, #15, #20. About 30 of 144 (20 percent), mostly 1-mark MCQ and fill_blank, down from 53 percent. Not a blocker but the "Hard" label overstates them. Worst: 2.6 #12 (answer is the word "even" with the choice stated in the stem, 50 percent guess) and 2.3 #9 / 2.7 #15 / 2.4 #20 (odd-one-out, one product each).
4. Weak decision cases. 2.2 #12 part (d): selling cold samosas at -5 versus throwing them at -8 has only one sensible answer; 2.1 #5 part (d): once -12 is below the -10 rating the choice is forced; 2.5 #6 and 2.4 #14 are tuned to land exactly on the limit (34 and 25), which reads as contrived but is not wrong. The real trade-off cases are 2.1 #21, 2.2 #13, 2.3 #20, 2.4 #3 and 2.7 #1; give 2.2 #12 a real competing cost.

## LOW
- 2.2 #5: the stem asks "which pair has the same value" but (-78) x (-94) and 94 x 78 are also equal (7332); only the option wording (-7332) keeps it from being a second answer. Rephrase: "Which pair has the same value, and what is it?"
- 2.2 #11 (a): "every product of a positive and a negative integer" could admit (-6) x 9 as a product of a negative and a positive; the stem's "placing groups" fixes the first factor as positive. Add "written with the number of groups first".
- 2.6 #2: parity-only MCQ (22 correct); a student can answer from "even" without the idea; add a start other than 4 or make the end -4.
- 2.7 #9: AR key "R does not explain A" is right but an example/ proof distinction is subtle for Class 7; acceptable.
- 2.5 #17: true_false stem sentence "although 50 is not a multiple of 4" is awkward; the True verdict is fine.
- 2.3 #6 and 2.6 #4 reuse the book's pattern table and magic grid (numbers changed, with a new twist: wrong-entry hunt, prediction); acceptable, flagged for awareness.
- 2.7 #3 (d) is an exhaustive search for 4 marks; it stretches beyond textbook reasoning (no equation solving required, listing is) but is within scope as written.

## Counts / calibration
- Types: MCQ plain/scenario, 7 AR, 7 MS, 4 match, 7 fill_blank, 4 true_false (3 False, 1 True), claim-check 7, reverse-create 7, show_impossible 7, case studies 2 per concept, long answers present. Scope: no negative fractions or decimals, no division by zero, no equation solving beyond the 2.7 #3(d) search. Textbook-only facts (Rakesh's puzzle, Brahmagupta rules, magic grid, token model, pp. 001-023).

## Verdict
PASS. 0 HIGH, 4 MEDIUM (one real ambiguity fix, three polish), 7 LOW. All 144 keys verified correct.
