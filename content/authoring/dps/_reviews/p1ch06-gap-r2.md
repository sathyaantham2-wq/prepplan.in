# Round 2 review: class7-topup/p1ch06-gap.json (Class 7 Maths Part I ch 6 Number Play, gegp106)

Compared with `_reviews/v1/p1ch06-gap.json`: all 39 items differ (the file was rewritten and the items re-ordered, so item numbers below are the NEW file order: 6.1 = 1-6, 6.2 = 7-13, 6.3 = 14-19, 6.4 = 20-24, 6.5 = 25-29, 6.6 = 30-34, 6.7 = 35-39). Loader `--check`: valid (7 concepts, 39 questions). Printed page = file page + 126, every `p` checked.

Brute force in python (permutations / enumeration): item 1 (152 cm child changes 3 calls, 160 cm 2, others 1 or 0: unique), 2 (swap rule), 3 (no line other than tallest-to-shortest has six different calls), 4 (single order 3,7,5,2,8,6,1,4), 5 (max 15, five lines with total 1, a neighbour swap always changes the total by exactly 1), 6 (0,0,1,0,3,1 and 0,0,1,2,0,0), 7 (13 impossible, 4 reachable), 9 (count of 1/3-run shots always odd), 10 (17 odd, 18 and a valid graph, 9 games), 13, 16, 17 (n = 40), 20 (the swap of 9 and 8 is the only one), 21 (crossing number is always 1), 22 (unique grid 9 7 8 / 5 1 3 / 6 2 4; column sums span 10 to 20), 23 (x = 12, smallest 2), 24 (0 grids), 25 (8 magic squares, centre always 5, 2 can sit in a corner, pairs for 11 are 2+9, 3+8, 5+6), 26 and 28 (centre = sum / 3; for 12 to 20 with 12 top middle the bottom middle is always 20), 27 (row reversal stays magic; swapping top two rows gives diagonals 24 and 12), 29 (all three sums 34), 30 (3 palindromic rhythms), 31 (counts 1, 5, 6, 1 = 13), 32, 33 (5,7 start; parity patterns; 41st term even only for 1,2,3,5,...; 10th and 11th even forces 1st even), 34 (3, 4, 6 allowed trains of 3, 4, 5 units), 35 to 39 (each cryptarithm has exactly one solution; item 37 has exactly the six listed solutions and none gives 725; item 38 B = 2 fails and 86 + 17 + 68 = 171 is the only solution; item 39 R = 2).

No wrong key, no second defensible answer, step marks sum to the marks everywhere, no option wording by position.

## Earlier findings: resolved?

- Old item 34 (HIGH, sum-of-n-terms pattern with an induction-style part): RESOLVED. The slot is now the toy-train restriction item (34) and the Virahanka chain item (33); neither uses a sum-of-terms pattern or a proof by induction. Item 33(e) argues "even minus even is even, so on back to the 1st"; that is extending the sequence backwards (IN scope, pp. 141-142), not formal induction.
- Old MEDIUMs on 31, 32 (first/last stroke split), 36 to 38 (double/triple-the-same-number cryptarithms), 39 (uniqueness clue), 11, 9, 13 (cards, coins, prices), 6 (reversed line): RESOLVED in form (new settings). Some of the replacements still repeat the existing pack; see below.
- Old LOW true/false both True: RESOLVED (item 12 True, item 32 False).
- Old LOW "Kishor" in two items: RESOLVED.

## Findings

