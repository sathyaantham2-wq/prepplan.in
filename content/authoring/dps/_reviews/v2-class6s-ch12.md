# Review: class6s ch12 (SST6, fees112, Grassroots Democracy Part 3) - first review

Pack: content/authoring/dps/class6s/ch12.json. 124 questions read, none sampled (20/20/21/20/22/21).
Index = 0-based position inside the concept's question list (so "12.5 Q14" = C6S-12.5, index 14).
Every number, date, population band and case-study part was recomputed in python: no arithmetic error.
Every mcq / assertion_reason / multi_statement / match key equals o[0] (script check). Step marks sum to `m` everywhere.
No scope_out violation (grepped for Mayor, 74th, reservation, councillor, Zila/Samiti detail, Kolkata: none).
The author correctly avoided the "City Council (Nagar Panchayat)" artefact.

## HIGH (the page text does not settle the key; figure 12.4 icon placement)
Figure 12.4's extracted text lists the headings (PROPERTY TAX, WATER CHARGES, SOLID WASTE MANAGEMENT, BUSINESS/HOARDINGS/TRADE LICENSES, CRM - MARRIAGE CERTIFICATE / FIRE SERVICES / VARIOUS LICENSES / WATER TANKER, DEBRIS CLEARANCE / GRIEVANCES / SERVICES ON REQUEST, TREE CUTTING) and then, as one loose line, the icon labels "Water Tanker, Septic Tanker, Auditorium, Funeral Van, Mobile Toilet, Ambulance". Nothing in the text says which heading each icon sits under. (I could not render the PDF page here; if the page image shows the icons clearly under "CRM - services on request", downgrade these three to MEDIUM and still add a stem line saying so.)

1. 12.5 Q14 "An Indore family needs a mobile toilet for a wedding reception ... Under which heading": key "CRM: services on request". Not settled by text. A second defensible answer exists: "Solid waste management" (sanitation) is an option, and a mobile toilet could equally sit beside "water tanker, debris clearance". Fix: ask about an item whose heading is printed in words (marriage certificate, fire services, property tax), or drop the question.
2. 12.5 Q18 match, row 1 "Booking a funeral van" -> "CRM: services on request" (key 1-c). Same dependency. Fix: replace row 1 with "Getting a marriage certificate" -> "CRM: marriage certificate" style heading, or state in the stem that vans, tankers and similar items sit under "services on request".
3. 12.5 Q8 case study, part (b) "Which two of her tasks fall under CRM headings other than grievances": key = marriage certificate + auditorium booking (under "services on request"). The auditorium placement is figure-only. Part (d) is fine (chapter says the list is simplified) but part (b) key is not safe. Fix: use "fire services" or "various licenses" as the second task instead of the auditorium, or tell the solver that icons are services on request.

## MEDIUM
Figure 12.2 row order (inferred from extraction order, not stated in prose; verify against page image before loading)
4. 12.1 Q0 point 5 and Q14, 12.2 Q1 point 2 and Q19 point 2, 12.6 Q9 (fill_blank "ward committee", "the body just above the people of the ward"). The prose never says people of the ward are the bottom row or that the ward committee sits directly above them; only the figure text order "Ward Committee / People of the Ward" does. Probably right (matches the real pyramid), but 12.6 Q9 and 12.1 Q14 rest only on it. Confirm on the page image.

Wrong-key risk / second answer
5. 12.5 Q9 assertion_reason, key "R explains A". R only says a Council is for 1-10 lakh; it excludes Council for 40,000 but does not itself give Nagar Panchayat. "Both true, R not the correct explanation" is defensible. Fix: make R the Nagar Panchayat rule ("smaller populations than 1 lakh have a Nagar Panchayat") or make A "would not have a Municipal Council".
6. 12.6 Q20 part (a) row 4 "How hard it is to be heard - City: ?" key "it seems more complicated". Anita says democracy seems more complicated in the city; the book never says whether city people are heard. Other answers ("everyone's voice matters", "not stated") fit equally. Fix: relabel the row "How it seems to run" or accept a stated range.

