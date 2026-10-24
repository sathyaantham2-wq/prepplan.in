# Review v3: class8s p2ch05 (SST8, Part II ch5, Citizenship: Rights and Duties, hees205)

File read: content/authoring/dps/class8s/p2ch05.json (9 concepts C8S-5.1..5.9, 182 questions, every one read, matched against pages 143-166 and the scope file content/authoring/class8s/p2ch05.json). Indices are 0-based in the NEW order. Scratch: scratchpad/v3-class8s-p2ch05/ (dump.py, chk.py).

Mechanical checks (python): 182 items; every a == o[0]; no duplicate options; step marks sum to marks everywhere; no option named by position; no stem or key cites a page ("p." hit is "6 p.m." in 5.9 [1]); every number in the case studies recomputed (30%, 70%, Rs 1,00,000 / 1,45,000, Rs 10,000, 37.5%, 62.5%, 14 h / 36 h, 10%, 35% / 4.2% / 15%, 35%, 20% / 45%) and correct. Facts all trace to the pages except where noted.

Counts: HIGH 5, MEDIUM 22, LOW 10. Verdict: NOT load-ready (pass after fixes). 3 of the 8 v2 HIGHs-fixes are clean, 5 are clean-with-notes, and the fix pass introduced or left 5 HIGHs (listed below).

---------------------------------------------------------------------
## Status of the v2 HIGHs and named checks

