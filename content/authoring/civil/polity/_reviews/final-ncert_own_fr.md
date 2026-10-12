# Final verification: ncert_own_fr.json (after fix pass)

Pack: content/authoring/civil/polity/packs/ncert_own_fr.json (ids CS-POL-ncfr-<c>-<nn>, 120 items, 6 concepts).
Method: every item (all 120, not only the 65 changed) decided cold from Laxmikanth ch08 / ch12 / ch17 text
(content/reference/civil-services/laxmikanth/chapters/) and real law before reading the key. Scratch: scratchpad/fvfr/.

## Verdict: FAIL (2 HIGH)

Counts: HIGH 2, MEDIUM 10, LOW 13.

Mechanical checks (all clean): check-civil-pack.py 0 problems; dup-check.py 0 hits at 0.8, 1 hit at 0.7
(4-20 vs lk08-142, 0.71, a stem phrase only), 17 at 0.6 (all topic/phrase overlap); script re-derivation of every
`which` key from the explanation truth flags (0 mismatches), every `which` w[] order against o[1..3] (0 mismatches),
every `howmany` key (0 mismatches); all 120 have o[0] == a and 3 w entries; no truncated reasons.
No near-copy of a tagged PYQ (polity-tagged.json, Jaccard <= 0.24; closest UPSC-POL-2022-432 writs, topic only).
Format mix: which 54 (45%), direct 30 (25%), howmany 18 (15%), stmt12 12 (10%), match 6 (5%) against the 2020-26
column (direct 26, which 48, howmany 12, stmt12 6, case 3). In band; Statement-I/II is 4 points high and there is
no case item, both acceptable.

## HIGH

### 6-06 (Article 33 statements): st3 is false in real law, so option "1 and 4 only" is a second defensible answer
St3 reads "The Army Act, the Navy Act and the Air Force Act, all of 1950, are among the laws made by Parliament
under it." Laxmikanth p.161 does print "Army Act (1950), the Navy Act (1950), the Air Force Act (1950)", but that
is a slip in the book: the statute is the Navy Act, 1957 (Army Act 1950, Air Force Act 1950, Navy Act 1957).
A candidate who knows the 1957 date marks st3 false and the key becomes "1 and 4 only", which is offered as
option 3. The pack's own scope_out says points where the notes disagree with settled law are not tested.
Fix: replace st3 with the Police Forces (Restriction of Rights) Act, 1966 (true in both book and law), or drop
the year ("The Army Act and the Air Force Act, both of 1950").

### 1-14 (rights against private individuals): st4 is no longer false in real law
St4 "The six freedoms of Article 19 are protected against private individuals as well as the State" is keyed
false (book p.142: "protected against only state action"). Since Kaushal Kishor v State of UP (Constitution Bench,
Jan 2023) the Supreme Court holds that a right under Article 19 or 21 can be enforced even against persons other
than the State. The stem does not say "according to the chapter", so a current candidate can treat st4 as true,
and then no option is right. Wrong key by real-law test (fact changed after Laxmikanth 8e).
Fix: replace st4 with something false in all law, e.g. "Article 16(1), equality of opportunity in public
employment, can be enforced against a private employer", or add "according to the chapter" and drop the word
"only" reliance. Replacement is cleaner.

## Earlier HIGH items: resolved
- 1-10: st1 now "Article 301 ... is placed in Part III" (false; book p.168 says Part XIII); st2 Article 265 Part XII,
  st3 Article 326 Part XV, st4 Article 32 not available but Article 226 or ordinary suit: all four match p.168
  word for word. Key "2, 3 and 4 only" is right. Resolved.
- 1-13: st1 expensive remedy, st2 political rights only, st3 Jennings (no consistent philosophy) all true on
  p.166-167; st4 "too permanent, Parliament cannot amend" is false (book's "No Permanency" criticism is the
  opposite). Key "1, 2 and 3 only" right. Resolved.
