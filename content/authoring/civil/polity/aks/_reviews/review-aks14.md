# Review: aks14.json (State Executive), 140 questions

Verdict: **FAIL (2 HIGH)**. Fix the two HIGH items, then re-check; the MEDIUM list is worth fixing in the same pass.

Counts: HIGH 2, MEDIUM 14, LOW 11.

## Mechanical checks (script over all 140)
- Format mix is 5 direct / 9 which / 3 howmany / 2 stmt12 / 1 match in every concept. This follows the brief. Against the 2020-26 trends column it is close: direct 25% vs 26%, Statement-I/II 10% vs 6%, how-many 15% vs 12%.
- Ids are unique, o[0] equals `a`, every item has 4 options and 3 `w` lines.
- For all 63 "which" items, the correct statements named in the explanation match the key. The false and true statements named in each `w` line match the option it sits against, and the `w` order follows the `o` order. All 21 how-many keys equal the count of "is correct" statements in the explanation. No problems after the 11 hand edits.
- Direct and match `w` lines were read against the edited options and all fit.
- `check-civil-pack.py` reports 0 problems.
- `dup-check.py` reports nothing at 0.7 or above. The highest scores are 0.60-0.67 and are parallel President/Governor wordings (see LOW).
- `aks-coverage.py --chapter 14`: 291 facts, 279 covered, 12 skipped, 0 uncovered. All 12 skips are legitimate. By concept: 14.3 has 5 of 42 (11.9%, just inside the 12% cap), 14.2 has 1, 14.4 has 2, 14.5 has 2, 14.6 has 1, 14.7 has 1.
  - The five 14.3 skips (091, 098, 103, 106, 108) are the contested 2025 Tamil Nadu Governor case, the Presidential Reference and notes-only claims.
  - 132 and 133 are instance lists not in Laxmikanth.
  - 540 is an unusual claim not in Laxmikanth.
  - 563, 602 and 633 are verify-conflict facts whose notes say not to test them.
  - 081 is untestable.
- Verify-flag facts that were tested in corrected form all check out:
  - 076: the Governor cannot pardon a death sentence (Q203).
  - 114: Art 304(b), not 255 (Q311).
  - 138: the hung-House order per Laxmikanth p.470 (Q305, Q314).
  - 542/544: S.R. Chaudhuri (Q512, Q518).
  - 148: Art 174.
- Page tags (`pg` of the notes) were spot-checked against the page markers of ch14.txt. Two-months notice (p.119), Contingency Fund (121), Jagdambika and Mahabir (128), Zonal Council (130), Tuensang and Hill Areas (138) and Deputy CM (134) all land on the tagged pages. I found no wrong tag.

## HIGH

### H1. Q214 (AKS-14.2, CS-POL-aks14-214): key "1 only" depends on a contested statement
- Statement 1 reads "if he withholds assent the Bill ends". That is the pre-2025 absolute-veto reading, which Laxmikanth p.459 follows.
- The Presidential Reference opinion (Nov 2025) treats withholding assent as withholding and returning the Bill with comments. It rejects a bare withholding that kills the Bill, so statement 1 is now disputed in real law.
- Statements 2, 3 and 4 are clearly false and statement 1 is the only candidate, so a challenge would leave the item with no key.
- The stem has no "according to Laxmikanth" qualifier. The brief says contested law must be attributed or tested via a stable rule.
- Fix: add "according to Laxmikanth" to the stem, or replace statement 1 with the stable rule that the Governor must assent to a re-passed Bill.
- The same wording sits in Q308 (statement 2, see M2) and in distractor 3 of Q301.

### H2. Q408 (AKS-14.4, CS-POL-aks14-408): key relies on a notes-only claim, and the statement cites the notes
- Statement 1 reads "According to the notes, the Calcutta High Court in Mahabir Prasad v. Profulla Chandra took a textual view ... now regarded as outdated".
- The inventory note for A14-143 says the case is "not in Laxmikanth".
- The statement is true only by attribution to the notes and cannot be checked by any candidate. It breaks the brief's rule never to mention the notes in a stem.
- The key "1 and 3 only" against "3 only" turns entirely on it, so there are two defensible answers. A candidate who ignores an unverifiable claim picks "3 only".
- Fix: drop the case. Replace statement 1 with a Laxmikanth-backed fact, for example the Bommai or Jagdambika floor-test rule or Art 164(1) pleasure.

