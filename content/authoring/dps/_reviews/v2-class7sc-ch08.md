# Review v2: DPS pack, Class 7 Science, ch08 "Measurement of Time and Motion" (gecu108)

File: content/authoring/dps/class7sc/ch08.json (rewrite). Questions read: 123 of 123, every item and every case-study part.
Diffed against content/authoring/dps-v1-backup-2026-10-08/class7sc/ch08.json: **88 of 123 items are text-identical to the backup as whole records (90 by stem text alone)**. 35 are new or changed (the 5 fill_blank, 5 of the 6 true_false and a dozen scenario MCQs and 2-mark items).
Every number was recomputed in python; every fact was checked against content/extracted/gecu108/pages/001-016.txt.

## Headline

- No wrong key and no arithmetic error. HIGH = 0. The old HIGH (8.5 step "18 km") is fixed; the old structural complaints (identical statement keys, all-"wrong" claim-checks, 5 of 6 AR the same, unprinted Table 8.3, mislabelled step marks) are fixed.
- The "no easy questions" rule is NOT met. By my count 45 items are clearly easy-in-disguise (a one-line book fact, one formula step or a number the stem already gives) and 40 more are borderline, 85 of 123 (69%). The loader cannot see this because the Bloom labels were relabelled (Apply/Analyse/Evaluate on one-line facts). 24 of the easy items are new rewrite items; the rest are carry-overs.
- Template check is now fine on keys and slot order (details at the end); the remaining weakness is thin thinking and repetition of single ideas.

## HIGH

None. Key facts all match this book: Ghatika-yantra 24 min and 60 ghatis (1440/24); Samrat Yantra 1 mm/s, 2 s smallest interval, 27 m, about 300 years; Arthasastra "second century BCE to third century CE" for the earliest shadow reference; Varahamihira around 530 CE; Aryabhata first mentioned the Ghatika-yantra; Huygens 1629-1695, pendulum clock invented 1656; early pendulum clocks gained or lost 10 s a day; atomic clocks lose one second in millions of years; progressively replaced by pendulum clocks in the late nineteenth century. Recomputed: 5 gongs = 120 min (8:00 am), 15 gongs by noon, 72/24 = 3 missed, 25 sinkings = 600 min, 70 ghatis = 28 h, 40 sinkings = 16 h, 12 cm = 120 s, 15 min = 90 cm, 15 beats/5 swings x 12 = 36; periods 2.00/2.46/2.01, 1.61/1.60/2.20, 2.5 s (72 oscillations in 180 s, 150 + 30 = 180 s a child, 120 vs 140 min); 840 ms, 5 ms, 30 ms, 750 ms, 50 ms, 2000 microseconds, 495 s, 3908 s, 5 min drift in 30 days, 60 s in 6 days, Rs 4,500 difference; speeds 80, 1.5, 14.4 = 4 m/s, 15 and 43.2, 6 and 5.56 (diff 0.44), 66.7 s, 3.6 km/h, 108 km, 84 min, 36/72/90 km/h, 20 m/s, 3 h, 6.67 vs 7.14 m/s, 20 vs 18 m/s; 40 km/h, 120 km/h, 36 m, 30 m, 45 km/h, 7.5 m/s, 3 m/s, 40 km/h, odometer 150 km, noon arrival.

## MEDIUM

### C7SC-8.1
1. #10 (5-mark, "A school camp needs a timer in four situations"): not exactly one defensible mapping. A candle clock also gives a timer in a dark room (it burns, so it is not dark), a water clock also suits "long evening programme", and "equal markings" fits an outflow vessel too. Key forces hourglass/sundial/candle/floating bowl. Fix: add a unique discriminating clue to each situation (e.g. "needs no flame", "needs no sunlight and shows the elapsed time by sand") or reduce to a comparison question. The stem also hands over the plan and the item is mainly a device-to-fact recall mapping.
2. #16 case study, (d): the key tells the family to light the candle "at a known time, 5:00 am", but on a rainy day with no sundial the family has no way to know it is 5:00 am. The decision is circular. Fix: state that the family has a working alarm or get the answer "light it whenever collection should end minus 2 h, using a watch" and say so in the stem; or make (d) "which of two devices works on a rainy morning and what must be known to use it". Parts (a) and (b) are answerable from the stem alone.
3. #9 (new MCQ, hourglass 5 x 3 = 15): the stem never says the sand starts in the upper bulb, so "5th emptying" could be counted from 4 or 5 runs; add "She starts it with all the sand in the upper bulb". Also one multiplication, see EASY LIST.