- 6-10: st1 (31B wider than 31A) p.165 true; st2 "13 acts and regulations at creation in 1951" p.166 ("Originally
  (in 1951) ... only 13 acts") true, count 282 dropped; st3 Kesavananda made Ninth Schedule laws open to the
  basic-structure test, p.165 true; st4 "Ninth Schedule added 1971 along with Article 31C" false (1951 by the 1st
  Amendment; 31C by the 25th Amendment 1971, p.166). The "13 at creation" and "31C 1971" claims are both
  supported. Key "1, 2 and 3 only" right. Resolved.
- 3-20 (rebuilt match): complete and correct. 19(2) speech, 19(3) assembly, 19(4) association, 19(6) profession;
  Table 8.5 pp.143-144; four distinct List-II entries (19(5) correctly left out), distractors are single swaps,
  key unique. Resolved.
- Statement-I/II keys all recomputed: 3-18 I correct (blood specimen outside the protection) / II incorrect (criminal
  proceedings only, p.147) = right; 5-18 I correct (certiorari against administrative authorities, p.161) / II
  incorrect (describes habeas corpus) = right; 2-19 I incorrect / II correct (Dicey's third element, p.133) = right;
  6-18 I incorrect (Articles 20 and 21 cannot be suspended, p.263) / II correct = right. The "both correct" keys
  (1-18, 1-19, 2-18, 3-19, 4-18, 4-19, 5-19, 6-19) are right on truth; link judgement noted under 4-18.

## MEDIUM

1. 2-16 st1 (Maharaja, Rai Saheb, Dewan Bahadur "fall under the ban ... as hereditary titles of nobility").
   Book p.141 says exactly this, but in law Article 18(1) stops the State conferring titles and many of those were
   not hereditary. "None" is a visible option, so a sceptical candidate has a second answer. Stem lacks "according
   to the chapter". Fix: add it to the stem, or reword st1 as "Article 18 prohibits the State from conferring any
   title other than military or academic distinctions".
2. 4-07 st4 "The Employment of Children Act, 1938 and the Mines Act, 1952 are among the laws that bar the
   employment of children". Book p.154 lists both, but the 1938 Act was repealed by the Child Labour (Prohibition
   and Regulation) Act, 1986. Present tense is wrong in real law. Fix: use the Factories Act 1948 and Mines Act 1952
   (both live, both on p.154).
3. 5-14 st1 "Mandamus cannot be issued against a private individual or body" (left LOW by the fixer). UPSC 2022
   (UPSC-POL-2022-432) keys the opposite nuance true: mandamus will not lie against a private organisation "unless
   it is entrusted with a public duty". Reword to that formulation; as written the "true" statement is overbroad in law.
4. 2-09 st1 keyed true says the 2006 Act gives 27% to OBCs "in all central higher educational institutions". Book
   p.135 says "all", but the Act exempts minority institutions, institutions of excellence, research and strategic
   institutions. Drop "all".
5. 6-14 st2 (Bommai "listed the independence of the judiciary") is false only because Table 12.1 does not list it
   against Bommai; it is the silence of the table, not a clear falsehood. Safer to attribute a plainly wrong item
   (e.g. "Bhim Singhji listed federalism").
6. 4-18 (pilgrim fee, "II explains I"). Book p.156 puts the two sentences together, but II is about the regulatory
   purpose of a fee on endowments while I is a service fee on pilgrims. Defensible both ways; safer to reword II to
   "A fee is a payment for a service or for regulation and is not a tax for promoting a religion".
7. 3-18 st II "extends to civil proceedings as well as criminal" is keyed incorrect (book p.147 "only criminal
   proceedings"). Selvi (2010) applies Article 20(3) protection wherever the answer could expose the person to a
   criminal charge. Keep, but add "as the chapter states" to II or word it "extends to all civil proceedings".
8. Duplicate/vague reasons in stmt12 items: 2-19 and 6-18 have w[0] == w[1] ("Rejected: one of the two statements
   is incorrect."), and eight stmt12 items use generic "Rejected: Statement-X is in fact correct". Name the specific
   flaw (which statement, why).
9. Thin explanations on true statements in 20 items ("Statement 2 is correct: Chapter text." / "Listed." / "Table
   8.4.") teach nothing: 1-07 1-16 2-12 2-17 3-06 3-08 3-11 3-12 4-08 4-13 4-14 5-10 5-11 5-14 5-16 5-17 6-06 6-07
   6-10 6-12. Give the fact in a clause.
10. Repeated fact across concepts: 1-17 st2 and 6-09 st4 (market-value compensation under 31A, word overlap 0.88);
    1-10 and 1-20 both test the Article 265/301/326 Part placement. Also Article 25/26 "subject to" contrast recurs in
    4-03, 4-08, 4-14, 4-20 (0.71-0.75). Re-angle one of each.

## LOW
- 1-05 option 4 ("any court through its inherent power") is not clearly false in practice; fine for the book answer.
- 1-07 st1 (Article 30 citizens only) rests on Table 8.2; the Constitution says "all minorities".
- 2-11: creamy-layer Rs 8 lakh (2017) and EWS Rs 8 lakh are "according to the chapter" values; revisions possible.
- 2-19 st I false by the book's affirmative statement (p.133), a conceptual claim; acceptable.
- 2-20 row C: NCBC (1993) mandate in present tense; the statutory body was replaced in 2018 (102nd Amendment).
- 3-04: Article 22(4) says persons who are, have been or are qualified to be high court judges; key says "judges of
  a high court" (book wording, "8th edition" tag). Acceptable.
- 3-16 st2: MISA "until 1977" vs repealed 1978 is a one-year trap on a statute date (book p.153). Fair but minor.
- 4-01 option 4 ("protects non-citizens ... gives citizens no protection at all") is absurd; weak distractor.
- 4-03 / 4-20: "Article 26 not subject to other Part III provisions" is the text of Article 26 but Devaru reads
  25(2)(b) over 26(b); pack scope_out already excludes Article 26(b) limits. Keep.
- 4-10 st4 "bars religious instruction altogether" ignores 28(2) for State-run endowed institutions; type 1 vs 2
  is distinguished in 4-15 so no second answer.
- 4-13 explanation labels st4 "Fourth principle"; in the book it is the third (p.158).
- Direct items: key is the shortest or second shortest option in 10 of 30 (1-01 1-03 2-03 2-04 4-01 4-04 5-01 5-05
  6-01 6-03 are rank 4 of 4 by length). Mild "pick the shortest" cue.
- Keys that are the all-statements option (1-12 2-12 3-11 4-09 5-12) are always the only option of their size
  (unavoidable with 4-item sets); 5 of 54.
- 5-09 / 5-10 st2: "excess or want of jurisdiction is the ground" is the book's simplification (certiorari also
  lies for error of law on the face of the record); option set still has one fit.

## Fixer claims checked
- "Every `which` key re-derived: 0 mismatches": confirmed by script.
- "No dup at 0.8": confirmed (max 0.71).
- Fixer did not run reshape-options: option sizes verified by script; only the all-statements keys are size-unique.
- Rebuilt statements checked for Falsifier rule: false-in-law confirmed for 1-09 st2 (Art 13(4)), 1-10 st1, 1-13 st4,
  2-07 st3/st4, 2-09 st3/st4, 3-12 st1 (Satwant Singh = foreign travel), 3-13 st2/st4, 4-10 st1 (Prafull Goradia),
  5-06 st3 (injunction not named), 5-14 st4, 6-10 st4, 6-11 st1/st4, 6-13 st4, 6-15 st3; failures are 1-14 st4
  and 6-06 st3 above.

## Unchanged-item spot check (21 re-solved cold): 1-03 1-05 1-06 1-08 1-12 1-15 1-16 1-17 1-19 2-05 2-06 2-08
2-12 2-15 3-07 3-09 3-16 3-17 4-02 4-09 5-07 5-08 5-13 6-02 6-07. All keys right; issues only as listed above
(1-12 and 2-12 all-statements keys, 3-16 date trap, 5-14, 4-09 no issue).
