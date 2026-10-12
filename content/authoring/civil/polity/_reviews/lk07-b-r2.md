# Re-review of lk07.json, second half (LK-7.7 to LK-7.12; CS-POL-ch07-701 to 1220), after the rebuild

Verdict: **fail** (1 HIGH). Counts: HIGH 1, MEDIUM 5, LOW 9.
Method: all 120 questions were re-answered cold from ch07.txt (pdf pp.110-126) BEFORE any key was read. My cold answer matched the key on
all 120. The rebuild did not break any key. I also checked mechanically that every which/how-many explanation lists the same
correct statements as the key and that statement counts match the stems (0 mismatches), and the Statement-I/II explanation numbers
(consistent). `python3 scripts/civil-services/check-civil-pack.py` on lk07.json: 0 problems. All 120 keys sit at o[0] (loader shuffles, not a defect).
I did not review LK-7.1 to 7.6.

## Hard checks asked for
- **1117 "grandparents": TRUE.** p.118 and Table 7.1 row 6 (p.122): "who or either of whose parents or grandparents or great grandparents
  is or had been a citizen of Pakistan, Bangladesh or such other country". st.3 ("ordinarily resident means six months") is also TRUE by the
  note under row 4 (p.121), st.2 and st.4 false (PIO holds foreign passport; application is online). Key "Only two" correct. The old HIGH is closed.
  The Pakistan/Bangladesh bar now appears in 7.10 (1002, 1012) and once in 7.11 (1117): fine.
- **713 st.1 Tripura: FALSE in the chapter and in law.** p.116 lists the Sixth Schedule tribal areas of Assam, Meghalaya, Mizoram AND Tripura as excluded;
  s.6B(4) says the same. Not fragile any more. Key "3 and 4" correct (st.2: 31 Dec 2014 vs 25 March 1971 differ, false; st.3 Bengal Eastern Frontier Regulation 1873 true; st.4 true).
- **1206 st.2 agricultural land: clearly FALSE.** Table row 7 item 4 (pp.123-124) lists "immovable properties other than agricultural land or farm house or
  plantation property" under parity with NRIs, and parity with Indian nationals is limited to air fares and entry fees. False in the FEMA notification too. Closed.
- **1118 st.2 "An NRI must apply for registration": clearly FALSE** (row 11, p.125: "He/she is an Indian citizen"). Statement-I is the true OCI 5-year + 12-month rule. Key A correct, relation no longer arguable.
- **1218**: St-I is row 5 (p.124) almost word for word, true; St-II "same rights as an Indian citizen" false. Key correct.
- **Lengthened distractors**: I read every distractor of the 30 direct items. None became supported by the chapter. Specific ones checked: 702 B/C/D, 704 B/C/D,
  801 B/C/D, 802 B/C/D, 804 B/C/D (passport, property, tax are not in footnote 9), 902-905, 1002 B/C/D (all three are listed eligible categories), 1004 D,
  1202 B (lure from "for any purpose", killed by the "However" clause), 1203 B/C/D (commercial property is allowed, so "residential only" is false), 1204 B/C/D, 1205 B/C/D.
- **Real-law currency**: Section 6A upheld (Oct 2024, 25 March 1971 cut-off unchanged), CAA cut-off 31 Dec 2014 unchanged, OCI fees US $275 / Rs 15,000 and the permit list follow the chapter table; nothing here is wrong against current law except the repealed-Act wording (L1).

## HIGH
**H1 - CS-POL-ch07-1209 (which; key "1 and 3 only") - statement 1 has no antecedent and two readings give opposite truth values.**
The stem is bare ("Consider the following statements:"). St.1: "The same applies to rights not covered by RBI notifications under FEMA, 1999." St.2: "Such rights are the same as
those of an Indian citizen." St.3: "For rights not specified in notifications, the OCI Cardholder has the same rights and privileges as a foreigner."
"The same" can refer to the foreigner rule (st.3, then st.1 true) or, since st.2 is written as "Such rights", to a citizen-rights chain (then st.1 false and the answer becomes "3 only", which is option D).
After the builder's shuffle the referent is no longer fixed. Fix: restore a stem ("...about the residual rights of an OCI Cardholder under Table 7.1") and rewrite st.1 as a stand-alone sentence
("The cardholder's rights in fields covered by RBI notifications under FEMA, 1999 are likewise those of a foreigner").

