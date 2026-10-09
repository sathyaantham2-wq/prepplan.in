# Review v2: Class 9 Social Science, Part 1 ch 6 "Democracy" (iest106)

File: content/authoring/dps/class9s/ch06.json (7 concepts x 20 = 140 questions). Reviewer: independent, never reviewed before.

Verdict: PASS (0 HIGH, 4 MEDIUM, 11 LOW). No fixes are required before loading. The MEDIUM items are worth a quick fix if a revision pass happens.

## What was checked
- Every number was recomputed in code or by hand from the question text before reading the key. All numeric keys are correct: 61 days (26 Nov 1949 to 26 Jan 1950), 69 per cent (96.8/140), 35 months, 18 Articles (5+4+2+4+2+1), 5 vs 2 vs 3, 490 voters, 975/80%/55%/44%, 116 seats (>50% of 230), 8 more seats, 122 vs 114 vs 126, Rs 3.6 lakh = 20%, 37.5%/40%, Rs 800/day and Rs 24,000/month, 8,640 h vs 288 h (30x, saves 8,352 h), 54%/46%, 6/9/3 seats, 8/12/16/25%, 25%/50%, 17.1% vs 21.7%, 70/40/56%, 968 voters per station, 8 years, 55 and 25 years.
- Every mcq, match, assertion_reason and multi_statement key text starts with exactly one option (programmatic; 0 mismatches, 0 duplicate options). Marks in the marking schemes sum to the question marks for every short and long answer.
- No positional references ("above", "option b") in any stem or option. The two regex hits in 6.2 are "18 years and above".
- Every fact was traced to pages 001-023 of iest106. Nothing material comes from outside the book (see LOW items).
- Scope: nothing falls inside the old scope_out list (election procedure, Parliament structure, comparative constitutions in depth, party ideologies).

## HIGH
None.

## MEDIUM
1. C9S-6.6 Q19 (case study, 24-seat Panchayat): the question treats the one-third and 50 per cent reservations as seats that men then "hold fewer of" (men fall from 16 to 12, a 25 per cent cut). The chapter says reservation is "not less than one-third ... out of total number of seats", so the unreserved seats are open to everyone. The premise bakes in a misconception, and the 25 per cent figure is built on it. Fix: ask how many seats are reserved for women (8 vs 12) and how many remain unreserved, and drop "seats for men".
2. C9S-6.7 Articles 352/356/360 are tested four times (Q2, Q6, Q13, Q20a), and Q13 is pure copy-recall of the margin note, yet it is tagged Apply/Hard at 2 marks. Repeated idea and easy-in-disguise. Fix: replace Q13 with an item on a different idea (for example the causes or the two Emergency movements).
3. C9S-6.7 Q8 (fill_blank, 12 of 40 messages = 30 per cent) and Q12(a) are the same computation with the same numbers. Fix: change the numbers or the task in one of them.
4. Easy-in-disguise via strawman options, all tagged Hard: 6.3 Q5 (R says the legislature implements laws, which is plainly false) and Q9 (executive "outside the reach of courts"); 6.4 Q3 (law "issued by one official without any discussion"), Q4 (media "implements laws"; NSS "trains political parties") and Q5 ("never follow democratic methods"); 6.5 Q9 ("no monarch"); 6.6 Q3 ("without a minimum number present"), Q4 (statements 1 and 2); 6.7 Q4 (statements 2 and 3). A student who read the chapter once can pick these without discriminating between close ideas. Difficulty tags overstate them. Fix: make two or three of the distractors near-miss (for example swap the Article numbers or the head of state in 6.5 style), or lower the tag.

## LOW
1. Bank-wide difficulty tags are only Hard or Hardest (Apply/Hard 58, Analyse/Hard 42, Evaluate/Hardest 25, and so on). Several are plain recall (6.4 Q6 "55 years later", Q7 "96,000/8"; 6.5 Q7 "36", Q8 "3"; 6.6 Q8 "21+2"; 6.7 Q7 "25 years"). Arithmetic is correct but trivial. Retag or accept.
2. All 7 multi_statement items use three statements (1, 2, 3). Maths house style is two statements. SST convention is unstated in the project notes, so this is only flagged.
3. 8 of 24 mcq items have the key as the longest option (6.1 Q1/Q2; 6.2 Q2/Q8; 6.4 Q1/Q3/Q8; 6.7 Q3). It gives a length cue. Every key is stored at index 0 (match, AR and multi_statement too), so the loader must shuffle.
4. C9S-6.6 Q7: "fewer than 968 voters per station" mixes an "over 96.8 crore" voter count with "more than 10 lakh" stations. Only the "about" wording saves it. Say "about 968".
5. C9S-6.2 Q20(a): the book gives only "Right to Freedom (Articles 19-22)". Placing a public meeting under it needs knowledge the book does not give (it is reachable by elimination only). Add a hint or accept.
6. C9S-6.3 Q19(c) (and the key text): CIC, Lokpal and CVC "could examine the accounts" is beyond the book. It only lists them as accountability mechanisms. CAG (audit) is the safe answer. Narrow the key to the CAG.
7. C9S-6.7 Q2: the stem defines President's Rule ("dismisses a State's government") which the book never defines. The book only names Article 356 as President's Rule. Recall of the note is fine, but the stem is outside the book.
8. claim_check items whose verdict is simply "she is right" restate the chapter and test nothing: 6.4 Q14, 6.6 Q14. Others are strong (6.2 Q14, 6.3 Q14, 6.5 Q14 are partly right).
9. Repetition across a concept: 6.3 has Article 46 four times (Q2 distractor, Q6, Q8, Q16) and the RTI Act five times (Q2, Q6, Q12, Q19). 6.4 Q12 and Q18 both ask the social-media strengthen-or-weaken point. 6.2 Q6 and Q7 are near twins (counting Articles).
10. C9S-6.1 Q8 (voters as per cent of population) belongs to 6.6 content. Not a scope violation, but misplaced.
11. 6.1 Q19 and Q20 case studies treat "consensus until agreement" as an Indian early practice. The book supports only collective thinking and unity of purpose in the verse. The answer key accepts that framing. Mild stretch; the tone is acceptable.

## Strengths
Case studies are numerically consistent and offer genuine either-way decisions. Assertion-reason items are varied (explains / not-explains / A true, R false / A false, R true). True/false and claim-check items cite the page evidence. The 6.5 country-table items match the book's table exactly (federalism only for India and Canada; UK unwritten constitution). Marking schemes are sound.
