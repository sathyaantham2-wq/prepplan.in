# Review v3: class8sc ch03 (Health: The Ultimate Treasure, hecu103) - after one fix pass

Pack: `content/authoring/dps/class8sc/ch03.json`, 127 questions, 6 concepts. Pre-edit copy compared by text: 59 items
changed (3.1: 8, 3.2: 9, 3.3: 4, 3.4: 10, 3.5: 15, 3.6: 13). Every changed item read; every number recomputed in python;
every fact checked against `content/extracted/hecu103/pages/001-018.txt` (book pages 28-45). Mechanical checks run on all 127.
Index convention: `3.k/qN` = concept C8SC-3.k, question N counted from 0 in the current file order.
Note: the caller's "3.6/q11 (virus)" and "3.6/q17 (test design)" are, in the current file order, 3.6/q8(b) and 3.6/q11.

## v2 status (all five checks)

- 3.5/q0 (c): FIXED. Now "neither protected nor already ill"; key B and E only. (a) A and D, (d) B and E. One answer.
- 3.3/q8: FIXED. Now "reached the patient through a mosquito bite": 6 dengue + 3 malaria = 9. Typhoid and cholera are
  food/water, so 18 is no longer defensible.
- 3.4 Nashik case (now 3.4/q4) (d): FIXED to "diet advice most directly removes the cause": K (goitre, a lack of nutrients).
  Small residue in LOW 1.
- Activity 3.5 (Table 3.2 diabetes symptoms, obesity change) and Activity 3.7 facts: FIXED. A search of all 127 items finds
  no urination/thirst/slow-healing/obesity-change content; "prescribed" now appears only as stem set-up (3.6/q6, q9, q16, q18),
  and the "finish the course" idea is carried by Fig. 3.5(a) ("incomplete dose"), which is main text. Residue in LOW 4.
- Also fixed and checked: 3.5/q15 old "living germ" claim (now 3.5/q14, "whole germ", partly right, correct); 3.6/q16 Sharma
  steps (now two clearly different routes); strawman decisions replaced by real trade-offs in 3.2/q8, 3.3/q10, 3.3/q20,
  3.4/q14, 3.4/q19, 3.5/q0, 3.5/q21, 3.6/q6.

## HIGH (0)

None. Every changed key recomputed or verified against the page; each has exactly one defensible answer (see notes below
for the near-misses). No new wrong key, no arithmetic error.

## MEDIUM (7)

1. **3.6/q11 (Fleming, 5 marks, parts b and c) - beyond the book, narrow rubric.** The book says only that Fleming
   "noticed that a mould ... stopped the bacteria from growing" and "realized the mould released a substance". Parts (b) and
   (c) (3 of 5 marks) ask the student to design a control experiment (mould-free liquid on fresh bacteria plus a plain-liquid
   control). The chapter teaches no method, so the design cannot be answered from it, and the rubric accepts only one design
   (filtrate plus control); a valid alternative (substance on a paper disc, mould kept behind a barrier) would lose marks.
   Fix: either drop (b)/(c) and ask for the inference, the ring's meaning and the resistance prediction (a, d) with a larger
   share of marks, or add "any fair test that keeps the mould away from the bacteria while the substance reaches them, with a
   comparison dish" to the rubric and state in the stem that the student may use ordinary lab reasoning.
2. **3.6/q8(b) - judged ACCEPTABLE, note only.** "Antibiotics do nothing against influenza because a virus is not a bacterium,
   so there are no bacterial cell parts to attack." This is the book's own "because" clause (p.39: they work only against
   bacterial infections *because* they target parts of bacterial cells unlike ours) and the end-of-chapter Q9 asks exactly for
   the reason. It is an inference but a one-step one the book supports; keep. (Listed so the owner sees the judgement.)
3. **3.5/q7 (fill_blank 3, Riya's vaccines).** The answer is read off the stem ("measles, polio, tetanus, and no others" gives
   3); no chapter fact or reasoning is used (typhoid and influenza are distractors with nothing to decide). Recall of a stem
   number under an Apply label. Fix: give vaccine names the student must map to disease from the chapter, e.g. "She had a
   dose of an inactivated bacterial toxin, a dose made from weakened measles virus and ... how many of the five conditions
   are bacterial?", or replace the item.
