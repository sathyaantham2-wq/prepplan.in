# Review: class7-topup/p1ch06-gap.json (Class 7 Maths Part I ch 6 Number Play, gegp106)

39 questions read, every key recomputed in python (permutation search for heights, grids, magic squares, rhythms and all cryptarithms). Loader `--check`: valid (7 concepts, 39 questions).

Brute-force results: every key is correct and every puzzle claim holds. The call decode in item 3 has exactly one solution. The 20/23 grids have 0 solutions, so they really are impossible. The 22 grid is unique. The 21 and 24 grids have several solutions (10 and 9), so their "give one grid" steps are fine. The 3x3 magic squares: 8 in all, centre always 5, 4 never at the centre. The cryptarithms for 35, 36, 37 and 38 have a single solution each. Item 39 has exactly the 4 listed solutions, and the clue in (d) leaves 81+81 only.

Item numbers count in file order: C7M-6.1 = 1-6, 6.2 = 7-13, 6.3 = 14-19, 6.4 = 20-24, 6.5 = 25-29, 6.6 = 30-34, 6.7 = 35-39.

| item | sev | what is wrong | exact fix |
|---|---|---|---|
| 34 (C7M-6.6, la5) | HIGH | Scope. The "sum of the first n terms = term (n+2) - 2" pattern is not taught on pp. 141-142 (no sum-of-terms idea in the chapter text). Part (c) asks for an induction-style proof ("Suppose the first n terms add to...; adding the next term..."), which the structure file lists OUT ("Formal induction or two-column proofs"). Parts (b) and (d) depend on the pattern. | Replace the sum pattern with a chapter idea: extending forwards and backwards, or the parity pattern of the sequence, or a "find the error" on a sequence with a different start. Remove the induction part. |
| 31 (6.6, sa2) | MEDIUM | Same idea as item 30 (split a rhythm by its last or first stroke) and as the existing pack's 8-beat "sort by first and last strokes" long answer and its assertion about 7-beat rhythms beginning short or long. Three items now lean on this one move. | Change item 31 (and ideally 30) to a different move, e.g. a count of rhythms with exactly two long syllables, or a 4-beat slab path with a restriction. Keep one item on the first-stroke split. |
| 32 (6.6, sa2) | MEDIUM | The part "starts with a 2 m slab, followed by any 9 m path" is the same first-piece split again. The existing pack also has the staircase and strip-of-tiles items. | Drop the "how many start with 2 m" part and ask for a different property, e.g. paths that never use two 2 m slabs in a row for a short length, or why the 11 m count is 89 + 55. |
| 36 (6.7, sa2) | MEDIUM | R7 + R7 = SRT is the same template as the existing G3+G3=HMM, C2+C2=DEE and N8+N8=OPN (X-digit doubled). | Use a different shape, e.g. a three-term sum with a carry of 2 and a carried hundreds digit, or put the unknown in the middle column. |
| 37 (6.7, sa3) | MEDIUM | H6 x 4 is close to the existing S6+S6+S6=TUS and PQ+PQ+PQ=RQQ. | Swap for a different structure (two different two-digit numbers, or letters in both addends). |
| 38 (6.7, sa3) | MEDIUM | AB + CA = CDC and the "Arif's claim" are close to the existing VE+EV=WXW item and its "two two-digit numbers add to ..." part. | Keep the claim-check but use a fresh puzzle, e.g. a sum where C is not forced to be 1. |
| 39 (6.7, la5) | MEDIUM | Idea "a quiz puzzle must have exactly one answer, add a clue" repeats the existing Indore quiz-club long answer (CB+B, G5+4H, AB+AB). | Move the uniqueness question to a different frame (e.g. count solutions only, or find which letter swap makes it unique), or drop part (d). |
| 11 (6.2, sa3) | MEDIUM | Cards 3-13 plus a 4, "one card per box, total 45/46" duplicates the existing Zubin cards-in-boxes long answer (odd cards 1-13, totals by number of boxes). | Change the setting: e.g. page numbers or token numbers with a different pool and a "how many odd tokens" claim. |
| 9 (6.2, sa2) | MEDIUM | Coins with parity of coin counts and a claimed total duplicates the existing Radha piggy-bank item (odd count of Rs 1 and Rs 5 coins). | Use a non-coin setting (ages, steps, tickets) or change the question to find the count of odd items from the total. |
| 13 (6.2, la5) | MEDIUM | Prices with parity and a claimed bill is the existing tuck-shop long answer (samosa/juice/roll/tea) in new clothes. Part (c) is a trial search more than parity. | Change the item or compress it: keep the 7-items-Rs 26 impossibility and the counter-example, drop the search in (c). |
| 6 (6.1, la5) | MEDIUM | Parts (c)-(d) (reverse a line, compare call totals, totals add to the number of pairs) repeat the existing reversed-line long answer (heights 2,5,1,4,3 and its reverse; combined total equals 1+2+3+4). | Replace (c)-(d) with a different question about the same totals (e.g. which totals are impossible), or merge only part (a)-(b). |
| 1, 3 (6.1) | LOW/MEDIUM | Reading the calls off six heights (item 1) and decoding heights from calls (item 3) are the same moves as the existing pack's march-past item and the "call 0,1,1,0,4" and "0,0,2,0,4,2,5" items. Item 1 is a straightforward read-off, close to a one-line fact. | Item 1: change to a two-step claim (e.g. "child X is moved; which calls change"), or lift it to Analyse. Item 3: change the calls and add a unique-answer check. |
| 20, 21, 22, 24 (6.4) | LOW/MEDIUM | Grid items overlap the existing pack: 20 repeats "Gita/Dhruv: totals pass, claim of unsolvable"; 22 repeats "rows 19,17,9 columns 15,22,8" (fill the grid); 24 repeats "rows 11, x, 2x+1". | Keep 23 (a new "collision" argument). Vary the others (give rows only, or a row and a column as a pair to check). |
| 26 (6.5, ms) | LOW | Chautisa corners and centre sums are new, but statement 3 repeats the existing "adding 1 raises the magic sum by 1" statement. Also three statements (I, II, III); check that this is the house format for DPS, since the Maths bank uses two. | Replace statement 3 with a different fact; use 2 statements if the style skill says so. |
| 28 (6.5, sa3) | LOW | Reflections and row swaps of a magic square are not taught on pp. 134-138. The check is arithmetic only and the existing pack has quarter-turn and 10-x items, so it is a near neighbour, not an out-of-scope method. | Acceptable; if kept, say in the stem "check by adding", or change to adding a number to each entry. |
| 7 (6.2, mcq) | LOW | The loose-sheets idea is the book's own end-of-chapter question (p. 144), and the reasoning is a one-step parity fact. | Make the totals closer (e.g. 2,455 vs 2,451 vs 2,453) and require the "sum is 3 mod 4" reasoning, or change the question to "which total is impossible and why". |
| 8, 15, 17, 16, 18 (parity items) | LOW | Several items are near recall of a rule the book states in one line (items 8 and 16 ask for a definition-level computation). Not wrong, but light for "Hard". | Raise the thinking in 16 (use the expression to find which n gives a sum) and in 8 (add a claim with a counter-example). |
| 3, 5, 12, 21 | LOW | Marking steps are checkable. Item 5 splits as (1+1+1), fine. Nothing to fix. | none |
| 24 vs 11 | LOW | The name "Kishor" appears in both items 11 and 24. | Rename one. |

