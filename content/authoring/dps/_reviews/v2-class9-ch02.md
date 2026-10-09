# Review v2 (first independent review): class9 ch02, Introduction to Linear Polynomials (iemh102)

File reviewed: `content/authoring/dps/class9/ch02.json` (not edited). No earlier class9-ch02 review exists.
Scope read from `content/authoring/class9/ch02.json` (scope_in / scope_out) and `content/extracted/iemh102/pages/001-025.txt`.

Questions read: 134 (C9M-2.1: 23, 2.2: 23, 2.3: 22, 2.4: 22, 2.5: 22, 2.6: 22). Every key recomputed by hand and the
risky ones in code (supplier budget, garden areas, seating rows). All 6 assertion_reason, 6 multi_statement, 3 match and
all MCQ keys recompute correctly; every MCQ has four distinct options, no positional option references.

Verdict: NEEDS FIX (2 HIGH, 4 MEDIUM, several LOW). Everything else is sound.

## HIGH

1. **C9M-2.3 #20 (case study, tea-party tables), part (d) key is wrong.** Key: "two rows of 14 tables = 28 tables is the fewest".
   The stem only caps ONE row at 20 tables; it does not limit the number of rows. With r separate rows, seats = 2N + 2r, so
   60 guests need N = 30 - r tables: 3 rows -> 27, 5 rows -> 25, 15 rows (15 single tables of 4) -> 15 tables. Code check
   gave N = 15 at r = 15. So "fewest tables" is 15 (or any answer the student justifies), not 28. Fix: state "exactly two rows"
   in the stem, or ask "show one way to seat 60 guests" and change the step to accept any valid arrangement.

2. **C9M-2.1 #21 (case study, vegetable bed), part (d) key claims a false uniqueness.** Key: "Only x = 12 ... meets both needs".
   Conditions: a side of at least 11 m and area 20x - x^2 >= 95. Code check: x = 11 gives sides 11 and 9, area 99, and
   meets both; x = 8 and x = 9 (width 12 or 11) also meet both. So 11 is a second defensible answer and is even better on
   area. Fix: restrict (d) to "of the lengths in part (c)" or change the conditions so only one length passes (for example
   area at least 98 and a side at least 12, then recheck), and drop the word "only".

## MEDIUM

3. **Claim-check verdict mix is lopsided.** Five of six claim_checks are flatly "No" (2.1 #14, 2.2 #14, 2.4 #13, 2.5 #14,
   2.6 #14), one is "partly" (2.3 #13), none is "Yes" (2.1 #13 Pooja is also a plain No). The skill asks for about half No,
   a quarter Yes, a quarter partly. Make at least one (for example 2.4 #13 or 2.6 #14) a correct claim.

4. **Hard-labelled one-step items (easy in disguise).** Bare substitution or a one-line definition, no thinking beyond the
   rule: 2.2 #3 (value of 4 - 3x at -2), 2.2 #2, 2.4 #4 (b(12)), 2.6 #2 (which line passes through origin), 2.6 #4 (which
   point lies on the line), 2.1 #1 (coefficient after reordering), 2.1 #2 (which is linear), 2.3 #8 (360 - 18n) and 2.2 #6
   (A and R are the same statement restated, so "R explains A" is trivial). Rewrite with a misconception or a second step
   (for example 2.2 #3 with a negative input AND a sign-slip distractor already present, plus ask the input for a given value).

5. **Repetition beyond about twice per concept / across the chapter.**
   - C9M-2.4: h(t) = 3 - 0.5t is used in MCQ #1, MS statement 3 and show_impossible #14 (three times).
   - C9M-2.1: the 30 cm wire rectangle appears in MCQ #5 and long #19 (same area 15x - x^2); 3z^2 - z^3 + 8 in match #8 and short #10; "degree is not the number of terms" in MS statement 2, #13 and #14.
   - C9M-2.5: the Celsius-Fahrenheit p and q appear identically in short #10 and case study #20 part (a).
   - C9M-2.6: y = x + 3 vs y = 2x + 3 appears in MS statement 2 and claim_check #14.
   Swap one of each pair for a new setting.

6. **C9M-2.1 #20 and C9M-2.2 #20, #19 (decision case studies) have a dominated option.** 2.1 #20: the rival quote 90n + 700 gives
   fewer sets for more money at every n up to 40, so the "decision" is a strawman. 2.2 #20: Plan B is dearer than A for
   every n up to 60 and over budget at 45. 2.3 #19 (51 seats > 50) and 2.6 #20/#21 are one-way too. The skill wants a trade-off
   the data supports both ways. Make the crossover fall inside the range asked about in at least 2.1 #20 and 2.2 #20.

## LOW

- 2.1 #18, #9, #4 and #0 use two-variable expressions (including the lw term) although the chapter says it restricts to
  one variable (p.18, 003.txt). They are only written and evaluated, never given a degree except the one-variable square
  case, so this is tolerable. scope_out lists "Polynomials in more than one variable"; keep any degree question to one variable.
- 2.6 #1 "steepest falling line" extends the book's steepness remark (stated only for a > 1 and a < 1, p.16) to negative a
  by size. Reasonable but beyond the page; reword as "largest fall per unit of x".
- x-axis crossings (2.6 #0, #18c, #19c) appear in the book only inside an exercise (p.23); acceptable.
- 2.1 #19 part (d) explanation and 2.3 #14 are guessable (last digits); 2.4 #19 is a mechanical rule application, not a judgement.
- 2.2 #7 statement 2 values a quadratic; allowed (book p.6 does the same).
- Three-statement multi_statement format is correct for the DPS standard; keys vary (1 and 3; 2 and 3; 3 only; all three; 2 only; 1 only).

## Checks that passed
All numeric keys in short and long answers (for example 2.2 #18 crossover v = 10, 2.4 #17 t = 8 at 36 cm, 2.5 #18 x = 10, 2.5 #21
156 units, 2.6 #19 p = 2x + 2, q = 2x - 7, 2.6 #21 weeks 7 and 6). No fact outside this book beyond the Fahrenheit-Celsius
pair, which is on p.12 and p.22 of the source. No positional option references. Assertion-reason covers all four outcomes
across the chapter.
