# v4 verification: class8 ch03 (MATH8, hegp103), after second fix pass

Diff against orig.json: 15 changed items, all read in full. Keys recomputed in python; facts checked against pages 051-080 of hegp103. Structural check on the whole file: every mcq and assertion_reason has the correct option at o[0] and four distinct options; step marks sum to marks on every item; no option named by position; concept counts unchanged (20,20,21,21,20,20).

## Changed items

- C8M-3.1 q8 (tablet and sticks guide): OK. Page 054 says numerals for smaller numbers always had names, and some peoples had objects and names only. Claim 1 holds, claim 2 contradicts the stem. One answer. LOW: correct option is longest (112 vs 105/105/109 characters).
- C8M-3.2 q5 (slanting fifth stroke): OK. Matches p.057 (replace every group of 5 marks by a new symbol).
- C8M-3.2 q7 (tally group size k): OK. k = 5. p.057 says most people find it hard to see 5 or more at a glance. Marks 1+1 = 2.
- C8M-3.2 q14 (Lebombo and Ishango, five parts): OK. p.055: Lebombo in South Africa, 29 notches, about 44,000 years, tally stick or lunar calendar. Ishango in the DRC, 20,000 to 35,000 years, columns possibly calendrical. Tally versus sticks matches the text. 1345 notches and the group-counting remedy match p.058. Marks 5 = 5.
- C8M-3.2 q16 (hand 5, man 20): OK. 20 + 3x5 + 4 = 39. Distractors 54, 29, 134 are not equal to the key.
- C8M-3.2 q18 (true/false, bone ages): OK. 44,000 - 35,000 = 9,000 and 44,000 - 20,000 = 24,000, both right against p.055. The item asks for a reason. Marks 1+1 = 2.
- C8M-3.2 q19 (t'oa said 7 times): OK. Bushmen t'oa = 2, so 14. Gumulgal-style name is ukasar said 7 times, and the real name is ras (anything above 6), per p.056. Marks 3 = 3.
- C8M-3.3 q9 (2005 and 2050): OK. MMV and MML. Roman symbols keep their value wherever they stand, so no confusion. Within 3999.
- C8M-3.3 q13 (LX x L): OK. 60 x 50 = 3000 = MMM. Split: L x L = 2500 (MMD) plus X x L = 500 (D) = 3000. Distractors MMD (2500), MMMD (3500), MMDL (2550) are all unequal to the key. This replaces the old L x D item, so the v3 scope item is FIXED.
- C8M-3.3 q14 (fair tokens, four parts): OK. The v3 HIGH is FIXED. 367 + 286 = 653 = DCLIII. 653 + 525 = 1178 = MCLXXVIII. 1178 + 25 = 1203 = MCCIII. The target MCC (1200) is for the four-day fair, so the target is just reached, by 3 tokens. After day 3 the stall is 22 short, and the key says so. The item now has exactly one answer. The carries in the working are right. Marks 4 = 4.
- C8M-3.3 q16 (three-symbol numeral): OK. Maximum MMM = 3000. Smallest above 1000 is MII = 1002. Without M, three symbols give at most DCC = 700. This holds because the stem fixes landmark grouping largest-first, so no subtractive forms. The scope_out line excludes strict subtractive rules, so the item stays in scope. Marks 1+1 = 2.
- C8M-3.4 q13 (base-5 record): OK. 250 + 25 + 4 = 279. Next landmark 625, so 625 - 279 = 346. The parenthesis "at 345 more, 624 still needs none" is right. Marks 3 = 3.
- C8M-3.5 q9 (Egyptian x 100): OK. The p.069 text says the Egyptian system reaches a crore (10^7), so the stem's symbol set is valid. 4x10^9 is 400 symbols of 10^7, 3x10^7 is 3 more, so 403. 2x10^3 adds none. One answer.
- C8M-3.5 q11 (base-5 products): OK. Products of powers of 5 are powers of 5. 15625 = 5^6, 3125 = 5^5 and 78125 = 5^7 are all powers of 5. 62500 = 4 x 5^6 is not, so it is the only wrong result. One answer.
- C8M-3.5 q20 (abacus partners, four parts): OK. Morning 1692, afternoon 376, carries on lines 10 and 100 only, total 2068 with 8 counters (2 + 2 + 4). B's board is 2071 with 6 counters (2 + 3 + 1), so B took 3 more and is wrong. Matches the abacus rules on pp.068-069. Marks 4 = 4.
- C8M-3.6 q6 (assertion and reason, 120 vs 2): OK. p.074 says the placeholder was used in the middle and not at the end. A is true because of it. R explains A. Both true, key is correct.

## Prior findings
- v3 HIGH (3.3 case study part d): fixed, see C8M-3.3 q14.
- v3 MEDIUM (3.3 L x D, numeral above 3999): fixed, the item is gone and a 3000-bounded item replaces it. grep finds no "L x D", 25,000 or 25000 in the file. Unchanged v3 items were not re-reviewed.

## Counts
HIGH 0. MEDIUM 0. LOW 1 (3.1 q8, correct option longest by 3 to 7 characters; optional trim of the first option).

Verdict: load-ready.
