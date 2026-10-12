# Review: aks05a, aks05b, aks09

Summary: aks05a FAIL (3 HIGH: Q017, Q113, Q058; 9 MEDIUM; 10 LOW). aks05b PASS (0 HIGH, 2 MEDIUM, 7 LOW). aks09 PASS (0 HIGH, 3 MEDIUM, 5 LOW). dup-check: only >=0.7 hits are generic match stems (aks09 Q020/Q040 vs aks13-017) and one list-entry option (aks05a Q120 'Child Labour (Prohibition and Regulation) Act, 1986', 0.75 vs lk08-080); the rest are 0.6-0.69 re-statements of lk04/lk05b/lk08/lk09/lk11/aks03/aks11a/aks13/aks16 lines. aks-coverage --chapter 05 and 09: 0 uncovered.

## aks09 (Basic Structure, 40 q) -- verdict: PASS (0 HIGH, 3 MEDIUM, 5 LOW)

All 40 answered cold from notes ch09 + Laxmikanth ch12 (pdf 198-204); every key confirmed, one defensible option each. Table 12.1 statements (Q013, Q016, Q014-s3, Q032-s4) all match Laxmikanth pp.200-203. Verify-flagged facts handled correctly: Waman Rao year never asked (cut-off 24 Apr 1973 only), Coelho worded "after 24 April 1973", Anjum Kadari asked by the Act (2004), Art 254(2) exception included, Golak Nath "overruled" (not "partially"), Kesavananda 13-judge/7:6 true. Mix per concept 5/9/3/2/1 correct. Coverage script: 74 facts, 71 covered, 3 skipped (A09-057, 060, 064, all verify-conflict, legitimate: wrong case names in the notes). Skip rate 3/35 = 8.6% < 12%.

MEDIUM
- M1 (repetition cap, concept 09.1): Minerva Mills "42nd-Amendment Art 368 clauses struck down" tested in Q004, Q009, Q018 and (as Q033-s4, in 09.2) again; Waman Rao 24-Apr-1973 cut-off in Q010, Q014, Q032, Q036; "Golak Nath overruled by Kesavananda" in Q006-s3, Q007-s2, Q036-s1, Q037-s3. Brief cap is 2 per idea per concept.
- M2 (repetition): Madras Bar (NTT Act) appears in Q012, Q019, Q020 (+Q016-s4); Chandra Kumar "tribunals supplemental" in Q011-s4, Q019-II, Q020-C.
- M3 Q027 statement 4 ("eclipse applies to laws made after commencement that violate a Fundamental Right") is false by the dominant rule (Deep Chand, Mahendra Lal Jaini: post-Constitution laws are void ab initio) but real law has a non-citizen nuance (Saghir Ahmad/Pesikaka: such a law stays valid against non-citizens, described as eclipse-like). Defensible as false for Prelims, notes silent on post-1950 laws; reword to "void ab initio / stillborn" test or drop.

