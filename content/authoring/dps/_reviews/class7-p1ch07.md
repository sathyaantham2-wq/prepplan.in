# Review: Class 7 Maths Part I ch 7 (A Tale of Three Intersecting Lines), `content/authoring/dps/class7/p1ch07.json`

Read: all 141 questions (7 concepts: 7.1=20, 7.2=21, 7.3=20, 7.4=20, 7.5=20, 7.6=20, 7.7=20). No sampling.
Every key recomputed independently (triangle inequality, angle sums, exterior angles, costs, times, perimeters in code or by hand). Result: 0 wrong keys, 0 arithmetic errors. All 12 case studies were checked part by part; the data is consistent and every part's key is right. The numbers in 7.7 #19 (largest angles 60/102/83/90/73) were checked with the cosine rule and are consistent with the side lengths.
Scope: nothing quotes a `scope_out` item (no congruence, Pythagoras, larger-angle-opposite-longer-side, centres). Level mix: Remember+Understand 29%, Analyse/Evaluate/Create 32%, so within the section 10 limits. Settings are Indian and names are varied.

## HIGH (1)

1. **C7M-7.1 #7 (assertion_reason).** A: "both arcs have a radius equal to AB". R: "The crossing point C lies on both arcs, so its distance from A and from B equals the two radii." Keyed "R is the correct explanation".
   R explains why AC and BC equal the arc radii. It does not explain why those radii equal AB, which is what A states. "Both true, R not the correct explanation" is defensible, so there are two defensible options.
   Fix: change R to the chain that explains A, for example "Only then are all three sides AB, AC and BC equal, which an equilateral triangle needs." Or keep R and re-key it as "true but not the explanation".

## MEDIUM (9)

2. **C7M-7.2 #21 (case study) part (d).** The key itself says "either is defensible if the reason is stated" (Layout 2 at Rs 630, Layout 3 at Rs 595). The question asks "which should they choose", so it has no single answer. Layout 1 is also over budget (21 x 35 = Rs 735), but nothing asks about that.
   Fix: add a real constraint that decides it, such as "the club wants the rope to form an isosceles (symmetric) frame" or "the least cost", and make (d) turn on it.

3. **C7M-7.4 #12 (short_answer).** "Angle A is 55 and the line from B is drawn parallel to the other arm from A... smallest angle B for which no triangle exists." The figure is not described in words: which side the angle B is measured on, and that the base AB is common to both angles. A student cannot rebuild the figure.
   Fix: "On a base AB, angle A = 55 and the line from B makes angle B with AB on the same side as the line from A..."

4. **C7M-7.5 #13 (short_answer).** "A line XY through A parallel to BC... which angles at A equal angle B and angle C" depends on which end of XY is X, and the item does not say. The key assumes X is on B's side.
   Fix: "X lies on the same side as B and Y on the same side as C".

5. **Items lifted from the textbook with the book's own numbers** (CLAUDE.md and section 1 say "change the numbers or the setting"):
   - 7.6 #17: TRY with RY = 4, TR = 7, angle R = 140 and the altitude from T (verbatim Figure it Out 2).
   - 7.6 #18: BC = 5, AB = 6, CA = 5 and the altitude from A (verbatim Figure it Out 1).
   - 7.6 #13: "Construct a right-angled triangle with angle B = 90 and AC = 5 cm. How many different triangles?" (verbatim Figure it Out 3).
   - 7.5 #8: the match uses the book's 36/72, 150/15 and 90/30 pairs.
   - 7.3 #18: the equilateral with 50, 50, 50 (verbatim book question).
   - 7.7 #18: the isosceles right and obtuse construction (book Figure it Out 4).
   - 7.2 #4: the "textbook's list" options (4,4,6 / 3,4,5 / 1,5,5 / 3.5 x 3) come straight from the book's Construct box.
   - 7.2 #13: 1, 5, 5 from the same box.
   Fix: change the numbers (for example 5/8/130, a different hypotenuse, a different set of three-side triples). Keep the move, not the figures.

6. **Near-duplicates inside the chapter (one grid cell each wasted):**
   - 7.2 #9 (mcq) and #12 (short): the same arcs, 6 and 3 cm on AB = 5, giving 5, 6, 3.
   - 7.3 #1 (mcq option 6, 7, 12) and #11: both test 6, 7, 12.
   - 7.4 #4, #8 and #18: three items on angle A = 40 with B = 140 (sum exactly 180, no triangle). Change the second and third to other angles.
   - 7.5 #10, #12 and #18: find the third angle, then the exterior angle, then check it equals the sum.
   - 7.6 #6, #7, #14 (plus #19(c)): all four ask "altitudes always inside? No, obtuse gives two outside". #11 and #19(b) both ask the right-triangle altitudes PQ and RQ.
   - 7.7 #12, #14 and #18(a): an isosceles right triangle three times.
   - 7.1 #11, #12 and #18: equal radii give equal sides, three times with a circle.
   Fix: keep one of each; replace the others with different moves (see Standards below).

