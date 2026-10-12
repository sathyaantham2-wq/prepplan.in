# Review of lk08.json, first half (Laxmikanth ch8 Fundamental Rights, LK-8.1 to LK-8.5) - independent

Verdict: **fail** (1 HIGH). Counts: HIGH 1, MEDIUM 9, LOW 16.
Scope: questions CS-POL-ch08-001 to 100 (LK-8.1 to 8.5, 20 each) plus the pack-level block (chapter, source, scope_in,
scope_out) and the description/idea/rule/example of concepts 8.1-8.5. Questions 101-200 (LK-8.6 to 8.10) not reviewed.
Method: each concept re-answered cold from ch08.txt (pdf pp.127-173) before the key was read. 99 of 100 keys agree with
my own answer. The one disagreement is the Statement-I/II relation in 098 (H1). `check-civil-pack.py` reports 0 problems.
Every key is option 0 (the loader shuffles; not a defect). Codes LK-8.n and `source_code` lk08 are consistent in the chapter
block, the top level and the ids. Explanation counts ("exactly N are correct") match the statements in all 15 how-many items.

Format mix (this half): direct 25, "which" 45, "how many" 15, Statement-I/II 10, match 5 against the 2020-26 column 26 / 48 / 12 /
6 plus 3 case study. Close; Statement-I/II is a little rich. Skill tags: recall 16%, two-step 79%, elimination 5% against
a trend of 42 / 36 (the same skew as lk06b; every multi-statement item is tagged two_step). Every concept has the identical
5/9/3/2/1 shape (L14). No case-study item (same as the other packs).

## HIGH

**H1 - 098 (LK-8.5): the Statement-I/II relation key is contestable and contradicts the pack's own standard in 018.**
Statement-I: Article 19 freedom of movement does not include the right to go out of India and return. Statement-II: the
external dimension of movement is dealt with by Article 21. Key: "II explains I". The book (p.146) only reports two facts
side by side: "Article 19 protects only the first dimension. The second dimension is dealt by Article 21". II says where
the right lives; it gives no reason why Article 19 stops at the internal dimension. The explanation writes "which is why
Article 19 stops at the internal dimension", which is the author's addition. The same shape in 018 (property is no
longer a Fundamental Right / Article 300-A is where it now lies) is keyed "does not explain" with the reason "Article 300-A
says where the right now lies; it does not give the reason". The two items cannot both be right. Under the stricter,
causal standard (the one used in 018, 039, 058) the 098 key is wrong: I answered "both correct, II does not explain I".
Fix: key 098 as "does not explain" (and drop the added sentence from its explanation), or rewrite Statement-II so it gives
a reason (for example that Article 19(1)(d) speaks only of moving "throughout the territory of India") and verify that
against the text.

## MEDIUM

**M1 - 078 (LK-8.4): Statement-II "Article 18 prohibits only hereditary titles of nobility" reads as false next to Article 18 and to 067.**
The key needs II true. Book p.141 puts it as the Court's reading in Balaji Raghavan ("that prohibits only hereditary
titles of nobility"), but the same page, and 067 statement 1 (keyed correct), say Article 18 prohibits the State from conferring
"any title" except military or academic. A candidate who learned 067 can defensibly mark II false and choose "I correct,
II incorrect". Fix: "The Supreme Court read Article 18 as prohibiting only hereditary titles of nobility", so the
statement is a report of the ruling.

**M2 - 018 (LK-8.1): same relation problem, safer side.** "II does not explain I" is the more standard key, but "300-A is why
it is now only a legal right" is arguable. Recommend the author state the relation rule used (causal reason only) and
apply it to 018 and 098 the same way.

**M3 - 062 (LK-8.4), currency: Bharat Ratna "maximum of three in a particular year".** The stem says "According to Laxmikanth", so the key
holds, and the same point is tagged UPSC-POL-2021-416 (statement 3 used "five", marked not correct). But five Bharat Ratnas were announced in
2024 (Karpoori Thakur, Advani, Narasimha Rao, Charan Singh, Swaminathan), so the practice no longer matches the
cap and option "five" is now a real-world count. Keep the attribution; add to the explanation that the cap is the
stated limit and was exceeded in 2024. The Padma cap of 120 (excluding posthumous awards and awards to NRIs, foreigners
and OCIs; 069 statement 2) is still the published norm; no change needed. 062, 068 and 069 together also echo UPSC-POL-2021-416 (L16).

**M4 - 089 statement 4, 090 (LK-8.5), currency: IPC Section 141 and CrPC Section 144.** Both codes were replaced on 1 July 2024
(BNS section 189 and BNSS section 163). The statements are true of the old codes as the book states them, but a 2026-27 aspirant
should see the current section. Fix: add "(now BNS s.189)" and "(now BNSS s.163)" or say "the former".

**M5 - 089 statement 1 (and rule of 8.5): "can be exercised only on public land".** This is Laxmikanth's simplification (the
book p.145). A meeting on one's own premises is plainly protected by Article 19(1)(b); the case law is about public streets
and permission. The key "1 and 4 only" needs statement 1 true. No second option exists, so this is not a second-answer
problem, but it is a fact an informed reader can dispute. Fix: swap statement 1 for "must be peaceful and unarmed" alone, or
attribute to the book.

