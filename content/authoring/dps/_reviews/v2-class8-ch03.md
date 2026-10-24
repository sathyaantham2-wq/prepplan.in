# Review: Class 8 Mathematics ch03 "A Story of Numbers" (hegp103), DPS pack v2

File: content/authoring/dps/class8/ch03.json. Read: all 122 questions (C8M-3.1 20, 3.2 20, 3.3 21, 3.4 21, 3.5 20, 3.6 20).
Question indexes below are 0-based positions inside each concept, as in the file.

Note on the brief: the task text described the chapter as Roman/Mayan/Aryabhata/Brahmagupta/abacus history. The actual chapter and pack
are: counting and number systems, Gumulgal, Roman, Egyptian, base-n, abacus, Mesopotamian, Mayan, Chinese, Hindu. I reviewed the file as it is.

Method: every numeric key was recomputed in python (Roman conversion and sums, base conversions, base-60, Mayan, Chinese, abacus,
step-mark sums), and every fact (Lebombo 29 notches and 44,000 years, Ishango 20,000 to 35,000 years, Gumulgal/Bushmen lists,
Aryabhata 499, Brahmagupta 628, Mayan 1, 20, 360, zong/heng positions) was checked against pages 048-081 and the book's own answer pages.
All step-mark sums equal the item marks. All 43 option items have the key at o[0]. No item names an option by position.

## HIGH (wrong key, second answer, fact or arithmetic error)

None. All 122 keys and all case-study parts recompute correctly. No fact error found.

## MEDIUM

1. C8M-3.4 q17: "A base-5 record has symbols for 1, 5, 25 and 125, but none for 625. If every number is grouped largest first, what is the
   largest number this record can show?" Key 624. Second defensible reading: grouping largest first with 125 as the biggest symbol allows
   625 as five symbols for 125 (the Egyptian system in the book also shows more symbols are needed, not a ceiling). The key silently
   assumes "no symbol is used 5 or more times". Options 625 and 500 are therefore not clean distractors. Fix: add "and no symbol is
   written 5 or more times" to the stem.

2. Repeated ideas, a templating symptom inside concepts (counted):
   - C8M-3.1: the letter-label scheme (a to z, then aa to zz or two-letter strings) carries 6 of 20 items (q12, q14, q15, q16, q17, q19), and
     q14, q17 and q19 use the same "single letters then doubled letters" sequence and the same "less than 52 so some are left out" step.
   - C8M-3.3: "more symbols does not mean a bigger number" is asked 5 times (q1, q6, q17a, q18b, q19b).
   - C8M-3.2: "counting in one group size is cumbersome" runs through q3, q6, q7, q12, q14 (and again C8M-3.3 q11, q15b). q3 Monday (23 pots, 7 marks) and
     q6 (23 sales, 7 marks) are the same computation.
   - C8M-3.2 q0(b) and q8 give the same two name lists and ask the same "which numbers are multi-word in one list and not the other" comparison.
   - C8M-3.2 q10 and q17 use the identical body-part sequence stem (fingers to elbow to 17), and q1, q15b, q16, q18 all return to "ras".
   - C8M-3.4 q10, q0(b) and C8M-3.3 q0 and q14: "Roman factors alternate 5, 2, 5, 2, so it is not a base" appears 4 times in the chapter.
   - "No symbol is ever used 5 or 10 or more times, because that many regroup": C8M-3.3 q13, 3.4 q13e, 3.4 q14, 3.5 q9, 3.5 q6.
   - C8M-3.6 end-placeholder ambiguity: q2, q3, q7, q15c.
   - The number 430 (3 d, 2 c, 1 b) comes out of both C8M-3.5 q13 and q15.
   Fix: replace one or two of each cluster with an item on an uncovered scope line (Lebombo, Aryabhata/Brahmagupta beyond q11 of 3.6, rod
   numeral reading, Mayan reading, the "5 / 10 / 20 groups" idea, base-2 place value are each thin).

