# Review v2: Class 6 Mathematics, Ch 3 Number Play (content/authoring/dps/class6/ch03.json)

Source read: content/extracted/fegp103/pages/001-032 (chapter text and the printed solutions). Every question in all 9 concepts read (180) and every number, key, option and step mark recomputed in python (exhaustive search for supercell maxima, taller-neighbour calls, reverse-and-add chains, Kaprekar chains, palindromic times and dates, coin-style reachability, digit counts).

(Findings are appended concept by concept below; the summary is at the end.)

## Notes carried by concept (working log, severity tags inline)

### C6M-3.1 (taller-neighbour rule)
- All 20 keys correct (Q2 brute-forced over all 720 orders: only "1, 1, 0, 1, 2, 0" can happen; max 2s in 8 children = 3; 0-callers in 5 children can be 1, 2 or 3).
- MEDIUM, Q3 (Meena at the right end): answer is the book's one-line fact (page 56 Q1: an end child cannot say 2). Easy in disguise although labelled Analyse/Hard. Fix: ask which of several claimed call lists is impossible and why only the end rule breaks it, or fold into a two-step item.
- LOW, repeated idea: the arrangement 135, 126, 142, 128, 145, 131, 150 appears in both Q14 and Q17(c); the call list 1, 0, 2, 0, 2, 0 appears in Q1 and again Q19(a). Fix: change Q19 heights.
- LOW, Q10 and Q13 are near one-liners from the book (ends cannot call 2; neighbours cannot both call 2). Keep only one.
- LOW, Q3 option "Equal-height neighbours do count as taller" and "Only a child in the middle ... can ever call 0" are not real chapter confusions (nobody believes them); replace with e.g. "She is the tallest child, so she should call 0" (still wrong) or "She must call 1 because she is shorter than one neighbour".
- LOW, Q19/Q20 parts (a)-(c) are answerable from the stem rule alone (rule is restated in the stem), only (d) needs thought.

