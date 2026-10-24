# v3 verification: class6sc ch12 "Beyond Earth" (SCI6, fecu112), after one fix pass

Pack: `content/authoring/dps/class6sc/ch12.json`. Pre-edit copy diffed (orig.json in scratchpad). Textbook: `content/extracted/fecu112/pages/003-018`.
Changed items found by diff: **54** (12.1: 6, 12.2: 11, 12.3: 7, 12.4: 12, 12.5: 11, 12.6: 8). Every one re-read, every number recomputed in python, every fact checked against the page. Index `[n]` is the 0-based position in the concept.

Whole-pack mechanical checks (code): 127 questions, 6 concepts of 21/21/23/20/21/21. Step marks sum to marks on every item with steps (0 mismatches). Every option item has the key at o[0] (0 mismatches). No option named by position (0 hits). Correct option strictly longest in 1 of 27 MCQs. claim_check verdicts: No 3, Yes 2, Partly right 2 (unchanged). multi_statement keys: six different answers (unchanged). true_false 3 T / 3 F. Question types unchanged (short 51, mcq 27, long 25, AR 7, fill 6, MS 6, match 5). Bloom: Analyse 61, Apply 34, Evaluate 22, Create 7, Understand 3. No Remember, no Easy. Scope_out lines (nakshatra names, apps, Proxima 269,000 au, Hanle, Surya): none violated. The More-to-know satellite box (p.244) is not in scope_out and is on a scope page.

## Counts
**HIGH 0. MEDIUM 7. LOW 14.**

## HIGH
None. All 54 changed keys agree with my own answer. Recomputed: 12.2 [4] 7:50 + 30 min + 40 min = 9:00, bus 9:15, 15 min spare (45 = no wait, 85 = unrelated); 12.2 [8] 5 x 2.5 = 12.5 (Y), 18/5 = 3.6, 5 x 1.8 = 9 > 8; 12.3 [15] 2014 to 2026 = 12 revolutions (4,380 = days, 144 = 12x12); 12.4 [3] 4x27 = 108, 3x24 = 72, 27x27 = 729 d = 1.997 y, 100/27 = 3.7 so 3 full trips (key 1-b 2-d 3-c 4-a correct); 12.4 [6] 2019-2008 = 11, 2023-2019 = 4; 12.4 [11] 7 x 4 = 28; 12.4 [15] 12,800/4 = 3,200, 100 x 12,800 / 3,200 = 400; 12.4 [17] 13x27 = 351 < 365 < 378 = 14x27 (365/27 = 13.5); 12.5 [5] 500/10 = 50 cm, 500,000 m / 100 = 5,000 cm = 50 m, 0.01 km / 10 = 0.001 cm; 12.5 [16] 53, 53, 76-53 = 23, 2056+53 = 2109.

