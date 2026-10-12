# Verify: old file content/authoring/civils/own_fr.json (chapter II1, concepts POL-1.1 .. POL-1.6) - rewritten 2026-10-12

This note replaces the earlier 2026-10-10 note (which kept only POL-1.6 and recommended retiring the rest). Owner decision
2026-10-12: keep all six concepts and make their questions civil-services standard. New pack: `packs/ncert_own_fr.json`
(6 concepts x 20 = 120 questions; same subject, source and chapter block as the old file; same concept codes and names; concept
`idea`, `rule` and `example` kept from the old file after checking them against Laxmikanth).

## Support decision per concept
All six concepts are taught in depth by Laxmikanth, so none is UNSUPPORTED.

| Concept | Laxmikanth source (pdf pages) |
|---|---|
| POL-1.1 What fundamental rights are | Ch.8 pp.127-132 (features, Tables 8.1-8.2, Articles 12-13), pp.164-165 (property), pp.166-168 (criticism, significance), p.168 (rights outside Part III) |
| POL-1.2 Equality before the law | Ch.8 pp.132-141 (Articles 14-18, Tables 8.3-8.4, Mandal and after, EWS, awards) |
| POL-1.3 Freedoms and protection of life and liberty | Ch.8 pp.142-153 (Articles 19-22, Tables 8.5-8.6, preventive detention) |
| POL-1.4 Exploitation, religion, minorities | Ch.8 pp.153-158 (Articles 23-30) |
| POL-1.5 Constitutional remedies and writs | Ch.8 pp.158-161 (Articles 32, 226, the five writs); Ch.17 pp.262-263 (Article 359 order) |
| POL-1.6 Limits, emergencies, landmark ideas | Ch.8 pp.161-166 (Articles 33-35, 31A-31C, martial law, Ninth Schedule); Ch.12 pp.198-201 (Shankari Prasad to Waman Rao, Table 12.1); Ch.17 pp.262-264 (Articles 358-359 and the 44th Amendment) |

## Duplication with existing packs
The chapter is already tested at statement level in about 600 items (lk08, aks05a, aks05b, plus ncert_polity1-5, lk09, lk11, lk17).
Every statement, stem and match row of the new pack was re-worded or re-angled (scenario items, comparisons, reversed
truths, new pairings: Article 13 'law' and custom, citizens-versus-persons, Article 31C as an exception to Article 14, Art. 33
by a state law, Article 34 indemnity, Article 358/359 comparison, Mandal and its aftermath) until
`dup-check.py --threshold 0.7` reports 0 near-duplicate lines. At threshold 0.6 some lines still share vocabulary with lk08/aks05
(same Article numbers, case names and amendment numbers); none restates an existing statement. The earlier deferred pack
`packs-deferred/ncert_own_fr.json` (ch17 emergency items) was not reused.

## Old questions: wrong or doubtful (1-based position inside the concept; the old file is not edited)
HIGH (key wrong, or two defensible answers)
- POL-1.2 #14 "A citizen is offered a title by a foreign government... may not accept it without the consent of the President."
  Wrong: Article 18 bars a citizen of India outright from accepting any title from a foreign State; the consent of the
  President applies to a non-citizen holding an office of profit or trust, and to presents/emoluments (Laxmikanth p.141).
- POL-1.4 #7 Key "being taxed to promote a particular religion" while a distractor reads "...to promote or maintain a
  particular religion"; the distractor is the fuller wording of Article 27 (p.155), so two options are defensible.

MEDIUM (doubtful or unsupported)
- POL-1.1 #14 "claim compensation under Article 300A as a legal right": the legal right carries no guaranteed right to
  compensation (p.164); the stem implies one.
- POL-1.2 #12 Common well barred by caste -> key Article 17. Article 15(2) names wells expressly (p.134) and is at least as direct.
- POL-1.3 #17 "19 protects collective activity; 22 protects individual liberty": Article 19 also protects individual freedoms.
- POL-1.3 #19 "freedom of speech may be restricted to prevent violence, but not to silence criticism": a paraphrase, not the
  Article 19(2) grounds (p.145).
- POL-1.3 #20 Article 22 safeguards listed (grounds, lawyer, magistrate within 24 hours) without saying they apply to ordinary
  arrests only, not to preventive detention or enemy aliens (p.152).
- POL-1.4 #14 Temple trust appointing its priest under custom -> Article 26. Not in Laxmikanth; unsupported.
- POL-1.5 #20 "What should a habeas corpus petition state?" Not taught in Laxmikanth; unsupported.
- POL-1.5 #15 "Article 226 covers rights and other legal rights and is closer": loose, 'closer' is not a chapter fact.

LOW: about 90 of the 120 old items are one-line direct or fill-in-the-blank recall (Article number to subject), labelled Easy,
and none is in statement or Statement-I/II form; several distractors are absurd ('courts ignore rights'). Not wrong, only below
UPSC level; the new pack replaces them.

## New pack: how it was built and checked
- Per concept: 5 direct, 9 which-statements, 3 how-many, 2 Statement-I/II, 1 match; pure-recall items 0-4 per concept.
- Truth flags were kept beside each statement while building (keys, wrong-option reasons and explanations were generated from
  them). The saved file was then read back: for all 108 statement items the key recomputed from the explanation matched
  (0 mismatches), the 6 match keys were re-answered, and 25 items were re-answered cold from the chapter text.
- Falsifiers checked as false in real law and per the chapter (for example Sajjan Singh did not reverse Shankari Prasad; the 24th
  Amendment amended Articles 13 and 368; MISA was repealed in 1978 and TADA in 1995; Article 24 does not bar harmless work).
- Time-sensitive facts are worded 'according to the chapter' (creamy-layer ceiling Rs 8 lakh, EWS criteria, Ninth Schedule count 282,
  the 44th Amendment's two-month advisory-board rule not yet in force). CrPC Section 144 is not used (CrPC is now BNSS).
- Validator 0 problems; dup-check at 0.7 clean; reshape-options then permute-match run last.

Least-sure facts (stated as the book states them): (1) Article 27 'tax money can be used for all religions' is the book's
reading; (2) the Ninth Schedule count 282; (3) 'it is not a part of the basic structure' for the right to property (p.164);
(4) Table 12.1 case-to-feature rows (Bhim Singhji, Sampath Kumar, Central Coal Fields) are used 'as recorded in the chapter'.

Cold re-answer sample (id -> key): 1-01 other authorities; 1-06 {1,2}; 1-08 {1}; 1-11 {1,2,4}; 1-17 two; 2-02 Article 31-C shield;
2-06 {2,3}; 2-14 {4}; 2-15 three; 2-17 three; 3-01 tax may be retrospective; 3-10 {3,4}; 3-13 {1}; 3-16 two; 4-04 consent needed;
4-06 {1,2}; 4-17 one; 5-01 contract bars mandamus; 5-04 prohibition; 5-07 {2,4}; 5-13 {2,3,4}; 6-01 Parliament only;
6-08 {2,3,4}; 6-12 {1,2,4}; 6-18 I false, II true.