7. **C7M-7.7 #8 (match).** Items 2 (4, 4, 6) and 3 (3, 4, 6) are in fact obtuse-angled (16 + 16 < 36 and 9 + 16 < 36), so "Obtuse-angled" is a true label for them too. The key is unique only because the matching is one-to-one. A careful student faces a true second label for items 2 and 3. Pythagoras is out of scope, so the student cannot sort this out.
   Fix: use sides that are acute, such as 4, 4, 5 (acute) and 4, 5, 6 (acute).

8. **Claim-check items are the same strawman in all seven concepts** (7.1 #14 Tara, 7.2 #15 Sana, 7.3 #14 Isha, 7.4 #14 Saanvi, 7.5 #14 Karan, 7.6 #14 Reena, 7.7 #14 Nisha). Each is "X says [absurd or absolute thing], do you agree?" and the answer is always No. Anti-template rule: no strawman, and some of these claims should be right in a limited case.
   Fix: make at least two true-but-limited claims. For example, "a triangle with sides 4, 4, 9 needs a compass" does not work, but "when two angles sum to less than 180 the length of the included side is irrelevant to whether a triangle exists" is right, and the reason is the point. Or make one case "right for some numbers, wrong for others".

9. **Weak decision parts in three case studies.** 7.3 #19 (d) ("should the school buy fencing with readings that fail the triangle inequality" is obviously no, and parts (a) and (b) are the same comparison twice), 7.6 #19 (d) and 7.6 #20 (d) (only one side or corner works). These are determinate, not trade-offs.
   Fix: give each a second consideration, such as cost versus accuracy, or a choice between two valid answers with the figures to decide.

10. **Case-study parts that are free or stem-only marks:**
    - 7.7 #19 (b): the largest angles are listed in the stem, so classifying by angles is a lookup.
    - 7.1 #19 (c) and 7.5 #20 (a): arithmetic from the stem (the 7.5 #20 (b) subtraction needs only 180).
    - 7.7 #20 (b): sums given.
    Fix: withhold the largest angle (say, give only sides and ask a student to use a stated 90/acute test) or move the chapter-needing step into (a).

## LOW (9)

11. 7.1 #15 is tagged `reverse` but is a plain construction write-up. Replace with a real reverse ("Here are the steps used... what triangle was made").
12. 7.4 #4 asks for the case where "no triangle exists" but is not marked `rev`; "no triangle" is the reversal word here. Add `"rev": true`.
13. 7.4 #1: two distractors (100+80 and 120+60) are the same mistake (sum exactly 180). Replace one with the sides 5, 6, 12 variant of the angle error, or an angle pair summing over 180.
14. 7.1 #1 option 4 ("angle ABC and angle CAB together") and 7.7 #2 option 4 ("one angle is less than 60") do not correspond to a real chapter confusion.
15. 7.2 #4 stem "taken from the textbook's list" refers to a list the student cannot see. Say "from the sets below".
16. 7.1 #11: "P, Q on the circle" can also make OPQ equilateral if PQ = 3. The key "isosceles" is safe, but state PQ is not 3 cm, or ask "at least which kind".
17. 7.6 #13 (infinitely many right triangles with a given hypotenuse) is a 7.7 type (classification by angles) idea in an altitudes concept; move or retag.
18. 7.5 #15 and 7.7 #15 use the same contradiction ("two big angles exceed 180"). Make one of them different (for example, exterior angle must exceed each opposite interior angle).
19. 7.2 #20 and 7.2 #21 (b)/(c) climb mostly in routine steps; (d) for #20 is deterministic. Acceptable, but weaker than 7.1 #20 or 7.5 #19.

## Templating verdict

Not templated in stem frames: settings, names, numbers and shapes vary (cost, compass limit, time, sails, plots, straws, cards). Partly templated in structure: every concept has the same seven slots in the same order (loader requirement) and every claim-check has one frame; case studies are mostly "(a) read/identify, (b) a name or recompute, (c) compute, (d) decide". Multi-statement keys vary (1 and 2 / 2 and 3 / 1 and 3 / 1 only / all three / 2 only / 3 only) and the false statement moves across 1, 2, 3 (7.5 has none false, acceptable). Assertion-reason spread is fine (2 "explains", 3 "not the explanation", one A true R false, one A false R true). Correct option is the longest in only one MCQ (7.4). Standard section 9 depth is reached on the case studies and 5-markers (they need the chapter and climb), but about a quarter of the 2-mark items are still recall or construction recitation.

## Per-concept verdicts

- C7M-7.1: keys all right; fix #7 (AR) and the near-duplicate circle items; case studies good.
- C7M-7.2: keys right; 7.2 #21 (d) has no single answer; #9/#12 duplicate; book numbers reused.
- C7M-7.3: keys right (all triangle inequality checks verified, 2 of 4 case studies are weak on the decision); #1/#11 duplicate.
- C7M-7.4: keys right; #12 incomplete figure; 40/140 used three times; #4 needs `rev`.
- C7M-7.5: keys right; #13 side of X unstated; #10/#12/#18 overlap; case studies good (7.5 #19 is the best decision item in the chapter).
- C7M-7.6: keys right; heavy repetition of "altitudes may be outside"; two lifted book items; decisions determinate.
- C7M-7.7: keys right; match #8 has a true second label; isosceles-right repeated; #19 and #20 sound.

## Count

Read 141 of 141. HIGH 1. MEDIUM 9. LOW 9.
