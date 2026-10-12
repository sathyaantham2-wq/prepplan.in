# Review: packs/ncert_polity4.json (CVP-4.1 to 4.7, 140 questions)

Verdict: **needs-fix** (2 HIGH). 10 MEDIUM, 9 LOW.

Method: all 140 stems re-read; every key recomputed cold from the Class 9 chapter text (content/extracted/iest106, book pp.137-157) and Laxmikanth 8e (content/reference/civil-services/laxmikanth/chapters, pdf pages) before looking at the key. Every cited Laxmikanth fact was grepped to its pdf page (helper in scratchpad/rv4/g.py). Result: all 140 keys are right against the cited sources; the two HIGH items are about two defensible readings, not a wrong key in the sources. dup-check.py output is in scratchpad/rv4/dup.txt.

Format mix (140): direct 35 (25%), which-statements 63 (45%), how-many 21 (15%), Statement-I/II 14 (10%), match 7 (5%). 2020-26 column: direct 26, consider-statements 48, how-many 12, S-I/II 6. Close. S-I/II is about 4 points high; match is not a 2020+ format (see the format item below).

## HIGH

### CS-POL-ncp4-3-14 (which, statement 4)
Statement 4: "Decentralisation, through rural and urban local bodies, promotes the value of devolution of power" is marked INCORRECT only because the chapter table (p.144) puts "Devolution of power" in the Federalism row and "People's participation at grassroots level" in the Decentralisation row. In real law and in Laxmikanth, devolution of power to local bodies is exactly what the 73rd/74th Amendments do. This breaks the Falsifier rule (false only by the table layout) and a well-read candidate can defend "1, 2, 3 and 4" or "all of 2,3,4 correct". Two defensible answers.
Fix: drop statement 4 and replace with a genuinely false row swap, for example "In the judicial process the institutions are the Election Commission of India and the values are participation and equality" (false in real life), or ask "according to the table in the chapter" and swap the statement for a clear cross-row error (Lokpal listed under Electoral Process). Do not rely on the second column being exclusive.

### CS-POL-ncp4-6-07 (which, statement 2) with echo in 6-17 explanation
Statement 2 "Each autonomous district council has 30 members, of whom four are nominated by the Governor and 26 are elected" is keyed CORRECT. Laxmikanth p.596 prints this, but the Sixth Schedule (para 2) says "not more than thirty members, of whom not more than four nominated", and in practice the Bodoland Territorial Council has 46, the Mizoram councils have 25 or 20 elected plus nominees, Tripura TTAADC 30 elected plus 2 nominated. "Each ... has 30" is false in real law, so "1 and 4 only" is defensible and the "correct" status of statement 2 is a currency problem (statement was true for the original 1950s councils only).
Fix: reword statement 2 to "An autonomous district council has not more than thirty members, of whom not more than four are nominated by the Governor". Same softening in 6-17 explanation (statement 1 there stays false at 40 and 10, so the key does not change).

## MEDIUM

