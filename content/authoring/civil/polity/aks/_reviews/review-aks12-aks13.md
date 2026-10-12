# Review: aks12 (Parliamentary Committees) and aks13 (Emergency Provisions)

Reviewer pass of 2026-10-11. Packs not edited. Validator (`check-civil-pack.py`): 0 problems on both. `aks-coverage.py`: ch12 146 facts, 136 covered, 10 skipped, 0 uncovered; ch13 133 facts, 131 covered, 2 skipped, 0 uncovered.
Sources checked: Laxmikanth ch24 (pdf 394-408) and ch25 (pdf 410-413) text, inventories, AKS notes.

## PART 1 - aks12

Format mix per concept (all four): 5 direct, 9 which, 3 howmany, 2 stmt12, 1 match = the brief's mix. Every concept has 20 questions. Page tags (`pg`) match the inventory `pg` of the `fi` facts in every item I checked. Laxmikanth page cites in `e`/`w` are correct (396-400 financial and DRSC, 405-408 inquire/scrutiny/business/house-keeping/consultative, 410-413 IPG).

### Skipped facts (10 of 146)
- AKS-12.1: A12-031 (1/42, 2.4%) untestable - acceptable.
- AKS-12.2: none.
- AKS-12.3: A12-107, A12-122, A12-123, A12-124, A12-125, A12-126, A12-127 = 7 of 39 = 17.9% (cap 12%). ACCEPTABLE: every skipped fact carries an inventory note that says "do not use / unconfirmed / outdated" (Ethics cases, forum President exception, forum VPs, forum strength 31, forum nomination, IPU/PACE list, PACE 47). The rest of the forum facts that ARE tested (A12-120, A12-121) are thin, see MEDIUM on 313.
- AKS-12.4: A12-129, A12-141 = 2/19 = 10.5% - acceptable (generic background; IPU count 153 vs 179 conflict).

### Verify facts, corrected-form check
- A12-047 (Ethics RS 13): 214 stmt 3 uses it as a false statement ("according to Laxmikanth 15 and 13"); L p.405 gives 15 and 10. OK.
- A12-055 (PAC and demands for grants): 204, 206 stmt 1 use the corrected form (appropriation/finance accounts, CAG reports; demands go to DRSCs, L p.403-404). OK.
- A12-079 (Papers Laid name): 211, 218, 220 use L name and L rule (excludes statutory notifications, L p.406). OK.
- A12-099 (JPC examples are standing joint): 308 stmt 1 states they are standing, not ad hoc; L p.395. OK.
- A12-103/104 (Ethics LS 2000 ad hoc / 2015 permanent): used as true; true in real record (Balayogi 2000; Speaker Mahajan 2015). OK.
- A12-107, 122-127, 141: skipped. A12-121 (Speaker ex-officio President of ALL forums) is tested although the inventory itself flags the sibling exception A12-122 as unconfirmed - see 313.

### Findings (aks12)

HIGH
- CS-POL-aks12-304 (direct). "Which would be treated as a breach of privilege of a member, rather than of the House?" Key = defamatory statements imputing corruption against a member. Distractor 3 = "Obstructing the free movement of members to and from the House". The House-vs-member taxonomy is the notes' own (not in Laxmikanth ch24, not in May/Kaul-Shakdher in this form). In real parliamentary law obstruction/molestation of members on their way to the House is the textbook breach of a MEMBER's privilege (freedom from obstruction), and reflections on members are classed as contempt of the House. So the distractor is arguably also correct and the key arguably wrong. The stem does not say "as classified in the notes". Fix: add "according to the classification in the study material", or replace the distractors with items that are false in real law (e.g. publishing a report of the Lok Sabha proceedings without distortion is not a breach at all).

