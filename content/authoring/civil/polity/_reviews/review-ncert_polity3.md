# Review: ncert_polity3.json (CVP-3.1 to 3.7, 140 questions)

Reviewer: independent, cold. All 140 items recomputed against the Class 7 chapter (`content/extracted/gees206`, pages 143-168) and Laxmikanth 8e pdf pages (`content/reference/civil-services/laxmikanth/chapters`). Scratch: `scratchpad/rv3/`.

**Verdict: FAIL (3 HIGH).** Counts: HIGH 3, MEDIUM 12, LOW 11.

## What was checked and is clean
- Keys: every key recomputed cold from the cited page; 0 wrong keys. A script also checked that, for all 84 which/how-many items, the statements the explanation calls correct match the key (key letters or count) and every statement is covered. 0 mismatches.
- `check-civil-pack.py`: 0 problems. Every item has key at o[0], four distinct options, 3 why-wrong lines.
- Cited pages state the fact in all but three items (see M-3, M-4 below).
- Currency: state/UT counts are worded "according to Laxmikanth" (1-15) or "the chapter says" (7-15); Supreme Court strength is historical ("increased ... to thirty-three in 2019", 6-17); Information Commissioner terms (5-11 stmt 3, 5-13) match the post-2019 text on p.704/709 and are safe. No item rests on a time-sensitive count.
- Governor concern: no item states that Governors are elected. 4-15 states correctly that the Governor is appointed by the President and is a nominal head (p.452). 4-01 option D and 4-06 stmt 2 repeat the chapter's "mostly formal or symbolic" wording without calling the Governor elected, so there is no contradiction with reality. Only the concept rule text and the 4-01 explanation read as if governors are "elected leaders" (L-1).
- Mix vs 2020-26 column: direct 35 (25%, target 26), which 63 (45%, target 48), how-many 21 (15%, target 12), Statement-I/II 14 (10%, target 6), match 7 (5%), case 0 (target 3). Skill: recall 21 (15%), two_step 81, elimination 38. Acceptable (see L-6).
- Format per concept is identical: 5/9/3/2/1.

## HIGH

**H-1  CS-POL-ncp3-5-08 (which, RTI)**: statement 2, "Officials may decline a request for information on government actions of public interest", is keyed incorrect only because the chapter says "Officials are bound to provide information". In real law the RTI Act has exemptions (s.8 and s.9: national security, cabinet papers, personal information and so on) and a well-read aspirant would mark it true. Option "1 and 2 only" is on offer, so there are two defensible answers (Falsifier rule).
Fix: replace stmt 2 with a statement that is false in law, e.g. "An applicant under the Act must give reasons for seeking the information" (s.6(2) forbids that) or "The department concerned may take as long as it likes to reply" (30-day limit). Keep the key "1 and 3 only".

**H-2  CS-POL-ncp3-2-11 (which, IPS)**: statement 3, "Disciplinary action against members of the all-India services can be taken by the state governments in whose cadres they serve", is keyed incorrect from p.778 ("disciplinary action (imposition of penalties) ... can only be taken by the Central government"). Under the All-India Services (Discipline and Appeal) Rules, 1969 the state government can place an officer under suspension, initiate proceedings and impose minor penalties; only the major penalties (dismissal, removal, compulsory retirement) are the Centre's. So the statement is defensible as true, and if so no option matches (the true set would be 1, 2, 3, 4).
Fix: reword the false statement so it is false in law, e.g. "A member of the Indian Police Service can be dismissed from service by the state government in whose cadre he serves" (false: Centre). Keep the key "1, 2 and 4 only". Also fix the explanation line for stmt 3 accordingly.

**H-3  CS-POL-ncp3-3-19 (Statement-I/II, Canada)**: Statement-II, "The members of the legislature in Canada are elected by the people", is keyed correct. It is not supported by the chapter (p.149 says only that people in India and the UK elect their representatives and lists Canada as a monarchy), and in real law it is not wholly true: the Senate of Canada is appointed by the Governor General, and the Crown is part of Parliament. A well-read aspirant can defend "Statement-I correct, Statement-II incorrect" (an offered option), so there are two defensible answers.
Fix: rewrite II as "The House of Commons of Canada is elected by the people" or move the item to the UK, where p.149 supports "people elect their representatives". Re-judge "does not explain" after rewording (it still does not explain why Canada is not a republic).

## MEDIUM

