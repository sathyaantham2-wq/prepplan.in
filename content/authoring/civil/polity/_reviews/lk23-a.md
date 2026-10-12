# Review of lk23.json, first half (Laxmikanth ch23 Parliament, LK-23.1 to 23.6, ids CS-POL-ch23-101 to 620) - independent

Verdict: **pass** (0 HIGH). Counts: HIGH 0, MEDIUM 13, LOW 8.

Method: all 120 questions re-answered cold, one concept at a time, from ch23.txt (pdf pp.327-345, 381-393) with the options
shuffled and the key and explanations hidden, before I read any key. My answer matched the key on all 120. I checked every
statement of every multi-statement item against the page text, each option for a second defensible answer, each `pg`, the
real-law currency of each fact, and the six concepts' rule/idea/description/example sentences. `check-civil-pack.py` reports
0 problems; I recomputed the shape tests myself (no lone three-statement key in a four-statement item; the key is the
odd-sized option in only 3 of 54 "which" items). Ids unique, every key is `o[0]`, every `w` has 3 entries, no duplicate options.
Concepts 23.7 to 23.12 were not reviewed.

Format mix (this half): direct 25% (30), "which" 45% (54), how-many 15% (18), Statement-I/II 10% (12), match 5% (6). Trend
column 2020-26: direct 26 / consider-statements 48 / how-many 12 / Statement-I/II 6 / case study 3. Close; Statement-I/II is a
little rich, case study absent (the pack has no case format). Every concept has the identical 5/9/3/2/1 shape (L1).

## Author's least-sure facts, checked
- **Speaker during his own removal resolution (507, 518-adjacent):** book p.336 says he may speak and vote in the first instance,
  not in a tie. Matches Art 96(2) exactly. 507 key (1 and 2 only) is right; statement 3 ("and also casting vote") is false in
  both the book and the Article. 606/607 repeat it for the Chairman (cannot vote at all; p.340) correctly. No conflict.
- **Anglo-Indian nomination ended 25 January 2020; 95th Amendment last extension (105, 109, 110-114):** p.328-329 prints
  "95th Amendment Act, 2009" and "25th January, 2020"; both are true in law (95th Amendment, 2009, extended to 2020; 104th
  Amendment, 2019, discontinued the Lok Sabha nomination, with effect from 25 January 2020). 109 statement 3 (104th extended it
  to 2030) is false in law and in the book (the 2030 extension is for SC/ST seats only). Sound.
- **2018 pay figures and "daily allowance raised in 2010" (414-417):** every figure is as printed on p.335 and every statement is
  pinned to "in 2018" or "in 2010", so none is false today as history. They are, however, superseded as current rates (M8).
- **Seat numbers and the delimitation freeze (203, 204, 207, 213, 220):** all as printed. See M9 for the 2026 wording.
- **Table 23.5 per-state counts (103, 104, 111, 112, 115):** I parsed the table: states 225 RS / 524 LS; with Delhi 3 + Puducherry 1
  + J&K 4 = 8 UT RS seats, 225 + 8 + 12 = 245. LS: UT seats 1+1+2+7+1+1+5+1 = 19, total 543. SC 83 + 1 (Delhi) = 84; ST 45 + 2 = 47.
  The table matches current law (post-2019 J&K 4 RS / 5 LS, Ladakh 1 LS, 245 and 543). The RS 245/238/12 split is right.
  111 statement 2 (MP has 6 ST seats, the most) and statement 3 (UP 31 RS and 17 SC) both hold.

## Pack-level metadata
`chapter` block (part L, chapter_no 23, source_code lk23, order_index 123, blurb "Articles 79 to 122") matches the sibling
packs' pattern; top-level `source_code` = `chapter.source_code` = `lk23`; `source` block identical to the other packs. Codes are
LK-23.n. `scope_in` page ranges for the six concepts' topics are right (327-329, 329-331, 331 and 384-385, 331-336, 336-342
and 385-386, 342-343, 343-348). `scope_out` is honest: the Tenth Schedule exclusion matches p.333; "present Speaker or Chairman
... avoided" is respected in this half. Concept rule/idea/description sentences: every sentence is supported by the cited page
and true in law. Only blemishes: the 23.1 example sentence is ungrammatical ("A student asked how many ... finds that only
...") but true; the 23.6 idea is vague (L7). Missing from scope_out: the 106th Amendment (women's reservation, tied to the
post-census delimitation) is not in the chapter and not tested, but a one-line note in 23.2 would stop a later author adding
"reservation lasts to 2030" as the only reservation fact (L8).

