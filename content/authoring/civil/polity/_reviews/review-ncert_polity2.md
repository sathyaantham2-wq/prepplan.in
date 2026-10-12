# Review: ncert_polity2.json (CVP-2.1 to 2.6, 120 questions)

Reviewer pass: every key recomputed cold from the cited Laxmikanth pages (ch02, ch03, ch04, ch05, ch08 p.144, ch10, ch11) and the Class 7 text (gees110 pages 001-020) before reading the key. Dup run: `scripts/civil-services/dup-check.py` at 0.7 (output in `scratchpad/rv2/dup.txt`, 68 lines) and at 0.6 (130 lines). Pack not edited.

**Verdict: needs_fix (2 HIGH).** Counts: HIGH 2, MEDIUM 14 rows, LOW 11 rows. Keys: 118 of 120 recompute correctly and every cited pdf_page states the fact; the 2 HIGH items are wording defects that create a second defensible answer or a historically wrong "true" statement, not wrong arithmetic.

## HIGH

| id | problem | fix |
|---|---|---|
| CS-POL-ncp2-5-18 | Statement-II says "Article 368 allows ... some by a simple majority outside its scope". That is self-contradictory. Laxmikanth p.194 says the simple-majority provisions come from OTHER articles and "are not deemed to be amendments for the purposes of Article 368". A strict reader can call Statement-II incorrect, which makes option C ("I correct, II incorrect") defensible beside the key. | Reword II: "The Constitution can be amended by a simple majority of Parliament, by a special majority, or by a special majority with ratification by half the states." Keep key. |
| CS-POL-ncp2-2-10 | Statement 4 ("only 284 were present and signed ... when it was declared passed on 26 November 1949") is the keyed-true statement that decides the answer, but the 284 signatures were appended on 24 January 1950. Laxmikanth's own note under Table 2.6 (p.53) says "met once again on January 24, 1950, when the members appended their signatures", which contradicts his p.44 sentence. A candidate who knows the NCERT/Lok Sabha date will mark statement 4 false and find no matching option. | Drop the date from statement 4: "Of the 299 members, only 284 were present and signed the Constitution." Or attribute it ("Laxmikanth records that ... "). Statement 4 is then still keyed correct and defensible. |

## MEDIUM