LOW
- L1 Q020 and Q040 (match) have identical option sets and identical key text (A-3,B-4,C-2,D-1); key text should vary, set reused.
- L2 Q040: Chamarbaugwalla is better known as the severability case; the match is still unique (only it can be territorial nexus), but a note in the explanation would help.
- L3 Q007 s1 / Q011 s2 near-duplicate existing lines (lk11-220 0.62, aks13-056 0.62); Q020/Q040 stem identical to aks13-017 (generic match stem, harmless).
- L5 AKS-09.1 has no single-correct item (no 'x only' key, no 'Only one'); 09.2 has one (Q037).
- L4 Q018: Statement-II largely restates the ground for I (Laxmikanth's own quote); borderline "II restates I", though it is a genuine reason.


## aks05a (Fundamental Rights part 1, 120 q) -- verdict: FAIL (3 HIGH, 9 MEDIUM, 10 LOW)

All 120 answered cold against Laxmikanth ch08 (pdf 127-173) and the notes ch05 (pp.21-35). Mix per concept 5/9/3/2/1 is correct everywhere. Coverage: 396 facts (05a+05b), 385 covered, 0 uncovered; the 7 skips of 05a (A05-017 BCCI, -511 ICCPR/ICESCR, -514 garbled case name, -537 22(3)(b) qualification, -565 'establish and maintain', -571 26(b)/25(2), -506 vague early view) all have legitimate reasons and are well under 12% per concept. Verify-flag handling is mostly right: Balaji/Nagaraj/Ashoka Kumar Thakur/Ram Singh/Balaji Raghavan/Viswanathan are all asked without the wrong years; Art 19(2) decency/morality, TADA/POTA, Art 13(4), Art 16(4) 'only SC/ST', Art 23 'absolute' and Coelho are in corrected form.

HIGH
- H1 Q017 (howmany, Art 12): statement 2 reads "Non-statutory authorities such as LIC, ONGC and SAIL fall within 'other authorities'" and is counted correct. Laxmikanth p.131 says "statutory or non-statutory authorities like LIC, ONGC, SAIL". LIC is created by the LIC Act 1956 and ONGC by statute (ONGC Act 1959, later a company), so labelling them non-statutory is a mis-statement; a careful candidate marks statement 2 wrong, which turns the key from "Only two" to "Only one". Two defensible answers. Fix: "Statutory and non-statutory bodies such as LIC, ONGC and SAIL".
- H2 Q113 (which, Art 25): statement 2 "The State may regulate essential and integral religious practices on the ground of social reform" is declared incorrect. Under Art 25(2)(b) (Laxmikanth p.155: State may provide for social welfare and reform) the Supreme Court has allowed reform laws to override even essential practices (Devaru temple entry, Narasu Appa Mali, the sati/devadasi laws). The statement is defensible as true, and then no option fits (the 4-true answer is not offered). Falsifier rule broken: false only because the notes word it differently. Recast, e.g. "the State cannot regulate any secular activity connected with religion".
- H3 Q058 (stmt12): Statement-I "The Bezbaruah Committee recommended new offences to curb hate speech" is keyed incorrect, but the Bezbaruah committee (2014) did recommend new IPC offences (153C, 509A) against racial discrimination/insult to NE persons, which the Viswanathan committee (2017) later extended to hate speech (153C, 505A). So Statement-I is defensible as true; then the answer would be "both correct, II does not explain I". The notes only say "protect NE communities", so the fact (A05-138) supports no hate-speech claim. Two defensible answers.

MEDIUM
- M1 Q021 (and its distractors): stem dates State of Madras v. Champakam Dorairajan "(1950)". The Supreme Court decided it on 9 April 1951 (the Madras High Court acted in 1950); the 1st Amendment followed in June 1951. The notes themselves give 1950 on p.23 and 1951 on p.36. Wrong year in a stem; answer unaffected. Drop the year.
- M2 Q008 statement 4 ("A body of local self-government qualifies even when it has no power to levy taxes or fees") is keyed false only from the notes' definition. In real law (General Clauses Act s.3(31); R.C. Jain test) taxing power is an indicator, not a condition. Soft falsifier.
- M3 Q116 statement 3 ("The notes group the limits on religious freedom ... under three heads") names the notes inside a statement and tests no law; true by definition. Violates the brief (never mention the notes). Same issue is implicit in Q094 statement 2 ("Laxmikanth says ... high court judges"): acceptable as attributed, but the real text of Art 22(4)(a) is persons qualified to be HC judges.
- M4 Statement-item shape, whole pack: almost every 4-statement 'which' item has exactly three true statements (counts of 3-true keys per concept: 7,6,8,9,9,8 of 9; 05.4 and 05.5 have no other shape). No single-correct item exists in ANY concept of aks05a (brief: at least one all-correct and one single-correct per concept), and no 'Only one'/'None' howmany key. A candidate who finds one false statement wins. Rebuild at least 2 per concept with 1 or 0 true.
- M5 Key-text repetition: '1, 2 and 4 only' is the key three times in 05.4 and in 05.5; '1, 3 and 4 only' and '1, 2 and 4 only' three times each in 05.6.
- M6 Direct items: key is the longest option in 13 of 30 direct items (43%; limit ~1/3). Strongest tells Q002, Q021-adjacent Q041, Q043, Q044, Q065 (key is the one carrying all the qualifiers).
- M7 Idea repetition above cap 2 per concept: 05.5 Maneka/Gopalan facts A05-186 x3, A05-188 x4, Puttaswamy A05-193 x3, Unni Krishnan/21A A05-501 x3 and A05-509 x3; 05.4 A05-150 (Art 19(5) grounds) x4; 05.6 A05-525/530 (24 hours; Part I scope) x3, mines-18/2016 amendment x3 (Q110, Q111, Q119, Q120).
- M9 Q118 (stmt12): the key says Statement-II (clauses 3-7 give a separate regime) EXPLAINS Statement-I (clauses 1-2 rights unavailable to preventive detenus). The exclusion actually flows from Art 22(3)(b), not from the existence of a separate regime, so 'explains' vs 'does not explain' is arguable; the item can be read two ways. Rework so II is plainly a reason (cite Art 22(3)(b)) or plainly not.
- M8 Q030 statement 2 and Q045-type phrasing "violating Fundamental Rights or the basic structure": Laxmikanth p.166 says Arts 14, 15, 19, 21 or the basic structure; the pack's looser 'Fundamental Rights' could be read as every FR. Tighten.

LOW
- L1 Q011 statement 2 uses tell-word "every classification ... however reasonable"; Q012 statement 4 uses "only"; Q069 s2 "only"; Q119 etc. Tell-words in false statements.
- L2 Q100 and Q120 (match) share identical option sets and identical key text (A-3,B-4,C-2,D-1); Q020/Q060/Q080 are distinct.
- L3 Q074 statement 2 says TADA "was repealed in 1995": it was allowed to lapse (Laxmikanth says repealed); acceptable, but 'lapsed' is the exact term.
- L4 Q041 explanation says the notes' remark is "not tested" yet the remark is used as distractor 2; Q116 s2 'protects only essential practices' (notes gloss).
- L5 Q061 distractors are trivially wrong (armed, riotous); Q065 stem grammar ("The police force an accused person to do one of the following").
- L6 Q114 s3 (Art 26 not limited by other FRs) is Laxmikanth's position but is under challenge in the Sabarimala reference; word 'according to Laxmikanth'.
- L7 Q054 s3 (friendly-relations ground "does not reach academic criticism") is a notes-only gloss; Q032 s3 purposive gloss.
- L8 Q018/Q059/Q098 Statement-II largely restates I; borderline.
- L9 Q097 and Q117 test Laxmikanth-only additions with empty fi (allowed, within 6 per concept).
- L10 Q025 explanation cites Laxmikanth for the 1957 residence Act; fine, but key longest.

Recall load: most of the 120 are single-fact recall inside a statement frame; two-step items are few (Q022, Q045, Q064, Q103, Q104). Within the brief's limit of 8 recall per concept only if the which-items are counted as non-recall.


## aks05b (Fundamental Rights part 2, 60 q) -- verdict: PASS (0 HIGH, 2 MEDIUM, 7 LOW)

All 60 answered cold against Laxmikanth ch08 pdf 155-166 and notes ch05 pp.35-42. Mix per concept 5/9/3/2/1 correct. Skips A05-581 (nonexistent Art 28(4)), -620, -623, -696 all legitimate verify-conflicts (4 of 130, max 1-2 per concept). Corrected forms handled well: Art 30(1A) (Q010 s3, Q017 s4), Art 28 four-type table without 28(4) (Q007, Q015), Navy Act year never asked (Q053 uses Army Act only), Art 32 suspension via Art 359 stated per Laxmikanth (Q035), certiorari-vs-administrative without the '1991' year (Q050), Art 22/enemy-alien point avoided, Champakam given as 1951 (correct real date; contrast aks05a Q021). Idea repetition within cap in every concept. Key text varies; no option set reused more than twice; key longest in 3 of 15 direct items. Single-correct and none-correct items are present in 05.7 (Q014, Q017) and 05.8 (Q029, Q037).

MEDIUM
- M1 Q046 statement 2 ("Mandamus can issue against an inferior court or tribunal for its administrative, but not judicial, acts") is the notes' qualifier; Laxmikanth p.160 says mandamus may issue against "an inferior court, a tribunal" without it, and in real law mandamus can compel a court to exercise a jurisdiction it refuses (it cannot dictate the decision). Statement is keyed true; a careful reader sees it as over-precise. Soften to "can issue against inferior courts and tribunals to perform a public duty".
- M2 Shape/brief rule: 05.8 has no all-correct item (no '1, 2, 3 and 4' key, no 'All four') and 05.9 has no single-correct item ('Only one'/'x only'); 05.9 keys are 2-3 true statements throughout. Brief demands at least one of each per concept.

LOW
- L1 Q014 explanation says "The notes treat the Jains as a later addition (2014 notification)"; the notes list Jains with no date. The 2014 date is correct in real law (first notification Oct 1993 omitted Jains), so the key stands, but the citation is wrong. Also time-sensitive wording ("notified as minorities") for a historical fact.
- L2 Q033 statement 3 ("a High Court's [writ power] is confined to its territorial jurisdiction") ignores the Art 226(2) cause-of-action reach that Laxmikanth p.160 records; keyed true, explanation concedes the exception. Add "ordinarily".
- L3 Q013 statement 1 and Q029 statement 1 reproduce notes glosses ("one of the strongest Fundamental Rights"; Ninth Schedule laws "shielded from Fundamental Rights challenge" while Laxmikanth p.166 says Arts 14, 15, 19, 21 can be invoked). Imprecise but not wrong.
- L4 Near-copies of lk08 lines (0.60-0.64): Q002 (Art 28 trust exemption, lk08-150), Q011 s2 (lk08-154), Q023 (Ambedkar quote, lk08-175), Q050 s2 (lk08-172), Q039 (lk08-178), Q055 (aks11a-113, Art 265).
- L5 Q003 options are one-word and Q024 distractors are nonsensical (Governor, Supreme Court rules): trivially eliminated.
- L6 Q020 (match) lists Champakam against Art 29(2) only; the case is equally the Art 15(1)/(4) case, harmless since Art 15 is not offered.
- L7 Q019/Q039 Statement-II pairings are acceptable but II in Q039 is unrelated filler (Art 32 in Part III).

## Checks requested, summary
- Verify-flag corrected forms: Balaji (no year, aks05a Q027), Nagaraj (no year; Q029, Q030, Q047), Ashoka Kumar Thakur (no year, no 'unaided'; Q029), Ram Singh (no year in stem; Q029, Q040), Mandal implementation (1999 avoided; Ram Nandan 1993 in Q028), Coelho (post-24-April-1973, aks05a Q030, aks05b Q022/Q028/Q029, aks09 Q010), Francis Coralie Mullin (Q089), Hoskot (Q108), Gopalan v State of Madras (Q081), TADA 1985/1995 and POTA 2002/2004 (Q074, Q079, Q097), Arts 359/20/21 (aks05a Q005, Q016; aks05b Q056): all in corrected form. Remaining defects are the three HIGH items above and the Champakam 1950 stem.
- Page tags: spot-checked ~60 `pg` values against notes pages; all hit the right page.
- Falsifier rule breaches beyond HIGH: aks05a Q008 s4 (M2), aks05b Q046 s2, aks09 Q027 s4.
- Traps: Q103 (24-hour arithmetic) and Q022 (EWS mixed assets) are fair application items.
