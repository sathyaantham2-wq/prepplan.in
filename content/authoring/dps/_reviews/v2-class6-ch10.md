# Review: Class 6 Mathematics ch10 "The Other Side of Zero" (dps/class6/ch10.json), first independent review

Read: all 123 questions (C6M-10.1: 21, 10.2: 20, 10.3: 21, 10.4: 20, 10.5: 21, 10.6: 20), every key recomputed in python or against the pages (fegp110 pages 015-029, 018, 022-029). Every mcq/match option-type key text is one of its options (33 of 33); every assertion_reason and multi_statement key begins with one of its options (12 of 12). No option is named by position.

Counts: HIGH 1, MEDIUM 8, LOW 7.

## HIGH

**H1. C6M-10.4, long_answer 4 case study "A shopkeeper's account opens a week with Rs 5,000 ... supplier gives 8% off ..." (second defensible answer / wrong figures in (b), (c), (d)).**
The stem says she pays the supplier Rs 9,000 and that the supplier "gives 8% off if she pays on Monday, 4% off on Wednesday". The natural reading is that the payment itself is smaller (Monday 9,000 x 0.92 = 8,280; Wednesday 8,640; Friday 9,000). The key subtracts the full Rs 9,000 from the balance on every plan and counts the discount separately. Recomputed on the natural reading:
- Monday: balances 220, -5,980, -1,880, -7,180, -380. Lowest -7,180 (key says -7,900); negative days 4 (key says 5); bank charge 600; net = 720 - 600 = +120 (key says -30).
- Wednesday: 8,500, 2,300, -2,240, -7,540, -740. Negative days 3; net = 360 - 450 = -90 (key matches only by luck of the count).
- Friday: 8,500, 2,300, 6,400, 1,100, -1,100. 1 negative day; net -150.
So part (b) and the Monday figure in (c) differ between two honest readings, and the (d) argument "Rs 30 lost against Rs 150" changes (Monday would then be a net gain of Rs 120, which flips the trade-off).
Smallest fix: add one sentence "She pays the full Rs 9,000 to the supplier and the discount is returned later as a separate cash refund, which is not part of the account balance", or recompute (b), (c), (d) with 8,280 / 8,640 / 9,000 as above.

## MEDIUM

**M1. C6M-10.2, multi_statement.** "Statement 1: In the mine, (+40) - (-50) = -10 ..." The stem describes no mine, and the key's explanation ("the lift goes from -50 up to +40") uses context the candidate never sees. Fix: open the stem with one line about the mine lift (levels -50 m and +40 m), or rewrite Statement 1 as "(+40) - (-50) = -10, because the two minus signs make the answer smaller".

**M2. C6M-10.3 items MCQ 0, fill_blank 7, short 10, long 17 (pocket-of-tokens items).** "A lift attendant's pocket holds 11 green and 7 red tokens ... Where is the lift now?" The floor equals green minus red only if he started on Floor 0 with an empty pocket (page 256). This is not stated, so a candidate cannot be sure. Fix: add "He began on the ground floor with an empty pocket" to each of those four stems.

**M3. C6M-10.6, long_answer 4 case study "Class 6 is making one poster ..."** Part (b) (Nine Chapters, red and black rods like tokens) and part (c) (which source gave rules for zero) are both given in the stem sentences about Sources Q and R, so they need no chapter knowledge. Part (d) has no constraint, so any choice passes. Fix: take the source descriptions out of the stem (give only name and date), keep (b) and (c) as recall from the chapter, and add a constraint to (d) (for example, the poster is for a lesson on adding and subtracting, or only one date can be printed).