- **CS-POL-ncp4-3-16 (howmany, statement 1)**: Question Hour is described as "the first hour of a parliamentary session" (NCERT margin note wording). In real procedure it is the first hour of every sitting. A careful student can mark statement 1 wrong and land on "Only one". Fix: "first hour of a sitting of the House".
- **CS-POL-ncp4-7-17 (howmany, statement 3)**: "The 44th Amendment retained that immunity from judicial review" has no antecedent; statements 1 and 2 never mention an immunity. The 38th Amendment immunity (Laxmikanth p.260) must be stated. Key stays (statement 3 false) but the stem is a reading trick. Fix: statement 3 -> "The 38th Amendment made the declaration of a National Emergency immune from judicial review, and the 44th Amendment retained that immunity", and state 38th content in the explanation.
- **CS-POL-ncp4-7-12 (which, statement 3)**: "The Constitution itself uses the word 'emergency' for the failure of constitutional machinery in a state" is keyed false from Laxmikanth p.259. Part XVIII of the Constitution is titled "Emergency Provisions" and includes Article 356, so the word is attached to the situation at the Part level. Defensible challenge. Fix: restrict to "Article 356 itself uses the expression 'emergency' for the failure of constitutional machinery" (false, and tied to the Article text), or drop.
- **CS-POL-ncp4-5-03 and 5-20 (Swiss executive)**: the handling of the NCERT vs Laxmikanth conflict is correct in substance (Federal Council, collegial, President first among equals; matches real Swiss practice) and the explanation says so. But the NCERT-only reader sees "The President is the Head of the Government" in the book table p.148 and the stem of 5-03 does not say "according to Laxmikanth". Fix: add "according to Laxmikanth" to the 5-03 stem and to the 5-20 List-II item 2 or the stem. 5-14 statement 4 (executive lies with Federal Council) is safe.
- **CS-POL-ncp4-6-06 (which, statements 1 and 3)**: "More than one million polling stations" and "over 2,800 registered political parties" are stated as flat facts in the stem; the explanation says "as reported in the chapter" but the stem does not. Voter, party and polling-station counts move every cycle (96.8 crore was the 2024 figure). Fix: lead-in "According to the chapter's figures (2024)" or "as reported in the chapter".
- **Pack tell, longest key**: in 19 of 35 direct MCQs the key is the longest option (1-01, 1-04, 1-05, 2-02, 2-04, 2-05, 3-02, 3-04, 4-01, 4-03, 4-04, 5-01, 5-03, 5-05, 6-04, 6-05, 7-01, 7-04, 7-05). 54% against 25% by chance; worst offenders 2-02, 4-01, 4-03, 6-05 (key carries its own reasoning). Fix: lengthen two or three distractors per item, or trim the key.
- **Pack tell, statement 1 true**: in the 63 which-statement items statement 1 is correct in 57 (90%); combinations without "1" are only 6 keys. Candidates can drop options. Fix: make statement 1 false in about a third of items (move the false statement to position 1 in 1-10, 2-06, 3-06, 4-09, 5-09, 6-12 and similar), balancing which statement is false.
- **Near-duplicates against other packs (dup-check)**: the Mode C upgrade re-asks facts already in lk/aks/ncert packs. Closest: 1-17 (national song/anthem/flag) with lk02 ch02-411; 1-12 with lk02 ch02-606; 1-09 statement 1 with ncert_polity2 ncp2-3-16 and statement 3 with lk05 ch05-116; 5-05 with ncert_polity3 ncp3-4-16 (almost word for word); 2-02 with ncert_polity3 ncp3-6-08 (same Dicey fact, opposite polarity); 3-01 with ncp3-6-09; 6-19 with lk39 ch39-092; 7-03 with aks13-002; 7-19 with aks13-055; 3-11 with aks21a-106; 7-10 with aks13-026. Fix: re-angle or drop 1-17, 5-05, 6-19, 7-19, 3-11 (the strongest). 47 lines in total over 0.6 overlap.
- **Within-pack repetition**: Dicey in 2-02 and 2-08; Article 21A in 2-03, 2-13, 2-20; CAG in 3-02, 3-09; PIL in 3-08, 3-19, 4-14; PESA in 6-03, 6-08, 6-19; ADC in 6-07 and 6-17. Acceptable, but swap one of each cluster if you need room for under-covered NCERT content (Rule of Law, participatory democracy, media).
- **Format**: 7 match-the-following items (5%). Match is absent from the 2020-26 column of the trends doc and recent UPSC papers. Consider converting some to how-many or S-I/II-with-reasoning, and bring S-I/II (10%) down toward 6%.

## LOW

- 2-04 near-duplicates tagged PYQ UPSC-POL-2002-086 (Ambedkar, "heart and soul of the Constitution"); this is a classic repeat. Keep as a trap-free recall item or swap.
- 2-10 statement 1 overlaps with UPSC-POL-2025-479 statement on Governor not answerable to court (same Article 361 fact). Fine as a revision item.
- 5-16 statement 3 dates the Swaran Singh Committee to 1975 (Laxmikanth p.211 says 1975, ch10 p.188 says set up in 1976). The key is unaffected; consider "the Swaran Singh Committee" without a year.
- 7-10 statement 1 "six Fundamental Rights under Article 19": Article 19 guarantees six freedoms (one of the six rights is Article 19 as a whole). Reword "the six freedoms in Article 19".
- 1-05 pg includes 142, which does not contain the fact; drop it.
- 3-04 distractors (Administrative Reforms Commission, Law Commission) are weak; add Second ARC or Dinesh Goswami.
- 4-03, 4-07 (statement 4), 1-10 (statement 3), 7-01 option 3: absurd distractors that reward elimination without knowledge.
- 6-15 and 4-17 test local-award and student-wing trivia with low exam value; acceptable at 2 of 140.
- 3-12 statement 4 follows Laxmikanth p.726 ("aided" institutions excluded); real Lokpal Act wording is "financed wholly or partly" and the exclusion of "aided" bodies is Laxmikanth's gloss. Keep, since the key is correct on both readings.

## Items checked and confirmed (no action)
- Article 21A handling: keys in 2-03, 2-13 (statement 3), 2-20 (C-2) follow real law (86th Amendment Act 2002; RTE Act 2009 is the follow-on statute). Distractor "RTE Act 2009 itself" is a fair trap because 2-03 explanation explains that an ordinary Act cannot insert an Article. Handling is right. Suggest adding one line to the 2-03 explanation: the chapter's "added in 2009" refers to the RTE Act.
- Swiss President: handling right (see the 5-03 item).
- Key recomputation: 1-01 to 7-20, all keys agree with the source. Falsifier rule holds for all false statements except 3-14 (S4) and the two flagged above.
- Voter counts / party counts: all worded "as reported" in explanations; stem fix only in 6-06.
- Currency: Lokpal (8 members, 50% judicial), CAG (6 years/65), CIC (not reappointable per Laxmikanth), CVC (4 years/65 not asked), Emergency provisions, Swiss council sizes (46/200), 73rd/74th Amendment counts all current.
- pdf_page citations: spot-checked every Laxmikanth page cited in explanations; all match except 1-05 (142).
