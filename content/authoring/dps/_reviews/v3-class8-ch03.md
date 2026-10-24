# Review v3: Class 8 Mathematics ch03 "A Story of Numbers" (hegp103), DPS pack, re-review after one fix pass

File: content/authoring/dps/class8/ch03.json (122 questions: C8M-3.1 20, 3.2 20, 3.3 21, 3.4 21, 3.5 20, 3.6 20).
Pre-edit copy matched by text: 56 items are new or rewritten (3.1: 8, 3.2: 11, 3.3: 11, 3.4: 9, 3.5: 7, 3.6: 5 = 51 new texts, plus 3.1 q11 whose
key text was edited). Every one of them was read in full and every number recomputed in python (Roman, Egyptian, base-4, base-5,
Mesopotamian, Mayan, abacus, Gumulgal, step-mark sums). Facts were checked against pages 053-081 (files 006-031).
Indexes are 0-based positions inside each concept, as in the file.

Mechanical checks, whole file: step marks equal item marks in every item with steps; all 43 option items have the key at o[0], no wrong option
equals the key, no duplicate options; no item names an option by position; multi_statement keys "1 only", "1 and 3 only", "2 and 3 only",
"1 and 2 only", "1, 2 and 3", "2 only" (all different); assertion_reason keys: 3 "both true, R explains", 1 "both true, R not explaining" x2 ... spread
across 4 of 4 patterns (2, 2, 1, 1); correct option strictly longest in 2 of 27 MCQs; claim_check/true_false verdicts 15 items: Partly right 4,
False/No 6, True/Yes 5 (mixed).

## v2 status