MEDIUM
- CS-POL-aks12-312 stmt 3 and 316 stmts 1-4: same notes-only taxonomy (obstructing movement = breach of the House; threats/defamation = breach of a member). 316 flags "as classified in the notes" in the stem and is therefore fair; 312 does not. In real law threats to a member are also contempt of the House, so "Threats of violence against a member are a breach of privilege of the House" (316 stmt 3, false in the key) is not false in real law. Fix by flagging the source in 312 and rewording 316 stmt 3/4 to a pair that is false on any reading.
- CS-POL-aks12-313. Stem "according to the notes" (the brief forbids naming the notes in the stem except for time-sensitive items). Stmt 2 "The Lok Sabha Speaker is the ex-officio President of the Parliamentary Forums" is true only if there is no exception, and the same inventory (A12-122) lists a Population and Public Health exception that the author declined to test because it is unconfirmed. So the true statement may be false in real law. The item has no Laxmikanth or real-law support (inventory says "not covered in Laxmikanth"). Fix: test only the nature of forums (informal, not statutory) or drop to "generally".
- CS-POL-aks12-314 stmt 3 "The Committee on Security Matters in the Parliament House Complex is among the specialised committees mentioned" - "mentioned" by whom is not stated; Laxmikanth's name is "Joint Committee on Security in Parliament Complex" (ad hoc). Reading-trick true statement; reword to "The Joint Committee on Security in Parliament Complex is an ad hoc inquiry committee (L p.395)".
- CS-POL-aks12-118 (stmt12). II ("elected by the Lok Sabha every year from among its own members") is nearly a restatement of I (no Rajya Sabha representation). Brief: never let II restate I. A candidate can defend "both correct, II does not explain I". Reframe II as a cause that is not the same fact (e.g. the Estimates Committee was constituted in 1950 on a Lok Sabha-centred basis) or switch to a non-explaining pair.
- CS-POL-aks12-418 (stmt12). I: IPG is the link between Parliament and foreign parliaments. II: IPG is the National Group of IPU and CPA branch. Laxmikanth (p.411 items 1 and 2) lists these as two SEPARATE functions; "II explains I" is defensible but so is "does not explain". Not clearly one or the other.
- CS-POL-aks12-219 (stmt12). I (PAC detects tax-administration loopholes) is the notes' own claim, not in Laxmikanth's PAC list in that form; the explains-link is plausible but loosely causal. Keep if a note is added that I rests on item 5 of L p.397.
- Repetition cap (2 per idea per concept) in AKS-12.1: 'Estimates Committee is Lok Sabha only' is tested in 102, 106, 115, 118 (four times); and the PAC/Estimates chairman idea (appointed by the Speaker, PAC from the Opposition since 1967, Estimates from the ruling party) is tested in 103, 107 (stmts 1,3,4), 117 (stmts 1,2,4), 119 and again in 411 stmt 3 (concept 12.4) - 117 stmt 4 and 411 stmt 3 are word-for-word the same false statement. Replace 117 or 107 and 119.
- Repetition in AKS-12.3: Ethics Committee dates (RS 4 Mar 1997 Narayanan; LS ad hoc 2000 Balayogi; permanent 2015) appear in 303, 309 (stmts 1-3), 315 (all four), 319, 320 = five items. Ministry of Parliamentary Affairs appears in 301, 306, 318, 320. Keep two of each.
- AKS-12.3 has no all-correct which-item (brief wants at least one per concept). Across the pack 27 of 48 which/howmany items are "exactly three true of four" (one false), so the most common key shape ("1, 2 and 4 only"-type) is guessable. Add 2-3 items with 2 or 0 correct in each concept.
- Direct-item key tells: 101 (key is the only "joint" option, the other three share "separate committees", and it is the longest), 105 (key longest), 302 (distractors absurd), 301/304/305 keys longest. AKS-12.3 key is longest in 3/5 direct items (301, 304, 305, over the ~1/3 guide); AKS-12.1 in 2/5 (101, 105); AKS-12.4 in 2/5 (401, 405); AKS-12.2 in 1/5 (204).
- CS-POL-aks12-308 / 213 / 215 contain Laxmikanth facts (Food Management, Portraits committees; House Committee) cited to L pages p.395-396 / 407; verified true. Number of "laxmikanth_to_add" items per concept stays within 6 (409, 410, 414, 417 in 12.4 = 4). OK.

LOW
- CS-POL-aks12-311 and 317: two or three of the statements are absurd on their face (reports to the President; leave of the Supreme Court; "Minister or Leader of Opposition only"), so these are elimination give-aways.
- CS-POL-aks12-416: stmts 3 and 4 (Presidential order 1950; first Lok Sabha 1952) are throwaways; 401 already tests the same fact (A12-128 twice is within the cap).
- CS-POL-aks12-303: premise already states 1997, so distractors "in 2000/2005/1992" contradict the stem and are weak.
- CS-POL-aks12-211 stmt 3 says "examines all papers" while L p.406 also excludes statutory notifications; stmt 4 clarifies it, so no second answer, but "all papers laid by Ministers" is slightly loose.
- CS-POL-aks12-208 stmt 3 (COPU "recommends ways to improve ... profitability and efficiency of selected undertakings") is the notes' own phrase, not in L p.399; harmless but not Laxmikanth-backed.
- CS-POL-aks12-405 / 412: the Article-to-emergency matching is repeated (405, 412) and sits in a Parliamentary Committees pack; fine for coverage. 412 has only three statements.
- dup-check aks12: nothing >= 0.7. 32 lines >= 0.6, mostly with lk24 (e.g. 111 stmt 2 vs lk24-510 "Papers Laid ... 15 members" at 0.67; 214 stmt 2 vs lk24-509 0.67; 212 stmt 2 vs lk24-507 0.67; 213 stmt 3 vs lk24-605). These are the same facts in a different frame, not near-copies of an item. 412 vs aks03-026 at 0.67 (Emergency Articles) is the same pattern.