| item | sev | what is wrong | exact fix |
|---|---|---|---|
| 33 (C7M-6.6, la5) | MEDIUM | Repeats the existing pack and la4: working back from two later terms (existing "3rd term 7 and 4th term 11"; la4 Mira "4th and 5th terms are 25 and 40"), the parity pattern of a chain with different starts (existing "parities of the next six numbers", "30th number odd or even", la4 Gauri 4, 7). Parts (a), (b), (d) are all that again. Only (c) (even-even start breaks the claim) and (e) are fresh. | Keep (c) and (e) as the core and replace (a), (b), (d). E.g. (a) a chain whose 1st and 2nd terms are both even: show every term is even and why a claim "one even in three" fails; (b) a chain in which the 10th and 11th terms are both odd: find the parity of the 1st and 2nd terms; drop the 41st-term comparison. |
| 4 (C7M-6.1, sa2) | MEDIUM | Decoding heights from a list of calls repeats the existing "0, 0, 2, 0, 4, 2, 5" short answer, "0, 1, 1, 0, 4" and la4 "0, 1, 1, 0, 3, 5, 0, 2" (find tallest/shortest). Part (b) (uniqueness of the order) is new. | Keep (b) only and give the order: "Calls 0, 0, 1, 3, 0, 2, 6, 4 for children of heights 3, 7, 5, 2, 8, 6, 1, 4. Show no other order of these eight heights gives the same calls." |
| 1, 2, 5(d)(e), 6 (C7M-6.1) | MEDIUM | Within the file, four items rest on one move: how one child leaving, two neighbours swapping or one child moving changes the calls (1 leaves, 2 swaps, 5(d) swap changes the total by 1 and 5(e) uses it, 6(b)(c) runner to the back). Also overlaps existing "a new child steps in at the front" and la4 (c)/(d). 3 and 5(a)-(c) are different and good. | Keep 2 (swap) and 5. Change 1 to a different 6.1 idea (e.g. which call lists are impossible, or "the largest call a child at position k can make") and change 6 to read the calls of a given line and use them to say who stands tallest/shortest (without the "moves to the back" part). |
| 17 and 19 (C7M-6.3) | MEDIUM | Item 17 (the n-th odd number plus the n-th even number, 4n - 1) repeats the existing Pune street long answer (n-th house on the left faces the n-th on the right; sum in terms of n; can it be 250) and Madurai tokens. Item 19 uses the same expression 4n - 1 (also in the existing match item), and 17(b) and 19(b) both say "4n - 1 is always odd because 4n is even". | Change item 17 to a different pair of sequences, e.g. the n-th multiple of 3 and the n-th odd number, and ask for the parity of their sum and a target that is impossible; give item 19 a different expression such as 6n + 5 rows. |
| 16 and 18 (C7M-6.3) | MEDIUM | Item 18 is the same match template as the existing "4n - 1, 3n + 1, 6n, 5n - 2" (four expressions matched to parity behaviour). Item 16(a)(b) repeats the existing 7n + 3 table and "7n + 5 has the parity of n" items. Parts (c), (d), (e) of 16 are fresh. | Item 18: match on something other than parity behaviour (e.g. expressions to the nth term of a described list). Item 16: drop (a)-(b) or merge them into one line and add a part that uses the parity of 5n + 2 to rule out a target such as 2,013. |
| 26, 28 (C7M-6.5) | MEDIUM | Both are "nine consecutive numbers, magic sum known, centre = sum / 3, so list the numbers" (69 and 48), the same move as the existing Muthu plate B (magic sum 51), the "36" short answer and the 11 to 19 mcq. 28(b) is a small new step. | Keep one of the two. Replace the other with something about how a transformation changes the sum, e.g. "every number is multiplied by 3 and 2 is taken away; find the new magic sum and centre". |
| 25 (C7M-6.5, la5) | MEDIUM | Parts (a)-(b) (which numbers can or cannot be centre or corner, listing pairs that add to the target) repeat existing "9 cannot be in a corner", "5 in a corner" and la4 "6 cannot be in a corner, 7 claim". Parts (c) and (d) are not new either (build a square, multiply by 3). | Keep (a) (4 cannot be at the centre; it is new) and replace (b) with a question about the other transformation, e.g. "subtract 2 from every entry: new sum and centre"; drop one of (c) and (d). |
| 24 (C7M-6.4, sa3) | MEDIUM | The existing Gita item is the same idea ("row sums 6, 18, 21 and column sums 10, 11, 24: totals are 45 and circles are within 6 to 24, show it still has no solution", using a row of 1, 2, 3 and a column that cannot share a number). Item 24 only changes the column set. | Change the impossibility argument: e.g. rows 8, 15, 22 and columns 8, 15, 22 (two rows and two columns both need the same set but the crossing numbers differ), or ask which of three given grids of circles is the impossible one and why the other two are possible. |
| 23 (C7M-6.4, sa2) | LOW | "Rows 14, 19, x, find x from 45" repeats the existing "11, x, 2x + 1" idea; part (b) is fresh. | Acceptable; or delete (a) and give the rows 14, 19 and a missing one in the stem. |
| 39 (C7M-6.7, sa3) | MEDIUM | PQ + PQ + QP = RRP is a close neighbour of the existing PQ + PQ + PQ = RQQ (same start, units column forces Q) and of the VE + EV = WXW claim item. Item 38 also asks about the first digit of a sum of three two-digit numbers (B is 1 or 2), so 38 and 39 share an idea. | Change item 39 to a different shape: letters in both addends and a carry of 1 into the hundreds, e.g. a 3-addend puzzle with a repeating digit of the form AB + BC + CA = DDA, and keep Arif's claim only if the verdict differs from item 38's. |
| 12 (C7M-6.2, sa2) | LOW | "Eleven numbers add to an even number" is the existing "Twenty whole numbers added, total odd, how many are odd" idea in true/false form. | Acceptable; or change 11 to a number-of-even-terms claim with a different count. |
| 13 (C7M-6.2, sa3) | LOW | A rectangle of tiles whose parity is tested after removing a row or column resembles the existing Annual Day hall (rows of seats) and the 27 x 13 assertion. The partly-right verdict is new. | Acceptable. |
| 10 (C7M-6.2, la5) | LOW | Counting each game twice and "the number of friends with an odd count is even" is the handshake argument; the chapter only teaches parity of sums with pairing pictures. It uses only parity and a doubling statement, so it is a stretch, not out of scope. | Add to the stem "Each game has two players" so the doubling step is given. |
| 7 (C7M-6.2, sa3) | LOW | Part (a) ("changing + k to - k lowers the total by 2k") is an algebraic step beyond the chapter's pairing pictures; the parity conclusion in (b) does not really need it. | Rewrite (a) as "show that changing one sign changes the total by an even number". |
| 8 (C7M-6.2, mcq) | LOW | Variant of the book's own Figure-it-Out Q2 (50 loose sheets, can the sum be 6000). Distractors are good. | Acceptable. |
| 15 (C7M-6.3, mcq) | LOW | The k-th odd number is 2k - 1 is the book's own statement (p. 133) and many pack items ask the same. The distractors are sound but the answer is a one-line fact. | Make the lockers start at an odd number other than 1 (e.g. numbers 11, 13, 15, ...: which rule gives the k-th locker) so the pupil must shift the formula. |
| 27 (C7M-6.5, sa3) | LOW | Row reversal and row swapping are not taught on pp. 134-138; the check is arithmetic only, so not out of scope. | Acceptable. |
| 38 (C7M-6.7, sa2) | LOW | Part (a) "B is 1 or 2" is the same inference as in the existing S6 + S6 + S6 and T5 + T5 + T5 items; the B = 2 failure is new. | Acceptable. |

