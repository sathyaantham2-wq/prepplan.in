# Review: aks20b (AKS-20.7 .. AKS-20.10, 80 questions)

Reviewer pass: every question answered against Laxmikanth ch15, 16, 47, 48, 50, 51, 72, 88 (and ch43-46 for tenure/removal) before reading the key, then keys/explanations/w lines/fi/pages checked.
Tools run: check-civil-pack (0 problems), aks-coverage --chapter 20 (0 uncovered, 11 skipped across 20a+20b), dup-check.

Verdict: PASS (0 HIGH, 11 MEDIUM, 9 LOW). Every key recomputed correct; exactly one defensible option in all 80. Fix the MEDIUMs before loading if time allows.

## HIGH
None.

## MEDIUM
- M1 aks20b-006 stmt 4 ("non-compliance with its summons attracts consequences similar to civil-court proceedings"): notes-only (A20-593), not in Laxmikanth or the Article text, and vague. It decides the key (1,3,4; if a solver rejects it, "1 and 3 only" becomes right). Replace with a Laxmikanth power (e.g. "may requisition any public record from any court or office" is already stmt 3; use "any other matter the President may determine").
- M2 aks20b-065 stem premise ("membership comes from holding an office, so no authority appoints them as a body"): notes' claim, not Laxmikanth. Laxmikanth says six Cabinet Ministers of the ISC are "nominated by the Prime Minister" and the GST Council States may nominate "any other Minister", so the premise is contestable. Only one option is still defensible, but re-word ("composed of Ministers who sit as such, with no President/Governor warrant").
- M3 aks20b-072 stmt 1 relies on the same notes-only premise as M2 and is the stmt that makes the key (1 and 3). Same fix.
- M4 Repetition cap (2 per idea per concept) broken in AKS-20.10: article-number recall appears in 61, 66, 67, 74, 75, 79, 80 (7 of 20; A20-726 is in fi of 7). Merge/replace three of them (e.g. 66, 74, 79) with Laxmikanth facts the notes omit (CAG oath, Art 338 cl.10 Anglo-Indians, FC composition, Art 324 cl.5).
- M5 Repetition cap also exceeded elsewhere: 20.7 NCBC "civil-court powers but not a court" in 005, 006(st4), 017 (3x); 20.8 ISC "set up 1990 by Presidential Order on Sarkaria" in 023, 040, 059 (3x) and "Home Minister common Chairman / CM Vice-Chairman rotation" in 024, 033, 037 (3x). Re-angle one each.
- M6 Near-duplicates of other packs (dup-check >= 0.7): 008 (0.84, 0.70) vs aks20a NCBC 105th Amendment and reports lines; 069 (0.75) vs aks20a 6y/65 tenure; 063 (0.75) vs aks20a 2023 Act committee; 060 option D (0.71) vs lk15-708 West Bengal memorandum. Re-angle (e.g. 008 stmt 4 as a Statement-I/II on why States may keep their own OBC lists; 063 as a "which one is NOT on the committee").
- M7 aks20b-074 stem says "as arranged in the notes" (brief forbids naming the notes in a stem) and tests numeric ordering of article numbers (reading-trick flavour). Rewrite as direct recall of two Articles or drop.
- M8 Weak distractors (absurd on sight): 002 opt 3 (HQ merged with Ministry HQ at Kolkata) and opt 2 (HQ to Belgaum); 043 opt 2 (Inter-State Council "at its first meeting" appointed a 1969 committee, 21 years before it existed); 045 opts 2-4 ("Centralised federalism", "Fiscal unitarism"); 023 opt 3. They can be eliminated without knowledge. Use real bodies (e.g. 043: Sarkaria-era Union Home Ministry / First ARC; 045: "asymmetric", "competitive" federalism are ok but add "Punchhi's key was cooperative; Sarkaria's was strong Centre").
- M9 aks20b-017 and 037: three of four statements are absurd extremes ("a court decree", "fixed term of five years nominated by PM", "created by the Commission itself in 1955"); the howmany adds no discrimination. Make false lines near-misses.
- M10 aks20b-050 (all-correct, five soft "reasons for reform" facts) and aks20b-066 (all-correct, four article numbers): answerable by guessing "all four"; no minute-fact discrimination. Make one statement a real near-miss (e.g. Art 355 vs 356; 280 vs 279A) while keeping another all-correct item in the concept (13, 26, 50, 66 are all-correct; four in 80 is above the typical share).
- M11 aks20b-044 distractors 1 and 2 are genuine Sarkaria recommendations (NEDC rename; Constitution prescribing CM consultation for Governor, items 6 and 10 on Laxmikanth p.239). The stem ("described as the most important recommendation implemented", p.240) saves it, but Laxmikanth never says these two were not among the 180 implemented; the w lines assert "not implemented" as fact. Real law supports it (NDC replaced by NITI 2015; no Constitution amendment), so the key is safe; reword w to cite that, or swap opts for unrelated items.