## HIGH
None.

## MEDIUM
**M1 - 23.1 repeats ideas (limit 2 per idea).** The "President is an integral part of Parliament / Britain vs USA" idea is in 101,
110, 113, 117, 118 (five items). The present-strength numbers 543/524/19 are in 104, 112 (statement 2) and the 245/225/8/12 split
in 103, 112 (statement 1), 120. Cut two of the five President items (e.g. 117 or 113) and turn the freed slots to Table 23.5 or
the nominated-member rationale.

**M2 - 23.2 repeats ideas.** Demerits of proportional representation (expensive, no by-elections, minority thinking, lost contact)
are tested in 202, 212 and 214 (statements 3 and 4): three items. "84th Amendment extended the ban by 25 years, upto 2026" is the
core of 207 (st 3), 213 (st 1 and 2 as the true/false pair) and 220 (B): three. "STV is used for the Rajya Sabha" is in 210
(st 3), 214 (st 1), 216 (st 3), 219 (st I): four. Trim to two each.

**M3 - 23.3 repeats ideas.** Who adjourns and who prorogues is tested in 311 (st 2), 312 (st 2), 319 (st II) and 320 (A, B):
four items. The emergency extension of the Lok Sabha (one year at a time, six-month limit) is in 303, 308 (st 3), 320 (C) and
316: four. "Rajya Sabha is continuing / not dissolved" is in 306, 313 (st 1), 318: three. Cut one item in each group.

