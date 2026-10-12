# Final verification: lk17 (Emergency Provisions) and lk38 (Lok Adalats and Other Courts)

Reviewer pass after the author's late edits. Every item in both packs (160 + 120 = 280) was re-answered against
the chapter text (ch17.txt, ch38.txt) and real law, statement by statement, not against the author's explanations.
Caveat on "cold": the answer keys were visible in the dump I read, so for each item I derived the truth of every
statement from the chapter page first and then compared with the key; I did not hide the keys.

Mechanical checks (scripts in scratchpad, prefix vfin1_): `scripts/civil-services/check-civil-pack.py` gives 0 problems on both packs.
Own checks on both: all ids unique (160 / 120); key present in options and equal to o[0]; no duplicate options in any item;
every multi-statement key (combination or count) reproduces the explanation's "Statement n is correct/incorrect" list and the
statement count; every quoted option in a wrong-option note exists among the options; every item has 3 wrong-option notes;
every assertion-reason key agrees with its explanation; all 14 match keys checked by hand against the lists. All clean.
Match items: lk17 020/080, 040/100, 060/120 reuse an identical set of four option strings (different content, same
permutation geometry), harmless, LOW.

Format mix (both packs, same shape): direct 25%, "which statements" 45%, "how many" 15%, Statement-I/II 10%, match 5%.
Trends 2020-26: direct 26%, which 48%, how many 12%, Statement-I/II 6%. Close; Statement-I/II is slightly heavy, acceptable.

## PART 1: lk17

Count: HIGH 1, MEDIUM 2, LOW 5. Verdict: FAIL until -076 is fixed (one-line edit).

### HIGH
- **CS-POL-ch17-076** (howmany, Art 358/359). Statement 3 reads "While a National Emergency is in operation the State is freed
  from the restrictions imposed by Article 19" and the key counts it as the one correct statement ("Only one statement").
  After the 44th Amendment this is true only for an Emergency declared on war or external aggression; the chapter says so
  (p.263 paragraph on the 44th Amendment; p.264 distinction 3) and the same item's statement 2 tests exactly that
  External/Internal split. A candidate who applies the 44th Amendment rule to statement 3 gets zero correct statements and
  picks "None of the statements", which is also an option. Two defensible answers. Fix: "While a National Emergency declared on
  the ground of war or external aggression is in operation, the State is freed from ..." (keeps key).

### MEDIUM
- **-079** (Statement-I/II). Statement-I "During a National Emergency Article 358 takes effect without any order of the
  President" is unqualified; in an Internal Emergency (armed rebellion) Article 358 does not take effect at all (p.264). A
  well-read candidate can call Statement-I incorrect. Add "declared on war or external aggression".
- **-018** (Statement-I/II, "explains"). Key says Statement-II (1975 fait accompli) explains Statement-I (PM alone can no
  longer cause a proclamation). p.260 supports the history but the chapter itself says the safeguard was introduced "to
  eliminate any possibility" rather than "because of 1975". Defensible as keyed; the alternative "does not explain" is weak. Leave
  or rephrase Statement-II to "The 44th Amendment introduced the written-recommendation safeguard after the 1975 episode".

