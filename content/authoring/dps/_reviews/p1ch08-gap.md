# Review: class7-topup/p1ch08-gap.json (Class 7 Maths Part I ch 8, 32 questions)

Loader `--check`: valid (7 concepts, 32 questions). Every number, key and marking-step total was recomputed in python (fractions.Fraction) and against textbook pages 176-198 (printed = file + 172). All 32 keys are correct, each MCQ has exactly one defensible option, marking steps sum to the marks, and no option is named by position. No out-of-scope method found.

| item | severity | what is wrong | exact fix |
|---|---|---|---|
| C7M-8.7 la5 "old rates ... dinar, drammas, panas, mashakas, cowrie" | MEDIUM | Repeats the idea already in the existing pack's 8.7 long answer (miser, 1/5 of 1/16 ... of a dramma, then cowrie shells). Part (a) is the book's own fill-in blanks on p.194 (1 cowrie = ? pana, ? dinar). Also uses 1 dramma = 120 cowries here, but the existing item uses 1 dramma = 1280. | Replace with a different 8.7 setting (e.g. a bricks-on-a-floor or fraction-of-a-fraction comparison). If kept, drop (a) and keep only (b)-(e). |
| C7M-8.1 sa3 drain crew; 8.1 mcq poles; 8.3 sa3 power bank; 8.5 sa3 rotis | MEDIUM | Each is the structure of a book exercise with new numbers: canal 1 km in 8 days / 5 days a week (p.176 Q2), four saplings 3/4 m apart (p.184 Q4), tap fills 7/10 in 1 hour then 1/3, 2/3 hour and "how long to fill" (p.183 Q1), 1/4 kg flour for 12 rotis (p.197 Q3). Pupils who did the exercises can answer by recall. | Keep the extra twist but change the situation or mechanism (e.g. poles: ask for the gap given the first-to-last distance; power bank: give two charging rates and compare). |
| C7M-8.6 sa3 Yash predictions | MEDIUM | Part (c) "state what decides whether a quotient is greater or less than the dividend" is the book's summary line and the existing pack already has the same ask (Sana's sa3, plus AR, MS and mcq on the same rule). | Replace (c) with an application, e.g. "give a divisor d for which 2/9 ÷ d is greater than 2/9 and find the quotient." |
| C7M-8.4 sa3 "turning a shape" | LOW | Part (c) is the book's p.186 sentence (area stays the same when length and breadth swap). Understand-level, answerable by recall; existing sa2 also covers the order property. | Make (c) a test: "Does the same turning argument show 2/3 ÷ 5/7 = 5/7 ÷ 2/3? Why not?" |
| C7M-8.4 mcq mats (5/9 m vs 4/7 m) | LOW | "Same area, smaller width means longer" is never taught (needs division comparison). Correct but only by reasoning beyond the chapter's stated rules. | Give the area (e.g. 20/63 sq m) and ask for the lengths, or ask which length is larger after dividing. |
| C7M-8.5 sa3 Zubin (c) | LOW | "Which number is equal to its own reciprocal?" has -1 as a second answer outside scope. | Add "positive": "Which positive number ...". |
| C7M-8.3 la5 sapling | LOW | Telescoping product duplicates existing 8.3 sa2 (1/2 x 2/3 x 3/4) and the book's Q12 (p.198). The "(weeks + 2)/2" generalisation is the same pattern. | Accept, or change the growth rule so the cancelling differs (e.g. grows by 1/2, then 1/4 ...). |
| C7M-8.7 sa3 ration shop | LOW | "Fraction of what is left" is already in five existing 8.7 items (Reena, tank, acre, mela, farmer). The work-backwards twist is new. | Accept; or change the setting away from sold/left stock. |
| C7M-8.1 sa3 drain, 8.5 sa3 rotis | LOW | Labelled Hard but parts (a)-(b) are one-step recalls. | Relabel Apply/Hard-light or add a comparison part. |

Counts: HIGH 0 / MEDIUM 3 / LOW 6

## Per concept
- C7M-8.1: keys correct; pass after the book-clone fix.
- C7M-8.2: keys correct (10/21, 7 by 2 block, frame 1/2 sq m, total Rs 1,170, Priti verdicts); pass.
- C7M-8.3: keys correct (product 1, 6 m, 20 cm / 44 cm / 80 cm vs 88 cm, 1 1/8 h, MS "1 and 3 only"); pass.
- C7M-8.4: keys correct (350 / 162, 270 and 252, 40/63 and 21/4, 10/21, MS "2 and 3 only"); pass.
- C7M-8.5: keys correct (1 5/7 m, 3/16 GB, 2 / 4 / 2 2/3 / 1/2 h, 120 rotis); pass.
- C7M-8.6: keys correct (3/5 and 2/3, Dinu 14/3, MS "2 only", 3/2 and 5/2, 2/3 jar and 5/4 kg); pass.
- C7M-8.7: keys correct (Q = 1250 g, 2 sq cm, 42 mashakas / 15 cowries / 3 mashakas, match 1-D 2-A 3-C 4-B, 60 kg); pass after the cowrie fix.

## Counts and template read
- Slots: mcq1-type 11 (mcq 7, multi_statement 3, match 1), sa3 14, la5 7. No ar1, sa2, la4 or cs4 items (not checked against any quota).
- Bloom: Understand 1, Apply 12, Analyse 17, Evaluate 1 (Understand 3%). All Hard or Hardest. No Remember.
- multi_statement keys: "1 and 3 only", "2 and 3 only", "2 only" (varied; one item has the true-statement count 2, 2, 1).
- Correct option is the longest or tied-longest in 5 of 11 choice items; strictly longest in 1 (8.4 mcq 56 vs 59: not longest). Acceptable.
- Claim-check verdicts: Nandini wrong, Priti right, Tina wrong, Zubin right, teacher homework mixed, Yash partly right. Varied.
- Slot order differs across concepts. 5-mark items end in different asks (cost, fraction, test a claim, checking).
- Not templated.

VERDICT: PASS
