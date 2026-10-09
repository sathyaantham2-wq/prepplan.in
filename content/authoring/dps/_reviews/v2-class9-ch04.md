# Review v2: class9 ch04 (Exploring Algebraic Identities), iemh104

First independent review of `content/authoring/dps/class9/ch04.json` (no earlier class9-ch04 file existed). 127 questions read, 6 concepts (21/20/22/21/22/21). Scope from `content/authoring/class9/ch04.json` (scope_in pages 68-90, scope_out list); text checked against `content/extracted/iemh104/pages/`.

Method: every numeric key, expansion, factorisation, statement truth value and AR outcome was recomputed (sympy plus hand arithmetic) and then compared with the stored key. All 127 keys are correct. Multi_statement keys: 1&3, 2&3, 1-2-3, 1&2, 2 only, 3 only, so they vary. AR outcomes use all four, true-false verdicts are mixed, claim checks are mixed (No x2, Yes x2, partly x2).

Counts: HIGH 0, MEDIUM 3, LOW 8. Verdict: PASS (fix the three MEDIUM items when convenient).

## MEDIUM

1. C9M-4.4 MCQ "split 7x as 2x + 5x" (Q72): option C, "A rectangle forms but 2 unit tiles are left over", is also defensible. The stem never says all 12 unit tiles must be used, and (x+2)(x+5) = x^2+7x+10 does leave 2 tiles. The key ("no rectangle forms") only holds if every tile must be used. Fix: add "using all 12 unit tiles in one rectangle with no gaps".
2. C9M-4.4 Q85 (3 marks) and the case study Q89 (6x^2+19x+15): Q85 instructs "split the x term into two parts whose product is 6 x 15" (the ac method). The book (pages 012-014, Ex 4.4) teaches only the monic a+b / ab method plus the product (px+a)(qx+b) = pqx^2+(pb+aq)x+ab. Splitting by the ac product is not taught here. Q89(a) has the same issue, though trial against the pq-formula can reach it. Fix: reword Q85 to "find a and b so that (2x+a)(3x+b) matches, using pb+aq", or drop the ac-split instruction.
3. C9M-4.6 case study Q133 (Hyderabad lawns), part (d): the constraints leave x = 5, 6 and 8 all valid (totals 100, 132 and 208, all under 300; only x = 12 is excluded). The key says x = 8 with no stated criterion, so x = 5 or 6 are equally defensible answers that would be marked wrong. Fix: add "the club wants the larger lawn as big as possible" or similar.

## LOW

- Near-duplicates: Q77 (true/false on x^2+11x+30 = (x+3)(x+10)) and Q81 (why not a=2, b=15 for x^2+11x+30) test the same slip on the same trinomial, which is also the book's Example 11. Change the trinomial in one.
- The 40 m playground path appears twice in 4.6 (MCQ Q117 and long answer Q131 (b)). The MCQ gives away the long answer's (b).
- The x+y+z = 12 / xy+yz+zx = 47 / 3-4-5 triple is reused in 4.3 (Q65) and 4.5 (Q109). x^2+6x+10 is used as the "cannot be done" example in both 4.2 (Q39) and 4.4 (Q83). The cube split with numeric a, b appears in both Q102 and Q110. Vary the numbers.
- Easy in disguise (one-step recall labelled Hard): Q71 (coefficient of x), Q95 ((m-2)^3), Q32 (blank = 6), Q76 (k = 3), Q121 (constant 3), Q9. Add a twist (a sign trap or a reverse step) if the floor is to be kept.
- Q51 (4.3 multi_statement): all three statements are plainly true and S3 is trivial, so "1, 2 and 3" is guessable. Make one statement hinge on a word.
- Q22 (Arjun case study) is mildly strawman-like: the error is announced in the stem, and (d) has an obvious best split (50-1). Q43 (Jaipur slabs) part (d) accepts either choice with a reason, which is fine, but both models already meet the 15 dm need at x = 4, so the "need" does no work. Consider a threshold such as 16.5 dm.
- Q16 and Q42 both use the consecutive-squares pattern (the book's exploration); acceptable as an extension but they sit in different concepts with the same cancelling-terms question in (d).
- Q23 phrase "extend each of its four sides by the same length d" suggests the side grows by 2d when read literally. The key uses side 18+d (growth on one side of each pair). Clarify "so the new side is 18 + d".

## Scope and facts checked

- scope_out ("solving quadratics by factorisation", factor theorem, higher powers, completing the square, partial fractions): no violation. The book's end-of-chapter pool problem solves a quadratic, but no item here does.
- "750 CE" for Sridharacharya (Q66, Q55, Q64) is on page 010 of the book. The Q61 parity argument is original reasoning, not a book fact, and is acceptable.
- No positional option references ("the first option", "above") found. The "Statement 1/2/3" and AR wording are standard.
- Option lengths: the correct answer is not systematically the longest (Q6 and Q27 are slightly longer, within tolerance).