Answers recomputed cold: all 80 keys agree with Laxmikanth/real law except where flagged above (304 ambiguity). No wrong keys found.


## PART 2 - aks13

Format mix per concept (all three): 5 direct, 9 which, 3 howmany, 2 stmt12, 1 match = brief mix. 20/20/20 questions. Pages (`pg`) match inventory pages (013-019 lists 116 for A13-130, 043 lists 114 although every fact is on p.115: LOW).
Real-law and Laxmikanth checks done against ch17 pdf 259-274: every key and every "false" statement is false in Laxmikanth AND real law, with the following exceptions (A13-045 note under LOW).

### Skipped facts (2 of 133)
- A13-067 (unnamed judgment, probably ADM Jabalpur, 4.0% of AKS-13.2): legitimate verify-conflict; the 44th Amendment effect is tested via A13-068/069 and the Shah Commission/38th/44th facts. Acceptable.
- A13-094 (EC "ideally within six months"): legitimate verify-conflict (not law). Acceptable.
Concept skip rates: 13.1 0%, 13.2 4%, 13.3 0%.

### Verify facts, corrected-form check
- A13-032 (42nd Amendment wording): 012 stmt 3 states it false as "confined to the State where the Emergency operates"; L p.262 says it extended to any other State too. Correct.
- A13-037 (financial modifications): 011 stmt 4 and 014 stmt 4 use the till-end-of-financial-year form (L p.262; Art 354). Correct.
- A13-114 (President's Rule revoked on Governor's recommendation): 045 key = President on his own, by subsequent proclamation; 046 stmt 3 and 004 stmt 2 agree. Correct (L p.266, Table 17.1 row 8).
- A13-126 (mnemonic wrongly includes rebellion): 054 stmt 2 false, correct; 021 and 016 also correct (L p.263).
- A13-021: 008 stmt 2 ("fewer than fifty") false and 052 stmt 4 ("more than 125, according to Laxmikanth") true; matches L p.268.
- A13-094, A13-067: skipped.

### Findings (aks13)

HIGH
- none. All 60 keys agree with Laxmikanth ch17 and real law on a cold re-derivation; every distractor and false statement is false on both. No two defensible options found.

