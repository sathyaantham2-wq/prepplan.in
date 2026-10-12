# LK-07 first half (LK-7.1 to 7.6, ids 101-620), second review after rebuild

Pack: `content/authoring/civil/polity/packs/lk07.json`, 120 questions. Chapter: `content/reference/civil-services/laxmikanth/chapters/ch07.txt`.
Verdict: **FAIL**. HIGH 2, MEDIUM 7, LOW 7.

## Method and checks passed
- Cold re-answer of all 120 from the chapter text before reading any key: 120 of 120 match the key. No wrong key and no second defensible option except where a HIGH below says so.
- `python3 scripts/civil-services/check-civil-pack.py content/authoring/civil/polity/packs/lk07.json` returned `0 problems`.
- Scripted checks over all 120: every `which` and `howmany` explanation marks exactly the statements the key implies (no mismatch). Every reshaped `w` note names the correct option, and its "includes/leaves out statement N" claim is true for that option. The `w` order matches `o` order.
- Option shape: `a` is `o[0]` in all 120 (240 counted over the whole pack), as the loader expects.
- Falsifiers checked against real law as well as the chapter: friendly aliens and the vote or Article 16/19; Article 15 and residence; Art 35-A inserted by a presidential order under Art 370 (not Art 368); Public Employment Act 1957 (non-Gazetted, four states, expired 1974); Art 7 returnees; Art 8 versus Art 7 versus Art 10 in Table 7.2; 2003 versus 2005 versus 2015 amendments; 1 July 1987, 3 Dec 2004 and 10 Dec 1992 birth/descent brackets; 12 months versus 7 years for registration; 11 of 14 years for naturalisation, 5 for the 2019 concession; the Eighth Schedule's 22 languages (still 22). No falsifier rests on book silence alone.
- Facts that changed after the exam years: none affects a key. CAA 2019 Rules (March 2024) did not change the 5-year figure. The Immigration and Foreigners Act 2025 superseded the Passport (Entry into India) Act 1920 and the Foreigners Act 1946 that the chapter names, but no item tests them.
- New Statement-I/II pairs: 119, 219, 319, 418, 419, 519, 619 now each have a clearly false statement (119 II "friendly aliens vote"; 418 II "loss limited to Act-acquired citizenship"; 419 I "Constitution allows dual citizenship"; 519 I "diplomats' children born before 1987"; 619 II "7 years for OCI"). These are sound. The explain-key items are 118, 218, 318, 518, 618; see H2 and M6.
- Fix claims verified: 214 falsifier now "each state may confer its own state citizenship" (done, clearly false); 201 now asks which federal system (USA only, no Australia anywhere in the pack); 220 match entry reworded and fine; "All three" (516) and "All four" (617) keys added; Statement-I/II pairs changed. **Not done as claimed: 411 and 117 (see H1 and M1).**

## HIGH

**H1 - CS-POL-ch07-411 (7.4) statement 1 still has the ambiguous wording the fix pass said it removed.** The pack text is "persons who migrated to Pakistan and **returned after 26 January 1950** is decided under the Citizenship Act". The claimed fix ("migrated to Pakistan after 26 January 1950 and later returned") is not in the pack. Read as written, it covers a person who migrated in 1948 and returned in 1951 under a resettlement permit. Article 7 deals with such returnees, so a well-read aspirant can call statement 1 false in law. Then "2 only" (option 3) is a defensible answer and the key "1 and 2 only" is not safe. The chapter's footnote 5 speaks of persons who *migrated* after 26 January 1950, and the explanation cites that footnote. Reword statement 1 to "migrated to Pakistan after 26 January 1950 and later returned".

**H2 - CS-POL-ch07-318 (7.3) key "Both correct and II explains I" is contestable, and the explanation argues a different link.** I: the Constitution does not deal with acquisition or loss after commencement. II: the Constitution empowers Parliament to legislate on citizenship. II is the consequence or companion of I, not its reason. Causation, if any, runs the other way. A well-read candidate can defend option 3 "both correct but II does not explain I". The explanation says the Constitution left it to Parliament "which accounts for the Citizenship Act of 1955", which explains the Act, not Statement I. Replace the item with a one-false-statement pair, or make II a genuine reason for I.

## MEDIUM

**M1 - CS-POL-ch07-117 (7.1) statement 1 still says "is not covered by this list".** The stem shows no list. The fix pass said "this list" was removed; it was not. The statement is false only because of a phrase with no antecedent. Rewrite as "Only constitutional heads such as the President and Governor are among the offices for which citizens are eligible and aliens are not." (The key "Only two" is right.)

**M2 - the lone all-true three-statement key remains in six items.** In 108, 208, 307, 409, 508 and 609 the key `1, 2 and 3` is the only three-element option (the others are one or two elements). A student scores by option shape without knowing a fact. This is review-1 M1; the fix pass did not change it. Make the all-true item carry two three-element options, or turn some into 4-statement items where the key is `1, 2 and 4 only`, and so on.

