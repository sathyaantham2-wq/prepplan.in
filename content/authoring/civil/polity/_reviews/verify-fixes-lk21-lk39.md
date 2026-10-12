# Verify fixes: lk21 and lk39

Checker script: 0 problems on both packs. All edited items re-answered cold from ch21.txt / ch39.txt.

## PART 1: lk21 (HIGH 0, MEDIUM 2, LOW 1) verdict: pass

All 31 listed items (714 717 718 719 723 724 727 730 731 736 739 743 746 751 752 753 754 755 757 763 777 778 780 781 793 796 799, plus 701 704 765 784) re-answered cold; every key matches mine, one defensible answer each, pages cite the stated fact. 780 match: all three wrong options are single swaps, key A-2 B-1 C-3 D-4 correct. 724 (Parliament), 730 (91st Act: 15% ceiling and defection bar, PM included in count) and 751 (stem has no page number) are fine. 718/739/799 (both correct, II does not explain I) are defensible: no causal link in the chapter or in law.

Apostrophe regex scan over every string (both possessives and plurals, doubled quotes, JSON escapes): no broken quotes, no doubled apostrophes, no it's/its error, no "ministers/minister's" error. Two missed restorations:
- MEDIUM, LK-21.1 concept `rule`: "the President's satisfaction was held to be the councils (p.316)" should be "the council's".
- MEDIUM, CS-POL-ch21-767 `e`: "determines the councils functions" should be "the council's functions". Explanation only; key unaffected.
- LOW, 755 statement 3 ("President is bound to accept this advice even from a council that has lost confidence"): false per the chapter (p.318 "may not oblige"), but real-law is a convention (Art 74 advice is binding), so the falsifier leans on the chapter. Acceptable for a Laxmikanth pack; no change required.

Concept rules/ideas: accurate to pages. Grammar nit in 21.5 rule: "its demerits lowered cabinet authority and bypassing the legal process".

## PART 2: lk39 (HIGH 0, MEDIUM 0, LOW 0) verdict: pass

Re-answered 047, 054, 055, 060, 071, 079, 104 plus the LK-39.4 rule.
- 047: 243D reservation (true), 243E is duration, 243F is disqualifications (Table 39.2, p.566). Key "1 only" correct.
- 054: compulsory items 6 (age 21) and 10 (SEC) on pp.559-560; Gram Sabha powers is voluntary B1 (p.560). Key "1 and 3 only" correct.
- 055: statements 1-3 true (pp.555-556, 83rd Act 2000 for Arunachal), 4 false. Key "three" correct.
- 060: key A-4 B-2 C-3 D-1 correct (p.556); each wrong option is a single swap. Art 334 period eighty years till 2030 is correct in law (104th Amendment).
- 071: voluntary items B8, B9, B11 true; funds-for-moneys is voluntary B12 (p.560), so statement 4 false. Key correct.
- 079: Eleventh Schedule deals with Art 243-G and has 29 items (p.554); both correct, II does not explain I. Correct.
- 104: tied funds implication, p.565 item 3. Correct.
- LK-39.4 rule matches p.557: governor constitutes SFC after every five years, places recommendations with action taken report, legislature may provide for composition.

Apostrophe scan on lk39: no damage found (states', Panchayats', people's, Second ARC's etc. all correct).
