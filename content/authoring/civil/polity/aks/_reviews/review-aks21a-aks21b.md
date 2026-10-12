# Review: aks21a and aks21b (Non-Constitutional Bodies)

Reviewer pass: every question re-answered cold from Laxmikanth (ch57, 58, 64, 65, 66 read in full) and law before reading keys. Status: both packs complete. Verdicts: aks21a FAIL (6 HIGH), aks21b PASS (0 HIGH).

## aks21a (120 questions, AKS-21.1 to 21.6)

Format mix: exactly 5 direct / 9 which / 3 how-many / 2 Statement-I/II / 1 match per concept (brief followed). Against the 2020-26 column of the trends doc (direct 26, which 48, how-many 12, Stmt-I/II 6) the pack is direct 25, which 45, how-many 15, Stmt 10, match 5: acceptable, Statement-I/II a little rich (LOW).
Coverage script: chapter 21 = 501 facts, 482 covered, 19 skipped, 0 uncovered. aks21a skips 10: A21-052, 053, 057, 058, 066, 068, 102, 174, 175, 176. All ten are legitimate (no Laxmikanth support or conflict with Laxmikanth and the Act; A21-102 correct skip, s.29 of the 1993 Act excludes the treaty-study clause for SHRCs). AKS-21.3 skips 5 of 37 = 13.5% (over the 12% cap) but every skipped fact is an unverifiable attribution or a conflict, so the overrun is justified (not a defect).