## MEDIUM

- **M1. Q108 statement 4.** "Civil proceedings in respect of his official acts cannot be instituted during his term" is true but incomplete.
  - Art 361(1) bars answerability for official acts at any time. The notes' known error is "immunity only during term", and this statement repeats the same slant.
  - It also overlaps statement 1. Say "at any time", or turn it into a Rameshwar Prasad judicial-review statement.
  - Statement 3 (one month versus two months) is fine.
- **M2. Q308 statements 2 and 4, key "1 and 2 only".** The "absolute veto ... Bill fails" definition is the same contested point as H1. It is defensible only as a definition. Add "in Laxmikanth's classification".
- **M3. Q508 statement 3.** "A Minister disqualified under the Tenth Schedule ceases to hold office" is not in Laxmikanth.
  - It is derived from Art 164(1B) plus the Tenth Schedule and comes from the notes alone.
  - The option "1 only" is on the sheet, so the key "1 and 3 only" is open to challenge.
  - Replace it with a Laxmikanth fact such as the 91st Amendment's bar on appointment for the rest of the term.
- **M4. Q713 statement 4 and Q714 statement 2 (the same slippery claim).** Both say the CM and Council "must come from the majority party or coalition" (713 true, 714 false).
  - A minority government with outside support, or a CM chosen under the Sarkaria order, is a counter-example.
  - Both keys, "1,3,4" and "3 only", break if the claim is disputed. Use "must command the confidence of the Assembly".
- **M5. Q309 statement 1, Q316 statement 2 and Q315 statement 3.**
  - Q309 statement 1 says reservation is "generally on the advice of the Council of Ministers" but the Governor may reserve independently.
  - Q316 statement 2 says Art 200 gives "no unfettered discretion".
  - Q315 statement 3 says discretionary reservation covers "serious constitutional concerns such as basic structure or federal principles".
  - All three are notes prose. Laxmikanth p.457 gives only the Soli Sorabji list and the obligatory High Court case. The Nov 2025 Reference opinion also goes the other way on aid and advice for Art 200.
  - Q309's key "1 and 3 only" depends on statement 1. Q315's count "Only three" depends on statement 3. Re-base both on Laxmikanth p.457 or remove the claim.
- **M6. Q310 statement 2.** "During a Financial Emergency ... Bills are to be reserved" overstates Art 360(4)(b). The President may direct reservation. Say "may be directed to be reserved". The key is still "all four", but the wording is loose.
- **M7. Q610 statements 2 and 3, and Q611 (all four true).**
  - They carry vague descriptive claims from the notes: "policy filters", "horizontal coordination", "many States constitute Finance or Economic Affairs Committees".
  - An all-true item built on unverifiable generalities is unfair. "Many States" cannot be falsified. Q610's key rests on statements 2 and 3 being true.
  - Use Laxmikanth p.478-479 facts: Cabinet Committees are extra-constitutional, set up by the CM, and the Cabinet can review their decisions.
- **M8. Statement-I/II where II restates I.**
  - Q318: II says the Governor has no role after reservation. I says the Bill becomes an Act without his assent. II restates I.
  - Q418: II says the pleasure is co-terminous with Assembly confidence. I says a CM with a majority cannot be dismissed. II is the same idea.
  - The brief forbids II restating I. Also make Q618 II ("legal adviser, not policy-maker") a real cause.
