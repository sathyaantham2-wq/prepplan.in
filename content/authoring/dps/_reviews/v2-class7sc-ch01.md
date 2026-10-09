# Review v2: DPS bank, Class 7 Science, ch01 "The Ever-Evolving World of Science" (gecu101)

File: content/authoring/dps/class7sc/ch01.json. Read all 63 questions (3 concepts x 21), every one, against textbook pages 001-006 and the scope record. All numbers recomputed in python.

Overall verdict: REWORK of the easy items, then pass after fixes. Keys are right except one second-defensible answer; arithmetic is all correct. The main problem is the owner's new rule: this chapter is an overview chapter with about 5 pages of "what is coming" prose, and many items are still one-line lookups wearing Apply/Analyse labels. 38 of 63 items (60%) are text-identical to the backup; most of the EASY LIST items are therefore unchanged old recall (see the counts at the end).

Counts: Bloom Apply 28, Analyse 20, Evaluate 8, Understand 4, Create 3, Remember 0 (Analyse/Evaluate/Create 49%, Understand 6%: loader limits met, but the Apply label is used for many lookups). Types per concept: 4/3/4 scenario MCQ, 1 match, 1 fill_blank, 1 multi_statement, 1 assertion_reason, 2 case studies each; true_false only 2 (1.2 #21, 1.3 #10), both False (0% True; loader check starts at 4 items, but the pair is a pattern); fill_blank 3; match 3. Marks total 145.

## HIGH

1. C7SC-1.3 #8 "(b) Which of the two would a stopwatch help with?" key "How fast something happens". A stopwatch is an instrument for measuring time, so "How do we measure time?" is equally defensible; step mark 2 credits only one. Fix: replace (b) by something with one answer, for example "Which of the two questions does the sentence 'a clock tells us the time and how it passes' already answer, and which stays open?" or drop the stopwatch and ask for a measurement plan for 'how fast' (a distance and a time).

No wrong numeric keys and no wrong book facts found.

## MEDIUM

2. C7SC-1.1 #3 (mcq, "Just add some milk") uses Activity 1.1 question-making, which the scope file lists in scope_out ("Activity 1.1 question-making, open-ended activity"). Also its three wrong options are the activity's own examples ("32 + 10", "answer to life, the universe and everything", "cat's teeth"), so it is solved by elimination, and the correct option is the longest. Fix: delete, or replace by an item not about Activity 1.1. (The old review's finding 11 flagged the same activity.)

3. C7SC-1.1 #10 (case study, Kochi drain) part (c) "Does Group B's record prove heavy rain is the only cause?" The stem says the drain overflowed on 12 heavy-rain days "and on no other day", so every overflow had heavy rain: a student can defensibly answer "heavy rain looks necessary but not sufficient" or "yes, nothing else was recorded". Key reasons only about sufficiency (3 heavy days with no overflow). Fix: ask "Does the record prove that heavy rain alone is enough to overflow the drain?" Also (b) is a bare 12/15 from the stem (no chapter needed), and only (a) and (d) use the book.

4. C7SC-1.1 #17 (case study, Mysuru cups) part (a) is printed in the stem ("Week 3 (the week of Annual Day)"), a free mark, against the anti-template rule. Part (c) "which of the two things the chapter says human activities are linked to is most affected" has no single answer (natural surroundings vs society); the key hedges with both. The key also says "field and drain" but the stem never mentions a drain. Fix: drop "(the week of Annual Day)" from the stem and ask for the cause in (a); make (c) "name both links the chapter draws between human activities and the world, and give one example of each from the data".

5. C7SC-1.2 #3 (case study, Kolhapur ice): (b) 150/15 and (c) which container exceeds 100 min are stem arithmetic with no chapter; (a) is a recall of "how heat flows". (d) is lopsided: with free refills, ONE box (Rs 120, two refills) beats "three boxes at Rs 360", so the key's second plan is a dominated option, and the cost/insulation reasoning is not in the chapter. Fix: make the refill cost real (a staff cost per refill) so box vs flask is a real trade-off, and make (b)/(c) require a chapter idea (for example which container lets least heat flow in, and why more heat in means faster melting).

6. C7SC-1.2 #14 (case study, well level) (b) and (c) are the same subtraction (9-5 = 4 twice), both stem-only; (a) "rain trickling underground" is a one-line lookup; only (d) needs thought and it uses data, not the chapter. Ramesh is a weak foil. Fix: make (c) a different calculation (for example Sept to Dec change = 1 m fall, a monthly rate) and ask in (d) which chapter idea about water's journey explains why the level is highest after the monsoon.

7. C7SC-1.2 #7 (claim_check, Dinesh) key says heat "must" come before water and changes before heat. The book only lists topics in that order; it never says the order is necessary ("we need heat first" is the author's, not the book's). Over-claim against the rule "do not claim more than the book does". Fix: reword the stem to "Show from the chapter's own sentences one link each between neighbouring topics" and mark links as stated in the book (heated changes, Sun evaporates sea water), not as necessity.

8. C7SC-1.3 #14 (case study, Ranchi pole) part (a) "for what purpose did early humans use shadows" is answered by the stem (a stopped clock, a pole, hourly marks); (b) and (c) are table reading (140-40, 75 cm between 95 and 60). Part (d) key says the pole "can time the 8.30 march-past" but the hourly marks give no 8.30 reading (only interpolation), and "6.30 p.m. is after sunset" is assumed (the stem says only "under floodlights"). A second defensible answer is that only the 11 a.m. relay can be timed. Fix: remove (a) or make it a reason the stem does not give; state a sunset time; choose events that fall exactly on marked hours or ask for the "nearest mark".

9. C7SC-1.3 #19 (case study, notice) is a strawman decision: stamp Rs 150 vs reprint Rs 600 is a 4x difference with no downside for the stamp, so (d) has one sensible answer. (b) is a recall of "Earth and Moon" and (c) pure arithmetic (450 is correct). Fix: add a trade-off (the stamp fits only if the notice has blank space; reprinting also fixes spelling; budget Rs 400) so each side has a cost.

10. C7SC-1.3 #18 (5 marks) part (a) and (b) are recall of the book's questions, and (c) "science extends a question from one case to another to look for what living things share" is NOT stated by the book (it only asks the questions). Fix: ask a transfer task instead (for a new animal process the student chooses, write the parallel question about plants), mark (c) as the student's own reasoning, not the book's claim.

11. Option-length template: the correct MCQ option is the longest (ties included) in 9 of 12 MCQs (75%): 1.1 #3, #4; 1.2 #8, #16, #17; 1.3 #1, #5, #9, #15. Violates the "correct option must not be the longest" rule. Fix: lengthen the distractors or shorten the keys in these nine.

12. Repeated ideas. (i) The shadow-clock sentence ("early humans used the position of shadows to tell the time") drives 1.3 #3, #4, #5, #9, #10, #11, #13, #14, #15, #20: 10 of 21 items in one concept on one book line. (ii) "A torch battery runs out and cannot be used again" drives 1.2 #5, #13, #18, #20, #21 and the match #4. (iii) "Lamp glows -> metals and non-metals" is 1.2 #1, #4, #8, #19. (iv) "Plants also need food and breathe" is 1.3 #1, #2, #18, #21. (v) "stepping stones/step out of the book" is 1.1 #2, #10, #12. (vi) "water trickles underground, far away" is 1.2 #10, #14, #16, #4. Fix: keep one or two items per idea and spend the freed slots on different chapter sentences (Grade 6 comparison, sustainability, light as a deep question, the butterfly page numbers/paper plane, Grade 7 aim).

13. All six case studies share one frame: (a) a book fact, (b) simple stem arithmetic, (c) a second lookup or arithmetic, (d) "either with reasons" cost or budget choice. Three of the six have Rs costs. Fix: vary at least two (one with no numbers, one where the data contradict the intuitive choice).

14. C7SC-1.2 #19 (5 marks): the set-up (circuit with a gap, test one at a time, record glow or not) goes beyond what this book says here (the chapter only says "play with batteries, lamps and wires"); it also repeats 1.2 #1, #8. Parts (b) and (c) are Class 6 knowledge, (d) is a recall. Fix: accept any workable set-up and mark on logic, or remove.

15. True/false verdicts: both items are False (0% True). Add a True item with a subtle reason (for example 1.1: "Even an experiment whose result matches the prediction can lead to new questions: True, because the chapter says it might need more experiments"). Also 1.1 has no true_false item.

16. C7SC-1.3 #6 (claim_check, Rhea): book says "to understand all of this [eclipses, day and night] we need to know how the Earth rotates, how the Moon goes around the Earth and the Earth around the Sun". The key says the Moon's movement is listed only for eclipses; the book's "all of this" includes day and night. Verdict "not supported" still stands (day and night depend on Sun's light) but step 3 mis-reads the book. Fix: step 3 "notes the Moon's movement is listed with the other two movements among the things to understand, not named as the cause of day and night".

## LOW

17. C7SC-1.1 #6 (match): item 3 (students test a way to cut waste) could also fit "d. activities and experiments are stepping stones", and item 4 (Group B records rainfall) could fit "c. environment". Keyed choice is the best fit but not unique. Fix: make item 3 clearly about the environment and item 4 clearly about the experiment itself.

18. C7SC-1.2 #2 (fill_blank "more ___ flows into it") answer "heat": a machine will also see "energy", "warmth"; and it copies the chapter's "how heat flows". Not application-level. Fix: a computed or reasoned blank, for example "a Grade 7 chapter order: properties, changes, ___, water" is still recall, so better "ice melts 10 times slower in the flask than in the glass, so it received ___ heat per minute" with a stated unit; or "ice at 150 min vs 15 min: the flask lasted ___ times as long" (10).

19. C7SC-1.1 #9 (fill_blank average, 3) correct (7 - 4) but needs no chapter at all (Class 6/7 maths mean). C7SC-1.3 #3 (7 pebbles, correct) is a fence-post count, only barely linked to shadows. Fix: tie the number to a chapter idea, for example pebbles needed to mark one shadow per hour from sunrise to sunset 6 a.m.-6 p.m. = 13.

20. C7SC-1.2 #11 (5 marks) key part (b) "glacier = same idea on a large scale" is an inference; the book simply gives the glacier as a second melting example. Soften the step: "names the glacier as the second example of the same heat-flow topic".

21. C7SC-1.2 #13: real batteries recover a little on resting; the key is right for this book ("can't be used again"), but add "according to the chapter" to the stem.

22. C7SC-1.3 #14 and C7SC-1.3 #19 (Rs 2 x 300, 1.1 #17, 1.2 #3 prices): numbers fine; settings realistic. No fix.

## Checks that passed
- fill_blank: 3 (answers 3, "heat", 7); the two numeric ones are correct (7-4 = 3; 8:00 to 11:00 every 30 min incl. = 7).
- Case-study arithmetic: 12/15 = 80%; (40+35+45)/3 = 40, 90/40 = 2.25; 150/15 = 10; 9-5 = 4 and 9-5 = 4; 140-40 = 100; 300x2 = 600, 600-150 = 450; 95 > 75 > 60. All correct.
- step marks add to the question marks in every item (checked by script); no option is named by position anywhere.
- multi_statement keys: "2 and 3 only" (1.1), "1, 2 and 3" (1.2), "1 only" (1.3). Spread OK but 1.2 #9 has no false statement (all three quotes), so it is a pure lookup; 1.1 #7 S1 and 1.3 #4 S2/S3 ("never", "only") are tell-tale words.
- assertion_reason keys: "A false R true" (1.1), "both true, explains" (1.2), "both true, not explains" (1.3): varied.
- claim_check verdicts (5): Yes (1.1 #5), Not necessarily (1.1 #15), order not arbitrary (1.2 #7), Partly right (1.2 #18), No (1.3 #6): mixed, but 1.2 #7 is not really a claim_check with a real verdict.
- Slot order is not identical across concepts (case studies at positions 10/17, 3/14, 14/19), but each concept has the same type counts (1 match, 1 fill_blank, 1 multi_statement, 1 AR, 2 case, about 2 five-mark); acceptable.
- Facts match the book (haldi stain, sour fruit, lamp glow/metals, torch battery, ice and glacier, Sun evaporates seas, rain far away, the three movements, eclipses by Earth and Moon, early humans' shadows, bird wings, paper plane). No fact error found.

## Verdict per concept
- C7SC-1.1: pass after fixes (items 2, 3, 4, easy list; 12 of 21 text-identical to the backup).
- C7SC-1.2: pass after fixes (items 5, 6, 7, 14, 18; 12 of 21 identical; heaviest on repeated battery idea).
- C7SC-1.3: rework (HIGH item 1; item 8, 9, 10; 14 of 21 identical; shadow-clock repeated 10 times).

Text-identical to the backup: 38 of 63 (1.1: 12; 1.2: 12; 1.3: 14).

## EASY LIST
Format: concept#position: reason. "unch" = text-identical to the backup; "new" = added by the rewrite. Definite easy items first, then borderline (marked B).

C7SC-1.1#1: scenario restates the book line ("ideas in one area allow questions in another"); wrong options absurd; correct longest (new)
C7SC-1.1#2: (a) one-line recall of "interconnected"; (b) open example (new)
C7SC-1.1#3: eliminate the three activity examples; out of scope; correct longest (new)
C7SC-1.1#4: matches one book sentence ("confirming experiments lead to more questions"); distractors "ends the investigation" absurd; correct longest (unch)
C7SC-1.1#5: 3 marks but verdict "Yes" is the book's "covers everything" line; evidence = quote the chapter's examples (new)
C7SC-1.1#7: statement 1 is a "never" strawman, 2 and 3 are quotes (unch)
C7SC-1.1#8: (a) name two of three quoted questions = recall (unch)
C7SC-1.1#9: mean of two lists; no chapter content (new)
C7SC-1.1#11: assertion is an obvious strawman ("no connection"), R is a quote (unch)
C7SC-1.1#12: (a) one-line recall "stepping stones to deeper understanding" (new)
C7SC-1.1#14: scenario maps ants-in-a-line to the book's "patterns" line; wrong options absurd (unch)
C7SC-1.1#19: 5 marks, (a)(b)(c) three book sentences, (d) Aisha strawman (unch)
C7SC-1.1#20: (a) "bird wings" is a one-word lookup (new)
C7SC-1.1#18 (B): (a) recall of "science is a process"; (b) open (new)
C7SC-1.1#6 (B): match of four situations to four book sentences; mapping obvious (new)
C7SC-1.1#21 (B): "second question is closer to Grade 7 aim", the reason is the book's line (unch)
C7SC-1.1#15 (B): two quoted statements, verdict follows (unch)
C7SC-1.2#1: both parts are book sentences (lamp question, metals and non-metals) (new)
C7SC-1.2#2: fill "heat" restates "how heat flows"; not application (new)
C7SC-1.2#3 (parts b, c): stem-only arithmetic, plus (a) lookup (new)
C7SC-1.2#4 (B): match of topic names to situations; each pair one book line (new)
C7SC-1.2#6: kulfi -> "how heat flows"; stem says warmth moves (unch)
C7SC-1.2#8: lamp-and-metals scenario; correct longest (unch)
C7SC-1.2#9: three quotes, all true, no false statement (unch)
C7SC-1.2#10: both parts are the book sentence "evaporates from seas ... falls as rain ... trickling ... far away" (unch)
C7SC-1.2#12 (B): AR of two quotes, "both true, explains" is the predictable key (unch)
C7SC-1.2#14 (parts a, b, c): lookup + the same subtraction twice (unch)
C7SC-1.2#15: (a) "how heat flows" (b) "Sun" = two lookups (new)
C7SC-1.2#16: scenario answered by quoting the book line ("trickle ... far away"); correct longest (unch)
C7SC-1.2#17: order of four topics = recall of the book's sequence; correct longest (unch)
C7SC-1.2#20: (a) "changes around us", (b) battery = lookups (new)
C7SC-1.2#13 (B): battery cannot be reused, a book line though 3 marks (unch)
C7SC-1.2#21 (B): true/false resolved by the book's question "what kind of changes are these?" (new)
C7SC-1.2#5 (B): (a) battery = lookup; (b) reasoning is genuine (unch)
C7SC-1.3#1: book's plant question quoted in key; correct longest (new)
C7SC-1.3#2: (a) the book's two questions, (b) eating and breathing = recall (new)
C7SC-1.3#4: "only"/"matter only" tell-tale false statements; S1 a quote (unch)
C7SC-1.3#5: stick shadow -> "early humans told the time"; correct longest (unch)
C7SC-1.3#7: AR of two quotes (unch)
C7SC-1.3#8: (a) two quoted questions; (b) stopwatch has two answers (unch)
C7SC-1.3#9: marks at three hours -> tell the time; distractors absurd; correct longest (unch)
C7SC-1.3#10: true/false answered by the book's "not just shadow puppets or time" line (new)
C7SC-1.3#12 (B): match of four situations to four book lines (new)
C7SC-1.3#15 (B): "no Sun at night" one step; correct longest (new)
C7SC-1.3#17: (a) stem lists the three movements; (b) "Earth and Moon" recall (new)
C7SC-1.3#18: 5 marks, (a)(b) recall of the book's questions (unch)
C7SC-1.3#21: (a) eating and breathing given away by stem; (b) one-line recall (new)
C7SC-1.3#14 (parts a, b, c): stem-printed purpose, table subtraction, table reading (unch)
C7SC-1.3#19 (parts b, c, d): recall, arithmetic, strawman stamp-vs-reprint (unch)

Counts: definite easy 38 (1.1: 13, 1.2: 12, 1.3: 13) plus 11 borderline (B), of 63 total; 49 flagged in all. Of the 38 definite, text-identical to the backup: 1.1 #4, #7, #8, #11, #14, #19; 1.2 #6, #8, #9, #10, #14, #16, #17; 1.3 #4, #5, #7, #8, #9, #14, #18, #19 = 21 unchanged old items; 17 are new items that are also easy.
