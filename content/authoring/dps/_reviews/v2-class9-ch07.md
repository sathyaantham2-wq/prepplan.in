# Review v2: class9 ch07 (The Mathematics of Maybe), dps/class9/ch07.json

First independent review (no earlier class9-ch07 file existed). Source iemh107; scope_in / scope_out from content/authoring/class9/ch07.json.
Read 120 of 120 questions (6 concepts x 20). Every numeric key, multi_statement and assertion_reason was recomputed in code or by hand before reading the key; all 120 keys agree.

Counts: HIGH 0, MEDIUM 2, LOW 8. Verdict: PASS.

## MEDIUM
1. C9M-7.1#17(c): second defensible answer. "For how many values of k is picking purple more likely than not?" k = 4 and 5 are labelled "more likely" in (b) but k = 6 is labelled "certain". The key says 3 "if certain is counted", so 2 is equally defensible. Reword to "probability greater than 1/2" or "more likely or certain".
2. C9M-7.3#19(d): the question says "choose between two options from part (c)", but (c) yields three options: blue (0.30), yellow (0.20) and yellow+green (0.30), each 0.05 from 1/4. The key then discusses only yellow and blue. Name the two options in the stem or drop the pair.

## LOW
3. Difficulty tags are uninformative: all 120 items are d=Hard, though many are easy in disguise. Examples: 7.1#7 (1 - 2/6), 7.3#8 (6/8), 7.5#8 (5x5), 7.6#8 (1200/6), 7.2#7, 7.3#4, 7.3#5, 7.6#1, 7.6#2 (standard fallacy item).
4. 7.3#7 assertion_reason: R (11 letters) is the denominator of A, so a student can argue that R partly explains A. The key "both true, R not the explanation" is the usual reading but not airtight.
5. Repeated ideas: the Gambler's fallacy/independence idea fills about 10 of 20 items in 7.6 (#1, 2, 6, 7, 9, 11, 16, 18, 19, 20). The two-coin sample space is tested six times in 7.4 (#4, 6, 7, 9, 14, 15).
6. Case studies 7.1#20 and 7.6#19 are weak decisions: the numbers do not drive the choice (which match to rest the batter; the coin's heads bias with no statement of which side Maya's team calls), and any answer is accepted. 7.2#19(d) accepts ordering 840 from a clearly biased sample, which is a mild strawman.
7. Weak distractors: 7.1#2 "0.6%", 7.3#3 "0.99 for every car", 7.3#4 "8/4" (above 1), 7.2#3 same-class option.
8. 7.2#9 true/false: the statement already contains the correct reasoning, so "True" is given away.
9. 7.5#12(a) and the keys of 7.5#14 and 7.5#18 multiply branch probabilities. The book's tree pages (iemh107 p.168-169) only count favourable over total paths. All of these are reproducible by counting ordered pairs (e.g. 15/56 = 3x5 over 8x7), so this is not a scope breach against scope_out (conditional probability), but the method is slightly beyond the book.
10. 7.6#12 is tagged Understand but is a definition recall (fair vs random toss).

## Checked and clean
- Scope: no item breaks scope_out (no conditional probability or Bayes, no nPr/nCr formulas, no distributions or expectation, no geometric probability, no sampling-method theory). Subjective probability (p.155), the paper cup, the two-dice sum, the four-digit number and the 3-question guessing item all trace to the book's text or exercises. Percent/decimal forms follow the book's 0.75 = 75% usage.
- No positional option references; statements are labelled "Statement 1/2/3". multi_statement keys vary (1&3, 1&3, 2&3, 1&2, all, 1 only), and the 3-statement form matches the dps-question-style skill.
- Recomputed OK: STATISTICS 3/5, PROBABILITY 2/11, EXAMINATION 6 vowels of 11, two dice (9 -> 4, prime sum -> 15/36), primes up to 36 = 11, x = 9 extra squares, four-digit numbers (24 / 12 even / 14 above 2400), 29/81 vs 5/18, guessing 1/64, 9/64, 5/32, 7/16, all match-type keys and the 7.6#17 gap data.