4. **Easy-in-disguise remnants (answer is one book line).** 3.4/q6 (stem lists the book's four causes; answer "Diabetes"),
   3.5/q1 (immunity differs between people, p.37 sentence), 3.6/q13(b) (lists the book's effects: harder to treat, prolonged
   illness, complications, death), 3.4/q12 and 3.6/q20 (5 marks each, a re-telling of chapter points; 3.6/q20 is a template
   of five fixed topics). Not wrong, but under the "no easy items" rule. Fix: for q6 and q1 add a distinguishing twist
   (a second plausible disease also fitting part of the stem; a pair with a different gap); for q12/q20 ask for a ranking or a
   choice that needs the facts, not their listing.
5. **Leading or still-lopsided final decisions.** 3.5/q20(c) says "Using 'Prevention is better than cure', decide" (the
   answer is handed over; options are vaccination vs adding beds); 3.6/q17(d) (buy a third antibiotic for every patient "to
   be safe") has no argument in its favour. 3.5/q21(c) is fine in content but the water plan also protects the 50 children,
   so it dominates. Fix: remove the quoted phrase in q20(c); give q17's plan a real merit (e.g. the ward has a second,
   unrelated infection the new drug also treats).
6. **3.4/q14(c) (Bhopal canteen vs games).** The rubric (2 marks) requires choosing the canteen change because the eating gap
   (62 points) exceeds the exercise gap (50). That is a judgement, not a fact: the totals are equal (16 of 40 students
   each), and a student who picks the games period and weighs both gaps has a defensible answer yet loses the marks. Fix:
   mark "either choice, with the survey figures used and the other option's case acknowledged".
7. **3.5/q15(b) (Jenner, hypothesis test).** The student is asked to describe deliberately exposing a person to smallpox as a
   test. The book narrates this historically; as a task for a 13-year-old it invites an unethical human challenge test, and
   no safety or consent note is given. Fix: ask "describe the test Jenner did and what result supported his hypothesis" (the
   book's own Think-like-a-scientist panel) or add "(this is how it was done in the 1700s; today it would not be allowed)".
   Related wording issue: **3.3/q19** stem says "his stool shows bacteria"; ordinary stool is full of harmless bacteria, so
   this is medically loose. Change to "a lab test of his stool finds cholera-causing bacteria" (still one answer; keeps cholera
   as "diarrhoea and dehydration").

## LOW (9)

1. **3.4/q4(d)** (Nashik, diet advice). The book says asthma too is "linked to lifestyle, diet and/or environment", so L
   is faintly arguable; "most directly remove the cause" and the goitre-as-deficiency wording keep K as the single answer.
   Also (b) accepts only TB in the rubric; add "any communicable disease from Table 3.1 with cough and fever (TB, influenza)".
2. **3.2/q13 (fill_blank "environment")**: "surroundings" or "air" are equally right; list accepted variants or the word
   will not match them.
3. **3.1/q10(ii)**: the diary order shows a sequence, not cause; the key says the problem "began in social, spread to mental,
   then physical". Reasonable (book Activity 3.1 narrates this) but say "may show" in the rubric.
4. **3.2/q10, q12, q13, q15, q17(AQI sentence), q19**: the AQI definition sits inside Activity 3.3 bullets (scope_out names
   "Activities: ... compare"). Same status as v2 MEDIUM 9, not fixed or decided; the bullets read as chapter text and fall
   inside the scope_in 29-31 range, so I accept, but the owner should confirm the rule once.
5. **3.4/q5**: the 11.4% diabetic figure is from the news-clipping montage on p.28, which is before the scope_in range
   (29-42); the arithmetic is right (285 exactly).
6. **3.3/q20 stem**: dengue goes 4, 7, 14, 28; the first step is not a doubling, while the stem says "both diseases are
   doubling". The question only uses the later doubling; say "from week 2 on, both double".
7. **3.5/q16 and 3.5/q3 distractors**: "Smallpox germs slowly weakened into cowpox" and similar are absurd rather than chapter
   confusions (v2 LOW 4 only partly acted on).
8. **Case-study arithmetic parts**: each case now has one pure-arithmetic part (3.2/q20(c), 3.4/q14(a), 3.5/q21(a), 3.6/q6(a),
   3.1/q18 gaps). Acceptable, one per case, and each case climbs to a chapter-based decision.
9. **3.2/q11 and 3.4/q8 (true_false)**: both are True. 3.4/q8 has a real misconception; 3.2/q11 is a near-verbatim book
   sentence with the trap in the neighbour's loneliness stem. Fine, but the pack has 3 True / 3 False; keep.

## Per-concept verdict

- **C8SC-3.1 (20 q)**: pass. Arithmetic (47.5%, 15/9/7, 19 feasible with the marginals) correct; steps match marks.
- **C8SC-3.2 (21 q)**: pass. 3 signs, 3 students with a sign, 34 hours and 2 per day recomputed; breakfast skipped 4 days; fine.
- **C8SC-3.3 (22 q)**: pass after the wording fix to q19 (stool). q8 = 9, q10 diseases (typhoid, malaria, measles, hepatitis A)
  match Table 3.1 exactly, q20 56/16 correct.
- **C8SC-3.4 (21 q)**: pass after MEDIUM 4 and 6. 285, 83%/21%, 2/0/2 causes recomputed.
- **C8SC-3.5 (22 q)**: pass after MEDIUM 3, 5, 7. 54%, 2%, B and E, key spread of the MS item correct.
- **C8SC-3.6 (21 q)**: pass after MEDIUM 1 and 5. 15 tablets, 6 taken, 40%, 9 left = 3 days confirmed.

## Counts read

- Read: 127 of 127 for mechanics; 59 changed items read in full and recomputed.
- Mechanical checks (all 127): correct option at o[0] and no wrong option equal to the key in every option item (45 of 45);
  no option named by position; step marks sum to marks in every item with steps; correct-is-longest 12 of 45 (27%,
  close to the 25% chance rate, not a tell).
- multi_statement: six items (3-statement), six different keys (1 and 3; all three; 2 only; 2 and 3; 1 only; 1 and 2).
  assertion_reason: six items, four different verdicts. claim_check: 8 items, wrong/no 4, right 2, partly 2.
  true_false: 3 True, 3 False.
- Slot order: now different in all six concepts (case studies at 1, 8, 10, 4/14/19, 0/21, 6/17 positions); the v2 template
  complaint is resolved. Bloom: Analyse 73, Evaluate 23, Apply 20, Create 8, Understand 3; Hard 96, Hardest 31, no Easy.
- Medical and health claims checked: tetanus toxoid, vaccines preventive not curative, antibiotics against bacteria only,
  resistance as a change in bacteria, diabetes not curable by one course, hepatitis A boiled water and vaccine: all accurate and
  taken from the book; only the stool wording (MEDIUM 7) and the human challenge test (MEDIUM 7) need touching.

## Verdict

**Not yet load-ready, but close: 0 HIGH, 7 MEDIUM, 9 LOW.** Fix 3.6/q11 (b)-(c) and 3.3/q19 wording, tidy 3.5/q15(b), 3.5/q20(c) and
3.5/q7; the rest can go either way. After those edits the chapter is load-ready.
