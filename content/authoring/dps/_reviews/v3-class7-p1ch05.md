# v3 review: Class 7 Maths, Part I ch 5 (content/authoring/dps/class7/p1ch05.json), after the fix pass

Working notes by concept; severity-ordered summary at the end. Every item read, every number recomputed in python, every figure item re-drawn from the layout (E above F, A and C on the left, B and D on the right, P above E, Q below F) and each angle placed by position. Textbook gegp105/001-021 read; the scope file is content/structure/class7-maths-part1-ch02-08.md (ch 5 OUT: coordinate/slope tests, formal two-column proofs, skew lines, compass constructions, angle sum of a triangle or polygon; it does NOT forbid solving linear equations, that OUT line belongs to ch 4).

Terms: "definite easy" = the answer is one book line or one subtraction with no choice to make; "borderline" = two trivial steps or a book rule read back.

## C7M-5.1 (21 items)
Keys: all recomputed. #3 z=25, 4z=100 (60, 80, 25 each trace to a slip). #5 65 then 115. #6 110. #7 only a=62 fits all four readings within 1 degree. #8 I-C (130), II-A, III-B (110), IV-D (145). #14 a=38, 86/94, AOD=94, BOD=86. #15 75/105/210. #17 120/60. No wrong key on the 20 non-case items.

HIGH
- 5.1 #20(d) (case study, key reasoning false). Key: "the true value lies between 66-3=63 and 64+3=67. It could be 63, which is below 64, so the readings cannot settle it ... re-measure". But the stem gives FOUR readings, each within 3 degrees. The true angle T (AOC = BOD = T, AOD = BOC = 180-T) must satisfy |T-64|<=3, |T-66|<=3, |180-T-116|<=3 and |180-T-113|<=3. Python: the only feasible T is 64.0 to 67.0. BOC = 113 forces T >= 64. So the true smallest angle is at least 64 and the brace passes the rule; "it could be 63" is false, and the re-measurement the key recommends is unnecessary. A student who uses all four readings (which part (a) invites) gets "meets the rule, no re-weld, no re-measure" and the key calls her wrong. Smallest fix: make the failure real: change AOD to 118 and BOC to 116 (then 180-T bounds are T in [61, 67] and T in [61,67]... check: 118 -> T in [59,65]; 116 -> T in [61,67]; with 64 and 66 readings T in [63,67]: feasible T in [63,65], contains 63) and keep the key's "could be 63"; or simply drop the tolerance on the side angles ("only the two top/bottom readings are suspect"). Re-run the interval intersection after any edit.

MEDIUM
- 5.1 #21(d) decision forced by the stem: both teams read NE as 96, so SW (vertically opposite) must be 96; the only "judgement" is to apply the rule. Not a trade-off. Fix: add a cost (a bay needs 95 or more, Team B's 94 reading could be right if the survey tool is off by 2) or accept as an application item and label Apply.
- 5.1 #5, #13 and #15 (and #8 row I) are the same task: "two vertically opposite angles together = S, halve, then 180 minus half". Four uses of one idea in one concept; #15 adds a 210 sum. Keep #5 (fill) and #8, replace #13 and #15 by something that has not been asked (for example reading a diagram with three lines through one point, or finding which of three given angle lists is possible).
- 5.1 #12 (2 marks): (a) differentiate = the two definitions the book prints; (b) 112 and 68 = two one-step lookups and (b) does not use (a). Definite easy. Fix: one question, e.g. "Angle p is 112 degrees at a crossing. Maya says its vertically opposite angle is 68 because the two are 'opposite'. Explain which angle is 68 and why".
- 5.1 #10 (2 marks): (a) walks the book's Fig 5.2 reasoning with 37; (b) finds the error in 37,143,143,37. Two lookups in the 2-mark frame. Definite easy-ish.

LOW
- 5.1 #2 (mcq): "Whose readings can be right?" good, but the stem says "neighbouring" and "opposite" for the same unmarked angles in two different sets, fine.
- 5.1 #4: correct option (77 characters) is the longest of four (others 61-70).
- 5.1 #11 true_false: good, a real misconception (BOD "linear pair" with AOC); False; reason requested; steps agree.
- 5.1 #19: last mark "the book calls it a proof" is recall; fine inside a 5-mark item.
- Scope: #3, #6, #14, #17 solve a linear equation in a letter. Not out of scope for ch 5, but the book never does it in this chapter; four of 21 is acceptable.
Figure items: none in 5.1 use the E/F layout. #11/#18/#20/#21 use crossing labels that are consistent: AOC and BOD are across O, AOC/BOC linear pair on AB, AOD on CD; checked.