## LOW
- L1 011 explanation: says the 1963 Act "made Hindi the Official Language of the Union"; that is Art 343. The Act kept English alongside Hindi beyond 1965. Key unaffected.
- L2 011 stmt 2 (Kothari link) is defensible but loose ("associated with"); formula originates in the 1961 CM conference and the 1964-66 Education Commission recommended the modified form. Fine as worded; keep "associated".
- L3 Direct items: key is the longest option in 007? (005, 022, 025, 042, 045, 062, 063, 064) - 8 of 20 across the pack, and 3 of 5 in 20.10 (062-064); acceptable overall but shorten keys in 063/064.
- L4 Tell words in some false statements: 008 st1 "any number of times", 031 st3 "every question", 055 st2 "all the residuary powers" (while a true stmt 053-2 uses "only ... every"). Mild.
- L5 Empty `fi`: 008 and 014 (Laxmikanth additions). Allowed (max 6 per concept) but set `fi:[]` is fine only if the pack says so; no action needed.
- L6 fi/page mismatches: 022 fi has A20-636 (279A(4)) not tested by the stem (tested in 027); 025 pg omits 215 (A20-645); 057/059/060 list extra notes pages.
- L7 027 stmt 3 swaps 279A(4) to "269A(4)": a one-digit near-miss; fair but borderline; keep because 022 teaches the 269A point.
- L8 019: statement II says "at least 1500 to 2000 years"; the official wording is "1500-2000 years". Use the official phrase. Skipped A20-612 (criteria "2006") reason `verify-conflict` is legitimate (norms were set 2004, revised 2005; official sources differ) though the inventory flag said ok.
- L9 031 stmt 1 ("second meeting in 1996") is notes-only; Laxmikanth says only "set up in 1996". Defensible; consider "in 1996".

## Per-question key check (all correct)
7.1: 001-005 ok. 006 ok (see M1). 007 ok (Art 342-A gives power to President; Repeal Act 2018). 008 ok (3 yrs/2 terms, cl.7 of 338B to State government, 105th Am). 009 ok (350A not 351). 010 ok. 011 ok (LK p.856 and fn 7). 012 ok (order 15 Sep 2016; CBIC non-voting). 013 ok (all four). 014 ok (Part XVII, state-wise). 015 ok (3). 016 ok (2: five-year compensation; 279A(11) no invalidity). 017 ok. 018 ok. 019 ok. 020 ok.
7.2: 021 ok. 022 ok (269A). 023 ok. 024 ok. 025 ok. 026 ok. 027 ok (2,4). 028 ok (1,3,4). 029 ok. 030 ok (1,3). 031 ok (1,4; nine CMs). 032 ok (1 only). 033 ok. 034 ok (Central ZC Prayagraj; Western Mumbai; NEC Act 1971, est. 1972). 035 ok. 036 ok (3). 037 ok (1). 038 ok. 039 ok (arithmetic: 1/3 and 2/3 both below 3/4). 040 ok.
7.3: 041-045 ok. 046 ok. 047 ok (Western includes merged DNH&DD). 048 ok (8 members, Shillong, 2002 regional planning body). 049 ok. 050 ok. 051 ok. 052 ok (1 only; FC permanent; PC to statutory body; omit "pleasure" provision). 053 ok. 054 ok (310+; 247 is Sarkaria). 055 ok (1). 056 ok (3; p.243 item 26). 057 ok (2). 058 ok. 059 ok. 060 ok (Rajamannar: PC statutory; Sarkaria: corporation tax; Punchhi: localised emergency; WB 1977: union to federal).
7.4: 061-064 ok. 065 ok (see M2). 066 ok. 067 ok. 068 ok. 069 ok (SPSC 62). 070 ok (SC advice binding per LK ch44 p.45; 2023 Act). 071 ok. 072 ok (see M3). 073 ok. 074 ok. 075 ok (2). 076 ok (3). 077 ok (1; insolvency/infirmity no inquiry). 078 ok. 079 ok. 080 ok.

## Facts changed or time-sensitive (checked)
Western Zonal Council wording uses merged UT (2020) - correct. J&K/Ladakh as UTs - correct. 2023 CEC/EC Act committee (CJI replaced) - correct. CAG/EC/UPSC six years or 65; SPSC 62 (41st Am 1976) - correct. NCBC Rules 2018 not tested as 2004 (author avoided the notes' error). SOLM HQ New Delhi (2015) used, not Allahabad. NEC Act 1971 (est. 1972) used. Rajamannar: Tamil Nadu Government (DMK), All-India Services abolition per Laxmikanth. ISC treated as contemplated by Art 263, not constitutional. GST petroleum tested as "date", alcohol avoided. Classical language list and 2024 additions correct (Oct 2024).

## Format mix (vs 2020-26 column of the trends doc)
Per concept: 5 direct, 9 which, 3 howmany, 2 stmt12, 1 match. Pack: direct 25% (trend 26%), consider-statements 45% (48%), how-many 15% (12%), Statement-I/II 10% (6%), match 5%. Within tolerance; Statement-I/II is slightly high but the brief sets it. Which-key overlap tell: 12 of 36 (33%), no strong pattern. Each concept has at least one all-correct and one single-correct statement item (13/14, 26/32, 50/52, 66/74).

## Coverage
aks-coverage --chapter 20: 400 facts, 389 covered, 11 skipped (chapter), 0 uncovered. aks20b skips: A20-612 (criteria year 2006: official sources give 2004/2005, legitimate verify-conflict) and A20-720 ("removal at the President's pleasure": contradicted by LK p.629 and the 3-year Rules; legitimate verify-conflict). 2 of 163 facts = 1.2%, under the 12% limit. Thin coverage worth noting: A20-660..663 (Standing Committee functions) share one true statement in 031; A20-683..687 share four statements in 050.

## Verify-flagged facts in corrected form (all correct)
A20-580 (not tested as 2004), A20-597 (342-A to President; 007), A20-600/622 (HQ New Delhi 2015; 002, 018), A20-610/611 (English, Hindi, regional language; 011), A20-630 (petroleum date; 027), A20-667 (Act 1971, est. 1972; 034), A20-670 (Administrators; 033), A20-688 (Tamil Nadu Government DMK; 043, 051), A20-693 (abolish All-India Services; 051), A20-713 (not constitutional; 059, 036), A20-717 (Art 280 tenure by order; 073, 079).
