# Review v2: class6sc ch07 (C6SC, Temperature and its Measurement, fecu107)

Reviewer: independent. File read: content/authoring/dps/class6sc/ch07.json (6 concepts x 21 = 126 questions, all read).
Question numbers are 0-based positions inside the concept (the order of the file). Every number, range, average and
case-study part was recomputed in python or by hand; facts were checked against content/extracted/fecu107/pages/.
Arithmetic and keys are otherwise sound: no wrong key found among 126.

## HIGH (second defensible answer)

1. **C6SC-7.5 Q10** (five readings 46, 46, 45, 41, 46): part (b) "Which mistake in method is most likely to give a reading that
   low?" The key allows only "lifted the thermometer out before reading". Reading before the column stopped rising also gives
   a low value and is in the chapter ("wait till the column stops rising"). The students read "one after another within a
   minute", which does not rule it out. The item's own Q15 lists both as causes. Fix: add to the stem "the column had stopped
   rising each time and every thermometer stayed vertical", or accept both and say so in the step mark.
2. **C6SC-7.1 Q19** (flask case study, serving band "between 60 °C and 70 °C"): after 20 minutes flask 1 is exactly 70 °C. The key
   serves flask 1 "at the upper edge". If "between" is read as exclusive, no flask qualifies and the (d) key fails. Fix: write
   "from 60 °C to 70 °C, both included", or change the cooling to 2 °C every 6 minutes (flask 1 then reads about 68 °C).

## MEDIUM

3. **Slot order is templated across concepts.** All six concepts have the same skeleton: 5 mcq, then multi_statement,
   assertion_reason, fill_blank, (match), 5 two-mark short answers, 2 three-mark, 1 long 3, 2 long 5, 2 case studies (the last
   two slots always). Mark profile is identical in all six: {1:9, 2:5, 3:3, 5:2, 4:2} = 46 marks each. Case studies are always
   the last two items and always "(a) compute, (b) compute, (c) why, (d) choose". Vary the slot order and the part shapes
   from concept to concept (put one case study with a data table first, make one a "find the error" case, change which part
   carries the decision).
4. **Repetition beyond "about twice a concept".**
   - 7.5: "taking the thermometer out makes the column fall, so the reading is low" is tested in Q1, Q6, Q7, Q10, Q12, Q13, Q15, Q16 and
     case study Q18 (9 items). Replace about four with other ideas from the page (eye level/parallax, bulb off the sides, why 0 C stays
     fixed while ice melts, not holding by the bulb).
   - 7.6: maximum minus minimum subtraction in Q0, Q2, Q8, case study Q20(a); the same 10-day table appears in Q14, Q15 and Q17, with Q16
     built on it. Use a different data set in at least two.
   - 7.2: "non-contact thermometer for crowds in an outbreak" in Q4, Q11, Q18(iv), case study Q20(c).
   - 7.3: unit-writing rules in Q3, Q6, Q11, Q17 (the 5-mark item is five rule recalls); "which scale is it" in Q1, Q12, Q18(iv).
   - 7.1: "hotter by n degrees" subtraction in Q4, Q7, Q8, Q10, Q15.
5. **Strawman or dictated decisions in the last part of case studies** (the standard wants a real trade-off):
   - 7.3 Q20(d): Jaya's claim ("cannot show the .15") is plainly false; there is nothing to weigh.
   - 7.4 Q19(d): type A cannot read 0.5 C, which one experiment needs, so "5 of each" is forced. The key says "Either can be argued" but
     then argues only one side. Add a real second constraint, for example a budget that rules out five type B.
   - 7.5 Q18(d): "lift out quickly or keep it in" is settled by the chapter in one line. Q19(d): averaging cooled readings is
     obviously wrong. Give a data pattern where waiting longer is tempting but costs something (a cooling curve with a late
     rising stage), or a cost/speed trade-off between two valid procedures.
   - 7.6 Q19(d): Tuesday (34 C, no clash) beats every other day, so there is no weighing. Make the only fully legal day clash
     with the test. 7.6 Q20(d): Aryan's "must be broken" is the absurd-claim strawman.
   - 7.2 Q20(d): the key itself concludes "one plus six fits both uses"; fine, but the numbers in (a) and (b) are separate from the
     chapter idea (no part needs the chapter apart from (c)).
6. **Easy in disguise** (the answer is a one-line book fact, whatever the Bloom label):
   - 7.1 Q6 (AR, R restates A), Q11, Q12 (Phiban reason, in the chapter opener).
   - 7.2 Q10 (true_false: the book's "normal is an average"), Q13 (explain "average" in the book's own words).
   - 7.3 Q0 (AR: both halves are direct page statements), Q3 (unit-writing), Q17.
   - 7.4 Q4 ("alcohol coloured red"), Q6 (multi_statement, three page sentences, key "all three").
   - 7.5 Q4, Q6 (AR, the page's own cause and effect), Q12.
   - 7.6 Q3, Q6, Q12.
   Raise each to a case with a number or a conflict (for example give a reading and ask which procedure error explains it).
7. **fill_blank items that are bare subtraction, not chapter application**: 7.1 Q7 (74 - 59), 7.5 Q7 (52 - 3), 7.6 Q8 (34 - 21).
   7.6 Q2 (mcq, 31 - 19) is the same. Make the blank need the chapter (the smallest division from a described scale, the Kelvin
   value of a given reading, the actual temperature from an armpit reading as 7.2 Q8 does).
8. **C6SC-7.3 Q12**: "Rekha's digital thermometer shows 98.6 with no unit. On which scale is it reading?" The stem never says she is
   measuring a body temperature, so Fahrenheit is only an inference. Add "She is measuring her own temperature".
9. **C6SC-7.2 Q5**: "Which reading is NOT one that human body temperature normally takes?" 41.6 C and 39.8 C are fevers a student may call
   "not normal". The key rests on the book's 35 to 42 C band. Fix the stem: "Which reading lies outside the band in which human
   body temperature normally stays?"
10. **C6SC-7.2 Q18(v)**: "why neither thermometer should be used for boiling water" is stated by the book only for the clinical one.
    Drop the non-contact thermometer from (v), or restate as "why the clinical thermometer".
11. **Bloom/difficulty labels are flat**: every item is Hard or Hardest, none gradient; trivial subtractions are labelled "Apply, Hard".
    Not a loader failure but the labels do not describe the thinking. Tag the bare-arithmetic items honestly or lift them (items 6 and 7).

## LOW

12. C6SC-7.1 Q3: distractor "treated as having half a fever" is a joke option, not a chapter confusion. 7.2 Q1: distractor "he is too cold,
    because the reading should have been 98.6 C" is not a real slip. Replace with plausible ones (reading above 37.0 C means fever is
    already used; use "the scale is wrong" instead).
