# Review v4: class6sc ch07 (C6SC, Temperature and its Measurement, fecu107)

File: content/authoring/dps/class6sc/ch07.json. 126 questions read (7.1: 20, 7.2: 21, 7.3: 22, 7.4: 21, 7.5: 21, 7.6: 21).
Index = 0-based position inside the concept. Every number, average, range, conversion and case-study part was recomputed
(python for the averages and sums, by hand for the rest). Facts checked against content/extracted/fecu107/pages/003-014.
Scripted checks: correct option equals o[0] for all 45 option items; no duplicate options; step marks sum to marks on every
item that has steps; no option named by position.

## v3 status

| v3 | Status | Check |
|---|---|---|
| H1 (7.3 Q19 key not an option) | FIXED | `a` = "-300 °C" = o[0]; script finds no key/o[0] mismatch anywhere. Only -300 °C is below absolute zero. |
| H2 (7.5 Q17(a) one rule keyed) | FIXED | Now "Name one rule ... hard to follow", key and step accept vertical / bulb clear of the sides / read in place with eye in line. Part (b) unchanged and sound. |
| M1 (7.2 Q17 toxicity beyond scope_out) | FIXED | Toxicity no longer used. Now "easier to read / beeps" (see L2: judged acceptable). |
| M2 (7.5 Q0 (v) "most likely") | FIXED | Now "the one the chapter tells you makes the liquid column fall". Unique. |
| L2, L3 (7.2 Q6, Q10) | L2 fixed (key "No"); L3 partly (see L1 below) | |
| L4 (7.5 Q4(a)) | FIXED | "By which reading was the column no longer rising"; key allows stopping between 60 and 75 s. |
| L5 (7.5 Q10 cause) | FIXED | No cause asserted; "readings show the thermometers agree". |
| L6 (7.6 Q2(b)) | FIXED | Now room reading against the town maximum (3 degrees), no general claim. |
| L7 (7.2 Q16 shape) | FIXED | Now a patient over four days at 8 am and 8 pm. |

The pack's own facts: the Summary on page 136 says laboratory thermometers "typically" run from -10 °C to 110 °C, so 7.4 Q14
Reason R is true by the book. The page-126 box says digital thermometers' "numbers ... are easier to read", so 7.2 Q17 and 7.6 Q5's
sibling use of that point is in the book.

## HIGH
None. No wrong key, no second defensible option among the 45 option items, no arithmetic error, no step-mark mismatch.
All 14 case studies recomputed part by part (7.1 Q0, Q16; 7.2 Q3, Q14; 7.3 Q0, Q9, Q21; 7.4 Q4, Q17; 7.5 Q4, Q18; 7.6 Q2, Q12, Q20):
every part correct, each last part a real decision.

## MEDIUM

M1. **C6SC-7.2 Q12(b)** (armpit 34.6 °C, actual 35.1 to 35.6 °C): key says "No ... well below the 37.0 average ... more than the
slight difference a healthy person may show, so it should be checked again". The book gives 35 °C to 42 °C as the normal band and
says a healthy person may differ slightly from 37.0, and its margin box asks whether old people are slightly lower. A student who
writes "35.1 to 35.6 is inside the 35 to 42 band, so it can be normal" has a book-supported answer and loses the step mark.
Fix: change the reading so the corrected range straddles 35 (armpit 34.1 gives 34.6 to 35.1, which cannot be decided), or reword
(b) to "Can she be called normal on this reading alone?" with step "near the lowest limit, so re-measure carefully", and say in the step that
"inside the band but low, so re-measure" is accepted.

M2. **Decision parts keyed one way where the other side can be argued.** Steps award the mark for a fixed choice:
- 7.6 Q12(d): Friday (35 °C) satisfies the stated rule ("no sports day above 35 °C") and avoids the test clash; the key demands Thursday
because Friday has no margin. The margin is the author's, not the principal's. Fix: add "the principal also wants at least 1 °C of margin"
or let the step read "a choice (Thursday or Friday) justified with the margin against the clash".
- 7.3 Q21(d) (rewrite in Celsius or keep kelvin) and 7.3 Q0(d) (fix absolute zero or '25 K'): both defensible; the step says "Rewrite in Celsius" /
"Fix the absolute zero line". Fix: step should accept either choice with the stated weighing.
- 7.6 Q2(d) (move at 11 am or wait) and 7.5 Q4(d) (accept 60 s reading): same pattern. 7.5 Q18(d) already does it right ("a middle plan is also fine");
copy that wording to the others.

M3. **Recall in disguise (answer is a one-line book fact), still present in about 10 items.** Marked Analyse or Apply but needing only one
statement from the page: 7.2 Q4 (43.5 °C is outside the 35 to 42 band), 7.2 Q13 (a clinical thermometer cannot do the listed jobs), 7.2 Q15
(battery, skin contact, boiling water), 7.3 Q16 (Fahrenheit not used in science), 7.3 Q3 (capital letter, degree sign, space), 7.5 Q1 (bulb on bottom, eye in
line, tilt), 7.5 Q8 (who used the correct method), 7.5 Q9 (hard object breaks it), 7.6 Q0 (match task to thermometer), 7.6 Q15 (forecasts use station data),
7.6 Q5 (compare four forecasts with 5 °C). The statement and AR types are allowed to test a fact each, but the brief says no easy items.
Smallest fix: add one inference to each (a number to compute, or a changed setting), or swap three or four for stems that need the chapter plus
arithmetic, as the rest of the pack does.

