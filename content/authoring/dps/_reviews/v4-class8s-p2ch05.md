# Review v4: class8s p2ch05 (SST8, Part II ch5, Citizenship: Rights and Duties, hees205)

File: content/authoring/dps/class8s/p2ch05.json (9 concepts, 182 questions). Diffed by index against scratchpad/fix-class8s-p2ch05/orig-v3.json: 42 items changed, all read against pages 143-166 (hees205 pages 005-023). Unchanged items were not re-read except the nine multi_statement items and the "Article" grep. Indices are 0-based within the concept.

Mechanical (python): 182 items; every `a` equals `o[0]`; no duplicate options; step marks sum to marks everywhere; no option named by position; no page citations. Only 3 items contain the word "Article": 5.2 [1] (stem gives "Articles 19-22"), 5.2 [7] (the options carry a description with the numbers, so no recall is needed) and 5.7 [7] (names "Article 51A", which the book prints with the duties). None needs an article number recalled. No article range is left in any statement or reason.

Arithmetic recomputed: 5.4 [19] 90/240 = 37.5 per cent; 12/30 = 40 per cent of one year's profit (correct). 5.5 [16] Asha 2 x 5 = 10 h, Bilal 6 x 6 = 36 h (correct). Also 5.2 [15] 70 per cent, 5.7 [10] 35 / 4.17 / 15 per cent, 5.9 [6] 20 and 45 per cent: all correct.

---------------------------------------------------------------------
## Status of the v3 HIGHs

| v3 HIGH | v4 status |
|---|---|
| 5.2 [9] fill_blank "justified ___" -> "claims" | The phrase is on the pages ("Hence, rights are justified claims", p.147). "claims" is the book's word. But the stem itself says "his demand is not a right", so "justified demands" is a natural fill and a machine matcher would mark it wrong. NEW HIGH (H1), one-word fix. |
| 5.2 [18] Ambedkar case | Clean. The quote matches p.154 (the stem only swaps the em dash for a hyphen and drops the bracketed gloss). (a) "promises on paper ... protected and enforced" is p.154 and has one answer. (b) Supreme Court is unique. (c) "other rights useless" is wrong; the key does not contradict the quote, because it says the right "guards the rest". The old "ranking" part is gone. Parts (a) and (c) are easy (see M2). |
| 5.2 [15](c) | Clean. "Which right lets a villager take the matter to the Supreme Court" has one answer, constitutional remedies (p.154). The right against exploitation does not fit the question as now worded. |
| 5.6 [11] R | Clean. R is article-free and true (religion and cultural and educational rights are separate categories, p.152-154). A is true (p.153). R does not explain A, so "both true, R not the explanation" is the single answer. |
| 5.2 [5] | Clean. Statement 1 is p.148, 2 is p.149, 3 is p.147, so all are true. "1 and 2 only", "2 and 3 only" and "1 only" are each wrong. |

---------------------------------------------------------------------
## HIGH

H1. C8S-5.2 [9] fill_blank. "A shopkeeper says ... The chapter would reply that his demand is not a right, because the chapter sums up rights as 'justified ___'." Key "claims".
Problem: the stem hands the reader the word "demand" twice over in context. "Justified demands" reads naturally and is the standard textbook phrase, and "rights" would also be tried. Only the book's wording makes "claims" the answer, and a matcher cannot accept variants.
Fix (one word): replace "his demand" with "his wish" (or "what he wants") so the stem does not supply a synonym, keep "justified ___", and keep the key "claims". Safer: make it a short-answer asking for the chapter's word.

(No other HIGH found. Every multi_statement item and every changed item has one defensible answer.)

---------------------------------------------------------------------
## multi_statement check (all 9)

All nine have `a` identical to `o[0]`. Key spread: 1 only / 1, 2 and 3 / 3 only / 1 and 2 only / 1 and 3 only / 2 only / 2 and 3 only / None of the three / 1 and 2 only. Good spread, no pattern.

