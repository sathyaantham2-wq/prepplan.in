# Final verification: aks14 (State Executive) and aks20b (Constitutional Bodies part 2)
Reviewed 2026-10-12. Fresh full pass, not a diff of the earlier reviews. Packs were not edited.

Overall: aks14 = PASS (0 HIGH, 7 MEDIUM). aks20b = PASS (0 HIGH, 6 MEDIUM). Both earlier HIGH items (aks14 Q214, Q408) are resolved.

---------------------------------------------------------------------
# PACK 1: aks14.json (140 questions) -- VERDICT: PASS (0 HIGH, 7 MEDIUM, 9 LOW)
---------------------------------------------------------------------

## Mechanical checks (script over all 140)
- Ids unique; 4 distinct options; `a` equals o[0]; 3 `w` lines each; every item has `fi`; 0 problems from check-civil-pack.py.
- For all 63 "which" items the set of statements the explanation calls correct equals the key; for all 21 how-many items the count equals the key; all 14 Statement-I/II keys agree with the explanation verdicts; every one of the 84 which/how-many `w` lines quotes exactly the option it sits against (checked after reshape); the 7 match items have List-I rows A-D and List-II rows 1-4 and the `w` swap pairs match the wrong options; direct `w` lines were read one by one against the options (all line up; Q204 w3 is loose, LOW).
- Stems and options name no notes/Shashank/AKS (explanations still carry "(notes p.NN)": ignored as instructed).
- Format mix: 35 direct (25%), 63 which (45%), 21 how-many (15%), 14 Statement-I/II (10%), 7 match (5%) against the 2020-26 column (direct 26%, which 48%, how-many 12%, Statement-I/II 6%). Close; Statement-I/II is 4 points high, acceptable. Eight all-correct items (113, 209, 310, 317, 414, 514, 611, 708), about one per concept (14.3 has two). Acceptable.
- Key truth-count spread for "which": 1 true = 7, 2 = 29, 3 = 20, all = 7. How-many keys: two 9, one 5, three 6, four 1. No tell.
- dup-check.py: nothing at 0.7 or above. Highest 0.62 (Q618 vs aks10-151 "AG appointed by the President"; Q110/Q103 vs aks16-109/aks10-003 oath wording): deliberate Union/State parallels, not copies (LOW).
- aks-coverage.py --chapter 14: 291 facts, 270 covered, 21 skipped, 0 uncovered. The pack's `skipped` list carries 22 fids; the extra one is A14-533, which Q503 still cites in `fi` (LOW).
- Notes page tags: every `pg` and every "notes p.NN" in an explanation exists in ch14.txt, and key phrases land on the tagged page (two months p.119, Contingency Fund p.121, Sarkaria p.126, B.R. Kapur p.127/132, Zonal Council p.130, Deputy CM p.134, Tuensang p.138). Laxmikanth page cites checked against the chapter text for the Bill tables (459-460), discretion lists (464), Sarkaria issues and order (465, 470), CM dismissal and the Bommai footnote (471, 473), Shamsher Singh (476), Advocate-General (643), Art 371 (796+): all state what the item says.