- **M9. Repetition cap (2 per idea per concept) exceeded.**
  - 14.3: "Governor has no role after reservation" appears in Q306 s4, Q307 s3 and Q318 (both statements). The "maximum stability, minimum discretion" slogan and the temporary hung-House discretion appear in Q313, Q317 and Q319. The Money Bill cannot be returned appears in Q306, Q307, Q315 and Q219 (14.2).
  - 14.4: "CM with majority cannot be dismissed" appears in Q407 s2, Q414 s4, Q416 and Q418. The CM as vice-chair of the Zonal Council or a member of NITI appears in Q402, Q403, Q413 and Q420.
  - 14.5: Art 163(2) finality and 163(3) appear in Q505, Q506 and Q515. The Second Schedule and State Legislature fix ministers' salaries appear in Q510 and Q516 (twice, with Q516 s1 and s2). The 91st Amendment limits appear in Q501, Q508, Q509 and Q519. Bihar's tribal minister appears in Q502 and Q517.
  - 14.6: Deputy CM appears in Q601, Q608 and Q620. Council versus Cabinet appears in Q604, Q606 and Q619. The Advocate-General's pleasure and removal appears in Q603, Q612, Q616 and Q617.
  - 14.7: 371J appears in Q702, Q711, Q718 and Q720. Nagaland "Acts do not apply unless the Assembly decides" appears in Q701, Q706 and Q719. In 14.7 the joint-Governor, 7th-Amendment, impeachment and five-year-term material is repeated across Q713, Q714 and Q715.
  - Also across concepts, the direct-election and Canadian-model idea runs through Q104, Q106 s2, Q112 s3 and Q113.
  - Replace one occurrence of each with an untouched fact or an `idea` already marked ok.