**M3 - the longest-key tell is reduced but not gone.** In 30 direct items the key is strictly the longest option in about 16 (105, 203, 205, 301, 302, 403, 404, 501, 502, 503, 601, 602, 603, 605 and others). In 7.4 to 7.6 it is the longest or tied in 12 of 15. Ratios over 1.3 remain in 105 (88 against 64), 205 (95 against 72) and 603 (116 against 85). Pad the short distractors in those three and make some keys the shortest.

**M4 - repetition still above 3 per idea (trimmed from review 1, not to the target).**
- 7.1: enemy aliens lesser rights / Art 22 in 101, 103, 106, 113, 115, 116, 119 (7); aliens denied the vote or contest in 109, 111, 114, 118, 119 and others (6+); naturalised citizen as President in 102, 108, 117, 120 (4).
- 7.2: Art 16 residence and the 1957 Act in 202, 207, 210, 213, 216, 217, 220 (7); Art 15 and residence in 208, 210, 216, 218 (4); Art 35-A / J&K in 204, 209, 214, 217, 220 (5); USA double citizenship in 201, 206, 211, 215, 220 (5). The tribal limit is down to 203, 208, 214 (3).
- 7.3: the six-months condition in 302, 303, 313, 315, 320 (5); the 19 July 1948 split in 302, 309, 315, 319, 320 (5); Parliament's power in 306, 311, 312, 314, 317, 318 (6).
- 7.4: Commonwealth repeal in 402, 406, 412, 417 (4, down from 8); "five ways" in 407, 408, 414, 416, 418 (5).
- 7.5 and 7.6 repeat date brackets and the OCI / 12-month / 7-year figures 5 to 8 times, which is partly unavoidable in those concepts.
Replace two or three items in 7.1 and 7.2 with unused facts. Unused: 7.1 duties and the exceptions list; 7.2 the Parliament-versus-state-legislature point (210 st 4 is the only one); 7.3 footnote 4 (permit system), Art 6 versus 7 wording.

**M5 - CS-POL-ch07-118 (7.1) the "explains" link is loose.** "Citizens are full members who enjoy all civil and political rights" does not say aliens lack the vote. It is defensible but weaker than 218, 518 and 618. Consider making II "The Constitution confers the right to vote on citizens".

**M6 - the explain-key pairs are nearly always "both correct and II explains" (118, 218, 318, 518, 618 are five of the twelve).** A candidate who sees two on-topic statements learns to pick "explains". Make one or two of the five "both correct but II does not explain".

**M7 - CS-POL-ch07-407 explanation cites p.113 for "marriage figures only as a ground for registration".** The registration list (including marriage) is on p.114. `pg` includes 114, so only the text is loose. 7.1 `pg` for 110-only items is fine.

## LOW
- L1 214 statement 1 is still a one-word qualifier swap (scheduled caste for scheduled tribe). The item has three other substantive falsifiers, so the key stands.
- L2 508 st 3, 511 st 3 and 504 e say children of enemy aliens cannot acquire birth citizenship. The chapter says it, but s.3(2)(b) of the Act limits it to births in enemy-occupied territory. The true statement is overbroad in real law; no alternate option exists, so no second answer. Consider "foreign diplomats" only.
- L3 404 key says termination arises "as the Constitution denies citizenship". Art 9 as drafted operated at commencement; post-1950 the basis is s.9 of the Act. The stem says "according to the chapter", so it is defensible; "as the Act provides automatic termination" would be cleaner.
- L4 610 st 1 (eleven years in fourteen) is true only for ordinary applicants; the six communities get five years. Add "ordinary" to the statement.
- L5 Boilerplate `w` notes: in 119, 219, 319, 418, 419 and 519 two or three wrong options carry identical text; in `howmany` items "the correct statements are 3, which is only one" reads as a count. The "Fails because it leaves out statement N ... (p.110 item 6.)" notes in 108, 208, 307, 409, 508, 609 have stray full stops. Not wrong.
- L6 "According to the chapter" / "table of Articles" still in the stems of 101, 103-105, 201, 205, 303-305, 312, 404, 405, 413, 501, 503, 505 (real papers do not name the book). `Both statements correct and II explains` is a house style, fine.
- L7 Near-echoes of tagged PYQs only: UPSC-POL-2021-411 (citizen by birth only for head of state) echoed by 102, 120; UPSC-POL-1999-056 (British citizen and Art 19) by 104. Scenarios and options differ; not duplicates.

## Format mix
Checker passes the 2020-26 mix per concept (direct 5, which 9 to 10, howmany 3 to 4, stmt12 2, match 1). Key text and option sets do not repeat beyond the caps. Every concept has an all-statements-correct `which` item (which is also M2).

## Result
HIGH 2 (CS-POL-ch07-411, CS-POL-ch07-318), MEDIUM 7, LOW 7. Verdict: FAIL until 411 and 318 are fixed; 117 should be fixed in the same pass because the fixer reported it done.
