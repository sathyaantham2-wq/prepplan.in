# Review v3: DPS bank, Class 7 Science, ch01 "The Ever-Evolving World of Science" (gecu101)

File: content/authoring/dps/class7sc/ch01.json. Read all 63 questions (3 concepts x 21) against textbook pages 001-006 (gecu101) and compared with v2. Every numeric key, multi_statement key and assertion_reason key was recomputed in code/by hand before reading the stored key.

Verdict: PASS. HIGH 0, MEDIUM 2, LOW 12. All keys are right; no second defensible answer found; no scope violation; no positional option references.

Counts: Bloom Analyse 20, Evaluate 19, Apply 14, Create 6, Understand 4 (Analyse/Evaluate/Create 71%). Types: short_answer 27, long_answer 12, mcq 11, multi_statement 4, match 3, assertion_reason 3, fill_blank 3. Marks total 141. Step marks equal question marks in every item (script check).

## v2 findings: status
- HIGH 1 (stopwatch, 1.3 #8): FIXED (item replaced by Ravi's toy cars; one answer per part).
- MEDIUM 2 (Activity 1.1 "Just add some milk"): FIXED (item gone; no item uses Activity 1.1 question-making).
- 3 (Kochi drain necessary/sufficient): FIXED (item replaced). 4 (Mysuru cups): FIXED, week-of-Annual-Day hint removed, (c) now asks for both links. 5 (Kolhapur ice): FIXED, refill cost makes box vs flask a real trade-off, (a) needs the heat-flow idea. 6 (well level): FIXED, two different calculations, (d) uses the chapter. 7 (Dinesh order claim): FIXED, stem now asks for a stated link. 8 (Ranchi pole): replaced. 9 (notice): FIXED, stamp fits only 220, budget Rs 400. 10 (1.3 #18): replaced. 11 (longest option): FIXED (only ties in 12-18-character multi_statement/match option sets, no real MCQ). 12 (repeats): reduced (shadow-clock from 10 items to 5). 14 (circuit 5-marker): removed. 15 (true/false all False): FIXED, 1.1 #11 and 1.2 #11 are True. 16 (Rhea step 3): FIXED.
- Still open from v2: 13 (case-study frame), 17-19 partly (see LOW).

## HIGH
None.

## MEDIUM
1. C7SC-1.2 #20 (5 marks, Evaluate/Hardest): both halves are lookups of two book sentences ("ice melts into water" in the changes list; "ice cube in a glass, or a glacier" under how heat flows). Hardest/5 marks for recall; the only reasoning is picking which topic the glacier belongs to. Fix: ask the student to decide which topic a new example (for example a kulfi melting on a hot day, a candle burning down) belongs to, with reasons for each topic it could touch.
2. C7SC-1.1 repeated ideas: "confirming results can lead to more experiments" drives #3 (item 2), #4 (b), #8, #11, #12 (b), #16 (e); "stepping stones / step out of the book" drives #3, #4 (a), #5, #6, #10, #12 (a). About 11 of 21 items rest on two book sentences. This is far better than v2 and the chapter is a thin overview, but swap two or three for other lines of the chapter (Grade 6 look-back, the three kinds of deeper questions, the butterfly page numbers, "ideas in one area inspire another") to widen coverage.

## LOW
3. C7SC-1.1 #21 (mcq): stem says "Group B has recorded this" but no Group B exists in this item (leftover from the replaced case study). Remove the phrase. Distractors (pipe name, district rainfall, cleaning register) are off-topic, so the item is solved by elimination.
4. C7SC-1.1 #13 (mcq) is an "extra-claim" item whose key ("science has now ensured a sustainable world") is obviously absurd: easy in disguise despite Evaluate/Hard. Similarly 1.1 #6 (AR, "book and classroom alone are enough") and 1.3 #13 (true/false, "food alone is enough") are one-tell items.
5. C7SC-1.1 #8 (fill_blank 3x2x5 = 30, correct) and 1.3 #6 (13 pebbles, correct), 1.3 #8 (0.25 and 0.4 m per count, correct) need almost no chapter knowledge; their only chapter link is a label (1.3 #8 b is a 1-mark lookup).
6. C7SC-1.1 #4 (b) / #5 key step says new questions come "to the person who does the experiment, not to one who only reads": an inference beyond the book. Soften to what the book says (even confirming experiments may lead to more questions).
7. C7SC-1.1 #17 (Mysuru) key (d) says steel-served Sports Day "gave only about 4.4 per 100 visitors", but the no-event weeks already show 35 and 45 cups, so Sports Day's 40 is not above baseline and the steel inference is shaky. Either say so in the key or drop the no-event weeks from the stem. (a) 40/900 = 4.4 and 90/400 = 22.5, (d) 500x60 = Rs 30,000, 1,500x6 = Rs 9,000 (about 3.3 years) are correct.
8. C7SC-1.1 #3 (match): item 3 (school tests a reusable-cup scheme) also loosely fits "d. activities and experiments are stepping stones". Keyed 3-a is best fit and the match is one-to-one, but make item 3 clearly about the environment.
9. C7SC-1.2 #12 (well): "village near Dehradun ... 400 km from the sea" is geographically wrong (Dehradun is about 1,000 km from the nearest sea); say "a village far inland". Arithmetic correct (1.5 m per month; 6 + 1.33 = 7.3 m). (d) key leans one way (limit pumping); Ramesh is a weak foil.
10. C7SC-1.2 #1 (mcq) and #6 (mcq): wrong options are absurd ("batteries hold water", "never falls on land", "certain") so both are solved by tell-words; keys are correct.
11. C7SC-1.2 #10 (fill_blank): "10 times more slowly" is fine (150/15 = 10) but "10 times as slowly" and "9 times more slowly" readings exist; accept 10 only if the stem fixes the wording ("... at 1/__ of the rate").
12. C7SC-1.3 #4 (case study): (a) mean 6.25 and A, C above; (c) D is 1st by height (154) and 3rd by growth (4 after C 11, A 8) are stem-only calculations; (b) is recall. The frame (a) fact/arithmetic, (b) lookup, (c) arithmetic, (d) "either with reasons" is shared with 1.1 #17, 1.2 #4, 1.3 #16 (v2 item 13): vary one case study to have no costs.
13. C7SC-1.3 #16 (case study): (b) correcting the Principal is a book lookup; the full reprint (Rs 600) is over the Rs 400 budget, so the live choice is only stamp+reprint (Rs 310) versus stamp alone. Numbers correct (150 + 80x2 = 310; 600 - 310 = 290).
14. C7SC-1.3 #18 key (b) "the chapter keeps the word eclipse for shadows cast by the Earth and the Moon" over-reads the book, which says only that the Earth and the Moon can cast shadows leading to eclipses. Reword to "the chapter names only the Earth's and Moon's shadows as leading to eclipses". 1.3 #20, #8, #9, #2 all revolve around the time/speed pair (four items); #20 (a) is answerable without the chapter.

## Checks that passed
- multi_statement keys (recomputed): 1.1 #14 "1 and 3 only" (S2 false), 1.2 #21 "2 and 3 only" (S1 false: the book does not list ice melting as irreversible), 1.3 #10 "2 and 3 only" (S1 false, "only"), 1.3 #21 "1 and 2 only" (S3 false). All keys correct; all four use three statements (known bank-wide 2-statement inconsistency recorded in CLAUDE.md, left as-is by owner decision); tell-words "only"/"stay separate" in 1.1 #14 S2 and 1.3 #10 S1.
- assertion_reason keys: 1.1 #6 "A true, R false"; 1.2 #7 "A false, R true" (the book puts changes before heat flow, so A is false); 1.3 #5 "both true, R not the explanation". Varied and correct.
- true/false: 1.1 #11 True, 1.2 #11 True, 1.3 #2 False, 1.3 #13 False. Balanced.
- Facts match the book (sour fruits, haldi stain, lamp glow/metals, torch battery, changes list, ice cube/glacier, Sun evaporating seas and rain trickling "somewhere far away", life processes, "perhaps", time questions, shadow-time, light questions, eclipses, day and night, three movements, Activity 1.1 not used, butterfly/paper plane).
- Calculations all correct: 30; 3; 4.4/22.5/Rs 30,000/Rs 9,000; 1/3, Rs 270/200/400 (glass needs 6 refills over 100 min, box 2), 10; 1.5 m/month and 7.3 m; 3 times; 6.25 cm; 13; 0.25 and 0.4; Rs 310 vs Rs 600.
- No option is named by position; no item depends on an "above/below" reference; no scope-out content used.
- Slot mix identical in type per concept (1 match, 1 fill_blank, case studies, 5-mark long answers); AR/MS spread is 1.1 and 1.2: 1 AR + 1 MS; 1.3: 1 AR + 2 MS (minor imbalance).
