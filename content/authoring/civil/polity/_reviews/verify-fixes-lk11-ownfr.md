# Verification of fixes: lk11.json and ncert_own_fr.json

Method: all 120 items (100 + 20) were answered cold from ch11.txt / ch12.txt / ch17.txt, with the keys read only afterwards. Then mechanical checks.
Result of cold answers: 119 of 120 agree with the stored key. For CS-POL-ch11-418 my answer differs (see HIGH).
`check-civil-pack.py`: 0 problems on both packs. Own script: key in options and equals o[0] for all 120; no duplicate options or ids; every
"Statement n is correct" list in the explanations reproduces the key (all multi_statement and howmany items, both packs); 3 w-notes per item.
Match items 120/220/320/420/520 (lk11) and OFR-020 were re-derived pair by pair from Table 12.1 and the text; keys and the e-text agree after permute-match.

## PART 1: lk11.json  (100 items, all cold-answered)
Verdict: **needs-fix** (1 HIGH). HIGH 1, MEDIUM 2, LOW 4.

### HIGH
- **CS-POL-ch11-418** (Statement-I/II, key "II explains I"). S-I: "provisions relating to the amendment procedure are too sketchy". S-II: "leave a wide scope for taking
  matters to the judiciary". Chapter criticism 7 says "too sketchy. Hence, they leave a wide scope", so S-I is the cause and S-II the consequence.
  S-II cannot explain why S-I is true; the explanation is the wrong way round. A careful candidate picks "both correct but II does not explain I", which is a second
  defensible answer. The author's "Hence" link made it worse, because the w-note and e now state the causal direction that contradicts the key. Fix: swap the two
  statements (S-I = wide scope for the judiciary, S-II = provisions too sketchy) and keep the key, or keep the text and re-key to "does not explain". 518 is fine (S-II is the ground for S-I),
  as are 118 and 318.

### MEDIUM
- **CS-POL-ch11-402**: key is 75 characters; distractors are 49, 59 and 61. Longest-key tell, unchanged as the author said. Shorten the key (for example
  "Simple and easy, and successful in meeting the changed needs") or lengthen the others.
- **CS-POL-ch11-312** statement 2 (GST Council needs special majority plus half the states) rests only on the chapter's federal list item 5; it is true per the chapter and
  I believe in law, but the stem does not say "according to the chapter" (statement 1, "103rd Amendment of 2019", is false in real law as well, so the item is safe).
  Treat as optional: add "according to the chapter".

### LOW
- 512 and 516 use "statements given above" for lists of elements (516 even says "according to the chapter's list"); cosmetic.
- 110 statement 2 ("any provision ... in accordance with the procedure") is chapter-literal; strictly the basic structure limits it. Acceptable because statement 3 is the
  clear falsifier and the stem is about Article 368's text.
- 305 key (94 characters) is the longest by one character only; no tell.
- 415 statement 1 ("seven grounds") is a counting fact; it checks out (7 listed).

### What was checked and holds
- All rewritten items (113, 114, 116, 117, 204, 210, 212, 213, 217, 218, 219, 309, 316, 317, 319, 406, 411, 412, 415, 416, 417, 506, 513, 515, 516, 517): every falsifier is false both in the chapter and
  in real law, not by wording. Highlights: 213 (US Congress "only" proposes; footnote 4 gives the convention route, and Article V agrees); 217 st4 and 511 st2 (Waman Rao applies to
  amendments after 24 Apr 1973); 216 st2 (Kesavananda upheld the 24th Amendment); 317 (all four statements really false: elections, privileges, councils and puisne judges
  are all simple-majority matters, items 14, 8, 3, 10); 114 (FR amendment needs no ratification; the state legislatures have no part).
- 303 is no longer the longest key. 304 ("does NOT require consent of half of the state legislatures") unique answer: quorum; the other three are on the federal list (Art 368(2) proviso agrees for
  executive power, Supreme Court and High Courts, and Article 368 itself).
- 404 (Canada): Ambedkar's quote in the chapter names Canada for "denying the people the right to amend"; true in real law (pre-1982 no domestic amending formula). Unique.
- 502 (Ram Jethmalani 2011 = powers of the Supreme Court under Article 32): table row p.203; the other options are other rows. 505 (right to property not on the list of twenty) correct;
  the three distractors are items 17, 14, 12.
- 106/110/309 re-angles are fine. 101 distractors are plausible and unique.
- Table 12.1 facts used (Indra Sawhney rule of law; Raghunath Rao equality and unity; Bommai six elements; L. Chandra Kumar 226/227; Kuldip Nayar; Namit Sharma; Central Coal Fields; Kihoto Hollohan
  "Defection Case"; I.R. Coelho "IX Schedule Case"; Indira Nehru Gandhi "Election Case"): all match pp.200-203.