MEDIUM
- CS-POL-aks13-007 (stmt12). Statement II (Art 359 suspends the right to move courts for the specified rights) is the same fact as Statement I (the rights themselves are not suspended) seen from the other side. The brief says never let II restate I; the E line justifies "II explains I" only by circular logic. A student can defend either "explains" or "does not". Replace II with a causal fact (e.g. enforcement remedies for Articles 20 and 21 remain open after the 44th Amendment) or swap to a non-explaining pair.
- CS-POL-aks13-027 (stmt12). Statement I ("restored judicial review of the proclamation of National Emergency, placing it beyond executive reach") is garbled: it is not the proclamation but judicial review/personal liberty that the notes (A13-069) put beyond executive reach; read literally the proclamation (an executive act) cannot be "beyond executive reach". And whether the 38th Amendment bar "explains" the 44th repeal is arguable (II is background, not cause). Reword I to "The 44th Amendment deleted the bar on judicial review of the proclamation" and keep II as the (historical) cause only if the author accepts that as explanation, otherwise pick the not-explains option.
- CS-POL-aks13-025, 029, 033 (direct, AKS-13.2): key is the longest option in 3 of 5 direct items (025, 029, 033; 021, 039 are not). 025 options 1-2 are anachronistic ("armed rebellion" in 1962), 029 key alone carries the explanatory tail "a ground later replaced by armed rebellion", 033 key is the only well-formed ground. Shorten the keys or lengthen the distractors to similar clauses.
- CS-POL-aks13-045, 049, 019 (direct): keys also longest in 045 and 049 (AKS-13.3 2/5) and 019 (AKS-13.1); within tolerance but add to the pattern. 053 is trivially solved by elimination (the three wrong options all contain "National Emergency", W lines identical).
- Repetition (cap 2 per idea per concept): AKS-13.2: Article 358 not applicable on armed rebellion (A13-056/059) in 021, 026 (stmts 2 and 3) and 040 (stmt 2). AKS-13.1: Lok Sabha extension rule in 011 stmt 3, 013, 014 stmt 1 (three); A13-012/A13-007 approval-majority facts reused in 001, 002, 017, 019. AKS-13.3: A13-115 (Art 360 ground) in 048, 050, 057; A13-128 (FE never proclaimed) in 052, 054, 058 (the A13-022 idea). Trim one each.
- CS-POL-aks13-014. Stmt 3 is lifted almost verbatim from lk17-048 (dup 0.69) and stmt 4 repeats 011 stmt 4. Re-angle or replace one of 011/014.
- AKS-13.1: "exactly three true of four" is the commonest pattern (5 of 12 which/howmany in 13.1, 4 of 12 in 13.2, 5 of 12 in 13.3). All-correct (014, 024, 048) and single-correct (012, 028 or 034, 058, 060 etc.) items exist in every concept, so the variety rule is met; the statement position of the false statement also varies. No action beyond awareness.
- CS-POL-aks13-023 / 013 / 020 rely on L's unqualified claim "no remedy lies for anything done during the Emergency even after it expires" (A13-045; 020 stmt 2 false form). It is Laxmikanth and the notes, but in real law the shield is limited to Emergency-related laws and actions (which 020 stmt 3 also says), so a careful candidate may find stmt 2 "partly arguable". Tolerable because stmt 2 is flagged false only for the sweeping "a remedy is available"; consider "according to Laxmikanth".

LOW
- CS-POL-aks13-001 fi includes A13-004 (financial-stability ground) which the stem does not test; 005 distractors "Breakdown of law and order" is weak; 039 distractors W lines "That is Article 358/355/354" are bare.
- CS-POL-aks13-034 stmt 2 swaps the definitions of dissolution/suspended animation: fair but pure recall.
- CS-POL-aks13-047 (stmt12) pairs two unrelated true statements (II is not about President's Rule); an easy "does not explain". 035 likewise.
- CS-POL-aks13-031 and 051 are the only items outside the inventory (Laxmikanth additions, fi empty: Bommai, Janata 1977, 44th one-tenth notice, 14 days) - within the 6 per concept cap and all verified in L p.261, 268, 269.
- CS-POL-aks13-038 stmt 1 compresses Art 357 delegation ("to the President, who may specify another authority"); L says "to the President or any other authority specified by him". Not wrong, slightly loose.
- dup-check aks13: nothing >= 0.7 except boilerplate (the "Match the entries in List-I..." header lines 1.00 with aks11b-007, and match-option strings "War, external aggression or armed rebellion", "Threat to financial stability or credit of India" 1.00 with lk04-508). 25 more lines 0.60-0.69, mostly facts shared with lk17 (e.g. 048 stmt 2 vs lk17-026, 032 stmt 4 vs lk17-009, 022/024 vs lk17-067/070, 056 vs aks09-011 which states the OPPOSITE of Bommai, i.e. that item is the false form). These are same-fact, different-frame matches, not copies.
- 016 and 018 title lines fine; 017, 037, 057 match items are one-to-one and unique.

Answers recomputed cold: all 60 keys agree. Statement-I/II verdicts: 007 MEDIUM, 015 ok, 027 MEDIUM, 035 ok, 047 ok, 055 ok.

## Counts

| Pack | HIGH | MEDIUM | LOW |
|---|---|---|---|
| aks12 | 1 (304) | 9 items/issues: 312+316, 313, 314, 118, 418, 219, repetition (102/106/115/118; 103/107/117/119/411; 303/309/315/319/320), no all-correct item in AKS-12.3, direct-key tells (101, 102/105, 301, 304, 305) | 311, 317, 416, 303, 211, 208, 405/412, dup-check lines |
| aks13 | 0 | 6 groups: 007, 027, key tells (025, 029, 033, 045, 049, 019, 053), repetition (021/026/040; 011/013/014; 048/050/057; 052/054/058), 014 dup, 023/013/020 remedy wording | 001, 005, 039, 034, 047, 035, 031/051, 038, boilerplate dup lines, pg looseness 019/043/317 |

Verdict: aks12 FAIL until 304 is fixed (one HIGH); aks13 PASS (zero HIGH), with the MEDIUMs worth fixing before load.
