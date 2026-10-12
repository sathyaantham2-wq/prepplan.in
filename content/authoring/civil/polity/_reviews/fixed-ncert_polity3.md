# Fixed: ncert_polity3.json (fix pass after review-ncert_polity3.md)

Changed items (78): 1-06, 1-08, 1-09, 1-11, 1-13, 1-14, 2-02, 2-05, 2-06, 2-07, 2-08, 2-09, 2-10, 2-11, 2-12, 2-13, 2-15, 2-16, 2-20, 3-06, 3-07, 3-08, 3-09, 3-10, 3-11, 3-12, 3-13, 3-15, 3-16, 3-19, 4-01, 4-06, 4-08, 4-09, 4-10, 4-11, 4-12, 4-13, 4-15, 4-16, 4-17, 5-03, 5-04, 5-05, 5-06, 5-07, 5-08, 5-09, 5-10, 5-11, 5-12, 5-13, 5-14, 5-15, 5-16, 6-03, 6-06, 6-07, 6-08, 6-09, 6-10, 6-11, 6-12, 6-13, 6-15, 6-16, 7-06, 7-07, 7-08, 7-09, 7-10, 7-11, 7-12, 7-13, 7-14, 7-15, 7-16, 7-19
Also changed: concept CVP-3.4 rule text (governors appointed, Laxmikanth p.452).

HIGH
- 5-08 s2 replaced by a statement false in law (RTI is open to every citizen, not only scheme beneficiaries).
- 2-11 s3 rebuilt: an IPS officer cannot be dismissed by the state government (penalties only by the Centre, p.778).
- 3-19 Statement-II rebuilt on India's indirectly elected President; the pair is now UK democracy-not-republic, relation "does not explain".

MEDIUM / LOW
- 3-13 s2, s3 reworded; 3-16 rebuilt (no Kitchen Cabinet term, new false statements, count now two); 4-16 s4 and 3-16 s3 replaced (no repeat of ncert_polity4); 5-14 pg +852; 3-09 pg +277.
- False-statement position and count varied across about 50 statement items (reordered, a few given 2 false / 1 true). Cue words in false statements reworded (now about equal to true ones).
- NIA, Balwantrai Mehta and CVC cut to two uses each (2-10 s3, 2-16, 2-20 C, 5-05, 7-14 s4, 7-19 II replaced); 6-12 replaced (judges cases no longer in three items).
- Absurd distractors replaced in 2-02, 5-05, 6-03, 7-16 s3. 2-05 re-angled to the second duty of Art 355. 5-04 and 5-03 now say according to Laxmikanth / the chapter. 3-08 s1 says according to Laxmikanth. 1-14 explanation names the UK.

Not fixed: M-9 minor PYQ analogues (7-02, 3-03, 6-11 s1, 7-17 s2) and other cross-pack statement-level reuse; L-6 format mix; L-7 sk tags; L-8 style tell in 1-01..3-01. reshape-options.py not run (options hand-built).

## Final polish pass (after final-ncert_polity3.md; MEDIUM/LOW)
Changed ids (direct JSON edits, read back and re-answered cold; check-civil-pack 0 problems, dup-check at 0.8 = 0):
- M-1 (no option size unique; all-true four-statement items given one new near-miss falsifier, since an all-four key cannot share its size): 1-07 (s4 now reversed school analogy, key 1,2,3), 1-13 (options), 2-14 (s3 police-decide-guilt, key 1,2,4), 3-10 (options), 3-14 (s2 sovereign-Parliament, key 1,3,4), 4-07 (s3, key 1,2,4), 5-09 (s2, options), 6-07 (reordered, false now s4, key 1,2,3), 6-14 (s3 consent, key 1,2,4), 7-07 (options), 7-14 (s4 committee swapped, key 1,2,3). All-correct in concept 4 moved to 4-15 (now "All three", s2 = 7th Amendment, same governor for two states); other concepts keep an "All three" item.
- M-2: 3-17 re-angled (amendment is not a 'law'; Kesavananda; Art 32/226; all three), 4-11 s2 (now Art 78 duty of the PM), 6-18 (executive order of a state government; S-II constitutional source only, per L-3).
- M-3: 3-06 s1, 3-12 s3, 3-19 (now Preamble 'democratic' broader sense / Ambedkar, key S-I incorrect), Silent Valley kept in 5-03 only (5-18 now pressure group vs party), state-vs-government kept in 1-01/1-05 (1-18 now Bangladesh enclaves / Radcliffe Award, 1-07 s4 changed).
- M-4: 3-15 s2 (rule adopted after minority agreed), 5-09 s2 (CIC ordered redo), 6-15 s1 (Parliament supreme over SC, false by p.431).
- M-5/M-6: about 45 statements lengthened (false) or shortened (true); mean length true 115.8 vs false 116.8; 3-05 key shortened and distractors lengthened (key no longer longest; direct items with key longest 0-2 per concept).
- LOW: 5-04 pg + 551; 2-11 explanation says "major penalties such as dismissal".
Shortened/lengthened statements (truth unchanged): 1-06, 1-08, 1-10, 1-11, 1-16, 1-17, 2-09, 2-10, 2-12, 2-13, 2-15, 2-16, 2-17, 3-08, 3-09, 3-11, 3-16, 4-06, 4-10, 4-12, 4-13, 4-16, 5-11, 5-12, 5-15, 5-16, 5-17, 6-09, 6-12, 6-13, 6-16, 7-08, 7-09, 7-11, 7-12, 7-15, 7-16.
Not touched: L-4..L-8 (match items unchanged, so permute-match not run; reshape-options not run).