## MEDIUM
1. **12.3 [16](c)** "P and Q are large planets. Why did they look like mere dots". P is Mars (key (a)). The chapter (p.241) says the inner four, Mars included, are the "smaller" planets. The stem asserts a false fact and is the one place the item contradicts the page. Fix: "P and Q are planets, yet they looked like mere dots to the naked eye. Why?"
2. **12.3 [22]** "Which fact from the chapter best shows that the Sun is a star?" Key: "an extremely hot ball of gases giving out huge energy". Distractor 3, "It looks bigger than the stars as it is much closer to us", is the page's direct answer to Kunal's actual objection (huge disc versus dots), so a student can defend it as "best". The page never defines a star as a hot ball of gases (it says stars shine with their own light). Fix: make the key "It gives out its own heat and light, as stars do" and turn distractor 3 into a false statement (for example "It is much farther from us than the other stars"), or reword the stem to "Which fact explains why the Sun looks so unlike the other stars?" and make option 3 the key.
3. **12.4 [2](b) versus 12.4 [14](d)** inside one concept the keys disagree. [2](b) "would a small rock that moves around the Sun ... be a satellite?" key: No. [14](d) key accepts the p.244 box that any object moving around a much larger object can be called a satellite (Earth a satellite of the Sun). A student who knows the box can defend "yes" in [2](b). Judgement on [14](d): legitimate use of the box (in the book, on a scope page), but the answer is a judgement call; keep it with a stem line "the display uses the most specific name the chapter gives" so "planet" is the unique key. Fix [2](b): "would it be a satellite of any planet?" (or add "in the chapter's main sense, as in (a)").
4. **12.6 [6](d)** the decision between "Scientists find life on planet X!" and "The search for life on exoplanets goes on: no evidence yet" is a true headline against a false one, already settled by (c) (Item 2 versus Item 3). Still a strawman (v2 MEDIUM 5/6 only half fixed; the Y/Z strawmen and the stem-answerable (b) are fixed). Fix: make the rival headline true but weaker (for example "Exoplanets found around other stars") against the sharper claim, or drop (d) and move the marks to a two-mark (c).
5. **12.1 [6]** fill_blank "that faint star now lies in exactly ___ constellation(s)". The stem itself says the IAU boundaries "divide the entire sky into 88 regions", so "1" follows from the stem with no chapter knowledge. Fix: ask a quantity the chapter must supply, for example "If one old map had 40 star groups and the IAU's regions replaced them all, how many regions does the sky now have if 48 more were added" is contrived; simpler: give the number of old patterns one culture used (say 36) and ask how many more regions the IAU's total has than that (88 - 36 = 52).
6. **Repetition of facts (v2 MEDIUM 7) only partly fixed.** Fixed: tail from evaporating material (now 2 items in 12.5), Mars-two-moons (0 in 12.4), "5x distance rule", southern hemisphere in 12.2 (2 items), Sirius in 12.1 (5, was 6). Not fixed or worse (item counts that mention the idea, per concept of 20-23): 12.1 Orion 9 of 21, Pole Star 9 of 21, imaginary lines 3; 12.2 Pole Star 11 of 21 (was 12); **12.5 asteroid belt "between Mars and Jupiter" now in 7 of 21 (was 5)** because the new items [3], [5] added it. Standard: at most about twice. Fix: in 12.5 drop the belt from [3] and [5](e) (use size or shape instead); in 12.1 and 12.2 swap the Pole Star or Orion mention out of at least four items each for untested content (Taurus/Canis Major roles, Orion December-April only once, Sirius via the belt line only once).
7. **Easy-in-disguise items still standing** (answer is one line the page states; the wrapper adds no step): **12.2 [11]** (check visibility from Chennai using an app), **12.4 [4]** (craters from impacts and no wearing agents), **12.4 [13]** (Chandrayaan-4 will bring samples), **12.6 [14]** (band of light is many stars), **12.6 [9]** (one star vs millions; Milky Way name), **12.1 [9]** (stars as backup in emergencies), **12.3 [18]** (planet order between Mars and Saturn), **12.5 [1]** (asteroid versus comet, two lookups). Fixed well: 12.2 [4] (timed plan), 12.2 [20], 12.3 [15] (12 revolutions), 12.4 [3] (computed match), 12.5 [14] (five tricky cards), 12.6 [16](b) (ordering). Suggested lifts: 12.2 [11] give three dates/times and ask which suits both Orion and Big Dipper; 12.4 [4] show two photos (one with sharp old pits, one worn) and ask which body is which; 12.4 [13] ask how many years until the first sample could return given a stated launch and trip time; 12.6 [14] ask how a student could tell the band is stars rather than cloud (two conditions from the chapter).

## LOW
1. **12.3 [16](b)** judged as asked: "Jupiter and Saturn as the only naked-eye giants" matches the page (p.242: "Mercury, Mars, Jupiter and Saturn can also be seen with the naked eye"; Uranus and Neptune are not named). Acceptable within a book-bound bank, but real Uranus is faintly visible and only Saturn's rings show in a small telescope, so a well-read student could write "Saturn". Fix: add "(according to the chapter)" to (b) and let the rubric accept "Saturn" or "Jupiter or Saturn".
2. **12.3 [16](e)** the club's aim ("something visitors could not see at all with their own eyes") hands over R. Soften the aim to "to give visitors the most memorable view" so the weighing of rings versus faint smudge is real.
3. **12.3 [19]** Mars versus Saturn for a landing robot is still obvious (needs solid ground); the added "science team prefers Saturn" helps a little. Fine for 4 marks.
4. **12.4 [0](c)** repeats the reason already asked in (a). Merge or ask something new (what the fan and ants stand for).
5. **12.4 [15]** step 2 (1 mark) holds two ideas (400 times and the near/far reason). Split the marks 1/1/... or give (b) the second mark.
6. **12.4 [14](c)** "a large number of moons" for Jupiter and Neptune is the page's wording; fine.
7. **12.5 [3]** reason 3 says the chapter's asteroids revolve around the Sun; the page says "many". Reword to "a moon of Jupiter moves around a planet, so is a satellite, not an asteroid".
8. **12.5 [5]** parts (a)-(d) are arithmetic on figures the stem supplies (the 10 m to 500 km range); only (e) needs the chapter. Remove the range from the stem so (c)/(d) need recall.
9. **12.5 [16]** whole item is subtraction on stem data, including Halley's 76 years given in the stem. Remove "76 years" from the stem so (b) needs the chapter.
10. **12.5 [14]** the rubric rewards the author's chosen "tricky feature" per card; accept any sound trap the student names.
11. **12.5 [18]** "endings of a comet's journey" includes returning periodically, which is not an ending; reword "kinds of journey".
12. **12.6 [12](a)** asks two reasons but gives one mark; the part (b) mark is also one. Make (a) one reason or mark 3.
13. **12.1 [19](b)** "dim stars vanish first in haze" is the author's reasoning (the page only says stars differ in brightness). Fine as application.
14. **12.2 [20](b)** "two to three hours apart" is an author detail, not on the page; acceptable as an example plan.

