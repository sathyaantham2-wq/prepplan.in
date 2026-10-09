# Review v3: class7 Part II ch5 "Connecting the Dots" (gegp205), content/authoring/dps/class7/p2ch05.json

Read: all 148 questions (7 concepts: 22 + 6 x 21), none sampled. Previous review: v2-class7-p2ch05.md (0 HIGH, 8 MEDIUM, 9 LOW). Textbook: content/extracted/gegp205/pages/ (the height table is on 031.txt). Scope: content/structure/class7-maths-part2.md (OUT: mode and frequency tables, pie charts and line graphs, standard deviation). Concepts are numbered by position, 5.1 to 5.7 = concepts 1 to 7, "#n" = position inside the concept.

Method: every key was recomputed by hand and the heavy ones again in python before the stored key was read. This covers all totals, means, medians, ranges, bar lengths, gains and differences, every multi_statement (7), every assertion_reason (7) and every match (7). The seven height-table values were also checked against 031.txt. Wrong keys: none. Step marks sum to the item marks in all 148 items. Scope-term scan (mode, pie, line graph, frequency, standard deviation) and positional-option scan ("option (b)", "option B"): no hits.

## Status of the v2 findings

- v2 MEDIUM 1 (samikarana, 5.2 #3): fixed. The item is now a bucket-pouring item with a unique key (25 / 5 = 5 litres).
- v2 MEDIUM 2 (Sana claim, 5.3): fixed. The totals are now both 210 and the verdict is "partly right".
- v2 MEDIUM 3 (Ravi, step 1 vs step 2, 5.6): fixed. The stem now says what he has written and the key is Step 1 done, interpret next.
- v2 MEDIUM 4 (two height tables in 5.7): fixed. All 21 items use the book's real table; 1989 and 2019 values were checked against 031.txt (127.3, 143.2, 147.7, 146.2, 159.0, 152.4, 137.7, 138.0, 138.9, 142.2).
- v2 MEDIUM 5 (identical slot grid): mostly fixed. Types now move between positions 7 to 10 and the claim_check / show_impossible positions differ per concept. The 5-mark shape is still much the same (see MEDIUM 4 below).
- v2 MEDIUM 6 (weak case-study decisions): mostly fixed. 5.1 #20 now has a single decision, 5.2 #19 has a real mean-versus-median conflict (15 against 13.5), and 6.20 and 3.19 are balanced. 6.20 is still soft, see LOW 7.
- v2 MEDIUM 7 (weak distractors): partly fixed. 4.4, 5.1 and 6.1 now use real slips. 1.4 is unchanged, see LOW 1.
- v2 MEDIUM 8 (easy-in-disguise 60 of 148): improved to about 42 of 148 (28%), see MEDIUM 3.
- v2 LOW 9 (5.1 AR) and 13, 14 (3.13 "five other days", 7.12 "which age"): fixed.

## HIGH

None.

## MEDIUM

1. 5.1 #10 (match). Item 2, "Typically, is milk costlier in Pune or in Nagpur?", is keyed to c ("a statistical question answered by comparing prices over time"), but the stem has no time element. Option d ("a statistical question about a group whose answers vary") fits item 2 just as well, and the distractor "1-c, 2-d" is therefore defensible for item 2. Item 1 is also a survey, not a question, so d fits it only loosely. Fix: reword c to "a statistical question that compares prices in two places" and d to "a survey about every member of a group", or replace item 2.

2. 5.5 #5 (cashew tree, mcq). The key says the mean is 18 kg in a fruiting month and that 7.5 kg is lower "only because seven months were out of season". Distractor 2 says "The mean is 7.5 kg, because every month of the year must be counted to describe a typical month". The 12-month mean is 7.5 kg, so the number is right, and only the clause "must be counted" is arguable. The chapter's own zero-versus-missing rule (a zero is a measured value) supports a student who counts the zero months, and 5.5 #19 (rainfall) does count them. A second defensible reading exists. Fix: make the stem ask for the mean "in the fruiting season", or change distractor 2 so its number is wrong.

3. Easy-in-disguise is still about 42 of 148 (28%), concentrated in two concepts (list below). 5.1 has 9 of 22 items that are one definitional step ("is this a statistical question?"). That same skill is also the core of #1 to #4, #8, #9, #12, #14, #16 and #17, which makes about 13 items on one idea. 5.6 has 9 easy items, mostly one-step scale multiplication (#2, #3, #7, #10, #11, #13, #14). Fix: replace about half of the 5.1 classification items with items that give data and ask what can be said, and give the 5.6 drills a trap (two graphs with different scales, a bar read from a truncated start).

4. 5.7 is one table, used 11 times (#3, #4, #7, #9, #10, #12, #13, #15, #16, #17, #18). The same 2009-to-2019 gains are recomputed in #12, #13, #16 and #18. The 5-mark and case-study items in the other concepts still share one frame, "(a) totals, (b) ranges or means, (c) compare, (d) pick and justify" (2.20, 3.18, 3.20, 4.19, 5.18, 6.18, 6.19). Fix: swap two or three of the table items for a different graph or data shape. For the long items use one "find the missing value" shape and one "correct this working" shape.

5. Scope drift, small. 7.14 (axis starting at 145 cm, "exaggerates the difference") has no counterpart in the textbook pages (grep for truncated or misleading axes returns nothing). 3.14(c) groups days into the intervals 15-20, 21-25 and 26-30 and counts them, which is frequency-table territory, and the scope marks frequency tables OUT. Neither is a big departure, but the two should either be traced to a page or turned into in-scope items (7.14 into a bar-length item, 3.14(c) into "how many days above the mean").

## LOW

1. 1.4 (mcq): distractors "in millimetres", "in kelvin" and "counted twice" are not misconceptions anyone holds. Replace them with real slips (a number answer makes it statistical, one person asked many times, a long answer).
2. 3.9 (assertion_reason): keyed "R explains A". R (the range uses only two values, the mean uses all) is a true related fact. It is not obviously the reason a same-mean pair can differ in spread, so a strong student can argue "not the correct explanation". Reword R to "the mean does not record how far values lie from it".
3. 1.22(d): the key's advice "start the cooker after she leaves school" does not follow from the data and sits oddly beside "usually 17, up to 22". Key it to the mean and the range.
4. 2.19(d): the neighbour's remark ("showers run off the soil") hands the student the median. The key's last clause ("an answer for the mean must say ...") is the only thing keeping it two-sided. Add a second fact that supports the mean.
5. Correct mcq option is the longest in 18 of 34 plain mcq (53%). It is a mild cue, because longer correct options tend to carry the reason. Trim the keys or lengthen some distractors.
6. 2.1 (fill_blank): "The child who collected 11 leaves with them" is ambiguous (with the guavas? with the group?). Write "leaves, taking his 11 guavas".
7. 6.20 (case study): Odisha has the fastest growth but Kerala still has the highest total, so the "other state could argue" part is only mildly competitive. Acceptable.
8. 6.11 and 6.18 reuse the same temperature readings (17, 29, 36). Change one.
9. Bloom: Remember 0 and Understand 0 (the loader floor is not violated, since both are caps or optional), Apply 53, Analyse 68, Evaluate 24, Create 3. Analyse-or-above is 95 of 148 (64%). Every item is Hard (120) or Hardest (28), none Easy.
10. No `figure` item although the chapter is graph-heavy (carried over from v2).

## Other checks passed

- Per concept: one assertion_reason, one two-statement-or-three-statement multi_statement (3 statements used throughout, all keys unique), one match, two case studies, 8 or 9 one-mark items, 2 reverse or more across the chapter (13 `rev` items).
- multi_statement keys: 5.1 "1 and 3 only", 5.2 "1 only", 5.3 "1, 2 and 3", 5.4 "1 and 2 only", 5.5 "2 and 3 only", 5.6 "3 only", 5.7 "2 only". Each was derived independently and matches.
- assertion_reason keys: 5.1 A true R false, 5.2 both true and explains, 5.3 both true and explains (see LOW 2), 5.4 both true and explains, 5.5 both true and not explanation, 5.6 A false R true, 5.7 both true and explains. The mix includes a "not explanation", an "A false R true" and an "A true R false".
- match keys: all 28 pairings verified (5.1 #10 flagged in MEDIUM 1).
- true_false: 4 (False, True, False, True). claim_check verdicts: Yes, No, partly, No, Yes, No, partly. Mixed, good.
- fill_blank answers (6, 48, 4, 40, 50) are single numbers and machine-matchable.
- Numbers confirmed in code or by hand for every long item: 1.19 (82, 16.4), 1.22 (85, 17), 2.17 (360, 72, 90, 120), 2.20 (36, 40, 9, 6.67), 2.21 (1200, 1520, 200, 190), 3.19 (206, 218, 22, 5, 6 weeks), 3.20 (62, 60, 1, 8, 12.4, 12), 3.21 (117, 118, 11, 3), 4.18 (35, 45.57, 34.5), 4.19 (5.5, 5.1, 6), 4.20 (7, 11.43, 6.5), 4.21 (52.5, 83, 52, 420), 5.18 (15, 13, 15, 22), 5.19 (1112, 92.67, 50), 5.20 (18, 21, 25, 36), 5.21 (142, 23.67, 20), 6.18 (8, 7, 9.5, 11; 13, 11, 9, 8), 6.19 (8, 2, 3.5, 8; 45; 16.7 per cent), 6.20 (3, 2.8, 2.2; 2.5; +20, -8, +35), 6.21 (7.5, 6.5, 630, 530), 7.18 (2.9, 2.7, 2.4, 1.6), 7.19 (800, 250, 10, 260, -10), 7.20 (3.8, 3.3, 2240, 1565, 40), 7.21 (94, 89, 8, 6).
- Distractors that are numerically derived (4.4, 5.1, 5.5, 6.1) were checked and each is wrong for the stated reason.

## EASY LIST (about 42 of 148)

5.1: #1, #2, #3, #4, #8, #9, #12, #14, #16. 5.2: #1, #2, #5, #9, #11. 5.3: #1, #4, #5, #6, #8, #10, #14. 5.4: #1, #5, #7, #8, #9, #13. 5.5: #3, #8, #10. 5.6: #2, #3, #6, #7, #9, #10, #11, #13, #14. 5.7: #4, #8, #10.

## Per-concept verdict

- 5.1: keys correct; MEDIUM 1 (match) and MEDIUM 3 (repeated skill); long items sound. Pass after fixes.
- 5.2: keys correct; case studies now real decisions; LOW 4 and 6 only.
- 5.3: keys correct; LOW 2 and MEDIUM 5 (3.14c); good case study 3.19 and 3.20.
- 5.4: keys correct; strong long items; no issue above LOW.
- 5.5: keys correct; MEDIUM 2.
- 5.6: keys correct; weakest on easiness (MEDIUM 3); LOW 7 and 8.
- 5.7: keys correct; MEDIUM 4 (one table) and MEDIUM 5 (7.14).

## Overall

148 read, 0 HIGH, 5 MEDIUM, 10 LOW. Every v2 MEDIUM that touched a key or a second answer is fixed. The five MEDIUMs left are small: one ambiguous match, one second reading on a one-mark item, repetition and easiness in two concepts, and two small scope points. Verdict: PASS (optionally fix MEDIUM 1 and 2 before loading, as they affect an answer key).