- 5.1 [10] "1 only": S1 true (p.145 "specifically mentioned"). S2 false (inclusion is "an affirmative way to ensure non-discrimination", not a duty). S3 false (equal despite language). Clean.
- 5.2 [5] "1, 2 and 3": all true, see above. Clean.
- 5.3 [11] "3 only": S1 false (equity is fairness that addresses existing inequalities). S2 false (p.148: no special titles). S3 true (untouchability). Clean.
- 5.4 [4] "1 and 2 only": S1 true (p.150, health, clean environment). S2 true (disabilities, p.150). S3 false (freedoms are not unlimited, p.149). Clean.
- 5.5 [14] "1 and 3 only": S1 true, S3 true (p.151). S2 false (Childline is "available all over the country"). Clean.
- 5.6 [13] "2 only": S1 false (religious and linguistic minorities, p.154). S2 true. S3 says "can never come into conflict" and the book says the two aims "can seem to be in conflict". False, but it hinges on "seem" (LOW, L1).
- 5.7 [3] "2 and 3 only": S1 false (duties are moral and social, p.159). S2 and S3 true. Clean.
- 5.8 [5] "None of the three": S1 false (legally prohibited), S2 false (affects the person too), S3 false (difficult to prove). The option exists at o[0]; `a` is identical. Clean.
- 5.9 [5] "1 and 2 only": S1 and S2 true (p.163), S3 false ("goes beyond just giving reservations"). Clean.

---------------------------------------------------------------------
## MEDIUM

