# Review: packs/ncert_polity5.json (Mode C, "Elections", CVP-5.1 to 5.6, 120 items)

Reviewer: independent cold re-answer of all 120 items (one concept at a time, key unread), every cited page
read in ch12, 18, 23, 33, 43, 79, 80, 81, 82, 83, 84, 85, 86. `check-civil-pack.py`: 0 problems.

**Counts: HIGH 1, MEDIUM 9, LOW 9. Verdict: fail (one HIGH; fix CS-POL-ncp5-3-16 and the pack passes on re-check).**

Cold re-answer result: 120 of 120 agree with the stored key text. The one HIGH is a support problem (the
falsifier is false only through a fact the cited page does not state), not a wrong key.

## HIGH

### CS-POL-ncp5-3-16 (CVP-5.3, howmany, 4 statements, key "Only three")
Statement 3: "No readjustment of the territorial constituencies of the Lok Sabha has been made since the 1971
census." Key counts it false.
- It is false in the real world (boundaries were redrawn by the Delimitation Commission 2002-08 on the 2001
  census; only the state-wise seat numbers stayed frozen).
- The cited page does not say so. Ch.23 p.329 says the 42nd Amendment froze "the allocation of seats ... and the
  division of each state into territorial constituencies" at the 1971 level and the 84th "extended this ban on
  readjustment ... upto year 2026". The next paragraph says only that the 84th/87th "empowered/provided for"
  delimitation on 1991/2001 figures. Ch.82 p.823 says the 2002 Act "was enacted to set up a Commission for the
  purpose of effecting delimitation". Nowhere does the book say it was carried out. A book-only reader can
  defend the statement as true and answer "All four" (a listed option).
