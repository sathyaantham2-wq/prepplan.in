# Review v3: Class 7 Maths Part I ch 3 (gegp103), `content/authoring/dps/class7/p1ch03.json`, after the v2 fix pass

Read all 188 items (9 concepts: 20/21x8), none sampled. Every number recomputed in python (Decimal; brute force over digit
permutations for the "closest to" / "smallest" puzzles, and for the interval and sequence items). Facts checked against
`content/extracted/gegp103/pages/` (hummingbird egg, goby, Wolfi octopus p.52-53 match). Scope: `content/structure/class7-maths-part1-ch02-08.md`.
Text identical to v1 backup: 92 of 188 (49%), down from 150 (80%) in v2.

## HIGH (wrong key or second defensible answer)

1. **C7M-3.3 Q11** "From the numbers 3.6, 3.06, 0.306, 3.600, 3.60, 3.006 and 03.60: (a) list those equal to 3.6. (b) Of the remaining three, which is the smallest".
   Key (a) "3.600, 3.60 and 03.60" omits the listed number 3.6 itself (which is equal to 3.6). The stem's "remaining three"
   needs four equal numbers (3.6, 3.600, 3.60, 03.60); with the key's three equal ones, four would remain. Stem and key
   disagree; (a) has two defensible answers. Smallest fix: change (a) to "list the other numbers in the list that are equal to 3.6"
   and the key to "3.600, 3.60 and 03.60", and (b) to "Of the other three" (3.06, 0.306, 3.006); or add 3.6 to the key.

## MEDIUM