3. Strawman final decisions (the "decision" part has only one possible answer once the earlier parts are done):
   - C8M-3.1 q16(e) (two-letter dictionary scheme for 400 shelves), q17(e) (sticks, the only method that reaches 140), q19(d) (Scheme R, the only one reaching 90).
   - C8M-3.2 q3(d) (adding a symbol for 10 obviously shortens, 14 < 20), q15(d) (Scorer C, 14 against 29 and 58).
   - C8M-3.3 q18(d) ("should he accept" when the check in (c) matches by construction).
   - C8M-3.6 q14(d) (label 380, not 420) and q15(d) (only the Hindu system satisfies both conditions).
   - C8M-3.5 q14(d), C8M-3.4 q15(d) are weaker cases of the same thing.
   Fix: give the last part a real trade-off (for example a cost or a limit that makes the "longer" system win for one case, or a number where
   the answer flips), as the 3.4 q16(d) base-4 versus base-5 comparison already does well.

4. Scope drift: operations the chapter never teaches. The chapter teaches Roman addition and multiplying landmark numbers only; it asks
   for subtraction only for sticks (p.54). Items needing Roman subtraction by unbundling or Roman halving:
   C8M-3.3 q9 (DCCCXV minus CCLXXVIII), q12 (halve MDC), q15(d),(e) (halve MMDC), q18(a),(c) (subtract CCCLXIII from DCCCLXXV); and Egyptian
   subtraction in C8M-3.5 q19. The scope item reads "Add two Roman numerals ... explain why multiplication and division are hard". These
   items test a skill the book does not give. Fix: keep the idea but recast as addition (for example "what must be added to ... to reach ...") or
   state the unbundling rule in the stem and tag as extension; at minimum cut the two halving items.

5. Easy-in-disguise (answer is a one-line book fact or one routine step, whatever the label):
   - C8M-3.1 q6 (Understand): which of four things is a numeral. Book defines numeral in one sentence.
   - C8M-3.2 q11 (Understand, 2 marks): plate of 3 versus 7, limit of about 5 at a glance. One line from p.57.
   - C8M-3.2 q2 (fill_blank, 11): add the rule "five ukasars and an urapon" with no regrouping. C8M-3.2 q19 (6 words is 11) is the same skill.
   - C8M-3.3 q2 (read MDCCLXXVIII) and q8 (IV versus VI): straight reading of the landmark rule.
   - C8M-3.3 q14(a),(b): list the factors 5, 2, 5, 2 and 10 Xs make C; recall of p.58.
   - C8M-3.4 q2 (fill_blank: 4th landmark of base 7 is 343) and q20 (512 is a landmark of base 8): both are "power of n" with no thinking. Together with q9 this is three items on one skill.
   - C8M-3.5 q6 (greatest repeat is 6 in base 7), q11 (Egyptian shortcoming, p.69 one line), q18.
   - C8M-3.6 q16 (59 is 5 tens and 9 ones: 14 symbols).
   Fix: either add a twist (two conditions, a reverse, a claim) or drop to leave room for the thin scope lines in item 2.

6. Assertion-reason with trivia or weakly linked R: C8M-3.4 q3 (R: "324 is written with 9 symbols" has nothing to do with base-10 and reads as trivia; the
   standard says R must be a real fact about the topic). C8M-3.6 q2 (R "base 60" is a true but arbitrary partner). Fix: choose an R that
   a student could mistake for the explanation (for example "the Egyptian system has a different symbol for each landmark number").

7. Items answerable from the stem alone (no chapter needed): C8M-3.1 q1 (30 + 7 - 4 = 33), q18(d) (parity of 5 unpaired sticks, pure arithmetic), q9(a);
   C8M-3.2 q10 and q17 (the stem supplies the whole fixed sequence, so it is a counting-along exercise); C8M-3.4 q16(a),(b) (2n^2 + n + 3 = 39 is
   algebra). These are fine as application but they should not be counted as testing the chapter. Replace C8M-3.2 q10 (or q17) with an item
   using the book's real Papua New Guinea sequence idea only if the sequence is described from the page; otherwise cut one of the two.

## LOW