- No contradiction with the real Article 368 (assent obligatory by 24th Amendment; special majority; ratification by half of the states; no joint sitting; 42nd Amendment clauses (4) and (5) were struck down in Minerva Mills).
- Facts that changed after exam year: none found in this chapter.
- Page citations spot-checked for every rewritten item; all match the page markers (ch11 pp.193-197, ch12 pp.198-203, Table 12.1 p.200-203, GST footnote p.197).
- Format mix: direct 25 / which 45 / howmany 15 / stmt12 10 / match 5, unchanged and acceptable against the 2020-26 column (same as before).

## PART 2: ncert_own_fr.json  (concept POL-1.6, 20 items, all cold-answered)
Verdict: **pass** (0 HIGH). HIGH 0, MEDIUM 3, LOW 3.

All 20 answers agree with the keys; each was confirmed against ch17.txt (pp.259-273) or ch12.txt (Table 12.1, pp.201-203).
Hard items worked through: OFR-010 (42nd Amendment extended, not confined, the consequences to any other state: p.262, so st1 false); OFR-014 (st2 false: special majority since the 44th
Amendment, p.261); OFR-013 (st1 true as a long chapter paraphrase: Art 19 revives, "no remedy lies", p.263; st2 false because only laws related to the Emergency are protected; st4 false because the
order is laid before each House); OFR-012 (proper: hung assembly; improper: floor test not allowed; maladministration and the 1977/1980 Lok Sabha defeats are improper); OFR-008 (st3 false: the 44th deleted
the 38th's finality, p.269); OFR-017 (June 1975 was "internal disturbance", Dec 1971 external aggression, and the second and third proclamations were both revoked in March 1977, so only st3 is true);
OFR-016 (Table 17.1: items 2, 3 true; 4 and 7 false); OFR-018 (the "Hence" in the chapter makes II the reason for I, so "explains" is right); OFR-019 (II does not explain I; both true).

### Facts the caller asked about
- "None declared so far" (Financial Emergency): true in real law and per the chapter (p.272). Used only as the falsifier of OFR-007 st3 (the 1991 crisis); safe.
- "More than 125 occasions" (OFR-018): from the chapter (p.268); true in real law too (130+ by 2024), so it cannot be a falsifier; it is the true S-II. Safe.
- Table 12.1 rows (Kumar Padma Prasad, Indra Sawhney, Sambamurthy, All India Judge's, Bhim Singhji, Central Coal Fields, Ram Jethmalani, Indra Sawhney II): all match pp.201-203.
- Page cites checked against the page markers; all fall on the right pages (for example Bommai proposition 6 on p.269, "No Financial Emergency" on p.272, the Constituent Assembly quotes on pp.259, 273).

### MEDIUM
- **CS-POL-ch08-OFR-002**: key is 108 characters; distractors are 89, 83 and 57. Longest-key tell, and option 2/3 are weak ("states alone, since the Union's own finances are left untouched").
  Shorten the key (for example "all or any class of persons serving the Union, including judges of the Supreme Court and the high courts" is still long; try "all Union servants and the judges of the SC and HCs") or lengthen the distractors.
- **Statement-level duplication with lk11**: OFR-020 item C (Ram Jethmalani to Article 32) repeats lk11 CS-POL-ch11-502 exactly; OFR-015 st2 (Indra Sawhney 1992, rule of law) repeats lk11 513 st1;
  OFR-020 B/A (Bhim Singhji, Central Coal Fields) overlaps lk11 509 st3. Different formats, but the same fact is tested in both packs. Change one side (for example use Kihoto Hollohan or I.R. Coelho rows in OFR-020).
  No overlap with lk15 (only Sarkaria 804) or lk18 412/413/417/808 beyond general topic (lk18 covers who proclaims; OFR covers effects and duration). The upcoming lk17 pack must avoid OFR-006, 007, 009, 010, 016 facts.
- **CS-POL-ch08-OFR-007 st1** ("can be passed by either House ... by a simple majority") copies the chapter's wording; in real law both Houses must approve. Not wrong (each House passes it by simple majority) but a candidate may
  read "either" as "one House suffices". Safer: "must be passed by each House ...".

### LOW
- IDs read "CS-POL-ch08-OFR-..." although the content is ch17 and ch12; cosmetic.
- OFR-003 key (90) is longest by 8 characters; mild.
- OFR-013 st1 is a long compound statement ("according to the chapter" is present, which is what makes it safe).

Format mix (20): direct 5 / which 9 / howmany 3 / stmt12 2 / match 1 = 25/45/15/10/5 percent, same as the bank house mix and consistent with the 2020-26 column.

## Totals
- lk11: HIGH 1 (CS-POL-ch11-418), MEDIUM 2, LOW 4. Verdict **needs-fix**.
- ncert_own_fr: HIGH 0, MEDIUM 3, LOW 3. Verdict **pass**.
- Items cold-answered: 120 (100 + 20).
