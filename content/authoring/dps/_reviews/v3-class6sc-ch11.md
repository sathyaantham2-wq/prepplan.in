# Review v3: Class 6 Science ch11 "Nature's Treasures" (SCI6, fecu111)

File: `content/authoring/dps/class6sc/ch11.json`. 129 questions read (C1 22, C2 20, C3 21, C4 23, C5 21, C6 22). Pages `content/extracted/fecu111/pages/001-024.txt` re-read. Every number recomputed in python or by hand (air bead tables, roof harvest, solar units, forest hectares, phone counts, fuel litres, coal tonnes, percentages, gooseberry kg). Indexes are 0-based positions in the concept's list.

Result in one line: no wrong key and no new HIGH; the one v2 HIGH is fixed; two new MEDIUM faults came in with the fix pass; the chapter is still templated at recipe level and still carries about 28 easy-in-disguise items.

## v2 status, finding by finding

1. HIGH, C6 grinding slab. FIXED. The nine items now contain "a smooth pebble from the riverbank"; (a) = 3 human-made (table, bicycle, bulb), (b) = 3 renewable + 3 non-renewable (water, air, firewood / gas, soil, rock). Recomputed, single answer.
2. Template. PARTLY FIXED. Marks per concept now vary (47, 45, 49, 49, 48, 50), question counts vary (20 to 23), C6 starts with a match, C4 has 2 fill_blanks, C3 adds a table case study, the first five-mark items are no longer all "justify in five points". But the recipe is unchanged (see MEDIUM 3).
3. Easy in disguise. NOT FIXED in the main. Most of the listed items are untouched (C1 idx 1, C2 idx 1/3/5, C3 idx 1/4, C4 idx 2/5, C5 idx 1/3/4, C6 idx 2/5). See MEDIUM 4 for the current list.
4. Repetition. MOSTLY FIXED. C1 air-percentage arithmetic cut from seven items to three. C3 fill_blank no longer duplicates the case study. C5 "millions of years / limited" still sits in four items (see MEDIUM 6). C4 hectares sum still appears twice (idx 9 and idx 21).
5. C3 Reddy case study. FIXED. Normal week now gives exactly 60 against a 60-unit need (week 1: 4 x 12 + 3 x 4 = 60; week 2: 68; week 3: 44; week 4: 36). (b) = 16 + 24 = 40 correct. (d) with 50% more: 18 and 6 per day, week 3 = 66, week 4 = 54 (6 short); recomputed. Now a real choice.
6. C5 buses. FIXED. Seat capacity 50 and 180 riders now given: 4 CNG = 200 seats (none left out), 2 electric = 100 (80 left out). Correct.
7. C1 percent-volume maths. FIXED in C1 (bead jars now 100 and 200 counts; no percent-of-volume sums left). But percentage sums have appeared elsewhere (see MEDIUM 7).
8. C5 smoke-cause item. FIXED. Now asks only what Amma says (vehicle fossil fuels) and her alternative (electric vehicles). Matches page 224.
9. C4 phone items. FIXED. Now framed on minerals taking thousands to millions of years to form, and the eco-club choice (keep phone vs plant trees) is argued from that. The e-waste claim is gone. Wrong options of C4 idx 4 are still weak (see LOW 12).
10. Label inflation. NOT FIXED. All 129 are Hard (102) or Hardest (27). No Medium anywhere.
11. C6 old idx 10(b). FIXED ("which could still be lost... and how").
12. Lion/deer. FIXED (item removed; C3 idx 14 now solar panel / gas stove / windmill).
13. C1 windmill "NOT do". FIXED (now "which job can the village still get done" on a still sunny day; single answer, drying chillies).
14. fill_blank format. FIXED. C2 idx 7 says "digits only, no commas"; C5 idx 7 says "write the number only" (key 70 is an integer now).
15. C1 reverse. FIXED. New reverse ("Because the wind dropped") is clean.
16. C4 Chipko "faced men". FIXED.

## HIGH (0)

