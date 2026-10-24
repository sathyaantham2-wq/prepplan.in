# Review v2: class8s Part I ch5 (hees105), first independent review

Pack read: content/authoring/dps/class8s/p1ch05.json, 8 concepts, 172 questions, every one read. Scope: content/authoring/class8s/p1ch05.json. Pages: content/extracted/hees105/pages/001.txt. All arithmetic recomputed in python or by hand; every fact checked against the page text.

Indexes below are 0-based within the concept.

## Counts read
- Questions: 172 (21,21,22,22,22,21,21,22). Key at o[0] equals `a` everywhere; no duplicate options; no option named by position; every step list sums to the marks.
- Wrong keys found: 0. Second defensible answer: 1 (5.6 q3).
- multi_statement keys (8): 1 and 3 only x2, then 2 and 3 only, all three, 2 only, 1 only, 3 only, 1 and 2 only: well spread. assertion_reason keys (8): explains 3, A true R false 2, not explain 2, A false R true 1: fine.
- claim-check verdicts (12): No 6, Partly 3, Yes 3: fine (5.2 q5 verdict is arguable, see below).
- Correct option longest in 7 of 40 MCQs (17.5%): fine.
- Case study 4-mark items checked: all arithmetic correct (37 ballots, 10.9%, 37.5%, 25/60%, 45.2%, 3,000 vs 2,000, 370, 38.3%, 776, etc).
- Fit to scope: no scope_out line violated. The "33" question: only 5.7 q2, q9, q13, q17 and 5.1 q14 / scope-in quote "12 of 33"; see MEDIUM 5.7 q2 and q9 for the two that compute from it.

## Slot-order check (template)
Six of eight concepts have the same skeleton: 4-5 scenario MCQs, then fill_blank, multi_statement, assertion_reason, match (or one more MCQ), then 9 short answers in a row (differentiate, true/false, claim check, show-impossible/reverse), then exactly four long answers, the last two being case studies. Strings: 5.1 MMMMFSAXs*9LLLL, 5.3 MMMMFSAMMs*9LLLL, 5.5 sXMMMFSAMs*9LLLL, 5.6 MMMFSAXMs*9LLLL, 5.7 LMMMMMFSAs*8LLLL, 5.8 MMMFSAMMMXs*8LLLL. Only 5.2 and 5.4 are shuffled. Fix: move the case studies and 5-mark items earlier in at least three concepts and vary the run of short answers.

Other template signs: the "spot the wrong lines in a poster/blog/diary and correct them" case-study frame is used in 5.1 q19, 5.2 q0, 5.3 q21, 5.6 q19 (four times); class-election tally with NOTA and unmarked ballots recurs in 5.4 q0, q6, q17, q21. The assertion_reason items in 5.4 q8 and 5.7 q8 pair two unrelated one-line facts and are keyed "R does not explain A" because the two have nothing to do with each other (see MEDIUM).

## HIGH

1. C8S-5.6 q3 (fill_blank): "each polling station served fewer than ___ voters." Key 968. Because the book says "over 1 million" stations, any larger number (970, 1000, 1,000) is equally true and equally natural. A machine cannot match it and a student answering 1000 is right.
   Fix: "Taking exactly 1 million polling stations, each station served about ___ voters on average" (answer 968).

## MEDIUM

2. C8S-5.7 q2 (mcq) "12 of the 33 votes, Ravi 10 and Ahmed 8 ... about 36 per cent": the stem's own figures sum to 30 (31 with the invalid ballot), so 12/33 = 36% is computed from the book's inconsistent total. A careful student gets 38.7% or 40%. The option set still has one defensible answer, but the item rests on the bad total.
   Fix: drop the percentage, say "12 of the votes, more than Ravi's 10 or Ahmed's 8, but fewer than half of all ballots cast", and key on "most votes, not a majority".

3. C8S-5.7 q9 (true_false) key: "12 of the 33 votes, so 21 classmates had chosen someone else or cast an invalid ballot." Using the caselet, the others are 8 + 10 + 1 invalid = 19, not 21. Fix: say "most of the class had chosen others" with no count, or "fewer than half".

