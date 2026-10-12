# Final verification: aks21a and aks21b
Status: started. Sections appended per pack.

## aks21a progress log
- Scripts: check-civil-pack 0 problems; 120 ids unique; every key = o[0]; 3 w lines each; all 6 match items have List-I A-D and List-II 1-4 (verified in stems).
- AKS-21.1 and 21.2 (items 001-040) answered cold from Laxmikanth ch57/58: all 40 keys agree, no second defensible answer. Notes:
  - aks21a-026 stmt 4 omits the Act's "moral turpitude" qualifier (Laxmikanth text also omits it): LOW.
  - aks21a-019 Statement-II "explains" Statement-I is debatable but supported by Laxmikanth p.679: LOW.
- AKS-21.3 and 21.4 (041-080) answered cold (Laxmikanth ch57/58/66): all 40 keys agree; the earlier match items 060 and 080 now carry List-I A-D and List-II 1-4 and are uniquely answerable (080: Sweden 1809, Finland 1919, Denmark 1955, UK 1967 per Laxmikanth p.722; Laxmikanth is right and real law agrees).
  - MEDIUM aks21a-061: stem opens "According to the notes (the report is not named in Laxmikanth)": names the notes in a stem (only aks21b Q007/028/029/050/074 are allowed).
  - MEDIUM aks21a-058: Statement-II ("President removes them on the same grounds and in the same manner as for the NHRC") largely restates the second half of Statement-I (Governor cannot remove); "explains" is weak.
  - MEDIUM (repetition) AKS-21.4: the 365-day Lokayukta deadline is tested three times (074 s3, 077 s2, 078 S-II).
  - LOW aks21a-051 s4 / 052 s1,s2 add embellishments ("State laws and administrative practices", "vulnerable groups", "seminars, workshops") beyond Laxmikanth; true in substance.
- AKS-21.5 and 21.6 (081-120) answered cold (Laxmikanth ch64/65/66): all 40 keys agree. Rebuilt items 098/099 and 061/010/014 checked (see below); 100 and 120 now carry both lists.
  - MEDIUM aks21a-098: Statement-I begins "According to the notes" and carries a parenthetical hedge "(a position that has changed in some States since)": names the notes in a statement and the hedge is a reading cue, not knowledge. Key itself (both correct, II explains I; Entry 80 of the Union List is real) holds.
  - MEDIUM aks21a-099: Statement-II ("investigations are meant to be insulated from control by the executive that supervises the agency") is a loose normative claim, not a sourced fact; the CBI works under the DoPT and the CVC superintends PC Act cases, so a candidate can argue II is incorrect. Key (both correct, II explains) is the author's intent but is not clearly the only defensible reading.
  - LOW aks21a-055, 081, 082, 097 have empty `fi` (Laxmikanth-added items; untraceable to a fact id).
  - LOW aks21a-120: List-II row 2 ("The Whistle Blowers' Resolution under which the CVC acts on disclosures") repeats List-I item D almost verbatim, so D is solved by echo.
