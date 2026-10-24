# Review: class8/ch06.json (MATH8, Ganita Prakash Gr 8 Part I ch6, hegp106)

Reviewer: independent first review. Read: all 129 questions (C8M-6.1 21, 6.2 22, 6.3 21, 6.4 22, 6.5 20, 6.6 23).
Every key, case-study part, match pairing, statement and assertion-reason was recomputed in python
(scratchpad/review-class8-ch06/chk.py plus numeric spot-checks of every algebraic expansion on random
integers) and book facts checked against pages 007, 009, 014, 020, 032.
Index notation: `n.k` = concept n (6.n), question index k (0-based within the concept, as in the file).

**Result: 0 wrong keys, 0 second defensible answers, 0 arithmetic errors.** Problems are templating of
the case-study decisions, repeated ideas, a handful of near-easy items, and a few scope stretches.

## HIGH

None.

## MEDIUM

**M1. Case-study decisions are one template (11 of 12 case studies).** 1.10, 1.16, 2.3, 2.21, 3.4,
3.15, 4.5, 5.6, 5.15, 6.3(d), 6.21 all end with "which plan / carpet / tray / set should be chosen
within a budget or capacity cap", and in most (1.10 plan C fails 980 seats; 1.16 plan Y needs 135 > 130
samosas; 3.4 files do not clear the budget; 4.5 plan 1 costs Rs 39,200 > 39,000; 5.6 the pair is Rs 120
over; 6.21 size 14 is Rs 200 over) the attractive option is simply knocked out by a threshold check. The
decision is arithmetic on a cap, not a trade-off, and the chapter (identities) is only the way to get
the numbers; a student who multiplies directly reaches the same verdict. Only 4.18 (fair division) and
3.15 (needs one extra shop packet) have a real twist. Smallest fix: keep 4 to 5 of these and recast the
rest as different decisions, for example "is this shortcut valid for every case, justify" (an
identity-proof decision), "which of two students' expressions is equivalent, and who is right", a
fairness or sharing decision like 4.18, or a trade-off where both options are feasible and differ in
cost versus benefit (1.16 could drop the 130 cap and ask which plan earns more per samosa fried).

**M2. Repeated ideas inside a concept (more than about twice).**
- C8M-6.5, "product of two numbers symmetric about a middle number = n^2 - b^2": 5.0, 5.2, 5.9, 5.13,
  5.15, 5.16, 5.19 (7 items). Cut or recast 5.13 (greatest product with sum 100) and 5.9 into other
  ideas (for example a 1C use on algebraic or decimal terms, or the geometric L-shape).
- C8M-6.4, Pattern 1 / (a+b)^2 and (a-b)^2 together: 4.10, 4.14, 4.17, 4.18, 4.20. 4.14 (sum is even) and
  4.20 (difference is 4ab) are near twins. Merge one.
- C8M-6.1, (a+-1)(b+-1) change formula: 1.2, 1.4, 1.8, 1.12, 1.18. Replace 1.8 or 1.18.
- C8M-6.3, "x99 / x999 as 100-1 / 1000-1" in 3.2, 3.4, 3.7, 3.8, 3.10, 3.11, 3.12, 3.13, 3.15, 3.19.
  The 101 / 1001 / 10001 side and the 11 side are under-tested relative to it.
- Chapter-wide, the "corner square counted twice" idea: 4.2, 6.13, 6.21(c). Keep two.

**M3. Easy in disguise (one-line fact or a single step with the method handed over), whatever the Bloom
label.**
- 1.14 "Which of these statements is an identity" (spot the true distributive line; distractors are
  obviously broken). 6.10 "square of the sum of two consecutive numbers m and m+1" is a one-line
  translation. 6.20 is fine (needs checking four pairs); 6.5 is fine.
- 2.10 assertion-reason: R is the definition of like terms and A is its direct application.
- 3.16 "use the rule for 11 on 121 and 1331" is pure rule application; 3.17 is a one-line fact about the
  4 and 5-digit rule; 5.4 fill-blank is a substitution into the identity stated in the stem (a - b = 296);
  5.13 the greatest product is the first option and follows a visible trend.