**M-1  3-13 (stmt 2)**: "The Constitution allows Parliament to override the freedom of speech by a simple majority" is false only by the chapter's phrasing; Parliament can restrict speech by ordinary law under Art 19(2), and "1 and 2 only" is an option. Change to "... take away the freedom of speech altogether by a simple majority" or use a different false statement (for example "Elected leaders may pass laws against equality before the law if most voters agree").

**M-2  3-16 (stmt 4, how-many)**: "governs with the help of a Kitchen Cabinet of non-elected departmental secretaries, who are responsible only to him" copies Laxmikanth p.207 literally, but in real US politics a Kitchen Cabinet is an informal circle of advisers, not the secretaries. A well-read aspirant could mark it false and answer "Only two". Drop the term: "governs with the help of a cabinet of non-elected departmental secretaries who are responsible only to him", or write "according to Laxmikanth".

**M-3  5-14 (pg)**: stmt 2 (NBA and Chipko among ideology-based groups) is on pdf p.852, but pg is [849, 851]. Add 852.

**M-4  3-09 (pg)**: stmt 1 (the quota formula) is on p.277; pg is [276, 278]. Add 277 (the explanation already cites it).

**M-5  Statement-count pattern tell (all which/how-many items)**: 63 of 87 statement items have exactly one false statement (3-statement items 35 of 48 with two true; 4-statement items 28 of 36 with three true). The false statement is #3 in 33 of 80 cases (41%) and #4 in only 7. A student can score by hunting for "the one wrong line". Vary: add items with 2 false of 4, 1 true of 3 or 4, and move false statements to positions 1, 2 and 4. The author's own lessons say "in four-statement items do not keep exactly three as the key".

**M-6  Cue words**: 19 of 80 false statements contain a cue word (must, only, every, cannot, alone, no) against 29 of 208 true ones (24% vs 14%). Examples: 1-09 s1, 1-13 s3, 3-10 s2, 3-13 s3, 4-08 s1, 4-17 s3, 5-09 s4, 6-06 s2, 6-07 s4, 7-07 s3. Soften some of these false statements, and put "only/cannot" in a few true ones.

**M-7  Idea repetition (cap 2 per concept)**: CVP-3.2: the NIA's origin after 26/11 is tested in 2-04 (key), 2-16 s1 and 2-20 B, with 2-10 s3 on its DG. CVP-3.7: the Balwantrai Mehta Committee is tested in 7-02, 7-13 s1, 7-14 s4 and 7-19 II. CVP-3.6: 6-20 (match) repeats 6-12 (First, Second, Third judges) and 6-04 (Fourth judges) in full. Across concepts the CVC (1964, Santhanam, 2003) is in 2-20 C, 5-05, 5-16 and 5-20 B. Replace the extras with other facts of the same pages.