**M6 - 093 statement 1, 092 statement 1, 096 statement 4 (LK-8.5): "ground X applies to freedom Y" with grounds swapped.** True under
the grounds expressly listed in Table 8.5; but "in the interests of the general public" in 19(5) and 19(6) is read widely
by courts and covers public order and morality in practice. In 093 a reader who counts public order inside 19(6) makes
"1 and 2 only" defensible (key "2 only"). Fix: add "as listed in Article 19 / Table 8.5" to those three stems, or choose
a ground that no one could read into the general-public head (for example "contempt of court" for assembly).

**M7 - 050 (LK-8.3), currency: EWS asset tests (5 acres, 1000 sq ft flat, plots).** Statement 2 is the only correct statement,
so the whole item rests on the asset test. The Centre and the Ajay Bhushan Pandey committee reviewed the EWS criteria in
2021-22 (the residential-asset tests were reported as dropped; I cannot confirm what happened to the 5-acre test). The
103rd Amendment itself was upheld in Janhit Abhiyan (2022), nothing in the pack contradicts that. Fix: either verify the
current notification or make the correct statement "family income below Rs 8 lakh", which the book and the Supreme Court
(Neil Aurelio Nunes, 2022) both still support, and put the asset test in a wrong statement only with "according to the book".

**M8 - repetition in LK-8.5: "no right to strike" appears in four items** (089 statement 2, 091 statement 3, 097 statement 2,
099 Statement-II). 089 and 099 test the identical fact (assembly does not include strike). Limit is two per idea.
Replace 099 Statement-II with a different false claim (for example assembly allowed with arms for a peaceful cause is
not worth keeping; better "assembly may be restricted on grounds of decency or morality", already in 089 st 3; or the
Section 141 list).

**M9 - key-shape tells (LK-8.1 to 8.5).** (a) "How many" items: all five four-statement items are keyed "Only three"
(016, 035, 056, 076, 096) and no three-statement item is ever keyed "None" or "All three" (keys are "Only one" or
"Only two", five each). (b) In the three-statement "which" items the five "all correct" items (011, 030, 054, 074, 094)
are the lone three-statement option (written "1, 2 and 3" without "only") and each is the key; in 007, 009, 034, 071
the distractor is written "1, 2 and 3 only". A candidate who sees one three-statement option and no "only" can mark it with
no knowledge. Vary the count: key "None" or "All three" in some, "Only two"/"Only one" in four-statement items, and give
an "all correct" item a second three-statement option.

## LOW

- **L1 - 007 explanation:** cites p.130 for Article 35 (statement 2); Article 35 is on pp.131 and 163.
- **L2 - 002 wrong-option explanation:** cites "(p.131, p.163)" for "failure of constitutional machinery is not a National Emergency ground"; neither
  page says so (the phrase is not in the chapter). True in law; the citation is loose. Same for 001 (Edward I 1297, Petition of Right 1628,
  Bill of Rights 1689 are outside facts; true, but scope_out says "No fact is taken from memory").
- **L3 - 010 statement 4:** "A person whose such right is violated" is ungrammatical and "such" has no clear referent; say
  "A person whose right under any of these provisions is violated".
- **L4 - 011:** the stem says "significance" but statements 1-3 come from the introduction (p.127), not the "Significance" list (p.168). Say "features and purpose".
- **L5 - 016 statement 1:** "an example of the permanency" flips the book's heading "No Permanency" by one word. It tests understanding, but a
  reader can miss it. Prefer "...as proof that they are not permanent" in a true form and a different false statement.
- **L6 - 095:** stem says "included in the freedom of speech" while statement 3 asserts "is not covered", mixing a stem about inclusion with a negated
  statement. Reword statement 3 as "The right to access the internet is included in it" and key it correct.
- **L7 - 005 explanation and 8.1 rule:** repeat Table 8.2 "Articles 15, 16, 19, 29 and 30 are citizens only". The book (p.156) says Article 29 covers any "section
  of citizens" and Article 30 is for "all minorities". No question tests 29/30 as non-citizen falsifiers (checked every item),
  so the key is safe; consider dropping 29/30 from the rule sentence or marking "per Table 8.2".
- **L8 - 032 statement 2 / 035 statement 3, currency:** Article 105(2) immunity for votes and speech was narrowed by the 2024 seven-judge ruling (Sita Soren: bribery for a
  vote or speech is not protected). The statements follow the Article and the book; no key changes. A short explanation note would help.
- **L9 - 094 statement 3:** the 2017 Suspension Rules were replaced by the Telecommunications (Temporary Suspension of Services) Rules, 2024 under the
  Telecommunications Act, 2023. The statement reports what the 2020 ruling held, so it stays true; add "under the 2017 Rules".
