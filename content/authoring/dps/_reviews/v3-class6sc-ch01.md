# Review v3: dps/class6sc/ch01.json (Class 6 Science, ch1 The Wonderful World of Science)

Read: 122 questions (6 concepts, every one; every item compared with the pre-edit copy, about 80 changed or new).
Textbook: fecu101 pages 001-008. All 12 case studies recomputed in python, plus the long-answer and fill_blank arithmetic.
Programmatic checks, all clean: correct option at o[0] in 46 of 46 option items; four distinct options each; every `s` step list sums to `m`; no positional option reference; no Easy/Remember; one `rev` per concept.

## v2 status
- M1 (1.3 held 21): fixed, 1.3 now 20. But 1.2 and 1.4 now hold 21 (loader accepts 20-24; bank convention is 20). See LOW 7.
- M2 repeated ideas: mostly fixed. "Earth the only planet we know" now 2 items (mcq, Differentiate); "a wrong guess is not a failure" 2 (mcq, true_false); Dhruv duplicate gone; "anyone who follows the method is a scientist" about 5. Residue in MEDIUM 4.
- M3 recall in disguise: mostly fixed (new fill_blank, stall/newsletter/letter items, Activity 1.3 long answer, sort item replaced by a borderline sort, sequence-recitation long answer gone). Residue in MEDIUM 5.
- M4 (3-mark sort): fixed, replaced by 1.3 idx 15 with borderline items.
- M5 case-study template: partly fixed. Every (d) is now a decision with something at stake and most are fair, but (a)/(b) are still stem arithmetic in 11 of 12 (see MEDIUM 3).
- M6 slot template: fixed. Slot order differs in all six concepts; MS keys 1+3, 2, 2+3, all, 1+2, 3 (six different); AR verdicts both-explain 2, both-not 2, A true R false 1, A false R true 1; claim_check Partly 2, Yes 2, No 2; correct option longest 9 of 46 (20%).
- v2 LOWs: 1.3 reversal tagged (done); 1.1 "ocean depths" key, Zoya claim, Meera key, 1.6 revision strawman, 1.2 Headline P: all replaced (done). NOT fixed: "analyze" variant for 1.4 fill_blank. The 1.4 long answer B ambiguity was replaced by a new, worse one (HIGH 1).