- Mechanical checks on aks21a: truth set implied by each explanation equals the key for all 54 which + 18 howmany items; `w` lines align with option order after reshape (no misalignment on any templated line); no option set reused >2 per concept; dup-check: no line >= 0.7 (top 0.78 is a generic "appointed by warrant under hand and seal" line vs aks14, different body: no action).
- Page citations (`pg` vs inventory `pg` of the `fi` facts): LOW, loose `pg` lists on aks21a-020 (lacks 221), 023 (lacks 226), 037 (lacks 226), 040 (lacks 222), 064 (lacks 229), 076 (lacks 227), 107 (lacks 235; A21-518 sits on 235, explanation says 234). All facts verified present in Laxmikanth or the notes.
- Notes-vs-Laxmikanth conflicts handled well: 094 stmt 2 (caged parrot, Coalgate 2013 not Vineet Narain) is false in real law, and the explanation says so; 009 stmt 3, 070 stmt 4 and 089 stmt 1 likewise. Fair, but a candidate who trusts the notes could be misled on 094: acceptable (the Falsifier rule is met).
- Format mix: direct 30, which 54, howmany 18, Statement-I/II 12, match 6 (25/45/15/10/5 %). Trends 2020-26 column: direct 26, which 48, how-many 12, Stmt 6. Statement-I/II 2x too rich (LOW, brief-mandated 2 per concept).
- Option-shape: which items run 6-7 of 9 with exactly three true statements in AKS-21.3 to 21.6 (key is usually a 3-statement combination): LOW tell. Direct key is the longest option in 3 of 5 items in AKS-21.5 (081, 082, 084 vs others): LOW.
- Coverage: chapter 21 = 501 facts, 479 covered, 22 skipped (11 per pack), 0 uncovered. aks21a skips: A21-052, 053, 057, 058, 066, 068, 069, 102, 174, 175, 176. All carry a legitimate reason with inventory text (unverifiable attributions/anecdotes, conflict with Laxmikanth/the Act, A21-069 is the notes' own error, A21-102 correct under s.29 of the 1993 Act). AKS-21.3 skip rate 5/37 = 13.5% (over 12%): LOW, justified.

### aks21a verdict: PASS (0 HIGH)
HIGH: none. The six restored match items (020, 040, 060, 080, 100, 120) now print List-I A-D and List-II 1-4; each has exactly one correct option (checked against Laxmikanth p.680-682 and fn.1; p.683-684; p.683, fn.1 and p.724-726; p.721-722; p.716, 719; p.712). Rebuilt 099/098/061/010/014 are answerable with one key (099 and 098 carry the MEDIUM caveats above; 010 s1 and 014 s1/s2/s4 are false against Laxmikanth p.679-680, key 2,3,4 and "3 only" hold).
MEDIUM: 061 (stem names the notes), 098 (statement names notes plus hedge), 099 (loose Statement-II), 058 (Statement-II restates I), AKS-21.4 365-day idea x3 (074, 077, 078).
LOW: 019, 026, 051/052 embellishments, 055/081/082/097 empty `fi`, 120 echo, loose `pg` list above, format skews above.

---

# aks21b final verification (fresh full pass, all 120 items answered cold)

Method: stems and options read first (key hidden at the end of each list), each item solved from Laxmikanth ch57/58/61/62/63/64/65/56/59 and the study notes ch21 (pp.235-254), then compared with o[0]. Script checks: 120 ids unique; a == o[0]; 4 distinct options; 3 w lines; every templated w quote matches the option it sits on after reshape; truth set implied by each explanation equals the key for all 54 which and 18 how-many items (0 mismatches); all 6 match items (003, 034, 059, 080, 081, 117) print List-I A-D and List-II 1-4 and have exactly one correct option; `fi` non-empty everywhere; check-civil-pack 0 problems; notes named in a stem or option only in Q007, Q028, Q029, Q050, Q074 (allowed set).

All 120 keys agree with my own cold answer (the only two raw differences, Q110 and Q113, are discussed below and are not wrong keys).

## HIGH
None.

## MEDIUM
- aks21b-110 (Statement-I/II): key says "both correct and II explains I". Statement-II ("a policy think tank that follows a bottom-up model of cooperative and competitive federalism") is about federalism style; the link to "does not allocate plan funds" is only via the words "think tank". A careful candidate can defend "does not explain" (as the author did for 092, 084, 069). Not a clear wrong key (the explanation's reasoning is respectable) but two readings are available. Suggest rewording II to "NITI Aayog is a think tank with an advisory role and no executive or financial authority".
- aks21b-113 stmt 4 ("tenure decided by the Union Government"): supported only by the notes' comparison table (p.253, NITI row); Laxmikanth ch56 says only that the Vice-Chairperson is appointed by the PM. The explanation cites only "nominated by the PM" and never addresses the tenure clause, and the key (Only two) depends on stmt 4 being true. Add the tenure clause to the explanation or drop it from the statement.
- aks21b-114: the stem asks the order of "establishment" but the option set mixes bodies with an Act ("National Commission for Women Act"). The notes' own mantra dates the CVC "1964/2003 (statutory only from 2003)", so option 3 (ED, CBI, NCW Act, CVC) is correct if a candidate dates the CVC by its statute, which the same pack teaches in Q002 and Q115. Key (ED 1956, CBI 1963, CVC 1964, NCW Act 1990) is the standard reading, but the item is ambiguity-prone. Fix: say "in the order of their first establishment (executive or statutory)" or drop the CVC from the list.
- aks21b-111 stmt 1 and 116 stmt 1 (Antyodaya): both rest on "Laxmikanth ties it to Deendayal Upadhyay, not Gandhi"; the inventory (A21-916, flag verify) says "Avoid asking whose philosophy", and the notes say "Gandhian philosophy". Both stems do say "according to Laxmikanth" (111) or "Laxmikanth ties it to" (116), so the key is source-bound and defensible, but the Falsifier rule is only just met (Gandhi's Antyodaya is a real association). Two uses = at the repetition cap.
- aks21b-036 stmt 4 (and 057 stmt 4): the correct statement is an evaluative claim ("statutory fixation safeguarded independence, whereas determination by the Centre increases executive control") taken from the notes' comparison table, and 057 stmt 4 depends on "reform suggestions include..." from the notes only. Both keys are supportable from the notes, but a pure-Laxmikanth candidate cannot know them; opinion-type statements counted as "correct facts".
- Repetition above the cap of 2 per idea per concept:
  - AKS-21.8: NCM history and years (1978 resolution, 1992 Act, 1993 five communities, 2014 Jains) in Q026, Q032, Q033 s2, Q034 (4 items), plus Q018 in AKS-21.7.
  - AKS-21.9: "Governor appoints SIC members / committee" in Q045, Q055 s2, Q056 II, Q059 A (4); "Centre prescribes SIC service conditions" in Q043, Q050 s1, Q059 D (3).
  - AKS-21.10: NCW Act 1990 versus constitution in 1992 in Q069, Q073, Q080 A/B (3).
  - AKS-21.11: NITI by executive resolution in Q084, Q088 s4, Q096 (3); Part-time members maximum two in Q081 D, Q095 s4, Q097 s1 (3); Governing Council in Q092 s1, Q097 s4, Q098 (3); Regional Councils in Q086, Q092 s2, Q095 (3).
  - AKS-21.12: CBI 1963 resolution / non-statutory in Q106 s4, Q109, Q115 s1-2, Q117 D (4); this is the comparison concept so overlap is expected, still over the cap.
  - AKS-21.7: ED office hierarchy (heads of HQ/regional/zonal/sub-zonal) in Q003, Q007, Q009 (3).
  Not wrong items, but the bank gets lopsided; thin or merge Q009 s2-s4, Q073, Q096 first.
- Statement-I/II answer spread: of 12, "both correct, II does not explain" is the key in 7 (002, 006, 025, 056, 069, 084, 092), "explains" in only 2 (071, 110), so a test-wise candidate guesses "does not explain" when the two statements are unrelated. Related to the Q110 concern.

## LOW
- Option-shape tells: in `which` items the keyed combination has exactly three true statements in 31 of 54 (57%), "1, 2 and 4 only" is the key 11 times (20%). Direct items: key is the longest option in Q067, Q079, Q105 (and Q038 by a hair).
- Format mix versus the 2020-26 column of the trends doc: direct 30 (25%), which 54 (45%), how-many 18 (15%), Statement-I/II 12 (10%), match 6 (5%); trends 26/48/12/6 per 120, so Statement-I/II is 2x (brief-mandated 2 per concept) and how-many slightly rich.
- Loose `pg` (inventory page of an `fi` fact not in the item's `pg`): 002 (254), 036 (242), 044 (243), 059 (242), 111 (251). All facts exist on the cited sources.
- Q063 ("according to Laxmikanth", paid-employment is not an NCW removal ground): the notes list it as a ground (inventory A21-843, flag verify); the key is right under the stated source and the explanation should say the notes differ. Q093 stmt 3 (25 verticals) is a dated fact of the 8e table.
- Q014 explanation for stmts 3 and 4 says only "Laxmikanth p.714"; correct (ch64: civil-court powers, judicial character, reasons recorded in writing) but give the fact. Q016 stmt 2 trap (CVC Amendment Act 2021 for the ED versus the DSPE Amendment Act 2021 for the CBI) is fair and correctly explained.
- Skipped list: A21-521 and A21-523 (CVC composition and tenure) are labelled "untestable" although the inventory flags them ok ("also in Laxmikanth ch64"); the facts are in fact tested via aks21a-106 and aks21b-112, so the reason should read "covered elsewhere". The other nine skips carry legitimate reasons with inventory text: A21-599 (PUCL attribution doubtful), 824 (Action Taken Memorandum not in Laxmikanth), 853/855/856 (NCW extended mandate not statutory, notes admit it), 872/873 (unnamed anecdotes), 912/913 (DMEO rank and staffing unconfirmed). Coverage for chapter 21 (aks-coverage.py): 501 facts, 479 covered, 22 skipped (11 per pack), 0 uncovered.
- Notes-versus-Laxmikanth conflicts handled correctly and explained: SIC tenure (three years per notes in 050/074 versus five-year aggregate cap per Laxmikanth fn.3), NHRC tenure three years (matches the 2019 amendment), CIC strength ten not fifteen (022), NCM members "six" before 1995 (032), NILERD autonomous and DMEO attached (101), CBI non-statutory (106, 109, 115).
- dup-check (python3 scripts/civil-services/dup-check.py aks21b.json): 12 lines at >= 0.6, highest 0.83 is the generic match stem (aks21b-117 vs aks11b-007, no action); next 0.67 (062 vs aks20a-093, 050 vs aks20a-008, different body, no action). No line >= 0.7 that is a real duplicate.

## Specially verified rebuilt items
084 (S-I/II, key sound, II does not explain: fine), 107 (Team India Hub: unique), 120 (SDG monitoring: unique, distractors from other bodies), 004 (stmts 1,3,4 true; stmt 2 false because an adjudicating authority is involved), 006 (resignation does not explain summoning: fine), 013 (Only two: 3 and 4 true), 015 (1956), 018 (Only three: stmt 3 false, MHA versus Minority Affairs), 020 (1,2,4: stmt 3 false), 056 (both correct, II does not explain): all keys confirmed, one defensible answer each.

### aks21b verdict: PASS (0 HIGH)
HIGH: none. MEDIUM: 110, 113, 114, 111/116, 036/057, repetition list, Statement-I/II key skew. LOW: as listed.

## Combined
aks21a: PASS (0 HIGH, 5 MEDIUM). aks21b: PASS (0 HIGH). Both packs may proceed; MEDIUM items are optional polish except the wording fixes suggested for aks21b-110, -113, -114 and aks21a-061/098/099.