None. Every key was decided before reading the answer and matches. Statement items: C1 idx 2 (2,3 true), C2 idx 2 (1 only), C3 idx 2 (all), C4 idx 6 (1,3), C5 idx 5 (2 only), C6 idx 6 (1,2) all verified against the pages. Assertion-reason items all verified (C1 explains, C2 not explains, C3 R false, C4 A false, C5 explains, C6 not explains).

## MEDIUM

1. **C6SC-11.3, idx 18 (box cooker case study), part (b) and part (a).** "The LPG stove ... uses gas worth Rs 40 a day" then (b) "How much does the LPG for lunch cost in a month of 22 school days?" Key = 40 x 22 = Rs 880. The stem never says the Rs 40 is for lunch alone; the same stem has the stove also serving dinner in part (a), so Rs 40 a day could cover both meals and a lunch-only cost is unknown. Part (a) key says "No: after sunset there is no sunlight", but dinner is at 7:30 p.m. and the cooker needs 2 h 30 min, so it would start at 5:00 p.m., before sunset in much of India for part of the year; the stem gives no sunset time. A student can defend "yes, start at 5 p.m. if the sky is clear". Fix: write "uses gas worth Rs 40 for each lunch" and give the sunset time ("the Sun sets at 6:00 p.m.") so that (a) is forced.
2. **C6SC-11.5, idx 19, key of part (b).** The final answer (at least 4 drivers) is right (cars burn 1.33 L each, bus 5 L; 5 / 1.33 = 3.75). The explanation says "3 save only 4 litres, 4 save 5.33 litres". That is wrong: three cars burn 4 L against the bus's 5 L, so the bus uses 1 L MORE; four cars burn 5.33 L, so the bus saves 0.33 L. Fix the key text to "three cars burn 4 L, which is less than the bus's 5 L; four cars burn 5.33 L, which is more".
3. **Template, whole chapter (counts).** Per concept: 5-6 MCQ + 1 multi_statement + 1 assertion_reason + 1 fill_blank (+1 match in 4 concepts) + 5-6 two-mark + 3-4 three-mark + 4-5 long items. All six concepts follow the same order: single-mark block, five 2-mark, three 3-mark (claim_check, a reverse or show_impossible, one more), then 4/5/4/5 or 4/4/5/5 long items; C2 and C5 are nearly identical, as are C1 and C3. All 12 tagged case studies (and the untagged ones) are still (a) arithmetic or a fact from the stem, (b) arithmetic or reverse, (c) one chapter fact, (d) "should X or Y? Justify" with "Either with a reason" in the key (10 of 12). Every concept still has exactly 4-5 Hardest and all others Hard. Fix: replace one case study in two concepts with a 4-mark data-table item; put a decision first in one case study; use Medium for plain scenario MCQs; vary the 2-mark block (3 in one concept, 7 in another).
4. **Easy in disguise (about 28 of 129, 22%).** One-line book facts under Hard/Analyse labels. Add a second step or a real confusion.
   - C1: idx 1 (78/21/1 split), 4 (fill_blank "21" is just the book's figure), 5, 7, 9 (match of four book facts), 10 (true_false "only way is breathing").
   - C2: idx 1 (stepwell seepage), 3 (unequal access), 4, 5, 8 (rainwater harvesting is age-old).
   - C3: idx 1, 4 (solar panels make electricity), 7, 8.
   - C4: idx 2 (laterite walls, slate roof), 5, 8 (fill_blank "mineral", a pure definition), 13 (rock vs mineral), 12.
   - C5: idx 1, 3, 4, 8 (CNG cleaner but fossil), 12, 16.
   - C6: idx 1, 2, 3, 5, 9 (natural gas vs air), 15.
   Both fill_blanks C1 idx 4 and C4 idx 8 are recall, not application. The case-study parts that need the chapter are only (c) and (d); parts (a) and (b) in almost every case study (C1 idx 18, C2 idx 16, 17, 19, C4 idx 21, C5 idx 19, 20, C6 idx 21) are arithmetic answerable from the stem alone.
5. **C4, hectares sum repeated (idx 9 and idx 21).** Both are "forest loses X ha a year, find years or hectares left". Change idx 9 to a different idea (e.g. which of three samples of soil... ) or drop one.
6. **C5, one idea in four items.** "Fossil fuels take millions of years, limited, will run out" is the core of idx 6 (R), 8 (CNG), 13 (coal claim) and 14 (show_impossible), with C6 idx 18 repeating the coal argument. Keep two; replace the others with coal-vs-petroleum use, or pollution ideas.
7. **Percentage sums outside scope.** `scope_out` allows percentages only as air's own 78/21/1. Percentage sums now appear in C2 idx 17(a) (70%), C4 idx 21 (60%), C5 idx 7 (70% of 40), C6 idx 19 (10%, 20%, 12%). That is Class 6 maths, not science. Fix: give counts instead of percents in C5 idx 7 and C6 idx 19, or add percentages to scope.
8. **Wood as human-made, four times in C6** (idx 1 chair, idx 17 wood, idx 20(c) wooden table, idx 15 table example). Cut two.

## LOW

9. C6 idx 13: "In Table 11.4 of the chapter, the row 'Making kites'..." names the book's own table; the item should stand alone ("In a table of natural resources used in activities, ...").
10. C3 idx 3: solar water heater and solar cooker also change sunlight into heat; the key (only the panel "changes the Sun's energy into another form") follows the book's wording "directly used", but a Class 6 student can argue the heater. Reword to "which one produces electricity" or "which does not warm anything directly".
11. C5 idx 10(b): "which fossil fuel does the family probably depend on without burning at home? Coal." The book also says natural gas generates electricity. Key says "mainly", but add "mainly used for electricity" to the stem.
12. C4 idx 4: two wrong options are absurd ("made mostly of coal", "metals from fallen leaves"); C5 idx 4 and C1 idx 5 also have one absurd option. Replace with real confusions (e.g. "minerals renew in a few years like crops").
13. C5 idx 17 (key item 2): "burning coal, wood or dung cakes ... produces smoke" goes slightly beyond the page; the book only says over-dependence on fossil fuels as domestic fuels adds to air pollution. Keep coal only.
14. C4 idx 22 (b) key: "about 480 fewer mineral portions" is an invented unit not asked for; delete from the key.
15. Label inflation (v2 item 10): no Medium or Easy anywhere; Bloom is Analyse 55, Apply 33, Evaluate 30, Create 7, Understand 4.

## Counts read
- 129 questions: 30 mcq, 6 multi_statement, 6 assertion_reason, 4 match, 7 fill_blank, 6 true_false (as short_answer), 7 claim_checks (verdicts: partly right 2, No 3, Yes 2), 12 case studies and 6 five-mark items plus other short and long answers.
- Marks per concept 47 / 45 / 49 / 49 / 48 / 50. Difficulty: Hard 102, Hardest 27.
- multi_statement keys: 2&3, 1, all, 1&3, 2, 1&2 (spread good). AR outcomes: 2 both-true-explains, 2 both-true-not-explains, 1 R false, 1 A false (good). true_false verdicts: False 4, True 2.
- Correct option is the longest in 8 of 30 MCQs (27%), not a tell.
- Marks vs `s` step marks: all match. No option named by position anywhere.
- Easy-in-disguise share: about 28 of 129 (22%).
- Templated: yes, at recipe level (MEDIUM 3), less than in v2.

## Verdicts per concept
- C6SC-11.1 Air: keys all correct; pass after fixes (MEDIUM 4).
- C6SC-11.2 Water: keys all correct; pass after fixes (MEDIUM 4, 7).
- C6SC-11.3 Sun: keys correct, but idx 18 is ambiguous; pass after fixes (MEDIUM 1, LOW 10).
- C6SC-11.4 Forests and soil: keys all correct; pass after fixes (MEDIUM 4, 5, 7).
- C6SC-11.5 Fossil fuels: final answers correct, key text of idx 19(b) wrong; pass after fixes (MEDIUM 2, 6, LOW 11).
- C6SC-11.6 Resources: keys all correct; pass after fixes (MEDIUM 4, 7, 8).

**Overall: pass after fixes.** 129 read, 0 HIGH, 8 MEDIUM, 7 LOW. Templated: yes (recipe level).