13. C6SC-7.1 Q16: the 5-mark "plan an investigation" restates Activity 7.1 step by step, so it is recall of the activity. Add a twist
    (the students only have two bowls, or one bowl is changed) to make it a plan rather than a retelling.
14. C6SC-7.2 Q13: stem says "The book calls 37.0 C ..."; state the idea in the stem without quoting "the book".
15. C6SC-7.2 Q16: "return to normal" on Day 3 depends on 37.3 C at 8 am counting as normal; add "readings within 0.5 C of 37.0 C count as normal".
    It also mirrors book exercise 9 (the table of days and times), so it is close to a copy of the end-of-chapter item.
16. C6SC-7.4 Q19(c): melting ice at 0 C sits on type B's lowest mark; add "reads from just above 0 C" or take ice out of the list so the only
    answer is boiling water. 7.4 Q20(d) names R's trade-off but the stem fixes 23.5 C, which is already in R's range, so the
    answer follows from the stem.
17. C6SC-7.5 Q16: "hold it by the upper part" is beyond the book (it says only "do not hold it by the bulb"); change to "not by the bulb".
18. C6SC-7.3 Q5 uses "3000 C" as a possible temperature; the book only says there is no upper limit, fine, but state "No upper
    limit is known" in the key so the option cannot be questioned.

## Template counts (read, not impression)
- Claim-check verdicts: 7.1 No, 7.2 No, 7.3 Yes, 7.4 Partly, 7.5 Yes, 7.6 Partly = 2 No / 2 Yes / 2 Partly. Acceptable mix (target about half No; add one No in place of a Yes in 7.3 or 7.5 if the author wants the half).
- multi_statement keys: "1 and 3 only", "1 only", "2 and 3 only", "all three", "2 only", "1 and 2 only". Well spread; no template.
- assertion_reason outcomes: explains, not-explains (7.2, 7.6), A true R false, A false R true, explains, not-explains. All four outcomes appear. Good. Note 7.2 and 7.6 use an unrelated R ("runs on batteries", "clinics have thermometers"), which is fair but flat.
- true_false verdicts: 7.1 F, 7.2 T, 7.3 F, 7.4 T, 7.5 F, 7.6 T = 3 True / 3 False. Good.
- Correct option strictly the longest: 10 of 48 option items (21 percent); another 18 are ties because all options are equal length. Not systematic. No option named by position anywhere. No Easy label, no Remember. Understand is 11 of 126 (9 percent); Analyse, Evaluate and Create are 76 of 126 (60 percent).
- Per-concept slot order: same skeleton in all six (finding 3). Mark profile identical.
- Match items: 7.2, 7.3, 7.4, 7.6 (4 of 6 concepts); fill_blank 6; true_false 6; figure items 7.4 Q3, Q16 and 7.5 Q0 are fully described in words.
- Scope: scope_out items (Anna Mani, Sun at 15 million degrees, pulse before thermometers, diagram-based exercise questions) are not used. The mercury-toxic fact appears only as "digital replacing mercury" (allowed). No Fahrenheit conversion formula is used (book gives only the 37.0 C = 98.6 F pair). Salt-and-ice mixture at -15 or -20 C (7.4 Q5, Q17) is outside the chapter but only as scenery.

## Verdicts per concept
- C6SC-7.1: keys right; fix the 70 C boundary in Q19; thin, repetitive subtraction; several recall items. Pass after fixes.
- C6SC-7.2: keys right; non-contact idea repeated four times; Q5 and Q18(v) wording. Pass after fixes.
- C6SC-7.3: keys right; unit rules over-tested; Q12 stem; Jaya strawman. Pass after fixes.
- C6SC-7.4: keys right; Q19(d) forced; easy-in-disguise Q4 and Q6. Pass after fixes.
- C6SC-7.5: one second-answer item (Q10b); the "lift out" idea repeated nine times; both case studies decided by the chapter. Pass after fixes (heavier edits).
- C6SC-7.6: keys right; same data set four times; case-study decisions have a dominant answer or an absurd opponent. Pass after fixes.

## Counts read
126 questions read (6 x 21). HIGH 2, MEDIUM 9 (items 3 to 11), LOW 7 (items 12 to 18). Templated: yes in structure (identical slot order and mark profile across concepts, case studies always last two), not in wording. Overall: pass after fixes.