4. C8S-5.6 q13, q19(d) and C8S-5.5 q21(c): the key says the first polling officer, "checking the name on the voter list against the ID proof", stops a person using a relative's ID. The book says only "Checks name on voter list and ID proof"; it never says the officer matches the face to the ID, and a relative's ID shows the relative's listed name. The finger-ink check of the third officer catches repeat voters, not impersonators.
   Fix: state the premise in the stem ("the officer also checks that the ID belongs to the person standing there") or ask which officer's stage deals with the voter's name and ID.

5. C8S-5.6 q19(b) (case study): "Step 2 as written leaves out two things the second polling officer does". Written Step 2 is the name check (the first officer's job). The key's gloss refers to "her Step 1 has the inking but not these". Part (b) as worded points at the wrong step.
   Fix: "After you put the steps in the right order, which two things does she leave out of the inking step?"

6. C8S-5.8 q21(d) key: "The new majority would choose 4 members in 2028, 4 in 2030 and 4 in 2032, so it would take three rounds to fill all 12." The chapter says Rajya Sabha voting is by single transferable vote (a fair-representation system, mechanism out of scope), so a majority does not simply choose every seat in a round. The stem's "assume it keeps that majority" does not make that safe, and the key goes beyond the book.
   Fix: key on "No, only 4 seats fall vacant in 2028, so at least three biennial elections are needed before every one of the 12 seats can change hands."

7. C8S-5.2 q5 (claim check, verdict "Partly right"): the claim is "the chapter supports universal franchise for just one reason, equality". The word "just" makes it plainly wrong; a student who says "No, there are five reasons" is marked down by the step "Verdict: partly right". Two defensible verdicts.
   Fix: change the verdict to No, or change the claim to "the chapter's main reason ... is equality, and it gives no others" with verdict No and keep the reasons.

8. C8S-5.4 q9 (match): 3-a/4-c (seal guards against changed ballots between voting and counting; witness guards against a doubted count) is the natural fit, but the swap 3-c/4-a is arguable: a sealed box also stops the count being doubted by those not in the room, and an outside witness also guards the ballots at the count. The "guards against" reasons are the author's, not the book's.
   Fix: sharpen Column B: "ballots being added or removed after voting closes" for the seal and "no one outside the class able to confirm the count was honest" for the witness.

9. C8S-5.4 q1 (mcq, Mysuru hand-raising): "Which feature of the Suryodaya election is missing here?" The stem says nothing about an Election Officer, an outside witness or a braille ballot, so those are also not shown in Mysuru. The key (secret ballot) is the only one hand-raising contradicts, but the question as put asks what is missing, not what is given up.
   Fix: "Which feature of the Suryodaya election does this method give up, whatever else is in place?"

10. C8S-5.4 q0 (case study, (b)): "which two steps ... make the discrepancy noticeable and on record rather than hidden" claims the sealed box and the witness make a missing ballot noticeable. The book gives no such function for them (the box prevents tampering, the witness watches the count); it is the 38 vs 37 comparison that reveals the gap. Also (d) "announce now" is the one decision; "hold until the missing ballot is looked into" is also defensible.
   Fix: make (b) "what does the total reveal and which step lets someone outside the class check the figures"; make (d) "can the missing ballot change who wins?" (a yes/no with reason).

11. Repetition above "about twice per concept":
   - C8S-5.1: the registration rule appears in q0, q5, q6, q9, q15, q16, q17, q18, q19, q20 (ten times); the "one vote of equal value" idea in q2, q5, q14, q19 and q17; the "no voting on another's behalf" idea in q0, q10, q15, q17, q18, q19.
   - C8S-5.2: the 13 per cent fact in q0, q6, q15, q20 and q13; the 8 per cent/14 per cent figures in q0, q6, q7, q12, q13 (five times); the answerability reason in q1 and q9 (same MLA scenario twice); mindmap-reason matching as an MCQ in q1, q3, q8 in the same frame.
   - C8S-5.3: matching an access need to a measure in q0, q1, q13, q16, q19(b); 968 million/543 arithmetic in q2, q5, q10, q17, q18, q21.
   - C8S-5.4: secret ballot in q1, q7, q9, q11, q18, q20, q21; Uttaramerur vs Suryodaya comparison in q4, q5, q16, q19 (and q13); NOTA tally frame in q0, q6, q17, q21.
   - C8S-5.5: Model Code of Conduct in q3, q7, q12, q15, q16, q19, q20 (seven); Seshan and voter IDs in q4, q7, q17, q21; the proxy voting idea in q4 and q21.
   - C8S-5.6: the three-officer order in q0, q2, q6, q14, q17, q19 (six); VVPAT purpose in q1, q5, q8, q10, q15, q17, q20 (seven); the 131/543 computation in q9, q16, q18; Negi arithmetic in q7 and q11; 968/543 = 1.78 million in q18 repeats 5.3 q10.
   - C8S-5.7: First-Past-the-Post with less than half in q2, q7, q9, q13, q17, q19, q20; the PM-from-majority rule in q0, q5, q7, q14, q17, q18.
   - C8S-5.8: the "nominated members are left out of the President's college" idea in q0, q1, q5, q8, q15, q18, q20; the 2026 to 2032 term arithmetic in q6 and q21(c).
   Fix: cut each concept to at most two items per idea. Candidates to replace: 5.1 q9, q20; 5.2 q3, q9; 5.3 q1, q19(b); 5.4 q5, q8; 5.5 q16; 5.6 q2, q6, q10, q11; 5.7 q13, q17; 5.8 q6, q8.

12. Easy-in-disguise: the answer is a fact the book states in one line (whatever the Bloom label).
   - C8S-5.1 q11 (differentiate franchise vs constituency, the margin definitions), q9 (14 years 3 months subtracted from 18, step (a) is a one-step subtraction).
   - C8S-5.2 q11 (Swiss women 1971 option), q17 (the quoted reason), q20 (the 13 per cent correction).
   - C8S-5.3 q0, q1 (home voting / braille card matched to the person), q9 (true/false: 34 per cent is close to one in three).
   - C8S-5.4 q3 (unmarked ballot is invalid), q5, q8 (A and R are two unrelated caselet facts), q10 (NOTA).
   - C8S-5.5 q0 (ECI vs SEC), q8 (distractors are absurd, "why independent" has no book reason), q11.
   - C8S-5.6 q0, q2, q6 (the three-officer sequence), q12 (voting machines used abroad).
   - C8S-5.7 q1 (coalition definition), q5 (who becomes prime minister), q10 (MP vs MLA, lifted from the margin dialogue), q11(a).
   - C8S-5.8 q13 (UP population, STV purpose), q14 (VP steps in, chairs the Rajya Sabha), q8.
   Fix: lift each to a decision or a novel situation, or drop in favour of the concept's harder slots.
   Also the 5-mark long answers that are pure retelling: 5.1 q18, 5.4 q20, 5.5 q18, 5.5 q19, 5.7 q17, q18, 5.8 q18. They carry the "Hardest" label but ask the student to list what the chapter lists; add a data twist or a judgement part.

13. Strawman last parts (the "decision" is not a real trade-off):
   - C8S-5.1 q19(d) (village head's complaint is plainly wrong); q14 (Rohan's claim is absurd).
   - C8S-5.2 q0(d) and q19(d) (Proposal Y obviously beats Proposal X).
   - C8S-5.3 q21(d) (headline "reach every voter" overstated after three corrections).
   - C8S-5.4 q21(d) (Note 2 is an eyewitness with figures, Note 1 hearsay).
   - C8S-5.5 q20(d) (the ruling party's defence "helps people" is a flimsy defence).
   - C8S-5.6 q19(d), q20(d) (checking slips with a margin of 370 is obviously justified).
   - C8S-5.8 q20(d) (the student's claim is rejected by the book's own line).
   Fix: give each a side that the data could support (e.g. cost against fairness, speed against secrecy).

## LOW

14. C8S-5.1 q4 (fill_blank): the stem hands over 1990 and the rule "counting a person as eligible from the year she reaches the age limit" and then tells the student to apply the 1988 change; the item is a long set-up for a one-word answer. Acceptable but cut to one clear sentence.
15. C8S-5.1 q7 and q9 are 1-step arithmetic or name-matching; fine as match but not Hard.
16. C8S-5.2 q0 line 3: "the voting age was 21 at first" is inferred (the book only says it was changed from 21 to 18 in 1988). Say "before 1988 it was 21".
17. C8S-5.2 q7(a): 86 per cent and 92 per cent of Indians shut out treats the literacy rate as an adult rate; add "assume the rates apply to adults".
18. C8S-5.2 q1, q3, q8 option 3 ("Women had the right from the beginning", "Every vote is cast only by the voter herself") are not mindmap reasons while the stem asks for a mindmap reason: weak distractors. q3 also: taking the sewage problem to the councillor could be read as answerability.
19. C8S-5.3 q6 (assertion_reason): the false R ("only where at least 1,000 voters live") is false by the book only through the single-woman polling station caption; the stem does not give that. Mention it or reword R as a verifiable falsehood.
20. C8S-5.3 q8: "roughly how many ... on average, at most?" mixes "roughly" and "at most"; drop "at most" or say "no more than about".
21. C8S-5.3 q20: "above 85 years of age" is beyond the book (it says "the elderly"); use "elderly voters" and keep (d).
22. C8S-5.4 q10: "on the machine" is not in the book (it only says NOTA is also available at the booth).
23. C8S-5.4 q11 key: "only the totals were counted" is the author's gloss. q18 key: the braille/Neha loss under show of hands is weak (raising a hand needs no reading), keep only the no-record reason.
24. C8S-5.5 q3, q4 option 3 ("voter ID rule", "Adopting the Model Code first in Kerala") are not elements/reforms of the right kind; weak distractors. q8's options 2 to 4 are absurd, so the item is solved by elimination, and the book gives no reason for the ECI's independence beyond the label.
25. C8S-5.6 q11(b): "what the chapter's choice to show him voting at 100 suggests" is not something the book says; make it "link to the chapter's closing note that voting is also a responsibility".
26. C8S-5.6 q14: the book does not say the visit is "recorded"; say "checked" not "recorded".
27. C8S-5.7 q12: "7 assembly constituencies gives 7 MLAs" assumes one MLA per assembly constituency and that all lie inside the Lok Sabha seat; state both in the stem.
28. C8S-5.7 q13(b): the effect of the losers' response is the author's opinion; the book only says they congratulated her.
29. C8S-5.8 q8: absurd distractors (not citizens, count finished in a day). q20(a): "few thousand" electors for the President is beyond the book; fine as the student's claim but note it is not checked.
30. Difficulty labels: 120 of 172 items are Hard or Hardest, including several of the recall items listed under 12; labels do not reflect the thinking.

## Check you asked about
- Untagged scenario MCQ, 5.2 q20 (local history display): sound. Only the first option (13 per cent allowed to vote, franchise not universal) matches page 119; the others invert or invent facts. It is a one-line fact (see 12).
- Untagged scenario MCQ, 5.4 q5 (Uttaramerur vs Suryodaya): sound. Only "Uttaramerur chose by random draw, not by votes" holds; the other three contradict the pages. One-line fact again (see 12).
- "12 of 33" and the 33 total: no item adds the three candidates to 33, so nothing contradicts a computed answer except 5.7 q2 (36%) and q9 (21 classmates), above.

## Per-concept status
- C8S-5.1: pass after fixes (repetition of registration rule; easy items q9/q11; strawmen q14, q19).
- C8S-5.2: pass after fixes (q5 verdict; repetition of the 13 per cent, 8 per cent and mindmap reasons; q1/q9 duplicate).
- C8S-5.3: pass after fixes (easy MCQs q0, q1; measure-matching repeated; q20 beyond-book "85").
- C8S-5.4: pass after fixes (q1, q9, q0(b); Uttaramerur comparison repeated four times; NOTA tally repeated).
- C8S-5.5: pass after fixes (q21(c) premise; MCC repeated seven times).
- C8S-5.6: rework of q3 (HIGH), then fixes (q13, q19(b), repetition of the three-officer sequence and VVPAT).
- C8S-5.7: pass after fixes (q2 and q9 computed from the inconsistent 33; repetition of FPTP and PM rule).
- C8S-5.8: pass after fixes (q21(d) STV assumption; repetition of nominated-members exclusion).

## Verdict: NOT load-ready. Pass after fixes.
Counts: HIGH 1, MEDIUM 12 (numbered items 2 to 13, some covering several questions), LOW 17 (items 14 to 30). Facts, dates and numbers are right throughout (0 wrong keys); the work needed is the one fill_blank, the handful of keys that reach beyond the book, the heavy repetition, the easy-in-disguise items and the shared slot skeleton.
