# verify-lk42 - Laxmikanth ch42 'Scheduled and Tribal Areas' (Mode N)

Source: `chapters/ch42.txt`, PDF pages 594-597 (p.598 is the next part's contents page). 5 concepts x 20 = 100 items.

## Concepts
- LK-42.1 Scheduled Areas (Fifth Schedule): purpose, declaration, criteria, ten states, Dhebar/Bhuria commissions, Articles 244/244A/339 (pp.594-595, 597)
- LK-42.2 Executive power, Tribes Advisory Council, Governor's directions and regulations (pp.594-595)
- LK-42.3 Sixth Schedule: rationale, autonomous districts/regions, council composition and term, commission, Table 42.1 (pp.595-597)
- LK-42.4 Powers of district and regional councils, footnote 4 on who directs non-application of Acts (pp.596-597)
- LK-42.5 Fifth versus Sixth Schedule comparison (pp.594-597)

## Weighting toward tagged PYQs (7, 6 since 2013)
Fifth Schedule features dominate (2008, 2019, 2022, 2023, 2025 all Fifth; 2015 and 2026 compare the two). Hence concepts 1, 2 and 5 carry the PYQ ideas (who declares, annual report to President not CM, state executive power not lost, Union cannot take over, land-transfer regulations, Fifth versus Sixth mix-up of the four north-eastern states). No tagged item copied.

## IN scope
Everything on pp.594-597 including Table 42.1, Table 42.2 and footnotes 1 and 4.

## OUT of scope (not in the chapter, no question built on them)
- Paragraph numbers of the Schedules, Samatha judgement (2019 PYQ answer rests on it; the chapter supports only the land-transfer regulation power), PESA, Forest Rights Act.
- Tribal income-tax exemption and Panchayat seat reservation (2026 PYQ statements 2 and 3).
- Later changes: Bodoland Territorial Council size, renaming of North Cachar Hills (Dima Hasao) and Lai (Pawi). Table names are used exactly as the chapter prints them.
- Contents page of Part VII on p.598.

## Facts where the book may be dated or loosely worded (flagged to reviewer)
1. Tribes Advisory Council "20 members": the book gives 20; the constitutional text is "not more than twenty". Items state it "according to the chapter"; falsifiers use 10, 12, 30.
2. District council "30 members, four nominated": true as a general rule in the chapter; the Bodoland Territorial Council differs. No item claims every council has exactly 30; the comparison items say "a district council ... according to the chapter".
3. Ten Fifth Schedule states (footnote 1): current as listed. Falsifiers use Kerala, Mizoram (a Sixth Schedule state), Karnataka, Punjab.
4. Footnote 4 (who directs non-application of Acts): Assam Governor for both; Meghalaya, Tripura, Mizoram President for Parliament's Acts and Governor for the state's Acts. Used in concept 4 only (and one comparison item).
5. "Every ten years" falsifier (item 17): the chapter and Article 339 make a commission compulsory after ten years of commencement; later commissions are at the President's discretion.
6. A few falsifiers rest on real law where the chapter is silent (Parliament's approval not needed for a Governor's direction; no Presidential approval to rename an autonomous district; village courts try suits between tribes only). They are false in real law as well.

## Known limitation
The chapter is four pages; 100 items cannot avoid re-using a fact. Facts such as the President's assent to regulations, the Governor's annual report, council composition and the Table 42.1 areas appear in up to three items of a concept, each from a different angle (direct, statement, Statement-I/II or match). Please review for over-use.

## Checks run
Validator `check-civil-pack.py`: 0 problems; `reshape-options.py --write` run last and re-validated (0 problems). 100 ids unique. Statement truth flags were kept beside each statement during building and re-read against the saved JSON (about 60 statement items re-answered cold after reshape; all matched).

## Round 2 fixes (review lk42.md)
- 099 rewritten (Tribes Advisory Council vs district/regional councils); 034/036 now use 25 members as the falsifier (the Constitution caps the council at twenty); council-size and self-rule claims carry 'according to the chapter'; LK-42.3 rule hedged; 033 and 039 re-angled away from UPSC-POL-2025-477; 077 and 079 replaced (footnote-4 cluster cut to 071 and 093); 037 and 075 swapped one repeated fact; long keys in 045, 063, 081, 082, 086 shortened and distractors lengthened; 'Pawi' removed from scope_out.
- Repetition: the chapter has only four pages, so the President's assent to Fifth Schedule regulations (c2: 4 items), the Governor's assent to council laws and the council-size and Table 42.1 facts still recur, each from a different angle. No further distinct facts exist in ch42.