**M-8  Weak (absurd) distractors**: 2-02 B (Governor's written permission) and C (no magistrate can authorise custody); 5-05 C (an amendment inserting a Part on vigilance); 6-03 D (Lok Sabha resolution by simple majority plus CJI assent); 7-16 stmt 3 ("Samagra Shiksha and PM Poshan Yojana are laws made by the courts"); 1-12 s3 is also easy. No student will pick these, so they waste a slot. Use real near-misses (for 7-16 s3: "are laws made by Parliament" is false, because they are schemes).

**M-9  Near-duplicates of tagged PYQs**: 2-05 asks the Art 355 duty (same fact as UPSC-POL-2003-104; re-angle, e.g. ask for the second duty in Art 355); 7-02 (Nagaur 2 Oct 1959; UPSC-POL-1998-048 asks the state, so this is a new angle but the same fact); 3-03 (vote-value formula; UPSC-POL-1997-039, which asks the census base; it is a calculation, so acceptable); 6-11 s1 (charged on the Consolidated Fund; UPSC-POL-2002-082 analogue for High Court judges); 7-17 s2 (Madras 1688; UPSC-POL-2009-184). Only 2-05 is close enough to need re-angling.

**M-10  Near-duplicates against other packs (dup-check.py, 48 lines >= 0.6)**: the highest are 6-19 s1 vs lk34-078 (HC judge, pleasure of the President), 4-16 s4 vs ncp4-5-05 (PM in House of Commons), 3-17 s1 vs lk08-028 (Art 13 void), 1-17 s2 vs lk06-208 (Berubari), 6-17 s3 vs lk26-309 (seat of the SC), 6-11 s2/s3 vs lk26-311/317, 3-16 s3 vs ncp4-5-09 (US President cannot dissolve the House), 6-12 s2/s3 vs lk26-114 and aks16-715. These are statement-level reuse of the same fact under different stems, not whole-question copies. The two cross-pack repeats with ncp4 (4-16 s4, 3-16 s3) are the ones to re-angle; the rest can stay.

**M-11  5-04 (Lokpal and Lokayukta "first recommended by")**: the stem is unqualified, but Ombudsman ideas were put forward earlier in India (the Setalvad proposal of 1960 and Parliament debates), so "first" is only Laxmikanth's account. Add "according to Laxmikanth".

**M-12  3-02 / 3-08 (electoral college)**: key is safe, but since 2019 the J&K UT has a legislative assembly. Laxmikanth names only Delhi and Puducherry, and the item is worded "according to Laxmikanth", so it stands; add that phrase to 3-08 stmt 2 and keep an eye on the next edition.

## LOW

- L-1  Concept CVP-3.4 `rule` and the explanation of 4-01 say the political executive "are elected leaders ... and the president and governors". The Governor is appointed (Laxmikanth p.452, and 4-15 says so). Add "(the chapter lists governors here; Laxmikanth p.452 says they are appointed by the President)".
- L-2  5-03 ("In 1970 the Kerala Government planned ..."): the stem presents the chapter's year as fact. Real chronology: Silent Valley was notified as a National Park in 1984 and inaugurated in 1985. Say "the chapter says" in the stem.
- L-3  2-03: "only with the consent of the state government" is Laxmikanth's rule for the DSPE Act. Constitutional courts (Art 32 or 226) can direct a CBI probe without consent. The stem says "as explained by Laxmikanth", which is enough; no change needed.
- L-4  Statement-I/II "explains" calls are sometimes arguable: 1-19 (II is a contrast, key "does not explain", acceptable), 3-19 (see H-3), 2-18 and 5-18 (II as the cause, acceptable). Keep "explains" only where the page states the causal link, as the author lessons say.
- L-5  3-15 s3 and 5-09 s4 (court ordered or struck down) are false because the story says otherwise, not because of law. Acceptable story facts, but weak.
- L-6  Format mix: Statement-I/II 10% (era 6%), no case-study item (era 3%), match 5% (matching tables are rare after 2020). Convert one A-R per concept to a how-many or add a short case item if you want to be closer.
- L-7  `sk` tag "two_step" looks generous: 81 of 140. Items such as 7-04, 3-05 and 1-03 are one-step recall.
- L-8  Several direct items keep an explanatory clause ("because ...") only in distractors (1-01, 1-02, 3-01). Not a length tell, but a style tell; add "because" clauses to the key or remove them from distractors.
- L-9  1-14 s3 relies on "a country with overlapping organs cannot be a democracy" being false; true in real life (UK) and fine, but the explanation should name the UK rather than India.
- L-10 6-17 s2 and 1-15 s1 are correct today (33 other judges, 28 states and 8 UTs) and worded safely; re-check when the next Laxmikanth edition is loaded.
- L-11 pg in 7-14 mixes chapter and Laxmikanth pages without saying which; fine.

## Per-concept sanity (cold recompute summary)
- CVP-3.1 (20): all keys confirmed; 1-04/1-08 (UN, Commonwealth) match p.86; 1-10 to 1-17 match pp.93-95, 131, 587.
- CVP-3.2 (20): confirmed except H-2; 2-08/2-09/2-17 match pp.147-152; 2-10/2-16/2-20 match pp.711, 716, 729.
- CVP-3.3 (20): confirmed except H-3 and M-1; 3-03 computed: 60,00,000 / 100 = 60,000; / 1000 = 60. 3-14 all four statements true (p.211-212).
- CVP-3.4 (20): confirmed except M-2 (that item is in 3.3, listed here by id 3-16); 4-02 to 4-17 match pp.315-317, 605-607, 777-783.
- CVP-3.5 (20): confirmed except H-1; 5-11/5-13 match p.704/709; 5-15/5-19 match pp.724-726; 5-20 years match p.704, 711, 722-723.
- CVP-3.6 (20): all keys confirmed against pp.414-420, 431-434.
- CVP-3.7 (20): all keys confirmed against pp.548-559, 569-577 and chapter pp.161-164.

## Required before load
Fix H-1, H-2, H-3; apply M-1, M-2, M-3, M-4; address M-5 to M-7 by re-angling at least 12 statement items; then re-run `check-civil-pack.py`, `dup-check.py`, and `reshape-options.py --write` last.