## Counts read

- Types: short_answer 21 (2m: 9, 3m: 12), mcq 8, long_answer 7 (5 marks, all la5), multi_statement 2, match 1. No assertion_reason (ar1 slot) in this file, which is fine if the top-up did not ask for any.
- Bloom: Analyse 19, Apply 17, Evaluate 2, Understand 1. Difficulty: Hard 32, Hardest 7. No Remember, Understand at 3%.
- claim_check tag: 5 items; verdicts: right 1 (item 4), wrong or partly wrong 4 (12 partly, 17 right, 28 partly, 38 wrong). So the verdict mix is varied but 2 are fully right and 3 partly or wrong.
- true_false: 2 items (10 True, 31 True). Both True: no False verdict. LOW: make item 31 or item 10 False.
- multi_statement key spread: "1 and 3 only", "1 and 2 only" (varied); both are the "1 and k only" shape.
- correct option longest: 6 of 8 mcq (items 1, 7 ... first option in this file). This is the 75% rate; LOW. Lengthen two distractors or shorten the keys (items 20, 25).
- Slot order is the same in each concept (mcq or ms or match, then sa2, sa3, la5). Most concepts follow mcq, sa2, sa3 (claim), sa3, la5. That ordering is templated at the file level, but the content itself is varied.
- Repeated ideas against the existing pack: see MEDIUM rows above (rhythm split, cryptarithm shapes, grids, cards-in-boxes, coin parity, reversed line).
- Option positions named in answers: none found.

## Verdicts per concept

- C7M-6.1: pass after fixes (1, 3, 6 overlap the existing pack; keys correct).
- C7M-6.2: pass after fixes (9, 11, 13 overlap existing pack; keys correct).
- C7M-6.3: pass (keys correct, some items light on thinking).
- C7M-6.4: pass after fixes (20, 22, 24 overlap; 23 is good, uniqueness and impossibility verified).
- C7M-6.5: pass (26 statement 3 repeats; 28 near scope edge).
- C7M-6.6: FAIL on item 34 (scope), MEDIUM repeats on 31 and 32.
- C7M-6.7: pass after fixes (36-39 repeat existing cryptarithm shapes; solutions unique and correct).

HIGH 1 / MEDIUM 11 / LOW 7 (grouped rows count by number of items listed)

VERDICT: FAIL