## MEDIUM
**M1 - dangling antecedents (reading trick, not knowledge).** 1208 st.1 "This eligibility extends to the new AIIMS" (the referent is st.3, which can come later); 1114 st.1 "of such a citizen" (bare stem);
1012 st.1 "the bar" and st.2 "The ineligibility" (bare stem; guessable only from st.3); 911 st.3 "The Committee" (no committee mentioned in the other statements); 910 st.2 and 917 st.4 "The merger".
Key is still derivable for a student who knows the chapter, so not HIGH, but a student who does not has to guess the subject. Give each stem a topic frame ("about registration as an OCI Cardholder" etc.) and make every statement self-contained.
**M2 - longest-key tell survives the fix pass.** In 14 of the 30 direct items the key is the strictly longest option (702, 704, 705, 802, 901, 903, 1004, 1005, 1101, 1102, 1104, 1105, 1202, 1205); chance would be about 7. Worst: 704 (96 v 52-62 chars),
1005 (77 v 52-59), 1105 (66 v 30-52), 1205 (66 v 26-54), 802 (73 v 54-62). Lengthen the distractors in those eight, or shorten the keys.
**M3 - sole three-statement option (earlier M3) not fixed.** In 708, 808, 908, 1008, 1111, 1208 the key "1, 2 and 3" is the only option containing three numbers (the other options are pairs and singles). Six of the 11 three-statement keys have this tell. Add one more three-number option in each, or recast some as four-statement items.
**M4 - repetition still high (ideas at 3 or more items per concept).**
- 7.7: Assam "ten years, no vote" 702, 707, 712, 715, 717, 720 (6); "deemed citizen from date of entry" 703, 709, 712, 717, 719 (5); 31 Dec 2014 708, 713, 716, 720 (4); Sixth Schedule/Inner Line 704, 709, 713, 716 (4); pending proceedings abated 709, 714, 717, 719 (4); 2016 long-term visa 710, 717, 718 (3).
- 7.8: footnote-9 exceptions 804, 809, 811, 816, 817 (5); imprisonment ground 803, 809, 814, 817 (4); renunciation effective only on registration 807, 812, 817, 818 (4); minor child loses/resumes 802, 807, 815, 820 (4).
- 7.9: Article 9 / not dual citizenship 903, 909, 913, 917, 918 (5); PIO rescinded 9 Jan 2015 905, 908, 911, 914, 917 (5); 2003 Act and 16 countries 902, 907, 909, 916, 920 (5); PIO 2002 / OCI 2005 dates 908, 913, 915, 917 (4); the merger 904, 910, 917, 919, 920 (5).
- 7.10: citizen-only offices 1003, 1006, 1007, 1016, 1018, 1020 (6); cancellation grounds 1008, 1009, 1013, 1014, 1015, 1017 (6); spouse and minor child cease 1004, 1011, 1017, 1019, 1020 (5).
- 7.11: fees 1102, 1107, 1116, 1119, 1120 (5); passport definitions 1101, 1106, 1115, 1120 (4); where to apply 1102, 1104, 1110, 1112 (4); six months 1103, 1112, 1117 (3); 5 years + 12 months 1105, 1111, 1118 (3).
- 7.12: special permit activities 1202, 1207, 1213, 1216, 1219, 1220 (6); air fares/entry fees 1206, 1211, 1215, 1220 (4); agricultural/farm land 1203, 1206, 1212, 1215 (4); NRI seats 1203..1205, 1208, 1212, 1217 (4); visa/police 1201, 1210, 1214, 1217 (4).
Some of this is forced by a thin chapter (the earlier review said so). Cut one item from each idea at 5+ and replace from untested text: p.110 enemy-alien rights, Table 7.2 (Articles 5-11), the Pondicherry Order of 1962, the naturalisation conditions on p.114-115 (but check lk07-a does not cover them), Article 9.
**M5 - key distributions are still learnable.** How-many keys: None x5 (717, 816, 916, 1016, 1216), Only one x5, Only two x5, Only three/All x3 (716, 917, 1017). 5/18 "None" items are all-false lists with plainly absurd statements (e.g. 1216 "research without any permission"). Statement-I/II: "I correct, II incorrect" is the key in 6 of 12 (718, 818, 919, 1019, 1118, 1218); "II explains I" appears only twice (918, 1018) and "both true, no relation" twice (719, 1119). A student who always picks "I true, II false" scores 50%. Rebalance (more "I false, II true" and "both true, II explains I"; for 7.8 and 7.12 no item tests an explaining relation).