M1. Easy in disguise (a one-line book fact). Still about 35 of 182 across the pack. In the changed set: 5.2 [14] and 5.3 [8] (read a row of the table); 5.2 [9] (recall one phrase); 5.3 [4]; 5.4 [7] and 5.5 [8] (fill_blank with a glossed term, but now unique: "guardians" and "bonded" are the book's words; "forced labour" is not one of the four named forms); 5.6 [5], [18] (three lookups, 3 marks); 5.7 [2] (verbatim reason), [7] (one non-duty), [18] (recall of the p.159 list); 5.8 [2] (a "Yes" claim made only of verbatim facts), [10]; 5.9 [9] (verbatim sentence), [7]. Fix: where easy, add a decision: a claim with one wrong word, or two chapter ideas to tell apart.

M2. 5.2 [18]: (a) and (c) are largely re-statements of the stem ("promises on paper", "enforced by law"), and (b) is a 1-mark lookup. The thinking is in (c) only. Fine as a 4-mark case, but 3 of 4 marks are recall.

M3. 5.2 [15](d): "teach the list of article numbers or the idea" is a strawman; the book itself says "you need not memorise these". Make the competing lesson a real one (for example "the six categories" vs "how to approach the court").

M4. 5.4 [19] case: Order B (filter costing 40 per cent of one year's profit, keeps livelihoods) dominates Order A (close the plant for good) by construction. The decision is foregone. Fix: give Order B a cost nearer the profit (for example Rs 28 lakh) or a real downside so the figures decide.

M5. 5.9 [6] case: Trial Y (18 of 40) beats Trial X (8 of 40) by more than double, and Trial Y is what the book's story did. A strawman decision. Fix: make the trials closer (for example X 14, Y 16) and ask which better matches the chapter's idea of "removing barriers".

M6. 5.3 [13](d): "right, wrong, or partly right" on an editorial whose first sentence agrees with the book and whose conclusion is false. "Wrong" (the argument fails) is defensible, and the key demands "partly right". Fix: ask "Which sentence of the editorial does the chapter contradict?" or accept "wrong" with the reason in the marking point. Same issue, smaller, in 5.9 [4] (Meera's claim: the story facts are right, the conclusion is wrong).

M7. 5.6 [19](b): the students laughing at a traditional dress is called "discrimination". The book places the same Culture Day scenario among its duty examples (p.160, "preserve culture and heritage") and "inclusion" can also be argued (they fail to include). Fix: name the four concepts and ask which the students' behaviour breaches, or ask for the duty instead.

M8. 5.7 [12] assertion_reason: key "R explains A". R (not performing a duty may not bring legal action) restates the contrast in A more than it explains it, so "both true, R not the explanation" is arguable. Fix: make R the reason (for example "Duties rest on a sense of responsibility, not on the force of law").

M9. 5.1 [6](c) key: "it shows the children doing so, after which changes were made". Nothing in the stem says changes were made. Delete the clause; the book's account of active participation is enough.

M10. Option template: in the 43 MCQs the correct option is the longest (or tied) in 19, 44 per cent, against about 25 per cent expected. Examples: 5.3 [8], 5.5-5.9 changed items (5.6 [5], 5.7 [2], 5.8 [16] "She ethically ceases ... respect and unity", 5.9 [9]). The wrong options are shorter and often carry a giveaway such as "as the chapter states" (5.8 [16]). Fix: lengthen or shorten distractors on about 8 items so the key is longest in 25-30 per cent.

M11. 5.8 [6] case: (a) and the two quotations are easy; (b) and (c) are the same idea (indirect discrimination), which makes it two parts on one fact.

M12. Repetition: Ganga/Yamuna appears in 5.4 [3], [7], [15] (three items; acceptable); equity/equality in 5.3 [0], [4], [11], [13]; the "civil society / approach the courts" idea in 5.1 [6], 5.2 [15], 5.2 [18]. Not above the MEDIUM line.

---------------------------------------------------------------------
## LOW

L1. 5.6 [13] S3 ("can never come into conflict"): the book says "can seem to be in conflict". Reword S3 to "are never even apparently in conflict" or "the chapter says the two aims can seem to conflict at times" and flip the key logic.
L2. 5.2 [17](a): "cultural and educational rights" is accepted as not on the teacher's list, while "education" is on it; (b) accepts "education" as not a category. Consistent, but a student may query the pair; add "name" before "category" in (a).
L3. 5.5 [16](b): the key says Asha "meets" the conditions; the book allows help "only during vacations or after school hours", and the stem now says after school, so this is fine. Bilal's school-hours work and restaurant both fail. No change needed.
L4. 5.4 [15](a) asks for "two places" and the key lists three: add "any two".
L5. Claim-check verdict mix across the chapter: about 5 "No", 3 "Partly right", 1 "Yes" (5.8 [2]). Acceptable; the lone "Yes" is a lookup.
L6. Slot order: the type-and-marks sequence differs between concepts (9 distinct sequences in 9 concepts), though each concept has the same mark spread (8 x 1, 5 x 2, 3 x 3, 2-3 x 4, 2 x 5). Not templated.

---------------------------------------------------------------------
## Counts and verdict

Items read: 182 counted, 42 changed read in full, plus all 9 multi_statement items. HIGH 1 (H1), MEDIUM 12, LOW 6.

Concept lines (changed items only):
- 5.1: pass (M9).
- 5.2: pass after H1 (M2, M3).
- 5.3: pass (M6).
- 5.4: pass (M4).
- 5.5: pass.
- 5.6: pass (M7; L1).
- 5.7: pass (M8).
- 5.8: pass (M1, M10).
- 5.9: pass (M5, M6).

Four of the five named v3 HIGHs are confirmed fixed (5.2 [18], 5.2 [15](c), 5.6 [11], 5.2 [5]). 5.2 [9] is only half fixed: the phrase is on the pages and the answer "claims" is the book's, but the stem's own word "demand" leaves a second natural answer. No new HIGH came from the other 41 changed items.

Verdict: NOT load-ready as it stands. One-word fix to 5.2 [9] ("his demand" to "his wish"), then load-ready. The MEDIUMs (strawman decisions M4, M5; M6-M8; M10) are worth doing but are not blockers.
