# Review v2 (first independent review): Class 9 Maths, ch08 (iemh108), content/authoring/dps/class9/ch08.json

Read: all 124 questions (C9M-8.1: 20, 8.2: 20, 8.3: 20, 8.4: 21, 8.5: 21, 8.6: 22). No earlier review file existed for class9-ch08.
Method: every key, every case-study part and every distractor was recomputed in code/by hand against the stem and checked against `content/extracted/iemh108/pages/`. Source is Ganita Manjari ch 8 (book pp 174-195).

Result: 1 HIGH, 4 MEDIUM, 9 LOW. All numeric keys, multi_statement keys and assertion_reason keys recompute correctly. Not templated.

## HIGH

1. **C9M-8.4 Q20 (job offers A vs B), part (d): second defensible answer.** Key: "for 10 years Offer A is better (year 10: A 7,20,000 vs B 6,72,000)". But over a 10-year stay, total earnings are A = 58,50,000 and B = 59,10,000, so B is better by Rs 60,000. "Suits a plan of 10 years" most naturally means total pay, and the key's reasoning rests only on the final-year salary and the crossover. A student who sums correctly gets B and loses the mark. The 4-year case is consistent either way (B: 21,48,000 vs A: 19,80,000).
   Fix: state the criterion in the stem ("compare the salary she will be paid in her last year of the plan"), or change the offers so the crossover and the totals agree (for example B raises by Rs 12,000: year-6 values then differ, so recompute (a)-(d)).

## MEDIUM

2. **Difficulty inflation across the chapter.** Every non-long item is tagged Hard, but many are one-step: 8.1 Q1 (1+...+8), Q2 (12^2-11^2), Q3, Q6 (sum of 12 odds); 8.2 Q1, Q6, Q7; 8.3 Q6; 8.4 Q6; 8.5 Q1, Q8, Q10; 8.6 Q1, Q6, Q13. Q12 in 8.1 (finite vs infinite) is pure recall. Fix: retag these Medium/Apply, or make them two-step (for example 8.1 Q1: find the number of rows from a given total).
3. **C9M-8.4 Q21 (rangoli), part (d): strawman decision.** "One Stage 99 pattern (497 dots) versus two Stage 49 patterns (494 dots)." One large pattern is plainly bigger and the stem gives no criterion that would favour two. Fix: add a criterion (for example "each of two patterns needs a border of at least 60 dots" or a prize for the number of patterns) so both options have a real case.
4. **C9M-8.3 Q7 (match, item 4) and Q13: tribonacci recursion is not in this book.** T_n = T_(n-1) + T_(n-2) + T_(n-3) appears nowhere in iemh108 (the book uses only two-term and one-term recursion). The stems define it, so it is answerable, but it is beyond what this book teaches. Fix: replace with a two-term variant (for example t1 = 2, t2 = 3, t_n = t_(n-1) + t_(n-2)) or tag the item as an extension.
5. **C9M-8.6 Q4 (multi_statement): all three statements true, key "1, 2 and 3".** Legal, but together with Q5 (which tests the same count-up/area-down idea) the concept has no statement item that discriminates. Also 8.6 has four items on one idea (Q5, Q12, Q14, Q19: black count rises as 3^n, area falls as (3/4)^n). Fix: make Statement 3 false (for example "the number of black triangles is four times...") and swap Q14 or Q5 for a carpet or bouncing-ball idea.

## LOW

6. **8.3 Q15 is the book's own worked example** (u1 = 1, u_n = 2u_(n-1) + 3, "is 133 a term?", book p 5/ch pg 178). Change the number (for example 253 + 1 or 130) so it is not a textbook copy.
7. **8.1 Q8, option 4** ("13 x 7, the product of its factors") is not a sum of natural numbers, so it fails the stem's own condition and is not a real confusion. Replace with "1 + 2 + 3 + ... + 91" or "1 + 2 + ... + 7 + 13".
8. **8.1 Q3 uses s_n while the book uses t_n.** 8.2 mixes s_n, t_n and u_n. Fine within an item, but one notation per concept would be cleaner.
9. **Repeated ideas:** "position must be natural / negative n" appears in 8.1 Q14, 8.2 Q5 and 8.2 Q12; "chairs in rows" appears in 8.1 Q19 and 8.5 Q19 (both case-study-like, 300 and 500 chairs). Vary one of each.
10. **8.3 Q5 (AR):** R is a generic definition, so the "both true, R not the explanation" key is correct but R carries no content. Use a more specific reason, for example "the ratio and the difference of consecutive terms both change", paired with a wrong explanation.
11. **8.5 Q17:** the answer is written in the stem (S70 - S29 = 30 + ... + 70); the task only evaluates it. Ask the student to write the sum for 30 + ... + 70 as a difference and then evaluate it.
12. **8.5 Q19 (e) and 8.1 Q20 (d)** accept any reasoned view. Acceptable, but the rubric is thin; name the quantities a good answer must use.
13. **8.5 Q19 and 8.1 Q19** carry `long_answer` without the `case_study` tag, while the sibling items are tagged. Tag consistently if the paper builder uses the tag.
14. **8.6 Q7 item 4 (100, 110, 121, 133.1)** is compound interest in disguise. It is only a ratio-finding task, so inside scope, but scope_out says "Compound interest as a GP: not developed here"; consider a neutral context.

## Checks that passed (recomputed)

- Keys: all mcq, fill_blank, match, true_false, multi_statement (3-statement format as the authoring brief requires; false statements are spread over 1, 2, 3, and over "all true" in 8.6) and assertion_reason keys are correct. Spot-confirmed: 8.2 Q2 only 480 fits 7n - 3 (482, 486, 490 give 69.3, 69.9, 70.4); 8.5 Q6 = 45 (S44 = 990, S45 = 1035); 8.5 Q4 S2 is false (book: S58 - S24); 8.3 Q4 S3 false (Virahanka c. 7th century precedes Fibonacci c. 1200 CE, book p 179); 8.5 Q4 S3 true (Aryabhata, book p 185).
- Case studies: every part recomputed (8.1 Q19, Q20; 8.2 Q19, Q20; 8.3 Q19, Q20; 8.4 Q21; 8.5 Q20, Q21; 8.6 Q21, Q22); all correct apart from the item 1 criterion problem. 8.5 Q18 claim "exactly four ways" is rightly refuted (45 has 5 representations with two or more terms: 1-9, 5-10, 7-11, 14-16, 22+23).
- Scope: no scope_out violation found (no general AP/GP sum formula, no sum to infinity, no harmonic progression, no closed Fibonacci formula). 8.5 Q9 and Q13 use the Aryabhata average rule, which the book gives for natural-number sums only.
- No positional option references ("option A", "the first option").
- Not templated: stems and settings vary; the show-impossible, claim-check and reverse items each use different contexts.

## Per-concept verdict

- C9M-8.1: pass (items 2, 7, 8, 9)
- C9M-8.2: pass (items 2, 8, 9)
- C9M-8.3: pass with edits (items 4, 6, 10)
- C9M-8.4: needs a fix, Q20 (item 1), and Q21 (item 3)
- C9M-8.5: pass (items 2, 11, 12)
- C9M-8.6: pass with edits (items 5, 14)

## Verdict

Not a clean pass: one HIGH (8.4 Q20 part (d) has a second defensible answer). Everything else is MEDIUM/LOW. After fixing item 1 and the small MEDIUMs (3, 4, 5) the chapter reaches the DPS standard.