### C7SC-8.2
4. #2 (5-mark, "Why was the Ghatika-yantra better ... and why was it only progressively replaced ... late nineteenth century?"): the book gives no reason for the late date, so the "why" is not answerable from this book; the key just recites the date. The five steps (i)-(v) are printed in the stem, so the item is a five-fact recall list. Fix: ask a reasoned comparison the book supports (why a floating bowl gives equal intervals but an outflow vessel does not) without printing the steps.
5. #1 case study: (d) is a strawman; the stem says the council wants every ghati announced "through the night as well" and the sundial "needs no attendant", so "bowl, because a sundial cannot work at night" is given away. Parts (a), (b), (c) are the same 24-min multiplication. Fix: make a real trade-off (attendant cost vs gaps) or remove the night requirement and ask which fails and when.
6. #21 (a) "How old was he then?" 1656 - 1629 = 27, but the book gives only years; Huygens could be 26 or 27 depending on his birthday. Fix: ask "In which year was he 27?" or "How many years after his birth was the pendulum clock invented?" (27).
7. Repeated ideas inside the concept: sundial gives local solar time and needs an IST correction is tested in #4(e), #6, #11(c), #13 and #16 (five times); "N sinkings x 24 min" is tested in #1, #9, #19 and #20 (four items, three of them single multiplications); the name/date facts (Arthasastra, Varahamihira, Aryabhata, Huygens) are tested in #12, #14, #15 and #21. Replace three of these with different ideas (e.g. why a sundial reads differently on different days, comparing devices for accuracy, a drift calculation).

### C7SC-8.3
8. The one rule "mass of the bob does not change the time period" is tested in #2, #3(b)(d), #7(b)(d), #12, #13(c), #14, #15 and #16: eight items. Likewise the half-oscillation misconception appears in both #10 and #17, and the "design a test" procedure in both #16 and #20. Replace #14 (answer is the number in the stem), #16 or #20, and #17 statement I.
9. #3 case study: the stem states the goal (a 2 s period), so (d) follows directly from (a)-(c) and (b), (c) are the same reading of the table. Fix: add a constraint (only a 120 cm thread plus extra length cannot be cut, ask which combination to use).
10. #13 case study: it treats a mela swing as a simple pendulum without saying so (the book itself leaves "Is the swing a pendulum?" as an open project). Add "treat the swing as a simple pendulum" to the stem. Otherwise a good decision part (60-oscillation ride fits at 120 min, 3-minute ride needs 140).

### C7SC-8.4
11. #12 case study is internally inconsistent: the stem says the ECG machine already "has a quartz-based timer", then (d) asks whether to "buy a quartz timer for the ECG". Nothing needs buying. Fix: say the ECG machine has no timer fine enough, or reframe (d) as "which clock should be used for the drug chart and which for ECG analysis, and why".
12. #3, #19, #10(c) and #8(v) all test "a wall clock with a 1 s smallest division cannot separate close finishes" (four times). Unit-conversion arithmetic (h/min/s or s/ms) is the whole question in #2, #7, #9, #14, #15, #18(a), #20 and #13: eight items with no chapter thinking. Keep two, replace the rest with items on principle (what repeats in each clock, when a coarse timer is enough, what precision a task needs).
13. #16 (5-mark notice rewrite) is five one-line unit-writing rules, one mark each; and #8 prints its five steps (i)-(v) in the stem.

### C7SC-8.5
14. #7 case study (d): "Blue, the fastest" is a direct comparison of the (a)/(b) numbers and the student's wrong argument is given in the stem; parts (a) and (b) are the same division. Fix: add a constraint (the district event is a 600 m race and the school can send one team: who finishes first at each team's speed and by how many seconds).
15. #4 is Example 8.1 of the book with the same numbers (3.6 km in 15 min = 4 m/s becomes 21.6 km in 1.5 h = 14.4 km/h = 4 m/s) and #19 is Exercise 5 of the book (horse 18 m/s versus train 72 km/h) almost word for word. Change the numbers and the scenario so the bank item is not a book item.
16. "Distance alone does not decide speed" appears in #2, #6, #7, #9, #20, #21: six items. Keep two.