**M4. C6M-10.6, recall in disguise.** Several items ask for a fact the book states in one or two lines, whatever the Bloom label:
- MCQ 4 (Bakhshali wrote the symbol after the number), labelled Evaluate.
- Short 11 "How did the Nine Chapters and the Bakhshali each show negatives? First known use?" (red and black rods; symbol after; accounting), 2 marks of pure recall.
- Long 17 "Justify the statement ... evidence from the chapter" (5 marks) is a transcription of pages 266-269.
- MCQ 0 (order four dated works) is a date-sorting recall.
- Long 16 (5 marks): five direct applications of a named rule to a one-step sum; no chain of thought.
Fix: turn MCQ 4 and short 11 into a scenario ("A student claims a Bakhshali page shows -7 as '-7'; what would the page really show?" or a claim about who first wrote rules), give long 17 a comparison to defend (for example, which of the three earlier uses is closest to Brahmagupta's work and why) and make long 16 a chain (for example, evaluate (-18) + (-27), then use that to find 14 + (-31) - (-45), naming each rule).

**M5. C6M-10.5, repeated idea.** The one grid "5 8 11 / -1 2 5 / -7 -4 -1" appears in six items (MCQ 1, multi_statement, assertion_reason, match 2, claim_check 14, case study 20) and the two-dice faces in five (MCQ 2, match 4, show_impossible 15, case study 19, plus the coin year item). Fix: use a different amazing grid (for example, rows 2 5 8 / -3 0 3 / -8 -5 -2) in the AR and multi_statement, and keep the original only for the claim_check.

**M6. C6M-10.1, easy items by recall.** MCQ 1 (put -12, -5, 0, 4 in increasing order), MCQ 4 (press '+' six times from -6), match 8 (inverse of -9, zero, +4, smallest of four), short 13 (inverse of 7 and -543, copied from the summary on page 269) and fill_blank 7 are one-step book facts or procedures. Fix: make MCQ 1 a mixed-sign comparison where a tempting wrong order exists (for example, with -15, -9, 3, -12 and a claim about "biggest digit"), and fold short 13(a) into a two-step item (an inverse and then a movement).

**M7. true_false without a real misconception.** C6M-10.4 short 8 (credits and debits total -Rs 3,000, verdict True) is the book's Figure It Out Q1 with the numbers scaled; C6M-10.6 short 8 ("7 - 12 comes out negative ... -5", True) restates Brahmagupta's rule with no misconception to catch. Fix: replace each with a false statement built on a real slip (for example, "Because a debit is bigger than a credit, the account balance is -Rs 3,000 whatever the starting balance").

**M8. C6M-10.6, 927 repeated.** MCQ 1 (927 years), case study 19(a) (927 years) and short 10(a) (599 years with the same no-year-0 idea) test the same step three times, and C6M-10.5 MCQ 3 tests it again (71 CE). Fix: keep MCQ 1 and the C6M-10.5 item; change short 10(a) and case study (a) to another no-year-0 step (for example, 628 CE back 700 years).

## LOW

- **L1.** C6M-10.1, 10.3 and 10.5 hold 21 questions each (the extra is the match item); the rest hold 20. Confirm the loader and the bank target accept 21.
- **L2.** Slot order is identical in all six concepts (5 MCQ, statement, AR, fill-blank, [match], four 2-mark, three 3-mark, two 5-mark, two case studies), and every concept's first four MCQ are tagged "scenario". Vary where the claim_check and reverse items sit and replace one scenario MCQ per concept with a plain application MCQ.
- **L3.** C6M-10.5 short 16: "corners are 5, -1, -2 and 4" does not say which corner is which; the key assumes top-left, top-right, bottom-left, bottom-right. Add "(top left, top right, bottom left, bottom right)".
- **L4.** C6M-10.4 long 17(d): "least credit that would bring the final balance to zero" - only Rs 800 reaches exactly zero; write "the credit needed".
- **L5.** C6M-10.1 long 18(d): the closing sentence is muddled ("why does the gap in the list not match the order of the digits?", "(9 and 4)"). Rewrite as "Why is -21 below -17 although 21 is greater than 17?" and state the counts 17 - 8 = 9 and 21 - 17 = 4 clearly.
- **L6.** C6M-10.5 long 17 (positive/negative sign table, from the book's Figure It Out Q8 on page 266) belongs in C6M-10.2 or 10.6 rather than "Border-Sum Grids and Patterned Sums"; its opening quote by Aman is also unneeded.
- **L7.** C6M-10.2 long 17 parts (a)-(d) are four direct computations; only (e) needs thought. Reorder so (e) leads into a justification of two of them.

## Checks that came out clean
- Case studies 10.1 (two), 10.2 (three), 10.3 (two), 10.4 (first), 10.5 (two): every part recomputed (10.3 Lotus 14 pairs, Kamal 15 pairs and -67, Champa 22 pairs and +32, totals 29/36/37 against 30; 10.5 dice 6 and 3 pairs, Rs 300 each; Dev's grid 6, 18, -6; 10.1 Nagpur 340 and 460; Chandigarh 3, 1, 1, 4). All step marks match the parts; each ends on a real two-sided decision (except M3).
- multi_statement keys by concept: "1 and 3", "2 and 3", "1 and 2", "3 only", "1, 2 and 3", "1 only" - well spread. All use three statements, as the DPS loader requires.
- assertion_reason verdicts: explains (10.1, 10.6), A true / R false (10.2), true but no explanation (10.3, 10.5), A false / R true (10.4) - well spread. Concept 3's R ("each red token stands for one press of '-'") is true on page 256.
- claim_check verdicts: No 4, Yes 3, "partly right" 2 - mixed. true_false verdicts: True 3, False 3.
- Correct option is uniquely the longest in 4 of 33 option items (12 per cent): no length cue.
- Scope: no multiplication or division of integers, no |x|, no fractions or decimals, no ring, no Learning Material Sheets. Bank interest or fee (10.4) is on page 018 of the book. Brahmagupta details match pages 267-269.

## Verdicts per concept
- C6M-10.1: pass after small fixes (M6, L5).
- C6M-10.2: pass after small fix (M1, L7).
- C6M-10.3: pass after small fix (M2).
- C6M-10.4: fix required (H1, M7, L4).
- C6M-10.5: pass after small fixes (M5, L3, L6).
- C6M-10.6: weakest concept, recall-heavy (M3, M4, M7, M8).

Overall: pass after fixes. Not templated in sentence frames (each item has its own setting), but the slot order and the repeated grid, dice and date items are template-like (M5, M8, L2).