## Counts read

- Types: short_answer 21 (2m: 9, 3m: 12), mcq 8, long_answer 7 (all 5-mark), multi_statement 2, match 1. No assertion_reason; none asked in this file.
- Bloom: {'Analyse': 21, 'Apply': 15, 'Understand': 1, 'Evaluate': 2}. Difficulty: Hard 32, Hardest 7. No Remember.
- claim_check: items 3 (right), 13 (partly), 14 (right), 24 (not claim, show-impossible), 27 (partly), 39 (wrong); varied. true_false: 12 True, 32 False.
- multi_statement key spread: item 11 "1 and 3 only", item 29 "1, 2 and 3". Different. Three statements each (accepted).
- Correct option longest: 0 of 8 mcq (item 2 and item 8 have a longer distractor; items 1, 15, 21, 26, 30, 36 have equal lengths or one character). Fine.
- Correct option listed first in every item (the loader shuffles), so no position problem.
- Slot order per concept: 6.1 mcq, mcq, sa3, sa2, la5, sa3; 6.2 sa3, mcq, sa2, la5, ms, sa2, sa3; 6.3 sa3, mcq, la5, sa2, match, sa3; 6.4 sa3, mcq, la5, sa2, sa3; and so on. The orders differ between concepts; not templated.
- Repeats against the existing pack and la4: the MEDIUM rows above (ideas: 6.1 calls moves, 6.3 n-th odd/even sums, 6.4 impossible grid, 6.5 consecutive-number magic sums, 6.6 chain parities, 6.7 PQ puzzle).

## Verdicts per concept

- C7M-6.1: pass after fixes (1, 2, 5, 6 share one move; 4 repeats the decode item).
- C7M-6.2: pass (LOWs only; 7, 10 and 15 wording).
- C7M-6.3: pass after fixes (16 to 19 repeat existing items).
- C7M-6.4: pass after fix (24 repeats Gita).
- C7M-6.5: pass after fixes (25, 26, 28).
- C7M-6.6: pass after fix (33 repeats chain/parity items; the old HIGH is gone).
- C7M-6.7: pass after fix (39).

HIGH 0 / MEDIUM 8 / LOW 9 (grouped rows count by the number of rows)

VERDICT: PASS