### C7SC-8.6
17. #6 case study (d): arriving at noon against a 1:00 pm deadline leaves an hour of slack, so the decision is obvious. Fix: make the deadline tight enough that the average speed vs the 20 km/h town stretch matters (e.g. remaining 90 km includes a 30 km town stretch at 20 km/h).
18. #2 (new, True/False) reuses the book's Table 8.3 Train Y distances (20, 15, 15, 25, 20, 25) and the 120 km total unchanged, and #16 is book Exercise 11 with doubled distances; #11 follows book Exercise 8's pattern. Change numbers.
19. "Equal average speeds can hide different motion" is tested in #2, #3 and #18(d) (three times); "uniform speed => proportional distance" in #9 and #10 (twice, same shape). Replace #10.
20. #4 option "Non-uniform even in the first 15 s, since the position keeps changing" and the key are fine, but the stem (0, 10, 20, 30, 45, 60 m at 5 s) never says the readings are at successive 5 s intervals starting at 0 s; it says "at successive 5 s intervals", acceptable. No change needed, noted for the fixer so no one adds a wrong "fix".

### All concepts
21. The rewrite is shallow. 88 of 123 whole items are unchanged from the backup, including most of the items below that are easy. The new items are mostly single-step conversions and rule applications.
22. The three True/False items with verdict True (8.2 #12, 8.4 #4, 8.6 #2) confirm a correct statement and carry no misconception; the standard asks for a real chapter misconception. The mix is 3 True and 3 False (50%), so the loader will pass, but all three True items are fact confirmations: 8.2 #12 is a date comparison, 8.4 #4 confirms "2 h 15 min" follows the rule. Convert two of them to False with a believable slip (e.g. "A film's length written 2 hr 15 mins follows the rules" is False, naming the three breaks; "Varahamihira's expression is older than the Arthasastra reference" is False).
23. Several 4-5 mark items print their own plan, so the student only fills the blanks: 8.1 #10, 8.2 #2 and #4, 8.4 #8, 8.5 #2, 8.6 #16 and #18 (the stem lists (a)-(e) or (i)-(v)). Marks climb with the printed steps, not with thinking. Leave at most one such item per concept.

## LOW

24. 8.3 #6: first option reads "They are almost equal, as a constant time period gives", an unfinished sentence; complete it ("... as a constant time period gives almost equal readings").
25. 8.3 #14 (fill_blank): the answer "18" is the number printed in the stem; it checks nothing. Use a computed answer (e.g. different masses and a changed length) or change the item.
26. 8.2 #16: stem hands all three conclusions' data; fine, but the key text "so it cannot separate two events that are 1 second apart" should say "cannot resolve".
27. 8.1 #5: "touches the 6th mark" is stated in the stem as a minute count; the item is a restatement of the stem (see EASY LIST).
28. 8.1 #11 option 4 ("The fine hole is blocked, because the bowl never sinks by itself") is a non-chapter confusion; use "The bowl was lifted by the water level and has measured only 12 minutes."
29. 8.6 #8 and 8.4 #5, 8.2 #5, 8.3 #2, 8.4 #3: five MCQs where the correct option is the unique longest (5 of 30 = 17%; correct is longer than the mean of the others in 11 of 30 = 37%). Not systematic. No action beyond tidying these five.
30. Fill_blank items: five (8.1 #17, 8.2 #20, 8.3 #14, 8.4 #14, 8.6 #10), all numeric one-token answers, machine-matchable. 8.1 #17 and 8.2 #20 add a unit word after the blank ("minutes", "hours"); good. 8.4 #14 and 8.6 #10 are arithmetic with no chapter content (see EASY LIST).
31. Scope: no scope_out violation (only "Exploratory projects" is out; no item uses a project). No item uses a figure that cannot be drawn; 8.6 #17 describes the train path in words.

## Template check (counts)

- Items per concept: 21, 21, 20, 20, 21, 20 (123). Types: 49 short_answer, 30 mcq, 24 long_answer, 6 assertion_reason, 6 multi_statement, 5 fill_blank, 3 match. Case studies: 2 per concept (12). Bloom: Apply 42, Analyse 42, Evaluate 21, Understand 13 (10.6%), Create 5; Analyse/Evaluate/Create 55%. All within loader limits.
- Slot order is not identical across concepts (8.1 starts sh3, 8.2 starts with a case study, 8.3 mcq, 8.4 assertion_reason, 8.5 mcq, 8.6 mcq). Pass.
- multi_statement keys: 8.1 I and II; 8.2 I and III; 8.3 II and III; 8.4 I only; 8.5 all three; 8.6 II and III. False statement is III, II, I, II+III, none, I. Good spread (II and III only twice). Pass.
- Assertion-reason: explains 3 (8.2, 8.3, 8.5), true-not-explaining 2 (8.1, 8.6), A true R false 1 (8.4); no A-false. Acceptable; add one A-false.
- Claim-checks: No 3 (8.1 "not correct", 8.2 "wrong", 8.6 "wrong"), Yes 2 (8.3 agree, 8.4 right), partly 1 (8.5 "not necessarily"). Pass.
- True/False: 6 (False 3, True 3). Pass numerically; see 22.
- Correct-option-longest: unique longest in 5 of 30 MCQs (17%). Pass.
- Position references ("option (b)", "the third option"): none. Option text with an explanation appended: none (options are clauses, explanations live in the key).
- Step marks: every step list sums to the item marks (checked in code) and agrees with the stem and key. The old 8.5 "18 km" step is corrected.
- Repeated ideas: see 7, 8, 12, 16, 19.

## Per-concept verdicts

- C7SC-8.1: keys right; 9 clear + 5 borderline easy items out of 21; #10 ambiguous, #16(d) circular. Rework the easy items, fix 3.
- C7SC-8.2: keys right; 9 clear + 7 borderline easy items of 21; #2 asks beyond the book; #1 decision given away; #21(a) age ambiguity; heavy repetition.
- C7SC-8.3: keys right; 6 clear + 6 borderline easy of 20; mass-independence tested eight times.
- C7SC-8.4: keys right; 6 clear + 8 borderline easy of 20; #12 case study stem contradicts its own question; unit-conversion arithmetic ten times.
- C7SC-8.5: keys right; 8 clear + 7 borderline easy of 21; #4 and #19 copy book items; #7(d) strawman.
- C7SC-8.6: keys right; 7 clear + 7 borderline easy of 20; three items reuse the book's Table 8.3 / Exercise 11.

## Counts read

123 of 123. HIGH 0. MEDIUM 20 (items 1-23 less the no-action note 20; 3 are chapter-wide). LOW 8 (24-31). Easy-in-disguise: 45 clear + 40 borderline = 85 of 123. Text-identical to backup: 88 whole items.

Overall verdict: **rework the easy items, then pass after fixes**. Facts and keys are sound, the structure and key spread now pass, but 69% of the items are single-fact or single-step and about 70% of those are carried over from the backup.

## EASY LIST

Format `concept#position: reason`. [C] = clearly easy, [B] = borderline. [NEW] = added by the rewrite.

C7SC-8.1
- 8.1#1 [B]: "describe three steps" of Activity 8.1 is the book's procedure.
- 8.1#2 [B]: claim check is one line from the Samrat Yantra box (sundial gives solar time, needs a correction).
- 8.1#4 [C]: (a) is the activity's instruction restated, (b) "9th mark = 9 minutes" is in the stem.
- 8.1#5 [C]: stem says marks are every minute and numbered; "6th mark = 6 minutes" is given.
- 8.1#8 [C]: "name two devices and what each uses" is a recall list; relabelled Understand.
- 8.1#9 [B] [NEW]: 5 x 3 = 15, one multiplication, no chapter idea.
- 8.1#10 [B]: five device-to-situation matches (recall of what each device uses).
- 8.1#12 [C]: restates the book's first paragraph in five marks.
- 8.1#13 [C]: match of four one-line facts.
- 8.1#14 [C]: three one-line statements, one swapped.
- 8.1#15 [C]: (a) name sundial, (b) no sunlight at night.
- 8.1#18 [B] [NEW]: true/false answered by one line (the bowl is lifted and refloated).
- 8.1#19 [C] [NEW]: names what changes in a sundial and in a candle clock; direct recall in distractor form.
- 8.1#20 [C]: differentiate the two water clocks, paraphrase of the book paragraph.

C7SC-8.2
- 8.2#2 [C]: five-step recall list, steps printed in the stem; the "why late nineteenth century" is not in the book.
- 8.2#3 [C]: (a) is the 24 min stated in the book; (b) one division.
- 8.2#4 [B]: unit conversions of 1 mm/s, plus a recall of IST correction.
- 8.2#5 [B] [NEW]: book's own stated rationale for the sinking bowl.
- 8.2#6 [C]: one line of the Samrat box.
- 8.2#7 [B] [NEW]: proportion 15/5 x 12; answerable without the chapter.
- 8.2#8 [B]: claim answered by the single date statement in the book.
- 8.2#12 [B] [NEW]: compare two dates printed in the book; verdict True, no misconception.
- 8.2#13 [C]: differentiate solar time from IST, same fact as #6.
- 8.2#14 [B]: three one-line facts; name/date recall.
- 8.2#15 [C]: match of four name-fact pairs.
- 8.2#17 [C]: AR restating the book's sentence "This led to the development of ...".
- 8.2#18 [C]: how announced and where used, a recall of one paragraph.
- 8.2#19 [C]: 5 x 24 = 120 min, same as #1(a).
- 8.2#20 [C] [NEW]: 40 x 24 = 960 min, same computation again.
- 8.2#21 [B] [NEW]: a subtraction and recall of Galileo's finding.

C7SC-8.3
- 8.3#1 [C] [NEW]: 25 x 0.8, formula applied once.
- 8.3#2 [B]: one rule (mass does not matter), stated in the book.
- 8.3#4 [C]: AR restating "this property is used in the measurement of time".
- 8.3#5 [C]: two direct divisions.
- 8.3#6 [B]: book's own line "the time period is almost the same every time".
- 8.3#8 [B] [NEW]: one rule (depends on length).
- 8.3#12 [B]: claim answered by the mass rule again.
- 8.3#14 [C] [NEW]: answer is the number in the stem (18); tests the mass rule again.
- 8.3#16 [B]: the book's Activity 8.2 / Think like a scientist procedure.
- 8.3#18 [C]: definition of periodic from the book.
- 8.3#19 [B]: mean then divide by 10, the Activity 8.2 arithmetic.
- 8.3#20 [C]: the book's procedure again, duplicates #16.

C7SC-8.4
- 8.4#2 [B] [NEW]: one conversion by 1000.
- 8.4#3 [C]: book sentence on sports timing; wall clock 1 s is in the stem.
- 8.4#4 [C] [NEW]: True; confirms the lowercase/no-full-stop/space rule printed in the book.
- 8.4#5 [C]: "one idea common to all clocks" is the book's first sentence.
- 8.4#7 [B]: two unit conversions by 60.
- 8.4#8 [B]: facts (i)-(v) printed in the stem; one multiplication.
- 8.4#9 [B]: unit conversion then one division.
- 8.4#11 [B]: claim answered by the single sentence on quartz/atomic vibrations.
- 8.4#14 [C] [NEW]: 3 x 165, arithmetic with no chapter content.
- 8.4#15 [C] [NEW]: unit conversion to seconds.
- 8.4#16 [B]: five one-line unit-writing rules.
- 8.4#18 [B]: ms conversion, 60/0.8, symbol writing.
- 8.4#19 [B]: restates that a 1 s wall clock cannot split a 0.2 s gap; the book's Activity 8.3.
- 8.4#20 [C] [NEW]: 1 h = 60 min, one lookup.

C7SC-8.5
- 8.5#1 [C]: 200/2.5, direct formula.
- 8.5#2 [B]: five one-step formula applications, plan printed.
- 8.5#3 [C]: speed with a minute-to-second conversion, one step.
- 8.5#4 [C]: book Example 8.1 numbers.
- 8.5#5 [C]: two conversions and a comparison; same idea as #19.
- 8.5#6 [C] [NEW]: two divisions, a comparison.
- 8.5#8 [B]: all three statements true, each a formula in the book.
- 8.5#11 [B] [NEW]: unit conversion twice.
- 8.5#12 [B]: pick any distance/time that gives 60 km/h.
- 8.5#13 [B]: book Examples 8.2 and 8.3 patterns.
- 8.5#16 [B]: AR on the book's own explanation of the SI unit.
- 8.5#17 [C]: match of four formula/unit definitions.
- 8.5#18 [B]: spotting an inverted formula.
- 8.5#19 [C] [NEW]: book Exercise 5, near word-for-word.
- 8.5#21 [C]: restates the book's margin remark.

C7SC-8.6
- 8.6#1 [C]: subtraction and one division.
- 8.6#2 [B] [NEW]: Train Y data copied from Table 8.3, True; no misconception.
- 8.6#5 [C]: apply the definition of non-uniform once.
- 8.6#8 [B] [NEW]: definition of average speed, pick the right data.
- 8.6#9 [C] [NEW]: proportion 12/4 x 10.
- 8.6#10 [C] [NEW]: proportion 15/5 x 12, repeats #9.
- 8.6#11 [B]: average then definition of uniform.
- 8.6#12 [B]: take differences, compare.
- 8.6#14 [C]: define average speed and why the book says "speed"; book statement.
- 8.6#15 [B]: three one-line facts.
- 8.6#16 [B]: five scaffolded divisions; book Exercise 11 with doubled numbers.
- 8.6#17 [C] [NEW]: restates the book's Fig 8.11 text.
- 8.6#19 [B]: any story with a uniform and a non-uniform stretch.
- 8.6#20 [C]: sum six numbers and read the maximum.