Case-study weaknesses
7. 12.3 Q12 (leak litres): parts (b), (c), (d) are arithmetic only, answerable from the stem; only (a) needs the chapter. Part (d) is decided by the numbers alone (8,550 vs 450). Fix: make (d) hinge on a chapter fact too (who reports, what the body can and cannot do) or reduce arithmetic steps.
8. 12.3 Q17 part (c) is a lakh-to-crore sum with no chapter content, and (d) is a strawman (new garbage trucks vs residents' reports "to show participatory democracy"). Fix: replace (c) with a chapter-linked sorting and give (d) a real trade-off.
9. 12.1 Q6: part (b) is readable straight off the extract in the stem; part (d) motion "only for collecting garbage" is an absolute-word strawman. Fix: have (b) ask for a thing the extract implies but does not list, and a two-sided motion.
10. 12.2 Q18 (log): part (d) is obvious (report the unreported leak, not the reported drain) and ignores that the pothole is also unreported; the chapter's "report promptly" reason is about citizens, not the committee. Part (c) is a vocabulary check.
11. 12.6 Q20 part (c): Line X (festivals) is a strawman for a poster about local government.

Easy in disguise (answer is one line the book states). Mark as "Hard" is not earned:
12. 12.4 Q13 (charter by EIC, previous year: 1687), 12.4 Q6 (original names), 12.4 Q15 (a), 12.5 Q12 (a CRM), 12.5 Q13 (a Swachh Survekshan, seven years), 12.2 Q10 (a "decentralised"), 12.2 Q12 (a), 12.1 Q10 (a), 12.1 Q2 (Big Questions), 12.6 Q3, Q8, Q19, Q11 (a) and Q15 (two features / similarities listed in the book), 12.5 Q19 (solid waste = garbage collection). 12.1 Q11 and 12.4 Q18 fill_blank are one subtraction of two stated years. Roughly 16 items. Fix: for the short ones, fold the fact into a decision (as done in the best items) or retire and replace with scenario mcq.
13. true_false with key "True" and no misconception to correct: 12.3 Q20 and 12.6 Q7 simply restate a book line. The type needs a real misconception and a correction. Fix: invert each into a plausible false claim (e.g. "residents have no duties; the body does everything").

Repeated ideas (anti-template)
14. 12.4: the 1688-vs-1865 gap (177 years) is used in Q14, Q17, Q18, Q19; 1865 age in Q4, Q12, Q19; "1688 vs 1792" in Q1, Q2, Q3, Q11, Q14; the 16 km radius in Q1(d), Q8, Q10; the 1687 charter year in both Q9 and Q13 (near duplicates). About eight of 20 items test the same few dates.
15. 12.5: the population-band rule is tested in Q1, Q3, Q4, Q5, Q6, Q7, Q9, Q10, Q17(d), Q20, Q21 (11 of 22). Different surface, one idea. Replace three with Fig 12.4 / Indore content that the text does settle.
16. 12.3: segregation -> easier garbage collection in Q2, Q4, Q11, Q19; leak reporting in Q8, Q12, Q15.
17. 12.5 Q11 (sort six Indore services into money / permissions / help sent): icon-based items (funeral van, mobile toilet, ambulance) are placed by common sense, not by the figure; "any two" rubric hides this. Same root as items 1-3; at least use headings printed in words.

## LOW
18. Hard-coded "2026" in answers (12.1 Q4 stem, Q11 key 77; 12.4 Q1(b) 234, Q4 161/2065, Q14, Q19 338/161). Keys go stale in 2027. Acceptable if the bank policy tolerates it; otherwise give the year in a stem line ("in the year 2026").
19. fill_blank equivalents: 12.5 Q6 key "3.6" (also 3.60, 360000 if "lakh" is dropped; stem fixes lakh so mostly safe); 12.6 Q9 "ward committee" (accept "ward committees", "Ward Committee"); 12.1 Q11 "77" fine. State the accepted forms.
20. 12.4 Q6 distractors "Fort St. George Charter; Bombay Nagar Palika" and "Madras Mahanagar Nigam; Fort St. George Corporation" are not real chapter confusions (nonsense mixes).
21. 12.2 Q19 point 3 infers that "the authorities" are the body above the ward committee; the chapter does not say so. 12.1 Q9 / 12.2 Q0 fine otherwise.
22. 12.4 Q17 point (v) rubric is vague ("city government is old and continuing").
23. Option lengths: correct option strictly longest only in 12.2 Q11 (53 vs 52) and 12.6 Q3 (54 vs 51); negligible (2 of 30 mcq). Correct options tend to carry a "because" clause, minor.

## Template counts
- Bloom: Analyse 53, Apply 31, Evaluate 28, Understand 8, Create 4 of 124 (Remember 0). Difficulty: Hard 94 / Hardest 30. No Easy/Medium.
- Types per concept: 8 short_answer, 4-5 long_answer, 4-6 mcq, one each of assertion_reason, multi_statement, plus match (12.2-12.5 one; 12.1, 12.6 none), fill_blank (12.1, 12.4, 12.5, 12.6), true_false (12.2, 12.3, 12.5, 12.6), claim_check in all six. Slot order differs per concept (not identical).
- claim_check verdicts (8): partly right x2 (12.1, 12.2), not supported x3 (12.3, 12.4, 12.6), right/supported x3 (12.5, 12.6, 12.3 as "No") - mixed, fine.
- multi_statement keys: "2 and 3 only", "1 only", "1, 2 and 3", "1 and 3 only", "2 only", "1 and 2 only" - well spread.
- assertion_reason keys: explains x2, not-explains x2, A true R false, A false R true - spread fine.
- Option position named in an answer/step: none.
- match: 4 items, keys 1-c style, not all in order; fine.
- Verdict on templating: not templated in form; templated in content (items 14-16).

## Verdict per concept
- C6S-12.1: pass after fixes (items 4, 9, 12, 13 as listed; no HIGH).
- C6S-12.2: pass after fixes (items 4, 10, 12).
- C6S-12.3: pass after fixes (items 7, 8, 13, 16).
- C6S-12.4: pass after fixes (items 12, 14, 18, 20).
- C6S-12.5: rework three items (HIGH 1-3) plus items 5, 15, 17.
- C6S-12.6: pass after fixes (items 4, 6, 11, 12, 13).

Overall: pass after fixes. Counts read: 124. HIGH 3, MEDIUM 14 (items 4-17), LOW 6 (items 18-23).
