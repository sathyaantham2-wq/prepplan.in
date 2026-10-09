# Review v4: Class 7 Maths Part I ch 3 (gegp103), `content/authoring/dps/class7/p1ch03.json`, after the v3 fix pass

Read all 188 items (9 concepts: 3.1 has 20, the other eight 21), none sampled. Every numeric key recomputed in python
(Decimal; brute force over digit permutations for 3.9 Q11 and Q16; interval / ordering / time checks done by hand and in code).
Facts checked against `content/extracted/gegp103/pages/` (p.031 estimating sums and differences; p.032-033 hours and feet/inches, overs).
Scope: `content/structure/class7-maths-part1-ch02-08.md` (Part I Ch 3). Step marks sum to item marks everywhere (checked by code).
No option is named by position (regex checked).

## HIGH (wrong key or second defensible answer)

None found. Every v3 HIGH/MEDIUM key defect is fixed:
- 3.3 Q11 now reads "the numbers, other than 3.6 itself, that are equal to 3.6" and "the three numbers that are not equal": stem and key agree (3.600, 3.60, 03.60; smallest of 3.06, 0.306, 3.006 is 0.306).
- 3.4 Q9 key now names 8.4 vs 8.399 (tenths 4 vs 3). Consistent.
- 3.8 Q19(a) and 3.5 Q8(a) no longer use decimal multiplication (now "4 tenths of an hour, each 6 minutes" and "40 mm + 3 mm").
- Case-study stems all at least 48 words before part (a) (min 48, in 3.2 Q20 and 3.9 Q19).
- MS labels are now all "Statement 1/2/3".

Unique-answer checks that matter (all pass): 3.9 Q11 (a) 59.720 and (b) 205.79 are unique by brute force; 3.9 Q16 19.75 unique; 3.7 Q6 pair
unique; 3.7 Q11 only 4,333.05 unruled; 3.9 Q9 closest 2.95; 3.9 Q17 accepts 2.46 and 2.53 only; 3.8 Q9 longest 1.6 h (96 min vs 95).

## MEDIUM

1. **Scope_out breach, C7M-3.2 Q19(d)** (case study, scale P splits a unit into 4 then 4): key says "1/16 = 0.0625 ... needs four decimal places".
   Scope_out: "converting general fractions like 1/3 or 1/7 to decimals". 1/16 to a decimal needs division. Smallest fix: drop the 0.0625 remark;
   compare 1/16 with 1/10 as fractions (16 parts is finer than 10 parts, so 1/16 < 1/10) and make the drawback of P "its readings are
   not tenths or hundredths, so they do not write directly as one- or two-place decimals". Also part (a) is arithmetic from the stem
   (4 x 4, 10 x 10): rework so it needs the chapter, e.g. "write one smallest part of each scale as a fraction of the unit and say which is
   a decimal place".

