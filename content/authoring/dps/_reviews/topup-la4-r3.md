# Round 3 re-review: Class 7 Maths 4-mark top-up items (dps_topup)

Method: every number recomputed in python (and by coordinate geometry for the figures); book pages
read under content/extracted/gegp1xx/pages; scope read from content/structure/class7-maths-*.json;
overlap checked against content/authoring/dps/class7/<ch>.json. Pack files were not edited.

## HIGH
None.

## MEDIUM

1. p2ch05-la4, C7M-5.7 (weights table). Stem: "A district health survey of 2020 gives the average
   weights (kg) of children." The numbers are invented, so this presents made-up data as an official
   statistic. Fix: reframe as "A school's record of average weights (kg)" (or "A class record").
   Nothing else in the item changes; the key is unaffected.

## LOW

1. p2ch05-la4, C7M-5.7 (b). "The gap between girls and boys widened at every step". Read as a signed
   gap (girls minus boys) it widens at the first step (-0.4 to 0.2); read as an absolute gap it
   narrows (0.4 to 0.2). The key's reason, "the gap grew up to age 12", fits only the signed reading.
   The verdict (not justified) is right on both readings. Fix: in the key add "(girls minus boys)", or
   accept either reading provided 2.5 to 2.0 between 12 and 13 is cited.
2. p2ch05-la4, C7M-5.7 (c). Combining two group means by weighting with group sizes is not an explicit
   exercise in the book. It follows from "average = total / number" (pp. 98-100), and the book itself asks
   "What is the average height of all Grade 6 boys and girls?" (p. 126). Within scope, so no change needed.
   The marker note could say "accept total = mean x number reasoning".
3. p2ch01-la4, C7M-1.3 (d). The key offers BC (SAS) or angle A (ASA). Angle C (AAS) is also a correct
   answer, and the book teaches AAS (p. 13 onward). Fix: add "angle C (AAS)" to the accepted answers so
   an AI marker does not reject it.
4. p2ch01-la4, C7M-1.3 (b) and (c) overlap heavily: (c) restates the conclusion of (b). Acceptable
   because (c) judges a claim, but part (a) is a one-line recall of SSA vs SAS.
5. p2ch01-la4, C7M-1.4. The sides 53 and 65 cm are given "to the nearest cm", yet the AAS lengths in (a)
   are used as exact. Harmless at this level. Optional fix: say "(given as exact)".
6. p1ch04-la4, C7M-4.3. The book never writes a two-digit number as 10t + u. Parts (b) to (d) build it
   from place value, which is an application of "write an expression for a word relationship" (scope IN,
   pp. 82-84), not scope_out. Parts (a) and the first half of (d) are close to recall of the p. 86-87
   convention, but the whole item climbs. Cited "p. 87" holds the "we write the number first" sentence and
   the 7k example, so it is acceptable (the section starts on p. 86).
7. p1ch05-la4, C7M-5.7 tile (d). The designer's claim is true, so the last part is a check and not a hard
   decision. Acceptable. Optional: make the designer's claim false (for example, the new tile "is a
   square") to add a genuine judgement.

## Item-by-item checks

### p2ch06-la4, C7M-6.4 (parallelogram ABDC) - PASS
- Geometry verified: A = 65. Angle ACD = 115 (co-interior on AB || CD, transversal m). Angle ABD = 115
  (co-interior on AC || BD, transversal l). D = 180 - 115 = 65 by either route. All parts agree.
- (d) now uses co-interior angles only; two genuinely different parallel pairs (AB || CD and AC || BD).
- Page "pp. 147-148" matches the printed pages (copying an angle to get a parallel, Figs 6.7-6.10).
  Scope line "pp.147-148, 155" is IN. The 65-degree angle is copied, not constructed from a measure, so the
  scope_out "exact given measure such as 65.5" is not violated. Co-interior angles are from Part I ch 5
  (prior knowledge, same grade).
- Steps 1+1+1+1 = 4, match parts (a) to (d). Usable by a marker. "d" Hard, as the concept.
- Not a repeat of the existing 6.4 items (those are stripe, canal, Neel, Student 1-3).

### p1ch05-la4, C7M-5.7 (two items) and C7M-5.8 - PASS
- Tile: 5a + 10 = 180, a = 34, angles 84 and 96. (b) QRS = 84 (PQ || SR, transversal QR), RSP = 96
  (PS || QR, transversal SR). (c) 5a - 5 = 180, a = 37, both angles 90. (d) the other two corners are
  also 90. Key, steps (1+1+1+1) and page "p. 122" are right. Hard.
- Strut: x = 20. NPQ = 110, PQR = 70, PRQ = 55. LPR = 125 (co-interior on transversal PR). LPQ = 70
  (linear pair). QPR = 55. A coordinate model (Q = (0,0), P = (0.364,1), R = (1.064,0), S = (1.428,1))
  confirms every angle, that S lies on l to the right of P, and that QRS = 110 means RS || PQ (corresponding
  70 = 70). It also shows triangle PQR has angles 55, 70, 55 (sum 180), so the figure exists. No triangle
  angle sum is needed (scope_out respected). Hardest is fair. Pages "pp. 121-122" right.