### HIGH (6)
All six Match items lost their List-I rows. The stem prints only "List-II" numbered entries (1-4) and the options use A-D labels that refer to nothing; the question cannot be answered. Contrast aks21b, whose match stems carry both lists. Likely cause: `permute-match.py` / reshape run after hand-permutation dropped the "List-I A-D" block. The explanations still contain the intended pairs, so the fix is to rebuild each stem as "List-I A..D / List-II 1..4".
- CS-POL-aks21a-020 (NHRC numbers: A five members, B seven ex-officio, C six committee, D 70 years)
- CS-POL-aks21a-040 (authority vs role in SHRC: A President removes, B Governor appoints, C Supreme Court inquires, D HC Chief Justice consulted)
- CS-POL-aks21a-060 (A Chakma refugees, B one month, C one year, D publicise vacancies)
- CS-POL-aks21a-080 (A Sweden 1809, B Finland 1919, C Denmark 1955, D UK 1967)
- CS-POL-aks21a-100 (A SPE 1941, B DSPE Act 1946, C CBI 1963, D Section 6A struck 2014)
- CS-POL-aks21a-120 (A CTE wing technical audit, B CDIs oral inquiries, C Secretariat, D Whistle Blowers' Resolution)
(Note: after the repair, the key text also has to be re-checked, because the options are only meaningful with the rebuilt lists; the mapping given in each `e` is correct against Laxmikanth.)

### MEDIUM
- AKS-21.1 repetition cap exceeded: the ex-officio-member idea is tested four times (Q001, Q012 stmt 3, Q015, Q020 B-1); the six-member committee three times (Q002, Q007, Q020 C-4); term three years/70 three times (Q008, Q012 stmt 4, Q020 D-2). Replace one or two (e.g. Q015 or Q020) with untested facts such as the "ICCPR/ICESCR" basis or the Secretary-General point.
- AKS-21.3 repetition cap exceeded: "SHRC informs action taken within one month" appears in Q044, Q053 (stmts 2 and 4), Q058 and Q060 (B-4); "recommendations not binding" in Q045, Q050, Q053, Q058.
- AKS-21.5 repetition: state consent for CBI is tested in Q083, Q095, Q098; CBI Director tenure and appointment in Q084, Q090, Q091 (stmt 1, 4); Vineet Narain in Q091 (stmt 4), Q094, Q099. Each idea reaches three.
- Q014 (AKS-21.1): option shape tell. The three false statements (1, 2, 4) all contain "cannot", the true one does not; the key is the only statement without a negation. Reword two of the false ones without "cannot".
- Q010: false statement 1 alone carries "only ... cannot act on its own" (tell-words); other statements carry none.
- Q061 (Whyatt Report) rests on a fact absent from Laxmikanth; correct in real history (Whyatt Report 1961) but cited to Laxmikanth p.722 for the UK date only. Keep, but `pg`/`e` should say the Whyatt name comes from the notes.
- UK 1967 is tested three times in AKS-21.4 (Q061, Q066, Q080); Finland/Denmark dates twice (Q066 stmt 4, Q080). Over the cap by one.

### LOW
- Q017, Q036, Q075 `fi` lists do not match what the statements test (Q017 lists only A21-004 though three of four statements test the 2019 Secretary-General/UT provisions that are Laxmikanth additions; Q036 lists A21-113; Q075 lists A21-124 only). Coverage unaffected.
- Q036 stmt 1 (SHRC functions in UTs other than Delhi): Laxmikanth p.683 says "except J&K and Ladakh" while the 2019 amendment list on p.686 says "except Delhi". The stem says (Laxmikanth) without "2019 Amendment"; a careful reader could hesitate. Add "under the 2019 Amendment".
- Q052 explanation cites Laxmikanth p.684 for "jails under State Government control"; Laxmikanth does not say that (the notes p.226 do; real law s.12(c) as applied by s.29 does). Cite the notes.
- Q091 stmt 2 (CBI Director appointment completed by the Appointments Committee of the Cabinet "in practice") is true in practice but only in the notes, not Laxmikanth (A21-170 flagged verify). Acceptable because stated as practice; add "in practice per the notes" is already there; keep.
- Q070 stmt 3 says fifty per cent from SC/ST/OBC/minorities/women. Laxmikanth says 50%; the Act says "not less than fifty per cent". Not wrong for the key, but note it.
- Q107 stmt 4 ("headquarters at Mumbai") and Q034 stmt 4 ("only at the State capital") are weak distractors (no near-miss).
- Q019: Statement-II ("provisions aim at autonomy") is a generic statement; causal link to the post-tenure bar is acceptable but the weakest explain-item.
- Q042 option 3 ("violation by a public authority that the Commission takes up suo motu") is trivially within jurisdiction; fine as a distractor.

### Verification table (aks21a, answered cold, all keys confirmed unless listed)
Keys recomputed for all 120; every key matches except the six unanswerable match items. Cross-checks made against Laxmikanth text: NHRC five members and seven ex-officio (p.678), tenure three years/70 (p.679), grounds list (no moral-turpitude wording, so the pack rightly never uses "moral turpitude" as a false NHRC ground; it uses it only for the CVC where Laxmikanth p.711 and the CVC Act have it), three months for armed forces action, one month for action taken, SHRC two members and CM-headed committee, seven-year District Judge, Human Rights Courts (p.685), 2019 amendment list (p.685-686), Lokpal 8 members / 50% judicial / 50% reserved / five-member selection committee (p.725), timelines 3+3, 6+6, 1+1, punishments 7 to 10 and minimum 3/2, ten Bill dates and governments (p.724-725), CBI 1941/1946/1963, DSPE 2014 and 2021 amendments, CVC term 4 years/65, five removal grounds including financial interest (p.711), jurisdiction list (RBI, NABARD, SIDBI; the pack tests RBI and NABARD only, never IDBI), Whistle Blowers Act (two years, Rs 30,000, SPG exempt).
Real-law checks: Section 6A struck down 2014 (Art. 14), Entry 80 Union List, caged parrot 2013, Vineet Narain 1997.

## aks21b (120 questions, AKS-21.7 to 21.12)

Format mix: 5 direct / 9 which / 3 how-many / 2 Statement-I/II / 1 match in every concept. Direct key is longest in 8 of 30 (fine). All six match stems carry both List-I and List-II (checked); keys A-D recomputed and correct (003, 034, 059, 080, 081, 117).
Coverage: 9 skips (A21-599, 824, 853, 855, 856, 872, 873, 912, 913), all per-concept under the 12% cap (largest AKS-21.10 = 3/36 = 8%). Reasons are legitimate: 599 PUCL attribution doubtful; 824 Action Taken Memorandum not in Laxmikanth; 853/855/856 NCW extended mandate that the notes themselves admit is not Section 10 (the Laxmikanth list of fourteen has none of them); 872/873 unnamed anecdotes (labelled "untestable", really unverifiable, fine); 912/913 DMEO rank and staffing figures. The verify-flagged facts with a safe corrected form were tested in that form: A21-565 (Q033, Q013), A21-578/585/607/615/829 (term "three years according to the notes" in Q028, Q050, Q074), A21-586/616 (five-year aggregate attributed to Laxmikanth, Q028, Q050), A21-843 (Q063 with Laxmikanth's six grounds), A21-891 (Q086, Q095), A21-907 (Q101, Q104), A21-916 (Q111, Q116, Antyodaya = Deendayal Upadhyay), A21-936/937/946 (Q112, Q113), A21-942/944/945 (Q102, Q105).
Real-law checks passed: ED Director selection committee headed by the Central Vigilance Commissioner (CVC Act s.25) with Home, DoPT and Revenue Secretaries; two-year minimum and five-year cap by the CVC (Amendment) Act 2021 (Q016 correctly rejects the DSPE Act as source); NCM Act s.5 grounds (six, no paid employment); Section 22/8(2) RTI; penalty Rs 250/day to Rs 25,000; 30-day period; ED regional offices Mumbai, Chennai, Chandigarh, Kolkata, Delhi (Q007; zonal and sub-zonal city names are time-sensitive and the stem says "according to the notes").

### HIGH: none.
Every key re-derived cold from Laxmikanth (ch56, 59, 61, 62, 63, 64) and the Acts; no second defensible option found.

### MEDIUM
- Statement-I/II where II restates I (brief forbids): Q006 (I: a person from a distant State can be summoned; II: the Commission can summon from any part of India) and Q084 (I: no Act is the source of NITI Aayog; II: created by a Cabinet resolution not by the Constitution or an Act). Re-angle both so II is a separate cause or a clear non-cause.
- Q056 (AKS-21.9) Statement-II "explains" Statement-I is contestable: the complaint head (no PIO appointed) and the power to direct an appointment are two separate listed powers, so a candidate can defensibly choose "both correct, II does not explain I". Treat as ambiguous; change to a clear non-explaining pair or recast.
- Q013 (AKS-21.7) explanation says "neither the Constitution nor the Act defines 'minority'". Laxmikanth p.701 says the Act does not define it, but the Act (s.2(c)) defines it as a community notified by the Centre. The key is safe only because statement 1 also claims the Act lists the communities; reword the explanation ("the Act does not list the communities; the Centre notifies them").
- Q004 (AKS-21.7) has only three statements (all others four), statement 3 (the CTE wing "consists of judicial officers who try offences") is a throwaway distractor, `fi` is ['A21-524'] though the facts tested are the CTE wing (A21-209, 210, 212), and it repeats aks21a-107/108 (CTE wing tested in aks21a Q105, Q107, Q108, Q120 and again here).
- Stems that cite "the notes" (brief: never mention the notes in the stem except to hedge time-sensitive items): 22 stems (Q001, 003, 007, 009, 010, 012, 016, 028, 029, 036, 038, 050, 057, 074, 083, 090, 091, 094, 106, 112, 117, 119). Justified only where the notes conflict with Laxmikanth or the number is time-bound (Q007, Q028, Q029, Q050, Q074); the comparison-table references (Q106, Q112, Q117) and Q038 ("sections given in the notes") are non-time-sensitive and read as notes-recall, not exam knowledge. Reword to plain statements or "according to Laxmikanth" where the book supports it. aks21a has none.
- Cross-pack duplication of the CVC with aks21a AKS-21.6 (the brief asked to check): the same ideas are tested in both packs: origin 1964/2003 (aks21a-102; aks21b-002, 015), appointment committee PM + Home Minister + LoP (aks21a-101, 106; aks21b-002, 020, 102, 113), four years or 65 (aks21a-104; aks21b-020, 112, 117), pay like UPSC Chairman (aks21a-103, 111; aks21b-018), whistle-blower agency (aks21a-116, 117; aks21b-018), Scale V in banks (aks21a-114; aks21b-018), civil-court powers (aks21a-115; aks21b-014), annual report to the President (aks21a-119; aks21b-018), CTE wing (above). AKS-21.7's CVC items (Q002, 004, 014, 015, 018, 020) therefore re-test AKS-21.6 almost one-for-one while ED and NCM facts are tested only once each. Replace at least Q015, Q018, Q020 with ED or NCM minute facts (for example ED origin as FERA-era Enforcement Unit, Fugitive Economic Offenders Act steps, NCM nine-point mandate item by item).
- Repetition cap (2 per idea per concept) exceeded: AKS-21.8, the 2019 RTI amendment appears in Q025, Q029 (stmts 2-3), Q030, Q036; AKS-21.12, NILERD/IAMR in Q101, Q108, Q120 and DMEO merger of PEO/IEO in Q101, Q104, Q107; AKS-21.7, NCM removal grounds in Q011, Q013 (stmt 4), Q019 (stmts 1-2). In AKS-21.12, committee patterns (CVC committee) in Q102 (stmt 1 as trap), Q113 (stmt 3), plus the match Q117.
- Q110: Statement-II (bottom-up think tank) as the reason NITI does not allocate plan funds is a plausible but thin causal claim; the Statement-I fact (no allocation power) follows from the Resolution, not from "bottom-up". Acceptable, flagged.

### LOW
- Near-duplicates of tagged lk56 items (below the 0.7 re-angle line): Q082 vs lk56-027 (ranks of Vice-Chairperson and Full-time Members), Q097 vs lk56-022 (four ex-officio members), Q120 vs lk56-077 (NILERD autonomous), Q107 vs lk56-061 (PEO + IEO merger), Q116 vs lk56-060 (Inclusion principle). Also Q020/Q112 vs aks20a-071 (tenure lines) and Q050 vs aks20a-008 (stem identical shape).
- Q014 stmt 1 ("CVC has no investigating agency of its own") is the notes' claim; Laxmikanth p.712 lists investigation of complaints by the CTE wing. Fine as stated, but the explanation could mention it.
- Q008 stmt 4 (foreign FIU dealings are a CVC task) and Q052 stmt 2 (imprisoning a PIO for contempt) are weak distractors.
- Q042: the key is the only option that mentions "varying with the workload" and one of two options with "fixed in the Act for every State alike", which lets a candidate eliminate by pattern. Mild.
- Q037 and Q079 keys are the longest options by 10 to 30 characters (acceptable at the pack level, 27% of directs).
- Q038 tests section numbers 18/19/20/25 that only the notes give; true in the Act, harmless.
- Q114 mixes bodies with an Act in an ordering item ("National Commission for Women Act"): fine, but say "year of establishment or enactment".

## Cross-pack and general

- `dup-check.py`: aks21a vs 55 packs, 10 lines at 0.6 or higher; only aks21a-100 (a Match stem, 1.00 vs lk26-120) and aks21a-033/106 vs aks20a (0.82/0.80 on commission tenure and warrant lines) are above 0.7. They are generic stem or term lines, not copied facts; reword the stem of 100 once the List-I rows are restored. aks21b: 17 lines, none above 0.7.
- `check-civil-pack.py` reports 0 problems on both packs, so the validator does not catch the missing List-I rows in aks21a. Recommend adding a check that every `match` stem contains "List-I" and "List-II" with A-D and 1-4 entries.
- Coverage (`aks-coverage.py --chapter 21`): 501 facts, 482 covered, 19 skipped (10 in aks21a, 9 in aks21b), 0 uncovered.
- Trends doc (2020-26 column: direct 26, which 48, how many 12, Stmt-I/II 6): aks21a and aks21b are identical in shape (direct 25, which 45, how-many 15, Stmt-I/II 10, match 5), consistent with the brief; Statement-I/II is over-represented relative to the trend by about four points per pack (LOW). Recall share is high (about 8 of 20 direct or single-fact items per concept), within the brief's cap.
- Facts that changed after the exam years: none of the questions rely on a repealed law (CrPC/IPC not used). Time-bound items handled: States' withdrawal of CBI general consent (aks21a-098 states it as fact without "according to the notes"; Andhra Pradesh restored consent in 2024, so word it "according to the notes", MEDIUM), CIC/SIC term of three years (2019 Rules, tagged "according to the notes"), ED office counts (tagged), Whistle Blowers Protection Act 2014 (quoted from Laxmikanth; the Act has not been brought into force, LOW).

## Counts

| Pack | HIGH | MEDIUM | LOW | Verdict |
|---|---|---|---|---|
| aks21a | 6 (Q020, 040, 060, 080, 100, 120: match stems missing List-I) | 8 (cap breaches in AKS-21.1, 21.3, 21.4, 21.5; Q014 and Q010 tells; Q061 source; Q098 time-bound wording) | 8 | fail until the six match stems are rebuilt |
| aks21b | 0 | 8 (Q006, Q084, Q056, Q013, Q004, notes-in-stem, CVC cross-pack duplication, cap breaches) | 7 | pass |

Fix list for aks21a before re-review: rebuild the List-I block (A-D) in 020, 040, 060, 080, 100, 120 using the pairs already given in each `e`; then re-run `permute-match.py` carefully (it appears to have removed List-I) and re-validate. Candidates for List-I text:
- 020: A Full-time members besides the Chairperson; B Ex-officio members; C Members of the selection committee; D Upper age limit in years.
- 040: A President; B Governor; C Supreme Court; D Chief Justice of the High Court (as pairs in `e`).
- 060: A Chakma refugees case; B Time to report action taken (SHRC); C Bar on inquiring into old complaints; D GANHRI Sub-Committee suggestion.
- 080: A Sweden; B Finland; C Denmark; D United Kingdom.
- 100: A Special Police Establishment; B DSPE Act; C CBI; D Section 6A struck down.
- 120: A Chief Technical Examiners' Wing; B Commissioners for Departmental Inquiries; C Secretariat; D Whistle Blowers' Resolution.