2. **Easy-in-disguise, about 27 of 188 (14%), not materially down from v3 (25).** Test: one conversion, one rule application or one
   read-off, no second idea.
   - 3.1: Q2 fill (add 26 + 17 tenths); Q8 (29 tenths = 29 pieces, mixed form of 29/10).
   - 3.2: Q6 mcq (7.5 read back); Q7 match (four digit values read off).
   - 3.3: Q3 mcq (0.3 + 0.4 + 0.2); Q5 mcq (0.002 vs 0.02); Q8 mcq (pad to three places).
   - 3.4: Q4 mcq (read a marker); Q13 mcq (order of zooms, the book's rule); Q17 mcq (order four decimals).
   - 3.5: Q1 mcq (250 g + 1.5 kg); Q13 mcq (75 paise + 85 paise to rupees); Q16 match (four conversions).
   - 3.6: Q9, Q14, Q15, Q16, Q17 mcq and Q13 fill: six bare column calculations in a thin story; Q14-Q17 are four near-identical "kind of person, two or three amounts, find total/left" items (see templating).
   - 3.7: Q0 fill (47.3 - 18.8 after the range is handed over); Q6 mcq (read the rule off four pairs).
   - 3.8: Q8 mcq (8.5 + 1 ball = 9.0, the book's own 5.5 style); Q13 and Q18 mcq (one overs-to-balls step each).
   - 3.9: Q0 mcq (four differences from 1); Q1 fill (one change, 7th term); Q18 mcq (one change, one step).
   Fix pattern: add a second idea or a threshold (as in 3.5 Q20, 3.6 Q20, 3.9 Q20 which are good). For 3.6, turn two of Q14-Q17 into
   a "find the slip" or an estimate-then-compute item.

3. **Repetition inside concepts (counts of items built on one idea) still heavy in the narrow concepts.**
   - 3.7 (range rule): essentially all 21 items apply "whole-number parts give a range"; items Q1 and Q16, Q2 and Q13, Q5 and Q14, Q8 and Q11 are
     near twins (a slipped sum, check range, give exact). Replace two of these with the *difference* range from first principles or with a
     decision using the range (e.g. a bill that must stay under a limit).
   - 3.8: two ideas only, overs/balls (Q0, Q2, Q8, Q12, Q13, Q15, Q17, Q18, Q20 = 9) and decimal hours (Q1 ft/in, Q3, Q4, Q6, Q7, Q9, Q10, Q11, Q16, Q19 = 10).
     Q4 and Q10 (2.5 h and 2.4 h to h:min then compare to a wrong reading) are the same item with new numbers.
   - 3.9: "closest to a target" Q0, Q3, Q6, Q7, Q10, Q11, Q12, Q13, Q16, Q17, Q19 (11) and sequences Q1, Q2, Q4, Q5, Q8, Q9, Q14, Q15, Q18, Q20 (10). Q6 and Q7 and Q13 are the same
     "below the target can be closest" idea three times (claim_check, true_false, AR).
   - 3.3: right-end zero idea in about 12 of 21 (Q0, Q1, Q4, Q7, Q9, Q10, Q12, Q13, Q14, Q16, Q17, Q18); now mostly computed but Q0, Q1, Q18 say the same thing.

4. **C7M-3.6 Q4 (assertion_reason)** R: "Taking a number smaller than 1 away from 40 always leaves a result between 39 and 40." As written
   "a number smaller than 1" includes 0 (result 40, not between) and negatives, so R is arguably false and the key (both true, R not explaining)
   becomes a second defensible answer (A true, R false). Smallest fix: "a decimal between 0 and 1".

## LOW

- C7M-3.4 Q4 "third mark counting back from 6.8": a reader who counts 6.8 as the first mark gets 6.78 (not an option, so the key stands). Say "three marks to the left of 6.8".
- C7M-3.7 Q2(b) "Can it be exactly 7?": the book's claim is that the sum is *greater than* the whole-part sum for decimals; 4.0 + 3.0 is a whole-number sum. State "both with non-zero fractional parts" (as 3.7 Q13 does) and the answer becomes "no, strictly between 7 and 9".
- C7M-3.9 Q14 alternating +0.5, -0.25 sequence: the chapter's sequences all have one constant change (scope IN: "find its constant change"). Acceptable as a stretch, but part (d) "check the 9th term" is circular (it re-derives the part (b) values).
- C7M-3.8 Q1 feet and inches: book-supported (p.032, door 2.5 ft) but outside the structure file's list (clock and overs only). Fine; note it in scope.
- C7M-3.8 Q20(d) "any choice is accepted" and no cricket rule (a bowler cannot bowl two overs running) is stated, so it is a weak decision; give a constraint, e.g. "Kabir cannot bowl the 19th".
- C7M-3.1 Q19 pronouns: "the customer says *she*... *he* needs 86 tenths". C7M-3.6 Q3 "student ... he took". Make consistent.
- C7M-3.3 Q0 (claim_check, Yes) and Q1 (true_false, True) restate the book's own trailing-zero line; the second part of each claim gives the thought, but both verdicts are the "agree" kind. 3.3 Q1 True also overlaps 3.3 Q14(d).
- C7M-3.5 Q19 (Grandfather): parts (a) and (b) are bare conversions and (d) has one forced answer (banana), so it climbs less than the other case studies; add a third treat or a bus-fare uncertainty if a real trade-off is wanted.
- C7M-3.6 Q19 (temperature): (d) is a yes with narrow margins, close to a strawman; a mild second consideration (one more reading) is in the key, put it in the stem as a condition.

## Template check, with counts

- Types: mcq 40 (24 correct option ties or equals the max length when ties are counted; **strictly longest only 6 of 40 = 15%**, so no length tell), short_answer 80, long_answer 36, fill_blank 9, assertion_reason 9, multi_statement 9, match 5. true_false 8 (3 True: 3.3, 3.7, 3.9; 5 False; 62% False, within 25-75%); 3.1 has none (chapter rule is 1 per two concepts: met). claim_check 9: Yes 3 (3.3, 3.7, 3.9), No 3 (3.1, 3.6, 3.8), Partly right 3 (3.2, 3.4, 3.5). Mix is balanced (a little light on "No" against the half-No guide, but no flaw).
- `multi_statement` keys: "1 and 3 only" x3 (3.1, 3.3, 3.9), "2 and 3 only" x2, "1 and 2 only" x2, "3 only" x1, "1 only" x1. Five distinct keys, no "all three" key (fine; nothing dominates).
- Assertion-reason keys: R explains x3 (3.2, 3.7, 3.9), true-not-explain x1 (3.6), A-false x2 (3.1, 3.4), R-false x3 (3.3, 3.5, 3.8). All four outcomes covered.
- Bloom: Analyse 86, Apply 67, Evaluate 21, Create 9, Understand 5 (2.7%); A/E/C = 116 of 188 (62%). No Remember. Difficulty: Hard 152, Hardest 36, no Easy.
- Slot strings by concept (M mcq, S short, L long, F fill, R AR, X MS, T match): 3.1 MSFSSLSLSRSMTMXSMSLL, 3.2 SMSLRSMTSSSSFSMLSXMLL, 3.3 SSSMSMMLMSSSSXLMRFSLL,
  3.4 SFSSMSMLSSSRSMSTXMLLL, 3.5 SMSLLSSMSFMSSMRXTSSLL, 3.6 SLSSRSSSLMSSXFMMMMSLL, 3.7 FSSSSSMLSSRMLXSMSMTLL, 3.8 LSSSSXLSMMSMSMSRFSMLL, 3.9 MFSSMSSSSMSLSRLXSMMLL.
  Order differs per concept; every concept ends "LL" (two case studies, as required), which is the loader's slot rule rather than a template. 3.6 has a run of four MCQs (Q14-Q17) with the same bare-calculation frame; 3.7 Q1-Q5 are five short answers in a row with the same "range then exact" frame.
- Case-study stems before part (a): 48 to 76 words (min 48 in 3.2 Q20 and 3.9 Q19; all above the 45 floor). Settings: schools and shops dominate (about 12 of 18), with a clinic, a train journey, a museum, a packing unit and a bus; acceptable variety.
- Verdict on templating: **not templated** as a whole. Concept-internal repetition (item 3) is the remaining weakness, and it is a function of narrow concepts (3.7, 3.8, 3.9), not of a copied frame.

## Were the v3 findings addressed?

HIGH 3.3 Q11: fixed. MEDIUM 1 (easy in disguise): partly, count stayed near 25-27 because new replacement items (3.3 Q3/Q8, 3.4 Q17, 3.5 Q13) are themselves one-step. 2 (scope): fixed (decimal multiplication gone; 3.9 Q18 now halves 0.6, trivial) but a new scope slip appeared in 3.2 Q19 (1/16). 3 (3.4 Q9): fixed. 4 (short case stems): fixed. 5 (repetition): partly. LOW MS labels: fixed. 3.6 Q18 now a true claim_check ("25 - 9.7 = 16.7").

## Per-concept verdicts

- C7M-3.1: keys right; pass (2 one-step items, pronoun slip in Q19).
- C7M-3.2: keys right; pass after fixes (Q19(d) 1/16 scope breach; 2 one-step items).
- C7M-3.3: keys right (Q11 fixed); pass after fixes (3 one-step items; zero idea heavily repeated).
- C7M-3.4: keys right; pass (3 one-step items; Q4 wording).
- C7M-3.5: keys right; pass (3 one-step items; Q19 thin).
- C7M-3.6: keys right; pass after fixes (Q4 R wording is a possible second answer; four bare-calculation MCQs).
- C7M-3.7: keys right; pass after fixes (near-twin items; Q2(b) wording).
- C7M-3.8: keys right; pass after fixes (two ideas x 20; Q20(d) weak decision).
- C7M-3.9: keys right; pass (closest-to repeated; Q14 stretch beyond constant change).

## Overall verdict

**Pass after fixes (small).** Every one of 188 keys matches independent recomputation; no HIGH. Counts read: 188 items; HIGH 0; MEDIUM 4 (scope 3.2 Q19, easy-in-disguise about 27, in-concept repetition, 3.6 Q4 R wording); LOW 9.
