# Final verification: aks12, aks13, aks20a (2026-10-12, fresh pass)

Packs not edited. Report written pack by pack (aks12 first, then aks13, then aks20a). Method per pack: every question answered cold from Laxmikanth and the notes (ch12.txt) and real law BEFORE reading the key; then compared with o[0]. Script checks: ids unique, key = o[0] = `a`, 4 distinct options, 3 w lines each aligned to o[1..3], match items carry List-I A-D and List-II 1-4, no "notes/Shashank/AKS" in any stem or option, `fi` present, the "Statement n is correct/incorrect" truth set in the explanation recomputed against the key (which and howmany), key-longest rate in direct items, `fi` repetition per concept, dup-check, aks-coverage.

## PART 1 - aks12 Parliamentary Committees (80 questions)

Script: ids unique (80); 0 key/truth-set mismatches across all 53 statement items; mix per concept 5 direct / 9 which / 3 howmany / 2 stmt12 / 1 match in all four concepts; direct key is the longest option in 1 of 20 (fine); w lines align with o[1..3] (the two or three heuristic flags on 103/301/305/402/404/405 were read by hand and are aligned); `check-civil-pack.py`: 0 problems. Coverage `--chapter 12`: 146 facts, 136 covered, 10 skipped, 0 uncovered. dup-check: highest in-pack-relevant hit 0.75 (aks12-403 option text vs aks11b-047, different question), no real duplicate.

Cold answers: all 80 agree with the keys; each item has exactly one defensible option.