### LOW
- -066 statement 1 and -075 use the same unqualified "Article 19 automatically suspended" wording; their keys survive any reading, so no key risk.
- -108, -117 ">125 occasions" is out of date in real life (President's Rule has since been imposed more often) but both stems say "according to the chapter".
- -085 is a near restatement of tagged PYQ UPSC-POL-2017-326 ("not necessarily consequences of President's Rule"); fine as PYQ-style practice, note for the duplicate registry.
- -083 key is the longest option by a margin (about 170 characters against about 130 to 140); the 13 lengthened distractors reduced this, small residual cue.
- Wrong-option notes are repetitive but all name existing options and cite pages that state the fact.

### Hard checks (all pass)
- Art 352 as amended by the 44th: armed rebellion replaces internal disturbance (-011, -012, -019, -063); Cabinet written recommendation (-003, -015, -018, -104); approval within one month (-021, -026, -035, -039, -040); special majority for approval, simple majority for disapproval in Lok Sabha only (-022, -023, -028, -033, -038); special sitting within 14 days (-024, -032); six-monthly continuance (-025, -034, -036). All correct, falsifiers false in real law and per chapter.
- 38th Amendment finality provision and its deletion by the 44th: -004, -009, -012, -016, -104, -111, -126, -133, -139. Correct. -126 statement 1 (deleted by "42nd") is false by the wrong Amendment, a fair knowledge trap.
- Art 359: enforcement not rights suspended, only specified rights, Arts 20 and 21 never (-062, -068, -069, -072, -078, -080); the only issue is the Art 358 generalisation in -076/-079 above.
- 30-day rule after Lok Sabha dissolution: LK-17.2 example and -026, -030, -035, -036, -039 (RS must have approved in meantime), -086 (President's Rule), -127, -133 (Financial). Correct; the example "30 days run from the new Lok Sabha's first sitting" matches p.260.
- Date arithmetic -054 (cessation 1 March: State List laws inoperative on 1 September not 1 March; Lok Sabha extension capped at 1 September; assemblies same six-month limit): correct. -134 (proclaimed 1 March, approved 30 April, simple majority, no fresh approval): statement 4 correct (inside two months), 1 and 3 false, key 2 and 4 correct.
- Named content edits re-answered: -003, -008 (all-true; Table 17.1 row 1 supports statement 3), -012, -015, -017, -019, -022, -048, -056 (Parliament can confer powers outside the Union List, p.262), -065, -070, -076 (see HIGH), -083, -085, -088 (President's Acts: consultation is with MPs of the state, not Governor/Council, p.267), -096, -097, -124, -125, -134. All keys correct except -076's second-answer problem. Retagged skill items spot-checked: tags sensible.
- Wrong-option notes -003, -024, -061, -081, -087: all accurate (-087 note on footnote 6, 42nd raised to one year and 44th reduced again, matches p.274).
- Rule fields LK-17.1 to 17.8 and examples: every sentence supported on the cited pages (the 17.1 and 17.2 examples checked line by line). No unsupported fact found.
- Fact changes after exam year: no new National Emergency since 1975 (still true); no Financial Emergency (still true); footnote 7 Punjab five-year extension (68th Amendment) accurate.

## PART 2: lk38

Count: HIGH 0, MEDIUM 0, LOW 5. Verdict: PASS.

### LOW
- -102 (and -042, -021, -022, -002 partly) wrong-option notes say only "The chapter gives Rs 3 lakh" or "The chapter does not give this figure" three times over; accurate but uninformative as teaching notes.
- -018 Statement-I/II pairs two independent facts (custody eligibility; Rs 5 lakh SC ceiling) to land on "does not explain". Keyed correctly, low discriminating value.
- -027 statement 2 (Lok Adalat consists only of serving judicial officers) is close to tagged PYQ UPSC-POL-2010-193 option (c); -012/-018 income ceilings relate to UPSC-POL-2020-383. Both are fine as practice, note for the duplicate registry. Income ceilings vary by State and were raised; every use says "according to the chapter".
- -093 statement 2 ("Majority of States have set up regular courts at Taluka level") is a dated 2013-era claim; chapter-literal but the stem has no "according to the chapter" hedge.
- -120 explanation ends with an odd clause ("so only item 1 fits C"); key A-4, B-2, C-1, D-3 is correct.

### Re-answered changed items (all 38)
007, 012, 016, 018, 019, 025, 031, 033, 038, 041, 043, 047, 048, 052, 057, 059, 065, 066, 068, 074, 080, 083, 084, 085, 089, 090, 094, 097, 098, 100, 103, 105, 107, 114, 116, 117, 118, 120: all keys correct, each falsifier false per chapter and real law. Specific checks:
- 012 (income): statement 1 hedged "according to the chapter", statement 2 (SC limit Rs 3 lakh) false (chapter Rs 5,00,000), statement 3 false (eight categories).
- 031 (IPC now BNS): chapter text p.539 says IPC 1860; "now Bharatiya Nyaya Sanhita 2023" correct for real law (Section 22(3) LSA Act refers to deemed judicial proceedings).
- 047/048 (National Lok Adalats monthly since 2015): hedged "according to the chapter"; true on p.539.
- 083/100 (Evidence Act 1872 now Bharatiya Sakshya Adhiniyam 2023): both note the replacement; correct.
- 107, 114 (specified value; pre-institution mediation): match p.546; 114 hedged "as the chapter describes it". The Mediation Act 2023 is not mentioned in the rule field for LK-38.6 (optional addition, not a defect).
- 097: statement 3 false (focus is on Talukas WITHOUT regular courts, p.545); statements 2 and 4 false; key "Only one" correct.
- 108 and 114 hand-patched sets: 108 options {1 and 2, 1 and 3, 1-2-3, 2 and 3}, key "1 and 2 only"; 114 options {1 and 3, 1 and 2, 3 only, 1-2-3}, key "1 and 3 only". Distinct from each other and from every other item's option set; each key matches its statement analysis (108: statements 1 and 2 true, 3 false per p.546; 114: 1 and 3 true, 2 false per p.546). Wrong-option notes name existing options.
- Remaining Statement-I/II (018, 019, 038, 039, 058, 059, 078, 079, 098, 099, 118, 119) and match items (020, 040, 060, 080, 100, 120): all keys correct; the three "explains" keys (038, 058, 078, 119) are anchored on the chapter's own "Hence/therefore" wording.

### Rule fields (LK-38.1, 38.2, 38.3, 38.5, 38.6; 38.4 also read)
Every sentence is supported by pp.536-546 and hedged where it is a figure that varies or has since changed (income ceilings "according to the chapter"; monthly National Lok Adalats "according to the chapter"; IPC to BNS; Indian Evidence Act to Bharatiya Sakshya Adhiniyam). Examples (woman above income ceiling; cheque-bounce case; Rs 40 lakh airline dispute at a Permanent Lok Adalat, within the Rs 1 crore limit and with the no-parallel-suit rule; Nyayadhikari travelling from the intermediate Panchayat headquarters; partnership dispute to mediation then Commercial Court) are all supported.

### Real-law facts checked against current position
Family Courts Act 1984 (one appeal to High Court; one million population); Gram Nyayalayas Act 2008 (appeals to Sessions/District Court within six months); Commercial Courts Act 2015 (specified value Rs 3 lakh after 2018 amendment; pre-institution mediation for suits without urgent interim relief); Permanent Lok Adalat limit Rs 1 crore since 2015. No fact has changed in a way that makes a key wrong.

## Summary
| Pack | HIGH | MEDIUM | LOW | Verdict | Items re-answered |
|---|---|---|---|---|---|
| lk17 | 1 (CS-POL-ch17-076) | 2 (-079, -018) | 5 | fail (fix -076, then pass) | 160 (all) |
| lk38 | 0 | 0 | 5 | pass | 120 (all) |

Total 280 items. Only HIGH id: CS-POL-ch17-076.
