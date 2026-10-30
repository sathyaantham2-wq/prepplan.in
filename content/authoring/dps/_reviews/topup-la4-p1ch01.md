# Review: top-up p1ch01-la4.json (9 long answers, 4 marks, Class 7 Maths P1 Ch1)

All numbers recomputed in python before reading keys (including a brute force over all 9! card
arrangements for C7M-1.10 and an enumeration for C7M-1.3). Every key is correct. Pages checked
against the printed number on each page file (the printed numbers match the file numbers 1-23).

| Concept | Verdict | What is wrong | Fix |
|---|---|---|---|
| C7M-1.1 | LOW | Key correct (23,04,060; 36,540; 13,460 under 50,000). Parts (a), (b) are routine reading/writing of numbers, so 2 of 4 marks are one-line book skills; Bloom "Apply, Hard" is generous. Page pp. 4-5 correct. | Optional: replace (b) with a harder step (e.g. ask which digit moved and by how many places in value) or lower d to Medium. |
| C7M-1.2 | LOW | Key correct (4,20,70,000; 6,30,000 = 630 thousand; 1 crore = 10 million). Pages 8-9 correct. Same "million vs crore, compare the leading numbers" idea as the existing Tiruppur long answer (million vs crore total) in the full pack. | Acceptable; if a swap is wanted, change the setting to a conversion to billion/arab. |
| C7M-1.3 | LOW | Key correct (largest 3,00,000; smallest 1,00,002; 21 numbers, 1+5+15, confirmed by enumeration). Page p. 7 correct. Counting with a case split is slightly beyond the book (which only asks fewest clicks for a given number); the key states "fewest clicks = digit sum" as a fact the student must know. | Add a one-line hint in the stem or marking step that the fewest clicks equal the digit sum (the book's p. 7 table shows it). |
| C7M-1.4 | MEDIUM | Key arithmetic correct (2,90,000; 3,50,000; short 3,415; 3,00,000 + 3,50,000 = 6,50,000; 8,723 left; 6,42,000 and 723). Problem is (d) "Would rounding up to the next thousand be a better rule?": part (c) has just set the office rule as multiples of ten thousand, so next-thousand orders break that rule, and "better" can be argued either way (less waste vs. the stated rule). Second defensible answer. Pages 10-11 correct. | Reword (d) to "Compare the waste under the two rules and say which wastes less", or drop the verdict and ask only for 6,42,000 and 723. Match step 4 to the new wording. |
| C7M-1.5 | LOW | Key correct (9,26,323; short 1,323; bounds valid, 9,25,000 strict). The estimation of sums and differences is on pp. 11-12 (the 14,63,128 - 4,90,020 questions run onto p. 12), not p. 11 alone. Part (a) is very easy next to (c). | Change "p" to "pp. 11-12". |
| C7M-1.6 | OK | Key correct (2,17,000; 86,800; 1,73,600 gap; 4,34,000). 125 = 1000/8 is on p. 14, 100/4 on pp. 13-14: page correct. Real misconception (100/4 gives x25), part (d) rewards reuse. | None. |
| C7M-1.7 | OK | Key correct (6 or 7 digits; at most 6 digits so Ravi impossible; other number has 4 or 5 digits; 3 digits gives at most 8, 6 digits gives at least 10). Boundaries checked: 10^8 = 10,00,00,000 and 10^9 = 1,00,00,00,000. Page p. 15 correct. Steps match parts. | None. |
| C7M-1.8 | OK | Key correct (4,320; 1,03,680; 3,78,43,200; 94,60,80,000; 98,39,23,200 at 26; 1,02,17,66,400 at 27; 27th birthday). The "72 beats a minute" is a stated assumption, as the book's p. 19 asks for ("make reasonable assumptions"); pages 18-19 are right. | None. |
| C7M-1.10 | LOW | Key correct (max sum 1,06,173, both pairs sum to 1,06,173, minimum difference 2,469, all confirmed by brute force). Close to the book's own Try This 9 (largest sum and smallest difference from number cards), though with one set of nine cards and a placement argument; page p. 20 correct. | Acceptable. Optionally state in step 2 that the 5-digit number takes the single ten-thousands place. |

## Cross-checks
- Marking steps: every item has 4 steps of 1 mark each (total 4), each a checkable result; they match the parts and the key. No option positions named.
- Scope: no OUT line violated (no decimals, negatives, algebra, percentages, scientific notation).
- Repeats against the existing full pack: no repeated setting found (grep for heartbeat, milk, bangles, saplings, polio, streams found none). Only the 1.2 million/crore idea and the 1.10 puzzle echo existing material (LOW).
- Template: 6 of 9 stems (1.1, 1.2, 1.4, 1.6, 1.7, 1.8) have a named or unnamed person making a claim or an error, and 5 of those end in "wrong". 7 of 9 use an (a)-(d) four-part layout. Mild templating; vary two stems if convenient. Tags: 2 claim_check, 1 show_impossible.
- Difficulty: 7 Hard, 2 Hardest, none easy. No item is a one-line lookup.

## Counts
HIGH 0, MEDIUM 1 (C7M-1.4), LOW 5 (1.1, 1.2, 1.3, 1.5, 1.10). OK: 1.6, 1.7, 1.8.
Verdict: pass after fixes (fix C7M-1.4 part d; correct the 1.5 page).