| v2 item | v3 status |
|---|---|
| 5.2[3] "justified" fill_blank | Replaced; the new fill is 5.2 [9] ("rights are ___ claims" -> "justified"). It needs the chapter term, but it does NOT have one natural answer. STILL HIGH (H1). |
| 5.3[5] "equity" fill_blank | Replaced; now 5.3 [0] (stem gives the book's margin gloss of equity, asks the term). Needs a chapter term; "equity" is the only natural answer (stem rules out equality; "inclusion" does not fit "support each group needs"). Clean, but a gloss-to-term lookup (M3). |
| 5.7[5] "2002" fill_blank | Replaced; now 5.7 [9]. 2002 is printed on p.156 ("In 2002, the 11th duty was added"); the stem gives only 1976, so the year is not derivable; one natural answer. Clean (still a bare date, M4). |
| 5.2[15] (table's guarantees) | Now 5.2 [6]: guarantee lines are in the stem, asks only the category. No article number needed. Clean (thin, M5). |
| 5.6[12] (cultural rights) | Now 5.6 [12]: category and a reply, no article numbers. Clean. |
| No item may require an article number | NOT met. 5.6 [11] (R states "Articles 25-28") and 5.2 [5] (statement 3 states "Articles 29 and 30") need the Fig. 5.2 ranges. See H4, H5. Other "Article" hits are fine: 5.2 [1], [7], [18] give the numbers in the stem or options and need no recall; 5.7 [2], [7] name "Article 51A" only (named in the scope_in text of the chapter). |
| 5.4[9b] rumour/shouting scenario | Rumour now 5.4 [16](b); the stem itself names the phrase "harmful to others", so there is one answer (but it is handed over, M8). The shouting case survives only inside the 5.4 [18] sample answer where "misused" is the stated reason: consistent. Clean. |
| 5.6[18] three lines, fourth line open | Now 5.6 [17]. All three lines are about freedom of religion (p.152-153), so (c) has one answer; the open fourth line (d) has a marking point ("a true line on cultural and educational rights") and a sample. Clean; the case is still four lookups (M13). |
| 5.7[14] "No" | Now 5.7 [0]. Both halves of Dhruv's claim contradict p.158 ("much wider range of meaning"; "not guaranteed universally"), key "No" is unique. Clean. |
| Page citations | grep "page", "p.": none left. Clean. |
| Case-study endings settled by data | All nine concepts' last parts have one answer (no tie) except the three listed in H3, H2 and M10. |
| Ganga/Yamuna down to 4 | Now 3 items (5.4 [3], [7], [15]); fine. |
| At most two items per idea | NOT achieved; see M17 (several groups of 4-8; near-duplicate pairs named). |

---------------------------------------------------------------------
## HIGH

H1. C8S-5.2 [9] fill_blank. "...since rights are ___ claims." Key "justified".
Problem: the stem gives no clue to the word. "Legitimate", "valid", "legal", "genuine" are all natural and a machine matcher would mark them wrong. The chapter term is needed (good) but the answer is not unique (same defect class as v2 H1-H3).
Fix: quote the chapter's whole phrase with the noun blanked: "The chapter sums up rights as 'justified ___'." (answer "claims"); or add an accepted-variants line only if the loader supports it.

H2. C8S-5.2 [18] case study (Ambedkar). Part (b): "A student says Ambedkar meant this right is more valuable than equality. Which reading does the chapter's own sentence support...?" Key: the first reading, "it says nothing about ranking it above equality".
Problem: the stem itself quotes Ambedkar: "the single most important article, one without which the Constitution would be a nullity... the very soul... the very heart". That quotation DOES rank it above every other article, so the key's reason ("no ranking is stated") contradicts the stem and a student's "ranks above" answer is defensible. Parts (a) and (c) are answerable from the stem itself (the stem already says "promises on paper"; (c) asks for the phrase back), so the item has no usable decision.
Fix: ask which of Ambedkar's words ("soul", "heart") the chapter's own sentence explains and why (enforceability), or drop (b); replace (a)/(c) with something the stem does not hand over.

H3. C8S-5.2 [15] case study (legal-aid camp). Part (c): "Which right in Fig. 5.2 do these villagers most need to learn about, and why?" Key: constitutional remedies.
Problem: the stem says the villagers "had faced forced work without wages or refusal of admission to a government school". "The right against exploitation" (forced work) and "cultural and educational rights" (admission) are equally defensible answers to "most need to learn about"; only the word "approach the courts" in the stem leans to remedies.
Fix: "Which right in Fig. 5.2 is the one that lets them take such a matter to court?" (one answer), or mark exploitation or remedies both correct with a reason.

H4. C8S-5.6 [11] assertion_reason. R: "In Fig. 5.2 the right to freedom of religion is placed in Articles 25-28." Key: both true, R does not explain A.
Problem: the key depends on whether R is true, which a student can only decide by recalling a bare article range (scope_out: "Reciting from memory which article number carries which guarantee"; p.154 says "You need not memorise these"). A student who does not recall the range cannot tell this key from "A true, R false".
Fix: make R article-free (for example "The chapter places the right to freedom of religion in a different category from cultural and educational rights"), keep "R does not explain A".

H5. C8S-5.2 [5] multi_statement. Statement 3: "In Fig. 5.2, cultural and educational rights are placed in Articles 29 and 30."
Problem: same scope_out violation (the truth of statement 3 is a bare article range). The key "2 and 3 only" is reachable only because statement 1 ("eight categories") is plainly false and the option set offers no "2 only", so the item leaks the key, and statement 3 tests nothing the book asks.
Fix: replace statement 3 with an article-free truth (for example "The chapter says fundamental rights can be enforced by law, so people can approach the courts if they are violated") and give the options a "2 only" option.

---------------------------------------------------------------------
## MEDIUM

### Easy in disguise (a one-line book fact whatever the Bloom label). About 48 of 182 are still lookups. By concept (indices in new order):
M1. 5.1: [0] (true_false restates p.145), [3] match (four book examples), [7] fill, [8], [11](a), [16], [19](a).
 5.2: [1] (the stem gives 19-22, the student only reads the figure), [3], [7] (match the words), [10](a), [12], [14], [19] (True echo).
 5.3: [0], [1], [8], [14], [18] (BBBP in one line), [19](b).
 5.4: [1], [5], [6](b) ("liberty"), [9], [12], [13], [14].
 5.5: [1], [3], [7], [9] (re-tell the rescue), [11], [14], [15] ("count backwards from 10" plus one reason), [18] (education, play, healthy childhood: a one-line fact), [19](a)(b)(c).
 5.6: [1] (True restates the rule), [2], [4], [5], [8], [12](b), [14](a)(b)(c), [16].
 5.7: [2] (verbatim dharma line), [4], [5], [8], [11], [15], [18], [19] (the book's own right-duty sentence), [20](a)(b)(c).
 5.8: [0] (True: the book's bus example), [2], [3], [14], [17], [18].
 5.9: [0], [2], [3], [9], [12], [14], [18], [19].
Fix (priority): for each add a decision (two chapter ideas compete, a claim with one wrong word, a pair to tell apart). Worst offenders: 5.5 [15], [18], 5.7 [19], 5.8 [14], 5.9 [9]. Bloom labels "Analyse/Evaluate" on 5.7 [2], [4], 5.9 [9], [12] overstate the thinking.
M2. 5.5 [19] and 5.6 [14], 5.7 [14], [20]: five-mark "Evaluate" items where (a)-(c) are 3 lookups and only the verdict is thinking; the step marks give 60% to recall.

### Fill_blanks (7; one-line-fact test)
M3. 5.3 [0] "equity": the stem restates the p.149 margin gloss and asks for the term; 5.6 [4] "minority": same pattern (the stem restates the gloss, asks the label). Both are definition-to-term lookups, not application.
M4. 5.7 [9] "2002": unique but a bare date from one line (p.156). 5.1 [7] "inclusion": the helping act could also be read as a "duty" (p.159 "help others"); the stem's "four concepts" restricts to inclusion; keep but state "which of the four concepts the invitation, not the stopping, is".
M4b. 5.4 [7] "guardians": the stem says "to speak for a river in court", which points to "legal representatives", also natural. Remove "speak for a river in court" (keep "to protect and conserve it"). 5.5 [8] "bonded": the stem ("will not let them leave") and p.154/p.151 also give "forced labour" a claim; add "(the word begins with b)" or the chapter's list "bonded labour, human trafficking, abuse, child labour".

### Weak keys, premises and stems
M5. 5.2 [6] (three guarantees -> category): three classification lines, thin as a 3-mark item (Bloom Apply).
M6. 5.2 [17](a): key accepts only "exploitation or remedies" as categories the teacher did not name. "Cultural and educational rights" is also not named by the teacher ("right to education" is not the category). Accept it, or say "the teacher named five rights; name one of the six categories no right on her list belongs to".
M7. 5.4 [10] case: the water is stated "already safe", so the purifier option fails by the stem: foregone decision. 5.4 [19] case: Order B ("stop the smoke, keep working") dominates Order A by construction; a strawman decision.
M8. 5.4 [16](b): the stem names "harmful to others" itself, so the answer is handed over (but the item is unambiguous, so it is not a HIGH).
M9. 5.5 [16] case: Asha's 4 hours on Sunday "meets the conditions" in the key, but the book allows help "only during vacations or after school hours"; Sunday is neither. A strict reader marks Asha as breaching. Fix: replace the Sunday hours with "after school on 5 days and during the summer vacation"; keep the arithmetic.
M10. 5.7 [10] case: part (c) "Which project should the council choose, and why?" does not state the criterion; "the litter project, 35%" is only the data answer. A student who weighs the flood-relief drive as more serious is not wrong. Fix: "judging by how many students it affects". Also (c) is answerable without the chapter.
M11. 5.8 [2] claim_check "Yes": "the chapter treats Savitribai Phule's story as discrimination on two grounds" is an inference; the book never counts grounds or classifies the story. The verdict "Yes" rests on the examiner's reading. Re-ask as "Which grounds are at work in her story?" or soften to "the chapter's story shows".
M12. 5.9 [4] claim_check "Yes": "not by asking children to change themselves" is not in the chapter (the book says only that she expanded the club). Key adds "She did not ask the other children to improve their English", which the book does not say. Reword the claim to what p.162-163 says.
M13. 5.6 [17] (case) and 5.4 [11] etc.: 5.6 [17] is four lookups (a: obviously false Line 3; b: recite the rule; c: name the right, partly signalled by the stem "religion and schools"; d: open). No real decision.
M14. 5.2 [18] and 5.2 [15](d): the "decision" is chapter's own advice ("need not memorise"; "not just promises on paper"), a strawman. 5.1 [6]: Kabir ("wait until grown up") vs Leela is a foregone choice and (b) is answerable from the stem ("the teacher told them ... may approach the courts"). 5.1 [20]: Line 1/2 are obvious strawmen.
M15. 5.3 [13](a): "Which half of the editorial's first sentence agrees" - the first sentence has no halves (the "Therefore ..." is the second sentence). Reword to "Which sentence of the editorial agrees with the chapter".
M16. 5.8 [6](b): the stem still says "everyone around notices", handing the answer (which caselet is harder to prove). Remove the clause or ask (b) differently.

### Repetition (target: at most two items per idea; achieved only partly)
M17. Counts (indices): 5.2 courts/promises on paper/Art 32: [0], [2], [6], [10], [11], [13], [15], [16], [18], [19] (the whole concept leans on it); the harm test [3], [4], [8], [9], [12], [16]; government-bound [2], [5], [10], [13], [14], [15] ([13] and [14] are near-duplicates).
 5.3 equity vs equality: [0], [3], [4], [5], [9], [11], [13], [16], [17], [18]; the scenarios [3] (books), [4] (notebooks) and [17] (travel money) are three "same-for-all vs need" items; [12] and [14] both test "five grounds vs the discrimination list"; [8] and [14] are the same "NOT listed" format.
 5.4 disabilities: [4], [9], [10], [11], [12]; [10] and [11] are near-duplicates (a pupil who cannot enter the classrooms); rumour [16], [17], [18]; the Ganga/Yamuna matter is down to [3], [7], [15] (fine).
 5.5 family-enterprise rule: [0], [10], [13], [16], [17], [19]; the 2015 rescue [4], [6], [9]; helpline [2], [4], [6], [13], [14], [15], [16], [19].
 5.6 school-religion rule: [1], [3], [5], [9], [10], [16], [17], [18]; [5], [16](b), [18](iii) are the same scenario ("a state school makes everyone join one faith's prayer") asked three times; the admission rule [7], [8], [19] ([8] and [19] near-duplicates).
 5.7 11th duty [9], [12], [15], [18](ii); dharma/rina/adhikara [0], [2], [11], [20]; classify-the-duty-from-a-scenario format [1], [5], [13], [15], [18].
 5.8 Savitribai [2], [7], [10], [12] ([7] and [10] ask the same thing; [2] second half repeats it); "hard to prove / penalise" [4], [6], [8], [11], [15]; bus seat [0], [16], [19] ([0] and [16] share a stem); Sanya's looks [3], [14].
 5.9 reservations [5], [9], [12], [17]; Amita's club [3], [4], [6] ([3] re-skins the book's own story); the girl who sits alone / is never spoken to [7], [14] (same scenario, near-duplicate); ramps/braille [0], [8], [11], [13], [15], [19].
Judgement: groups of 3-4 are acceptable at MEDIUM; the near-duplicate pairs named above (5.2 [13]/[14], 5.4 [10]/[11], 5.6 [5]/[16]/[18], 5.8 [7]/[10], 5.8 [0]/[16], 5.9 [7]/[14], 5.9 [9]/[17]) and the groups of 6-10 (5.2 courts, 5.3 equity, 5.5 helpline, 5.6 school rule) are over the line. Replace one item of each near-duplicate pair with a new idea before loading.

### Template
M18. multi_statement keys (9): "2 and 3 only" x4 (5.2, 5.4, 5.7, 5.8), "1 and 2 only" x2 (5.1, 5.6), "2 only" x2 (5.3, 5.9), "1 and 3 only" x1 (5.5). Statement 2 is correct in 8 of 9 items and statement 1 is the false one in 6 of 9; only 5.9 offers "None of the three" and none is keyed to it. The false statements are strawmen ("only if they speak the same language", "limited to those who ask"). Vary which statement is false and add a three-true or one-true key.
M19. assertion_reason keys (9): both-true-explains x3 (5.2, 5.5, 5.9 [12]; 5.8 not), both-true-not-explains x3 (5.1, 5.6, 5.7), A-true-R-false x1 (5.3), A-false-R-true x2 (5.4, 5.8). Acceptable. 5.1 [13] pairs two unrelated true statements (the "not the explanation" key is correct but the pair has no chapter link).
M20. claim_check verdicts (9): No x5 (5.2, 5.3, 5.5, 5.6, 5.7), Partly right x2 (5.1, 5.4), Yes x2 (5.8, 5.9). The two "Yes" items rest on inference (M11, M12). Good spread otherwise.
M21. true_false (7): False x4 (5.1 [0], 5.4 [0], 5.5 [3], 5.7 [4]), True x3 (5.2 [19], 5.6 [1], 5.8 [0]). The True items restate a book sentence and carry no misconception; 5.7 [4] (False) is a one-line date.
M22. Slot order: the identical-order problem of v2 is gone (the reorder gave each concept a different sequence; MCQ block positions, AR and claim_check indices all differ). The 2-mark frame "(a) state ... (b) apply" still appears 12 times.

---------------------------------------------------------------------
## LOW

L1. 5.4 [3] claim_check: "that is why courts have given..." asserts a cause the book never states; the "partly right" verdict still holds.
L2. 5.4 [15](a): "two places ... given legal protection" - the Uttarakhand order also counts as a place named; key lists only New Zealand and Costa Rica. Accept Uttarakhand "(order later overturned)".
L3. 5.6 [3](d): wording "(d) why the chapter gives for that school rule" is garbled; fifth step ("a clear speech that joins the points in order") is a filler mark.
L4. 5.7 [7]: stem ends "The right answer is" with no question; chapter p.144-145 itself calls paying taxes a duty, so "Pay taxes" being "NOT among the eleven" depends on the stem's restriction to Article 51A (acceptable, state it).
L5. 5.2 [1]: the stem states "Fig. 5.2 gives Articles 19-22 to one category"; the item reads the figure but does not need a number; keep.
L6. 5.9 [0]: item 4 (waiting for a slow reader) could be "classroom support" (c) as well as "removing barriers" (d); only one option set fits, but the mapping is soft.
L7. 5.9 [6](d): "the other children's fluency" is confusing wording; the book says "all children ... irrespective of their fluency".
L8. 5.9 [2]: a panchayat hall is outside the chapter; the closing point still carries the answer.
L9. 5.8 [4](b): "easy to deny" is an inference; the book says "difficult to prove and hence difficult to penalise".
L10. 5.8 [13]: the stem restricts to "the chapter's definition of discrimination" (correct: "place of birth" is in the p.148 equality list, not the p.160 definition); keep that restriction.

---------------------------------------------------------------------
## Template counts

- Types: short_answer 72, mcq 43, long_answer 37, multi_statement 9, assertion_reason 9, fill_blank 7, match 5 (unchanged from v2). Bloom: Apply 73, Analyse 54, Evaluate 39, Create 16 (no Understand); Analyse+Evaluate+Create = 109 of 182 = 60%.
- MCQ option length (43): correct longest 13 (30%), shortest 9 (21%), middle 21 (49%). No pattern; fine.
- multi_statement, assertion_reason, claim_check, true_false: see M18-M21.
- Case studies: 20 long_answer case-study items; 4-mark case parts mostly arithmetic + two lookups + a verdict; endings all settled except M10 and the HIGH items.
- Figures: no item depends on Fig. 5.14 or 5.15; Fig. 5.2 items name only categories except H4/H5.

## Per-concept verdict

| Concept | Verdict | Must fix |
|---|---|---|
| C8S-5.1 | pass after fixes | M1, M14, repetition (no HIGH) |
| C8S-5.2 | NOT load-ready | H1, H2, H3, H5 |
| C8S-5.3 | pass after fixes | M3, M15, M17 (no HIGH) |
| C8S-5.4 | pass after fixes | M4b, M7, M17 (no HIGH) |
| C8S-5.5 | pass after fixes | M4b, M9, M1 (no HIGH) |
| C8S-5.6 | NOT load-ready | H4; M17 (school rule x8) |
| C8S-5.7 | pass after fixes | M10, M1, M17 (no HIGH) |
| C8S-5.8 | pass after fixes | M11, M16, M17 (no HIGH) |
| C8S-5.9 | pass after fixes | M12, M17 (no HIGH) |

Chapter verdict: not load-ready. Five HIGHs (four are in 5.2, one in 5.6) must be fixed and re-checked; then the near-duplicate pairs in M17 should be replaced. Everything else is MEDIUM/LOW and load-ready after the HIGHs only if the owner accepts the lookup density (M1).