Specially verified rebuilds and repairs
- 304: key "every breach of privilege amounts to contempt, though some contempts breach no specific privilege" is exactly Laxmikanth ch23 p.379 ("a breach of privilege is always contempt"); the reverse option is a fair opposite; wording "according to Laxmikanth" is present. OK.
- 312: 1 and 3 only. 1 and 3 true; 2 false (no codified statute, p.379-380), 4 false (disobedience of an order is contempt, not breach of privilege, p.379). Single answer. OK.
- 316: Only two (2 and 4 true; 1 false since the House punishes outsiders, 3 false since a member's individual privilege is breached by assault). OK.
- 313: 1 and 2 only. Statement 2 ("Speaker generally the ex-officio President") is notes-only and the Laxmikanth text has no forums section; it is true in real practice and worded "generally", and the exception fids were skipped. Acceptable (LOW).
- 314: 1 and 3 only (JPC for Bills or financial irregularities; Joint Committee on Security in Parliament Complex is in Laxmikanth's ad hoc inquiry list p.395; consultative committees have no formal scrutiny; membership voluntary p.408). OK.
- 118: both true, II does not explain I (nomination vs ministerial bar). OK. 219: both true and II is the mechanism for I (see LOW). 418: both true, II does not explain I. OK.
- 120, 320, 420: List-I A-D and List-II 1-4 are all present; keys A-4 B-3 C-1 D-2 / A-2 B-4 C-1 D-3 / A-3 B-4 C-1 D-2 recomputed and correct; each option set differs from the others by a single swap pair.

HIGH: none.

MEDIUM
- Repetition cap (2 per idea per concept) is exceeded by one use in several ideas: Estimates and COPU chairman appointment A12-010/A12-017 are tested in 103, 107 and 117 (all three ask who appoints the chairman); PAC/COPU composition A12-008 in 102, 106 and 115; papers-laid/subordinate-legislation split A12-079 in 211, 218 and 220; privilege referral procedure A12-118 in 305, 311, 317. Match items 120/320/420 add a third use of fids by design, so the first three are the real overrun. Replace one of 107/117 and one of 106/115 with a different angle if the cap is to be strict.
- Concept AKS-12.4 (Indian Parliamentary Group) holds four off-topic items: 405 and 412 (emergency Articles, copied from a stray paragraph at the end of the notes chapter, and the same idea twice) and 411 and 413 (financial-committee composition and the committees-vs-groups line). They are factually correct and uniquely keyed, but they fall outside the concept name and 411 repeats 106/115 composition facts a third time. 405/412 also repeat aks13's content.

LOW
- 405: the key is the only option that writes "(President's Rule)"; the three distractors say "(failure of constitutional machinery)", a small shape tell (the swaps are still the real test).
- 107 and 117 are near twins (statements about who appoints the Estimates and COPU chairmen).
- 219: the explanation-link judgement is arguable (II is the route by which the PAC finds the lapses in I). Defensible; a reviewer could read II as restating I.
- 409, 410, 414, 417 have empty `fi` (Laxmikanth ch25 additions, within the 6-per-concept cap, each verified on p.410-413 above: friendship groups p.411, award 1995 and quarterly newsletter p.411, aims p.410-411, 'The Parliamentarian' and 'First Reading' p.413).
- Skipped facts, all with legitimate reasons: A12-031 (DRSC chair pattern vague in the notes, silent in Laxmikanth), A12-107 (cases attributed to Ethics Committees not in Laxmikanth), A12-122..125 (forum President exception, Vice-Presidents, strength 31, nomination: unconfirmed in Laxmikanth), A12-126 (IPU/PACE are not Indian forums), A12-127 (PACE count time-bound), A12-129 (generic background on caucuses), A12-141 (IPU count 153 in notes vs 179 in Laxmikanth, time-bound). 10 of 146 = 6.8%.
- Facts that changed after the exam year: none that matter; Ethics Committee RS strength is 10 in Laxmikanth against 13 in the notes, and 214-3 and 309-4 correctly say "according to Laxmikanth" (214-3 is a false statement under both, RS has 10 per Laxmikanth).

VERDICT aks12: PASS (zero HIGH).


## PART 2 - aks13 Emergency Provisions (60 questions)

Script: ids unique (60); key = o[0] = `a`; 4 distinct options; 3 w lines each aligned to o[1..3]; match items 017, 037, 057 carry List-I A-D and List-II 1-4; no notes/author name in any stem or option; every which/howmany explanation lists all statements and the recomputed truth set equals the key (0 mismatches); mix 5/9/3/2/1 per concept; direct key longest in 1 of 15 (fine); no option-set reuse over 2. `fi` empty only on 031 and 051 (Laxmikanth additions, cited to p.261/265/274 and verified). Coverage `--chapter 13`: 133 facts, 131 covered, 2 skipped, 0 uncovered. dup-check: highest hits 0.67 (aks13-048 and 042 against lk17 lines, different questions); no copy to re-angle.

Cold answers: I answered all 60 from Laxmikanth ch17 (p.260-274) and the notes (ch13, p.111-116) before reading keys. I initially mis-answered 051 (I took statement 2 as false); the key "Only three" is right, because Laxmikanth p.261 itself lists the two differences (Lok Sabha only, simple majority for disapproval vs both Houses, special majority for continuation) and Article 352(6) applies the special majority to continuation too. All other 59 agree with the keys, each with exactly one defensible option.

Specially verified
- 007: S-I (rights are alive, only enforcement suspended, Laxmikanth p.263) true; S-II (order may cover whole country or part, p.263) true; no causal link; key "II does not explain I" correct.
- 027: S-I true, S-II true (1962 proclamation in force till January 1968, Laxmikanth p.264); II is the stated reason, so "explains" is correct and defensible. 055: same logic, Laxmikanth p.260 gives the 1975 fait accompli as the reason for the written Cabinet recommendation; fine.
- 014: all four statements true (Assembly tenure by one year, Laxmikanth p.262; reduce or cancel revenue transfers; powers on the Centre and its officers; ordinances on State List subjects). Unique key "1, 2, 3 and 4"; no tell words. OK.
- 053: only the last option holds; the options about Article 19 suspension under President's Rule and Article 32 under Financial Emergency are plainly false. OK.
- 012: I recomputed to "2 only". Statement 3 says the 42nd Amendment confined the consequences to the State where the Emergency operates; Laxmikanth p.262 says the opposite (extends to any other state too), so it is a good false statement and labelled "according to Laxmikanth".
- 011-4, 020-2, 038-2, 036-3, 058-1 all rest on exact Laxmikanth lines (financial year end, p.262; no remedy after Emergency, p.263; Parliament, not State Legislature, sanctions expenditure, p.266; President cannot assume High Court powers, p.267; Ambedkar compared Article 360 to the US National Recovery Act 1933, p.272). Statement 058-1 (GoI Act 1935) is false in the sense the stem tests (Ambedkar named the NRA); no option makes it also true.
- 031-4 ("first imposed in 1959") is false: Laxmikanth p.268 says Punjab 1951. 008-2 and 052-4 use the Laxmikanth count ("more than 125", worded "according to Laxmikanth" in 052).

HIGH: none.

MEDIUM
- 044 (statement 2) and 047 (Statement-II): "Parliament cannot delegate its law-making on State List subjects during a National Emergency" is Laxmikanth's Table 17.1 point 3, but as a free-standing statement it is not safe in real law (Parliament can and does delegate rule-making in a statute). 044 and 047 do not say "according to Laxmikanth", so a well-read candidate could dispute statement 2 / Statement-II. Fix by adding "according to Laxmikanth" or by testing the contrast that President's Rule laws are President's Acts. Not HIGH because the stated source supports the key and a single defensible option remains.
- Repetition cap: A13-012 (approval within one month by special majority) in 001/002/017 and A13-007 in 002/017/019; one use over cap in each. Items 012 and 014 share two statements almost verbatim (ordinances on State List; powers on the Centre and its officers).
- 016, 022, 024, 026, 054 revisit Articles 358/359 and the 44th Amendment five times with overlapping statements (armed rebellion exception, Articles 20 and 21, emergency-related laws only). Each is correct but the density is above the cap for the idea "Article 19 not suspended on armed rebellion" (016-2, 021, 026-2, 054-2, 022 table).

LOW
- 033: "a challenge ... was allowed ... in the case decided in 1980" is loose; Minerva Mills held the proclamation reviewable on those grounds and did not strike down a proclamation. Rephrase to "held to be open to challenge".
- 031 and 051 have empty `fi` (Laxmikanth additions, allowed).
- Skipped A13-067 (judgment not named; ADM Jabalpur not in Laxmikanth) and A13-094 ("ideally within six months" election rule is in neither Laxmikanth nor the Constitution): legitimate reasons, 2 of 133.
- Time-sensitive facts ("more than 125", Financial Emergency never proclaimed): worded "according to Laxmikanth" or as a rule; no post-2024 change affects any item (no Emergency or Article 360 proclamation since).
- Format mix 27 which / 15 direct / 9 howmany / 6 stmt12 / 3 match is in line with the house standard and the 2020-26 column (multi-statement and how-many dominant, Statement-I/II present).

VERDICT aks13: PASS (zero HIGH).



## PART 3 - aks20a Constitutional Bodies part 1 (120 questions) - COMPLETE (resumed after cut-off; parts 1 and 2 above kept as completed)

Progress log (cold answer first, then key; sources Laxmikanth ch43 p.599-603, ch44 p.604-608, ch45 p.609-613, ch52 p.632-639, notes ch20):
- AKS-20.1 ECI (001-020): all 20 cold answers match the keys; each has exactly one defensible option. 014 (Baranwal): statement 1 false (CJI, not a Cabinet Minister, Laxmikanth p.600-601), statement 2 false (only until Parliament legislates), statement 3 true ("desirable", p.601) -> "3 only" correct. 015: only 3 and 4 true -> "Only two" correct. 054 not in this concept (checked below).
- AKS-20.2 (021-040, ECI reforms and CAG): all 20 cold answers match. 026 "1 and 3 only", 027 "1, 2 and 3 only", 030 "2 and 4 only", 034 "2 and 3 only" (Laxmikanth p.634-635: Auditor-General only, secret service certificate, accounts of the Centre relieved 1976 but States still compiled; 2006 Office Memorandum, not an amendment), 037 "Only one" (2023 Act names a Union Cabinet Minister, not the CJI; salary aligned with Cabinet Secretary) all recomputed independently.
- AKS-20.3 (041-060, audit reports, Finance Commission, UPSC): all 20 cold answers match the keys. Notes for the final severity list: 057 statement 3 ("Fifteenth Finance Commission recommendations were for 2020-25") is the only false-statement basis that moves the count (Laxmikanth Table 46.1 says 2020-26, with 2020-21 interim and 2021-26 final); a reader who knows the original term of reference (2020-25) could call it true, which would change "Only one" to "Only two" (MEDIUM). 053: statement 4 false because the reference is by the President (Laxmikanth p.614), fair. 043: chairman needs public-affairs experience, the four members come from the four groups (p.614), fair NOT item.
- AKS-20.4 (061-080, UPSC consultation, SPSC, Joint SPSC): all 20 cold answers match the keys (Laxmikanth p.604-613). 066 "1, 2 and 4 only" (statement 3 false, President's approval needed, p.606); 068 "1 and 4 only" (Art 321 functions are extended by Act of Parliament, not an executive order; report goes to the President); 071 "2, 3 and 4 only" (62 not 65; 41st Amendment footnote; Governor suspends, President removes); 074/075 Joint SPSC (President appoints, 62 years, statutory body, reports to the Governors) recomputed; 077 "Only one" (statement 1 true; 65th Amendment amended Art 338, Art 338-A came with the 89th; Manbodhan Lal Srivastava held consultation directory). Concept 4 therefore verified; concepts 5 and 6 (SC/ST/BC commissions, 081-120) follow.
- AKS-20.5 (081-100, NCSC history, powers, reports): all 20 cold answers match the keys (Laxmikanth p.621-623). NCSC is under Art 338 and NCST under Art 338-A (081, 087-2 correct); 084 answer is the Governor per Laxmikanth (stem says so; Art 338 text says "State Government", see MEDIUM). 092 "2 and 4 only": statement 3 (report on a State goes to the Chief Minister) is false by Laxmikanth but the stem of 092 has no "according to Laxmikanth" and a real-law reader (Art 338(6): copy forwarded to the State Government) could call it true, which would make "2 and 3 only" arguable (MEDIUM). 098 is now rebuilt (II about civil-court powers, does not explain I): correct. 099 "I correct, II incorrect": correct.
- AKS-20.6 (101-120, NCST, NCBC): all 20 cold answers match the keys (Laxmikanth p.624-628). 112 "2, 3 and 4 only" (three other Members, not four), 113 "1 only" (statement 4 gives the SC wording where the Commission's functions concern backward classes), 114 "1, 3 and 4 only" (NCBC Act 1993 repealed 2018), 115 "Only one", 116 "Only three" (constitutional since 2018), 117 "Only two", 118 explains (Laxmikanth gives the 1999 Ministry as the reason), 119 "I incorrect, II correct", 120 A-3 B-4 C-1 D-2 recomputed. 108 statement 1 and 109 statement 1 ("structural and resource-based vulnerabilities", "skill development") are notes-only wording (notes p.208-209) used as true statements: not in Laxmikanth, harmless in direction (LOW).


### aks20a script and coverage results
- Script over all 120 items: ids unique; key = o[0] = `a`; 4 distinct options; 3 w lines each; w lines aligned to o[1..3] in every which/howmany/direct/match item (checked by regex and by eye); no stem or option names notes/Shashank/AKS; match items 020/040/060/080/100/120 all carry List-I A-D and List-II 1-4 and each wrong option differs from the key by one swap pair matching its w line; every which/howmany explanation truth set recomputed against the key, 0 mismatches. Mix per concept 5 direct / 9 which / 3 howmany / 2 stmt12 / 1 match (25/45/15/10/5 percent) against the 2020-26 column (direct 26, which 48, howmany 12, Statement-I/II 6): in line. Direct key longest in 1-2 of 5 per concept (no length tell). `fi` present on all 120. check-civil-pack.py: 0 problems.
- Coverage: `aks-coverage.py --chapter 20`: 400 facts, 385 covered, 15 skipped, 0 uncovered (chapter total, both packs). aks20a plan fids only (261): 249 covered, 12 skipped (4.6 percent), 0 uncovered. Skipped A20-027, 048, 084, 092, 095, 098, 099, 111, 114, 139, 141, 560: every one is legitimate on the text (notes-only, absent from or contradicted by Laxmikanth, or varying by Commission), but the recorded reason string is wrong for 048 (says "conflicts on salary", the fact is the electoral-funding suggestions), 092 (says foreign audit, the fact is the Pathan Mohammed Suleman case), 098 (says "2005 Rules", the fact is the continental Audit Courts) and 560 (says "heading or padding", the fact is the notes' exploitative-labour elaboration). Fix the strings, not the skip.
- dup-check: 31 lines at 0.6 or above. Two at 1.00 are cross-pack, see MEDIUM.
- Cold-answer result: 120 of 120 keys agree with my independent answer; each item has exactly one defensible option on the stated source.
- Specially verified: 054 (rebuilt: statement 1 now says the entire Group D cadre, which is false because Laxmikanth p.607 puts the bulk of Group C and D outside UPSC; key "2 and 3 only" right), 055 (stem now attributes to the Second ARC as cited by Laxmikanth, p.636-638; "Only two" right), 075 (statement 3 now the Laxmikanth fact that Parliament creates the Joint SPSC on the States' request; "Only two" right), 084 (stem says According to Laxmikanth), 098 (II re-angled to civil-court powers, no longer restates I; correct but see MEDIUM on its w lines), 111 (statement 2 false under both Laxmikanth and Art 338-A; key right), 115 (statement 3 false under both; key right), 117 ("Only two"; 1999-Ministry idea no longer appears in 117), 118 (II is the reason for I per Laxmikanth, "explains" right).

### aks20a findings

HIGH: none.

MEDIUM
- 092: the stem has no "according to Laxmikanth", and statement 3 (a report on a State goes to the Chief Minister, who places it before the Legislature) is false only by Laxmikanth's Governor routing; Article 338(6) says the copy goes to the State Government, so a real-law reader could count statement 3 true and choose "2 and 3 only" (option b). Add "according to Laxmikanth" as 084 and 094 already do, or drop the statement.
- 057: statement 3 ("Fifteenth Finance Commission recommendations were for 2020-25") is the false statement that fixes the count. Laxmikanth Table 46.1 gives 2020-26 (interim 2020-21, final 2021-26), but the Commission's original terms of reference were 2020-25, so a well-read candidate may call it true and then "Only one" becomes "Only two". Replace with a cleaner false statement or state "according to Laxmikanth".
- Cross-pack repetition with aks20b: 069 statements 2 and 3 repeat aks20b-074 statements 2 and 3 (UPSC expenses charged; Chairman eligible for further post) at 1.00 and 0.71, and 032 statement 4 repeats aks20b-066 statement 3 at 1.00 (CAG expenses charged on the Consolidated Fund). Same fact tested in two packs; re-angle one side (for example in aks20a 069 replace statement 2 or 3 with the Kidwai Governor footnote, p.608).
- 098: the w lines for options 2 and 3 are swapped in intent. Option 2 ("I correct, II incorrect") carries "Statement-I is correct: the recommendations are not binding" and option 3 ("I incorrect, II correct") carries "Statement-II is correct: Laxmikanth p.622 lists these powers". Each should refute its own option (option 2: II is correct; option 3: I is correct).
- Repetition cap (2 per idea per concept) exceeded in: AKS-20.5 civil-court powers (093, 097-2, 098-II, 099); NCSC three-year/two-term tenure (083, 090, 096); AKS-20.4 President removes the SPSC member (064, 071, 079; and 089-1 in 20.5); AKS-20.6 102nd Amendment / Article 342-A (105, 114, 119, with 120 and 082/087 outside the concept); NCST tenure and 2004 establishment (102, 106, 115). AKS-20.1 repeats the Municipal/Panchayat exclusion (001, 006) and "President fixes the strength" (002, 007; 015 adds only regional commissioners). Each is correct; trim one use per idea.
- Skipped-fact reason strings mismatched for A20-048, 092, 098, 560 (see coverage above).

LOW
- 021: stem opens "The summary of the Election Commission of India states that ...", an oblique reference to a notes table; rewrite as "Under Article 324 the Chief Election Commissioner is removable in the same manner as a Judge of the Supreme Court. In practice this means ...".
- 018: "II explains I" is arguable (II is the general Article 324 power, I the specific countermand power); a challenger can argue "does not explain". Defensible (the countermand power is read out of Article 324 superintendence) but the weakest of the five "explains" keys; 058 is near-restatement (II is the constitutional ground of I) but acceptable.
- 043: all three w lines read "This is a listed category."; give each its category and say the public-affairs experience is the chairman's qualification.
- 108 statement 1 and 109 statement 1 ("structural and resource-based vulnerabilities", "skill development") rest on notes wording only (notes p.208-209), not Laxmikanth; harmless filler truths but unsupported by Laxmikanth.
- 047 statements 2 and 3, 048 statement 4 and 049 statement 3 (KG Basin argument, Delhi Airport PPP allegation, Australia/Canada federal and provincial auditors, a CVC-style selection-committee proposal) are notes-only; each is true in real life or reported as a proposal, so no wrong key, but there is no Laxmikanth page behind them (the fids were not flagged verify).
- 045: 16th Finance Commission chair is time-bound but correct for the 2026-31 award (constituted Dec 2023, report 2025); stem already says "as constituted".
- 084 and 092 differ from Article 338(6) text (State Government vs Governor) as noted; 084 is safe because the stem cites Laxmikanth.
- Changes after the exam year, all handled in the pack text: CEC and other ECs Act 2023 (committee and Cabinet Secretary salary, 037, 014, 005), Electoral Bond Scheme struck down 15 Feb 2024 (027, 035), 104th Amendment (Anglo-Indian, 094 keeps "with reference to Laxmikanth"), 105th Amendment 2021 (114), 102nd Amendment 2018 (NCBC constitutional, 114, 116, 117, 119), 16th Finance Commission (045).

VERDICT aks20a: PASS (zero HIGH).

## Overall
aks12 PASS, aks13 PASS, aks20a PASS (no HIGH in any of the three). The aks12-304 HIGH is fixed; aks12 match items 120/320/420 are intact and correctly keyed. Remaining work is MEDIUM/LOW only (repetition caps, 092 and 057 wording, 098 w lines, aks20b overlap, 044/047 aks13 wording).