- Method-handed-over 1-mark scenario MCQs: 4.0, 4.1, 3.1, 3.5, 3.11, 5.2, 5.5 each name the identity or
  the split in the stem, leaving only arithmetic. Acceptable as scenario MCQs, but at most two or three
  should keep the method named; for the rest remove it ("find the area without squaring 53 in full").
Fix: rewrite 1.14, 6.10, 2.10, 3.16 and 5.13 as misconception or compare items (for example 6.10 as
"which of these equals the square of the sum of two consecutive numbers, and which equals the sum of
their squares plus 2m(m+1)" with a reasoned pick).

**M4. Case-study or figure parts answerable from their own stem.**
- 4.2(a): the stem already says "the two strips overlap in a small b-by-b square", which is the whole
  answer to "explain why the area left is a^2 - ab - ab + b^2 and not a^2 - 2ab". Remove the overlap
  sentence from the stem so the student has to see it from the figure description. Also 5.11 simply
  reproduces the book's derivation of 1C (reproduction, not application), as does the 1B derivation in 4.2.
- 2.21(c) says "use part (b)" but size 6 is computed as directly; it is fine, only noting that no step
  needs the chapter beyond (a) and (b).

**M5. Slightly beyond what this book says / near scope_out.**
- 5.3(d) proves 30 is not a difference of two whole-number squares by an odd/even factor-pair argument,
  and 5.3(c) generalises to every odd number. The book only asks "express 100 as the difference of two
  squares" (p.149). The parity argument is number theory the book never teaches. Fix: drop (d) or
  supply the parity fact in the stem and ask only for the factor-pair listing.
- 5.16 Kavya's "square the midway number for any two whole numbers" tests a general mental-multiplication
  method for arbitrary pairs; scope_out line "A general mental-multiplication 'base method' for any two
  arbitrary two-digit or three-digit numbers..." covers this kind of trick. The item is nearly a rewriting
  of 1C, so mark it LOW-MEDIUM; safer fix: restrict the claim to "two numbers an even distance apart".
- 5.7 (n-1)(n+1) lies between consecutive squares: valid and in-chapter in tools, but the "between two
  consecutive squares" reasoning is not taught; acceptable, noting only.

## LOW

- 4.5: "can spend at most Rs 39,000 on paving the new area" is ambiguous (the whole new ground is about
  Rs 5,00,000). Say "paving the extra area" in the stem.
- 5.12(a): "Find two whole numbers whose product equals 50^2 - 7^2" has several correct pairs (2451 = 3 x 19 x
  43, so 43 x 57, 19 x 129 ...). Reword to "as a product of numbers 7 less and 7 more than 50".
- 3.5: options are written 398546 / 397546 / 43406 / 3949946 with no digit grouping while the stem
  writes 3,946. Format as Indian grouping like 3.1 and 5.2.
- 6.5: "the number of circles in Step k of the same pattern" but no pattern is given; the item is about
  equivalence only. Say "three students write expressions for the same count".
- 6.8: the pattern is given only as 8, 15, 24 "and continues in the same way"; a quadratic is assumed.
  State that the step counts are 8, 15, 24 and the number of tiles in step n is described by the three
  students (or describe the shape).
- 6.18: "a shaded region" is not described; the answer uses only the two given expressions, so it is
  answerable, but either drop the word "shaded" or describe the region.
- 6.16 is a 5-mark long answer made of five routine expansions (select an identity and expand); thinking
  is application, not 5-mark analysis. Add a part that asks which of (i) to (v) needs no identity and why,
  or an equivalence check.
- 4.9: R ("(a - b)^2 = (b - a)^2") is true but unrelated to 99^2 = 9801, so the "R does not explain A"
  verdict is true by irrelevance, not by a real confusion. Use an R that tempts (for example
  "(100 - 1)^2 = 100^2 - 1^2").
- 5.1: A is false because 25^2 - 24^2 = 49; fine, no change.
- Difficulty tags: every item is Hard (106) or Hardest (23); there is no spread. A 1-mark one-step
  scenario like 4.0 is not Hard. Retag honestly (or accept that the bank has no Easy by rule and use
  Medium vs Hard).
- Count of figure items is 5, not 4: 2.17, 4.2, 5.11, 6.3, 6.13 are tagged `figure`. All five are described
  fully in words (the 6.3 pinwheel with outer side a + b and hole side b - a is consistent; the 5.11
  L-shape cut and the 6.13 strips with the shared corner are unambiguous). No fix needed.
- `fill_blank`: all ten answers are plain numbers (1.5, 2.7, 2.19, 3.3, 4.6, 4.19, 5.4, 5.17, 6.1, 6.18);
  none is an expression, so no equivalent-form problem. All are single-step application; 5.4 and 3.3 are the
  weakest.

## Option and key checks

- MCQ/AR/MS/match: 44 option items; in all 44 the key equals o[0] (loader shuffles). No duplicate option
  values, no wrong option equal in value to the key, no positional wording ("option (b)") anywhere.
- Correct option strictly longest in 4 of 44; longest or tied-longest in 24 of 44, almost all ties of
  equal-length numeric options (not a pattern).
- `multi_statement` keys: 1 and 3 only; 1, 2 and 3; 1 and 2 only; 2 and 3 only; 1 only; 2 only. Well spread.
- `assertion_reason` outcomes: A false R true (1.2, 5.1); both true R explains (2.10); both true R does
  not (4.9); A true R false (3.7, 6.9). All four covered.
- Claim-check verdicts: No 3 (1.4, 4.7, 6.4), Partly 2 (2.18, 5.16), Yes 1 (3.0). Acceptable mix.
- `true_false` (6, all with reason): True 3 (1.8, 3.6, 5.9), False 3 (2.0, 4.8, 6.2). Mixed; each False
  rests on a real chapter slip (dropped cross term, sign of a square, four terms when two combine).
- Slot order per concept is not identical (strings differ in every concept); stem frames vary. Beyond M1
  and M2 the chapter is not templated.
- Step marks equal total marks on every long/short/case item (checked in code). 2 + 3 mark claims,
  reverse (1.17, 3.12, 5.12, 6.19) and show-impossible (2.5, 4.14, 5.7) all present.
- Facts: khanda-gunanam as "multiplication by parts", Brahmagupta verse 12.55, and the Sridharacharya
  identity a^2 = (a + b)(a - b) + b^2 all match pages 007 and 009; "ista-gunana" for fast multiplication
  (p.144) is not used in the bank, no conflict. Items 6.12 (S1/S2) and 6.7 follow Figure it Out Q5/Q6 on
  p.155 without copying numbers.
- Scope_out: no a^3 + b^3 and no cube of a binomial anywhere; a^3 - b^3 and a^4 - b^4 appear only in 2.4
  S1 and 2.9, which is the Figure it Out p.143 exploration (in scope). No factorisation, no equation
  solving (1.6(e) and 6.4 reason about expressions, not solve). No Coin Conjoin. No positional option
  references.

## Per-concept verdicts

- C8M-6.1: keys all correct; rewrite 1.14 (easy), thin one of the five (a+-1)(b+-1) items (M2); case
  studies 1.10 and 1.16 share the cap-knocks-out-option shape (M1). Pass after fixes.
- C8M-6.2: keys all correct; strongest concept (2.5, 2.9, 2.18, 2.12 good); fix 2.10 (easy AR) and
  2.3 / 2.21 decisions (M1). Pass after fixes.
- C8M-6.3: keys all correct; too many x99/x999 items (M2); 3.4 and 3.15 and 3.19 decisions are cap checks (M1);
  3.16 and 3.17 are near-recall. Pass after fixes.
- C8M-6.4: keys all correct; 4.2 stem leaks (a) (M4); Pattern 1 repeated four ways (M2); 4.5 wording (LOW).
  Pass after fixes.
- C8M-6.5: keys all correct; midpoint idea repeated seven times (M2); 5.3(d) and 5.16 scope stretch (M5);
  5.4 and 5.13 easy (M3); 5.12(a) multiple answers (LOW). Pass after fixes.
- C8M-6.6: keys all correct; 6.10 easy (M3); 6.3 and 6.21 are cap-style decisions (M1); 6.5, 6.8, 6.18 wording
  (LOW). Pass after fixes.

## Counts read

129 read. HIGH 0. MEDIUM 5 (M1 to M5, covering about 30 items). LOW 11 notes. Templated: the
case-study decision is templated (M1) and several ideas repeat (M2), but slot order, stem frames,
claim verdicts, statement keys and true/false verdicts are varied. Verdict: pass after fixes.