## HIGH
1. C6SC-1.4 idx 19 (four stopped-pen write-ups), part (i) and (iii): "(i) Which step does A miss? ... A has no test." A ("The pen stopped. I think the ink is finished. So the pen is bad.") also states no question, and part (ii) itself treats a missing question as a skipped step (B). So "question" is a second defensible answer to (i). Likewise (iii) "What is D missing? ... no test": D has no observation of the pen and no analysis either. Fix: ask "(i) A reaches a conclusion. Which step, put in before it, would show whether A's guess is right?" and "(iii) D lists three guesses; what must D do before it can choose between them?" Keep the key "test".
2. C6SC-1.5 idx 9 (electrician's log of 20 calls), part (v): "Which step of the method is it when he looks over the log of 20 calls to decide what to test first? ... Analysis." Choosing what to test first is choosing a guess; the chapter's analysis step is "analyse the results [of the test] to see if it answers our question". A log of past calls is not the result of this call's test, so "guess" is as defensible as "analysis" (and the stem for (iii) already calls it a guess). Fix: reword (v) to "After he fits the new bulb and the light comes on, which step is it when he decides the bulb was the fault?" (key: analysis).
3. C6SC-1.1 idx 16 (four learners), part (i): "Who is showing curiosity at work? ... Meera." Aman "asks 'why' about everything" is also showing curiosity (part (iv) itself says "if curiosity is to lead to answers" about Aman). Second defensible answer, carried over from v2 (not caught there). Fix: "(i) Who observes something closely and then asks why about it?" (Meera only) or accept "Meera and Aman" and move the single answer to (v).

## MEDIUM
1. C6SC-1.6 idx 5 (Why? Club case study), part (d): the stem says the 6 open questions are "still open after both the solo try and a group session", yet the key argues "each of the 6 has already been tried alone ... groups answered 15", ignoring that the group route has also failed on them. Both "more solo reading" and "more group sessions" are then defensible. Fix: say the 6 were tried alone only and have not yet gone to a group session (and change "(b)/(a)" figures accordingly: 9 solo, 15 group, 6 open stays 30), or add "the club's own record: groups answered 15 of 21, solo 9 of 30" to the stem so the data decide.
2. C6SC-1.4 idx 17 ("a test that is only 'more observations' and uses no apparatus"): the key example, "watching a drooping plant for a day after watering it", involves watering, which is an intervention (an experiment), not observation only. Fix key to e.g. "looking closely at the refill against the light tests the guess that it is empty" or "watching a cup of tea for 10 minutes tests the guess that it cools fastest at the start".
3. Case-study frame (all 12; counts): parts (a)/(b) are answered from the stem alone in 1.1 idx 12 (a), 1.1 idx 19 (b), 1.2 idx 12 (a), 1.2 idx 20 (a)(b)(c), 1.3 idx 9 (c), 1.3 idx 19 (a), 1.4 idx 11 (a)(b), 1.4 idx 20 (a), 1.5 idx 4 (a), 1.5 idx 19 (a)(b), 1.6 idx 5 (a)(b), 1.6 idx 16 (b). Worst: 1.5 idx 19 (bulb/switch repairs and budget): the chapter is needed for nothing except the setting; (c) is a budgeting problem (cheapest first, both plans light 11 rooms, "Yes" is a tie). 1.2 idx 20 (notebook costs) likewise: Rs 1,400 exactly fits Notebook B, a numeric trick rather than the chapter. Fix: in 1.5 idx 19 and 1.2 idx 20, replace one arithmetic part with a part that uses the method (e.g. "which step does moving the bulb to a working holder carry out?" / "which answers show a piece moved, which show a new piece?") and drop the budget trick.
4. Residual repeats within concepts: 1.2 "a wrongly placed piece is moved" in about 9 items (idx 0, 1b, 5, 9a, 12, 13 S1, 15, 17, 19) and "each piece leads to more questions" in about 7 (idx 3, 5, 8, 10, 14, 18, 19); 1.5 dal-spill in 6 items (0, 1, 4, 13, 14, 15) and the bulb/switch electrician in 6 (2, 9, 10, 18, 19 and the stems), the "bulb in a working holder" test three times (2, 18, 19); 1.4 "name the step this note is" in 6 items (0, 2, 3, 4, 9, 18). Fix: in 1.2 recast two of the moved-piece items onto "ideas are connected" or "useful in daily lives"; in 1.5 swap two dal/electrician items for the tyre or a fresh case.
5. Recall in disguise remaining (answer is one stated line):
   - 1.3 idx 17 (Divya, "Is the friend right? Which line settles it?"): the answer is the quoted line "Why limit our questions to the Earth alone?". Labelled Evaluate/Hardest. Fix: drop part (b) and ask the student to judge two new questions (one about the Moon, one about rain) against the preview with a reason.
   - 1.3 idx 10 (b): "Write the two questions the preview asks about dishes" is a quote; 1.3 idx 5 (v) quotes the same line as idx 17 (two uses).
   - 1.6 idx 15 (show_impossible): first idea is "you will not find answers to all your questions in Grade 6", which is the conclusion itself (circular). Fix: base the argument on "new knowledge raises more questions" and "no limit".
   - 1.1 idx 17 (a): "What does the chapter say about where discoveries have often come from?" is a one-line lookup.
6. C6SC-1.6 idx 2 (fill_blank, answer 4) and 1.3 idx 5 (i)-(iv) and 1.4 idx 11 (a)(b) are pure percentage or subtraction from the stem; the "chapter's advice" in the 1.6 stem (keep unanswered questions for later years) is a loose paraphrase, since the book says only not to worry. Fix: make the fill_blank choose a step or a quoted idea (e.g. a word the method needs) so the chapter is needed.

## LOW
1. C6SC-1.1 idx 2 option and key conflate: "important discoveries have often come from unexpected places like the kitchen". The book lists the kitchen under "everywhere" and says groundbreaking discoveries come from "unexpected places" separately. Reword key to "science is everywhere, from the kitchen to the playground, and important discoveries often come from unexpected places".
2. C6SC-1.4 idx 3 fill_blank answer "analyse": add "analyze" as accepted.
3. C6SC-1.3 idx 15 (iii) "idli batter ... made of": a student could file it under materials ("what are they made of?"); the book asks it of dishes, so key is right, but add "dish" cue or remove the "watch out" line for (iii).
4. C6SC-1.5 idx 16 (b) "Which person in the chapter does she most resemble": open choice; the cook is best, the electrician (changing one part and watching) is also arguable. Reword to "which of the chapter's examples changes one thing and watches".
5. C6SC-1.5 idx 17 (i): Bina's question is not stated in the stem, yet the key lists it as a step she carries out. Add "She wonders where the air is escaping" to the stem.
6. C6SC-1.2 idx 11 and 1.3 idx 14 (true_false with answer True): little misconception to catch. Two of six; better to make these False with a correction.
7. C6SC-1.2 and 1.4 hold 21 questions (loader accepts 20 to 24; bank target is 20). Drop 1.2 idx 18 or 1.4 idx 13 if exactly 20 is wanted.
8. C6SC-1.6 idx 10 Rule 4 ("every member brings one 'why' question a week") "agrees" is soft; the chapter does not require a quota. Fine, but a pupil saying "neither" is reasonable; reword to "...writes a how or why question each week".
9. C6SC-1.1 idx 19 and 1.3 idx 19 (d) lean one way (strongly pro-curiosity / pro-environment); acceptable, but give the other side a real stake (e.g. the playground is needed for 200 children).

## Scope
No scope_out line violated: no scientific explanation of stars, flowers, freezing or ink; no Chapters 2-12 content beyond the preview; no photograph items; no Do you know boxes. Activity 1.3 (1.6 idx 19) is on page 7, inside scope_in. Invented tests and numbers (rough paper, bulb in another holder, pickle jar) are student applications, not given as book facts. No claim beyond the pages found.

## Per-concept verdicts
- C6SC-1.1: not load-ready until HIGH 3 is fixed.
- C6SC-1.2: load-ready after MEDIUM 3 and 4 (no HIGH).
- C6SC-1.3: load-ready after MEDIUM 5 (no HIGH).
- C6SC-1.4: not load-ready until HIGH 1 is fixed.
- C6SC-1.5: not load-ready until HIGH 2 is fixed.
- C6SC-1.6: load-ready after MEDIUM 1 (no HIGH).

## Counts read
122 questions: 31 mcq, 6 multi_statement, 6 assertion_reason, 3 fill_blank, 3 match, 48 short_answer, 25 long_answer (12 case studies); 46 option items checked for o[0]. Per concept 20/21/20/21/20/20. HIGH 3, MEDIUM 6, LOW 9. Templating: slot order now varied, keys and verdict mixes spread; residual idea repeats in 1.2, 1.4, 1.5 only.

Verdict: NOT load-ready (3 HIGH, all small rewording fixes to one sub-part each). After fixing HIGH 1-3 and MEDIUM 1-2, the chapter would be load-ready.