- **M10. Key-shape tell in direct items.** The key is the longest or tied-longest option in 14.1 Q104; 14.3 Q301 and Q304; 14.4 Q404; 14.5 Q501 (all four tied), Q502 and Q505; 14.6 Q601, Q603, Q604 and Q605; 14.7 Q702 and Q703. That is 3 of 5 in 14.5 and 4 of 5 in 14.6, over the roughly one-third guideline. Shorten the keys or lengthen the distractors in 14.5 and 14.6.
- **M11. Q505 key.** "The Governor himself decides ... though finality does not allow arbitrariness" is hedged and verbose, and is the longest option. The hedge is also a leak. State the Art 163(2) rule cleanly in the key and keep the arbitrariness point in the explanation.
- **M12. Q314 statement 4** ("leader of the single largest party has been invited even when a post-poll alliance claimed a majority, and such cases criticised") is notes-only (p.127). It is true in practice (Karnataka 2018) but not in Laxmikanth. It is counted as true in the key "2,3,4 only".
- **M13. Q215/Q216/Q313 trap type.** Q313 statement 3 ("maximum discretion with minimum stability") is a reversed slogan from the notes and tests the slogan rather than law. Q317 statement 4 and Q319 II use the same slogan. Acceptable as a reading trap once; it is used three times.
- **M14. Q111.** The explanation for statement 1 correctly says Art 154 gives the executive power, but check that the other packs do not already test "Art 153 vs 154" (dup-check 0.62 against lk18's Art 53). Re-angle if so.

## LOW

- L1. Q203 stem should say "according to Laxmikanth": the Governor's power to pardon a death sentence is a Laxmikanth convention, and some judgements read Art 161 widely.
- L2. Q109 statement 3: removal "without giving reasons". B.P. Singhal (2010) requires non-arbitrary removal, though reasons need not be disclosed. Add "need not disclose reasons".
- L3. Q118 statement-I is unqualified. Criminal proceedings for official acts remain barred after the term. Say "for personal acts".
- L4. Weak or absurd distractors: Q405 (Chief Justice or Election Commission advising dissolution), Q504 (present only when the Governor addresses), Q419 II (AIS appointed by the State CM), Q715 statement 4 ("office for life"), Q603 option 4. These make elimination too easy.
- L5. Q101 distractors invent "as amended by the 42nd/44th/1st Amendment" riders for Arts 155, 156 and 158. They are false but misleading as law. Plain Article labels would be cleaner.
- L6. Q716 uses present-tense Tuensang provisions, which are time-bound under Art 371A(2) (ten years or as extended). The stem says "according to Laxmikanth", so it is acceptable. Add "as provided in".
- L7. Q711/Q718/Q720: "Hyderabad-Karnataka" region was renamed Kalyana-Karnataka in 2019. The Article text still says Hyderabad-Karnataka, but note it in the explanation.
- L8. Q519 (two unrelated statements), Q719 and Q619 (obviously false statement-I) are trivial elimination items. Fine as format variety, but not hard.
- L9. Q112 statement 4 (Governor's salary Rs 3.50 lakh, 2018) is time-sensitive. "According to Laxmikanth" is in the stem, which is enough.
- L10. dup-check near matches (0.60-0.67), parallel to Union versions: Q620 vs lk20-099, Q520 vs lk21-720, Q307 vs lk18-515, Q107 vs lk18-210, Q519 vs aks19-012, Q510 vs aks10-106, Q615 vs aks10-157, Q410 vs lk21-748, Q111 vs lk18-806, Q109 vs lk18-306. These are not copies, but a few statement stems are one word away from the President version. Re-angle Q107 s3, Q109 s1, Q615 s2 and Q510 s2.
- L11. Q606 statement 2 is false for two reasons: "four categories" and "Constitution prescribes". The explanation says "three categories". Make the false element single.

## Per-item results (answered cold from Laxmikanth/real law, then checked against the key)
All 140 keys were recomputed. Every key agrees with Laxmikanth and settled law except where flagged above (Q214, Q408, and the MEDIUM items whose key depends on a flagged statement: Q308, Q508, Q713, Q714, Q309, Q315, Q610).

Specific checks that came out right:
- Art 153 proviso and the 7th Amendment (Q101); Art 157 (Q102); Art 159 oath before the High Court Chief Justice (Q103); Art 160 and the death of a Governor (Q105, Q116).
- Art 361 criminal immunity and two months' notice (Q108); the Governor's oath wording versus the Minister's oath (Q110, Q510).
- Art 161 clemency, no court-martial power, no pardon of a death sentence (Q203, Q213); Art 234 (Q204); the ordinance six-week rule and D.C. Wadhwa (Q205, Q216).
- 94th Amendment tribal ministers: Bihar dropped, Chhattisgarh and Jharkhand added (Q206, Q502); the 104th Amendment ended Anglo-Indian nomination (Q210).
- Art 200 proviso, return and re-passage, High Court derogation (Q211, Q302, Q303); Art 201's six months (Q214 s3).
- The Money Bill cannot be returned (Q219, Q306, Q307); Arts 254(2), 288(2), 31A, 31C, 360 and 304(b) (Q310, Q311).
- Sarkaria order (Q305, Q314); the Bommai, Nabam Rebia and Rameshwar Prasad pairing (Q320); Jagdambika Pal (Q404); B.R. Kapur and S.R. Chaudhuri (Q409, Q512, Q513, Q518).
- Art 164(1A)/(1B) numbers and the 91st Amendment (Q501, Q503, Q509); the 164(4) six-month rule (Q508, Q517); Art 166/167/177 mapping (Q511, Q520).
- Advocate-General: Art 165, ten-year qualification, pleasure, no fixed term, remuneration set by the Governor (Q602, Q603, Q612-Q617); the Attorney General's Art 76 and 88 contrasts are right.
- Arts 371 to 371J: states, regions, minimum Assembly strengths, amendment numbers (13th 1962 for 371A, 22nd 1969 for 371B, 27th 1971 for 371C, 32nd 1973 for 371D/E, 36th 1975 for 371F, 53rd 1986 for 371G, 98th 2012 for 371J) and the Tuensang provisions (Q701-Q720).
- The Art 371C Manipur special-responsibility error in the notes' "only five Governors" box is avoided. Q707 states the Manipur Governor's responsibility correctly.

## Falsifier rule
No distractor was found to be also supported in real law, apart from the points above. Several false statements use "tell" absolutes ("only", "always", "never", "any") but these are balanced by true statements using them equally in most items. Q417 s4 and Q412 s3 use "free to reject" and "automatic", which is acceptable because the true statements use "normally binding" and "must".

## Notes error handling
- Art 361: the pack does not repeat the notes' "only during term" error in a statement it needs to be true, apart from M1.
- Tamil Nadu 2025 and the Presidential Reference are skipped in the skip list, but H1 and M2 show the legacy Laxmikanth reading of withholding assent still appears unqualified.
- Art 304(b) not 255 (Q311), Art 174(2)(b) (Q405 gives Art 174 only, which is safe), Ashok Pandey (not tested), Advocate-General right of audience (not tested), Art 371C Manipur (Q707, Q720 area) and the hung-House order per Laxmikanth (Q305, Q314) are all handled correctly.
