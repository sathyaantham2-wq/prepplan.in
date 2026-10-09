# Review: content/authoring/dps/class7/p2ch02.json (C7M-2.1 to 2.7, Operations with Integers, gegp202)

Read: all 144 questions (21+20+21+20+21+20+21), no sampling. Every integer result, every case-study part (a)-(d), all five match items and the brute-force "greatest/least" in C7M-2.7 #18 (45 and -45 confirmed) were recomputed in Python. 143 of 144 keys are right; one item has a second defensible option.

## HIGH (wrong key / second correct answer / arithmetic or fact error)

1. **C7M-2.3 #3 (mcq)**: "Which statement matches the rule a x b = b x a when a = -30 and b = 12?" Key "(-30) x 12 = 12 x (-30)". Distractor "(-30) x 12 = (-12) x 30" is also a true equation (both -360), so two options are defensible. Smallest fix: replace that distractor with a false one such as "(-30) x 12 = (-30) x (-12)" (the sign-flip slip).

No wrong keys, no arithmetic errors found otherwise. Book fact checked: Brahmagupta "quotient of a debt and a fortune is a debt" (page 012) matches C7M-2.4 #2.

## MEDIUM

2. **Every claim-check ends "No" (C7M-2.1 #14, 2.2 #14, 2.3 #14, 2.4 #14, 2.5 #14, 2.6 #14, 2.7 #14).** All seven refute the speaker; students learn "the claim is always wrong". Several are also absurd strawmen (2.7 #14 "distributive law only for positives"; 2.2 #14 "swapped signs make +24"; 2.6 #14 "any three negatives are positive"). Fix: make at least 2 of the 7 correct or correct-for-a-limited-case, e.g. 2.6 "an odd number of negative factors makes the product negative, whatever the other factors" (verdict Yes, with a test), 2.4 "(-a)/b and a/(-b) are equal" (Yes), 2.5 "a student scoring 0 must have equal gains and losses" (partly: also all-unanswered).
3. **Textbook items reused with unchanged numbers (standard section 1 says change the numbers):**
   - C7M-2.2 #6 and #18: 123 x 456 = 56088 and (-123)x456, (-123)x(-456), 123x(-456) are the book's Figure-it-Out Q2 verbatim, and the same fact is used twice in one concept. Change the numbers in at least one and drop the other.
   - C7M-2.4 #9 and #10: 84/(-4), (-27)/9, (-56)/(-2) are all three parts of the book's Q2 (page 019). C7M-2.3 #10(a): (-1) x a = -31 is the book's Q3(b).
   - C7M-2.7 #7 statement 3: 207 x (33 - 7) = -5382 is book Q14 unchanged. #13: the Collatz rule is the book's rule word for word (only the start -7 became -6). #19: the pibs (+13, -9) is the book's Q10; only the prices changed.
   - C7M-2.5 #7 statement 1: 15 correct, +4/-2, total 40 is the book's Q6(a) data; statement 2 is the cement item (Rs 8 profit, Rs 5 loss, 3,000 bags) with 4,800 swapped in; #13 and #18(b) reuse the cement structure; #8 (lift 3 m/min, 60 min, -180 m) is the book's worked example.
   - C7M-2.6 #5, #10, #18: all three use 25 x (-6) x 12, the book's own example.
   Fix: new numbers and settings for each.
4. **Same numbers three times in one concept (C7M-2.6 #5, #10, #18)** and a repeated blank across concepts: C7M-2.2 #13(a) and C7M-2.3 #12(b) both ask "14 x (-5) = -70 and (-5) x ___ = -70". Replace one of each.
5. **Scope_out breach: "solving equations with integer coefficients (Part II Ch 7)".** C7M-2.5 #15 (7c - 40 = 50, 7c = 90), #17(a) (3c - (25 - c) = 35 shown as an equation), #18(b)/(c) (9p - 18000 = 9000), and C7M-2.7 #19(d) (general solution a = 3 + 9k, b = 4 + 13k). Also 2.7 #15 factorises 3(2a - 3b) to argue "multiple of 3" and 2.1 #15 argues parity, both beyond this chapter's tools. Fix: reword so the student works by trial/by arithmetic (e.g. "try 12 and 13 correct answers"; "list totals 44, 51 and see the gap is 7"; for 2.7 #19(d) let them check a = 0..6 coins), and move the key explanation to that method.
6. **Case studies with free or one-sided parts (section 11 / anti-template rules):**
   - C7M-2.2 #20 (a): the stem lists 12, 8, 4, 0 so "falls by 4" is read off, and (-1) x 4 = -4 is one more step of the printed list. Part (d) "Mahi says it is negative" is a strawman.
   - C7M-2.3 #19 (b): the stem already says she writes the swapped form, so (b) is free. (d): -1 marking vs -4 for a 20-mark limit has only one possible answer, not a trade-off.
   - C7M-2.3 #20 (c) and (d): commutativity is stated in the stem; (d) "is (-2)(-3) = (-3)(-2)" adds nothing, and there is no decision.
   - C7M-2.4 #20: no real setting, (a)-(c) are three sibling quotients, parts do not climb, (d) is not a decision. C7M-2.4 #19 (d) and 2.2 #19 (d) (-5 loss vs -8 loss) have one obvious answer.
   - C7M-2.7 #20: unrealistic (a treasurer and an auditor record every entry with opposite signs; the club then "follows" one record for 4 weeks and the other for 3). Use a real setting (e.g. two shopkeepers' weekly ledgers) with a genuine choice.
   Good case studies, keep as models: C7M-2.5 #20 (quiz teams, real near-tie decision), 2.5 #19 (lifts), 2.6 #19 (grid), 2.6 #20 (card order), 2.1 #19 and #20.
7. **Slot-level templating.** Every concept has the same 6 mcq / 1 MS / 1 AR / 8 SA / 4 LA shape, the same mark distribution (9/5/3/2/2), and the same order: #14 "X says ... test with ..., give your verdict", #15 "Show that ... cannot ...", #16 "Create a situation/story/write ways", #17 and #18 "(a)-(e) lists", #19-#20 case studies. The content inside differs, but the frames repeat seven times. Vary the stems (e.g. one concept with a worked-solution error to find, one with a table to complete, one with a "which method is quicker" comparison) and move the reverse/claim items to different slots.
8. **Show-it-cannot-work items that restate the rule:** C7M-2.3 #15 ("(-13) x 13 cannot be positive"), C7M-2.2 #15 and C7M-2.6 #15 only apply the sign rule once; they do not test an impossibility with a number the way 2.1 #15 and 2.5 #15 do. Make them reasoning items (e.g. a product given as +72 with an odd number of negative factors listed, asked to find the error).
9. **MCQ correct option is longest:** C7M-2.7 (5 of 6 MCQs have the correct option as the longest). Anti-template rule: shorten the keys or lengthen distractors.
10. **Weak distractors (invented, not chapter confusions):** C7M-2.4 #2 "fortune only if the debt is small"; 2.2 #6 options 2-4 ("the sign never matters", "negatives are multiplied by adding tokens"); 2.5 #3 option 0 and -200; 2.6 #4 option "zero" when the stem says no factor is zero. Replace with the book's real slips (sign dropped, quotient of debt/debt a debt, token removed instead of added).

## LOW

11. C7M-2.6 #1 "-1 multiplied by itself 7 times": ambiguous (7 factors or 8?). Say "the product of seven factors, each -1". Also brushes scope_out "exponents with negative bases"; keep it as repeated multiplication only.
12. C7M-2.2 #8: Assertion says (-4) x 2 "can be found by adding 2 negative tokens 4 times", but the book (and #12's key) takes (-4) x 2 as removing 2 positives 4 times. Both give -8, but reword A to "(-4) x 2 can be found by removing 2 positive tokens 4 times".
13. C7M-2.4 #15: asks for "the nearest integer dividend" (singular); the key gives -44 and -48 and -44 is the only nearest. Ask for "the two multiples of 4 on either side of -45".
14. C7M-2.3 #18: parts mis-lettered (the stem's "(a) ... (b) ..." lists six products, then (c), (d)), while the step marks say "Part (a)", "Part (b)". Relabel as (a)-(f) or (i)-(vi).
15. C7M-2.4 #13(b): "shared equally over 6 hours" is physically odd (the same total over fewer hours); say "cooled instead at a steady rate to give the same total change in 6 hours".
16. Level labels: several "Evaluate" items are pure computation (2.3 #18, 2.4 #18, 2.5 #18, 2.4 #8). Chapter mix is still fine (Remember+Understand 40 of 144 = 28 percent; Analyse/Evaluate/Create 50 of 144 = 35 percent), per concept Remember is only 2 and Understand 3-5 (recall share below 25 percent in each concept; with the rubric's reading this is acceptable but heavy on Apply).
17. C7M-2.7 #19 "alien market" with "pibs" is the book's fantasy setting, not Indian; fine as a puzzle, but give it an Indian frame (a game-zone token counter) if reused.
18. C7M-2.7 #17: a 5-mark item that is three evaluations of the same type plus (d)/(e) restatement. Change to two evaluations and add a "find the error in this distribution" part.

## Checks that passed
- Rev flags: "least" (2.5 #3), "cannot", "no", "never" show-impossible items all carry rev. No unflagged reversal found.
- Multi-statement keys are well spread ("1 and 2 only", "1 and 3 only", "2 and 3 only", "1 only", "2 only", "3 only", "1, 2 and 3") and the false statement moves among positions. Assertion-reason is balanced (explains: 2.1, 2.2, 2.4; true-not-explains: 2.3, 2.5, 2.7; A false: 2.6).
- Match items (2.1, 2.3, 2.5, 2.7): all four pairs of each verified; one key each, distractor mappings are plausible swaps.
- No negative fractions or decimals; no division by zero; no negative-base exponents beyond the 2.6 note.
- DPS reference papers were not compared item by item; no DPS wording was noticed. Textbook (gegp202) reuse is the main originality issue (item 3).

## Per-concept verdicts
- C7M-2.1: sound; keys right; the best sum-and-difference and carrom items. Fix claim-check (2) and the sparse 2.1 #15 parity argument (5).
- C7M-2.2: keys right; weakest on originality (123 x 456 twice, book Q2) and the strawman case study 2.2 #20 (d).
- C7M-2.3: one second-option error (#3 HIGH); case studies 2.3 #19/#20 have free parts; repeated blank with 2.2.
- C7M-2.4: keys right; 2.4 #9/#10 are book Q2 verbatim; #20 is not a real case study.
- C7M-2.5: keys right and the most real-world; equation-solving drifts past scope (#15, #17, #18); cement and test-marking items reuse book data.
- C7M-2.6: keys right; 25 x (-6) x 12 repeated three times; the grid case study is the best item in the chapter.
- C7M-2.7: keys right; longest-answer cue in MCQs; the pibs item needs scope care and the Imran/Zoya case study is contrived.

Overall: arithmetic and facts are clean, but the chapter does not yet reach the section 9/anti-template standard because of the slot template, one-sided claim-checks, and book numbers reused unchanged.

Count read: 144 of 144.