## Judgements the caller asked for
- **12.4 [14](d)** relies on the p.244 "More to know" box. Usable (page 244 is in scope_in pages, box not in scope_out), but see MEDIUM 3: add one stem line so "planet" is the only defensible label, and fix [2](b) which contradicts it.
- **12.3 [16](b)** acceptable per the book; see LOW 1.
- **12.4 [17]** key "Yes" now unique: "at least 13 full trips, but not 14", 351 < 365 < 378. OK.

## v2 MEDIUM groups
1. 12.2 [7]: fixed (reasons now from Orion Dec-April and the summer Big Dipper search; "harder for a beginner" gone).
2. 12.2 [14]: fixed (rubric accepts partly right or wrong-because-of-only, with the other causes).
3. 12.4 [17]: fixed.
4. 12.3 [5]: fixed (stem gives only-dawn / only-dusk; part (c) is the decision; marks 1+1+2).
5. Strawman decisions: 12.5 [9](d) now telescope versus camera, real; 12.5 [19](c) now crosses-the-Earth's-path with the 3 m trap, real; 12.4 [0](d) now more pebbles in the worn tray, real; 12.4 [14](d) see MEDIUM 3.
6. 12.6 [6]: half fixed, see MEDIUM 4.
7. Repetition: partly, see MEDIUM 6.
8. Easy-in-disguise: 6 of 14 lifted well; see MEDIUM 7.
9. Frame repetition: fixed (12.3 [16] and 12.5 [5] reframed, 12.6 [18] now a Sun-versus-Jupiter comparison; "judge five sentences" remains once in 12.4 [18], "justify in five points" twice).

## Per-changed-item result (OK = key right, one defensible answer, marks match, in scope)
12.1: [4] OK; [6] OK key, MEDIUM 5; [8] OK; [9] OK key, MEDIUM 7; [16] OK (sketch premise now given in stem); [19] OK, LOW 13.
12.2: [4] OK; [7] OK; [8] OK; [9] OK (S1 false: new Moon hinders Pole Star; S2 true; S3 false: tall trees block); [11] OK key, MEDIUM 7; [12] OK (unique matching 1-c 2-a 3-d 4-b); [13] OK; [14] OK; [16] OK; [19] OK; [20] OK, LOW 14.
12.3: [5] OK; [15] OK; [16] MEDIUM 1, LOW 1-2; [17] OK; [18] OK key, MEDIUM 7; [19] OK, LOW 3; [22] MEDIUM 2.
12.4: [0] OK, LOW 4; [2] OK for (a), (b) MEDIUM 3; [3] OK; [4] OK key, MEDIUM 7; [6] OK; [8] OK; [11] OK; [13] OK key, MEDIUM 7; [14] OK key, MEDIUM 3 (judgement); [15] OK, LOW 5; [17] OK; [18] OK (i-v: incorrect, incorrect, correct, incorrect, correct).
12.5: [1] OK key, MEDIUM 7; [3] OK, LOW 7; [4] OK (S1 true, S2 and S3 false); [5] OK arithmetic, LOW 8; [9] OK; [12] OK; [14] OK, LOW 10; [15] OK; [16] OK, LOW 9; [18] OK, LOW 11; [19] OK.
12.6: [3] OK; [6] MEDIUM 4; [9] OK key, MEDIUM 7; [12] OK, LOW 12; [14] OK key, MEDIUM 7; [16] OK; [18] OK (five points all on the page); [20] OK.

## Verdicts per concept
- C6SC-12.1: keys all correct; pass after one small fix (MEDIUM 5, repetition).
- C6SC-12.2: keys all correct; pass after repetition and [11] lift.
- C6SC-12.3: keys all correct; fix 12.3 [16](c) wording and 12.3 [22].
- C6SC-12.4: keys all correct; fix 12.4 [2](b) wording and add the [14](d) stem line.
- C6SC-12.5: keys all correct; cut asteroid-belt repetition.
- C6SC-12.6: keys all correct; fix 12.6 [6](d).

## Overall
No wrong key, no arithmetic error, no step-mark or option-order defect. Three small MEDIUM edits (12.3 [16](c) "large planets", 12.3 [22] second reading, 12.4 [2](b) versus [14](d)) are real second-reading or fact slips and should be done before load. The rest (repetition, remaining easy items, 12.6 [6](d), 12.1 [6]) are quality points that do not make any key wrong.

**Verdict: NOT load-ready as it stands; load-ready after the three must-fix MEDIUMs (1, 2, 3 above), which are one-line edits.** Remaining MEDIUMs 4-7 are recommended and may be waived by the owner.
