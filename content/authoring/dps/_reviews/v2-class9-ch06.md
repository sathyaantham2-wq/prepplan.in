# Review v2: class9 ch06 (Measuring Space: Perimeter and Area), first independent review

File: content/authoring/dps/class9/ch06.json. Source iemh106 (pages 001-037 checked for every fact claim). Loader `--check`: 6 concepts, 131 questions, valid.

Method: every numeric key (all MCQ, fill_blank, match, multi_statement, assertion_reason, and every short/long/case-study part) recomputed in Python before reading the key. Statement truth values and AR outcomes derived from the book text, then compared.

Counts read: 131 (22+22+22+21+22+22). Wrong keys: 0. Questions with a second defensible answer: 1 (6.2#19a). 

Verdict: PASS. HIGH 0, MEDIUM 4, LOW 9.

## HIGH
None.

## MEDIUM

1. 6.3 track stagger repeated six times. 6.3#2, #12, #13, #17, #18 and #21 all test the 1.22 m / 0.3 m lane stagger (2 pi x lane width = 7.67 m). #2 and #17 are the same computation (7.67 m extra for lane 2). Keep #12 (concept), #18 (new lane width) and #21 (case study); replace #2/#17/#13 with other arc or composite-perimeter ideas (e.g. an arch, a sector-shaped flower bed, a rounded rectangle).
2. 6.2 over-weights two ideas. Madhava partial sums appear in #3, #8, #16, #17, #21 (five items); "error of an old pi value" in #1, #5, #11, #18, #20. Also 6.6 tests the Babylonian/Egyptian rules in #1, #2, #13, #18 (four). Cut to about two each. Related duplicate numbers: 6.6#5 (MCQ) and 6.6#14 (claim) are the same 90 degree, r = 10, 28.5 square cm; 6.4#8 and 6.5#2 are the same trapezium (32, 14, 15, 15, area 276).
3. 6.5#20 case study: the decision part is not a real trade-off. The stem says "A cyclic plot", so Brahmagupta already gives 1,764 square m with no survey (part a). The key's "Yes, pay the surveyor Rs 30,000" is therefore not forced; "No, the formula already settles it, the surveyor only confirms the seller's cyclic claim" is equally defensible. Fix: make the cyclic property the seller's unverified claim ("the seller says it is cyclic"), so the diagonal reading (which proves opposite right angles, hence cyclic) is what the fee buys.
4. 6.2#19(a) key rationale is self-contradictory: "250 BCE to 480 CE is 730 years (there is no year 0)". With no year 0 the gap is 729 years; 730 comes from simple addition. Either drop the parenthesis or state the convention in the stem ("treat BCE years as negative numbers and ignore the missing year 0"). Also this 5-mark item is mostly subtraction (a, b, c), easy-in-disguise for 5 marks. Part (b) is phrased "Before what year, at the earliest, was it still the best?" while the key says "until at least about 1280 CE"; reword the stem to "Until at least what year was it still the best?".

## LOW

1. 6.2#15 key text says 3.1416 "differs from pi in the sixth decimal"; pi = 3.141592.., they differ in the fifth decimal (the step line, "after the fourth decimal", is right). Fix the key sentence.
2. 6.2#20(d) "what should the council buy": any reader says 158 panels; the only trade-off is the Rs 2,350 for 16 cm. Mild. Consider adding a cost cap so that choice matters.
3. 6.2#21(d) and 6.1#19(d): the quoted opinion ("Madhava's series is useless", "all three ratios change") is a strawman. The key answers are sound; the verdict is easy.
4. 6.2#9 key "pi has no best fraction" goes a little beyond this book, which says only that no fraction with denominator under 15,000 beats 355/113. The statement is mathematically true; keep the reason to "irrational, so every fraction leaves a gap, a closer fraction exists".
5. 6.6#10 uses circumradius vs inradius of a regular polygon. The book states the inradius rule on p.028 (so in scope), but scope_out lists "area formulas using circumradius and inradius of a triangle". Not a violation (polygon, not triangle), noted so a later reader does not flag it.
6. 6.3#8 Column A "Quarter circle of radius 21 cm" with a length in Column B only works if read as the arc (33 cm); say "arc of a quarter circle of radius 21 cm".
7. 1-mark direct-formula items labelled Hard that are close to one step: 6.1#3, 6.1#4, 6.1#7, 6.4#2, 6.4#4, 6.4#7, 6.5#0, 6.5#4, 6.5#7, 6.6#8. They meet the "application in context" floor but are the easiest items in the file. Fine to keep a few; 6.1#3 (ratio of perimeters = ratio of diameters) is the weakest.
8. 6.1 wheel/tyre setting is used three times (#0, #9, #21).
9. 6.5#1 distractor "36 square cm, the area of a square of side 6" is not a real slip from this chapter; replace with e.g. the area got from s = 6 but forgetting the square root (36).

## Verified correct (spot list)

- Recomputed and matching: 6.1 all (including 137 turns in #21, 6 m and 7 m lace in #20); 6.2 Madhava 3.47, 3.3397, 10th term -1/19, 4,700 ratio, 158 panels, partial sums 2.8952 / 3.0418 / 3.1316 / 3.14285688 (791 terms, error 0.0012642 just below 22/7's 0.0012645, so "yes, it beats 22/7" holds); 6.3 22 cm, 72 cm, 7.67 m, 176 cm, 400.0 m lap, 415.33 m, 15.33 m, Rs 12,900 / Rs 11,571; 6.4 all (data in 6.4#19 are mutually consistent: AD = 88.32 from the sides, altitude 85 m from Heron); 6.5 84, 77.8, 276, 36, 62.35, 204, 54, 72.6, 60, 979.8, 1,764 and 1,792, Rs 42,840 / Rs 19,440; 6.6 205.3, 16.5 over, 256, 154, 9x, 28.5, 101 degrees (lawn 1,999.9 square m), pizza costs.
- multi_statement truth values and keys: 6.1 "1 only", 6.2 "1 and 2 only" (S3 false: root 10 is less accurate), 6.3 "1 and 3 only" (S2 false: two radii), 6.4 "2 and 3 only", 6.5 "3 only" (d = 0, not 1), 6.6 all three. Keys vary and the false statement hinges on a word.
- assertion_reason: 6.1 both true and explains; 6.2 both true and explains; 6.3 A false (pi r + 2r), R true; 6.4 both true, R does not explain; 6.5 A true, R false (only cyclic 4-gons); 6.6 both false. All four outcomes used.
- All book-fact claims found in iemh106: Mesopotamia 3 + 1/8 and the hexagon argument, Archimedes 250 BCE and the 3 10/71 to 3 1/7 bounds, Zu Chongzhi 480 CE and "over 800 years", Aryabhata asanna 499 CE, Brahmagupta root 10 and its later dominance, Madhava 11 places, Lambert 1761, Babylonian C^2/12, Egyptian (8/9 d)^2, Baudhayana squaring construction, track 84.39 / 36.5 / 1.22 / 0.3 data.
- No positional option references, no "as in the book", no figure-dependent items, no scope_out topics (no proofs of Heron/Brahmagupta, no irrationality proof, no solids). Claim-check mix: no 3, yes 3, partly 3 (good). True/False: 3 False, 3 True.