1. **Easy-in-disguise, 25 items of 188 (13.3%), down from 38 (20%).** Test used: answer is one conversion, one rule application or one book line with no second step.
   - 3.1 (2): Q11 17 pieces of 1/10 m -> 1 7/10 m (one conversion; the book's own 17/10 form); Q9 AR "9/100 same as 9/10 because both have a 9" (strawman A, R is the book line).
   - 3.2 (3): Q12 fill "6 tens, 0 units, 9 hundredths -> 60.09" (read digits off a description); Q18 "announce 0.406" (read-aloud rule); Q9 Meena claim (strawman the book answers in one line).
   - 3.3 (3): Q10 "0.6 as 0.60 and 0.600; is 0.06 equal?" (book rule twice); Q1 true_false 6.30 = 6.3 (the book's own line, verdict True); Q16 AR 0.30 = 0.3 with a strawman R.
   - 3.4 (3): Q15 match "which place decides" (four one-step looks, labelled Understand); Q4 number line 5 to 10, 7th mark (one read); Q10 count marks on a 0-2 line (counting in 0.2).
   - 3.5 (3): Q8 4.3 cm -> 43 mm and 87 mm -> 8.7 cm -> 0.087 m (conversions only); Q13 25 paise -> Rs 0.25 (the book's 75 paise example); Q14 AR 42 cm = 0.42 m with R restating it (labelled Understand).
   - 3.6 (2): Q9 12.4 - 6.7 (one subtraction in a thin story); Q7 add then subtract 8.364 and 0.678 (two bare calculations).
   - 3.7 (3): Q2, Q4 ("range then exact" for one sum/difference) and Q15 (apply the range rule once). The rule is derived, so not book lookups, but thinking is one step; they are also the same move as Q0, Q1, Q7, Q12, Q16.
   - 3.8 (3): Q2 true_false 9.3 overs = 57 balls (one use of 9x6+3); Q9 2.1 h = 2 h 6 min then add; Q11 2.7 h after 3:15 (same move).
   - 3.9 (3): Q2 "change then next two terms" of 20.8, 20.35, 19.9; Q9 pick the sequence with no constant change (one check per option); Q18 midpoint of 4.6 and 5.9 (one step, and see scope note below).
   REPLACEMENT items that are themselves one-step: 3.1 Q11, 3.2 Q12 and Q18, 3.3 Q10, 3.4 Q4 and Q15, 3.5 Q13, 3.6 Q9, 3.8 Q9, Q11 (each new or rewritten item above). Fix pattern: add a second idea (a misread plus its size, an ordering plus a threshold) as the v2 review asked; 3.5 Q15/3.6 Q16 and 3.4 Q5, 3.5 Q10, 3.2 Q15 are good examples of what the replacements should look like.

2. **Scope_out, decimal multiplication/division in keys: nearly fixed, two remain.** Scope_out line: "multiplication/division of decimals (Part II Ch 4)".
   - C7M-3.8 Q19(a) key "0.4 x 60 = 24, so 2 h 24 min" (decimal times whole). Say "4 tenths of an hour, each 6 minutes: 4 x 6 = 24" as Q10 already does.
   - C7M-3.5 Q8(a) key "4.3 x 10 = 43 mm" (low): say "4 cm 3 mm = 40 mm + 3 mm".
   - LOW: C7M-3.9 Q18 needs half of 1.3 (halving a decimal; the key is only the option 5.25): ask week 1 4.6 and week 3 5.2 (halving 0.6) or use a book-style 2-step ladder; C7M-3.8 Q1 "4 tenths of 12 in = 4.8" (12/10 = 1.2) is division of a whole by 10, acceptable but state "12 in cut into 10 equal parts is 1.2 in".
   Confirmed fixed: 3.4 (old 9b 1.4/0.2 now counting in 0.2), 3.3 (old 24.50/2.45 gone), 3.5 (old 0.1 x 0.1 now fractions), 3.8 Q17 (gone), 3.9 "4 x 0.89" and "-1.75" (gone, now "falls by").

3. **C7M-3.4 Q9** "Name the digit that decided between the first two." The key sentence "Between 8.399 and 8.34 the tenths tie at 3 and the hundredths 9 > 4 decide" talks about the 2nd and 3rd terms, while the first two terms are 8.4 and 8.399 and the step says "(tenths 4 versus 3)". Answer and step disagree. Fix: key "Between 8.4 and 8.399 the tenths digits 4 and 3 decide".

4. **Case-study stems under the 45-word floor** (words before part (a)): C7M-3.3 Q20 = 37, Q19 = 42, C7M-3.4 Q19 = 44. (The other 15 are 48 to 76.) Add a data point or condition.

5. **Repetition inside concepts is still high** (counts of items built on the same idea):
   - 3.3: right-end zero / zero after the point idea in about 13 of 21 (Q0, Q1, Q4, Q7, Q9, Q10, Q11, Q12, Q13, Q14, Q16, Q17, Q18). Many are now computed, but the concept is one idea asked 13 times; replace three with comparing sums or differences of such decimals.
   - 3.7: "give the range, then the exact value" in Q0, Q1, Q2, Q4, Q7, Q12, Q16, Q19 (8); Q2/Q4 are the same item with new numbers.
   - 3.8: only two ideas: overs/balls in Q0, Q2, Q8, Q12, Q13, Q15, Q17, Q18, Q20 (9) and decimal hours in Q3, Q4, Q6, Q7, Q9, Q10, Q11, Q14, Q16, Q19 (10).
   - 3.9: "closest to a target" in Q0, Q3, Q4, Q6, Q7, Q10, Q12, Q13, Q16, Q17, Q19 (11, with Q0/Q4 and Q10/Q12 near twins); sequences in Q1, Q2, Q5, Q8, Q9, Q14, Q18, Q20 (8).
   - 3.2 write-the-described-quantity: Q3, Q12, Q1, Q6, Q18 still 5; 3.6 slip "last digits not points" Q5 (true_false) and Q14 (Imran) are twins.

## LOW

- C7M-3.8 Q1 "will not fit" is asserted without the frame being wider/narrower stated; pronoun "he" for Ritu.
- C7M-3.8 Q19(d) and C7M-3.6 Q19(d) are tight single-answer checks, but each now has a conditional ("if the message meant 2 h 40") or a margin comment; acceptable.
- C7M-3.6 Q18 is labelled claim_check but is "find the error" (three such items remain: 3.5 Q18 is a true claim_check; 3.6 Q18 is not a claim).
- MS statement labels: 3.1, 3.3, 3.4 use "Statement I/II/III" with Roman keys; the other six use "Statement 1/2/3". Pick one.
- Slot order is no longer identical (see counts), but every concept still ends with the same two case studies and the same 3-mark triple (claim_check / show_impossible / reverse); and most are school/shop settings.
- C7M-3.1 Q13 etc. fine. 3.1 has no true_false (8 true_false across 9 concepts, loader needs 5: ok).

## Were all earlier MEDIUMs addressed?

1 easy-in-disguise: partly (38 -> 25). 2 skeleton: mostly (orders now differ per concept; the closing KK block and the 3-mark triple are constant). 3 repetition: partly (3.2, 3.4, 3.5, 3.6, 3.7 duplicates mostly removed; 3.3, 3.8, 3.9 still heavy). 4 AR filler: fixed (every R is now an on-topic statement; outcomes 4 explain / 1 true-not-explain / 2 A-true-R-false / 2 A-false-R-true). 5 scope_out: nearly (2 left). 6 fill_blank word answer: fixed (3.4 Q1 now numeric 9); all 9 fill_blanks have number or time answers, two-step in 3.2 Q12 only if you count it, rest are one-two step. 7 non-decisions: fixed for 3.2 Q19, 3.2 Q18(c), 3.3 Q20, 3.3 Q19 (criterion stated). 8 short case stems: 3.7 Q18 fixed; 3.3/3.4 remain. 9 3.7 Q1 numbers: fixed (15.2 - 6.9, range 8-10, single answer).

## NEW defects introduced by the fix pass

- HIGH: 3.3 Q11 stem/key mismatch (above).
- MEDIUM: 3.4 Q9 key text names the wrong pair (above).
- Scope drift: 3.8 Q19(a) decimal multiplication (kept from v2, not newly introduced), 3.9 Q18 halving a decimal (new).
- No impossible data, ties or second defensible answers found elsewhere: every other key matches python (3.1 135/129 pieces etc.; 3.7 Q6 gives a unique pair; 3.7 Q11 only 4,333.05 is unruled; 3.9 Q11 59.720 / 205.79 unique by brute force; 3.9 Q16 19.75 unique; 3.9 Q17 accepts 2.46 and 2.53 only).
- No option is named by position; step marks sum to the item marks everywhere (checked by code); no case study part is answerable from its own stem.

## Counts

Items 188: mcq 40 (34 scenario-tagged), short_answer 80, long_answer 36 (18 five-mark, 18 four-mark case studies), fill_blank 9, assertion_reason 9, multi_statement 9, match 5, true_false 8 (4 True / 4 False; 3.1 has none), claim_check 9 (Yes 3: 3.3, 3.7, 3.9; No 3: 3.1, 3.2, 3.8; Partly right 2: 3.4, 3.5; "find the error" 1: 3.6). Bloom: Apply 84, Analyse 67, Evaluate 21, Create 9, Understand 7 (3.7%); A/E/C 97 (51.6%). Correct MCQ option strictly longest: 6 of 40 (15%), no length template. `multi_statement` keys: "I and III only" x2, "2 and 3 only" x2, one each of "I and II only", "3 only", "1 and 2 only", "1 only", "1 and 3 only" (7 different keys, no template). AR keys: R-explains x4, A-false x2, R-false x2, not-explain x1. Slot strings differ per concept (e.g. 3.1 MSFRSLILSASMXMTSMCKK, 3.4 CFRBMSMLSSSASMIXTMLKK, 3.9 MFSSMRCBIMSLSALTSMMKK) but all end in KK.

## Per-concept verdicts

- C7M-3.1: keys right; pass (2 easy, 1 weak strawman AR).
- C7M-3.2: keys right; pass after fixes (3 easy, repeated "write as decimal").
- C7M-3.3: **one HIGH (Q11)**; pass after fixes (3 easy, 13 zero-idea items, 2 short case stems).
- C7M-3.4: keys right; pass after fixes (Q9 key wording, 3 easy, case stem 44 words).
- C7M-3.5: keys right; pass after fixes (3 easy, 4.3 x 10 in key).
- C7M-3.6: keys right; pass (2 easy).
- C7M-3.7: keys right; pass after fixes (range-then-exact asked 8 times; 3 easy).
- C7M-3.8: keys right; pass after fixes (two ideas x 20, 0.4 x 60 in key, 3 easy).
- C7M-3.9: keys right; pass after fixes (closest-to 11 items, halving a decimal in Q18, 3 easy).

## Overall verdict

Pass after fixes. The fix worked on the structural problems (49% unchanged text instead of 80%, AR reasons real, scope_out nearly clean, order varies, easy-in-disguise 25 of 188 = 13.3% from 38 = 20%). One HIGH remains (3.3 Q11) and 25 items are still one-step. Counts read: 188; HIGH 1; MEDIUM 5 groups; LOW 6.
