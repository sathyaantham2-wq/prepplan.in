# Final verification: ncert_polity3.json (after fix pass)

Reviewer: independent, cold. All 140 items (CS-POL-ncp3-1-01 .. 7-20) re-derived from the saved file against
the Class 7 chapter (`content/extracted/gees206`, p.143-168) and Laxmikanth 8e pdf pages
(`content/reference/civil-services/laxmikanth/chapters`). Scratch: `scratchpad/fv3/` (dump.txt, chk.py, pg.py).

Verdict: **pass** (0 HIGH). HIGH 0, MEDIUM 6, LOW 8.

Machine checks: `check-civil-pack.py` 0 problems. `dup-check.py` at 0.8: 0 near-duplicate lines against 60 other packs
(at 0.6 only generic matches, listed under M2/LOW). Script check of all 84 statement items: the key option equals the
correct set in the explanation, every `w[]` line states exactly the included-wrong and left-out-right statements of its
option, every how-many key equals the count in the explanation. 7 match items: every distractor is a clean two-pair
swap and the `w[]` names the right pair. No mismatch found. `reshape-options.py` was not run (per status doc).

## The three earlier HIGH items
- **5-08 (RTI): resolved.** Statement 1 now reads "information about a government scheme can be sought by its
  beneficiaries and not by other citizens". False in law (RTI Act: any citizen) and against chapter p.158. Statements 2, 3
  match p.158. Key "2 and 3 only" is the only defensible answer.
- **2-11 (AIS discipline): resolved.** Statement 1 "can be dismissed by the state government in whose cadre he serves"
  is false in law. Dismissal, removal and compulsory retirement of an IPS officer are imposed only by the Centre
  (AIS Discipline and Appeal Rules 1969; Laxmikanth p.778 "disciplinary action ... can only be taken by the Central
  government"). Statements 2 (three AIS, p.777), 3 (IPS under MHA, p.778), 4 (IP replaced by IPS in 1947 and recognised by
  the Constitution, p.777) are supported. Key "2, 3 and 4 only" is single. See L-2 for a wording note.
- **3-19 (UK/India Statement I/II): resolved.** S-I "UK is a democracy but not a republic" (chapter p.149), S-II "India's
  President is elected by a group of elected representatives, not directly" (p.149). Both true, S-II gives no reason for S-I,
  so "does not explain" is the key. The pair is no longer the circular "republic" test. See L-4 on arguability.

## Per-item recompute of the 78 changed ids
All 78 recomputed cold. Every key holds. Every false statement is false in the real text of the Constitution or in the
cited page (see M-4 for four that are false only because the book is silent). No second defensible answer found in any
item. Items worth naming because the fixer rebuilt them:
- 3-16 (US presidential system): s1 false (separation of powers, p.208), s2 true, s3 false (four years, p.207), s4 true
  (non-elected secretaries, p.207). Count 2 correct.
- 3-13 / 3-06 / 3-07 / 3-12: statements verified on p.149, 151, 87, 148.
- 2-05 (Art 355 second duty), 2-02, 2-08, 2-09, 2-10, 2-15, 2-16, 5-05, 5-11, 5-13, 5-15, 5-16, 6-11, 6-12, 7-09 to 7-14:
  each Laxmikanth fact found on the cited page (p.152, 131, 151, 716, 781-783, 722, 704, 709, 725, 711, 418-420, 548-577).
- 4-16 s3/s4 and 7-19: Swaran Singh Committee (p.211), oath of secrecy by the President (p.207), Ashok Mehta compulsory
  taxation (p.550) confirmed.
- Fixed facts that could have gone stale were checked: 28 states and 8 UTs (p.93, 587), SC 34 judges (33 + CJI, 2019,
  p.414), RTI Amendment 2019 (p.709), Lokpal PM in purview (p.725), 15% ministers cap (p.315). All current in the book.

## Findings

### HIGH
None.

### MEDIUM
- **M-1 Key-only-size tell in four-statement "which" items.** In 11 of 29 four-statement items the key is the only option
  of its statement count: 1-07, 1-13, 2-14, 3-10, 3-14, 4-07, 5-09, 6-07, 6-14, 7-07, 7-14. Six of them
  (1-07, 2-14, 3-14, 4-07, 6-14, 7-14) have the key "1, 2, 3 and 4" against three three-statement distractors, so the
  key is picked by shape. `reshape-options.py` exists for exactly this but must not be run on hand-built options; fix by
  hand (add a second 4-set or a second 3-set) or leave for the loader shuffle if the owner accepts it.