- Folded square: the model A = (0,0), B = (2,0), C = (2,2), D = (0,2), O = (1,1), M = (0.5,1.5) gives
  m: y = x + 1, which is parallel to AC. It meets DC at N = (1,2) and the angle DNM is 45 degrees. (d) 3
  parallel pairs (AB-DC, AD-BC, AC-m) and 6 perpendicular pairs (4 corners, AC-BD, m-BD) is exact, with no
  extra pairs. The book (p. 111) asks about a fold along the diagonal and a parallel fold, and p. 119
  teaches folding a perpendicular, so it is in scope. The 45-degree step is "the fold halves the 90-degree
  corner", which is not angle sum. Pages "pp. 111-119" are fine. Steps 4 = 4. Hard.
- No repeat of the existing 5.7 or 5.8 class7 items (those use plot ABCD angle B = D, gate bars, lattice
  and fold counts).

### p1ch04-la4, C7M-4.3 (tu vs 10t + u) - PASS
- tu = 4 x 7 = 28, 10t + u = 47, 10u + t = 74. 10t + u = 10u + t only when t = u (9t = 9u). The key is
  right and the condition is right. One defensible answer per part (u + 10t is the same expression).
- Steps 1+1+1+1 = 4. Marks match. No repeat of the existing 4.3 items. See LOW 6.

### p2ch05-la4, C7M-5.7 (weights table) - PASS, but fix the MEDIUM framing
- Recomputed: boys' gains 3.0, 3.2, 3.4, 4.4; girls' gains 3.6, 4.3, 4.6, 3.9. Gaps -0.4, 0.2, 1.3, 2.5, 2.0.
  Weighted mean (300 x 37.6 + 100 x 40.1) / 400 = 15290 / 400 = 38.225. Girls gained 16.4 kg and boys 14.0
  kg, so 2.4 kg more. All numbers in the key are right.
- Page "pp. 127-128" is right (table p. 127, "which two successive ages grew the most" p. 128).
- Steps 1+1+1+1 = 4. The existing 5.7 items use the book's height table; this uses a different variable
  and different questions (gap trend, weighted mean), so it is not a repeat. Some risk of a similar "justified?"
  pattern. See MEDIUM 1 and LOW 1-2.

### p2ch01-la4, C7M-1.3 (sign-maker) and C7M-1.4 (steel plates) - PASS
- 1.3: with AB = 8, angle B = 40 degrees, AC = 6.5, BC = 8 cos 40 plus or minus the square root of
  (6.5^2 - (8 sin 40)^2), which gives 2.15 and 10.10, so 2.2 and 10.1 cm. This is the book's two-intersection
  case (pp. 11-12, 6 / 4 / 30 degrees) with the same structure. No trigonometry is asked of the pupil; the
  lengths are given. (a) SSA and the included angle B are correct. (c) Rehan is wrong. (d) BC (SAS) and
  angle A (ASA) are valid. No SSA beyond the book's case. Steps 4 = 4, one per part.
- 1.4: C = 60. BC = 53.07 and CA = 65.10 (law of sines, only to check the given figures). With X = A and
  Y = B: ASA gives XY = 60; AAS gives YZ = 53 or XZ = 65. Plate 2: K = B (70), KL = BA = 60, so L = A and
  the angle L must be 50, ASA, written LKM = ABC (K is B, L is A, M is C), consistent. Plate 3: F = 70, so
  D = C, E = A, F = B. DF = 53 = CB (opposite 50), so AAS holds with DEF = CAB, and EF = AB = 60, not 65. Key
  and claim-check verdict are correct. Steps are 2 for (a) and 1 each for (b) and (c) = 4. Page "pp. 12-16" is
  right (ASA/AAS), "pp. 10-12" right for 1.3 (SSA).
- Neither repeats an existing class7/p2ch01 item (those use midpoint figures, rangoli sheets, flower beds,
  Rina's T1-T3, roof frames and plots). Some thematic closeness to the existing SSA "compare two
  constructions" item, but the stem and parts differ.

## Verdicts (per chapter)

- p2ch06 (C7M-6.4): PASS
- p1ch05 (C7M-5.7 x2, C7M-5.8): PASS
- p1ch04 (C7M-4.3): PASS
- p2ch05 (C7M-5.7): PASS, with one required MEDIUM framing fix ("a school's record") before loading
- p2ch01 (C7M-1.3, C7M-1.4): PASS

Counts: 8 items read. HIGH 0, MEDIUM 1, LOW 7. No wrong key, no second defensible answer, no
out-of-scope content. All "p" values verified against printed pages. All "d" values are Hard or Hardest.