### C6M-3.2 (supercells)
- All 20 keys correct (2x2 max 2, 2x3 max 3, 3x3 max 5, row of 7 max 4, 4x4 max 8 by exhaustive/consistent reasoning; Q17(a) six supercells 864, 749, 907, 615, 728, 886 verified; Q20 Rahul = 82, 73, 82, 64, 91 vs correct 82, 64, 91 verified; Sara's extra is the 76 only).
- MEDIUM, repeated idea: "maximum supercells in a row = ceil(n/2)" is tested in Q3 (11 cells), Q7 (row of 7), Q8 (15 cells), Q14 (n = 7, 8) and Q16 (7 numbers, 4 supercells), six items in 20. Fix: keep Q14 and Q16, replace Q3 and Q8 with other 2D ideas (second largest number, what changes when two cells are swapped).
- LOW, easy in disguise: Q4 (largest number is always a supercell, book p58 Q7 solution), Q11 (same fact as true_false), Q5 Statement 1 (same). Three items on one fact. Fix: drop Q11 or turn it to "the second largest".
- LOW, Q18 spends three of four parts on digit arrangement (largest, smallest even, smallest above 60,000), which belongs to 3.3/3.5; supercell content is only (d). Fix: either move or make (a)-(c) about supercell placement.
- LOW, Q20(d) is a mild strawman: Rahul's 2 mistakes vs Sara's 1 makes "help Rahul" obvious (the key even adds a counter-view). Acceptable but could weigh mistake severity.

### C6M-3.3 (number line, digit counts, digit sums)
- All 20 keys correct (digit 0 total 192, digit 7 total 300, plot bill 1,392 digits = Rs 8,352, 480 plots = Rs 7,992; trek 331.5 min vs 345).
- LOW, Q3 (3-digit roll numbers from 100: 900) is the book's one-line count (page 60) with a story; Q1 is a one-step division. Both are easy-in-disguise for an "Apply/Hard" label. Fix: Q3 -> "How many roll numbers from 1 to 5000 need exactly 3 digits and how many digits does the printer use in all".
- LOW, "two labels between marks 3 gaps apart" appears in Q1, Q9 and Q20(a). Fix: change Q9 to a non-integer-step reading e.g. gap read from marks 2 gaps apart that are not adjacent hundreds.
- LOW, Q20 is mostly speed/rest-time arithmetic; the number-line content is only parts (a)-(b). Acceptable for a case study but the stem mixes in a rate model not in this chapter.
- LOW, Q19(d) accepts "either is defensible" with no figure deciding: marks should be attached to a justified choice, which the step mark does; fine.

### C6M-3.4 (palindromes, reverse-and-add)
- All 20 keys correct (68 -> 154 -> 605 -> 1111 three additions; 87 -> 4884 four; 89 needs 24 steps; palindromic times 8:08...12:21 = 15; tokens 1bb1 = 10; digit sum 5 tokens 15).
- MEDIUM, easy in disguise: Q12 ("196 is still not known") is a one-line book fact and its model answer begins "The book says". Q18(a)-(b) is the book's own Figure it Out 2 (smallest and largest 5-digit palindrome, sum, difference) verbatim. Fix: Q12 -> ask what a student can and cannot conclude after trying 196 for ten steps; Q18 -> change to 6-digit palindromes and add a reasoning part.
- MEDIUM, repeated idea: 68 is used in Q1, Q14 and Q17; 57 (Q8) and 75 (Q16) give the same chain (reverse of each other, both 132 then 363) so the same working is asked twice. Fix: change Q16 to 48 or 59, Q1 to 47.
- LOW, Q2 distractor 89 needs 24 additions, which no student can check; use 59 (3 steps? verify) or 78 so the wrong options can be refuted by hand.

### C6M-3.5 (Kaprekar, clock and calendar numbers)
- All 20 keys correct (4291 -> 8172; 7152 -> 3 rounds; 531 -> 495; 3179 -> 2 rounds; 9311 -> 6 rounds; 5311 -> 2 rounds; sums/differences in Q18 and Q20 recomputed; mirror dates 2000-2026 = 8, repeat dates = 12).
- MEDIUM, Q19(d): "run its special day every year from 2027 onwards ... Which kind of date should it choose" has a false premise. Neither kind occurs every year: mirror dates after 2026 exist only in 2030, 2031, 2032 (then 2040-2042 ...), none in 2027-2029, and repeat dates not until 2101. The recommended answer still works, but "every year" cannot be satisfied and the student is told to "use the next few years" which begin with three empty years. Fix: "The club wants a special day in as many of the years 2027-2035 as possible".
- MEDIUM, repeated idea: "all four digits the same gives difference 0" appears in Q5 (S1), Q6 (3333 -> D), Q7, Q12 and Q14, five items; 12 repeat dates appear in Q9(b) and Q19(c); 8532 appears in Q6 and Q13. Fix: keep Q7 and Q14, replace Q12 and Q5 S1 with a different Kaprekar idea (the 3-digit routine, why 495 repeats, rounds for a year of birth).
- LOW, Q5 Statement 3 ("10:10 reads the same left to right and right to left") is false only because the digits 1010 reversed are 0101; the book itself lists 10:10 as an example of a patterned time, so a pupil who read the book may mark it true. Key "2 only" is right but the trap is unfair; use 10:20 or 12:12 -> choose "12:21 is palindromic, 10:10 is not" explicitly.
- LOW, Q11 (6174 maps to itself) and Q3 are mostly book facts.

### C6M-3.6 (mental math, digit-length of sums/differences, pattern sums)
- Keys in Q1-Q18, Q20 correct (Q1 only 2,300 unreachable; Q5 1,100 is the only multiple of 100 in 1,000-3,000 missing for 300 and 700; Q7 totals 2,800 / 1,440 / 5,000 / 1,200).
- HIGH, Q19 (case study, Rs 15,000 library): the time model is ambiguous and the answer's choice depends on the reading. "A Rs 2,500 visit takes 30 minutes and a Rs 600 visit takes 10 minutes" and "1 visit in 4 gets a Rs 2,500 packet". The key charges 30 minutes for every one of the 24 visits (720 min) and 10 minutes for each of the 37.5 visits (375 min), although only 6 (or 25) of those visits are the "Rs 2,500 (or Rs 600) visits". Read the other way (time only on the visits that get a packet) the times are 180 and 250 minutes, both inside the 600-minute limit, and the recommendation in (d) changes completely (the "neither fits both" conclusion disappears). It also needs probability and expected values (1 in 4, 2 in 3 giving 4 and 1.5 visits per packet and 37.5 visits) which are far outside Number Play. Fix: delete the probabilities; say "A Rs 2,500 packet needs 4 visits of 30 minutes each and a Rs 600 packet needs 2 visits of 10 minutes each; at most 30 visits and 600 minutes" and recompute (a) six or 25 packets, (b) 24 or 50 visits, (c) 720 or 500 minutes, (d) decision.
- MEDIUM, easy in disguise (book Figure it Out items near-verbatim): Q3 (the four scenarios, answer 5-digit minus 3-digit), Q10 (5-digit + 3-digit = 6-digit; 4-digit + 4-digit), Q11 (5-digit - 2-digit = 3-digit never), Q12 (4-digit + 2-digit sometimes 4-digit), Q15 (91,500 impossible). Five of twenty are the book's own exercise with the numbers unchanged. Fix: change at least Q3, Q11, Q12 to new digit-length combinations (e.g. 6-digit minus 5-digit, 3-digit + 3-digit giving 4-digit).
- LOW, Q9(b) and Q14 and Q5 all test "1,000/1,100 cannot be made with big numbers" (three items on one idea).
- LOW, Q20 writes 1,06,300 (Indian grouping) while the rest of the file writes 10,098 and 100,949; use 106,300.
