# Review: class8sc ch03 (Health: The Ultimate Treasure, hecu103) - first review

Pack: `content/authoring/dps/class8sc/ch03.json`, 127 questions, 6 concepts. Every question read; every number recomputed in
python; every fact checked against `content/extracted/hecu103/pages/001-018.txt`.
Index convention: `3.k/qN` = concept C8SC-3.k, question N counted from 0 in file order.

## HIGH (1)

- **3.5/q0 (case study, Shimla measles records), part (c).** "Which students have no acquired immunity to measles at all?"
  Key: "B and E (C is ill now...)". C has not been vaccinated and is sick right now, so C also has no acquired immunity
  (protection developed after exposure has not yet developed; that is why C is ill). B, C, E is equally defensible.
  Part (d) leans on the same reading. Fix: change (c) to "Which students are neither protected nor already ill?"
  (answer B and E), or word (c) "who is still unprotected AND well", and keep (d).

## MEDIUM (14)

1. **3.3/q8 (fill_blank, 9).** "whose pathogen was carried by an insect". The book (p.33) says houseflies are vectors
   that spread pathogens, and cholera/typhoid are food-and-water diseases that flies are known to carry, so 4 + 5 + 9 = 18
   is also defensible. Fix: "...that the chapter's Table 3.1 lists under diseases transmitted by insects".
2. **3.4/q18 (case, Nashik record), part (d).** "someone whose disease needs continuous care over a long time". The book
   says therapy for non-communicable diseases rests on early diagnosis and continuous care, and goitre (patient K) is a
   non-communicable deficiency disease, so K is defensible; L wins only because a duration is given. Fix: ask "whose
   disease the record shows has lasted more than three months", or give K a duration of a few weeks.