## LOW
- **L1 currency.** 708 st.3, 710 st.1, 711 and 718 cite the Passport (Entry into India) Act, 1920 and the Foreigners Act, 1946, both repealed from 1 September 2025 by the Immigration and Foreigners Act, 2025 (plus the 2025 exemption order). Correct "as per Laxmikanth" but the stems do not say so; add a clause to the explanation (708 e, 710 e).
- **L2 bare explanations.** 705, 802, 902-905, 920, 1001, 1004, 1005, 1020, 1101, 1103, 1104, 1120 carry only "p.NNN." with no fact.
- **L3 too easy.** 1219 (missionary activity without permission) and 819 (voluntary deprivation) test no discrimination; 818 is now fine (St-II on registration is subtle).
- **L4 811 st.2** ("holds an Indian passport" is an exception) is false only by footnote 9's closed list; true in the Act too. 804 B uses the same fact as a distractor.
- **L5 1011 st.2/st.3** have no subject ("Adult children also cease", "The spouse of foreign origin keeps...") and rely on the stem word "renunciation"; reword with "of the cardholder".
- **L6 1106 st.3 / 1115 st.3** (a PIO is a registered OCI cardholder / registered under the Act): p.117 says existing PIO cardholders were deemed OCI cardholders, so a careful student could pause. False on the definition (a PIO is anyone of Indian ancestry with a foreign passport, row 1); acceptable.
- **L7 710 st.3** ("a long-term visa made them eligible to apply for citizenship by registration" before 2019) is false by the chapter ("ineligible to apply"). Grey in real law (collector-level grants to LTV holders who had entered validly), but the chapter text is explicit.
- **L8 901 w[1]** says the chapter "reports no recommendation on voting rights"; that is an argument from silence, and the stem restricts the answer to amendments of the Citizenship Act, so the distractor is false anyway. Reword the w line.
- **L9 1020 B** "Cannot be registered -> As a voter" reads like "cannot be registered as an OCI Cardholder"; and 702 (detected 1990, "deemed citizen after ten years") reads oddly in 2026. Wording only.

## Format and skill mix (120 items)
direct 30 (25% vs trend 26%), which 54 (45% vs ~48%), how-many 18 (15% vs 12%), Statement-I/II 12 (10% vs 6%), match 6 (5%), case study 0 (3% in trend; none suitable). Skill: recall 17, two_step 92, elimination 11. Recall is thin (14%); acceptable on a table chapter.

## Tagged PYQs
UPSC-POL-1999-056 and UPSC-POL-2021-411 (ch07): no near-duplicate in this half.

## Verdict
Fail on one HIGH, **CS-POL-ch07-1209**. After that stem and statement 1 are repaired and M1 antecedents are fixed, this half passes: all 120 keys are right, the five target falsifiers are now true/false by explicit chapter text and by law, and no lengthened distractor became supported.
HIGH ids: CS-POL-ch07-1209.