- **M-2 Near-copies of tagged PYQs.** 3-17 restates the idea of UPSC-POL-2026-486 (Art 13 "law" includes ordinances and
  custom; its s3 line has word overlap 1.0 with the 2026 stem). 4-11 s2 is the first statement of UPSC-POL-2014-257 almost
  verbatim (Art 77(3)). 6-18 s1 echoes UPSC-POL-2019-365 (overlap 0.89). Also the previously noted analogues 3-03, 7-02,
  7-17. Re-angle 3-17 (for example ask which of ordinance, constitutional amendment, bye-law is outside "law") and swap
  4-11 s2 for another Art 74-78 statement.
- **M-3 Same fact tested too often inside the pack.** "India's President is elected indirectly" is the key or the
  decisive fact in 3-06, 3-07 s3, 3-12 s3, 3-18 and 3-19 S-II; solving one answers the others. Silent Valley cancelled in
  1983 is the key of 5-03 and S-I of 5-18. State vs government (1-01 key, 1-18 both statements). Replace one or two.
- **M-4 Falsifier rule, book-silence falsehoods.** 3-15 s2 (a court struck the RWA rule), 5-09 s2 (High Court ordered the
  work) and 6-15 s1 ("the chapter states Parliament is more powerful") are false only because the chapter does not say
  so; nothing in law falsifies them. 3-15 and 5-09 describe illustrative cases. Acceptable for a chapter-based item but a
  weaker falsifier than the rest. Prefer a swapped fact (who modified the rule, who intervened).
- **M-5 Length tell on statements.** Mean length of true statements is 118 characters against 103 for false ones
  (140-item pack, 84 statement items). A longer-is-true guess gains a little. Cue words are fine (absolutes 0.21 per true,
  0.15 per false statement).
- **M-6 3-05 key is the longest option** (119 characters against 91-97). Other direct items differ by under 10 percent.

### LOW
- **L-1** 5-04 pg [723, 552]: the G.V.K. Rao Committee date (1985) is on p.551, not 552 (w[] already says p.551). Add 551.
- **L-2** 2-11 explanation says "disciplinary action ... only by the Central Government, so a state government cannot
  dismiss". Fine for dismissal, but states can suspend and impose minor penalties. Add "major penalties such as dismissal".
- **L-3** 6-18: S-II (Constitution confers judicial review; basic feature) explains why courts can strike down laws, but
  the "basic feature" half speaks to non-curtailment. Defensible as "explains"; a reader could argue "does not". Tighten S-II
  to the constitutional source only.
- **L-4** 3-19 and 1-19: "does not explain" keys depend on reading S-II as a contrast or description. Defensible and
  explained, but UPSC-style readers can differ. Not wrong.
- **L-5** Format mix against the 2020-26 column: direct 25 percent (trend 26), consider-statements 45 (48), how-many 15
  (12), Statement-I/II 10 (6), match 5 (not in the table). On target; Statement-I/II slightly high.
- **L-6** How-many keys: "Only two" 10 of 21, "All three" 6, "Only one" 2, "None" 0. "None" is never the key, so it is
  always a safe discard. Make one item "None" or "Only one".
- **L-7** 7-02 w[] for Wardha says only "the book mentions no such event"; weak reason. 6-09 s1 ("phrase 'Judicial Review'
  is used in Article 13") is false by p.432 but p.132 says Art 13 "expressively provides for the doctrine of judicial
  review"; keep, but the explanation could cite p.132 to pre-empt a complaint.
- **L-8** Match items all use the same distractor pattern (three two-pair swaps); `permute-match.py` was meant to vary it.

## Unchanged items spot-check (15 chosen, all read cold)
1-07, 1-10, 1-15, 1-16, 1-17, 2-01, 2-03, 2-04, 2-17, 3-02, 3-14, 4-02, 4-13, 5-20, 6-17. All keys correct, each fact on
the cited page, each `w[]` aligned. 1-15 s1 ("no acquired territories") is on p.587 ("twenty-eight states, eight union
territories and no acquired territories"). 2-04 "works under MHA" is on p.730 area (administrative control), cited pg
[729, 716] is close enough. No change needed.

## Option shape summary
Direct MCQ: key is longest in 9 of 35, but within 10 percent except 3-05 (M-6). No "None of these" or "All of the above"
options. Statement items: M-1. A-R keys: "explains" 6 of 14, spread acceptable. Position of false statements and number
of false statements are varied (3-statement items: 7 all true, 30 one false, 11 two false; 4-statement items: 6 all true, 25 one false, 5 two false; one-false items dominate, a mild pattern).