**M4 - 23.4 repeats ideas.** The oath authority (EC's authorised person for the candidate, President for the member) is tested in
406 (st 3), 413 (st 3) and 420 (A, B): three items. "Preventive detention is not a disqualification" is in 405, 409 (st 2), 419
(st I); "two or more years' imprisonment" is in 405, 409, 419: both three-fold. The 2018 pay snapshot occupies four items
(414-417) for one source paragraph.

**M5 - 23.6 (and a little of 23.5) repeats ideas.** The government Chief Whip and the whip's responsibilities appear in 603, 614
(st 3, 4), 617 and 619: four items. The Leader of the Opposition: 605, 612, 613 (st 1-3), 620 (A). The 1977 statute fact is in
605, 612 (st 1) and 620 (A). In 23.5 the panel of chairpersons is tested twice with the same two facts: 514 (st 3, st 4) and
516 (st 1, st 4); that is at the limit but one of them is redundant.

**M6 - longest-key tell in direct items 403 and 605.** In 403 the key ("the President, who must obtain the opinion of the Election
Commission and act accordingly", 89 characters) is nearly twice the next option (50, 37, 17). In 605 the key ("the Salary and
Allowances of Leaders of Opposition in Parliament Act", 68) is the longest by far (39, 32, 26). 502 is mildly longest (46 vs 39).
A test-wise student scores without the fact. Shorten the key or lengthen the distractors (e.g. 403: "the Election Commission, which
decides on a reference from the President" would still be wrong because the President decides).

**M7 - Chief Whip claim (603, 614, 619): the book's wording is the only support, and current practice differs.** p.343 says the
Minister of Parliamentary Affairs (Lok Sabha) and the Minister of State for Parliamentary Affairs (Rajya Sabha) are the government's
Chief Whip. In the working of both Houses the government Chief Whip is normally a separate member and the Parliamentary Affairs
minister is not necessarily that person, so a well-read student can doubt the "present-tense" stem of 603 ("The Chief Whip of the
government party in the Rajya Sabha is"). There is no second option that is defensible (Leader of the House and Deputy Chairman are
wrong), so the key stands, but add "According to the chapter" to the stem of 603 and statement 3 of 614, and to Statement-I of 619.

**M8 - pay figures (414, 415, 416, 417) are the 2018 snapshot; Parliament has since raised them.** My recollection is that a
2025 notification (effective 1 April 2023) raised the MP salary to about Rs 1.24 lakh a month, the daily allowance to Rs 2,500, the
pension to Rs 31,000 and the additional pension to Rs 2,500. I could not confirm this from a file in the repo, so verify before
quoting. No statement is false because every one is pinned "in 2018" / "in 2010" / "was increased", and 415 statement 3 stays false
whichever later date is used. Risk is a student who learns "current salary Rs 1 lakh". Add to the 414 and 417 explanations a
sentence "(the book's 2018 figures; later revisions exist)", or fold the four items into two.

**M9 - delimitation freeze "upto 2026" (203, 204, 207, 213, 220; rule of 23.2).** The book says "extended ... upto year 2026" and
the items follow it. In law, Art 82 proviso freezes readjustment until the first census taken after the year 2026 is published
(that census is in progress now, 2026-27), so "the ban lasts upto 2026" is a simplification a student with the Article text may
query, especially in October 2026 when the freeze has not lapsed. 207 st 3 ("i.e., upto 2026") and 213 st 1 are safe as
book-worded; 204's wrong-answer note "2026 is the year until which the readjustment of seats is frozen" and 203's explanation
state it as plain law. Reword those two notes to "in the chapter's words" and add "until the first census after 2026" to the rule.

**M10 - loose page on 115.** Bihar's row (SC 6, ST none) is on pdf p.381, not 382; `pg` is [382, 383] and the explanation cites
"Table 23.5, p.382" for statement 1. Add 381 and fix the cite. Gujarat (p.382), Tamil Nadu and West Bengal (p.383) are right.

**M11 - Statement-I/II: the first item of every concept has key B ("both correct and II explains I"), and three are arguable.**
118, 218, 318, 418, 518, 618 all key B, while the second item varies (A or non-B). A student who always picks B on the first
one scores 6 of 6. Arguable: 118 (II is the doctrine, I is the consequence for one office; accepted), 318 (staggered retirement
produces continuity; accepted), 418 (II is only the restated principle behind I; a strict reader says "does not explain" = A).
No wrong key (I accept B in all six), but vary the keys across concepts and make the Statement-II of 418 a different
supporting fact if B is kept.

**M12 - near-copies of tagged PYQs.** 507 is a rewording of UPSC-POL-2024-474 (Speaker, removal resolution: not preside / may speak /
vote) with the same three-way test, with only the combinations changed. 309 re-uses the statement set of UPSC-POL-2020-392
(President summons at place he/she thinks fit; "Constitution provides for three sessions" as the false item). 111 statement 2 is
UPSC-POL-2000-062 (state with the most ST seats; answer MP). 504/505 echo UPSC-POL-2007-162 (first Speaker). These are fair
re-tests of a fact the exam has used, but 507 and 309 are close enough that the same student gets a duplicate; vary 507 (use
the Deputy Speaker's resolution) and 309 (drop the "three sessions" statement).

**M13 - 309 statement 4: "The Budget Session is usually held from February to May."** Book p.343 prints Feb to May and the item
follows it, so it is supported and no other option is defensible. In practice the Budget Session runs from late January to early
April, so a student with current knowledge may judge it false and find no matching option. Replace by a safer true statement
(e.g. "three sessions are usually held in a year: Budget, Monsoon and Winter" already in statement 3's false form) or add
"according to the chapter".

## LOW
**L1 - uniform shape.** All six concepts have the identical 5 direct / 9 which / 3 how-many / 2 Statement / 1 match shape. Skill
tags: recall 17.5% (21), two-step 74% (89), elimination 8% (10); trend 2020-26 is 42 / 36. Pure recall is underweight and two-step
is probably over-labelled (e.g. 304, 505 and 520 are pure table lookups tagged two-step in the pack only if so labelled).

**L2 - meta explanations in `w`.** Every how-many item (115-117, 215-217, 315-317, 415-417, 516-517, 615-617) and every Statement
item has `w` entries like "Counts 1 correct statement(s), but exactly 2 of the 3 are correct" or "Statement-II is correct". They
say nothing the student can learn; name the wrong statement instead.

**L3 - 603 wrong-option note for D** says the Deputy Chairman "holds no party whip's post (p.341)"; p.341 does not say that.

**L4 - `pg` lists a little short.** 405 lists only 332 but the dismissal-for-corruption option is on p.333; 420 lists 332, 334 but the
defection rule is on p.333; 215 cites 329 only for statement 3 and is right, but 304's note on the Ninth cites p.384 correctly
(no change needed there).

**L5 - 203 key text "1971 census"** where the book says "at the 1971 level". True in law (the 1971 census) but the book never
says "census" here; the 1961/1981 distractors are fine.

**L6 - 310 statement 3 sitting hours.** The book's "11 am to 1 pm and 2 pm to 6 pm" is the book's form; today both Houses
usually sit 11 am to 6 pm with a lunch interval. True as printed; no change needed except a "according to the chapter" tag.

**L7 - 23.6 idea sentence** ("stand outside or inside the Constitution in different ways") is vague and should name the
office/statute/convention contrast that the concept actually tests.

**L8 - currency notes for the second half's author.** Table 23.6 lists the Seventeenth Lok Sabha as "continuing" and Table 23.7
lists Om Birla "2019 - till date"; the Eighteenth Lok Sabha has sat since 2024 (Om Birla was re-elected Speaker). No item in
this half asserts the present Lok Sabha number or the present Speaker's term, but 23.7+ items on Table 23.6/23.7 must not.

## Per-concept checks (cold answer = key in all)
- **23.1 (101-120):** 6 two-statement trap items (106-114) rely on p.328 (elected members only vote; Ladakh has no RS seat;
  61st not 42nd; 104th did not extend the Anglo-Indian nomination; Senate has no nominated members). Each false statement
  is false in the book and in law. 118 and 119 relations: 118 B accepted (M11), 119 A (S-I false). 120 matches.
- **23.2 (201-220):** 207 st 1 (Delimitation Acts "1992" vs 2002), 209 st 3, 211 st 3, 212 st 1 (a third kind "cumulative vote" invented) are
  fair single-fact falsehoods. 202 (NOT-type) fine. 214 st 1 (territorial for LS, PR for RS) true under Art 80(4).
- **23.3 (301-320):** 311 st 4 (Britain: prorogation ends all bills) and 314 (bill pending in RS and not passed by LS survives) match
  Table 23.1 and the six-point list on p.345. 316 (fifth Lok Sabha: two one-year extensions, dissolved after 5 years 10 months
  6 days) matches footnote 5. 319 relation A (both correct, II not the reason) is sound.
- **23.4 (401-420):** 411 st 2 ("seat in the second House" vs the book's first House) is a fair swap and agrees with RPA s.69;
  412 st 1 (vacant on writing vs on acceptance) fair; 409 st 1 (six months vs two years) fair; 410 all four true (Tenth Schedule
  grounds; Kihoto Hollohan 1992). 413 st 3 is intentionally the sibling of 406 st 3 and is fair because the stem names the
  member's oath.
- **23.5 (501-520):** 503 (election petitions are not a Speaker power; the High Court hears them) is fair because the stem says
  "mentioned in the chapter". 508 st 4 (Speaker's regulating powers beyond court jurisdiction) agrees with Art 122(2). 513 st 2
  (Whyte/Sinha swap) fair. 515 and 520 match Table 23.7. 518 relation B accepted.
- **23.6 (601-620):** 602 fine, 607 st 3 (Speaker vs Chairman during removal) is the one real contrast and is correct, 611 st 4
  (minority leader vs majority leader) fair, 613 st 3 (one-tenth vs one-fifth) fair, 615 swap fair, 616 st 4 ("deputy PM" vs
  "alternative PM") fair.

Files: `/Users/satyanarayanareddy/claude projects /Prepplan/content/authoring/civil/polity/packs/lk23.json`,
`/Users/satyanarayanareddy/claude projects /Prepplan/content/reference/civil-services/laxmikanth/chapters/ch23.txt`.