1. Tag inflation: all 27 MCQs carry the `scenario` tag, but several are bare computations with no scenario: C8M-3.3 q6 ("Which numeral has the most
   symbols?"), C8M-3.4 q7, C8M-3.5 q16 ("Which product is NOT a landmark number", a spot-the-power-of-5 task, easy to answer by seeing 250 is not a power of 5),
   C8M-3.2 q19, C8M-3.5 q6. The real scenario MCQs number about 18, still at least 3 per concept. Re-tag.
2. Slot skeleton is shared across concepts: in every concept the last four or five items are long_answer (marks 5, 5, 4, 4 in nearly the same
   Analyse/Evaluate/Evaluate/Analyse order) at positions 12-18, and mcq/fill_blank/AR/MS occupy positions 0-6 in 5 of 6 concepts. Not a word-for-word
   template, but vary where the AR, MS and long answers fall.
3. Every item is Hard or Hardest (98 Hard, 24 Hardest) and Understand is 4 items. Fine for the bank rule (no easy) but Create is only 4 items;
   C8M-3.2 q17 is labelled Create but part (a) is arithmetic and part (b) is "suggest an extension", a light Create.
4. C8M-3.1 q15: the explanation "one coin was paired with d, which comes after the missing c" is muddled. Say "he skipped c, so the 7th coin
   is paired with h, the 8th letter". Key itself is right.
5. C8M-3.2 q12: counting "words" by repeating "twenty" four times is a convention; say "how many name-words, counting a repeated word each time".
6. C8M-3.4 q4 (True/False, "including 0") matches the book's own answer (0 has no symbol) so the key is fine; just note the item depends on the book's answer rather than the text.
7. C8M-3.3 q12 and q15 halve using "CCL" for 250; correct, but half of D being CCL is a convention-dependent unbundling of D into CCCCC, which the book
   does not show (see MEDIUM 4).
8. The Mayan page (p.75) is an image; the pack correctly uses only 1, 20, 360 and dot/bar/shell as stated on p.76 and in the stem. Good.
9. Positive notes (for the author): no Roman numeral with IX, XC, CD or CM is used; CCCC and XXXX are used where the book allows it (scope_out respected);
   Roman answers follow "largest first". 3-statement multi_statement is the correct DPS form (QUESTION_STANDARD), and the false statement is spread (S1 false in 3.3, S2 in 3.2, S3 in 3.4 and so on).

## Template check (counts)

- Types: short_answer 48, mcq 27, long_answer 25, fill_blank 6, multi_statement 6, assertion_reason 6, match 4.
- multi_statement keys: "1 only", "1 and 3 only", "2 and 3 only", "1 and 2 only", "1, 2 and 3", "2 only": all different. Good.
- assertion_reason keys: R explains A 2, R true but not explaining 2, A false R true 1, A true R false 1. Good spread.
- Claim-check / true_false verdicts (15 items): No or False 7, Partly right 3, Yes or True 5. Mixed. Good.
- Correct option strictly longest in only 2 of 27 MCQs (tied or equal in 14 more, numeric options); not a length tell.
- Correct option is o[0] in 43 of 43 (authoring format; the loader shuffles).
- Step marks sum to the item marks in every item.
- Verdict on templating: not templated sentence-by-sentence, but heavy idea repetition (MEDIUM 2) and a shared slot skeleton (LOW 2).

## Per concept verdicts

- C8M-3.1 (counting, number system): keys correct; pass after fixes. Too many letter-label items (6 of 20); strawman final parts in q16, q17, q19.
- C8M-3.2 (tally bones, Gumulgal, group counting): keys correct; pass after fixes. Duplicate lists (q0b/q8), duplicate body-part stem (q10/q17), q3/q6 same computation.
- C8M-3.3 (Roman): keys correct; pass after fixes. Roman subtraction and halving go beyond the chapter; "more symbols is not bigger" repeated 5 times.
- C8M-3.4 (Egyptian, base-n): keys correct; pass after fixes. q17 ambiguity; q2, q9, q20 are one skill.
- C8M-3.5 (arithmetic in base systems, abacus, shortcomings): keys correct; pass. Egyptian subtraction (q19) beyond scope; some one-line items (q6, q11).
- C8M-3.6 (place value: Mesopotamian, Mayan, Chinese, Hindu): keys correct; pass. Strawman final parts (q14d, q15d); q16 easy.

## Counts read

122 questions read in full, all keys and parts recomputed. HIGH 0. MEDIUM 7 findings. LOW 9 findings.
Overall verdict: pass after fixes (no key changes needed; fix q17 in 3.4, thin out repeated clusters, recast the Roman subtraction/halving items, strengthen final decision parts).