Easy-in-disguise count 5.1: definite 3 (#10, #12, #15); borderline 5 (#4, #5, #13, #16, #19c).
Verdict 5.1: pass after fixes (one HIGH in #20(d), not in the key's verdict "No" but in its justification).

## C7M-5.2 (20 items)
Keys recomputed: #1 m=35 (90 each). #2 90. #5 a+c=180. #6 4. #7 90 each, perpendicular. #13 x=30, 90. #16 90/90. #17 3k=90, k=30 (the v2 HIGH step "k = 20" is now "equates 3k to the vertically opposite 90 degrees and gets k = 30": FIXED, step, stem and key agree). #18 differences 1/0/4. #19 consistent with the fold (crease horizontal, parallel to AB and DC, perpendicular to AD).

HIGH
- 5.2 #18(d) (case study, second defensible answer / key claim false). Stem: "making a plan exactly perpendicular afterwards costs ₹0.7 lakh extra" (any plan). Key: "Plan 2 ... Plan 1 = 2.1 + 0.7 = 2.8 ... Plan 3 fails the cupboards anyway." But Plan 3 (1.9 lakh) with the same 0.7 lakh fix becomes exactly perpendicular (90 degrees), so it fits both the cupboards and the door and costs 1.9 + 0.7 = 2.6 lakh, exactly the cost of Plan 2. So "Plan 3 fails anyway" is false and Plans 2 and 3-fixed tie at 2.6. Smallest fix: make Plan 3 cost 2.0 (fixed 2.7 > 2.6) or Plan 2 cost 2.5; change the key to "Plan 3 with the fix costs 2.7, still dearer than Plan 2"; or state that the fix is only possible when the plan is already within 2 degrees.

MEDIUM
- 5.2 #8 (mcq): option D "2 parallel pairs and 4 perpendicular pairs" is a defensible geometric answer: p is parallel to q and p is perpendicular to r, so q is perpendicular to r (a transversal making 90 with p makes 90 with q by corresponding angles), and likewise r and s each meet both p and q at right angles. Only the word "declare" in the stem steers away from D. A strong student can defend D. Smallest fix: replace D by a wrong count that is not true (for example "2 parallel pairs and 2 perpendicular pairs" is also true by the same argument, so use "3 parallel pairs and 1 perpendicular pair") and ask "How many pairs are marked as parallel and how many as perpendicular".
- 5.2 #6 (mcq): "how many right angles are formed inside the sheet in all?" A student reading "one right angle at each of the two meeting points" answers 2 (an option). The stem still does not say that the angle above and the angle below the crease are counted separately. Fix: "At each of the two points, the crease makes an angle above itself and an angle below itself with the edge. How many of these four angles are right angles?" and then add a twist (for example the crease is a diagonal fold) so it is not a restatement.
- 5.2 #20 (5 marks): v2 asked to replace Anil by a real confusion; still Anil (equally long), Chand (cannot say) and Dilip (80 + 80) are three strawmen and only Bina is correct, so the decision is trivial; 5.2 #4 S1 uses the same "equally long" idea (repeat). Fix: make two students have a live confusion (for example "perpendicular only if the angles are 90 on both sides" vs "equal adjacent angles guarantee perpendicular") and drop the arithmetic strawman.
- 5.2 #9, #11, #13, #16 (and #12 true_false, #14, #17(a)): "one angle is 90, so the others are 90 by 180 - 90" is the thinking in 7 of 20 items. #9, #11 and #13 are three 2-mark items each of which is 180 - 90 twice or 3x = 90. Replace #9 and #11 by tasks that use something else (for example a third line through the crossing point, or deciding from four readings whether the lines can be perpendicular).
- 5.2 #16 keeps the "where x = 78 and y = 40" substitution template flagged in v2 (no equation is solved; the item is two additions).

LOW
- 5.2 #1: distractors 25 and 55 do not trace to a slip (2m+20+3m-15 = 180 is the right setup; 25 and 55 come from nowhere). Use 37 (5m+5 = 185/5, mis-subtracting) or 15.
- 5.2 #17 stem is now fixed ("90 degree corner of the set square").
- 5.2 #12 true_false: verdict True with a plain reason (no wrong claim being trapped); the chapter needs this True, see the mix below.
- 5.2 #19: three of the five steps are one fact each (parallel to AB, 90, 90). The book's Activity 2 content.

Easy-in-disguise count 5.2: definite 7 (#9, #10, #11, #13, #16, #19, #20); borderline 4 (#3, #5, #12, #15).
Verdict 5.2: pass after fixes (one HIGH, #18(d)).

## C7M-5.3 (20 items)
Keys recomputed: #1 118 = 118 (yes). #3 125. #5 x=30 (55, 32.5, 57.5 each traced to a slip). #9 4 pairs, then 7 with 3 new. #11 b parallel; lower-left 52/58 still unequal. #13 66, 114 not parallel. #16 Faiz. #17 b parallel, c at 135, d at 47 is exactly 2 off. #18 consistent. #19 corresponding angle of SPQ is RQT (upper-right at Q), 90. No wrong key. The v2 MEDIUM "#17 second answer on 'any angle'" is gone: the 5-mark comparison (now #20) asks only which method works on an inked board.

MEDIUM
- 5.3 #2 (mcq): floor lines versus a ceiling line is a 3-D situation and the scope OUT line says "skew lines/3D". It also hides a flaw: a line r on the ceiling directly above and along p lies in one plane with p (a vertical plane) and would be parallel; the stem only says r "runs along the ceiling and never meets p", and the correct option says r "is on another plane" as if that settled it. Fix: use the book's own note (a line on a table and a line on the board) without asking for a verdict on r, or drop the second half and keep only "followed 10 m is not 'however far'".
- 5.3 #17 (case study): (d) is forced by the data, exactly as v2 said: only c is outside the 2-degree limit, so "redraw c" is the only possible answer; and (c) d = 47 sits exactly on the limit. v2 asked for a design where the one redraw forces a choice. Make d 48 (also out of limit) and let her redraw only one line, or make the limit 3.
- 5.3 #9 (2 marks): counts pairs of lines (3 choose 2 = 3, 4 choose 2 = 6). Pair-counting is not taught in this chapter or by this book at this point; (a) is "same arrows means same set" and (b) a combinatorial count. Fix: ask "which lines in the diagram are declared parallel to line p" or similar.
- 5.3 #4 (multi_statement): all three statements are true (key "1, 2 and 3"), each a one-line book sentence (definition, Notations, Fig 5.21). It is recall in disguise and the only all-true multi_statement of the chapter; keep an all-true item only if one statement hides a trap (for example make S3 "with a set square, two lines both at 60 degrees to l from the same side are parallel", which is also true but not what the book shows).
- 5.3 #10, #13, #14, #20 all restate Fig 5.21 / 5.24 ("equal angles with a transversal, so parallel"): #10(a) word for word, #14 is #10(a) as a show-impossible, #13(a) is Fig 5.18, #12 is the fold method. Idea repeated 5 times; replace #14 and #13(a).

LOW
- 5.3 #3 (fill_blank): wording "makes 55 degrees with the ruler at line l" is garbled (line l is not introduced as the first drawn line). Say "a first line l is drawn along the slanting edge, making 55 degrees with the ruler". Also two trivial steps (55, then 180 - 55): borderline easy.
- 5.3 #7 (mcq): the answer is the book's Notations paragraph read back (same number of arrows = same set); easy in disguise.
- 5.3 #18 stem wording: "the angle between PQ and XY on the left of the rung below PQ" is hard to parse; say "the angle below PQ and to the left of the rung". Tolerance: the item says only "a little off" while #17 accepts 2 degrees; the key (re-measure both) is sensible but a student can argue a 2-degree gap is the chapter's usual error; add "readings can be off by 1 degree at most" (then 72 and 70 can both be 71, a more interesting conclusion).
- 5.3 #1: two options begin "Yes" and two "No"; option 4 (yes, because they add to 180) is the tempting slip; fine. #8 good. #12 true_false good (False, real misconception).

Easy-in-disguise count 5.3: definite 7 (#4, #7, #10, #13, #14, #16, #20); borderline 4 (#3, #6, #11, #15).
Verdict 5.3: pass after fixes (no HIGH; #2 and #17 need edits).

## C7M-5.4 (21 items)
Figure used in #8, #12, #13, #18: t crosses l at P and m at Q, m below l; at each crossing 1 or 5 upper-left, 2 or 6 upper-right, 3 or 7 lower-right, 4 or 8 lower-left (this is the item's own figure, not the E/F figure). Checked position by position: #8 angle 8 corresponds to 4 (VO of 2) = 70; angle 5 corresponds to 1 = 110; 1 + 4 is a linear pair along t = 180; two measures; key I-B, II-D, III-A, IV-C right. #13 angle 1 = UL at P, angle 7 = LR at Q is the alternate of angle 1 and equals 105 via 5 (UL at Q) then vertical opposition; key right.
Keys recomputed: #1 "2 and 3 only" (S1 false). #2 2. #3 4. #4 4. #5 8. #6 4. #7 A true, R false. #9 only the first set satisfies both rules (checked each set). #15 70 + 100 = 170. #16 x=45, y=20. #19 56/124 and turn m 68. #20 72 - 70 = 2, 110 - 108 = 2, four measures. #21 y = x or 180 - x.
The v2 HIGH (#18, which entries are wrong) is FIXED: the stem now says angles 1, 2, 5, 6 were read directly, so 3, 4, 7, 8 are the only entries to correct, the corrected list is unique (110, 70, 110, 70 / 70, 110, 70, 110) and the conclusion "not parallel" follows. Checked that no other repair is possible once 1, 2, 5, 6 are fixed.

HIGH
- 5.4 #12(b) (2 marks, figure): "Which single angle at Q needs the parallel fact, and which three angles at Q then follow without it?" Key: angle 6. But any one of angles 5, 6, 7, 8 can be that single angle: angle 5 is the corresponding angle of angle 1 (110, already found in (a)), after which 6, 7, 8 follow from linear pairs and vertical opposition. A student who answers "angle 5 (corresponds to angle 1 = 110), then 6 = 70, 7 = 110, 8 = 70" is as right as the key and loses the step mark. Fix: "Starting from angle 2, which angle at Q do you find first using the parallel fact, and what are the other three?" (answer 6, then 5, 7, 8), or accept any of the four in the key.

MEDIUM
- 5.4 #19(d) and #20(d): the decision is dictated by the stem. #19: the planner "wants l and m to be parallel" and corresponding angles 56 vs 124 differ, so "turn m by 68" is forced (turning l is equally possible and not discussed: say "by how many degrees must m turn, or l turn the other way"). #20: the stem prints the manager's rule (approve if directly read corresponding angles differ by at most 3) and the differences are 2 and 2, so "approve" is arithmetic, not a judgement; v2 asked for an arguable gap. Fix #20: make the rule "at most 1 degree" with differences of 2 so the manager must weigh the ₹1,500 against the readings being good to 3 degrees.
- 5.4 repeated idea: "count the different measures / at most four" is the thinking in #1 (S2, S3), #6, #7, #8 (II), #10, #11(a), #14, #17, #19(c), #20(c), #21 (about 11 of 21). #11's data (40, 140, 60, 120) is reused as the example in #14's key and again as the data of #6 in other numbers. Replace #6 and #11(a) with a different task.
- 5.4 #15 step 3: "Concludes the reading 100 is wrong". The stem only asks to show the readings cannot all be right; nothing says that 100 (rather than 70, 70 or 110) is the faulty entry (if 100 were right, the upper-right would be 100 and the upper-left 80). Change the step to "concludes the readings cannot all be right".
- 5.4 #5 (mcq): counts neighbouring linear pairs (8). It is a counting-pairs item, not a chapter skill (the book asks to list them, 5.1 Fig 5.3), and easy.

LOW
- 5.4 #6 (mcq): key is the bare "4" with no reasoning; add "50, 130, 80 and 100 are all different".
- 5.4 #13: Aman's reason "both lie on the left" is false of angle 7 (lower-right, on the right); the item reads oddly. Say "both lie on the same side of t".
- 5.4 #2: the question "smallest number he must measure" is nice, but "1" and "8" are weak options; fine.
- 5.4 #8, #12, #13, #18 repeat a 70-word figure paragraph; fine for the loader, but they cost reading time (#8 correct match set, #12 and #13 are position drills).
- Names P and Q here are crossing points; in 5.5-5.7 P and Q are the ends of the transversal. Harmless.

Easy-in-disguise count 5.4: definite 4 (#6, #10, #11, #13); borderline 5 (#4, #5, #15, #18, #20(d)).
Verdict 5.4: pass after fixes (one HIGH, #12(b)).

## C7M-5.5 (20 items)
Figure (E above F, A and C left, B and D right, P above E, Q below F). At E: AEP upper-left, BEP upper-right, BEF lower-right, AEF lower-left. At F: CFE upper-left, DFE upper-right, DFQ lower-right, CFQ lower-left. Position-by-position check of the five figure items: #5 BEP and DFE are corresponding (both upper-right); t=10, BEP=62, DFE=62; distractors 118, 10, 70 each explained. #12 BEF (lower-right at E) corresponds to DFQ (lower-right at F); y=24, 84 each; right. #13 DFQ = 66, CFQ = 114 (linear pair along CD); right. #15 DFE = 65 (corresponds to BEP), DFQ = 115 (linear pair along the transversal); 75 impossible; right. #16 DFE 62, DFQ 118, CFQ = 62 (vertically opposite DFE); right.
Other keys recomputed: #1 UL(l) = UL(m) = LR(m), 140 / 2 = 70, lower-left at l = 110. #2 124 parallel. #6 UR(p) = 102, vs 78: not parallel. #18 y=22, x=10, 114, eight angles 66/114. #19 8,000 / 9,500 / 9,000 and pair 1 cheapest; a real trade-off now (the v2 MEDIUM "strawman" is fixed). #20 88/88, 80/90, 4.4 vs 4.2 lakh.

HIGH
- 5.5 #4 (mcq, impossible data): "He measures the upper-left angles at the two edges, both 112 degrees, and then also measures the lower-right angles, both 68 degrees." At each edge the upper-left and lower-right angles are vertically opposite, so they must be equal: if the upper-left is 112 the lower-right is 112, not 68. The stem describes an impossible crossing, and the key itself says "the lower-right pair (68 and 68) is bound to agree", reinforcing the error. A student who knows the chapter should reject the stem. Smallest fix: change "lower-right" to "upper-right" in the stem (112 and 68 are a linear pair) and in the key and in option 3 ("the upper-right angles are not corresponding angles"); the answer stays "Yes".

MEDIUM
- 5.5 #8 (assertion_reason): A (equal upper-left angles give equal lower-right angles) holds simply because the lower-right angle at each line is vertically opposite its upper-left angle, with no need for parallel lines; R (equal corresponding angles -> parallel -> all corresponding equal) is a roundabout valid chain. "R is the correct explanation" and "R is true but not the explanation of A" are both defensible. Fix: choose an A that really needs R, for example "If the upper-left angles are equal, the lines are parallel, so the lower-right angles are equal" is circular too; better make A: "If the upper-left angle at l equals the upper-right angle at m, the lines are parallel" (false) with R the corresponding-angle rule.
- 5.5 #12(a) and #13(a) both ask "the corresponding angle of the lower-right angle at E" on the same figure; #15, #16 and #13(b) repeat "corresponding then linear pair" with different numbers (5 of 20 items). Keep #16 and #12, replace #13 and #15.
- 5.5 #14 (claim_check): Yes. Ritu's claim is the Summary bullet of the book read back, so the "Yes" is a lookup; the claim checks need a trap. Add a plausible wrong rider, for example "...and then the lines must also meet the transversal at 90 degrees", and make the verdict Partly right.
- 5.5 #3 (mcq): the correct option is the book's rule ("equal corresponding angles"); the three wrong options are facts true for any lines. This is a rule-recognition item; fine for Understand but not for the Analyse label.

LOW
- 5.5 #20 key (d) opens "Design A: Design B is not parallel ..." garbled; reword "Choose Design A: ...".
- 5.5 #19: sub-parts (b) and (c) are one-step (linear pair, equal); fine as the climb to (d).
- 5.5 #10 true_false: the v2 tolerance problem is fixed by "exact measurement" and the key's wording is clear; the verdict True gives the chapter one True item with a real temptation ("only 2 degrees").
- 5.5 #7: key "1 only" correct (S3 is the book sentence negated).
- 5.5 #1: good (reasoning, not a lookup); #2 correct option is not the longest.

Easy-in-disguise count 5.5: definite 5 (#3, #9, #13, #14, #16); borderline 5 (#7, #11, #15, #17, #19).
Verdict 5.5: pass after fixes (one HIGH: impossible data in #4).

## C7M-5.6 (21 items)
Figure (E above F, A and C left, B and D right, P above E, Q below F): at E AEP upper-left, BEP upper-right, BEF lower-right, AEF lower-left; at F CFE upper-left, DFE upper-right, DFQ lower-right, CFQ lower-left. Alternate pairs: AEF with DFE and BEF with CFE. Same-side interior (between the lines): AEF with CFE, BEF with DFE. Every figure item re-drawn:
#1 AEF/DFE alternate, x=15, 49 (distractors 131, 15, 75 explained). #2 AEF=117, DFE=117 (alternate), CFE=63 (linear pair), DFQ=63 (vertically opposite CFE), sum 126. #3 AEF and CFE are same-side interior, so the odd one out; the other three are alternate or corresponding; key right. #5 AEF=90 gives all eight 90, key right. #6 BEP=70: CFE=110 (corresponds to AEP=110), AEF+DFE=70+70=140, CFE-DFE=40, CFQ=70; key I-B, II-C, III-D, IV-A right. #8 stroke: 35 alternate, 145 linear pair, right. #11 diagonal BD: DBC=50, BDC=35 (alternate pairs), ABC=85, BCD=95; right. #13 BEF (lower-right at E) and CFE (upper-left at F) are an alternate pair: 73; right. #16 AEF and BEF on line AB, 70+70=140; right. #17 BEF=50, AEF=130, DFQ=50; right. #18 ABC and BCD alternate, 52, 128; right. #19 ACD=38, CAD=47, DAB=85/90; 6.7 vs 6.5 lakh; right. #20 m=30, 77, 103; right. #21 order S2/S4, S1, S5, S3 valid.
All v2 HIGHs in this concept are FIXED. #13(b) (rebuilt BEF = 73 item) now says the second reading is measured exactly as 105 (a 32 degree gap), so "not parallel" is the only answer and no longer clashes with the 2 to 3 degree tolerance elsewhere. The old #10(b) "in order" item is gone (the concept was restructured; #11 is now a diagonal-path item with a unique reading). #21's step list now says S2 and S4 may come in either order, matching the key and the stem.
No wrong key and no impossible-data item found in 5.6.

MEDIUM
- 5.6 #20 (5 marks): the first half is the book's Activity 6 argument (corresponding, then vertically opposite) reproduced, 3 of the 5 marks (steps 1 to 3) are recall of the page; the rest is "2m + 17 = 3m - 13". v2 flagged the same for the old #18. The idea "alternate = corresponding then vertically opposite" is still tested in #4 (R), #7 (S2), #14, #20 and #21 (5 of 21; v2 had 8). Replace #4 (assertion_reason restating the derivation) with one that has a real false member, and cut #20's explanation to a single mark ("which step fails if not parallel").
- 5.6 #21 (5 marks): close to the OUT line "formal two-column proofs" and it proves the converse for alternate angles (equal alternate angles give parallel lines), which the book never states (the Summary lists only parallel -> alternate equal, and the corresponding converse). The argument is valid from the book's corresponding-angle rule, so keep it, but relabel the task as "arrange the explanation" and drop "say what the argument proves" or keep it and add the converse to the scope IN list.
- 5.6 #18 (c): "How many sharp-bend elbows are needed for the two inside bends B and C?" is a count whose answer (2) is fixed by (a) and (b) giving 52 and 52 (and also by the 55 reading), so it is a trivial lookup between two real parts; the part adds no thinking. Replace by a part that uses the 128 degree angle (for example a bend over 120 needs a second fitting).
- 5.6 #3 and #6 both classify angles by position on the same E/F figure (odd one out; match); fine individually, but with #2, #5 and #17 that is five items answered purely by locating positions.

LOW
- 5.6 #16: stem repeats "AB is parallel to CD and a transversal PQ cuts them" after already describing the figure; trim.
- 5.6 #1 key sentence "(131 is its linear-pair angle ...)" fixed from v2 ("supplement"). #10 reverse: good, unique and checkable.
- 5.6 #15 claim_check "Partly right" and #14 true_false (False) are good and different in kind.
- 5.6 #4: A and R are both book sentences; "R explains A" is the book's own derivation: borderline recall.

Easy-in-disguise count 5.6: definite 3 (#13, #17, #20); borderline 6 (#4, #5, #7, #12, #16, #18).
Verdict 5.6: pass after fixes (no HIGH; the three MEDIUMs are small edits).

## C7M-5.7 (21 items)
Figures re-drawn. E/F figure: same-side interior pairs are AEF with CFE (left) and BEF with DFE (right). #4 AEP=124 (upper-left at E), BEP=56, DFE (upper-right at F) corresponds to BEP: 56; right. #11 the four angles between the lines AEF, BEF, CFE, DFE add to 360 (two same-side pairs); AEF=100, CFE=80, DFE=100 give BEF=80, which also pairs with AEF in a linear pair; consistent. #19 BEF (lower-right at E) and DFE (upper-right at F) are same-side interior, so DFE=85, CFE=95, AEP=95 (vertically opposite BEF); eight angles 95/85/95/85 at both; right. The l/m figure in #12: angle 4 (lower-left at P) and angle 5 (upper-left at Q) are the same-side pair, 122; angle 6 is the alternate angle of 4, 58; angle 7 vertically opposite 5, 122; right. #20: with A and C on the left, BEF=112 so DFE=68 (same side), AGH=70 so DHG=70 (alternate), DFE and DHG are corresponding with CD as transversal (both bars slope down to the left, so each angle is between the right-pointing ray of CD and the bar's upward ray); 68 vs 70; right. #21 bent path: PQW alternate to BPQ (40), WQR alternate to DRQ (55), PQR=95, then 100; W lies between QP and QR so the angles add; right.
Other keys: #1 102. #2 DAB+ABC=180 so the first option is not necessary. #3 x=30, smaller 80. #6 I-B (100), II-D (90), III-A (108), IV-C (105). #7 64+126=190. #8 62. #10 170 and 190, total 360 for any two lines. #13 p=30, 90 each. #14 B=D True. #16 72/110/70. #18 larger angles 95/100/105 and with +2: 97/102/107; only A stays at or below 100, a genuine cost/safety trade-off (A costs 0.3 lakh more than B). #20 68 vs 70, 2 > 1, refix. No wrong key; no impossible data.

MEDIUM
- 5.7 repeated figure and idea: the parallelogram ABCD with a diagonal or "opposite angles equal" is the thinking of #2, #8, #14, #16, #17 (five items) and again 5.6 #11, #19 (seven in the pair of concepts). Replace #16 and #17 with a figure that is not a parallelogram (the book's own Fig 5.30 type: a Z or a U shape, two transversals, or the bent-path of #21).
- 5.7 "sum 180 and a stated difference" device in #1, #6 (I and III) and #18 (b, c): three items. The book never gives a sum-and-difference problem. Keep #18 (decision) and #6; change #1 to a different application (for example "interior angles are in the form 2x and 3x - 10").
- 5.7 #17 (claim_check, 3 marks): Sana is simply right (Yes), the two alternate pairs on a diagonal are what 5.6 #11 and #19 already did; the claim has no trap. Make the claim partly wrong (for example she adds "so angle BAC = angle DAC") so the verdict is Partly right and the chapter keeps its mix.
- 5.7 #20(d): the decision is dictated by the stem (allowed gap 1 degree, actual gap 2). It is not a trade-off; the ₹300 is never weighed. Make the allowed gap 2 degrees so the carpenter needs to weigh ₹300 against a hard-to-see 2 degrees, or give the cost of leaving it unrefixed.
- 5.7 #15 (3 marks): one-line contradiction (two acute angles add to less than 180); definite easy at 3 marks. Replace with an item that uses the obtuse/acute test across two transversals, or ask which of five angle lists could be the same-side interior angles of both transversals.
- 5.7 #6 row IV wording "the angle alternate to the other" is hard to parse; say "One interior angle is 75 degrees: the alternate angle of the other interior angle (the one at the second line)". Key 105 is correct.

LOW
- 5.7 #4: distractors 124 and 90 trace to slips; fine. The fourth option ("cannot be found") is a throwaway.
- 5.7 #14 true_false: True (angle B equals D) with a sound reason, but no wrong claim is trapped; with 5.2 #12 and 5.5 #10 that makes three True verdicts whose "temptation" is minimal.
- 5.7 #9: AR is clean (A uses the same-side rule, R is the alternate rule, both true, R does not explain A).
- 5.7 #13 solves a linear equation whose answer (90, 90) is "perpendicular transversal": nice twist.

Easy-in-disguise count 5.7: definite 2 (#15, #17); borderline 6 (#4, #5, #11, #13, #19, #1).
Verdict 5.7: pass after fixes (no HIGH).

## C7M-5.8 (20 items)
Keys recomputed: #2 9 and 33, difference 24. #3 2. #4 7 x 4 + 2 x 2 = 32. #5 4 x 8 = 32. #7 9 vertical lines. #8 R is 2n+1 (false), A true. #10 25 points, 9 interior, 16 border. #11 n=6. #13 p and q parallel, 80 vs 83 not. #14 64, 18, 9. #15 3, 5, 9, 17. #16 2^n = 19 impossible. #17 33, 65, 15. #18 17 lines in 15 min, 33 lines in 31 min, 13 extra lines, 28 min, plan (c) fits. #19 58/58/61, 3 degrees, 1,200 vs 1,000. #20 4 degrees. No wrong key. Tolerance: every item here says "exactly", so #12, #13, #19, #20 are consistent with 5.5 #10 and 5.6 #13 (the v2 tolerance MEDIUM for 5.8 is fixed).

MEDIUM
- 5.8 repeated idea, worse than v2: evaluating 2^n + 1 or a grid count from it is the thinking in #2, #3, #4, #5, #6 (S1), #7, #8, #9, #10, #11, #14, #15, #16, #17, #18 = 15 of 20 (v2: 13). Of these, #11, #14, #15 and #17 are plain plug-ins of the rule (and #15 and #17 both teach "the increase doubles"). The other half of the concept (parallel illusions, testing with a transversal) is #1, #12, #13, #19, #20, and four of those five conclude "equal corresponding angles beat the eye". Replace #11, #14, #15 (or #17) by tasks about the second half or about vertical plus horizontal creases of different counts, diagonal folds (the book's activity) or why a vertical fold is perpendicular to every horizontal line.
- 5.8 #5, #7, #10 and #14 count rectangles, perpendicular lines, intersection points and squares of a folded grid. The book teaches only that n horizontal folds give 2^n + 1 parallel lines and that a vertical fold is perpendicular to them; counting a grid is an extension. Acceptable as Apply, but keep one.
- 5.8 #20 (5 marks) and #12(a): "equally long, so parallel" is a strawman for the third time in the chapter (5.2 #4 S1, 5.2 #20, 5.8 #12(a), 5.8 #20). Aarav and Bhavna in #20 are not live confusions; only Charu's step needs thinking. Make Bhavna's method something students really try (for example "the lines stay the same distance apart at the two ends I measured").
- 5.8 #18(d): the question asks which of two stated plans fits 30 minutes (28 vs 31); the comparison is forced by arithmetic, as in v2's note, though the limit is now set so that exactly one plan passes. Accept as Apply or add a cost.

LOW
- 5.8 #3 correct option "2, the two opposite edges of the sheet" is the longest option by about 10 characters.
- 5.8 #9 true_false: True, with the only temptation "adds 2". Fine, but with 5.2, 5.5, 5.7 that makes four Trues of eight where the reason is the rule itself.
- 5.8 #4 and 5.2 #6 are the two "how many right angles at a crease" items; different enough.

Easy-in-disguise count 5.8: definite 7 (#11, #12, #13, #14, #15, #17, #20); borderline 6 (#1, #2, #5, #7, #10, #16).
Verdict 5.8: pass after fixes (no HIGH, but the weakest concept on repetition and easy items).

---
# SUMMARY (severity ordered)

## Did the fix work?
1. The four v2 HIGHs: all four fixed. 5.2 #17 step now "gets k = 30" (stem, step and key agree); 5.4 #18 now says angles 1, 2, 5, 6 were read directly, repair unique; 5.6 #13(b) now "measured exactly as 105", gap 32 degrees; 5.6 #10(b) item removed and #21's order key says S2 and S4 may swap.
2. v2 MEDIUMs: addressed: 5.1 #20(a) now lists all three failing pairs; 5.1 #6 ratio replaced by "40 more"; 5.2 #3 reworded; 5.2 #19 set square corner stated; 5.3 #17 "any angle" removed; 5.3 #18 rectangle placed; 5.5 #12 "exact"; 5.5 #19 now a real trade-off (₹8,000 vs 9,500 vs 9,000); 5.6 #14(b) tolerance; 5.7 #19 transitivity stated in the stem; 5.7 #21 ratio removed; 5.8 #2 "edges included"; 5.8 #19 now a real cost decision; tolerance policy: every item states its limit or says "exactly" (3 items give no number: 5.2 #20 Sheena, 5.3 #18, 5.6 #18(d), all draw the same conclusion, "measurement error / re-measure"). NOT addressed: forced or strawman decisions (5.2 #20, 5.3 #17(d), 5.4 #19/#20, 5.6 #18(c), 5.7 #20(d), 5.8 #18/#20), the "x where x = n" substitution frame (5.2 #16), identical slot tail across all eight concepts, repeated ideas (5.8 15 of 20; 5.4 about 11 of 21; 5.7 five parallelogram items).
3. Easy-in-disguise, re-run on every item (definite = one book line or one subtraction, no choice): 38 of 164 = 23 percent (5.1 3, 5.2 7, 5.3 7, 5.4 4, 5.5 5, 5.6 3, 5.7 2, 5.8 7). v2 had about 60 of 164 (37 percent) on a looser yardstick; on the same looser yardstick (definite plus borderline) the count is 79 of 164 = 48 percent, so the fix removed the worst cases but did not meet the "no easy items" rule. The fix replaced 40-odd stems; replacement items that are themselves one-step lookups: 5.2 #9, #11, #13, #16 (180 - 90 chains and 3x = 90), 5.3 #14 and #7, 5.4 #6, #10, #11, 5.5 #3 and #14, 5.7 #15 and #17, 5.8 #11, #12, #13, #15. Concepts 5.2, 5.3 and 5.8 still carry 7 each.

## HIGH (4, all new defects introduced by the fix pass)
1. C7M-5.1 #20(d) (case study): the key's claim "the true value lies between 63 and 67, it could be 63" ignores the AOD = 116 and BOC = 113 readings; with all four readings within 3 degrees the true angle is between 64.0 and 67.0 (python), so the brace passes the rule and the re-measure advice is unfounded. Fix: change the side readings (AOD 118, BOC 116) or drop the tolerance on them, and re-run the interval.
2. C7M-5.2 #18(d) (case study): Plan 3 + the 0.7 lakh fix = 2.6 lakh = Plan 2, and after the fix it is exactly perpendicular, so "Plan 3 fails the cupboards anyway" is false and Plans 2 and 3-fixed tie. Fix: Plan 3 cost 2.0 lakh (fixed 2.7).
3. C7M-5.4 #12(b) (figure): "which single angle at Q needs the parallel fact" is angle 6 in the key, but angle 5 (corresponding to angle 1 = 110 found in (a)) works equally. Fix: start from angle 2, or accept any of 5, 6, 7, 8.
4. C7M-5.5 #4 (mcq, figure): upper-left 112 and lower-right 68 at the same edge are vertically opposite and cannot differ. Fix: use the upper-right angles (112 and 68 as a linear pair).

## MEDIUM (selected; per-concept lists above)
- Near-HIGH second-answer risks: 5.2 #8 (option D "4 perpendicular pairs" is geometrically true by corresponding angles; only "declare" excludes it), 5.5 #8 (assertion A holds by vertical opposition alone, so "R explains A" is arguable), 5.3 #2 (floor/ceiling lines: 3-D, scope OUT "skew lines/3D", and a ceiling line above p can be coplanar with it).
- 5.2 #6 right-angle count (2 or 4) ambiguous; 5.4 #15 step 3 concludes "the reading 100 is wrong" which the data cannot show.
- Forced decisions: 5.3 #17(d), 5.4 #19(d) and #20(d), 5.6 #18(c), 5.7 #20(d), 5.8 #18(d); strawman students: 5.2 #20, 5.8 #20.
- Scope drift: 5.6 #21 proves the converse for alternate angles (not in the book) in a jumbled-proof format near the OUT line "formal two-column proofs"; pair counting in 5.3 #9, 5.4 #5, grid counting in 5.8 #5, #7, #10, #14. No use of ratio, co-interior, supplement, triangles or slope found (grep).
- Repetition: 5.8 2^n + 1 in 15 of 20; 5.4 "number of different measures" in about 11 of 21 (data 40/140/60/120 reused in #6, #11 and #14's key); 5.7 parallelogram with diagonal in 5 items; 5.2 "one angle is 90 so the rest are 90" in 7 of 20; 5.1 "two VO angles together S, halve, subtract" in #5, #8, #13, #15; 5.5 "corresponding then linear pair" in 5.
- Claim-check "Yes" items with no trap: 5.5 #14, 5.7 #17.

## LOW
- 16 items carry the `figure` tag; about 8 more use the E/F layout or an l/m numbering without it (5.5 #5, #12; 5.6 #1, #3, #20, #21; 5.7 #4, #19).
- Wording: 5.3 #3 ("at line l"), 5.3 #18, 5.4 #13 ("both on the left"), 5.5 #20 key "Design A: Design B ...", 5.7 #6 row IV, 5.4 #6 key is a bare "4", 5.2 #1 distractors 25 and 55 untraced.
- Name P and Q mean different things in 5.4 (crossing points) and 5.5-5.7 (ends of the transversal).

## Counts read
- Questions read: 164 of 164, every numeric key recomputed (python for 5.1 #7 and #20, 5.1 #3/#14, mental or inline for the rest), every angle item re-drawn from the layout.
- Types: mcq 40, short_answer 64, long_answer 32 (16 case studies), fill_blank 8, multi_statement 8, assertion_reason 8, match 4. Marks: 1m 68, 2m 40, 3m 24, 4m 16, 5m 16. Step marks: every step list sums to its item's marks (script). No answer or step names an option by position (script).
- Bloom: Analyse 73, Apply 50, Evaluate 31, Understand 8 (4.9 percent), Create 2; Analyse/Evaluate/Create 106 of 164 = 64.6 percent (floor 30). Many Analyse labels sit on two-step Apply work (5.4 #4, 5.7 #3 style), so the share is generous.
- Per-chapter minimums: match 4 (needs 4), fill_blank 8, true_false 8: met. fill_blank answers all one number (115, 90, 125, 4, 110, 105, 102, 32), each application-level in form, each unambiguous after the reading of the stem.
- true_false verdicts: False 4 (5.1, 5.3, 5.4, 5.6), True 4 (5.2, 5.5, 5.7, 5.8) = 50 percent. False items hinge on real misconceptions; the True items (5.2 #12, 5.5 #10, 5.7 #14, 5.8 #9) are plain consequences, with 5.5 #10 the most useful (small gap but exact).
- claim_check (7): No 2 (5.3 Faiz, 5.8), Partly right 3 (5.2, 5.4, 5.6), Yes 2 (5.5, 5.7): mix is good (29/43/29 percent), but the two Yes items have no trap.
- multi_statement keys (8): "1 and 3 only" x2 (5.1, 5.8), "2 only", "1, 2 and 3", "2 and 3 only", "1 only", "1 and 2 only", "3 only": well spread; false statements spread over positions 1, 2, 3; one all-true (5.3).
- assertion_reason (8): R explains A 3 (5.2, 5.5, 5.6), R does not explain A 2 (5.1, 5.7), A true R false 2 (5.4, 5.8), A false R true 1 (5.3): balanced.
- Correct MCQ option strictly longest: 6 of 40 (15 percent); tied for longest 15 more; mean length ratio correct : distractors 0.99. Not a tell.
- Slot order: the last 12 slots are identical in all eight concepts ("ssssssssLLLL": eight short answers, then two 5-mark long answers or one 5-mark plus case studies in the same order, exactly 4 long items per concept). The first 8 to 9 slots vary (match at slots 6 to 9, fill_blank at 1 to 9, MS at 1 to 7), so the opening is varied but the tail is a template. Concepts hold 20 or 21 items; none holds three case studies or one 5-mark.
- Scope: nothing in OUT used. No wording "co-interior" or "supplement"; the book term "interior angles on the same side" is used throughout.

## Per-concept verdict
- C7M-5.1: pass after fixes (HIGH #20(d); easy #10, #12, #15).
- C7M-5.2: pass after fixes (HIGH #18(d); MEDIUM #8 second-answer risk; seven easy items).
- C7M-5.3: pass after fixes (no HIGH; #2 3-D, #17 forced, seven easy items).
- C7M-5.4: pass after fixes (HIGH #12(b); heavy "number of measures" repetition).
- C7M-5.5: pass after fixes (HIGH #4 impossible data; #8 arguable).
- C7M-5.6: pass after fixes (no HIGH; #20 recall, #21 scope edge).
- C7M-5.7: pass after fixes (no HIGH; five parallelogram items).
- C7M-5.8: pass after fixes (no HIGH; weakest on repetition and easy items).

## Overall verdict
Pass after fixes. The four v2 HIGHs are cured and the arithmetic of the 160 other items is sound, but the fix introduced four new HIGHs (two numbers in case studies, one ambiguous "single angle", one geometrically impossible stem), all small edits. The no-easy-items rule is not yet met (38 definite, 79 with borderline, of 164) and the closing 12 slots are still one template; a third pass should target 5.2, 5.3 and 5.8.
