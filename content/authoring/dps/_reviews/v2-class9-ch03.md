# Review v2: class9 ch03 (The World of Numbers, iemh103) -- first independent review

File: content/authoring/dps/class9/ch03.json. No earlier class9-ch03 review existed (hence v2 by instruction).
Read: 124 questions (3.1: 21, 3.2: 20, 3.3: 20, 3.4: 20, 3.5: 22, 3.6: 21). Every numeric key, every
multi_statement and assertion_reason was recomputed in code or by hand before reading the key. Book facts
(Ishango 11/13/17/19, Lothal, Saraswati herder, asanna, Lambert 1761, Aryabhata 499, Madhava 14th c.,
2.47 = 2.46999..., Babylonian/Mayan placeholders) were checked against extracted pages 001-003, 013, 016, 022.

Result: 2 HIGH, 6 MEDIUM, 6 LOW. Verdict: NOT PASS (fix HIGH and the wrong-explanation MEDIUM, then re-review).
All 124 numeric/logic keys are mathematically right except the explanation slip in 3.6 Q15(c). All 6 multi_statement
keys are correct (1 and 3 only / 2 only / 1 and 2 only / 2 and 3 only / 1 only / all three: well varied).

## HIGH

1. C9M-3.4 Q0 (mcq, index 0): key text is not one of the options. Key: "p^2 is twice an integer, so p^2 is even and a
   number whose square is even is itself even"; option 1 reads "...so p^2 is even and p is even". The loader will
   not match the key. Also, as written, the "wrong" option 1 is the same correct statement shortened, so there
   are two defensible answers. Rewrite so exactly one option carries the "square even => number even" step.
2. C9M-3.4 Q15 (mcq, index 15): key has the extra clause "(and sqrt9 = 3 is rational)" that the matching option
   lacks, so key is not in options (exact-match failure). Make key and option identical.

## MEDIUM

1. C9M-3.6 Q15 (case study) part (c): key says the block of 3/13 is 076923 "shifted left by 3 places". 230769 is
   076923 rotated left by 4 (or right by 2). Verified: n=1,3,4,9,10,12 use cycle 076923; n=2,5,6,7,8,11 use
   153846 (this part of (d) is right). Fix the wording.
2. C9M-3.2 repetition of "q != 0 / 5/0": Q3 (AR on 5/0), Q6 (why q != 0), Q18 (T/F on 5/0) are the same idea
   three times; Q2 S3, Q10(c) and Q17 (AR on closure of division with zero divisor) hit the divide-by-zero idea
   twice more. Keep one or two, replace the rest with other ideas (e.g. closure of subtraction, additive
   inverse, equivalent forms in a decision).
3. C9M-3.2 Q13 (canteen case study) is a strawman: two small packs give exactly 1 1/2 kg, cost less and have a
   lower rate per kg, so nothing pulls the other way. Add a real trade-off (e.g. a bulk discount or wastage).
4. C9M-3.3 Q15 (hill-station case study): the farmer's "average above -2 so no cover" is an absurd claim by a
   named speaker and (d) is answered by (a)-(c) data in one glance; absolute value plays almost no role.
   Make the decision genuinely two-sided.
5. C9M-3.3 repeated idea: "take the average" is the engine of about ten items (Q0, 7, 8, 9, 11, 13, 14, 18, 19,
   AR Q3). Beyond about two per concept it is one idea retested. Vary (e.g. place p/q using a different
   subdivision, density via common denominators, absolute-value distance problems).
6. C9M-3.5 repetition: Q2 (Rohan, 21/35 has factor 7 so repeats) and Q12 (Dev, 21/35 has factor 7 so repeats) are
   the identical fraction and misconception. Change one.
7. Scope: scope_out says Madhava's series is "only introduced", infinite series left to higher grades. C9M-3.4 Q7
   (explain Madhava's series), Q18 (fill_blank: 4(1 - 1/3 + 1/5)) and AR Q3 / MS Q2 lean on it; Q18 is a
   computation with the series. Replace Q18 and soften Q7 to what the book says (irrational => no fraction;
   infinite sum is needed).

## LOW

- C9M-3.1 Q5 (Lothal 7 ingots per 3 bags): a ratio scaling item, not an integer/zero idea; easy in disguise
  (mental 6 x 7). Also in the 3.1 case study Q14 the generator decision never compares with not renting
  (renting is judged only against "no debt"); add the no-rent baseline.
- C9M-3.1 Q15 (herder) part (b) asks "which number would mean all cows are back" and the stem already says the
  pot-empty idea; mildly answered by the context. Acceptable but thin on analysis.
- C9M-3.4 Q14 (pi altar) and Q13: (a) is a bare subtraction (1762 - 499) and the (d) choice (3.1416 vs 3.14) is
  trivially "the closer one".
- C9M-3.5 Q18 (c): rounds 0.425 to 0.43, relying on round-half-up; rounding is not taught in this chapter. State
  the rounding rule in the stem.
- C9M-3.6 Q16 (cycling track): (d) is a strawman ("use the exact value") with no counter-pull.
- Format check: assertion_reason keys are explanation strings that are not literally in the option lists (all
  six chapters' AR items do this: 3.1 Q3, 3.2 Q3/Q17, 3.3 Q3, 3.4 Q3/Q17, 3.5 Q5, 3.6 Q3). I assume the loader
  treats AR keys as free explanation; run scripts/load-dps-pack.ts --check to confirm. 3.2 Q17 option 1 is
  worded non-standardly ("The assertion is false as stated because the divisor may be zero, but...").

## Checked and clean

No positional option references found. No facts beyond the book found (all cited facts are on the pages).
Claim-check verdicts: 3.1 No, 3.2 No, 3.3 Yes, 3.4 partly, 3.5 No, 3.6 Yes: fine mix. True/False verdicts:
3.1 T, 3.2 F, 3.3 T, 3.4 F, 3.5 F, 3.6 F (2 of 6 True): acceptable. Correct option is the longest in about 9 MCQs
(3.1 Q0; 3.2 Q1; 3.3 Q0/16/17; 3.4 Q1; 3.5 Q0/Q1; 3.6 Q18): mostly length-equal short numerics; only 3.3 Q16 and
3.6 Q18 have a visibly longer correct option (LOW). Bloom spread is acceptable; no Remember/Easy.