M4. **Repeated ideas (counts read, not impression).**
- 7.5: the "one odd reading in a set, find the cause" idea appears in Q10, Q12, Q16 and Q19; "reading while lifted out lowers it" in Q0, Q17, Q18 and Q20-adjacent items.
- 7.1: "same water feels cool or warm depending on the earlier hand" in Q1, Q2, Q5, Q7, Q10, Q13, Q17, Q18 and Q19 (nine of 20).
- 7.6: "general trend, not every day" in Q4, Q7, Q9, Q14, Q17 (five).
Fix: keep one item per idea at each level; replace two items in 7.1 and one in 7.5 with items on other scope_in points (for example
7.1 on temperature as the reliable measure and the thermometer as the device).

## LOW

L1. **7.2 Q10 (match)**: item 4 "43 °C" also fits c ("cannot be measured with a clinical thermometer", range ends at 42 °C). Options still give one
answer (ice is the only c in the key and no distractor pairs 4-c with 3-c), but the item has two true matches. Fix: change c to "Needs a laboratory
thermometer, not a clinical one" for ice only and word 43 °C as "above 42 °C".

L2. **7.2 Q17 and Q8**: "his old one needs no battery" and the option "Mercury clinical thermometers, since they need no batteries" rest on a fact the chapter implies but
does not state (only that digital ones run on batteries). Acceptable for a distractor and for part (a) of a 2-mark item. The "easier to read" point is the book's own
and not the toxicity point scope_out excludes: within scope.

L3. **7.5 Q10(iv)**: key says "Five different thermometers"; the stem says six students read the same boiling water, not six thermometers. Say "six students (or thermometers)".

L4. **7.5 Q0**: "(i)-(iv) four mistakes" but the record has five (held by bulb, bulb on the bottom, slant, taken out, read from above). The key merges the last two into one step;
a student giving five loses nothing, but say "any four" in the key.

L5. **7.3 Q0(b)**: "They wrote the wrong unit" is the author's reading of '25 K' (the room could not be 25 °C and the team did not say so); say "most likely meant 25 °C".

L6. **7.3 Q19**: option "3000 °C" is real but not in the chapter; fine because only the -300 °C rule is needed. 7.4 Q15 is labelled Understand (the one non-Apply/Analyse
label); it is a mild application of divisions per gap, accept.

L7. **multi_statement format**: all six use three statements (I to III). The Maths house style is two; the Science precedent for this subject is not stated in the brief.
Note only; consistent within the chapter, with keys spread (see counts).

## Template counts (read)
- Claim-check verdicts (7 items): No 4 (7.1, 7.2, 7.3 Q4, 7.5), Yes 1 (7.3 Q11), Partly 2 (7.4, 7.6). Not templated.
- multi_statement keys: "1 and 3 only", "1 only", "2 and 3 only", "all three", "2 only", "1 and 2 only": one each, no repeat.
- assertion_reason outcomes: explains (7.1, 7.5), not-explains (7.3), A true R false (7.2), A false R true (7.4, 7.6). All four present.
- Correct option strictly the longest: 20 of 45 (44 percent), up from 11 of 45 in v3. Near chance-high; check that the key is not systematically the most detailed option
(for example 7.5 Q11, 7.4 Q19, 7.2 Q8, 7.6 Q5 and Q13). Shorten the key or lengthen distractors in four items to bring it to about 30 percent.
- Slot order per concept: differs in every concept; case studies at 0/16, 3/14, 0/9/21, 4/17, 4/18, 2/12/20. Not identical.
- Marks per concept 45 to 50; mark profile 1-mark x8-9, 2 x5-6, 3 x3-4, 4 x2-3, 5 x2-3 in every concept (the DPS minimum, same shape each time; accept).
- Types: fill_blank 4 (7.3 Q7 -96, 7.4 Q10 14.5, 7.5 Q13 370.15, 7.6 Q10 8: all numeric, application, machine-matchable), match 4, true_false 7 (3 False, 4 True),
claim_check 7, show_impossible 2, reverse items in every concept. No item below Understand; one Understand item (7.4 Q15).
- Position-named options: none.

## Verdicts per concept
- C6SC-7.1: keys right; touch idea repeated (M4). Pass.
- C6SC-7.2: keys right; M1 (Q12(b)), M3 items, L1. Pass after the M1 fix.
- C6SC-7.3: keys right (Q19 fixed); decision parts M2; fine otherwise. Pass.
- C6SC-7.4: keys right, arithmetic correct throughout; R of Q14 is the book's own summary. Pass.
- C6SC-7.5: keys right (Q17 fixed, Q0(v) fixed); repetition M4; L3, L4. Pass.
- C6SC-7.6: keys right; Q12(d) M2; some easy-in-disguise (M3). Pass.

## Counts read
126 questions read, 45 option items key-checked, 14 case studies recomputed. HIGH 0, MEDIUM 4 (M1 to M4), LOW 7 (L1 to L7).
Both v3 HIGH fixed. Templated: no (structure varies, claim-check and statement keys spread); mild repetition of ideas (M4) and a
rising correct-option-longest rate (44 percent).

**Verdict: load-ready** (no HIGH, nothing wrong or ambiguous at the key level). Strongly advised before load, each a one-line edit: M1 (7.2 Q12(b)) and the
7.6 Q12(d) wording in M2.