| id | problem | fix |
|---|---|---|
| CS-POL-ncp2-4-18 | Statement-I adds "only" to Laxmikanth's "a moral obligation". Whether II (the sanction is political) "explains" I (the obligation is moral) is a judgement call; "both correct, II does not explain I" is arguable. Also the pack has no stmt12 item keyed "does not explain" at all (see LOW format note). | Make II an independent true fact (e.g. "The Directive Principles are enumerated in Part IV") and key "correct, II does not explain I". That also fills the missing key type. |
| CS-POL-ncp2-6-07 | Statement 4 ("the 1991 policy has diluted the socialist credentials") is keyed true but is Laxmikanth's opinion, stated unattributed. | Add "According to Laxmikanth," to statement 4, or replace with the factual line "Indian socialism is democratic socialism with a mixed economy" (already contradicted in statement 1). |
| CS-POL-ncp2-1-02 | Shape tell. Key "New Zealand" is a bare name; the three distractors carry qualifiers ("Canada, under its Constitution Acts", "Japan, under its post-war Constitution", "France, under its Fifth Republic charter"). The odd one out wins. | Use four bare names or four qualified names; add Israel as the key option and UK-type distractors only if the stem says "outside the UK". |
| CS-POL-ncp2-5-04 | Shape tell. Key is 87 characters against 22-39 for the others. Also same topic and options as 5-07 (see duplicates). | Lengthen the distractors ("The Fundamental Rights contained in Part III") or replace the question. |
| CS-POL-ncp2-2-01 | Key is 183 characters against 110-121. | Trim the key to the ratio 1.0-1.2 (drop "by proportional representation with the single transferable vote" from the key and move STV into the stem, or add it to every option). |
| CS-POL-ncp2-5-01 | Key is 138 characters against 79-97. | Same as above. |
| CS-POL-ncp2-5-02, 5-19, 5-20 | One fact (24th Amendment, assent obligatory) asked three times in 20 questions; 5-02's key hands 5-19 its answer. | Replace 5-19 with a different Statement-I/II pair. |
| CS-POL-ncp2-6-02, 6-11, 6-18 | Berubari / Kesavananda / LIC asked three times; 6-02 gives away 6-18. | Replace 6-18 with an item on non-justiciability or on the Hidayatullah observation. |
| CS-POL-ncp2-5-04 and 5-07 | Same question (which provisions are amendable by simple majority) twice, identical stems at 1.0 overlap, plus a third copy in lk11-306. | Keep 5-07; replace 5-04 with "which needs ratification by half the states" or the Article 3 route. |
| CS-POL-ncp2-3-16 and 6-14 | Statement "The Preamble is based on the Objectives Resolution drafted and moved by Pandit Nehru" is identical in both (1.00) and 0.78 to ncert_polity4 CS-POL-ncp4-1-09. | Drop it from 6-14 and replace with the Palkhivala "identity card" line (which 6-12 uses as a false variant, so use the four-ingredients list instead). |
| CS-POL-ncp2-3-19 and 3-16 | French Revolution as source of liberty/equality/fraternity asked twice (0.80) and a third time in 3-13. | Replace 3-19 with a Soviet-source or Irish-source Statement-I/II. |
| CS-POL-ncp2-4-11 and 4-15 | Environment-duty line repeated (0.91). | Replace the environment duty in 4-15 with the duty on public property or scientific temper. |
| CS-POL-ncp2-2-06 and 2-01 | Composition of the Assembly asked twice (0.86 overlap on stem). | Re-angle 2-06 to the 292/4/93 split and the Table 2.1 totals. |
| Cross-pack near-copies | 20 lines at 0.80 or more (table below), 48 at 0.70-0.79. Roughly 16 distinct items. | See table for per-line action. |

## LOW

| id | note |
|---|---|
| CS-POL-ncp2-1-02, 4-04 | The three "w" rationales are word for word identical (1-02) or one repeats another (4-04 w[0] and w[2]). Cosmetic. |
| CS-POL-ncp2-1-10, 3-15 | NCERT trivia (helium case, illustration scenes) is low exam value. Acceptable as Class 7 coverage but do not add more. |
| CS-POL-ncp2-4-11 s3 | "Courts cannot enforce the Fundamental Duties" is Laxmikanth's non-justiciable reading (p.67). Courts have used the duties in interpretation; add "directly" if edited. |
| CS-POL-ncp2-4-14 s4 | UPSC may serve a state at the governor's request under Article 315(4), but the statement concerns disciplinary advice, so it is false as written. Fine. |
| CS-POL-ncp2-5-10 s3 | Article 40 (village panchayats, DPSP) was in the original text; the statement is still false because the system was not constitutionally recognised until 1992. Consider "recognised as a tier of government" for precision. |
| CS-POL-ncp2-4-20, 5-17 | Part IX-B (97th Amendment) was read down by Union of India v Rajendra N. Shah (2021) for state co-operatives; Laxmikanth 8e text does not mention it. Statements remain true as phrased. Keep the wording "added/gave constitutional status" and avoid "applies to all co-operatives". |
| CS-POL-ncp2-1-16 | Statements 3 and 4 swap the Canadian (147) and Chinese (138) figures; a pure footnote-recall trap. Fair but low value. |
| CS-POL-ncp2-all howmany | "None" is never the key and is a weak distractor in 3-statement items; "Only one" key appears 6 times, "Only two" 7, "Only three" 3, "All three" 2. Fine. |
| Key position | The file holds the key at index 0 in all 120 (the loader shuffles). No action. |
| Stmt12 key mix | Keys: "both, II explains" 5, "I only" 3, "II only" 4, "both, II does not explain" 0. Add at least two "does not explain" keys when 4-18 and 5-18 are fixed. |
| Pack format mix vs 2020-26 column | direct 30/120 = 25% (target 26%), consider statements 54 = 45% (48%), how-many 18 = 15% (12%), Statement-I/II 12 = 10% (6%), match 6 = 5% (not tracked), case study 0 (3%). Within tolerance; Statement-I/II slightly high, which is why swapping two for other formats is cheap. |
| Currency | Nothing stale: 25 Parts / 12 Schedules, 11 Fundamental Duties (86th Amendment), Article 45 early childhood care (86th), Twelfth Schedule 18 matters, GST Council in the ratification list (101st) are current. No court-strength or composition figures used. |

