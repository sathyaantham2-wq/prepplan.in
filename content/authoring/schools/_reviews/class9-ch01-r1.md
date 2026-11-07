VERDICT: FIX
HIGH: 0, MEDIUM: 5, LOW: 4

Every key, distance, midpoint, trisection point and case-study part was recomputed in Python; all 60 keys are correct and `--check` prints valid (60 questions; Easy 31, Hard 20, Hardest 9). The cited pages hold the facts. Claim-check verdicts (No, Yes, Partly, No), true/false verdicts (2 True, 2 False) and assertion-reason outcomes (all four used) are well mixed. FIX is due only to more than 3 MEDIUM findings.

- [MEDIUM] C9M-1.6 #1: same point pair (-4, 6) and (10, -2) and same answer (3, 2) as the existing pack's C9M-1.6 #4 (Chitra/Dev midpoint) -> use a new pair of endpoints and recompute the midpoint and distractors.
- [MEDIUM] C9M-1.6 #6: reuses the exact data of C9M-1.4 #1 in this pack ((-9, 12), distance 15 from O). It is also labelled Hard, but it is a single distance computation, the same step C9M-1.4 #1 calls Easy -> change the point (e.g. a non-3-4-5 multiple, or a point just inside or outside) and either relabel it Easy or add a second step.
- [MEDIUM] C9M-1.3 #4: labelled Hard/Apply, but it is the same one-step "distance along a line parallel to the x-axis" as C9M-1.3 #2 (Easy), with only a wrong number in A -> relabel it Easy, or make A need a second step (e.g. an unknown coordinate) so that Hard is honest. As it stands, it also repeats #2's idea.
- [MEDIUM] C9M-1.6 #3: the key, "R is not the correct explanation", rests on the subtle point that SM = MT alone does not make M the midpoint (collinearity is also needed). The answer gives no reason, and a school marker could defend "R explains A", so a second answer is arguable -> state the reason in the answer, or rewrite R so that it is clearly true but irrelevant (or clearly the explanation).
- [MEDIUM] C9M-1.4 #5 and #8: the same task and number set in one concept (two points, shifts 6 and 8, distance 10). The 6-8-10 triangle also recurs in C9M-1.4 #3, C9M-1.5 #9 and C9M-1.6 #9 -> give #8 different shifts (e.g. 5 and 12, or a non-integer root), and vary the triple elsewhere.
- [LOW] C9M-1.6 #7: back-solving a trisection point is a two-step item worth 3 marks. "Hardest" overstates it -> label Hard.
- [LOW] C9M-1.6 #2: Bloom is Understand, but the item needs a computation (25 + 144 = 169) -> Bloom Apply.
- [LOW] C9M-1.5 #4: statement III (reflecting in x and then in y gives (-a, -b)) is the same idea as the existing C9M-1.5 #1 (the kite reflected twice) -> replace it with a different true or false statement about reflection.
- [LOW] C9M-1.6 #10: in answer (c), "equal sides and a right angle (equal diagonals)" mixes two reasons in a parenthesis -> state one clean reason (a rhombus with a right angle, or equal sides with equal diagonals).