3. **Strawman or leading final decisions, case studies.** The "only one option" part (d) is obvious from the data in:
   3.1/q18 (health-tips app vs buddy group for a lonely girl; the stem and Activity 3.1 already say screens made it worse),
   3.1/q19 (6 vs 14 vs 10 "no" answers), 3.2/q0 (send the girl with a rash back to class), 3.3/q20 (nets vs water treatment
   for jaundice beside an open drain), 3.3/q21 (emptying coolers vs a handwashing drive when only dengue is rising),
   3.4/q19 (test the man with 3 causes and symptoms), 3.4/q20 (change the canteen vs one talk), 3.5/q0 (exactly two
   doses, exactly two unprotected children), 3.5/q21(d) ("the vaccine is useless" after 2% vs 54%), 3.6/q19 (use leftover
   and last year's tablets), 3.6/q20 (buy more of antibiotics the bacteria already survive vs handwashing). Almost none has
   a real trade-off the data supports both ways. Fix: for at least four of these, give the weaker option a real argument
   (e.g. a second disease also rising, a cost that favours it) so the student must weigh, not eliminate.
4. **Case-study parts that do not need the chapter.** Pure arithmetic or reading the stem: 3.2/q18 (b),(c); 3.3/q21 (b);
   3.4/q20 (a),(b); 3.5/q21 (a),(b); 3.6/q19 (a),(b); 3.1/q19 (c); 3.3/q20 (a) is given away by "boil water". Each of those
   cases then climbs weakly (two or three computation marks, one chapter mark). Fix: replace one arithmetic part per case
   with a part that needs a chapter fact (classify, predict a route, name the measure).
5. **Templating (counts).** Slot order is almost identical in 5 of 6 concepts: 4 or 5 scenario mcq, multi_statement,
   assertion_reason, match, fill_blank, true_false, 4 or 5 two-mark short answers, 1 claim_check, 1 short, 3 long_answer,
   then 1 to 3 case studies (concept strings in order: `mc mc mc mc mu as ma fi TF sh sh sh sh CC sh lo lo lo CS CS` for
   3.1; 3.4 and 3.6 differ only by one swap). Ten of 12 case studies end "the budget allows only one of X or Y: decide".
   The 1-mark block is always the same 8 slots. Fix: move the case study, the match or the assertion_reason to different
   positions per concept, and give at least two case studies a final part that is not a two-option choice (rank, redesign,
   spot the flaw in a plan).
6. **True/False items with no misconception.** 3.2/q10 ("balanced diet and clean place and still not feel good") is a
   verbatim book sentence, True; 3.5/q10 ("vaccination protects the people around you") is a verbatim book sentence, True;
   3.4/q9 ("disease for years without catching it") is a restatement of "chronic NCD". These three are recall with a verdict
   (3 True of 6; mix of verdicts is fine, but the Trues carry no trap). Fix: make each True rest on a tempting wrong
   reading (for example 3.5/q10: "A vaccinated child is safe, so unvaccinated children around her gain nothing").
7. **Easy in disguise (answer is one line the book states, under any Bloom label).** 3.2/q1 (sign vs symptom), 3.5/q2
   (tetanus shot contains an inactivated toxin), 3.5/q5 (Dadi: vaccines are for all ages), 3.6/q1 (antibiotic targets
   bacterial cell parts), 3.5/q1 (immunity differs between people), 3.4/q12 (both parts are lists: NCD examples, three changes
   in living), 3.5/q12 (list ways vaccines are made, toxin inactivated), 3.6/q12 (name resistance, list four effects),
   3.3/q13 (two reasons from a single sentence on resting at home), 3.4/q15 (three points from one paragraph on NCD
   therapy), 3.5/q14 (two sentences answering fear of vaccines), 3.5/q19 and 3.5/q20 (Jenner box and "five points about
   vaccines", a re-telling of the chapter, 5 marks each), 3.6/q17 (a),(b),(c) restate the stem or the box. Fix: for the
   1-mark ones add a stem premise the student must reason from (a lab result, a timeline, a comparison); for the 2 and 5 mark
   ones, ask for a judgement that uses the facts (rank, predict, choose with a reason) not a list.
8. **3.5/q15 (claim_check, "every vaccine contains a living germ").** The verdict "partly right" rests on weakened
   pathogens being "living germs", which the book never says (it says "weakened or dead pathogens"). Claim beyond the book.
   Fix: change the claim to "every vaccine contains the whole germ" (partly right: weakened/dead whole pathogens, but
   others are parts, toxins or instructions) or state the premise in the stem.
9. **Facts that sit inside scope_out activities.** Scope_out lists activities "list/compare/survey/find out/infer/read".
   The Table 3.2 diabetes symptoms (frequent urination, excessive thirst, weight loss, tiredness, slow healing) and the
   obesity lifestyle change (balanced diet and exercise) are prefilled inside Activity 3.5 (survey): used by 3.4/q3,
   3.4/q11(b), 3.4/q19(c), 3.4/q16. The prescription/correct dose/right duration advice and Figure 3.5(b) are inside
   Activity 3.7 (infer): used by 3.6/q10, 3.6/q18, 3.6/q19(d). The AQI and dirty-playground text sits in Activity 3.3
   (compare): 3.2/q2, q3, q9, q17. (The scope_in line names Table 3.1, which is also inside an activity, so the author may
   mean the embedded content to count.) Fix: confirm the scope rule; if embedded text is out, keep only items that also have
   a free-text source (sec 3.2.2 text, 3.3 text, 3.5.1 text); if in, add those pages to scope_in.
10. **3.1/q15 (Ira diary), part (i).** Week 2 "scrolling my phone till 1 a.m." is mental per the key but equally shows the
    physical aspect (lost sleep, which the book lists as an unhealthy habit); the key notes both. Fix: change the entry to
    something purely mental ("I feel low and cannot enjoy anything now") or accept either aspect in the rubric.
11. **3.4/q19 (diabetes screening), parts (a) and (d).** The key says Shah shows "3 of the 4 lifestyle-related" causes, but
    the book lists three lifestyle causes (eating habits, inactivity, overweight) plus hormonal imbalance, so "of the 4"
    mixes types; and Patel is scored 1 although his yoga/diet is protective, which is fine, but (d) is a strawman (Shah).
    Fix: "3 of the 3 lifestyle causes"; make Patel less clean (e.g. overweight with a family history is out of scope, so
    instead give him the same weight and sweets but daily walking) to create a real choice.
12. **Repeated ideas inside a concept (same reasoning tested again and again).** 3.1: "no illness is not complete health"
    in q1, q5, q7, q8, q10, q13, q14, q16, q18 (nine items), and "moved to a new school and became lonely" in q1, q10, q15,
    q18. 3.5: "vaccines are preventive, not curative" in q0(b), q3, q7, q17, q20, q21(c) (six items). 3.6: "unneeded or
    incomplete use breeds resistance" in q3, q10, q14, q15, q18, q19, q20. Fix: replace at least two items in each of
    3.1, 3.5 and 3.6 with a distinct sub-idea (3.1: the three aspects interacting; 3.5: immune memory and second exposure;
    3.6: why antibiotics spare human cells).
13. **3.6/q16 (Sharma family).** Steps 2 and 3 overlap ("patients go home and spread in the community" then "from the
    community to the family"); the book gives no third distinct step, so the rubric cannot separate them. Fix: ask for two
    routes (human and animal/crop) or give a third distinct clue in the stem.
14. **3.6/q17 (Fleming).** Five marks, but (a) is the stem restated ("the mould stopped the bacteria from growing"), (b) is
    "chance" read off the book's wording, (c) and (d) are single recalled facts: recall in disguise at 5 marks. Fix: give
    the dish observation without the conclusion and ask for the inference plus what test would show the substance (not the
    mould itself) does the killing, within what the book says.

## LOW (9)

1. **3.2/q8 (fill_blank 3)**: "swollen glands" is not named in the book; swelling is a sign, so the count stands, but say "swollen neck" or "swelling".
2. **3.2/q9 and 3.5/q9 (fill_blank)**: Tuesday (lower AQI) and 1979 minus 1965 are one subtraction or comparison with the data in the stem; 3.5/q9 uses no chapter fact. Add a chapter reasoning step.
3. **3.4/q8 (fill_blank 285)**: "about ___" invites 284 or 290. Change to "exactly".
4. **3.2/q2, q3; 3.5/q1; 3.6/q3 distractors**: several wrong options are absurd ("Colony Q has fewer germs because clean grounds draw visitors", "leftover tablets will turn into a vaccine", "healthy people never cough"). They are not real chapter confusions. Replace with look-alike ideas (vaccine vs antibiotic, symptom vs sign, vector vs pathogen).
5. **3.2/q18 (Rahul log)**: 5 to 6 hours of sleep is called "not enough" with no standard in the book or stem; add "the chapter says to get enough sleep" or drop the claim. Also part (d) is leading.
6. **3.6/q9**: the correction adds "other people, animals and the environment"; the book names people, animal products, soil and crops. Drop "environment".
7. **3.1/q0**: the correct option is the only one with no problem listed; easy to eliminate. Make two options each fit one of the three aspects partly.
8. **3.2/q0 (register)**: part (a) answered by the stem column headings.
9. **3.4/q16**: the "limit" options include deficiency diseases and access to nutrients and "not in one person's control", which the book does not say; accept only the book's own limits (hormonal imbalance, living longer).

## Per-concept verdict

- **C8SC-3.1 (20 q)**: pass after fixes. Facts correct; arithmetic checks (2 ticks; 34 - 18 = 16; no-answers 6/14/10). Repetition and strawman decisions are the issue.
- **C8SC-3.2 (21 q)**: pass after fixes. Key correct (34 hours; (34 - 20)/7 = 2); several one-line recalls and activity-embedded facts.
- **C8SC-3.3 (22 q)**: pass after fixes. Table 3.1 facts all verified (matches, MS key "Statement 2 only", claim-check 3.15); fix the fill_blank wording.
- **C8SC-3.4 (21 q)**: pass after fixes. 285, 83%/21% correct; fix q18(d), Table 3.2 scope, and the true/false.
- **C8SC-3.5 (22 q)**: pass after fixes (one HIGH). 54%, 2%, 14 years correct; fix q0(c), recall-heavy long answers, "living germ" claim.
- **C8SC-3.6 (21 q)**: pass after fixes. 15 tablets, 40%, 3 bacterial diseases correct; strawman decisions and Activity 3.7 scope.

## Counts read

- Read: 127 of 127 (20, 21, 22, 21, 22, 21).
- Keys recomputed: all numeric items (2 ticks; 16; 3 signs; Tuesday; 9; 285; 14; 3; 54%/2%; 15/40%; 83%/21%; 34 h/2 h; 56 dengue; 3 antibiotic cases; 14 years). No arithmetic error. No wrong key. One part with a second defensible answer (HIGH 3.5/q0 c), two near-misses (3.3/q8, 3.4/q18 d).
- Correct option is o[0] in every option item (45 of 45) and no wrong option equals the key; correct-is-longest 2 of 45 (not a tell). No option named by position. Step marks match item marks everywhere.
- multi_statement keys: six items, six different keys (1 and 3 only, all three, statement 2 only, 2 and 3 only, statement 1 only, 1 and 2 only). Good.
- claim_check: 8 items: wrong/no 4, right 2, partly right 2. Good mix (3.1/q13 partly, 3.2/q16 no, 3.3/q14 right and q15 wrong, 3.4/q13 wrong, 3.5/q15 partly and q16 wrong, 3.6/q14 right).
- true_false: 6 items (3 False, 3 True); the Trues have no misconception (MEDIUM 6).
- Bloom: Analyse 61, Apply 30, Evaluate 20, Understand 9 (7%), Create 7; Analyse+ 69%. No Remember or Easy; difficulty 96 Hard, 31 Hardest. Within the limits.
- Case studies 12; reversal-style items and three-statement MS present in every concept.
- Templated: yes, moderately (slot order and the "decide A or B" final part); see MEDIUM 5 and 3.

**Verdict: pass after fixes** (1 HIGH, 14 MEDIUM, 9 LOW). No rewrite needed; fix 3.5/q0(c), reword 3.3/q8 and 3.4/q18(d), replace strawman decisions and recall-heavy long answers, resolve the activity-scope question, then vary the slot order.