- The explanation then asserts "effected through the Delimitation Act, 2002", which is not on the page.
- Fix: replace statement 3 with a falsifier the page states outright (for example "The 87th Amendment (2003)
  increased the number of Lok Sabha seats allotted to each state", false by p.329 "without altering the number
  of seats"), or drop the item's reliance on "since 1971". Keep key "Only three" only if the new statement is clearly false.

## MEDIUM

M1. Guessable pattern: every four-statement how-many item has the key "Only three" (1-17, 2-15, 3-16, 4-15, 5-15,
6-16; 6 of 6). The author brief says not to keep "exactly three" as the key in four-statement items; a student who
spots the pattern scores without the facts. Change at least three of them (use "Only two", "Only one", "All four").

M2. Repetition above the limit of 2 per idea in a concept:
- 5.1: reasons for indirect election of the President in 1-03, 1-15, 1-18 (three items); 1-02 and 1-08 repeat the same "councils excluded / Puducherry in" fact.
- 5.2: why PR was not adopted in 2-02, 2-12, 2-18; the council cap of one-third in 2-05, 2-10 (s2), 2-14 (s3); where STV is used in 2-07, 2-10 (s4), 2-11, 2-17.
- 5.3: RPA 1950 versus 1951 split in 3-06, 3-07, 3-15, 3-17 (s1) (3-06 and 3-07 are mirror images); election petitions / Art 323B tribunal in 3-04, 3-05, 3-10 (s3), 3-14; SC/ST "separate electorate" falsifier in both 3-12 (s2) and 3-19.
- 5.4: CEC versus other commissioners (removal, security of tenure, flaws) in 4-03, 4-08, 4-09, 4-17, 4-18 (five items); only one item (4-11) covers the Commission's functions, which is the better-tested area (tagged UPSC-2004-124, 2017-324).
- 5.6: Lily Thomas plus the withdrawn Bill is tested in both 6-09 and 6-19 (same two facts); funding in 6-04, 6-05, 6-12.

M3. Near-duplicates of other packs (same fact, same key, same falsifier). The bank will hold both; reword or replace one side.
- lk18: 1-02 = CS-POL-ch18-101 (same stem, same key); 1-08 ~ ch18-106; 1-18 ~ ch18-118.
- lk23: 2-06 ~ ch23-210; 2-12 ~ ch23-211; 3-13 ~ ch23-206 and 216; 3-12 ~ ch23-208, 217; 3-19 = ch23-218 (same falsifier, same key); 5-06 ~ ch23-410, 417; 1-06 ~ ch23-107.
- lk11: 1-12 ~ ch11-507, 518 (Indira Nehru Gandhi).
- lk21: 5-09 ~ ch21-717, 730 (91st Amendment ceiling).
- lk83: 6-05 = ch83-601 (identical); 6-04 = ch83-602; 6-06 ~ ch83-409 (same four deposit statements, different mix); 6-07 ~ ch83-206; 6-09 ~ 511; 6-11 ~ 612; 6-12 ~ 608/609; 6-13 ~ 106/110; 6-14 ~ 213; 6-17 ~ 512; 6-18 ~ 510/519. Eleven of the twenty CVP-5.6 items repeat lk83. Cross-pack keys are consistent where both exist (checked 6-06 vs ch83-409).

M4. Currency notes missing from explanations (keys stay right):
- 4-02 and 4-10: Anoop Baranwal committee (PM, LoP, CJI). Confirmed no item states it as current law: 4-02 says "the Court directed", 4-10 says "the Court declared" and its false statement 3 denies permanence. But neither explanation says the Chief Election Commissioner and other Election Commissioners (Appointment, Conditions of Service and Term of Office) Act, 2023 now governs and put a Union Cabinet Minister in place of the CJI. Add one sentence so a student does not carry "PM, LoP, CJI" as the law. (Distractor 2 in 4-02 names the Home Minister; fine because the stem is tied to the 2023 judgment.)
- 4-04: the stem names "the Election Commission (Conditions of Service ...) Act, 1991", which the 2023 Act repealed. The rule (six years or age 65, whichever earlier) is carried into the 2023 Act, so the key survives, but the explanation should say so, and the stem is safer as "the statute described by Laxmikanth". Distractor 2 ("five years or 62") is the pre-1993 rule seen in tagged UPSC-2002-087.
- 6-12 (statement 1, 2017 removal of the 7.5 per cent cap): the February 2024 judgment (Association for Democratic Reforms v Union of India) also struck down the 2017 Companies Act change that removed the cap; the explanation mentions only the bonds. The statement is historically true so the key stands; add the note. 6-04 and the rest of 6-12 correctly say "could be used"/"was" and the 2024 striking-down is stated; no item presents bonds as operative.
- 3-09 and the CVP-5.3 `rule` text: "extended up to 2026" is the book's wording. Article 82's proviso runs to the first census after 2026, and the next census is now due, so a student reading "up to 2026" may think the freeze has lapsed. Hedge once ("the book says 2026; Art 82 refers to the first census after 2026"). No question asserts the end date; stem and statements are safe.

M5. Weak distractors a student can discard by reading: 2-02 options 3 and 4 (incoherent reasons about "direct election" and "separate electorate for every community"); 4-02 options 3 and 4 (President/Vice-President collegium; Speaker chairing); 5-05 options 2 and 3; 3-02 options 3 and 4; 2-01 option 3.

M6. 1-15 statement 3 ("accepted ... unanimously, without any objection") and 2-10 statement 1 ("unanimously supported a second chamber") are false only because the page says "some members ... criticised". Supported by p.278 and p.480 respectively, so not HIGH, but they are "unanimously" tricks; both are tagged as such. Keep at most one.

M7. Format mix versus the 2020-26 column: direct 25% (trend 26), consider-which incl. match 50% (48), how-many 15% (12), Statement-I/II 10% (6), case study 0% (3). Close. Every concept is the identical 5/9/3/2/1 split; vary it slightly across the six concepts (the check script allows it), and consider one short case-study item in 5.4 or 5.5 since the trend shows 3%.

M8. 6-06 and 6-08 test exact rupee and day figures that the book itself gives (deposit figures; 48 hours; 20 to 14 days). Correct against the book, but with 6-05, 6-14 and 6-20 they make CVP-5.6 heavily number recall (7 recall-tagged items, the highest of the six). Acceptable; flagged as a coverage note.

M9. 2-20 (match): "Proportional representation" (B) versus "Single transferable vote" (C): STV is also proportional, so a careful student could weigh descriptions 3 and 2 either way. The intended split is clear from the wording of List-II 2 ("the kind ... adopted"), but the swap option (B-2, C-3) is not absurd. Reword List-II 3 to say "the general principle that" ... or drop the C row.

## LOW

L1. 2-06 statement 2 ("must secure more than half of the valid votes") is false by p.817, but p.330 itself says "a candidate who secures majority of votes is declared elected" before calling it a "simple majority" system. The word "more than half" keeps it fair; the explanation could quote p.330 "simple majority".
L2. 5-08 statement 2 and 5-03 option 3 (time limit for the presiding officer): the book says there is none in the Act, which is still true of the Schedule. Add a clause that the Supreme Court (Keisham Meghachandra, 2020) directed that cases ordinarily be decided within three months; it is not a Tenth Schedule rule.
L3. 5-11 tests the exact party-recognition percentages; the pack's inherited `scope_out` lists them as "not required in detail". Likewise `scope_out` says campaign finance is "not covered" while 6-04, 6-05 and 6-12 test it. The header is deliberately unchanged in Mode C, so this is only a metadata mismatch; update scope_out when the owner next touches the chapter row.
L4. CVP-5.4 `example`: "In 2024 voting from home was extended across India ..." is not in any cited chapter (the verify note lists it as unsupported). Remove or mark outside the book.
L5. 1-08 statement 2 and 1-02/1-20: Delhi and Puducherry are correct per p.276. The Jammu and Kashmir legislature (a Union territory with an assembly since 2019) is not mentioned by the book; no item says "only Delhi and Puducherry", so no harm.
L6. 6-18: "Statement-II does not explain Statement-I" is right (the ruling pointed the other way, Parliament then negated it), but the pair reads as cause and effect to some students. Fine; consider a tr tag "reaction".
L7. 5-14/5-16 and 5-12 overlap on "regional parties challenge Congress dominance" (three touches). Within limit only if one is trimmed.
L8. PYQ same-fact overlaps (no verbatim copies, Jaccard under 0.5 everywhere): 5-02 and 5-08 reuse both facts of UPSC-2022-430; 4-04 option 2 echoes UPSC-2002-087; 6-06 vs UPSC-2002-095 (deposit); 3-01 vs UPSC-2019-355; 2-06 statement 2 vs UPSC-2017-322. The same idea at a new angle is allowed.
L9. 1-17 statement 3 begins "In the passage quoted from Paul Brass", an awkward hedge for an otherwise plain true statement.

## Author's least-sure facts (tested)

1. Anoop Baranwal committee: confirmed no item states the composition as current law (see M4). Book p.600-601 supports the 2023 direction text; the 2023 Act is outside the book. Pass, with the explanation note.
2. Electoral bonds: confirmed. 6-04 and 6-12 use past tense and "as printed on p.832"; the explanations record the 2024 striking-down. The cap-removal sibling is the only gap (M4).
3. "Freeze up to 2026": not asserted by any stem or statement; 3-09's false statement is "84th lifted the freeze", false by p.329 "extended". Wording hedge missing in explanation and `rule` (M4). 3-16 is the item that actually leans on the delimitation timeline and is the HIGH.
4. Chandra Shekhar government supported from outside by Congress (I): confirmed in Table 85.1 (ch85 p.840) and in real history (Nov 1990 to Jun 1991; Congress (I) support). 5-13 statement 2 ("by the BJP") is a fair falsifier. The BJP and Left supported the V.P. Singh government from outside (row 3), which is a plausible confusion, not a second answer.
5. "Six years or 65, whichever earlier" attributed to the 1991 Act: wording is hedged ("as described by Laxmikanth") but the Act is repealed (M4). The rule itself continues in section 6 of the 2023 Act.

## Audit of the old file (verify-ncert_polity5.md), checked against the chapters

| Old item | Audit says | Verdict |
|---|---|---|
| 5.4 #4 "Articles that provide for the ECI are 324 to 329" | misleading | Confirmed. Ch.43 p.599 and Ch.81 p.813: Article 324 alone creates and empowers the Commission; Articles 324-329 are the electoral provisions of Part XV. Key is the least-bad of four options but misleading. Keep retired. |
| 5.6 #1 "voting is a right and a duty" | misleading | Confirmed. Ch.81 p.813 gives only the entitlement to vote; no page makes voting a duty, and it is not a legal duty. Unsupported as a key. |
| 5.5 #10 "1967 saw the end of single-party dominated elections" | wrong | Confirmed. Ch.79 p.804: dominance "has been declining since 1967"; Ch.85 p.840: the Congress won a majority at the Centre in 1967 and 1971. "End" is wrong. |
| 5.1 #6 and #7 psephos = pebble | conflicts with book | The old key is right in the real world (psephos means pebble); Ch.84 p.835 says "the piece of pottery". So the book is imprecise, not the old key. Correct to avoid the etymology; new 1-05 tests only "scientific study of voting behaviour". |
| 5.3 #10 commissions "1952, 1963, 1973 and 2002" | conflicts with book | Book gives the Act years 1952, 1962, 1972, 2002 (Ch.23 p.329, Ch.82 p.824 fn1; Ch.43 fn4). The old years are the real commission years, so the old key is right in reality but mixes Act and Commission; new 3-16 statement 2 uses the Act years, which are correct in both book and law. |

## Specific checks requested

- Permuted match items (1-20, 2-20, 3-20, 4-20, 5-20, 6-20): re-derived each mapping from the permuted List-II numbers; all six keys correct; w[] aligned to the shuffled order. Only 2-20 has the soft B/C point (M9).
- 4-13 and 4-14 (hand-edited): option sets are distinct from every other which-item in CVP-5.4; keys "1 and 3 only" correct in both; w[] entries match options 2-4 in order; the check script reports 0 problems. 4-13 statement 2 (Police Observers from the IAS) is a fair falsifier (p.815: IPS).
- Representation of the People Acts: 1950 (seats, delimitation, rolls, election officers) versus 1951 (conduct, qualifications, corrupt practices, petitions, party registration, free supply, civil-court bar) all match p.821-823. Fine.
- ECI composition, removal, MCC (announcement, not notification; campaign ends 48 hours before close), EVM (2003 all state elections; 2004 Lok Sabha), VVPAT 7 seconds, NOTA no veto, Tenth Schedule (15 days, six months, two-thirds merger, 91st: split exemption omitted, 15 per cent), Kihoto Hollohan (finality struck, bias argument rejected): all supported on the cited pages, no second defensible answer found.
- Pages: every `pg` entry states the fact it is cited for (spot-read all 120; the long-range lists such as 1-12 and 5-18 are broad but accurate). CVP-5.5 items 5-14 and 5-16 cite pp.810-811, which are in ch80 (not in the list you gave); content is correct.
- Statement-I/II relations: "explains" only where the page states the link (1-18, 2-18, 3-18, 5-18). Others correct.
- Longest-key tell: key is longest in 7 of 30 direct items (never more than 2 of 5 in a concept). Pass.
- Explanation numbers and page references: no mismatches found.