## Per-concept verification (all 120 recomputed)

All keys below were derived from the source page before looking at the key and agree unless listed under HIGH or MEDIUM above.

- CVP-2.1 (Ch.3 p.56-60; Ch.4 p.62, 71-76, 83; Class 7 p.210-213): 1-01 to 1-20 correct. Option checks done on 1-01 (conventional = enacted; evolved = cumulative), 1-06 (statement 1 swaps the two names), 1-12 (Table 4.1 ranges 324-329A, 352-360, 12-35), 1-13 (Table 4.2: 40, 44, 45, 46, 50, 51), 1-16 (footnote 2: 7/128/138/147). Statement 3 of 1-07 is false in real law (Bulmer's fifth purpose) not only by silence.
- CVP-2.2 (Ch.2 p.39-47, 53-54; Class 7 p.214): 2-01 to 2-20 correct except the 2-10 wording defect. Verified 208/73/15 seats, 207 present, 11 Dec / 25 Jan / 16 Jul dates, Mavalankar, 114 / 141 days, Table 2.7 Canada 2 years 6 months and US under 4 months, elephant seal, Hindi text Part XXII. 2-12 flag date 22 Jul 1947 and anthem, song, President on 24 Jan 1950 confirmed.
- CVP-2.3 (Ch.4 p.62-63, 70-71, 81-83; Ch.5 p.85, 88; Class 7 p.215-219): 3-01 to 3-20 correct. Table 4.4 rows (Irish: DPSP, RS nomination, President's election; Canadian: strong Centre, residuary, governors; Australian: Concurrent List; Weimar: emergency suspension; Soviet: duties and justice; South African: amendment procedure) match the pack. 3-08 s3 advisory jurisdiction is in the 1935 Act row.
- CVP-2.4 (Ch.4 p.64-69, 75-81; Class 7 p.220-222): 4-01 to 4-20 correct. Verified quo warranto (not injunction), Articles 29-30 (not 32), eleven duties, 18 matters / 74th, Part IX-B / 97th, UPSC advises President, SPSC advises Governor.
- CVP-2.5 (Ch.11 p.193-197; Ch.10 p.188-189; Ch.4 p.62, 68-70; Ch.8 p.144; Class 7 p.223): 5-01 to 5-20 correct except 5-18 wording. Simple-majority list items 1 and 3 (delimitation; legislative councils) and ratification list items 2, 3, 5 (President's election, SC/HCs, GST Council) confirmed. Flag item "Right to fly the national flag" is on Ch.8 p.144 under freedom of speech.
- CVP-2.6 (Ch.5 p.85-91; Class 7 p.225-226): 6-01 to 6-20 correct. Only 6-07 s4 is opinion.

## Falsifier rule

All false statements were checked against real law and history, not only against silence in the source. No violations. Closest calls (all pass): 1-07 s3 (institutions are set up by a constitution: false in practice), 2-14 s3 (the seal was an elephant), 5-10 s3 (see LOW), 4-09 s3 (the fifth writ is quo warranto), 3-15 s2 (the Rama scene is Ramayana).

## Duplicates (dup-check at 0.7 over lk01-lk24, aks, ncert_polity4 and all other packs)

### Near-copies at overlap 0.80 or higher (20 lines)

| ovl | this item | line | existing item (pack) | existing line | action |
|---|---|---|---|---|---|
| 0.86 | CS-POL-ncp2-1-13 | The separation of the judiciary from the executive is the subject of Article 50. | CS-POL-ch04-916 lk04b.json | Article 50 is the Article on the separation of the judiciary from the executive. | re-angle: ask about a different Article pair (e.g. 38/39/43) instead of Article 50 |
| 0.83 | CS-POL-ncp2-6-07 | The Congress party adopted a resolution on a 'socialistic pattern of society' at its Avadi session in 1955. | CS-POL-ch05-814 lk05b.json | The Congress adopted its resolution on a socialistic pattern of society at Avadi in 1955. | replace: swap for a Class 7 only fact (e.g. the five-line Preamble gloss) or fold Avadi into a negation on 1955 vs 1976 |
| 0.83 | CS-POL-ncp2-5-04 | Which one of the following can be amended by a simple majority of Parliament, outside the scope of Article 368 | CS-POL-ch11-306 lk11.json | Which of the matters given above can be amended by a simple majority of Parliament outside the scope of Articl | re-angle: this stem is a copy of lk11-306 and also repeats 5-07 inside this pack; replace with a different amendment-mode question (e.g. which needs half-state ratification) |
| 0.83 | CS-POL-ncp2-4-16 | Article 21A provides for the right to elementary education. | CS-POL-ch04-917 lk04b.json | Article 21A is the Article on the right to elementary education. | re-angle: drop statement 3 or swap to Article 21 vs 21A pairing with the 86th Amendment |
| 0.83 | CS-POL-ncp2-3-02 | According to Laxmikanth, the ideal of justice - social, economic and political - in the Preamble has been take | CS-POL-ch05-402 lk05.json | The ideal of justice, social, economic and political, in the Preamble has been taken from | re-angle: ask the Soviet-source row of Table 4.4 as a match item rather than a direct question |
| 0.83 | CS-POL-ncp2-2-12 | It elected Dr. Rajendra Prasad as the first President of India on 26 January 1950. | CS-POL-ch02-415 lk02.json | The Assembly elected Dr Rajendra Prasad as the first President of India on 26 January 1950. | replace statement 3 (24 vs 26 January) with a different Other-Functions fact, e.g. Commonwealth ratification vs flag date only |
| 0.83 | CS-POL-ncp2-1-09 | Consider the following statements about the qualities of a good constitution listed in Laxmikanth: | CS-POL-ch03-907 lk03b.json | Consider the following statements about the order in which the qualities of a good constitution are listed in | only the stem is shared; acceptable, but change the statements to a different quality trio (not the 3-4-5 run) |
| 0.83 | CS-POL-ncp2-1-06 | The Constitutions of the USA, Australia and Switzerland are given as examples of rigid constitutions. | CS-POL-ch03-507 lk03.json | The constitutions of the USA, Australia and Switzerland are examples. | re-angle statement 3 as false (swap Switzerland for the UK) so it is not a verbatim lk03 line |
| 0.82 | CS-POL-ncp2-6-12 | K.M. Munshi called the Preamble the 'horoscope of our sovereign democratic republic'. | CS-POL-ch05-612 lk05.json | K.M. Munshi called it the horoscope of our sovereign democratic republic. | re-angle: drop the Munshi horoscope line; use Hidayatullah or Alladi Krishnaswami Iyer |
| 0.82 | CS-POL-ncp2-5-07 | Which of the above can be amended by a simple majority of Parliament outside Article 368? | CS-POL-ch11-306 lk11.json | Which of the matters given above can be amended by a simple majority of Parliament outside the scope of Articl | replace (same topic as 5-04 and lk11-306) |
| 0.82 | CS-POL-ncp2-3-13 | The Republic and the ideals of liberty, equality and fraternity in the Preamble were drawn from the French Con | CS-POL-ch04-1308 lk04b.json | The Republic and the ideals of liberty, equality and fraternity in the Preamble are borrowed from the French C | re-angle: use South Africa and Japan rows only, drop the French row |
| 0.82 | CS-POL-ncp2-2-13 | Lord Viscount Simon remarked that the Assembly was 'a one-party body in an essentially one-party country'. | CS-POL-ch02-613 lk02.json | Lord Viscount Simon described the Assembly as 'a one-party body in an essentially one-party country'. | drop statement 1 (already a false variant in lk02-613); use the Naziruddin Ahmed Drifting Committee line |
| 0.82 | CS-POL-ncp2-2-10 | The general discussion on the draft lasted five days, till 9 November 1948. | CS-POL-ch02-606 lk02.json | The general discussion on it lasted five days, till 9 November 1948. | re-angle: use 15 Nov 1948 / 17 Oct 1949 second-reading dates |
| 0.82 | CS-POL-ncp2-2-08 | When the Assembly met as a legislative body it was chaired by G.V. Mavlankar. | CS-POL-ch02-409 lk02.json | G.V. Mavalankar chaired the Assembly when it met as the legislative body. | re-angle: ask who chaired the Assembly as the constituent body vs the legislative body |
| 0.82 | CS-POL-ncp2-2-06 | The scheme allotted 296 seats to British India and 93 to the princely states, a total of 389. | CS-POL-ch02-706 lk02b.json | Of the 389 seats, 296 were allotted to British India and 93 to the princely states. | re-angle: use the 292 + 4 split of the 296 seats |
| 0.80 | CS-POL-ncp2-6-08 | The term is used in the broader sense, embracing political, social and economic democracy. | CS-POL-ch05-308 lk05.json | It is used in the broader sense embracing political, social and economic democracy. | re-angle: use the Ambedkar 25 Nov 1949 social-democracy quote |
| 0.80 | CS-POL-ncp2-4-12 | The 73rd Amendment Act of 1992 gave constitutional recognition to the panchayats by adding Part IX and the Ele | CS-POL-ch04-620 lk04.json | The 73rd Amendment Act of 1992 gave constitutional recognition to the panchayats by adding a new Part IX-A and | re-angle or replace |
| 0.80 | CS-POL-ncp2-3-09 | The philosophical part, the Fundamental Rights and the Directive Principles, draws its inspiration from the Am | CS-POL-ch04-1310 lk04b.json | The philosophical part (Fundamental Rights and Directive Principles) derives its inspiration from the American | re-angle or replace |
| 0.80 | CS-POL-ncp2-2-07 | All 93 seats allotted to the princely states were filled in the same elections. | CS-POL-ch02-219 lk02.json | The 93 seats allotted to the princely states were all filled in the 1946 elections. | re-angle or replace |
| 0.80 | CS-POL-ncp2-2-01 | Each community's representatives were elected by the members of that community in the provincial legislative a | CS-POL-aks02-009 aks02.json | Members of each community were elected by the members of that community in the provincial legislative assembly | re-angle or replace |

### Overlap 0.70 to 0.79 (48 lines, LOW; fix only if the item is edited anyway)

| ovl | this item | existing item |
|---|---|---|
| 0.79 | CS-POL-ncp2-5-17 | CS-POL-aks03-013 (aks03.json) |
| 0.79 | CS-POL-ncp2-1-13 | CS-POL-ch09-974 (lk09.json) |
| 0.79 | CS-POL-ncp2-1-11 | CS-POL-ch03-501 (lk03.json) |
| 0.78 | CS-POL-ncp2-6-14 | CS-POL-ch02-619 (lk02.json) |
| 0.78 | CS-POL-ncp2-6-14 | CS-POL-ncp4-1-09 (ncert_polity4.json) |
| 0.78 | CS-POL-ncp2-5-17 | CS-POL-ch04-1206 (lk04b.json) |
| 0.78 | CS-POL-ncp2-5-14 | CS-POL-ch02-615 (lk02.json) |
| 0.78 | CS-POL-ncp2-5-02 | CS-POL-ch18-504 (lk18.json) |
| 0.78 | CS-POL-ncp2-3-16 | CS-POL-ncp4-1-09 (ncert_polity4.json) |
| 0.78 | CS-POL-ncp2-1-12 | CS-POL-ch04-814 (lk04b.json) |
| 0.78 | CS-POL-ncp2-1-12 | CS-POL-ch04-420 (lk04.json) |
| 0.77 | CS-POL-ncp2-6-07 | CS-POL-ch05-208 (lk05.json) |
| 0.77 | CS-POL-ncp2-2-16 | CS-POL-ch02-713 (lk02b.json) |
| 0.77 | CS-POL-ncp2-2-10 | CS-POL-ch02-606 (lk02.json) |
| 0.75 | CS-POL-ncp2-6-20 | CS-POL-ch05-207 (lk05.json) |
| 0.75 | CS-POL-ncp2-6-10 | CS-POL-ch05-517 (lk05.json) |
| 0.75 | CS-POL-ncp2-5-14 | CS-POL-ch02-615 (lk02.json) |
| 0.75 | CS-POL-ncp2-5-09 | CS-POL-ch11-408 (lk11.json) |
| 0.75 | CS-POL-ncp2-5-07 | CS-POL-aks15-020 (aks15.json) |
| 0.75 | CS-POL-ncp2-5-06 | CS-POL-ch34-030 (lk34.json) |
| 0.75 | CS-POL-ncp2-4-08 | CS-POL-aks05a-006 (aks05a.json) |
| 0.75 | CS-POL-ncp2-3-14 | CS-POL-ch04-120 (lk04.json) |
| 0.75 | CS-POL-ncp2-3-09 | CS-POL-ch04-1310 (lk04b.json) |
| 0.75 | CS-POL-ncp2-3-04 | CS-POL-aks03-056 (aks03.json) |
| 0.75 | CS-POL-ncp2-2-12 | CS-POL-ch02-411 (lk02.json) |
| 0.75 | CS-POL-ncp2-2-05 | CS-POL-ch02-618 (lk02.json) |
| 0.75 | CS-POL-ncp2-1-15 | CS-POL-ch03-119 (lk03.json) |
| 0.75 | CS-POL-ncp2-1-14 | CS-POL-ch03-517 (lk03.json) |
| 0.75 | CS-POL-ncp2-1-12 | CS-POL-ch04-814 (lk04b.json) |
| 0.75 | CS-POL-ncp2-1-06 | CS-POL-ch03-1106 (lk03b.json) |
| 0.73 | CS-POL-ncp2-6-18 | CS-POL-ch05-609 (lk05.json) |
| 0.73 | CS-POL-ncp2-5-04 | CS-POL-ch06-1214 (lk06b.json) |
| 0.73 | CS-POL-ncp2-4-18 | CS-POL-ch04-911 (lk04b.json) |
| 0.73 | CS-POL-ncp2-4-13 | CS-POL-aks03-053 (aks03.json) |
| 0.73 | CS-POL-ncp2-3-07 | CS-POL-aks02-055 (aks02.json) |
| 0.71 | CS-POL-ncp2-6-20 | CS-POL-ch05-311 (lk05.json) |
| 0.71 | CS-POL-ncp2-6-09 | CS-POL-ch05-419 (lk05.json) |
| 0.71 | CS-POL-ncp2-5-16 | CS-POL-aks02-057 (aks02.json) |
| 0.71 | CS-POL-ncp2-4-16 | CS-POL-ch05-507 (lk05.json) |
| 0.71 | CS-POL-ncp2-2-15 | CS-POL-aks02-007 (aks02.json) |
| 0.71 | CS-POL-ncp2-2-14 | CS-POL-ch02-1209 (lk02b.json) |
| 0.71 | CS-POL-ncp2-2-11 | CS-POL-ch02-506 (lk02.json) |
| 0.71 | CS-POL-ncp2-1-13 | CS-POL-ch04-913 (lk04b.json) |
| 0.71 | CS-POL-ncp2-6-17 | CS-POL-ch05-918 (lk05b.json) |
| 0.70 | CS-POL-ncp2-5-16 | CS-POL-ch02-1214 (lk02b.json) |
| 0.70 | CS-POL-ncp2-4-14 | CS-POL-ch04-502 (lk04.json) |
| 0.70 | CS-POL-ncp2-2-14 | CS-POL-ch02-1209 (lk02b.json) |
| 0.70 | CS-POL-ncp2-2-06 | CS-POL-ch02-706 (lk02b.json) |