## The specially named rebuilds (each answered cold, then checked against Laxmikanth text)
- Q214 (was HIGH): s1 (proviso to Art 200: must assent on re-passage) TRUE; s2 (Art 200 governs reserved Bills) FALSE, it is Art 201; s3 (Legislature reconsiders within one year) FALSE, six months; s4 (Governor's assent still needed after the President assents) FALSE. Key "1 only" is the single defensible answer on Laxmikanth and on the Nov 2025 opinion (the return-and-re-passage rule is untouched). RESOLVED.
- Q408 (was HIGH): s1 (Bommai: a CM cannot be dismissed while he has majority) is in Laxmikanth p.471 and its footnote; s3 (floor of the House, not Raj Bhavan) in p.470; s2 and s4 false. Key "1 and 3 only" is single. The Mahabir Prasad notes-only claim is gone. RESOLVED.
- Q308: stem "according to Laxmikanth's treatment"; s2 attributed ("in this classification the Bill ends"); s4 "three options" is false against Laxmikanth's four. Single key "1 and 2 only". OK.
- Q301: the extra Bill power is reservation; options 1-3 are all powers the President also has. Single. OK.
- Q508: s3 is verbatim Shamsher Singh in Laxmikanth p.476; s2 false; s4 "twelve months" false. Key "1 and 3 only". OK.
- Q713 / Q714: the "majority party" slip is replaced by "command the confidence of the Assembly" (713 s4 true, 714 s2 "need not command" false). Keys hold. OK.
- Q309: s1 (reserve an ultra vires Bill, Soli Sorabji, Laxmikanth p.457) true; s2 false (Laxmikanth lists the PR recommendation as constitutional discretion); s3 (Nabam Rebia) true in real law. Key holds. See M6.
- Q315: s1 true, s2 "three months" false, s3 attributed to Laxmikanth p.464 true, s4 true. "Only three". OK.
- Q316: s1 true; s2 (Vidarbha/Marathwada board, Governor "acts finally in his discretion" after consulting the Council) is Laxmikanth p.464 almost verbatim; s3 false; s4 false (Rameshwar Prasad = Bihar dissolution; UP 1998 = Jagdambika Pal). "Only two". OK.
- Q310: s2 now "may direct" (Art 360(4)(a)(ii)); s1, s3, s4 true. "All four" legitimate. OK.
- Q610: s1 false, s2 and s3 true (Laxmikanth p.479), s4 false. Key "2 and 3 only". OK; the vague "policy filters" lines are gone.
- Q611: four true statements but s3, s4 are vague "may/often" claims (M4).
- Q318: I and II both true (Laxmikanth p.459), II does not explain I. OK.
- Q418: I explained by II (Art 164(1)). Not a restatement. OK.
- Q618: unrelated-true pair, key "II does not explain I". OK.

## HIGH
None.

## MEDIUM
- M1. Key-shape tell in direct items: the key is strictly the SHORTEST option in 17 of 35 direct items (49%, chance 25%): Q101, Q104, Q201, Q204, Q303, Q304, Q305, Q402, Q403, Q405, Q501, Q503, Q505, Q603, Q604, Q605, Q703. In 14.3 to 14.6 it is 3 of 5 in each concept. The earlier "longest key" tell was inverted, not removed. Lengthen about half of these keys (or shorten their distractors).
- M2. Repetition cap (2 per idea per concept) exceeded:
  - 14.1: "no Vice-Governor" in Q105, Q114 s3, Q116 s4; the oath administered by the High Court Chief Justice in Q103, Q110 s3, Q116 s3 (and Q715 s2 in 14.7).
  - 14.3: "must assent on re-passage" in Q302, Q306 s1, Q308 s1 and s3; "no further role for the Governor after reservation / Presidential assent only" in Q306 s4, Q307 s3, Q318; the hung-House discretion and floor test in Q313 and Q317 (Q317 s1, s2, s4 restate Q313 s2/s4 almost word for word).
  - 14.4: CM with majority cannot be dismissed / pleasure co-terminous with confidence in Q407, Q408 s1, Q414 s1/s3, Q416 s2, Q412 s3.
  - 14.5: the 91st Amendment limits in Q501, Q508 s1, Q509 s1/s2, Q517 s1; the six-month rule in Q508 s4, Q512, Q517 s4.
  - 14.6: Attorney General versus Advocate-General qualification in Q602, Q612 s3, Q615 s2; privileges and immunities in Q613 s4 and Q617 s2.
  - 14.7: Art 371J amendment number and reservation in Q702, Q711 s2/s3, Q718 (both statements): Q718 restates Q711 s2 and s3. "7th not 42nd Amendment" in Q713 s2 and Q715 s3 (and Q101 in 14.1).
  Replace one occurrence of each with an untouched inventory fact.
- M3. Q606 s1 ("The Constitution prescribes no fixed size ... for the State Council") is Laxmikanth ch32 text, but the same pack teaches that Art 164(1A) fixes a 15 per cent ceiling and a floor of 12 (Q501, Q509, Q517 s1). All four options contain statement 1, so a candidate who counts the 91st Amendment as prescribing size finds no correct option. Reword to "no ranking or classification of Ministers".
- M4. Weak all-true items on vague claims: Q611 (s3 "monitor flagship schemes and are often sector-specific", s4 "may handle river water disputes, border issues"); Q317 s4 ("maximum stability with minimum discretion" is a slogan, not law; also in Q313/Q319 earlier). Anchor Q611 on Laxmikanth p.478-479 and replace Q317 s4.
- M5. Q515 s2 (U.N.R. Rao v. Indira Gandhi: "executive authority cannot function without ministerial advice ... applies equally to States") is notes-only and loose; the case is about the Council continuing after dissolution of the Lok Sabha. The key "Only two" depends on it. Reword.
- M6. Attribution mismatch: Q309 stem says "according to Laxmikanth" but s3 (Nabam Rebia 2016) is not in Laxmikanth (true in real law, so the key is safe). Nabam Rebia also in Q320 and Q514 s4. Drop the attribution or swap s3 for the Shamsher Singh rule (p.476).
- M7. Q118: Statement-II ("immunity protects the office, not the holder") is arguably a related truth rather than an explanation, so "both correct, II does not explain I" is defensible to a strict reader. Make II "Article 361(2) bars criminal proceedings only while he is in office" or switch the item to the "does not explain" type.

## LOW
- L1. Q503 cites skipped fact A14-533 in `fi`. `fi` fact page not in item `pg`: Q116 (A14-003 p.117), Q301 (A14-083 p.122), Q303 (A14-086 p.123), Q516 (A14-535 p.131), Q616 (A14-605 p.137).
- L2. Skip rate judged fact by fact. AKS-14.3 skipped 8 of 47 facts (17%; 20% if 132/133 are counted): A14-091 (vague), 098 (contradicted by Laxmikanth's lists), 103 (pocket veto, contested), 105 (vague, 2025 judgment), 106 (justiciability, contested), 108 (TN case, misdated), 115 (basic-structure reservation, notes only), 139 (the testable floor-test half is covered by A14-126). All right to skip; the 12% cap is exceeded only because of the contested 2025 case law. ACCEPT. Other concepts: 081, 084, 029, 132, 133, 143, 540, 563, 585, 586, 588, 602, 633 are legitimate.
- L3. Q608 s2: the Deputy CM appointment is "made by the Chief Minister"; formally the Governor appoints on the CM's advice.
- L4. Q204 w3 "Neither is consulted" does not describe option 3 (Chief Justice of India and Law Commission); Q602 w3 calls option 3 the Attorney General's qualification though "ten years as SC advocate" is not that qualification.
- L5. Q716 uses present tense for Tuensang provisions that were time-bound under Art 371A(2); the stem's "as given in Laxmikanth" protects it.
- L6. Q711/Q718/Q720 say Hyderabad-Karnataka; the region has been called Kalyana-Karnataka since 2019 (article text unchanged).
- L7. Easy distractors remain: Q405 option 3, Q319 II, Q715 s4, unrelated-true pairs Q419/Q519/Q718.
- L8. Q112 s4 (Rs 3.50 lakh, Finance Act 2018) is time-sensitive; "according to Laxmikanth" covers it.
- L9. Q312 s1 is a strawman statement; harmless.

## Per-item cold answers
All 140 keys were derived from Laxmikanth text or settled law before the key was read, and all agree. Single-answer proofs from Laxmikanth text: Q112 (Hargovind Pant 1979, Surya Narain 1981), Q208, Q305/Q314 (Sarkaria order, p.470), Q316 s2, Q408 s1, Q508 s3, Q617 s3 (committee "of which he may be named a member", p.643), Q712 (twelve States), Q717 (13th, 22nd, 27th, 32nd Amendments).
Falsifier rule: no distractor is also supported. Risky ones checked: Q311 s1 (Art 31A proviso requires reservation, so "without having been reserved" is false), Q510 s4 (Third Schedule), Q312 s3 (Bommai), Q406 s4, Q415 s1 (Art 361(1) protects the person, not the act), Q617 s3.

---------------------------------------------------------------------
# PACK 2: aks20b.json (80 questions) -- VERDICT: PASS (0 HIGH, 6 MEDIUM, 9 LOW)
---------------------------------------------------------------------

## Mechanical checks (script over all 80)
- Ids unique; 4 distinct options; `a` equals o[0]; 3 `w` lines each; 0 problems from check-civil-pack.py. For all 36 "which" items the statements the explanation calls correct equal the key; all 12 how-many keys equal the count; every `w` line of the 48 which/how-many items quotes exactly the option it sits against; the 4 match items have List-I rows A-D and List-II rows 1-4 and the quoted wrong pairings are options 1-3 in order; direct `w` lines were read one by one against the options (all line up). The 8 Statement-I/II keys were checked by hand because their explanations use a different wording from aks14 (see M1).
- Stems and options name no notes (Q074 "as arranged in the notes" is gone; the only hit of the word is "agenda notes" in Q025, a false positive).
- Format mix: 20 direct (25%), 36 which (45%), 12 how-many (15%), 8 Statement-I/II (10%), 4 match (5%), identical in shape to aks14 and close to the 2020-26 column. "Which" truth counts: 1 true = 3, 2 = 14, 3 = 16, all = 3. How-many keys: two 6, three 4, one 2. No tell.
- Direct key length: strictly longest in Q005, Q025, Q042, Q064 (4 of 20) and strictly shortest in Q001, Q043, Q065 (3 of 20): at chance. No key-shape tell.
- dup-check.py: nothing at 0.7 or above. The highest scores (0.60-0.67) are against the sister pack aks20a (Q017 vs aks20a-113, Q008 vs aks20a-114, Q074 vs aks20a-044/-056), against lk15-702 (Q029), ncert_polity5-4-09 (Q075) and lk15-406 (Q076). No tagged-PYQ near-duplicate.
- aks-coverage.py --chapter 20 reports the whole chapter (20a plus 20b). Restricted to the 139 plan facts of aks20b (plan.json): 136 covered, 3 skipped, 0 uncovered, no `fi` outside the plan. Skips: A20-612 (year of the classical-language criteria, given differently in official sources), A20-720 (notes' "at the President's pleasure" for the commissions and Special Officer, unsupported by Laxmikanth), A20-593 (vague "consequences similar to civil court"). All three are right. Skip rate 2%, well inside the 12% cap.
- Page tags: every `pg` and every "notes p.NN" exists in ch20.txt; key phrases land on the tagged pages (Belgaum p.212, Revenue Secretary p.214, weighted votes p.214-215, Standing Committee p.216, Rajamannar p.217, Punchhi p.218). One `fi` fact page not in the item `pg`: Q023 (A20-712 p.218, item pg [214]). Laxmikanth pages checked in the chapter text: NCBC p.627-628, Sarkaria/Rajamannar/West Bengal/Punchhi lists p.237-243, ISC and Standing Committee p.253-254, Zonal Councils and Table 16.2 p.255-257, linguistic minorities and HQ footnote (2015), three-language formula p.856 and the Tamil Nadu footnote. All state what the items say.

## The specially named rebuilds (each answered cold, then checked against Laxmikanth text)
- Q006: s1 ("regulate its own procedure"), s3 (requisition public record, issue summons) and s4 (discovery and production of documents) are all in Laxmikanth p.628; s2 (Home Ministry approval before summoning) is invented, so false. Key "1, 3 and 4 only". The notes-only s4 is gone. RESOLVED. (LOW: "including hearings, field visits and preparation of reports" in s1 is an embellishment not in Laxmikanth; harmless.)
- Q008: s1, s2 are listed functions (p.627), s3 false (the report goes to the President), s4 true (status at par with NCSC/NCST, p.627). Key "1, 2 and 4 only". `fi` is empty (LOW).
- Q017: s1, s2 true; s3 false (the President, not Parliament, determines further functions); s4 false only through "altogether" (the 105th Amendment exempts States only for their own lists, p.628). "Only two". OK. Fair, and the explanation says why.
- Q036: s1 (Inter-Governmental Council, clauses (b) and (c)), s2 (six Union Cabinet Ministers), s4 true; s3 false (the 1990 Janata Dal Government was headed by V. P. Singh). "Only three". OK.
- Q037: s3 (Zonal Councils meet at least twice a year, Punchhi item 21) true; s2 false (Sarkaria item 7: constitute afresh and reactivate); s4 false (cultural and linguistic affinity is a listed factor); s1 (Nehru, 1956) is true history but not in Laxmikanth. "Only two". Key safe (LOW L3).
- Q059: I false (Art 263 only contemplates the Council; it was set up by presidential order), II true. Single. OK.
- Q063: the 2023 Act committee is the Prime Minister, the Leader of the Opposition and a Union Cabinet Minister; the CJI is the odd one out (he appeared only in the Anoop Baranwal interim direction). Single answer. OK.
- Q065 / Q072: the "no authority appoints them" premise is gone. Q065 is now "mainly sitting Ministers rather than persons appointed as members"; only the GST Council and the Inter-State Council fit. Q072 s1 says "largely" and s2 (Home Minister chairs the ISC) and s4 (MoS chairs the GST Council) are plainly false. Key "1 and 3 only". OK.
- Q066: all four statements are right on Art 148 and Laxmikanth p.632-633. Single. `fi` empty (LOW).
- Q069: arithmetic version, answered cold: UPSC member at 63 serves two years (limit 65), SPSC member at 55 serves the full six years (61 < 62), CAG at 61 serves four years not five, Election Commissioner at 62 serves three years not six. Key "1 and 2 only". Fair: tests the rule, not a reading trick.
- Q074: s1 (half the members with ten years' service), s2, s4 true, s3 false (the Chairman is ineligible for further employment). "1, 2 and 4 only". Stem now "according to Laxmikanth". `fi` empty.
- Q075: s1 and s2 true (p.600), s3 false (the President fixes the number), s4 false (panchayat and municipal polls belong to State Election Commissions). "Only two". OK.
- Q079: I true (an SPSC member is ineligible for a second term in that office), II true (appointed by the Governor, removed only by the President), no causal link. OK.

## HIGH
None.

## MEDIUM
- M1. The explanations and `w` lines of the Statement-I/II items are templates: Q018, Q019, Q038, Q039, Q058, Q059, Q078 say "This option treats Statement-II as ... ; check each statement against the provision first", and the three match items (Q020, Q040, Q060, also Q080) say only "swaps entries; at least two pairs are mismatched". The learner is shown these lines after the attempt and they explain nothing. Rewrite them with the specific reason (as aks14 does). Q079 and Q080's explanation are a little better but Q080 is still generic.
- M2. Repetition cap (2 per idea per concept) exceeded in AKS-20.10, which has only 12 plan facts for 20 questions: the EC Selection Committee in Q063, Q068 s1, Q076 s1; "SPSC members are appointed by the Governor" in Q068 s3, Q076 s3, Q079 II; "SPSC removal by the President" in Q070 s4, Q077 s4, Q079 II; the 62/65 age limit in Q062, Q069, Q078; article numbers in Q061, Q067, Q080 (Art 350B and Art 148 recur). In AKS-20.9 the "Rajamannar omitted 356/357/365 versus Sarkaria used 356 sparingly" pair is in Q044 (w), Q053 s2, Q057 s1/s3. Replace one occurrence of each with an untested fact (CAG oath, Art 338 clause on Anglo-Indians, Finance Commission composition, Art 324 clause 5, Punchhi items 22-31).
- M3. Notes-only or loosely sourced statements that decide a key: Q056 s1 and s3 (Punchhi on terrorism/internal security and river-water disputes) and Q054 s3 (transparency in financial transfers) are not in Laxmikanth's list (p.240-243) although true of the real report. Q056's key "Only three" needs both s1 and s3 true. Add "as reported by the Commission" to the stems or swap them for Laxmikanth items (Punchhi items 4, 19, 21, 26 are already in the book).
- M4. Weak or easy distractors: Q043 options 1 and 3 (the Planning Commission, the Administrative Reforms Commission appointing a State-level committee), Q045 option 3 ("Strong-Centre federalism" as a named principle), Q050 statement 2 (States' resources "making them independent of Union transfers" is absurd on sight), Q044 options 1-2 are real Sarkaria recommendations whose non-implementation rests on the stem wording alone (key safe because the stem says "described as the most important recommendation implemented").
- M5. Q002 and Q018 test the same fact (headquarters of the Commissioner for Linguistic Minorities, back at New Delhi in 2015) and Q002's distractors are bare years (2005, 2021) with an explanation that rests on one Laxmikanth footnote. Fair but pure recall; keep one of the two.
- M6. Q074 s1 and s4 restate aks20a-044 (half the members with ten years' service) and aks20a-056 (acting Chairman), and Q017/Q008 sit 0.67 from aks20a-113/-114. Not copies, but the same ideas inside one chapter; re-angle Q074 s1 and s4.

## LOW
- L1. Three all-correct "which" items (Q013 in 20.7, Q026 in 20.8, Q066 in 20.10), against a preferred maximum of two. JUDGED: acceptable as is. They sit in three different concepts (one per concept, 3 of 80 = 4%), each is a composition/function/safeguard list where all-true is the natural truth, and none rests on a vague claim (Q013 and Q026 are Art 279A text, Q066 is Art 148). If one is to go, Q066: make s1 "ineligible only for Union offices" and keep the key "2, 3 and 4 only".
- L2. Empty `fi` on Q008, Q014, Q066, Q074, Q075; Q023's `fi` fact A20-712 is on notes page 218 but the item `pg` is [214].
- L3. Q037 s1 (Nehru 1956) and Q006 s1's "including hearings, field visits" are not in Laxmikanth (the first is accurate history; the second is harmless).
- L4. Q063 is time-sensitive (the 2023 Act is under challenge; no change as at this review); Q042 (Home Minister chairs the NEC since July 2018) and Q004 (2024 additions) are current. Re-check after any judgment on the 2023 Act.
- L5. Q019 and Q078: Statement-I is a straight application of Statement-II, so "II explains I" is correct but easy. Fine as format variety.
- L6. Q009 s1 uses Art 351 versus 350A as the false element; Laxmikanth does not list the four articles examined, so the item leans on knowing 351 is the Hindi directive. Fair for a prepared candidate.
- L7. Q015 and Q034 use "Belagavi" / "Prayagraj" vs Laxmikanth's older names; options and explanation are consistent.
- L8. Q060 List-II lines 1 and 4 (corporation tax shareable, 75 per cent of Union revenue) are single-source facts, but the match is unique and sourced to Laxmikanth p.238-242.
- L9. Q022, Q044, Q062 keys are the longest or tied-longest options by a few characters; not a pattern.

## Per-item cold answers
All 80 keys were derived from Laxmikanth text (chapters 15, 16, 47-51, 54, 88 and the Article text) before the key was read, and all agree. Falsifier rule: no distractor is also supported. Risky ones checked: Q007 s3 (Art 342-A names the President, not the NCBC), Q012 s4 (15 September 2016, not 2017), Q022 (Art 269A, not 246A), Q027 s1 and s3, Q030 s4 (permanent invitees, not members), Q033 s4, Q048 s1 and s3, Q052 s3 (Rajamannar wanted "pleasure" omitted, p.238), Q054 s4 (Punchhi made over 310 recommendations; 247 is Sarkaria's), Q070 s3 (Supreme Court advice binds the President), Q077 s1 (insolvency needs no inquiry).
