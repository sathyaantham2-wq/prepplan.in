# Final verification: lk01.json (Laxmikanth ch01, 120 items)

Method: all 120 items checked one by one against ch01.txt (pdf pages 25-38), stem and statements first, then the key, then every option for a second defensible answer. Falsifier statements were checked to be false in the text, not just unmentioned. Page tags were spot-checked against the cited facts. Near-duplicates were machine-compared with lk01b.json (statement-level similarity above 0.85). The pack was not edited.

Verdict: **pass** (0 HIGH). 3 MEDIUM findings, 6 LOW findings.

## Result summary
- Keys: all 120 correct against the text. No item has two defensible answers.
- Falsifiers: every false statement is contradicted by the book (e.g. 210 s1 same-procedure fact, 217 s2 "Regulations" belongs to pre-1833 laws, 310 s1 years 1862/1886/1897, 412 s2/s4, 515, 607 s1, 617 s3 Royal Assent 18 July via fn 9).
- Match items (120, 220, 319, 420, 520, 620): each has exactly one fully correct option.
- Statement-I/II (12 items): keys fit the text. 118 and 518 and 618 are explained-by in the book itself ("as", "accepted the Poona Pact and modified", "as the princely states did not join"); 317, 419 are both-true-not-causal; 119, 318, 519, 619 are clean falsifier cases. 218 is the one doubtful (see M1).
- Format mix: direct 30 (25%), which 54 (45%), how-many 18 (15%), Statement-I/II 12 (10%), match 6 (5%). 2020-26 column is 26/48/12/6/0 (case study 3). Close; Statement-I/II is 4 points high, match is not a UPSC Prelims-polity format in the doc. Not a defect.
- Every option set has 4 unique options, 3 `w` notes, unique ids. Answer is stored at index 0 in all 120 items; relies on the loader shuffling (CLAUDE.md says it does).
- Facts that may have changed after the exam year: none; this is historical (pre-1950) content.

## HIGH
None.

## MEDIUM
**M1. 218 (Statement-I/II causality is arguable).** Statement-I "final step towards centralisation" and Statement-II "ended the Company as a commercial body" are keyed "both correct, II does not explain I". The book never links the two; a candidate can argue that becoming a purely administrative body is part of the centralisation. Key is probably the better reading, but it is not unambiguous. Fix: replace II with the provision the book ties to centralisation (Governor-General of India given exclusive legislative powers over all British India), keyed "explains", or keep II and accept a small risk. (118 and 518 are fine; the book states the causal link.)

**M2. Repetition above the cap of 2 per idea per concept.**
- Concept 1.1: "Board of Control was NOT created by the Regulating Act" falsifier in 102, 112 s1, 115 s1. Also 108 s3 / 111 s3 / 115 s3 / 120 C repeat the Court of Directors (commercial) vs Board of Control (political) split (4 uses), and 111 s3 is near-verbatim 108 s3. "British possessions in India" is in 104, 111 s4, 116 s3.
- Concept 1.3: Council of India "15-member advisory body" appears in 302, 306 s3, 314 s2, 319 B (4). Legislative powers restored to Bombay and Madras: 303 opt, 309 s2, 310 s4, 315 s1 (4). Council budget discussion: 303, 311, 317 II (3). Portfolio system: 303, 309 s3, 316 s4 (3).
- Concept 1.4: 1917 declaration in 405, 414 (414 s1 restates 405), 416 s1 (3). Separate electorate for Muslims in 407 s2/s4, 415 s1, 418 (4).
- Concept 1.5: Ambedkar as depressed-class leader/Poona Pact party in 504, 511 s1, 513 s3, 517 s3 (4; 513 s3 and 517 s3 are the same sentence). Gandhi's fast in 513 s2, 517 s2, 519 II (3). Communal Award date/extent and Simon report date in 503, 510, 515 s1, 516 s1/s3, 514 s3 (heavy).
- Concept 1.2: overriding power extended to later Governors-General in 206 s1, 215 s1, 220 A (3); "first time" separation of legislative/executive functions in 210 s2, 213 s2, 220 D, 202 opt (4).
Fix by swapping the second statement in 111, 112, 115, 314, 316, 513, 517, 414 for untested facts (e.g. 1892 Central Council nomination bodies, Narendra Mandal membership 120 = 108 + 12, 1935 Federal Railway Authority, Mountbatten sworn-in Nehru, Interim Government table).

**M3. Near-duplicates against lk01b.json (same statement, same truth value, different item).** Resolve in one of the two packs (lk01b is being verified by someone else, so only listed here).
- 616 s3 = lk01b 817 (identical sentence).
- 617 s2 "Act came into force on 15 August 1947" = lk01b 808, 819, 908, 008 (identical); 617 s3 (Royal Assent 4 July, false) = lk01b 109, 818, 911, 012 (same idea, 4 July or 18 July).
- 614 s2 (princely states free to join or remain independent) = lk01b 810, 915, 017 (same truth).
- 401 and 419 (16 to 60) = lk01b 309.
- 407 s1 (Sinha, Law Member) = lk01b 317.
- 606 s3 / 608 s1 / 610 s2 / 615 s1 and s3 = lk01b 706 / 713 / 715 / 706.
- 613 s1, s3 = lk01b 917, 001, 913, 019.
- 509 s3 and 513 s4 (composition based on modified Communal Award) = lk01b 718.
- 601 stem = lk01b 701 stem (same "NOT a provision of the 1935 Act" question; also 402 vs 701 similar).
- 116 s2 (Pitt introduced the Bill) = lk01b 311; 211/216 Macaulay Committee (1854/1833) = lk01b 307 (1861); 307/314 Canning/Dalhousie first Viceroy = lk01b 315; 316 s3 Budget 1860 = lk01b 315 (1858).

## LOW
- L1. 202 pg [28,29]: the "final step towards centralisation" line is on p.27; p.29 supports only a distractor. Use [27,28].
- L2. 417 pg [31,33,38] omits p.32, where the 1926 Central Public Service Commission (statement 2) is stated; 604 pg [34,35] needs only p.35.
- L3. 604: the Viceroy's office was also abolished by the 1947 Act; the stem's clause "functions transferred to the Secretary of State for Commonwealth Affairs" saves it, but a hurried reader may flag option 1. Consider rewording the stem to exclude the Viceroy.
- L4. 507 stem says "recommendations" but ends "Which of the statements given above"; align wording.
- L5. Hedged, longest correct options are a mild tell in direct items 203, 305, 403, 505, 601, 602 (correct is the longest), and 305/504 use "limited, indirect"/"retention" phrasing the distractors lack. Harmless for recall items, but trim 305.
- L6. 118 and 618 are textbook "explains" items; the Statement-I/II family is 10% against 6% in 2020-26 and all 12 are historical-sequence facts. Acceptable.
- (Not defects, noted) 315 s2 hinges on one digit (1937 vs 1947) and 510 s1 on a single swapped word (Parsis for Europeans); both test text knowledge, fair.

Counts: HIGH 0, MEDIUM 3 (218; repetition clusters; lk01b duplicates), LOW 6.