- **L10 - 044 / 049 creamy layer:** Rs 8 lakh since 2017 is the last revision I can verify; 049 statement 4 ("stood at Rs 8 lakh from 2017") is safe; 044 is attributed to the book. Re-check at load time.
- **L11 - 025, 032, 035:** three items on President/Governor immunity (civil proceedings, criminal, arrest). Different clauses, so inside the limit, but near it.
- **L12 - 065 vs 077 statement 3:** Mysore High Court / social boycott is tested twice, plus "untouchability is not defined" in 066 statement 3 and 077 statements 1-2. Inside the limit, close to it.
- **L13 - wrong-option explanations in Statement-I/II items:** 019, 038, 059, 099 (and others) give the same "Rejected: Statement-II is incorrect..." sentence for two different wrong options; these do not say why that particular option fails.
  The multi-statement "w" lists cite the first page of the item rather than the statement's page (for example 006-020 all "p.128").
- **L14 - format:** every concept has the same 5/9/3/2/1 shape; fine for now, consider moving one "which" item per concept to a case-study or
  a "statements-which-is-not-correct" item (the trend shows "exception" and negation traps rising).
- **L15 - 061 pg `[141,139,148]`** lists pages of distractor cases first; keep the answer page first.
- **L16 - near-duplicates of tagged PYQs (chapter 8):** 062/068/069 against UPSC-POL-2021-416 (Bharat Ratna cap, Padma interruptions, "not titles");
  063 against UPSC-POL-2004-129 (Article 24, below 14); 020 against UPSC-POL-2002-091 (Right to Equality = Articles 14-18) and 040 against 2004-128 (Article 14-17 match); 018
  against UPSC-POL-2005-137 (Article 300A / legal right); 027 statement 2 against UPSC-POL-2026-486 (custom included in "law" under Article 13); 004 distractor against 2002-086 (Ambedkar "heart and soul"). Facts are the same,
  stems are rewritten; none is a verbatim copy. They are not harmful, but the bank should not present them as new.

## Pack-level block, checked
- **chapter:** part L, chapter_no 8, name, blurb, source_code lk08, order_index 108: consistent. The blurb says Articles 12 to 35, matching Part III.
- **source:** "Indian Polity", edition 8e, year 2026: same wording as the sibling packs I read. Publisher Laxmikanth.
- **scope_in:** page ranges match the text (127-131 features, 131-134 Art 12-14, 134-140 Art 15-16, 140-141 + 153-154 Art 17, 18, 23, 24, 142-147 Art 19, 166-168 criticism and
  rights outside Part III). **scope_out:** the mandamus exclusion is correct and justified (the book p.160 conflicts with the 2022 UPSC key).
- **Concepts 8.1-8.5 description/idea/rule/example:** every sentence checked against the cited page; true in current law.
  Currency items already listed: 8.3 "creamy-layer ceiling Rs 8 lakh (2017)" (L10); 8.5 "on public land" (M5); 8.4 "Child Labour Act, 1986 was renamed in 2016" is
  accurate (the 2016 Act raised the age rule to "all occupations below 14 except family work", which the rule sentence does not claim). No sentence is unsupported.
  The 8.4 example ("A Padma award may not be used as a prefix") matches p.141. The 8.1 rule's "Table 8.2 ... (Articles 15, 16, 19, 29, 30)" is Table 8.2 as printed (L7).
- **Author's least-sure facts:** Bharat Ratna cap and Padma cap (M3); Table 8.2 Articles 29/30 (L7; no question calls 29 or 30 non-citizen);
  reservation facts: EWS 10% (15(6), 16(6), 103rd, 2019) correct and upheld in Janhit Abhiyan (2022); 50% ceiling as in Indra Sawhney still the rule for SC/ST/OBC; creamy layer as printed;
  Article 16(4A) correct as an enabling provision (the Nagaraj / Jarnail Singh data conditions are not asserted anywhere); NCBC 338-B correct.

## Recurring defect check (false only because the book words it differently or is silent)
Checked every false statement and wrong option. Cases where the "false" side is the book's wording and a careful reader could disagree: 093 st1 and 092 st1 / 096 st4 (M6), 078 Statement-II (M1), 089 st1 (M5), 098 and 018 (relation, H1, M2). The three known book errors (Ambedkar 1953, insurance 1971, Dantwala) do not occur in this half; every number or year used as a distractor (1215/1297/1628/1689, 2004/2008/2013/2017, 1974, 1955/1980, 20,000 vs 25,000, 14 vs 16, five vs three) was
checked against the page and the book is right on each. No key relies on a book mistake.

## Per-concept summary
- **LK-8.1:** 20 keys agree. 018 is M2; 007, 010, 011, 016 are LOW. Four items touch citizens-versus-foreigners (005, 006 st1, 012): inside the limit.
- **LK-8.2:** 20 keys agree. 032/035 L8. Repetition fine.
- **LK-8.3:** 20 keys agree. 050 is M7; 044/049 L10. The amendment-effect map is tested twice (052, 060), at the limit.
- **LK-8.4:** 20 keys agree. 078 M1, 062 M3.
- **LK-8.5:** 19 keys agree; 098 is H1. 089/090 M4-M5, 092/093/096 M6, strike repetition M8.