| v2 finding | Status |
|---|---|
| M1 3.4 q17 largest base-5 record ambiguous | FIXED. Now 3.4 q11, stem adds "no symbol may be written 5 or more times". Recomputed 4x125+4x25+4x5+4 = 624, unique; 620, 625, 500 are clean distractors. |
| M2 repeated ideas | PARTLY. Body-part duplicate (old q10/q17) and the q0b/q8 list duplicate are gone. Letter-label cluster in 3.1 still 6 of 20 (q2, q11, q13, q15, q17, q18). Fix created new clusters, see MEDIUM 2 and 3. |
| M3 strawman last parts | MOSTLY FIXED. 3.1 q15(e) (700 fits into 702 with 2 to spare), 3.2 q9(d) (saving 6 against one third of 20), 3.2 q19(d), 3.3 q18(d) (cost against count), 3.4 q14(d) (naive 9+5 added symbols versus regrouped 11) are real decisions. Soft ones remain, see LOW 4. |
| M4 Roman subtraction and halving beyond scope | FIXED. 3.3 q9 and q18 are recast as "what must be added" and use addition only; the halving items are gone; Egyptian subtraction (old 3.5 q19) is gone. New scope question: 3.3 q12, see MEDIUM 1. |
| M5 easy in disguise | PARTLY. Some replaced; new ones added, see MEDIUM 4. |
| M6 weak assertion-reason | FIXED for 3.4 (new q9, R is about landmark symbols, a real confusion). 3.6 q5 R is true but arbitrary, LOW 5. |
| M7 answerable from stem | PARTLY. 3.2 q17 replaced the stem-supplied body-part sequence; 3.4 q4 algebra is fine. 3.2 q11 still gives the whole sequence in the stem (acceptable: the reverse-order twist needs the chapter's fixed-order rule). |
| LOW 1 tag inflation, LOW 2 slot skeleton | Unchanged, see LOW 6 and 7. |

## HIGH (second defensible answer, wrong key, fact or arithmetic error)

H1. C8M-3.3 q13 (case study, "A stall at a school fair ... target of MCC tokens for the three days").
    Quote: stem "The stall had set a target of MCC tokens for the three days"; part (d) "On Day 4 the stall sells only XXV more tokens ... decide
    whether the stall reached its target." Key: "just above MCC, so the target was reached, by 3 tokens."
    Problem: the target is explicitly for THREE days, and the three-day total in (c) is MCLXXVIII = 1178, which is 22 short of 1200. Adding Day 4
    changes the period, so "No, the three-day target was missed (the Day 4 sales only push the running total past it)" is equally defensible.
    All numbers are right (653, 1178, 1203 recomputed); the defect is the wording of the last decision.
    Smallest fix: change the stem to "a target of MCC tokens for the whole fair, which runs for four days" (then (c) is the three-day total so far and (d)
    the four-day total), and keep the key.

No other HIGH. All 56 changed items recompute: keys, options, step marks and facts are correct. Specifically verified (not exhaustive list):
Roman 1778+45 = 1823 MDCCCXXIII; 815-278 = 537 DXXXVII (and DXXXVII + CCLXXVIII regroups to DCCCXV); 302 CCCII, 320 CCCXX; XXXX+XXVII = LXVII;
367+286 = 653 DCLIII, +525 = 1178 MCLXXVIII, +25 = 1203 MCCIII; 6C 2L 6X 2V 7I = 777 = DCCLXXVII against DCCLXXII; 1673 = MDCLXXIII (9 symbols),
twice = MMMCCCXXXXVI (3346); 362+366 = 728 DCCXXVIII, +85 = 813 DCCCXIII, 812+85 = 897 DCCCLXXXXVII. Egyptian 2706 (15 symbols), 10362 (12), 8999 (35),
9000, 2801 (11 symbols); symbol counts 698 = 23, 40213 = 10, 5807 = 20, 1990 = 19; 115 has 7 symbols in both base 5 and Egyptian and no other option does.
Base 4: n^3 + n = 130 gives n = 5 only; 2n^2 + n + 3 = 39 gives n = 4 only; 120 = 6 symbols in base 4, 8 in base 5; 70 = 1 0 1 2 (4 symbols); 3x16+6x4+5 = 77 = 1 of 64,
0 of 16, 3 of 4, 1 of 1. Base 5: 370, 375, 169, 539, 2695, 2700 (P cheaper by 5). Abacus 1338+764 = 2102 MMCII, carries on lines 1, 10, 100; 1748+684 = 2432.
Mayan 885, 70, 380, 2539, error 280 for P against 40 for R; Mesopotamian 7203 = (2)(placeholder)(3), Egyptian 12 symbols. Gumulgal 19 = 9 ukasar + urapon,
36 = 18 ukasar, scores 2, 3, 4 where B beats C (checked all of 1 to 10), 5 against 3 (Bakairi ahage tokale = 3 on p.56), 87 = 5 and 18 words, 63 cans 15 and 14 marks.
Letters: af 32, ca 79, shelf 100 = cv, zz 702; month system 3x12+5 = 41; bus 23 - 21 = 2, 3 - 2 = 1.
Facts: Egyptian is called base-10 (p.63), symbols go up to 10,000,000 (p.69), abacus from the 11th century with a counter above a line worth 5 (p.68-69),
Mesopotamian placeholder not used at the end (p.74), Chinese rod numerals used a blank, zero only as a later complete system (p.77-78), Mayan 1, 20, 360, dot, bar, shell (p.76).

## MEDIUM

M1. C8M-3.3 q12 (mcq, "A Roman clerk must work out L x D ... using no symbol larger than M"). Key 25 (25 Ms for 25,000).
    Ruling on the question you asked: it DOES violate scope_out as written. The scope_out line reads "Roman numerals above 3999, the overbar for
    thousands, and the modern strict subtractive rules", reason "The largest Roman symbol given is M". The key is a numeral of value 25,000, far above
    3999, and the stem's "no symbol larger than M" only closes the overbar escape; it forces exactly the over-3999 numeral that the line excludes. The fixer is right that
    the book names L x D on p.60 (Try This), but the book never writes or asks for the numeral and the pack's own scope line is stricter than the book.
    The key is arithmetically right and unique, so this is not HIGH; the issue is scope.
    Smallest fix (pick one): replace L x D by V x D = 2500 = MMD and ask "how many symbols" (key 3, options 3, 2, 5, 10); or ask a claim item "Can L x D be
    written with symbols up to M in fewer than 20 symbols?"; or, if the owner wants the p.60 example kept, amend the scope_out line to "above 3999 except the
    p.60 product L x D" so the loader's scope record and the item agree. Do not leave both as they are.

M2. C8M-3.3 q15 (old) and q17 (new): same idea twice in one concept. q15: write 1365 in Roman, count symbols (7), count marks in groups of 5 (273), "what feature makes the
    difference". q17(a)-(c): write 1673 in Roman, count symbols (9), count marks in groups of 10 (170), "explain why the Roman system was efficient". Parts (d), (e) of q17 add
    something (the addition and the "regroupings differ" point), but (a)-(c) restate q15. Also "regroupings not alike, 5 then 2" appears again in q17(e), 3.3 q14(c), 3.4 and 3.5.
    Fix: change q17 so (a)-(c) are not the efficiency comparison, for example (a) Roman for 1673, (b) a second numeral, (c) the sum, (d) check, (e) the regroup-rule point; or drop q15.

M3. C8M-3.2: the fix pass turned the group-size comparison into a cluster of six. q6 (63 cans, groups of 5 versus 8), q9 (well, groups of 5 versus adding 10),
    q13 (980 in twos, fives, twenties), q17 (87 in 20s versus 5s), q18 (19 as twos versus fives), q19 (36 points, three scorers). Each asks "count marks for a number under a group size
    and compare". The v2 request was to open uncovered scope lines (Lebombo 29 notches and 44,000 years, Ishango, Bushmen list, the 5/10/20 words idea, rod reading), not to add
    more of the same. Fix: replace q17 or q6 (the weaker, 2-mark ones) with a Lebombo/Ishango or Bushmen item; note the only tally-bone item left is 3.2 q8.

M4. Easy in disguise among the new items (answer is one book line or one step, whatever the label):
    - C8M-3.1 q7 (mcq "Analyse"): the key "Numerals for smaller numbers always had names to go with them" is the book's own sentence on p.54, and the stem's guide quote is the same
      claim reworded, so the stem nearly states the answer. Add a second condition or a wrong-but-tempting reading of the p.54 sentence (for example what the Chinese had, which the book words as "some groups").
      Wrong option 2 ("Every people used objects, names and symbols together, just as the Chinese did") is the only real distractor and is false because the book says "some groups".
    - C8M-3.3 q8 (Analyse, 2 marks): CCCII and CCCXX are the book's own Figure it Out (iii) style, and (b) is the "no placeholder" one-liner. Fix: make (a) a pair where a student would add
      a placeholder-like symbol, or turn (b) into a claim.
    - C8M-3.5 q8 (30 symbols for 10,000,000s): one division, 300,000,000 / 10,000,000. C8M-3.5 q10 (which product of base-5 landmarks is wrong): spot the non-power of 5;
      62500 is visibly different from the three pure powers. C8M-3.2 q4 (cook's slanted fifth stroke): pick the book idea; the key is also the longest option. C8M-3.4 q2 (match): recall of four
      definitions. Each is acceptable alone but together they give 6 near-recall items among 56 new ones.
    Fix: add a twist to two of them (for example in 3.5 q8, "a number with 8 symbols of 10,000,000 and nothing else needs how many symbols after being multiplied by 100"); leave the rest.

M5. C8M-3.5 q14 and q19: the same abacus case twice. Both open "a merchant in the 11th century ... decimal abacus ... counter above a line counts 5", both add a Roman or counter number to
    a 3- or 4-line number, both carry on exactly the lines 1, 10 and 100. Fix: change one so the carries are on different lines (for example carry only on 10 and 1000) or make one a "read the abacus
    from a description and decide who has more" item.

## LOW

1. C8M-3.4 q12 (Create, key 346): "how many more objects would have to be added before the record needs a symbol for 625". At 279 + 345 = 624 it still does not need one; 346 is the number that
   triggers it. Reword "how many more objects until the record first needs a symbol for 625".
2. C8M-3.4 q9 (AR): A true, R true, R not the explanation. Defensible, but the key reads "R is not the correct explanation" while a reasonable student can argue the landmark symbols are the
   whole Egyptian system. Optional: make A "The Egyptian system is a place value system" (false) to remove the doubt.
3. C8M-3.2 q11 (body parts): the sequence of 17 body parts is invented in the stem (the book's Papua New Guinea table is an image, p.54), which is fine and self-contained, but the numbers
   (1 to 17) were not checked against the figure. If the figure uses a different list the stem is still correct as written.
4. Last parts that are still soft: C8M-3.1 q18(d) (bus 1 needs no beads, bus 2 needs beads: the stem hands both conditions over), C8M-3.6 q18(d) (Egyptian is the only system that meets the stated
   condition), C8M-3.6 q14(d) (P has the biggest third-level count, the answer follows from the first number). 3.2 q19(d), 3.3 q18(d), 3.5 q16(d) are good models to copy.
5. C8M-3.6 q5 (AR): R "60 of one power of 60 are regrouped into one of the next" is true but arbitrary for A (the 120 versus 2 ambiguity); a better R would be "the placeholder was used
   mainly in the middle of a numeral" (then R explains A).
6. Tag inflation: 3.2 q4 and q15, 3.3 q12, 3.5 q10 carry `scenario`, but are bare computations or recall. 3.3 q4, 3.3 q14, 3.1 q14 are fine as tagged.
7. Slot skeleton: multi_statement at position 1 in 4 of 6 concepts (3.3, 3.4, 3.5, 3.6) and position 0 in the fifth; the last two items are long_answer 4 or 5 marks in 5 of 6 concepts
   (3.1, 3.2, 3.4, 3.5, 3.6; 3.3 ends 5, 4, 3, 5). Not a sentence template, but vary AR/MS and long-answer positions in two concepts.
8. Create is 4 of 122 and Understand 1 of 122; the two-mark Create items (3.4 q12 and 3.2 q18) are fine. Optional.
9. Letter-label cluster in 3.1 still six items (q2, q11, q13, q15, q17, q18); only q15(e) and q18(d) add something new. Replace q17 (advantage of letters over sticks) with a Lebombo or rod item if M3 is fixed first.

## Template check (counts)

Types: short_answer 48, mcq 27, long_answer 25, fill_blank 6, assertion_reason 6, multi_statement 6, match 4 (same as v2). Bloom: Analyse 66, Evaluate 26,
Apply 25, Create 4, Understand 1. Difficulty: Hard 98, Hardest 24. MS keys all distinct (6 of 6 different). AR keys 2, 2, 1, 1. MCQ correct longest 2 of 27. Claim/true-false 15:
Partly right 4, False/No 6, True/Yes 5. Slot order: not identical across concepts, but multi_statement sits at position 1 in 5 of 6 concepts and the long-answer finish repeats (LOW 7).
Repeated ideas after the fix: MEDIUM 2, 3, 5 and LOW 9. Verdict: not templated sentence by sentence; moderate idea repetition.

## Per concept verdicts

- C8M-3.1: all new and rewritten keys correct (q1, q5, q6, q7, q14, q15, q18, q19, q11 edit); fix M4 q7 and LOW 4 / 9 when convenient. Pass after fixes.
- C8M-3.2: all keys correct (q2, q4, q5, q6, q9, q10, q11, q15, q17, q18, q19); M3 cluster is the only real issue. Pass after fixes.
- C8M-3.3: keys correct, but q13(d) has a second defensible answer (H1) and q12 conflicts with scope_out (M1); q15/q17 duplicate (M2). Not load-ready until H1 is fixed.
- C8M-3.4: keys correct (q2, q4, q5, q6, q9, q11, q12, q14, q19, and old q17 now q11 unique); LOW 1 and 2. Pass.
- C8M-3.5: keys correct (q2, q8, q10, q14, q15, q16, q19); M5 and M4 (q8, q10). Pass after fixes.
- C8M-3.6: keys correct (q1, q4, q5, q14, q18); LOW 4 and 5 only. Pass.

## Counts read

122 questions in the file; 56 changed items read in full with every part recomputed; the 66 unchanged items were checked only for being text-identical to the pre-edit copy (their v2 review stands).
HIGH 1 (3.3 q13 target wording). MEDIUM 5. LOW 9.

Verdict: NOT load-ready as it stands. One edit of one stem (H1) and the M1 scope decision make it load-ready; M2 to M5 are quality fixes that should be done in the same pass.
