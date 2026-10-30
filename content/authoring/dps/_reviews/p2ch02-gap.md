# Review: class7-topup/p2ch02-gap.json (Class 7 Maths Part II ch 2, gegp202)

Loader --check: valid, 7 concepts, 54 questions. All 54 recomputed by hand and in python. Page refs checked against the extracted text (file 001 = printed p.24); all `p` values are correct.

Counts: Apply 27, Analyse 24, Understand 3 (5.6%, under the 30% cap). 17 sa2, 17 sa3, 11 mcq, 1 match, 1 multi_statement, 7 la5 (no ar1, no cs4 or la4 asked for here). Correct option is the longest in only 1 of 13 option items, so no length tell. True/False verdicts: 5 False, 3 True. Claim-check verdicts mixed (right 6, wrong 4, partly 3).

| Item | Sev | Problem | Exact fix |
|---|---|---|---|
| C7M-2.5 mcq "entrance test has 40 questions, +3 / -1 ... Between which two scores must her total lie?" | HIGH | Two defensible answers. "From -120 to 120" is also true (her total does lie in it); only the tightest range is intended. | Reword the stem: "What are the lowest and the highest total she can get?" |
| C7M-2.5 la5 "Bhavna ... (d) ... exactly 50? Exactly 51?" and key "4c - 34 = 50 gives c = 21" | MEDIUM | Solves an algebraic equation; the structure file lists "Solving algebraic equations with integer coefficients" as OUT (Part II ch 7). | Rewrite the key and step (d) as trial or pattern: each extra correct answer changes the total by 4 (from -34), so totals are -34, -30, ... ; 50 = -34 + 84 needs 21 correct; 51 is not a multiple of 4 away from -34. Drop the "4c - 34" expression, or give it as a table. |
| C7M-2.3 sa3 "(b) Show that no two integers have product -48 and sum 0", la5 (a)-(c) product-and-sum search, sa2 product -42 sum 1 | MEDIUM | Finding integers from a product and a sum is not a method the chapter teaches (it teaches sum and difference, p.24-25). Only trial and the sign rules are used, so not fatal, but three items lean on it. | Keep at most one product-and-sum item; rewrite the other two as sign-rule reasoning (e.g. what the signs must be, and sum-and-difference). |
| C7M-2.1 la5 bead 3, -6, 9, -12 ... "by pairing the moves" | MEDIUM | Same idea as the existing pack's coin struck 2, -3, 4, -5 ... 8, -9 found by pairing. | Change the idea (e.g. moves in a fixed repeating pattern that does not pair to a constant), or replace. |
| C7M-2.5 mcq (40-question test), sa2 (Jyoti, 30 questions), la5 (Bhavna) | MEDIUM | Marking-scheme +3/-1 with all answered, max/min, and "can the score be exactly 50" already appear in the existing pack (20-q +3/-1 Kabir/Lata; 25-q Hiral; +4/-1 Neha "50 possible"). The 40-question item is also the book's own "maximum and minimum marks" question. | Change one of the three to a different scheme or situation; make the 40-q item a find-the-error. |
| C7M-2.5 sa3 lifts A and B "meet" | MEDIUM | Existing pack has the mining-museum two-lift problem (two lifts, one start 30 m above, going down). Same idea and nearly the same start. | Different setting (e.g. two divers or two drones) or different question (when is one twice as deep as the other). |
| C7M-2.2 mcq Gopal (12 zero pairs, take out 3 green 4 times) | MEDIUM | Repeats the existing Isha item "(-5) x 3: remove 3 green tokens, 5 times". | Replace with a different structure, e.g. identify which bag description models (-3) x (-4). |
| C7M-2.6 sa3 2x2 magic grid and la5 3x3 magic grid | MEDIUM | Two magic-grid items in one file, and the existing pack has a 3x3 row-times-column grid. | Keep one; replace the other with a different C7M-2.6 idea (sign by counting negatives, any-order grouping). |
| C7M-2.7 mcq pattern machine (a, b, c) | MEDIUM | The existing top-up (p2ch02-la4) has a three-integer pattern machine with the same test-a-rule format. Also coin game +8/-5 repeats the existing +11/-7 and +5/-10 token machines. | Change one of them; for the coin game use a different pair and a different question. |
| Whole file (long answers) | MEDIUM | Template: all 7 la5 end with "(e) <Name> says ..., is he/she right? Give a reason", and slot order is identical in every concept (mcq, mcq, sa2, sa2, sa3, sa3, (sa3), la5). | Vary the last part of at least 3 la5 (a prediction, a "make your own", a find-the-error with a number), and reorder the slots in some concepts. |
| C7M-2.1 sa2 TF "additive inverse of a negative integer is greater" | LOW | A one-line book fact; the verdict is obvious. | Make it "of any integer a, -a is greater than a" (False, a = 0 or negative) or drop. |
| C7M-2.4 mcq "___ / (-13) = -6" | LOW | One-step fill-in, which is what book Q4 asks. | Make it two steps, e.g. "___ / (-13) = 14 - 20". |
| C7M-2.4 sa3 Jaya "divide 36 by -12 first" | LOW | Re-ordering division with multiplication is not taught (associativity is for multiplication). The computing is fine; the claim goes beyond the chapter. | Add "check by multiplying back" or say "compare the two values"; do not generalise. |
| C7M-2.7 sa2 "63 - 28 + 17 - 45 + 9 = 16" | LOW | Same as book Q4 with new numbers; part (b) is nearly the answer. | Ask for a different sign pattern (change the sign of only some terms) so the child must decide. |
| C7M-2.1 la5 bead, step (c) | LOW | Step (c) carries two points (20th move, never again) for 1 mark. | Split so the 5 steps are one idea each, or state "1 mark for both". |
| C7M-2.2 mcq Tara and la5 | LOW | Stem rule "zero pairs only when not enough" makes Step 2 count long; correct but a very long chain for a 1-mark item. | Shorten Tara to 3 + 2 operations. |

## Counts
HIGH 1, MEDIUM 9, LOW 6.

## Per concept
- C7M-2.1: keys correct (checked sums, differences, tokens, bead positions). Needs the bead repeat fixed.
- C7M-2.2: keys correct (zero-pair counts rechecked step by step). One repeat.
- C7M-2.3: keys correct (match, patterns, product/sum pairs unique). Scope-leaning on product-sum search.
- C7M-2.4: keys correct (all quotients rechecked). Low items only.
- C7M-2.5: all numbers right, but the range MCQ has a second answer, and the la5 uses algebra; heavy overlap with the existing pack.
- C7M-2.6: keys correct (sign counts, magic grids -720 / 720 checked). Grid duplication.
- C7M-2.7: keys correct (machine rule, collatz chains, coin totals and minimality, ordering). Overlap with existing machines.

VERDICT: FAIL
